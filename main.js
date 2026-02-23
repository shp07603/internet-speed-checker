const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);

// ── UI ──
function setStatus(msg, state) {
  $('statusText').textContent = msg;
  $('statusDot').className = 'status-dot ' + (state || '');
}
function setProgress(label, pct) {
  $('progressWrap').style.display = 'block';
  $('progressLabel').textContent = label;
  $('progressPct').textContent = Math.round(pct) + '%';
  $('progressFill').style.width = Math.min(pct, 100) + '%';
}
function setCard(id, val, sub, state) {
  $('card-' + id).className = 'card ' + (state || '');
  $('val-' + id).textContent = val;
  if (sub != null) $('sub-' + id).textContent = sub;
}
function setGauge(val, max, label, color) {
  const offset = 565 - (565 - 141) * Math.min(val / max, 1);
  $('gaugeFill').style.strokeDashoffset = offset;
  $('gaugeFill').style.stroke = color || 'var(--accent)';
  $('gaugeVal').textContent = typeof val === 'number' && val % 1 ? val.toFixed(1) : val;
  $('gaugeLabel').textContent = label;
}

// ── Ping chart ──
const history = [];
function addBar(ms, lost) {
  history.push({ ms, lost });
  if (history.length > 30) history.shift();
  const chart = $('pingChart');
  const maxMs = Math.max(...history.map(p => p.ms || 0), 200);
  chart.innerHTML = history.map(p => {
    if (p.lost) return `<div class="ping-bar lost" title="손실" style="height:100%"></div>`;
    const h = Math.max(4, (p.ms / maxMs) * 100);
    const c = p.ms > 200 ? 'bad' : p.ms > 80 ? 'warn' : '';
    return `<div class="ping-bar ${c}" title="${p.ms}ms" style="height:${h}%"></div>`;
  }).join('');
}

// ── Ping measurement (no-cors) ──
const TARGETS = [
  'https://www.google.com/generate_204',
  'https://one.one.one.one/cdn-cgi/trace',
  'https://www.cloudflare.com/cdn-cgi/trace',
  'https://httpbin.org/get',
  'https://www.bing.com/favicon.ico',
];

async function onePing(url) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 4000);
    const t0 = performance.now();
    await fetch(url + '?_=' + Date.now(), { mode:'no-cors', cache:'no-store', signal:ac.signal });
    clearTimeout(t);
    return Math.round(performance.now() - t0);
  } catch { return null; }
}

async function runPing() {
  const N = 20;
  setStatus('📡 핑 측정 중...', 'running');
  setCard('ping', '측정 중', null, 'active');
  const ok = []; let lost = 0;
  for (let i = 0; i < N; i++) {
    const ms = await onePing(TARGETS[i % TARGETS.length]);
    if (!ms || ms > 3000) { lost++; addBar(0, true); }
    else {
      ok.push(ms); addBar(ms, false);
      setCard('ping', Math.round(ok.reduce((a,b)=>a+b,0)/ok.length), 'ms (측정 중)', 'active');
    }
    setProgress('핑 측정 ' + (i+1) + '/' + N, (i+1)/N*35);
    await sleep(120);
  }
  const avg = ok.length ? Math.round(ok.reduce((a,b)=>a+b,0)/ok.length) : null;
  const jitter = ok.length > 1
    ? Math.round(ok.slice(1).reduce((s,v,i)=>s+Math.abs(v-ok[i]),0)/(ok.length-1)) : 0;
  return { ping: avg, jitter, loss: Math.round(lost/N*100) };
}

// ── Download ──
async function dlCF(bytes) {
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 20000);
  const t0 = performance.now();
  const res = await fetch('https://speed.cloudflare.com/__down?bytes='+bytes+'&t='+Date.now(),
    { cache:'no-store', signal:ac.signal });
  const buf = await res.arrayBuffer();
  return buf.byteLength * 8 / ((performance.now()-t0)/1000) / 1e6;
}

const IMG_LIST = [
  { url:'https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg', size:1527000 },
  { url:'https://upload.wikimedia.org/wikipedia/commons/3/3f/Bikesgray.jpg', size:3019000 },
];
function dlImg(url, size) {
  return new Promise(res => {
    const img = new Image();
    const t0 = performance.now();
    const to = setTimeout(() => res(null), 12000);
    img.onload = () => { clearTimeout(to); res(size*8/((performance.now()-t0)/1000)/1e6); };
    img.onerror = () => { clearTimeout(to); res(null); };
    img.src = url + '?t=' + Date.now();
  });
}

async function runDownload() {
  setStatus('⬇️ 다운로드 속도 측정 중...', 'running');
  setCard('dl', '측정 중', null, 'active');
  const speeds = [];
  const sizes = [2e6, 5e6, 10e6];
  for (let i = 0; i < sizes.length; i++) {
    try {
      const mbps = await dlCF(sizes[i]);
      if (mbps > 0 && mbps < 10000) {
        speeds.push(mbps);
        setGauge(mbps.toFixed(1), 200, '다운로드 Mbps', 'var(--accent)');
        setCard('dl', mbps.toFixed(1), 'Mbps (측정 중)', 'active');
      }
    } catch(e) {}
    setProgress('다운로드 측정 '+(i+1)+'/3', 35+(i+1)/3*25);
  }
  // Fallback: image
  if (!speeds.length) {
    for (const { url, size } of IMG_LIST) {
      try {
        const mbps = await dlImg(url, size);
        if (mbps && mbps > 0 && mbps < 10000) {
          speeds.push(mbps);
          setGauge(mbps.toFixed(1), 200, '다운로드 Mbps', 'var(--accent)');
          setCard('dl', mbps.toFixed(1), 'Mbps', 'active');
        }
      } catch(e) {}
    }
  }
  if (!speeds.length) return null;
  speeds.sort((a,b)=>a-b);
  return +speeds[Math.floor(speeds.length/2)].toFixed(2);
}

// ── Upload ──
async function runUpload() {
  setStatus('⬆️ 업로드 속도 측정 중...', 'running');
  setCard('ul', '측정 중', null, 'active');
  const speeds = [];
  const SZ = 2e6;
  // Use a string for body to be safer with simple requests in no-cors, though not strictly required
  const body = 'a'.repeat(SZ); 
  
  for (let i=0;i<3;i++) {
    try {
      const ac = new AbortController();
      setTimeout(()=>ac.abort(),20000);
      const t0 = performance.now();
      // mode: 'no-cors' allows sending data without reading response (opaque)
      // Removing Content-Type header to avoid preflight if possible (or let browser handle it)
      await fetch('https://speed.cloudflare.com/__up?t='+Date.now(), {
        method:'POST', 
        body: body, 
        mode: 'no-cors',
        cache:'no-store', 
        signal:ac.signal
      });
      const mbps = SZ*8/((performance.now()-t0)/1000)/1e6;
      if (mbps>0&&mbps<10000) {
        speeds.push(mbps);
        setGauge(mbps.toFixed(1),100,'업로드 Mbps','var(--accent2)');
        setCard('ul',mbps.toFixed(1),'Mbps (측정 중)','active');
      }
    } catch(e) {}
    setProgress('업로드 측정 '+(i+1)+'/3', 60+(i+1)/3*28);
    await sleep(300);
  }
  if (!speeds.length) return null;
  speeds.sort((a,b)=>a-b);
  return +speeds[Math.floor(speeds.length/2)].toFixed(2);
}

// ── Score ──
function stability(ping, jitter, loss) {
  let s = 100;
  if (ping>300) s-=30; else if(ping>150) s-=15; else if(ping>80) s-=5;
  if (jitter>50) s-=25; else if(jitter>20) s-=12; else if(jitter>10) s-=5;
  s -= loss*3;
  return Math.max(0, Math.min(100, s));
}
function grade(dl, ping, stab) {
  let p = 0;
  const d = dl||0;
  if(d>=100) p+=40; else if(d>=50) p+=32; else if(d>=25) p+=24; else if(d>=10) p+=16; else p+=8;
  if(ping<=20) p+=30; else if(ping<=50) p+=24; else if(ping<=100) p+=18; else if(ping<=200) p+=12; else p+=4;
  p += stab*0.3;
  return p>=85?'A':p>=70?'B':p>=50?'C':p>=30?'D':'F';
}
const TITLES = {
  A: '🚀 우주급 속도',
  B: '⚡ 한국인 평균',
  C: '🚲 따릉이 모드',
  D: '🐌 민달팽이',
  F: '🗿 빗살무늬 토기',
};
const DESC = {
  A:'이더넷 케이블이 금으로 되어있나요? 판교 서버실급 속도입니다.',
  B:'아주 쾌적합니다. 게임하다 렉 걸리면 100% 본인 실력 탓입니다.',
  C:'유튜브 1080p는 돌아가지만, 4K는 기도하면서 봐야 합니다.',
  D:'답답하시죠? 인내심을 기르거나 통신사에 전화해서 따지세요.',
  F:'혹시 신호를 연기로 보내고 계신가요? 비둘기가 더 빠를 것 같습니다.',
};
function tips(dl, ul, ping, jitter, loss) {
  const t = [];
  if (loss>5) t.push('💨 데이터가 줄줄 새고 있어요. 랜선을 꽉 묶어보세요 (농담입니다).');
  if (jitter>30) t.push('〰️ 연결이 술 취한 것처럼 흔들립니다. 공유기 좀 쉬게 해주세요.');
  if (ping>100) t.push('⚡ 반응속도가 거북이입니다. 해외 서버 게임은 포기하세요.');
  if (dl&&dl<10) t.push('⬇️ 속도가 처참합니다. 혹시 옆집에서 와이파이 훔쳐 쓰나요?');
  if (ul&&dl&&ul<dl*0.08) t.push('⬆️ 업로드 속도가 왜 이래? 방송 켜면 바로 튕깁니다.');
  if (!t.length) t.push('✅ 완벽합니다! 이 컴퓨터로 뭘 하든 당신의 자유입니다.');
  return t;
}

// ── Main ──
let running = false;
async function startTest() {
  if (running) return;
  running = true;
  $('startBtn').disabled = true;
  $('resultBox').className = 'result-box';
  $('errorNote').className = 'error-note';
  history.length = 0; $('pingChart').innerHTML = '';
  ['dl','ul','ping','jitter','loss','stability'].forEach(id=>setCard(id,'—',null,''));
  $('gaugeFill').style.strokeDashoffset = 565;
  $('gaugeVal').textContent = '—'; $('gaugeLabel').textContent = '측정 중';
  setProgress('준비 중...', 0);

  let anyError = false;

  // 1. Ping
  const { ping, jitter, loss } = await runPing();
  const pingOk = ping !== null;
  if (!pingOk) anyError = true;
  setCard('ping', pingOk ? ping : '실패', 'ms · 낮을수록 빠릿함',
    !pingOk ? 'bad' : ping>200?'bad':ping>80?'warn':'done');
  setCard('jitter', pingOk ? jitter : '실패', 'ms · 낮을수록 안정적',
    !pingOk ? 'bad' : jitter>30?'warn':'done');
  setCard('loss', loss+'%', '% · 낮을수록 좋음', loss>5?'bad':loss>1?'warn':'done');

  // 2. Download
  const dl = await runDownload();
  if (dl) {
    setCard('dl', dl.toFixed(2), 'Mbps', dl>=25?'done':dl>=5?'warn':'bad');
    setGauge(dl.toFixed(1), 200, '다운로드 Mbps', 'var(--accent)');
  } else {
    setCard('dl', '측정불가', 'CORS 차단됨', 'bad');
    anyError = true;
  }

  // 3. Upload
  const ul = await runUpload();
  if (ul) {
    setCard('ul', ul.toFixed(2), 'Mbps', ul>=5?'done':ul>=1?'warn':'bad');
  } else {
    setCard('ul', '측정불가', 'CORS 차단됨', 'bad');
    anyError = true;
  }

  // 4. Stability
  const stab = stability(ping||999, jitter, loss);
  setCard('stability', stab, '/ 100점', stab>=80?'done':stab>=50?'warn':'bad');

  // 5. Result
  const g = grade(dl, ping||999, stab);
  $('resultGrade').textContent = TITLES[g];
  $('resultGrade').className = 'result-grade ' + g;
  $('resultDesc').textContent = DESC[g];
  $('resultTips').innerHTML = '<ul>' + tips(dl,ul,ping||999,jitter,loss).map(t=>`<li>${t}</li>`).join('') + '</ul>';
  $('resultBox').className = 'result-box show';

  if (dl) setGauge(dl.toFixed(1), 200, '다운로드 최종',
    g==='A'?'var(--accent3)':g==='B'?'var(--accent)':'var(--warn)');

  setProgress('✅ 완료!', 100);
  setStatus(anyError
    ? '⚠️ 일부 항목 측정 불가 (CORS 차단) — 핑·안정성 결과는 유효합니다'
    : '✅ 모든 측정 완료! 아래 결과를 확인하세요', anyError?'error':'done');
  if (anyError) $('errorNote').className = 'error-note show';

  running = false;
  $('startBtn').disabled = false;
  $('startBtn').textContent = '↺ 다시 테스트';
}
