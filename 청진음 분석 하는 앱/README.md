# 청진음 학습기 (Auscultation Trainer)

`../labeled wave 파일/` 폴더의 라벨된 271개 wave 파일을 사용해 청진음을 학습·시험할 수 있는 정적 웹 사이트입니다.

## 데이터셋

`labeled_wave_manifest.csv` 기준:

| 라벨 | 개수 |
| --- | ---: |
| crackle | 140 |
| wheezing | 66 |
| crackle_wheezing | 23 |
| rhonchi | 22 |
| wheezing_rhonchi | 13 |
| crackle_rhonchi | 7 |
| **합계** | **271** |

## 폴더 구조

```
청진음 분석 앱/
├── labeled wave 파일/        ← 음원(271 wav) + 매니페스트 CSV
└── 청진음 분석 하는 앱/      ← 이 앱
    ├── index.html
    ├── catalog.html
    ├── quiz.html
    ├── compare.html
    ├── stats.html
    ├── css/style.css
    └── js/
        ├── data.js       (라벨 메타데이터 + 271개 샘플 목록)
        ├── storage.js    (localStorage)
        └── common.js     (UI 헬퍼)
```

음원 경로는 모두 `../labeled wave 파일/{filename}.wav`로 상대 참조됩니다.

## 실행

`청진음 분석 앱` 폴더(부모)를 루트로 정적 서버를 띄워야 두 하위 폴더(`labeled wave 파일/`, `청진음 분석 하는 앱/`)에 모두 접근할 수 있습니다.

```powershell
# 부모 폴더(청진음 분석 앱)에서:
python -m http.server 8770
# → http://localhost:8770/청진음 분석 하는 앱/
```

이 저장소의 `.claude/launch.json`에 `auscultation` 설정이 등록되어 있어 Preview에서 바로 실행 가능합니다.

## 모드

- **도감 (catalog.html)** — 6개 라벨별 메타데이터(음질·시기·임상·감별)와 모든 샘플 재생기.
- **퀴즈 (quiz.html)** — 4지선다, 5/10/20/30 문항, 라벨/제한시간 선택, 오답 노트.
- **비교 (compare.html)** — 두 라벨의 임의 샘플을 동시·번갈아 재생, 프리셋 5종.
- **통계·복습 (stats.html)** — 라벨별 정답률, 약점 라벨, 최근 답안, 기록 초기화.

## 새 라벨/샘플 추가

1. wave 파일을 `../labeled wave 파일/`에 추가하고 파일명을 `{id}_{label}.wav` 형식으로 통일.
2. `js/data.js`의 `SAMPLES_BY_LABEL`에 파일명을 추가. 새 라벨이라면 `LABELS`와 `LABEL_ORDER`에도 항목을 추가하고 `css/style.css`에 `.pill-{label}` 클래스를 정의.

## 면책

본 자료는 학습용이며 실제 임상 결정을 대체하지 않습니다.
