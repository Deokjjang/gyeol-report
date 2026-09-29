import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MajorFortuneReportV3View } from "../../../src/app/reports/[reportId]/MajorFortuneReportV3View";
import { LEGACY_MAJOR_FORTUNE_V3_VERSION, majorFortuneV3CustomerText } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import type { MajorFortuneEvidencePacket } from "../../../src/lib/report-knowledge/majorFortuneTypes";
import { createMajorFortuneV3 as createMajorFortuneEdition, validateMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildCanonicalManseRyeokTableData } from "../../../src/lib/report-tables/manseRyeokTableData";

const contexts = [
  ["employee", "경영지원", "ENTJ"], ["employee", "B2B SaaS 영업기획", "ENTJ"], ["employee", "백엔드 개발자", "INTP"],
  ["business_owner", "동네 베이커리 운영", "ESTJ"], ["freelancer", "브랜드 디자이너", "INFP"], ["student", "컴퓨터공학", "ENFP"],
  ["job_seeker", "콘텐츠 마케팅", "INFJ"], ["employee", "공인회계사", "ISTJ"], ["employee", "호텔 고객 서비스", "ESFJ"], ["other", "가족 돌봄과 창작", ""],
] as const;
// Frozen F2 replay coverage. The current rolling edition has its own suite.
const createMajorFortuneV3 = (input: unknown) => createMajorFortuneEdition(input, { edition: "legacy-depth" });

function payload(jobStatus = "employee", detailJob = "B2B SaaS 영업기획", relationshipStatus = "single", mbtiType = "ENTJ") {
  return { productKey: "major_fortune", productSlug: "major-fortune", person: { name: "가온", birthDate: "1992-08-21", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType }, userContext: { relationshipStatus, jobStatus, detailJob, focusAreas: [] }, productOptions: { contentVersion: "v3" } };
}

describe("major fortune V3 editorial", () => {
  it.each(contexts)("generates, publishes and SSR-renders %s / %s", async (jobStatus, detailJob, mbti) => {
    const input = payload(jobStatus, detailJob, "single", mbti);
    const result = await createMajorFortuneV3(input);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(validateNewProductPublication("major_fortune", result.draft, result.evidencePacket, input)).toEqual({ ok: true, errors: [] });
    expect(result.draft.inputSummary).toContainEqual({ label: jobStatus === "student" ? "관심 분야" : "현재 직업", value: detailJob });
    expect(result.draft.editorialYears).toHaveLength(10);
    expect(result.draft.editorialYears.every(year => year.paragraphs.length >= 4)).toBe(true);
    expect(new Set(result.draft.editorialYears.map(year => year.title)).size).toBe(10);
    expect(result.draft.editorialYears.filter(year => year.isCurrentYear)).toHaveLength(1);
    expect(result.draft.fortuneSignals?.length).toBeGreaterThanOrEqual(4);
    const html = renderToStaticMarkup(createElement(MajorFortuneReportV3View, { draft: result.draft, evidencePacket: result.evidencePacket as MajorFortuneEvidencePacket }));
    expect(html).toContain("TEN-YEAR TIMELINE");
    expect(html).toContain("data-story-tables");
    expect(html).toContain("data-story-signals");
    expect(html).toContain(detailJob);
    expect(html).not.toMatch(/evidenceId|debug|fixture|backend|source_id|career_shift|money_responsibility|previous_to_current|metal|water/i);
  });

  it("changes relationship scenes without changing the canonical ten-year calculation", async () => {
    const reports = await Promise.all(["single", "dating", "married"].map(status => createMajorFortuneV3(payload("employee", "서비스 기획자", status))));
    expect(reports.every(Boolean)).toBe(true);
    const texts = reports.map(result => majorFortuneV3CustomerText(result!.draft));
    expect(texts[0]).toContain("솔로인 지금");
    expect(texts[1]).toContain("연애 중이라면");
    expect(texts[2]).toContain("기혼인 지금");
    expect(new Set(texts).size).toBe(3);
    expect(reports.map(result => result!.draft.editorialYears.map(year => `${year.year}:${year.ganji}`))).toEqual([
      reports[0]!.draft.editorialYears.map(year => `${year.year}:${year.ganji}`),
      reports[0]!.draft.editorialYears.map(year => `${year.year}:${year.ganji}`),
      reports[0]!.draft.editorialYears.map(year => `${year.year}:${year.ganji}`),
    ]);
  });

  it("uses MBTI as behavior context and keeps unknown genuinely unknown", async () => {
    const entj = await createMajorFortuneV3(payload("employee", "서비스 기획자", "single", "ENTJ"));
    const infp = await createMajorFortuneV3(payload("employee", "서비스 기획자", "single", "INFP"));
    const unknown = await createMajorFortuneV3(payload("employee", "서비스 기획자", "single", ""));
    expect(majorFortuneV3CustomerText(entj!.draft)).toContain("ENTJ의 속도");
    expect(majorFortuneV3CustomerText(entj!.draft)).toContain("ENTJ의 속도가 식신의 흐름과 만납니다");
    expect(majorFortuneV3CustomerText(infp!.draft)).toContain("INFP의 진심");
    expect(majorFortuneV3CustomerText(unknown!.draft)).toContain("특정 유형의 성격을 추정하지 않았습니다");
    expect(unknown!.draft.inputSummary).toContainEqual({ label: "MBTI", value: "모름" });
  });

  it("keeps all visible years and transitions on the existing decade engine", async () => {
    const result = await createMajorFortuneV3(payload());
    expect(result).not.toBeNull();
    if (!result) return;
    const packet = result.evidencePacket as MajorFortuneEvidencePacket;
    expect(packet.decadeReading?.version).toBe("major-decade-v2");
    const manse = buildCanonicalManseRyeokTableData(result.evidencePacket, result.draft.personLabel);
    expect(manse?.columns).toHaveLength(4);
    expect(manse?.detailRows.map(row => row.key)).toEqual(["hiddenStems", "twelveLifeStage", "twelveSinsal", "sinsalAndGwiin", "interactions"]);
    const calculation = (result.evidencePacket as typeof result.evidencePacket & { majorFortuneV3: { calculation: { elements: { visible: unknown; weighted: unknown } } } }).majorFortuneV3.calculation;
    expect(calculation.elements.visible).toBeTruthy();
    expect(calculation.elements.weighted).toBeTruthy();
    expect(result.draft.title).toBe(`${packet.personLabel}님의 현재 대운, ${packet.currentCycle.ganji}의 장`);
    expect(result.draft.chapterTitle).toContain(`지금 지나고 있는 ${packet.currentCycle.startYear}~${packet.currentCycle.endYear}년`);
    expect(result.draft.editorialYears.map(year => [year.year, year.ganji, year.tenGod, year.importance])).toEqual(packet.decadeReading?.years.map(year => [year.year, year.ganji, year.tenGod, year.importance]));
    expect(result.draft.nextChapter.join(" ")).toContain(packet.nextCycle?.ganji ?? "확인된 다음 대운표가 없어");
    const text = majorFortuneV3CustomerText(result.draft);
    expect(text).not.toMatch(/\d+\s*점|[SABC][+\-]?\s*등급|반드시 (승진|합격|결혼)|무조건 (돈|성공)/);
  });

  it("separates retrospective, present and future years without factory copy", async () => {
    const result = await createMajorFortuneV3(payload());
    expect(result).not.toBeNull();
    if (!result) return;
    const packet = result.evidencePacket as MajorFortuneEvidencePacket;
    const past = result.draft.editorialYears.filter(year => year.year < packet.currentYear);
    const current = result.draft.editorialYears.find(year => year.year === packet.currentYear)!;
    const future = result.draft.editorialYears.filter(year => year.year > packet.currentYear);
    expect(past.every(year => year.timePosition === "past" && year.paragraphs[0].includes("돌아보면"))).toBe(true);
    expect(current.timePosition).toBe("current");
    expect(current.paragraphs[0]).toContain("지금");
    expect(future.every(year => year.timePosition === "future" && year.paragraphs[0].includes("앞으로"))).toBe(true);
    expect(majorFortuneV3CustomerText(result.draft)).not.toMatch(/크게 튀는 사건을 정해 두는 해가 아니라|생활의 어느 장면에서 반복되는지|식신 대운의 장기 배경에|특정 사건의 확정 예측은 아닙니다/);
  });

  it("distributes one sales-planning job across distinct work scenes", async () => {
    const result = await createMajorFortuneV3(payload());
    expect(result).not.toBeNull();
    if (!result) return;
    const text = majorFortuneV3CustomerText(result.draft);
    for (const scene of ["고객 미팅", "제안과 협상", "계약이 막힌", "제품팀", "실적이 좋은 동료", "보고와 분석", "평가와 보상", "이직 공고", "시장과 목표"]) expect(text).toContain(scene);
    expect(text).not.toMatch(/CRM|재계약/);
  });

  it("keeps customer copy free of internal keys, English elements and broken particles", async () => {
    const result = await createMajorFortuneV3(payload("employee", "서비스 기획자"));
    expect(result).not.toBeNull();
    if (!result) return;
    const text = majorFortuneV3CustomerText(result.draft);
    expect(text).not.toMatch(/career_shift|money_responsibility|previous_to_current|metal|water|겁재은|정재은|결과이|콘텐츠을|완성도이|나눌지이|신뢰이/i);
    expect(text).not.toContain("다음 10년");
  });

  it("continues to validate stored editorial.1 snapshots without the new evidence extension", async () => {
    const result = await createMajorFortuneV3(payload());
    expect(result).not.toBeNull();
    if (!result) return;
    const legacyDraft = { ...result.draft, version: LEGACY_MAJOR_FORTUNE_V3_VERSION, fortuneSignals: undefined,
      editorialYears: result.draft.editorialYears.map(year => Object.fromEntries(Object.entries(year).filter(([key]) => key !== "timePosition"))) };
    const legacyEvidence = Object.fromEntries(Object.entries(result.evidencePacket).filter(([key]) => key !== "majorFortuneV3"));
    expect(validateMajorFortuneV3(legacyDraft, legacyEvidence)).toEqual([]);
  });
});
