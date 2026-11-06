import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../../..");

/** knowledge-v5 v2 데이터 게이트. --strict: 기대 id 누락·MBTI 16·Fusion 300(장면 60)·간지 60·십성 연월 10 까지 실패로 친다. */
describe("knowledge-v5 data gate (v2)", () => {
  it("passes knowledge-lint --strict with zero issues and full coverage", () => {
    const run = spawnSync(process.execPath, ["--import", "tsx", "scripts/knowledge-lint.ts", "--strict"], { cwd: ROOT, encoding: "utf8", env: { ...process.env, LINT_MAX: "20" } });
    expect(run.status, run.stdout.slice(0, 3000)).toBe(0);
    const report = JSON.parse(run.stdout.slice(0, run.stdout.lastIndexOf("}") + 1)) as { stats: Record<string, unknown>; issueCount: number };
    expect(report.issueCount).toBe(0);
    expect(report.stats).toMatchObject({ mbtiProfiles: 16, products: 6, ganji: 60, tenGodPeriod: 10, coverageMissing: 0 });
    expect(Number(report.stats.features)).toBeGreaterThanOrEqual(250);
    expect(Number(report.stats.fusionRules)).toBeGreaterThanOrEqual(300);
    expect(Number(report.stats.fusionWithScene)).toBeGreaterThanOrEqual(60);
  }, 120_000);
});
