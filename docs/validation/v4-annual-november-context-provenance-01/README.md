# V4-ANNUAL-NOVEMBER-CONTEXT-PROVENANCE-01

Base: `2e1f2e9855237e635c6c371d7bf69ac60a6aba7f`. Branch: `v4/annual-november-context-provenance-01`.

**11월 실제 기간·계산 사실 및 원본 가상 장면의 출처 검증은 구현했다. 원래 Context 관찰 시각은 없어 원본 11월 적용을 보류한다.** 원본 후보 0, 검증된 월 계약 10/12를 유지한다. 신규 핵심 파일 2개, 신규 테스트·오프라인 CLI 각 1개, 이 검증 문서 5개만 추가한다. 기존 UserContext·Research·계산·Graph·Binder·Runtime/UI·Book 파일은 수정하지 않는다.

## 원본 출처

`afpr:month-slot:11`, index 10의 지정된 Catalog Key, Record SHA, 파일 SHA 및 Source Version을 원래 export와 대조한다. requires 3개, 입동, 원래 의미·반례·금지·Source Groups, null Meaning/Claim Identity를 유지한다. Source Code의 내용 SHA는 계산 Producer·입력 계약의 버전이며 고객 의미 승인과 다르다. 원본 `scene.hypothetical=true`, `isCustomerHistory=false`를 정확히 검증한다. 가상 장면은 명리 계산 Fact와 별도 필드에 유지하며 실제 개인 사건이나 확정된 미래 활동으로 사용하지 않는다.

## Context 관찰 시각 조사

`SinglePersonReportInputPayload.userContext`는 relationshipStatus/jobStatus/detailJob/focusAreas다. `UserContextProfile`과 normalizeUserContext에도 관찰 시각 필드는 없다. 기존 Graph의 `/input/userContext` CONTEXT_INPUT은 정규화 Producer와 입력 내용을 결합하지만 temporal=null이고 관찰 시각을 제공하지 않는다. 원래 입력 전체의 hash, Packet hash, Fixture/Owner, Producer 버전, Graph Node hash와 원래 Root/ancestry를 검증해 **Context Payload Identity 검증**을 기록한다. 이것은 **Context 관찰 시각 인증**이 아니다. 실제 입력 원문·자유 서술·이름·생년월일은 출력하지 않는다.

기존 A/F/C2028 및 Ranged 입력에서 원래 관찰 시각과 payload를 결합하는 인증된 오프라인 Source가 없다. 모든 입력은 CONTEXT_TIMESTAMP_MISSING / ACTUAL_CONTEXT_TIMESTAMP_REQUIRED다. 관찰된 field 목록과 관찰 시간 범위는 각각 빈 배열/null이며, suppliedContextFields와 명확히 구분한다. 현재 단계는 인증된 timestamp를 새로 발급하는 API를 제공하지 않는다. `diagnoseSubmittedContextTimestamp`는 호출자 값의 출처 부재를 거절하는 부정 진단일 뿐이다. 실제 Source 계약 없이 긍정 인증 fixture를 만들지 않았다. 운영 DB·외부 비공개 입력 Source는 조사하지 않았으며 저장소의 실제 입력·정규화·Packet·Graph·오프라인 Fixture 계약을 검토한 범위의 결론이다.

Reading Instant는 AnnualClock.currentDate, Graph Evaluation은 Graph context.evaluatedAt, GeneratedAt은 Packet.generatedAt, policyDate는 기존 미래 연도 오프라인 정책 확인 시각이다. 이번 원본 입력에서 일부 값이 같더라도 ContextObservedAt의 근거가 되지 않는다. 각 값과 원래 포인터를 별개로 기록하고 ContextObservationTimestamp/Source는 null로 유지한다. 파일 mtime이나 현재 시각도 대신 사용하지 않는다.

## 실제 11월 실행

| Fixture | 원래 전체 구간 | 현재 Fact Binding | Reading 기준 기간 | Context | 원본 후보 |
|---|---:|---:|---|---|---:|
| fixture-annual-A | 2 | 2 | FUTURE | CONTEXT_TIMESTAMP_MISSING | 0 |
| fixture-annual-F | 2 | 2 | FUTURE | CONTEXT_TIMESTAMP_MISSING | 0 |
| fixture-annual-C2028 | 2 | 2 | FUTURE | CONTEXT_TIMESTAMP_MISSING | 0 |
| fixture-annual-ranged-transition | 2 | 2 | FUTURE | CONTEXT_TIMESTAMP_MISSING | 0 |

구간 수는 Producer 결과에서 읽으며 고정하지 않는다. 원래 연간 Producer를 전체 재실행해 원래 Evidence와 정확히 비교한다. civil November bounds, 모든 원래 구간의 연속성·Owner·Pointer·Producer/version, 경계 Node·월주·실효 연주·Active Dayun Context·입동 직전/정각/직후를 기존 검증 함수로 확인한다. 기간 판정은 기존 annualPeriodTime을 사용해 Reading Instant 기준의 PAST/CURRENT/FUTURE로 기록한다. Graph timePosition은 기존 temporalPosition 결과를 별도로 보존한다. 미래 구간의 계산 가능성과 미래에도 입력 생활 상태가 유지된다는 가정은 별개다.

PERIOD_FACTS_VERIFIED는 경계·월주·실효 연주 세 종류에 한정한다. 다른 원래 Graph 근거와 전체 supporting ancestry도 상태 변경 없이 보존하며, 미상 시주/불확실 대운 등 WITHHELD 근거를 승격하거나 선택하지 않는다. Witness의 원래 Node/Root/완전 ancestry와 Context Payload provenance, 조건부 Scene source를 분리한다. 신규 Root·독립 계산 Fact·개인 생활 사실은 0이다.

## Native Binder와 위조 차단

AnnualSpecialistIndex / ActualBindingIndex / annualRoleSelector / bindKnowledgeCandidate를 재사용한다. 각 확정 구간의 경계·월주·실효 연주만 하나의 동일 기간으로 선택한다. 원래 요구조건·Source Groups·반례·금지·Required Context·Meaning/Claim을 그대로 보존한다. 5개 기술 Gate만 실제 계산 사실로 검증하고 나머지 7개 Gate의 state/reasons와 Source Group 평가를 원래 Receipt와 비교한다. 12 Hard Gate 자체는 변경하지 않는다. 진단 Binding은 CURRENT_FACT_SCOPE_ONLY이며 원본 연구 적용·고객 승인으로 취급하지 않는다.

GeneratedAt/Reading/policyDate 대체, 출처 없는 시각, 다른 Fixture·Owner·Payload, 미입력 상태, 미래 상태 자동 유지, Scene/History 위조, 연도/Segment/입동/Graph/Source Group/Counterexample/Receipt/Gate/Approval/Meaning/Claim 변조를 신규 자동 테스트로 차단한다. 원본 없는 Positive timestamp 인증은 구현했다고 주장하지 않는다.

## 기존 결과 및 실행 방법

Annual 42 / Major 2, 후보 44개 ID·전체 해시 multiset과 703개 원래 Receipt ID·전체 해시 배열·Native 진단, Units 422 / held 164 / unmatched 396 / Typed Roots 246 / root references 855를 기존 Base와 대조한다. June의 전체 관측 digest도 일치하며 ROLE_SOURCE_DECISION_REQUIRED와 후보 0을 유지한다. 기존 10개 월 계약을 변경하지 않는다. Meaning/Product/Customer 승인은 보류이며 Claim/Approval/Reader Bridge/Planner 배정은 0이다.

`node tools/annual-november-context/verify.mjs <새 외부 출력 디렉터리>`가 기존 7개 전체 입력과 네 Annual November를 실행한다. 실제 원문 관측은 외부 final-run/november-observations.json에 있다. 공개 검증 자료는 Graph node와 Context를 ID로 참조하며 재구성해 원문과 비교한다. 원래 703개 Receipt 전문은 중복 저장하지 않는다.

검증의 실제 건수·정확한 Base 실패 메시지 비교는 november-technical-coverage.json의 verification에 기록한다. 전체 Repository Suite는 실행하지 않았다. 기존 테스트 삭제·skip·timeout 증가는 없다. 과거 October 5000ms 민감성은 독립된 기존 이슈다. 첫 전체 October 실행은 36 PASS / 2 timeout(기존 240000ms)이었고 5000ms 사례는 통과했다. source·입력·timeout·환경 설정 변경 없는 별도 전체 재실행과 첫 실패의 상세 비교를 verification.firstOctoberFullRunAndUnchangedRerun에 보존한다. 초기 지연의 원인은 UNDETERMINED이며 해결했다고 주장하지 않는다. strict TypeScript/ESLint/Webpack/Runtime AST/NFT, 반복 결정성·개인정보·17 Books 102 digests 및 재열람, Publication 39개(32 SAFE_OFFLINE/7 WITHHELD)를 비교한다. 새 문서도 포함해 패키징한 뒤 NFT를 검사한다.

기존 지속 Workspace, 원본 Dirty 11개, 이전 Worktree HEAD·사용자 Ref·Git Object, 포렌식 915개 hash와 914개 mtime을 별도 비교한다. 과거 임시 경로 위험은 지속 경로 무결성과 분리하며, 미기록 ignored/untracked 자료의 과거 무손실은 UNVERIFIED다. Codex 내부 임시 Ref 교체와 관련 Object 접근도 별도 기록하고 삭제 주체를 추정하지 않는다. 복구·정리·GC·기존 경로 변경은 하지 않는다.

외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-november-context-provenance-01/`. master·Production·DB·결제·Auth·Worker 변경은 없다. commit/remote SHA와 exact-SHA Preview 결과는 외부 git-preview-receipt.json 및 FINAL-RESULT.json에 기록한다. Preview READY는 기술 빌드 검증이며 고객 발행 승인이 아니다. 다음 구현은 별도 지시와 검증 가능한 원래 Context Source 계약이 필요하며 자동 시작하지 않는다.

## 최종 실행 결과

신규 49 PASS / 0 FAIL. 기존 관련 18개 파일 842 PASS / 2 FAIL. October 전체 재실행은 37 PASS / 1 FAIL; 첫 정확한 Base 전체 실행은 38 PASS / 0 FAIL이었다. 추가로 정확한 Base에서 같은 5000ms 사례를 단독 재실행했을 때 0 PASS / 1 FAIL로 재현됐으며 나머지 37개는 name filter로 미실행했다. 보호 Hash 2건과 5000ms 사례 1건 모두 정규화한 전체 오류 메시지가 Base와 같다. 첫 Feature 전체 실행의 별도 240000ms timeout 2건은 시스템 절전과 중첩됐고 코드·timeout을 바꾸지 않은 전체 재실행에서 둘 다 통과했다. 따라서 최종 검증의 신규 회귀는 0이며 기존 시간 민감성이 해결됐다는 뜻은 아니다. 전체 저장소 Suite는 미실행했다. 원래 timeout·테스트·소스 변경은 없다.

실제 Annual 4개 입력의 11월 전체 8 구간에서 Period Fact와 조건부 Scene Source를 확인했고, 현재 Fact Binding 8개를 기록했다. 인증된 Context timestamp는 0개, 원래 관찰 시각 부재로 보류한 입력은 4개다. 원본 11월 후보는 0이고 월 계약 10/12 유지다. 원본 관찰 시각과 연결할 수 없는 임의 문자열은 부정 진단 외에는 사용하지 않는다.

17 Books / 102 digests와 저장 후 재열람 동일. Publication 39개는 32 SAFE_OFFLINE / 7 WITHHELD 동일. strict TypeScript 진단 0, ESLint 경고 0, Webpack Production Build PASS, 경고 0. Runtime AST 46 roots / 700 modules 및 NFT 90 trace(앱 88 + 공통 2)의 실제 소스·외부 의존성은 정확한 Base와 같다. .next 내부 생성 산출물만 trace 비교에서 제외했다. 기존 6,492개 tracked 파일 변경·누락 0.

기존 80 Worktree(지속 19, 임시 61), 원본 Dirty 11개, 포렌식 915개 SHA 및 914개 mtime 보존. 기존 사용자 Ref·Worktree HEAD·Object 접근 정상. 새 지속 Worktree/Branch/Index/Object 및 원격 upstream 등 의도한 Git metadata 변경을 별도로 기록한다. 과거 ignored·미기록 임시 자료 무손실은 UNVERIFIED다. Codex 내부 임시 Ref 교체는 외부 비교 자료에 분리하고 관련 Object의 접근을 검사한다. 파일 유실과 같은 사건으로 단정하거나 삭제 주체를 추정하지 않는다.

커밋 전 관찰에서 Codex 내부 임시 Ref 변화는 0건이며, 기존 대상 Tree의 2,086개 Object가 모두 접근 가능했다. push 후 최종 관찰은 외부 postpush-comparison.json에 기록한다. 최종 실행 수치·빌드 결과를 보완한 문서만 빌드 후 갱신했고, 실행 소스 네 파일의 SHA는 implementation-review.json과 같다. 새 문서·기능은 Runtime AST 및 NFT dependency에 포함되지 않는다.
