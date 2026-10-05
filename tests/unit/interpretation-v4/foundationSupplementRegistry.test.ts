import { describe, expect, it } from "vitest";
import { SEMANTIC_AXES, DYNAMIC_TAGS, FORTUNE_TAGS } from "../../../src/lib/interpretation-v4/semanticCore";
import { RELATION_SEMANTICS, RELATION_CONTENT_PRIORITY } from "../../../src/lib/interpretation-v4/foundationRelations";
import { TWELVE_STAGE_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTwelveStages";
import { SHINSAL_SEMANTICS, TWELVE_SHINSAL_REFERENCES, NATAL_MARKER_ALIASES, type FoundationMarker } from "../../../src/lib/interpretation-v4/foundationShinsal";
import { SHINSAL_FAMILIES } from "../../../src/lib/interpretation-v4/foundationShinsalFamilies";

describe("13D-1C exact relation contract", () => {
  it("nine definitions, content priority only, no element transformation increments", () => {
    expect(Object.keys(RELATION_SEMANTICS)).toHaveLength(9);
    expect(RELATION_CONTENT_PRIORITY).toEqual({ STRONG_SAMHAP_OR_MAJOR_HAP: 3, CHUNG: 3, HYEONG: 2.5, YUKHAP: 2, WONJIN: 2, HAE: 1.5, PA: 1.5, BANHAP: 1 });
    expect(RELATION_SEMANTICS.SAMHAP.axes).toEqual({});
    expect(RELATION_SEMANTICS.BANHAP.rawWeight).toBeLessThan(RELATION_SEMANTICS.SAMHAP.rawWeight);
    expect(RELATION_SEMANTICS.STEM_HAP.axes).toEqual({ ADAPTABILITY: 0.5, RELATION_STYLE: 0.5 });
    expect(RELATION_SEMANTICS.CHUNG.axes).toEqual({ CHANGE_ORIENTATION: 0.5, ADAPTABILITY: 0.5 });
    expect(RELATION_SEMANTICS.HYEONG.axes).toEqual({ DUTY: 0.5, PRECISION: 0.5 });
  });
  it.each([
    ["STEM_HAP", "SUPPORT", ["BINDING", "COORDINATION", "MUTUAL_PULL", "COMPROMISE"]],
    ["YUKHAP", "SUPPORT", ["PAIR_COHESION", "COOPERATION", "MUTUAL_ADJUSTMENT"]],
    ["SAMHAP", "SUPPORT", ["STRONG_COHERENCE", "SHARED_DIRECTION", "ENERGY_CONCENTRATION"]],
    ["BANHAP", "AMPLIFIER", ["PARTIAL_COHERENCE", "POTENTIAL_COMMON_GROUND"]],
    ["CHUNG", "SUPPORT", ["CHANGE_PRESSURE", "DIRECT_CONFLICT", "REPOSITIONING", "MOVEMENT"]],
    ["HYEONG", "SUPPORT", ["INTERNAL_PRESSURE", "REPETITIVE_FRICTION", "SELF_DEMAND"]],
    ["PA", "AMPLIFIER", ["BREAK_AND_REBUILD", "PLAN_DISRUPTION", "MAINTENANCE_FRICTION"]],
    ["HAE", "AMPLIFIER", ["UNSPOKEN_MISMATCH", "EXPECTATION_GAP", "SUBTLE_HURT"]],
    ["WONJIN", "SUPPORT", ["ATTRACTION_FRICTION", "LINGERING_EMOTION", "FIXATION", "RESENTMENT_LOOP"]],
  ] as const)("%s kind / tier / tags", (key, tier, tags) => expect(RELATION_SEMANTICS[key]).toMatchObject({ kind: "DYNAMIC", tier, dynamicTags: [...tags] }));
});

describe("13D-1C twelve stages: energy modifiers, not predictions", () => {
  it("12 stages, all non-core/non-strong defaults", () => {
    expect(Object.keys(TWELVE_STAGE_SEMANTICS)).toEqual(["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"]);
    for (const entry of Object.values(TWELVE_STAGE_SEMANTICS)) expect(entry.tier).toBe("AMPLIFIER");
    expect(TWELVE_STAGE_SEMANTICS.목욕.riskTags).toEqual(["VOLATILITY"]);
    expect(TWELVE_STAGE_SEMANTICS.제왕.riskTags).toEqual(["OVERDRIVE"]);
  });
  it.each([
    ["장생", { INITIATIVE: 1, EXPANSION: 1, CREATION: 1 }, "BEGINNING"],
    ["목욕", { CHANGE_ORIENTATION: 1, EXPRESSION: 1, CHARISMA: 0.5 }, "EXPERIMENT"],
    ["관대", { STATUS_DRIVE: 1, SOCIAL_ATTUNEMENT: 0.5, DUTY: 0.5 }, "ROLE_FORMATION"],
    ["건록", { AUTONOMY: 1, DUTY: 1, STABILITY: 1 }, "SELF_STANDING"],
    ["제왕", { LEADERSHIP: 1, CHARISMA: 1, GOAL_DRIVE: 1 }, "PEAK_FORCE"],
    ["쇠", { STRATEGY: 1, RESOURCE_SENSE: 1 }, "SELECTIVE_USE"],
    ["병", { RECOVERY_NEED: 1, DEPTH: 0.5 }, "MAINTENANCE"],
    ["사", { ENERGY_DIRECTION: -0.5, DEPTH: 1 }, "RELEASE"],
    ["묘", { STABILITY: 1, RESOURCE_SENSE: 1 }, "STORAGE"],
    ["절", { CHANGE_ORIENTATION: 1, ADAPTABILITY: 0.5 }, "RESET"],
    ["태", { CURIOSITY: 0.5, CREATION: 0.5 }, "LATENT_POTENTIAL"],
    ["양", { CARE: 1, PERSISTENCE: 0.5 }, "NURTURE"],
  ] as const)("%s exact axes/tag", (key, axes, tag) => {
    expect(TWELVE_STAGE_SEMANTICS[key].axes).toEqual(axes);
    expect(TWELVE_STAGE_SEMANTICS[key].dynamicTags).toEqual([tag]);
  });
});

describe("13D-1C gwiin, major markers and low-weight aliases", () => {
  it.each([
    ["CHEONEUL", "HELPER", {}, { HELPER_LUCK: 2, RELATION_RESOURCE: 1 }],
    ["CHEONDEOK", "HELPER_SOFTENING", {}, { CONFLICT_SOFTENING: 1, RECOVERY: 1 }],
    ["WOLDEOK", "HELPER_SOFTENING", { SOCIAL_ATTUNEMENT: 0.5 }, { RELATION_SOFTENING: 1 }],
    ["TAEGEUK", "INSIGHT", { PATTERN_SENSE: 1, MEANING: 1, DEPTH: 0.5 }, { INSIGHT: 1 }],
    ["MUNCHANG", "LEARNING_WRITING", { LEARNING: 1, EXPRESSION: 1, CREATION: 1 }, { WRITING_EXPRESSION: 1 }],
    ["HAKDANG", "LEARNING_WRITING", { LEARNING: 2, DEPTH: 0.5, PERSISTENCE: 0.5 }, { LEARNING_SUPPORT: 1 }],
    ["JAEGO", "ACCUMULATION", { RESOURCE_SENSE: 1, STABILITY: 1 }, { ACCUMULATION: 1 }],
  ] as const)("%s exact gwiin semantics", (key, family, axes, fortuneTags) => {
    expect(SHINSAL_SEMANTICS[key]).toMatchObject({ sourceType: "gwiin", kind: "FORTUNE", tier: "AMPLIFIER", family });
    expect(SHINSAL_SEMANTICS[key].axes).toEqual(axes); expect(SHINSAL_SEMANTICS[key].fortuneTags).toEqual(fortuneTags);
  });
  it.each([
    ["JANGSEONG", "FORTUNE", "LEADERSHIP_POSITION", { LEADERSHIP: 1, STATUS_DRIVE: 1, INITIATIVE: 0.5 }, { VISIBLE_AUTHORITY: 1 }],
    ["BANAN", "FORTUNE", "LEADERSHIP_POSITION", { STATUS_DRIVE: 1, STABILITY: 1, DUTY: 0.5 }, { POSITION: 1, RECOGNITION: 1 }],
    ["YEOKMA", "FORTUNE", "MOVEMENT", { CHANGE_ORIENTATION: 1, ADAPTABILITY: 1, OPPORTUNITY_SENSE: 1 }, { MOVEMENT_OPPORTUNITY: 1 }],
    ["JISAL", "FORTUNE", "MOVEMENT", { CHANGE_ORIENTATION: 0.5, OPPORTUNITY_SENSE: 0.5 }, {}],
    ["DOHWA", "FORTUNE", "VISIBILITY", { CHARISMA: 1, SOCIAL_ATTUNEMENT: 0.5, EXPRESSION: 0.5 }, { FIRST_IMPRESSION: 1, SOCIAL_VISIBILITY: 1 }],
    ["NYEON", "FORTUNE", "VISIBILITY", { CHARISMA: 0.5 }, { SOCIAL_VISIBILITY: 1 }],
    ["HONGYEOM", "FORTUNE", "INTIMATE_CHARM", { CHARISMA: 1, SOCIAL_ATTUNEMENT: 1 }, { INTIMATE_CHARM: 1 }],
    ["HYEONCHIM", "TRAIT", "PRECISION", { PRECISION: 2, COMMUNICATION_STYLE: 0.5 }, {}],
    ["GWIMUN", "TRAIT", "DEEP_SENSITIVITY", { DEPTH: 1, PATTERN_SENSE: 1, CURIOSITY: 1 }, {}],
    ["HWAGAE", "TRAIT", "DEEP_SENSITIVITY", { ENERGY_DIRECTION: -0.5, DEPTH: 1, CREATION: 1, MEANING: 1 }, {}],
    ["YANGIN", "TRAIT", "BOUNDARY_FORCE", { RISK_STYLE: 0.5, BOUNDARY: 1, INITIATIVE: 1, AUTONOMY: 1 }, {}],
    ["GONGMANG", "DYNAMIC", "EMPTY_REINTERPRET", {}, {}],
    ["GOSIN", "TRAIT", "SOLITUDE", { RELATION_STYLE: -0.5, RECOVERY_NEED: 0.5, AUTONOMY: 0.5 }, {}],
    ["GWASUK", "TRAIT", "SOLITUDE", { RELATION_STYLE: -0.5, RECOVERY_NEED: 0.5, AUTONOMY: 0.5 }, {}],
  ] as const)("%s major marker contract", (key, kind, family, axes, fortuneTags) => {
    expect(SHINSAL_SEMANTICS[key]).toMatchObject({ sourceType: "shinsal", kind, tier: "AMPLIFIER", family });
    expect(SHINSAL_SEMANTICS[key].axes).toEqual(axes); expect(SHINSAL_SEMANTICS[key].fortuneTags).toEqual(fortuneTags);
  });
  it.each([
    ["GEOP", { COMPETITION: 0.5 }, "COMPETITIVE_PRESSURE"], ["JAE", { STRATEGY: 0.5 }, "CONSTRAINT_STRATEGY"],
    ["CHEON", {}, "EXTERNAL_LIMIT"], ["WOL", { RECOVERY_NEED: 0.25, DEPTH: 0.25 }, "DELAY_REVIEW"],
    ["MANGSIN", { CHARISMA: 0.25 }, "VISIBILITY_RISK"], ["YUKHAE", { RECOVERY_NEED: 0.5 }, "LOAD_FATIGUE"],
  ] as const)("%s low-weight dynamic", (key, axes, tag) => {
    expect(SHINSAL_SEMANTICS[key]).toMatchObject({ kind: "DYNAMIC", tier: "AMPLIFIER", rawWeight: 0.25, dynamicTags: [tag] });
    expect(SHINSAL_SEMANTICS[key].axes).toEqual(axes);
  });
  it("12 references reuse existing definitions, and family membership is unique", () => {
    expect(Object.keys(TWELVE_SHINSAL_REFERENCES)).toHaveLength(12);
    expect(Object.keys(SHINSAL_SEMANTICS)).toHaveLength(27);
    for (const key of Object.values(TWELVE_SHINSAL_REFERENCES)) expect(SHINSAL_SEMANTICS[key]).toBeDefined();
    for (const key of Object.keys(SHINSAL_SEMANTICS) as FoundationMarker[]) {
      expect(Object.entries(SHINSAL_FAMILIES).filter(([, members]) => members.includes(key))).toEqual([[SHINSAL_SEMANTICS[key].family, SHINSAL_FAMILIES[SHINSAL_SEMANTICS[key].family]]]);
    }
    for (const key of ["JISAL", "NYEON", "JANGSEONG", "BANAN", "YEOKMA", "HWAGAE"] as const)
      expect(Object.values(TWELVE_SHINSAL_REFERENCES)).toContain(key);
    expect(NATAL_MARKER_ALIASES["shinsal:YEOKMASAL"]).toBe(NATAL_MARKER_ALIASES["shinsal:TWELVE_YEOKMASAL"]);
    expect(NATAL_MARKER_ALIASES["shinsal:HWAGAE"]).toBe(NATAL_MARKER_ALIASES["shinsal:TWELVE_HWAGAE"]);
  });
});

describe("13D-1C safety / human source language", () => {
  const definitions = [...Object.values(RELATION_SEMANTICS), ...Object.values(TWELVE_STAGE_SEMANTICS), ...Object.values(SHINSAL_SEMANTICS)];
  it.each(definitions)("$family: no new axis, unsupported predictions or strong fortune promotion", entry => {
    for (const axis of Object.keys(entry.axes)) expect(SEMANTIC_AXES).toContain(axis);
    for (const tag of entry.dynamicTags) expect(DYNAMIC_TAGS).toContain(tag);
    for (const tag of Object.keys(entry.fortuneTags)) expect(FORTUNE_TAGS).toContain(tag);
    expect(entry.tier).not.toBe("CORE");
    const text = Object.entries(entry).filter(([k]) => /Meaning|Description|image/.test(k)).map(([, v]) => v).join(" ");
    expect(text).not.toMatch(/발현|상호작용|양상|사회적 지위|역할과 이름|내적 성찰|재정적 성취|경향성이 있습니다/);
    expect(text).not.toMatch(/헤어진다|사고|나쁜 관계|실패|질병|범죄|원수|악연|죽음|무덤|불행|정신질환|귀신|신기|환청|우울증|바람기|폭력|결혼 못함|배우자복 없|부자|승진|고위직|CEO|대성|사람복이 있습니다|명예운|재물운|높은 직책을|이성운|사업 기회가 많/);
  });
  it("required plain-language samples and first-vs-intimate charm remain distinct", () => {
    expect(RELATION_SEMANTICS.WONJIN.easyMeaning).toBe("신경이 쓰이기 때문에 더 자꾸 보게 되는 관계입니다.");
    expect(SHINSAL_SEMANTICS.HYEONCHIM.easyMeaning).toBe("작은 오류와 빠진 조건을 먼저 알아차리는 눈을 보조하는 기운입니다.");
    expect(SHINSAL_SEMANTICS.HWAGAE.humanDescription).toBe("사람들과 잘 지내더라도 혼자 생각하거나 만들 시간이 꼭 필요할 수 있습니다.");
    expect(SHINSAL_SEMANTICS.GONGMANG.easyMeaning).toBe("기대한 자리가 그대로 채워지지 않아 다른 방법을 다시 찾게 만드는 흐름입니다.");
    expect(SHINSAL_SEMANTICS.DOHWA.fortuneTags).toHaveProperty("FIRST_IMPRESSION");
    expect(SHINSAL_SEMANTICS.HONGYEOM.fortuneTags).toHaveProperty("INTIMATE_CHARM");
    expect(SHINSAL_SEMANTICS.HONGYEOM.family).not.toBe(SHINSAL_SEMANTICS.DOHWA.family);
    expect(SHINSAL_SEMANTICS.GWIMUN.riskTags).toEqual(["RUMINATION", "FIXATION"]);
  });
});
