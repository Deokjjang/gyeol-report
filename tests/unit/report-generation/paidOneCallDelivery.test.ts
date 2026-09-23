import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildPaidWriterRequest } from "../../../src/lib/report-generation/paidWriterRequest";
import { settlePaidWriterDraft } from "../../../src/lib/report-generation/paidWriterRescue";
import { resolveReportWriterRuntime } from "../../../src/lib/report-generation/reportWriterRuntime";

const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
const payload = (key: string) => ({ productKey: key, productSlug: key === "saju_mbti_full" ? "saju-mbti-full" : key === "saju_mbti_compatibility" ? "compatibility" : key.replaceAll("_", "-"),
  ...(key === "saju_mbti_compatibility" ? { personA: person, personB: { ...person, name: "나래", birthDate: "1980-03-09", birthTime: "13:30", gender: "FEMALE", mbtiType: "ISFJ" }, relationshipType: "love" } : { person }),
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: key === "annual_fortune" ? { selectedYear: "2026" } : {} });
const disabled = { enabled: false as const, reason: "flag_disabled" as const };
const runtime = (fetchImpl: typeof fetch) => ({ enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock-model", fetchImpl } });
const prepared = new Map<string, ProductGenerationSuccessResult>();
type Row = Record<string, unknown>;
beforeAll(async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00"));
  for (const key of products) {
    const result = await generateProductReport(payload(key), disabled, "deterministic_fallback");
    expect(result.ok, JSON.stringify(result.ok ? {} : result.error)).toBe(true);
    if (result.ok) prepared.set(key, result);
  }
  vi.useRealTimers();
});
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

async function check(key: string, output: unknown, expected: "writer" | "rescue" | "fallback") {
  const transport = vi.fn<typeof fetch>(async () => Response.json({ status: "completed", output_text: typeof output === "string" ? output : JSON.stringify(output), usage: { input_tokens: 20, output_tokens: 10, total_tokens: 30 } }));
  const result = await generateProductReport(payload(key), runtime(transport), "normal_writer");
  expect(result.ok, JSON.stringify(result.ok ? result.delivery : result.error)).toBe(true);
  expect(transport).toHaveBeenCalledTimes(1);
  expect(result.delivery, JSON.stringify(result.delivery)).toMatchObject({ preflight: "pass", fallbackUsed: expected === "fallback", publish: "pass" });
  expect(result.delivery?.rescueKinds.length ?? 0).toBe(expected === "rescue" ? 1 : 0);
  if (result.ok) expect(validateNewProductPublication(key, result.draft, result.evidencePacket, payload(key))).toEqual({ ok: true, errors: [] });
  return result;
}

describe.each(products)("one paid writer opportunity: %s", key => {
  it("valid response publishes without shortening or inventing text", async () => {
    const source = prepared.get(key)!;
    const result = await check(key, source.draft, "writer");
    if (result.ok) expect(result.draft).toEqual(source.draft);
  });
  it("internal presentation marker is rescued with the same canonical field", async () => {
    const draft = structuredClone(prepared.get(key)!.draft) as Row;
    draft.openingSummary = String(draft.openingSummary) + " INTERNAL_META writer PLACEHOLDER";
    const result = await check(key, draft, "rescue");
    if (result.ok) expect(result.draft).toEqual(prepared.get(key)!.draft);
  });
  it.each(["malformed", "truncated", "required", "medical", "empty", "wrong_identity", "invented_evidence", "repetition"])("%s discards unsafe output and publishes complete fallback", async scenario => {
    const draft = structuredClone(prepared.get(key)!.draft) as Row;
    let output: unknown = draft;
    if (scenario === "malformed") output = "{bad";
    if (scenario === "truncated") output = JSON.stringify(draft).slice(0, -20);
    if (scenario === "required") delete draft.openingSummary;
    if (scenario === "medical") draft.openingSummary = "당신의 사주는 우울증을 확정 진단하며 약물 치료로 반드시 완치됩니다.";
    if (scenario === "empty") { draft.chapters = []; draft.longformReadings = []; draft.openingSummary = ""; }
    if (scenario === "wrong_identity") draft.personLabel = "다른 사람";
    if (scenario === "invented_evidence") draft.evidenceIds = ["invented:nonexistent"];
    if (scenario === "repetition") draft.openingSummary = "언제나 같은 기준과 같은 설명으로만 모든 상황을 판단하고 모든 관계를 정리하는 장면입니다. ".repeat(10);
    await check(key, output, "fallback");
  });
  it.each(["timeout", "incomplete", "outage"])("%s needs no retry/repair", async scenario => {
    const transport = vi.fn<typeof fetch>(async () => {
      if (scenario === "timeout") throw new DOMException("mock", "AbortError");
      return Response.json(scenario === "incomplete" ? { status: "incomplete", output_text: "{}", usage: { total_tokens: 7 } } : { error: { message: "PRIVATE" } }, { status: scenario === "outage" ? 500 : 200 });
    });
    const result = await generateProductReport(payload(key), runtime(transport), "normal_writer");
    expect(result).toMatchObject({ ok: true, delivery: { fallbackUsed: true, publish: "pass" } });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(result.delivery)).not.toContain("PRIVATE");
  });
  it("writer disabled still delivers", async () => {
    const result = await generateProductReport(payload(key), resolveReportWriterRuntime({}), "normal_writer");
    expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass" } });
  });
});

it("unknown MBTI publishes a deterministic comprehensive report without inferring a type", async () => {
  const p = { ...payload("saju_mbti_full"), person: { ...person, mbtiType: "" } };
  const result = await generateProductReport(p, resolveReportWriterRuntime({}), "normal_writer");
  expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass" } });
  if (result.ok) {
    const packet = result.evidencePacket as unknown as Record<string, unknown>;
    expect(packet.mbtiBasis).toBeUndefined();
    expect(validateNewProductPublication("saju_mbti_full", result.draft, result.evidencePacket, p).ok).toBe(true);
    expect(JSON.stringify(result.draft)).not.toMatch(/INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP/);
  }
});

it("missing relationship scene is rescued from the same complete canonical chapter", async () => {
  const key = "saju_mbti_full", source = prepared.get(key)!;
  const draft = structuredClone(source.draft) as Row;
  const chapter = (draft.chapters as Row[]).find(c => c.chapterId === "love_relationships")!;
  // Remove only validator scene markers, preserving length, evidence and scope.
  const markers = /회의|카톡|메시지|가족|연인|상대|팀|업무|공부|자격증|전문서|계좌|돈|일정|침대|밤|산책/g;
  const clear = (v: unknown): unknown => typeof v === "string" ? v.replace(markers, "일상") : Array.isArray(v) ? v.map(clear) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k,x]) => [k, k === "chapterId" ? x : clear(x)])) : v;
  Object.assign(chapter, clear(chapter));
  (chapter.solutionLines as string[]).push("보완되는 사람과 경계를 설명하세요.");
  const errors = validateNewProductPublication(key, draft, source.evidencePacket, payload(key)).errors;
  expect(errors).toContain("EVERYDAY_SCENE_MISSING: love_relationships");
  const result = await check(key, draft, "rescue");
  expect(result.delivery?.rescueKinds).toContain("EVERYDAY_SCENE_MISSING");
});

it("raw Saju explanation omission is rescued from the matching canonical longform", async () => {
  const key = "saju_mbti_full", source = prepared.get(key)!;
  const draft = structuredClone(source.draft) as Row;
  const reading = (draft.longformReadings as Row[])[0];
  reading.body = String(reading.body).replace(/숨어|욕구|역할|회복/g, "내면") + " 지장간을 살펴봅니다.";
  reading.sajuTermsUsed = ["지장간"];
  expect(validateNewProductPublication(key, draft, source.evidencePacket, payload(key)).errors)
    .toContain(`RAW_SAJU_LABEL_EXPLANATION_MISSING: ${reading.readingId}:지장간`);
  const result = await check(key, draft, "rescue");
  expect(result.delivery?.rescueKinds).toContain("RAW_SAJU_LABEL_EXPLANATION_MISSING");
});

it("wrong pillars/MBTI, A/B inversion, Dayun and monthly segment cannot be repaired", () => {
  for (const key of products) {
    const source = prepared.get(key)!, draft = structuredClone(source.draft) as Row;
    if (key === "saju_mbti_full") (draft.profileTable as Row).mbti = "ISFP";
    else if (key === "saju_mbti_compatibility") [draft.personALabel, draft.personBLabel] = [draft.personBLabel, draft.personALabel];
    else if (key === "major_fortune") (draft.cycleSummary as Row).ganji = "甲子";
    else if (key === "annual_fortune") draft.calendarMonths = [{ month: 2, segments: [{ monthPillar: "甲子" }] }];
    else draft.dayPillar = "甲子";
    expect(settlePaidWriterDraft(key, draft, source, payload(key))).toMatchObject({ source: "fallback", issues: ["WRITER_FACT_MISMATCH"] });
  }
});

it("records prompt composition without dumping evidence or source data", () => {
  for (const key of products) {
    const p = prepared.get(key)!, request = buildPaidWriterRequest(p, person.name);
    const sizes = { product: key, evidenceBytes: Buffer.byteLength(JSON.stringify(p.evidencePacket)), fallbackBytes: Buffer.byteLength(JSON.stringify(p.draft)),
      systemBytes: Buffer.byteLength(request.messages.system), developerBytes: Buffer.byteLength(request.messages.developer), userBytes: Buffer.byteLength(request.messages.user), schemaBytes: Buffer.byteLength(JSON.stringify(request.jsonSchema)) };
    const previousPacket = { ...(p.evidencePacket as Row) };
    delete previousPacket.calendarCalculationVersion; // dispatcher previously stamped this after writer
    const previous = buildPaidWriterRequest({ ...p, evidencePacket: previousPacket }, person.name);
    const before = Buffer.byteLength(JSON.stringify(previous.messages));
    const after = Buffer.byteLength(JSON.stringify(request.messages));
    process.stdout.write("PAID_PROMPT_BYTES " + JSON.stringify({ ...sizes, serializedMessagesBefore: before, serializedMessagesAfter: after, delta: after - before }) + "\n");
    expect(sizes.userBytes).toBeGreaterThan(1000);
    if (key === "saju_mbti_full") process.stdout.write("PROMPT_EVIDENCE_COMPONENTS " + JSON.stringify(Object.entries(p.evidencePacket as Row).map(([field, value]) => ({ field, bytes: Buffer.byteLength(JSON.stringify(value) ?? "") })).sort((a,b) => b.bytes-a.bytes)) + "\n");
  }
});

it("invalid canonical input is rejected before any provider call", async () => {
  const transport = vi.fn<typeof fetch>();
  const result = await generateProductReport({ ...payload("saju_mbti_full"), person: { ...person, birthDate: "not-a-date" } }, runtime(transport), "normal_writer");
  expect(result).toMatchObject({ ok: false, externalCalls: [], delivery: { preflight: "fail", failureCode: "PREFLIGHT_CONTRACT_INVALID" } });
  expect(transport).not.toHaveBeenCalled();
});
it("invalid model config spends zero calls and still delivers validated fallback", async () => {
  const transport = vi.fn<typeof fetch>();
  const config = runtime(transport); config.config.model = "";
  expect(await generateProductReport(payload("saju_mbti_full"), config, "normal_writer")).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass", failureCode: "OPENAI_CONFIG" } });
  expect(transport).not.toHaveBeenCalled();
});
