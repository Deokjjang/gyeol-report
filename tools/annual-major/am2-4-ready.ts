/**
 * AM2-4 7부(호출 0): 무작위 대운 입력(am2-brief와 같은 생성기 · seed 7)에서 엔진이 대운을 정하지 못하는 사람 수와 처리 갈래.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-4-ready.ts [N]
 */
import { calculateCustomerDayun } from "../../src/lib/saju/customerDayun";
import { dayunReadiness } from "../../src/lib/saju/dayunReadiness";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { resolveBirthTimeCalculation } from "../../src/lib/saju/birthTimePrecision";
import { randomPayload } from "./am2-brief";

const N = Number(process.argv[2] ?? 1000);
let uncertain = 0, needSlot = 0, blocked = 0, paidReject = 0, annualOk = 0, slotOk = 0, slotTotal = 0, tried = 0;
for (let i = 0, ok = 0; ok < N; i++) {
  const p = randomPayload(i, "major_fortune", 7) as { person: Record<string, unknown>; productKey: string };
  tried++;
  // am2-brief와 같은 모집단: 만세력이 원국을 정하지 못하는 출생 시각(절입일 · UncertainBirthTimeError)은 주문이 될 수 없어 다음 입력으로 채운다.
  const ctx = resolveBirthTimeCalculation(p.person as never); if (!ctx.confirmed.year || !ctx.confirmed.month || !ctx.confirmed.day) continue;
  const r0 = calculateCustomerDayun(p.person as never);
  if (!r0.ok && r0.error !== "DAYUN_UNCERTAIN") continue;
  ok++;
  if (r0.ok) continue;
  uncertain++;
  const r = dayunReadiness(p.person as never);
  if (!r.ok && r.code === "DAYUN_NEED_SLOT") { needSlot++; for (const s of r.slots) { slotTotal++; if (calculateCustomerDayun({ ...(p.person as never), birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: s.value } as never).ok) slotOk++; } }
  if (!r.ok && r.code === "DAYUN_UNDETERMINABLE") blocked++;
  const n = normalizeReportInputPayload(p as never, { now: () => new Date("2026-12-02T03:00:00Z") }); if (!n.ok) paidReject++;
  const ap = randomPayload(i, "annual_fortune", 7) as { person: Record<string, unknown> };
  const a = normalizeReportInputPayload({ ...ap, person: p.person } as never, { now: () => new Date("2026-12-02T03:00:00Z"), annualWithoutDayun: () => true }); if (a.ok) annualOk++; else console.log("annual reject", a.error);
}
console.log(JSON.stringify({ N, tried, uncertain, needSlot, blocked, paidReject, annualOk, slotOk, slotTotal }));
