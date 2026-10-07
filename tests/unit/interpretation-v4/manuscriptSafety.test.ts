import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chooseNarrativeScene, inspectSceneSafety, type SceneUse } from "../../../src/lib/interpretation-v4/narrativeSceneCore";
import { NARRATIVE_SCENES } from "../../../src/lib/interpretation-v4/narrativeSceneRegistry";
import { chooseNarrativeTitle, type TitleUse } from "../../../src/lib/interpretation-v4/narrativeTitleCore";
import { TITLE_SKELETONS } from "../../../src/lib/interpretation-v4/narrativeTitleRegistry";
import { renderComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { adaptComprehensiveSource } from "../../../src/lib/interpretation-v4/comprehensiveNarrativeAdapter";
import { renderComprehensiveBridge } from "../../../src/lib/interpretation-v4/comprehensiveBridgeRenderer";
import { freshNarrativeMemory } from "../../../src/lib/interpretation-v4/narrativeMemory";
import { compatiblePatterns } from "../../../src/lib/interpretation-v4/narrativePatterns";
import { renderNarrativeBlock } from "../../../src/lib/interpretation-v4/narrativeBlockRenderer";
import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptCore";
import { COMPREHENSIVE_SECTIONS } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { SECTION_BRIDGE_REGISTRY } from "../../../src/lib/interpretation-v4/narrativeConnectors";
import { validateComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptValidator";
import { editorialRow, schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { context } from "./guidanceFixtures";
import { request, claimUnit, tensionUnit } from "./koreanNarrativeFixtures";

describe("closed scene selector", () => {
  const c = editorialRow("precision", { primaryAxes: ["PRECISION"], contexts: ["identity", "work"] });
  it.each(["출판 편집자", "소프트웨어 개발자", "화가", "회계사"])("applies existing precision to %s without diagnosing the job", detailJob => {
    const user = context({ jobStatus: "employee", detailJob });
    const s = chooseNarrativeScene(NARRATIVE_SCENES, c, "C8", "work", user, { PRECISION: 2 }, [], "same-person");
    expect(s).toBeDefined(); expect(s!.scene.compatibleWorkModes).toContain(user.workModes[0].mode);
    expect(s!.scene.sourceText).not.toMatch(/라서|출시|고객에게 먼저|회계사니까/);
    expect(chooseNarrativeScene(NARRATIVE_SCENES, c, "C8", "work", user, {}, [], "same-person")).toBeUndefined();
  });
  it("requires signed proof, correct domain and novelty", () => {
    const user = context();
    expect(chooseNarrativeScene(NARRATIVE_SCENES, c, "C5", "identity", user, { PRECISION: 2 }, [], "k")).toBeUndefined();
    expect(chooseNarrativeScene(NARRATIVE_SCENES, c, "C1", "identity", user, { PRECISION: -1 }, [], "k")).toBeUndefined();
    const first = chooseNarrativeScene(NARRATIVE_SCENES, c, "C1", "identity", user, { PRECISION: 2 }, [], "k")!;
    const used: SceneUse[] = [{ sceneId: first.scene.id, theme: c.semanticTheme, family: first.scene.family, candidateId: c.id, sectionId: "C1", score: first.score }];
    expect(chooseNarrativeScene(NARRATIVE_SCENES, c, "C1", "identity", user, { PRECISION: 2 }, used, "k")).toBeUndefined();
  });
  it.each(["지난달 회사에서 상사와 싸웠습니다.", "매주 토요일 아내와 여행을 갑니다.", "오전 8시에 출근합니다."])("rejects invented specifics: %s", sourceText => {
    expect(inspectSceneSafety({ ...NARRATIVE_SCENES[0], sourceText })).toEqual(["UNSUPPORTED_SPECIFICITY"]);
  });
  it("single and unknown relationship scenes never assume an actual spouse", () => {
    for (const s of NARRATIVE_SCENES.filter(s => s.family === "LOVE")) expect(s.sourceText).not.toMatch(/당신의 연인|남편|아내|배우자가|결혼하게|헤어집/);
  });
  it("general coverage is distinct, not aliases counted twice", () => {
    expect(NARRATIVE_SCENES.filter(s => s.compatibleWorkModes?.includes("GENERAL"))).toHaveLength(10);
  });
});

describe("titles use only their selected primary source", () => {
  it("cannot promote an unsupported fortune or action", () => {
    const ordinary = editorialRow("normal", { sourceText: "돈과 명예를 중요하게 생각합니다.", claimLevel: 2 });
    const t = chooseNarrativeTitle(ordinary, "C5", [], "k"); expect(t.type).toBe("T1_DIRECT_JUDGMENT");
    expect(t.text).not.toContain("패");
    const notAdvice = chooseNarrativeTitle(editorialRow("work", { sourceText: "결정 뒤에도 생각합니다." }), "C8", [], "k");
    expect(notAdvice.type).not.toBe("T6_ACTION_DIRECTION");
  });
  it("level2 fact does not become level3 stubborn title", () => {
    const t = chooseNarrativeTitle(editorialRow("fact", { sourceText: "고집을 부릴 때도 있습니다.", factBomb: true, claimLevel: 2 }), "C6", [], "k");
    expect(t.text).not.toBe("고집이 셉니다");
  });
  it("C5 direct S08 Level4 title remains a possibility, never a guarantee", () => {
    const t = chooseNarrativeTitle(editorialRow("fortune", { sourceType: "CLAIM", sourceText: "돈과 명예를 같이 노려볼 만한 패입니다.", fortune: true, claimLevel: 4 }), "C5", [], "k");
    expect(t.type).toBe("T4_GOOD_FORTUNE"); expect(t.text).not.toMatch(/반드시|무조건/);
  });
  it("a shared noun cannot license a different causal story in the title", () => {
    const t = chooseNarrativeTitle(editorialRow("notes", { sourceType: "GUIDANCE", sourceText: "고칠 부분과 잘된 부분을 따로 적어봅니다." }), "C10", [], "k");
    expect(t.text).not.toContain("떠오르는 일");
    const contrast = chooseNarrativeTitle(editorialRow("new-stable", { sourceText: "새로운 일을 시작해도 생활은 안정적으로 유지하고 싶습니다." }), "C3", [], "k");
    expect(contrast.text).not.toBe("일에서의 기준이 생활에서는 달라집니다");
    const reciprocity = chooseNarrativeTitle(editorialRow("people", { sourceText: "사람을 잘 챙겨 좋은 인연을 스스로 만들어갑니다." }), "C5", [], "k");
    expect(reciprocity.text).not.toBe("마지막 선택은 내가 하고 싶습니다");
  });
  it("deterministic choice, no three consecutive types or overused family", () => {
    const used: TitleUse[] = [];
    for (const id of ["C1", "C2", "C3", "C4"] as const) {
      const c = editorialRow(id, { sourceText: "생각을 충분히 한 뒤 결정하면 빠르게 움직입니다." });
      const t = chooseNarrativeTitle(c, id, used, "stable"); expect(chooseNarrativeTitle(c, id, used, "stable")).toEqual(t); used.push(t);
    }
    for (let n = 2; n < used.length; n++) expect(used.slice(n - 2, n + 1).every(t => t.type === used[n].type)).toBe(false);
    for (const t of used) expect(used.filter(u => u.family === t.family).length).toBeLessThanOrEqual(2);
    expect(TITLE_SKELETONS.every(t => t.required.length)).toBe(true);
  });
});

describe("manuscript boundary and section contracts", () => {
  const profiles = schedulerInputs(), plan = schedulerPlan(profiles), input = { profiles, plan, reportStableKey: "rich-unit-proofs" };
  it("rejects modified or unselected plan sources instead of trusting a forged label", () => {
    const forged = structuredClone(input); forged.plan.candidates[0].sourceText = "반드시 부자가 됩니다.";
    expect(renderComprehensiveManuscript(forged)).toEqual({ ok: false, error: "PLAN_SOURCE_MISMATCH" });
    const p = { ...plan.sections.C1.placements[0], candidateId: "unselected" };
    expect(adaptComprehensiveSource(plan, profiles, "C1", p, freshNarrativeMemory(), [], "k")).toBeUndefined();
  });
  it("hidden sources cannot expose an MBTI reason or type", () => {
    for (const sectionId of COMPREHENSIVE_SECTIONS) for (const p of plan.sections[sectionId].placements.filter(p => p.presentationIntent === "HIDDEN")) {
      const a = adaptComprehensiveSource(plan, profiles, sectionId, p, freshNarrativeMemory(), [], "k")!;
      expect(a.source.phrases.some(p => p.role === "MBTI_REASON")).toBe(false);
      expect(a.source.phrases.map(p => p.text).join(" ")).not.toMatch(/\b(?:MBTI|[EI][SN][TF][JP])\b/);
    }
  });
  it("full construction is deterministic and does not mutate any input", () => {
    const original = JSON.stringify(input), a = renderComprehensiveManuscript(input), b = renderComprehensiveManuscript(input);
    expect(a).toEqual(b); expect(JSON.stringify(input)).toBe(original);
    if (!a.ok) return expect.unreachable(a.error);
    expect(Object.keys(a.draft.sections)).toEqual(COMPREHENSIVE_SECTIONS);
  }, 60000);
  it("S08 direct copy is first, with no weakening", () => {
    const r = renderNarrativeBlock(request(claimUnit("S08_MONEY_AND_HONOR", 4, true), { intent: "FORTUNE", engineVersion: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION }));
    expect(r.ok).toBe(true); expect(r.block.sentences[0].text).toBe("돈과 명예를 같이 노려볼 만한 패입니다.");
  });
  it("resolved tension retains split and third interpretation", () => {
    const r = renderNarrativeBlock(request(tensionUnit(), { intent: "TENSION", depthIntent: "DEEP", presentationIntent: "EXPLICIT", engineVersion: GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION }));
    expect(r.ok).toBe(true); expect(r.block.sentenceRoles).toContain("CONTRAST"); expect(r.block.sentenceRoles).toContain("CLOSER");
  });
  it("new paragraph patterns are opt-in; old 5A defaults remain isolated", () => {
    expect(compatiblePatterns(request(), ["DIRECT_CLAIM", "MYEONGLI_REASON", "CLOSER"]).every(p => Number(p.id.slice(1)) <= 16)).toBe(true);
  });
  it("nine bridge intents use the existing language registry, with optional skips", () => {
    const r = renderComprehensiveManuscript(input); if (!r.ok) return expect.unreachable(r.error);
    // The sparse unit fixture is not guaranteed to fill C2; bridge mechanics use
    // an actually rendered block, while the actual-person suite covers adjacency.
    const populated = Object.values(r.draft.sections).find(s => s.blocks.length)!;
    const before = { ...populated, sectionId: "C1" as const }, after = { ...populated, sectionId: "C2" as const };
    for (const intent of Object.keys(SECTION_BRIDGE_REGISTRY) as (keyof typeof SECTION_BRIDGE_REGISTRY)[]) {
      const custom = structuredClone(input); custom.plan.sections.C1.bridgeIntent = intent;
      const target = { ...after, semanticThemes: [...before.semanticThemes], sectionKind: intent === "REINFORCE_TO_TENSION" ? "TENSION" as const : intent === "STRENGTH_TO_FORTUNE" ? "GOOD_FORTUNE" as const : "REINFORCE" as const };
      const b = renderComprehensiveBridge(custom, before, target, { language: freshNarrativeMemory(), usedScenes: [], usedTitles: [] });
      expect(b.used, intent).toBe(true);
      if (b.used) expect(b.sentence.role).toBe("CLOSER");
    }
  }, 60000);
  it("detects invalid title proof and fabricated C10 evidence", () => {
    const r = renderComprehensiveManuscript(input); if (!r.ok) return expect.unreachable(r.error);
    const d = structuredClone(r.draft); d.titleUsage[0].candidateId = "unselected"; d.sections.C10.evidenceIds.push("invented");
    const audit = validateComprehensiveManuscript(input, d);
    expect(audit.hardViolations.map(v => v.code)).toContain("TITLE_SOURCE_VIOLATION");
    expect(audit.hardViolations.map(v => v.code)).toContain("C10_NEW_EVIDENCE");
  }, 60000);
  it("new draft layer has no existing customer, Book, provider, or calculation consumer", () => {
    const names = ["narrativeSceneCore", "narrativeScenePersonal", "narrativeSceneSocial", "narrativeSceneWork", "narrativeSceneRegistry", "narrativeTitleCore", "narrativeTitleRegistry", "comprehensiveNarrativeAdapter", "comprehensiveManuscriptCore", "comprehensiveSectionRenderer", "comprehensiveBridgeRenderer", "comprehensiveManuscriptRenderer", "comprehensiveManuscriptValidator"];
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []);
    for (const file of walk("src")) {
      const text = readFileSync(file, "utf8");
      if (names.some(n => file === `src/lib/interpretation-v4/${n}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|from ["'][^"']*(?:runtimeShadow|bookProjection|supabase|openai|Composer)/);
      else for (const n of names) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${n}["']`));
    }
  });
});
