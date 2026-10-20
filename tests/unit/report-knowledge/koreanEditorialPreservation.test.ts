import { readFileSync, writeFileSync } from "node:fs";
import { afterAll, expect, it } from "vitest";
import cases from "../../fixtures/six-product-integration-01/source-locks.json";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "@/app/dev/book-preview/bookProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "@/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "@/lib/book/storedReport";
import { withKoreanParticle, normalizeKoreanSentenceSpacing } from "@/lib/report-knowledge/koreanCopyUtils";
import { particle } from "@/lib/interpretation-v4/copyRealizer";
import { renderCompatibilityTitle } from "@/lib/interpretation-v4/compatibilityTitle";

const selected = cases.filter(c => c.id === "A" || (c.product === "compatibility" && ["marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"].includes(c.id)) || (c.id === "F" && c.product !== "compatibility"));
const doc = "docs/validation/v4-korean-editorial-knowledge-01/";
const observations: unknown[] = [];
afterAll(() => { if (process.env.KOREAN_EDITORIAL_CAPTURE) writeFileSync(process.env.KOREAN_EDITORIAL_CAPTURE, JSON.stringify(observations, null, 2) + "\n"); });
it.each(selected)("$product/$id preserves actual calculation, proof, complete narrative, Book and snapshot", async c => {
  const g = await generateV4ShadowReport(c.payload, c.clock);
  expect(g.ok).toBe(true); expect(g.externalCalls).toEqual([]); if (!g.ok) return;
  const e = g.evidencePacket as V4RuntimeEvidence;
  expect(validateV4Publication(e.productType, g.draft, e).ok).toBe(true);
  const book = projectBook(e)!; expect(book).toBeTruthy();
  const made = createProductPreviewSnapshot({ reportId: `offline-editorial-${c.product}-${c.id}`, createdAtIso: e.generatedAt,
    productKey: e.productType, productSlug: e.input.productSlug, draft: g.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  expect(made.ok).toBe(true); if (!made.ok) return;
  const saved = JSON.parse(JSON.stringify(made.value)), seal = v4Digest(saved);
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(seal);
  const r = e.composition.result;
  const observation = { id: `${c.product}/${c.id}`, productKey: e.productType, input: e.input, clock: c.clock,
    hashes: { calculations: v4Digest(e.calculations), evidence: v4Digest(e), draft: v4Digest(g.draft), narrative: v4Digest(r.narrative), book: v4Digest(book), snapshot: seal },
    narrative: r.narrative, book,
    integration: "integration" in r ? r.integration : null,
    pairRelease: "release" in r ? r.release : null };
  observations.push(observation);
  if (process.env.KOREAN_EDITORIAL_BASELINE !== "1") {
    const base = JSON.parse(readFileSync(doc + "baseline-generation.json", "utf8")) as { id: string }[];
    expect(observation).toEqual(base.find(b => b.id === observation.id));
  }
}, 120000);
it("preserves recorded grammar limitations while the common particle uses the reviewed utility", () => {
  const historical = JSON.parse(readFileSync(doc + "baseline-generation.json", "utf8")) as { id: string; values?: { oldL: string; oldQuote: string } }[];
  expect(historical.find(r => r.id === "existing-grammar-probes")?.values).toMatchObject({ oldL: "길으로", oldQuote: "‘제안’가" });
  const values = { oldL: particle("길", "으로", "로"), oldQuote: particle("‘제안’", "이", "가"), numericReading: withKoreanParticle("3", "subject"), decimal: normalizeKoreanSentenceSpacing("버전 3.14에서 확인합니다."), safeQuote: withKoreanParticle("‘대화’", "subject"), safeL: withKoreanParticle("‘길’", "to"), preservedMbti: renderCompatibilityTitle("MBTI: {{A:subject}} {{B}}에게", { personA: "예린", personB: "Alex $& {{A}}" }) };
  expect(values.oldL).toBe("길로"); expect(values.oldQuote).toBe("‘제안’이");
  expect(values.numericReading).toBe("3이"); expect(values.decimal).toBe("버전 3. 14에서 확인합니다.");
  expect(values.safeQuote).toBe("‘대화’가"); expect(values.safeL).toBe("‘길’로");
  expect(values.preservedMbti).toBe("MBTI: 예린이 Alex $& {{A}}에게");
  observations.push({ id: "existing-grammar-probes", values, customerOccurrenceNotAsserted: true });
});
