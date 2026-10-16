# V4-GLOBAL-BOOK-PLANNER-01

**GLOBAL_BOOK_PLANNER / OFFLINE_IMPLEMENTED.** 실행 가능한 공통 제약 Planner와 Typed Editorial Handoff를 추가했다. 6 Product Keys·궁합 7유형·12 Specialist Routes를 별도로 계획한다. 기존 Writer/Reader/Book이나 실제 연구를 변경하지 않았다.

**STRICT_CUSTOMER_POLICY: 실제 27 Graph·5,073개 후보 평가에서 고객 배정 0.** 실제 연구 승인·적격·선택·Claim·Book Allocation은 모두 0이다. **ISOLATED_EDITORIAL_REHEARSAL: 12개 독립 합성 경로에서 1,085개 배정**, 추가 독립 Friendship 표시 증명 fixture에서 180개 배정이 실행됐다. 두 집계는 같은 실제 평가군에 합산하지 않는다. 이는 알고리즘과 제약 검증이며 고객용 원고 품질·실제 발행 승인과 다르다.

## 기준 및 보호

- Base `v4/comprehensive-reader-value-probe-01`, `fe1764f802985516458663e58e40ced586d95024`.
- Branch `v4/global-book-planner-01`, worktree `/private/tmp/gyeol-global-book-planner-01`.
- 실제 Base tracked file 수는 **5,509**다. 모든 Base 파일의 Git blob/파일 바이트를 전후 확인했다.
- 시작 당시 기존 worktree는 **58**곳이다. 문서의 57곳에 직전 Probe worktree가 추가된 상태다. 원본 미커밋 11파일(기본 short status 3행: 수정 2파일 + 미추적 디렉터리 안 9파일)을 보존했다.
- 시작부터 `.git` 표식이 없는 기존 worktree 8곳은 공통 Git admin을 읽어 상태·파일을 비교했다. 복구·prune·삭제·정리를 하지 않았다.
- 계산·점수·연구 DB·12 Specialist·Binder/Foundation·Global Integration/Resolution·Workbench/Pilot·A/B Probe·Writer/Reader/Book은 불변이다. 결제·인증·Worker·DB·환경변수·Production 변경 및 고객 API 등록은 없다.

## 기존 API 인수

`GlobalSpecialistRegistry`, `CandidateEnvelope`, `validateEnvelope`, `compilePlannerHandoff`, `ProductSpecialistFoundation`과 실제 `ProductQuestionRegistry.compile()`을 재사용했다. 기존 27 Native invocation의 압축/분할 snapshot을 기존 `readGlobalArtifact`로 읽었다. 원본 5,073개 receipt의 key/hash, envelope hash, source hash와 case 위치를 검증하고 보존했다. 같은 27 Graph를 불필요하게 다시 계산하지 않았다.

원래 실제 집계 **Source 10,536→11,170, Actual Evidence 917→1,489, Structural 81→81, Customer Eligible 0**을 그대로 유지했다. 이번 strict 계산 집계는 원래 after receipt에서 11,170 / 1,489 / 81이다. 기존 Source Resolution의 추가 525·잔여 2,677·Domain Queue 2,966도 인수했으며 새로운 승인을 추가하지 않았다.

요청된 `sourceProvenance.ts`, `actualEvidenceIndex.ts`, `hardGateAudit.ts`는 현재 경로에 없다. 실제 역할은 `foundationCoordinator.ts`의 provenance/witness capture와 `candidateEnvelope.ts`의 receipt/12-gate 검증 및 기존 artifact index에 있다. 해당 경로와 자료를 사용했고 이름이 비슷한 새 Resolver를 만들지 않았다.

실험 A/B의 2입력·8쌍·7원문·32문장과 **정확한 Reader Replacement 0** 결과를 인수했다. 기존 B를 정답 문장으로 가져오지 않았다. 질문 변경·MBTI/Fusion 삭제·같은 조언의 반복을 부정 회귀로 검증했다.

## 입력·출력과 실행 경계

[types.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/types.ts)는 `GlobalBookPlanningRequest`, `GlobalBookPlan`, 역할·질문·근거·Owner·Direction·시간·Source Group·Meaning·재사용·표시 의존성 계약을 정의한다. 원래 버전/Hash/주소는 입력과 각 배정에서 추적한다.

[planningRequest.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/planningRequest.ts)는 원본 Metadata의 공유 참조를 한 번씩 복사한 독립 스냅샷을 고정한다. 호출자의 Registry/Foundation/receipt를 freeze하거나 변경하지 않는다. process-local 인증된 request만 실행할 수 있고, 변조/복사/Map 교체를 거절한다. Vercel runtime에서 준비/실행을 차단하며 실제 고객 import와 NFT 유입도 0이다.

Strict mode는 현재 원래 `NO_APPROVALS` 경계를 유지한다. 12 Gate의 FAIL/UNKNOWN/REVIEW_REQUIRED를 Fit으로 보상하지 않는다. 실제 Source를 합성으로 재태깅하지 않는다. 미래 실제 승인 공급자 연결은 다음 Official Approval Contract의 범위이며 이번에는 시작하지 않았다.

Rehearsal은 **기존 각 Specialist의 물리적으로 분리된 synthetic registry/factory**를 재사용한다. 새 테스트 승인 플래그만 넣지 않았다. `ActualBindingIndex`와 `bindKnowledgeCandidate`를 다시 실행해 원본 native receipt와 일치시키고, 원래 인증된 Approval Provider 및 모든 12 Gate를 요구한다. Native Specialist의 추가 의미·context·domain·direction·시간·안전 조건도 통과해야 한다. Binder PASS와 Planner Assigned는 같은 단위가 아니다.

## 선택 알고리즘

[globalSelection.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/globalSelection.ts)는 FIRST_ELIGIBLE, QUESTION_FIT_FIRST와 실제 GLOBAL_CONSTRAINT_AWARE 탐색을 실행한다.

1. 고정 입력·상품/관계 경로·원본 receipt/source 무결성을 확인한다.
2. 12 Gate·정확한 질문/Material 연결·실제 Evidence·Owner/Direction/기간·Source Group·전체 ancestry·조건/반례·Meaning/Claim을 확인한다.
3. 각 질문의 승인된 후보 pool을 만들고, 중요 질문과 후보가 적은 질문부터 탐색한다.
4. 원래 재사용 예산과 native conflict validator를 적용하며, 앞선 선택을 되돌려 후속 질문의 Root/Facet/Meaning을 예약한다.
5. 선행 문제·CONTINUITY·REPAIR 의존성은 최종 조합에서도 검증한다. RECALL은 실제 등록된 표시 증명 없이 통과하지 않는다.
6. 중요 질문 수 → 전체 질문 수 → 양방향 균형 → Meaning identity 수 → 정보 기능 수 → native Fit을 비교한다. Gate 실패는 점수에 들어오기 전에 차단한다.
7. admissible upper bound로 가지치기하고 동일 점수는 고정 traversal로 결정한다. 한도에 닿으면 `SEARCH_LIMIT_PARTIAL / NOT_CLAIMED`를 반환한다.

최적성 표시는 **등록·검증된 합성 pool 및 현재 제약 안에서 탐색을 마친 경우**에만 해당한다. 실제 연구 전체나 독자 만족도의 전역 최적성을 주장하지 않는다. 기본 리허설 12건은 탐색을 완료했다. Greedy 비교군에도 같은 최종 제약을 적용했다.

기존 Native pairwise conflict 결과는 요청 안에서 캐시하고 전체 조합의 최종 validator를 다시 실행한다. 공통 Root hard cap을 새로 만들지 않았다.

| 경로 | FIRST / FIT / GLOBAL 배정 질문 |
|---|---|
| comprehensive | 3 / 3 / 4 |
| career | 4 / 4 / 5 |
| love | 6 / 6 / 7 |
| major-fortune | 16 / 16 / 17 |
| annual-fortune | 11 / 11 / 12 |
| compatibility-love | 159 / 159 / 160 |
| compatibility-marriage | 159 / 159 / 160 |
| compatibility-parent-child | 159 / 159 / 160 |
| compatibility-coworker | 139 / 139 / 140 |
| compatibility-manager-report | 139 / 139 / 140 |
| compatibility-business-partner | 139 / 139 / 140 |
| compatibility-friendship | 139 / 139 / 140 |

종합의 첫 질문은 greedy에서 `synthetic:cse:a`를 고른다. Global은 원래 다른 Root의 `synthetic:cse:b`를 골라 후속 질문에 필요한 Root 예산을 남기고 3→4개 질문을 채운다. 새 사실을 만든 결과가 아니다. Career/Love의 4→5, 6→7은 각자의 원래 Facet/중복 계약을 따른다. `algorithm-comparison.json`에 같은 입력 hash, 실제 선택 ID, 미선택 이유와 search 결과가 있다.

## Reader 연결·정보·반복

실제 Registry의 **2,060개 질문**과 원래 Reader address/level을 조회한다. 종합 13/52/208/260, Career/Love 9/36/144/180, 궁합 각 9/36/144/180, 대운 14년·168 질문 역할, 세운 12개월 계약을 보존했다.

`DIRECT_QUESTION_MATERIAL`, `CONDITIONAL_APPLICATION`, `SHARED_FOUNDATION_MATERIAL`, `RECALL_ONLY`, `REFERENCE_ONLY`, `EXPRESSION_ONLY`, `UNMAPPED`와 원래 연결 hash를 보존한다. Topic-only, 미검증 Bridge, reference/expression은 Primary가 아니다. 조건부 연결을 정확한 Primary 의미 충족으로 자동 승격하지 않는다.

`READER_SCHEDULER_BRIDGE_UNVERIFIED`가 유지된다. C1~C10과 CH01~CH13의 번호/주제 대응을 만들지 않았다. 같은 Root가 있어도 다른 Reader 질문을 바꾸지 않는다.

실제 Fact, entered input, semantic derivation, conditional interpretation, meaning, primary/supporting/connector/recall을 구분한다. 같은 Root나 다른 표현은 새 독립 Fact가 아니다. Native가 검증한 다른 응용과 조건만 허용하고 실제 의미 독립성이 미검증이면 REVIEW_REQUIRED다.

Same Root/Claim/Meaning/명시적 phrase/example/advice와 native conflicts를 구분한다. 다른 Owner·Direction을 동일 주장/모순으로 단정하지 않는다. 원래 AB/BA 방향은 보존하고 균형 계산에서만 A_TO_B/B_TO_A와 정확히 대응시킨다. CONTINUITY/RECALL은 새 계산 사실로 세지 않는다.

정보 기능은 원래 선언을 사용한다. RECALL mode는 긍정/DIRECT 스타일 때문에 새 해설로 바뀌지 않는다. 문장의 스타일 원문은 별도 original meaning에 보존된다. 장별 기능 편중은 `chapter-function-audit.json`에서 감사하며 다양성만으로 정보 독립성이나 품질 향상을 확정하지 않는다. 자연어 의미 중복의 자동 승인 기능은 없다.

## 상품별 리허설 범위와 미충족 질문

다음 수치는 **등록된 독립 synthetic 질문/주소**의 커버리지다. 실제 연구를 이용한 완성 고객 Book 수가 아니다. 종합/Career synthetic registry에는 문단 번호가 없는 질문도 있어, 번호를 추측하지 않고 null을 유지한다.

| 경로 | 합성 질문 | 배정 | 미충족 | 배정 장 / 문단 / 역할 |
|---|---:|---:|---:|---|
| comprehensive | 4 | 4 | 0 | 1 / 0 / 0 |
| career | 5 | 5 | 0 | 5 / 0 / 0 |
| love | 7 | 7 | 0 | 7 / 7 / 0 |
| major-fortune | 168 | 17 | 151 | 0 / 0 / 17 |
| annual-fortune | 12 | 12 | 0 | 0 / 0 / 0 |
| compatibility-love | 180 | 160 | 20 | 8 / 32 / 128 |
| compatibility-marriage | 180 | 160 | 20 | 8 / 32 / 128 |
| compatibility-parent-child | 180 | 160 | 20 | 8 / 32 / 128 |
| compatibility-coworker | 180 | 140 | 40 | 7 / 28 / 112 |
| compatibility-manager-report | 180 | 140 | 40 | 7 / 28 / 112 |
| compatibility-business-partner | 180 | 140 | 40 | 7 / 28 / 112 |
| compatibility-friendship | 180 | 140 | 40 | 7 / 28 / 112 |

대운 synthetic 168개 질문 중 실제 검증된 Material이 부족한 질문은 그대로 미충족이다. 14년 전체 원고를 새로 작성했다는 뜻이 아니다. 종합/Career/Love의 소규모 합성 정상 경로도 실제 52/36문단 전체가 승인됐다는 뜻이 아니다. 실제 full Reader 계약은 Strict mode에서 모두 조회·보류된다.

## 시간·관계·회수 안전성

대운 14년 편집 Horizon은 실제 10년 Cycle과 분리한다. 원국/대운/세운과 전환 전후의 원래 Scope·Window·정확/범위/미상 상태를 보존하며 교운을 새로 계산하지 않는다. 같은 Root의 연속 설명과 다른 연도 관측을 구분한다.

세운은 12 Civil Months와 **16개 등록 synthetic Segment**를 유지한다. 각 월의 모든 요구 Segment와 실효 연주/월주/대운 context를 ledger로 남긴다. 한 Focus Segment 배정으로 월 전체 의미가 승인됐다고 표시하지 않는다. 월간/월지 본기·명목/실효 연주를 병합하지 않고 미지원 복합 판정을 추가하지 않는다.

궁합 7유형은 별도 policy다. A/B·방향·canonical pair·received TenGod·Source Group·context·RoleVersion·ancestry를 native 계약으로 검증한다. ParentChild A 부모/B 자녀, ManagerReport A 상사/B 팀원은 원래 role validator의 고정 역할이다. 다른 관계에 이 비대칭 역할을 옮기지 않는다. 실제 혼인/지분/재정/업무/친구 관계 기간은 실제 입력 없이 생성하지 않는다.

CH07 Friction, CH08 Repair, CH09 Recall을 별도 dependency로 기록한다. Source group의 AND/대안 조건과 원래 선행 Material을 유지한다. **PLANNED ≠ ACTUALLY_DISPLAYED**다. 기본 경로에서 필요한 표시 증명이 없으면 해당 질문을 비운다.

독립 Friendship native 표시 fixture는 Planner가 고른 결과로 만들지 않았다. 기존 등록된 synthetic display 기록을 기존 Specialist 검증에 별도로 공급했다. FIRST/FIT 179, GLOBAL 180개 배정이며 REPAIR 20·RECALL 20개를 검증한다. 이는 독립 합성 표시 증명이며 실제 브라우저/customer publication을 실행했다는 뜻이 아니다. 실제 고객 표시 기록 발급은 0이다.

## Typed Editorial Handoff

[editorialHandoff.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/editorialHandoff.ts)는 실제 실행 가능한 compiler다. [planValidator.ts](../../../src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/planValidator.ts)가 먼저 Reader 구조/질문/주소, Source 위치·Hash, receipt, 근거/Root/Owner/Direction/시간, 의미/기능, 반례/금지/맥락/재사용, 표시 의존성을 검증한다.

전달할 Primary/Supporting 의미와 내부 검증 metadata를 분리한다. 안전성 metadata를 매 문장 반복하도록 강제하지 않는다. Handoff는 고객 배정 권한이나 새로운 한국어 원고를 생성하지 않는다. Korean Editorial Engine은 구현하지 않았다.

## 기술 검증과 보존

- 신규 Unit **125 PASS / 0 FAIL**. 실제 Planner 호출, 12경로, authentic native 부정 fixture, 12 Gate UNKNOWN/REVIEW_REQUIRED 고득점 차단, source/group/ancestry/domain/owner/direction/질문·의미·Root 변조, A/B 회귀, 역할/시간/표시/회수, 결정론/Handoff 경계를 포함한다.
- 기본 BadSourceHash native 부정 fixture는 첫 후보만 훼손한다. 그 후보를 제외하고 유효한 대체 후보를 배정하는 것이 정상이며 전체 0배정을 강제하지 않았다.
- 기존 알려진 묶음 **5,837 PASS / 46 FAIL**. 이름·전체 정규화 메시지·signature는 Base Probe와 같다. 전체 저장소 suite를 모두 통과했다고 주장하지 않는다.
- BusinessPartner Engine 파일은 Base/current 모두 **360 PASS / 1 FAIL**, Artifacts 22 PASS를 합치면 기존 비교군 **382 PASS / 1 FAIL**이다. 기존 기본 5초 사례의 raw 오류는 STACK_TRACE_ERROR이며 signature가 같다. 과거 Pilot의 383 PASS도 별도 기록한다. 기존 테스트/timeout을 바꾸지 않았다.
- TypeScript **기존 0 → 현재 0**, 신규 0. lint PASS / 새 경고 0. Node 24.22.0·Next 16.2.4 Production build PASS / 관측 경고 0. `git diff --cached --check`도 PASS다.
- 원래 **17권/102 digest, Friendship 20사례/140 digest, 40 profile**을 fresh before/after로 비교해 바이트 동일함을 확인했다. 계산·궁합 점수·Evidence·원고·Book·저장/재열람 roundtrip을 보존했다.
- NFT **90경로(88 server + 2 root)**와 dependency 집합 동일, Planner 유입 0.
- 독립 CLI 두 번의 실제 물리 파일 바이트를 비교하고 실행 중 신규 source hash가 바뀌지 않았는지도 확인했다.
- 기존 `GYEOL_GLOBAL_AUDIT_GZIP_V1` / `GYEOL_GLOBAL_AUDIT_SHARDS_V1` Reader로 모든 핵심 산출물을 다시 읽었다. 작은 chunk로 나눠 기존 gzip leaf 한도를 지켰다. 원래 112MB conflict 자료는 새로 복제하지 않고 기존 case/field hash로 참조하며 원본은 보존했다.

[technical-validation.json](technical-validation.json), [known-failure-comparison.json](known-failure-comparison.json), [business-partner-baseline.json](business-partner-baseline.json), [book-preservation.json](book-preservation.json), [source-preservation.json](source-preservation.json), [nft-trace-preservation.json](nft-trace-preservation.json), [workspace-preservation.json](workspace-preservation.json)을 참조한다.

## 재현 및 산출물

```sh
node tools/global-book-planner/verify.mjs /tmp/gyeol-global-planner-rebuild
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/globalBookPlanner.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js
NODE_OPTIONS=--max-old-space-size=4096 node node_modules/next/dist/bin/next build
git diff --check
```

build는 Node 24.22.0에서 검증했다. CLI는 네트워크를 차단하고 고정 registry/Source/Graph/receipt를 읽는다. 환경값·현재 시각·PID·임시 경로·메모리 관측값은 결정론 자료에 넣지 않는다. 대용량 논리 JSON은 `.json` manifest와 `.json.gz`/part로 저장되므로 기존 `readGlobalArtifact(directory, name)`를 사용한다.

| 내용 | 핵심 파일 |
|---|---|
| Manifest / 경로·Reader | [global-book-planner-manifest.json](global-book-planner-manifest.json), [planner-registry.json](planner-registry.json), [product-reader-contracts.json](product-reader-contracts.json) |
| 원본 적격·연결·보존 | [candidate-eligibility.json](candidate-eligibility.json), [original-receipt-preservation.json](original-receipt-preservation.json), [question-material-links.json](question-material-links.json), [reader-bridge-audit.json](reader-bridge-audit.json) |
| Root·Meaning·Conflict·Budget | [root-ownership.json](root-ownership.json), [meaning-identity.json](meaning-identity.json), [conflict-constraints.json](conflict-constraints.json), [synthetic-conflict-constraints.json](synthetic-conflict-constraints.json), [reuse-budgets.json](reuse-budgets.json) |
| 실제 strict 결과 | [strict-customer-plan.json](strict-customer-plan.json), [actual-evidence-index.json](actual-evidence-index.json) |
| 독립 합성 정상 경로 | [synthetic-rehearsal-input.json](synthetic-rehearsal-input.json), [synthetic-verified-binder.json](synthetic-verified-binder.json), [synthetic-rehearsal-plan.json](synthetic-rehearsal-plan.json), [algorithm-comparison.json](algorithm-comparison.json) |
| Coverage·보류·역할·기간 | [question-coverage.json](question-coverage.json), [unfilled-questions.json](unfilled-questions.json), [temporal-assignments.json](temporal-assignments.json), [compatibility-assignments.json](compatibility-assignments.json), [chapter-function-audit.json](chapter-function-audit.json) |
| 표시·후속 계약 | [display-dependencies.json](display-dependencies.json), [editorial-handoff.json](editorial-handoff.json) |
| 검증·결정론·개인정보 | [planner-validation.json](planner-validation.json), [artifact-reader-validation.json](artifact-reader-validation.json), [independent-rebuild-validation.json](independent-rebuild-validation.json), [privacy-audit.json](privacy-audit.json), [final-report-fields.json](final-report-fields.json) |

가상 입력 이름·생년월일·원래 person hash를 공개 검증 자료에 넣지 않았다. 원래 Evidence/Owner/Root 주소는 ledger로 보존한다. 원시 생성 Book/profile·workspace snapshot·실행 로그는 외부 `/tmp/gyeol-global-book-planner-01-validation/`에만 있다.

## 남은 조건과 종료 경계

현재 실제 연구의 승인/적격은 0이다. Reader/Scheduler Bridge, 실제 meaning/domain 승인, 실제 행동 맥락·필수 ancestry, Official Approval Contract와 실제 Editorial/Publication 표시 증명이 남아 있다. 합성 정상 동작은 실제 판매 품질 또는 고객 발행 승인과 다르다.

Typed Handoff와 오프라인 알고리즘 검증은 다음 제한된 기술 작업을 준비할 수 있다. 사람의 정책·의미·고객용 최종 승인은 보류한다. 37개 카드나 A/B 원고의 중간 승인을 요청하지 않았다. Official Approval/Korean Editorial/Full Product Integration/Publication Safety/Protected Staging은 자동 시작하지 않는다.

이 문서가 포함된 commit을 만든 뒤 원격 SHA와 정확한 Vercel Preview SHA/ref/repository/project/target=null/READY를 대조한다. 자기 자신의 SHA를 commit 안에 미리 기입하지 않는다. 최종 값은 최종 응답 및 외부 `release-receipt.json`에 기록한다. master 통합·Production 배포는 없다.
