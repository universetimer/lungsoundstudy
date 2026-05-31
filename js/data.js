/* ============================================================
 * 청진음 학습 데이터 (labeled_wave_manifest.csv 기반, 271 샘플)
 * ------------------------------------------------------------
 * 음원은 sounds/{filename}.wav 에서 로드.
 * 라벨 분포:
 *   crackle 140, wheezing 66, crackle_wheezing 23,
 *   rhonchi 22, wheezing_rhonchi 13, crackle_rhonchi 7
 * ============================================================ */

const AUDIO_BASE = "sounds/";

/* 라벨별 메타데이터 — 학습 카드에 표시 */
const LABELS = {
  crackle: {
    id: "crackle",
    name: "Crackle (수포음/나음)",
    nameEn: "Crackle (Rales)",
    nameKo: "수포음",
    type: "단일",
    typeEn: "Single",
    color: "#B45309",
    short: "비연속성·짧은 폭발음. 흡기 시 작은 기도가 갑자기 열릴 때 발생.",
    shortEn: "Discontinuous, brief explosive sounds. Small airways popping open during inspiration.",
    quality: "짧고 폭발적인 소리. Fine은 Velcro 떨어지는 듯한 고음, Coarse는 거품 터지는 저음.",
    qualityEn: "Short, explosive. Fine = Velcro-like high pitch; Coarse = bubbling low pitch.",
    timing: "주로 흡기 (Fine: 흡기 말기 / Coarse: 흡기 초기~호기)",
    timingEn: "Mostly inspiratory. Fine = late inspiration; Coarse = early inspiration through expiration.",
    pitch: "Fine은 고음, Coarse는 저음",
    pitchEn: "Fine = high; Coarse = low",
    clinical: "폐섬유증/IPF, 폐부종(CHF), 폐렴, 기관지확장증, 무기폐 — 폐포·세기관지 병변을 시사.",
    clinicalEn: "Pulmonary fibrosis (IPF), pulmonary edema (CHF), pneumonia, bronchiectasis, atelectasis — suggests alveolar/small airway disease.",
    distinguish: "Wheeze와 달리 연속음이 아니라 짧은 폭발음. 자세 변화·기침 후에도 잘 사라지지 않으면 fine, 변하면 coarse 분비물 가능성.",
    distinguishEn: "Unlike wheezes, crackles are discontinuous. Persistence after coughing/position change favors fine crackles; changes with cough favor coarse (secretions).",
    tip: "환자에게 깊은 흡기를 시키면 더 잘 들림.",
    tipEn: "Ask the patient to take deeper breaths to bring crackles out.",
  },
  wheezing: {
    id: "wheezing",
    name: "Wheezing (천명)",
    nameEn: "Wheezing",
    nameKo: "천명",
    type: "단일",
    typeEn: "Single",
    color: "#7C2D6F",
    short: "연속성·음악적인 고음. 좁아진 기도를 통과하는 공기의 진동.",
    shortEn: "Continuous, musical, high-pitched sound from airflow through narrowed airways.",
    quality: "휘파람 같은 고음, 음악적. 단음/다음조 모두 가능.",
    qualityEn: "Musical whistling. Can be monophonic or polyphonic.",
    timing: "주로 호기, 심하면 흡·호기 모두",
    timingEn: "Mostly expiratory; in severe cases both inspiratory and expiratory.",
    pitch: "고음 (high-pitched)",
    pitchEn: "High-pitched",
    clinical: "천식, COPD 급성악화, 알러지성 기관지경련, 국소 협착(종양/이물질 시 monophonic).",
    clinicalEn: "Asthma, COPD exacerbation, allergic bronchospasm, focal narrowing (tumor/foreign body → monophonic).",
    distinguish: "Rhonchi보다 음높이가 높음. Stridor와 달리 말초·양측에서 흔히 들림.",
    distinguishEn: "Higher pitched than rhonchi. Unlike stridor, often heard bilaterally over peripheral lung.",
    tip: "강제 호기를 시키면 숨은 wheeze가 드러남.",
    tipEn: "Force a full exhalation to unmask hidden wheezes.",
  },
  rhonchi: {
    id: "rhonchi",
    name: "Rhonchi (건성수포음)",
    nameEn: "Rhonchi",
    nameKo: "건성수포음",
    type: "단일",
    typeEn: "Single",
    color: "#0F766E",
    short: "연속성·낮은 코고는 듯한 진동음. 큰 기도의 분비물·협착.",
    shortEn: "Continuous, low-pitched snoring-like rumble. Secretions or narrowing in large airways.",
    quality: "코고는 듯한 저음, 거칠고 진동음 같음.",
    qualityEn: "Snoring, coarse, vibrating low tone.",
    timing: "주로 호기, 흡·호기 모두 가능",
    timingEn: "Mostly expiratory; can be in both phases.",
    pitch: "저음 (low-pitched)",
    pitchEn: "Low-pitched",
    clinical: "만성기관지염, 기관지확장증, 분비물 정체, 점액 마개.",
    clinicalEn: "Chronic bronchitis, bronchiectasis, retained secretions, mucous plugging.",
    distinguish: "Wheeze보다 음높이가 낮고, 기침 후 사라지거나 변하면 분비물 시사.",
    distinguishEn: "Lower pitched than wheezes. Clears or changes after coughing → secretions.",
    tip: "기침 전후 비교로 분비물 관련 여부를 평가.",
    tipEn: "Compare before and after coughing to gauge secretion contribution.",
  },
  crackle_wheezing: {
    id: "crackle_wheezing",
    name: "Crackle + Wheezing",
    nameEn: "Crackle + Wheezing",
    nameKo: "수포음 + 천명",
    type: "복합",
    typeEn: "Combined",
    color: "#9333EA",
    short: "수포음과 천명이 동반. 폐포 병변과 기도 협착이 함께 있는 상태.",
    shortEn: "Crackle plus wheeze. Alveolar disease together with airway narrowing.",
    quality: "비연속성 폭발음과 연속성 고음이 같은 호흡 주기에 혼재.",
    qualityEn: "Discontinuous explosions mixed with continuous high tones within the same cycle.",
    timing: "혼합 — 흡기에 crackle, 호기에 wheezing이 두드러지는 경우가 많음.",
    timingEn: "Mixed — crackles often in inspiration, wheezes prominent in expiration.",
    pitch: "혼합 (고음 + 저음/중음)",
    pitchEn: "Mixed (high + low/mid)",
    clinical: "COPD + 폐렴 동반, CHF + 천식양 양상, 광범위 기관지폐포 침범.",
    clinicalEn: "COPD with pneumonia, CHF with asthma-like component, diffuse bronchoalveolar disease.",
    distinguish: "두 라벨의 특징을 모두 확인 — 짧고 폭발적인 음과 길고 음악적인 음을 함께 인식.",
    distinguishEn: "Recognize both — brief explosive bursts together with long musical tones.",
    tip: "주기적으로 흡기·호기 단계를 분리해 들으면 어느 단계에서 무엇이 들리는지 식별 가능.",
    tipEn: "Consciously separate inspiration vs expiration to pinpoint which sound occurs when.",
  },
  wheezing_rhonchi: {
    id: "wheezing_rhonchi",
    name: "Wheezing + Rhonchi",
    nameEn: "Wheezing + Rhonchi",
    nameKo: "천명 + 건성수포음",
    type: "복합",
    typeEn: "Combined",
    color: "#2563EB",
    short: "고음 천명과 저음 진동음이 함께. 광범위 기도 협착 + 분비물.",
    shortEn: "High wheeze plus low rhonchi. Diffuse airway narrowing with secretions.",
    quality: "음악적 고음과 저음의 거친 진동음이 혼재.",
    qualityEn: "Musical high tones mixed with low rumbling vibrations.",
    timing: "주로 호기 우세, 흡기에도 들릴 수 있음.",
    timingEn: "Predominantly expiratory; may also be inspiratory.",
    pitch: "고음 + 저음 혼합",
    pitchEn: "High + low mixed",
    clinical: "천식 발작 중 분비물 동반, COPD 악화 + 가래.",
    clinicalEn: "Asthma attack with secretions, COPD exacerbation with sputum.",
    distinguish: "Crackle은 없고 연속음만 — 고음 wheeze와 저음 rhonchi가 같이 들리는 패턴.",
    distinguishEn: "No crackles — only continuous sounds (high wheeze + low rhonchi together).",
    tip: "기침 후 rhonchi 성분이 변하는지 관찰.",
    tipEn: "Observe if the rhonchi component changes after coughing.",
  },
  crackle_rhonchi: {
    id: "crackle_rhonchi",
    name: "Crackle + Rhonchi",
    nameEn: "Crackle + Rhonchi",
    nameKo: "수포음 + 건성수포음",
    type: "복합",
    typeEn: "Combined",
    color: "#DC2626",
    short: "수포음과 저음 진동음이 함께. 폐포 병변 + 대기도 분비물.",
    shortEn: "Crackles plus low rumble. Alveolar disease with large-airway secretions.",
    quality: "짧은 폭발음과 저음의 거친 진동음.",
    qualityEn: "Brief explosions plus coarse low vibrations.",
    timing: "혼합 — crackle은 흡기, rhonchi는 호기 우세.",
    timingEn: "Mixed — crackles in inspiration, rhonchi in expiration.",
    pitch: "고음 폭발음 + 저음 진동음",
    pitchEn: "High explosions + low vibrations",
    clinical: "폐렴 + 점액 분비물, CHF 진행기, 흡인성 폐렴.",
    clinicalEn: "Pneumonia with mucous secretions, progressive CHF, aspiration pneumonia.",
    distinguish: "Wheeze가 없는 점이 crackle_wheezing과의 핵심 차이.",
    distinguishEn: "Key difference from crackle_wheezing — no wheeze.",
    tip: "호흡 주기를 의식적으로 따라가며 흡기 vs 호기 성분을 분리.",
    tipEn: "Follow the respiratory cycle to separate inspiratory from expiratory components.",
  },
};

/* 라벨별 샘플 파일 목록 — labeled_wave_manifest.csv 271개 전체 */
const SAMPLES_BY_LABEL = {
  crackle: ["1120210916-1-2_crackle.wav","1120211001-1-1_crackle.wav","1120211004-1-2_crackle.wav","1120211004-1-3_crackle.wav","1120211004-1-4_crackle.wav","1120211008-1-2_crackle.wav","1120211008-1-5_crackle.wav","1120211008-1-6_crackle.wav","1120211009-1-3_crackle.wav","1120211010-1-6_crackle.wav","1120211014-1-1_crackle.wav","1120211014-1-2_crackle.wav","1120211014-1-4_crackle.wav","1120211018-1-2_crackle.wav","1120211018-1-3_crackle.wav","1120211018-1-4_crackle.wav","1120211019-1-11_crackle.wav","1120211019-1-12_crackle.wav","1120211019-1-4_crackle.wav","1120211019-1-6_crackle.wav","1120211019-1-7_crackle.wav","1120211021-1-3_crackle.wav","1120211021-2-10_crackle.wav","1120211021-2-11_crackle.wav","1120211021-2-12_crackle.wav","1120211021-2-3_crackle.wav","1120211021-2-9_crackle.wav","1120211022-1-1_crackle.wav","1120211022-1-2_crackle.wav","1120211025-1-1_crackle.wav","1120211025-1-2_crackle.wav","1120211025-1-3_crackle.wav","1120211025-1-4_crackle.wav","1120211027-1-2_crackle.wav","1120211027-1-4_crackle.wav","1120211028-1-10_crackle.wav","1120211028-1-9_crackle.wav","1120211031-1-7_crackle.wav","1120211031-1-8_crackle.wav","1120211105-1-11_crackle.wav","1120211105-1-12_crackle.wav","1120211105-1-4_crackle.wav","1120211115-1-1_crackle.wav","1120211115-1-2_crackle.wav","1120211115-1-5_crackle.wav","1120211115-1-6_crackle.wav","1120211115-1-7_crackle.wav","1120211115-1-8_crackle.wav","1120211116-1-1_crackle.wav","1120211116-1-2_crackle.wav","1120211116-1-3_crackle.wav","1120211116-1-4_crackle.wav","1120211118-1-1_crackle.wav","1120211118-1-2_crackle.wav","1120211118-1-8_crackle.wav","1120211227-1-1_crackle.wav","1120211230-1-8_crackle.wav","1120211230-1-9_crackle.wav","1120211230-2-2_crackle.wav","1120211230-2-3_crackle.wav","1120220111-1-11_crackle.wav","1120220111-1-3_crackle.wav","1120220111-1-4_crackle.wav","1120220111-1-9_crackle.wav","1120220412-1-10_crackle.wav","1120220412-1-11_crackle.wav","1120220412-1-12_crackle.wav","1120220412-2-12_crackle.wav","1120220414-2-12_crackle.wav","1120220422-1-12_crackle.wav","1120220428-3-10_crackle.wav","1120220502-2-11_crackle.wav","1120220509-1-10_crackle.wav","1120220509-1-12_crackle.wav","1120220510-1-10_crackle.wav","1120220516-2-11_crackle.wav","1120220516-2-12_crackle.wav","1120220523-3-10_crackle.wav","1120220523-3-11_crackle.wav","1120220523-3-12_crackle.wav","1120220524-1-11_crackle.wav","1120220527-1-11_crackle.wav","1120220527-1-12_crackle.wav","1120220530-2-11_crackle.wav","1120220530-2-12_crackle.wav","1120220602-1-10_crackle.wav","1120220602-1-12_crackle.wav","1120220607-2-11_crackle.wav","1120220608-1-10_crackle.wav","1120220608-1-11_crackle.wav","1120220608-1-12_crackle.wav","1120221201-2-10_crackle.wav","1120221202-1-10_crackle.wav","1120221202-1-12_crackle.wav","1120221206-1-10_crackle.wav","1120221208-1-10_crackle.wav","1120221208-1-12_crackle.wav","1120221220-2-10_crackle.wav","1120230428-1-10_crackle.wav","1120230428-1-12_crackle.wav","1120230428-2-10_crackle.wav","1120230511-1-11_crackle.wav","1120230511-1-12_crackle.wav","1120230515-1-10_crackle.wav","1120230515-1-12_crackle.wav","1120230519-1-11_crackle.wav","1120230519-1-12_crackle.wav","1120230522-1-12_crackle.wav","1120230522-2-10_crackle.wav","1120230522-2-12_crackle.wav","1120230525-1-11_crackle.wav","1120230525-1-12_crackle.wav","1120230525-2-10_crackle.wav","1120230526-2-10_crackle.wav","1120230619-1-11_crackle.wav","1120230619-1-12_crackle.wav","1120230619-2-10_crackle.wav","1120230619-2-12_crackle.wav","1120230623-2-10_crackle.wav","1120230623-2-11_crackle.wav","1120230623-2-12_crackle.wav","1120230629-1-10_crackle.wav","1120230629-1-12_crackle.wav","1120230717-2-10_crackle.wav","1120230717-2-12_crackle.wav","1120230724-2-10_crackle.wav","1120230724-2-12_crackle.wav","1120230727-2-10_crackle.wav","1120230727-2-11_crackle.wav","1120230727-2-12_crackle.wav","1120230803-1-10_crackle.wav","1120230803-1-11_crackle.wav","1120230803-1-12_crackle.wav","1120230811-1-10_crackle.wav","1120230811-1-12_crackle.wav","1120230831-2-11_crackle.wav","1120230831-2-12_crackle.wav","1120240129-3-10_crackle.wav","1120240129-3-11_crackle.wav","1120240129-3-12_crackle.wav"],
  wheezing: ["1120210916-1-11_wheezing.wav","1120210916-1-5_wheezing.wav","1120210916-1-9_wheezing.wav","1120211010-1-5_wheezing.wav","1120211012-1-11_wheezing.wav","1120211012-1-9_wheezing.wav","1120211019-1-2_wheezing.wav","1120211028-1-5_wheezing.wav","1120211028-1-7_wheezing.wav","1120211028-2-1_wheezing.wav","1120211028-2-3_wheezing.wav","1120211031-1-10_wheezing.wav","1120211031-1-11_wheezing.wav","1120211031-1-12_wheezing.wav","1120211031-1-1_wheezing.wav","1120211031-1-2_wheezing.wav","1120211031-1-9_wheezing.wav","1120211101-1-2_wheezing.wav","1120211104-1-11_wheezing.wav","1120211116-1-6_wheezing.wav","1120211118-1-3_wheezing.wav","1120211119-1-5_wheezing.wav","1120211119-1-6_wheezing.wav","1120211119-1-7_wheezing.wav","1120211119-1-8_wheezing.wav","1120211230-2-5_wheezing.wav","1120211230-2-7_wheezing.wav","1120211230-2-8_wheezing.wav","1120220111-1-1_wheezing.wav","1120220425-1-10_wheezing.wav","1120220425-1-11_wheezing.wav","1120220425-2-10_wheezing.wav","1120220519-1-11_wheezing.wav","1120221128-2-10_wheezing.wav","1120221128-2-11_wheezing.wav","1120221128-2-12_wheezing.wav","1120221207-1-11_wheezing.wav","1120221208-3-10_wheezing.wav","1120221208-3-11_wheezing.wav","1120221208-3-12_wheezing.wav","1120221222-2-11_wheezing.wav","1120221227-1-10_wheezing.wav","1120221227-2-10_wheezing.wav","1120221227-2-11_wheezing.wav","1120221227-2-12_wheezing.wav","1120230109-2-11_wheezing.wav","1120230109-2-12_wheezing.wav","1120230511-1-10_wheezing.wav","1120230512-1-10_wheezing.wav","1120230518-2-11_wheezing.wav","1120230612-2-10_wheezing.wav","1120230612-2-11_wheezing.wav","1120230612-2-12_wheezing.wav","1120230616-1-10_wheezing.wav","1120230619-1-10_wheezing.wav","1120230713-1-10_wheezing.wav","1120230713-1-11_wheezing.wav","1120230824-2-10_wheezing.wav","1120230824-2-11_wheezing.wav","1120230824-2-12_wheezing.wav","1120230918-3-10_wheezing.wav","1120230918-3-11_wheezing.wav","1120230918-3-12_wheezing.wav","1120240119-2-11_wheezing.wav","1120240119-2-12_wheezing.wav","1120240201-2-11_wheezing.wav"],
  rhonchi: ["1120211009-1-1_rhonchi.wav","1120211009-1-2_rhonchi.wav","1120211010-1-7_rhonchi.wav","1120211010-1-8_rhonchi.wav","1120211016-1-3_rhonchi.wav","1120211016-1-4_rhonchi.wav","1120211019-1-9_rhonchi.wav","1120211021-1-10_rhonchi.wav","1120211021-1-12_rhonchi.wav","1120211021-2-1_rhonchi.wav","1120211021-2-2_rhonchi.wav","1120211021-2-4_rhonchi.wav","1120211021-2-7_rhonchi.wav","1120211116-1-10_rhonchi.wav","1120220427-1-11_rhonchi.wav","1120220428-1-11_rhonchi.wav","1120220513-1-11_rhonchi.wav","1120221216-2-10_rhonchi.wav","1120221219-2-10_rhonchi.wav","1120221227-1-11_rhonchi.wav","1120230512-1-11_rhonchi.wav","1120230512-2-10_rhonchi.wav"],
  crackle_wheezing: ["1120211001-1-7_crackle_wheezing.wav","1120211001-1-8_crackle_wheezing.wav","1120211004-1-7_crackle_wheezing.wav","1120211004-1-8_crackle_wheezing.wav","1120211008-1-1_crackle_wheezing.wav","1120211008-1-3_crackle_wheezing.wav","1120211008-1-4_crackle_wheezing.wav","1120211012-1-12_crackle_wheezing.wav","1120211021-1-1_crackle_wheezing.wav","1120211021-1-2_crackle_wheezing.wav","1120211028-1-6_crackle_wheezing.wav","1120211101-1-1_crackle_wheezing.wav","1120211116-1-11_crackle_wheezing.wav","1120211116-1-12_crackle_wheezing.wav","1120211230-2-6_crackle_wheezing.wav","1120220111-1-2_crackle_wheezing.wav","1120220607-1-10_crackle_wheezing.wav","1120220607-1-11_crackle_wheezing.wav","1120220607-1-12_crackle_wheezing.wav","1120221207-1-10_crackle_wheezing.wav","1120221207-1-12_crackle_wheezing.wav","1120230525-1-10_crackle_wheezing.wav","1120230622-1-10_crackle_wheezing.wav"],
  wheezing_rhonchi: ["1120211001-1-6_wheezing_rhonchi.wav","1120211001-1-9_wheezing_rhonchi.wav","1120211016-1-1_wheezing_rhonchi.wav","1120211016-1-2_wheezing_rhonchi.wav","1120211028-1-8_wheezing_rhonchi.wav","1120211028-2-2_wheezing_rhonchi.wav","1120211028-2-4_wheezing_rhonchi.wav","1120221205-1-10_wheezing_rhonchi.wav","1120221219-2-11_wheezing_rhonchi.wav","1120221219-2-12_wheezing_rhonchi.wav","1120221222-2-10_wheezing_rhonchi.wav","1120230518-2-10_wheezing_rhonchi.wav","1120230518-2-12_wheezing_rhonchi.wav"],
  crackle_rhonchi: ["1120220516-1-10_crackle_rhonchi.wav","1120220516-1-11_crackle_rhonchi.wav","1120220516-1-12_crackle_rhonchi.wav","1120220602-1-11_crackle_rhonchi.wav","1120221205-1-11_crackle_rhonchi.wav","1120221205-1-12_crackle_rhonchi.wav","1120230109-1-12_crackle_rhonchi.wav"],
};

const LABEL_ORDER = ["crackle","wheezing","rhonchi","crackle_wheezing","wheezing_rhonchi","crackle_rhonchi"];

/* 평탄화된 샘플 배열 */
const ALL_SAMPLES = [];
for (const lab of LABEL_ORDER) {
  for (const file of SAMPLES_BY_LABEL[lab]) {
    ALL_SAMPLES.push({ file, label: lab });
  }
}

/* 비교 모드 추천 페어 */
const COMPARE_PRESETS = [
  { title: "Crackle vs Wheezing", description: "비연속음(폭발) vs 연속음(음악적)", a: "crackle", b: "wheezing" },
  { title: "Wheezing vs Rhonchi", description: "음높이로 구분", a: "wheezing", b: "rhonchi" },
  { title: "Crackle vs Crackle+Wheezing", description: "단일 vs 복합 — 천명 동반 여부", a: "crackle", b: "crackle_wheezing" },
  { title: "Wheezing vs Wheezing+Rhonchi", description: "고음 단독 vs 저음 동반", a: "wheezing", b: "wheezing_rhonchi" },
  { title: "Rhonchi vs Crackle+Rhonchi", description: "분비물만 vs 폐포 병변 동반", a: "rhonchi", b: "crackle_rhonchi" },
];

/* 유틸 */
function audioSrc(file) {
  return AUDIO_BASE + file;
}

function labelOf(file) {
  // 1120210916-1-2_crackle.wav -> crackle
  return file.replace(/\.wav$/, "").split("_").slice(1).join("_");
}

function sampleCountByLabel() {
  const out = {};
  for (const lab of LABEL_ORDER) out[lab] = SAMPLES_BY_LABEL[lab].length;
  return out;
}

function pickRandomSample(filterLabels = null) {
  let pool = ALL_SAMPLES;
  if (filterLabels && filterLabels.length) {
    pool = pool.filter(s => filterLabels.includes(s.label));
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

if (typeof window !== "undefined") {
  window.LABELS = LABELS;
  window.LABEL_ORDER = LABEL_ORDER;
  window.SAMPLES_BY_LABEL = SAMPLES_BY_LABEL;
  window.ALL_SAMPLES = ALL_SAMPLES;
  window.COMPARE_PRESETS = COMPARE_PRESETS;
  window.audioSrc = audioSrc;
  window.labelOf = labelOf;
  window.sampleCountByLabel = sampleCountByLabel;
  window.pickRandomSample = pickRandomSample;
}
