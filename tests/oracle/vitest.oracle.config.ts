import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

// Diagnostic oracle scans (*.oracle.ts), kept out of the default test glob.
export default defineConfig({
  root: rootDir,
  test: { include: ["tests/oracle/*.oracle.ts"], setupFiles: ["./tests/networkGuard.ts"], testTimeout: 0 },
  resolve: { alias: { "@": resolve(rootDir, "src") } },
});
