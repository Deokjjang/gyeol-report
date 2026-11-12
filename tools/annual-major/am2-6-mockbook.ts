/** AM2-6 8부(호출 0): 가짜 작가 전 과정 책을 화면 캡처용 검토 폴더에 쓴다 — ~/Desktop/gyeol-review/annual-major/am26-mock-<case>/snapshot.json(review-seed가 심는다). */
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { payloadFor } from "./am2-6-books";
const at = "2026-12-02T03:00:00.000Z";
async function main() { for (const id of process.argv.slice(2)) {
  const c = { payload: payloadFor(id) };
  const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_am26mock${id.replace(/[^a-z0-9]/g, "")}00`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", c.payload as never, at), people: async () => [] } });
  const dir = join(homedir(), "Desktop", "gyeol-review", "annual-major", `am26-mock-${id}`); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "snapshot.json"), JSON.stringify(built.snapshot)); console.log(dir);
} }
void main();
