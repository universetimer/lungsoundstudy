/* ============================================================
 * Web Audio: 4× 게인 + 컴프레서, 파형/스펙트로그램 시각화
 * ------------------------------------------------------------
 * - <audio>의 play 이벤트를 캡처해 자동 enhance.
 * - 같은 <audio>는 한 번만 연결(WeakMap 캐시).
 * - 파형: AudioBuffer 디코드 후 min/max 픽셀당 1번 렌더.
 * - 스펙트로그램: STFT(Hann, 512/128), magma 컬러맵, dB 60dB DR.
 * - 캔버스 클릭으로 seek.
 * ============================================================ */

(function () {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { console.warn("Web Audio API 미지원 브라우저"); return; }

  const audioCtx = new AC();
  const enhanced = new WeakMap();
  const decodeCache = new Map(); // url -> Promise<AudioBuffer>

  /* ---------- 컬러맵 (magma 근사) ---------- */
  const STOPS = [
    [0,0,4],[28,16,68],[79,18,123],[129,37,129],
    [181,54,122],[229,80,100],[251,135,97],
    [254,194,135],[252,253,191]
  ];
  function magma(t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const x = t * (STOPS.length - 1);
    const i = x | 0;
    if (i >= STOPS.length - 1) return STOPS[STOPS.length - 1];
    const f = x - i, a = STOPS[i], b = STOPS[i + 1];
    return [
      (a[0] + (b[0] - a[0]) * f) | 0,
      (a[1] + (b[1] - a[1]) * f) | 0,
      (a[2] + (b[2] - a[2]) * f) | 0,
    ];
  }

  /* ---------- FFT (radix-2 in-place) ---------- */
  function fft(re) {
    const n = re.length;
    const im = new Float32Array(n);
    // Bit reverse
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { const t = re[i]; re[i] = re[j]; re[j] = t; }
    }
    // Cooley-Tukey
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1;
      const step = -2 * Math.PI / size;
      for (let i = 0; i < n; i += size) {
        for (let k = 0; k < half; k++) {
          const angle = step * k;
          const c = Math.cos(angle), s = Math.sin(angle);
          const tre = c * re[i + k + half] - s * im[i + k + half];
          const tim = s * re[i + k + half] + c * im[i + k + half];
          re[i + k + half] = re[i + k] - tre;
          im[i + k + half] = im[i + k] - tim;
          re[i + k] += tre;
          im[i + k] += tim;
        }
      }
    }
    return { re, im };
  }

  /* ---------- Decode (캐시) ---------- */
  function decodeAudio(url) {
    if (decodeCache.has(url)) return decodeCache.get(url);
    const p = fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("fetch " + r.status);
        return r.arrayBuffer();
      })
      .then(buf => audioCtx.decodeAudioData(buf));
    decodeCache.set(url, p);
    return p;
  }

  /* ---------- Waveform ---------- */
  function drawWaveform(samples, canvas) {
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth || 600;
    const ch = canvas.clientHeight || 56;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;

    // 배경
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // 중앙선
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // 파형 (min/max envelope)
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    const step = samples.length / w;
    for (let x = 0; x < w; x++) {
      const start = (x * step) | 0;
      const end = Math.min(samples.length, ((x + 1) * step) | 0);
      let min = 1, max = -1;
      for (let i = start; i < end; i++) {
        const s = samples[i];
        if (s < min) min = s;
        if (s > max) max = s;
      }
      const y1 = (1 - max) * h / 2;
      const y2 = (1 - min) * h / 2;
      ctx.moveTo(x + 0.5, y1);
      ctx.lineTo(x + 0.5, y2);
    }
    ctx.stroke();
  }

  /* ---------- Spectrogram ---------- */
  function drawSpectrogram(samples, sampleRate, canvas) {
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth || 600;
    const ch = canvas.clientHeight || 96;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    const fftSize = 512;
    const hop = 128;
    const halfFft = fftSize >> 1;
    const numFrames = Math.max(0, Math.floor((samples.length - fftSize) / hop));
    if (numFrames < 2) return;

    // Hann window
    const win = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      win[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));
    }

    // 표시 주파수 범위: 50 ~ 500 Hz — 폐음 정보 대역
    // 50 Hz 이하: DC bias·신체 움직임·HVAC 잡음 제외
    // 500 Hz 이상: 폐음 정보 거의 없음, 화면 압축 방지
    const MIN_DISPLAY_HZ = 50;
    const MAX_DISPLAY_HZ = 500;
    let startBin, endBin;
    if (sampleRate && sampleRate > 0) {
      const binFreq = (sampleRate / 2) / halfFft;
      startBin = Math.max(1, Math.floor(MIN_DISPLAY_HZ / binFreq));
      endBin = Math.max(startBin + 8, Math.min(halfFft, Math.ceil(MAX_DISPLAY_HZ / binFreq)));
    } else {
      startBin = 2;
      endBin = Math.max(startBin + 8, halfFft >> 4);
    }
    const displayBins = endBin - startBin;

    // 자동 정규화 — peak를 1.0으로
    let peak = 1e-9;
    for (let i = 0; i < samples.length; i++) {
      const v = samples[i] < 0 ? -samples[i] : samples[i];
      if (v > peak) peak = v;
    }
    const norm = 1 / peak;

    // STFT — startBin~endBin 사이의 bin만 spec에 저장(DC bias 제외 + 메모리 절약)
    const spec = new Float32Array(numFrames * displayBins);
    const re = new Float32Array(fftSize);
    for (let f = 0; f < numFrames; f++) {
      const start = f * hop;
      for (let i = 0; i < fftSize; i++) re[i] = samples[start + i] * norm * win[i];
      const r = fft(re);
      for (let k = 0; k < displayBins; k++) {
        const kAbs = startBin + k;
        const mag = Math.sqrt(r.re[kAbs] * r.re[kAbs] + r.im[kAbs] * r.im[kAbs]);
        spec[f * displayBins + k] = 20 * Math.log10(mag + 1e-9);
      }
    }

    // 히스토그램 기반 백분위 정규화 — 10번째 백분위를 floor, 99번째를 ceiling
    // 이 방법은 노이즈 한 점 때문에 콘트라스트가 무너지는 걸 방지
    const H_BINS = 200, H_MIN = -120, H_MAX = 10;
    const hist = new Int32Array(H_BINS);
    for (let i = 0; i < spec.length; i++) {
      const db = spec[i];
      const t = (db - H_MIN) / (H_MAX - H_MIN);
      if (t < 0 || t > 1) continue;
      hist[Math.min(H_BINS - 1, (t * H_BINS) | 0)]++;
    }
    let cum = 0;
    const total = spec.length;
    let floorDb = H_MIN, ceilDb = H_MAX;
    let floorSet = false;
    for (let b = 0; b < H_BINS; b++) {
      cum += hist[b];
      const p = cum / total;
      const db = H_MIN + (b + 0.5) / H_BINS * (H_MAX - H_MIN);
      if (!floorSet && p >= 0.10) { floorDb = db; floorSet = true; }
      if (p >= 0.99) { ceilDb = db; break; }
    }
    const dyn = Math.max(20, ceilDb - floorDb);

    console.debug("[spectrogram]", {
      sampleRate, peak: peak.toFixed(4),
      floorDb: floorDb.toFixed(1), ceilDb: ceilDb.toFixed(1), dyn: dyn.toFixed(1),
      startBin, endBin, displayBins, halfFft,
      displayHz: sampleRate ? `${Math.round(startBin * sampleRate / 2 / halfFft)}-${Math.round(endBin * sampleRate / 2 / halfFft)}` : "?",
    });

    // 렌더 — y=0(top)=가장 높은 주파수, y=h(bottom)=DC
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let x = 0; x < w; x++) {
      const f = Math.min(numFrames - 1, ((x / w) * numFrames) | 0);
      const base = f * displayBins;
      for (let y = 0; y < h; y++) {
        const k = Math.min(displayBins - 1, Math.max(0, ((1 - y / h) * displayBins) | 0));
        const db = spec[base + k];
        let t = (db - floorDb) / dyn;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const c = magma(t);
        const idx = (y * w + x) * 4;
        data[idx] = c[0];
        data[idx + 1] = c[1];
        data[idx + 2] = c[2];
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------- Enhance (gain + viz) ---------- */
  function enhanceAudio(audio) {
    if (enhanced.has(audio)) return;
    enhanced.set(audio, { connecting: true });

    let src;
    try {
      src = audioCtx.createMediaElementSource(audio);
    } catch (e) {
      // 이미 다른 그래프에 연결된 경우
      console.warn("createMediaElementSource failed:", e);
      return;
    }

    // 4× 게인 + 컴프레서(클리핑 방지)
    const gain = audioCtx.createGain();
    gain.gain.value = 4.0;
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -3;
    comp.knee.value = 6;
    comp.ratio.value = 12;
    comp.attack.value = 0.003;
    comp.release.value = 0.1;
    src.connect(gain).connect(comp).connect(audioCtx.destination);

    enhanced.set(audio, { src, gain, comp });

    // 시각화 — .audio-wrap 안의 캔버스 찾기
    const wrap = audio.closest(".audio-wrap");
    if (!wrap) return;
    const wfCanvas = wrap.querySelector(".wf-canvas");
    const sgCanvas = wrap.querySelector(".sg-canvas");
    const playhead = wrap.querySelector(".audio-playhead");
    if (!wfCanvas || !sgCanvas) return;
    if (wrap.dataset.vizDone === "1") return;
    wrap.dataset.vizDone = "1";
    wrap.classList.add("audio-viz-loading");

    decodeAudio(audio.currentSrc || audio.src)
      .then(audioBuf => {
        const samples = audioBuf.getChannelData(0);
        // 비동기로 깜빡임 최소화
        requestAnimationFrame(() => {
          drawWaveform(samples, wfCanvas);
          drawSpectrogram(samples, audioBuf.sampleRate, sgCanvas);
          wrap.classList.remove("audio-viz-loading");
          wrap.classList.add("audio-viz-ready");
        });

        // Playhead
        if (playhead) {
          const update = () => {
            if (!audio.duration || !isFinite(audio.duration)) return;
            const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
            playhead.style.left = pct + "%";
            playhead.style.display = "block";
          };
          audio.addEventListener("timeupdate", update);
          audio.addEventListener("seeked", update);
          audio.addEventListener("ended", () => { playhead.style.left = "0%"; });
          update();
        }

        // 클릭 시 seek
        [wfCanvas, sgCanvas].forEach(c => {
          c.addEventListener("click", (e) => {
            if (!audio.duration || !isFinite(audio.duration)) return;
            const rect = c.getBoundingClientRect();
            const t = (e.clientX - rect.left) / rect.width * audio.duration;
            audio.currentTime = Math.max(0, Math.min(audio.duration - 0.02, t));
          });
        });
      })
      .catch(err => {
        console.warn("audio viz decode failed:", err);
        wrap.classList.remove("audio-viz-loading");
        wrap.classList.add("audio-viz-error");
      });
  }

  /* ---------- Delegation: 어떤 audio든 play 시 자동 enhance ---------- */
  document.addEventListener("play", (e) => {
    if (!(e.target instanceof HTMLAudioElement)) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    enhanceAudio(e.target);
  }, true);

  window.AudioViz = { enhanceAudio };
})();
