import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
const folder = "docs/validation/v4-compatibility-parent-child-specialist-engine-01";
const json = <T,>(file: string): T => JSON.parse(readFileSync(folder + "/" + file, "utf8"));
const sha = (b: Buffer) => createHash("sha256").update(b).digest("hex");
it("seals every generated JSON byte", () => {
  const d = json<{ files: Record<string, string> }>("deterministic-output.json");
  expect(Object.keys(d.files)).toHaveLength(42);
  for (const [file, h] of Object.entries(d.files)) expect(sha(readFileSync(folder + "/" + file)), file).toBe(h);
});
it("freezes all18 runtime inputs and4701 original tracked files", () => {
  const original = json<Record<string, string>>("original-file-hashes.json"), inputs = json<Record<string, string>>("source-input-hashes.json");
  expect(Object.keys(original)).toHaveLength(4701); expect(Object.keys(inputs)).toHaveLength(18);
  for (const [file, h] of Object.entries({ ...original, ...inputs })) expect(sha(readFileSync(file)), file).toBe(h);
});
it("retains exact original structural and zero-approval contracts", () => {
  expect(json("compatibility-parent-child-specialist-manifest.json")).toMatchObject({ status: "OFFLINE_IMPLEMENTED", materials: 120, conditional: 108, recall: 12, roleContributions: 480, questions: 180, chapters: 9, paragraphs: 36, roles: 144, candidates: 235, graphCases: 1, binderEvaluations: 235, successfulVariants: 38, expectedRoleErrors: 2, actualVariants: 40, actualCustomerEligible: 0, actualClaims: 0, newActualRoots: 0, runtimeImports: 0, before: { sourceMatchOccurrences: 526, actualEvidenceMatchOccurrences: 50, structurallyMatched: 6, sourceGroupPassOccurrences: 0 }, after: { sourceMatchOccurrences: 526, actualEvidenceMatchOccurrences: 50, structurallyMatched: 6, sourceGroupPassOccurrences: 0 } });
});
it("keeps all120 review entries unapproved and operator order separate", () => {
  const rows = json<{ originalResearchId: string; operatorApproval: boolean; customerApproval: boolean; customerRank: null; operatorReviewOrder: number; reviewOrderIsCustomerRank: boolean }[]>("parent-child-operator-worklist.json");
  expect(rows).toHaveLength(120); expect(new Set(rows.map(r => r.originalResearchId)).size).toBe(120);
  expect(rows.every((r, i) => !r.operatorApproval && !r.customerApproval && r.customerRank === null && r.operatorReviewOrder === i + 1 && !r.reviewOrderIsCustomerRank)).toBe(true);
});
it("preserves55 parenting and63 child source audits without scoring promotion", () => {
  for (const [file, count] of [["parenting-source-validation.json", 55], ["child-source-validation.json", 63]] as const) {
    const d = json<{ records: { hashVerified: boolean; ownerMatched: boolean; scoringProjectionSupported: boolean; actualPersonObservationIssued: boolean }[] }>(file);
    expect(d.records).toHaveLength(count); expect(d.records.every(r => r.hashVerified && r.ownerMatched && !r.scoringProjectionSupported && !r.actualPersonObservationIssued)).toBe(true);
  }
});
it("keeps hypothetical ADULT V audit and actual context unknown", () => {
  const d = json<{ states: string[]; excerpt: string }[]>("parent-child-adult-v-audit.json");
  expect(d).toHaveLength(1); expect(d[0].states).toContain("FUTURE_WRITER_REPAIR_REQUIRED"); expect(d[0].states).toContain("CURRENT_WRITER_UNCHANGED");
  const context = json<{ actualStageEntered: boolean; ageCalculatorAdded: boolean }>("parent-child-developmental-context.json"); expect(context.actualStageEntered).toBe(false); expect(context.ageCalculatorAdded).toBe(false);
});
it("does not invent the eighth source use's material coverage", () => {
  const d = json<{ sourceUse: string; count: number }[]>("parent-child-source-use-audit.json");
  expect(d).toHaveLength(8); expect(d.find(r => r.sourceUse === "actual_natal_condition_required")!.count).toBe(0); expect(d.filter(r => r.count > 0)).toHaveLength(7);
});
it("keeps MBTI-free27 and7140 examined pairs distinct from approvals", () => {
  expect(json<{ materials: unknown[] }>("parent-child-mbti-free-audit.json").materials).toHaveLength(27);
  const d = json<{ fixtures: { conflicts: unknown[] }[]; confirmedConflicts: number; pendingMeanings: number }>("parent-child-semantic-conflicts.json"); expect(d.fixtures[0].conflicts).toHaveLength(7140); expect(d.confirmedConflicts).toBe(0); expect(d.pendingMeanings).toBe(120);
});
it("preserves L/M fallback and two expected role errors", () => {
  const d = json<{ letter: string; publishedEdition: string; fallback: boolean }[]>("parent-child-fallback-audit.json"); expect(d.map(r => r.letter)).toEqual(["L", "M"]); expect(d.every(r => r.fallback && r.publishedEdition === "compatibility-product-13d-7b-v1")).toBe(true);
  expect(json<{ expectedErrors: { letter: string }[] }>("parent-child-legacy-role-boundary.json").expectedErrors.map(r => r.letter)).toEqual(["Q", "R"]);
});
it("omits original synthetic minor names and birth dates from every public JSON", () => {
  const rows = JSON.parse(readFileSync("docs/validation/v4-compatibility-parent-child-product-knowledge-01/input-cases.json", "utf8")) as { variants: { personA: { name: string; birthDate: string }; personB: { name: string; birthDate: string } }[] }[];
  const forbidden = new Set(rows.flatMap(c => c.variants.flatMap(v => [v.personA.name, v.personB.name, v.personA.birthDate, v.personB.birthDate])));
  for (const file of readdirSync(folder).filter(f => f.endsWith(".json"))) { const text = readFileSync(folder + "/" + file, "utf8"); for (const value of forbidden) expect(text.includes(value), file).toBe(false); }
});
it("keeps synthetic selection in its independent namespace", () => {
  const d = json<{ comparison: { method: string; conflicts: string[]; wrongRole: number; childSafetyViolations: number; claimsEmitted: number }[]; actualDisplayComparison: { coveredQuestions: number }[]; actualCustomerApprovals: number }>("parent-child-synthetic-selection.json");
  expect(d.comparison.map(r => r.method)).toEqual(["FIRST_ELIGIBLE", "QUESTION_FIT_FIRST", "GLOBAL_CONSTRAINT_AWARE"]); expect(d.comparison.every(r => !r.conflicts.length && r.wrongRole === 0 && r.childSafetyViolations === 0 && r.claimsEmitted === 0)).toBe(true); expect(d.actualCustomerApprovals).toBe(0); expect(d.actualDisplayComparison[2].coveredQuestions).toBe(180);
});
