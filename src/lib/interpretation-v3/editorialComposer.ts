import { PRODUCT_DOMAINS, validateV3Copy } from "./engine";
import { validateEvidence } from "./evidence";
import type { Domain, Evidence, Product } from "./types";

export type EditorialRole = "character" | "explanation" | "advice";
export type EditorialTone = "curiosity" | "recognition" | "praise" | "blunt" | "reversal" | "fortune" | "affection" | "direction";
export type EditorialForm = "prose" | "punchline" | "quote" | "observations" | "tip";
type EditorialPeriod = { readonly scope: "major" | "annual" | "monthly"; readonly id: string };
export type EditorialScene = {
  readonly id: string;
  readonly chapter: string;
  /** Authored reading order, not a fact weight or customer ranking. */
  readonly order: number;
  readonly domain: Domain;
  /** Meaning of THIS manifestation, not the shared feature ID. */
  readonly angle: string;
  readonly subject: Evidence["subject"];
  readonly toward?: "personA" | "personB";
  readonly period?: EditorialPeriod;
  readonly tone: EditorialTone;
  readonly form: EditorialForm;
  readonly headline: string;
  readonly parts: readonly { readonly role: EditorialRole; readonly text: string }[];
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
};
export type EditorialMix = Readonly<Record<EditorialRole, readonly [number, number]>>;
export const COMPREHENSIVE_EDITORIAL_MIX: EditorialMix = {
  character: [0.65, 0.70], explanation: [0.20, 0.25], advice: [0.10, 0.15],
};
type EditorialInput = {
  readonly product: Product;
  readonly chapters: readonly string[];
  readonly facts: readonly Evidence[];
  /** Already selected by the product's existing interpretation layer. */
  readonly selectedEvidenceRefs: readonly string[];
  /** Already qualified by existing prominence/precision gates; never inferred here. */
  readonly substantialEvidenceRefs: readonly string[];
  readonly scenes: readonly EditorialScene[];
  readonly targetMix?: EditorialMix;
  readonly maxConsecutiveTone?: 1 | 2;
};
type EditorialIssue = { readonly id: string; readonly reason: string };
const roles: readonly EditorialRole[] = ["character", "explanation", "advice"];
const flow = (f: Evidence) => f.scope === "major" || f.scope === "annual" || f.scope === "monthly";
const comparable = (text: string) => text.normalize("NFKC").replace(/[\p{P}\p{Z}\s]/gu, "").toLocaleLowerCase("en");
const sentences = (text: string) => text.split(/(?<=[.!?。！？])\s+|\n+/u).map(comparable).filter(Boolean);
const internalCopy = /canonical-|SajuCalcResult:|(?:evidence|source)Refs|featureId|lineage|(?:ten_god|day_pillar|gwiin|sinsal|shinsal|userContext|mbti):|\b[a-z]+_[a-z_]+\b|\bv[123]:/;
const scoreCopy = /\d+(?:\.\d+)?\s*(?:점|점대|\/\s*100|퍼센트|%)|[0-9０-９]+\s*[~～–-]\s*100|[0-9０-９]+\s*점|[★☆⭐]|별\s*점|(?:궁합|관계)\s*(?:점수|등급|랭킹)|(?:S\+?|A\+?|B\+?|C|D|F)\s*등급|등급\s*[:：]?\s*(?:S\+?|A\+?|B\+?|C|D|F)/i;

function sceneProblems(scene: EditorialScene, input: EditorialInput, byId: ReadonlyMap<string, Evidence>): string[] {
  const problems: string[] = [];
  const selected = new Set(input.selectedEvidenceRefs), substantial = new Set(input.substantialEvidenceRefs);
  const facts = scene.evidenceRefs.flatMap(id => byId.has(id) ? [byId.get(id)!] : []);
  if (!scene.id || !scene.angle || !Number.isFinite(scene.order) || !input.chapters.includes(scene.chapter)) problems.push("invalid-scene-location");
  if (!PRODUCT_DOMAINS[input.product].includes(scene.domain)) problems.push("outside-product-domain");
  if (!scene.evidenceRefs.length || facts.length !== scene.evidenceRefs.length || scene.evidenceRefs.some(id => !selected.has(id))) problems.push("unselected-evidence");
  if (!scene.sourceRefs.length || facts.some(f => f.certainty !== "confirmed" || !f.sourceRefs.length || !f.lineage.length)) problems.push("unconfirmed-evidence");
  if (!facts.some(f => substantial.has(f.id) && f.subject === scene.subject && f.kind !== "mbti" && f.kind !== "context" && f.domains.includes(scene.domain))) problems.push("missing-substantial-anchor");
  const pair = input.product === "saju_mbti_compatibility";
  if (pair ? scene.subject === "person" : scene.subject !== "person" || scene.toward !== undefined) problems.push("invalid-subject");
  if (scene.toward && (!pair || scene.subject === scene.toward)) problems.push("invalid-direction");
  if (facts.some(f => f.subject !== scene.subject && f.subject !== scene.toward) || !facts.some(f => f.subject === scene.subject) || (scene.toward && !facts.some(f => f.subject === scene.toward))) problems.push("evidence-direction-mismatch");
  if (scene.period && ((input.product === "major_fortune" && scene.period.scope !== "major") || (input.product === "annual_fortune" && scene.period.scope === "major") || !["major_fortune", "annual_fortune"].includes(input.product))) problems.push("outside-product-period");
  if (facts.some(f => flow(f) && (!scene.period || f.scope !== scene.period.scope || f.period !== scene.period.id)) || (scene.period && !facts.some(flow))) problems.push("evidence-period-mismatch");
  const texts = [scene.headline, ...scene.parts.map(p => p.text)];
  if (!scene.headline.trim() || !scene.parts.length || scene.parts.some(p => !p.text.trim() || !roles.includes(p.role))) problems.push("empty-or-untyped-copy");
  const text = texts.join(" ");
  problems.push(...validateV3Copy(text));
  if (internalCopy.test(text)) problems.push("internal-copy");
  if (pair && scoreCopy.test(text.normalize("NFKC"))) problems.push("compatibility-score-copy");
  // A different headline/ID must not disguise an unchanged paragraph.
  const body = scene.parts.map(p => comparable(p.text));
  if (new Set(body).size !== body.length) problems.push("repeated-paragraph");
  const bodySentences = scene.parts.flatMap(p => sentences(p.text));
  if (new Set(bodySentences).size !== bodySentences.length) problems.push("repeated-sentence");
  return [...new Set(problems)];
}

/** Pure editorial assembly. It does not calculate, rank, fuse, invent or
 * paraphrase facts. Product authors supply complete, evidence-gated scenes.
 * Existing snapshot composers deliberately do not call this new layer. */
export function composeEditorial(input: EditorialInput) {
  const rejected: EditorialIssue[] = [], warnings: EditorialIssue[] = [];
  const errors = validateEvidence(input.facts);
  const invalidInput = [...errors, ...(new Set(input.chapters).size !== input.chapters.length ? ["duplicate-chapter"] : [])];
  const byId = new Map(input.facts.map(f => [f.id, f]));
  const ids = new Set<string>(), meanings = new Set<string>(), usedText = new Set<string>();
  const candidates: EditorialScene[] = [];
  const chapterOrder = new Map(input.chapters.map((id, i) => [id, i]));
  const duplicatedIds = new Set(input.scenes.filter((s, i) => input.scenes.findIndex(other => other.id === s.id) !== i).map(s => s.id));
  const sorted = input.scenes.toSorted((a, b) => (chapterOrder.get(a.chapter) ?? Infinity) - (chapterOrder.get(b.chapter) ?? Infinity) || a.order - b.order || a.id.localeCompare(b.id));
  for (const scene of sorted) {
    const problems = invalidInput.length ? ["invalid-evidence-or-chapters"] : sceneProblems(scene, input, byId);
    const meaning = JSON.stringify([scene.domain, scene.angle, scene.subject, scene.toward, scene.period?.scope, scene.period?.id]);
    const text = [comparable(scene.headline), ...scene.parts.flatMap(p => [comparable(p.text), ...sentences(p.text)])];
    if (duplicatedIds.has(scene.id) || ids.has(scene.id)) problems.push("duplicate-scene-id");
    if (meanings.has(meaning)) problems.push("repeated-manifestation");
    if (text.some(t => usedText.has(t))) problems.push("repeated-copy");
    if (problems.length) { rejected.push(...[...new Set(problems)].map(reason => ({ id: scene.id, reason }))); continue; }
    ids.add(scene.id); meanings.add(meaning); text.forEach(t => usedText.add(t));
    candidates.push(scene);
  }
  const scenes: EditorialScene[] = [];
  const repeats = (s: EditorialScene, key: "tone" | "form") => {
    const limit = key === "tone" ? input.maxConsecutiveTone ?? 2 : 2;
    return scenes.length >= limit && scenes.slice(-limit).every(previous => previous[key] === s[key]);
  };
  // Keep chapters/TOC fixed. Only reorder complete scenes within a chapter.
  // If material is too uniform, expose the QA debt rather than drop content,
  // randomly relabel its tone, merge paragraphs or fabricate a filler block.
  for (const chapter of input.chapters) {
    const remaining = candidates.filter(s => s.chapter === chapter);
    while (remaining.length) {
      // Strict alternation must also leave a viable form sequence. A greedy
      // first choice can strand an otherwise valid authored chapter at its tail.
      // Search only within that chapter; never relabel or invent a scene.
      const viableTail = (candidate: EditorialScene) => {
        if (input.maxConsecutiveTone !== 1) return true;
        const tail = remaining.filter(s => s !== candidate), counts = new Map<EditorialTone, number>();
        tail.forEach(s => counts.set(s.tone, (counts.get(s.tone) ?? 0) + 1));
        if (![...counts].every(([tone, count]) => count <= Math.ceil((tail.length - (tone === candidate.tone ? 1 : 0)) / 2))) return false;
        const failed = new Set<string>();
        const fits = (pool: readonly EditorialScene[], tone: EditorialTone, forms: readonly EditorialForm[]): boolean => {
          if (!pool.length) return true;
          const key = JSON.stringify([pool.map(s => s.id), tone, forms]);
          if (failed.has(key)) return false;
          const found = pool.some(s => s.tone !== tone && !(forms.length === 2 && forms.every(f => f === s.form)) &&
            fits(pool.filter(next => next !== s), s.tone, [...forms, s.form].slice(-2)));
          if (!found) failed.add(key);
          return found;
        };
        return fits(tail, candidate.tone, [...scenes.slice(-1).map(s => s.form), candidate.form]);
      };
      let varied = remaining.findIndex(s => !repeats(s, "tone") && !repeats(s, "form") && viableTail(s));
      if (varied < 0) varied = remaining.findIndex(s => !repeats(s, "tone") && !repeats(s, "form"));
      const [scene] = remaining.splice(varied < 0 ? 0 : varied, 1);
      for (const key of ["tone", "form"] as const) if (repeats(scene, key)) warnings.push({ id: scene.id, reason: `repeated-${key}` });
      scenes.push(scene);
    }
  }
  const chars: Record<EditorialRole, number> = { character: 0, explanation: 0, advice: 0 };
  // Only actual body text is counted: headings cannot inflate character share.
  // Roles are authored annotations, not a semantic classifier; manual QA stays required.
  for (const scene of scenes) for (const part of scene.parts) chars[part.role] += [...part.text.trim()].length;
  const total = roles.reduce((n, role) => n + chars[role], 0);
  const mix = Object.fromEntries(roles.map(role => [role, total ? chars[role] / total : 0])) as Record<EditorialRole, number>;
  if (!total) warnings.push({ id: "report", reason: "empty-editorial-body" });
  if (input.targetMix) for (const role of roles) {
    const [min, max] = input.targetMix[role];
    if (mix[role] < min || mix[role] > max) warnings.push({ id: "report", reason: `mix-outside-target:${role}` });
  }
  for (const chapter of input.chapters) if (!scenes.some(s => s.chapter === chapter)) warnings.push({ id: chapter, reason: "empty-chapter" });
  return { scenes, rejected, warnings, errors: invalidInput, audit: { chars, total, mix } };
}

/** Explicit client/display boundary. No object spreading of an internal scene. */
export function editorialCustomerScenes(scenes: readonly EditorialScene[]) {
  return scenes.map(scene => ({ headline: scene.headline, paragraphs: scene.parts.map(p => p.text), form: scene.form }));
}
