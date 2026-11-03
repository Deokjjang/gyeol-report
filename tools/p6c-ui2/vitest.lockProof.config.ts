// 잠금 증명(P6c-ui2 1단계): 잠금을 쓰는 시험 파일(19개)만, 값 기록 setup을 더해 돌린다. LOCK_PROOF_OLD_NOTE=1이면 예전 보정 문구.
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const files = execSync("grep -rlE expectLock tests", { cwd: root, encoding: "utf8" }).split("\n").filter(f => /\.test\.tsx?$/.test(f));
export default defineConfig({
  root,
  test: { include: files, setupFiles: ["./tests/networkGuard.ts", "./tools/p6c-ui2/lockProof.setup.ts", ...(process.env.LOCK_PROOF_OLD_NOTE === "1" ? ["./tools/p6c-ui2/lockProofOldNote.setup.ts"] : [])], fileParallelism: false },
  resolve: { alias: { "@": resolve(root, "src") } },
});
