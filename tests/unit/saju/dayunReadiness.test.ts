/**
 * AM2-4 7부(덕짱님 결정 2026-11-12): 시각 미상으로 엔진이 대운을 정하지 못하는 생일은 입력 단계에서 막는다.
 * 무작위 대운 입력 1,000명(am2-brief와 같은 생성기 · seed 7 · 만세력이 원국을 정하지 못하는 절입일 출생은 다음 입력으로 채움)에서
 * 판정 불가 전원이 ① 대략 시간대 질문(그 시간대로 대운이 정해짐) 또는 ② 결제 전 차단 + 세운 권함으로 처리되고, 대운 결제 경로(normalizeReportInputPayload — payment-checkout/prepare가 쓴다)에 닿지 않는다.
 */
import { describe, expect, it } from "vitest";
import { calculateCustomerDayun } from "@/lib/saju/customerDayun";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { dayunReadiness, DAYUN_UNDETERMINABLE_MESSAGE } from "@/lib/saju/dayunReadiness";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { randomPayload } from "../../../tools/annual-major/am2-brief";

const NOW = () => new Date("2026-12-02T03:00:00Z");
type P = { person: Record<string, unknown>; productKey: string };

describe("AM2-4 7부 시각 미상 대운", () => {
  it("무작위 1,000명: 판정 불가 전원이 시간대 질문 또는 차단 — 대운 결제 경로에 닿지 않고, 세운은 v5 경로에서 받는다", () => {
    let uncertain = 0, asked = 0, blocked = 0;
    for (let i = 0, ok = 0; ok < 1000; i++) {
      const p = randomPayload(i, "major_fortune", 7) as P;
      const ctx = resolveBirthTimeCalculation(p.person as never);
      if (!ctx.confirmed.year || !ctx.confirmed.month || !ctx.confirmed.day) continue;
      const r0 = calculateCustomerDayun(p.person as never);
      if (!r0.ok && r0.error !== "DAYUN_UNCERTAIN") continue;
      ok++;
      if (r0.ok) { expect(dayunReadiness(p.person as never)).toEqual({ ok: true }); continue; }
      uncertain++;
      // 결제 경로: 대운 주문 입력은 거절(payment-checkout/prepare가 같은 함수로 거절).
      const n = normalizeReportInputPayload(p as never, { now: NOW });
      expect(n.ok).toBe(false);
      const r = dayunReadiness(p.person as never);
      expect(r.ok).toBe(false);
      if (!r.ok && r.code === "DAYUN_NEED_SLOT") {
        asked++;
        expect(r.slots.length).toBeGreaterThan(0);
        // 고른 시간대마다 엔진이 대운을 정한다(계산 그대로, 범위만 좁힘).
        for (const s of r.slots) expect(normalizeReportInputPayload({ ...p, person: { ...p.person, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: s.value, birthTimePrecision: "approximate" } } as never, { now: NOW }).ok).toBe(true);
      } else if (!r.ok) { blocked++; expect(r.message).toBe(DAYUN_UNDETERMINABLE_MESSAGE); }
      // 세운 권함: v5 세운은 대운 없이 받는다(예전 v4 세운 경로는 그대로 거절).
      const ap = randomPayload(i, "annual_fortune", 7) as P;
      expect(normalizeReportInputPayload({ ...ap, person: p.person } as never, { now: NOW, annualWithoutDayun: () => true }).ok).toBe(true);
      expect(normalizeReportInputPayload({ ...ap, person: p.person } as never, { now: NOW, annualWithoutDayun: () => false }).ok).toBe(false);
    }
    expect(uncertain).toBe(65);
    expect(asked + blocked).toBe(uncertain);
  }, 600_000); // 전체 실행(병렬 부하)에서 혼자 돌 때의 3~5배가 걸린다.

  it("대략 시간대로도 정해지지 않으면 「이 생일은 대운을 정확히 계산할 수 없어요」 + 세운 권함, 입력 확인 API도 같은 코드", async () => {
    // 판정 불가 사람을 하나 찾아, 대운이 정해지지 않는 시간대를 고른 입력으로.
    let person: Record<string, unknown> | null = null, bad = "";
    for (let i = 0; i < 400 && !person; i++) {
      const p = randomPayload(i, "major_fortune", 7) as P; const r = dayunReadiness(p.person as never);
      if (!r.ok && r.code === "DAYUN_NEED_SLOT") { const all = ["JASI", "CHUKSI", "INSI", "MYOSI", "JINSI", "SASI", "OSI", "MISI", "SINSI", "YUSI", "SULSI", "HAESI"]; const miss = all.find(v => !r.slots.some(s => s.value === v)); if (miss) { person = p.person; bad = miss; } }
    }
    if (!person) return; // 이 seed에서 모든 시간대가 정해지면(판정 불가 없음) 건너뛴다.
    const approx = { ...person, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: bad, birthTimePrecision: "approximate" };
    const r = dayunReadiness(approx as never);
    expect(r).toMatchObject({ ok: false, code: "DAYUN_UNDETERMINABLE", recommend: "annual_fortune" });
    const { POST } = await import("@/app/api/reports/dayun-readiness/route");
    const res = await POST(new Request("http://x/api/reports/dayun-readiness", { method: "POST", body: JSON.stringify(approx) }));
    expect(await res.json()).toMatchObject({ ok: false, code: "DAYUN_UNDETERMINABLE" });
  }, 300_000);
});
