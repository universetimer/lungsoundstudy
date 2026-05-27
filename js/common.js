/* 공통 UI */
function buildHeader(activeKey = "") {
  const links = [
    { key: "home", href: "index.html", label: "홈" },
    { key: "catalog", href: "catalog.html", label: "도감" },
    { key: "quiz", href: "quiz.html", label: "퀴즈" },
    { key: "compare", href: "compare.html", label: "비교" },
    { key: "stats", href: "stats.html", label: "통계·복습" },
  ];
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand">
          <div class="brand-mark">청</div>
          <div class="brand-text">
            <strong>청진음 학습</strong>
            <span>Auscultation Trainer</span>
          </div>
        </a>
        <nav class="main-nav" id="mainNav">
          <ul>
            ${links.map(l => `<li><a href="${l.href}" class="${l.key===activeKey?"active":""}">${l.label}</a></li>`).join("")}
          </ul>
        </nav>
        <button class="mobile-toggle" id="navToggle" aria-label="메뉴">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <span>© 청진음 학습기 · 학습 목적 자료</span>
        <span>271개 라벨된 wave 파일 기반 · 임상 판단을 대체하지 않습니다.</span>
      </div>
    </footer>`;
}

function mount(activeKey) {
  const h = document.getElementById("siteHeader");
  if (h) h.innerHTML = buildHeader(activeKey);
  const f = document.getElementById("siteFooter");
  if (f) f.innerHTML = buildFooter();
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

function audioElement(file) {
  if (!file) return `<div class="audio-missing">샘플이 없습니다.</div>`;
  const src = encodeURI(audioSrc(file));
  return `<div class="audio-wrap">
    <audio controls preload="none" controlsList="nodownload noplaybackrate" disablePictureInPicture oncontextmenu="return false" src="${src}"></audio>
    <div class="audio-viz">
      <canvas class="wf-canvas" title="파형 — 클릭으로 시킹"></canvas>
      <canvas class="sg-canvas" title="스펙트로그램 — 클릭으로 시킹"></canvas>
      <div class="audio-playhead"></div>
      <div class="audio-viz-hint">▶ 재생을 누르면 파형과 스펙트로그램이 표시됩니다</div>
    </div>
  </div>`;
}

function pillFor(label) {
  return `category-pill pill-${label.replace(/_/g, "-")}`;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

if (typeof window !== "undefined") {
  window.UI = { mount, audioElement, pillFor, shuffle, escapeHtml };
}
