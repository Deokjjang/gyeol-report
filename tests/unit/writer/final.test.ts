/**
 * 최종판 회귀(호출 0): 0번 비용 구조(작가 1회·원문 저장소·주문당 상한·예산 관문)와 1번 새 검사·정리(오행 개수·십성 세기·궁합 장면 주인·다섯 힘 이름·표기·핵심 이미지).
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { avoidImagesFor, avoidNounsIn, imageNoun } from "@/lib/brief/imageLedger";
import { matchJob } from "@/lib/brief/props";
import type { Brief } from "@/lib/brief/schema";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { superviseQueueJob, type Decision } from "@/lib/ops/generation/supervisor";
import { memorySink } from "@/lib/ops/generation/sinks";
import { orderCostCap, spentOf } from "@/lib/ops/generation/policy";
import { payloadToBriefInput } from "@/lib/writer/book";
import { buildWriterPrompt, renderWriterBrief } from "@/lib/writer/prompt";
import { WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { coverProblem, lintContext } from "@/lib/writer/publish";
import { dropHardSections } from "@/lib/writer/repair";
import * as Runner from "@/lib/writer/runner";
import type { FinalChapter } from "@/lib/writer/safety";
import { applySafetyNet } from "@/lib/writer/safety";
import { elementCountClaims, elementOwnedClaims, groupClaims } from "@/lib/writer/safety/lint";
import { lintBook, tidyBook } from "@/lib/writer/safety/p6c";
import * as E from "@/lib/writer/safety/p6e";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../helpers/opsMocks";
import { P6D_CASES } from "../../../tools/p6d/cases";

const k = loadKnowledge();
const brief = (id: string): Brief => {
  const c = P6D_CASES.find(x => x.id === id)!, n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") });
  if (!n.ok) throw new Error(n.error);
  return buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k);
};
const B = { sodam: brief("sodam-full"), taeo: brief("taeo-career"), pair: brief("pair-business") };
const ctxOf = (b: Brief) => lintContext(b, k, buildWriterPrompt(b, { knowledge: k }).chapters, []);
const rulesOf = (b: Brief, text: string) => lintBook([{ n: 2, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h0", paragraphs: ["앞 문단이에요."] }, { heading: "h1", paragraphs: ["앞 문단이에요.", text] }] }], ctxOf(b)).map(f => f.rule);

describe("0-1 작가 1회", () => {
  it("장 재요청 경로(redoChapters)는 없다", () => { expect("redoChapters" in Runner).toBe(false); });
  it("짧은 작가 장도 버리지 않는다(결정론 장은 빠진 장뿐)", () => {
    const plan = buildWriterPrompt(B.sodam).chapters, ch = plan.find(c => !c.keys)!;
    const drafts = new Map([[ch.n, { source: "writer" as const, chapter: { n: ch.n, title: ch.title, sections: [{ heading: "짧은 소제목", paragraphs: ["짧은 문단이에요."] }] } }]]);
    const { chapters } = applySafetyNet(B.sodam, plan, drafts);
    const got = chapters.find(c => c.n === ch.n)!;
    expect(got.source).toBe("writer"); expect(got.reason).toMatch(/^short:/); expect(got.sections[0].paragraphs[0]).toBe("짧은 문단이에요.");
    expect(chapters.filter(c => c.n !== ch.n).every(c => c.source === "deterministic" && c.reason === "missing")).toBe(true);
  });
  it("재작성 뒤에도 걸린 소제목은 빼되 장은 비우지 않는다", () => {
    const flag = (section: number) => ({ chapter: 3, section, paragraph: 0, rule: "pillar_claim" as const, sentence: "x", hint: "h" });
    const chs: FinalChapter[] = [{ n: 3, id: "c", title: "t", source: "writer", chars: 0, sections: [{ heading: "a", paragraphs: ["1"] }, { heading: "b", paragraphs: ["2"] }] }];
    const one = dropHardSections(chs, [{ chapter: 3, section: 0, flags: [flag(0)] }]);
    expect(one.chapters[0].sections.map(s => s.heading)).toEqual(["b"]);
    const all = dropHardSections(chs, [{ chapter: 3, section: 0, flags: [flag(0)] }, { chapter: 3, section: 1, flags: [flag(1)] }]);
    expect(all.chapters[0].sections.length).toBe(1); expect(all.kept).toEqual(["3.0"]);
  });
});

describe("0-2 원문 저장소·0-6 상한(runner)", () => {
  const plan = () => buildWriterPrompt(B.sodam, { knowledge: k });
  const sink = () => { const m = new Map<number, Runner.SavedChapter>(); return { async save(c: Runner.SavedChapter) { m.set(c.n, c); return true; }, async load() { return [...m.values()]; } }; };
  it("같은 입력 해시면 부르지 않고 저장본을 쓰며, 원문을 남긴다", async () => {
    const p = plan(), text = p.chapters.map(c => `## ${c.n}. ${c.title}\n### 소제목\n문단이에요.`).join("\n\n");
    const store = new Map<string, Runner.RawEntry>(), cache: Runner.WriterCache = { get: key => store.get(key) ?? null, put: e => { store.set(e.key, e); } };
    let calls = 0;
    const stream: typeof import("@/lib/llm").streamCompletion = async i => { calls++; i.onText?.(text); return { text, finishReason: "complete", usage: { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10 }, costUsd: 0.1, requestId: "r1" }; };
    const o = { brief: B.sodam, provider: "anthropic" as const, model: "claude-sonnet-5-5", sink: sink(), knowledge: k, stream, cache };
    const a = await Runner.runWriter(o);
    expect(calls).toBe(1); expect(a.raw).toHaveLength(1); expect(a.raw[0].key).toBe(Runner.rawKey("claude-sonnet-5-5", p.system, p.user)); expect(a.costUsd).toBeCloseTo(0.1);
    const b = await Runner.runWriter({ ...o, sink: sink() });
    expect(calls).toBe(1); expect(b.calls[0].cached).toBe(true); expect(b.costUsd).toBe(0); expect(b.drafts.size).toBe(p.chapters.length);
  });
  it("비용 상한을 넘으면 더 부르지 않는다(cost_cap)", async () => {
    let calls = 0;
    const stream: typeof import("@/lib/llm").streamCompletion = async () => { calls++; return { text: "", finishReason: "error", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "x", message: "x" } }; };
    const r = await Runner.runWriter({ brief: B.sodam, provider: "anthropic", model: "claude-sonnet-5-5", sink: sink(), knowledge: k, stream, costCapUsd: 0 });
    expect(calls).toBe(0); expect(r.capped).toBe(true); expect(r.calls[0].error).toBe("cost_cap");
  });
});

describe("0-6 주문당 상한(감독)", () => {
  it("설정값 기본 $0.60, 지난 시도 비용 합", () => {
    expect(orderCostCap({})).toBe(0.6); expect(orderCostCap({ ORDER_COST_CAP_USD: "0.8" })).toBe(0.8); expect(orderCostCap({ ORDER_COST_CAP_USD: "abc" })).toBe(0.6);
    expect(spentOf([{ cost_usd: "0.2", created_at: "2026-11-04T00:00:00Z" }, { cost_usd: 0.45, created_at: "2026-11-04T01:00:00Z" }])).toBeCloseTo(0.65);
    expect(spentOf([{ cost_usd: 0.2, created_at: "2026-11-04T00:00:00Z" }, { cost_usd: 0.45, created_at: "2026-11-04T01:00:00Z" }], "2026-11-04T00:30:00Z")).toBeCloseTo(0.45);
  });
  it("지난 시도 비용이 상한에 이르면 부르지 않고 보류(hold), 사유는 지연 목록에 남는다", async () => {
    const policyAt = "2026-10-27T03:00:00.000Z", n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload");
    const { text } = mockTextFor(n.value, policyAt);
    const clock = fakeClock(), ops = memoryOpsStore(clock), a = mockAnthropic([{ text }]), o = mockOpenAiWithBody([]);
    const job = { reportId: "report_final_cap_0001", origin: "paid" as const, originRef: "po", payload: n.value, policyAt, sink: memorySink(), budgetMs: 480_000 };
    await ops.store.call("begin", { reportId: job.reportId, origin: "paid", originRef: "po" });
    await ops.store.call("record", { reportId: job.reportId, run: { lane: "queue", outcome: "deferred", reason: "x", costUsd: 0.61 }, state: {} });
    const decisions: Decision[] = [];
    const r = await superviseQueueJob(job, { store: ops.store, now: clock.now, openAiKey: null, deps: { fetchImpl: routedFetch(a, o), sleep: clock.sleep, now: clock.now, people: async () => [], apiKey: "k" } }, async d => { decisions.push(d); return { ok: true }; });
    expect(r.decision.kind).toBe("hold"); expect(a.calls).toHaveLength(0);
    expect(String((r.decision as { reason: string }).reason)).toMatch(/cost_cap 주문당 비용 상한 \$0\.6/);
    expect(ops.states.get(job.reportId)!.last_reason).toMatch(/cost_cap/);
  });
});

describe("0-5 예산 관문(tools/llm/budget.ts)", () => {
  it("범위 상한·실행 예산을 넘는 호출은 부르기 전에 거절, 같은 입력 해시 재생성 거절, 원장·비용 표에 남긴다", async () => {
    const dir = mkdtempSync(join(tmpdir(), "budget-")), log = join(dir, "cost.md");
    writeFileSync(log, "| a | b |\n|---|---|\n누적 합계: **$0.00000000**\n");
    process.env.LLM_CACHE_DIR = dir; process.env.LLM_COST_LOG = log;
    try {
      const B2 = await import("../../../tools/llm/budget");
      B2.ensureScope("t", 0.05, "시험");
      let inner = 0;
      const g = B2.budgetGate({ scope: "t", run: "r1", runBudget: 1, stage: "시험", inner: async () => { inner++; return { text: "x", finishReason: "complete", usage: { inputTokens: 100, cachedInputTokens: 0, outputTokens: 100 }, costUsd: 0.001, requestId: "req" }; } });
      const call = (maxOutputTokens: number, user = "u") => g.stream({ provider: "anthropic", model: "claude-sonnet-5-5", system: "s", user, maxOutputTokens, timeoutMs: 1000 });
      expect((await call(100)).text).toBe("x"); expect(inner).toBe(1);
      const big = await call(100_000); expect(big.error?.code).toBe("budget_refused"); expect(inner).toBe(1);
      await g.cache.get("k1"); const r = B2.readLedger(); r.calls.push({ ...r.calls[0], key: "k1" }); writeFileSync(join(dir, "llm-ledger.json"), JSON.stringify(r));
      await g.cache.get("k1"); expect((await call(100)).error?.code).toBe("budget_refused"); expect(g.refusals().some(x => /같은 입력 해시/.test(x))).toBe(true);
      expect(readFileSync(log, "utf8")).toMatch(/누적 합계: \*\*\$0\.00100000\*\*/);
      // 출력 0·비용 0인 실패(401 등)는 재생성으로 세지 않는다 — 같은 입력을 다시 부를 수 있다.
      const r2 = B2.readLedger(); r2.calls.push({ ...r2.calls[0], key: "k401", output: 0, costUsd: 0, finish: "error:http_401" }); writeFileSync(join(dir, "llm-ledger.json"), JSON.stringify(r2));
      await g.cache.get("k401"); expect((await call(100)).text).toBe("x"); expect(inner).toBe(2);
      expect(B2.startGate({ scope: "t", runBudget: 1, books: 1, log: () => undefined }).ok).toBe(false);
      expect(() => B2.budgetGate({ scope: "t", run: "r2", runBudget: 0, stage: "x" })).toThrow();
    } finally { delete process.env.LLM_CACHE_DIR; delete process.env.LLM_COST_LOG; }
  });
});

describe("최종판 5 판정에서 찾은 것", () => {
  it("자녀 미입력인데 '없다' 단정, 조건형 규칙을 독자 안내로 옮긴 문장(장덕민 연애 7·8장)", async () => {
    const { sentenceViolation } = await import("@/lib/writer/safety/sentences");
    const f = { relationship: "single", children: "unknown", job: "business", birthTimeKnown: true, mbti: "ENTJ" } as never;
    expect(sentenceViolation("지금은 자녀가 없으니 아이를 키우게 된다면이라는 조건으로 읽어 주세요.", f, undefined, false, true)).toBe("fact_children");
    expect(sentenceViolation("지금은 솔로이니 이 이야기는 함께 살게 된다면이라는 조건으로 읽어 주세요.", f, undefined, true)).toBe("internal_label");
    expect(sentenceViolation("아이를 키우게 된다면 시간표가 먼저 보이는 사람이에요.", f, undefined, false, true)).toBeNull();
  });
  it("MBTI 계획 단서: 'INTP는 … 한 달 전부터 준비하는 유형'(장소담 종합 10장)은 오귀속", async () => {
    const { mbtiMisattr } = await import("@/lib/writer/safety/p6c");
    const people = [{ type: "INTP", anchors: /INTP/, name: "장소담" }] as never;
    expect(mbtiMisattr("INTP는 기념일 달력에 날짜를 적어 두고 한 달 전부터 준비하는 유형입니다.", people)).toBe("INTP:planning+");
    expect(mbtiMisattr("INTP는 원리가 보이면 몰입하는 유형이에요.", people)).toBeNull();
  });
  it("자리 십성 어순이 거꾸로여도 엔진 값과 대조한다(장덕민 커리어 5장 \"정재가 월간에 앉은\")", () => {
    const pos = { yearStem: ["정재"], monthStem: ["정관"], monthBranch: ["정재", "상관", "정관"], dayBranch: ["편관", "편인", "편재"], hourStem: ["편재"], hourBranch: ["편재", "정인", "정재"], yearBranch: ["겁재"] } as never;
    expect(E.pillarClaims("정재가 월간에 앉은 당신은 꾸준한 사람에게 이끌려요.", pos)).toBe("monthStem:정재");
    expect(E.pillarClaims("정관이 월간에 앉아 있어 믿음을 줘요.", pos)).toBeNull();
    expect(E.pillarClaims("정재가 강해서 월간에 앉은 정관과 함께 일해요.", pos)).toBeNull();
  });
});

describe("1-5 사실 대조(새 검사)", () => {
  const presence = { WOOD: { surface: 2, hidden: true }, FIRE: { surface: 0, hidden: true }, EARTH: { surface: 3, hidden: true }, METAL: { surface: 1, hidden: false }, WATER: { surface: 0, hidden: false } };
  it("오행 개수: 없다·가장 많다·가장 적다", () => {
    expect(elementCountClaims("당신에게 없는 쇠를 채워 줘요.", presence)).toMatch(/METAL/);
    expect(elementCountClaims("쇠가 하나도 없어요.", presence)).toMatch(/METAL/);
    expect(elementCountClaims("나무가 가장 많은 사주예요.", presence)).toMatch(/WOOD:가장 많음/);
    expect(elementCountClaims("흙이 가장 많은 사주예요.", presence)).toBeNull();
    expect(elementCountClaims("물이 가장 적어요.", presence)).toBeNull();
    expect(elementOwnedClaims("남궁현님의 쇠 기운도 백은솔님에게 없는 쇠를 건넵니다.", [{ name: "백은솔", presence }])).toMatch(/백은솔:METAL/);
    expect(rulesOf(B.pair, "남궁현님의 쇠 기운도 백은솔님에게 없는 쇠를 건넵니다.")).toContain("element_count");
  });
  it("십성 세기는 묶음 세기로 읽는다(정인이 강해 ↔ 인성 보통), '많이 쓴다'는 세기가 아니다", () => {
    expect(groupClaims("정인이 강해서 배움에 돈을 아끼지 않아요.")).toEqual([{ group: "인성", level: "강" }]);
    expect(groupClaims("관성이 많이 씁니다.")).toEqual([]);
    expect(rulesOf(B.taeo, "정인이 강해서 배움에는 돈을 아끼지 않아요.")).toContain("group_claim");
    expect(rulesOf(B.taeo, "배우는 힘이 보통이라 차근차근 준비해요.")).not.toContain("group_claim");
  });
  it("궁합 장면 주인: 장면의 가장 센 차원 끝마다 그 사람 이름(브리프), 다른 사람 끝 단서를 이 사람 것으로 쓰면 scene_owner", () => {
    const rel = B.pair.chapters.flatMap(c => (c.sections ?? []).flatMap(s => s.materials)).filter(m => m.kind === "rel") as { who?: string[] }[];
    expect(rel.length).toBeGreaterThan(0); expect(rel.every(m => !m.who || m.who.length === 1)).toBe(true);
    expect(rel.some(m => m.who?.[0].match(/쪽 = (남궁현|백은솔)님, .+ 쪽 = (남궁현|백은솔)님$/))).toBe(true);
    const owners = ctxOf(B.pair).sceneOwners ?? [];
    expect(owners.length).toBeGreaterThan(0);
    const o = owners.find(x => x.pole === "boundarySetting+");
    if (o) { const other = o.name.includes("백은솔") ? "남궁현" : "백은솔"; expect(rulesOf(B.pair, `${other}님은 퇴근 뒤 무리한 부탁을 분명히 거절하는 편이에요.`)).toContain("scene_owner"); }
  });
  it("궁합 장면 주인은 값의 부호로: 같은 쪽이면 두 사람 모두(낮은 사람을 반대 끝으로 적지 않는다), 0에 가까운 사람은 붙이지 않는다", async () => {
    const { FINAL_CASES } = await import("../../../tools/final/cases");
    const c = FINAL_CASES.find(x => x.id === "deokmin-jiwoo")!, n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") });
    if (!n.ok) throw new Error(n.error);
    const b = buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k);
    const who = b.chapters.flatMap(ch => (ch.sections ?? []).flatMap(s => s.materials)).flatMap(m => m.kind === "rel" ? m.who ?? [] : []);
    // 장덕민 계획 +6.33·최지우 +5.65(둘 다 계획형), 지출 조절 +2.73·+6.86, 감정 표현 −2.79·−5.19(둘 다 숨김)
    expect(who.join("\n")).not.toMatch(/큰 방향만 잡고 세부는 닥쳐서 정하는 편 쪽 = 최지우님|마음에 들면 가격보다 경험을 먼저 사는 편 쪽 = 장덕민님|표정과 말에 기분이 바로 묻어나는 편 쪽 = 장덕민님/);
    expect(who).toContain("일정표와 준비물을 전날 정리해 두는 편 쪽 = 장덕민님·최지우님");
    expect(who.some(w => /^말보다 표정 변화를 먼저 알아채고 반응하는 편 쪽 = 최지우님, 속상한 이야기에도 해결책부터 말하는 편 쪽 = 장덕민님$/.test(w))).toBe(true); // 반대쪽은 양 끝
    const owners = lintContext(b, k, buildWriterPrompt(b, { knowledge: k }).chapters, []).sceneOwners ?? [];
    expect([...new Set(owners.filter(o => o.pole === "planning+").map(o => o.name))].sort()).toEqual(["장덕민님", "최지우님"]);
    expect(owners.some(o => o.pole === "planning-")).toBe(false);
    const { fillTopic } = await import("@/lib/brief/chapters");
    expect(fillTopic("{topic} 때 두 사람이 맡는 몫은?", "다툰 뒤")).toBe("다툰 뒤에 두 사람이 맡는 몫은?");
    expect(fillTopic("{topic} 때 두 사람이 맡는 몫은?", "기념일")).toBe("기념일 때 두 사람이 맡는 몫은?");
  });
});

describe("1-7 핵심 이미지", () => {
  it("이미지 대장 명사·피할 이미지", () => {
    expect(imageNoun("빗속에서도 꺼지지 않는 캠핑 랜턴")).toBe("랜턴"); expect(imageNoun("큰 나무가 돕는 사이")).toBe("사이"); expect(imageNoun("강변 숲을 적시며 흐르는 큰 강")).toBe("큰 강");
    const l = { version: "t", built: "", byDayPillar: { 丁丑: [{ line: "캠핑 랜턴", noun: "랜턴", source: "x" }, { line: "돕는 사이", noun: "사이", source: "x" }] } };
    expect(avoidImagesFor(["丁丑"], l)).toEqual(["랜턴"]); expect(avoidNounsIn("카페 랜턴 불빛", ["랜턴"])).toEqual(["랜턴"]);
    expect(B.sodam.chart.avoidImages).toEqual(expect.arrayContaining(["랜턴"]));
    expect(coverProblem("빗속에서도 꺼지지 않는 캠핑 랜턴", B.sodam, B.sodam.chart.avoidImages ?? [])).toMatch(/랜턴/);
  });
  it("작가 지침 v5-23은 P6d 지침에서 1-1·1-6·1-7 세 곳만 바꿨다", () => {
    expect(WRITER_SYSTEM).toContain("rule은 너에게 주는 쓰기 규칙이다"); expect(WRITER_SYSTEM).toContain("한자는 쓰지 않는다"); expect(WRITER_SYSTEM).toContain("chart.avoidImages");
    expect(WRITER_SYSTEM).toContain("MBTI 기능은 처음 한 번 \"쉬운 이름(Te)\""); // ③ 약어 금지를 옮기지 않았다
    expect(WRITER_SYSTEM).not.toMatch(/문단 정확히 3개\(문단마다 4문장/); // ① 분량 강제를 옮기지 않았다
  });
});

describe("1-9·1-10·1-14·1-15", () => {
  it("직업 입력: 상태 낱말 앞머리 분야(공무원준비)·가장 긴 낱말(대학원 > 학원)", () => {
    expect(matchJob("공무원 준비")?.id).toBe("civil-servant"); expect(matchJob("대학원 준비")?.id).toBe("grad-student"); expect(matchJob("자영업")?.id).toBe("self-employed");
  });
  it("구직 목표는 분야로 설명하고 '덜 맞음' 판정을 주지 않는다", () => {
    const txt = JSON.stringify(renderWriterBrief(B.taeo, { knowledge: k }));
    expect(txt).toMatch(/목표 직무: 마케팅 직무 재취업준비/); expect(txt).toMatch(/이 분야의 일: /); expect(txt).not.toMatch(/판정: 덜 맞음/);
    expect(txt).toMatch(/첫 달\([^)]*\)에 할 일 하나 — 목표\(마케팅 직무 재취업준비\)와 바로 이어지는 행동/);
  });
  it("커리어 다섯 힘: 첫 등장에 '쉬운 이름(묶음)', 그 뒤로는 쉬운 이름, 다른 이름은 group_name", () => {
    const ctx = ctxOf(B.taeo);
    const t = tidyBook([{ n: 1, id: "a", title: "a", source: "writer", chars: 0, sections: [{ heading: "비겁과 식상이 앞에 서요", paragraphs: ["비겁이 강하고 식상도 강해요. 내 방식의 힘은 앞장서게 해요.", "비겁이 다시 나와도 같은 이름이에요."] }] }], ctx).chapters[0].sections[0];
    expect(t.heading).toBe("내 방식의 힘과 만드는 힘이 앞에 서요");
    expect(t.paragraphs[0]).toBe("내 방식의 힘(비겁)이 강하고 만드는 힘(식상)도 강해요. 내 방식의 힘은 앞장서게 해요.");
    expect(E.careerGroupNames("인성 면접을 준비해요.", new Set()).text).toBe("인성 면접을 준비해요.");
    expect(rulesOf(B.taeo, "배움과 보호의 힘(인성)이 받쳐 줘요.")).toContain("group_name");
    // 정한 이름 앞에 다른 낱말이 붙어도 맞는 이름이다(장덕민 커리어 거짓 깃발).
    expect(rulesOf(B.taeo, "당신은 값을 받는 힘(재성)이 강해서 거래를 잘 이끌어요.")).not.toContain("group_name");
    expect(rulesOf(B.taeo, "규칙의 힘(관성)은 보통이고 배우는 힘(인성)은 약합니다.")).not.toContain("group_name");
  });
  it("표기 정리: 숫자·하이픈·되풀이·맞춤법·이중 표기·전문어", () => {
    const t = (x: string) => tidyBook([{ n: 2, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: [x] }] }], { mbtiPlain: { Fi: "가치 기준", Se: "지금 이 순간 감각", Si: "지난 경험 기억" }, monthChapters: new Set() }).chapters[0].sections[0].paragraphs[0];
    expect(t("남은 해는 1해예요.")).toBe("남은 해는 한 해예요.");
    expect(t("가치 기준(Fi)-지금 이 순간 감각(Se) 감각이 겹쳐요.")).toBe("가치 기준(Fi)과 지금 이 순간 감각(Se)이 겹쳐요.");
    expect(t("지난 경험을 기준점으로 삼는 지난 경험 기억(Si)의 결과예요.")).toBe("지난 경험을 기준점으로 삼는 성향(Si)의 결과예요.");
    expect(t("평온한 연애가 되려 낯설게 느껴져요. 잘 되려면 쉬어요.")).toBe("평온한 연애가 되레 낯설게 느껴져요. 잘 되려면 쉬어요.");
    expect(E.plainWords("다툰 뒤 때 두 사람이 맡는 몫은?").text).toBe("다툰 뒤에 두 사람이 맡는 몫은?");
    expect(E.plainWords("식사 후 때때로 걷고, 그 뒤 때문에 늦어요.").text).toBe("식사 후 때때로 걷고, 그 뒤 때문에 늦어요.");
    expect(t("일이 몰려 올 때일수록, 할 때 일수록 쉬어요.")).toBe("일이 몰려올 때일수록, 할 때일수록 쉬어요.");
    expect(t("충 축미충이 있는 당신은 바빠요.")).toBe("축미충이 있는 당신은 바빠요.");
    expect(t("내 힘의 세기는 매우 신약이에요.")).toBe("혼자 버티는 힘이 아주 여린 편이에요.");
  });
  it("장면: 카페 사장에게 프리랜서·개인 프로젝트 씨앗이 가지 않고, 맞는 씨앗이 없으면 공용 신호 대신 고객 소품", () => {
    const txt = JSON.stringify(renderWriterBrief(B.sodam, { knowledge: k }));
    expect(txt).not.toMatch(/프리랜서 의뢰서|개인 프로젝트 폴더|작은 프로그램|보고서 서론|업무 지시/);
    const mbti = B.sodam.chapters.flatMap(c => (c.sections ?? []).flatMap(s => s.materials)).filter(m => m.kind === "mbti") as { scene: string; seedId?: string }[];
    expect(mbti.every(m => m.seedId)).toBe(true); // 공용 신호 장면(씨앗 id 없음)은 없다
  });
  it("장면: 가게형이 아닌 사업자(IT 서비스 창업)에게 가게 씨앗·질문이 가지 않고 그 직업 소품을 쓴다(카페 사장은 그대로)", () => {
    const career = (detailJob: string) => {
      const c = P6D_CASES.find(x => x.id === "taeo-career")!, p = structuredClone(c.payload) as { userContext: Record<string, unknown> };
      p.userContext = { ...p.userContext, jobStatus: "business_owner", detailJob };
      const n = normalizeReportInputPayload(p as never, { now: () => new Date("2026-11-04T05:00:00Z") });
      if (!n.ok) throw new Error(n.error);
      return JSON.stringify(renderWriterBrief(buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k), { knowledge: k }));
    };
    // 다른 직군 설명(예: 뷰티·패션 "손님 얼굴에 맞춰…")은 그 직업의 장면이라 뺀다 — 고객 자신의 분야 줄은 남긴다.
    const startup = career("IT 서비스 창업(대표·개발)").replace(/"(?:\d순위 )?직군: [^"]*"/g, m => m.includes("지금 목표·직업 분야") ? m : "");
    expect(startup).toMatch(/출시 날짜와 첫 고객까지/);
    expect(startup).not.toMatch(/가게|단골|손님|매장|위생 점검|임대차|상권/);
    expect(startup).toMatch(/내 사업은 운영형일까 확장형일까/);
    expect(startup).toMatch(/상황 씨앗: (투자 유치 자료|출시 일정|월간 지표|팀원 채용|고객 인터뷰|서비스 로드맵|사무실 계약|지원사업 신청서|데모 시연|주간 팀 미팅)/);
    expect(career("카페 사장")).toMatch(/내 가게는 운영형일까 확장형일까/);
  });
});
