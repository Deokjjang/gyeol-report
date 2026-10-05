import "server-only";
import { createHash } from "node:crypto";
import { isRecord } from "../report-generation/productPublishGate";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { COMPATIBILITY_ROLE_VERSION, JOB_STATUSES, RELATIONSHIP_STATUSES, compatibilityRoleLabels } from "../report-generation/reportInputTypes";
import type { ReportGenerationInput } from "../report-generation/reportInputAdapter";
import type { SajuCalcResult } from "../saju/types";
import { buildCanonicalManseRyeokTableData, withConsistentNatalMarkers } from "../report-tables/manseRyeokTableData";
import type { MbtiCommonProfileTableData, MbtiPreferenceAxisOption } from "../report-tables/types";
import type { CanonicalNatalTableEvidence } from "../report-knowledge/natalTableEvidence";
import type { NarrativeSection } from "./narrativeTypes";
import type { composeComprehensiveNarrative } from "./comprehensiveComposer";
import type { composeCareerNarrative } from "./careerComposer";
import type { composeLoveNarrative } from "./loveComposer";
import type { composeCompatibilityNarrative } from "./compatibilityComposer";
import type { composeMajorFortuneNarrative } from "./majorComposer";
import type { composeAnnualFortuneNarrative } from "./annualComposer";
import { buildCompatibilityIndex } from "./compatibilityIndex";
import type { V4CustomerReport, V4CustomerSection, V4CustomerTables, V4ShadowView } from "./runtimeTypes";

type Success<T> = Extract<Awaited<T>, { ok: true }>;
export type V4Composition =
  | { product: "saju_mbti_full"; result: Success<ReturnType<typeof composeComprehensiveNarrative>> }
  | { product: "career_money_study"; result: Success<ReturnType<typeof composeCareerNarrative>> }
  | { product: "love_marriage_child"; result: Success<ReturnType<typeof composeLoveNarrative>> }
  | { product: "saju_mbti_compatibility"; result: Success<ReturnType<typeof composeCompatibilityNarrative>> }
  | { product: "major_fortune"; result: Success<ReturnType<typeof composeMajorFortuneNarrative>> }
  | { product: "annual_fortune"; result: Success<ReturnType<typeof composeAnnualFortuneNarrative>> };
export type V4RuntimeEvidence = {
  readonly version: "v4-runtime-evidence-1";
  readonly mode: "shadow";
  readonly productType: V4Composition["product"];
  readonly generatedAt: string;
  readonly input: ReportGenerationInput;
  readonly composition: V4Composition;
  readonly calculations: Readonly<Record<string, SajuCalcResult>>;
  readonly natalTableEvidence: Readonly<Record<string, CanonicalNatalTableEvidence>>;
  readonly mbtiTables: Readonly<Record<string, MbtiCommonProfileTableData | null>>;
  /** Corruption/completeness seal, NOT a client authorization/signature. */
  readonly contentDigest: string;
};

// Postgres JSONB may reorder object keys. Do not hash JSON.stringify directly.
export function stableV4Json(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableV4Json).join(",")}]`;
  if (isRecord(v)) return `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${stableV4Json(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
export const v4Digest = (v: unknown) => createHash("sha256").update(stableV4Json(v)).digest("hex");
const section = (s: NarrativeSection): V4CustomerSection => ({ title: s.title, paragraphs: s.blocks.map(b => b.text) });

/** Allowlist only. No spread of composer objects into a customer projection. */
export function projectV4Composition(c: V4Composition): V4CustomerReport {
  const n = c.result.narrative;
  const common: V4CustomerReport = { version: "v4-runtime-shadow-1", reportVersion: "v4", productVersion: "v4", productType: c.product,
    headline: n.headline, opening: n.opening.map(b => b.text), sections: n.sections.map(section), finalLine: n.finalLine };
  if (c.product === "love_marriage_child") return { ...common, relationshipStatus: c.result.narrative.relationshipStatus };
  if (c.product === "saju_mbti_compatibility") {
    const r = c.result;
    return { ...common, compatibility: { category: r.narrative.category,
      personA: { name: r.persons.personA.name, role: r.evidence.roles.personA }, personB: { name: r.persons.personB.name, role: r.evidence.roles.personB },
      aToB: section(n.sections.find(s => s.id === "direction-ab")!), bToA: section(n.sections.find(s => s.id === "direction-ba")!) } };
  }
  if (c.product === "major_fortune") return { ...common, major: { currentYear: c.result.evidence.currentYear,
    years: c.result.years.map(y => ({ year: y.year, age: y.age, cycle: y.cycle.ganji, annual: y.annual.ganji, theme: y.protagonist,
      goodTheme: y.goodTheme, cautionTheme: y.cautionTheme, content: section(n.sections.find(s => s.id === `year-${y.year}`)!) })),
    transitions: c.result.transitions.map(t => section(n.sections.find(s => s.id === `transition-${t.year}`)!)) } };
  if (c.product === "annual_fortune") return { ...common, annual: { selectedYear: c.result.evidence.selectedYear,
    months: c.result.months.map(m => ({ month: m.month, theme: m.strongestTheme, time: m.time, content: section(n.sections.find(s => s.id === `month-${m.month}`)!) })) } };
  return common;
}

const textOK = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0 && !/^(?:undefined|null|\[truncated\])$/.test(s.trim());
const instantOK = (s: string) => /T.*(?:Z|[+-]\d\d:\d\d)$/.test(s) && Number.isFinite(Date.parse(s));
const same = (a: unknown, b: unknown) => stableV4Json(a) === stableV4Json(b);

/** Frozen snapshot validation only: no composer/calendar invocation or ambient clock. */
export function validateV4Publication(product: string, draft: unknown, evidence: unknown): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  try {
    if (!isRecord(evidence) || evidence.version !== "v4-runtime-evidence-1" || evidence.mode !== "shadow" || !isRecord(evidence.composition)) return { ok: false, errors: ["V4_EVIDENCE_REQUIRED"] };
    const e = evidence as unknown as V4RuntimeEvidence, c = e.composition, n = c.result.narrative;
    if (e.productType !== product || c.product !== product || e.input.productKey !== product || c.result.ok !== true) errors.push("V4_PRODUCT_MISMATCH");
    if (!instantOK(e.generatedAt)) errors.push("V4_CLOCK_REQUIRED");
    const expected = projectV4Composition(c);
    // Exact schema equality also rejects *any* extra proof/debug field, nested or top-level.
    if (!same(draft, expected)) errors.push("V4_CUSTOMER_PROJECTION_MISMATCH");
    const { contentDigest, ...sealed } = e;
    if (v4Digest(sealed) !== contentDigest) errors.push("V4_SNAPSHOT_INTEGRITY");
    if (!textOK(n.headline) || !textOK(n.finalLine) || !n.opening.length || n.sections.length < 5 ||
      [...n.opening, ...n.sections.flatMap(s => s.blocks)].some(b => !textOK(b.text)) || n.sections.some(s => !textOK(s.title) || !s.blocks.length)) errors.push("V4_CONTENT_INCOMPLETE");
    if (new Set(n.sections.map(s => s.id)).size !== n.sections.length) errors.push("V4_SECTION_ORDER_INVALID");
    const prose = [n.headline, ...n.opening.map(b => b.text), ...n.sections.flatMap(s => [s.title, ...s.blocks.map(b => b.text)]), n.finalLine].join("\n");
    if (/sourceRefs|evidenceIds|confidence|seedIds|fusionIds|normalizedContext|v4_structure:|calendarMonths:|\[object Object\]|\bTODO\b|\bPLACEHOLDER\b/.test(prose)) errors.push("V4_INTERNAL_TEXT_LEAK");
    if (c.result.editorial.some(i => i.severity === "Blocker" || i.severity === "Major")) errors.push("V4_EDITORIAL_BLOCKED");
    const ids = new Set(n.sections.map(s => s.id));
    const requireSections = (...required: string[]) => { if (required.some(id => !ids.has(id))) errors.push("V4_DOMAIN_CONTENT_INCOMPLETE"); };
    if (e.input.kind !== "compatibility") {
      if (!JOB_STATUSES.includes(e.input.userContext.jobStatus) || !RELATIONSHIP_STATUSES.includes(e.input.userContext.relationshipStatus) || typeof e.input.userContext.detailJob !== "string") errors.push("V4_CONTEXT_INVALID");
    }
    if (c.product === "career_money_study") requireSections("current", "money", "roles", "study", "direction");
    if (c.product === "love_marriage_child") {
      requireSections("current", "home", "parenting", "direction", "fortune");
      if (e.input.kind !== "loveMarriageChild" || c.result.narrative.relationshipStatus !== e.input.userContext.relationshipStatus) errors.push("V4_LOVE_STATE_MISMATCH");
      const status = c.result.narrative.relationshipStatus;
      if (status === "single" && /현재 배우자|당신의 배우자|지금 사귀는/.test(prose) || status === "married" && /솔로 탈출|아직 연인이 없는/.test(prose)) errors.push("V4_LOVE_STATE_UNSAFE");
    }
    if (c.product === "saju_mbti_compatibility") {
      const r = c.result, v = r.evidence;
      requireSections("direction-ab", "direction-ba", "fortune", "friction", "repair");
      if (e.input.kind !== "compatibility" || v.category !== e.input.relationshipType || v.roleVersion !== COMPATIBILITY_ROLE_VERSION || r.narrative.category !== v.category || !same(v.roles, compatibilityRoleLabels(v.category))) errors.push("V4_PAIR_ROLE_INVALID");
      if (!v.persons.personA.personId || !v.persons.personB.personId ||
        v.directions.aToB.subjectPerson !== v.persons.personA.personId || v.directions.aToB.targetPerson !== v.persons.personB.personId ||
        v.directions.bToA.subjectPerson !== v.persons.personB.personId || v.directions.bToA.targetPerson !== v.persons.personA.personId) errors.push("V4_PAIR_DIRECTION_INVALID");
      if (/\d+\s*(?:점|%|퍼센트)|[★☆]|[SABC][+-]?\s*등급|"(?:score|rating|percent)"\s*:/i.test(JSON.stringify(expected))) errors.push("V4_PAIR_NUMERIC_FORBIDDEN");
      // Phase13B's optional structured entertainment index is computed, never
      // writer prose. Old sealed packets without it continue to validate.
      if (r.compatibilityIndex && !same(r.compatibilityIndex, buildCompatibilityIndex(v))) errors.push("V4_PAIR_INDEX_INVALID");
    }
    if (c.product === "major_fortune") {
      const r = c.result, v = r.evidence;
      requireSections("final", ...v.horizon.rows.map(y => `year-${y.year}`), ...v.horizon.transitions.map(t => `transition-${t.year}`));
      if (r.years.length !== 14 || v.horizon.rows.length !== 14 || r.years.filter(y => y.timePosition === "future").length !== 10 ||
        r.years.some((y, i) => y.year !== v.currentYear - 3 + i || !Number.isInteger(y.age) || y.age !== v.years[i].age ||
          !same(y.annual, v.years[i].annual) || !same(y.cycle, v.horizon.rows[i].cycle) || y.blocks.length < 3 || !same(y.blocks, n.sections.find(s => s.id === `year-${y.year}`)?.blocks)) ||
        r.transitions.length !== v.horizon.transitions.length || r.transitions.some((t, i) => t.startSolarKst !== v.horizon.transitions[i].startSolarKst || !same(t.blocks, n.sections.find(s => s.id === `transition-${t.year}`)?.blocks)) ||
        Date.parse(v.evaluatedAt) !== Date.parse(e.generatedAt)) errors.push("V4_MAJOR_INCOMPLETE");
    }
    if (c.product === "annual_fortune") {
      const r = c.result, v = r.evidence;
      requireSections("dayun-cross", "fortune", "final", ...Array.from({ length: 12 }, (_, i) => `month-${i + 1}`));
      if (r.months.length !== 12 || v.raw.calendarMonths?.length !== 12 || !v.crossPeriods.length ||
        e.input.kind !== "annualFortune" || v.selectedYear !== Number(e.input.productOptions.selectedYear) ||
        v.raw.monthlyCalculationVersion !== "annual-month-jie-kst-v2" || Date.parse(v.clock.currentDate) !== Date.parse(e.generatedAt) ||
        r.months.some((m, i) => m.month !== i + 1 || m.blocks.length < 3 || !m.provenance.length || !same(m.focus, v.months[i].focus) || !same(m.blocks, n.sections.find(s => s.id === `month-${m.month}`)?.blocks)) ||
        !v.segments.length || v.segments.some((s, i) => !(Date.parse(s.startKst) < Date.parse(s.endKstExclusive)) || i > 0 && v.segments[i - 1].endKstExclusive !== s.startKst)) errors.push("V4_ANNUAL_INCOMPLETE");
    }
    const slots = e.input.kind === "compatibility" ? ["personA", "personB"] : ["person"];
    for (const slot of slots) {
      const calc = e.calculations[slot], table = e.natalTableEvidence[slot];
      if (!calc?.birthTimeContext || !table || table.precision !== calc.birthTimeContext.birthTimePrecision ||
        table.pillars.some(p => { const actual = calc.pillars[p.columnId]; return !actual || p.pillar !== actual.stem + actual.branch; })) errors.push("V4_TABLE_CONTRACT_INVALID");
      const person = e.input.kind === "compatibility" ? e.input[slot as "personA" | "personB"] : e.input.person;
      if (person.mbtiType ? e.mbtiTables[slot]?.type !== person.mbtiType : e.mbtiTables[slot] !== null) errors.push("V4_MBTI_TABLE_INVALID");
    }
  } catch { errors.push("V4_PACKET_INVALID"); }
  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

const mbtiOption = (v: MbtiPreferenceAxisOption): MbtiPreferenceAxisOption => ({ code: v.code, nameKo: v.nameKo, nameEn: v.nameEn, description: v.description, selected: v.selected });
function publicMbti(p: MbtiCommonProfileTableData): MbtiCommonProfileTableData {
  return { type: p.type, titleKo: p.titleKo, archetype: p.archetype, oneLine: p.oneLine,
    preferenceRows: p.preferenceRows.map(r => ({ axisKey: r.axisKey, label: r.label, selectedCode: r.selectedCode, left: mbtiOption(r.left), right: mbtiOption(r.right) })),
    functionRows: p.functionRows.map(r => ({ code: r.code, nameKo: r.nameKo, attitude: r.attitude, domain: r.domain, description: r.description, position: r.position, label: r.label, reportUsageNote: "" })),
    coreSummary: p.coreSummary.map(r => ({ key: r.key, label: r.label, text: r.text })), closeKeywords: [...p.closeKeywords], farKeywords: [...p.farKeywords], reportUsageNotes: [] };
}
/** Tables use frozen canonical natal/MBTI data, never prose or a live DB read. */
export function projectV4Tables(e: V4RuntimeEvidence): V4CustomerTables {
  const people = e.input.kind === "compatibility" ? [["personA", e.input.personA], ["personB", e.input.personB]] as const : [["person", e.input.person]] as const;
  return people.map(([slot, person]) => {
    const data = withConsistentNatalMarkers(buildCanonicalManseRyeokTableData(e, person.name, slot)!);
    const profile = e.mbtiTables[slot];
    // Explicit public table contract; natalEvidence/reportUseCases remain internal.
    return { name: person.name, manse: { title: data.title, columns: data.columns, stemRow: data.stemRow, branchRow: data.branchRow,
      fiveElementDistribution: data.fiveElementDistribution, detailRows: data.detailRows },
      mbti: profile ? publicMbti(profile) : null,
      elements: ([["WOOD", "목"], ["FIRE", "화"], ["EARTH", "토"], ["METAL", "금"], ["WATER", "수"]] as const).map(([element, label]) =>
        ({ label, visible: e.calculations[slot].elements.visible[element], weighted: e.calculations[slot].elements.weighted[element],
          state: !e.calculations[slot].pillars.hour ? "부분 확인" as const : e.calculations[slot].elements.labels.includes(`${element}_STRONG`) ? "강함" as const :
            e.calculations[slot].elements.labels.some(v => v === `${element}_WEAK` || v === `${element}_MISSING`) ? "약함" as const : "균형" as const })) };
  });
}

export function projectV4Snapshot(snapshot: unknown): V4ShadowView | null {
  if (!isProductPreviewSnapshot(snapshot) || snapshot.productVersion !== "v4" || !textOK(snapshot.createdAtIso) || !textOK(snapshot.productSlug) ||
    !validateV4Publication(String(snapshot.productType), snapshot.draft, snapshot.evidencePacket).ok) return null;
  const e = snapshot.evidencePacket as V4RuntimeEvidence;
  return { createdAtIso: snapshot.createdAtIso, productSlug: snapshot.productSlug, report: projectV4Composition(e.composition), tables: projectV4Tables(e) };
}
