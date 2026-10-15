# V4 Compatibility Marriage Specialist Engine 01

결혼 궁합 전문 엔진을 오프라인으로 구현했다. 실제 고객 승인·선택·출력은 모두 0이며 기존 Writer/Reader/Book을 변경하지 않았다.

- Base: `2b7d43747643cc0e660e06240a416977c1bc37b9`
- Branch: `v4/compatibility-marriage-specialist-engine-01`
- 새 코드 11개 TS 모듈, 독립 합성 registry, CLI, 신규 테스트만 추가했다.
- 실제 기존 worktree는 47개였다. 지시문의 46개와 차이 1개를 기록하고 모두 보존했다. 원본 dirty11과 기준 tracked4,634개도 보존했다.

## 실행 계약

`KnowledgeBinderCatalog`와 `ProductSpecialistFoundation`의 원본 정규화 조건을 보존한다. Marriage 전용 Catalog view가 `cmpr:` 원본112개와 source82개를 읽는다. 기존 `adaptPairMaterial`은 명시적인 source-use 분류 변환을 통한 native 관측에만 재사용하고, Pair 정체성 검증은 기존 `pairWitnessErrors`/`observePairWitnesses`를 재사용한다. Love의 친밀감·연락·관계 속도 정책을 사용하지 않는다.

원본 `sourceUsesAreConjunctive=true`와 모든 Source Group/미해결 조건을 유지했다. 추가 관측은 `required:false`이며 자료 존재·계산 존재를 원고 적용 승인으로 바꾸지 않는다. documentary57회는3개 원래 외부 context source의 반복 참조이며 개인 계산 사실이 아니다. Source Registry 존재 확인과 외부 자료 의미 검토 완료는 별도다.

실제 결혼 카테고리와 내부 `relationshipStatus=married`는 혼인·동거·가사·재정·자녀·가족 갈등의 입력 사실이 아니다. 전부 UNKNOWN으로 남긴다. 기존 Reader의 배우자 표현은 보존된 감사 대상이며 새 엔진의 사실 승인이 아니다. 원본 가상 장면과 jointDecision을 보존하며7개 업무 단계의 매핑은 명시적인 원래 enum에만 한정한다. 각 단계의 독립 의미·실제 노동·권한을 승인하지 않는다. 준비와 실행, 완료 확인, 동의와 결정권, 실제 비용을 구분한다.

## 기준군과 실제 실행

| 단위 | Before | After |
|---|---:|---:|
| Catalog candidates × Graph | 222×1 | 222×1 |
| Source reference matches | 675 | 675 |
| Actual graph witnesses | 72 | 96 |
| Structurally matched | 4 | 4 |
| Source Group PASS | 0 | 0 |
| Actual customer eligible/claims | 0/0 | 0/0 |

추가 witness의 원본ID·producer·owner·direction·ancestry·원래 적용 조건과 전체 Binder receipt는 `marriage-source-matches.json`에 있다. 관측 증가를 전문 의미 승인으로 집계하지 않는다.

112개 자료는100 conditional/12 recall이고9장·36문단·144역할·180질문·448기여를 보존했다. 장별8/8/8/12/16/16/16/16/12다. Canonical5종/34 membership만 실제 producer 지원을 사용하고30개 정의는 보류한다. 양방향 십성은 수신자 일간 기준 원래 literal을 확인한다.

MBTI Pair256방향의 direct158/inferred98과 원래 forward/reverse pointer/hash를 보존했다. 선택된10방향과 공통246방향을 구분한다. A13유형/B15유형의 합집합16은 전체 전문 후보 완전성이 아니다. 256×180=46,080 pair/question 조합 중 후보 선언이 없는 조합은 45,520개다. 빈 곳을 일반 문장으로 채우지 않았다. 후보가 선언돼도 고객 답변 가능 수는0이다.

## 의미·선택·안전

실제 의미112개는 REVIEW_REQUIRED, 해소0이다. 비교한6,216쌍을 확정 모순으로 집계하지 않는다. 실제 승인된 새 응용은0, 중복 fact-root group은2개다. supportingAncestryRoots와 informationRoots를 분리하고 새 Root·임의 사용 상한을 만들지 않았다.

CH08 예방적 가상 절차와 실제 갈등 회복을 구분한다. 회복 후보는 같은 pair/root와 실제 선택된 CH07 의미를 요구한다. CH09는 같은 인물·유형·근거·방향·의미·claim·context·원래 소개 주소 및 실제 표시 기록을 요구한다. 계획 배정/연구 참조는 표시 이력이 아니다. 실제 고객 표시 ledger는 발급하지 않았다.

독립 합성 registry에는180질문/206재료와 별도 Source hash, A/B owners, producer facts, canonical/direction/Fusion facts, meanings, private approval, display ledger를 등록했다. 실제12 Hard Gates를 재실행하고 private WeakMap session과 registry byte 검증을 사용한다. 실제 연구에 합성 승인을 적용하지 않는다. 성별·유형 담당 고정, 소득/자산/부채/자녀/친족 사건 창작, 미확인 결정권·동의·비용, 준비만/실행만으로 전 과정 책임 주장, 강제 회복을 차단한다.

| 알고리즘 | 실제 합성 표시 없음 | 등록된 합성 표시 있음 |
|---|---:|---:|
| FIRST_ELIGIBLE | 159 | 179 |
| QUESTION_FIT_FIRST | 159 | 179 |
| GLOBAL_CONSTRAINT_AWARE | 160 | 180 |

모두 hard violation0이다. 전체 질문·방향·선행 의미를 고려하며 한도에 걸리면 `SEARCH_LIMIT_NO_OPTIMALITY_CLAIM`을 반환한다. 이 fixture의 결과를 보편적인 알고리즘 우열로 해석하지 않는다.

## 보존·검증

- Marriage A–AB28사례/32변형(31 Marriage/1 Love)을 원래 실제 생성기로 재실행했다. Q whole swap, R name-only swap을 구분했다. 기존 M/N/AB는 `compatibility-product-13d-7b-v1` fallback이며 원래 Major `REPEATED_LONG_PHRASE`가 남는다. BODY_LENGTH는 별도 quality diagnostic이고 이것만으로 fallback 원인이라고 하지 않는다.
- 기존17권/102digest, 전체 원고·Book, stored offline roundtrip과32 pair 전체 packet/원고/Book을 byte 단위로 비교했다.
- 기존 Love80자료,190×4=760군, witness229/structural12와 O/Q fallback을 포함한 다른6유형을 변경하지 않았다.
- 기존20군/18,610연구·4,270잠재후보와 Catalog59, Source20, Semantic23, Graph105, Binder83, Foundation64, CSE29, Career35, single-Love38, Major28, Annual29, pair-Love25 JSON을 보존했다.
- 신규 engine176 + artifact11 PASS, 기존 관련754건은 첫 실행698PASS 및 원래240초 setup timeout으로 실행되지 못한 단일 연애56건의 단독 재실행56PASS로 확인했다. timeout·fixture·기존 소스는 변경하지 않았다. 기존 실패 비교군은5837PASS/46FAIL로 동일하고 전체 정규화 오류 메시지도 일치한다. cohort는 겹칠 수 있으므로 합산하지 않는다.
- TypeScript0→0, lint/build 경고0, diff-check PASS. NFT는 app-server88개와 Next root2개를 합한90개이며 경로와 의존 파일 집합이 동일하다. 신규 offline 코드/대형JSON은 고객 함수 trace에 없다.
- 최종 고정 source15개로 독립 CLI2회를 실행해 41개 생성JSON과 manifest byte가 동일했다. 실행시간·메모리는 Git 밖 성능 로그에만 있다. 실행시간은 1523.1s / 1521.0s, 최대 RSS는 5.69GiB / 5.91GiB다. 고객 runtime 성능 측정이 아니다.

재현: `NODE_OPTIONS=--max-old-space-size=8192 node tools/compatibility-marriage-specialist-engine/verify.mjs /tmp/empty-marriage-audit-dir`

## 주요 산출물

`compatibility-marriage-specialist-manifest.json`, `marriage-source-assignment-audit.json`, `marriage-source-use-conjunction.json`, `marriage-source-matches.json`, `marriage-planner-candidate-contract.json`, `marriage-type-question-coverage.json`, `marriage-household-context.json`, `marriage-ch07-ch08-dependency.json`, `compatibility-marriage-operator-worklist.json`, `marriage-operator-review-priority.json`(원천 확인·실제 witness·미해결 조건에 따른 검토 순서이며 고객 ranking이 아님), `technical-validation.json`, `book-preservation.json`, `deterministic-rebuild-audit.json`, `compatibility-marriage-specialist-handoff.md`를 제공한다. 정형 후보·근거·의미·충돌·재사용 계약은 오프라인 검토용이며 고객 ranking이 아니다.

## 남은 조건

112개 의미·승인 검토, 원래 source group/자연어 적용 조건, 실제 미입력 생활 사실, 미지원 관계와 원래 Fusion rule ID 누락, 기존 M/N/AB fallback 및46 baseline 실패를 유지한다. 고객 Writer 연결·판매 품질 승인·Production 승인이 아니다. ParentChild Specialist는 시작하지 않았다.

최종 commit/push/원격SHA/정확한 SHA의 Vercel Preview receipt는 commit 후 검증하여 최종 응답과 `/tmp/gyeol-compatibility-marriage-specialist-engine-01-validation/final-task-results.json`에 기록한다. Git 자기 SHA를 본문에 넣는 순환을 만들지 않는다. master/Production/DB/결제/인증/Worker/환경변수는 변경하지 않았다.
