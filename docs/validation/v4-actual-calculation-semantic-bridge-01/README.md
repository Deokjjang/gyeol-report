# V4-ACTUAL-CALCULATION-SEMANTIC-BRIDGE-01

실제 계산 사실을 나타내는 Typed Unit 생성과 오프라인 Adapter를 구현했다. 조건부 의미·상품·고객 승인, Specialist Claim, Planner·Writer 또는 고객 Runtime 연결은 수행하지 않았다. 미확정 계산·기간은 Unit 발급을 보류한다. 최종 실제 실행 수치는 아래 결과와 coverage JSON에 기록한다.

Base: `v4/conditional-temporal-meaning-source-review-01` / `456b889261d5217f5cbc5599fbcc6692347d9655`.
작업 branch: `v4/actual-calculation-semantic-bridge-01`.
지속 worktree: `/Users/Deokmin/Developer/gyeol-worktrees/v4-actual-calculation-semantic-bridge-01`.
공통 Git: `/Users/Deokmin/Dev/projects/gyeol-report/.git`.
외부 로그: `/Users/Deokmin/Documents/gyeol-validation/v4-actual-calculation-semantic-bridge-01/`.

## 구현 범위

기능 소스는 신규 **2개**다. 기존 Source/Binder/Graph/계산/연구 DB/Specialist/Planner/한국어 Writer/Book/Runtime 파일은 수정하지 않았다.

- `actual-calculation-semantic-bridge/units.ts`: 기존 packet digest·profile Producer·Graph compiler를 다시 검증하고 opaque context를 만든다. 기존 `verifyTemporalTenGodCalculation`과 정확한 기초 정의 `SourceProof`를 사용해 `VERIFIED_CALCULATED_FACT` Unit을 생성한다. 일간 자체는 기존 day-stem node와 `foundation:day_master:*` 정의를 확인하며 십성을 임의로 부여하지 않는다.
- `full-product-integration/actualCalculationAdapter.ts`: 기존 실제 Fixture 경로와 동일한 등록 입력·V4 생성 함수·profile Producer·Graph·`ProductSpecialistFoundation.run`을 사용하는 새 오프라인 진입점이다. Unit을 실제 native Receipt의 evidence node 주소에 연결하고 Typed handoff 및 중복 없는 원래 root 집합을 출력한다. 기존 `integrateActualFixture`의 동작·반환값은 바꾸지 않는다. 기존 Planner/Writer를 변경하거나 Unit을 고객 Claim으로 제출하지 않는다.

공식 DB·범용 Registry·계산기를 새로 만들지 않았다. 입력 fixture의 기존 pin을 검증하며 생성기의 `externalCalls`가 있으면 실패한다. Graph의 `synthetic:true`는 가상 검수 인물이라는 기존 계약이며 Synthetic Meaning Definition을 의미하지 않는다. 고객 신원·로그인 권한을 입증한 것으로 표시하지 않는다.

## 실제 검증 경로

등록 입력 → 기존 V4 실제 생성 → 동일 계산의 기존 profile 관찰 → 기존 Actual Evidence Graph → 기존 Foundation/Binder → 정확한 계산·Source 재검증 → Typed 사실 Unit → 오프라인 handoff.

`prepareActualFactContext`는 caller의 `verified=true`, `validation.ok`, `status`를 승인으로 믿지 않는다. 원래 packet digest와 실제 profile 관찰을 확인하고 Graph를 기존 compiler로 재구성해 전체 내용을 대조한다. context는 원본과 같은 ID/Root/기간을 가진 자체 snapshot을 보관하며 JSON 복제 context는 인증되지 않는다. fresh Fixture Adapter는 실제 생성 함수를 실행한다. factory 자체가 천문·십성 계산을 독립 재계산한 것은 아니다.

`createActualTenGodUnit`은 기존 계산 검증기를 호출한다. 같은 Owner·기준/대상 천간·God·Origin·native Producer/version·Source hash·정확한 원래 구간을 확인한다. 단순 부분 구간을 전달해 더 넓은 원래 Unit을 받는 경우도 막는다. 모든 필요한 ancestor의 Owner·확정 시각·Source·Producer를 확인한다. 조건부/unknown/끝점 미노출 ancestor가 있으면 계산 label이 확인돼도 Unit은 발급하지 않는다.

`createActualDayMasterUnit`은 실제 일주 천간과 `SajuCalcResult.dayMaster`, confirmed day, 기존 `calculateSaju` Producer/version, 원래 day-stem node를 확인한다. reference/target은 원래 일간이고 calculatedTenGod는 null이다. 새로운 자기 비견 사실을 계산하지 않는다.

기초 정의의 exact 기존 ID와 명시적 alias만 사용한다. Native 중국어 십성과 기간 Producer의 한국어 label을 다시 계산하거나 원문 값을 교체하지 않는다. 일간·십성 정의의 기존 Source version/hash/review 상태를 보존하며 기술적 정의 확인을 전통 해석·실증 효과 승인으로 확장하지 않는다.

Unit은 Original Node/Producer/Version, Source ID/hash/version/proof, 계산 Source, 검증한 Producer/상수 파일 hash, 원래 Root·전체 ancestry, Owner/Direction, 기준/대상 천간, native God, Origin, 구간·확정성, 명목/실효 연주, 허용 사실 범위·금지 추론·승인 대기 상태를 포함한다. `MONTH_BRANCH_MAIN`에는 기존 지장간 본기 상수의 Source hash도 포함한다.

Unit ID는 투영 결과의 ID이며 새 Fact Root 또는 새로운 독립 사실이 아니다. 원래 node가 독립 root를 갖지 않으면 primary root는 null로 남기고, 기존 ancestry root 집합을 별도로 보존한다. 공유 root를 여러 Unit이 참조해도 독립 사실 수를 늘리지 않는다. 원래 `UNADDRESSABLE_PRODUCER_OBSERVATION` blocker/status는 보존한다. 정확한 pointer·Producer 관찰을 기술적으로 구조화하는 것이 원래 Binder의 고객 gate를 통과시킨다는 뜻은 아니다.

요청은 명시된 계산 필드만 허용하며 `verified`, 생활 해석, Synthetic 정의 같은 추가 필드를 거부한다. 원래 계산 witness에 해석·승인 metadata가 섞이지 않는다. Unit ID와 재검증에는 기존 JSON 안정적 `v4Digest`를 사용한다. 6 Origin 모두 JSON 저장·재읽기 후 원래 Unit ID와 재검증 결과가 유지됨을 확인했다.

`validateActualCalculatedUnit`은 실제 context와 기존 Source/계산을 다시 확인하고 Unit 전체를 재생성해 대조한다. 전달된 Source hash/version·승인 flag·추가 Claim·Synthetic 정의를 신뢰하지 않는다. 변경된 Source나 조작된 Unit은 보류한다.

## 기간·Origin 경계

- NATAL_STEM: 원래 visible year/month/hour 십성의 native enum을 보존한다. 미상 시주는 생성하지 않는다. 일간 자체 Unit과 십성 관계 Unit을 구분한다.
- DAYUN_STEM: 원국 일간 → 대운간 기준이다. exact cycle 기간 또는 검증된 monthly observation 구간을 유지한다. 전환 범위·필수 ancestor 끝점이 불명확하면 보류한다.
- ANNUAL_STEM: 원국 일간 → 실제 실효 연간 기준이다. Annual 상품의 월 segment에서 관찰한 연간 근거는 원래 month 범위 그대로다. 독립적인 1년 전체 Unit으로 확대하지 않는다. Major의 명목 연도/편집 관찰은 직접 계산 node/확정 연간 endpoints 요건이 부족해 발급하지 않는다.
- MONTH_STEM / MONTH_BRANCH_MAIN: 월간과 월지 본기를 다른 Origin으로 보존한다. 같은 node/root를 공유하는 투영을 독립 사실 두 개로 세지 않는다.
- FLOW_GOD: **대운간 → 실효 연간** 기준이다. 원국 일간 기준 annualGod로 바꾸지 않는다. 30개 원국 기준 생활 해석에 자동 매핑하지 않는다.

입춘·절입·교운과 `[start, endExclusive)`를 그대로 보존한다. 2026 Annual A는 2월 4일 05:02:08 KST 전후 실효 `乙巳`/`丙午`와 정재/편관을 구분한다. C2028의 4월 23일 21:42 KST 전후 FLOW_GOD는 기준 `壬`/`辛` → 대상 `戊`, 편관/정인이다. 정확한 연간·대운 원본 구간을 새로 계산하지 않았다.

## 의미 검토 인수

기존 30개 검토(24 C/D 제안, 6 E/D 약한 연결)를 hash/원본 ID/field/정의 proof와 연결한다. `reviewTemporalMeaning`·`applyTemporalMeaningReview`를 재사용한다. 모든 연결은 `CONDITIONAL_INTERPRETIVE_MEANING`, `MEANING_REVIEW_REQUIRED`, `PRODUCT_REVIEW_REQUIRED`, `CUSTOMER_APPROVAL_PENDING`이다.

NATAL 사실 및 FLOW_GOD에는 원래 30개의 기간 생활 해석을 억지 적용하지 않는다. 검토 자료가 누락·변조되어 연결이 실패해도 이미 독립 검증한 사실 Unit의 계산 상태와 고객 승인 상태는 바꾸지 않는다. 테스트에서 조건부 검토 Source를 제거하고도 사실 Unit을 생성하되 의미 연결만 보류하는 것을 확인했다.

계산 사실 Unit에는 자원 관리·관행 재검토·승진·소득 증가 같은 생활 해석을 넣지 않는다. 예를 들어 `calculatedTenGod=정재`는 검증된 상대 천간 관계이며, 수입의 존재·증가를 뜻하지 않는다. 향후 Specialist Claim은 authentic Unit 재검증에 더해 실제 Context·Source ancestry/Domain·의미·상품·공식 고객 승인 등 기존 12 Gates를 모두 충족해야 한다.

## 검증 및 산출물

신규 테스트는 6 Origin, Source/Producer/Node/Root/Owner/Direction 변조, 잘못된 기준·대상·God, 기간 축소/외삽/end-exclusive/조건부 확정, 미상 시주, 중복 root, Synthetic/Claim/승인 위조를 확인한다. 실제 일간·월운·실효 연간·교운 전후 Unit을 직접 확인한다. 동일 입력 재생성 및 서로 다른 입력의 실제 계산 차이도 검증한다.

기준 SHA에서 Major/Annual Specialist 두 파일을 별도 실행했다. 기존 두 실패는 `compatibilityProductAdapter.ts`의 과거 판본 hash 기대값이며 실패 이름과 전체 메시지를 이번 결과와 대조한다. 기존 테스트·hash 삭제/skip/재설정은 없다. 선택 실행만 했으며 전체 suite PASS를 선언하지 않는다.

산출물: [Unit coverage](actual-typed-unit-coverage.json), [Source/Evidence 검증](source-evidence-integrity.json), [의미 보류](remaining-meaning-gaps.json), [후속 계약](next-implementation-handoff.json). 전체 Unit/Native 영수증과 큰 로그는 외부 지속 Documents에 둔다.

ACTIVE_PERSISTENT_WORKSPACE_INTEGRITY와 LEGACY_TEMP_WORKTREE_RISK를 구분한다. 기존 69개 Worktree 및 dirty 11개·포렌식 915개를 비교한다. 새 Worktree 등록으로 70개가 된 것은 의도된 metadata 변경이다. 기존 `/private/tmp` 61개도 계속 검사한다. 역사적 사고 영향 합집합 33개·ignored/미기록 자료 미확인·삭제 주체 미확정은 유지하며 복구·정리하지 않는다.

Preview READY는 정확한 최종 commit SHA의 기술적 빌드 검증이다. 고객 승인·판매 승인·Production 배포를 뜻하지 않는다. 최종 commit/remote/Preview 및 post-push 보존 영수증은 외부에 기록한다. 이번 작업 이후 Claim 연결이나 다음 연구는 자동 시작하지 않는다.

## 최종 측정 결과

실제 7개 입력 실행(등록 Fixture 6개 + 이전부터 사용한 ranged-transition recipe 1개)에서 **586개 관찰 시도 중 검증된 사실 Unit 422개**, **발급 보류 164개**를 확인했다. 미검증 Unit 발급은 **0개**다. 원래 Root는 **246개**, 참조 횟수는 **855회**이며 새 Fact/Root는 0이다.

|Origin|검증 Unit|발급 보류|
|---|---:|---:|
|NATAL_STEM|25|0|
|DAYUN_STEM|51|63|
|ANNUAL_STEM|99|42|
|MONTH_STEM|99|0|
|MONTH_BRANCH_MAIN|99|0|
|FLOW_GOD|49|59|

NATAL_STEM 25개는 일간 자체 7개와 원국 visible 십성 18개다. 다른 Origin의 Unit 수도 원래 구간별 관찰 투영이며 독립 사건·새 계산 사실 수가 아니다. 같은 원국·대운·연간을 여러 월 구간에서 관찰한 것을 별개 독립 사실로 세지 않았다.

7개 입력의 Unit 수/보류: Major A **5/15**, Major F **3/16**, Major C **5/15**, Annual A **124/0**, Annual F **75/48**, Annual C2028 **129/0**, 기존 ranged-transition **81/70**. 새로운 입력 recipe나 가짜 계산 값을 만들어 Coverage를 채우지 않았다.

- 기초 정의 proof **13개**: 십성 10개 + 실제 입력에서 확인된 일간 3종. Original Producer/Source/Node/Root/전체 ancestry/Owner/Direction/실효 구간을 보존했다.
- 조건부 의미의 기술 연결 **348개**, 원국/대운간 기준 차이 등으로 자동 매핑하지 않은 **74개**. 30개 의미의 C/D·E/D 상태와 의미·상품·고객 승인 대기는 모두 유지했다. 연결 횟수는 승인된 의미 수가 아니다.
- Typed handoff는 422개 Unit을 실제 오프라인 Adapter에서 소비했다. 기존 native Receipt가 동일 node를 직접 선택한 Unit은 **2개**다. 나머지를 임의로 새 Specialist 선택·Claim·Book 배정으로 만들지 않았다. 향후 Claim 연결은 별도 검증이 필요하다.
- CLI가 Synthetic Meaning Definition 파일 접근을 차단한 상태에서 전체 실제 경로를 실행했다. **해당 파일 읽기 0회**, 고객 Claim/Reader Bridge/승인 **0/0/0**이다. 기존 Synthetic 기능은 별도로 그대로 유지했다.
- 기존 대운 Source cohort **30 FAIL → 30 FAIL**. 동일 실제 request에서 Unit 생성 전후 native Receipt 전체 hash 및 12 Gates 동일. 개인 Owner alias는 Fixture 범위를 나타내며 과거 다른 검증 실행의 주소를 고객 Identity로 주장하지 않는다.
- 신규 **58 PASS / 0 FAIL**. 기존 선택 15파일 **1003 PASS / 2 FAIL**. 정확한 BASE에서 Major/Annual 2파일 **149 PASS / 2 FAIL**. 두 실패 이름과 경로 정규화 후 전체 메시지 동일. 합계 선택 실행 **1061 PASS / 2 기존 FAIL**이며 전체 suite가 아니다.
- strict TypeScript 진단 **0**, ESLint 오류/경고 **0/0**, Webpack build **PASS / 관찰 경고 0**, diff-check PASS. 초기 새 Adapter의 untyped generator 반환 경계 관련 진단 9개는 기존 코드와 같은 V4 evidence 경계 및 optional 외부 호출 계약으로 바로잡았으며 초기 로그도 남겼다. any/검사 비활성화/ts-ignore/테스트 삭제·skip은 없다.
- 기존 **17 Books / 102 digest 모두 일치**. 저장본 roundtrip/reopen·명리/MBTI/Fusion/원고/Book 보존. Publication **32 SAFE_OFFLINE / 7 WITHHELD**, 원래 hash·오류·열람 gate 동일.
- 기존 Synthetic 12경로 draft digest 동일. public Runtime AST **46 roots / 700 modules**, 원래 digest 동일, offline 유입 0. NFT **88 route + 2 shared = 90**, 안정적인 Source/설치 의존성 집합 동일. generated chunk 이름의 raw byte 동일을 주장하지 않는다.
- 기존 69개 Worktree HEAD/branch/status/선택 file bytes/표시 파일/symlink와 원본 dirty 11개·포렌식 915개 동일. 기존 tmp 61개도 검사했으며 새 감소는 관찰되지 않았다. Git common은 지속 위치다. 새 branch/worktree/index/ref/reflog와 이후 commit/object/upstream은 의도된 metadata 변경이다. 역사적 ignored/미기록 자료 및 atime 보존은 별도 한계다.

실행 계약은 완료했지만 조건부 의미/상품/고객 승인, 현재 보류된 164개 시도, 기존 기술 부채 테스트 2개는 계속 남는다. 모든 명리 요소·상품·기간을 완성했다거나 최종 판매·배포가 승인됐다고 선언하지 않는다. 다음 작업은 시작하지 않는다.
