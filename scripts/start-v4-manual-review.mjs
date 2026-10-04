import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
// Process-local safety overrides; never writes .env or production configuration.
const child = spawn("pnpm", ["dev", "--hostname", "127.0.0.1", "--port", "3193"], {
  cwd: fileURLToPath(new URL("..", import.meta.url)), stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_LOCAL_REVIEW_SILENT: "1", OPENAI_REPORT_WRITER_ENABLED: "0", TOSS_CONFIRM_API_ENABLED: "0", PAID_REPORT_RELIABILITY_ENABLED: "0" },
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", code => { process.exitCode = code ?? 0; });
