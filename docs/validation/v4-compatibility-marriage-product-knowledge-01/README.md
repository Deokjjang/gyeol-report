# V4-COMPATIBILITY-MARRIAGE-PRODUCT-KNOWLEDGE-01

결혼 카테고리 전용 독립 연구 DB를 구축했다. **9장·36문단·144역할, 112개 자료(100 조건부 응용/12 회수)**다. 원천 정의·MBTI Pair inventory·역할 링크·주제별 뷰를 별도 신규 사실로 부풀리지 않았다. **runtime 미연결, 고객 승인 false**이며 기존 고객 원고·점수·Book은 바꾸지 않았다.

기준 branch `v4/compatibility-love-product-knowledge-01`, SHA `be3c00ed36c9bb96ab6a104c8241a5137ef27094`. 시작 시 원격 SHA 일치 확인. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`, 미커밋11항목이 있었다. 다른25개 worktree를 보호하고 `/private/tmp/gyeol-compatibility-marriage-product-knowledge-01`에서 작업했다. reset/restore/stash/clean을 사용하지 않았다.

- [기계 coverage manifest](coverage-manifest.json), [원래9장 계약](marriage-contract-matrix.json), [36문단](marriage-paragraph-matrix.json), [144역할](marriage-role-matrix.json)
- [112개 전체 자료 독해](materials-review.md), [36문단 의미 비교](human-review.md), [love/marriage 차이](love-marriage-difference-audit.json), [재사용/중복 감사](duplication-audit.json)
- [실제 실행 경로 감사](runtime-path-audit.md), [현재 입력의 한계](actual-input-limitations.md), [출처 및 미검증](sources-and-unverified.md), [원천 locator/hash](source-locator-audit.json), [A/B crosswalk](person-source-crosswalk.json)
- [A–AB 입력](input-cases.json), [실제 결과](case-observations.json), [기준/후 digest](case-digest-preservation.json), [원문 발췌](actual-reader-excerpts.md), [사례 해석 범위](input-context-review.md)
- [후속 binding 인수](binding-handoff.md), [검증 결과](validation-results.json), [worktree 보존](worktree-preservation.json)

자료의 핵심 차이는 '도움'에서 '준비부터 확인·예외·다음 기억까지의 책임'으로, '절약'에서 '공동/개인 비용과 결정권·정보 경계'로, '가족을 잘 챙김'에서 '외부 약속 전 공동 동의'로 질문을 구체화한 것이다. CH07은 반복되는 조건, CH08은 권한·담당·다시 볼 때, CH09는 실제 도입된 호환 의미만 회수한다. 256방향을 감사했으나 전문 후보가 모든 방향/문단을 채운다고 주장하지 않는다.

기존 코드의 marriage→married 편집 매핑과 실제 A 원고의 '배우자' 표현은 미확인 혼인 상태를 오인시킬 위험이다. 새 자료에서는 UNKNOWN을 유지하지만 기존 원고는 범위 제한에 따라 수정하지 않았다. M/N/AB는 기존 editorial Major로 legacy fallback한다. BODY_LENGTH 진단만이 발행 gate라는 주장은 하지 않는다.

로컬 build는 `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack`. 환경파일·운영 설정을 수정하지 않았다. 유료 생성 API·운영 DB·결제·실제 고객 Book·master·Production에는 변경을 실행하지 않았다.

기존16실패/조건부 미실행1은 정확한 기준 archive에서 먼저 재현했다. 신규 연구 테스트626 및32변형 실제 생성 검증30은 통과했다. 최종 기존 관련34파일 집계와 실패 이름·메시지 비교는 validation-results.json 및 baseline/after 로그에 있다. 조건부 미실행은 성공으로 계산하지 않는다.

## 요청된 최종 보고 항목

- **COMPATIBILITY_MARRIAGE_STATUS:** 독립 연구 DB 구축 완료. 조건부 연구·인수 자료이며 고객 적용/판매 승인 아님.
- **CHAPTER_COVERAGE:** 9/9. 기존 제목·key 보존.
- **PARAGRAPH_COVERAGE:** 36/36. 문단마다 2~4개 후보와 구별된 결혼 생활 질문.
- **SENTENCE_ROLE_COVERAGE:** 144/144 원문 역할 보존. 448개 후보 역할 링크는 신규 사실로 집계하지 않음.
- **MARRIAGE_CATEGORY_SCOPE:** saju_mbti_compatibility / marriage만. 다른 관계 카테고리 연구 시작 안 함.
- **EXISTING_PAIR_MATERIALS:** 17 signed facets, 7 context, 13 repair axis, 7×11 scene 역할 재감사. 원문/hash 보존.
- **NEW_DISTINCT_MATERIALS:** 112개 연구 항목. 신규 전통 명리 사실0, 신규 실증 심리 사실0.
- **CONDITIONAL_APPLICATIONS:** 100개 현대 공동생활 조건부 응용 + 12개 회수.
- **DIRECTIONAL_MATERIALS:** A→B 20개 / B→A 20개. CH05/06 각16 + CH08 각4.
- **FICTIONAL_HOUSEHOLD_SCENES:** 112개. 실제 혼인·동거·과거 경험으로 서술하지 않음.
- **PERSON_A_SOURCE_COVERAGE:** A 후보13유형·32개 owner 원천 참조. sourceKey·actual natal/Fusion 요구 분리. 전체16유형 원천 inventory 보존; 전 유형×전 문단 충족은 미검증.
- **PERSON_B_SOURCE_COVERAGE:** B 후보15유형·40개 owner 원천 참조. sourceKey·actual natal/Fusion 요구 분리. A 특성 복사 금지.
- **CANONICAL_PAIR_EVIDENCE:** 64조합 재사용.34 membership 지원/30 교차 미지원. 실제 relation ID·refs·기둥·성립 조건 요구.
- **MBTI_PAIR_SOURCE_COVERAGE:** 256방향 실제 marriagePattern 및 역방향 pointer/hash. direct158/inferred98. 후보 사용10방향, 공통참고246방향. 전체 의미 완성 아님.
- **FUSION_SOURCE_COVERAGE:** 164개 연구 및44/96 기존 규칙 hash 보존. 후보 선택5개 개인 Fusion. 기존 context/domain 밖 자동 적용 보류.
- **CH01_RELATIONSHIP_CORE:** 8개. 공동 결정 기준·실제 관계 종류·유형 source field·미확인 상태 구분.
- **CH02_PERSON_A:** 8개. A의 생활 기준·휴식·완결 책임·관리 과용.
- **CH03_PERSON_B:** 8개. B의 독립적인 실행·공간·인정·가족 경계·변경 비용.
- **CH04_POSITIVE_COMPATIBILITY:** 12개. 예산 확인·관리 책임·자율성·준비/유지·휴식·가족 연결의 적용 조건.
- **CH05_A_TO_B:** 16개. B 수신 기준의 A 도움·남는 비용·A 조정.
- **CH06_B_TO_A:** 16개. A 수신 기준의 B 도움·준비/대기·B 조정.
- **CH07_HOUSEHOLD_FRICTION:** 16개. 돈/공간/휴식/친족 차이, 실제 관계와 비인과성, 반복 고리, 안전 경계.
- **CH08_REPAIR:** 16개. 공동4/A4/B4/장기합의4. 완료·권한·준비·미결·인수인계·재검토.
- **CH09_POSITIVE_DIRECTION:** 12개 모두 선행 의미 회수. 같은 person/type/root/direction/전제와 실제 표시 ledger 필요.
- **HOUSEHOLD_RESPONSIBILITY_DEPTH:** 업무 발견→준비→결정→실행→확인→예외→다음 기억. 담당·지원·정보·권한·재검토 구분.
- **FINANCIAL_DECISION_DEPTH:** 공동/개인 항목, 목적·감당 범위·동의권·정보 경계·조건 변화. 금액/비율/투자/법률/세금 처방 금지.
- **INVISIBLE_LABOR_DEPTH:** 22개 주제 참조. 실행만의 도움과 준비·확인까지의 완결 책임 차이.
- **AUTONOMY_DEPTH:** 개인/공동 공간·중단 없는 시간·남은 업무 담당·정보 공유 동의.
- **FAMILY_BOUNDARY_DEPTH:** 14개 주제 참조. 친족 요청과 두 사람의 선택을 분리. 외부 약속 전 시간/비용/정보 동의.
- **LIFE_TRANSITION_DEPTH:** 13개 주제 참조. 변화는 가상 검토 계기. 현재 여력·남은 일·권한·인수인계·다음 주기 검토.
- **DIRECTIONAL_INTEGRITY:** 실제 방향 ID와 sender/recipient 분리. 양방향 동일 십성은 차이 창작 안 함.
- **PERSON_OWNERSHIP:** A/B 개인 원국·MBTI·Fusion·Pair 참고·외부 안내의 소유권과 sourceUse를 구분.
- **RECIPIENT_TEN_GOD_POLICY:** AB viewer=B.dayMaster,target=A.dayMaster. BA viewer=A.dayMaster,target=B.dayMaster.10십성 질문.
- **PAIR_EVIDENCE_POLICY:** 정의/연구 ID는 계산 Evidence 아님. 지원 관계·실제 참가자·중복 root 확인.
- **MARRIAGE_STATUS_INFERENCE_POLICY:** UNKNOWN. marriage와 내부 married를 실제 혼인·동거 증거로 사용 금지.
- **UNKNOWN_HOUSEHOLD_POLICY:** 실제 가사 능력·분담·과거 갈등·생활 이력·직업 UNKNOWN.
- **UNKNOWN_FINANCES_POLICY:** 소득·자산·채무·계좌·지출 이력 UNKNOWN. 비용은 질문만.
- **UNKNOWN_CHILDREN_POLICY:** 자녀·양육·임신·가족 구성 추론 금지.
- **POSITIVE_DEPTH:** 선택권·준비/유지 담당·실제 수신 조건에서의 강점. 결과 보장 안 함.
- **RISK_DEPTH:** 좋은 의도→상대에게 남을 시간/비용/재량의 조건을 분리.
- **FACT_BOMB_DEPTH:** 인격 비난 대신 결정권·관리·대기·정보 비용을 구체화.
- **TWIST_DEPTH:** 수정 가능한 기준·완결 책임·정보 경계·작은 시험이 강점을 살릴 조건.
- **REPAIR_DEPTH:** 현재 한 문제·당사자 권한·담당·준비/확인·예외·재검토를 질문. 강제 화해 없음.
- **SEMANTIC_DIVERSITY:** 18축37facet 참조.36문단 질문과112후보를 독해 비교. 수량/문자열 유일성만으로 품질 PASS 아님.
- **CHAPTER_INDEPENDENCE:** 개인 특성/방향 수신/반복 조건/조정 절차/회수의 정보 역할을 구분.
- **CROSS_CHAPTER_COHERENCE:** CH07→08 및 CH05/06→08→09 참조·타입 호환 검사. 실제 도입 ledger 미구현.
- **LOVE_MARRIAGE_DIFFERENTIATION:** 호감·연락·친밀감 대비 책임·돈·시간·준비/유지·장기 재협의로 독립 작성.
- **DUPLICATION_AUDIT:** love80개와 핵심/장면 비교 및36문단 의미 검토. 원천·공통 정의의 정당한 재사용8군 별도 기록.
- **INPUT_CONTEXT_COVERAGE:** A–AB 28사례/32변형 실제 생성.31 marriage+1 love 대조. U–Z 가상 맥락은 payload 밖.
- **UNKNOWN_MBTI_POLICY:** 필요한 개인 MBTI/Fusion/Pair 보류. 현재 새112후보 모두 양쪽 유형 필요; 미상용36문단 충족 주장은 하지 않음.
- **UNKNOWN_BIRTH_TIME_POLICY:** 시주·관련 관계를 보충하지 않음. 실제 남은 기둥만 사용.
- **SOURCE_VERIFICATION:** 기존2991record·1213trait·선택82locator·256Pair hash/state 확인. 외부3문맥 자료 실제 열람 범위 기록.
- **UNVERIFIED_RESEARCH:** Pair 계보/예측 검증·전통 이견·미지원30관계·context/domain 밖 적용 보류. SAGE 본문 timeout; fulltext 검증 주장 안 함.
- **REJECTED_INTERPRETATIONS:** 29 반려 /5 보류. 혼인·재정·자녀·능력 단정, 성별 분담, 보장, 감시 정상화 등.
- **EVIDENCE_BINDING_HANDOFF:** 타입·sourceUse·원천 조건·가상 전제·introduced 요구 작성. 연결 구현 없음.
- **RUNTIME_CONNECTION:** false. 기존 import/barrel/lookup/selector/원고 생성 변경0.
- **CUSTOMER_APPROVAL:** false. 판매·고객 적용 승인 아님.
- **CALCULATION_PRESERVATION:** 32변형 계산·fullEvidence digest 동일. 기존2531파일 hash 보존.
- **NARRATIVE_PRESERVATION:** 32변형 narrative/integration/개인 digest 동일. 6상품 fixed regression 확인.
- **BOOK_PRESERVATION:** 32변형 projectBook digest 및 기존6상품 snapshot/owner/shared 재열람 회귀 보존. 고객 저장본 재생성/덮어쓰기 없음.
- **TESTS:** 신규 연구626 + 실제 생성30 =656 PASS. 기존 관련34파일은 validation-results.json 참조.
- **EXISTING_FAILURES:** 기준16건: allowlist2, comprehensiveAllocation2, customerDayunGeneration JSON2, 과거digest10. 테스트 수정/삭제/skip 추가 없음.
- **CONDITIONAL_NOT_RUN:** 기존1건 EDITORIAL_LEGACY_SNAPSHOT 미설정. PASS 집계 제외.
- **NEW_REGRESSIONS:** 0. 최종 실행 집계는 validation-results.json 및 로그 참조.
- **TYPESCRIPT:** 0 → 0 (incremental false).
- **LINT_BUILD:** lint 오류/경고0. 로컬 Production build47/47 PASS,NFT경고0. diff-check 검사.
- **BRANCH:** v4/compatibility-marriage-product-knowledge-01
- **COMMIT_SHA:** 커밋 후 최종 응답에서 보고. 이 문서 자체의 commit hash를 문서 안에 고정하지 않음.
- **REMOTE_SHA_MATCH:** push 후 원격 동일 브랜치 SHA를 최종 응답에서 확인. master/Production 변경 없음.
- **REMAINING_GAPS:** 246 Pair방향의 전문 후보, 원국-only/미상용 응용, 미검증 원천·context/domain 검토, 실제 표시 ledger·binding은 남음. 기존 미확인 배우자 표현과 M/N/AB fallback,16실패/1조건부 미실행은 보존·별도 보고.
- **NEXT_STAGE_READY:** 연구 인수 검토 가능. runtime 연결·고객 사용·판매 승인 미완료. 다음 작업 시작 안 함.
