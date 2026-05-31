/* 공통 UI */
function buildHeader(activeKey = "") {
  const links = [
    { key: "home", href: "index.html", i18n: "nav.home" },
    { key: "guide", href: "guide.html", i18n: "nav.guide" },
    { key: "catalog", href: "catalog.html", i18n: "nav.catalog" },
    { key: "quiz", href: "quiz.html", i18n: "nav.quiz" },
    { key: "compare", href: "compare.html", i18n: "nav.compare" },
    { key: "videos", href: "videos.html", i18n: "nav.videos" },
    { key: "stats", href: "stats.html", i18n: "nav.stats" },
  ];
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand" aria-label="Lung Sound Study">
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
            <span data-i18n="brand.tag">청진음 학습 · Auscultation Trainer</span>
          </div>
        </a>
        <nav class="main-nav" id="mainNav">
          <ul>
            ${links.map(l => `<li><a href="${l.href}" data-i18n="${l.i18n}" class="${l.key===activeKey?"active":""}"></a></li>`).join("")}
          </ul>
        </nav>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button class="lang-btn" data-lang="ko" type="button">한</button>
          <button class="lang-btn" data-lang="en" type="button">EN</button>
        </div>
        <button class="mobile-toggle" id="navToggle" aria-label="menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <span data-i18n="footer.copyright"></span>
        <span data-i18n="footer.disclaimer"></span>
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

  // Language toggle
  if (window.I18n) {
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === window.I18n.current());
      btn.addEventListener("click", () => window.I18n.setLang(btn.dataset.lang));
    });
    window.I18n.apply();
  }
}

function audioElement(file) {
  if (!file) return `<div class="audio-missing">—</div>`;
  const src = encodeURI(audioSrc(file));
  const lang = (window.I18n && window.I18n.current()) || "ko";
  const wfLabel = lang === "ko" ? "파형 · WAVEFORM" : "WAVEFORM";
  const sgLabel = lang === "ko" ? "스펙트로그램 · 50–500 Hz" : "SPECTROGRAM · 50–500 Hz";
  const hint = lang === "ko" ? "▶ 재생을 누르면 파형과 스펙트로그램이 표시됩니다" : "▶ Press play to render waveform and spectrogram";
  return `<div class="audio-wrap">
    <audio controls preload="none" controlsList="nodownload noplaybackrate" disablePictureInPicture oncontextmenu="return false" src="${src}"></audio>
    <div class="audio-viz">
      <canvas class="wf-canvas"></canvas>
      <canvas class="sg-canvas"></canvas>
      <div class="audio-playhead"></div>
      <span class="viz-label viz-label-wf">${wfLabel}</span>
      <span class="viz-label viz-label-sg">${sgLabel}</span>
      <div class="audio-viz-hint">${hint}</div>
    </div>
  </div>`;
}

function pillFor(label) {
  return `category-pill pill-${label.replace(/_/g, "-")}`;
}

function labelName(meta) {
  const lang = (window.I18n && window.I18n.current()) || "ko";
  return lang === "ko" ? meta.nameKo : (meta.nameEn || meta.name);
}

function labelField(meta, field) {
  const lang = (window.I18n && window.I18n.current()) || "ko";
  if (lang === "en" && meta[field + "En"]) return meta[field + "En"];
  return meta[field];
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
  window.UI = { mount, audioElement, pillFor, labelName, labelField, shuffle, escapeHtml };
}
