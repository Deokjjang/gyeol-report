/**
 * ZW-1 1부 · 음력 원천(덕짱 결정 2026-11-24: 자미는 한국 음력 KASI, 사주 엔진 음력 경로는 그대로).
 * - 1900~2050년 매일 「양력 → 한국 음력 → 사주 엔진 음력 입력 경로 → 양력」 왕복이 다른 날(1,978일, 그중 오류 121일) 목록을 고정한다.
 * - 사주 엔진 음력 경로가 고객 경로(입력 · 결제 · 발행)에서 닫혀 있음을 확인한다.
 * - 한국 음력 변환기를 저장소 KST 합삭 오라클 차이 목록 · KASI 조회값과 맞댄다.
 * - 윤달 규칙(effectiveLunarMonth)과 윤12월 후반 날 수.
 * 남은 일(docs/ziwei/zw.md): 음력 입력을 여는 명령에서 사주 엔진도 KASI로 바꾸고 이 목록을 0으로 만든다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lunarToSolarDate } from "@/lib/saju/solarTerms";
import { validateReportRequest } from "@/lib/validation/reportRequest";
import { effectiveLunarMonth, koreanLunarToSolar, solarToKoreanLunar, ZIWEI_SOLAR_RANGE } from "@/lib/ziwei/lunar";

const ROOT = resolve(__dirname, "../../..");
const DAY = 86_400_000;
const days = (from: string, to: string) => { const out: string[] = []; for (let t = Date.parse(`${from}T00:00:00Z`); t <= Date.parse(`${to}T00:00:00Z`); t += DAY) out.push(new Date(t).toISOString().slice(0, 10)); return out; };
const ALL = days(ZIWEI_SOLAR_RANGE.min, ZIWEI_SOLAR_RANGE.max);

describe("음력 원천 왕복(목록 고정)", () => {
  it("1900-01-31~2050-12-31 왕복이 다른 날 = 고정 목록(1,978일 · 오류 121일)", () => {
    const fixture = JSON.parse(readFileSync(resolve(ROOT, "tests/fixtures/ziwei/lunar-roundtrip-1900-2050.json"), "utf8")) as { days: number; mismatches: number; errors: number; rows: string[] };
    const rows: string[] = [];
    let errors = 0;
    for (const iso of ALL) {
      const l = solarToKoreanLunar(iso);
      const lunarIso = `${l.year}-${String(l.month).padStart(2, "0")}-${String(l.day).padStart(2, "0")}`;
      let back: string;
      try { back = lunarToSolarDate(lunarIso, l.leap); } catch { back = "ERR"; errors++; }
      if (back !== iso) rows.push(`${iso}|${lunarIso}${l.leap ? "L" : ""}|${back}`);
    }
    expect(ALL.length).toBe(fixture.days);
    expect({ mismatches: rows.length, errors }).toEqual({ mismatches: 1978, errors: 121 });
    expect(rows).toEqual(fixture.rows);
  }, 300_000);
});

describe("사주 엔진 음력 경로는 고객 경로에서 닫혀 있다", () => {
  const src = (p: string) => readFileSync(resolve(ROOT, p), "utf8");
  const gitFiles = (): string[] => {
    const out: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
        const p = `${dir}/${name.name}`;
        if (name.isDirectory()) { if (p !== "src/lib/report-knowledge") walk(p); } else if (/\.(ts|tsx)$/.test(name.name)) out.push(p);
      }
    };
    walk("src");
    return out;
  };
  const files = gitFiles();

  it("음력 → 양력 변환(lunarToSolarDate)은 calculateSaju 한 곳에서만 부른다", () => {
    const callers = files.filter(f => /lunarToSolarDate\(/.test(src(f)) && !/export function lunarToSolarDate/.test(src(f)));
    expect(callers).toEqual(["src/lib/saju/calculateSaju.ts"]);
  });

  it("calculateSaju를 부르는 고객 경로는 모두 calendarType SOLAR를 박아 두거나 요청 검사를 지난 값을 쓴다", () => {
    const loose: string[] = [];
    for (const f of files) {
      if (f.startsWith("src/lib/saju/")) continue;
      const text = src(f);
      for (const m of text.matchAll(/calculateSaju\(\{/g)) {
        // 여는 괄호부터 짝이 맞는 닫는 괄호까지가 인자다.
        let depth = 0, end = m.index! + "calculateSaju".length;
        for (; end < text.length; end++) { if (text[end] === "(") depth++; else if (text[end] === ")" && --depth === 0) break; }
        const arg = text.slice(m.index!, end + 1);
        if (!arg.includes('calendarType: "SOLAR"')) loose.push(`${f}@${m.index}`);
      }
      for (const m of text.matchAll(/calculateSaju\((?!\{)/g)) if (f !== "src/lib/report/pipeline.ts") loose.push(`${f}@${m.index}(변수 인자)`);
    }
    expect(loose).toEqual([]);
    // 궁합 계산(calculateCompatibilitySaju)도 SOLAR를 박아 둔다.
    expect(src("src/lib/report-generation/compatibilityGenerationHandler.ts")).toMatch(/export function calculateCompatibilitySaju[\s\S]{0,900}calendarType: "SOLAR"/);
  });

  it("요청 검사(pipeline 경로)는 양력 아닌 입력을 거절한다", () => {
    const r = validateReportRequest({ birthDate: "1990-01-01", birthTime: "10:00", birthTimeUnknown: false, calendarType: "LUNAR", gender: "MALE", timezone: "Asia/Seoul", mbtiType: "INTJ" } as never);
    expect(r.ok).toBe(false);
    expect(JSON.stringify(r)).toContain("CALENDAR_TYPE_UNSUPPORTED");
  });

  it("입력 화면은 양력만 보낸다", () => {
    const page = src("src/app/report/new/page.tsx");
    const inputs = [...page.matchAll(/name="calendarType"[^>]*/g)].map(m => m[0]);
    expect(inputs.length).toBeGreaterThan(0);
    for (const i of inputs) expect(i).toContain('value="SOLAR"');
  });
});

describe("한국 음력 변환기(KASI) 대조", () => {
  it("KASI 조회값: 1997 설 02-08 · 2027 설 02-07 · 1965년 음력 9월 1일 = 1965-09-25(평달)", () => {
    expect(koreanLunarToSolar({ year: 1997, month: 1, day: 1, leap: false })).toBe("1997-02-08");
    expect(koreanLunarToSolar({ year: 2027, month: 1, day: 1, leap: false })).toBe("2027-02-07");
    expect(koreanLunarToSolar({ year: 1965, month: 9, day: 1, leap: false })).toBe("1965-09-25");
    expect(solarToKoreanLunar("1997-02-07")).toEqual({ year: 1996, month: 12, day: 30, leap: false });
  });

  it("저장소 KST 합삭 오라클 차이 43개월: 40개월 오라클과 같음, 3개월은 이미 알려진 오라클 쪽 문제", () => {
    const rows = readFileSync(resolve(ROOT, "docs/v5/oracle-lunar-differences.csv"), "utf8").trim().split("\n").slice(1).map(l => l.split(","));
    expect(rows.length).toBe(43);
    const other: string[] = [];
    for (const [lunar, , oracle] of rows) {
      const [y, m, d] = lunar.split("-").map(Number);
      const s = koreanLunarToSolar({ year: y, month: m, day: d, leap: false });
      if (s !== oracle) other.push(`${lunar}:${s}`);
    }
    // 1965-09: KASI 조회(astro.kasi.re.kr) 1965-09-25 — 오라클 쪽 오류. 1984-12 · 1985-01: manseryeok-policy.md에 오라클 한계로 기록.
    expect(other).toEqual(["1965-09-01:1965-09-25", "1984-12-01:1985-01-21", "1985-01-01:1985-02-20"]);
  });
});

describe("윤달 규칙(lunar.ts effectiveLunarMonth 한 곳)", () => {
  it("1~15일은 그 달, 16일부터 다음 달, 평달은 그대로", () => {
    expect(effectiveLunarMonth({ year: 2020, month: 4, day: 15, leap: true })).toEqual({ month: 4, rolledToNextYear: false });
    expect(effectiveLunarMonth({ year: 2020, month: 4, day: 16, leap: true })).toEqual({ month: 5, rolledToNextYear: false });
    expect(effectiveLunarMonth({ year: 2020, month: 4, day: 16, leap: false })).toEqual({ month: 4, rolledToNextYear: false });
    expect(effectiveLunarMonth({ year: 2000, month: 12, day: 16, leap: true })).toEqual({ month: 1, rolledToNextYear: true });
  });

  it("1900~2050년 한국 음력 윤12월 16일 이후 날 수 = 0(규칙은 기록만)", () => {
    let leap12Late = 0, leapDays = 0;
    for (const iso of ALL) { const l = solarToKoreanLunar(iso); if (l.leap) leapDays++; if (l.leap && l.month === 12 && l.day > 15) leap12Late++; }
    expect(leap12Late).toBe(0);
    expect(leapDays).toBeGreaterThan(1500);
  }, 120_000);
});
