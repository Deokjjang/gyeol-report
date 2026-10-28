import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../../..");

describe("knowledge-v5 data gate", () => {
  it("passes knowledge-lint with zero issues and the expected asset counts", () => {
    const run = spawnSync(process.execPath, ["--import", "tsx", "scripts/knowledge-lint.ts"], { cwd: ROOT, encoding: "utf8", env: { ...process.env, LINT_MAX: "20" } });
    expect(run.status, run.stdout.slice(0, 2000)).toBe(0);
    const report = JSON.parse(run.stdout.slice(0, run.stdout.lastIndexOf("}") + 1)) as { stats: Record<string, unknown>; issueCount: number };
    expect(report.issueCount).toBe(0);
    expect(report.stats).toMatchObject({ mbtiProfiles: 16, products: 6 });
    expect(Number(report.stats.features)).toBeGreaterThanOrEqual(200);
    expect(Number(report.stats.crossFindings)).toBeGreaterThanOrEqual(200);
  }, 60_000);
});
