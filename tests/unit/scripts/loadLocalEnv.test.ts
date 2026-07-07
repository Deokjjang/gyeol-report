import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { loadLocalEnv } from "../../../scripts/lib/loadLocalEnv";

describe("loadLocalEnv", () => {
  it("loads simple KEY=VALUE pairs from a local env file", () => {
    const envPath = createTempEnvFile([
      "OPENAI_REPORT_WRITER_ENABLED=1",
      "OPENAI_API_KEY=test-key",
      "OPENAI_REPORT_MODEL=test-model",
    ]);
    const targetEnv: Record<string, string | undefined> = {};

    const result = loadLocalEnv({ envPath, targetEnv });

    expect(result.loaded).toBe(true);
    expect(result.appliedKeys).toEqual([
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
    ]);
    expect(targetEnv).toEqual({
      OPENAI_REPORT_WRITER_ENABLED: "1",
      OPENAI_API_KEY: "test-key",
      OPENAI_REPORT_MODEL: "test-model",
    });
  });

  it("does not overwrite existing env values", () => {
    const envPath = createTempEnvFile([
      "OPENAI_API_KEY=file-key",
      "OPENAI_REPORT_MODEL=file-model",
    ]);
    const targetEnv: Record<string, string | undefined> = {
      OPENAI_API_KEY: "existing-key",
    };

    const result = loadLocalEnv({ envPath, targetEnv });

    expect(result.appliedKeys).toEqual(["OPENAI_REPORT_MODEL"]);
    expect(targetEnv.OPENAI_API_KEY).toBe("existing-key");
    expect(targetEnv.OPENAI_REPORT_MODEL).toBe("file-model");
  });

  it("removes wrapping quotes from values", () => {
    const envPath = createTempEnvFile([
      'OPENAI_REPORT_MODEL="gpt-test"',
      "OPENAI_API_KEY='quoted-key'",
    ]);
    const targetEnv: Record<string, string | undefined> = {};

    loadLocalEnv({ envPath, targetEnv });

    expect(targetEnv.OPENAI_REPORT_MODEL).toBe("gpt-test");
    expect(targetEnv.OPENAI_API_KEY).toBe("quoted-key");
  });

  it("ignores missing files and invalid lines", () => {
    const missingPath = join(
      mkdtempSync(join(tmpdir(), "gyeol-missing-env-")),
      ".env.local",
    );
    const targetEnv: Record<string, string | undefined> = {};

    const result = loadLocalEnv({ envPath: missingPath, targetEnv });

    expect(result).toEqual({
      loaded: false,
      envPath: missingPath,
      appliedKeys: [],
    });
    expect(targetEnv).toEqual({});
  });
});

function createTempEnvFile(lines: readonly string[]): string {
  const dir = mkdtempSync(join(tmpdir(), "gyeol-env-"));
  const envPath = join(dir, ".env.local");
  writeFileSync(envPath, `${lines.join("\n")}\n`, "utf8");

  return envPath;
}
