# v5 P2 감지 커버리지

생성: `pnpm exec tsx tools/p2-brief/detection-coverage.ts 6000` (결정론 시드 20261029, 1940~2015년 양력, 남·여·미지정, 약 20% 시간 미상).
차트 5963건 계산(실패 37건: UncertainBirthTimeError 37 — 시간 미상·절입 경계로 원국이 하나로 정해지지 않는 입력) → analyzeChartDetections → collectFeatureHits. 지식 DB에 없는 id 방출: 0건.

- P2 전 감지 가능 = P1 engineSupport 기준(조후 40·십이운성 12·관계 SAMHAP·BANGHAP·HYEONG·PA·HAE·신살 8·귀인 6 = 71개 제외) − 타입에만 있던 구조 3코드.
- P2 후 감지 = 이번 표본에서 1회 이상 나온 id.

| 가족 | 지식 항목 | P2 전 감지 가능 | P2 후 감지 | 미감지 |
|---|---:|---:|---:|---|
| branch | 12 | 12 | 12 | - |
| climate | 40 | 0 | 40 | - |
| dayMaster | 10 | 10 | 10 | - |
| dayPillar | 60 | 60 | 60 | - |
| element | 20 | 20 | 20 | - |
| gwiin | 12 | 6 | 12 | - |
| relation | 8 | 3 | 8 | - |
| shinsal | 29 | 21 | 29 | - |
| stem | 10 | 10 | 10 | - |
| structure | 14 | 11 | 14 | - |
| tenGod | 10 | 10 | 10 | - |
| tenGodBalance | 10 | 10 | 10 | - |
| twelveStage | 12 | 0 | 12 | - |
| yinYang | 7 | 7 | 7 | - |
| **합계** | **254** | **180** | **254** | **0** |

## 드문 항목(표본 감지 횟수 하위 12)

- `element:EARTH:MISSING`: 32회
- `dayPillar:壬戌`: 78회
- `dayPillar:戊午`: 82회
- `dayPillar:丁亥`: 84회
- `dayPillar:丁卯`: 85회
- `dayPillar:丙辰`: 86회
- `dayPillar:丁丑`: 87회
- `dayPillar:丙申`: 89회
- `dayPillar:戊戌`: 89회
- `dayPillar:己未`: 89회
- `structure:OUTPUT_GENERATES_WEALTH`: 89회
- `dayPillar:甲子`: 90회

## P2에서 새로 감지되는 항목(74)

| id | 감지 차트 수 | strong / medium / weak |
|---|---:|---|
| `climate:甲:spring` | 165 | 57 / 84 / 24 |
| `climate:甲:summer` | 157 | 85 / 48 / 24 |
| `climate:甲:autumn` | 182 | 53 / 64 / 65 |
| `climate:甲:winter` | 135 | 67 / 42 / 26 |
| `climate:乙:spring` | 133 | 62 / 65 / 6 |
| `climate:乙:summer` | 139 | 58 / 62 / 19 |
| `climate:乙:autumn` | 135 | 44 / 72 / 19 |
| `climate:乙:winter` | 158 | 108 / 23 / 27 |
| `climate:丙:spring` | 159 | 67 / 46 / 46 |
| `climate:丙:summer` | 152 | 26 / 82 / 44 |
| `climate:丙:autumn` | 132 | 52 / 66 / 14 |
| `climate:丙:winter` | 138 | 66 / 40 / 32 |
| `climate:丁:spring` | 146 | 55 / 64 / 27 |
| `climate:丁:summer` | 140 | 63 / 50 / 27 |
| `climate:丁:autumn` | 147 | 58 / 66 / 23 |
| `climate:丁:winter` | 149 | 41 / 98 / 10 |
| `climate:戊:spring` | 147 | 75 / 60 / 12 |
| `climate:戊:summer` | 144 | 66 / 57 / 21 |
| `climate:戊:autumn` | 133 | 53 / 57 / 23 |
| `climate:戊:winter` | 151 | 74 / 38 / 39 |
| `climate:己:spring` | 154 | 68 / 82 / 4 |
| `climate:己:summer` | 172 | 140 / 21 / 11 |
| `climate:己:autumn` | 147 | 53 / 74 / 20 |
| `climate:己:winter` | 141 | 34 / 56 / 51 |
| `climate:庚:spring` | 154 | 71 / 76 / 7 |
| `climate:庚:summer` | 149 | 130 / 13 / 6 |
| `climate:庚:autumn` | 149 | 62 / 79 / 8 |
| `climate:庚:winter` | 151 | 60 / 74 / 17 |
| `climate:辛:spring` | 178 | 81 / 80 / 17 |
| `climate:辛:summer` | 159 | 143 / 9 / 7 |
| `climate:辛:autumn` | 148 | 100 / 16 / 32 |
| `climate:辛:winter` | 135 | 71 / 19 / 45 |
| `climate:壬:spring` | 153 | 125 / 21 / 7 |
| `climate:壬:summer` | 152 | 127 / 6 / 19 |
| `climate:壬:autumn` | 132 | 76 / 41 / 15 |
| `climate:壬:winter` | 148 | 104 / 18 / 26 |
| `climate:癸:spring` | 143 | 112 / 20 / 11 |
| `climate:癸:summer` | 158 | 130 / 0 / 28 |
| `climate:癸:autumn` | 154 | 20 / 114 / 20 |
| `climate:癸:winter` | 144 | 77 / 23 / 44 |
| `gwiin:AMROK` | 1794 | 807 / 776 / 211 |
| `gwiin:BOKSEONG` | 2094 | 447 / 1458 / 189 |
| `gwiin:CHEON_EUI` | 1266 | 725 / 394 / 147 |
| `gwiin:GEUMYEO` | 1572 | 628 / 746 / 198 |
| `gwiin:MUNGOK` | 1815 | 459 / 1113 / 243 |
| `gwiin:JAEGO` | 1686 | 412 / 579 / 695 |
| `relation:SAMHAP` | 2796 | 250 / 1468 / 1078 |
| `relation:BANGHAP` | 245 | 198 / 47 / 0 |
| `relation:HYEONG` | 3258 | 769 / 1543 / 946 |
| `relation:PA` | 2314 | 1345 / 0 / 969 |
| `relation:HAE` | 2305 | 1346 / 0 / 959 |
| `shinsal:GONGMANG` | 2350 | 1068 / 0 / 1282 |
| `shinsal:GOEGANG` | 1468 | 248 / 924 / 296 |
| `shinsal:YANGIN` | 864 | 355 / 327 / 182 |
| `shinsal:WONJIN` | 2270 | 861 / 1134 / 275 |
| `shinsal:GWIMUN` | 847 | 847 / 0 / 0 |
| `shinsal:CHEONMUN` | 4634 | 3540 / 477 / 617 |
| `shinsal:EUMCHAK_YANGCHA` | 3321 | 1668 / 577 / 1076 |
| `shinsal:CHEONRA_JIMANG` | 767 | 448 / 0 / 319 |
| `structure:RESOURCE_SUPPORTS_DAYMASTER` | 204 | 1 / 203 / 0 |
| `structure:OUTPUT_GENERATES_WEALTH` | 89 | 0 / 89 / 0 |
| `structure:WEALTH_GENERATES_OFFICER` | 96 | 0 / 96 / 0 |
| `twelveStage:帝旺` | 1776 | 1083 / 0 / 693 |
| `twelveStage:長生` | 1787 | 1077 / 0 / 710 |
| `twelveStage:沐浴` | 1566 | 822 / 0 / 744 |
| `twelveStage:冠帶` | 1785 | 1004 / 0 / 781 |
| `twelveStage:建祿` | 1608 | 845 / 0 / 763 |
| `twelveStage:衰` | 1610 | 833 / 0 / 777 |
| `twelveStage:病` | 1777 | 1034 / 0 / 743 |
| `twelveStage:死` | 1637 | 892 / 0 / 745 |
| `twelveStage:墓` | 1735 | 1037 / 0 / 698 |
| `twelveStage:絶` | 1607 | 856 / 0 / 751 |
| `twelveStage:胎` | 1741 | 1062 / 0 / 679 |
| `twelveStage:養` | 1589 | 891 / 0 / 698 |

## 미감지

없음. 모든 지식 항목이 표본에서 1회 이상 감지되었다.
