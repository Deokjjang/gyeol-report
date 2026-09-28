# 종합 V3.1 · Phase 2B 검토

기준: 2026-09-28, 브랜치 `v3/rebuild`, 이전 V3 커밋 `2e13ed9`. 종합의 명시적 V3 요청만 개선했습니다. 길이를 줄이는 것을 성공 지표로 사용하지 않습니다.

## 경계와 호환성

- Common Core의 계산·registry·MBTI pair DB·ranking 엔진은 그대로입니다. 종합 전용 composition/editorial과 renderer, canonical 약함 label을 읽는 종합 adapter만 변경했습니다.
- 새 콘텐츠 버전: `comprehensive_v3.1-enriched.1`. 저장된 `comprehensive_v3.1`은 동결한 기존 composer와 기존 view로 검증·표시합니다.
- 기존 A–E V3 draft 전체 SHA-256이 기준과 같고 publish/SSR PASS입니다. 기존 실제 저장 A URL도 정상 표시됩니다.
- V2 6상품의 draft/evidence/SSR golden hash가 그대로이며 다른 5상품은 명시적 V3 옵션을 줘도 바뀌지 않습니다. 기본 생성/paid worker는 여전히 기존 V2 경로입니다.
- 시각 불명/근사 evidence에는 새 확정형 해석을 붙이지 않고 기존 보수적 V3 처리를 유지합니다.
- publication은 canonical facts와 evidence refs를 재구성하고 결정적 문구 전체를 비교합니다. 임의 본문·생활 아이디어·근거 정밀도 변조는 발행 거부됩니다.
- OpenAI/Toss/Production/Supabase/Vercel 접근·호출 0. 로컬 preview memory만 사용했으며 실제 생성 6건 모두 externalCallCount=0입니다. 결제/DB/정책/배포 설정 변경은 없습니다.

## 읽기 구조와 내용

제목 → 만세력 기본 접힘 → 겉글자 오행 5칸과 지장간 포함 수치 즉시 노출 → MBTI 기본 접힘 → 통합 명리 기운표 → 목차 → 핵심 결과 본문 순서입니다.

통합표는 **기운 / 쉽게 말하면 / 나에게 쓰이는 힘**의 3열이며 실제 계산된 고유 표식만 한 행씩 표시합니다. 대표 A는 25행입니다. 기존 원국 표식 목록의 중복 출력은 제거했습니다. 기둥 위치·연지/일지 기준·원국 합충·구조 근거는 통합표 안의 “계산 기준 자세히 보기”로 옮겼습니다. 기존 만세력의 지장간·십이운성 등 전문 정보는 유지합니다.

핵심 결은 4문단 서사입니다. A의 정관·장성·ENTJ 책임/실행, 정축의 작은 불씨와 화개·편인의 내면, 천을귀인의 도움, 직장인 맥락을 연결합니다. 근거는 문단마다 반복하지 않고 한 줄로 모았습니다.

- 좋은 패: 이미지/뜻 → 이미 가진 힘 → 구체적 사용법. A는 천을·반안·장성·재고·천문 5개입니다. 풍부한 좋은 표식이 적은 F에는 실제 십성의 힘을 쓰고 귀인을 만들지 않았습니다.
- 형식: 핵심 결은 서사, 좋은 패는 이미지와 사용법, 일/돈은 전략과 선택 기준, 관계/사랑은 해석과 약속, 오행은 생활 선택지, 위험 패턴은 강점/과용/중단법입니다. 항목마다 질문을 붙이지 않습니다.
- MBTI: 이름만 붙이지 않고 실제 trait + 매칭된 명리 compound 조건을 요구합니다. A는 책임/리더십, 화개·편인의 혼자 생각하기와 Te–Ni, 겁재·식신과 빠른 처리, 관살과 일/가정 과몰입, 가까운 관계의 운영 방식 등 5개 장면입니다.
- 관계: 화개·고신의 내면 거리, 역마·망신의 접점/노출, 귀인의 도움 경계를 사용합니다. 사랑은 실제 일지/배우자궁·확인된 재관/식상·MBTI·관계 상태를 함께 읽습니다. D의 도화+홍염은 사랑 본문에서 별도 활용하며 없는 A에는 만들지 않습니다.
- 돈: 편재·정재, 역마와 외부 기회, 결과물/교환, 경쟁/공동 자원을 하나의 전략으로 묶습니다. 직장인은 성과→보상→협상→축적, 사업가는 제안→계약→정산→반복 거래, 프리랜서는 견적→납품→정산→재사용으로 달라집니다.
- 위험 패턴: 같은 문제를 가리키는 근거를 묶어 A는 4개, 나머지는 3개입니다. 5개를 억지로 채우지 않습니다.
- 마지막 지침: 4문단, 446–484자. 키울 것/내려놓을 것, 좋은 힘의 활용, 일·돈·사람의 우선순위, 현재 상황에서의 첫 행동을 남깁니다. 앞 문단을 그대로 복사하지 않습니다.

명리 이미지는 기존 taxonomy/day-pillar knowledge의 뜻을 현대적 장면으로 풀었습니다. 근거 없는 유래·미래 사건 확정·공포 문구를 추가하지 않았습니다.

## 금 보완 누락 원인과 수정

대표 A의 canonical 결과는 겉글자 금 0, 지장간 포함 금 0.2, label `METAL_WEAK`입니다. 기존 V3 adapter는 `MISSING/STRONG`만 본문 evidence로 받아 `WEAK`가 누락됐습니다.

종합 adapter가 기존의 versioned `*_WEAK` label을 정확한 출생시각에서 읽도록 했습니다. 문턱값·지장간·계산식은 바꾸지 않았습니다. A는 금 “없음”이 아니라 “약함”으로 표시하며 가벼운 웨이트, 정리/비우기, 숫자 기록, 할 일/하지 않을 일 구분을 제안합니다. 목의 약함도 보완하고 화/수의 강함은 더 채우지 않고 과열/과잉 조절로 안내합니다. 각 대상에 3–4개 생활 선택지를 제공합니다.

## 선택 추적

전체 registry 195행을 [선택 추적표](COMPREHENSIVE_SELECTION_TRACE.md)에 내보냈습니다. A에서 27개 registry 항목이 관측됐고 22개는 본문/패턴, 5개는 전문표에 남았습니다. 나머지 168개는 이번 원국에 없는 항목입니다. 약함 label과 raw 사실은 registry feature 수와 별개로 추적합니다.

| 실제 근거 | 선택 위치/이유 |
|---|---|
| 백호대살·양인 | 각각 긴급 책임/날카로운 판단의 복합 위험 패턴 |
| 역마 | 편재와 돈의 외부 접점, 사람 관계, 움직임의 과용 |
| 장성 | 핵심 결·좋은 패·일·책임 패턴 |
| 반안 | 이름이 걸린 역할/인정의 좋은 패 |
| 천을 | 핵심 결·좋은 패·도움을 주고받는 관계 |
| 천덕 | 통합표 보존; 상위 5개와 도움 의미 중복으로 본문 미승격 |
| 화개 | 핵심 결의 모순·내면 거리·MBTI 탐구 fusion·과도한 숙성 |
| 재고 | 축적/재사용의 좋은 패 |
| 천문 | 패턴/큰 구조의 좋은 패·생각의 출구 |
| 고신 | 실제 native 근거로 관계의 거리와 내면 패턴; 고독 운명 예언 없음 |

## V2 / V3 / V3.1 대표 A 비교

| 항목 | V2 | V3 before | V3.1 |
|---|---:|---:|---:|
| 고객 본문 문자량 | 17,814 | 4,168 | 9,189 |
| 40자 이상 동일 문장 재등장 | 9 | 0 | 0 |
| 질문 수 | 5 | 13 | 0 |
| 고유 compound | 0 | 7 | 12 |
| 의미 있는 MBTI fusion | 3 | 2 | 5 |
| 좋은 표식의 사용 지침 | 3 | 6 | 6 |
| context-specific directives | 0 | 4 | 4 |
| 고유 명리 feature 사용 | 18 | 15 | 20 |
| 안전 filler | 3 | 0 | 0 |
| hedge 표현 | 63 | 0 | 0 |

측정 정의:

- 문자량은 동일 A의 실제 1440px 고객 DOM에서 `[data-reading-section]` 텍스트를 합친 값입니다. 제목/목차/접힌 기술 표는 제외하고 V2의 표식/행동 본문은 포함합니다. 초기 article 전체는 18,457 / 4,324 / 9,503자입니다. 모든 전문 층까지 펼친 V3.1 export는 14,662자입니다.
- 긴 반복은 문장부호/줄바꿈으로 나누고 공백을 정규화한 40자 이상 문장의 첫 출현 이후 횟수입니다. hedge는 “수 있습니다” 등을 포함한 동일 패턴, 안전 filler는 기존 사건/질병/수익 확정 부인 패턴입니다. 접힌 원문 전문 설명의 완곡 표현은 본문 KPI에 넣지 않았습니다.
- compound는 고유 조합 ID입니다. 돈의 통합 블록 내부 ID와 fusion의 명리 compound를 포함하고 같은 요약 재등장은 제외합니다. V2는 narrativePlan의 명리 근거 2개 이상 theme 기준입니다. 일지+실제 십성을 관계 선택에 연결한 블록은 포함하되 새로운 명리 계산으로 취급하지 않습니다.
- MBTI fusion은 실제 명리와 MBTI trait를 함께 사용하는 고유 장면입니다. context와 요약 재사용, 유형 이름만 붙인 문장은 제외합니다.
- 좋은 표식은 귀인/장성/화개/천문 등 실제 긍정적 신살의 사용 지침입니다. V2의 practicalUse 표식은 천을·장성·재고, V3/V3.1은 장성·반안·천을·화개·재고·천문입니다. **수는 늘지 않았고, 좋은 패 전용 항목과 설명 깊이가 늘었습니다.** 이전 Phase 2 문서의 좁은 표식 집계와 정의가 다르므로 여기서는 세 버전에 같은 범주를 적용했습니다.
- 고유 feature는 본문과 위험 패턴의 일주/십성/신살/귀인을 canonical ID로 중복 제거합니다. 오행·raw 사실은 제외합니다. V2의 sajuTermsUsed와 feature chapter도 같은 ID로 정규화합니다. 새 테스트의 registry 수 22에는 오행 2개가 포함되어 이 비교의 20과 다릅니다.
- 기존 테스트에 남은 `legacyShapeComparison`은 Phase 2 블록 모양 기준 진단값입니다. 통합 전략/요약 블록을 고려하지 않으므로 이 비교에는 사용하지 않았습니다. 수치는 품질 점수나 분량 목표가 아닙니다.

## Fixture QA

| Fixture | 입력/특징 | export-helper 문자 | compound | fusion | 좋은 패 | 위험 패턴 | 최종 지침 문자 |
|---|---|---:|---:|---:|---:|---:|---:|
| A 가온 | 1996-12-06 09:30, ENTJ, 직장인/소프트웨어 기획, 귀인 여러 개·금 약함 | 9,114 | 12 | 5 | 5 | 4 | 484 |
| B 나래 | 1989-09-07 07:24, INFP, 프리랜서/브랜드 디자인 | 7,148 | 7 | 2 | 4 | 3 | 452 |
| C 다온 | 1984-06-15 14:20, ISTP, 사업가/제조 품질, 정재+편재 | 6,422 | 9 | 1 | 4 | 3 | 479 |
| D 라온 | 2003-03-22 18:10, ENFJ, 학생/콘텐츠 디자인, 도화+홍염 | 6,970 | 9 | 1 | 5 | 3 | 451 |
| E 마루 | 1999-11-02 05:45, MBTI 모름, 취준, 실제 수 없음 | 6,404 | 5 | 0 | 4 | 3 | 466 |
| F 이든 | 1992-02-08 15:30, ESTP, 프리랜서/외부 프로젝트 영업, 월·일 2곳 역마 | 4,923 | 8 | 1 | 3 | 3 | 446 |

모든 fixture: generate→publish→SSR PASS, 긴 반복 0, 질문 0, 본문 hedge 0, 안전 filler 0, unsupported evidence refs 0, copy guard의 사건 확정 표현 0. 도화/홍염 실제 fixture의 관계 활용과 없는 fixture의 미생성, MBTI 모름의 facts/fusion 0을 검사했습니다. F는 기존 계산의 서로 다른 2개 위치를 확인한 fixture이며 별칭을 강도로 가산하거나 새 숫자 점수를 만들지 않았습니다. F의 배움 장은 독립적으로 쓸 근거가 부족해 생략했습니다.

실제 localhost 6건의 390px 확인: 초기 만세력/MBTI 접힘, 오행 즉시 노출, 통합표 1개, 로딩 overlay 없음, 만세력 실제 버튼 동작/hydration, browser errors 0, horizontal overflow 0. 대표 A는 390/768/1440px의 기본 화면과 통합표/2차 계산 기준 펼침도 정상입니다. MBTI와 추가 선호지표/기능서열을 실제로 펼쳤고 모바일 핵심 결·마지막 지침을 시각 검수했습니다.

## 검증

```sh
V31_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3 tests/unit/api/createReportRoute.test.ts tests/unit/app/reports/completedReadingExperience.test.tsx tests/unit/report-generation/deterministicProductQuality.test.tsx tests/unit/persistence/paidReportLookupBoundary.test.ts --silent
pnpm lint
pnpm build
git diff --check
```

- 관련 테스트: **8파일 / 198 PASS**. V3 core만 **4파일 / 111 PASS**.
- 전체 테스트: **4,152 PASS / 기존 실패 3** (총 4,155, 368파일).
- 기존 실패: `legalPagesSource.test.ts`, `policyPagesSource.test.ts` 날짜 기대값, `compatibilityPreviewPageSource.test.ts` 제거된 scoreLabel 기대값. 범위 밖이므로 수정하지 않았습니다.
- lint/build/diff check PASS. build는 sandbox 대기 프로세스만 종료하고 같은 명령을 로컬 권한으로 재실행해 정상 완료했습니다.
- 전체 TypeScript 검사는 기존 test 진단 384개이며 src/V3 test 신규 진단은 0입니다. 전체 타입 검사를 clean이라고 보고하지 않습니다.
- Next.js 스킬에 따라 계산/validation을 서버에 유지하고 기존 client table만 재사용했습니다. 브라우저 스킬에 따라 실제 버튼·SSR/hydration·오류·화면을 확인했습니다.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 unrelated 상태 그대로 제외합니다.

## 사용자 검토

대표 A: http://127.0.0.1:3100/reports/report_jayqdb9jn3459

- B: http://127.0.0.1:3100/reports/report_lql27h32n4qu1
- C: http://127.0.0.1:3100/reports/report_16zfa2e6n00ql
- D: http://127.0.0.1:3100/reports/report_dk1k15zjpnegp
- E: http://127.0.0.1:3100/reports/report_z7clbebqhhbd7
- F: http://127.0.0.1:3100/reports/report_f1kd18lgu2ejc

[고객 화면 전체 텍스트](COMPREHENSIVE_V31_REVIEW.txt)는 만세력·MBTI·선호지표·통합표·2차 계산 기준·목차를 모두 펼친 실제 article에서 추출했습니다. 로컬 메모리 preview이므로 dev 서버를 재시작하면 URL은 사라집니다. 대표 V3.1 화면을 열어 두고 멈춥니다. 다른 상품은 시작하지 않습니다.
