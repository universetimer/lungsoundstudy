/* ============================================================
 * i18n — 한국어 / English
 * lang은 localStorage("lang")에 저장.
 * HTML 요소 마킹:
 *   - data-i18n="key"     → 텍스트 교체
 *   - data-i18n-html="key" → HTML 교체
 *   - data-lang-ko / data-lang-en → CSS로 표시 전환
 * JS에서: t("key") 또는 I18n.t("key")
 * ============================================================ */

const TRANSLATIONS = {
  ko: {
    /* nav */
    "nav.home": "홈",
    "nav.guide": "청진 가이드",
    "nav.catalog": "도감",
    "nav.quiz": "퀴즈",
    "nav.compare": "비교",
    "nav.videos": "영상",
    "nav.stats": "통계·복습",

    /* brand */
    "brand.tag": "청진음 학습 · Auscultation Trainer",

    /* footer */
    "footer.copyright": "© Lung Sound Study · 학습 목적 자료",
    "footer.disclaimer": "271개 라벨된 wave 파일 기반 · 임상 판단을 대체하지 않습니다.",

    /* index hero */
    "home.eyebrow": "Auscultation Trainer",
    "home.h1": "실제 임상 청진음으로<br />듣고 · 외우고 · 시험까지.",
    "home.intro": "라벨된 271개의 실제 청진음 wave 파일을 사용합니다. Crackle, Wheezing, Rhonchi 및 복합 라벨 6개 카테고리를 도감·퀴즈·비교·복습 모드로 학습하세요. 학습 기록은 브라우저에 자동 저장됩니다.",
    "home.cta.catalog": "도감 보기",
    "home.cta.quiz": "퀴즈 시작",
    "home.section.status": "학습 현황",
    "home.section.status.sub": "최근 학습 기록과 정답률 요약.",
    "home.section.modes": "학습 모드",
    "home.section.modes.sub": "여섯 가지 모드로 다각도 학습.",
    "home.section.dataset": "데이터셋 요약",

    "home.stat.accuracy": "전체 정답률",
    "home.stat.accuracy.sub": "{correct}/{total} 정답",
    "home.stat.studied": "학습한 샘플",
    "home.stat.studied.sub": "도감·비교 방문 기준",
    "home.stat.attempts": "총 시도",
    "home.stat.attempts.sub": "정답 {correct} · 오답 {wrong}",
    "home.stat.lastvisit": "마지막 방문",
    "home.stat.lastvisit.none": "기록 없음",

    "mode.guide.title": "청진 가이드",
    "mode.guide.desc": "호흡기 질환에서 청진의 목적·방법·순서·청진 위치·흔한 실수까지 정리.",
    "mode.catalog.title": "도감 모드",
    "mode.catalog.desc": "6개 라벨의 청진음을 듣고 특징·발생 시기·임상 의의·감별점을 학습합니다.",
    "mode.quiz.title": "퀴즈 모드",
    "mode.quiz.desc": "실제 wave 파일로 출제하는 4지선다. 제한시간 모드로 실전처럼 연습.",
    "mode.compare.title": "비교 모드",
    "mode.compare.desc": "서로 다른 라벨의 샘플을 동시·번갈아 재생하며 감별 포인트를 확인.",
    "mode.videos.title": "영상 학습",
    "mode.videos.desc": "호흡음 청진을 가르치는 신뢰할 수 있는 YouTube 영상 큐레이션.",
    "mode.stats.title": "통계·복습",
    "mode.stats.desc": "라벨별 정답률·약점·최근 답안·기록 관리.",

    /* catalog */
    "catalog.eyebrow": "Catalog",
    "catalog.h1": "청진음 도감",
    "catalog.intro": "6개 라벨의 실제 임상 청진음을 들으며 특징·시기·임상 의의·감별점을 학습합니다.",
    "catalog.sidebar.labels": "라벨",
    "catalog.samples": "샘플 {n}개",
    "catalog.meta.quality": "음질",
    "catalog.meta.timing": "시기",
    "catalog.meta.pitch": "음높이",
    "catalog.section.clinical": "임상 의의",
    "catalog.section.distinguish": "감별 포인트",
    "catalog.section.tip": "Tip",
    "catalog.sample.count": "{n}개 샘플",
    "catalog.help.wf.title": "파형 (Waveform)",
    "catalog.help.wf.body": "시간(x) × 진폭(y). 소리의 리듬·강약·burst를 한눈에. 짧은 폭발음(crackle)과 연속음(wheeze)의 시간 구조를 비교.",
    "catalog.help.sg.title": "스펙트로그램 (Spectrogram)",
    "catalog.help.sg.body": "시간(x) × 주파수(y, 50–500 Hz) × 강도(색). 가로줄(wheeze 음악적 음), 세로줄(crackle 폭발), 다음조 wheeze 같은 다중 주파수 패턴을 식별. 50 Hz 이하 DC·움직임 잡음 제외.",
    "catalog.help.foot": "▶ 재생을 누르면 분석 후 표시됩니다 · 캔버스 클릭으로 시킹",

    /* quiz */
    "quiz.eyebrow": "Quiz",
    "quiz.h1": "퀴즈 모드",
    "quiz.intro": "실제 임상 청진음을 듣고 라벨을 맞춰보세요. 4지선다 + 제한시간 모드.",
    "quiz.setup.title": "퀴즈 설정",
    "quiz.setup.count": "문제 수",
    "quiz.setup.labels": "출제 범위 (라벨)",
    "quiz.setup.time": "제한시간 (문항당)",
    "quiz.time.none": "제한 없음",
    "quiz.time.15": "15초",
    "quiz.time.30": "30초",
    "quiz.start": "퀴즈 시작",
    "quiz.question": "이 청진음의 라벨은?",
    "quiz.quit": "중단하고 결과 보기",
    "quiz.next": "다음 문제",
    "quiz.result": "결과 보기",
    "quiz.retry": "다시 풀기",
    "quiz.gotostats": "통계 보기",
    "quiz.gotocatalog": "도감으로 복습",
    "quiz.correct": "정답!",
    "quiz.wrong.prefix": "오답 — 정답은",
    "quiz.wrong.picked": "선택",
    "quiz.timeout": "시간 초과",
    "quiz.timer": "남은 시간: {n}초",
    "quiz.progress": "정답 {n}",
    "quiz.missed.title": "오답 노트",
    "quiz.comment.100": "완벽! 비교 모드로 복합 라벨까지 깊이 있게 학습해 보세요.",
    "quiz.comment.80": "훌륭합니다. 오답 라벨만 도감에서 한 번 더 확인하세요.",
    "quiz.comment.50": "절반 이상! 통계 페이지에서 약점을 확인하면 효율적입니다.",
    "quiz.comment.low": "도감 모드에서 기본 라벨부터 다시 듣고 오는 것을 추천합니다.",

    /* compare */
    "compare.eyebrow": "Compare",
    "compare.h1": "비교 모드",
    "compare.intro": "두 라벨의 샘플을 나란히 듣고 감별 포인트를 확인합니다.",
    "compare.labelA": "왼쪽 라벨 (A)",
    "compare.labelB": "오른쪽 라벨 (B)",
    "compare.shuffle": "샘플 다시 뽑기",
    "compare.playboth": "동시 재생",
    "compare.playalt": "번갈아 재생",
    "compare.stop": "정지",
    "compare.meta.timing": "시기",
    "compare.meta.pitch": "음높이",
    "compare.meta.quality": "음질",
    "compare.section.clinical": "임상",
    "compare.section.distinguish": "감별 포인트",

    /* videos */
    "videos.eyebrow": "Video Library",
    "videos.h1": "영상 학습",
    "videos.intro": "호흡음 청진을 짧은 동영상으로 학습합니다. 썸네일을 클릭하면 페이지 안에서 바로 재생됩니다.",
    "videos.section.lsl": "Lung Study Lab",
    "videos.section.lsl.sub": "정확한 채널 URL을 알려주시면 그 채널의 영상으로 즉시 교체합니다. 일단 같은 주제의 유사 자료를 표시합니다.",
    "videos.section.curated": "호흡음 청진 큐레이션",
    "videos.section.curated.sub": "교육 목적의 검증된 자료 모음.",
    "videos.section.external": "추가 자료(외부 사이트)",

    /* stats */
    "stats.eyebrow": "Stats & Review",
    "stats.h1": "통계·복습",
    "stats.intro": "학습 기록·정답률·약점 라벨을 한눈에 보고 약점 위주로 복습하세요.",
    "stats.section.overall": "전체 요약",
    "stats.section.bylabel": "라벨별 정답률",
    "stats.section.bylabel.sub": "시도가 있는 라벨만 표시됩니다.",
    "stats.section.weak": "약점 라벨 (정답률 낮은 순)",
    "stats.section.weak.sub": "시도 3회 이상인 라벨 중 정답률이 낮은 항목.",
    "stats.section.recent": "최근 답안 (최신 20건)",
    "stats.cta.quiz": "퀴즈 다시 풀기",
    "stats.cta.catalog": "도감으로 복습",
    "stats.cta.reset": "학습 기록 초기화",
    "stats.confirm.reset": "학습 기록을 모두 초기화하시겠습니까? 되돌릴 수 없습니다.",
    "stats.attempted": "시도한 라벨",
    "stats.attempted.sub": "서로 다른 라벨 기준",
    "stats.empty.attempts": "아직 시도 기록이 없습니다.",
    "stats.empty.weak": "약점으로 분류된 라벨이 없습니다 (시도 3회 이상 기준).",
    "stats.empty.recent": "최근 답안 기록이 없습니다.",
    "stats.correct": "정답",
    "stats.wrong": "오답",
    "stats.picked": "선택",

    /* guide */
    "guide.eyebrow": "Clinical Guide",
    "guide.h1": "호흡기 청진 가이드",
    "guide.intro": "왜 청진하는가, 어떻게 청진하는가 — 호흡기 신체 검사의 핵심.",
    "guide.toc": "목차",
  },

  en: {
    "nav.home": "Home",
    "nav.guide": "Guide",
    "nav.catalog": "Catalog",
    "nav.quiz": "Quiz",
    "nav.compare": "Compare",
    "nav.videos": "Videos",
    "nav.stats": "Stats",

    "brand.tag": "Lung Sound Study · Auscultation Trainer",

    "footer.copyright": "© Lung Sound Study · Educational material",
    "footer.disclaimer": "Built on 271 labeled wave files · Not a substitute for clinical judgment.",

    "home.eyebrow": "Auscultation Trainer",
    "home.h1": "Listen · Learn · Test<br />with real clinical lung sounds.",
    "home.intro": "Built on 271 labeled clinical lung sound wave files. Six categories — Crackle, Wheezing, Rhonchi and combined labels — across catalog, quiz, compare, and review modes. Your progress is saved locally in the browser.",
    "home.cta.catalog": "Browse catalog",
    "home.cta.quiz": "Start quiz",
    "home.section.status": "Your progress",
    "home.section.status.sub": "Recent activity and accuracy summary.",
    "home.section.modes": "Study modes",
    "home.section.modes.sub": "Six ways to master lung sounds.",
    "home.section.dataset": "Dataset overview",

    "home.stat.accuracy": "Overall accuracy",
    "home.stat.accuracy.sub": "{correct}/{total} correct",
    "home.stat.studied": "Samples studied",
    "home.stat.studied.sub": "Catalog & Compare visits",
    "home.stat.attempts": "Total attempts",
    "home.stat.attempts.sub": "{correct} correct · {wrong} wrong",
    "home.stat.lastvisit": "Last visit",
    "home.stat.lastvisit.none": "No record",

    "mode.guide.title": "Clinical Guide",
    "mode.guide.desc": "Purpose, technique, sequence, auscultation sites and common pitfalls for chest auscultation.",
    "mode.catalog.title": "Catalog",
    "mode.catalog.desc": "Listen to each of the six labels with their character, timing, clinical relevance and key differentiators.",
    "mode.quiz.title": "Quiz",
    "mode.quiz.desc": "Multiple choice from real wave files. Timed mode available for exam-style practice.",
    "mode.compare.title": "Compare",
    "mode.compare.desc": "Play two label samples side-by-side or alternately to sharpen discrimination.",
    "mode.videos.title": "Videos",
    "mode.videos.desc": "Curated YouTube videos teaching respiratory auscultation.",
    "mode.stats.title": "Stats & Review",
    "mode.stats.desc": "Per-label accuracy, weak points, recent answers, history management.",

    "catalog.eyebrow": "Catalog",
    "catalog.h1": "Lung Sound Catalog",
    "catalog.intro": "Listen to clinical lung sounds across six labels and learn their character, timing, clinical relevance and differentiation points.",
    "catalog.sidebar.labels": "Labels",
    "catalog.samples": "{n} samples",
    "catalog.meta.quality": "Quality",
    "catalog.meta.timing": "Timing",
    "catalog.meta.pitch": "Pitch",
    "catalog.section.clinical": "Clinical relevance",
    "catalog.section.distinguish": "Differentiation",
    "catalog.section.tip": "Tip",
    "catalog.sample.count": "{n} samples",
    "catalog.help.wf.title": "Waveform",
    "catalog.help.wf.body": "Time (x) × amplitude (y). The rhythm, intensity and bursts of the sound at a glance. Useful for distinguishing brief explosions (crackle) from continuous tones (wheeze).",
    "catalog.help.sg.title": "Spectrogram",
    "catalog.help.sg.body": "Time (x) × frequency (y, 50–500 Hz) × intensity (color). Horizontal stripes (musical wheeze), vertical stripes (crackle bursts), and patterns like polyphonic wheeze become visible. Below 50 Hz (DC, motion artifacts) is excluded.",
    "catalog.help.foot": "▶ Press play to render · click on the canvas to seek",

    "quiz.eyebrow": "Quiz",
    "quiz.h1": "Quiz Mode",
    "quiz.intro": "Listen to a clinical lung sound and identify the label. Four-choice multiple choice with an optional timer.",
    "quiz.setup.title": "Quiz settings",
    "quiz.setup.count": "Number of questions",
    "quiz.setup.labels": "Question pool (labels)",
    "quiz.setup.time": "Time limit (per question)",
    "quiz.time.none": "No limit",
    "quiz.time.15": "15 s",
    "quiz.time.30": "30 s",
    "quiz.start": "Start quiz",
    "quiz.question": "What is this lung sound?",
    "quiz.quit": "Stop and see result",
    "quiz.next": "Next",
    "quiz.result": "See result",
    "quiz.retry": "Try again",
    "quiz.gotostats": "View stats",
    "quiz.gotocatalog": "Review in Catalog",
    "quiz.correct": "Correct!",
    "quiz.wrong.prefix": "Wrong — the answer was",
    "quiz.wrong.picked": "Picked",
    "quiz.timeout": "Time out",
    "quiz.timer": "Time left: {n}s",
    "quiz.progress": "Correct {n}",
    "quiz.missed.title": "Review of misses",
    "quiz.comment.100": "Perfect! Try Compare mode to deepen on combined labels.",
    "quiz.comment.80": "Great. Revisit your wrong labels in the Catalog.",
    "quiz.comment.50": "Above half! Check Stats to find your weak labels.",
    "quiz.comment.low": "Spend more time with each label in the Catalog before retrying.",

    "compare.eyebrow": "Compare",
    "compare.h1": "Compare Mode",
    "compare.intro": "Play two label samples side-by-side to sharpen discrimination.",
    "compare.labelA": "Left label (A)",
    "compare.labelB": "Right label (B)",
    "compare.shuffle": "Resample",
    "compare.playboth": "Play both",
    "compare.playalt": "Play alternately",
    "compare.stop": "Stop",
    "compare.meta.timing": "Timing",
    "compare.meta.pitch": "Pitch",
    "compare.meta.quality": "Quality",
    "compare.section.clinical": "Clinical",
    "compare.section.distinguish": "Differentiation",

    "videos.eyebrow": "Video Library",
    "videos.h1": "Video learning",
    "videos.intro": "Short YouTube videos teaching respiratory auscultation. Click a thumbnail to play in-page.",
    "videos.section.lsl": "Lung Study Lab",
    "videos.section.lsl.sub": "Share the exact channel URL and I will replace these with the channel's videos. Showing topic-similar material for now.",
    "videos.section.curated": "Curated auscultation videos",
    "videos.section.curated.sub": "Verified educational material.",
    "videos.section.external": "External resources",

    "stats.eyebrow": "Stats & Review",
    "stats.h1": "Stats & Review",
    "stats.intro": "See your activity, accuracy and weak labels at a glance, then drill on the weak ones.",
    "stats.section.overall": "Summary",
    "stats.section.bylabel": "Accuracy by label",
    "stats.section.bylabel.sub": "Only labels you have attempted are shown.",
    "stats.section.weak": "Weak labels (lowest accuracy)",
    "stats.section.weak.sub": "Labels with at least 3 attempts, sorted by lowest accuracy.",
    "stats.section.recent": "Recent answers (last 20)",
    "stats.cta.quiz": "Take quiz again",
    "stats.cta.catalog": "Review in Catalog",
    "stats.cta.reset": "Reset progress",
    "stats.confirm.reset": "Reset all study records? This cannot be undone.",
    "stats.attempted": "Labels attempted",
    "stats.attempted.sub": "Distinct labels",
    "stats.empty.attempts": "No attempts yet.",
    "stats.empty.weak": "No weak labels yet (need at least 3 attempts).",
    "stats.empty.recent": "No recent answers.",
    "stats.correct": "correct",
    "stats.wrong": "wrong",
    "stats.picked": "picked",

    "guide.eyebrow": "Clinical Guide",
    "guide.h1": "Respiratory Auscultation Guide",
    "guide.intro": "Why auscultate, and how — the essentials of the respiratory physical exam.",
    "guide.toc": "Contents",
  },
};

const I18n = (function () {
  let lang = localStorage.getItem("lang");
  if (!lang) {
    lang = (navigator.language || "ko").toLowerCase().startsWith("ko") ? "ko" : "en";
  }

  function t(key, vars) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ko;
    let s = dict[key] != null ? dict[key] : (TRANSLATIONS.ko[key] != null ? TRANSLATIONS.ko[key] : key);
    if (vars) {
      for (const k in vars) s = s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    }
    return s;
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    scope.querySelectorAll("[data-i18n-attr]").forEach(el => {
      // form: "attr1:key1; attr2:key2"
      const pairs = el.dataset.i18nAttr.split(";");
      pairs.forEach(p => {
        const [attr, key] = p.split(":").map(x => x.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.documentElement.lang = lang;
  }

  function setLang(newLang) {
    if (newLang !== "ko" && newLang !== "en") return;
    lang = newLang;
    localStorage.setItem("lang", lang);
    apply();
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  function current() { return lang; }

  return { t, apply, setLang, current };
})();

if (typeof window !== "undefined") {
  window.I18n = I18n;
  window.t = I18n.t;
}
