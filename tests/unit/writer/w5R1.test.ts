// W5 R1 사실 표시(외부 호출 0, 가상 인물 + 합성 문장만): 표시 → 정답지 구절 · 조사 맞춤 · 남은·모르는·깨진 표시(fact_mark HARD) ·
// 작가 브리프의 표시 칸(궁합 사이 관계·개수·사주 안 관계·신살 주인, 특성 자리, 대운) · W4 1차 궁합의 사실 오류 꼴이 검사에 잡히는지.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { buildWriterPrompt, markTableFor, renderWriterBrief } from "@/lib/writer/prompt";
import { STYLE_EXAMPLES } from "@/lib/writer/prompt/examples";
import { WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { estimateTokens } from "@/lib/brief";
import { finalSound, fixParticle, MARK_LEFT, renderMarks, type Mark } from "@/lib/writer/marks";
import { HARD_RULES, lintBook, tidyBook, type LintCtx } from "@/lib/writer/safety/p6c";
import { personNames } from "@/lib/writer/publish";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const compatIn = { product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput;
const fullIn: BriefInput = { product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ESFJ") };
const loveIn: BriefInput = { product: "love_marriage_child", baseDate, person: person("seoyun", "c2", "INTJ") };
const make = (input: BriefInput) => { const brief = buildBrief(input, k); const sheet = buildFactSheet(input, brief, k); return { brief, sheet, marks: markTableFor(brief, sheet) }; };
const C = make(compatIn), F = make(fullIn), L = make(loveIn);
const table = (xs: [string, string][]) => new Map(xs.map(([key, text]) => [key, { key, kind: key.split(":")[0], text } as Mark]));
const ch = (n: number, sections: string[][]) => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer" as const, chars: 0, sections: sections.map((ps, i) => ({ heading: `소제목 ${i}`, paragraphs: ps })) });
const baseCtx = (extra: Partial<LintCtx> = {}): LintCtx => ({
  facts: { birthTimeKnown: true, mbti: "ISTJ", relationship: "dating", children: "unknown", job: "employee" }, jobDetail: "", schoolStage: "none", coreImage: "x",
  nicknames: [], corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: {}, ...extra,
} as LintCtx);

describe("R1 표시 바꿔 넣기 · 조사", () => {
  const t = table([["rel:1", "갑과 기 사이의 천간합(하늘 글자끼리 끌려 묶임)"], ["cnt:all", "11가지"], ["star:2", "도윤님의 현침살"], ["at:t3", "태어난 달 땅 글자(월지)"], ["un:now", "기사 대운(정재의 10년)"]]);
  it("받침: 끝 괄호를 건너뛰고 마지막 한글로 센다(ㄹ받침은 「로」)", () => {
    expect(finalSound("천간합(하늘 글자끼리 끌려 묶임)")).toBe("other");
    expect(finalSound("11가지")).toBe("none");
    expect(finalSound("도윤님의 현침살")).toBe("rieul");
    expect(finalSound("태어난 달 땅 글자(월지)")).toBe("none");
    expect(fixParticle("11가지", "이에요")).toBe("예요");
    expect(fixParticle("천간합(뜻)", "예요")).toBe("이에요");
    expect(fixParticle("도윤님의 현침살", "으로")).toBe("로");
    expect(fixParticle("기사 대운(정재의 10년)", "로")).toBe("으로");
  });
  it("조사 은/는·이/가·을/를·와/과·으로/로·이에요/예요를 받침에 맞춰 고친다 · 조사 없는 자리 · 모르는 표시는 그대로", () => {
    expect(renderMarks("두 사람 사이에는 ⟦rel:1⟧가 걸려 있어요.", t)).toBe("두 사람 사이에는 갑과 기 사이의 천간합(하늘 글자끼리 끌려 묶임)이 걸려 있어요.");
    expect(renderMarks("관계는 모두 ⟦cnt:all⟧이에요.", t)).toBe("관계는 모두 11가지예요.");
    expect(renderMarks("⟦star:2⟧으로 말이 날카로워요.", t)).toBe("도윤님의 현침살로 말이 날카로워요.");
    expect(renderMarks("정재가 ⟦at:t3⟧에 있어요. ⟦at:t3⟧은 사회 자리예요.", t)).toBe("정재가 태어난 달 땅 글자(월지)에 있어요. 태어난 달 땅 글자(월지)는 사회 자리예요.");
    expect(renderMarks("⟦un:now⟧와 다음 흐름을 ⟦rel:1⟧를 통해", t)).toBe("기사 대운(정재의 10년)과 다음 흐름을 갑과 기 사이의 천간합(하늘 글자끼리 끌려 묶임)을 통해");
    expect(renderMarks("⟦rel:99⟧이 있어요.", t)).toBe("⟦rel:99⟧이 있어요.");
  });
  it("신살 주인 표시: 문장이 이미 「두 사람 모두」를 말하거나 바로 앞에 주인 이름이 있으면 이름만(R4 판독 책의 한 문장 안 겹침)", () => {
    const st = new Map([["star:1", { key: "star:1", kind: "star", text: "두 사람 모두에게 있는 현침살", bare: "현침살" } as Mark], ["star:6", { key: "star:6", kind: "star", text: "도윤님의 천덕귀인", bare: "천덕귀인", owner: "도윤님" } as Mark]]);
    expect(renderMarks("⟦star:1⟧처럼 이 기운은 두 사람 모두에게 있습니다.", st)).toBe("현침살처럼 이 기운은 두 사람 모두에게 있습니다.");
    expect(renderMarks("⟦star:1⟧은 말을 바늘처럼 만듭니다.", st)).toBe("두 사람 모두에게 있는 현침살은 말을 바늘처럼 만듭니다.");
    expect(renderMarks("도윤님에게는 ⟦star:6⟧이 있어요. ⟦star:6⟧이 도와요.", st)).toBe("도윤님에게는 천덕귀인이 있어요. 도윤님의 천덕귀인이 도와요.");
  });
  it("남은 표시·모르는 번호·깨진 꼴·대괄호로 바꿔 쓴 것은 fact_mark(HARD) — 정리 단계가 아는 표시는 바꾼 뒤라 걸리지 않는다", () => {
    expect(HARD_RULES.has("fact_mark")).toBe(true);
    const book = [ch(1, [["두 사람 사이에는 ⟦rel:1⟧이 있어요. 이것은 ⟦rel:99⟧이에요. 그리고 ⟦rel:2 같은 깨진 꼴도 있어요. 또 [rel:3]처럼 쓴 문장. 마지막은 rel:4 꼴이에요. 평범한 문장이에요."]])];
    const ctx = baseCtx({ marks: t });
    const flags = lintBook(tidyBook(book, ctx).chapters, ctx).filter(f => f.rule === "fact_mark");
    expect(flags.map(f => f.detail)).toEqual(["⟦", "⟦", "[rel:3]", "rel:4"]);
    expect(MARK_LEFT.test("평범한 문장이에요.")).toBe(false);
  });
});

describe("R1 작가 브리프 표시 칸 · 정답지 구절", () => {
  it("궁합: 사이 관계 수 = 요약 관계 수, 개수 표시 = 합·마찰 수, 관계 문장 칸(두 벌 + 요약)은 표시 칸으로 대신 · 사주 안 관계·신살 주인", () => {
    const w = renderWriterBrief(C.brief, { knowledge: k, facts: C.sheet }) as Record<string, unknown> & { marks: Record<string, string[]>; compatibility: Record<string, unknown> };
    const names = C.brief.compatibility!.relationsSummary!.names;
    expect(w.marks.between.length).toBe(names.length);
    expect(w.marks.between.every(l => /^⟦rel:\d+⟧ = .+님의 태어난 .+ 사이의 /.test(l))).toBe(true);
    const hap = names.filter(n => /합/.test(n)).length;
    expect(w.marks.counts).toEqual([`⟦cnt:all⟧ = ${names.length}가지(두 사람 사이 관계 모두)`, `⟦cnt:hap⟧ = ${hap}가지(그중 합)`, `⟦cnt:clash⟧ = ${names.length - hap}가지(그중 형·충·파·해)`]);
    for (const key of ["dayRelations", "relationsPlain", "relationsSummary"]) expect(w.compatibility[key]).toBeUndefined();
    expect(w.marks.inside.every(l => /^⟦in:[ab]\d+⟧ = .+님 사주 안의 /.test(l))).toBe(true);
    const [a, b] = C.sheet.people;
    for (const l of w.marks.owners) {
      const name = l.replace(/^⟦star:\d+⟧ = (두 사람 모두에게 있는 |.+님의 )/, "");
      const ha = a.shinsal.some(s => s.name === name), hb = b.shinsal.some(s => s.name === name);
      expect(l.includes("두 사람 모두에게"), l).toBe(ha && hb);
    }
  });
  it("한 사람 책: 사주 안 관계 ⟦in:N⟧ · 지금·다음 대운 · 특성 자리 칸에 ⟦at:id⟧ · 표시 표 없이(facts 없음)는 예전 브리프 그대로", () => {
    const w = renderWriterBrief(L.brief, { knowledge: k, facts: L.sheet }) as unknown as { marks: Record<string, string[]>; traits: { id: string; at?: string }[] };
    expect(w.marks.between).toBeUndefined();
    if (L.sheet.people[0].relations.length) expect(w.marks.inside[0]).toMatch(/^⟦in:1⟧ = 태어난 /);
    if (L.brief.chart.currentDayun) expect(w.marks.dayun?.[0]).toMatch(/^⟦un:now⟧ = .. 대운\(..의 10년\)$/);
    const F2 = renderWriterBrief(F.brief, { knowledge: k, facts: F.sheet }) as unknown as { marks: Record<string, string[]> };
    expect(F2.marks.dayun?.[0] ?? "⟦un:now⟧ = 없음").toMatch(/^⟦un:now⟧ = /);
    const ats = w.traits.filter(t => t.at);
    expect(ats.length).toBeGreaterThan(0);
    for (const t of ats) { expect(t.at).toMatch(new RegExp(`^⟦at:${t.id}⟧ = 태어난 `)); expect(L.marks.get(`at:${t.id}`)?.text).toBeTruthy(); }
    const plain = renderWriterBrief(L.brief, { knowledge: k }) as Record<string, unknown>;
    expect(plain.marks).toBeUndefined();
  });
  it("작가 요청 덤프: 4종 3입력 모두 표시 칸이 사용자 메시지에 있고, 지침에 표시 쓰는 법(2,200토큰 안), 예시 1·2에 표시 꼴(x 번호 = 실제 표에 없음)", () => {
    for (const x of [C, F, L]) {
      const p = buildWriterPrompt(x.brief, { knowledge: k, facts: x.sheet });
      expect(p.user).toContain("\"marks\":{\"rule\":\"⟦…⟧는 시스템이");
      expect(p.user).toMatch(/⟦(rel|in|un|at):[0-9a-z]+⟧ = /);
    }
    expect(WRITER_SYSTEM).toContain("사실 표시: marks·traits[].at의 ⟦…⟧");
    expect(estimateTokens(WRITER_SYSTEM)).toBeLessThanOrEqual(2200);
    const ex = STYLE_EXAMPLES.slice(0, 2).map(e => e.text).join("\n");
    expect(ex).toMatch(/⟦at:x\d⟧/); expect(ex).toMatch(/⟦rel:x\d⟧이에요/); expect(ex).toContain("⟦cnt:all⟧");
    for (const x of [C, F, L]) for (const m of ex.matchAll(/⟦(\w+):(x\d)⟧/g)) expect(x.marks.has(`${m[1]}:${m[2]}`)).toBe(false);
  });
});

describe("R1-3 표시 밖 사실 문장 대조(W4 1차 궁합 오류 꼴)", () => {
  const ctx = factCtxOf(C.sheet, k, personNames(C.brief));
  const [a, b] = C.sheet.people;
  const call = (i: number) => (i ? C.brief.compatibility!.b.callName : C.brief.compatibility!.a.callName);
  const PLACE: Record<string, string> = { 연: "연지", 월: "월지", 일: "일지", 시: "시지" };
  const KO: Record<string, string> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
  const REL: Record<string, string> = { YUKHAP: "육합", CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진" };
  it("사주 안 관계를 두 사람 사이처럼(다른 사람 이름과 한 문장) → fact_relation · 「사주 안」을 밝힌 문장은 통과", () => {
    const pairKey = (r: { kind: string; members: readonly { char: string }[] }) => `${r.kind}|${[...r.members.map(m => m.char)].sort().join("")}`;
    const pairSet = new Set([...C.sheet.pair!.relations].map(pairKey));
    const pick = [a, b].flatMap((p, i) => p.relations.filter(r => REL[r.kind] && r.members.length === 2 && !pairSet.has(pairKey(r))).map(r => ({ i, r })))[0];
    expect(pick, "가상 두 사람에 사주 안에만 있는 관계가 있어야 한다").toBeTruthy();
    const [m1, m2] = pick.r.members;
    const sen = `${call(pick.i)}의 ${PLACE[m1.where]} ${KO[m1.char]}와 ${PLACE[m2.where]} ${KO[m2.char]}는 서로 ${REL[pick.r.kind]}이라 ${call(1 - pick.i)}과 말이 엇갈려요.`;
    // (자리 글자 = 관계 글자라 자리 검사는 통과하고, 사주 안 관계 검사가 잡아야 한다.)
    expect(factCheck(sen, ctx)).toMatchObject({ rule: "fact_relation" });
    expect(factCheck(`${call(pick.i)} 사주 안의 ${PLACE[m1.where]} ${KO[m1.char]}와 ${PLACE[m2.where]} ${KO[m2.char]} 사이의 ${REL[pick.r.kind]}은 ${call(1 - pick.i)}과는 상관없는 결이에요.`, ctx)?.rule).not.toBe("fact_relation");
  });
  it("「두 사람의 사주에는 X」인데 한 사람만 가진 신살 → fact_term", () => {
    const only = a.shinsal.find(s => !b.shinsal.some(x => x.name === s.name)) ?? b.shinsal.find(s => !a.shinsal.some(x => x.name === s.name));
    expect(only).toBeTruthy();
    expect(factCheck(`두 사람의 사주에는 ${only!.name}이 있어요.`, ctx)).toMatchObject({ rule: "fact_term" });
  });
  it("「A합이 아니라 B합이 걸려 있어」: 앞 부정이 뒤 주장을 덮지 않는다 — 없는 천간합은 fact_relation", () => {
    const stems = new Set(C.sheet.people.flatMap(p => Object.values(p.pillars).flatMap(x => (x ? [x.stem] : []))));
    const HAP = [["갑", "기", "甲", "己"], ["을", "경", "乙", "庚"], ["병", "신", "丙", "辛"], ["정", "임", "丁", "壬"], ["무", "계", "戊", "癸"]];
    const absent = HAP.find(h => !(stems.has(h[2] as never) && stems.has(h[3] as never)))!;
    const present = HAP.find(h => h !== absent) ?? HAP[0];
    // (「반응이 달라요」는 「이 달」이 들어 있어 기존 시점 말 검사가 세운·월운까지 본다 — 문장을 바꿔 쓴다.)
    expect(factCheck(`${present[0]}${present[1]}합이 아니라 ${absent[0]}${absent[1]}합이 걸려 있어 반응만은 서로 다르게 나와요.`, ctx)).toMatchObject({ rule: "fact_relation" });
    expect(factCheck(`두 사람 사이에 ${absent[0]}${absent[1]}합은 없어요.`, ctx)).toBeNull();
  });
  it("W4 1차 궁합 꼴: 있는 관계라도 문장의 두 자리 글자와 관계 글자가 다르면 fact_relation(「월간 신금과 일간 기토 사이에는 병신합」)", () => {
    expect(factCheck("다만 도윤님의 월간 신금과 지우님의 일간 갑목 사이에는 병신합이 걸려 있어, 계획이 틀어졌을 때의 반응이 달라요.", ctx)).toMatchObject({ rule: "fact_relation" });
    expect(factCheck("도윤님의 태어난 날 땅 글자 묘와 지우님의 태어난 날 땅 글자 진 사이의 해(가까운 사이의 작은 서운함)가 있어요.", ctx)).toBeNull();
  });
  it("표시 구절을 그대로 렌더한 문장(사이 관계 · 사주 안 관계 · 신살 주인)은 대조에 걸리지 않는다", () => {
    for (const m of C.marks.values()) {
      if (m.kind === "cnt" || m.kind === "at") continue;
      const sen = `${m.text}${finalSound(m.text) === "none" ? "가" : "이"} 이 장의 근거예요.`;
      expect(factCheck(sen, ctx), sen).toBeNull();
    }
  });
});
