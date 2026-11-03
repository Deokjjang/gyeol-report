// P6c-ui2 캡처용 로컬 Book 전용 vitest 설정: 로컬 DB를 쓰므로 네트워크 가드 없음, 시간 제한 없음, tools/p6c-ui2/books.ui2.ts만.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export default defineConfig({
  root,
  test: { include: ["tools/p6c-ui2/books.ui2.ts"], setupFiles: ["tools/p6/setup.p6.ts"], testTimeout: 0, hookTimeout: 0, fileParallelism: false },
  resolve: { alias: { "@": resolve(root, "src") } },
});
