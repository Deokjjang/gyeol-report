import type { MajorFortuneReportDraft } from "../report-generation/majorFortuneReportDraftTypes";
import type { MajorDecadeYear } from "../report-knowledge/majorFortuneDecadeReading";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import { USER_LIFE_STATUS_LABELS, USER_RELATIONSHIP_STATUS_LABELS } from "../report-knowledge/userContextTypes";

export const MAJOR_FORTUNE_V3_VERSION = "major_fortune_v3.0-editorial.1";

export type MajorFortuneV3Section = {
  readonly id: string;
  readonly title: string;
  readonly mode: "portrait" | "scene" | "good-fortune" | "contrast" | "strategy" | "finale";
  readonly paragraphs: readonly string[];
  readonly evidence: readonly string[];
};

export type MajorFortuneV3Year = {
  readonly year: number;
  readonly ageLabel: string | null;
  readonly ganji: string;
  readonly tenGod: string;
  readonly phase: "early" | "middle" | "late";
  readonly importance: "important" | "standard" | "quiet";
  readonly isCurrentYear: boolean;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly evidence: readonly string[];
};

export type MajorFortuneV3Draft = Omit<MajorFortuneReportDraft, "version" | "productVersion"> & {
  readonly version: typeof MAJOR_FORTUNE_V3_VERSION;
  readonly productVersion: "v3";
  readonly title: string;
  readonly inputSummary: readonly { readonly label: string; readonly value: string }[];
  readonly chapterTitle: string;
  readonly opening: readonly string[];
  readonly editorialSections: readonly MajorFortuneV3Section[];
  readonly editorialYears: readonly MajorFortuneV3Year[];
  readonly nextChapter: readonly string[];
  readonly finale: readonly string[];
  readonly editorialAudit: {
    readonly yearCount: 10;
    readonly currentYear: number;
    readonly importantYears: readonly number[];
    readonly sourceVersion: "major-decade-v2";
  };
};

export function isMajorFortuneV3Draft(value: unknown): value is MajorFortuneV3Draft {
  return !!value && typeof value === "object" && "version" in value && value.version === MAJOR_FORTUNE_V3_VERSION &&
    "productType" in value && value.productType === "major_fortune" && "productVersion" in value && value.productVersion === "v3";
}

const tenGodVoice: Readonly<Record<string, { gift: string; scene: string; caution: string; money: string; relation: string }>> = {
  비견: { gift: "내 이름으로 판단하고 끝내는 힘", scene: "남의 기준에 맞추기보다 내가 납득할 방식으로 판을 다시 짭니다", caution: "혼자 결정하는 속도가 빨라질수록 동료의 다른 방식까지 경쟁으로 받아들이기 쉽습니다", money: "내가 쓸 돈과 함께 책임질 돈의 선을 분명히 할수록 안정됩니다", relation: "가까워도 각자의 선택권을 지켜주는 관계가 오래갑니다" },
  겁재: { gift: "사람과 자원을 움직여 큰 판을 만드는 힘", scene: "혼자보다 함께할 때 속도가 붙지만 어느 순간 ‘왜 마무리는 또 내 몫이지?’가 떠오를 수 있습니다", caution: "호의와 책임의 경계가 흐려지면 기여만 커지고 몫은 모호해집니다", money: "공동 비용과 부탁성 지출은 금액보다 책임자를 먼저 정해야 합니다", relation: "의리로 시작한 약속이 당연한 의무가 되지 않게 선을 봅니다" },
  식신: { gift: "좋아하는 것을 꾸준한 결과로 바꾸는 힘", scene: "한 번 반짝이는 성과보다 다시 꺼내 쓸 결과물을 차곡차곡 남깁니다", caution: "재미있는 일을 늘리다 보면 체력과 마감이 뒤늦게 따라올 수 있습니다", money: "만든 것의 가치와 실제로 돈이 들어오는 구조를 구분할 때 축적이 생깁니다", relation: "말보다 시간을 쓰고 챙기는 행동으로 마음을 보여줍니다" },
  상관: { gift: "낡은 방식을 보고 더 나은 답을 말하는 힘", scene: "회의가 길어지면 속으로 ‘그래서 바꿀 건 뭔데?’가 먼저 뜹니다", caution: "정확한 말도 상대에게는 평가표처럼 들릴 수 있습니다", money: "새 방식의 기대 이익만큼 바꾸는 비용도 함께 계산해야 합니다", relation: "맞는 말보다 받아들일 수 있는 말의 순서가 중요해집니다" },
  편재: { gift: "밖에서 기회와 사람을 연결하는 힘", scene: "한 자리에만 있을 때보다 고객·모임·이동처럼 바깥 접점에서 선택지가 늘어납니다", caution: "제안이 많다는 사실을 이미 확보한 성과로 착각하면 일정과 현금이 먼저 빡빡해집니다", money: "거래 규모보다 회수일과 감당할 손실을 먼저 보면 좋은 재물 흐름이 남습니다", relation: "새 인연이 늘 때 기존 관계에 쓸 시간까지 약속하지 않는 감각이 필요합니다" },
  정재: { gift: "돈과 생활을 오래 유지되는 구조로 만드는 힘", scene: "화려한 한 번보다 매달 반복되는 수입과 지출의 균형을 잘 봅니다", caution: "안정시키려는 마음이 모든 변수를 통제하려는 태도로 바뀔 수 있습니다", money: "작은 금액도 누적으로 보며 축적의 속도를 만드는 재물 감각이 살아납니다", relation: "약속을 꾸준히 지키는 방식으로 신뢰를 쌓습니다" },
  편관: { gift: "압박이 올 때 앞에 서서 결론을 내는 힘", scene: "다들 우물쭈물하는 순간 결국 내가 정리하고 있는 장면이 많아집니다", caution: "견딜 수 있다는 이유로 권한 없는 책임까지 받으면 유능함이 소모품처럼 쓰입니다", money: "급한 결정일수록 최대 손실과 중단 조건을 먼저 잠가야 합니다", relation: "도와주려는 주도성이 지시처럼 들리지 않게 상대의 선택 공간을 남깁니다" },
  정관: { gift: "신뢰받는 자리와 기준을 만드는 힘", scene: "대충 넘어가도 되는 일과 반드시 지켜야 할 선을 구분해 조직의 중심을 잡습니다", caution: "바른 답을 지키느라 현실의 예외와 내 회복을 뒤로 미루기 쉽습니다", money: "계약과 정산 기준이 분명할수록 꾸준한 보상이 따라오기 좋은 흐름입니다", relation: "말과 행동이 맞는 사람에게 마음이 놓이고 약속의 무게를 크게 봅니다" },
  편인: { gift: "남들이 지나친 단서를 자기 방식으로 연결하는 힘", scene: "한번 꽂힌 질문은 혼자 있을 때도 계속 돌아가며 예상 밖의 답을 찾습니다", caution: "생각의 갈래가 늘어날수록 시작보다 재검토가 길어질 수 있습니다", money: "흥미로운 가능성과 실제 생활을 버틸 수입을 따로 놓고 봐야 합니다", relation: "혼자 정리할 시간이 필요하다고 마음까지 멀어진 것은 아닙니다" },
  정인: { gift: "배운 것을 자기 기반으로 쌓는 힘", scene: "설명과 기록을 통해 흩어진 경험을 다시 쓸 지식으로 만듭니다", caution: "준비가 충분해야 움직인다는 생각 때문에 이미 할 수 있는 일도 늦게 꺼낼 수 있습니다", money: "자격·기술·문서처럼 오래 남는 자산에 쓰는 돈의 의미가 커집니다", relation: "잘 듣고 기억하는 방식으로 상대에게 안정감을 줍니다" },
};

const mbtiVoice: Readonly<Record<string, string>> = {
  ENTJ: "결론이 보이면 역할과 순서를 먼저 세우는 ENTJ의 속도", ENTP: "가능성을 보면 다른 조합부터 시험해 보는 ENTP의 호기심",
  ENFJ: "사람의 반응과 전체 방향을 함께 살피는 ENFJ의 조율", ENFP: "의미가 붙는 순간 에너지가 크게 살아나는 ENFP의 확장성",
  ESTJ: "기준과 마감을 현실에 고정하는 ESTJ의 추진", ESTP: "상황이 움직일 때 바로 감각을 잡는 ESTP의 대응",
  ESFJ: "주변의 필요를 빠르게 알아채는 ESFJ의 생활 감각", ESFP: "사람과 현장의 온도를 높이는 ESFP의 표현",
  INTJ: "멀리 보고 구조를 다시 설계하는 INTJ의 집중", INTP: "당연해 보이는 전제를 다시 묻는 INTP의 탐구",
  INFJ: "겉말 뒤의 흐름을 오래 읽는 INFJ의 통찰", INFP: "자기 가치와 맞는지 끝까지 확인하는 INFP의 진심",
  ISTJ: "쌓인 기록과 약속을 정확히 지키는 ISTJ의 신뢰", ISTP: "복잡한 문제에서 핵심 작동 원리를 찾는 ISTP의 실용",
  ISFJ: "작은 변화와 필요한 돌봄을 기억하는 ISFJ의 세심함", ISFP: "자기 감각을 해치지 않는 방식으로 움직이는 ISFP의 온도",
};

function careerScene(packet: MajorFortuneEvidencePacket): string {
  const { lifeStatus, fieldLabel } = packet.userContext;
  const field = fieldLabel?.trim();
  if (lifeStatus === "business_owner") return `${field || "지금 하는 사업"}에서는 고객이 늘어나는 기쁨과 운영이 무거워지는 순간이 함께 옵니다. 매출·가격·비용·사람을 모두 내 손으로 붙잡는 것보다, 이 10년에는 무엇을 대표의 판단으로 남길지가 더 중요합니다.`;
  if (lifeStatus === "freelancer") return `${field || "지금 하는 일"}에서 의뢰가 들어오는 것과 좋은 조건으로 반복되는 것은 다릅니다. 단가·수정 범위·정산일을 분명히 할수록 실력이 바쁜 일정에 묻히지 않습니다.`;
  if (lifeStatus === "student" || lifeStatus === "exam_certificate") return `${field || "관심 분야"}를 배우는 지금은 점수만큼 무엇에 오래 꽂히는지가 중요합니다. 수업·시험·작은 결과물을 오가며 남의 정답이 아니라 내 방식으로 이해한 흔적이 쌓입니다.`;
  if (lifeStatus === "job_seeker" || lifeStatus === "resting") return `${field || "다음 역할"}을 찾는 동안 직함이 없다고 능력까지 멈춘 것은 아닙니다. 공고의 멋진 이름보다 실제 하루에 풀 문제와 보여줄 결과를 고를 때 흐름이 구체적이 됩니다.`;
  if (lifeStatus === "employee") return `${field || "현재 직장"}에서는 일을 빨리 끝내는 능력보다 어떤 판단을 맡고 누구와 연결하는지가 다음 자리를 만듭니다. 평가·보상·이직을 볼 때도 업무량보다 내가 만든 차이를 말할 수 있어야 합니다.`;
  return `${field || "현재 생활"}에서 반복해서 맡는 문제와 남기는 결과를 보면 실제 역할이 보입니다. 직함보다 시간을 가장 많이 쓰는 장면이 이 10년의 변화를 먼저 보여줍니다.`;
}

function relationshipScene(packet: MajorFortuneEvidencePacket, voice: ReturnType<typeof voiceFor>): string {
  const status = packet.userContext.relationshipStatus ?? "unknown";
  if (status === "married") return `기혼인 지금은 사랑의 말보다 돈·집안일·가족 일정·혼자 쉬는 시간을 어떻게 나누는지가 관계의 체감을 만듭니다. ${voice.relation}`;
  if (status === "dating") return `연애 중이라면 바쁜 시기에 답장과 약속이 어떻게 달라지는지에서 이 흐름이 먼저 보입니다. ${voice.relation}`;
  if (status === "single") return `솔로인 지금은 만남의 수보다 내 생활 리듬을 존중하면서도 새로운 장면을 열어주는 사람에게 관심이 붙기 쉽습니다. ${voice.relation}`;
  return `관계 상태를 정해 두지 않았더라도 가까운 사람과 시간·책임·거리의 기준을 나누는 장면에서 이 흐름이 드러납니다. ${voice.relation}`;
}

function loveLifeScene(packet: MajorFortuneEvidencePacket): string {
  const status = packet.userContext.relationshipStatus ?? "unknown";
  if (status === "married") return "같이 사는 사이에서는 큰 이벤트보다 냉장고를 채우는 방식, 가족 일정을 잡는 순서, 한 사람이 조용히 쉬어야 하는 시간을 존중하는지가 사랑의 온도를 만듭니다.";
  if (status === "dating") return "연애 중에는 일이 커질수록 만나는 횟수보다 약속을 바꿀 때 어떻게 설명하는지가 중요해집니다. 바쁜 이유를 말하는 것과 상대가 기다린 시간을 알아주는 것은 다른 표현입니다.";
  if (status === "single") return "솔로일 때는 쉽게 맞춰주는 사람보다 자기 생활을 잘 꾸리면서도 새로운 세계를 보여주는 사람에게 눈이 갑니다. 관심 없다고 생각했는데 그 사람의 말과 일정을 유난히 기억하고 있다면 마음은 이미 조금 움직인 뒤일 수 있습니다.";
  return "관계의 이름을 정하지 않았더라도 누군가에게 시간을 내고 약속을 지키는 방식에서 마음의 우선순위가 드러납니다.";
}

function voiceFor(tenGod: string) {
  return tenGodVoice[tenGod] ?? tenGodVoice.비견;
}

function goodFortune(packet: MajorFortuneEvidencePacket): { title: string; body: string; evidence: string[] } {
  const labels = packet.natalLabels;
  const match = (pattern: RegExp) => labels.find(label => pattern.test(label));
  if (match(/천을|천덕/)) return { title: "이 10년에는 사람복도 실력의 일부입니다", body: "막힌 순간에 정확한 조언을 주거나 문을 연결해 주는 귀인의 패가 있습니다. 모든 것을 혼자 증명하는 길만 있는 사람이 아닙니다. 도움을 받는 순간조차 결국 평소 쌓아 둔 신뢰가 작동한 결과에 가깝습니다.", evidence: [match(/천을|천덕/)!] };
  if (match(/장성|반안/)) return { title: "잘하는 사람을 넘어, 판단을 맡길 사람으로", body: "앞에 서서 기준을 잡거나 자기 이름으로 역할을 맡을수록 존재감이 살아나는 좋은 패가 있습니다. 일을 더 많이 떠안는 것과 자리가 커지는 것은 다릅니다. 이 10년의 좋은 쓰임은 실무량보다 결정의 무게가 커지는 쪽입니다.", evidence: [match(/장성|반안/)!] };
  if (match(/재고/)) return { title: "한 번 해낸 일이 다음의 자산으로 남습니다", body: "돈만이 아니라 고객·기술·경험·기록을 쌓아 다음 시작을 가볍게 만드는 축적의 좋은 패가 있습니다. 바쁜 날을 많이 만드는 것보다 다시 꺼내 쓸 것을 남길 때 재물복의 결이 선명해집니다.", evidence: [match(/재고/)!] };
  if (match(/문창|학당/)) return { title: "배운 것을 밖으로 꺼낼수록 운이 붙습니다", body: "알고 있는 것을 말·글·결과물로 남길 때 전문성이 또렷해지는 좋은 패가 있습니다. 혼자 이해한 데서 끝나지 않고 남이 다시 쓸 수 있게 설명하는 순간, 배움이 자리와 기회로 이어집니다.", evidence: [match(/문창|학당/)!] };
  if (match(/역마/)) return { title: "자리 밖에서 다음 문이 열리는 패", body: "이동·외부 프로젝트·새로운 모임처럼 익숙한 경계를 벗어날 때 연결이 늘어나는 좋은 흐름이 있습니다. 많이 움직이는 자체보다 그 자리에서 만난 문제와 사람이 다음 선택을 넓혀주는 쪽입니다.", evidence: [match(/역마/)!] };
  return { title: `${packet.currentCycle.ganji} 대운이 이미 건네는 좋은 패`, body: `${voiceFor(packet.majorTenGod.stemTenGod).gift}이 이 10년의 중심 자원입니다. 새 능력을 억지로 만들기보다 이미 반복해서 잘해 온 방식을 더 큰 역할과 오래 남는 결과로 연결할 때 흐름이 살아납니다.`, evidence: [`${packet.currentCycle.ganji} · ${packet.majorTenGod.stemTenGod}`] };
}

function compactEvidence(year: MajorDecadeYear): string[] {
  const relations = [...year.cycleRelations, ...year.natalRelations].slice(0, 2).map(r => `${r.branches.join("")} ${r.type}`);
  return [`${year.ganji} · ${year.tenGod}`, ...relations];
}

const yearHeadlineByGod: Readonly<Record<string, readonly [string, string]>> = {
  비견: ["남의 속도보다 내 기준이 먼저 서는 해", "혼자 끝낼 일과 함께할 일이 갈립니다"],
  겁재: ["사람이 늘수록 몫과 책임도 선명해집니다", "함께 키운 판에서 내 기여를 지키는 해"],
  식신: ["쌓아둔 결과가 다음 기회를 부릅니다", "꾸준히 만든 것이 내 이름으로 남습니다"],
  상관: ["잘하던 방식을 한 번 뒤집어 보는 해", "맞는 말보다 바뀐 결과가 힘을 얻습니다"],
  편재: ["밖에서 사람과 돈의 선택지가 들어옵니다", "판은 넓어지고, 고를 기준은 더 중요해집니다"],
  정재: ["돈과 생활이 오래 가는 구조를 찾습니다", "화려함보다 남는 숫자가 또렷해집니다"],
  편관: ["압박 속에서 누가 결정할지가 보입니다", "책임은 커지고, 권한의 값도 선명해집니다"],
  정관: ["내 이름으로 맡을 자리와 기준이 커집니다", "신뢰가 역할과 인정으로 이어집니다"],
  편인: ["한번 멈춰 본 생각이 새 방향을 엽니다", "혼자 파고든 질문이 다음 선택을 만듭니다"],
  정인: ["배운 것이 기반과 문서로 남는 해", "경험을 정리해 다음 역할의 자산으로 만듭니다"],
};

function yearTitle(year: MajorDecadeYear, current: boolean, index: number): string {
  const voice = voiceFor(year.tenGod);
  if (current) return `${year.year}, 지금 가장 크게 들리는 질문은 ‘${voice.gift}’입니다`;
  if (index === 0) return `${year.year}, ${yearHeadlineByGod[year.tenGod]?.[0] ?? "새 10년의 첫 기준을 세웁니다"}`;
  if (index === 9) return `${year.year}, ${yearHeadlineByGod[year.tenGod]?.[1] ?? "끝까지 남는 힘이 다음 10년을 엽니다"}`;
  return `${year.year}, ${yearHeadlineByGod[year.tenGod]?.[index % 2] ?? year.focus}`;
}

function buildYear(packet: MajorFortuneEvidencePacket, year: MajorDecadeYear, index: number): MajorFortuneV3Year {
  const row = packet.majorFortuneTimelineRows.find(item => item.year === year.year);
  const voice = voiceFor(year.tenGod), current = year.year === packet.currentYear;
  const mbtiBehavior = mbtiVoice[packet.personContext.mbtiType ?? ""];
  const phase = index < 3 ? "early" : index < 7 ? "middle" : "late";
  const paragraphs = [
    `${year.ganji} 세운의 ${year.tenGod}은 ${voice.scene}. ${year.detail.coreFlow.split(": ").at(-1) ?? year.focus}`,
    current
      ? `${packet.currentYear}년은 계산된 대운의 ${packet.cyclePosition.yearIndexInCycle}년차입니다. 지금 체감이 큰 이유를 10년 전체의 결론으로 확대하기보다, 이미 지나온 해에서 남은 것과 앞으로 바꿀 것을 나누어 볼 때 현재 위치가 선명해집니다.`
      : year.importance === "important" ? `이 해는 10년 안에서 굵게 읽히는 해입니다. ${year.reasons[0]?.text ?? "대운과 원국의 관계 신호가 함께 움직입니다."}` : `크게 튀는 사건을 정해 두는 해가 아니라, ${year.focus}이 생활의 어느 장면에서 반복되는지 알아보는 해입니다.`,
    `${voice.money} ${voice.caution}.`,
    ...(current ? [`현재 ${packet.userContext.fieldLabel?.trim() || USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus]}의 현실에서는 ${voice.gift}이 어떤 결과와 역할로 남는지가 중요합니다. ${mbtiBehavior ? `${mbtiBehavior}이` : "MBTI를 입력하지 않았으므로 특정 유형의 행동을 덧붙이지 않고"} 지금의 선택 방식에 섞여 나타납니다.`] : []),
  ];
  return { year: year.year, ageLabel: row?.ageLabel ?? null, ganji: year.ganji, tenGod: year.tenGod, phase, importance: year.importance,
    isCurrentYear: current, title: yearTitle(year, current, index), paragraphs, evidence: compactEvidence(year) };
}

export function buildMajorFortuneV3(legacy: MajorFortuneReportDraft, packet: MajorFortuneEvidencePacket): MajorFortuneV3Draft {
  if (!packet.decadeReading || packet.decadeReading.years.length !== 10) throw new Error("MAJOR_DECADE_READING_REQUIRED");
  const reading = packet.decadeReading, main = voiceFor(packet.majorTenGod.stemTenGod), good = goodFortune(packet);
  const mbti = packet.personContext.mbtiType?.trim() || "";
  const mbtiLine = mbtiVoice[mbti] ? `${mbtiVoice[mbti]}가 ${packet.majorTenGod.stemTenGod}의 흐름과 만나면, ${main.scene}. 같은 운에서도 생각만 오래 하는 사람과 바로 역할을 나누는 사람의 10년은 전혀 다르게 보입니다.` : "MBTI를 모름으로 입력했기 때문에 특정 유형의 성격을 추정하지 않았습니다. 이 장에서는 명리 흐름과 실제 입력한 생활 맥락만으로 읽습니다.";
  const previous = packet.previousCycle ? `이전 ${packet.previousCycle.startYear}~${packet.previousCycle.endYear}년 ${packet.previousCycle.ganji} 대운에서 지금의 ${packet.currentCycle.ganji} 대운으로 넘어오며 삶의 질문도 달라졌습니다. ${reading.previous}` : reading.previous;
  const opening = [
    `${packet.personLabel}님의 ${packet.currentCycle.startYear}~${packet.currentCycle.endYear}년은 ${main.gift}이 전면으로 나오는 장입니다. 좋은 때와 나쁜 때를 한 줄로 나누기보다, 무엇을 키울수록 운이 붙고 무엇을 과하게 쓰면 피로가 되는지를 읽는 10년입니다.`,
    packet.previousCycle ? `이전 ${packet.previousCycle.ganji} 대운이 탐색하고 부딪치며 답을 찾는 시간이었다면, 지금 ${packet.currentCycle.ganji} 대운은 그중 무엇을 내 결과와 기반으로 남길지 묻습니다. 현재는 이 10년의 ${packet.cyclePosition.yearIndexInCycle}년차라 이미 지나온 변화와 다음 전환을 함께 볼 시점입니다.` : `지금은 계산된 첫 대운의 ${packet.cyclePosition.yearIndexInCycle}년차입니다. 임의의 과거 흐름을 만들지 않고, 지금까지 쌓인 경험과 남은 연도의 변화를 연결해 읽습니다.`,
    `겉으로는 같은 일을 계속하는 것처럼 보여도 역할의 무게와 사람을 대하는 방식은 달라질 수 있습니다. ${careerScene(packet)}`,
    `이 흐름을 잘 쓰는 날에는 ${main.scene}. 주변에서는 갑자기 달라졌다고 느낄 수 있지만, 사실은 원래 있던 힘이 더 큰 무대와 책임을 만난 모습에 가깝습니다.`,
    `반대로 힘이 과해지면 ${main.caution}. 잘하는 것을 더 세게 하는 것만으로는 풀리지 않는 순간이 생기고, 그때부터 이 10년은 속도보다 범위와 대가를 묻기 시작합니다.`,
    `${main.money} 돈이 들어오는 크기만큼 고객·기술·경험처럼 다음에도 남을 자산을 함께 보는 눈이 중요해집니다.`,
    relationshipScene(packet, main),
    `${good.title}. 이미 가진 좋은 패가 사람·자리·돈·결과로 이어질 통로를 알아보는 것이 중요합니다. ${mbtiLine}`,
  ];
  const sections: MajorFortuneV3Section[] = [
    { id: "transition", title: "어제의 정답이 오늘은 조금 무거워지는 이유", mode: "contrast", paragraphs: [previous, "과거에 통했던 습관을 버리라는 뜻은 아닙니다. 같은 실력도 지금은 더 큰 역할, 더 분명한 몫, 더 오래 남는 결과로 바뀌어야 제값을 합니다."], evidence: [packet.previousCycle ? `${packet.previousCycle.ganji} → ${packet.currentCycle.ganji}` : packet.currentCycle.ganji] },
    { id: "career", title: "바빠지는 것보다, 내 판단의 값이 커지는 10년", mode: "scene", paragraphs: [`${packet.userContext.fieldLabel?.trim() || "지금 맡은 일"}에서 반복해서 불리는 이유를 보면 다음 역할이 보입니다. 급한 일을 대신 끝내는 사람인지, 흐린 기준을 정리하는 사람인지, 서로 다른 사람을 연결해 결과를 만드는 사람인지에 따라 자리의 크기도 달라집니다.`, `${main.scene}. 잘 풀릴 때는 처리하는 사람을 넘어 기준을 만드는 사람으로 보입니다. 본인은 그냥 빨리 끝낸 것뿐인데 주변에서는 원래 쉬운 일인 줄 아는 억울한 순간도 생길 수 있습니다.`, "성과가 커질수록 ‘얼마나 많이 했는가’보다 ‘어떤 혼란을 줄였고 어떤 선택을 가능하게 했는가’가 다음 자리와 보상을 가릅니다."], evidence: [`${packet.currentCycle.ganji} · ${packet.majorTenGod.stemTenGod}`] },
    { id: "money", title: "돈보다 먼저 싸게 쓰고 있는 건 내 시간일 수 있습니다", mode: "portrait", paragraphs: [`${main.money} 이 10년의 돈운은 숫자 하나가 갑자기 커지는 예언보다, 벌고 쓰고 함께 책임지는 방식이 달라지는 흐름입니다.`, "좋은 기회가 와도 회수 시점·반복 가능성·내가 실제로 쓴 시간을 빼고 나면 체감은 달라집니다. 경험과 기술, 다시 찾는 사람까지 자산으로 남기는 선택이 현금의 흐름도 단단하게 만듭니다.", "연봉이나 단가 이야기는 어색해하면서 맡은 일만 계속 늘어난다면 운이 없는 게 아니라 가치에 이름을 붙이는 단계가 빠진 것입니다."], evidence: [`${packet.majorTenGod.stemTenGod} · 돈의 발현`] },
    { id: "people", title: "사람복은 많아서가 아니라, 정확한 순간에 작동합니다", mode: "scene", paragraphs: ["친구·동료·가족 사이에서 먼저 정리하고 챙기는 사람이 되기 쉽습니다. 사람들이 우물쭈물하면 결국 내가 순서와 역할을 말하고 있는 장면도 늘어납니다.", "모두에게 필요한 사람과 서로 기대어도 되는 사람은 다릅니다. 오래 갈 사람은 내가 해주는 일의 양보다 거절해도 관계가 흔들리지 않는지를 보여줍니다.", "새로운 모임이나 이동에서 만난 연결이 일을 넓힐 수도 있습니다. 다만 모든 인연을 붙잡는 것보다 말이 통하고 책임이 맞는 몇 사람을 알아보는 눈이 더 큰 복입니다."], evidence: [`${packet.currentCycle.ganji} · 관계 흐름`] },
    { id: "love", title: "좋아하는 마음도 이 10년에는 생활 방식으로 보입니다", mode: "portrait", paragraphs: [loveLifeScene(packet), "본인은 충분히 표현했다고 생각해도 상대는 ‘근데 말로는?’ 하고 느낄 수 있습니다. 반대로 말은 짧아도 시간을 내고 약속을 지키는 행동이 반복되면 이 사람의 진심은 꽤 선명합니다.", "관계를 잘하려고 모든 문제를 해결하려 들면 사랑까지 프로젝트가 됩니다. 해결보다 같이 있어주는 시간이 답인 날도 있다는 것, 이 10년의 관계운이 가르치는 반전입니다."], evidence: [`${USER_RELATIONSHIP_STATUS_LABELS[packet.userContext.relationshipStatus ?? "unknown"]} · ${packet.majorTenGod.stemTenGod}`] },
    { id: "study-move", title: "배움과 이동은 도망이 아니라 다음 역할의 예고편", mode: "good-fortune", paragraphs: ["새로운 분야를 배우거나 익숙한 자리 밖에서 다른 사람의 방식을 만날 때, 지금까지 잘하던 일을 다른 크기로 쓰는 힌트가 생깁니다. 자격증의 개수보다 실제 문제에 써본 흔적이 다음 장에서 힘을 냅니다.", mbtiLine, "관심이 붙은 것을 전부 시작하기보다 이 10년 뒤에도 다시 꺼내 쓸 기술·기록·관계를 남기는 선택이 좋습니다."], evidence: [packet.mbtiBasis.type || "MBTI 미입력", packet.currentCycle.ganji] },
    { id: "elements", title: "익숙한 힘은 더 무거워지고, 빈 곳에는 새 길이 생깁니다", mode: "contrast", paragraphs: [`${packet.currentCycle.ganji} 대운의 ${packet.currentMajorFortune.elementFocus.join("·")} 기운은 원국의 균형 위에 새로운 생활 리듬을 얹습니다. ${packet.elementEffect.plain}`, "오행은 사건 이름이 아니라 힘을 쓰는 이미지에 가깝습니다. 목은 가지를 뻗고, 화는 드러내고, 토는 기반을 만들며, 금은 고르고 나누고, 수는 정보와 생각을 흐르게 합니다. 지금 필요한 것은 다섯 가지를 똑같이 키우는 일이 아니라 실제로 과해지거나 비어 있는 방식의 체감을 알아보는 것입니다."], evidence: [`${packet.currentCycle.ganji} · ${packet.currentMajorFortune.elementFocus.join("·")}`] },
    { id: "gift", title: good.title, mode: "good-fortune", paragraphs: [good.body, "좋은 운은 준비가 끝난 뒤에 허락받는 보상이 아닙니다. 이미 가진 패가 잘 작동하는 장면을 알아보고, 그 힘이 사람·자리·돈·결과로 이어지게 쓰는 것이 먼저입니다."], evidence: good.evidence },
    { id: "risk", title: "가장 잘하는 방식이 나를 제일 지치게 할 때", mode: "strategy", paragraphs: [`${main.caution}. 이건 약점이 새로 생긴 것이 아니라 좋은 힘을 같은 세기로 너무 오래 쓴 결과에 가깝습니다.`, "모든 기회를 잡고 모든 사람을 챙기고 모든 결과를 직접 확인하는 순간, 성취는 늘어도 삶의 여백은 줄어듭니다. ‘할 수 있다’와 ‘내가 해야 한다’를 구분하는 것이 이 10년의 현실적인 안전장치입니다."], evidence: [`${packet.majorTenGod.stemTenGod} · 과사용`] },
  ];
  const nextChapter = packet.nextCycle ? [reading.next, `다음 ${packet.nextCycle.startYear}~${packet.nextCycle.endYear}년 ${packet.nextCycle.ganji} 대운으로 넘길 것은 지금 쌓은 자산과 신뢰입니다. 현재의 부담까지 전부 들고 갈 필요는 없습니다.`] : [reading.next];
  const finale = [
    `${packet.personLabel}님에게 이 10년은 ${main.gift}을 실제 자리와 생활의 구조로 바꾸는 시간입니다. 일에서는 판단의 값이 커지고, 돈에서는 무엇을 남길지 선명해지며, 관계에서는 가까움과 책임의 선이 다시 그어집니다.`,
    `${good.title}. 운의 좋은 부분을 과장하지 않아도 이미 쓸 수 있는 자원이 있습니다. 다만 그 힘을 증명하느라 나를 계속 싸게 쓰지 않는 것이 중요합니다.`,
    "앞으로의 10년은 더 많이 버티는 사람의 것이 아니라, 자기 힘이 어디에서 가장 크게 남는지 아는 사람의 것입니다.",
  ];
  return {
    ...legacy, version: MAJOR_FORTUNE_V3_VERSION, productVersion: "v3",
    title: `${packet.personLabel}님의 다음 10년, ${packet.currentCycle.ganji}의 장`,
    inputSummary: [
      { label: "현재 상태", value: USER_LIFE_STATUS_LABELS[packet.userContext.lifeStatus] },
      { label: packet.userContext.lifeStatus === "student" ? "관심 분야" : "현재 직업", value: packet.userContext.fieldLabel?.trim() || "미입력" },
      { label: "MBTI", value: mbti || "모름" },
      { label: "관계 상태", value: USER_RELATIONSHIP_STATUS_LABELS[packet.userContext.relationshipStatus ?? "unknown"] },
    ],
    chapterTitle: `${packet.currentCycle.startYear}~${packet.currentCycle.endYear}, ${main.gift}이 삶의 앞쪽으로 나옵니다`,
    opening, editorialSections: sections,
    editorialYears: reading.years.map((year, index) => buildYear(packet, year, index)),
    nextChapter, finale,
    editorialAudit: { yearCount: 10, currentYear: packet.currentYear, importantYears: reading.years.filter(year => year.importance === "important").map(year => year.year), sourceVersion: "major-decade-v2" },
  };
}

export function majorFortuneV3CustomerText(draft: MajorFortuneV3Draft): string {
  return [draft.title, draft.chapterTitle, ...draft.opening, ...draft.editorialSections.flatMap(section => [section.title, ...section.paragraphs]), ...draft.editorialYears.flatMap(year => [year.title, ...year.paragraphs]), ...draft.nextChapter, ...draft.finale].join("\n\n");
}
