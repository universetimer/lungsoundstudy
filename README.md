# 청진음 학습기 (Lung Sound Study)

라벨된 271개 청진음 wave 파일로 청진음(crackle, wheezing, rhonchi 및 복합 라벨)을 도감·퀴즈·비교·복습 모드로 학습할 수 있는 정적 웹 앱.

## 폴더 구조

```
.
├── labeled wave 파일/        ← 271 wav + 매니페스트 CSV
└── 청진음 분석 하는 앱/      ← 웹 앱 (HTML/CSS/JS)
    ├── index.html
    ├── catalog.html
    ├── quiz.html
    ├── compare.html
    ├── stats.html
    ├── css/style.css
    └── js/{data.js, storage.js, common.js}
```

## 데이터셋

| 라벨 | 개수 |
| --- | ---: |
| crackle | 140 |
| wheezing | 66 |
| crackle_wheezing | 23 |
| rhonchi | 22 |
| wheezing_rhonchi | 13 |
| crackle_rhonchi | 7 |
| **합계** | **271** |

## 실행

루트 폴더에서 정적 서버를 띄웁니다.

```powershell
python -m http.server 8770
# → http://localhost:8770/청진음 분석 하는 앱/
```

## 모드

- **도감** — 6개 라벨별 메타데이터·임상·감별과 모든 샘플 재생
- **퀴즈** — 4지선다, 라벨/시간 선택, 오답 노트
- **비교** — 두 라벨 임의 샘플 동시·번갈아 재생, 프리셋
- **통계·복습** — 라벨별 정답률, 약점 라벨, 최근 답안

## 면책

학습 목적이며 실제 임상 결정을 대체하지 않습니다.
