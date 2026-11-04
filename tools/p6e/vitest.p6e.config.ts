// P6e 실호출 원고 전용 vitest 설정: 네트워크 가드 없음(실호출), 시간 제한 없음, tools/p6e/generate.p6e.ts만.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export default defineConfig({
  root,
  test: { include: ["tools/p6e/generate.p6e.ts"], setupFiles: ["tools/p6/setup.p6.ts"], testTimeout: 0, hookTimeout: 0, fileParallelism: false },
  resolve: { alias: { "@": resolve(root, "src") } },
});
