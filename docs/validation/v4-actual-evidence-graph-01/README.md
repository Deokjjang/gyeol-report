# V4-ACTUAL-EVIDENCE-GRAPH-01

## 작업 결과와 경계

실제 `generateV4ShadowReport` 출력, 동일 계산에서 읽은 기존 의미 프로필, 원천 검증 자료로 오프라인 Actual Evidence Graph를 생성한다. 고객용 해석 후보·claim·문단을 배정하지 않으며, 기존 Book 발행 데이터에 Graph를 추가하지 않는다. 고객 승인, 연구 런타임 연결, 전문 claim 발행, 기존 Book 변경은 모두 0이다.

Base: `9bfe4f29d36062528b06c59fbc2e5819d288b0c1` (`v4/knowledge-semantic-domain-verification-01`).
작업 브랜치: `v4/actual-evidence-graph-01`.
독립 worktree: `/private/tmp/gyeol-actual-evidence-graph-01`.

기존 checkout의 HEAD/브랜치와 미커밋 11개 파일, 기존 worktree 38개를 보존한다. 이전 코드 3,910개 파일과 Catalog 59개, Source Verification 20개, Semantic/Domain 23개 생성 JSON의 byte 보존을 검사한다. 결과는 `preservation.json`에 기록한다.

## 실제 생산 경로

`runtimeShadow.ts`는 기존 입력 정규화와 상품별 계산 Handler를 호출한다. 그 결과의 `V4RuntimeEvidence`는 version/mode/product/input/composition/calculations/natalTableEvidence/mbtiTables/contentDigest를 포함한다. Graph는 이 객체를 변경하지 않고 읽는다. contentDigest는 손상 검사이며 인증·권한·결제·새 근거 발급 증명이 아니다.

6상품 Handler의 원국 계산은 동일 `saju/calculateSaju.ts:calculateSaju`를 사용한다. 따라서 같은 owner의 같은 원국을 다른 상품에서 사용해도 Handler wrapper를 새로운 독립 계산 사실로 세지 않는다. 다른 owner·실제 위치·참여 요소·기간·방향·producer는 별도로 보존한다. 원래 ID가 없는 pillar 관찰과 명시적 MBTI 입력의 root는 A/B slot이 바뀌어도 같은 사람·같은 실제 위치/입력 기준으로 유지한다. 원래 observation pointer는 별도로 보존한다.

저장 패킷에는 전체 명리/MBTI/Semantic Fusion 프로필이 남아 있지 않다. `observeActualProfiles`는 패킷 안의 동일 계산 객체를 재사용해 기존 `buildIntegratedMyeongliProfile`, `buildMbtiSemanticProfile`, `buildMyeongliMbtiFusion`을 관찰한다. Graph가 새 출생 달력을 계산하는 횟수는 0이다. 이는 발행 시 감춰진 프로필 객체를 그대로 캡처했다는 주장이 아니라, 동일 기존 생산자의 재현 가능한 재투영이다. 개인 공명 전체 계보를 만들기 위해 새 claim 생산자를 실행하지 않는다.

실제 타입·symbol·파일 hash·version·ID 유무는 `producer-contract-inventory.json`, 실제 관찰 수와 지원 상태는 `producer-support-matrix.json`에 기록한다. 모든 producer를 같은 기능으로 합치지 않는다.

## Graph 모델과 ID

`types.ts`는 실제 계산 사실, 기간 사실, canonical Pair, 방향 관계, MBTI 입력/원천, 의미 축 파생, Fusion 파생, 맥락 입력, 시간 경계, 원천 선언, 기존 편집 proof 관찰, 미지원/미상 요구를 구분한다.

각 노드는 producer identity, 원래 Evidence ID 또는 observation pointer, owner, participants, direction, 시간 범위, certainty, 원천 locator/hash, 필수 ancestry, blocker, 다차원 receipt를 가진다. 실제 source ancestry와 단순 연구 관련 참조를 섞지 않는다.

CatalogKey/ResearchId/원래 producer ID/GraphNodeId/CanonicalRootId는 서로 다른 값이다. 원래 ID는 메모리 안에서 그대로 비교한다. ID가 없는 원국 pillar 등은 `PRODUCER_OBSERVATION_ONLY`와 `UNADDRESSABLE_PRODUCER_OBSERVATION`으로 구분하며, 새로운 계산 Evidence ID를 발급하지 않는다.

Root 종류도 분리한다. `PRODUCER_OBSERVATION`은 실제 생산자 관찰, `SOURCE_ATTRIBUTION`은 개인이 입력한 유형에 연결된 원천 항목, `SELF_REPORTED_INPUT`은 입력 사실이다. MBTI 원천의 존재·귀속은 독립적인 심리 행동 관찰이 아니다. Fusion·Axis·Facet 설명은 추가 독립 root가 아니다. 개별 Graph의 root 수 합계와 사례 전체에서 중복을 제거한 root 수는 다르며 `quality-audit.json`에 따로 기록한다.

Owner/participant/direction/period/source edge는 해당 노드의 필드에 대한 명시적 pointer 또는 검증된 노드를 참조한다. 필수 계산 ancestry만 DFS에 포함한다. 필수 부모가 WITHHELD이면 모든 하위 파생 노드에도 차단을 전파하고 `HAS_UNVERIFIED_ANCESTOR` edge를 기록한다. 제공됐지만 금지된 ancestry와 실제로 누락된 ancestry는 구분한다. 정책·소유자·필드 pointer를 새로운 계산 부모로 승격하지 않는다. 순환, ID 충돌, 없는 부모를 조용히 덮지 않는다.

## 원국·MBTI·의미 축·Fusion

- 확인된 원국 pillar, 자리별 천간/지지, 실제 구조 atom, canonical table의 신살·귀인·관계·십이운성 관찰만 읽는다. 출생시간 미상에서 시주를 만들지 않는다.
- MBTI가 비어 있으면 원천 노드를 만들지 않는다. 실제 JSON leaf의 file/pointer/hash/value, sourceDomain, classification, sourceCoverage를 보존한다. BOM이 있는 원본도 byte hash는 그대로 검사한다.
- direct/inferred는 원천 작성 상태다. REFERENCE_ONLY/METADATA/UNCLASSIFIED를 scoring으로 승격하지 않는다. dimension prior는 실제 행동 관찰이 아니다.
- 36개 의미 축의 기존 score/raw score/normalized score와 실제 annotation·contribution·aggregation 계보를 읽는다. 가중치와 방향은 변경하지 않는다. 음의 양극 방향을 결함으로, 낮은 strength를 반대 성격으로 바꾸지 않는다.
- 109개 Facet 정의와 부모 Axis 계약은 선행 Overlay에 그대로 남아 있다. 현재 개인 프로필에 별도 실제 Facet 관찰 producer가 없으므로 미지원 요구로 기록하며, 109개 관찰 사실을 만들지 않는다.
- Semantic Fusion/Complement는 원래 annotation ID와 명리 Evidence ID 양쪽을 따라간다. 다른 owner 또는 한쪽 원천 누락은 보류한다. Legacy Fusion은 기존 materials packet을 관찰하고 기존 의미 체계와 분리한다. Personal Resonance의 완전한 출력 계보가 없으면 보류한다.

## 궁합 Pair와 방향

기존 `compatibilityNarrativeEvidence`/`detectCrossBranchRelations`의 실제 지원은 six_harmony, three_harmony, half_harmony, clash, harm이다. 실제 검출된 관계만 정규화하고, 두 사람의 실제 위치·지지를 검증한다. stem-combination/punishment/break/wonjin/directional-harmony의 교차 관계는 새로 만들지 않는다. 원국 내부 또는 월운의 관계가 있다고 교차 Pair 지원으로 승격하지 않는다.

A→B는 subject A/recipient B, B→A는 subject B/recipient A를 보존한다. receivedTenGod는 수신자 일간으로 기존 함수를 통해 재검증한다. 같은 십성이 나와도 방향별 relationId를 합치지 않는다. 기존 personId는 이름·출생정보 등으로 유도된 내부 귀속 hash이며 인증 토큰이 아니다.

부모·자녀/상사·팀원의 현재 UI 역할 표시는 실제 친권·직책·권한 확인과 다르다. Graph는 실제 역할·권한을 UNKNOWN으로 둔다. 사업의 지분·계약·매출·부채·대표권, 친구의 친밀도·갈등·연락 이력도 입력 없이 생성하지 않는다.

관계 미검출은 나쁜 궁합이 아니다. 미검출 회귀는 기존 canonical detector와 실제 전체 V4 Book 생성 양쪽에서 확인했다. 추가 가상 두 사람의 확인된 연·월·일지가 모두 卯인 원국에서 지원 교차 관계는 0건이고 양방향 십성은 별도로 남는다. 시주와 MBTI는 미상으로 유지했다. 지원 관계 미검출이 다른 모든 관계의 부재나 나쁜 궁합을 뜻하지 않는다.

## 전체 ancestry와 선행 검증 연결

`EvidenceKnowledgeIndex`는 정확한 원본 file/pointer 포함 관계와 기존 CatalogKey를 사용한다. Source Verification에서 기술적으로 확인한 동일 target의 receipt occurrence만 연결한다. 이는 원천 확인 연결이며 개인 계산 사실 또는 고객 해석 승인으로 바뀌지 않는다. source hash, 원래 policy config, 선행 manifest version을 검증한다.

원래 domain 정책의 ID와 선언을 그대로 인수해 모든 필수 실제 조상의 domain을 검사한다. 허용된 일부 부모만 있다는 이유로 금지 부모를 통과시키지 않는다. 차단된 실제 derived node와 원천 domain, 기존 정책 ID, 해결 요구는 노드/edge/receipt에 남는다.

선행 friendship CHILDREN 63건은 static 연구 ancestry 관찰이다. `static-actual-ancestry-comparison.json`은 실제 source locator와 연결되는 선행 연구 참조를 별도 기록하며, 이를 실제 계산 부모로 승격하지 않는다. 실제 Graph의 CHILDREN 영향 수와 static 63건을 같은 집합으로 주장하지 않는다. 기존 `relationshipProductView.ts`의 `.some` 경로는 변경하지 않았으며, 고객 런타임에서 전수 차단이 이미 시행된다고 주장하지 않는다.

192개 sourceGroups와 기존 188개 기술 차단은 그대로 보존한다. `verifyActualSourceGroup`은 원래 AND 및 조건부 표시 대체 그룹, owner, 모든 필수 source를 검증한다. 실제 표시 이력이 제공되지 않은 조건부 그룹은 통과시키지 않는다. Graph는 아직 전문 연구를 bind하지 않으므로 실제 호환 표시 그룹 사용 승인은 0이다.

## 대운·세운·월운

대운의 실제 10년 cycle과 상품의 14년 편집 슬롯을 분리한다. 현재 cycle에만 노출된 natal factor를 다른 cycle에 복사하지 않는다. V4 대운 패킷은 전체 customerDayun cycle의 정확한 시작/종료 경계를 모두 노출하지 않는다. 확인되는 전환 시각·range를 보존하고, 없는 종료 경계나 연간 실효 구간은 UNKNOWN_INTERVAL로 둔다. 편집 reason ID를 별도 독립 계산 root로 세지 않는다.

세운은 `annual-month-jie-kst-v2`의 모든 월 segment를 읽는다. 선택 연도/명목 annualGanji와 segment의 effectiveAnnualPillar를 분리하고, 입춘 이전 값을 덮어쓰지 않는다. focus는 기존 편집 대표 구간 표시일 뿐 전체 기간의 대체 근거가 아니다. 2segment로 고정하지 않는다.

모든 실제 relationFact와 monthly extension의 신살·귀인·십이운성·원진 관찰 ID, sourceRefs, basis를 보존한다. 기존 transit gate에서 보류한 모호한 망신/미지원 관찰은 그대로 WITHHELD이며 verified producer fact로 표시하지 않는다. 기존 extension의 미지원 선언도 실제 검출 사실과 분리한다.

기간은 `[startKst, endKstExclusive)`다. 교운 range의 두 후보를 모두 활성으로 확정하지 않고, 첫 대운 이전에는 활성 cycle을 만들지 않는다. 순수 교집합 함수는 confirmed/conditional/no intersection/unknown/unsupported를 구분한다. 실제 필수 부모 edge에서도 시간 교집합을 검사한다. 3/4층 독립 복합 판정은 미지원이며 pair 관계들의 합으로 성립시키지 않는다.

## 가상 사례와 검증 범위

기존 `tests/fixtures/six-product-integration-01/source-locks.json`의 고정 가상 사례 17개를 재사용하고 다음을 추가해 총 27개를 관찰한다: major C, annual C2028, 양쪽 미상 궁합, A/B swap, 동일 원국 다른 MBTI, 동일 MBTI 다른 원국, 동일 원국 다른 상품, 범위 교운, 첫 대운 이전, 전체 원국의 지원 교차 관계 미검출.

평가 시각은 `2026-10-12T12:00:00+09:00`로 고정한다. 기존 오프라인 policyDate 경로만 사용해 미래·과거 선택 연도를 검증한다. 신규 운영 정책·공개 gate를 변경하지 않는다. 정규화 kind와 precision은 `actual-producer-observations.json`에 남으며, 원래 상세 입력은 동결 fixture와 CLI의 명시적 가상 입력 변경에서 재현할 수 있다. Git Graph 산출물에 이름·생년월일·출생시각·원본 personId와 입력의 결합을 추가하지 않는다.

필수 A~AL 사례의 실행 범위는 `case-coverage.json`을 참조한다. 6상품·7관계 실행이 모든 MBTI 유형·모든 명리 규칙의 전수 검증을 의미하지 않는다.

## 산출물·결정론성·개인정보

```sh
node scripts/actual-evidence-graph/verify.mjs
node scripts/actual-evidence-graph/verify.mjs /tmp/gyeol-actual-graph-rebuild
```

실행은 오프라인이며 fetch/HTTP(S)를 차단한다. 기존 파일 hash/manifest가 다르면 중단한다. 원본 검증 폴더·runtime src·관련 없는 출력 폴더에 덮어쓰지 않는다. 신규 route/API를 만들지 않는다.

Node/edge/receipt는 fixture별 shard, 나머지는 참조 index다. Binding 요구는 같은 Graph payload를 다시 복제하지 않고 shard와 필요한 필드를 지정한다. 공개 artifact는 synthetic 전용이며 원래 person hash와 입력에서 유도된 Graph/root hash를 ordinal fixture alias로 바꾼다. 정확한 producer ID 비교는 메모리에서 먼저 수행한다. fingerprint는 비식별 Graph에 대해서만 계산한다. 원래 원천 파일 hash는 개인 입력 hash와 다르다.

같은 입력·버전의 두 신선한 CLI 실행을 byte 단위로 비교한다. 실행 시각은 외부 run metadata에만 기록한다. 실행 시간은 결정론적 Graph/receipt와 분리해 측정한다. `quality-audit.json`은 재생성 비교 대상인 Graph 산출물과 구분된 성능 검증 보고서이며, 실행 시각 없이 관측 시간을 기록한다.

## 최종 측정

| 항목 | 실제 결과 |
| --- | --- |
| 실제 입력 실행 | 27사례, 6상품, 궁합 7유형 |
| Graph | 109,333 nodes / 351,274 edges / 27개 모두 정합성 유효·PARTIAL |
| 독립 producer 관찰 | 3,095회: 기술 검증 3,037 / 보류 58 |
| 원래 producer ID | 93,909개 범위별 관측. MBTI 원천·annotation·파생·편집 ID 포함, 전부 계산 사실이라는 뜻이 아님 |
| 서로 다른 batch root | 19,468: producer 관찰 2,069 / source 귀속 17,376 / 자기보고 입력 23 |
| 반복 root 참조 | batch 전체 327,255회. 개별 Graph 기준 합계 299,553회와 구분 |
| ancestry | 완전 107,958 / 불완전 1,375. 완전하더라도 domain 금지·사용 미승인은 별도 |
| 검증 차원 | owner 109,333/109,333, 방향 20/20, 시간 1,736/2,022 |
| 선행 검증 연결 | Source receipt 28,556회 / Semantic·Domain 2,480회 |
| 보류 | WITHHELD 2,747 nodes / 미지원 요구 144 / 미상 요구 33 |
| Fusion 양측 ancestry | 완전 9,716 / 불완전 1. domain 통과나 고객 승인이 아님 |
| 결정론성 | 신선한 CLI 2회, 생성 JSON 105개 byte 일치 |
| 실행 측정 | 전체 CLI 약 64초씩. Graph 구성 합계 2,005.35ms / 사례 최대 158.75ms, 기존 producer 생성 시간 제외 |
| 회귀 | 신규 Graph 56 PASS, 선행 검증 92 PASS, Book·한국어 669 PASS, 기존 7,796 PASS / 동일 46 FAIL |
| 기술 검증 | TypeScript 0→0, lint/build/diff-check PASS, 신규 실패 0 |
| 함수 trace | 88개 NFT에 raw 연구/검증 파일 유입 0, 기존 next.config.ts 불변 |

위 수량은 고정 가상 사례의 관측이다. 실제 MBTI는 8유형, Pair는 지원 5종 중 clash/harm/six_harmony 3종이 관찰됐다. 모든 유형·관계를 전수 검증했다고 주장하지 않는다. source locator 검증 비율의 분모는 source identity가 있는 노드이며, 없는 source가 자동 확인됐다는 뜻이 아니다.

일부 기존 일반 REINFORCE/TENSION producer는 별도 `ruleId`를 제공하지 않는다(3,457회). Graph는 원래 producer/version/type/axis와 양측 실제 계보를 남기고 `ruleId=UNKNOWN`을 유지한다. 기존 알고리즘의 관찰과 전문 규칙별 적용 승인은 별개이며, Binder는 명시적 rule ID 또는 검증된 기존 알고리즘 규칙 주소를 추가로 요구해야 한다.

## 테스트와 보존

`test-results.json`, `existing-failures.json`, `preservation.json`, `deterministic-rebuild.json`, `function-trace.json`에서 실제 결과를 확인한다. 기존 테스트·fixture·원고·생산자는 수정하지 않는다.

동시 실행 중 Book fixture hook, 궁합 연애 DB X, 정적 격리 검사에 시간 제한이 발생해 원본 소스를 그대로 두고 독립 재검증했다. 최초 실패/대기 결과와 재실행 결과를 모두 남기고, 최종 실패 비교는 각 테스트의 실제 마지막 관측을 사용한다. 결과를 성공으로 꾸미거나 Vitest 원본 JSON을 수정하지 않는다.

최종 수치와 직접 읽은 Graph 예시는 `quality-audit.json` 및 `reviewed-graph-examples.json`에 기록한다. 17권의 계산/Evidence/원고/Book/snapshot 102개 digest를 비교하고 기존 저장본 재열람 fixture를 보존한다. 전체 build와 raw 연구/검증 문서의 NFT trace 미유입을 확인한다. Production 고객 DB나 실제 구매 Book은 접근·수정하지 않는다.

## 후속 Binder 요구와 남은 한계

이 작업은 Graph 엔진과 검증 계약을 제공한다. Binding에서는 정확한 실제 Evidence/producer/owner/방향/참가자/기간/확정성/전체 ancestry/source receipt/정책 blocker/root group을 인수하고, 실제 입력 조건·호환 표시 그룹·미지원 상태·의미 및 상품 정책·인간 운영자와 고객 사용 승인을 별도로 확인해야 한다.

원래 ID가 없는 관찰, 대운 패킷의 미노출 endpoint, 일부 legacy/편집 proof의 미해결 계보, 개인 Facet 및 완전한 Personal Resonance 출력 부재, 독립 복합 관계 미지원은 해결된 것으로 표시하지 않는다. 기존 실패 46건과 선행 미검토 의미/불완전 참조도 이번 작업에서 수정하지 않는다. 원래 방향 Evidence의 설명 문자열에 남은 조사 오류(예: `을목를`)도 새 원고 작업으로 확장하지 않고 그대로 보존했다. 모든 Graph가 PARTIAL인 것은 이러한 한계를 보존한 결과이며, 완전한 고객 사용 승인을 의미하지 않는다.

## Preview 확인

구현 커밋 `82c49d7b0f2071e28e589132e177969573b10323`의 실제 Vercel 배포 `dpl_8dAcefznAkwfRME3cfM7SVk2UVQN`이 `READY`다. [검증된 구현 Preview](https://gyeol-report-107ty877p-gyeol-report-s-projects.vercel.app). 배포 API의 Git SHA/branch/repository/project와 Preview target을 대조했고, 기록은 `preview-result.json`이다.

이 문서 기록 커밋도 동일 feature branch에 push한 뒤 최종 HEAD의 실제 Preview READY와 원격 SHA를 별도 확인한다. 최종 확인 기록은 문서 커밋의 자기 SHA 순환을 피하기 위해 외부 `/tmp/gyeol-actual-evidence-graph-01-validation/final-preview.json`에 저장하고 최종 응답에 기록한다. 구현 소스·산출물은 문서 커밋에서 바꾸지 않는다. master·Production은 변경하지 않으며, Knowledge Binder는 시작하지 않는다.
