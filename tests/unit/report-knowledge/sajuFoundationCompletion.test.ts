import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAJU_FOUNDATION_KNOWLEDGE as previous } from "@/lib/report-knowledge/sajuFoundationKnowledge";
import { COMPLETION_DAYPILLARS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionDayPillars";
import { COMPLETION_TENGODS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionTenGods";
import { COMPLETION_ELEMENTS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionElements";
import { COMPLETION_STEMS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionStems";
import { COMPLETION_BRANCHES } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionBranches";
import { COMPLETION_MARKERS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionMarkers";
import { COMPLETION_HIDDENSTEMS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionHiddenStems";
import { COMPLETION_STAGES } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionStages";
import { COMPLETION_POSITIONS } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionPositions";
import { COMPLETION_YINYANG } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionYinYang";
import { COMPLETION_SOURCES } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionSources";
import type { CompletionResearch } from "@/lib/report-knowledge/foundation-completion/sajuFoundationCompletionTypes";
import type { SajuFoundationDomain } from "@/lib/report-knowledge/sajuFoundationKnowledgeTypes";
import { HIDDEN_STEMS, SEXAGENARY_CYCLE, STEM_ELEMENT, BRANCH_MAIN_ELEMENT, STEM_YIN_YANG, BRANCH_YIN_YANG } from "@/lib/saju/constants";
import { getTenGod } from "@/lib/saju/tenGods";

const domains: SajuFoundationDomain[] = ["personality", "career", "money", "study", "love", "marriage", "family", "relationships"];
const profiles: readonly CompletionResearch[] = [...COMPLETION_DAYPILLARS, ...COMPLETION_TENGODS, ...COMPLETION_ELEMENTS, ...COMPLETION_STEMS, ...COMPLETION_BRANCHES, ...COMPLETION_MARKERS, ...COMPLETION_HIDDENSTEMS, ...COMPLETION_STAGES, ...COMPLETION_POSITIONS, ...COMPLETION_YINYANG];
const doc = "docs/validation/v4-foundation-saju-knowledge-completion-02";
type Cell = { id: string; targetId: string; domain: SajuFoundationDomain; before: string; status: string; materialRef: string | null; reason: string; conditions: string[] };
type CoverageEntry = { id: string; category: string; supplementId: string | null; domains: Record<SajuFoundationDomain, Cell> };
const coverage: { connectedToRuntime: boolean; entries: CoverageEntry[]; counts: Record<string, unknown> } = JSON.parse(readFileSync(resolve(doc, "coverage-manifest.json"), "utf8"));
const allCells = coverage.entries.flatMap(e => Object.values(e.domains));
const byId = new Map(profiles.map(p => [p.id, p]));
const sources = new Map(COMPLETION_SOURCES.map(s => [String(s.id), s]));
function sourceFiles(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(item => item.isDirectory() ? sourceFiles(resolve(path, item.name)) : /\.(ts|tsx|js|mjs)$/.test(item.name) ? [resolve(path, item.name)] : []);
}

describe("offline Saju knowledge completion", () => {
  it("keeps 165 unique qualified research profiles with existing targets", () => {
    expect(profiles).toHaveLength(165);
    expect(new Set(profiles.map(p => p.id)).size).toBe(165);
    for (const p of profiles) {
      expect(previous.find(e => e.id === p.targetId)?.labelKo).toBe(p.label);
      expect(p.id).toBe(p.targetId.replace(/^foundation:/, "completion:"));
      for (const text of [p.core, p.positive, p.risk, p.growth, p.unexpected, ...Object.values(p.behavior)]) expect(text.trim(), p.id).not.toBe("");
      expect(p.conditions.length).toBeGreaterThan(0);
      expect(p.limitations.length).toBeGreaterThan(0);
      expect(p.contrasts.length).toBeGreaterThan(0);
    }
  });
  it.each(COMPLETION_DAYPILLARS)("checks independent $label composition, provenance and all eight domains", p => {
    const actual = SEXAGENARY_CYCLE.find(k => k.stem + k.branch === p.targetId.split(":").at(-1))!;
    expect(p.composition).toEqual({ stem: actual.stem, branch: actual.branch, stemElement: STEM_ELEMENT[actual.stem], branchElement: BRANCH_MAIN_ELEMENT[actual.branch], stemYinYang: STEM_YIN_YANG[actual.stem], branchYinYang: BRANCH_YIN_YANG[actual.branch] });
    expect(Object.keys(p.domains).sort()).toEqual([...domains].sort());
    expect(p.sourceRefs[0].sourceId).toBe(actual.stem + actual.branch === "乙酉" ? "completion-sm5" : "completion-sm4");
    expect(p.conditions.join(" ")).toContain("월령");
  });
  it("covers all finite categories, including 38 stars and 28 stored stems", () => {
    for (const category of ["day_pillar", "ten_god", "element", "heavenly_stem", "earthly_branch", "hidden_stem", "position", "twelve_stage", "yin_yang", "shinsal_gwiin"]) {
      expect(profiles.filter(p => p.targetId.split(":")[1] === category).map(p => p.targetId).sort()).toEqual(previous.filter(e => e.category === category).map(e => e.id).sort());
    }
    let stored = 0;
    for (const p of COMPLETION_HIDDENSTEMS) {
      const branch = p.targetId.split(":").at(-1) as keyof typeof HIDDEN_STEMS;
      expect(p.hiddenStems).toEqual(HIDDEN_STEMS[branch].map(s => s.stem));
      expect(p.review).toBe("repository_composition");
      expect(Object.keys(p.domains)).toEqual([]);
      stored += p.hiddenStems.length;
    }
    expect(stored).toBe(28);
  });
  it("separates source checking from modern applications and unknown traditions", () => {
    expect(profiles.filter(p => p.review === "historical_text_checked")).toHaveLength(139);
    expect(profiles.filter(p => p.review === "unverified_tradition")).toHaveLength(14);
    for (const p of profiles) {
      if (p.review === "unverified_tradition") { expect(p.interpretationReview).toBe("research_metadata_only"); expect(p.domains).toEqual({}); expect(p.pending.length).toBeGreaterThan(0); }
      for (const m of Object.values(p.domains)) {
        expect(m.kind).toBe("modern_editorial_candidate");
        expect(p.interpretationReview).toBe("modern_candidate_not_historical_fact");
        for (const text of Object.values(m)) expect(text.trim()).not.toBe("");
        expect(m.when).toMatch(/경우|상황|때/);
        expect(m.meaning + m.practice).not.toMatch(/틀림없이|반드시.{0,12}(?:성공|결혼|부자|사망|사고)|보장(?:한다|된다|합니다)|(?:수입|성공|결혼|건강|사고|성적).{0,10}확정(?:한다|된다|합니다)/);
      }
      for (const r of p.sourceRefs) { expect(sources.has(r.sourceId)).toBe(true); expect(r.locator.trim()).not.toBe(""); expect(r.proposition.trim()).not.toBe(""); }
    }
    for (const s of COMPLETION_SOURCES) {
      expect(s.contentSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(s.publication).toBeNull();
      if (s.access === "public_transcription_read") { expect(s.location).toMatch(/^https:\/\/zh\.wikisource\.org/); expect(s.revision).toMatch(/^\d+$/); }
    }
  });
  it("retains known source conflicts without changing current star rules", () => {
    for (const key of ["munchang", "bokseong"]) expect(Object.keys(profiles.find(p => p.targetId === `foundation:shinsal_gwiin:${key}`)!.domains)).toEqual([]);
    for (const key of ["wolsal", "mangsin", "yukhae", "jisal"]) expect(profiles.find(p => p.targetId === `foundation:shinsal_gwiin:${key}`)?.review).toBe("unverified_tradition");
    expect(COMPLETION_DAYPILLARS.filter(p => "pending" in p && p.pending.length > 0).map(p => p.targetId.split(":").at(-1)).sort()).toEqual(["乙酉", "丙子", "癸丑", "乙未", "庚戌", "壬戌", "辛巳"].sort());
    expect(getTenGod("乙", "丁")).toBe("食神");
    expect(profiles.find(p => p.targetId === "foundation:day_pillar:乙未")!.pending.join(" ")).toContain("충돌");
  });
  it("assesses all 40 ten-god position cells without promoting missing passages", () => {
    expect(profiles.flatMap(p => p.positionNotes ?? [])).toHaveLength(40);
    for (const p of COMPLETION_TENGODS) {
      expect(p.positionNotes.map(n => n.position)).toEqual(["year", "month", "day", "hour"]);
      for (const n of p.positionNotes) {
        expect(n.meaning.length).toBeGreaterThan(15); expect(n.condition.length).toBeGreaterThan(15);
        if (n.review === "unverified") expect(n.sourceRefs).toEqual([]);
        else for (const r of n.sourceRefs) expect(sources.has(r.sourceId)).toBe(true);
      }
    }
    expect(COMPLETION_TENGODS.find(p => p.targetId.endsWith(":shi_shen"))!.positionNotes.every(n => n.review === "unverified")).toBe(true);
  });
  it("resolves every one of the original 1,545 deferred cells and preserves all prior material", () => {
    expect(coverage.entries.map(e => e.id).sort()).toEqual(previous.map(e => e.id).sort());
    expect(allCells).toHaveLength(1704);
    expect(new Set(allCells.map(c => c.id)).size).toBe(1704);
    let missing = 0;
    for (const e of previous) for (const d of domains) {
      const c = allCells.find(c => c.targetId === e.id && c.domain === d)!;
      const filled = !!e.editorial?.applications[d];
      expect(c.before).toBe(filled ? "conditional_editorial" : "deferred");
      if (!filled) missing++;
      if (filled) expect(c.materialRef).not.toBeNull();
      expect(c.reason.length).toBeGreaterThan(20); expect(c.conditions.length).toBeGreaterThan(0);
      if (c.status === "E_UNVERIFIED") { expect(c.materialRef).toBeNull(); expect(c.reason).toContain(e.labelKo); }
      else {
        const [id, field] = c.materialRef!.split("#");
        if (c.status === "PRIOR_CONDITIONAL_EDITORIAL") expect(field).toBe(`editorial.applications.${d}`);
        else { expect(byId.get(id)?.domains[d]).toBeDefined(); expect(field).toBe(`domains.${d}`); }
        if (c.status === "B_CONDITIONAL_COMPOSITION") { expect(e.category).toBe("day_master"); expect(id).toBe(`completion:heavenly_stem:${e.key}`); }
      }
    }
    expect(missing).toBe(1545);
    expect(allCells.filter(c => c.status === "E_UNVERIFIED")).toHaveLength(664);
    expect(allCells.filter(c => c.materialRef)).toHaveLength(1040);
    expect(coverage.connectedToRuntime).toBe(false);
  });
  it("retains all 739 legacy and 213 prior records with original digests and qualified IDs", () => {
    const audit = JSON.parse(readFileSync(resolve(doc, "knowledge-inventory.json"), "utf8"));
    const old = JSON.parse(readFileSync(resolve("docs/validation/v4-foundation-saju-knowledge-expansion-01/existing-inventory.json"), "utf8"));
    expect(audit.legacy).toHaveLength(739); expect(audit.previousResearch).toHaveLength(213); expect(audit.newResearch).toHaveLength(165);
    for (const row of old.entries) {
      const found = audit.legacy.find((e: { id: string }) => e.id === `legacy:${row.registry}:${row.id}`);
      expect(found.digest).toBe(row.digest); expect(found.fieldAudit).toEqual(row.audit);
    }
    expect(audit.aliasAmbiguities).toEqual(old.aliasAmbiguities);
    expect(audit.missingCanonicalTargets).toEqual([]);
    for (const p of profiles) expect(audit.newResearch.find((r: { id: string }) => r.id === p.id).digest).toBe(createHash("sha256").update(JSON.stringify(p)).digest("hex"));
  });
  it("does not copy day-pillar profiles or domain meanings to fill the cycle", () => {
    for (const field of ["core", "positive", "risk", "growth"] as const) expect(new Set(COMPLETION_DAYPILLARS.map(p => p[field])).size, field).toBe(60);
    for (const field of ["meaning", "practice"] as const) expect(new Set(COMPLETION_DAYPILLARS.flatMap(p => Object.values(p.domains).map(m => m[field]))).size, field).toBe(480);
    const review = JSON.parse(readFileSync(resolve(doc, "semantic-review.json"), "utf8"));
    expect(review.dayPillarPairCount).toBe(1770); expect(review.exactProfileDuplicates).toEqual([]); expect(review.exactDayDomainDuplicates).toEqual([]);
  });
  it("never connects the supplement to runtime generators, calculations, adapters or readers", () => {
    for (const path of sourceFiles(resolve("src")).filter(p => !p.includes("/foundation-completion/"))) expect(readFileSync(path, "utf8"), path).not.toMatch(/foundation-completion|COMPLETION_(DAYPILLARS|TENGODS|MARKERS|SOURCES|YINYANG)/);
  });
});
