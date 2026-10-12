# V4-MAJOR-FORTUNE-READER-QUALITY-POLISH-01

평가 시각 **2026-10-12 12:00 KST**. 기준 `v4/major-fortune-personalization-01` / `4e8deb242f78310ff9bc3fbcba4fb364a48503e4`. 독립 worktree `/tmp/gyeol-major-fortune-reader-quality-polish-01`, 작업 브랜치 `v4/major-fortune-reader-quality-polish-01`.

## 판정과 원고

이번에 지정한 조합 오류·미래 직업 단정·2034 주제 부적합·전환 기간 표시와 반복 관계 설명을 개선했다. 실제 계산과 원천 근거는 동일하다. **과제별 기능 검증 PASS, 원고 전체 판매 완성도 PARTIAL, DEPLOY_READY NO**다. 기존 빌드 오류가 남아 있고, 공통 해석 재료에 따른 문체 반복 및 전환 전 상세 해석의 데이터 한계를 아래에 명시한다. 자동 테스트나 글자 수만으로 판매 품질 PASS를 판정하지 않는다.

- [윤시우 수정 전 전체 Book 원고](yun-siwoo-before.txt): 도입·현재/다음 대운·전환·14년·마지막 장·각주·부록·Book 표 데이터 보존.
- [윤시우 수정 후 전체 Book 원고](yun-siwoo-after.txt): 생성 문장을 편집하거나 요약하지 않은 전체 출력.
- [2023–2036 모든 문단 수정 전후 및 실제 proof](fourteen-year-comparison.md).
- [측정값·입력·연도별 실제 근거·5상품 전체 해시](measurements.json).

원본 raw 생성 결과와 Book JSON은 `/tmp/gyeol-major-reader-validation/{before,after}/`에 있다. 원문 파일의 제목·block ID 등은 독해를 위한 경계이며 본문 측정에서 제외했다. 현재 보고서는 실제 고객 화면과 동일한 UI라고 주장하지 않는다.

## 실제 경로와 원인

`generateV4ShadowReport`의 실제 V4 상품 생성 경로에서 기존 명리 계산 → MBTI 자료 → Fusion → 후보 선택 → `composeMajorFortuneNarrative` → `projectBook` → 저장 snapshot/owner·shared 재열람을 실행했다. writer·결제 승인은 실행하지 않았고 네트워크 guard를 사용했다. A–F의 기존 payload가 `contentVersion=v3`인 점도 그대로 유지했다. 이 함수가 V4 composition/evidence를 생성하는 것은 각 결과의 `major_fortune` V4 packet과 publication validator로 검증했다. Production gate 및 정책을 우회하거나 바꾸지 않았다.

- [majorInteractionReading.ts](../../../src/lib/interpretation-v4/majorInteractionReading.ts): 엔진의 관계 `reason.text`에 있는 공통 문구를 모든 연도에 다시 출력하던 경로였다. 기존 참여 지지·대상·scope·ID를 검증하는 bind는 유지한다. 최초 종류 설명과 이후 짧은 상기, 실제 연간 십성과 첫/재등장의 판단 기준, 관계별 제한적 행동을 조합한다. 관계의 발생이나 길흉 점수를 새로 계산하지 않는다. 같은 대상에 합과 긴장 관계가 함께 있으면 참여 대상 설명을 한 번 묶고, 강점/주의 판단은 각 문단에 남긴다. 양쪽 기존 근거 ID는 묶음 문단 proof에 모두 유지한다.
- 기존 검증 자료 [annualMonthRelationFacts.ts](../../../src/lib/report-knowledge/annualMonthRelationFacts.ts) `branchReadings`의 육합/삼합/반합 뜻을 그대로 재사용했다. [annualFortuneReading.ts](../../../src/lib/report-knowledge/annualFortuneReading.ts) `relationActions`의 협업 범위·공통 목표·부족한 조건 확인과 충/형/파/해의 조정 방향을 적용했다. 두 공통 자료 파일과 독립 세운 경로는 수정하지 않았다. 특정 지지 쌍에 새로운 사건 의미를 부여하지 않았다.
- [majorYearPersonalization.ts](../../../src/lib/interpretation-v4/majorYearPersonalization.ts): 상관/식신도 관계 domain seed를 허용해 홍염의 친밀한 매력이 표현/방법 개선 질문에 들어갔다. 이 두 연간 십성의 후보 domain만 work/study로 한정했다. 기존 강한 원국 근거·사용 횟수·fresh seed·출처 검증을 유지한다. 무작위·이름/hash 분기는 없다. 현재 원고 재료의 실제 말만 쓰고, shadow 뒤에 관계없는 기존 연간 경고를 덧붙이지 않는다.
- [majorAnnualStories.ts](../../../src/lib/interpretation-v4/majorAnnualStories.ts), [majorHarmonyCopy.ts](../../../src/lib/interpretation-v4/majorHarmonyCopy.ts): craft/topic/scene이라는 명사구를 사람·행위·완성 문장처럼 접속한 것이 원인이었다. scene은 인용한 상황으로, craft는 입력 당시의 능력으로 취급한다. 정관의 맡김/휴식 문장은 직접 주어를 사용하고, 편인의 질문은 상대가 다시 묻는 조건절로 바꿨다. 비견의 수식어 중첩·겁재의 사람/대상 혼용·식신의 솜씨/칭찬 결합도 틀에서 해결했다. 완성 문자열 사후 replace는 없다.
- [majorPeriodCopy.ts](../../../src/lib/interpretation-v4/majorPeriodCopy.ts), [majorComposer.ts](../../../src/lib/interpretation-v4/majorComposer.ts), [majorYearNarrative.ts](../../../src/lib/interpretation-v4/majorYearNarrative.ts): 기존 canonical 전환 시각/범위만 읽어 전후 기간과 해설 적용 구간을 표시한다. 문단 수·배치·14년 계약은 유지한다.
- [bookProjection.ts](../../../src/app/dev/book-preview/bookProjection.ts): 대운 분기에서 새 원고의 편집 provenance `v4:major-reader-periods-01`이 있는 경우만 기간 표시를 사용한다. 이 표식은 새 계산 근거가 아니다. 과거 저장본은 예전 projection을 유지한다. 다른 5상품 분기와 BookReader는 변경하지 않았다.

## 입력 및 직접 독해

S: 윤시우, 1983-09-02 05:10, 남, ENTJ, employee/기획자. A: 도윤, 1985-06-30 06:00, 남/INFJ/온라인 교육사업 대표. B: 서진, 1990-07-18 05:30, 여/ENTJ/B2B SaaS 영업기획. C: 서윤, 1994-11-18 07:42, 여/ENFP/브랜드 디자이너. D=A 시간 미상, E=A MBTI 미상, F=A 둘 다 미상. S의 MBTI 미상도 별도로 생성했다.

정상 입력 S/A/B/C의 도입부터 마지막 장까지 전체 원고를 읽었다. S의 Book 각주·부록·타임라인을 별도로 읽고 본문/관계 출처를 대조했다. D/E/F 및 S-MBTI는 전체 출력의 구조·근거·결합 금지 패턴과 대표 문단을 확인했다. 모든 가상 고객의 모든 조합에서 완벽한 문체를 보장하는 검증은 아니다.

시간 미상 D/F는 기존 범위 전환을 유지하고 시주를 만들어내지 않는다. S의 시간 미상/둘 다 미상은 **변경 전후 모두 `INVALID_REPORT_INPUT / DAYUN_UNCERTAIN`으로 차단**됐다. 이를 성공 발행으로 세지 않았다. MBTI 미상 E/F/S-MBTI는 Fusion이 비어 있고 임의의 성격 유형이 삽입되지 않는다.

## 관계 해석이 전달하는 새 정보

공통 ‘범위 확인’을 모두 삭제하는 것 자체가 목적이 아니다. 육합은 공동 약속의 범위/종료, 삼합은 공통 목표와 각자의 기여, 반합은 일부 접점을 작은 시도로 확인한다. 모두 성공/재물 증가를 보장하지 않는다. 출처와 참여 대상이 달라지면 실제 원국 기둥/대운 지지를 명시한다.


### 2027년

**수정 전 / 2027-gift**

> 2027년 원국 연지 亥·원국 시지 卯, 丁未(편재) 세운의 未 사이의 亥·卯·未 삼합에서는 ‘연결되는 역할과 약속의 범위 확인’을 편재 흐름과 함께 살펴보세요. 2027년의 선택에 보탤 내 바탕은 원국의 역마살 성향입니다. 밖의 고객과 현장을 만나거나 다른 환경을 오갈 때 새로운 기회가 보여요.

**수정 후 / 2027-gift**

> 2027년 원국 연지 亥·원국 시지 卯, 丁未(편재) 세운의 未 사이에는 亥·卯·未 삼합: 세 지지가 모이는 흐름을 함께 추진할 일의 접점으로 읽습니다. 일을 풀어가는 방식에는 원국의 역마살이 드러납니다. 밖의 고객과 현장을 만나거나 다른 환경을 오갈 때 새로운 기회가 보여요. 함께 추진할 일이 있다면 ‘외부 제안에 투입할 시간과 돌아올 몫’을 공통 목표와 각자의 기여에 비춰 정해보세요.

실제 seed: `twelve_sinsal_yeokma:work`.

실제 관계 ID:

- `major:4:丙辰:year:2027:丁未:natal:삼합:亥卯未:year-hour`


### 2029년

**수정 전 / 2029-gift**

> 2029년 대운 丙辰의 지지 辰, 己酉(편관) 세운의 酉 사이의 辰·酉 육합에서는 ‘연결되는 역할과 약속의 범위 확인’을 편관 흐름과 함께 살펴보세요. 2029년의 선택에 보탤 내 바탕은 원국의 겁재 성향입니다. 동료의 좋은 결과가 자극이 되어 내 방식도 빠르게 바꿔봐요.

**수정 후 / 2029-gift**

> 2029년 대운 丙辰의 지지 辰, 己酉(편관) 세운의 酉 사이에는 辰·酉 육합: 함께하기 쉬운 접점입니다. 일을 풀어가는 방식에는 원국의 겁재가 드러납니다. 동료의 좋은 결과가 자극이 되어 내 방식도 빠르게 바꿔봐요. ‘먼저 처리할 요구와 도움을 청할 기준’을 함께 맡을 범위와 종료 조건에 맞춰보세요.

실제 seed: `ten_god_jie_cai:work`.

실제 관계 ID:

- `major:4:丙辰:year:2029:己酉:cycle:육합:辰酉:cycle`
- `major:4:丙辰:year:2029:己酉:natal:반합:酉巳:day`
- `major:4:丙辰:year:2029:己酉:natal:충:卯酉:hour`


### 2032년

**수정 전 / 2032-gift**

> 2032년 원국 월지 申, 壬子(겁재) 세운의 子 사이의 子·申 반합에서는 ‘연결되는 역할과 약속의 범위 확인’을 겁재 흐름과 함께 살펴보세요. 2032년의 선택에 보탤 내 바탕은 원국의 양인살 성향입니다. 경계를 지키고 중요한 순간 결단을 내리는 독립적인 힘이 있어요.

**수정 후 / 2032-gift**

> 2032년 원국 월지 申, 壬子(겁재) 세운의 子 사이에는 子·申 반합: 일부가 맞닿는 접점입니다. 함께할 때의 반응에는 원국의 양인살이 드러납니다. 경계를 지키고 중요한 순간 결단을 내리는 독립적인 힘이 있어요. ‘서로 보탤 실력과 공동 비용’을 작은 시도로 확인한 뒤 연결을 넓혀보세요.

실제 seed: `sinsal_yangin:strength`.

실제 관계 ID:

- `major:5:乙卯:year:2032:壬子:cycle:형:子卯:cycle`
- `major:5:乙卯:year:2032:壬子:natal:반합:子申:month`
- `major:5:乙卯:year:2032:壬子:natal:형:子卯:hour`


## 2034 원국 개인화의 주제 정합성

상관의 reader question은 기존 절차를 바꾸고 새로운 방법을 보여주는 일이다. 수정 전의 `sinsal_hongyeom:strength`는 실제로 존재하지만 친밀한 매력을 읽는 근거였다. 이 연간 질문에서 관계 영역을 제외하면서 실제 원국의 `sinsal_hyeonchim:work`와 question/shadow를 선택한다. 자료의 오류·말의 날카로움·사용자가 써볼 조건이 같은 문단 역할을 이룬다. 홍염 자체를 원국·부록에서 삭제하거나 계산을 변경하지 않았다.

**수정 전 / 2034-gift**

> 2034년 원국 연지 亥, 甲寅(상관) 세운의 寅 사이의 寅·亥 육합에서는 ‘연결되는 역할과 약속의 범위 확인’을 상관 흐름과 함께 살펴보세요. 2034년의 선택에 보탤 내 바탕은 원국의 홍염살 성향입니다. 가까운 대화에서 사람을 끌어당기는 친밀한 매력이 있어요.

**수정 후 / 2034-gift**

> 2034년 원국 연지 亥, 甲寅(상관) 세운의 寅 사이에는 寅·亥 육합: 함께하기 쉬운 접점입니다. 일을 풀어가는 방식에는 원국의 현침살이 드러납니다. 완성됐다는 자료를 받아도 숫자와 설명이 맞지 않는 곳을 찾아냅니다. ‘고친 방법의 전후 차이와 다른 사람이 써볼 조건’을 함께 맡을 범위와 종료 조건에 맞춰보세요.

실제 seed: `sinsal_hyeonchim:work`.

실제 관계 ID:

- `major:5:乙卯:year:2034:甲寅:natal:육합:寅亥:year`
- `major:5:乙卯:year:2034:甲寅:natal:충:寅申:month`
- `major:5:乙卯:year:2034:甲寅:natal:파:寅亥:year`
- `major:5:乙卯:year:2034:甲寅:natal:해:寅巳:day`
- `major:5:乙卯:year:2034:甲寅:natal:형:寅巳:day`
- `major:5:乙卯:year:2034:甲寅:natal:형:申寅:month`


선택 근거의 실제 provenance:

- `branch:卯`
- `canonical-natal-table-v1:features:sinsal_hyeonchim`
- `natal:sinsal_hyeonchim`
- `position:hour`
- `sajuFeatureTaxonomy:sinsal_hyeonchim`
- `shinsal:HYEONCHIMSAL`
- `v1:hyeonchim:묘`
- `v4:material-depth:sinsal_hyeonchim`


## 2031년 전환 기간과 Book

기존 전환은 **2031-11-30 15:10 KST, 丙辰(정재) → 乙卯(식신)**으로 변하지 않았다. 2031년 연초부터 해당 시각 직전까지는 丙辰이며, 11월 말 전환 뒤 남은 기간이 乙卯다. 아래 실제 출력은 대부분의 해가 기존 대운에 속하고 후반 해설이 짧은 전환 후 기간이라는 점을 표시한다.


> 2031년 연초부터 2031-11-30 15:10:00 KST 직전까지는 丙辰(정재) 대운입니다. 같은 시각부터 乙卯(식신) 대운으로 읽습니다. 아래 대운·세운 관계는 乙卯(식신) 대운으로 전환이 완료된 뒤 남은 기간의 설명입니다. 이전 丙辰(정재) 대운의 상세 상호작용은 여기서 다루지 않습니다. 전환 이후에는 乙卯 대운의 식신, 辛亥 세운의 편인이 만나는 흐름입니다. 큰 배경인 ‘손으로 만들어 남기는 결과’ 속에서 ‘남이 놓친 질문을 깊게 파는 시간’에 주목합니다. 오래 품은 질문이 예상보다 오래 흥미를 붙듭니다.


- 목차/챕터 제목: `대운 丙辰 → 乙卯`, `2031-11-30 15:10 한국시간 전후`.
- 연도 탐색: 기존의 `乙卯` 단독 표기 대신 `丙辰 → 乙卯`와 정확한 전환 label.
- 해당 세운 각주: `辛亥 세운 · 丙辰 → 乙卯 대운 … 아래 관계는 전환 완료 뒤 기간`.
- canonical active cycle: 전환 -1ms=`丙辰`, 정각/+1ms=`乙卯`.
- 시간 미상 범위: earliest 직전/ latest 이후만 확정하고, 두 시각 사이는 확정하지 않는다. 범위를 임의의 한 시각으로 축소하지 않는다.
- 전환 전 대운의 연간 상세 상호작용은 기존 packet에 없으므로 생성하지 않았다. 이는 남아 있는 데이터 표현 한계이며 계산 또는 14년 구조를 확장하지 않았다.

## 문장 결합 및 미래 사실성


**수정 전 / 2028-friction**

> 2028년 원국 일지 巳, 戊申(정관) 세운의 申 사이의 巳·申 형에서는 ‘되풀이되는 제약과 부담의 점검’을 정관 흐름과 함께 살펴보세요. 2028년에 이 강점을 쓸 때는 정인의 반대편도 살펴보세요. 준비가 더 필요하다는 말이 길어집니다. 해본 것을 다음 선택에 다시 쓰는 감각을 믿고 맡겼다는 말이 쉴 시간까지 맡겼다는 뜻은 아니니까요.

**수정 후 / 2028-friction**

> 2028년 원국 일지 巳, 戊申(정관) 세운의 申 사이에는 巳·申 형: 되풀이되는 부담을 점검할 자리입니다. 타고난 정인 성향에서 주의할 부분도 있습니다. 준비가 더 필요하다는 말이 길어집니다. 같은 부담이 되풀이된다면 ‘맡을 범위와 끝냈다고 볼 기준’을 어디까지 감당할지 다시 정해보세요.

실제 seed: `ten_god_zheng_yin:shadow`.

실제 관계 ID:

- `major:4:丙辰:year:2028:戊申:cycle:반합:申辰:cycle`
- `major:4:丙辰:year:2028:戊申:natal:육합:巳申:day`
- `major:4:丙辰:year:2028:戊申:natal:파:巳申:day`
- `major:4:丙辰:year:2028:戊申:natal:해:申亥:year`
- `major:4:丙辰:year:2028:戊申:natal:형:巳申:day`

**수정 전 / 2031-harmony**

> 2031년 전환이 완료된 뒤의 대운 乙卯의 지지 卯, 辛亥(편인) 세운의 亥 사이의 亥·卯 반합에서는 ‘연결되는 역할과 약속의 범위 확인’을 편인 흐름과 함께 살펴보세요. 오래 품은 질문을 다른 시선으로 보는 사람과 이야기를 이어갈 만해요. 당장 답이 없어도 흥미가 남는 주제를 붙드는 시간에서 당연하게 여겼던 오래 품은 질문을 상대가 되물으면 질문에도 새 입구가 생깁니다.

**수정 후 / 2031-harmony**

> 2031년 전환이 완료된 뒤의 구간에서, 대운 乙卯의 지지 卯, 辛亥(편인) 세운의 亥 사이에는 亥·卯 반합: 일부가 맞닿는 접점입니다. 오래 품은 질문을 다른 시선으로 보는 사람과 이야기를 이어갈 만해요. 상대가 오래 품은 질문을 다른 말로 되묻는다면 당연하게 여긴 가정을 다시 살펴볼 수 있습니다. ‘확인할 가정과 조사를 끝낼 기준’을 작은 시도로 확인한 뒤 연결을 넓혀보세요.

실제 seed: `(없음: 기존 관계·대운 근거)`.

실제 관계 ID:

- `major:5:乙卯:year:2031:辛亥:cycle:반합:亥卯:cycle`
- `major:5:乙卯:year:2031:辛亥:natal:반합:亥卯:year-hour`
- `major:5:乙卯:year:2031:辛亥:natal:충:巳亥:day`
- `major:5:乙卯:year:2031:辛亥:natal:해:申亥:month`
- `major:5:乙卯:year:2031:辛亥:natal:형:亥亥:year`

**수정 전 / 2027-character**

> 2027년은 丙辰 대운의 정재, 丁未 세운의 편재가 만나는 해입니다. 큰 배경인 ‘반복되는 수입과 생활의 축적’ 속에서 2027년에는 ‘바깥 기회와 돈의 연결’에 주목합니다. 이 시기에는 다른 회사의 제안과 돈의 연결이 흥미로워집니다.

**수정 후 / 2027-character**

> 2027년은 丙辰 대운의 정재, 丁未 세운의 편재가 만나는 흐름입니다. 큰 배경인 ‘반복되는 수입과 생활의 축적’ 속에서 ‘바깥 기회와 돈의 연결’에 주목합니다. 앞으로 다른 회사의 제안을 접할 기회가 있다면, 내 경험을 어떤 값으로 나눌 수 있을지 살펴볼 만합니다.

실제 seed: `(없음: 기존 관계·대운 근거)`.

실제 관계 ID:

- `major:4:丙辰:year:2027:丁未:natal:삼합:亥卯未:year-hour`


정관 휴식 안내는 동적 craft를 사람처럼 ‘믿고 맡겼다’고 쓰지 않는다. 개인화가 적용되지 않는 경로에도 ‘일을 믿고 맡겼다고 해서 쉴 시간까지 내줄 필요는 없으니까요’라는 정상 조합을 사용한다. 편인의 scene은 더 이상 ‘시간에서 당연하게 여겼던 질문을 상대가’처럼 수식어가 연속되지 않는다.

현재 직업은 입력 당시의 예시임을 도입에서 표시하고, 미래의 다른 회사 제안은 ‘접할 기회가 있다면’으로 읽는다. 먼 미래는 기존 직업 일반화 장면을 유지한다. 직업·급여·혼인·실제 발생 사건을 새로 확정하지 않았다.

## 동일 십성 연도 간 차별화

아래는 새 character 문단의 실제 생성 결과다. 기존 첫/재등장 이야기 선택은 유지하면서, 앞서 등장한 연도와 그때의 실제 대운을 명시하고 현재 대운에서 달라지는 판단 기준을 전달한다. 모든 경우에 새로운 명리 의미를 만드는 것은 아니다.


### 2023 / 2033

**앞선 연도**

> 2023년은 丙辰 대운의 정재, 癸卯 세운의 비견이 만나는 흐름입니다. 큰 배경인 ‘반복되는 수입과 생활의 축적’ 속에서 ‘내 판단과 내 이름’에 주목합니다. 그 무렵 일하는 방식을 남의 말대로만 정하기 답답했던 순간이 있었나요?

**재등장 연도**

> 2033년은 乙卯 대운의 식신, 癸丑 세운의 비견이 만나는 흐름입니다. 같은 비견을 읽었던 2023년(丙辰·정재)과 비교하며, ‘계속 지킬 방향과 다시 열어둘 선택’을 ‘손으로 만들어 남기는 결과’의 관점에서 살펴볼 만해요. 오래 지킬 선택은 이제 해낼 수 있느냐보다 계속 내 이름으로 가져갈 만한지가 중요합니다.

원국 gift seeds: `ten_god_bijian:work` → `sinsal_yangin:work`. 전체 관계와 실제 원문은 비교 파일 참조.


### 2024 / 2034

**앞선 연도**

> 2024년은 丙辰 대운의 정재, 甲辰 세운의 상관이 만나는 흐름입니다. 큰 배경인 ‘반복되는 수입과 생활의 축적’ 속에서 ‘익숙한 답을 바꾸는 목소리’에 주목합니다. 반복되는 절차를 보며 ‘다르게 해도 되지 않을까’ 싶었던 때가 있었나요?

**재등장 연도**

> 2034년은 乙卯 대운의 식신, 甲寅 세운의 상관이 만나는 흐름입니다. 같은 상관을 읽었던 2024년(丙辰·정재)과 비교하며, ‘고친 방법의 전후 차이와 다른 사람이 써볼 조건’을 ‘손으로 만들어 남기는 결과’의 관점에서 살펴볼 만해요. 다른 답을 보여줄 기회는 긴 반박보다 직접 보여주는 답이 돼요.

원국 gift seeds: `ten_god_shi_shen:work` → `sinsal_hyeonchim:work`. 전체 관계와 실제 원문은 비교 파일 참조.


### 2025 / 2035

**앞선 연도**

> 2025년은 丙辰 대운의 정재, 乙巳 세운의 식신이 만나는 흐름입니다. 큰 배경인 ‘반복되는 수입과 생활의 축적’ 속에서 ‘손으로 만들어 남기는 결과’에 주목합니다. 그 무렵 알아듣기 쉬운 설명이 말보다 결과로 보였을 때 기분이 달랐을 수 있어요.

**재등장 연도**

> 2035년은 乙卯 대운의 식신, 乙卯 세운의 식신이 만나는 흐름입니다. 같은 식신을 읽었던 2025년(丙辰·정재)과 비교하며, ‘다시 만들 수 있는 순서와 공유할 방법’을 ‘손으로 만들어 남기는 결과’의 관점에서 살펴볼 만해요. 꾸준히 보여줄 솜씨가 한 번의 박수로 끝나지 않고 다시 찾는 이유가 될 수 있어요.

원국 gift seeds: `gwiin_munchang:work` → `ten_god_shi_shen:study`. 전체 관계와 실제 원문은 비교 파일 참조.


### 2026 / 2036

**앞선 연도**

> 2026년은 丙辰 대운의 정재, 丙午 세운의 정재가 만나는 흐름입니다. 장기 과제인 ‘반복되는 수입과 생활의 축적’을 같은 관점에서 다시 살펴볼 때예요. 한 해의 세운과 구분해, 丙辰(정재) 대운의 지지 辰, 원국 월지 申 사이에는 辰·申 반합: 일부가 맞닿는 접점입니다. 丙辰 대운의 이 관계를 특정 연도의 사건으로 단정하지 않습니다. 일에 맞는 보상을 생각하는 시간이 반갑습니다.

**재등장 연도**

> 2036년은 乙卯 대운의 식신, 丙辰 세운의 정재가 만나는 흐름입니다. 같은 정재를 읽었던 2026년(丙辰·정재)과 비교하며, ‘결과를 계속 내기 위한 비용과 내 생활의 몫’을 ‘손으로 만들어 남기는 결과’의 관점에서 살펴볼 만해요. 생활을 지킬 여유는 전보다 작고 정확한 차이에서 좋아질 수 있습니다.

원국 gift seeds: `ten_god_zheng_cai:money` → `ten_god_zheng_cai:work`. 전체 관계와 실제 원문은 비교 파일 참조.


## 분량·반복 측정

UTF-16 기준 공백 포함 글자 수. 도입과 모든 section의 실제 block text를 합산하며 표지·목차·제목·각주·부록·구분 개행은 제외한다. 마지막 한 줄은 별도 측정한다. 아래 숫자는 같은 문자량 기준의 전후 비교이며 품질 점수가 아니다.

| 입력 | 본문 전→후 | 문단 전→후 | 긴 동일 문장 추가 반복 전→후 |
|---|---:|---:|---:|
| S | 14,379 → 14,967 | 108 → 108 | 3 → 0 |
| A | 15,957 → 16,644 | 118 → 118 | 4 → 0 |
| B | 15,604 → 16,265 | 118 → 118 | 3 → 0 |
| C | 15,525 → 15,986 | 116 → 116 | 2 → 0 |
| D | 16,022 → 16,869 | 118 → 118 | 5 → 0 |
| E | 15,381 → 16,067 | 115 → 115 | 4 → 0 |
| F | 15,269 → 16,115 | 114 → 114 | 5 → 0 |
| S-mbti | 13,723 → 14,309 | 105 → 105 | 3 → 0 |

윤시우의 마지막 한 줄은 전후 동일하며 79자다. 모든 사례에서 정확히 같은 전체 문단의 추가 반복은 전후 0이다. ‘긴 동일 문장’은 연도·공백만 정규화한 30자 이상 문장의 추가 발생 횟수다. 문장 뜻을 이해해 평가한 의미 중복률과 다르다.

| 윤시우 정형 표현 | 수정 전 | 수정 후 |
|---|---:|---:|
| ○년의 선택에 보탤 내 바탕은 | 14 | 0 |
| ○의 반대편도 살펴보세요 | 10 | 0 |
| 연결되는 역할과 약속의 범위 확인 | 14 | 0 |

다른 사례도 세 표현이 모두 0이 됐다. 무작위 동의어를 쓰지 않고, 명리 뜻은 처음 설명하고 뒤에서는 실제 판단 대상으로 이어가는 방식이다.

### 고객 사이 재사용

S/A/B/C 전체 원고에서 30자 이상 동일 문장을 비교했다. 연도·공백만 정규화했다. 아래는 서로 다른 문서에 공통으로 있는 고유 문장 수이며 의미 중복률이 아니다.

| 쌍 | 전 | 후 |
|---|---:|---:|
| S/A | 76 | 73 |
| S/B | 111 | 100 |
| S/C | 57 | 49 |
| A/B | 63 | 55 |
| A/C | 54 | 50 |
| B/C | 40 | 38 |

같은 원국 자료/MBTI/십성에 대한 공통 정의가 상당 부분 남아 있다. S/B는 ENTJ와 정재 현재 대운 등 공통 근거가 있어 재사용이 많다. 다른 고객이면 모든 문장을 억지로 바꾸지 않았다. 의미 수준에서는 관계의 대상·삼합/육합/반합 역할·첫/재등장 판단 대상·원국 주제 적합성이 개선됐으나, ten-god별 first/mature 정의와 일부 조언 구조는 공통이다. 고객별 문장이 완전히 독창적이라고 평가하지 않는다.

### 14년 정보 차이

| 연도 | 실제 세운 / 십성 | 대운 | 연도 글자 수 전→후 | 새 gift seed |
|---|---|---|---:|---|
| 2023 | 癸卯 / 비견 | 丙辰 / 정재 | 687 → 733 | ten_god_bijian:work |
| 2024 | 甲辰 / 상관 | 丙辰 / 정재 | 865 → 872 | ten_god_shi_shen:work |
| 2025 | 乙巳 / 식신 | 丙辰 / 정재 | 704 → 714 | gwiin_munchang:work |
| 2026 | 丙午 / 정재 | 丙辰 / 정재 | 777 → 748 | ten_god_zheng_cai:money |
| 2027 | 丁未 / 편재 | 丙辰 / 정재 | 372 → 434 | twelve_sinsal_yeokma:work |
| 2028 | 戊申 / 정관 | 丙辰 / 정재 | 866 → 844 | ten_god_zheng_yin:strength |
| 2029 | 己酉 / 편관 | 丙辰 / 정재 | 717 → 708 | ten_god_jie_cai:work |
| 2030 | 庚戌 / 정인 | 丙辰 / 정재 | 704 → 718 | gwiin_cheondeok:work |
| 2031 | 辛亥 / 편인 | 乙卯 / 식신 (전환 후) | 1017 → 1116 | sinsal_gwimun:study |
| 2032 | 壬子 / 겁재 | 乙卯 / 식신 | 688 → 683 | sinsal_yangin:strength |
| 2033 | 癸丑 / 비견 | 乙卯 / 식신 | 376 → 449 | sinsal_yangin:work |
| 2034 | 甲寅 / 상관 | 乙卯 / 식신 | 682 → 731 | sinsal_hyeonchim:work |
| 2035 | 乙卯 / 식신 | 乙卯 / 식신 | 372 → 466 | ten_god_shi_shen:study |
| 2036 | 丙辰 / 정재 | 乙卯 / 식신 | 683 → 812 | ten_god_zheng_cai:work |

각 연도의 자세한 정보는 생략 없는 원문과 proof를 대조했다. S2027은 삼합+역마의 바깥 경험/공통 기여, S2029는 육합+원국 겁재·세운 편관의 역할 분담/도움 청할 기준, S2032는 반합+원국 양인·세운 겁재의 실력/공동 비용처럼 실제 결정 대상이 다르다. S2034는 친밀한 매력에서 자료 검토/설명 수정으로 질문과 근거가 맞아졌다. 조언 수만 늘린 변화로 평가하지 않았다.

## 보존 및 자동 검증

- S/A–F/S-MBTI 8개 성공 입력의 `calculations`, 전체 `evidence`, `materials`, `integration`, 14년 각 `annual/cycle/beforeCycle/age/timePosition` digest가 수정 전과 같다. 고정 baseline은 코드 수정 전 캡처했다.
- 실제 연간 ID 검증, seed의 material 존재/강한 근거 및 provenance, 조작된 관계/이유 누락 차단, 관계 없는 B2028, 실제 충·형·합, 전환 ±1ms, 미상 범위, 동일 입력 결정론성을 자동 검증한다.
- 새 원고의 실제 publication validator, 모든 본문 paragraph의 무손실 Book 투영, snapshot 저장/owner/shared 재열람, Book 전체 page SSR을 검증한다.
- 별도 검증에서 수정 전 실제 8개 raw draft/evidence로 만든 snapshot을 수정 코드로 owner/shared 재열람했다. 원래 Book 전체 digest와 snapshot bytes digest가 모두 동일했다(8개+저장 확인, 9 tests). 과거 저장본을 새 원고로 생성하지 않았다.
- 기존 4종 Major 원고/proof lock은 위 불변 digest가 전후 같음을 먼저 확인한 뒤 승인된 문장 변경만 갱신했다. 새 `majorReaderQualityLocks.json`의 계산/근거/5상품 해시는 변경 전 값을 고정한다.

### 다른 5상품

같은 평가 시각 및 `RUNTIME_FIXTURES` 입력. 전체 draft / 전체 evidence / 전체 Book 세 hash를 각각 비교했다. 모두 전후 동일하다. 실제 hash는 measurements.json과 고정 회귀 lock에 있다.

| 상품 | 전체 원고 | 전체 근거 | Book |
|---|---|---|---|
| 종합 | SAME | SAME | SAME |
| 커리어 | SAME | SAME | SAME |
| 연애 | SAME | SAME | SAME |
| 궁합 | SAME | SAME | SAME |
| 독립 세운 | SAME | SAME | SAME |

## 테스트·린트·빌드

최종 유효 검증: **대상 183개 중 179 통과, 기존 실패 4개**. 같은 환경에서 기준 10파일/150개는 146 통과·4 실패였다.

| 검증 | 결과 |
|---|---|
| 기준의 관련 10파일 / 150 tests | 146 PASS / 4 기존 FAIL |
| 수정본 전체 11파일 / 183 tests | 최초 177 PASS / 6 FAIL; 아래 해당 파일 재검증으로 신규 2건 해소 |
| 새 majorReaderQuality.test.ts | 최종 33/33 PASS |
| majorInteraction.test.ts | 최종 19/19 PASS |
| 최종 관계 묶음 단건 재검증 | 1/1 PASS (나머지 32 skip) |
| 나머지 9파일 | 전체 실행에서 127 PASS / 4 기존 FAIL |
| 실제 생성/5상품 전후 캡처 보조 검증 | 16/16 PASS |
| 수정 전 저장본 재열람 보조 검증 | 9/9 PASS |
| lint | 기준/수정본 모두 PASS |
| TypeScript | 생성 타입 조건을 맞추면 기준/수정본 모두 390; 신규 0 |
| build --webpack | 기준/수정본 모두 기존 Page export 오류로 FAIL |
| git diff --check | PASS (stage 후에도 확인) |

전체 실행의 신규 실패 2건은 (1) 문서 내 최초 설명/짧은 상기를 동일한 문자열로 기대한 새 테스트, (2) 같은 대상의 관계 묶음이 `harmonyIds`에 tension ID를 포함한 내부 의미 변화였다. 첫 검사는 실제 참여 대상·종류·양쪽 ID·한 번 설명하는 구조를 확인하도록 바로잡았다. 두 번째는 `harmonyIds`의 기존 합 ID 의미를 복구하고, 묶음 문단의 proof에만 긴장 ID도 함께 붙였다. 관련 33개/19개를 재실행해 모두 통과했다. 이 마지막 수정 전후 실제 생성 JSON/Book 출력 15개 파일(잠금 포함)의 바이트 hash가 전부 동일함도 다시 확인했다. 신규 실패를 기존 실패로 분류하지 않았다.

남은 기존 실패는 `bookAnnualPreflight.test.ts`의 예상 HTTP 400 / 실제 403 한 건, `bookReading13b.test.tsx`의 career/love/compatibility 앞·뒤 탐색 항목 차이 세 건이다. 기준에서도 동일하게 발생했고 해당 API/다른 상품 코드는 수정하지 않았다.

TypeScript는 빌드 전 389건이었다. 빌드가 만든 `.next/types`를 기준 소스 archive에도 동일하게 적용해 재검사하면 양쪽 390건이다. 파일/진단 코드별 건수가 모두 같고 변경 파일에서 신규 오류가 없다. raw 메시지 3줄의 union 나열 순서 차이만 있으며 새 오류 유형은 없다. 전체 타입 검사를 깨끗이 통과했다고 보고하지 않는다.

동일 build 환경: `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack`. 양쪽 컴파일은 성공하고 `src/app/report/new/page.tsx`의 허용되지 않는 Page export에서 실패한다. 기준은 `getAsiaSeoulCurrentYear`, 수정본은 `getAnnualFortuneYearOptions`를 첫 위반 항목으로 표시한다. 둘 다 기준부터 존재하는 같은 export 계약 위반이다. NFT 단계까지 도달하지 않았으므로 NFT 경고 개수를 이번 실행에서 검증했다고 하지 않는다.

관련 전체 테스트 명령:

```sh
npx vitest run tests/unit/interpretation-v4/majorPersonalization.test.ts tests/unit/interpretation-v4/majorInteraction.test.ts tests/unit/interpretation-v4/majorEvidenceSeparation.test.ts tests/unit/interpretation-v4/majorEditorialSafety.test.ts tests/unit/interpretation-v4/majorNarrative.test.ts tests/unit/interpretation-v4/majorSafety.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/app/bookPublicFlow.test.tsx tests/unit/app/dev/bookReading13b.test.tsx tests/unit/api/bookAnnualPreflight.test.ts tests/unit/interpretation-v4/majorReaderQuality.test.ts --fileParallelism=false --hookTimeout=120000
npx vitest run tests/unit/interpretation-v4/majorReaderQuality.test.ts --hookTimeout=120000
npx vitest run tests/unit/interpretation-v4/majorInteraction.test.ts --hookTimeout=120000
```

로그: `/tmp/gyeol-major-reader-validation/`의 `tests-before.log`, `tests-after.log`, `reader-final.log`, `interaction-final.log`, `capture-final.log`, `old-books.log`, `lint-{before,after}.log`, `ts-baseline-matched.log`, `ts-after.log`, `build-{before,after}.log`. 계산·내용 생성기의 대규모 다른 상품 품질 감사나 실결제 테스트는 실행하지 않았다.

## Git·원본 보호

원본 작업 공간은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`였다. 요청한 더 이전 대운 기준에서 독립 worktree를 만들었고 원본은 전환하지 않았다. `.gitignore`, `AGENTS.md`, `supabase/.temp/`의 9개 파일, 총 11개 미커밋 파일을 포함해 원본 1,857개 tracked/untracked 비무시 파일의 hash와 Git status가 시작 시점과 같다. reset/restore/stash/clean, 다른 상품 브랜치 병합은 하지 않았다.

Git 변경 범위는 코드 8개 파일, 관련 테스트·lock, 이 검증 보고서로 제한한다. master와 Production은 변경하지 않는다.

## 남은 문제와 판매 판단

1. **기존 출시 차단 문제:** Next.js Page export 타입 오류로 기준/수정본 build 실패. 수정 범위 밖인 `src/app/report/new/page.tsx`는 변경하지 않았다. 배포 가능으로 판단하지 않는다.
2. **데이터 한계:** 전환 전 대운의 상세 연간 상호작용은 현행 14년 packet에 없어서 제공하지 않는다. 전환 이후 설명임을 명확히 했고 누락된 세부 관계를 창작하지 않았다.
3. **MINOR / 문체:** 첫/재등장 십성 정의와 원국 자료의 공통 문장, ‘큰 배경/관점/조건’ 같은 설명 구조는 남는다. 관계 해석 자료는 협업·조정 수준을 지원하므로 특정 지지 쌍마다 독자적 사건 의미를 만들어 차이를 부풀리지 않았다. 일부 문단은 아직 명리명·한자 밀도가 높다.
4. **검증 한계:** 로컬 실제 생성·저장/재열람·SSR 검증이다. Production Worker, 결제, DB 저장, 실제 고객 계정의 브라우저 E2E를 새로 실행하지 않았다. 기존 API/Book 테스트 실패는 위에 기록했다.

범위 안에서 새 계산/근거 오류, 근거 없는 미래 사건 단정, 보호 대상의 hash 변화는 발견하지 않았다. 관계 설명과 개인화 주제 및 문장 정확성은 개선됐지만 전체 판매 완성도를 무조건 PASS로 보고하지 않는다. 운영자의 전체 독해와 기존 build 차단 문제 해결 후 별도 출시 판단이 필요하다. 다른 상품 병합·master push·Production 배포는 실행하지 않았다.
