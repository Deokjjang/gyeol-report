# V4 Annual April Relation Evidence 01

기준 SHA `6a7d52cf34d20636e56fc1877452331c5ca7df85`, 브랜치 `v4/annual-april-relation-evidence-01`.

## 결과와 승인 경계

4월 원본 질문을 기존 실제 Relation Graph의 계산 발생·참가자·원국 위치·기간·Root에 연결했다. 월 기술 계약 **6/12 → 7/12**, Annual 내부 후보 **29 → 31**, 신규 4월 월 후보 **2개**다. 구간별 Typed Binding **7개**와 월 후보 수는 다르다. 모든 원본 구간과 필수 관계가 검증된 월에만 후보를 생성한다. 일부 구간이 통과한 F/Ranged의 월 전체는 보류한다.

관계 Witness 38개 = VERIFIED 34 / WITHHELD 4. 기존 Typed Unit 422개와 별도 집계한다. 새 합·충·형·삼합 계산, 새 Fact Root, 독립 사실, 고객 Claim/Approval/Reader Bridge, Planner 배정은 모두 0이다. Source와 계산 발생 확인은 명리 의미·생활 효과·상품 품질·고객 사용 승인이 아니다.

## 정확한 원본 Source

- 파일 `src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts`
- Export `ANNUAL_MONTH_MATRIX`, ID `afpr:month-slot:04`, index 3
- 파일 SHA256 `261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3`
- Record SHA256 `47cbf493b7d9db5598a9204b131c34f6cb74755a10cafa75c7c016bb5b54cdf4`
- Source version `6d471db103d53dd9165e4832744501a686e59edc`
- 원본 요구: `selectedYear + actual civil month bounds`, `every canonical segment`, `actual affectedPillars + participant identity + root ancestry`

Source를 매 평가마다 재검증한다. Meaning/Claim Identity null, Meaning REVIEW_REQUIRED, Product UNKNOWN, Customer PENDING을 유지한다. 원본 703 Receipt의 Source Integrity FAIL 30개도 유지한다. 빈 원본 Source References 배열은 그대로 보존하며 외부 출처나 해석 승인을 만들어 채우지 않는다. 계산의 출처는 원본 Producer의 파일·symbol·version 및 실제 입력으로 재생성·인증한 Graph에서 확인한다.

## 구현과 실제 통합

신규 기능 소스는 `annual-april-relation/contract.ts`, `adapter.ts` 두 개다. 기존 03/05/07/09/10/12월 Adapter 체인을 통해 실제 V4 Producer, Graph와 Native Receipt를 인증한다. 기존 `validateAnnualRelation`, `validateAnnualNodeIdentity`, `AnnualSpecialistIndex`, `AnnualSegmentContract`, `ActualBindingIndex`, `bindKnowledgeCandidate`를 재사용한다. 기존 Producer, Binder, 12 Hard Gates와 연구 DB는 수정하지 않았다.

`actual-annual-relation-occurrence-v1`은 기존 Relation Evidence ID와 Graph Node ID를 검증하는 기술 Witness다. 원본 Type/Source/Affected Pillars/Participant/Owner/Direction/Producer/Window/Certainty/Root/Ancestry/Blocking Reasons를 보존한다. Natal 위치는 원본 affectedPillars만 확인하고, 실제 월지·실효 연지·활성 대운 index/ganji·원국 오행 분포의 원본 Parent Node를 정확히 대조한다. 명목 연주를 실효 연주로 사용하지 않는다.

기존 ID 없는 Parent 관측에는 `PRODUCER_OBSERVATION_ONLY`와 `PARTIAL` 상태가 존재한다. 기존 Binder는 정확한 pointer·Producer·완전한 ancestry로 이를 검증한다. 신규 검사의 첫 실행은 Parent를 모두 VERIFIED로 요구해 정상 관계도 보류했다. 신규 predicate만 기존 Binder 계약에 맞췄고, 원본 PARTIAL을 VERIFIED로 바꾸지 않았다. WITHHELD Parent, 다른 blocker, 불완전 ancestry, Source 미검증은 계속 차단한다. 최종 신규 파일 전체를 재실행했으며 테스트를 삭제하거나 skip하지 않았다.

각 구간의 **모든** 원본 관계 Witness가 검증돼야 그 구간을 바인딩한다. Boundary·월주·실효 연주와 모든 원본 관계 node를 정확한 한 구간 window로 선택한다. 각 Relation selector는 원본 Evidence ID·pointer·Producer·type·전체 Participant identity와 값을 사용한다. 다른 구간 관계를 빌려 오거나 서로 다른 기간을 한 Receipt에 넣지 않는다. 일부 관계를 삭제해 전체 월 통과로 만들지 않는다. 관계가 없으면 `NO_ORIGINAL_RELATION_OCCURRENCE`로 보류하며 새 관계를 생성하지 않는다.

원본 Receipt는 수정하지 않고 별도 버전의 Typed Receipt를 발급한다. 5개 기술 Gate만 실제 선택에 따라 PASS가 되고, 기존 Source/Meaning/Approval 등 나머지 Gate의 상태·이유, Source Group, 반례, 금지, required context, 상품 적용 범위는 보존한다. 고객 사용과 Planner 사용은 false다.

## 실제 4월 전체 구간

기존 4개 Annual 가상 Fixture의 실제 Producer를 재실행했다. 구간 수를 생성기에 강제하지 않았다. 기존 3개 Major 입력도 동일한 체인으로 실행해 보존을 확인했다.

| Fixture | 실제 구간 | 관계 관측 | 검증 / 보류 Witness | 구간 Binding | 월 후보 |
|---|---:|---:|---:|---:|---|
| fixture-annual-A | 2 | 7 | 7 / 0 | 2 | 생성 |
| fixture-annual-F | 2 | 7 | 5 / 2 | 1 | 보류 |
| fixture-annual-C2028 | 3 | 16 | 16 / 0 | 3 | 생성 |
| fixture-annual-ranged-transition | 3 | 8 | 6 / 2 | 1 | 보류 |

| 원본 Relation Source | 관측 | 검증 | 보류 |
|---|---:|---:|---:|
| month_natal_branch | 23 | 23 | 0 |
| month_annual_branch | 5 | 5 | 0 |
| month_dayun_branch | 2 | 1 | 1 |
| month_natal_element | 8 | 5 | 3 |

시간 미상 오행 관계는 전체 원국의 부재·과다로 확정하지 않는다. Ranged의 원래 조건부 대운 관계는 조건부 certainty와 전환 범위를 보존하고 WITHHELD로 유지한다. 독립적으로 검증된 다른 관계는 원래 상태를 유지하지만, 필수 관계가 보류된 구간이나 월을 통과시키지 않는다. C2028의 원래 대운 전환 구간 분리와 정확한 시각도 그대로 보존한다.

## 참가자·위치·중복의 실제 사례

- `month-v2:2028:4:2:month:2028:4:branch:반합:辰申` / `반합`: month/transit_branch=辰, day/natal_branch=申, hour/natal_branch=辰. 원본 Root `aeg:root:157092a7e5ebbea50c03478458b8130a07d1da89f737bf9bb87cc231ce5169c2` 유지.
- `month-v2:2028:4:3:month:2028:4:branch:반합:辰申` / `반합`: month/transit_branch=辰, day/natal_branch=申, hour/natal_branch=辰. 원본 Root `aeg:root:9e0d0838ed4fff34f97270c3d61cf0a396c2b44f46321da806827b0ed121d64b` 유지.

위치별 참가자 행 수와 서로 다른 지지 종류의 수를 구별한다. 같은 값이 반복돼도 원본 위치·slot과 Parent Node는 합치거나 생략하지 않는다. 세 행이 있다는 이유로 삼합을 만들지 않는다. 원본이 삼합인 경우에만 원본 3개 서로 다른 지지와 각 실제 참가자·Source를 검증한다. 합화·격국 변화·강약 변화·용신 변경·사건 발생·영향 크기는 발급하지 않는다.

기존 Relation occurrence Root 38개, relation 전체 ancestry Root 83개, Root reference occurrence 167회를 별도로 기록한다. 이 숫자를 새 독립 사실 수로 사용하지 않는다. 기존 Typed Root pool 246개와 reference 855회는 불변이다. 월 후보가 추가 참조하는 31개도 원래 Graph에 있던 Root이며 신규 Root가 아니다.

## 검증과 보존

- 신규 34 PASS / 0 FAIL / 0 pending. 필수 26개 변조, 실제 A/F, 정확한 Parent, 조건·Gate·Root 보존, 비중첩 Binder 실패, 결정론·고객 승인 차단 포함.
- 정확한 Base 실패 재현 149 PASS / 2 FAIL.
- 기존 관련 22개 파일 1382 PASS / 4 FAIL(최초 실행). 기준 두 실패의 이름과 정규화한 전체 오류 메시지가 동일하다. 추가된 5초 timeout 중 Actual Specialist는 같은 미수정 파일 전체 47 PASS / 0 FAIL로 해소했다. October Focus 사례는 정확한 Base와 작업 브랜치에서 동일한 5000ms timeout을 재현했고 정규화한 전체 오류 메시지가 같다. 다른 37개 October 사례는 최초 전체 실행에서 통과했으며 표적 재검증에서는 반복하지 않았다. 기존 테스트·timeout 설정은 수정하지 않았다. 미해결은 기존 hash 실패 2개와 추가 확인한 Base timeout 1개, 총 3개이며 신규 기능 회귀로 분류하지 않는다. 전체 저장소 suite는 실행하지 않았다.
- 기존 두 실패는 compatibilityProductAdapter.ts의 과거 hash를 기대하는 Major/Annual 보존 테스트다. 정확한 Base부터 존재하며 기존 소스·manifest·테스트를 수정하지 않았다.
- 422 Verified Typed Unit, 164 Withheld attempt, 703 Native Receipt, 기존 후보 31개(Annual 29 / Major 2)의 ID·전체 hash, Typed Root 246, unmatched 396 및 계산/Graph/native 진단 digest 동일.
- 17 Book / 102 digest 및 저장본 재열람 동일. Publication 39사례 = 32 SAFE_OFFLINE / 7 WITHHELD 유지.
- TypeScript strict 진단 0, 전체 lint와 변경 후 lint PASS. 최종 build/NFT는 아래 최종 검증 절 참조.
- Runtime AST 46 root / 700 module, digest `9515564668afceeca302fc7073ae0f54352672e59eef9e76c73357c9981da736` 동일. 고객 Runtime에 새 모듈 없음.
- 입력 이름·생일 export scan PASS. Synthetic 의미 파일 sync read guard 0. 실제 고객 데이터나 새 연구 의미로 승격하지 않음.

## 작업 환경과 후속 경계

지속 worktree `/Users/Deokmin/Developer/gyeol-worktrees/v4-annual-april-relation-evidence-01`, Git common `/Users/Deokmin/Dev/projects/gyeol-report/.git`. 기존 75개 worktree(지속 14 / 임시 61), 원본 dirty 11개, 포렌식 915파일의 기록된 파일·hash·상태·metadata 보존을 대조했다. 기존 임시 경로는 복구·정리·삭제하지 않았다. 과거 ignored·미기록 자료의 무손실은 UNVERIFIED다. 새 branch/worktree·object/ref/reflog/index/upstream 등록은 의도된 Git metadata 변경이다.

미완료 월 01/02/06/08/11, 실제 미상·조건부 관계, 원본 Source FAIL 30, 월별 십성 ROLE_AMBIGUOUS 10, 의미·상품·고객 승인 및 기존 hash 테스트 실패 두 개와 정확한 Base에서도 재현한 October 5초 timeout 한 개는 남는다. 후속 작업은 새 사용자 지시가 필요하며 시작하지 않았다. 기존 원고·계산·MBTI·Fusion·Planner·Writer·Book/Reader·DB·결제·Auth·Worker·환경변수·master·Production은 변경하지 않았다.

외부 전체 로그/JSON: `/Users/Deokmin/Documents/gyeol-validation/v4-annual-april-relation-evidence-01`. 원본 대형 Receipt를 중복 복사하지 않고 ID·전체 hash·Gate·구간 Binding·Source·Witness·Parent 근거를 기록했다. 최종 Git SHA 및 Preview는 외부 `git-preview-receipt.json`, `FINAL-RESULT.json`에 기록한다. Preview READY는 기술 빌드 확인이며 고객 발행·판매 품질 승인이 아니다.

## 최종 빌드·패키징 확인

보고서 파일을 포함한 Webpack Production build PASS, 경고 0. NFT 90개(앱 route 88개 및 공통 2개)의 기존 소스 의존 집합이 Base와 동일하다. 빌드마다 달라지는 `.next` 내부 산출물은 제외하고 실제 소스·외부 의존 경로를 비교했다. 신규 4월 모듈·검증 CLI·보고서는 고객 Runtime/NFT에 포함되지 않았다. 기존 6,447개 파일 SHA256 일치, 누락 0. strict TypeScript 0 diagnostics, 전체 ESLint --max-warnings=0 PASS. 최종 commit 범위는 별도 검토한다.
