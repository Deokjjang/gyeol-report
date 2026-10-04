import { paragraph, proof } from "./copyRealizer";
import { natalLoveScene } from "./loveNatalScenes";
import type { NarrativeState, NarrativeSection } from "./narrativeTypes";
import type { SeedRole } from "./materialDepthTypes";

/** No Fusion is also a valid result. Natal copy remains substantial; no guessed type. */
export function natalLove(state: NarrativeState) {
  const used = new Set<string>();
  const block = (id: string, roles: readonly SeedRole[], material = state.pillar, after = "") => {
    const seeds = material.material.seeds.filter(s => roles.includes(s.role) && !used.has(s.id));
    seeds.forEach(s => used.add(s.id));
    return paragraph(id, [...seeds.map(s => s.text), after].filter(Boolean).join(" "), proof([material], seeds), roles.includes("shadow") ? "shadow" : "positive");
  };
  const opening = [block("natal-love-character", ["character", "inside", "love"]), block("natal-love-strength", ["strength", "relationships"], state.master)];
  const sections: NarrativeSection[] = [];
  const eligible = state.packet.selected.filter(m => ![state.pillar, state.master].includes(m) && m.material.seeds.some(s => ["love", "relationships"].includes(s.role)) && !["sinsal_dohwa", "sinsal_hongyeom", "gwiin_cheoneul", "gwiin_woldeok", "gwiin_cheondeok", "gwiin_amrok", "gwiin_geumyeorok"].includes(m.feature));
  // The registry is alphabetic, not an editorial priority. Prefer existing
  // relationship scenes even when no prewritten MBTI voice is eligible.
  const priority = ["ten_god_shi_shen", "ten_god_bijian", "ten_god_zheng_cai", "ten_god_qi_sha", "ten_god_zheng_yin", "ten_god_shang_guan", "ten_god_pian_cai", "v4_structure:outputHeavy", "v4_structure:resourceHeavy", "v4_structure:killingResourceFlow", "v4_structure:officerResourceFlow"];
  const ordered = eligible.toSorted((a, b) => {
    const rank = (feature: string) => priority.includes(feature) ? priority.indexOf(feature) : priority.length;
    return rank(a.feature) - rank(b.feature) || a.feature.localeCompare(b.feature);
  });
  for (const [i, material] of ordered.slice(0, 4).entries()) {
    const love = material.material.seeds.find(s => s.role === "love" || s.role === "relationships")!;
    const scene = natalLoveScene(material.feature);
    sections.push({ id: `natal-love-${i}`, title: scene?.title ?? love.text, domain: "relationships", blocks: scene ? [
      paragraph(`natal-manifestation-${i}`, scene.text, proof([material], [], [], [`v4:love-natal-scene:natal:${material.feature}`]), "positive", scene.family),
    ] : [
      block(`natal-manifestation-${i}`, ["strength", "love", "relationships"], material),
    ] });
  }
  // Known MBTI is woven into these natal scenes by composeEvidenceChapters.
  // Do not paste a separate source-DB paragraph as a parallel personality report.
  sections.push({ id: "shadow", title: "편해진 사람 앞에서 더 조심할 버릇", domain: "weaknesses", blocks: [block("natal-love-shadow", ["shadow"], state.pillar)] });
  const end = state.pillar.material.seeds.find(s => s.role === "ending")!;
  return { headline: state.pillar.material.seeds.find(s => s.role === "character")!.text, opening, sections,
    direction: block("natal-love-direction", ["strength", "ending"], state.pillar), final: end,
    proof: proof([state.pillar, state.master]), used };
}
