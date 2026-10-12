# V4-MBTI-PAIR-RELATION-KNOWLEDGE-01

기준 `818b71112922bd06f4ac5d7b566324dcf33cf4c6`에서 독립 worktree `/private/tmp/gyeol-mbti-pair-relation-knowledge-01`와 브랜치 `v4/mbti-pair-relation-knowledge-01`을 생성했다. 원본 checkout의 브랜치/HEAD를 전환하지 않았다. 기존 worktree는 실제 시작 시점 18개였으며 새 worktree를 더하면 19개다.

256방향의 **오프라인 조건부 관계 연구**를 구축했다. 120개 서로 다른 유형 조합과 16개 동일형 조합에 대해 공동 자료 136개를 수작업으로 작성하고, 각각 작성한 두 사람의 도움·의도 후보·오해·확인 질문을 방향에 맞게 배치했다. 정적 파일 생성은 이미 작성한 내용을 직렬화하는 작업이며, 문장 틀이나 trait 키워드로 페어 원고를 자동 생성하지 않았다.

새 자료 전부 `connectedToRuntime=false`, `approvedForCustomer=false`다. source-local direct/inferred, 두 사람의 trait 비교, 관계 카테고리 참고 가능성, 미확인 계보, 반려 주장을 분리했다. 과학적으로 입증된 페어 법칙은 0개다. 이번 완료는 고객 승인·연결·궁합 점수·판매 승인과 다르다.

## 기존 자료 전수 inventory

| 항목 | 실제 수 | 해석 |
|---|---:|---|
| MBTI 유형 / 개인 trait 영역 | 16 / 16 | 기존 계약 그대로 |
| 기존 개인 trait / 앞 단계 조건부 개인 연구 | 1,213 / 512 | 이번에 변경 없음 |
| notablePairs | 256 | 모든 원문 필드와 JSON pointer/hash 보존 |
| source-local direct / inferred | 158 / 98 | 실증 검증 수준을 뜻하지 않음 |
| 양방향 label 차이 | 148방향 | 한글 label 비교, 아래 원어 이름 차이와 별도 |
| sourceRelationName 원문 차이 | 144방향 | 공백·별칭 포함 원문 비교 |
| 동일 reportLine | 40방향 | 자기 유형 16 + 다른 유형 24방향(12조합) |
| 일반 reportLine | 72방향 | 원문이 `이 관계는`으로 시작하는 기존 식별 기준; 모두 inferred |
| 고유 원어 관계명 | 86 | 계보·MBTI 대응 미확인 포함 |
| 역방향 누락 | 0 | 누락 시에는 만들지 않는 정책 별도 |

`source-pair-inventory.json`은 256원문 전체와 모든 11필드의 pointer/정규 JSON SHA-256, 역방향 참조를 담는다. `relationship-hints-preservation.json`은 comfortableTypes/challengingTypes와 전체 relationshipHints hash를 보존한다. 16원본 파일은 내용 hash뿐 아니라 바이트 hash도 대조했다. 배열 원소의 순서는 유지하고 객체 키만 정렬한 UTF-8 JSON으로 내용 hash를 계산했다.

| 출발 유형 | 전체 | direct | inferred | label 차이 | 일반 reportLine |
|---|---:|---:|---:|---:|---:|
| INTJ | 16 | 4 | 12 | 13 | 0 |
| INTP | 16 | 13 | 3 | 9 | 0 |
| ENTJ | 16 | 15 | 1 | 7 | 0 |
| ENTP | 16 | 9 | 7 | 7 | 7 |
| INFJ | 16 | 9 | 7 | 9 | 7 |
| INFP | 16 | 16 | 0 | 7 | 0 |
| ENFJ | 16 | 16 | 0 | 7 | 0 |
| ENFP | 16 | 4 | 12 | 9 | 12 |
| ISTJ | 16 | 8 | 8 | 9 | 8 |
| ISFJ | 16 | 10 | 6 | 9 | 0 |
| ESTJ | 16 | 16 | 0 | 15 | 0 |
| ESFJ | 16 | 15 | 1 | 7 | 0 |
| ISTP | 16 | 1 | 15 | 13 | 15 |
| ISFP | 16 | 16 | 0 | 3 | 0 |
| ESTP | 16 | 1 | 15 | 13 | 12 |
| ESFP | 16 | 5 | 11 | 11 | 11 |

## 실제 사용 경로와 이번 격리

- `sourceRuntimeAdapter.ts`는 기존 JSON과 기존 개인/관계 projection을 제공한다.
- `mbtiSourceAdapter.ts`는 기존 source leaf를 inventory/분류한다.
- `compatibilityMbtiBridge.ts`는 기존 A/B 방향 자료를 사용하며 기존 MBTI 예산을 양쪽에 나눈다. 이번 trait 참조를 기존 점수에 더하지 않는다.
- 새 `src/lib/report-knowledge/mbti-pair-research/`는 출발 유형별 16파일과 연구 타입/출처 2파일뿐이다. 함수·lookup·barrel이 없으며 import는 type-only다.
- 기존 src 995파일, 원천 JSON 16파일, 앞 단계 개인 연구 관련 46파일의 바이트 hash를 동결·검사했다. 명리 연구를 포함한 기존 src 전체 보존은 명리/MBTI/Fusion/선택/생성/Book/결제/인증 코드의 변경이 없음을 확인하는 근거다.

## 관계명 계보: 이름을 그대로 두고 체계를 분리

Myers & Briggs Foundation의 관계 안내는 최적 또는 더 성공하는 유형 조합을 정하지 않으며 관계에는 유형 외 요인도 있다고 설명한다. 이 지침을 페어 연구의 한계로 사용했고, 새 256자료의 실증 근거로 사용하지 않았다. [공식 관계 안내](https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/home.htm)

Socionics의 TIM/Model A 관계 분류는 MBTI 선호와 자동으로 동일하지 않다. IIS의 범주 설명과 Bukalov 2012의 14관계 구분, Gulenko의 체계 비교, Humanitarian Socionics의 짧은 관계 정의를 대조했다. 서로 다른 학파의 의미를 하나의 검증된 MBTI 관계표로 합치지 않았다. [IIS 범주](https://socionic.info/en/et/buklet.html), [Bukalov 2012](https://publishing.socionic.info/socionics/article/download/950/901), [체계 비교](https://socionic.info/pdf/Speaking%20Different%20Languages.pdf), [SHS 관계 정의](https://socioniks.net/en/relation/)

영어 별칭은 2차 용어집으로 추가 대조했다. 별칭 후보가 있다는 사실은 기존 작성자의 번역 의도·계보가 확인됐다는 뜻이 아니다. False Identical, Interesting/Alpha-Opposite, Beta Comfort, TRUITY 혼합명, Inferred*를 임의로 표준 관계에 배정하지 않았다. [Wikisocion 용어집](https://wikisocion.github.io/content/intertype.html)

`relation-name-review.json`은 모든 86명칭별 체계, 별칭, 기본 모형 설명, 방향성, 한계와 출처를 담는다. 전부 `originalGenealogy=unverified`, `mbtiMapping=not_established`다. 21원문 이름만 14개의 Socionics 용어군 후보와 연결했다. 나머지는 로컬 추론명 38, 미해결명 24, 쿼드라 형태 2, 혼합 출처 1이다. 이는 해당 256 MBTI 페어 배정의 타당성을 확인한 수가 아니다.

| 원문 이름 | 방향 수 | 용어군 후보 | 체계 검토 | 방향성 |
|---|---:|---|---|---|
| Activity | 13 | activation | socionics_term_family | symmetric_within_socionics_only |
| Activity vs Structure | 1 | 미확인 | source_local_unresolved | unknown |
| Benefit | 21 | benefit | socionics_term_family | asymmetric_family_roles_unverified |
| Beta Comfort | 3 | 미확인 | quadra_style_label_not_pair_relation | unknown |
| Beta comfort | 3 | 미확인 | quadra_style_label_not_pair_relation | unknown |
| Comparative | 7 | kindred | socionics_term_family | symmetric_within_socionics_only |
| Complementary | 5 | 미확인 | source_local_unresolved | unknown |
| Conflict | 11 | conflict | socionics_term_family | symmetric_within_socionics_only |
| Conflicting | 4 | conflict | socionics_term_family | symmetric_within_socionics_only |
| Contrary | 6 | extinguishment | socionics_term_family | symmetric_within_socionics_only |
| Control and Freedom | 1 | 미확인 | source_local_unresolved | unknown |
| Cooperation | 1 | business | socionics_term_family | symmetric_within_socionics_only |
| Different Leadership Values | 1 | 미확인 | source_local_unresolved | unknown |
| Duality | 11 | duality | socionics_term_family | symmetric_within_socionics_only |
| Duality / TRUITY complementary | 1 | 미확인 | mixed_named_sources_unverified | unknown |
| Duty and Feeling | 1 | 미확인 | source_local_unresolved | unknown |
| Execution and Ideas | 1 | 미확인 | source_local_unresolved | unknown |
| Extinguishment | 2 | extinguishment | socionics_term_family | symmetric_within_socionics_only |
| False Identical | 2 | 미확인 | source_local_unresolved | unknown |
| Freedom and Control | 1 | 미확인 | source_local_unresolved | unknown |
| Friendly | 2 | 미확인 | source_local_unresolved | unknown |
| Friendly / Gamma | 1 | 미확인 | source_local_unresolved | unknown |
| Identical | 13 | identity | socionics_term_family | symmetric_within_socionics_only |
| Identity | 1 | identity | socionics_term_family | symmetric_within_socionics_only |
| Illusionary | 10 | mirage | socionics_term_family | symmetric_within_socionics_only |
| Inferred Active Sensory Resonance | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Active-Feeling Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Analytic Kinship | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Care-Activity Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Care-Autonomy Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Depth-Expression Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Execution Partnership | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Execution Pressure | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Execution-Debate Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Executive Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Executive Drive | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Executive-Field Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Experimental Debate | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Experimental-Practical Bond | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Expressive Possibility Bond | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Idea Rivalry | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Idea-Expression Stimulation | 2 | 미확인 | source_local_inference_label | unknown |
| Inferred Idea-Field Activity | 2 | 미확인 | source_local_inference_label | unknown |
| Inferred Intellectual Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Intuitive Spark Bond | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Logic-Action Stimulation | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Management-Expression Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Practical-Procedure Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Procedure-Joy Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Procedure-Spontaneity Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Quiet-Care Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Sensory Activity Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Sensory-Practical Bond | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Sensory-Value Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Social-Care Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Stability-Stimulation Balance | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Strategic Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Strategic-Field Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Strategic-Practical Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Value-Debate Tension | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Value-Joy Balance | 1 | 미확인 | source_local_inference_label | unknown |
| Inferred Value-Practice Complement | 1 | 미확인 | source_local_inference_label | unknown |
| Interesting | 2 | 미확인 | source_local_unresolved | unknown |
| Interesting / Alpha-Opposite | 1 | 미확인 | source_local_unresolved | unknown |
| Kindred | 1 | kindred | socionics_term_family | symmetric_within_socionics_only |
| Leadership Clash | 1 | 미확인 | source_local_unresolved | unknown |
| Logic but Different Lifestyle | 1 | 미확인 | source_local_unresolved | unknown |
| Look-a-like | 4 | business | socionics_term_family | symmetric_within_socionics_only |
| Look-alike | 5 | business | socionics_term_family | symmetric_within_socionics_only |
| Mirror | 12 | mirror | socionics_term_family | symmetric_within_socionics_only |
| Opposing Values Growth | 1 | 미확인 | source_local_unresolved | unknown |
| Opposite Strengths | 3 | 미확인 | source_local_unresolved | unknown |
| Order and Innovation | 1 | 미확인 | source_local_unresolved | unknown |
| Pedagogy | 1 | 미확인 | source_local_unresolved | unknown |
| Planning vs Spontaneity | 1 | 미확인 | source_local_unresolved | unknown |
| Quasi-Identical | 6 | quasi_identity | socionics_term_family | symmetric_within_socionics_only |
| Quasi-Identity | 4 | quasi_identity | socionics_term_family | symmetric_within_socionics_only |
| Responsibility Pair | 1 | 미확인 | source_local_unresolved | unknown |
| Same Standards | 1 | 미확인 | source_local_unresolved | unknown |
| Semi-Duality | 10 | semi_duality | socionics_term_family | symmetric_within_socionics_only |
| Stability and Possibility | 1 | 미확인 | source_local_unresolved | unknown |
| Stable Complement | 1 | 미확인 | source_local_unresolved | unknown |
| Super-Ego | 10 | superego | socionics_term_family | symmetric_within_socionics_only |
| Supervision | 14 | supervision | socionics_term_family | asymmetric_family_roles_unverified |
| Supplement | 1 | 미확인 | source_local_unresolved | unknown |
| inferred | 11 | 미확인 | source_local_inference_label | unknown |

## 양방향 차이 148방향의 처리

`directional-comparison.json`에서 원문의 모든 필드를 양방향 hash와 함께 대조했다. 분류는 중첩될 수 있다. label이 다른 148방향에서:

- A: 원래 비대칭인 Benefit/Supervision 용어군이나 역할 미확인 4방향.
- B: 동일 용어군의 별칭/label 차이 후보 16방향. 기존 번역 의도 확정 아님.
- C: 로컬·혼합·미해결 이름이 포함된 비교 128방향. 체계가 실제로 다르다고 확정하는 것도 보류.
- D: 양쪽 sourceCoverage가 다른 경우 74방향. 원저자·독립 출처 차이를 입증한 수 아님.
- F: 원전 계보/유형 대응/실증 타당성 미확인 148방향 전체.
- E: 실제 사실 모순을 확정한 사례는 이번 자료만으로 입증하지 못했다. `verifiedOriginalLogicalContradictions=[]`는 무결점 판정이 아니다.

ENTJ/ISTJ는 주도권·통제와 빠른 결정·절차를 서로 다른 방향에서 강조한다. ENFP/ESFJ는 맞춤과 부담의 위치를 다르게 설명한다. 양쪽이 동시에 가능할 수 있어 어느 쪽이 옳은지 자동 판정하지 않았다. INFJ/INFP의 False Identical / Quasi-Identical도 원전 근거 없이 동치화하지 않았다. 해당 긴장은 `conflicts-and-unverified.json`에 남겼다.

## 실제 연구 내용과 방향별 의미

수작업 공동 원고는 합계 52,358자(공백 포함, pair key 제외), 조합당 320–491자다. 문자열 수나 길이를 심층 품질의 증명으로 쓰지 않는다. 공통 접점과 조건 차이, 양쪽 도움, 마찰 조건, 각자의 의도 후보와 오해, 각각의 질문, 공동 합의, 반전, 두 가상 장면, 반례를 한 묶음으로 읽도록 만들었다. 공통 합의 문구 자체는 페어 고유 법칙이 아니다.

**INTP → ESTJ**: 기존 `ti_internal_model`은 내부 납득, `ne_possibility_storm`은 가능성을 계속 검토하는 선호를 서술한다. ESTJ의 `te_fact_execution`은 기준·결과·책임, `si_verified_process`는 검증된 절차를 서술한다. 이 실제 원문을 비교해 “방법까지 세세히 지시하거나 정한 기한을 말없이 넘길 때”라는 조건을 선택했다. INTP가 확인할 질문은 “검토가 끝날 때와 납품 가능한 범위를 알렸는가?”다.

**ESTJ → INTP**: 공통 접점은 같아도 출발 관점은 다르다. 실행 책임을 분명히 하려는 확인이 사고 과정을 통제하는 감시로 읽힐 수 있다는 후보를 둔다. 질문은 “결과 기준과 방법의 재량을 구분했는가?”이며, 합의는 중간 산출물·최종 기준과 방법의 재량을 함께 정하는 것이다. 한쪽의 욕구를 반대쪽에 복제하지 않았다. 실제 의도는 알 수 없어 두 사람에게 먼저 확인해야 한다.

**INFJ ↔ INFP**: INFJ의 `ni_pattern_prediction`/`private_analysis_loop`와 INFP의 `fi_inner_alignment`/`ne_branching_imagination`을 비교했다. 관계의 의미를 읽는 질문과 개인 가치의 유보가 서로 교정/거절로 읽힐 조건을 다룬다. INFJ의 질문은 “상대가 말한 사실과 내 해석을 나눴는가?”, INFP는 “나의 선을 구체적으로 알렸는가?”다. 비슷한 따뜻한 언어가 같은 결론을 뜻하지 않는다는 반전이다. Socionics 명칭에서 이 해석을 도출하지 않았다.

**ISFJ ↔ ISFJ**: 동일한 유형 정보에서 부담·가족 역할의 차이를 배정하지 않는다. 양보를 계속 맡아도 된다는 동의로 오해할 수 있는 상황, 기억한 취향이 현재 필요와 다른 상황을 별도 가능성으로 둔다. 질문 “지금 감당할 수 있는가?”와 “지난 필요가 지금도 같은가?”는 토의 항목이며 A/B의 성격 차이를 주장하지 않는다.

136개 수작업 공동 자료는 `joint-authored-review.json`, 256방향 원문과 신규 후보를 함께 읽는 문서는 [materials-review.md](materials-review.md)다. 신규 기록마다 양쪽 각각 12개의 실제 trait pointer/ID/hash를 참조한다. 6개 영역에서 2개씩 선택한 192개 고유 type+pointer(로컬 trait ID 문자열은 188종)가 3,072회씩 A/B에서 재사용된다. 각 방향에 24개를 참조했다고 6,144개의 독립 근거가 생긴 것이 아니다. sourceCoverage=inferred인 참조도 그대로 유지한다.

원천의 모든 JSON필드·경로·coverage와 양방향 차이는 자동 전수 대조했고, 256 reportLine과 수작업 공동 자료 136개/양방향 관점을 내용 비교했다. 원천 개인 trait 전체 1,213개의 외부 사실성이나 기존 모든 문장의 경험적 타당성이 새로 검증됐다는 뜻은 아니다. 이번 조건부 후보의 근거는 선택한 양쪽 trait이며, 기존 pair의 강한 단정은 새 승인 주장으로 가져오지 않았다.

## 일반론·중복·의미 다양성 감사

98 inferred의 원천 상태를 유지하고, 72 일반 reportLine 및 40 동일 방향 문구 각각에 조건부 후보를 연결했다. 모두 단순 길이 확대를 통한 direct 승격은 0건이다.

- 공유 접점/차이/마찰 조건/합의/반전/가상 장면을 포함한 공동 dossier의 완전 동일 복제 0개.
- 필드별 동일 표현 11그룹. 예: ISFJ/ISFJ와 ISFP/ISFP의 “상대가 원하는 도움을 직접 확인”. 공통 확인 행동이며 두 고유 관계 사실로 계산하지 않는다.
- 합의 문구 편집거리 유사도 0.82 이상 1쌍: ENTJ/ENFJ의 “결과 기준과 참여 조건”과 ENTP/ESTJ의 “결과 기준과 재논의 조건”. 공통 실천을 유지하되 전자는 발언·부담, 후자는 결정 후 반복 논쟁이라는 조건 차이를 읽었다. 표현만 다르다고 새 지식 수로 세지 않는다.
- 7개 공통 실천 색인은 도움 분배/논의 동의/참여 선택/결정 기준/시간/개인 경계/피드백 검색을 돕는다. 키워드 검색은 자동 의미 판정도, trait 선별 알고리즘도 아니다.
- 서로 다른 유형 240방향은 별도 작성한 각자의 도움·오해·질문을 가진다. 공동 의미/장면은 정당하게 공유한다. 자기 유형 16개는 가짜 성격 차이를 만들지 않는다.
- 전부가 배타적으로 고유하거나 일반적인 관계 조언과 무관하다고 주장하지 않는다. 전수 수작업 비교와 보조 문자열 검사는 독립 심리학 검증을 대신하지 않는다.

[semantic-review.md](semantic-review.md)에 16출발 유형 각각 상대가 달라질 때의 실제 조건 차이를 독해 기록했다. `duplication-audit.json`, `shared-practice-index.json`, 기존 5종 필드별 중복 목록을 함께 보존했다. 가상 장면은 고유 ID와 텍스트 각각 272개이며 방향별 참조 512개다. 고객이 겪은 사건이 아니고, 각본 전체보다 상호작용을 관찰할 구체적 상황 후보다.

## 출처·미검증·반려 상태

23 출처 레코드는 로컬 원천 16, 로컬 명칭 집합 1, 실제 접근한 외부 자료 6개다. 2차 Wikisocion은 별칭 확인에만 쓰고 pair의 실증 근거로 쓰지 않는다. 실제 확인 범위/저자·기관/URL/유형 정의/한계를 `source-verification.json`과 정적 출처 파일에 기록했다. 2013 후속 논문은 공개 초록만 확인했으며 유료 PDF는 읽거나 사용하지 않았다.

기존 원문 강한 표현의 문자열 screen 37건은 자동 반려 37건을 뜻하지 않는다. 일부는 경고·비유·부정문이다. 원문을 보존하고 신규 후보로 승격하지 않았다. `original-claim-screen.json`에서 문장과 pointer를 직접 확인할 수 있다.

별도 `rejected-interpretations.json`에 6개 주장군을 반려했다: MBTI↔TIM 자동 대응, 최적 궁합/성공 보장, 감독/요청 역할 자동 배정, 마음·과거 사건 판독, 건강 효능 법칙, 고정 돌봄 역할. 기존 원문과 해당 해석을 삭제하지 않았다.

## 관계 카테고리와 적용 한계

256방향마다 7카테고리의 기초 적용 조건만 보존했다. 실제 교제·동의, 공동생활, 관찰된 선호와 발달 단계, 업무 재량, 권한/불이익, 계약/책임, 공개/연락 동의를 먼저 확인한다. 권력 문제나 폭력·강압을 유형 차이로 설명하지 않는다. 부모·자녀의 존재/유형, 사업 지분·책임·수익을 추정하지 않는다. 7유형 전문 DB를 구축한 상태는 아니다.

null/UNKNOWN에는 유형을 추정하지 않는다. 실제 데이터의 역방향은 모두 있지만 누락되는 향후 자료에는 `missing_do_not_invent`와 null 참조를 남기는 타입/정책을 마련했다. 새 lookup을 만들어 이 정책을 런타임에 적용하지 않았다. 회복 시간과 연락 빈도도 유형으로 배정하지 않고 당사자에게 필요와 재논의 시점을 확인하도록 제한했다.

## 보존·검증 결과

검증 명령과 결과는 `validation-results.json`, 실행 원문은 `logs/`에 보존한다. 기존 3실패를 삭제·skip·수정하지 않았다. [후속 인수 자료](category-research-handoff.md)는 후속 범위만 기록하며 이번에 실행하지 않는다.

| 검증 | 결과 |
|---|---|
| 기준 SHA 실패 재현 | 36 PASS / 3 기존 FAIL |
| 신규 페어·기존 MBTI/명리·궁합·기준 실패 재검사 | 1,235 PASS / 3 동일한 기존 FAIL (22파일) |
| 신규 페어 테스트 | 41/41 PASS; 위 합계에 포함 |
| 6상품 통합 | 64/64 PASS; 계산·근거·원고·Book·snapshot digest 및 저장본 owner/shared replay |
| 최종 관련 테스트 합계 | 1,299 PASS / 3 동일한 기존 FAIL; 신규 실패 0; 기준 재현 중복 합산 안 함 |
| TypeScript | 기준 0 / 변경 후 0 / 신규 0 (`--noEmit --incremental false`) |
| lint | PASS, 경고 0 |
| Production build | PASS, 47/47 정적 페이지, NFT/신규 경고 0; 외부 원고·Toss 승인·유료 신뢰성 외부 연동 OFF |
| 런타임 격리 | 기존 소스에서 신규 import/식별자 0; 빌드 JS 458개에서 신규 연구 sentinel 0 |
| 원천·기존 코드 | 기존 src 995 + 원천 JSON 16 + 개인 연구 관련 46파일 바이트 보존 |
| 원본 checkout·worktree | 기존 18개 HEAD/branch/status/파일 hash 동일; 미커밋 11개 보존 |
| diff-check | PASS (`git diff --cached --check`, `git diff --check`); 신규 53파일만 stage |

6상품 64사례는 실제 발행 생성/Book 구조의 기존 오프라인 lock 검증이다. 62개의 성공 사례와 기존 DAYUN 불확실 입력 차단 2개를 포함한다. 이전 6권의 저장본은 새 원고로 재생성하지 않고 replay한다. 실제 고객 DB·실결제·공유 서비스의 운영 E2E를 실행한 결과는 아니다.

기존 실패는 다음 그대로다. `foundationAdapter.test.ts:116`의 예전 모듈 격리 기대가 `careerReleaseMaterials.ts`와 충돌하는 assertion 1건, `customerDayunGeneration.test.ts:50`의 major/annual checkout fixture 응답 JSON 파싱 오류 2건이다. 범위 외 계약·fixture를 수정하지 않았다. 최종 테스트 프로세스가 exit 1인 이유를 성공으로 바꾸지 않는다.

로그는 실행 결과의 공백만 정리했고 원본 외부 로그도 `/tmp/gyeol-mbti-pair-validation/`에 남겼다. TypeScript 로그 0바이트는 진단 0을 뜻하며 실행 exit 0을 함께 기록했다.

## 산출물 찾기

- [coverage-manifest.json](coverage-manifest.json): 16×16 실제 기록·참조 수·승인 상태·검증.
- [source-pair-inventory.json](source-pair-inventory.json): 원문 256 전체와 필드 pointer/hash.
- [directional-comparison.json](directional-comparison.json): 양방향 모든 필드와 분류 보류 사유.
- [relation-name-review.json](relation-name-review.json): 86개 명칭의 체계·별칭·방향·한계.
- [materials-review.md](materials-review.md): 원문과 신규 연구 전수 독해.
- [joint-authored-review.json](joint-authored-review.json): 수작업 공동 원고 136개.
- [source-verification.json](source-verification.json): 확인한 자료와 미확인 범위.
- [conflicts-and-unverified.json](conflicts-and-unverified.json), [rejected-interpretations.json](rejected-interpretations.json): 긴장·보류·반려 구분.

## 남은 연구 공백

1. 기존 원천 작성자의 86명칭 원전 계보·타입 대응과 실제 역할 방향은 미확인이다.
2. 새 자료는 두 사람의 실제 성향·역할·동의가 맞을 때 검토하는 조건부 후보다. 관계 결과·효과의 실증 검증은 하지 않았다.
3. 7유형 전문 카테고리, 추가 생활 장면의 경험적 검증, 고객 표현 DB, 개인 적합성 확인은 후속 독립 작업이다.
4. 기존 3개 테스트 실패는 이번 범위에서 수정하지 않는다.
5. 의미 축·Fusion·원고 연결·점수·배포·이벤트 활성화를 시작하지 않았다.
