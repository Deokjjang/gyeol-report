import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { projectV4Composition } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";

// Captured at 871c10f before switching the Career entry. Full frozen evidence,
// public prose and Book projection, including new 13D-6B Comprehensive.
const locks: Record<string, readonly string[]> = {
  comprehensive: ["fe679cecdc36ebf6254377d98f1c9887ce3699b1ddc65e79afb9180df08c9f18", "f7344e7d346feb3a6375f6220a52ec31ce2c56dd5d097c210a16af5932d956d3", "17b8a1567a04d4f5e17ddd781187425f78623de7bd2491a69b70114500e0ac96"],
  love: ["6a9e456862186c8387c25239294742281bb1625d220d34f75672dce3d7ed568b", "258b6c08fa486ff838638a336bfd89b14b9da2e0e1f24ca115515789c877847d", "31689af92401bda9724fbff1f92f2ae0227fd2d761d344df212f7d5d68b442ef"],
  compatibility: ["10dc7fa3f24adf0c3e90f5f5f951a31a89c9d16b56b07402cf296d65fb3dcb8d", "1ac3b7f26fbc5c3e83c03055fd172d98aeda4cee736006f40c39db1a2a41b0c3", "b90fffb36cdfe0a9b648d2390dd61ab9624931d41ecaa41624053f6cfdaaac0b"],
  major: ["71465d70a0800b6d7430b45287e47afe5438919c6cb56d99deef9a875d51a15b", "cf9b8c3aaef4fb7488028e622b023ebe9db3cb677e469bb3c30ec9f82bd56dfd", "eb31c1fe7addcee764b3df970a892850180cb9751d73c2ecbd5198e96e821204"],
  annual: ["8525e0e39cc824c3f1f9cdd763cb33bfd4402c9718f6ba6d1e4a33f69309be5f", "85e4470a0b5a60c0e89c634dae80915263744f26dbef600e11132092d0c74125", "d21b5665c2e24402bf37a1a33021e47c5f1ccefa42f22c402c4ed2ee2acba69f"],
};
it.each(RUNTIME_FIXTURES.filter(f => f.id !== "career"))("$id customer/evidence/Book stays frozen", async f => {
  const result = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
  if (!result.ok) return expect.unreachable(JSON.stringify(result));
  // 7B activates the two relationship products. Keep testing their pre-7B
  // frozen snapshot projection, rather than silently replacing legacy hashes.
  if (f.id === "love" || f.id === "compatibility") {
    const e = result.evidencePacket as V4RuntimeEvidence;
    const old = f.id === "compatibility" ? composeCompatibilityNarrative(f.payload) : e.input.kind === "loveMarriageChild"
      ? composeLoveNarrative({ calculation: e.calculations.person, name: e.input.person.name, mbti: e.input.person.mbtiType, context: e.input.userContext }) : null;
    if (!old?.ok) return expect.unreachable();
    const composition = { product: e.productType, result: old } as V4RuntimeEvidence["composition"];
    const { contentDigest: _, ...body } = { ...e, composition }; void _;
    const sealed = { ...body, contentDigest: v4Digest(body) };
    expect([v4Digest(projectV4Composition(composition)), v4Digest(sealed), v4Digest(projectBook(sealed))]).toEqual(locks[f.id]);
    const snapshot = createProductPreviewSnapshot({ reportId: `legacy-${f.id}`, createdAtIso: sealed.generatedAt,
      productKey: sealed.input.productKey, productSlug: sealed.input.productSlug,
      draft: projectV4Composition(composition) as unknown as ProductPreviewSnapshotDraft, evidencePacket: sealed });
    if (!snapshot.ok) return expect.unreachable(JSON.stringify(snapshot));
    const saved = JSON.parse(JSON.stringify(snapshot.value));
    expect(storedBook(saved)?.data).toEqual(projectBook(sealed));
    expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(projectBook(sealed));
    return;
  }
  expect([v4Digest(result.draft), v4Digest(result.evidencePacket), v4Digest(projectBook(result.evidencePacket as V4RuntimeEvidence))]).toEqual(locks[f.id]);
  expect(result.externalCalls).toEqual([]);
}, 120000);
