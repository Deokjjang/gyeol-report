// 최종판3 6: 운영 워커 경로(superviseQueueJob → buildV5Snapshot)에서 호출 원문을 받는 즉시 주문 번호 키로 저장하고,
// 재시도(같은 주문의 다음 시도)는 저장본을 써 같은 입력을 다시 부르지 않는다. 응답 없이 끊긴 호출(출력 0)만 1회 다시 부른다.
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink, opsRawCache, type OpsStore } from "@/lib/ops/generation/sinks";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../helpers/opsMocks";

const policyAt = "2026-10-27T03:00:00.000Z";
const input = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(input, policyAt);
const REVIEW_JSON = JSON.stringify({ issues: [] });

/** ops_writer_raw RPC를 흉내 내는 저장소(주문 번호 + 키, 처음 받은 원문을 덮지 않는다). */
function memoryRawStore() {
  const rows = new Map<string, Map<string, unknown>>(), log: string[] = [];
  const store: OpsStore = { async call(action, data) {
    log.push(action);
    const id = String(data.reportId), m = rows.get(id) ?? new Map<string, unknown>(); rows.set(id, m);
    if (action === "raw_save") { const e = data.entry as { key: string }; if (!m.has(e.key)) m.set(e.key, e); return { ok: true }; }
    if (action === "raw_load") return { ok: true, entries: [...m.values()] };
    return { ok: false, code: "UNKNOWN_ACTION" };
  } };
  return { store, rows, log };
}

function harness(behaviors: Parameters<typeof mockAnthropic>[0]) {
  const clock = fakeClock(), ops = memoryOpsStore(clock), a = mockAnthropic(behaviors), o = mockOpenAiWithBody([{ text }]);
  const raw = memoryRawStore();
  let crash = true;
  const env = { store: ops.store, now: clock.now, openAiKey: null,
    // 첫 시도는 원고·검수·수리를 다 받은 뒤 조립 단계(만세력 표)에서 죽는다(워커가 발행 직전에 끊긴 경우).
    deps: { fetchImpl: routedFetch(a, o), sleep: clock.sleep, now: clock.now, apiKey: "test-key", reviewModel: "claude-haiku-5-5",
      people: async () => { if (crash) { crash = false; throw new Error("worker crash after calls"); } return []; } } };
  const sink = memorySink();
  const job = { reportId: "report_final3_raw_0001", origin: "paid" as const, originRef: "payment_order_raw", payload: input, policyAt, sink, budgetMs: 480_000, raw: opsRawCache(raw.store, "report_final3_raw_0001", "lease-token") };
  const run = async () => {
    const decisions: Decision[] = [];
    const r = await superviseQueueJob(job, env, async d => { decisions.push(d); if (d.kind === "publish") ops.snapshots.set(job.reportId, d.snapshot); return { ok: true }; });
    return r.decision;
  };
  return { a, raw, run, job };
}

describe("운영 워커: 원문 즉시 저장 → 재시도는 저장본(최종판3 6)", () => {
  it("첫 시도가 조립 단계에서 죽어도, 다음 시도는 작가·검수·수리를 다시 부르지 않고 발행한다", async () => {
    const h = harness([{ text }, { text: REVIEW_JSON }, { text: "[R1] (삭제)" }]);
    const d1 = await h.run();
    expect(d1.kind).toBe("defer");
    const callsAfterFirst = h.a.calls.length;
    expect(callsAfterFirst).toBeGreaterThanOrEqual(2); // 작가 + 검수(+ 수리 항목이 있으면 수리)
    const saved = h.raw.rows.get(h.job.reportId)!;
    expect(saved.size).toBe(callsAfterFirst); // 받은 응답마다 하나씩, 받는 즉시 저장
    const d2 = await h.run();
    expect(d2.kind).toBe("publish");
    expect(h.a.calls.length).toBe(callsAfterFirst); // 재시도에서 호출 0(저장본만)
    const meta = d2.kind === "publish" ? d2.meta : null;
    expect(meta?.calls.filter(c => !c.cached).length).toBe(0);
    expect(meta?.calls.some(c => c.kind === "review")).toBe(true);
  }, 60_000);

  it("응답 없이 끊긴 호출(출력 0, 429)은 한 번만 다시 부르고, 두 번째도 실패하면 이번 시도는 끝낸다(다음 시도로 미룸)", async () => {
    const h = harness([{ status: 429 }, { status: 429 }, { text }]);
    const d1 = await h.run();
    expect(h.a.calls.length).toBe(2); // 첫 호출 + 재시도 1회
    expect(d1.kind).toBe("defer");
  }, 60_000);
});
