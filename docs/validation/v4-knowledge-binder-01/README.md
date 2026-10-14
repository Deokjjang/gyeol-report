# V4-KNOWLEDGE-BINDER-01

실행 가능한 오프라인 Knowledge Binder를 구현했다. 원본 연구의 요구조건을 실제 계산 Graph와 정확히 매칭하고, 후보마다 12개 독립 Gate와 Matching/Withhold Receipt를 생성한다. 고객 Runtime 연결·새 계산·Planner·한국어 생성·원고 삽입·승인 발급은 하지 않았다. **실제 고객 사용 가능 수는 0건이다.**

## 기준 및 보호

`daec9f64e0d871688ea1b657621127170f9c7529`에서 독립 worktree `/private/tmp/gyeol-knowledge-binder-01`, 브랜치 `v4/knowledge-binder-01`로 작업했다. 시작 시 원격 Base SHA와 원본 checkout HEAD를 확인했다. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`이며 미커밋 11개를 보존했다. 기존 worktree 39개와 이전 tracked 파일 4,042개의 HEAD·상태·byte를 대조했다. 신규 Binder·CLI·테스트·이 폴더만 추가했다. reset/restore/stash/clean, master 변경, Production·DB·결제·인증·Worker 변경은 하지 않았다.

Catalog 59 JSON, Source Verification 20 JSON, Semantic/Domain 23 JSON, Graph 생성 105 JSON을 보존했다. 기존 연구 20군 18,610건, 기초 4,799건, 기술 복구 3,288 / 미복구 3,202 참조, Domain Queue 2,966, 명시적 금지 1,040, 운영자·고객 승인 0을 실제 manifest와 대조했다. Graph는 27 PARTIAL, 109,333 nodes, 351,274 edges, WITHHELD nodes 2,747로 동일하다.

## 구현과 원천 인수

- `catalog.ts`: 실제 SourceReader·SemanticDomainVerificationEngine·EvidenceKnowledgeIndex를 재사용한다. 모든 연구를 분류하고 exact 원본/상품/관계/source locator/source group ID 인덱스를 만든다.
- `requirements.ts`: sourceKeys/ownedSources/basis/sourceGroups/requirements/sourceRefs를 원래 필드 계약대로 구분한다. 문서 인용을 계산 사실로 승격하지 않으며 자연어 조건은 보류한다.
- `matching.ts`: 원본 메모리 내 Graph와 같은 실행의 GraphInput을 인수한다. ActualGraphIndex를 별도 복사 인덱스로 재사용하고 exact producer/source/owner/participant/direction/period를 검증한다.
- `groups.ts`: 기존 AND와 조건부 alternative, owner/type, 실제 표시 ledger를 검증한다. 원래 기술 보류를 유지한다.
- `gates.ts`: 12 Gate를 독립 평가한다. CODEX 검토를 인간 승인으로 승격하지 않는다. 실제 승인 Provider는 NO_APPROVALS다.
- `engine.ts`: indexed search → source match → group 조건 → 호환 witness 선택 → Gate → receipt를 실행한다. Graph/Evidence 불변을 검사한다. 순위·claim·새 root를 만들지 않는다.
- `artifacts.ts`: 정확한 binding 후 비식별화한다. 공통 요구조건은 family별, receipt는 fixture별 shard로 저장한다.
- `tools/knowledge-binder/verify.mjs`: 기존 Graph CLI/27 fixture/producer를 그대로 관찰하며 새 DB·API 호출 없이 전체 Binder를 실행한다. 기존 Graph 산출물을 외부 mirror에서 byte 비교한다.

API·실행·승인·후속 소비 경계는 [binder-handoff.md](binder-handoff.md), 타입은 `src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types.ts`에 있다.

## 실제 수량과 분모

- 연구 records 18,610 = 잠재 해석 candidates 4,270 + 비후보 records 14,340. 기초 4,799건은 별도 source-only 집합이다.
- 잠재 후보 원래 계약: 완전 기계 판독 52, 부분 판독 2,029, 기계 판독 불가 2,189. 이는 의미·정책·사용 승인이 아니다.
- 명시적 product 범위 없는 잠재 후보 1,903건도 inventory/gap에 보존한다. 상품 질문을 임의 생성해 검색 범위를 확대하지 않는다.
- 27 fixture에서 후보 평가 5,073회, source reference matches 10,536회, 실제 Graph witness matches 917회다. 동일 source/witness가 여러 후보·fixture에 반복될 수 있다.
- FACTS_MATCHED 단계 116회. 구조 Gate 통과 81회는 source/producer/fact/owner/direction/ancestry/time만을 뜻한다.
- Source Group record 평가 192건, 원래 기술 보류 188건, 실제 통과 그룹 0회. 나머지도 실제 owner type/ledger 조건을 자동 통과시키지 않는다.
- 최종 APPROVAL_PENDING 0회 / CUSTOMER_ELIGIBLE 0회 / WITHHELD 5,073회. 첫 11 Gate 통과 후 승인만 남은 경우와 모든 승인 Gate 대기 5,073회를 구분한다.
- Binder가 사용한 batch distinct canonical roots 358, receipt-root reference occurrences 2,958, 반복 참조 2,600. 독립 사실 추가 0. 기존 Graph batch roots 19,468과 fixture별 root 수 합계 47,170은 다른 분모다.

## 6상품 Coverage

| 상품 key | distinct candidates | 평가 회 | source 참조 match | Graph match | FACTS_MATCHED | 구조 통과 | 고객 사용 |
|---|---:|---:|---:|---:|---:|---:|---:|
| annual_fortune | 109 | 545 | 1570 | 0 | 0 | 0 | 0 |
| career_money_study | 268 | 804 | 960 | 41 | 20 | 0 | 0 |
| love_marriage_child | 170 | 340 | 638 | 34 | 16 | 6 | 0 |
| major_fortune | 89 | 267 | 633 | 3 | 3 | 0 | 0 |
| saju_mbti_compatibility | 1531 | 2317 | 4915 | 552 | 54 | 52 | 0 |
| saju_mbti_full | 200 | 800 | 1820 | 287 | 23 | 23 | 0 |

세운 검색·receipt는 실행되었지만 이번 원본 연구의 월간/월지·기간 selector 정형 계약 부족으로 실제 계산 witness 매칭은 0이다. 이를 성공 매칭으로 보고하지 않는다. 대운 일부 십성은 실제 period observation과 연결되지만 source/ancestry 또는 의미·전문 질문 검토가 남아 고객 사용 불가다.

## 궁합 7유형 Coverage

| 관계 | distinct candidates | 평가 회 | Graph match | 구조 통과 | 고객 사용 |
|---|---:|---:|---:|---:|---:|
| businessPartner | 317 | 317 | 28 | 4 | 0 |
| coworker | 335 | 335 | 131 | 14 | 0 |
| friendship | 173 | 173 | 28 | 8 | 0 |
| love | 190 | 760 | 172 | 12 | 0 |
| managerReport | 275 | 275 | 71 | 4 | 0 |
| marriage | 222 | 222 | 72 | 4 | 0 |
| parentChild | 235 | 235 | 50 | 6 | 0 |

관계별 distinct 후보에는 같은 원본 자료가 여러 관계 범위에 나타날 수 있으므로 7유형 수를 합산해 궁합 상품 distinct 수로 해석하지 않는다. 부모/자녀와 관리자/보고자 역할은 원래 비대칭 계약과 입력 확인이 필요하다. 사업 파트너의 계약·지분·손익, 친구 관계 이력은 입력받지 않았으므로 UNKNOWN이다. 이름/유형/사주로 만들지 않는다.

## 12 Gate 실제 실행

| Gate | PASS | FAIL | UNKNOWN | NOT_APPLICABLE | REVIEW_REQUIRED |
|---|---:|---:|---:|---:|---:|
| SOURCE_INTEGRITY | 5043 | 30 | 0 | 0 | 0 |
| INTERPRETATION_REVIEW | 0 | 0 | 0 | 0 | 5073 |
| PRODUCER_SUPPORT | 2012 | 374 | 2687 | 0 | 0 |
| ACTUAL_CALCULATED_FACT | 116 | 1519 | 3438 | 0 | 0 |
| ACTUAL_OWNER | 177 | 62 | 4834 | 0 | 0 |
| ACTUAL_DIRECTION | 302 | 0 | 51 | 4720 | 0 |
| ALL_ANCESTOR_DOMAINS | 86 | 1790 | 3197 | 0 | 0 |
| TIME_INTERSECTION | 2 | 0 | 1170 | 3901 | 0 |
| ACTUAL_USER_STATE | 858 | 40 | 4175 | 0 | 0 |
| COUNTEREXAMPLES_AND_PROHIBITIONS | 0 | 372 | 0 | 0 | 4701 |
| PRODUCT_SPECIALISM | 2596 | 0 | 2477 | 0 | 0 |
| CUSTOMER_APPROVAL | 0 | 0 | 0 | 0 | 5073 |

총 Gate 평가 60,876회. 각 Gate에는 원래 필드/참조, 실제 발견 근거, 상태, 차단 이유, 해결 요구사항이 있다. actual customer 승인 발급은 0이며 synthetic-only 승인 객체는 신규 테스트 메모리 안에서만 사용한다.

## 실제 Receipt 독해

`reviewed-binding-examples.json`에서 27개 fixture의 실제 원본 ID, source locator/producer ID, 선택 witness·root·기간·12 Gate를 확인했다. 대표 사례:

- 종합 `cpr:material:CH06.P3:care-without-request`: 동일 owner의 `mbti:ENFJ:traits:identity:compassionate_facilitator:plainKo` source를 exact 매칭한다. 필요를 알아챈 것과 실제 요청받은 것을 구분하는 원래 연구지만, 실제 요청/관계 맥락/제공 여력은 미입력 자연어 조건이다. 계산 Gate PASS와 사용자 상태 UNKNOWN을 구분한다.
- 사업 파트너 `bppr:relation:rr:combination:yukhap:辰酉`: 실제 A/B의 hour/year 辰酉 six_harmony 관계 ID·참여 기둥과 일치한다. 실제 합의 존재가 계약·지분·성과를 증명하지 않는다. 원래 질문이 비어 있으면 전문성 UNKNOWN을 유지한다.
- 부모·자녀 `pcpr:material:CH06.P2:ba-adult-boundary-informs-contact`: 실제 B→A 방향과 받는 사람의 일간 기준을 확인한다. 성인 여부·동의·연락 경계·지원 필요·role version은 이 계산으로 증명하지 않으며 상태·반례 검토를 유지한다.
- 대운 `mfpr:god:편인`: 실제 대운 period의 편인 observation과 시간 witness를 찾는다. 원래 producer ID가 없는 관찰은 exact pointer/producer/owner/ancestry로만 연결한다. Source/ancestry FAIL을 계산 Gate PASS로 상쇄하지 않는다.
- 세운 `afpr:month-god:비견`: 월간과 월지 본기를 구분할 정형 location/segment 계약이 부족하다. source 참고만 있다고 해당 연도의 고객 개인 계산과 매칭하지 않는다.

추가 테스트에서 원본 identity/hash/version 불일치, 잘못된 owner·reverse 방향, 같은 유형 다른 사람, 실제 Pair 미검출/잘못된 원소, unknown MBTI/hour, Fusion ancestor/rule 부족, 원래 AND/alternative와 실제 ledger 부족, exact/ranged 교운·입춘 전 유효 세운·non-focus 월 segment·구간 비중첩·3/4층 미지원, fact 재사용·다른 상품·RECALL·합성 승인 만료/범위 및 실제 연구 승인 우회 차단을 확인했다.

## 정책 및 보류

전체 실제 ancestry와 원래 research required-source ancestry를 각각 검사한다. Source definition이나 documentary edge를 실제 계산 부모로 바꾸지 않는다. 기존 friendship CHILDREN static 사용 63건과 실제 Graph derived node 91건은 다른 집합이다. `inherited-safety-audit.json`에 원본 보류/비후보 분류와 scoped policy 결과를 기록했다. 다른 상품까지 금지를 확대하지 않는다. 기존 고객 Runtime의 `.some` 검사를 변경하지 않았고, 그 Runtime이 이미 전체 ancestry를 차단한다고 주장하지 않는다.

빈번한 차단 사유(서로 중첩되는 fixture-candidate 수):

- `CUSTOMER_APPROVAL_PENDING`: 5,073
- `OPERATOR_APPROVAL_PENDING`: 5,073
- `ORIGINAL_COUNTEREXAMPLE_REVIEW_REQUIRED`: 5,073
- `SEMANTIC_REVIEW_REQUIRED`: 5,070
- `ACTUAL_ANCESTRY_NOT_SUPPLIED`: 4,947
- `CONTRACT_NOT_MACHINE_CHECKABLE`: 4,899
- `ACTUAL_OWNER_REQUIREMENT_MISSING`: 2,957
- `EXACT_PRODUCER_REQUIREMENT_MISSING`: 2,957
- `SPECIALIST_QUESTION_OR_MEANING_UNKNOWN`: 2,477
- `ACTUAL_OWNER_EVIDENCE_NOT_FOUND`: 1,939
- `ACTUAL_EVIDENCE_NOT_FOUND`: 1,797
- `REQUIRED_USER_STATE_NOT_VERIFIED`: 1,787
- `INCOMPLETE_REQUIRED_ANCESTRY`: 1,373
- `UNKNOWN_INTERVAL`: 856

`source-contract-gaps.json`은 부분/미정형 계약을, `withhold-reason-registry.json`은 실제 이유별 Gate·빈도·필드·후속 요구를 제공한다. source trace, 실제 근거, 사용자 상태, 의미 승인, 고객 승인을 단일 Boolean으로 합치지 않는다.

## 재현·개인정보·보존

두 독립 CLI 실행의 생성 파일 83개가 byte 일치했다. output digest: `e9c187c8f57f5dcd65e9b40cd07c2fe91b8ec8303fa1c288fc4f969458dc4c73`. 각 실행은 원래 Graph 생성 105 JSON도 byte 일치했다. 시간/PII/private person hash/raw Graph fingerprint를 결정론적 Git 산출물에 넣지 않았다. 정확한 원본 binding 후 fixture ordinal alias로 내보냈다.
전체 오프라인 실행은 각각 118.91s / 208.95s, Binder 후보 매칭 구간 합계는 8.10s / 8.38s였다. 전체 수치에는 기존 Graph 생성/원천 prepare/산출물 기록이 포함된다. 고객 API 응답시간으로 해석하지 않는다.

17권의 계산/Evidence/draft/원고/Book/snapshot 102 digest와 전체 capture, 추가 한국어 probe가 전후 동일하다. 저장본 재열람 검증도 통과했다. 원천 DB/계산/의미 축/MBTI/Fusion/상품별 Adapter/Runtime/결제/Auth/Worker/Book 경로는 byte 변경 0이다.

## 테스트와 빌드

기준 SHA에서 7,796 PASS / 46 FAIL을 재현했다. 수정 후 기존 실패 파일 16개의 전체 테스트는 5837 PASS / 46 FAIL이다. 파일·테스트명·첫 오류·전체 정규화 signature가 46건 모두 동일하다. 원래 실패를 수정/삭제/skip하지 않았다. 전체 baseline을 다시 전부 실행한 것으로 주장하지 않는다.

- `binder-74`: 74 PASS / 0 FAIL / 0 pending.
- `core-after`: 148 PASS / 0 FAIL / 0 pending.
- `book-after`: 18 PASS / 0 FAIL / 0 pending.
- `existing-failures-after`: 5837 PASS / 46 FAIL / 0 pending.
- TypeScript: 기준 0 / 최종 0 진단.
- lint: PASS, 최종 warning 0.
- Production build: PASS(로컬 빌드만 실행), build warning 0.
- `git diff --check`: PASS.
- NFT: 기존 88개 trace의 전체 파일 경로 집합 동일, raw 연구/검증 JSON/Binder/CLI 신규 포함 0. 기존 scripts 디렉터리 glob에 새 CLI가 포함되는 것을 발견해, 기존 소스·설정을 바꾸지 않고 새 CLI를 tools 경로에 배치했다. `next.config.ts` byte 동일. 10개 dev trace가 참조하는 24개 빌드 파일의 byte 차이는 공개 prepareReportShare action ID와 static chunk 파일명 차이로 전부 설명되며 원본 Runtime byte 변경은 0이다. 용량은 로컬 traced-file 합계이며 원격 압축 크기와 구분한다.

## 남은 Gap 및 완료 범위

미정형 자연어 적용 조건, 명시적 product/question/meaning identity 부족, 미노출 producer rule/Facet/복합 시간 관계, 월간·월지·segment locator, 원래 기술 보류 Source Group, 실제 표시 ledger, 인간 의미·정책 검토, 진위 있는 승인 계약은 남아 있다. 수량을 맞추기 위해 근거·조건·승인을 만들어내지 않았다.

Binder 구현 및 검증 산출물 인수는 가능하다. 고객용 전문 해석 활성화·판매 승인·Planner·한국어 엔진 연결은 준비 완료로 선언하지 않는다. 후속 단계는 시작하지 않았다.

Feature 브랜치 push 후 동일 Git SHA의 Vercel Preview READY를 확인한다. Production 배포와 master 통합은 하지 않는다. 구현 Preview 기록은 `preview-result.json`, 최종 문서 커밋의 정확한 SHA/READY는 외부 최종 검증 receipt 및 최종 답변으로 남긴다.
