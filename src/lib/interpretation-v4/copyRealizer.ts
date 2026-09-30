import type { MaterialSeed, SeedRole } from "./materialDepthTypes";
import type { BoundMaterial } from "./materialPacket";
import type { NarrativeBlock, NarrativeMode, NarrativeProof, NarrativeState, NarrativeTone } from "./narrativeTypes";
import type { FusionInterpretation } from "./types";
import { realizeEditorialVariant } from "./narrativeVariation";

export const uniqueRefs = (values: readonly string[]) => [...new Set(values)].sort();
export const cleanCopy = (text: string) => text.replace(/\s+/g, " ").trim();
export function particle(word: string, final: string, open: string) {
  const code = word.trim().charCodeAt(word.trim().length - 1) - 0xac00;
  return word + (code >= 0 && code <= 11171 && code % 28 !== 0 ? final : open);
}
export function proof(materials: readonly BoundMaterial[] = [], seeds: readonly MaterialSeed[] = [], fusions: readonly FusionInterpretation[] = [], extra: readonly string[] = []): NarrativeProof {
  return { features: uniqueRefs([...materials.map(m => m.feature), ...fusions.flatMap(f => f.myeongliEvidence.map(d => d.evidence.feature))]),
    seedIds: uniqueRefs(seeds.map(s => s.id)), fusionIds: uniqueRefs(fusions.map(f => f.ruleId)),
    sourceRefs: uniqueRefs([...materials.flatMap(m => m.sourceRefs), ...fusions.flatMap(f => f.provenanceRefs), ...extra]) };
}
/** Reserve whole seeds, never chop arbitrary words into a new claim. */
export function takeSeeds(state: NarrativeState, material: BoundMaterial, roles: readonly SeedRole[]): MaterialSeed[] {
  const result = roles.flatMap(role => {
    const seed = material.material.seeds.find(s => s.role === role && !state.usedSeeds.has(s.id));
    if (!seed) return [];
    state.usedSeeds.add(seed.id); return [seed];
  });
  if (result.length) state.featureUses.set(material.feature, (state.featureUses.get(material.feature) ?? 0) + 1);
  return result;
}
export function paragraph(id: string, text: string, sources: NarrativeProof, tone: NarrativeTone = "observation", scene?: string, mode: NarrativeMode = "prose"): NarrativeBlock {
  return { id, text: cleanCopy(text), mode, tone, ...(scene ? { scene } : {}), proof: sources };
}
export function editorialParagraph(state: NarrativeState, ...args: Parameters<typeof paragraph>): NarrativeBlock {
  return realizeEditorialVariant(state, paragraph(...args));
}
export function materialParagraph(state: NarrativeState, id: string, material: BoundMaterial, roles: readonly SeedRole[], options: {
  readonly before?: string; readonly after?: string; readonly tone?: NarrativeTone; readonly scene?: string; readonly mode?: NarrativeMode;
} = {}): NarrativeBlock | undefined {
  const seeds = takeSeeds(state, material, roles);
  if (!seeds.length) return;
  return editorialParagraph(state, id, [options.before, ...seeds.map(s => s.text), options.after].filter(Boolean).join(" "),
    proof([material], seeds, [], [`v4:narrative:${id}`]), options.tone, options.scene, options.mode);
}
