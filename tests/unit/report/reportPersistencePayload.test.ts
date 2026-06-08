import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { isValidReportId } from "@/lib/persistence/reportPersistenceIds";
import {
  buildReportPersistencePayload,
  DEFAULT_REPORT_LOCALE,
  REPORT_ACCESS_TOKEN_VERSION,
  REPORT_CALCULATION_VERSION,
  REPORT_PERSISTENCE_PAYLOAD_VERSION,
  type BuildReportPersistencePayloadInput,
  type BuildReportPersistencePayloadResult,
} from "@/lib/report/reportPersistencePayload";
import type { ReportOutput } from "@/lib/report/types";

const nowIso = "2026-01-01T00:00:00.000Z";

const reportFixture: ReportOutput = {
  version: "v1",
  titleKo: "Test report",
  subtitleKo: "Test subtitle",
  sections: [
    {
      id: "INTRO",
      level: "FREE_PREVIEW",
      titleKo: "Intro",
      summaryKo: "Summary",
      blocks: [
        {
          kind: "PARAGRAPH",
          bodyKo: "Body",
        },
      ],
    },
  ],
  notices: ["Notice"],
};

function createInput(
  overrides: Partial<BuildReportPersistencePayloadInput> = {},
): BuildReportPersistencePayloadInput {
  return {
    birthDate: "1996-12-06",
    birthTime: "14:15",
    birthTimeUnknown: false,
    calendarType: "SOLAR",
    timezone: "Asia/Seoul",
    gender: "female",
    mbti: "ENTJ",
    report: reportFixture,
    nowIso,
    ...overrides,
  };
}

function expectSuccess(
  result: BuildReportPersistencePayloadResult,
): Extract<BuildReportPersistencePayloadResult, { ok: true }> {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected payload build success.");
  }

  return result;
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("report persistence payload", () => {
  it("exports stable constants", () => {
    expect(REPORT_PERSISTENCE_PAYLOAD_VERSION).toBe("v1");
    expect(REPORT_CALCULATION_VERSION).toBe("saju-mbti-v1");
    expect(DEFAULT_REPORT_LOCALE).toBe("ko-KR");
  });

  it("builds persisted payload with required defaults", () => {
    const result = expectSuccess(buildReportPersistencePayload(createInput()));
    const { record } = result.input;

    expect(isValidReportId(record.reportId)).toBe(true);
    expect(record.status).toBe("generated");
    expect(record.accessMode).toBe("preview");
    expect(record.reportVersion).toBe(REPORT_PERSISTENCE_PAYLOAD_VERSION);
    expect(record.calculationVersion).toBe(REPORT_CALCULATION_VERSION);
    expect(record.locale).toBe(DEFAULT_REPORT_LOCALE);
    expect(record.accessTokenHash).toMatch(/^sha256:[a-f0-9]+$/);
    expect(record.accessTokenHash).not.toContain("rpat_");
    expect(record.accessTokenCreatedAt).toBe(nowIso);
    expect(record.accessTokenVersion).toBe(REPORT_ACCESS_TOKEN_VERSION);
    expect(record.accessTokenRotatedAt).toBeUndefined();
    expect(record.inputSnapshot).toEqual(result.inputSnapshot);
    expect(record.reportSnapshot).toEqual(result.reportSnapshot);
    expect(record.payment).toBeUndefined();
    expect(record.createdAt).toBe(nowIso);
    expect(record.updatedAt).toBe(nowIso);
  });

  it("builds input snapshot", () => {
    const result = expectSuccess(buildReportPersistencePayload(createInput()));

    expect(result.inputSnapshot).toEqual({
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      gender: "female",
      mbti: "ENTJ",
    });

    const defaultTimezoneResult = expectSuccess(
      buildReportPersistencePayload(createInput({ timezone: undefined })),
    );

    expect(defaultTimezoneResult.inputSnapshot.timezone).toBe("Asia/Seoul");
  });

  it("builds report snapshot", () => {
    const result = expectSuccess(buildReportPersistencePayload(createInput()));
    const reportJson = JSON.stringify(result.reportSnapshot.report);

    expect(result.reportSnapshot).toEqual({
      report: reportFixture,
      reportVersion: REPORT_PERSISTENCE_PAYLOAD_VERSION,
      renderVersion: REPORT_PERSISTENCE_PAYLOAD_VERSION,
      createdAt: nowIso,
    });
    expect(result.reportSnapshot.report.sections).toEqual(reportFixture.sections);
    expect(reportJson).not.toContain("accessToken");
    expect(reportJson).not.toContain("access_token");
    expect(reportJson).not.toContain("access_token_hash");
  });

  it("normalizes missing optional fields", () => {
    const result = expectSuccess(
      buildReportPersistencePayload({
        birthDate: "1996-12-06",
        calendarType: "LUNAR",
        report: reportFixture,
        nowIso,
      }),
    );

    expect(result.inputSnapshot.birthTime).toBeNull();
    expect(result.inputSnapshot.birthTimeUnknown).toBe(false);
    expect(result.inputSnapshot.timezone).toBe("Asia/Seoul");
    expect("gender" in result.inputSnapshot).toBe(false);
    expect("mbti" in result.inputSnapshot).toBe(false);
  });

  it("rejects empty birthDate", () => {
    const result = buildReportPersistencePayload(createInput({ birthDate: "" }));

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.code).toBe("INVALID_BIRTH_DATE");
    }
  });

  it("rejects invalid calendar type", () => {
    const result = buildReportPersistencePayload(
      createInput({
        calendarType:
          "INVALID" as unknown as BuildReportPersistencePayloadInput["calendarType"],
      }),
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.code).toBe("INVALID_CALENDAR_TYPE");
    }
  });

  it("rejects invalid report", () => {
    const result = buildReportPersistencePayload(
      createInput({ report: null as unknown as ReportOutput }),
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.code).toBe("INVALID_REPORT");
    }
  });

  it("source avoids unsafe markers", () => {
    const source = readSource("src/lib/report/reportPersistencePayload.ts");
    const blockedMarkers = [
      "@" + "supabase/supabase-js",
      "process" + ".env",
      "NEXT" + "_PUBLIC",
      "fetch" + "(",
      "create" + "Client",
      "service" + "_role",
      "pass" + "word",
      "provider raw " + "payload",
      "access " + "token",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
