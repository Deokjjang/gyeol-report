import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import { getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import type { AnnualEvidence, AnnualMonthEvidence } from "./annualEvidence";
import type { MajorContext } from "./majorContext";
import type { NarrativeBlock } from "./narrativeTypes";
import { annualSceneDetail } from "./annualSceneDetails";
import { MAJOR_MEANINGS } from "./majorMaterials";
import { ANNUAL_MONTH_STORIES, ANNUAL_TRANSIT_STORIES } from "./annualStories";
import { paragraph, proof, particle } from "./copyRealizer";
import { annualGiftTitle, annualMonthLead } from "./annualRealization";
import { periodExplanation } from "./contentPeriod";

export type AnnualEditorialState = { godUses: Map<TenGod, number>; features: Set<string>; relations: Set<string>; fusions: Set<string>; natalRoots?: Set<string> };
const tags: Record<TenGod, readonly string[]> = {
  비견: ["autonomy", "solitude"], 겁재: ["sociability", "help", "leadership"], 식신: ["expression", "practical-learning", "experimentation"],
  상관: ["precision", "decisive-correction", "expression", "experimentation"], 편재: ["wealth", "mobility", "experience-spending"], 정재: ["wealth", "consistency", "accumulation"],
  편관: ["leadership", "decisive-correction", "precision"], 정관: ["status", "consistency", "leadership"], 편인: ["inquiry", "solitude"], 정인: ["learning", "practical-learning", "inquiry", "help"],
};

export function annualBehavior(e: AnnualEvidence, m: AnnualMonthEvidence, god: TenGod, state: AnnualEditorialState) {
  if (state.fusions.size >= 3) return null;
  const fusion = e.materials.fusions.find(f => !state.fusions.has(f.ruleId) && tags[god].includes(f.mbtiEvidence.semanticTag));
  if (!fusion) return null;
  state.fusions.add(fusion.ruleId);
  const person = fusion.ruleId.startsWith("enfp-") && fusion.mbtiEvidence.semanticTag === "inquiry"
    ? "다른 사람에게는 멀리 떨어진 이야기여도 내 머릿속에서는 이미 이어집니다. 누군가 취미 이야기를 꺼냈는데 지금 붙들던 고민의 다른 모양이 보이는 식입니다. 혼자 모은 생각을 말로 꺼내는 동안 상대의 반응이 다음 질문을 만들어줍니다. 배움이 강조되는 이 달에는 정답을 하나 더 외우는 것보다 이런 대화가 낯선 관심을 내 솜씨로 옮길 통로가 됩니다."
    : fusion.ruleId === "infj-depth" ? "이야기를 많이 듣기보다 마음에 걸린 한마디를 오래 되짚는 편입니다. 조용히 생각할 틈이 있으면 남이 지나친 뜻을 찾아내는 장점이 더 잘 살아납니다."
    : fusion.ruleId === "intp-pressure-learning-structure" ? "어려운 문제가 오면 곧장 답하기보다 먼저 원리를 찾는 편입니다. 부담을 배워야 할 질문으로 바꾸는 힘이 있어요. 배움에 힘이 실릴 때에는 그동안 피하던 복잡한 주제도 내 방식으로 풀어볼 만합니다."
    : fusion.ruleId.startsWith("intp-") && fusion.mbtiEvidence.semanticTag === "inquiry" ? "설명을 듣고도 왜 그런지 납득해야 손이 움직이는 사람입니다. 혼자 찾아보던 질문을 실제 문제와 이어볼 때 남의 답과 다른 전문성이 남을 만해요."
    : fusion.ruleId === "entj-needle" ? "허점이 보이면 수정안부터 떠오르는 편입니다. 고치고 싶은 마음이 큰 달에는 상대의 설명이 끝나기 전에 이미 다음 답을 준비하고 있을 수 있어요. 그 속도를 직접 보여줄 작은 개선에 쓰면 예리함이 성과로 남습니다."
    : fusion.ruleId === "entj-pressure" ? "급할수록 순서를 정하고 앞에 서려는 성격입니다. 책임이 커지는 흐름에서는 결정권도 같이 원하기 쉬워요. 다 맡아야 유능한 것이 아니라 중요한 판단을 골라낼 때 리더십의 값이 커집니다."
    : fusion.ruleId === "entj-wealth" ? "노력했다는 말보다 무엇이 남았는지 보고 싶어합니다. 돈에 힘을 줄 때도 열심히 한 일을 받을 몫과 이어서 생각하는 편이에요. 보상을 이야기하는 순간까지 내 일이라고 보면 실속을 놓칠 일이 줄어들 만합니다."
    : fusion.ruleId === "estp-study" ? "충분히 알아야 안심되는 마음과 일단 해보고 싶은 마음이 함께 있습니다. 직접 부딪힌 뒤 설명을 다시 보면 아까는 지루하던 내용도 달라지죠. 배움이 강조되는 달에는 경험과 복습을 오가는 방식이 특히 잘 어울립니다."
    : fusion.ruleId === "estp-needle" ? "길게 설명을 듣는 동안에도 지금 달라진 반응을 먼저 봅니다. 빠르게 판단할 장면에서는 그 눈이 장점이 되지만, 눈앞의 답을 곧바로 전체의 답으로 삼지는 않을 때 더 정확해집니다."
    : fusion.insightSeed;
  return { fusion, block: paragraph(`month-${m.month}-behavior`, `${m.month}월의 ${particle(god, "을", "를")} ${fusion.mbtiEvidence.type}의 행동에 비춰볼까요? ${person}`,
    proof([], [], [fusion], [...m.sourceRefs, `v4:annual:behavior:${god}`]), "positive") };
}

function relationshipProse(status: string, relation: string, variant: number) {
  const scenes: Record<string, readonly [string, string]> = {
    married: ["배우자와 집안일을 나누다가 서로 당연하게 여긴 순서가 다르다는 걸 알 수 있습니다.", "가족 일정을 잡으며 둘이 쉬는 시간을 어디에 둘지 이야기해볼 장면입니다."],
    dating: ["만날 장소를 고르며 상대가 좋아하는 것을 얼마나 기억하는지 드러나는 장면입니다.", "바쁜 주의 연락을 두고 관심의 크기와 시간의 여유를 다르게 받아들일 수 있습니다."],
    some: ["다시 만나자는 말을 누가 먼저 꺼낼지 눈치를 보는 장면을 떠올릴 수 있습니다.", "가볍게 한 약속도 나와 상대가 기대한 무게는 다를 수 있어요."],
    single: ["새 모임에서 오래 이야기하고 싶은 사람의 말투나 관심사를 알아보는 장면입니다.", "마음이 간다고 평소의 생활을 전부 바꾸기보다 편한 속도로 더 알아갈 수 있습니다."],
    marriage_preparing: ["집과 예산을 고르며 두 사람이 중요하게 생각하는 생활의 순서를 맞춰보는 장면입니다.", "가족의 의견을 듣는 것과 둘의 결정을 맡기는 것은 다른 문제일 수 있어요."],
    "": ["가까운 사람과 주말을 어떻게 보낼지 고르며 서로의 취향을 알아보는 장면입니다.", "약속을 미룬 이유보다 남겨진 말투가 더 마음에 걸리는 순간을 떠올릴 수 있습니다."],
  };
  const scene = (scenes[status] ?? scenes[""])[variant % 2];
  const interaction: Record<string, string> = {
    육합: "처음부터 생각이 같지 않아도 같이 움직이며 맞출 여지가 있는 흐름입니다. 작은 선택을 나누는 재미가 관계의 편안함으로 남을 만해요.",
    반합: "내가 편한 부분과 상대가 잘하는 부분을 이어볼 틈이 있습니다. 전부 맞아야 함께할 수 있는 게 아니라 작은 공통점에서 다음 이야기가 시작될 수 있어요.",
    삼합: "둘만의 말로 막힐 때는 함께 해볼 활동이나 공통 관심사가 대화의 입구가 됩니다. 같은 방향을 보며 움직일 때 각자의 다른 재주도 도움이 될 만해요.",
    충: "좋아하는 마음과 맞추는 속도가 늘 같지는 않습니다. 나는 바로 고르고 상대는 더 생각하고 싶다면 마음의 크기보다 결정하는 박자가 다른 것일 수 있어요.",
    형: "내가 옳다고 생각하는 생활 방식이 상대에게는 잔소리처럼 들릴 수 있습니다. 같은 이야기가 반복된다면 누가 맞는지보다 어떤 약속을 서로 다르게 이해했는지가 더 중요합니다.",
    파: "작은 약속이 어긋났을 때 큰말보다 실제로 바꿔줄 한 가지가 반갑습니다. 대단한 사과를 기다리는 동안에도 다음에는 다르게 할 수 있다는 모습을 보여줄 수 있어요.",
    해: "잘해주려던 마음이 상대가 원한 도움과 어긋나면 둘 다 서운해집니다. 먼저 해결해주는 것보다 지금 무엇이 필요한지 듣는 쪽이 마음의 거리를 줄일 만합니다.",
    원진: "별뜻 없어 보이는 한마디가 혼자 있을 때 다시 떠오를 수 있습니다. 말투를 여러 번 복기하는 대신 어떤 뜻이었는지 짧게 물으면 상상으로 키운 서운함을 줄이기 좋습니다.",
  };
  return `${scene} ${interaction[relation]}`;
}

export function annualMonthNarrative(e: AnnualEvidence, m: AnnualMonthEvidence, c: MajorContext, state: AnnualEditorialState) {
  // Both exposed stem and branch-main ten-gods are canonical. Never manufacture
  // a missing family just to vary copy. Exhaustion is reported, not trimmed.
  let god = m.focus.stemTenGod;
  if ((state.godUses.get(god) ?? 0) >= 2 && (state.godUses.get(m.focus.branchTenGod) ?? 0) < 2) god = m.focus.branchTenGod;
  const occurrence = state.godUses.get(god) ?? 0;
  state.godUses.set(god, occurrence + 1);
  const variant = occurrence % 2, story = ANNUAL_MONTH_STORIES[god][variant], source = proof([], [], [], m.sourceRefs);
  const selected = m.transit.accepted.find(f => ANNUAL_TRANSIT_STORIES[f.feature] && !state.features.has(f.feature));
  if (selected) state.features.add(selected.feature);
  const gift = selected ? ANNUAL_TRANSIT_STORIES[selected.feature] : undefined;
  const aligned = !gift || ["helpers", "kindness", "mediation"].includes(gift.theme)
    || (["learning", "solitude", "explanation"].includes(gift.theme) && ["정인", "편인", "식신", "상관"].includes(god))
    || (["first-impression", "intimacy"].includes(gift.theme) && ["정관", "식신", "상관", "비견", "겁재", "편재"].includes(god))
    || (gift.theme === "mobility" && ["편재", "식신", "상관"].includes(god))
    || (["leadership", "status"].includes(gift.theme) && ["정관", "편관", "비견", "겁재"].includes(god));
  const title = gift && selected && aligned ? annualGiftTitle(selected.feature, c.mode, gift.title) : story.title;
  const timeLead = annualMonthLead(god, variant, m.time, m.month);
  const blocks: NarrativeBlock[] = [paragraph(`month-${m.month}-meaning`, `${timeLead} ${story.meaning}`, source, "positive")];
  const setting = c.scenes[god][variant];
  const settingLead = m.time === "past" ? `${particle(setting, "에", "에")} 비춰 읽어볼 만합니다.`
    : `${particle(setting, "을", "를")} 생각하면 이 흐름이 더 가까워집니다.`;
  const scene = { ...paragraph(`month-${m.month}-scene`, `${settingLead} ${annualSceneDetail(c, god, variant)}`,
    proof([], [], [], [...m.sourceRefs, ...c.provenance]), "positive", `annual:${c.mode}:${story.scene}`),
    editorial: { variant: `${god}:${variant}`, sceneFamily: `${c.mode}:${story.scene}` } };
  const use = paragraph(`month-${m.month}-use`, story.use, source, "positive");
  const giftBlock = selected && gift ? paragraph(`month-${m.month}-gift`, gift.body, proof([], [], [], selected.sourceRefs), "positive") : null;
  // Authored order depends on meaning: introspection, public result, or help.
  // All paragraphs remain; no duplicate-removing postprocessor.
  if (god === "편인" || god === "정인") blocks.push(use, scene, ...(giftBlock ? [giftBlock] : []));
  else if (giftBlock && ["helpers", "kindness", "mediation"].includes(gift!.theme)) blocks.push(giftBlock, scene, use);
  else if (giftBlock && (god === "비견" || god === "겁재")) blocks.push(scene, giftBlock, use);
  else blocks.push(scene, use, ...(giftBlock ? [giftBlock] : []));
  state.natalRoots ??= new Set();
  blocks.splice(2, 0, periodExplanation(`month-${m.month}`, `${m.month}월`, god, occurrence, e.materials, m.sourceRefs, state.natalRoots));
  const relation = m.focus.relationFacts.find(f => f.source === "month_natal_branch" && f.certainty === "confirmed" && f.affectedPillars.includes("day") && !state.relations.has(f.type));
  const wonjin = m.transit.accepted.find(f => f.feature === "wonjin" && f.observations.some(o => o.basis.anchor === "natal.day.branch"));
  const relationKey = relation?.type ?? (wonjin ? "원진" : undefined);
  // At most two distinct relation scenes; generic repetition isn't more depth.
  const relationCount = [...state.relations].filter(k => !k.startsWith("cross:")).length;
  if (relationKey && !state.relations.has(relationKey) && relationCount < 2) {
    const variant = relationCount;
    state.relations.add(relationKey);
    blocks.push(paragraph(`month-${m.month}-relationship`, relationshipProse(e.input.context.relationshipStatus, relationKey, variant),
      proof([], [], [], relation ? [relation.id] : wonjin!.sourceRefs), "observation", `annual:relationship:${variant}`));
  }
  const behavior = annualBehavior(e, m, god, state);
  if (behavior) blocks.push(behavior.block);
  const next = m.segments.find(s => Date.parse(s.startKst) > Date.parse(m.focus.startKst) && s.boundaryReason.some(b => b.startsWith("jie:")));
  if (m.time === "current" && next) blocks.push(paragraph(`month-${m.month}-next-jie`, `${m.month}월 초의 경계를 지나면 ${withKoreanParticle(MAJOR_MEANINGS[next.stemTenGod].theme, "to")} 관심이 옮겨갑니다. 지금의 일을 억지로 끝났다고 여기기보다 다음에 힘을 줄 자리가 달라지는 것으로 보면 좋겠습니다.`, proof([], [], [], next.evidenceIds)));
  const transitions = e.crossPeriods.filter(p => p.startKst > m.startKst && p.startKst < m.endKstExclusive && p.segment.boundaryReason.some(b => /dayun/.test(b)));
  for (const t of transitions) {
    const before = e.crossPeriods[e.crossPeriods.indexOf(t) - 1]?.cycles[0], after = t.cycles[0];
    if (!before || !after || before.cycle.index === after.cycle.index || t.segment.activeDayunContext.status !== "active") continue;
    const passed = Date.parse(t.startKst) <= Date.parse(e.clock.currentDate);
    blocks.push(paragraph(`month-${m.month}-transition`, `${m.month}월 ${Number(t.startKst.slice(8, 10))}일${passed ? "을 지나며" : "부터"} 큰 배경도 달라${passed ? "진 구간입니다" : "집니다"}. ${particle(MAJOR_MEANINGS[before.god].theme, "을", "를")} 바라보던 데서 ${withKoreanParticle(MAJOR_MEANINGS[after.god].theme, "to")} 무게가 옮겨${passed ? "갔는지 돌아볼 만합니다" : "갈 전망입니다"}.`, proof([], [], [], t.sourceRefs)));
  }
  // Annual/Dayun interactions stay attached to the exact focus segment. One
  // concise crossover scene is enough; never promote conditional candidates.
  const cross = m.focus.relationFacts.find(f => f.source !== "month_natal_branch" && f.source !== "month_natal_element" && f.certainty === "confirmed" && ["육합", "반합", "충"].includes(f.type));
  if (cross && !state.relations.has(`cross:${cross.type}`) && [...state.relations].filter(k => k.startsWith("cross:")).length < 2) {
    state.relations.add(`cross:${cross.type}`);
    const counterpart = "counterpart" in cross ? cross.counterpart : null;
    const cycle = counterpart?.scope === "dayun" ? e.raw.customerDayun?.cycles.find(c => c.index === counterpart.cycleIndex) : null;
    const annual = MAJOR_MEANINGS[getTenGodForStemPair(e.raw.dayMaster, cycle?.stem ?? m.focus.effectiveAnnualPillar.stem)];
    blocks.push(paragraph(`month-${m.month}-cross`, cross.type === "충"
      ? `이 달의 속도와 ${cross.source === "month_annual_branch" ? "한 해" : "큰 흐름"}의 속도가 다르게 느껴질 수 있습니다. ${particle(annual.theme, "을", "를")} 중요하게 보면서도 당장 ${particle(MAJOR_MEANINGS[god].work, "을", "를")} 챙기고 싶어지는 식이에요. 한쪽을 실패로 볼 필요 없이 순서를 나누는 것이 어울립니다.`
      : cross.type === "육합" ? `${cross.source === "month_annual_branch" ? "한 해의 방향" : "오래 이어온 큰 흐름"}과 이 달의 움직임을 함께 써볼 접점이 있습니다. ${particle(annual.theme, "을", "를")} 멀리 있는 목표로만 두지 않고 ${particle(setting, "에서도", "에서도")} 작게 실행해볼 만해요.`
        : annual.work === MAJOR_MEANINGS[god].work ? `${particle(annual.work, "은", "는")} 이 달과 더 긴 흐름이 같이 바라보는 주제입니다. 오래 생각하던 것을 ${particle(setting, "에서", "에서")} 구체화해볼 여지가 있어요. 계획의 크기를 늘리지 않아도 실제로 한 걸음 옮기는 일이 충분히 의미 있습니다.`
          : `${particle(annual.work, "과", "와")} ${particle(MAJOR_MEANINGS[god].work, "을", "를")} 함께 가져갈 연결점이 보입니다. 둘 중 하나를 버려야만 앞으로 갈 수 있는 흐름은 아니에요. ${particle(setting, "에서", "에서")} 두 관심사가 서로에게 도움이 되는 부분을 찾아볼 만합니다.`, proof([], [], [], [cross.id, ...m.focus.evidenceIds]), "positive"));
  }
  return { month: m.month, title, strongestTheme: gift && aligned ? gift.theme : MAJOR_MEANINGS[god].theme, god, occurrence, time: m.time, focus: m.focus,
    selectedTransit: selected ?? null, selectedRelation: relationKey ?? null, behavior: behavior?.fusion ?? null,
    sceneFamily: `${c.mode}:${story.scene}`, blocks, provenance: m.sourceRefs };
}
