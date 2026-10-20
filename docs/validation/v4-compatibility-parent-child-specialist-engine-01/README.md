# V4 Compatibility ParentChild Specialist Engine 01

부모·자녀 전용 오프라인 엔진을 구현했다. 기존 120개 연구와 실제 A/B Graph, Binder, 12 Hard Gates를 실행하지만 실제 고객 승인·선택·Claim은 모두 0이다. 새 원고나 고객 Runtime 연결은 없다.

## 실제 결과와 한계

- 120자료(108조건부/12회수), 9장·36문단·144역할·180질문·480기여를 인수했다.
- 동일 비교군 235후보×1Graph에서 Source526, 실제 Witness50, Structural6, Source Group PASS0이 전후 동일하다. 관측 수를 늘리기 위해 조건을 완화하지 않았다.
- PARENTS55/CHILDREN63 원천은 원본 파일의 BOM을 포함한 바이트 해시와 레코드 해시를 검증했다. 현재 비연애 scoring 미지원과 고객 의미 승인을 별도로 보류한다.
- 입력에 실제 발달 맥락이 없으므로 실제 상태는 UNKNOWN이다. 연구의 hypotheticalContext나 생년월일을 실제 발달·능력 판단으로 바꾸지 않았다.
- A–AF40변형은38성공+Q/R예상오류2건이 동일하다. S whole swap은 부모/자녀 역할 선언 변경이며 동일 가족 적용 승인이 아니다. T name-only swap은 별도로 검사했다.
- V의 가상 ADULT 맥락에서 기존 CH06.P4는 “자녀는 해보고 싶은 일과 도움이 필요한 곳을 말할 수 있으며, 부모가 안전과 최종 결정의 책임을 맡아야 합니다.”라고 출력된다. 실제 Context 입력은 UNKNOWN이며, 이 문장은 원고 digest와 함께 보존했다. 성인 자녀 경계 위험은 후속 Writer 수정 대상이다.
- L/M은 기존 구형 발행 Edition을 유지한다. Reader9/36 생성과 실제 Published Edition을 분리하고 Major REPEATED_LONG_PHRASE를 확인했다. BODY_LENGTH만으로 fallback 원인을 단정하지 않았다.
- 7개 SourceUse가 현재 자료에 실제 사용된다. 8번째 actual_natal_condition_required는 어댑터가 지원하지만 원본 자료 사용은0이다. 없는 자료를 추가하지 않았다. Marriage의 sourceUsesAreConjunctive 조건도 복사하지 않았다.

## 실행 및 산출물

```sh
node tools/compatibility-parent-child-specialist-engine/verify.mjs /tmp/parent-child-specialist-audit
```

CLI는18개 구현 입력과4701개 기준 파일을 실행 전후 검사하고 네트워크를 차단한다. 기존 Marriage CLI와 전체 선행 체인을 그대로 실행해41개 Marriage JSON 및 이전 모든 계층을 대조한 뒤 신규43개 JSON을 생성한다. 실행 시간과 메모리는 외부 임시 로그에만 남긴다.

`parent-child-material-index.json`, `parent-child-question-registry.json`, `parent-child-source-assignment-audit.json`, `parent-child-evidence-matches.json`, `parenting-source-validation.json`, `child-source-validation.json`, `parent-child-developmental-context.json`, `parent-child-semantic-conflicts.json`, `parent-child-synthetic-selection.json`, `parent-child-actual-variants.json`, `parent-child-operator-worklist.json`, `parent-child-planner-candidate-contract.json`이 주요 정형 결과다. `deterministic-output.json`은 전체 생성 파일 목록과 바이트 SHA256을 제공한다.

## 검증

- 신규193 엔진 테스트 +11 산출물 테스트 PASS. 기존 관련16파일941테스트 PASS. 초기 병렬 실행은882 PASS/3 FAIL이었다. Marriage 격리 테스트가 신규 타입 import를 차단해 신규 참조만 공통 Pair 타입으로 수정했다. 기존 Annual/Major 각1건은 각각5417ms/5094ms에 STACK_TRACE_ERROR로 실패했다. 기본 testTimeout은5000ms이며 동시 실행 자원 경합에 따른 제한 초과로 추정한다. 기존 파일·설정을 변경하지 않고 해당 파일 전체를 독립 재실행했다. SingleLove56도 원래240초 설정으로 독립 실행했다. 최종16파일941개 고유 테스트 통과 영수증을 각각 보존했다. 전체 Suite는 실행하지 않았다.
- 기존 실패16파일:5837 PASS/46 FAIL 전후 동일. 실패 파일·이름·첫 오류·정규화된 전체 오류 메시지를 비교했다. 코호트는 겹치므로 합산하지 않는다.
- TypeScript0→0, lint/build 경고0, diff-check PASS. NFT88 app/server+2 Next roots의 경로 및 의존 파일 집합이 동일하다.
- 기존17권/102digest, 전체 Narrative·Book 객체와 오프라인 저장본 roundtrip, ParentChild40변형의 전체38성공 객체/2오류가 바이트 동일하다.
- 기존48worktree와 원본 미커밋11개, 기준4701파일을 보존했다. 지시문의47/4634는 이전 작업 전 수치이며 실제 기준을 사용했다.

`technical-validation.json`, `book-preservation.json`, `workspace-preservation.json`, `deterministic-rebuild-audit.json`에 증거를 기록했다. 운영 DB·고객 저장본·계산·점수·Writer/Reader·결제·인증·Worker·환경변수·master·Production은 변경하지 않았다.

## Git/Preview 영수증

이 보고서는 커밋에 포함되므로 자기 커밋 SHA를 본문에 고정하지 않는다. 최종 SHA/원격 일치/정확한 Vercel Preview READY 확인은 최종 응답과 `/tmp/gyeol-compatibility-parent-child-specialist-engine-01-validation/final-task-results.json`, `final-preview-receipt.json`에 기록한다. 커밋 시점의 아래 POST_PUSH 항목은 READY를 미리 주장하지 않는다.

## 요청된 최종 필드

- **TASK:** V4-COMPATIBILITY-PARENT-CHILD-SPECIALIST-ENGINE-01
- **BASE_SHA:** 4caa13a14f67f67908d9a510fc12a51eddebd0c5
- **BRANCH:** v4/compatibility-parent-child-specialist-engine-01
- **COMMIT_SHA:** POST_COMMIT_RECEIPT: git rev-parse HEAD
- **REMOTE_SHA_MATCH:** POST_PUSH_RECEIPT_REQUIRED
- **SPECIALIST_ENGINE:** CompatibilityParentChildSpecialistEngine.diagnose
- **SPECIALIST_STATUS:** COMPATIBILITY_PARENT_CHILD_SPECIALIST_ENGINE OFFLINE_IMPLEMENTED
- **PRODUCT_KEY:** saju_mbti_compatibility
- **RELATIONSHIP_CATEGORY:** parentChild
- **ROLE_VERSION:** compatibility-fixed-ab-v1
- **READER_CHAPTERS:** 9
- **READER_PARAGRAPHS:** 36
- **READER_ROLES:** 144
- **QUESTION_REGISTRY:** 180
- **RESEARCH_MATERIALS:** 120
- **CONDITIONAL_MATERIALS:** 108
- **RECALL_MATERIALS:** 12
- **MATERIAL_ROLE_LINKS:** 480
- **APPLICABLE_CATALOG_CANDIDATES:** 235
- **GRAPH_CASES:** 1
- **BINDER_EVALUATIONS:** 235
- **SOURCE_MATCH_BEFORE:** 526
- **SOURCE_MATCH_AFTER:** 526
- **ACTUAL_EVIDENCE_MATCH_BEFORE:** 50
- **ACTUAL_EVIDENCE_MATCH_AFTER:** 50
- **STRUCTURAL_MATCH_BEFORE:** 6
- **STRUCTURAL_MATCH_AFTER:** 6
- **FIXED_ROLE_VERIFICATION:** PASS: declared A parent/B child; actual parentage unverified
- **LEGACY_ROLE_BOUNDARY:** Q normalization accepted; V4 evidence rejected. R invalid version rejected. Legacy Books untouched.
- **Q_R_S_ROLE_REGRESSION:** PASS; Q/R expected errors preserved; S changes role declaration
- **PARENT_A_OWNER:** A only; no inference from gender, date, MBTI or name
- **CHILD_B_OWNER:** B only; no parent-source transfer
- **ACTUAL_PARENTAGE_STATE:** UNVERIFIED_ROLE_ASSIGNMENT; guardianship/authority UNKNOWN
- **SOURCE_USE_VALIDATION:** 8 adapter labels; 7 used in original materials, actual_natal_condition_required=0 preserved; no invented conjunction
- **CANONICAL_PAIR_EVIDENCE:** Original IDs, participants, positions, branches and producer witnesses only
- **SUPPORTED_CROSS_RELATIONS:** 5 kinds /34 definition memberships
- **UNSUPPORTED_CROSS_RELATIONS:** 30 definitions held; no new calculation
- **PAIR_PARTICIPANT_VALIDATION:** PASS: original native pairWitnessErrors
- **A_TO_B_DIRECTION:** A subject, B recipient/viewer; CH05 16 original materials
- **B_TO_A_DIRECTION:** B subject, A recipient/viewer; CH06 16 original materials
- **RECIPIENT_TEN_GOD:** Exact native relationId and tenGodKo; equal received gods retained
- **WHOLE_SWAP_VERIFICATION:** S: identity/direction swap preserved; WHOLE_SWAP_ROLE_DECLARATION_CHANGED; not equivalent family approval
- **NAME_ONLY_SWAP_VERIFICATION:** T: individual digests and received gods preserved; identity/name distinction retained
- **PARENTS_SOURCE_COVERAGE:** 16 types /55 original traits; file+record hashes verified; owner A; no scoring approval
- **CHILDREN_SOURCE_COVERAGE:** 16 types /63 original traits; file+record hashes verified; owner B; no development/ADULT transfer approval
- **CURRENT_SCORING_DOMAIN_BOUNDARY:** PARENTS/CHILDREN unsupported by current non-romantic projection; unchanged
- **MBTI_FREE_MATERIALS:** 27 conditional general-guidance materials; not personalized claims
- **MBTI_PAIR_SOURCE_COVERAGE:** 256 directed references:158 direct/98 inferred;3 selected/253 common reference
- **MBTI_PAIR_REFERENCE_POLICY:** No parentChildPattern. No lovePattern/marriagePattern transfer or scoring promotion.
- **INDIVIDUAL_FUSION_A:** Same-person natal+MBTI ancestry/rule/context required; UNKNOWN rule held
- **INDIVIDUAL_FUSION_B:** Same-person natal+MBTI ancestry/rule/context required; UNKNOWN rule held
- **DEVELOPMENTAL_CONTEXT_COVERAGE:** 5 original categories; actual payload does not supply verified stage
- **YOUNG_CONTEXT:** Executable context gate + minor responsibility; no adult judgment assumption
- **SCHOOL_CONTEXT:** Executable context gate; no school/score/ability inference
- **TEEN_CONTEXT:** Executable context gate; protection, voice, privacy, support separated
- **ADULT_CONTEXT:** Independent decision/consent required; no permanent parent final authority or assumption of no support need
- **UNKNOWN_CONTEXT:** Preserved; not TEEN; stage-specific application withheld
- **AGE_AND_STAGE_VERIFICATION:** No new age calculator; age/ability/support need remain unverified
- **MINOR_PROTECTION_POLICY:** Parent responsibility retained; child adult-level judgment or emotional duty blocked
- **ADULT_CHILD_AUTONOMY:** Decision/consent, permitted support and unknown authority separated; current Writer unchanged
- **ASYMMETRIC_RESPONSIBILITY:** All120 repairPlan.childMustRepairParent=false; JOINT and bidirectionality do not equalize duty
- **CHILD_EMOTIONAL_BURDEN_BLOCKING:** PASS in synthetic negatives; no burden/forced forgiveness/equal blame approval
- **CHILD_CHOICE_AND_HELP_SEEKING:** Optional voice/help/boundary; no forced disclosure or silence=trust inference
- **LEARNING_DEVELOPMENT_BOUNDARY:** 22 original learning theme views; ability/grades/development/parenting outcome claims blocked
- **FULL_ANCESTRY_DOMAIN_GATE:** Original 12-gate full ancestry + stricter offline non-romantic boundary; UNKNOWN not PASS
- **CHAPTER_COVERAGE:** 9 structural chapters; customer answerable0
- **PARAGRAPH_COVERAGE:** 36 structural paragraphs; no Writer filling
- **ROLE_COVERAGE:** 144 original roles /480 material contributions
- **CH05_DIRECTIONAL_COVERAGE:** 16 chapter materials; original AB lookup and reservations
- **CH06_DIRECTIONAL_COVERAGE:** 16 chapter materials; original BA lookup; child not parent regulator
- **CH07_FRICTION_POLICY:** Conditional friction distinct from actual abuse/history; no family blame from clash/harm
- **CH08_REPAIR_POLICY:** Prevention distinct from recovery; same preceding CH07 meaning/pair/root required; parent change and child options retained
- **CH09_RECALL_POLICY:** 12 original recall materials; exact actual displayed owner/type/role/root/direction/context/meaning/claim/address required
- **CHILD_SAFETY:** 12 explicit safety signals; unsafe forced contact/repair blocked; no diagnosis from MBTI/Saju
- **MEANING_IDENTITY_RESOLVED:** 0
- **MEANING_REVIEW_REQUIRED:** 120
- **SEMANTIC_CONFLICT_PAIRS:** 7140
- **CONFIRMED_CONFLICTS:** 0
- **DUPLICATE_FACT_GROUPS:** 2
- **VALID_DIFFERENT_APPLICATIONS:** 0
- **ROOT_REUSE_CONSTRAINTS:** Original informationRoots/supportingAncestryRoots distinct; no independent root or arbitrary budget issued
- **ACTUAL_CUSTOMER_ELIGIBLE:** 0
- **ACTUAL_SPECIALIST_CLAIMS_EMITTED:** 0
- **SYNTHETIC_SELECTION_TESTS:** Independent ParentChild registry:236 materials,180 questions,150 producer facts,20 registered displays; all12 original gates
- **SYNTHETIC_ALGORITHM_COMPARISON:** FIRST/QUESTION/GLOBAL:159/159/160 without display,179/179/180 with display; zero hard/owner/role/safety/claim violations; bounded search status honest
- **OPERATOR_REVIEW_WORKLIST:** 120 complete records; technical-source/witness/withhold priority only; customerRank=null
- **SOURCE_GROUP_BLOCKERS:** Source Group PASS0; original source groups/conditions retained; no undeclared AND
- **UNRESOLVED_REQUIREMENTS:** Full per-material source/domain/context/meaning/approval/counterexample/display gaps in missing-contracts/worklist
- **PRODUCER_GAPS:** No current PARENTS/CHILDREN scoring; missing rules/unsupported relations remain held; no producer IDs created
- **ADULT_V_CASE_AUDIT:** ACTUAL_READER_ADULT_BOUNDARY_RISK / CURRENT_WRITER_UNCHANGED / SPECIALIST_ADULT_CONTEXT_WITHHELD / FUTURE_WRITER_REPAIR_REQUIRED
- **EXISTING_FALLBACK_CASES:** L/M unchanged: compatibility-product-13d-7b-v1; Major REPEATED_LONG_PHRASE; BODY_LENGTH separate diagnostic
- **ACTUAL_PUBLISHED_EDITION_AUDIT:** 38 successes +2 expected errors compared; reader draft/validation/editorial and published Book distinguished
- **OTHER_SIX_CATEGORY_ISOLATION:** AE six actual categories and all original Foundation/category/Book digests unchanged
- **HARD_GATE_PRESERVATION:** All12 original Hard Gates rerun; real approvals0
- **DETERMINISTIC_BUILD:** PASS:18 frozen inputs; independent two runs;43 generated JSON exact bytes
- **PRIVACY_CHECK:** PASS: all new public JSON omit original fixture names/DOB; no actual customer/minor identities
- **CATALOG_PRESERVATION:** 59 JSON +all original4701 tracked file bytes preserved
- **SOURCE_VERIFICATION_PRESERVATION:** 20 JSON preserved
- **SEMANTIC_VERIFICATION_PRESERVATION:** 23 JSON preserved
- **EVIDENCE_GRAPH_PRESERVATION:** 105 JSON preserved
- **BINDER_PRESERVATION:** 83 JSON preserved
- **FOUNDATION_PRESERVATION:** 64 JSON preserved
- **OTHER_SPECIALIST_PRESERVATION:** CSE29/Career35/SingleLove38/Major28/Annual29 JSON preserved
- **LOVE_COMPATIBILITY_ENGINE_PRESERVATION:** 25 JSON /80 materials /760 evaluations /229 witnesses /12 structural /O,Q fallback unchanged
- **MARRIAGE_COMPATIBILITY_ENGINE_PRESERVATION:** 41 JSON regenerated exact /112 materials /222 evaluations /96 witnesses /4 structural /M,N,AB fallback unchanged
- **CALCULATION_PRESERVATION:** 17 Books/102 digests plus full40 pair packets byte equal
- **COMPATIBILITY_SCORE_PRESERVATION:** Original compatibilityIndex objects and directions byte equal
- **NARRATIVE_PRESERVATION:** All17 full narratives +38 successful pair narratives byte equal;2 expected errors equal
- **BOOK_PRESERVATION:** 17 full Books+offline snapshot roundtrip and38 successful pair Books byte equal; old stored Books not rewritten
- **EXISTING_TEST_FAILURES:** 5837 PASS/46 FAIL before=after; file/name/firstError/full normalized messages equal; entire suite not run
- **NEW_TEST_FAILURES:** 0;193 engine +11 artifact PASS;941 old related PASS; cohorts overlap, do not sum
- **TYPESCRIPT:** 0 before ->0 after; no new diagnostics
- **LINT:** PASS;0 warnings
- **BUILD:** PASS;0 warnings;88 app/server+2 Next root NFT paths/dependency sets exact
- **DIFF_CHECK:** PASS
- **VERCEL_PREVIEW:** POST_PUSH_EXACT_SHA_READY_RECEIPT_REQUIRED; never infer READY from local build
- **REMAINING_GAPS:** Source groups/domain approvals, actual stage/support/parentage,120 semantic/claim approvals, actual display ledger, unsupported relations/rules, original L/M fallback and adult V Writer risk. No customer activation.
- **NEXT_STAGE_READY:** Offline structured Global Planner handoff ready; customer Writer integration/sales/Production approval not granted; Coworker not started
