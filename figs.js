/* ══════════════════════════════════════════════════════════════
   KAI 면접 마스터 — 배우기 그림 모음 2 (보조07 · 2026-10-01)
   공용 그리기 도우미 links/fig.js 를 쓴다(사본 두지 않음). index.html 이 media.js 다음에 부른다.

   옛 그림(data/fig1~3.js · 단원 파일 안 fig)은 그대로 두고, **그림이 없던 절**에만 새로 그렸다.
   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['L3-1'], draw:function(){ … } }
       cards — 단원-절번호(1부터). app.js 가 그 절에 옛 그림이 없을 때 이 그림을 붙인다
   그림 내용은 각 절의 본문·요점을 옮긴 것이다. 회사 정보(L10)는 절에 적힌 공식 홈페이지 확인값만 썼다.
   교재 그림을 따라 그리지 않았다 — 모양·비율은 개념용.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  function hex(cx, cy, r, o) {
    var p = [];
    for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return F.poly(p, Object.assign({ close: 1, fill: C.grayL, w: 2 }, o || {}));
  }
  /* 비행기 윗면 — 원점 = 동체 가운데, 기수 -120 · 꼬리 +122 · 날개 끝 ±115 */
  function plane(o) {
    o = o || {};
    var fb = o.fus || C.grayL, wf = o.wing || C.grayL;
    var s = F.path('M0,-120 C10,-110 14,-90 14,-70 L14,95 L0,122 L-14,95 L-14,-70 C-14,-90 -10,-110 0,-120 Z', { fill: fb, w: 1.8 });
    s = F.poly([[14, -25], [115, 25], [115, 40], [14, 20]], { close: 1, fill: wf, w: 1.8 }) +
      F.poly([[-14, -25], [-115, 25], [-115, 40], [-14, 20]], { close: 1, fill: wf, w: 1.8 }) +
      F.poly([[14, 85], [52, 104], [52, 113], [10, 108]], { close: 1, fill: o.tail || wf, w: 1.6 }) +
      F.poly([[-14, 85], [-52, 104], [-52, 113], [-10, 108]], { close: 1, fill: o.tail || wf, w: 1.6 }) + s;
    if (o.nose) s += F.path('M0,-120 C6,-114 10,-104 11,-96 L-11,-96 C-10,-104 -6,-114 0,-120 Z', { fill: o.nose, c: o.noseC || C.ink, w: 1.6 });
    return s;
  }
  function steps(xs, y, w, h, labels, o) {
    o = o || {};
    var s = '';
    labels.forEach(function (lb, i) {
      s += box(xs[i], y, w, h, { fill: (o.fills && o.fills[i]) || o.fill || C.grayL, c: (o.cs && o.cs[i]) || o.c || C.line, label: lb, size: o.size || 14 });
      if (i < labels.length - 1) s += arrow(xs[i] + w + 2, y + h / 2, xs[i + 1] - 2, y + h / 2, { head: 8, c: o.ac || C.ink, w: 1.6 });
    });
    return s;
  }

  return {

  /* ─────────── L3 체결 하드웨어 ─────────── */
  anbolt: { cards: ['L3-1'],
    cap: 'AN 볼트 번호 읽기 — AN3DD5A = AN 볼트 · 지름 3/16in · 2024 알루미늄합금 · 길이 5/8in · 생크 구멍 없음',
    draw: function () {
      var s = t(240, 24, 'AN 볼트 번호 읽기', { a: 'm', b: 1, size: 17 });
      var seg = [['AN', 70, C.ink, C.grayL], ['3', 44, C.blue, C.blueL], ['DD', 70, C.orange, C.orangeL], ['5', 44, C.green, C.greenL], ['A', 44, C.purple, C.purpleL]];
      var x = 92, cx = [];
      seg.forEach(function (g) {
        s += box(x, 46, g[1], 52, { fill: g[3], c: g[2], w: 2, r: 6 }) + t(x + g[1] / 2, 72, g[0], { a: 'm', size: 28, b: 1, c: g[2], halo: false });
        cx.push(x + g[1] / 2); x += g[1] + 6;
      });
      /* 위 줄 이름표: AN · DD · A / 아래 줄: 3 · 5 */
      s += line(cx[0], 98, cx[0], 116, { c: C.sub, w: 1.2 }) + t(cx[0] - 10, 134, 'AN 규격\n볼트', { a: 'm', size: 13 });
      s += line(cx[2], 98, cx[2], 116, { c: C.orange, w: 1.2 }) + t(cx[2], 134, '재질\n2024 알루미늄', { a: 'm', size: 13, c: C.orange, b: 1 });
      s += line(cx[4], 98, cx[4], 116, { c: C.purple, w: 1.2 }) + t(cx[4] + 12, 134, '생크에\n구멍 없음', { a: 'm', size: 13, c: C.purple, b: 1 });
      s += line(cx[1], 98, cx[1], 178, { c: C.blue, w: 1.2 }) + t(cx[1] - 14, 198, '지름 3/16 in\n(1/16 단위)', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += line(cx[3], 98, cx[3], 178, { c: C.green, w: 1.2 }) + t(cx[3] + 14, 198, '길이 5/8 in\n(1/8 단위)', { a: 'm', size: 13, c: C.green, b: 1 });
      s += t(240, 240, '길이 숫자 앞 H = 머리에 안전결선 구멍 · 교체는 원래와 같은 번호로', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 258, s);
    } },

  bolthead: { cards: ['L3-1'],
    cap: '볼트 머리 표시 — 강은 돌출 “-”(또는 별표) · 알루미늄합금은 “-” 두 개 · NAS 정밀공차 볼트는 삼각형',
    draw: function () {
      var s = t(240, 24, '볼트 머리 표시로 재질을 가린다', { a: 'm', b: 1, size: 17 });
      var cx = [90, 240, 390], cy = 96;
      cx.forEach(function (x) { s += hex(x, cy, 50) + F.circle(x, cy, 38, { fill: 'none', c: C.line, w: 1 }); });
      s += box(cx[0] - 16, cy - 4, 32, 8, { fill: C.ink, c: C.ink, r: 2, w: 1 });
      s += box(cx[1] - 16, cy - 13, 32, 7, { fill: C.blue, c: C.blue, r: 2, w: 1 }) + box(cx[1] - 16, cy + 6, 32, 7, { fill: C.blue, c: C.blue, r: 2, w: 1 });
      s += F.poly([[cx[2], cy - 18], [cx[2] - 18, cy + 13], [cx[2] + 18, cy + 13]], { close: 1, fill: C.orange, c: C.orange, w: 1.4 });
      s += t(cx[0], 172, '강\n돌출 “-” 또는 별표', { a: 'm', size: 14 });
      s += t(cx[1], 172, '알루미늄합금\n“- -” 두 개', { a: 'm', size: 14, c: C.blue, b: 1 });
      s += t(cx[2], 172, 'NAS 정밀공차\n삼각형', { a: 'm', size: 14, c: C.orange, b: 1 });
      s += t(240, 212, '너트는 머리 표시가 없다 → 번호·색·모양으로 구분', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 228, s);
    } },

  /* ─────────── L4 부식 ─────────── */
  corr: { cards: ['L4-1'],
    cap: '부식 — 정련해 만든 금속이 산소·물과 만나 원래 상태로 돌아간다 · 부산물 색으로 금속을 짐작한다',
    draw: function () {
      var s = box(24, 44, 124, 50, { fill: C.grayL, label: '광석\n(원래 상태)', size: 14 });
      s += box(332, 44, 124, 50, { fill: C.blueL, c: C.blue, label: '금속', size: 16 });
      s += box(178, 118, 124, 50, { fill: C.redL, c: C.red, label: '부식 생성물', size: 15 });
      s += arrow(150, 69, 330, 69, { c: C.blue, w: 2 }) + t(240, 56, '정련 — 에너지를 넣어', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += F.route([[394, 94], [394, 143], [304, 143]], { c: C.red, w: 2, head: 10 }) + t(400, 118, '산소 · 소금물\n· 수증기', { size: 13, c: C.red, b: 1 });
      s += F.route([[176, 143], [86, 143], [86, 96]], { c: C.sub, w: 1.6, dash: '6 4', head: 10 }) + t(80, 124, '원래 상태로', { a: 'e', size: 13, c: C.sub });
      s += line(20, 190, 460, 190, { c: C.edge, w: 1.4 });
      s += t(20, 212, '부산물 색으로 금속을 짐작한다', { b: 1, size: 15 });
      var sw = [['#e5e7eb', '흰색·회색 가루', '알루미늄·마그네슘'], ['#3f9b6e', '녹색', '구리 합금'], ['#8a3b1d', '적갈색 녹', '철']];
      sw.forEach(function (d, i) {
        var x = 90 + i * 150;
        s += box(x - 22, 228, 44, 30, { fill: d[0], c: C.ink, w: 1.2, r: 6 });
        s += t(x, 274, d[2], { a: 'm', size: 14, b: 1 }) + t(x, 294, d[1], { a: 'm', size: 13, c: C.sub });
      });
      return F.svg(480, 310, s);
    } },

  /* ─────────── L5 복합재료 ─────────── */
  comp: { cards: ['L5-1'],
    cap: '복합재 — 섬유가 힘을, 수지가 모양을 · 금속은 어느 방향이나 같고(등방성) 복합재는 섬유 방향만 강하다(이방성)',
    draw: function () {
      var s = t(120, 24, '단면 — 섬유 + 수지', { a: 'm', b: 1, size: 16 }) + t(360, 24, '방향에 따라', { a: 'm', b: 1, size: 16 }) + divider(240, 14, 232);
      s += box(25, 44, 190, 92, { fill: C.yellowL, c: C.orange, w: 1.6, r: 4 });
      for (var r = 0; r < 4; r++) for (var c = 0; c < 9; c++) s += F.circle(42 + c * 19.5 + (r % 2) * 5, 60 + r * 20, 6.5, { fill: C.blue, c: C.blue, w: 1 });
      s += t(120, 162, '섬유 = 힘(하중)을 맡는다', { a: 'm', size: 15, b: 1, c: C.blue });
      s += t(120, 198, '수지 = 섬유를 붙잡아 모양 유지\n하중을 섬유로 전달', { a: 'm', size: 13, c: C.orange, b: 1 });
      /* 등방성 */
      s += F.circle(290, 80, 22, { fill: C.grayM });
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(function (d) { s += arrow(290 + d[0] * 24, 80 + d[1] * 24, 290 + d[0] * 44, 80 + d[1] * 44, { head: 8, w: 1.8 }); });
      s += t(342, 70, '금속 = 등방성', { size: 14, b: 1 }) + t(342, 92, '어느 쪽이나 같다', { size: 13, c: C.sub });
      /* 이방성 */
      s += box(262, 158, 60, 40, { fill: C.yellowL, c: C.orange, r: 3, w: 1.4 });
      for (var k = 0; k < 4; k++) s += line(266, 166 + k * 8, 318, 166 + k * 8, { c: C.blue, w: 2 });
      s += arrow(256, 178, 250, 178, { c: C.orange, w: 3, head: 12 }) + arrow(328, 178, 344, 178, { c: C.orange, w: 3, head: 12 });
      s += t(350, 168, '복합재 = 이방성', { size: 14, b: 1, c: C.orange }) + t(350, 190, '섬유 방향만 강하다', { size: 13, c: C.sub });
      return F.svg(480, 236, s);
    } },

  fiber: { cards: ['L5-3'],
    cap: '섬유 세 가지 — 유리(흰색)는 레이돔·페어링, 아라미드(노란색)는 충격받기 쉬운 곳, 탄소(검정·회색)는 날개·동체 1차 구조',
    draw: function () {
      var s = F.g(plane({ fus: '#6b7280', wing: '#6b7280', tail: '#6b7280', nose: '#ffffff', noseC: C.blue }), { x: 135, y: 162, s: 0.95 });
      s += callout(135, 52, 178, 30, '레이돔', { c: C.blue, tc: C.blue, b: 1 });
      s += callout(205, 186, 190, 288, '날개·동체 = 탄소', { c: C.ink, b: 1, a: 'm' });
      var L = [
        ['#ffffff', C.blue, '유리섬유 (흰색)', '싸고 전기가 안 통함', '→ 레이돔·페어링 (2차 구조)'],
        [C.yellowL, C.orange, '아라미드·케블러 (노란색)', '충격에 강함', '→ 충격받기 쉬운 곳'],
        ['#6b7280', C.ink, '탄소섬유 (검정·회색)', '매우 단단하고 강함', '→ 날개·동체 (1차 구조)']
      ];
      L.forEach(function (d, i) {
        var y = 30 + i * 86;
        s += box(276, y, 22, 22, { fill: d[0], c: d[1], w: 1.6, r: 4 });
        s += t(306, y + 11, d[2], { size: 14, b: 1, c: d[1] === C.orange ? C.orange : C.ink });
        s += t(306, y + 36, d[3], { size: 13 }) + t(306, y + 58, d[4], { size: 13, b: 1, c: C.sub });
      });
      s += divider(262, 20, 280);
      return F.svg(480, 304, s);
    } },

  prepreg: { cards: ['L5-5'],
    cap: '프리프레그 — 냉동 보관, 꺼낸 시각을 기록, 밀봉한 채 해동한 뒤 연다 · 처리 수명은 기계적 수명보다 짧다',
    draw: function () {
      var s = t(240, 22, '프리프레그 — 꺼낸 순간부터 시간이 흐른다', { a: 'm', b: 1, size: 16 });
      s += steps([12, 106, 200, 294, 388], 40, 80, 56, ['냉동 보관\n−18℃ 이하', '꺼낸 시각\n기록', '밀봉한 채\n완전 해동', '봉지 열기', '적층'],
        { size: 13, fills: [C.blueL, C.orangeL, C.grayL, C.grayL, C.greenL], cs: [C.blue, C.orange, C.line, C.line, C.green] });
      s += t(240, 116, '먼저 열면 찬 재료에 습기가 맺혀 오염', { a: 'm', size: 13, c: C.red, b: 1 });
      s += t(20, 150, '상온에서 쓸 수 있는 시간 (꺼낸 시각부터 누적)', { size: 14, b: 1 });
      s += line(110, 166, 110, 244, { w: 2 }) + t(102, 205, '꺼낸\n시각', { a: 'e', size: 13, c: C.orange, b: 1 });
      s += box(110, 176, 180, 26, { fill: C.orange, c: C.orange, r: 4, label: '처리 수명 — 적층 권장', size: 13, lc: '#fff' });
      s += box(110, 210, 346, 26, { fill: C.blue, c: C.blue, r: 4, label: '기계적 수명 — 경화 전까지 최대', size: 13, lc: '#fff' });
      s += t(298, 189, '더 짧다', { size: 13, c: C.orange, b: 1 });
      s += t(240, 268, '저장 수명 = 냉동 상태 최대 보관 기간 (보통 6개월~1년) · 막대 길이는 개념', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 286, s);
    } },

  /* ─────────── L6 검사 ─────────── */
  visual: { cards: ['L6-1'],
    cap: '표면 균열 육안검사 — 손전등은 5~45° 비스듬히, 시선은 반사광보다 위 · 의심되면 약 10배 확대경',
    draw: function () {
      var s = t(150, 24, '빛은 비스듬히', { a: 'm', b: 1, size: 16 }) + t(392, 24, '의심되면', { a: 'm', b: 1, size: 16 }) + divider(304, 14, 244);
      s += line(16, 200, 290, 200, { w: 2.2 }) + F.hatch(16, 200, 274, 16, { gap: 9, c: C.line });
      s += line(36, 132, 62, 144, { c: C.grayM, w: 16 }) + line(64, 139, 61, 150, { c: C.ink, w: 3 });
      s += t(44, 110, '손전등', { a: 'm', size: 13, b: 1 });
      s += arrow(66, 150, 168, 199, { c: C.orange, w: 2.4 });
      s += line(170, 200, 284, 145, { c: C.orange, w: 1.6, dash: '6 4' }) + t(286, 136, '반사광', { a: 'e', size: 13, c: C.orange });
      var p = [];
      for (var i = 0; i <= 12; i++) { var a = Math.PI + i / 12 * 0.45; p.push([170 + 52 * Math.cos(a), 200 + 52 * Math.sin(a)]); }
      s += F.poly(p, { c: C.blue, w: 1.4 }) + t(108, 190, '5~45°', { a: 'e', size: 13, c: C.blue, b: 1 });
      /* 눈 */
      s += F.path('M232,92 Q252,76 272,92 Q252,108 232,92 Z', { fill: '#fff', w: 1.6 }) + F.circle(252, 92, 6, { fill: C.ink, c: C.ink, w: 1 });
      s += line(246, 104, 174, 196, { c: C.blue, w: 1.4, dash: '4 4' });
      s += t(252, 62, '시선은 반사광보다 위', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += t(150, 232, '균열', { a: 'm', size: 13, c: C.red, b: 1 }) + line(160, 200, 176, 200, { c: C.red, w: 3 });
      /* 확대경 */
      s += F.circle(392, 92, 34, { fill: C.blueL, c: C.ink, w: 3 }) + line(416, 116, 442, 142, { w: 7 });
      s += t(392, 92, '×10', { a: 'm', size: 16, b: 1, c: C.blue, halo: false });
      s += t(392, 170, '약 10배 확대경', { a: 'm', size: 14, b: 1 });
      s += arrow(392, 184, 392, 202, { head: 8, w: 1.4, c: C.sub });
      s += t(392, 226, '부족하면\n침투·자분·와전류', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 256, s);
    } },

  compdef: { cards: ['L6-7'],
    cap: '복합재·접합 구조물의 결함은 겉으로 안 보인다 — 탭 테스트: 맑은 소리는 정상, 둔탁한 소리는 결함 의심',
    draw: function () {
      var s = t(240, 22, '허니콤 샌드위치 단면 — 대표 결함 4가지', { a: 'm', b: 1, size: 16 });
      var x0 = 24, x1 = 456;
      s += box(x0, 44, x1 - x0, 8, { fill: C.grayM, r: 1, w: 1 }) + box(x0, 52, x1 - x0, 8, { fill: C.grayM, r: 1, w: 1 }) + box(x0, 60, x1 - x0, 8, { fill: C.grayM, r: 1, w: 1 });
      s += box(x0, 68, x1 - x0, 58, { fill: '#fff', r: 0, w: 1.2 });
      for (var x = x0 + 18; x < x1; x += 18) s += line(x, 68, x, 126, { c: C.line, w: 1 });
      s += box(x0, 126, x1 - x0, 14, { fill: C.grayM, r: 1, w: 1 });
      /* 층간분리 · 접착분리 · 기공 · 수분 */
      s += F.path('M64,52 Q100,47 136,52 Q100,57 64,52 Z', { fill: '#fff', c: C.red, w: 1.4 });
      s += F.path('M196,68 Q234,60 272,68 Z', { fill: '#fff', c: C.red, w: 1.6 });
      s += F.circle(318, 56, 3, { fill: '#fff', c: C.red, w: 1.2 }) + F.circle(330, 62, 2.5, { fill: '#fff', c: C.red, w: 1.2 }) + F.circle(342, 55, 3, { fill: '#fff', c: C.red, w: 1.2 });
      [[392, 110], [400, 116], [418, 112], [410, 104]].forEach(function (d) { s += F.circle(d[0], d[1], 4, { fill: C.blue, c: C.blue, w: 1 }); });
      s += line(100, 54, 100, 156, { c: C.red, w: 1 }) + t(100, 172, '층간분리\n층이 갈라짐', { a: 'm', size: 13, c: C.red, b: 1 });
      s += line(234, 66, 234, 156, { c: C.red, w: 1 }) + t(234, 172, '접착분리\n외피–코어', { a: 'm', size: 13, c: C.red, b: 1 });
      s += line(330, 64, 330, 156, { c: C.red, w: 1 }) + t(330, 172, '기공', { a: 'm', size: 13, c: C.red, b: 1 });
      s += line(406, 120, 406, 156, { c: C.blue, w: 1 }) + t(406, 172, '코어 속\n수분', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += line(20, 200, 460, 200, { c: C.edge, w: 1.4 });
      s += t(20, 222, '탭 테스트 — 동전으로 두드려 소리를 듣는다', { b: 1, size: 15 });
      function tap(x, bad) {
        var o = box(x, 266, 150, 14, { fill: C.grayM, r: 2, w: 1 }) + box(x, 280, 150, 18, { fill: '#fff', r: 0, w: 1 });
        if (bad) o += F.path('M' + (x + 50) + ',280 Q' + (x + 75) + ',272 ' + (x + 100) + ',280 Z', { fill: '#fff', c: C.red, w: 1.4 });
        o += F.circle(x + 75, 248, 11, { fill: C.orangeL, c: C.orange, w: 1.6 }) + arrow(x + 75, 240, x + 75, 262, { c: C.orange, head: 7, w: 1.2 });
        var c = bad ? C.red : C.green;
        o += F.path('M' + (x + 98) + ',238 q8,10 0,20', { c: c, w: 1.6 }) + F.path('M' + (x + 108) + ',234 q12,14 0,28', { c: c, w: 1.6 });
        return o;
      }
      s += tap(30, false) + t(240 - 106, 316, '맑은 소리 → 정상', { a: 'm', size: 14, b: 1, c: C.green });
      s += tap(290, true) + t(365, 316, '둔탁한 소리 → 결함 의심', { a: 'm', size: 14, b: 1, c: C.red });
      return F.svg(480, 334, s);
    } },

  weld: { cards: ['L6-8'],
    cap: '용접부 대표 결함 — 균열 · 언더컷(오목한 홈) · 오버랩(넘쳐 덮임) · 블로홀(가스 기공)',
    draw: function () {
      var s = '';
      function base(x, y) {
        return box(x + 16, y + 70, 92, 22, { fill: C.grayL, r: 1, w: 1.6 }) + box(x + 112, y + 70, 92, 22, { fill: C.grayL, r: 1, w: 1.6 }) +
          F.path('M' + (x + 72) + ',' + (y + 71) + ' Q' + (x + 110) + ',' + (y + 34) + ' ' + (x + 148) + ',' + (y + 71) + ' Z', { fill: C.grayM, w: 1.6 });
      }
      var P = [[20, 30], [250, 30], [20, 160], [250, 160]];
      /* 균열 */
      s += base(P[0][0], P[0][1]) + F.poly([[124, 86], [131, 91], [124, 95], [132, 100]], { c: C.red, w: 2.4 });
      s += t(P[0][0] + 12, P[0][1] + 16, '균열', { size: 15, b: 1, c: C.red }) + t(P[0][0] + 110, P[0][1] + 110, '용착금속·열 영향부의 금', { a: 'm', size: 13, c: C.sub });
      /* 언더컷 */
      var x = P[1][0], y = P[1][1];
      s += base(x, y) + F.path('M' + (x + 60) + ',' + (y + 70) + ' Q' + (x + 66) + ',' + (y + 82) + ' ' + (x + 73) + ',' + (y + 70) + ' Z', { fill: '#fff', c: C.red, w: 1.8 });
      s += F.path('M' + (x + 147) + ',' + (y + 70) + ' Q' + (x + 154) + ',' + (y + 82) + ' ' + (x + 160) + ',' + (y + 70) + ' Z', { fill: '#fff', c: C.red, w: 1.8 });
      s += t(x + 12, y + 16, '언더컷 — 오목한 홈', { size: 15, b: 1, c: C.red }) + t(x + 110, y + 110, '모재가 너무 녹아 파임 → 노치', { a: 'm', size: 13, c: C.sub });
      /* 오버랩 */
      x = P[2][0]; y = P[2][1];
      s += base(x, y) + F.path('M' + (x + 140) + ',' + (y + 62) + ' Q' + (x + 166) + ',' + (y + 58) + ' ' + (x + 184) + ',' + (y + 66) + ' L' + (x + 184) + ',' + (y + 69) + ' L' + (x + 146) + ',' + (y + 69) + ' Z', { fill: C.grayM, w: 1.6 });
      s += line(x + 148, y + 70, x + 184, y + 70, { c: C.red, w: 2.4, dash: '4 3' });
      s += t(x + 12, y + 16, '오버랩 — 넘쳐 덮임', { size: 15, b: 1, c: C.red }) + t(x + 110, y + 110, '녹지 않은 모재 위를 덮음', { a: 'm', size: 13, c: C.sub });
      /* 블로홀 */
      x = P[3][0]; y = P[3][1];
      s += base(x, y);
      [[100, 60, 4.5], [116, 54, 3.5], [124, 64, 3.5], [108, 66, 3]].forEach(function (d) { s += F.circle(x + d[0], y + d[1], d[2], { fill: '#fff', c: C.red, w: 1.4 }); });
      s += t(x + 12, y + 16, '블로홀 — 가스 기공', { size: 15, b: 1, c: C.red }) + t(x + 110, y + 110, '용착금속 속 가스 구멍', { a: 'm', size: 13, c: C.sub });
      s += divider(240, 30, 280) + line(20, 152, 460, 152, { c: C.grayM, w: 1.2, dash: '6 5' });
      s += t(240, 296, '겉모양 먼저 → 필요하면 방사선·초음파·자분·형광침투', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 312, s);
    } },

  /* ─────────── L7 도면 ─────────── */
  dwg3: { cards: ['L7-1'],
    cap: '도면 세 가지 — 상세도(부품 하나) · 조립도(2개 이상의 관계) · 설치도(항공기에 달린 위치) · 치수는 예시',
    draw: function () {
      var s = t(85, 26, '상세도', { a: 'm', b: 1, size: 16 }) + t(240, 26, '조립도', { a: 'm', b: 1, size: 16, c: C.blue }) + t(395, 26, '설치도', { a: 'm', b: 1, size: 16, c: C.orange });
      s += divider(162, 16, 236) + divider(318, 16, 236);
      /* 상세도 — L 브래킷 하나 */
      s += F.poly([[50, 62], [50, 146], [136, 146], [136, 132], [64, 132], [64, 62]], { close: 1, fill: C.grayL, w: 2.2 });
      s += F.dim(50, 146, 136, 146, '86', { off: 14, side: -1, size: 13 }) + F.dim(50, 62, 50, 146, '84', { off: 14, size: 13 });
      s += t(85, 206, '부품 1개 — 크기·모양\n재료·제작 방법', { a: 'm', size: 13 });
      /* 조립도 — 판 + 브래킷 + 볼트 */
      s += box(184, 128, 112, 14, { fill: C.blueL, c: C.blue, r: 1, w: 1.8 });
      s += F.poly([[214, 64], [214, 128], [270, 128], [270, 116], [226, 116], [226, 64]], { close: 1, fill: C.grayL, w: 2 });
      s += box(234, 112, 8, 36, { fill: C.ink, c: C.ink, r: 1, w: 1 }) + box(252, 112, 8, 36, { fill: C.ink, c: C.ink, r: 1, w: 1 });
      s += line(226, 80, 278, 70, { c: C.sub, w: 1 }) + F.num(286, 68, '1', { r: 10, size: 12 });
      s += line(290, 136, 300, 160, { c: C.sub, w: 1 }) + F.num(302, 168, '2', { r: 10, size: 12 });
      s += t(240, 206, '부품 2개 이상이\n맞물리는 관계', { a: 'm', size: 13 });
      /* 설치도 — 항공기 위 자리 */
      s += F.g(plane(), { x: 395, y: 118, s: 0.5 });
      s += F.circle(426, 122, 5, { fill: C.orange, c: C.orange, w: 1 });
      s += F.dim(395, 160, 426, 160, '', { size: 12, c: C.orange });
      s += line(395, 52, 395, 180, { c: C.sub, w: 1, dash: 'center' });
      s += t(395, 206, '항공기에 달린 최종 위치\n· 기준 치수', { a: 'm', size: 13 });
      return F.svg(480, 236, s);
    } },

  /* ─────────── L8 재료 ─────────── */
  props4: { cards: ['L8-1'],
    cap: '금속의 성질 — 연성(늘인다) · 전성(편다) · 탄성(돌아온다) · 취성(깨진다, 구조재에 나쁨)',
    draw: function () {
      var s = '';
      var P = [[20, 20], [250, 20], [20, 136], [250, 136]];
      /* 연성 */
      var x = P[0][0], y = P[0][1];
      s += t(x + 4, y + 18, '연성 — 늘이거나 굽힌다', { size: 15, b: 1, c: C.blue });
      s += box(x + 10, y + 40, 50, 20, { fill: C.grayM, r: 3, w: 1.4 }) + arrow(x + 66, y + 50, x + 86, y + 50, { head: 8, w: 1.4 });
      s += box(x + 92, y + 45, 112, 10, { fill: C.blueL, c: C.blue, r: 3, w: 1.4 });
      s += arrow(x + 108, y + 72, x + 92, y + 72, { c: C.blue, head: 7, w: 1.4 }) + arrow(x + 188, y + 72, x + 204, y + 72, { c: C.blue, head: 7, w: 1.4 });
      s += t(x + 148, y + 92, '끊어지지 않고 늘어남', { a: 'm', size: 13, c: C.sub });
      /* 전성 */
      x = P[1][0]; y = P[1][1];
      s += t(x + 4, y + 18, '전성 — 얇게 편다', { size: 15, b: 1, c: C.green });
      s += box(x + 10, y + 36, 40, 34, { fill: C.grayM, r: 3, w: 1.4 }) + arrow(x + 56, y + 53, x + 76, y + 53, { head: 8, w: 1.4 });
      s += box(x + 82, y + 60, 128, 8, { fill: C.greenL, c: C.green, r: 2, w: 1.4 });
      s += arrow(x + 146, y + 36, x + 146, y + 56, { c: C.green, head: 8, w: 2 });
      s += t(x + 146, y + 92, '눌러서 판이 됨', { a: 'm', size: 13, c: C.sub });
      /* 탄성 */
      x = P[2][0]; y = P[2][1];
      s += t(x + 4, y + 18, '탄성 — 힘을 빼면 돌아온다', { size: 15, b: 1, c: C.orange });
      s += box(x + 20, y + 32, 10, 52, { fill: C.ink, c: C.ink, r: 1, w: 1 });
      s += box(x + 30, y + 52, 150, 9, { fill: C.grayM, r: 2, w: 1.4 });
      s += F.path('M' + (x + 30) + ',' + (y + 56) + ' Q' + (x + 120) + ',' + (y + 60) + ' ' + (x + 176) + ',' + (y + 82), { c: C.orange, w: 2, dash: '5 4' });
      s += F.route([[x + 192, y + 80], [x + 200, y + 68], [x + 190, y + 58]], { c: C.orange, head: 8, w: 1.6 });
      s += t(x + 110, y + 98, '탄성한계를 넘지 않게 설계', { a: 'm', size: 13, c: C.sub });
      /* 취성 */
      x = P[3][0]; y = P[3][1];
      s += t(x + 4, y + 18, '취성 — 조금만 휘어도 깨진다', { size: 15, b: 1, c: C.red });
      s += F.poly([[x + 20, y + 46], [x + 96, y + 46], [x + 102, y + 52], [x + 94, y + 58], [x + 100, y + 64], [x + 20, y + 64]], { close: 1, fill: C.grayM, w: 1.4 });
      s += F.g(F.poly([[x + 116, y + 46], [x + 196, y + 46], [x + 196, y + 64], [x + 116, y + 64], [x + 122, y + 58], [x + 114, y + 52]], { close: 1, fill: C.grayM, w: 1.4 }), { x: 0, y: 0 });
      s += line(x + 104, y + 40, x + 112, y + 34, { c: C.red, w: 2 }) + line(x + 106, y + 72, x + 114, y + 78, { c: C.red, w: 2 });
      s += t(x + 110, y + 98, '구조재에는 나쁜 성질', { a: 'm', size: 13, c: C.red, b: 1 });
      s += divider(240, 20, 250) + line(20, 128, 460, 128, { c: C.grayM, w: 1.2, dash: '6 5' });
      return F.svg(480, 252, s);
    } },

  temper: { cards: ['L8-4'],
    cap: '템퍼(질별) 기호 — 7075-T6 = 7075 합금을 용체화처리 후 인공시효한 것 · F·O·H·W·T 의 뜻',
    draw: function () {
      var s = t(170, 50, '7075', { a: 'm', size: 30, b: 1 }) + t(232, 50, '-', { a: 'm', size: 30, b: 1, c: C.sub }) + t(276, 50, 'T6', { a: 'm', size: 30, b: 1, c: C.orange });
      s += line(130, 72, 210, 72, { w: 1.4 }) + line(254, 72, 298, 72, { c: C.orange, w: 1.4 });
      s += t(170, 88, '합금 번호', { a: 'm', size: 13 }) + t(276, 88, '템퍼 기호', { a: 'm', size: 13, c: C.orange, b: 1 });
      var R = [['F', '제조된\n그대로'], ['O', '풀림\n가장 연함'], ['H', '가공경화\n냉간가공']];
      R.forEach(function (d, i) {
        var x = 20 + i * 92;
        s += box(x, 112, 80, 38, { fill: C.grayL, label: d[0], size: 18 });
        s += t(x + 40, 172, d[1], { a: 'm', size: 13 });
      });
      s += box(300, 112, 160, 38, { fill: C.blueL, c: C.blue, label: '용체화처리 →', size: 15 });
      var T = [['W', '직후\n불안정', C.grayL, C.line], ['T3', '+ 냉간\n가공', C.grayL, C.line], ['T4', '자연\n시효', C.grayL, C.line], ['T6', '인공\n시효', C.orangeL, C.orange]];
      T.forEach(function (d, i) {
        var x = 166 + i * 76;
        s += line(380, 150, x + 32, 204, { c: C.blue, w: 1.2 });
        s += box(x, 204, 64, 36, { fill: d[2], c: d[3], w: d[3] === C.orange ? 2 : 1.6, label: d[0], size: 16 });
        s += t(x + 32, 262, d[1], { a: 'm', size: 13, c: d[3] === C.orange ? C.orange : C.ink, b: d[3] === C.orange ? 1 : 0 });
      });
      s += t(80, 232, 'T6 —\n구조재에서\n자주 본다', { a: 'm', size: 13, c: C.orange, b: 1 });
      return F.svg(480, 290, s);
    } },

  sae: { cards: ['L8-7'],
    cap: 'SAE 4130 = 크롬-몰리브덴강 · 탄소 약 0.30% · 티타늄은 알루미늄보다 약 60% 무겁고 스테인리스강보다 약 50% 가볍다',
    draw: function () {
      var s = t(240, 22, 'SAE 강 번호 읽기', { a: 'm', b: 1, size: 16 });
      s += t(212, 58, '41', { a: 'm', size: 32, b: 1, c: C.blue }) + t(268, 58, '30', { a: 'm', size: 32, b: 1, c: C.orange });
      s += line(212, 78, 150, 96, { c: C.blue, w: 1.2 }) + line(268, 78, 330, 96, { c: C.orange, w: 1.2 });
      s += t(140, 114, '강의 종류(주 합금원소)\n41 → 크롬-몰리브덴강', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += t(340, 114, '탄소 함유량\n30 → 약 0.30%', { a: 'm', size: 13, c: C.orange, b: 1 });
      s += line(20, 146, 460, 146, { c: C.edge, w: 1.4 });
      s += t(20, 166, '같은 부피의 무게 (대략)', { size: 14, b: 1 });
      var B = [['알루미늄', 70, C.grayM, '기준'], ['티타늄', 112, C.blue, '약 60% 무겁다'], ['스테인리스강', 224, C.sub, '티타늄의 약 2배']];
      B.forEach(function (d, i) {
        var y = 192 + i * 30;
        s += t(104, y, d[0], { a: 'e', size: 14, b: d[0] === '티타늄' ? 1 : 0, c: d[0] === '티타늄' ? C.blue : C.ink });
        s += box(112, y - 10, d[1], 20, { fill: d[2], c: d[2], r: 4, w: 1 });
        s += t(120 + d[1], y, d[3], { size: 13, c: d[0] === '티타늄' ? C.blue : C.sub, b: d[0] === '티타늄' ? 1 : 0 });
      });
      return F.svg(480, 272, s);
    } },

  /* ─────────── L9 작업 안전 ─────────── */
  drill: { cards: ['L9-7'],
    cap: '드릴 작업 안전 — 보안경 · 가공물 고정 · 박히면 먼저 정지(회전 중인 척을 손으로 잡지 않는다) · 칩 청소',
    draw: function () {
      var s = t(240, 22, '드릴 작업 안전 4가지', { a: 'm', b: 1, size: 16 });
      var X = [66, 182, 298, 414];
      /* 보안경 */
      s += box(X[0] - 44, 66, 40, 28, { fill: C.blueL, c: C.ink, r: 10, w: 2 }) + box(X[0] + 4, 66, 40, 28, { fill: C.blueL, c: C.ink, r: 10, w: 2 }) +
        line(X[0] - 4, 76, X[0] + 4, 76, { w: 2.4 }) + F.path('M' + (X[0] - 44) + ',78 Q' + X[0] + ',118 ' + (X[0] + 44) + ',78', { c: C.sub, w: 2 });
      /* 바이스 고정 */
      s += box(X[1] - 46, 110, 92, 14, { fill: C.grayM, r: 2, w: 1.6 }) + box(X[1] - 40, 70, 16, 40, { fill: C.grayL, r: 2, w: 1.6 }) + box(X[1] + 24, 70, 16, 40, { fill: C.grayL, r: 2, w: 1.6 }) +
        box(X[1] - 24, 80, 48, 16, { fill: C.orangeL, c: C.orange, r: 2, w: 1.6 }) + line(X[1] + 40, 90, X[1] + 54, 90, { w: 3 }) + line(X[1] + 54, 78, X[1] + 54, 102, { w: 3 });
      /* 정지 */
      s += F.circle(X[2], 90, 30, { fill: C.red, c: C.red }) + t(X[2], 90, '정지', { a: 'm', size: 16, b: 1, c: '#fff', halo: false });
      /* 칩 청소 */
      s += box(X[3] - 10, 52, 12, 42, { fill: C.orangeL, c: C.orange, r: 3, w: 1.6, }) + box(X[3] - 22, 94, 36, 16, { fill: C.grayM, r: 2, w: 1.4 });
      for (var k = 0; k < 6; k++) s += line(X[3] - 18 + k * 6, 110, X[3] - 20 + k * 6, 124, { c: C.ink, w: 1.4 });
      [[X[3] + 22, 122], [X[3] + 32, 116], [X[3] + 40, 124]].forEach(function (p) { s += F.poly([[p[0], p[1]], [p[0] + 6, p[1] - 4], [p[0] + 4, p[1] + 3]], { close: 1, fill: C.sub, c: C.sub, w: 1 }); });
      s += t(X[0], 160, '보안경\n헐거운 옷 금지', { a: 'm', size: 13, b: 1 });
      s += t(X[1], 160, '가공물 고정\n재료에 맞는 rpm', { a: 'm', size: 13, b: 1 });
      s += t(X[2], 160, '박히면 먼저 정지\n척을 손으로 ✗', { a: 'm', size: 13, b: 1, c: C.red });
      s += t(X[3], 160, '끝나면 칩 청소\n(FOD 예방)', { a: 'm', size: 13, b: 1 });
      return F.svg(480, 190, s);
    } },

  /* ─────────── L10 회사 ─────────── */
  kai1: { cards: ['L10-1'],
    cap: 'KAI 는 체계종합업체 — 설계·개발부터 생산·군수지원까지 전체를 맡는다 · 사업 3축은 항공·우주·애프터마켓',
    draw: function () {
      var s = t(240, 22, '체계종합 — 한 대를 처음부터 끝까지', { a: 'm', b: 1, size: 16 });
      s += steps([30, 180, 330], 40, 120, 44, ['설계·개발', '생산', '군수지원'], { size: 15, fill: C.blueL, c: C.blue });
      s += F.path('M30,94 v8 h420 v-8', { c: C.blue, w: 1.6 }) + t(240, 118, 'KAI 가 전체를 책임진다', { a: 'm', size: 14, b: 1, c: C.blue });
      var P = [['항공', '고정익 · 회전익\n무인기 · 기체 구조물'], ['우주', '위성 · 발사체'], ['애프터마켓', '항공기 정비\n성능개량']];
      P.forEach(function (d, i) {
        var x = 20 + i * 152;
        s += box(x, 140, 136, 90, { fill: C.grayL });
        s += t(x + 68, 160, d[0], { a: 'm', size: 16, b: 1, halo: false });
        s += t(x + 68, 200, d[1], { a: 'm', size: 13, halo: false });
      });
      s += t(240, 252, '1999.10.01 설립 · 본사 경남 사천', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 268, s);
    } },

  kai2: { cards: ['L10-2'],
    cap: 'KAI 고정익 계보 — KT-1(기본훈련기)·KA-1 · T-50(최초 국산 초음속기)과 계열기 · KF-21 보라매 개발 단계',
    draw: function () {
      var s = '';
      s += box(20, 26, 110, 50, { fill: C.grayL, label: 'KT-1\n기본훈련기', size: 14 });
      s += arrow(132, 51, 166, 51, { head: 9 });
      s += box(168, 26, 132, 50, { fill: C.grayL, label: 'KA-1\n공격 능력 추가', size: 14 });
      s += t(316, 51, '순수 국내기술\n4개국 수출', { size: 13, c: C.sub });
      s += box(20, 104, 110, 50, { fill: C.blueL, c: C.blue, label: 'T-50\n고등훈련기', size: 14 });
      s += t(75, 168, '최초 국산 초음속기', { a: 'm', size: 13, c: C.blue, b: 1 });
      s += box(158, 96, 306, 66, { fill: 'none', c: C.blue, w: 1.2, dash: '5 4', r: 10 });
      s += t(311, 186, 'T-50 계열 · 6개국 수출', { a: 'm', size: 13, c: C.blue });
      s += arrow(132, 129, 156, 129, { head: 9, c: C.blue });
      ['FA-50\n전투기', 'TA-50\n전술입문기', 'T-50B\n곡예기'].forEach(function (w, i) {
        s += box(168 + i * 98, 104, 88, 50, { fill: '#fff', c: C.blue, label: w, size: 14 });
      });
      s += box(20, 208, 110, 50, { fill: C.orangeL, c: C.orange, label: 'KF-21\n보라매', size: 14 });
      s += arrow(132, 233, 148, 233, { head: 8, c: C.orange });
      s += steps([150, 230, 310, 390], 212, 66, 42, ['시제기\n출고', '최초\n비행', '초음속\n비행', '개발\n완료'], { size: 13, fill: '#fff', c: C.orange, ac: C.orange });
      s += t(75, 272, '한국형 전투기', { a: 'm', size: 13, c: C.orange, b: 1 });
      return F.svg(480, 288, s);
    } },

  kai4: { cards: ['L10-4'],
    cap: 'KAI 가 만드는 기체 구조물 — 날개·날개 리브·전방동체·미익·윙팁 (해외 고객 도면·품질 기준대로)',
    draw: function () {
      var s = F.g(plane({ wing: C.blueL, fus: C.grayL, tail: C.orangeL }), { x: 128, y: 146, s: 1.0 });
      /* 오른쪽 날개 리브(점선) */
      [44, 64, 84, 104].forEach(function (x) {
        s += line(128 + x, 146 - 25 + (x - 14) * 50 / 101, 128 + x, 146 + 20 + (x - 14) * 20 / 101, { c: C.blue, w: 1.2, dash: '3 3' });
      });
      s += F.path('M114,46 C114,36 120,30 128,26 C136,30 142,36 142,46 L142,76 L114,76 Z', { fill: C.purpleL, c: C.purple, w: 1.4, op: 0.85 });
      s += line(262, 20, 262, 268, { c: C.grayM, w: 1.2, dash: '6 5' });
      s += callout(138, 60, 278, 42, '전방동체 — F-15', { c: C.purple, size: 13, b: 1 });
      s += callout(170, 150, 278, 100, '날개 — 보잉 여러 기종 · A320', { c: C.blue, size: 13, b: 1 });
      s += callout(222, 172, 278, 156, '날개 리브 — A350XWB', { c: C.blue, size: 13, b: 1 });
      s += t(284, 176, '(아시아 최초 설계 승인권)', { size: 13, c: C.sub });
      s += callout(165, 252, 278, 226, '미익 · 윙팁 — P-8', { c: C.orange, size: 13, b: 1 });
      s += line(240, 186, 278, 226, { c: C.orange, w: 1.2 }) + F.circle(240, 186, 3, { fill: C.orange, c: C.orange, w: 1 });
      s += t(240, 284, '헬기는 아파치 동체 · 해외 고객의 도면·품질 기준대로 만든다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 302, s);
    } },

  kai5: { cards: ['L10-5'],
    cap: 'KAI 생산 4공정 — 복합재 가공 → 구조물 제작 → 최종 조립 → 도장 · PLM 과 생산관리를 이어 동시공학',
    draw: function () {
      var s = t(20, 22, '생산 4공정', { b: 1, size: 16 }) + t(460, 22, 'AS9100 품질 인증', { a: 'e', size: 13, b: 1, c: C.green });
      s += steps([14, 130, 246, 362], 40, 102, 52, ['복합재\n가공', '구조물\n제작', '최종\n조립', '도장'], { size: 15, fill: C.blueL, c: C.blue });
      ['KF-21\n외피 적층', 'RDS 로봇\n주익 드릴링', 'KUH-1 · T-50\n최종 조립', 'T-50\n도장 자동화'].forEach(function (w, i) {
        s += t(65 + i * 116, 122, w, { a: 'm', size: 13, c: C.sub });
      });
      s += line(20, 154, 460, 154, { c: C.edge, w: 1.4 });
      s += box(50, 172, 140, 52, { fill: C.orangeL, c: C.orange, label: 'PLM\n(설계 정보)', size: 14 });
      s += box(290, 172, 140, 52, { fill: C.greenL, c: C.green, label: '생산관리\n시스템', size: 14 });
      s += arrow(194, 198, 286, 198, { both: true, head: 10 });
      s += t(240, 246, '동시공학 — 설계와 생산을 함께 진행', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 264, s);
    } },

  kai6: { cards: ['L10-6'],
    cap: 'KAI 국내 사업장 — 대부분 경남 서부(사천·진주·산청·고성) · 대전연구센터 · 서울사무소 (위치는 개념 배치)',
    draw: function () {
      var s = box(16, 16, 290, 250, { fill: C.grayL, c: C.line, w: 1.2, r: 18 }) + t(30, 38, '경남 서부', { size: 15, b: 1, c: C.sub });
      var P = [['산청', '산청 사업장', 140, 66], ['진주', '회전익비행센터', 150, 124], ['사천', '본사 · 종포', 120, 186], ['고성', '고성 사업장', 238, 204]];
      s += F.poly([[150, 124], [120, 186], [108, 238]], { c: C.green, w: 2, dash: '6 4' });
      s += t(98, 246, '삼천포', { a: 'e', size: 13, c: C.sub }) + F.circle(108, 238, 4, { fill: C.sub, c: C.sub, w: 1 });
      s += t(70, 214, '통근버스', { a: 'm', size: 13, c: C.green, b: 1 });
      P.forEach(function (d) {
        var main = d[0] === '사천';
        s += F.circle(d[2], d[3], main ? 9 : 7, { fill: main ? C.blue : '#fff', c: C.blue, w: 2 });
        s += t(d[2] + 14, d[3] - 8, d[0], { size: 15, b: 1, c: main ? C.blue : C.ink });
        s += t(d[2] + 14, d[3] + 12, d[1], { size: 13, c: C.sub });
      });
      s += box(326, 40, 138, 42, { fill: '#fff', c: C.blue, label: '대전연구센터', size: 14 });
      s += box(326, 96, 138, 42, { fill: '#fff', c: C.blue, label: '서울사무소', size: 14 });
      s += t(395, 168, '해외 사무소', { a: 'm', size: 14, b: 1 });
      s += t(395, 196, '미국 · 유럽 · 아시아\n중동 · 중남미', { a: 'm', size: 13, c: C.sub });
      s += t(240, 284, '“지방 근무 괜찮은가” 질문에 대비 — 국내 사업장 대부분이 경남 서부', { a: 'm', size: 13, c: C.orange, b: 1 });
      return F.svg(480, 302, s);
    } },

  kai7: { cards: ['L10-7'],
    cap: 'KAI 경영이념 — 사명 → 비전(Big 4) → 핵심가치 3 · 인재상(창조·도전·협동)은 내 경험과 짝지어 말한다',
    draw: function () {
      var s = box(20, 16, 440, 54, { fill: C.blueL, c: C.blue });
      s += t(240, 32, '사명', { a: 'm', size: 15, b: 1, c: C.blue, halo: false });
      s += t(240, 54, '사람과 기술을 연결하여 하늘과 우주를 향한 인류의 가치를 실현', { a: 'm', size: 13, halo: false });
      s += arrow(240, 72, 240, 88, { head: 8, c: C.blue });
      s += box(110, 90, 260, 36, { fill: '#fff', c: C.blue, label: '비전 — 글로벌 항공우주 Big 4', size: 14 });
      s += arrow(240, 128, 240, 144, { head: 8, c: C.blue });
      ['고객에 대한\n신뢰와 존중', '기술에 대한\n도전과 혁신', '협업을 위한\n소통과 화합'].forEach(function (w, i) {
        s += box(20 + i * 150, 146, 140, 52, { fill: C.grayL, label: w, size: 14 });
      });
      s += t(240, 214, '핵심가치 3', { a: 'm', size: 13, c: C.sub });
      s += t(20, 250, '인재상', { size: 15, b: 1, c: C.orange });
      ['창조', '도전', '협동'].forEach(function (w, i) {
        s += box(80 + i * 84, 234, 72, 32, { fill: C.orangeL, c: C.orange, label: w, size: 15, r: 16 });
      });
      s += arrow(334, 250, 356, 250, { head: 9, c: C.green });
      s += box(358, 230, 104, 40, { fill: C.greenL, c: C.green, label: '내 경험과\n짝짓기', size: 13 });
      s += t(240, 292, '현장실습 · 동아리 · 자격증 준비 — 단어마다 경험 하나씩', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 310, s);
    } },

  kai8: { cards: ['L10-8'],
    cap: 'KAI 채용 흐름(공식 채용 홈페이지) — 지원서 → 서류 → 인적성 → 면접 → 신원조회·채용검진 → 최종합격·수습 3개월',
    draw: function () {
      var s = '';
      var R1 = [['지원서 접수', 20], ['서류전형', 175], ['인적성검사', 330]];
      R1.forEach(function (d, i) {
        s += box(d[1], 24, 130, 48, { fill: C.grayL }) + F.num(d[1] + 18, 48, String(i + 1), { r: 11, size: 13 }) + t(d[1] + 74, 48, d[0], { a: 'm', size: 14, b: 1, halo: false });
        if (i < 2) s += arrow(d[1] + 132, 48, d[1] + 153, 48, { head: 8 });
      });
      s += F.route([[395, 72], [395, 100]], { head: 9 });
      var R2 = [['면접\n실무 / 인성', 330, C.blueL, C.blue], ['신원조회\n채용검진', 175, C.grayL, C.line], ['최종합격\n수습 3개월', 20, C.greenL, C.green]];
      R2.forEach(function (d, i) {
        s += box(d[1], 102, 130, 54, { fill: d[2], c: d[3] }) + F.num(d[1] + 18, 129, String(i + 4), { r: 11, size: 13, c: d[3] === C.line ? C.blue : d[3] }) +
          t(d[1] + 76, 129, d[0], { a: 'm', size: 14, b: 1, halo: false });
        if (i < 2) s += arrow(d[1] - 2, 129, d[1] - 23, 129, { head: 8 });
      });
      s += t(240, 186, '방위산업체라 관계 법령에 따라 신원조회를 한다', { a: 'm', size: 13, b: 1 });
      s += t(240, 210, '면접에 PT·영어·상황판단이 더해질 수 있다 — 세부 전형은 공고마다 다르다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 228, s);
    } }

  };
})();

/* L9-2(임시 고정 — 클레코)는 L2-5 의 클레코 그림을 함께 쓴다 */
(function () {
  var M = window.KAI && KAI.media;
  if (M && M['L2-5'] && M['L2-5'].fig) M['L9-2'] = Object.assign({}, M['L9-2'] || {}, { fig: M['L2-5'].fig, cap: M['L2-5'].cap });
})();
