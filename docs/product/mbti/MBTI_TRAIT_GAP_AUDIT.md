# MBTI Trait Gap Audit

## 1. Summary

- JSON 파일 수: 16
- JSON 파싱 성공 수: 16
- 관계 매트릭스 제외 여부: 제외함. `relationshipHints.notablePairs`, `comfortableTypes`, `challengingTypes`는 이번 감사 대상에서 제외했다.
- money 부족 타입 수: 16
- investment 부족 타입 수: 15
- marriage 부족 타입 수: 16
- study 부족 타입 수: 11
- career/workplace 부족 타입 수: 7
- reportUseCases 부족 타입 수: 16
- myeongliBridgeHints 부족 타입 수: 11
- 메타 표현 잔여 수: 0
- 금지 표현 잔여 수: 0

부족 판정은 "비어 있음"이 아니라 "결리포트 V2 상품 writer가 돈, 투자, 결혼, 공부, 직업 장면을 바로 뽑아 쓰기에는 장면·갈등·전략 밀도가 부족함"을 뜻한다. 관계 매트릭스는 FINAL-QA-03 통과 상태로 보고 이번 문서에서는 재보강 대상으로 다루지 않는다.

감사 기준:

- money: 최소 4개 trait 이상, 수입 방식·소비 패턴·돈 관리 리스크·강점이 분리되어야 충분함.
- investment: 최소 3개 trait 이상, 투자 성향·리스크 관리·충동/과신/회피·장기성 여부가 있어야 충분함.
- marriage: 최소 4개 trait 이상, 생활 리듬·책임 분담·갈등 포인트·정서 표현이 있어야 충분함.
- study: 최소 4개 trait 이상, 공부 방식·집중 조건·약점·시험/성과 전략이 있어야 충분함.
- career/workplace: career 6개 이상 및 workplace 5개 이상을 기본 기준으로 삼고, 업무 환경·조직 역할·갈등 포인트·성과 방식의 구체성을 함께 봄.
- reportUseCases: 현재 대부분 섹션당 2개 단서라 구조는 있으나 V2 writer용 섹션 문장 재료로는 확장 필요.
- myeongliBridgeHints: 8개 미만이거나 돈/직업/관계/공부/결혼 신호 연결이 얇으면 부족으로 봄.

## 2. Type Gap Table

| Type | Money | Investment | Marriage | Study | Career/Workplace | ReportUseCases | MyeongliBridgeHints | Priority |
|---|---|---|---|---|---|---|---|---|
| INTJ | Gap | Gap | Gap | OK | OK | Gap | OK | P3 |
| INTP | Gap | Gap | Gap | OK | OK | Gap | Gap | P2 |
| ENTJ | Gap | OK | Gap | Gap | OK | Gap | Gap | P2 |
| ENTP | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| INFJ | Gap | Gap | Gap | OK | OK | Gap | OK | P3 |
| INFP | Gap | Gap | Gap | OK | OK | Gap | OK | P3 |
| ENFJ | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| ENFP | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| ISTJ | Gap | Gap | Gap | Gap | OK | Gap | Gap | P2 |
| ISFJ | Gap | Gap | Gap | Gap | OK | Gap | OK | P2 |
| ESTJ | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| ESFJ | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| ISTP | Gap | Gap | Gap | Gap | OK | Gap | Gap | P2 |
| ISFP | Gap | Gap | Gap | OK | OK | Gap | OK | P3 |
| ESTP | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |
| ESFP | Gap | Gap | Gap | Gap | Gap | Gap | Gap | P1 |

Priority 기준:

- P1: 7개 감사 축에서 대부분 부족. 다음 보강 묶음의 우선 대상.
- P2: 핵심 축은 있으나 돈/투자/결혼/공부 또는 bridge가 얇음.
- P3: career/study/bridge 일부는 상대적으로 안정적이나 돈/투자/결혼/reportUseCases는 보강 필요.

## 3. Money Gaps

- 공통: 16개 전부 money trait이 2~3개 수준이라 V2 돈 리포트에서 수입 방식, 소비 패턴, 돈 관리 리스크, 현금 흐름 전략을 분리해 쓰기 어렵다.
- INTJ: 장기 목표와 구조 중심 돈 감각은 있으나 현금 흐름, 가족/공동재정, 소비 억제 장면이 더 필요하다.
- INTP: 독립성과 관심사 중심 수입 가능성은 있으나 지출 관리, 수입 불규칙성, 실행 지연 리스크가 더 필요하다.
- ENTJ: 성과형 수입력은 있으나 가정 내 돈 권한, 공격적 확장, 돈으로 통제하는 리스크가 더 필요하다.
- ENTP: 수입 변동성은 잡혔으나 아이디어 수익화, 충동적 프로젝트 비용, 반복 수입 구조가 더 필요하다.
- INFJ: 의미 기반 소비와 안정 욕구는 있으나 수입 방식, 도움/기부/관계 지출 경계가 더 필요하다.
- INFP: 돈보다 의미를 우선하는 축은 있으나 현실 보상 구조, 저평가 노동, 감정 소비가 더 필요하다.
- ENFJ: 사람을 챙기며 쓰는 돈, 관계 유지 비용, 책임감으로 인한 과지출 장면이 더 필요하다.
- ENFP: money trait이 2개뿐이며 경험 소비, 즉흥 지출, 가능성 투자, 수입 루틴이 부족하다.
- ISTJ: 안정 수입과 보수성은 있으나 가족 공동재정, 책임 지출, 손익 계산이 관계에서 부딪히는 장면이 부족하다.
- ISFJ: 가족/보호 지출과 안정 저축은 있으나 자기 희생형 지출, 감사 욕구, 생활비 관리 장면이 부족하다.
- ESTJ: 관리형 돈 감각은 있으나 돈으로 역할과 책임을 압박하는 리스크, 가정 내 권한 갈등이 부족하다.
- ESFJ: 돌봄과 관계 지출은 있으나 인정 욕구, 기념일/행사 비용, 가족 돈 관리의 균형이 부족하다.
- ISTP: 실용 지출은 있으나 도구/취미 비용, 자유 시간과 돈의 관계, 장기 저축 루틴이 부족하다.
- ISFP: 감각/취향 소비는 있으나 충동 구매, 편안함 비용, 공동재정에서 닫히는 장면이 부족하다.
- ESTP: money trait이 2개뿐이며 현장 수입력, 빠른 거래, 경험 지출, 위험 감수의 돈 리스크를 더 분리해야 한다.
- ESFP: 표현/경험 소비는 있으나 사회생활 비용, 선물/이벤트 지출, 장기 재정 기준이 더 필요하다.

## 4. Investment Gaps

- 투자 영역은 전체적으로 가장 얇다. ENTJ만 최소 trait 수 3개를 충족하고, 나머지 15개 유형은 1~2개 수준이다.
- INTJ, INTP, ENTP: 분석과 아이디어는 있으나 실제 투자 원칙, 손절 기준, 과분석/과실험 리스크가 부족하다.
- INFJ, INFP: 투자 직접 정보가 1개 수준이라 가치 투자, 회피성, 신뢰 기반 판단, 불안 관리 장면이 부족하다.
- ENFJ, ENFP: 사람/기대/가능성에 끌리는 투자 판단과 관계 추천 리스크가 더 필요하다.
- ISTJ, ISFJ: 안정·보수 투자 성향은 있으나 장기 누적, 위험 회피, 가족 재정과 투자 결정의 충돌이 부족하다.
- ESTJ, ESFJ: 관리형 투자와 주변 평판/관계 영향이 더 필요하다.
- ISTP, ISFP: 실물·도구·감각 기반 투자 판단, 흥미 투자, 장기 루틴 부족이 더 필요하다.
- ESTP, ESFP: 충동성, 유행, 단기 보상, 경험 소비와 투자 판단을 분리하는 장치가 더 필요하다.

## 5. Marriage Gaps

- marriage trait은 16개 모두 2~3개 수준이다. 관계 매트릭스의 `marriagePattern`은 풍부하지만, 타입 자체의 결혼 생활 trait은 아직 독립 상품 재료로 부족하다.
- NT 계열: 결혼 후 개인 시간, 돈, 역할 분담, 감정 표현 빈도, 장기 계획의 충돌을 더 분리해야 한다.
- NF 계열: 정서적 안전감, 이상화, 관계 책임감, 자유/헌신 균형, 현실 생활 책임의 누적 장면이 더 필요하다.
- SJ 계열: 가족 책임, 생활 질서, 돈 관리, 역할 고정, 감사 표현 부족으로 생기는 피로를 더 구체화해야 한다.
- SP 계열: 자유 시간, 감각/경험, 소비, 즉흥성, 감정 표현 방식, 책임 분담 기준을 더 촘촘히 잡아야 한다.

우선 보강 대상:

- ISTJ, ISTP, ESTP: marriage trait이 2개라 특히 얇다.
- 전 유형: 결혼 리포트의 생활 리듬/돈/책임/정서 표현/가족 관계 문단으로 바로 끌어올 수 있는 trait 추가 필요.

## 6. Study Gaps

study는 5개 유형(INTJ, INTP, INFJ, INFP, ISFP)이 최소 4개 기준을 충족한다. 나머지 11개 유형은 3개 수준이라 보강이 필요하다.

- ENTJ: 목표·성과형 공부는 있으나 시험 전략, 과신, 약한 반복 루틴 보완이 필요하다.
- ENTP: 흥미 기반 학습과 토론 강점은 있으나 마감, 반복 암기, 자격증 루틴이 부족하다.
- ENFJ: 사람 중심 학습과 발표력은 있으나 혼자 공부, 객관식/논리 과목, 과잉 책임 관리가 부족하다.
- ENFP: 호기심과 가능성 학습은 있으나 루틴 유지, 시험 마감, 산만함 관리가 부족하다.
- ISTJ: 반복과 성실성은 있으나 변화형 시험, 응용 문제, 완벽주의 피로 관리가 부족하다.
- ISFJ: 꾸준함은 있으나 자신감, 시험 불안, 암기와 이해의 균형이 부족하다.
- ESTJ: 목표 관리와 실전성은 있으나 유연한 사고 과목, 과도한 통제, 휴식 전략이 부족하다.
- ESFJ: 관계형 학습은 있으나 혼자 집중, 평가 불안, 인정 욕구 관리가 부족하다.
- ISTP: 실습형 학습은 있으나 이론 축적, 장기 시험 계획, 반복 루틴이 부족하다.
- ESTP: 단기 목표와 실전 과제는 있으나 장기 준비, 필기/이론 과목, 충동 관리가 부족하다.
- ESFP: 활동형 학습은 있으나 시험 루틴, 집중 유지, 즉시 보상 의존 조절이 부족하다.

## 7. Career/Workplace Gaps

career/workplace는 다른 영역보다 상대적으로 낫지만 7개 유형이 기본 기준에 못 미친다.

- ENTP: career trait 5개. 아이디어형 직업성은 있으나 장기 실행, 조직 갈등, 반복 업무 피로를 더 구체화해야 한다.
- ENFJ: career trait 5개. 교육/상담/외교 축은 있으나 조직 내 감정 노동, 리더십 피로, 평가 구조가 더 필요하다.
- ENFP: career 4개, workplace 4개. 창의/사람/가능성은 있으나 직장 루틴, 마감, 직무 적합/부적합 장면이 부족하다.
- ESTJ: career trait 5개. 관리/성과는 있으나 부하와의 갈등, 권한 위임, 정서적 리더십이 더 필요하다.
- ESFJ: career trait 5개. 돌봄/관계 직무는 있으나 감정 노동, 평판 관리, 역할 과부하가 더 필요하다.
- ESTP: career 5개, workplace 4개. 현장/영업/활동성은 있으나 장기 커리어 성장, 조직 규칙 충돌, 위험 감수 관리가 부족하다.
- ESFP: career trait 5개. 무대/서비스/표현성은 있으나 반복 직무 피로, 감정 노동, 수입 안정 경로가 더 필요하다.

상대적으로 안정적인 유형:

- INTJ, INTP, ENTJ, INFJ, INFP, ISTJ, ISFJ, ISTP, ISFP는 기본 개수 기준을 충족한다. 다만 돈/투자/결혼 보강 후 직업 장면도 도메인별로 더 정교화할 수 있다.

## 8. ReportUseCases Gaps

- 16개 전부 구조는 존재한다.
- 대부분 `generalReport`, `careerReport`, `loveMarriageChildReport`, `compatibilityReport`, `daeunReport`, `saeunReport`가 각 2개 단서로 구성되어 있다. ESFP만 compatibilityReport가 3개다.
- 현재 상태는 "라우팅 힌트"로는 쓸 수 있으나, V2 리포트 writer가 실제 섹션 문장을 안정적으로 뽑아 쓰기에는 단서가 짧다.
- 전 유형 공통으로 각 reportUseCases를 최소 3~5개 수준으로 확장하고, money/investment/study/marriage 보강 trait의 id를 끌어다 쓰는 방식으로 재정렬해야 한다.

필요한 보강 방향:

- generalReport: 핵심 정체성 + 위험 + 성장 전략을 한 줄 단서로 분리
- careerReport: 추천 직무, 피해야 할 환경, 현재 직업 비교 포인트 포함
- loveMarriageChildReport: 연애/결혼/부모/자녀 단서를 분리
- compatibilityReport: 관계 매트릭스와 타입 고유 연애/결혼 trait 연결
- daeunReport: 대운에서 강화될 직업/돈/관계 신호 연결
- saeunReport: 세운에서 바로 쓸 행동 전략 연결

## 9. MyeongliBridgeHints Gaps

부족 타입 수는 11개다. count 기준 8개 미만이거나 도메인 연결이 얇은 유형을 대상으로 삼았다.

- INTP: 분석/수/편인 축은 있으나 돈, 결혼, 실행 지연과 연결되는 십성 보강 필요
- ENTJ: bridge count 5. 관성·편관·현침살·재성·금/화 연결을 더 세분화해야 함
- ENTP: 아이디어/상관/식신은 있으나 돈, 투자, 장기 책임 연결이 약함
- ENFJ: Fe 리더십과 관성/귀인/도화 연결은 있으나 결혼 책임, 감정 노동, 대운 활용이 약함
- ENFP: bridge count 6. 도화·홍염·식상·역마는 필요하나 돈/투자/루틴 연결이 부족함
- ISTJ: 책임/정관/정재 축은 있으나 결혼, 투자, 공부 루틴과 십성 연결이 더 필요함
- ESTJ: 관리/관성/재성은 있으나 통제 리스크, 가족 책임, 투자 판단 연결이 부족함
- ESFJ: bridge count 5. 도화/귀인/정인 중심에서 돈·가족·관계 피로 신호가 부족함
- ISTP: 실전/기술/금/편관 축은 있으나 감정 표현, 결혼 루틴, 돈 관리 연결이 부족함
- ESTP: 현장/편재/역마 축은 있으나 투자 리스크, 책임 분담, 장기 커리어 연결이 부족함
- ESFP: bridge count 5. 도화/홍염/식상은 있으나 소비, 결혼 책임, 직업 안정 연결이 부족함

충분 판정 타입:

- INTJ, INFJ, INFP, ISFJ, ISFP는 bridge count와 도메인 연결이 상대적으로 안정적이다.

## 10. Meta/Forbidden Findings

- 메타 표현 잔여: 0
- 금지 표현 잔여: 0

검사 패턴:

- 메타 표현: `원문은`, `자료상`, `묘사한다`, `구조로 묘사된다`, `Golden pair`, `사회인격학`, `상극`
- 금지 표현: `최악`, `무조건 헤어짐`, `절대 안 맞음`, `무조건 결혼`, `운명적으로 정해짐`, `반드시 헤어짐`, `100% 맞음`, `100% 안 맞음`, `파국`

민감한 통계성 정보는 source trait 안에서 상품 문장으로 직접 쓰기 어렵다. 필요 시 생활관리, 성향, 환경 적합도 표현으로만 우회해야 한다.

## 11. Next Fix Priority

1. money
   - 16개 전부 보강 필요.
   - 수입 방식, 소비 패턴, 돈 관리 리스크, 장점 활용 방식을 trait으로 분리한다.
   - 우선 대상: ENFP, ESTP, ISTJ, ISTP, ENFJ, ESFJ

2. investment
   - 15개 보강 필요. ENTJ만 최소 count 기준 충족.
   - 투자 성향, 리스크 관리, 충동/회피/과신, 장기성 여부를 분리한다.
   - 우선 대상: INFJ, INFP, ENFP, ESTP, ESFP, ENTP

3. marriage
   - 16개 전부 보강 필요.
   - 관계 매트릭스의 pair별 `marriagePattern`과 별개로, 타입 고유의 결혼 생활 trait을 확장한다.
   - 우선 대상: ISTJ, ISTP, ESTP, ENFP, ENFJ, ESFJ

4. study
   - 11개 보강 필요.
   - 우선 대상: ENTP, ENFP, ESTP, ESFP, ISTP, ISTJ

5. career/workplace
   - 7개 보강 필요.
   - 우선 대상: ENFP, ESTP, ESFP, ENTP, ENFJ

6. reportUseCases
   - 16개 전부 확장 권장.
   - trait 보강 후 각 product report 섹션에서 바로 참조 가능한 단서로 재작성한다.

7. myeongliBridgeHints
   - 11개 보강 필요.
   - money/investment/marriage 보강 후 십성, 오행, 신살, 귀인 신호를 trait id와 연결한다.
