import { describe, expect, it } from "vitest";
import { GUIDANCE_PROBLEMS, GUIDANCE_STRATEGIES, PRIMARY_WORK_MODES, LIFE_STATUSES, GUIDANCE_RELATIONSHIP_STATUSES } from "../../../src/lib/interpretation-v4/guidanceCore";
import { GUIDANCE_PROBLEM_REGISTRY } from "../../../src/lib/interpretation-v4/guidanceProblems";
import { GUIDANCE_STRATEGY_REGISTRY, strategyApplicability } from "../../../src/lib/interpretation-v4/guidanceStrategies";
import { GUIDANCE_CONTEXT_VARIANTS } from "../../../src/lib/interpretation-v4/guidanceContextVariants";
import { adviceLanguageErrors, inspectGuidanceRegistry, inspectGuidanceContext, emptyGuidanceDiagnostics } from "../../../src/lib/interpretation-v4/guidanceDiagnostics";
import { WORK_MODE_ALIASES, classifyGuidanceWorkModes } from "../../../src/lib/interpretation-v4/guidanceJobClassifier";
import { normalizeGuidanceContext } from "../../../src/lib/interpretation-v4/guidanceContext";
import { selectGuidance } from "../../../src/lib/interpretation-v4/guidanceEvaluator";
import { GUIDANCE_BEHAVIOR_SOURCES } from "../../../src/lib/interpretation-v4/guidanceEvidence";
import { context, guidanceInputs, problem, establishedProblem, select } from "./guidanceFixtures";
import { strong, marker, integrated, withComposite } from "./claimFixtures";
import { myProfile, realMbti, myAtom } from "./fusionSemanticFixtures";

describe("3C context and registries", () => {
  it("40 problems / 25 strategies / 7 life / 5 relationship / 12 primary modes", () => {
    expect(GUIDANCE_PROBLEMS).toHaveLength(40); expect(GUIDANCE_STRATEGIES).toHaveLength(25); expect(LIFE_STATUSES).toHaveLength(7);
    expect(GUIDANCE_RELATIONSHIP_STATUSES).toHaveLength(5); expect(PRIMARY_WORK_MODES).toHaveLength(12);
    expect(inspectGuidanceRegistry()).toEqual([]);
    expect(inspectGuidanceRegistry(GUIDANCE_PROBLEM_REGISTRY.slice(1))).toContain("INCOMPLETE_PROBLEM_REGISTRY");
    expect(inspectGuidanceRegistry(GUIDANCE_PROBLEM_REGISTRY, [...GUIDANCE_STRATEGY_REGISTRY, GUIDANCE_STRATEGY_REGISTRY[0]])).toContain("DUPLICATE_REGISTRY_ID");
  });
  it.each(Object.entries(WORK_MODE_ALIASES).flatMap(([mode, aliases]) => aliases.map(alias => [mode, alias])))("alias %s %s is explicit", (mode, alias) => {
    expect(classifyGuidanceWorkModes(alias, "EMPLOYEE").map(x => x.mode)).toContain(mode);
  });
  it.each([["출판 편집자", "EDITORIAL_REVIEW"], ["백엔드 개발자", "ITERATIVE_PRODUCT"], ["화가", "CRAFT_FINAL_OUTPUT"], ["회계사", "HIGH_STAKES_PRECISION"], ["데이터 분석가", "RESEARCH_EXPLORATION"], ["영업", "SALES_MARKET"], ["상담사", "PEOPLE_SERVICE"], ["팀장", "LEADERSHIP_MANAGEMENT"], ["MC", "PERFORMANCE_PUBLIC"], ["알 수 없는 새 직업명", "GENERAL"]])("job %s top %s", (job, mode) => {
    expect(context({ detailJob: job }).workModes[0].mode).toBe(mode);
  });
  it("canonical statuses, unknown/other preserved, job cannot infer life status", () => {
    expect(context({ jobStatus: "student" }).workModes[0].mode).toBe("LEARNING_PROJECT");
    expect(context({ jobStatus: "job_seeker", detailJob: "개발자" }).workModes[0].mode).toBe("APPLICATION_MARKET");
    expect(context({ jobStatus: "self_employed" }).lifeStatus).toBe("BUSINESS_OWNER");
    for (const relation of ["some", "marriage_preparing"] as const) expect(context({ relationshipStatus: relation }).relationshipStatus).toBe("OTHER");
    expect(context({ jobStatus: "unemployed" }).lifeStatus).toBe("OTHER"); expect(context({ detailJob: "대표" }).lifeStatus).toBe("UNKNOWN");
    expect(normalizeGuidanceContext({ jobStatus: "invented" as never }).ok).toBe(false);
    expect(normalizeGuidanceContext({ relationshipStatus: "reunion" as never }).ok).toBe(false);
    expect(inspectGuidanceContext({ ...context(), workModes: [{ mode: "BAD" as never, weight: 1, confidence: 1, matchedBy: [] }] })).toContain("INVALID_WORK_MODE");
  });
  it("token boundaries, weighted modes, compound safety", () => {
    expect(classifyGuidanceWorkModes("PMO", "EMPLOYEE").map(m => m.mode)).not.toContain("ITERATIVE_PRODUCT");
    expect(classifyGuidanceWorkModes("product manager", "EMPLOYEE").map(m => m.mode)).not.toContain("LEADERSHIP_MANAGEMENT");
    expect(classifyGuidanceWorkModes("서비스 기획", "EMPLOYEE").map(m => m.mode)).not.toContain("PEOPLE_SERVICE");
    const c = context({ detailJob: "보안 백엔드 개발자 팀장" }); expect(c.workModes).toHaveLength(3);
    expect(c.workModes.reduce((n, m) => n + m.weight, 0)).toBeCloseTo(1);
    expect(strategyApplicability("ITERATE_WHEN_SAFE", c.workModes)).toBe("FORBIDDEN");
    expect(classifyGuidanceWorkModes(" ＭＣ  ", "EMPLOYEE")[0].mode).toBe("PERFORMANCE_PUBLIC");
  });
});

describe("evidence activates a problem, context never does", () => {
  const empty = guidanceInputs(myProfile([]));
  it.each(GUIDANCE_PROBLEM_REGISTRY)("$id suppresses no evidence", d => expect(problem(d.id, empty)).toBeUndefined());
  it("precision is not delay, introversion is not withdrawal, status is not spending", () => {
    expect(problem("G01", guidanceInputs(strong({ PRECISION: 2 })))).toBeUndefined();
    expect(problem("G01", guidanceInputs(strong({ PRECISION: 2, STRUCTURE_STYLE: 2 })))).toBeUndefined();
    expect(problem("G01", guidanceInputs(strong({ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2 })))).toBeDefined();
    expect(problem("G27", guidanceInputs(strong({ ENERGY_DIRECTION: -2, DEPTH: 2 })))).toBeUndefined();
    expect(problem("G34", guidanceInputs(strong({ STATUS_DRIVE: 2 })))).toBeUndefined();
    expect(problem("G31", guidanceInputs(strong({ ACTION_TEMPO: 2, RISK_STYLE: 2 })))).toBeUndefined();
    expect(problem("G30", guidanceInputs(strong({ RESOURCE_SENSE: 2, STABILITY: 2, RISK_STYLE: -2 })))).toBeUndefined();
    expect(problem("G32", guidanceInputs(strong({ RESOURCE_SENSE: 2, MEANING: 2 })))).toBeUndefined();
  });
  it.each([
    ["G02", { DEPTH: 2, CURIOSITY: 2, ACTION_TEMPO: -2 }], ["G03", { CURIOSITY: 2, DECISION_STYLE: -2 }],
    ["G05", { CURIOSITY: 2, DEPTH: 2, ACTION_TEMPO: -2 }], ["G06", { ACTION_TEMPO: 2, DECISION_STYLE: 2 }],
    ["G08", { INITIATIVE: 2, OPPORTUNITY_SENSE: 2, EXPANSION: 2 }], ["G13", { AUTONOMY: 2, DUTY: 2 }],
    ["G14", { AUTONOMY: 2, DUTY: 2, LEADERSHIP: 2 }], ["G16", { GOAL_DRIVE: 2, DUTY: 2, PERSISTENCE: 2 }],
    ["G19", { PRECISION: 2, COMMUNICATION_STYLE: 2 }], ["G25", { SOCIAL_ATTUNEMENT: 2, RECOVERY_NEED: 2 }],
    ["G26", { SOCIAL_ATTUNEMENT: 2, DEPTH: 2 }], ["G28", { CARE: 2, DUTY: 2 }],
    ["G29", { OPPORTUNITY_SENSE: 2, EXPANSION: 2 }], ["G36", { DEPTH: 2, RECOVERY_NEED: 2 }],
    ["G39", { PRECISION: 2 }], ["G40", { GOAL_DRIVE: 2, EXPANSION: 2 }],
  ] as const)("%s uses normalized supported human evidence", (id, axes) => { expect(problem(id, guidanceInputs(strong(axes)))).toBeDefined(); });
  it("high boundary / C053 suppress weak-boundary inference", () => {
    expect(problem("G24", guidanceInputs(strong({ CARE: 2, SOCIAL_ATTUNEMENT: 2, BOUNDARY: 2 })))).toBeUndefined();
  });
  it("GWIMUN rumination plus depth has actual provenance", () => {
    const gwimun = marker("GWIMUN"); gwimun.metadata = { ...gwimun.metadata, riskTags: ["RUMINATION", "FIXATION"] };
    const i = guidanceInputs(strong({ DEPTH: 2, ENERGY_DIRECTION: -2 }, [gwimun]));
    expect(problem("G04", i)?.evidenceIds.some(id => id.includes("GWIMUN"))).toBe(true);
    expect(problem("G38", i)).toBeDefined();
  });
  it("reviewed behavior IDs exist in primary MBTI source; missing risks stay explicit", () => {
    const profiles = new Map<string, ReturnType<typeof realMbti>>();
    const missing: string[] = [];
    for (const id of Object.values(GUIDANCE_BEHAVIOR_SOURCES).flat()) {
      const type = id.split(":")[1]; if (!profiles.has(type)) profiles.set(type, realMbti(type));
      if (!profiles.get(type)!.sourceNodes.some(n => n.id === id && n.classification === "SCORING_SEMANTIC")) missing.push(id);
    }
    expect(missing).toEqual([]); expect(GUIDANCE_BEHAVIOR_SOURCES.RESTRICTIVE_SAVING).toEqual([]); expect(GUIDANCE_BEHAVIOR_SOURCES.MONEY_OVER_MEANING).toEqual([]);
  });
  it("amplifier-only and weak support cannot create high advice", () => {
    const i = guidanceInputs(integrated([myAtom("weak", { PRECISION: 1 }, { strength: "WEAK", tier: "AMPLIFIER" })]));
    expect(problem("G01", i)).toBeUndefined();
    const m = withComposite(strong({ EXPANSION: 2 }), "GROWTH_BEFORE_MAINTENANCE", ["EXPANSION", "STABILITY"]);
    const supported = integrated(m.evidence, [{ ...m.synthesisCandidates[0], strength: "SUPPORT" }]);
    const low = problem("G10", guidanceInputs(supported)); expect(low?.confidence).toBe("LOW");
  });
});

describe("context-safe concrete advice", () => {
  it.each([["개발자", "작은 버전"], ["화가", "수정 횟수"], ["회계사", "정확성을 낮추는 게 답은 아닙니다"], ["출판 편집자", "독자의 이해"]])("G01 %s has own advice", (job, expected) => {
    expect(select("G01", { detailJob: job }).selected.customerAdvice).toContain(expected);
  });
  it.each(["회계사", "의사", "간호사", "법률", "세무사", "보안 개발자", "안전 관리자"])("%s never iterates unsafely", job => {
    const { selected, diagnostics } = select("G01", { detailJob: job });
    expect(selected.selectedStrategyIds).not.toContain("ITERATE_WHEN_SAFE"); expect(selected.customerAdvice).not.toMatch(/일단 내놓|나중에 수정|검토 생략/);
    expect(diagnostics.suppressedUnsafeStrategies.some(x => x.strategy === "ITERATE_WHEN_SAFE")).toBe(true);
  });
  it.each([
    ["G02", { detailJob: "연구원" }, "종료 조건"], ["G10", { detailJob: "물류 운영" }, "체크리스트"],
    ["G28", { detailJob: "상담사" }, "대신 책임"], ["G14", { detailJob: "팀장" }, "방법 전체를 통제하지"],
    ["G25", { detailJob: "MC" }, "끝난 뒤"], ["G01", { jobStatus: "student" }, "연습 문제"],
    ["G01", { jobStatus: "job_seeker", detailJob: "웹 개발자" }, "지원서"],
    ["G33", { jobStatus: "freelancer" }, "가격"], ["G29", { jobStatus: "business_owner" }, "빠져나갈 시간"],
    ["G26", { relationshipStatus: "dating" }, "마음이 식었다"], ["G21", { relationshipStatus: "married" }, "집안일"],
    ["G22", {}, "결론부터"], ["G39", {}, "이미 잘된"], ["G40", {}, "새로 얻은"],
  ] as const)("%s picks concrete context", (id, raw, expected) => expect(select(id, raw).selected.customerAdvice).toContain(expected));
  it("SINGLE/OTHER/UNKNOWN do not presume a lover or spouse", () => {
    for (const relationshipStatus of ["single", "some", "marriage_preparing", ""] as const) {
      expect(select("G26", { relationshipStatus }).selected.customerAdvice).not.toMatch(/답장|마음이 식|배우자|연인/);
    }
  });
  it("unknown job is safe general wording and never HIGH", () => {
    const row = select("G01", { detailJob: "모르는새직업" }).selected;
    expect(row.confidence).toBe("MEDIUM"); expect(row.customerAdvice).not.toMatch(/출시|고객|작품|의료/);
  });
  it("LOW problem retains no customer advice", () => {
    const c = context({ detailJob: "개발자" }), d = emptyGuidanceDiagnostics(c);
    expect(selectGuidance({ ...establishedProblem("G01"), confidence: "LOW" }, c, d)).toBeUndefined(); expect(d.suppressedLowConfidenceAdvice).toContain("G01");
  });
  it("all forty established problems have a safe selection across twelve modes plus GENERAL", () => {
    const contexts = ["개발자", "화가", "회계사", "출판 편집자", "연구원", "운영", "영업", "상담사", "팀장", "MC", "모르는직업"].map(detailJob => context({ detailJob }));
    contexts.push(context({ jobStatus: "student" }), context({ jobStatus: "job_seeker" }));
    for (const p of GUIDANCE_PROBLEM_REGISTRY) for (const c of contexts) {
      const row = selectGuidance(establishedProblem(p.id), c, emptyGuidanceDiagnostics(c)); expect(row, `${p.id}/${c.workModes[0].mode}`).toBeDefined();
      expect(row!.selectedStrategyIds.length).toBeLessThanOrEqual(2); expect(adviceLanguageErrors(row!.customerAdvice)).toEqual([]);
      for (const s of row!.selectedStrategyIds) { expect(strategyApplicability(s, c.workModes)).not.toBe("FORBIDDEN"); expect(p.candidateStrategies).toContain(s); }
      if (c.workModes[0].mode === "HIGH_STAKES_PRECISION") expect(row!.customerAdvice).not.toMatch(/일단 내놓|나중에 수정|검토 생략|정확성.*포기/);
    }
  });
  it("single axes cannot invent specific shadows", () => {
    for (const [id, axes] of [
      ["G05", { CURIOSITY: 2 }], ["G09", { ACTION_TEMPO: 2 }], ["G11", { CHANGE_ORIENTATION: 2 }],
      ["G12", { STABILITY: 2 }], ["G15", { LEADERSHIP: 2 }], ["G17", { PRECISION: 2 }],
      ["G20", { COMMUNICATION_STYLE: -2 }], ["G23", { CARE: 2 }],
    ] as const) expect(problem(id, guidanceInputs(strong(axes))), id).toBeUndefined();
  });
  it("all strategies and variants have concrete actions, no empty self-help or harmful advice", () => {
    for (const r of GUIDANCE_STRATEGY_REGISTRY) { expect(r.action).toMatch(/정한다|확인한다|구분한다|나눈다|적는다|맡긴다|제한한다|말한다|뺀다/); expect(adviceLanguageErrors(r.generalAdvice)).toEqual([]); }
    for (const v of GUIDANCE_CONTEXT_VARIANTS) { expect(v.strategies.length).toBeLessThanOrEqual(2); expect(adviceLanguageErrors(v.advice)).toEqual([]); }
    expect(adviceLanguageErrors("균형을 맞추세요.")).toContain("GENERIC_ADVICE"); expect(adviceLanguageErrors("ADHD 치료")).toContain("CLINICAL_OR_FINANCIAL_ADVICE");
  });
});
