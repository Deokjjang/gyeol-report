/** 잠금 증명용: 만세력 보정 문구만 P6c 이전(525aa62f^) 문장으로 되돌린다. 다른 코드는 그대로다. */
import { vi } from "vitest";

vi.mock("../../src/lib/saju/birthTimePrecisionTypes", async importOriginal => {
  const actual = await importOriginal<typeof import("../../src/lib/saju/birthTimePrecisionTypes")>();
  const { SAJU_CALC_VERSION_ID } = await import("../../src/lib/saju/calendarVersion");
  return {
    ...actual,
    solarTimeCorrectionNote(context: unknown): string | undefined {
      if (context === null || typeof context !== "object") return;
      const { timeBasis: basis, birthTimePrecision } = context as Partial<import("../../src/lib/saju/birthTimePrecisionTypes").BirthTimeCalculationContext>;
      if (!basis || basis.calcVersion !== SAJU_CALC_VERSION_ID || birthTimePrecision === "unknown" ||
          typeof basis.solarTimeCorrectionMinutes !== "number" || typeof basis.longitude !== "number") return;
      const minutes = Math.round(basis.solarTimeCorrectionMinutes);
      const meridian = `${basis.longitudeSource === "birthplace" ? "출생지 경도" : "기준 경도"} 동경 ${basis.longitude}°`;
      const era = basis.utcOffsetMinutes === 570 || basis.utcOffsetMinutes === 600 ? " (당시 서머타임 반영)"
        : basis.utcOffsetMinutes === 510 ? " (당시 표준시 UTC+8:30 반영)" : "";
      if (minutes === 0) return `${meridian}로 시간 보정 없음${era}`;
      return `${meridian}로 시간 보정 ${minutes > 0 ? "+" : ""}${minutes}분 적용${era}`;
    },
  };
});
