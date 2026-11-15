// W7 성격 정답지(외부 호출 0, 합성 꼬리표·가상 인물만): 우선순위 무게 · MBTI 기여 · 긴장 판정 · 줄 거르기 · 성격표 파생 · 검사·수리 대조 · D3 개수 조건.
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { loadKnowledge } from "@/lib/brief";
import type { Knowledge } from "@/lib/brief/knowledge";
import { featureTexts, hitWeight, lineFits, mbtiContributions, personaDimMap, personaKey, personaSheet, profileCodesFromSheet, type PersonaSheet } from "@/lib/brief/persona";
import type { FeatureHit } from "@/lib/brief/featureTypes";
import type { PersonaTag } from "@/data/knowledge-v5/schema";
import { contradictionFlags, sheetOpposes, type ContradictionCtx } from "@/lib/writer/safety/contradiction";
import { swapMaterials, materialTable } from "@/lib/writer/prompt/materials";
import { revertRepairRegressions } from "@/lib/writer/repair3";
import type { FinalChapter } from "@/lib/writer/safety";

const ROOT = join(__dirname, "../../..");
const k0 = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const hit = (id: string, family: string, positions: string[] = [], strength: "strong" | "medium" | "weak" = "medium") => ({ id, family, positions, strength, count: 1, basis: "" }) as unknown as FeatureHit;
const tag = (k: PersonaTag["k"], d: [string, 1 | -1, 1 | 2 | 3][], extra: Partial<PersonaTag> = {}): PersonaTag => ({ k, d, s: 1, by: "data", ...extra });
const sheetOf = (dims: { id: string; v: 1 | -1 | 0; tension?: { plus: object; minus: object } }[]): PersonaSheet => ({ dims: dims.map(d => ({ plus: 0, minus: 0, why: [], ...d })), core: [], tensions: [], discoveries: [] }) as PersonaSheet;

describe("W7-2 우선순위 무게(보고서 표)", () => {
  it("일간·월령·센/약한 오행 3 · 투출 십성·일주 2 · 지장간 십성·신살 1 · 사주 안 관계 0 · 강약 곱", () => {
    expect(hitWeight(hit("dayMaster:甲", "dayMaster"), {})).toBe(3);
    expect(hitWeight(hit("climate:SUMMER", "climate"), {})).toBe(3);
    expect(hitWeight(hit("element:WATER:WEAK", "element"), {})).toBe(3);
    expect(hitWeight(hit("tenGod:偏財", "tenGod", ["month"]), { month: "偏財" })).toBe(2);
    expect(hitWeight(hit("tenGod:偏財", "tenGod", ["month"]), { month: "正官" })).toBe(1);
    expect(hitWeight(hit("dayPillar:甲申", "dayPillar"), {})).toBe(2);
    expect(hitWeight(hit("shinsal:HWAGAE", "shinsal"), {})).toBe(1);
    expect(hitWeight(hit("relation:CHUNG", "relation"), {})).toBe(0);
    expect(hitWeight(hit("shinsal:WONJINSAL", "shinsal"), {})).toBe(0);
    expect(hitWeight(hit("dayMaster:甲", "dayMaster", [], "strong"), {})).toBe(4.5);
  });
  it("MBTI: 주·부기능 3 · 글자 2 · 3·4차 1(ENTJ 결정 속도 = Te 주기능)", () => {
    const c = mbtiContributions(k0, "ENTJ");
    expect(c.find(x => x.dim === "decisionSpeed" && x.pole === 1)?.w).toBe(3);
    expect(c.find(x => x.dim === "socialEnergy" && x.pole === 1)?.w).toBe(2);
    expect(mbtiContributions(k0, null)).toEqual([]);
  });
});

describe("W7-2 정답지 판정", () => {
  // 한 특징의 줄에 합성 꼬리표를 달아 만든 지식(원본 지식은 건드리지 않음).
  const withTags = (pairs: [string, PersonaTag][]): Knowledge => ({ ...k0, personaTags: new Map(pairs.map(([t, g]) => [personaKey(t), g])) }) as Knowledge;
  const dm = hit("dayMaster:甲", "dayMaster"), texts = featureTexts(k0, dm);
  it("두 끝이 모두 기준 이상·차이 작음 + 조건이 다르면 조건부 긴장(끝마다 줄 절반 넘게 조건), 아니면 큰 쪽만", () => {
    const [a, b, c, d] = texts;
    const k1 = withTags([[a.text, tag("trait", [["conflictApproach", 1, 3]], { c: { sit: "pressure", span: "x" } })], [b.text, tag("trait", [["conflictApproach", -1, 3]], { c: { who: "close", span: "y" } })], [c.text, tag("trait", [["conflictApproach", 1, 3]], { c: { sit: "pressure", span: "x" } })], [d.text, tag("trait", [["conflictApproach", -1, 3]], { c: { who: "close", span: "y" } })]]);
    const sh = personaSheet(k1, [dm], {}, null), dim = sh.dims.find(x => x.id === "conflictApproach")!;
    expect(dim.plus).toBeGreaterThan(0); expect(dim.minus).toBeGreaterThan(0);
    expect(dim.tension).toBeDefined();
    const k2 = withTags([[a.text, tag("trait", [["decisionSpeed", 1, 3]])], [b.text, tag("trait", [["decisionSpeed", 1, 2]])], [c.text, tag("trait", [["decisionSpeed", -1, 1]])]]);
    const d2 = personaSheet(k2, [dm], {}, null).dims.find(x => x.id === "decisionSpeed")!;
    expect(d2.v).toBe(1); expect(d2.tension).toBeUndefined();
  });
  it("같은 입력이면 같은 정답지(결정론)", () => {
    const k1 = withTags([[texts[0].text, tag("trait", [["planning", 1, 2]])]]);
    expect(personaSheet(k1, [dm], {}, "INFP")).toEqual(personaSheet(k1, [dm], {}, "INFP"));
  });
  it("MBTI가 있으면 E/I·J/P 다섯 차원은 글자 쪽(최종판2 1-3): ISTJ = I·뒤·정리한 뒤", () => {
    const sh = personaSheet(k0, [dm], {}, "ISTJ"), codes = profileCodesFromSheet(sh, "ISTJ");
    expect([codes.energy, codes.lead, codes.conflict]).toEqual(["I", "back", "later"]);
  });
});

describe("W7-3 줄 거르기", () => {
  const sh = sheetOf([{ id: "decisionSpeed", v: 1 }, { id: "conflictApproach", v: -1, tension: { plus: { sit: "pressure" }, minus: {} } }, { id: "planning", v: 0 }]);
  it("긴장 아닌 차원에서 반대 끝이면 뺀다 · 같은 끝·흐름·설명·꼬리표 없음은 둔다", () => {
    expect(lineFits(sh, tag("trait", [["decisionSpeed", -1, 2]]))).toBe(false);
    expect(lineFits(sh, tag("trait", [["decisionSpeed", 1, 2]]))).toBe(true);
    expect(lineFits(sh, tag("flow", []))).toBe(true);
    expect(lineFits(sh, undefined)).toBe(true);
  });
  it("긴장 차원은 그 끝의 조건과 맞는 줄만", () => {
    expect(lineFits(sh, tag("trait", [["conflictApproach", 1, 2]], { c: { sit: "pressure", span: "압박을 받을 때" } }))).toBe(true);
    expect(lineFits(sh, tag("trait", [["conflictApproach", 1, 2]]))).toBe(false);
    expect(lineFits(sh, tag("trait", [["conflictApproach", -1, 2]]))).toBe(true);
  });
  it("재료 바꾸기: 뺄 조각은 빼고 이름표만 남으면 통째로, 바꾼 재료(rw)는 그대로 넣는다", () => {
    const t = materialTable(k0), [orig, mat] = [...t.exact].find(([o, m]) => o !== m && o.length > 30)!;
    expect(swapMaterials(orig, t, () => false)).toBe("");
    expect(swapMaterials(`결정 습관에서 나온 원칙: ${orig}`, t, () => false)).toBe("");
    expect(swapMaterials(orig, t, () => "자리 이동이 잦은 흐름")).toBe("자리 이동이 잦은 흐름");
    expect(swapMaterials(orig, t, () => true)).toBe(mat);
  });
});

describe("W7-4 책 검사·수리 대조", () => {
  const sheets = [sheetOf([{ id: "decisionSpeed", v: -1 }, { id: "emotionalExpression", v: -1, tension: { plus: { who: "close" }, minus: {} } }])];
  const ctx: ContradictionCtx = { compat: false, people: [{ names: ["가람"], label: "가람님" }], sheets, dimMap: personaDimMap(k0) };
  it("정답지와 반대 끝(긴장 아닌 차원) = 모순 · 긴장 차원은 기록만", () => {
    const s = (chapter: number, sentence: string) => ({ chapter, section: 0, paragraph: 0, sentence });
    const hits = contradictionFlags([s(3, "당신은 두세 가지만 보고 뒤돌아보지 않고 정하는 편이에요.")], ctx);
    expect(hits.length).toBe(1); expect(hits[0].detail).toContain("성격 정답지");
    expect(sheetOpposes("당신은 기분이 표정에 바로 묻어나는 편이에요.", ctx).tension.length).toBe(1);
    expect(sheetOpposes("당신은 기분이 표정에 바로 묻어나는 편이에요.", ctx).hard.length).toBe(0);
  });
  it("수리 문장이 정답지와 반대 끝이면 원문으로(지시 6) · 새 성격 주장은 기록", () => {
    const before = "당신은 고르는 데 시간을 들이는 편이에요.", after = "당신은 두세 가지만 보고 뒤돌아보지 않고 정하는 편이에요.";
    const ch = [{ n: 2, id: "c2", title: "장", source: "writer", chars: 0, sections: [{ heading: "절", paragraphs: [after] }] } as unknown as FinalChapter];
    const r = revertRepairRegressions(ch, [{ kind: "sentence", at: "2.0.0", before, after, source: "review" } as never], { flags: [], names: [], persona: ctx });
    expect(r.reverted.map(x => x.rule.split(":")[0])).toContain("repair_persona");
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe(before);
    expect(r.claims.length).toBe(1);
  });
});
