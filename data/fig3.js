/* 직접 그린 개념도 ③ — L7 도면 · L8 금속재료 · L9 생산기술 실무
   교재 그림을 옮긴 것이 아니라 교재 내용을 바탕으로 새로 그린 SVG 입니다(비율·품번은 예시).
   도우미는 fig1.js 의 KAI.figkit. 긴 설명은 cap(그림 아래 글)에 둡니다. */
window.KAI = window.KAI || { learn: [], iv: [] };
KAI.media = KAI.media || {};
(function () {
if (!KAI.figkit) return;
const { C, svg, T, TB, L, R, P, AR } = KAI.figkit;
const add = (key, v) => { KAI.media[key] = Object.assign(KAI.media[key] || {}, v); };
const box = (cx, y, w, h, l1, l2, f = '#fff') => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="5" fill="${f}" stroke="currentColor"/>` +
  T(cx, y + (l2 ? 10 : h / 2 + 3.5), l1, 'font-size="9" font-weight="bold"') + (l2 ? T(cx, y + 20, l2, 'font-size="8.5"') : '');

/* ── L7 도면 ── */
add('L7-2', { cap: '표제란(보통 오른쪽 아래)에서 도면번호·명칭·축척·승인을 보고 → 개정란에서 최신 판인지 → 부품목록에서 부품·수량 → 주석 순서로 읽는다 · 가장자리의 숫자·글자가 구역번호(지도 좌표처럼) · 도면 내용은 예시', fig: svg(175, '도면 틀 표제란 개정란 부품목록', `
  <rect x="8" y="8" width="344" height="160" fill="#fff" stroke="currentColor" stroke-width="1.4"/><rect x="22" y="22" width="316" height="132" fill="none" stroke="currentColor" stroke-opacity=".6"/>
  ${[['4', 60], ['3', 140], ['2', 220], ['1', 300]].map(([s, x]) => T(x, 18, s, 'font-size="9"')).join('')}${[['C', 50], ['B', 90], ['A', 130]].map(([s, y]) => T(15, y, s, 'font-size="9"')).join('')}
  ${P('M50 60 H70 V112 H120 V130 H50 Z')}<circle cx="60" cy="80" r="4" fill="#fff" stroke="currentColor"/>
  ${T(36, 146, '주석: 1. 버 제거  2. 지정 프라이머', 'text-anchor="start" font-size="8.5"')}
  ${R(238, 22, 100, 24, '#f6f9fd')}${T(288, 32, '개정란 REV', 'font-size="8.5" font-weight="bold"')}${T(288, 42, 'A · 날짜 · 내용 · 승인', 'font-size="8"')}
  ${R(200, 88, 138, 30, '#f6f9fd')}${T(269, 99, '부품목록(BOM)', 'font-size="8.5" font-weight="bold"')}${T(269, 111, '품번 · 명칭 · 재료 · 수량', 'font-size="8"')}
  ${R(200, 118, 138, 36, '#fff6e0')}${L(200, 130, 338, 130)}${L(200, 142, 338, 142)}${L(262, 118, 262, 154)}
  ${T(231, 127, '도면번호', 'font-size="8"')}${T(300, 127, '470204-1', 'font-size="8" font-weight="bold"')}
  ${T(231, 139, '명칭 · 축척', 'font-size="8"')}${T(300, 139, '브래킷 · 1:1', 'font-size="8"')}
  ${T(231, 151, '날짜 · 회사', 'font-size="8"')}${T(300, 151, '제도·확인·승인', 'font-size="8"')}
  ${T(166, 128, '표제란 →', `font-size="9" fill="${C.red}" font-weight="bold"`)}`) });

add('L7-4', { cap: '제3각법: 정면도를 가운데 두고, 위에서 본 모양은 위에, 오른쪽에서 본 모양은 오른쪽에 둔다(학교 제도 시간과 같은 배치) · 원 하나는 구멍일 수도 돌기일 수도 있으니 다른 면과 짝지어 판단 · 점선 = 보이지 않는 구멍(은선)', fig: svg(160, '제3각법 정면도 평면도 우측면도', `
  ${[60, 80, 120].map(x => L(x, 62, x, 78, 'stroke-dasharray="2 3" stroke-opacity=".4"')).join('')}${[80, 110, 130].map(y => L(122, y, 148, y, 'stroke-dasharray="2 3" stroke-opacity=".4"')).join('')}
  ${R(60, 20, 60, 40)}${L(80, 20, 80, 60)}<circle cx="100" cy="40" r="6" fill="#fff" stroke="currentColor"/>
  ${P('M60 80 H80 V110 H120 V130 H60 Z')}${L(94, 110, 94, 130, 'stroke-dasharray="3 2"')}${L(106, 110, 106, 130, 'stroke-dasharray="3 2"')}
  ${R(150, 80, 40, 50)}${L(150, 110, 190, 110)}${L(164, 110, 164, 130, 'stroke-dasharray="3 2"')}${L(176, 110, 176, 130, 'stroke-dasharray="3 2"')}
  ${TB(90, 14, '평면도')}${TB(90, 148, '정면도')}${TB(170, 148, '우측면도')}
  ${T(208, 60, '① 정면도를 가운데', 'text-anchor="start" font-size="9.5"')}${T(208, 76, '② 위에서 본 모양 → 위', 'text-anchor="start" font-size="9.5"')}
  ${T(208, 92, '③ 오른쪽에서 본 모양 → 오른쪽', 'text-anchor="start" font-size="9.5"')}${T(208, 116, '점선 = 안 보이는 구멍', `text-anchor="start" font-size="9.5" fill="${C.red}"`)}`) });

add('L7-8', { cap: '레그 = 긴 쪽, 플랜지 = 짧은 쪽 · 곡률반경(R)은 반경 중심에서 금속 안쪽 면까지 · 굽힘 허용량(BA)은 굽은 부분의 길이(중립선 기준) · 재료·두께별 최소 곡률반경보다 작게 구부리면 균열', fig: svg(150, '판금 굽힘 용어', `
  ${P('M76 30 V94 A24 24 0 0 0 100 118 H300 V110 H100 A16 16 0 0 1 84 94 V30 Z')}
  <path d="M80 94 A20 20 0 0 0 100 114" fill="none" stroke="${C.red}" stroke-width="2.4"/>
  ${L(100, 94, 89, 105, `stroke="${C.or}"`)}<circle cx="100" cy="94" r="2" fill="${C.or}"/>${T(106, 92, 'R', `text-anchor="start" fill="${C.or}" font-weight="bold"`)}
  ${T(92, 42, '플랜지(짧은 쪽)', 'text-anchor="start"')}${T(220, 104, '레그(긴 쪽)')}
  ${T(54, 128, 'BA', `text-anchor="end" fill="${C.red}" font-weight="bold"`)}${L(56, 124, 84, 108, `stroke="${C.red}"`)}
  ${L(60, 30, 60, 118)}${L(56, 30, 64, 30)}${L(56, 118, 64, 118)}${L(76, 136, 300, 136)}${L(76, 132, 76, 140)}${L(300, 132, 300, 140)}
  ${T(190, 148, '기준 측정 = 성형된 부품의 바깥 치수(도면에 표시)', 'font-size="9"')}
  ${T(240, 50, '굽힘선은 그레인(압연 방향)에', 'font-size="9"')}${T(240, 63, '가능하면 90°로', 'font-size="9"')}`) });

/* ── L8 금속재료 ── */
add('L8-6', { cap: '2017·2024 리벳은 상온에서 시효경화로 금방 단단해진다 → 담금질 직후 빙점 이하로 보관하고, 꺼낸 뒤 정해진 시간 안에 박는다(교재에 따라 냉장고·냉동고로 표현) · 가장 많이 쓰는 2117(AD)은 받은 그대로 사용', fig: svg(140, '아이스박스 리벳 사용 시간', `
  ${R(18, 28, 56, 50, '#e7f1fb')}${L(18, 44, 74, 44)}${T(46, 38, '❄', 'font-size="12"')}${T(46, 62, '냉장·냉동', 'font-size="9"')}${T(46, 92, '담금질 후 보관', 'font-size="8.5"')}
  ${T(46, 108, '꺼낸 뒤 시간 →', 'font-size="8.5" font-weight="bold"')}
  ${L(110, 110, 320, 110)}${[0, 20, 40, 60].map(t => L(110 + t * 3.3, 106, 110 + t * 3.3, 114) + T(110 + t * 3.3, 124, t + '분', 'font-size="8.5"')).join('')}
  ${R(110, 40, 50, 16, '#8fcf9f')}${R(160, 40, 150, 16, '#f4c7ca', 'stroke-dasharray="3 2"')}
  ${R(110, 72, 198, 16, '#8fcf9f')}
  ${T(104, 52, '2024', 'text-anchor="end" font-size="9" font-weight="bold"')}${T(104, 84, '2017', 'text-anchor="end" font-size="9" font-weight="bold"')}
  ${T(135, 52, '10~20분', 'font-size="8.5"')}${T(235, 52, '시간 지남 → 쓰지 않고 반납', `font-size="8.5" fill="${C.red}"`)}${T(209, 84, '약 1시간 안에 박기', 'font-size="8.5"')}`) });

add('L8-8', { cap: '빨리 식히면 단단해지고(담금질), 공기 중에서 식히면 내부응력이 풀리고(불림), 노 안에서 아주 천천히 식히면 가장 연해진다(풀림) · 경화 뒤에는 반드시 뜨임으로 취성을 줄인다 · 곡선 모양은 개념용', fig: svg(150, '강 열처리 냉각 속도 비교', `
  ${L(40, 20, 40, 130)}${L(40, 130, 345, 130)}${T(36, 16, '온도', 'text-anchor="start" font-size="9"')}${T(342, 144, '시간 →', 'text-anchor="end" font-size="9"')}
  ${L(40, 55, 345, 55, 'stroke-dasharray="5 3" stroke-opacity=".5"')}${T(342, 51, '변태점(임계점)', 'text-anchor="end" font-size="8.5"')}
  <path d="M40 125 L90 40 H130" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M130 40 Q138 110 150 125" fill="none" stroke="${C.red}" stroke-width="2.2"/>
  <path d="M130 40 Q180 95 250 125" fill="none" stroke="${C.grn}" stroke-width="2.2"/>
  <path d="M130 40 Q240 60 335 122" fill="none" stroke="#3a6fc4" stroke-width="2.2"/>
  <path d="M150 125 L165 82 H200 L215 125" fill="none" stroke="${C.or}" stroke-width="1.8" stroke-dasharray="4 2"/>
  ${T(110, 34, '가열·유지', 'font-size="9"')}
  ${T(128, 104, '담금질', `text-anchor="end" fill="${C.red}" font-weight="bold"`)}${T(128, 116, '(물·기름) → 단단', `text-anchor="end" fill="${C.red}" font-size="8.5"`)}
  ${T(183, 76, '뜨임', `fill="${C.or}" font-weight="bold"`)}
  ${T(246, 110, '불림(공기 중)', `fill="${C.grn}" font-weight="bold"`)}
  ${T(290, 80, '풀림(노 안에서 천천히)', `fill="#3a6fc4" font-weight="bold"`)}`) });

/* ── L9 생산기술 실무 ── */
add('L9-3', { cap: 'BOM = 어떤 부품이 몇 개, 어느 조립품 아래 들어가는지 정리한 목록 · 작업 전 품번·수량·도면 리비전을 대조해 부품을 모은다(키팅) · 그림의 이름·품번·수량은 예시', fig: svg(150, 'BOM 부품 구성 트리 예시', `
  ${box(180, 10, 130, 26, '날개 조립품', 'W-100 ×1', '#fff6e0')}
  ${L(180, 36, 180, 46)}${L(60, 46, 300, 46)}${[60, 180, 300].map(x => L(x, 46, x, 56)).join('')}
  ${box(60, 56, 104, 26, '리브 조립품', 'W-110 ×12', '#e8f0fb')}${box(180, 56, 104, 26, '외피 패널', 'W-120 ×2', '#e8f0fb')}${box(300, 56, 104, 26, '스트링거', 'W-130 ×16', '#e8f0fb')}
  ${L(60, 82, 60, 92)}${L(40, 92, 240, 92)}${[40, 140, 240].map(x => L(x, 92, x, 102)).join('')}
  ${box(40, 102, 76, 26, '리브', 'W-111 ×1')}${box(140, 102, 96, 26, '브래킷', 'W-112 ×4')}${box(240, 102, 96, 26, '리벳', 'MS20470AD4-6')}
  ${T(240, 142, '×120 (리브 조립품 1개당)', 'font-size="8.5"')}${T(344, 142, '예시', `text-anchor="end" font-size="8.5" fill="${C.red}"`)}`) });

add('L9-4', { cap: 'GD&T(기하공차) = 모양·자세·위치의 허용 범위를 기호로 정하는 방법 · 반드시 데이텀(기준 면·선·점)에서 잰다 · 네모 친 치수는 기준 치수 · 조립 치구의 기준핀·기준면도 도면 데이텀에 맞춰 만든다 · 교재 밖 일반 지식', fig: svg(165, '기하공차 틀과 데이텀', `
  ${R(40, 12, 30, 22, '#fff')}${R(70, 12, 56, 22, '#fff')}${R(126, 12, 24, 22, '#fff')}${R(150, 12, 24, 22, '#fff')}
  <circle cx="55" cy="23" r="6" fill="none" stroke="currentColor"/>${L(55, 15, 55, 31)}${L(47, 23, 63, 23)}
  ${T(98, 27, '⌀0.2', 'font-size="11"')}${T(138, 27, 'A', 'font-size="11" font-weight="bold"')}${T(162, 27, 'B', 'font-size="11" font-weight="bold"')}
  ${T(186, 20, '위치도 · 허용 범위(지름 0.2 원)', 'text-anchor="start" font-size="9"')}${T(186, 32, '· 데이텀 A → B 순서로 기준', 'text-anchor="start" font-size="9"')}
  ${R(60, 60, 160, 80)}<circle cx="150" cy="100" r="10" fill="#fff" stroke="currentColor"/><circle cx="150" cy="100" r="4" fill="none" stroke="${C.red}" stroke-dasharray="2 1.5"/>
  ${L(55, 145, 225, 145, `stroke="${C.grn}" stroke-width="2.4"`)}${T(40, 150, 'A', `fill="${C.grn}" font-weight="bold" font-size="12"`)}
  ${L(55, 55, 55, 145, `stroke="#3a6fc4" stroke-width="2.4"`)}${T(46, 58, 'B', `fill="#3a6fc4" font-weight="bold" font-size="12"`)}
  ${L(60, 76, 150, 76, 'stroke-opacity=".6"')}${R(92, 69, 24, 13, '#fff', 'stroke-width="0.8"')}${T(104, 79, '90', 'font-size="8.5"')}
  ${L(196, 100, 196, 140, 'stroke-opacity=".6"')}${R(184, 113, 24, 13, '#fff', 'stroke-width="0.8"')}${T(196, 123, '40', 'font-size="8.5"')}
  ${T(240, 94, '구멍 중심이 빨간 점선 원', `text-anchor="start" font-size="9" fill="${C.red}"`)}${T(240, 107, '안에 있으면 합격', `text-anchor="start" font-size="9" fill="${C.red}"`)}
  ${T(236, 132, '예: 평면도 ▱ · 직각도 ⊥', 'text-anchor="start" font-size="9"')}`) });

add('L9-6', { cap: 'FOD(이물질 손상) — 공구·리벳·안전결선 조각·걸레 하나가 조종 계통을 걸거나 엔진에 빨려 들어갈 수 있다 · 섀도 보드·5S 는 교재 밖 일반 현장 방법', fig: svg(140, '공구 섀도 보드와 FOD 예방', `
  <rect x="20" y="16" width="180" height="108" rx="8" fill="#3d4a5c"/>
  <rect x="36" y="32" width="70" height="10" rx="5" fill="#8fa3bd"/><circle cx="36" cy="37" r="8" fill="#8fa3bd"/><circle cx="106" cy="37" r="8" fill="#8fa3bd"/>
  <rect x="36" y="62" width="44" height="6" fill="#8fa3bd"/><rect x="80" y="58" width="30" height="14" rx="4" fill="#8fa3bd"/>
  <path d="M40 92 L90 104 M40 104 L90 92" stroke="#8fa3bd" stroke-width="5" stroke-linecap="round"/>
  <rect x="136" y="30" width="48" height="16" rx="6" fill="none" stroke="#ff7b7f" stroke-width="2" stroke-dasharray="4 3"/>
  <rect x="152" y="62" width="8" height="46" fill="#8fa3bd"/><rect x="138" y="58" width="36" height="12" fill="#8fa3bd"/>
  ${T(160, 26, '빈 칸 = 밖에 있다!', 'font-size="8.5" fill="#ff9da0" font-weight="bold"')}
  ${T(110, 136, '공구 모양대로 그린 보관판(섀도 보드)', 'font-size="9"')}
  ${[['✔ 작업 전후 공구 수 확인', 40], ['✔ 남은 리벳·칩·걸레 회수', 62], ['✔ 구획 닫기 전 FOD 점검', 84], ['✔ 5S: 정리·정돈·청소', 106]].map(([s, y]) => T(212, y, s, 'text-anchor="start" font-size="9.5"')).join('')}`) });

add('L9-8', { cap: '사고는 한 가지가 아니라 여러 요인이 겹쳐 생긴다 · 주의가 흐트러지면 세 단계 전으로 돌아가 다시 · 교대 때는 문서로 인계하고 앞 단계를 확인 · 교재 11장(인적요인) 요약', fig: svg(165, 'PEAR 모델과 더티 도즌', `
  ${[['P', '작업자', '피로·건강·스트레스'], ['E', '환경', '조명·소음·날씨'], ['A', '행동', '절차·순서·기록'], ['R', '자원', '공구·부품·문서·인력']].map(([k, n, ex], i) => {
    const x = 10 + i * 86; return `<rect x="${x}" y="12" width="80" height="50" rx="8" fill="${C.tint}" stroke="currentColor"/>` +
      T(x + 20, 36, k, 'font-size="18" font-weight="bold"') + T(x + 54, 32, n, 'font-size="10" font-weight="bold"') + T(x + 40, 54, ex, 'font-size="8"'); }).join('')}
  ${T(180, 80, '더티 도즌 — 정비 오류를 부르는 12가지', 'font-size="10.5" font-weight="bold"')}
  ${['의사소통 결여', '자만심', '지식 결여', '주의산만', '팀워크 결여', '피로', '자원 부족', '압박', '자기주장 결여', '스트레스', '인식 결여', '관행']
    .map((s, i) => { const x = 10 + (i % 4) * 86, y = 88 + Math.floor(i / 4) * 24; return `<rect x="${x}" y="${y}" width="80" height="20" rx="10" fill="#fff4f4" stroke="${C.red}" stroke-opacity=".5"/>` + T(x + 40, y + 14, s, 'font-size="9"'); }).join('')}`) });
})();
