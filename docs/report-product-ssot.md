# Report Product SSOT v0.1

## Status

This document is the source of truth for report product direction,
interpretation policy, voice, shared UI structure, and product-level QA.

`docs/report-knowledge-architecture.md` remains the source for knowledge,
evidence, generation, validation, and storage architecture. When product voice,
UI hierarchy, and interpretation tone conflict with implementation details, this
document wins.

## 0. Product Philosophy

The core structure is:

명리 계산값 + MBTI 지식베이스 + bridge engine

명리는 구조를 잡고, MBTI는 사용자가 "내 얘기다"라고 느끼는 성향 밀도를
올리고, AI는 둘을 자연스럽게 연결해 현실적인 문장으로 푼다.

외부 사용자는 명리 기반 리포트 + MBTI 성향 보정으로 느껴야 한다. 내부
시스템은 MBTI 지식베이스를 강하게 사용해도 된다.

Do not list Saju calculation values only. Do not paste MBTI descriptions as the
report. The report must find the overlap between Myeongli signals and MBTI
tendencies, then say something the user can feel immediately:

> 너 이런 편이지?

## 1. Voice Standard

The tone is soft but clear. 젊은 사용자도 편하게 읽을 수 있어야 하지만,
저급한 말투나 값싼 유행어를 쓰면 안 된다.

Required voice:

- 부드럽지만 확실하게 말한다.
- "~일 수 있습니다" 반복 금지.
- "신호가 있어요" 식 흐린 말투 금지.
- "당신은 이런 쪽입니다", "이 방식이 맞습니다", "이건 손해입니다"처럼 분명하게 말한다.
- 안전문구는 맨 아래에 짧게 둔다.
- 안전문구가 본문 텐션을 죽이면 안 된다.

Good sentence direction:

> 당신은 전문적인 환경에서 비효율, 무능, 느린 판단을 그냥 넘기기 어렵습니다.
> 특히 ENTJ의 지휘형 성향에 사주의 현침살·관성 흐름이 겹치면, 사람의
> 약점이나 구조의 결함을 빠르게 짚는 말이 나옵니다. 주변에서는 "팩트가
> 너무 세다"는 말을 들을 수 있습니다. 이건 조직을 고치고 성과를 끌어올리는
> 강점입니다. 다만 감정형 상대에게는 "맞는 말인데 너무하다"는 인상을 줄 수
> 있습니다. 당신이 더 크게 가려면 말을 약하게 하는 게 아니라, 피드백 순서를
> 바꿔야 합니다.

Use expressions such as:

- 판을 읽는다
- 구조를 잡는다
- 팩트가 세다
- 말이 바로 꽂힌다
- 감으로 넘기지 않는다
- 손해 보는 구조다
- 이쪽이 맞다
- 잘 맞는 판이다
- 이건 피해야 한다
- 관계에서 피로가 쌓인다
- 성과로 증명해야 한다

Avoid:

- "~일 수 있습니다" repeated in every paragraph
- "~가능성이 있습니다" repeated in every paragraph
- "신호가 있어요"
- "미입력이라서 단정하지 않습니다"
- "관계 상태가 입력되지 않았으므로"
- "단순히 참고하세요"
- "좋을 수도 있고 나쁠 수도 있습니다"

## 2. Myeongli x MBTI Interpretation Principle

Internal rules:

- MBTI alone can support "너 이런 편이지?" statements.
- Myeongli signals alone can support strong interpretation.
- When MBTI and Myeongli overlap, the report can speak very strongly.
- When they conflict, interpret as "겉과 속", "환경별 발현", or "일에서는 A, 관계에서는 B".

User-facing copy should not mechanically split:

1. 명리 근거
2. MBTI 근거
3. 결론

Instead, the report should merge them naturally:

> 당신은 구조의 빈틈을 보면 그냥 넘기기 어렵습니다. ENTJ의 지휘형 성향에
> 현침살과 관성 흐름이 겹치면, 말이 부드럽게 돌아가기보다 문제의 핵심을 바로
> 찌르는 쪽으로 나옵니다.

## 3. Common Input Contract

All products should be designed around the same base profile inputs:

- 이름
- 성별
- 생년월일
- 태어난 시간
- 양력/음력
- 출생지 또는 기준 시간대
- MBTI
- 현재 직업/상태
- 세부 직업/전공/업무 분야 선택 입력
- 연애 상태 선택 입력

### Job Input Policy

직업 리포트는 현재 직업에 갇히면 안 된다.

- 타고난 직업 적성 = 사주 + MBTI로 분석한다.
- 현재 직업 = 적합도 비교용이다.
- 세부 직업 = 문장 현실화용이다.

Example:

> 당신은 원래 구조를 만들고 사람과 자원을 움직이는 쪽이 맞습니다. 지금
> 개발·서비스 기획을 하고 있다면, 단순 기획자보다 PM/PO, 전략기획,
> 사업개발, 수익 구조 설계 쪽으로 확장할수록 강점이 살아납니다.

### Relationship Status Policy

Allowed relationship states:

- `single/solo` - 솔로
- `dating` - 썸/연애 중
- `married` - 기혼
- `breakup_reunion` - 이별/재회 고민
- `unknown` - 미입력

Excluded state:

- 결혼 생각 있음

Reason: "결혼 생각 있음" belongs to the compatibility, marriage, or love
product domain, not a base relationship status.

Unknown or missing relationship state must not be exposed in report body copy.
Do not write "미입력이라서", "관계 상태가 입력되지 않았으므로", or similar
internal limitation text.

Breakup/reunion handling:

- 상대 정보 없음: read the user's own Saju and MBTI for reunion attachment,
  contact style, patterns of holding on, and relationships that should be
  released.
- 상대 정보 있음: use the compatibility report to read reunion possibility,
  conflict causes, and problems likely to repeat after reunion.

## 4. Common Report Top UI

Every product starts in this order:

1. 만세력표
2. MBTI표
3. 상품별 핵심 결론
4. 상품별 본문

Every large section is a whole-section accordion:

- 만세력표 접기/펼치기
- MBTI표 접기/펼치기
- 대운표 접기/펼치기
- 세운표 접기/펼치기
- 본문 챕터별 접기/펼치기
- 명리 근거 접기/펼치기
- AI 붙여넣기용 요약 접기/펼치기

Partial collapse inside a chapter is not allowed. Collapse the entire chapter as
one unit.

## 5. Bazi Chart UI Standard

The Bazi chart is a full table, not a summary card.

Displayed columns:

- 시주
- 일주
- 월주
- 연주

Displayed rows or cells:

- 천간
- 지지
- 십성
- 오행
- 십이운성
- 신살
- 귀인
- 합·충·형·파·해
- 지장간

Five-element colors are fixed:

| Element | Korean | Hex |
| --- | --- | --- |
| wood | 목 | `#8CB84A` |
| fire | 화 | `#E96B72` |
| earth | 토 | `#D39A3A` |
| metal | 금 | `#F2CF63` |
| water | 수 | `#7DB9D8` |

토와 금은 반드시 구분한다. 토는 황토/흙색, 금은 밝은 금색/연금색이다.

## 6. MBTI Panel UI Standard

The MBTI panel is not a small helper. It is a major evidence screen where users
recognize their own tendency.

Displayed items:

- MBTI 유형명
- 한 줄 별칭
- 선호 지표 E/I, S/N, T/F, J/P
- 기능 서열
- 주기능
- 부기능
- 3차 기능
- 열등 기능
- 가까운 키워드 30
- 먼 키워드 30

Example:

```text
ENTJ
판을 움직이는 지휘관
주기능 Te: 외향 사고
부기능 Ni: 내향 직관
3차 기능 Se: 외향 감각
열등 기능 Fi: 내향 감정
```

Do not put a long explanation under the MBTI panel. Detailed interpretation is
handled in the product body by mixing MBTI with Myeongli.

## 7. Body UI Standard

Do not over-split report body into cards.

Required direction:

- 카드 남발 금지
- 짧은 요약 카드만 반복 금지
- 본문은 긴 문단 중심
- 줄바꿈과 소제목으로 가독성 확보
- 각 챕터는 접이식
- 표는 필요한 곳에만 사용

Good chapter structure:

1. 섹션 제목
2. 강한 한 줄 결론
3. 2~4문단 설명
4. 현실 장면 3개
5. 전략 3개
6. 주의 2개

Bad structure:

- 짧은 카드 20개
- 각 카드 2문장
- 내용 반복
- "~가능성이 있습니다" 반복

## 8. MBTI Knowledge Base Structure

원문 그대로 출력 금지.

Do not output raw source prose. In particular, do not expose copied Namuwiki or
other source text as service copy. Internal source collection can help
knowledge-building, but external output must be rewritten in our product voice.

Target shape:

```ts
type MbtiKnowledgeProfile = {
  type: MbtiType;
  titleKo: string;
  archetypeKo: string;
  axes: {
    energy: "E" | "I";
    perception: "S" | "N";
    judgment: "T" | "F";
    lifestyle: "J" | "P";
  };
  functions: {
    dominant: CognitiveFunction;
    auxiliary: CognitiveFunction;
    tertiary: CognitiveFunction;
    inferior: CognitiveFunction;
  };
  keywords: {
    close: string[];
    far: string[];
  };
  domains: {
    identity: MbtiTrait[];
    thinking: MbtiTrait[];
    communication: MbtiTrait[];
    career: MbtiTrait[];
    money: MbtiTrait[];
    study: MbtiTrait[];
    love: MbtiTrait[];
    marriage: MbtiTrait[];
    parenting: MbtiTrait[];
    child: MbtiTrait[];
    risk: MbtiTrait[];
  };
  recommendedJobs: JobRecommendation[];
  avoidJobs: JobRecommendation[];
  relationHints: Partial<Record<MbtiType, MbtiRelationInsight>>;
};

type MbtiTrait = {
  id: string;
  label: string;
  richDescriptionKo: string;
  strongLineKo: string;
  positiveUseKo: string;
  riskKo: string;
  matchingMyeongliSignals: MyeongliSignal[];
  productDomains: ProductDomain[];
  intensity: "low" | "medium" | "high";
};
```

`richDescriptionKo` is critical. A few keywords are not enough. Each MBTI type
needs at least 5 to 10 rich traits that can be connected to product domains.

## 9. Myeongli x MBTI Bridge Engine

Purpose: connect Saju calculation values and MBTI traits.

Examples:

- 현침살 + ENTJ = 직설적 피드백, 팩트가 센 말
- 도화/홍염 + ESFP = 인기, 표현, 무대성
- 편재 + ESTP = 거래, 영업, 현장 수익
- 식상 + ISFP = 예술 표현, 감각 창작
- 정관 + ISTJ = 규칙, 조직, 공무원성
- 정인 + INFJ = 상담, 교육, 회복, 의미 부여

Bridge output:

```ts
type MyeongliMbtiBridge = {
  traitId: string;
  mbtiType: MbtiType;
  myeongliSignals: string[];
  strength: "low" | "medium" | "high";
  productDomains: ProductDomain[];
  userFacingLineKo: string;
  strategyKo: string;
  riskKo: string;
};
```

Output principle: do not split Myeongli evidence and MBTI evidence mechanically.
The body should merge them naturally:

> ENTJ의 지휘형 성향에 현침살과 관성 흐름이 겹치면, 비효율을 보는 순간
> 말이 바로 나오는 편입니다. 이건 조직 개선에는 강점이지만, 관계에서는
> "맞는 말인데 너무 세다"는 반응을 만들 수 있습니다.

## 10. MBTI Relation Matrix

Compatibility uses MBTI relationship data as a major layer. Build a 16x16
relationship matrix.

```ts
type MbtiRelationInsight = {
  pair: [MbtiType, MbtiType];
  relationLabelKo: string;
  attractionKo: string[];
  frictionKo: string[];
  lovePatternKo: string;
  marriagePatternKo: string;
  communicationKo: string;
  conflictTriggerKo: string[];
  repairStrategyKo: string[];
  goodForKo: string[];
  badForKo: string[];
};
```

Compatibility copy should be direct:

> 당신에게 잘 맞는 상대는 ISFP, ESFP, INTJ 쪽입니다. ISFP는 당신의 강한
> 추진력과 직설성을 부드럽게 잡아주는 쪽입니다. 당신은 방향과 결정을 잡고,
> 상대는 감정과 생활 균형을 잡습니다. 잘 맞으면 서로의 약점을 정확히
> 보완합니다. 다만 당신의 피드백이 너무 세지면 ISFP는 반박하기보다 조용히
> 닫힐 수 있습니다. 이 조합은 "맞는 말"보다 "말하는 순서"가 중요합니다.

## 11. Product-Specific Standards

### 11.1 Comprehensive Report

Purpose: provide an integrated life manual from Saju structure and MBTI
tendency.

Structure:

- 만세력표
- MBTI표
- 핵심 정체성
- 성격/사고방식
- 직업/돈
- 연애/결혼
- 인간관계
- 학업/자격
- 부모가 되었을 때
- 몸/생활 리듬
- 강점 TOP
- 위험 TOP
- 명리 근거
- AI 붙여넣기용 요약

### 11.2 Annual Fortune Report

세운은 현재 대운과 MBTI 반영을 필수로 한다.

세운 리포트 must combine:

- 올해 세운
- 현재 대운
- 원국
- MBTI
- 현재 직업/상태

Example:

> 2026년 丙午 세운은 결과물과 노출을 올리는 해입니다. 여기에 현재 戊辰
> 대운의 현실 책임이 깔리고, ENTJ 성향까지 겹치면 올해는 "보이는 성과를
> 만들고 권한을 요구해야 하는 해"로 읽습니다.

Required annual features:

- 해 선택 UI
- 과거 5년 선택 가능
- 12월부터 다음 해 신년 리포트 오픈
- 현재 대운 반영
- MBTI 반영

Year access policy:

- 기본 선택 가능 연도 = 현재연도 - 5년 ~ 현재연도
- 현재 날짜가 12월 1일 이후면 다음연도도 선택 가능

### 11.3 Major Fortune Report

대운은 현재 세운과 MBTI 반영을 필수로 한다.

대운 리포트 must keep the current annual fortune position and strengthen MBTI
translation.

Required layers:

- 대운 10년 구조
- 올해 세운 위치
- MBTI 성향
- 직업/관계 상태

The major fortune table shows 대운 and 세운 side by side, following the compact
timeline direction already established for the major fortune product.

### 11.4 Career, Money, Study Report

직업 리포트는 현재 직업에 갇히지 말고 타고난 적성 중심으로 해석한다.

Structure:

- 만세력표
- MBTI표
- 타고난 직업 정체성
- 잘 맞는 직업군
- 구체 직업 추천
- 피해야 할 직무/환경
- 돈 버는 방식
- 투자·저축 성향
- 학업·자격증 전략
- 포트폴리오/스펙 전략
- 강한 시기
- 리스크 경고
- 실행 플랜

Concrete job recommendations are required. Examples:

- PM/PO
- 서비스 기획
- 사업개발
- 전략기획
- 법조인
- 교수
- CEO
- 정치인
- 회계/재무
- 프로그래머
- 웹 개발자
- 컨설턴트
- 핀테크/결제/정산 기획

Investment copy can be direct but must stay inside safety boundaries:

> 당신은 감으로 사고파는 단타보다, 우량 자산을 장기 분산으로 쌓는 쪽이
> 맞습니다. 레버리지와 몰빵은 성향상 손실이 커지기 쉬운 방식입니다.

Specific stock buy/sell instructions are forbidden.

### 11.5 Love, Marriage, Child Report

This product reads "my love, marriage, and parent style". It does not require
actual child Saju or child MBTI input.

Structure:

- 만세력표
- MBTI표
- 내 연애 스타일
- 내가 끌리는 사람
- 나를 힘들게 하는 사람
- 잘 맞는 MBTI TOP
- 피곤한 MBTI TOP
- 썸/연애 중 행동 패턴
- 결혼하면 나오는 모습
- 부모가 되었을 때
- 관계에서 반복되는 실수
- 좋은 관계를 만드는 전략

Child section means:

- 내가 부모가 되었을 때 어떤 부모가 되는가
- 아이에게 강하게 주는 것
- 아이를 힘들게 할 수 있는 것
- 보완해야 할 양육 방식

### 11.6 Compatibility Report

Structure:

- A 만세력표
- A MBTI표
- 중간 연결 표시
- B 만세력표
- B MBTI표
- 두 사람 핵심 궁합
- 끌림 포인트
- 충돌 포인트
- 연애 궁합
- 결혼 궁합
- 성격/대화 궁합
- 돈/생활 궁합
- 성생활/스킨십 성향
- 가족/자녀관 궁합
- 재회 가능성/관계 회복 전략
- 잘 맞는 시기
- 주의할 시기

The middle connector stays simple:

- 작은 하트
- 두 사람 이름 사이 연결선
- "A x B" 카드

Do not overdecorate it.

## 12. Copy Features

Both copy features are required.

### Full Report Copy

Place a button near the top or bottom:

- 전체 리포트 복사

### AI Paste Summary

Place a bottom accordion:

- AI에게 붙여넣기용 요약

Include:

- 이름
- 생년월일시
- 사주 원국
- 대운
- 세운
- MBTI
- 핵심 성향
- 강점
- 약점
- 직업 추천
- 연애 패턴
- 궁합 핵심
- 주의점

## 13. Product Selection UI

Main product cards show a small version badge:

- `v1.0`

The badge should be small, muted, and secondary. It must not appear inside
generated report body titles.

Add a small update notice area:

```text
최근 업데이트
- MBTI 성향 해석 강화
- 대운/세운 연결 반영
- 만세력표 상단 표시
```

Do not let update notices interfere with product selection.

## 14. Safety Boundary

Strong statements are allowed:

- 이 직업군이 맞습니다
- 이 관계 패턴이 반복됩니다
- 이런 사람에게 끌립니다
- 이런 조직은 손해입니다
- 이 해는 이직/수익화/연애 접점이 강합니다

Forbidden:

- 특정 날짜 결혼 확정
- 특정 종목 매수/매도
- 확정 수익
- 질병 진단
- 법률 판단
- 임신/출산 확정
- 사망/재난 단정

Safety note:

> 이 리포트는 성향과 흐름 해석이며, 실제 선택과 환경에 따라 결과는 달라질 수 있습니다.

Keep the safety note short. Do not weaken the report body.

## 15. QA Standard

Validators, smoke scripts, preview checks, and source tests should catch:

1. MBTI 성향이 본문에 실제로 반영됐는가
2. 명리 신호와 MBTI 성향이 연결됐는가
3. "~가능성이 있습니다" 반복이 과하지 않은가
4. "미입력이라서" 같은 내부 상태가 노출되지 않는가
5. 만세력표가 모든 상품 상단에 있는가
6. MBTI표가 모든 상품 상단에 있는가
7. 세운에 현재 대운이 반영됐는가
8. 대운에 현재 세운이 반영됐는가
9. 세운 해 선택과 12월 신년 오픈이 구현됐는가
10. 직업 리포트가 현재 직업에 갇히지 않는가
11. 연애·결혼·자녀 리포트가 실제 자녀 입력을 요구하지 않는가
12. 궁합 리포트가 두 사람의 만세력/MBTI를 모두 보여주는가
13. 나무위키 원문이 그대로 노출되지 않는가
14. 저작권 위험 문장 복붙이 없는가
15. 금융/건강/법률 단정이 과하지 않은가
16. 카드 과다 분할 방지
17. AI 붙여넣기용 요약이 있는가
18. 전체 리포트 복사 기능이 있는가

## 16. Development Phases

### PHASE 0 - SSOT Document Lock

- Create `docs/report-product-ssot.md`.
- Make `docs/report-knowledge-architecture.md` reference this file.

### PHASE 1 - MBTI Knowledge Base Rebuild

Files:

- `src/lib/report-knowledge/mbtiTypes.ts`
- `src/lib/report-knowledge/mbtiKnowledgeBase.ts`
- `src/lib/report-knowledge/mbtiRelationMatrix.ts`
- `src/lib/report-knowledge/mbtiMyeongliBridge.ts`

Implement:

- 16 type profiles
- function stacks
- keywords
- career/money/love/marriage/child/relation/risk traits
- recommended jobs
- avoid jobs
- relationship matrix
- Myeongli signal matching

### PHASE 2 - Common Bazi UI

Files:

- `src/components/report/BaziChart.tsx`
- `src/components/report/BaziPillarCell.tsx`
- `src/components/report/BaziElementLegend.tsx`
- `src/components/report/ReportAccordionSection.tsx`

Implement:

- hour/day/month/year pillar table
- fixed element colors
- ten gods, sinsal, noblemen, hidden stems
- whole-section accordion
- reusable across all products

### PHASE 3 - Common MBTI UI

Files:

- `src/components/report/MbtiProfilePanel.tsx`
- `src/components/report/MbtiPreferenceTable.tsx`
- `src/components/report/MbtiFunctionStack.tsx`
- `src/components/report/MbtiKeywordPanel.tsx`

Implement:

- preference table
- function stack
- close/far keywords 30/30
- one-line type identity
- whole-section accordion

### PHASE 4 - Common Report Shell

Files:

- `src/components/report/ReportPageShell.tsx`
- `src/components/report/ReportCopyActions.tsx`
- `src/components/report/AiPromptSummary.tsx`

Implement:

- top Bazi chart
- top MBTI panel
- full report copy
- AI paste summary
- chapter accordions

### PHASE 5 - Bridge Engine

Files:

- `src/lib/report-knowledge/personalityBridgeEvidence.ts`
- `src/lib/report-knowledge/myeongliMbtiSignalMatcher.ts`

Implement:

- Myeongli signal extraction
- MBTI trait matching
- strength calculation
- product-specific interpretation candidates

### PHASE 6 - Career Report Rebuild

This is the first product for body-quality verification.

Changes:

- current job is context only
- natural aptitude is primary
- concrete recommended jobs
- concrete avoid jobs
- stronger money/investment/certificate/portfolio guidance
- stronger MBTI x Myeongli copy

### PHASE 7 - Annual and Major Fortune Reinforcement

Annual fortune:

- year selection UI
- past 5 years
- next-year open from December
- current major fortune reflected
- MBTI reflected

Major fortune:

- current annual fortune reflected
- MBTI reflected more strongly
- major fortune table UI improved

### PHASE 8 - Love, Marriage, Child Report

New or rebuilt product:

- my love style
- compatible partners
- difficult partners
- marriage style
- when I become a parent
- breakup/reunion concern option

### PHASE 9 - Compatibility Report Rebuild

Structure:

- A Bazi + MBTI
- heart connector
- B Bazi + MBTI
- Myeongli compatibility
- MBTI compatibility
- Myeongli x MBTI cross-compatibility
- love/marriage/money/child values/reunion strategy

### PHASE 10 - Comprehensive Report Integration

Apply all improved structures to the comprehensive report.
