# V4-CAREER-MONEY-STUDY-PRODUCT-KNOWLEDGE-01

커리어 전용 독립 연구 DB를 추가했다. 기존 코드·원천 정의·원고·계산·Book은 수정하지 않았다. 이번 완료는 연구 자료 구축·정형 등록·검증에 한정한다. 모든 연구는 미연결·미승인 상태이며, 보류 항목과 기존 실패를 남겼다.

기준: `v4/comprehensive-product-knowledge-01` / `df70c0d587b2e0af17d6bacb64fca92d32a4df30`. 원격 기준 SHA를 대조한 뒤 `/private/tmp/gyeol-career-product-knowledge-01`에 독립 worktree를 만들었다. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3` 그대로다. 기존22 worktree·원본 미커밋11개 파일을 branch/HEAD/status/파일hash로 보존했다. 새 worktree 포함 총23개다.

## 최종 보고 항목

| 항목 | 실제 결과 |
|---|---|
| CAREER_KNOWLEDGE_STATUS | RESEARCH_READY_CONDITIONAL — 전용 DB 등록·감사 완료, 원천/개인 적용 보류를 분리. 실증·고객 승인·runtime 연결은 미완료이며 이번 범위 밖. |
| CHAPTER_COVERAGE | 9/9, 원본 title·domain 유지 |
| PARAGRAPH_COVERAGE | 36/36, 원본 purpose 유지; 문단당 5~10개 독립 질문·응용 후보 |
| SENTENCE_ROLE_COVERAGE | 144/144 원본 role 유지, 768개 기여 연결; 연결 수를 새 지식 수로 합산하지 않음 |
| EXISTING_CAREER_FACETS | 17/17 signed 의미·기존 본문·hash 보존 및 기능 차이 감사 |
| EXISTING_CAREER_ROUTES | 8/8 기존 순서·성립·rank 계약 불변 |
| EXISTING_JOB_FUNCTIONS | 11개 기존 장면 그룹/3개 상세 단계; 실제 V3 분류와 V4 override·unknown 별도 관찰 |
| EXISTING_MATERIAL_COVERAGE | 14 export 컬렉션 전체 inventory·hash 보존. 혼합된 map/tuple 항목 수를 독립 의미 수로 세지 않음 |
| NEW_DISTINCT_MATERIALS | 192개 직접 작성 후보: 조건부 전문 응용171, 회수20, 전거 보류1. 새 전통 사실·실증 사실0. |
| CONDITIONAL_APPLICATIONS | 23개 직무 프로필 + 세부 업무24질문(23조건부/1개 개인 원천 연결 보류). 상태×직무 Cartesian 완성률 사용 안 함. |
| FICTIONAL_JOB_SCENES | 192재료·23직무·24세부과제에 가상 장면 필드. 239장면 레코드가 239새 사실이라는 뜻은 아님. |
| CH01_WORK_IDENTITY | 20후보: 첫 정보·근거 층위·착수/진행/완료·작동 환경 |
| CH02_STRENGTHS | 20후보: 기능·독립 재능·전이·실력 검증 |
| CH03_JOB_FIT | 26후보: 실제 8경로·대상/산출물·준비·회피/조정 |
| CH04_ORGANIZATION | 20후보: 전달 정보·역할/권한·즉시 비용·문화 질문 |
| CH05_CURRENT_CAREER | 25후보: 10상태·detailJob 과제·성장·다음 선택 |
| CH06_MONEY | 20후보: 상징/자산·제공 가치·숨은 투입·회수/관리 |
| CH07_STUDY | 20후보: 이해/수행·분야별 검증·학습 착각·자격/전문성 |
| CH08_SUCCESS_FACTBOMB | 21후보(보류1): 긍정 상징·기여·성장 비용·현실 조건 |
| CH09_CAREER_STRATEGY | 20회수: 실제 도입된 호환 부분집합만; 새로운 개인 사실0 |
| JOB_STATUS_COVERAGE | 실제 enum10/10, 미입력·기타·쉬는 상태·가사/돌봄을 구별 |
| DETAIL_JOB_COVERAGE | 23직무 프로필, 24세부 질문, A~T20사례/24변형; 미지원 분류를 숨기지 않음 |
| WORK_FUNCTION_DEPTH | 과제·과정·산출물·협업·어려움·환경·학습·결과 검증을 직무별 분리 |
| JOB_RECOMMENDATION_DEPTH | 8경로를 실제 업무로 설명하되 기존 추천 proof·순위가 있을 때만 후속 적용 |
| AVOID_ENVIRONMENT_DEPTH | 직무별 불편 조건23 + CH03 회피/조정5후보; 실제 avoid proof 필수 |
| FREELANCER_DEPTH | 목적·범위·제작·수정·납품·회수·재의뢰. 사진12질문, 번역/디자인/영상의 다른 과제 포함 |
| EMPLOYEE_DEPTH | 실제 역할·자료·판단권·평가·기여; 권한 증가와 일감 증가 구별 |
| STUDENT_DEPTH | 전공·실습·팀 역할·독립 수행·전이, 성적·상업 경력 추정 금지 |
| JOB_SEEKER_DEPTH | 공고의 하루·작은 샘플·필수 기술·지원 조건, 취업 보장 금지 |
| SELF_EMPLOYED_DEPTH | 직접 품질·상품별 투입·주문 흐름·반복 부담 |
| BUSINESS_OWNER_DEPTH | 인력 존재부터 확인·위임 권한·질문 통로·재현 가능 결과 |
| ECONOMIC_VALUE_DEPTH | 사용처·기여·제공 범위·가격/보상·회수·매출/남는 자원 구별 |
| MONEY_RISK_DEPTH | 수정 범위·도구/수요 간격·속도 투입·기회비용·지원·고정/변동/시간 |
| LEARNING_DEPTH | 개념·실습·대화·이야기·단계 학습과 독립 수행 구별 |
| PROFESSIONAL_SKILL_DEPTH | 새 조건 적용·피드백·포트폴리오·수료/자격/권한 구별 |
| SAJU_SOURCE_COVERAGE | 기존 명리 연구2181항목을 포함한2991 전수 pointer/hash; 선택된 본인 원국 정의12개. 기간·Pair 자동 이전 금지. |
| MBTI_SOURCE_COVERAGE | 1213 trait, 개인 연구512 포함531레코드, 추천190/회피120. 실제 선택 trait99개, 원래 coverage 유지. |
| FUSION_SOURCE_COVERAGE | 기존44+96 규칙/hash·양측 조건, 신규 미등록24, 전체164 연구 crosswalk. 실제 선택 연구5개. |
| SEMANTIC_FACET_COVERAGE | 36축/109facet 보존·조사, 실제 참조24facet. 축 점수·가중치 변화0. |
| POSITIVE_DEPTH | 좋은 업무 기능·유효한 전통 상징·실현 조건; 승진/부/합격 보장 없음 |
| RISK_DEPTH | 과용의 대상·조건·반례를 분리, 현재 실패로 서술하지 않음 |
| TWIST_DEPTH | 모름 공개·작은 범위·지원 경계·한계·기준의 의외 활용 |
| FACT_BOMB_DEPTH | 좋은 의도와 실제 작업 비용의 차이, 사람 평가·예언으로 전환 금지 |
| JOB_SCENE_SPECIFICITY | 재무 가정/번역 용어/사진 선별/개발 재현/교육 전이/돌봄 인계 등 과제 차이 독해 감사 |
| CHAPTER_INDEPENDENCE | 12재사용 정책으로 업무 방식/능력/직무/현재/경제/학습/장기 비용/전략 구분 |
| CROSS_CHAPTER_COHERENCE | 같은 root 유지, 새 질문·대상·조건을 추가할 때만 응용·회수 |
| SEMANTIC_DUPLICATION | 문자열 유일성뿐 아니라 7필수 장 쌍과 즉시/자원/장기 비용의 의미 비교 기록 |
| INPUT_CONTEXT_COVERAGE | A~T20사례24변형 실제 오프라인 생성; 모두9장36문단·진단0. 판매 품질 승인은 아님. |
| UNKNOWN_MBTI_POLICY | 명리에서 유형 생성 금지; MBTI/Fusion 필수 역할은 보류 |
| UNKNOWN_BIRTH_TIME_POLICY | 기존 confirmed/stable/candidates와 지원 범위 유지; 시주·완성 구조·전체 부재 합성 금지 |
| SOURCE_VERIFICATION | 2991 inherited·1213 trait·117선택 locator·164Fusion·179종합·310직업 hint 실제 로컬 원천/hash 대조. 직무 공식 자료6개 Tasks 확인. |
| UNVERIFIED_RESEARCH | 전통→현대·MBTI→능력의 실증 미확립. 문창1/사진 현장 개인 근거 연결1 보류. 외부 고전 전체 재열람은 하지 않음. |
| REJECTED_INTERPRETATIONS | 24반려/보류 기록, 원천의 유효한 의미는 보존 |
| READER_CONTRACT_MAPPING | career_money_study→CH/P/S/material, 원래9/36/144 주소·purpose·role 고정 |
| CAREER_QUESTION_MAPPING | K1~K10 별도 다대다 참고 행렬; K8 current/K9 legacy 추천/K10 operating의 실제 경로 구분 |
| EVIDENCE_BINDING_HANDOFF | 입출력·owner·버전/hash·직무/상태·조건/반례·root·도입 ledger·보류 사유를 타입/문서로 인수. 실행 engine0. |
| RUNTIME_CONNECTION | 0 — import/lookup/barrel/selector 연결 없음 |
| CUSTOMER_APPROVAL | 0 — 모든 신규 연구 connected/approved/score false, runtimeEvidenceIds [] |
| CALCULATION_PRESERVATION | 2275기존 파일 hash, 6상품64고정 회귀 전후PASS, Q/R 원국 계산 동일 |
| NARRATIVE_PRESERVATION | 6상품 최신 draft/fullEvidence/narrative/integration digest 불변; A~T24 first/final digest 동일 |
| BOOK_PRESERVATION | 6상품 Book/snapshot/pageStructure 불변, 저장6권 owner/shared 재열람PASS·재생성 없음 |
| TESTS | 신규467PASS; 관련17파일1651PASS/기존16FAIL/조건부1미실행; 별도6상품64PASS. 비중복 최종1715PASS. |
| EXISTING_FAILURES | 알려진6 + 이번에 발견·정확한 기준SHA에서 재현한 오래된5상품 digest 기대10 = 총16. 수정/삭제/skip0. |
| CONDITIONAL_NOT_RUN | 기존 snapshot fixture 의존1. 추가 실패 재현 -t 필터의 미선택36은 별도이며 PASS 아님. |
| NEW_REGRESSIONS | 0 |
| TYPESCRIPT | 기준0 → 최종0, 신규0 |
| LINT_BUILD | lint PASS; 최종 webpack Production build PASS 47/47·NFT0·신규 경고0. diff-check PASS. 최초 폰트 DNS 제한 실패와 네트워크 재검증을 분리. |
| BRANCH | v4/career-product-knowledge-01 |
| COMMIT_SHA | 보고서를 포함한 최종 Git SHA는 커밋 후 최종 응답과 git rev-parse HEAD로 확인 |
| REMOTE_SHA_MATCH | 커밋·push 후 git ls-remote origin refs/heads/v4/career-product-knowledge-01에서 최종 확인; 최종 응답에 결과 기록 |
| REMAINING_GAPS | 문창 전거/사진 현장 원천 연결 보류, 기존 MBTI hint 미해결 trait3, 사진 등 상세 parser 공백, 기존 실패16, 모든 고객 적용·binding·생성기 연결 미구현. |
| NEXT_STAGE_READY | 조건부 연구 인수 가능. 보류 원천·개인 조건을 해결/검토해야 하며 자동 고객 적용·판매 승인·다음 단계 착수는 하지 않음. |

## 산출물과 읽기 순서

- [coverage manifest](coverage-manifest.json), [기존 연구 inventory](research-inventory.md), [원천 대조 결과](source-verification.json)
- [원본9장 계약](career-contract-matrix.json), [36문단](career-paragraph-matrix.json), [144역할](career-role-matrix.json), [17facet 감사](career-facet-audit.json)
- [기존 커리어 자료 전수](existing-career-inventory.json), [8route](existing-career-routes.json), [직무 프로필](job-function-inventory.json), [10상태](job-status-research.json), [세부 업무24질문](detail-job-applicability.json)
- [실제 연구 재료 전체192개](materials-review.md), [직무 장면 전체](job-scenes-review.md), [경제 자료 전체](money-materials-review.md), [학습 자료 전체](study-materials-review.md), [긍정·팩폭·반전](positive-factbomb-review.md)
- [명리·MBTI 기존2991 항목 대조](inherited-career-applicability.json), [164Fusion 대조](fusion-career-crosswalk.json), [종합179개 참고 경계](comprehensive-material-crosswalk.json), [MBTI 직업 hint310](mbti-career-hints-inventory.json)
- [독해·의미 감사](human-semantic-review.md), [재사용 정책](semantic-duplication-audit.json), [보류·반려](rejected-and-held.json), [실제 입력 생성 관찰](actual-career-context-observations.json)
- [후속 binding 인수](binding-handoff.md), [현 생성기 한계](current-generator-audit.md), [보존 결과](preservation-results.json), [테스트 결과](validation-results.json), [실제 실행 로그](logs/)

실제 타입/내용은 `src/lib/report-knowledge/career-product-research/`의 독립 레지스트리에 있다. chapter01~09Materials의 192레코드, JobResearch23, DetailApplication24, StatusResearch10, 원천117, 계약/역할/재사용/반려 자료를 분리했다. 경제·학습·긍정·장면 읽기 문서는 같은 정형 자료의 보기이며 별도 신규 사실 수에 더하지 않는다.

## 실제 관찰과 미해결 항목

- 사진 A는 `unknown`, S의 상품·인물 사진가도 모두 `unknown`이다. 동일 조건 S 두 원고 중 34/36문단이 같았다. 현재 상세 사진 분류/해석의 공백이며 이번에는 변경하지 않았다.
- 번역은 V3 직접 분류 unknown이지만 V4 override로 language_mediation이다. 매장·가사/돌봄·쉬는 상태도 실제 V4 경로를 별도 관찰했다.
- 원천 hint 3건: INTP recommendedJobs[1]→deep_project_learning, INTP recommendedJobs[2]→intellectual_depth, ENFP avoidJobsOrEnvironments[3]→meaning_based_study는 해당 유형 trait 목록에서 찾을 수 없었다. 원본은 수정하지 않았으며 연결 전 점검 사항이다.
- 문창 배치 전거와 현행 표의 대조는 기존 보류다. 사진 사전 계획/현장 적응 질문은 개인 적응 능력의 실제 source 연결이 부족해 별도 보류했다.
- 현재24변형의9/36·분량9,318~9,591자·품질 진단0이 판매 원고 깊이나 모든 입력의 완전성을 증명하지 않는다. 후보 선택 편중은 모집단을 측정하지 않아 UNVERIFIED다.
- 추가 기존 실패10건은 현재 writer로 생성한 결과를 옛 digest와 비교한다. 실제 저장 Book이 변한 증거가 아니다. 정확한 기준SHA 사본의 기대/실제 digest 배열까지 동일했다. [재현 증거](baseline-additional-failures.json). 최신6상품 고정 digest와 실제 과거6권 저장본 재열람은 모두 통과했다.

## 외부 자료와 승인 범위

직무의 과제 범위만 [O*NET Photographers](https://www.onetonline.org/link/summary/27-4021.00), [Software Developers](https://www.onetonline.org/link/summary/15-1252.00), [Instructional Coordinators](https://www.onetonline.org/link/summary/25-9031.00), [Food Service Managers](https://www.onetonline.org/link/summary/11-9051.00), [Registered Nurses](https://www.onetonline.org/link/summary/29-1141.00), [Management Analysts](https://www.onetonline.org/link/summary/13-1111.00)에서 확인했다. 각 자료의 범위·접근일·한계는 [외부 출처 검토](external-source-review.md)에 기록했다. 미국의 직무 자료를 한국 제도나 개인 적성의 증명으로 사용하지 않는다.

신규 전통 사실·실증 사실·개인 계산 Evidence·점수·추천 순위·runtime import/lookup·고객 승인은 모두0이다. master·Production·DB·migration·결제·인증·환경변수 파일·기존 구매자 Book은 변경하지 않았다. 다음 상품 DB·표현 DB·binding·원고 생성기 작업을 시작하지 않았다.
