# V4-LOVE-EDITORIAL-QUALITY-FIX-01

기준 커밋 `c048218cc5961e0f53a1deab2603511e17559fc3`, 기준 브랜치 `v4/annual-editorial-quality-fix-01`에서 독립 worktree `/tmp/gyeol-love-editorial-quality-fix-01`와 `v4/love-editorial-quality-fix-01` 브랜치를 만들었다. 종합·커리어 작업 브랜치는 병합하지 않았다. 원본 checkout의 기존 11개 변경 파일은 수정하거나 stage하지 않았다.

판정: **이번 연애 원고 개선은 검수 통과. 전체 출시 준비는 PARTIAL / 배포 보류**. 새 오류는 발견하지 않았지만 기준 커밋에도 존재하는 Page export build 실패가 계속되므로 배포 가능으로 판정하지 않는다. 고객 간 공통 생활 조언과 일부 정형 문장은 MINOR로 남는다. 자동 테스트의 성공만으로 원고 품질을 판정하지 않고 A/B/C의 108문단 전문과 최종 변경 문장을 직접 읽었다. D/E/F는 미상 입력의 근거 및 대체 문장을 확인했다.

## 생성 경로와 변경 범위

실제 유료 V4의 `paidRuntime.runPublicPaidReportJob`이 사용하는 `generateV4ShadowReport` → 기존 명리 계산·MBTI source adapter·Fusion → `buildV4LoveProduct` → `renderLoveRelease` → 기존 검증·Book projection을 오프라인에서 실행했다. 평가 시각은 `2026-10-12T12:00:00+09:00`로 고정했다. 외부 AI 호출, 결제, DB 저장, 운영 Worker 실행은 없다.

- `loveReleaseRenderer.ts`: 문단의 질문별 적용, 유효한 signed axis와 실제 Fusion 양측 출처 검사, 덜 사용한 실제 root 우선 선택, CH04 상태별 문맥, CH06 취약점/원인/확대/조율, CH07 공동생활, CH08 조건부 양육, CH09 실제 좋은 기운과 상호 참여를 편집했다.
- `loveReleaseApplications.ts`: 기존 15개 facet(축과 방향)에 연결하는 조건부 생활 장면과 질문별 재료를 추가했다. 새 명리 계산·점수·MBTI 유형 추론이 아니다.
- `loveReleaseParenting.ts`: 실제 본인 parenting trait ID별로 16유형 장점 문장을 고객용으로 편집했다. 원천 DB와 기존 위험 재료는 변경하지 않았다.
- `loveReleaseSources.ts`: 실제 `metadata.slot`에 따라 십성의 천간/지장간 표시를 구분했다. 근거 ID·계산은 그대로다.
- `loveReleaseContext.ts`, `loveReleaseContracts.ts`: 지원되는 6상태의 고객 문구와 새 생성 편집본 version만 변경했다.
- `loveQuality.test.ts`, fixtures/locks: 아래 A~F, signed Fusion, 미상 입력, 기존 저장본, 다른 5상품 기준 해시를 회귀 검사한다.

명리 계산·만세력·MBTI 원천 DB·Fusion 계산과 ID·다른 5상품 생성기·발행 gate·결제·환불·Supabase·migration·환경변수·Production은 수정하지 않았다. 저장된 예전 Book에는 새 렌더러를 호출하지 않는다.

## 실제 입력 및 분량

본문만 측정했다. 표지·제목·목차·만세력·MBTI 표·뒤표지를 제외하고 공백과 문단 구분 `\n\n`을 포함했다. 문장 수나 분량 감소 자체를 품질 판정으로 사용하지 않았다.

| 사례 | 가상 입력 / 상태 | 수정 전 문단·글자 수 | 수정 후 문단·글자 수 | 생성·검증 |
|---|---|---:|---:|---|
| [A 전문](manuscripts/A-comparison.md) | 최서아 / 1996-05-24 / 22:10 / INFP / single | 36 · 9,720 | 36 · 8,399 | PASS · 9장 / 36문단 |
| [B 전문](manuscripts/B-comparison.md) | 서윤 / 1994-11-18 / 07:42 / ENFP / dating | 36 · 8,991 | 36 · 8,318 | PASS · 9장 / 36문단 |
| [C 전문](manuscripts/C-comparison.md) | 서진 / 1990-07-18 / 05:30 / ENTJ / married | 36 · 9,025 | 36 · 8,528 | PASS · 9장 / 36문단 |
| [D 전문](manuscripts/D-comparison.md) | 최서아 / 1996-05-24 / 시간 미상 / INFP / single | 36 · 9,700 | 36 · 8,126 | PASS · 9장 / 36문단 |
| [E 전문](manuscripts/E-comparison.md) | 최서아 / 1996-05-24 / 22:10 / MBTI 미상 / single | 34 · 8,998 | 36 · 8,425 | PASS · 9장 / 36문단 |
| [F 전문](manuscripts/F-comparison.md) | 최서아 / 1996-05-24 / 시간 미상 / MBTI 미상 / single | 34 · 9,085 | 36 · 8,085 | PASS · 9장 / 36문단 |

E/F는 기존 독립 재료 선택에서 34문단이던 슬롯도 유효한 명리 조건부 적용으로 채워졌다. MBTI나 시주를 만들어 36문단을 맞추지 않았다. 모든 최종 편집 진단 `hardErrors=[]`, `qualityIssues=[]`; 실제 Book narrative 36개 텍스트는 readerEdition과 순서·내용이 정확히 일치한다.

## 원인과 7개 개선 결과

1. **같은 성향 재설명**: 기존 최초 정의와 재호출마다 비슷한 정의/조언을 붙였다. 이제 용어 정의는 최초 위치에서 전달하고 같은 성향을 다시 쓸 때는 수용 방식, 제안의 속도, 갈등 장면, 가사 분담처럼 질문을 바꾼다. 대표 설명은 CH01 기본 힘, CH02 매력, CH03 선택 조건, CH06 위험에 둔다. CH09는 앞선 근거를 명시적으로 RECALL하며 상호 참여·과도한 자기 책임을 새로 다룬다.
2. **Fusion 비약**: 같은 관계 도메인이라는 이유만으로 다른 signed axis의 노드를 넣을 수 있었다. 새 표현은 기존 Fusion ID에 포함된 실제 명리 atom 및 실제 MBTI source node, 같은 축·방향의 annotation까지 모두 확인한다. INFP의 불공평/무례에 대한 경계는 거절을 연애 거부로 읽는 이야기로 연결하지 않는다. 실제 보완 관계는 기존 검증된 `fusionHumanSurface`를 재사용한다. 해석이 확보되지 않은 TENSION은 조건을 꾸미지 않는다.
3. **상대 이미지**: 부족한 오행의 상징 이미지를 이상형처럼 넣던 `loveBalance` 경로를 새 편집본에서 쓰지 않는다. 본인의 검증된 필요 → 상대가 보이는 행동 → 실제 선택에서 확인할 조건으로 바꿨다. 상대의 사주·유형·궁합 순위는 생성하지 않는다.
4. **팩폭**: 같은 공격적인 trap 3회 반복 대신 강한 실제 위험 후보와 root를 선택한다. A는 세심한 지적의 과사용, B는 설명을 닫는 경계, C는 공동 결정의 알림을 생략하는 독립성으로 달라진다. CH06 P1 위험, P2 발생 조건, P3 실제 대화의 확대 경로, P4 다음 행동의 합의가 서로 다른 정보를 준다.
5. **결혼·양육**: CH07은 집안일의 준비/실행/마무리, 보이지 않는 관리자 역할, 공동 지출과 개인 몫, 가족 지원, 사정이 바뀔 때의 재분담을 다룬다. CH08은 본인 parenting의 장점 두 종류와 실제 위험을 나누고 아이의 선택 범위·책임·도움 요청 통로를 설명한다. 자녀 보유나 아이 성격은 추정하지 않는다.
6. **내부 표현**: 원천 MBTI 문장을 따옴표로 직접 삽입하던 구조를 고객용 편집 재료로 바꿨다. “본인 양육 자료”, “실제 관계 자료”, “MBTI 관계 근거를 확인하지 못했다면”이 최종 A~F 본문에 없다. 부족한 근거는 명리 조건부 적용으로 전환하며 가짜 MBTI/Fusion 설명을 만들지 않는다.
7. **기계적 구성**: 문단 끝의 일반적인 채움 문장을 덜고 용어 정의 중복을 제거했다. 문단마다 3~5문장 계약은 유지하며 억지로 4문장씩 맞추지 않는다. 조건형을 지우는 대신 발생 조건과 관찰할 행동을 구체화했다.

## 챕터별 실제 전후 문장과 추가 정보

아래는 A의 실제 생성 문장에서 발췌했다. 전체 문단과 문장별 실제 ID/provenance는 각 전문 및 [evidence.json](evidence.json)에 모두 보존했다.

### CH01 · 명리와 MBTI가 설명하는 사랑

수정 전: 금 기운은 이 관계 성향을 설명하는 실제 원국 근거입니다. 금 기운에 담긴 뜻은 ‘필요한 것과 필요 없는 것을 가르고 기준을 세우는 기운’입니다. INFP의 관계 자료에서는 ‘INFP는 잔인함과 불공평에 깊은 고통을 받는다’의 경향을 함께 살펴볼 수 있습니다. 이 두 모습이 겹치면 거절을 관계의 거부로 보지 않는 태도를 더 중요하게 느낄 수 있어, 가까운 사람에게도 받아들일 부탁과 어려운 부탁을 미리 나누는 일이 마음을 전하는 통로가 됩니다.

수정 후: 일주 지지 유금의 성향을 관계에 적용하면, 요청을 받으면 들어줄 수 있는지부터 확인하고 내 기준도 지키고 싶어 하는 면을 살펴볼 수 있습니다. INFP의 관계 성향에서도, 무례하거나 불공평한 대우에는 거리를 두고 자기 기준을 지키려는 면을 살펴볼 만합니다. 가까워지고 싶은 마음과 별개로 서로 존중받을 선을 중요하게 본다는 점이 겹치며, 친밀함을 위해 불편한 대우까지 참을 필요는 없다는 기준으로 활용할 만합니다.

기본 힘과 가치/수용 방식을 나눴다. 관계 노드의 도메인뿐 아니라 실제 Fusion 양측의 축과 방향까지 확인한다.

실제 명리: `natal:day:branch:酉`; MBTI: `mbti:INFP:traits:relationships:boundary_against_cruelty:plainKo`; Fusion: `fusion:REINFORCE:BOUNDARY:social:BOUNDARY:1:BOUNDARY:1`.

### CH02 · 가까워질수록 살아나는 매력

수정 전: 처음의 인상과 별개로 가까워진 뒤에는 자기 자리를 지키는 독립성이 관계의 다른 좋은 면으로 드러날 수 있습니다. 시주 편인에서 읽는 ‘남들이 지나친 이유나 다른 관점을 깊게 파고드는 성질’의 의미가 이 성향의 바탕입니다. 같은 공간에서 각자 다른 일을 하다가 문득 이야기를 나누는 시간처럼, 계속 반응하지 않아도 이어지는 친밀함을 소중하게 느낄 수 있습니다. 이 매력은 혼자 쓸 시간과 함께할 시간을 따로 알리는 일을 자연스럽게 이어갈 때, 특별히 잘 보이려던 하루보다 오래 믿을 이유가 됩니다.

수정 후: 시간을 함께 보내며 알게 될 좋은 면은 자기 자리를 지키는 독립성입니다. 명리에서 시주 천간 편인은 ‘남들이 지나친 이유나 다른 관점을 깊게 파고드는 성질’이라는 뜻으로 풀이합니다. 같은 공간에서 각자 다른 일을 하다가 문득 이야기를 나누는 시간처럼, 계속 반응하지 않아도 이어지는 친밀함을 소중하게 느낄 수 있습니다. 각자의 활동에서 새로 알게 된 것을 돌아와 나누면, 둘이 늘 같은 일을 하지 않아도 관계에 새로운 이야기를 가져오는 매력이 됩니다.

처음의 배려와 가까워진 뒤의 독립성, 정확함과 돌봄의 보완을 다른 매력으로 설명한다.

실제 명리: `natal:ten-god:hour:visible:己`; MBTI: 없음; Fusion: 없음.

### CH03 · 서로 다른 모습이 도움이 될 때

수정 전: 목의 가지가 뻗는 모습을 닮은 사람은 새로운 경험을 재촉이 아니라 초대로 건넵니다. 다 알아본 뒤에 움직이려 할 때 작은 시도 하나를 같이 해보자는 사람입니다. 생각을 그만하라는 말 대신 궁금한 것을 밖에서도 만나게 해주는 관계가 어울릴 수 있습니다.

수정 후: 바로 결론을 말하는 나와 말을 고르며 생각하는 사람이 만난다면, 답이 늦다는 이유로 회피라 정하지 않을 때 분명함과 신중함이 함께 쓰입니다. 차이가 도움이 되려면 의견 차이를 말해도 안전한 대화가 먼저 지켜져야 하며, 한 사람이 계속 참아서 균형을 만드는 것과는 다릅니다. 작은 약속을 서로 다른 방법으로 정해본 뒤 누가 무엇을 편하게 느꼈는지 이야기하면, 반대 성향이라는 이름보다 실제로 보완되는 행동을 확인할 수 있습니다.

오행 이미지로 상대를 예측하는 대신 본인의 필요와 확인할 소통 행동을 제시한다.

실제 명리: `natal:day:stem:辛`; MBTI: 없음; Fusion: 없음.

### CH04 · 호감이 생겼을 때의 나

수정 전: 지금 솔로인 상태에서는 새로운 만남에서 내 관심이 어떻게 드러나는지 살펴볼 수 있으며, 아직 정해지지 않은 상대의 마음까지 예측하지는 않습니다. 일주 비견에서 읽는 ‘남이 정한 답보다 자기 힘과 판단을 믿으려는 성질’의 의미가 이 성향의 바탕입니다. 내가 좋아하는 일과 생각을 억지로 바꾸지 않고 보여주는 태도는, 잘 보이기 위해 맞춘 모습보다 선명한 관심의 이유가 될 수 있습니다. 관심이 매력으로 전해지려면 혼자 쓸 시간과 함께할 시간을 따로 알리는 일을 하되, 상대의 답을 내 기대에 맞게 대신 만들어두지 않을 여지가 필요합니다.

수정 후: 지금 솔로라면 새로운 만남에서 관심을 전하는 방법과, 아직 알아가는 상대의 답을 기다리는 여유를 함께 살펴볼 만합니다. 시주 천간 기토는 ‘필요한 것을 챙겨 실제 생활이 굴러가게 만드는 성질’의 뜻으로 읽습니다. 피곤하다는 말을 들으면 해결할 일을 덜어주고 싶어질 수 있지만, 위로가 필요한지 실제 도움이 필요한지는 한 번 더 물어볼 만합니다. 상대의 반응을 관계의 결론으로 서둘러 읽기보다, 다음 대화나 만남에도 서로 관심을 이어가는지 알아갈 시간이 필요합니다.

솔로의 관심 전하기와 상대의 답 기다리기를 구분한다. B/C는 같은 자리에 현재 연애/기혼의 표현을 새로 묻는다.

실제 명리: `natal:hour:stem:己`; MBTI: 없음; Fusion: 없음.

### CH05 · 깊은 관계에서 원하는 것

수정 전: 깊은 관계에서도 거절을 관계의 거부로 보지 않는 태도가 필요하며, 가까운 사이라는 이유로 그 조건이 사라지지는 않습니다. 월주 정관에서 읽는 ‘기준과 책임을 지키며 신뢰와 인정을 쌓으려는 성질’의 의미가 이 성향의 바탕입니다. 거절을 들었을 때 이유를 캐물어 바꾸려 하기보다 가능한 범위를 같이 찾는 사람과는, 가까워질수록 선을 더 세게 지킬 필요가 줄어듭니다. 이 필요를 말하지 않으면 경계를 세운 이유까지 설명하지 않는 습관이 반복될 수 있어, 상대가 이미 안다고 정하지 않는 대화가 중요합니다.

수정 후: 친밀해질수록 살펴볼 정서적 조건은 거절을 관계의 거부로 보지 않는 태도입니다. 명리에서 월주 지장간 정관은 ‘기준과 책임을 지키며 신뢰와 인정을 쌓으려는 성질’이라는 뜻으로 풀이합니다. 도움을 거절한 날에도 관계 자체를 닫은 것은 아니라는 점을 알려주면, 상대도 다른 방법을 제안할 자리를 찾을 수 있습니다. 부담스러운 날에는 받아들일 부탁과 어려운 부탁을 미리 나누는 일을 작게 시작해보면, 무엇이 부족한지 따지기 전에 서로 편해질 도움의 크기를 고를 수 있습니다.

친밀함에서 필요한 경계를 거절 일반론이 아니라 부탁의 범위와 개인 공간으로 다룬다.

실제 명리: `natal:ten-god:month:MAIN:丙`; MBTI: 없음; Fusion: 없음.

### CH06 · 연애에서 가장 아픈 단점

수정 전: 틀린 걸 보면 말이 날카로워질 수 있습니다. 어느 말이 맞는지부터 판정하면 상대는 설명을 보태기보다 말을 줄일 수 있고, 바로잡고 싶었던 문제의 이유도 더 늦게 알게 됩니다. 내 의도는 관계를 지키는 것일 수 있어도 정확한 말이면 상처도 정당하다고 여기는 습관이 반복되면, 상대는 내 진심보다 자신에게 요구된 반응을 먼저 느낄 수 있습니다. 맞는 말을 끝낸 뒤 상대가 입을 닫았다면, 그 대화에서 이겼다는 것이 좋은 결과는 아닐 수 있습니다.

수정 후: 연애에서 가장 먼저 돌아볼 취약점은 작은 차이를 알아보는 세심함을 한 가지 방식으로만 밀어붙일 때 나타납니다. 더 편해지게 하려던 지적이 연달아 나오면, 상대는 좋은 점보다 부족한 점을 더 자주 들으며 언제쯤 충분해질지 몰라 지칠 수 있습니다. 틀린 점을 다 고친 뒤 좋았던 말이 하나도 없다면, 세심함이 계속 함께 있고 싶은 이유가 되기는 어렵습니다.

공격적인 성격 규정 대신 세심함이 연속 지적으로 과사용되는 조건을 설명한다.

실제 명리: `natal:day:stem:辛`; MBTI: 없음; Fusion: 없음.

### CH07 · 함께 사는 사람에게 줄 수 있는 힘

수정 전: 공동생활에서 줄 수 있는 다른 힘은 상대의 반응을 놓치지 않는 감각이며, 사랑하는 마음이 어떤 수고로 이어지는지 보이는 부분입니다. 년주 천간 병화에서 읽는 ‘안에만 머물지 않고 밖으로 밝게 드러나는 성질’의 의미가 이 성향의 바탕입니다. 공동생활에서는 누가 더 피곤한지 잘 알아보는 힘이 도움이 되지만, 분위기가 좋다는 이유로 분담의 불균형까지 괜찮아졌다고 보지는 않아야 합니다. 함께 맡을 일을 이야기할 때 표정으로 짐작한 마음을 말로 한 번 묻는 일을 시도하면, 좋은 의도를 알아주길 기다리기보다 실제로 편해질 생활을 만들기 좋습니다.

수정 후: 공동생활의 역할을 나눌 때 활용할 다른 힘은 필요한 것을 먼저 살피는 다정함입니다. 식사 준비처럼 먼저 눈에 띄는 일과 생필품을 기억해 사두는 보이지 않는 준비를 함께 적으면, 챙긴 사람에게만 다음 일도 돌아가는 구조를 알아보기 쉽습니다. 분담은 눈앞의 일을 반씩 하는 것에 그치지 않으며, 준비를 기억하고 끝난 뒤 확인하는 일까지 맡은 몫에 포함해야 한쪽이 계속 관리자 역할을 하지 않게 됩니다.

배려를 생활의 준비/기억/마무리 역할에 적용해 보이지 않는 일의 분담까지 설명한다.

실제 명리: `natal:ten-god:year:MAIN:癸`; MBTI: 없음; Fusion: 없음.

### CH08 · 내가 부모가 된다면

수정 전: 양육을 선택한다면 INFP의 본인 양육 자료에 있는 ‘INFP 부모는 원리·원칙적이고 엄격한 부모보다 자녀의 자율성을 지향한다’의 경향을 참고할 수 있습니다. 월주 식신의 성향도 돌봄을 제공하는 본인의 반응에 적용해 볼 수 있습니다. 부모 역할을 맡는다면 아이의 불편을 일찍 살피는 데 힘을 쓸 수 있으며, 바로 대신하기보다 도움이 필요한지 묻는 여유가 중요합니다. 부모에게 자연스러운 방식이 아이에게도 늘 편한 방식은 아니므로, 좋은 의도보다 아이의 반응을 보며 도움의 크기를 맞추는 일이 중요합니다.

수정 후: 양육을 선택한다면, 남과 똑같이 해내는 것보다 자기 취향과 의견을 가질 권리를 지켜주고 싶을 수 있습니다. 옷이나 놀이처럼 골라도 되는 일을 두 가지 정도로 열어두면, 존중한다는 마음이 직접 선택해보는 경험으로 옮겨갑니다. 부모 역할을 맡는다면 아이의 불편을 일찍 살피는 데 힘을 쓸 수 있으며, 바로 대신하기보다 도움이 필요한지 묻는 여유가 중요합니다.

원천 자료 인용을 없애고 실제 INFP autonomy_parent에 연결한 선택권의 생활 장면을 제시한다.

실제 명리: `natal:ten-god:month:visible:癸`; MBTI: `mbti:INFP:traits:parenting:autonomy_parent:plainKo`; Fusion: 없음.

### CH09 · 내가 가진 좋은 사랑의 기운

수정 전: 가까워질수록 더 살아나는 매력이 있습니다. 홍염살은 멀리서 눈에 띄는 것과 달리, 가까이 지내며 알게 되는 모습에서 살아나는 매력이에요. 함께 있던 사람의 말투나 표정이 달라지면 무슨 일이 있는지 빨리 알아차립니다. 첫 만남에서 다 보여주지 않아도 괜찮은 매력이에요. 함께 지내며 알게 되는 모습이 관계를 더 가깝게 만들 수 있죠.

수정 후: 가까워질수록 더 살아나는 매력이 있습니다. 홍염살은 멀리서 눈에 띄는 것과 달리, 가까이 지내며 알게 되는 모습에서 살아나는 매력이에요. 가까워질 기회가 생겨도 서로 마음을 알아갈 시간과 실제 선택이 있어야 관계로 이어집니다. 좋은 기운을 호감이나 결혼의 보장으로 여기기보다, 내가 편하게 드러날 자리를 알아보는 가능성으로 받아들이면 좋습니다.

계산된 홍염 설명을 보존하되 표정 읽기 재설명을 덜고 기회와 실제 선택을 구분한다.

실제 명리: ; MBTI: `mbti:INFP:traits:identity:gentle_joan_of_arc:plainKo`, `mbti:INFP:traits:love:deep_emotional_bond:plainKo`, `mbti:INFP:traits:marriage:devotion_and_boundary:plainKo`, `mbti:INFP:traits:strengths:conflict_mediation:plainKo`, `mbti:INFP:traits:strengths:non_interfering_kindness:plainKo`, `mbti:INFP:traits:strengths:warm_worldview:plainKo`; Fusion: `fusion:REINFORCE:SOCIAL_ATTUNEMENT:love:SOCIAL_ATTUNEMENT:1:SOCIAL_ATTUNEMENT:1`.

## 근거 검수

- A CH01.P2: `natal:day:branch:酉`의 BOUNDARY +1, `mbti:INFP:traits:relationships:boundary_against_cruelty:plainKo`, `fusion:REINFORCE:BOUNDARY:social:BOUNDARY:1:BOUNDARY:1`. 고객 문장은 “무례하거나 불공평한 대우에는 거리를 두고 자기 기준”이라는 해당 노드의 의미를 유지한다. 첫 문장은 명리, 둘째 MBTI, 셋째 실제 공통점을 각각 증명한다.
- A CH02.P3: 실제 PRECISION/CARE 보완 Fusion과 양측 root/node를 사용해 틀린 부분을 알아차리는 힘이 사람을 몰아붙이는 말로만 흐르지 않을 조건을 제시한다. 단순히 INFP라는 이유로 배려를 붙이지 않는다.
- CH06 P2에 MBTI를 함께 언급하는 경우에도 해당 root facet과 같은 signed axis를 지원하는 실제 관계 노드만 독립 출처로 연결한다. 없으면 MBTI 문장을 생략한다. 명리 atom 하나를 개인의 과거 행동 증명으로 취급하지 않는다.
- A CH09 홍염: 계산된 `supplement:marker:HONGYEOM`에 실제 `DAY_STEM_TO_BRANCH`, `dayStem=辛`, `branch=酉`, `position=day`, `shinsal:HONGYEOMSAL`, `canonical-natal-table-v1:features:sinsal_hongyeom` 출처가 있다. 기존 `l-good-10`의 처음 두 문장/원래 block proof를 유지하고 성공 보장이 아닌 활용 조건으로 마무리했다.
- 기존 fortune asset은 원래 문단 전체의 union proof를 보존한다. 이를 모든 MBTI 노드가 모든 Fusion을 증명하는 Cartesian 연결로 해석하지 않는다. 새 Fusion 문장은 별도로 양측 signed source를 검사한다.
- 사용되지 않은 적격 root도 [evidence.json](evidence.json)에 기록했다. 입력 A의 남은 root 3개를 모두 문장에 넣어 분량을 채우지 않았다.

## 관계 상태·미상 입력·저장본

A는 현재 연인이 있다고 단정하지 않고 새로운 만남을 다룬다. B는 이미 연애 중인 사이의 달라진 필요와 익숙한 표현을 다룬다. C의 CH04 문단 제목과 본문에는 현재 썸/첫 만남을 강요하지 않고 생활 운영과 관심 표현을 구분한다. 기존 테스트의 지원 6상태 모두 유지했다.

D에는 시주 근거가 없고, E/F에는 MBTI source node·유형·새 Fusion이 없다. F의 CH08은 성인의 검증된 명리 성향을 돌봄 선택에 조건부로 적용하며 자녀 성격을 만들지 않는다. 모든 A~F 계산·만세력 표·MBTI 표·기존 personalDigest는 기준 SHA와 정확히 같다.

실제 새 ProductPreviewSnapshot을 JSON 직렬화/복원한 뒤 owner/shared `storedBook`으로 같은 Book을 읽었다. 이전 `love-editorial-base.json` 저장본도 렌더러를 다시 호출하지 않고 동일하게 재열람했다. `bookPublicFlow.test.tsx`의 V3/유효하지 않은 snapshot 재생성 금지 및 기존 URL/token/gate 계약이 전후 31/31 통과했다. 이는 로컬 저장본/API 컴포넌트 검증이며 Production 로그인·실결제 재검증을 했다는 뜻은 아니다.

## 반복·고객 간 차이의 정직한 비교

| 지표 · A | 수정 전 | 수정 후 |
|---|---:|---:|
| ‘수 있습니다’ | 44 | 23 |
| 반복 정의 틀 | 13 | 0 |
| 공격적인 동일 trap | 3 | 0 |
| 내부 자료·선택 문구 | 4 | 0 |

| 비교 | 공통 문장 전→후 | 동일 문단 전→후 | 동일한 장 전체 |
|---|---:|---:|---:|
| AB | 30→34 | 1→1 | 0→0 |
| AC | 30→26 | 0→1 | 0→0 |
| BC | 23→27 | 1→0 | 0→0 |

문자열 공통 문장 합계는 83→87로 줄지 않았다. 이를 고객 간 전면적인 중복 감소로 주장하지 않는다. A/B의 CH08.P4는 같은 attune 적용과 자율성/책임의 안전 조언이며, A/C의 CH09.P1은 실제 공통 홍염 근거의 설명이다. 일반 원칙을 이름만 바꿔 개인화 성과로 계산하지 않았다. 공통 문장과 양쪽 근거는 [common-copy.json](common-copy.json)에 공개했다.

의미 차이는 다음처럼 확인했다. A는 辛의 세부 기준, INFP의 무례/불공평 경계, 선택권·공감 양육을 다룬다. B는 戊의 지속성, ENFP의 표현과 안정의 보완, 경계를 설명하지 않는 위험, 정서적 응원과 반복 습관을 다룬다. C는 甲의 자기 방향, ENTJ의 직접 결정 성향, 공동 결정의 알림 생략, 높은 기대와 아이의 실제 가능한 단계를 구분한다. CH07의 구체적 공동생활 장면도 실제 선택된 facet에 따라 달라진다.

챕터 간에는 A의 세심함을 CH01 기본 스타일, CH04 초기 오해, CH06 연속 지적과 설명 감소의 갈등, CH09 장점의 관계적 사용으로 나누었다. 같은 기본 근거를 반복 사용하는 것은 남지만 각 위치에서 새로운 질문에 답한다. 의미 중복 개선은 PASS, 고객 간 전체 공통 문장 감소는 PARTIAL로 구분한다.

## 테스트와 기존 기준선

기준 SHA와 같은 환경에서 전후 측정했다. 과거 해시를 현재 값으로 덮어서 기존 실패를 숨기지 않았다.

| 검증 | 기준 SHA | 변경 후 | 판정 |
|---|---|---|---|
| loveRelease/Narrative/Safety/Discovery | 104 PASS / 2 FAIL (106) | 기존 104 PASS / 동일 2 FAIL | 새 실패 0 |
| 새 loveQuality | 없음 | 16/16 PASS | A~F, signed Fusion, 상태, 결정론, 저장본, 다른 5상품 |
| 최종 위 5개 파일 합계 | — | 120 PASS / 2 기존 FAIL (122) | 최신 코드 재실행 |
| bookPublicFlow | 31/31 PASS | 31/31 PASS | gate/V3/저장본/공유 경계 |
| annualPurchaseYearPolicy + bookAnnualPreflight + careerProductLocks | 5 PASS / 24 FAIL (29) | 5 PASS / 동일 24 FAIL | API 경계 22 + 오래된 major/annual hash 2 |
| 실제 전체 캡처 | A~F + 다른 5상품 | 11/11 PASS | Mock/외부 AI 없음 |
| lint | PASS | PASS | 새 lint 오류 0 |
| tsc --noEmit --pretty false --incremental false | 390 | 390 | 진단 문자열 multiset 동일, 추가/제거 0 |
| build --webpack | FAIL: report/new Page export | 동일 오류 클래스·파일 | 배포 보류 |
| git diff --check | — | PASS | 관련 파일만 |

기존 loveRelease 실패: `major remains identical at the release boundary`, `annual remains identical at the release boundary`. careerProductLocks의 동일 두 상품도 오래된 expected digest로 실패한다. 새로 고정한 기준 SHA의 실제 다른 5상품 draft/evidence/Book digest는 모두 정확히 같다. 전체 값은 [preservation.json](preservation.json)에 있다.

빌드 조건: `OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npx next build --webpack`. 기준은 번들 컴파일 후 `src/app/report/new/page.tsx`의 `getAsiaSeoulCurrentYear` invalid Page export로 실패했고, 최종 실행도 동일 파일의 `getAnnualFortuneYearOptions` invalid Page export로 실패했다. 두 export 모두 기준 코드에 존재하며 해당 파일은 변경하지 않았다. 이번 변경의 새 경고 유형은 없다. NFT 단계에는 도달하지 않아 과거 NFT 건수를 이번 실행 결과로 재사용하지 않는다.

실행 명령:

```sh
npx vitest run tests/unit/interpretation-v4/loveQuality.test.ts tests/unit/interpretation-v4/loveRelease.test.ts tests/unit/interpretation-v4/loveNarrative.test.ts tests/unit/interpretation-v4/loveSafety.test.ts tests/unit/interpretation-v4/loveDiscovery.test.ts
npx vitest run tests/unit/app/bookPublicFlow.test.tsx
npx vitest run tests/unit/payment/annualPurchaseYearPolicy.test.ts tests/unit/api/bookAnnualPreflight.test.ts tests/unit/interpretation-v4/careerProductLocks.test.ts
npm run lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npx next build --webpack
npx tsc --noEmit --pretty false --incremental false
git diff --check
```

## 남은 문제와 출시 판단

- **BLOCKER / 기존 기술 기준선**: Page export build 실패. 이번 연애 원고 범위에서 수정하지 않았다. build가 성공하기 전에는 배포 준비 완료가 아니다.
- **MAJOR / 새 원고 문제**: 이번 A~F 및 전체 A/B/C 독해에서는 확인하지 못했다. 모든 가능한 고객 입력의 판매 품질을 보증하는 판정은 아니다.
- **MINOR**: 질문별 적용을 구체화했으나 “살펴볼 만합니다”, “관계에서 따로 살펴볼 힘” 같은 정형 어조와 일반적인 상호 존중 조언은 남는다. 공통 근거의 문장·문단도 일부 같다. 이를 숨기려고 임의 동의어·없는 근거를 추가하지 않았다.
- **검증 한계**: Production 신규 주문/로그인/실결제·실제 공유 수신자 브라우저를 실행하지 않았다. 로컬 결정론 생성, Book 저장·재열람, 기존 공개 흐름 테스트까지만 확인했다.

원고 품질: 검수 입력 내 주요 7개 문제 개선 PASS, 고객 간 전면적인 중복 감소 PARTIAL. Production 배포 판단: 보류. 다른 상품 작업, 정책 변경, 기존 build/API 기준선 수정 및 배포는 자동 진행하지 않는다.

## 산출물

- `manuscripts/A-comparison.md`~`F-comparison.md`: 수정 전후 전문과 모든 문장별 근거. 각 before/after `.txt`는 본문을 변형하지 않은 읽기용 텍스트다.
- `metrics.json`: 실제 분량, 문장/문단/장 수, 반복 지표, 원문 SHA-256.
- `evidence.json`: 실제 문장별 candidate/atom/MBTI/Fusion ID와 provenance, 실제 사용한 근거 및 사용하지 않은 적격 root. `sentenceAssignments`의 `[S번호, source index]`는 같은 phase의 `sentenceSources`(0부터 시작)를 가리킨다. 반복되는 출처는 한 번만 기록했다.
- `common-copy.json`: 실제 고객 간 공통 문장과 양쪽 출처.
- `preservation.json`: 다른 5상품 전체 draft/evidence/Book 및 A~F 계산/표/personalDigest의 기준 SHA 일치.
- `verification.json`, `logs/`: 검증 결과 및 실행 로그(파일 끝의 빈 줄만 제거).
