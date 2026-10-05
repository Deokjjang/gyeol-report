import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "../report-generation/reportInputTypes";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { depthFeature } from "./materialDepth";
import { materialParagraph, paragraph as baseParagraph, editorialParagraph, particle, proof, takeSeeds, uniqueRefs } from "./copyRealizer";
import { selectSignature } from "./narrativeSignatures";
import { domainParagraph, domainTitle, present, section, selectMaterial } from "./narrativeComposer";
import { FORTUNE_STORIES } from "./narrativeStories";
import { fusionScene } from "./narrativeFusionScenes";
import { loveManifestation, narrativeContext } from "./narrativeContext";
import { natalTexture } from "./narrativeNatalTexture";
import { MASTER_DIRECTIONS, PORTRAITS, STRUCTURE_STORIES } from "./narrativePortraits";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeBlock, NarrativeInput, NarrativeSection, NarrativeState, ComprehensiveNarrative } from "./narrativeTypes";
import type { FortuneComposite } from "./types";
import { expressionFusions, expressionLens, realizeEditorialVariant } from "./narrativeVariation";
import { atomicFortunes } from "./narrativeAtomicFortune";
import { composeEvidenceChapters } from "./contentSynthesis";
import { planComprehensive, comprehensiveElements, comprehensiveGoodPair, comprehensiveManual, comprehensiveRhythm, comprehensiveRhythmTension } from "./comprehensivePlan";
import { materialLabel } from "./contentEvidence";

const known = (value: unknown, allowed: readonly string[]) => typeof value === "string" && allowed.includes(value);
const fortuneProof = (fortune: FortuneComposite) => ({ features: uniqueRefs(fortune.supportingEvidence.map(d => depthFeature(d.evidence.feature))),
  seedIds: [], fusionIds: [], sourceRefs: [...fortune.provenanceRefs, `v4:fortune-narrative:${fortune.ruleId}`] });

function fortunes(state: NarrativeState) {
  const available = state.packet.fortuneComposites;
  const superseded = new Set<string>();
  if (available.some(f => f.ruleId === "wealth-and-name")) ["recognized-place", "lead-under-pressure", "ambition-with-place"].forEach(id => superseded.add(id));
  if (available.some(f => f.ruleId === "created-value-accumulates")) superseded.add("lasting-assets");
  if (available.some(f => f.ruleId === "recognized-place")) superseded.add("lead-under-pressure");
  const order = ["wealth-and-name", "ambition-with-place", "created-value-accumulates", "people-support", "two-charms", "recognized-place", "lasting-assets", "learning-depth", "show-your-thought", "outside-opportunity", "lead-under-pressure"];
  return available.filter(f => !superseded.has(f.ruleId) && FORTUNE_STORIES[f.ruleId])
    .sort((a, b) => order.indexOf(a.ruleId) - order.indexOf(b.ruleId)).slice(0, 3);
}

/** Pure offline text composer. Nothing imports this from a route or generation runtime. */
export function composeComprehensiveNarrative(input: NarrativeInput) {
  if (!input || typeof input.name !== "string" || !input.name.trim() || input.name.length > 80 ||
      !input.context || typeof input.context.detailJob !== "string" || input.context.detailJob.length > 200 ||
      !known(input.context.jobStatus, JOB_STATUSES) || !known(input.context.relationshipStatus, RELATIONSHIP_STATUSES) || !input.calculation) {
    return { ok: false as const, errors: ["INVALID_NARRATIVE_INPUT"] };
  }
  const packet = buildMyeongliMaterialPacket({ calculation: input.calculation, mbti: input.mbti });
  const pillar = packet.selected.find(m => m.material.category === "dayPillar"), master = packet.selected.find(m => m.material.category === "dayMaster");
  if (!pillar || !master) return { ok: false as const, errors: ["UNVERIFIED_NATAL_PROFILE"] };
  const state: NarrativeState = { input, packet, pillar, master, usedSeeds: new Set(), featureUses: new Map() };
  const paragraph = (...args: Parameters<typeof baseParagraph>) => editorialParagraph(state, ...args);
  // Reserve the distinct day-pillar ending before using material elsewhere.
  const ending = takeSeeds(state, pillar, ["ending"]);
  takeSeeds(state, master, ["ending"]);
  const signature = selectSignature(state), context = narrativeContext(input), love = loveManifestation(input.context.relationshipStatus, expressionLens(state));
  const plan = planComprehensive(input, packet, signature);
  // Reserve help/introductions for the fortune chapter before selecting scenes.
  const select = (domain: Parameters<typeof selectMaterial>[1], roles: Parameters<typeof selectMaterial>[2], exclude: readonly string[] = []) =>
    selectMaterial(state, domain, roles, [...plan.peopleLuck, ...exclude]);
  const portrait = PORTRAITS[master.feature];
  const direction = MASTER_DIRECTIONS[master.feature];
  const coreProof = plan.core?.proof ?? (signature.fusions.length ? proof([], [], signature.fusions, [`v4:signature:${signature.id}`]) :
    proof([pillar], pillar.material.seeds.filter(s => ["character", "inside", "strength"].includes(s.role)), [], [`v4:signature:${signature.id}`]));
  const gifts = fortunes(state);
  const opening: NarrativeBlock[] = [paragraph("opening-character", (plan.core?.opening ?? signature.opening).replace(/^이 사람은/, `${input.name.trim()}님은`), coreProof, "positive")];
  if (!plan.core && signature.gift) opening.push(paragraph("opening-gift", signature.gift, coreProof, "positive"));
  opening.push(...present([materialParagraph(state, "opening-real-life", pillar, ["scene", "inside"], { scene: "opening-daily", tone: "observation" })]));
  if (plan.core) opening.push(plan.core.same);
  else if (signature.fusions.length) {
    const f = signature.fusions[0];
    const root = packet.selected.find(m => f.myeongliEvidence.some(d => depthFeature(d.evidence.feature) === m.feature));
    const label = root ? materialLabel(root) : "표현이 덜 드러난 분포";
    opening.push(paragraph("opening-bridge", `${label}에서 읽는 결을 ${f.mbtiEvidence.type}의 ${particle(f.sharedTheme, "과", "와")} 함께 보면 행동이 더 또렷해져요. ${f.insightSeed}`, proof(root ? [root] : [], [], [f]), "observation"));
  }
  if (plan.tension) opening.push(plan.tension);
  if (gifts[0] && gifts[0].theme !== "helpers/people-luck") opening.push(paragraph("opening-fortune", gifts[0].directCopySeed, fortuneProof(gifts[0]), "positive", undefined, "punch"));
  else opening.push(...present([materialParagraph(state, "opening-owned-gift", master, ["strength", "fortune"], { tone: "positive" })]));

  const sections: NarrativeSection[] = [];
  const structureOrder = ["wealthHeavyWeakDaymaster", "killingResourceFlow", "officerResourceFlow", "hurtingOfficerMeetsOfficer", "wealthCreatesOfficer", "outputCreatesWealth"];
  const structure = structureOrder.flatMap(id => packet.selected.find(m => m.feature === `v4_structure:${id}`) ?? [])[0];
  const strength = (plan.core ? packet.selected.find(m => m.feature === "gwiin_taegeuk") : undefined) ?? select("strengths", ["strength"], [structure?.feature ?? "", ...(plan.core?.proof.features ?? [])]) ?? master;
  const coreRecovery = Boolean(plan.core && strength.feature === "gwiin_taegeuk");
  sections.push(section("strengths", strength.feature === "gwiin_taegeuk" ? "잘 안 풀린 날에도 내 기준을 다시 찾습니다" : direction[0], "strengths", [
    materialParagraph(state, "strength-person", coreRecovery ? strength : master, coreRecovery ? ["character"] : ["character", "strength"], { tone: "positive" }),
    materialParagraph(state, "strength-owned", strength, ["strength", "scene", "inside"], { tone: "positive", scene: `strength:${strength.feature}` }),
  ]));
  if (portrait) sections.push(section("portrait", portrait.title, "identity", [
    materialParagraph(state, "portrait-visible", pillar, ["character", "strength"], { tone: "positive" }),
    paragraph("portrait-seen", `${portrait.seen} ${input.calculation.dayMaster} 일간의 모습은 ${master.material.imagery}에 가깝습니다.`, proof([master], [], [], [`v4:portrait:${master.feature}:seen`]), "positive", "others-see-me"),
  ]));
  const rhythm = comprehensiveRhythmTension(input, plan);
  const yy = rhythm?.block ?? comprehensiveRhythm(plan);
  const portraitIndex = sections.findIndex(s => s.id === "portrait");
  if (yy && portraitIndex >= 0) sections[portraitIndex] = { ...sections[portraitIndex], blocks: [...sections[portraitIndex].blocks, yy] };
  if (structure) {
    const story = STRUCTURE_STORIES[structure.feature.split(":")[1]];
    const seeds = takeSeeds(state, structure, ["character", "strength", "inside", "scene", "work"]);
    sections.push(section("why", story[0], "identity", [
      paragraph("why-everyday", story[1], proof([structure], seeds), "positive", `structure:${structure.feature}`),
      paragraph("why-near-people", story[2], proof([structure], seeds), "observation"),
    ]));
  }

  const work = select("work", ["work"], [structure?.feature ?? ""]) ?? master;
  const action = fusionScene(packet.fusions.filter(f => !f.myeongliEvidence.some(d => plan.peopleLuck.includes(depthFeature(d.evidence.feature)))), expressionLens(state));
  const workBlocks: (NarrativeBlock | undefined)[] = [domainParagraph(state, work, "work", "work", "work-character")];
  if (action) workBlocks.push(paragraph("work-fused-scene", `${context.setting}, ${context.scenes[action.scene]}에 그 모습이 잘 드러납니다. ${action.text}`,
    proof([], [], [action.fusion, ...expressionFusions(state)], ["input:jobStatus", "input:detailJob", "careerContextV3:normalized-dimensions", `careerEditorialScenes:${action.scene}`, `v4:work-context:${context.workFunction}`]), "positive", `job-${action.scene}`));
  else workBlocks.push(materialParagraph(state, "work-personal", pillar, ["work", "strength"], {
    before: `${context.setting}, ${particle(context.scenes.entry, "을", "를")} 떠올려보면 좋습니다.`, tone: "positive", scene: "job-entry" }));
  const workOther = select("work", ["work"], [work.feature, structure?.feature ?? ""]);
  if (workOther) workBlocks.push(domainParagraph(state, workOther, "work", "work", "work-other-face"));
  sections.push(section("work", domainTitle(work, "work", "잘하는 장면에서는 표정부터 달라집니다"), "work", workBlocks));

  const money = plan.wealth ?? select("money", ["money", "work"], [structure?.feature ?? ""]) ?? pillar;
  const moneyRole = money.material.seeds.some(s => s.role === "money") ? "money" : "work";
  sections.push(section("money", domainTitle(money, "money", "얼마를 쓰는지보다 무엇에 마음이 가는지"), "money", [
    paragraph("money-context", context.money, proof([], [], [], ["input:jobStatus", "v4:context:money"]), "observation", "money-in-life"),
    domainParagraph(state, money, "money", moneyRole, "money-person"),
    materialParagraph(state, "money-taste", master, ["money"], { tone: "observation", scene: "spending-choice" }),
  ]));

  const relations = select("relationships", ["relationships"]) ?? master;
  const natal = natalTexture(input).map(b => realizeEditorialVariant(state, b));
  sections.push(section("relationships", domainTitle(relations, "relationships", "사람들 사이에서 남기는 내 자리"), "relationships", [
    domainParagraph(state, relations, "relationships", "relationships", "people-character"),
    materialParagraph(state, "people-reversal", master, ["relationships"], { tone: "positive" }),
    ...natal.filter(b => b.id === "natal-relations"),
  ]));

  const lover = select("love", ["love", "relationships"]) ?? master;
  const loverRole = lover.material.seeds.some(s => s.role === "love") ? "love" : "relationships";
  const loveOther = select("love", ["love"], [lover.feature]);
  sections.push(section("love", domainTitle(lover, "love", love.title, state), "love", [
    paragraph("love-state", love.entry, proof([], [], expressionFusions(state), ["input:relationshipStatus"]), "observation"),
    domainParagraph(state, lover, "love", loverRole, "love-character"),
    loveOther ? domainParagraph(state, loveOther, "love", "love", "love-other-face") : undefined,
    portrait ? paragraph("love-near-you", `${particle(love.scene, "을", "를")} 떠올려보세요. ${portrait.affection}`,
      proof([master], [], [], ["input:relationshipStatus", `v4:portrait:${master.feature}:affection`]), "positive", "love-state-scene") : undefined,
    materialParagraph(state, "love-pillar", pillar, ["love"], { after: love.ending, tone: "positive" }),
  ]));

  // Short direct flaws, surrounded by substantially more positive prose.
  const shadowRoots = signature.fusions.flatMap(f => f.myeongliEvidence.map(d => packet.selected.find(m => m.feature === depthFeature(d.evidence.feature))))
    .filter(m => m && !plan.peopleLuck.includes(m.feature) && m.material.seeds.some(s => s.role === "shadow"));
  const shadow = shadowRoots.find(m => m?.feature === "sinsal_hyeonchim") ?? shadowRoots[0] ??
    select("weaknesses", ["shadow"], [strength.feature]) ?? master;
  sections.push(section("shadow", direction[1], "weaknesses", [
    materialParagraph(state, "shadow-direct", master, ["shadow", "punch"], { tone: "shadow", mode: "punch", scene: "master-overuse" }),
    materialParagraph(state, "shadow-second", shadow, ["shadow", "punch"], { tone: "shadow", scene: `shadow:${shadow.feature}` }),
    materialParagraph(state, "shadow-question", pillar, ["question"], { mode: "question", tone: "observation" }),
  ]));

  const study = select("study", ["study"]) ?? master;
  const privateMaterial = packet.selected.find(m => m.feature === "twelve_sinsal_hwagae") ?? study;
  sections.push(section("private", domainTitle(study, "study", "혼자 있을 때 더 깊어지는 관심", state), "study", [
    domainParagraph(state, study, "study", "study", "private-thinking"),
    materialParagraph(state, "private-world", privateMaterial, ["inside", "scene"], { scene: "private-interest", tone: "observation" }),
    portrait ? paragraph("private-portrait", portrait.private, proof([master], [], [], [`v4:portrait:${master.feature}:private`]), "observation", "alone-at-home") : undefined,
    ...natal.filter(b => b.id === "natal-stage"),
  ]));

  const fortuneBlocks: NarrativeBlock[] = comprehensiveGoodPair(plan);
  for (const f of plan.publicGift.length ? gifts.filter(f => !["helpers/people-luck", "charm", "leadership", "status/honor"].includes(f.theme)) : gifts) {
    const [, first, second] = FORTUNE_STORIES[f.ruleId];
    fortuneBlocks.push(paragraph(`fortune-${f.ruleId}`, first, fortuneProof(f), "positive"));
    fortuneBlocks.push(paragraph(`fortune-${f.ruleId}-life`, second, fortuneProof(f), "positive"));
  }
  if (!fortuneBlocks.length) {
    for (const gift of atomicFortunes(state)) {
      const seeds = takeSeeds(state, gift.material, ["fortune"]);
      fortuneBlocks.push(paragraph(`fortune-atomic-${gift.material.feature}`, gift.text,
        proof([gift.material], seeds, expressionFusions(state), [`v4:atomic-fortune:${gift.material.feature}`]), "positive"));
    }
  }
  if (!fortuneBlocks.length) {
    const owned = selectMaterial(state, "success/fortune", ["fortune"]) ?? master;
    fortuneBlocks.push(...present([
      materialParagraph(state, "fortune-owned", owned, ["fortune", "strength", "ending"], { tone: "positive" }),
      materialParagraph(state, "fortune-master", master, ["fortune", "ending"], { tone: "positive" }),
    ]));
  }
  if (fortuneBlocks.length) sections.push(section("fortune", plan.publicGift.length ? "눈에 들어오는 사람에서, 맡겨보고 싶은 사람으로" : gifts[0] ? FORTUNE_STORIES[gifts[0].ruleId][0] : atomicFortunes(state)[0]?.title ?? "이미 내 안에 있는 좋은 것을 작게 볼 필요는 없습니다", "success/fortune", fortuneBlocks));

  const low = packet.symbolicElements.find(e => e.state === "low"), high = packet.symbolicElements.find(e => e.state === "high");
  if (low || high) {
    const elementBlocks = comprehensiveElements(plan);
    sections.push(section("environment", low?.element === "WATER" ? "나를 더 재촉하지 않는 사람 곁에서" : "내가 편해지는 사람과 풍경도 다릅니다", "relationships", elementBlocks));
  }

  const closing = comprehensiveManual(plan, input, master, signature);
  if (["unemployed", "job_seeker"].includes(input.context.jobStatus)) closing[0] = { ...closing[0], text: `${closing[0].text} ${context.direction}`, proof: { ...closing[0].proof, sourceRefs: [...closing[0].proof.sourceRefs, "input:jobStatus", "input:detailJob"] } };
  sections.push(section("direction", direction[2], "strengths", closing));

  // Relationship-led and reflective characters do not follow the work-first order.
  const order = signature.fusions.some(f => ["love", "marriage", "relationships"].includes(f.domain)) ?
    ["portrait", "strengths", "relationships", "love", "shadow", "why", "work", "money", "private", "fortune", "environment", "direction"] :
    signature.fusions.some(f => f.kind === "contrast" || ["study", "identity"].includes(f.domain)) ?
      ["portrait", "strengths", "private", "why", "relationships", "love", "shadow", "work", "money", "fortune", "environment", "direction"] :
      ["strengths", "portrait", "why", "work", "money", "shadow", "relationships", "love", "private", "fortune", "environment", "direction"];
  const personalFinal = Boolean(plan.core && plan.publicGift.length && plan.tension);
  const narrative: ComprehensiveNarrative = {
    version: "v4-comprehensive-narrative-1", headline: plan.coreGyeol.headline, opening,
    sections: sections.filter(s => s.blocks.length).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)),
    finalLine: personalFinal
      ? `${input.name}님은 사람의 시선을 다음 움직임으로 바꿀 줄 아는 사람입니다. 모두의 반응까지 책임지지 않고 내 말과 시간의 값을 지킬 때, 앞에 설 기회가 나를 소모시키는 일이 아니라 내 자리가 됩니다.`
      : `${ending.map(s => s.text).join(" ")} ${signature.final || (plan.wealth ? "해낸 만큼 내 몫을 남기는 것까지 당신의 선택입니다." : "그 힘을 언제 꺼내고 언제 거둘지도 내가 고를 수 있어요.")}`,
    finalProof: personalFinal
      ? proof([...plan.publicGift, ...(plan.wealth ? [plan.wealth] : []), ...packet.selected.filter(m => [...plan.core!.proof.features, ...plan.tension!.proof.features].includes(m.feature))], [], [], [...plan.core!.proof.sourceRefs, ...plan.tension!.proof.sourceRefs])
      : proof([pillar, ...(!signature.final && plan.wealth ? [plan.wealth] : [])], ending, signature.final ? signature.fusions : []),
  };
  const composed = composeEvidenceChapters(input, packet, narrative, "comprehensive", plan);
  return { ok: true as const, ...composed, contentPlan: { ...composed.contentPlan, coreGyeol: plan.coreGyeol, wealthElements: plan.wealthElements }, materials: packet, editorial: reviewNarrative(composed.narrative) };
}
