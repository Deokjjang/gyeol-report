# V4 Content Engine Rebuild — Phase 13A

## 범위와 결과

- 기준: `v4/rebuild`, `cc9c91742f67712110a528d5363b228a7afdce05`.
- 변경: 여섯 V4 composer의 콘텐츠 계획·근거 설명·MBTI 합성·문체, 만세력 오행/음양 표시, 각주와 부록.
- 유지: V3, 역법/사주/대운/세운/Jie 계산, MBTI 원본 DB, 기존 Fusion 규칙·evidence gate, 저장 packet 계약, public 활성화 정책.
- Auth/Library/ownership/ticket/coupon/payment/share/referral/campaign/Meta, public route, Book navigation/Coverflow/checkout 수정 없음. 실제 외부 writer/결제/DB 호출 없음.
- 기술 검증 완료와 문학적 완성은 구분한다. 아래 수동 품질 항목은 남아 있으며, 전상품 판매 품질이 완벽하다고 판정하지 않는다. 다음 Phase를 자동 시작하지 않는다.

## 1. 퇴화 원인

| 원인 | 확인한 코드 | 이번 조치 |
| --- | --- | --- |
| material seed 몇 개를 이어 붙이는 것이 최종 문단 역할까지 담당 | 각 `*Composer`, `copyRealizer`, `materialPacket` | 기존 유효한 장면을 보존하되 chapter별 evidence 계획 → 이유 → MBTI 해석 → domain 발현 단계를 추가 |
| Fusion의 첫 domain만 보고 다른 실제 적용 영역을 놓침 | `fusion.ts`, `fusionRules.ts` | 이미 검토된 rule의 domains를 복원해서 선택. 새 명리 계산/Fusion rule은 만들지 않음 |
| Love voice가 없으면 registry 앞부분을 선택; 알파벳 순서가 본문 중요도처럼 작동 | `loveFallback.ts` | 실제 관계용 material 우선순위와 기존 `loveNatalScenes`로 선택. 별도 MBTI DB 설명 단락 대신 실제 장면 안의 합성 사용 |
| 새 근거를 다양하게 넣으려다 기존 장면과 설명 근거가 어긋남 | 초기 새 planner 출력에서 발견 | 원래 장면의 proof를 anchor로 고정. 비견 장면에 다른 귀인 정의를 붙이지 않음. 근거를 못 찾으면 설명을 억지로 채우지 않음 |
| 근거가 각주에만 있고 본문은 짧은 성격 문장 | `bookProjection.ts`, seed 중심 compose | 장면 다음에 명리 의미와 실제 발현을 본문으로 설명. 각주는 보조 정의만 |
| 대운 전체/돈/전환/결론에 같은 명사구를 문법만 바꿔 반복 | `majorComposer.ts`, `majorMaterials.ts` | 십성별 opening/money/relationship/confidence/closing의 독립 문장. 연도별 첫/후반 발현을 구분 |
| 문단마다 종결어미 리듬 초기화 | realization | 검토한 활용만 사용하는 유한 변환 + chapter 전체의 종결어미 연속 검사 |
| 원국 feature 전체를 본문 각주처럼 큰 부록으로 분할 | `bookProjection.ts`, `BookReader.tsx` | `내 모든 기운`, 분류/한 줄 의미/중복 제거, 한 사람당 한 장 |
| 가정 돌봄을 일반 휴식 경로로 처리 | Career/Major/Annual context 문장 | homemaker의 생활비·돌봄·시간·역할을 별도 내용으로 사용. 휴직/퇴사/구직 단정 제거 |

## 2. 새 콘텐츠 경로

```text
기존 canonical 입력·계산·MBTI source
  → 기존 gated MaterialPacket / 구조 / Fusion / 좋은 패
  → contentEvidence: chapter domain·강도·독립 support·Fusion·novelty
  → 원래 장면의 evidence anchor에 맞는 선택
  → contentWhy + contentMbti / contentRelationshipMbti
  → 기존 product 장면 + 근거 이유 + domain 발현
  → 안전한 한국어 realization / 읽기 전용 contentQuality
  → 기존 publication/completeness/versioned packet
  → 기존 Book projection / full-share 소비 경로
```

새 모듈은 `src/lib/interpretation-v4/content{Evidence,Why,Mbti,RelationshipMbti,Synthesis,Pair,Period,Quality}.ts`이다. 별도 상품/병렬 생성 엔진이나 OpenAI writer를 만들지 않았다.

### Evidence 선택

- 기존 `MaterialPacket.selected`의 strong/검증된 재료만 새 설명의 중심으로 사용한다. held/ambiguous/unsupported를 승격하지 않는다.
- 단순 이름 존재가 아니라 domain applicability, 기존 weight, 독립 lineage, 실제 Fusion, 이미 쓴 횟수를 함께 본다.
- 일반 신규 배분은 일간/일주 최대 두 chapter, 다른 root 최대 세 chapter를 우선한다. **이 수치는 기존 본문 전체의 root 횟수를 제한하는 보장이 아니다.** 기존 장면에 근거가 있으면 정합성이 novelty보다 우선한다.
- 한 chapter의 새 설명 root는 최대 두 개. 직업/상태/추천/부모/환경 등 context 중심 단락에 관계없는 정의를 강제로 덧붙이지 않는다.
- 계산된 관계/십이운성/오행/신강약/음양/held 목록을 pool에서 추적한다. 모든 값을 강제로 본문에 쓰지는 않는다. 전체 전문정보는 부록에서 확인한다.
- 망신살 충돌, DB-only 문곡/복성/천의성, 불확실 구조의 hero 억제 유지.

### MBTI 합성

- 16유형, 70개 구체 bridge link의 trait ID와 실제 source DB 존재를 검사한다. sourceCoverage의 direct/inferred 구분을 유지한다.
- reinforce: 동일 방향의 명리 + source trait를 한 장면으로 쓴다.
- tension: 실속을 보는 정재 + 의미를 우선하는 INFJ 등 다른 방향을 삭제하지 않고 선택의 갈등으로 쓴다.
- complement: 기존 Phase1의 검증된 보완 Fusion만 사용한다. 약한 표현 evidence를 새로운 강한 성격으로 승격하지 않는다.
- 궁합은 각 사람의 명리×MBTI를 먼저 읽고, 기존 receiver-view 방향 근거에 연결한다. 부모자녀/친구에는 연애 trait를 끼워 넣지 않는다.
- unknown MBTI는 Fusion/trait 추가 없음. 명리로 본문을 유지하며 유형을 추정하지 않는다.
- 새 단락은 `contentPlan`, `contentAudit`, proof/sourceRefs로 추적한다. 고객 Book에는 내부 식별자를 투영하지 않는다.

## 3. 문체·좋은 패·약점

| 항목 | 적용 |
| --- | --- |
| 왜 이렇게 읽었는지 | feature 의미 → 이미 있는 장면/성향의 연결. 예: 편관의 압박 속 판단, 현침의 오류/말투 감지 |
| 대화체 | 해요/죠/합니다 혼합. 검토되지 않은 한국어 활용은 억지 변환하지 않음 |
| 물상 | 기존 material imagery 재사용. 일주 이미지의 종결형을 명사구로 정리 |
| 장점/좋은 패 | 기존 fortune composite/atomic evidence 유지. 돈·명예·사람복·매력·학습·자리의 실제 의미와 활용 장면 |
| 단점 | shadow는 짧게 유지. 정의/상담 단락을 추가하지 않음 |
| 실패 처리 | 기존 publish guard의 duplicate/unsupported/completeness 실패를 통과시키지 않음. 진단을 지우거나 본문을 삭제해 PASS로 만들지 않음 |

실제 문장 예:

> 편관의 결이 겹치는 ENTJ는 결과를 바꿀 수 있는 자리에서 의욕이 살아나요. 시키는 일을 빨리 끝내는 것보다 무엇을 먼저 할지 정할 때 힘이 납니다.

> 실속을 챙기는 정재와 달리 INFJ는 조건이 좋아도 의미를 느끼지 못하면 선뜻 움직이지 않아요.

> 번역 의뢰에서는 글자 수만큼 전문 분야와 용어 확인, 검수 범위도 일의 크기를 바꿉니다.

> 말도 같이 뾰족해져요. 틀린 건 고쳤는데 상대 표정까지 굳어버렸습니다.

> 돈과 이름을 같이 노려볼 만한 힘이 있어요.

이 문장들은 성립한 evidence를 전제로 한다. 수익·질병·혼인시점·특정 사건 보장은 추가하지 않았다.

## 4. 상품별 전략과 결과

| 상품 | 콘텐츠 변화 | 보존 |
| --- | --- | --- |
| Comprehensive | 핵심 결 → 실제 모습 → 이유/MBTI → 일·돈·관계·사랑·좋은 패. strong/hour-stable 신강약과 보조 음양 | 기존 장점 우위, unknown, 환경 상징 |
| Career | 직무 장면 뒤의 판단·돈·공부 이유. 번역/디자인/재무/사업/돌봄 맥락 구별 | 추천 이유, 조직/독립, 구체 직업 input |
| Love | 관계용 재료 우선; 매력/표현/생활/독립성의 실제 장면. source DB 단독 붙임 제거 | 여섯 상태, 조건형 결혼/부모, 도화/홍염 구분 |
| Compatibility | 두 사람의 핵심 근거 설명 + A→B/B→A 수용 관점 + 실제 합/충의 의미 | 7 category, A=부모/상사 역할, 점수 없음, swap |
| Major | 10십성별 전체 흐름·돈·관계·전환을 각기 다른 완전한 문장으로 전개 | 최근3+현재+미래10=14년, age, 전환일/활성대운 |
| Annual | 실제 월간 십성 설명, 원국 공명은 원국이라고 명시, 생활 장면과 교차 | 12개월/Jie 순서·provenance·선택연도·시제 |

기간물의 원국 신살을 transit 신살로 복제하지 않았다. 월/연도 본문과 publish projection은 **최종 합성된 같은 block**을 사용한다. 생성된 section과 별도 period 배열이 서로 다른 글을 가리키지 않도록 맞췄다.

## 5. 음양·만세력·각주·부록

### 음양 / 오행

- canonical `STEM_YIN_YANG` / `BRANCH_YIN_YANG`의 확인된 천간·지지를 각각 1회 센다. 지장간 가중치를 새로 만들지 않는다.
- exact/approx/unknown 기존 계산 계약 유지. 시주 없으면 6글자 분포이며 미확인 시주를 만들지 않는다. 불완전 원국을 완전한 음양 성격으로 단정하지 않는다.
- 완전한 종합 원국에서 음양을 모으기/꺼내기 리듬의 보조 해석으로 사용한다. 양=E, 음=I로 등치하지 않는다. 음양 전용 신규 MBTI 추론 규칙은 없다.
- cell: **한자 → 한글 음·음양 → 오행**. 목 초록 / 화 빨강 / 토 갈색 / 금 금색 / 수 파랑의 영역색과 텍스트 병행.
- 오행 다섯 칸에 원국 수/기존 가중/기존 강약 label. unknown hour는 `부분 확인`.

### 각주

- 해당 chapter에서 실제 언급하고 proof가 있는 용어만 후보.
- 장당 0~2개, report 전체에서 같은 정의 최초 1회.
- 이미 본문에 동일 정의가 있으면 각주에서 반복하지 않음.
- 얇은 구분선과 기존 chapter-bottom 표시 유지. 본문이 각주 없이 읽히는 것이 우선.

### 부록

- 단일 인물 `내 모든 기운`, 궁합은 각각 `{이름}의 모든 기운`.
- 일간/일주, 오행/음양, 십성, 지장간, 십이운성, 실제 관계, 신살/귀인, 주요 구조를 묶는다.
- 중복 term 제거, 이름+한 줄 의미, 내부 provenance는 원래 evidence packet에 보존.
- 10개마다 분할을 없애고 한 사람당 한 장의 내부 scroll. 12인 runtime에서 **24~51항목/인물**.
- Book navigation/page-turn/공유 기능은 변경하지 않음.

## 6. 12인 실제 계산 검수

기존 `narrativeFixtures.ts`의 여성9/남성3을 전상품에 넣었다. 총 72개 실제 shadow generation → publication → Book projection이 통과했다. 날짜·시주는 fake 조작하지 않았다. 아래 관찰은 실제 export를 읽은 내용이며 자동 수치를 감상으로 대체하지 않았다.

| 인물 / MBTI / 맥락 | 읽고 확인한 차이 | 남은 수동 확인 |
| --- | --- | --- |
| 서진 ENTJ / 영업기획·연애 | 결과욕구·압박 판단·허점 감지·돈과 이름이 opening에서 연결. 고객 약속과 제품 일정 장면 | 같은 강한 성향의 여러 영역 발현이 과하게 비슷한지 |
| 서윤 ENFP / 브랜드디자인·솔로 | 고객 의도/계약·수정·수입 변동, 사람과 경험에서 아이디어가 살아나는 모습 | 좋은 패의 짧은 문장과 이미 풀어쓴 문단의 의미 중복 |
| 지아 ISFP / 병원행정·연애·시간모름 | 알아채고 챙기는 표현, 가까운 사람과의 편안함. 시주 없는 표와 조건부 해석 | 약속/배려 관련 장면의 리듬 |
| 다은 ENTJ / 교육사업·기혼 | 일의 판단과 집에서의 배분 차이, coworker에서는 실행/검토의 상호 영향 | 일부 긴 복합 문장과 단락 전환 |
| 수아 INFJ / 전시기획·썸 | 의미를 보는 선택, 혼자 생각할 여유. Major의 책임/학습/전환 차이 | 대운 전체 결론의 추상적인 명사구 |
| 예린 ISFJ / 가정돌봄·기혼 | 돌봄의 시간·돈·배분. Career/Major/Annual의 휴직·퇴사 전제 수정 | 보이지 않는 수고와 실제 일/돈 연결의 충분한 깊이 |
| 나영 INTP / 기술번역·솔로 | 문맥/용어 확인/검수 범위, 원리를 알아내 전문성으로 만드는 힘 | 전문성 좋은 패와 학습 문단의 의미 간격 |
| 유진 ENTP / IT취준·썸 | 지원/과제/현직자/면접과 새 답을 찾는 성향 | 일부 영역의 MBTI 합성 밀도가 ENTJ보다 얇음 |
| 하린 ESTP / 체육학생·솔로 | 기존 알파벳 fallback 대신 독립 취향·지출·돌봄·여행의 실제 사랑 장면 | Love headline/final이 일주 character에 많이 기대는 편 |
| 민재 ISTJ / 제조업재무·기혼 | 숫자 비교/판단 설명/평가·보상. parentChild에는 어린 자녀/숙제 전제 없음 | 부모자녀의 나이별 차이는 기존 입력 밖으로 추정하지 않음 |
| 도윤 INFJ / 독립서점·결혼준비 | 고객·가격·팀·배움, 실제 horizon의 전환 전후 책임/신뢰 차이 | 일부 긴 대운 마지막 문장 |
| 준서 MBTI모름 / 휴식·관계미선택 | 명리만으로 좋은 패/일·돈·관계 유지. 현재 회사·추정 MBTI 없음 | Love fallback의 분량/개인화는 알려진 유형보다 얇음 |

추가 기존 cohort: 종합12/Career8/Love8/궁합8/Major6/Annual6=48, 같은 사람×6상품 golden 18, 총 66개의 text/proof baseline을 별도로 고정했다.

### 분량은 참고값

| 예 | 이전 → 현재 글자 수(제목/공백 포함) |
| --- | --- |
| 서진 종합 / Career / Love | 4,580→6,268 / 3,253→4,183 / 3,218→4,300 |
| 지아 종합 / Career / Love | 3,720→5,423 / 2,287→3,685 / 2,653→3,602 |
| 준서 종합 / Career / Love | 3,462→4,393 / 2,610→3,113 / 1,701→2,150 |

글자 수를 품질 gate로 사용하지 않는다. 전체 72개에서 본문 proof root 5~18개, 알려진 MBTI source trait 2~11개. 이 수치는 고객이 체감하는 새 정보 개수와 같지 않다.

## 7. 반복 audit의 실제 결과와 한계

- 각 report 내부 exact sentence/긴 구절/scene 검사는 기존 `editorialGuard`를 유지. 기존 48 cohort의 within-report issue **0**.
- 72개 runtime의 반복 metaphor/advice exact 진단 **0**. `-습니다/-입니다` 3문장 연속 진단 **2곳** 남음(다은 종합 사랑, 도윤 Annual 11월). 변환표에 없는 활용을 임의 생성하지 않았다.
- 서로 다른 report 사이 공통 정의/같은 원국 설명은 남는다. 48 cohort 원시 진단: repeated sentence **617**, cross-product **327**, long-span group **328**. 이를 0이라고 보고하지 않는다.
- golden 6상품 각각의 cross-product 반복: ENTJ75 / INTP70 / ENFP70. 공통 정의를 본문으로 복원했으므로 기존 '공통 문장 3개' gate는 그대로 의미가 맞지 않는다.
- `expectBoundCohortReuse`는 raw 진단을 보존하고 공통된 구체 feature/seed/Fusion/source/period 근거가 없는 재사용을 실패시킨다. headline/final 중복은 계속 실패한다. 공유 근거가 있다고 모든 문장이 재미있다는 보장은 아니다.
- `finalEditorialBaseline.json`은 원본 보존. 이번에 의도적으로 바뀐 66개 text/selection/proof는 별도 `contentRebuildBaseline.json`으로 기록. 과거 V4 본문 해시까지 그대로라고 주장하지 않는다.

## 8. 검증 / 산출물

| 실행 | 결과 |
| --- | --- |
| `vitest run tests/unit/interpretation-v4 tests/unit/app/dev/bookPreview.test.tsx tests/unit/app/dev/bookRuntime.test.tsx` | 29 files / **1,038 PASS** |
| `vitest run tests/unit/saju tests/unit/interpretation-v3 tests/unit/report-generation/paidOneCallDelivery.test.ts` | 43 files / **901 PASS** |
| 12인×6상품 actual runtime | 72/72 publish, Major 12명×14/14·미래10, Annual 12명×12/12, A/B 방향·7 category |
| 정확/대략/모름, MBTI unknown, suppress, 실제 DB link, note dedup/appendix/색·순서/serializer | 관련 tests PASS |
| `pnpm lint` | PASS |
| `pnpm build` | PASS. scope 밖 local fixture trace 관련 Turbopack warning 7개 출력; 수정하지 않음 |
| `pnpm exec tsc --noEmit` | baseline 390 → 390. 신규 파일/코드 진단 0. 전체 clean이라고 보고하지 않음 |
| `git diff --check` | PASS |
| 실제 browser | localhost 기존 Book, 390/768/1440 표·각주·부록 확인. 측정한 document/reading region 수평 overflow 없음, console error 없음 |

검증 로그는 `/tmp/gyeol13a-{tests,lint,build,tsc}-final-reviewed.log`, 관련 회귀는 `/tmp/gyeol13a-regression-final.log`.

### 전문 / packet

- 12인×6상품: `/tmp/gyeol13a-after/runtime/`의 `.txt`, `.json`(입력/본문/contentPlan/contentAudit/Book).
- 12인 종합/Career/Love before/after: `/tmp/gyeol13a-before/`, `/tmp/gyeol13a-after/`.
- 기존 66개 cohort/golden: `/tmp/gyeol-v4-final-audit/after/index.md`, `golden-comparison.md`, `duplication-report.json`.
- 임시 export는 저장소에 commit하지 않는다.

### Screenshots

- `/tmp/gyeol13a-manse-390-final.png`
- `/tmp/gyeol13a-manse-768.png`
- `/tmp/gyeol13a-manse-1440.png`
- `/tmp/gyeol13a-elements-390.png`
- `/tmp/gyeol13a-footnotes-390-final.png`
- `/tmp/gyeol13a-appendix-390.png`
- `/tmp/gyeol13a-appendix-768.png`
- `/tmp/gyeol13a-appendix-1440.png`

## 9. 남은 수동 품질 판정

1. 같은 명리 정의가 다른 상품에도 등장하는 것과 동일한 이야기를 다시 듣는 느낌 사이의 허용 범위.
2. Love fallback/MBTI unknown의 깊이, 궁합 화해·마지막 단락의 상대적으로 짧은 분량.
3. 대운/세운 전체 흐름과 마지막 문장의 추상 명사구; 일부 quote 안의 물음표 뒤 공백.
4. ENTJ처럼 evidence/trait가 풍부한 사람과 일부 ENTP/ESTP/unknown 출력의 밀도 차이.
5. 근거 root/trait 반복 횟수는 raw proof 기준이다. 같은 근거의 실제 장면이 충분히 달라졌는지는 사람 검수가 필요하다.
6. 전 chapter를 동일한 8단계 형식으로 강제하지 않았다. 짧은 팩폭/화해/마지막 한 줄은 의도적으로 남겼다.

기술적 누락/불확실 근거 승격/결제 기능 변경은 관련 검사에서 발견되지 않았다. 그러나 사용자 체감의 '최고 품질' 수락을 대신 선언하지 않는다. 새 결과를 사용자가 읽고 피드백할 때까지 STOP.
