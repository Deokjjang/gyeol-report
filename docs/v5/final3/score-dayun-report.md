# 최종판3 7·8 — 궁합 점수 표기·관계 목록 / 대운 표기 통일 (LLM 호출 0)

작업 2026-11-05, worktree `~/Developer/gyeol-worktrees/v5-final`(v5/final, HEAD bdedbe6f), 커밋 없음.
만세력 계산(`src/lib/saju/*`)·궁합 지수 계산(`compat/score.ts`의 단계·배점·합산)은 바꾸지 않았다. 표시·브리프·Book 투영만 바꿨다.

## 1. 바꾼 파일

| 파일 | 내용 |
|---|---|
| `src/lib/brief/labels.ts` | `dayunLabel()`(대운 표기 단일 함수)·`DAYUN_AGE_NOTE`, `REL_PLAIN.STEM_CHUNG`(천간충), `HALF_HAP_PLAIN` 고침, `SAMHYEONG_PLAIN`, `halfHapLine()`, `relationPlain(…, name?)` |
| `src/lib/compat/relations.ts` (새) | `pairRelations(a, b)`: 두 사람 사이 관계 전체(엔진 `detectRelations`+`detectStemClashes`, 삼형 한 줄, 영향 큰 순), `pairRelationCounts()` |
| `src/lib/compat/display.ts` (새) | 기본점 줄: `BASE_POINTS`·`BASE_ROW_NAME`·`baseReason()`·`baseRowOf()` |
| `src/lib/compat/score.ts` | 표시만: 반합 이름 = `HALF_HAP_PLAIN`, `BASE_SCORE = BASE_POINTS`(값 40 그대로) |
| `src/lib/brief/compatibility.ts` | 관계 줄 생성(`pairRelationLines`)·뜻 문장 통일·`relationsSummary`, 점수 components 맨 앞 기본점 줄 |
| `src/lib/brief/schema.ts` | `currentDayun.label·start`, `next.label·start`, `timeline.cycles[].label·ages`, `entries[].dayun.start`, `compatibility.relationsSummary{line,names}`, `score.components` 7~8개·level `"기본"` |
| `src/lib/brief/timeline.ts` | `cycleSummary` label·ages, 전환 해 카드 `dayun.start`, 머리 문장 "이 해 5월 무렵부터", 반합 배지 문구 |
| `src/lib/brief/chart.ts` (허용 목록 밖, 금지 목록에도 없음) | `currentDayun`의 ages·years·label·start, `next.label·start`를 `dayunLabel`로. 지시의 "브리프 currentDayun"이 이 파일에서만 만들어져 고쳤다 |
| `src/lib/writer/book.ts` | Book: `V5Cycle.label`, draft `dayun`(부록 대운 줄), evidence `pair.relationsSummary`; 화면: 기본점 줄(저장본은 합이 맞을 때만), 첫 쪽 요약+3줄, 부록 「두 사람 사이의 모든 기운」, 대운 표 전환 줄·전환 해 표시, 부록 대운 줄, 카드 반합 문구 |
| `src/app/dev/book-preview/{BookReader.tsx,bookTypes.ts,book.module.css}` | 첫 쪽 요약·"영향이 큰 세 가지"·부록 안내, 부록 `notes` 줄 |
| `tests/unit/book/final3ScoreDayun.test.tsx` (새, 10건) | 대운 표기·6상품 경로·전환 해·관계 목록·천간충 범위·60쌍 형식·점수 합 |
| `tests/unit/book/p6cScore.test.tsx`, `p6cUi2.test.tsx`, `tests/unit/writer/p6d.test.ts` | 기대값 갱신(기본점 줄, 관계 부록 쪽, 반합 문구, 전환 머리 문장 "이 해 12월 무렵부터") + 저장 v2.x 기본점 줄 시험 1건 |

## 2. 궁합 점수 산식과 표기

산식(`compat/score.ts`, 변경 없음): **총점 = 기본점 40 + 항목 7개 점수 합(만점 60)**. MBTI가 한쪽이라도 없으면 MBTI를 빼고 그 몫을 사주 항목 만점에 나눠 여섯 항목 만점 합 60(`itemMax`).

| 유형 | 오행 보완 | 타고난 중심 관계(일간) | 생활 자리(일지) | 자란 환경·사회 자리(연지·월지) | 서로에게 주는 역할 | 음양 균형 | MBTI | 합 |
|---|---|---|---|---|---|---|---|---|
| 연애·결혼 | 12 | 10 | 10 | 6 | 4 | 3 | 15 | 60 |
| 동료·사업 | 12 | 10 | 6 | 10 | 4 | 3 | 15 | 60 |
| 부모·자녀 | 12 | 10 | 5 | 8 | 7 | 3 | 15 | 60 |
| 상사·팀원 | 12 | 10 | 5 | 9 | 6 | 3 | 15 | 60 |
| 친구 | 12 | 10 | 7 | 6 | 4 | 3 | 18 | 60 |

저장된 궁합 책(`.cache/final3/stored/final2-sodam-seongmin.snapshot.json`, v2.2, 장소담×전성민 연애) 점수 쪽:

| | 줄 | 줄 합 | 총점 |
|---|---|---|---|
| 전 | 오행 보완 12/12 · 타고난 중심 관계 10/10 · 생활 자리 7/10 · 자란 환경·사회 자리 3/6 · 서로에게 주는 역할 2/4 · 음양 균형 1/3 · MBTI 4/15 | 39/60 | 79/100 |
| 후 | **기본점 40/40** · 오행 보완 12/12 · … · MBTI 4/15 (저장본 그대로, 화면이 기본점 줄을 붙임) | 79 | 79/100 |

- 기본점 줄 이유: 「기본점은 두 사람 누구에게나 똑같이 주는 40점이에요. 여기에 아래 일곱 항목의 점수 39점(60점 만점)을 더해 총점 79점이 돼요.」
- 새 Book: 브리프 `compatibility.score.components` 맨 앞이 `{ name: "기본점", points: 40, max: 40, level: "기본" }` → 작가 요약도 points 합 = value(79). Book evidence에도 그대로 실린다.
- 저장 Book: 기본점 줄이 없고 줄 합 + 40 = 총점일 때만 화면에서 붙인다(`baseRowOf`). 옛 v2 MBTI 환산 Book처럼 합이 안 맞으면 붙이지 않는다(저장본은 바꾸지 않음). v5-1(P4 3칸)·V4 점수 화면은 그대로.

## 3. 관계 목록 전후 (장소담 × 전성민, 엔진 명식 丙子 己亥 丁丑 丁未 × 壬申 辛亥 己丑 甲戌)

전(저장본, 첫 쪽 12줄 전부):
1. 장소담님의 태어난 날 땅 글자와 전성민님의 태어난 시각 땅 글자가 형(서로 깎고 다듬는 마찰) 관계예요. **세 땅이** 서로 눌러 믿던 사람과 틀어지기 쉬운 흐름이에요. ← 丑戌 두 글자
2. …태어난 해 땅 글자와 …태어난 날 땅 글자가 육합… 물과 얼어붙은 땅이 만나 조용히 한곳에 머무는 흐름이에요.
3. …태어난 시각 땅 글자와 …태어난 날 땅 글자가 충… 두 땅이 부딪쳐 닫혀 있던 창고가 열리는 흐름이에요.
4. …태어난 시각 땅 글자와 …태어난 날·시각 땅 글자 모두가 형… 세 땅이 서로 눌러… ← 1번과 같은 삼형이 두 줄
5. …날·시각 하늘 글자 모두와 …해 하늘 글자가 천간합… 등불과 큰물이…
6. …태어난 달 땅 글자와 …태어난 달 땅 글자가 형(서로 깎고 다듬는 마찰) 관계예요. ← 뜻 문장 없음(자형 亥亥)
7. …달 × 해 해(가까운 사이의 작은 서운함)… 쇠와 바닷물이…
8. …해 × 해 반합(삼합 세 글자 중 두 글자가 만남)… 물의 **팀이 완성되어**… ← "완성"
9. …시각 × 달 반합… 나무의 **팀이 완성되어**… ← "완성"
10. …시각 × 시각 파… 마른 땅끼리 어긋나…
11. …달 하늘 × 시각 하늘 천간합… 나무와 땅이…
12. …해 하늘 × 달 하늘 천간합… 햇빛과 보석이…
(丙 ↔ 壬 천간충 누락)

후(새 브리프·Book): 첫 쪽 = 요약 한 줄 + 영향 큰 3줄, 부록 「두 사람 사이의 모든 기운」 = 12줄 전부(영향 큰 순, 줄마다 합/형·충·파·해 표시).
- 요약: 「두 사람 사이에서 찾은 관계는 모두 12가지예요. 합 6가지(천간합 3·육합 1·반합 2) · 형·충·파·해 6가지(삼형 1·형 1·충 1·천간충 1·파 1·해 1).」
1. [삼형] 장소담님의 태어난 날·시각 땅 글자 모두와 전성민님의 태어난 날·시각 땅 글자 모두가 삼형(세 땅 글자가 서로 깎고 다듬는 마찰) 관계예요. 세 땅이 서로 눌러 믿던 사람과 틀어지기 쉬운 흐름이에요. ← 丑·未(소담)+丑·戌(성민)로 세 글자가 다 모여 "세 땅"이 맞다
2. [육합] 장소담님의 태어난 해 땅 글자와 전성민님의 태어난 날 땅 글자가 육합(땅 글자끼리 맞물림) 관계예요. 물과 얼어붙은 땅이 만나 조용히 한곳에 머무는 흐름이에요.
3. [충] 장소담님의 태어난 시각 땅 글자와 전성민님의 태어난 날 땅 글자가 충(마주 서서 부딪침) 관계예요. 두 땅이 부딪쳐 닫혀 있던 창고가 열리는 흐름이에요.
4. [형] 장소담님의 태어난 달 땅 글자와 전성민님의 태어난 달 땅 글자가 형(서로 깎고 다듬는 마찰) 관계예요. 같은 글자가 겹쳐 서로를 몰아붙이는 흐름이에요.
5. [천간합] 장소담님의 태어난 날·시각 하늘 글자 모두와 전성민님의 태어난 해 하늘 글자가 천간합(하늘 글자끼리 끌려 묶임) 관계예요. 등불과 큰물이 어울려 마음이 먼저 움직이는 흐름이에요.
6. [천간합] 장소담님의 태어난 달 하늘 글자와 전성민님의 태어난 시각 하늘 글자가 천간합(…) 관계예요. 나무와 땅이 어울려 자리를 잡고 싶어지는 흐름이에요.
7. [천간합] 장소담님의 태어난 해 하늘 글자와 전성민님의 태어난 달 하늘 글자가 천간합(…) 관계예요. 햇빛과 보석이 어울려 겉이 빛나고 속은 눌리는 흐름이에요.
8. [해] 장소담님의 태어난 달 땅 글자와 전성민님의 태어난 해 땅 글자가 해(가까운 사이의 작은 서운함) 관계예요. 쇠와 바닷물이 서로 방해해 계획이 새는 흐름이에요.
9. [반합] 장소담님의 태어난 시각 땅 글자와 전성민님의 태어난 달 땅 글자가 반합(세 글자 중 두 글자만 모여 반쯤 묶임) 관계예요. 나무의 기운이 반쯤 묶여 시작과 성장이 모이기 시작하는 흐름이에요.
10. [천간충] 장소담님의 태어난 해 하늘 글자와 전성민님의 태어난 해 하늘 글자가 천간충(하늘 글자끼리 마주 서서 부딪침) 관계예요. 불(화) 기운과 물(수) 기운이 하늘 글자에서 마주 서서, 겉으로 드러나는 생각과 의견이 부딪치기 쉬운 흐름이에요. ← 새로 들어감(丙壬)
11. [반합] 장소담님의 태어난 해 땅 글자와 전성민님의 태어난 해 땅 글자가 반합(…) 관계예요. 물의 기운이 반쯤 묶여 생각과 정보가 모이기 시작하는 흐름이에요.
12. [파] 장소담님의 태어난 시각 땅 글자와 전성민님의 태어난 시각 땅 글자가 파(맞춰 둔 것에 금이 감) 관계예요. 마른 땅끼리 어긋나 가족·집 일이 흔들리는 흐름이에요.

규칙(코드 `compat/relations.ts`·`brief/compatibility.ts`):
- 영향 = 관계 세기(충·육합·세 글자 삼형 3 / 천간합·천간충·원진·두 글자 형·상형·자형 2 / 반합·파·해 1) + 두 사람 각자 가장 무거운 자리(날 3·달 2·해 1·시각 1). 같으면 예전 순서(날–날 → 날이 낀 짝).
- 삼형(寅巳申·丑戌未): 같은 묶음은 한 줄. 두 사람 글자에 세 글자가 다 있으면 「삼형(세 땅 글자가…)」+ 지식 DB 삼형 문장, 두 글자뿐이면 「형」+「삼형 세 글자 중 두 글자만 만나 서로를 깎고 다듬는 흐름」(세 땅 금지).
- 반합: 이름 「반합(세 글자 중 두 글자만 모여 반쯤 묶임)」, 뜻 문장은 `halfHapLine`(「완성」→「반쯤 묶여」, 「크게 모이는」→「모이기 시작하는」). 대운·세운 카드 배지·궁합 점수 이유도 같은 문구.
- 뜻 문장 없는 줄 0: 같은 글자 배지 → 관계 종류 기본 배지(「~해」→「~흐름」), 자형은 배지 「自刑」(「스스로를」→「서로를」), 천간충은 두 글자 오행 문장.
- 저장 Book(요약 없음)은 예전처럼 첫 쪽에 전체 목록, 관계 부록 쪽 없음. `book:replay`로 다시 만들면 새 배치가 된다.

## 4. 천간충 감지 범위 (엔진 표 `STEM_CHUNG_TABLE` = 甲庚·乙辛·丙壬·丁癸, 戊甲·己乙 미채택)

| 범위 | 엔진 감지 | 브리프·작가 | Book 화면 | 비고 |
|---|---|---|---|---|
| 원국 내부 | ✅ `analyzeChartDetections().stemClashes` | ❌ (trait·featureHit에 안 씀, 지식 DB 항목 없음) | ✅ v5 만세력 표 합충형파해 줄(`v5NatalRows.ts`) | 변경 없음 |
| 원국 × 대운·세운·월운 | ❌ `analyzeIncoming`은 `detectRelations`만 | ❌ 카드 배지에 없음 | ❌ | 예: 전성민 연간 壬 × 2026 丙午 세운 = 丙壬 천간충인데 카드에 안 나온다. 정답지(`factsheet/build.ts`)는 따로 감지 |
| 궁합 두 사람 사이 | 전 ❌ → **후 ✅** (`compat/relations.pairRelations`가 `detectStemClashes` 사용) | ✅ `relationsPlain`·`dayRelations` | ✅ 첫 쪽 요약·부록 | 장소담 丙(연간) ↔ 전성민 壬(연간) 1건 |
| 궁합 점수 | ❌ | — | — | 일간끼리만 「상극」 단계로 본다(丙壬처럼 일간이 천간충이면 상극=0점과 같음). 다른 기둥의 천간충·천간합은 점수에 없다. 산식 그대로 둠 |

## 5. 산식 자체 오류 여부

- 산술 오류 없음: 장소담×전성민 7항목을 단계표로 다시 셈 — 오행 12(둘 다 채움), 일간 10(丁→己 상생 0.97×10), 일지 7(丑丑 관계 없음 0.74), 연·월지 3(子申 반합 1.0·亥亥 자형 0 → ½씩 × 6), 역할 2(상생 0.5×4), 음양 1(음10:양6, 차 1/4 → 0.33×3), MBTI 4(0+2+2) = 39, 총점 79. 저장값과 같다.
- 오류는 표시였다: 문서(compat-score-v2.md §1)는 "화면의 항목 막대를 더하면 총점"이라 했지만 실제 막대 합은 총점 − 40이었다 → 기본점 줄로 해결.
- 설계상 한계(보고만, 바꾸지 않음): ① 점수는 같은 자리끼리(일간·일지·연지·월지)만 보고, 목록의 교차 자리 관계(예: 소담 연지 子 × 성민 일지 丑 육합, 소담 시지 未 × 성민 일지 丑 충)는 점수에 없다 ② 천간충·일간 외 천간합 없음 ③ 반합을 육합과 같은 「합」 단계(만점)로 친다 ④ 같은 글자(丑丑)는 「관계 없음」(0.74). 바꾸려면 `COMPAT_SCORE_VERSION`을 올리는 결정이 필요하다.

## 6. 대운 확인 출력 (엔진 `calculateCustomerDayun` 그대로, `dayunLabel` 표기)

| 사람 | 순역 | 교운 시각(엔진) | 표기 | 만 나이 |
|---|---|---|---|---|
| 장덕민(1999-07-31 08:27 양력 남) | 역행, 출생 뒤 7년 9개월 20일 6시간 | 무진 대운 시작 **2027-05-20T14:27+09:00** | **무진 대운: 2027년 5월 무렵부터 (대운수 8)** | 만 28~37세 |
| 장덕민 지금(2026) | | 기사 2017-05-20 | 기사 대운: 2017년 5월 무렵부터 (대운수 8) | 만 18~27세 |
| 장소담(1996-12-06 14:15 여) | 역행, 9년 8개월 9일 2시간 | 병신 대운 시작 2026-08-15T16:15+09:00 (첫 대운 戊戌 2006-08-15) | 병신 대운: 2026년 8월 무렵부터 (대운수 10) · 다음 을미 대운: 2036년 8월 무렵부터 (대운수 10) | 만 30~39세 |
| 전성민(1992-11-09 19:45 남) | 순행, 9년 1개월 19일 22시간 | 갑인 대운 시작 2021-12-29T17:45+09:00 (첫 대운 壬子 2001-12-29) | 갑인 대운: 2021년 12월 무렵부터 (대운수 9) · 다음 을묘 대운: 2031년 12월 무렵부터 (대운수 9) | 만 29~38세 |

- 대운수 = 첫 대운이 시작되는 해의 만 나이(= 첫 대운 시작 연도 − 출생 연도). 대운마다 10씩 늘어 어느 대운에서 셈해도 같다. 만 나이 = 그해 연도 − 출생 연도(`manAge`와 같음). 엔진 `startAge`(세는 나이)에서 1을 뺀다.
- 시간 대략·미상: 교운 가능 범위의 달(예 「2027년 4~6월 무렵부터」). 연도는 엔진이 하나로 보장한다(아니면 DAYUN_UNCERTAIN).
- 부록 한 줄(사람마다 부록 첫 쪽): 「어떤 만세력은 대운수를 세는 나이에 붙여 1년 이르게 표시해요. 결리포트는 태어난 뒤 실제로 흐른 시간(만 나이)으로 계산해요.」 바로 위에 기준일 대운·다음 대운 표기 두 줄.
- 대운 상품 2027 카드 머리 문장: 「2027년 정미(丁未)는 상관(傷官)이 하늘에, 정재(正財)가 땅에 들어오는 해예요. 이 해 5월 무렵부터 무진(戊辰) 대운이 시작되고, 10년의 중심 기운은 편재(偏財)예요.」 대운 표 위 전환 줄 「기사 대운 → 무진 대운 · 2027년 5월 무렵부터 (대운수 8)」, 2027 줄 「2027년 5월 무렵부터 · 대운 전환」.

## 7. 대운 호출 경로 (6개 상품)

계산(한 함수): 6개 상품 모두 `buildBrief.ts` `analyzePerson`(약 106행) → `dayunOf`(120행) → `chart.ts:60-62 dayunOf` → `saju/customerDayun.ts:88 calculateCustomerDayun`. 궁합은 두 사람 각각 같은 경로. 같은 함수를 부르는 다른 곳(표시에는 안 쓰임): 입력 검사 `report-generation/reportInputAdapter.ts:198`(대운·세운만), 사람별 만세력 표용 v4 계산 `majorFortuneGenerationHandler.ts:127`·`annualFortuneGenerationHandler.ts:106`(`writer/publish.ts` `v4People` 경유, 표에 대운 줄 없음), 정답지 `factsheet/build.ts:160`.

표시(한 함수 `labels.ts:74 dayunLabel`):

| 경로 | 위치 | 상품 |
|---|---|---|
| 브리프 `chart.currentDayun.ages·years·label·start`, `next.label·start` | `brief/chart.ts:117-124` | 6개 전부(궁합은 두 사람) |
| 브리프 `timeline.cycles[].label·ages·years` | `brief/timeline.ts:256-258 cycleSummary` (`buildBrief.ts` 309·316행에서 호출) | 대운·세운 |
| 대운 연도 카드 `dayun.start`·머리 문장 교운 달 | `brief/timeline.ts:210-211`, `headLine` 246행 | 대운 |
| Book draft `timeline.cycles[].label`, 부록 대운 줄 `draft.dayun` | `writer/book.ts:212`, `178-184 dayunOf`·218행 | 대운·세운 / 6개 전부 |
| 화면: 대운 표 전환 줄·전환 해 표시, 부록 대운 줄 | `writer/book.ts:296-302 dayunTransitions`, 375-376, 387행 → `BookReader.tsx` 103·123행 | 대운 / 6개 전부 |
| **아직 이 함수를 안 쓰는 곳(소유 밖, §9)** | `buildBrief.ts:404` 전환 문장, `evidence.ts:293-300`, `design/career.ts:142`, `design/love.ts:125`, `productEvidence.ts:122-123`, `writer/deterministic/index.ts:87·111` | |

옛 경로(저장본 전용, 손대지 않음): V3 화면 `MajorFortuneReportView.tsx`·`report-tables/daeunTableData.ts`(세는 나이 `startAge`), V4 Book 투영 `app/dev/book-preview/bookProjection.ts`(전환 날짜 `dateLabel`). 바꾸면 기존 고객 Book 표시가 바뀐다 — 필요하면 결정 후 별도 작업.

## 8. 실행한 검증

- `pnpm exec tsc --noEmit -p .` → 오류 0 (PASS)
- `pnpm exec eslint <바꾼 소스·시험 15개>` → 오류 0 (PASS)
- `pnpm exec vitest run tests/unit/book/final3ScoreDayun.test.tsx tests/unit/book/p6cScore.test.tsx tests/unit/book/p6bUi.test.tsx tests/unit/book/p6cUi2.test.tsx tests/unit/compat tests/unit/brief tests/unit/writer/{p6b,p6c,p6d,p6e,final2,safetyP36,safetyP37,safetyP38,writer}.test.ts tests/unit/report-tables/v5ManseTableConsistency.test.tsx tests/unit/components/MobileBookInteractions.test.tsx tests/unit/saju/customerDayun.test.ts` → 22파일 389건 중 379 통과, 10 실패 — **이 작업 때문인 실패 0**:
  - `p6d` 「하람 회귀 … 비겁 강」, `p6c` 「E1 커리어 9장」: 비겁 강→보통. 다른 레인이 고친 `src/lib/saju/groupStrength.ts` 때문(내 파일 아님).
  - `final2` 「판독 문장 …」(최지우:다툼): 15:27에 다른 레인이 고친 `pairProfile.ts` 뒤로 생김(15:18 같은 시험 통과).
  - `buildBrief` 스냅샷 6건 + 「trait 8~12개 가족 상한」: trait 배정 차이(다른 레인 `groupStrength.ts`·`buildBrief.ts`)와 `tokens` 수(이 작업의 대운 label·관계 요약·기본점 줄도 포함)가 섞여 있다. 두 레인 반영 뒤 `pnpm exec vitest run tests/unit/brief/buildBrief.test.ts -u` 한 번 필요.
  - `tests/unit/sharing/bookSharing.test.tsx`: beforeAll 60초 초과(PGlite, 부하) — UNVERIFIED(V4 고정본, 이번 변경과 무관한 파일).
- 호출 0 확인 출력: 브리프·투영 스크립트(tsx, 스크래치)로 6상품×장덕민, 장소담×전성민, 저장본 `final2-sodam-seongmin` 투영.

## 9. 필요한 변경 (소유 밖 파일 — 리드 반영)

1. `src/lib/brief/buildBrief.ts` 약 404행(다음 대운 1년 안 전환 문장): `${cd.next.startYear}년부터 ${hanja}(${hangul})` → `${cd.next.start ?? `${cd.next.startYear}년부터`} ${hanja}(${hangul})` (= 「2027년 5월 무렵부터 戊辰(무진)…」).
2. `src/lib/brief/evidence.ts:293-300` 커리어 타이밍: `지금 대운 … (${cd.years})` 뒤에 `· ${cd.label}`, `전환 해: ${cd.next.startYear}년부터` → `전환: ${cd.next.start}`(연도 쓰는 300행 준비 줄은 그대로).
3. `src/lib/brief/design/career.ts:142` `timingNow`: `지금 대운: ${cd.label} · ${cd.tenGod}`; `design/love.ts:125` `loveTiming`: `지금 대운: ${cd.label} · ${cd.tenGod}`.
4. `src/lib/brief/productEvidence.ts:122-123` `majorDesign`: `지금 대운 ${cur.label}`, `다음 대운 ${next.label}`(cycles에 label 있음).
5. `src/lib/writer/deterministic/index.ts:87·111`: 결정론 작가 문단에 `c.currentDayun.label`, `x.label` 사용.
6. `src/lib/writer/safety/p6d.ts:114 CALENDAR_MONTH`: 세운 책 본문은 「N월」을 막는데, 대운 표기에 「2027년 5월 무렵부터」가 들어 있다 → 작가가 그대로 옮기면 calendar_month 수리. 예외 추가 권장: `(?! ?(~\d{1,2}월 )?무렵부터)` 또는 앞에 `\d{4}년 `이 있으면 허용.
7. `src/lib/writer/prompt/system.ts:35`(선택): "대운 시작은 currentDayun.label·start / timeline.cycles[].label 표기 그대로(대운수 = 만 나이)" 한 줄.
8. `src/lib/factsheet/build.ts:216` 정답지 `pair.score`: 이제 `components` 맨 앞이 기본점 줄이라 `base = value − 합`이 0이 된다(합 검사는 그대로 맞음). `base: BASE_POINTS`(`compat/display`), `components: sc.components.filter(c => c.name !== BASE_ROW_NAME)`로 바꾸면 예전 뜻 그대로.
9. `tools/final2/compat-types.ts:35` 배점 목록에 「기본점 40」이 끼므로 필요하면 같은 필터.
10. `tests/unit/brief/__snapshots__/buildBrief.test.ts.snap`: §8대로 두 레인 반영 뒤 `-u`.
11. 문서 `docs/v5/compat-score-v2.md §1·§6`: "화면 항목 합 = 총점"은 기본점 줄 포함이라는 것, 브리프 components 7~8개(기본점 level "기본") 반영.

## 10. 영향·주의

- 작가 입력이 바뀐다(브리프 `currentDayun.label·start`·`cycles[].label`·관계 12줄 문구·`relationsSummary`·기본점 줄) → 원문 해시가 바뀐다. `book:replay`는 작가 원고를 해시와 무관하게 차례로 쓰므로 저장본 재생은 되고, 바뀐 입력의 수리·재작성은 부르지 않는다(호출 0).
- **발견(결정 필요)**: 기준일 대운 선택(`chart.ts` `cycles.find(c => c.startYear <= year && year <= c.endYear)`)은 연도 단위라, 교운이 기준일 뒤 같은 해에 있으면 아직 시작 전인 대운을 「지금 대운」으로 쓴다. 예: 최지우(2006-09-07 16:30 여) 갑오 대운 교운 2026-11-26T20:30, 기준일 2026-11-04 → 브리프 `currentDayun` = 갑오(실제로는 을미 대운 마지막 달). 표기에 달이 붙어 이제 화면에서 드러난다(「갑오 대운: 2026년 11월 무렵부터」). 교운 시각과 기준일을 비교해 고르려면 선택 로직 변경(본문 phase·yearsLeft도 바뀜)이라 이번에는 그대로 두었다.
