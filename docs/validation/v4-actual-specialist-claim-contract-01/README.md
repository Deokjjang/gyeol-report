# V4-ACTUAL-SPECIALIST-CLAIM-CONTRACT-01

실제 계산 Bridge와 기존 Major/Annual Specialist의 `diagnose(request, prepared)`를 연결했다. 원본 Binder가 선택한 Evidence와 일치하는 내부 검토 Candidate만 생성한다. 고객 Claim·승인·Planner 배정·Writer·Book·Runtime 연결은 수행하지 않았다.

- Base: `v4/actual-calculation-semantic-bridge-01` / `5895a4bf68e06fb3bcd456ed4d53deab6bbe36f0`
- 작업 branch: `v4/actual-specialist-claim-contract-01`
- 지속 worktree: `/Users/Deokmin/Developer/gyeol-worktrees/v4-actual-specialist-claim-contract-01`
- Git common: `/Users/Deokmin/Dev/projects/gyeol-report/.git`
- 외부 실행·로그: `/Users/Deokmin/Documents/gyeol-validation/v4-actual-specialist-claim-contract-01/`

## 구현 경로

등록 Actual Fixture → 기존 V4 생성 → 기존 Actual Graph → 기존 Typed Fact Units → 기존 Foundation 재실행 → 기존 Specialist diagnose → 원본 Native Binder Receipts 재검증 → 내부 Candidate → 명시적 보류.

신규 기능 소스는 두 개다.

1. `actual-specialist-claim-contract/contract.ts`: 실제 Bridge context·Unit을 재검증하고 Foundation/Native diagnose 및 `bindKnowledgeCandidate`를 직접 실행한다. 원본 Candidate·연구·Receipt·Diagnostic·12 Gates와 Source proof를 보존한다. opaque context와 전체 Candidate 재생성 검증을 제공한다.
2. `full-product-integration/actualSpecialistAdapter.ts`: 기존 `runActualCalculationFixture` 및 위 계약을 실제 호출하는 오프라인 진입점이다. 인증된 Unit snapshot으로 결과를 만들고 조립 중 입력 변경을 거부한다.

기존 엔진·Binder·승인 계약·계산·원본 연구 파일을 수정하지 않았다. 다른 열 개 Specialist의 diagnose·선택 경로를 추가하지 않았다. 새 범용 Specialist Framework나 Source Registry도 만들지 않았다.

## 실제 연결과 원본 Identity

Major는 실제 세 Fixture, Annual은 네 Fixture(기존 ranged-transition recipe 포함)에서 실행한다. Major의 Native Receipt는 입력당 89개, Annual은 109개다. 각 Receipt는 원래 Specialist index의 Candidate로 기존 Binder를 다시 호출해 전체 내용과 12 Gates를 대조한다.

기존 Foundation 직접 연결 두 개를 동일 Unit/node로 재현하고, 해당 Specialist가 원래 생성하는 Receipt에 연결한다. Foundation과 Specialist의 Receipt ID는 동일하다고 주장하지 않는다. 기존 Specialist의 요구조건 overlay에는 원국·오행·자연어 조건이 추가로 보존되므로 두 채널의 ID/hash가 다르다. `native-receipt-integrity.json`에 원래 Foundation ID와 Specialist ID/hash를 함께 기록한다. 새 Receipt를 발급하거나 기존 Receipt의 이름을 바꾼 것이 아니다.

연결 가능한 실제 연구:

|Fixture|원본 연구|검증 사실|원본 확정 구간|미승인 원래 해석 핵심|
|---|---|---|---|---|
|Major A|`mfpr:god:편인`|원국 일간 庚 → 대운간 戊, 편인|2023-07-15 08:00 KST ~ 2033-07-15 08:00 KST, end-exclusive|선택적 탐색과 다른 관점|
|Major C|`mfpr:god:편재`|원국 일간 戊 → 대운간 壬, 편재|2018-04-23 21:42 KST ~ 2028-04-23 21:42 KST, end-exclusive|외부 자원·접점과 선택 범위|

`originalClaimIdentity`와 `originalMeaningIdentity`는 원래 null이므로 null을 유지한다. 기술적인 Candidate ID를 연구 Claim/Meaning ID로 위장하지 않는다. 위 해석 핵심은 원래 연구의 조건부 내용이며 계산으로 입증한 생활 효과·사건이 아니다.

각 Candidate는 단일 Unit의 원래 Owner·Direction·Origin·구간을 사용한다. 같은 십성이라는 이유로 다른 기간을 병합하지 않는다. 원본 Native 선택 목록에 없으면 Diagnostic의 관찰·alternatives·matching evidence만으로 Candidate를 생성하지 않는다. 같은 node의 다른 역할도 Native 역할 witness로 구별한다. Annual은 현재 Native 선택 계약에서 연결되는 Unit이 없으므로 전체 미연결 상태를 유지한다.

## Root와 ancestry의 구분

초기 구현에서 Unit 전체 Root가 원본 Receipt Root의 부분집합이어야 한다고 요구해 두 연결이 보류됐다. 실제 값으로 조사한 결과, Receipt는 선택한 대운 Root 하나를 보유하고 Unit은 계산 기준인 일간 참조 Root까지 보유했다.

최종 계약은 원본 선택 node의 primary Root가 정확히 일치하는지 확인한다. `originalFactRoots`는 원본 Receipt 그대로, `verifiedUnitFactRoots`는 Unit의 원래 전체 Root, `additionalReferenceRoots`는 Native 선택으로 주장하지 않는 기존 계산 참조 Root다. 원래 Receipt·approval requirement·선택 목록에 참조 Root를 삽입하지 않는다. 전체 ancestry를 보존하며 새 Root·독립 사실은 만들지 않는다.

## 의미·조건·Gate 보류

계산 사실은 `verifiedCalculationFacts`, 미승인 해석은 `conditionalInterpretation`에 분리한다. 원본 Candidate·원고 연구 record·Source requirements/groups·counterexamples·prohibitions·Product applicability·Native diagnostic 및 모든 Gate를 보존한다.

명시적인 `inheritedRole`이 있는 두 후보는 기존 `reviewTemporalMeaning`을 호출하여 원래 Source ancestry와 검토 packet을 확인한다. `natalRequired`, `elementRequired`, `extraEvidence`, 현대적 Context 요구, 반례와 금지 추론을 별도 보존한다. 원국 자료나 십성 계산이 존재한다는 이유로 자연어 전제나 실제 권한·소득·경험을 충족했다고 처리하지 않는다. 미충족 조건은 `MISSING_REQUIRED_CONTEXT`로 보류한다.

기존 30개 검토의 24 C/D 제안·6 E/D 약한 제안은 모두 미승인이다. Source 기술 확인을 조건부 의미·상품·고객 승인으로 바꾸지 않는다. 기존 Customer Binder cohort의 30 Source FAIL과 Specialist의 해당 30 Source FAIL을 각각 확인한다. Source FAIL을 Meaning 상태로 옮기거나 원래 Gate를 바꾸지 않는다.

Candidate 상태는 여러 보류 원인이 동시에 존재하는 비독점 축이다. 두 후보 모두 `SPECIALIST_CANDIDATE_LINKED`이면서 Source·Meaning·Context·Product·Approval 보류다. 검증된 계산 상태 422개와 Native 연결 2개/미연결 420개를 별도 집계하며 이 수를 새 사실·승인 Claim 수로 합산하지 않는다.

동일 원래 Root의 반복 참조를 노출하되 독립 사실 수를 늘리지 않는다. 원래 Meaning Identity가 없으면 의미 중복 검증 완료를 주장하지 않는다. 서로 다른 연구의 동일 텍스트도 의미 동등성의 증거로 쓰지 않는다. Planner 배정은 빈 목록이며 내부 검토 외 용도로 `validateActualSpecialistCandidate`를 호출하면 거부한다.

## 검증

최종 수치는 아래 네 JSON과 외부 `actual-run-sealed/`에 기록한다.

- 실제 7개 입력: 기존 **422 verified Units / 164 withheld attempts / 246 distinct roots / 신규 Root 0** 보존.
- 실제 Major/Annual diagnose **3/4회**, Native Receipt 재검증 **703개**.
- 내부 Candidate **2개**, 고객 사용 보류 **2개**, Native 미연결 Unit **420개**.
- 기존 Source cohort **30 FAIL 유지**, 의미/고객 승인·고객 Claim·Reader bridge **0**.
- Synthetic Meaning Definition 파일 접근을 차단한 CLI에서 해당 파일 읽기 **0회**. 기존 Synthetic 구현·fixture·해시를 변경하지 않았다.
- 신규 **47 PASS / 0 FAIL**. 실제 A/C/F 기반 정상·교차 Fixture·Receipt/Gate 위조·Source/hash/version·Producer·Owner/Root·기간/Origin/FLOW·조건부 확정·Meaning/Claim ID 위조·반례/금지/Source Group 삭제·Synthetic/승인 위조·JSON roundtrip·비동기 입력 변조 검증.
- 기존 관련 **17개 파일: 1207 PASS / 2 기존 FAIL**. 정확한 Base에서 두 Specialist 파일 **149 PASS / 2 FAIL**을 수정 전 재현했다. 실패 이름과 전체 메시지 동일. 전체 저장소 suite는 실행하지 않았다.
- 기존 두 실패는 `compatibilityProductAdapter.ts`의 역사적 hash 기대값이다. 기존 테스트 삭제·skip·hash 재설정은 없다. 초기 신규 진단/실패 로그도 외부에 남겼고 최종 strict 진단 **0**, lint 오류/경고 **0/0**, Webpack build PASS를 확인했다.
- 기존 **17 Books / 102 Digests** 모두 일치. **32 SAFE_OFFLINE / 7 WITHHELD**, 저장·재열람 gate 보존.
- 공개 Runtime **46 roots / 700 modules**, digest 동일. NFT **88 route + 2 shared = 90**, 안정적인 Source·설치 의존성 집합 동일, 신규 오프라인 유입 0. generated chunk raw byte 동일을 주장하지 않는다.

실제 Fixture 이름·생년월일은 committed 보고서와 실행 출력에 포함하지 않는다. 근거 ID·Owner alias·계산 구간·원래 Source 정보만 보존한다. 실행 결과를 Base와 비교해 기존 계산 Unit·근거·Root·Source cohort가 그대로인지 확인한다.

## 작업 환경과 범위

기존 **70개 Worktree**, 원본 Checkout·dirty **11개**, Git common, 포렌식 **915개**를 byte/hash 및 기존 상태로 대조했다. 이번 Worktree 등록으로 **71개**가 된 것은 의도된 변경이다. 기존 tmp **61개**도 검사한다. 역사적 사고 영향 합집합 33개, ignored·미기록 자료 미확인, 삭제 주체 미확정은 계속 별도 위험으로 유지한다. 복구·정리하지 않는다.

신규 branch/worktree/index/ref/reflog, commit/object 및 upstream 설정은 의도된 Git metadata 변경이다. metadata 변경 0 또는 역사적 자료 무손실을 주장하지 않는다. commit/push 후 보존 및 정확한 SHA의 Preview 영수증은 외부에 기록한다.

기존 연구·계산·MBTI/Fusion·Book·결제/Auth/Worker/DB·UI·Runtime·master·Production 변경은 0이다. Preview READY는 기술적 빌드 검증이며 판매·고객 발행 승인이 아니다.

## 산출물과 다음 단계

- [실제 Candidate coverage](actual-specialist-claim-coverage.json)
- [원본 Native Receipt 검증](native-receipt-integrity.json)
- [의미·조건·Gate 보류](meaning-and-gate-withholds.json)
- [후속 Handoff](next-implementation-handoff.json)

검토용 Typed handoff는 준비됐다. 고객/Planner 사용은 차단돼 있다. 후속으로 원본 Source/Meaning Identity·원국/오행/실제 Context·상품·반례·중복·공식 승인 요건을 해결해야 한다. 이번 작업에서 그 조건을 만들거나 다음 구현을 시작하지 않는다.
