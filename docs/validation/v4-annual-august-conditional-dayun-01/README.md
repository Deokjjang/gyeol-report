# V4-ANNUAL-AUGUST-CONDITIONAL-DAYUN-01

Base: `fed7afa83659b0879385bfbb663c647147d2b3f4`. Branch: `v4/annual-august-conditional-dayun-01`.

8월 기술 계약 완료. 기존 2월 Adapter를 진입점으로 재사용한다. 신규 핵심 소스는 `annual-august-dayun/contract.ts`, `adapter.ts` 2개이며 기존 계산·연구·Graph·Binder·이전 월·고객 Runtime 소스 변경은 0이다.

## 실제 계산과 판정

| 기준 Fixture | 8월 실제 Segment | 확정/조건부 | Binding | 내부 Candidate |
|---|---:|---|---:|---:|
| Annual A | 2 | 확정 2 | 2 | 1 |
| Annual F | 2 | 확정 2 | 2 | 1 |
| Annual C2028 | 2 | 확정 2 | 2 | 1 |
| Ranged Transition | 3 | 조건부 2, 확정 1 | 1 | 0 |
| 추가 첫 대운 이전 | 2 | before_first_cycle 2 | 0 | 0 |

기준 4 Annual Fixture는 9 Segment, 확정 7 / 불확정 2다. 추가 첫 대운 이전 Fixture 2 Segment는 기준 수에 합산하지 않는다. `NO_UNCERTAINTY_PRESENT_VERIFIED`는 별도의 uncertaintyVerificationState이며 확정 7구간과 첫 대운 이전 2구간에서 기록한다. Witness를 중복 집계하지 않는다.

실제 조건부 범위는 `2027-04-08T00:00:00+09:00` 이상 `2027-08-08T21:59:59+09:00` 미만이다. 己巳(2)와 戊辰(3)은 대안 후보이며 동시 활성 주기가 아니다. 8월 1일·입추·원본 latest로 나뉜 3구간과 원본 범위를 그대로 보존했다. 이후 구간의 활성 주기는 Producer가 판정한다. 최초 대운 전에는 이전 주기를 만들지 않는다. Witness의 최상위 earliest/latest는 해당 Segment의 transitionRange만 나타내며, 확정 주기의 원본 시작 시각·동일한 earliest/latest는 originalCandidateCycles 안에서 보존한다. C2028의 원래 확정 전환 `2028-04-23T21:42:00+09:00`도 재생성 결과와 Base 해시가 같다.

`CONDITIONAL_RANGE_SOURCE_VERIFIED`는 범위·후보·출처가 원본과 같다는 뜻이다. 해당 대운이나 관계의 확정, Meaning 승인, 고객 승인이 아니다. 조건부 Dayun Graph의 `UNCERTAIN_TRANSITION`과 WITHHELD, Relation validator의 `CONDITIONAL_RELATION_NOT_CONFIRMED`를 구분하여 원본 그대로 기록한다. `UNKNOWN_INTERVAL`도 원본에 존재할 때만 보존하며 새 blocker를 계산 결과로 만들지 않는다.

## Native Binding과 범위

AnnualSpecialistIndex → 기존 annualMonthContracts/observeAnnualLedger → ActualBindingIndex → annualRoleSelector → bindKnowledgeCandidate를 재사용한다. 각 확정 구간의 경계·월주·실효 연주 3개만 정확히 하나의 half-open Window에 선택한다. Dayun Source Witness는 별도 precondition이다. 조건부 Graph를 확정 Fact로 선택하지 않는다. 기존 12 Gate와 Source Group·Counterexample·Prohibition·Meaning/Claim null·미해결 조건을 유지했다. 5개 기술 Gate 이외의 기존 state/reasons도 동일하다. 조건부 구간이나 first-cycle 부재가 남는 월 전체 Candidate는 보류한다.

검증 월은 8/12 → 9/12 (`02/03/04/05/07/08/09/10/12`). Annual 내부 후보는 35 → 38, Major 2 유지. 기존 37개 후보 전체 해시, 703개 Native Receipt와 diagnostic hash, 422 Units / 164 보류 / 396 unmatched / 기존 Typed Roots 246 및 reference occurrences 855가 동일하다. 새 계산 사실·Fact Root·고객 Claim·Approval·Reader Bridge·Planner 배정은 모두 0이다. Witness가 참조하는 기존 Graph ancestry root는 별도 참조이며 새 Typed Root로 합산하지 않는다. 조건부 타입 변형은 실제 Cycle/Relation/Meaning/Customer 승인 필드가 false 리터럴임을 별도 가상 TypeScript 계약으로 확인한다(저장소 파일 생성 없음).

## 검증 자료

- `august-original-source-proof.json`: 8월 원본 ID·파일/레코드 해시·Source Version, 실제 Producer 코드 증빙.
- `conditional-dayun-scope-witnesses.json`: 범위·후보·원본 노드 상태/blocker·전체 ancestry를 출처/노드 참조로 중복 제거. 배열 순서대로 복원 가능하며 원본 Receipt 대량 복제 없음.
- `august-native-binding-coverage.json`: 실제 수치, 기존 37개 해시, Fixture별 계산/Graph/Native 비교, 원본 Gate 및 테스트 전체 메시지 비교.
- `next-implementation-handoff.json`: 남은 계약과 명시적 보류. 후속 구현 미시작.

외부 검증 경로: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-august-conditional-dayun-01/`. 실제 CLI 재현: 고정 Node v24.22.0으로 저장소에서 `node tools/annual-august-dayun/verify.mjs <새 외부 결과 디렉터리>` 실행. 원본 입력은 기존 Source Locks의 A/F/C와 이전 Ranged recipe이며 개인 이름·생년월일은 공개 산출물에서 검사해 제외한다. 추가 첫 대운 이전 입력은 기존 원본을 수정하지 않은 오프라인 파생 사례이며 기준 후보 집계에 넣지 않는다.

## 한계와 승인

Source Integrity FAIL 30, 모호한 월별 십성 역할 10개, Meaning/Product/Customer pending, 기존 보호 Manifest 실패 2개와 October의 5000ms timeout을 그대로 남긴다. 조건부 사례의 고객 발행 가능 상태가 개선됐다고 주장하지 않는다. 전체 저장소 Suite는 실행하지 않았다. October는 핵심 정상 2개와 기존 timeout 1개를 name filter로 실행했고, 테스트 코드 삭제·skip 추가·기존 timeout 변경은 없다.

고객 Runtime AST 및 NFT, 기존 Books/Publication 결과, 원본 파일·지속 Worktree/Dirty/포렌식 보존 증빙과 정확한 Git/Preview 결과는 coverage 및 외부 최종 receipt를 참조한다. Source/Producer의 content-addressed 코드 버전은 명리 Meaning 승인과 구분한다. Preview READY는 빌드 확인이며 고객 발행·판매·Production 승인이 아니다. master/Production/운영 DB/결제/Auth/Worker 변경은 없다. 다음 구현은 시작하지 않는다.

## 최종 실행 결과

신규 39 PASS / 0 FAIL. 기존 관련 15개 파일 712 PASS / 2 FAIL. October 대상 2 PASS / 1 FAIL, 나머지는 name filter로 미실행. 기존 실패 총 3개는 정확한 Base의 정규화한 전체 오류 메시지와 동일하다. 신규 회귀 0, 기존 테스트와 timeout 변경 0.

17 Books / 102 digests 및 저장 후 재열람 동일. Publication 39개는 32 SAFE_OFFLINE / 7 WITHHELD 동일. strict TypeScript 진단 0, ESLint 경고 0, Webpack Production Build PASS, build 경고 0. Runtime AST 46 roots / 700 modules 및 NFT 90 trace(앱 route 88 + 공통 2)의 실제 소스/외부 의존성이 Base와 같다. 생성된 .next 내부 산출물만 비교에서 제외했다. 기존 원본 6,465개 파일의 변경·누락 0.

기존 77 Worktree(지속 16, 과거 임시 61), 원본 Dirty 11개, 포렌식 915개 SHA/mtime 보존. 새로운 지속 Worktree와 Branch/Index/Ref/Object/Upstream 등 의도한 Git metadata 추가를 별도로 기록한다. Git metadata 변경 0이라고 주장하지 않는다. 과거 ignored·미기록 임시 자료 무손실은 UNVERIFIED로 남긴다. 정확한 커밋·원격 SHA·Preview READY는 외부 `git-preview-receipt.json`에 기록한다.
