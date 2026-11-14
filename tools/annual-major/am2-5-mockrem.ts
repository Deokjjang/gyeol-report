/** AM2-5(호출 0): 가짜 작가 전 과정의 남은 차단·되돌림·처리 기록을 규칙별로. */
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { V5Evidence } from "../../src/lib/writer/book";
import { cases } from "./final";
async function main() {
  const ids = process.argv.slice(2), at = "2026-12-02T03:00:00.000Z";
  for (const c of cases().filter(x => x.product !== "launch" && (!ids.length || ids.includes(x.id)))) {
    const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_mock${c.id.replace(/[^a-z0-9]/g, "")}000000`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", c.payload as never, at), people: async () => [] } });
    const r = (built.snapshot.evidencePacket as unknown as V5Evidence).meta.review as Record<string, unknown>;
    const hard = (r.remainingHard as { at: string; rule: string; detail: string; sentence: string }[]);
    const tally = hard.reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
    console.log(`${c.id}: 남은 차단 ${JSON.stringify(tally)} · 되돌림 ${(r.reverted as unknown[]).length} · 처리 ${JSON.stringify((r.disposition as { counts: unknown }).counts)}`);
    for (const f of hard.slice(0, Number(process.env.SHOW ?? 0))) console.log(`   ${f.at} ${f.rule} ${f.detail} | ${f.sentence.slice(0, 120)}`);
  }
}
void main();
