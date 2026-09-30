import type { Domain } from "./types";

export type MaterialCategory = "dayMaster" | "dayPillar" | "element" | "tenGod" | "structure" | "marker";
export type SeedRole = "character" | "inside" | "strength" | "shadow" | "work" | "money" | "study" | "love" | "relationships" | "fortune" | "scene" | "punch" | "question" | "ending";
export type MaterialSeed = {
  readonly id: string;
  readonly role: SeedRole;
  readonly text: string;
  readonly domains: readonly Domain[];
  readonly valence: "positive" | "shadow" | "neutral";
};
/** Authored alternatives, not a report or instructions to print every seed. */
export type MaterialDepth = {
  readonly feature: string;
  readonly category: MaterialCategory;
  readonly imagery: string;
  readonly seeds: readonly MaterialSeed[];
  readonly sourceRefs: readonly string[];
  readonly use: "confirmed-profile" | "strong-evidence" | "support-only" | "symbolic-only";
};
export type DepthCopy = Readonly<{
  character: string; inside: string; strength: string; shadow: string;
  work?: string; money?: string; study?: string; love?: string; relationships?: string; fortune?: string;
  scene: string; punch: string; question: string; ending: string;
}>;
const domains: Readonly<Record<SeedRole, readonly Domain[]>> = {
  character: ["identity"], inside: ["identity"], strength: ["strengths"], shadow: ["weaknesses"],
  work: ["work"], money: ["money"], study: ["study"], love: ["love"], relationships: ["relationships", "marriage"],
  fortune: ["success/fortune"], scene: ["identity"], punch: ["weaknesses"], question: ["identity"], ending: ["strengths"],
};
/** Formatting only. No generated customer sentences, semantic matching or scoring. */
export function depth(feature: string, category: MaterialCategory, imagery: string, copy: DepthCopy,
  sourceRefs: readonly string[], use: MaterialDepth["use"] = "strong-evidence",
  sceneDomains: readonly Domain[] = ["identity"]): MaterialDepth {
  return { feature, category, imagery, use, sourceRefs: [...sourceRefs, `v4:material-depth:${feature}`],
    seeds: (Object.entries(copy) as [SeedRole, string][]).map(([role, text]) => ({ id: `${feature}:${role}`, role, text,
      domains: role === "scene" ? sceneDomains : domains[role],
      valence: ["strength", "work", "money", "study", "love", "relationships", "fortune", "ending"].includes(role) ? "positive" :
        ["shadow", "punch"].includes(role) ? "shadow" : "neutral" })) };
}
