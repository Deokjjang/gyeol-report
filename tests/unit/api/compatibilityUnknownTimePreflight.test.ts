import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { POST as preflight } from "../../../src/app/api/reports/validate-input/route";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { COMPATIBILITY_RELATIONSHIP_TYPES, COMPATIBILITY_ROLE_VERSION } from "../../../src/lib/report-generation/reportInputTypes";

const person = (name: string, birthDate: string, birthTime: string, gender: string, mbtiType: string) => ({
  name, birthDate, birthTime, birthTimeUnknown: !birthTime, birthTimePrecision: birthTime ? "exact" : "unknown", approximateBirthTimeSlot: "", gender, mbtiType });
const pair = (relationshipType: string, personB: ReturnType<typeof person>) => ({
  productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType, compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
  personA: person("하람", "1996-12-06", "09:30", "MALE", "ENTJ"), personB });
const check = async (payload: unknown) => {
  const response = await preflight(new Request("http://localhost/api/reports/validate-input", { method: "POST", body: JSON.stringify(payload) }));
  return { status: response.status, body: await response.json() };
};

it("an unknown partner hour publishes on the v4 path for every relationship type", async () => {
  for (const type of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const result = await generateV4ShadowReport(pair(type, person("서윤", "1989-03-21", "", "FEMALE", "INFP")), { evaluatedAt: "2026-10-29T08:00:00.000Z" });
    expect(result.ok, type).toBe(true);
  }
  // The P3.5 local failure came from a payload without the fixed-role version the form always sends.
  const legacy: Record<string, unknown> = { ...pair("love", person("서윤", "1989-03-21", "", "FEMALE", "INFP")) };
  delete legacy.compatibilityRoleVersion;
  expect(await generateV4ShadowReport(legacy, { evaluatedAt: "2026-10-29T08:00:00.000Z" })).toMatchObject({ ok: false, error: { message: "V4_COMPATIBILITY_GENERATION_FAILED" } });
}, 120_000);

it("the input page stops only a solar-term birth day with an unknown hour, before checkout", async () => {
  expect(await check(pair("love", person("서윤", "1989-03-21", "", "FEMALE", "INFP")))).toEqual({ status: 200, body: { ok: true } });
  const uncertain = await check(pair("parentChild", person("가람", "1974-11-08", "", "FEMALE", "ESTJ")));
  expect(uncertain.status).toBe(400);
  expect(uncertain.body.message).toContain("절기가 바뀌는 날");
  expect(await check(pair("parentChild", person("가람", "1974-11-08", "21:10", "FEMALE", "ESTJ")))).toEqual({ status: 200, body: { ok: true } });
  const ui = readFileSync("src/components/book/BookInput.tsx", "utf8");
  expect(ui).toContain("if (step === total - 1 && (internal || requiredGender || pair)) {");
});
