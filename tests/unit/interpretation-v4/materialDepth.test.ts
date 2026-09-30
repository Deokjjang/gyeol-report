import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { SHINSAL_RULES } from "../../../src/lib/saju/shinsalConstants";
import { SAJU_FEATURE_TAXONOMY } from "../../../src/lib/report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { SAJU_DAY_PILLAR_KNOWLEDGE } from "../../../src/lib/report-knowledge/sajuDayPillarKnowledge";
import { EXTRACTOR_DIRECT_IDS } from "../../../src/lib/interpretation-v3/featureCapabilities";
import { MATERIAL_DEPTH, getMaterialDepth, depthFeature } from "../../../src/lib/interpretation-v4/materialDepth";
import { MATERIAL_BY_FEATURE, canonicalV4Feature } from "../../../src/lib/interpretation-v4/materialRegistry";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { buildFusionCore } from "../../../src/lib/interpretation-v4/fusion";
import { buildMyeongliStructure } from "../../../src/lib/interpretation-v4/structureEvidence";
import { V4_DOMAINS } from "../../../src/lib/interpretation-v4/types";
import type { MaterialCategory } from "../../../src/lib/interpretation-v4/materialDepthTypes";

const calculate = (date: string, time = "09:30", unknown = false) => calculateSaju({ birthDate: date,
  birthTime: unknown ? undefined : time, birthTimeUnknown: unknown, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
const seeds = MATERIAL_DEPTH.flatMap(m => m.seeds);
const normalize = (text: string) => text.replace(/[\s\p{P}\p{S}]/gu, "");
const counts: Readonly<Record<MaterialCategory, number>> = { dayMaster: 10, dayPillar: 60, element: 15, tenGod: 10, structure: 14, marker: 31 };
const coverage = Object.entries(counts).map(([category, expected]) => {
  const rows = MATERIAL_DEPTH.filter(m => m.category === category);
  return { category, expected, actual: rows.length, imagery: rows.filter(m => m.imagery).length,
    positive: rows.filter(m => m.seeds.some(s => s.valence === "positive")).length,
    negative: rows.filter(m => m.seeds.some(s => s.valence === "shadow")).length,
    scene: rows.filter(m => m.seeds.some(s => s.role === "scene")).length,
    seedCount: rows.reduce((n, m) => n + m.seeds.length, 0),
    domains: Object.fromEntries(V4_DOMAINS.map(d => [d, rows.filter(m => m.seeds.some(s => s.domains.includes(d))).length])) };
});

describe("Phase3 authored material coverage and quality", () => {
  it.each(coverage)("$category has $expected separately authored entries", row => {
    expect(row.actual).toBe(row.expected);
    for (const key of ["imagery", "positive", "negative", "scene"] as const) expect(row[key]).toBe(row.expected);
  });
  it.each(MATERIAL_DEPTH.map(m => [m.feature, m] as const))("%s has imagery, differentiated roles, variants and provenance", (_id, m) => {
    expect(m.imagery.length).toBeGreaterThan(6);
    for (const role of ["character", "inside", "strength", "shadow", "scene", "punch", "question", "ending"])
      expect(m.seeds.some(s => s.role === role && s.text.length > 8), role).toBe(true);
    expect(new Set(m.seeds.map(s => s.text)).size).toBe(m.seeds.length);
    expect(m.seeds.filter(s => s.valence === "positive").length).toBeGreaterThan(m.seeds.filter(s => s.valence === "shadow").length);
    expect(m.seeds.filter(s => s.domains.includes("identity")).length).toBeGreaterThanOrEqual(3);
    expect(m.sourceRefs.length).toBeGreaterThanOrEqual(2);
    expect(MATERIAL_BY_FEATURE.get(m.feature)?.depth).toEqual(m);
  });
  it("has no exact duplicate seed/image or backend-name-substitution copy", () => {
    const seen = new Set<string>();
    const duplicates = seeds.filter(s => {
      const normalized = normalize(s.text), duplicate = seen.has(normalized);
      seen.add(normalized); return duplicate;
    });
    expect(duplicates.map(s => ({ id: s.id, text: s.text }))).toEqual([]);
    expect(new Set(seeds.map(s => s.id)).size).toBe(seeds.length);
    expect(new Set(MATERIAL_DEPTH.map(m => normalize(m.imagery))).size).toBe(MATERIAL_DEPTH.length);
    const text = seeds.map(s => s.text).join("\n");
    expect(text).not.toMatch(/KPI|최적화|구조적으로|메타인지|내적 자원|원국 근거를 읽|이번 리포트에서는|이 배치를.*읽|생활 속 기준으로|가온|\$\{/);
    expect(text).not.toMatch(/(?:암|질병|죽음|사고|불임|이혼)(?:이|가|을|를)? (?:생깁|온다|납니다|겪|확정)|수익.*보장|반드시 부자|귀신|빙의/);
  });
  it("source references resolve to actual knowledge rows and native producers", () => {
    for (const m of MATERIAL_DEPTH) for (const ref of m.sourceRefs) {
      if (ref.startsWith("sajuFeatureTaxonomy:")) expect(SAJU_FEATURE_TAXONOMY.some(f => f.id === ref.split(":")[1]), ref).toBe(true);
      if (ref.startsWith("sajuKnowledgeBase:")) expect(SAJU_KNOWLEDGE_BASE.some(f => f.id === ref.split(":")[1]), ref).toBe(true);
      if (ref.startsWith("saju/shinsalConstants:")) expect(SHINSAL_RULES.some(r => r.code === ref.split(":")[1]), ref).toBe(true);
      if (ref.startsWith("sajuDayPillarKnowledge:")) expect(SAJU_DAY_PILLAR_KNOWLEDGE.some(p => p.id === ref.split(":")[1]), ref).toBe(true);
    }
  });
  it("keeps domain gaps explicit instead of calling every positive ending a fortune", () => {
    expect(MATERIAL_DEPTH.every(m => m.seeds.filter(s => s.domains.includes("success/fortune")).every(s => s.role === "fortune"))).toBe(true);
    expect(getMaterialDepth("sinsal_hongyeom")!.seeds.some(s => s.domains.includes("money"))).toBe(false);
    expect(getMaterialDepth("sinsal_baekho")!.seeds.some(s => s.domains.includes("success/fortune"))).toBe(false);
  });
  it("all 60 have distinct first impressions, inner character, work, money and love", () => {
    const pillars = MATERIAL_DEPTH.filter(m => m.category === "dayPillar");
    expect(pillars.map(m => m.feature).sort()).toEqual(SAJU_DAY_PILLAR_KNOWLEDGE.map(m => m.id).sort());
    for (const role of ["character", "inside", "strength", "shadow", "work", "money", "love", "scene", "punch", "question", "ending"]) {
      const lines = pillars.map(m => m.seeds.find(s => s.role === role)!.text);
      expect(new Set(lines.map(normalize)).size).toBe(60);
      // Shared long openings expose stem/branch templates even without names.
      const prefixes = lines.map(t => normalize(t).slice(0, 18));
      expect(Math.max(...prefixes.map(p => prefixes.filter(x => x === p).length))).toBeLessThanOrEqual(2);
    }
  });
  it("limits near-identical day-pillar sentence skeletons, not just exact duplicates", () => {
    const pillars = MATERIAL_DEPTH.filter(m => m.category === "dayPillar");
    const grams = (text: string) => {
      const normalized = normalize(text);
      return new Set(Array.from({ length: Math.max(0, normalized.length - 3) }, (_, i) => normalized.slice(i, i + 4)));
    };
    const allGrams = new Map(pillars.flatMap(m => m.seeds.map(s => [s.id, grams(s.text)] as const)));
    const similar: string[] = [];
    for (let i = 0; i < pillars.length; i++) for (let j = i + 1; j < pillars.length; j++) {
      for (const a of pillars[i].seeds) {
        const b = pillars[j].seeds.find(s => s.role === a.role);
        if (!b) continue;
        const ag = allGrams.get(a.id)!, bg = allGrams.get(b.id)!;
        const overlap = [...ag].filter(g => bg.has(g)).length;
        if (overlap / new Set([...ag, ...bg]).size >= 0.68) similar.push(`${a.id} / ${b.id}`);
      }
    }
    expect(similar).toEqual([]);
  });
  it("covers every supported native/extractor marker without inventing DB-only material", () => {
    const actual = [...SHINSAL_RULES.map(r => canonicalV4Feature(`shinsal:${r.code}`)), ...EXTRACTOR_DIRECT_IDS]
      .filter(id => !id.startsWith("day_pillar_") && id !== "twelve_sinsal_mangsin");
    const missing = [...new Set(actual)].filter(id => !getMaterialDepth(canonicalV4Feature(id)));
    expect(missing).toEqual([]);
    for (const id of ["twelve_sinsal_mangsin", "gwiin_mungok", "gwiin_bokseong", "gwiin_cheoneuiseong"])
      expect(getMaterialDepth(id)).toBeUndefined();
  });
  it("does not confuse yangin with needle or dohwa with hongyeom", () => {
    const text = (id: string) => getMaterialDepth(id)!.seeds.map(s => s.text).join(" ");
    expect(text("sinsal_yangin")).toMatch(/경계|결단/);
    expect(text("sinsal_yangin")).not.toMatch(/오류|관찰/);
    expect(text("sinsal_hyeonchim")).toMatch(/오류|예리/);
    expect(text("sinsal_dohwa")).toMatch(/첫인상/);
    expect(text("sinsal_hongyeom")).toMatch(/가까워질수록|알아갈수록/);
    expect(text("sinsal_baekho") + text("sinsal_gwimun")).not.toMatch(/사고|질병|죽음|귀신|빙의/);
  });
});

describe("Phase3 material packet gates", () => {
  it("only binds verified evidence and preserves source, aliases and existing fusion output", () => {
    const calculation = calculate("1994-11-18"), before = JSON.stringify(calculation);
    const packet = buildMyeongliMaterialPacket({ calculation, mbti: "ENFP", subject: "personA" });
    expect(packet.selected.length).toBeGreaterThan(8);
    expect(new Set(packet.selected.map(m => m.feature)).size).toBe(packet.selected.length);
    for (const entry of packet.selected) {
      expect(entry.evidence.every(d => d.usable && d.strength === "strong" && d.evidence.subject === "personA")).toBe(true);
      for (const d of entry.evidence) for (const ref of d.evidence.sourceRefs) expect(entry.sourceRefs).toContain(ref);
      expect(entry.material.feature).toBe(entry.feature);
      expect(entry.lineage.length).toBeGreaterThan(0);
    }
    const core = buildFusionCore({ calculation, mbti: "ENFP", subject: "personA" });
    expect(packet.fusions).toEqual(core.fusions);
    expect(packet.fortuneComposites).toEqual(core.fortuneComposites);
    expect(JSON.stringify(calculation)).toBe(before);
    expect(JSON.parse(JSON.stringify(packet))).toEqual(packet);
    expect(buildMyeongliMaterialPacket({ calculation, mbti: "ENFP", subject: "personA" })).toEqual(packet);
  });
  it("holds weak/supported structures and never serializes their direct hero copy", () => {
    const calculation = calculate("1984-01-18", "05:30"), packet = buildMyeongliMaterialPacket({ calculation });
    const structures = buildMyeongliStructure(calculation);
    for (const candidate of structures.candidates) {
      if (candidate.confidence !== "strong") expect(packet.selected.some(m => m.feature === `v4_structure:${candidate.id}`)).toBe(false);
    }
    expect(packet.held.some(m => m.feature.startsWith("v4_structure:"))).toBe(true);
    expect(packet.held.every(m => !("material" in m))).toBe(true);
    expect(packet.selected.some(m => /mangsin|mungok|bokseong|cheoneuiseong/.test(m.feature))).toBe(false);
  });
  it("uses weighted element labels unchanged and treats all suggestions as symbolic, not hero/Fusion", () => {
    const calculation = calculate("1994-11-18"), packet = buildMyeongliMaterialPacket({ calculation });
    expect(packet.symbolicElements).toHaveLength(5);
    for (const element of packet.symbolicElements) {
      expect(element.heroEligible).toBe(false); expect(element.symbolicOnly).toBe(true);
      const labels: readonly string[] = calculation.elements.labels;
      expect(element.state).toBe(labels.includes(`${element.element}_STRONG`) ? "high" :
        labels.some(l => l === `${element.element}_WEAK` || l === `${element.element}_MISSING`) ? "low" : "balanced");
    }
    expect(packet.selected.some(m => m.material.category === "element")).toBe(false);
    expect(packet.fusions.some(f => f.myeongliEvidence.some(d => d.evidence.feature.startsWith("element:")))).toBe(false);
    const changed = structuredClone(calculation); changed.elements.weighted.WATER += 1;
    expect(buildMyeongliMaterialPacket({ calculation: changed }).symbolicElements).toEqual([]);
  });
  it("unknown hour keeps confirmed profiles, never asserts missing/balanced elements", () => {
    const packet = buildMyeongliMaterialPacket({ calculation: calculate("1997-08-05", "09:30", true), mbti: "모름" });
    expect(packet.selected.some(m => m.material.category === "dayPillar")).toBe(true);
    expect(packet.selected.some(m => m.material.category === "dayMaster")).toBe(true);
    expect(packet.symbolicElements).toEqual([]);
    expect(packet.selected.some(m => m.feature === "v4_structure:noResource" || m.feature === "v4_structure:noOutput")).toBe(false);
    expect(packet.fusions).toEqual([]);
  });
  it("selects the same source feature once even when multiple marker aliases appear", () => {
    const packet = buildMyeongliMaterialPacket({ calculation: calculate("1984-03-18", "05:30") });
    const aliased = packet.selected.filter(m => m.evidence.length > 1);
    expect(aliased.length).toBeGreaterThan(0);
    for (const entry of aliased) {
      expect(new Set(entry.evidence.map(e => depthFeature(e.evidence.feature)))).toEqual(new Set([entry.feature]));
      expect(entry.sourceRefs.length).toBeGreaterThan(entry.material.sourceRefs.length);
    }
  });
  it("stale calendar proof cannot select profile or symbolic prose", () => {
    const calculation = calculate("2001-01-27");
    calculation.input.birthDate = "2001-01-28";
    const packet = buildMyeongliMaterialPacket({ calculation });
    expect(packet.selected).toEqual([]); expect(packet.symbolicElements).toEqual([]);
  });
});

describe("Phase3 diverse real charts and local export", () => {
  it("reviews 12 distinct day pillars, varied elements, marker density and actual structures", () => {
    const candidates: readonly [string, string, string][] = [
      ["1984-03-18", "05:30", "ENTJ"], ["1984-01-18", "05:30", "ENFP"], ["1990-03-18", "01:30", "ISTJ"],
      ["1984-09-27", "13:30", "INFJ"], ["1984-07-27", "15:30", "INTP"], ["1999-12-06", "01:30", "ESTP"],
      ["1986-01-18", "15:30", "ISFP"], ["1994-11-18", "07:42", "ENFP"], ["1988-03-22", "14:10", "ISTJ"],
      ["1997-08-05", "09:30", "ISFP"], ["1992-12-14", "22:30", "INTP"], ["1995-04-09", "09:15", "ESFJ"],
      ["1985-06-30", "06:00", "INFJ"], ["2001-01-27", "18:20", "ESTP"], ["1987-05-18", "09:30", "ISFJ"],
    ];
    const seen = new Set<string>();
    const samples = candidates.flatMap(([birthDate, birthTime, mbti]) => {
      const calculation = calculate(birthDate, birthTime), packet = buildMyeongliMaterialPacket({ calculation, mbti });
      const pillar = packet.selected.find(m => m.material.category === "dayPillar")!;
      if (seen.has(pillar.feature) || seen.size >= 12) return [];
      seen.add(pillar.feature);
      return [{ birthDate, birthTime, mbti, pillars: calculation.pillars, dayPillar: pillar.feature,
        strength: buildMyeongliStructure(calculation).strength.level,
        markerCount: packet.selected.filter(m => m.material.category === "marker").length,
        elementStates: packet.symbolicElements.map(e => `${e.element}:${e.state}`),
        structures: packet.selected.filter(m => m.material.category === "structure").map(m => m.feature),
        reading: pillar.material.seeds.map(s => ({ role: s.role, text: s.text })), packet }];
    });
    expect(samples).toHaveLength(12); expect(seen.size).toBe(12);
    expect(new Set(samples.map(s => s.reading.map(r => r.text).join(" "))).size).toBe(12);
    const markerCounts = samples.map(s => s.markerCount);
    expect(Math.max(...markerCounts) - Math.min(...markerCounts)).toBeGreaterThanOrEqual(3);
    expect(new Set(samples.map(s => s.elementStates.join(","))).size).toBeGreaterThan(6);
    expect(samples.some(s => s.structures.length)).toBe(true);
    expect(samples.some(s => !s.structures.includes("v4_structure:wealthHeavyWeakDaymaster"))).toBe(true);
    const selectedFeatures = new Set(samples.flatMap(s => s.packet.selected.map(m => m.feature)));
    expect(selectedFeatures.has("v4_structure:wealthHeavyWeakDaymaster")).toBe(true);
    expect(samples.some(s => s.packet.selected.some(m => m.evidence.length > 1))).toBe(true);
    for (const s of samples) {
      expect(s.packet.selected.some(m => m.feature === "twelve_sinsal_nyeonsal")).toBe(false);
      expect(s.packet.selected.some(m => m.feature === "sinsal_dohwa" && m.material.feature === "sinsal_hongyeom")).toBe(false);
      for (const entry of s.packet.selected) expect(entry.feature).toBe(depthFeature(entry.feature));
    }
    if (process.env.V4_PHASE3_EXPORT) {
      expect(process.env.V4_PHASE3_EXPORT).toBe("/tmp/gyeol-v4-phase3-material-packets.json");
      writeFileSync(process.env.V4_PHASE3_EXPORT, JSON.stringify({ version: "phase3-review-1", coverage, totalSeeds: seeds.length, samples }, null, 2) + "\n");
    }
  });
});
