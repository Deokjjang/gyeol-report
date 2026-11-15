// W6 S2(외부 호출 0, 가상 인물 + 합성 문장만): 넓은 꼴 씨앗(B1) · 세기 행동 한 줄(B2) · 연결은 배정된 절에만(B3) · 처방 갈래(B6) · 개선 지표(B4·B5) ·
// 렌더 추가 규칙(⓪ 「⟦at⟧ = 자리」 옮김 · ④' 앞 문장이 쓴 구절 · ⑤ 자리를 말한 뒤 관계 글자만 · ⑥ 뜻 괄호 되풀이).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { allocateChapters, RX_FAMILY, type RxKind } from "@/lib/brief/prescriptions";
import { gateMetrics } from "@/lib/writer/gate";
import { renderMarks, type Mark } from "@/lib/writer/marks";
import { markTableFor, renderWriterBrief } from "@/lib/writer/prompt";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { concreteNouns, sceneTier } from "@/lib/writer/safety/sceneTier";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const fullIn: BriefInput = { product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ESFJ") };
const compatIn = { product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput;
const majorIn: BriefInput = { product: "major_fortune", baseDate, person: person("minjun", "c3", "ESFJ") };
const allSeeds = [...k.mbtiSeeds.values()].flatMap(x => Object.values(x).flat());
const mats = (b: ReturnType<typeof buildBrief>) => b.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]);

describe("B1 장면 넓은 꼴", () => {
  it("지식 DB 3,713개 가운데 넓은 꼴이 있는 것은 구체 명사가 없다(2단) · 원문은 그대로", () => {
    const withBroad = allSeeds.filter(s => s.broad);
    expect(withBroad.length).toBeGreaterThan(2600);
    for (const s of withBroad) { expect(sceneTier(s.broad!), s.broad).toBe(2); expect(s.text).not.toBe(s.broad); }
    expect(concreteNouns("고장 난 프린터 뚜껑부터 열어 보기")).toContain("프린터");
  });
  it("4종 작가 재료의 MBTI 씨앗·연결 장면은 넓은 꼴, 세운·대운은 원문", () => {
    const b = buildBrief(fullIn, k);
    const seeds = mats(b).filter(m => m.kind === "mbti" && m.seedId && m.seedId !== "prop") as { scene: string; seedId: string }[];
    expect(seeds.length).toBeGreaterThan(0);
    for (const m of seeds) { const s = allSeeds.find(x => x.id === m.seedId)!; expect(m.scene).toBe(s.broad ?? s.text); }
    const am = buildBrief(majorIn, k);
    for (const m of mats(am).filter(m => m.kind === "mbti" && m.seedId && m.seedId !== "prop") as { scene: string; seedId: string }[]) expect(m.scene).toBe(allSeeds.find(x => x.id === m.seedId)!.text);
  });
});

describe("B2·B3 작가 브리프", () => {
  const F = { brief: buildBrief(fullIn, k) }, sheet = buildFactSheet(fullIn, F.brief, k);
  const view = renderWriterBrief(F.brief, { knowledge: k, facts: sheet }) as { chart: { strength: Record<string, string> }; traits: Record<string, unknown>[]; chapters: { sections?: { materials: { kind: string }[] }[] }[] };
  it("세기는 분류 문구 없이 행동 한 줄(쏠림 설명 칸도 뺌)", () => {
    expect(view.chart.strength.meaning).toMatch(/편$/);
    expect(view.chart.strength.meaning).not.toMatch(/가운데|여린|센 편|세지도|세기/);
    expect(view.chart.strength.skew).toBeUndefined();
  });
  it("명리×MBTI 연결은 특성 목록에서 빼고 배정된 절 재료로만(책에 한 번)", () => {
    const fx = view.chapters.flatMap(c => (c.sections ?? []).flatMap(s => s.materials)).filter(m => m.kind === "fusion") as unknown as { traitId: string }[];
    expect(fx.length).toBeGreaterThan(0);
    expect(new Set(fx.map(x => x.traitId)).size).toBe(fx.length);
    // 절에 배정된 연결의 특성에는 fusion 칸이 없다. 배정이 없는 궁합은 특성 칸에 남는다(연결이 통째로 빠지지 않게).
    for (const t of view.traits) if (fx.some(x => x.traitId === t.id)) expect("fusion" in t).toBe(false);
    const C = buildBrief(compatIn, k), cv = renderWriterBrief(C, { knowledge: k, facts: buildFactSheet(compatIn, C, k) }) as { traits: Record<string, unknown>[] };
    expect(cv.traits.some(t => "fusion" in t)).toBe(C.traits.some(t => t.fusion));
  });
});

describe("B6 처방 갈래 · B4·B5 지표", () => {
  it("말 한마디·안부·다시 읽기·말 다듬기·끝까지 듣기는 한 갈래로 센다(갈래 상한 = 종류 상한)", () => {
    const fam = Object.entries(RX_FAMILY).filter(([, f]) => f === "말 건네기").map(([kd]) => kd as RxKind);
    const chapters = Array.from({ length: 8 }, (_, i) => ({ n: i + 1, id: `c${i}`, keyed: false }));
    const table = Object.fromEntries(chapters.map(c => [c.id, fam]));
    const r = allocateChapters(chapters, new Map(), { table, cap: 2, family: true, fallback: ["적기·목록", "쉬기·잠", "하루 묵히기", "혼자 시간", "몸 움직이기", "끝낼 일 하나"] as RxKind[] });
    expect([...r.values()].filter(x => x.use && fam.includes(x.use)).length).toBe(2);
    const old = allocateChapters(chapters, new Map(), { table, cap: 2, fallback: [] });
    expect([...old.values()].filter(x => x.use && fam.includes(x.use)).length).toBeGreaterThan(2);
  });
  it("꼬리 틀·판정 풀어쓰기·얇은 문단·차단 갈래 수", () => {
    const ch = [{ sections: [{ paragraphs: ["당신은 끝까지 해내는 사람이에요. 당신은 먼저 손을 쓰는 사람이에요.", "힘이 세지도 여리지도 않은 가운데예요. 둘째 문장이에요. 셋째 문장이에요."] }] }];
    const g = gateMetrics(ch, [{ rule: "broken_sentence", paragraph: 0 }, { rule: "phrase_repeat", paragraph: 0 }, { rule: "scene_unbacked", paragraph: 1 }], splitSentences);
    expect(g.tails["~사람이에요"]).toBe(2); expect(g.verdict).toBe(2); expect(g.thin).toBe(1); expect(g.block.broken).toBe(1); expect(g.scenes).toBe(1);
  });
});

describe("A1 렌더 추가 규칙", () => {
  const mk = (key: string, text: string, extra: Partial<Mark> = {}): [string, Mark] => [key, { key, kind: key.split(":")[0] as Mark["kind"], text, ...extra }];
  const t = new Map([mk("at:t1", "태어난 날 기둥(일주)", { short: "이 자리", codes: ["일주"] }), mk("un:now", "을축 대운(정재의 10년)", { short: "이 대운", codes: ["을축 대운"] }),
    mk("in:1", "태어난 해 땅 글자 묘와 태어난 시각 땅 글자 진 사이의 해(가까운 사이의 작은 서운함)", { short: "이 관계", glyph: "묘와 진 사이의 해(가까운 사이의 작은 서운함)" })]);
  it("⓪ 브리프 칸 「⟦at⟧ = 자리」를 옮긴 꼴 · ④' 앞 문장이 쓴 구절은 짧은 꼴", () => {
    expect(renderMarks("⟦at:t1⟧ = 태어난 날 기둥(일주)이 경인이에요.", t)).toBe("태어난 날 기둥(일주)이 경인이에요.");
    expect(renderMarks("지금은 을축 대운(정재의 10년)이 들어와 있어요. ⟦un:now⟧은 꾸준한 돈의 흐름입니다.", t)).toBe("지금은 을축 대운(정재의 10년)이 들어와 있어요. 이 대운은 꾸준한 돈의 흐름입니다.");
  });
  it("⑤ 자리를 이미 말했으면 관계는 글자만 꼴 · ⑥ 뜻 괄호를 문장 뒤에서 또 말하면 괄호를 뗀다", () => {
    expect(renderMarks("태어난 해와 시각 사이에 ⟦in:1⟧도 있어요.", t)).toBe("태어난 해와 시각 사이에 묘와 진 사이의 해(가까운 사이의 작은 서운함)도 있어요.");
    expect(renderMarks("당신 사주에는 ⟦in:1⟧도 있어서, 가까운 사이의 작은 서운함이 남기 쉬워요.", t)).toBe("당신 사주에는 태어난 해 땅 글자 묘와 태어난 시각 땅 글자 진 사이의 해도 있어서, 가까운 사이의 작은 서운함이 남기 쉬워요.");
    expect(renderMarks("지금 대운은 ⟦un:now⟧로 정재의 10년이에요.", t)).toBe("지금 대운은 을축 대운으로 정재의 10년이에요.");
  });
  it("실제 표: 대운 표시 구절에 한자 괄호가 없다(뜻 괄호 떼기가 겹괄호를 못 보던 것)", () => {
    const b = buildBrief(fullIn, k), s = buildFactSheet(fullIn, b, k), m = markTableFor(b, s);
    for (const x of [...m.values()].filter(x => x.kind === "un")) expect(x.text).not.toMatch(/[一-鿿]/);
    expect(buildBrief(compatIn, k).compatibility).toBeTruthy();
  });
});
