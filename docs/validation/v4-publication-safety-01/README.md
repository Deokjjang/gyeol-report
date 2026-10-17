# V4-PUBLICATION-SAFETY-01

**오프라인 발행 안전성 구현 완료, 실제 고객 적용은 미승인이다.** 실제 V4 생성기 39사례를 두 독립 프로세스로 실행했다. 32개는 기존 Book 모델·검증·직렬화 재열람을 통과했다. CHILDREN 위험 7사례는 원래 위치에서 모두 재현했으며, 허용되지 않은 전체 Domain 계보를 제외하면 필수 Reader 문단이 부족해져 **새 Book 전체를 보류**했다. 보류 사례에는 Snapshot/Book hash가 없고 재열람도 거부한다. 자동 검증을 사람의 판매 품질 승인으로 해석하지 않는다.

Base `c315a04e31b316a88e1f0bc28169484379187a13`, 독립 브랜치 `v4/publication-safety-01`이다. 실제 최종 commit·원격 SHA·Preview는 자기 참조 hash를 피하기 위해 최종 응답과 Git 외부 `/tmp/gyeol-publication-safety-01-validation/release-receipt.json`에 확정한다. master/Production/운영 DB/결제/Auth/Worker/환경변수/기존 구매 Book은 변경하지 않았다.

실제 호출은 기존 `generateV4ShadowReport` → 동일 계산·MBTI·Fusion → 원래 ID/전체 부모 계보의 오프라인 publication view → 기존 궁합 Writer/Reader의 명시적 새 Edition → 기존 Publisher → 타입이 명시된 Snapshot factory → 기존 Book/JSON 재열람이다. 다른 다섯 상품은 원래 결과를 그대로 사용한다. 고객 경로에는 이 진입점을 연결하지 않았다. 기존 Writer는 기본 호출에서 원래 출력·Edition을 유지한다.

기존 `projectRelationshipView`는 일부 허용 노드만 확인한 뒤 전체 MBTI side/파생 Candidate에 남은 CHILDREN 등 다른 Domain 부모를 함께 사용할 수 있었다. 새 검사에서는 원래 node/claim/Fusion/resonance/trait/guidance 부모를 실제 ID로 추적한다. 원래 view Domain 밖의 부모, 누락·순환 계보가 있으면 파생 side/Candidate 전체를 보류한다. 일부 부모를 지운 뒤 기존 score/band를 재사용하거나 Source ID를 바꾸지 않는다. 계산·원천 MBTI/Fusion·canonical 궁합 지수는 그대로다. 계산된 side가 있다는 사실만으로 Domain 사용 승인이 생기지 않는다.

일반 조건형 조언에는 입력에서 선언된 역할을 사용하고, 그 문장이 사용하지 않은 원국/Fusion 전체를 출처로 붙이지 않는다. 역할 선언은 실제 친자 관계·연령·법적 보호 권한의 확인이 아니다. Source/의미 검사는 기존 Writer의 명시적인 재료·계약 범위이며 범용 NLP 의미 동등성 판정이나 연구의 12 Hard Gate 승인으로 주장하지 않는다. 기존 30 Synthetic 정의는 계속 SYNTHETIC_TEST_ONLY이고 고객 승격은 0이다.

|구분|결과|
|---|---|
|VALID_GENERATED_CONTENT / SAFE_TO_PUBLISH|32개 오프라인 기존 Writer 계약 통과;7개 필수 근거·구조 부족으로 보류|
|APPROVED_FOR_CUSTOMER_USE|0;새 고객 Runtime 적용 미승인|
|HUMAN_QUALITY_APPROVED|false;전체 Book 독해 승인 아님|
|원래 고객 Reader Bridge|0;질문2060개와 원래 계약 보존|

A~H의 상태와 근거는 [risk resolution](publication-risk-resolution.json)에 있다. Source 초기3202 중 원래 복구525개의 locator/파일·record hash를 현재 소스에 다시 확인했고 잔여2677개를 유지했다. Domain2966/명시 금지1040과 대운10개 mfpr:god의30 SOURCE_INTEGRITY 보류도 유지했다. 대운30건의 과거 Receipt와 참조 자료가 보존됐다는 뜻이며 새 Binder 재승인이나 같은 이름의 십성 출처 대체를 실행하지 않았다.

|CHILDREN 원래 사례|원래 Reader 주소|최종 새 발행|
|---|---|---|
|coworker/W/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|manager-report/AJ/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|manager-report/AK/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|business-partner/AM/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|business-partner/AN/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|friendship/A0/0|CH07.P1|WITHHELD:필수 Source/Reader 부족|
|friendship/H0/0|CH04.P1|WITHHELD:필수 Source/Reader 부족|

Friendship H0의 원래 주소는 CH04.P1이다. 다른 여섯 사례의 CH07.P1과 혼동하지 않았다. 각 사례의 실제 Source/domain/owner/direction/전체 부모 hash·원고 전후·입력 hash는 [children validation](children-provenance-validation.json)에 있다. `sourceGroup`의 설명 값은 기존 Writer 비교 출처 상태이며, 새 Native 연구 Source Group ID 또는 승인된 crosswalk가 아니다. 필수 재료가 사라진 정확한 Candidate/전체 부모/Domain 이유와 남은 licensed row 수는 [Source 부족 상세](publication-source-shortages.json)에 별도로 기록한다. CHILDREN 단어가 화면에 없는 것만으로 판정하지 않는다. canonical 지수의 불변은 CHILDREN의 직접 점수 기여도를 인과적으로 측정했다는 뜻이 아니다.

원래 Reader 실패18건(Love O/Q;Marriage M/N/AB;ParentChild L/M;Coworker L/M/AG;ManagerReport L/M/AL;BusinessPartner L/M/AO;Friendship L0/M0)을 실제 원래 입력으로 재생성했다. 독립적인 MBTI 근거를 첫 소개와 개인 장에서 구분하고, 같은 필요·강점을 가진 B의 문단은 A의 정의 반복 대신 A의 제안을 받는 조건과 도움을 쓰는 상황을 설명한다. Validator의 반복 판정을 완화하거나 단순 동의어 치환으로 통과시키지 않았다. 27개 완성 궁합 Edition은 9장·36문단·144역할을 유지한다. CH05 A→B/CH06 B→A, 실제 표시된 문제에 대한 Repair/선행 근거의 Recall을 검사한다. Source 부족7건의 부분 Reader를 완성 Book이라고 집계하지 않는다.

ParentChild V의 CH06.P4.S3 실제 문장:

> 수정 전: 자녀는 해보고 싶은 일과 도움이 필요한 곳을 말할 수 있으며, 부모가 안전과 최종 결정의 책임을 맡아야 합니다.

> 수정 후: 자녀는 해보고 싶은 일과 필요한 도움을 직접 말할 수 있으며, 부모는 위험과 지원 방법을 설명하되 조언을 건네는 일과 자녀의 결정을 대신하는 일을 구분해야 합니다.

같은 문단의 근거·방향은 `editorial:FUSION:fusion:REINFORCE:EXPRESSION:social:EXPRESSION:1:EXPRESSION:1` / `foundation:element:FIRE:STRONG` / 기존 B→A다. 이 명리 근거를 법적 결정권의 근거로 삼지 않는다. CH08.P2의 보편적인 부모 최종 책임 단정도 수정했다. V/A의 성인·미성년자 생년월일 변형은 가상 입력이며, 실제 보호자 권한/동의/지원 필요는 UNKNOWN으로 유지한다. 지원 필요를 INDEPENDENT/NEEDS_SUPPORT로 무단 승격하는 경우도 거부한다. [authority validation](adult-child-authority-validation.json).

새 Entry는 독립 검증되지 않은 Legacy를 발행하지 않는다. 기존 Writer의 `publishedEdition` 값은7건에서 진단상 Legacy를 선택하지만 새 Publisher가 내보내는 Snapshot은 null이다. 이 선택을 실제 신규 발행으로 부르지 않는다. 기존 유료 Worker나 결제 후 제공 정책을 이번 단계에서 바꾸지 않았다. 실제 고객 적용은 별도 승인과 Source/Reader 충족이 필요하다. [fallback validation](legacy-fallback-validation.json).

Snapshot draft union에 `V4CustomerReport`를 추가했고 기존 오프라인 실제 Fixture도 타입이 있는 원래 factory를 사용한다. V4를 Legacy draft로 cast하지 않는다. 기존 V2/V3/V4 저장본의 Validator dispatch와 Reader는 그대로이며 재생성하지 않는다. contentDigest는 손상 검사이고 고객 승인·발행 권한이 아니다. private generation receipt도 오프라인 검증용이며 owner/90일/공유/구매 권한을 부여하지 않는다. [snapshot contract](snapshot-contract-validation.json).

대형 전후/Source 부족 자료 두 개는 기존 `DeterministicArtifactWriter`의 무손실 GZIP 저장을 재사용한다. `.json`은 삭제·요약본이 아닌 payload/논리 hash·크기 manifest다. 기존 `readGlobalArtifact(directory, name)`로 원래 JSON byte를 그대로 복원했으며 [저장 검증](artifact-storage-validation.json)에 기록했다.

전후573개는 케이스별 Reader 문단 변경 기록이며 안전484/편집89로 구분했다. Source 부족으로 보류한 부분 Reader의 차이도 포함하므로573개를 새 고객 발행으로 집계하지 않는다. 원래 텍스트 hash와 Source/Root/MBTI/Fusion/direction을 유지하며 표시 예시의 가상 이름만 `{personA}`/`{personB}`로 가렸다. 이름이 포함된 정확한 원문은 원래 Fixture를 동일 입력 hash로 재실행할 수 있다. [전체 전후 비교](before-after-publication.json).

|검증|Base → Current|
|---|---|
|새 publication 단위 / versioned artifact|30 PASS +22 PASS;21 실제 출력 변조 차단|
|기존 관련16파일|5837 PASS/46 FAIL →동일 개수;새 실패한 테스트 identity0|
|Editorial/Planner/Approval / 기존 통합|543 PASS +74 PASS →동일|
|BusinessPartner 기본 예산|382 PASS/1 FAIL →동일;기본5초 artifact 출력 예산 실패 서명 동일|
|추가 local PGlite Runtime|31 PASS/9 FAIL →동일;8개 기본5초 시간 제한/1개 all-src 정적 검사|
|TypeScript / ESLint|0→0 / PASS·경고0|
|Production build|Node24.22.0/Next16.2.4 양쪽 PASS·관찰 경고0|
|기존 Book 보존|17권/102 digest 및 전체 JSON byte 동일;다른5상품 원고 불변|
|실제 NFT|90경로·raw 의존 집합 동일;새 offline runtime 유입0|

관련46실패 중40서명은 같고6개 과거 전체 byte 보존 검사는 이번 허용된 Writer 파일을 먼저 만나 서명이 달라졌다. Runtime all-src 검사도 Base의 기존 오프라인 producer 대신 새 오프라인 ancestry 파일을 먼저 가리킨다. 고객 Runtime 유입은 실제90개 NFT로 별도 검사했다. [파일·이름·전체 오류·서명 비교](regression-comparison.json). 전체 suite PASS라고 선언하지 않는다.

새 artifact 검사의 원래4932 hash/원래 source-input hash 파일은 수정하지 않았다. 이번에 허용된 세 코드 수정과 보존 검사 코드 자체의 before/after만 별도 `source-revision-contract.json`으로 고정하고 그 파일 hash를 새 publication 회귀에서 독립 확인한다. 나머지4932 원본 identity와 source-input은 원래 값으로 검사한다. 테스트 삭제/skip/timeout 증가/any/ts-ignore/검사 비활성화는 없다. 초기 중단·초안 주소/분류·과부하 시간 제한 실행은 외부 로그에 남기고 PASS로 집계하지 않았다.

독립 최종 생성2회는39사례와20개 code/input hash를 전후 봉인했고7개 물리 산출물이 byte 동일했다. Source 기술 검증도 독립2회 동일했다. 실제 generator loop wall은 411.88/410.09초, user CPU 423.14/421.31초, Node maxRSS 1.097/1.057GiB다. bootstrap 준비와 환경 정보는 논리 결과에 섞지 않았다. CLI Node25.9.0, build Node24.22.0을 각각 양쪽 동일하게 사용했다. heap8GiB는 테스트 설정이며 최소 필요량이 아니다. [결정론·리소스](deterministic-validation.json).

원본 checkout의11 dirty 파일·브랜치·HEAD는 정확히 보존됐다. 기존62개 중45개는 파일/상태까지 같고17개 오래된 /private/tmp checkout은 작업 중단 이후 .git 표시 파일과 소스가 사라진 상태를 관찰했다. 원인은 확정하지 못했으며 이 작업에서 해당 경로를 삭제/정리한 명령은 없다. 17개는 시작 당시 clean이었고 HEAD/branch ref는 모두 유지된다. 자동 복원/정리는 하지 않았다. 전체 worktree 파일 보존 PASS라고 주장하지 않는다. [관찰한 정확한 경로·수량](workspace-preservation.json). Git 외부 전후 전체 hash ledger를 보관한다.

Source/Domain/2060 Bridge/실제 승인,7개 Source-limited Book,기존56개 실패/시간 예산,17개 checkout drift,고객 적용 승인 및 사람의 전체 독해가 남는다. 다음 Technical Stabilization은 인계 자료만 준비했고 시작하지 않았다. [handoff](technical-stabilization-handoff.json). [전체 최종 필드](final-report-fields.json), [실행 manifest](publication-safety-manifest.json), [privacy](privacy-audit.json), [원래 참조 hash](original-reference-hashes.json).

|최종 항목|결과|
|---|---|
|TASK|V4-PUBLICATION-SAFETY-01|
|BASE_SHA|c315a04e31b316a88e1f0bc28169484379187a13|
|BRANCH|v4/publication-safety-01|
|COMMIT_SHA|Final response and external release-receipt.json after commit|
|REMOTE_SHA_MATCH|Exact final receipt after push|
|PUBLICATION_SAFETY_STATUS|OFFLINE_PUBLICATION_SAFETY_IMPLEMENTED / SAFETY_VERIFIED_WITH_BLOCKERS / CUSTOMER_ACTIVATION_NOT_AUTHORIZED|
|SOURCE_RISKS|525 exact technical proofs reverified;2677 held|
|DOMAIN_RISKS|2966 retained;1040 prohibited;0 new approvals|
|READER_BRIDGE_RISKS|2060 original questions held;0 customer bridges|
|CHILDREN_PROVENANCE|7/7 reproduced;all7 new Books withheld after full ancestry filtering|
|ADULT_CHILD_AUTHORITY|CH06.P4/CH08.P2 corrected offline;adult/minor birth-date fixtures;legal/consent/support facts UNKNOWN|
|COMPATIBILITY_CASES_CHECKED|34 pair cases/7 categories;39 total including five single products|
|COMPATIBILITY_CASES_REPAIRED|18 original Reader failures;27 complete pair editions including representative routes and authority cases|
|COMPATIBILITY_CASES_WITHHELD|coworker W;managerReport AJ/AK;businessPartner AM/AN;friendship A0/H0|
|LEGACY_FALLBACK|7 diagnostic Legacy selections withheld;0 unsafe Snapshot emissions|
|PUBLISH_GATE_INTEGRITY|Existing paid gate unchanged;offline full-source/roles/Repair/Recall/structure gate enforced|
|PUBLISHED_EDITION_VALIDATION|32 offline models valid;7 withheld;0 actual customer publications|
|SNAPSHOT_TYPE_CONTRACT|Explicit V4CustomerReport draft;typed factory;no legacy cast|
|VERSIONED_PUBLICATION|compatibility-publication-safety-01-v1;existing Edition preserved|
|STORED_BOOK_PRESERVATION|17 original fixture Books/102 digests/full JSON identical;32 safe new roundtrips;7 denied|
|INTENDED_SAFETY_CHANGES|484 case-paragraph corrections;89 editorial corrections;withheld Reader diagnostics included|
|UNINTENDED_REGRESSIONS|0 default Book/calc/score/profile changes;0 newly failing test identities|
|ACTUAL_OPERATOR_APPROVED|0|
|ACTUAL_CUSTOMER_APPROVED|0|
|ACTUAL_CUSTOMER_ELIGIBLE|0|
|ACTUAL_CUSTOMER_CLAIMS|0|
|ACTUAL_BOOK_ALLOCATIONS|0|
|READER_QUESTIONS_PRESERVED|2060|
|CUSTOMER_READER_BRIDGES_VERIFIED|0|
|NEW_TEST_RESULTS|30 publication tests PASS;22 versioned artifact tests PASS;21 actual-output mutations blocked|
|EXISTING_TEST_RESULTS|5837P/46F;Editorial/Planner/Approval543P+Integration74P;BP382P/1F;local PGlite31P/9F;Base/current counts equal|
|EXISTING_FAILURE_SIGNATURES|40/46 known identical;6 intentional source-hash diagnostics changed;BP timeout identical;8/9 local runtime identical/1 offline all-src scanner diagnostic changed|
|TYPESCRIPT|0 before/0 after|
|LINT|PASS/0 warnings|
|BUILD|Base/current Node24.22.0 Next16.2.4 PASS/observed warnings0|
|DIFF_CHECK|PASS|
|CALCULATION_PRESERVATION|39 before/after calculations, pair scores/directions/profiles equal|
|NARRATIVE_PRESERVATION|Five other products and default Writer unchanged;all573 new case-paragraph differences recorded|
|BOOK_PRESERVATION|Old snapshots/readers unchanged;no customer DB access or regeneration|
|NFT_TRACE_PRESERVATION|90 routes/raw dependency sets equal;0 new offline runtime entries|
|DETERMINISTIC_VALIDATION|2 independent39-case processes;7 physical outputs equal;20 source/input hashes sealed;2 exact Source-proof runs equal|
|PRIVACY_CHECK|See privacy-audit.json;raw inputs and generation logs external|
|ORIGINAL_CHECKOUT_PRESERVED|PASS:11 dirty files/branch/HEAD exact|
|EXISTING_WORKTREES_PRESERVED|PARTIAL:45/62 exact;17 old temporary checkouts observed missing;all HEAD/branch refs retained;cause unconfirmed|
|VERCEL_PREVIEW|Exact final branch/SHA/project/nonProduction receipt after push|
|PREVIEW_URL|Final response and external release-receipt.json|
|REMAINING_BLOCKERS|7 Source-limited Books;2677 Source/2966 Domain/30 major integrity holds;2060 bridges/real approvals;56 existing test failures;17 temporary checkout drift;human review/customer activation|
|TECHNICAL_STABILIZATION_HANDOFF|Prepared;next stage not started|
|NEXT_STAGE_READY|Technical handoff only;customer/sales/Production authorization not granted|
