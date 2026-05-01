02_SAJU_CALC_SPEC.md 초안

# 02_SAJU_CALC_SPEC.md
# 결리포트 Saju Calculation Spec v0.1
Status: DRAFT  
Product: 결리포트 / Gyeol Report  
Scope: V1 MVP 만세력 계산 및 명리학 구조 추출 기준
---
## 1. Purpose
이 문서는 결리포트 V1에서 사용하는 만세력 계산 기준과 명리학 구조 추출 방식을 고정한다.
결리포트의 신뢰도는 만세력 계산 정확도에 크게 의존한다.  
따라서 사주 계산은 LLM에게 맡기지 않고, 코드와 검증 가능한 룰 기반 로직으로 처리한다.
LLM은 계산 결과를 해석 문장으로 편집하는 데만 사용한다.
---
## 2. Core Principle
결리포트의 사주 계산 원칙은 다음과 같다.
```txt
사주 계산은 deterministic 해야 한다.
같은 입력값은 항상 같은 사주팔자와 같은 구조 태그를 생성해야 한다.

금지:

* LLM에게 생년월일시를 주고 사주팔자를 계산하게 하는 것
* LLM이 임의로 일간, 월주, 시주, 십성, 오행을 추정하는 것
* 검증되지 않은 만세력 결과를 그대로 사용하는 것
* 계산 기준이 문서화되지 않은 상태로 구현하는 것

⸻

3. Input Fields

Required Inputs

V1에서 필수 입력값은 다음과 같다.

birthDate
calendarType
gender
mbti

Conditional Inputs

birthTime
birthTimeUnknown
isLeapMonth

Input Definitions

Field	Type	Required	Description
birthDate	YYYY-MM-DD	Yes	사용자의 생년월일
birthTime	HH:mm	No	출생시간
birthTimeUnknown	boolean	Yes	출생시간 모름 여부
calendarType	SOLAR / LUNAR	Yes	양력/음력 선택
isLeapMonth	boolean	Conditional	음력 입력 시 윤달 여부
gender	MALE / FEMALE / OTHER_OR_UNSPECIFIED	Yes	성별
mbti	16 MBTI types / UNKNOWN	Yes	사용자가 직접 입력한 MBTI

⸻

4. Timezone Standard

Default Timezone

Asia/Seoul
KST UTC+09:00

결리포트 V1은 한국 사용자 중심 서비스이므로 모든 출생시간은 기본적으로 한국 표준시 기준으로 계산한다.

Overseas Birth

V1에서는 해외 출생지 보정을 지원하지 않는다.

Allowed wording:

결리포트 V1은 한국 표준시 기준으로 계산합니다. 해외 출생 또는 출생지별 시차 보정은 향후 고급 설정에서 지원될 수 있습니다.

⸻

5. Calendar Conversion

Solar Date

양력 입력은 그대로 KST 기준 날짜로 처리한다.

Lunar Date

음력 입력은 양력으로 변환한 뒤 사주 계산에 사용한다.

Leap Month

음력 입력 시 윤달 여부를 선택할 수 있어야 한다.

Requirements:

* 음력 → 양력 변환 지원
* 윤달 입력 지원
* 변환 실패 시 사용자에게 명확한 오류 메시지 표시
* 변환 결과는 report record에 저장

Forbidden:

* 윤달을 일반 음력월로 조용히 처리하는 것
* 변환 실패 시 임의 날짜로 대체하는 것
* 사용자가 입력한 음력 날짜와 변환된 양력 날짜를 저장하지 않는 것

⸻

6. Pillars to Calculate

V1에서 계산하는 기본 사주 항목은 다음과 같다.

Item	Required	Notes
Year Pillar	Yes	년주
Month Pillar	Yes	월주
Day Pillar	Yes	일주
Hour Pillar	Conditional	출생시간이 있을 때만
Day Master	Yes	일간
Ten Gods	Yes	십성
Five Elements	Yes	오행
Yin/Yang	Yes	음양
Hidden Stems	Yes	지장간
Major Relations	Yes	합/충 중심
Selected Shinsal	Optional	V1에서는 보조 설명만
Daewoon	No	V1 제외
Sewoon	No	V1 제외

⸻

7. Year Pillar Policy

년주는 절기 기준으로 계산한다.

명리학 사주에서 년주는 양력 1월 1일 기준이 아니라, 일반적으로 입춘을 기준으로 전환한다.

Requirement

* 입춘 이전 출생자는 전년도 년주로 계산한다.
* 입춘 이후 출생자는 해당 연도 년주로 계산한다.
* 입춘 시각 기준은 계산 라이브러리/절기 데이터에 의해 결정한다.

Important

연도 변경은 양력 1월 1일이 아니라 입춘 기준이다.

⸻

8. Month Pillar Policy

월주는 절기 기준으로 계산한다.

Requirement

월주는 음력 월 기준이 아니라 절기 기준 월령으로 계산한다.

Month Branch 기준

절기 구간	월지
입춘 ~ 경칩 전	寅
경칩 ~ 청명 전	卯
청명 ~ 입하 전	辰
입하 ~ 망종 전	巳
망종 ~ 소서 전	午
소서 ~ 입추 전	未
입추 ~ 백로 전	申
백로 ~ 한로 전	酉
한로 ~ 입동 전	戌
입동 ~ 대설 전	亥
대설 ~ 소한 전	子
소한 ~ 입춘 전	丑

Requirement

* 절기 경계일 출생자는 절기 정확 시각 기준으로 월주를 결정한다.
* 단순 날짜 기준으로 월주를 계산하지 않는다.
* 절기 데이터는 검증 가능한 소스 또는 라이브러리를 사용한다.

⸻

9. Day Pillar Policy

일주는 기준일과 60갑자 순환으로 계산한다.

Requirement

* 일주 계산은 deterministic 해야 한다.
* 기준 epoch와 계산 방식은 코드 주석 또는 별도 문서에 명시한다.
* 최소 100개 이상의 기준 샘플과 대조한다.

Day Boundary Policy

V1 기본 일자 변경 기준:

00:00 기준 일자 변경

즉 00:00 이후는 다음 날로 처리한다.

⸻

10. 子時 Policy

자시 처리에는 명리학적 관점 차이가 있다.

V1 기본 정책:

조자시 기준
00:00 기준으로 일자를 변경한다.

23:00~23:59 출생자 처리

23:00~23:59 출생자의 경우 일부 명리학 관점에서는 다음 날 일주로 보는 야자시 기준을 사용하기도 한다.

V1에서는 기본값은 조자시로 고정하되, 결과 하단에 안내 문구를 제공한다.

Allowed wording:

23시대 출생자는 명리학 관점에 따라 일주 계산 기준이 달라질 수 있습니다. 결리포트 V1은 기본적으로 00:00 기준 일자 변경 방식을 사용합니다.

Future Option

V1.1 이후 고급 설정에서 다음 옵션을 제공할 수 있다.

* 조자시: 00:00 기준 일자 변경
* 야자시: 23:00 기준 다음 날 일주 적용

⸻

11. Hour Pillar Policy

출생시간이 제공된 경우 시주를 계산한다.

시지 기준

Time Range	Hour Branch
23:00 ~ 00:59	子
01:00 ~ 02:59	丑
03:00 ~ 04:59	寅
05:00 ~ 06:59	卯
07:00 ~ 08:59	辰
09:00 ~ 10:59	巳
11:00 ~ 12:59	午
13:00 ~ 14:59	未
15:00 ~ 16:59	申
17:00 ~ 18:59	酉
19:00 ~ 20:59	戌
21:00 ~ 22:59	亥

시천간 계산

시천간은 일간 기준 공식으로 계산한다.

Day Stem Group	子 Hour Stem
甲 / 己	甲子
乙 / 庚	丙子
丙 / 辛	戊子
丁 / 壬	庚子
戊 / 癸	壬子

이후 시간지 순서에 따라 천간을 순환시켜 시주를 구한다.

⸻

12. Birth Time Unknown Policy

출생시간을 모르는 경우에도 리포트 생성을 허용한다.

Default Behavior

* 년주, 월주, 일주 기준 삼주 리포트를 생성한다.
* 시주는 확정하지 않는다.
* 시주 관련 십성, 오행, 합충은 확정 분석에서 제외한다.

Required Report Notice

출생시간 모름 리포트에는 다음 취지의 안내가 포함되어야 한다.

출생시간을 모르는 경우, 이 리포트는 년주·월주·일주 중심으로 해석합니다. 시주가 포함되지 않으므로 일부 성향, 말년운, 자녀/내면 표현 관련 해석은 제한될 수 있습니다.

⸻

13. Hour Pillar Candidate Simulation

출생시간을 모르는 사용자를 위해 “시주 후보 시뮬레이션”을 제공할 수 있다.

Purpose

이 기능은 실제 출생시간을 맞히는 기능이 아니다.

목적은 다음과 같다.

* MBTI 자기인식과 사주 원국의 부족/과다 구조를 비교
* 특정 시주가 추가될 때 서사적으로 어떤 성향이 보완되는지 설명
* 사용자가 자기이해용 참고 자료로 볼 수 있게 제공

Allowed

MBTI 성향과 현재 원국의 부족/과다 구조를 비교했을 때, 수 기운이 보완되는 시주 후보가 자기서사적으로 더 자연스럽게 느껴질 수 있습니다.

Forbidden

당신의 태어난 시간은 이 시간입니다.
MBTI로 실제 시주를 맞혔습니다.
이 시주가 확정입니다.

V1 Implementation

V1에서는 이 기능을 필수 구현하지 않는다.

Recommended V1 policy:

출생시간 모름 사용자는 삼주 리포트를 기본 제공한다.
시주 후보 시뮬레이션은 V1.1 후보 기능으로 둔다.

단, 개발 여유가 있으면 V1에 “가벼운 참고 섹션”으로 포함할 수 있다.

⸻

14. Five Elements Calculation

오행 분포는 천간, 지지, 지장간을 기준으로 계산한다.

V1 Minimum

V1에서는 다음 두 종류를 구분 저장한다.

visibleElements
weightedElements

visibleElements

천간과 지지의 표면 오행만 집계한다.

weightedElements

천간, 지지, 지장간을 포함한 가중 집계다.

가중치는 추후 조정 가능하지만, V1에서는 deterministic 해야 한다.

Recommended initial weight:

Source	Weight
Heavenly Stem	1.0
Earthly Branch main element	1.0
Hidden Stem main	0.6
Hidden Stem sub	0.3
Hidden Stem minor	0.1

Requirement

* 가중치 로직은 코드에 하드코딩하지 말고 상수로 분리한다.
* 리포트 문장에서는 수치보다 “강함/약함/부족/과다”로 표현한다.

⸻

15. Ten Gods Calculation

십성은 일간을 기준으로 각 천간/지장간과의 관계로 계산한다.

Required

* 년간 십성
* 월간 십성
* 일간은 본인 기준이므로 십성 없음
* 시간 십성
* 지장간 십성
* 십성 분포

Ten Gods

Korean	Meaning
비견	Peer / Self
겁재	Competitor / Rival
식신	Output / Stable Expression
상관	Output / Rebellious Expression
편재	External Wealth / Opportunity
정재	Stable Wealth / Management
편관	Pressure / Challenge / Control
정관	Order / Responsibility
편인	Indirect Resource / Intuition
정인	Direct Resource / Learning

Requirement

십성 해석은 직접적 운명 단정이 아니라 성향 언어로 변환한다.

Example:

편관이 강하다 → 압박 속에서 집중력이 올라가고, 책임과 통제 욕구가 강하게 나타날 수 있다.

Forbidden:

편관이 강하니 반드시 고생한다.
편재가 강하니 무조건 돈복이 있다.

⸻

16. Yin/Yang Calculation

각 천간과 지지의 음양을 계산하여 전체 음양 균형을 저장한다.

Output

yinCount
yangCount
yinYangBalance

Labels

Label	Meaning
YIN_HEAVY	음 기운 우세
YANG_HEAVY	양 기운 우세
BALANCED	균형형

⸻

17. Hidden Stems

지장간은 각 지지별 고정 테이블을 사용한다.

Requirement

* 지장간 테이블은 코드 상수로 명시한다.
* 지장간은 오행 가중치와 십성 계산에 사용한다.
* 사용자가 보는 리포트에서는 필요한 경우에만 설명한다.

⸻

18. Major Relations

V1에서 합충형파해를 모두 깊게 해석하지 않는다.

V1 Required Relations

* 천간합
* 지지합
* 지지충

Optional Relations

* 형
* 파
* 해
* 원진
* 귀문

V1 Policy

V1에서는 관계 패턴의 핵심 신호로만 사용한다.

Allowed wording:

지지 충이 강하게 나타나면 내면의 방향 전환, 관계의 긴장, 환경 변화에 민감한 구조로 해석할 수 있습니다.

Forbidden:

충이 있으니 반드시 이별합니다.

⸻

19. Shinsal Policy

신살은 V1에서 핵심 판단축으로 사용하지 않는다.

Allowed

주요 신살은 보조 설명으로만 사용할 수 있다.

예:

* 현침살
* 도화
* 역마
* 화개
* 괴강
* 양인

Principle

신살은 재미와 서사성을 보강하는 보조 재료다.

핵심 판단축은 다음이다.

일간
월령
오행 분포
십성 구조
음양 균형
지장간
합충

Forbidden

* 신살 하나로 성격이나 운명을 단정하는 것
* 공포감을 주는 신살 해석
* 결혼/죽음/질병/사고를 신살로 예언하는 것

⸻

20. Yongshin / Useful Element Policy

V1에서는 용신/희신을 직접 단정하지 않는다.

Reason

용신 판단은 자동화 난이도가 높고, 학파별 해석 차이가 크며, 오류 발생 시 신뢰도 손상이 크다.

V1 Alternative

용신 대신 다음 표현을 사용한다.

보완하면 좋은 기운
균형을 잡아주는 방향
의식적으로 키우면 좋은 태도

Allowed:

수 기운이 약한 구조라면, 감정 회복·학습·유연한 사고를 의식적으로 보완하는 방향이 도움이 될 수 있습니다.

Forbidden:

당신의 용신은 수입니다.
당신은 수 기운만 따르면 성공합니다.

⸻

21. Daewoon / Sewoon Policy

V1에서는 대운과 세운을 계산하거나 리포트에 포함하지 않는다.

Excluded in V1

* 대운
* 세운
* 신년사주
* 월운
* 일진

Future

V1.3 이후 별도 상품으로 제공할 수 있다.

⸻

22. Output Schema

사주 계산 엔진은 최소 다음 구조를 반환해야 한다.

type SajuCalcResult = {
  input: {
    birthDate: string;
    birthTime?: string;
    birthTimeUnknown: boolean;
    calendarType: "SOLAR" | "LUNAR";
    isLeapMonth?: boolean;
    gender: "MALE" | "FEMALE" | "OTHER_OR_UNSPECIFIED";
    timezone: "Asia/Seoul";
  };
  converted?: {
    solarDate: string;
    lunarDate?: string;
    isLeapMonth?: boolean;
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour?: Pillar;
  };
  dayMaster: HeavenlyStem;
  tenGods: {
    stems: Record<string, TenGod>;
    hiddenStems: Array<{
      branch: EarthlyBranch;
      stem: HeavenlyStem;
      tenGod: TenGod;
      weight: number;
    }>;
    distribution: Record<TenGod, number>;
  };
  elements: {
    visible: Record<FiveElement, number>;
    weighted: Record<FiveElement, number>;
    labels: ElementLabel[];
  };
  yinYang: {
    yin: number;
    yang: number;
    label: "YIN_HEAVY" | "YANG_HEAVY" | "BALANCED";
  };
  relations: {
    stemCombinations: string[];
    branchCombinations: string[];
    branchClashes: string[];
  };
  notices: string[];
};
type Pillar = {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
};
type HeavenlyStem =
  | "甲" | "乙" | "丙" | "丁" | "戊"
  | "己" | "庚" | "辛" | "壬" | "癸";
type EarthlyBranch =
  | "子" | "丑" | "寅" | "卯" | "辰" | "巳"
  | "午" | "未" | "申" | "酉" | "戌" | "亥";
type FiveElement = "WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER";
type TenGod =
  | "比肩" | "劫財" | "食神" | "傷官" | "偏財"
  | "正財" | "偏官" | "正官" | "偏印" | "正印";
type ElementLabel =
  | "WOOD_STRONG" | "WOOD_WEAK" | "WOOD_MISSING"
  | "FIRE_STRONG" | "FIRE_WEAK" | "FIRE_MISSING"
  | "EARTH_STRONG" | "EARTH_WEAK" | "EARTH_MISSING"
  | "METAL_STRONG" | "METAL_WEAK" | "METAL_MISSING"
  | "WATER_STRONG" | "WATER_WEAK" | "WATER_MISSING";

⸻

23. Analysis Tags

사주 계산 결과는 리포트 생성을 위해 태그로 변환되어야 한다.

Example:

{
  "dayMaster": "GAP_WOOD",
  "monthSeason": "SPRING",
  "element": {
    "wood": "MEDIUM",
    "fire": "MISSING",
    "earth": "STRONG",
    "metal": "MEDIUM",
    "water": "MISSING"
  },
  "tenGods": {
    "wealth": "STRONG",
    "officer": "STRONG",
    "resource": "MISSING",
    "expression": "MISSING",
    "peer": "WEAK"
  },
  "structureTags": [
    "HIGH_PRESSURE",
    "HIGH_STANDARD",
    "LOW_EMOTIONAL_RECOVERY",
    "GOAL_ORIENTED",
    "EXPRESSION_CONSTRAINED"
  ]
}

⸻

24. Validation Requirements

만세력 계산 엔진은 최소 다음 테스트를 통과해야 한다.

Required Test Categories

1. 양력 생년월일시 → 사주팔자 계산
2. 음력 생년월일시 → 양력 변환 → 사주팔자 계산
3. 윤달 입력 처리
4. 절기 경계일 월주 계산
5. 입춘 전후 년주 계산
6. 23시대 출생자 안내 처리
7. 출생시간 모름 삼주 리포트 처리
8. 오행 분포 계산
9. 십성 분포 계산
10. 지장간 계산
11. 합충 계산

Minimum Sample Count

100 validated samples before public launch

Validation Sources

검증은 다음 중 2개 이상의 기준과 대조한다.

* 신뢰 가능한 만세력 앱/사이트
* 명리학 서적 기준 테이블
* 독립 라이브러리 계산 결과
* 수동 계산 샘플

한 소스만 믿지 않는다.

⸻

25. Error Handling

Invalid Date

입력한 날짜를 확인해 주세요.

Invalid Lunar Date

해당 음력 날짜를 변환할 수 없습니다. 윤달 여부와 날짜를 다시 확인해 주세요.

Birth Time Unknown

출생시간 모름으로 선택되어 시주 없이 년·월·일주 중심으로 분석합니다.

Unsupported Overseas Birth

현재 버전은 한국 표준시 기준으로 계산합니다. 해외 출생지 보정은 아직 지원하지 않습니다.

⸻

26. Data Storage

계산 결과는 report record에 저장한다.

Store

* original input
* converted solar/lunar date
* birth time unknown flag
* calculation policy version
* pillars
* day master
* ten gods
* elements
* yin/yang
* hidden stems
* relations
* notices

Required Field

calcSpecVersion: "SAJU_CALC_SPEC_v0.1"

계산 정책이 바뀔 경우 기존 리포트와 신규 리포트를 구분할 수 있어야 한다.

⸻

27. Versioning

사주 계산 정책은 버전 관리한다.

Initial version:

SAJU_CALC_SPEC_v0.1

Breaking change examples:

* 자시 처리 기준 변경
* 절기 계산 방식 변경
* 오행 가중치 변경
* 십성 계산 기준 변경
* 음력 변환 라이브러리 변경

Breaking change가 발생하면 새로운 calcSpecVersion을 부여한다.

⸻

28. Final V1 Decision Summary

V1 고정 기준:

기준 시간대: Asia/Seoul KST
양력 입력: 지원
음력 입력: 지원
윤달 입력: 지원
년주: 입춘 기준
월주: 절기 기준
일주: 00:00 기준 일자 변경
자시: 기본 조자시, 23시대 안내 제공
시주: 출생시간 있을 때만 확정 계산
출생시간 모름: 삼주 리포트 허용
시주 후보 시뮬레이션: V1 필수 아님, V1.1 후보
오행: visible + weighted 분리
십성: 일간 기준 계산
신살: 보조 설명만
용신/희신: V1 직접 단정 금지
대운/세운: V1 제외
계산 방식: 코드/룰 기반
LLM 계산 금지
검증 샘플: 출시 전 최소 100개
## 이 문서에서 제일 중요한 고정값
```txt
1. 년주 = 입춘 기준
2. 월주 = 절기 기준
3. 일주 = 00:00 기준
4. 자시 = 기본 조자시, 23시대 안내
5. 출생시간 모름 = 삼주 리포트 허용
6. 용신/희신 = V1 직접 단정 금지
7. 대운/세운 = V1 제외
8. LLM은 사주 계산 금지
