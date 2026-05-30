/* 공통 UI */
function buildHeader(activeKey = "") {
  const links = [
    { key: "home", href: "index.html", label: "홈" },
    { key: "guide", href: "guide.html", label: "청진 가이드" },
    { key: "catalog", href: "catalog.html", label: "도감" },
    { key: "quiz", href: "quiz.html", label: "퀴즈" },
    { key: "compare", href: "compare.html", label: "비교" },
    { key: "videos", href: "videos.html", label: "영상" },
    { key: "stats", href: "stats.html", label: "통계·복습" },
  ];
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand" aria-label="Lung Sound Study 홈">
          <svg class="brand-logo" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="lssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#073F62" />
                <stop offset="55%" stop-color="#0E5A8A" />
                <stop offset="100%" stop-color="#14B8A6" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="20" fill="url(#lssGrad)" />
            <circle cx="22" cy="22" r="15.5" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1" />
            <path d="M5.5 22 L9 22 Q11 22 12 19 L13.5 14 Q14.5 11.5 16 14 L17.5 18 Q18.5 20.5 20 18 L21.5 13 Q23 9.5 24.5 13 L26 18.5 Q27 21.5 28.5 19 L30 15 Q31 12.5 32 16 L33 22 L38.5 22"
              fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="22" cy="22" r="1.6" fill="#A7F3D0" />
          </svg>
          <div class="brand-text">
            <strong>Lung Sound Study</strong>
            <span>청진음 학습 · Auscultation Trainer</span>
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
      <canvas class="wf-canvas" title="파형(Waveform) — 시간×진폭, 클릭으로 시킹"></canvas>
      <canvas class="sg-canvas" title="스펙트로그램(Spectrogram) — 시간×주파수(0~500 Hz)×강도, 클릭으로 시킹"></canvas>
      <div class="audio-playhead"></div>
      <span class="viz-label viz-label-wf">파형 · WAVEFORM</span>
      <span class="viz-label viz-label-sg">스펙트로그램 · 0–500 Hz</span>
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
