import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAJU_FOUNDATION_KNOWLEDGE as entries } from "@/lib/report-knowledge/sajuFoundationKnowledge";
import { SAJU_FOUNDATION_SOURCES as sources } from "@/lib/report-knowledge/sajuFoundationSources";
import { SAJU_KNOWLEDGE_BASE } from "@/lib/report-knowledge/sajuKnowledgeBase";
import { SAJU_FEATURE_TAXONOMY } from "@/lib/report-knowledge/sajuFeatureTaxonomy";
import { SAJU_DAY_PILLAR_KNOWLEDGE } from "@/lib/report-knowledge/sajuDayPillarKnowledge";
import { SAJU_BRANCH_SYMBOL_KNOWLEDGE } from "@/lib/report-knowledge/sajuBranchSymbolKnowledge";
import { SHINSAL_METADATA, SHINSAL_RULES } from "@/lib/saju/shinsalConstants";
import { MATERIAL_REGISTRY } from "@/lib/interpretation-v4/materialRegistry";
import { MATERIAL_DEPTH } from "@/lib/interpretation-v4/materialDepth";
import { DAY_PILLAR_PROFILES } from "@/lib/saju/dayPillarProfiles";
import { YIN_YANG_COPY } from "@/lib/interpretation-v4/foundationYinYang";
import { FOUNDATION_ELEMENT_REGISTRY } from "@/lib/interpretation-v4/foundationElements";
import { HEAVENLY_STEM_SEMANTICS, EARTHLY_BRANCH_SEMANTICS } from "@/lib/interpretation-v4/foundationPillars";
import { TEN_GOD_SEMANTICS } from "@/lib/interpretation-v4/foundationTenGods";
import { TWELVE_STAGE_SEMANTICS } from "@/lib/interpretation-v4/foundationTwelveStages";
import { SHINSAL_SEMANTICS } from "@/lib/interpretation-v4/foundationShinsal";
import { STRUCTURE_MATERIALS } from "@/lib/interpretation-v4/structureMaterials";
import { STRUCTURE_RULES } from "@/lib/interpretation-v4/structureRules";
import { RELATION_SEMANTICS, RELATIONS_WITHOUT_NATAL_PRODUCER } from "@/lib/interpretation-v4/foundationRelations";
import * as constants from "@/lib/saju/constants";
import type { SajuFoundationDomain } from "@/lib/report-knowledge/sajuFoundationKnowledgeTypes";

const baseSha = "be4054671d166b3a11127c5bf013b77eab5cd919";
const domains: readonly SajuFoundationDomain[] = ["personality", "career", "money", "study", "love", "marriage", "family", "relationships"];
const keyed = <T extends object>(data: Readonly<Record<string, T>>) => Object.entries(data).map(([id, value]) => ({ id, ...value }));
const registries = {
  knowledge: SAJU_KNOWLEDGE_BASE, taxonomy: SAJU_FEATURE_TAXONOMY,
  dayPillars: SAJU_DAY_PILLAR_KNOWLEDGE, branches: SAJU_BRANCH_SYMBOL_KNOWLEDGE,
  shinsal: Object.values(SHINSAL_METADATA), materials: MATERIAL_REGISTRY, depth: MATERIAL_DEPTH,
  legacyProfiles: DAY_PILLAR_PROFILES,
  v4YinYang: keyed(YIN_YANG_COPY), v4Elements: keyed(FOUNDATION_ELEMENT_REGISTRY),
  v4Stems: keyed(HEAVENLY_STEM_SEMANTICS), v4Branches: keyed(EARTHLY_BRANCH_SEMANTICS),
  v4TenGods: keyed(TEN_GOD_SEMANTICS), v4Stages: keyed(TWELVE_STAGE_SEMANTICS),
  v4Stars: keyed(SHINSAL_SEMANTICS), v4Structures: keyed(STRUCTURE_MATERIALS), v4Relations: keyed(RELATION_SEMANTICS),
};
const rows = Object.entries(registries).flatMap(([registry, values]) => values.map(value => {
  const record = value as unknown as Record<string, unknown>;
  return { registry, record, id: String(record.id ?? record.code ?? record.feature ?? record.branch) };
}));
const counts = (values: readonly string[]) => Object.fromEntries([...new Set(values)].sort().map(key => [key, values.filter(v => v === key).length]));
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const inventory = {
  baseSha,
  note: "Registry records overlap. Counts are records, not independent verified concepts. Existing definitions and phrases have not acquired external provenance through this audit.",
  registries: Object.entries(registries).map(([name, values]) => ({ name, count: values.length, digest: hash(values), categories: counts(values.map(v => String((v as unknown as Record<string, unknown>).category ?? "uncategorized"))) })),
  constants: { digest: hash(constants), values: constants },
  ruleContracts: { shinsal: SHINSAL_RULES, v4Structures: STRUCTURE_RULES, relationNames: Object.keys(RELATION_SEMANTICS), relationsWithoutNatalProducer: RELATIONS_WITHOUT_NATAL_PRODUCER },
  entries: rows.map(({ registry, id, record }) => {
    const fieldPresent = (names: string[]) => names.filter(name => record[name] !== undefined && JSON.stringify(record[name]) !== "[]");
    return {
      registry, id, label: record.labelKo ?? record.nameKo ?? record.label ?? record.imagery ?? id,
      aliases: record.aliases ?? [], category: record.category ?? "uncategorized", digest: hash(record),
      fields: Object.keys(record),
      audit: {
        A_definition: fieldPresent(["summary", "meaning", "personality", "symbolicImage", "shortDescriptionKo", "positiveMeaning", "imagery", "coreSummaryKo", "easyMeaning"]),
        B_traditional_editorial_separation: "not_explicit_in_legacy_schema",
        C_positive: fieldPresent(["positiveTags", "positiveReading", "positiveKeywords", "positiveMeaning", "strengthItems", "strengths"]),
        D_caution: fieldPresent(["riskTags", "cautionReading", "cautionKeywords", "shadowMeaning", "cautionItems", "weaknesses"]),
        E_domain_material: fieldPresent(["topicInterpretations", "careerHints", "moneyHints", "workMoney", "loveRelationship", "familyPeople", "topics", "domains", "seeds", "contexts", "workMoney", "loveRelationships"]),
        F_application_conditions: "field_presence_is_not_verified_sufficiency",
        G_prohibited_uses: fieldPresent(["avoidClaims", "matchingHints", "balanceHints"]),
        H_distinctions: "no_dedicated_verified_distinction_field",
        I_duplicates: "see_alias_and_repeated_material_groups",
        J_provenance: "repository_only_external_bibliography_missing",
      },
      internalSourceRefs: record.sourceRefs ?? [],
    };
  }),
  aliasAmbiguities: Object.keys(registries).flatMap(registry => {
    const aliases = new Map<string, string[]>();
    for (const row of rows.filter(r => r.registry === registry)) {
      for (const alias of (row.record.aliases ?? []) as string[]) aliases.set(alias, [...(aliases.get(alias) ?? []), row.id]);
    }
    return [...aliases].filter(([, ids]) => new Set(ids).size > 1).map(([alias, ids]) => ({ registry, alias, ids }));
  }),
};
const repeated = new Map<string, Set<string>>();
function collectMaterial(value: unknown, ref: string): void {
  if (typeof value === "string") {
    if (value.length < 20) return;
    const ids = repeated.get(value) ?? new Set<string>(); ids.add(ref); repeated.set(value, ids);
  } else if (Array.isArray(value)) for (const part of value) collectMaterial(part, ref);
  else if (value && typeof value === "object") for (const part of Object.values(value)) collectMaterial(part, ref);
}
for (const row of rows) for (const key of ["meaning", "summary", "positiveReading", "cautionReading", "positiveMeaning", "shadowMeaning", "phraseSeeds", "sceneSeeds", "seeds"]) collectMaterial(row.record[key], `${row.registry}:${row.id}`);
const duplication = {
  note: "Exact repetitions across separate records, including intentional registry reuse. This is not a semantic equivalence oracle. Shared safety conditions and editorial disclaimers are not new independent knowledge.",
  legacyAliasAmbiguities: inventory.aliasAmbiguities,
  legacyDuplicateLabels: Object.keys(registries).flatMap(registry => {
    const labels = new Map<string, string[]>();
    for (const row of rows.filter(r => r.registry === registry)) {
      const label = String(row.record.labelKo ?? row.record.label ?? row.record.nameKo ?? row.id);
      labels.set(label, [...(labels.get(label) ?? []), row.id]);
    }
    return [...labels].filter(([, ids]) => new Set(ids).size > 1).map(([label, ids]) => ({ registry, label, ids }));
  }),
  repeatedLegacyMaterials: [...repeated].filter(([, ids]) => ids.size > 1).map(([text, ids]) => ({ text, ids: [...ids] })),
  duplicateNewDefinitions: entries.filter((e, index) => entries.some((other, otherIndex) => otherIndex < index && other.definition.text === e.definition.text)).map(e => e.id),
};
const coverage = {
  baseSha, schemaVersion: 1, connectedToRuntime: false, totalEntries: entries.length,
  categoryCounts: counts(entries.map(e => e.category)), definitionReviews: counts(entries.map(e => e.definition.review)),
  supportCounts: counts(entries.map(e => e.support.calculation)),
  domainCounts: Object.fromEntries(domains.map(d => [d, entries.filter(e => e.editorial?.applications[d]).length])),
  sources: sources.map(s => ({ id: s.id, verification: s.verification, location: s.location })),
  entries: entries.map(e => ({
    id: e.id, labelKo: e.labelKo, category: e.category, digest: hash(e),
    definition: e.definition.review,
    traditionalAspects: counts(e.traditional.map(t => t.aspect)),
    editorialPositive: !!e.editorial?.positive, editorialCaution: !!e.editorial?.caution,
    excessOrDeficit: e.editorial ? "conditional_editorial" : "deferred",
    domains: Object.fromEntries(domains.map(d => [d, e.editorial?.applications[d] ? "conditional_editorial" : "deferred"])),
    conditions: e.appliesWhen, exclusions: e.doNotApply, distinctions: e.distinctions,
    sourceRefs: [e.definition, ...e.traditional].flatMap(s => s.sourceRefs),
    calculationSupport: e.support, relatedIds: e.relatedIds, pending: e.deferred,
  })),
};
function manifest(name: string, value: unknown) {
  const path = resolve("docs/validation/v4-foundation-saju-knowledge-expansion-01", name);
  if (process.env.UPDATE_SAJU_FOUNDATION_MANIFEST === "1") writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
  expect(JSON.parse(readFileSync(path, "utf8"))).toEqual(JSON.parse(JSON.stringify(value)));
}
function sourceFiles(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(item => item.isDirectory() ? sourceFiles(resolve(path, item.name)) : /\.(ts|tsx|js|mjs)$/.test(item.name) ? [resolve(path, item.name)] : []);
}

describe("unconnected Saju foundation knowledge", () => {
  it("inventories legacy IDs, aliases, fields, rules and exact content digests", () => manifest("existing-inventory.json", inventory));
  it("records exact legacy repetition while preserving all materials", () => { manifest("knowledge-duplication.json", duplication); expect(duplication.duplicateNewDefinitions).toEqual([]); });
  it("reports every filled and deferred field without equating identity with interpretation coverage", () => manifest("coverage-manifest.json", coverage));
  it("covers finite canonical classifications exactly once", () => {
    for (const [category, keys] of Object.entries({ yin_yang: ["yin", "yang"], element: ["wood", "fire", "earth", "metal", "water"], heavenly_stem: constants.HEAVENLY_STEMS, day_master: constants.HEAVENLY_STEMS, earthly_branch: constants.EARTHLY_BRANCHES, hidden_stem: constants.EARTHLY_BRANCHES, day_pillar: constants.SEXAGENARY_CYCLE.map(p => p.stem + p.branch), position: ["year", "month", "day", "hour"] })) {
      expect(entries.filter(e => e.category === category).map(e => e.key).sort()).toEqual([...keys].sort());
    }
    expect(entries.filter(e => e.category === "ten_god").map(e => e.labelKo).sort()).toEqual(["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"].sort());
    expect(entries.filter(e => e.category === "twelve_stage").map(e => e.labelKo)).toEqual(["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"]);
  });
  it("keeps IDs and category-qualified aliases unambiguous", () => {
    expect(new Set(entries.map(e => e.id)).size).toBe(entries.length);
    const aliases = entries.flatMap(e => e.aliases.map(a => `${e.category}:${a}`));
    expect(new Set(aliases).size).toBe(aliases.length);
    expect(new Set(sources.map(s => s.id)).size).toBe(sources.length);
  });
  it("resolves every historical and internal reference at its actual review level", () => {
    for (const e of entries) for (const statement of [e.definition, ...e.traditional]) {
      expect(statement.sourceRefs.length).toBeGreaterThan(0);
      for (const ref of statement.sourceRefs) {
        const source = sources.find(s => s.id === ref.sourceId);
        expect(source).toBeDefined(); expect(ref.locator.trim()).not.toBe("");
        if (statement.review === "source_checked") expect(source?.verification).toBe("text_accessed");
        if (statement.review === "repository_only") expect(source?.verification).toBe("repository_inspected");
      }
    }
    for (const source of sources.filter(s => s.kind === "repository")) expect(existsSync(resolve(source.location))).toBe(true);
  });
  it("resolves legacy IDs and related concepts without repurposing old IDs", () => {
    const refs = new Set(rows.map(r => `${r.registry}:${r.id}`));
    const ids = new Set(entries.map(e => e.id));
    for (const e of entries) {
      for (const ref of e.support.legacyRefs) expect(refs.has(ref), ref).toBe(true);
      for (const id of [...e.relatedIds, ...(e.editorial?.basedOn ?? [])]) expect(ids.has(id), id).toBe(true);
    }
  });
  it("covers every existing day pillar, shinsal/gwiin and structure taxonomy record", () => {
    const refs = new Set(entries.flatMap(e => e.support.legacyRefs));
    for (const row of rows.filter(r => r.registry === "shinsal" || r.registry === "dayPillars" || (r.registry === "knowledge" && ["special_pattern", "sinsal", "nobleman"].includes(String(r.record.category))) || (r.registry === "taxonomy" && ["structure", "sinsal", "gwiin", "twelve_sinsal"].includes(String(r.record.category))) || (r.registry === "depth" && r.record.category === "structure"))) {
      expect(refs.has(`${row.registry}:${row.id}`), `${row.registry}:${row.id}`).toBe(true);
    }
  });
  it("preserves hidden-stem composition and exposes it as internal rather than authenticated ancient weights", () => {
    for (const [branch, stems] of Object.entries(constants.HIDDEN_STEMS)) {
      const e = entries.find(e => e.category === "hidden_stem" && e.key === branch)!;
      expect(e.relatedIds.filter(id => id.startsWith("foundation:heavenly_stem:"))).toEqual(stems.map(s => `foundation:heavenly_stem:${s.stem}`));
      expect(e.definition.review).toBe("repository_only");
      expect(e.distinctions.join(" ")).toContain("확률이 아니다");
    }
  });
  it("separates hypothetical editorial applications and keeps missing domains explicitly deferred", () => {
    for (const e of entries) {
      expect(e.appliesWhen.length).toBeGreaterThan(0); expect(e.doNotApply.length).toBeGreaterThan(0); expect(e.deferred.length).toBeGreaterThan(0);
      if (e.editorial) {
        expect(e.editorial.review).toBe("editorial_example");
        for (const application of Object.values(e.editorial.applications)) {
          expect(application.when.trim()).not.toBe("");
          expect(application.when).toMatch(/경우|상황|때/);
          expect(application.example.trim()).not.toBe("");
          expect(application.example).not.toMatch(/반드시|무조건|보장(?:한다|된다|합니다)|확정(?:한다|된다|합니다)|틀림없이/);
        }
      }
    }
  });
  it("keeps source conflicts and uncertain domains visible", () => {
    for (const key of ["戊", "辛", "壬"]) expect(entries.find(e => e.category === "heavenly_stem" && e.key === key)?.distinctions.length).toBeGreaterThan(0);
    expect(sources.filter(s => s.verification === "transcription_warning").map(s => s.id).sort()).toEqual(["sm6", "yh"]);
    for (const e of entries.filter(e => e.category === "day_pillar")) { expect(e.editorial).toBeNull(); expect(e.deferred.length).toBeGreaterThan(0); }
    expect(entries.find(e => e.key === "munchang")?.deferred.join(" ")).toContain("전사 오자");
    for (const key of ["wangshen", "ciguan", "mediation"]) expect(entries.find(e => e.key === key)?.support.calculation).toBe("knowledge_only");
  });
  it("has no runtime import, export, dynamic load or lookup connection to the new DB", () => {
    const consumers = sourceFiles(resolve("src")).filter(path => !path.split("/").at(-1)?.startsWith("sajuFoundation"));
    for (const path of consumers) expect(readFileSync(path, "utf8"), path).not.toMatch(/sajuFoundation(Knowledge|Sources)|SAJU_FOUNDATION_(KNOWLEDGE|SOURCES)/);
  });
});
