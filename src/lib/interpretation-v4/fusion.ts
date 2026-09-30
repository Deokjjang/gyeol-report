import { getMbtiSourceProfile, MBTI_TRAIT_AREAS } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { BRIDGE_SCENE_RULES } from "../report-knowledge/bridge/interactionSceneRules";
import type { SajuCalcResult } from "../saju/types";
import { buildV4Evidence, evaluateEvidence } from "./evidencePolicy";
import { canonicalV4Feature, MATERIAL_BY_FEATURE } from "./materialRegistry";
import { FORTUNE_RULES, FUSION_RULES, semanticConnection } from "./fusionRules";
import { V4_DOMAINS, type Domain, type EvidenceDecision, type FortuneComposite, type FusionInterpretation, type MbtiEvidence, type Observation, type Suppression } from "./types";

const unique = (xs: readonly string[]) => [...new Set(xs)].sort();
const strengthOrder = { strong: 3, supporting: 2, weak: 1, none: 0 } as const;

function consolidate(observations: readonly Observation[]): EvidenceDecision[] {
  const groups = new Map<string, EvidenceDecision[]>();
  for (const input of observations) {
    const d = evaluateEvidence(input), key = `${d.evidence.subject}:${d.evidence.scope}:${d.evidence.period ?? ""}:${d.evidence.feature}`;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  const combined = [...groups.values()].map(group => {
    // A conflicting/uncertain duplicate must not be laundered by a good alias.
    const ordered = group.toSorted((a, b) => Number(a.usable) - Number(b.usable) || strengthOrder[a.strength] - strengthOrder[b.strength] ||
      Number(b.status === "confirmed/calculated") - Number(a.status === "confirmed/calculated") || a.evidence.id.localeCompare(b.evidence.id));
    const first = ordered[0];
    const merged = { ...first, evidence: { ...first.evidence, sourceRefs: unique(group.flatMap(d => d.evidence.sourceRefs)), lineage: unique(group.flatMap(d => d.evidence.lineage)) } };
    if (new Set(group.map(d => d.evidence.weight).filter(w => w !== undefined)).size > 1)
      return { ...merged, status: "ambiguous/conflicted" as const, strength: "none" as const, usable: false, reasons: ["CONFLICTING_RAW_OBSERVATIONS"] };
    return merged;
  }).sort((a, b) => a.evidence.feature.localeCompare(b.evidence.feature) || a.evidence.id.localeCompare(b.evidence.id));
  return combined.map(d => {
    if (d.evidence.feature !== "distribution:output-low") return d;
    const presentWeight = combined.filter(other => other.evidence.subject === d.evidence.subject && other.evidence.scope === "natal" &&
      ["ten_god_shi_shen", "ten_god_shang_guan"].includes(other.evidence.feature) && other.evidence.certainty === "confirmed")
      .reduce((sum, other) => sum + (other.evidence.weight ?? 0), 0);
    return presentWeight >= 0.6 ? { ...d, status: "ambiguous/conflicted" as const, strength: "none" as const, usable: false, reasons: ["OUTPUT_GAP_CONTRADICTS_PRESENT_EVIDENCE"] } : d;
  });
}

/** Explicit AND-of-OR matching with distinct underlying facts, not a score. */
function independentSupport(groups: readonly (readonly string[])[], evidence: readonly EvidenceDecision[], selected: readonly EvidenceDecision[] = []): readonly EvidenceDecision[] | null {
  if (!groups.length) return selected;
  for (const d of evidence.filter(d => groups[0].includes(d.evidence.feature))) {
    if (selected.some(s => s.evidence.feature === d.evidence.feature || s.evidence.lineage.some(ref => d.evidence.lineage.includes(ref)))) continue;
    const rest = independentSupport(groups.slice(1), evidence, [...selected, d]);
    if (rest) return rest;
  }
  return null;
}

export function interpretFusion(input: {
  readonly observations: readonly Observation[];
  readonly mbti?: string | null;
  readonly subject?: Observation["subject"];
  readonly domains?: readonly Domain[];
}) {
  const subject = input.subject ?? "person", domains = input.domains ?? V4_DOMAINS;
  const decisions = consolidate(input.observations);
  const eligible = decisions.filter(d => d.usable && d.evidence.subject === subject);
  const suppressed: Suppression[] = decisions.filter(d => !d.usable || d.evidence.subject !== subject).map(d => ({ id: d.evidence.id,
    reasons: d.evidence.subject !== subject ? ["SUBJECT_MISMATCH", ...d.reasons] : d.reasons }));
  const profile = getMbtiSourceProfile(input.mbti);
  const candidates: FusionInterpretation[] = [];
  for (const r of FUSION_RULES.filter(r => r.type === profile?.type && r.domains.some(d => domains.includes(d)))) {
    const [area, traitId, semanticTag] = r.trait;
    const trait = profile?.traits?.[area]?.find(t => t.id === traitId);
    const d = eligible.filter(d => r.features.includes(d.evidence.feature)).toSorted((a, b) => strengthOrder[b.strength] - strengthOrder[a.strength] || a.evidence.feature.localeCompare(b.evidence.feature))[0];
    const reject = (reason: string) => suppressed.push({ id: r.id, reasons: [reason] });
    if (!trait?.plainKo || !["direct", "inferred"].includes(trait.sourceCoverage ?? "")) { reject("MISSING_SOURCE_TRAIT"); continue; }
    if (!d) { reject("NO_ELIGIBLE_MYEONGLI_EVIDENCE"); continue; }
    const material = MATERIAL_BY_FEATURE.get(d.evidence.feature);
    const domain = r.domains.find(domain => domains.includes(domain) && material?.domains.includes(domain));
    if (!domain || !material?.semanticTags.includes(r.myeongliTag) || !semanticConnection(r.kind, r.myeongliTag, semanticTag)) { reject("NO_REVIEWED_SEMANTIC_CONNECTION"); continue; }
    if ((r.kind === "complement") !== (d.evidence.feature === "distribution:output-low") || (r.kind === "complement" && area === "growth")) { reject("COMPLEMENT_REQUIRES_GAP_AND_BEHAVIOR"); continue; }
    const derived = trait.sourceCoverage === "inferred";
    const mbtiEvidence: MbtiEvidence = { type: profile!.type, area, traitId, semanticTag, meaning: trait.plainKo,
      sourceCoverage: derived ? "inferred" : "direct", provenance: derived ? "derived" : "direct",
      sourceRefs: [`docs/product/mbti/source/${profile!.type}.json:traits:${area}:${traitId}`] };
    candidates.push({ ruleId: r.id, domain, kind: r.kind, myeongliEvidence: [d], mbtiEvidence, sharedTheme: r.sharedTheme, insightSeed: r.insightSeed,
      strength: !derived && d.strength === "strong" && r.kind !== "complement" ? "strong" : "supporting", confidence: derived ? "derived" : "supported",
      provenanceRefs: unique([`v4:fusion-rule:${r.id}`, ...d.evidence.sourceRefs, ...material.sourceRefs, ...mbtiEvidence.sourceRefs]) });
  }
  // Prefer stronger evidence before kind; only the same fact/domain competes.
  const kindOrder = { overlap: 0, contrast: 1, complement: 2 } as const;
  const fusions: FusionInterpretation[] = [];
  for (const c of candidates.toSorted((a, b) => strengthOrder[b.strength] - strengthOrder[a.strength] || kindOrder[a.kind] - kindOrder[b.kind] || a.ruleId.localeCompare(b.ruleId))) {
    if (fusions.some(f => f.domain === c.domain && f.myeongliEvidence[0].evidence.feature === c.myeongliEvidence[0].evidence.feature)) {
      suppressed.push({ id: c.ruleId, reasons: ["STRONGER_OR_EQUAL_REVIEWED_INTERPRETATION_SELECTED"] });
    } else fusions.push(c);
  }
  const fortuneComposites: FortuneComposite[] = [];
  if (domains.includes("success/fortune") || domains.includes("money")) for (const r of FORTUNE_RULES) {
    const supportingEvidence = independentSupport(r.allOf, eligible.filter(d => d.strength === "strong"));
    if (!supportingEvidence) { suppressed.push({ id: r.id, reasons: ["MISSING_DISTINCT_STRONG_FORTUNE_SUPPORT"] }); continue; }
    fortuneComposites.push({ ruleId: r.id, theme: r.theme, supportingEvidence, strength: "strong", directCopySeed: r.seed,
      provenanceRefs: unique([`v4:fortune-rule:${r.id}`, ...supportingEvidence.flatMap(d => d.evidence.sourceRefs)]) });
  }
  const sourceDomainCounts = Object.fromEntries(MBTI_TRAIT_AREAS.map(area => [area, profile?.traits?.[area]?.length ?? 0]));
  const legacyBridgeCount = BRIDGE_SCENE_RULES.filter(r => r.mbti === profile?.type).length;
  const auditWarnings: string[] = [];
  if (profile) {
    if (sourceDomainCounts.love < 4) auditWarnings.push("THIN_SOURCE_LOVE");
    if (sourceDomainCounts.communication < 3) auditWarnings.push("THIN_SOURCE_COMMUNICATION");
    if (legacyBridgeCount < 2) auditWarnings.push("THIN_LEGACY_FUSION");
  }
  return {
    version: "v4-fusion-core-1" as const,
    subject, mbti: profile?.type ?? null, decisions, fusions, fortuneComposites,
    myeongli: eligible.flatMap(d => {
      const m = MATERIAL_BY_FEATURE.get(d.evidence.feature);
      return m && d.strength === "strong" && m.domains.some(domain => domains.includes(domain)) ? [{ material: { ...m, evidenceStrength: d.strength }, evidence: d }] : [];
    }),
    suppressed: suppressed.sort((a, b) => a.id.localeCompare(b.id)),
    coverage: { sourceDomainCounts, legacyBridgeCount, auditWarnings, domains: Object.fromEntries(domains.map(domain => {
      const ruleCount = FUSION_RULES.filter(r => r.type === profile?.type && r.domains.includes(domain)).length;
      const selected = fusions.filter(f => f.domain === domain).length;
      return [domain, { ruleCount, selected, state: !profile ? "unknown-mbti" : selected ? "matched" : ruleCount ? "no-matching-evidence" : "no-reviewed-rule" }];
    })) },
  };
}

/** Offline integration entry; never invoked by current report dispatch/routes. */
export function buildFusionCore(input: { readonly calculation: SajuCalcResult; readonly mbti?: string | null; readonly subject?: Observation["subject"]; readonly domains?: readonly Domain[] }) {
  return interpretFusion({ ...input, observations: buildV4Evidence(input.calculation, input.subject) });
}

export { canonicalV4Feature };
