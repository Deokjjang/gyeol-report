import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { materialLabel, fusionDomains } from "./contentEvidence";
import { chapterMbtiReadings } from "./contentMbti";
import { conversationalVoice } from "./contentSynthesis";
import { proof, uniqueRefs } from "./copyRealizer";
import { sentences, sentenceKey } from "./editorialGuard";
import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";
import type { NarrativeBlock, NarrativeProof } from "./narrativeTypes";
import type { MaterialSeed } from "./materialDepthTypes";
import type { Domain } from "./types";

// Editorial relevance only: reuse reviewed semantic tags, never infer a new
// natal/transit relationship or score. All seeds keep their original sources.
export function createMajorYearPersonalization(e: MajorEvidence, reserved: readonly NarrativeBlock[]) {
  const used = new Set(reserved.flatMap(b => sentences(b.text).map(sentenceKey)));
  const usedSeeds = new Set(reserved.flatMap(b => b.proof.seedIds));
  const uses = new Map<string, number>();
  const usedFusions = new Set(reserved.flatMap(b => b.proof.fusionIds));
  const traits = new Set(reserved.flatMap(b => b.proof.sourceRefs.flatMap(ref => {
    const m = ref.match(/^mbti:([^:]+):traits:[^:]+:(.+)$/);
    return m ? [`${m[1]}:${m[2]}`] : [];
  })));
  const fresh = (seed: MaterialSeed | undefined): seed is MaterialSeed => Boolean(seed && !usedSeeds.has(seed.id)
    && ![seed.text, conversationalVoice(seed.text, 1)].some(t => sentences(t).some(s => used.has(sentenceKey(s)))));
  const reserve = (seed: MaterialSeed) => {
    usedSeeds.add(seed.id);
    for (const t of [seed.text, conversationalVoice(seed.text, 1)]) for (const s of sentences(t)) used.add(sentenceKey(s));
  };
  const merge = (a: NarrativeProof, b: NarrativeProof): NarrativeProof => ({
    features: uniqueRefs([...a.features, ...b.features]), seedIds: uniqueRefs([...a.seedIds, ...b.seedIds]),
    fusionIds: uniqueRefs([...a.fusionIds, ...b.fusionIds]), sourceRefs: uniqueRefs([...a.sourceRefs, ...b.sourceRefs]),
  });
  return (y: MajorYearEvidence, blocks: readonly NarrativeBlock[]): NarrativeBlock[] => {
    const god = [...MATERIAL_BY_FEATURE.values()].find(m => m.label === y.annual.tenGod && m.feature.startsWith("ten_god_"));
    if (!god || !y.annual.evidenceIds.length) return [...blocks];
    const domains: readonly Domain[] = ["정재", "편재"].includes(y.annual.tenGod) ? ["money", "work"]
      : ["정인", "편인"].includes(y.annual.tenGod) ? ["study", "work"]
      : y.annual.tenGod === "겁재" ? ["relationships", "work"] : ["work", "relationships"];
    const eligible = e.materials.selected.filter(m => m.evidence.length && m.evidence.every(d => d.usable && d.strength === "strong")
      && (MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(tag => god.semanticTags.includes(tag))
        || ["dayMaster", "dayPillar"].includes(m.material.category)));
    const options = eligible.flatMap(root => {
      const seed = domains.flatMap(domain => root.material.seeds.filter(s => s.role === domain && fresh(s)))[0];
      return seed ? [{ root, seed }] : [];
    }).sort((a, b) => Number(["dayMaster", "dayPillar"].includes(a.root.material.category)) - Number(["dayMaster", "dayPillar"].includes(b.root.material.category))
      || (uses.get(a.root.feature) ?? 0) - (uses.get(b.root.feature) ?? 0)
      || Number(b.root.feature === god.feature) - Number(a.root.feature === god.feature)
      || Math.max(...b.root.evidence.map(d => d.evidence.weight ?? 0)) - Math.max(...a.root.evidence.map(d => d.evidence.weight ?? 0))
      || a.root.feature.localeCompare(b.root.feature));
    const choice = options[0];
    if (!choice) return [...blocks]; // No novel, applicable evidence: retain the safe authored scene.
    const { root, seed } = choice, label = materialLabel(root);
    uses.set(root.feature, (uses.get(root.feature) ?? 0) + 1); reserve(seed);
    const shadow = root.material.seeds.find(s => s.role === "shadow" && fresh(s));
    const question = root.material.seeds.find(s => s.role === "question" && fresh(s));
    const domain = seed.role as Domain;
    const reading = chapterMbtiReadings(e.input.mbti, [root], domain, traits)
      .find(r => !sentences(`${r.behavior} ${r.combined}`).some(s => used.has(sentenceKey(s))));
    const fusion = !reading ? e.materials.fusions.find(f => !usedFusions.has(f.ruleId) && fusionDomains(f).includes(domain)
      && f.myeongliEvidence.some(d => root.evidence.some(r => r.evidence.feature === d.evidence.feature))
      && !sentences(conversationalVoice(f.insightSeed, 1)).some(s => used.has(sentenceKey(s)))) : undefined;
    const strength = seed.role === "relationships" ? root.material.seeds.find(s => s.role === "strength" && fresh(s)) : undefined;
    if (strength) reserve(strength);
    const giftSeed = strength ?? seed;
    const extra = proof([root], [giftSeed], [], god.sourceRefs);
    const replacements = new Map<string, { text: string; proof: NarrativeProof }>();
    replacements.set("gift", { text: `${y.year}년의 선택에 보탤 내 바탕은 원국의 ${label} 성향입니다. ${conversationalVoice(giftSeed.text, 1)}`, proof: extra });
    if (shadow && blocks.some(b => b.id === `${y.year}-friction`)) {
      reserve(shadow);
      const action = sentences(blocks.find(b => b.id === `${y.year}-friction`)!.text).at(-1);
      replacements.set("friction", { text: `${y.year}년에 이 강점을 쓸 때는 ${label}의 반대편도 살펴보세요. ${conversationalVoice(shadow.text, 1)}${action ? ` ${action}` : ""}`, proof: proof([root], [shadow]) });
    }
    const focus = domain === "money" ? "지출 기준" : domain === "study" ? "학습 습관" : domain === "relationships" ? "관계 속 경계" : "역할 선택";
    if (reading || fusion || question) {
      const lens = reading ? `${reading.behavior} ${reading.combined}` : fusion ? conversationalVoice(fusion.insightSeed, 1) : "";
      const intro = reading || fusion ? `${y.year}년의 사건 예측과는 별개로, 원국 ${label} 성향과 ${e.input.mbti}의 평소 반응도 함께 봅니다.`
        : `${y.year}년의 ${withKoreanParticle(focus, "object")} 생각할 때는 원국 ${label} 성향을 이런 질문에 비춰보세요.`;
      const text = [intro, lens, question?.text].filter(Boolean).join(" ");
      if (question) reserve(question);
      if (reading) traits.add(reading.id);
      if (fusion) usedFusions.add(fusion.ruleId);
      for (const s of sentences(lens)) used.add(sentenceKey(s));
      replacements.set("scene", { text, proof: proof([root], question ? [question] : [], fusion ? [fusion] : [], reading ? [reading.provenance] : []) });
    }
    return blocks.map(b => {
      const role = b.id.slice(String(y.year).length + 1), replacement = replacements.get(role);
      // The portrait names the year's question. Its old second sentence often
      // repeated the scene or assumed a future craft/experience; the other slots
      // now supply an evidenced strength, personal response and distinct risk.
      if (role === "character") return { ...b, text: sentences(b.text)[0] ?? b.text };
      if (!replacement) return b;
      return { ...b, text: replacement.text, proof: merge(b.proof, replacement.proof) };
    });
  };
}
