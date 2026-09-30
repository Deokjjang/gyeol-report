import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "../report-generation/reportInputTypes";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { depthFeature } from "./materialDepth";
import { materialParagraph, paragraph, proof, takeSeeds, uniqueRefs } from "./copyRealizer";
import { selectSignature } from "./narrativeSignatures";
import { domainParagraph, domainTitle, present, section, selectMaterial } from "./narrativeComposer";
import { FORTUNE_STORIES } from "./narrativeStories";
import { fusionScene } from "./narrativeFusionScenes";
import { LOVE_STATE_COPY, narrativeContext } from "./narrativeContext";
import { natalTexture } from "./narrativeNatalTexture";
import { MASTER_DIRECTIONS, PORTRAITS, STRUCTURE_STORIES } from "./narrativePortraits";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeBlock, NarrativeInput, NarrativeSection, NarrativeState, ComprehensiveNarrative } from "./narrativeTypes";
import type { FortuneComposite } from "./types";

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
  // Reserve the distinct day-pillar ending before using material elsewhere.
  const ending = takeSeeds(state, pillar, ["ending"]);
  const masterEnding = takeSeeds(state, master, ["ending"]);
  const signature = selectSignature(state), context = narrativeContext(input), love = LOVE_STATE_COPY[input.context.relationshipStatus];
  const portrait = PORTRAITS[master.feature];
  const direction = MASTER_DIRECTIONS[master.feature];
  const coreProof = signature.fusions.length ? proof([], [], signature.fusions, [`v4:signature:${signature.id}`]) :
    proof([pillar], pillar.material.seeds.filter(s => ["character", "inside", "strength"].includes(s.role)), [], [`v4:signature:${signature.id}`]);
  const gifts = fortunes(state);
  const opening: NarrativeBlock[] = [paragraph("opening-character", signature.opening.replace(/^이 사람은/, `${input.name.trim()}님은`), coreProof, "positive")];
  if (signature.gift) opening.push(paragraph("opening-gift", signature.gift, coreProof, "positive"));
  opening.push(...present([materialParagraph(state, "opening-real-life", pillar, ["scene", "inside"], { scene: "opening-daily", tone: "observation" })]));
  if (signature.fusions.length) {
    const kinds = new Set(signature.fusions.map(f => f.kind));
    const bridge = kinds.has("contrast") ? `사주에 보이는 마음과 ${signature.fusions[0].mbtiEvidence.type}의 행동이 서로 다른 표정을 만들어냅니다. 어느 한쪽만 보고 성격을 단정하기 어려운, 당신다운 반전입니다.` :
      kinds.has("complement") ? `명리에서 덜 드러난 표현을 ${signature.fusions[0].mbtiEvidence.type}의 관심과 반응이 다른 길로 꺼냅니다. 말이 많은가 적은가보다 어떤 자리에서 마음이 움직이는가가 더 중요합니다.` :
      `사주도 ${signature.fusions[0].mbtiEvidence.type}도 여기서는 같은 말을 하고 있네요. 마음이 중요하게 여기는 것과 실제로 움직이는 방식이 같은 쪽을 바라봅니다.`;
    opening.push(paragraph("opening-bridge", bridge, coreProof, "observation"));
  }
  if (gifts[0]) opening.push(paragraph("opening-fortune", gifts[0].directCopySeed, fortuneProof(gifts[0]), "positive", undefined, "punch"));
  else opening.push(...present([materialParagraph(state, "opening-owned-gift", master, ["strength", "fortune"], { tone: "positive" })]));

  const sections: NarrativeSection[] = [];
  const structureOrder = ["wealthHeavyWeakDaymaster", "killingResourceFlow", "officerResourceFlow", "hurtingOfficerMeetsOfficer", "wealthCreatesOfficer", "outputCreatesWealth"];
  const structure = structureOrder.flatMap(id => packet.selected.find(m => m.feature === `v4_structure:${id}`) ?? [])[0];
  const strength = selectMaterial(state, "strengths", ["strength"], [structure?.feature ?? ""]) ?? master;
  sections.push(section("strengths", direction[0], "strengths", [
    materialParagraph(state, "strength-person", master, ["character", "strength"], { tone: "positive" }),
    materialParagraph(state, "strength-owned", strength, ["strength", "scene", "inside"], { tone: "positive", scene: `strength:${strength.feature}` }),
  ]));
  if (portrait) sections.push(section("portrait", portrait.title, "identity", [
    materialParagraph(state, "portrait-visible", pillar, ["character", "strength"], { tone: "positive" }),
    paragraph("portrait-seen", `${portrait.seen} ${input.calculation.dayMaster} 일간의 모습은 ${master.material.imagery}에 가깝습니다.`, proof([master], [], [], [`v4:portrait:${master.feature}:seen`]), "positive", "others-see-me"),
  ]));
  if (structure) {
    const story = STRUCTURE_STORIES[structure.feature.split(":")[1]];
    const seeds = takeSeeds(state, structure, ["character", "strength", "inside", "scene", "work"]);
    sections.push(section("why", story[0], "identity", [
      paragraph("why-everyday", story[1], proof([structure], seeds), "positive", `structure:${structure.feature}`),
      paragraph("why-near-people", story[2], proof([structure], seeds), "observation"),
    ]));
  }

  const work = selectMaterial(state, "work", ["work"], [structure?.feature ?? ""]) ?? master;
  const action = fusionScene(packet.fusions);
  const workBlocks: (NarrativeBlock | undefined)[] = [domainParagraph(state, work, "work", "work", "work-character")];
  if (action) workBlocks.push(paragraph("work-fused-scene", `${context.setting}, ${context.scenes[action.scene]}에 그 모습이 잘 드러납니다. ${action.text}`,
    proof([], [], [action.fusion], ["input:jobStatus", "input:detailJob", "careerContextV3:normalized-dimensions", `careerEditorialScenes:${action.scene}`]), "positive", `job-${action.scene}`));
  else workBlocks.push(materialParagraph(state, "work-personal", pillar, ["work", "strength"], {
    before: `${context.setting}, ${context.scenes.entry}을 떠올려보면 좋습니다.`, tone: "positive", scene: "job-entry" }));
  const workOther = selectMaterial(state, "work", ["work"], [work.feature, structure?.feature ?? ""]);
  if (workOther) workBlocks.push(domainParagraph(state, workOther, "work", "work", "work-other-face"));
  sections.push(section("work", domainTitle(work, "work", "잘하는 장면에서는 표정부터 달라집니다"), "work", workBlocks));

  const money = selectMaterial(state, "money", ["money", "work"], [structure?.feature ?? ""]) ?? pillar;
  const moneyRole = money.material.seeds.some(s => s.role === "money") ? "money" : "work";
  sections.push(section("money", domainTitle(money, "money", "얼마를 쓰는지보다 무엇에 마음이 가는지"), "money", [
    paragraph("money-context", context.money, proof([], [], [], ["input:jobStatus", "v4:context:money"]), "observation", "money-in-life"),
    domainParagraph(state, money, "money", moneyRole, "money-person"),
    materialParagraph(state, "money-taste", master, ["money"], { tone: "observation", scene: "spending-choice" }),
  ]));

  const relations = selectMaterial(state, "relationships", ["relationships"]) ?? master;
  const natal = natalTexture(input);
  sections.push(section("relationships", domainTitle(relations, "relationships", "사람들 사이에서 남기는 내 자리"), "relationships", [
    domainParagraph(state, relations, "relationships", "relationships", "people-character"),
    materialParagraph(state, "people-reversal", master, ["relationships"], { tone: "positive" }),
    ...natal.filter(b => b.id === "natal-relations"),
  ]));

  const lover = selectMaterial(state, "love", ["love", "relationships"]) ?? master;
  const loverRole = lover.material.seeds.some(s => s.role === "love") ? "love" : "relationships";
  const loveOther = selectMaterial(state, "love", ["love"], [lover.feature]);
  sections.push(section("love", domainTitle(lover, "love", love.title), "love", [
    paragraph("love-state", love.entry, proof([], [], [], ["input:relationshipStatus"]), "observation"),
    domainParagraph(state, lover, "love", loverRole, "love-character"),
    loveOther ? domainParagraph(state, loveOther, "love", "love", "love-other-face") : undefined,
    portrait ? paragraph("love-near-you", `${love.scene}을 떠올려보세요. ${portrait.affection}`,
      proof([master], [], [], ["input:relationshipStatus", `v4:portrait:${master.feature}:affection`]), "positive", "love-state-scene") : undefined,
    materialParagraph(state, "love-pillar", pillar, ["love"], { after: love.ending, tone: "positive" }),
  ]));

  // Short direct flaws, surrounded by substantially more positive prose.
  const shadowRoots = signature.fusions.flatMap(f => f.myeongliEvidence.map(d => packet.selected.find(m => m.feature === depthFeature(d.evidence.feature))))
    .filter(m => m && m.material.seeds.some(s => s.role === "shadow"));
  const shadow = shadowRoots.find(m => m?.feature === "sinsal_hyeonchim") ?? shadowRoots[0] ??
    selectMaterial(state, "weaknesses", ["shadow"], [strength.feature]) ?? master;
  sections.push(section("shadow", direction[1], "weaknesses", [
    materialParagraph(state, "shadow-direct", master, ["shadow", "punch"], { tone: "shadow", mode: "punch", scene: "master-overuse" }),
    materialParagraph(state, "shadow-second", shadow, ["shadow", "punch"], { tone: "shadow", scene: `shadow:${shadow.feature}` }),
    materialParagraph(state, "shadow-question", pillar, ["question"], { mode: "question", tone: "observation" }),
  ]));

  const study = selectMaterial(state, "study", ["study"]) ?? master;
  const privateMaterial = packet.selected.find(m => m.feature === "twelve_sinsal_hwagae") ?? study;
  sections.push(section("private", domainTitle(study, "study", "혼자 있을 때 더 깊어지는 관심"), "study", [
    domainParagraph(state, study, "study", "study", "private-thinking"),
    materialParagraph(state, "private-world", privateMaterial, ["inside", "scene"], { scene: "private-interest", tone: "observation" }),
    portrait ? paragraph("private-portrait", portrait.private, proof([master], [], [], [`v4:portrait:${master.feature}:private`]), "observation", "alone-at-home") : undefined,
    ...natal.filter(b => b.id === "natal-stage"),
  ]));

  const fortuneBlocks: NarrativeBlock[] = [];
  for (const f of gifts) {
    const [, first, second] = FORTUNE_STORIES[f.ruleId];
    fortuneBlocks.push(paragraph(`fortune-${f.ruleId}`, first, fortuneProof(f), "positive"));
    fortuneBlocks.push(paragraph(`fortune-${f.ruleId}-life`, second, fortuneProof(f), "positive"));
  }
  if (!fortuneBlocks.length) {
    const owned = selectMaterial(state, "success/fortune", ["fortune"]) ?? master;
    fortuneBlocks.push(...present([
      materialParagraph(state, "fortune-owned", owned, ["fortune", "strength", "ending"], { tone: "positive" }),
      materialParagraph(state, "fortune-master", master, ["fortune", "ending"], { tone: "positive" }),
    ]));
  }
  if (fortuneBlocks.length) sections.push(section("fortune", gifts[0] ? FORTUNE_STORIES[gifts[0].ruleId][0] : "이미 내 안에 있는 좋은 것을 작게 볼 필요는 없습니다", "success/fortune", fortuneBlocks));

  const low = packet.symbolicElements.find(e => e.state === "low"), high = packet.symbolicElements.find(e => e.state === "high");
  if (low || high) {
    const elementBlocks = present([high, low]).map((e, index) => {
      const roles = index === 0 && e.state === "high" ? ["character", "inside", "scene"] : ["relationships", "study", "work", "scene"];
      const seeds = roles.flatMap(role => e.material.seeds.find(s => s.role === role) ?? []).slice(0, 3);
      const symbol = e.element === "WOOD" ? "목" : e.element === "FIRE" ? "화" : e.element === "EARTH" ? "토" : e.element === "METAL" ? "금" : "수";
      return paragraph(`element-${e.element}`, `${symbol}의 ${e.state === "low" ? "덜 드러난 결은 생활에 빌려올 풍경으로 생각해볼 수 있습니다" : "도드라진 결을 생활 장면으로 떠올려보면 이렇습니다"}. ${seeds.map(s => s.text).join(" ")}`,
        { features: [e.material.feature], seedIds: seeds.map(s => s.id), fusionIds: [], sourceRefs: e.sourceRefs }, "observation", `symbolic-${e.element}`);
    });
    sections.push(section("environment", low?.element === "WATER" ? "나를 더 재촉하지 않는 사람 곁에서" : "내가 편해지는 사람과 풍경도 다릅니다", "relationships", elementBlocks));
  }

  const closing: NarrativeBlock[] = [];
  if (signature.direction) closing.push(paragraph("closing-character", signature.direction, coreProof, "positive"));
  else closing.push(paragraph("closing-character", direction[3], proof([master], [], [], [`v4:master-direction:${master.feature}`]), "positive"));
  closing.push(paragraph("closing-next-role", context.direction, proof([], [], [], ["input:jobStatus", "v4:context:direction"]), "direction"));
  closing.push(paragraph("closing-owned-force", masterEnding.map(s => s.text).join(" "), proof([master], masterEnding), "positive"));
  if (signature.final) closing.push(paragraph("closing-confidence", signature.final, coreProof, "positive"));
  sections.push(section("direction", direction[2], "strengths", closing));

  // Relationship-led and reflective characters do not follow the work-first order.
  const order = signature.fusions.some(f => ["love", "marriage", "relationships"].includes(f.domain)) ?
    ["portrait", "strengths", "relationships", "love", "shadow", "why", "work", "money", "private", "fortune", "environment", "direction"] :
    signature.fusions.some(f => f.kind === "contrast" || ["study", "identity"].includes(f.domain)) ?
      ["portrait", "strengths", "private", "why", "relationships", "love", "shadow", "work", "money", "fortune", "environment", "direction"] :
      ["strengths", "portrait", "why", "work", "money", "shadow", "relationships", "love", "private", "fortune", "environment", "direction"];
  const narrative: ComprehensiveNarrative = {
    version: "v4-comprehensive-narrative-1", headline: signature.headline, opening,
    sections: sections.filter(s => s.blocks.length).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)),
    finalLine: ending.map(s => s.text).join(" "), finalProof: proof([pillar], ending),
  };
  return { ok: true as const, narrative, materials: packet, editorial: reviewNarrative(narrative) };
}
