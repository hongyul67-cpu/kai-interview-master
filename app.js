/* ══════════════════════════════════════════════════════════════
   KAI 면접 마스터 — 화면 (S1)
   규약: https://github.com/hongyul67-cpu/links/blob/master/CONVENTIONS.md

   데이터는 data/L1.js … data/I4.js 가 window.KAI 에 넣습니다(WORKPLAN 4장 형식).
     KAI.learn[]  배우기 단원   { id, order, emoji, title, summary, source[], sections[], terms[], field[], check[] }
     KAI.iv[]     면접 질문 묶음 { id, order, kind:'tech'|'hr'|'company', title, items[] }
     KAI.links    공식 주소     { kai, recruit, portal }   ← L10 이 채움
   없는 파일은 index.html 이 조용히 건너뛰고, 여기서는 "준비 중" 카드로 보입니다.

   점검 퀴즈(Q1)는 quiz.js 가  window.KAIQuiz = { mount(el, ctx) }  를 만들면
   퀴즈 탭을 열 때마다 새 빈 요소를 넘겨 부릅니다.  ctx = { learn, go, tool, unit }  (#quiz/L3 → unit 'L3')
   다른 스크립트가 쓸 수 있게  window.KAIApp = { go, TOOL }  을 열어 둡니다.
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const KAI = window.KAI = window.KAI || {};
KAI.learn = KAI.learn || [];
KAI.iv    = KAI.iv    || [];

const TOOL  = 'KAI 면접 마스터';
const STORE = 'kai_interview_master_v1';
const SPEAK_SEC = 60;       // 말하기 연습 한 문항 시간
const MOCK_N    = 5;        // 무작위 모의면접 문항 수

/* ── 계획표 — 데이터가 아직 없을 때 "준비 중" 카드에 쓰는 제목 ── */
const PLAN_L = [
  ['L1',  '🛩️', '기체 구조 — 세미모노코크·응력·구조부재·스테이션'],
  ['L2',  '🔩', '리벳·판금 조립 — 리벳 규격·배치·드릴·카운터싱크'],
  ['L3',  '🔧', '특수 패스너·하드웨어·토크·안전결선'],
  ['L4',  '🛡️', '부식·실링·표면처리'],
  ['L5',  '🧵', '복합재료·샌드위치 구조'],
  ['L6',  '🔍', '비파괴검사(NDT)·검사'],
  ['L7',  '📐', '항공기 도면·공차·측정'],
  ['L8',  '⚙️', '항공기 금속재료·열처리'],
  ['L9',  '🏭', '생산기술 실무 — 치구·BOM·작업표준·GD&T·5Why·FOD'],
  ['L10', '🏢', 'KAI 회사·제품·직무 이해'],
];
const PLAN_I = [
  ['I1', 'tech',    '기술면접 ① 조립·체결·치구·도면'],
  ['I2', 'tech',    '기술면접 ② 재료·부식·실링·복합재·NDT'],
  ['I3', 'hr',      '인성·상황면접 — 협업·안전·품질·갈등'],
  ['I4', 'company', '회사·직무 — 자기소개·지원 동기·마지막 한마디'],
];
const KIND = { tech: '🔧 기술면접', hr: '🤝 인성·상황', company: '🏢 회사·직무' };

/* ── 도우미 ── */
const $   = s => document.querySelector(s);
const $$  = s => Array.from(document.querySelectorAll(s));
const el  = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* 글자 칸 — 기본은 이스케이프, <b> <i> <u> <br> <sub> <sup> <small> 만 살림 */
const txt = s => esc(s).replace(/&lt;(\/?)(b|i|u|br|sub|sup|small)\s*\/?&gt;/g, '<$1$2>');
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const byOrder = (a, b) => (a.order || 99) - (b.order || 99);
const fmtSec  = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function fxSafe(fn) { try { if (window.FX) fn(window.FX); } catch (e) { console.warn('FX', e); } }

/* ── 저장 (이 기기에만) ── */
const ST = load();
function load() {
  try { return Object.assign({ read: {}, flag: {}, self: {} }, JSON.parse(localStorage.getItem(STORE) || '{}')); }
  catch (e) { return { read: {}, flag: {}, self: {} }; }
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(ST)); } catch (e) {} }

/* ── 데이터 정리 ── */
function learnList() {          // 계획 순서 + 계획에 없는 단원은 뒤에
  const got = {}; KAI.learn.forEach(u => { if (u && u.id) got[u.id] = u; });
  const out = PLAN_L.map(([id, emoji, title]) => got[id] || { id, emoji, title, soon: true });
  KAI.learn.filter(u => u && !PLAN_L.some(p => p[0] === u.id)).sort(byOrder).forEach(u => out.push(u));
  return out;
}
function learnById(id) { return KAI.learn.find(u => u && u.id === id); }
function ivList() {
  const got = {}; KAI.iv.forEach(s => { if (s && s.id) got[s.id] = s; });
  const out = PLAN_I.map(([id, kind, title]) => got[id] || { id, kind, title, soon: true, items: [] });
  KAI.iv.filter(s => s && !PLAN_I.some(p => p[0] === s.id)).sort(byOrder).forEach(s => out.push(s));
  return out;
}
function allQs() {              // [{ set, item, qid, n }]
  const out = [];
  ivList().forEach(set => (set.items || []).forEach((item, i) => out.push({ set, item, qid: `${set.id}-${i + 1}`, n: i + 1 })));
  return out;
}

/* ══════════════ 화면 전환 — 주소 뒤 #보기/인자 ══════════════ */
let curView = 'home';
function go(h) { if (location.hash === '#' + h) route(); else location.hash = h; }
function route() {
  stopTimer();
  const [view, arg] = decodeURIComponent(location.hash.slice(1) || 'home').split('/');
  curView = ['home', 'learn', 'field', 'quiz', 'iv'].includes(view) ? view : 'home';
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === curView));
  const v = $('#view');
  v.innerHTML = '';
  try {
    if (curView === 'home')  renderHome(v);
    if (curView === 'learn') arg ? renderUnit(v, arg) : renderLearn(v);
    if (curView === 'field') renderField(v, arg || 'all');
    if (curView === 'quiz')  renderQuiz(v, arg);
    if (curView === 'iv')    renderIv(v, arg || 'all');
  } catch (e) {
    console.error(e);
    v.appendChild(el(`<div class="card explain warn">화면을 그리다 문제가 생겼습니다: ${esc(e.message)}</div>`));
  }
  window.scrollTo(0, 0);
}
$$('.tab').forEach(t => t.addEventListener('click', () => go(t.dataset.view)));
window.addEventListener('hashchange', route);
/* backbar.js — 도구 안 홈을 알려 줌 */
window.BACKBAR_HOME   = () => go('home');
window.BACKBAR_ATHOME = () => curView === 'home';

/* ══════════════ 홈 ══════════════ */
function renderHome(v) {
  const L = learnList(), ready = L.filter(u => !u.soon);
  const Q = allQs();
  const readN = ready.filter(u => ST.read[u.id]).length;
  const doneN = Q.filter(q => ST.self[q.qid]).length;
  const flagN = Q.filter(q => ST.flag[q.qid]).length;
  const checkN = ready.reduce((s, u) => s + (u.check || []).length, 0);

  v.appendChild(el(`<div class="hero">
    <h2>기체를 <span class="kw">만드는 사람</span>의 눈으로 면접을 준비합니다</h2>
    <div>항공정비 교재의 이론이 <b>KAI 조립 현장</b>에서 어떻게 쓰이는지 익히고,
      예상 질문에 <b>소리 내어</b> 답해 보는 도구입니다. 순서대로 하면 됩니다.</div>
    <div class="steps">
      <button class="step" data-go="learn"><div class="no">STEP 1</div><b>📖 배우기</b>
        <span>이론 요약 → 🏭 현장 대응표. 정답을 다 보여 줍니다.</span></button>
      <button class="step" data-go="quiz"><div class="no">STEP 2</div><b>✅ 점검 퀴즈</b>
        <span>배운 것을 연습 8문항·종합시험 20문항으로 확인합니다.</span></button>
      <button class="step" data-go="iv"><div class="no">STEP 3</div><b>🎤 면접 연습</b>
        <span>질문만 보고 ${SPEAK_SEC}초 동안 말하기 → 모범 답변과 비교.</span></button>
    </div>
  </div>`));

  v.appendChild(el(`<div class="stats" style="margin-bottom:12px">
    <div class="stat"><b>${readN}<small style="font-size:14px;color:var(--dim)"> / ${ready.length}</small></b><span>읽은 단원</span></div>
    <div class="stat"><b>${doneN}<small style="font-size:14px;color:var(--dim)"> / ${Q.length}</small></b><span>말해 본 질문</span></div>
    <div class="stat"><b>${flagN}</b><span>📌 다시 볼 질문</span></div>
  </div>`));

  const mock = el(`<div class="card">
    <h3>🎲 바로 모의면접</h3>
    <div class="muted">질문 ${MOCK_N}개를 무작위로 뽑아 이어서 묻습니다. 질문마다 ${SPEAK_SEC}초, 끝나면 스스로 평가합니다.</div>
    <div class="row" style="margin-top:10px">
      <button class="btn btn-primary" id="hmMock" ${Q.length ? '' : 'disabled'}>🎲 무작위 ${MOCK_N}문항 시작</button>
      ${flagN ? `<button class="btn" id="hmFlag">📌 다시 볼 질문 ${flagN}개 연습</button>` : ''}
    </div>
    ${Q.length ? '' : '<div class="muted" style="margin-top:6px">면접 질문을 준비하고 있습니다.</div>'}
  </div>`);
  v.appendChild(mock);

  let rankHtml = '';
  try { if (window.Rank) rankHtml = Rank.card(); } catch (e) { console.warn('Rank', e); }
  if (rankHtml) v.appendChild(el(`<div class="card" id="hmRank">${rankHtml}</div>`));

  v.appendChild(el(`<div class="card">
    <h3>이 도구를 쓰기 전에</h3>
    <ul style="margin:0;padding-left:20px">
      <li>배우기 단원 ${ready.length}개 · 점검 문항 ${checkN}개 · 면접 예상 질문 ${Q.length}개가 들어 있습니다${ready.length < PLAN_L.length ? ' (나머지는 준비 중)' : ''}.</li>
      <li>면접 질문은 모두 <b>예상 질문</b>입니다. 실제 기출이 아닙니다.</li>
      <li>이론은 국토교통부 항공정비 표준교재 등을 <b>요약·재서술</b>했고 출처 쪽번호를 적었습니다.
        <span class="pill real">교재 밖 실무 지식</span> 딱지는 교재에 없는 일반 현장 지식입니다.</li>
      <li>모범 답변의 <b>[ ]</b> 칸은 여러분의 경험(현장실습·동아리·자격증 준비)으로 바꿔 말하세요.</li>
      <li>기록은 이 기기에만 저장됩니다. 공용 PC 라면 끝나고 왼쪽 아래 🧹 기록 초기화를 누르세요.</li>
    </ul>
  </div>`));

  v.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  const m = $('#hmMock'); if (m) m.onclick = () => startMock();
  const f = $('#hmFlag'); if (f) f.onclick = () => startRun(allQs().filter(q => ST.flag[q.qid]), '📌 다시 볼 질문');
}

/* ══════════════ 배우기 — 단원 목록 ══════════════ */
function renderLearn(v) {
  const L = learnList();
  v.appendChild(el(`<div class="card">
    <h2>📖 배우기</h2>
    <div class="muted">단원을 고르면 요약 → 소제목별 정리 → 용어 → 현장 대응표 순서로 보여 줍니다.
      다 읽었으면 단원 끝의 <b>✅ 다 읽었어요</b>를 누르세요.</div>
  </div>`));
  const grid = el('<div class="units"></div>');
  L.forEach(u => {
    if (u.soon) {
      grid.appendChild(el(`<div class="unit soon"><div class="em">${u.emoji}</div><div>
        <div class="t">${esc(u.title)}</div><div class="meta"><span class="pill">준비 중</span></div></div></div>`));
      return;
    }
    const b = el(`<button class="unit ${ST.read[u.id] ? 'read' : ''}"><div class="em">${u.emoji || '📘'}</div><div>
      <div class="t">${txt(u.title)}</div>
      <div class="s">${txt(u.summary || '')}</div>
      <div class="meta">
        <span class="pill blue">소제목 ${(u.sections || []).length}</span>
        <span class="pill">용어 ${(u.terms || []).length}</span>
        <span class="pill">대응표 ${(u.field || []).length}</span>
        ${ST.read[u.id] ? '<span class="pill ok">✅ 읽음</span>' : ''}
      </div></div></button>`);
    b.onclick = () => go('learn/' + u.id);
    grid.appendChild(b);
  });
  v.appendChild(grid);
}

/* ══════════════ 배우기 — 단원 화면 ══════════════ */
function renderUnit(v, id) {
  const u = learnById(id);
  if (!u) {
    const p = PLAN_L.find(x => x[0] === id);
    v.appendChild(el(`<div class="card empty">${p ? `${p[1]} ${esc(p[2])}<br>` : ''}이 단원은 준비 중입니다.<br><br>
      <button class="btn" id="bk">← 단원 목록</button></div>`));
    $('#bk').onclick = () => go('learn');
    return;
  }
  const secs = u.sections || [];
  const src = (u.source || []).map(s => `<li>${txt(s)}</li>`).join('');
  const head = el(`<div class="card">
    <div class="uhead"><div class="em">${u.emoji || '📘'}</div><div>
      <h2>${txt(u.title)}</h2>
      <div>${txt(u.summary || '')}</div>
    </div></div>
    ${src ? `<div class="src"><b>출처</b><ul style="margin:2px 0 0;padding-left:18px">${src}</ul></div>` : ''}
    <div class="toc">${secs.map((s, i) => `<a href="javascript:void 0" data-sec="${i}">${i + 1}. ${txt(s.h)}</a>`).join('')}
      ${(u.terms || []).length ? '<a href="javascript:void 0" data-sec="terms">📘 용어</a>' : ''}
      ${(u.field || []).length ? '<a href="javascript:void 0" data-sec="field">🏭 현장 대응표</a>' : ''}</div>
  </div>`);
  v.appendChild(head);

  secs.forEach((s, i) => {
    v.appendChild(el(`<div class="card sec" id="sec-${i}">
      <h3><span class="num">${i + 1}</span> ${txt(s.h)} ${s.basis === '실무' ? '<span class="pill real">교재 밖 실무 지식</span>' : ''}</h3>
      ${s.body ? `<div class="body">${s.body}</div>` : ''}
      ${(s.points || []).length ? `<ul class="pts">${s.points.map(p => `<li>${txt(p)}</li>`).join('')}</ul>` : ''}
      ${s.fig ? `<div class="fig">${s.fig}</div>` : ''}
    </div>`));
  });

  if ((u.terms || []).length) {
    v.appendChild(el(`<div class="card" id="sec-terms"><h3>📘 용어 ${u.terms.length}개</h3>
      <div class="terms">${u.terms.map(t => `<div class="term"><b>${txt(t.t)}</b><span>${txt(t.d)}</span></div>`).join('')}</div>
    </div>`));
  }
  if ((u.field || []).length) {
    const c = el(`<div class="card" id="sec-field"><h3>🏭 현장 대응표 — 이 이론이 조립 현장에서는</h3></div>`);
    c.appendChild(el(fieldTable(u.field.map(f => ({ f, u })), false)));
    v.appendChild(c);
  }

  const L = learnList().filter(x => !x.soon);
  const k = L.findIndex(x => x.id === u.id);
  const prev = L[k - 1], next = L[k + 1];
  const foot = el(`<div class="card">
    <div class="row" style="justify-content:center;margin-bottom:10px">
      <button class="btn ${ST.read[u.id] ? 'btn-ok' : 'btn-primary'}" id="uRead">${ST.read[u.id] ? '✅ 읽음 표시됨 (누르면 해제)' : '✅ 다 읽었어요'}</button>
      <button class="btn" id="uQuiz">✅ 점검 퀴즈 풀기</button>
    </div>
    <div class="unav">
      ${prev ? `<button class="btn btn-sm" id="uPrev">← ${prev.emoji || ''} ${txt(prev.title)}</button>` : '<span></span>'}
      <button class="btn btn-sm" id="uList">단원 목록</button>
      ${next ? `<button class="btn btn-sm" id="uNext">${next.emoji || ''} ${txt(next.title)} →</button>` : '<span></span>'}
    </div>
  </div>`);
  v.appendChild(foot);

  head.querySelectorAll('[data-sec]').forEach(a => a.onclick = () => {
    const t = $('#sec-' + a.dataset.sec); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#uRead').onclick = e => {
    if (ST.read[u.id]) delete ST.read[u.id]; else ST.read[u.id] = Date.now();
    save();
    const b = e.currentTarget, on = !!ST.read[u.id];
    b.className = 'btn ' + (on ? 'btn-ok' : 'btn-primary');
    b.textContent = on ? '✅ 읽음 표시됨 (누르면 해제)' : '✅ 다 읽었어요';
    if (on) fxSafe(F => { F.burst(b, { color: '#34d399', n: 12 }); F.punch(b); });
  };
  $('#uQuiz').onclick = () => go('quiz/' + u.id);
  $('#uList').onclick = () => go('learn');
  if (prev) $('#uPrev').onclick = () => go('learn/' + prev.id);
  if (next) $('#uNext').onclick = () => go('learn/' + next.id);
}

/* 현장 대응표 — 넓으면 표, 좁으면(700px↓) CSS 가 카드로 바꿉니다.
   <tr> 을 el() 로 따로 만들면 사라지므로 표 전체를 문자열 하나로 만듭니다. */
function fieldTable(rows, showUnit) {
  return `<table class="ftable">
    <thead><tr><th>📖 이론</th><th>🏭 KAI 조립 현장</th><th>⚠️ 잘못되면</th></tr></thead>
    <tbody>${rows.map(({ f, u }) => `<tr>
      <td data-label="📖 이론">${showUnit ? `<a class="utag pill blue" href="#learn/${esc(u.id)}" style="text-decoration:none">${u.emoji || ''} ${esc(u.id)}</a>` : ''}${txt(f.theory)}</td>
      <td data-label="🏭 KAI 조립 현장">${txt(f.site)}${f.basis === '실무' ? ' <span class="pill real">실무</span>' : ''}</td>
      <td data-label="⚠️ 잘못되면">${txt(f.risk)}</td>
    </tr>`).join('')}</tbody></table>`;
}

/* ══════════════ 현장 대응표 ══════════════ */
function renderField(v, pick) {
  const L = learnList().filter(u => !u.soon && (u.field || []).length);
  const total = L.reduce((s, u) => s + u.field.length, 0);
  v.appendChild(el(`<div class="card">
    <h2>🏭 현장 대응표</h2>
    <div class="muted">정비 교재에서 배운 <b>이론</b>이 기체를 <b>만드는 쪽(조립·치구·품질)</b>에서 어떻게 쓰이는지,
      그리고 <b>잘못되면</b> 무슨 일이 생기는지 한 줄씩 짝지었습니다. 면접에서 "현장에서라면?"이라는 질문의 답이 여기 있습니다.</div>
  </div>`));
  if (!L.length) { v.appendChild(el('<div class="card empty">단원 자료를 준비하고 있습니다.</div>')); return; }
  if (pick !== 'all' && !L.some(u => u.id === pick)) pick = 'all';

  const chips = el('<div class="chips"></div>');
  chips.appendChild(el(`<button class="chip ${pick === 'all' ? 'on' : ''}" data-f="all">전체<span class="n">${total}</span></button>`));
  L.forEach(u => chips.appendChild(el(`<button class="chip ${pick === u.id ? 'on' : ''}" data-f="${esc(u.id)}" title="${esc(u.title)}">${u.emoji || ''} ${esc(u.id)}<span class="n">${u.field.length}</span></button>`)));
  v.appendChild(chips);
  chips.querySelectorAll('.chip').forEach(c => c.onclick = () => go('field/' + c.dataset.f));

  const rows = [];
  L.filter(u => pick === 'all' || u.id === pick).forEach(u => u.field.forEach(f => rows.push({ f, u })));
  if (pick !== 'all') {
    const u = learnById(pick);
    v.appendChild(el(`<div class="row" style="margin:0 2px 8px;justify-content:space-between">
      <b>${u.emoji || ''} ${txt(u.title)}</b>
      <a class="btn btn-sm" href="#learn/${esc(u.id)}">📖 이 단원 배우기</a></div>`));
  }
  v.appendChild(el(fieldTable(rows, pick === 'all')));
}

/* ══════════════ 점검 퀴즈 (quiz.js 가 채움) ══════════════ */
function renderQuiz(v, unit) {
  const box = el('<div id="quizMount"></div>');
  v.appendChild(box);
  if (window.KAIQuiz && typeof window.KAIQuiz.mount === 'function') {
    try { window.KAIQuiz.mount(box, { learn: KAI.learn, go, tool: TOOL, unit: unit || '' }); return; }
    catch (e) { console.error('KAIQuiz', e); box.innerHTML = ''; }
  }
  const n = KAI.learn.reduce((s, u) => s + ((u && u.check) || []).length, 0);
  box.appendChild(el(`<div class="card empty">✅ 점검 퀴즈는 준비 중입니다.<br>
    <span class="muted">지금까지 모인 점검 문항 ${n}개 · 먼저 📖 배우기를 읽어 두세요.</span><br><br>
    <button class="btn btn-primary" id="qzLearn">📖 배우기로</button></div>`));
  $('#qzLearn').onclick = () => go('learn');
}

/* ══════════════ 면접 연습 — 질문 목록 ══════════════ */
function renderIv(v, pick) {
  const sets = ivList(), Q = allQs();
  const flagged = Q.filter(q => ST.flag[q.qid]);
  const cnt = k => Q.filter(q => q.set.kind === k).length;

  v.appendChild(el(`<div class="card">
    <h2>🎤 면접 연습</h2>
    <div class="muted">질문을 눌러 펼치면 <b>면접관이 확인하려는 것 · STAR 구조 · 키워드 · 모범 답변 · 꼬리 질문</b>이 나옵니다.
      <b>🎤 말하기 연습</b>은 질문만 보여 주고 ${SPEAK_SEC}초를 잽니다 — 실제로 소리 내어 답한 뒤 스스로 평가하세요.</div>
    <div class="row" style="margin-top:10px">
      <button class="btn btn-primary" id="ivMock" ${Q.length ? '' : 'disabled'}>🎲 무작위 모의면접 ${MOCK_N}문항</button>
      <button class="btn" id="ivFlag" ${flagged.length ? '' : 'disabled'}>📌 다시 볼 질문 ${flagged.length}개 연습</button>
    </div>
  </div>`));
  $('#ivMock').onclick = () => startMock();
  $('#ivFlag').onclick = () => startRun(allQs().filter(q => ST.flag[q.qid]), '📌 다시 볼 질문');

  const chips = el('<div class="chips"></div>');
  [['all', '전체', Q.length], ['tech', KIND.tech, cnt('tech')], ['hr', KIND.hr, cnt('hr')],
   ['company', KIND.company, cnt('company')], ['flag', '📌 다시 볼 질문', flagged.length]]
    .forEach(([k, name, n]) => chips.appendChild(el(`<button class="chip ${pick === k ? 'on' : ''}" data-k="${k}" id="ivChip-${k}">${name}<span class="n">${n}</span></button>`)));
  v.appendChild(chips);
  chips.querySelectorAll('.chip').forEach(c => c.onclick = () => go('iv/' + c.dataset.k));

  if (pick === 'flag') {
    if (!flagged.length) { v.appendChild(el('<div class="card empty">📌 표시한 질문이 없습니다.<br><span class="muted">질문을 펼쳐 「📌 다시 볼 질문」을 누르면 여기에 모입니다.</span></div>')); return; }
    const box = el('<div class="ivset"></div>');
    flagged.forEach(q => box.appendChild(qDetails(q, true)));
    v.appendChild(box);
    return;
  }

  sets.filter(s => pick === 'all' || s.kind === pick).forEach(set => {
    const box = el(`<div class="ivset"><div class="hd">
      <h3>${esc(KIND[set.kind] ? KIND[set.kind].split(' ')[0] : '💬')} ${txt(set.title)}
        ${set.soon ? '<span class="pill">준비 중</span>' : `<span class="pill">${set.items.length}문항</span>`}</h3>
      ${set.soon ? '' : '<button class="btn btn-sm btn-navy">🎤 이 묶음 말하기 연습</button>'}
    </div></div>`);
    if (set.soon) box.appendChild(el('<div class="card empty" style="padding:16px">질문을 준비하고 있습니다.</div>'));
    else {
      box.querySelector('.hd .btn').onclick = () => startRun(Q.filter(q => q.set === set), set.title);
      Q.filter(q => q.set === set).forEach(q => box.appendChild(qDetails(q, false)));
    }
    v.appendChild(box);
  });
}

/* 질문 하나 — 아코디언 */
function qDetails(q, showSet) {
  const it = q.item, me = ST.self[q.qid];
  const d = el(`<details class="q"><summary>
      <span class="n">${esc(q.set.id)}-${q.n}</span>
      <span class="qt">${txt(it.q)}
        ${showSet ? `<span class="pill" style="margin-left:4px">${txt(q.set.title)}</span>` : ''}</span>
      <span class="selfmark">${ST.flag[q.qid] ? '📌' : ''}${me ? ` <span class="pill ${me.lv === '상' ? 'ok' : me.lv === '하' ? 'no' : 'real'}">${me.lv}</span>` : ''}</span>
      <span class="ar">▶</span>
    </summary><div class="in"></div></details>`);
  d.addEventListener('toggle', () => {           // 펼칠 때 한 번만 그림
    const inn = d.querySelector('.in');
    if (!d.open || inn.childElementCount) return;
    inn.innerHTML = answerHtml(it);
    inn.appendChild(el(`<div class="row" style="margin-top:14px">
      <button class="btn btn-sm btn-navy" data-a="speak">🎤 이 질문 말하기 연습</button>
      <button class="flag ${ST.flag[q.qid] ? 'on' : ''}" data-a="flag">📌 다시 볼 질문</button>
      ${learnLink(it.learn)}
    </div>`));
    inn.querySelector('[data-a="speak"]').onclick = () => startRun([q], '한 문항 연습');
    inn.querySelector('[data-a="flag"]').onclick = e => { toggleFlag(q.qid, e.currentTarget); refreshMark(d, q); };
    const lk = inn.querySelector('[data-a="learn"]'); if (lk) lk.onclick = () => go('learn/' + it.learn);
  });
  return d;
}
function refreshMark(d, q) {
  const me = ST.self[q.qid];
  d.querySelector('.selfmark').innerHTML = (ST.flag[q.qid] ? '📌' : '') +
    (me ? ` <span class="pill ${me.lv === '상' ? 'ok' : me.lv === '하' ? 'no' : 'real'}">${me.lv}</span>` : '');
}
function toggleFlag(qid, btn) {
  if (ST.flag[qid]) delete ST.flag[qid]; else ST.flag[qid] = Date.now();
  save();
  if (btn) btn.classList.toggle('on', !!ST.flag[qid]);
  // 목록 화면의 개수·연습 버튼도 바로 맞춘다(다시 그리면 펼친 질문이 닫히므로 글자만 바꿈)
  const n = allQs().filter(q => ST.flag[q.qid]).length;
  const fb = document.getElementById('ivFlag');
  if (fb) { fb.disabled = !n; fb.textContent = `📌 다시 볼 질문 ${n}개 연습`; }
  const ch = document.querySelector('#ivChip-flag .n'); if (ch) ch.textContent = n;
}
function learnLink(id) {
  if (!id) return '';
  const u = learnById(id), p = PLAN_L.find(x => x[0] === id);
  const name = u ? u.title : p ? p[2] : id;
  return `<button class="btn btn-sm" data-a="learn">📖 관련 배우기: ${esc(id)} ${txt(name)}</button>`;
}
/* why · STAR · 키워드 · 모범 답변 · 주의 · 꼬리 질문 */
function answerHtml(it) {
  const S = it.star || {};
  const star = ['S', 'T', 'A', 'R'].filter(k => S[k]).length
    ? `<div class="lbl">⭐ STAR 로 짜기</div><div class="star">
        ${[['S', '상황'], ['T', '과제'], ['A', '행동'], ['R', '결과']].map(([k, n]) => `<div><b>${k} · ${n}</b>${txt(S[k] || '')}</div>`).join('')}</div>` : '';
  return `
    ${it.why ? `<div class="lbl">🎯 면접관이 확인하려는 것</div><div>${txt(it.why)}</div>` : ''}
    ${star}
    ${(it.keys || []).length ? `<div class="lbl">🔑 꼭 넣을 키워드</div><div class="keys">${it.keys.map(k => `<span>${txt(k)}</span>`).join('')}</div>` : ''}
    ${it.model ? `<div class="lbl">🗣️ 모범 답변 예시 <span class="muted" style="font-weight:600">— [ ] 는 내 경험으로 바꾸기</span></div><div class="model">${txt(it.model)}</div>` : ''}
    ${it.tip ? `<div class="lbl">⚠️ 주의</div><div class="tip">${txt(it.tip)}</div>` : ''}
    ${(it.follow || []).length ? `<div class="lbl">🔗 꼬리 질문 — 이것까지 답해 보기</div><ol class="follow">${it.follow.map(f => `<li>${txt(f)}</li>`).join('')}</ol>` : ''}`;
}

/* ══════════════ 말하기 연습 · 모의면접 ══════════════
   질문만 → 60초 타이머 → 모범 답변 공개 → 말한 키워드 체크 → 상/중/하 → 다음 */
let run = null, tick = null;

function startMock() {
  const Q = allQs();
  if (!Q.length) return;
  // 분류마다 하나씩 먼저 뽑고 나머지를 무작위로 채움
  const pickd = [], seen = new Set();
  ['tech', 'hr', 'company'].forEach(k => {
    const c = shuffle(Q.filter(q => q.set.kind === k))[0];
    if (c) { pickd.push(c); seen.add(c.qid); }
  });
  shuffle(Q.filter(q => !seen.has(q.qid))).forEach(q => { if (pickd.length < MOCK_N) pickd.push(q); });
  startRun(shuffle(pickd.slice(0, MOCK_N)), `🎲 무작위 모의면접 ${Math.min(MOCK_N, pickd.length)}문항`);
}

function startRun(list, title) {
  if (!list || !list.length) return;
  stopTimer();
  run = { list, title, i: 0, res: [], t0: Date.now() };
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === 'iv'));
  if (!/^#iv/.test(location.hash)) history.replaceState(null, '', '#iv');
  curView = 'iv';
  drawRunQ();
}

function runHead(step) {
  const q = run.list[run.i];
  return `<div class="row" style="justify-content:space-between">
      <b>${esc(run.title)}</b>
      <button class="btn btn-sm" data-a="quit">그만하기</button></div>
    <div class="progress"><i style="width:${(run.i + step) / run.list.length * 100}%"></i></div>
    <div class="row"><span class="pill blue">${run.i + 1} / ${run.list.length}</span>
      <span class="pill">${esc(KIND[q.set.kind] || '')}</span><span class="pill">${esc(q.set.id)}-${q.n}</span></div>`;
}
function bindQuit(v) {
  v.querySelector('[data-a="quit"]').onclick = () => { stopTimer(); run = null; go('iv'); };
}

function drawRunQ() {
  const v = $('#view'), q = run.list[run.i];
  v.innerHTML = '';
  const card = el(`<div class="card">
    ${runHead(0)}
    <div class="qbig">Q. ${txt(q.item.q)}</div>
    <div class="tbar"><i id="tb"></i></div>
    <div class="row" style="justify-content:space-between">
      <span class="timer" id="tt">${fmtSec(SPEAK_SEC)}</span>
      <span class="muted" id="thint">소리 내어 답해 보세요</span>
    </div>
    <div class="explain" style="margin-top:10px">답을 <b>속으로 읽지 말고 실제로 말하세요.</b>
      결론 먼저 → 이유·경험 → 입사 후 어떻게, 순서면 충분합니다. 시간이 끝나면 모범 답변이 열립니다.</div>
    <div class="row" style="margin-top:12px">
      <button class="btn btn-primary" id="rnDone">답변 마침 → 모범 답변 보기</button>
    </div>
  </div>`);
  v.appendChild(card);
  bindQuit(v);
  window.scrollTo(0, 0);
  const t0 = Date.now();
  const finish = timeUp => { const used = Math.min(SPEAK_SEC, Math.round((Date.now() - t0) / 1000)); stopTimer(); drawRunA(used, timeUp); };
  $('#rnDone').onclick = () => finish(false);
  startTimer(SPEAK_SEC, t0, () => finish(true));
}

/* 남은 시간 표시 — 숨은 탭에서 느려져도 시각으로 계산 */
function startTimer(sec, t0, onEnd) {
  stopTimer();
  const paint = () => {
    const tt = $('#tt'), tb = $('#tb'), th = $('#thint');
    if (!tt) return stopTimer();
    const left = Math.max(0, sec - (Date.now() - t0) / 1000);
    tt.textContent = fmtSec(Math.ceil(left));
    tb.style.width = (left / sec * 100) + '%';
    const low = left <= 10;
    tt.classList.toggle('low', low); tb.classList.toggle('low', low);
    th.textContent = low ? '마무리하세요 — 마지막 한 문장' : '소리 내어 답해 보세요';
    if (left <= 0) { stopTimer(); onEnd(); }
  };
  paint();
  tick = setInterval(paint, 200);
}
function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }

function levelOf(got, total) {
  if (!total) return '';
  if (got * 3 >= total * 2) return '상';
  if (got * 3 >= total) return '중';
  return '하';
}

function drawRunA(used, timeUp) {
  const v = $('#view'), q = run.list[run.i], it = q.item;
  const keys = it.keys || [];
  let lv = '', manual = false;
  v.innerHTML = '';
  v.appendChild(el(`<div class="card">
    ${runHead(1)}
    <div class="qbig">Q. ${txt(it.q)}</div>
    <div class="muted">${timeUp ? '⏰ 시간 종료' : `⏱ ${used}초 동안 말함`}</div>
  </div>`));
  bindQuit(v);

  const ev = el(`<div class="card">
    <h3>✍️ 스스로 평가</h3>
    ${keys.length ? `<div class="muted" style="margin-bottom:8px">방금 <b>실제로 말한</b> 키워드에만 체크하세요.</div>
      <div class="kcheck">${keys.map((k, i) => `<label><input type="checkbox" data-k="${i}"> ${txt(k)}</label>`).join('')}</div>`
      : '<div class="muted" style="margin-bottom:8px">아래 모범 답변과 비교해 스스로 수준을 고르세요.</div>'}
    <div class="row" style="margin-top:12px;align-items:center">
      <span class="muted">내 수준</span> <span class="lv" id="rnLv">–</span>
      <span class="muted" id="rnWhy"></span>
    </div>
    <div class="row" style="margin-top:8px">
      <button class="btn btn-sm btn-ok"   data-lv="상">상 — 핵심을 다 말함</button>
      <button class="btn btn-sm btn-warn" data-lv="중">중 — 절반쯤</button>
      <button class="btn btn-sm btn-no"   data-lv="하">하 — 거의 못 함</button>
    </div>
    <div class="row" style="margin-top:12px">
      <button class="flag ${ST.flag[q.qid] ? 'on' : ''}" id="rnFlag">📌 다시 볼 질문</button>
      <span class="muted" id="rnFlagNote"></span>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn btn-primary" id="rnNext" disabled>${run.i + 1 >= run.list.length ? '평가 저장하고 결과 보기' : '평가 저장하고 다음 질문 →'}</button>
    </div>
  </div>`);
  v.appendChild(ev);
  v.appendChild(el(`<div class="card"><h3>📋 답변 전략</h3>${answerHtml(it)}${learnLink(it.learn) ? `<div class="row" style="margin-top:12px">${learnLink(it.learn)}</div>` : ''}</div>`));
  const lk = v.querySelector('[data-a="learn"]'); if (lk) lk.onclick = () => { stopTimer(); run = null; go('learn/' + it.learn); };

  const got = () => ev.querySelectorAll('.kcheck input:checked').length;
  const paint = () => {
    ev.querySelectorAll('.kcheck label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
    if (!manual) lv = levelOf(got(), keys.length);
    const b = $('#rnLv'); b.textContent = lv || '–'; b.className = 'lv ' + lv;
    $('#rnWhy').textContent = keys.length ? `키워드 ${got()} / ${keys.length}${manual ? ' · 직접 고름' : ''}` : '';
    ev.querySelectorAll('[data-lv]').forEach(x => x.style.outline = x.dataset.lv === lv ? '2px solid var(--navy)' : '');
    $('#rnNext').disabled = !lv;
  };
  ev.querySelectorAll('.kcheck input').forEach(c => c.onchange = () => { manual = false; paint(); });
  ev.querySelectorAll('[data-lv]').forEach(x => x.onclick = () => { manual = true; lv = x.dataset.lv; paint(); });
  $('#rnFlag').onclick = e => { toggleFlag(q.qid, e.currentTarget); $('#rnFlagNote').textContent = ''; };
  paint();

  $('#rnNext').onclick = e => {
    const g = got();
    // 체크 없이 수준만 직접 골랐으면 "빠진 키워드"를 따지지 않음(전부 빠진 것처럼 보이지 않게)
    const missed = (manual && !g) ? [] : keys.filter((k, i) => !ev.querySelector(`.kcheck input[data-k="${i}"]`).checked);
    ST.self[q.qid] = { lv, got: g, total: keys.length, at: Date.now() };
    let autoFlag = false;
    if (lv === '하' && !ST.flag[q.qid]) { ST.flag[q.qid] = Date.now(); autoFlag = true; }   // 못 한 질문은 다시 볼 목록에
    save();
    run.res.push({ q, lv, got: g, total: keys.length, missed, sec: used, autoFlag });
    if (lv === '상') fxSafe(F => F.ok(e.currentTarget));
    run.i++;
    if (run.i >= run.list.length) drawRunEnd(); else drawRunQ();
  };
}

const LV_PT = { 상: 100, 중: 60, 하: 20 };
let lastResult = null;

function drawRunEnd() {
  const v = $('#view'), R = run.res, n = R.length;
  const pct = Math.round(R.reduce((s, r) => s + LV_PT[r.lv], 0) / n);     // 화면의 상/중/하와 어긋나지 않게 수준으로 계산
  const sec = Math.round((Date.now() - run.t0) / 1000);
  const cnt = k => R.filter(r => r.lv === k).length;
  const flagged = R.filter(r => r.autoFlag).length;
  const isMock = n >= 3;
  v.innerHTML = '';
  v.appendChild(el(`<div class="card" style="text-align:center">
    <div class="muted">${esc(run.title)}</div>
    <div style="font-size:38px;font-weight:900;color:var(--navy)">${pct}점</div>
    <div class="muted">${n}문항 · 상 ${cnt('상')} · 중 ${cnt('중')} · 하 ${cnt('하')} · ${Math.floor(sec / 60)}분 ${sec % 60}초</div>
    ${flagged ? `<div class="muted" style="margin-top:4px">「하」로 평가한 ${flagged}문항은 📌 다시 볼 질문에 넣었습니다.</div>` : ''}
    <div id="rankBox" style="margin-top:12px"></div>
    <div id="rSubmitAnchor" style="margin-top:12px"></div>
  </div>`));
  v.appendChild(el(`<div class="card"><h3>문항별 자기평가</h3><table class="rtable"><tbody>
    ${R.map((r, i) => `<tr><td><b>${i + 1}.</b> ${txt(r.q.item.q)}
        ${r.missed.length ? `<div class="muted">빠진 키워드: ${r.missed.map(esc).join(', ')}</div>` : ''}</td>
      <td><span class="pill ${r.lv === '상' ? 'ok' : r.lv === '하' ? 'no' : 'real'}">${r.lv}</span></td></tr>`).join('')}
  </tbody></table></div>`));
  const again = el(`<div class="card row" style="justify-content:center">
    <button class="btn btn-primary" id="enMock">🎲 새 무작위 ${MOCK_N}문항</button>
    <button class="btn" id="enFlag">📌 다시 볼 질문 연습</button>
    <button class="btn" id="enList">질문 목록</button></div>`);
  v.appendChild(again);
  $('#enMock').onclick = () => startMock();
  $('#enFlag').onclick = () => startRun(allQs().filter(q => ST.flag[q.qid]), '📌 다시 볼 질문');
  $('#enList').onclick = () => { run = null; go('iv'); };
  window.scrollTo(0, 0);

  /* 제출을 먼저 붙입니다 — 연출·계급에서 오류가 나도 제출 버튼은 살아 있어야 합니다(템플릿 주석 참고) */
  if (isMock) mountSubmit(pct, cnt('상'), n, sec, R);
  else $('#rSubmitAnchor').innerHTML = '<div class="muted">3문항 이상 이어서 연습하면 결과를 선생님께 제출할 수 있습니다.</div>';

  if (isMock) {
    fxSafe(F => { if (pct >= 60) F.banner({ title: pct >= 90 ? '면접 준비 완료!' : '좋습니다!', sub: `${run.title} · 자기평가 ${pct}점`, stars: F.starsFor ? F.starsFor(pct) : 0 }); });
    try {
      if (window.Rank) { const res = Rank.award(pct, { mode: `${TOOL} — 모의면접` }); $('#rankBox').innerHTML = Rank.resultBox(res); }
    } catch (e) { console.warn('Rank', e); }
  }
}

/* 결과 제출 (규약 1) — mode 는 파트별, wrong 은 무엇이 부족했는지 내용으로 */
function mountSubmit(pct, correct, total, sec, R) {
  lastResult = {
    mode: `${TOOL} — 모의면접`,
    score: pct, correct, total,
    wrong: R.filter(r => r.lv !== '상').map(r => {
      const q = String(r.q.item.q).replace(/<[^>]+>/g, '');
      return `${r.q.set.id}-${r.q.n} ${q.slice(0, 22)}${q.length > 22 ? '…' : ''}(${r.lv})` +
        (r.missed.length ? ` 빠진 키워드: ${r.missed.join('·')}` : '');
    }),
    durationSec: sec,
  };
  const anchor = $('#rSubmitAnchor');
  if (!(window.ResultCollector && ResultCollector.attach) || !anchor) return;
  try {
    const btn = ResultCollector.attach(anchor, () => lastResult, {
      id: 'rcBtn', className: 'btn btn-primary',
      mode: lastResult.mode,
      extra: ['KAI 생산기술 직무 모의면접', `모의면접 자기평가 ${pct}점`],
    });
    if (btn) { btn.style.width = '100%'; btn.style.justifyContent = 'center'; btn.textContent = '📤 [모의면접] 자기평가 결과 제출'; }
  } catch (e) { console.warn('ResultCollector', e); }
}

/* ══════════════ 아래 안내 — 공식 주소 (L10 이 KAI.links 에 채움) ══════════════ */
function setLinks() {
  const L = KAI.links || {};
  [['#lnkRecruit', L.recruit || L.kai], ['#lnkPortal', L.portal]].forEach(([sel, url]) => {
    const a = $(sel); if (!a) return;
    if (url && /^https?:\/\//.test(url)) { a.href = url; a.classList.remove('nolink'); a.onclick = null; }
    else {
      a.href = '#'; a.classList.add('nolink'); a.title = '공식 주소를 확인하고 있습니다';
      a.onclick = e => { e.preventDefault(); a.textContent = a.textContent.replace(/( — 주소 확인 중)?$/, ' — 주소 확인 중'); };
    }
  });
}

/* ══════════════ 시작 ══════════════ */
window.KAIApp = { go, TOOL };
setLinks();
route();
/* 계급 카드는 rank.js 가 app.js 뒤에 불러와지므로, 다 불러온 뒤 홈을 한 번 더 그림 */
window.addEventListener('load', () => { if (curView === 'home' && !run) route(); });
})();
