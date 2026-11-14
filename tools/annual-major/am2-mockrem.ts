/** AM2-3 확인(호출 0): 가짜 작가 전 과정의 남은 차단 깃발을 규칙·자리별로. */
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { cases } from "./final";
const at = "2026-12-02T03:00:00.000Z";
async function main() { for (const id of process.argv.slice(2).length ? process.argv.slice(2) : ["annual-1", "major-1"]) { const c = cases().find(x => x.id === id)!;
  const b = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_mockrem${id.replace(/[^a-z0-9]/g, "")}0000`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", c.payload as never, at), people: async () => [] } });
  const r = (b.snapshot.evidencePacket as unknown as { meta: { review: Record<string, unknown> } }).meta.review;
  console.log(id, (r.briefCheck as { ok: boolean }).ok, JSON.stringify(r.rounds), "hard", JSON.stringify((r.remainingHard as { rule: string; at: string; sentence: string }[]).map(x => `${x.rule}@${x.at}`)), "replaced", JSON.stringify(r.replaced));
} }
void main().catch(e => { console.error(e); process.exit(1); });
