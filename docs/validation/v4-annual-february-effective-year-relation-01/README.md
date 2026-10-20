# V4 Annual February Effective Year Relation 01

기준 SHA `f87470ee745ee7b62d49cc7b14f9a2edc74065da`, 브랜치 `v4/annual-february-effective-year-relation-01`.

2월 원본 Source의 실효 연주·입춘 경계와 원래 천간 관계 선언의 기간별 적용 가능성을 연결했다. 기술 월 계약 **7/12 → 8/12**, 기준 Annual 내부 후보 **31 → 35**, 신규 월 후보 **4개**, 구간별 Typed Binding **8개**다. 보충 H2025는 기준 7입력 집계에서 제외한다.

## Source와 계산의 경계

- 원본 `src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`, `ANNUAL_MONTH_MATRIX[1]`, `afpr:month-slot:02`.
- Record SHA256 `757b56db6d32f93f0a35671827024b3a9fc53a2cb8440069eed005f55cc8b11b`.
- File SHA256 `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`.
- Source version `6d471db103d53dd9165e4832744501a686e59edc`.
- 원본 요구: `selectedYear + actual civil month bounds`, `every canonical segment`, `effective annual before/after + annualStemRelations validity`.

원래 `annualNarrativeEvidence`는 명목 연간으로 `annualStemRelations`를 선언한다. 기존 `STEM_COMBINATIONS`의 원본 테이블 및 Producer/Calendar/Natal/Graph 코드 7개 파일 해시를 매 평가마다 검증한다. 원래 입력과 clock으로 Producer를 재실행해 전체 원본 결과와 선언 목록을 대조한다. Producer에 별도 원본 버전 필드가 없으므로 확인한 코드 파일 SHA를 내용 주소 버전으로 명시했다. 연구의 원래 commit 버전이나 기존 Graph Producer 버전을 바꾸지 않았다.

`annual-effective-stem-relation-v1`은 **Source 선언의 적용 범위 기록**이다. Graph에 전용 연간 천간 관계 Node가 없으므로 `calculatedRelationFactVerified=false`, `graphRelationNodeId=null`을 타입에 고정했다. Witness ID는 새 계산 Evidence ID/Fact Root가 아니다. 기존 `validateNominalStemRelation`의 `NO_DEDICATED_SEGMENT_STEM_RELATION_GRAPH_ID` 경고를 그대로 보존했다. 전용 계산 관계 Fact를 요구하는 후속 사용은 계속 미해결이다. 이번 원본 요구의 선언 유효성은 별도 Source Precondition으로만 충족하며, Witness를 Binder Fact로 제출하지 않는다.

## 실제 원본 입력과 입춘 전후

| 입력 | 집계 | 입춘 KST | 명목 연주 | 직전 실효 연주 | 정각 이후 실효 연주 | 원래 선언 | 구간 수 |
|---|---|---|---|---|---|---:|---:|
| fixture-annual-A | 기준 | 2026-02-04T05:02:08+09:00 | 丙午 | 乙巳 | 丙午 | 0 | 2 |
| fixture-annual-F | 기준 | 2026-02-04T05:02:08+09:00 | 丙午 | 乙巳 | 丙午 | 0 | 2 |
| fixture-annual-C2028 | 기준 | 2028-02-04T16:31:13+09:00 | 戊申 | 丁未 | 戊申 | 0 | 2 |
| fixture-annual-ranged-transition | 기준 | 2027-02-04T10:46:18+09:00 | 丁未 | 丙午 | 丁未 | 0 | 2 |
| fixture-annual-H2025 | 보충 | 2025-02-03T23:10:28+09:00 | 乙巳 | 甲辰 | 乙巳 | 1 | 2 |

원래 `getAnnualJieBoundaries`와 `validateJieCalendar`를 재사용해 직전·정각·직후 값을 대조했다. 기존 `[start,endExclusive)` 정책을 보존하며 실제 모든 구간을 검사한다. 입춘이 포함된 새 구간은 정각부터 적용된다. 시각·연주·월주를 입력이나 연도 간 상수로 재사용하지 않는다.

**fixture-annual-H2025 실제 선언** (보충=True):

- 원국 `year`의 `庚` ↔ 명목 연간 `乙`, `천간합`, 원본 Source References `["saju/constants:STEM_COMBINATIONS", "natal:year:stem", "annual:2025:stem"]`.
- `2025-02-01T00:00:00+09:00 → 2025-02-03T23:10:28+09:00`: NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT.
- `2025-02-03T23:10:28+09:00 → 2025-03-01T00:00:00+09:00`: APPLICABLE_VERIFIED_DECLARATION_SCOPE.

기준 입력에서 실제 빈 선언 목록은 `NO_ORIGINAL_RELATION_DECLARATION`으로 기록했다. 이는 관계가 존재한다는 증거나 모든 가능한 관계의 부정이 아니다. 시간 미상 입력에서 시주나 Hour Relation을 만들지 않았다. 명목 연간과 다른 실효 연간이 가질 수 있는 미생성 관계도 계산·추측하지 않았다. Source/주소 검증 실패는 `SOURCE_OR_ADDRESS_UNVERIFIED`, 필수 참가자 부족은 `WITHHELD_UNKNOWN_CONTEXT`로 구분한다.

## 실제 Native Binder

기존 April → Comparison → October → Month Matrix → Native Binding → Actual 체인을 그대로 호출한다. `AnnualSpecialistIndex`, `ActualBindingIndex`, `annualRoleSelector`, `bindKnowledgeCandidate`를 재사용한다. 각 Typed Receipt는 원래 한 구간의 Boundary·Month Pillar·Effective Annual **3개 노드만** 선택한다. Natal 참가자 Source와 선언 적용 Witness는 별도 Source Precondition이며 관계 노드로 위장하지 않는다. 입춘 전후 구간을 합친 부정 테스트에서 기존 `TIME_INTERSECTION=FAIL / NO_TIME_INTERSECTION`을 확인했다.

기존 Source Groups, Counterexamples, Prohibitions, Required Context, Unresolved Conditions, null Meaning/Claim Identity와 12 Hard Gate의 순서·비기술 상태 및 사유를 보존했다. 기술 5 Gate만 원래 Fact에 따라 검증한다. Source Integrity FAIL 30, Meaning REVIEW_REQUIRED, Product UNKNOWN, Customer PENDING을 유지한다. 고객 Claim/Approval/Reader Bridge/Planner 배정, 새 독립 Fact/Root는 모두 0이다.

## 보존과 테스트

- 신규 테스트 파일 전체 **33 PASS / 0 FAIL**. 기존 파일 삭제/skip/timeout 증가는 없다. 초기 실행의 신규 Selector 인자 오류로 hook이 실패해 33개가 실행되지 않았고, 신규 코드만 수정한 후 전체 파일을 재실행했다. 초기 오프라인 CommonJS 로더의 exports 이름 충돌도 신규 변수명만 수정했다. 초기 TypeScript 신규 진단 5개는 해결했고 최종 strict 진단은 0이다. 실패 로그를 외부 경로에 남겼다.

- 기존 관련 **23개 파일**: 1417 PASS / 3 FAIL / 0 pending. **전체 저장소 Suite는 실행하지 않았다.**

- 정확한 Base의 보호 Hash 파일 2개: 149 PASS / 2 FAIL. October 부정 사례 별도 재현: 0 PASS / 1 FAIL, 나머지 37개는 -t 필터로 미실행.

Base 보호 Hash 2개 파일은 서로 다른 순차 실행 결과를 정확히 합산했으며, 첫 Base 실행의 추가 Actual Calculation Bridge 58 PASS는 이 149/2 집계에서 제외했다.

- 기존 결과 `annualFortuneSpecialistEngine.test.ts` — `preserves all 4509 existing tracked files including Writer, Books and research`. 상세 원문과 Base 비교는 외부 `baseline-failure-comparison.json`.

- 기존 결과 `annualOctoberFocus.test.ts` — `rejects forged input clocks and focus before issuing an authentic context`. 상세 원문과 Base 비교는 외부 `baseline-failure-comparison.json`.

- 기존 결과 `majorFortuneSpecialistEngine.test.ts` — `X preserves every original research/runtime/Book source byte`. 상세 원문과 Base 비교는 외부 `baseline-failure-comparison.json`.

- 원본 422 Typed Units / 164 Withheld / 703 Receipt / 기존 후보 33개(Annual31+Major2)의 ID·전체 Hash 불변. Graph·계산·Fact Handoff·Native 진단 digest 불변. unmatched 396→396, Typed root 246 불변.
- Book 17개·digest 102개와 저장/재열람 roundtrip 불변. Publication Safety 39개 = 32 SAFE_OFFLINE / 7 WITHHELD 불변.
- 원본 6,456개 파일 SHA256 일치, 누락·변경 0. 기능 소스 신규 2개, 기존 계산/연구/Writer/Book/Reader/Planner/UI/운영 파일 수정 0.
- Runtime AST 46 roots / 700 modules의 모든 연결·진입점이 이전 보고서와 같다. 이전 digest 형식 차이는 정확한 Base를 동일 기존 helper로 재측정해 비교했다. 양쪽 helper digest `06686f4615ebce6815a5310019c7f03e4c8060428919786476744d62cb152b67` 일치. 초기 형식 비교 로그도 보존했다.

## 지속 환경

기존 Worktree 76개(지속 15, 임시 61), 원본 Dirty 11개와 Git 기존 파일 바이트, 포렌식 915개 hash/mtime를 보존했다. 새 영구 Worktree만 추가했다. Git branch/worktree 등록·index·objects·ref/reflog와 push 후 upstream 설정은 의도된 Metadata 변경이며 Metadata 변경 0을 주장하지 않는다. 과거 ignored/unrecorded 임시 자료의 무손실은 UNVERIFIED다. 기존 임시 Worktree 복구·삭제·정리는 하지 않았다.

## 검증 산출물 및 후속 경계

요청된 Source proof, Applicability witnesses, Native coverage, handoff JSON을 같은 디렉터리에 보관했다. Witness Source Proof는 동일 내용의 중복을 줄이기 위해 별도 맵을 참조하며, 참조를 다시 삽입하면 원래 typed witness가 복원된다. 대형 원본 Receipt 703개와 고객 데이터는 중복 저장하지 않았다.

외부 실측 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-february-effective-year-relation-01/`. commit/push 후 정확한 SHA·원격 일치·Vercel Preview 상태는 외부 `git-preview-receipt.json`, `FINAL-RESULT.json`에 기록한다. 보고서 자체의 순환 SHA를 만들지 않는다. Preview READY는 빌드 검증이며 의미·상품·고객 사용 승인이 아니다.

남은 월 Source 계약 01/06/08/11, 전용 stem Relation Graph 주소 부재, 기존 Source FAIL 30, monthly ten-god 역할 모호성 10개, Meaning/Product/Customer 승인 보류, 기존 보호 Hash 실패 2개와 October 5000ms timeout, 과거 미기록 임시 자료의 불확실성을 후속 목록에 남긴다. 다음 구현은 새 지시가 있을 때만 진행한다. master/Production/DB/결제/Auth/Worker/환경설정은 변경하지 않았다.


## 최종 빌드와 패키징

보고서 포함 Webpack Production Build PASS, 경고 0. NFT 90개(앱 route 88개 + 공통 2개)의 실제 소스/외부 의존 경로가 Base와 동일하며, 생성된 .next 내부 산출물만 비교에서 제외했다. 신규 2월 모듈/CLI/보고서의 Runtime/NFT 연결 0. 빌드 후 strict TypeScript 진단 0, 전체 ESLint --max-warnings=0 PASS. 원본 기존 파일 6,456개 누락·변경 0. 최종 Git 범위는 commit 전 별도로 확인한다.

첫 NFT 비교에서는 신규 Worktree의 node_modules 전체 symlink 때문에 의존 경로가 달랐다. 신규 링크만 제거하고 정확한 Base node_modules를 APFS copy-on-write로 복제해 같은 배치에서 재빌드했다. package/lockfile/환경설정 변경·패키지 설치는 0이다. 초기 공유·Base·최종 로컬의 핵심 TypeScript/Vitest/Vite/Runner/Next/만세력 모듈 바이트가 같고, 최종 NFT 90개가 일치했다. 초기 실패 로그와 별도 환경 비교 증거를 외부 경로에 보존했다.
