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
/* 화면에 보이는 순서 = 면접에서 먼저·자주 묻는 것부터 (자기소개·지원동기 → 선배 후기 → 인성 → 기술) */
const PLAN_I = [
  ['I4', 'company', '회사·직무 — 자기소개·지원 동기·마지막 한마디'],
  ['I5', 'hr',      '복원 질문 ① 인성면접 — 20년 뒤·가치관·직장·부당한 대우'],
  ['I6', 'pt',      '복원 질문 ② PT·실무면접 — 희망 직무·작품 심층 질문·자동화'],
  ['I3', 'hr',      '인성·상황면접 — 협업·안전·품질·갈등'],
  ['I1', 'tech',    '기술면접 ① 조립·체결·치구·도면'],
  ['I2', 'tech',    '기술면접 ② 재료·부식·실링·복합재·NDT'],
];
const KIND = { company: '🏢 회사·직무', hr: '🤝 인성·상황', pt: '📊 PT·실무', tech: '🔧 기술면접' };
/* ⭐ 필수 단원 — 면접에 가장 자주 이어지는 기본. 단원 목록에서 앞에 둡니다. 나머지는 심화 */
const CORE_UNITS = ['L1', 'L2', 'L7', 'L9', 'L10'];
const isCoreUnit = id => CORE_UNITS.includes(id);
/* 면접 질문의 "중요" = ⭐ 필수(core) + 🔁 복원 질문(heard: 선배 응시 후기로 되살린 질문 — 기출 아님) */
const isImp = it => !!(it && (it.core || it.heard));

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
  return out.filter(u => isCoreUnit(u.id)).concat(out.filter(u => !isCoreUnit(u.id)));
}
/* 용어는 ⭐핵심을 앞으로 (원래 순서는 유지) */
const termsSorted = u => (u.terms || []).filter(t => t.core).concat((u.terms || []).filter(t => !t.core));
function learnById(id) { return KAI.learn.find(u => u && u.id === id); }
function ivList() {
  const got = {}; KAI.iv.forEach(s => { if (s && s.id) got[s.id] = s; });
  const out = PLAN_I.map(([id, kind, title]) => got[id] || { id, kind, title, soon: true, items: [] });
  KAI.iv.filter(s => s && !PLAN_I.some(p => p[0] === s.id)).sort(byOrder).forEach(s => out.push(s));
  return out;
}
function allQs() {              // [{ set, item, qid, n }]
  const out = [];
  ivList().forEach(set => {
    const one = (set.items || []).map((item, i) => ({ set, item, qid: `${set.id}-${i + 1}`, n: i + 1 }));
    /* ⭐ 필수 → 🔁 복원 질문 → 나머지 순서 */
    const rank = q => q.item.core ? 0 : q.item.heard ? 1 : 2;
    one.sort((a, b) => rank(a) - rank(b) || a.n - b.n).forEach(q => out.push(q));
  });
  return out;
}

/* ══════════════ 화면 전환 — 주소 뒤 #보기/인자 ══════════════ */
let curView = 'home';
function go(h) { if (location.hash === '#' + h) route(); else location.hash = h; }
function route() {
  stopTimer();
  recRelease();                  // 화면을 옮기면 마이크를 닫고 녹음을 지운다
  const [view, arg] = decodeURIComponent(location.hash.slice(1) || 'home').split('/');
  curView = ['home', 'learn', 'field', 'quiz', 'iv', 'pt', 'sum'].includes(view) ? view : 'home';
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === curView));
  document.body.classList.toggle('v-sum', curView === 'sum');
  const v = $('#view');
  v.innerHTML = '';
  try {
    if (curView === 'home')  renderHome(v);
    if (curView === 'learn') arg ? renderUnit(v, arg) : renderLearn(v);
    if (curView === 'field') renderField(v, arg || 'all');
    if (curView === 'quiz')  renderQuiz(v, arg);
    if (curView === 'iv')    renderIv(v, arg || 'all');
    if (curView === 'pt')    renderPt(v);
    if (curView === 'sum')   renderSum(v);
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
  const coreQ = Q.filter(q => isImp(q.item)), heardN = Q.filter(q => q.item.heard).length;
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
        <span>질문만 보고 ${SPEAK_SEC}초 동안 말하기 → 모범 답변과 비교. ⭐ 필수 질문부터.</span></button>
      <button class="step" data-go="pt"><div class="no">STEP 4</div><b>📊 PT 면접 준비</b>
        <span>고등학교 때 만든 작품·프로젝트로 발표를 짜고, 심층 질문에 대비합니다.</span></button>
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
      ${coreQ.length ? `<button class="btn btn-core" id="hmCore">⭐ 중요 질문 ${coreQ.length}개 연습</button>` : ''}
      ${flagN ? `<button class="btn" id="hmFlag">📌 다시 볼 질문 ${flagN}개 연습</button>` : ''}
      <button class="btn" id="hmSum">🖨 면접 전날 A4 요약</button>
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
      <li><span class="pill core">⭐ 필수</span> 표시는 <b>가장 먼저 익힐 것</b>입니다 — 필수 단원·핵심 용어·필수 질문을 앞에 두었습니다.</li>
      <li>면접 질문은 <b>예상 질문</b>과 <b>복원 질문</b>입니다. <span class="pill heard">🔁 복원 질문 · 중요</span> ${heardN}개는
        실제 기출(공식 공개 문제)이 아니라 <b>선배들의 응시 후기로 되살린 질문</b>이라 중요하게 표시했습니다.
        해마다 달라질 수 있으니 답을 통째로 외우지 말고 답의 구조를 익히세요.</li>
      <li>이론은 국토교통부 항공정비 표준교재 등을 <b>요약·재서술</b>했고 출처 쪽번호를 적었습니다.
        <span class="pill real">교재 밖 실무 지식</span> 딱지는 교재에 없는 일반 현장 지식입니다.</li>
      <li><b>모든 내용은 참고 자료입니다.</b> 적힌 출처(교재 쪽번호·공식 홈페이지·후기)를 직접 다시 확인하고,
        모자란 부분은 교재와 공식 자료로 <b>더 찾아 공부</b>해야 합니다.</li>
      <li>모범 답변의 <b>[ ]</b> 칸은 여러분의 경험(현장실습·동아리·자격증 준비)으로 바꿔 말하세요.</li>
      <li>기록은 이 기기에만 저장됩니다. 공용 PC 라면 끝나고 왼쪽 아래 🧹 기록 초기화를 누르세요.</li>
    </ul>
  </div>`));

  v.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  const m = $('#hmMock'); if (m) m.onclick = () => startMock();
  const c = $('#hmCore'); if (c) c.onclick = () => startRun(allQs().filter(q => isImp(q.item)), '⭐ 중요 질문(필수 + 복원 질문)');
  const f = $('#hmFlag'); if (f) f.onclick = () => startRun(allQs().filter(q => ST.flag[q.qid]), '📌 다시 볼 질문');
  $('#hmSum').onclick = () => go('sum');
}

/* ══════════════ 배우기 — 단원 목록 ══════════════ */
function renderLearn(v) {
  const L = learnList();
  v.appendChild(el(`<div class="card">
    <h2>📖 배우기</h2>
    <div class="muted">단원을 고르면 요약 → <b>⭐ 먼저 익힐 핵심 용어</b> → 소제목별 정리 → 전체 용어 → 현장 대응표 순서로 보여 줍니다.
      다 읽었으면 단원 끝의 <b>✅ 다 읽었어요</b>를 누르세요.</div>
  </div>`));
  const groups = [
    ['⭐ 필수 단원 — 먼저 읽으세요', '면접에서 가장 자주 이어지는 기본(기체 구조·리벳·도면·생산기술 실무·KAI 회사)', L.filter(u => isCoreUnit(u.id)), true],
    ['📘 심화 단원 — 필수를 읽은 다음에', '패스너·부식·복합재·비파괴검사·금속재료', L.filter(u => !isCoreUnit(u.id)), false],
  ];
  groups.forEach(([gt, gs, list, core]) => {
  if (!list.length) return;
  v.appendChild(el(`<div class="ugroup ${core ? 'core' : ''}"><b>${gt}</b><span>${gs}</span></div>`));
  const grid = el('<div class="units"></div>');
  list.forEach(u => {
    if (u.soon) {
      grid.appendChild(el(`<div class="unit soon"><div class="em">${u.emoji}</div><div>
        <div class="t">${esc(u.title)}</div><div class="meta"><span class="pill">준비 중</span></div></div></div>`));
      return;
    }
    const b = el(`<button class="unit ${ST.read[u.id] ? 'read' : ''} ${core ? 'coreu' : ''}"><div class="em">${u.emoji || '📘'}</div><div>
      <div class="t">${core ? '<span class="pill core">⭐ 필수</span> ' : ''}${txt(u.title)}</div>
      <div class="s">${txt(u.summary || '')}</div>
      <div class="meta">
        <span class="pill blue">소제목 ${(u.sections || []).length}</span>
        <span class="pill">용어 ${(u.terms || []).length} · ⭐핵심 ${(u.terms || []).filter(t => t.core).length}</span>
        <span class="pill">대응표 ${(u.field || []).length}</span>
        ${ST.read[u.id] ? '<span class="pill ok">✅ 읽음</span>' : ''}
      </div></div></button>`);
    b.onclick = () => go('learn/' + u.id);
    grid.appendChild(b);
  });
  v.appendChild(grid);
  });
}

/* ══════════════ 그림·사진·영상 (data/fig1~3.js · data/media.js) ══════════════
   KAI.media['L2-7'] = { fig, photos:[{src,alt,cap,credit,license,url}], videos:[{title,url,by,note}] } — 키 = 단원-절번호(1부터) */
function mediaOf(uid, i) { const M = KAI.media || {}; return M[`${uid}-${i + 1}`] || {}; }
function photosHtml(list) {
  if (!(list || []).length) return '';
  return `<div class="photos">${list.map(p => `<figure class="photo">
    <a href="${esc(p.url || p.src)}" target="_blank" rel="noopener"><img src="${esc(p.src)}" alt="${esc(p.alt || p.cap || '')}" loading="lazy"></a>
    <figcaption>${txt(p.cap || '')}<small>📷 ${esc(p.credit || '')}${p.license ? ` · ${esc(p.license)}` : ''}</small></figcaption></figure>`).join('')}</div>`;
}
function videosHtml(list) {
  if (!(list || []).length) return '';
  return `<div class="videos">${list.map(vd => `<a class="video" href="${esc(vd.url)}" target="_blank" rel="noopener">
    <b>▶ ${esc(vd.title)}</b><span>${esc(vd.by || '')}${vd.note ? ` — ${esc(vd.note)}` : ''}</span></a>`).join('')}
    <div class="muted" style="font-size:12px">🔗 외부 영상입니다. 올린 곳에서 지우면 열리지 않을 수 있습니다.</div></div>`;
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
      <h2>${isCoreUnit(u.id) ? '<span class="pill core">⭐ 필수 단원</span> ' : ''}${txt(u.title)}</h2>
      <div>${txt(u.summary || '')}</div>
    </div></div>
    ${src ? `<div class="src"><b>출처</b><ul style="margin:2px 0 0;padding-left:18px">${src}</ul>
      <div class="refnote">📌 참고용 요약입니다. 출처(교재 쪽번호·공식 자료)를 직접 확인하고, 모자란 부분은 원문으로 더 공부하세요.</div></div>` : ''}
    <div class="toc">${secs.map((s, i) => `<a href="javascript:void 0" data-sec="${i}">${i + 1}. ${txt(s.h)}</a>`).join('')}
      ${(u.terms || []).length ? '<a href="javascript:void 0" data-sec="terms">📘 용어</a>' : ''}
      ${(u.field || []).length ? '<a href="javascript:void 0" data-sec="field">🏭 현장 대응표</a>' : ''}</div>
  </div>`);
  v.appendChild(head);

  const coreT = (u.terms || []).filter(t => t.core);
  if (coreT.length) {
    v.appendChild(el(`<div class="card corebox">
      <h3>⭐ 먼저 익힐 핵심 용어 ${coreT.length}개</h3>
      <div class="muted" style="margin-bottom:8px">면접에서 가장 자주 쓰이는 기본 용어입니다. 이 뜻부터 입으로 설명할 수 있게 익히세요.</div>
      <div class="terms">${coreT.map(t => `<div class="term core"><b>⭐ ${txt(t.t)}</b><span>${txt(t.d)}</span></div>`).join('')}</div>
    </div>`));
  }

  secs.forEach((s, i) => {
    const m = mediaOf(u.id, i), fig = s.fig || m.fig || '';
    v.appendChild(el(`<div class="card sec" id="sec-${i}">
      <h3><span class="num">${i + 1}</span> ${txt(s.h)} ${s.basis === '실무' ? '<span class="pill real">교재 밖 실무 지식</span>' : ''}</h3>
      ${s.body ? `<div class="body">${s.body}</div>` : ''}
      ${(s.points || []).length ? `<ul class="pts">${s.points.map(p => `<li>${txt(p)}</li>`).join('')}</ul>` : ''}
      ${fig ? `<div class="fig">${fig}${m.cap && !s.fig ? `<div class="figtxt">${txt(m.cap)}</div>` : ''}<div class="figcap">✏️ 직접 그린 개념도 — 교재 내용을 바탕으로 새로 그렸습니다(비율·치수는 개념용)</div></div>` : ''}
      ${photosHtml(m.photos)}${videosHtml(m.videos)}
    </div>`));
  });

  if ((u.terms || []).length) {
    v.appendChild(el(`<div class="card" id="sec-terms"><h3>📘 용어 ${u.terms.length}개 <span class="muted" style="font-size:13px;font-weight:600">— ⭐ 핵심 먼저</span></h3>
      <div class="terms">${termsSorted(u).map(t => `<div class="term ${t.core ? 'core' : ''}"><b>${t.core ? '⭐ ' : ''}${txt(t.t)}</b><span>${txt(t.d)}</span></div>`).join('')}</div>
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
  const imp = Q.filter(q => isImp(q.item)), heard = Q.filter(q => q.item.heard);

  v.appendChild(el(`<div class="card">
    <h2>🎤 면접 연습</h2>
    <div class="muted">질문을 눌러 펼치면 <b>면접관이 확인하려는 것 · STAR 구조 · 키워드 · 모범 답변 · 꼬리 질문</b>이 나옵니다.
      <b>🎤 말하기 연습</b>은 질문만 보여 주고 ${SPEAK_SEC}초를 잽니다 — 실제로 소리 내어 답한 뒤 스스로 평가하세요.</div>
    <div class="muted" style="margin-top:6px">🎙 <b>녹음</b>이 켜져 있으면(처음 한 번 마이크 허용) 내 답변을 바로 <b>다시 들어 볼 수 있습니다</b>.
      녹음은 이 기기 화면에만 있고 어디에도 보내거나 저장하지 않으며, 연습을 끝내면 지워집니다. 연습 화면에서 끌 수 있습니다.</div>
    <div class="explain" style="margin-top:8px"><span class="pill core">⭐ 필수</span> 누구나 받는 기본 질문 ·
      <span class="pill heard">🔁 복원 질문 · 중요</span> 실제 기출은 아니지만 선배들의 응시 후기로 되살린 질문 — 둘 다 <b>묶음마다 앞에</b> 두었습니다.</div>
    <div class="row" style="margin-top:10px">
      <button class="btn btn-core" id="ivCore" ${imp.length ? '' : 'disabled'}>⭐ 중요 질문 ${imp.length}개 말하기 연습</button>
      <button class="btn btn-primary" id="ivMock" ${Q.length ? '' : 'disabled'}>🎲 무작위 모의면접 ${MOCK_N}문항</button>
      <button class="btn" id="ivFlag" ${flagged.length ? '' : 'disabled'}>📌 다시 볼 질문 ${flagged.length}개 연습</button>
      <button class="btn" id="ivSum">🖨 면접 전날 A4 요약</button>
    </div>
  </div>`));
  $('#ivSum').onclick = () => go('sum');
  $('#ivMock').onclick = () => startMock();
  $('#ivCore').onclick = () => startRun(allQs().filter(q => isImp(q.item)), '⭐ 중요 질문(필수 + 복원 질문)');
  $('#ivFlag').onclick = () => startRun(allQs().filter(q => ST.flag[q.qid]), '📌 다시 볼 질문');

  const chips = el('<div class="chips"></div>');
  [['all', '전체', Q.length], ['imp', '⭐ 중요 질문', imp.length], ['heard', '🔁 복원 질문', heard.length],
   ['company', KIND.company, cnt('company')], ['hr', KIND.hr, cnt('hr')], ['pt', KIND.pt, cnt('pt')],
   ['tech', KIND.tech, cnt('tech')], ['flag', '📌 다시 볼 질문', flagged.length]]
    .forEach(([k, name, n]) => chips.appendChild(el(`<button class="chip ${pick === k ? 'on' : ''}" data-k="${k}" id="ivChip-${k}">${name}<span class="n">${n}</span></button>`)));
  v.appendChild(chips);
  chips.querySelectorAll('.chip').forEach(c => c.onclick = () => go('iv/' + c.dataset.k));

  if (pick === 'imp' || pick === 'heard') {
    const list = pick === 'imp' ? imp : heard;
    v.appendChild(el(`<div class="card explain">${pick === 'imp'
      ? '⭐ 필수 질문과 🔁 복원 질문을 모았습니다. 면접 전날에는 이것부터 소리 내어 답해 보세요.'
      : '🔁 복원 질문은 실제 기출(공식 공개 문제)이 아니라 <b>선배들의 응시 후기로 되살린 질문</b>입니다. 누가 언제 들은 질문인지 각 질문 안에 적었습니다. 해마다 달라질 수 있습니다.'}</div>`));
    const box = el('<div class="ivset"></div>');
    list.forEach(q => box.appendChild(qDetails(q, true)));
    v.appendChild(box);
    return;
  }
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

/* ══════════════ 🖨 면접 전날 A4 요약 (#sum) ══════════════
   ⭐ 중요 질문(필수+복원)과 답에 넣을 키워드, 단원별 ⭐ 핵심 용어를 A4 두 장 안팎에 모은다.
   질문·용어는 데이터에서 그대로 뽑고, 「KAI 한눈에」만 L10(2026-09-30 공식 홈페이지 확인)에서 옮겨 적었다 — L10 을 고치면 여기도. */
const SUM_KAI = [
  '<b>대한민국 대표 항공우주 체계종합업체</b> — 설계·개발부터 생산·군수지원까지 전체를 책임',
  '<b>1999.10.1 설립</b> · 본사 <b>경남 사천</b> · 사업: 항공·우주·애프터마켓(정비·성능개량)',
  '제품: <b>KT-1</b>(기본훈련기) · <b>T-50</b>(최초 국산 초음속) · <b>KF-21 보라매</b> · <b>수리온</b>(최초 국산 헬기) · 미르온(LAH)',
  '우주: 위성, <b>누리호 총조립</b> · 기체 구조물: 보잉·에어버스 날개·동체(A350 날개 리브 설계승인권)',
  '생산: 복합재 가공 → 구조물 제작 → 최종 조립 → 도장 · 품질 <b>AS9100</b> 인증',
  '사명: 사람과 기술을 연결하여 하늘과 우주를 향한 인류의 가치를 실현 · 비전: <b>글로벌 항공우주 Big 4</b>',
  '핵심가치: 고객에 대한 <b>신뢰와 존중</b> · 기술에 대한 <b>도전과 혁신</b> · 협업을 위한 <b>소통과 화합</b>',
  '인재상: <b>창조 · 도전 · 협동</b> — 자기소개·지원동기에서 내 경험과 연결해 말하기',
];
function renderSum(v) {
  const imp = allQs().filter(q => isImp(q.item));
  const units = learnList().filter(u => !u.soon && (u.terms || []).some(t => t.core));
  const nTerm = units.reduce((s, u) => s + u.terms.filter(t => t.core).length, 0);
  const d = new Date(), today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  v.appendChild(el(`<div class="sumbar">
    <button class="btn btn-primary" id="smPrint">🖨 인쇄 · PDF로 저장</button>
    <button class="btn" id="smBack">← 면접 연습으로</button>
    <span class="muted">A4 두 장 안팎입니다. 인쇄 창에서 대상(프린터)을 「PDF로 저장」으로 고르면 파일로 남습니다.</span>
  </div>`));
  v.appendChild(el(`<div class="sum">
    <h1>✈️ KAI 면접 전날 요약 — 생산기술·기체 조립</h1>
    <div class="ssub">KAI 면접 마스터 · 뽑은 날 ${today} · 참고 자료입니다 — 회사 정보는 면접 직전에 공식 홈페이지에서 다시 확인하세요.</div>
    <h2>🏢 KAI 한눈에 (2026-09-30 공식 홈페이지 확인)</h2>
    <ul class="kai">${SUM_KAI.map(s => `<li>${s}</li>`).join('')}</ul>
    <h2>🗣 답변 틀 — 60초</h2>
    <div class="flow"><b>결론 먼저</b> → <b>이유·경험</b>(상황→과제→행동→결과) → <b>입사 후 어떻게</b> ·
      모범 답변의 [ ] 칸은 <b>내 경험</b>(현장실습·동아리·자격증·작품)으로 · 모르는 건 "정확히는 모르지만 ○○로 알고 있고, 입사 후 바로 확인하겠습니다"</div>
    <h2>⭐ 중요 질문 ${imp.length}개 — 답에 꼭 넣을 키워드 (🔁 = 선배 후기로 되살린 복원 질문, 기출 아님)</h2>
    <div class="cols"><ol class="sq">${imp.map(q => `<li>${q.item.heard ? '🔁 ' : ''}${txt(q.item.q)}
      ${(q.item.keys || []).length ? `<span class="k">▸ ${q.item.keys.map(txt).join(' · ')}</span>` : ''}</li>`).join('')}</ol></div>
    <h2 class="pb">⭐ 핵심 용어 ${nTerm}개 — 뜻을 입으로 설명할 수 있게</h2>
    <div class="cols">${units.map(u => `<div class="su"><b class="u">${esc(u.emoji || '')} ${esc(u.id)} ${txt(u.title.split(' — ')[0])}</b>
      ${u.terms.filter(t => t.core).map(t => `<div><b>${txt(t.t)}</b> — ${txt(t.d)}</div>`).join('')}</div>`).join('')}</div>
  </div>`));
  $('#smPrint').onclick = () => window.print();
  $('#smBack').onclick = () => go('iv');
}

/* 질문 하나 — 아코디언 */
function qDetails(q, showSet) {
  const it = q.item, me = ST.self[q.qid];
  const d = el(`<details class="q ${isImp(it) ? 'imp' : ''}"><summary>
      <span class="n">${esc(q.set.id)}-${q.n}</span>
      <span class="qt">${it.core ? '<span class="pill core">⭐ 필수</span> ' : ''}${it.heard ? '<span class="pill heard">🔁 복원 · 중요</span> ' : ''}${txt(it.q)}
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
    ${it.heard ? `<div class="heardline">🔁 <b>복원 질문 · 중요</b> — 실제 기출이 아니라 선배 응시 후기로 되살린 질문입니다.<br><span>${txt(it.heard)}</span></div>` : ''}
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

/* 🎙 답변 녹음 — 마이크 소리는 이 기기의 화면 메모리에만 두고 어디에도 보내거나 저장하지 않는다.
   켜 두면(기본) 질문이 나올 때 녹음을 시작해 「답변 마침」·시간 종료에 멈추고, 평가 화면에서 다시 듣는다.
   연습이 끝나면 결과 화면에서 문항별로 다시 들을 수 있고, 다른 화면으로 가거나 새 연습을 시작하면 지운다.
   마이크는 연습하는 동안만 열어 두고(질문마다 허용을 다시 묻지 않게) 연습이 끝나면 닫는다. */
const REC = { stream: null, rec: null, chunks: [], urls: [], err: '' };
const recOK = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
const recOn = () => ST.recOn !== false && recOK();
function recStart() {
  if (!recOn()) return Promise.resolve(false);
  if (REC.rec) return Promise.resolve(true);
  const get = REC.stream ? Promise.resolve(REC.stream)
    : navigator.mediaDevices.getUserMedia({ audio: true }).then(s => (REC.stream = s));
  return get.then(s => {
    /* 허용 창을 기다리는 사이 연습을 그만뒀거나 녹음을 껐으면 마이크를 바로 닫는다 */
    if (!run || !recOn()) { recCloseMic(); return false; }
    if (REC.rec) return true;
    REC.chunks = []; REC.err = '';
    REC.rec = new MediaRecorder(s);
    REC.rec.ondataavailable = e => { if (e.data && e.data.size) REC.chunks.push(e.data); };
    REC.rec.start();
    return true;
  }).catch(e => { REC.err = (e && e.name) || 'Error'; REC.rec = null; return false; });
}
function recStop() {             // → { url, type } 또는 null
  const r = REC.rec;
  REC.rec = null;
  if (!r || r.state === 'inactive') return Promise.resolve(null);
  return new Promise(res => {
    r.onstop = () => {
      const blob = new Blob(REC.chunks, { type: r.mimeType || 'audio/webm' });
      if (!blob.size) return res(null);
      const url = URL.createObjectURL(blob);
      REC.urls.push(url);
      res({ url, type: blob.type });
    };
    try { r.stop(); } catch (e) { res(null); }
  });
}
function recCloseMic() {
  if (REC.rec && REC.rec.state !== 'inactive') { try { REC.rec.stop(); } catch (e) {} }
  REC.rec = null;
  if (REC.stream) { REC.stream.getTracks().forEach(t => t.stop()); REC.stream = null; }
}
function recRelease() { recCloseMic(); REC.urls.forEach(u => URL.revokeObjectURL(u)); REC.urls = []; }
function recFileName(q, clip) {
  const ext = /mp4|aac|m4a/.test(clip.type) ? 'm4a' : /ogg/.test(clip.type) ? 'ogg' : 'webm';
  return `KAI면접_${q.set.id}-${q.n}_내답변.${ext}`;
}
function recPlayer(q, clip) {
  return `<audio controls preload="metadata" src="${clip.url}"></audio>
    <a class="muted" href="${clip.url}" download="${esc(recFileName(q, clip))}">💾 파일로 저장</a>`;
}
function recMsg() {
  if (!recOK()) return '이 브라우저는 녹음을 지원하지 않아 녹음 없이 진행합니다.';
  if (REC.err === 'NotAllowedError') return '마이크가 막혀 있어 녹음 없이 진행합니다 — 주소창 왼쪽 자물쇠에서 마이크를 허용하세요.';
  if (REC.err === 'NotFoundError') return '마이크를 찾지 못해 녹음 없이 진행합니다.';
  if (REC.err) return '녹음을 시작하지 못해 녹음 없이 진행합니다.';
  return '';
}

function startMock() {
  const Q = allQs();
  if (!Q.length) return;
  // 분류마다 하나씩 먼저 뽑고 나머지를 무작위로 채움
  const pickd = [], seen = new Set();
  ['company', 'hr', 'pt', 'tech'].forEach(k => {
    const c = shuffle(Q.filter(q => q.set.kind === k))[0];
    if (c) { pickd.push(c); seen.add(c.qid); }
  });
  shuffle(Q.filter(q => !seen.has(q.qid))).forEach(q => { if (pickd.length < MOCK_N) pickd.push(q); });
  startRun(shuffle(pickd.slice(0, MOCK_N)), `🎲 무작위 모의면접 ${Math.min(MOCK_N, pickd.length)}문항`);
}

function startRun(list, title) {
  if (!list || !list.length) return;
  stopTimer();
  recRelease();                  // 지난 연습의 녹음은 지운다
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
      <span class="pill">${esc(KIND[q.set.kind] || '')}</span><span class="pill">${esc(q.set.id)}-${q.n}</span>
      ${q.item.core ? '<span class="pill core">⭐ 필수</span>' : ''}${q.item.heard ? '<span class="pill heard">🔁 복원 · 중요</span>' : ''}</div>`;
}
function bindQuit(v) {
  v.querySelector('[data-a="quit"]').onclick = () => { stopTimer(); recRelease(); run = null; go('iv'); };
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
    <div class="recbar">
      <button class="btn btn-sm" id="rcTog"></button>
      <span id="rcState" class="muted"></span>
    </div>
    <div class="row" style="margin-top:12px">
      <button class="btn btn-primary" id="rnDone">답변 마침 → 모범 답변 보기</button>
    </div>
  </div>`);
  v.appendChild(card);
  bindQuit(v);
  window.scrollTo(0, 0);

  let t0 = 0, done = false;
  const paintRec = () => {
    const tog = $('#rcTog'), st = $('#rcState');
    if (!tog) return;
    tog.textContent = recOn() ? '🎙 녹음 켜짐' : '🎙 녹음 꺼짐';
    tog.classList.toggle('on', recOn());
    tog.disabled = !recOK();
    st.innerHTML = REC.rec ? '<span class="recdot"></span> 녹음 중 — 끝나면 바로 다시 들을 수 있어요'
      : recOn() && !t0 ? '마이크 준비 중… 허용 창이 뜨면 「허용」을 누르세요'
      : recMsg() || (recOn() ? '' : '녹음 없이 연습합니다. 켜면 내 답변을 다시 들어 볼 수 있어요.');
  };
  const begin = () => {
    if (done || t0 || !run || run.list[run.i] !== q || !card.isConnected) return;
    t0 = Date.now();
    paintRec();
    startTimer(SPEAK_SEC, t0, () => finish(true));
  };
  const finish = timeUp => {
    if (done) return;
    done = true;
    const used = t0 ? Math.min(SPEAK_SEC, Math.round((Date.now() - t0) / 1000)) : 0;
    stopTimer();
    $('#rnDone').disabled = true;
    recStop().then(clip => { if (run && run.list[run.i] === q) drawRunA(used, timeUp, clip); });
  };
  $('#rnDone').onclick = () => finish(false);
  $('#rcTog').onclick = () => {
    ST.recOn = !recOn(); save();
    if (ST.recOn) recStart().then(() => { if (!t0) begin(); paintRec(); });
    else { recCloseMic(); if (!t0) begin(); paintRec(); }
  };
  paintRec();
  /* 녹음이 켜져 있으면 마이크가 준비된 뒤(처음엔 허용 창) 시간을 재기 시작한다 */
  if (recOn()) recStart().then(begin); else begin();
}

/* 남은 시간 표시 — 숨은 탭에서 느려져도 시각으로 계산 */
function startTimer(sec, t0, onEnd, msg) {
  stopTimer();
  const M = Object.assign({ run: '소리 내어 답해 보세요', low: '마무리하세요 — 마지막 한 문장', lowAt: 10 }, msg || {});
  const paint = () => {
    const tt = $('#tt'), tb = $('#tb'), th = $('#thint');
    if (!tt) return stopTimer();
    const left = Math.max(0, sec - (Date.now() - t0) / 1000);
    tt.textContent = fmtSec(Math.ceil(left));
    tb.style.width = (left / sec * 100) + '%';
    const low = left <= M.lowAt;
    tt.classList.toggle('low', low); tb.classList.toggle('low', low);
    th.textContent = low ? M.low : M.run;
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

function drawRunA(used, timeUp, clip) {
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
  if (clip) v.appendChild(el(`<div class="card recplay">
    <h3>🎧 내 답변 다시 듣기</h3>
    <div class="recrow">${recPlayer(q, clip)}</div>
    <div class="muted">면접관이 되었다고 생각하고 들어 보세요 — 결론이 먼저 나왔나, "음…"이 많지 않나, 목소리 크기·속도는 괜찮나.
      들은 뒤 아래 키워드에 체크하세요. 녹음은 <b>이 화면에만</b> 있고 어디에도 보내지지 않으며, 연습을 끝내면 지워집니다.</div>
  </div>`));

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
    run.res.push({ q, lv, got: g, total: keys.length, missed, sec: used, autoFlag, clip });
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
  const clips = R.filter(r => r.clip).length;
  recCloseMic();                 // 연습이 끝났으니 마이크는 닫는다(녹음은 이 화면을 떠날 때까지 남김)
  v.innerHTML = '';
  v.appendChild(el(`<div class="card" style="text-align:center">
    <div class="muted">${esc(run.title)}</div>
    <div style="font-size:38px;font-weight:900;color:var(--navy)">${pct}점</div>
    <div class="muted">${n}문항 · 상 ${cnt('상')} · 중 ${cnt('중')} · 하 ${cnt('하')} · ${Math.floor(sec / 60)}분 ${sec % 60}초</div>
    ${flagged ? `<div class="muted" style="margin-top:4px">「하」로 평가한 ${flagged}문항은 📌 다시 볼 질문에 넣었습니다.</div>` : ''}
    <div id="rankBox" style="margin-top:12px"></div>
    <div id="rSubmitAnchor" style="margin-top:12px"></div>
  </div>`));
  v.appendChild(el(`<div class="card"><h3>문항별 자기평가</h3>
    ${clips ? `<div class="muted" style="margin-bottom:8px">🎧 녹음한 답변 ${clips}개를 문항 아래에서 다시 들을 수 있습니다. 다른 화면으로 가면 지워지니 남기려면 「💾 파일로 저장」을 누르세요.</div>` : ''}
    <table class="rtable"><tbody>
    ${R.map((r, i) => `<tr><td><b>${i + 1}.</b> ${txt(r.q.item.q)}
        ${r.missed.length ? `<div class="muted">빠진 키워드: ${r.missed.map(esc).join(', ')}</div>` : ''}
        ${r.clip ? `<div class="recrow">${recPlayer(r.q, r.clip)}</div>` : ''}</td>
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

/* ══════════════ 📊 PT 면접 준비 ══════════════
   근거: 선배 응시 후기(PT면접 — 경력·자격증·성장목표 3가지 필수, 자기소개서 작품 심층 질문 다수)
        + KAI 채용 홈페이지(직무에 따라 PT 심사가 더해질 수 있음, L10).
   작성지는 이 기기에만 저장(ST.pt). 발표 시간·형식은 해마다 다르므로 정하지 않고 고르게 둡니다. */
const PT_PICK = [
  '내가 <b>직접 만든 부분</b>이 크다(팀 작품이면 내 역할을 분명히 말할 수 있다)',
  '<b>재료·부품 → 공구·장비 → 순서</b>를 처음부터 끝까지 설명할 수 있다',
  '<b>실패하고 고친</b> 이야기가 있다',
  '측정값·시간·개수 같은 <b>숫자</b>가 남아 있다',
  '사진·회로도·배선도·실습 기록 같은 <b>증거 자료</b>가 있다',
  '배선·측정·품질·자동화·재료 중 <b>KAI 일과 이어지는 점</b>이 있다',
  '<b>자기소개서에 쓴 내용과 같다</b>(면접관은 자소서를 보며 묻습니다)',
];
/* 우리 학교 KAI 지원자는 전자·반도체재료·전기과(사용자 안내, 2026-09-30).
   KAI 와 잇는 법의 📖 표시는 이 도구의 배우기 단원, 나머지는 일반 지식 — 실제 배치 공정은 공고·회사 안내로 확인. */
const PT_DEPTS = [
  { k: '전자', em: '🔌', cert: '전자기기기능사 · 전자캐드기능사',
    topics: ['아두이노·센서 작품(자동 조명·거리 경보·스마트 화분 등)', '전자캐드로 PCB 설계 → 납땜해 만든 회로', '오실로스코프·멀티미터로 한 회로 측정 실험',
      'IoT 장치·앱 연동 프로젝트', '전자기기기능사 실기 과제', '동아리 로봇·드론의 전자 부분(배선·제어기)'],
    link: ['납땜·커넥터 작업의 정밀한 손작업과 규격 확인 → 조립 현장의 체결·배선 작업 태도와 같음',
      '측정기로 재고 기록하는 습관 → 조립 현장의 검사·기록(📖 L7·L9)',
      '와전류검사는 코일·교류·임피던스 원리 — 전자 수업 내용과 바로 이어짐(📖 L6)',
      '정전기(ESD)·부품 취급 습관 → 민감한 항공 전자 부품을 다루는 기본(일반 지식)'],
    deep: ['회로는 직접 설계했나요? 부품은 어떻게 골랐나요?', '납땜 불량(냉납·쇼트)은 어떻게 찾고 고쳤나요?', '센서 값이 이상할 때 어디부터 점검했나요?',
      '무엇으로 측정했고, 값은 얼마였나요?', '다시 만든다면 회로에서 무엇을 바꾸겠어요?'] },
  { k: '반도체재료', em: '🔬', cert: '반도체설비보전기능사',
    topics: ['학교에서 한 공정 실습(세정·산화·사진·식각·증착 등 배운 것 중)', '재료 관찰·측정 실험(현미경·두께·저항 측정)', '클린룸·방진복 수칙을 지키며 한 실습',
      '공정 데이터 기록·그래프 분석 프로젝트', '반도체 설비 보전 실습(진공·펌프·센서 점검)', '현장실습에서 맡은 공정·검사'],
    link: ['표면처리(아노다이징·알로다이징)와 화학약품 MSDS 안전 → 반도체 공정의 약품·표면 이야기와 닮음(📖 L4)',
      '클린룸 수칙 → 복합재 적층 클린룸의 출입·오염 관리(📖 L5)',
      '공정 조건(온도·시간·압력)을 지키고 기록하는 습관 → 오토클레이브 경화 곡선·열처리 관리(📖 L5·L8)',
      '측정·데이터로 판단 → 품질 관리·비파괴검사(📖 L6·L9)'],
    deep: ['그 공정의 조건(온도·시간)은 어떻게 정했나요?', '오염이나 불량이 생기면 원인을 어떻게 찾나요?', '클린룸에서 가장 중요한 수칙은 무엇인가요?',
      '측정값이 기준을 벗어나면 어떻게 하나요?', '약품 안전은 어떻게 지켰나요?'] },
  { k: '전기', em: '⚡', cert: '전기기능사',
    topics: ['PLC·시퀀스로 만든 제어반(컨베이어·신호등·자동문 모형)', '전동기 정·역회전 제어 회로', '옥내 배선·분전반 실습 작품',
      '태양광 충전·자동 조명 장치', '전기기능사 실기 과제(배관·배선)', '현장실습에서 맡은 배선·설비 점검'],
    link: ['항공기에도 전선 다발(와이어 하네스)·커넥터가 많이 들어감 → 배선도 읽기·결선·단자 압착 경험이 이어짐(일반 지식)',
      '구조물끼리 전기로 이어 주는 본딩 자리는 표면 피막을 벗겨야 함 — 접지·본딩 개념(📖 L4)',
      'PLC·시퀀스 → 로봇 드릴링(RDS)·도장 자동화 같은 자동화 설비의 운영·이상 발견(📖 L10)',
      '절연·도통 측정, 전원 차단·표지 같은 전기 안전 습관 → 현장 안전 수칙'],
    deep: ['배선은 어떤 순서로 했나요? 배선도는 직접 그렸나요?', '동작이 안 될 때 어디부터 점검했나요?', '절연·도통은 무엇으로 어떻게 확인했나요?',
      '전기 안전(전원 차단·보호구)은 어떻게 지켰나요?', '다시 만든다면 회로·배선에서 무엇을 바꾸겠어요?'] },
];
const PT_SLIDES = [
  ['표지', '제목 한 줄 — 예) "확인하는 습관으로 만든 ○○". 이름·학교 표시는 안내문대로', ''],
  ['나는 이런 사람', '강점 한 문장 + 그 강점을 보여 줄 작품 예고', ''],
  ['경력', '현장실습·대회·동아리·프로젝트 — 기간·맡은 역할·한 일', 'must'],
  ['작품 소개', '무엇을 · 왜(해결하려던 문제) · 언제 만들었나', ''],
  ['설계', '스케치·회로도·배선도·공정 조건 — 값과 기준을 어떻게 정했나', ''],
  ['제작 과정', '재료·부품 → 공구·장비 → 순서 (사진). "어떻게 만들고, 어떻게 이었나"까지', ''],
  ['문제와 해결', '실패 → 원인(왜?를 거듭) → 바꾼 방법', ''],
  ['결과', '숫자(측정값·동작 시간·개수)·검사 결과·사용해 본 결과', ''],
  ['자격증', '무엇을 할 수 있다는 증거 — 작품·직무와 연결', 'must'],
  ['성장 목표', '입사 1년·5년·20년 — KAI 현장에서 어떤 사람이 될지', 'must'],
  ['마무리', '면접관이 기억할 한 문장 + 감사 인사', ''],
];
const PT_DEEP = [
  ['왜 그 재료·부품을 골랐나요?', '성질·값·구하기 쉬움을 다른 것과 비교해 말하기'],
  ['어떤 공구·방법으로 만들었나요?', '공구·장비 이름 + 순서. 후기 예: "돌로 만든 얼음을 어떻게 쪼갰나요", "돌을 어떻게 갈았나요" — 전기·전자라면 배선·납땜 순서, 반도체재료라면 공정 순서·조건'],
  ['무엇으로 재고 확인했나요? 값은 얼마였나요?', '캘리퍼스·멀티미터·오실로스코프·현미경 등과 실제 숫자'],
  ['언제, 얼마나 걸려 만들었나요?', '학년·기간·가장 오래 걸린 단계'],
  ['혼자 만들었나요? 본인 역할은?', '팀이면 내 몫을 정확히. 도움받은 부분은 솔직히'],
  ['가장 어려웠던 점은?', '실패 → 원인 → 바꾼 방법 → 지금의 습관'],
  ['안전은 어떻게 지켰나요?', '보안경·절연 장갑·전원 차단·방진복·약품 보호구 등'],
  ['다시 만든다면 무엇을 바꾸겠어요?', '개선점 1~2개 — 스스로 돌아볼 줄 안다는 증거'],
  ['상용화(판매)해 볼 생각은 없었나요?', '원가 · 똑같이 여러 개(표준 공정·치구) · 품질·안전 기준 · 누가 살까'],
  ['이 경험이 KAI 일과 어떻게 이어지나요?', '위 「우리 과 → KAI」 에서 한 가지를 골라 연결'],
];
const PT_FIELDS = [
  ['title',  '발표 제목(한 줄)', '예) 확인하는 습관으로 만든 ○○'],
  ['me',     '나는 이런 사람(강점 한 문장)', '예) 끝까지 확인하는 사람'],
  ['career', '⭐ 경력 — 현장실습·대회·동아리·프로젝트', '언제, 어디서, 무엇을 맡아, 무엇을 했나'],
  ['what',   '작품 — 무엇을 · 왜 · 언제', '해결하려던 문제와 만든 시기'],
  ['design', '설계 — 스케치·회로도·배선도·공정 조건', '값과 기준을 어떻게 정했나'],
  ['make',   '제작 과정 — 재료·부품 → 공구·장비 → 순서', '어떻게 만들고, 어떻게 이었나'],
  ['fix',    '문제와 해결', '실패 → 원인 → 바꾼 방법'],
  ['result', '결과(숫자)', '측정값·동작 시간·개수·검사 결과'],
  ['cert',   '⭐ 자격증 — 무엇을 할 수 있다는 증거', '취득한 것 / 준비 중인 것(시기까지)'],
  ['goal',   '⭐ 성장 목표 — 1년 · 5년 · 20년', 'KAI 현장에서 어떤 사람이 될지'],
  ['end',    '마무리 한 문장', '면접관이 기억할 한 문장'],
];

function renderPt(v) {
  ST.pt = ST.pt || {};
  const ptQ = allQs().filter(q => q.set.kind === 'pt');
  v.appendChild(el(`<div class="card">
    <h2>📊 PT 면접 준비</h2>
    <div class="muted">PT(프레젠테이션) 면접은 <b>고등학교 때 직접 만든 작품이나 프로젝트</b>를 바탕으로 준비하는 것이 좋습니다.
      자기소개서에 쓴 작품을 면접관이 깊게 파고들기 때문입니다.</div>
    <div class="heardline" style="margin-top:10px">🔁 <b>복원 질문 · 중요 — 선배 응시 후기에서</b><br>
      <span>· PT에 <b>경력 · 자격증 · 성장 목표</b> 세 가지는 꼭 들어가야 했다(최근 후기)<br>
      · 자기소개서에 쓴 작품(예: 돌로 만든 얼음)을 만든 이유·방법에 대한 <b>심층 질문이 여러 개</b> 이어졌다(최근 후기)<br>
      · 두 명이 모두 발표를 마친 뒤 질문을 받았다(2024년 후기)</span></div>
    <div class="explain" style="margin-top:8px">📌 KAI 채용 홈페이지는 직무에 따라 실무수행·PT 심사 등이 더해질 수 있고 공고마다 다르다고 안내합니다(📖 L10).
      <b>발표 시간 · 형식(파일/출력물) · 준비물은 해마다 다를 수 있으니 반드시 면접 안내문을 확인</b>하세요.</div>
    <div class="row" style="margin-top:10px">
      <button class="btn btn-core" id="ptQ" ${ptQ.length ? '' : 'disabled'}>🎤 PT·실무 복원 질문 ${ptQ.length}개 말하기 연습</button>
      <a class="btn" href="#iv/pt">질문과 모범 답변 보기</a>
    </div>
  </div>`));

  v.appendChild(el(`<div class="card">
    <h3><span class="num">1</span> 주제 고르기 — 이런 작품이 좋습니다</h3>
    <div class="kcheck pick">${PT_PICK.map((p, i) => `<label class="${ST.pt['pk' + i] ? 'on' : ''}"><input type="checkbox" data-pk="${i}" ${ST.pt['pk' + i] ? 'checked' : ''}> <span>${p}</span></label>`).join('')}</div>
    <div class="muted" style="margin-top:8px" id="ptPickN"></div>
  </div>`));

  const deptBox = el(`<div class="card">
    <h3><span class="num">2</span> 우리 과 → 주제 예시와 KAI 일과 잇는 법</h3>
    <div class="muted" style="margin-bottom:8px">우리 학교 KAI 지원자는 <b>전자·반도체재료·전기과</b>입니다. 내 과를 누르세요.</div>
    <div class="chips" id="ptDept">${PT_DEPTS.map(d => `<button class="chip" data-d="${d.k}">${d.em} ${d.k}과</button>`).join('')}</div>
    <div id="ptDeptBody"></div>
  </div>`);
  v.appendChild(deptBox);

  v.appendChild(el(`<div class="card">
    <h3><span class="num">3</span> 발표 구성 틀 — 슬라이드 순서</h3>
    <div class="muted" style="margin-bottom:8px"><span class="pill core">⭐ 필수</span> 세 장(경력·자격증·성장 목표)은 빠지면 안 됩니다. 한 장 = 한 메시지, 글자는 적게 사진은 크게.</div>
    <ol class="slides">${PT_SLIDES.map(([h, d, m]) => `<li class="${m ? 'must' : ''}"><b>${m ? '⭐ ' : ''}${esc(h)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
    <div class="tip" style="margin-top:10px">⚠️ 회사 로고·기밀 자료·다른 사람 사진은 넣지 않습니다. 인터넷에서 가져온 그림은 출처를 적습니다. 발표 내용과 자기소개서가 서로 어긋나지 않게 맞춰 두세요.</div>
  </div>`));

  v.appendChild(el(`<div class="card">
    <h3><span class="num">4</span> 작품 심층 질문 대비 — 이것까지 답할 수 있어야 합니다</h3>
    <div class="muted" style="margin-bottom:8px">후기에서처럼 면접관은 작품 하나를 두고 "어떻게?", "왜?"를 계속 묻습니다. 질문마다 답할 거리를 작성지에 적어 두세요.</div>
    <table class="rtable deep"><tbody>${PT_DEEP.map(([q, h], i) => `<tr><td><b>${i + 1}. ${esc(q)}</b><div class="muted">${esc(h)}</div></td></tr>`).join('')}</tbody></table>
  </div>`));

  const form = el(`<div class="card">
    <h3><span class="num">5</span> 나의 PT 작성지 <span class="muted" style="font-size:13px;font-weight:600" id="ptFillN"></span></h3>
    <div class="muted" style="margin-bottom:8px">쓰는 대로 이 기기에만 저장됩니다(다른 사람에게 보이지 않음). 다 쓰면 <b>발표 대본 만들기</b>로 한 번에 모아 보세요.</div>
    ${PT_FIELDS.map(([k, h, ph]) => `<label class="ptf ${/^⭐/.test(h) ? 'must' : ''}"><b>${esc(h)}</b>
      <textarea data-f="${k}" rows="${k === 'title' || k === 'me' || k === 'end' ? 1 : 3}" placeholder="${esc(ph)}">${esc(ST.pt[k] || '')}</textarea></label>`).join('')}
    <div class="row" style="margin-top:10px">
      <button class="btn btn-primary" id="ptScript">📋 발표 대본 만들기</button>
      <button class="btn" id="ptCopy" disabled>복사하기</button>
      <span class="muted" id="ptCopied"></span>
    </div>
    <div class="script" id="ptOut" hidden></div>
  </div>`);
  v.appendChild(form);

  const min0 = ST.pt.min || 5;
  v.appendChild(el(`<div class="card">
    <h3><span class="num">6</span> 리허설 타이머 — 시간 재며 3번 이상</h3>
    <div class="row" id="ptMins">${[3, 5, 7, 10].map(m => `<button class="chip ${m === min0 ? 'on' : ''}" data-m="${m}">${m}분</button>`).join('')}</div>
    <div class="tbar" style="margin-top:10px"><i id="tb"></i></div>
    <div class="row" style="justify-content:space-between">
      <span class="timer" id="tt">${fmtSec(min0 * 60)}</span>
      <span class="muted" id="thint">실제 발표 시간은 안내문 기준으로 고르세요</span>
    </div>
    <div class="row" style="margin-top:8px">
      <button class="btn btn-primary" id="ptGo">▶ 시작</button>
      <button class="btn" id="ptStop">■ 멈춤</button>
    </div>
  </div>`));

  v.appendChild(el(`<div class="card explain">📌 이 화면의 내용은 선배 응시 후기와 공식 채용 안내를 바탕으로 정리한 <b>참고 자료</b>입니다.
    PT 형식은 해마다 바뀔 수 있으니 안내문과 학교 취업지원부 안내를 꼭 다시 확인하고, 모자란 부분은 더 찾아 준비하세요.</div>`));

  /* 동작 */
  const drawDept = k => {
    const d = PT_DEPTS.find(x => x.k === k) || PT_DEPTS[0];
    deptBox.querySelectorAll('[data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d.k));
    deptBox.querySelector('#ptDeptBody').innerHTML = `
      <div class="lbl">💡 ${d.em} ${d.k}과 학생이 고를 만한 주제</div>
      <div class="keys">${d.topics.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="lbl">🔗 ${d.k}과 → KAI 일과 잇는 법</div>
      <ul class="pts">${d.link.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="lbl">🎤 ${d.k}과 작품이면 이렇게 물을 수 있습니다</div>
      <ol class="follow">${d.deep.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
      <div class="lbl">🪪 모범 답변의 [자격증] 칸에 넣을 우리 과 자격증 예</div>
      <div>${esc(d.cert)} <span class="muted">— 실제로 딴 것·준비 중인 것만 말하세요.</span></div>
      <div class="explain" style="margin-top:10px">📌 KAI 생산 경력 공고 예(2026-08)의 자격요건에 <b>"기계·전기전자 분야 기능사 이상"</b>이 있었습니다(📖 L10).
        위 "잇는 법" 중 📖 표시 없는 것은 일반 지식이라, 실제 배치 공정·직무는 공고와 회사 안내로 꼭 확인하세요.</div>`;
  };
  deptBox.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { ST.pt.dept = b.dataset.d; save(); drawDept(b.dataset.d); });
  drawDept(ST.pt.dept || PT_DEPTS[0].k);

  $('#ptQ').onclick = () => startRun(ptQ, '📊 PT·실무 복원 질문');
  const pickN = () => {
    const n = PT_PICK.filter((p, i) => ST.pt['pk' + i]).length;
    $('#ptPickN').textContent = `${n} / ${PT_PICK.length}개 해당 — ${n >= 5 ? '좋은 주제입니다 👍' : '해당하는 것이 많은 작품을 고르세요'}`;
  };
  v.querySelectorAll('[data-pk]').forEach(c => c.onchange = () => {
    ST.pt['pk' + c.dataset.pk] = c.checked; save();
    c.closest('label').classList.toggle('on', c.checked); pickN();
  });
  pickN();
  const fillN = () => { $('#ptFillN').textContent = `— ${PT_FIELDS.filter(([k]) => (ST.pt[k] || '').trim()).length} / ${PT_FIELDS.length}칸 작성`; };
  form.querySelectorAll('textarea').forEach(t => t.oninput = () => { ST.pt[t.dataset.f] = t.value; save(); fillN(); });
  fillN();
  let script = '';
  $('#ptScript').onclick = () => {
    script = PT_FIELDS.map(([k, h]) => `【${h.replace(/^⭐ /, '')}】\n${(ST.pt[k] || '').trim() || '(아직 비어 있음)'}`).join('\n\n');
    const o = $('#ptOut'); o.hidden = false; o.textContent = script; $('#ptCopy').disabled = false;
  };
  $('#ptCopy').onclick = () => {
    const fallback = () => { selectText($('#ptOut')); $('#ptCopied').textContent = '선택해 두었습니다 — Ctrl+C 로 복사하세요'; };
    try { navigator.clipboard.writeText(script).then(() => { $('#ptCopied').textContent = '복사했습니다'; }, fallback); }
    catch (e) { fallback(); }
  };
  v.querySelectorAll('#ptMins [data-m]').forEach(b => b.onclick = () => {
    stopTimer(); ST.pt.min = +b.dataset.m; save();
    v.querySelectorAll('#ptMins [data-m]').forEach(x => x.classList.toggle('on', x === b));
    $('#tt').textContent = fmtSec(ST.pt.min * 60); $('#tt').classList.remove('low');
    $('#tb').style.width = '100%'; $('#tb').classList.remove('low');
    $('#thint').textContent = '실제 발표 시간은 안내문 기준으로 고르세요';
  });
  $('#ptGo').onclick = () => {
    startTimer((ST.pt.min || 5) * 60, Date.now(),
      () => { $('#thint').textContent = '⏰ 시간 종료 — 마무리 한 문장까지 들어갔나요?'; fxSafe(F => F.punch($('#tt'))); },
      { run: '발표 중 — 소리 내어', low: '1분 남음 — 성장 목표·마무리로', lowAt: 60 });
  };
  $('#ptStop').onclick = () => { stopTimer(); $('#thint').textContent = '멈췄습니다 — ▶ 시작을 누르면 처음부터'; };
}
function selectText(node) {
  try { const r = document.createRange(); r.selectNodeContents(node); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
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
