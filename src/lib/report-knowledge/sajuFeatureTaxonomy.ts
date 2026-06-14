import { SAJU_DAY_PILLAR_FEATURES } from "./sajuDayPillarKnowledge";
import type {
  MbtiBridgeNeed,
  SajuFeatureCategory,
  SajuFeatureEntry,
  SajuFeaturePolarity,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";

const DEFAULT_AVOID_CLAIMS = [
  "결과 단정",
  "성과 단정",
  "관계 단정",
  "사건 예언",
] as const;

function createFeatureEntry(
  entry: Omit<SajuFeatureEntry, "avoidClaims"> & {
    readonly avoidClaims?: readonly string[];
  },
): SajuFeatureEntry {
  return {
    ...entry,
    avoidClaims: entry.avoidClaims ?? DEFAULT_AVOID_CLAIMS,
  };
}

const twelveSinsalEntries = [
  createFeatureEntry({
    id: "twelve_sinsal_banan",
    category: "twelve_sinsal",
    labelKo: "반안살",
    hanja: "攀鞍煞",
    aliases: ["반안", "반안살"],
    polarity: "positive",
    topics: ["identity", "work", "money", "environment"],
    baseWeight: 4.7,
    vividness: 5,
    summary:
      "역할과 이름이 주어질 때 사회적 위치, 명예, 재물 흐름이 살아나는 길신으로 읽습니다.",
    symbolicImage:
      "반안살은 말 안장에 올라탄 장군의 형상으로 비유됩니다. 혼자 묻혀 있는 힘보다 이름이 걸린 자리에서 더 빛나는 기운입니다.",
    positiveReading:
      "책임 있는 역할, 공식 직함, 이동과 확장 기회가 붙을 때 존재감이 살아날 수 있습니다.",
    cautionReading:
      "자리가 주어지지 않거나 인정 구조가 흐리면 실력에 비해 답답함을 크게 느낄 수 있습니다.",
    practicalUse:
      "성과를 남길 수 있는 직함, 프로젝트 책임, 공개된 결과물을 만들 때 이 힘을 좋게 쓸 수 있습니다.",
    sceneSeeds: [
      "새 역할을 맡고 나서 갑자기 추진력이 붙는 장면",
      "이름이 걸린 프로젝트에서 더 꼼꼼해지는 장면",
    ],
    phraseSeeds: [
      "말 안장에 올라탄 장군의 기운",
      "역할이 주어질수록 살아나는 힘",
      "사회적 위치와 명예를 의식하는 흐름",
    ],
    mbtiBridgeNeeds: ["responsibility_clarity", "autonomy_respect"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_jangseong",
    category: "twelve_sinsal",
    labelKo: "장성살",
    hanja: "將星煞",
    aliases: ["장성", "장성살"],
    polarity: "mixed",
    topics: ["identity", "work", "relationship", "environment"],
    baseWeight: 4.4,
    vividness: 4.5,
    summary:
      "앞에 서서 판을 잡는 기운입니다. 리더십과 고집이 함께 나타날 수 있습니다.",
    symbolicImage:
      "장성살은 장수가 깃발 앞에 서 있는 모습에 가깝습니다. 물러서기보다 중심을 잡고 방향을 제시하려는 힘입니다.",
    positiveReading:
      "조직이나 팀에서 기준을 세우고 흐트러진 일을 정리하는 힘으로 쓰일 수 있습니다.",
    cautionReading:
      "자기 기준이 강해지면 주변이 지시받는 느낌을 받을 수 있어 말의 온도 조절이 필요합니다.",
    practicalUse:
      "결정권과 책임 범위가 명확한 환경에서 강점이 살아나며, 협업에서는 먼저 질문하고 지시하는 순서가 좋습니다.",
    sceneSeeds: [
      "팀이 우왕좌왕할 때 본인이 기준표를 만드는 장면",
      "회의에서 결론을 빨리 정리하려는 장면",
    ],
    phraseSeeds: [
      "깃발 앞에 선 장수의 힘",
      "판을 잡고 방향을 세우는 흐름",
      "리더십과 고집이 동시에 켜지는 기운",
    ],
    mbtiBridgeNeeds: ["responsibility_clarity", "autonomy_respect"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_yeokma",
    category: "twelve_sinsal",
    labelKo: "역마살",
    hanja: "驛馬煞",
    aliases: ["역마", "역마살"],
    polarity: "mixed",
    topics: ["work", "money", "relationship", "environment", "growth"],
    baseWeight: 4.1,
    vividness: 4.2,
    summary:
      "머물러 있기보다 이동, 변화, 연결, 외부 활동에서 기운이 열리는 특징입니다.",
    symbolicImage:
      "역마살은 한곳에 묶인 말보다 길 위에서 힘이 붙는 말의 이미지입니다.",
    positiveReading:
      "새 환경, 출장, 이동, 네트워크, 외부 프로젝트에서 기회 감각이 살아날 수 있습니다.",
    cautionReading:
      "변화가 잦아지면 집중과 마무리가 흐려질 수 있어 정리 루틴이 필요합니다.",
    practicalUse:
      "움직임이 있는 업무와 고정 루틴을 함께 설계하면 확장성과 안정감을 같이 얻을 수 있습니다.",
    sceneSeeds: [
      "새로운 장소에 가면 아이디어가 빨리 도는 장면",
      "반복 업무만 이어질 때 급격히 답답해지는 장면",
    ],
    phraseSeeds: [
      "길 위에서 힘이 붙는 말",
      "이동과 변화에서 열리는 기운",
      "외부 연결이 살아나는 흐름",
    ],
    mbtiBridgeNeeds: ["pace_flexibility", "intellectual_match"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_hwagae",
    category: "twelve_sinsal",
    labelKo: "화개살",
    hanja: "華蓋煞",
    aliases: ["화개", "화개살"],
    polarity: "mixed",
    topics: ["personality", "study", "environment", "growth"],
    baseWeight: 4,
    vividness: 4.1,
    summary:
      "겉으로 떠들기보다 혼자 깊게 파고드는 취향, 예술성, 고독한 집중을 보여줍니다.",
    symbolicImage:
      "화개살은 화려한 덮개 아래에서 혼자 생각을 숙성시키는 이미지입니다.",
    positiveReading:
      "전문성, 창작, 공부, 신앙성, 미감처럼 깊게 몰입하는 분야에서 강점이 생길 수 있습니다.",
    cautionReading:
      "혼자만의 세계가 깊어질수록 가까운 사람에게 거리감으로 보일 수 있습니다.",
    practicalUse:
      "혼자 파고드는 시간과 결과를 밖으로 꺼내는 시간을 분리해 두면 깊이가 성과로 이어집니다.",
    sceneSeeds: [
      "혼자 자료를 파고들 때 시간이 빠르게 가는 장면",
      "사람 많은 자리 뒤에 조용한 시간이 꼭 필요한 장면",
    ],
    phraseSeeds: [
      "혼자 깊게 숙성시키는 힘",
      "고독한 집중과 미감",
      "깊이는 있지만 표현 통로가 필요한 기운",
    ],
    mbtiBridgeNeeds: ["autonomy_respect", "intellectual_match"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_geopsal",
    category: "twelve_sinsal",
    labelKo: "겁살",
    hanja: "劫煞",
    aliases: ["겁살"],
    polarity: "warning",
    topics: ["money", "relationship", "environment", "growth"],
    baseWeight: 3.8,
    vividness: 3.8,
    summary:
      "예상 밖의 변수와 손실 감각을 민감하게 느끼게 하는 주의 신호입니다.",
    symbolicImage:
      "겁살은 갑자기 들어온 바람이 쌓아 둔 것을 흔드는 이미지에 가깝습니다.",
    positiveReading:
      "위험을 빨리 감지하고 방어 규칙을 세우는 감각으로 바꾸면 자산과 관계를 지키는 힘이 됩니다.",
    cautionReading:
      "준비 없이 속도를 내면 돈, 일정, 관계에서 새는 구멍이 생길 수 있습니다.",
    practicalUse:
      "새로운 선택 앞에서는 손실 한도, 시간 한도, 책임 한도를 먼저 정하는 방식이 좋습니다.",
    sceneSeeds: [
      "좋아 보여서 빠르게 결정했는데 뒤처리가 커지는 장면",
      "계획보다 예비비와 완충 시간이 필요한 장면",
    ],
    phraseSeeds: [
      "쌓아 둔 것을 흔드는 변수",
      "방어 규칙이 필요한 흐름",
      "손실 감각을 관리 능력으로 바꾸는 신호",
    ],
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_jaesal",
    category: "twelve_sinsal",
    labelKo: "재살",
    hanja: "災煞",
    aliases: ["재살"],
    polarity: "warning",
    topics: ["work", "relationship", "environment", "growth"],
    baseWeight: 3.7,
    vividness: 3.7,
    summary:
      "작은 균열을 방치하면 부담이 커질 수 있음을 알려주는 관리 신호입니다.",
    symbolicImage:
      "재살은 바닥의 작은 금이 커지기 전에 살펴야 하는 이미지입니다.",
    positiveReading:
      "문제를 빨리 발견하고 사전에 정리하는 습관으로 쓰면 안정성이 좋아집니다.",
    cautionReading:
      "피곤함, 마찰, 일정 지연을 대수롭지 않게 넘기면 나중에 더 큰 비용으로 돌아올 수 있습니다.",
    practicalUse:
      "일정, 건강감, 돈, 관계에서 작은 이상 신호를 체크리스트로 관리하는 방식이 좋습니다.",
    sceneSeeds: [
      "작은 지연을 넘겼다가 일정 전체가 흔들리는 장면",
      "말 한마디를 미뤘다가 관계 오해가 커지는 장면",
    ],
    phraseSeeds: [
      "작은 금이 커지기 전의 신호",
      "사전 점검이 필요한 흐름",
      "작은 균열을 관리 능력으로 바꾸는 기운",
    ],
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  }),
] as const;

const sinsalEntries = [
  createFeatureEntry({
    id: "sinsal_dohwa",
    category: "sinsal",
    labelKo: "도화살",
    hanja: "桃花煞",
    aliases: ["도화", "도화살"],
    polarity: "mixed",
    topics: ["identity", "personality", "love", "relationship", "environment"],
    baseWeight: 4.4,
    vividness: 5,
    summary:
      "사람들의 시선이 머무는 기운입니다. 매력, 분위기, 표현 방식이 관계의 입구가 될 수 있습니다.",
    symbolicImage:
      "도화살은 꽃이 핀 자리로 시선이 모이는 이미지입니다. 말이 많지 않아도 분위기, 표정, 스타일 때문에 관심이 붙을 수 있습니다.",
    positiveReading:
      "대인 매력, 콘텐츠성, 외형과 분위기, 표현 직업에서 시선과 관심을 모으는 존재감이 살아날 수 있습니다.",
    cautionReading:
      "관심이 붙는 만큼 오해도 붙을 수 있어 관계의 선과 표현 온도를 의식해야 합니다.",
    practicalUse:
      "이미지, 말투, 공개되는 결과물을 일관되게 관리하면 매력이 신뢰로 이어질 수 있습니다.",
    sceneSeeds: [
      "말을 많이 하지 않았는데도 주변이 한 번 더 보는 장면",
      "스타일이나 일하는 태도 때문에 관심이 붙는 장면",
    ],
    phraseSeeds: [
      "사람들의 시선이 머무는 기운",
      "분위기와 표정에 관심이 붙는 흐름",
      "매력을 신뢰로 바꾸는 관리가 필요한 힘",
    ],
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  }),
  createFeatureEntry({
    id: "sinsal_hongyeom",
    category: "sinsal",
    labelKo: "홍염살",
    hanja: "紅艶煞",
    aliases: ["홍염", "홍염살"],
    polarity: "mixed",
    topics: ["identity", "love", "relationship"],
    baseWeight: 4.2,
    vividness: 4.7,
    summary:
      "사람을 끌어당기는 색감과 온도입니다. 가까운 관계에서 더 선명하게 느껴질 수 있습니다.",
    symbolicImage:
      "홍염살은 은근한 붉은 빛처럼 가까이 올수록 매력이 선명해지는 이미지입니다.",
    positiveReading:
      "호감, 친밀감, 감각적 매력, 사람을 편하게 끌어당기는 분위기로 나타날 수 있습니다.",
    cautionReading:
      "관계의 온도가 빨리 올라가면 기대와 오해가 같이 커질 수 있습니다.",
    practicalUse:
      "감정을 빠르게 태우기보다 관계 속도와 약속의 선을 맞추면 매력이 오래 갑니다.",
    sceneSeeds: [
      "처음보다 대화가 쌓일수록 호감이 커지는 장면",
      "분위기는 좋은데 관계 속도 조절이 필요한 장면",
    ],
    phraseSeeds: [
      "가까이 올수록 선명해지는 붉은 온도",
      "호감이 붙는 관계의 색감",
      "매력과 속도 조절이 함께 필요한 흐름",
    ],
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  }),
  createFeatureEntry({
    id: "sinsal_baekho",
    category: "sinsal",
    labelKo: "백호대살",
    hanja: "白虎大煞",
    aliases: ["백호", "백호살", "백호대살"],
    polarity: "mixed",
    topics: ["personality", "work", "relationship", "growth"],
    baseWeight: 4.5,
    vividness: 5,
    summary:
      "날카롭고 강한 에너지가 한 번에 몰리는 신호입니다. 결단력과 충돌성이 함께 있습니다.",
    symbolicImage:
      "백호대살은 위기 앞에서 칼을 뽑는 흰 호랑이의 이미지입니다. 거칠게 쓰면 충돌, 잘 쓰면 결단력입니다.",
    positiveReading:
      "압박 상황에서 빠르게 결론을 내리고 결단력과 집중력을 발휘하는 힘으로 쓰일 수 있습니다.",
    cautionReading:
      "말과 행동이 세게 나가면 가까운 사람이 충돌감, 위협감, 피로감을 느낄 수 있습니다.",
    practicalUse:
      "강한 결정을 내리기 전 완충 질문 하나를 넣고, 몸의 긴장을 풀어주는 루틴을 두는 것이 좋습니다.",
    sceneSeeds: [
      "위기 상황에서 갑자기 집중력이 올라오는 장면",
      "상대보다 결론이 빨라 말이 세게 나가는 장면",
    ],
    phraseSeeds: [
      "위기 앞에서 칼을 뽑는 흰 호랑이",
      "충돌성과 결단력이 함께 있는 힘",
      "세기를 조절하면 집중력으로 바뀌는 기운",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "pace_flexibility"],
  }),
  createFeatureEntry({
    id: "sinsal_hyeonchim",
    category: "sinsal",
    labelKo: "현침살",
    hanja: "懸針煞",
    aliases: ["현침", "현침살"],
    polarity: "mixed",
    topics: ["personality", "work", "study", "relationship", "growth"],
    baseWeight: 4.3,
    vividness: 4.4,
    summary:
      "말, 판단, 손끝, 분석이 바늘처럼 예리해지는 기운입니다.",
    symbolicImage:
      "현침살은 공중에 매달린 바늘처럼 정확히 찌르는 이미지입니다.",
    positiveReading:
      "분석, 교정, 기획, 문장, 기술, 정밀한 사고가 해석 능력으로 살아날 수 있습니다.",
    cautionReading:
      "정확한 말도 차갑게 전달되면 상대에게 상처가 될 수 있어 표현 온도가 중요합니다.",
    practicalUse:
      "핵심을 찌르는 능력은 살리되, 중요한 대화에서는 먼저 상대의 말을 한 문장으로 되받아주는 방식이 좋습니다.",
    sceneSeeds: [
      "상대 설명 중 오류가 먼저 보이는 장면",
      "카톡 답장이 짧아 차갑게 보이는 장면",
    ],
    phraseSeeds: [
      "바늘처럼 정확히 찌르는 판단",
      "정밀한 해석 능력",
      "말의 온도를 조절해야 하는 예리함",
    ],
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  }),
  createFeatureEntry({
    id: "sinsal_gwimun",
    category: "sinsal",
    labelKo: "귀문관살",
    hanja: "鬼門關煞",
    aliases: ["귀문", "귀문관", "귀문관살"],
    polarity: "mixed",
    topics: ["personality", "study", "relationship", "growth"],
    baseWeight: 4,
    vividness: 4.2,
    summary:
      "보통 사람이 넘기는 미묘한 흐름을 깊게 감지하고 파고드는 기운입니다.",
    symbolicImage:
      "귀문관살은 닫힌 문 뒤의 소리를 듣는 이미지입니다. 감각이 예민하고 생각이 깊어질 수 있습니다.",
    positiveReading:
      "연구, 상담적 경청이 아닌 세밀한 관찰, 창작, 전략 분석에서 깊이가 생길 수 있습니다.",
    cautionReading:
      "생각이 과하게 안쪽으로 말리면 의심, 예민함, 고립감으로 이어질 수 있습니다.",
    practicalUse:
      "감지한 것을 바로 결론으로 만들기보다 기록하고 검증하는 루틴이 필요합니다.",
    sceneSeeds: [
      "말투의 작은 변화가 오래 신경 쓰이는 장면",
      "혼자 생각을 이어가다 밤이 늦어지는 장면",
    ],
    phraseSeeds: [
      "닫힌 문 뒤의 소리를 듣는 감각",
      "미묘한 흐름을 깊게 보는 힘",
      "기록과 검증이 필요한 예민함",
    ],
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  }),
  createFeatureEntry({
    id: "sinsal_wonjin",
    category: "sinsal",
    labelKo: "원진살",
    hanja: "怨嗔煞",
    aliases: ["원진", "원진살"],
    polarity: "warning",
    topics: ["love", "relationship", "family", "growth"],
    baseWeight: 3.9,
    vividness: 4.1,
    summary:
      "가까운 관계에서 사소한 결이 크게 거슬릴 수 있는 긴장 신호입니다.",
    symbolicImage:
      "원진살은 가까이 앉았는데 의자의 각도가 조금씩 맞지 않는 이미지입니다.",
    positiveReading:
      "관계에서 불편한 지점을 빨리 알아차리고 기준을 정리하는 힘으로 바꿀 수 있습니다.",
    cautionReading:
      "작은 불편함을 오래 삼키면 어느 순간 말이 날카롭게 터질 수 있습니다.",
    practicalUse:
      "불만을 쌓기 전 생활 규칙, 연락 간격, 감정 표현 방식을 구체적으로 맞춰야 합니다.",
    sceneSeeds: [
      "사소한 습관이 계속 눈에 밟히는 장면",
      "참다가 한 번에 차갑게 말이 나가는 장면",
    ],
    phraseSeeds: [
      "의자 각도가 조금씩 맞지 않는 관계",
      "가까울수록 결이 크게 보이는 긴장",
      "쌓기 전에 규칙을 맞춰야 하는 신호",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  }),
] as const;

const gwiinEntries = [
  createFeatureEntry({
    id: "gwiin_cheoneul",
    category: "gwiin",
    labelKo: "천을귀인",
    hanja: "天乙貴人",
    aliases: ["천을", "천을귀인"],
    polarity: "positive",
    topics: ["identity", "work", "relationship", "environment", "growth"],
    baseWeight: 4.6,
    vividness: 4.1,
    summary:
      "막힌 자리에서 도움, 보호, 좋은 인연의 통로가 열리는 귀인 기운입니다.",
    symbolicImage:
      "천을귀인은 어두운 길에서 등불을 들어주는 사람의 이미지입니다.",
    positiveReading:
      "중요한 순간에 사람, 제도, 기회가 도움으로 붙을 수 있는 복입니다.",
    cautionReading:
      "도움이 있어도 본인이 요청하지 않으면 통로가 늦게 열릴 수 있습니다.",
    practicalUse:
      "혼자 해결하려는 습관을 줄이고, 필요한 도움을 구체적으로 요청하는 것이 좋습니다.",
    sceneSeeds: [
      "막힌 문제를 주변 조언으로 풀어내는 장면",
      "혼자 버티다 도움을 요청하자 일이 빨라지는 장면",
    ],
    phraseSeeds: [
      "어두운 길에서 등불을 들어주는 귀인",
      "도움의 통로가 열리는 복",
      "요청할수록 살아나는 보호 기운",
    ],
    mbtiBridgeNeeds: ["autonomy_respect", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "gwiin_cheondeok",
    category: "gwiin",
    labelKo: "천덕귀인",
    hanja: "天德貴人",
    aliases: ["천덕", "천덕귀인"],
    polarity: "positive",
    topics: ["relationship", "family", "environment", "growth"],
    baseWeight: 4.2,
    vividness: 3.8,
    summary:
      "사람 사이의 큰 충돌을 부드럽게 낮춰 주는 덕의 기운입니다.",
    symbolicImage:
      "천덕귀인은 거친 바람 앞에 세워진 부드러운 울타리 같은 이미지입니다.",
    positiveReading:
      "주변의 호의, 중재, 도움으로 관계의 날카로움이 완화될 수 있습니다.",
    cautionReading:
      "덕이 있다고 해서 모든 갈등이 저절로 풀리지는 않으므로 먼저 말의 온도를 낮춰야 합니다.",
    practicalUse:
      "갈등 상황에서는 바로 판정하지 말고 중간 역할을 할 사람이나 절차를 두면 좋습니다.",
    sceneSeeds: [
      "분위기가 거칠어질 때 누군가 중재해 주는 장면",
      "말을 조금 부드럽게 하자 관계가 풀리는 장면",
    ],
    phraseSeeds: [
      "거친 바람을 낮추는 덕",
      "관계의 날카로움을 완화하는 기운",
      "중재와 절차를 살리는 힘",
    ],
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  }),
  createFeatureEntry({
    id: "gwiin_woldeok",
    category: "gwiin",
    labelKo: "월덕귀인",
    hanja: "月德貴人",
    aliases: ["월덕", "월덕귀인"],
    polarity: "positive",
    topics: ["work", "relationship", "environment", "growth"],
    baseWeight: 4.2,
    vividness: 3.9,
    summary:
      "일상과 조직 안에서 도움과 완충을 만들어 주는 귀인 흐름입니다.",
    symbolicImage:
      "월덕귀인은 달빛처럼 날카로운 모서리를 부드럽게 비추는 이미지입니다.",
    positiveReading:
      "조직 안에서 평판, 중재자, 제도적 도움을 통해 부담이 낮아질 수 있습니다.",
    cautionReading:
      "도움을 당연하게 여기면 관계의 신뢰가 약해질 수 있습니다.",
    practicalUse:
      "협업 기록과 감사 표현을 남기면 귀인 흐름이 오래 유지됩니다.",
    sceneSeeds: [
      "조직 안 절차 덕분에 일이 정리되는 장면",
      "작은 감사 표현이 다음 도움으로 이어지는 장면",
    ],
    phraseSeeds: [
      "달빛처럼 모서리를 낮추는 귀인",
      "조직 안 완충의 도움",
      "평판과 절차를 살리는 복",
    ],
    mbtiBridgeNeeds: ["warmth", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "gwiin_munchang",
    category: "gwiin",
    labelKo: "문창귀인",
    hanja: "文昌貴人",
    aliases: ["문창", "문창귀인"],
    polarity: "positive",
    topics: ["study", "work", "identity", "personality", "growth"],
    baseWeight: 4.5,
    vividness: 4.2,
    summary:
      "글, 지식, 시험, 문장화, 정리 능력에서 도움을 받는 귀인 기운입니다.",
    symbolicImage:
      "문창귀인은 책상 위에 등불이 켜진 이미지입니다. 흩어진 생각을 글과 체계로 묶는 힘입니다.",
    positiveReading:
      "공부, 자격증, 전문서, 기획서, 설명 자료에서 실력이 드러날 수 있습니다.",
    cautionReading:
      "머릿속 이해에 머물면 성과가 늦어지므로 결과물 형태로 꺼내는 습관이 필요합니다.",
    practicalUse:
      "읽고 끝내지 말고 요약, 도식화, 문제 풀이, 발표 자료로 바꾸면 도움이 큽니다.",
    sceneSeeds: [
      "전문서를 읽고 목차부터 구조화하는 장면",
      "복잡한 내용을 표와 글로 정리하는 장면",
    ],
    phraseSeeds: [
      "책상 위 등불 같은 지식의 귀인",
      "생각을 글과 체계로 묶는 힘",
      "공부를 결과물로 바꾸는 기운",
    ],
    mbtiBridgeNeeds: ["intellectual_match", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "gwiin_hakdang",
    category: "gwiin",
    labelKo: "학당귀인",
    hanja: "學堂貴人",
    aliases: ["학당", "학당귀인"],
    polarity: "positive",
    topics: ["study", "work", "growth"],
    baseWeight: 4.1,
    vividness: 3.8,
    summary:
      "배움의 장, 스승, 체계적 학습에서 힘을 얻는 귀인 기운입니다.",
    symbolicImage:
      "학당귀인은 좋은 교실과 스승을 만난 학생의 이미지입니다.",
    positiveReading:
      "혼자 감으로 하기보다 커리큘럼과 멘토가 있을 때 성장이 빨라질 수 있습니다.",
    cautionReading:
      "체계가 없으면 시작은 빨라도 중간에 흩어질 수 있습니다.",
    practicalUse:
      "자격증, 직무 학습, 사업 학습을 2주 단위 목표와 피드백 구조로 쪼개는 것이 좋습니다.",
    sceneSeeds: [
      "강의나 멘토가 있을 때 학습 속도가 붙는 장면",
      "커리큘럼이 없으면 자료만 모으다 지치는 장면",
    ],
    phraseSeeds: [
      "좋은 교실과 스승의 도움",
      "체계가 있을 때 빨라지는 배움",
      "학습을 목표 단위로 쪼개는 힘",
    ],
    mbtiBridgeNeeds: ["intellectual_match", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "gwiin_taegeuk",
    category: "gwiin",
    labelKo: "태극귀인",
    hanja: "太極貴人",
    aliases: ["태극", "태극귀인"],
    polarity: "positive",
    topics: ["identity", "study", "environment", "growth"],
    baseWeight: 4,
    vividness: 3.9,
    summary:
      "큰 원리와 의미를 찾고, 흐트러진 경험을 하나의 방향으로 묶는 귀인 기운입니다.",
    symbolicImage:
      "태극귀인은 여러 선이 하나의 중심으로 모이는 큰 문양의 이미지입니다.",
    positiveReading:
      "철학, 전략, 장기 방향, 자기 해석에서 깊은 중심을 만들 수 있습니다.",
    cautionReading:
      "큰 의미만 찾다 실행 단위가 늦어지면 현실 성과가 흐려질 수 있습니다.",
    practicalUse:
      "큰 방향을 세운 뒤 오늘 할 수 있는 작은 실행으로 내려오는 방식이 필요합니다.",
    sceneSeeds: [
      "일의 의미가 보여야 몰입이 붙는 장면",
      "큰 그림은 있는데 첫 실행을 미루는 장면",
    ],
    phraseSeeds: [
      "여러 선을 중심으로 묶는 귀인",
      "큰 원리를 찾는 힘",
      "방향을 작은 실행으로 내려야 하는 흐름",
    ],
    mbtiBridgeNeeds: ["intellectual_match", "stability"],
  }),
  createFeatureEntry({
    id: "gwiin_jaego",
    category: "gwiin",
    labelKo: "재고귀인",
    hanja: "財庫貴人",
    aliases: ["재고", "재고귀인"],
    polarity: "positive",
    topics: ["money", "work", "growth"],
    baseWeight: 4.6,
    vividness: 4.3,
    summary:
      "재물을 흘려보내기보다 저장하고 구조화하는 창고의 귀인입니다.",
    symbolicImage:
      "재고귀인은 돈의 물길 끝에 놓인 단단한 창고 이미지입니다.",
    positiveReading:
      "수입, 자산, 실물, 데이터, 고객 기반을 쌓아 두는 힘으로 나타날 수 있습니다.",
    cautionReading:
      "벌 생각만 앞서고 보관 규칙이 없으면 창고 문이 열린 상태가 될 수 있습니다.",
    practicalUse:
      "현금흐름, 저축, 투자, 자기계발 예산을 분리해 돈의 자리를 정하는 것이 좋습니다.",
    sceneSeeds: [
      "버는 방법은 빨리 보이지만 계좌 분리가 필요한 장면",
      "수입이 생긴 뒤 보관 규칙을 세워야 안정되는 장면",
    ],
    phraseSeeds: [
      "돈의 물길 끝에 놓인 단단한 창고",
      "벌이보다 보관 구조가 중요한 귀인",
      "자산의 자리를 정하는 힘",
    ],
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "gwiin_bokseong",
    category: "gwiin",
    labelKo: "복성귀인",
    hanja: "福星貴人",
    aliases: ["복성", "복성귀인"],
    polarity: "positive",
    topics: ["identity", "relationship", "environment", "growth"],
    baseWeight: 4,
    vividness: 3.8,
    summary:
      "생활 속 작은 복, 사람의 호의, 무난히 넘어가는 완충감을 보여주는 귀인입니다.",
    symbolicImage:
      "복성귀인은 길가의 그늘처럼 과열된 순간을 잠시 쉬게 하는 이미지입니다.",
    positiveReading:
      "작은 도움, 좋은 타이밍, 관계의 호의가 쌓여 부담을 낮출 수 있습니다.",
    cautionReading:
      "작은 복을 당연하게 여기면 관리와 감사의 감각이 약해질 수 있습니다.",
    practicalUse:
      "도움을 받은 일은 기록하고 갚는 루틴을 두면 관계 자산이 쌓입니다.",
    sceneSeeds: [
      "뜻밖의 작은 도움으로 일이 넘어가는 장면",
      "감사 표현 하나가 관계를 부드럽게 만드는 장면",
    ],
    phraseSeeds: [
      "길가의 그늘 같은 작은 복",
      "호의가 쌓여 부담을 낮추는 흐름",
      "관계 자산을 관리하는 귀인",
    ],
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  }),
] as const;

type CompactFeatureSeed = {
  readonly id: string;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly polarity: SajuFeaturePolarity;
  readonly topics: readonly SajuFeatureTopic[];
  readonly baseWeight: number;
  readonly vividness: number;
  readonly summary: string;
  readonly symbolicImage: string;
  readonly positiveReading: string;
  readonly cautionReading: string;
  readonly practicalUse: string;
  readonly sceneSeeds: readonly string[];
  readonly phraseSeeds: readonly string[];
  readonly mbtiBridgeNeeds?: readonly MbtiBridgeNeed[];
};

const structureSeeds = [
  {
    id: "structure_jaeda_sinyak",
    labelKo: "재다신약",
    aliases: ["재다신약"],
    polarity: "mixed",
    topics: ["money", "work", "relationship", "growth"],
    baseWeight: 4.4,
    vividness: 4,
    summary: "성과와 돈의 압박은 강하지만 자기 체력과 기준을 같이 세워야 하는 구조입니다.",
    symbolicImage: "재다신약은 큰 짐수레 앞에 선 사람이 먼저 균형을 잡아야 하는 이미지입니다.",
    positiveReading: "돈, 성과, 기회 감각이 살아나며 현실적인 목표를 빠르게 포착할 수 있습니다.",
    cautionReading: "기회가 많을수록 몸과 마음이 끌려가면 과로와 관계 피로가 생길 수 있습니다.",
    practicalUse: "벌 계획과 지킬 규칙을 분리하고, 감당할 수 있는 책임 범위를 먼저 정해야 합니다.",
    sceneSeeds: ["돈 벌 방법은 빨리 보이지만 방어 규칙이 필요한 장면"],
    phraseSeeds: ["큰 짐수레 앞에서 균형을 잡는 구조", "성과 욕구와 체력 관리가 함께 필요한 흐름"],
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  },
  {
    id: "structure_no_resource",
    labelKo: "무인성",
    aliases: ["무인성", "인성 부족"],
    polarity: "warning",
    topics: ["personality", "study", "relationship", "growth"],
    baseWeight: 4.1,
    vividness: 3.8,
    summary: "받아들이고 쉬고 기대는 힘이 약해질 수 있는 구조입니다.",
    symbolicImage: "무인성은 충전기 없이 계속 기계를 돌리는 이미지에 가깝습니다.",
    positiveReading: "스스로 해결하려는 독립성과 실행력이 강해질 수 있습니다.",
    cautionReading: "도움 요청과 회복이 늦어지면 혼자 버티다 지치는 패턴이 생길 수 있습니다.",
    practicalUse: "도움을 구할 사람, 쉬는 시간, 기록 루틴을 미리 시스템으로 넣어야 합니다.",
    sceneSeeds: ["도와달라고 말하기 전에 이미 혼자 처리한 장면"],
    phraseSeeds: ["충전기 없이 기계를 돌리는 구조", "독립성과 회복 지연이 함께 있는 흐름"],
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  },
  {
    id: "structure_no_output",
    labelKo: "무식상",
    aliases: ["무식상", "식상 부족"],
    polarity: "warning",
    topics: ["personality", "love", "relationship", "growth"],
    baseWeight: 4.1,
    vividness: 3.8,
    summary: "느낀 것을 밖으로 부드럽게 꺼내는 통로가 좁아질 수 있는 구조입니다.",
    symbolicImage: "무식상은 속에는 불빛이 있는데 창문이 작아 밖에서 잘 보이지 않는 이미지입니다.",
    positiveReading: "말보다 결과와 책임으로 보여주는 힘이 강해질 수 있습니다.",
    cautionReading: "마음이 있어도 표현이 늦거나 건조하게 보여 관계에서 오해가 생길 수 있습니다.",
    practicalUse: "칭찬, 고마움, 서운함을 짧은 문장으로라도 밖으로 꺼내는 연습이 필요합니다.",
    sceneSeeds: ["호감은 있는데 말투가 업무 보고처럼 나가는 장면"],
    phraseSeeds: ["창문이 작은 표현 구조", "마음보다 결과가 먼저 보이는 흐름"],
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    id: "structure_gwansal_mixed",
    labelKo: "관살혼잡",
    aliases: ["관살혼잡"],
    polarity: "mixed",
    topics: ["work", "relationship", "growth"],
    baseWeight: 4,
    vividness: 3.8,
    summary: "규칙과 압박, 공식 책임과 돌발 책임이 섞여 긴장감을 만드는 구조입니다.",
    symbolicImage: "관살혼잡은 두 개의 지휘 체계가 동시에 신호를 보내는 이미지입니다.",
    positiveReading: "복잡한 책임 구조 속에서도 기준을 세우는 능력이 생길 수 있습니다.",
    cautionReading: "역할 경계가 흐리면 과책임과 스트레스가 커질 수 있습니다.",
    practicalUse: "내 책임과 남의 책임을 문장으로 구분하고, 승인 체계를 분명히 하는 것이 좋습니다.",
    sceneSeeds: ["역할이 흐린 팀에서 본인이 책임을 떠안는 장면"],
    phraseSeeds: ["두 지휘 체계가 동시에 울리는 구조", "책임 경계가 중요한 흐름"],
    mbtiBridgeNeeds: ["responsibility_clarity", "autonomy_respect"],
  },
  {
    id: "structure_siksang_saengjae",
    labelKo: "식상생재",
    aliases: ["식상생재"],
    polarity: "positive",
    topics: ["work", "money", "study"],
    baseWeight: 4.3,
    vividness: 3.9,
    summary: "표현, 기술, 결과물이 돈과 기회로 이어지는 구조입니다.",
    symbolicImage: "식상생재는 손에서 나온 결과물이 시장의 물길을 만나는 이미지입니다.",
    positiveReading: "콘텐츠, 기술, 설명력, 제작물이 수익과 고객 접점으로 이어질 수 있습니다.",
    cautionReading: "결과물을 내지 않으면 기회가 머릿속에만 머물 수 있습니다.",
    practicalUse: "공부한 내용을 샘플, 포트폴리오, 제안서, 판매 단위로 바꾸는 것이 좋습니다.",
    sceneSeeds: ["배운 내용을 결과물로 만들 때 기회가 생기는 장면"],
    phraseSeeds: ["손에서 나온 결과물이 시장을 만나는 구조", "표현이 수익으로 이어지는 흐름"],
    mbtiBridgeNeeds: ["expression_support", "responsibility_clarity"],
  },
  {
    id: "structure_jaesaenggwan",
    labelKo: "재생관",
    aliases: ["재생관"],
    polarity: "positive",
    topics: ["work", "money", "environment"],
    baseWeight: 4.2,
    vividness: 3.8,
    summary: "돈과 자원이 공식 역할, 책임, 직함으로 이어지는 구조입니다.",
    symbolicImage: "재생관은 쌓은 자원이 직함과 책임의 계단으로 올라가는 이미지입니다.",
    positiveReading: "성과, 자산, 실적이 신뢰와 역할로 연결될 수 있습니다.",
    cautionReading: "돈과 책임이 함께 커지면 쉬는 기준이 늦어질 수 있습니다.",
    practicalUse: "성과를 만든 뒤 역할 범위와 보상 기준을 함께 정해야 합니다.",
    sceneSeeds: ["성과가 생기자 더 큰 책임이 따라오는 장면"],
    phraseSeeds: ["자원이 직함의 계단으로 올라가는 구조", "성과와 책임이 함께 커지는 흐름"],
    mbtiBridgeNeeds: ["responsibility_clarity", "stability"],
  },
  {
    id: "structure_salin_sangsaeng",
    labelKo: "살인상생",
    aliases: ["살인상생"],
    polarity: "mixed",
    topics: ["work", "study", "growth"],
    baseWeight: 4.2,
    vividness: 4,
    summary: "압박을 공부와 자격, 체계로 바꾸면 실력이 되는 구조입니다.",
    symbolicImage: "살인상생은 거친 바람을 풍차로 받아 전기로 바꾸는 이미지입니다.",
    positiveReading: "압박, 경쟁, 책임이 학습과 전문성으로 전환될 때 큰 힘이 됩니다.",
    cautionReading: "압박만 받고 체계화하지 않으면 불안정한 긴장으로 남을 수 있습니다.",
    practicalUse: "자격증, 전문서, 멘토링, 실전 문제로 압박을 지식 체계에 넣어야 합니다.",
    sceneSeeds: ["스트레스가 커질수록 공부 체계가 필요해지는 장면"],
    phraseSeeds: ["거친 바람을 풍차로 바꾸는 구조", "압박을 실력으로 전환하는 흐름"],
    mbtiBridgeNeeds: ["intellectual_match", "responsibility_clarity"],
  },
] as const satisfies readonly CompactFeatureSeed[];

const elementSeeds = [
  {
    id: "element_wood_excess",
    labelKo: "목 과다",
    polarity: "mixed",
    topics: ["identity", "personality", "work", "growth"],
    summary: "방향성과 성장 욕구가 강해져 한 번 정한 길을 밀고 가는 힘입니다.",
    symbolicImage: "목 과다는 숲이 빠르게 자라 길을 넓히는 이미지입니다.",
    positiveReading: "추진, 기획, 성장 감각이 빠르게 살아날 수 있습니다.",
    cautionReading: "방향이 강하면 주변 속도를 기다리는 데 에너지가 많이 들 수 있습니다.",
    practicalUse: "새 길을 열되 중간 점검과 속도 조절 장치를 넣는 것이 좋습니다.",
    mbtiBridgeNeeds: ["pace_flexibility"],
  },
  {
    id: "element_wood_missing",
    labelKo: "목 부족",
    polarity: "warning",
    topics: ["identity", "work", "study", "growth"],
    summary: "시작 방향과 성장의 첫 줄기를 잡는 데 시간이 걸릴 수 있습니다.",
    symbolicImage: "목 부족은 씨앗은 있는데 땅 위로 올라올 줄기가 늦게 보이는 이미지입니다.",
    positiveReading: "외부 목표와 멘토가 주어지면 방향을 안정적으로 잡을 수 있습니다.",
    cautionReading: "목표가 흐리면 실행력이 있어도 어디로 가야 할지 지칠 수 있습니다.",
    practicalUse: "큰 목표보다 이번 달의 한 가지 성장 방향을 먼저 정하는 것이 좋습니다.",
    mbtiBridgeNeeds: ["responsibility_clarity", "intellectual_match"],
  },
  {
    id: "element_fire_excess",
    labelKo: "화 과다",
    polarity: "mixed",
    topics: ["personality", "love", "relationship", "growth"],
    summary: "표현, 열정, 속도가 강해져 분위기를 빠르게 끌어올리는 상태입니다.",
    symbolicImage: "화 과다는 방 안의 조명이 한꺼번에 켜지는 이미지입니다.",
    positiveReading: "표현력, 주목성, 빠른 반응이 장점으로 드러날 수 있습니다.",
    cautionReading: "감정과 말이 빨라지면 상대가 따라오기 전에 과열될 수 있습니다.",
    practicalUse: "중요한 말은 한 박자 늦추고, 감정이 올라올 때 숨을 돌리는 규칙이 필요합니다.",
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  },
  {
    id: "element_fire_missing",
    labelKo: "화 부족",
    polarity: "warning",
    topics: ["personality", "love", "relationship", "growth"],
    summary: "감정 표현, 즐거움, 따뜻한 반응이 늦게 밖으로 나올 수 있는 상태입니다.",
    symbolicImage: "화 부족은 난로는 있지만 불씨가 작아 온기가 늦게 퍼지는 이미지입니다.",
    positiveReading: "차분함과 실용성이 살아나며 감정에 휩쓸리지 않는 장점이 있습니다.",
    cautionReading: "마음은 있어도 상대에게는 차갑거나 무심하게 보일 수 있습니다.",
    practicalUse: "짧은 칭찬, 감사 표현, 햇빛과 가벼운 운동으로 말의 온도를 밖으로 내야 합니다.",
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  },
  {
    id: "element_earth_excess",
    labelKo: "토 과다",
    polarity: "mixed",
    topics: ["work", "money", "family", "growth"],
    summary: "책임, 현실 감각, 보관하려는 힘이 강해지지만 부담도 쌓일 수 있습니다.",
    symbolicImage: "토 과다는 흙이 두껍게 쌓여 길과 짐을 동시에 만드는 이미지입니다.",
    positiveReading: "현실 감각, 자산 관리, 책임 처리, 구조화 능력이 살아날 수 있습니다.",
    cautionReading: "맡은 일이 계속 쌓이면 움직임이 둔해지고 마음도 무거워질 수 있습니다.",
    practicalUse: "맡을 일과 내려놓을 일을 구분하고, 돈과 일정의 자리를 분리하는 것이 좋습니다.",
    mbtiBridgeNeeds: ["pace_flexibility", "emotional_buffer"],
  },
  {
    id: "element_earth_missing",
    labelKo: "토 부족",
    polarity: "warning",
    topics: ["money", "work", "environment", "growth"],
    summary: "현실 고정력과 생활 기반을 붙잡는 힘이 약해질 수 있는 상태입니다.",
    symbolicImage: "토 부족은 기둥을 세울 땅이 아직 다져지지 않은 이미지입니다.",
    positiveReading: "새로운 환경에 유연하게 적응하는 장점이 생길 수 있습니다.",
    cautionReading: "생활 규칙, 돈 관리, 일정 고정이 흐리면 에너지가 새기 쉽습니다.",
    practicalUse: "계좌, 일정, 작업 공간을 고정해 기반을 만드는 것이 좋습니다.",
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    id: "element_metal_excess",
    labelKo: "금 과다",
    polarity: "mixed",
    topics: ["personality", "work", "relationship", "growth"],
    summary: "판단선, 절제, 기준이 강해져 정확하지만 차갑게 보일 수 있습니다.",
    symbolicImage: "금 과다는 잘 벼린 칼이 늘 가까이 놓인 이미지입니다.",
    positiveReading: "정리, 판단, 규칙, 품질 관리에서 강점이 선명합니다.",
    cautionReading: "기준이 너무 빨리 켜지면 사람보다 평가가 먼저 보일 수 있습니다.",
    practicalUse: "판단 전에 상대의 의도를 되물어 말의 온도를 맞추는 것이 좋습니다.",
    mbtiBridgeNeeds: ["warmth", "emotional_buffer"],
  },
  {
    id: "element_metal_missing",
    labelKo: "금 부족",
    polarity: "warning",
    topics: ["work", "money", "relationship", "growth"],
    summary: "마무리, 규칙, 경계선이 약해져 정리 기준을 따로 세워야 하는 상태입니다.",
    symbolicImage: "금 부족은 칼집은 있는데 칼날이 아직 다듬어지지 않은 이미지입니다.",
    positiveReading: "유연하고 부드럽게 접근하는 장점이 살아날 수 있습니다.",
    cautionReading: "거절, 마감, 기준 설정이 늦어지면 일이 흩어질 수 있습니다.",
    practicalUse: "마감일, 거절 문장, 품질 기준을 미리 적어 두는 것이 좋습니다.",
    mbtiBridgeNeeds: ["responsibility_clarity", "stability"],
  },
  {
    id: "element_water_excess",
    labelKo: "수 과다",
    polarity: "mixed",
    topics: ["personality", "study", "relationship", "growth"],
    summary: "생각, 감정, 정보가 깊어져 유연하지만 머릿속이 오래 켜질 수 있습니다.",
    symbolicImage: "수 과다는 물길이 여러 갈래로 넓어지는 이미지입니다.",
    positiveReading: "사색, 정보 수집, 유연한 판단, 감정 이해가 살아날 수 있습니다.",
    cautionReading: "생각이 길어지면 실행 타이밍을 놓치거나 감정이 축축하게 남을 수 있습니다.",
    practicalUse: "생각 시간을 정하고 몸을 움직이는 루틴으로 물길을 돌리는 것이 좋습니다.",
    mbtiBridgeNeeds: ["stability", "expression_support"],
  },
  {
    id: "element_water_missing",
    labelKo: "수 부족",
    polarity: "warning",
    topics: ["personality", "love", "relationship", "growth"],
    summary: "식히기, 회복, 감정 완충이 늦어질 수 있는 상태입니다.",
    symbolicImage: "수 부족은 엔진은 뜨거운데 냉각수가 부족한 이미지입니다.",
    positiveReading: "판단과 실행이 빠르고 감정에 오래 젖지 않는 장점이 있습니다.",
    cautionReading: "쉬어도 머리가 꺼지지 않고, 감정을 식히기 전에 해결 모드가 먼저 켜질 수 있습니다.",
    practicalUse: "밤 산책, 수면, 기록, 물가 공간처럼 생각을 식히는 루틴을 일정에 넣어야 합니다.",
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  },
] as const;

const tenGodSeeds = [
  {
    id: "ten_god_bijian",
    labelKo: "비견",
    aliases: ["비견"],
    polarity: "mixed",
    topics: ["identity", "personality", "relationship"],
    summary: "나와 같은 힘이 강해져 독립성과 자기 기준을 세우는 십성입니다.",
    symbolicImage: "비견은 옆에 선 또 다른 나의 이미지입니다.",
    positiveReading: "자존감, 독립성, 동료 의식이 살아날 수 있습니다.",
    cautionReading: "내 기준이 강해져 타협이 늦어질 수 있습니다.",
    practicalUse: "협업에서는 역할과 결정권을 미리 나누는 것이 좋습니다.",
    mbtiBridgeNeeds: ["autonomy_respect"],
  },
  {
    id: "ten_god_jie_cai",
    labelKo: "겁재",
    aliases: ["겁재"],
    polarity: "mixed",
    topics: ["money", "relationship", "growth"],
    summary: "경쟁과 분배 감각이 강해져 사람과 자원을 함께 의식하는 십성입니다.",
    symbolicImage: "겁재는 같은 판에서 몫을 두고 겨루는 사람들의 이미지입니다.",
    positiveReading: "경쟁심과 판을 읽는 감각이 살아날 수 있습니다.",
    cautionReading: "돈과 관계에서 비교와 소모가 커질 수 있습니다.",
    practicalUse: "공동 지출, 투자, 협업 규칙을 숫자로 정해 두는 것이 좋습니다.",
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    id: "ten_god_shi_shen",
    labelKo: "식신",
    aliases: ["식신"],
    polarity: "positive",
    topics: ["personality", "work", "study", "love"],
    summary: "자연스러운 표현, 생산, 먹고사는 능력과 연결되는 십성입니다.",
    symbolicImage: "식신은 손에서 꾸준히 결과물이 나오는 이미지입니다.",
    positiveReading: "꾸준한 생산성, 설명력, 안정적인 매력이 살아날 수 있습니다.",
    cautionReading: "편안함에 머물면 긴장감 있는 성장 속도가 늦어질 수 있습니다.",
    practicalUse: "작은 결과물을 반복해서 쌓아 신뢰를 만드는 방식이 좋습니다.",
    mbtiBridgeNeeds: ["expression_support", "stability"],
  },
  {
    id: "ten_god_shang_guan",
    labelKo: "상관",
    aliases: ["상관"],
    polarity: "mixed",
    topics: ["personality", "work", "relationship", "growth"],
    summary: "틀을 깨고 표현하는 힘이 강해지는 십성입니다.",
    symbolicImage: "상관은 닫힌 문에 새 창을 내는 이미지입니다.",
    positiveReading: "창의성, 문제 제기, 말과 콘텐츠의 힘이 살아날 수 있습니다.",
    cautionReading: "권위나 규칙과 부딪히면 말이 날카롭게 보일 수 있습니다.",
    practicalUse: "비판보다 개선안과 대안을 함께 제시하는 방식이 좋습니다.",
    mbtiBridgeNeeds: ["expression_support", "autonomy_respect"],
  },
  {
    id: "ten_god_pian_cai",
    labelKo: "편재",
    aliases: ["편재"],
    polarity: "positive",
    topics: ["work", "money", "relationship"],
    summary: "외부 자원, 기회, 거래, 확장 감각을 빠르게 보는 십성입니다.",
    symbolicImage: "편재는 시장의 흐름을 먼저 보는 상인의 이미지입니다.",
    positiveReading: "돈이 되는 판, 고객, 확장 기회를 빨리 포착할 수 있습니다.",
    cautionReading: "속도가 빠르면 방어 규칙 없이 자원이 새기 쉽습니다.",
    practicalUse: "수입 기회와 자산 방어 규칙을 따로 설계해야 합니다.",
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    id: "ten_god_zheng_cai",
    labelKo: "정재",
    aliases: ["정재"],
    polarity: "positive",
    topics: ["money", "work", "family"],
    summary: "정해진 돈, 현실 감각, 꾸준한 관리와 연결되는 십성입니다.",
    symbolicImage: "정재는 매일 닫고 여는 단단한 금고의 이미지입니다.",
    positiveReading: "저축, 관리, 실무, 생활 기반을 안정적으로 세울 수 있습니다.",
    cautionReading: "안정만 보다가 큰 성장 기회를 지나칠 수 있습니다.",
    practicalUse: "월별 현금흐름과 장기 자산 계획을 분리해 보는 것이 좋습니다.",
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  },
  {
    id: "ten_god_qi_sha",
    labelKo: "편관",
    aliases: ["편관", "칠살"],
    polarity: "mixed",
    topics: ["personality", "work", "growth"],
    summary: "압박, 경쟁, 위기 대응, 강한 책임감이 올라오는 십성입니다.",
    symbolicImage: "편관은 등 뒤에서 북소리가 울려 몸을 움직이게 하는 이미지입니다.",
    positiveReading: "문제가 생기면 피하기보다 처리하려는 결단력이 살아날 수 있습니다.",
    cautionReading: "긴장이 오래 가면 자신과 주변을 몰아붙이는 방식이 될 수 있습니다.",
    practicalUse: "압박을 자격, 훈련, 역할 범위로 바꾸는 장치가 필요합니다.",
    mbtiBridgeNeeds: ["responsibility_clarity", "emotional_buffer"],
  },
  {
    id: "ten_god_zheng_guan",
    labelKo: "정관",
    aliases: ["정관"],
    polarity: "positive",
    topics: ["work", "relationship", "environment"],
    summary: "공식 책임, 명예, 규칙, 신뢰를 세우는 십성입니다.",
    symbolicImage: "정관은 몸에 맞는 제복과 직함의 이미지입니다.",
    positiveReading: "역할과 기준이 분명할 때 신뢰와 평판이 쌓일 수 있습니다.",
    cautionReading: "규칙에 매이면 유연한 감정 표현이 늦어질 수 있습니다.",
    practicalUse: "역할, 권한, 평가 기준을 명확히 할수록 힘이 안정됩니다.",
    mbtiBridgeNeeds: ["responsibility_clarity", "warmth"],
  },
  {
    id: "ten_god_pian_yin",
    labelKo: "편인",
    aliases: ["편인"],
    polarity: "mixed",
    topics: ["study", "personality", "growth"],
    summary: "독특한 지식, 비정형 학습, 깊은 탐구가 살아나는 십성입니다.",
    symbolicImage: "편인은 남들이 잘 보지 않는 책장 뒤편을 여는 이미지입니다.",
    positiveReading: "전문 분야, 비주류 지식, 전략적 관찰에서 깊이가 생길 수 있습니다.",
    cautionReading: "생각이 복잡해지면 실행보다 해석이 길어질 수 있습니다.",
    practicalUse: "탐구한 내용을 실전 문제와 결과물로 연결해야 합니다.",
    mbtiBridgeNeeds: ["intellectual_match", "stability"],
  },
  {
    id: "ten_god_zheng_yin",
    labelKo: "정인",
    aliases: ["정인"],
    polarity: "positive",
    topics: ["study", "family", "growth"],
    summary: "보호, 배움, 인정, 안정적인 지식 흡수와 연결되는 십성입니다.",
    symbolicImage: "정인은 안정된 책상과 따뜻한 등받이의 이미지입니다.",
    positiveReading: "체계적 학습, 자격, 보호 자원, 신뢰 축적에 강점이 생길 수 있습니다.",
    cautionReading: "기대고 배우는 힘이 과하면 실행 타이밍이 늦어질 수 있습니다.",
    practicalUse: "배운 뒤 작은 적용을 바로 넣어 지식을 움직이게 해야 합니다.",
    mbtiBridgeNeeds: ["stability", "intellectual_match"],
  },
] as const;

function buildCompactEntry(
  seed: CompactFeatureSeed,
  category: SajuFeatureCategory,
  baseVividnessFallback: number,
): SajuFeatureEntry {
  return createFeatureEntry({
    ...seed,
    category,
    vividness: seed.vividness ?? baseVividnessFallback,
    sceneSeeds: seed.sceneSeeds,
    phraseSeeds: seed.phraseSeeds,
  });
}

const structureEntries = structureSeeds.map((seed) =>
  buildCompactEntry(seed, "structure", 3.8),
);

const elementEntries = elementSeeds.map((seed) =>
  createFeatureEntry({
    id: seed.id,
    category: "element",
    labelKo: seed.labelKo,
    aliases: [seed.labelKo],
    polarity: seed.polarity,
    topics: seed.topics,
    baseWeight: seed.polarity === "warning" ? 3.9 : 4,
    vividness: 3.8,
    summary: seed.summary,
    symbolicImage: seed.symbolicImage,
    positiveReading: seed.positiveReading,
    cautionReading: seed.cautionReading,
    practicalUse: seed.practicalUse,
    sceneSeeds: ["일상 루틴에서 오행 상태가 드러나는 장면"],
    phraseSeeds: [seed.summary, seed.symbolicImage],
    mbtiBridgeNeeds: seed.mbtiBridgeNeeds,
  }),
);

const tenGodEntries = tenGodSeeds.map((seed) =>
  createFeatureEntry({
    id: seed.id,
    category: "ten_god",
    labelKo: seed.labelKo,
    aliases: seed.aliases,
    polarity: seed.polarity,
    topics: seed.topics,
    baseWeight: seed.polarity === "positive" ? 4.1 : 4,
    vividness: 3.7,
    summary: seed.summary,
    symbolicImage: seed.symbolicImage,
    positiveReading: seed.positiveReading,
    cautionReading: seed.cautionReading,
    practicalUse: seed.practicalUse,
    sceneSeeds: ["십성의 성향이 일과 관계에서 드러나는 장면"],
    phraseSeeds: [seed.summary, seed.symbolicImage],
    mbtiBridgeNeeds: seed.mbtiBridgeNeeds,
  }),
);

const expandedTwelveSinsalEntries = [
  createFeatureEntry({
    id: "twelve_sinsal_jisal",
    category: "twelve_sinsal",
    labelKo: "지살",
    hanja: "地煞",
    aliases: ["지살"],
    polarity: "mixed",
    topics: ["work", "environment", "relationship", "growth"],
    baseWeight: 3.9,
    vividness: 3.8,
    summary:
      "지살은 생활 반경, 장소, 이동 동선과 연결되는 사회적 흐름입니다.",
    symbolicImage:
      "지살은 발밑의 길이 바뀌며 새로운 사람과 장소를 만나게 되는 이미지입니다.",
    positiveReading:
      "새로운 공간, 지역, 현장, 실무 동선에서 기회가 열릴 수 있습니다.",
    cautionReading:
      "환경 변화가 잦으면 루틴이 흐트러지고 에너지가 분산될 수 있습니다.",
    practicalUse:
      "움직이는 일일수록 기록, 일정, 짐 정리처럼 기본 루틴을 고정하는 것이 좋습니다.",
    sceneSeeds: [
      "장소가 바뀌자 사람과 일이 새로 연결되는 장면",
      "이동이 많아질수록 일정 정리가 더 중요해지는 장면",
    ],
    phraseSeeds: [
      "발밑의 길이 바뀌는 흐름",
      "장소와 동선에서 열리는 기회",
      "이동 속 루틴이 필요한 기운",
    ],
    mbtiBridgeNeeds: ["pace_flexibility", "stability"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_nyeonsal",
    category: "twelve_sinsal",
    labelKo: "년살",
    hanja: "年殺",
    aliases: ["년살", "연살"],
    polarity: "mixed",
    topics: ["identity", "love", "relationship", "environment"],
    baseWeight: 3.8,
    vividness: 4,
    summary:
      "년살은 사람 사이에서 눈길이 머무는 흐름입니다. 도화와 가까운 결로, 분위기와 인상이 관계의 입구가 되기 쉬운 신호로 봅니다.",
    symbolicImage:
      "년살은 조명이 강하지 않아도 사람들의 시선이 잠시 머무는 자리처럼 비유됩니다.",
    positiveReading:
      "잘 쓰이면 첫인상, 분위기, 스타일, 말투가 관계와 기회의 문을 여는 힘으로 드러날 수 있습니다.",
    cautionReading:
      "시선이 붙는 만큼 오해도 생기기 쉬워 보여지는 이미지와 실제 의도를 맞추는 일이 중요합니다.",
    practicalUse:
      "겉으로 드러나는 말투, 약속 태도, 스타일을 정돈하면 관계에서 불필요한 오해를 줄이고 매력을 안정적으로 쓸 수 있습니다.",
    sceneSeeds: [
      "말을 많이 하지 않았는데도 분위기 때문에 사람들이 한 번 더 보는 장면",
      "첫인상은 강했지만 실제 의도가 늦게 전달되어 오해가 생기는 장면",
      "스타일과 말투를 조금 정리했을 때 관계 반응이 달라지는 장면",
    ],
    phraseSeeds: [
      "시선이 잠시 머무는 자리",
      "분위기와 인상이 관계의 입구가 되는 흐름",
      "보여지는 이미지와 실제 의도를 맞추는 힘",
    ],
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_yukhae",
    category: "twelve_sinsal",
    labelKo: "육해살",
    hanja: "六害煞",
    aliases: ["육해", "육해살"],
    polarity: "warning",
    topics: ["relationship", "family", "environment", "growth"],
    baseWeight: 3.7,
    vividness: 3.7,
    summary:
      "육해살은 가까운 관계나 생활권 안에서 작은 방해와 피로가 생기기 쉬운 신호입니다.",
    symbolicImage:
      "육해살은 신발 안의 작은 모래알처럼 사소하지만 계속 신경 쓰이는 이미지입니다.",
    positiveReading:
      "불편한 지점을 빨리 알아차리고 관계와 생활 규칙을 정비하는 감각으로 쓸 수 있습니다.",
    cautionReading:
      "작은 불편을 넘기다 보면 가까운 사람과의 말투, 약속, 생활 리듬에서 피로가 쌓일 수 있습니다.",
    practicalUse:
      "연락 방식, 집안 역할, 일정 공유처럼 작은 규칙을 먼저 맞추는 것이 좋습니다.",
    sceneSeeds: [
      "사소한 약속 차이가 계속 피곤하게 느껴지는 장면",
      "가까운 사람과 생활 규칙을 정해야 편해지는 장면",
    ],
    phraseSeeds: [
      "신발 안의 작은 모래알 같은 불편",
      "생활권 안에서 생기는 작은 방해",
      "작은 규칙으로 피로를 낮추는 신호",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "stability"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_mangsin",
    category: "twelve_sinsal",
    labelKo: "망신살",
    hanja: "亡身煞",
    aliases: ["망신", "망신살"],
    polarity: "mixed",
    topics: ["relationship", "environment", "love", "growth"],
    baseWeight: 3.8,
    vividness: 4,
    summary:
      "망신살은 드러남과 노출이 강해지는 신호입니다. 숨긴 것이 아니라 보여지는 방식의 관리가 중요합니다.",
    symbolicImage:
      "망신살은 조명이 갑자기 켜진 무대처럼, 작은 행동도 주변 눈에 잘 들어오는 이미지입니다.",
    positiveReading:
      "대중 앞, 발표, 콘텐츠, 외부 활동에서 존재감이 살아날 수 있습니다.",
    cautionReading:
      "말과 행동이 빠르게 퍼질 수 있어 공개되는 자리에서는 표현의 선을 더 신경 써야 합니다.",
    practicalUse:
      "공개 전 한 번 더 확인하고, 보여줄 이미지와 숨길 사생활의 경계를 정하는 것이 좋습니다.",
    sceneSeeds: [
      "별생각 없이 한 말이 주변에 크게 퍼지는 장면",
      "발표나 외부 활동에서 존재감이 커지는 장면",
    ],
    phraseSeeds: [
      "갑자기 조명이 켜진 무대",
      "드러남과 노출이 커지는 흐름",
      "보여지는 방식을 관리해야 하는 기운",
    ],
    mbtiBridgeNeeds: ["warmth", "expression_support"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_cheonsal",
    category: "twelve_sinsal",
    labelKo: "천살",
    hanja: "天煞",
    aliases: ["천살"],
    polarity: "warning",
    topics: ["environment", "growth", "family", "relationship"],
    baseWeight: 3.6,
    vividness: 3.7,
    summary:
      "천살은 내 힘만으로 조절하기 어려운 큰 환경 변수를 의식하게 하는 신호입니다.",
    symbolicImage:
      "천살은 갑자기 날씨가 바뀌어 우산과 경로를 다시 챙겨야 하는 이미지입니다.",
    positiveReading:
      "큰 흐름을 읽고 준비하는 감각으로 바꾸면 위기 대응력이 좋아질 수 있습니다.",
    cautionReading:
      "모든 일을 통제하려 하면 피로가 커지므로 바꿀 수 있는 것과 없는 것을 나눠야 합니다.",
    practicalUse:
      "환경 변수 앞에서는 예비 계획, 도움 요청, 일정 완충을 먼저 마련하는 것이 좋습니다.",
    sceneSeeds: [
      "외부 변수 때문에 계획을 다시 짜야 하는 장면",
      "내가 통제할 수 없는 일과 할 수 있는 일을 나누는 장면",
    ],
    phraseSeeds: [
      "갑자기 바뀌는 날씨 같은 변수",
      "큰 환경 흐름을 읽어야 하는 신호",
      "통제보다 완충이 필요한 기운",
    ],
    mbtiBridgeNeeds: ["stability", "pace_flexibility"],
  }),
  createFeatureEntry({
    id: "twelve_sinsal_wolsal",
    category: "twelve_sinsal",
    labelKo: "월살",
    hanja: "月煞",
    aliases: ["월살"],
    polarity: "mixed",
    topics: ["personality", "relationship", "environment", "growth"],
    baseWeight: 3.7,
    vividness: 3.8,
    summary:
      "월살은 감정의 그늘과 분위기 민감도가 살아나는 신호입니다.",
    symbolicImage:
      "월살은 달빛이 비추는 그늘처럼, 밝은 말 뒤의 미묘한 표정을 보게 되는 이미지입니다.",
    positiveReading:
      "분위기 감지, 정서적 관찰, 섬세한 배려로 쓰이면 관계를 깊게 볼 수 있습니다.",
    cautionReading:
      "분위기를 너무 많이 읽으면 혼자 지치거나 상대의 의도를 과하게 해석할 수 있습니다.",
    practicalUse:
      "느낌만으로 결론내리기보다 직접 확인하는 질문을 한 번 넣는 것이 좋습니다.",
    sceneSeeds: [
      "상대 표정 하나가 오래 신경 쓰이는 장면",
      "분위기는 읽었지만 사실 확인이 필요한 장면",
    ],
    phraseSeeds: [
      "달빛이 비추는 그늘의 감각",
      "분위기 민감도가 살아나는 흐름",
      "느낌을 질문으로 확인해야 하는 신호",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  }),
] as const satisfies readonly SajuFeatureEntry[];

const expandedSinsalEntries = [
  createFeatureEntry({
    id: "sinsal_yangin",
    category: "sinsal",
    labelKo: "양인살",
    hanja: "羊刃煞",
    aliases: ["양인", "양인살"],
    polarity: "mixed",
    topics: ["personality", "work", "relationship", "growth"],
    baseWeight: 4.1,
    vividness: 4.3,
    summary:
      "양인살은 칼날처럼 자기 힘이 날카롭게 서는 신호입니다.",
    symbolicImage:
      "양인살은 손에 쥔 날카로운 도구처럼, 잘 쓰면 일을 자르고 다듬지만 거칠면 상처를 남기는 이미지입니다.",
    positiveReading:
      "강한 독립성, 결단력, 위기 대응력, 자기 방어 능력으로 살아날 수 있습니다.",
    cautionReading:
      "내 기준이 과하게 서면 말투와 행동이 상대에게 공격적으로 느껴질 수 있습니다.",
    practicalUse:
      "중요한 결정 전에는 한 번 쉬고, 공격보다 경계 설정의 언어로 바꾸는 것이 좋습니다.",
    sceneSeeds: [
      "불합리한 일을 보면 바로 선을 긋고 싶은 장면",
      "상대가 느리면 말이 짧고 세게 나가는 장면",
    ],
    phraseSeeds: [
      "손에 쥔 날카로운 도구",
      "자기 힘이 칼날처럼 서는 기운",
      "공격보다 경계 설정으로 써야 하는 힘",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "pace_flexibility"],
  }),
  createFeatureEntry({
    id: "sinsal_goegang",
    category: "sinsal",
    labelKo: "괴강살",
    hanja: "魁罡煞",
    aliases: ["괴강", "괴강살"],
    polarity: "mixed",
    topics: ["identity", "personality", "work", "growth"],
    baseWeight: 4.2,
    vividness: 4.4,
    summary:
      "괴강살은 쉽게 눌리지 않는 강한 기운입니다. 버티는 힘과 충돌성이 함께 있습니다.",
    symbolicImage:
      "괴강살은 무거운 문도 어깨로 밀고 나가는 사람의 이미지입니다.",
    positiveReading:
      "큰 압박 앞에서도 물러서지 않는 추진력, 결단력, 버티는 힘으로 나타날 수 있습니다.",
    cautionReading:
      "힘이 거칠게 나오면 고집과 충돌로 보일 수 있어 방향 조절이 중요합니다.",
    practicalUse:
      "내가 밀어붙일 일과 협상할 일을 먼저 나누면 강한 힘이 성과로 연결됩니다.",
    sceneSeeds: [
      "남들이 망설이는 일을 끝까지 밀어붙이는 장면",
      "내 기준이 너무 강해 협업 마찰이 생기는 장면",
    ],
    phraseSeeds: [
      "무거운 문도 어깨로 미는 힘",
      "쉽게 눌리지 않는 기운",
      "버티는 힘과 충돌성이 함께 있는 흐름",
    ],
    mbtiBridgeNeeds: ["pace_flexibility", "responsibility_clarity"],
  }),
  createFeatureEntry({
    id: "sinsal_gongmang",
    category: "sinsal",
    labelKo: "공망",
    hanja: "空亡",
    aliases: ["공망"],
    polarity: "mixed",
    topics: ["personality", "relationship", "environment", "growth"],
    baseWeight: 3.8,
    vividness: 4,
    summary:
      "공망은 채워진 것 같지만 비어 있는 자리, 혹은 비었기 때문에 다른 방식이 들어오는 신호입니다.",
    symbolicImage:
      "공망은 방 한가운데 비워 둔 의자처럼, 공백이 오히려 방향을 바꾸게 하는 이미지입니다.",
    positiveReading:
      "기존 틀에 묶이지 않고 새 해석, 다른 선택지, 비움의 감각을 만들 수 있습니다.",
    cautionReading:
      "중요한 기대를 한 곳에만 걸면 허전함이나 실망감이 커질 수 있습니다.",
    practicalUse:
      "결과를 하나로 고정하지 말고 대안 경로와 회복 공간을 같이 마련하는 것이 좋습니다.",
    sceneSeeds: [
      "기대했던 자리가 비어 다른 길을 찾는 장면",
      "허전함을 새 선택지로 바꿔야 하는 장면",
    ],
    phraseSeeds: [
      "방 한가운데 비워 둔 의자",
      "공백이 방향을 바꾸는 신호",
      "비움을 대안으로 바꾸는 흐름",
    ],
    mbtiBridgeNeeds: ["stability", "emotional_buffer"],
  }),
  createFeatureEntry({
    id: "sinsal_cheonmunseong",
    category: "sinsal",
    labelKo: "천문성",
    hanja: "天門星",
    aliases: ["천문", "천문성"],
    polarity: "positive",
    topics: ["study", "personality", "growth", "environment"],
    baseWeight: 4,
    vividness: 4.2,
    summary:
      "천문성은 보이지 않는 원리와 상징, 큰 흐름을 읽으려는 지적 감각입니다.",
    symbolicImage:
      "천문성은 하늘의 문이 살짝 열려 큰 구조를 엿보는 이미지입니다.",
    positiveReading:
      "철학, 기획, 패턴 분석, 직관적 통찰에서 깊이가 생길 수 있습니다.",
    cautionReading:
      "큰 의미를 찾느라 현실 실행이 늦어지면 생각만 길어질 수 있습니다.",
    practicalUse:
      "떠오른 통찰을 메모, 도식, 실행 순서로 내려야 현실에서 힘이 됩니다.",
    sceneSeeds: [
      "사건 하나에서 전체 흐름을 읽으려는 장면",
      "아이디어는 큰데 실행 순서가 필요한 장면",
    ],
    phraseSeeds: [
      "하늘의 문이 살짝 열리는 감각",
      "큰 구조를 읽는 지적 기운",
      "통찰을 실행 순서로 내려야 하는 흐름",
    ],
    mbtiBridgeNeeds: ["intellectual_match", "stability"],
  }),
  createFeatureEntry({
    id: "gwiin_mungok",
    category: "gwiin",
    labelKo: "문곡귀인",
    hanja: "文曲貴人",
    aliases: ["문곡", "문곡귀인"],
    polarity: "positive",
    topics: ["study", "work", "personality"],
    baseWeight: 4.1,
    vividness: 4,
    summary:
      "문곡귀인은 글, 말, 음악성, 표현의 결을 다듬는 지적 길신입니다.",
    symbolicImage:
      "문곡귀인은 굽이치는 물길처럼 생각을 부드러운 문장과 리듬으로 풀어내는 이미지입니다.",
    positiveReading:
      "글쓰기, 발표, 기획, 설명, 학습 정리에서 표현의 맛이 살아날 수 있습니다.",
    cautionReading:
      "표현에 머물고 마감이 늦어지면 실전 성과가 약해질 수 있습니다.",
    practicalUse:
      "아이디어를 제목, 목차, 발표 흐름, 짧은 글로 자주 꺼내는 것이 좋습니다.",
    sceneSeeds: [
      "생각을 글로 쓰면 더 선명해지는 장면",
      "발표나 설명에서 흐름을 다듬는 장면",
    ],
    phraseSeeds: [
      "굽이치는 물길 같은 문장 감각",
      "표현의 결을 다듬는 귀인",
      "생각을 말과 글로 풀어내는 힘",
    ],
    mbtiBridgeNeeds: ["intellectual_match", "expression_support"],
  }),
] as const satisfies readonly SajuFeatureEntry[];

const expandedGwiinEntries = [
  createFeatureEntry({
    id: "gwiin_geumyeorok",
    category: "gwiin",
    labelKo: "금여록",
    hanja: "金輿祿",
    aliases: ["금여", "금여록"],
    polarity: "positive",
    topics: ["identity", "money", "love", "environment"],
    baseWeight: 4.1,
    vividness: 4.1,
    summary:
      "금여록은 품격, 안정된 생활감, 좋은 대우와 연결되는 길신입니다.",
    symbolicImage:
      "금여록은 단정하게 꾸민 수레에 올라 안정된 길을 가는 이미지입니다.",
    positiveReading:
      "품위, 생활 안정, 좋은 조건, 관계에서의 대우가 살아날 수 있습니다.",
    cautionReading:
      "겉의 안정감만 좇으면 실제 실력과 생활 규칙이 비어 보일 수 있습니다.",
    practicalUse:
      "품격 있는 이미지와 실제 관리 능력을 함께 쌓아야 길신의 힘이 오래 갑니다.",
    sceneSeeds: [
      "좋은 환경과 단정한 이미지가 기회를 넓히는 장면",
      "대우받는 자리일수록 실력과 태도가 같이 필요한 장면",
    ],
    phraseSeeds: [
      "단정한 수레에 오른 안정감",
      "품격과 좋은 대우의 길신",
      "이미지와 실력을 함께 쌓는 흐름",
    ],
    mbtiBridgeNeeds: ["stability", "warmth"],
  }),
  createFeatureEntry({
    id: "gwiin_cheoneuiseong",
    category: "gwiin",
    labelKo: "천의성",
    hanja: "天醫星",
    aliases: ["천의", "천의성"],
    polarity: "positive",
    topics: ["growth", "relationship", "environment", "study"],
    baseWeight: 4,
    vividness: 3.9,
    summary:
      "천의성은 돌봄, 회복 감각, 사람을 살피는 세심함과 연결되는 길신입니다.",
    symbolicImage:
      "천의성은 흐트러진 자리를 차분히 정돈해 숨을 돌리게 하는 손길의 이미지입니다.",
    positiveReading:
      "사람의 컨디션과 필요를 알아차리고 생활을 정비하는 감각으로 나타날 수 있습니다.",
    cautionReading:
      "남을 살피느라 자기 회복을 뒤로 미루면 피로가 쌓일 수 있습니다.",
    practicalUse:
      "나와 타인의 돌봄 범위를 나누고, 회복 루틴을 생활표에 넣는 것이 좋습니다.",
    sceneSeeds: [
      "주변 사람의 상태를 먼저 알아차리는 장면",
      "남을 챙기다 자신의 쉬는 시간을 놓치는 장면",
    ],
    phraseSeeds: [
      "숨을 돌리게 하는 정돈의 손길",
      "회복 감각을 살피는 길신",
      "돌봄 범위를 나눠야 하는 흐름",
    ],
    mbtiBridgeNeeds: ["emotional_buffer", "warmth"],
  }),
  createFeatureEntry({
    id: "gwiin_amrok",
    category: "gwiin",
    labelKo: "암록",
    hanja: "暗祿",
    aliases: ["암록"],
    polarity: "positive",
    topics: ["money", "work", "environment", "growth"],
    baseWeight: 4.1,
    vividness: 4,
    summary:
      "암록은 겉으로 크게 드러나지 않아도 뒤에서 자원과 도움의 통로가 열리는 길신입니다.",
    symbolicImage:
      "암록은 어두운 창고 안에 조용히 쌓여 있는 비상 자원 같은 이미지입니다.",
    positiveReading:
      "숨은 지원, 예비 자원, 뒤늦게 드러나는 기회, 조용한 자산 흐름으로 나타날 수 있습니다.",
    cautionReading:
      "숨은 자원에만 기대면 공개된 성과와 관리 기록이 약해질 수 있습니다.",
    practicalUse:
      "보이지 않는 도움도 기록하고, 비상금과 예비 계획을 현실 구조로 만들어야 합니다.",
    sceneSeeds: [
      "조용히 준비해 둔 자원이 나중에 도움이 되는 장면",
      "드러나지 않은 인맥이나 기록이 기회를 만드는 장면",
    ],
    phraseSeeds: [
      "어두운 창고 안의 비상 자원",
      "뒤에서 열리는 도움의 통로",
      "숨은 자원을 현실 구조로 바꾸는 길신",
    ],
    mbtiBridgeNeeds: ["stability", "responsibility_clarity"],
  }),
] as const satisfies readonly SajuFeatureEntry[];

const expandedStructureEntries = [
  createFeatureEntry({
    id: "structure_sanggwan_gyeongwan",
    category: "structure",
    labelKo: "상관견관",
    aliases: ["상관견관"],
    polarity: "mixed",
    topics: ["personality", "work", "relationship", "growth"],
    baseWeight: 4,
    vividness: 3.9,
    summary:
      "상관견관은 표현과 규칙이 부딪히는 구조입니다. 문제 제기와 공식 기준 사이의 긴장이 생깁니다.",
    symbolicImage:
      "상관견관은 새 창을 내려는 사람과 문틀을 지키려는 사람이 같은 방에 있는 이미지입니다.",
    positiveReading:
      "낡은 규칙을 개선하고 더 나은 기준을 제안하는 힘으로 쓰일 수 있습니다.",
    cautionReading:
      "말이 앞서면 권위나 조직 질서와 충돌해 피로가 커질 수 있습니다.",
    practicalUse:
      "비판을 꺼낼 때는 대안, 절차, 기대 효과를 함께 제시하는 방식이 좋습니다.",
    sceneSeeds: [
      "회의에서 규칙의 허점이 먼저 보이는 장면",
      "개선안 없이 지적만 하면 분위기가 굳는 장면",
    ],
    phraseSeeds: [
      "새 창과 문틀이 같은 방에 있는 구조",
      "표현과 규칙의 긴장",
      "비판을 대안으로 바꿔야 하는 흐름",
    ],
    mbtiBridgeNeeds: ["responsibility_clarity", "warmth"],
  }),
  createFeatureEntry({
    id: "structure_bigeop_many",
    category: "structure",
    labelKo: "비겁다자",
    aliases: ["비겁다자", "비겁 과다"],
    polarity: "mixed",
    topics: ["personality", "relationship", "money", "growth"],
    baseWeight: 3.9,
    vividness: 3.7,
    summary:
      "비겁다자는 자기 힘과 경쟁 감각이 강해져 독립성과 비교심이 함께 커지는 구조입니다.",
    symbolicImage:
      "비겁다자는 같은 깃발을 든 사람들이 한 판에 많이 서 있는 이미지입니다.",
    positiveReading:
      "동료 경쟁, 독립성, 자기 주장, 버티는 힘이 살아날 수 있습니다.",
    cautionReading:
      "사람과 돈이 함께 얽히면 비교, 분배, 경쟁에서 소모가 커질 수 있습니다.",
    practicalUse:
      "공동 작업과 돈 문제는 역할, 몫, 책임 범위를 숫자와 문장으로 정해야 합니다.",
    sceneSeeds: [
      "동료와 비교되면 승부욕이 빠르게 올라오는 장면",
      "공동 지출이나 역할 분배에서 기준이 필요한 장면",
    ],
    phraseSeeds: [
      "같은 깃발을 든 사람들이 많은 판",
      "독립성과 경쟁이 함께 커지는 구조",
      "몫과 책임을 정해야 하는 흐름",
    ],
    mbtiBridgeNeeds: ["stability", "autonomy_respect"],
  }),
  createFeatureEntry({
    id: "structure_resource_many",
    category: "structure",
    labelKo: "인성다자",
    aliases: ["인성다자", "인성 과다"],
    polarity: "mixed",
    topics: ["study", "family", "relationship", "growth"],
    baseWeight: 3.9,
    vividness: 3.7,
    summary:
      "인성다자는 받아들이고 생각하고 보호받는 힘이 강해지는 구조입니다.",
    symbolicImage:
      "인성다자는 책과 담요가 많은 방처럼 편안하지만 오래 머물면 실행이 늦어지는 이미지입니다.",
    positiveReading:
      "학습, 보호, 이해력, 안정감, 깊은 준비성이 살아날 수 있습니다.",
    cautionReading:
      "생각과 준비가 길어지면 실행과 표현이 뒤로 밀릴 수 있습니다.",
    practicalUse:
      "공부와 준비 뒤에는 작은 실행 마감, 발표, 결과물 제출을 붙이는 것이 좋습니다.",
    sceneSeeds: [
      "준비는 많이 했는데 시작 버튼을 늦게 누르는 장면",
      "자료를 더 찾느라 실행이 밀리는 장면",
    ],
    phraseSeeds: [
      "책과 담요가 많은 방",
      "이해와 보호가 강한 구조",
      "준비 뒤 실행 마감이 필요한 흐름",
    ],
    mbtiBridgeNeeds: ["expression_support", "responsibility_clarity"],
  }),
] as const satisfies readonly SajuFeatureEntry[];

export const SAJU_FEATURE_TAXONOMY = [
  ...SAJU_DAY_PILLAR_FEATURES,
  ...twelveSinsalEntries,
  ...expandedTwelveSinsalEntries,
  ...sinsalEntries,
  ...expandedSinsalEntries,
  ...gwiinEntries,
  ...expandedGwiinEntries,
  ...structureEntries,
  ...expandedStructureEntries,
  ...elementEntries,
  ...tenGodEntries,
] as const satisfies readonly SajuFeatureEntry[];

export const SAJU_FEATURE_BY_ID = new Map<string, SajuFeatureEntry>(
  SAJU_FEATURE_TAXONOMY.map((entry) => [entry.id, entry]),
);

export function getSajuFeatureEntry(featureId: string): SajuFeatureEntry | undefined {
  return SAJU_FEATURE_BY_ID.get(featureId);
}

export function requireSajuFeatureEntry(featureId: string): SajuFeatureEntry {
  const entry = getSajuFeatureEntry(featureId);

  if (entry === undefined) {
    throw new Error(`Unknown Saju feature id: ${featureId}`);
  }

  return entry;
}

export function findSajuFeatureByLabelOrAlias(
  labelOrAlias: string,
): SajuFeatureEntry | undefined {
  return SAJU_FEATURE_TAXONOMY.find(
    (entry) =>
      entry.labelKo === labelOrAlias || entry.aliases.includes(labelOrAlias),
  );
}

const UNSAFE_TAXONOMY_PHRASES = [
  "100%",
  "반드시",
  "무조건",
  "운명 확정",
  "미래 확정",
  "수익 보장",
  "치료",
  "진단",
] as const;

export type SajuFeatureCopySafetyViolation = {
  readonly featureId: string;
  readonly term: string;
  readonly field: string;
};

function collectFeatureCopyFields(
  entry: SajuFeatureEntry,
): readonly { readonly field: string; readonly value: string }[] {
  return [
    { field: "summary", value: entry.summary },
    { field: "symbolicImage", value: entry.symbolicImage },
    { field: "positiveReading", value: entry.positiveReading },
    { field: "cautionReading", value: entry.cautionReading },
    { field: "practicalUse", value: entry.practicalUse },
    ...entry.sceneSeeds.map((value) => ({ field: "sceneSeeds", value })),
    ...entry.phraseSeeds.map((value) => ({ field: "phraseSeeds", value })),
  ];
}

export function findUnsafeSajuFeatureSeedClaims(): readonly SajuFeatureCopySafetyViolation[] {
  const violations: SajuFeatureCopySafetyViolation[] = [];

  for (const entry of SAJU_FEATURE_TAXONOMY) {
    for (const { field, value } of collectFeatureCopyFields(entry)) {
      for (const term of UNSAFE_TAXONOMY_PHRASES) {
        if (value.includes(term)) {
          violations.push({
            featureId: entry.id,
            term,
            field,
          });
        }
      }
    }
  }

  return violations;
}
