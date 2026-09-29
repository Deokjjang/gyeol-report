import type { SajuCalcResult } from "../saju/types";
import type { UserContextProfile } from "../report-knowledge/userContextTypes";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { composeEditorial, type EditorialForm, type EditorialRole, type EditorialScene, type EditorialTone } from "./editorialComposer";
import { storySupport, factLabel, GOD_CODES } from "./comprehensiveStoryEvidence";
import { matchCompounds, TEN_GOD_PAIR_REVIEW } from "./compounds";
import { CAREER_PORTRAITS, CAREER_VOICES } from "./careerPortraits";
import { careerWorkArena, interpretCareerContextV3, type WorkArena } from "./careerContextV3";
import type { Domain, Evidence } from "./types";

export const CAREER_V3_VERSION = "career_v3.0-editorial.1";
export const CAREER_V3_POLISH_VERSION = "career_v3.0-editorial.2";
export type CareerV3Input = { name: string; mbti: string; facts: readonly Evidence[]; calculation: SajuCalcResult; context: UserContextProfile; robust?: boolean };
export type CareerV3Chapter = { readonly id: string; readonly title: string; readonly collapsed: boolean; readonly scenes: readonly EditorialScene[] };
export type CareerV3Draft = {
  readonly productType: "career_money_study"; readonly productVersion: "v3"; readonly version: typeof CAREER_V3_VERSION | typeof CAREER_V3_POLISH_VERSION;
  readonly personLabel: string; readonly title: string; readonly mbti: string; readonly archetype: string;
  readonly chapters: readonly CareerV3Chapter[];
  readonly editorialAudit: Omit<ReturnType<typeof composeEditorial>, "scenes">;
};
export function isCareerV3Draft(value: unknown): value is CareerV3Draft {
  return !!value && typeof value === "object" && "version" in value && (value.version === CAREER_V3_VERSION || value.version === CAREER_V3_POLISH_VERSION) && "productType" in value && value.productType === "career_money_study" && "productVersion" in value && value.productVersion === "v3";
}
export function careerV3CustomerText(draft: CareerV3Draft): string {
  return [draft.title, ...draft.chapters.flatMap(c => [c.title, ...c.scenes.flatMap(s => [s.headline, ...s.parts.map(p => p.text)])])].join("\n\n");
}

const gifts: Readonly<Record<string, readonly [string, string, string]>> = {
  twelve_sinsal_jangseong: ["앞에 섰을 때 이름이 남는 패", "장성은 명예와 리더십의 좋은 기운입니다. 책임 있는 역할에서 방향을 보여줄 때 존재감이 살아납니다.", "누가 정리할지 서로 눈치를 볼 때 조용히 기준을 잡는 행동이 사람들에게 남습니다. 모든 실무를 대신하는 것보다 갈림길에서 판단을 보여주는 역할에 가깝습니다."],
  twelve_sinsal_banan: ["잘하는 사람에서 맡길 사람으로", "반안은 자리와 인정의 좋은 패입니다. 자기 이름으로 역할을 맡고 사회적 신뢰를 키우는 쪽에 힘이 있습니다.", "처음에는 결과로 불리다가 나중에는 판단을 부탁받는 사람이 되는 모습입니다. 이미 해낸 일에 이름과 역할이 붙을 때 성취의 감각도 달라집니다."],
  gwiin_cheoneul: ["혼자 풀던 문제에 사람의 문이 열립니다", "천을귀인은 도움의 통로와 사람복의 좋은 패입니다. 모든 것을 혼자 증명하는 경로만 있는 원국이 아닙니다.", "막힌 지점을 아는 사람의 한마디가 며칠의 시행착오를 줄여주는 장면에 가깝습니다. 평소 신뢰하던 연결에서 소개나 조언을 받아 일이 이어지는 모습도 이 기운의 좋은 쓰임입니다."],
  gwiin_jaego: ["한 번 한 일이 다음의 자산이 되는 패", "재고귀인은 재물과 경험을 쌓아 남기는 축적의 좋은 패입니다. 돈만이 아니라 다시 찾는 고객과 재사용할 기술도 자산으로 읽습니다.", "바쁘게 끝난 하루 뒤에 다음에도 꺼내 쓸 무언가가 남습니다. 해본 일의 기록과 관계가 쌓여 새 일을 시작할 때 처음부터 전부 다시 하지 않아도 되는 힘입니다."],
  twelve_sinsal_yeokma: ["자리 밖으로 나갈 때 연결이 늘어납니다", "역마는 이동과 외부 접점에서 기회를 넓히는 패입니다. 같은 자리에서 같은 사람만 만날 때와는 다른 흐름을 만듭니다.", "견학·외부 프로젝트·새 작업 공간처럼 실제 환경이 바뀌는 경험에서 새로운 쓰임을 발견합니다. 많이 돌아다니는 자체보다 그 자리에서 만난 문제와 사람이 다음 선택을 넓혀주는 쪽입니다."],
  sinsal_dohwa: ["결과를 보여줄 때 사람이 기억합니다", "도화는 시선과 인상을 모으는 매력의 패입니다. 보여지는 역할과 고객 접점에서 실력에 기억될 얼굴을 더합니다.", "같은 내용도 당신이 설명하거나 보여주면 분위기가 달라지는 장면입니다. 관심이 모이는 힘이 있는 만큼 무엇으로 기억될지를 담은 작업과 소개가 잘 어울립니다."],
  sinsal_hongyeom: ["내 방식에 온도가 붙는 매력", "홍염은 표현과 분위기에 사람을 끌어당기는 매력의 기운입니다. 무조건 많은 사람에게 맞추기보다 자기 색이 살아 있을 때 인상이 남습니다.", "대화의 말투나 결과물의 취향처럼 작지만 분명한 차이로 기억되는 쪽입니다. 모두에게 무난한 모습보다 좋아하는 사람이 다시 찾아올 이유가 있는 모습에 가깝습니다."],
  gwiin_munchang: ["머릿속 실력을 밖으로 꺼내는 문재", "문창귀인은 배운 것을 말과 글로 드러내는 전문성과 표현의 좋은 패입니다. 알고 있는 것을 남이 이해할 형태로 남기는 힘입니다.", "같은 정보를 갖고 있어도 어떤 순서로 보여주느냐에서 차이가 납니다. 복잡한 내용을 짧게 설명했는데 상대의 표정이 풀리는 순간에 이 재능이 보입니다."],
  gwiin_hakdang: ["배움이 이력이 되는 학업의 패", "학당귀인은 배움의 자리에서 힘을 얻는 좋은 패입니다. 좋은 스승과 환경에서 익힌 것이 다음 역할의 기반이 됩니다.", "막연히 혼자 버티던 내용을 적절한 설명 한 번으로 이해하는 경험에 가깝습니다. 배운 기준을 실제 결과에 써보면 공부와 커리어가 따로 놀지 않습니다."],
  sinsal_hyeonchim: ["작은 어긋남을 그냥 못 지나치는 눈", "현침은 정밀함과 문제 발견의 힘입니다. 큰 그림이 멀쩡해 보여도 작은 오류나 모순을 알아보는 재능입니다.", "남들이 괜찮다고 한 뒤에도 마음에 걸리던 한 곳을 확인했더니 실제 차이가 드러나는 장면입니다. 이 눈이 자기 흠만 찾는 데 머물지 않을 때 결과의 품질을 지키는 실력이 됩니다."],
  twelve_sinsal_hwagae: ["혼자 깊어지는 시간이 전문성을 만듭니다", "화개는 혼자 몰입하고 깊이를 쌓는 힘입니다. 바깥의 반응이 잠잠해도 자기 질문을 오래 숙성시키는 자원이 있습니다.", "누가 시키지 않아도 같은 분야를 다시 찾고 예전에 놓친 차이를 알아차리는 모습입니다. 잠깐 유행한 관심이 지나간 뒤에도 남는 취향이 전문성의 씨앗입니다."],
};

function statusCopy(input: CareerV3Input, a: WorkArena) {
  const status = input.context.lifeStatus;
  if (status === "business_owner") return {
    intro: "사업에서는 할 일을 잘 끝내는 것과 다음에도 돈이 들어오게 만드는 일이 다릅니다. 고객이 늘어나는 기쁨 뒤에 운영이 무거워지는 순간까지 함께 읽습니다.",
    current: `${a.start}, 눈앞의 응대와 내일도 같은 품질을 낼 구조를 동시에 봐야 합니다. ${a.output}에 사장의 손이 전부 들어가야 한다면 바쁜 날이 곧 성장한 날은 아닙니다.`,
    people: `${a.people}의 요구를 듣는 일과 함께 일할 사람에게 맡기는 일은 다른 능력입니다. 내가 빨리 처리할수록 다른 사람은 배울 기회를 잃고, 결국 사장이 빠지면 멈추는 운영이 되기 쉽습니다.`,
    money: `매출이 늘어난 날에도 ${a.measure} 뒤에 남은 비용과 시간이 다르면 체감은 다릅니다. 가격을 올리는 일이 미안해 서비스가 계속 추가되면 고객의 만족을 내 체력으로 결제하게 됩니다.`,
    growth: `사업을 키운다는 것은 규모만 늘리는 일이 아닙니다. ${withKoreanParticle(a.growth, "object")} 구분하고, 재방문 이유는 브랜드에 남기되 모든 응대를 내 개인기에 묶어두지 않는 변화입니다.`,
    next: "새 지점·새 고객·새 상품의 설렘과 기존 운영의 체력을 따로 보세요. 한 사람에게 설명해 넘길 수 있는 일이 늘어나는지 확인한 뒤 확장을 판단하는 편이 좋습니다.",
  };
  if (status === "freelancer") return {
    intro: "프리랜서에게 실력은 결과로 보이지만 하루의 만족은 의뢰 조건에도 달려 있습니다. 잘하는 일과 좋은 조건으로 반복할 일을 함께 읽습니다.",
    current: `${a.start}, 상대의 말에 바로 맞추기 전에 처음 합의한 결과가 떠오릅니다. ${a.output}의 품질뿐 아니라 어디까지가 이번 의뢰인지 설명하는 능력도 일의 일부입니다.`,
    people: `${a.people}에게 편한 사람으로 기억되는 것과 언제든 추가 요청을 해도 되는 사람이 되는 것은 다릅니다. 다시 찾는 고객이 내 취향과 전문성을 알고 오는지, 거절하지 않는 태도 때문에 오는지에서 관계의 질이 갈립니다.`,
    money: "견적에는 만드는 시간만이 아니라 수정·설명·대기 시간도 들어 있습니다. 일을 따냈다는 안도감 때문에 단가를 낮추면 바쁠수록 생활이 불안정해지는 역설이 생깁니다. 반복 고객과 빈 기간의 여유가 함께 있어야 수입의 출렁임을 견디기 편합니다.",
    growth: `${a.growth}에서 내 이름의 가격이 달라집니다. 포트폴리오는 잘 만든 것의 모음이면서 다음에 받고 싶은 일을 보여주는 간판입니다. 지친 의뢰만 잘 정리해 놓으면 비슷한 의뢰가 다시 올 수밖에 없습니다.`,
    next: "다음 의뢰를 고를 때 금액·수정 범위·정산일을 한 장에 놓아보세요. 자기 이름으로 남길 작업과 생활을 유지할 반복 작업을 구분하면 모든 제안에 같은 기대를 걸지 않게 됩니다.",
  };
  if (["student", "exam_certificate"].includes(status)) return {
    intro: "지금은 직업 이름을 서둘러 고르기보다 무엇을 배우고 만들 때 눈이 달라지는지 찾는 시기입니다. 점수로 드러나는 모습과 아직 성적표에 없는 재능을 같이 읽습니다.",
    current: `${a.start}, 남의 풀이를 다시 보는 것과 내 막힌 부분을 찾는 것은 다릅니다. ${a.output}에는 얼마나 오래 앉아 있었는지보다 어떤 선택을 직접 해봤는지가 남습니다.`,
    people: "혼자 깊이 파는 시간과 친구에게 설명하는 시간은 서로 다른 빈틈을 보여줍니다. 팀 과제에서 내가 먼저 맡는 역할을 보면 좋아하는 일과 떠밀려 잘하게 된 일도 조금씩 구분됩니다.",
    money: "지금은 용돈·아르바이트 수입·학습 비용처럼 작은 돈에서도 선택의 성격이 드러납니다. 친구가 시작한 수업이나 산 도구가 탐날 때 내 관심이 커진 것인지 비교가 급해진 것인지 구분하는 경험도 자산입니다.",
    growth: "전공 이름 하나가 앞으로의 일을 전부 정하지는 않습니다. 수업에서 배운 것을 작은 작업·동아리·현장 체험으로 옮겨보면 좋아하는 줄 알았던 일과 실제로 오래 하고 싶은 일이 갈립니다.",
    next: "관심 분야의 짧은 실습이나 공개 과제를 하나 골라 결과와 느낀 점을 남겨보세요. 첫 경험은 대단한 경력을 증명하기보다 내가 어떤 문제를 다시 풀고 싶은지 확인하는 자리면 충분합니다.",
  };
  if (["job_seeker", "resting"].includes(status)) return {
    intro: "아직 직함이 없다고 일하는 성격까지 없는 것은 아닙니다. 잘 맞는 환경과 문제를 먼저 고른 뒤, 그 힘을 보여줄 현실적인 입구를 찾습니다.",
    current: `${a.start}, 유명한 이름보다 실제 하루의 장면이 중요해집니다. ${a.output} 하나에도 문제를 어떻게 보고 무엇부터 선택했는지 드러나면 설명할 실력이 생깁니다.`,
    people: "현직자의 이야기에서 멋진 성과뿐 아니라 자주 막히는 순간을 들어보면 직무가 구체적으로 보입니다. 사람과 대화가 많은 역할인지, 혼자 검토할 시간이 필요한지부터 내 리듬과 비교할 수 있습니다.",
    money: "준비가 길어질수록 돈보다 시간이 공짜처럼 느껴지기 쉽습니다. 강의와 자격을 계속 추가하는 선택보다 이미 배운 것을 보여줄 사례가 없는 상태가 더 비쌀 때도 있습니다.",
    growth: "지원 횟수만 늘리면 내 강점도 비슷한 말로 평평해집니다. 한 문제를 왜 그 방식으로 풀었는지 설명할 수 있으면 적은 경험도 실제 판단을 보여주는 사례가 됩니다.",
    next: "환경이 맞는 공고 몇 개에서 반복되는 실제 업무를 찾아 작은 샘플로 만들어 보세요. 필요한 자격이나 경력이 있는 역할은 요건부터 확인하고, 바로 해볼 수 있는 보조·인턴·프로젝트 경험을 진입점으로 비교하세요.",
  };
  if (status === "employee") return {
    intro: `${a.label} 일을 할 때 잘하는 순간과 유난히 소모되는 순간은 의외로 같은 뿌리에서 시작합니다. 힘이 될 때는 재능으로 불리던 성격이, 조건이 바뀌면 피로의 이유가 되기도 합니다.`,
    current: `${a.start}, 겉으로는 같은 일을 받아도 각자가 먼저 보는 지점이 다릅니다. 당신의 실력은 ${a.output}만이 아니라 무엇을 미리 보고 어떤 낭비를 줄였는지에도 남습니다.`,
    people: `${withKoreanParticle(a.people, "with")} 함께할 때 내 일이 끝났다는 사실만으로 전체 일이 끝나지는 않습니다. 내가 설명하지 않아도 알 거라고 여긴 기준이 상대에게는 처음 듣는 내용일 때, 능력보다 연결 방식에서 마찰이 생깁니다.`,
    money: `${withKoreanParticle(a.praise, "topic")} 좋은 평가의 재료입니다. 다만 고생한 시간만 이야기하면 ${a.measure}에 실제로 어떤 차이를 만들었는지가 가려집니다. 보상 이야기를 불편해해도 이미 만든 가치를 낮게 말할 필요는 없습니다.`,
    growth: `다음 단계에서는 ${withKoreanParticle(a.growth, "object")} 생각하게 됩니다. 직급이 오를수록 일을 더 많이 하는 것만으로는 충분하지 않습니다. 내가 내린 판단을 다른 사람이 이해하고 이어갈 수 있는지가 역할의 크기를 바꿉니다.`,
    next: `이직을 생각한다면 ${a.next}인지부터 확인해 보세요. 같은 직무라도 평가 기준·협업 방식·결정권이 달라지면 매일 쓰는 힘의 비율이 완전히 바뀝니다.`,
  };
  return {
    intro: `${a.label}의 이름만으로 성격이나 능력을 정하지 않습니다. 입력한 일에서 확인되는 작업·사람·결과의 구조를 바탕으로 지금 쓰는 힘을 읽습니다.`,
    current: `${a.stage}에서 내가 먼저 떠안는 부분을 보면 실제 역할이 보입니다. ${a.output}처럼 남에게 넘길 결과가 분명해질수록 내 기여도 설명하기 쉬워집니다.`,
    people: `${withKoreanParticle(a.people, "with")} 어떤 약속을 주고받는지가 관계의 중심입니다. 같은 장소에 있어도 서로 기대하는 일이 다르면 성실하게 해놓고도 답답한 순간이 생깁니다.`,
    money: "수입이 있는 일과 돌봄·준비처럼 바로 돈이 되지 않는 일의 가치는 다르게 보일 때가 있습니다. 시간과 체력을 어디에 쓰는지 알면 당장 금액이 붙지 않은 기여도 쉽게 지우지 않게 됩니다.",
    growth: `${withKoreanParticle(a.growth, "object")} 지금의 생활 크기에 맞춰 생각하는 편이 좋습니다. 직함을 바꾸기 전에 실제로 맡는 문제와 끝낼 결과가 바뀌는지 보는 것이 먼저입니다.`,
    next: "현재 역할에서 남기고 싶은 결과 하나와 줄이고 싶은 소모 하나를 구분해 보세요. 확인되지 않은 업종이나 업무를 상상해서 진로를 결정할 필요는 없습니다.",
  };
}

export function buildCareerV3(input: CareerV3Input): CareerV3Draft {
  const { facts, calculation, context } = input;
  const substantial = facts.filter(f => storySupport(f.featureId, facts, calculation).substantial);
  const gods = substantial.filter(f => f.featureId.startsWith("ten_god_") && CAREER_PORTRAITS[f.featureId.slice(8)])
    .toSorted((a, b) => (calculation.tenGods.distribution[GOD_CODES[b.featureId.slice(8)]] ?? 0) - (calculation.tenGods.distribution[GOD_CODES[a.featureId.slice(8)]] ?? 0) || a.id.localeCompare(b.id));
  const main = gods.find(f => f.domains.some(d => ["career", "money", "study", "business", "leadership"].includes(d)));
  const emptyAudit = composeEditorial({ product: "career_money_study", facts, scenes: [], chapters: [], selectedEvidenceRefs: [], substantialEvidenceRefs: [] });
  if (!main) return { version: CAREER_V3_VERSION, productVersion: "v3", productType: "career_money_study", personLabel: input.name, mbti: input.mbti, title: `${input.name}님의 일·돈·배움의 결`, archetype: "", chapters: [], editorialAudit: { ...emptyAudit, errors: ["CAREER_SUBSTANTIAL_BASIS_REQUIRED"] } };
  const portrait = CAREER_PORTRAITS[main.featureId.slice(8)];
  const work = interpretCareerContextV3(context.fieldLabel ?? "", input.robust, context.lifeStatus), a = careerWorkArena(context, work), status = statusCopy(input, a);
  const student = ["student", "exam_certificate"].includes(context.lifeStatus), seeker = ["job_seeker", "resting"].includes(context.lifeStatus), business = context.lifeStatus === "business_owner";
  const employed = context.lifeStatus === "employee";
  const voice = CAREER_VOICES[input.mbti], trait = voice && facts.find(f => f.featureId === `mbti:${input.mbti}:traits:${voice.trait}`);
  const planned: { id: string; title: string; collapsed: boolean }[] = [];
  const scenes: EditorialScene[] = [];
  const chapter = (id: string, title: string, collapsed = false) => planned.push({ id, title, collapsed });
  const scene = (chapter: string, angle: string, headline: string, tone: EditorialTone, form: EditorialForm, parts: readonly [EditorialRole, string][], anchors: readonly Evidence[] = [main], preferred: Domain = "career") => {
    const domain = ["career", "business", "money", "study", "leadership"].includes(preferred) && anchors.some(f => f.kind !== "mbti" && f.domains.includes(preferred)) ? preferred : anchors.flatMap(f => f.kind !== "mbti" ? f.domains : []).find(d => ["career", "business", "money", "study", "leadership"].includes(d));
    if (!domain) return;
    scenes.push({ id: `career:${chapter}:${angle}`, chapter, angle, headline, tone, form, order: scenes.length, subject: "person", domain,
      parts: parts.map(([role, text]) => ({ role, text })), evidenceRefs: anchors.map(f => f.id), sourceRefs: [...new Set([...anchors.flatMap(f => f.sourceRefs), "careerEditorial:reviewed-copy", ...(context.fieldLabel ? ["userContext:fieldLabel", "careerContextV3:work-taxonomy"] : [])])] });
  };
  chapter("portrait", student ? "배울 때 이미 드러나는 나" : seeker ? "직함보다 먼저 있는 일하는 성격" : "지금 일할 때의 나");
  scene("portrait", "first-minute", portrait.title, "recognition", "prose", [["character", `${input.name}님은 ${portrait.name}입니다. ${a.start}, 그냥 넘기지 않고 자기 방식으로 정리하는 모습에서 이 결이 드러납니다. ${portrait.start}`], ["explanation", `${withKoreanParticle(factLabel(main), "topic")} 원국에서 충분한 근거가 확인된 중심 기운입니다. ${status.intro}`]]);
  const precision = substantial.find(f => f.featureId === "sinsal_hyeonchim");
  const fusionFact = precision && ["ENTJ", "INFP"].includes(input.mbti) ? precision : main;
  const fusionBehavior = precision && input.mbti === "ENTJ" ? `오류가 눈에 들어오는 순간 수정안과 맡길 순서까지 함께 떠오릅니다. ${a.output}의 작은 모순을 보고도 가만히 기다리는 일이 고치는 일보다 힘들 때가 있습니다.`
    : precision && input.mbti === "INFP" ? `평소에는 조용히 받아들이다가 결과의 완성도나 지키고 싶은 가치가 어긋나면 놀랄 만큼 정확하게 짚습니다. ${a.output}에서 모두가 괜찮다고 한 부분도 내 기준을 건드리면 그냥 넘어가기 어렵습니다.`
      : main.featureId === "ten_god_shi_shen" && input.mbti === "ENFP" ? `사람의 반응을 듣는 순간 막연했던 아이디어에 모양이 생깁니다. ${a.output}를 함께 쓰는 모습을 상상하면 설명하던 손이 실제로 만들기 시작합니다. 다만 반응이 끊긴 마무리 구간에서는 처음의 약속이 집중을 붙잡아 줍니다.`
        : main.featureId === "ten_god_zheng_guan" && input.mbti === "ISTJ" ? `예전에 합의한 역할과 지금의 요청이 어긋나면 바로 알아차립니다. ${a.output}를 정확히 남기는 책임감에 세부 기억이 붙어, 누가 확인하지 않아도 빠진 약속을 다시 챙깁니다.` : voice?.start;
  if (trait && voice) scene("portrait", "work-fusion", "같은 재능도, 꺼내 쓰는 방식은 다릅니다", "reversal", "quote", [["character", `${a.stage}에서 ${fusionBehavior}`], ["explanation", `${factLabel(fusionFact)}의 힘이 ${input.mbti}의 판단 방식과 만나 일하는 표정에 드러납니다. 같은 재능을 가지고도 언제 말하고 무엇을 먼저 고르는지가 달라지는 결입니다.`]], [fusionFact, trait]);
  scene("portrait", "own-day", student ? "시간이 빨리 가는 공부가 따로 있지 않나요?" : `${a.pinch}, 내 모습이 떠오르나요?`, "curiosity", "punchline", [["character", `${portrait.blunt} ${student ? "잘하는 과목과 오래 붙잡고 싶은 질문이 꼭 같지는 않다는 점도 재미있는 부분입니다." : `특히 ${a.stage}처럼 순서와 반응이 동시에 움직이는 자리에서 이 습관이 더 잘 보입니다.`}`]]);

  if (student) addLearning(true, main);
  chapter("strength", student ? "성적표 바깥에서도 보이는 힘" : "남들이 은근히 믿고 맡기는 것");
  scene("strength", "talent", `${a.output} 뒤에 있는 진짜 실력`, "praise", "observations", [["character", portrait.talent], ["character", `${a.praise}. 이런 인정을 받을 때는 막연한 칭찬보다 내가 한 일을 알아봤다는 느낌이 큽니다. ${a.measure}처럼 남에게 보이는 결과와 내가 힘을 쓴 지점이 연결되는 순간입니다.`]]);
  const compound = matchCompounds(substantial, "person").find(c => c.evidence.some(f => f.id === main.id) && c.evidence.length >= 2 && c.evidence.every(f => substantial.some(s => s.id === f.id)) && c.rule.domains.some(d => ["career", "money", "study", "business"].includes(d)));
  if (compound) scene("strength", "compound", "한 가지 성격으로 설명되지 않는 이유", "reversal", "prose", [["explanation", `${compound.rule.judgment} ${compound.evidence.map(factLabel).join("·")}의 서로 다른 힘이 함께 놓여 있습니다.`], ["character", compoundBehavior(compound.rule.id, a)]], compound.evidence, compound.rule.domains[0]);

  chapter("friction", "못 견디는 데에는 이유가 있습니다");
  scene("friction", "environment", "바쁜 것보다 더 피곤한 순간", "blunt", "quote", [["character", `${a.pinch}. 이런 날에는 일이 많은 것보다 ${portrait.mismatch}이라는 느낌이 피로를 키웁니다. 내 강점이 쓸모없어지는 조건을 오래 견디면 평소보다 말이 짧아집니다.`], ...(trait && voice ? [["character", voice.pressure] as [EditorialRole, string]] : [])], trait ? [main, trait] : [main]);
  scene("friction", "boundary", "좋은 힘을 끝없이 쓰지는 못합니다", "direction", "tip", [["advice", `${a.stage}에서 자꾸 되풀이되는 소모 하나를 골라 그 전후 조건을 적어보세요. 사람 전체를 못 견딘다는 결론보다 ${withKoreanParticle(a.measure, "object")} 방해하는 행동과 조건을 구분하면 바꿀 지점이 작아집니다.`]]);

  chapter("current", business ? "고객이 늘 때, 내 일도 커지는 방식" : context.lifeStatus === "freelancer" ? "의뢰 속에서 내 이름을 지키는 힘" : student ? "배운 것이 내 경험이 되는 순간" : seeker ? "작은 경험으로 먼저 보여줄 것" : "현재 직업에서 살아나는 힘");
  scene("current", "current-role", student || seeker ? "해보기 전에는 몰랐던 나의 선택" : `${a.label}, 이미 하고 있는 중요한 일`, "recognition", "prose", [["character", status.current], ["character", `${portrait.growth} ${student || seeker ? `그래서 ${a.learning} 같은 작은 경험도 판단의 흔적을 남깁니다.` : `그 변화는 ${a.learning}처럼 실제로 막혔던 문제를 다시 설명할 때 가장 잘 보입니다.`}`]]);
  const dimensions = work.analysisIntensity === "high" ? `숫자나 자료의 결론보다 그 결론이 나온 조건을 확인하는 순간이 있습니다. ${a.output}에서 마지막 값만 맞춘 것과 중간의 어긋남까지 이해한 것은 다음 문제에서 차이가 납니다.`
    : work.physicalIntensity === "high" ? `몸이 움직이는 현장에서는 순서가 머릿속에서 끝나지 않습니다. ${a.people}의 실제 반응과 내 체력을 함께 읽어야 같은 품질을 반복할 수 있습니다. 오래 버텼다는 사실만으로 좋은 운영이었다고 느껴지지는 않습니다.`
      : work.creativeIntensity === "high" ? `좋은 아이디어를 떠올린 순간과 상대가 그 의도를 알아본 순간 사이에는 번역이 필요합니다. ${withKoreanParticle(a.output, "object")} 보여준 뒤 어떤 반응에서 수정할지 고르는 데에도 당신의 취향과 판단이 남습니다.`
        : `${a.stage}에서 익숙해졌다는 것은 아무 생각 없이 한다는 뜻만은 아닙니다. 처음에는 보이지 않던 순서와 사람의 반응을 한 번에 읽고 있다는 뜻이기도 합니다.`;
  scene("current", "work-structure", student ? "관심을 오래 붙잡는 조건" : seeker ? "지원서보다 먼저 풀어볼 작은 문제" : "같은 일을 해도, 보는 지점이 다릅니다", "praise", "observations", [["character", student || seeker ? `쉽게 끝낸 것보다 다시 해보고 싶은 경험을 떠올려보면 선택의 기준이 보입니다. ${portrait.environment}에서 ${withKoreanParticle(a.output, "object")} 만들 때 무엇을 직접 정하고 싶었는지가 앞으로 맡고 싶은 역할의 단서가 됩니다.` : dimensions], ["advice", business ? "고객이 다시 찾는 이유 하나를 내 손이 아닌 운영 기준으로 남겨보세요. 맡길 사람이 생겼을 때 무엇을 그대로 지켜야 하는지 보이게 하는 일입니다." : context.lifeStatus === "freelancer" ? "완성한 작업을 소개할 때 요청·내 선택·바뀐 결과를 함께 보여주세요. 다음 고객이 결과의 모양뿐 아니라 문제를 푸는 방식을 알고 찾아오게 됩니다." : `${a.output} 하나에 처음의 문제와 내가 바꾼 선택을 짧게 붙여두세요. 결과만 남기는 것보다 다음에 설명할 때 판단의 가치가 잘 보입니다.`]]);

  chapter("people", business ? "사람을 모으는 것과 맡기는 것" : "같이 일할 때 보이는 나");
  scene("people", "colleague", "겉으로 편해 보여도 기준은 있습니다", "affection", "prose", [["character", portrait.people], ["character", status.people]]);
  scene("people", "handover", student ? "친구에게 설명하다 내가 이해하는 순간" : "내가 끝낸 자리에서 상대가 시작합니다", "direction", "tip", [["advice", student ? "같이 공부할 때 서로의 답보다 선택한 이유를 짧게 설명해 보세요. 경쟁만 할 때는 보이지 않던 내 이해의 빈칸이 질문 속에서 드러납니다." : `${a.people}에게 넘길 때 결론 하나와 아직 확인할 것 하나를 따로 알려주세요. 모든 생각을 길게 설명하는 것보다 다음 사람이 어디서 시작할지 보이는 연결이 실용적입니다.`]]);

  chapter("money", business ? "많이 버는 날과 남기는 날은 다릅니다" : "돈과 보상 앞에서 드러나는 성격");
  const moneyFact = gods.find(f => f.domains.includes("money")) ?? main;
  const moneyPortrait = CAREER_PORTRAITS[moneyFact.featureId.slice(8)];
  scene("money", "earning", "통장 숫자 말고도 계산하는 것이 있습니다", "recognition", "prose", [["character", moneyPortrait.money], ["character", status.money], ["explanation", `${factLabel(moneyFact)}의 충분한 원국 근거를 돈을 대하는 행동으로 읽었습니다. 재산의 크기나 투자 결과를 예측하는 숫자는 아닙니다.`]], [moneyFact], "money");
  scene("money", "spending", "돈보다 시간을 싸게 쓰고 있지는 않나요?", "blunt", "quote", [["character", moneyPortrait.spending], ["character", `${business || context.lifeStatus === "freelancer" ? "가까운 사람이 부탁하면 견적이 아니라 관계부터 계산하게 됩니다. 좋은 마음으로 시작한 추가 작업도 여러 번 쌓이면 다른 고객의 시간을 밀어내는 비용이 됩니다." : student || seeker ? "친구와 비교한 뒤의 결제는 평소보다 급해지기 쉽습니다. 남에게 보여줄 준비와 실제로 내 손에 남을 경험이 같은 것인지가 중요한 차이입니다." : `${withKoreanParticle(a.output, "object")} 더 잘 만들려고 내 시간을 추가로 넣는 일에도 가격이 있습니다. 당연한 성실함으로만 넘긴 시간이 반복되면 성과는 늘어도 내 생활은 좁아질 때가 있습니다.`}`]], [moneyFact], "money");
  const wealth = gods.find(f => /ten_god_(pian|zheng)_cai/.test(f.featureId));
  if (wealth && wealth.id !== moneyFact.id) scene("money", "wealth-card", "돈을 다루는 좋은 패도 놓치지 마세요", "fortune", "punchline", [["character", CAREER_PORTRAITS[wealth.featureId.slice(8)].good], ["advice", "벌어들이는 통로와 실제 남긴 자원을 나눠 보세요. 좋은 재물 신호를 큰 수익의 보장으로 바꾸지 않고 내 생활에 쓸 힘으로 읽는 방법입니다."]], [wealth], "money");

  chapter("growth", business ? "확장보다 먼저 커져야 할 것" : student ? "전공 밖에서도 이어지는 실력" : seeker ? "준비를 경력의 언어로 바꾸기" : "잘하는 사람에서 다음 역할로");
  scene("growth", "role", student || seeker ? "이름보다 어떤 문제를 맡았는지가 남습니다" : "더 바빠지는 것만이 성장은 아닙니다", "reversal", "observations", [["character", status.growth], ["character", `${withKoreanParticle(a.measure, "object")} 만들었던 내 선택이 다른 상황에서도 통할 때 실력의 범위가 넓어집니다. 같은 양을 더 빨리 처리하는 것과 더 중요한 문제를 맡는 것은 다릅니다.`]]);
  if (!student) addLearning(false, main);

  const chosenGifts = substantial.filter(f => gifts[f.featureId] && f.domains.some(d => ["career", "business", "money", "study", "leadership"].includes(d))).filter((f, i, xs) => xs.findIndex(x => x.featureId === f.featureId) === i).slice(0, 6);
  chapter("fortune", "이미 가지고 들어온 좋은 직업운");
  scene("fortune", "core-gift", student ? "배운 힘이 머무를 자리가 있습니다" : "애써 낮춰 말하지 않아도 되는 재능", "fortune", "punchline", [["character", portrait.good], ["character", `${student || seeker ? a.output : a.praise}처럼 실제 삶에 남는 모습으로 읽을 때 이 좋은 패가 더 구체적입니다. 사건이 저절로 생긴다는 약속이 아니라 이미 가진 힘을 알아보는 이야기입니다.`]]);
  chosenGifts.forEach((f, index) => {
    const [headline, why, body] = gifts[f.featureId];
    scene("fortune", `gift-${index}`, headline, index % 2 ? "fortune" : "praise", index % 2 ? "quote" : "prose", [["explanation", why], ["character", body], ["character", giftApplication(f.featureId, a, student, seeker, business)]], [f]);
  });

  chapter("next", student ? "첫 커리어를 고르기 전에" : seeker ? "맞는 환경에서 찾는 현실적인 입구" : "다음 선택에서 달라져야 할 조건");
  scene("next", "environment-fit", "직무 이름보다 하루의 모양을 보세요", "recognition", "observations", [["character", `당신의 중심 기운은 ${portrait.environment}에서 쓰임이 잘 보입니다. ${portrait.mismatch}에서는 같은 일을 해도 능력을 증명하는 데 에너지를 더 많이 씁니다.`], ["advice", status.next]]);
  chapter("possibilities", employed || business || context.lifeStatus === "freelancer" ? "다른 가능성 · 지금 일을 버리라는 뜻은 아닙니다" : "환경에서 역할로, 역할에서 직무로", employed || business || context.lifeStatus === "freelancer");
  scene("possibilities", "role-examples", "잘할 일의 이름보다, 맡고 싶은 문제", "curiosity", "prose", [["character", `${portrait.environment}에서는 ${portrait.roles} 같은 역할을 예시로 살펴볼 만합니다. 어떤 사람의 어떤 막힌 부분을 풀고, 결과를 무엇으로 보여주는지까지 보아야 직무 이름이 현실의 일이 됩니다.`], ["advice", `${employed ? "현재 직업을 포기하라는 추천이 아닙니다. 먼저 지금 하는 일 안에서 담당 문제나 협업 범위를 조정할 여지가 있는지 보세요." : student ? "관련 수업·체험·작은 제작에서 먼저 재미와 피로를 확인해 보세요. 자격이 필요한 직무는 교육·면허 요건도 별도로 확인해야 합니다." : seeker ? "공고의 필수 요건과 실제 담당 일을 확인한 뒤, 현재 가능한 보조 역할·인턴·작은 프로젝트부터 비교하세요. 직무에 필요한 교육이나 자격을 생략해도 된다는 뜻은 아닙니다." : "이 예시는 업종 전환의 결론이 아니라 내 강점을 다른 역할에서 바라보는 보조 렌즈입니다. 지금의 고객과 경험을 이어 쓸 방법부터 살펴보세요."} 같은 직무라도 ${portrait.mismatch}이라면 기대했던 만족과 달라질 수 있습니다.`]]);
  chapter("direction", "마지막, 당신의 커리어 결");
  const secondary = gods.find(f => f.id !== main.id);
  scene("direction", "final-person", portrait.name, "direction", "quote", [["character", `${input.name}님에게 남는 축은 ${portrait.environment}, ${a.measure}, 그리고 ${student ? "배운 것을 직접 써보는 경험" : business ? "고객이 다시 찾고 운영에 남는 자산" : "자기 판단을 결과로 보여주는 실력"}입니다. ${secondary ? `${factLabel(secondary)}의 힘도 함께 있어 ${CAREER_PORTRAITS[secondary.featureId.slice(8)].name.replace(/형$/, "")} 모습이 한쪽으로만 치우치지 않게 다른 축을 더합니다.` : "한 가지 직업 이름이 이 사람의 가능성을 전부 설명하지는 않습니다."}`], ["advice", `${student ? "다음 경험에서 다시 해보고 싶은 문제 하나를 찾으세요." : seeker ? "작은 결과 하나에 내가 한 선택을 붙여 다음 기회를 설명하세요." : business ? "키울 통로 하나와 남길 자산 하나를 함께 고르세요." : context.lifeStatus === "freelancer" ? "내 이름으로 반복하고 싶은 의뢰의 조건을 선명하게 남기세요." : `${withKoreanParticle(a.growth, "object")} 생각하며, 더 오래 다루고 싶은 문제를 다음 선택의 기준으로 삼으세요.`}`], ["character", portrait.closing]], secondary ? [main, secondary] : [main]);

  const composition = composeEditorial({ product: "career_money_study", chapters: planned.map(c => c.id), facts, scenes, selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: substantial.map(f => f.id), maxConsecutiveTone: 1 });
  const { scenes: assembled, ...editorialAudit } = composition;
  return { version: CAREER_V3_VERSION, productVersion: "v3", productType: "career_money_study", personLabel: input.name, mbti: input.mbti, title: `${input.name}님의 일·돈·배움의 결`, archetype: portrait.name,
    chapters: planned.map(c => ({ ...c, scenes: assembled.filter(s => s.chapter === c.id) })), editorialAudit };

  function addLearning(expanded: boolean, fallback: Evidence) {
    chapter("learning", expanded ? "공부할 때 유난히 달라지는 나" : "새로운 기술을 내 것으로 만드는 방식");
    const learner = gods.find(f => f.domains.includes("study")) ?? fallback;
    const p = CAREER_PORTRAITS[learner.featureId.slice(8)];
    scene("learning", "learning-character", "관심 있는 것과 없는 것의 온도 차이", "recognition", "prose", [["character", p.study], ["character", `${a.learning}에서 이 성격이 드러납니다. ${expanded ? "책상에 오래 앉아 있는 모습만으로는 어떤 공부를 했는지 보이지 않습니다. 다시 설명할 수 있는 내용과 익숙하게 눈으로 지나간 내용이 머릿속에서 섞일 때 자신감과 실제 풀이가 어긋납니다." : `배운 내용이 ${a.output}의 선택을 바꿨다면 단순히 정보를 더 모은 것과는 다른 단계에 들어선 것입니다.`}`]], [learner], "study");
    if (trait && voice) scene("learning", "learning-fusion", "내가 알아듣는 경로는 따로 있습니다", "praise", "quote", [["character", voice.learn], ["explanation", `${input.mbti} 성향의 배우는 방식에 ${factLabel(learner)}의 원국 근거를 더했습니다. 같은 강의를 들어도 무엇을 먼저 납득해야 하는지가 다른 이유를 읽는 대목입니다.`]], [learner, trait], "study");
    if (expanded) {
      scene("learning", "exam", "시험 전날의 나와 평소의 나는 왜 다를까", "blunt", "observations", [["character", `기한이 가까워지면 ${p.name.replace(/형$/, "")} 성격도 급한 답과 깊은 이해 사이에서 흔들립니다. 재미없는 과목을 미뤄두다가 좋아하는 과목의 시간을 전부 빼앗기는 날에는 의욕보다 배분이 문제였다는 사실이 보입니다.`], ["advice", "시험 범위에서는 이미 풀 수 있는 것·설명은 되지만 막히는 것·처음 보는 것을 나눠보세요. 좋아하는 부분에 더 머무르는 습관과 실제로 점검할 빈틈을 구분하는 정도면 충분합니다."]], [learner], "study");
      scene("learning", "practice", "전공을 좋아한다는 말보다 선명한 순간", "curiosity", "punchline", [["character", "과제를 끝낸 뒤에도 다른 방식으로 한 번 더 해보고 싶었던 적이 있나요? 남에게 잘 보이기 위한 완성과 내 궁금증을 풀기 위한 완성이 겹치는 곳에 오래 남을 관심이 있습니다."], ["character", `점수에 잡히지 않은 시도도 다음 선택에 남습니다. ${withKoreanParticle(p.environment, "object")} 과제나 작은 실습에서 경험했을 때 어느 순간 다시 집중하게 되는지 떠올리면 첫 커리어의 이야기가 구체적이 됩니다.`]], [learner], "study");
    }
    scene("learning", "learning-next", "배운 만큼 늘었다는 느낌을 남기는 법", "direction", "tip", [["advice", `${expanded ? "관심 분야의 작은 결과를 하나 정하고" : `${a.learning} 하나를 골라`} 이해한 내용·직접 해본 것·아직 막힌 것을 구분해 보세요. 자격증은 그 다음에 맡을 일의 요건과 연결될 때 준비의 이유가 더 분명해집니다.`]], [learner], "study");
  }
}

function compoundBehavior(ruleId: string, a: WorkArena): string {
  const family = TEN_GOD_PAIR_REVIEW.find(r => r.id === ruleId)?.family;
  const text: Record<string, string> = {
    "peer+output": "남이 시킨 대로 잘했다는 칭찬보다 내 생각이 실제 결과로 보였을 때 더 뿌듯합니다. 머릿속 기준을 말로 지키는 데서 끝내지 않고 하나 만들어 보여주면 동료도 당신의 방식을 이해하기 쉬워집니다.",
    "peer+wealth": "직접 결정하고 싶은 마음과 함께 쓰는 돈의 조건이 부딪칩니다. 좋은 기회라고 느낀 속도와 다른 사람이 동의하는 속도가 달라, 자율성과 공동 자원의 경계를 나눌 때 관계가 편해집니다.",
    "peer+officer": "내 방식이 분명한데 정해진 책임도 그냥 버리지 못합니다. 결정권 없이 결과만 맡았을 때 유난히 답답한 이유는 게으름이 아니라 독립과 역할의 요구가 동시에 있기 때문입니다.",
    "peer+resource": "배운 것을 그대로 반복하기보다 내 기준으로 납득해야 움직입니다. 좋은 설명을 만나도 한 번 직접 정리한 뒤에야 자신 있게 판단하는 쪽입니다.",
    "output+output": "익숙하게 잘 만드는 것과 새로운 방식으로 보여주고 싶은 마음이 함께 있습니다. 편한 결과만 반복하면 심심하고 새로움만 좇으면 마무리가 늦어지는 두 얼굴이 있습니다.",
    "output+wealth": "잘 만든 것을 보는 기쁨에서 끝나지 않고 누가 필요로 할지 떠올립니다. 결과의 모양과 실제 교환 조건을 함께 볼 때 표현하는 실력이 일의 기회로 이어집니다.",
    "output+officer": "더 나은 방식은 보이는데 지켜야 할 기준도 마음에 남습니다. 바꾸고 싶은 마음이 책임감과 부딪치니 단순한 반항보다 어떤 부분을 유지하고 고칠지 고르는 일이 중요해집니다.",
    "output+resource": "배우는 재미와 직접 내놓고 싶은 마음이 함께 작동합니다. 이해한 것을 설명이나 작업으로 꺼내보는 순간, 아는 줄 알았던 빈틈까지 보이는 편입니다.",
    "wealth+wealth": "새로운 수입의 통로가 눈에 들어와도 지금 쌓은 기반을 쉽게 놓지는 않습니다. 크게 벌일 궁리와 꾸준히 남길 계산이 함께 있어, 둘을 한 지갑에 섞을 때 오히려 복잡해집니다.",
    "wealth+officer": "맡은 역할에 얼마의 자원이 필요한지까지 생각이 이어집니다. 좋은 성과라는 말만으로는 부족하고 실제로 쓸 시간과 비용이 맞아야 책임도 지속할 수 있다고 느낍니다.",
    "officer+officer": "평소 기준대로 끝내려는 나와 급한 상황에 바로 대응하는 내가 같이 있습니다. 매번 긴급 요청을 정규 업무 위에 쌓으면 둘 다 잘하려다가 하루가 꽉 차기 쉽습니다.",
    "officer+resource": "배운 것이 맡은 역할에서 실제로 쓰일 때 자신감이 커집니다. 책임을 감으로 버티기보다 이해와 전문성을 기반으로 세우는 사람입니다.",
    "resource+resource": "정리된 원리를 받아들이면서도 남이 보지 않은 연결을 찾습니다. 익숙한 설명으로 안심하는 나와 아직 다른 답이 있는지 파는 나가 함께 있어 배움이 한 방향으로만 끝나지 않습니다.",
  };
  return `${a.stage}에서 ${text[family ?? ""] ?? "서로 다른 재능을 한 번에 쓰려 할 때 내 안의 요구가 복잡해집니다. 당장 끝낼 일과 깊게 살필 일을 나누면 한쪽 힘을 지우지 않고 결과를 만들기 편합니다."}`;
}

function giftApplication(id: string, a: WorkArena, student: boolean, seeker: boolean, business: boolean): string {
  const setting = student ? "배움의 자리" : seeker ? "다음 일을 준비하는 과정" : `${a.label} 업무`;
  if (id === "sinsal_hyeonchim") return `${setting}에서는 ${student || seeker ? "풀이의 빠진 전제와 작업 샘플의 작은 모순" : `${a.output}의 누락이나 앞뒤가 맞지 않는 조건`}을 찾는 눈으로 드러납니다. 정확한 지적이 상대에게 바로 이해되도록 발견한 곳과 영향을 함께 보여줄 때 더 쓸모가 큽니다.`;
  if (id === "gwiin_jaego") return `${setting}에서 ${business ? "재방문 이유와 원가를 알아가는 경험" : `${withKoreanParticle(a.learning, "object")} 정리한 기록`}은 다음에도 다시 꺼내 쓸 기반이 됩니다. 새 일을 할 때마다 제로로 돌아가지 않는다는 것이 축적의 실제 모습입니다.`;
  if (id === "gwiin_cheoneul") return `${setting}에서 ${withKoreanParticle(a.people, "with")} 맺은 신뢰가 조언과 소개를 받을 길이 됩니다. 도움을 받았다는 사실이 내 실력이 부족하다는 증거가 아니라는 점도 이 좋은 패의 중요한 부분입니다.`;
  if (id === "twelve_sinsal_yeokma") return `${setting} 바깥에서 ${withKoreanParticle(a.measure, "object")} 다르게 만드는 사례를 만날 때 시야가 넓어집니다. 새 환경이 좋아 보였다는 감상보다 가져와 써볼 방법 하나가 남는 이동이 어울립니다.`;
  if (id === "sinsal_dohwa") return `${withKoreanParticle(a.output, "object")} 소개할 때 형식만 맞추기보다 내 의도가 보이면 차이가 남습니다. ${business ? "고객이 가격만 비교하지 않고 이곳을 기억할 이유" : `${withKoreanParticle(a.people, "subject")} 나를 다시 떠올릴 인상`}에 연결되는 매력입니다.`;
  if (id === "sinsal_hongyeom") return `${setting}에서 취향과 말투를 전부 무난하게 지우지 않아도 좋습니다. ${withKoreanParticle(a.people, "subject")} 결과뿐 아니라 그 일을 보여준 사람의 분위기까지 기억하는 쪽의 힘입니다.`;
  if (id === "twelve_sinsal_jangseong") return `${a.stage}에서 결정이 필요한 지점을 맡을 때, ${withKoreanParticle(a.praise, "with")}는 또 다른 인정이 생깁니다. 잘 처리한 결과 뒤에 누가 방향을 세웠는지가 보이는 자리입니다.`;
  if (id === "twelve_sinsal_banan") return `${setting}에서 다음 역할을 맡는다면 ${withKoreanParticle(a.measure, "object")} 어떤 판단으로 만들어왔는지가 소개가 됩니다. 이름뿐인 직함보다 이미 보여준 기여에 자리가 붙는 모습이 어울립니다.`;
  if (id === "gwiin_hakdang") return `${withKoreanParticle(a.learning, "object")} 혼자 해결하지 못했을 때, 좋은 설명이나 지도에서 길이 열리는 모습입니다. 배운 뒤 ${a.output}에 적용한 흔적이 남으면 교육을 받은 이력과 실제 실력이 함께 자랍니다.`;
  if (id === "twelve_sinsal_hwagae") return `${a.learning}처럼 한 번 이해했다고 끝나지 않는 주제가 잘 맞습니다. 혼자 익힌 깊이가 ${a.output}의 다른 선택으로 나타날 때 몰입이 고립에 머무르지 않습니다.`;
  return `${withKoreanParticle(a.learning, "object")} 다른 사람이 이해할 ${withKoreanParticle(a.output, "to")} 옮길 때 전문성이 보입니다. 많이 아는 모습을 보여주기보다 막힌 사람이 다음으로 넘어가게 하는 설명에 이 좋은 패가 살아납니다.`;
}
