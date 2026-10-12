import { beforeAll, describe, expect, it } from "vitest";
import { withKoreanParticle } from "../../../src/lib/report-knowledge/koreanCopyUtils";
import { majorAnnualStory } from "../../../src/lib/interpretation-v4/majorAnnualStories";
import { majorContext } from "../../../src/lib/interpretation-v4/majorContext";
import { auditContent } from "../../../src/lib/interpretation-v4/contentQuality";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK, majorSafetyInvariant } from "./majorEditorialSafetyFixtures";
import locks from "./majorEditorialSafetyLocks.json";

type Generated = Extract<Awaited<ReturnType<typeof generateV4ShadowReport>>, { ok: true }>;
const generated = new Map<string, Generated & { evidencePacket: V4RuntimeEvidence }>();
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const g = await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK);
    expect(g.ok, f.id).toBe(true);
    if (g.ok) {
      expect(validateV4Publication("major_fortune", g.draft, g.evidencePacket)).toEqual({ ok: true, errors: [] });
      generated.set(f.id, { ...g, evidencePacket: g.evidencePacket as V4RuntimeEvidence });
    }
  }
}, 120000);

describe("Major editorial assembly safety", () => {
  it.each([
    ["목소리", "목소리가", "목소리는", "목소리를", "목소리로"],
    ["제안", "제안이", "제안은", "제안을", "제안으로"],
    ["길", "길이", "길은", "길을", "길로"],
    ["‘대화’", "‘대화’가", "‘대화’는", "‘대화’를", "‘대화’로"],
    ["‘제안’", "‘제안’이", "‘제안’은", "‘제안’을", "‘제안’으로"],
    ["‘역할’", "‘역할’이", "‘역할’은", "‘역할’을", "‘역할’로"],
    ["“길”", "“길”이", "“길”은", "“길”을", "“길”로"],
  ])("%s: existing utility handles particles, closing quotes and rieul", (word, subject, topic, object, to) => {
    expect(withKoreanParticle(word, "subject")).toBe(subject);
    expect(withKoreanParticle(word, "topic")).toBe(topic);
    expect(withKoreanParticle(word, "object")).toBe(object);
    expect(withKoreanParticle(word, "to")).toBe(to);
  });

  it.each(MAJOR_SAFETY_CASES)("$id: only authorized copy changes; calendar, proofs and all other prose stay frozen", ({ id, payload }) => {
    const g = generated.get(id)!;
    expect(g.evidencePacket.composition.product).toBe("major_fortune");
    if (g.evidencePacket.composition.product !== "major_fortune") return;
    const r = g.evidencePacket.composition.result;
    expect(v4Digest(majorSafetyInvariant(r))).toBe(locks.rows[id as keyof typeof locks.rows].invariant);
    expect(r.contentAudit.hedgeChapters).toEqual(auditContent(r.narrative).hedgeChapters);
    expect(r.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
    expect(r.completeness).toMatchObject({ years: 14, futureYears: 10, ages: true, final: true });
    const blocks = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)];
    const copy = blocks.map(b => b.text).join("\n");
    expect(copy).not.toMatch(/목소리을|대화’이|제안’로|대화’을|반복해서 남길 오래 남길|꾸준히 보여준 꾸준히 보여줄|에서 얻은 경험이 출발점|받은 자극이 지금도|에서 누리던 편안함/);
    for (const t of r.transitions) {
      const work = t.blocks.find(b => b.id.endsWith("-work"))!.text;
      expect(work).toContain(t.year < 2026 ? "같은 장면을 겪었다면" : "같은 장면에서는 무엇을 배울 수 있을지");
      expect(t.blocks.find(b => b.id.endsWith("-life"))!.text).toContain("편안함을 느껴왔다면");
      if (t.year < 2026) expect(t.blocks.find(b => b.id.endsWith("-people"))!.text).toContain("자극을 받은 적이 있다면");
    }
    if (!payload.person.mbtiType) {
      expect(r.materials.fusions).toEqual([]);
      expect(blocks.flatMap(b => b.proof.sourceRefs).some(ref => ref.startsWith("mbti:"))).toBe(false);
    }
    if (payload.person.birthTimeUnknown) {
      expect(r.evidence.calculation.pillars.hour).toBeUndefined();
      expect(r.transitions.every(t => t.startSolarRange && !t.startSolarKst)).toBe(true);
    }
    expect(g.externalCalls).toEqual([]);
  });

  it.each(MAJOR_SAFETY_CASES)("$id: corrected paragraphs publish and survive owner/shared stored reading", ({ id }) => {
    const g = generated.get(id)!, e = g.evidencePacket;
    expect(validateV4Publication("major_fortune", g.draft, e)).toEqual({ ok: true, errors: [] });
    const book = projectBook(e);
    expect(book).not.toBeNull();
    const built = createProductPreviewSnapshot({ reportId: `major-safety-${id}`, createdAtIso: e.generatedAt,
      productKey: e.input.productKey, productSlug: e.input.productSlug, draft: g.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    const saved = JSON.parse(JSON.stringify(built.value));
    expect(storedBook(saved)?.data).toEqual(book);
    expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
    if (e.composition.product !== "major_fortune") return;
    const n = e.composition.result.narrative;
    expect(book!.pages.filter(p => p.kind === "narrative").flatMap(p => p.paragraphs.map(b => b.text)))
      .toEqual([...n.opening, ...n.sections.flatMap(s => s.blocks)].map(b => b.text));
    if (id === "03-freelance") {
      expect(n.sections.find(s => s.id === "next-cycle")!.title).toBe("다음 대운, 익숙한 답을 바꾸는 목소리를 내 것으로 만드는 장");
      expect(n.sections.flatMap(s => s.blocks).find(b => b.id === "transition-2028-people")!.text)
        .toContain("‘참기만 하던 불편을 말로 꺼내는 대화’가 새 균형점입니다.");
      expect(n.sections.flatMap(s => s.blocks).find(b => b.id === "final-direction")!.text)
        .toContain("‘참기만 하던 불편을 말로 꺼내는 대화’를 남겨보고 싶습니다.");
    }
    if (id === "02-employee") {
      const blocks = n.sections.flatMap(s => s.blocks);
      expect(blocks.find(b => b.id === "transition-2034-work")!.text).toContain("‘밖에서 들어오는 제안’으로 달라집니다.");
      expect(blocks.find(b => b.id === "2029-character")!.text).toContain("오래 남길 내 몫을 생각하는 시간이 반갑습니다.");
      expect(blocks.find(b => b.id === "2036-gift")!.proof.seedIds).toContain("sinsal_hongyeom:strength");
    }
  });

  it("noun phrases supply their own modifiers in both present and distant story slots", () => {
    const e = generated.get("02-employee")!.evidencePacket;
    if (e.composition.product !== "major_fortune") return expect.unreachable();
    const context = majorContext(e.composition.result.evidence.input);
    for (const distant of [false, true]) {
      const money = majorAnnualStory("정재", context, false, false, true, distant);
      expect(money.portrait.startsWith(`${withKoreanParticle(money.topic, "object")} 생각하는 시간이 반갑습니다.`)).toBe(true);
      const craft = majorAnnualStory("식신", context, true, false, false, distant);
      expect(craft.gift.startsWith(`${withKoreanParticle(craft.topic, "subject")} 나를 다시 찾을 이유가 됩니다.`)).toBe(true);
      if (distant) expect(craft.gift).toContain("꾸준히 보여줄 솜씨가 나를 다시 찾을 이유가 됩니다.");
    }
  });
});
