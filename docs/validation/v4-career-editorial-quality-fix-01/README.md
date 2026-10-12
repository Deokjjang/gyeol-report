# V4-CAREER-EDITORIAL-QUALITY-FIX-01

커리어 생성 경로만 개선했습니다. A~F의 9장·36문단, 실제 근거 연결, 동일 입력 결정론성 및 이전 Book 재열람은 통과했습니다. 최종 판매 품질은 **PARTIAL**입니다. 아래에 남은 공통 문체·반복과 기존 검증 장애를 명시합니다. 자동 테스트 결과를 전체 판매 품질의 PASS로 해석하지 않습니다.

## 기준과 작업 격리

- 기준: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`. 원격 기준 SHA 일치 확인 후 독립 worktree `/tmp/gyeol-career-editorial-quality-fix-01`에서 작업.
- 작업 브랜치: `v4/career-editorial-quality-fix-01`. 종합 브랜치 병합 없음.
- 고정 평가 시각: `2026-10-12T12:00:00+09:00`. 실제 `generateV4ShadowReport → buildV4CareerProduct → renderCareerRelease → projectBook` 실행. `src/lib/book/paidRuntime.ts`에서 사용하는 결정론적 V4 생성 함수와 같은 경로입니다.
- 결제, DB 저장, 외부 AI 호출, 운영 게이트 변경 없음. 실제 고객의 Production 발행·로그인·결제 테스트를 했다는 의미는 아닙니다.
- 입력 스키마의 기존 contentVersion 필드와 관계없이 명시적인 V4 생성 함수를 호출하고 V4 evidence 및 Book을 검증했습니다.
- 원래 작업 공간의 수정 2파일 및 `supabase/.temp/` 9파일, 총 11개 변경 보존. 원래 작업 공간의 추적/보호 파일 1857개 해시 비교: 변경 0개. branch/HEAD/status도 동일.

## 원인과 변경 범위

1. 36문단 계약은 `CAREER_READER_CHAPTERS`의 9장×4문단에 명시돼 있습니다. 35문단은 의도된 편집이 아닙니다. 위험 근거도 긍정 문단과 같은 facet 사용 상한(4회) 및 같은 장 제외를 적용했고, A는 유효한 fact-bomb facet이 정확성으로 좁아 CH08.P3 후보가 소진됐습니다. 동일 문장이 있으면 문단 전체를 탈락시키는 기존 안전장치는 유지합니다. 위험 문단은 같은 검증 근거를 질문별로 재사용할 수 있도록 하고, 미상 입력에 위험 후보가 없으면 실제 shadowMeaning이 있는 강점의 과사용을 조건부로 설명합니다.
2. 직업 입력은 기존 normalizer가 식별한 workFunction으로 연결합니다. 실제 signed facet이 허용한 장면만 선택합니다. 개발/디자인/영업의 착수·적용·학습·다음 선택을 다르게 설명합니다. 지원 장면이 없는 직업/facet은 기존 일반 장면을 사용합니다.
3. 추천 점수·후보·순서·DB·proof는 그대로 두고, 신규 V4 커리어에서만 탐색 후보로 표시합니다. legacy 호출의 기본 문구도 보존합니다.
4. 재물 장은 실제 원국의 재성 위치와 정재/편재 의미를 구분하고, 직업 능력의 경제적 효용·비용·자원 관리 질문을 분리합니다. 고용 형태가 없는 A에는 사업 운영·매출·연봉을 전제하지 않습니다.
5. 원천 DB의 완성되지 않은 반말 문장 직접 삽입을 줄이고, 실제 주석의 축·방향과 기존 human surface, 기존 학업 bridge/remedy를 조합합니다. 명사 인용에는 종결어미를 넣지 않습니다.
6. Fusion TENSION은 실제 출처별 conditionSplit.sides를 사용합니다. 명리→첫 조건/MBTI→둘째 조건을 고정하지 않아 B의 유지/시작 조건 역전을 방지합니다.

생성 source 변경은 6파일입니다: `careerReleaseRenderer.ts`, 신규 `careerQualityApplications.ts`, `careerReleaseSources.ts`, `careerReleaseContracts.ts`, `careerProductAdapter.ts`, `careerRecommendations.ts`. 모두 `src/lib/interpretation-v4/` 아래 커리어 전용 경로입니다. 계산 엔진·MBTI DB·Fusion 계산·공통 편집 엔진은 수정하지 않았습니다.

## 실제 생성 구조와 분량

측정은 표지·목차·표·제목을 제외한 실제 readerEdition 문단 본문만 사용합니다. bodyLength는 기존 계약대로 문단 사이 `\n\n`을 포함합니다. 순수 문단 합계도 별도 제시합니다. 분량으로 품질을 판정하지 않았습니다.

|사례|입력 / 일간 / 상태|전 문단 수|후 문단 수|전 bodyLength|후 bodyLength|문단 텍스트 합계|품질 진단|
|---|---|---:|---:|---:|---:|---:|---|
|A|박도윤 / 乙 / ISTJ / 개발자 / 고용 형태 미상|35|36|9,424|9,625|9,555|없음|
|B|서윤 / 戊 / ENFP / 브랜드 디자이너 / freelancer|36|36|9,856|9,859|9,789|없음|
|C|서진 / 甲 / ENTJ / B2B SaaS 영업기획 / employee|36|36|9,733|9,734|9,664|없음|
|D|박도윤 / 乙 / ISTJ / 개발자 / 고용 형태 미상 / 시간 미상|32|36|8,642|9,819|9,749|없음|
|E|박도윤 / 乙 / 모름 / 개발자 / 고용 형태 미상 / MBTI 미상|31|36|8,443|9,996|9,926|없음|
|F|박도윤 / 乙 / 모름 / 개발자 / 고용 형태 미상 / 시간 미상 / MBTI 미상|31|36|8,593|10,089|10,019|BODY_LENGTH|

A/B/C는 8,000~10,000자 참고 목표 안입니다. F는 10,089자로 BODY_LENGTH advisory가 남습니다. 미상 입력에 길이를 강제하지 않았으며 존재하지 않는 MBTI·시주 근거를 보충하지 않았습니다. 모든 사례의 publication hard error는 0입니다.

|장 / 제목|A 전→후 문단|A 전→후 글자|B 전→후 글자|C 전→후 글자|
|---|---|---:|---:|---:|
|CH01 나는 어떻게 일하는 사람인가|4→4|1033→1027|1039→1031|1052→1035|
|CH02 나만의 강점과 숨은 재능|4→4|1057→1025|1034→1032|1039→1033|
|CH03 적성과 잘 맞는 직업|4→4|1138→1255|1139→1330|1091→1309|
|CH04 직장과 조직생활|4→4|1128→1136|1117→1172|1110→1180|
|CH05 지금의 커리어와 다음 선택|4→4|1030→985|1057→960|1023→1016|
|CH06 돈을 버는 힘과 재물 관리|4→4|1166→1046|1189→1054|1198→1000|
|CH07 학업과 실력 향상|4→4|1004→981|1048→1003|1028→984|
|CH08 성공 가능성과 아픈 팩폭|3→4|757→1032|1160→1139|1092→1024|
|CH09 나만의 커리어 전략|4→4|1043→1068|1003→1068|1030→1083|

D/E/F 전 문단 배열: D `[4, 4, 4, 3, 4, 3, 4, 3, 3]`, E `[4, 4, 4, 3, 4, 3, 3, 3, 3]`, F `[4, 4, 4, 3, 4, 3, 4, 3, 2]`; 후는 모두 `[4,4,4,4,4,4,4,4,4]`입니다.

전체 변경 전후 본문: [A 전](A-before.txt) / [A 후](A-after.txt), [B 전](B-before.txt) / [B 후](B-after.txt), [C 전](C-before.txt) / [C 후](C-after.txt), [D 전](D-before.txt) / [D 후](D-after.txt), [E 전](E-before.txt) / [E 후](E-after.txt), [F 전](F-before.txt) / [F 후](F-after.txt). 생략·사후 교정 없이 실제 생성 원문을 저장했습니다.

## 9개 장의 실제 수정 사례

### CH01.P1 / 나는 어떻게 일하는 사람인가

수정 전:

> 일에서는 빠진 조건을 찾아내는 정확성이 먼저 드러나며, 명리에서 읽은 ‘필요한 것과 필요 없는 것을 가르고 기준을 세우는 기운입니다’의 뜻과 연결됩니다. 숫자가 맞지 않거나 전달받은 요구가 서로 다를 때, 어디서 어긋났는지 좁혀 보는 작업에서 이 힘이 드러납니다.

수정 후:

> 일에서는 빠진 조건을 찾아내는 정확성이 먼저 드러나며, 명리에서 읽은 ‘필요한 것과 필요 없는 것을 가르고 기준을 세우는 기운’의 뜻과 연결됩니다. 개발 과제라면 요구사항과 실제 동작을 나란히 놓고, 정상 입력에서 보이지 않던 오류를 테스트로 확인하는 데 이 눈을 쓸 수 있습니다.

후 근거: evidenceIds `foundation:element:METAL:BALANCED`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH02.P4 / 나만의 강점과 숨은 재능

수정 전:

> 재능을 실력으로 만들려면 약속한 과제가 실제로 끝난 변화를 실제 과제에서 보여 줄 수 있어야 합니다. 먼저 시작하는 힘에 멈춰 확인할 지점을 고르는 판단을 더하면, 속도가 빨라도 품질과 안전을 놓치지 않는 실행력을 만들 수 있습니다.

수정 후:

> 첫 번째 재능인 쓸모와 비용을 함께 보는 현실감각을 발전시키려면, 이번 과제에서 그 능력이 바꿀 결과를 먼저 정하세요. 연습에서는 ‘줄인 비용과 그 때문에 포기한 결과를 함께 비교하기’를 해보고, 잘한 부분과 다음에 달리할 부분을 나누어 남길 만합니다.

후 근거: evidenceIds `natal:ten-god:day:MAIN:己`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH03.P2 / 적성과 잘 맞는 직업

수정 전:

> 1순위 · 개발·연구·자료 조사·전문 분야 분석 — 원인을 바로 알기 어려운 일을 조사하는 방향도 후보입니다. 화개살에서 볼 수 있는 장점을 원인이 분명하지 않은 문제를 나누어 조사하고 설명하는 일에 쓰는 방향이에요. 자료를 대조하고 왜 달랐는지 묻는 작은 조사 과제부터 해보면 오래 파고드는 관심이 실제 업무에서도 편한지 알 수 있습니다. 새로 배우는 분야라면 바로 전문가라는 이름을 붙이기보다 확인할 자료와 물어볼 사람이 있는 출발점이 어울립니다.

수정 후:

> 탐색 후보 · 개발·연구·자료 조사·전문 분야 분석 — 원인을 바로 알기 어려운 일을 조사하는 방향도 후보입니다. 화개살에서 볼 수 있는 장점을 원인이 분명하지 않은 문제를 나누어 조사하고 설명하는 일에 쓰는 방향이에요. 새로 배우는 분야라면 바로 전문가라는 이름을 붙이기보다 확인할 자료와 물어볼 사람이 있는 출발점이 어울립니다. 이유를 묻는 것 자체를 느리다고 취급하는 곳에서는 필요한 역량이 있어도 쓰기 어려울 수 있으니, 역할과 환경을 함께 대조하세요.

후 근거: evidenceIds `없음`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH04.P3 / 직장과 조직생활

수정 전:

> 잘하고 싶은 마음이 커서 완성도를 너무 신경 쓰다 시작이나 마감이 늦어지기도 합니다. 사소한 흠까지 같은 무게로 다루면 중요한 검토의 시간이 줄고, 이미 충분한 결과를 넘길 때에도 마음이 걸릴 수 있습니다. 다음 협업에서는 ‘핵심 오류와 표현의 흠을 나누어 검토하기’를 조정의 기준으로 삼으면, 좋은 의도가 일방적인 부담으로 남는 일을 줄일 수 있습니다.

수정 후:

> 잘하고 싶은 마음이 커서 완성도를 너무 신경 쓰다 시작이나 마감이 늦어지기도 합니다. 사소한 흠까지 같은 무게로 다루면 중요한 검토의 시간이 줄고, 이미 충분한 결과를 넘길 때에도 마음이 걸릴 수 있습니다. 다음 협업에서는 ‘핵심 오류와 표현의 흠을 나누어 검토하기’를 조정의 기준으로 삼으면, 좋은 의도가 일방적인 부담으로 남는 일을 줄일 수 있습니다.

후 근거: evidenceIds `natal:hour:branch:申`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH05.P2 / 지금의 커리어와 다음 선택

수정 전:

> 지금 활용할 능력은 결과가 쌓일 때까지 이어 가는 지속력이며, 입력한 직업의 이름만으로 적합성이 증명되는 것은 아닙니다. 작은 개선을 반복해야 품질이 달라지는 과제에서, 어제와 오늘의 차이를 놓치지 않고 끝까지 이어 가는 장면이 어울립니다.

수정 후:

> 지금 활용할 능력은 변동 속에서도 지킬 기반을 보는 안정감각이며, 직업 이름만으로 적합성이 증명되지는 않습니다. 개발 방식의 변경을 검토할 때 기존 동작을 보존할 테스트와 되돌릴 방법을 먼저 준비하면, 안정성을 지키면서 개선을 시험할 수 있습니다.

후 근거: evidenceIds `natal:ten-god:month:visible:壬`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH06.P1 / 돈을 버는 힘과 재물 관리

수정 전:

> 가격과 비용을 비교해 지속할 수 있는 서비스를 만드는 능력이 가치가 되며, 매출의 크기보다 준비와 운영 뒤에 무엇이 남는지가 중요합니다. 돈을 버는 힘과 재물 관리에서는 토 기운의 성향을 같은 목적을 이루는 안의 비용과 결과를 비교하는 일에 연결해 읽습니다. ISTJ의 금전 판단 자료에서는 ‘돈을 벌 때도 관리할 때도 예측 가능한 구조가 있어야 안정된다’라는 경향을 읽습니다. 싼 비용으로 해냈다는 사실만으로 내 일의 값을 낮출 필요는 없으므로, 투입한 양과 상대가 얻은 효용을 구분해 설명하는 일이 필요합니다.

수정 후:

> 일주 지장간 편재의 ‘바깥의 사람과 기회에서 돈과 자원을 찾는 성질’이라는 해석을, 실제로 남길 자원과 수익 활동을 고르는 방식에 연결합니다. 편재에서 읽는 기회 감각은 새 요청이 실제로 필요한 일인지 살펴, 지금 가진 역량을 쓸 다른 수익 활동을 탐색하는 데 연결할 수 있습니다. ISTJ의 금전 판단에서는 시간이나 돈을 쓸 일이 생기면 무엇이 들어가고 남는지 확인합니다. 가능성이 많이 보여도 수익이 확정된 것은 아니므로, 준비에 쓸 돈과 시간 및 미루게 될 일을 먼저 비교하세요.

후 근거: evidenceIds `natal:ten-god:day:MAIN:己`; mbtiSourceNodeIds `mbti:ISTJ:traits:money:budget_and_reserve_plan:plainKo`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH07.P2 / 학업과 실력 향상

수정 전:

> 단순 암기도 강하지만, 여러 개념을 연결하는 전략을 보완하면 학습 효율이 더 올라갑니다. 특히 수학·추론형 과목에서는 관계도를 만들어야 한다. 비슷해 보이는 사례를 나란히 놓고 답이 달라지는 조건을 찾으면, 익힌 규칙을 새로운 문제에도 적용할 수 있는지가 드러납니다. 자신에게 맞는 환경인지는 진도를 얼마나 채웠는지보다 자료를 보지 않고 해낼 과제가 생겼는지로 살피면, 흥미와 실력의 차이를 확인하기 좋습니다.

수정 후:

> 배운 내용을 직접 확인할 과제와 구체적인 피드백이 있는 환경인지 살펴보세요. 비슷해 보이는 사례를 나란히 놓고 답이 달라지는 조건을 찾으면, 익힌 규칙을 새로운 문제에도 적용할 수 있는지가 드러납니다. 개발 기술을 익힐 때는 예제를 완성한 뒤 입력 조건을 바꿔 보고, 실패한 이유를 설명할 수 있는지 확인할 만합니다. 진도를 채운 양과 혼자 설명할 수 있는 내용을 구분하면, 다음 학습에 필요한 질문도 더 정확해집니다.

후 근거: evidenceIds `natal:hour:branch:申`; mbtiSourceNodeIds `mbti:ISTJ:traits:study:traditional_exam_strength:plainKo`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH08.P3 / 성공 가능성과 아픈 팩폭

수정 전:

> 해당 계약 문단 누락.

수정 후:

> 성과를 이어 가는 과정에서는 중요도가 다른 오류를 모두 같은 무게로 검토하는 습관을 특히 경계해야 하며, 업무에서 읽은 약점이 장기 성장에도 비용이 될 수 있습니다. 성공 가능성과 아픈 팩폭에서는 금 기운의 성향을 원본과 결과를 대조해 빠진 조건을 찾는 일에 연결해 읽습니다. 매번 눈앞의 흠을 모두 직접 고치면, 반복되는 오류를 줄일 테스트나 검토 기준을 남길 시간이 밀려 같은 확인에 계속 묶일 수 있습니다. 다음 검토에서는 발견한 오류 하나를 다른 사람도 확인할 기준으로 남기고, 어느 수준에서 검토를 끝낼지도 함께 정해 보세요.

후 근거: evidenceIds `foundation:element:METAL:BALANCED`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

### CH09.P3 / 나만의 커리어 전략

수정 전:

> 먼저 변경 속에서도 지킬 품질과 약속을 정하는 일을 해낸 과정을 남겨, 고른 방법과 결과를 함께 보여 줄 만합니다. 성장은 더 바빠졌다는 느낌보다 혼자 해결하게 된 과제와, 다른 사람이 다시 사용할 결과로 확인할 만합니다.

수정 후:

> 입력한 개발자의 과제에서도 먼저 같은 목적을 이루는 안의 비용과 결과를 비교하는 일을 해낸 과정을 남겨, 고른 방법과 결과를 함께 보여 줄 만합니다. 다음 개발 과제에서는 비교할 구현 두 가지와 확인할 테스트를 먼저 정하고, 선택 이유를 다른 사람이 이어 쓸 설명으로 남겨 보세요.

후 근거: evidenceIds `natal:ten-god:day:MAIN:己`; mbtiSourceNodeIds `없음`; fusionIds `없음`. `sourceRefs` 전체는 [문단별 근거](paragraph-evidence.json)에 있습니다.

## 직업별 적용과 미상 입력

A — 개발 방식의 변경을 검토할 때 기존 동작을 보존할 테스트와 되돌릴 방법을 먼저 준비하면, 안정성을 지키면서 개선을 시험할 수 있습니다.

B — 디자인 도구나 제작 방식을 고를 때 최초 제작뿐 아니라 다른 매체로 바꿀 비용도 비교하면, 지금의 절약과 이후의 활용을 함께 볼 수 있습니다.

C — 새 상품을 배울 때는 고객이 묻는 문제에 답하는 짧은 제안부터 만들어, 기능 지식과 실제 설명 능력을 함께 점검할 수 있습니다.

A의 jobStatus는 빈 값으로 유지했습니다. 개발자를 직장인·프리랜서·사업자로 치환하지 않았고 회사·직급·언어·과거 프로젝트를 만들지 않았습니다. B의 freelancer/C의 employee는 실제 입력대로 자원 관리와 전문성 문단에 반영합니다.

D: 시주 관련 근거 []; 기존 계산·전체 profiles 동일. CH04.P3/CH07.P3/CH08.P1/P3의 대체 문단을 직접 확인했습니다.

E: MBTI/Fusion 문장 참조 수 0; 기존 계산·전체 profiles 동일. CH04.P3/CH07.P3/CH08.P1/P3의 대체 문단을 직접 확인했습니다.

F: 시주 관련 근거 []; MBTI/Fusion 문장 참조 수 0; 기존 계산·전체 profiles 동일. CH04.P3/CH07.P3/CH08.P1/P3의 대체 문단을 직접 확인했습니다.

F CH08.P1은 존재하지 않는 귀인 대신 실제 축토의 자원 보존 성향과 긍정 의미를 사용합니다:

> 좋은 가능성의 출발점은 쓸모와 비용을 함께 보는 현실감각이며, 확인되지 않은 재물복이나 귀인보다 실제로 쓸 수 있는 능력에서 희망을 읽는 편이 정확합니다. 성공 가능성과 아픈 팩폭에서는 일주 지지 축토의 성향을 같은 목적을 이루는 안의 비용과 결과를 비교하는 일에 연결해 읽습니다. 긍정적인 면으로는 가진 것을 아끼고 오래 쓰는 데 힘을 보탭니다. 기회가 생기면 낭비한 투입의 감소와 유지할 자원의 확보를 보여 줄 수 있는 작은 역할부터 맡아, 기대한 강점과 실제 결과를 대조하세요.

## 추천 점수, DB, 현재 직업 가점

`careerRecommendations.ts`의 기존 규칙은 유효한 selected material의 semanticTags로 후보를 만든 다음, 관련 work/study/strengths/identity/money/success Fusion 존재 +3, 실제 MBTI recommendedJobs의 matchingTraits 및 matchingMyeongliSignals 일치 +2, 현재 workFunction 일치 +3, min(2, material 수)를 합산합니다. 동점은 route.id localeCompare 순입니다. 상위 3개를 선택합니다. 점수는 적성 검증 통계나 성공 확률이 아닙니다.

|사례|기존 순서대로 후보|점수 (Fusion / MBTI DB / 직업 / 소재)|
|---|---|---|
|A|investigate|4 (0 / 0 / 3 / 1)|
|A|manage|4 (0 / 2 / 0 / 2)|
|A|teach|4 (0 / 2 / 0 / 2)|
|B|create|7 (0 / 2 / 3 / 2)|
|B|experience|6 (0 / 2 / 3 / 1)|
|B|investigate|5 (3 / 0 / 0 / 2)|
|C|lead|10 (3 / 2 / 3 / 2)|
|C|market|8 (3 / 0 / 3 / 2)|
|C|manage|7 (3 / 2 / 0 / 2)|

A investigate=4는 화개살 소재 1점+개발자 3점입니다. manage=4는 소재 2점+실제 ISTJ DB 일치 2점입니다. investigate가 먼저 보이는 것은 적성이 더 높다고 검증됐기 때문이 아닙니다. 직업 입력이 순서를 좌우할 수 있으므로 신규 커리어에는 “탐색 후보”로 표시하고 환경·피할 조건을 함께 설명합니다. 가점 계산 자체는 요청 범위에서 변경하지 않았습니다.

A manage의 실제 DB 예시는 공무원·회계사이며, 각 matchingTraits 및 정관/정재 등 실제 소재 일치가 확인됩니다. teach는 천을귀인·정인 등 기존 소재를 사용합니다. 추천 ID·roleExamples·proof SHA는 A~F 모두 변경 전과 동일합니다. 기존 원천 DB를 새 직업 DB로 바꾸거나 추천 예를 새로 꾸미지 않았습니다. [전체 점수 구성 및 DB 일치](recommendation-audit.json).

## 명리·MBTI·Fusion 출처와 재물 해석

A 실제 원국은 戊辰 / 壬戌 / 乙丑 / 甲申, 일간 乙입니다. 년주 천간 戊는 정재, 월주 천간 壬은 정인, 월주 지장간 戊는 정재, 일주 지장간 己는 편재입니다. “월주 정재”를 천간 정재처럼 읽게 하지 않도록 위치명을 구분합니다. 보이는 천간·지지의 음양은 6양·2음이며, 일간 乙 자체를 양이라고 설명한 것이 아닙니다. 화개살/재고귀인/천을귀인 등 추천·긍정 근거도 계산 결과 및 existing material/provenance로 확인했습니다.

- CH01.P2: evidenceIds `natal:year:stem:戊`; mbtiSourceNodeIds `mbti:ISTJ:traits:identity:conservative_filter:plainKo`; fusionIds `fusion:REINFORCE:CHANGE_ORIENTATION:learning:CHANGE_ORIENTATION:-1:CHANGE_ORIENTATION:-1`.
- CH02.P3: evidenceIds `natal:day:stem:乙`; mbtiSourceNodeIds `mbti:ISTJ:traits:strengths:calm_under_procedure:plainKo`; fusionIds `fusion:COMPLEMENT:C001:learning:CARE:1:PRECISION:1`.
- CH05.P3: evidenceIds `foundation:yin_yang:STRONG_YANG`; mbtiSourceNodeIds `mbti:ISTJ:traits:identity:conservative_filter:plainKo`; fusionIds `fusion:TENSION:CHANGE_ORIENTATION:learning:CHANGE_ORIENTATION:1:CHANGE_ORIENTATION:-1`.
- CH06.P1: evidenceIds `natal:ten-god:day:MAIN:己`; mbtiSourceNodeIds `mbti:ISTJ:traits:money:budget_and_reserve_plan:plainKo`; fusionIds `없음`.
- CH07.P3: evidenceIds `없음`; mbtiSourceNodeIds `mbti:ISTJ:traits:study:traditional_exam_strength:risk`; fusionIds `없음`.
- CH08.P1: evidenceIds `natal:day:stem:乙`, `supplement:marker:CHEONEUL`; mbtiSourceNodeIds `없음`; fusionIds `없음`.

CH01.P2는 공통 방향(REINFORCE), CH02.P3는 서로 다른 강점의 보완(COMPLEMENT), CH05.P3는 실제 차이(TENSION)와 그 조건을 분리해 읽습니다. 조건부 가설을 실제 관찰된 경험으로 선언하지 않습니다. 모든 A~F의 명리/MBTI/Fusion/claims/resonance/guidance profiles 전체가 기준과 같습니다.

B의 출처별 조건도 직접 검수했습니다:

> 수 기운의 근거에서는 답을 내리기 전에 놓친 조건이 없는지 한번 더 확인합니다. ENFP에서 읽는 다른 선호는 이렇습니다: 해야 할 일이 보이면 생각만 이어가기보다 직접 시작하고 싶어 합니다. 유지할 때에는 첫 번째 반응을, 시작할 때에는 두 번째 선호를 살펴볼 만합니다. 시안이 마음에 든다는 반응과 실제 전달이 됐다는 결과는 다르므로, 사용할 매체와 읽는 대상을 함께 확인할 필요가 있습니다.

출처: `foundation:element:WATER:BALANCED` / `fusion:TENSION:ACTION_TEMPO:learning:ACTION_TEMPO:-1:ACTION_TEMPO:1`; 실제 Fusion conditionSplit.sides는 명리=유지할 때, MBTI=시작할 때입니다. 반대로 붙이지 않는 회귀 검증을 추가했습니다.

C의 정재 설명:

> 월주 지장간 정재의 ‘꾸준히 들어오고 실제로 남는 돈과 생활을 중요하게 보는 성질’이라는 해석을, 실제로 남길 자원과 수익 활동을 고르는 방식에 연결합니다. 정재에서 읽는 축적의 방향은 한 번의 큰 보상보다 반복해 제공할 가치와 생활에 남길 자원을 함께 보는 데 있습니다. ENTJ의 금전 판단에서는 시간이나 돈을 쓸 일이 생기면 무엇이 들어가고 남는지 확인합니다. 안정을 지키려다 배울 기회까지 모두 미루지 않도록, 이미 확보한 돈과 새 시도에 쓸 작은 한도를 나누어 보세요.

편재/정재의 조건부 생활 적용은 기존 `foundationTenGods.ts`의 각각의 easyMeaning/positiveMeaning/shadowMeaning에서 허용하는 범위로 한정합니다. 선택된 한 요소의 설명이며 원국 전체가 그 하나로 결정된다고 말하지 않습니다.

## 반복과 직접 독해 판단

A/B/C 전체 9장 원고를 독해하고 마지막 변경 문단을 다시 대조했습니다. D/E/F는 삭제된 출처, 새 위험 문단, 학습·긍정 대체 문단 및 최종 회수 근거를 확인했습니다.

|사례|전 동일 문장 중복|후 동일 문장 중복|후 문장 수|
|---|---:|---:|---:|
|A|0|0|145|
|B|0|0|146|
|C|0|0|146|

전후 동일 문장 중복이 0이어도 의미 반복이 없다는 뜻은 아닙니다. 이전에는 정확성·자원·품질 소재가 일반 업무로 돌아왔습니다. 이후에는 CH01의 개발 테스트, CH02의 구현/유지보수 비용, CH04의 지적과 협력, CH06의 금전 의사결정, CH07의 학습 조건 변형, CH08의 검토 기준을 남기지 못하는 장기 정체, CH09의 다음 구현 비교라는 서로 다른 결과로 분리했습니다. CH02.P4는 첫 재능을 연습으로 이어가고 CH09는 앞에서 도입된 근거만 회수합니다.

남은 한계: CH04의 도움·역할 분담 등 공통 facet 문장은 고객 간 같을 수 있고, “근거/조건/결과를 확인”하는 설명 틀은 여전히 반복됩니다. CH08/09도 일부 일반 조율 언어가 남습니다. 동일 근거의 질문별 재적용은 개선했지만, 모든 고객의 모든 문단이 독립적인 고유 문장이라는 주장은 하지 않습니다. [정확한 중복 측정과 facet 분포](repetition.json).

문체 판정: 발견된 ‘기운입니다’의 뜻/‘만들어야 한다’ 직접 삽입은 해소됐고, 9장 결말은 개발/디자인/영업의 우선 행동으로 이어집니다. “입력한 현재 직업”, “근거에서는” 등 설명적인 문구와 일부 공통 틀은 남아 있어 최고 수준의 편집 자연스러움은 PARTIAL로 둡니다. 입력하지 않은 실제 사건·회사·자산·수익·능력을 확정하지 않습니다.

## 다른 5상품과 저장 Book 보호

대표 입력은 기존 실제 6권 미리보기의 종합 김하린, 연애 최서아, 궁합 이준혁/정유진(연애), 대운 윤시우, 세운 한예린(2026)입니다. 기준/변경 후 동일 시각으로 전체 함수를 실행했습니다. 아래 해시는 JSON.stringify 동일 직렬화의 SHA-256이며 단순 본문 일부가 아닌 composition 전체, evidencePacket 전체, Book 전체입니다. 5개 파일 전체 byte도 동일합니다.

|상품|전체 composition SHA (전=후)|전체 evidence SHA (전=후)|전체 Book SHA (전=후)|
|---|---|---|---|
|01-comprehensive|`e3cfeb7ec07867b61db70dba0e92872261870aa5cb6b3395aad23d644b7999ca`|`234ef73802c350867cd68392981661c7374ad44e0445d7a97aa84999f802a35b`|`e14c10e82ab8e76137a3f2caaa21f37d581c4f633dc7320f24b20fbb14e668e6`|
|03-love|`fa4fc611d42f7420fd35ca6b17f1ea01b612f8d06ee89c14c37a96ee669fe208`|`3d24c78ee620ef0ce913d3303d550476e22ca0cb8452175c13e4a06acbae0ae3`|`405f55f694420b67fb27694e917894d2d06956257037b8913467c495286f1ce2`|
|04-compatibility|`f5053efa471451677b96e0f026950c2403288058bc7a3c9f33f6dabb1116f1e7`|`da1b271ea10d92d8f8b83df6c124c7f9d00dcb4143b82884d81d32014bc73384`|`ccc55a5ddfa636d7bb94195437a21aa7c9063a92c5b2c951a4cf5dd2fe499f12`|
|05-major-fortune|`d5d131753ce591ea97514da501a35bd814afdd1e00a48b8ad0105e098ae6b4c3`|`1a542af76cf47e2946713c5c41e66979e8dff4a2140cb9471cdb52e26d9a9f1b`|`8ed2622e653aff6aa1aeebe072051165ecf7137d17337ea7444220e6189ae4ea`|
|06-annual-fortune|`26283eea68143759fd7eeef0a4c4fd40c40c61d9aa5efb9fd7539f907a2472c6`|`156330987332fdc7d06869709439f8444949066451ad63d57109703bf6521a39`|`b28ea633f5e450e6c122b67731239ed33c987aaa4999a0a507477b73baf61318`|

이전 커리어 paid snapshot을 가상 baseline 원문으로 고정해 owner 및 shared storedBook 열람 결과가 동일하고 입력 snapshot도 변하지 않는지 검증했습니다. 생성 버전 변경은 신규 생성 경로에만 적용합니다. V3 v2Regression 6건도 통과했습니다. Production 구매자의 DB를 읽거나 바꾼 검증은 아닙니다.

## 테스트·lint·build

- 커리어 관련 4파일 104건: **100 통과 / 4 기존 실패**. 신규 careerQuality 14건은 별도 최종 재실행에서도 14/14 통과해 추천 proof 보존까지 확인했습니다. 기존 careerRelease 4실패는 love/compatibility/major/annual의 오래된 고정 해시 기대값으로 기준 SHA에서도 동일 실패. 기대값을 이번 작업에서 갱신하지 않았습니다.
- 경계 4파일(runtimeShadow, careerNarrative, careerProductLocks, V3 v2Regression) 91건: **89 통과 / 2 기존 실패**. 실패는 careerProductLocks의 기존 major/annual 해시. 기준에서도 동일 실패이며 이번 기준의 실제 5상품 전체 해시는 동일합니다.
- 기존 API 2파일(annualPurchaseYearPolicy, bookAnnualPreflight) 24건: **2 통과 / 22 기존 실패**, 전후 실패 case 이름 및 403/빈 JSON 오류 동일. 공개 게이트를 열어 테스트를 우회하지 않았습니다.
- 실제 전체 생성 capture: 11/11 통과(A~F+다른 5상품). 추천 점수 구성 진단: 1/1 통과. V3 6건 별도 재실행도 통과(위 91건에 이미 포함된 중복 검증).
- 전체 관련 고유 테스트 합계: **191 통과 / 28 기존 실패 / 신규 실패 0**. 자동 테스트 전체 green으로 보고하지 않습니다.
- lint: exit 0. `git diff --check`: 통과.
- TypeScript: 기준 Next generated types 포함 390건, 최종 390건. 신규 진단 0. 처음 generated types 없는 worktree의 389건과 혼동하지 않습니다. 비교는 생성 디렉터리와 절대 worktree 경로/타입 union의 동일한 멤버 출력 순서만 정규화했습니다. 기존 Page export 오류 위치/코드는 같습니다.
- build: webpack 번들 컴파일 성공. 기준/변경 후 모두 기존 `src/app/report/new/page.tsx`의 허용되지 않은 named Page export 때문에 타입 단계에서 실패. 기준 출력은 getAsiaSeoulCurrentYear, 최종 출력은 getAnnualFortuneYearOptions를 지목합니다. 해당 파일 byte는 그대로이며 오류 유형은 같습니다.
- NFT: 두 build 모두 앞선 타입 단계에서 중단되므로 NFT 단계 경고 유형/import trace 비교는 **UNVERIFIED**. 과거 경고 수가 유지됐다고 주장하지 않습니다.

## 미해결 사항과 판매 품질

|영역|판정|근거|
|---|---|---|
|9장·36문단/근거 검증/결정론성|PASS|A~F 전부 실제 생성 및 publication hard error 0|
|개발·디자인·영업 직업 맥락|PASS (검수 범위)|장면·학습·선택 행동이 다르고 고용 형태를 꾸미지 않음|
|추천의 정직한 표현|PASS|기존 순서/근거 보존, 객관 순위 대신 탐색 후보와 조건 표시|
|재물·학업·긍정·위험의 역할 분리|PASS (검수 범위)|실제 재성 위치·정재/편재 차이, 학습 위험, CH08.P3 복원|
|반복 및 자연스러움|PARTIAL|공통 facet/근거 소개 틀과 일부 일반 조율 언어가 남음|
|다른 상품/과거 Book 보호|PASS (로컬)|전체 5상품 동일, 고정 paid snapshot owner/shared 동일|
|출시 전체 검증|PARTIAL|기존 해시 6·API 22 실패, 기존 build 오류, NFT 미도달|

새 코드로 발생한 확인된 실패는 없습니다. 남은 공통 문체/반복과 F의 10,089자 advisory를 운영자가 실제 원문으로 최종 검수해야 합니다. 기존 타입·build/API/오래된 해시 문제는 별도 통합 검증 범위로 보고하며 이번에는 수정하지 않습니다. 신규 후보 점수 정책을 검증된 적성 평가로 고도화하는 작업도 수행하지 않았습니다.

커밋·푸시는 이 작업 브랜치만 대상으로 합니다. master 병합/푸시, Production 배포, 실제 결제·환불, 운영 DB/환경변수 변경은 실행하지 않습니다. 종합 브랜치와 통합 및 다음 상품 작업을 시작하지 않습니다.

정량 근거: [verification.json](verification.json), [문장별 provenance](paragraph-evidence.json), [추천 점수](recommendation-audit.json), [반복 측정](repetition.json).
실행 기록: [test-results.json](test-results.json), [원시 검증 로그](logs/).
