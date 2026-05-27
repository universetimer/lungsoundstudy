/* localStorage 기반 학습 기록 */
const STORAGE_KEY = "auscultation-app/v1";

const defaultState = {
  attemptsByLabel: {},   // label -> { correct, wrong }
  recentAnswers: [],     // 최근 50건
  studiedFiles: {},      // file -> { visits, lastTs }
  lastVisit: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch (e) {
    console.warn(e);
    return structuredClone(defaultState);
  }
}

function saveState(state) {
  state.lastVisit = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function recordAttempt(file, correctLabel, pickedLabel, mode = "quiz") {
  const state = loadState();
  if (!state.attemptsByLabel[correctLabel]) state.attemptsByLabel[correctLabel] = { correct: 0, wrong: 0 };
  const ok = correctLabel === pickedLabel;
  if (ok) state.attemptsByLabel[correctLabel].correct += 1;
  else state.attemptsByLabel[correctLabel].wrong += 1;

  state.recentAnswers.unshift({ file, correctLabel, pickedLabel, ok, mode, ts: Date.now() });
  state.recentAnswers = state.recentAnswers.slice(0, 50);
  saveState(state);
  return ok;
}

function recordStudy(file) {
  const state = loadState();
  if (!state.studiedFiles[file]) state.studiedFiles[file] = { visits: 0, lastTs: 0 };
  state.studiedFiles[file].visits += 1;
  state.studiedFiles[file].lastTs = Date.now();
  saveState(state);
}

function getAccuracy(label = null) {
  const state = loadState();
  if (label) {
    const a = state.attemptsByLabel[label] || { correct: 0, wrong: 0 };
    const total = a.correct + a.wrong;
    return { correct: a.correct, wrong: a.wrong, total, rate: total ? a.correct / total : 0 };
  }
  let c = 0, w = 0;
  for (const a of Object.values(state.attemptsByLabel)) { c += a.correct; w += a.wrong; }
  const total = c + w;
  return { correct: c, wrong: w, total, rate: total ? c / total : 0 };
}

function getWeakLabels(limit = 6) {
  const state = loadState();
  return Object.entries(state.attemptsByLabel)
    .map(([id, a]) => ({
      id,
      total: a.correct + a.wrong,
      rate: (a.correct + a.wrong) ? a.correct / (a.correct + a.wrong) : 0,
      correct: a.correct,
      wrong: a.wrong,
    }))
    .filter(x => x.total >= 3)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, limit);
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

if (typeof window !== "undefined") {
  window.Storage = { load: loadState, save: saveState, recordAttempt, recordStudy, getAccuracy, getWeakLabels, reset: resetState };
}
