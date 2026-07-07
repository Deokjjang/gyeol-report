import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  resolveReportWriterRuntime,
  type ReportWriterRuntimeEnvironment,
} from "../../../src/lib/report-generation/reportWriterRuntime";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/reportWriterRuntime.ts",
);
const source = readFileSync(sourcePath, "utf8");

function resolve(
  env: ReportWriterRuntimeEnvironment,
): ReturnType<typeof resolveReportWriterRuntime> {
  return resolveReportWriterRuntime(env);
}

describe("report writer runtime", () => {
  it("keeps writer disabled when the env flag is missing", () => {
    expect(resolve({})).toEqual({
      enabled: false,
      reason: "flag_disabled",
    });
  });

  it("keeps writer disabled when the env flag is not explicitly enabled", () => {
    expect(
      resolve({
        OPENAI_REPORT_WRITER_ENABLED: "true",
        OPENAI_API_KEY: "test-key",
        OPENAI_REPORT_MODEL: "test-model",
      }),
    ).toEqual({
      enabled: false,
      reason: "flag_disabled",
    });
  });

  it("enables writer runtime only when flag, key, and model are present", () => {
    expect(
      resolve({
        OPENAI_REPORT_WRITER_ENABLED: "1",
        OPENAI_API_KEY: " test-key ",
        OPENAI_REPORT_MODEL: " test-model ",
      }),
    ).toEqual({
      enabled: true,
      config: {
        enabled: true,
        apiKey: "test-key",
        model: "test-model",
      },
    });
  });

  it("falls back safely when key or model is missing", () => {
    expect(
      resolve({
        OPENAI_REPORT_WRITER_ENABLED: "1",
        OPENAI_REPORT_MODEL: "test-model",
      }),
    ).toEqual({
      enabled: false,
      reason: "missing_api_key",
    });

    expect(
      resolve({
        OPENAI_REPORT_WRITER_ENABLED: "1",
        OPENAI_API_KEY: "test-key",
      }),
    ).toEqual({
      enabled: false,
      reason: "missing_model",
    });

    expect(
      resolve({
        OPENAI_REPORT_WRITER_ENABLED: "1",
      }),
    ).toEqual({
      enabled: false,
      reason: "missing_api_key_and_model",
    });
  });

  it("does not embed an API key literal", () => {
    expect(source).not.toContain("sk-");
    expect(source).not.toContain("Bearer ");
  });
});
