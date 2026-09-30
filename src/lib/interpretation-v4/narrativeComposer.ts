import type { BoundMaterial } from "./materialPacket";
import type { SeedRole } from "./materialDepthTypes";
import type { Domain } from "./types";
import type { NarrativeBlock, NarrativeSection, NarrativeState } from "./narrativeTypes";
import { paragraph, proof, takeSeeds } from "./copyRealizer";
import { DOMAIN_STORIES } from "./narrativeStories";

const preferences: Readonly<Partial<Record<Domain, readonly string[]>>> = {
  strengths: ["gwiin_munchang", "twelve_sinsal_jangseong", "sinsal_hyeonchim", "gwiin_jaego", "sinsal_yangin", "gwiin_hakdang"],
  work: ["ten_god_qi_sha", "ten_god_shang_guan", "ten_god_shi_shen", "ten_god_pian_cai", "ten_god_zheng_guan", "ten_god_bijian", "ten_god_jie_cai", "sinsal_hyeonchim", "twelve_sinsal_yeokma"],
  money: ["gwiin_jaego", "ten_god_zheng_cai", "ten_god_pian_cai", "twelve_sinsal_banan", "ten_god_shi_shen", "ten_god_jie_cai"],
  study: ["sinsal_gwimun", "gwiin_munchang", "gwiin_hakdang", "ten_god_pian_yin", "ten_god_zheng_yin", "sinsal_hyeonchim", "ten_god_shi_shen"],
  relationships: ["gwiin_cheoneul", "ten_god_jie_cai", "ten_god_zheng_guan", "ten_god_bijian", "ten_god_zheng_yin", "ten_god_pian_yin", "twelve_sinsal_yeokma"],
  love: ["sinsal_hongyeom", "sinsal_dohwa", "ten_god_qi_sha", "ten_god_zheng_cai", "ten_god_shi_shen", "sinsal_hyeonchim", "twelve_sinsal_hwagae", "gwiin_cheoneul"],
};
/** Editorial ordering only: never a calculation of the person's ability. */
export function selectMaterial(state: NarrativeState, domain: Domain, roles: readonly SeedRole[], exclude: readonly string[] = []) {
  const preferred = preferences[domain] ?? [];
  const candidates = state.packet.selected.filter(m => !exclude.includes(m.feature) &&
    m.material.category !== "dayPillar" && m.material.category !== "dayMaster" &&
    roles.some(role => m.material.seeds.some(s => s.role === role && s.domains.includes(domain) && !state.usedSeeds.has(s.id))));
  const rank = (m: BoundMaterial) => {
    const i = preferred.indexOf(m.feature);
    const relevantFusion = state.packet.fusions.some(f => f.myeongliEvidence.some(d => d.evidence.feature === m.feature) &&
      (f.domain === domain || m.material.seeds.some(s => s.domains.includes(domain))));
    const observedWeight = Math.max(0, ...m.evidence.map(d => d.evidence.weight ?? 0));
    return (state.featureUses.get(m.feature) ?? 0) * 7 + (relevantFusion ? -20 : 0) - Math.min(observedWeight, 3) * 3 +
      (DOMAIN_STORIES[m.feature]?.[domain] ? -9 : 0) + (m.material.category === "structure" ? 0 : i < 0 ? 18 : i);
  };
  return candidates.sort((a, b) => rank(a) - rank(b) || a.feature.localeCompare(b.feature))[0];
}

export const present = <T>(values: readonly (T | undefined)[]): T[] => values.filter((v): v is T => v !== undefined);
export const section = (id: string, title: string, domain: Domain, blocks: readonly (NarrativeBlock | undefined)[]): NarrativeSection =>
  ({ id, title, domain, blocks: present(blocks) });

export function domainParagraph(state: NarrativeState, material: BoundMaterial, domain: Domain, role: SeedRole, id: string): NarrativeBlock | undefined {
  const story = DOMAIN_STORIES[material.feature]?.[domain];
  // A domain continuation is used once; role reservation still keeps seed reuse explicit.
  const seeds = takeSeeds(state, material, [role]);
  if (!seeds.length && !story) return;
  return paragraph(id, story?.[1] ?? seeds.map(s => s.text).join(" "),
    proof([material], seeds, [], [`v4:narrative-story:${material.feature}:${domain}`]), "positive");
}

export function domainTitle(material: BoundMaterial, domain: Domain, fallback: string): string {
  return DOMAIN_STORIES[material.feature]?.[domain]?.[0] ?? fallback;
}
