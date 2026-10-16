# V4-GLOBAL-SOURCE-DOMAIN-RESOLUTION-01

상태: **OFFLINE_RESOLUTION_OVERLAY_IMPLEMENTED**. 기준 `d288dd1ae54e5f1663ced1644d9d8132daff1a08`의 Global Audit를 동결한 별도 기술 복구다. 기존 Source/Domain 결과, 원본 Receipt, 연구 DB, Binder/Foundation, 12 Specialist, 고객 Runtime을 변경하지 않는다. Operator/Customer 승인·고객 선택·Claim·Book 배정·새 Fact Root는 모두 0이다.

실행: `node tools/global-source-domain-resolution/verify.mjs /tmp/<새 빈 출력 디렉터리>`. CLI는 저장소 루트에서 실행한다. 평가 시각·27개 입력은 원래 Foundation의 고정 오프라인 검증 경로를 그대로 사용한다. 네트워크 호출은 차단한다. 기존 Catalog와 Graph를 한 번 만들고 실제 12개 `diagnose(request, prepared)`가 원래 Binder에 넘긴 Candidate를 캡처한다. Frozen Global Artifact는 기존 `readGlobalArtifact`로 복원하며 payload/shard/logical SHA·개수·순서를 검증한다. 큰 출력도 기존 무손실 gzip/shard 계약을 사용한다.

|지표|기존 감사|새 Overlay|
|---|---:|---:|
|전문 엔진 / Graph|12 / 27|동일|
|원래 Candidate-Fixture 분모|5,073|동일|
|Source match|10,536 → 11,170|별도 559회 재평가에서 +48|
|Actual evidence match|917 → 1,489|증가 0|
|Structural match|81 → 81|증가 0, 원래 81 보존|
|미복구 Source|3,202|2,677|
|새 기술 복구 참조|0|525|
|Domain Queue / 명시 금지|2,966 / 1,040|승인 변경 0|
|Source Group / 기술 차단|192 / 188|변경 0|
|직접 독해 제안|이번 작업 전 기록 보존|12개 Unique Material, 12엔진|
|고객 승인 / 선택 / Claim / 배정|0|0|

525는 독립 개인 사실이나 독립 자료 525개를 뜻하지 않는다. 원래 ReferenceKey 525건에 대한 기술적 원본 연결이다. 새 증거를 계산하지 않았다. 별도 기술 재평가 559회는 원래 5,073회와 별도 Cohort이며 합쳐서 원래 분모를 바꾸지 않는다. 508개 selector proof는 이미 유일하게 매칭된 기존 witness의 Producer identity를 추가 제약으로 고정한 refinement다. null selector·미정형 월간/본기 역할을 새로 선택한 것이 아니다.

|기존 미복구 분류|Before|실제 기술 복구|기술 미복구 유지|
|---|---:|---:|---:|
|DOCUMENTARY_REFERENCE_ONLY|623|0|623|
|FUTURE_REQUIREMENT_ONLY|1,418|0|1,418|
|AMBIGUOUS_SOURCE|48|0|48|
|ORIGINAL_LOCATOR_MISSING|78|0|78|
|SOURCE_RECORD_MISSING|90|42|48|
|UNSUPPORTED_REFERENCE|945|483|462|
|합계|3,202|525|2,677|

복구 근거: 원본 `depth()`의 `v4:material-depth:${feature}` 선언 319회, `buildMaterialRegistry()`의 `v4:semantic-meaning:${feature}` 52회, `STRUCTURE_REGISTRY`의 structure-rule/material 56회씩, 기존 SHINSAL_RULES convention의 정확한 `code` 필드 27회, `annualMonthExtendedEvidence`가 실제 출력하는 전체 파일/export/code 참조 15회. 유사 ID·유사 의미·다른 Group의 원천으로 대체하지 않는다. 모든 참조의 원래 native Source Verification 결과를 다시 실행해 동일 hash를 대조한 뒤 별도 proof만 추가한다.

Locator Missing 78회는 원래 README가 명시한 `tests/fixtures/temporal-interaction-01/offline-periods.json`의 case ID·연도/월을 확인했다. 원래 문자열은 실제 JSON Pointer가 아닌 논리 주소다. 정확한 snapshot 위치/hash를 **DOCUMENTARY_SNAPSHOT** proof로 기록했으며 현재 사용자의 실제 원본·Graph Evidence로 승격하지 않았다. 따라서 Overlay의 DOCUMENTARY_ONLY는 기존 623 + 추가 snapshot 확인 78 = 701이며, 기술 미복구 수에서 78을 빼지 않는다. 모호한 48회는 경쟁 위치/판본을 고르지 않고 보류한다.

원래 대운 SOURCE_INTEGRITY FAIL 30회는 10개 `mfpr:god:*` × 3 fixture다. 자체 연구 Record/파일 hash는 PASS다. 원래 Domain SOURCE_INCOMPLETE가 `tr:god:*`의 `traditionalRef` 설명문을 정확한 출처 참조로 해결하지 못해 Binder source gate를 막는다. 예: 상관의 `기존 기준 밖의 표현과 재검토; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.`는 원문 판본/ID가 아니다. 이름이 같은 십성 정의로 바꾸거나 파일 손상이라고 주장하지 않는다. 전체 해당 Receipt·원래 Requirement·조상 Domain Decision·Source Receipt는 `major-source-integrity-failures.json`에서 확인한다.

Domain 2,966개는 원래 판정 EXPLICITLY_PROHIBITED 1,040 / SOURCE_INCOMPLETE 331 / POLICY_REVIEW_REQUIRED 1,094 / SEMANTIC_REVIEW_REQUIRED 499 / CONDITIONAL_CROSSWALK_REVIEWED 1 / REVIEWED_MEANING_NOT_CUSTOMER_APPROVED 1을 보존한다. 새 기술 proof가 연결된 참조는 11회이며 정책·의미 승인으로 변경하지 않는다. CHILDREN/PARENTS, WORK/CAREER/THINKING, MONEY/INVESTMENT 금지, 모든 Required Ancestry, 상품·관계·실제 입력 조건을 유지한다. Group source 전체·원래 AND/조건부 표시·owner/type을 검사하며 실제 CH08/CH09 표시 이력은 발급하지 않는다.

직접 독해는 높은 Structural 연결을 우선해 9개 기존 Structural 사례와 Career/Major/Annual 대표 3개를 선정했다. 원문 12개를 실제 읽고 개별 조건·반례·금지·관련되지만 다른 의미를 작성했다. 이 중 원래 Domain Queue에 속하는 자료는 1개다. Queue 전체를 읽었다거나 60개를 검토했다고 주장하지 않는다. 새 proposal은 모두 MODEL_PROPOSED_REVIEW다. 원래 Queue의 의미 독해·운영자 승인 기록은 바꾸지 않는다. supporting source는 원문/hash로 첨부하지만 외부 웹 원문을 이번에 새로 확인했다고 주장하지 않는다.

`direct-meaning-review-packets.json`은 실제 원문·원래 출처/조건/반례·scoped witness·상품·질문·Reader address·정책·고유 model proposal과 선택하지 않은 운영자 결정지를 제공한다. 6개 의미 관계 역시 제안이며 승인된 동치가 아니다. APPROVE_FOR_FURTHER_REVIEW는 추가 검토를 허용하는 선택지일 뿐 실제 binding/customer approval을 발급하지 않는다. 승인 provider·전자서명·운영자 ID를 만들지 않았다.

원래 Native Receipt와 GateState는 전부 재생성해 Frozen case의 canonical logical hash와 대조한다. 새 Overlay는 structured clone에서 정확한 declared source만 추가하고 기존 단일 witness의 Producer 제약만 보강한다. 원래 조건·gap·role·기간·display·Group·정책을 삭제하지 않는다. Owner/Direction/Time/Domain/Meaning/Counterexample/Customer Gate를 Source proof로 PASS로 바꾸면 실패한다. Major의 10년 Cycle·14년 horizon·교운, Annual의 실효 연주·가변 segment·월간/본기, A/B·수신자 십성·고정 역할은 원래 실제 Graph와 Binder의 계약을 그대로 이용한다.

다음 검토는 소스 원문/판본 공급, 명시적 Alias/Grammar, Producer 주소·selector의 owner/direction/time/participants 계약, 실제 사용자 맥락, Domain 정책, 의미/반례, 실제 운영자 승인으로 구분한다. 단순 Fixture witness 부재를 Producer 부재라고 단정하지 않는다. 질문 L2 같은 요구는 Reader-question 참조이며 Evidence ID로 바꾸지 않는다. 525개 Source 기술 proof와 12개 독해 packet은 다음 검토에 인수할 수 있으나 고객 Planner/Runtime 연결 준비 완료를 뜻하지 않는다.

검증의 원시 실행 시간·RSS·임시 경로·최종 Git/Preview 영수증은 Git 외부 `/tmp/gyeol-global-source-domain-resolution-01-validation/`에 둔다. 최종 정형 보고는 해당 경로의 `final-task-results.json`을 함께 확인한다. 아래 기계 산출물은 원래 5,264 파일과 신규 source/test/CLI 입력 12개의 hash를 검사한다.


검증: 신규 actual CLI/회귀 63 PASS, 기존 Source/Semantic/Storage 4파일 110 PASS. BusinessPartner 전체 Engine+Artifacts 383개는 명령행 30초에서 PASS다. 기존 코드·테스트·설정은 변경하지 않았다. 기본 5초 산출물 쓰기 검사는 현재 Base 전체 실행과 선택 격리 실행에서 모두 시간 제한 실패가 재현됐다. 최초 로그와 별도 30초 assertion 결과를 보존하며, 기존 46개 내용/계약 실패와 다른 Cohort로 보고한다. 최종 추가 비교는 supplemental receipt에서 확인한다. 전체 Suite PASS를 주장하지 않는다.

기준/변경 후 Production build는 고정 lockfile로 설치한 독립 의존성에서 Node24로 PASS·0경고다. TypeScript 0→0, lint 0경고, NFT90 동일·새 코드/JSON 유입0이다. 초기 임시 dependency copy의 Turbopack postcss resolve 오류, 테스트 metadata 디렉터리 누락, CHILDREN 기대값의 잘못된 Queue 참조는 별도 중간 로그로 보존하고 수정 후 실제 검증을 다시 실행했다. CHILDREN/PARENTS는 native 전문 정책의 경계이며 Domain Queue의1040개 명시 금지와 동일 집합으로 취급하지 않는다.

17권/102 digest·Friendship20사례/140 digest·40개 전체 profile(각 측308,432,008 bytes)와 원고/Book 전체 JSON이 전후 byte 일치한다. 저장본 offline roundtrip도 PASS다. 원래54worktree의 HEAD·브랜치·tracked/nonignored 파일, main11개 dirty 파일, 기존5,264파일을 보존한다. 실제 구매자의 DB 저장본을 읽거나 수정하지 않았다.

산출물 조회:

|내용|파일|
|---|---|
|actual-producer-support-index|[actual-producer-support-index.json](actual-producer-support-index.json)|
|binder-reevaluation-results|[binder-reevaluation-results.json](binder-reevaluation-results.json)|
|book-preservation|[book-preservation.json](book-preservation.json)|
|candidate-resolution-impact|[candidate-resolution-impact.json](candidate-resolution-impact.json)|
|deterministic-rebuild|[deterministic-rebuild.json](deterministic-rebuild.json)|
|direct-meaning-review-packets|[direct-meaning-review-packets.json](direct-meaning-review-packets.json)|
|domain-policy-boundaries|[domain-policy-boundaries.json](domain-policy-boundaries.json)|
|domain-resolution-overlay|[domain-resolution-overlay.json](domain-resolution-overlay.json)|
|final-report-fields|[final-report-fields.json](final-report-fields.json)|
|future-producer-requirements|[future-producer-requirements.json](future-producer-requirements.json)|
|global-deterministic-validation|[global-deterministic-validation.json](global-deterministic-validation.json)|
|global-resolution-manifest|[global-resolution-manifest.json](global-resolution-manifest.json)|
|known-failure-comparison|[known-failure-comparison.json](known-failure-comparison.json)|
|major-source-integrity-failures|[major-source-integrity-failures.json](major-source-integrity-failures.json)|
|operator-review-worklist|[operator-review-worklist.json](operator-review-worklist.json)|
|original-counterexample-audit|[original-counterexample-audit.json](original-counterexample-audit.json)|
|original-receipt-preservation|[original-receipt-preservation.json](original-receipt-preservation.json)|
|planner-readiness-delta|[planner-readiness-delta.json](planner-readiness-delta.json)|
|privacy-audit|[privacy-audit.json](privacy-audit.json)|
|remaining-blocker-matrix|[remaining-blocker-matrix.json](remaining-blocker-matrix.json)|
|review-readiness-index|[review-readiness-index.json](review-readiness-index.json)|
|semantic-relationship-proposals|[semantic-relationship-proposals.json](semantic-relationship-proposals.json)|
|source-alias-fragment-audit|[source-alias-fragment-audit.json](source-alias-fragment-audit.json)|
|source-exact-proofs|[source-exact-proofs.json](source-exact-proofs.json)|
|source-group-impact|[source-group-impact.json](source-group-impact.json)|
|source-missing-originals|[source-missing-originals.json](source-missing-originals.json)|
|source-original-preservation|[source-original-preservation.json](source-original-preservation.json)|
|source-resolution-overlay|[source-resolution-overlay.json](source-resolution-overlay.json)|
|source-resolution-priority|[source-resolution-priority.json](source-resolution-priority.json)|
|source-unsupported-references|[source-unsupported-references.json](source-unsupported-references.json)|
|source-version-proof-audit|[source-version-proof-audit.json](source-version-proof-audit.json)|
|technical-resolution-delta|[technical-resolution-delta.json](technical-resolution-delta.json)|
|technical-validation|[technical-validation.json](technical-validation.json)|
|typed-selector-gap-matrix|[typed-selector-gap-matrix.json](typed-selector-gap-matrix.json)|

큰 파일의 JSON header는 삭제된 요약본이 아니다. 기존 `readGlobalArtifact(directory, filename)`로 전체 데이터를 복원한다. original-receipt-preservation의27개 case hash를 Frozen Global case에 연결하면 원래5,073개 Receipt·gate 전체를 확인할 수 있다. candidate-resolution-impact의 원래 주소·질문·source group을 Source ReferenceKey와 join하고 binder-reevaluation-results의 독립 새 Receipt·적용 proof·남은 gate를 비교한다.

최종 Git/원격/Preview 값은 자기 참조 commit hash 문제 때문에 이 커밋 전 문서와 별도인 `/tmp/gyeol-global-source-domain-resolution-01-validation/final-task-results.json`에 기록한다. Preview READY를 확인하기 전에는 READY라고 선언하지 않는다. master/Production/DB/결제/Auth/Worker/환경/기존 고객 Book은 변경하지 않았다. Operator Approval·Global Planner·한국어 Editorial·고객 Runtime 연결은 시작하지 않는다.

추가 비교 완료: BusinessPartner 기본5초 선택 검사는 Base와 변경 후 모두1 FAIL/360필터이며 전체 정규화 오류 stack이 일치한다. JSON 원시 메시지는 `STACK_TRACE_ERROR`다. 두 기본 실행의 기간이5초를 넘고 동일 검사가 명령행30초에서 Base 선택1 PASS, 변경 후 전체 Engine+Artifacts383 PASS로 통과하므로 기존 시간 예산에 민감한 실패로 분류한다. 원래 test/config를 바꾸거나 기본 실패를 성공으로 기록하지 않았다. [전체 영수증](business-partner-budget-comparison.json).

최종 보존·개인정보 영수증: [worktree/dirty 보존](workspace-preservation.json), [전체 신규 JSON 개인정보 검사](final-privacy-validation.json). hash manifest의 두 기존 파일명에는 token-hash 설계/RPC 이름이 있지만 값은 파일 SHA256뿐이며 실제 자격증명은 없다. 전체 신규 논리 JSON과 압축 payload를 검사했다.
