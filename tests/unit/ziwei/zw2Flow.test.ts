// ZW-2 6부 가짜 작가 전 과정(호출 0): 7부 시험 인물 5명 — 형식 OK · 처리 없는 깃발 0 · 30분 흐름 관문 판정 · 판매 닫힘 경로.
//  + 걸린 문장이 있으면 문단 교체 1회 → 그래도 남으면 그 문장을 지운다 · 빠진 묶음은 보류(결정론 대체본 없음).
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
import { projectV5Book, validateV5Publication } from "../../../src/lib/writer/book";
import { ziweiMockChunk } from "../../../src/lib/writer/chunked/ziweiMock";
import { ziweiPlanFor, type ZiweiReview } from "../../../src/lib/writer/chunked/ziweiPublish";
import { judgeBuild } from "../../../src/lib/ops/generation/policy";
import { productOnSale } from "../../../src/lib/ops/config";
import { writerModeOf } from "../../../src/lib/writer/mode";
import { WRITER_TIME_BUDGET_MS } from "../../../src/lib/writer/runner";
import type { StreamCompletionInput, StreamCompletionResult } from "../../../src/lib/llm/types";
import { Z5_PEOPLE, type TestPerson } from "./zw2People";

const AT = "2026-12-02T01:00:00.000Z";
const payloadOf = (tp: TestPerson) => ({ productKey: "ziwei_full", productSlug: "ziwei-full",
  person: { name: tp.person.name, birthDate: tp.input.birthDate, birthTimePrecision: tp.input.birthTimePrecision ?? "exact", birthTime: tp.input.birthTime ?? "", birthTimeUnknown: false, approximateBirthTimeSlot: tp.input.approximateBirthTimeSlot ?? "", gender: tp.input.gender, mbtiType: tp.person.mbti ?? "" },
  userContext: { relationshipStatus: tp.person.relationshipStatus, jobStatus: tp.person.jobStatus, detailJob: tp.person.detailJob, focusAreas: [] }, productOptions: tp.person.children ? { children: tp.person.children } : {} }) as never;
type Built = Awaited<ReturnType<typeof buildV5Snapshot>> & { review: ZiweiReview };
const streamOf = (fn: (user: string) => string) => async (input: StreamCompletionInput): Promise<StreamCompletionResult> => { const text = fn(input.user); input.onText?.(text); return { text, finishReason: "complete", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "zw2-flow" }; };
const build = async (tp: TestPerson, fn?: (user: string, base: string) => string) => {
  const payload = payloadOf(tp), intake = ziweiPlanFor(payload, AT).intake;
  const t0 = Date.now();
  const r = await buildV5Snapshot({ payload, reportId: "report_zw2flow000001", policyAt: AT, sink: { save: async () => true, load: async () => [] },
    deps: { provider: "anthropic", model: "claude-mock", fallback: null, stream: streamOf(u => { const base = ziweiMockChunk(intake, u) ?? ""; return fn ? fn(u, base) : base; }) } }) as Built;
  return { r, ms: Date.now() - t0, intake };
};

describe("가짜 작가 전 과정 — 시험 인물 5명", () => {
  it.each(Z5_PEOPLE.map(p => [p.id, p] as const))("%s: 형식 · 깃발 처리 · 관문 complete · 투영", async (_id, tp) => {
    const { r, ms, intake } = await build(tp);
    const d = r.snapshot.draft as unknown as { chapters: { n: number; sections: { heading: string; paragraphs: string[]; keySpans?: unknown[] }[] }[]; ziwei: { calcVersion: string } };
    expect(d.chapters.map(c => c.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const c of d.chapters) {
      const plan = intake.chapters.find(x => x.n === c.n)!;
      expect(c.sections.length).toBe(plan.sections!.length);
      for (const s of c.sections) { expect(s.paragraphs.length).toBeGreaterThan(0); expect(s.paragraphs.join("")).not.toMatch(/[⟪⟫]/); expect((s.keySpans ?? []).filter(Boolean).length).toBe(1); }
    }
    // 처리 없는 깃발 0: 첫 원고 깃발은 모두 교체 · 지우기 · 보류 가운데 하나로 끝났다(가짜 작가는 깃발 0).
    expect(r.review.first.filter(f => f.branch)).toEqual([]); expect(r.review.final.filter(f => f.branch)).toEqual([]); expect(r.review.hold).toEqual([]);
    expect(judgeBuild({ meta: r.meta, run: r.run })).toMatchObject({ kind: "complete" });
    expect(r.meta.calls.filter(c => c.kind === "first")).toHaveLength(6);
    expect(r.meta.costUsd).toBe(0);
    expect(ms).toBeLessThan(WRITER_TIME_BUDGET_MS);
    expect(validateV5Publication("ziwei_full", r.snapshot.draft, r.snapshot.evidencePacket).ok).toBe(true);
    expect(d.ziwei.calcVersion).toBe("ziwei-v1-sanhe-kasi");
    expect(projectV5Book(r.snapshot)?.bookId).toBe("ziwei");
  }, 60_000);
});

describe("걸린 문장 · 빠진 묶음", () => {
  const BAD = "2028년에는 반드시 결혼하게 됩니다.";
  it("걸린 문단은 교체 1회로 고친다(교체 원고가 걸린 문장을 뺌)", async () => {
    let injected = 0;
    const { r } = await build(Z5_PEOPLE[2], (u, base) => {
      if (u.includes("\n고칠 자리:\n")) return base; // 가짜 작가의 교체 = 걸린 문장을 뺀 문단
      if (!injected && /## 5\. /.test(base)) { injected++; return base.replace(/(## 5\. [^\n]+\n### [^\n]+\n)([^\n]+)/, (_m, h: string, p: string) => `${h}${p} ${BAD}`); }
      return base;
    });
    expect(r.review.first.some(f => f.rule === "future_event")).toBe(true);
    expect(r.review.rounds).toBe(1); expect(r.review.replaced).toBeGreaterThan(0);
    expect(r.review.final.filter(f => f.branch)).toEqual([]);
    expect(JSON.stringify(r.snapshot.draft)).not.toContain(BAD);
    expect(judgeBuild({ meta: r.meta, run: r.run })).toMatchObject({ kind: "complete" });
  }, 60_000);
  it("교체가 못 고치면 그 문장을 지운다(문단은 남김)", async () => {
    let injected = 0;
    const { r } = await build(Z5_PEOPLE[2], (u, base) => {
      if (u.includes("\n고칠 자리:\n")) return base.replace(/^(\[¶[^\]]+\]\n)(.*)$/m, (_m, h: string, p: string) => `${h}${p} ${BAD}`); // 교체도 같은 문장을 다시 넣는다
      if (!injected && /## 5\. /.test(base)) { injected++; return base.replace(/(## 5\. [^\n]+\n### [^\n]+\n)([^\n]+)/, (_m, h: string, p: string) => `${h}${p} ${BAD}`); }
      return base;
    });
    expect(r.review.cut.some(c => c.rule === "future_event")).toBe(true);
    expect(JSON.stringify(r.snapshot.draft)).not.toContain(BAD);
    expect(judgeBuild({ meta: r.meta, run: r.run })).toMatchObject({ kind: "complete" });
  }, 60_000);
  it("빠진 묶음(9장)은 결정론으로 채우지 않고 보류 — 관문 incomplete", async () => {
    const { r } = await build(Z5_PEOPLE[0], (u, base) => (/## 9\. /.test(base) && !u.includes("\n고칠 자리:\n") ? "" : base));
    expect(r.review.hold.some(h => h.startsWith("9장"))).toBe(true);
    const v = judgeBuild({ meta: r.meta, run: r.run });
    expect(v.kind).toBe("incomplete");
    expect((r.snapshot.draft as unknown as { chapters: { n: number; sections: unknown[] }[] }).chapters.find(c => c.n === 9)!.sections).toEqual([]);
  }, 60_000);
});

describe("30분 흐름 · 판매 닫힘 경로", () => {
  it("장 묶음 작가 방식(감독 2차 = 빠진 묶음만) · 판매 닫힘(결제 · 이용권 진입 전에 거절)", () => {
    expect(writerModeOf("ziwei_full")).toBe("chunked");
    for (const t of [Date.parse("2026-11-30T00:00:00Z"), Date.parse("2026-12-01T00:00:00Z"), Date.parse("2027-06-01T00:00:00Z")]) expect(productOnSale("ziwei_full", {}, t)).toBe(false);
  });
});
