import "server-only";
import { dayunLabel, dayunStartManAge, dayunStartMs } from "../../brief/labels";
import { getAnnualJieBoundaries } from "../../report-knowledge/annualMonthJie";
import { resolveBirthTimeCalculation } from "../../saju/birthTimePrecision";
import { BIRTH_TIME_SLOT_DEFINITIONS, birthTimeSlotLabel, solarTimeCorrectionNote, type BirthTimeCalculationContext } from "../../saju/birthTimePrecisionTypes";
import { DEFAULT_SAJU_TIME_POLICY } from "../../saju/calcPolicy";
import { SAJU_CALENDAR_VERSION } from "../../saju/calendarVersion";
import { calculateCustomerDayun } from "../../saju/customerDayun";
import { getDayHourPillarsFromSolarTime } from "../../saju/pillars";
import { civilToUtc, civilWallClockMs, utcOffsetMinutesAt } from "../../saju/solarTime";
import { calculateTraditionalDaeunsu } from "../../saju/traditionalDaeunsu";
import type { Pillar } from "../../saju/types";

const KO: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};
const KEYS = [["year", "년주"], ["month", "월주"], ["day", "일주"], ["hour", "시주"]] as const;
export type PillarCell = { label: string; value: string };
export type ManseSummary = { ok: true; pillars: PillarCell[] } | { ok: false; reason: string };

const show = (p: Pillar) => `${p.stem}${p.branch}(${KO[p.stem] ?? p.stem}${KO[p.branch] ?? p.branch})`;

/**
 * 만세력 네 기둥(관리자 확인용, 기존 엔진의 출생 시각 해석을 그대로 쓴다). 시간 모름이면 시주를 만들지 않는다.
 * 절입 경계처럼 한 기둥이 정해지지 않으면 후보를 "/"로 보인다(책 생성과 같은 판단: 섞지 않는다).
 */
export function manseSummary(person: unknown): ManseSummary {
  if (!person || typeof person !== "object") return { ok: false, reason: "입력 없음" };
  const p = person as Record<string, unknown>;
  if (typeof p.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)) return { ok: false, reason: "생년월일 없음" };
  const unknownTime = p.birthTimeUnknown === true || p.birthTimePrecision === "unknown";
  try {
    const c = resolveBirthTimeCalculation({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, birthTimePrecision: p.birthTimePrecision, approximateBirthTimeSlot: p.approximateBirthTimeSlot });
    const pillars = KEYS.filter(([k]) => k !== "hour" || !unknownTime).flatMap(([k, label]) => {
      const one = c.confirmed[k];
      if (one) return [{ label, value: show(one) }];
      const options = c.candidates[k] ?? [];
      return options.length ? [{ label, value: `${options.map(show).join(" / ")} (미확정)` }] : [];
    });
    return pillars.length ? { ok: true, pillars } : { ok: false, reason: "계산 불가" };
  } catch { return { ok: false, reason: "계산 불가(입력 확인)" }; }
}

/**
 * 계산 기준 설명서(docs/v5/ops/calc-basis.md) 주제 링크(운영 Q 7). 제목이 바뀌면 시험(adminCalcCheck)이 잡는다.
 * 깃허브 제목 앵커 규칙: 소문자, 글자·숫자·밑줄·하이픈·띄어쓰기 밖은 지우고 띄어쓰기를 하이픈으로.
 */
export const CALC_BASIS_URL = "https://github.com/Deokjjang/gyeol-report/blob/master/docs/v5/ops/calc-basis.md";
export const CALC_BASIS_TOPICS = {
  solar: "1. 태양시 보정 — 왜 30분을 빼나요?",
  legacy: "1-1. 예전에 만든 책 (2026년 10월 27일까지)",
  age: "2. 나이 기준 — 만 나이예요, 세는 나이예요?",
  jie: "4. 해가 바뀌는 기준(입춘)과 달이 바뀌는 기준(절기)",
  unknown: "6. 출생 시간을 모를 때",
  dst: "7. 옛 표준시·서머타임 시기에 태어났을 때",
} as const;
export type CalcBasisTopic = keyof typeof CALC_BASIS_TOPICS;
export const githubAnchor = (heading: string) => heading.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "").replace(/ /g, "-");
export const calcBasisLink = (topic: CalcBasisTopic) => `${CALC_BASIS_URL}#${githubAnchor(CALC_BASIS_TOPICS[topic])}`;

/** 2026-10-27(KST)까지 발행한 책은 태양시 보정 전 계산판(saju-calendar-kst-v2, 설명서 1-1). 발행 시각이 없으면 판단하지 않는다. */
export const LEGACY_CALC_LAST_DAY_KST = "2026-10-27";
export function legacyCalcBook(publishedAt: unknown): boolean {
  const at = typeof publishedAt === "string" ? Date.parse(publishedAt) : NaN;
  return Number.isFinite(at) && at < Date.parse(`${LEGACY_CALC_LAST_DAY_KST}T00:00:00+09:00`) + 86_400_000;
}

export type CalcRow = { label: string; value: string; topic?: CalcBasisTopic };
export type CalcCheck = { ok: boolean; reason?: string; rows: CalcRow[] };

const JIE_KO: Record<string, string> = { 小寒: "소한", 立春: "입춘", 惊蛰: "경칩", 驚蟄: "경칩", 清明: "청명", 立夏: "입하", 芒种: "망종", 芒種: "망종", 小暑: "소서", 立秋: "입추", 白露: "백로", 寒露: "한로", 立冬: "입동", 大雪: "대설" };
const hm = (iso: string) => `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
const kstIso = (ms: number) => new Date(ms + 9 * 3_600_000).toISOString().slice(0, 19) + "+09:00";
function offsetLabel(minutes: number): string {
  const abs = Math.abs(minutes), h = Math.floor(abs / 60), m = Math.round(abs % 60);
  const name = `UTC${minutes < 0 ? "−" : "+"}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
  const era = minutes === 600 || minutes === 570 ? "당시 서머타임" : minutes === 510 ? "당시 표준시(동경 127.5°)" : minutes === 540 ? "표준시(동경 135°)" : "지방 평균시(1908년 이전)";
  return `${name} · ${era}`;
}
const signed = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}분`;

/** 입력 화면 라벨: 지금(날짜 기준, 운영 Q 8-2)과 이 변경 전(지금 시계 UTC+9 고정)이 다르면 둘 다 보인다. */
function timeInputLine(p: Record<string, unknown>, ctx: BirthTimeCalculationContext): string {
  if (ctx.birthTimePrecision === "unknown") return "모름(시주 만들지 않음)";
  if (ctx.birthTimePrecision === "exact") return `정확 · ${String(p.birthTime)}`;
  const now = birthTimeSlotLabel(ctx.approximateBirthTimeSlot, SAJU_CALENDAR_VERSION, ctx.birthDate) ?? String(ctx.approximateBirthTimeSlot);
  const before = BIRTH_TIME_SLOT_DEFINITIONS.find(s => s.value === ctx.approximateBirthTimeSlot)?.labelKo;
  return `대략 · ${now}${before && before !== now ? ` (이 변경 전 입력 화면 라벨: ${before})` : ""}`;
}

/** 출생 순간(범위) 앞뒤 절입: 이 달의 절입(월주 시작)과 다음 절입. 범위 안에 절입이 끼면 함께 적는다. */
function jieLine(ctx: BirthTimeCalculationContext): string {
  const year = Number(ctx.birthDate.slice(0, 4));
  const all = [year - 1, year, year + 1].flatMap(y => getAnnualJieBoundaries(y)).map(b => ({ name: b.name, at: Date.parse(b.instantKst), iso: b.instantKst })).sort((a, b) => a.at - b.at);
  const start = Date.parse(ctx.range.startKst), end = Date.parse(ctx.range.endKstExclusive);
  const prev = all.filter(b => b.at <= start).at(-1), inside = all.filter(b => b.at > start && b.at < end), next = all.find(b => b.at >= end);
  return [prev ? `이 달 절입 ${prev.name} ${hm(prev.iso)} KST` : "", ...inside.map(b => `출생 범위 안 절입 ${b.name} ${hm(b.iso)} KST(월주 미확정 가능)`), next ? `다음 절입 ${next.name} ${hm(next.iso)} KST` : ""].filter(Boolean).join(" · ");
}

const DAYUN_ERROR: Record<string, string> = {
  DAYUN_GENDER_REQUIRED: "성별이 없어 대운을 세지 않음",
  DAYUN_UNCERTAIN: "출생시간 범위 안에서 대운이 하나로 정해지지 않음(정확한 시각 필요)",
  DAYUN_CALENDAR_MISMATCH: "대운 계산 확인 필요(엔진 기둥 불일치)",
  DAYUN_INVALID_INPUT: "입력값으로 대운을 셀 수 없음",
};

/**
 * 관리자 「계산 검증」 칸(운영 Q 7): 한 사람의 입력값과 엔진이 실제로 쓴 값을 그대로 보인다(다시 계산하거나 고치지 않는다).
 * 시간대 오프셋(tzdata)·태양시 보정·절입·대운 순역·교운 계산 과정·대운수(그때의 만 나이)·보정 없이 셌을 때의 시주.
 * 시간 모름·대략·성별 없음·입력 없음에서도 깨지지 않고 할 수 있는 줄만 낸다.
 */
export function calcCheck(person: unknown): CalcCheck {
  if (!person || typeof person !== "object") return { ok: false, reason: "입력 없음", rows: [] };
  const p = person as Record<string, unknown>;
  if (typeof p.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)) return { ok: false, reason: "생년월일 없음", rows: [] };
  const birthDate = p.birthDate;
  let ctx: BirthTimeCalculationContext;
  try {
    ctx = resolveBirthTimeCalculation({ birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, birthTimePrecision: p.birthTimePrecision, approximateBirthTimeSlot: p.approximateBirthTimeSlot });
  } catch { return { ok: false, reason: "계산 불가(입력 확인)", rows: [] }; }
  const rows: CalcRow[] = [];
  const calendar = p.calendarType === "lunar" || p.calendarType === "LUNAR" ? "음력(엔진만, 고객 경로는 양력만)" : "양력";
  rows.push({ label: "입력값", value: `${birthDate} ${calendar} · ${timeInputLine(p, ctx)}`, ...(ctx.birthTimePrecision === "unknown" ? { topic: "unknown" as const } : {}) });
  const basis = ctx.timeBasis;
  if (basis) {
    const exact = ctx.birthTimePrecision === "exact", start = Date.parse(ctx.range.startKst);
    // 시계 → UTC에 쓴 오프셋: 정확한 시각은 엔진 civilToUtc 그대로(없는 시각은 바뀌기 전 오프셋), 대략·모름은 범위 시작·끝 순간의 오프셋.
    const applied = exact ? civilToUtc(birthDate, String(p.birthTime), basis.zone).utcOffsetMinutes : basis.utcOffsetMinutes;
    const endOffset = exact ? applied : utcOffsetMinutesAt(Date.parse(ctx.range.endKstExclusive) - 60_000, basis.zone);
    const flags = [basis.ambiguous ? "서머타임이 끝나 두 번 있는 시각 → 앞(서머타임) 시각으로 셈" : "", basis.nonexistent ? `서머타임 시작 등으로 없는 시각 → 바뀌기 전 기준으로 셈(그 순간 이후 ${offsetLabel(basis.utcOffsetMinutes)})` : ""].filter(Boolean);
    rows.push({ label: "시간대(tzdata)", value: [offsetLabel(applied), endOffset !== applied ? `범위 끝 ${offsetLabel(endOffset)}` : "", ...flags].filter(Boolean).join(" · "), topic: "dst" });
    const note = solarTimeCorrectionNote(ctx);
    // 실제 태양시 = 엔진이 쓴 순간 + 경도×4분(균시차 끔). 없는 시각이면 표 아래 문구의 분과 다를 수 있어 함께 적는다.
    const solar = new Date(start + Math.round(basis.longitude * 240) * 1000).toISOString().slice(11, 16);
    rows.push({ label: "태양시 보정", value: ctx.birthTimePrecision === "unknown" ? "시간 모름 — 시주를 만들지 않아 보정을 쓰지 않음(일주는 입력 날짜)"
      : `${signed(Math.round(basis.solarTimeCorrectionMinutes))} (동경 ${basis.longitude}° 기준${basis.equationOfTime ? ", 균시차 포함" : ""})${exact ? ` · 시계 ${String(p.birthTime)} → 태양시 ${solar}` : ""}${note ? ` · 표 아래 문구 「${note}」` : ""}${ctx.birthTimePrecision === "approximate" ? " · 대략 시간대는 태양시 시진 그대로" : ""}`, topic: "solar" });
  } else rows.push({ label: "시간대(tzdata)", value: "기록 없음(옛 계산판)" });
  try { rows.push({ label: "절입", value: jieLine(ctx) || "-", topic: "jie" }); } catch { rows.push({ label: "절입", value: "계산 불가" }); }
  const input = { birthDate, birthTime: ctx.birthTimePrecision === "exact" ? String(p.birthTime) : "", birthTimeUnknown: ctx.birthTimePrecision === "unknown", approximateBirthTimeSlot: ctx.approximateBirthTimeSlot ?? "", gender: p.gender, name: typeof p.name === "string" ? p.name : "" };
  const d = calculateCustomerDayun(input), t = calculateTraditionalDaeunsu(input);
  if (!d.ok) rows.push({ label: "대운", value: DAYUN_ERROR[d.error] ?? d.error });
  else {
    const first = d.value.cycles[0], x = dayunStartManAge(birthDate, first);
    const yearStem = ctx.confirmed.year?.stem ?? "", yang = "甲丙戊庚壬".includes(yearStem);
    rows.push({ label: "대운 방향", value: `${d.value.direction === "forward" ? "순행" : "역행"} (년간 ${yearStem}${KO[yearStem] ? `(${KO[yearStem]})` : ""} ${yang ? "양" : "음"} · ${p.gender === "MALE" ? "남" : "여"} — 양남·음녀 순행, 음남·양녀 역행)` });
    const jie = t.ok ? `${JIE_KO[t.value.jieName] ?? t.value.jieName} ${hm(t.value.jieKst)} KST` : "";
    const span = t.ok ? `${t.value.days}일 ${t.value.hours}시간` : "";
    const step = t.ok ? (t.value.direction === "forward" ? `출생 → 다음 절입 ${jie}까지 ${span}` : `직전 절입 ${jie} → 출생까지 ${span}`) : "";
    const startAt = first.startSolarKst ? `${hm(first.startSolarKst)} KST` : `${hm(first.startSolarRange.earliestKst)} ~ ${hm(first.startSolarRange.latestKst)} KST(가운데 ${hm(kstIso(dayunStartMs(first)))})`;
    rows.push({ label: "대운 시작 계산", value: [step, `첫 대운 ${show(first)} 시작 ${startAt}(엔진 정밀 계산)`, `대운수 ${x} = 그때의 만 나이`].filter(Boolean).join(" → "), topic: "age" });
    // 운영 Q 8-1 전에 만든 책의 대운수: 최종 A-3 뒤는 날수 ÷ 3, 그보다 앞선 책은 첫 대운 시작 해 − 출생 해. 저장된 책은 바뀌지 않는다.
    const oldYear = first.startYear - Number(birthDate.slice(0, 4));
    if (t.ok) rows.push({ label: "예전 책의 대운수", value: `${t.value.minMax[0] === t.value.minMax[1] ? t.value.daeunsu : `${t.value.daeunsu}(범위 ${t.value.minMax.join("~")})`} — 옛 셈법(날수 ÷ 3)${oldYear !== t.value.daeunsu ? ` · 더 앞선 책은 ${oldYear}(첫 대운 시작 해 − 출생 해)` : ""}. 이 변경 전 책에는 이 값이 모든 대운 줄에 같게 적혀 있다`, topic: "age" });
    rows.push({ label: "대운 목록(새 책 표기)", value: d.value.cycles.slice(0, 9).map((c, i) => dayunLabel(c, birthDate, d.value.cycles[i + 1]).line).join(" / ") });
  }
  if (ctx.birthTimePrecision === "exact" && ctx.confirmed.hour) {
    try {
      const raw = getDayHourPillarsFromSolarTime(civilWallClockMs(birthDate, String(p.birthTime)), DEFAULT_SAJU_TIME_POLICY.ziHourRule);
      const sameHour = raw.hour.stem === ctx.confirmed.hour.stem && raw.hour.branch === ctx.confirmed.hour.branch;
      const dayDiff = ctx.confirmed.day && (raw.day.stem !== ctx.confirmed.day.stem || raw.day.branch !== ctx.confirmed.day.branch) ? ` · 일주도 ${show(raw.day)}` : "";
      rows.push({ label: "보정 없이 셌다면", value: `시계 시각 그대로면 시주 ${show(raw.hour)}${dayDiff} (지금 계산 시주 ${show(ctx.confirmed.hour)} · ${sameHour && !dayDiff ? "같음" : "다름"})`, topic: "solar" });
    } catch { /* 계산 불가면 줄을 뺀다 */ }
  }
  return { ok: true, rows };
}
