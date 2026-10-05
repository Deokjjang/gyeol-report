# V4 Phase 13B — Product narrative planner and reading UX

## 1. 범위와 기준점

- 시작 SHA / fetch 당시 origin: `80709a2bf0140d9a5d48c54bfd85aa6ff02f7a1a`, `v4/rebuild`.
- 명리 자체의 사람 이야기 → 명리×MBTI의 겹침/차이 → 그 힘을 쓰는 선택이 상품의 중심이다.
- 변경: V4 evidence 선택·표현 허용 수준, 상품별 읽기 우선순위, 궁합 해석 지수, Book 정보 지도·읽기 동작.
- 보존: canonical 계산, MBTI source DB, V3, versioned packet/completeness, Auth/Library/ownership/payment/ticket/coupon/share/referral/campaign/Meta의 business logic, public gates/routes.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 사용자 변경으로 제외한다. Production/master/deploy 작업 없음.

## 2. 진단과 새 흐름

| 기존 문제 | 원인 | 변경 |
|---|---|---|
| 강한 말/완곡한 말의 근거가 불분명 | 선택한 feature 수와 독립 근거가 구분되지 않음 | 같은 theme의 독립 root로 표현 허용을 먼저 결정 |
| 비슷한 MBTI 연결 꼬리문장 | domain보다 공통 bridge 표현에 의존 | domain DB trait + 실제 selected root + 구체적 scene |
| Career에 연애, Love에 업무 문맥 | fallback Fusion의 domain 범위가 넓음 | 상품별 허용 lens 제한, 맞지 않는 fallback 미사용 |
| 모든 연도/월의 비슷한 밀도 | 기간의 중요도와 작성 분량이 분리되지 않음 | 계산 근거 기반 reading priority → 깊이/MBTI/scene 결정 |
| 먼 미래에도 현재 직장·사업 전제 | 현재 직무 scene이 모든 연도에 적용 | 현재+3년부터 이전 가능한 능력/생활 장면 |
| 목차 없이 긴 책, 선택 중 페이지 이동 | page index만 사용, 본문 전체에서 gesture 시작 | stable chapter anchor + return stack + 빈 여백 gesture |

현재 흐름: 기존 계산/자료 → `contentEvidence` → root/trait/theme 선택 → 상품 composer → `contentQuality` 진단 → 기존 publication/completeness → Book projection/navigation.
후처리로 문장을 지워 통과시키지 않는다. semantic 진단은 사람이 읽을 위치를 찾는 보조 수단이다.

## 3. Evidence strength와 직설성

`assertionPermission` / `plannedAssertion`:

| 허용 수준 | 조건 | 표현 |
|---|---|---|
| STRONG | 같은 theme를 지지하는 독립 root 2개 이상 또는 명확한 strong structure | “사람복이 있습니다”, “앞에 서서 방향을 잡는 힘이 강합니다” 등 |
| MEDIUM | 사용 가능한 단일 근거 | 그 힘이 드러나는 구체적 행동으로 한정 |
| WEAK | usable strong root 없음/상징적 단서만 | direct positive hero 생성 안 함 |

- alias, 동일 feature, 일간/일주 공유 기반, 겹친 lineage는 독립 근거 수를 늘리지 않는다.
- 지원되지 않은 구조/DB-only 귀인, ambiguous 망신살 suppress 유지.
- direct fortune 문장의 proof에는 해당 theme를 실제 지지하는 root만 넣는다.
- strong structure도 **현재 주장과 같은 theme**일 때만 단일 근거의 강한 표현을 허용한다. 최종 검토에서 이 제한을 보강해 INTP Annual 두 export의 축적 한 문장을 MEDIUM 표현으로 낮췄으며, 나머지 64개 본문 hash는 동일했다.
- 재물·축적·명예/자리·리더십·사람복·표현·학습·이동·첫인상/친밀 매력은 실제 근거가 있을 때 surface한다.
- 복합 좋은 패를 쓰되 사건/수익/질병/특정 결혼 결과 보장은 하지 않는다. 단점은 짧게, 장점의 실제 쓰임은 더 길게 유지한다.

## 4. 이미지, 오행, 음양

- 이미지 → 쉬운 뜻 → 행동 → 실제 scene → 가능한 MBTI 연결. 기존 material 의미를 바꾸지 않는다.
- 오행은 기존 symbolic element 상태와 실제 선택 material을 함께 사용한다. 약한 오행만으로 새 인물/운명을 확정하지 않는다.
- 음양: canonical 천간·지지의 확인된 글자를 한 번씩 센다. 새 가중치 없음.
- 네 기둥 8글자가 모두 확인되고 차이가 4 이상이며 독립 material도 맞을 때 성향 보조문을 쓴다.
- 음=I/양=E 등식, 성별 연결 금지. MBTI 외향/내향 행동과 닮으면 reinforce, 다르면 상황별 tension으로 설명한다.
- unknown hour는 없는 시주를 만들지 않으며 강한 분포 결론을 억제한다. MBTI unknown은 명리 단독, 유형 추정 없음.
- 예: 양이 우세한 INTP를 무조건 말 많은 사람으로 만들지 않는다. “생각을 정리한 뒤 말하지만, 할 이유를 찾으면 행동을 먼저 시작”하는 서로 다른 속도로 연결한다.

## 5. MBTI synthesis와 문체

- `contentSynthesis`는 상품/domain에 해당하는 실제 DB trait와 허용 Fusion을 검토한다. money/marriage의 derived 출처는 유지한다.
- root/trait/kind 반복을 피하며 `의 결이 겹치는` 같은 공통 설명 꼬리를 제거했다.
- Career relationships는 업무 lens, Love는 love/marriage lens, Comprehensive의 사람관계는 비연애 lens를 사용한다.
- 종결은 검토된 한국어 활용으로 `합니다/해요/죠`를 섞는다. 조사만 무작위 교체하거나 generic 위로로 늘리지 않는다.
- 질문·팩폭·칭찬·장면을 섞되 모든 문단에 해결책을 붙이지 않는다.
- 주요 신규 모듈: `assertionCopy.ts`, `productRhythm.ts`; 기존 selector/DB/composer를 재사용하며 병렬 해석 엔진을 만들지 않았다.

## 6. Comprehensive

- 기존 core/portrait/strengths/private/relationships/love/work/money/fortune/environment/direction의 significance 기반 흐름 유지.
- 강한 원국 의미, 오행·음양, MBTI reinforce/tension을 해당 장면에 통합한다.
- 대표 ENTJ: 결과 욕구/압박 속 판단/예리함을 돈·이름·역할로 연결. “잘하는 데서 끝내기엔, 눈도 욕심도 빠릅니다.”
- ENFP: 연결·표현·사람에게 전달하는 힘과 내면의 차이. ISFP: 작은 반응·취향·꾸준한 애정. unknown: 유형을 추정하지 않고 원국 강점/생활 리듬으로 전개.
- 마지막은 기존 인물별 operating direction과 finalLine을 유지하며 일반 격려로 통일하지 않았다.

## 7. Career — 상태와 결정

- 실제 material 근거 + MBTI recommendedJobs의 semantic mapping으로 3개 방향을 정렬한다. 직업 예시는 중복 제거하고 이유/역할/맞는 환경/검증 방법을 함께 제공한다.
- 피해야 할 환경 2–3개. 검증되지 않은 MBTI 직업 사전 확장 없음.
- employee: 평가/기여/보상/다음 역할, business: 고객/가격/비용/지속성, freelancer: 단가/범위/작업, student: 배움/프로젝트, job seeker: 지원/경험, rest: 현재 회사 없는 다음 선택을 보존.
- 제조업 재무기획 ISTJ 예: ① 품질·재무 검토 ② 운영·예산 관리 ③ 교육·사용 안내. 현침/상관의 오류 감지, 정관/정인의 지속성, 인성의 전달이라는 각각 다른 근거를 밝힌다.
- 좋은 문장: “아무 일도 없게 만든 실력은, 사실 꽤 비쌉니다.” 조용한 실력을 보상/판단을 맡는 역할로 연결한다.

## 8. Love — 조화

- 6개 관계 상태 그대로. 확정된 파트너가 있으면 만남 환경도 “지금 가까운 사람과도” 경험할 장면이다.
- 실제 약한 오행 → 편한 사람 이미지 → 만남/활동 환경 → 피곤한 관계 패턴을 연결한다. 특정 장소/오행의 배우자를 예언하지 않는다.
- 예: 표현이 따뜻하고 반응을 돌려주는 사람, 취미·감상을 함께 나눌 자리, “마음은 알아서 알라며 아무 반응도 주지 않는 패턴”의 어려움.
- 좋은 문장: “말은 적어도, 당신이 좋아하는 건 이미 기억하고 있습니다.” 연애 중 ISFP의 애정·혼자 시간·공동생활은 분리한다.
- 도화는 첫인상, 홍염은 가까워진 뒤 매력이라는 구분을 유지한다. 부모 파트는 본인 스타일만 다룬다.

## 9. Compatibility — 이번 Phase에서 승인된 지수

과거 score 금지 계약은 이번 명시적 요청으로 변경했다. V3 점수나 고정 67을 되살리지 않는다.

`buildCompatibilityIndex`: 각 항목을 독립적으로 반올림·범위 제한한 뒤 합산한다.

| 항목 | 중립값 / 최대 | 실제 기여 |
|---|---|---|
| 오행·음양 | 15 / 30 | high↔low 보완 +2×최대3, 공통 과다 -2×최대2, 일간 생조 +3, 완전한 음양 반대 +2, 동일 극단 -3 |
| 명리 관계 | 18 / 35 | 검증된 육합/삼합/반합의 +3/+4/+2(합계8cap), 충/해 -3/-2(일지끼리 1.5배, 합계10cap), 실제 받는 십성 자극 |
| MBTI | 13 / 25 | 실제 pair DB sharedGround/positiveInfluence/friction + 양쪽 natal×MBTI character의 검토된 행동 차이 |
| 회복력 | 5 / 10 | 실제 repairStrategy, 보완을 역할로 쓸 단서, 여러 충돌의 조율 부담 |

- 위 기여에 아래 category 계수를 적용한다. 기본점수에 category 보너스를 주지 않는다.
- 같은 지지 relation의 반복 위치로 점수를 쌓지 않는다. MBTI pattern 자료가 존재한다는 이유만으로 조화 보너스를 주지 않는다.
- natal 귀인을 “상대가 내 운명의 귀인”으로 환산하지 않는다.
- missing은 중립, unknown 시주의 부족/음양 보완 승격 없음. 현재 검증된 cross producer가 없는 천간합/형/파/원진/방합은 가산하지 않고 제한을 표시한다.
- 출력 factors는 source refs를 보존한다. publication에서 지수가 있으면 재계산 검증; 과거 scoreless snapshot은 계속 읽힌다.
- 이름: `결리포트 궁합 지수`. 필수 고지: “명리와 MBTI를 바탕으로 한 엔터테인먼트 해석입니다.” 성공 확률/검증된 심리검사라는 주장, 등급/별점 없음.
- 이는 **편집 규칙에 따른 해석용 지수이며 경험적 적중률로 보정된 점수가 아니다.** 고객 반응 검수와 public activation은 별개다.

## 10. 7 category 계수와 관계 이야기

| category | 보완 | 합 | 충돌 | MBTI 공통 | 회복 |
|---|---:|---:|---:|---:|---:|
| love | 1.2 | 1.2 | 1 | 1 | 1 |
| marriage | 1 | 1 | 1.4 | 1.1 | 1.4 |
| parentChild | 1.1 | .9 | 1.1 | .8 | 1.5 |
| coworker | 1.3 | .8 | 1.2 | .9 | 1.1 |
| managerReport | 1.1 | .7 | 1.4 | .8 | 1.4 |
| businessPartner | 1.4 | .8 | 1.5 | 1 | 1.5 |
| friendship | .9 | 1 | .8 | 1.5 | 1.2 |

- 8개 실제 pair 지수: 69/55/64/58/45/56/66/62. 동일 pair의 category 변경과 A/B swap 검증 포함.
- A→B/B→A는 사람에게 생기는 반응을 먼저, 받는 십성 명칭을 뒤에 표시한다.
- `compatibilityLoop`는 quiet↔response, steady↔change 등 양쪽 실제 character가 있을 때만 상호 악화와 끊는 방법을 작성한다.
- INTP×ESFJ: 조용히 생각할수록 상대가 더 확인하고, 확인이 늘수록 더 조용해지는 고리를 설명한다. 대화 시간을 정해 알려주는 식의 구체적 회복을 둔다.
- parentChild A=부모/B=자녀, managerReport A=상사/B=팀원 유지. 지수는 symmetric, 해석은 directional이다.

## 11. Major — 대운 먼저

- 현재 대운의 의미/원국·MBTI 반응 → 14년 지도 → 핵심 연도 → 전환 → 다음 대운의 일·돈·사람·과사용 → 장기 방향.
- `periodPlanner`: 전환12, 현재8, 확인된 tension최대4/harmony최대2, 십성 정합1의 읽기 우선순위. 최대4 HIGH, 나머지는 MEDIUM/BACKGROUND. 고객 운 점수/순위가 아니다.
- 6 fixture 모두 14/14, 최근3+현재+미래10, 나이/실제 active cycle/전환 보존. 현재 fixtures는 HIGH 4개.
- BACKGROUND는 장면·좋은 힘·과사용 중심의 3문단, 핵심/전환은 더 깊게 쓴다.
- +3년 이상 먼 미래는 현재 회사/고객/학기/졸업 전제를 빼고 판단·관계·생활·축적의 이전 가능한 힘으로 쓴다.
- 십성별 gift/shadow를 서로 다른 실제 행동으로 바꿔 같은 명사를 되풀이하던 패턴을 줄였다.
- 전환 날짜는 쉬운 날짜/계절 범위, 내부 exact는 펼침에 그대로 남긴다.

## 12. Annual — 올해 지도와 월별 쓰임

- overview/대운×세운/좋은 힘 → 돈·자리·표현·도움·배움·속도조절 year map → 12개월 상세 → 올해/지금의 선택.
- 현재 달 우선순위20, 실제 relation/gift에 따른 중요월 3개를 고른다. 현재 가장 깊게, 지난 보통 달은 compact, 중요한 지난달은 깊이를 유지한다.
- MBTI는 실제 Fusion이 있는 중요월 최대3개에서 행동 보정. unknown은 0이며 매월 유형 설명을 강제하지 않는다.
- 각 달은 실제 focus 십성의 occurrence별 action/avoid variant를 사용한다. 1월=정리 같은 고정 달력 template 없음.
- 선택 연도 과거/현재/미래의 시제, 12/12와 final 유지. 월간 점수/최고·최악 순위 없음.

## 13. 절입과 정보표

- `annual-month-jie-kst-v2`, 원국/대운/세운/월운 계산 변경 없음.
- 달력월과 절기월은 다르다. 10월 초가 아직 9월의 절기 기둥을 공유하는 경우를 실제 fixture로 검증했다.
- 기본은 달/쉬운 의미, 구간 펼침은 실제 모든 start/end/ganji를 표시한다. focus가 같다고 다른 월운을 발명하지 않는다.
- 만세력 오행색·음양·독음·오행 순서와 전체 fields 유지. 시간표에도 동일 canonical 글자/독음/음양/오행 표시를 재사용한다.
- 木초록/火빨강/土갈색/金금색/水파랑, 작은 글자색만이 아니라 면색/구분선과 text label을 함께 사용한다.

## 14. 목차 / 다시 펼쳐보기 / page density

- 표지 다음 `이 책에서 만나게 될 이야기`, 뒤표지 전 `다시 펼쳐보기`.
- 원래 chapter ID/제목을 보존하고 최종 pages에서 page number를 계산한다. Major/year, Annual/month, pair direction 링크도 재배치된 번호를 가리킨다.
- 인접 chapter 중 하나가 260자 미만이고 합친 각주가 2개 이하일 때 묶는다. 본문 삭제 없음, 원래 heading/anchor/각주 numbering 보존.
- 같은 page에 다른 두 목차 제목이 연결되는 것은 정상이며 각 heading 위치로 이동한다.
- jump 전 page/scrollTop을 stack으로 저장. `읽던 곳으로`는 해당 위치를 복원한다. 화살표 이동은 새 chapter 위로 간다.
- desktop narrative/timeline/months/appendix/contents 폭 최대940px, prose 최대780px/17px. 정보표는 기존 밀도를 유지한다.

## 15. 텍스트 선택과 page turn

- 본문 텍스트/링크/버튼/표/입력요소에서는 page gesture를 시작하지 않는다.
- selectionchange와 현재 selection을 모두 확인해 선택 중 swipe/좌우키로 넘어가지 않게 한다.
- 빈 여백에서 가로50px 초과, 가로>세로1.7배, 450ms 미만만 page turn. longpress/vertical/diagonal/pointercancel 제외.
- 하단 화살표와 키보드 유지. 별도 copy UI는 추가하지 않았다.
- 실제 browser에서 드래그로 한글 선택, 선택+ArrowRight, longpress/diagonal/vertical 억제, 빈 여백 swipe, 화살표, TOC/end jump/return을 확인했다.
- iOS 실기기의 native selection handle/복사 메뉴는 미확인. Chromium 화면 크기 변경과 pointer sequence를 iPhone 실기기 검증으로 부르지 않는다.

## 16. 각주 / 내 모든 기운

- 각주0–2, 최초 정의 우선. 합친 chapter에서 본문에 이미 똑같은 정의가 있으면 해당 보조 각주만 제거하고 번호를 다시 매긴다.
- `내 모든 기운`은 전체 inventory, 각주는 실제 본문 근거라는 역할 분리 유지.
- 지장간 설명은 한 번. 각 entry는 기존 material registry의 해당 십성 positiveMeaning을 사용한다. 새 의미를 임의로 붙이지 않는다.
- 십이운성의 공통 정의도 한 번만 렌더링한다. 기존 단계별 설명이 들어온 snapshot은 보존한다. 없는 단계별 해석을 창작하지 않는다.
- term 중복 제거, 한 사람당 부록1page(궁합2), 세로 스크롤/desktop2열. 실제 browser A는 43개 모두 유지한다.

## 17. 실제 출력 검수

6상품 golden 전문: 종합 서윤, Career 민재, Love 지아, 궁합 현우×소연, Major 도윤, Annual 도윤. 추가 ENTJ/ENFP/INTP 6상품 goldens는 자동 생성/비교하고 아래12명 핵심 장면·좋은 패·팩폭·마지막을 읽었다. **66개 전문 전부를 수동 완독했다고 주장하지 않는다.**

| 인물/MBTI | evidence / MBTI trait 수 | 읽은 결과와 남은 판단 |
|---|---:|---|
| 서진 ENTJ | 16 / 6 | 결과 욕구와 압박 속 판단, 예리함이 돈·역할로 이어짐. 대표 장점 유지 |
| 서윤 ENFP | 17 / 6 | 연결/디자인/전달이 내면과 달라 재미있음. 관계·연애 동일 scene은 분리 |
| 지아 ISFP, 시간모름 | 9 / 7 | 작은 반응·취향·애정과 혼자 시간 구분. 불완전 음양을 강하게 말하지 않음 |
| 다은 ENTJ | 15 / 6 | 재다신약 후보의 욕심/자기 압박과 실질 강점을 같이 설명 |
| 수아 INTJ | 15 / 5 | 단서를 오래 잡는 모습이 선명. 탐구 의미가 5장/6문장에 있어 Minor 수동 확인 |
| 예린 ISFJ | 14 / 7 | 기억하고 챙기는 생활, 사람복과 관계 경계가 연결됨 |
| 나영 INTP | 15 / 5 | 압박을 지식으로 바꾸는 힘. 탐구 의미5장/6문장으로 Minor 수동 확인 |
| 유진 ENTP | 15 / 5 | 이유 없는 권위와 질문하는 모습. 탐구 의미4장/6문장으로 Minor 수동 확인 |
| 하린 ESTP | 16 / 6 | 먼저 해보는 몸과 납득을 원하는 생각의 tension이 구체적 |
| 민재 ISTJ | 12 / 5 | 약속·정확성·자료 검토와 인정받는 역할이 이어짐 |
| 도윤 INFJ | 14 / 6 | 사람을 챙기면서도 혼자 공간을 남기는 차이, 조용한 인정 욕구 |
| 준서 MBTI모름 | 12 / 0 | MBTI 추정 없이 양 우세 원국·관계·본인 기준으로 분량 유지 |

Golden coverage: 음 우세/양 우세/극단(준서8양), 오행 편중, 구조 성립/비성립, 강한 positive 조합과 신살이 적은 원국, reinforce/tension, 학생/취준/직장/사업/프리랜서/휴식, 솔로/연애/결혼상태, 궁합69와45의 차이를 실제 계산 fixture로 확인했다.

6상품별 판독:

| 상품 | 질문에 대한 실제 답 | 읽으며 수정한 문제 / 최종 남은 점 |
|---|---|---|
| 종합 | 어떤 사람인지 → 좋은 힘/관계/일·돈/내 환경 | 일반적인 MBTI 꼬리 감소. 일부 깊이·탐구 의미 근접은 위 Minor |
| Career | 왜 현재 역할이 맞고 다음 어디로 갈지 | 연애 문맥 fallback 제거. 추천은 운명적 천직이 아니라 근거 있는 방향 |
| Love | 애정·매력·싸움·편한 사람·생활 | 업무 문맥 제거. 현재 관계를 다른 사람 찾기로 바꾸지 않음 |
| 궁합 | 서로 좋아하는 점/엇갈리는 박자/회복 약속 | 음양과 INTP 행동을 모순된 단정 대신 상황별 차이로 연결 |
| Major | 현재/다음 대운, 언제 어떤 힘을 쓸지 | 먼 미래 현직 고정과 같은 명사 gift 반복 수정. 14년의 공통 십성 설명은 일부 남음 |
| Annual | 올해 방향/현재 행동/12달별 action | 현재와 중요월의 밀도 차이 확보. 같은 Jie를 공유하는 달은 설명은 같아도 실제 scene/action은 구분 |

## 18. 반복 audit — 수치를 숨기지 않음

- 48개 primary cohort +18개 type golden =66개 deterministic export/hash.
- primary cohort within-report blocking string/quality issues 0. 12명 종합의 동일 formal ending 3연속 0.
- raw cross-report 중복 문장군799, cross-product 문장군364, 긴 구절군460. canonical 정의/같은 근거/같은 역할의 재사용이 포함되므로 **전체 중복0이라고 보고하지 않는다.**
- `contentQuality`는 inquiry/reusedExperience/authority/precision/care의 문장 수와 chapter 위치, evidence/trait 사용, hedge, 종결, metaphor/advice를 기록한다.
- 탐구형3명은 자동 threshold에는 걸리지 않아도 사람이 읽으면 의미가 가까워 별도 Minor로 남겼다. 자동검사=사람 품질 PASS가 아니다.
- export: `/tmp/gyeol-v4-final-audit/after/`의 `index.md`, 상품별 `.md/.json`, `duplication-report.json`, `golden-comparison.md`.
- 이전 Phase13A baseline을 지우지 않고 이번 의도적 본문 변경의 `productNarrativeBaseline.json`을 별도로 추가했다.

## 19. Browser QA

기존 로컬 서버 `http://127.0.0.1:3193`, 별도 `phase13b-review` session. 기존 사용자6탭 session은 건드리지 않았다. 실제 local generation/API → packet → 현재 Book renderer 사용, 운영 DB/결제/OpenAI 호출 없음.

| Case | 입력 요약 | pages / 완전성 |
|---|---|---|
| A 종합 | 은솔 F 1993-05-14 08:25 INTJ, UX리서처/솔로 | 17 |
| B Career | 태준 M 1989-10-02 16:40 ESTJ, 물류운영팀장/기혼 | 16 |
| C Love | 채린 F 1998-02-21 유시 대략 ISFP, 반려동물미용사/연애 | 11 |
| D 궁합 | 도현 M 1991-09-07 23:10 INTP × 수빈 F 1996-06-19 10:35 ESFJ, love | 20 / index63 |
| E Major | 지훈 M 1985-06-30 시간모름 INFJ, 독립출판사대표/기혼 | 31 /14년 |
| F Annual | 소희 F 2000-12-03 12:50 ENFP, 콘텐츠마케팅취준/썸,2026 | 26 /12개월 |

- 390/430/768/1440 각각6권 끝까지: 24회, 총484 page 상태. 가로 overflow0, 현재 reader 중복 mount0, 각 뒤표지 도달.
- 오류 수집: console error/hydration error 없음(HMR/React DevTools 안내 제외).
- TOC jump→return page7/scroll380 복원, END→chapter→return END/scroll220 복원. 긴 부록 내부 scroll350 유지/페이지 불변 확인.
- 화면 캡처/직접 확인: `/tmp/gyeol-phase13b-390-{toc,manseryeok,narrative,selection,compatibility-index,major-timeline,annual-map,annual-current,appendix,read-again}.png`, `430-appendix.png`, `768-appendix.png`, `1440-{manseryeok,mbti,appendix}.png` (모두 동일 `gyeol-phase13b-` prefix).

## 20. 자동 검증

| 실행 | 결과 |
|---|---|
| V4 전체 + Book preview/runtime/reading + report tables + V3 + sharing + public-flow gate + Jie regression | 69 files, **1,880 PASS /0 FAIL** |
| canonical saju regression | 20 files, **292 PASS /0 FAIL** |
| 마지막 부록 정의 표시 변경 뒤 Book reading/runtime/share regression | 3 files, **68 PASS /0 FAIL** (위 범위 중 재실행) |
| `pnpm lint` | PASS, warning/error0 |
| `pnpm build` | PASS. 기존 local fixture import tracing 관련 Turbopack warnings5; 해당 business infrastructure는 이번 범위 밖 |
| `tsc --noEmit` | 기존390 → 현재390, file/code별 신규 diagnostic0. 전체 TS clean으로 표현하지 않음 |
| `git diff --check` | PASS |

검증 로그: `/tmp/gyeol-phase13b-{suite-verified,calculation,appendix,lint-final,build-final2,tsc-final}.log`.
주요 신규 tests: `productPlanner.test.ts`, `bookReading13b.test.tsx`. 기존 6천개 전체 suite는 반복하지 않았다.

## 21. 남은 수동 품질 확인 / STOP

- 탐구형3명의 report-wide 의미 근접과 강한 단일 근거의 MEDIUM 문장이 사용자에게 충분히 시원하게 읽히는지 직접 확인 필요.
- 상품 간 canonical 설명 재사용은 남는다. 친구끼리 여러 권을 비교할 때 체감 반복은 추가 사용자 판단 대상이다.
- 궁합 계수는 해석용 편집 규칙이다. 숫자의 인상/설득력 검수 필요하며 관계의 성공 확률로 오해시키면 안 된다.
- iOS 실기기 복사 메뉴/selection handles 확인은 남아 있다.
- 구현/계산/완전성에서 확인된 blocker 없음. 내용이 완벽하다는 판정이나 Production 출시 승인은 하지 않는다.
- 이번 Phase 결과를 사용자가 읽은 뒤 피드백을 기다린다. 다음 Phase/public activation/master merge 자동 진행 금지.
