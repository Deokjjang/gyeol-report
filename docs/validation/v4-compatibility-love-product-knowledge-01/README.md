# V4 Compatibility Love Product Knowledge 01

연애 궁합 전용 **조건부 연구 DB**를 만들었다. 실제 원고·점수·발행에는 연결하지 않았으며 고객 승인과 판매 품질 PASS를 선언하지 않는다.

기준: `acb6f37556bd312386dec930dff80bbff94a41a4` / `v4/love-marriage-child-product-knowledge-01`.
독립 worktree: `/private/tmp/gyeol-compatibility-love-product-knowledge-01`.
원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`로 보존했다. 기존 24 worktree와 미커밋 11개 항목을 내용 hash·브랜치·HEAD·상태로 대조했다. 새 worktree를 포함한 총수는 25다.

## 읽을 자료

- [80개 자료 전체 독해본](materials-review.md), [장쌍 의미 비교](human-review.md), [coverage manifest](coverage-manifest.json)
- [9장 계약](pair-contract-matrix.json), [36문단](pair-paragraph-matrix.json), [144역할 원문](pair-role-matrix.json)
- [기존 실행 경로·제약 감사](runtime-path-audit.md), [후속 근거 연결 인수](binding-handoff.md)
- [79개 실제 원천 locator/hash/원문 상태](source-locator-audit.json), [기존 원천 전수 검증](source-verification.json)
- [64관계조합 원문/producer 대조](canonical-relation-source-audit.json), [256방향 Pair 원천](mbti-pair-source-audit.json)
- [A–X 생성 관찰](case-observations.json), [32변형 전후 digest](case-digest-preservation.json), [실제 생성 reader draft 전체](actual-offline-readers.md)
- [반려·보류](rejectedResearch.json), [의미 재사용](semanticReuseResearch.json), [원천/장면 중복 검사](duplication-audit.json)

## 수량과 근거 경계

80은 조건부 적용72+회수8이다. 역할 기여320, 관계표64, Pair crosswalk256, 기존2991행을 새 해석 사실로 더하지 않았다. 36문단마다2개 이상, CH05/06은 각각3개 후보를 작성했다. 임의 수량 상한을 적용하지 않았으나 모든256방향×36문단의 적용 후보가 완성됐다고 주장하지 않는다. 선택 Pair 원천10개, 개인 Fusion 연구5개는 구체 조건을 가진 subset이다. 나머지 source review는 실제 연결 승인이 아니다.

72개 비회수 후보는 각각 A/B 실제 source assignment를 요구한다. CH09 8개는 새 source를 도입하지 않고 동일 두 사람·유형·방향·조건의 실제 도입 의미만 회수한다. 정의 DB와 실제 계산 Evidence를 분리했다. 모든 신규 레코드의 runtime/customer/score는 false, runtimeEvidenceIds는 빈 배열이다.

현행 교차 producer는 육합·삼합·반합·충·해 5종. 64연구조합 중34개 membership만 대응하며 실제 참여 refs·formation이 추가로 필요하다. 천간합·형·파·원진30개는 미지원 보류다. MBTI forward direct158/inferred98과 reverse 상태를 그대로 보존한다. sourceCoverage direct는 저장소 출처 상태이며 과학적 관계 예측 검증을 뜻하지 않는다. 16유형 모두 가능한 관계라는 일반 원칙은 [Myers & Briggs Foundation](https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/)을 확인했으며, 현재 Socionics 계열 Pair 계보의 검증으로 쓰지 않았다. 경청·경계·자발적 대화 원칙은 [NHS](https://www.nhs.uk/every-mind-matters/lifes-challenges/maintaining-healthy-relationships-and-mental-wellbeing/)를 별도 참고했다. 외부 원문을 대량 복제하지 않았다.

## 실제 생성과 기존 한계

평가 시각은 2026-10-12 12:00 KST. 기준 SHA를 archive한 격리 경로와 새 worktree에서 실제 offline 유료 원고 경로를 실행했다. 24사례32변형의 계산·전체 근거·원고·integration·개인별 프로필·Book digest가 모두 동일하다. 양쪽 미상·시주 미상·같은 유형·역방향·동일 의미·실제 합/충 공존·관계 부재·지원범위 불일치·이름/전체 순서 교환·다른6관계 격리를 실제 producer로 확인했다.

모든32 reader draft는9장36문단이고 hardErrors/shortages는0이다. O/Q는 기존 동일 원국·관계 부재 사례로 BODY_LENGTH 진단(10072/10156) 및 CH02/03의 REPEATED_LONG_PHRASE Major가 있다. Major 때문에 기존 edition fallback을 선택하며 BODY_LENGTH 자체는 발행 실패 gate가 아니다. [기준 SHA 추가 재현](fallback-diagnostics.json)에 원인을 기록했다. 실제 선택된 Book은 전후 동일하며 reader draft를 선택된 고객판으로 오인하지 않도록 표시했다. 이 문제를 이번 연구 작업에서 수정하지 않았다.

현재 CH09 엔진에는 명시적 introduced ledger가 없다. 신규 자료의 회수 정책이 현재 생성기에 구현된 것으로 보고하지 않는다. 실제 타입×문단 binding, 원천 부족 시 후보 배정, 전 인구 선택 편중, Pair 계보, 미지원 관계 producer, 실제 고객 문체/판매 품질 검토는 후속 범위다.

## 검증 재현

`npx vitest run tests/unit/report-knowledge/compatibilityLoveResearch.test.ts`

관련32파일 목록은 related-paths.json, 원본 실행 결과는 각 .log에 있다. 6상품64건은 실제 계산·원고·근거·Book/snapshot·owner/shared·과거 저장본을 frozen lock과 대조한다. tsc/lint/build는 로컬만 실행했다. build의 유료 writer/Toss confirm/reliability API는 비활성화했으며 환경파일·운영 설정은 수정하지 않았다. 운영 DB·실결제·고객 데이터·master·Production에 접근하거나 변경하지 않았다.

기준 A–X 재현용 baseline-a-x-test.ts.txt는 새 생성기를 만드는 코드가 아니라 기존 offline 함수 호출 검사다. 기준 commit archive에 테스트 파일로 복사하고 COMPATIBILITY_RESEARCH_CASES를 이 보고서의 input-cases.json 절대경로로 지정한다. 결과 저장은 COMPATIBILITY_RESEARCH_CAPTURE로 repo 외부 경로를 지정한다. 기존 worktree에는 테스트를 복사하지 않는다.

## 최종 요청 항목

- **COMPATIBILITY_LOVE_STATUS:** 조건부 연구 DB 작성 완료. 실제 연결·고객 승인·판매 품질 승인은 하지 않음.
- **CHAPTER_COVERAGE:** 9/9 원문 계약 보존; CH01–04/07–09 각 8개, CH05–06 각 12개 후보
- **PARAGRAPH_COVERAGE:** 36/36; 각 2개, 방향별 CH05/06 각 문단 3개
- **SENTENCE_ROLE_COVERAGE:** 144/144 원문 역할 보존; 80×4=320 기여 링크. 링크는 별도 사실 수 아님.
- **LOVE_CATEGORY_SCOPE:** saju_mbti_compatibility / love만 신규 연구. 다른 6관계는 원문 보존·격리 검사.
- **EXISTING_PAIR_MATERIALS:** signed facet 17, context 7, repair 13축, scene 7×11 감사·불변
- **NEW_DISTINCT_MATERIALS:** 80개 적용/회수 연구. 전통 사실·검증된 관계 예측·모든 유형×문단 완성으로 집계하지 않음.
- **CONDITIONAL_APPLICATIONS:** 72개. 실제 owner/producer/type/signed-axis/Fusion 조건이 충족될 때만 후속 검토.
- **DIRECTIONAL_MATERIALS:** CH05 A→B 12, CH06 B→A 12, 방향별 회복 4. 방향 같음/다름을 창작하지 않음.
- **FICTIONAL_LOVE_SCENES:** 80개 가상·조건부 연애 장면. 실제 고객의 과거로 사용 금지.
- **PERSON_A_SOURCE_COVERAGE:** 72개 비회수 후보에 A 본인 source assignment. 16유형 전체 trait inventory·52개 선택 trait.
- **PERSON_B_SOURCE_COVERAGE:** 72개 비회수 후보에 B 본인 source assignment. A 자료로 대체하지 않음.
- **CANONICAL_PAIR_EVIDENCE:** 9종64조합 review; 현행 5종34 membership과 미지원 30조합 분리. actual refs/ID 없으면 관계 생성 금지.
- **MBTI_PAIR_SOURCE_COVERAGE:** 256방향 원문 pointer/hash·역방향 검증; direct158/inferred98 유지. 구체 후보 선택 Pair 원천10개.
- **FUSION_SOURCE_COVERAGE:** 기존44+96+신규연구24 원본 검증. 선택5개 연구 참조; A/B 개인별 양쪽 root 필요, 공통 Pair Fusion 생성 없음.
- **CH01_RELATIONSHIP_CORE:** 8개: 표현/생각, 안정/새로움, 실제 합/충, 같은 유형, 관계 기준·근거 경계
- **CH02_PERSON_A:** 8개: A의 처리·조건·허락된 도움·교정/반응 과용. B의 수신을 A source로 복사하지 않음.
- **CH03_PERSON_B:** 8개: B의 참여·조용한 행동·의견 안전·기억/질문·변경 책임
- **CH04_POSITIVE_COMPATIBILITY:** 8개: 공통 신뢰·돌봄, 호기심/연속성, 선명함/배려, 공동 활동·개별 강점. 자동 보완/성공 아님.
- **CH05_A_TO_B:** 12개: 수신자 B 기준 정관/식신/정재와 A의 제안·돌봄·부담·조정
- **CH06_B_TO_A:** 12개: 수신자 A 기준 정인/편인/비견과 B의 반응·행동·경계·정보 갱신
- **CH07_FRICTION:** 8개: 응답 속도·근거 부재·실제 충/해·교정/침묵·수고 경쟁·안전 경계
- **CH08_REPAIR:** 8개: 앞선 갈등 연결·A/B 수정·연락 합의 갱신·안전한 중단. 별도16개 갈등/회복 감사 view는 신규 사실 수 아님.
- **CH09_POSITIVE_DIRECTION:** 8개 모두 실제 introduced compatible subset 회수. 새 운세 없음. ledger 엔진 구현 없음.
- **ROMANTIC_ATTRACTION_DEPTH:** 관심의 표현과 실제 호감 수신을 분리. 표현 크기·반대 유형을 끌림의 증거로 쓰지 않음.
- **INTIMACY_DEPTH:** 함께 있는 시간과 혼자 쓰는 공간, 참여·거절·재연결 조건을 후보별로 구체화.
- **COMMUNICATION_DEPTH:** 답할 정보·대기 선택·들은 뜻·해석을 구분하고 조정 행동·수신자 질문을 별도 작성.
- **LOVE_PACE_DEPTH:** 만남 제안·반응·정리·관계 진전 동의를 별개로 다룸. 속도로 애정량을 판정하지 않음.
- **DIRECTIONAL_INTEGRITY:** A–X 실제 producer 32변형 및 whole swap에서 subject/target·recipient-ten-god·개인 digest 대조.
- **PERSON_OWNERSHIP:** 개인 natal/MBTI/Fusion, canonical relation, Pair reference, 두 방향을 별도 참조.
- **RECIPIENT_TEN_GOD_POLICY:** A→B viewer=B.dayMaster,target=A.dayMaster; B→A는 반대. 실제 동일 결과면 차이 창작 금지.
- **PAIR_EVIDENCE_POLICY:** 기존 actual canonical ID/refs만. 연구 ID는 branded CalculatedEvidenceId에 대입 불가.
- **POSITIVE_DEPTH:** 각 후보의 긍정 가능성·선택/동의·지속 조건을 따로 작성. 관계 성공 보장 없음.
- **RISK_DEPTH:** 각 후보의 과용·기대·정보 공백·선택권 제한 조건과 반례를 기록.
- **FACT_BOMB_DEPTH:** 실제 과거 폭로가 아니라 조건부 행동 비용. 도움≠대신할 권한, 수고≠청구권.
- **TWIST_DEPTH:** 미루는 답도 선택 정보, 작은 변경도 수고 보존 등 반대 활용 조건. 팩폭의 단순 긍정 재진술로 세지 않음.
- **REPAIR_DEPTH:** 발신자 수정·수신자 확인·공동 합의·재확인·안전한 중단 분리. 화해 강요 없음.
- **SEMANTIC_DIVERSITY:** 36축/109facet 중18축33facet 참조. 전 인구 선택 편중 및 모든 타입×문단 충분성 UNVERIFIED.
- **CHAPTER_INDEPENDENCE:** human-review.md의 8개 장쌍 대조. A/B 이름 교환만으로 별도 해석 집계하지 않음.
- **CROSS_CHAPTER_COHERENCE:** CH07→08 조건 연결, CH04/05/06 등→CH09 실제 도입 회수. 같은 유형/owner 조건 호환 검사.
- **DUPLICATION_AUDIT:** 80 core/scene 문자열 고유 + 이름 정규화 대조 + 실제 의미 독해. 문자열 고유만으로 품질 PASS 아님.
- **INPUT_CONTEXT_COVERAGE:** A–X 24사례32변형. positive-rich·friction 부족·Pair-repair 부재 범위를 실제 자료로 확인.
- **UNKNOWN_MBTI_POLICY:** 모르는 사람의 타입·MBTI/Fusion·양쪽 Pair를 보충하지 않음. 충분한 근거 없으면 후보 보류.
- **UNKNOWN_BIRTH_TIME_POLICY:** 미상 시주와 시주 관계를 만들지 않음. 남아 있는 실제 producer 결과만 사용.
- **SOURCE_VERIFICATION:** 2991 기존 연구·1213trait·256Pair·164Fusion연구·535 선행상품재료 locator/hash 확인. 외부2사이트 실제 열람.
- **UNVERIFIED_RESEARCH:** Pair 계보/예측력, 반합 학파 이견, 관계 자료의 E_UNVERIFIED 유지. 역사 원전 전부 재접속했다고 주장하지 않음.
- **REJECTED_INTERPRETATIONS:** 24반려+4보류 규정. 미지원 cross 관계30개 별도 보류. 원문 삭제/수정 없음.
- **EVIDENCE_BINDING_HANDOFF:** 타입 선언·요구사항 문서만. actual IDs/owner/refs/sign/source assignment/introduced ledger/dedupe 검증을 후속 인수.
- **RUNTIME_CONNECTION:** false; import/barrel/lookup/selector/resolver 연결 없음.
- **CUSTOMER_APPROVAL:** false; 실제 원고 판매 품질·배포 승인 없음.
- **CALCULATION_PRESERVATION:** 기준 SHA/변경 후 A–X32계산 digest 같음; 기존 source2435개 hash 동일.
- **NARRATIVE_PRESERVATION:** A–X32 원고·전체 근거·integration·양쪽 개인 digest 같음; 6상품64 기존 edition lock 비교.
- **BOOK_PRESERVATION:** A–X32 Book digest 같음; 6상품64 snapshot/owner/shared/과거 저장본 테스트. 운영 DB 접근/기존 구매자 재생성 없음.
- **TESTS:** 최종 unique 34파일 3597 PASS / 기존16 FAIL / 조건부1 미실행. 신규557, 관련32파일 최종2976 PASS+16 FAIL+조건부1, 6상품64 PASS. raw 관련17 FAIL 중 신규 symbol 격리 검사1건 수정 후 기준/변경후41 PASS 재검증.
- **EXISTING_FAILURES:** 기준 SHA16실패의 이름·오류 분류 동일: foundationAdapter1, customerDayunGeneration2, comprehensiveAllocation2, comprehensiveEditorialPlan1, 과거digest10. 기존 테스트 변경·skip 없음.
- **CONDITIONAL_NOT_RUN:** comprehensiveRelease의 기존 EDITORIAL_LEGACY_SNAPSHOT 조건부1건. targeted static-only 실행의25필터 제외는 별개이며 A–X 전체 실행에서 이미 PASS.
- **NEW_REGRESSIONS:** 0; 신규 symbol 명칭 격리 충돌1건 수정 및 기준/변경후41건 PASS. test-results.json에 raw→최종 중복 제거 기준 기록.
- **TYPESCRIPT:** 기준 0 진단줄 → 최종 0 진단줄. 신규 선언/테스트 작성 중 오류는 수정 후 재검증.
- **LINT_BUILD:** lint 오류/경고0, Production build47/47 및 NFT경고0 확인. diff-check 별도 로그.
- **BRANCH:** v4/compatibility-love-product-knowledge-01
- **COMMIT_SHA:** 이 보고서를 포함하는 브랜치 tip; 최종 응답에 실제 SHA 기재
- **REMOTE_SHA_MATCH:** commit/push 후 git rev-parse HEAD와 git ls-remote refs/heads/v4/compatibility-love-product-knowledge-01 일치 확인. 최종 응답에 실제 SHA.
- **REMAINING_GAPS:** 실제 binding/ledger/원고 연결 미구현(이번 범위 밖), 256×36 후보 완성·선택 편중 미검증, 미지원cross30개·Pair 계보 보류, O/Q 기존 fallback, 기존 실패16건.
- **NEXT_STAGE_READY:** 조건부 연구 인수 가능. 별도 승인 없이 실제 연결/다른6카테고리/생성기 개선을 시작하지 않음.
