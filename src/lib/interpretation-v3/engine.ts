import type { UserContextProfile } from "../report-knowledge/userContextTypes";
import { ATOMIC_BY_ID, REVIEWED_COPY } from "./atomicRegistry";
import { matchCompounds } from "./compounds";
import { contextScene, routeDirective } from "./context";
import { fuseMbti } from "./fusion";
import { validateEvidence } from "./evidence";
import { DOMAINS, type ClaimStrength, type Directive, type Domain, type Evidence, type Product } from "./types";

export const PRODUCT_DOMAINS: Record<Product, readonly Domain[]> = {
  saju_mbti_full: DOMAINS,
  career_money_study: ["career", "business", "money", "study", "leadership"],
  love_marriage_child: ["love", "relationship", "lifestyle"],
  saju_mbti_compatibility: ["relationship", "love", "career", "money"],
  major_fortune: ["career", "money", "study", "relationship", "lifestyle"],
  annual_fortune: ["career", "money", "study", "relationship", "lifestyle"],
};
/** Editorial importance only, never a customer score. Stable ties use IDs. */
export function rankEvidence(facts: readonly Evidence[], product: Product, domain?: Domain): readonly Evidence[] {
  const relevant = (e: Evidence) => e.domains.filter(d => PRODUCT_DOMAINS[product].includes(d) && (!domain || d === domain)).length;
  const priority = (e: Evidence) => (e.certainty === "confirmed" ? 20 : 0) + (e.salience === "prominent" ? 10 : e.salience === "direct" ? 5 : 0) +
    ((product === "major_fortune" && e.scope === "major") || (product === "annual_fortune" && ["annual", "monthly"].includes(e.scope)) ? 8 : 0) + relevant(e);
  return facts.filter(e => relevant(e) > 0 && e.certainty !== "weak").toSorted((a, b) => priority(b) - priority(a) || a.id.localeCompare(b.id));
}
export function claimStrength(facts: readonly Evidence[], domain: Domain, tension = false): ClaimStrength {
  const supported = facts.filter(e => e.sourceRefs.length && e.lineage.length && e.domains.includes(domain) && e.certainty !== "weak");
  if (!supported.length) return "suppressed";
  const ids = new Set(facts.map(e => e.featureId));
  if (tension || supported.some(e => e.conflictsWith?.some(id => ids.has(id)))) return "tension";
  if (supported.some(e => e.certainty !== "confirmed")) return "question";
  const direct = supported.filter(e => e.salience !== "supporting" && e.kind !== "context");
  // Corroboration requires two direct, disjoint natal/flow observations,
  // not two copies of one fact or two traits from the same MBTI questionnaire.
  const observations = direct.filter(e => e.kind !== "mbti");
  if (observations.some((a, i) => observations.slice(i + 1).some(b => a.featureId !== b.featureId && a.lineage.every(id => !b.lineage.includes(id))))) return "strong";
  return direct.length ? "domain" : "question";
}
export function validateV3Copy(text: string): readonly string[] {
  const errors: string[] = [];
  if (/가능성이 있습니다|일 수도 있습니다|로 볼 수 있습니다|처럼 나타날 수 있습니다|실제 경험과 비교|단정할 수 없습니다|참고 자료|가능성만/.test(text)) errors.push("filler-or-hedge");
  if (/(?:반드시|무조건|확실히|틀림없이).{0,24}(?:성공|부자|수익|결혼|합격|승진|질병|사고)|(?:수익|돈|결혼|합격|승진|완치).{0,12}(?:보장됩니다|보장합니다|확정됩니다)|\d{4}년.{0,15}(?:결혼합니다|합격합니다|승진합니다)|(?:암|질병|사고)(?:이|가|에).{0,8}(?:생깁니다|걸립니다|납니다)/.test(text)) errors.push("event-guarantee");
  if (/(?:노력|관리|성실).{0,12}(?:하면|해야).{0,20}(?:복|매력|강점|운이 생)/.test(text)) errors.push("effort-reward-reversal");
  if (/(?:\d[\d,]*\s*(?:만|억)?원).{0,15}(?:벌게 됩니다|법니다|얻습니다)|(?:열심히|잘)\s*하면.{0,30}(?:운|복|성공).{0,15}(?:옵니다|올 수|생깁니다|할 수)/.test(text)) errors.push("unsupported-reward");
  return errors;
}
function compose(input: {
  id: string; judgment: string; question: string; directive: string; caution: string; facts: readonly Evidence[];
  sourceRefs: readonly string[]; domain: Domain; context: UserContextProfile; tension?: boolean;
}): Directive | null {
  const strength = claimStrength(input.facts, input.domain, input.tension);
  if (strength === "suppressed") return null;
  const scene = contextScene(input.context, ["love", "relationship"].includes(input.domain));
  const flow = input.facts.some(e => ["major", "annual", "monthly"].includes(e.scope));
  const headline = strength === "question" ? input.question : strength === "tension" && !input.tension
    ? "서로 다른 요구가 함께 있어 적용 기준을 나눌 필요가 있습니다."
    : `${flow ? "선택한 운의 구간에서는 " : ""}${input.judgment}`;
  const result: Directive = { id: input.id, headline, directive: `${scene}: ${routeDirective(input.id, input.directive, input.context)}`, rationale: "아래 근거가 가리키는 강점을 이 장면에 적용하는 방향입니다.",
    positiveUse: strength === "question" ? "질문의 체감이 맞는 부분을 적용 장면으로 정하세요." : headline,
    caution: input.caution, professionalEvidence: input.facts.map(e => `${e.scope}${e.period ? `(${e.period})` : ""}: ${ATOMIC_BY_ID.get(e.featureId)?.name ?? e.featureId}`),
    evidenceRefs: [...new Set(input.facts.map(e => e.id))], sourceRefs: [...new Set([...input.sourceRefs, ...input.facts.flatMap(e => e.sourceRefs), `userContext:lifeStatus:${input.context.lifeStatus}`, `userContext:relationshipStatus:${input.context.relationshipStatus ?? "unknown"}`, ...(input.context.fieldLabel ? ["userContext:fieldLabel", "interpretation-v3/context:CAREER_RULES"] : [])])], strength, domain: input.domain, context: scene };
  return validateV3Copy([result.headline, result.directive, result.rationale, result.positiveUse, result.caution].join(" ")).length ? null : result;
}
export function coverageWarnings(facts: readonly Evidence[], directives: readonly Directive[], product: Product): readonly string[] {
  const used = new Set(directives.flatMap(d => d.evidenceRefs));
  return rankEvidence(facts, product).filter(e => ["sinsal_dohwa", "sinsal_hongyeom"].includes(e.featureId) && !used.has(e.id)).map(e => `positive-signal-unused:${e.id}`);
}
export function interpretV3(input: { evidence: readonly Evidence[]; product: Product; subject: Evidence["subject"]; context: UserContextProfile; domain?: Domain; period?: string; limit?: number }) {
  const errors = validateEvidence(input.evidence);
  if (errors.length) return { ok: false as const, errors, directives: [], facts: input.evidence, warnings: [] };
  const selected = input.evidence.filter(e => e.subject === input.subject && (e.scope === "natal" || e.scope === "behavior" || e.scope === "context" || Boolean(input.period && e.period === input.period)));
  const ranked = rankEvidence(selected, input.product, input.domain);
  const candidates: Directive[] = [];
  const domainFor = (domains: readonly Domain[]) => PRODUCT_DOMAINS[input.product].find(d => domains.includes(d) && (!input.domain || input.domain === d));
  for (const { rule, evidence } of matchCompounds(selected, input.subject, input.period)) {
    const domain = domainFor(rule.domains);
    if (!domain) continue;
    const d = compose({ id: rule.id, judgment: rule.judgment, question: "이 두 가지 요구가 함께 작동하는 장면이 있나요?", directive: rule.directive, caution: rule.caution, facts: evidence, sourceRefs: rule.sourceRefs, domain, context: input.context, tension: rule.kind === "tension" });
    if (d) candidates.push(d);
  }
  for (const e of ranked) {
    const copy = REVIEWED_COPY[e.featureId], domain = domainFor(e.domains);
    if (!copy || !domain || candidates.some(d => d.evidenceRefs.includes(e.id))) continue;
    const conflicts = selected.filter(other => e.conflictsWith?.includes(other.featureId) || other.conflictsWith?.includes(e.featureId));
    const d = compose({ id: `atomic:${e.id}`, judgment: copy[0], question: copy[1], directive: copy[2], caution: copy[3], facts: [e, ...conflicts], sourceRefs: ATOMIC_BY_ID.get(e.featureId)?.sourceRefs ?? [], domain, context: input.context });
    if (d) candidates.push(d);
  }
  // Behavior modifiers retain their source scene. No broad automatic rewrite of
  // V2 hedges. A reviewed atomic headline + safe concrete scene/practice can render.
  for (const fusion of fuseMbti(selected, input.subject, input.period)) {
    const facts = selected.filter(e => fusion.evidenceRefs.includes(e.id));
    const atom = facts.find(e => REVIEWED_COPY[e.featureId]);
    const domain = domainFor(facts.flatMap(e => e.domains).filter(d => fusion.contexts.includes(d) || (d === "relationship" && fusion.contexts.some(c => ["marriage", "family", "conflict"].includes(c)))));
    if (!atom || !domain) continue;
    const copy = REVIEWED_COPY[atom.featureId];
    const d = compose({ id: fusion.id, judgment: `${copy[0]} ${fusion.scene}`, question: copy[1], directive: fusion.directive, caution: copy[3], facts, sourceRefs: fusion.sourceRefs, domain, context: input.context, tension: fusion.type === "tension" });
    if (d) candidates.unshift(d);
  }
  const rank = new Map(ranked.map((e, i) => [e.id, i]));
  const importance = (d: Directive) => Math.min(...d.evidenceRefs.map(id => rank.get(id) ?? ranked.length)) * 4 + (d.id.startsWith("v3:mbti:") ? 0 : d.id.startsWith("atomic:") ? 2 : 1);
  const directives = candidates.toSorted((a, b) => importance(a) - importance(b) || a.id.localeCompare(b.id)).slice(0, Math.max(0, input.limit ?? 8));
  return { ok: true as const, errors: [], directives, facts: input.evidence, warnings: coverageWarnings(selected, directives, input.product) };
}
export function renderDirective(d: Directive): string {
  return [d.headline, d.directive, d.rationale, d.positiveUse === d.headline ? "" : d.positiveUse, d.caution, d.professionalEvidence.join(" · ")].filter(Boolean).join("\n");
}
