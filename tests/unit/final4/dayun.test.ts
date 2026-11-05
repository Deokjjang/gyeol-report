import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { BriefPersonInput } from "@/lib/brief/buildBrief";
import { currentDayunAt, dayunLabel, remainingKo } from "@/lib/brief/labels";
import { calculateCustomerDayun, calculateTraditionalDaeunsu, daeunsuFromDays } from "@/lib/saju/customerDayun";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { buildWriterPrompt } from "@/lib/writer/prompt";

// 최종 A-3·4·5: 전통 대운수, 교운 연·월 기간, 교운 시각으로 고르는 지금 대운. 호출 0.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const P = (name: string, birthDate: string, birthTime: string, gender: "MALE" | "FEMALE", mbtiType = "INFJ"): BriefPersonInput =>
  ({ name, gender, birthDate, birthTime, birthTimeUnknown: false, mbtiType: mbtiType as never, context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "" } });
const PEOPLE = {
  장덕민: P("장덕민", "1999-07-31", "08:27", "MALE"), 장소담: P("장소담", "1996-12-06", "14:15", "FEMALE"), 전성민: P("전성민", "1992-11-09", "19:45", "MALE"),
  서하은: P("서하은", "2004-12-23", "13:05", "FEMALE"), 윤도윤: P("윤도윤", "1973-04-16", "06:19", "FEMALE"), 남태민: P("남태민", "1984-02-18", "23:45", "MALE"),
  백정우: P("백정우", "1989-07-12", "22:48", "MALE"), 오지안: P("오지안", "1986-08-09", "08:14", "MALE"), 최지우: P("최지우", "2006-09-07", "16:30", "FEMALE"),
};
const inp = (p: BriefPersonInput) => ({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: p.gender, name: p.name });

describe("A-3 전통 대운수(출생~절입 날수 ÷ 3, 나머지 2일 올림)", () => {
  it("나머지 0·1일 버림, 2일 올림, 1~10", () => {
    expect([15, 16, 17, 23, 29, 30, 31, 0, 1].map(daeunsuFromDays)).toEqual([5, 5, 6, 8, 10, 10, 10, 1, 1]);
  });
  it("9명 전후 — 서하은만 6 → 5(대설 2004-12-07 03:48부터 16일 9시간)", () => {
    const want = { 장덕민: [8, 8], 장소담: [10, 10], 전성민: [9, 9], 서하은: [6, 5], 윤도윤: [6, 6], 남태민: [5, 5], 백정우: [2, 2], 오지안: [10, 10], 최지우: [10, 10] } as const;
    for (const [name, p] of Object.entries(PEOPLE)) {
      const d = calculateCustomerDayun(inp(p)), t = calculateTraditionalDaeunsu(inp(p));
      if (!d.ok || !t.ok) throw new Error(name);
      expect([d.value.cycles[0].startYear - Number(p.birthDate.slice(0, 4)), t.value.daeunsu], name).toEqual([...want[name as keyof typeof want]]);
    }
    const s = calculateTraditionalDaeunsu(inp(PEOPLE.서하은));
    expect(s.ok && s.value).toMatchObject({ days: 16, hours: 9, jieName: "大雪", direction: "reverse", daeunsu: 5 });
  });
  it("교운 시각(정밀 계산)은 그대로 — 서하은 2010-06-08 23:05", () => {
    const d = calculateCustomerDayun(inp(PEOPLE.서하은));
    expect(d.ok && d.value.cycles[0].startSolarKst).toBe("2010-06-08T23:05:00+09:00");
  });
  it("브리프·부록 표기: 서하은 갑술 대운 대운수 5(모든 대운 줄 같은 값), 정답지 number 5", () => {
    const brief = buildBrief({ product: "saju_mbti_full", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: PEOPLE.서하은 }, k);
    expect(brief.chart.currentDayun?.label).toBe("갑술 대운: 2020년 6월 무렵부터 (대운수 5)");
    const sheet = buildFactSheet({ product: "saju_mbti_full", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: PEOPLE.서하은 } as never, brief, k);
    expect(sheet.people[0].dayun.number).toBe(5);
  });
});

describe("A-4 본문 대운 기간은 교운 연·월(부록과 같은 값)", () => {
  const brief = buildBrief({ product: "career_money_study", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: { ...PEOPLE.윤도윤, context: { relationshipStatus: "single", jobStatus: "job_seeker", detailJob: "회계 사무직 재취업 준비" } } }, k);
  const cd = brief.chart.currentDayun!;
  it("윤도윤 신유 대운: 2019년 11월 무렵부터 2029년 11월 무렵까지, 남은 기간 교운 시각 기준", () => {
    expect(cd.label).toBe("신유 대운: 2019년 11월 무렵부터 (대운수 6)");
    expect(cd.period).toBe("2019년 11월 무렵부터 2029년 11월 무렵까지");
    expect(cd.until).toBe("2029년 11월 무렵까지");
    expect(cd.phase).toMatchObject({ yearIndex: 8, yearsLeft: 3, remaining: "약 3년(2029년 11월 무렵까지)" });
  });
  it("작가 브리프에는 연도 구간(years)이 없고 기간·근거 줄이 교운 연·월", () => {
    const text = buildWriterPrompt(brief, { knowledge: k }).user;
    expect(text).not.toMatch(/2019~2028/);
    expect(text).toContain("2019년 11월 무렵부터 2029년 11월 무렵까지");
  });
  it("검사: 「신유 대운은 2028년까지」·「올해까지」를 잡고 「2029년 11월 무렵까지」는 통과", () => {
    const sheet = buildFactSheet({ product: "career_money_study", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: PEOPLE.윤도윤 } as never, brief, k);
    const ctx = factCtxOf(sheet, k, [["윤도윤"]]);
    expect(factCheck("지금 지나는 신유 대운은 2028년까지 이어져요.", ctx)?.rule).toBe("fact_dayun");
    expect(factCheck("지금의 대운은 올해까지 이어지는 이 10년이에요.", ctx)?.rule).toBe("fact_dayun");
    expect(factCheck("지금 지나는 신유 대운은 2029년 11월 무렵까지 이어져요.", ctx)).toBeNull();
  });
});

describe("A-5 지금 대운은 교운 시각과 기준 시각(발행 시각)을 비교해 고른다 — 최지우(교운 2026-11-26 20:30)", () => {
  const at = (iso: string) => buildBrief({ product: "saju_mbti_full", baseDate: iso.slice(0, 10), baseAt: iso, person: PEOPLE.최지우 }, k).chart.currentDayun!;
  it("2026-11-05 발행: 갑오가 아니라 을미, 마지막 해, 다음 갑오", () => {
    const cd = at("2026-11-05T03:00:00.000Z");
    expect(cd.ganji.hangul).toBe("을미");
    expect(cd.phase).toMatchObject({ yearIndex: 10, label: "마지막 해", yearsLeft: 0, remaining: "한 달이 안 남음(2026년 11월 무렵까지)" });
    expect(cd.next?.label).toBe("갑오 대운: 2026년 11월 무렵부터 (대운수 10)");
  });
  it("교운 직전·직후(2026-11-26 20:29 / 20:31 KST)", () => {
    expect(at("2026-11-26T11:29:00.000Z").ganji.hangul).toBe("을미");
    expect(at("2026-11-26T11:31:00.000Z").ganji.hangul).toBe("갑오");
  });
  it("정답지 current도 같은 기준", () => {
    const brief = buildBrief({ product: "saju_mbti_full", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: PEOPLE.최지우 }, k);
    const sheet = buildFactSheet({ product: "saju_mbti_full", baseDate: "2026-11-05", baseAt: "2026-11-05T03:00:00.000Z", person: PEOPLE.최지우 } as never, brief, k);
    const cur = sheet.people[0].dayun.cycles.find(c => c.index === sheet.people[0].dayun.current)!;
    expect(cur.ganjiKo).toBe("을미");
  });
  it("도움 함수: 첫 대운 전·남은 기간 말", () => {
    const d = calculateCustomerDayun(inp(PEOPLE.최지우));
    if (!d.ok) throw new Error();
    expect(currentDayunAt(d.value.cycles, Date.parse("2010-01-01T00:00:00+09:00"))).toBeUndefined();
    expect(dayunLabel(d.value.cycles[0], 10, d.value.cycles[1]).period).toBe("2016년 11월 무렵부터 2026년 11월 무렵까지");
    expect(remainingKo(Date.parse("2026-01-10T00:00:00+09:00"), Date.parse("2029-03-05T00:00:00+09:00"))).toBe("약 3년 1개월");
    expect(remainingKo(Date.parse("2026-01-10T00:00:00+09:00"), Date.parse("2026-06-15T00:00:00+09:00"))).toBe("약 5개월");
  });
});
