# V4-SEMANTIC-AXIS-KNOWLEDGE-EXPANSION-01

36축 전체를 보존하면서 독립적인 의미 연구 DB를 추가했다. 고객 원고·계산·점수·선택 결과에는 연결하지 않았다. 새로 작성한 의미 분해·생활 장면·반례는 편집적 조건부 후보이며 실증 심리 사실이나 고객의 실제 이력이 아니다.

## Git·작업 경계

- 기준: `v4/mbti-pair-relation-knowledge-01`, `afb8c3aa798ae3da0ede7ee7ae68b6adb04718bd`. 시작 시 원격 브랜치와 일치 확인.
- 신규 브랜치: `v4/semantic-axis-knowledge-expansion-01`.
- 독립 worktree: `/private/tmp/gyeol-semantic-axis-knowledge-expansion-01`.
- 기존 worktree는 실제 19개, 신규 포함 20개. 기존 19개 전체의 HEAD·브랜치·Git 상태·추적 및 비무시 미추적 파일 SHA-256을 전후 비교했다.
- 원본 checkout은 `v4/annual-editorial-quality-fix-01`, `c048218cc5961e0f53a1deab2603511e17559fc3`. `.gitignore`, `AGENTS.md`, `supabase/.temp/` 내 9개 파일까지 기존 11개 보호.
- 기존 src·원천 JSON·연구 DB·검증 문서·테스트 2,074개 파일의 bytes를 보존했다. 신규 연구 경로·신규 테스트·이 보고서 경로만 변경했다.
- reset/restore/stash/clean, master 변경, Production 변경, 외부 원고 API, DB 쓰기, 결제·환불·캠페인 작업은 실행하지 않았다.

## 산출물 찾기

| 산출물 | 파일 |
|---|---|
| 기존 의미 체계·상품 사용 경로 | [system-inventory.json](system-inventory.json), [existing-module-consumers.json](existing-module-consumers.json), [existing-semantic-inventory.json](existing-semantic-inventory.json) |
| 36축·109하위 개념·방향·신호·복합 의미 | [semantic-ontology.json](semantic-ontology.json), `src/lib/report-knowledge/semantic-axis-research/` |
| 실제 자료 전체 읽기 | [materials-review.md](materials-review.md) |
| 22태그·실제 Material/Fusion/trait 참조 | [legacy-tag-crosswalk.json](legacy-tag-crosswalk.json), [material-tag-inventory.json](material-tag-inventory.json) |
| 16 Theme | `broadThemes.ts`, [semantic-review.md](semantic-review.md) |
| Context·Domain 80조합 | [context-domain-matrix.json](context-domain-matrix.json) |
| 6상품·7유형 질문·조건 | [product-applicability.json](product-applicability.json), [relationship-applicability.json](relationship-applicability.json), [applicability-gates.json](applicability-gates.json) |
| 명리·MBTI 연구 전수 분류 가능성 조사 | [source-semantic-survey.json](source-semantic-survey.json), [research-source-inventory.json](research-source-inventory.json), [survey-summary.json](survey-summary.json) |
| 기존 명리 DB·원천 catalog | [legacy-saju-inventory.json](legacy-saju-inventory.json) |
| MBTI1213trait·원본256페어 | [mbti-trait-semantic-survey.json](mbti-trait-semantic-survey.json), [mbti-old-pair-semantic-survey.json](mbti-old-pair-semantic-survey.json) |
| 기존 MBTI annotation·leaf | [mbti-annotation-inventory.json](mbti-annotation-inventory.json), [mbti-source-leaf-inventory.json](mbti-source-leaf-inventory.json) |
| 축별 기존 참조 후보 | [axis-source-reference-candidates.json](axis-source-reference-candidates.json) |
| Dynamic·Fortune·Fusion 분류 | [non-axis-vocabulary-audit.json](non-axis-vocabulary-audit.json) |
| 의미 중복·손실·충돌 | [semantic-duplication-audit.json](semantic-duplication-audit.json), [semantic-review.md](semantic-review.md) |
| 신규 축 후보·미검증·반려 | [new-axis-candidates.json](new-axis-candidates.json), [unverified-materials.json](unverified-materials.json), [rejected-interpretations.json](rejected-interpretations.json) |
| 출처 확인 범위 | [source-verification.json](source-verification.json), `semanticResearchSources.ts` |
| 후속 연결 계약 | [evidence-binding-blueprint.md](evidence-binding-blueprint.md), `evidenceBindingResearchTypes.ts` |
| coverage·검증·보존 | [coverage-manifest.json](coverage-manifest.json), [validation-results.json](validation-results.json), [preservation-results.json](preservation-results.json), [logs/](logs/) |

## 기존 체계 전수 감사

| 분류 | 실제 개수 | 현재 역할과 구별 |
|---|---:|---|
| SemanticAxis | 36 | 8양극·28강점; 기존 수치·가중치 불변 |
| SemanticTag | 22 | Material와 명시적인 legacy Fusion 연결; 축과 별도 |
| Broad Theme | 16 | candidate family·중복 그룹; 멤버 축 중복0과 의미 중복은 다름 |
| InterpretationContext | 8 | identity/work/money/social/love/stress/learning/recovery |
| V4Domain | 10 | identity/strengths/weaknesses/work/money/study/love/marriage/relationships/success/fortune |
| DynamicTag | 55 | DYNAMIC support/amplifier와 claim 조건; 고정 성격이 아님 |
| FortuneTag | 16 | support-only 신호와 별도 claim gate; 미래 사건 아님 |
| FortuneTheme | 9 | legacy rule의 주제 분류 |
| legacy Fusion kind | 3 | overlap/contrast/complement |
| semantic Fusion type | 3 | REINFORCE/TENSION/COMPLEMENT; 기존 양측 근거 필요 |
| Fusion condition split | 10 | 시작/유지·겉/속·공적/사적 등 조건 구별 |
| Fusion complement | 96규칙·8그룹 | 실제 축·방향·contexts·sourceDescription 보존; 새 규칙0 |
| MBTI source domain | 20 | 실제 `MBTI_DOMAIN_CONTEXTS`; trait area16, general7 |
| MBTI 원천 trait | 1,213 | 1,070 primary scoring, 143 미점수; 무조건 결함 아님 |
| MBTI source leaf | 25,750 | scoring1,070/reference-only18,671/metadata6,009 |
| MBTI annotation | 19,741 | reference-only 포함; 독립 연구/근거 수가 아님 |
| 기존 명리 taxonomy/KB | 124/77 | 상호 ID·별칭·Material 통합 의미 보존 |
| 기초 명리 knowledge | 213 | 기본 분류·60일주·십성·신살·구조·관계 포함 |

단순 선언과 원고 사용을 구별했다. 현재 실제 `runtimeShadow`가 6상품 adapter를 사용한다. 종합·커리어·연애·궁합은 integrated natal/MBTI/Fusion/claim/resonance 경로를 거친다. 대운·세운도 기존 composer 위의 `createTimeProductContext`에서 원국 후보와 계산된 기간 십성을 관련성으로 결합한다. 이 결합은 새로운 기간 Fusion 점수 계산이 아니다. `semanticCore`의 writer 미사용 주석만으로 판단하면 안 된다. 신규 연구 registry의 외부 runtime consumer는0이다.

## 신규 자료와 개수의 의미

- 36개의 독립 축 프로필: 기존 정의 원문을 별도 보존하고 조건부 세분 정의·행동·긍정·과용·약한 신호 한계·반전·환경·공존·긴장·반례·가상 장면·금지 단정을 작성.
- 109개 하위 개념: 축별 2~4개. 오류 발견·규칙 일관성·완성도·논리 모순, 도움 필요·실제 지원·지속 여력·비개입 존중 등을 다른 행동 대상으로 분리.
- 16개 양극 방향 프로필: 음의 방향은 결함이 아니다. 방향별 이점·위험·적합 환경을 따로 작성.
- 강점 신호5상태: supported/weak/absent/contrary_observed/unresolved. 낮거나 없는 CARE로 무배려를 생성하지 않는다.
- 조건부 복합 의미12개: 단순 축 합산이나 새 Fusion 규칙이 아니다. 두 근거와 실제 같은 맥락을 후속 확인해야 한다.
- 신규 축 후보2개: 불확실성 보정, 상호성 협의. 독립성 미입증. 후자는 관계 조건이나 복합 의미로 충분할 수 있으므로 점수 축 추가를 승인하지 않는다.
- 긍정173·위험173: 36축+109facet+16방향+12복합의 역할별 자료 수다. 독립 심리 사실173개가 아니다.
- 반전36개를 축에서 공유한다. facet가 부모 반전을 참조한다고 109개의 새 반전으로 세지 않는다.
- 상품 질문216개·관계 질문252개. 각각 실제로 다른 문제를 묻는다. 전문 상품/궁합 DB는 제작하지 않았다.

모든 신규 registry 자료는 `connectedToRuntime=false`, `approvedForCustomer=false`, `existingScoreContribution=false`, `runtimeEvidenceIds=[]`다. 함수·lookup·barrel이 없고 기존 소스에서는 import하지 않는다. 타입 참조는 type-only다. 권력 차이는 성격 축으로 처리하는 제안을 반려했다.

## 직접 의미 검토

[materials-review.md](materials-review.md)에 36축의 실제 전체 내용을 수록했다. [semantic-review.md](semantic-review.md)에 다음 비교의 대상·조건·반례를 기록했다.

- 정확성·경계·계획·말투는 같은 “기준 확인”이 아니다.
- 돌봄·의무·조율·사회적 인정은 같은 “책임감”이 아니다.
- 발의·착수 속도·결론 종료는 같은 “실행력”이 아니다.
- 질문·깊이·학습·패턴은 같은 “생각이 많은 사람”이 아니다.
- 혼자 정리·사적 공간·깊은 몰입·회복 여백은 같은 “혼자 쉬기”가 아니다.
- 긍정과 위험은 행동의 대상·과용 조건을 나눠야 하며 모두 “조심하라”로 끝내면 정보가 줄어든다.

목록·문장 수·문자열 중복 검사만으로 의미 품질 PASS를 주지 않았다. 신규 자료의 의미 분해는 검토했으나 개인 적용과 실증 타당성은 보류했다. 신규 정의는 기존 정의를 대체하지 않는다. 특히 RECOVERY_NEED의 기존 “혼자 쉬고 생각을 정리할 시간” 정의와 새 부하·지원 조건의 생활 응용을 구별한다.

## 출처와 연구 전수 조사 범위

117개 파일에서 2,991개 record를 추적했다. 이 중2,566개는 지식/응용, 425개는 출처·범위·보류·반려 등의 관리 자료다. 이를 모두 신규 활용 가능한 의미로 세지 않는다. 원문은 file/export/index/originalId/SHA-256으로 조회 가능하다. ID·원래 review/class/approval 상태를 보존했다.

| 연구 family | 기록 수(출처·관리 포함) | 이번 의미 조사 |
|---|---:|---|
| foundation | 213 | 기존 상징과 개인 행동의 관련성·비동등성 |
| completion | 173 | 전통 설명과 현대 적용·보류 구분 |
| deep | 838 | 60일주·십성·다중 조건과 8분야 응용의 압축 위험 |
| composite | 301 | 성립·반례·미상 시주를 건너뛴 성격화 위험 |
| relation | 246 | 관계 종류·참여자·owner·producer scope |
| temporal | 410 | 원국/대운/세운/월운 구간·전환·미지원 연결 |
| MBTI individual | 531 | 512조건부 연구와 출처; 기존 trait annotation 참조 후보 |
| MBTI pair | 279 | 256방향 연구와 출처; 개인 축 점수로 승격 금지 |

A~F는 “분류 가능성”이며 고객 승인 상태가 아니다. 연구 records의 집계는 A0/B1210/C634/D421/E53/F673이다. 원본1213trait의 별도 분류는 A266/B804/E143이다. A는 현재 단일 축 annotation 참조, B는 다축/조건, C는 관련·비동등, D는 구조/관리, E는 출처·조건·annotation 부족, F는 개인 성격으로 잘못 연결할 위험을 뜻한다.

자료 전부의 새로운 의미 연결을 승인하거나 모든 원문을 새로 실증 검증한 것은 아니다. 특히 relation/temporal의 F는 자료가 틀렸다는 판정이 아니라 고정 개인 성격으로 승격할 때의 위험이다. 512연구의 기존 trait annotation 축 목록은 참조 후보이며 해당 연구 문장과 동등하다는 승인이 아니다. 256페어에는 개인 축을 새로 배정하지 않았다. 원본 notablePairs256도 전체 inventory로 보존했다.

직접 확인한 1차 외부 자료는 [W3C SKOS](https://www.w3.org/TR/skos-reference/), [W3C PROV-O](https://www.w3.org/TR/prov-o/), [Myers & Briggs Foundation 관계 안내](https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/home.htm)다. 구조적 구분·관계 사용 한계에만 참고했다. 기존 명리 연구가 인용하는 전통 원문 전체를 이번에 새로 대조하지 않았으며 기존 검증 상태를 승격하지 않았다. 실제 확인하지 않은 새 출처를 만들지 않았다.

## 확인한 충돌·후속 요구

1. `foundationRanking.ts`의 빈 축 Theme 반환과 동률 사전순 선택을 실제 함수로 확인했다. 분류 동작은 확인됐지만 고객 반복의 모든 원인으로 단정하지 않는다. 이번 수정0.
2. Theme 멤버 축의 중복0과 의미 중복은 다르다. 같은 Theme에서도 대상·동의·권한·시점이 다른 주장은 보존해야 한다.
3. overlap은 Theme0.5+axis Jaccard0.3+max(Evidence/family Jaccard)0.2다. 연결 성분 그룹이 곧 모든 주장 동등성은 아니다. 기존 반대 방향 배제도 유지했다.
4. `help`의 수혜와 CARE의 제공, `wealth` 상징과 자원 관리, `expression-gap`과 실제 표현 능력은 일대일 대응하지 않는다.
5. 현침의 자형 전통과 현대 정밀함은 별개다. 기존 Material은 보존하고 새 전통 사실/능력 근거로 승격하지 않았다.
6. pair 연구 category의 `parent_child/coworkers/manager_team/business/friends`와 실제 canonical enum의 `parentChild/coworker/managerReport/businessPartner/friendship` 차이는 문서로만 대응했다. 후속 연결 시 명시적인 검증 adapter가 필요하다.
7. CARE158 vs CHARISMA2 annotation 분포는 차이만 확인했다. 수만으로 결함이나 점수 재조정을 결론 내리지 않는다.
8. 원국 producer가 없는 relation5종의 정의 존재는 natal 계산 지원의 증거가 아니다. 교차·기간 지원과 구별한다.

## 후속 연결 준비와 중단선

입력·출력·ID·버전·조건·실패·중복·허용·금지 계약을 [evidence-binding-blueprint.md](evidence-binding-blueprint.md)에 작성했다. A/B·방향·전환 시각·구간 교집합·원천 사실 단위를 보존한다. 연구 ID를 계산 Evidence ID로 변환하지 않고, 기존 Book은 재해석하지 않는다.

후속 Fusion 규칙 확장, 전문6상품/7유형 DB, 한국어 표현 DB, 실제 Evidence 연결·원고 생성기 변경은 시작하지 않았다. 연구 검토를 시작할 수 있는 자료 상태이며 런타임 연결이나 고객/판매 승인은 아니다. 기존 실패3건과 미검증 조건은 후속 목록으로 남긴다.

## 검증 결과

최종 실행 결과와 명령은 [validation-results.json](validation-results.json) 및 logs에 기록한다. 기존 실패를 수정·삭제·skip하지 않았다. 중간에 기존 연구 격리 테스트3건이 새 source catalog의 literal 경로를 import로 감지했다. 실제 import는 없었으며 전체 경로를 `source-verification.json`으로 분리해 auditable source reference로 유지했다. 기존 테스트 변경 없이 재검증 통과했다. 해당 중간 실패 로그도 보존한다.

6상품 통합64사례 중62개 정상 생성은 계산·불변 근거·전체 evidence·원고·Book·snapshot·구조 digest를 기존 lock과 비교했다. 나머지2개는 기존 거절 계약이다. owner/shared 열람과 과거6Book 재생성 없이 재열람도 검증한다. 운영 DB의 고객 Book을 직접 조회하거나 재생성한 검증은 아니다.

최종 결과: 관련25파일 **1,963 PASS / 기준3 FAIL**, 통합1파일 **64 PASS**. 합계 **2,027 PASS / 기준3 FAIL**, 신규 실패0. 신규 연구 테스트55건 포함. TypeScript **0→0**, lint PASS, Production build PASS(47페이지·NFT 경고0·신규 경고 유형0). diff-check는 명시적 stage 후 PASS를 확인했다. 최종 commit SHA와 원격 일치 여부는 완료 응답에 기록한다.

기존 실패는 `foundationAdapter.test.ts:116`의 careerReleaseMaterials 격리 기대1건, `customerDayunGeneration.test.ts:50`의 major/annual 빈 Response JSON 파싱2건이다. 이번 작업에서 고치지 않았다.

추가 원천 대조: [source-audit-results.json](source-audit-results.json). 기존 연구2,991개와 명리 legacy/catalog221개를 실제 export/index/id 및 record SHA-256으로 대조했다. 기존 src2,074파일 lock과 별도로 실제 원천 참조의 해석 가능성을 확인했다.
