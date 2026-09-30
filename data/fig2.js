/* 직접 그린 개념도 ② — L4 부식·실링 · L5 복합재 · L6 비파괴검사
   교재 그림을 옮긴 것이 아니라 교재 내용을 바탕으로 새로 그린 SVG 입니다(비율은 개념용).
   도우미는 fig1.js 의 KAI.figkit. 긴 설명은 cap(그림 아래 글)에 둡니다. */
window.KAI = window.KAI || { learn: [], iv: [] };
KAI.media = KAI.media || {};
(function () {
if (!KAI.figkit) return;
const { C, svg, T, TB, L, R, P, AR, dome } = KAI.figkit;
const hex = (cx, cy, r) => 'M' + [0, 1, 2, 3, 4, 5].map(k => { const a = Math.PI / 3 * k; return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' L') + ' Z';
const add = (key, v) => { KAI.media[key] = Object.assign(KAI.media[key] || {}, v); };

/* ── L4 부식·실링·표면처리 ── */
add('L4-4', { cap: '피팅은 가장 파괴적인 형태 중 하나 · 입자간 부식은 초기에 찾기 어려워 초음파·와전류 검사를 쓴다 · 진행되면 박리 부식', fig: svg(140, '부식의 여러 모양', `
  ${R(8, 22, 80, 64, '#dfe8f4')}
  <path d="M16 38 q6 -7 12 0 t12 0 t12 0 M22 56 q5 6 10 0 t10 0 t10 0 t10 0 M18 74 q7 -6 14 0 t14 0" fill="none" stroke="#8a5a2b" stroke-width="2"/>
  ${R(96, 38, 80, 48, C.metal)}
  ${[[112, 5], [134, 7], [158, 4]].map(([x, r]) => `<circle cx="${x}" cy="38" r="${r}" fill="#fff" stroke="currentColor"/><circle cx="${x - 3}" cy="30" r="2" fill="#ddd"/><circle cx="${x + 3}" cy="27" r="2" fill="#ddd"/>`).join('')}
  ${R(184, 40, 80, 46, C.metal)}
  <path d="M184 60 L204 54 L222 66 L244 58 L264 64 M204 54 L200 86 M222 66 L226 86 M244 58 L248 40 M204 54 L210 40" fill="none" stroke="#55606d" stroke-width="1.6"/>
  <path d="M232 40 Q246 30 262 33" fill="none" stroke="#55606d" stroke-width="2"/><path d="M226 40 Q244 24 262 26" fill="none" stroke="#55606d" stroke-width="1.4"/>
  ${R(272, 22, 80, 64, C.metal)}<circle cx="312" cy="54" r="15" fill="none" stroke="#2f2f2f" stroke-width="5" stroke-opacity=".7"/>${dome(312, 58, 18, 4).replace('<path', '<path transform="translate(0,0)"')}<circle cx="312" cy="54" r="8" fill="${C.metal}" stroke="currentColor"/>
  ${TB(48, 104, '필리폼', 'font-size="11"')}${T(48, 118, '도막 아래', 'font-size="9"')}${T(48, 130, '벌레 자국', 'font-size="9"')}
  ${TB(136, 104, '피팅', 'font-size="11"')}${T(136, 118, '흰 가루 아래', 'font-size="9"')}${T(136, 130, '작은 구멍', 'font-size="9"')}
  ${TB(224, 104, '입자간 → 박리', 'font-size="11"')}${T(224, 118, '결정 경계를 따라', 'font-size="9"')}${T(224, 130, '→ 층이 들뜸', 'font-size="9"')}
  ${TB(312, 104, '마찰(프레팅)', 'font-size="11"')}${T(312, 118, '들뜬 리벳 둘레', 'font-size="9"')}${T(312, 130, '검은 고리', 'font-size="9"')}`) });

add('L4-5', { cap: '물과 오염이 모이는 곳이 취약하다 · 드레인 홀(배수 구멍)이 막히면 물이 고인다 · 검사는 세척 → 육안(손전등·거울·확대경) → 필요하면 비파괴검사', fig: svg(140, '부식 취약 부위', `
  ${P('M40 80 Q40 62 70 62 H270 L330 70 V80 L270 92 H70 Q40 92 40 80 Z')}
  <ellipse cx="160" cy="86" rx="55" ry="5" fill="${C.tint}" stroke="currentColor"/>${P('M285 64 L318 24 H334 L330 68 Z')}
  <ellipse cx="170" cy="100" rx="22" ry="6" fill="${C.metal}" stroke="currentColor"/>${L(125, 92, 125, 106)}<circle cx="125" cy="110" r="6" fill="${C.dark}"/>
  ${[[62, 78], [110, 72], [230, 89], [125, 100], [194, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.red}"/>`).join('')}
  ${T(58, 40, '배터리실', `fill="${C.red}" font-weight="bold"`)}${L(58, 43, 62, 73)}
  ${T(130, 40, '화장실·갤리', `fill="${C.red}" font-weight="bold"`)}${L(125, 43, 111, 67)}
  ${T(262, 112, '동체 바닥(물 고임)', `fill="${C.red}" font-weight="bold"`)}${L(250, 104, 232, 93)}
  ${T(88, 132, '바퀴실', `fill="${C.red}" font-weight="bold"`)}${L(96, 124, 121, 112)}
  ${T(196, 132, '엔진 배기 주변', `fill="${C.red}" font-weight="bold"`)}${L(196, 123, 195, 106)}`) });

add('L4-6', { cap: '이액성 실런트는 기제 + 촉진제를 무게비로 섞고 작업 가능 시간 안에 결합한다 · 날개 연료탱크·여압 구역에서 누설을 막는다 · 빠지면 누설 시험 불합격·분해 재작업', fig: svg(130, '페잉면 실링과 필렛 실', `
  ${R(40, 56, 180, 12)}${R(140, 72, 180, 12)}${R(140, 68, 80, 4, C.or)}
  ${P('M220 58 Q222 72 238 72 L220 72 Z', C.or)}
  ${[165, 195].map(x => R(x - 5, 56, 10, 28, C.metal) + dome(x, 56, 18, 5) + P(`M${x - 8} 84 H${x + 8} V88 H${x - 8} Z`, C.metal)).join('')}
  ${T(180, 110, '페잉면 실 — 겹치기 전 맞닿는 면에 바름', 'font-weight="bold"')}${L(180, 101, 182, 71)}
  ${T(268, 44, '필렛 실 — 이음 모서리 둘레', 'font-weight="bold"')}${L(262, 48, 230, 67)}
  ${T(40, 48, '위 판', 'text-anchor="start" font-size="9"')}${T(320, 98, '아래 판', 'text-anchor="end" font-size="9"')}`) });

add('L4-7', { cap: '순수 알루미늄은 합금보다 부식에 강해 합금판 겉에 입힌다(긁히면 보호가 끊김) · 아노다이징 피막은 전기가 잘 안 통해 본딩(전기 연결) 자리는 벗긴다 · 온전한 도장이 가장 효과적인 차단막', fig: svg(190, '알크래드와 표면 마무리 층', `
  ${TB(110, 16, '알크래드 판(단면)')}
  ${R(40, 26, 160, 6, '#eef2f7')}${R(40, 32, 160, 30, C.metal)}${R(40, 62, 160, 6, '#eef2f7')}
  ${T(208, 32, '순수 알루미늄(얇게)', 'text-anchor="start" font-size="9"')}${T(208, 50, '합금 코어(2024 등)', 'text-anchor="start" font-size="9"')}${T(208, 68, '순수 알루미늄(얇게)', 'text-anchor="start" font-size="9"')}
  ${TB(110, 98, '표면 마무리 층(단면)')}
  ${R(40, 108, 160, 10, '#7fa6d8')}${R(40, 118, 160, 8, '#e8d27a')}${R(40, 126, 160, 5, '#8fcf9f')}${R(40, 131, 160, 28, C.metal)}
  ${T(214, 110, '페인트(탑코트)', 'text-anchor="start" font-size="9"')}${L(201, 113, 212, 107, 'stroke-opacity=".45"')}
  ${T(214, 123, '프라이머(밑칠)', 'text-anchor="start" font-size="9"')}${L(201, 122, 212, 120, 'stroke-opacity=".45"')}
  ${T(214, 136, '화학 피막 — 알로다인·아노다이징', 'text-anchor="start" font-size="9"')}${L(201, 128, 212, 133, 'stroke-opacity=".45"')}
  ${T(214, 152, '금속', 'text-anchor="start" font-size="9"')}
  ${T(180, 180, '층이 하나라도 긁히면 그 자리부터 부식이 시작될 수 있다', `fill="${C.red}" font-size="9.5"`)}`) });

/* ── L5 복합재 ── */
add('L5-4', { cap: '코어가 두 면재를 떨어뜨려 잡아 주면 무게는 거의 그대로인데 굽힘에 훨씬 강해진다 · 가장 흔한 코어는 아라미드 종이(노멕스) 허니콤 · 탄소섬유 면재 + 알루미늄 코어는 함께 쓰지 않음(부식)', fig: svg(140, '샌드위치 구조와 허니콤', `
  ${R(40, 34, 180, 8, C.dark)}${R(40, 90, 180, 8, C.dark)}${R(40, 42, 180, 48, '#f3e3b0')}
  ${Array.from({ length: 11 }, (_, i) => L(48 + i * 16, 42, 48 + i * 16, 90, 'stroke-opacity=".7"')).join('')}
  ${T(36, 40, '면재', 'text-anchor="end"')}${T(36, 70, '코어', 'text-anchor="end" font-weight="bold"')}${T(36, 97, '면재', 'text-anchor="end"')}
  ${T(130, 116, '옆에서 본 모습 — 얇은 면재 + 가벼운 코어')}
  ${[[270, 40], [287, 50], [304, 40], [270, 60], [287, 70], [304, 60], [321, 50], [321, 70], [270, 80], [304, 80]].map(([x, y]) => `<path d="${hex(x, y, 10)}" fill="#f3e3b0" stroke="currentColor"/>`).join('')}
  ${AR(262, 102, 332, 102, C.or)}${T(297, 116, '리본 방향', `fill="${C.or}" font-size="9"`)}${T(297, 22, '위에서 본 코어', 'font-size="9"')}`) });

add('L5-6', { cap: '적층을 진공 백으로 감싸 공기·휘발분을 빼고 대기압으로 누른 뒤, 오븐·오토클레이브에서 정해진 경화 곡선대로 굽는다 · 부품 온도는 붙여 둔 열전대(최소 3개)로 잰다', fig: svg(150, '진공 백 적층 순서', `
  ${R(30, 112, 210, 14, C.dark)}${R(50, 108, 170, 4, '#dfe3e8')}${R(50, 96, 170, 12, '#7fa6d8')}
  ${R(50, 93, 170, 3, '#fff', 'stroke-dasharray="3 2"')}${R(50, 85, 170, 8, '#e9e9e9')}
  <path d="M34 112 Q40 80 60 81 H210 Q230 80 236 112" fill="none" stroke="${C.dark}" stroke-width="2.4"/>
  ${R(30, 106, 8, 6, C.or)}${R(232, 106, 8, 6, C.or)}${R(196, 66, 12, 16, C.metal)}${L(208, 70, 222, 60)}
  ${L(220, 101, 244, 96, `stroke="${C.red}"`)}
  ${[['진공 포트 → 펌프', 40, 210, 70], ['진공 백', 54, 150, 81], ['통기재(공기 통로)', 68, 180, 89], ['구멍 뚫린 박리 필름', 82, 180, 94], ['적층(프리프레그)', 96, 180, 102], ['고형 박리 필름', 110, 180, 110], ['몰드(도구)', 124, 200, 120]]
    .map(([s, y, x2, y2]) => T(262, y + 3, s, 'text-anchor="start" font-size="9"') + L(260, y, x2, y2, 'stroke-opacity=".45"')).join('')}
  ${T(18, 96, '밀폐 테이프', `text-anchor="start" font-size="9" fill="${C.or}"`)}${T(262, 140, '열전대(빨강)', `text-anchor="start" font-size="9" fill="${C.red}"`)}`) });

add('L5-7', { cap: '작은 충격(공구를 떨어뜨림)에도 속에서 층이 떨어질 수 있다 → 겉이 괜찮아도 보고 · 허니콤 구조는 양쪽 면을 두드린다 · 정밀하게는 초음파검사', fig: svg(130, '들뜸과 탭 테스트', `
  ${Array.from({ length: 6 }, (_, i) => R(40, 58 + i * 6, 260, 6, i % 2 ? '#cfdcee' : '#b7c9e6', 'stroke-width="0.6"')).join('')}
  <path d="M150 76 Q185 68 220 76 Q185 80 150 76 Z" fill="#fff" stroke="${C.red}" stroke-width="1.6"/>
  <circle cx="100" cy="46" r="8" fill="#e3c35a" stroke="currentColor"/><circle cx="190" cy="46" r="8" fill="#e3c35a" stroke="currentColor"/>
  ${T(100, 28, '맑은 소리 = 정상', `fill="${C.grn}" font-weight="bold"`)}
  ${T(250, 28, '둔탁한 소리 = 들뜸 의심', `fill="${C.red}" font-weight="bold"`)}${L(236, 31, 198, 42)}
  ${T(185, 112, '겉은 멀쩡해도 층 사이가 떨어져 있다', `fill="${C.red}"`)}${L(185, 101, 185, 79)}`) });

add('L5-8', { cap: '다이아몬드 코팅·초경 드릴로 고속 회전·느린 이송 · 작은 기준 구멍을 먼저 뚫고 키운다 · 탄소 분진은 흡입 금지(집진·마스크·보안경)', fig: svg(140, '복합재 드릴과 받침판', `
  ${TB(95, 16, '받침판 없음')}${TB(265, 16, '받침판 있음')}
  ${R(30, 64, 130, 22, '#b7c9e6')}${R(200, 64, 130, 22, '#b7c9e6')}${R(200, 86, 130, 12, C.dark)}
  ${R(90, 24, 10, 34, C.metal)}${P('M90 58 H100 L95 66 Z', C.metal)}${R(260, 24, 10, 34, C.metal)}${P('M260 58 H270 L265 66 Z', C.metal)}
  <path d="M86 86 l-4 8 l6 -3 l1 9 l4 -8 l4 8 l2 -9 l5 4 l-2 -9" fill="none" stroke="${C.red}" stroke-width="1.6"/>
  ${T(95, 118, '출구 쪽이 찢어짐(들뜸)', `fill="${C.red}" font-weight="bold"`)}
  ${T(265, 118, '깨끗한 구멍', `fill="${C.grn}" font-weight="bold"`)}${T(344, 96, '받침판', 'text-anchor="end" font-size="9" fill="#fff"')}`) });

/* ── L6 비파괴검사 ── */
add('L6-2', { cap: '재료와 결함 위치(표면·표면 바로 아래·내부)로 방법을 고른다 · 판정은 교육·자격을 갖춘 사람이 한다 · 교재 10장 내용을 표로 정리', fig: svg(150, '비파괴검사 방법 비교표', `
  ${R(10, 10, 340, 18, C.tint)}${T(45, 23, '방법', 'font-weight="bold"')}${T(150, 23, '찾는 결함', 'font-weight="bold"')}${T(280, 23, '쓸 수 있는 재료', 'font-weight="bold"')}
  ${[['육안(VT)', '겉으로 보이는 것', '모든 재료'], ['침투(PT)', '표면에 열린 결함', '금속·세라믹·플라스틱'], ['자분(MT)', '표면·바로 아래', '강자성체(철강)만'],
     ['와전류(ET)', '표면·바로 아래', '전기가 통하는 재료만'], ['초음파(UT)', '내부까지·두께', '대부분(접촉매질 필요)'], ['방사선(RT)', '내부까지', '대부분(방사선 안전!)']]
    .map((r, i) => { const y = 28 + i * 20; return `<rect x="10" y="${y}" width="340" height="20" fill="${i % 2 ? '#f6f9fd' : '#fff'}" stroke="currentColor" stroke-opacity=".25"/>` +
      T(45, y + 14, r[0], 'font-weight="bold" font-size="9.5"') + T(150, y + 14, r[1], 'font-size="9.5"') + T(280, y + 14, r[2], `font-size="9.5" ${/만|!/.test(r[2]) ? `fill="${C.red}"` : ''}`); }).join('')}
  ${L(80, 10, 80, 148, 'stroke-opacity=".25"')}${L(220, 10, 220, 148, 'stroke-opacity=".25"')}`) });

add('L6-3', { cap: '순서: 세척 → 침투액 → 남은 침투액 제거 → 건조 → 현상제 → 판독 · 표면에 열린 결함만 찾는다 · 형광 침투는 자외선등으로 본다', fig: svg(135, '액체침투검사 원리', `
  ${[0, 1, 2, 3].map(i => { const x = 10 + i * 88; return R(x, 50, 76, 40, C.metal) + (i < 3 ? P(`M${x + 34} 50 L${x + 38} 84 L${x + 42} 50 Z`, C.red, 'stroke="none"') : ''); }).join('')}
  ${R(10, 45, 76, 5, C.red)}${R(186, 43, 76, 7, '#fff')}<ellipse cx="226" cy="44" rx="8" ry="3" fill="${C.red}"/>
  ${R(274, 44, 76, 6, '#fff')}<path d="M286 47 q8 -3 16 0 t16 0 t16 0" fill="none" stroke="${C.red}" stroke-width="2.2"/>
  ${[0, 1, 2].map(i => AR(88 + i * 88, 70, 97 + i * 88, 70)).join('')}
  ${T(48, 106, '① 침투액이')}${T(48, 119, '균열에 스며듦')}${T(136, 106, '② 겉의 침투액')}${T(136, 119, '닦아 냄')}
  ${T(224, 106, '③ 흰 현상제가')}${T(224, 119, '빨아 올림')}${T(312, 106, '④ 균열 모양이')}${T(312, 119, '드러남 → 판독')}
  ${T(180, 30, '표면까지 열린 균열(빨강 = 침투액)', 'font-size="9.5"')}`) });

add('L6-4', { cap: '전기가 통하는 재료에만 쓴다 · 볼트 구멍 주변 균열·열 손상 부위를 찾는 데 효과적 · 같은 재료에 아는 결함을 넣은 기준 시편으로 교정 · 전자 수업의 코일·교류·임피던스와 같은 원리', fig: svg(135, '와전류검사 원리', `
  ${R(40, 80, 280, 20, C.metal)}
  ${[0, 1, 2, 3].map(i => `<ellipse cx="170" cy="${44 + i * 7}" rx="16" ry="4" fill="none" stroke="${C.or}" stroke-width="2"/>`).join('')}${L(170, 28, 170, 40)}${L(170, 28, 120, 28)}${R(88, 18, 32, 20, C.dark)}
  <ellipse cx="170" cy="87" rx="42" ry="5" fill="none" stroke="${C.or}" stroke-dasharray="4 2"/><ellipse cx="170" cy="87" rx="24" ry="3" fill="none" stroke="${C.or}" stroke-dasharray="4 2"/>
  ${L(206, 80, 208, 94, `stroke="${C.red}" stroke-width="2.4"`)}
  ${T(196, 40, '교류가 흐르는 코일(탐촉자)', 'text-anchor="start"')}${T(104, 14, '측정기', 'font-size="9"')}
  ${T(100, 118, '와전류(소용돌이 전류)', `fill="${C.or}"`)}${L(100, 110, 140, 90, `stroke="${C.or}"`)}
  ${T(262, 118, '균열이 흐름을 방해 → 신호 변화', `fill="${C.red}" font-weight="bold"`)}${L(250, 110, 210, 92, `stroke="${C.red}"`)}`) });

add('L6-6', { cap: '강자성체(철강)에만 쓴다 · 결함 방향을 모르므로 원형·선형 자화를 모두 한다 · 검사 뒤에는 반드시 탈자(남은 자기 없애기)', fig: svg(130, '자분탐상검사 누설 자장', `
  ${R(40, 60, 280, 30, C.metal)}${TB(52, 80, 'N')}${TB(308, 80, 'S')}
  ${[68, 76, 84].map(y => `<line x1="66" y1="${y}" x2="294" y2="${y}" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="6 4"/>`).join('')}${AR(270, 68, 292, 68)}
  ${L(180, 60, 181, 78, `stroke="${C.red}" stroke-width="2.6"`)}
  <path d="M166 60 Q180 34 194 60" fill="none" stroke="${C.or}" stroke-width="1.6" stroke-dasharray="3 2"/>
  ${[[172, 55], [176, 52], [180, 50], [184, 52], [188, 55], [178, 56], [183, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#222"/>`).join('')}
  ${T(180, 26, '균열에서 자기가 새어 나옴 → 쇳가루가 모임', 'font-weight="bold"')}
  ${T(180, 110, '자력선(점선)과 결함이 수직일 때 가장 잘 보인다')}`) });
})();
