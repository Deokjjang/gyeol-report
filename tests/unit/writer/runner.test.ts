import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { maxTokensFor, runWriter, type ChapterSink, type SavedChapter } from "@/lib/writer/runner";
import { applySafetyNet } from "@/lib/writer/safety";
import { mockBookText, mockOpenAi, type MockBehavior } from "../../helpers/llmMock";

const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const brief = buildBrief({ product: "saju_mbti_full", baseDate: "2026-10-27", person: { name: "하람", gender: "MALE", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, mbtiType: "ENTJ", context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자" } } }, k);
const plan = buildWriterPrompt(brief).chapters;
const full = mockBookText(brief);
const half = full.indexOf(`## 7. `);

function memorySink(stale = false): ChapterSink & { saved: SavedChapter[] } {
  const saved: SavedChapter[] = [];
  return { saved, async save(c) { if (stale && saved.length >= 2) return false; saved.push(c); return true; }, async load() { return saved; } };
}
async function run(behaviors: MockBehavior[], opts: { stale?: boolean; budgetMs?: number } = {}) {
  const m = mockOpenAi(behaviors), sink = memorySink(opts.stale);
  const r = await runWriter({ brief, provider: "openai", model: "gpt-4o-mini", apiKey: "sk-test-mock", sink, fetchImpl: m.fetch, sleep: async () => undefined, ...(opts.budgetMs ? { budgetMs: opts.budgetMs } : {}) });
  const finals = applySafetyNet(brief, plan, r.drafts).chapters;
  return { r, m, sink, sources: finals.map(f => f.source) };
}

describe("작가 실행기 — 실패 주입(목업, 비용 0)", () => {
  it("정상: 호출 1회로 13장 전부 작가 원고, 장 경계마다 저장", async () => {
    const { r, m, sink, sources } = await run([{ text: full }]);
    expect(m.calls).toHaveLength(1);
    expect(sink.saved.map(s => s.n)).toEqual(plan.map(c => c.n));
    expect(sources.every(s => s === "writer")).toBe(true);
    expect(r.calls[0].maxTokens).toBe(maxTokensFor(plan, "gpt-4o-mini"));
  });

  it("출력 전 5xx·429: 시간 예산 안에서 재시도해 성공", async () => {
    const { m, sources, r } = await run([{ status: 503 }, { status: 429 }, { text: full }]);
    expect(m.calls).toHaveLength(3);
    expect(r.calls.map(c => c.kind)).toEqual(["first", "retry", "retry"]);
    expect(sources.every(s => s === "writer")).toBe(true);
  });

  it("출력 0이어도 재시도하지 않는 실패(401): 전부 결정론 작가", async () => {
    const { m, sources } = await run([{ status: 401 }]);
    expect(m.calls).toHaveLength(1);
    expect(sources.every(s => s === "deterministic")).toBe(true);
  });

  it("중간 끊김: 받은 장 확정 + 누락 장만 이어쓰기 1회", async () => {
    const cont = mockBookText(brief, plan.slice(5));
    const { m, sources } = await run([{ text: full, cutAt: half + 40 }, { text: cont }]);
    expect(m.calls).toHaveLength(2);
    expect(String((m.calls[1].body as { input: string }).input)).toContain("남은 장만 이어서");
    expect(sources.slice(0, 6)).toEqual(Array(6).fill("writer"));
    expect(sources.slice(6)).toEqual(Array(7).fill("continuation"));
  });

  it("length 종료: 잘린 마지막 장은 버리고 이어쓰기, 이어쓰기도 모자라면 결정론", async () => {
    const cont = mockBookText(brief, plan.slice(6, 9));
    const { sources } = await run([{ text: full.slice(0, half + 40), finish: "incomplete" }, { text: cont, finish: "incomplete" }]);
    expect(sources.slice(0, 6).every(s => s === "writer")).toBe(true);
    expect(sources.slice(6, 8).every(s => s === "continuation")).toBe(true);
    expect(sources.slice(9).every(s => s === "deterministic")).toBe(true);
  });

  it("타임아웃(시간 예산 소진): 받은 장 + 나머지 결정론", async () => {
    const { sources, r } = await run([{ text: full, cutAt: half + 40, hang: true }], { budgetMs: 8_000 });
    expect(r.calls[0].finish).toBe("timeout");
    expect(sources.slice(0, 6).every(s => s === "writer")).toBe(true);
    expect(sources.slice(6).every(s => s === "deterministic")).toBe(true);
  }, 20_000);

  it("lease를 잃으면(save=false) 스트림을 끊고 stale로 끝낸다", async () => {
    const { r, sink } = await run([{ text: full }], { stale: true });
    expect(r.stale).toBe(true);
    expect(sink.saved).toHaveLength(2);
  });
});
