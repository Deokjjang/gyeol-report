// P6c-ui2 확인용 vitest 설정(네트워크 가드 유지, tools/p6c-ui2/*.ui2.ts만).
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export default defineConfig({
  root,
  test: { include: ["tools/p6c-ui2/*.ui2.ts"], setupFiles: ["./tests/networkGuard.ts"], testTimeout: 0 },
  resolve: { alias: { "@": resolve(root, "src") } },
});
