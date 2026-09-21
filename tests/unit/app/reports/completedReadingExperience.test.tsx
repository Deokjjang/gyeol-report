import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createCompletedReportFixtures } from "../../../fixtures/completed-report/snapshots";
import type { ProductPreviewSnapshot } from "../../../../src/lib/report-generation/productPreviewSnapshot";
import { validateProductPublication } from "../../../../src/lib/report-generation/productPublishGate";
import * as generation from "../../../../src/lib/report-generation/generateProductReport";

const mocks = vi.hoisted(() => ({ call: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("../../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: mocks.call }) }));
import ReportResultPage from "../../../../src/app/reports/[reportId]/page";

function visibleText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ");
}

let fixtures: Record<string, ProductPreviewSnapshot>;
beforeAll(async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-21T01:00:00Z"));
  fixtures = await createCompletedReportFixtures();
  vi.spyOn(generation, "generateProductReport");
  vi.useRealTimers();
  vi.stubEnv("NODE_ENV", "production");
  if (process.env.RESULT_QA_DIR) {
    mkdirSync(process.env.RESULT_QA_DIR, { recursive: true });
    writeFileSync(`${process.env.RESULT_QA_DIR}/snapshots.json`, JSON.stringify(fixtures));
  }
});
afterAll(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("validated completed report reading", () => {
  it.each(["saju-mbti-full", "career-money-study", "love-marriage-child", "major-fortune", "annual-fortune", "compatibility-love", "compatibility-businessPartner", "compatibility-parentChild"])("renders stored %s without generating during read", async (key) => {
    const snapshot = fixtures[key];
    expect(validateProductPublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket)).toEqual({ ok: true, errors: [] });
    const before = JSON.stringify(snapshot);
    mocks.call.mockReset().mockResolvedValue({ ok: true, status: "COMPLETED", snapshot });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: snapshot.reportId }) }));
    expect(html).toContain("리포트 공유하기");
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html.match(/<main[ >]/g)).toHaveLength(1);
    const text = visibleText(html);
    for (const pillar of ["연주", "월주", "일주", "시주"]) expect(text).toContain(pillar);
    expect(text).not.toMatch(/\b(?:snapshot|fallback|validator|evidence packet|source registry|productType|reportVersion|calculationVersion|internal|draft|placeholder|generation strategy|writer model|OpenAI|job|attempt|businessPartner|parentChild)\b/i);
    expect(text).not.toContain(snapshot.reportId);
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    expect(new Set(anchors).size).toBe(anchors.length);
    for (const id of anchors) expect(html).toContain(`id="${id}" tabindex="-1"`);
    expect(html).toContain('aria-label="리포트 목차"');
    expect(html).toContain("<details>");
    if (key.startsWith("compatibility")) {
      expect(text).toContain("김도윤"); expect(text).toContain("이서연");
    }
    if (key === "annual-fortune") expect(text).toContain("2026년 세운 리포트");
    expect(html).toContain(`href="/report/new?product=${snapshot.productSlug}"`);
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId: snapshot.reportId }]]);
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(generation.generateProductReport).not.toHaveBeenCalled();
    if (process.env.RESULT_QA_DIR) writeFileSync(`${process.env.RESULT_QA_DIR}/${key}.html`, html);
  });

  it("keeps every persisted comprehensive longform chapter", async () => {
    const snapshot = fixtures["saju-mbti-full"];
    mocks.call.mockReset().mockResolvedValue({ ok: true, status: "COMPLETED", snapshot });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: snapshot.reportId }) }));
    const draft = snapshot.draft as { longformReadings: readonly { titleKo: string; body: string }[] };
    expect(draft.longformReadings.length).toBeGreaterThanOrEqual(10);
    for (const reading of draft.longformReadings) {
      expect(html).toContain(reading.titleKo);
      for (const paragraph of reading.body.split(/\n+/).map((line) => line.trim()).filter(Boolean)) {
        expect(html).toContain(renderToStaticMarkup(<p>{paragraph}</p>).slice(3, -4));
      }
    }
  });

  it.each(["evidence", "longform"])("quarantines completed snapshots missing %s without filling gaps or offering share", async (missing) => {
    const snapshot = structuredClone(fixtures["saju-mbti-full"]);
    if (missing === "evidence") Object.assign(snapshot, { evidencePacket: undefined });
    else Object.assign(snapshot.draft, { longformReadings: [] });
    const before = JSON.stringify(snapshot);
    mocks.call.mockReset().mockResolvedValue({ ok: true, status: "COMPLETED", snapshot });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: snapshot.reportId }) }));
    expect(html).not.toContain("리포트 공유하기");
    expect(html).not.toContain("김도윤");
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId: snapshot.reportId }], ["quarantine", { reportId: snapshot.reportId }]]);
    expect(JSON.stringify(snapshot)).toBe(before);
  });
});
