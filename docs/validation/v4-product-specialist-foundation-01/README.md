# V4-PRODUCT-SPECIALIST-FOUNDATION-01

오프라인 Foundation 구현과 검증 결과다. 고객용 claim·랭킹·문단 배정·Planner·한국어 생성·발행 연결은 활성화하지 않았다. 운영자 승인과 고객 사용 가능 후보는 모두 0이다.

## 기준과 보호 범위

- Base: `v4/knowledge-binder-01` / `2f5baa3f0241b440a83f8b5138b5b590a38a0a06` — 원격 일치 확인.
- 작업: `v4/product-specialist-foundation-01`, 독립 worktree `/private/tmp/gyeol-product-specialist-foundation-01`.
- 시작 시 기존 worktree는 지시문의 39개보다 하나 많은 **40개**였다. 모두 HEAD·브랜치·상태·tracked/nonignored untracked byte를 전후 대조했다.
- 원본 checkout: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`. `.gitignore`, `AGENTS.md`, `supabase/.temp/`를 포함한 미커밋 11개를 보존했다.
- 기존 tracked 4,153개 byte 동일. 연구 20군, 기존 Catalog59 / Source20 / Semantic23 / Graph105 / Binder83 생성 JSON 보존. 각 폴더의 추가 감사 보고서까지 frozen 목록으로 검사했다. 해당 수량은 각 엔진의 생성 JSON 집합이며 폴더 전체 JSON 수와 구분한다.
- Runtime·Product Adapter·계산기·MBTI·Fusion·Book·결제·인증·Worker·Supabase·환경변수·master·Production 변경 없음. reset/restore/stash/clean 없음. 네트워크 writer 호출 없음.

## 실행 계약

`ProductSpecialistFoundation.prepare(preparedCatalog)`에서 실제 Reader와 연구 원문을 인수하고, Registry/Question Index/typed overlay를 한 번 만든다. `run(request)`는 기존 ActualBindingIndex와 `bindKnowledgeCandidate`를 호출한다. 기존 Binder의 12 Hard Gates를 전부 실행하며 승인 provider를 받지 않는다.

기존 Catalog/SourceReader/Source·Semantic Verification/Graph/Binder를 복제하지 않았다. 새 CLI는 불변 기존 Binder CLI와 Graph CLI의 **동일한 27 fixture와 실제 producer 실행**을 사용한다. source ID·pointer·hash·producer observation·owner·direction·window 검증은 기존 계층이 담당한다. 개인 식별 자료를 가린 공개 JSON은 매칭 입력으로 쓰지 않는다.

추가된 코드는 새 Foundation 폴더, `tools/product-specialist-foundation/verify.mjs`, 신규 단위 테스트 한 파일과 이 검증 폴더에 한정된다. 고객 경로 import는 0이다. 새 CLI를 scripts에 두지 않아 기존 dev SQL loader의 광범위한 trace glob을 보존했다.

## Question Registry

실제 Reader 계약은 종합 13/52/208, 커리어·연애 9/36/144, 궁합 각 유형 9/36/144다. Registry에는 문단 질문과 문장 역할을 분리한다. 총 **2,060** = 문단376 + 역할1,504 + 세운 월12 + 대운 기간별 역할168(14기간 × 실제12질문).

궁합 love / marriage / parentChild / coworker / managerReport / businessPartner / friendship를 독립 interface로 유지한다. A/B/Pair와 방향 요구, source group, 원래 role/context/policy를 인수한다. 이번에 7유형 전문 선택 알고리즘을 만들지 않았다.

각 질문은 원래 product/relationship/address/material ID/meaning/requirement/source locator/hash/review 계약을 가진다. 모든 2,060 원본 위치를 실제 SourceReader로 재조회하고 hash를 검증했다. 대운 nested 질문 주소는 원래 배열 index를 포함한다.

현재 연구의 내부 C1–C10 주소와 실제 Reader CH 주소 사이에 선언되지 않은 변환을 만들지 않았다. 세운 monthMatrix에는 literal question 대신 primary/secondary meaning이 있으므로 originalQuestion=null을 유지한다. 없는 질문·역할·상품 범위는 창작하지 않는다.

| 상품 / 관계 | 등록 질문 | 실제 Catalog 적용 후보 | 질문 연결 후보 distinct | 질문-fixture witness 참조 | 고객 가능 |
| --- | ---: | ---: | ---: | ---: | ---: |
| saju_mbti_full / single | 260 | 200 | 179 | 1435 | 0 |
| career_money_study / single | 180 | 268 | 192 | 205 | 0 |
| love_marriage_child / single | 180 | 170 | 164 | 170 | 0 |
| saju_mbti_compatibility / love | 180 | 190 | 80 | 805 | 0 |
| saju_mbti_compatibility / marriage | 180 | 222 | 112 | 340 | 0 |
| saju_mbti_compatibility / parentChild | 180 | 235 | 120 | 230 | 0 |
| saju_mbti_compatibility / coworker | 180 | 335 | 172 | 635 | 0 |
| saju_mbti_compatibility / managerReport | 180 | 275 | 96 | 335 | 0 |
| saju_mbti_compatibility / businessPartner | 180 | 317 | 96 | 120 | 0 |
| saju_mbti_compatibility / friendship | 180 | 173 | 36 | 100 | 0 |
| annual_fortune / single | 12 | 109 | 12 | 372 | 0 |
| major_fortune / single | 168 | 89 | 14 | 0 | 0 |

표의 witness는 질문-fixture 참조 수여서 같은 후보/근거가 여러 질문에서 반복될 수 있다. 917개의 Binder match 또는 독립 해석 수와 합산하지 않는다. `product-readiness-matrix.json`에는 원래 명시적 product scope 후보 수와 실제 Catalog 적용 후보 수를 따로 기록했다. 직접/조건부/공통 참조·RECALL·REFERENCE 연결도 분리한다. EXPRESSION_ONLY는 타입으로 구분하지만 현재 확인된 명시적 연결은 0이며 창작해 채우지 않았다.

연구18,610 / 잠재후보4,270 / 비후보14,340. 질문에 연결된 잠재후보 distinct1,273, 직접 전문 자료 distinct1,056. 미지정1,903 후보는 원래 products=[]를 유지하며 `POTENTIAL_SPECIALIST_APPLICATION`으로 별도 관리한다.

## Requirement 정형화

4,270 후보 전체에 원본 선언·원본 필드·정규화 결과·방법·원본 위치/hash·요구 근거·상태·남은 UNKNOWN을 기록했다. 원본 candidate는 바꾸지 않고 복사본만 기존 Binder에 전달한다.

완전/부분/미정형 분류는 **52 / 2,029 / 2,189 → 52 / 2,029 / 2,189**다. 이것은 source selector의 기술적 정형화 분류이며 의미·고객 승인과 다르다. 자연어 조건5,734회, 모든 반례4,270건, 원래 금지와 source group, 실제 사용자 상태 부족은 그대로다.

정확한 기존 file/pointer/source check가 있는 source requirement7,212회는 원래 pointer/hash로 좁혔다. 이미 정형화된 selector2,140회도 인수했다. 합계 typed source9352회, selector 없는 source6857회다. 후자는 documentary/definition도 포함하므로 모두 계산 실패라고 해석하지 않는다. source gap이 있는 requirement1,629회와 미지원 producer candidate193건 / 해당 fixture occurrence374회를 따로 기록했다.

단순 축 이름/뜻 유사성으로 자연어를 계산 predicate로 바꾸지 않았다. 대안 proposal은 실제 Gate의 PASS 조건에 넣지 않는다. missing SourceKey·관찰 producer·사용자 상태·의미/반례·승인은 각각 별도 사유다.

## 세운: 원문 역할과 실제 시간 근거

- `annual-month-jie-kst-v2`의 12개월, 모든 실제 절입/교운 segment, `[start,end)`를 유지한다.
- selectedYear / nominalAnnualGanji / effectiveAnnualPillar / monthPillar / civilMonth / segment / focus를 분리한다. focus가 아닌 구간도 모두 포함한다.
- 월간 십성은 `component=ten_gods` + `stemTenGod`, 월지 본기는 별도의 `branchTenGod` selector다. 명시된 원래 role가 없는 십성10개 연구 행은 두 role의 실제 대안 witness만 출력하며 `AMBIGUOUS_MONTHLY_GOD_ROLE`, selectionMade=false를 유지한다.
- 실효 연주 pillar의 실제 identity는 확인할 수 있다. 그러나 실효 연주 기준 god와 세운 Graph의 대운 천간 god는 미노출이므로 selector=null / producer support required다. 월간 또는 원국 god를 가져와 채우지 않는다.
- 정확한 source pointer/producer ID/owner/value/segment interval을 원래 Graph와 대조한다. 요구 window가 다른 관찰은 `REQUIRED_EXACT_WINDOW_MISMATCH`로 제외한다.

실제 C2028년 4월:

| 적용 구간 시작 (KST) | 끝 (exclusive) | 월간 / 월지 십성 | 실제 대운 |
| --- | --- | --- | --- |
| 04-01 00:00:00 | 04-04 15:03:06 | 정관 / 정관 | 壬申(index3) |
| 04-04 15:03:06 | 04-23 21:42:00 | 편인 / 비견 | 壬申(index3) |
| 04-23 21:42:00 | 05-01 00:00:00 | 편인 / 비견 | 辛未(index4) |

1월의 nominal 戊申과 실제 丁未 연주, 2월 입춘 전후의 연주 변경, 교운 불확실 범위, 첫 대운 시작 전 상태도 원래 ledger와 일치한다. uncertain dayun node와 미지원 상태를 확정 사실로 만들지 않았다.

**기본 비교군5,073**에서 Annual actual match는 0→0이다. 정확히 civil_month가 선언된 원래 monthMatrix 후보를 실제 각 segment에 대조한 **별도124 period attempts**에서는 원래 month pillar / effective annual / boundary **372 witness occurrences**, 구조124회를 확인했다. 이때 원래 자연어·의미·context·반례·승인 조건은 유지됐다. ambiguous god 대안248회는 세 번째 별도 집합이다. 이를 917에 더하거나 새 해석 수로 세지 않는다.

124 period attempts의 의미 Gate는 REVIEW_REQUIRED, user-state는 UNKNOWN, specialism은 UNKNOWN, customer approval은 REVIEW_REQUIRED다. 고객 사용0. 월 번호만으로 사건·성공·보상을 판단하지 않는다.

## 대운

14년 editorial horizon과 실제 10년 cycle을 분리했다. 현재/이전/다음의 실제 cycle value, activeAtEvaluation/timePosition, 십성, 전환 시각/범위, original cycle index를 유지한다. 14 slot을 14 cycle 또는 14 independent fact로 세지 않는다. 현재 cycle 원국 관계를 다른 cycle에 복제하지 않는다.

기존 Graph가 미노출한 cycle start/end와 nominal-year 연간 interval은 채우지 않는다. unknown endpoint, 3층/4층 복합, incomplete ancestry는 기존 Gate에서 계속 보류된다. 기존 연간 이유 문장을 새 계산 근거로 승격하지 않는다.

## 동일한 Before / After

| 단위 | Before | After |
| --- | ---: | ---: |
| Research records | 18,610 | 18,610 |
| Distinct 잠재 후보 | 4,270 | 4,270 |
| Candidate-fixture primary occurrences | 5,073 | 5,073 |
| Source reference matches | 10,536 | 10,536 |
| Actual witness occurrences | 917 | 917 |
| Structural occurrences | 81 | 81 |
| Source Group PASS | 0 | 0 |
| Customer eligible | 0 | 0 |
| Primary withheld | 5,073 | 5,073 |

12 Gate의 상태별 건수는 모두 동일하다. 명시적 월 시간 계약을 인수하면서 시간 부족 사유110회가 UNKNOWN_INTERVAL에서 ACTUAL_PERIOD_REQUIRED로 더 구체화됐다(856→746, 316→426). 이것은 Gate 통과나 시간 계산 추가가 아니다.

원래 source group192 records / 내부 evaluation201, 기존 technical-held188, 실제 통과0. AND 전체 source, 조건부 실제 displayed ledger, RECALL 표시 이력 조건을 바꾸지 않았다. Registry의 존재를 실제 Book 표시로 간주하지 않는다. 사업파트너·친구 등 domain 차단은 scopedUses로 기록하고 원천 지식의 전역 금지로 확장하지 않았다.

실제 Graph는27 PARTIAL,109,333 nodes,351,274 edges, withheld2747 그대로다. batch root19,468, 기존 Binder distinct root358 / reference2958도 동일하다. 별도 period attempts는 기존 root248을 재참조하며 새 독립 사실을 추가하지 않는다.

## Coverage와 남은 작업

- 등록 질문2,060 중 검증 fixture들에서 명시적 적용 자료가 확인된 질문1,892, 실제 witness가 있는 질문832. witness가 없는 distinct 질문1,228.
- 질문-fixture4,304회 중 자료3,800회, witness1,240회, 자료/근거 부족3,064회. 이와 별개로 고객 답변 가능 질문은 전체 **0**이다.
- 의미 검토, 실제 개인 상태, missing producer, source group, domain/반례/운영자·고객 승인은 별도 Gate다. operator worklist4,270항목은 실제 의미·반례와 source/actual evidence/남은 조건을 제공한다. 우선순위는 검토 순서이며 고객 랭킹이나 자격 부여가 아니다.
- 원래 C/CH 연결, 명리 의미의 자연어 predicate, 개인 Facet, rule-specific Fusion, incomplete Personal Resonance, 일부 대운 endpoint, multilayer 시간 계약, 미지정 product policy와 승인 registry는 후속 승인 범위다. 이번에 수정하거나 추측하지 않았다.
- 후속 Specialist 입력/출력·제약은 `specialist-engine-handoff.md`에 명시했다. Verified receipt + approved meaning + actual roots/context/window/policy 이후에만 eligible claim을 고려한다. 현재는 활성화할 수 없다.

## 검증

- 신규 실제 producer 기반 회귀: **42 PASS / 0 FAIL**.
- 기존 Catalog/Source/Semantic/Graph148 + Binder74 + Book18: **240 PASS / 0 FAIL**.
- 기존 실패16파일의 모든 테스트: **5,837 PASS / 46 FAIL → 5,837 PASS / 46 FAIL**. 테스트 이름과 ANSI를 제거한 전체 오류 메시지 signature가 동일. 테스트 삭제/수정/skip 없음. 전체 저장소 테스트 PASS를 주장하지 않는다.
- frozen base TypeScript0 → 최종0, 신규0. 중간 구현 진단은 수정 후 다시 검사했다. 기존390건을 현재 기준선으로 재사용하지 않았다.
- lint PASS, Production build PASS, 신규 build warning0, staged diff-check PASS. 로컬 build이며 Production 배포가 아니다.
- 기존17권의6종 digest 각각, 합계102개 일치. 전체 narrative/Book/저장본 roundtrip과 기존 grammar probe 데이터도 동일. 운영 구매자 데이터 접근/수정 없음.
- 두 번 fresh CLI의64개 엔진 생성 파일이 byte 동일. 시간은 별도 performance-observations.json에 둔다. Matching은 가리기 전 실제 ID, 출력은 ordinal aliases. 가상 이름·생년월일·person hash·raw Graph fingerprint 출력 검사 통과.
- NFT88개 파일 path set 전부 동일. 신규 Foundation·연구·검증 자료·CLI 포함0. 가장 큰 로컬 traced-file 합계54.64MB, dev/account API31.75MB. 이는 원격 압축 function 크기와 다르다. next.config byte 동일.
- 오프라인 비용: `performance-observations.json`에 실제 Binder와 새 Foundation의 fixture별 wall time을 별도 기록했다. Catalog·overlay는 run당1회. 고객 경로 latency나 성능 개선을 주장하지 않는다.

## 산출물

- Registry / product contracts / material links / typed overlay family shards / typed selectors.
- 27개 실제 Graph에 대한 primary Before/After, annual period attempts 및 role alternatives, major selection.
- 상품 readiness /7관계 interface/질문 coverage와 분모 설명.
- source-contract-gap / unknown-unsupported /1,903 common inventory /4,270 review worklist.
- frozen source, baseline failure signatures,17 Book102digest,64파일 결정론, privacy,88 trace, 테스트 결과.
- 후속 계약 handoff. 신규 claim·랭킹·Planner·표현 생성과 후속 단계 실행 없음.

## Git / Preview

검증한 신규 파일만 feature branch에 commit/push한다. master/Production은 보존한다. 정확한 commit의 Preview READY와 원격 SHA는 push 후 확인하고 최종 보고한다. 검증된 parent Preview receipt를 보완 커밋에 기록하는 경우 최종 보완 SHA도 별도로 다시 확인한다. Preview READY는 고객 판매·해석 승인 또는 Production 배포 승인이 아니다.
