import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type PackageJson = {
  scripts?: Record<string, string>;
};

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
) as PackageJson;

describe("package scripts", () => {
  it("has release check script", () => {
    expect(packageJson.scripts?.["release:check"]).toBe(
      "pnpm test && pnpm lint && pnpm build",
    );
  });

  it("preserves required base scripts", () => {
    expect(packageJson.scripts?.test).toBeTruthy();
    expect(packageJson.scripts?.lint).toBeTruthy();
    expect(packageJson.scripts?.build).toBeTruthy();
  });

  it("uses existing scripts in release check order", () => {
    const releaseCheck = packageJson.scripts?.["release:check"] ?? "";

    expect(releaseCheck.indexOf("pnpm test")).toBeLessThan(
      releaseCheck.indexOf("pnpm lint"),
    );
    expect(releaseCheck.indexOf("pnpm lint")).toBeLessThan(
      releaseCheck.indexOf("pnpm build"),
    );
  });
});
