# V4-ANNUAL-FORTUNE-READER-QUALITY-POLISH-01

요청된 세운 독자 원고 개선과 계산·저장 회귀는 PASS다. **전체 출시 판정은 PARTIAL / DEPLOY_READY: NO**다. 기존 Page export 때문에 build가 계속 FAIL이며, 공통 부록의 개별 십이운성 설명과 일부 정형 표현도 남아 있다. 자동 테스트 통과나 분량 증가를 판매 승인으로 바꾸지 않는다.

## 기준과 격리

- Base branch `v4/annual-editorial-quality-fix-01`, SHA `c048218cc5961e0f53a1deab2603511e17559fc3`.
- 독립 worktree `/tmp/gyeol-annual-fortune-reader-quality-polish-01`, branch `v4/annual-fortune-reader-quality-polish-01`.
- 평가 `2026-10-12 12:00 KST`. 실제 경로: `generateV4ShadowReport → buildV4AnnualProduct → composeAnnualFortuneNarrative → annualProductAdapter → projectBook`. 기존 networkGuard로 외부 호출을 차단했다. Mock 원고, 새 AI 호출, 결제·DB 저장은 없다.
- 원본 저장소는 계속 Base branch/SHA다. `.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개의 기존 미커밋 11개를 포함한 1,857개 파일의 SHA-256과 Git status가 시작과 동일하다. reset/restore/stash/clean은 하지 않았다.
- 다른 상품 개선 브랜치를 병합하지 않았다. 변경은 세운 편집 소스 5개, 관련 회귀 3개, 이 검증 자료에 한정한다. 계산·DB·환경·결제·공개 게이트·공통 부록·기존 Book 파일은 변경하지 않았다.

## 원인과 수정

`annualInteractionReading.ts`의 관계 종류별 공통 action이 실제 월 십성·생활 장면보다 먼저 적용됐다. 특히 원국 일지가 포함되면 십성과 무관하게 배우자/연인/가까운 사람의 약속을 선택해, 편재의 외부 기회가 관계 조정으로 끝났다. 같은 반합은 거의 같은 합의 확인을, 형은 같은 부담 안내를 반복했다. 보조 관계는 이름만 표시했고, 그 긴장이 실제 조언에는 반영되지 않았다.

- [annualMonthPractice.ts](../../../src/lib/interpretation-v4/annualMonthPractice.ts): 실제 십성의 기존 의미와 입력 상황을 사용한 질문·실행·확인 조건. 첫 접점/다음 활용은 기존 occurrence 및 장면에 맞춰 선택한다. 대학생은 수업·시험·공동 과제·진로 탐색·참여 비용을 우선한다. 직장인·프리랜서·사업자는 기존 직무별 장면과 실제 역할/보상/의뢰/운영 맥락을 쓴다. 이름·무작위·해시는 문장 선택에 사용하지 않는다.
- [annualInteractionReading.ts](../../../src/lib/interpretation-v4/annualInteractionReading.ts): 원장 ID·참여 지지·원국 위치·상대 세운·활성 대운·확정 여부 검증은 유지한다. 일지에서 연애 장면을 자동 추정하는 경로를 없앴다. 보조 관계도 기존 검증 의미로 설명하고, 접점과 긴장이 함께 있으면 긴장의 조정 기준을 월 주제에 적용한다. 같은 달의 실제 관계 ID만 사용한다. 충=실패, 합=성공을 예언하지 않는다.
- [annualMonthNarrative.ts](../../../src/lib/interpretation-v4/annualMonthNarrative.ts): 월간/월지 본기·일간·간지·십성을 보존하면서 십성 의미에 맞는 소개로 바꿨다. 이미 meaning에서 설명한 사전식 정의는 다시 넣지 않고, 배정된 원국 연결과 proof를 유지한다. 업무·학습 문단 중간의 친밀감 gift 급전환을 막았다. 귀인/표현 등 실제 월 기회와 유용한 생활 장면은 유지한다.
- [annualEvidenceReading.ts](../../../src/lib/interpretation-v4/annualEvidenceReading.ts): 생성 절차를 설명하는 접두사를 자연스러운 타고난 성향 안내로 바꿨다. 원국/기간/MBTI 묶음은 유지한다. 기존 `INTJ:expertise_income_path`가 대학생에게 배정된 경우 같은 원천 trait·root·proof를 공부/진로 적용으로 실현한다. MBTI DB나 Fusion 계산 변경이 아니다.
- [annualComposer.ts](../../../src/lib/interpretation-v4/annualComposer.ts): 현재 상황이 미래에도 지속된다고 가정하지 않는 예시 안내를 넣었다. 기간의 양 끝을 정확한 KST 시각/직전까지로 표시해 입춘 당일이 겹쳐 보이는 표현을 정리했다.

## 실제 원고와 전체 12개월 비교

[12개월 모든 문단 전후 비교](monthly-comparison.md), [수정 전 전체 해설](han-yerin-before.txt), [수정 후 전체 해설](han-yerin-after.txt), [측정 원자료](measurements.json).

H는 한예린(2000-12-14 11:50, 여성, INTJ, student, 2026)이다. 기존 감사 A/B/C는 `majorEditorialSafetyFixtures.ts`의 도윤(온라인 교육사업/INFJ), 서진(B2B SaaS 영업기획/ENTJ), 서윤(브랜드 디자인 프리랜서/ENFP) 입력을 그대로 재사용했다. D/E/F는 A 기반 시간 미상/MBTI 미상/둘 다 미상이다. H의 세 가지 미상 변형도 별도 검증했다. H와 A/B/C의 모든 월을 직접 읽고, 문단 간 주제·장면·최종 판단 기준을 점검했다.

| 월 | 십성 | 수정 후 실제 판단의 역할 | 독해 판정 |
|---|---|---|---|
| 1 | 상관 | 교재와 실제 조건의 차이를 작은 대안으로 시험, 파의 절차 재확인 | 연결됨 |
| 2 | 편재 | 전공 밖 쓰임/직접 맡을 역할/참여 비용, 반합의 미확인 부분 | 연결됨 |
| 3 | 정재 | 준비비·생활비·배울 예산, 형의 반복 부담을 지출/여유 기준으로 | 연결됨 |
| 4 | 편관 | 시험·과제의 첫 판단/도움 기준, 반합과 형을 함께 반영 | 연결됨 |
| 5 | 정관 | 모임의 기한/완료 결과, 반합을 완전한 역할 합의로 확대하지 않음 | 연결됨 |
| 6 | 편인 | 수업 뒤 가정을 사례로 비교, 충의 시간 조정 | 연결됨 |
| 7 | 정인 | 막힌 개념 질문/과제 적용, 해의 설명 차이와 육합의 접점 구분 | 연결됨 |
| 8 | 비견 | 스스로 고를 주제/도움받을 몫, 삼합과 독립적 판단 양립 | 연결됨 |
| 9 | 겁재 | 공동 과제의 실력·기여·비용, 형의 부담과 육합의 접점 구분 | 연결됨 |
| 10 | 식신 | 발표·실습의 작은 완성/마무리 일정, 반합과 충 동시 설명 | 연결됨 |
| 11 | 상관 | 다른 과제 풀이를 보여주고 반응 확인, 확정 지지 관계를 만들지 않음 | 연결됨 |
| 12 | 편재 | 외부 활동의 시간·비용·배울 내용 중 감당할 경험 선택 | 연결됨 |

### 집중 월의 실제 행동 문장

#### 2월 · 편재

| 수정 전 | 수정 후 |
|---|---|
| 이 달에서 가져갈 한 가지 · ‘가까운 사람과 정하는 약속’에 관해 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요. 피할 것 · ‘가까운 사람과 정하는 약속’에서 뜻이 맞는 일부를 전체 합의로 보는 것. | 이 달에서 가져갈 한 가지 · 관심 분야 밖의 현직자에게 배운 것을 어디에 쓰는지 묻고, 직접 맡아볼 역할과 참여 비용을 확인해보세요. 연결 가능성은 열어두되 ‘직접 맡을 역할과 참여 비용’ 중 아직 모르는 부분은 작은 시도로 확인해보세요. 피할 것 · 흥미로운 소개만 듣고 경험의 범위도 모른 채 참여하는 것. |

수정 후 근거 해설: 2월 절입 뒤 구간을 보면 원국 일지 午·시지 午, 월운 지지 寅 사이의 寅·午 반합은 일부가 맞닿는 접점이며, 완성된 합의까지 뜻하지는 않아요. 실제 선택에서는 낯선 제안에서 무엇을 직접 경험할 수 있는지 살펴보는 데 참고할 만해요.

근거 ID: `month-v2:2026:2:2:month:2026:2:branch:반합:寅午`.

#### 4월 · 편관

| 수정 전 | 수정 후 |
|---|---|
| 이 달에서 가져갈 한 가지 · ‘빠르게 판단해야 할 책임’에 관해 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요. 피할 것 · ‘빠르게 판단해야 할 책임’에서 뜻이 맞는 일부를 전체 합의로 보는 것. | 이 달에서 가져갈 한 가지 · 시험이나 과제에서 먼저 판단할 한 가지와 도움을 청할 기준을 적어보세요. 같은 부담이 되풀이된다면 ‘판단할 범위와 책임을 넘길 시점’을 다시 정해보세요. 피할 것 · 긴장한 채 모든 문제를 혼자 풀어야 한다고 여기는 것. |

수정 후 근거 해설: 4월 절입 뒤 구간을 보면 원국 월지 子, 월운 지지 辰 사이의 辰·子 반합은 일부가 맞닿는 접점입니다. 한편 원국 연지 辰, 월운 지지 辰 사이의 辰·辰 형은 되풀이되는 부담을 살필 조건입니다. 실제 선택에서는 어떤 판단을 먼저 하고 어디서 도움을 청할지 살펴보는 데 참고할 만해요.

근거 ID: `month-v2:2026:4:2:month:2026:4:branch:반합:辰子`, `month-v2:2026:4:2:month:2026:4:branch:형:辰辰`.

#### 5월 · 정관

| 수정 전 | 수정 후 |
|---|---|
| 이 달에서 가져갈 한 가지 · ‘공식적으로 맡길 수 있는 역할’에 관해 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요. 피할 것 · ‘공식적으로 맡길 수 있는 역할’에서 뜻이 맞는 일부를 전체 합의로 보는 것. | 이 달에서 가져갈 한 가지 · 모임에서 맡은 일의 기한과 완료 기준을 확인하고 끝낸 결과를 남겨보세요. 연결 가능성은 열어두되 ‘맡은 역할과 완료 기준’ 중 아직 모르는 부분은 작은 시도로 확인해보세요. 피할 것 · 성실해 보이려고 지키기 어려운 약속까지 받는 것. |

수정 후 근거 해설: 5월 절입 뒤 구간을 보면 乙酉 대운의 지지 酉, 월운 지지 巳 사이의 巳·酉 반합은 일부가 맞닿는 접점입니다. 실제 선택에서는 믿고 맡길 수 있다는 말을 어떤 결과로 보여줄지 살펴보는 데 참고할 만해요.

근거 ID: `month-v2:2026:5:2:month_dayun_branch:3:반합:巳酉`.

#### 10월 · 식신

| 수정 전 | 수정 후 |
|---|---|
| 이번 달 한 가지 · 생각해둔 것을 작게라도 완성해서 보여주세요. 피할 것 · 새로 시작하는 재미 때문에 완성을 미루는 것. | 이번 달 한 가지 · 발표나 실습에서 배운 것을 보여줄 작은 결과 하나를 완성해보세요. 기존 일정과 겹친다면 ‘완성할 범위와 마무리 순서’를 먼저 조정해보세요. 피할 것 · 아이디어를 더 보태느라 보여줄 결과를 끝내지 못하는 것. |

수정 후 근거 해설: 10월 절입 뒤 구간을 보면 원국 일지 午·시지 午, 월운 지지 戌 사이의 戌·午 반합은 일부가 맞닿는 접점입니다. 한편 원국 연지 辰, 월운 지지 戌 사이의 辰·戌 충은 일정과 역할을 조정할 조건입니다. 실제 선택에서는 배운 것을 어디까지 실제 결과로 보여줄 수 있는지 살펴보는 데 참고할 만해요.

근거 ID: `month-v2:2026:10:2:month:2026:10:branch:반합:戌午`, `month-v2:2026:10:2:month:2026:10:branch:충:辰戌`.

#### 12월 · 편재

| 수정 전 | 수정 후 |
|---|---|
| 이번 달 한 가지 · 기존 일정 옆에 ‘가까운 사람과 정하는 약속’을 놓고 바꿀 순서와 담당자를 정해보세요. 피할 것 · ‘가까운 사람과 정하는 약속’ 때문에 계획을 조정하는 일을 실패로 단정하는 것. | 이번 달 한 가지 · 외부 활동의 시간·비용·배울 내용을 나란히 놓고, 지금 감당할 경험 하나를 골라보세요. 기존 일정과 겹친다면 ‘투입할 시간과 얻을 경험’을 먼저 조정해보세요. 피할 것 · 기회를 놓치기 싫어서 수업과 생활에 쓸 여유까지 채우는 것. |

수정 후 근거 해설: 12월 절입 뒤 구간을 보면 원국 일지 午·시지 午, 월운 지지 子 사이의 子·午 충은 일정과 역할을 조정할 조건입니다. 한편 원국 연지 辰, 월운 지지 子 사이의 子·辰 반합은 일부가 맞닿는 접점입니다. 실제 선택에서는 제안들 가운데 시간과 비용을 감당할 선택이 어느 것인지 살펴보는 데 참고할 만해요.

근거 ID: `month-v2:2026:12:2:month:2026:12:branch:반합:子辰`, `month-v2:2026:12:2:month:2026:12:branch:충:子午`.

2월은 외부 경험의 실제 범위, 4월은 판단과 책임의 끝, 5월은 역할의 완료 기준으로 질문이 달라진다. 10월은 일지·시지 午–戌의 반합과 연지 辰–戌의 충을 서로 다른 위치로 표시한다. 반합이 충을 없앤다는 주장을 하지 않고, 발표의 완성 가능성과 일정 조정을 함께 본다. 12월의 조언은 앞서 설명한 편재·외부 활동·시간/비용 선택에서 벗어나지 않는다. 이 추가 정보는 지지 쌍마다 새로운 사건 의미를 창작한 결과가 아니라, 기존 관계 의미를 실제 월 주제에서 확인할 기준으로 제한한 결과다.

### 개인화와 근거 출처

동일한 한예린 원국/MBTI에 jobStatus만 바꾼 통제 입력도 확인했다. 월간지·십성·관계는 모두 같고, 적용 장면/행동만 달라진다.

- H: 외부 활동의 시간·비용·배울 내용을 나란히 놓고, 지금 감당할 경험 하나를 골라보세요. 기존 일정과 겹친다면 ‘투입할 시간과 얻을 경험’을 먼저 조정해보세요.
- H-employee: ‘밖에서 만난 사람과 내 경험의 쓰임을 이야기하는 대화’ 같은 장면이라면 새로 만난 사람에게 내 솜씨가 어디에 필요한지 물어보세요. 기존 일정과 겹친다면 ‘투입할 시간과 얻을 경험’을 먼저 조정해보세요.
- H-freelancer: ‘내 기술을 다른 곳에서도 쓸 수 있을지 알아보는 만남’ 같은 장면이라면 새로 만난 사람에게 내 솜씨가 어디에 필요한지 물어보세요. 기존 일정과 겹친다면 ‘투입할 시간과 얻을 경험’을 먼저 조정해보세요.
- H-business_owner: ‘다른 사업자의 경험을 내 상품과 연결하는 대화’ 같은 장면이라면 새로 만난 사람에게 내 솜씨가 어디에 필요한지 물어보세요. 기존 일정과 겹친다면 ‘투입할 시간과 얻을 경험’을 먼저 조정해보세요.

대학생의 기존 수입 전문성 문단은 “시간을 파는 데서 판단과 해법의 값을 받는 쪽”에서 다음 적용으로 바뀌었다:

> 시기를 지나며 무엇을 고르는지에는 평소의 성향도 드러납니다. INTJ는 남이 쉽게 대신하지 못할 실력의 값을 중요하게 보는 편입니다. 타고난 편재의 현실적인 감각과 함께, 배운 것이 어디에 쓰일지도 궁금해할 수 있어요. 공부와 진로 탐색에서는 여러 활동에 이름을 올리기보다 직접 풀어본 문제와 익힌 방법을 남겨볼 만합니다. 당장 수입으로 이어지지 않아도 다음 경험을 고르는 기준이 될 수 있어요.

같은 원국/MBTI 근거: `SajuCalcResult:tenGods.distribution:偏財`, `calendar:saju-calendar-kst-v2`, `content-synthesis:reinforce:inferred`, `mbti:INTJ:traits:money:expertise_income_path`, `sajuKnowledgeBase:ten_god_pian_cai`, `src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport`, `v4-content-synthesis-13b-1`, `v4:material-depth:ten_god_pian_cai`, `v4:semantic-meaning:ten_god_pian_cai`. 원국 feature `ten_god_pian_cai`. 해당 블록 proof와 실제 MBTI/Fusion integration digest는 Base와 동일하다.

## 반복과 분량 측정

공백 포함 실제 본문 문자열만 합산했다. 표지·제목·목차·만세력·기본 MBTI 표·부록·문단 구분용 개행은 제외한다. 상품/장면 설명을 반복 보관하는 `months.action` 메타데이터도 중복 합산하지 않는다.

| 문구 | H 수정 전 | 수정 후 |
|---|---:|---:|
| 일간을 기준으로 월간을 읽으면 | 12 | 0 |
| 뜻이 맞는 일부를 전체 합의로 보는 것 | 3 | 0 |
| 부담을 참고 버티는 일로만 푸는 것 | 2 | 0 |
| 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요 | 3 | 0 |

요청에 적힌 6회/4회와 달리, 지정 Base·H·평가 시각의 **본문 단독**에서는 각각 3회/2회였다. 본문에 action 메타데이터까지 함께 합산하면 6회/4회가 된다. 비교에서는 실제 고객 Book의 본문 기준을 유지했다. A의 합의 단정은 6→0, B의 참고 버티기는 4→0으로 감소한다.

| 입력 | 본문 글자 수 전→후 | 문단 전→후 | 월 수 |
|---|---:|---:|---:|
| H | 10,125 → 10,509 | 85 → 83 | 12 → 12 |
| A | 10,442 → 11,546 | 85 → 84 | 12 → 12 |
| B | 10,362 → 11,226 | 85 → 84 | 12 → 12 |
| C | 10,754 → 11,629 | 88 → 86 | 12 → 12 |
| D | 10,940 → 11,912 | 89 → 88 | 12 → 12 |
| E | 9,751 → 10,883 | 81 → 80 | 12 → 12 |
| F | 10,094 → 11,094 | 84 → 83 | 12 → 12 |
| H2025 | 10,047 → 10,602 | 83 → 82 | 12 → 12 |
| H2027 | 11,948 → 11,453 | 97 → 92 | 12 → 12 |
| C2028 | 12,333 → 12,449 | 100 → 95 | 12 → 12 |

문단을 늘리지 않고 중복 정의를 줄였다. 일부 본문은 관계 설명·실행 조건이 구체화되어 길어졌지만 분량을 품질의 근거로 삼지 않는다.

남는 반복을 구분한다:

- **정당한 공통 설명:** 실제로 같은 십성의 기본 성격, 같은 충/형/반합의 제한된 뜻은 재사용한다. 같은 원국/관계에는 같은 설명이 가능하다. 이를 고객마다 새로운 명리 의미로 만들지 않았다.
- **개선된 의미 반복:** 합의만 확인하던 2·4·5월은 외부 역할/비용, 시험의 판단/책임, 모임 완료 기준으로 나뉜다. 두 번째 편재는 제안 탐색에서 감당할 선택으로, 두 번째 겁재·정인은 기여 소개/지식 전달로 이동한다. 유의어 치환에 그치지 않는다.
- **남은 MINOR:** “실제 선택에서는 … 살펴보는 데 참고할 만해요”, “기존 일정과 겹친다면 …” 같은 연결 틀이 남는다. H의 충 3개 달에서는 동일 종류의 일정 조정을 쓰지만 확인 대상은 가정/조사 시간, 완성 범위/순서, 투입 시간/경험으로 다르다. 월별 문체가 완전히 독립적이라고 주장하지 않는다. 전문 용어·한자 밀도도 남는다.
- A/B/C/H의 동일 긴 문장 중복은 전후 모두 0이다. 기존에도 조사/장면만 달라 완전 일치 검사는 통과했던 의미 반복이 이번 수정의 대상이었다. 문자열 0회를 정보 품질 PASS의 단독 이유로 쓰지 않았다.

## 계산·절기·미상·Book 보호

13개 실제 세운 생성(H, A~F, H의 직장인/프리랜서/사업자, H2025, 오프라인 H2027/C2028)의 `calculations + evidence + materials + integration` digest가 **모두 Base와 동일**하다. 신규 회귀 lock은 수정 전 실제 결과에서 만들었고 수정 후 값으로 갱신하지 않았다. 기존 근거 ID·대운 전환·12개월·원국/기간 구분·MBTI/Fusion 계산은 변경하지 않았다.

- 입춘 `2026-02-04 05:02:08 KST` 전후 ±1초: 己丑/庚寅, 乙巳/丙午 경계 보존. 연간 안내도 경계 시각 직전/부터로 맞춰 같은 2월 4일 전체를 양쪽에 적용하지 않는다.
- 12개 실제 Jie 경계 전후, C2028 대운 전환 `2028-04-23 21:42 KST` 전후 및 기존 가능 범위 안전성 회귀를 재사용했다. focus 관계는 focus 원장에, 다음 절입/전환 안내는 그 다음 구간 원장에 연결된다.
- 달력월의 1일을 절기월 시작으로 바꾸지 않았다. 기존 월 경계 설명·Book 기간표·정확한 구간 데이터는 불변이다.
- 과거 H2025는 회고, H2027/C2028은 `policyDate`를 명시한 오프라인 시뮬레이션이다. 실제 평가 시각의 2027 생성은 기존 `SELECTED_YEAR_INVALID`로 차단된다. 운영 제한을 변경하지 않았다.
- H 및 D/E/F의 시간/MBTI 미상에서는 시주·MBTI 근거를 추정하지 않는다. 조건부 대운을 확정 대운으로 서술하지 않는다. 입력받지 않은 과거 사건을 사실로 추가하지 않는다.
- H/A~F 동일 입력 재생성의 전체 결과 일치, 신규 Book 본문 무손실 projection, JSON snapshot 저장/owner·shared 복원, H 전체 Book 페이지 SSR 확인.
- **수정 전 Book 10개**를 수정 후 코드로 owner/shared 복원했다. snapshot 바이트 digest·Book digest가 불변이며 재생성 없이 이전 문장을 그대로 읽는다. 운영의 과거 유료 Book에 접근하거나 수정하지 않았다.

다른 5상품의 실제 V4 원고/draft·전체 근거 packet·Book 3개 digest도 각각 Base와 동일하다. 대상은 RUNTIME_FIXTURES의 comprehensive/career/love/compatibility/major이며, 각 digest는 `annualReaderQualityLocks.json`에 남겼다. 따라서 별도 개선 브랜치의 결과를 혼합한 회귀가 아니다.

## 공통 부록: 원인 확인만

한예린 Book의 관대/제왕/태는 모두 “일간과 지지의 관계를 성장의 단계에 빗대어 보는 이름.”이라는 동일 설명을 갖는다. [bookProjection.ts:73](../../../src/app/dev/book-preview/bookProjection.ts#L73)은 canonical natal 표의 십이운성을 가져와 개별 뜻 대신 공통 뜻을 배정한다. 76행의 개별 stage meaning 적용은 `saju_mbti_full` 전용이다. [BookReader.tsx:30](../../../src/app/dev/book-preview/BookReader.tsx#L30)은 동일 설명을 공통 안내 한 줄로 합쳐 각 항목의 개별 설명을 생략한다. 계산 누락이 아니라 공통 부록 설명/projection 문제다. 이번에는 두 파일 모두 변경하지 않았다. 6상품 통합 단계의 별도 공통 수정 항목으로 기록한다.

## 자동 검증과 기준선

| 검사 | Base | 수정 후 |
|---|---|---|
| 기존 관련 9 suites / 207 tests | 203 PASS / 4 FAIL | 203 PASS / 동일 4 FAIL |
| 신규 독자 품질 회귀 | — | 35 PASS |
| 실제 원고/보호 상품 capture | 19 PASS | 19 PASS |
| 수정 전 저장 Book 복원 | — | 11 PASS (10 Books + 결과 저장) |
| lint | PASS | PASS |
| TypeScript 전체 | 389 | 390 |
| TypeScript 소스 진단 | 389 | 동일 389 / 추가·제거 0 |
| webpack build | FAIL | FAIL / 같은 Page export 유형 |
| git diff --check | PASS | PASS |

최종 소스에서 신규 회귀+기존 annualEditorialQuality+annualNarrative를 다시 실행해 **74 PASS / 0 FAIL**을 확인했다. 새 회귀 35건을 포함한 수치이므로 위 결과와 중복 합산하지 않는다.

TS의 전체 1건 차이는 깨끗한 worktree의 검사 이후 build가 생성한 `.next/types/app/report/new/page.ts` Page export 진단이다. 행/열 이동을 정규화한 **소스 경로·코드·메시지 multiset은 완전히 동일**하다. 새 소스/테스트 진단은 0이며 전체 TS PASS로 보고하지 않는다.

기존 4 FAIL은 `bookAnnualPreflight.test.ts`의 expected400/actual403 1건과 `bookReading13b.test.tsx` career/love/compatibility의 앞·뒤 목차 비교 3건이다. Base와 수정 후 이름·실패 원인이 동일하다. 이를 통과시키기 위해 결제/권한/Book 공통 코드를 수정하지 않았다.

Build는 Google Fonts 접근을 허용한 동일한 로컬 `npm run build -- --webpack`으로 비교했다. 양쪽 모두 컴파일 성공 후 `src/app/report/new/page.tsx`의 허용되지 않는 named export에서 중단한다. Base 로그는 `getAsiaSeoulCurrentYear`, after는 `getAnnualFortuneYearOptions`를 첫 오류로 출력했지만 두 export 모두 Base에 존재하고 이번 diff에서 해당 파일은 불변이다. 같은 Page export 문제이며 신규 유형이 아니다. NFT 단계에 도달하지 않아 NFT 경고 0개라고 주장하지 않는다. 빌드 실패 때문에 Production 배포 준비 완료로 판정하지 않는다.

재현:

```sh
npx vitest run tests/unit/interpretation-v4/annualReaderQuality.test.ts tests/unit/interpretation-v4/annualEditorialQuality.test.ts tests/unit/interpretation-v4/annualNarrative.test.ts --fileParallelism=false
npx vitest run tests/unit/interpretation-v4/annualSafety.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/report-generation/annualMonthJie.test.tsx tests/unit/report-generation/annualMonthlyRelationFacts.test.tsx tests/unit/app/bookPublicFlow.test.tsx tests/unit/app/dev/bookReading13b.test.tsx tests/unit/api/bookAnnualPreflight.test.ts --fileParallelism=false --hookTimeout=120000
npm run lint
npx tsc --noEmit --incremental false
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack
git diff --check
```

실제 원고·계산 packet·Book·수정 전 snapshot·전체 로그는 `/tmp/gyeol-annual-reader-validation/`에 보관했다. `before/after`, `capture-verified.log`, `reader-tests-verified.log`, `tests-before.log`, `tests-verified.log`, `final-target-tests.log`, `old-books.log`, `typescript-comparison.json`, `build-before.log`, `build-verified.log`, `preservation.json`을 확인할 수 있다. 핵심 실제 본문과 비교·측정·재발 방지 테스트/locks는 이 브랜치에 남긴다.

## 판정과 종료

| 요청 항목 | 결과 |
|---|---|
| STRUCTURE | PASS — 계산/발행 구조 불변 |
| 12_MONTHS | PASS — 전 입력 12개월 |
| ANNUAL_NARRATIVE | PASS — 실제 유료 생성 경로, 연간/월별 원고 확인 |
| MONTH_DIFFERENTIATION | PASS — 같은 반합에도 다른 월 판단 질문 |
| MONTH_EVIDENCE_CONNECTION | PASS — 관계 참여 요소·출처·ID 검증 유지 |
| MONTH_ACTION_RELEVANCE | PASS — 2/4/5/10/12월 및 A/B/C 전체 독해 |
| SEMANTIC_REPETITION | 개선 PASS / 정당한 공통 개념과 MINOR 정형 표현 잔존 |
| CURRENT_STATUS_PERSONALIZATION | PASS — student/employee/freelancer/business 분리 |
| MYEONGLI_EVIDENCE_INTEGRITY | PASS — 13개 전체 불변 digest |
| MBTI_FUSION_PRESERVATION | PASS — DB/계산/integration 불변 |
| SOLAR_TERM_SAFETY | PASS — 입춘/Jie/전환 구간 보존 |
| KOREAN_READABILITY | 확인된 문장 결합/정형 소개/주제 급전환 개선, 용어 밀도 MINOR |
| NARRATIVE_LENGTH | measurements.json — 본문만 공백 포함, 분량 자체로 판정하지 않음 |
| UNKNOWN_INPUT_SAFETY | PASS — H 세 변형 및 D/E/F |
| DETERMINISTIC_GENERATION | PASS |
| BOOK_PRESERVATION | PASS — 로컬 신규/기존 저장본 복원; 운영 접근 UNVERIFIED |
| CROSS_PRODUCT_REGRESSION | PASS — 다른 5상품 draft/evidence/Book 동일 |
| APPENDIX_COMMON_ISSUE | 확인/미수정 — 관대/제왕/태 개별 설명 |
| TESTS | 신규 35 PASS; 기존 203 PASS/동일 4 FAIL; capture19/oldBook11 PASS |
| LINT_BUILD | lint PASS / build FAIL; 새 소스 TS 진단 0; diff-check PASS |
| BRANCH | v4/annual-fortune-reader-quality-polish-01 |
| COMMIT_SHA | 이 보고서를 포함한 커밋 — git log 및 최종 응답 참조 |
| REMOTE_SHA_MATCH | push 후 실제 ls-remote 결과를 최종 응답에 보고 |
| REMAINING_ISSUES | 기존 build/TS/API/Book 검사, 공통 부록, MINOR 문체, 운영 미검증 |
| RELEASE_QUALITY | PARTIAL — 독자 원고 범위 개선 PASS, 전체 판매/배포 승인과 구분 |

master merge/push, Production 배포, 운영 DB 변경, 실결제·환불, 다른 상품 개선/다음 Phase는 실행하지 않았다.
