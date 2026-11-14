import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

/**
 * W3 P1 시험 바닥: 기본 `pnpm test`에서 뺀 옛 시험(V3·V4 지식·해석 엔진 동결 시험, 개발 미리보기 화면 — 운영 v5 경로가 import하지 않는다).
 * 지우지 않고 `pnpm test:legacy`(vitest.legacy.config.ts)로 따로 돌린다. 기본 실행은 「실패 0 · 건너뜀 0」을 완료 조건으로 쓴다.
 */
export const LEGACY_TESTS = [
  "tests/unit/report-knowledge/**",
  "tests/unit/interpretation-v4/**",
  "tests/unit/interpretation-v3/**",
  "tests/unit/app/dev/**",
];

export default defineConfig({
  test: { setupFiles: ["./tests/networkGuard.ts"], exclude: [...configDefaults.exclude, ...LEGACY_TESTS] },
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  },
});
