import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { paragraph, proof } from "./copyRealizer";
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
  for (const [i, material] of eligible.slice(0, 4).entries()) {
    const love = material.material.seeds.find(s => s.role === "love" || s.role === "relationships")!;
    sections.push({ id: `natal-love-${i}`, title: love.text, domain: "relationships", blocks: [
      block(`natal-manifestation-${i}`, ["strength", "love", "relationships"], material),
    ] });
  }
  const profile = getMbtiSourceProfile(state.input.mbti), trait = profile?.traits?.love?.[0];
  // This existing source sentence is a single-person tendency, never pair ranking.
  if (trait?.plainKo) sections.push({ id: "love-behavior", title: "관심이 생긴 뒤, 마음을 보여주는 속도", domain: "love", blocks: [
    paragraph("love-mbti-behavior", trait.plainKo, proof([], [], [], [`mbti:${profile!.type}:traits:love:${trait.id}`]), "positive"),
  ] });
  sections.push({ id: "shadow", title: "편해진 사람 앞에서 더 조심할 버릇", domain: "weaknesses", blocks: [block("natal-love-shadow", ["shadow"], state.pillar)] });
  const end = state.pillar.material.seeds.find(s => s.role === "ending")!;
  return { headline: state.pillar.material.seeds.find(s => s.role === "character")!.text, opening, sections,
    direction: block("natal-love-direction", ["strength", "ending"], state.pillar), final: end,
    proof: proof([state.pillar, state.master]), used };
}
