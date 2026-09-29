import type { AnnualFortuneReportDraft } from "../report-generation/annualFortuneReportDraftTypes";
import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import type { AnnualMonthSegment } from "../report-knowledge/annualMonthJie";
import type { AnnualMonthExtendedEvidence, ExtendedMonthSegment } from "../report-knowledge/annualMonthExtendedEvidence";
import { annualRelationLabel } from "../report-knowledge/annualFortuneReading";
import { withKoreanParticle as particle } from "../report-knowledge/koreanCopyUtils";
import { getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import type { HeavenlyStem, TenGod } from "../report-knowledge/annualFortuneTypes";
import { USER_LIFE_STATUS_LABELS, USER_RELATIONSHIP_STATUS_LABELS } from "../report-knowledge/userContextTypes";
import { formatDayunKst } from "../saju/customerDayun";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { interpretCareerContextV3 } from "./careerContextV3";
import { selectNarrativeTraits, narrativeRhythm, type NarrativeAudit } from "./mbtiNarrative";
import { annualThemes, monthlyGifts, annualRelationScenes, annualWorkTurns, type AnnualTime } from "./annualEditorialCopy";
import type { Domain, Evidence } from "./types";

export const ANNUAL_V3_VERSION = "annual_fortune_v3.0-editorial.1" as const;
export type AnnualBlock = { id: string; title: string; domain: Domain; form: "prose" | "scene" | "gift" | "punch"; paragraphs: readonly string[]; labels: readonly string[]; evidenceRefs: readonly string[] };
export type AnnualV3Month = AnnualBlock & { month: number; timePosition: AnnualTime; focusStartKst: string; focusEndKstExclusive: string; segments: readonly { startKst: string; endKstExclusive: string; ganji: string; paragraphs: readonly string[]; labels: readonly string[]; evidenceRefs: readonly string[] }[] };
export type AnnualV3Draft = Omit<AnnualFortuneReportDraft, "version" | "productVersion"> & {
  version: typeof ANNUAL_V3_VERSION; productVersion: "v3"; evaluatedAtKst: string;
  title: string; hook: string; spoiler: string; inputSummary: readonly { label: string; value: string }[];
  opening: readonly string[]; annualSections: readonly AnnualBlock[]; editorialMonths: readonly AnnualV3Month[];
  focusMonths: readonly { month: number; title: string; reason: string; evidenceRefs: readonly string[] }[];
  finale: readonly string[]; narrativeAudit: readonly NarrativeAudit[];
};
export function isAnnualV3Draft(value: unknown): value is AnnualV3Draft {
  return !!value && typeof value === "object" && "version" in value && value.version === ANNUAL_V3_VERSION && "productVersion" in value && value.productVersion === "v3";
}
export function annualTime(start: string, end: string, now: string): AnnualTime {
  return Date.parse(now) < Date.parse(start) ? "future" : Date.parse(now) >= Date.parse(end) ? "past" : "current";
}
// Retrospective copy never leaves future promises in an already elapsed period.
function retrospective(text: string) {
  return text.replaceAll("지금은", "당시에는").replaceAll("지금의", "당시의")
    .replace(/(것|편|힘|패|시간|사람|자원|순간|접점|장면|배경|무대|기준|자산|분야|언어|리더)입니다/gu, (_, noun: string) => `${noun}${(noun.charCodeAt(noun.length - 1) - 0xac00) % 28 ? "이었습니다" : "였습니다"}`).replaceAll("있습니다", "있었습니다").replaceAll("없습니다", "없었습니다")
    .replaceAll("있어요", "있었어요").replaceAll("없어요", "없었어요").replaceAll("됩니다", "됐습니다")
    .replaceAll("생깁니다", "생겼습니다").replaceAll("커집니다", "커졌습니다").replaceAll("중요합니다", "중요했습니다")
    .replaceAll("보입니다", "보였습니다").replaceAll("남습니다", "남았습니다");
}
const timeCopy = (text: string, time: AnnualTime) => time === "past" ? retrospective(text) : text;
const godFeature: Record<TenGod, string> = { 비견: "bijian", 겁재: "jie_cai", 식신: "shi_shen", 상관: "shang_guan", 정재: "zheng_cai", 편재: "pian_cai", 정관: "zheng_guan", 편관: "qi_sha", 정인: "zheng_yin", 편인: "pian_yin" };
const periodFact = (god: TenGod, period: string, domain: Domain, id: string): Evidence => ({ id, featureId: `ten_god_${godFeature[god]}`, kind: "ten_god", subject: "person", scope: period.startsWith("annual:") ? "annual" : "monthly", period, value: god, sourceRefs: [period.startsWith("annual:") ? "src/lib/report-knowledge/annualFortuneYearRules.ts:getTenGodForStemPair" : "src/lib/report-knowledge/annualMonthJie.ts:buildAnnualMonthCalendar", id], lineage: [id], certainty: "confirmed", salience: "direct", domains: [domain] });
const labelSegment = (s: AnnualMonthSegment, extra: ExtendedMonthSegment) => [...new Set([`${s.monthPillar.stem}${s.monthPillar.branch} · ${s.stemTenGod}·${s.branchTenGod}`, ...extra.features.filter(f => f.kind !== "lifeStage").map(f => f.label), ...s.relationFacts.filter(f => f.source !== "month_natal_element").map(annualRelationLabel)])];

function relationScene(s: AnnualMonthSegment, extra: ExtendedMonthSegment, domain: Domain): { text: string; refs: string[] } | null {
  const wonjin = extra.features.find(f => f.code === "wonjin");
  if (wonjin && (domain === "love" || domain === "relationship")) return { text: "괜찮다고 답했는데 그 말투만 자꾸 다시 떠오르는 장면입니다. 가까워서 기대한 반응과 실제로 받은 반응 사이에 작은 간격이 남아요. 상대의 한마디가 내 마음 전체를 설명하는 자막은 아니라는 점에서, 감정과 사실을 나눌 여지가 있습니다.", refs: [wonjin.id] };
  const f = s.relationFacts.find(f => f.certainty === "confirmed" && f.source === "month_natal_branch" && ["충", "형"].includes(f.type))
    ?? s.relationFacts.find(f => f.certainty === "confirmed" && f.source !== "month_natal_element");
  if (!f) return wonjin ? { text: "사소한 말을 그냥 넘기려다 혼자 다시 생각하는 순간이 생길 수 있어요. 가까운 사이일수록 말하지 않은 기대가 커지는 모습입니다. 서운함의 크기보다 어떤 장면이 오래 남았는지가 관계를 이해하는 실마리예요.", refs: [wonjin.id] } : null;
  const copy = annualRelationScenes[f.type];
  return copy ? { text: copy[["career", "business", "leadership", "money"].includes(domain) ? 0 : 1], refs: [f.id] } : null;
}

export function buildAnnualV3(base: AnnualFortuneReportDraft, packet: AnnualFortuneEvidencePacket, extra: AnnualMonthExtendedEvidence, facts: readonly Evidence[], now: Date): AnnualV3Draft {
  const evaluatedAtKst = formatDayunKst(now.getTime()), year = packet.selectedYear;
  const yearTime = annualTime(`${year}-01-01T00:00:00+09:00`, `${year + 1}-01-01T00:00:00+09:00`, evaluatedAtKst);
  const context = packet.userContext, god = packet.annualFortune.stemTenGod, root = annualThemes[god], baseTheme = annualThemes[packet.annualFortune.branchTenGod];
  const work = careerEditorialScenes(context, interpretCareerContextV3(context.fieldLabel ?? ""));
  const usedTraits = new Set<string>(), narrativeAudit: NarrativeAudit[] = [];
  function fuse(domain: Domain, section: string, selectedGod: TenGod, period: string, lead: string, time: AnnualTime) {
    const signalId = packet.calendarMonths?.flatMap(m => m.segments).find(s => s.startKst === period)?.evidenceIds.find(id => id.endsWith(":ten_gods")) ?? `${period}:ten_gods`;
    const signal = periodFact(selectedGod, period, domain, signalId);
    const trait = selectNarrativeTraits({ product: "annual_fortune", fullLibrary: true, domain, section, mbti: packet.mbtiBasis.type ?? "", selectedSignals: [signal, ...facts.filter(f => f.certainty === "confirmed" && f.salience !== "supporting")], context: { ...context, relationshipStatus: context.relationshipStatus ?? undefined }, used: usedTraits })[0];
    if (!trait) return timeCopy(lead, time);
    usedTraits.add(trait.evidenceId);
    narrativeAudit.push({ section, subject: "person", traitId: trait.evidenceId, evidenceRefs: [signal.id, ...trait.matchedEvidence], sourceRefs: trait.sourceRefs, kind: trait.kind });
    const mbti = packet.mbtiBasis.type ?? "", name = packet.personContext.name;
    const behavior = trait.text.replaceAll(`${mbti}에게`, `${name}님에게`).replaceAll(`${mbti}는`, `${name}님은`).replaceAll(`${mbti}가`, `${name}님이`).replaceAll(`${mbti}의`, `${name}님의`);
    return timeCopy(`${lead} ${behavior}`, time);
  }
  const raw = (packet as AnnualFortuneEvidencePacket & { inputBasis?: { userContext?: { relationshipStatus?: string; jobStatus?: string; detailJob?: string } } }).inputBasis?.userContext;
  const relationship = raw?.relationshipStatus ?? context.relationshipStatus ?? "unknown";
  const relationshipLabels: Record<string, string> = { "": "미선택", unknown: "미선택", single: "솔로", some: "썸", dating: "연애", marriage_preparing: "결혼 준비", married: "기혼" };
  const loveScenes = relationship === "single" ? ["바쁜 날에도 어떤 사람의 메시지는 미루지 않는 자신을 발견할 수 있어요. 괜찮은 조건보다 대화 뒤 내 기분이 어땠는지가 관심을 가르는 쪽입니다.", "새 모임에서 눈이 가는 사람과 한 번 더 만나고 싶은 사람은 다를 수 있죠. 처음의 분위기와 두 번째 대화의 편안함을 따로 느끼는 재미가 있습니다.", "일과 생활이 꽉 차면 관심이 없어 보일 만큼 답장이 짧아지기도 해요. 마음이 움직일 자리와 일정에 남은 자리가 꼭 같은 것은 아닙니다."]
    : relationship === "some" ? ["친구에게는 아직 모른다고 말하면서 그 사람의 답장 시간은 기억하고 있을 수 있어요. 관심을 확인하고 싶은 마음과 먼저 티 내기는 싫은 마음이 한 화면 안에 같이 있습니다.", "다음 약속을 누가 먼저 꺼내는지보다 어떤 이야기에 대화가 길어지는지가 마음의 움직임을 보여줍니다. 조건이 맞아서가 아니라 같이 있을 때 평소와 다른 내가 나와서 궁금해지는 쪽이에요.", "짧은 답장을 해석하다 보면 아직 묻지도 않은 질문에 혼자 대답하고 있을 때가 있죠. 가까워지는 속도는 확인한 약속을 따라가도 늦지 않습니다."]
    : relationship === "marriage_preparing" ? ["같이 살 집과 예산을 고르다 보면 데이트할 때는 몰랐던 우선순위가 보입니다. 좋은 선택을 하고 싶은 마음은 같아도 어디에 돈과 시간을 더 쓰고 싶은지는 다를 수 있어요.", "결혼 준비에는 두 사람의 취향뿐 아니라 가족의 기대도 들어옵니다. 모든 의견을 만족시키려다 정작 둘이 좋아한 장면이 빠지지 않는지가 중요하죠.", "작은 결정을 하나 끝냈을 때 서로 편해졌다면, 그 방식은 행사 뒤의 생활에도 남길 만합니다. 준비를 잘하는 능력과 같이 쉬는 능력을 동시에 알아가는 시간이에요."]
    : relationship === "dating" ? ["본인은 챙김으로 다 표현했다고 생각하는데 상대는 ‘그런데 말로는?’ 하고 기다릴 수 있어요. 같이 있는 시간의 양과 마음이 닿았다는 느낌은 다른 부분입니다.", "데이트 장소보다 서로 얼마나 지쳐 있는지가 분위기를 더 바꿀 때가 있죠. 익숙해졌다고 매번 같은 방식으로 쉬고 싶은 것은 아닙니다.", "서운했던 일을 설명하다 누가 더 논리적인지가 중요해지면, 원래 듣고 싶었던 한마디는 대화 밖으로 밀려나기도 해요."]
      : relationship === "married" ? ["같이 사는 사이에서는 큰 고백보다 작은 반복이 마음을 보여줍니다. 집안일과 생활비를 누가 먼저 떠올리는지, 쉬는 시간을 서로 어떻게 지켜주는지가 가까움을 만듭니다.", "밖에서 판단을 많이 맡을수록 집에서는 아무것도 정하고 싶지 않을 수 있어요. 그런데 상대도 같은 하루를 보냈다면 저녁 메뉴 하나에 피로가 실리죠.", "가족 일정과 각자의 휴식이 겹칠 때, 같이 보내는 시간만큼 혼자 풀어지는 시간도 생활의 일부입니다. 모든 취향을 맞추는 것보다 달라도 편한 자리가 중요해요."]
        : ["가까운 사람에게 어떤 도움을 받고 싶은지가 전보다 분명해질 수 있어요. 조언이 필요한 날과 그냥 내 편인 한마디가 필요한 날은 다릅니다.", "친해지는 속도와 속얘기를 꺼내는 속도는 꼭 같지 않죠. 편한 사람 앞에서 조용해져도 어색하지 않은 순간이 관계의 깊이를 보여줍니다.", "약속이 많았던 날보다 있는 그대로 있어도 됐던 만남이 오래 남기도 해요. 누구와 자주 만나는지보다 누구 앞에서 힘을 빼는지가 선명합니다."];
  const annualRefs = [`annual:${year}:ten_gods`];
  const calendar = packet.calendarMonths ?? [];
  const first = calendar.flatMap(m => m.segments)[0];
  const active = calendar.flatMap(m => m.segments).find(s => annualTime(s.startKst, s.endKstExclusive, evaluatedAtKst) === "current") ?? first;
  const cycle = active?.activeDayunContext.cycles[0];
  const cycleTheme = cycle ? annualThemes[getTenGodForStemPair(packet.dayMaster, cycle.ganji[0] as HeavenlyStem)] : null;
  const cross = active?.activeDayunContext.status === "transition_uncertain" ? `오래 익힌 역할과 새로 맡고 싶은 역할 사이에서 ${particle(root.focus, "subject")} 선명해집니다. 넘어가는 시점에 따라 힘을 쓰는 배경은 달라져도, 이 해에 무엇을 내 것으로 남길지는 공통된 질문입니다.` : cycleTheme ? `${particle(cycleTheme.focus, "subject")} 길게 이어지는 배경에서, ${year}년에는 ${particle(root.focus, "subject")} 더 눈앞의 일이 됩니다. 큰 방향이 바뀌지 않아도 무엇을 해냈을 때 만족하는지는 달라질 수 있어요.` : `지금 가진 성향을 ${root.focus}에 써보는 한 해입니다. 밖에서 좋은 평가를 받는 일과 내가 오래 하고 싶은 일이 어디서 겹치는지가 선명해집니다.`;
  const opening = narrativeRhythm([
    root[yearTime], timeCopy(root.gift, yearTime), timeCopy(cross, yearTime),
    fuse("identity", "opening", god, `annual:${year}`, `${work.entry}. 이 장면에서 ${particle(root.focus, "called")} 올해의 관심이 실제 선택으로 드러납니다.`, yearTime),
    timeCopy(`${loveScenes[0]} ${root.overuse}`, yearTime),
  ]);
  const domainBlocks: AnnualBlock[] = [
    { id: "work", title: context.lifeStatus === "student" ? "배운 것보다, 직접 해본 이야기가 남습니다" : context.lifeStatus === "job_seeker" ? "멋진 직무명 아래에서 내가 할 하루를 봅니다" : context.lifeStatus === "business_owner" ? "매출이 커져도 내 하루는 늘어나지 않습니다" : context.lifeStatus === "freelancer" ? "다음에도 내 이름을 찾는 의뢰가 자산입니다" : "빨리 끝내서 쉬워 보였던 일의 진짜 값", domain: "career", form: "scene", paragraphs: [
      `${work.recognition}. 잘해온 일의 가치는 그 일을 처음 맡은 사람에게 설명할 때 더 선명해집니다. 쉽게 끝낸 결과만 보던 주변에도 내가 어떤 판단을 했는지 보이는 순간이에요.`,
      fuse("career", "work", god, `annual:${year}`, `${work.pressure}. ${particle(root.focus, "subject")} 중요해지는 흐름에서는 무엇을 더 할지 못지않게 어떤 일을 내 이름으로 남길지 보게 됩니다.`, yearTime),
      `${work.next}. 지금의 직업에서 좋아하는 부분과 다음 역할에서 늘리고 싶은 부분이 같을 필요는 없어요. 잘한다는 이유로 계속 맡을지, 잘하는 방식을 다른 문제에 쓸지가 갈리는 대목입니다.`,
    ], labels: [packet.annualFortune.ganji, god], evidenceRefs: annualRefs },
    { id: "money", title: /재/.test(packet.annualFortune.branchTenGod) ? "돈의 좋은 흐름, 내 생활에 남는 모양으로" : "돈보다 먼저 싸게 쓰고 있는 것은 내 시간일까요", domain: "money", form: "prose", paragraphs: [
      /재/.test(packet.annualFortune.branchTenGod) ? baseTheme.gift : "돈이 들어오는 순간만 보면 괜찮은데 끝나고 남은 시간이 너무 적을 수 있어요. 작은 부탁에 쓰는 시간, 남과 비교한 뒤 달라진 소비에도 나만의 가치 기준이 드러납니다. 큰 수익을 가정하기보다 실제로 남은 몫을 보는 쪽이 이 해의 자원 감각과 맞닿아 있습니다.",
      fuse("money", "money", packet.annualFortune.branchTenGod, `annual:${year}`, `${particle(baseTheme.focus, "called")} 현실 감각이 돈을 고르는 취향에도 스며듭니다. 같은 가격이라도 시간을 돌려주는 지출인지, 불안을 잠깐 덮는 지출인지에 따라 만족이 달라져요.`, yearTime),
    ], labels: [packet.annualFortune.branchTenGod], evidenceRefs: annualRefs },
    { id: "people", title: "친구는 많아도, 이 고민을 말할 사람은 따로 있습니다", domain: "relationship", form: "punch", paragraphs: [
      "모임에서 잘 어울리는 나와 혼자 돌아오는 길의 나는 조금 다를 수 있어요. 새로운 사람을 만나는 재미와 오래 아는 사람에게 설명하지 않아도 되는 편안함은 서로 대체되지 않습니다.",
      fuse("relationship", "people", god, `annual:${year}`, `${root.focus}에 마음을 쓰다 보면 받고 싶은 도움의 종류도 달라집니다. 해결책을 함께 고를 사람이 필요한 날도, 선택을 믿어줄 사람이 필요한 날도 있어요.`, yearTime),
    ], labels: [god], evidenceRefs: annualRefs },
    { id: "love", title: relationship === "single" ? "관심 없는 척하기엔 그 답장을 기다리고 있습니다" : relationship === "married" ? "같이 사는 사랑에는 쉬는 자리도 필요합니다" : relationship === "dating" ? "챙김에는 자신 있는데, 자막이 필요한 순간" : "힘을 빼도 괜찮은 사람 앞에서", domain: "love", form: "scene", paragraphs: [loveScenes[0], fuse("love", "love", packet.annualFortune.branchTenGod, `annual:${year}`, loveScenes[1], yearTime), loveScenes[2]], labels: [packet.annualFortune.branchTenGod], evidenceRefs: annualRefs },
    { id: "study", title: "설명하다 보면, 내가 진짜 아는 것이 보입니다", domain: "study", form: "prose", paragraphs: [
      `${work.learning}. 익숙한 경험을 다시 보면 처음에는 보이지 않던 차이가 나타납니다. 공부의 양보다 질문의 수준이 달라질 때 내가 자랐다는 감각이 생겨요.`,
      fuse("study", "study", packet.annualFortune.branchTenGod, `annual:${year}`, `${particle(baseTheme.focus, "subject")} 배움의 선택에도 기준이 됩니다. 남들이 권한 자료를 모으는 것과 지금 막힌 문제를 풀며 남긴 기록은 손에 남는 깊이가 다릅니다.`, yearTime),
    ], labels: [packet.annualFortune.branchTenGod], evidenceRefs: annualRefs },
    { id: "outside", title: "익숙한 나를 다르게 보게 하는 자리", domain: "lifestyle", form: "scene", paragraphs: [`${work.outside}. 다른 사람의 방식에 반응하는 순간 내가 익숙함 속에서 무엇을 지키고 있었는지도 보입니다. 큰 이동이 아니어도 취미 모임이나 짧은 여행이 일상의 질문을 바꿀 수 있어요.`, "계획을 잘 지킨 날과 예상 밖의 일을 반갑게 받아들인 날은 다른 만족을 남깁니다. 늘 잘하던 역할에서 잠깐 내려오면 새로운 환경에서의 나를 발견하는 재미도 있어요."], labels: [packet.annualFortune.ganji], evidenceRefs: annualRefs },
    { id: "rhythm", title: "할 수 있는 양과 편하게 사는 양은 다릅니다", domain: "lifestyle", form: "punch", paragraphs: [root.overuse, "일정 사이에 남은 빈칸을 보면 생활의 우선순위가 보입니다. 잠들기 직전까지 답장을 처리한 날에는 아무것도 안 하는 시간이 괜히 불안할 수도 있죠. 쉬는 시간을 보상처럼 기다리면 잘해낸 날일수록 더 늦게 쉬게 됩니다."], labels: [god], evidenceRefs: annualRefs },
  ];
  const natalRelation = packet.natalAnnualRelations.interactions.find(r => r.affectedPillars?.some(p => p === "day" || p === "month")) ?? packet.natalAnnualRelations.interactions[0];
  if (natalRelation && annualRelationScenes[natalRelation.type]) domainBlocks.unshift({ id: "year-relation", title: ["충", "형", "파", "해"].includes(natalRelation.type) ? "익숙한 방식이 흔들릴 때, 내 기준도 보입니다" : "따로 잘하던 것들이 한 방향으로 이어집니다", domain: root.domain, form: "scene",
    paragraphs: [annualRelationScenes[natalRelation.type][0], `${annualThemes[packet.annualFortune.branchTenGod].current} ${root.overuse}`], labels: [`${natalRelation.branches.join("")} ${natalRelation.type}`], evidenceRefs: [`annual:${year}:natal:${natalRelation.type}:${natalRelation.branches.join("")}`] });
  const annualSections = domainBlocks.sort((a, b) => Number(b.domain === root.domain || b.domain === baseTheme.domain) - Number(a.domain === root.domain || a.domain === baseTheme.domain)).map(b => ({ ...b, paragraphs: narrativeRhythm(b.paragraphs.map(p => timeCopy(p, yearTime))) }));

  const seenHeroes = new Set<string>();
  const editorialMonths = calendar.map((month): AnnualV3Month => {
    const extensions = extra.months.find(m => m.month === month.month)!;
    // A civil month has two (occasionally more) periods. Never assign its
    // post-Jie feature to the carry-over days at the start of the month.
    const current = month.segments.find(s => annualTime(s.startKst, s.endKstExclusive, evaluatedAtKst) === "current");
    const focus = current ?? month.segments.find(s => s.boundaryReason.some(b => b.startsWith("jie:"))) ?? month.segments[0];
    const ext = extensions.segments.find(s => s.startKst === focus.startKst)!;
    const time = annualTime(month.startKst, month.endKstExclusive, evaluatedAtKst), theme = annualThemes[focus.stemTenGod];
    const gift = ext.features.find(f => monthlyGifts[f.code] && !seenHeroes.has(f.code));
    if (gift) seenHeroes.add(gift.code);
    const hero = gift ? monthlyGifts[gift.code] : null, domain = hero?.domain ?? theme.domain;
    const relation = relationScene(focus, ext, domain);
    const scenes = [work.entry, work.conversation, work.craft, work.recognition, work.outside, work.handoff, work.pressure, work.learning, work.next];
    const scene = domain === "love" || domain === "relationship" ? loveScenes[(month.month - 1) % loveScenes.length]
      : `${scenes[(month.month - 1) % scenes.length]}. ${annualWorkTurns[focus.branchTenGod]}`;
    const segmentTime = annualTime(focus.startKst, focus.endKstExclusive, evaluatedAtKst);
    const main = [theme[segmentTime], hero ? timeCopy(hero.text, segmentTime) : timeCopy(theme.gift, segmentTime),
      fuse(domain, `month-${month.month}`, focus.stemTenGod, focus.startKst, scene, segmentTime),
      relation ? timeCopy(relation.text, segmentTime) : timeCopy(theme.overuse, segmentTime)];
    if (hero) [main[0], main[1]] = [main[1], main[0]];
    else if (relation && focus.relationFacts.some(f => f.certainty === "confirmed" && ["충", "형"].includes(f.type))) main.unshift(main.pop()!);
    if (time === "current") {
      const next = calendar.flatMap(m => m.segments).find(s => Date.parse(s.startKst) >= Date.parse(focus.endKstExclusive) && s.boundaryReason.some(b => b.startsWith("jie:")));
      main.push(timeCopy(loveScenes[2], time));
      main.push(next ? `지금의 ${particle(theme.focus, "object")} 지나면 다음 절입에서는 ${particle(annualThemes[next.stemTenGod].focus, "subject")} 눈에 들어옵니다. 오늘 남길 만한 것은 성급한 새 계획보다 이미 해본 선택의 기록입니다. ${work.next}에 그 기록이 내 기준을 더 또렷하게 해줄 수 있어요.` : `한 해의 마지막에는 ${theme.focus} 중 무엇을 내 생활에 남길지가 중요합니다. 잘해낸 일을 전부 계속할 필요는 없어요. 다시 하고 싶은 방식과 충분히 해본 역할을 나눠보세요.`);
    }
    const otherSegments = month.segments.filter(s => s !== focus).map(s => {
      const x = extensions.segments.find(e => e.startKst === s.startKst)!, t = annualTime(s.startKst, s.endKstExclusive, evaluatedAtKst), th = annualThemes[s.stemTenGod];
      const r = relationScene(s, x, th.domain);
      const carried = month.month > 1 && s === month.segments[0] && x.ganji === extra.months[month.month - 2].segments.at(-1)?.ganji;
      const continuation = `${month.month - 1}월 말부터 이어지는 ${th.focus}. ${s.activeDayunContext.status === "transition_uncertain" ? "같은 월운 안에서도 오래 이어온 배경이 바뀌는 범위를 지나고 있습니다." : "달력은 새 달이 되어도 절입 전까지는 앞서 다루던 주제가 이어집니다."} ${t === "past" ? "이때 마무리하지 못했던 일과 다음 구간에서 새로 시작한 일을 나눠 떠올려볼 수 있어요." : "새 계획을 늘리기 전에 진행 중인 약속이 어디까지 왔는지 보이는 짧은 연결 구간이에요."}`;
      return { startKst: s.startKst, endKstExclusive: s.endKstExclusive, ganji: x.ganji,
        paragraphs: narrativeRhythm(carried ? [continuation] : [th[t], ...(r ? [timeCopy(r.text, t)] : [])]), labels: labelSegment(s, x), evidenceRefs: [...s.evidenceIds, ...x.features.map(f => f.id)] };
    });
    return { id: `month-${month.month}`, month: month.month, title: hero?.title ?? theme.title, domain,
      form: gift ? "gift" : relation ? "scene" : "prose", timePosition: time, focusStartKst: focus.startKst, focusEndKstExclusive: focus.endKstExclusive,
      paragraphs: narrativeRhythm(main), labels: labelSegment(focus, ext), evidenceRefs: [...focus.evidenceIds, ...ext.features.map(f => f.id)], segments: otherSegments };
  });
  // Reuse the existing significance tiers; add supported good-gift candidates
  // only to fill the 3–5 editorial slots, never a customer-visible score.
  const important = packet.annualReading?.months.filter(m => m.tier !== "basic") ?? [];
  const orderedMonths = [...important.map(m => m.month), ...editorialMonths.filter(m => m.form === "gift").map(m => m.month), ...editorialMonths.map(m => m.month)];
  const focusMonths = [...new Set(orderedMonths)].slice(0, 5).map(number => {
    const m = editorialMonths.find(m => m.month === number)!, reading = important.find(r => r.month === number);
    return { month: number, title: m.title, reason: reading?.tier === "transition" ? "절입·교운 전후의 배경이 달라지는 달" : reading?.tier === "focus" ? "원국과 만나는 관계 작용을 자세히 볼 달" : m.form === "gift" ? "확인된 좋은 패를 눈여겨볼 달" : "월운의 주제가 생활에서 어떻게 나타나는지 볼 달", evidenceRefs: reading?.reasons.flatMap(r => r.evidenceIds) ?? m.evidenceRefs };
  });
  const finale = narrativeRhythm([
    timeCopy(`${packet.personContext.name}님의 ${year}년에는 ${particle(root.focus, "called")} 중심이 있습니다. 해낸 일의 개수보다 어떤 순간에 자기 존재감이 살아났는지가 더 오래 남아요. 처음에는 어려웠는데 이제는 이유를 설명할 수 있는 선택, 그 변화가 다음 해의 내가 가진 기반입니다.`, yearTime),
    timeCopy(`일과 돈에서는 ${particle(baseTheme.focus, "object")} 빼놓기 어렵습니다. ${work.handoff}. 직접 해온 것을 다른 사람에게 건네보면 당연하게 넘긴 능력에도 이름이 붙습니다.`, yearTime),
    timeCopy(relationship === "married" ? "사람과 사랑에서는 함께 사는 방식 안에 각자의 쉴 자리가 남는지가 중요합니다. 좋은 관계는 한 사람이 모든 것을 알아서 해주는 모양만은 아니에요." : relationship === "single" ? "새로운 관계는 바쁜 생활을 방해하는 사건만은 아닙니다. 어느 대화 뒤에 내 표정이 풀렸는지 기억하면, 잘 맞는 조건보다 편안한 사람을 알아보는 감각이 남아요." : "가까운 관계에 남길 것은 완벽한 설명보다 서로 힘을 뺄 수 있었던 순간입니다. 모든 차이를 고치지 않아도 같이 있을 때 편한 구석은 자랄 수 있어요.", yearTime),
    fuse("lifestyle", "finale", god, `annual:${year}`, "배움과 생활은 성과의 뒤에 남는 부록이 아닙니다. 오래 쓰고 싶은 실력과 오래 지키고 싶은 하루를 같이 고를 때, 바빴다는 기억 말고 나에게 남은 변화가 생깁니다.", yearTime),
    root.punch,
  ]);
  return { ...base, version: ANNUAL_V3_VERSION, productVersion: "v3", evaluatedAtKst,
    title: `${packet.personContext.name}님의 ${year}년, 한 해의 결`, hook: root.title, spoiler: `${root.focus} · ${baseTheme.focus}`,
    inputSummary: [{ label: "선택 연도", value: `${year}년` }, { label: "현재 상태", value: raw?.jobStatus === "" ? "미선택" : USER_LIFE_STATUS_LABELS[context.lifeStatus] }, ...(raw?.detailJob ? [{ label: context.lifeStatus === "student" ? "관심 분야" : "현재 직업", value: raw.detailJob }] : !raw && context.fieldLabel ? [{ label: context.lifeStatus === "student" ? "관심 분야" : "현재 직업", value: context.fieldLabel }] : []), { label: "관계 상태", value: relationshipLabels[relationship] ?? USER_RELATIONSHIP_STATUS_LABELS.unknown }, { label: "MBTI", value: packet.mbtiBasis.type || "모름" }],
    opening, annualSections, editorialMonths, focusMonths, finale, narrativeAudit };
}

export function annualV3CustomerText(draft: AnnualV3Draft): string {
  return [draft.title, ...draft.inputSummary.map(r => `${r.label} · ${r.value}`), draft.hook, draft.spoiler, ...draft.opening,
    ...draft.annualSections.flatMap(s => [s.title, ...s.paragraphs, ...s.labels]),
    ...draft.editorialMonths.flatMap(m => [`${m.month}월 · ${m.title}`, ...m.paragraphs, ...m.labels, ...m.segments.flatMap(s => [s.startKst, s.endKstExclusive, ...s.paragraphs, ...s.labels])]), ...draft.finale].join("\n\n");
}
