# V4-KNOWLEDGE-UNIFIED-CATALOG-01

오프라인 통합 카탈로그 컴파일러·타입·참조 검증·그래프·커버리지·결정론적 재생성·후속 계약을 구현했다. 기존 연구·계산·원고·Book·운영 경로는 변경하지 않았다. 고객용 Binder, Global Planner, 한국어 생성기는 실행하거나 연결하지 않았다.

기준: `v4/korean-editorial-knowledge-01` / `6d471db103d53dd9165e4832744501a686e59edc`. 신규 독립 worktree: `/private/tmp/gyeol-knowledge-unified-catalog-01`. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`를 유지했다.

## 인수 결과

| 항목 | 수량 / 결과 |
|---|---|
| 연구군 | 20 / 20 |
| 실제 연구 registry records | 18,610 / 18,610 |
| 기초 원천·정의·기존 표현 source slots | 4,799 (연구 수와 별도) |
| 과거 inventory 대조 | 18,218 ID·locator·record hash 일치 / 불일치 0 |
| 한국어 연구 추가분 | 392 |
| 해결된 원본 참조 occurrence | 69,098 |
| 미해결 참조 occurrence | 6,490 |
| 중복 원천 참조 그룹 | 5,658 |
| 원본 hash 불일치 | 0 |
| 카탈로그 key 중복 | 0 |
| 고객 승인 / 신규 runtime 연결 | 0 / 0 |

18,610은 연구·참조 view·감사·설계·fixture를 포함하는 registry 수다. 기초 4,799개도 원본 export/address의 인수 슬롯이며 독립적인 명리 사실 수가 아니다. 동일 원천의 재참조는 그래프와 중복 그룹으로 표시하고, 뜻이 비슷하거나 ID가 같다는 이유만으로 자료를 병합하지 않는다. 원래 ID가 없는 기초 자료는 원본 dictionary key·enum 값·타입/주소를 표시용 identity로 사용하며 locator에는 존재하지 않는 `id`를 요구하지 않는다.

| 연구군 | 실제 / 예상 |
|---|---|
| annual-fortune-product-research | 1792 / 1792 |
| career-product-research | 839 / 839 |
| compatibility-business-partner-research | 1917 / 1917 |
| compatibility-coworker-research | 1948 / 1948 |
| compatibility-friendship-research | 2138 / 2138 |
| compatibility-love-research | 851 / 851 |
| compatibility-manager-report-research | 1741 / 1741 |
| compatibility-marriage-research | 1133 / 1133 |
| compatibility-parent-child-research | 1209 / 1209 |
| composite-structure-research | 301 / 301 |
| comprehensive-product-research | 512 / 512 |
| fusion-knowledge-research | 374 / 374 |
| korean-editorial-research | 392 / 392 |
| love-product-research | 764 / 764 |
| major-fortune-product-research | 863 / 863 |
| mbti-foundation-research | 531 / 531 |
| mbti-pair-research | 279 / 279 |
| relation-research | 246 / 246 |
| semantic-axis-research | 370 / 370 |
| temporal-interaction-research | 410 / 410 |

| 자료 유형 | 인수 레코드 수 |
|---|---|
| AUDIT_METADATA | 140 |
| BINDING_DESIGN | 915 |
| CALCULATION_DEFINITION | 289 |
| CONDITIONAL_INTERPRETATION | 1,880 |
| CROSSWALK | 3,445 |
| EDITORIAL_MATERIAL | 1,148 |
| FUSION_RESEARCH | 355 |
| PRODUCT_SPECIALIST | 1,359 |
| REJECTED_OR_HELD | 420 |
| RELATIONSHIP_SPECIALIST | 3,426 |
| SEMANTIC_DEFINITION | 325 |
| SOURCE_KNOWLEDGE | 3,202 |
| SOURCE_REFERENCE | 6,199 |
| TEST_FIXTURE | 306 |

## 원천과 적용 계약

오행·천간·지지·일간·60일주·십성·십이운성·신살/귀인·지장간·위치·심층/보강 DB, 기존 계산 정의/타입, MBTI 원본 16개와 방향 Pair 256개, 의미 축 36개(양극 8/강점 28), Facet 109개, SemanticTag 22개, Broad Theme 16개, Context 8개, V4 Domain 10개, Dynamic/Fortune tags, 기존 Fusion·소재·claim·scene·title·resonance 레지스트리를 별도 인수했다. 전체 export별 수는 [foundation-inventory.json](foundation-inventory.json)에 있다.

실제 `sourceRuntimeAdapter.ts`의 `docs/product/mbti/source/${type}.json` 경로와 같은 파일을 읽는다. Pair forward/reverse의 파일 생략형 참조는 실제 인수한 profile/type과 원래 sourceType/targetType으로 파일을 찾고 pointer·canonical hash·withType 방향을 확인한다. MBTI direct/inferred를 개인 심리 검증이나 관계 결과로 승격하지 않는다.

원본 경로·export·index/JSON pointer·원본 ID·record hash·source version을 보존한다. 참조의 해시 규칙은 기존 테스트에서 확인한 방식별로 적용했다: insertion-order JSON, MBTI Pair canonical JSON, plainKo 문자열, 파일 바이트. 40자리 source version은 로컬에서 확인한 Git commit, 64자리는 원본 파일 hash로 구분한다. SourcePointer/catalog와 원본 간 버전·ID·hash 불일치도 독립 검증한다.

원천 존재, hash, 연구 검토, 전통 출처, MBTI coverage, 의미 검토, 계산 적용, 상품 적용, 고객 승인을 분리했다. 전통 출처와 현대 편집 적용 조건을 혼합 승인하지 않는다. 웹 원문을 이번에 전수 재열람한 것은 아니며, inherited source review는 원래 상태 그대로 인수했다. 모든 신규 catalog customer approval은 false다. `sourceExistence=PRESENT`와 `hashIntegrity=MATCH`는 해당 레코드의 원본 locator/snapshot에 관한 상태다. 상위 원천 전체의 확인 상태는 edge와 unresolved queue를 별도로 확인해야 한다.

6상품 key와 궁합 7유형은 실제 원본 메타데이터에서만 인수했다. 없는 readerQuestion·positive·risk·twist 등을 보충하지 않는다. owner·방향·수신자 십성·개인 Fusion·비대칭 역할·사업 상황 UNKNOWN·반례와 시간 조건은 원본 계약으로 유지한다. sourceGroups의 AND-within/실제 표시된 compatible group 정책을 구분하고, 불명확한 그룹은 UNKNOWN_GROUP_SEMANTICS로 보류하도록 검증했다.

의미 crosswalk는 DIRECT/PARTIAL/MANY_TO_MANY/CONDITIONAL/NO_MAPPING/INSUFFICIENT_VERIFICATION을 구분한다. wealth=RESOURCE_SENSE 또는 help=CARE 같은 자동 동치는 없다. 양극 음의 방향은 결함이 아니며 낮은 강점 신호를 반대 성격의 근거로 사용하지 않는다. 점수·가중치를 변경하지 않았다.

대운 10년 주기와 상품 14년, 선택 연도, 절입·교운 구간의 계약은 별도 타입으로 보존했다. 실제 시각·확정성·참여 요소는 미래 Evidence Graph의 공급 대상이다. 이 컴파일러는 교운·절기·복합 관계를 계산하지 않는다.

## 미해결 항목

| 원인 | 참조 occurrence |
|---|---|
| TARGET_ID_NOT_INDEXED | 6,040 |
| AMBIGUOUS_ID_OR_ALIAS | 344 |
| REFERENCE_FRAGMENT_MISSING | 60 |
| AUDIT_WITHOUT_ORIGINAL_LOCATOR | 46 |

미해결 참조가 있는 카탈로그 항목: 3,127개. 별도 domain crosswalk 검토 항목: 2,966개. 서로 겹칠 수 있으므로 합산하지 않는다. 이는 원본 파손 6,490건이라는 판정이 아니다. 작성 제안 ID·미래 요구사항·별칭·범위 fragment·원본 URL만 있는 감사 자료도 포함한다. 각 occurrence의 영향 ID/필드/원래 target/사유는 [unresolved-references.json](unresolved-references.json)에 남겼다. 원본을 임의 수정하거나 누락시키지 않았다.

대표 실제 미해결 사례:

- `TARGET_ID_NOT_INDEXED`: `kc:v1:000b2208f7a735c45581c4771733ed863d0142f0fe58f01b9e6ad0c8f630a6fe` / `/sourceId` / `{"sourceId": "mbti:ISTJ:traits:money:family_responsibility_spending", "passage": {"file": "docs/product/mbti/source/ISTJ.json", "pointer": "/traits/money/4", "recordSha256": "45766cb7118d5a18e0478635473b9262c80d4c64efc6998f5935f24065d7a38c", "fileSha256": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a"}}`
- `AMBIGUOUS_ID_OR_ALIAS`: `kc:v1:007628b9906bf0b50586802b14566340ede534641ef3bc11ff1ede85bf4f7218` / `/traditional/sourceRefs/0/sourceId` / `{"sourceId": "sm2", "passage": "論三刑"}`
- `REFERENCE_FRAGMENT_MISSING`: `kc:v1:02ef00d3007195030a31e2a7d46c7fa088e80bef933daced2304300e9ebf13ed` / `/inheritedMeaningRef/0` / `"completion:day_pillar:丙午#core,positive,risk"`
- `AUDIT_WITHOUT_ORIGINAL_LOCATOR`: `kc:v1:0755df84fca1e96c84eef8f5160223846b3263f94e9be482f55bbc25f2fa40be` / `/auditRef` / `{"sourceId": "external:parent-child:teen", "auditRef": "source-locator-audit.json#ee509907f7d870f38308", "recordSha256": "ef24c8f6fd282e18ca51a255f239d9e2f4f02ec7902ce4b89a8a495d4650dbd1"}`

전체 참조 해결, 고객 후보 승인, 실제 Binding 준비 완료로 판정하지 않는다. 다음 Source Verification 작업의 입력과 보류 queue는 준비됐다. 후속 작업을 시작하지 않았다.

## 실행과 산출물

```sh
node scripts/knowledge-catalog/compile.mjs
node scripts/knowledge-catalog/compile.mjs /tmp/catalog-rebuild
pnpm exec vitest run tests/unit/report-knowledge/knowledgeUnifiedCatalog.test.ts
```

Compiler는 명시적 offline CLI이고 임의 입력 실행 sandbox가 아니다. 신뢰한 저장소의 data export를 읽으며 fetch를 차단한다. config·loader를 HTTP에 노출하지 않는다. 연구군 탐색과 어댑터 대조, 원본 파싱, key/locator/hash, 분류, 참조/중복/상태/조건, graph와 coverage를 실제로 생성한다. 미해결 참조는 산출물에 남기며 수량 불일치·읽기 실패·중복 key·미설정 family 등 구조 오류는 CLI 실패로 반환한다.

고객 요청 시 전체 자료를 import/순차 탐색하는 경로는 없다. [knowledge-catalog.json](knowledge-catalog.json)과 [knowledge-edges.json](knowledge-edges.json)은 family별 shard index다. 조건과 상태는 shard에, 원래 전체 연구는 기존 locator에 보존한다. 향후 승인된 소수 자료를 상품·영역·조건 index로 조회하는 계약만 제공했다.

- [coverage-manifest.json](coverage-manifest.json), [research-inventory.json](research-inventory.json), [foundation-inventory.json](foundation-inventory.json)
- [source-integrity.json](source-integrity.json), [knowledge-graph-nodes.json](knowledge-graph-nodes.json), [duplicate-reference-audit.json](duplicate-reference-audit.json)
- [knowledge-status-matrix.json](knowledge-status-matrix.json), [product-applicability.json](product-applicability.json), [relationship-applicability.json](relationship-applicability.json), [temporal-conditions.json](temporal-conditions.json)
- [semantic-crosswalk.json](semantic-crosswalk.json), [fusion-crosswalk.json](fusion-crosswalk.json), [korean-expression-contract.json](korean-expression-contract.json)
- [future-binding-contract.md](future-binding-contract.md), [global-planner-blueprint.md](global-planner-blueprint.md), [korean-generation-contract.md](korean-generation-contract.md), [engine-handoff.md](engine-handoff.md)

## 검증

| 검사 | 결과 |
|---|---|
| 신규 카탈로그 테스트 | 12 PASS / 0 FAIL |
| 기존 28파일 기준/이후 | 각각 7,796 PASS / 기존 46 FAIL |
| 기존 Korean + 실제 Book 2파일 | 669 PASS / 0 FAIL |
| 관련 합계 (반복 실행 중복 집계 없음) | 8,477 PASS / 기존 46 FAIL / 신규 실패 0 |
| 기존 실패 비교 | 파일·이름·첫 오류·정규화한 전체 오류 hash 일치 |
| 기존 six-product frozen 통합 | 64 / 64 PASS |
| 실제 Book | 17건, 102 digest 및 전체 관측 결과 동일 |
| 결정론성 | 생성 JSON 59파일 CLI 재생성 byte 일치; Unit 2회도 동일 |
| 원본 tracked 파일 | 3,750개 모두 byte 불변 |
| 기존 worktree / 원본 dirty | 35개 / 11개 보존 |
| TypeScript | 기준 0 → 최종 0 |
| lint / Production build / diff-check | PASS / PASS / PASS |
| local build 경고 | 0 |
| 함수 NFT trace | 88개; raw 연구·validation 문서 포함 0 |

대상 테스트만 실행했으며 프로젝트의 모든 테스트가 통과했다고 주장하지 않는다. 기존 46개 실패는 수정·삭제·skip하지 않았다. [existing-failures.json](existing-failures.json)에 각 파일·이름·첫 오류·base 재현 및 이후 결과를 기록했다. [preservation.json](preservation.json)의 17개 사례는 6상품, 궁합 7유형, 미상 입력을 포함하고 고정 시각으로 실제 유료 발행 생성 경로→publication 검증→Book→snapshot→owner/shared 저장본 열람을 로컬 순수 함수로 실행했다. 운영 결제·DB 저장은 하지 않았다. 기존 4개 grammar helper 제한도 그대로다.

전체 Book·원고 관측은 외부 `/tmp/gyeol-knowledge-unified-catalog-01-validation/generation-before.json` 및 `generation-after.json`에 있다. 보존 검증 범위는 tracked와 nonignored 파일·HEAD·브랜치·status다. ignored build cache 바이트의 동일성은 주장하지 않는다.

[function-trace.json](function-trace.json)의 로컬 경로 바이트 합계 최대 약 54.6 MB, 문제 dev/account API 약 31.7 MB. 원격 압축 Function 크기 측정치와 구분한다. 기존 localDatabase trace 수정 hash 및 next.config·Production 경로는 불변이다.

## Git / Preview

신규 브랜치 `v4/knowledge-unified-catalog-01`의 신규 compiler·tests·산출물·검증 문서만 commit/push한다. 원격 SHA와 최종 SHA의 Preview 상태는 최종 보고와 deployment receipt로 확인한다. master·Production·결제·인증·Supabase·환경변수·이벤트·광고는 변경하지 않았다.

구현 커밋 `3aa465a5274620ff9233b5dadff0489a15e17829`의 Preview READY를 확인했다. [preview-receipt.json](preview-receipt.json)은 이 구현 커밋의 검증 기록이다. 이 기록을 추가한 최종 문서 커밋도 push 후 SHA별 Preview를 별도로 확인하고 최종 보고한다. 기술 검증과 Preview READY는 고객 사용 승인 또는 Production 배포 승인이 아니다.
