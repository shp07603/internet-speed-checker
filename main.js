const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);

// ── i18n ──
const translations = {
    ko: {
        nav_about: "서비스 소개",
        nav_faq: "FAQ",
        nav_history: "기록",
        header_title: "인터넷 속도,<br><span class=\"text-primary\">숫자 그 이상을 보다.</span>",
        header_desc: "단순한 속도 측정을 넘어 연결의 안정성까지,<br class=\"hidden md:block\">당신의 네트워크가 가진 진짜 실력을 점수로 환산해 드립니다.",
        network_checking: "연결 상태 확인 중",
        network_analyzing: "IP 및 공급자 분석 중...",
        network_stability_label: "Network Stability",
        gauge_start: "START",
        dl_desc: "다운로드 속도 (초당 전송량)",
        ul_desc: "업로드 속도 (파일 전송 능력)",
        ping_desc: "응답 속도 (낮을수록 빠릿함)",
        jitter_label: "Jitter (지터)",
        jitter_desc: "<strong>\"연결 떨림\"</strong>: 속도가 술 취한 것처럼 출렁이는 정도입니다. 낮을수록 한결같이 안정적입니다.",
        loss_label: "Packet Loss (손실)",
        loss_desc: "<strong>\"데이터 씹힘\"</strong>: 가는 말이 고와야 오는데, 말이 도중에 씹히는 비율입니다. 0%가 완벽한 상태입니다.",
        stability_label: "Stability (안정성)",
        stability_desc: "<strong>\"종합 품질\"</strong>: 네트워크의 기초 체력입니다. 점수가 높을수록 갑작스러운 끊김 없이 든든합니다.",
        status_ready: "Ready to test",
        about_title: "왜 My Network Score인가요?",
        about_desc_1: "인터넷 속도는 단순히 숫자가 아닙니다. 온라인 게임의 승패를 가르는 <strong>0.1초의 반응속도</strong>, 4K 고화질 영상이 멈추지 않는 <strong>데이터의 흐름</strong>이 중요합니다.",
        about_desc_2: "우리는 단순 다운로드 속도를 넘어 <strong>지터(Jitter)</strong>와 <strong>패킷 손실(Packet Loss)</strong>을 정밀 분석하여 당신의 네트워크 품질을 종합 점수로 환산합니다.",
        about_table_title: "활동별 권장 속도",
        about_table_4k: "4K 스트리밍",
        about_table_gaming: "온라인 게이밍",
        about_table_meeting: "화상 회의 (HD)",
        about_table_file: "대용량 파일 전송",
        faq_title: "자주 묻는 질문 (FAQ)",
        faq_q1: "Jitter(지터)가 높으면 어떤 일이 발생하나요?",
        faq_a1: "지터가 높다는 것은 반응속도가 일정하지 않다는 뜻입니다. 게임 캐릭터가 갑자기 순간이동하거나, 화상 회의 중에 상대방의 목소리가 빨라졌다가 느려지는 현상의 주범입니다. 스트리밍 환경에서 매우 치명적입니다. 안정적인 연결을 위해 10ms 이하를 권장합니다.",
        faq_q2: "패킷 손실(Packet Loss)은 왜 0%여야 하나요?",
        faq_a2: "패킷 손실이 발생하면 데이터가 목적지에 도착하지 못하고 사라졌음을 의미합니다. 1%만 발생해도 웹페이지 로딩이 실패하거나, 온라인 결제 도중 오류가 날 수 있으며, 게임 중에는 심각한 끊김이 발생합니다.",
        history_title: "기록 히스토리",
        history_clear: "초기화",
        table_date: "측정 일시",
        table_dl: "다운로드",
        table_ul: "업로드",
        table_ping: "핑",
        table_grade: "최종 등급",
        history_empty: "데이터가 없습니다",
        footer_terms: "Terms",
        footer_privacy: "Privacy",
        footer_contact: "Contact",
        footer_updated: "최종 업데이트: 2026년 2월",
        modal_final_grade: "Final Grade",
        modal_close: "결과 닫기",
        
        // JS Dynamic Strings
        js_ip_prefix: "접속 IP: ",
        js_network_connected: "네트워크 연결됨",
        js_analyzing_isp: "인터넷 서비스 제공업체 분석 중",
        js_confirm_clear: "모든 측정 기록을 삭제하시겠습니까?",
        js_status_ping: "📡 지연 시간 분석 중...",
        js_status_dl: "⬇️ 다운로드 대역폭 측정 중...",
        js_status_ul: "⬆️ 업로드 데이터 전송 중...",
        js_status_done: "측정 완료",
        js_failed: "실패",
        js_analyzing: "분석 중",
        
        // Grade Titles & Descs
        grade_a_title: "🚀 우주급 속도",
        grade_a_desc: "이더넷 케이블이 금으로 되어있나요? 판교 서버실급 속도입니다.",
        grade_b_title: "⚡ 한국인 평균",
        grade_b_desc: "아주 쾌적합니다. 게임하다 렉 걸리면 100% 본인 실력 탓입니다.",
        grade_c_title: "🚲 따릉이 모드",
        grade_c_desc: "유튜브 1080p는 돌아가지만, 4K는 기도하면서 봐야 합니다.",
        grade_d_title: "🐌 민달팽이",
        grade_d_desc: "답답하시죠? 인내심을 기르거나 통신사에 전화해서 따지세요.",
        grade_f_title: "🗿 빗살무늬 토기",
        grade_f_desc: "혹시 신호를 연기로 보내고 계신가요? 비둘기가 더 빠를 것 같습니다.",
        
        // Tips
        tip_loss: "💨 데이터 손실이 감지되었습니다.",
        tip_jitter: "〰️ 연결이 불안정하여 지터가 높습니다.",
        tip_ping: "⚡ 반응속도가 느려 게이밍에 부적합할 수 있습니다.",
        tip_dl_low: "⬇️ 다운로드 속도가 낮습니다.",
        tip_perfect: "✅ 완벽합니다! 현재 네트워크 상태가 매우 좋습니다."
    },
    en: {
        nav_about: "About",
        nav_faq: "FAQ",
        nav_history: "History",
        header_title: "Internet Speed,<br><span class=\"text-primary\">Beyond just numbers.</span>",
        header_desc: "Going beyond simple speed testing to connection stability,<br class=\"hidden md:block\">we translate your network's true performance into a score.",
        network_checking: "Checking connection...",
        network_analyzing: "Analyzing IP & Provider...",
        network_stability_label: "Network Stability",
        gauge_start: "START",
        dl_desc: "Download speed (Transfer per second)",
        ul_desc: "Upload speed (File transfer capability)",
        ping_desc: "Response speed (Lower is faster)",
        jitter_label: "Jitter",
        jitter_desc: "<strong>\"Connection Wobble\"</strong>: How much the speed fluctuates. Lower means more consistent and stable.",
        loss_label: "Packet Loss",
        loss_desc: "<strong>\"Data Dropped\"</strong>: Percentage of data that fails to reach its destination. 0% is perfect.",
        stability_label: "Stability",
        stability_desc: "<strong>\"Overall Quality\"</strong>: The basic health of your network. Higher scores mean fewer sudden drops.",
        status_ready: "Ready to test",
        about_title: "Why My Network Score?",
        about_desc_1: "Internet speed is not just a number. It's about the <strong>0.1s response time</strong> for gaming and the <strong>seamless data flow</strong> for 4K video.",
        about_desc_2: "We go beyond simple download speeds to analyze <strong>Jitter</strong> and <strong>Packet Loss</strong>, translating your network quality into a comprehensive score.",
        about_table_title: "Recommended Speeds",
        about_table_4k: "4K Streaming",
        about_table_gaming: "Online Gaming",
        about_table_meeting: "Video Calls (HD)",
        about_table_file: "Large File Transfer",
        faq_title: "Frequently Asked Questions (FAQ)",
        faq_q1: "What happens if Jitter is high?",
        faq_a1: "High jitter means inconsistent response times. It's the main cause of characters teleporting in games or voices stuttering in video calls. We recommend below 10ms for a stable connection.",
        faq_q2: "Why should Packet Loss be 0%?",
        faq_a2: "Packet loss means data failed to reach its destination. Even 1% can cause webpage loading failures, errors during online payments, or severe stuttering during games.",
        history_title: "Measurement History",
        history_clear: "Clear",
        table_date: "Date",
        table_dl: "Download",
        table_ul: "Upload",
        table_ping: "Ping",
        table_grade: "Grade",
        history_empty: "No data available",
        footer_terms: "Terms",
        footer_privacy: "Privacy",
        footer_contact: "Contact",
        footer_updated: "Last Updated: February 2026",
        modal_final_grade: "Final Grade",
        modal_close: "Close Result",
        
        // JS Dynamic Strings
        js_ip_prefix: "IP: ",
        js_network_connected: "Network Connected",
        js_analyzing_isp: "Analyzing ISP...",
        js_confirm_clear: "Are you sure you want to delete all history?",
        js_status_ping: "📡 Analyzing latency...",
        js_status_dl: "⬇️ Measuring download bandwidth...",
        js_status_ul: "⬆️ Testing upload data transfer...",
        js_status_done: "Test Complete",
        js_failed: "Failed",
        js_analyzing: "Analyzing",
        
        // Grade Titles & Descs
        grade_a_title: "🚀 Galactic Speed",
        grade_a_desc: "Is your Ethernet cable made of gold? This is server-grade speed.",
        grade_b_title: "⚡ Very Fast",
        grade_b_desc: "Very comfortable. If you lag in games, it's 100% your own skill's fault.",
        grade_c_title: "🚲 Standard Mode",
        grade_c_desc: "YouTube 1080p works fine, but you'll need a prayer for 4K.",
        grade_d_title: "🐌 Snail Mode",
        grade_d_desc: "Frustrating, right? Grow some patience or call your ISP to complain.",
        grade_f_title: "🗿 Ancient Artifact",
        grade_f_desc: "Are you sending signals via smoke? A carrier pigeon might be faster.",
        
        // Tips
        tip_loss: "💨 Data loss detected.",
        tip_jitter: "〰️ High jitter detected, connection unstable.",
        tip_ping: "⚡ Slow response time, may be unsuitable for gaming.",
        tip_dl_low: "⬇️ Download speed is low.",
        tip_perfect: "✅ Perfect! Your network condition is excellent."
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function i18n(key) {
    return translations[currentLang][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    $('langText').textContent = lang === 'ko' ? 'EN' : 'KO';
    
    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = i18n(key);
    });

    // Update footer links
    const termsLink = document.querySelector('a[href^="terms"]');
    const privacyLink = document.querySelector('a[href^="privacy"]');
    if (termsLink) termsLink.href = lang === 'ko' ? 'terms.html' : 'terms-en.html';
    if (privacyLink) privacyLink.href = lang === 'ko' ? 'privacy.html' : 'privacy-en.html';
    
    // Refresh history to update units/text if needed
    loadHistory();
}

function toggleLanguage() {
    setLanguage(currentLang === 'ko' ? 'en' : 'ko');
}

// ── History & IP ──
let currentIP = 'Unknown';
async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    currentIP = data.ip;
    $('network-provider').textContent = i18n('js_ip_prefix') + currentIP;
    
    const infoRes = await fetch('https://ipapi.co/json/');
    const infoData = await infoRes.json();
    if (infoData.org) $('network-name').textContent = infoData.org;
    if (infoData.city && infoData.country_name) {
        const locEl = $('server-location');
        if (locEl) locEl.textContent = infoData.city + ', ' + infoData.country_name;
    }
  } catch(e) { 
      currentIP = 'Unknown'; 
      $('network-provider').textContent = i18n('js_network_connected');
      $('network-name').textContent = i18n('js_analyzing_isp');
  }
}

function loadHistory() {
  const data = JSON.parse(localStorage.getItem('netScoreHistory') || '[]');
  const tbody = $('historyBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-24 text-center text-slate-400 font-bold uppercase tracking-widest">${i18n('history_empty')}</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(item => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td class="p-8 text-slate-500 font-bold text-xs">${item.date}</td>
      <td class="p-8 font-black text-slate-900 dark:text-white text-center">${item.dl} <span class="text-[10px] font-normal text-slate-400 uppercase">Mbps</span></td>
      <td class="p-8 font-black text-slate-900 dark:text-white text-center">${item.ul} <span class="text-[10px] font-normal text-slate-400 uppercase">Mbps</span></td>
      <td class="p-8 font-black text-slate-900 dark:text-white text-center">${item.ping} <span class="text-[10px] font-normal text-slate-400 uppercase">ms</span></td>
      <td class="p-8 text-right">
        <span class="px-4 py-2 rounded-full text-[10px] font-black uppercase ${getGradeClass(item.grade)}">${item.grade}</span>
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
  if(confirm(i18n('js_confirm_clear'))) {
    localStorage.removeItem('netScoreHistory');
    loadHistory();
  }
}

// ── UI ──
function setStatus(msg, state) {
  $('statusText').textContent = msg;
  const dot = $('statusDot');
  dot.className = 'w-3 h-3 rounded-full transition-all duration-300 ';
  
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

function setCard(id, val, state) {
  const card = $('card-' + id);
  const valEl = $('val-' + id);
  if (!card || !valEl) return;
  
  valEl.textContent = val;
  card.classList.remove('border-primary', 'bg-primary/5', 'scale-105', 'shadow-lg');
  
  if (state === 'active') {
      card.classList.add('border-primary', 'bg-primary/5', 'scale-105', 'shadow-lg');
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
  setStatus(i18n('js_status_ping'), 'running');
  setCard('ping', '...', 'active');
  const ok = []; let lost = 0;
  for (let i = 0; i < N; i++) {
    const ms = await onePing(TARGETS[i % TARGETS.length]);
    if (!ms || ms > 3000) { lost++; }
    else { ok.push(ms); setCard('ping', Math.round(ok.reduce((a,b)=>a+b,0)/ok.length), 'active'); }
    setProgress('PING', (i+1)/N*30);
    await sleep(100);
  }
  setCard('ping', ok.length ? Math.round(ok.reduce((a,b)=>a+b,0)/ok.length) : i18n('js_failed'), '');
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
  setStatus(i18n('js_status_dl'), 'running');
  setCard('dl', '...', 'active');
  const speeds = [];
  const sizes = [1e6, 5e6, 10e6];
  for (let i = 0; i < sizes.length; i++) {
    try {
      const mbps = await dlCF(sizes[i]);
      if (mbps > 0 && mbps < 10000) { speeds.push(mbps); setGauge(mbps, 200, 'MBPS'); setCard('dl', mbps.toFixed(1), 'active'); }
    } catch(e) {}
    setProgress('DOWNLOAD', 30+(i+1)/3*35);
  }
  setCard('dl', speeds.length ? +speeds[Math.floor(speeds.length/2)].toFixed(1) : i18n('js_failed'), '');
  return speeds.length ? +speeds[Math.floor(speeds.length/2)].toFixed(2) : null;
}

async function runUpload() {
  setStatus(i18n('js_status_ul'), 'running');
  setCard('ul', '...', 'active');
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
      if (mbps>0&&mbps<10000) { speeds.push(mbps); setGauge(mbps, 100, 'MBPS'); setCard('ul',mbps.toFixed(1), 'active'); }
    } catch(e) {}
    setProgress('UPLOAD', 65+(i+1)/3*35);
    await sleep(200);
  }
  setCard('ul', speeds.length ? +speeds[Math.floor(speeds.length/2)].toFixed(1) : i18n('js_failed'), '');
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

function getTitle(g) {
    return i18n('grade_' + g.toLowerCase() + '_title');
}
function getDesc(g) {
    return i18n('grade_' + g.toLowerCase() + '_desc');
}

function tips(dl, ul, ping, jitter, loss) {
  const t = [];
  if (loss>5) t.push(i18n('tip_loss'));
  if (jitter>30) t.push(i18n('tip_jitter'));
  if (ping>100) t.push(i18n('tip_ping'));
  if (dl&&dl<10) t.push(i18n('tip_dl_low'));
  if (!t.length) t.push(i18n('tip_perfect'));
  return t;
}

let running = false;
async function startTest() {
  if (running) return;
  running = true;
  $('startBtn').disabled = true;
  
  // Reset UI Values
  ['dl','ul','ping','jitter','loss','stability'].forEach(id => {
      const el = $('val-' + id);
      if (el) el.textContent = '...';
  });
  $('gaugeFill').style.transform = 'scaleY(0)';
  $('gaugeVal').textContent = 'READY';
  $('gaugeLabel').textContent = i18n('js_analyzing');
  
  // Measurement Sequence
  const { ping, jitter, loss } = await runPing();
  const dl = await runDownload();
  const ul = await runUpload();
  const stab = stability(ping||999, jitter, loss);
  
  // Final Data Injection
  $('val-jitter').textContent = jitter;
  $('val-loss').textContent = loss + '%';
  $('val-stability').textContent = stab;

  const g = grade(dl, ping||999, stab);
  const resGradeEl = $('resultGrade');
  resGradeEl.textContent = g;
  resGradeEl.className = 'text-[10rem] font-black tracking-tighter leading-none ' + 
    (g === 'A' ? 'text-emerald-500' : g === 'B' ? 'text-blue-500' : 'text-yellow-500');
  
  $('resultTitle').textContent = getTitle(g);
  $('resultDesc').textContent = getDesc(g);
  $('resultTips').innerHTML = '<ul class="space-y-1">' + tips(dl,ul,ping||999,jitter,loss).map(t=>`<li>${t}</li>`).join('') + '</ul>';
  
  // Modal & History
  showModal(g);
  saveHistory(dl, ul, ping, g);
  
  setGauge(dl || 0, 200, 'GRADE');
  $('gaugeVal').textContent = g;
  setStatus(i18n('js_status_done'), 'done');
  
  running = false;
  $('startBtn').disabled = false;
}

// Initial Loading
window.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    getIP(); 
    loadHistory();
});