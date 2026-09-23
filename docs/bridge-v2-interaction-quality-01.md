# Bridge v2 interaction quality

2026-09-23 · 기준 HEAD `993c3e0` · 로컬 deterministic/mock 검증.

## 구현과 근거

기존 세 계층(Fusion, 종합 scene scorer, 상품 공통 Bridge)을 유지했다. 새 장면 규칙 31개는 별도 사실 계산기가 아니라 기존 canonical fact ID와 실제 MBTI source trait ID를 연결하는 검토된 해석 자산이다. 기존 scene 6개도 유지한다. MBTI DB나 달력·대운·월운 계산은 변경하지 않았다.

`canonical facts → 명시적 AND/OR/negative predicate → 실제 type/trait 조회 → interaction → 장면/강점/피로/행동 기준` 순서다. 새 해석의 confidence는 모두 inferred/low이며 경험적으로 측정한 성격 강도가 아니다. 신호 수로 강도를 올리지 않는다. DB의 기능/사고 방식 설명은 실제 thinkingStyle trait로 참조하고, 유형 글자만으로 행동을 추정하지 않는다.

각 장면은 `interactionId`, `ruleId`, `myeongliEvidenceIds`, `mbtiEvidenceIds`, `contexts`, `factScope`, `meaning`, `scene`, `strength`, `risk`, `practice`를 가진다. 공통 packet은 source trait 본문도 근거로 보존한다. Writer와 fallback은 같은 선택 결과를 사용한다.

## 여섯 interaction

| 종류 | 신규 규칙 | 기존 scene 포함 규칙 | 51조합에서 실제 선택 횟수 |
|---|---:|---:|---:|
| agreement | 5 | 8 | 14 |
| tension | 6 | 6 | 11 |
| expression | 3 | 4 | 7 |
| compensation | 7 | 7 | 12 |
| amplification | 7 | 9 | 12 |
| context-switch | 3 | 3 | 7 |

기존 78개 Fusion 자산을 이 표에 합산하지 않았다. 같은 규칙이 고객별로 여러 번 선택될 수 있으므로 규칙 수와 선택 횟수는 다르다.

- Tension: 역마 + ISTJ `thinkingStyle/past_data_decision`은 이동/변화와 검증된 경험의 긴장이다. 되돌릴 수 있는 시험 범위를 제안하는 장면으로 연결한다. 다른 J 유형에 일괄 적용하지 않는다.
- Compensation: 정재 + ISFP `money/low_income_risk_due_to_softness`는 가격을 강하게 주장하라는 요구 대신 작업 시간·수정 범위를 보상 기준으로 쓰는 장면이다.
- Context switch: 정관 + ENTJ의 실제 career/love 두 trait를 함께 요구한다. 직장 일정의 명료함과 사적인 계획에서 상대 선택권을 묻는 차이를 설명한다.
- Amplification: 현침 + ESTJ `thinkingStyle/te_fact_execution`은 오류 지적의 정밀함과 전달 온도의 문제를 구분한다.
- Agreement: 식신 + INFP `study/storytelling_learning`은 자기 사례로 개념을 설명하는 학습을 다룬다.
- Expression: 천을귀인 + ESFJ `career/service_helping_fit`은 도움 통로와 구체적인 연결 행동을 다룬다. 도움이나 결과를 보장하지 않는다.

## 16유형 coverage

같은 세 원국에 MBTI만 바꾸어 평가했다. 아래 수는 그 세 원국 전체에서 선택된 **고유 scene ID** 수다. 유형별 수를 맞추기 위해 규칙을 추가하지 않았다.

| 유형 | Before | After |
|---|---:|---:|
| INTJ | 0 | 2 |
| INTP | 2 | 3 |
| ENTJ | 3 | 5 |
| ENTP | 0 | 2 |
| INFJ | 0 | 2 |
| INFP | 0 | 2 |
| ENFJ | 0 | 2 |
| ENFP | 0 | 2 |
| ISTJ | 0 | 1 |
| ISFJ | 0 | 2 |
| ESTJ | 0 | 1 |
| ESFJ | 0 | 2 |
| ISTP | 0 | 2 |
| ISFP | 0 | 2 |
| ESTP | 0 | 2 |
| ESFP | 0 | 1 |

16유형 × 3원국 = 48조합 중 42조합에 scene이 선택되고, 6조합에는 선택되지 않는다. MBTI 미입력 3조합은 유형별 scene 0이다. 전체 51조합에서 생성·publish·근거 ID·determinism 검사가 통과한다. No-match를 generic 장면으로 채우지 않았다.

## 명리 신호 범위와 제외 근거

| 범위 | 처리 |
|---|---|
| 오행 부족/과다 | 수 부족·토 과다와 실제 trait의 명시적 장면 추가. 반대/모순 상태를 차단. 다른 오행에 이를 복사하지 않음 |
| 재성/관성/식상/인성/비겁 | 정재·편재·정관·편관·식신·편인·정인·비견의 실제 존재에 연결. 기존 Fusion의 나머지 십성 규칙 보존 |
| 일간/일주 | 기존 정확한 Fusion predicate 및 정축/INTP scene 보존 |
| 구조 후보 | 기존 무인성/INTP scene 보존. 구조 없는 고객에게 보완/피로를 추정하지 않음 |
| 현침·도화·홍염·역마 | 실제 feature와 개별 trait가 함께 있어야 장면 선택 |
| 문창·천을귀인 | 실제 귀인 fact와 학습/돌봄 trait 연결. 능력·도움 결과 확정 금지 |
| 배우자궁 | 기존 love evidence의 일지 사실은 유지. 현재 설명은 일반적인 관계 관찰 범위이며, 특정 MBTI 행동과 연결하는 차별적 predicate 근거가 없어 신규 scene 조건으로 승격하지 않음 |
| 합충형파해 | 기존 13개 generic hint 제외 유지. 현재 label/범용 조율 문구만으로 특정 위치·관계 종류·행동의 연결을 증명하지 못하므로 단어 포함 검사로 활성화하지 않음 |

마지막 두 항목은 구현 완료를 주장하지 않는 명시적인 coverage gap이다. 검증된 원국/운 관계 계산 자체는 그대로 존재하며 이 작업에서 수정하지 않았다.

## 상품 routing / fallback

- 종합: identity를 우선하고, 장면을 관련 longform 한 곳에 전달한다. 연결 장면이 있을 때 결합 장의 기존 일반론을 실제 장면으로 바꾼다. 나머지 전체 본문은 재작성하지 않는다.
- 직업: career/money/study를 기존 `combinedReading`에 연결한다.
- 연애: love/marriage/family/conflict를 기존 관계 해석에 연결한다.
- 궁합: 개인별 stable person ID 아래 scene을 보존하고 방향 evidence가 해당 person/scene 및 기존 pair evidence를 참조한다. A/B swap에도 사람을 따라간다. 연애/결혼 장면은 업무·친구·부모자녀 관계에 넘기지 않는다. 명시되지 않은 부모/상사 역할은 추정하지 않는다.
- 대운/세운: 기존 운의 신호 입력을 재사용한다. `factScope=fortune-flow`와 안내 문장으로 원래 성격과 구분한다. fallback의 기존 `mbtiExpression`을 채우며 연도/타임라인은 바꾸지 않는다.

정상 writer도 기존 prompt의 evidence packet을 통해 같은 근거를 받는다. 새로운 계산 fact를 AI에게 위임하거나 prompt 문체를 대폭 변경하지 않았다. 현재 장면은 관찰/활용 가설이며 실제 경험보다 우선하는 진단이 아니다.

## 중복 처리

기존 fact-pair/type/context key를 유지한다. 장면이 **같은 명리 fact, 같은 실제 MBTI trait, 같은 interaction 종류, 호환되는 맥락**을 모두 포함할 때에만 기존 hint/Fusion 표현을 덜어낸다. 다른 긴장/강점 관점은 보존한다. 계층별 context 명칭은 명시적 표로 대응시킨다.

표본의 동일 interaction ID 중복은 Before/After 모두 0이다. 이미 foundation에서 제거된 중복을 이번 성과로 다시 계산하지 않았다. 새 장면이 추가되면서 생길 수 있는 중복은 회귀 테스트로 차단한다. 서로 다른 trait ID를 가진 문장의 의미까지 같다고 추정하는 NLP 중복 제거는 하지 않았다.

기존 ENTJ 현침 scene의 상투적인 질문 문장은 자료/다음 행동/설명 시간이라는 구체적인 기준으로 수정했다. 기존 품질 validator는 완화하지 않았다.

## Before / After 측정

고정 clock: `2026-09-23T03:00:00Z`. 테스트 입력:

- A: 1996-12-06 14:15 KST, 남성, ENTJ
- B: 1980-05-15 09:30 KST, 여성, ISFJ
- C: 2001-08-20 16:20 KST, 남성, ENFP

| 지표 | Before | After |
|---|---:|---:|
| 51조합의 고유 생활 장면 | 5 | 33 |
| 장면 선택 총횟수 | 6 | 63 |
| 표본에서 scene이 선택된 유형 | 2 | 16 |
| 동일 interaction ID 중복 | 0 | 0 |
| 세 golden draft가 공유하는 40자 이상 동일 문장 | 114 | 108 |

| 샘플 | draft 문자열 총 문자 수 | 고유 40자 이상 문장 | 직렬화 prompt 문자 수 |
|---|---:|---:|---:|
| A | 33,503 → 34,130 | 277 → 285 | 401,640 → 403,947 |
| B | 30,844 → 30,015 | 244 → 239 | 339,274 → 341,508 |
| C | 34,816 → 35,080 | 290 → 293 | 363,956 → 366,154 |

문자 수는 draft의 모든 문자열을 합친 측정이며 DOM 글자 수나 토큰/비용이 아니다. Prompt는 실제 writer message의 JSON 직렬화 길이다. B는 일반론을 한 개의 근거 있는 장면으로 교체하면서 약 2.7% 줄었다. 길이를 맞추는 filler를 추가하지 않았다. Prompt는 세 샘플 모두 늘었으며 압축 성과를 주장하지 않는다.

공통 장문 108개는 Bridge 밖의 기존 본문도 포함한다. 이번 작업으로 종합 전체 반복 문제가 해결됐다고 판단하지 않는다. 새로 작성한 scene은 모두 서로 다른 생활 상황/행동 기준을 가지며 과도한 고객 공통문장 문제는 상품별 후속 작업에 남는다.

## 검증

- 모든 신규 규칙의 실제 source trait 존재, 조건 제거 시 미선택, no-match/missing MBTI, 오행 반대/모순 상태를 검사한다.
- 무관한 fact 제거가 다른 interaction을 바꾸지 않는 counterfactual을 검사한다.
- 51조합에서 fact/type/source ID, draft 내 실제 scene 전달, deterministic generation/publish를 검사한다.
- 6상품 deterministic 생성/publish, 기존 actual SSR 검사, 궁합 7category swap/role 검사를 통과한다.
- Mock writer와 fallback의 동일 evidence, 외부 fetch 0을 기존 suite와 함께 확인한다.
- `pnpm test`: 350개 파일 / 3,211개 테스트 PASS.
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS.
- `pnpm exec tsc --noEmit`: 기존 387건 그대로, 신규 0건 / 해소 0건 / production source 오류 0건. 행 번호 이동을 제외한 진단 내용·건수를 대조했다. 전체 tsc 자체는 아직 통과하지 않는다.

## 다음 상품별 품질 작업

1. 실제 근거가 있는 미선택 6조합의 빈 곳만 보강. 유형별 수량을 맞추지 않기.
2. 배우자궁 및 관계 종류/위치별 행동 predicate의 독립적인 근거 정리. 일반 label을 활성화 조건으로 쓰지 않기.
3. 종합 외 각 상품에서 scene을 더 다양하게 배분하고 기존 일반론의 반복을 줄이기. 이번 작업에서는 timeline/7category 본문 전체를 재작성하지 않음.
4. 기존 6 scene의 legacy trait ID와 source DB trait의 의미 대응을 별도 검토. 서로 다른 ID를 임의로 같은 의미로 합치지 않기.
5. 늘어난 추적 메타데이터를 보존하면서 prompt 중복 직렬화를 줄이기.

기존 `.gitignore`, `supabase/.temp`는 제외한다. 실제 OpenAI/Toss/production DB write/deploy는 0이다.
