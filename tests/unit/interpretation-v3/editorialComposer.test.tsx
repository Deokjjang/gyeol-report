import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { composeEditorial, editorialCustomerScenes, COMPREHENSIVE_EDITORIAL_MIX, type EditorialScene } from "../../../src/lib/interpretation-v3/editorialComposer";
import { adaptMbti } from "../../../src/lib/interpretation-v3/evidence";
import { storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { PRECISION_VOICES } from "../../../src/lib/interpretation-v3/comprehensiveExperienceCopy";
import { createComprehensiveV3 } from "../../../src/lib/report-generation/comprehensiveV3Generation";
import { DOMAINS, PRODUCTS, type Evidence } from "../../../src/lib/interpretation-v3/types";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";

const fact = (changes: Partial<Evidence> = {}): Evidence => ({
  id: "fixture:person:hyeonchim", featureId: "sinsal_hyeonchim", kind: "shinsal", subject: "person", scope: "natal",
  value: { positions: ["day"] }, certainty: "confirmed", salience: "direct", domains: DOMAINS,
  sourceRefs: ["fixture:confirmed-hyeonchim"], lineage: ["fixture:calculated-hyeonchim"], ...changes,
});
const anchor = fact();
const scene = (id: string, changes: Partial<EditorialScene> = {}): EditorialScene => ({
  id, chapter: "self", order: 0, angle: id, domain: "identity", subject: "person", tone: "recognition", form: "prose",
  headline: `${id}에서 알아보는 나`, parts: [{ role: "character", text: `${id}에서는 작은 차이가 먼저 눈에 들어옵니다.` }],
  evidenceRefs: [anchor.id], sourceRefs: ["fixture:authored-copy"], ...changes,
});
type Input = Parameters<typeof composeEditorial>[0];
const run = (scenes: readonly EditorialScene[], changes: Partial<Input> = {}) => composeEditorial({
  product: "saju_mbti_full", chapters: ["self"], facts: [anchor], selectedEvidenceRefs: [anchor.id], substantialEvidenceRefs: [anchor.id], scenes, ...changes,
});
const reasons = (r: ReturnType<typeof run>) => r.rejected.map(x => x.reason);
afterEach(() => expect(fetch).not.toHaveBeenCalled());

describe("common editorial assembly (not connected to saved report composers)", () => {
  it("allows one strong feature in distinct domains and manifestations, without repeating its wording", () => {
    const r = run([
      scene("self", { headline: "남들은 넘어갔는데 나만 걸리는 한마디", parts: [{ role: "character", text: "이야기는 끝났는데 앞뒤가 맞지 않던 한마디가 계속 남습니다. 대화에 집중하지 않은 게 아니라 빈틈까지 듣고 있었던 쪽입니다." }] }),
      scene("study", { chapter: "study", domain: "study", tone: "praise", form: "punchline", headline: "오답에서 남보다 먼저 찾는 것", parts: [{ role: "character", text: "틀렸다는 표시보다 어느 줄에서 논리가 바뀌었는지가 먼저 보입니다. 답을 맞히는 것과 설명을 믿는 것은 당신에게 다른 일입니다." }] }),
      scene("love", { chapter: "love", domain: "love", tone: "affection", form: "quote", headline: "답장 한 줄에도 온도 차이가 보입니다", parts: [{ role: "character", text: "말은 괜찮다는데 평소와 다른 말투가 마음에 남습니다. 가까운 사람일수록 작은 변화를 그냥 지나치기 어렵습니다." }] }),
    ], { chapters: ["self", "study", "love"] });
    expect(r.rejected).toEqual([]); expect(r.warnings).toEqual([]);
    expect(r.scenes).toHaveLength(3);
    expect(new Set(r.scenes.flatMap(s => s.evidenceRefs))).toEqual(new Set([anchor.id]));
    expect(new Set(r.scenes.flatMap(s => s.parts.map(p => p.text))).size).toBe(3);
  });

  it("retains different angles in the same domain but rejects a renamed copy of the same manifestation", () => {
    const r = run([scene("alone", { angle: "private-review" }), scene("public", { angle: "public-correction" }), scene("renamed", { angle: "private-review" })]);
    expect(r.scenes.map(s => s.id)).toEqual(["alone", "public"]);
    expect(reasons(r)).toContain("repeated-manifestation");
  });

  it.each([
    "같은 뿌리에서 다른 장면을 찾습니다.",
    "같은 뿌리에서 다른 장면을 찾습니다!",
    "같은  뿌리에서\n다른 장면을 찾습니다.",
  ])("rejects repeated customer prose despite new IDs, domains and punctuation: %s", text => {
    const r = run([scene("a", { parts: [{ role: "character", text: "같은 뿌리에서 다른 장면을 찾습니다." }] }),
      scene("b", { domain: "love", parts: [{ role: "character", text }] })]);
    expect(r.scenes).toHaveLength(1); expect(reasons(r)).toContain("repeated-copy");
  });

  it("detects copied sentences embedded in a longer paragraph, including within one scene", () => {
    const text = "작은 차이가 눈에 들어옵니다.";
    expect(reasons(run([scene("a", { parts: [{ role: "character", text }] }), scene("b", { parts: [{ role: "character", text: `새로운 제목만 붙였습니다. ${text}` }] })]))).toContain("repeated-copy");
    expect(reasons(run([scene("a", { parts: [{ role: "character", text: `${text} ${text}` }] })]))).toContain("repeated-sentence");
  });

  it("varies tone AND form within a chapter, retaining TOC and original prose", () => {
    const source = [scene("a", { order: 1 }), scene("b", { order: 2 }), scene("c", { order: 3 }),
      scene("d", { order: 4, tone: "reversal", form: "quote" }), scene("e", { chapter: "last", tone: "fortune", form: "punchline" })];
    const before = JSON.stringify(source), r = run(source, { chapters: ["self", "last"] });
    expect(r.scenes.map(s => s.id)).toEqual(["a", "b", "d", "c", "e"]);
    expect(r.warnings).toEqual([]); expect(JSON.stringify(source)).toBe(before);
    for (const s of r.scenes) expect(s).toBe(source.find(x => x.id === s.id));
    expect(r).toEqual(run([...source].reverse(), { chapters: ["self", "last"] }));
  });

  it("carries rhythm over chapter boundaries, but does not reorder the chapters", () => {
    const r = run([scene("a"), scene("b"), scene("c", { chapter: "last", order: 1 }),
      scene("d", { chapter: "last", order: 2, tone: "blunt", form: "punchline" })], { chapters: ["self", "last"] });
    expect(r.scenes.map(s => s.id)).toEqual(["a", "b", "d", "c"]); expect(r.warnings).toEqual([]);
  });

  it("reports unavoidable monotony instead of deleting, merging or relabeling material", () => {
    const source = [scene("a"), scene("b"), scene("c"), scene("d")], r = run(source);
    expect(r.scenes).toEqual(source); expect(r.rejected).toEqual([]);
    expect(r.warnings).toEqual(["c", "d"].flatMap(id => [{ id, reason: "repeated-tone" }, { id, reason: "repeated-form" }]));
  });

  it("strict alternation saves a contrasting tone for the tail without changing default behavior", () => {
    const source = [scene("first", { tone: "affection", form: "quote" }), scene("second", { order: 1 }), scene("third", { order: 2 })];
    expect(run(source).scenes).toEqual(source);
    const strict = run(source, { maxConsecutiveTone: 1 });
    expect(strict.scenes.map(s => s.id)).toEqual(["second", "first", "third"]);
    expect(strict.warnings).toEqual([]);
    const impossible = run(source.slice(1), { maxConsecutiveTone: 1 });
    expect(impossible.scenes).toEqual(source.slice(1));
    expect(impossible.warnings).toEqual([{ id: "third", reason: "repeated-tone" }]);
  });

  it("strict alternation also avoids stranding three identical forms", () => {
    const source = [scene("a", { form: "observations" }), scene("b", { order: 1, tone: "praise", form: "observations" }),
      scene("c", { order: 2, form: "observations" }), scene("d", { order: 3, tone: "praise", form: "quote" })];
    const r = run(source, { maxConsecutiveTone: 1 });
    expect(r.scenes.map(s => s.id)).toEqual(["a", "d", "c", "b"]); expect(r.warnings).toEqual([]);
    for (const s of r.scenes) expect(s).toBe(source.find(x => x.id === s.id));
  });

  it("does not truncate long 3–5 paragraph passages or fill a missing chapter", () => {
    const parts = Array.from({ length: 5 }, (_, i) => ({ role: "character" as const, text: `${i + 1}번째 관찰입니다. ${"긴 원문을 그대로 유지합니다 ".repeat(100)}${i}` }));
    const r = run([scene("long", { parts })], { chapters: ["self", "empty"] });
    expect(r.scenes[0].parts).toEqual(parts); expect(r.audit.total).toBeGreaterThan(6000);
    expect(r.warnings).toContainEqual({ id: "empty", reason: "empty-chapter" });
  });

  it("measures authored body roles, without title padding or trimming advice to hit a target", () => {
    const s = scene("mix", { headline: "긴 제목을 더해도 본문 비율은 바뀌지 않습니다".repeat(20), parts: [
      { role: "character", text: "묘".repeat(67) }, { role: "explanation", text: "설".repeat(22) }, { role: "advice", text: "팁".repeat(11) },
    ] });
    const r = run([s], { targetMix: COMPREHENSIVE_EDITORIAL_MIX });
    expect(r.audit).toEqual({ chars: { character: 67, explanation: 22, advice: 11 }, total: 100, mix: { character: 0.67, explanation: 0.22, advice: 0.11 } });
    expect(r.warnings).toEqual([]);
    const advice = scene("advice", { parts: [{ role: "advice", text: "필요한 일 하나를 고르세요." }] });
    const heavy = run([advice], { targetMix: COMPREHENSIVE_EDITORIAL_MIX });
    expect(heavy.scenes).toEqual([advice]); expect(heavy.warnings).toHaveLength(3);
    expect(run([advice]).warnings).toEqual([]); // Other products must choose their own policy.
  });

  it.each([
    { selectedEvidenceRefs: [] }, { substantialEvidenceRefs: [] },
    { facts: [fact({ certainty: "conditional" })] }, { facts: [fact({ certainty: "weak" })] },
    { facts: [fact({ sourceRefs: [] })] }, { facts: [fact({ lineage: [] })] },
    { facts: [fact({ domains: ["love"] })] }, { facts: [fact({ kind: "mbti" })] }, { facts: [fact({ kind: "context" })] },
  ])("cannot promote unselected, uncertain, unsupported or behavior-only evidence: %j", changes => {
    expect(run([scene("a")], changes).scenes).toEqual([]);
  });

  it("requires every cited fact, not just one convenient anchor", () => {
    const b = fact({ id: "fixture:b" });
    expect(reasons(run([scene("a", { evidenceRefs: [anchor.id, b.id] })], { facts: [anchor, b] }))).toContain("unselected-evidence");
    expect(reasons(run([scene("a", { evidenceRefs: [anchor.id, "absent"] })]))).toContain("unselected-evidence");
    expect(reasons(run([scene("a", { sourceRefs: [] })]))).toContain("unconfirmed-evidence");
  });

  it("fails closed on duplicated facts, chapter IDs, or ambiguous scene IDs", () => {
    expect(run([scene("a")], { facts: [anchor, anchor] }).errors).toContain(`duplicate:${anchor.id}`);
    expect(run([scene("a")], { chapters: ["self", "self"] }).scenes).toEqual([]);
    const ambiguous = [scene("same"), scene("same", { headline: "다른 내용" })];
    expect(run(ambiguous).scenes).toEqual([]); expect(run(ambiguous)).toEqual(run([...ambiguous].reverse()));
  });

  it.each(PRODUCTS)("keeps the existing product domains and permits shared assembly for %s", product => {
    const isPair = product === "saju_mbti_compatibility";
    const f = fact({ subject: isPair ? "personA" : "person" });
    const s = scene("shared", { subject: f.subject, domain: product === "love_marriage_child" || isPair ? "relationship" : "career" });
    expect(run([s], { product, facts: [f] }).scenes).toEqual([s]);
    if (product !== "saju_mbti_full") expect(reasons(run([scene("wrong")], { product }))).toContain("outside-product-domain");
  });

  it("preserves A→B and B→A as different observations, never borrowing B's anchor for A", () => {
    const a = fact({ id: "a", subject: "personA" }), b = fact({ id: "b", subject: "personB" });
    const ab = scene("ab", { domain: "relationship", angle: "conversation-speed", subject: "personA", toward: "personB", evidenceRefs: ["a", "b"],
      headline: "A는 답을, B는 생각할 시간을 기다립니다", parts: [{ role: "character", text: "A가 말을 보태는 동안 B는 아직 첫 질문을 생각하고 있습니다." }] });
    const ba = scene("ba", { ...ab, id: "ba", subject: "personB", toward: "personA", headline: "B에게 침묵은 아직 대화 중이라는 뜻입니다", parts: [{ role: "character", text: "B는 말이 없는 시간이 A에게는 거절처럼 들린다는 점에서 놀랍니다." }] });
    const args: Partial<Input> = { product: "saju_mbti_compatibility", facts: [a, b], selectedEvidenceRefs: ["a", "b"], substantialEvidenceRefs: ["a", "b"] };
    expect(run([ab, ba], args).scenes).toEqual([ab, ba]);
    expect(reasons(run([ab], { ...args, substantialEvidenceRefs: ["b"] }))).toContain("missing-substantial-anchor");
    expect(reasons(run([{ ...ab, evidenceRefs: ["a"] }], args))).toContain("evidence-direction-mismatch");
    expect(reasons(run([{ ...ab, toward: "personA" }], args))).toContain("invalid-direction");
    expect(reasons(run([ab]))).toContain("invalid-subject");
  });

  it.each(["67점", "６７점", "궁합 99%", "67/100", "0~100", "★★★★★", "별점 다섯 개", "궁합 등급", "S등급", "등급 A+"])("never revives a compatibility score or grade: %s", text => {
    const a = fact({ subject: "personA" });
    expect(reasons(run([scene("pair", { subject: "personA", domain: "relationship", headline: text })], { product: "saju_mbti_compatibility", facts: [a] }))).toContain("compatibility-score-copy");
  });

  it.each(["major", "annual", "monthly"] as const)("keeps %s observations in the exact canonical period", scope => {
    const product = scope === "major" ? "major_fortune" : "annual_fortune";
    const period = scope === "monthly" ? "2026-09" : scope === "annual" ? "2026" : "30-39";
    const f = fact({ id: "flow", scope, kind: "fortune", period });
    const args: Partial<Input> = { product, facts: [f], selectedEvidenceRefs: [f.id], substantialEvidenceRefs: [f.id] };
    const s = scene("flow", { domain: "career", period: { scope, id: period }, evidenceRefs: [f.id] });
    expect(run([s], args).scenes).toEqual([s]);
    expect(reasons(run([{ ...s, period: undefined }], args))).toContain("evidence-period-mismatch");
    expect(reasons(run([{ ...s, period: { scope, id: "wrong" } }], args))).toContain("evidence-period-mismatch");
    expect(reasons(run([s], { ...args, product: "saju_mbti_full" }))).toContain("outside-product-period");
    const other = fact({ ...f, id: "other-month", scope: "monthly", period: "2026-10" });
    expect(reasons(run([{ ...s, evidenceRefs: [f.id, other.id] }], { ...args, facts: [f, other], selectedEvidenceRefs: [f.id, other.id] }))).toContain("evidence-period-mismatch");
  });

  it("requires a flow fact for a period claim; natal evidence cannot invent this month's opportunity", () => {
    expect(reasons(run([scene("month", { domain: "career", period: { scope: "monthly", id: "2026-09" } })], { product: "annual_fortune" }))).toContain("evidence-period-mismatch");
  });

  it.each(["canonical-weighted", "ten_god_zheng_guan", "sourceRefs", "SajuCalcResult:input", "반드시 합격합니다", "수익이 보장됩니다", "노력하면 매력이 생깁니다"])("rejects internal or unsupported copy: %s", headline => {
    expect(run([scene("bad", { headline })]).scenes).toEqual([]);
  });

  it("keeps source-backed MBTI expressions distinct on one actual natal chart, and cannot assign a missing trait", () => {
    const generated = createComprehensiveV3(comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[3]).payload)!;
    const { calculation: calc, facts } = generated.evidencePacket.comprehensiveV3;
    const natal = facts.filter(f => f.scope === "natal"), precision = natal.find(f => f.featureId === "sinsal_hyeonchim")!;
    expect(storySupport(precision.featureId, natal, calc).substantial).toBe(true);
    const before = JSON.stringify(calc), outputs: string[] = [];
    for (const voice of PRECISION_VOICES) {
      const behavior = adaptMbti(voice.trait.split(":")[0]);
      const trait = behavior.find(f => f.featureId === `mbti:${voice.trait.replace(":", ":traits:")}`)!;
      const s = scene("fusion", { domain: precision.domains[0], evidenceRefs: [precision.id, trait.id], sourceRefs: [...precision.sourceRefs, ...trait.sourceRefs],
        headline: "정확함이 밖으로 나오는 순간", parts: [{ role: "character", text: voice.text }] });
      const args = { facts: [...natal, ...behavior], selectedEvidenceRefs: [precision.id, trait.id], substantialEvidenceRefs: [precision.id] };
      const r = run([s], args);
      expect(r.rejected).toEqual([]); outputs.push(editorialCustomerScenes(r.scenes)[0].paragraphs[0]);
      expect(run([s], { ...args, facts: natal }).scenes).toEqual([]);
      expect(run([s], { ...args, selectedEvidenceRefs: [trait.id] }).scenes).toEqual([]);
    }
    expect(new Set(outputs).size).toBe(2);
    expect(outputs[0]).toContain("수정안"); expect(outputs[1]).toContain("내 가치"); expect(JSON.stringify(calc)).toBe(before);
  });

  it("serializes and SSR-renders only explicit customer fields, preserving long/short forms without metadata", () => {
    const r = run([scene("secret-rule", { headline: "작은 차이가 먼저 보이는 사람", sourceRefs: ["SajuCalcResult:private-source"], parts: [{ role: "character", text: "사람들이 웃는 동안 혼자 한마디를 곱씹었던 순간이 있습니다." }] })]);
    const customer = JSON.parse(JSON.stringify(editorialCustomerScenes(r.scenes)));
    expect(Object.keys(customer[0]).sort()).toEqual(["form", "headline", "paragraphs"]);
    const html = renderToStaticMarkup(createElement("article", {}, ...editorialCustomerScenes(r.scenes).map((s, i) => createElement("section", { key: i },
      createElement("h2", {}, s.headline), ...s.paragraphs.map((p, j) => createElement("p", { key: j }, p))))));
    expect(html).toContain("작은 차이가 먼저 보이는 사람");
    expect(JSON.stringify(customer) + html).not.toMatch(/secret-rule|SajuCalcResult|evidenceRefs|sourceRefs|recognition|fixture:|angle|lineage/);
    expect(r.scenes[0].sourceRefs).toEqual(["SajuCalcResult:private-source"]);
  });
});
