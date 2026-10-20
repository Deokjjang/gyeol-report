# Knowledge Binder 인수 계약

이 Binder는 실제 연구 후보 검색·원래 요구조건 정규화·메모리 내 실제 Graph 연결·12개 독립 Gate·보류 receipt를 제공하는 오프라인 도구다. 고객 Runtime, Specialist claim 생성, 문단 배정, Planner, 한국어 생성, 승인 발급 기능은 포함하지 않는다.

## 실행과 입력

```sh
node tools/knowledge-binder/verify.mjs
node tools/knowledge-binder/verify.mjs /tmp/gyeol-binder-rebuild
pnpm exec vitest run tests/unit/report-knowledge/knowledgeBinder.test.ts --maxWorkers=1
```

CLI는 고정된 기준 파일 hash와 선행 manifest를 검증한 후 기존 SourceReader, SemanticDomainVerificationEngine, EvidenceKnowledgeIndex를 읽는다. 기존 Graph CLI의 변경 없는 27개 fixture와 producer 실행을 관찰하고, `buildActualEvidenceGraph`가 반환한 원본 Graph 및 동일 실행의 GraphInput을 비식별화 전에 Binder로 전달한다. 새 Binder에서 만세력·대운·Fusion을 재계산하지 않는다. 기존 Graph CLI의 105개 생성 JSON도 외부 mirror에서 byte 비교한다. HTTP/HTTPS/fetch는 CLI에서 차단된다. 기존 검증 폴더와 관련 없는 비어 있지 않은 출력 폴더에는 쓰지 않는다.

`KnowledgeBindingRequest`는 실제 `graph`, `graphInput`, 기존 `product`, `relationship`, 요청 해석 `contexts`, 입력된 `actualUserState`를 받는다. 선택적으로 실제 기간 `requiredWindow`와 실제 표시 이력 `introducedLedger`를 받는다. `contexts`는 상품 해석 범위이며 고객의 계약·지분·관계 이력을 증명하지 않는다. 실제 상태는 원래 정규화 입력과 대조한다. 공개 비식별 Graph JSON은 정확한 binding 입력으로 사용할 수 없다.

## 원천 정규화와 검색

`KnowledgeBinderCatalog.prepare()`는 연구 20군의 18,610건을 모두 분류하며 기초 4,799건은 원천 검증에 사용한다. 정의·참고·편집·설계·감사·fixture·반려 자료를 해석 후보로 승격하지 않는다. 원본의 명시적 상품·관계 범위가 있는 잠재 후보만 `search(product, relationship)`에서 검색한다. 상품 범위가 없는 공통 연구도 inventory 및 gap audit에 남는다.

`requirements.ts`의 Adapter는 원래 필드 구조에 따라 source registry, direct source, owned source, MBTI basis, source groups, 요구조건을 분리한다. 문서 인용 `sourceRefs`를 개인 계산 사실로 간주하지 않는다. 기계 판독 가능한 exact selector가 없는 자연어 조건은 `CONTRACT_NOT_MACHINE_CHECKABLE`로 보류한다. readerQuestion·meaning/claim ID·position·rule ID 등 원본에 없는 값을 만들지 않는다.

실제 source identity는 CatalogKey, 원래 producer ID, 관찰 pointer, source file/pointer/hash, owner, 실제 참여 원소, 방향, 기간으로 검증한다. CatalogKey와 Graph ID는 별도 필드다. 실제 원국 십성·신살·관계 검출과 그 정의의 존재는 다른 사실이다. MBTI SCORING source와 REFERENCE_ONLY Pair 참고는 구분한다. latter는 개인 성격 사실을 승인하지 않는다. Fusion은 실제 원국과 MBTI root, 동일 owner, 원래 rule/context 및 명시된 조상을 요구한다. 미노출 rule ID, 실제 producer가 없는 Facet·복합 관계는 유사 근거로 대체하지 않는다.

인덱스는 CatalogKey, originalId, product, relationship, sourceKey, source locator, source-group 원래 ID와 실제 Graph의 producer ID, owner, observation pointer, 기간, domain, semantic axis/지원 field, canonical root를 제공한다. 각 후보의 AND/조건부 그룹은 원래 인덱스·owner 유형 조건·실제 표시 ledger를 보존한다. 다른 alternative의 자료를 합치지 않는다.

## 결과와 Gate

`bindKnowledge(request, catalog)`는 실제 연구 전용 진입점이다. 승인 provider 인자를 받지 않으며 기본 `NO_APPROVALS`를 사용한다. Graph/Evidence hash를 실행 전후 대조하고, 후보 검색 결과 각각에 `KnowledgeBindingReceipt`를 반환한다. 실제 연구에서 고객 사용 가능 수가 0이 아니면 실패다. 실제 Graph/Evidence를 수정하는 API는 없다.

12개 Gate 순서는 SOURCE_INTEGRITY → INTERPRETATION_REVIEW → PRODUCER_SUPPORT → ACTUAL_CALCULATED_FACT → ACTUAL_OWNER → ACTUAL_DIRECTION → ALL_ANCESTOR_DOMAINS → TIME_INTERSECTION → ACTUAL_USER_STATE → COUNTEREXAMPLES_AND_PROHIBITIONS → PRODUCT_SPECIALISM → CUSTOMER_APPROVAL이다. 각 결과는 입력 필드, 실제 근거, 원본 참조, 상태, 이유, 후속 조치를 담는다. UNKNOWN과 REVIEW_REQUIRED는 통과가 아니다. 방향·시간의 NOT_APPLICABLE은 해당 요구가 없을 때만 사용한다.

후보 수준 방향 요구도 실제 subject·recipient·원래 relation ID와 일치해야 한다. 필요한 조상이 WITHHELD이면 보류하지만 관련 없는 다른 owner/연도의 보류 노드가 독립된 유효 match를 오염시키지는 않는다. accepted/rejected witnesses를 별도로 기록한다. 시간은 기존 `[start,end)` 교집합을 사용한다. 교운 range, 알 수 없는 scope, 미지원 3·4층 관계를 확정하지 않는다. 원국 사실을 기간 사건의 근거로 승격하지 않는다.

Receipt는 모든 개별 identity match와 별도로 선택된 호환 witness, 원래 canonical root, 시간 witness, 12 Gate, 단계, 최종 disposition을 보존한다. PARTIAL Graph도 개별 유효 근거를 평가한다. `structurallyMatched`는 source/producer/fact/owner/direction/ancestry/time의 기술 Gate만을 뜻한다. `FACTS_MATCHED`는 계산 Gate만의 단계다. `APPROVAL_PENDING` 최종 disposition은 첫 11개 Gate를 모두 통과한 경우에만 사용한다. 모든 후보의 승인 Gate 대기 수와 같은 분모가 아니다.

## 승인과 재사용 경계

향후 승인 계약에는 원본 CatalogKey/hash/source version, 명시적 meaning/claim, product/relationship/context, 실제 evidence ID/root, Graph/Source/Semantic version, 시간 witness, 금지 추론, 승인 주체·검토 기록·버전, 발급/만료/취소 및 진위 확인이 필요하다. 이 작업은 실제 승인 기록을 발급하지 않는다. 합성 승인 Provider는 메모리 내 synthetic-only 테스트로 전체 Gate 경로를 검증할 때만 사용한다. 실제 연구에는 그 Provider가 적용되지 않으며 NODE_ENV 우회가 없다.

Root는 기존 Graph의 값을 재사용한다. Fusion·Personal Resonance·다른 상품 참조로 새로운 독립 사실을 발급하지 않는다. 기존 `classifyMeaningReuse`를 사용하며 의미 ID·선행 질문·행동·표시 이력이 부족하면 재사용 의미도 검증 부족으로 남긴다. RECALL에는 실제 호환되는 표시 ledger가 필요하다. 연구 존재는 표시 이력이 아니다.

## 후속 작업의 필수 조건

후속 Specialist Engine은 `customerApproved=false` receipt를 고객 claim 또는 문단으로 전환해서는 안 된다. 기술 match 수나 root 수는 승인·원고 품질 점수가 아니다. 현 단계의 자연어 요구조건, 미지원 producer, source-group 기술 보류, 의미·정책 검토, 실제 상태 및 승인 계약의 gap을 먼저 해소해야 한다. 상품 전문 DB를 공통 자기계발 문장으로 대체해서는 안 된다.

friendship CHILDREN static 원천 사용 63건과 실제 Graph derived node 91건은 다른 집합이다. 기존 source/policy를 보존하고 해당 범위의 전체 ancestry를 검사했다는 사실이 고객 Runtime의 `.some` 경로가 이미 전수 차단됐다는 뜻은 아니다. 그 Runtime은 이번 작업에서 변경하지 않았다.

Git 산출물의 owner/node/root는 fixture 별칭이다. 정확한 매칭은 비식별화 이전에 실행하며 공개 별칭에서 원래 ID를 추정하지 않는다. 실행 시간은 결정론적 산출물에서 제외하고 별도 관찰로 기록한다.

이 문서는 후속 계약 인수용이다. 후속 구현, 판매 승인, master 통합, Production 배포는 이 작업의 완료로 승인되지 않는다.
