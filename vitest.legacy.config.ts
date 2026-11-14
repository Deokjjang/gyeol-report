import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { LEGACY_TESTS } from "./vitest.config";

const rootDir = dirname(fileURLToPath(import.meta.url));

/** W3 P1: 옛 시험만(`pnpm test:legacy`). 기본 실행(vitest.config.ts)에서 빠진 V3·V4 지식·해석 엔진·개발 미리보기 시험. */
export default defineConfig({
  test: { setupFiles: ["./tests/networkGuard.ts"], include: LEGACY_TESTS.map(p => `${p.replace(/\*\*$/, "")}**/*.test.{ts,tsx}`) },
  resolve: { alias: { "@": resolve(rootDir, "src") } },
});
