import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { buildPaidWriterRequest } from "../../../src/lib/report-generation/paidWriterRequest";
import { buildComprehensiveWriterEvidence, buildOpenAIComprehensiveReportWriterMessages } from "../../../src/lib/report-generation/openaiReportWriterPrompt";
import type { ComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";

const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const disabled = { enabled: false as const, reason: "flag_disabled" as const };
const payload = (key = "saju_mbti_full", customer = person) => ({ productKey: key, productSlug: key === "saju_mbti_full" ? "saju-mbti-full" : key === "saju_mbti_compatibility" ? "compatibility" : key.replaceAll("_", "-"),
  ...(key === "saju_mbti_compatibility" ? { personA: person, personB: { ...person, name: "나래", birthDate: "1980-03-09", gender: "FEMALE", mbtiType: "ISFJ" }, relationshipType: "love" } : { person: customer }),
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: key === "annual_fortune" ? { selectedYear: "2026" } : {} });
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
const record = (v: Json): v is { [key: string]: Json } => v !== null && typeof v === "object" && !Array.isArray(v);
const cloneJson = (v: unknown): Json => JSON.parse(JSON.stringify(v)) as Json;
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const divider = "제공된 근거 JSON:\n";

// Independent consumer: resolve the transmitted graph into semantic fields,
// checking every edge/identity. No production packing implementation is reused.
function readEvidence(user: string) {
  const packed = JSON.parse(user.split(divider)[1]) as { [key: string]: Json };
  const catalog = packed.writerEvidenceCatalog;
  expect(record(catalog)).toBe(true);
  if (!record(catalog)) throw new Error("catalog missing");
  const used = new Set<string>();
  const resolve = (v: Json, ancestors: string[] = []): Json => {
    if (Array.isArray(v)) return v.map(item => resolve(item, ancestors));
    if (!record(v)) return v;
    if (typeof v.evidenceRef === "string") {
      const ref = v.evidenceRef;
      expect(ancestors).not.toContain(ref); expect(catalog).toHaveProperty(ref);
      const target = catalog[ref];
      expect(record(target)).toBe(true);
      if (!record(target)) throw new Error("dangling reference");
      for (const id of ["id", "sourceId"]) if (v[id] !== undefined) expect(v[id]).toEqual(target[id]);
      used.add(ref);
      return resolve(target, [...ancestors, ref]);
    }
    return Object.fromEntries(Object.entries(v).map(([k, item]) => [k, resolve(item, ancestors)]));
  };
  const { writerEvidenceCatalog: _catalog, ...root } = packed;
  void _catalog;
  const expanded = resolve(root);
  expect([...used].sort()).toEqual(Object.keys(catalog).sort());
  return { expanded, catalog, packed };
}
function meaningfulFields(value: Json, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => meaningfulFields(v, `${path}[${i}]`));
  if (record(value)) return Object.entries(value).flatMap(([k, v]) => meaningfulFields(v, `${path}.${k}`));
  return [`${path}=${JSON.stringify(value)}`];
}
async function comprehensive(customer = person) {
  const p = payload("saju_mbti_full", customer);
  const result = await generateProductReport(p, disabled, "deterministic_fallback");
  expect(result.ok).toBe(true); if (!result.ok) throw new Error("fixture failed");
  const packet = result.evidencePacket as ComprehensiveReportEvidencePacket;
  return { p, result, packet };
}
const customers = [person,
  { ...person, name: "수연", birthDate: "1980-03-09", birthTime: "13:30", gender: "FEMALE" },
  { ...person, name: "지민", birthDate: "2001-06-22", birthTime: "13:30" }];

it.each(customers.flatMap(customer => [...MBTI_TYPES, ""].map(mbtiType => ({ ...customer, mbtiType }))))(
  "$birthDate / $mbtiType: every fact, source/Bridge ID, condition, scene and section assignment survives",
  async customer => {
    const { packet, result, p } = await comprehensive(customer);
    const pristine = cloneJson(packet);
    const before = cloneJson(buildComprehensiveWriterEvidence({ evidencePacket: packet }));
    const request = buildPaidWriterRequest(result, customer.name);
    const { expanded } = readEvidence(request.messages.user);
    // Equality of semantic paths/values, not JSON strings/whitespace or just IDs.
    expect(meaningfulFields(expanded).sort()).toEqual(meaningfulFields(before).sort());
    expect(expanded).toEqual(before);
    expect(cloneJson(packet)).toEqual(pristine);
    if (!record(expanded)) throw new Error("packet missing");
    for (const key of ["inputBasis", "birthTimeContexts", "sajuEntryIds", "mbtiBasis", "selectedMbtiKnowledge", "narrativePlan", "sajuFeatureDictionary", "selectedSajuFeatureEvidence", "sajuMbtiBridgeEvidence", "interpretedSajuMbtiBridgeEvidence", "bridgeFactIds"]) {
      const original = (pristine as Record<string, Json>)[key];
      if (original !== undefined) expect(expanded[key], key).toEqual(original);
    }
    if (!customer.mbtiType) expect(expanded.mbtiBasis).toBeUndefined();
    else expect((expanded.mbtiBasis as Record<string, Json>).type).toBe(customer.mbtiType);
    expect(request.messages.user.length).toBeLessThan(JSON.stringify(before, null, 2).length);
    expect(validateNewProductPublication("saju_mbti_full", result.draft, packet, p).ok).toBe(true);
    expect(result.externalCalls).toEqual([]);
  },
);

it("same evidence ID with different context/conditions is not merged; prose punctuation stays intact", async () => {
  const { packet } = await comprehensive();
  const section = packet.sections[0];
  const item = packet.sections.flatMap(s => s.primarySaju).find(s => JSON.stringify(s).length >= 300)!;
  expect(item).toBeDefined();
  const variant = { ...item, summary: item.summary + ' 서로 다른 조건입니다. "evidenceRef": "record_1", 쉼표, 역슬래시 \\ 와 줄바꿈\n도 원문입니다.', priority: item.priority + 1 };
  const changed = { ...packet, sections: [{ ...section, primarySaju: [item, { ...item }, variant, { ...variant }] }, ...packet.sections.slice(1)] };
  const before = cloneJson(buildComprehensiveWriterEvidence({ evidencePacket: changed }));
  const { expanded, catalog } = readEvidence(buildOpenAIComprehensiveReportWriterMessages({ evidencePacket: changed, mbtiType: person.mbtiType }).user);
  expect(expanded).toEqual(before);
  const variants = Object.values(catalog).filter(v => record(v) && v.sourceId === item.sourceId);
  expect(variants.some(v => record(v) && v.summary === item.summary)).toBe(true);
  expect(variants.some(v => record(v) && v.summary === variant.summary)).toBe(true);
});

it("all 392 baseline instruction meanings and the output schema remain intact", async () => {
  const { result } = await comprehensive();
  const request = buildPaidWriterRequest(result, person.name);
  const { system, developer, user } = request.messages;
  const lines = [...new Set([system, developer, user.split(divider)[0]].flatMap(t => t.split("\n")).map(t => t.trim()).filter(t => t && !t.startsWith("근거 JSON의 evidenceRef는")))].sort();
  // Captured from 8758901 before editing, with this synthetic fixture. Stronger
  // than checking selected words: not one original distinct instruction is lost.
  expect(lines).toHaveLength(392);
  expect(hash(lines)).toBe("112f6e75a080fd2567652d986ce66ed032e8c33afea1c608c8b331ba6674660f");
  expect(hash(request.jsonSchema)).toBe("16f23f4b24e0cf12f1a5b1cb766ad392b354399c4614d791a9f23fd113a6fb1d");
  // Updated only for canonical natal hidden-stem correction (MAIN/SUB/MINOR).
  // Instruction/schema and all five other product request hashes remain unchanged.
  expect(hash(readEvidence(user).expanded)).toBe("ff35bf1ecf58f43c503e36c636b053c401696553ed93a610a209f771683a7f70");
});

const otherRequestHashes = {
  career_money_study: "0ec92d4d83cb5d6b8c576f050a1f392378463ab79fea768003b8109c5f1d9a5e",
  love_marriage_child: "151ccbb50f9fdc2e8bd1e8e11f14814b15ca96cf1b701e7ae4173ae995091ceb",
  saju_mbti_compatibility: "2d89ae251508a6098be0a91318ce2dcbb684ce35b5e9525813bf6595e5d2baea",
  major_fortune: "f29ad84ca2857c14e864f43c1fea61608df18d7eddf84755d8a71849ddd1c620",
  annual_fortune: "0ca4ede056c91efd2c50ffc9ecd6da534b3d33d5b9aaac34d11d664fcfe50716",
};
it.each(Object.entries(otherRequestHashes))("%s prompt and schema unchanged from pre-optimization fixture", async (key, digest) => {
  const result = await generateProductReport(payload(key), disabled, "deterministic_fallback");
  expect(result.ok).toBe(true); if (!result.ok) return;
  expect(hash(buildPaidWriterRequest(result, person.name))).toBe(digest);
  expect(validateNewProductPublication(key, result.draft, result.evidencePacket, payload(key)).ok).toBe(true);
});

it.each(["valid", "semantic", "malformed"])("optimized paid writer %s preserves publish/rescue/fallback delivery", async mode => {
  const { p, result, packet } = await comprehensive();
  const body = structuredClone(result.draft) as Record<string, unknown>;
  if (mode === "semantic") body.openingSummary = "약물 치료로 질병을 예방합니다.";
  const transport = vi.fn<typeof fetch>(async (_url, init) => {
    const request = JSON.parse(String(init?.body)) as { input: { role: string; content: string }[] };
    const user = request.input.find(m => m.role === "user")!.content;
    expect(readEvidence(user).expanded).toEqual(cloneJson(buildComprehensiveWriterEvidence({ evidencePacket: packet })));
    return Response.json({ output_text: mode === "malformed" ? "{bad" : JSON.stringify(body) });
  });
  const delivered = await generateProductReport(p, { enabled: true, config: { enabled: true, apiKey: "mock-only", model: "mock", fetchImpl: transport } }, "normal_writer");
  expect(transport).toHaveBeenCalledTimes(1);
  expect(delivered).toMatchObject({ ok: true, delivery: { publish: "pass", fallbackUsed: mode !== "valid" } });
  if (delivered.ok) expect(delivered.draft).toEqual(result.draft);
});

it("reports payload measurements without customer content or any provider calls", async () => {
  const { packet, result } = await comprehensive();
  const before = buildComprehensiveWriterEvidence({ evidencePacket: packet });
  const request = buildPaidWriterRequest(result, person.name);
  const { packed, catalog } = readEvidence(request.messages.user);
  process.stdout.write("WRITER_PROMPT_OPTIMIZATION " + JSON.stringify({
    beforeEvidenceChars: JSON.stringify(before, null, 2).length, afterEvidenceChars: request.messages.user.split(divider)[1].length,
    beforeEvidenceBytes: Buffer.byteLength(JSON.stringify(before, null, 2)), afterEvidenceBytes: Buffer.byteLength(request.messages.user.split(divider)[1]),
    catalogRecords: Object.keys(catalog).length, dataFields: Object.keys(packed).length - 1,
    schemaBytes: Buffer.byteLength(JSON.stringify(request.jsonSchema)),
  }) + "\n");
  // Explicit opt-in local audit export: synthetic data only, outside the repo.
  // Normal test runs never create files or need a tokenizer/network dependency.
  if (process.env.PROMPT_OPT_AUDIT_EXPORT === "1") writeFileSync("/tmp/prompt-opt-after-saju_mbti_full.json", JSON.stringify({ request, evidence: before }));
});
