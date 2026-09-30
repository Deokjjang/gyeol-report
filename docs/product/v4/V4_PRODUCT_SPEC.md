# V4 제품 계약 · Phase 0

기준 코드: `5f71a7d0ff8ac4481e09a3f90049448035eb2aed` · 감사일: 2026-10-01 · 작업 브랜치: `v4/rebuild`.

이 문서는 구현 계약이다. **Phase 0에서 제품 동작·계산·저장본은 변경하지 않는다.** 근거와 누락은 [엔진 감사](ENGINE_AND_KNOWLEDGE_AUDIT.md), 구체적인 합성·착수 범위는 [Fusion 설계](FUSION_BLUEPRINT.md)를 따른다.

## 1. 고정 철학

| 항목 | V4 계약 |
| --- | --- |
| 제품 | 쉽게 읽고 웃고 공감하는 엔터테인먼트형 개인 리포트 |
| 감정 순서 | 내 얘기 같다 → 내가 이랬구나 → 장단점이 보인다 → 좋은 복도 많다 → 나 잘될 것 같다 |
| 명리 자체 | MBTI를 빼도 재미있는 사람 묘사·좋은 패·생활 장면이 남아야 함 |
| 강점 | 재물복·명예운·자리운·사람복·귀인·매력·리더십·축적·대성할 힘을 실제 근거에 맞게 직접 표현 |
| 단점 | “고집이 셉니다”, “답이 늦으면 먼저 정리해버립니다”처럼 짧고 직설적. 선천적 결함·질병으로 확대하지 않음 |
| 좋은 운 | “노력해야 복이 생긴다”가 아니라 “이미 가진 좋은 패가 삶에서 이렇게 드러난다” |
| 문체 | 업무 매뉴얼·분석가 시점·사전식 꼬리 제거. 친구·가족·메시지·공부·소비·연애·일의 짧은 장면 |
| 재미 | 칭찬·팩폭·반전·좋은 운·공감을 섞음. 모든 block에 조언을 붙이지 않음 |
| 개인화 | 이름/직업명 교체가 아니라 **선택되는 근거·장면·긴장·결론이 달라짐** |
| 금지 | 정확한 사건·결혼시점·수익보장·질병·죽음 확정. 숫자 궁합 점수·별점·대체 등급 없음 |
| 인과관계 | 명리와 자기보고 MBTI의 겹치는 결은 적극 설명. “사주 때문에 이 MBTI다”라는 원인 판정은 하지 않음 |

“사주아이급”은 읽기 재미·직설성·긍정적 감정의 목표이며, 외부 서비스 문구 복제나 엔진 정확성 인증을 뜻하지 않는다. 이번 감사는 저장소 소스와 테스트를 기준으로 한다.

## 2. 6상품별 무게중심

숫자는 **narrative 편집 기준**이다. 성격 점수·문장 수 할당·고객 표시 비율로 계산하지 않는다. MBTI 모름에서는 명리만으로 완결하며 임의 유형을 넣지 않는다.

| 상품 | 명리 / MBTI | 주인공 | 좋은 패 | 유지할 입력·특수 계약 |
| --- | --- | --- | --- | --- |
| 종합 `saju_mbti_full` | 55 / 45 | 한 사람의 성격·반전·돈·사랑·방향 | 여러 영역의 좋은 패를 종합 | 현재 상태/직업/관계 맥락, 강한 근거의 영역별 다른 발현 |
| Career `career_money_study` | 55 / 45 | 일할 때 어떤 사람인지 | 돈·성과·이름·자리·귀인·전문성 | 직장인/사업/프리랜서/학생/취준의 실제 장면 분리, raw 직업 보존 |
| Love `love_marriage_child` | 55 / 45 | 끌림·표현·매력·서운함·생활 | 매력·좋은 사람과 연결되는 힘 | 미선택/솔로/썸/연애/결혼 준비/기혼 6개. 부모 파트는 “부모가 된다면” |
| Compatibility `saju_mbti_compatibility` | 50 / 50 | 둘 사이의 실제 상호작용 | 조화·서로 살리는 힘 | 7 category, A→B/B→A, 부모 A/자녀 B, 상사 A/부하·팀원 B |
| Major `major_fortune` | 75 / 25 | 이 시기를 지나며 달라지는 나 | 해당 대운·연도의 좋은 흐름 | 최근 3년 + 현재 + 미래 10년, 나이·전환·과거/현재/미래 시제 |
| Annual `annual_fortune` | 75 / 25 | 선택한 해와 매달의 다른 장면 | 해당 연도/절입 구간의 좋은 흐름 | 12개월, 절입 분할, 현재 달, 선택연도 및 대운 교차 |

근거가 빈약하면 합성이나 좋은 복을 만들지 않는다. 대신 확인된 다른 장점으로 충분히 읽을거리를 만든다. “약한 재성 → 큰 재물복”, “원국 귀인 → 올해 새 귀인” 승격 금지.

## 3. 공통 고객 화면 순서 · 목차 없음

| 순서 | 영역 | 표시 계약 | 재사용 가능 |
| --- | --- | --- | --- |
| 1 | 타이틀 / 핵심 결 | 첫 1분 안에 캐릭터·매력·반전. 적합한 Fusion이 있으면 핵심 결로 사용 | 기존 V3 header 스타일·modern sans |
| 2 | 입력정보 | 현재 상태·raw 직업·관계·선택연도처럼 해석 맥락 확인. 출생정보/MBTI표와 중복 최소화 | 현재 입력 계약·summary 값 |
| 3 | 만세력 접기 | 기본 닫힘. 4주·오행/지장간 가중·십성·운성·계산 위치. 모르는 시주는 비워둠 | `ManseRyeokCommonTable`, canonical table, `withConsistentNatalMarkers` |
| 4 | MBTI 접기 | 기본 닫힘. 유형/타이틀/one-line/axes/stack/요약/강점/주의/성장/가까운·먼 키워드 전체 | `V3NarrativeIdentity`, `MbtiCommonProfileTable`, source registry |
| 5 | 본문 | 다양한 길이·형식. Major timeline, Annual month table도 본문 안에 둠 | 상품별 versioned view와 공유 frame |
| 6 | `내 명리에 있는 기운` | **단일 접기**, 기본 닫힘. 기존 주요기운+전체기운 통합. 이름·이미지·삶의 발현·계산 기준 | `publicSignalRows`·canonical features/relations의 표시 projection |
| 7 | 공유 | 기존 공유하기 그대로. 본문 마지막 다음에 한 번 | `ReportShareProvider` / `ReportShareActions` |

추가 계약:

- 페이지 내 목차, “주요 10개 + 전체 펼침”의 이중 기운 영역을 V4에서 제거. **V2/V3 view에는 소급하지 않음.**
- 기운을 화면에서 합쳐도 원래 rule·기준·위치·subject·period·provenance는 보존. 원국 전체의 귀문/원진을 임의 한 기둥에 붙이지 않음.
- 궁합도 하나의 기운 접기 안에서 A/B/두 사람 관계를 구분. 개인의 표식을 상대에게 전가하지 않음.
- MBTI 활용포인트는 UI에서 숨기되 source data와 본문 재료는 유지.
- 완성된 paid report와 full-share는 같은 전체 본문. 사이트 footer 없음. 일반 페이지 footer는 그대로.
- 고객 HTML/React Flight key에 backend/source/debug 식별자 없음. 내부 감사 자료는 서버 데이터에만 유지.
- RSC에는 JSON 직렬화 가능한 view data만 전달. 접기/공유 동작의 client boundary 유지; JSON source reader를 client bundle로 옮기지 않음.
- 390/768/1440px, 접기 키보드 조작, heading 순서, hydration, overflow를 실제 view 연결 Phase에서 확인.

## 4. 기존 계약과 구현 경계

| 재사용·동결 | V4에서 필요한 변경 | 금지 / 별도 승인 |
| --- | --- | --- |
| `saju-calendar-kst-v2`, `dayun-kst-sect2-v1`, `annual-month-jie-kst-v2` | 계산 결과를 **V4 전용 capability gate**로 해석 허용/보류 구분 | 역법·절입·순역·지장간 가중치 임의 변경 |
| 16 MBTI source JSON + 모름 계약 | 기존 trait를 장면과 합성에 연결; 부족한 재료만 근거 있게 보강 | 유형 추정·default ENTJ·형식적 chip을 Fusion으로 집계 |
| input adapter, 직업 정규화, 관계 enum, 궁합 역할 계약 | raw 입력 기반 scene routing을 V4에서도 재사용 | 새 관계 상태, 역할 반전, taxonomy를 raw 직업처럼 표시 |
| legacy snapshots 및 V3 content revision replay | V4의 명시적 content/version 분기 | 저장된 V2/V3 본문을 최신 composer로 다시 작성 |
| 가격·상품키·구매권한·publish/persist/share 계약 | 나중에 V4 허용 분기만 연결 | DB migration, payment/Toss/OpenAI/Production 변경 |
| 현재 Meta tracking | V4 내용과 독립적으로 그대로 유지 | analytics/결제 진입·성공 경로 재설계 |

현재 Career는 비정확 출생시간에서 V3 대신 기존 보수 경로로 돌아간다. V4 공통 지원을 선언하기 전에 별도 연결 테스트가 필요하다. “6상품 V3 기반 존재”를 “모든 입력 정밀도에서 동일 V3 경험”이라고 쓰지 않는다.

## 5. 콘텐츠 수락 기준

- [ ] 명리만 읽어도 쉬운 성격·장점·짧은 단점·좋은 패가 보임.
- [ ] A 겹침 / B 차이 / C 보완은 둘의 근거와 domain이 실제로 존재할 때만 선택. 세 종류를 매 리포트에 억지로 채우지 않음.
- [ ] 같은 사주에서 MBTI만 바꾸면 행동·장면·반전이 바뀌고 계산값은 동일.
- [ ] 같은 MBTI에서 사주를 바꾸면 핵심 결·좋은 패·결론이 바뀜.
- [ ] 약한/미지원 evidence의 hero 승격 0, alias 중복 합성 0, 원국→월운 전가 0.
- [ ] 장성+반안 등 좋은 합성은 단일 기운 설명 두 개를 나열한 문장과 다름.
- [ ] 조언 없이 끝나는 관찰·칭찬·팩폭 block 존재. 모든 장의 동일 양식 반복 없음.
- [ ] feature/trait/scene/final punchline의 반복을 기록하고 실제 고객 텍스트로 검수. 길이만 KPI로 삼지 않음.
- [ ] 실제 직업·관계상태·나이 맥락이 맞으며 사건·금전·건강 확정문 없음.
- [ ] 표/본문 동일 evidence, 12개월/14년/궁합 방향/마지막/공유 완전성 유지.

## 6. 이번 Phase의 산출물과 종료점

- 제품 계약, source 기반 감사, Fusion 및 positive 합성 설계.
- `AUDIT_DATA.json`: 195개 원자 ID, 27개 native rule, 16유형 domain/pair/bridge, 기존 compound/fusion의 전수 목록.
- `tests/unit/interpretation-v4/engineFusionAudit.test.ts`: JSON 재현·16유형 필드·귀문 6쌍/negative·bridge trait 참조 검증.
- 계산 엔진·runtime·UI·DB·결제·Meta를 수정하지 않는다. `origin v4/rebuild`에 문서/감사만 push하고 STOP. Phase 1 자동 시작 없음.
