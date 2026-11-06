import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { WRITER_DISABLED_RUNTIME } from "../../../src/lib/report-generation/writerDisabled";

// The OpenAI writer was removed; paid delivery is always the validated deterministic draft.
const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const products = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
const payload = (key: string) => ({ productKey: key, productSlug: key === "saju_mbti_full" ? "saju-mbti-full" : key === "saju_mbti_compatibility" ? "compatibility" : key.replaceAll("_", "-"),
  ...(key === "saju_mbti_compatibility" ? { personA: person, personB: { ...person, name: "나래", birthDate: "1980-03-09", birthTime: "13:30", gender: "FEMALE", mbtiType: "ISFJ" }, relationshipType: "love" } : { person }),
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: key === "annual_fortune" ? { selectedYear: "2026" } : {} });
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

describe.each(products)("deterministic paid delivery: %s", key => {
  it("delivers a publishable draft with no external call", async () => {
    const result = await generateProductReport(payload(key), WRITER_DISABLED_RUNTIME, "normal_writer");
    expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { preflight: "pass", fallbackUsed: true, publish: "pass", failureCode: "WRITER_DISABLED" } });
    if (result.ok) expect(validateNewProductPublication(key, result.draft, result.evidencePacket, payload(key))).toEqual({ ok: true, errors: [] });
  });
});

it("unknown MBTI publishes a deterministic comprehensive report without inferring a type", async () => {
  const p = { ...payload("saju_mbti_full"), person: { ...person, mbtiType: "" } };
  const result = await generateProductReport(p, WRITER_DISABLED_RUNTIME, "normal_writer");
  expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass" } });
  if (result.ok) {
    const packet = result.evidencePacket as unknown as Record<string, unknown>;
    expect(packet.mbtiBasis).toBeUndefined();
    expect(validateNewProductPublication("saju_mbti_full", result.draft, result.evidencePacket, p).ok).toBe(true);
    expect(JSON.stringify(result.draft)).not.toMatch(/INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP/);
  }
});

it("invalid canonical input is rejected at preflight", async () => {
  const result = await generateProductReport({ ...payload("saju_mbti_full"), person: { ...person, birthDate: "not-a-date" } }, WRITER_DISABLED_RUNTIME, "normal_writer");
  expect(result).toMatchObject({ ok: false, externalCalls: [], delivery: { preflight: "fail", failureCode: "PREFLIGHT_CONTRACT_INVALID" } });
});

it("automatic retries keep their audit label", async () => {
  const result = await generateProductReport(payload("career_money_study"), WRITER_DISABLED_RUNTIME, "deterministic_fallback");
  expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass", failureCode: "AUTOMATIC_RETRY_NO_WRITER" } });
});
