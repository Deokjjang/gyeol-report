import { describe, expect, it } from "vitest";
import sourceCases from "../../fixtures/six-product-integration-01/source-locks.json";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { editorialInvariants } from "./editorialInvariants";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { COMPREHENSIVE_STAGE_MEANINGS } from "../../../src/app/dev/book-preview/comprehensiveBook";
import { TWELVE_STAGE_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTwelveStages";
import { bookFeatureInventory, projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import type { BookData } from "../../../src/app/dev/book-preview/bookTypes";

const previous = JSON.parse(gunzipSync(readFileSync(new URL("../../fixtures/common-editorial-01/previous-books.json.gz", import.meta.url))).toString()) as {
  product: string; id: string; snapshot: { evidencePacket: V4RuntimeEvidence; draft: unknown }; book: BookData;
}[];
const stages = [
  ["장생", /자라|배우/], ["목욕", /적응|표현/], ["관대", /역할|갖춘/], ["건록", /제 몫|스스로/],
  ["제왕", /왕성/], ["쇠", /거두|고르는/], ["병", /안을 살피|돌아보/], ["사", /멈추|숙고/],
  ["묘", /저장/], ["절", /끊기|새 출발/], ["태", /막 생기|가능성/], ["양", /보살피|키우/],
] as const;

describe("the existing twelve-stage glossary describes symbolic stages only", () => {
  it.each(stages)("%s has its own reviewed growth/rest meaning", (name, meaning) => {
    expect(TWELVE_STAGE_SEMANTICS).toHaveProperty(name);
    expect(COMPREHENSIVE_STAGE_MEANINGS[name]).toMatch(meaning);
    expect(COMPREHENSIVE_STAGE_MEANINGS[name]).not.toMatch(/성공합니다|실패합니다|병에 걸|죽습니다|수명이|반드시|무조건/);
  });
  it("does not add an uncalculated stage to a person's appendix", () => {
    expect(Object.keys(COMPREHENSIVE_STAGE_MEANINGS).sort()).toEqual(stages.map(([name]) => name).sort());
    const observed = new Set<string>();
    for (const f of previous) {
      const e = f.snapshot.evidencePacket;
      for (const [slot, table] of Object.entries(e.natalTableEvidence)) {
        const actual = [...new Set(table.pillars.flatMap(p => p.twelveLifeStage ?? []))];
        actual.forEach(s => observed.add(s));
        const inventory = bookFeatureInventory(e, slot as "person" | "personA" | "personB", slot);
        expect(inventory.filter(x => x.display.group === "십이운성").map(x => x.display.name).sort()).toEqual(actual.sort());
      }
    }
    expect(observed.size).toBeGreaterThan(6);
  });
});

it.each(previous)("$product/$id old appendix owner/order/footnotes are immutable; new revision changes only stage definitions", f => {
  const old = f.snapshot.evidencePacket;
  expect(old.bookEditorialRevision).toBeUndefined();
  expect(projectBook(old)).toEqual(f.book);
  const { contentDigest, ...body } = old;
  expect(v4Digest(body)).toBe(contentDigest);
  const revision = { ...body, bookEditorialRevision: "common-editorial-01" as const };
  const e = { ...revision, contentDigest: v4Digest(revision) };
  expect(validateV4Publication(e.productType, f.snapshot.draft, e).ok).toBe(true);
  const next = projectBook(e)!;
  expect(next.pages.map(p => p.kind)).toEqual(f.book.pages.map(p => p.kind));
  next.pages.forEach((page, i) => {
    const before = f.book.pages[i];
    if (page.kind !== "appendix" || before.kind !== "appendix") return expect(page).toEqual(before);
    expect({ ...page, items: [] }).toEqual({ ...before, items: [] });
    expect(page.items.map(x => [x.person, x.group, x.name, x.core])).toEqual(before.items.map(x => [x.person, x.group, x.name, x.core]));
    page.items.forEach((item, n) => {
      expect(item.group === "십이운성" ? { ...item, meaning: before.items[n].meaning } : item).toEqual(before.items[n]);
      if (item.group === "십이운성") expect(item.meaning).toBe(COMPREHENSIVE_STAGE_MEANINGS[item.name]);
    });
  });
  // A changed presentation marker is covered by the original snapshot seal.
  expect(validateV4Publication(old.productType, f.snapshot.draft, { ...old, bookEditorialRevision: "common-editorial-01" }).errors).toContain("V4_SNAPSHOT_INTEGRITY");
});


it.each(previous)("$product/$id actual paid generator removes reviewed repetition and retains each paragraph's proof", async f => {
  const source = sourceCases.find(s => s.product === f.product && s.id === f.id)!;
  const g = await generateV4ShadowReport(source.payload, source.clock);
  expect(g.ok).toBe(true); if (!g.ok) return;
  const e = g.evidencePacket as V4RuntimeEvidence;
  expect(editorialInvariants(e)).toEqual(editorialInvariants(f.snapshot.evidencePacket));
  const next = projectBook(e)!;
  const prose = (b: BookData) => b.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(x => x.text) : []).join("\n");
  const before = prose(f.book), after = prose(next);
  const count = (text: string, phrase: string) => text.split(phrase).length - 1;
  if (f.product === "comprehensive") {
    expect(count(after, "생각이나 감정을 밖으로 보여주는 기운")).toBeLessThan(count(before, "생각이나 감정을 밖으로 보여주는 기운"));
    expect(after).toContain("아는 것 같은 느낌과 실제로 설명할 수 있는 지식");
  } else if (f.product === "career") {
    expect(after).not.toContain("성별이나 고용형태");
    expect(after).not.toMatch(/기운\([^)]*\)는 명리에서/);
    expect(after).toContain("그 일을 위해 쓸 수 있는 시간을 함께 물어보세요");
  } else if (f.product === "love") {
    expect(after).toContain("언제 어떻게 쓰는지에 따라 상대가 받는 느낌");
    expect(after).toContain("상대가 시도한 이유나 이미 잘한 부분");
  } else if (f.product === "compatibility") {
    expect(after).toContain("혼자 이어갈 부분까지 정하면");
    expect(after).toContain("고른 부분과 보류한 부분");
  } else if (f.product === "major") {
    expect(after).toContain("함께 나타난 긴장을 덮으면서까지");
    expect(after).toContain("먼저 처리할 요구와 도움을 청할 기준");
    expect(e.composition.result.editorial).toEqual([]);
  } else if (f.product === "annual") {
    expect(count(after, "실제로 조정할 수 있는 조건")).toBeLessThanOrEqual(1);
    expect(after).toContain("월운 지지");
    expect(after).toContain("맡은 범위와 쉬어 갈 때");
  }
  expect(after).not.toMatch(/sourceRefs|ten_god_|DB 자료를 선택|\$\{|undefined|NaN/);
}, 120000);
