import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HEAVENLY_STEMS, STEM_ELEMENT, BRANCH_MAIN_ELEMENT } from "@/lib/saju/constants";
import { getStemElement, getGeneratedElement, getBranchPairRelations, getAnnualBranchInteractions, getTenGodForStemPair } from "@/lib/report-knowledge/annualFortuneYearRules";
import type { HeavenlyStem, EarthlyBranch, FiveElement } from "@/lib/report-knowledge/annualFortuneTypes";
import type { ResearchBase } from "@/lib/report-knowledge/temporal-interaction-research/temporalResearchTypes";
import manifest from "../../../docs/validation/v4-saju-temporal-interaction-knowledge-01/source-preservation.json";
import { TEMPORAL_SOURCES } from "@/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources";
import { TEMPORAL_BOUNDARIES } from "@/lib/report-knowledge/temporal-interaction-research/temporalBoundaries";
import { TEMPORAL_CONCEPTS } from "@/lib/report-knowledge/temporal-interaction-research/temporalConcepts";
import { TEMPORAL_DOMAINS } from "@/lib/report-knowledge/temporal-interaction-research/temporalDomains";
import { TEMPORAL_ELEMENT_COMBINATIONS } from "@/lib/report-knowledge/temporal-interaction-research/temporalElementCombinations";
import { TEMPORAL_GOD_COMBINATIONS } from "@/lib/report-knowledge/temporal-interaction-research/temporalGodCombinations";
import { TEMPORAL_GOD_ROLES } from "@/lib/report-knowledge/temporal-interaction-research/temporalGodRoles";
import { TEMPORAL_OVERLAPS } from "@/lib/report-knowledge/temporal-interaction-research/temporalOverlaps";
import { TEMPORAL_PERIOD_APPLICATIONS } from "@/lib/report-knowledge/temporal-interaction-research/temporalPeriodApplications";
import { TEMPORAL_PERIOD_DEPTH } from "@/lib/report-knowledge/temporal-interaction-research/temporalPeriodDepth";
import { TEMPORAL_REJECTED } from "@/lib/report-knowledge/temporal-interaction-research/temporalRejected";
import { TEMPORAL_RELATIONS } from "@/lib/report-knowledge/temporal-interaction-research/temporalRelations";
import { TEMPORAL_SCOPES } from "@/lib/report-knowledge/temporal-interaction-research/temporalScopes";
import { TEMPORAL_TRADITION } from "@/lib/report-knowledge/temporal-interaction-research/temporalTradition";
import { TEMPORAL_UNVERIFIED } from "@/lib/report-knowledge/temporal-interaction-research/temporalUnverified";
const records: readonly ResearchBase[] = [...TEMPORAL_BOUNDARIES, ...TEMPORAL_CONCEPTS, ...TEMPORAL_DOMAINS, ...TEMPORAL_ELEMENT_COMBINATIONS, ...TEMPORAL_GOD_COMBINATIONS, ...TEMPORAL_GOD_ROLES, ...TEMPORAL_OVERLAPS, ...TEMPORAL_PERIOD_APPLICATIONS, ...TEMPORAL_PERIOD_DEPTH, ...TEMPORAL_REJECTED, ...TEMPORAL_RELATIONS, ...TEMPORAL_SCOPES, ...TEMPORAL_TRADITION, ...TEMPORAL_UNVERIFIED];
const researchDir = resolve("src/lib/report-knowledge/temporal-interaction-research");
const parseLiteral = (file: string): { id: string; relation: string; form: string; members: string[] }[] => {
  const code = readFileSync(file, "utf8"); return JSON.parse(code.split(" = ")[1].split(" as const")[0]);
};
const previous = readdirSync("src/lib/report-knowledge/relation-research").filter(f => f.startsWith("relationCombinations"))
  .flatMap(f => parseLiteral(resolve("src/lib/report-knowledge/relation-research", f)));
function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(resolve(dir, d.name)) : /\.(tsx?|jsx?|mjs)$/.test(d.name) ? [resolve(dir, d.name)] : []); }

describe("independent temporal research data and source preservation", () => {
  it("has unique non-runtime IDs, valid sources and all A–G states", () => {
    expect(new Set(records.map(r => r.id)).size).toBe(records.length);
    expect(new Set(records.map(r => r.class))).toEqual(new Set(["A","B","C","D","E","F","G"]));
    const sources = new Set<string>(TEMPORAL_SOURCES.map(s => s.id));
    for (const r of records) {
      expect(r.id.startsWith("tr:")).toBe(true); expect(r.connectedToRuntime).toBe(false);
      expect(r.approvedForCustomer).toBe(false); expect(r.runtimeEvidenceIds).toEqual([]);
      expect(r.sourceRefs.length).toBeGreaterThan(0);
      for (const s of r.sourceRefs) expect(sources.has(s), r.id + " / " + s).toBe(true);
    }
    expect(TEMPORAL_TRADITION).toHaveLength(3);
    expect(TEMPORAL_SOURCES.filter(s => s.kind === "historical_transcription").every(s => s.url?.startsWith("https://") && s.verified.includes("직접"))).toBe(true);
  });
  it("covers five concepts, three deep periods, six scopes, eight domains and twelve overlap cases", () => {
    expect(TEMPORAL_CONCEPTS).toHaveLength(5); expect(TEMPORAL_PERIOD_DEPTH).toHaveLength(18);
    expect(TEMPORAL_SCOPES.map(s => s.scope)).toEqual(["natal_dayun","natal_saeun","natal_wolun","dayun_saeun","dayun_wolun","saeun_wolun"]);
    for (const s of TEMPORAL_SCOPES) {
      expect(s.owners).toHaveLength(2); expect(s.support).not.toEqual([]);
      expect(TEMPORAL_DOMAINS.filter(d => d.scope === s.scope).map(d => d.domain)).toEqual(["personality","career","money","study","love","marriage","family","relationships"]);
    }
    expect(TEMPORAL_OVERLAPS).toHaveLength(12);
    expect(TEMPORAL_BOUNDARIES.find(b => b.id === "tr:boundary:legacy-mixed")?.rule).toContain("ordinal");
  });
  it.each(TEMPORAL_GOD_COMBINATIONS)("realizable comparison $dayunGod / $annualGod uses the natal reference twice", row => {
    const findStem = (god: string) => HEAVENLY_STEMS.find(s => getTenGodForStemPair("甲", s) === god)!;
    expect(getTenGodForStemPair("甲", findStem(row.dayunGod))).toBe(row.dayunGod);
    expect(getTenGodForStemPair("甲", findStem(row.annualGod))).toBe(row.annualGod);
    expect(row.reference).toBe("natal_day_master_both"); expect(row.notIndependentFact).toBe(true);
    for (const ref of row.roleRefs) expect(TEMPORAL_GOD_ROLES.some(r => r.id === ref)).toBe(true);
  });
  it("treats the 100 matrix cells as 25 group comparisons with within-group distinctions, not 100 facts", () => {
    expect(TEMPORAL_GOD_ROLES).toHaveLength(10); expect(TEMPORAL_GOD_COMBINATIONS).toHaveLength(100);
    expect(new Set(TEMPORAL_GOD_COMBINATIONS.map(r => r.groupPair)).size).toBe(25);
    expect(TEMPORAL_GOD_COMBINATIONS.filter(r => r.dayunGod === r.annualGod)).toHaveLength(10);
  });
  it.each(TEMPORAL_ELEMENT_COMBINATIONS)("checks directed element $left -> $right without adding strength", row => {
    const l = row.left.toLowerCase() as FiveElement, r = row.right.toLowerCase() as FiveElement;
    const controls: Record<FiveElement, FiveElement> = { wood:"earth",fire:"metal",earth:"water",metal:"wood",water:"fire" };
    const direction = l === r ? "same" : getGeneratedElement(l) === r ? "generates" : getGeneratedElement(r) === l ? "generated_by" : controls[l] === r ? "controls" : "controlled_by";
    expect(row.direction).toBe(direction); expect(row.strengthCalculated).toBe(false);
    expect(Object.values(STEM_ELEMENT)).toContain(row.left); expect(Object.values(BRANCH_MAIN_ELEMENT)).toContain(row.right);
  });
  it.each(TEMPORAL_RELATIONS)("verifies each temporal relation scope $relation / $scope", row => {
    const expected = previous.filter(p => p.relation === row.relation);
    expect(row.combinationRefs).toEqual(expected.map(r => r.id));
    expect(row.definitionRef).toBe("rr:profile:" + row.relation);
    const between = ["dayun_saeun","dayun_wolun","saeun_wolun"].includes(row.scope);
    if (row.relation === "stem_hap") {
      expect(row.producerSupport).toBe(row.scope === "natal_saeun" ? "partial" : "unsupported");
      if (row.scope === "natal_saeun") expect(row.timeQualification).toContain("입춘 전");
    } else if (row.relation === "wonjin") {
      expect(row.producerSupport).toBe(row.scope === "natal_wolun" ? "supported" : "unsupported");
    } else if (row.relation === "samhap" && between) expect(row.producerSupport).toBe("unsupported");
    else {
      expect(row.producerSupport).toBe("supported");
      const labels: Record<string, string> = { yukhap:"육합",chung:"충",samhap:"삼합",hyeong:"형",hae:"해",banhap:"반합",pa:"파" };
      for (const c of expected.filter(c => c.form !== "triple" || c.relation === "samhap")) {
        const [a, b, third] = c.members as [EarthlyBranch, EarthlyBranch, EarthlyBranch | undefined];
        const actual = third ? getAnnualBranchInteractions({ annualBranch: a, natalBranches: [b, third] })
          : getBranchPairRelations(a, b);
        expect(actual.some(r => r.type === labels[row.relation]), c.id).toBe(true);
      }
    }
    if (row.producerSupport === "unsupported") { expect(row.class).toBe("G"); expect(row.producerRefs).toEqual([]); }
    if (row.relation === "hyeong") expect(row.timeQualification).toContain("전체 삼형2개");
  });
  it("keeps all 64 earlier combination references and both unsupported full-triple groups", () => {
    expect(previous).toHaveLength(64);
    expect(new Set(TEMPORAL_RELATIONS.flatMap(r => r.combinationRefs)).size).toBe(64);
    expect(TEMPORAL_RELATIONS).toHaveLength(54);
    expect(TEMPORAL_UNVERIFIED.find(r => r.id === "tr:held:full-hyeong")?.class).toBe("G");
  });
  it("links 42 yearly and 36 monthly applications to actual facts, separate from runtime IDs", () => {
    const ids = new Set<string>(records.map(r => r.id));
    expect(TEMPORAL_PERIOD_APPLICATIONS.filter(r => r.id.startsWith("tr:year:"))).toHaveLength(42);
    expect(TEMPORAL_PERIOD_APPLICATIONS.filter(r => r.id.startsWith("tr:month:"))).toHaveLength(36);
    for (const r of TEMPORAL_PERIOD_APPLICATIONS) {
      expect(r.calculatedFactClass).toBe("B"); expect(r.class).toBe("D");
      expect(r.evidenceRefs.length).toBeGreaterThan(0);
      for (const ref of r.positiveRiskReversalRefs) expect(ids.has(ref), ref).toBe(true);
    }
  });
  it("checks coverage and duplicates without claiming semantic quality from strings", () => {
    expect(new Set(TEMPORAL_GOD_COMBINATIONS.map(r => r.question)).size).toBe(100);
    expect(new Set(TEMPORAL_DOMAINS.map(r => r.question)).size).toBe(48);
    expect(new Set(TEMPORAL_PERIOD_APPLICATIONS.map(r => r.question)).size).toBe(78);
    expect(TEMPORAL_REJECTED.every(r => r.class === "F")).toBe(true);
    expect(TEMPORAL_UNVERIFIED.every(r => r.class === "E" || r.class === "G")).toBe(true);
    // The substantive, manually reviewed contrasts are documented separately.
    expect(readFileSync("docs/validation/v4-saju-temporal-interaction-knowledge-01/semantic-audit.md", "utf8")).toContain("문자열 차이만으로");
  });
  it("preserves every pre-existing source byte and has no runtime import or executable registry", () => {
    expect(Object.keys(manifest.files)).toHaveLength(961);
    for (const [path, hash] of Object.entries(manifest.files)) expect(createHash("sha256").update(readFileSync(path)).digest("hex"), path).toBe(hash);
    for (const file of walk("src")) {
      const text = readFileSync(file,"utf8");
      if (!file.startsWith(researchDir + "/")) expect(text, file).not.toMatch(/temporal-interaction-research|TEMPORAL_(?:CONCEPTS|SCOPES|GOD|ELEMENT|RELATIONS|PERIOD_APPLICATIONS|DOMAINS)/);
      else {
        expect(text, file).not.toMatch(/import(?! type)[^;]*from|export\s*(?:\*|\{)|\b(?:fetch|require|calculateSaju|generateV4ShadowReport)\s*\(|process\.env|Date\.now|Math\.random|\bfunction\s/);
      }
    }
    // Source element labels are grounded in the existing mapper.
    for (const stem of HEAVENLY_STEMS) expect(getStemElement(stem as HeavenlyStem)).toBe(STEM_ELEMENT[stem].toLowerCase());
  });
});
