import { createRequire } from "node:module";
import { resolveBirthTimeCalculation } from "./birthTimePrecision";
import { normalizeBirthTimePrecision } from "./birthTimePrecisionTypes";
import { formatDayunKst, type CustomerDayunInput } from "./customerDayun";

/**
 * 전통 대운수(최종 A-3): 태어난 때와 절입(순행이면 다음 절, 역행이면 이전 절) 사이의 날수 ÷ 3.
 * 나머지 0·1일은 버리고 2일은 올린다(1~10으로 묶음). 시간은 날수에 넣지 않는다(16일 10시간 → 16일).
 * 교운 시각(정밀 계산, calculateCustomerDayun의 startSolarKst)은 이 숫자와 따로 그대로 쓴다.
 * 출생시간이 대략·미상이면 가능한 범위의 가운데 시각으로 센다(범위 끝과 1 다를 수 있음 — minMax로 함께 준다).
 * customerDayun.ts는 연구 기록이 파일 해시로 고정해 두어(annual·major 연구 시험) 손대지 않고 이 파일에 따로 둔다.
 */
export type TraditionalDaeunsu = { daeunsu: number; days: number; hours: number; jieName: string; jieKst: string; direction: "forward" | "reverse"; minMax: [number, number] };
type Failure = { ok: false; error: "DAYUN_GENDER_REQUIRED" | "DAYUN_UNCERTAIN" | "DAYUN_INVALID_INPUT" };
type JieSolar = { toYmdHms(): string; subtractMinute(other: JieSolar): number; getLunar(): JieLunar };
type JieLunar = { getPrevJie(): { getName(): string; getSolar(): JieSolar }; getNextJie(): { getName(): string; getSolar(): JieSolar } };
const library = createRequire(import.meta.url)("lunar-javascript") as { Solar: { fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): JieSolar } };
const MINUTE = 60_000, HOUR = 60 * MINUTE;
// customerDayun.ts의 solarAtInstant·solarKst와 같은 변환(라이브러리는 UTC+8 벽시계로 받는다).
const solarAtInstant = (instant: number) => { const d = new Date(instant + 8 * HOUR); return library.Solar.fromYmdHms(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), 0); };
const solarKst = (solar: JieSolar) => formatDayunKst(Date.parse(solar.toYmdHms().replace(" ", "T") + "+08:00"));

export const daeunsuFromDays = (days: number) => Math.min(10, Math.max(1, Math.floor(days / 3) + (days % 3 === 2 ? 1 : 0)));
export function calculateTraditionalDaeunsu(input: CustomerDayunInput): { ok: true; value: TraditionalDaeunsu } | Failure {
  if (input.gender !== "MALE" && input.gender !== "FEMALE") return { ok: false, error: "DAYUN_GENDER_REQUIRED" };
  const parsed = normalizeBirthTimePrecision(input);
  if (!parsed.ok) return { ok: false, error: "DAYUN_INVALID_INPUT" };
  try {
    const context = resolveBirthTimeCalculation(input);
    if (!context.confirmed.year) return { ok: false, error: "DAYUN_UNCERTAIN" };
    const forward = ("甲丙戊庚壬".includes(context.confirmed.year.stem)) === (input.gender === "MALE");
    const start = Date.parse(context.range.startKst), end = Date.parse(context.range.endKstExclusive);
    if (!Number.isFinite(start) || end <= start || end - start > 1440 * MINUTE) return { ok: false, error: "DAYUN_INVALID_INPUT" };
    const at = (instant: number) => {
      const solar = solarAtInstant(instant), lunar = solar.getLunar();
      const jie = forward ? lunar.getNextJie() : lunar.getPrevJie(), jieSolar = jie.getSolar();
      const minutes = forward ? jieSolar.subtractMinute(solar) : solar.subtractMinute(jieSolar);
      const days = Math.floor(minutes / 1440);
      return { days, hours: Math.floor((minutes % 1440) / 60), daeunsu: daeunsuFromDays(days), jieName: jie.getName(), jieKst: solarKst(jieSolar) };
    };
    const last = end - MINUTE, mid = start + Math.floor((end - start) / 2 / MINUTE) * MINUTE;
    const m = at(mid), a = at(start), b = at(last);
    return { ok: true, value: { ...m, direction: forward ? "forward" : "reverse", minMax: [Math.min(a.daeunsu, b.daeunsu, m.daeunsu), Math.max(a.daeunsu, b.daeunsu, m.daeunsu)] } };
  } catch {
    return { ok: false, error: "DAYUN_INVALID_INPUT" };
  }
}
