/* 직접 그린 개념도 ① — L1 기체 구조 · L2 리벳 · L3 체결 하드웨어
   교재 그림을 옮긴 것이 아니라 교재 내용을 바탕으로 새로 그린 SVG 입니다(비율·치수는 개념용).
   KAI.media['L2-7'] = { fig } → app.js 가 해당 단원의 7번째 절에 붙입니다. */
window.KAI = window.KAI || { learn: [], iv: [] };
KAI.media = KAI.media || {};
(function () {
const C = { tint: 'rgba(90,130,190,.18)', metal: '#b8c2cc', dark: '#6b7785', red: '#d33b3f', or: '#e08a1e', grn: '#128a4a' };
const svg = (h, label, body) => `<svg viewBox="0 0 360 ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="max-width:100%;height:auto;font-family:inherit">${body}</svg>`;
const T = (x, y, s, o = '') => {        // 같은 속성을 두 번 쓰면 앞의 것만 먹으므로, o 에 있는 것은 기본값을 빼고 씀
  const has = k => o.includes(k + '=');
  return `<text x="${x}" y="${y}" ${has('font-size') ? '' : 'font-size="10"'} ${has('fill') ? '' : 'fill="currentColor"'} ${has('text-anchor') ? '' : 'text-anchor="middle"'} ${o}>${s}</text>`;
};
const TB = (x, y, s, o = '') => T(x, y, s, `${o.includes('font-size=') ? '' : 'font-size="12"'} font-weight="bold" ${o}`);
const L = (x1, y1, x2, y2, o = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1" ${o}/>`;
const R = (x, y, w, h, f = C.tint, o = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="currentColor" stroke-width="1.2" ${o}/>`;
const P = (d, f = C.tint, o = '') => `<path d="${d}" fill="${f}" stroke="currentColor" stroke-width="1.2" ${o}/>`;
const AR = (x1, y1, x2, y2, col = 'currentColor') => {           // 화살표
  const a = Math.atan2(y2 - y1, x2 - x1), s = 6;
  const p1 = [x2 - s * Math.cos(a - .45), y2 - s * Math.sin(a - .45)], p2 = [x2 - s * Math.cos(a + .45), y2 - s * Math.sin(a + .45)];
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1.6"/><path d="M${x2} ${y2} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" fill="${col}"/>`;
};
const NOTE = (y, s) => T(180, y, s, `font-size="9" fill-opacity=".75"`);
const dome = (cx, y, w, hgt) => P(`M${cx - w / 2} ${y} Q${cx} ${y - hgt * 2} ${cx + w / 2} ${y} Z`, C.metal);
KAI.figkit = { C, svg, T, TB, L, R, P, AR, dome };   // fig2·fig3 가 같은 도우미를 씀

Object.assign(KAI.media, {

/* ── L1 ── */
'L1-1': { cap: '비행조종면 = 도움날개(날개 뒤쪽)·승강타·방향타 · 주황색 = 움직이는 조종면 · 옆에서 본 개념도', fig: svg(170, '기체 5대 단위 옆모습', `
  ${P('M40 80 Q40 62 70 62 H270 L330 70 V80 L270 92 H70 Q40 92 40 80 Z')}
  <ellipse cx="160" cy="86" rx="55" ry="5" fill="${C.tint}" stroke="currentColor"/>
  ${P('M285 64 L318 22 H336 L330 68 Z')}${P('M324 22 H336 L330 68 L325 67 Z', C.or)}
  <ellipse cx="318" cy="73" rx="24" ry="3" fill="${C.or}" stroke="currentColor"/>
  ${L(72, 92, 72, 108)}<circle cx="72" cy="113" r="6" fill="${C.dark}"/>${L(125, 92, 125, 110)}<circle cx="125" cy="116" r="7" fill="${C.dark}"/>
  ${TB(110, 52, '동체')}${L(110, 55, 110, 63)}
  ${TB(185, 122, '날개(주익)')}${L(180, 112, 170, 91)}
  ${TB(250, 26, '수직안정판')}${L(270, 30, 300, 44)}
  ${T(352, 14, '방향타', 'text-anchor="end"')}${L(340, 17, 331, 30)}
  ${T(290, 110, '수평안정판·승강타')}${L(300, 102, 314, 76)}
  ${TB(98, 145, '착륙장치')}${L(90, 136, 74, 121)}${L(106, 136, 122, 125)}
  `) },

'L1-3': { cap: '선 = 하중이 흐르는 길(개념도) · 긁힘·홈·단면 급변도 같은 원리', fig: svg(160, '구멍 주변의 응력 집중', `
  ${R(40, 30, 280, 90)}<circle cx="180" cy="75" r="15" fill="#fff" stroke="currentColor" stroke-width="1.2"/>
  ${[38, 46, 54].map(y => L(40, y, 320, y, 'stroke-opacity=".55"')).join('')}
  ${[96, 104, 112].map(y => L(40, y, 320, y, 'stroke-opacity=".55"')).join('')}
  <path d="M40 64 H128 Q180 40 232 64 H320 M40 70 H138 Q180 50 222 70 H320 M40 86 H128 Q180 110 232 86 H320 M40 80 H138 Q180 100 222 80 H320" fill="none" stroke="currentColor" stroke-opacity=".75"/>
  <circle cx="180" cy="60" r="3.5" fill="${C.red}"/><circle cx="180" cy="90" r="3.5" fill="${C.red}"/>
  ${AR(38, 75, 12, 75)}${AR(322, 75, 348, 75)}${T(22, 66, '하중')}${T(338, 66, '하중')}
  ${T(180, 136, '구멍 위·아래 가장자리에 흐름이 몰림 → 응력 집중 → 피로 균열의 출발점', `fill="${C.red}" font-weight="bold"`)}
  `) },

'L1-4': { cap: '오늘날 대부분의 항공기 동체 = 세미모노코크 · 개념도', fig: svg(165, '트러스 모노코크 세미모노코크 비교', `
  ${TB(60, 18, '트러스형')}
  <path d="M20 45 H100 V95 H20 Z M40 45 V95 M60 45 V95 M80 45 V95 M20 95 L40 45 L60 95 L80 45 L100 95" fill="none" stroke="currentColor" stroke-width="2"/>
  ${T(60, 118, '강관 뼈대(삼각형)가 하중')}${T(60, 132, '외피는 모양만(옆모습)')}
  ${TB(180, 18, '모노코크형')}<circle cx="180" cy="70" r="32" fill="${C.tint}" stroke="currentColor" stroke-width="6"/>
  ${T(180, 118, '두꺼운 외피가 하중')}${T(180, 132, '→ 무겁다(단면)')}
  ${TB(300, 18, '세미모노코크형')}<circle cx="300" cy="70" r="32" fill="${C.tint}" stroke="currentColor" stroke-width="2"/>
  <circle cx="300" cy="70" r="25" fill="none" stroke="${C.dark}" stroke-width="3"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315].map(d => { const a = d * Math.PI / 180; return `<rect x="${(300 + 29 * Math.cos(a) - 2.5).toFixed(1)}" y="${(70 + 29 * Math.sin(a) - 2.5).toFixed(1)}" width="5" height="5" fill="${C.or}"/>`; }).join('')}
  ${T(300, 118, '얇은 외피 + 프레임(회색)')}${T(300, 132, '+ 스트링거(주황)')}
  `) },

'L1-7': { cap: '날개보 캡을 두 부분으로 나눠 리벳으로 이은 예 · 초록 점선 = 하중 경로 · 개념도', fig: svg(150, '페일세이프 날개보 캡', `
  ${R(50, 44, 260, 14, C.metal)}${R(50, 58, 260, 14, C.metal)}
  ${[70, 100, 130, 160, 200, 230, 260, 290].map(x => `<circle cx="${x}" cy="58" r="3" fill="${C.dark}"/>`).join('')}
  <path d="M178 44 L184 50 L176 53 L183 58" fill="none" stroke="${C.red}" stroke-width="2.4"/>
  ${T(180, 36, '위쪽 부재에 균열', `fill="${C.red}" font-weight="bold"`)}
  <path d="M30 51 H150 Q165 51 168 66 H200 Q210 66 214 51 H330" fill="none" stroke="${C.grn}" stroke-width="2.2" stroke-dasharray="5 3"/>
  ${AR(314, 51, 334, 51, C.grn)}
  ${T(180, 92, '아래쪽 부재가 하중을 대신 맡는다 → 페일세이프(fail-safe)', `fill="${C.grn}" font-weight="bold"`)}
  ${T(180, 114, '1차 구조: 날개보·세로대처럼 주요 하중을 맡아 파손 시 안전에 직결')}
  ${T(180, 128, '2차 구조: 페어링·카울링처럼 큰 하중이 없는 부분')}
  `) },

/* ── L2 리벳 ── */
'L2-1': { fig: svg(200, '리벳 각 부분 이름과 부품번호', `
  ${TB(90, 16, '박기 전')}${TB(280, 16, '박은 뒤')}
  ${R(40, 60, 100, 12)}${R(40, 72, 100, 12)}${R(84, 60, 12, 44, C.metal)}${dome(90, 60, 30, 10)}
  ${T(128, 38, '제작 헤드', 'text-anchor="start"')}${L(126, 36, 102, 50)}
  ${L(30, 60, 30, 84)}${L(26, 60, 34, 60)}${L(26, 84, 34, 84)}${T(24, 76, '그립', 'text-anchor="end" font-size="9"')}
  ${T(102, 100, '벅테일 ≈ 1.5D', 'text-anchor="start"')}${T(80, 98, '샹크', 'text-anchor="end"')}
  ${AR(160, 78, 205, 78)}${T(182, 70, '리벳팅', 'font-size="9"')}
  ${R(230, 60, 100, 12)}${R(230, 72, 100, 12)}${R(274, 60, 12, 24, C.metal)}${dome(280, 60, 30, 10)}
  ${P('M270 84 H290 Q293 92 288 92 H272 Q267 92 270 84 Z', C.metal)}
  ${T(298, 104, '샵 헤드', 'text-anchor="start" font-weight="bold"')}${L(296, 101, 288, 91)}
  ${T(280, 118, '폭 ≈ 1.5D · 높이 ≈ 0.5D', 'font-size="9"')}
  <rect x="20" y="130" width="320" height="62" rx="8" fill="none" stroke="currentColor" stroke-opacity=".4"/>
  ${T(180, 150, 'MS20470 AD 4-6', 'font-size="15" font-weight="bold"')}
  ${T(180, 168, 'MS20470 = 유니버설 헤드 · AD = 재질 2117-T4 · 4 = 지름 4/32in(=1/8in)', 'font-size="9.5"')}
  ${T(180, 183, '6 = 길이 6/16in · 접시머리(100°)는 MS20426 · D = 샹크 지름', 'font-size="9.5"')}`) },

'L2-2': { cap: '현장에서는 도면·부품목록의 규격을 따른다 · 개념도', fig: svg(160, '리벳 길이와 지름 고르기', `
  ${R(50, 40, 150, 15)}${R(50, 55, 150, 15)}${R(119, 40, 12, 48, C.metal)}${dome(125, 40, 30, 10)}
  ${L(210, 40, 210, 70)}${L(206, 40, 214, 40)}${L(206, 70, 214, 70)}${T(216, 58, '그립 G(판 두께 합)', 'text-anchor="start"')}
  ${L(210, 70, 210, 88, `stroke="${C.or}" stroke-width="2"`)}${L(206, 88, 214, 88, `stroke="${C.or}"`)}${T(216, 84, '+ 약 1.5D (샵 헤드 몫)', `text-anchor="start" fill="${C.or}"`)}
  ${T(125, 104, '← D →', 'font-size="9"')}
  ${T(180, 124, '리벳 길이 = 그립 + 약 1.5D', 'font-size="12" font-weight="bold"')}
  ${T(180, 142, '지름(교재 예): 두꺼운 판 0.040in × 3 = 0.120in → 바로 큰 표준 1/8in(0.125in)')}
  `) },

'L2-4': { cap: '위에서 본 판 · 개념도', fig: svg(150, '구멍 뚫기 네 단계', `
  ${[0, 1, 2, 3].map(i => R(8 + i * 89, 28, 72, 52)).join('')}
  ${L(36, 54, 52, 54)}${L(44, 46, 44, 62)}<circle cx="44" cy="54" r="2" fill="currentColor"/>
  <circle cx="133" cy="54" r="4" fill="#fff" stroke="currentColor"/>
  <circle cx="222" cy="54" r="9" fill="#fff" stroke="currentColor"/>
  <circle cx="311" cy="54" r="9" fill="#fff" stroke="${C.grn}" stroke-width="2"/>
  ${[0, 1, 2].map(i => AR(82 + i * 89, 54, 95 + i * 89, 54)).join('')}
  ${T(44, 96, '① 표시·센터 펀치')}${T(133, 96, '② 작은 파일럿 홀')}${T(222, 96, '③ 최종 크기로 확공')}${T(311, 96, '④ 버·칩 제거')}
  ${T(222, 110, '(1/8in 리벳 → #30)', 'font-size="9"')}${T(311, 110, '(디버링 공구)', 'font-size="9"')}
  ${T(180, 130, '드릴은 표면에 직각 · 보안경 필수 · 판 사이에 낀 칩도 빼낸다', 'font-weight="bold"')}
  `) },

'L2-5': { cap: '전용 플라이어로 꽂고 뺀다 · 단면 개념도', fig: svg(150, '클레코 단면', `
  ${R(60, 72, 110, 12)}${R(190, 72, 110, 12)}${R(60, 84, 110, 12)}${R(190, 84, 110, 12)}
  ${R(162, 34, 36, 38, C.metal)}${R(174, 20, 12, 14, C.or)}
  <path d="M176 72 V98 L169 102 M184 72 V98 L191 102" fill="none" stroke="currentColor" stroke-width="2.2"/>
  ${T(150, 40, '클레코 몸통', 'text-anchor="end"')}${T(192, 16, '누르면 다리가 모임', 'text-anchor="start" font-size="9"')}
  ${T(214, 104, '벌어진 다리가 아래 판을', 'text-anchor="start"')}${T(214, 117, '끌어올려 두 판을 밀착', 'text-anchor="start"')}${L(212, 102, 192, 101)}
  ${T(40, 80, '판 ①', 'text-anchor="end" font-size="9"')}${T(40, 93, '판 ②', 'text-anchor="end" font-size="9"')}
  ${T(180, 136, '구멍이 일렬로 유지된 채 드릴·리벳팅 · 크기(3/32~3/8in, 6종)는 색으로 구분', 'font-weight="bold"')}
  `) },

'L2-7': { fig: svg(170, '리벳건과 버킹바로 리벳 박기', `
  ${P('M88 18 H152 V48 H88 Z', C.dark)}${P('M140 30 H160 L166 66 H150 Z', C.dark)}${R(114, 48, 12, 16, C.metal)}
  ${dome(120, 76, 30, 10)}${R(40, 76, 160, 12)}${R(40, 88, 160, 12)}${R(114, 76, 12, 30, C.metal)}
  ${R(92, 106, 56, 26, '#55606d')}
  ${AR(120, 8, 120, 17)}${AR(70, 146, 92, 124)}
  ${T(84, 30, '리벳건', 'text-anchor="end" font-weight="bold"')}${T(84, 42, '(약 90~100psi)', 'text-anchor="end" font-size="8.5"')}
  ${T(108, 58, '세트', 'text-anchor="end" font-size="9"')}
  ${T(155, 124, '버킹바', 'text-anchor="start" font-weight="bold"')}${T(155, 136, '(무거운 강철 덩어리)', 'text-anchor="start" font-size="8.5"')}
  ${T(60, 160, '제작 헤드를 치고, 반대편 버킹바로 샵 헤드를 만든다 · 한 리벳 1~3초', 'text-anchor="start" font-size="9"')}
  <rect x="222" y="22" width="130" height="92" rx="8" fill="${C.tint}" stroke="currentColor" stroke-opacity=".5"/>
  ${T(287, 40, '탭 코드(2인 1조)', 'font-weight="bold"')}
  ${T(232, 60, '● 1번 = 더 쳐라', 'text-anchor="start"')}${T(232, 78, '●● 2번 = 잘 됐다', 'text-anchor="start"')}${T(232, 96, '●●● 3번 = 빼고 다시', 'text-anchor="start"')}
  ${T(287, 110, '버커가 버킹바로 두드려 신호', 'font-size="9"')}`) },

'L2-8': { fig: svg(160, '판금 수리 원칙', `
  ${R(30, 20, 300, 110, C.tint, 'stroke-opacity=".5"')}
  <rect x="110" y="42" width="140" height="66" rx="10" fill="none" stroke="${C.or}" stroke-width="2" stroke-dasharray="6 3"/>
  <rect x="148" y="58" width="64" height="34" rx="12" fill="#fff" stroke="${C.red}" stroke-width="2"/>
  ${[120, 136, 152, 168, 184, 200, 216, 232].map(x => `<circle cx="${x + 4}" cy="50" r="2.4" fill="currentColor"/><circle cx="${x + 4}" cy="100" r="2.4" fill="currentColor"/>`).join('')}
  ${[62, 75, 88].map(y => `<circle cx="120" cy="${y}" r="2.4" fill="currentColor"/><circle cx="240" cy="${y}" r="2.4" fill="currentColor"/>`).join('')}
  ${T(180, 79, '잘라 낸 곳', `fill="${C.red}" font-size="9"`)}
  ${T(44, 36, '덧판(더블러) = 주황 점선', `text-anchor="start" fill="${C.or}" font-weight="bold"`)}
  ${T(180, 146, '수리 3원칙: 원래 강도 유지 · 원래 윤곽 유지 · 무게 최소', 'font-weight="bold"')}
  ${T(260, 124, '사각 절개는 모서리 반경 1/2in 이상', `fill="${C.red}" font-size="9"`)}
  ${T(90, 124, '덧판 단면적 ≥ 손상 부분', 'font-size="9"')}`) },

/* ── L3 체결 하드웨어 ── */
'L3-3': { fig: svg(160, '캐슬 너트와 자동고정 너트', `
  ${TB(90, 16, '캐슬 너트 + 코터핀')}${TB(270, 16, '자동고정 너트')}
  ${R(82, 32, 16, 98, C.metal)}${R(68, 128, 44, 10, C.metal)}${R(58, 96, 64, 6)}
  ${P('M66 78 H114 V96 H66 Z', C.metal)}${P('M66 70 H76 V78 H66 Z M86 70 H94 V78 H86 Z M104 70 H114 V78 H104 Z', C.metal)}
  <path d="M60 74 H118 M60 74 Q54 80 60 86 M118 74 Q124 80 118 86" fill="none" stroke="${C.red}" stroke-width="2"/>
  ${T(90, 150, '별도 고정 장치(코터핀·안전결선)가 꼭 필요', 'font-size="9"')}
  ${R(262, 40, 16, 90, C.metal)}${R(248, 128, 44, 10, C.metal)}${R(246, 64, 48, 32, C.metal)}${R(246, 64, 48, 8, C.or)}
  ${[44, 50, 56].map(y => L(262, y, 278, y + 3)).join('')}
  ${T(300, 70, '화이버 칼라', `text-anchor="start" fill="${C.or}"`)}
  ${T(258, 44, '나사산 1산 이상 밖으로', 'text-anchor="end" font-size="9"')}${L(259, 42, 263, 47)}
  ${T(270, 150, '250°F 이상인 곳 X · 손으로 돌면 폐기', 'font-size="9"')}`) },

'L3-4': { fig: svg(150, '토크렌치 사용', `
  <circle cx="60" cy="70" r="16" fill="${C.metal}" stroke="currentColor"/><path d="M52 62 L68 62 L72 70 L68 78 L52 78 L48 70 Z" fill="#fff" stroke="currentColor"/>
  ${R(74, 64, 220, 12, C.dark)}${R(270, 60, 40, 20, C.or)}
  ${AR(290, 26, 290, 58, C.red)}${T(296, 30, '힘 F', `text-anchor="start" fill="${C.red}" font-weight="bold"`)}
  ${L(60, 96, 290, 96)}${L(60, 91, 60, 101)}${L(290, 91, 290, 101)}${T(175, 110, '거리(팔 길이)')}
  ${T(180, 130, '토크 = 힘 × 거리 · 인치-파운드 ÷ 12 = 피트-파운드', 'font-weight="bold"')}
  ${T(180, 145, '천천히 일정하게 당기기 · 가능하면 너트 쪽 · 연장 공구를 달면 값 다시 계산 · 교정 확인', 'font-size="9"')}`) },

'L3-5': { cap: '누가 조여도 체결력이 같다 · 하이타이그와 겉모습이 비슷하니 부품번호로 확인 · 개념도', fig: svg(185, '하이록 체결 전후', `
  ${TB(90, 16, '조이는 중')}${TB(270, 16, '다 조인 뒤')}
  ${R(40, 44, 100, 14)}${R(40, 58, 100, 14)}${R(84, 34, 12, 80, C.metal)}${P('M76 44 H104 L98 34 H82 Z', C.metal)}
  ${R(76, 72, 28, 14, C.or)}${P('M80 86 H100 V104 H80 Z', '#f3c27a')}
  ${R(87, 104, 6, 24, C.dark)}
  ${T(112, 80, '칼라', 'text-anchor="start"')}${T(106, 98, '비틂 부분', 'text-anchor="start" font-size="9"')}
  ${T(98, 124, '알렌 렌치로 핀을 잡음', 'text-anchor="start" font-size="9"')}
  ${R(220, 44, 100, 14)}${R(220, 58, 100, 14)}${R(264, 34, 12, 54, C.metal)}${P('M256 44 H284 L278 34 H262 Z', C.metal)}${R(256, 72, 28, 14, C.or)}
  ${P('M300 110 H320 V128 H300 Z', '#f3c27a', 'transform="rotate(20 310 119)"')}
  ${T(296, 146, '정해진 토크에서 끊어져 떨어짐', `fill="${C.red}" font-size="9"`)}${T(296, 158, '→ 조각은 즉시 회수(FOD)', `fill="${C.red}" font-size="9"`)}
  `) },

'L3-6': { cap: '버킹바를 댈 수 없는 곳에 · 블라인드 볼트는 방식마다 전용 그립 게이지 · 개념도', fig: svg(175, '블라인드 리벳 작동 순서', `
  ${[0, 1, 2].map(i => { const x = 60 + i * 120; return R(x - 45, 70, 90, 12) + R(x - 45, 82, 90, 12); }).join('')}
  ${[0, 1, 2].map(i => { const x = 60 + i * 120; return P(`M${x - 13} 70 H${x + 13} V64 H${x - 13} Z`, C.metal); }).join('')}
  ${R(53, 64, 14, 46, C.metal)}${R(58, 24, 4, 94, C.dark)}${P('M54 118 H66 L64 124 H56 Z', C.dark)}
  ${R(173, 64, 14, 30, C.metal)}<ellipse cx="180" cy="104" rx="14" ry="9" fill="${C.metal}" stroke="currentColor"/>${R(178, 24, 4, 76, C.dark)}${AR(180, 28, 180, 8, C.red)}
  ${R(293, 64, 14, 30, C.metal)}<ellipse cx="300" cy="104" rx="14" ry="9" fill="${C.metal}" stroke="currentColor"/>
  ${R(314, 24, 4, 30, C.dark, 'transform="rotate(25 316 40)"')}
  ${T(60, 142, '① 구멍에 넣는다')}${T(180, 142, '② 스템을 당기면')}${T(180, 154, '뒤쪽이 부풀어 머리가 됨', 'font-size="9"')}
  ${T(300, 142, '③ 스템이 끊어지며 끝')}${T(300, 154, '끊어진 스템은 회수', `font-size="9" fill="${C.red}"`)}
  ${T(10, 60, '작업하는 쪽', 'text-anchor="start" font-size="9"')}${T(10, 110, '안 보이는 쪽', 'text-anchor="start" font-size="9"')}
  `) },

'L3-7': { cap: '연료 셀·여압 구역의 기밀용은 정확한 길이의 스크루 + 실런트 · 단면 개념도', fig: svg(150, '너트 플레이트 단면', `
  ${R(60, 40, 240, 12)}${R(60, 52, 240, 14, C.metal)}
  ${R(156, 66, 48, 10, C.dark)}${R(170, 76, 20, 12, C.dark)}
  <circle cx="162" cy="71" r="3" fill="${C.or}"/><circle cx="198" cy="71" r="3" fill="${C.or}"/>
  ${R(176, 22, 8, 64, '#8894a3')}${R(168, 16, 24, 6, '#8894a3')}
  ${T(56, 48, '점검 패널', 'text-anchor="end"')}${T(56, 62, '구조물', 'text-anchor="end"')}
  ${T(214, 90, '너트 플레이트', 'text-anchor="start" font-weight="bold"')}${T(214, 102, '(리벳 2개로 미리 고정)', 'text-anchor="start" font-size="9"')}${L(212, 86, 192, 80)}
  ${T(198, 18, '앞에서 스크루만 돌린다', 'text-anchor="start" font-weight="bold"')}
  ${T(180, 118, '뒤쪽에 손이 들어가지 않아도 조일 수 있다', 'font-weight="bold"')}
  `) },
});
})();
