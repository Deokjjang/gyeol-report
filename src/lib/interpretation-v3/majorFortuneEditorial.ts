import type { MajorFortuneReportDraft } from "../report-generation/majorFortuneReportDraftTypes";
import type { MajorDecadeYear } from "../report-knowledge/majorFortuneDecadeReading";
import type { FiveElement } from "../report-knowledge/annualFortuneTypes";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { USER_LIFE_STATUS_LABELS, USER_RELATIONSHIP_STATUS_LABELS } from "../report-knowledge/userContextTypes";
import { careerWorkArena, interpretCareerContextV3 } from "./careerContextV3";
import type { MajorHorizon } from "./majorFortuneHorizon";
import type { NarrativeAudit } from "./mbtiNarrative";

export const LEGACY_MAJOR_FORTUNE_V3_VERSION = "major_fortune_v3.0-editorial.1";
export const MAJOR_FORTUNE_V3_VERSION = "major_fortune_v3.0-editorial.2";

export type MajorFortuneV3Section = { readonly id: string; readonly title: string; readonly mode: "portrait" | "scene" | "good-fortune" | "contrast" | "strategy" | "finale"; readonly paragraphs: readonly string[]; readonly evidence: readonly string[] };
export type MajorFortuneV3Year = { readonly year: number; readonly ageLabel: string | null; readonly ganji: string; readonly tenGod: string; readonly phase: "early" | "middle" | "late"; readonly importance: "important" | "standard" | "quiet"; readonly isCurrentYear: boolean; readonly timePosition?: "past" | "current" | "future"; readonly title: string; readonly paragraphs: readonly string[]; readonly evidence: readonly string[] };
export type MajorFortuneV3Signal = { readonly tone: "growth" | "fortune" | "caution" | "transition" | "preview"; readonly title: string; readonly body: string; readonly evidence: readonly string[] };
export type MajorFortuneV3Draft = Omit<MajorFortuneReportDraft, "version" | "productVersion"> & {
  readonly version: typeof MAJOR_FORTUNE_V3_VERSION | typeof LEGACY_MAJOR_FORTUNE_V3_VERSION | "major_fortune_v3.0-editorial.3" | "major_fortune_v3.0-editorial.4" | "major_fortune_v3.0-editorial.5"; readonly productVersion: "v3";
  readonly horizon?: MajorHorizon; readonly narrativeEdition?: "mbti-library-1" | "mbti-library-2"; readonly narrativeAudit?: readonly NarrativeAudit[]; readonly rhythmWarnings?: readonly string[];
  readonly title: string; readonly inputSummary: readonly { readonly label: string; readonly value: string }[]; readonly chapterTitle: string; readonly opening: readonly string[];
  readonly fortuneSignals?: readonly MajorFortuneV3Signal[]; readonly editorialSections: readonly MajorFortuneV3Section[]; readonly editorialYears: readonly MajorFortuneV3Year[]; readonly nextChapter: readonly string[]; readonly finale: readonly string[];
  readonly editorialAudit: { readonly yearCount: 10 | 14; readonly currentYear: number; readonly importantYears: readonly number[]; readonly sourceVersion: "major-decade-v2" };
};

export function isMajorFortuneV3Draft(value: unknown): value is MajorFortuneV3Draft {
  return !!value && typeof value === "object" && "version" in value && (value.version === MAJOR_FORTUNE_V3_VERSION || value.version === LEGACY_MAJOR_FORTUNE_V3_VERSION || value.version === "major_fortune_v3.0-editorial.3" || value.version === "major_fortune_v3.0-editorial.4" || value.version === "major_fortune_v3.0-editorial.5") && "productType" in value && value.productType === "major_fortune" && "productVersion" in value && value.productVersion === "v3";
}
export function isDeepMajorFortuneV3Draft(value: MajorFortuneV3Draft): boolean { return value.version === MAJOR_FORTUNE_V3_VERSION; }

const tenGodVoice: Readonly<Record<string, { gift: string; scene: string; caution: string; money: string; relation: string; learning: string }>> = {
  비견: { gift: "내 이름으로 판단하고 끝내는 힘", scene: "남의 기준보다 내가 납득할 방식을 먼저 세웁니다", caution: "내 기준이 분명해질수록 다른 방식까지 경쟁으로 받아들이기 쉽습니다", money: "내 돈과 함께 책임질 돈의 선을 그을수록 안정됩니다", relation: "가까워도 각자의 선택권을 지키는 관계가 오래갑니다", learning: "혼자 끝까지 풀어 본 경험이 자기만의 방법이 됩니다" },
  겁재: { gift: "사람과 자원을 움직여 큰 판을 만드는 힘", scene: "혼자보다 함께할 때 속도가 붙지만 ‘왜 마무리는 또 내 몫이지?’가 떠오르기도 합니다", caution: "호의와 책임의 경계가 흐려지면 기여만 커지고 몫은 모호해집니다", money: "공동 비용은 금액보다 책임자를 먼저 정해야 남습니다", relation: "의리로 시작한 약속이 당연한 의무가 되지 않게 선을 봅니다", learning: "경쟁자가 생기면 관심 없던 분야에도 갑자기 승부욕이 붙습니다" },
  식신: { gift: "좋아하는 것을 꾸준한 결과로 바꾸는 힘", scene: "한 번 반짝이는 성과보다 다시 꺼내 쓸 결과를 차곡차곡 남깁니다", caution: "재미있는 일을 늘리다 보면 체력과 마감이 뒤늦게 따라옵니다", money: "만든 것의 가치와 실제 수입 구조를 연결할 때 축적이 생깁니다", relation: "말보다 시간을 쓰고 챙기는 행동으로 마음을 보여줍니다", learning: "직접 만들고 설명해 볼 때 이해가 가장 오래 남습니다" },
  상관: { gift: "낡은 방식을 보고 더 나은 답을 꺼내는 힘", scene: "회의가 길어지면 속으로 ‘그래서 바꿀 건 뭔데?’가 먼저 뜹니다", caution: "정확한 말도 상대에게는 평가표처럼 들릴 수 있습니다", money: "새 방식의 기대 이익만큼 바꾸는 비용도 함께 봐야 합니다", relation: "맞는 말보다 받아들일 수 있는 말의 순서가 중요합니다", learning: "당연하다는 설명보다 직접 반례를 찾을 때 실력이 자랍니다" },
  편재: { gift: "밖에서 기회와 사람을 연결하는 힘", scene: "고객·모임·이동처럼 바깥 접점에서 선택지가 늘어납니다", caution: "제안이 많다는 사실을 이미 확보한 성과로 착각하기 쉽습니다", money: "거래 규모보다 회수일과 감당할 손실을 먼저 보면 재물운이 남습니다", relation: "새 인연이 늘 때 기존 관계에 쓸 시간까지 약속하지 않습니다", learning: "사람과 현장에서 얻은 정보가 책보다 빠른 힌트가 됩니다" },
  정재: { gift: "돈과 생활을 오래 가는 구조로 만드는 힘", scene: "화려한 한 번보다 매달 반복되는 수입과 지출의 균형을 봅니다", caution: "안정시키려는 마음이 모든 변수를 통제하려는 태도로 바뀔 수 있습니다", money: "작은 금액도 누적으로 보며 축적의 속도를 만듭니다", relation: "약속을 꾸준히 지키는 방식으로 신뢰를 쌓습니다", learning: "익힌 것을 일정과 습관에 넣었을 때 진짜 내 것이 됩니다" },
  편관: { gift: "압박이 올 때 앞에 서서 결론을 내는 힘", scene: "다들 우물쭈물하는 순간 결국 내가 정리하고 있는 장면이 많아집니다", caution: "견딜 수 있다는 이유로 권한 없는 책임까지 받으면 유능함이 소모됩니다", money: "급한 결정일수록 최대 손실과 중단 조건을 먼저 잠가야 합니다", relation: "도와주려는 주도성이 지시처럼 들리지 않게 선택 공간을 남깁니다", learning: "실전의 압박 속에서 무엇이 핵심인지 빠르게 배웁니다" },
  정관: { gift: "신뢰받는 자리와 기준을 만드는 힘", scene: "대충 넘어갈 일과 반드시 지킬 선을 구분해 중심을 잡습니다", caution: "바른 답을 지키느라 현실의 예외와 내 회복을 뒤로 미루기 쉽습니다", money: "계약과 정산 기준이 분명할수록 꾸준한 보상이 따라옵니다", relation: "말과 행동이 맞는 사람에게 마음이 놓이고 약속의 무게를 크게 봅니다", learning: "검증된 체계와 좋은 선생을 만나면 성장 속도가 붙습니다" },
  편인: { gift: "남들이 지나친 단서를 자기 방식으로 연결하는 힘", scene: "한번 꽂힌 질문은 혼자 있을 때도 계속 돌아가며 예상 밖의 답을 찾습니다", caution: "생각의 갈래가 늘어날수록 시작보다 재검토가 길어질 수 있습니다", money: "흥미로운 가능성과 생활을 버틸 수입을 따로 봐야 합니다", relation: "혼자 정리할 시간이 필요하다고 마음까지 멀어진 것은 아닙니다", learning: "낯선 분야를 자기 언어로 다시 엮을 때 독창성이 생깁니다" },
  정인: { gift: "배운 것을 자기 기반으로 쌓는 힘", scene: "설명과 기록으로 흩어진 경험을 다시 쓸 지식으로 만듭니다", caution: "준비가 충분해야 움직인다는 생각 때문에 이미 할 수 있는 일도 늦게 꺼냅니다", money: "자격·기술·문서처럼 오래 남는 자산에 쓰는 돈의 의미가 커집니다", relation: "잘 듣고 기억하는 방식으로 상대에게 안정감을 줍니다", learning: "배운 것을 정리해 누군가에게 설명할 때 전문성이 또렷해집니다" },
};
const mbtiVoice: Readonly<Record<string, string>> = {
  ENTJ: "결론이 보이면 역할과 순서를 먼저 세우는 ENTJ의 속도", ENTP: "가능성을 보면 다른 조합부터 시험하는 ENTP의 호기심", ENFJ: "사람의 반응과 전체 방향을 함께 살피는 ENFJ의 조율", ENFP: "의미가 붙는 순간 에너지가 크게 살아나는 ENFP의 확장성",
  ESTJ: "기준과 마감을 현실에 고정하는 ESTJ의 추진", ESTP: "상황이 움직일 때 바로 감각을 잡는 ESTP의 대응", ESFJ: "주변의 필요를 빠르게 알아채는 ESFJ의 생활 감각", ESFP: "사람과 현장의 온도를 높이는 ESFP의 표현",
  INTJ: "멀리 보고 구조를 다시 설계하는 INTJ의 집중", INTP: "당연해 보이는 전제를 다시 묻는 INTP의 탐구", INFJ: "겉말 뒤의 흐름을 오래 읽는 INFJ의 통찰", INFP: "자기 가치와 맞는지 끝까지 확인하는 INFP의 진심",
  ISTJ: "쌓인 기록과 약속을 정확히 지키는 ISTJ의 신뢰", ISTP: "복잡한 문제에서 핵심 작동 원리를 찾는 ISTP의 실용", ISFJ: "작은 변화와 필요한 돌봄을 기억하는 ISFJ의 세심함", ISFP: "자기 감각을 해치지 않는 방식으로 움직이는 ISFP의 온도",
};
const elementKo: Readonly<Record<FiveElement, string>> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
function voiceFor(tenGod: string) { return tenGodVoice[tenGod] ?? tenGodVoice.비견; }

function careerScenes(packet: MajorFortuneEvidencePacket): readonly string[] {
  const context = packet.userContext, work = interpretCareerContextV3(context.fieldLabel ?? ""), arena = careerWorkArena(context, work);
  if (work.salesIntensity === "high") return [
    `고객 미팅에서는 질문 하나로 진짜 요구와 듣기 좋은 요청을 가르는 눈이 중요해집니다. ${arena.people}의 표정이 바뀌는 순간도 숫자만큼 큰 정보입니다.`,
    "제안과 협상에서는 많이 약속하는 사람보다 무엇까지 해낼 수 있는지 선명하게 말하는 사람이 오래 갑니다. 조건보다 서로의 기대를 맞춘 순간이 다음 거래를 만듭니다.",
    "계약이 막힌 순간에는 밀어붙일지 멈출지보다 어디서 신뢰가 끊겼는지를 먼저 보게 됩니다. 가격·일정·결정권자 중 진짜 걸림돌을 찾는 판단이 실적을 바꿉니다.",
    "제품팀과 조율할 때는 고객의 목소리를 그대로 옮기는 것보다 왜 중요한 요구인지 번역하는 힘이 커집니다. 밖의 약속과 안의 실행 사이를 연결하는 사람이 결국 판을 이해합니다.",
    "실적이 좋은 동료를 보면 축하보다 ‘무엇이 달랐지?’가 먼저 뜰 수 있습니다. 비교가 조급함이 아니라 새로운 방식을 배우는 경쟁심으로 쓰이면 성장 속도가 붙습니다.",
    "보고와 분석에서는 숫자를 예쁘게 정리하는 것보다 다음 행동을 바꾸는 한 줄이 중요해집니다. 파이프라인이 많아 보여도 실제로 움직이는 기회가 어디인지 말할 수 있어야 합니다.",
    "평가와 보상에서는 바빴다는 말보다 고객·팀·매출에 남긴 차이를 보여줘야 합니다. 내가 쉽게 해낸 일이 조직에도 쉬운 일이었다고 오해받지 않게 이름을 붙이는 시기입니다.",
    "이직 공고를 볼 때 직함보다 어떤 고객, 어떤 제품, 어떤 결정권을 맡는지가 눈에 들어옵니다. 더 큰 회사보다 내 판단의 범위가 넓어지는 자리가 다음 선택이 될 수 있습니다.",
    "후배나 동료에게 설명하다 보면 감으로 하던 일을 구조로 만들게 됩니다. 혼자 잘하는 사람에서 다른 사람도 성과를 내게 하는 사람으로 역할이 달라집니다.",
    "시장과 목표가 어긋날 때 무작정 숫자를 더 채우기보다 목표 자체가 현실을 반영하는지 묻게 됩니다. 판을 읽는 힘은 열심히 하는 것과 다른 종류의 실력입니다.",
  ];
  const statusScenes: Readonly<Record<string, readonly string[]>> = {
    business_owner: ["고객이 늘수록 대표가 직접 챙겨야 할 일과 운영에 넘길 일이 갈립니다.", "매출이 커졌는데 남는 돈과 시간이 줄었다면 성장보다 구조를 먼저 보게 됩니다.", "가격을 올리는 일보다 누구에게 어떤 가치를 팔고 있는지 말하는 일이 더 중요해집니다."],
    freelancer: ["새 의뢰가 들어오는 기쁨과 수정 범위가 끝없이 늘어나는 피로는 함께 옵니다.", "단가를 말할 때 작업 시간뿐 아니라 판단과 전문성의 값까지 포함해야 합니다.", "한 번의 큰 고객보다 좋은 조건으로 다시 찾는 고객이 생활의 안정감을 만듭니다."],
    student: ["수업에서 이해한 것과 혼자 결과를 만들어 본 것은 다르게 남습니다.", "성적 좋은 친구를 보면 관심 없던 분야에도 갑자기 승부욕이 붙을 수 있습니다.", "작은 프로젝트 하나가 전공 이름보다 내가 오래 파고들 문제를 먼저 보여줍니다."],
    exam_certificate: ["진도를 많이 나간 날보다 틀린 이유를 정확히 안 날이 오래 남습니다.", "시험이 가까울수록 새로운 자료보다 이미 본 것을 내 언어로 정리하는 힘이 필요합니다.", "합격 이후 어디에 쓸 자격인지까지 보이면 공부의 리듬이 달라집니다."],
    job_seeker: ["공고의 멋진 직무명보다 실제 하루에 풀 문제가 무엇인지 보게 됩니다.", "면접에서는 잘할 수 있다는 말보다 비슷한 문제를 어떻게 풀었는지가 힘을 얻습니다.", "첫 선택의 완벽함보다 배울 사람과 결과를 남길 기회가 있는지가 중요합니다."],
    resting: ["멈춰 있는 것처럼 보여도 회복 뒤 다시 맡고 싶은 문제는 조금씩 선명해집니다.", "생활 리듬을 되찾는 일도 다음 역할을 버틸 기반을 만드는 과정입니다.", "작은 일을 다시 끝내 본 감각이 자신감을 생각보다 빨리 돌려놓습니다."],
    employee: [`${arena.start}, 본인은 이미 머릿속에서 순서를 정리하고 있을 수 있습니다.`, `${arena.pinch}, 어느 순간 ‘왜 이것도 내 일이 됐지?’가 떠오를 수 있습니다.`, `${withKoreanParticle(arena.praise, "subject")} 다음 평가에서 가장 힘 있는 문장이 됩니다.`],
    other: [`${arena.start}, 지금 가장 많이 쓰는 능력이 드러납니다.`, `${arena.pinch}, 맡을 범위와 멈출 선이 보입니다.`, `${withKoreanParticle(arena.praise, "subject")} 다음 역할의 단서가 됩니다.`],
  };
  const base = statusScenes[context.lifeStatus] ?? statusScenes.other;
  return [base[0], `일의 시작점인 ${arena.stage}에서 무엇을 먼저 보는지가 실력을 보여줍니다.`, base[1], `${arena.people} 사이에서 서로 다른 기준을 맞추는 사람이 됩니다.`, `${withKoreanParticle(arena.output, "object")} 끝내는 속도보다 왜 그렇게 판단했는지 설명하는 힘이 커집니다.`, `${withKoreanParticle(arena.measure, "subject")} 좋아졌을 때 그 공을 우연이나 팀 분위기로 넘기지 않고 자기 기여를 말할 필요가 있습니다.`, base[2], `${withKoreanParticle(arena.growth, "subject")} 눈앞의 다음 질문으로 올라옵니다.`, `${withKoreanParticle(arena.learning, "object")} 기록하면 흩어진 경험이 다시 쓸 수 있는 전문성이 됩니다.`, `${withKoreanParticle(arena.next, "subject")} 다음 자리를 고르는 현실적인 기준이 됩니다.`];
}

function relationshipScene(packet: MajorFortuneEvidencePacket, voice: ReturnType<typeof voiceFor>): string {
  const status = packet.userContext.relationshipStatus ?? "unknown";
  if (status === "married") return `기혼인 지금은 사랑의 말보다 돈·집안일·가족 일정·혼자 쉬는 시간을 어떻게 나누는지가 관계의 체감을 만듭니다. ${voice.relation}.`;
  if (status === "dating") return `연애 중이라면 바쁜 시기에 답장과 약속이 어떻게 달라지는지에서 이 흐름이 먼저 보입니다. ${voice.relation}.`;
  if (status === "single") return `솔로인 지금은 만남의 수보다 내 생활 리듬을 존중하면서도 새로운 장면을 열어주는 사람에게 관심이 붙기 쉽습니다. ${voice.relation}.`;
  return `관계의 이름을 정하지 않았더라도 시간·책임·거리의 기준을 나누는 장면에서 이 흐름이 드러납니다. ${voice.relation}.`;
}
function loveLifeScene(packet: MajorFortuneEvidencePacket): string {
  const status = packet.userContext.relationshipStatus ?? "unknown";
  if (status === "married") return "같이 사는 사이에서는 냉장고를 채우는 방식, 가족 일정을 잡는 순서, 혼자 쉬어야 하는 시간을 존중하는지가 사랑의 온도를 만듭니다.";
  if (status === "dating") return "연애 중에는 일이 커질수록 만나는 횟수보다 약속을 바꿀 때 어떻게 설명하는지가 중요해집니다. 바쁜 이유를 말하는 것과 상대가 기다린 시간을 알아주는 것은 다른 표현입니다.";
  if (status === "single") return "솔로일 때는 쉽게 맞춰주는 사람보다 자기 생활을 잘 꾸리면서도 새로운 세계를 보여주는 사람에게 눈이 갑니다. 유난히 기억나는 말이 있다면 마음은 이미 조금 움직인 뒤일 수 있습니다.";
  return "관계의 이름을 정하지 않았더라도 누군가에게 시간을 내고 약속을 지키는 방식에서 마음의 우선순위가 드러납니다.";
}
function goodFortune(packet: MajorFortuneEvidencePacket): { title: string; body: string; evidence: string[] } {
  const labels = packet.natalLabels, match = (pattern: RegExp) => labels.find(label => pattern.test(label));
  if (match(/천을|천덕/)) return { title: "사람복이 커리어 자원이 되는 10년", body: "막힌 순간에 정확한 조언을 주거나 문을 연결해 주는 귀인의 좋은 패가 있습니다. 모든 것을 혼자 증명해야 하는 사람이 아닙니다.", evidence: [match(/천을|천덕/)!] };
  if (match(/장성|반안/)) return { title: "자리와 명예운이 커지는 좋은 패", body: "앞에 서서 기준을 잡거나 자기 이름으로 역할을 맡을수록 존재감이 살아납니다. 실무량보다 결정의 무게가 커지는 쪽에서 운이 붙습니다.", evidence: [match(/장성|반안/)!] };
  if (match(/재고/)) return { title: "재물과 경험을 창고처럼 쌓는 복", body: "돈만이 아니라 고객·기술·경험·기록을 쌓아 다음 시작을 가볍게 만드는 축적의 좋은 패가 있습니다.", evidence: [match(/재고/)!] };
  if (match(/문창|학당/)) return { title: "배운 것을 꺼낼수록 커지는 학습운", body: "알고 있는 것을 말·글·결과물로 남길 때 전문성이 또렷해지는 좋은 패가 있습니다.", evidence: [match(/문창|학당/)!] };
  if (match(/역마/)) return { title: "이동과 바깥 접점에서 열리는 기회운", body: "외부 프로젝트·새 모임·이동처럼 익숙한 경계를 벗어날 때 연결이 늘어나는 좋은 흐름이 있습니다.", evidence: [match(/역마/)!] };
  return { title: "결과를 오래 남기는 것이 이번 10년의 복", body: `${voiceFor(packet.majorTenGod.stemTenGod).gift}이 중심 자원입니다. 이미 잘해 온 방식을 더 큰 역할과 오래 남는 결과로 연결할수록 운이 살아납니다.`, evidence: [`${packet.currentCycle.ganji} · ${packet.majorTenGod.stemTenGod}`] };
}
function compactEvidence(year: MajorDecadeYear): string[] { return [`${year.ganji} · ${year.tenGod}`, ...[...year.cycleRelations, ...year.natalRelations].slice(0, 2).map(r => `${r.branches.join("")} ${r.type}`)]; }

const yearHeadlineByGod: Readonly<Record<string, readonly [string, string]>> = {
  비견: ["남의 속도보다 내 기준이 먼저 섭니다", "혼자 끝낼 일과 함께할 일이 갈립니다"], 겁재: ["사람이 늘수록 몫과 책임도 선명해집니다", "함께 키운 판에서 내 기여를 지킵니다"], 식신: ["쌓아둔 결과가 다음 기회를 부릅니다", "꾸준히 만든 것이 내 이름으로 남습니다"], 상관: ["잘하던 방식을 한 번 뒤집어 봅니다", "맞는 말보다 바뀐 결과가 힘을 얻습니다"], 편재: ["밖에서 사람과 돈의 선택지가 들어옵니다", "판은 넓어지고 고를 기준은 더 중요해집니다"], 정재: ["돈과 생활이 오래 가는 구조를 찾습니다", "화려함보다 남는 숫자가 또렷해집니다"], 편관: ["압박 속에서 누가 결정할지가 보입니다", "책임은 커지고 권한의 값도 선명해집니다"], 정관: ["내 이름으로 맡을 자리와 기준이 커집니다", "신뢰가 역할과 인정으로 이어집니다"], 편인: ["한번 멈춰 본 생각이 새 방향을 엽니다", "혼자 파고든 질문이 다음 선택을 만듭니다"], 정인: ["배운 것이 기반과 문서로 남습니다", "경험을 정리해 다음 역할의 자산으로 만듭니다"],
};
function timePosition(packet: MajorFortuneEvidencePacket, year: number): "past" | "current" | "future" { return year < packet.currentYear ? "past" : year === packet.currentYear ? "current" : "future"; }
function yearTitle(packet: MajorFortuneEvidencePacket, year: MajorDecadeYear, index: number): string { const position = timePosition(packet, year.year), headline = yearHeadlineByGod[year.tenGod]?.[index % 2] ?? year.focus; return position === "current" ? `${year.year}, 지금 ${headline}` : position === "past" ? `${year.year}, 돌아보면 ${headline}` : `${year.year}, 앞으로 ${headline}`; }
function yearLifeParagraph(packet: MajorFortuneEvidencePacket, year: MajorDecadeYear, index: number): string {
  const voice = voiceFor(year.tenGod), status = packet.userContext.relationshipStatus ?? "unknown";
  switch (index % 5) {
    case 0: return `${voice.money}. 이때의 돈은 액수만이 아니라 내 시간·기술·관계 중 무엇이 다음에도 남았는지를 함께 봐야 체감이 맞습니다.`;
    case 1: return `${voice.relation}. 친구나 동료가 많아지는 것보다 거절해도 흔들리지 않는 몇 사람을 알아보는 눈이 더 중요해집니다.`;
    case 2: return status === "single" ? "사람풀이 넓어지면 자기 생활이 단단한 사람에게 관심이 붙기 쉽습니다. 일과 돈에 정신이 팔린 척해도 유난히 기억나는 말이 있다면 마음은 이미 반응한 뒤일 수 있습니다." : status === "dating" ? "연애에서는 바쁠수록 만나는 횟수보다 약속을 바꾸는 태도가 더 크게 남습니다. 상대는 기다린 시간을 알아주는 말을 원할 수 있습니다." : status === "married" ? "기혼이라면 돈·집안일·가족 일정·혼자 쉬는 시간의 배분이 사랑의 온도를 만듭니다. 매일 반복되는 작은 역할에서 관계운이 체감됩니다." : "가까운 사이에서는 마음보다 시간과 책임을 어떻게 나누는지가 관계의 온도를 만듭니다.";
    case 3: return `${voice.learning}. 자격이나 공부의 이름보다 실제 문제에 써본 흔적이 남으면 다음 역할에서 바로 꺼내 쓸 자산이 됩니다.`;
    default: return "익숙한 자리를 벗어나 다른 사람의 방식과 시장을 볼수록 선택지가 늘어납니다. 이동 자체보다 그곳에서 만난 질문이 다음 방향을 바꿉니다.";
  }
}
function buildYear(packet: MajorFortuneEvidencePacket, year: MajorDecadeYear, index: number, workScenes: readonly string[]): MajorFortuneV3Year {
  const row = packet.majorFortuneTimelineRows.find(item => item.year === year.year), voice = voiceFor(year.tenGod), position = timePosition(packet, year.year), mbti = packet.personContext.mbtiType?.trim() || "", mbtiBehavior = mbtiVoice[mbti];
  const first = position === "past" ? `돌아보면 ${year.year}년에는 ${voice.gift}이 평소보다 앞에 나왔을 수 있습니다. 유난히 내가 기준을 잡거나 결과를 남긴 장면이 있었다면 그해의 주제가 생활에 닿은 모습입니다.` : position === "current" ? `지금 ${year.year}년에 가장 크게 작동하는 것은 ${voice.gift}입니다. ${voice.scene}. 올해는 이미 해온 일의 값을 다시 묻게 되는 현재진행형의 해입니다.` : `앞으로 ${year.year}년에는 ${voice.gift}이 새 질문으로 들어옵니다. ${voice.scene}. 지금 쌓아 둔 결과를 다음 대운에 무엇으로 넘길지 고르는 전환점입니다.`;
  const work = position === "past" ? `그해의 일 장면을 돌아보면, ${workScenes[index]}` : position === "current" ? `지금 일의 장면에서는 ${workScenes[index]}` : `앞으로 일의 장면에서는 ${workScenes[index]}`;
  const fourth = year.importance === "important" ? `이 해는 10년의 곡선에서 특히 힘이 붙는 해입니다. ${year.tenGod}의 장점이 일·돈·사람 중 한 축에서 분명하게 보일 수 있으니 우연처럼 지나간 성과도 내 자산으로 남길 만합니다.` : mbtiBehavior ? `${withKoreanParticle(mbtiBehavior, "subject")} 이 흐름에 섞입니다. 같은 ${year.tenGod}의 해라도 ${mbti}인 ${packet.personLabel}님은 자기 방식의 판단과 행동으로 옮길 때 체감이 선명해집니다.` : `${voice.caution}. 좋은 힘을 더 세게 쓰는 것보다 어디까지가 내 몫인지 알아보는 순간 피로가 실력으로 바뀝니다.`;
  return { year: year.year, ageLabel: row?.ageLabel ?? null, ganji: year.ganji, tenGod: year.tenGod, phase: index < 3 ? "early" : index < 7 ? "middle" : "late", importance: year.importance, isCurrentYear: position === "current", timePosition: position, title: yearTitle(packet, year, index), paragraphs: [first, work, yearLifeParagraph(packet, year, index), fourth], evidence: compactEvidence(year) };
}
function buildFortuneSignals(packet: MajorFortuneEvidencePacket, good: ReturnType<typeof goodFortune>, main: ReturnType<typeof voiceFor>): readonly MajorFortuneV3Signal[] {
  return [
    { tone: "growth", title: "결과가 쌓이는 10년", body: `${main.gift}을 한 번의 성과가 아니라 다시 꺼내 쓸 결과로 남기는 흐름입니다.`, evidence: [`${packet.currentCycle.ganji} · ${packet.majorTenGod.stemTenGod}`] },
    { tone: "fortune", title: good.title, body: good.body, evidence: good.evidence },
    { tone: "caution", title: "돈보다 관리할 것이 먼저 늘 수 있습니다", body: `${main.money}. 기회가 커질수록 시간·책임·현금의 회수 기준까지 함께 봅니다.`, evidence: [`${packet.majorTenGod.stemTenGod} · 현실 자원`] },
    { tone: "transition", title: "이전 대운과 달라진 점", body: packet.previousCycle ? `${packet.previousCycle.ganji}에서 ${packet.currentCycle.ganji}로 넘어오며 시작 자체보다 무엇을 내 결과로 남길지가 더 중요해졌습니다.` : "첫 대운 구간이라 지금 쌓이는 변화에 집중합니다.", evidence: [packet.previousCycle ? `${packet.previousCycle.ganji} → ${packet.currentCycle.ganji}` : packet.currentCycle.ganji] },
    { tone: "preview", title: "다음 장을 여는 것은 지금 남긴 것", body: packet.nextCycle ? `${packet.nextCycle.startYear}년부터 ${packet.nextCycle.ganji} 대운이 이어집니다. 지금 만든 결과·신뢰·생활 기반이 다음 장의 출발점이 됩니다.` : "현재 10년의 마무리에 집중합니다.", evidence: [packet.nextCycle ? `${packet.currentCycle.ganji} → ${packet.nextCycle.ganji}` : packet.currentCycle.ganji] },
  ];
}

export function buildMajorFortuneV3(legacy: MajorFortuneReportDraft, packet: MajorFortuneEvidencePacket): MajorFortuneV3Draft {
  if (!packet.decadeReading || packet.decadeReading.years.length !== 10) throw new Error("MAJOR_DECADE_READING_REQUIRED");
  const reading = packet.decadeReading, main = voiceFor(packet.majorTenGod.stemTenGod), good = goodFortune(packet), workScenes = careerScenes(packet), mbti = packet.personContext.mbtiType?.trim() || "";
  const mbtiLine = mbtiVoice[mbti] ? `${withKoreanParticle(mbtiVoice[mbti], "subject")} ${packet.majorTenGod.stemTenGod}의 흐름과 만납니다. ${mbti}인 ${packet.personLabel}님에게 이 운은 실제 판단과 사람을 움직이는 방식에서 보입니다.` : "MBTI를 모름으로 입력했기 때문에 특정 유형의 성격을 추정하지 않았습니다. 명리 흐름과 입력한 생활 맥락만으로 읽습니다.";
  const previous = packet.previousCycle ? `이전 ${packet.previousCycle.startYear}~${packet.previousCycle.endYear}년 ${packet.previousCycle.ganji} 대운에서 지금의 ${packet.currentCycle.ganji} 대운으로 넘어오며 삶의 질문도 달라졌습니다. 예전에는 시작하고 부딪치는 일이 중요했다면 지금은 해낸 것 중 무엇을 내 이름과 기반으로 남길지가 더 신경 쓰일 수 있습니다.` : "지금은 계산된 첫 대운입니다. 임의의 과거 흐름을 만들지 않고 지금까지 쌓인 경험과 남은 연도의 변화를 연결해 읽습니다.";
  const opening = [
    `${packet.personLabel}님의 현재 대운은 ${packet.currentCycle.ganji}, ${packet.currentCycle.startYear}~${packet.currentCycle.endYear}년의 장입니다. 지금은 그중 ${packet.cyclePosition.yearIndexInCycle}년차를 지나고 있습니다.`,
    "예전에는 일단 해보는 게 중요했다면 지금은 시작하는 것보다 남기는 것이 더 신경 쓰일 수 있습니다. 해낸 일은 많은데 ‘그래서 내 것이 뭐지?’라는 질문이 생기는 식입니다.",
    `이 10년의 중심에는 ${withKoreanParticle(main.gift, "subject")} 있습니다. 잘 풀릴 때는 ${main.scene}. 원래 있던 힘이 더 큰 무대와 책임을 만난 모습에 가깝습니다.`,
    workScenes[packet.cyclePosition.yearIndexInCycle - 1] ?? workScenes[0],
    `힘이 과해지면 ${main.caution}. 본인은 버틸 만해서 계속한 일인데 주변에서는 원래 내가 다 하는 사람으로 받아들일 수 있습니다.`,
    `${main.money}. 돈이 들어오는 크기만큼 고객·기술·경험처럼 다음에도 남을 자산을 함께 보는 눈이 커집니다.`,
    relationshipScene(packet, main), `${good.title}. ${good.body} ${mbtiLine}`,
  ];
  const elements = packet.currentMajorFortune.elementFocus.map(item => elementKo[item]).join("과 ");
  const sections: MajorFortuneV3Section[] = [
    { id: "transition", title: "어제의 정답이 오늘은 조금 무거워지는 이유", mode: "contrast", paragraphs: [previous, "과거에 통했던 실력을 버리는 것이 아닙니다. 같은 실력도 지금은 더 큰 역할, 더 분명한 몫, 더 오래 남는 결과로 바뀌어야 제값을 합니다."], evidence: [packet.previousCycle ? `${packet.previousCycle.ganji} → ${packet.currentCycle.ganji}` : packet.currentCycle.ganji] },
    { id: "career", title: "바빠지는 것보다 내 판단의 값이 커지는 10년", mode: "scene", paragraphs: [workScenes[2], workScenes[3], workScenes[6], "본인은 빨리 끝낸 것뿐인데 주변에서는 원래 쉬운 일인 줄 아는 억울한 순간이 있습니다. 처리량보다 어떤 혼란을 줄였고 어떤 선택을 가능하게 했는지가 다음 자리와 보상을 가릅니다."], evidence: [`${packet.currentCycle.ganji} · ${packet.majorTenGod.stemTenGod}`] },
    { id: "money", title: "돈보다 먼저 싸게 쓰고 있는 건 내 시간일 수 있습니다", mode: "portrait", paragraphs: [`${main.money}. 이번 10년의 돈운은 벌고 쓰는 액수뿐 아니라 책임지는 범위가 달라지는 흐름입니다.`, "좋은 기회도 회수 시점·반복 가능성·실제로 쓴 시간을 빼고 나면 체감이 달라집니다. 경험과 기술, 다시 찾는 사람까지 자산으로 남기는 선택이 현금의 흐름도 단단하게 만듭니다.", "연봉이나 단가 이야기는 어색해하면서 맡은 일만 계속 늘어난다면 가치에 이름을 붙이는 단계가 빠진 것입니다."], evidence: [`${packet.majorTenGod.stemTenGod} · 재물 흐름`] },
    { id: "people", title: "사람복은 많아서가 아니라 정확한 순간에 작동합니다", mode: "scene", paragraphs: ["친구·동료·가족 사이에서 먼저 정리하고 챙기는 사람이 되기 쉽습니다. 사람들이 우물쭈물하면 결국 내가 순서와 역할을 말하고 있는 장면도 늘어납니다.", "모두에게 필요한 사람과 서로 기대어도 되는 사람은 다릅니다. 오래 갈 사람은 거절해도 관계가 흔들리지 않는지를 보여줍니다.", "새로운 모임이나 이동에서 만난 연결이 일을 넓힐 수 있습니다. 말이 통하고 책임이 맞는 몇 사람을 알아보는 눈이 인복을 실제 기회로 만듭니다."], evidence: [`${packet.currentCycle.ganji} · 관계 흐름`] },
    { id: "love", title: "좋아하는 마음도 이 10년에는 생활 방식으로 보입니다", mode: "portrait", paragraphs: [loveLifeScene(packet), "본인은 충분히 표현했다고 생각해도 상대는 ‘근데 말로는?’ 하고 느낄 수 있습니다. 말은 짧아도 시간을 내고 약속을 지키는 행동이 반복되면 진심은 꽤 선명합니다.", "관계를 잘하려고 모든 문제를 해결하려 들면 사랑까지 프로젝트가 됩니다. 해결보다 같이 있어주는 시간이 답인 날도 있습니다."], evidence: [`${USER_RELATIONSHIP_STATUS_LABELS[packet.userContext.relationshipStatus ?? "unknown"]} · ${packet.majorTenGod.stemTenGod}`] },
    { id: "study-move", title: "배움과 이동은 다음 역할의 예고편입니다", mode: "good-fortune", paragraphs: [`${main.learning}. 새로운 분야나 익숙한 자리 밖의 사람을 만날 때 잘하던 일을 다른 크기로 쓰는 힌트가 생깁니다.`, mbtiLine, "자격증의 개수보다 실제 문제에 써본 흔적, 다른 사람에게 설명해 본 기록, 이동하며 만난 연결이 다음 장에서 힘을 냅니다."], evidence: [packet.mbtiBasis.type || "MBTI 미입력", packet.currentCycle.ganji] },
    { id: "elements", title: `${elements}의 기운이 생활 리듬을 바꾸는 방식`, mode: "contrast", paragraphs: [`${packet.currentCycle.ganji} 대운에서는 ${elements}의 성질이 10년의 배경에 더해집니다. ${packet.elementEffect.plain}`, "목은 가지를 뻗고, 화는 드러내며, 토는 기반을 만들고, 금은 고르고 나누며, 수는 정보와 생각을 흐르게 합니다. 실제 생활에서 과해지거나 비어 있는 장면을 보는 편이 정확합니다."], evidence: [`${packet.currentCycle.ganji} · ${elements}`] },
    { id: "gift", title: good.title, mode: "good-fortune", paragraphs: [good.body, "좋은 운은 준비가 끝난 뒤 허락받는 보상이 아닙니다. 이미 가진 패가 사람·자리·돈·결과로 이어지는 장면을 알아보고 쓰는 것이 먼저입니다."], evidence: good.evidence },
    { id: "risk", title: "가장 잘하는 방식이 나를 제일 지치게 할 때", mode: "strategy", paragraphs: [`${main.caution}. 약점이 새로 생긴 것이 아니라 좋은 힘을 같은 세기로 너무 오래 쓴 결과에 가깝습니다.`, "모든 기회를 잡고 모든 사람을 챙기고 모든 결과를 직접 확인하는 순간 성취는 늘어도 여백은 줄어듭니다. ‘할 수 있다’와 ‘내가 해야 한다’가 갈리는 지점이 이번 10년의 안전장치입니다."], evidence: [`${packet.majorTenGod.stemTenGod} · 힘의 과사용`] },
  ];
  const nextChapter = packet.nextCycle ? [`다음 대운 미리보기는 ${packet.nextCycle.startYear}~${packet.nextCycle.endYear}년 ${packet.nextCycle.ganji}의 장입니다. 지금 만든 결과와 신뢰가 다음에는 더 넓은 관계와 선택을 움직이는 재료가 됩니다.`, "넘길 것은 바쁜 습관이 아니라 다시 쓸 수 있는 결과, 내 판단을 믿는 사람, 생활을 버티게 하는 돈의 구조입니다. 지금의 부담까지 전부 다음 장으로 들고 갈 필요는 없습니다."] : ["현재 확인된 대운표 안에서는 지금 10년의 마무리에 집중합니다. 남길 결과와 내려놓을 부담을 나누는 것만으로도 다음 선택의 모양이 선명해집니다."];
  const finale = [
    `${packet.personLabel}님은 이 10년을 지나며 많이 해내는 사람에서 무엇을 남길지 고르는 사람으로 달라집니다. ${main.gift}이 실제 자리와 생활의 구조가 되는 시간입니다.`,
    "일에서는 처리 속도보다 판단의 값이 커지고, 돈에서는 현금뿐 아니라 고객·기술·경험을 축적하는 눈이 생깁니다. 잘한 일을 우연처럼 넘기지 않을 때 자리운과 재물운도 자기 이름을 찾습니다.",
    `${good.title}. 이미 쓸 수 있는 좋은 패가 있습니다. 사람복과 기회를 알아보고 연결하는 것도 이 사람의 실력입니다.`,
    "관계에서는 가까움과 책임의 선을 다시 긋습니다. 많이 챙기는 마음만큼 혼자 회복할 시간, 상대가 스스로 선택할 공간도 사랑의 일부가 됩니다.",
    packet.nextCycle ? `다음 ${packet.nextCycle.ganji}의 장으로 가져갈 것은 버틴 흔적이 아니라 내 이름으로 남은 결과입니다.` : "이 10년의 끝에 남는 것은 버틴 횟수가 아니라 내 이름으로 다시 꺼내 쓸 수 있는 결과입니다.",
  ];
  return { ...legacy, version: MAJOR_FORTUNE_V3_VERSION, productVersion: "v3", title: `${packet.personLabel}님의 현재 대운, ${packet.currentCycle.ganji}의 장`, inputSummary: [
    { label: "현재 상태", value: USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus] }, { label: packet.userContext.lifeStatus === "student" ? "관심 분야" : "현재 직업", value: packet.userContext.fieldLabel?.trim() || "미입력" }, { label: "MBTI", value: mbti || "모름" }, { label: "관계 상태", value: USER_RELATIONSHIP_STATUS_LABELS[packet.userContext.relationshipStatus ?? "unknown"] },
  ], chapterTitle: `지금 지나고 있는 ${packet.currentCycle.startYear}~${packet.currentCycle.endYear}년, ${main.gift}이 삶의 앞쪽으로 나옵니다`, opening, fortuneSignals: buildFortuneSignals(packet, good, main), editorialSections: sections, editorialYears: reading.years.map((year, index) => buildYear(packet, year, index, workScenes)), nextChapter, finale, editorialAudit: { yearCount: 10, currentYear: packet.currentYear, importantYears: reading.years.filter(year => year.importance === "important").map(year => year.year), sourceVersion: "major-decade-v2" } };
}

export function majorFortuneV3CustomerText(draft: MajorFortuneV3Draft): string {
  if (draft.horizon) return [draft.title, ...draft.inputSummary.map(r => `${r.label} · ${r.value}`), `${draft.horizon.from}~${draft.horizon.through}년`,
    ...draft.horizon.transitions.flatMap(t => [t.title, t.dateLabel, `${t.before.ganji} · ${t.before.tenGod} · ${t.before.elements.join("·")} → ${t.after.ganji} · ${t.after.tenGod} · ${t.after.elements.join("·")}`, ...t.paragraphs]),
    ...draft.opening, ...(draft.fortuneSignals ?? []).flatMap(s => [s.title, s.body]), ...draft.editorialSections.flatMap(s => [s.title, ...s.paragraphs]),
    ...draft.editorialYears.flatMap(y => [`${y.year}년${["major_fortune_v3.0-editorial.4", "major_fortune_v3.0-editorial.5"].includes(draft.version) ? ` · ${y.ageLabel}` : ""} ${y.ganji} · ${y.tenGod}`, y.title, ...y.paragraphs]), ...draft.finale].join("\n\n");
  return [draft.title, draft.chapterTitle, ...draft.opening, ...(draft.fortuneSignals ?? []).flatMap(signal => [signal.title, signal.body]), ...draft.editorialSections.flatMap(section => [section.title, ...section.paragraphs]), ...draft.editorialYears.flatMap(year => [year.title, ...year.paragraphs]), ...draft.nextChapter, ...draft.finale].join("\n\n");
}
