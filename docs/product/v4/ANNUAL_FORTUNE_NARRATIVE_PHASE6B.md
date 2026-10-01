# Annual V4 Narrative — Phase 6B

Base: `00bdf259030d41604902cdb1475bce35ce86d40f` · branch: `v4/rebuild`

## 범위와 연결

| 항목 | 구현 / 유지 |
|---|---|
| 진입점 | `composeAnnualFortuneNarrative(payload, { currentDate, policyDate? })` |
| 입력 | 기존 `normalizeReportInputPayload`, 명시적 날짜를 전달 |
| 실제 생성 | 기존 `generateAnnualFortuneProductDraft`, `writer.enabled: false` |
| 계산 | 기존 `calculateAnnualFortuneSaju`, selected-year/CustomerDayun/annual evidence 그대로 |
| 월운 | `annual-month-jie-kst-v2`의 12 civil month와 모든 실제 segment 보존 |
| 월별 확장 | 기존 `extendAnnualMonthEvidence` 그대로; V4는 읽기용 gate만 추가 |
| 명리·MBTI | 기존 `buildMyeongliMaterialPacket`과 검증된 Fusion만 사용 |
| 출력 | 고객 전문 + structured narrative/evidence/months/provenance/completeness/QA packet |
| 비연결 | UI, route, publish/persist, 결제, DB, OpenAI, Production 연결 없음 |

새 역법·세운·월운·대운 계산, 원국 변경, V3 runtime 변경은 없다. 기존 V4 파일도 수정하지 않았다.

### 추가 파일

- `annualEvidence.ts`: 기존 생성 경로 연결, clock, focus segment, 대운 교차, transit gate.
- `annualComposer.ts`: opening / 대운 교차 / 연간 좋은 패 / 관계 / 12개월 / 결말.
- `annualMonthNarrative.ts`: 실제 십성과 transit 근거 선택, 직무 장면, 관계, Fusion 행동.
- `annualStories.ts`: 십성별 두 발현과 지원 transit의 고객 문장.
- `annualRealization.ts`: 의미별 회고/전망 문장, 상태별 고객 제목.
- `annualFixtures.ts`, `annualDiscovery.test.ts`, `annualNarrative.test.ts`, `annualSafety.test.ts`.

## 시간·선택 연도 계약

- `currentDate`: timezone이 있는 ISO instant 필수. ambient `Date.now()`로 읽기 시제를 정하지 않는다.
- KST 기준 선택 연도/현재 월 비교. 과거 선택 연도는 12개 모두 회고, 미래는 12개 모두 전망.
- 현재 연도: 지난 달은 회고, 현재 달은 지금, 남은 달은 전망.
- 현재 달은 **실제 현재 segment**를 읽는다. 다른 달은 기존 V3와 같이 첫 Jie segment를 중심으로 한 이야기를 쓴다.
- 현재 달의 절입이 아직 오지 않았다면 다음 흐름을 짧게 덧붙인다. 원국 신살을 월운으로 복사하지 않는다.
- raw segment의 시작/끝, effectiveAnnualPillar, 교운 후보·불확실성, 모든 relation IDs는 보존한다.
- 지난 달은 경험을 묻는 회고 틀로 읽으며 실제 사건을 확정하지 않는다. 현재 입력 직업을 과거 직업이었다고 가정하지 않는다.

### 미래 fixture와 판매 정책은 별개

기존 판매 입력은 기준 날짜보다 미래인 연도를 받지 않는다. 이 정책은 변경하지 않았다.
미래 2건은 **로컬 검수용 `policyDate`를 명시한 기존 생성 경로 시뮬레이션**이다. `currentDate`는 여전히 2026-10-01이다.
별도 policyDate 없이 미래 연도를 요청하면 기존 canonical validation에서 거절된다.
V3 wrapper는 입력 정규화 시 ambient commerce date를 사용하므로, V4는 clock을 전달할 수 있는 기존 하위 generation entry를 재사용한다. 테스트에서만 V3와의 비교용 Date를 고정한다.

## 대운 × 세운

| 실제 근거 | 서사 연결 |
|---|---|
| 기존 `annualFortuneReading.crossPeriods` | 입춘 및 실제 교운 경계별 구간; 1월의 이전 세운도 유지 |
| 일간 → 해당 대운/세운 천간의 기존 십성 계산 | 각 기간의 생활 주제 |
| 대운 천간 → 세운 천간의 기존 `getTenGodForStemPair` | 같은 방향 / 대운이 세운에 재료 제공 / 세운이 대운을 받침 / 기준으로 다룸 / 익숙한 방식에 압박 |
| 기존 `getBranchPairRelations` | 교차의 실제 지지 관계도 내부 packet에 유지 |
| 교운 `transition_uncertain` | 후보 중 하나를 현재 확정 대운·강한 결론으로 승격하지 않음 |
| 천간합 | 기존 `STEM_COMBINATIONS`의 실제 원국-세운 pair projection. 불확실한 시주는 제외 |

위 다섯 방향은 읽기 위한 의미 연결이지, 신강약·격국·길흉 점수를 새로 계산한 것이 아니다.

예: 서진 2026, 정재 대운 × 식신 세운 → 결과물을 반복되는 수입·생활의 기반으로 남기는 흐름.

> 한 해의 손으로 만들어 남기는 결과가 더 긴 목표인 반복되는 수입과 생활의 축적을 받쳐줄 수 있습니다.

서윤 2028: 4월 23일 21:42 KST 실제 교운. 이전 편재 주제(바깥 기회/거래)에서 이후 상관 주제(다른 답/표현)로 바뀐다. 연간 교차 구간과 4월 본문 둘 다 반영한다. 정확한 시각은 내부에만 둔다.

## 월별 선택·반복 방지

- 월간 십성을 기본 주제로 읽고, 같은 발현이 두 번 사용되면 실제 월지 본기 십성도 후보로 본다. 없는 십성은 만들지 않는다.
- 같은 십성의 첫 발현/다음 발현: 시작 vs 경계, 함께 시작 vs 몫, 첫 결과 vs 재현, 오류 발견 vs 전달 등.
- 업무 장면은 기존 Career Context/`majorContext`/`majorSceneDetail`의 function → mode 기준 재사용.
- 배우는 달, 도움을 받는 달, 독립/협업 달은 문단 순서가 다르다. 문장을 삭제하는 중복 제거기는 없다.
- transit 좋은 패는 실제 관측만 사용하며 report 안에서 같은 feature를 반복 주인공으로 쓰지 않는다.
- 제목의 주인공이 주된 십성 해석과 맞지 않으면 좋은 패는 보조 문단으로 남긴다.
- 명예/재물/자리/사람복/이동/학습/표현을 직접 말하되 사건·액수·결혼 등을 보장하지 않는다.
- 실제 일지 관계가 있는 월에 상태별 장면을 선택한다. 충/형/파/해/원진/합을 같은 문장으로 바꾸지 않는다.
- MBTI는 해당 월 주제와 semantic tag가 맞는 기존 Fusion만, 최대 3개. `TYPE는` 반복 없음. unknown은 0개이며 본문을 축소하지 않는다.
- 월 순위/최고·최악/점수/등급 없음. 숫자 월, 해, 고객에게 필요한 교운 날짜만 표시.

### Transit gate

| 항목 | 처리 |
|---|---|
| canonical 월운 신살·귀인 / 원진 / 십이운성 | 실제 target와 anchor/sourceRefs 보존 |
| 망신살 두 규칙 | ambiguous로 held; 고객 hero/본문 제외 |
| 방합 및 producer 없는 귀인 | unsupported 유지, 자동 생성 안 함 |
| natal-only rule | 기존 extension의 unsupported 사유 보존 |
| 동일 alias / 여러 natal anchor | 고객 feature는 병합하되 observations와 refs 전부 보존 |
| conditional 교운 관계 | 내부 보존, 확정 relation copy의 근거로 사용하지 않음 |
| 기존 원국 material | natal strength/Fusion에만 사용; 월운 귀인으로 복사하지 않음 |

## 6개 전문 검수

읽기 기준: `2026-10-01T12:00:00+09:00`. 6개 전문의 opening부터 final line까지 직접 읽고 제목/본문 불일치, 조사, 동일 꼬리, 관계 장면 누락을 수정한 뒤 변경 문단을 재검수했다.

| Fixture | 선택 연도 / 시제 | 주된 연간 결 | 최종 판단 |
|---|---|---|---|
| 도윤 / INFJ / 온라인 교육사업 대표 / 기혼 | 2026 / 현재 | 책임·리더십·명예, 깊은 이해를 운영에 쓰기 | No issue |
| 서진 / ENTJ / B2B SaaS 영업기획 / 연애 | 2026 / 현재 | 식신 결과물 + 정재 기반, 실력의 값을 남기기 | No issue |
| 서윤 / ENFP / 브랜드 디자이너 / 솔로 | 2028 / 미래 | 자기 선택·표현, 실제 4월 교운 | Minor |
| 하린 / ESTP / 체육 전공 학생 / 썸 | 2027 / 미래 | 신뢰·역할 + 배움, 경험하면서 익히기 | Minor |
| 준서 / MBTI unknown / 휴식·이직 준비 / 미선택 | 2025 / 과거 | 탐구·재정비·사람과의 연결 | No issue |
| 나영 / INTP / 제조업 재무기획 과장 / 결혼 준비 | 2026 / 현재 | 기회와 재물, 축적과 현실 판단 | No issue |

**Blocker 0 / Major 0 / Minor 2 / No issue 4** — 수동 판정이며 자동 지표와 구분한다.

남은 Minor:

1. 서윤: 월별 마감·작업 범위는 구체적이나 검증된 ENFP Fusion은 1개뿐이다. 억지 매칭 대신 유지했다. 공통 십성 설명이 다른 report와 겹치는 구간은 다음 전상품 audit에서 더 개인화할 여지가 있다.
2. 하린: 학생/첫 경험은 맞지만 체육 전공 특유의 실습 감각은 일반 학생 장면보다 더 깊게 쓸 여지가 있다. 이번에 별도 직업 사전을 늘리지는 않았다.

### 대표 opening / 좋은 패 / 행동

- 서진: “계획을 더 세우기보다 이미 가진 솜씨를 눈앞의 결과로 꺼내는 쪽이 강한 해입니다.”
- 도윤: “압박 속에서 판단을 내리는 리더십과 자리운이 좋은 힘입니다.”
- 돈: “남겨둔 돈은 통장의 숫자만이 아니라 급한 선택을 하지 않을 여유입니다.”
- 귀인: “사람복을 써볼 만한 달입니다. 막힌 곳을 정확히 이야기하면 경험 있는 사람의 한마디가 혼자 보지 못한 길을 열어줄 여지가 있어요.”
- ENTJ: “고치고 싶은 마음이 큰 달에는 상대의 설명이 끝나기 전에 이미 다음 답을 준비하고 있을 수 있어요.”
- INFJ: 대화 뒤 남은 뜻을 혼자 깊게 되짚기 / 함께 살아도 조용해질 틈.
- ENFP: 떨어져 있던 경험을 관심사에 연결해 배움·아이디어로 쓰기.
- INTP: 납득한 뒤 움직이는 탐구 / 압박을 배워야 할 질문으로 전환.
- 관계: 원진은 한마디 복기, 충은 결정 속도, 형은 반복되는 생활 기준으로 구분. 현재 배우자·연인 등의 상태를 임의 생성하지 않는다.

### 서진 2026의 12개월 제목

1. 막힌 일을 함께 볼 좋은 사람을 찾을 때
2. 다들 망설일 때 내 판단이 필요해집니다
3. 내가 한 일을 사람들 앞에 놓아볼 때
4. 남들은 넘겼는데 나는 아직 그게 궁금합니다
5. 알고 있던 것을 쉽게 말할 때 내 값이 보입니다
6. 일 밖의 작은 취향이 더 가깝게 느껴지는 달
7. 해온 일을 다음 역할의 근거로 꺼낼 때
8. 회사 밖에서 내 경험의 다른 값을 듣습니다
9. ‘원래 이래요’라는 말로는 납득이 안 됩니다
10. 맞는 말인데 왜 표정이 굳었을까요 — 현재 절입 전, 초순 이후 편재 흐름 별도 안내
11. 안 쓰는 것도 아끼는 것도, 내가 편해야 의미가 있습니다
12. 해결할 수 있다는 이유로 전부 맡아야 할까요

## Completeness / counterfactual

| 검증 | 결과 |
|---|---|
| 각 12개월 | 6/6, 총 72/72 |
| opening / Dayun cross / fortune / final | 6/6 |
| 모든 month refs 및 segment 연속/순서 | PASS |
| 12 Jie 직전 1ms / 정확한 instant | 24개 시점에서 canonical focus 일치 |
| 입춘 이전 effective annual | 이전 해 유지 |
| 실제 교운 전후 | 2028-04-23T21:42:00+09:00 경계 그대로 |
| 각 전문 exact sentence / long-span / scene-family guard | 0건 |
| 6개 headline / final line | 각각 중복 0 |
| MBTI 전체 / jobStatus 전체 | runtime 및 계산 유지, unknown Fusion 0 |
| exact / approximate / unknown | 기존 validation·precision·교운 계약 유지; 기존 거절을 임의 승인하지 않음 |

Counterfactual:

- 같은 서진 원국, ENTJ → INTP: calendar/month evidence 동일. 보상·빠른 수정·리더십에서 4월의 납득·탐구로 행동 장면 변경. 연간 운의 첫 문장/결말을 MBTI만으로 바꾸지는 않는다.
- 같은 ENTJ, 서진 → 도윤 원국: 식신 → 편관 연간 주제 및 월별 십성/좋은 패 변경.
- 같은 서진, 2025 → 2026: 겁재의 협업·나눌 몫 → 식신의 결과물. opening / 월별 주제·장면 / final 실제 변경.

### 반복 진단의 한계도 기록

각 전문의 중복 0과 **서로 다른 전문 사이의 문장 중복 0은 다르다**. 후자는 이번 결과에서 달성하지 않았다.
6개를 합친 shared-guard 진단에는 공통 material 문장 재사용 467건, 12어절 span 재사용 182건이 있다. 72개 월 제목 중 42개가 고유하다.
이번 요청의 개별 전문 반복 gate 및 cohort headline/final gate는 통과했지만, 전상품 editorial audit에서는 이 공유 문장 비율도 줄이는 것을 검토해야 한다. 이를 숨기려고 문장을 삭제하거나 검사를 완화하지 않았다.

## 출력과 재현

`/tmp/gyeol-v4-phase6b/`:

- `01-business.md` … `06-transition.md`: 전체 고객 텍스트, 약 7,765–8,593자. 분량은 참고이지 품질 KPI가 아니다.
- 같은 이름 `.json`: narrative + canonical evidence + 실제 refs + guard 결과.
- `index.md`, `counterfactual.json`, `evidence-summary.json`, `cohort-qa.json`, `major-baseline.json`.

```sh
V4_PHASE6B_EXPORT=1 pnpm test tests/unit/interpretation-v4/annualDiscovery.test.ts tests/unit/interpretation-v4/annualNarrative.test.ts tests/unit/interpretation-v4/annualSafety.test.ts
```

## 검증

- Annual 전용: **29 PASS / 0 FAIL**.
- V4 + V3 + saju/report-knowledge/report-tables + Annual generation/validation/Jie/month relations + paid completeness 관련 회귀: **2,920 PASS / 0 FAIL (150 files)**.
- 기존 V4 Comprehensive 12 / Career 8 / Love 8 / Compatibility 8 / Major 6, 총 **42개 output SHA-256 고정 회귀** 유지.
- lint PASS. build PASS (writer/reliability 비활성 로컬 빌드; `.env` 파일 변경 없음).
- 전체 `tsc --noEmit`: 기존 진단 389개와 동일, **새 진단 0**. 전체 typecheck가 clean이라고 보고하지 않는다.
- diff-check PASS. 보호 파일 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 변경·stage 대상 아님.
- UI/신규 route 미연결이므로 새 화면 SSR/hydration·브라우저 검수는 대상 아님. 기존 paid-delivery 회귀는 실행했다.

## 다음 전상품 audit 후보 — 이번에는 시작하지 않음

- 공통 십성 문장을 원국 강약·실제 분야·연간/월간 교차에 따라 추가 변주.
- MBTI 1개만 성립하는 사례의 의미 있는 보조 행동 재료 보강; 무관한 trait를 억지로 붙이지 않기.
- 학생·휴식의 업종/경험 표현을 늘리되 직업명 사전 폭증 금지.
- 6상품에서 같은 positive sentence가 반복되는지 cohort 기준 비교.
- 각자의 provenance와 계산 경계를 보존한 상태에서만 차후 UI 논의.

Phase 6B에서 STOP. master merge / Production integration / UI 시작하지 않는다.
