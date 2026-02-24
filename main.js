const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);

// ── History & IP ──
let currentIP = 'Unknown';
async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    currentIP = data.ip;
    $('network-provider').textContent = 'IP: ' + currentIP;
    
    const infoRes = await fetch('https://ipapi.co/json/');
    const infoData = await infoRes.json();
    if (infoData.org) $('network-name').textContent = infoData.org;
    if (infoData.city && infoData.country_name) {
        $('server-location').textContent = infoData.city + ', ' + infoData.country_name;
    }
  } catch(e) { 
      currentIP = 'Unknown'; 
      $('network-provider').textContent = '네트워크 연결됨';
      $('network-name').textContent = '인터넷 연결 감지됨';
      $('server-location').textContent = '서울, 대한민국';
  }
}

function loadHistory() {
  const data = JSON.parse(localStorage.getItem('netScoreHistory') || '[]');
  const tbody = $('historyBody');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-20 text-center text-slate-400">아직 기록이 없습니다.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(item => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td class="p-6 text-slate-500 font-medium">${item.date}</td>
      <td class="p-6 font-bold text-slate-900 dark:text-white">${item.dl} <span class="text-[10px] font-normal text-slate-400 uppercase">Mbps</span></td>
      <td class="p-6 font-bold text-slate-900 dark:text-white">${item.ul} <span class="text-[10px] font-normal text-slate-400 uppercase">Mbps</span></td>
      <td class="p-6 font-bold text-slate-900 dark:text-white">${item.ping} <span class="text-[10px] font-normal text-slate-400 uppercase">ms</span></td>
      <td class="p-6 text-right">
        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${getGradeClass(item.grade)}">${item.grade}</span>
      </td>
    </tr>
  `).join('');
}

function getGradeClass(grade) {
    switch(grade) {
        case 'A': return 'bg-emerald-500/10 text-emerald-500';
        case 'B': return 'bg-blue-500/10 text-blue-500';
        case 'C': return 'bg-yellow-500/10 text-yellow-500';
        case 'D': return 'bg-orange-500/10 text-orange-500';
        default: return 'bg-red-500/10 text-red-500';
    }
}

function saveHistory(dl, ul, ping, grade) {
  const data = JSON.parse(localStorage.getItem('netScoreHistory') || '[]');
  const now = new Date();
  const dateStr = now.getFullYear() + '.' + (now.getMonth()+1).toString().padStart(2,'0') + '.' + now.getDate().toString().padStart(2,'0');
  
  data.unshift({
    date: dateStr,
    ip: currentIP,
    dl: dl ? dl.toFixed(1) : '-',
    ul: ul ? ul.toFixed(1) : '-',
    ping: ping ? ping : '-',
    grade: grade
  });
  if (data.length > 50) data.pop(); 
  localStorage.setItem('netScoreHistory', JSON.stringify(data));
  loadHistory();
}

function clearHistory() {
  if(confirm('모든 측정 기록을 삭제하시겠습니까?')) {
    localStorage.removeItem('netScoreHistory');
    loadHistory();
  }
}

// ── UI ──
function setStatus(msg, state) {
  $('statusText').textContent = msg;
  const dot = $('statusDot');
  dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ';
  
  if (state === 'running') {
      dot.classList.add('bg-primary', 'animate-pulse');
  } else if (state === 'done') {
      dot.classList.add('bg-emerald-500');
  } else if (state === 'error') {
      dot.classList.add('bg-red-500');
  } else {
      dot.classList.add('bg-slate-400');
  }
}

function setProgress(label, pct) {
  const wrap = $('progressWrap');
  if (wrap) {
    wrap.classList.remove('hidden');
    $('progressFill').style.width = Math.min(pct, 100) + '%';
    if (pct >= 100) {
        setTimeout(() => wrap.classList.add('hidden'), 1000);
    }
  }
}

function setCard(id, val, sub, state) {
  const card = $('card-' + id);
  const valEl = $('val-' + id);
  if (!card || !valEl) return;
  
  valEl.textContent = val;
  card.classList.remove('border-primary', 'bg-primary/5', 'border-emerald-500/30', 'bg-emerald-500/5', 'border-red-500/30', 'bg-red-500/5');
  
  if (state === 'active') {
      card.classList.add('border-primary', 'bg-primary/5');
  } else if (state === 'done') {
      card.classList.add('border-emerald-500/30', 'bg-emerald-500/5');
  } else if (state === 'bad') {
      card.classList.add('border-red-500/30', 'bg-red-500/5');
  }
}

function setGauge(val, max, label) {
  const pct = Math.min((val / max), 1);
  const fill = $('gaugeFill');
  fill.style.transform = `scaleY(${pct})`;
  
  $('gaugeVal').textContent = (typeof val === 'number' && val % 1) ? val.toFixed(1) : val;
  $('gaugeLabel').textContent = label;
}

// ── Effects ──
let animFrame;
function stopEffect() {
  if (animFrame) cancelAnimationFrame(animFrame);
  const cvs = $('effectCanvas');
  const ctx = cvs.getContext('2d');
  ctx.clearRect(0,0,cvs.width,cvs.height);
}
function playConfetti() {
  stopEffect();
  const cvs = $('effectCanvas');
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  const particles = [];
  const colors = ['#137fec','#ff6b35','#10b981','#f59e0b','#ffffff'];
  for(let i=0; i<150; i++) {
    particles.push({
      x: cvs.width/2, y: cvs.height/2,
      vx: (Math.random()-0.5)*20, vy: (Math.random()-0.5)*20 - 5,
      c: colors[Math.floor(Math.random()*colors.length)],
      s: Math.random()*8+4, r: Math.random()*360, dr: (Math.random()-0.5)*10
    });
  }
  function loop() {
    ctx.clearRect(0,0,cvs.width,cvs.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.r += p.dr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r * Math.PI/180);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s); ctx.restore();
    });
    particles.forEach(p => { if(p.y > cvs.height) { p.y = -20; p.x = Math.random()*cvs.width; p.vy = Math.random()*5+2; } });
    animFrame = requestAnimationFrame(loop);
  }
  loop();
}

function playRain() {
  stopEffect();
  const cvs = $('effectCanvas');
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  const drops = [];
  for(let i=0; i<100; i++) { drops.push({ x: Math.random()*cvs.width, y: Math.random()*cvs.height, l: Math.random()*20+10, v: Math.random()*10+15 }); }
  function loop() {
    ctx.fillStyle = 'rgba(10, 15, 22, 0.1)'; ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.strokeStyle = 'rgba(100,120,150,0.5)'; ctx.lineWidth = 2; ctx.beginPath();
    drops.forEach(d => { ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y+d.l); d.y += d.v; if(d.y > cvs.height) { d.y = -d.l; d.x = Math.random()*cvs.width; } });
    ctx.stroke(); animFrame = requestAnimationFrame(loop);
  }
  loop();
}

function showModal(grade) {
  const overlay = $('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);
  $('resultBox').classList.remove('scale-95');
  if (grade === 'A' || grade === 'B') playConfetti();
  else if (grade === 'D' || grade === 'F') playRain();
}

function closeModal() {
  const overlay = $('modalOverlay');
  overlay.classList.add('opacity-0');
  $('resultBox').classList.add('scale-95');
  setTimeout(() => { overlay.classList.add('hidden'); stopEffect(); }, 300);
}

// ── Measurement Logic ──
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
  const N = 15;
  setStatus('📡 지연 시간 측정 중...', 'running');
  setCard('ping', '...', null, 'active');
  const ok = []; let lost = 0;
  for (let i = 0; i < N; i++) {
    const ms = await onePing(TARGETS[i % TARGETS.length]);
    if (!ms || ms > 3000) { lost++; }
    else { ok.push(ms); setCard('ping', Math.round(ok.reduce((a,b)=>a+b,0)/ok.length), 'ms', 'active'); }
    setProgress('PING', (i+1)/N*30);
    await sleep(100);
  }
  return { ping: ok.length ? Math.round(ok.reduce((a,b)=>a+b,0)/ok.length) : null, jitter: ok.length > 1 ? Math.round(ok.slice(1).reduce((s,v,i)=>s+Math.abs(v-ok[i]),0)/(ok.length-1)) : 0, loss: Math.round(lost/N*100) };
}

async function dlCF(bytes) {
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 15000);
  const t0 = performance.now();
  const res = await fetch('https://speed.cloudflare.com/__down?bytes='+bytes+'&t='+Date.now(), { cache:'no-store', signal:ac.signal });
  const buf = await res.arrayBuffer();
  return buf.byteLength * 8 / ((performance.now()-t0)/1000) / 1e6;
}

async function runDownload() {
  setStatus('⬇️ 다운로드 측정 중...', 'running');
  setCard('dl', '...', null, 'active');
  const speeds = [];
  const sizes = [1e6, 5e6, 10e6];
  for (let i = 0; i < sizes.length; i++) {
    try {
      const mbps = await dlCF(sizes[i]);
      if (mbps > 0 && mbps < 10000) { speeds.push(mbps); setGauge(mbps, 200, 'MBPS'); setCard('dl', mbps.toFixed(1), 'Mbps', 'active'); }
    } catch(e) {}
    setProgress('DOWNLOAD', 30+(i+1)/3*35);
  }
  return speeds.length ? +speeds[Math.floor(speeds.length/2)].toFixed(2) : null;
}

async function runUpload() {
  setStatus('⬆️ 업로드 측정 중...', 'running');
  setCard('ul', '...', null, 'active');
  const speeds = [];
  const SZ = 1e6;
  const body = 'a'.repeat(SZ); 
  for (let i=0;i<3;i++) {
    try {
      const ac = new AbortController();
      setTimeout(()=>ac.abort(),15000);
      const t0 = performance.now();
      await fetch('https://speed.cloudflare.com/__up?t='+Date.now(), { method:'POST', body: body, mode: 'no-cors', cache:'no-store', signal:ac.signal });
      const mbps = SZ*8/((performance.now()-t0)/1000)/1e6;
      if (mbps>0&&mbps<10000) { speeds.push(mbps); setGauge(mbps, 100, 'MBPS'); setCard('ul',mbps.toFixed(1), 'Mbps', 'active'); }
    } catch(e) {}
    setProgress('UPLOAD', 65+(i+1)/3*35);
    await sleep(200);
  }
  return speeds.length ? +speeds[Math.floor(speeds.length/2)].toFixed(2) : null;
}

function stability(ping, jitter, loss) {
  let s = 100;
  if (ping>300) s-=30; else if(ping>150) s-=15; else if(ping>80) s-=5;
  if (jitter>50) s-=25; else if(jitter>20) s-=12; else if(jitter>10) s-=5;
  s -= loss*3;
  return Math.max(0, Math.min(100, s));
}

function grade(dl, ping, stab) {
  let p = 0; const d = dl||0;
  if(d>=100) p+=40; else if(d>=50) p+=32; else if(d>=25) p+=24; else if(d>=10) p+=16; else p+=8;
  if(ping<=20) p+=30; else if(ping<=50) p+=24; else if(ping<=100) p+=18; else if(ping<=200) p+=12; else p+=4;
  p += stab*0.3;
  return p>=85?'A':p>=70?'B':p>=50?'C':p>=30?'D':'F';
}

const TITLES = { A: '🚀 우주급 속도', B: '⚡ 한국인 평균', C: '🚲 따릉이 모드', D: '🐌 민달팽이', F: '🗿 빗살무늬 토기' };
const DESC = { A:'이더넷 케이블이 금으로 되어있나요? 판교 서버실급 속도입니다.', B:'아주 쾌적합니다. 게임하다 렉 걸리면 100% 본인 실력 탓입니다.', C:'유튜브 1080p는 돌아가지만, 4K는 기도하면서 봐야 합니다.', D:'답답하시죠? 인내심을 기르거나 통신사에 전화해서 따지세요.', F:'혹시 신호를 연기로 보내고 계신가요? 비둘기가 더 빠를 것 같습니다.' };
function tips(dl, ul, ping, jitter, loss) {
  const t = [];
  if (loss>5) t.push('💨 데이터 손실이 감지되었습니다.');
  if (jitter>30) t.push('〰️ 연결이 불안정하여 지터가 높습니다.');
  if (ping>100) t.push('⚡ 반응속도가 느려 게이밍에 부적합할 수 있습니다.');
  if (dl&&dl<10) t.push('⬇️ 다운로드 속도가 낮습니다.');
  if (!t.length) t.push('✅ 완벽합니다! 현재 네트워크 상태가 매우 좋습니다.');
  return t;
}

async function startTest() {
  if (running) return;
  running = true;
  $('startBtn').disabled = true;
  ['dl','ul','ping','jitter','loss','stability'].forEach(id=>setCard(id,'—',null,''));
  $('gaugeFill').style.transform = 'scaleY(0)';
  $('gaugeVal').textContent = '...'; $('gaugeLabel').textContent = '측정 중';
  
  const { ping, jitter, loss } = await runPing();
  setCard('ping', ping || '실패', null, ping? (ping>100?'warn':'done') : 'bad');
  setCard('jitter', jitter, null, jitter>30?'warn':'done');
  setCard('loss', loss+'%', null, loss>5?'bad':'done');

  const dl = await runDownload();
  setCard('dl', dl ? dl.toFixed(1) : '실패', null, dl ? (dl>25?'done':'warn') : 'bad');

  const ul = await runUpload();
  setCard('ul', ul ? ul.toFixed(1) : '실패', null, ul ? (ul>10?'done':'warn') : 'bad');

  const stab = stability(ping||999, jitter, loss);
  setCard('stability', stab, null, stab>=80?'done':'warn');
  
  const g = grade(dl, ping||999, stab);
  $('resultGrade').textContent = g;
  $('resultTitle').textContent = TITLES[g];
  $('resultDesc').textContent = DESC[g];
  $('resultTips').innerHTML = '<ul class="space-y-1">' + tips(dl,ul,ping||999,jitter,loss).map(t=>`<li>${t}</li>`).join('') + '</ul>';
  
  showModal(g);
  saveHistory(dl, ul, ping, g);
  setGauge(dl || 0, 200, 'GRADE');
  $('gaugeVal').textContent = g;
  setStatus('측정 완료', 'done');
  running = false;
  $('startBtn').disabled = false;
}

getIP(); loadHistory();