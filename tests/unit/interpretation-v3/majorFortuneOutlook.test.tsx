import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { createMajorFortuneV3, validateMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as payload } from "../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { majorFortuneV3CustomerText } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import { MajorFortuneReportV3View } from "../../../src/app/reports/[reportId]/MajorFortuneReportV3View";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { careerFixture, CAREER_V3_FIXTURES } from "./careerFixtures";

const now = () => new Date("2026-09-29T03:00:00Z");
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const leaks = /canonical-|sourceRefs|evidenceRefs|customerDayun:|mbti:[A-Z]{4}:|career_shift|money_responsibility|metal|water|undefined|겁재은|정재은|결과이|것으로으로|가능성이 있습니다/;

it("keeps canonical calculations and F3 density while extending to past3 + current + future10", async () => {
  const r = (await createMajorFortuneV3(payload, { now }))!, old = (await createMajorFortuneV3(payload, { now, edition: "legacy-horizon" }))!;
  expect(r.evidencePacket).toEqual(old.evidencePacket);
  expect(r.draft.version).toBe("major_fortune_v3.0-editorial.4");
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
  expect(validateNewProductPublication("major_fortune", r.draft, r.evidencePacket, payload).ok).toBe(true);
  expect(r.draft.editorialYears.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
  expect(r.draft.editorialYears.filter(y => y.timePosition === "past")).toHaveLength(3);
  expect(r.draft.editorialYears.filter(y => y.isCurrentYear)).toHaveLength(1);
  const future = r.draft.editorialYears.filter(y => y.timePosition === "future");
  expect(future).toHaveLength(10); expect(new Set(future.map(y => y.title)).size).toBe(10);
  const oldMinimum = Math.min(...old.draft.editorialYears.filter(y => y.timePosition === "future").map(y => y.paragraphs.join("").length));
  for (const y of r.draft.editorialYears) {
    expect(y.ageLabel).toBe(`${r.evidencePacket.currentAge + y.year - r.evidencePacket.currentYear}세`);
    const canonical = getAnnualGanjiInfo(y.year);
    expect(y.ganji).toBe(canonical.ganji); expect(y.tenGod).toBe(getTenGodForStemPair(r.evidencePacket.dayMaster, canonical.stem));
    if (y.timePosition !== "past") {
      expect(y.paragraphs.join("").length).toBeGreaterThanOrEqual(old.draft.editorialYears.find(o => o.year === y.year)?.paragraphs.join("").length ?? oldMinimum);
      expect(y.paragraphs.at(-1)).not.toMatch(/^ENTJ(?:는|의|에게)/);
      expect(y.paragraphs.length).toBeGreaterThanOrEqual(6);
    }
  }
  const ids = r.draft.narrativeAudit!.map(a => a.traitId);
  expect(new Set(ids).size).toBe(ids.length); expect(ids.length).toBeGreaterThanOrEqual(14);
  expect(r.draft.narrativeAudit!.filter(a => a.section.startsWith("year-"))).toHaveLength(11);
  expect(ids.some(id => id.includes(":identity:"))).toBe(true);
  const transition = r.draft.horizon!.transitions[0];
  expect([transition.before.ganji, transition.after.ganji, transition.before.tenGod, transition.after.tenGod]).toEqual(["辛亥", "壬子", "식신", "정재"]);
  expect(transition.startSolarKst).toBe(old.draft.horizon!.transitions[0].startSolarKst);
  expect(transition.paragraphs.join(" ")).toMatch(/일의 질문/); expect(transition.paragraphs.join(" ")).toMatch(/돈을 보는 기준/);
  expect(transition.paragraphs.join(" ")).toMatch(/사람에게 기대/); expect(transition.paragraphs.join(" ")).toMatch(/가까워지게/);
  const text = majorFortuneV3CustomerText(r.draft), html = renderToStaticMarkup(createElement(MajorFortuneReportV3View, r));
  expect(text).not.toMatch(leaks); expect(html).not.toMatch(leaks);
  expect(html).toContain("data-mbti-detail"); expect(html).toContain("세는나이");
  for (const y of r.draft.editorialYears) {
    expect(html).toContain(`${y.year}년 · ${y.ageLabel}`);
    expect(html).toContain(`${y.year} · ${y.ageLabel} · ${y.ganji}`);
  }
  expect(r.draft.opening[0]).toContain("남은 건 뭐지");
  expect(r.draft.finale.length).toBeGreaterThanOrEqual(4); expect(r.draft.finale.length).toBeLessThanOrEqual(6);
  const snapshot = createProductPreviewSnapshot({ reportId: "f4-gaon", createdAtIso: now().toISOString(), productKey: "major_fortune", productSlug: "major-fortune", ...r });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  expect(validateMajorFortuneV3({ ...r.draft, editorialYears: r.draft.editorialYears.slice(0, 10) }, r.evidencePacket)).toContain("MAJOR_FORTUNE_V3_CONTENT_MISMATCH");
  if (process.env.F4_REVIEW_OUTPUT === "1") { writeFileSync("/tmp/gyeol-major-f4-gaon.txt", text); writeFileSync("/tmp/gyeol-major-f4-gaon.json", JSON.stringify(r, null, 2)); }
  expect(fetch).not.toHaveBeenCalled();
});

it("1999 birth uses canonical counting age, including 38 in 2036", async () => {
  const r = (await createMajorFortuneV3({ ...payload, person: { ...payload.person, birthDate: "1999-08-21" } }, { now }))!;
  expect(r.draft.editorialYears.find(y => y.year === 2036)!.ageLabel).toBe("38세");
  expect(r.draft.editorialYears.find(y => y.year === 2023)!.ageLabel).toBe("25세");
});

it.each([2021, 2028, 2031])("server %i shifts all 14 years and includes every canonical transition", async year => {
  const r = (await createMajorFortuneV3({ ...payload, currentYear: 2099 }, { now: () => new Date(`${year}-09-29T03:00:00Z`) }))!;
  expect(r.draft.horizon!.from).toBe(year - 3); expect(r.draft.horizon!.through).toBe(year + 10);
  expect(r.draft.horizon!.transitions.map(t => t.year)).toEqual(r.evidencePacket.customerDayun!.cycles.filter(c => c.startYear >= year - 3 && c.startYear <= year + 10).map(c => c.startYear));
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
});

it.each(CAREER_V3_FIXTURES)("%s retains job context, supports unknown MBTI and publishes", async (...row) => {
  const input = careerFixture(row).payload, r = (await createMajorFortuneV3({ ...input, productKey: "major_fortune", productSlug: "major-fortune" }, { now }))!;
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
  expect(majorFortuneV3CustomerText(r.draft)).not.toMatch(leaks);
  expect(renderToStaticMarkup(createElement(MajorFortuneReportV3View, r))).not.toMatch(leaks);
  if (!input.person.mbtiType) expect(r.draft.narrativeAudit).toEqual([]);
});

it("sixteen MBTI types change the year itself, not a trailing type slogan or chart", async () => {
  const bodies = new Set<string>(), charts = new Set<string>();
  for (const mbtiType of MBTI_TYPES.filter(Boolean)) {
    const r = (await createMajorFortuneV3({ ...payload, person: { ...payload.person, mbtiType } }, { now }))!;
    expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
    const y = r.draft.editorialYears.find(y => y.year === 2030)!;
    bodies.add(y.paragraphs.join(" ").replaceAll(mbtiType, "")); charts.add(hash(r.evidencePacket.customerDayun));
    expect(r.draft.narrativeAudit!.find(a => a.section === "year-2030")).toBeTruthy();
  }
  expect(bodies.size).toBe(16); expect(charts.size).toBe(1);
});
