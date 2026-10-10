import { expect, it, vi } from "vitest";
import { renderNarrativeBlock } from "../../../src/lib/interpretation-v4/narrativeBlockRenderer";
import { validateNarrativeBlock } from "../../../src/lib/interpretation-v4/narrativeValidator";
import { freshNarrativeMemory } from "../../../src/lib/interpretation-v4/narrativeMemory";
import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptCore";
import { phrase, request, unit } from "./koreanNarrativeFixtures";
import { sectionFit } from "../../../src/lib/interpretation-v4/comprehensiveSectionContracts";
import { editorialRow, schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { renderComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import * as sectionRenderer from "../../../src/lib/interpretation-v4/comprehensiveSectionRenderer";

it("required section roles participate in pattern selection, not a late rejection", () => {
  const source = unit([
    phrase("DIRECT_CLAIM", "작은 차이를 그냥 지나치지 않는 편입니다."),
    phrase("LIFE_SCENE", "글을 다 쓴 뒤에도 빠진 말을 먼저 확인합니다."),
    phrase("MYEONGLI_REASON", "앞뒤가 맞는지 오래 살피는 편입니다."),
    phrase("CLOSER", "이때 남들이 놓친 오류를 찾습니다."),
  ]);
  for (let n = 0; n < 12; n++) {
    const r = renderNarrativeBlock(request(source, { reportStableKey: `roles-${n}`, patternId: "P02",
      requirements: { minSentences: 3, roles: ["MYEONGLI_REASON", "CLOSER"] } }));
    expect(r.ok, JSON.stringify(r.block.validation)).toBe(true);
    expect(r.block.sentenceRoles).toEqual(expect.arrayContaining(["MYEONGLI_REASON", "CLOSER"]));
  }
});

it("rejects one-sentence sources rather than inventing mandatory content", () => {
  const r = renderNarrativeBlock(request(unit([phrase("DIRECT_CLAIM", "고집이 셉니다.")]), {
    requirements: { minSentences: 2, roles: ["MYEONGLI_REASON"] },
  }));
  expect(r.ok).toBe(false);
  expect(r.block.validation.hardViolations.map(v => v.code)).toContain("REQUIRED_CONTENT_MISSING");
  expect(r.nextMemory).toEqual(freshNarrativeMemory());
});

it("protects a later primary phrase and selects an existing distinct support expression", () => {
  const primary = phrase("DIRECT_CLAIM", "한번 시작한 일은 꽤 오래 갑니다.");
  const source = unit([primary, phrase("DIRECT_CLAIM", "가까운 사이에서도 약속을 오래 지키는 편입니다.", { id: "distinct-application" }),
    phrase("MYEONGLI_REASON", "맡은 일을 쉽게 내려놓지 않습니다.")]);
  const r = renderNarrativeBlock(request(source, { reservedPhraseTexts: [primary.text], requirements: { minSentences: 2, roles: ["DIRECT_CLAIM"] } }));
  expect(r.ok).toBe(true);
  expect(r.block.sentences.some(s => s.sourcePhraseId === primary.id)).toBe(false);
  expect(r.block.sentences.some(s => s.sourcePhraseId === "distinct-application")).toBe(true);
});

it("reservation is also enforced by validation, not just the selector", () => {
  const input = request();
  const r = renderNarrativeBlock(input);
  const protectedText = input.source.phrases.find(p => p.id === r.block.sentences[0].sourcePhraseId)!.text;
  expect(validateNarrativeBlock({ ...input, reservedPhraseTexts: [protectedText] }, r.block, freshNarrativeMemory())
    .hardViolations.map(v => v.code)).toContain("PRIMARY_PHRASE_RESERVED");
});

it("identical underlying phrases cannot satisfy two mandatory roles via endings", () => {
  const text = "시작 전에 끝까지 확인하는 편입니다.";
  const r = renderNarrativeBlock(request(unit([phrase("DIRECT_CLAIM", text), phrase("MYEONGLI_REASON", text)]), {
    engineVersion: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION, requirements: { minSentences: 2, roles: ["DIRECT_CLAIM", "MYEONGLI_REASON"] },
  }));
  expect(r.ok).toBe(false);
});

it("filters generic C9 traits before spending a recovery reservation, not after rendering", () => {
  const generic = editorialRow("generic-element", { allowedSections: ["C8", "C9"], preferredSections: ["C9"],
    contexts: ["work", "recovery"], elementComposite: true, sourceText: "시작한 일을 꾸준히 이어가는 편입니다." });
  expect(sectionFit(generic, "C9")).toBe(0);
  expect(sectionFit(generic, "C8")).toBeGreaterThan(0);
  const recovery = { ...generic, sourceText: "혼자 생각을 정리하며 회복하는 편입니다." };
  expect(sectionFit(recovery, "C9")).toBeGreaterThan(0);
});

it("cannot turn an unrenderable primary chapter into success by removing its placement", () => {
  const profiles = schedulerInputs(), plan = schedulerPlan(profiles);
  const original = sectionRenderer.renderComprehensiveSection;
  const spy = vi.spyOn(sectionRenderer, "renderComprehensiveSection").mockImplementation((...args) => {
    const r = original(...args);
    if (args[1] === "C1") {
      r.section.blocks = []; r.section.sourceCandidateIds = [];
      for (const p of args[0].plan.sections.C1.placements) args[3].suppressed.push({
        sectionId: "C1", candidateId: p.candidateId, reasons: ["NO_COMPLETE_SOURCE_BLOCK"],
      });
      r.section.validation.hardViolations.push({ code: "PRIMARY_NOT_RENDERED", refs: ["C1"] });
    }
    return r;
  });
  try {
    const r = renderComprehensiveManuscript({ profiles, plan, reportStableKey: "missing-mandatory-proof" });
    expect(r.ok).toBe(true); // A draft result is not publication success.
    if (!r.ok) return expect.unreachable(r.error);
    expect(r.renderability.passes).toBeLessThanOrEqual(4);
    expect(r.draft.validation.hardViolations.map(v => v.code)).toContain("PRIMARY_NOT_RENDERED");
  } finally { spy.mockRestore(); }
}, 30000);
