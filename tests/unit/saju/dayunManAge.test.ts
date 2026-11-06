import { createHash } from "node:crypto";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { dayunOf, labelOf } from "@/lib/brief/chart";
import { dayunLabel, dayunStartManAge, dayunStartMs, personDaeunsu } from "@/lib/brief/labels";
import { cycleSummary } from "@/lib/brief/timeline";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "@/lib/saju/birthTimePrecisionTypes";
import { calculateCustomerDayun, type CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { calculateTraditionalDaeunsu } from "@/lib/saju/traditionalDaeunsu";

// 운영 Q 8-1: 대운 나이 표기 통일(덕짱님 결정 「한 사람에 한 숫자」: 대운수 = 첫 대운이 시작될 때의 실제 만 나이, 「만 X~Y세」도 그 값에서). 표기만 바꾸고 계산은 그대로인지 3,000명으로 본다.
// 무작위 사람(씨앗 고정): 1930~2025년 생일, 정확 75% · 대략 20% · 모름 5%, 남녀 반반. 모름은 하루 1,440분을 모두 세서 느려 비율을 낮췄다.
const DAY = 86_400_000;
function mulberry32(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
type Person = { birthDate: string; birthTime: string; birthTimeUnknown: boolean; approximateBirthTimeSlot: string; gender: "MALE" | "FEMALE"; name: string };
function seededPeople(n = 3000, seed = 20261106): Person[] {
  const rand = mulberry32(seed), start = Date.UTC(1930, 0, 1), days = (Date.UTC(2026, 0, 1) - start) / DAY;
  return Array.from({ length: n }, () => {
    const birthDate = new Date(start + Math.floor(rand() * days) * DAY).toISOString().slice(0, 10);
    const kind = rand(), minute = Math.floor(rand() * 1440), slot = BIRTH_TIME_SLOT_DEFINITIONS[Math.floor(rand() * 12)].value, gender = rand() < 0.5 ? "MALE" as const : "FEMALE" as const;
    const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
    return kind < 0.75 ? { birthDate, birthTime: time, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, name: "시험" }
      : kind < 0.95 ? { birthDate, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: slot, gender, name: "시험" }
      : { birthDate, birthTime: "", birthTimeUnknown: true, approximateBirthTimeSlot: "", gender, name: "시험" };
  });
}

/** 엔진 출력 한 줄: 원국 네 기둥(확정·후보·시간 기준), 대운 순역·간지·교운 시각(정확·범위), 전통 날수 셈. 표기는 넣지 않는다. */
function engineLine(p: Person, d: ReturnType<typeof calculateCustomerDayun>): string {
  const ctx = resolveBirthTimeCalculation(p);
  const pillars = (["year", "month", "day", "hour"] as const).map(k => `${ctx.confirmed[k] ? ctx.confirmed[k]!.stem + ctx.confirmed[k]!.branch : "-"}[${ctx.candidates[k].map(x => x.stem + x.branch).join(",")}]`).join(" ");
  const basis = ctx.timeBasis ? `${ctx.timeBasis.utcOffsetMinutes}/${ctx.timeBasis.solarTimeCorrectionMinutes}/${ctx.range.startKst}~${ctx.range.endKstExclusive}` : "-";
  const t = calculateTraditionalDaeunsu(p);
  const dayun = d.ok ? `${d.value.direction} ${d.value.cycles.map(c => `${c.index}:${c.ganji}:${c.startYear}-${c.endYear}:${c.startAge}:${c.startSolarKst ?? "-"}:${c.startSolarRange.earliestKst}~${c.startSolarRange.latestKst}`).join(" ")}` : d.error;
  const trad = t.ok ? `${t.value.direction}:${t.value.days}:${t.value.hours}:${t.value.jieName}:${t.value.jieKst}:${t.value.daeunsu}:${t.value.minMax.join("-")}` : t.error;
  return [JSON.stringify(p), pillars, basis, dayun, trad].join(" | ");
}

/** 바꾸기 전(f35f2148, 이 브랜치 시작점)에 같은 3,000명으로 잰 값. 계산이 1바이트라도 달라지면 이 값이 바뀐다. */
const BEFORE_SHA256 = "81f0f52ab0ed5fff8b8ad4659a1001ed7226b759429ac2b7ce7b26b49daca203";
const BEFORE_COUNTS = { people: 3000, exact: 2275, approximate: 609, unknown: 116, dayunOk: 2937 };

let cache: { people: Person[]; dayun: ReturnType<typeof calculateCustomerDayun>[] } | undefined;
const population = () => (cache ??= (() => { const people = seededPeople(); return { people, dayun: people.map(p => calculateCustomerDayun(p)) }; })());

/** 시험 쪽 셈(구현과 다른 식): 시작 때의 한국 날짜 yyyymmdd − 생일 yyyymmdd를 10000으로 나눈 몫. */
const kstYmd = (ms: number) => Number(new Date(ms + 9 * 3_600_000).toISOString().slice(0, 10).replaceAll("-", ""));
const trueManAge = (birthDate: string, c: CustomerDayunCycle) => {
  const ms = c.startSolarKst ? Date.parse(c.startSolarKst) : (Date.parse(c.startSolarRange.earliestKst) + Date.parse(c.startSolarRange.latestKst)) / 2;
  return Math.floor((kstYmd(ms) - Number(birthDate.replaceAll("-", ""))) / 10000);
};

describe("8-1 계산 불변: 3,000명 엔진 출력 해시가 바꾸기 전과 같다", () => {
  it("원국 네 기둥·대운 간지 순서·순역·교운 시각", { timeout: 300_000 }, () => {
    const { people, dayun } = population();
    const lines = people.map((p, i) => engineLine(p, dayun[i]));
    const sha = createHash("sha256").update(lines.join("\n")).digest("hex");
    const counts = { people: people.length, exact: people.filter(p => p.birthTime).length, approximate: people.filter(p => p.approximateBirthTimeSlot).length, unknown: people.filter(p => p.birthTimeUnknown).length,
      dayunOk: dayun.filter(d => d.ok).length };
    expect(counts).toEqual(BEFORE_COUNTS);
    expect(sha).toBe(BEFORE_SHA256);
  });
});

describe("8-1 대운수 = 한 사람에 한 숫자(첫 대운이 시작될 때의 실제 만 나이), 「만 X~Y세」도 그 값에서(3,000명, 대운마다)", () => {
  it("표기 함수·브리프 경로(labelOf·cycleSummary) 모두 어긋남 0, X는 그 대운이 시작될 때의 실제 만 나이와도 같다", { timeout: 300_000 }, () => {
    const { people, dayun } = population();
    let cycles = 0, mismatches = 0;
    const examples: string[] = [];
    people.forEach((p, i) => {
      const d = dayun[i];
      if (!d.ok) return;
      const base = personDaeunsu(p.birthDate, d.value.cycles);
      const info = { cycles: d.value.cycles, daeunsu: base };
      const summary = cycleSummary(info, 1900, 2200, 2026, () => "比肩");
      for (const c of d.value.cycles) {
        cycles++;
        const next = d.value.cycles.find(x => x.index === c.index + 1);
        const x = base! + 10 * (c.index - 1), l = dayunLabel(c, base, next), viaBrief = labelOf(info, c), row = summary.find(s => s.years === `${c.startYear}~${c.endYear}`);
        const ok = d.value.cycles[0].index === 1 && base === trueManAge(p.birthDate, d.value.cycles[0]) && x === trueManAge(p.birthDate, c)
          && l.daeunsu === base && l.ages === `만 ${x}~${x + 9}세` && l.line.endsWith(`(대운수 ${base})`)
          && viaBrief.line === l.line && viaBrief.ages === l.ages && row?.label === l.line && row?.ages === l.ages;
        if (!ok) { mismatches++; if (examples.length < 5) examples.push(`${JSON.stringify(p)} ${c.ganji} ${l.line} ${l.ages} base ${base} 실제 ${trueManAge(p.birthDate, c)}`); }
      }
    });
    expect(examples).toEqual([]);
    expect({ cycles, mismatches }).toEqual({ cycles: BEFORE_COUNTS.dayunOk * 12, mismatches: 0 });
  });
  it("브리프의 dayunOf도 같은 대운수를 센다(100명마다 1명)", { timeout: 300_000 }, () => {
    const { people, dayun } = population();
    const sample = people.map((p, i) => ({ p, d: dayun[i] })).filter((x, i) => x.d.ok && i % 100 === 0);
    expect(sample.length).toBeGreaterThan(20);
    for (const { p, d } of sample) if (d.ok) expect(dayunOf(p).daeunsu, p.birthDate).toBe(personDaeunsu(p.birthDate, d.value.cycles));
  });

  it("생일 앞뒤·2월 29일생·대략 범위 가운데", () => {
    const c = (startSolarKst: string | null, earliestKst = startSolarKst ?? "", latestKst = startSolarKst ?? "") => ({ startSolarKst, startSolarRange: { earliestKst, latestKst } });
    expect(dayunStartManAge("1999-07-31", c("2027-05-12T10:00:00+09:00"))).toBe(27);
    expect(dayunStartManAge("1999-07-31", c("2027-07-31T00:00:00+09:00"))).toBe(28);
    expect(dayunStartManAge("1999-07-31", c("2027-07-30T23:59:00+09:00"))).toBe(27);
    // 2월 29일생: 평년에는 3월 1일에 한 살(2월 28일은 아직).
    expect(dayunStartManAge("2000-02-29", c("2009-02-28T12:00:00+09:00"))).toBe(8);
    expect(dayunStartManAge("2000-02-29", c("2009-03-01T00:00:00+09:00"))).toBe(9);
    // 대략·모름: 범위 가운데(dayunStartMs)로 센다.
    const range = c(null, "2027-07-25T00:00:00+09:00", "2027-08-10T00:00:00+09:00");
    expect(new Date(dayunStartMs(range) + 9 * 3_600_000).toISOString().slice(0, 10)).toBe("2027-08-02");
    expect(dayunStartManAge("1999-07-31", range)).toBe(28);
  });

  it("브리프 지금 대운·다음 대운·대운 지도와 정답지가 같은 값(무작위 24명, 대운 상품)", { timeout: 300_000 }, () => {
    const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
    const { people, dayun } = population();
    const sample = people.map((p, i) => ({ p, d: dayun[i] })).filter(x => x.d.ok && !x.p.birthTimeUnknown && Number(x.p.birthDate.slice(0, 4)) <= 2015).filter((_, i) => i % 97 === 0).slice(0, 24);
    expect(sample.length).toBe(24);
    for (const { p, d } of sample) {
      if (!d.ok) continue;
      const person = { ...p, mbtiType: "INFJ" as never, context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "" } } as never;
      const input = { product: "major_fortune" as const, baseDate: "2026-11-06", baseAt: "2026-11-06T03:00:00.000Z", person };
      const brief = buildBrief(input, k), sheet = buildFactSheet(input as never, brief, k);
      const want = (c: CustomerDayunCycle) => trueManAge(p.birthDate, c);
      const byYears = (years: string) => d.value.cycles.find(c => `${c.startYear}~${c.endYear}` === years)!;
      const base = want(d.value.cycles[0]);
      const cd = brief.chart.currentDayun;
      if (cd) {
        const c = byYears(cd.years);
        expect([cd.label?.endsWith(`(대운수 ${base})`), cd.ages], p.birthDate).toEqual([true, `만 ${want(c)}~${want(c) + 9}세`]);
        if (cd.next) expect(cd.next.label?.endsWith(`(대운수 ${base})`), p.birthDate).toBe(true);
      }
      for (const row of brief.timeline?.cycles ?? []) { const c = byYears(row.years); expect([row.label?.endsWith(`(대운수 ${base})`), row.ages], p.birthDate).toEqual([true, `만 ${want(c)}~${want(c) + 9}세`]); }
      const facts = sheet.people[0].dayun;
      expect(facts.cycles.map(c => c.manStartAge), p.birthDate).toEqual(d.value.cycles.map(want));
      expect(facts.number).toBe(base);
      // 사실 검사: 대운 줄 그대로는 통과, 다른 숫자(옛 셈법 등)를 붙이면 걸린다. 힌트 이름은 「첫 대운이 시작될 때의 만 나이」.
      const ctx = factCtxOf(sheet, k, [["시험"]]);
      const [c1, c2] = d.value.cycles;
      const line2 = dayunLabel(c2, base, d.value.cycles[2]).line;
      expect(factCheck(`${line2}로 두 번째 대운이 시작돼요.`, ctx), p.birthDate).toBeNull();
      expect(factCheck(`${dayunLabel(c1, base, c2).line.replace(/\(대운수 \d+\)/, `(대운수 ${base + 1})`)}로 첫 대운이 시작돼요.`, ctx)).toMatchObject({ rule: "fact_ganji", detail: `대운수는 ${base}(첫 대운이 시작될 때의 만 나이)` });
    }
  });
});
