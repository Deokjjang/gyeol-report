import { buildFoundationReferences } from "./evidenceFoundation";
import "server-only";
import { createHash } from "node:crypto";
import { composeLoveNarrative } from "./loveComposer";
import { buildRelationshipProfiles, projectRelationshipView, selectLoveProductSources } from "./relationshipProductView";
import { createRelationshipRenderer } from "./relationshipProductNarrative";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeInput, NarrativeBlock, NarrativeProof } from "./narrativeTypes";
import { renderLoveRelease } from "./loveReleaseRenderer";
import { validateLoveRelease } from "./loveReleaseValidator";
import { LOVE_RELEASE_VERSION } from "./loveReleaseContracts";

export const LOVE_PRODUCT_VERSION = LOVE_RELEASE_VERSION;
const compact = <T>(xs: (T | undefined)[]): T[] => xs.filter((x): x is T => x !== undefined);
const withoutPair = (p: NarrativeProof): NarrativeProof => ({ ...p, sourceRefs: p.sourceRefs.filter(r => !/notablePairs|relationshipHints/.test(r)) });

/** Existing attraction, ideal-partner images, conditional home/parenting and
 * status scenes retain their product value. New personal explanations use 13D;
 * stored readers never invoke this generation-time adapter. */
export function buildV4LoveProduct(input: NarrativeInput) {
  const legacy = composeLoveNarrative(input);
  if (!legacy.ok) return legacy;
  const built = buildRelationshipProfiles(input);
  if (!built.ok) return built;
  const view = projectRelationshipView(built.profiles), selected = selectLoveProductSources(view);
  const stableKey = createHash("sha256").update(JSON.stringify([LOVE_PRODUCT_VERSION, input.name, input.calculation.pillars, input.mbti || null, input.context.relationshipStatus])).digest("hex");
  const renderer = createRelationshipRenderer(view, stableKey, input.context.relationshipStatus === "single");
  const blocks = (question: string) => compact(selected.selected.filter(p => p.question === question).map(p => renderer.placement(p)));
  const opening = blocks("L1");
  if (!opening.length) return { ok: false as const, errors: ["LOVE_RELATIONSHIP_CORE_MISSING"] };
  const replacements: Record<string, NarrativeBlock[]> = {
    expression: blocks("L3"), intimacy: [...blocks("L4"), ...blocks("L6")], shadow: blocks("L7"),
    repair: blocks("L5"), home: blocks("L8"), direction: blocks("L9"),
    fortune: compact(selected.fortunes.map(c => renderer.render(c, "L-good", c.contexts.includes("love") ? "love" : "social"))),
  };
  const sections = legacy.narrative.sections.map(s => {
    const fresh = replacements[s.id];
    // Retained context/household details are separate from personal inference.
    const retained = s.blocks.map(b => ({ ...b, proof: withoutPair(b.proof) }));
    return { ...s, blocks: fresh?.length ? ["home", "repair"].includes(s.id) ? [...fresh, ...retained.slice(0, 1)] : fresh : retained };
  });
  const narrative = { ...legacy.narrative, opening, sections, finalProof: withoutPair(legacy.narrative.finalProof) };
  const release = renderLoveRelease(input, view, narrative, legacy.materials);
  const readerValidation = validateLoveRelease(release.draft, view, legacy.materials, release.retained);
  const reviewed = reviewNarrative(release.narrative);
  const published = !readerValidation.hardErrors.length && release.narrative.opening.length
    && ["current", "home", "parenting", "fortune", "direction"].every(id => release.narrative.sections.some(s => s.id === id))
    && !reviewed.some(i => i.severity === "Blocker" || i.severity === "Major" && !["DUPLICATE_SENTENCE", "REPEATED_LONG_PHRASE"].includes(i.code)) ? release.narrative : narrative;
  return { ...legacy, narrative: published, writerVersion: LOVE_PRODUCT_VERSION,
    foundationReferences: buildFoundationReferences(built.profiles),
    mbtiBasis: legacy.mbtiBasis ? { ...legacy.mbtiBasis, pairHint: null } : null,
    editorial: published === release.narrative ? reviewed : reviewNarrative(narrative),
    integration: { version: LOVE_PRODUCT_VERSION, represented: renderer.represented, suppressed: renderer.suppressed,
      publishedEdition: published === release.narrative ? release.draft.version : "love-product-13d-7b-v1", readerEdition: release.draft, readerValidation, readerEditorial: reviewed,
      questions: { L1: "core", L2: "attraction/partner", L3: "expression", L4: "intimacy", L5: "repair", L6: "intimacy/balance", L7: "shadow", L8: "home", L9: "direction" },
      sourceDomains: view.nodes.map(n => ({ id: n.id, domain: n.sourceDomain })),
      personalDigest: createHash("sha256").update(JSON.stringify({ myeongli: built.profiles.myeongli, mbti: built.profiles.mbti, fusion: built.profiles.fusion, claims: built.profiles.claims, resonance: built.profiles.resonance })).digest("hex"),
      charmClaims: selected.fortunes.filter(c => c.sourceId.startsWith("A0")).map(c => ({ id: c.sourceId, level: c.claimLevel, evidence: c.myeongliEvidenceIds })),
      preserved: ["attraction", "partner", "current", "home", "parenting", "balance"], pairReferencePersonalEvidence: false } };
}
export type LoveProduct = Extract<ReturnType<typeof buildV4LoveProduct>, { ok: true }>;
