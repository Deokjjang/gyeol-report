# V4 Fusion 구현 설계 · 아직 실행하지 않는 계약

기준: `5f71a7d0ff8ac4481e09a3f90049448035eb2aed`. [제품 계약](V4_PRODUCT_SPEC.md)과 [현재 지원·누락 감사](ENGINE_AND_KNOWLEDGE_AUDIT.md)를 전제로 한다.
**Phase 0는 설계/감사까지만. 아래 신규 파일·규칙은 아직 runtime에 존재하지 않는다.**

## 1. 최소 구현 원칙

- 현재 계산 함수·역법·월운 절입·MBTI 원본·V3 저장본을 다시 만들지 않는다.
- 기존 raw calculation/canonical evidence를 읽는 **V4 전용 해석 허용 정책**과 작은 typed rule 목록을 추가한다.
- 개수·키워드 유사도·LLM 추측으로 새로운 격이나 신살을 계산하지 않는다.
- 명리 자체의 재미 있는 해석을 먼저 완결한다. Fusion이 매칭되지 않아도 고객 본문은 성립해야 한다.
- Fusion은 “명리 한 문장 + MBTI 한 문장”이 아니라 **한 장면에서 둘이 함께 만드는 행동/반전**이다.
- 사주 때문에 MBTI가 정해졌다고 쓰지 않는다. “명리에서도 이렇고 MBTI에서도 비슷하다”는 겹침의 재미는 적극 활용한다.

## 2. 입력과 출력 계약

기존 `interpretation-v3/types.ts:Evidence`의 subject/scope/period/sourceRefs/lineage를 재사용한다. 새 DB나 별도 영속화 계층은 만들지 않는다.

| 필드 / 구분 | V4에서 필요한 내용 | 금지 |
| --- | --- | --- |
| 명리 evidence | 실제 rule ID/version, 입력 anchor/target/위치, certainty, source/lineage | label만 보고 feature 생성 |
| capability | supported / partial / knowledge-only / unsupported / rule-conflict | `confirmed` 하나만으로 전통 강약·격을 승인 |
| method | calendar, lookup, weighted-count, heuristic-candidate 등 실제 산출 방식 | weighted-count를 classical-strength로 rename |
| support | 기존 visible/hidden-main/weight 등 substantial 근거, 지원 범위 | legacy excessive/missing 문자열을 그대로 신뢰 |
| MBTI trait | 실제 유형 + area + trait ID + sourceCoverage + 행동 의미 | 4글자 유형 chip만 사용, 모름을 default 유형으로 교체 |
| domain/context | 상품, 생활 영역, raw 직업과 normalized scene dimensions, 관계 상태/category | raw 직업 변경, fixture 이름 분기 |
| subject/toward | person 또는 A/B, A→B/B→A, 부모/상사 확정 역할 | 상대의 귀인/재성을 내 원국으로 사용 |
| scope/period | natal/major/annual/monthly/behavior; fortune은 정확 period/Jie segment | 다른 연월 또는 원국 신살을 현재 월운으로 전가 |
| Fusion rule | stable id/version, A/B/C, 명리 조건, 정확 trait ref, domain, scene 조건 | 자유 연상으로 조건을 생성 |
| 고객 결과 | 제목 + 가변 문단/한 줄/질문 + 선택적 짧은 tip | 모두 같은 양식, 모든 block advice 필수 |
| 내부 trace | 선택/보류 이유, evidence/trait/lineage refs, 실제 scene key | 고객 HTML/Flight에 내부 ID·개인화 ranking 노출 |

명리 evidence + MBTI trait + domain + customer interpretation이 없는 항목은 Fusion 집계에서 제외한다. “MBTI를 사용한 단독 묘사”와 “Fusion”의 QA 지표를 분리한다.

## 3. 세 종류의 Fusion

아래 문장은 **제안 카피 예시**이며 특정 고객에게 실제 해당한다는 결과가 아니다. 각 조건을 통과해야 선택한다.

| 종류 | 반드시 필요한 근거 | 고객 경험 | 조건 충족 시 제안 예시 |
| --- | --- | --- | --- |
| **A 겹치는 결** | 같은 행동 의미를 지지하는 실제 명리 + 실제 trait. 강한 핵심 결은 substantial 명리 | “두 쪽에서 같은 내 모습을 보는구나” | 현침 + ISTJ `thinkingStyle.efficient_error_detection` / 일: “다들 괜찮다며 넘긴 자료에서 혼자 숫자 하나가 걸립니다. 예민해서가 아니라, 어긋난 순서가 그냥 안 넘어가는 쪽입니다.” |
| **B 다른 결** | 반대/다른 속도·표현이 있는 명리와 trait, 차이가 드러나는 상황 | 겉/속·혼자/모임·처음/친밀·일/사랑의 반전 | 홍염 + INTJ `love.slow_high_standard_love` / 사랑: “대화는 꽤 다정했는데, 관계의 문은 아직 천천히 여는 중입니다. 상대는 벌써 가까워졌다고 느끼고, 본인은 이제부터 알아보는 단계일 수 있습니다.” |
| **C 보완하는 결** | **확인된 명리의 약한/비어 있는 발현 근거** + 그것을 메우는 MBTI의 실제 행동 trait | 약한 부분과 다른 행동 자원이 함께 있음 | 확정 4주·지장간 가중에서 식상 신호가 없고 ENFJ `communication.eloquent_social_speech` / 소통: “속마음을 바로 작품이나 말로 쏟는 쪽의 신호는 약해도, 사람 앞에서 생각을 풀어내는 통로는 따로 있습니다. 누가 막막해하면 어느새 그 마음을 대신 말로 정리해주고 있는 식입니다.” |

C의 “약함”은 판정 가능한 **해당 분포/표현 범위**에만 한정한다. “식상이 없으므로 원래 말을 못한다”, “MBTI가 식상을 만들어 신강이 됐다”는 금지한다. 유형 DB의 행동은 개인의 실제 생활을 측정한 증명은 아니므로 확정된 관찰 기록처럼 쓰지 않는다.

### 3.1 A/B/C의 구체적 gate

| 상황 | 처리 |
| --- | --- |
| 강한 동일 의미가 실제로 겹침 | A 핵심 결 후보. MBTI trait 여러 개를 독립 통계 증거로 합산하지 않음 |
| 다른 의미지만 같은 상황에서 설명 가능 | B. “모순된 사람” 낙인 대신 조건별 다른 반응 |
| 명리 신호가 unknown/시주 미확정 때문에 보이지 않음 | C 거절. **unknown ≠ absent** |
| 0.3 hidden-stem weight가 legacy adapter에서 excessive 또는 missing | raw weight/위치로 재평가. 문자열로 A/C 생성 금지 |
| 신강·신약/재다신약 heuristic만 있음 | 고전 구조 기반 A/B/C 거절. 확인된 개별 십성 묘사는 별도 가능 |
| MBTI trait가 growth recommendation뿐 | 이미 가진 보완 습관인 C로 사용 금지. 선택적 tip 재료로만 사용 |
| 동일 subject가 아니거나 period가 다름 | 거절. 단 승인된 궁합 cross-rule만 별도 허용 |
| 망신 native rule 충돌 | conflict로 보류. 좋은 의미든 나쁜 의미든 임의 선택 금지 |
| MBTI 모름 / trait refs 미존재 | Fusion 생성 안 함. 명리만으로 완결 |
| A/B/C 중 하나 이상 없음 | 다른 종류로 강제 채우지 않음 |

기존 bridge의 agreement/amplification은 A 후보, tension/context-switch는 B 후보로 **의미 검토 후** 재사용한다. expression은 단독 행동 발현일 수 있어 자동 A가 아니다. 기존 compensation의 상당수는 “명리 장점으로 MBTI 약점을 보완”하므로 사용자 정의 C와 반대 방향이다. `entj-water-pause`처럼 성장 권고를 이미 갖춘 능력으로 읽는 변환도 금지한다.

## 4. 같은 명리, 다른 MBTI·domain

아래는 재료 설계 기준이다. 실제 selected evidence를 벗어나 새 사실을 추가하지 않는다.

| 명리 | MBTI trait 재료 | domain | 합성된 현실 모습 |
| --- | --- | --- | --- |
| 현침 | ENTJ `thinkingStyle.fast_decisive_filter` | 일 | 잘못된 부분을 발견할 때 수정안과 결정 순서까지 떠오름 |
| 현침 | INFP `thinkingStyle.contextual_truth_detection` | 관계 | 평소 부드럽다가 말의 진심과 가치가 어긋나는 순간 날카로워짐 |
| 현침 | ESTP `thinkingStyle.se_now_data` | 일 | 설명보다 상대의 멈춘 손·표정에서 막히는 지점을 빨리 포착 |
| 화개 | ENTJ `identity.public_presence_private_distance` | 정체성 | 밖에서는 결론을 끌어도 중요한 생각은 혼자 정리할 시간이 필요 |
| 식신 | INFP `study.storytelling_learning` | 공부 | 개념을 자기 경험과 비유로 풀 때 이해가 살아남 |
| 정관 | ISTJ `love.trust_first_love` | 사랑 | 큰 고백보다 기억하고 지키는 약속이 마음 표현 |
| 정관 | ENTP `thinkingStyle.possibility_scanning` | 일 | 책임은 알면서도 방법은 바꾸고 싶은 긴장 |

현침 하나를 6번 그대로 해설하지 않는다. 같은 뿌리를 다시 쓰면 관찰 대상·감정·시점·결과가 달라야 한다. 제목/본문 의미가 반복되면 다른 feature를 우선한다. 양인의 결단/경계를 현침의 예리한 관찰로 바꾸는 의미 혼용도 검수한다.

## 5. 좋은 복·성공 합성

### 5.1 선택 규칙

1. 합성은 **두 개 이상의 실제 근거**가 있어야 한다. 없는 표식, partial classical 구조는 제외.
2. 원자 하나는 중복 alias/native code로 여러 표가 될 수 있다. 같은 원본 사실의 lineage는 한 번만 센다.
3. hero 수준은 각 주요 anchor가 substantial이고 서로 다른 의미를 보탤 때만. 단순 표식 개수 순위를 만들지 않는다.
4. 동일 subject·domain·period 계약을 지킨다. natal 강점 + 시점 변화는 구분해 함께 설명할 수 있으나 natal을 신규 운으로 rename하지 않는다.
5. 같은 사실에서 파생된 결과는 독립 corroboration으로 승격하지 않는다. MBTI trait 여러 개도 같은 자기보고 출처다.
6. 좋은 결론을 먼저 편집하되 “부자가 된다/승진한다/결혼한다”는 확정 사건으로 만들지 않는다.
7. 좋은 합성이 없더라도 확인된 단일 좋은 패는 직접 말한다. 과도한 거절 문구를 고객에게 보여줄 필요는 없다.

### 5.2 후보 규칙 목록

| 실제 조건(모두 충족) | 고객용 합성 후보 | 반례 / 제한 |
| --- | --- | --- |
| substantial 재성 + 편관 + 장성 + 반안, 독립 anchor 확인 | “돈과 이름을 같이 노려볼 만한 힘” / 결과·책임·자리·명예의 동시 장점 | 재성 미약, 장성/반안 없거나 alias중복이면 이 문장 금지. **격국명 아님** |
| 장성 + 반안 | “앞에 서는 힘에, 자리를 넓히는 운까지” / 장수가 말에 올라 깃발을 드는 이미지 | 두 marker가 실제로 있는 경우만. 승진/선거 당선 확정 아님 |
| 재고 + substantial 정재 또는 축적에 맞는 식상 | “해낸 일이 내 자산으로 남는 좋은 패” | 재고만으로 대부호 예언 금지. 기술·작품·고객·경험도 적합한 축적의 모습 |
| 천을 + 실제 관계/협업을 지지하는 별도 근거 | “혼자 잘하는 힘에 사람복이 더해집니다” | 같은 천을의 native/derived를 두 근거로 세지 않음 |
| 도화 + 홍염 | “첫눈에 남는 매력과 가까워질수록 커지는 매력” | 둘을 같은 뜻으로 합치지 않음. 어느 하나 없으면 해당 절반 제거 |
| substantial 식상 + 문창/학당 | “잘 이해하는 데서 끝나지 않고 내 방식으로 보여주는 힘” | 문곡 DB만 있는 사실로 대체 금지. 입시/자격 합격 보장 아님 |
| 실제 A/B 합·반합 + 그 관계를 설명하는 각자의 행동 trait | “함께 있을 때 더 잘 살아나는 두 사람의 방식” | 각자 natal의 합을 둘 사이 합으로 사용 금지. 점수/등급/임의 ranking 없음 |
| 현재 period의 확인된 십성/관계 + domain에 맞는 강점 | Major/Annual의 재물운·명예운·자리운·학습운·이동운을 직접 표현 | 원국 귀인만으로 “올해 들어온 귀인운”, 원국 재고만으로 “이번 달 재물 급증” 금지 |

**조건 충족 = 예시 문장 그대로 발행**은 아니다. raw 직업·관계·나이·시간 구간에 맞는 장면으로 작성하고 반대 맥락/과사용을 짧게 붙일 수 있다.

### 5.3 상품 적용

| 상품 | 합성의 주된 쓰임 | MBTI 쓰임 / 편집 무게 |
| --- | --- | --- |
| 종합 | 나의 좋은 패 전체, 성격/반전/돈/관계의 3–5축 | 여러 domain의 서로 다른 trait, 55:45 |
| Career | 돈·성취·명예·자리·전문성, 다음 역할 | 직장인/사업/프리랜서/학생/취준 행동 차이, 55:45 |
| Love | 첫 매력·친밀 매력·좋은 인연을 만드는 힘 | 끌림/표현/싸움/함께 생활/부모의 다른 행동, 55:45 |
| Compatibility | 둘이 살리는 힘·편안함·다름의 조화 | category와 방향별 행동 반응, 50:50 |
| Major | 현재 대운과 해당 연도에 커지는 좋은 흐름 | 같은 기회/책임을 경험하는 방식, 75:25 |
| Annual | 한 해·월별 실제 운의 주인공 | 해당 달 장면의 체감, 75:25 |

위 비율은 narrative 무게중심이지 고객 점수나 기계적 문장 quota가 아니다.

## 6. 본문 material과 composition

| 재사용 / 필요한 보강 | 구현 계약 |
| --- | --- |
| V3 portraits/scenes | feature·domain·context·주어·의미를 묶어 가져옴. 문장만 추출해 모든 사람에게 배포하지 않음 |
| 원자 material | personality / strengths / short weakness / moneySuccess / career / study / love / marriage / relationships / compatibility / timedFortune 지원 여부를 **명시**. 빈 domain은 범용 조언으로 채우지 않음 |
| 이미지 | 장성·반안·현침·도화·홍염·재고 등 실제 소재를 생활어로 연결. 매 장마다 사전 정의를 반복하지 않음 |
| MBTI material | 직접 traits와 inferred를 구분. close/far keyword·reportUseCases·bridge hint는 routing 재료, 계산 근거 아님 |
| 편집 리듬 | 강한 캐릭터 → 짧은 팩폭 → 좋은 패 → 타인 시점 → 반전 등 가변 배치. block 길이/조언 유무를 통일하지 않음 |
| 반복 억제 | 기존 repetitionGuard + feature/trait/scene/semantic 결론 이력을 사용. 동의어 바꾸기만으로 통과하지 않음 |
| 마지막 | 사람의 핵심 3–5축을 다시 결합. 선택된 한 feature의 정의로 마무리하지 않음. generic 자기답게/소통하세요 금지 |
| 고객 근거 | 본문은 필요한 compact chips만. 전체 설명은 하단 단일 접기. 내부 provenance는 보존 |
| 안전 | exact 사건/결혼시점/수익보장/질병·죽음 확정만 엄격 차단. 긍정 표현을 습관적으로 약화시키지 않음 |

V3 내용의 version/replay를 보존하기 위해 새로운 V4 prose는 V4 경로에서만 사용한다. 기존 6상품 composer를 먼저 공통화하는 대규모 refactor는 하지 않는다.

## 7. Phase 1의 실제 파일·모듈 범위

**다음 승인 시 착수할 범위**다. 이번 commit에는 아래 runtime 파일을 만들지 않는다.

| 파일(신규 예정) | 책임 | 읽기 전용으로 재사용할 현재 모듈 |
| --- | --- | --- |
| `src/lib/interpretation-v4/types.ts` | capability/method/accepted trace, Fusion A/B/C, material domain 계약 | I/`types.ts`의 product/subject/scope 계약 |
| `src/lib/interpretation-v4/evidencePolicy.ts` | raw facts + canonical references의 V4 허용/보류 projection. fractional/unknown/heuristic/conflict/period gate | S/`calculateSaju.ts`, K/`natalTableEvidence.ts`, I/`comprehensiveStoryEvidence.ts`, 기존 시간 packet |
| `src/lib/interpretation-v4/materialRegistry.ts` | 지원된 feature의 domain별 reviewed 카피·이미지. 기존 V3 좋은 재료 보존 | taxonomy/daypillar/atomic + 각 상품 portraits/scenes |
| `src/lib/interpretation-v4/fusionRules.ts` | 실제 trait refs로 작성한 A/B/C 및 positive synthesis 조건·장면 | K/`mbti/sourceRuntimeAdapter.ts`, `bridge/interactionSceneRules.ts` 중 조건 적합한 부분 |
| `src/lib/interpretation-v4/fusion.ts` | 조건 매칭·독립 lineage·scope·반례 검사·결정적 후보 출력 | 기존 factConditions/engine의 순수 helper, 필요한 경우 local V4 함수로 한정 |
| `tests/unit/interpretation-v4/{evidencePolicy,fusion,positiveSynthesis,materialRegistry}.test.ts` | 아래 matrix의 자동 회귀 | 현재 audit JSON/fixtures, 기존 Saju/V3 tests |

Phase 1은 **offline core + 검증**이다. route/publish/snapshot/UI를 연결하지 않는다. V3 내부 non-exported helper를 쓰려고 기존 계산/저장 동작을 refactor하지 않는다. 피할 수 없는 기존 파일 수정이 필요하면 정확한 범위를 먼저 제시한다.

Phase 1의 material 우선순위:

- 십성 10종의 서로 다른 인물/일/돈/관계 발현.
- 현침·도화·홍염·역마·화개·장성·반안·천을·천덕/월덕·재고·양인·귀문 등 **계산 가능한 표식**의 영역별 모습.
- 60일주 기존 이미지/character를 보존하고 legacy alias를 canonical ID로 연결. 이름만 남은 domain은 그대로 빈칸 표시 후 실제 카피 보강.
- MBTI 16유형 전체의 A/B/C 후보 coverage를 테스트하되, 맞지 않는 조합을 억지로 채우지 않음. INTP 한 rule, ISTJ/ISTP의 얇은 관계 재료부터 보강.
- 완성된 classic strength/격국, 방합, 문곡/복성/천의성, 신규 transit 신살은 **별도 canonical 규칙 검토 전 미지원**. 이 계산 확장을 Phase 1에 몰래 넣지 않음.

## 8. 이후 연결 순서 · 자동 진행 금지

| 단계 | 범위 | 다음 단계 조건 |
| --- | --- | --- |
| Phase 0 이번 | 세 문서 + machine audit + tests | 감사/위험/구현 순서 사용자 검토 |
| Phase 1 | 위 V4 core offline 모듈, 지원된 material/Fusion, 실제 고객문장 fixture export | 근거 정확성·counterfactual·재미 수동 검수 |
| Phase 2 | 종합 V4 generation/composer/view만 명시적 버전으로 연결, 새 UI 순서 | generate→publish→local persistence→SSR/hydration→full share, legacy hash 유지 |
| 후속 개별 승인 | Career → Love → Compatibility → Major → Annual | 각 상품의 역할/상태/시간/개인화·좋은 복 실제 텍스트 검수 |
| 통합 승인 | 6상품 delivery completeness·공통 UI·상태 replay | 전체 tests/lint/build/390·768·1440, Production 별도 승인 |

연결 시 실제 기존 변경 후보는 G/`productGenerationDispatcher.ts` 및 해당 상품 handler, 해당 report view의 **V4 명시적 분기**뿐이다. 공통 계산 엔진/구매권한/Meta/DB는 제외한다. 구체적 신규 V4 generation/view 파일명은 해당 상품 Phase에서 범위 확정하며 지금 존재한다고 주장하지 않는다.

## 9. QA matrix · 테스트와 실제 읽기 모두

| 구분 | 검증 | 실패 기준 |
| --- | --- | --- |
| 데이터 | 모든 rule의 feature/trait ID가 존재, sourceCoverage 유지 | dangling ref, DB-only feature를 calculated로 표기 |
| capability | 개수 heuristic/미지원 구조/망신 충돌 거절 | confirmed만 보고 hero 승인 |
| fractional | 0 / 0.3 / 0.6 / 1 / 1.3 / 2 등의 raw 가중, 표면/지장간 구분 | 약한 소수값이 excessive/missing으로 뒤바뀜 |
| C 보완 | 확정된 약한 분포+행동 trait vs unknown/성장 권고 | 출생시간 모름을 결핍, 조언을 이미 가진 습관으로 사용 |
| same chart | 16 MBTI + 모름 비교, 계산 fact hash 동일 | MBTI만 바꿨는데 사주/시점 evidence 변화 |
| same MBTI | 여러 일간/일주/강한 feature/좋은 패 비교 | 같은 headline/scene/final을 이름만 바꿔 재사용 |
| positive | 네 anchor/일부 제거/weak/alias중복 반례 | 조건 없는 재물복·자리운 합성, 보장 사건 |
| 직업 | employee/business/freelancer/student/jobseeker + raw job 다양한 fixtures | 같은 template의 직업명 교체, 내부 taxonomy 노출 |
| Love | 같은 사주에서 6상태, 도화only/홍염only/both/neither | 없는 매력 invent, 현재 연인을 솔로로 취급 |
| 궁합 | 7category, A/B swap, A부모/B자녀·A상사/B팀원 고정 | crossfact의 주어 전도, 동일 category 서문/결론, 점수/등급 |
| 시간 | Major 14년/전환 + Annual 12개월/Jie boundary + 과거/현재/미래 | 월운에 원국 신살 복제, 다른 period 유입, 계산 변경 |
| 레거시 | V2/V3 snapshot/version replay, 기존 related regressions | V4 추가로 이전 고객 본문 재작성 |
| 편집 | 첫 1분 캐릭터·좋은 복·팩폭·반전·MBTI 행동 차이를 실제 텍스트로 읽음 | count만 충족, 사전/조언 위주, 의미 반복, 기술 prose |
| UI(연결 Phase) | 목차0, 두 표 접기, 하단 단일 기운 접기, 공유1, paid footer0 | 내부 ID 노출·누락·overflow/hydration 오류 |

현재처럼 JSON validity·unit PASS만으로 “V4가 판매 가능”이라 결론내리지 않는다. 최종 품질은 서로 다른 사람의 전체 고객 본문과 화면을 읽어 확인한다. 이번 Phase 완료 후 STOP.
