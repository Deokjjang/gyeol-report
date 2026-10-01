import { compatibilityNarrativeEvidence } from "./compatibilityEvidence";
import { compatibilityCharacter } from "./compatibilityCharacters";
import { compatibilityCategoryCopy } from "./compatibilityCategoryCopy";
import { compatibilityDirectionBlock, compatibilityPairBasis, compatibilityPairScene, pairProof } from "./compatibilityInteractions";
import { compatibilityHarmony, compatibilityElementScene, compatibilityGoodCards } from "./compatibilityHarmony";
import { paragraph, proof } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import type { CompatibilityNarrative } from "./compatibilityNarrativeTypes";
import type { NarrativeBlock, NarrativeSection } from "./narrativeTypes";

/** Offline text/structured packet only. No writer API, report route, storage or UI. */
export function composeCompatibilityNarrative(payload: unknown) {
  const evidence = compatibilityNarrativeEvidence(payload);
  if (!evidence.ok) return evidence;
  const a = compatibilityCharacter(evidence.persons.personA), b = compatibilityCharacter(evidence.persons.personB);
  if (!a || !b) return { ok: false as const, errors: ["UNVERIFIED_PAIR_NATAL_PROFILE"] };
  const category = evidence.category, copy = compatibilityCategoryCopy(category, a, b), source = pairProof(a.proof, b.proof);
  const dAB = compatibilityDirectionBlock(evidence, a, b, "aToB"), dBA = compatibilityDirectionBlock(evidence, b, a, "bToA");
  const relation = compatibilityHarmony(evidence, a, b), element = compatibilityElementScene(evidence, a, b), pairScene = compatibilityPairScene(evidence, a, b);
  const goodCards = compatibilityGoodCards(evidence, a, b);
  const block = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => paragraph(id, text, source, tone, id);
  const section = (id: string, title: string, blocks: readonly NarrativeBlock[], domain: NarrativeSection["domain"] = "relationships"): NarrativeSection => ({ id, title, domain, blocks });
  const natalSources = [a, b].map(p => {
    const pillar = p.materials.selected.find(m => m.material.category === "dayPillar")!;
    const role = ["love", "marriage"].includes(category) ? "love" : ["coworker", "managerReport", "businessPartner"].includes(category) ? "work" : "character";
    const seed = pillar.material.seeds.find(s => s.role === role)!;
    return { p, pillar, seed };
  });
  const natalLayer = natalSources[0].seed.id === natalSources[1].seed.id ? [paragraph("shared-natal",
    `${a.name}님과 ${b.name}님에게는 닮은 모습도 있습니다. ${natalSources[0].seed.text} 서로에게 익숙한 반응이 돌아오는 만큼, 작은 공감이 빨리 생길 수 있는 부분입니다.`,
    proof(natalSources.map(v => v.pillar), [natalSources[0].seed], [], [a.personId, b.personId]), "positive")]
    : natalSources.map(({ p, pillar, seed }) => paragraph(`natal-${p.personId}`, `${p.name}님의 가까운 관계에는 이런 면도 있습니다. ${seed.text}`, proof([pillar], [seed], [], [`person:${p.personId}`]), "observation"));
  const sections = [
    section("delight", copy.delightTitle, [block("delight", copy.delight), ...(pairScene ? [pairScene.block] : [])]),
    section("direction-ab", `${a.name}님이 ${b.name}님에게 주는 자극`, [dAB.block]),
    section("direction-ba", `${b.name}님이 ${a.name}님에게 주는 자극`, [dBA.block]),
    section("scene", copy.sceneTitle, [block("scene", copy.scene, "observation"), ...natalLayer]),
    section("fortune", "둘 사이에서 함께 쓸 수 있는 좋은 힘", [...(relation.harmonic ? [relation.harmonic] : [block("joint-strength", copy.lasting)]), ...goodCards, ...(element ? [element.block] : [])], "success/fortune"),
    section("friction", copy.tensionTitle, [block("friction", copy.tension, "shadow"), ...(relation.friction ? [relation.friction] : [])], "weaknesses"),
    section("repair", category === "businessPartner" ? "믿을수록 더 분명히 남길 약속" : category === "parentChild" ? "대화를 다시 시작하는 쪽은 어른이어도 됩니다" : "다시 같은 편으로 돌아오는 대화", [block("repair", copy.repair, "direction")]),
    ...(relation.harmonic ? [section("lasting", category === "friendship" ? "자주 못 봐도 이어갈 수 있는 우리 방식" : "이 관계에서 오래 남길 것", [block("lasting", copy.lasting)])] : []),
  ];
  // Harmonic-first vs friction-first is evidence-led, not fixture ID or a score.
  if (relation.tension?.refs.every(r => r.position === "day")) {
    const friction = sections.splice(sections.findIndex(s => s.id === "friction"), 1)[0];
    sections.splice(4, 0, friction);
  }
  const narrative: CompatibilityNarrative = { version: "v4-compatibility-narrative-1", category,
    compatibilityRoleVersion: evidence.roleVersion, headline: copy.headline,
    opening: [block("opening", copy.opening)], sections,
    finalLine: copy.ending, finalProof: pairProof(source, proof([], [], [], [`category:${category}`])) };
  return { ok: true as const, narrative, evidence, persons: { personA: a, personB: b }, directions: { aToB: dAB, bToA: dBA },
    mbtiPairBasis: compatibilityPairBasis(evidence), selection: { harmony: relation.harmony?.identity ?? null, tension: relation.tension?.identity ?? null, element: element ? { giver: element.giver, receiver: element.receiver, element: element.element } : null },
    editorial: reviewNarrative(narrative) };
}
