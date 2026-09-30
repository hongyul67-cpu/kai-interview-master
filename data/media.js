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
/* 사진·영상은 사용자 승인 뒤 여기에 추가합니다(_작업/그림-이어하기.md 의 B·C 단계). */
void add;
})();
