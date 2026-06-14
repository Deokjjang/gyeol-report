import type {
  MbtiBridgeNeed,
  SajuFeatureEntry,
  SajuFeaturePolarity,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";

export type SajuDayPillarEntry = {
  readonly id: string;
  readonly labelKo: string;
  readonly stem: string;
  readonly branch: string;
  readonly elementImage: string;
  readonly symbolicImage: string;
  readonly coreKeywords: readonly string[];
  readonly personality: string;
  readonly workMoney: string;
  readonly loveRelationship: string;
  readonly familyPeople: string;
  readonly growth: string;
  readonly positiveReading: string;
  readonly cautionReading: string;
  readonly practicalUse: string;
  readonly sceneSeeds: readonly string[];
  readonly phraseSeeds: readonly string[];
  readonly relatedTopics: readonly SajuFeatureTopic[];
  readonly polarity: SajuFeaturePolarity;
  readonly baseWeight: number;
  readonly vividness: number;
  readonly mbtiBridgeNeeds?: readonly MbtiBridgeNeed[];
  readonly avoidClaims: readonly string[];
};

type HeavenlyStemKo =
  | "갑"
  | "을"
  | "병"
  | "정"
  | "무"
  | "기"
  | "경"
  | "신"
  | "임"
  | "계";

type EarthlyBranchKo =
  | "자"
  | "축"
  | "인"
  | "묘"
  | "진"
  | "사"
  | "오"
  | "미"
  | "신"
  | "유"
  | "술"
  | "해";

type DayPillarProfile = {
  readonly personality: string;
  readonly workMoney: string;
  readonly loveRelationship: string;
  readonly familyPeople: string;
  readonly growth: string;
};

type DayPillarSeed = {
  readonly idSuffix: string;
  readonly ganji: string;
  readonly elementImage: string;
  readonly symbolicImage: string;
  readonly coreKeywords: readonly [string, string, string, ...string[]];
  readonly relatedTopics: readonly SajuFeatureTopic[];
  readonly polarity: SajuFeaturePolarity;
  readonly baseWeight: number;
  readonly vividness: number;
  readonly mbtiBridgeNeeds?: readonly MbtiBridgeNeed[];
  readonly focus?: Partial<{
    readonly personality: string;
    readonly workMoney: string;
    readonly loveRelationship: string;
    readonly familyPeople: string;
    readonly growth: string;
    readonly positiveReading: string;
    readonly cautionReading: string;
    readonly practicalUse: string;
  }>;
};

const DEFAULT_AVOID_CLAIMS = [
  "확정 예언",
  "관계 단정",
  "성과 단정",
  "사건 단정",
] as const;

const STEM_PROFILES: Record<HeavenlyStemKo, DayPillarProfile> = {
  갑: {
    personality:
      "갑목은 위로 뻗는 큰 나무처럼 방향을 먼저 세우고 스스로 길을 만들려는 성향이 강합니다.",
    workMoney:
      "일과 돈에서는 판을 키우고 책임 있는 역할을 맡을 때 힘이 살아납니다.",
    loveRelationship:
      "관계에서는 보호하려는 마음이 있지만 표현이 곧장 지시나 해결책처럼 보일 수 있습니다.",
    familyPeople:
      "가까운 사람 앞에서는 든든한 기둥이 되려는 태도가 강해질 수 있습니다.",
    growth:
      "오래 가려면 방향성만 밀지 말고 중간에 쉬는 장치와 주변 속도 조절이 필요합니다.",
  },
  을: {
    personality:
      "을목은 덩굴과 풀처럼 부드럽게 파고들며 상황에 맞춰 길을 찾는 성향이 있습니다.",
    workMoney:
      "일과 돈에서는 작은 연결을 이어 붙이고 섬세한 관계망을 키울 때 강점이 살아납니다.",
    loveRelationship:
      "관계에서는 직접 부딪히기보다 분위기를 읽고 조금씩 거리를 조정하려는 편입니다.",
    familyPeople:
      "가까운 사람에게는 세심하지만 마음이 꼬이면 표현이 돌아서 나올 수 있습니다.",
    growth:
      "성장은 유연함을 잃지 않되 스스로의 선을 더 분명히 세울 때 안정됩니다.",
  },
  병: {
    personality:
      "병화는 태양처럼 먼저 드러나는 에너지라 존재감과 표현 욕구가 자연스럽게 올라옵니다.",
    workMoney:
      "일과 돈에서는 사람 앞에 서거나 판을 밝히는 역할에서 추진력이 붙습니다.",
    loveRelationship:
      "관계에서는 따뜻하고 솔직하지만 감정의 온도가 빨리 올라갈 수 있습니다.",
    familyPeople:
      "가까운 사람에게 분위기를 살려 주는 힘이 있지만 본인의 속도를 기준으로 삼기 쉽습니다.",
    growth:
      "오래 가려면 빛을 줄이는 법, 상대의 온도를 기다리는 법이 함께 필요합니다.",
  },
  정: {
    personality:
      "정화는 촛불처럼 작지만 깊은 온기를 가진 성향이라 세밀한 감정과 집중력이 살아납니다.",
    workMoney:
      "일과 돈에서는 작은 불씨를 꾸준히 살려 전문성과 신뢰로 바꾸는 방식이 맞습니다.",
    loveRelationship:
      "관계에서는 깊이 챙기지만 서운함을 오래 담아두면 말의 결이 예민해질 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 세심한 배려를 보이지만 인정받지 못하면 마음이 식기 쉽습니다.",
    growth:
      "성장은 감정을 숨기기보다 적당한 온도로 꺼내는 연습에서 시작됩니다.",
  },
  무: {
    personality:
      "무토는 큰 산처럼 중심을 잡고 쉽게 흔들리지 않으려는 성향이 강합니다.",
    workMoney:
      "일과 돈에서는 기반, 자산, 조직, 책임을 쌓아 올리는 장기전에서 힘이 납니다.",
    loveRelationship:
      "관계에서는 묵직하게 지키려 하지만 말이 늦으면 상대가 답답함을 느낄 수 있습니다.",
    familyPeople:
      "가까운 사람 문제를 내 일처럼 떠안는 책임감이 강해질 수 있습니다.",
    growth:
      "오래 가려면 책임을 쌓는 만큼 내려놓을 일과 맡을 일을 구분해야 합니다.",
  },
  기: {
    personality:
      "기토는 밭흙처럼 사람과 상황을 받아들이며 현실적으로 다듬는 성향이 있습니다.",
    workMoney:
      "일과 돈에서는 관리, 조율, 생활 기반, 반복 루틴을 통해 안정감을 만듭니다.",
    loveRelationship:
      "관계에서는 실질적으로 챙기는 힘이 좋지만 걱정이 많아지면 간섭처럼 보일 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 돌봄과 관리가 강해지며 생활의 작은 문제를 많이 신경 씁니다.",
    growth:
      "성장은 걱정을 줄이고 기준을 간단히 만들어 실행으로 옮길 때 빨라집니다.",
  },
  경: {
    personality:
      "경금은 큰 쇠처럼 단단한 판단선과 결단력을 가진 성향입니다.",
    workMoney:
      "일과 돈에서는 기준, 품질, 경쟁, 책임이 분명한 환경에서 힘이 살아납니다.",
    loveRelationship:
      "관계에서는 솔직하고 분명하지만 부드러운 말보다 판단이 먼저 나갈 수 있습니다.",
    familyPeople:
      "가까운 사람 앞에서도 기준이 강해져 상대를 고치려는 태도로 보일 수 있습니다.",
    growth:
      "오래 가려면 날카로운 기준을 유지하되 말의 온도와 완충 질문을 함께 써야 합니다.",
  },
  신: {
    personality:
      "신금은 보석처럼 섬세하게 다듬어진 감각과 정확성을 중시하는 성향입니다.",
    workMoney:
      "일과 돈에서는 디테일, 브랜딩, 품질 관리, 정교한 결과물에서 강점이 납니다.",
    loveRelationship:
      "관계에서는 취향과 기준이 분명해 작은 차이도 민감하게 느낄 수 있습니다.",
    familyPeople:
      "가까운 사람에게도 말과 태도의 결을 많이 보며, 무례함에는 빠르게 식을 수 있습니다.",
    growth:
      "성장은 완벽하게 다듬는 힘과 적당히 내보내는 용기를 함께 가질 때 안정됩니다.",
  },
  임: {
    personality:
      "임수는 큰 물처럼 생각의 폭이 넓고 흐름을 멀리 보는 성향이 있습니다.",
    workMoney:
      "일과 돈에서는 정보, 이동, 기획, 큰 판의 흐름을 읽을 때 감각이 살아납니다.",
    loveRelationship:
      "관계에서는 깊이 이해하려 하지만 마음의 물길이 넓어 거리감이 생길 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 포용력이 있지만 속마음을 다 보여주지 않아 알기 어렵게 보일 수 있습니다.",
    growth:
      "오래 가려면 생각의 물길을 기록과 실행 순서로 좁혀 주는 장치가 필요합니다.",
  },
  계: {
    personality:
      "계수는 비와 안개처럼 섬세하고 깊게 스며드는 감각을 가진 성향입니다.",
    workMoney:
      "일과 돈에서는 자료, 연구, 감각적 판단, 조용한 준비가 쌓일 때 힘이 납니다.",
    loveRelationship:
      "관계에서는 감정의 결을 잘 느끼지만 혼자 해석하다가 거리를 둘 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 조용히 챙기는 방식이 많아 표현이 늦게 보일 수 있습니다.",
    growth:
      "성장은 감정을 기록하고 말로 꺼내며 고립되지 않는 루틴을 만들 때 안정됩니다.",
  },
};

const BRANCH_PROFILES: Record<EarthlyBranchKo, DayPillarProfile> = {
  자: {
    personality:
      "자수의 깊은 밤 기운이 더해져 머릿속 계산과 감정의 물결이 오래 이어질 수 있습니다.",
    workMoney:
      "정보를 모으고 흐름을 읽는 힘이 있어 공부, 기획, 데이터, 이동성 있는 일과 잘 맞습니다.",
    loveRelationship:
      "관계에서는 속마음을 바로 드러내기보다 상대의 반응을 충분히 보고 움직이는 편입니다.",
    familyPeople:
      "가족과 가까운 사람에게는 말보다 분위기와 흐름으로 마음을 전하는 경우가 많습니다.",
    growth:
      "생각이 길어질 때는 기록, 수면, 산책처럼 머리를 식히는 루틴이 중요합니다.",
  },
  축: {
    personality:
      "축토의 차가운 창고 기운이 더해져 참고 쌓고 버티는 힘이 강해집니다.",
    workMoney:
      "성과를 바로 드러내기보다 자료, 자산, 실력, 경험을 조용히 축적하는 방식이 맞습니다.",
    loveRelationship:
      "관계에서는 속도가 느려도 한 번 신뢰하면 쉽게 흔들리지 않는 편입니다.",
    familyPeople:
      "가까운 사람에게는 현실적 도움을 주지만 마음 표현은 늦어질 수 있습니다.",
    growth:
      "쌓아 두는 힘을 살리되 감정과 피로까지 창고에 넣어 두지 않는 것이 필요합니다.",
  },
  인: {
    personality:
      "인목의 새벽 숲 기운이 더해져 시작, 확장, 도전 감각이 강해집니다.",
    workMoney:
      "새 프로젝트, 기획, 성장 산업, 배움이 필요한 일에서 추진력이 잘 살아납니다.",
    loveRelationship:
      "관계에서는 솔직하고 빠르게 다가가지만 상대의 속도와 리듬을 놓치기 쉽습니다.",
    familyPeople:
      "가까운 사람에게는 방향을 제시하려는 마음이 강해 조언이 많아질 수 있습니다.",
    growth:
      "성장은 시작의 힘을 마무리 습관과 연결할 때 안정됩니다.",
  },
  묘: {
    personality:
      "묘목의 부드러운 봄기운이 더해져 섬세한 감각과 관계 조율이 살아납니다.",
    workMoney:
      "기획, 디자인, 관계형 업무, 세밀한 조정이 필요한 일에서 장점이 드러납니다.",
    loveRelationship:
      "관계에서는 분위기와 말투를 민감하게 느끼며, 부드러운 교감이 중요합니다.",
    familyPeople:
      "가까운 사람에게는 맞춰 주는 힘이 있지만 속으로 쌓이면 갑자기 거리를 둘 수 있습니다.",
    growth:
      "성장은 맞춰 주는 습관과 자기 기준을 함께 세울 때 안정됩니다.",
  },
  진: {
    personality:
      "진토의 습한 큰 땅 기운이 더해져 여러 가능성을 품고 현실화하려는 힘이 생깁니다.",
    workMoney:
      "돈, 자산, 기획, 책임을 한곳에 모아 구조로 만드는 일과 잘 맞습니다.",
    loveRelationship:
      "관계에서는 안정감을 주지만 속마음이 복잡해 표현이 늦어질 수 있습니다.",
    familyPeople:
      "가까운 사람 문제를 넓게 받아들이며 책임 범위를 크게 잡는 편입니다.",
    growth:
      "성장은 품고 있는 것을 너무 오래 묵히지 말고 실행 단위로 꺼낼 때 빨라집니다.",
  },
  사: {
    personality:
      "사화의 빠르고 날카로운 불기운이 더해져 판단과 표현의 속도가 올라갑니다.",
    workMoney:
      "분석, 기술, 발표, 실행 전환이 필요한 일에서 속도감이 살아납니다.",
    loveRelationship:
      "관계에서는 열이 빨리 오르고 식는 지점도 분명해 상대가 속도를 체감하기 쉽습니다.",
    familyPeople:
      "가까운 사람에게는 말이 빠르고 정확해지며, 때로는 날카롭게 들릴 수 있습니다.",
    growth:
      "성장은 빠른 판단 뒤에 숨 돌리는 시간을 넣을 때 안정됩니다.",
  },
  오: {
    personality:
      "오화의 한낮 기운이 더해져 존재감, 표현력, 자신감이 강하게 드러납니다.",
    workMoney:
      "사람 앞에 서는 일, 리더십, 영업, 콘텐츠, 공개 성과에서 힘이 살아납니다.",
    loveRelationship:
      "관계에서는 뜨겁고 분명하지만 상대의 감정 온도보다 앞서갈 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 분위기를 끌어올리지만 본인의 기준으로 밀어붙일 수 있습니다.",
    growth:
      "성장은 과열을 식히고 주변의 속도를 확인하는 습관에서 시작됩니다.",
  },
  미: {
    personality:
      "미토의 따뜻한 흙기운이 더해져 돌봄, 미감, 현실 감각이 함께 살아납니다.",
    workMoney:
      "생활 기반, 교육, 관리, 콘텐츠, 실용적 창작처럼 따뜻한 구조를 만드는 일과 맞습니다.",
    loveRelationship:
      "관계에서는 챙기고 맞추는 힘이 좋지만 혼자 부담을 떠안기 쉽습니다.",
    familyPeople:
      "가까운 사람에게는 생활의 작은 부분까지 신경 쓰며 책임을 느끼는 편입니다.",
    growth:
      "성장은 돌봄과 자기 경계를 같이 세울 때 안정됩니다.",
  },
  신: {
    personality:
      "신금의 날카로운 금기운이 더해져 분석, 생존 감각, 빠른 판단이 강해집니다.",
    workMoney:
      "위기 대응, 전략, 구조화, 기술, 경쟁이 있는 일에서 실력이 드러납니다.",
    loveRelationship:
      "관계에서는 기준과 거리감이 분명해 좋아해도 말이 건조하게 나갈 수 있습니다.",
    familyPeople:
      "가까운 사람에게도 문제 해결 모드가 먼저 켜져 따뜻한 표현이 늦을 수 있습니다.",
    growth:
      "성장은 날카로운 판단을 완충과 회복 루틴으로 조절할 때 오래 갑니다.",
  },
  유: {
    personality:
      "유금의 정제된 금기운이 더해져 취향, 기준, 정밀함이 선명해집니다.",
    workMoney:
      "브랜딩, 품질 관리, 금융 감각, 디테일한 결과물에서 장점이 살아납니다.",
    loveRelationship:
      "관계에서는 세련된 감각과 기준이 강해 작은 무례함도 크게 느낄 수 있습니다.",
    familyPeople:
      "가까운 사람에게도 말투와 태도의 결을 중요하게 봅니다.",
    growth:
      "성장은 완성도를 추구하되 지나친 검열을 줄이는 데서 안정됩니다.",
  },
  술: {
    personality:
      "술토의 마른 땅 기운이 더해져 원칙, 책임, 오래 버티는 힘이 강해집니다.",
    workMoney:
      "조직, 제도, 자산, 책임 관리처럼 단단한 틀을 세우는 일과 맞습니다.",
    loveRelationship:
      "관계에서는 충성심이 있지만 마음을 쉽게 열지 않아 거리감이 생길 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 책임을 크게 느끼지만 감정을 말로 푸는 데 시간이 걸립니다.",
    growth:
      "성장은 오래 버티는 힘에 유연한 표현을 더할 때 안정됩니다.",
  },
  해: {
    personality:
      "해수의 깊은 물기운이 더해져 직관, 사색, 감정의 깊이가 살아납니다.",
    workMoney:
      "연구, 기획, 상담이 아닌 경청형 업무, 자료 분석, 깊은 탐구에서 힘이 납니다.",
    loveRelationship:
      "관계에서는 깊이 이해하려 하지만 과몰입하거나 혼자 물러날 수 있습니다.",
    familyPeople:
      "가까운 사람에게는 조용히 마음을 쓰지만 말하지 않으면 상대가 알아차리기 어렵습니다.",
    growth:
      "성장은 깊은 물에 오래 잠기지 않도록 기록, 대화, 몸 움직임을 함께 둘 때 안정됩니다.",
  },
};

const DAY_PILLAR_SEEDS = [
  {
    idSuffix: "gapja",
    ganji: "갑자",
    elementImage: "갑목이 자수 위에 뿌리를 내린 구조",
    symbolicImage: "큰 나무가 깊은 밤의 물가에서 뿌리를 내리는 형상입니다.",
    coreKeywords: ["방향성", "사색", "시작의 힘"],
    relatedTopics: ["identity", "personality", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.3,
    mbtiBridgeNeeds: ["stability", "intellectual_match"],
  },
  {
    idSuffix: "eulchuk",
    ganji: "을축",
    elementImage: "을목이 축토의 차가운 흙 속에서 자라는 구조",
    symbolicImage: "작은 풀뿌리가 얼어붙은 흙을 천천히 뚫고 올라오는 형상입니다.",
    coreKeywords: ["인내", "섬세함", "축적"],
    relatedTopics: ["identity", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  },
  {
    idSuffix: "byeongin",
    ganji: "병인",
    elementImage: "병화가 인목의 숲에서 힘을 얻는 구조",
    symbolicImage: "새벽 숲 위로 태양이 떠오르며 길을 밝히는 형상입니다.",
    coreKeywords: ["확장", "표현력", "추진"],
    relatedTopics: ["identity", "personality", "work", "environment"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["responsibility_clarity", "pace_flexibility"],
  },
  {
    idSuffix: "jeongmyo",
    ganji: "정묘",
    elementImage: "정화가 묘목의 봄기운을 받아 타오르는 구조",
    symbolicImage: "봄 가지 사이에 켜진 작은 등불처럼 은근한 온기가 퍼지는 형상입니다.",
    coreKeywords: ["섬세한 표현", "감성", "관계 조율"],
    relatedTopics: ["identity", "love", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    idSuffix: "mujin",
    ganji: "무진",
    elementImage: "무토가 진토의 큰 땅 위에 겹쳐진 구조",
    symbolicImage: "큰 산 아래 넓은 저수지가 숨어 있는 형상입니다.",
    coreKeywords: ["기반", "책임", "자산화"],
    relatedTopics: ["identity", "money", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.2,
    mbtiBridgeNeeds: ["responsibility_clarity", "stability"],
  },
  {
    idSuffix: "gisa",
    ganji: "기사",
    elementImage: "기토가 사화의 열기를 받아 마르는 구조",
    symbolicImage: "따뜻한 밭흙 아래 빠른 불씨가 도는 형상입니다.",
    coreKeywords: ["실무 감각", "걱정", "빠른 정리"],
    relatedTopics: ["personality", "work", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["emotional_buffer", "pace_flexibility"],
  },
  {
    idSuffix: "gyeongo",
    ganji: "경오",
    elementImage: "경금이 오화의 뜨거운 불 위에 놓인 구조",
    symbolicImage: "뜨거운 불 속에서 달궈진 큰 쇠가 형태를 잡는 형상입니다.",
    coreKeywords: ["결단력", "존재감", "경쟁"],
    relatedTopics: ["identity", "personality", "work", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["emotional_buffer", "responsibility_clarity"],
  },
  {
    idSuffix: "sinmi",
    ganji: "신미",
    elementImage: "신금이 미토의 따뜻한 흙 속에서 다듬어지는 구조",
    symbolicImage: "흙 속의 보석이 천천히 빛을 얻는 형상입니다.",
    coreKeywords: ["정교함", "미감", "생활 감각"],
    relatedTopics: ["identity", "love", "work", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    idSuffix: "imsin",
    ganji: "임신",
    elementImage: "임수가 신금의 날카로운 금에서 흘러나오는 구조",
    symbolicImage: "차가운 바위틈에서 큰 물길이 시작되는 형상입니다.",
    coreKeywords: ["전략", "기동성", "분석"],
    relatedTopics: ["identity", "work", "study", "environment", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.3,
    mbtiBridgeNeeds: ["intellectual_match", "stability"],
  },
  {
    idSuffix: "gyeyu",
    ganji: "계유",
    elementImage: "계수가 유금의 정제된 금 위에 맺힌 구조",
    symbolicImage: "가을 금속 위에 맺힌 맑은 이슬 같은 형상입니다.",
    coreKeywords: ["정밀함", "감수성", "취향"],
    relatedTopics: ["identity", "personality", "study", "love"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "intellectual_match"],
  },
  {
    idSuffix: "gapsul",
    ganji: "갑술",
    elementImage: "갑목이 술토의 마른 땅 위에 선 구조",
    symbolicImage: "마른 언덕 위에 홀로 선 큰 나무 같은 형상입니다.",
    coreKeywords: ["원칙", "책임", "고독한 방향성"],
    relatedTopics: ["identity", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["autonomy_respect", "emotional_buffer"],
  },
  {
    idSuffix: "eulhae",
    ganji: "을해",
    elementImage: "을목이 해수의 깊은 물에서 자라는 구조",
    symbolicImage: "깊은 물가에서 부드러운 덩굴이 길을 찾는 형상입니다.",
    coreKeywords: ["직관", "유연함", "감정 깊이"],
    relatedTopics: ["identity", "relationship", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  },
  {
    idSuffix: "byeongja",
    ganji: "병자",
    elementImage: "병화가 자수의 깊은 물 위에 비치는 구조",
    symbolicImage: "한밤의 물 위에 태양빛이 반사되는 형상입니다.",
    coreKeywords: ["밝음과 깊이", "표현", "내면 긴장"],
    relatedTopics: ["identity", "personality", "love", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["emotional_buffer", "expression_support"],
  },
  {
    idSuffix: "jeongchuk",
    ganji: "정축",
    elementImage: "정화가 축토의 차가운 창고 안에서 타는 구조",
    symbolicImage: "차가운 방 안에서 꺼지지 않게 지키는 작은 불씨 같은 형상입니다.",
    coreKeywords: ["은근한 집념", "축적", "감정 절제"],
    relatedTopics: ["personality", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["warmth", "stability"],
  },
  {
    idSuffix: "muin",
    ganji: "무인",
    elementImage: "무토가 인목의 새벽 숲을 품는 구조",
    symbolicImage: "큰 산에 새 숲길이 열리는 형상입니다.",
    coreKeywords: ["확장 기반", "리더십", "개척"],
    relatedTopics: ["identity", "work", "environment", "growth"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.3,
    mbtiBridgeNeeds: ["responsibility_clarity", "autonomy_respect"],
  },
  {
    idSuffix: "gimyo",
    ganji: "기묘",
    elementImage: "기토가 묘목의 부드러운 봄기운을 받는 구조",
    symbolicImage: "밭흙 위로 여린 봄풀이 촘촘히 올라오는 형상입니다.",
    coreKeywords: ["조율", "세심함", "생활 감각"],
    relatedTopics: ["personality", "relationship", "family", "growth"],
    polarity: "positive",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  },
  {
    idSuffix: "gyeongjin",
    ganji: "경진",
    elementImage: "경금이 진토의 큰 땅 속에 묻힌 구조",
    symbolicImage: "큰 땅속에 묻힌 쇳덩이가 때를 기다리는 형상입니다.",
    coreKeywords: ["잠재력", "결단", "자산 기반"],
    relatedTopics: ["identity", "money", "work", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.2,
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    idSuffix: "sinsa",
    ganji: "신사",
    elementImage: "신금이 사화의 열기 속에서 다듬어지는 구조",
    symbolicImage: "불빛 아래에서 보석의 결이 더 선명해지는 형상입니다.",
    coreKeywords: ["정교함", "예민한 판단", "표현 긴장"],
    relatedTopics: ["personality", "work", "love", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "pace_flexibility"],
  },
  {
    idSuffix: "imo",
    ganji: "임오",
    elementImage: "임수가 오화의 한낮 불기운과 만나는 구조",
    symbolicImage: "넓은 바다 위에 한낮의 햇빛이 강하게 쏟아지는 형상입니다.",
    coreKeywords: ["큰 흐름", "표현", "온도 차"],
    relatedTopics: ["identity", "love", "environment", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.4,
    mbtiBridgeNeeds: ["emotional_buffer", "expression_support"],
  },
  {
    idSuffix: "gyemi",
    ganji: "계미",
    elementImage: "계수가 미토의 따뜻한 흙에 스며드는 구조",
    symbolicImage: "따뜻한 흙 속으로 조용한 비가 스며드는 형상입니다.",
    coreKeywords: ["섬세한 돌봄", "감정 깊이", "생활 안정"],
    relatedTopics: ["relationship", "family", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  },
  {
    idSuffix: "gapsin",
    ganji: "갑신",
    elementImage: "갑목이 신금의 날카로운 금 위에 선 구조",
    symbolicImage: "큰 나무가 날카로운 금 위에 서서 압박 속에서도 방향을 잡는 형상입니다.",
    coreKeywords: ["빠른 판단", "자기관리", "책임 있는 자리", "말의 날카로움"],
    relatedTopics: ["identity", "personality", "work", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.7,
    vividness: 5,
    mbtiBridgeNeeds: ["responsibility_clarity", "emotional_buffer"],
    focus: {
      personality:
        "갑신일주는 큰 나무가 날카로운 금 위에 선 형상이라 압박이 걸릴수록 기준을 빠르게 세우는 쪽으로 드러납니다. 방향성과 절단력이 함께 있어 판단이 빠르고 자기관리 감각도 강해지기 쉽습니다. 다만 말의 날카로움이 먼저 나가면 주변이 숨 쉴 틈을 잃을 수 있습니다.",
      workMoney:
        "일과 돈에서는 책임 있는 자리, 위기 대응, 기준을 세우는 역할에서 힘이 살아납니다. 문제를 보면 흐름을 정리하고 담당 범위를 나누려는 감각이 강합니다. 성과를 오래 가져가려면 속도와 함께 완충 장치를 설계해야 합니다.",
      loveRelationship:
        "관계에서는 마음이 있어도 따뜻한 말보다 해결책과 기준이 먼저 나갈 수 있습니다. 좋아하는 사람에게도 말이 짧거나 업무처럼 보이면 오해가 생길 수 있습니다. 중요한 대화에서는 결론 전에 상대의 감정을 한 번 되받아주는 방식이 필요합니다.",
      growth:
        "성장은 더 세게 밀어붙이는 쪽보다 오래 버틸 수 있는 회복 구조를 만드는 데 있습니다. 갑신일주의 날카로운 판단은 강점이지만, 쉬는 시간과 감정 완충이 빠지면 자신과 주변을 동시에 몰아붙일 수 있습니다. 방향을 잡는 힘에 숨 돌리는 리듬을 붙여야 합니다.",
      positiveReading:
        "잘 쓰면 위기에서 방향을 잡는 리더십, 빠른 판단, 책임 있는 자리에서의 존재감으로 드러납니다.",
      cautionReading:
        "거칠게 쓰면 자기 자신과 주변을 동시에 압박하며 말의 온도가 차갑게 보일 수 있습니다.",
      practicalUse:
        "결론을 내리기 전 질문 하나, 회복 시간 하나, 책임 범위 한 줄을 먼저 정하면 갑신일주의 힘이 오래 갑니다.",
    },
  },
  {
    idSuffix: "eulyu",
    ganji: "을유",
    elementImage: "을목이 유금의 정제된 금 위에 놓인 구조",
    symbolicImage: "가느다란 덩굴이 날카롭게 다듬어진 울타리를 타고 오르는 형상입니다.",
    coreKeywords: ["섬세함", "기준", "관계 긴장"],
    relatedTopics: ["personality", "love", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  },
  {
    idSuffix: "byeongsul",
    ganji: "병술",
    elementImage: "병화가 술토의 마른 땅 위에 비치는 구조",
    symbolicImage: "마른 언덕 위로 강한 햇빛이 내려앉는 형상입니다.",
    coreKeywords: ["원칙 있는 표현", "존재감", "책임"],
    relatedTopics: ["identity", "work", "environment", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.4,
    mbtiBridgeNeeds: ["responsibility_clarity", "warmth"],
  },
  {
    idSuffix: "jeonghae",
    ganji: "정해",
    elementImage: "정화가 해수의 깊은 물 위에 놓인 구조",
    symbolicImage: "깊은 밤바다 위에 작은 등불이 흔들리지 않게 켜진 형상입니다.",
    coreKeywords: ["깊은 감정", "섬세한 온기", "내면 집중"],
    relatedTopics: ["identity", "love", "relationship", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.4,
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  },
  {
    idSuffix: "muja",
    ganji: "무자",
    elementImage: "무토가 자수의 깊은 물을 막고 품는 구조",
    symbolicImage: "큰 둑이 깊은 물길을 붙잡고 있는 형상입니다.",
    coreKeywords: ["통제", "책임", "깊은 생각"],
    relatedTopics: ["money", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  },
  {
    idSuffix: "gichuk",
    ganji: "기축",
    elementImage: "기토가 축토의 차가운 흙과 겹쳐진 구조",
    symbolicImage: "차가운 밭흙이 오래 저장한 씨앗을 품고 있는 형상입니다.",
    coreKeywords: ["축적", "실무", "인내"],
    relatedTopics: ["work", "money", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 3.9,
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    idSuffix: "gyeongin",
    ganji: "경인",
    elementImage: "경금이 인목의 숲을 다듬는 구조",
    symbolicImage: "새 숲길을 큰 도끼로 열어 가는 형상입니다.",
    coreKeywords: ["개척", "결단", "기준 설정"],
    relatedTopics: ["identity", "work", "environment", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["responsibility_clarity", "pace_flexibility"],
  },
  {
    idSuffix: "sinmyo",
    ganji: "신묘",
    elementImage: "신금이 묘목의 부드러운 봄기운과 만나는 구조",
    symbolicImage: "부드러운 가지 사이에서 작은 보석이 빛나는 형상입니다.",
    coreKeywords: ["취향", "섬세함", "관계 감각"],
    relatedTopics: ["personality", "love", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    idSuffix: "imjin",
    ganji: "임진",
    elementImage: "임수가 진토의 큰 땅과 만나는 구조",
    symbolicImage: "큰 강이 넓은 습지를 품고 흐르는 형상입니다.",
    coreKeywords: ["큰 판", "자산 감각", "깊은 계획"],
    relatedTopics: ["identity", "money", "work", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.3,
    mbtiBridgeNeeds: ["stability", "intellectual_match"],
  },
  {
    idSuffix: "gyesa",
    ganji: "계사",
    elementImage: "계수가 사화의 빠른 불기운과 만나는 구조",
    symbolicImage: "작은 물방울이 뜨거운 돌 위에서 수증기로 올라가는 형상입니다.",
    coreKeywords: ["민감한 판단", "직관", "속도 긴장"],
    relatedTopics: ["personality", "study", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.4,
    mbtiBridgeNeeds: ["emotional_buffer", "pace_flexibility"],
  },
  {
    idSuffix: "gabo",
    ganji: "갑오",
    elementImage: "갑목이 오화의 한낮 불을 만난 구조",
    symbolicImage: "큰 나무 위로 한낮의 빛이 강하게 쏟아지는 형상입니다.",
    coreKeywords: ["표현력", "방향성", "주목성"],
    relatedTopics: ["identity", "personality", "work", "love"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.6,
    mbtiBridgeNeeds: ["expression_support", "pace_flexibility"],
  },
  {
    idSuffix: "eulmi",
    ganji: "을미",
    elementImage: "을목이 미토의 따뜻한 흙에서 자라는 구조",
    symbolicImage: "따뜻한 밭에서 부드러운 풀과 꽃이 자라는 형상입니다.",
    coreKeywords: ["돌봄", "미감", "유연한 현실감"],
    relatedTopics: ["love", "family", "work", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "stability"],
  },
  {
    idSuffix: "byeongsin",
    ganji: "병신",
    elementImage: "병화가 신금의 날카로운 금과 만나는 구조",
    symbolicImage: "강한 햇빛이 차가운 금속 위에서 번쩍이는 형상입니다.",
    coreKeywords: ["빠른 판단", "존재감", "전략"],
    relatedTopics: ["identity", "personality", "work", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.6,
    mbtiBridgeNeeds: ["emotional_buffer", "responsibility_clarity"],
  },
  {
    idSuffix: "jeongyu",
    ganji: "정유",
    elementImage: "정화가 유금의 정제된 금을 비추는 구조",
    symbolicImage: "작은 불빛이 보석의 표면을 섬세하게 비추는 형상입니다.",
    coreKeywords: ["섬세한 표현", "취향", "정밀함"],
    relatedTopics: ["personality", "love", "study", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "intellectual_match"],
  },
  {
    idSuffix: "musul",
    ganji: "무술",
    elementImage: "무토가 술토의 마른 땅과 겹쳐진 구조",
    symbolicImage: "큰 산맥이 마른 성벽처럼 이어진 형상입니다.",
    coreKeywords: ["원칙", "버팀", "책임"],
    relatedTopics: ["identity", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.1,
    mbtiBridgeNeeds: ["pace_flexibility", "emotional_buffer"],
  },
  {
    idSuffix: "gihae",
    ganji: "기해",
    elementImage: "기토가 해수의 깊은 물을 품는 구조",
    symbolicImage: "부드러운 흙 아래 깊은 물길이 흐르는 형상입니다.",
    coreKeywords: ["돌봄", "직관", "내면 깊이"],
    relatedTopics: ["family", "relationship", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4.2,
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  },
  {
    idSuffix: "gyeongja",
    ganji: "경자",
    elementImage: "경금이 자수의 깊은 물과 만나는 구조",
    symbolicImage: "차가운 쇠가 깊은 물가에서 더욱 날카롭게 식는 형상입니다.",
    coreKeywords: ["분석", "절제", "전략"],
    relatedTopics: ["personality", "work", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "stability"],
  },
  {
    idSuffix: "sinchuk",
    ganji: "신축",
    elementImage: "신금이 축토의 차가운 창고 속에 있는 구조",
    symbolicImage: "차가운 창고 안에 보석이 조용히 보관된 형상입니다.",
    coreKeywords: ["축적", "정밀함", "인내"],
    relatedTopics: ["work", "money", "study", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.1,
    mbtiBridgeNeeds: ["stability", "intellectual_match"],
  },
  {
    idSuffix: "imin",
    ganji: "임인",
    elementImage: "임수가 인목의 새벽 숲을 키우는 구조",
    symbolicImage: "큰 물길이 새 숲을 깨우며 흐르는 형상입니다.",
    coreKeywords: ["확장", "기획", "이동성"],
    relatedTopics: ["identity", "work", "environment", "growth"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["intellectual_match", "pace_flexibility"],
  },
  {
    idSuffix: "gyemyo",
    ganji: "계묘",
    elementImage: "계수가 묘목의 봄기운을 적시는 구조",
    symbolicImage: "봄풀 위에 조용한 비가 내려 생기를 주는 형상입니다.",
    coreKeywords: ["섬세함", "감정 결", "관계 조율"],
    relatedTopics: ["personality", "love", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  },
  {
    idSuffix: "gapjin",
    ganji: "갑진",
    elementImage: "갑목이 진토의 큰 땅에 뿌리내린 구조",
    symbolicImage: "큰 나무가 넓은 습한 땅에 뿌리를 깊게 내리는 형상입니다.",
    coreKeywords: ["기반", "확장", "잠재력"],
    relatedTopics: ["identity", "work", "money", "growth"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.4,
    mbtiBridgeNeeds: ["responsibility_clarity", "stability"],
  },
  {
    idSuffix: "eulsa",
    ganji: "을사",
    elementImage: "을목이 사화의 빠른 열기를 타고 오르는 구조",
    symbolicImage: "덩굴이 따뜻한 벽을 타고 빠르게 올라가는 형상입니다.",
    coreKeywords: ["유연한 속도", "표현", "관계 감각"],
    relatedTopics: ["personality", "work", "love", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["warmth", "pace_flexibility"],
  },
  {
    idSuffix: "byeongo",
    ganji: "병오",
    elementImage: "병화가 오화의 한낮 불기운과 겹쳐진 구조",
    symbolicImage: "한낮의 태양이 하늘 한가운데 떠 있는 형상입니다.",
    coreKeywords: ["강한 존재감", "표현력", "주목성", "과열 주의"],
    relatedTopics: ["identity", "personality", "love", "environment", "work"],
    polarity: "mixed",
    baseWeight: 4.7,
    vividness: 5,
    mbtiBridgeNeeds: ["emotional_buffer", "expression_support"],
    focus: {
      personality:
        "병오일주는 한낮의 태양처럼 존재감이 강한 일주입니다. 가만히 있어도 에너지가 먼저 드러나고, 사람들 앞에서 자기 색을 숨기기 어렵습니다. 잘 쓰면 분위기를 밝히고 판을 여는 힘이 됩니다.",
      cautionReading:
        "에너지가 과하면 주변의 속도와 온도를 놓치기 쉬워 말과 행동이 앞서갈 수 있습니다.",
      practicalUse:
        "주목성과 표현력은 살리되 중요한 자리에서는 상대 반응을 확인하는 한 박자를 넣는 것이 좋습니다.",
    },
  },
  {
    idSuffix: "jeongmi",
    ganji: "정미",
    elementImage: "정화가 미토의 따뜻한 흙을 비추는 구조",
    symbolicImage: "따뜻한 방 안에서 작은 등불이 오래 켜진 형상입니다.",
    coreKeywords: ["온기", "돌봄", "감정 지속성"],
    relatedTopics: ["love", "family", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  },
  {
    idSuffix: "musin",
    ganji: "무신",
    elementImage: "무토가 신금의 날카로운 금을 품는 구조",
    symbolicImage: "큰 산속에 차가운 금맥이 박혀 있는 형상입니다.",
    coreKeywords: ["전략", "책임", "위기 대응"],
    relatedTopics: ["identity", "work", "money", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.4,
    mbtiBridgeNeeds: ["responsibility_clarity", "emotional_buffer"],
  },
  {
    idSuffix: "giyu",
    ganji: "기유",
    elementImage: "기토가 유금의 정제된 금을 품는 구조",
    symbolicImage: "정돈된 흙 위에 작은 보석이 놓인 형상입니다.",
    coreKeywords: ["관리", "취향", "정교함"],
    relatedTopics: ["work", "money", "love", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["stability", "warmth"],
  },
  {
    idSuffix: "gyeongsul",
    ganji: "경술",
    elementImage: "경금이 술토의 마른 땅 속에 있는 구조",
    symbolicImage: "마른 성벽 안에 큰 쇠문이 세워진 형상입니다.",
    coreKeywords: ["원칙", "방어력", "책임"],
    relatedTopics: ["identity", "work", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.2,
    mbtiBridgeNeeds: ["warmth", "pace_flexibility"],
  },
  {
    idSuffix: "sinhae",
    ganji: "신해",
    elementImage: "신금이 해수의 깊은 물과 만나는 구조",
    symbolicImage: "깊은 물속에서 보석이 조용히 빛나는 형상입니다.",
    coreKeywords: ["직관", "정밀함", "내면 깊이"],
    relatedTopics: ["personality", "study", "love", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.3,
    mbtiBridgeNeeds: ["emotional_buffer", "intellectual_match"],
  },
  {
    idSuffix: "imja",
    ganji: "임자",
    elementImage: "임수가 자수의 깊은 물과 겹쳐진 구조",
    symbolicImage: "큰 강이 밤의 바다로 이어지는 형상입니다.",
    coreKeywords: ["큰 사고", "깊은 감정", "흐름 읽기"],
    relatedTopics: ["identity", "study", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.4,
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  },
  {
    idSuffix: "gyechuk",
    ganji: "계축",
    elementImage: "계수가 축토의 차가운 창고에 스며드는 구조",
    symbolicImage: "얼어붙은 흙 속으로 맑은 물이 천천히 스며드는 형상입니다.",
    coreKeywords: ["인내", "섬세한 준비", "감정 절제"],
    relatedTopics: ["study", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.1,
    vividness: 4,
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  },
  {
    idSuffix: "gabin",
    ganji: "갑인",
    elementImage: "갑목이 인목의 큰 숲과 겹쳐진 구조",
    symbolicImage: "큰 나무가 숲 한가운데서 곧게 치솟는 형상입니다.",
    coreKeywords: ["개척", "리더십", "성장 욕구"],
    relatedTopics: ["identity", "work", "environment", "growth"],
    polarity: "positive",
    baseWeight: 4.6,
    vividness: 4.6,
    mbtiBridgeNeeds: ["autonomy_respect", "responsibility_clarity"],
  },
  {
    idSuffix: "eulmyo",
    ganji: "을묘",
    elementImage: "을목이 묘목의 봄기운과 겹쳐진 구조",
    symbolicImage: "봄 들판의 풀과 꽃이 촘촘하게 번지는 형상입니다.",
    coreKeywords: ["유연함", "관계 감각", "미감"],
    relatedTopics: ["identity", "love", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.3,
    vividness: 4.4,
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    idSuffix: "byeongjin",
    ganji: "병진",
    elementImage: "병화가 진토의 큰 땅 위에 비치는 구조",
    symbolicImage: "넓은 대지 위로 태양이 떠올라 잠재력을 깨우는 형상입니다.",
    coreKeywords: ["큰 판", "표현", "현실화"],
    relatedTopics: ["identity", "work", "money", "environment"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.4,
    mbtiBridgeNeeds: ["responsibility_clarity", "expression_support"],
  },
  {
    idSuffix: "jeongsa",
    ganji: "정사",
    elementImage: "정화가 사화의 빠른 불길과 겹쳐진 구조",
    symbolicImage: "작은 불씨가 빠른 불길 속에서 선명하게 살아나는 형상입니다.",
    coreKeywords: ["집중", "감정 온도", "표현 속도"],
    relatedTopics: ["personality", "work", "love", "growth"],
    polarity: "mixed",
    baseWeight: 4.3,
    vividness: 4.4,
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  },
  {
    idSuffix: "muo",
    ganji: "무오",
    elementImage: "무토가 오화의 한낮 불기운을 받는 구조",
    symbolicImage: "뜨거운 태양 아래 큰 산이 선명하게 드러나는 형상입니다.",
    coreKeywords: ["존재감", "책임", "과열 관리"],
    relatedTopics: ["identity", "work", "family", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["pace_flexibility", "emotional_buffer"],
  },
  {
    idSuffix: "gimi",
    ganji: "기미",
    elementImage: "기토가 미토의 따뜻한 흙과 겹쳐진 구조",
    symbolicImage: "따뜻한 밭이 오래 품은 열매를 키우는 형상입니다.",
    coreKeywords: ["돌봄", "현실감", "축적"],
    relatedTopics: ["family", "money", "relationship", "growth"],
    polarity: "positive",
    baseWeight: 4.2,
    vividness: 4.1,
    mbtiBridgeNeeds: ["stability", "warmth"],
  },
  {
    idSuffix: "gyeongsin",
    ganji: "경신",
    elementImage: "경금이 신금의 날카로운 금과 겹쳐진 구조",
    symbolicImage: "큰 칼이 차가운 바위 위에서 더욱 날을 세우는 형상입니다.",
    coreKeywords: ["강한 판단", "절단력", "위기 대응"],
    relatedTopics: ["identity", "personality", "work", "growth"],
    polarity: "mixed",
    baseWeight: 4.5,
    vividness: 4.6,
    mbtiBridgeNeeds: ["emotional_buffer", "pace_flexibility"],
  },
  {
    idSuffix: "sinyu",
    ganji: "신유",
    elementImage: "신금이 유금의 정제된 금과 겹쳐진 구조",
    symbolicImage: "잘 다듬어진 보석이 거울처럼 빛나는 형상입니다.",
    coreKeywords: ["완성도", "취향", "정밀함"],
    relatedTopics: ["identity", "work", "love", "study"],
    polarity: "positive",
    baseWeight: 4.4,
    vividness: 4.5,
    mbtiBridgeNeeds: ["warmth", "intellectual_match"],
  },
  {
    idSuffix: "imsul",
    ganji: "임술",
    elementImage: "임수가 술토의 마른 땅과 만나는 구조",
    symbolicImage: "큰 물길이 마른 성벽 앞에서 방향을 바꾸는 형상입니다.",
    coreKeywords: ["큰 생각", "원칙", "방향 전환"],
    relatedTopics: ["identity", "work", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.2,
    vividness: 4.2,
    mbtiBridgeNeeds: ["stability", "pace_flexibility"],
  },
  {
    idSuffix: "gyehae",
    ganji: "계해",
    elementImage: "계수가 해수의 깊은 물과 겹쳐진 구조",
    symbolicImage: "깊은 물이 더 깊은 바다로 스며드는 형상입니다.",
    coreKeywords: ["깊은 물", "사색", "직관", "감정의 깊이"],
    relatedTopics: ["identity", "personality", "study", "relationship", "growth"],
    polarity: "mixed",
    baseWeight: 4.4,
    vividness: 4.7,
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
    focus: {
      personality:
        "계해일주는 깊은 물이 더 깊은 바다로 스며드는 형상이라 사색, 감정의 깊이, 직관이 강하게 살아납니다. 겉으로는 조용해 보여도 안쪽에서는 생각과 느낌이 오래 흐를 수 있습니다. 사람과 상황의 미묘한 결을 잘 감지하는 편입니다.",
      growth:
        "성장은 깊이 들어가는 힘을 고립으로 만들지 않는 데 있습니다. 과몰입이 길어질 때는 기록, 대화, 몸을 움직이는 루틴으로 물길을 밖으로 내야 합니다. 깊은 직관을 현실의 선택으로 옮길 때 안정됩니다.",
      cautionReading:
        "혼자 깊게 들어가면 감정과 생각이 오래 고여 고립감이나 과몰입으로 이어질 수 있습니다.",
    },
  },
] as const satisfies readonly DayPillarSeed[];

function getStem(ganji: string): HeavenlyStemKo {
  return Array.from(ganji)[0] as HeavenlyStemKo;
}

function getBranch(ganji: string): EarthlyBranchKo {
  return Array.from(ganji)[1] as EarthlyBranchKo;
}

function buildText(input: {
  readonly override?: string;
  readonly labelKo: string;
  readonly symbolicImage: string;
  readonly stemText: string;
  readonly branchText: string;
  readonly closing: string;
}): string {
  if (input.override !== undefined) {
    return input.override;
  }

  return `${input.labelKo}는 ${input.symbolicImage} ${input.stemText} ${input.branchText} ${input.closing}`;
}

function buildSceneSeeds(
  labelKo: string,
  coreKeywords: readonly string[],
): readonly string[] {
  return [
    `${labelKo}의 ${coreKeywords[0]}이 업무나 선택의 순간에 먼저 드러나는 장면`,
    `가까운 관계에서 ${coreKeywords[1]} 때문에 속도와 온도를 조정해야 하는 장면`,
    `성장 과정에서 ${coreKeywords[2]}을 운영법으로 바꾸는 장면`,
  ];
}

function buildPhraseSeeds(
  symbolicImage: string,
  coreKeywords: readonly string[],
): readonly string[] {
  return [
    symbolicImage,
    `${coreKeywords[0]}과 ${coreKeywords[1]}이 함께 있는 일주`,
    `${coreKeywords[2]}을 현실 운영법으로 바꾸는 흐름`,
  ];
}

function buildDayPillarEntry(seed: DayPillarSeed): SajuDayPillarEntry {
  const stem = getStem(seed.ganji);
  const branch = getBranch(seed.ganji);
  const stemProfile = STEM_PROFILES[stem];
  const branchProfile = BRANCH_PROFILES[branch];
  const labelKo = `${seed.ganji}일주`;

  return {
    id: `day_pillar_${seed.idSuffix}`,
    labelKo,
    stem,
    branch,
    elementImage: seed.elementImage,
    symbolicImage: seed.symbolicImage,
    coreKeywords: seed.coreKeywords,
    personality: buildText({
      override: seed.focus?.personality,
      labelKo,
      symbolicImage: seed.symbolicImage,
      stemText: stemProfile.personality,
      branchText: branchProfile.personality,
      closing:
        "그래서 겉으로 보이는 태도와 안쪽의 긴장이 함께 읽히는 일주입니다.",
    }),
    workMoney: buildText({
      override: seed.focus?.workMoney,
      labelKo,
      symbolicImage: seed.symbolicImage,
      stemText: stemProfile.workMoney,
      branchText: branchProfile.workMoney,
      closing:
        "성과를 만들 때는 강점을 쓸 자리와 에너지가 새는 지점을 같이 봐야 합니다.",
    }),
    loveRelationship: buildText({
      override: seed.focus?.loveRelationship,
      labelKo,
      symbolicImage: seed.symbolicImage,
      stemText: stemProfile.loveRelationship,
      branchText: branchProfile.loveRelationship,
      closing:
        "좋아하는 마음이 있어도 상대가 체감하는 속도와 말의 온도를 조정하는 것이 중요합니다.",
    }),
    familyPeople: buildText({
      override: seed.focus?.familyPeople,
      labelKo,
      symbolicImage: seed.symbolicImage,
      stemText: stemProfile.familyPeople,
      branchText: branchProfile.familyPeople,
      closing:
        "가까운 관계일수록 책임 범위와 감정 표현 방식을 문장으로 정리해야 편해집니다.",
    }),
    growth: buildText({
      override: seed.focus?.growth,
      labelKo,
      symbolicImage: seed.symbolicImage,
      stemText: stemProfile.growth,
      branchText: branchProfile.growth,
      closing:
        "운영법이 잡히면 일주의 강한 색이 부담이 아니라 장점으로 바뀝니다.",
    }),
    positiveReading:
      seed.focus?.positiveReading ??
      `${labelKo}는 ${seed.coreKeywords[0]}, ${seed.coreKeywords[1]}을 잘 쓰면 자기만의 자리와 역할을 만들 수 있습니다. ${seed.symbolicImage}`,
    cautionReading:
      seed.focus?.cautionReading ??
      `${labelKo}는 ${seed.coreKeywords[2]}이 과해지면 관계나 일에서 속도 차이가 생길 수 있습니다. 강점을 오래 쓰려면 쉬는 장치와 표현 조절이 필요합니다.`,
    practicalUse:
      seed.focus?.practicalUse ??
      `${labelKo}는 ${seed.coreKeywords[0]}을 결과물로 만들고, ${seed.coreKeywords[1]}을 관계의 언어로 낮추며, ${seed.coreKeywords[2]}을 루틴으로 관리할 때 안정됩니다.`,
    sceneSeeds: buildSceneSeeds(labelKo, seed.coreKeywords),
    phraseSeeds: buildPhraseSeeds(seed.symbolicImage, seed.coreKeywords),
    relatedTopics: seed.relatedTopics,
    polarity: seed.polarity,
    baseWeight: seed.baseWeight,
    vividness: seed.vividness,
    mbtiBridgeNeeds: seed.mbtiBridgeNeeds,
    avoidClaims: DEFAULT_AVOID_CLAIMS,
  };
}

export const SAJU_DAY_PILLAR_KNOWLEDGE = DAY_PILLAR_SEEDS.map(
  buildDayPillarEntry,
) as readonly SajuDayPillarEntry[];

export const SAJU_DAY_PILLAR_BY_ID = new Map<string, SajuDayPillarEntry>(
  SAJU_DAY_PILLAR_KNOWLEDGE.map((entry) => [entry.id, entry]),
);

export const SAJU_DAY_PILLAR_BY_LABEL = new Map<string, SajuDayPillarEntry>(
  SAJU_DAY_PILLAR_KNOWLEDGE.flatMap((entry) => [
    [entry.labelKo, entry],
    [entry.labelKo.replace("일주", ""), entry],
  ]),
);

export function requireSajuDayPillarEntry(
  idOrLabel: string,
): SajuDayPillarEntry {
  const entry =
    SAJU_DAY_PILLAR_BY_ID.get(idOrLabel) ?? SAJU_DAY_PILLAR_BY_LABEL.get(idOrLabel);

  if (entry === undefined) {
    throw new Error(`Unknown Saju day pillar: ${idOrLabel}`);
  }

  return entry;
}

export function toSajuFeatureEntryFromDayPillar(
  entry: SajuDayPillarEntry,
): SajuFeatureEntry {
  return {
    id: entry.id,
    category: "day_pillar",
    labelKo: entry.labelKo,
    aliases: [entry.labelKo, entry.labelKo.replace("일주", "")],
    polarity: entry.polarity,
    topics: entry.relatedTopics,
    baseWeight: entry.baseWeight,
    vividness: entry.vividness,
    summary: entry.elementImage,
    symbolicImage: entry.symbolicImage,
    positiveReading: entry.positiveReading,
    cautionReading: entry.cautionReading,
    practicalUse: entry.practicalUse,
    sceneSeeds: entry.sceneSeeds,
    phraseSeeds: entry.phraseSeeds,
    avoidClaims: entry.avoidClaims,
    mbtiBridgeNeeds: entry.mbtiBridgeNeeds,
  };
}

export const SAJU_DAY_PILLAR_FEATURES = SAJU_DAY_PILLAR_KNOWLEDGE.map(
  toSajuFeatureEntryFromDayPillar,
) as readonly SajuFeatureEntry[];

const UNSAFE_DAY_PILLAR_TERMS = [
  "100%",
  "반드시",
  "무조건",
  "운명 확정",
  "미래 확정",
  "수익 보장",
  "치료",
  "진단",
  "죽음",
  "사망",
  "이혼 확정",
  "파산",
  "strict " + "self-discipline",
  "leader " + "type",
  "strong " + "energy",
] as const;

export type SajuDayPillarSafetyViolation = {
  readonly dayPillarId: string;
  readonly term: string;
  readonly field: string;
};

function collectDayPillarTextFields(
  entry: SajuDayPillarEntry,
): readonly { readonly field: string; readonly value: string }[] {
  return [
    { field: "elementImage", value: entry.elementImage },
    { field: "symbolicImage", value: entry.symbolicImage },
    { field: "personality", value: entry.personality },
    { field: "workMoney", value: entry.workMoney },
    { field: "loveRelationship", value: entry.loveRelationship },
    { field: "familyPeople", value: entry.familyPeople },
    { field: "growth", value: entry.growth },
    { field: "positiveReading", value: entry.positiveReading },
    { field: "cautionReading", value: entry.cautionReading },
    { field: "practicalUse", value: entry.practicalUse },
    ...entry.coreKeywords.map((value) => ({ field: "coreKeywords", value })),
    ...entry.sceneSeeds.map((value) => ({ field: "sceneSeeds", value })),
    ...entry.phraseSeeds.map((value) => ({ field: "phraseSeeds", value })),
  ];
}

export function findUnsafeSajuDayPillarClaims(): readonly SajuDayPillarSafetyViolation[] {
  const violations: SajuDayPillarSafetyViolation[] = [];

  for (const entry of SAJU_DAY_PILLAR_KNOWLEDGE) {
    for (const { field, value } of collectDayPillarTextFields(entry)) {
      for (const term of UNSAFE_DAY_PILLAR_TERMS) {
        if (value.includes(term)) {
          violations.push({
            dayPillarId: entry.id,
            term,
            field,
          });
        }
      }
    }
  }

  return violations;
}
