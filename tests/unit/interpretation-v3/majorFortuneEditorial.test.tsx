import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MajorFortuneReportV3View } from "../../../src/app/reports/[reportId]/MajorFortuneReportV3View";
import { majorFortuneV3CustomerText } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import type { MajorFortuneEvidencePacket } from "../../../src/lib/report-knowledge/majorFortuneTypes";
import { createMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";

const contexts = [
  ["employee", "경영지원", "ENTJ"], ["employee", "B2B SaaS 영업기획", "ENTJ"], ["employee", "백엔드 개발자", "INTP"],
  ["business_owner", "동네 베이커리 운영", "ESTJ"], ["freelancer", "브랜드 디자이너", "INFP"], ["student", "컴퓨터공학", "ENFP"],
  ["job_seeker", "콘텐츠 마케팅", "INFJ"], ["employee", "공인회계사", "ISTJ"], ["employee", "호텔 고객 서비스", "ESFJ"], ["other", "가족 돌봄과 창작", ""],
] as const;

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
    expect(new Set(result.draft.editorialYears.map(year => year.title)).size).toBe(10);
    expect(result.draft.editorialYears.filter(year => year.isCurrentYear)).toHaveLength(1);
    const html = renderToStaticMarkup(createElement(MajorFortuneReportV3View, { draft: result.draft, evidencePacket: result.evidencePacket as MajorFortuneEvidencePacket }));
    expect(html).toContain("TEN-YEAR TIMELINE");
    expect(html).toContain(detailJob);
    expect(html).not.toMatch(/evidenceId|debug|fixture|backend|source_id/i);
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
    expect(majorFortuneV3CustomerText(entj!.draft)).toContain("ENTJ의 속도가 지금의 선택 방식");
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
    expect(result.draft.editorialYears.map(year => [year.year, year.ganji, year.tenGod, year.importance])).toEqual(packet.decadeReading?.years.map(year => [year.year, year.ganji, year.tenGod, year.importance]));
    expect(result.draft.nextChapter.join(" ")).toContain(packet.nextCycle?.ganji ?? "확인된 다음 대운표가 없어");
    const text = majorFortuneV3CustomerText(result.draft);
    expect(text).not.toMatch(/\d+\s*점|[SABC][+\-]?\s*등급|반드시 (승진|합격|결혼)|무조건 (돈|성공)/);
  });
});
