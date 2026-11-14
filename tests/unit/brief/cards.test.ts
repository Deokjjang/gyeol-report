import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type Brief, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { cardWhere, connect, connectionToPair, mbtiCards, myeongriCard, plainGrade, type FeatureCard } from "@/lib/brief/cards";
import { buildFactSheet } from "@/lib/factsheet/build";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { createRng } from "@/lib/brief/seed";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-10-27";
const person = (key: string, ctx?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const card = (id: string, system: "myeongri" | "mbti", tags: Record<string, number>, mbti?: string): FeatureCard => ({ id, system, key: id, name: id, where: [], strength: "strong", tags, domains: [], polarity: "mixed", ...(mbti ? { mbti } : {}) });

describe("W3 P3 연결 규칙(connect)", () => {
  it("함께 가진 차원이 없으면(둘 다 |값| ≥ 0.3) 연결하지 않는다", () => {
    expect(connect(card("a", "myeongri", { planning: 0.2 }), card("b", "myeongri", { planning: 0.9 }), k)).toBeNull();
    expect(connect(card("a", "myeongri", { planning: 0.8 }), card("b", "myeongri", { directness: 0.9 }), k)).toBeNull();
  });
  it("scorePair: 같은 부호 둘 다 ≥ 0.4 → 공통, 반대 둘 다 ≥ 0.4 → 긴장, 반대·한쪽 < 0.4 → 차이, 섞임 → 보완", () => {
    expect(connect(card("a", "myeongri", { planning: 0.8 }), card("b", "myeongri", { planning: 0.6 }), k)?.kind).toBe("공통");
    expect(connect(card("a", "myeongri", { planning: 0.8 }), card("b", "myeongri", { planning: -0.6 }), k)?.kind).toBe("긴장");
    expect(connect(card("a", "myeongri", { planning: 0.8 }), card("b", "myeongri", { planning: -0.35 }), k)?.kind).toBe("차이");
    expect(connect(card("a", "myeongri", { planning: 0.8, directness: 0.8 }), card("b", "myeongri", { planning: 0.7, directness: -0.7 }), k)?.kind).toBe("보완");
    // 같은 부호인데 한쪽이 0.4 미만이면 공통이라 부를 만큼 겹치지 않는다.
    expect(connect(card("a", "myeongri", { planning: 0.8 }), card("b", "myeongri", { planning: 0.35 }), k)).toBeNull();
  });
  it("Fusion 규칙이 있으면 그 kind·dimension(resonance → 공통, tension → 긴장, conditional → 보완), 이유는 장면 문장 없이 한 문장", () => {
    const [fid, rules] = [...k.fusionByFeature].find(([id, rs]) => k.features.has(id) && rs.some(r => /^[EI][NS][TF][JP]$/.test(r.mbtiTarget)))!;
    const r = rules.find(x => /^[EI][NS][TF][JP]$/.test(x.mbtiTarget))!;
    const f = k.features.get(fid)!, p = k.mbti.get(r.mbtiTarget as never)!;
    const mc = myeongriCard({ id: "t1", featureId: fid, name: f.name, strength: "strong" }, f, ["일주"], k), bc = mbtiCards(p, k)[0];
    const c = connect(mc, bc, k);
    if (!c) return; // 두 카드가 함께 가진 차원이 없으면 연결 없음(규칙이 있어도)
    expect(c.kind).toBe({ resonance: "공통", tension: "긴장", conditional: "보완" }[r.kind]);
    expect(c.source).toBe(r.id);
    expect(c.why.length).toBeGreaterThan(5);
    expect(c.why).not.toMatch(/['"“”]/);
  });
  it("MBTI 카드: 유형 1 + 기능(역할) + 태도 글자, 기능 카드 태그는 그 기능이 만드는 차원 끝만", () => {
    const cs = mbtiCards(k.mbti.get("ENTJ")!, k);
    expect(cs[0].key).toBe("ENTJ");
    expect(cs.map(c => c.key)).toEqual(expect.arrayContaining(["Te", "J"]));
    for (const c of cs) expect(c.system).toBe("mbti");
  });
  it("등급 말은 뜻 말로(작가용)", () => {
    expect(plainGrade("토 과다")).toBe("토 많음");
    expect(plainGrade("매우 신약한 사주")).not.toMatch(/신약/);
    expect(plainGrade("규칙의 힘(관성) 강 · 배우는 힘(인성) 보통")).toBe("규칙의 힘(관성) 넉넉한 쪽 · 배우는 힘(인성) 있는 만큼 쓰는 쪽");
    expect(plainGrade("명리: 비겁(나와 같은 기운) 강함 · 인성(배움·보호) 보통")).toBe("명리: 비겁(나와 같은 기운) 넉넉한 쪽 · 인성(배움·보호) 있는 만큼 쓰는 쪽");
    expect(plainGrade("식상이 보통이라 말과 행동을 섞어")).not.toMatch(/보통/);
  });
});

const fixed: [string, BriefInput][] = [
  ["종합", { product: "saju_mbti_full", person: person("haram", "c1"), baseDate }],
  ["연애 시간 미상", { product: "love_marriage_child", person: person("seoyun", "c2"), baseDate }],
  ["커리어 MBTI 없음", { product: "career_money_study", person: person("minjun", "c3"), baseDate }],
  ["커리어 c1", { product: "career_money_study", person: person("haram", "c1"), baseDate }],
  ["궁합 연인", { product: "saju_mbti_compatibility", person: person("haram"), partner: person("jiwoo"), relationshipType: "love", baseDate }],
];
const MBTIS = [...k.mbti.keys()];
const random = Array.from({ length: 8 }, (_, i) => {
  const r = createRng(7100 + i), unknown = r.next() < 0.4;
  const p: BriefPersonInput = { name: `카드${i}`, gender: (["MALE", "FEMALE", ""] as const)[r.int(3)], birthDate: `${1960 + r.int(45)}-${String(1 + r.int(12)).padStart(2, "0")}-${String(1 + r.int(28)).padStart(2, "0")}`,
    birthTime: unknown ? "" : `${String(r.int(24)).padStart(2, "0")}:${String(r.int(60)).padStart(2, "0")}`, birthTimeUnknown: unknown, mbtiType: r.next() < 0.3 ? "" : r.pick(MBTIS),
    context: { relationshipStatus: r.pick(["", "single", "dating", "married"]), jobStatus: r.pick(["", "employee", "freelancer", "student", "business_owner"]), detailJob: "" } };
  return [`무작위 ${i}`, { product: (["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_full"] as const)[i % 4], person: p, baseDate }] as [string, BriefInput];
});
const books: { label: string; input: BriefInput; brief: Brief }[] = [];
for (const [label, input] of [...fixed, ...random]) { try { books.push({ label, input, brief: buildBrief(input, k) }); } catch (e) { if (!String(e).includes("Uncertain")) throw e; } }
const sectionsOf = (b: Brief) => b.chapters.flatMap(c => (c.sections ?? []).map(s => ({ c, s })));

describe("W3 P3 절 설계 카드(4종)", () => {
  it("4종 절마다 card, 브리프 design 칸, materials·plan은 그대로", () => {
    for (const { label, brief } of books) {
      expect(brief.design, label).toBeDefined();
      expect(brief.plan, label).toBeDefined();
      for (const { s } of sectionsOf(brief)) { expect(s.card, label).toBeDefined(); expect(s.materials.length).toBeGreaterThan(0); expect(s.card!.evidence.length).toBeLessThanOrEqual(3); }
    }
  });
  it("장마다 연결 하나 이하·팩폭 하나 이하·처방 하나 이하, 같은 연결 책 1번, 같은 차원 책 2번, 같은 처방 종류 책 2번", () => {
    for (const { label, brief } of books) {
      const seen = new Set<string>(), dims = new Map<string, number>(), rx = new Map<string, number>();
      for (const c of brief.chapters) {
        const cards = (c.sections ?? []).map(s => s.card!);
        expect(cards.filter(x => x.link).length, `${label} ${c.id}`).toBeLessThanOrEqual(1);
        expect(cards.filter(x => x.punch).length, `${label} ${c.id}`).toBeLessThanOrEqual(1);
        expect(cards.filter(x => x.rx).length, `${label} ${c.id}`).toBeLessThanOrEqual(1);
        for (const x of cards) {
          if (x.link) { const key = `${x.link.a}|${x.link.b}|${x.link.tag}`; expect(seen.has(key), key).toBe(false); seen.add(key); dims.set(x.link.tag, (dims.get(x.link.tag) ?? 0) + 1); }
          if (x.rx) rx.set(x.rx, (rx.get(x.rx) ?? 0) + 1);
        }
      }
      for (const [d, n] of dims) expect(n, `${label} ${d}`).toBeLessThanOrEqual(2);
      for (const [kd, n] of rx) expect(n, `${label} ${kd}`).toBeLessThanOrEqual(2);
      expect(brief.design!.links.length).toBe(sectionsOf(brief).filter(x => x.s.card!.link).length);
    }
  });
  it("MBTI 없음 → MBTI 카드 0·연결 0, 시간 미상 → 시 자리 근거 0", () => {
    for (const { label, input, brief } of books) {
      if (!input.person.mbtiType && !input.partner) { expect(brief.design!.cards.filter(c => c.system === "mbti"), label).toEqual([]); expect(brief.design!.links, label).toEqual([]); }
      if (input.person.birthTimeUnknown && !input.partner) for (const { s } of sectionsOf(brief)) for (const e of s.card!.evidence) expect(e.where, label).not.toMatch(/시[간지주]/);
    }
  });
  it("소품은 MBTI 씨앗으로 위장하지 않는다(seedId prop 0)", () => {
    for (const { brief } of books) for (const { s } of sectionsOf(brief)) for (const m of s.materials) if (m.kind === "mbti") expect(m.seedId).not.toBe("prop");
  });
  it("궁합 연결은 두 사람 카드끼리, 방향(A→B·B→A)을 단다", () => {
    const pair = books.find(b => b.label === "궁합 연인")!.brief;
    const cards = new Map(pair.design!.cards.map(c => [c.id, c]));
    expect(pair.design!.links.length).toBeGreaterThan(0);
    for (const l of pair.design!.links) { expect(cards.get(l.a)?.owner).not.toBe(cards.get(l.b)?.owner); expect(l.dir).toMatch(/→/); }
  });
  it("카드 단계 사실 대조: 정답지와 다른 자리·없는 신살은 뺀다", () => {
    const b = books[0].brief, sheet = buildFactSheet(books[0].input, null, k);
    const t = b.traits.find(x => x.family === "shinsal" || x.family === "gwiin") ?? b.traits.find(x => x.family === "tenGod")!;
    expect(cardWhere(t, undefined, sheet.people[0]).drop).toBeUndefined();
    const facts = { ...sheet.people[0], shinsal: [], tenGods: {}, pillars: { ...sheet.people[0].pillars, day: null } };
    expect(cardWhere(t, undefined, facts as never).drop).toBeTruthy();
    expect(cardWhere(b.traits.find(x => x.family === "dayPillar")!, undefined, facts as never).drop).toBeTruthy();
    for (const { brief } of books) expect(Array.isArray(brief.design!.card_fact_drop)).toBe(true);
  });
  it("작가 입력(W4 Q2 — 카드 바꿔치기 철회): 절은 {q, materials}(card 없음), shadows는 가고 design은 안 간다. 특성 지식 DB 장면·등급 말(신강·신약·중화·과다·묶음 강/보통/약)이 없다", () => {
    for (const { label, brief } of books) {
      const w = renderWriterBrief(brief, { knowledge: k }) as Record<string, unknown> & { chapters: { sections?: Record<string, unknown>[] }[]; traits: Record<string, unknown>[] };
      expect(w).not.toHaveProperty("design"); expect(w, label).toHaveProperty("shadows");
      for (const c of w.chapters) for (const s of c.sections ?? []) {
        expect(s, label).toHaveProperty("materials"); expect(s, label).not.toHaveProperty("card");
        for (const m of s.materials as { kind: string; scene?: string }[]) if (m.kind === "trait") expect(m.scene, label).toBeUndefined();
      }
      // 특성 자리(정답지로 맞춘 카드 자리)를 쉬운 이름으로 준다. 세기는 등급 말 대신 드러나는 정도로.
      expect(w.traits.some(t => typeof t.at === "string" && /태어난 (해|달|날|시각) (하늘 글자|땅 글자|기둥)\([연월일시][간지주]\)/.test(t.at as string)), label).toBe(true);
      for (const t of w.traits) expect(t, label).not.toHaveProperty("strength");
      const text = JSON.stringify(w);
      expect(text, label).not.toMatch(/신강|신약|중화|과다/);
      expect(text, label).not.toMatch(/(비겁|식상|재성|관성|인성)(\([^)]*\))?\)? (강함|강|보통|약함|약)(?![가-힣])/);
    }
  });
  it("세운·대운(AM)은 카드를 만들지 않는다(AM 출력 그대로)", () => {
    const am = buildBrief({ product: "major_fortune", person: person("seoyun", "c2"), baseDate }, k);
    expect(am.design).toBeUndefined();
    for (const c of am.chapters) for (const s of c.sections ?? []) expect(s.card).toBeUndefined();
  });
  it("AM 어댑터: 연결 → 짝(명리 × MBTI만, 차이는 긴장으로)", () => {
    const b = books[0].brief, cards = new Map(b.design!.cards.map(c => [c.id, c]));
    const l = b.design!.links[0];
    const p = connectionToPair(l, cards, id => `L:${id}`, "P1");
    expect(p).not.toBeNull();
    expect(["공통", "보완", "긴장"]).toContain(p!.reason);
    expect(connectionToPair({ ...l, b: l.a }, cards, id => `L:${id}`, "P2")).toBeNull();
  });
});
