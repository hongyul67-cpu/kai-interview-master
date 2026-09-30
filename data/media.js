/* 사진·영상 — KAI.media['단원-절'].photos / .videos
   photos: [{ src:'img/…', alt, cap, credit, license, url }]  — 자유 이용 사진만(퍼블릭 도메인·CC). 출처·사용 조건을 꼭 적는다.
   videos: [{ title, url, by, note }]                          — 공개 영상 링크(실제로 열리는지 확인한 것만).
   그림(직접 그린 SVG)은 fig1~3.js. 같은 키에 합쳐 넣는다(덮어쓰지 않음). */
window.KAI = window.KAI || { learn: [], iv: [] };
KAI.media = KAI.media || {};
(function () {
const add = (key, v) => {
  const m = KAI.media[key] = KAI.media[key] || {};
  if (v.photos) m.photos = (m.photos || []).concat(v.photos);
  if (v.videos) m.videos = (m.videos || []).concat(v.videos);
};
/* ── 영상 링크 (2026-09-30 YouTube oEmbed 로 열리는 것 확인) ── */
const Y = id => 'https://www.youtube.com/watch?v=' + id;
const EN = '영어 영상 — 설정에서 자막·자동 번역을 켜세요';
add('L2-5', { videos: [{ title: 'Metal Magic: All About Clecoes (클레코의 종류와 쓰는 법)', url: Y('wOIRUL1Ysck'), by: 'Kitplanes Magazine', note: EN }] });
add('L2-6', { videos: [{ title: 'Metal Magic: Dimpling and Countersinking (딤플링·카운터싱크)', url: Y('tDKou3TYSO4'), by: 'Kitplanes Magazine', note: EN },
                       { title: 'Metal Magic: Driving and Squeezing Countersunk Rivets (접시머리 리벳 박기)', url: Y('fJQ-zp3tWqU'), by: 'Kitplanes Magazine', note: EN }] });
add('L2-7', { videos: [{ title: 'Metal Magic: Driven Rivets (리벳건·버킹바로 리벳 박기)', url: Y('BAMZhawoSOE'), by: 'Kitplanes Magazine', note: EN }] });
add('L5-6', { videos: [{ title: 'Carbon fibre pre-preg lay-up demonstration (vacuum bag and autoclave)', url: Y('OmxGyALQQF4'), by: '영국 셰필드 대학교 재료공학과', note: '프리프레그 적층 → 진공 백 → 오토클레이브 · ' + EN }] });
add('L6-2', { videos: [{ title: 'Air Force Nondestructive Inspection (NDI) 2A7X2', url: Y('0zw1Hn-oi74'), by: 'Airman Vision', note: '미 공군 비파괴검사 정비사의 하루 · ' + EN }] });
add('L10-1', { videos: [{ title: '항공우주산업의 불모지에서 중심지로! KAI의 25년간의 여정', url: Y('gvpCIxcRTNY'), by: 'KAI 공식 채널', note: '회사 역사·제품 한눈에' }] });
add('L10-2', { videos: [{ title: '[최초 공개] KF-21 양산 1호기 최종조립 [영상 타임랩스]', url: Y('iHyNEr2aVTY'), by: '국방홍보원 KFN', note: '최종조립 과정을 빠르게' }] });
add('L10-4', { videos: [{ title: '에어버스 날개 뼈를 우리 기업이 만든다고? 한국항공우주산업', url: Y('XWPBAM6vTBM'), by: '중소벤처기업부', note: 'A350 날개 리브 스마트 공정' }] });
add('L10-5', { videos: [{ title: 'KF-21의 하이라이트 조립공정 「KF-21 고정익 생산관리 편」', url: Y('YPSS7p34Jjk'), by: 'KFN 국방뉴스', note: '조립 현장·생산관리' },
                        { title: "First-ever look inside KAI's fighter jet mass production facility in Sacheon", url: Y('LZGuFp42cVo'), by: 'Arirang News', note: '사천 양산 시설 · 영어 뉴스' }] });
/* ── 사진 (2026-09-30 사용자 승인 20장 · Wikimedia Commons · 긴 변 800px 로 줄여 img/ 에 저장) ──
   사진을 누르면 원본 설명 페이지(작가·사용 조건 전문)로 갑니다. */
const W = f => 'https://commons.wikimedia.org/wiki/File:' + f;
const PD = '퍼블릭 도메인', CC0 = 'CC0(자유 이용)';
const P = (src, cap, credit, license, file) => ({ src: 'img/' + src, alt: cap, cap, credit, license, url: W(file) });
add('L2-5', { photos: [P('cleco-fasteners.jpg', '클레코 — 굵기마다 몸통 색이 다르다(3.2mm·4.8mm)', 'Thermofan', CC0, 'Cleco_3.2_and_4.8mm_temporary_fasteners.jpg')] });
add('L2-7', { photos: [P('b52-rivet-drill.jpg', 'B-52 날개 위에서 리벳을 드릴로 파내는 구조 정비병', 'A1C Justin Armstrong, 미 공군', PD, '160802-F-CG053-003_(28583520440).jpg')] });
add('L2-8', { photos: [P('structural-repair.jpg', '항공기 구조 수리병(15G) — 판금 수리를 맡는 직무', 'Pfc. JungHwan Yoon, 미 육군', PD, 'A_Day_in_the_Life-_Aircraft_Structural_Repairer_(15G)_(9606569).jpg')] });
add('L3-4', { photos: [P('torque-wrench.jpg', '토크렌치가 정확한지 점검하는 정비사', '미 국방부 DVIC', PD, 'Aircraft_Electronics_Technician_2nd_Class_Roberts_tests_a_torque_wrench_in_the_Aircraft_Intermediate_Maintenance_Department_hangar_-_DPLA_-_0689b07c7fece7f80dfae7c80bf1f3ba.jpeg')] });
add('L3-6', { photos: [P('blind-rivet.jpg', '블라인드 리벳 — 머리 아래 홈에서 심봉이 끊어진다', 'Sarang', PD, 'Blind_rivet_notches.jpg')] });
add('L3-8', { photos: [P('safety-wire.jpg', '안전결선을 감는 정비사', 'Seaman Jacob D. Galito, 미 해군', PD, 'US_Navy_100521-N-4516G-007_Aviation_Machinist%27s_Mate_2nd_Class_Curtis_L._Gibson_rigs_a_safety_wire_to_the_engine_run_trailer_aboard_the_aircraft_carrier_USS_Enterprise_(CVN_65).jpg'),
                       P('castle-nut-cotter.jpg', '캐슬 너트 홈에 코터핀을 꽂아 풀림 방지', 'Robbie Sproule', 'CC BY 2.0', 'Castle_nut_and_cotter_pin._(55011574).jpg')] });
add('L4-4', { photos: [P('filiform-corrosion.jpg', '필리폼 부식 — 도막 아래로 실처럼 번진다', 'Matador', 'CC BY-SA 4.0', 'Filiform_corrosion_on_painted_aluminum.jpg'),
                       P('exfoliation-corrosion.jpg', '박리 부식 — 알루미늄이 층층이 부풀어 벗겨진다', 'Carlos Delgado', 'CC BY-SA 4.0', 'Corrosi%C3%B3n_por_exfoliaci%C3%B3n_en_aluminio_-_01.jpg')] });
add('L5-7', { photos: [P('honeycomb-cfrp.jpg', '탄소섬유 면재 + 허니콤 코어 시편 — 들뜸 검사 연습용', 'Rafael Schoen', 'CC BY-SA 4.0', 'Steinbichler_Shearography_Honeycomb_with_CFRP_Top_Layer_Artificial_failures_that_simulate_layer-core_delaminations_Material.jpg')] });
add('L6-3', { photos: [P('penetrant-test.jpg', '형광 침투검사 — 자외선 등 아래에서 균열이 빛난다', 'SrA Tiffany Trojca, 미 공군', PD, 'Amn_Hector_Chacon,_49th_Maintenance_Squadron,_performs_a_liquid_penetrant_inspection_at_Holloman_AFB.jpg')] });
add('L6-5', { photos: [P('ultrasonic-test.jpg', '수평 안정판을 초음파로 검사하는 정비사', 'Seaman Rosa A. Arzola, 미 해군', PD, 'US_Navy_110309-N-7488A-177_Aviation_Structural_Mechanic_1st_Class_Charles_Martens_performs_an_ultrasonic_inspection_on_a_horizontal_stabilizer_of_a.jpg')] });
add('L6-6', { photos: [P('magnetic-particle.jpg', '자분탐상으로 드러난 주강품의 균열', 'K. Krallis', CC0, 'MT_inspection_of_cast_piece-P6160133A.jpg')] });
add('L9-1', { photos: [P('wing-jig.jpg', '치구에 물려 조립 중인 무인기 날개', 'Tom Tschida, NASA', PD, 'The_left_wing_of_NASA%27s_Altair_unmanned_aerial_vehicle_(UAV)_rests_in_a_jig_during_construction_at_General_Atomics_Aeronautical_Systems,_Inc_(EC02-0188-8).jpg')] });
add('L9-2', { photos: [P('cleco-pliers.jpg', '클레코 플라이어 — 클레코를 끼우고 빼는 집게', 'Thermofan', CC0, 'Cleco_Tool_for_fitting_temporary_fasteners.jpg')] });
add('L9-6', { photos: [P('shadow-board.jpg', '섀도 보드 — 빈자리를 보면 없는 공구가 바로 보인다', 'Maxschiraldi', 'CC BY-SA 4.0', 'Shadowboard-mmschiraldi.jpg')] });
add('L10-2', { photos: [P('kt1.jpg', 'KT-1 웅비 — KAI 기본훈련기(전쟁기념관 전시)', 'Balon Greyjoy', CC0, 'KT-1_Woongbi_War_Memorial_of_Korea-1.jpg'),
                        P('kf21.jpg', 'KF-21 보라매', '대한민국 국방부', '공공누리 제1유형(출처표시)', 'KF-21_Boramae_First_Production.jpg')] });
add('L10-3', { photos: [P('surion.jpg', '수리온 시제기', '한국항공우주산업(KAI)', 'CC BY 2.0', 'KUH-1_Surion_Prototype_in_KAI.jpg')] });
add('L10-5', { photos: [P('wire-harness.jpg', '캐노피에 배선 뭉치(와이어 하네스)를 다는 정비사 — 전자·전기과가 이어지는 일', 'MC3 Bradley Evans, 미 해군', PD, 'US_Navy_100622-N-6604E-025_Aviation_Structural_Mechanic_(Equipment)_2nd_Class_Stephen_Bessette_installs_a_wire_harness_on_a_replacement_canopy_for_an_F-A-18E_Super_Hornet.jpg')] });

/* ── 사진 2차 (2026-09-30 사용자 승인 11장 — 사진이 없던 L1·L7·L8 과 오토클레이브·조립 라인 보강) ── */
add('L1-5', { photos: [P('semi-monocoque-inside.jpg', '실제 동체 뒷부분 속 — 둥근 프레임과 길게 달리는 스트링거에 알루미늄 외피가 붙어 있다', 'YSSYguy', 'CC BY-SA 4.0', 'Semi_monocoque_fuselage_structure.JPG')] });
add('L1-6', { photos: [P('wing-restoration.jpg', '복원 중인 옛 훈련기의 날개 중앙부 — 외피 안쪽 뼈대(스파·리브)와 금속 이음쇠가 보인다(목재 날개)', 'J. S. Bond', 'CC BY-SA 4.0', 'Fairchild_Cornell_Wing_Restoration.JPG')] });
add('L5-6', { photos: [P('autoclave-transport.jpg', '연구용 오토클레이브를 옮기는 모습 — 고속도로를 막아야 할 만큼 크다(독일항공우주센터)', 'DLR', 'CC BY 3.0', 'DLR_autoclave_transport_on_A26_high-way.JPG')] });
add('L7-7', { photos: [P('vernier-caliper.jpg', '버니어 캘리퍼스 눈금 — 이 사진의 읽음값은 3.58mm', 'ArtMechanic', 'CC BY-SA 3.0', 'Messschieber.jpg'),
                       P('micrometers.jpg', '마이크로미터 세 가지 — 외측·내측·깊이', 'Splarka', PD, 'Micrometers.jpg')] });
add('L8-1', { photos: [P('rockwell-tester.jpg', '로크웰 경도 시험기 — 누르개가 파고든 깊이로 단단함을 잰다', 'Three-quarter-ten', 'CC BY-SA 3.0', 'Rockwell_hardness_tester_001.jpg')] });
add('L8-2', { photos: [P('aluminium-ingots.jpg', '공장에 쌓인 알루미늄 덩어리(잉곳) — 녹여 합금을 만들고 판재로 민다(1926년 채색 사진)', 'Anders Beer Wilse', 'CC BY 4.0', 'Aluminum_ingots_at_Norwegian_Aluminium_Company.jpg')] });
add('L8-7', { photos: [P('titanium-products.jpg', '티타늄 제품 — 판·관·봉·분말', 'Mark Fergus', 'CC BY 3.0', 'Titanium_products.jpg')] });
add('L8-8', { photos: [P('heat-treat-furnace.jpg', '컴퓨터로 온도를 다루는 열처리로 — 질화·침탄 같은 표면경화용', 'S zillayali', 'CC BY 3.0', 'Computerised_Heat_Treatment_Furnance.jpg')] });
add('L9-1', { photos: [P('fuselage-jigs-martin.jpg', '조립 치구에서 막 꺼낸 동체들(1940년대 미국 항공기 공장) — 치구 덕분에 모양이 똑같다', 'Charles Fenno Jacobs, 미 국립문서보관소', PD, 'Construction_of_aircraft_at_the_Glenn_L._Martin_plant_at_Baltimore,_MD._Fuselages,_just_out_of_the_assembly_jigs_are..._-_NARA_-_520743.jpg')] });
add('L10-5', { photos: [P('a321-final-assembly.jpg', '여객기 최종 조립 라인(에어버스 함부르크) — 동체·날개를 합쳐 한 대를 완성하는 곳', 'DearEdward', 'CC BY 2.0', 'A321_final_assembly_(9351765668).jpg')] });
})();
