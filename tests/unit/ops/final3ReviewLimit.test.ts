// 최종판3 추가 지시: 운영 검수(Haiku 5.5) 호출의 생각·출력 상한.
// - 생각 예산(budget_tokens)은 Haiku 5.5에서 400이라 보내지 않고, effort low로 생각을 줄인다.
// - max_tokens는 생각 + 지적 JSON 최대를 덮는 고정값(HAIKU_REVIEW_MAX_TOKENS)이다.
// - 그래도 상한에 닿아 글자 없이 끝나면 같은 한도로는 다시 부르지 않고(HOTFIX-W1: 비용·시간 안에서 더 큰 한도로 1회만) 검수만 건너뛰어 발행한다.
import { describe, expect, it } from "vitest";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { HAIKU_REVIEW_MAX_TOKENS, REVIEW_MAX_ISSUES, reviewMaxTokens } from "@/lib/writer/review";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../helpers/opsMocks";

const policyAt = "2026-10-27T03:00:00.000Z";
const input = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(input, policyAt);

async function runOnce(reviewBehavior: Parameters<typeof mockAnthropic>[0][number], reviewTimes = 1) {
  const clock = fakeClock(), ops = memoryOpsStore(clock), a = mockAnthropic([{ text }, ...Array(reviewTimes).fill(reviewBehavior), { text: "[R1] (삭제)" }]), o = mockOpenAiWithBody([{ text }]);
  const env = { store: ops.store, now: clock.now, openAiKey: null,
    deps: { fetchImpl: routedFetch(a, o), sleep: clock.sleep, now: clock.now, apiKey: "test-key", reviewModel: "claude-haiku-5-5", people: async () => [] } };
  const job = { reportId: "report_final3_limit_0001", origin: "paid" as const, originRef: "payment_order_limit", payload: input, policyAt, sink: memorySink(), budgetMs: 480_000 };
  const r = await superviseQueueJob(job, env, async (d: Decision) => { if (d.kind === "publish") ops.snapshots.set(job.reportId, d.snapshot); return { ok: true }; });
  return { a, d: r.decision };
}

describe("운영 검수 호출(Haiku 5.5): 생각·출력 상한", () => {
  it("상한은 지적 최대 개수의 JSON과 실측 생각 최대(약 9.5천 토큰)의 두 배를 덮는다", () => {
    expect(reviewMaxTokens("claude-haiku-5-5")).toBe(HAIKU_REVIEW_MAX_TOKENS);
    // 지적 1개 실측 약 145토큰(최종판3 측정 17권). 상한 개수를 1.5배 넘겨 써도 + 생각 9.5천 × 2가 들어가야 한다.
    expect(HAIKU_REVIEW_MAX_TOKENS).toBeGreaterThanOrEqual(Math.ceil(REVIEW_MAX_ISSUES * 1.5 * 145 + 9_500 * 2));
  });

  it("요청 본문: budget_tokens 없음, effort low, JSON 스키마, max_tokens 고정값", async () => {
    const { a, d } = await runOnce({ text: JSON.stringify({ issues: [] }) });
    expect(d.kind).toBe("publish");
    const review = a.calls.find(c => (c.body.output_config as { format?: unknown } | undefined)?.format);
    expect(review).toBeTruthy();
    const body = review!.body as { model: string; max_tokens: number; thinking?: { budget_tokens?: number }; output_config: { effort: string; format: { type: string } } };
    expect(body.model).toBe("claude-haiku-5-5");
    expect(body.max_tokens).toBe(HAIKU_REVIEW_MAX_TOKENS);
    expect(body.thinking?.budget_tokens).toBeUndefined();
    expect(body.output_config.effort).toBe("low");
    expect(body.output_config.format.type).toBe("json_schema");
  }, 60_000);

  // HOTFIX-W1 2부 7: 같은 한도로 되풀이하지 않고 한 번만 더 큰 한도(모델 상한, 비용·시간 안)로 → 그래도 글자 0이면 검수만 건너뛰고 발행.
  it("출력 상한에 닿아 글자 없이 끝나면: 더 큰 한도로 1회 더(같은 한도 재호출 없음) → 그래도 0자면 검수만 건너뛰고(length) 발행", async () => {
    const { a, d } = await runOnce({ text: "", finish: "incomplete" }, 2);
    expect(d.kind).toBe("publish");
    const reviewCalls = a.calls.filter(c => (c.body.output_config as { format?: unknown } | undefined)?.format);
    expect(reviewCalls.length).toBe(2);
    expect(Number(reviewCalls[1].body.max_tokens)).toBeGreaterThan(Number(reviewCalls[0].body.max_tokens));
    const meta = d.kind === "publish" ? (d.meta as unknown as { review?: { skipped: string | null; calls: number } }) : null;
    expect(meta?.review?.skipped).toBe("length");
    expect(meta?.review?.calls).toBe(2);
  }, 60_000);
});
