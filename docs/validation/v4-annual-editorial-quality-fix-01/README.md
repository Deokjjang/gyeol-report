# V4-ANNUAL-FORTUNE-EDITORIAL-QUALITY-FIX-01

세운 편집 계층에서 감사의 MAJOR 3건·MINOR 3건을 수정했다. 해당 재현 사례와 계산·발행 회귀는 PASS다. 판매 품질 전체 판정은 **PARTIAL**: 핵심 사례의 정보 차이는 개선됐지만 공통 개념과 일부 행동 틀의 의미 반복은 남아 있다. 자동 테스트 또는 글자 수 증가를 판매 승인으로 간주하지 않는다. 운영 발행·결제·접근권한 검증은 이번 로컬 검증에 포함되지 않는다.

## 기준과 범위

- Base: `4e8deb242f78310ff9bc3fbcba4fb364a48503e4`.
- 시작 HEAD가 위 Base와 일치함을 확인한 뒤 `v4/major-fortune-personalization-01`에서 `v4/annual-editorial-quality-fix-01`을 생성했다.
- 평가 시각: `2026-10-12 12:00 KST`.
- 기존 감사: `/tmp/gyeol-annual-quality-audit-01/REPORT.md`, 실제 원고·계산 JSON·Book JSON을 수정 전 기준으로 사용했다.
- 시작의 미커밋 11개 파일(`.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개)을 보존했다. 1,852개 기존 추적/보호 파일의 바이트 해시를 비교해 아래 기존 소스 2개 외 변경이 없음을 확인했다.
- 기존 소스 수정: `annualComposer.ts`, `annualMonthNarrative.ts`. 신규 세운 전용 helper: `annualEvidenceReading.ts`, `annualInteractionReading.ts`. 신규 회귀: `annualEditorialQuality.test.ts`, `annualEditorialQualityLocks.json`. 본 보고서까지 7개 작업 파일이다.
- 공통 `contentSynthesis.ts`, `editorialGuard.ts`, 계산·선택 정책·MBTI DB·Fusion·다른 상품·결제·DB·환경 파일은 변경하지 않았다. 기존 대운 개선도 그대로 유지했다.

실제 경로는 `generateV4ShadowReport → buildV4AnnualProduct → composeAnnualFortuneNarrative → annualProductAdapter → Book projection`이다. 최종 adapter 이후의 문장을 독해하고 측정했다. `tests/networkGuard.ts`로 외부 호출을 차단했다. 새 계산기·DB 구조·무작위/입력 해시 문장 선택은 없다.

## MAJOR 1: 원국과 기간의 근거 분리

공통 편집기는 원국 why/manifest/Fusion 문단을 기간 문단 사이에 삽입한다(`contentSynthesis.ts:99-104,169-184`). 세운에는 기존 대운의 `majorEvidenceReading.ts` 같은 출처 분리가 없어 C의 원국 편관을 대운·세운의 십성으로 오해할 수 있었다.

세운 전용 `separateAnnualChapter`는 배정된 문단과 proof를 보존하면서 기간 → 원국 → MBTI/Fusion 순으로 묶는다. 묶음의 첫 문장에만 그 역할을 설명하며 매 문장에 같은 접두사를 붙이지 않는다. 기간 문단에는 실제 간지·십성을 명시한다. 원국 설명과 기간 사이에 새로운 인과관계를 만들지 않는다.

C 수정 전:

> 편관은 압박 앞에서 판단할 몫을 맡는 힘이에요. 상황이 급해지면 긴장도 커지지만, 먼저 정리해야 할 것이 오히려 선명해집니다.

C 수정 후 — 기간 설명:

> 2월 4일부터 12월 31일까지 이어지는 지금 흐름에서는, 丙午 세운은 편인, 壬申 대운은 편재의 흐름입니다. 큰 흐름은 바깥 기회와 돈의 연결을 보고, 한 해는 남이 놓친 질문을 깊게 파는 시간을 요구해요. 오래 세운 기준으로 새 선택의 크기를 정해야 하는 관계예요. 하고 싶은 것과 감당할 수 있는 것을 함께 놓으면 서로 다른 방향도 싸움 대신 균형을 만드는 재료가 돼요.

C 수정 후 — 원국 설명:

> 이 기간에 대응하는 내 바탕은 타고난 사주인 원국의 편관 성향에서 따로 살펴봅니다. 편관은 압박 앞에서 판단할 몫을 맡는 힘이에요. 상황이 급해지면 긴장도 커지지만, 먼저 정리해야 할 것이 오히려 선명해집니다.

원국 proof: `SajuCalcResult:tenGods.distribution:偏官` (`ten_god_qi_sha`). 현재 대운 壬申 편재와 선택 연도 丙午 편인은 기존 canonical period에서 가져온다. 기간 문단 proof:

`annualFortuneReading:crossPeriods`, `annualFortuneYearRules:getBranchPairRelations`, `annualFortuneYearRules:getTenGodForStemPair`, `month-v2:2026:2:2:annual`, `month-v2:2026:2:2:dayun`

재물 장의 기존 “돈과 현실적인 결과를 잡는 힘…”도 다음처럼 타고난 장점 묶음에 놓는다:

> 한 해의 기회와 함께 활용할 타고난 장점도 있습니다. 돈과 현실적인 결과를 잡는 힘이 있습니다. 편재·재고귀인이 따로 비추는 장점이 한 방향으로 모이는 부분입니다.

이는 원국 `SajuCalcResult:tenGods.distribution:偏財`, `natal:gwiin_jaego`의 장점이다. 세운의 새 재물 근거로 승격하지 않는다. MBTI/Fusion 문단의 원래 내용·출처는 유지하고 “대운·세운의 십성과는 별개로…” 행동 관점임을 구분했다.

## MAJOR 2: 일반 월의 개인화와 행동 기준

기존 brief 월은 십성·등장 순서에 따른 공통 설명과 행동, 직업별 장면만 남기고 실제 관계를 설명하지 않았다. A3/B7/C1은 겁재로 동일한 설명·행동 2문단을 공유했다.

수정 전 공통 행동:

> 이 달에서 가져갈 한 가지 · 함께할 일에서 각자 맡을 몫을 먼저 적어보세요. 피할 것 · 친하다는 이유로 비용을 확인하지 않는 것.

수정 후에는 선택된 실제 절기 구간의 `relationFacts`만 사용한다. 확정 여부·원장 ID·월지·참여 지지·원국의 실제 위치·상대 세운·활성 대운이 모두 일치해야 한다. 원국 일지 관련 생활 적용에는 입력 관계 상태를 쓰고, 그 외에는 기존 월 십성의 주제를 사용한다. 같은 정의는 최초에 설명하고 이후 짧게 참조한다. 같은 관계/주제의 행동이 이미 제시됐다면 기존 십성의 다음 활용 질문을 유지한다.

### A 3월

> 3월 절입 뒤 구간을 보면 원국 일지 子, 월운 지지 卯 사이의 子·卯 형은 반복되는 부담을 알아차리고 책임의 기준을 다듬을 관계입니다.

> 이 달에서 가져갈 한 가지 · ‘배우자와 나누는 생활 약속’에서 되풀이되는 요구와 책임이 끝날 조건을 적어보세요. 피할 것 · ‘배우자와 나누는 생활 약속’의 부담을 참고 버티는 일로만 푸는 것.

일지 子와 卯의 형 → 배우자와의 생활 약속에서 반복되는 부담과 책임의 끝을 확인한다.

근거: `month-v2:2026:3:2:month:2026:3:branch:형:子卯`

### B 7월

> 7월 절입 뒤 구간을 보면 원국 시지 卯, 월운 지지 未 사이의 未·卯 반합은 일부가 맞닿는 접점입니다.

> 이 달에서 가져갈 한 가지 · ‘각자의 실력을 합쳐볼 일’에 관해 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요. 피할 것 · ‘각자의 실력을 합쳐볼 일’에서 뜻이 맞는 일부를 전체 합의로 보는 것.

시지 卯와 未의 반합 → 협업에서 부분적인 접점과 아직 합의되지 않은 조건을 구분한다.

근거: `month-v2:2026:7:2:month:2026:7:branch:반합:未卯`

### C 1월

> 1월 절입 뒤 구간을 보면 원국 연지 戌, 월운 지지 丑 사이의 丑·戌 형은 반복되는 부담을 알아차리고 책임의 기준을 다듬을 관계입니다. 한편 乙巳 세운의 지지 巳, 월운 지지 丑의 巳·丑 반합은 함께 활용할 접점으로 남아 있어요.

> 이 달에서 가져갈 한 가지 · ‘각자의 실력을 합쳐볼 일’에서 되풀이되는 요구와 책임이 끝날 조건을 적어보세요. 피할 것 · ‘각자의 실력을 합쳐볼 일’의 부담을 참고 버티는 일로만 푸는 것.

연지 戌과 丑의 형 → 함께할 업무의 반복 요구와 책임 범위를 확인한다. 별도로 세운 巳와 월지 丑의 반합도 구분한다.

근거: `month-v2:2026:1:2:month:2026:1:branch:형:丑戌`, `month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑`

B의 감사에서 언급된 대운 卯–월운 未 반합도 계산 원장에 남아 있다. 이번 문장의 선택 근거는 별도로 존재하는 **원국 시지 卯–월운 未** 반합이다. 대운을 원국으로 바꿔 부른 것이 아니다. 같은 fact의 affectedPillars에 월운과 같은 지지를 가진 원국 위치가 함께 들어 있어도, 실제 상대 참여 지지를 확인하여 B의 원국 월지 未를 상대 卯처럼 표시하지 않는다.

## MAJOR 3: 세운·월운 관계의 구체적인 설명

기존 cross는 첫 관계의 종류만 골라 두 십성의 theme/work를 대립형 틀에 넣었다. A2024년 10월은 둘 다 편재인데 사실상 같은 재물 주제를 “보면서도”로 대비했다.

수정 전:

> 이 달의 속도와 한 해의 속도가 다르게 느껴질 수 있어요. 바깥 기회와 돈의 연결을 중요하게 보면서도 당장 밖에서 들어오는 제안을 챙기고 싶어지는 식이에요. 한쪽을 실패로 볼 필요 없이 순서를 나누는 것이 어울립니다.

수정 후:

> 10월 절입 뒤 구간을 보면 甲辰 세운의 지지 辰, 월운 지지 戌 사이의 辰·戌 충은 일정과 역할을 조정할 조건입니다. 한편 원국 월지 午, 월운 지지 戌의 戌·午 반합은 함께 활용할 접점으로 남아 있어요.

> 이 달에서 가져갈 한 가지 · 기존 일정 옆에 ‘밖에서 들어오는 제안’을 놓고 바꿀 순서와 담당자를 정해보세요. 피할 것 · ‘밖에서 들어오는 제안’ 때문에 계획을 조정하는 일을 실패로 단정하는 것.

실제 `month-v2:2024:10:2:month_annual_branch:甲辰:충:辰戌`에서 세운 甲辰의 辰과 월운 甲戌의 戌을 읽는다. 서로 다른 생활 영역을 창작하지 않고, 들어오는 제안을 기존 일정·역할에 어떻게 배치할지 판단 기준을 제공한다. 원국 午–월운 戌의 반합은 별도 접점이다. 충=실패, 합=성공이라는 예언은 하지 않는다.

해석 뜻은 기존 `annualMonthRelationFacts.ts:96`, `annualFortuneReading.ts:87`, `foundationRelations.ts`의 조정·부담·기대·접점 의미를 짧게 편집한 것이다. 관계 계산은 하지 않는다. confirmed 관계가 없는 실제 B 8월에는 interaction 문단을 만들지 않는다. 내부 proof ID는 고객 문장에 출력하지 않는다.

## MINOR 3건

1. 명사구 결합: A의 “어려운 결정을 맡는 힘에 힘을 쏟을수록”을 “어려운 결정을 맡는 힘을 중요하게 여길수록”으로 수정했다. 특정 완성 문장 치환이 아니라 theme + 목적격 조사 + 서술어 조합을 수정했다. 옛 cross의 `setting + 에서` 틀을 제거하여 “시간에서”도 사라졌다. 유지한 장면은 “재구매가 멈춘 이유를 고객 경험에서 찾는 시간을 생각하면…”처럼 기존 조사 유틸리티로 연결한다. 절입 직전 같은 월운이 이어지는 문장도 한자 뒤에 고정 조사(예: 午과)를 붙이지 않도록 구성했다.
2. 문단 연결: gift의 주제 적합성을 제목뿐 아니라 **선택 시점**에도 적용했다. A 10월 편인의 학습 흐름에는 홍염의 친밀감 문단을 넣지 않고, B 10월 편재에는 화개의 내면 탐구 문단을 넣지 않는다. 실제 표식과 원장 자체는 삭제하지 않았다. 적합한 표식이 없으면 억지 연결 없이 해당 gift 문단을 생략한다. A 11월 정인–문창, B 6월 비견–홍염 등 기존 기준에 맞는 장점은 남는다.
3. 마지막 제목: 2024/2025는 “2024년에서 가져갈 배움”/“2025년에서 가져갈 배움”, 현재 2026은 “올해를 잘 쓰는 핵심”, 명시적 오프라인 2027은 “2027년을 준비하는 기준”. 실제 2026 평가 시각의 2027 운영 요청은 여전히 `SELECTED_YEAR_INVALID`다.

## A~F 독해·계산·발행 검증

A 1985-06-30 06:00 남성 INFJ 교육사업 대표, B 1990-07-18 05:30 여성 ENTJ 영업기획, C 1994-11-18 07:42 여성 ENFP 브랜드 디자이너. D=A 시간 미상, E=A MBTI 미상, F=둘 다 미상. 감사의 직업 상세·관계 상태 fixture를 그대로 재사용했다.

A/B/C 전체 12개월 본문을 직접 읽었다. D/E/F는 A와 대조하여 변경된 모든 문단을 읽었다. 과거 2024/2025와 오프라인 2027/2028도 생성해 문제 문장·제목·근거·편집 진단을 확인했다. 생활 장면은 기존 “생각하면/비춰 읽어볼 만해요”의 예시이며 실제 사용자 사건을 새로 만들어 넣지 않았다.

아래는 전체 월 독해에서 확인한 정보 차이이다. 긍정적 가능성은 기존 십성·직업 장면에 유지하고, 관계 단락과 행동에서는 그 가능성을 쓰기 전에 확인할 조건을 연결했다.

| 월 | A | B | C |
|---|---|---|---|
| 1 | 배움 + 기대 차이·일지 접점 | 실속 + 원국 월지 충의 일정 조정 | 협업 + 연지 형/세운 반합 구분 |
| 2 | 자기 선택 + 월지 반합의 미합의 조건 | 판단력 + 일지 충/연지 반합 | 완성의 즐거움 + 일지 충/연지 반합 |
| 3 | 협업 장면 + 일지 형의 생활 약속 | 신뢰 + 월지 반합/연지 파 | 개선 제안 + 월지 반합/시지 해 |
| 4 | 결과물 + 일지 반합/연지 파 | 깊은 질문 + 일지 반합/시지 해 | 외부 의뢰·친밀감 + 일지 반합/연지 충 |
| 5 | 개선 실험 + 대운 寅과 월운 巳의 형 | 배움 + 일지 申의 형과 육합을 별도 표시 | 실속 + 월지 충/일지 육합 |
| 6 | 외부 제안 + 월지 午 자형/대운 반합 | 자기 선택·친밀감 + 세운 午 자형 | 마감 책임 + 세운 午 자형 |
| 7 | 도움·축적 + 시지 반합/연지 충 | 협업 + 시지 반합의 부분 합의 | 신뢰·도움 + 월지 반합/연지 형 |
| 8 | 판단력 + 대운 寅–월운 申 충 | 실제 관계 설명 없이 식신 결과물·직업 장면 | 질문 + 시지 반합/월지 해 |
| 9 | 신뢰 + 연지 반합/일지 파 | 개선 + 대운 卯–월운 酉 충 | 배움 + 연지 해/시지 육합 |
| 10 | 학습에 집중, 홍염 급전환 제거 | 외부 제안에 집중, 화개 급전환 제거 | 독립적 선택 + 시지 辰–월운 戌 충 |
| 11 | 지식 전달·문창 + 시지 반합/대운 파 | 생활 실속 + 원국 두 지지와의 삼합 | 협업 몫 + 월지 亥 자형, 기존 다음 행동 |
| 12 | 독립·시간 경계 + 월지 午–월운 子 충 | 책임 범위 + 대운 卯–월운 子 형 | 지속적 결과 + 세운 충/원국 두 지지 삼합 |

한 달의 직업 장면과 가까운 관계의 조언은 서로 다른 적용 영역으로 읽는다. 원국 일지 관계를 이유로 직장 사건이 발생한다고 연결하지 않았다. 구체적인 관계 대상과 행동 기준은 늘었지만 모든 달의 문체가 완전히 개별 저술처럼 달라진 것은 아니다.

A~F 모두 계산 `evidence`, 원국/MBTI/Fusion `materials`, 실제 통합 결과 `integration`의 전체 digest가 수정 전과 일치한다. 단순 일부 ID 개수 비교가 아니다. 월별 proof의 모든 `month-v2` ID는 해당 canonical 원장에 존재한다. D/F에 시주·시지 근거를 생성하지 않으며 E/F에 MBTI 출처·Fusion ID를 생성하지 않는다.

- 12개월 순서·완전성, 전체 절기 구간 연속성 유지.
- 2026 입춘 `2026-02-04 05:02:08 KST` -1초/정각/+1초 실제 생성: 己丑·乙巳 → 庚寅·丙午 → 庚寅·丙午.
- 2028 C 대운 `2028-04-23 21:42:00 KST` -1초/정각/+1초: 壬申 → 辛未 → 辛未. 월주 丙辰 유지. 실제 focus 구간 proof만 사용하며 이전 대운을 전환 뒤 문장에 넣지 않는다.
- 전환 불확실 구간은 정확한 전환일처럼 표현하지 않고, conditional 대운 관계를 확정 관계로 채택하지 않는다.
- 달력월이 바뀌어도 절입 전 같은 월운이 이어지면 연속된 흐름으로 설명한다. 경계 계산은 변경하지 않았다.
- 기존 2024~2027 절입 golden, UTC/Seoul/New York 경계 회귀 통과. 외부 천문력 독립 대조는 이번 작업의 증거가 아니다.
- 월 본문은 기존 대표 focus 구간을 설명한다. 전체 구간·정확한 시각은 기존 Book 월 목록의 details에 보존된다. 모든 구간을 각각 장문 해석하는 상품으로 확장하지 않았다.
- 동일 입력 두 번 생성 일치, 신규 snapshot 생성, JSON 저장·복원, 일반·공유 Book 데이터 일치 통과.
- **수정 전** 감사에서 저장한 Book 10개를 수정 후 코드로 재열람하여 전체 Book 데이터와 snapshot digest 동일. 2040년의 다른 실행 시각에서도 저장본 투영은 동일했다. 이는 저장본 투영 검증이지 90일 권한 정책을 우회하거나 운영 만료 링크를 허용했다는 뜻이 아니다.
- 다른 5상품의 실제 최종 draft/evidencePacket/Book digest가 기준 커밋과 일치했다. 별도 6상품 통합 품질 감사는 시작하지 않았다.

## 분량과 고객 간 중복

본문 문단 text의 공백 포함 글자 수 합계다. 표지·목차·만세력·MBTI 표·제목·UI·구분용 줄바꿈은 제외한다. 마지막 한 줄은 기존 감사와 동일하게 합산에서 제외했다. 측정 함수는 수정 전후 동일하다.

| 사례 | 본문 전 → 후 | 월 본문 전 → 후 | 월 문단 전 → 후 |
|---|---:|---:|---:|
| A | 8,401 → 10,442 | 5,586 → 7,237 | 48 → 56 |
| B | 8,729 → 10,362 | 6,084 → 7,329 | 52 → 57 |
| C | 8,807 → 10,754 | 5,907 → 7,469 | 51 → 58 |
| D | 8,888 → 10,940 | 6,072 → 7,733 | 52 → 60 |
| E | 7,841 → 9,751 | 5,481 → 7,133 | 47 → 55 |
| F | 8,173 → 10,094 | 5,819 → 7,481 | 50 → 58 |

마지막 한 줄까지 포함한 전체 해석 텍스트는 A 10,485 / B 10,399 / C 10,795 / D 10,983 / E 9,794 / F 10,137자다. 위 표는 기존 감사와 같은 문단 합계 비교다.

일반 입력의 문단 합계는 약 10,400~10,800자로 늘었다. 새 정보는 기간 출처, 관계 참여 요소, 조정/접점과 행동 기준이다. 글자 수 자체를 PASS 이유로 삼지 않았다.

월 문단 전체를 문자열로 비교하고, 날짜 정규화는 기존 감사대로 숫자+년/월만 치환했다. 한자·일간·이름을 제거하여 낮은 중복률을 만드는 방법은 쓰지 않았다. 비율은 각 원고의 월 문단 수를 분모로 한다.

| 고객 쌍 | 완전 동일 전 → 후 | 날짜 정규화 전 → 후 | 동일 달 전 → 후 | 정규화 비율 전 → 후 (양쪽 원고) |
|---|---:|---:|---:|---|
| AB | 17 → 2 | 18 → 3 | 0 → 0 | 37.50%/34.62% → 5.36%/5.26% |
| AC | 17 → 4 | 17 → 4 | 1 → 1 | 35.42%/33.33% → 7.14%/6.90% |
| BC | 19 → 4 | 19 → 4 | 1 → 0 | 36.54%/37.25% → 7.02%/6.90% |

**의미 반복은 문자열 중복보다 크다.** 새 간지·출처 문장만 붙었다고 공통 정의가 개별화된 것으로 세지 않았다. 같은 십성·등장 순서의 개념 핵심은 고객 쌍마다 **10쌍 → 10쌍** 그대로다. 행동+주의의 의미와 문장이 같은 쌍은 **AB 10→2, AC 10→4, BC 10→3**이다(회고/현재 등 바깥 안내를 제외한 action/avoid 직접 비교). 귀인·매력 등 유효한 공통 gift도 남는다. 이는 모든 문단을 대상으로 한 정량 의미 유사도 점수가 아니라, 공통 개념 핵심과 행동을 분리한 보수적인 독해/구조 비교다.

실제 다른 관계를 설명하는 새 interaction 문단은 A 12개, B 11개, C 12개다. 단, 관계 종류·적용 주제가 같은 일부 고객에게 공통 행동이 남는다. 예: A1/C9의 기대 차이 확인, A9/B3/C7의 부분 합의 확인. 지지 이름만 다르다는 이유로 기존 해석 자료에 없는 행동 차이를 창작하지 않았다. A3/B7/C1의 원래 동일했던 핵심 설명 전체는 이제 형의 책임 범위와 반합의 미합의 조건을 구분한다.

## 검증 명령과 결과

최종 관련 회귀 128 PASS / 12 SKIP / 0 FAIL:

- 신규 `annualEditorialQuality.test.ts`: 31 PASS. A~F 전체 근거 잠금, M01/M02/M03, 오류 입력, 불확실 전환, 시제, 실제 입춘·대운 경계, 결정론성, Book, 보호 5상품 digest.
- 기존 `annualNarrative.test.ts`, `annualSafety.test.ts`, `timeProduct.test.tsx`의 Annual 범위, `annualMonthJie.test.tsx`: 97 PASS. 제외된 12건은 기존 Major 고정 해시/Major fixture 및 이번 Annual 범위 밖 time 항목이다. 대신 현재 Base의 Major 실제 결과 digest를 위 신규 회귀로 비교했다.
- 최종 재생성 capture: 11 PASS. A~F, A2024/2025, 오프라인 A2027/C2028, 실제 미래 연도 차단. 성공 10개 원고 모두 편집 진단 0개·결정론성·발행 validation·Book roundtrip 확인.
- 추가 검사: 30 PASS / 22 FAIL. 수정 전 Book 10개, 월 관계 기존 회귀 및 기존 API/source 일부가 통과했다. 실패는 `annualPurchaseYearPolicy.test.ts` 21건 + `bookAnnualPreflight.test.ts` 1건. 기준 SHA를 `/tmp/.../base-checkout`에 `git archive`로 풀어 같은 설정으로 실행해 **동일 22건 실패 / 나머지 20건 통과**를 재현했다. 변경으로 생긴 실패가 아니다.

기존 추가 검사 실패 원인은 공개 결제 prepare의 same-origin 검사와 오래된 테스트 요청의 충돌이다. `src/app/api/payment-checkout/prepare/route.ts:319`가 `http://localhost`/Origin 없는 요청을 403 빈 응답으로 거절해 기대 200/400 및 JSON 읽기가 실패한다. 테스트만 통과시키기 위해 인증·origin·결제 코드나 테스트를 고치지 않았다. 로컬 PGlite 테스트만 실행했고 운영 DB에는 연결하지 않았다.

재현:

```sh
pnpm exec vitest run tests/unit/interpretation-v4/annualEditorialQuality.test.ts tests/unit/interpretation-v4/annualNarrative.test.ts tests/unit/interpretation-v4/annualSafety.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/report-generation/annualMonthJie.test.tsx --fileParallelism=false -t '^(?!.*(?:V4 Major byte hash|Major fixture|time relevance|time precision))'
pnpm lint
pnpm exec tsc --noEmit --incremental false
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
git diff --check
```

임시 `working.config.mts`는 위 파일·패턴 및 기존 networkGuard/alias와 동일하게 설정했다. 테스트만 다른 캐시 경로를 사용했다. 기준 커밋 실제 생성 결과의 digest는 `annualEditorialQualityLocks.json`에 고정했으며 수정 후 결과로 덮어쓰지 않았다.

Lint PASS. 전체 TypeScript는 기존 **390 → 390**, 새 진단 0, 제거된 진단 0; 경로·진단 코드·메시지 multiset 비교(행/열 이동만 정규화). 전체 TypeScript가 깨끗하다고 보고하지 않는다.

Build PASS. NFT 경고는 실제 기준 빌드 **10 → 8**. 전부 `Encountered unexpected file in NFT list`, import trace는 양쪽 모두 다음 하나이며 새 유형·trace가 없다:

```text
next.config.ts
→ src/lib/tickets/localDatabase.ts
→ src/lib/tickets/bundleLocalReview.ts
→ src/app/dev/account/tickets/api/[action]/route.ts
```

output asset의 chunk 식별자와 출력 순서는 빌드마다 달라질 수 있어 import trace와 구분했다. 기존 sandbox 빌드가 진행되지 않아 해당 로컬 빌드만 권한을 높여 실행했으며 배포하지 않았다. diff-check PASS.

전체 실제 원고·before/after 계산 및 측정은 `/tmp/gyeol-annual-editorial-quality-fix-01/`에 있다. `A.txt`~`F.txt`, 각 JSON, `metrics.json`, `final-tests.log`, `capture.log`, `extra-tests.log`, `extra-baseline.log`, `tsc-before.log`, `tsc-after.log`, `build-before.log`, `build-after.log`, `file-preservation.json`. 임시 산출물은 영구 배포 자료가 아니며, 재발 방지 테스트와 요약 근거는 저장소에 남겼다.

## 남은 한계와 출시 판정

- 확인된 6개 재현 문제: 해결. 계산/자료/다른 상품 결과 및 기존 Book: 보존.
- 의미 반복: PARTIAL. 같은 십성 핵심 10쌍과 일부 관계별 공통 행동은 남는다. 문자열 중복 감소 전체를 의미 개인화 성과로 주장하지 않는다.
- 독해: 관계 대상·출처는 구체화됐으나 한자와 전문 용어가 매월 한 문장씩 들어가 읽기 부담이 조금 늘었다. 짧은 관계 뜻과 기존 생활 장면이 설명을 보완한다. 모든 월이 완전히 독립된 맞춤 서사라고 보장하지 않는다.
- 코드/계산 회귀가 통과해도, 전체 판매 품질은 PARTIAL로 보수적으로 판정한다. 관계 의미가 같을 때 남는 공통 행동의 품질 수용 여부는 최종 원고 검수에서 판단할 수 있다. 이번 범위를 넘어서는 새 해석 체계는 만들지 않았다.
- 운영 로그인·owner·90일 만료·공유 token 접근·실제 결제·Worker·Production 발행은 미실행/UNVERIFIED. 이전 감사의 운영 미검증을 PASS로 바꾸지 않는다. 외부 역법 독립 검증도 미실행.
- 기존 22개 API/결제 연도 테스트 실패와 390 TypeScript 진단, NFT 경고는 남는다. 별도 승인 없는 수정은 하지 않았다.
- master merge/push, Production 배포, DB 변경, 다음 단계의 6상품 통합 검수는 하지 않는다.

## 요청된 결과 항목

| 항목 | 결과 |
|---|---|
| ROOT_CAUSE | 공통 원국 문단의 기간 장 혼입, brief의 관계 생략, god/occurrence 공통 행동, 일반 cross 템플릿, gift 제목 전용 정렬, 고정 시제 |
| NATAL_PERIOD_EVIDENCE | PASS — 원국/기간/MBTI 묶음 분리, 실제 간지·십성 표시 |
| MONTH_PERSONALIZATION | PASS — 대표 A3/B7/C1의 다른 관계·행동 기준, 일반 월에도 실제 근거 연결 |
| ANNUAL_MONTH_INTERACTION | PASS — 甲辰 세운–甲戌 월운 충 등 실제 대상·시기·조정 기준 |
| CROSS_PERSON_DIFFERENTIATION | 개선 — 동일 행동 10→2/4/3쌍, 공통 핵심 잔존 |
| SEMANTIC_REPETITION | PARTIAL — 공통 십성 핵심 10쌍 유지, 관계별 행동 틀 일부 반복 |
| KOREAN_GRAMMAR | PASS — 확인된 결합 오류 해결, 기존 조사 재사용 |
| PARAGRAPH_COHERENCE | PASS — 학습/친밀감 등 부적합 gift 삽입 차단 |
| YEAR_TITLE_ACCURACY | PASS — 과거/현재/오프라인 미래 구분, 운영 선택 정책 불변 |
| 12_MONTH_STRUCTURE | PASS |
| SOLAR_TERM_PRESERVATION | PASS — 입춘/대운/절기 구간 회귀, 계산 변경 없음 |
| MYEONGLI_EVIDENCE_INTEGRITY | PASS — A~F 전체 계산·근거 digest 동일 |
| UNKNOWN_INPUT_SAFETY | PASS — 시주/MBTI 추정 없음, 조건부 대운 확정 금지 |
| DETERMINISTIC_GENERATION | PASS |
| BOOK_PRESERVATION | PASS (로컬 신규 발행/저장 복원/이전 저장본 10개) / 운영 접근 UNVERIFIED |
| CROSS_PRODUCT_REGRESSION | PASS — 다른 5상품 draft/evidence/Book digest 동일 |
| HUMAN_READABILITY | 확인된 문장/출처/주제 오류 해결, 용어 밀도·공통 서사 한계 잔존 |
| NARRATIVE_LENGTH | A/B/C 10,442 / 10,362 / 10,754자, 분량 자체로 PASS 판정하지 않음 |
| TESTS | 관련 128 PASS, capture 11 PASS, 추가 30 PASS; 별도 기존 실패 22개 재현 |
| LINT_BUILD | PASS / PASS; TS 390 동일, NFT 10→8, 동일 유형·trace, diff-check PASS |
| BRANCH | v4/annual-editorial-quality-fix-01 |
| COMMIT_SHA | 이 보고서를 포함한 작업 커밋 — 최종 응답 및 git log 참조 |
| REMOTE_SHA_MATCH | push 뒤 최종 응답에 실제 조회 결과 보고 |
| REMAINING_ISSUES | 의미 반복, 용어 밀도, 기존 검사 실패·진단·경고, 운영 미검증 |
| RELEASE_QUALITY | PARTIAL — 확인된 6건의 수정은 PASS, 판매 전체 승인과 구분 |
| DEPLOY_READY | NO — 운영 미검증/최종 검수 미실시, 배포 금지 준수 |
