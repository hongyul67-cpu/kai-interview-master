/* ══════════════════════════════════════════════════════════════
   KAI 면접 마스터 — 점검 퀴즈 (Q1)
   규약 2장: 연습 8문항(바로 정답·해설·연출) / 종합시험 20문항(끝까지 아무것도 안 알려 줌 → 오답노트 → 제출)

   문항은 각 배우기 단원의 check[] 를 모아 씁니다.
     { q, choices[4], a(0~3), exp, src }
   app.js 가 퀴즈 탭을 열 때마다  KAIQuiz.mount(빈 요소, { learn, go, tool, unit })  를 부릅니다.
   unit 이 있으면(#quiz/L3) 연습 범위를 그 단원으로 골라 둡니다.

   섞기: 문제 차례와 보기 차례를 섞습니다. 해설은 보기 번호를 쓰지 않으므로 다시 매길 것이 없습니다.
     수업용 링크(?fix=…)이면 FixOrder.seed 로 자체 난수를 만들어 모든 기기가 같은 순서를 받습니다
     (다른 위젯이 Math.random 을 먼저 써도 어긋나지 않게).
   채점은 한 번: 보기를 고르는 순간 확정됩니다.
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const TOOL  = 'KAI 면접 마스터';
const STORE = 'kai_interview_master_quiz_v1';
const CFG   = { practiceN: 8, examN: 20 };
const MODE  = { practice: `${TOOL} — 점검 연습`, exam: `${TOOL} — 종합시험` };
const MARK  = ['①', '②', '③', '④', '⑤'];

/* ── 도우미 ── */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const txt = s => esc(s).replace(/&lt;(\/?)(b|i|u|br|sub|sup|small)\s*\/?&gt;/g, '<$1$2>');
const plain = s => String(s == null ? '' : s).replace(/<[^>]+>/g, '');
const cut = (s, n) => { s = plain(s); return s.length > n ? s.slice(0, n) + '…' : s; };
const el = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; };
function fxSafe(fn) { try { if (window.FX) fn(window.FX); } catch (e) { console.warn('FX', e); } }

/* 난수 — 수업용 고정이면 시드 난수, 아니면 Math.random */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function makeRnd(key) {
  const F = window.FixOrder;
  return (F && F.on) ? mulberry32((Number(F.seed) || 0) ^ hash(key)) : Math.random;
}
const shuffle = (a, rnd) => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

/* 보기를 섞으면 안 되는 문항 — 번호가 적힌 보기, «위 모두 옳다» 류 */
const LOCK = /[①②③④⑤]|위의? 모두|모두 (옳|맞|틀|해당)|보기 중 없|정답 없/;
const mixable = q => !LOCK.test(q.q + '|' + q.choices.join('|'));

/* ── 저장 (오답노트) ── */
const ST = load();
function load() {
  try { return Object.assign({ wrong: [] }, JSON.parse(localStorage.getItem(STORE) || '{}')); }
  catch (e) { return { wrong: [] }; }
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(ST)); } catch (e) {} }

/* ── 문항 모으기 ── */
let CTX = {}, box = null, pickUnit = 'all', quiz = null, lastResult = null;

function units() {
  return (CTX.learn || []).filter(u => u && (u.check || []).length)
    .slice().sort((a, b) => (a.order || 99) - (b.order || 99));
}
function pool(uid) {
  const out = [];
  units().filter(u => uid === 'all' || u.id === uid).forEach(u => u.check.forEach((c, i) => {
    if (!c || !Array.isArray(c.choices) || c.a == null) return;
    out.push({ key: `${u.id}-${i + 1}`, uid: u.id, emoji: u.emoji || '', unit: u.title, ...c });
  }));
  return out;
}
/* 종합시험 — 단원마다 고르게 돌아가며 뽑기 */
function spread(list, n, rnd) {
  const by = {};
  shuffle(list, rnd).forEach(q => (by[q.uid] = by[q.uid] || []).push(q));
  const keys = shuffle(Object.keys(by), rnd), out = [];
  while (out.length < n && keys.some(k => by[k].length)) keys.forEach(k => { if (out.length < n && by[k].length) out.push(by[k].shift()); });
  return shuffle(out, rnd);
}
/* 한 문항을 화면용으로 — 보기 차례 섞고 정답 자리 다시 계산 */
function prep(q, rnd) {
  const idx = q.choices.map((_, i) => i);
  const ord = mixable(q) ? shuffle(idx, rnd) : idx;         // ord[새자리] = 옛자리
  return { ...q, ch: ord.map(i => q.choices[i]), ans: ord.indexOf(q.a) };
}

/* ══════════════ 퀴즈 첫 화면 ══════════════ */
function mount(el0, ctx) {
  box = el0; CTX = ctx || {};
  if (CTX.unit && units().some(u => u.id === CTX.unit)) pickUnit = CTX.unit;
  home();
}

function home() {
  quiz = null;
  box.innerHTML = '';
  const U = units(), all = pool('all');
  box.appendChild(el(`<div class="card">
    <h2>✅ 점검 퀴즈</h2>
    <div class="muted">배우기 단원의 핵심을 4지선다로 확인합니다. 문제와 보기 순서는 풀 때마다 섞입니다.</div>
    <div class="row" style="margin-top:8px"><span class="pill blue">문항 ${all.length}개</span><span class="pill">단원 ${U.length}개</span></div>
  </div>`));
  if (!all.length) {
    box.appendChild(el('<div class="card empty">점검 문항을 준비하고 있습니다. 먼저 📖 배우기를 읽어 두세요.</div>'));
    return;
  }
  if (pickUnit !== 'all' && !U.some(u => u.id === pickUnit)) pickUnit = 'all';

  /* 연습 */
  const pr = el(`<div class="card">
    <h3>✏️ 연습 ${CFG.practiceN}문항</h3>
    <div class="muted" style="margin-bottom:10px">고르자마자 정답과 해설을 보여 줍니다. 범위를 고르세요.</div>
    <div class="chips" id="qzUnits"></div>
    <button class="btn btn-primary" id="qzPractice">✏️ 연습 시작</button>
  </div>`);
  box.appendChild(pr);
  const chips = pr.querySelector('#qzUnits');
  const paintChips = () => {
    chips.innerHTML = '';
    [{ id: 'all', emoji: '', title: '전체', n: all.length }].concat(U.map(u => ({ id: u.id, emoji: u.emoji || '', title: u.title, n: u.check.length })))
      .forEach(u => {
        const c = el(`<button class="chip ${pickUnit === u.id ? 'on' : ''}" title="${esc(u.title)}">${u.id === 'all' ? '전체' : `${u.emoji} ${esc(u.id)}`}<span class="n">${u.n}</span></button>`);
        c.onclick = () => { pickUnit = u.id; paintChips(); };
        chips.appendChild(c);
      });
    const u = U.find(x => x.id === pickUnit);
    pr.querySelector('#qzPractice').textContent = `✏️ 연습 시작 — ${u ? `${u.emoji} ${plain(u.title)}` : '전체 단원'}`;
  };
  paintChips();
  pr.querySelector('#qzPractice').onclick = () => start('practice', pool(pickUnit));

  /* 종합시험 */
  const ex = el(`<div class="card">
    <h3>🏁 종합시험 ${CFG.examN}문항</h3>
    <div class="muted">전 단원에서 고르게 뽑습니다. <b>끝날 때까지 정답도 점수도 알려 주지 않습니다.</b>
      다 풀면 점수와 오답노트가 나오고, 그 아래에서 결과를 선생님께 제출합니다. 한 번 고른 답은 바꿀 수 없습니다.</div>
    <div class="row" style="margin-top:10px"><button class="btn btn-navy" id="qzExam">🏁 종합시험 시작</button></div>
  </div>`);
  box.appendChild(ex);
  ex.querySelector('#qzExam').onclick = () => start('exam', all);

  /* 쌓인 오답 */
  const w = liveWrong();
  const wn = el(`<div class="card">
    <h3>📕 오답노트 <span class="pill">${w.length}문항</span></h3>
    <div class="muted">연습·종합시험에서 틀린 문제가 모입니다. 나중에 맞히면 저절로 빠집니다.</div>
    <div class="row" style="margin-top:10px">
      <button class="btn" id="qzNote" ${w.length ? '' : 'disabled'}>📕 오답노트 보기</button>
      <button class="btn" id="qzRetry" ${w.length ? '' : 'disabled'}>🔁 틀린 문제만 다시 풀기</button>
    </div>
  </div>`);
  box.appendChild(wn);
  wn.querySelector('#qzNote').onclick = () => note();
  wn.querySelector('#qzRetry').onclick = () => start('practice', w.map(x => x.q), '틀린 문제 다시');
}

/* 오답노트 — 지금 데이터에 남아 있는 문항만 */
function liveWrong() {
  const now = {}; pool('all').forEach(q => { now[q.key] = q; });
  return ST.wrong.filter(w => now[w.key] && now[w.key].q === w.qt).map(w => ({ ...w, q: now[w.key] }));
}

/* ══════════════ 풀기 ══════════════ */
function start(mode, list, label) {
  const n = mode === 'exam' ? CFG.examN : CFG.practiceN;
  const rnd = makeRnd(`${mode}|${label || pickUnit}`);
  const picked = mode === 'exam' ? spread(list, n, rnd) : shuffle(list, rnd).slice(0, n);
  if (!picked.length) return;
  const u = units().find(x => x.id === pickUnit);
  quiz = {
    mode, i: 0, correct: 0, combo: 0, picks: [], t0: Date.now(),
    list: picked.map(q => prep(q, rnd)),
    label: label || (mode === 'exam' ? '전 단원에서 고르게' : (u ? `${u.id} ${plain(u.title)}` : '전체 단원')),
  };
  draw();
}

function toTop() {
  const y = box.getBoundingClientRect().top + window.scrollY - 70;
  if (window.scrollY > y) window.scrollTo(0, Math.max(0, y));
}

function draw() {
  const q = quiz.list[quiz.i], isExam = quiz.mode === 'exam', N = quiz.list.length;
  box.innerHTML = '';
  box.appendChild(el(`<div class="row" style="justify-content:space-between;margin-bottom:2px">
    <b>${isExam ? '🏁 종합시험' : '✏️ 연습'} <span class="muted" style="font-weight:600">· ${esc(quiz.label)}</span></b>
    <button class="btn btn-sm" id="qzQuit">그만하기</button></div>`));
  box.appendChild(el(`<div class="progress"><i style="width:${quiz.i / N * 100}%"></i></div>`));
  const card = el(`<div class="card">
    <div class="row" style="margin-bottom:4px">
      <span class="pill blue">${quiz.i + 1} / ${N}</span>
      <span class="pill">${q.emoji} ${esc(q.uid)}</span>
      ${isExam ? '<span class="pill">채점은 마지막에</span>'
               : `<span class="pill ok">${quiz.correct}개 맞힘</span>${quiz.combo >= 2 ? `<span class="pill real">🔥 ${quiz.combo}연속</span>` : ''}`}
    </div>
    <div class="qbig">${txt(q.q)}</div>
    <div class="qz-ch"></div>
    <div class="qz-exp"></div>
  </div>`);
  box.appendChild(card);
  const chs = card.querySelector('.qz-ch');
  q.ch.forEach((c, k) => {
    const b = el(`<button class="qz-choice"><span class="mk">${MARK[k]}</span><span>${txt(c)}</span></button>`);
    b.onclick = () => pick(k, b, card);
    chs.appendChild(b);
  });
  box.querySelector('#qzQuit').onclick = () => {
    if (quiz.i > 0 && !confirm(isExam ? '종합시험을 그만두면 지금까지 푼 것은 채점되지 않습니다. 그만둘까요?' : '연습을 그만둘까요?')) return;
    home();
  };
  toTop();
}

function pick(k, btn, card) {
  const q = quiz.list[quiz.i];
  if (quiz.locked) return;                       // 채점은 한 번
  quiz.locked = true;
  const ok = k === q.ans;
  quiz.picks.push({ q, pick: k, ok });
  if (ok) { quiz.correct++; quiz.combo++; } else quiz.combo = 0;
  noteResult(q, ok, k);
  const btns = card.querySelectorAll('.qz-choice');
  btns.forEach(b => b.disabled = true);

  if (quiz.mode === 'exam') {                    // 종합시험 — 고른 표시만 잠깐, 정오는 알리지 않음
    btn.classList.add('picked');
    setTimeout(next, 220);
    return;
  }
  /* 연습 — 정답·해설 바로 공개 + 연출 */
  btns.forEach((b, i) => {
    if (i === q.ans) b.classList.add('correct');
    if (i === k && !ok) b.classList.add('wrong');
  });
  fxSafe(F => ok ? F.ok(btn) : F.no(btn));
  const ex = card.querySelector('.qz-exp');
  ex.appendChild(el(`<div class="explain ${ok ? '' : 'warn'}">
    <b>${ok ? '⭕ 맞았습니다' : `❌ 정답: ${txt(q.ch[q.ans])}`}</b><br>${txt(q.exp || '')}
    ${q.src ? `<div class="muted" style="margin-top:4px">📚 ${txt(q.src)}</div>` : ''}</div>`));
  const nx = el(`<div class="row" style="margin-top:12px"><button class="btn btn-primary">${quiz.i + 1 >= quiz.list.length ? '결과 보기' : '다음 문제 →'}</button></div>`);
  ex.appendChild(nx);
  nx.querySelector('button').onclick = next;
}

function next() {
  quiz.locked = false;
  quiz.i++;
  if (quiz.i >= quiz.list.length) finish(); else draw();
}

/* 오답노트 쌓기 — 틀리면 넣고, 나중에 맞히면 뺌 */
function noteResult(q, ok, k) {
  ST.wrong = ST.wrong.filter(w => w.key !== q.key);
  if (!ok) {
    ST.wrong.unshift({ key: q.key, qt: q.q, pickText: q.ch[k], at: Date.now() });
    ST.wrong = ST.wrong.slice(0, 150);
  }
  save();
}

/* ══════════════ 끝 ══════════════ */
function finish() {
  const N = quiz.list.length, pct = Math.round(quiz.correct / N * 100);
  const sec = Math.round((Date.now() - quiz.t0) / 1000);
  const isExam = quiz.mode === 'exam', part = isExam ? '종합시험' : '점검 연습';
  const bad = quiz.picks.map((p, i) => ({ ...p, no: i + 1 })).filter(p => !p.ok);
  box.innerHTML = '';
  box.appendChild(el(`<div class="card" style="text-align:center">
    <div class="muted">${isExam ? '🏁 종합시험' : '✏️ 연습'} · ${esc(quiz.label)}</div>
    <div style="font-size:40px;font-weight:900;color:var(--navy);letter-spacing:-1px">${pct}점</div>
    <div class="muted">${N}문항 중 ${quiz.correct}개 정답 · ${Math.floor(sec / 60)}분 ${sec % 60}초</div>
    <div id="qzRank" style="margin-top:12px"></div>
    <div id="qzSubmit" style="margin-top:6px"></div>
  </div>`));

  /* 오답노트 — 종합시험은 여기서 처음으로 정답을 본다 */
  if (bad.length) {
    box.appendChild(el(`<div class="card"><h3>📕 이번에 틀린 문제 ${bad.length}개</h3>
      <div class="muted">내가 고른 답과 정답, 해설을 확인하고 해당 단원을 다시 읽어 보세요.</div></div>`));
    bad.forEach(p => {
      const q = p.q;
      box.appendChild(el(`<div class="card">
        <div class="row" style="margin-bottom:4px"><span class="pill blue">${p.no}번</span><span class="pill">${q.emoji} ${esc(q.uid)}</span></div>
        <div style="font-weight:800;margin-bottom:6px">${txt(q.q)}</div>
        <div class="qz-ans no">내가 고른 답 · ${MARK[p.pick]} ${txt(q.ch[p.pick])}</div>
        <div class="qz-ans ok">정답 · ${MARK[q.ans]} ${txt(q.ch[q.ans])}</div>
        <div class="explain">${txt(q.exp || '')}${q.src ? `<div class="muted" style="margin-top:4px">📚 ${txt(q.src)}</div>` : ''}</div>
        <div class="row" style="margin-top:8px"><a class="btn btn-sm" href="#learn/${esc(q.uid)}">📖 ${esc(q.uid)} 다시 읽기</a></div>
      </div>`));
    });
  } else {
    box.appendChild(el('<div class="card empty">🎯 모두 맞혔습니다!</div>'));
  }
  const again = el(`<div class="card row" style="justify-content:center">
    <button class="btn btn-primary" id="qzAgain">${isExam ? '🏁 종합시험 다시' : '✏️ 연습 다시'}</button>
    <button class="btn" id="qzHome">퀴즈 처음으로</button></div>`);
  box.appendChild(again);
  const lastMode = quiz.mode;
  again.querySelector('#qzAgain').onclick = () => lastMode === 'exam' ? start('exam', pool('all')) : start('practice', pool(pickUnit));
  again.querySelector('#qzHome').onclick = () => home();
  window.scrollTo(0, 0);

  /* 제출을 먼저 붙인다 — 연출·계급에서 오류가 나도 제출 버튼은 살아 있어야 함(템플릿 주석) */
  mountSubmit(pct, quiz.correct, N, sec, part, bad);

  fxSafe(F => { if (pct >= 60) F.banner({ title: pct >= 90 ? '훌륭합니다!' : '통과!', sub: `${part} ${pct}점`, stars: F.starsFor ? F.starsFor(pct) : 0 }); });
  try {
    if (window.Rank) { const res = Rank.award(pct, { mode: MODE[lastMode] }); box.querySelector('#qzRank').innerHTML = Rank.resultBox(res); }
  } catch (e) { console.warn('Rank', e); }
}

/* 결과 제출 (규약 1) — mode 는 파트별, wrong 은 "3번 딤플링→카운터싱킹" 처럼 내용으로 */
function mountSubmit(pct, correct, total, sec, part, bad) {
  lastResult = {
    mode: MODE[quiz.mode],
    score: pct, correct, total,
    wrong: bad.map(p => `${p.no}번(${p.q.uid}) ${cut(p.q.ch[p.pick], 18)}→${cut(p.q.ch[p.q.ans], 18)}`),
    durationSec: sec,
  };
  const anchor = box.querySelector('#qzSubmit');
  if (!(window.ResultCollector && ResultCollector.attach) || !anchor) return;
  try {
    const btn = ResultCollector.attach(anchor, () => lastResult, {
      id: 'rcBtn', className: 'btn btn-primary',
      mode: lastResult.mode,
      extra: ['항공기 기체 제작 기초 이론', `${part} ${pct}점`],
    });
    if (btn) { btn.style.width = '100%'; btn.style.justifyContent = 'center'; btn.textContent = `📤 [${part}] 결과 제출`; }
  } catch (e) { console.warn('ResultCollector', e); }
}

/* ══════════════ 오답노트 화면 ══════════════ */
function note() {
  const w = liveWrong();
  box.innerHTML = '';
  box.appendChild(el(`<div class="card row" style="justify-content:space-between">
    <b>📕 오답노트 ${w.length}문항</b>
    <span class="row"><button class="btn btn-sm" id="nbRetry" ${w.length ? '' : 'disabled'}>🔁 다시 풀기</button>
      <button class="btn btn-sm" id="nbClear" ${w.length ? '' : 'disabled'}>비우기</button>
      <button class="btn btn-sm" id="nbBack">← 퀴즈 처음</button></span></div>`));
  if (!w.length) box.appendChild(el('<div class="card empty">🗒️ 틀린 문제가 없습니다.</div>'));
  w.forEach(x => {
    const q = x.q;
    box.appendChild(el(`<div class="card">
      <div class="row" style="margin-bottom:4px"><span class="pill">${q.emoji} ${esc(q.uid)}</span></div>
      <div style="font-weight:800;margin-bottom:6px">${txt(q.q)}</div>
      ${x.pickText ? `<div class="qz-ans no">내가 고른 답 · ${txt(x.pickText)}</div>` : ''}
      <div class="qz-ans ok">정답 · ${txt(q.choices[q.a])}</div>
      <div class="explain">${txt(q.exp || '')}${q.src ? `<div class="muted" style="margin-top:4px">📚 ${txt(q.src)}</div>` : ''}</div>
    </div>`));
  });
  box.querySelector('#nbBack').onclick = () => home();
  box.querySelector('#nbRetry').onclick = () => start('practice', w.map(x => x.q), '틀린 문제 다시');
  box.querySelector('#nbClear').onclick = () => { if (confirm('오답노트를 비울까요?')) { ST.wrong = []; save(); note(); } };
}

/* ── 퀴즈 전용 모양 (style.css 는 S1 몫이라 여기서 덧붙임) ── */
(function css() {
  if (document.getElementById('qz-css')) return;
  const s = document.createElement('style');
  s.id = 'qz-css';
  s.textContent = `
.qz-ch{margin-top:10px}
.qz-choice{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;border:1px solid var(--line);
  background:var(--card);border-radius:12px;padding:12px 14px;margin-bottom:8px;cursor:pointer;font:inherit;color:inherit;line-height:1.55}
.qz-choice:hover:not(:disabled){border-color:var(--pri);background:#f6f9fd}
.qz-choice:disabled{cursor:default}
.qz-choice .mk{flex:0 0 auto;font-weight:900;color:var(--pri)}
.qz-choice.picked{border:2px solid var(--navy);background:#eef2f8}
.qz-choice.correct{border:2px solid var(--ok);background:var(--okbg)}
.qz-choice.wrong{border:2px solid var(--no);background:var(--nobg)}
.qz-ans{border-radius:8px;padding:6px 10px;margin-top:4px;font-size:14.5px}
.qz-ans.no{background:var(--nobg);color:#8a2a2d}
.qz-ans.ok{background:var(--okbg);color:#0f5a33;font-weight:700}`;
  document.head.appendChild(s);
})();

window.KAIQuiz = { mount };
})();
