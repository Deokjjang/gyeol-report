/** P6 자동 점검 고침 확인(호출 0): 가짜 작가 전 과정 책에서 달·해 key 문단 수 · 남은 차단 · 교체 대상(검토 폴더에 쓰지 않는다). */
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { payloadFor } from "./am2-6-books";
const at = "2026-12-02T03:00:00.000Z";
async function main() { for (const id of process.argv.slice(2)) {
  const p = payloadFor(id);
  const built = await buildV5Snapshot({ payload: p as never, reportId: `report_am26mc${id.replace(/[^a-z0-9]/g, "")}00`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", p as never, at), people: async () => [] } });
  const d = built.snapshot.draft as unknown as { chapters: { n: number; keys?: string[]; sections: { heading: string; paragraphs: string[] }[] }[] };
  const r = (built.snapshot.evidencePacket as unknown as { meta: { review: { remainingHard?: unknown[]; remainingFix?: { rule: string }[] } } }).meta.review;
  const np = d.chapters.flatMap(c => c.sections.filter(s => c.keys?.includes(s.heading)).map(s => s.paragraphs.length));
  const hist = np.reduce<Record<number, number>>((o, n) => ({ ...o, [n]: (o[n] ?? 0) + 1 }), {});
  console.log(`${id}: key ${np.length} · 문단 수 ${JSON.stringify(hist)} · 남은 차단 ${(r.remainingHard ?? []).length} · 남은 교체 대상 ${(r.remainingFix ?? []).length}`);
} }
void main();
