/**
 * AM2 가짜 작가 전 과정(호출 0): AM 평가 사례를 운영과 같은 발행 함수(buildV5Snapshot → 장 묶음)로 만든다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-mock.ts [case…]
 * 묶음 수·다시 쓰기·삭제·대체·남은 차단 결함·형식 검사·투영을 한 줄씩. 결과는 작업 폴더 밖 임시 경로(고객 원고 아님).
 */
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { projectV5Book, validateV5Publication, type V5Evidence } from "../../src/lib/writer/book";
import { cases } from "./final";

async function main() {
  const ids = process.argv.slice(2), at = "2026-12-02T03:00:00.000Z";
  for (const c of cases().filter(x => x.product !== "launch" && (!ids.length || ids.includes(x.id)))) {
    const sink = memorySink() as never, saves: number[] = [];
    const wrapped = { save: async (x: { n: number }) => { saves.push(x.n); return (sink as { save: (y: unknown) => Promise<boolean> }).save(x); }, load: () => (sink as { load: () => Promise<unknown[]> }).load() } as never;
    const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_mock${c.id.replace(/[^a-z0-9]/g, "")}000000`, policyAt: at, sink: wrapped, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", c.payload as never, at), people: async () => [] } });
    const snap = built.snapshot, e = snap.evidencePacket as unknown as V5Evidence, r = e.meta.review as Record<string, unknown>;
    const v = validateV5Publication(snap.productType, snap.draft, snap.evidencePacket), book = projectV5Book(snap as never, "2026-12-02");
    const d = snap.draft as unknown as { chapters: { sections: { paragraphs: string[] }[] }[] };
    const chars = d.chapters.reduce((a, ch) => a + ch.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0), 0);
    console.log(`${c.id}: 검사 ${v.ok ? "OK" : v.errors.join(",")} · 쪽 ${book?.pages.length ?? 0} · ${chars}자 · 호출 ${e.meta.calls.length} · 저장 순서 ${saves.join(",")} · 브리프 검사 ${(r.briefCheck as { ok: boolean }).ok ? "OK" : "FAIL"} · 차단 첫 ${r.blockFirst} · 다시 쓰기 ${JSON.stringify(r.rounds)} · 지움 ${(r.deleted as unknown[]).length} · 대체 ${JSON.stringify(r.replaced)} · 남은 차단 ${(r.remainingHard as unknown[]).length} · 문체 ${JSON.stringify(r.style)}`);
  }
}
void main().catch(e => { console.error(e); process.exit(1); });
