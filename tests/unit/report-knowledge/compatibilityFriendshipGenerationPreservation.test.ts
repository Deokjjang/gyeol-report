import { readFileSync, writeFileSync } from "node:fs";
import { afterAll, expect, it } from "vitest";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "@/app/dev/book-preview/bookProjection";
import { getCrossTenGodRelation } from "@/lib/report-knowledge/compatibilityRelationRules";
import { buildRelationshipProfiles, projectRelationshipView } from "@/lib/interpretation-v4/relationshipProductView";
import type { CompatibilityProduct } from "@/lib/interpretation-v4/compatibilityProductAdapter";
import type { CompatibilityReportInputPayload } from "@/lib/report-generation/reportInputTypes";

const doc = "docs/validation/v4-compatibility-friendship-product-knowledge-01/";
type Case = { id: string; description: string; predicate: string; payload: CompatibilityReportInputPayload };
type Observation = { id: string; hashes: Record<string, string>; edition: string; paragraphs: number; shortages: readonly string[]; directions: unknown; relations: unknown; domainAudit: unknown; hardErrors: readonly string[] };
const cases = JSON.parse(readFileSync(doc + "input-cases.json", "utf8")) as Case[];
const observations: Observation[] = [];
afterAll(() => {
  if (process.env.FRIENDSHIP_CAPTURE) writeFileSync(process.env.FRIENDSHIP_CAPTURE, JSON.stringify(observations, null, 2) + "\n");
});
it.each(cases)("$id $description: actual offline friendship publication retains ownership and exact digests", async c => {
  const g = await generateV4ShadowReport(c.payload, { evaluatedAt: "2026-10-12T12:00:00+09:00" });
  expect(g.externalCalls).toEqual([]);
  expect(g.ok).toBe(true);
  if (!g.ok) return;
  const e = g.evidencePacket as V4RuntimeEvidence;
  const product = e.composition.result as CompatibilityProduct;
  const ev = product.evidence, calc = e.calculations;
  expect(ev.category).toBe("friendship");
  expect(ev.roles).toEqual({ personA: "A", personB: "B" });
  if (!("personA" in calc)) throw new Error("EXPECTED_PAIR_CALCULATION");
  for (const [subject, recipient, key] of [["personA", "personB", "aToB"], ["personB", "personA", "bToA"]] as const) {
    expect(ev.persons[subject].name).toBe(c.payload[subject].name);
    expect(ev.directions[key].subjectPerson).toBe(ev.persons[subject].personId);
    expect(ev.directions[key].targetPerson).toBe(ev.persons[recipient].personId);
    expect(ev.directions[key].receivedTenGod).toEqual(getCrossTenGodRelation({ viewerDayStem: calc[recipient].pillars.day.stem, targetDayStem: calc[subject].pillars.day.stem }) ?? null);
    if (!c.payload[subject].mbtiType || !c.payload[recipient].mbtiType) expect(ev.directions[key].mbtiPair).toBeNull();
  }
  for (const relation of ev.relations) {
    expect(["six_harmony", "three_harmony", "half_harmony", "clash", "harm"]).toContain(relation.kind);
    expect(new Set(relation.refs.map(r => r.person)).size).toBe(2);
    for (const ref of relation.refs) {
      expect(calc[ref.person].pillars[ref.position]?.branch).toBe(ref.branch);
      if (c.payload[ref.person].birthTimeUnknown) expect(ref.position).not.toBe("hour");
    }
  }
  if (c.predicate === "no_cross_branch" || c.predicate === "unsupported_reference_only") expect(ev.relations).toEqual([]);
  if (c.predicate === "same_ten_god") expect(ev.directions.aToB.receivedTenGod?.tenGod).toBe(ev.directions.bToA.receivedTenGod?.tenGod);
  expect(validateV4Publication(e.productType, g.draft, e).ok).toBe(true);
  const book = projectBook(e);
  expect(book).toBeTruthy();
  const reader = product.integration.readerEdition;
  expect(reader.chapters).toHaveLength(9);
  expect(reader.chapters.flatMap(ch => ch.paragraphs)).toHaveLength(36);
  const domainAudit = [];
  for (const slot of ["personA", "personB"] as const) {
    const b = buildRelationshipProfiles({ calculation: calc[slot], name: c.payload[slot].name, mbti: c.payload[slot].mbtiType, context: { jobStatus: "", detailJob: "", relationshipStatus: "" } });
    expect(b.ok).toBe(true);
    if (!b.ok) continue;
    if (!c.payload[slot].mbtiType) {
      expect(b.profiles.mbti.sourceNodes).toEqual([]);
      expect(b.profiles.fusion.topCandidates).toEqual([]);
    }
    const view = projectRelationshipView(b.profiles, false);
    const nodes = new Map(b.profiles.mbti.sourceNodes.map(n => [n.id, n]));
    expect(view.nodes.some(n => n.sourceDomain === "CHILDREN")).toBe(false);
    const used = reader.chapters.flatMap(ch => ch.paragraphs.flatMap(p => p.sentences.flatMap(s => s.mbtiSourceNodeIds)));
    const blocked = [...new Set(used.filter(id => nodes.has(id) && !view.nodes.some(n => n.id === id)))];
    domainAudit.push({ slot, projectedDomains: view.domains, blockedReaderNodes: blocked.map(id => ({ id, domain: nodes.get(id)?.sourceDomain })), blockedSentences: reader.chapters.flatMap(ch => ch.paragraphs.flatMap(p => p.sentences.filter(s => s.mbtiSourceNodeIds.some(id => blocked.includes(id))).map(s => ({ address: p.id + "." + s.sentenceRole, text: s.text, nodes: s.mbtiSourceNodeIds, refs: s.provenance.sourceRefs })))) });
  }
  const now: Observation = { id: c.id, hashes: { calculation: v4Digest(calc), evidence: v4Digest(e), narrative: v4Digest(product.narrative), integration: v4Digest(product.integration), book: v4Digest(book), personA: product.integration.individualDigests.personA, personB: product.integration.individualDigests.personB }, edition: product.integration.publishedEdition, paragraphs: 36, shortages: reader.shortages, hardErrors: product.integration.readerValidation.hardErrors, directions: ev.directions, relations: ev.relations, domainAudit };
  observations.push(now);
  if (process.env.FRIENDSHIP_BASELINE !== "1") {
    const baseline = JSON.parse(readFileSync(doc + "baseline-generation-digests.json", "utf8")) as Observation[];
    expect(now).toEqual(baseline.find(r => r.id === c.id));
  }
}, 120000);

it("preserves full-slot reversal while name-only exchange keeps the individual calculation roots", () => {
  const get = (id: string) => observations.find(o => o.id === id)!;
  const p0 = get("P0"), p1 = get("P1"), q0 = get("Q0"), q1 = get("Q1");
  expect(p0.hashes.personA).toBe(p1.hashes.personB);
  expect(p0.hashes.personB).toBe(p1.hashes.personA);
  expect(q0.hashes.personA).toBe(q1.hashes.personA);
  expect(q0.hashes.personB).toBe(q1.hashes.personB);
  type Directions = { aToB: { receivedTenGod: unknown }; bToA: { receivedTenGod: unknown } };
  const a = p0.directions as Directions, b = p1.directions as Directions;
  expect(a.aToB).toEqual(b.bToA); expect(a.bToA).toEqual(b.aToB);
  const x = q0.directions as Directions, y = q1.directions as Directions;
  expect(x.aToB.receivedTenGod).toEqual(y.aToB.receivedTenGod);
});
