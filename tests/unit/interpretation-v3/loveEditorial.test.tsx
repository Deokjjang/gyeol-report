import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/reports/create/route";
import ReportResultPage from "../../../src/app/reports/[reportId]/page";
import { LoveReportV3View } from "../../../src/app/reports/[reportId]/LoveReportV3View";
import { createLoveV3 as createCurrentLoveV3, validateLoveV3 } from "../../../src/lib/report-generation/loveV3Generation";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import { calculateLoveMarriageChildSaju } from "../../../src/lib/report-generation/loveMarriageChildGenerationHandler";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { buildLoveV3, isLoveV3Draft, LOVE_V3_VERSION, LOVE_V3_POLISH_VERSION, loveV3CustomerText } from "../../../src/lib/interpretation-v3/loveEditorial";
import { LOVE_VOICES, LOVE_STATUS_LABELS } from "../../../src/lib/interpretation-v3/loveEditorialContext";
import { storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { LOVE_V3_FIXTURES, loveFixture } from "./loveFixtures";

const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|ten_god_|day_pillar_|gwiin_|sinsal_|mbti:[A-Z]{4}:|loveEditorial:|love:portrait|relationshipStatus/;
const meta = /이번 리포트에서는|원국 근거를|읽었습니다|읽는 대목|예측하는 숫자|잘 쓰면 ·|(?:정관|겁재|식신|비견)은 .*입니다/;
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
// Pin Phase D's existing publication/SSR contract while new generation uses D2.
const createLoveV3 = (payload: unknown) => createCurrentLoveV3(payload, LOVE_V3_VERSION);
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.unstubAllEnvs(); });

it.each(LOVE_V3_FIXTURES)("%s canonical facts → publication → snapshot → SSR", (...row) => {
  const fixture = loveFixture(row), { id, payload } = fixture, r = createLoveV3(payload)!;
  expect(r).not.toBeNull();
  const { draft, evidencePacket } = r, { facts, calculation } = evidencePacket.loveV3;
  const scenes = draft.chapters.flatMap(c => c.scenes), text = loveV3CustomerText(draft), qa = draft.editorialAudit;
  expect(validateProductPublication("love_marriage_child", draft, evidencePacket, payload).errors).toEqual([]);
  expect(qa.errors).toEqual([]); expect(qa.rejected).toEqual([]); expect(qa.warnings).toEqual([]);
  expect(qa.audit.mix.character).toBeGreaterThan(0.64); expect(qa.audit.mix.advice).toBeLessThan(0.17);
  expect(scenes.filter(s => s.parts.every(p => p.role !== "advice")).length / scenes.length).toBeGreaterThan(0.7);
  expect(new Set(scenes.map(s => s.form)).size).toBe(5);
  const normalized = normalizeReportInputPayload(payload);
  expect(normalized.ok && normalized.value.kind === "loveMarriageChild" && calculateLoveMarriageChildSaju(normalized.value.person)).toEqual(calculation);
  for (const s of scenes) {
    const used = facts.filter(f => s.evidenceRefs.includes(f.id));
    expect(used).toHaveLength(s.evidenceRefs.length);
    expect(used.every(f => f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length)).toBe(true);
    const natal = used.filter(f => f.kind !== "mbti" && !["relation", "spouse_palace"].includes(f.kind));
    expect(natal.length).toBeGreaterThan(0);
    expect(natal.some(f => storySupport(f.featureId, facts, calculation).substantial), `${id}/${s.angle}`).toBe(true);
    for (const f of natal.filter(f => !(s.angle.endsWith("-supporting") && ["sinsal_dohwa", "sinsal_hongyeom"].includes(f.featureId)))) expect(storySupport(f.featureId, facts, calculation).substantial, `${id}/${s.angle}/${f.featureId}`).toBe(true);
  }
  for (const [feature, expected, angle, label] of [["sinsal_dohwa", fixture.dohwa, "dohwa-visible", "도화"], ["sinsal_hongyeom", fixture.hongyeom, "hongyeom-intimacy", "홍염"]] as const) {
    expect(facts.some(f => f.featureId === feature)).toBe(expected);
    expect(scenes.some(s => s.angle === angle || s.angle === angle.split("-")[0] + "-supporting")).toBe(expected); expect(text.includes(label)).toBe(expected);
    if (expected) expect(draft.chapters.find(c => c.id === "charm")?.collapsed).toBe(false);
  }
  expect(text).not.toMatch(internals); expect(text).not.toMatch(meta); expect(text).not.toMatch(/임신합니다|아들을|딸을|재회|이별 상태/);
  const ending = draft.chapters.at(-1)!.scenes[0]; expect(ending.parts).toHaveLength(5);
  expect(ending.parts.map(p => p.text).join(" ")).not.toMatch(/겁재|식신|편재|정재|정관|편관|정인|편인(?:의|은|을|과)|장성|반안|원국|기운|읽었/);
  const snapshot = createProductPreviewSnapshot({ reportId: `love-v3-${id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "love_marriage_child", productSlug: "love-marriage-child", draft, evidencePacket });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const html = renderToStaticMarkup(createElement(LoveReportV3View, r));
  expect(html).toContain(LOVE_V3_VERSION); expect(html).not.toContain("리포트를 준비하고 있습니다"); expect(html).not.toMatch(internals);
  expect(html.indexOf("data-love-input")).toBeGreaterThan(html.indexOf(draft.title));
  expect(html.indexOf("data-love-input")).toBeLessThan(html.indexOf("리포트 목차"));
  expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(html.indexOf("data-story-signals")).toBeLessThan(html.indexOf('id="love-portrait"')); expect(html).toContain("data-all-signals");
  const panel = html.slice(html.indexOf("data-love-input"), html.indexOf("</dl>"));
  expect(panel).toContain(LOVE_STATUS_LABELS[payload.userContext.relationshipStatus]); expect(panel).toContain(payload.person.mbtiType || "모름"); expect(panel).not.toContain(payload.person.birthDate);
  expect(draft.chapters.find(c => c.id === "parent")?.collapsed).toBe(!payload.userContext.focusAreas.includes("가족"));
  if (!payload.person.mbtiType) expect(scenes.some(s => s.evidenceRefs.some(ref => ref.includes(":mbti:")))).toBe(false);
  if (process.env.LOVE_D_REVIEW_OUTPUT === "1") { writeFileSync(`/tmp/gyeol-love-d-${id}.json`, JSON.stringify(r)); writeFileSync(`/tmp/gyeol-love-d-${id}.txt`, text); }
});

it("same chart across six canonical states changes scenes and conclusions, not calculation", () => {
  expect(RELATIONSHIP_STATUSES).toEqual(["", "single", "some", "dating", "marriage_preparing", "married"]);
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]), charts = new Set<string>(), current = new Set<string>(), final = new Set<string>();
  const words = [["편했던 대화"], ["첫 만남", "모임"], ["먼저 연락", "작은 제안"], ["싸운 뒤", "서운"], ["예산", "양가", "비용"], ["가사", "생활비", "양가"]];
  RELATIONSHIP_STATUSES.forEach((relationshipStatus, i) => {
    const r = createLoveV3({ ...payload, userContext: { ...payload.userContext, relationshipStatus } })!;
    expect(validateLoveV3(r.draft, r.evidencePacket)).toEqual([]); charts.add(hash(r.evidencePacket.loveV3.calculation));
    const t = r.draft.chapters.find(c => c.id === "present")!.scenes.flatMap(s => s.parts.map(p => p.text)).join(" ");
    words[i].forEach(w => expect(t).toContain(w)); current.add(t); final.add(r.draft.chapters.at(-1)!.scenes[0].parts[2].text);
  });
  expect(charts.size).toBe(1); expect(current.size).toBe(6); expect(final.size).toBe(6);
});

it("12 charts × 16 MBTI plus unknown retain exact trait fusion and publication", () => {
  const failures: unknown[] = [], archetypes = new Set<string>();
  for (const row of LOVE_V3_FIXTURES) {
    const { payload, id } = loveFixture(row), voices = new Set<string>(), charts = new Set<string>();
    for (const mbtiType of [...Object.keys(LOVE_VOICES), ""]) {
      const r = createLoveV3({ ...payload, person: { ...payload.person, mbtiType } })!, errors = validateLoveV3(r.draft, r.evidencePacket);
      if (errors.length) failures.push({ id, mbtiType, errors, rejected: r.draft.editorialAudit.rejected, warnings: r.draft.editorialAudit.warnings });
      const fusion = r.draft.chapters[0].scenes.find(s => s.angle === "mbti-fusion");
      if (mbtiType) { expect(fusion).toBeTruthy(); voices.add(fusion!.parts[0].text); } else expect(fusion).toBeUndefined();
      charts.add(hash(r.evidencePacket.loveV3.calculation)); archetypes.add(r.draft.archetype);
    }
    expect(voices.size).toBe(16); expect(charts.size).toBe(1);
  }
  expect(failures).toEqual([]); expect(archetypes.size).toBeGreaterThanOrEqual(6);
}, 30_000);

it("precision and charm behavior changes with MBTI, not just a chip", () => {
  const make = (index: number, mbtiType: string) => { const { payload } = loveFixture(LOVE_V3_FIXTURES[index]); return createLoveV3({ ...payload, person: { ...payload.person, mbtiType } })!; };
  expect(loveV3CustomerText(make(1, "ENTJ").draft)).toContain("이유와 해결책까지 빠르게");
  expect(loveV3CustomerText(make(1, "INFP").draft)).toContain("진심이나 가치관을 건드린 표현");
  expect(loveV3CustomerText(make(2, "ENFP").draft)).toContain("새 이야기거리가 이어집니다");
  expect(loveV3CustomerText(make(3, "INFJ").draft)).toContain("깊은 대화에서 세심한 질문");
});

it.each(LOVE_V3_FIXTURES)("%s local create → memory → full SSR with no provider", async (...row) => {
  vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("REPORT_PERSISTENCE_MODE", "preview_memory"); vi.stubEnv("OPENAI_REPORT_WRITER_ENABLED", "0");
  const { payload } = loveFixture(row);
  const response = await POST(new Request("http://localhost/api/reports/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
  const body = await response.json(); expect(response.status, JSON.stringify(body.diagnostic)).toBe(200); expect(body.diagnostic.externalCallCount).toBe(0);
  const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: body.reportId }) }));
  expect(html).toContain(LOVE_V3_POLISH_VERSION); expect(html).not.toMatch(internals);
});

it("explicit V3 bypasses enabled writers; original Love snapshot and full SSR remain readable", async () => {
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]);
  const result = await generateProductReport(payload, { enabled: true, config: { enabled: true, apiKey: "test-no-call", model: "test" } }, "normal_writer", undefined, { loveVersion: "v3" });
  expect(result.ok).toBe(true); expect(result.externalCalls).toEqual([]); if (result.ok) expect(isLoveV3Draft(result.draft)).toBe(true);
  const legacy = await generateProductReport({ ...payload, productOptions: {} }, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback"); expect(legacy.ok).toBe(true);
  if (legacy.ok) {
    expect(isLoveV3Draft(legacy.draft)).toBe(false); expect(validateProductPublication("love_marriage_child", legacy.draft, legacy.evidencePacket).errors).toEqual([]);
    const snapshot = createProductPreviewSnapshot({ reportId: "love-old", createdAtIso: "2026-09-28T00:00:00Z", productKey: "love_marriage_child", productSlug: "love-marriage-child", draft: legacy.draft as ProductPreviewSnapshotDraft, evidencePacket: legacy.evidencePacket });
    expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  }
  vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("REPORT_PERSISTENCE_MODE", "preview_memory"); vi.stubEnv("OPENAI_REPORT_WRITER_ENABLED", "0");
  const response = await POST(new Request("http://localhost/api/reports/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, productOptions: {} }) }));
  const body = await response.json(); expect(response.status).toBe(200);
  const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: body.reportId }) }));
  expect(html).not.toContain(LOVE_V3_VERSION); expect(html).not.toContain("리포트를 불러오지 못했습니다");
});

it.each(["unknown", "approximate"])("%s time retains conservative legacy handling without a writer", async precision => {
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]);
  const person = { ...payload.person, birthTime: "", birthTimeUnknown: precision === "unknown", birthTimePrecision: precision, approximateBirthTimeSlot: precision === "approximate" ? "SASI" : "" };
  const result = await generateProductReport({ ...payload, person }, { enabled: true, config: { enabled: true, apiKey: "test-no-call", model: "test" } }, "normal_writer", undefined, { loveVersion: "v3" });
  expect(result.ok).toBe(true); expect(result.externalCalls).toEqual([]);
  if (result.ok) { expect(isLoveV3Draft(result.draft)).toBe(false); expect(validateProductPublication("love_marriage_child", result.draft, result.evidencePacket).errors).toEqual([]); }
});

it("rejects edited facts/body/version and never promotes weak charm", () => {
  const r = createLoveV3(loveFixture(LOVE_V3_FIXTURES[1]).payload)!;
  expect(validateLoveV3({ ...r.draft, version: "other" }, r.evidencePacket)).toContain("LOVE_V3_CONTRACT_REQUIRED");
  expect(validateLoveV3({ ...r.draft, title: "임의 본문" }, r.evidencePacket)).toContain("LOVE_V3_CONTENT_MISMATCH");
  const changed = { ...r.evidencePacket, loveV3: { ...r.evidencePacket.loveV3, facts: r.evidencePacket.loveV3.facts.slice(1) } };
  expect(validateLoveV3(r.draft, changed)).toContain("LOVE_V3_FACTS_MISMATCH");
  const facts = r.evidencePacket.loveV3.facts.map(f => /dohwa|hongyeom/.test(f.featureId) ? { ...f, certainty: "weak" as const } : f);
  const draft = buildLoveV3({ name: "테스트", mbti: "ENFP", relationshipStatus: "single", familyFocus: false, facts, calculation: r.evidencePacket.loveV3.calculation });
  expect(loveV3CustomerText(draft)).not.toMatch(/도화|홍염/);
});
