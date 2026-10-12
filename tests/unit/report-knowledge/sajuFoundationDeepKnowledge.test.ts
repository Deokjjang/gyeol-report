import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAJU_FOUNDATION_KNOWLEDGE } from "@/lib/report-knowledge/sajuFoundationKnowledge";
import { COMPLETION_SOURCES } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionSources";
import { COMPLETION_TENGODS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionTenGods";
import { COMPLETION_MARKERS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionMarkers";
import { DEEP_APPLICATIONS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepApplications";
import { DEEP_DAY_PILLARS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepDayPillars";
import { DEEP_TEN_GODS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepTenGods";
import { DEEP_POSITIONS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepPositions";
import { DEEP_MARKERS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepMarkers";
import { DEEP_HIDDEN_STEMS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepHiddenStems";
import { DEEP_HIDDEN_REQUIREMENTS } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepRequirements";
import { DEEP_COLLATION } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepCollation";
import { DEEP_SOURCES } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepSources";
import type { DeepMaterial, DeepSourceRef, DeepPosition, DeepHiddenStem } from "@/lib/report-knowledge/foundation-deep/sajuFoundationDeepTypes";
import { HIDDEN_STEMS, SEXAGENARY_CYCLE, STEM_ELEMENT } from "@/lib/saju/constants";
import { getTenGod } from "@/lib/saju/tenGods";

const doc = "docs/validation/v4-foundation-saju-deep-knowledge-03";
function json<T>(path: string): T { return JSON.parse(readFileSync(resolve(path), "utf8")) as T; }
const domains = ["personality", "career", "money", "study", "love", "marriage", "family", "relationships"];
const targets = new Set(SAJU_FOUNDATION_KNOWLEDGE.map(x => String(x.id)));
const sources = new Set([...DEEP_SOURCES, ...COMPLETION_SOURCES].map(x => String(x.id)));
const applications: readonly DeepMaterial[] = DEEP_APPLICATIONS;
const requirements: readonly DeepMaterial[] = DEEP_HIDDEN_REQUIREMENTS;
const all = [...applications, ...requirements, ...DEEP_DAY_PILLARS, ...DEEP_TEN_GODS, ...DEEP_POSITIONS, ...DEEP_MARKERS, ...DEEP_HIDDEN_STEMS, ...DEEP_COLLATION];
function checkRefs(refs: readonly DeepSourceRef[]) {
  for (const ref of refs) { expect(sources.has(ref.sourceId), ref.sourceId).toBe(true); expect(ref.locator.trim()).not.toBe(""); expect(ref.proposition.trim()).not.toBe(""); }
}
function sourceFiles(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(e => e.isDirectory() ? sourceFiles(resolve(path, e.name)) : /\.(tsx?|[cm]?js)$/.test(e.name) ? [resolve(path, e.name)] : []);
}

describe("offline foundation deep knowledge research", () => {
  it("keeps application bundles separate from audit metadata and existing IDs", () => {
    expect(applications).toHaveLength(560); expect(requirements).toHaveLength(96); expect(all).toHaveLength(823);
    expect(new Set(all.map(x => x.id)).size).toBe(823);
    for (const row of all) { expect(row.id).toMatch(/^deep:/); expect(targets.has(row.targetId), row.id).toBe(true); }
    expect(DEEP_SOURCES).toHaveLength(15); expect(new Set(DEEP_SOURCES.map(x => x.id)).size).toBe(15);
    for (const s of DEEP_SOURCES) { expect(s.contentSha256).toMatch(/^[a-f\d]{64}$/); expect(s.sections.length).toBeGreaterThan(0); expect(s.limitations.length).toBeGreaterThan(0); }
    expect(DEEP_SOURCES.find(x => x.id === "deep-editorial")?.contentSha256).toBe(createHash("sha256").update(readFileSync(resolve("src/lib/report-knowledge/foundation-deep/sajuFoundationDeepApplications.ts"))).digest("hex"));
    for (const row of all) checkRefs("checkedSources" in row ? row.checkedSources : row.sourceRefs);
  });
  it("does not promote modern questions or prerequisite requests into verified facts", () => {
    for (const row of [...applications, ...requirements]) {
      for (const field of ["readerQuestion", "coreMeaning", "positive", "caution", "differentiation"] as const) expect(row[field].trim(), row.id).not.toBe("");
      expect(row.prerequisites.length).toBeGreaterThanOrEqual(3); expect(row.followUp.length).toBeGreaterThan(0);
      if (row.id.startsWith("deep:application:")) {
        expect(row.evidenceLevel).toBe("modern_conditional_candidate"); expect(row.review).toBe("editorial_reviewed_not_validated");
        expect(row.differentiation).toMatch(/독점/);
        expect(row.positive + row.readerQuestion).not.toMatch(/틀림없이|반드시.{0,10}(성공|결혼|부자|사망)|(?:수익|성공|건강).{0,5}보장(?:한다|됩니다)/);
      } else { expect(row.evidenceLevel).toBe("research_requirements_only"); expect(row.review).toBe("unverified_application_after_premise_review"); }
    }
  });
  it.each(DEEP_DAY_PILLARS)("compares $label with actual same-stem and same-branch structures", p => {
    const actual = SEXAGENARY_CYCLE.find(x => x.stem === p.stem && x.branch === p.branch);
    expect(actual).toBeDefined();
    expect(p.stored).toEqual(HIDDEN_STEMS[p.branch].map(x => ({ stem: x.stem, role: x.kind, weight: x.weight, tenGod: getTenGod(p.stem, x.stem) })));
    expect(p.contrasts).toHaveLength(2);
    for (const contrast of p.contrasts) {
      const other = DEEP_DAY_PILLARS.find(x => x.targetId === contrast.otherTargetId)!;
      expect(other).toBeDefined(); expect(other.targetId).not.toBe(p.targetId);
      if (contrast.kind === "same_stem") { expect(other.stem).toBe(p.stem); expect(other.branch).not.toBe(p.branch); }
      else { expect(other.branch).toBe(p.branch); expect(other.stem).not.toBe(p.stem); }
      for (const x of other.stored) expect(x.tenGod).toBe(getTenGod(other.stem, x.stem));
      expect(contrast.meaning).toContain(p.stem + p.branch); expect(contrast.meaning).toContain(other.stem + other.branch);
    }
    const rows = applications.filter(x => x.targetId === p.targetId);
    expect(rows.map(x => x.domain)).toEqual(domains); expect(p.applicationIds).toEqual(rows.map(x => x.id));
    for (const field of ["readerQuestion", "positive", "caution"] as const) expect(new Set(rows.map(x => x[field])).size, p.targetId + field).toBe(8);
    expect(p.inheritedMeaningRef).toContain("completion:day_pillar:");
  });
  it("covers precisely all 60 day pillars without claiming global psychological exclusivity", () => {
    expect(DEEP_DAY_PILLARS.map(x => x.stem + x.branch)).toEqual(SEXAGENARY_CYCLE.map(x => x.stem + x.branch));
    expect(applications.filter(x => x.targetId.startsWith("foundation:day_pillar:"))).toHaveLength(480);
    expect(new Set(applications.map(x => x.readerQuestion)).size).toBe(560);
  });
  it.each(DEEP_TEN_GODS)("keeps eight independent domain questions and strength conditions for $label", p => {
    const rows = applications.filter(x => x.targetId === p.targetId);
    expect(rows.map(x => x.domain)).toEqual(domains); expect(rows.map(x => x.id)).toEqual(p.applicationIds);
    for (const field of ["readerQuestion", "positive", "caution"] as const) expect(new Set(rows.map(x => x[field])).size).toBe(8);
    expect(targets.has(p.contrastTargetId)).toBe(true); expect(p.contrastTargetId).not.toBe(p.targetId);
    expect(p.prerequisites.join(" ") + p.strengthConditions.join(" ")).toMatch(/강약|약한|강한|감당/); expect(p.strengthConditions.join(" ").length).toBeGreaterThan(30);
  });
  it("preserves the opposite-yin-yang ten-god definitions and paired distinctions", () => {
    expect(DEEP_TEN_GODS).toHaveLength(10);
    const expected = [["甲", "比肩"], ["乙", "劫財"], ["丙", "食神"], ["丁", "傷官"], ["戊", "偏財"], ["己", "正財"], ["庚", "偏官"], ["辛", "正官"], ["壬", "偏印"], ["癸", "正印"]] as const;
    for (const [stem, label] of expected) expect(getTenGod("甲", stem)).toBe(label);
    expect(getTenGod("乙", "丁")).toBe("食神");
    for (const p of DEEP_TEN_GODS) expect(DEEP_TEN_GODS.find(x => x.targetId === p.contrastTargetId)?.contrastTargetId).toBe(p.targetId);
  });
  it("investigates all 15 position gaps without calling seven limited passages verified life meanings", () => {
    const notes: readonly DeepPosition[] = DEEP_POSITIONS;
    expect(notes).toHaveLength(40); expect(notes.filter(x => x.wasUnverified)).toHaveLength(15);
    expect(notes.filter(x => x.review === "limited_passage_checked")).toHaveLength(7);
    expect(notes.filter(x => x.review === "unverified_after_search")).toHaveLength(8);
    for (const p of COMPLETION_TENGODS) for (const old of p.positionNotes) {
      const note = notes.find(x => x.targetId === p.targetId && x.position === old.position)!;
      expect(note.wasUnverified).toBe(old.review === "unverified");
      expect(note.condition.trim()).not.toBe(""); expect(note.followUp.length).toBeGreaterThan(0);
      if (note.review === "unverified_after_search") expect(note.sourceRefs).toEqual([]);
    }
    expect(notes.find(x => x.targetId.endsWith(":pian_yin") && x.position === "hour")?.condition).toContain("길흉 미정");
    expect(notes.find(x => x.targetId.endsWith(":shi_shen") && x.position === "day")?.condition).toContain("일간 자체");
  });
  it.each(DEEP_MARKERS)("retains qualified name, lineage, prohibitions and pending review for $label", m => {
    const previous = COMPLETION_MARKERS.find(x => x.targetId === m.targetId)!;
    expect(m.previousReview).toBe(previous.review); expect(m.positiveCandidate).toBe(previous.positive); expect(m.caution).toBe(previous.risk);
    expect(m.interpretationReview).toBe("not_newly_validated"); expect(m.followUp.length).toBeGreaterThan(0);
    expect(m.forbiddenClaims.join(" ")).toContain("단정하지 않는다"); expect(m.lineageDifference.trim()).not.toBe("");
  });
  it("reviews every star including all 14 unknown traditions and separates homonyms", () => {
    expect(DEEP_MARKERS).toHaveLength(38); expect(DEEP_MARKERS.filter(x => x.previousReview === "unverified_tradition")).toHaveLength(14);
    expect(DEEP_MARKERS.filter(x => x.previousReview === "unverified_tradition").every(x => x.sourceRefs.some(r => r.sourceId.startsWith("deep-")))).toBe(true);
    const star = (key: string) => DEEP_MARKERS.find(x => x.targetId.endsWith(":" + key))!;
    expect(star("amrok").sourceStatus).toBe("printed_formation_checked");
    for (const key of ["baekho", "cheonmun", "cheoneuiseong"]) expect(star(key).sourceStatus).toBe("homonym_context_separated");
    expect(star("cheonmun").formation).toContain("天門星"); expect(star("cheonmun").formation).toContain("天文星");
    expect(star("cheoneuiseong").formation).toContain("정월 戌"); expect(star("baekho").lineageDifference).toContain("출생 사주");
    expect(star("gwimun").formation).toContain("연주 제외");
    expect(star("mangsin").targetId).not.toBe(star("wangshen").targetId);
  });
  it.each(DEEP_HIDDEN_STEMS)("preserves $targetId storage, weights and all eight unfilled premise requests", p => {
    const branch = p.targetId.at(-1) as keyof typeof HIDDEN_STEMS;
    expect(p.stored).toEqual(HIDDEN_STEMS[branch].map(x => ({ stem: x.stem, role: x.kind, weight: x.weight })));
    expect(p.elementComposition).toEqual([...new Set(HIDDEN_STEMS[branch].map(x => STEM_ELEMENT[x.stem]))].sort());
    const reqs = requirements.filter(x => x.targetId === p.targetId);
    expect(reqs.map(x => x.domain)).toEqual(domains); expect(p.requirementIds).toEqual(reqs.map(x => x.id));
    expect(p.roleTerminology).toContain("자동 번역하지 않는다"); expect(p.weightMeaning).toContain("사령 일수");
    expect(p.positionalLimits.join(" ")).toContain("미상");
  });
  it("retains seven open collation issues and all 28 stored stems", () => {
    const hidden: readonly DeepHiddenStem[] = DEEP_HIDDEN_STEMS;
    expect(hidden.flatMap(x => x.stored)).toHaveLength(28);
    expect(DEEP_COLLATION.map(x => x.targetId.split(":").at(-1)).sort()).toEqual(["乙酉", "乙未", "丙子", "癸丑", "庚戌", "壬戌", "辛巳"].sort());
    for (const issue of DEEP_COLLATION) { expect(issue.review).toBe("open_after_additional_source_search"); expect(issue.checkedSources.length).toBeGreaterThan(1); expect(issue.followUp.join(" ")).toContain("보존"); }
  });
  it("classifies all original 558 reuse groups and records their actual field locations", () => {
    type Group = { text: string; ids: string[]; classification: string; fieldLocators: Record<string, string[]>; existingDataChanged: boolean; rationale: string; proposal: string };
    const audit = json<{ groups: Group[]; classificationCounts: Record<string, number>; nearTemplateFamilies: { matches: unknown[] }[] }>(doc + "/semantic-duplication.json");
    const old = json<{ repeatedLegacyMaterials: { text: string; ids: string[] }[] }>("docs/validation/v4-foundation-saju-knowledge-expansion-01/knowledge-duplication.json");
    expect(audit.groups.map(({ text, ids }) => ({ text, ids }))).toEqual(old.repeatedLegacyMaterials);
    expect(audit.groups).toHaveLength(558); expect(Object.values(audit.classificationCounts).reduce((a, b) => a + b, 0)).toBe(558);
    for (const g of audit.groups) { expect(g.existingDataChanged).toBe(false); expect(Object.keys(g.fieldLocators)).toEqual(g.ids); for (const locations of Object.values(g.fieldLocators)) expect(locations.length).toBeGreaterThan(0); expect(g.rationale.length).toBeGreaterThan(30); expect(g.proposal.length).toBeGreaterThan(30); }
    expect(audit.nearTemplateFamilies.map(x => x.matches.length)).toEqual([59, 57]);
  });
  it("accounts for all 664 deferred cells and hands off 304 composite requests without implementation", () => {
    type Cell = { id: string; targetId: string; domain: string; after: string; approvedApplication: boolean; researchRefs: string[]; requirements: string[] };
    const manifest = json<{ connectedToRuntime: boolean; cells: Cell[]; nowApprovedFromThoseCells: number; compositeHandoff: { structureCells: number; relationCells: number; implementation: string } }>(doc + "/coverage-manifest.json");
    const old = json<{ entries: { domains: Record<string, { id: string; status: string }> }[] }>("docs/validation/v4-foundation-saju-knowledge-completion-02/coverage-manifest.json");
    expect(manifest.cells.map(x => x.id)).toEqual(old.entries.flatMap(x => Object.values(x.domains)).filter(x => x.status === "E_UNVERIFIED").map(x => x.id));
    expect(manifest.cells).toHaveLength(664); expect(manifest.connectedToRuntime).toBe(false); expect(manifest.nowApprovedFromThoseCells).toBe(0);
    const ids = new Set(all.map(x => String(x.id)));
    for (const cell of manifest.cells) { expect(cell.approvedApplication).toBe(false); expect(targets.has(cell.targetId)).toBe(true); expect(cell.requirements.length).toBeGreaterThan(0); for (const id of cell.researchRefs) expect(ids.has(id)).toBe(true); }
    expect(manifest.cells.filter(x => x.after === "COMPOSITE_HANDOFF_ONLY")).toHaveLength(304);
    expect(manifest.compositeHandoff).toMatchObject({ structureCells: 232, relationCells: 72, implementation: "not_started" });
  });
  it("preserves every pre-existing source byte including all 1,117 records and product engines", () => {
    const m = json<{ existingRecordCount: number; protectedSourceFileCount: number; sourceFileSha256: Record<string, string> }>(doc + "/preservation-manifest.json");
    expect(m.existingRecordCount).toBe(1117); expect(Object.keys(m.sourceFileSha256)).toHaveLength(m.protectedSourceFileCount);
    for (const [path, hash] of Object.entries(m.sourceFileSha256)) expect(createHash("sha256").update(readFileSync(resolve(path))).digest("hex"), path).toBe(hash);
  });
  it("has no runtime import, dynamic import, barrel export or raw lookup connection", () => {
    for (const path of sourceFiles(resolve("src")).filter(p => !p.includes("/foundation-deep/"))) expect(readFileSync(path, "utf8"), path).not.toMatch(/foundation-deep|DEEP_(APPLICATIONS|DAY_PILLARS|TEN_GODS|MARKERS|HIDDEN_STEMS|SOURCES)/);
    for (const path of sourceFiles(resolve("src/lib/report-knowledge/foundation-deep"))) {
      const text = readFileSync(path, "utf8");
      expect(text).not.toMatch(/import\s+(?!type\b)|export\s+(?:\*|\{)|\b(?:fetch|require|calculateSaju|generateV4ShadowReport)\s*\(|process\.env|Date\.now|Math\.random/);
    }
  });
});
