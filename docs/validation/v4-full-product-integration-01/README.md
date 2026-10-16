# V4-FULL-PRODUCT-INTEGRATION-01

상태는 **PARTIAL_WITH_VERIFIED_GAPS**다. 실행 가능한 오프라인 통합으로 12개 전문 경로를 연결했다. 실제 고객 Reader Bridge와 승인은 여전히 보류다. **고객 문장·Claim·Book 배정 0, FULL_BOOK_COMPLETED=false, CUSTOMER_READY=false, 사람 품질 승인 false**를 유지한다.

Base는 `1e4f6b0b74818a6605a7ea39a8dbcd34a8a9ea3c`, 브랜치는 `v4/full-product-integration-01`이다. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`에 유지했다. 기존 worktree 61개와 원본 미커밋 11개를 전후 hash로 대조했다. 기존 prunable 8개도 정리하지 않았다. 자체 commit SHA·원격·Preview는 commit 후에만 확정되므로 최종 응답 및 `/tmp/gyeol-full-product-integration-01-validation/release-receipt.json`에 기록한다.

## 실제 실행과 승인 경계

새 `integrateActualFixture`는 원래 Source Lock의 등록된 가상 입력을 읽어 다음 경로를 실행한다.

입력 → 기존 `generateV4ShadowReport`의 검증·계산·MBTI·Fusion → `observeActualProfiles` → `buildActualEvidenceGraph` → 기존 Foundation/Binder → 12 Native Specialist/Coordinator → `prepareStrictRequest` → `planGlobalBook` → `createEditorialInput`/`generateEditorialDraft` → Reader 보류 → 부분 Book 표현.

12경로에서 기존 Publisher·Book·직렬화 재열람도 별도로 실행했다. ACTUAL은 가상 입력에서 실제로 계산된 근거라는 뜻이며, 실제 고객 접근이나 Synthetic 승인 승격이 아니다. 기존 전체 생성 API 안의 기존 Writer는 그대로 실행된다. 새 연구 Editorial이 그 Writer 또는 저장본을 대체한 것은 아니다. Graph는 같은 계산 결과에서 기존 Profile을 재투영하며 달력 재계산은 0이다.

Native Binder 관찰자는 기존 오프라인 observer 패턴을 재사용하고 원래 후보·Receipt hash·12 Gate를 유지한다. Coordinator가 바꾸는 등록 metadata는 자체 복사본에만 적용한다. 기존 27 실제 연구 사례·5,073평가의 엄격한 Plan hash도 별도로 재실행해 보존했다. STRICT에서 고객 문장과 새 Book 배정은 0이다.

`integrateProduct`는 기존 factory가 인증한 Planning Request만 받는다. 기존 Plan/Typed Handoff·Editorial 의미·Source·실제 생성 표시를 검증한다. 문단/원고/input hash에 묶인 private Reader placement proof를 Book 어댑터가 소비한다. 복제된 proof, PLANNED 상태, 단순 표시 플래그로 REPAIR/RECALL을 활성화하지 않는다. 원래 전체 감사의 불필요한 반복을 줄였으며 검사 자체를 생략하거나 timeout을 늘리지 않았다.

`VERCEL`과 브라우저에서 새 진입점은 차단된다. 보호 장치 제거, 환경 조작, 고객 API/import, DB client, 미승인 기능 플래그 활성화는 없다. 실제 네 단계 승인, 최신 trust/revocation 및 별도 고객 활성화는 후속 승인 범위다.

## Reader와 부분 Book

원본 Reader 질문 2,060개의 전체 record hash와 Source hash를 확인한다. 기존 Foundation이 전체 Registry를 소유하고 새 계층에는 compact identity를 유지해 원래 요구사항 트리를 중복 보관하지 않는다. JSON archive 비교에서 optional undefined 필드는 JSON에 없는 필드로만 정규화한다. 원래 in-memory Plan/Handoff hash는 변경하지 않는다.

종합 13장/52문단/208역할, 커리어·연애 및 궁합 각 유형 9장/36문단/144역할, 대운 14년, 세운 12양력 월/가변 Segment를 각각 유지한다. 대운 14년 horizon과 실제 10년 cycle을 동일하게 취급하지 않는다. 세운의 절기·입춘·실효 연주·월 경계는 원래 계산을 따른다. CH번호·제목·주제 유사성으로 Scheduler C1~C10 또는 K1~K10을 연결하지 않는다.

Native Synthetic 질문과 원본 psq 질문은 별도 namespace다. Native의 원래 질문·Source·Assignment·문단/역할 주소가 정확하고 Editorial/Display 검증을 통과한 것만 `VERIFIED_NATIVE_SYNTHETIC_ADDRESS`로 표시한다. **이는 고객 Bridge 승인이 아니다.** 원래 주소가 없는 종합·커리어의 생성 문단 6개에는 P번호를 만들지 않았다.

`OfflineBookRepresentation`은 기존 `BookPage` union의 narrative DTO를 사용한다. 문장·주소·ledger를 그대로 연결하며 빈 문단·일반 조언·가짜 표지·이름으로 부족분을 채우지 않는다. Edition은 `SYNTHETIC_TEST_ONLY`이며 기존 V4 Edition/Publisher packet이 아니다. 고객 UI와 동일하다고 주장하지 않으며 새 Reader UI를 개발하지 않았다.

| 경로 | 원본 질문 | Native 배정 | 문장 | 문단 | 부분 페이지 | Native 표시 보류 |
|---|---:|---:|---:|---:|---:|---:|
| 종합 | 260 | 4 | 5 | 4 | 0 | 4 |
| 커리어 | 180 | 5 | 3 | 2 | 0 | 5 |
| 연애 | 180 | 7 | 3 | 2 | 2 | 5 |
| 대운 | 168 | 17 | 4 | 2 | 2 | 166 |
| 세운 | 12 | 12 | 4 | 2 | 2 | 10 |
| 궁합 love | 180 | 160 | 4 | 2 | 2 | 178 |
| marriage | 180 | 160 | 4 | 2 | 2 | 178 |
| parentChild | 180 | 160 | 4 | 2 | 2 | 178 |
| coworker | 180 | 140 | 4 | 2 | 2 | 178 |
| managerReport | 180 | 140 | 4 | 2 | 2 | 178 |
| businessPartner | 180 | 140 | 4 | 2 | 2 | 178 |
| friendship | 180 | 140 | 5 | 4 | 4 | 176 |
| friendship 독립 표시 Fixture | 180 | 180 | 7 | 6 | 6 | 174 |

기본 Native 출력은 48문장/28문단, 부분 페이지 22개다. 독립 Friendship은 7문장/6문단/6페이지다. Native Book 표시 보류는 기본 1,434개와 독립 174개다. 이와 별도로 원본 고객 질문 2,060개가 모두 보류다. 같은 질문의 여러 입력 사례 발생 수를 고유 질문 수에 더하지 않는다. Source/Evidence/Producer/승인/문법/의미/주소 부족은 [Coverage](coverage-shortage-matrix.json)의 정확한 질문 ID·원래 Gate 상태·이유 코드로 추적한다.

기존 Korean Editorial의 30 정의는 계속 `SYNTHETIC_TEST_ONLY`다. 기존 연구 사실·12 Claim Anchor 자동 매핑·고객 승인으로 승격하지 않았다. 기존 14기능 및 제한된 Typed Unit/Grammar/Predicate를 재사용한다. 범용 NLP 의미 동등성 검증을 구현했다고 주장하지 않는다. Source/Root/Owner/Direction/기간/조건·부정·불확실성/반례/금지 추론/MBTI·Fusion supporting 정보는 원래 ledger에 보존한다.

## 검증과 원본 보존

- 신규 **74 PASS/0 FAIL**. CLI의 실제 통합 결과 변조 **260사례 차단**. 상품·관계·A/B·고정 역할·기간·Source/Evidence/Root/Meaning·조건/부정·가짜 미래 사건·표시/완성/승인/Publisher 우회를 검증했다.
- 기존 관련 묶음 Base/current **5,837 PASS/46 FAIL**. 파일·이름·전체 정규화 오류·Failure Signature가 동일하다. 기존 Editorial272/Planner125/Approval146 합계 **543 PASS**.
- BusinessPartner 기본 5초 Engine361/artifact22, 양쪽 **383 PASS/0 FAIL**. 직전 보고의 1실패는 이번 Base/current에서 재현되지 않았다. timeout을 늘리거나 기존 실패를 고쳤다고 주장하지 않는다.
- TypeScript **0→0**, 전체 ESLint **경고0**, Node24.22.0/Next16.2.4 Production build Base/current **PASS/관찰 경고0**. NFT **90경로·의존 집합 동일**, 새 고객 runtime 항목 **0**.
- Base **6,177파일 바이트 동일**. 새 Book17/102 digests, Friendship20/140 digests, Profile40 및 저장본 roundtrip 동일. 모든 과거 위험 사례를 새로 재현했다는 뜻은 아니다.
- 독립 최종 CLI 2회 **67개 물리 산출물 바이트 동일**, 실행 입력 **12개 hash 현재 소스와 일치**. 시간·CPU·RSS·임시 경로는 핵심 결과에 넣지 않았다. 8GiB heap은 테스트 설정이며 최소 요구량이 아니다.

실제 CLI 측정은 각각 wall 155.35/150.68초, CPU user 194.96/189.15초 및 system 6.70/6.59초, Node maxRSS 약 5.093/4.456GiB였다. Node `resourceUsage.maxRSS`를 사용했으며 interval sampler 값을 peak로 쓰지 않았다. 측정 원본은 Git 외부 validation 경로에 둔다.

전체 repository suite PASS를 선언하지 않는다. 기존 테스트 수정/삭제/skip, 검사 비활성화, any/ts-ignore, 승인 Gate 완화는 없다. 초안의 6개 연구 보호 테스트 경로 문자열 회귀는 해시 목록을 검증 fixture로 분리해 해결했다. 신규 timeout은 중복 감사를 인증 증명으로 재사용해 해결했다. 개발 중 소스가 달라진 초안 CLI는 Source Seal이 차단했고, 최종 2회만 결정론 증거로 사용한다. sandbox 빌드 정지는 자체 프로세스 종료 후 동일 Node24 명령을 격리 실행해 검증했으며 운영 설정은 변경하지 않았다.

## 남은 범위

[상세 Publication Safety 인계](publication-safety-issue-audit.json)에 A~H를 원래 코드/보고서 hash와 함께 기록했다. Source 기술 3,202보류, Domain 2,966, Reader Bridge, CHILDREN provenance, Legacy fallback, 성인 자녀의 최종 결정권 표현, 대운 십성 Source 30실패, 기존 일부 궁합 Reader publication 위험은 이번 작업에서 수정하지 않았다. 수치는 보존한 이전 감사의 기준선이며 최신 운영 DB를 조회했다는 뜻이 아니다.

기존 Snapshot factory의 TS draft union에는 V4가 없지만 runtime은 V4를 받는다. 이를 legacy draft로 강제 cast하거나 보호 파일을 수정하지 않고, 새 오프라인 DTO를 기존 schema/Publisher/storedBook에 검증했다. 고객 통합 전 정식 타입 계약 검토가 필요하다. 기존 owner/90일 만료/공유 권한은 오프라인 검사로 부여되지 않는다.

실제 Source/Domain/Meaning/Reader 계약·Producer 지원, 네 단계 실제 승인/current trust/revocation, 별도 고객 runtime 활성화, 사람 독해와 Publication Safety가 남는다. **Publication Safety는 시작하지 않았다. master/Production/DB/migration/결제/Auth/Worker/환경변수/기존 구매 Book은 변경하지 않았다.**

## 산출물

- [통합 manifest](integration-manifest.json), [상품 경로](product-route-matrix.json), [실제 계산 통합](actual-product-integration.json), [호출·타입 계약](contract-call-map.json)
- [Reader Bridge](reader-bridge-audit.json), [Coverage/보류](coverage-shortage-matrix.json), [의미·Source ledger](meaning-source-preservation.json), [부분 Book 표현](offline-book-representations.json)
- [승인/부정 사례](approval-safety-audit.json), [Book 보존](book-contract-preservation.json), [기존 실패 비교](regression-comparison.json), [원본/worktree 보존](source-preservation.json)
- [기술 검증](technical-validation.json), [NFT](nft-trace-preservation.json), [독립 결정론 비교](deterministic-independent-comparison.json), [Privacy](privacy-audit.json), [다음 작업 경계](publication-safety-handoff.json)

대형 JSON은 요약본이 아니라 기존 GZIP/SHARDS manifest다. 기존 `readGlobalArtifact(directory, name)`로 전체 데이터를 복원할 수 있다. 원시 Graph/고객 입력을 보고서에 복제하지 않았다.

## 최종 필드

최종 53필드는 아래 표와 [정형 JSON](final-report-fields.json)에 있다. 자체 commit SHA·원격·Preview는 최종 응답 및 외부 release receipt에서 확정한다.

| 항목 | 결과 |
|---|---|
| TASK | V4-FULL-PRODUCT-INTEGRATION-01 |
| BASE_SHA | 1e4f6b0b74818a6605a7ea39a8dbcd34a8a9ea3c |
| BRANCH | v4/full-product-integration-01 |
| COMMIT_SHA | Resolved after commit in final response and external release-receipt.json |
| REMOTE_SHA_MATCH | Verify after push |
| INTEGRATION_STATUS | PARTIAL_WITH_VERIFIED_GAPS |
| PRODUCT_KEYS | 6 |
| SPECIALIST_ROUTES | 12 |
| COMPATIBILITY_CATEGORIES | 7 |
| STRICT_CUSTOMER_PATH | 12 fresh calculated fixture routes + 27 original strict cases / customer sentences 0 |
| SYNTHETIC_TEST_PATH | 12 native routes 48 sentences/28 paragraphs; independent Friendship 7/6 |
| ACTUAL_OPERATOR_APPROVED | 0 |
| ACTUAL_CUSTOMER_APPROVED | 0 |
| ACTUAL_CUSTOMER_ELIGIBLE | 0 |
| ACTUAL_CUSTOMER_CLAIMS | 0 |
| ACTUAL_BOOK_ALLOCATIONS | 0 |
| READER_BRIDGES_VERIFIED | 0 customer; native synthetic placement proofs separate |
| READER_BRIDGES_WITHHELD | All original customer Reader questions; missing addresses preserved |
| READER_QUESTIONS_PRESERVED | 2060 |
| PLANNER_INTEGRATION | Existing authenticated factories / Plan validator / typed Handoff reused |
| EDITORIAL_INTEGRATION | Existing source, meaning, display, 14 functions reused |
| READER_INTEGRATION | Exact native synthetic addresses only; customer bridge unverified |
| BOOK_ADAPTER_INTEGRATION | 22 default + 6 independent native partial pages; existing BookPage DTO |
| SOURCE_PRESERVATION | 6177 Base files byte-identical; exact sources and receipts retained |
| MEANING_PRESERVATION | Original identities + separately pinned 30 SYNTHETIC_TEST_ONLY definitions |
| FACT_ROOT_PRESERVATION | Original canonical and ancestry roots retained |
| OWNER_DIRECTION_PRESERVATION | 7 categories/both directions/fixed roles retained |
| TEMPORAL_SCOPE_PRESERVATION | 14-year horizon/10-year cycles/12 civil months/Jie/effective annual/segments unchanged |
| MBTI_FUSION_PRESERVATION | Exact evidence IDs/supporting information retained |
| REPAIR_RECALL_VALIDATION | Generated display and same scope required; cloned proof/absent problem rejected |
| COVERAGE_SHORTAGES | Original 2060 customer questions withheld; native Book-display withheld 1434 default + 174 independent |
| WHOLE_BOOK_COMPLETED | False |
| HUMAN_QUALITY_APPROVED | False |
| NEW_TEST_RESULTS | 74 PASS / 0 FAIL; CLI negative cases 260 blocked |
| EXISTING_TEST_RESULTS | 5837 PASS / 46 identical FAIL; Editorial/Planner/Approval543 PASS; BP383 PASS/0 FAIL |
| EXISTING_FAILURE_SIGNATURES | Exact file/name/full normalized errors/signatures equal; prior BP1 failure not reproduced |
| TYPESCRIPT | 0 before/0 after/0 new |
| LINT | PASS / 0 warnings |
| BUILD | Base/current Production build PASS / Node24.22.0 Next16.2.4 / observed warnings0 |
| DIFF_CHECK | PASS: staged additions only |
| CALCULATION_PRESERVATION | 17 Books/102 digests + Friendship20/140 digests + Profile40 byte-identical |
| NARRATIVE_PRESERVATION | PASS; original Writer/renderers untouched |
| BOOK_PRESERVATION | Existing Edition/snapshots/reopen retained; 12 fresh integrated stored roundtrips pass |
| NFT_TRACE_PRESERVATION | 90 paths and dependency sets identical; new runtime entries0 |
| DETERMINISTIC_VALIDATION | 2 independent processes / 67 physical files byte-identical / 12 current input hashes |
| PRIVACY_CHECK | PASS: full new-file scope including decoded compressed leaves; final hashes verified before commit |
| ORIGINAL_CHECKOUT_PRESERVED | 11 dirty files unchanged; original branch/HEAD retained |
| EXISTING_WORKTREES_PRESERVED | 61 original worktrees exact HEAD/status/file hashes preserved |
| VERCEL_PREVIEW | Verify exact final commit/ref/repository/project/Preview target/READY after push |
| PREVIEW_URL | Resolved after push |
| REMAINING_GAPS | Actual approvals/bridges/coverage; Source/domain/Producer; inherited CHILDREN/adult/fallback/publication risks; human reading; 46 legacy failures |
| PUBLICATION_SAFETY_HANDOFF | NOT_STARTED; concrete issue and prerequisite list recorded |
| NEXT_STAGE_READY | Offline technical handoff available; customer use not ready; next task not started |
