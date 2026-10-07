import { createHash } from "node:crypto";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { MBTI_TYPES, type MbtiType } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";
import * as sourceAdapter from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { BIPOLAR_AXES, SEMANTIC_AXES } from "../../../src/lib/interpretation-v4/semanticCore";
import { MBTI_DIMENSION_PRIORS, buildMbtiDimensionPriors, parseSemanticMbtiType } from "../../../src/lib/interpretation-v4/mbtiDimensionPriors";
import { GENERAL_MBTI_DOMAINS, MBTI_DOMAIN_CONTEXTS, MBTI_WEIGHT_CLASSES, type MbtiSemanticAnnotation, type SemanticAxis } from "../../../src/lib/interpretation-v4/mbtiSemanticCore";
import { annotateMbtiSource, MBTI_SOURCE_ANNOTATIONS, validateMbtiAnnotations } from "../../../src/lib/interpretation-v4/mbtiSemanticAnnotations";
import { inventoryMbtiSource, readMbtiSemanticSource } from "../../../src/lib/interpretation-v4/mbtiSourceAdapter";
import { aggregateMbtiContributions, buildMbtiSemanticProfile, projectMbtiSemanticProfile, type MbtiProfileResult } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { buildMbtiSemanticDebugView } from "../../../src/lib/interpretation-v4/mbtiSemanticDiagnostics";

const source = (type: MbtiType) => JSON.parse(readFileSync(`docs/product/mbti/source/${type}.json`, "utf8").replace(/^\uFEFF/, ""));
const good = (r: MbtiProfileResult) => { expect(r.ok, !r.ok ? JSON.stringify(r.diagnostics.hardErrors) : "").toBe(true); if (!r.ok) return expect.unreachable(); return r.value; };
const errors = (r: MbtiProfileResult) => { expect(r.ok).toBe(false); return r.ok ? [] : r.diagnostics.hardErrors.map(e => e.code); };
const snapshots = {
  ENFJ: "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8", ENFP: "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
  ENTJ: "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e", ENTP: "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
  ESFJ: "40e80ffb692c97690487293c0d59b87715fa6ab25ce6978ec3eefc890525bcf8", ESFP: "b22468fccc71563e5d256aa160d778fa3c61f582e1ead73caea369402a0f1248",
  ESTJ: "8187be30ddd97adf87c1afedf15f179da1a25aa871dfa0ad9a6aadf6d4a25fc6", ESTP: "cbad165b46fa8b9af38e16c47a76a1113255ac3041ccdd765cc2a035834807ec",
  INFJ: "394227f31f485014d3f8be75060d1f03b3b3afa13cd464c9b1716624bf3f6500", INFP: "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
  INTJ: "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83", INTP: "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
  ISFJ: "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2", ISFP: "c29503d26796af4c3dbc8c9298f4bf8d0636570e63c0494169bcf95d722d38d8",
  ISTJ: "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a", ISTP: "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
};
const cases = MBTI_TYPES.map(type => ({ type }));

describe("13D-2A exact weak priors and canonical axes", () => {
  it("all eight priors preserve the specified mappings, not inferred functions or stereotypes", () => {
    expect(MBTI_DIMENSION_PRIORS).toEqual({
      E: { ENERGY_DIRECTION: 2, RELATION_STYLE: 2, EXPRESSION: 1, SOCIAL_ATTUNEMENT: 1, INITIATIVE: 1 },
      I: { ENERGY_DIRECTION: -2, RELATION_STYLE: -1, DEPTH: 1, RECOVERY_NEED: 2 },
      S: { PRACTICALITY: 2, PRECISION: 1, STABILITY: 1, RESOURCE_SENSE: 1 },
      N: { PATTERN_SENSE: 2, CURIOSITY: 1, EXPANSION: 1, MEANING: 1, STRATEGY: 1 },
      T: { DECISION_STYLE: 1, COMMUNICATION_STYLE: 1, PRECISION: 1, BOUNDARY: 1, PRACTICALITY: 1 },
      F: { RELATION_STYLE: 1, SOCIAL_ATTUNEMENT: 2, CARE: 2, MEANING: 1 },
      J: { STRUCTURE_STYLE: 2, DECISION_STYLE: 2, DUTY: 1, GOAL_DRIVE: 1, STABILITY: 1 },
      P: { STRUCTURE_STYLE: -2, CHANGE_ORIENTATION: 2, ADAPTABILITY: 2, CURIOSITY: 1 },
    });
    expect(MBTI_WEIGHT_CLASSES).toEqual({ DIMENSION_PRIOR: 0.5, GENERAL_TRAIT: 1, SPECIFIC_TRAIT: 1.5, DIRECT_BEHAVIOR: 2, DOMAIN_SPECIFIC: 1.5, REFERENCE_ONLY: 0 });
    expect(SEMANTIC_AXES).toHaveLength(36);
  });
  it.each(cases)("$type parses only canonical letters and applies prior weight exactly once", ({ type }) => {
    expect(parseSemanticMbtiType(type.toLowerCase())).toEqual({ ok: true, type });
    const p = good(buildMbtiSemanticProfile(type));
    expect(buildMbtiDimensionPriors(type)).toHaveLength(4);
    for (const c of p.contributions.filter(c => c.sourceType === "dimension_prior")) {
      expect(c.effectiveValue).toBe(c.rawValue * 0.5);
      expect(c.sourceNodeId).toContain(":prior:");
    }
  });
  it.each([undefined, null, "unknown", "UNKNOWN"])("%s is absent, no guess or source IO", input => {
    const read = vi.spyOn(sourceAdapter, "getMbtiSourceProfile");
    const p = good(buildMbtiSemanticProfile(input));
    expect(read).not.toHaveBeenCalled(); read.mockRestore();
    expect(p).toMatchObject({ available: false, mbtiType: null, generalAxes: {}, contextAxes: {}, dimensionPriors: [], annotations: [], contributions: [] });
    expect(p.diagnostics.warnings.map(w => w.code)).toContain("MBTI_UNAVAILABLE");
  });
  it.each(["", " ", "ABCD", "ENTX", "ENTJJ", 42, {}, []])("invalid %j fails explicitly", input => {
    expect(errors(buildMbtiSemanticProfile(input))).toContain("INVALID_MBTI_TYPE");
  });
});

describe("16 read-only sources, all semantic leaves classified", () => {
  it.each(cases)("$type: hash, coverage, stable references and all domains", ({ type }) => {
    const bytes = readFileSync(`docs/product/mbti/source/${type}.json`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(snapshots[type]);
    const raw = source(type), before = structuredClone(raw), inventory = inventoryMbtiSource(type, raw), p = good(projectMbtiSemanticProfile(type, raw));
    expect(raw).toEqual(before);
    expect(p.sourceMetadata).toEqual({ sourceStatus: raw.sourceStatus, enrichment: raw.enrichment });
    expect(new Set(p.sourceNodes.map(n => n.id)).size).toBe(p.sourceNodes.length);
    expect(p.sourceNodes).toHaveLength(inventory.nodes.length);
    expect(p.diagnostics.coverage.classifiedPercentage).toBe(100);
    expect(p.diagnostics.coverage.unclassifiedNodes).toBe(0);
    expect(p.diagnostics.hardErrors).toEqual([]);
    for (const domain of Object.keys(MBTI_DOMAIN_CONTEXTS)) expect(p.diagnostics.domainCoverage[domain as keyof typeof MBTI_DOMAIN_CONTEXTS].totalSemanticNodes).toBeGreaterThan(0);
    const plainKo = p.sourceNodes.filter(n => n.stablePath.endsWith(":plainKo"));
    expect(plainKo).toHaveLength(Object.keys(MBTI_SOURCE_ANNOTATIONS[type]).length);
    expect(plainKo.filter(n => n.classification === "SCORING_SEMANTIC").length).toBeGreaterThan(0);
    expect(p.annotations.every(a => p.sourceNodes.some(n => n.id === a.sourceNodeId))).toBe(true);
    for (const n of p.sourceNodes) {
      let resolved: unknown = raw;
      for (const key of n.sourcePath.slice(1).split("/").map(s => s.replace(/~1/g, "/").replace(/~0/g, "~"))) resolved = (resolved as Record<string, unknown>)[key];
      expect(n.value).toEqual(resolved);
    }
    expect(JSON.parse(JSON.stringify(p))).toEqual(p);
  });
  it("missing file and parse errors are explicit, no prior-only fallback", () => {
    const read = vi.spyOn(sourceAdapter, "getMbtiSourceProfile");
    try {
      read.mockReturnValue(null);
      expect(readMbtiSemanticSource("ENTJ")).toEqual({ ok: false, error: "MBTI_SOURCE_MISSING" });
      expect(errors(buildMbtiSemanticProfile("ENTJ"))).toContain("MBTI_SOURCE_MISSING");
      read.mockImplementation(() => { throw new SyntaxError("local invalid JSON"); });
      expect(errors(buildMbtiSemanticProfile("ENTJ"))).toContain("MBTI_SOURCE_PARSE_FAILED");
      read.mockImplementation(() => { throw new Error("local read failure"); });
      expect(errors(buildMbtiSemanticProfile("ENTJ"))).toContain("MBTI_SOURCE_READ_FAILED");
    } finally { read.mockRestore(); }
  });
  it("new prose, missing ID and duplicate IDs cannot silently disappear", () => {
    const raw = source("ENTJ"); raw.traits.identity.push({ ...raw.traits.identity[0], id: "new_unreviewed_trait" });
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("UNCLASSIFIED_SEMANTIC_NODE");
    raw.traits.identity.pop(); raw.unknownProseField = "unreviewed content";
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("UNCLASSIFIED_SEMANTIC_NODE"); delete raw.unknownProseField;
    raw.traits.identity.push({ ...raw.traits.identity[0] });
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("DUPLICATE_SOURCE_NODE_ID"); raw.traits.identity.pop();
    raw.traits.identity.shift();
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("ANNOTATION_SOURCE_MISSING");
    expect(errors(projectMbtiSemanticProfile("ENTJ", source("INTJ")))).toContain("INVALID_MBTI_SOURCE");
  });
  it("null or blank primary prose cannot keep a scored annotation", () => {
    const raw = source("ENTJ"); raw.traits.identity[0].plainKo = null;
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("NON_TEXT_SEMANTIC_NODE");
    raw.traits.identity[0].plainKo = " ";
    expect(errors(projectMbtiSemanticProfile("ENTJ", raw))).toContain("NON_TEXT_SEMANTIC_NODE");
  });
  it("emits review-only coverage and JSON debug artifacts when explicitly requested", () => {
    if (process.env.MBTI_SEMANTIC_REVIEW_EXPORT !== "1") return;
    const profiles = MBTI_TYPES.map(t => good(buildMbtiSemanticProfile(t)));
    const directory = "/tmp/gyeol-13d2a-semantic-review";
    mkdirSync(directory, { recursive: true });
    writeFileSync(`${directory}/coverage.json`, JSON.stringify(profiles.map(p => ({
      ...p.diagnostics.coverage, version: p.version,
      generalSourceNodeCount: new Set(p.contributions.filter(c => c.sourceType === "source_trait").map(c => c.sourceNodeId)).size,
      contextSourceNodeCount: new Set(p.contributions.filter(c => c.sourceType === "domain_trait").map(c => c.sourceNodeId)).size,
      hardErrorCount: p.diagnostics.hardErrors.length, warningCodes: p.diagnostics.warnings.map(w => w.code),
    })), null, 2));
    for (const p of profiles) writeFileSync(`${directory}/${p.mbtiType}.json`, JSON.stringify(buildMbtiSemanticDebugView(p), null, 2));
  });
});

describe("general/context ledger, evidence diversity and opposite signs", () => {
  it.each(cases)("$type: no domain flooding, no sign erasure, no hidden multiplier", ({ type }) => {
    const p = good(buildMbtiSemanticProfile(type));
    const prior = p.contributions.filter(c => c.sourceType === "dimension_prior");
    const general = p.contributions.filter(c => c.sourceType !== "dimension_prior" && GENERAL_MBTI_DOMAINS.includes(c.sourceDomain));
    expect(p.priorAxes).toEqual(aggregateMbtiContributions(prior).axes);
    expect(p.sourceAxes).toEqual(aggregateMbtiContributions(general).axes);
    expect(p.generalAxes).toEqual(aggregateMbtiContributions([...prior, ...general]).axes);
    expect(general.length).toBeGreaterThan(0);
    for (const c of p.contributions) {
      expect(SEMANTIC_AXES).toContain(c.axis); expect(c.effectiveValue).toBe(c.rawValue * MBTI_WEIGHT_CLASSES[c.weightClass]);
      if (!(BIPOLAR_AXES as readonly string[]).includes(c.axis)) expect(c.rawValue).toBeGreaterThan(0);
      if (c.sourceType !== "dimension_prior") expect(c.sourcePath).toMatch(/^\/traits\//);
      if (c.sourceType === "domain_trait") expect(c.weightClass).toBe("DOMAIN_SPECIFIC");
    }
    for (const [context, axes] of Object.entries(p.contextAxes)) {
      const rows = p.contributions.filter(c => c.sourceType !== "dimension_prior" && (c.contexts as string[]).includes(context));
      expect(axes).toEqual(aggregateMbtiContributions(rows).axes);
    }
    for (const axis of SEMANTIC_AXES) {
      const s = p.generalSupport[axis]!;
      expect(s.net).toBe(s.positiveMagnitude - s.negativeMagnitude);
      expect(s.sourceDomainDiversity).toBe(new Set(general.filter(c => c.axis === axis).map(c => c.sourceDomain)).size);
    }
    // Multiply only an already-reviewed work annotation; personality must not change.
    const modified = structuredClone(p.annotations);
    const work = modified.find(a => a.sourceDomain === "WORK" && a.sourceType === "domain_trait")!;
    const axis = Object.keys(work.axes)[0] as SemanticAxis; work.axes[axis] = work.axes[axis] === 2 ? 1 : 2;
    const next = good(projectMbtiSemanticProfile(type, source(type), modified));
    expect(next.generalAxes).toEqual(p.generalAxes); expect(next.contextAxes.work).not.toEqual(p.contextAxes.work);
  });
  it("both directions survive inside a type; no tension interpretation created", () => {
    const p = good(buildMbtiSemanticProfile("ESFP"));
    expect(p.generalSupport.COMMUNICATION_STYLE!.positiveMagnitude).toBeGreaterThan(0);
    expect(p.generalSupport.COMMUNICATION_STYLE!.negativeMagnitude).toBeGreaterThan(0);
    expect(p).not.toHaveProperty("tensions"); expect(p).not.toHaveProperty("fusion");
  });
  it("16 actual-source profiles differ without prescribing stereotypical top axes", () => {
    const profiles = MBTI_TYPES.map(t => good(buildMbtiSemanticProfile(t)));
    expect(new Set(profiles.map(p => JSON.stringify(p.sourceAxes))).size).toBe(16);
    expect(profiles.every(p => p.contributions.some(c => c.sourceType === "source_trait"))).toBe(true);
  });
});

describe("reference isolation and explicit no-inference contract", () => {
  it.each(cases)("$type: recommendations, pair and bridge removal changes no score", ({ type }) => {
    const raw = source(type), p = good(projectMbtiSemanticProfile(type, raw));
    delete raw.recommendedJobs; delete raw.avoidJobsOrEnvironments; delete raw.relationshipHints; delete raw.notablePairs; delete raw.myeongliBridgeHints;
    for (const rows of Object.values(raw.traits) as Array<Array<Record<string, unknown>>>) for (const row of rows) delete row.matchingMyeongliSignals;
    const stripped = good(projectMbtiSemanticProfile(type, raw));
    expect(stripped.generalAxes).toEqual(p.generalAxes); expect(stripped.contextAxes).toEqual(p.contextAxes);
    expect(stripped.contributions).toEqual(p.contributions);
    expect(p.annotations.filter(a => a.sourceType === "reference_only").every(a => !Object.keys(a.axes).length && a.weightClass === "REFERENCE_ONLY")).toBe(true);
    expect(p.contributions.some(c => ["MYEONGLI_BRIDGE_HINT", "RELATIONSHIP_PAIR", "RECOMMENDED_JOBS", "AVOID_JOBS_OR_ENVIRONMENTS"].includes(c.sourceDomain))).toBe(false);
  });
  it("source text is not a runtime keyword classifier; all scores use explicit stable IDs", () => {
    const raw = source("INTP"), before = good(projectMbtiSemanticProfile("INTP", raw));
    for (const rows of Object.values(raw.traits) as Array<Array<Record<string, unknown>>>) for (const row of rows) row.plainKo = "leader leader 사주 리더십 목표 효율 통솔 재성 편관";
    const after = good(projectMbtiSemanticProfile("INTP", raw));
    expect(after.generalAxes).toEqual(before.generalAxes); expect(after.contextAxes).toEqual(before.contextAxes);
  });
  it("pure advice is reference only, inferred source coverage is preserved", () => {
    const p = good(buildMbtiSemanticProfile("INTJ"));
    const growth = p.sourceNodes.filter(n => n.stablePath.startsWith("traits:growth:") && n.stablePath.endsWith(":plainKo"));
    expect(growth.length).toBeGreaterThan(0); expect(growth.every(n => n.classification === "REFERENCE_ONLY" && n.reason === "PURE_ADVICE_NOT_CURRENT_TRAIT")).toBe(true);
    const money = p.contributions.filter(c => c.sourceDomain === "MONEY");
    expect(money.length).toBeGreaterThan(0); expect(money.every(c => typeof c.sourceCoverage === "string")).toBe(true);
  });
  it.each(cases)("$type: deterministic ordering and JSON-safe debug output", ({ type }) => {
    const raw = source(type), p = good(projectMbtiSemanticProfile(type, raw));
    function reverseKeys(v: unknown): unknown {
      if (Array.isArray(v)) return v.map(reverseKeys);
      if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, reverseKeys(x)]));
      return v;
    }
    expect(good(projectMbtiSemanticProfile(type, reverseKeys(raw)))).toEqual(p);
    const debug = buildMbtiSemanticDebugView(p);
    expect(JSON.parse(JSON.stringify(debug))).toEqual(debug);
    expect(buildMbtiSemanticDebugView(good(buildMbtiSemanticProfile(type)))).toEqual(debug);
  });
});

describe("adversarial annotation validation", () => {
  const validate = (change: (a: MbtiSemanticAnnotation[], nodes: ReturnType<typeof annotateMbtiSource>["nodes"]) => void) => {
    const r = annotateMbtiSource("ENTJ", inventoryMbtiSource("ENTJ", source("ENTJ")).nodes);
    change(r.annotations, r.nodes); return validateMbtiAnnotations("ENTJ", r.nodes, r.annotations).map(e => e.code);
  };
  const scoring = (a: MbtiSemanticAnnotation[]) => a.find(x => x.sourceType === "source_trait")!;
  it("invalid axis, negative strength, magnitude and confidence fail", () => {
    expect(validate(a => { scoring(a).axes = { LOGIC: 2 } as never; })).toContain("INVALID_SEMANTIC_AXIS");
    expect(validate(a => { scoring(a).axes = { CARE: -1 }; })).toContain("NEGATIVE_STRENGTH_AXIS");
    expect(validate(a => { scoring(a).axes = { CARE: NaN }; })).toContain("INVALID_AXIS_MAGNITUDE");
    expect(validate(a => { scoring(a).annotationConfidence = "guessed" as never; })).toContain("INVALID_ANNOTATION_CONFIDENCE");
  });
  it("duplicate ID / same node-axis / wrong type, domain, context and weight fail", () => {
    expect(validate(a => a.push({ ...scoring(a) }))).toContain("DUPLICATE_ANNOTATION_ID");
    expect(validate(a => a.push({ ...scoring(a), id: "different-id-same-axis" }))).toContain("DUPLICATE_NODE_AXIS");
    expect(validate(a => { scoring(a).mbtiType = "INTJ"; })).toContain("ANNOTATION_TYPE_MISMATCH");
    expect(validate(a => { scoring(a).sourceDomain = "MONEY"; })).toContain("ANNOTATION_DOMAIN_MISMATCH");
    expect(validate(a => { scoring(a).contexts = ["money"]; })).toContain("INVALID_CONTEXT");
    expect(validate(a => { scoring(a).weightClass = "DOMAIN_SPECIFIC"; })).toContain("INVALID_DOMAIN_WEIGHT");
    expect(validate(a => { scoring(a).sourceNodeId = "missing"; })).toContain("ANNOTATION_SOURCE_MISSING");
  });
  it.each(["MYEONGLI_BRIDGE_HINT", "RELATIONSHIP_PAIR", "RECOMMENDED_JOBS", "AVOID_JOBS_OR_ENVIRONMENTS"])("%s cannot become personal scoring evidence", domain => {
    expect(validate(a => { const row = a.find(x => x.sourceDomain === domain)!; row.axes = { LEADERSHIP: 2 }; row.weightClass = "SPECIFIC_TRAIT"; row.sourceType = "source_trait"; })).toContain("REFERENCE_ONLY_SCORING");
  });
  it("metadata annotation and missing scoring annotation fail", () => {
    expect(validate((a, nodes) => { scoring(a).sourceNodeId = nodes.find(n => n.classification === "METADATA")!.id; })).toContain("NON_SCORING_NODE_ANNOTATION");
    expect(validate(a => { a.splice(a.indexOf(scoring(a)), 1); })).toContain("SCORING_NODE_WITHOUT_ANNOTATION");
  });
  it("new semantic modules are isolated from customer runtime and actual Myeongli/Fusion modules", () => {
    const directory = "src/lib/interpretation-v4";
    const own = readdirSync(directory).filter(f => /^mbti(?:Semantic|Annotations|DimensionPriors|SourceAdapter)/.test(f));
    const names = own.map(f => f.replace(/\.ts$/, ""));
    for (const file of own) {
      const text = readFileSync(`${directory}/${file}`, "utf8");
      expect(text).not.toMatch(/from ["']\.\/(?:foundation|fusion|.*Composer|runtime)/);
      expect(text).not.toMatch(/Math\.random|Date\.now|\.includes\(["'](?:리더|효율|직설)/);
    }
    function files(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [join(dir, entry.name)] : []);
    }
    const fusionBoundary = ["fusionCore.ts", "fusionProfileAdapter.ts", "fusionDiagnostics.ts", "fusionSemanticProfile.ts", "claimEvidence.ts", "claimDiagnostics.ts", "claimProfile.ts"];
    for (const file of files("src").filter(f => ![...own, ...fusionBoundary].some(name => f === `${directory}/${name}`))) {
      const text = readFileSync(file, "utf8");
      for (const name of names) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
  });
});
