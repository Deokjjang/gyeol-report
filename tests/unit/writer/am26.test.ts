/**
 * AM2-6(덕짱님 지시 2026-11-12) — 고리에 뜻 · 짝에 이유 · 다시 쓰기 사실 고정 · 입력 거름 끝까지(호출 0).
 */
import { describe, expect, it } from "vitest";
import { plainCard, relCondition, seedAsCondition, seedTagsFit, seedTagsOf, stripRx } from "@/lib/writer/chunked/card";
import { REL_WORD, relImageOf, verifyLinks } from "@/lib/writer/chunked/link";
import { am26Flags } from "@/lib/writer/chunked/check";
import { blockCtxFor, fitJosa, splitKeyParagraphs } from "@/lib/writer/chunked/publish";
import { calendarMonth, CHAPTER_REF } from "@/lib/writer/safety/p6d";
import { chunkExamples, chunkRules, renderCard, ruleCtxOf } from "@/lib/writer/chunked/prompt";
import { coreLine, coreOf, loveUpOf, SEAT_SHORT_KO } from "@/lib/brief/core";
import { reviewLine } from "@/lib/brief/timeline";
import { writerKnowledge } from "@/lib/writer/publish";
import { deepLines } from "@/lib/brief/knowledge";
import type { FinalChapter } from "@/lib/writer/safety";
import { cases } from "../../../tools/annual-major/final";
import { FRESH } from "../../../tools/annual-major/am2-5-fresh";
import { intakeOf } from "../../../tools/annual-major/am2-brief";

const payload = (id: string) => cases().find(x => x.id === id)?.payload ?? FRESH.find(x => x.id === id)!.payload();
const setup = (id: string) => { const { brief, intake } = intakeOf(payload(id)); const { k } = writerKnowledge(); return { brief, intake, k, b: blockCtxFor(brief, k, intake) }; };
const keysOf = (x: ReturnType<typeof setup>["intake"]) => x.chapters.flatMap(c => c.keys ?? []);
const withKey = (x: ReturnType<typeof setup>["intake"], n: number, key: string, paragraphs: string[]): FinalChapter[] => x.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer" as const, chars: 0, sections: c.keys ? c.keys.map(k => ({ heading: k.key, paragraphs: c.n === n && k.key === key ? paragraphs : [] })) : [], ...(c.keys ? { keys: c.keys.map(k => k.key) } : {}) }));
const withSection = (x: ReturnType<typeof setup>["intake"], n: number, si: number, paragraphs: string[]): FinalChapter[] => x.chapters.filter(c => !c.keys).map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer" as const, chars: 0, sections: (c.sections ?? []).map((sp, i) => ({ heading: sp.q, paragraphs: c.n === n && i === si ? paragraphs : [] })) }));

describe("AM2-6 1부 고리는 재료", () => {
  it("관계 뜻 한 마디 · 배지 그림 · 자리 뜻 · 방향 · 몇 번째 — 같은 자리가 다시 나오면 앞 key와 무엇이 다른지만", () => {
    expect([REL_WORD.YUKHAP, REL_WORD.CHUNG, REL_WORD.HYEONG, REL_WORD.PA, REL_WORD.HAE, REL_WORD.SAMHAP, REL_WORD.BANGHAP, REL_WORD.GONGMANG]).toEqual(["맺힘", "부딪침", "다듬음", "어긋남", "방해", "모임", "모임", "빔"]);
    expect(relImageOf("햇빛과 보석이 어울려 겉이 빛나고 속은 눌리는 흐름")).toBe("겉이 빛나고 속은 눌리는");
    const { intake, brief } = setup("annual-1"), keys = keysOf(intake);
    const jan = keys.find(k => k.label === "1월 · 신축월")!.links!.find(l => l.kind === "seat")!;
    expect(jan.text).toMatch(/〔태어난 달 자리 = 일터·사회생활의 자리\(직장인: 일로 버는 돈 쪽\)〕 × 〔병신합 = 맺힘\(겉이 빛나고 속은 눌리는\)〕/);
    expect(jan.text).toMatch(/이 책에서 이 자리 처음/);
    const mar = keys.find(k => k.label === "3월 · 계묘월")!.links!.find(l => l.kind === "seat")!;
    // AM2-7 3부 5 · 4부 1: 앞 key의 같은 자리 관계를 다 적고, 글자째 옮길 틀(「…과 같은 … 자리지만 이번엔」)은 주지 않는다.
    expect(mar.text).toMatch(/이 책 2번째 · 앞: 1월 · 신축월\(그때 같은 자리: 병신합 · 축진파 — 맺힘\)/);
    expect(mar.text).not.toMatch(/자리지만 이번엔/);
    // 둘째 핵심에도 뜻 한 마디(P5 R-G3).
    expect(keys.find(k => k.label === "1월 · 신축월")!.links!.find(l => l.kind === "second")?.text).toMatch(/둘째 핵심 〔축진파 = 어긋남/);
    expect(verifyLinks(brief, keys)).toEqual([]);
  });
  it("일 자리 뜻은 영역 신호로: 연애가 오르면 「가까운 사람」, 아니면 「내 생활」 — 화면 핵심 줄도 같은 값(지식 DB short:*와 같다)", () => {
    const { k } = writerKnowledge();
    expect(deepLines(k, "seat-meaning", "seat:day", "short:close")[0]).toBe(SEAT_SHORT_KO.day.close);
    expect(deepLines(k, "seat-meaning", "seat:day", "short:life")[0]).toBe(SEAT_SHORT_KO.day.life);
    expect(deepLines(k, "seat-meaning", "seat:month", "short")[0]).toBe(SEAT_SHORT_KO.month);
    expect(deepLines(k, "seat-meaning", "seat:year", "short")[0]).toBe(SEAT_SHORT_KO.year);
    const e = { badges: [{ kind: "SAMHAP", label: "화국(반쯤)", line: "반합(…): 불의 기운이 반쯤 묶여 표현과 열정이 모이기 시작하는 흐름", tone: "plus", with: "태어난 날" }], tenGod: { stem: "편인(偏印)", branch: "비견(比肩)" }, signals: { love: "↑", money: "→", work: "→", people: "↑", mind: "→" } } as never;
    expect(loveUpOf(e, "FEMALE")).toBe(true);
    expect(coreLine(coreOf(e), { loveUp: true })).toBe("태어난 날 자리(가까운 사람)와 화국 반합 · 한 기운으로 모이는 힘");
  });
  it("바람 고리는 책에서 한 번(고리 key 하나 + 소망 장, AM2-7 3부 8) — 다른 key 재료에는 바람이 없다", () => {
    const { intake } = setup("annual-1"), keys = keysOf(intake);
    const w = keys.filter(k => k.wishLink);
    expect(w.length).toBe(1);
    expect(keys.filter(k => !k.wishLink).flatMap(k => k.links ?? []).filter(l => /바람/.test(l.text))).toEqual([]);
    expect(intake.chapters.filter(c => c.wishLinks?.length).map(c => c.id).sort()).toEqual(["wish"]);
  });
});

describe("AM2-6 2부 짝에 이유", () => {
  it("짝은 잇는 이유(공통 · 보완 · 긴장)가 있을 때만 · 짝 카드 머리 「…이 하늘에 든 때 ·」 없음 · 「같은 나이대」 짝 없음", () => {
    for (const id of ["annual-1", "major-1"]) { const { intake } = setup(id);
      expect(intake.pairs.every(p => /^(공통|보완|긴장)$/.test(p.reason))).toBe(true);
      expect(intake.pairs.filter(p => /하늘에 든 때 ·|같은 나이대/.test(p.why))).toEqual([]);
      expect(renderCard(intake)).toMatch(/\| (공통|보완|긴장) — /); }
  });
  it("짝 범위 = 하늘 십성 줄 + 그 십성의 영역 줄. 범위 밖(고리 자리 뜻 · 관계 · 대운)과 MBTI를 이으면 차단, 짝 문장은 마지막 문장", () => {
    const { intake, b } = setup("major-1"); const kp = keysOf(intake).find(k => k.pair)!;
    expect(kp.pairScope?.length).toBeGreaterThanOrEqual(1);
    const out = am26Flags(withKey(intake, 5, kp.key, ["같은 때 ENTP는 판을 크게 벌이는 대담한 아이디어를 즐겨요. 그래서 일터 자리가 움직이는 때예요."]), b).map(f => f.rule);
    expect(out).toEqual(expect.arrayContaining(["pair_scope", "pair_last"]));
    expect(am26Flags(withKey(intake, 5, kp.key, ["정재가 하늘에 든 해라, ENTP는 말로 과감해요."]), b).map(f => f.rule)).toContain("pair_causal");
  });
});

describe("AM2-6 3부 입력 거름", () => {
  it("씨앗 꼬리표: 솔로 전제는 솔로만, 가게 상세는 일 상세가 있을 때만, 직장 전제는 직장인만", () => {
    const f = (rel: string, job: string, detail = "") => ({ relationship: rel, job: { status: job, class: job, detail }, children: "unknown" }) as never;
    expect(seedTagsFit(seedTagsOf("소개팅 자리에서 상대가 편하게 말하도록 돕기"), f("dating", "self_employed"))).toBe(false);
    expect(seedTagsFit(seedTagsOf("소개팅 자리에서 상대가 편하게 말하도록 돕기"), f("single", "employee"))).toBe(true);
    expect(seedTagsFit(seedTagsOf("가게 셔터를 내리기 전에 선반을 살피기"), f("dating", "self_employed"))).toBe(false);
    expect(seedTagsFit(seedTagsOf("회의 끝나고 불편해 보인 사람 따로 챙기기"), f("single", "freelancer"))).toBe(false);
    expect(seedAsCondition("소개팅 자리에서 상대가 편하게 말하도록 돕기")).toBe("소개팅 자리에서 상대가 편하게 말하도록 도울 때");
    expect(seedAsCondition("새 협업 툴에 흥분해 팀에 제안하기")).toBe("새 협업 툴에 흥분해 팀에 제안할 때");
  });
  it("카드 줄 조건 꼴 · 「-던」 · 풀이 없는 용어 · 「…시기」는 처방 꼬리가 아니다", () => {
    expect(relCondition("만나는 사람이 있다면 친구처럼 나란히 노는 시간이 늘기 쉬워요", "dating")).toBe("연인과는 친구처럼 나란히 노는 시간이 늘기 쉬워요");
    expect(relCondition("만나는 사람이 있다면 질투가 끼어들기 쉬워요", "single")).toBe("새 인연을 만난다면 질투가 끼어들기 쉬워요");
    expect(relCondition("함께하는 사람이 있다면 살림 역할을 맞춰 보기 좋아요", "married")).toBe("배우자와는 살림 역할을 맞춰 보기 좋아요");
    expect(plainCard("지키던 내 자리를 바탕으로 · 머릿속에만 두던 재능 · 일간이 약하면")).toBe("지키는 내 자리를 바탕으로 · 머릿속에만 두는 재능 · 타고난 바탕 글자가 약하면");
    expect(stripRx("만 11~30세 · 내 이름으로 서는 시기")).toBe("만 11~30세 · 내 이름으로 서는 시기");
  });
  it("세운 annual-p5(자영업 · 연애 중): 가게 · 소개팅 씨앗이 가지 않고, 장면은 key 영역 안", () => {
    const { intake } = setup("annual-p5");
    const all = [...keysOf(intake).map(k => k.scene ?? ""), ...intake.chapters.flatMap(c => [...(c.scenes ?? []), ...(c.sections ?? []).map(s => s.scene ?? "")])].join(" | ");
    expect(all).not.toMatch(/가게|셔터|손님|소개팅|썸/);
    expect(keysOf(intake).filter(k => k.scene && (!k.sceneArea || !k.areas?.includes(k.sceneArea)))).toEqual([]);
  });
});

describe("AM2-6 4부 예문 누출 · 엔진 값 없는 말", () => {
  it("작가 규칙 · 문체 예시에 실제 관계 · 십성 · 신살 · 일주 이름이 없다(자리표시)", () => {
    const { intake } = setup("annual-1"), rules = chunkRules(ruleCtxOf(intake));
    expect(rules).not.toMatch(/축오해|정재의|백호대살|도화살|홍염살|임오일주|신묘일주/);
    expect(chunkExamples().some(e => /세운 한 달/.test(e.label))).toBe(false);
    // AM2-7 4부: 자리표시에도 꺾쇠를 쓰지 않는다(꺾쇠 0 · 값 자리는 ○○).
    expect(rules).not.toMatch(/[〈〉]/);
  });
  it("relation_scope 사전 · 대운 위치 · 범위 말 · 고아 지시어 · 앞날을 지난 일로 · 입력 밖 가정", () => {
    const a = setup("annual-p5"), m = setup("major-p5");
    const flags = (x: typeof a, ps: string[]) => am26Flags(withSection(x.intake, 2, 0, ps), x.b).map(f => `${f.rule}:${f.detail ?? ""}`);
    expect(flags(a, ["태어난 날 자리와 축오해가 걸리는 것이 아니라 자미해가 걸리는 자리예요."]).some(r => r.startsWith("relation_scope:축오해"))).toBe(true);
    // 더 긴 이름 안의 글자(「인사신형」 안의 「사신형」)는 따로 세지 않는다 — 이 책에 없는 「인사신형」 자체만 걸린다.
    expect(flags(a, ["인사신형이 걸려요."]).filter(r => r.startsWith("relation_scope"))).toEqual(["relation_scope:인사신형"]);
    const m8 = (ps: string[]) => am26Flags(withSection(m.intake, 8, 0, ps), m.b).map(f => f.rule);
    expect(m8(["이 책을 쓴 2026년 무렵은 재능을 밖으로 꺼내는 10년 한가운데예요."])).toContain("dayun_position");
    expect(m8(["2036년 무렵은 기사 대운이 두 해째를 지나는 때예요."])).toContain("dayun_position");
    expect(m8(["2036년 무렵은 기사 대운이 3번째 해예요."])).not.toContain("dayun_position");
    expect(flags(a, ["하반기와 2028년 1월 · 계축월에 걸쳐 돈이 오르는 달이 이어집니다."]).some(r => r.startsWith("month_range"))).toBe(true);
    expect(flags(a, ["그 불을 한 해 동안 어디에 쓸지 정합니다."]).some(r => r.startsWith("orphan_deictic"))).toBe(true);
    expect(flags(a, ["친구를 챙기는 쪽이라면, 그 따뜻함이 먼저 닿습니다."]).some(r => r.startsWith("orphan_deictic"))).toBe(false);
    expect(flags(a, ["같은 자리가 걸린 2월 · 임인월을 지나왔다면 마음이 기우는 달이에요."]).some(r => r.startsWith("future_past"))).toBe(true);
    expect(flags(a, ["가게 일정을 짤 때 집안 일정 칸을 함께 잡아 두세요."]).some(r => r.startsWith("input_premise"))).toBe(true);
    expect(flags(a, ["약속이 관계를 오래 가게 합니다."]).some(r => r.startsWith("input_premise"))).toBe(false);
    expect(flags(a, ["이 달은 이어 볼 고리가 따로 없어서, 두 가지만 짚어 볼게요."]).some(r => r.startsWith("meta_trace"))).toBe(true);
  });
});

describe("AM2-6 5부 바람 조사", () => {
  it("바람 원문 뒤 조사는 원문 끝 글자로", () => {
    expect(fitJosa("요", "이라는 말을 적어 주셨지요.")).toBe("라는 말을 적어 주셨지요.");
    expect(fitJosa("격", "이라는 말")).toBe("이라는 말");
    expect(fitJosa("요", "을 적어")).toBe("를 적어");
  });
});

describe("AM2-6 6부 화면", () => {
  it("돌아보기 꼬리표는 열쇠말로 따옴표(「…와 같은 편이 두드러진 때」 꼴 없음)", () => {
    for (let i = 0; i < 3; i++) expect(reviewLine(["내 몫 지키기", "같은 편"], i)).not.toMatch(/같은 편이 두드러진|앞에 섰던/);
    expect(reviewLine(["내 몫 지키기", "같은 편"], 0)).toBe("이 해의 열쇠말은 「내 몫 지키기」와 「같은 편」이었어요. 그때 붙잡은 일 가운데 그 뒤로도 이어진 것이 있나요?");
  });
});

describe("AM2-6 P6 annual-1 자동 점검(호출 0)", () => {
  it("고리 재료 예시와 가리키기 말은 검사에 걸리지 않는다 — 옛 꼴(「6월과 같은」 · 「1장에서 본 2월·7월」)은 걸렸다", () => {
    expect(calendarMonth("6월과 같은 태어난 날 자리지만 이번엔 가까운 사람 쪽에서 맺힘")).toBe(true);
    expect(CHAPTER_REF.test("1장에서 본 2월·7월·10월")).toBe(true);
    const { intake } = setup("annual-1");
    const quotes = keysOf(intake).flatMap(k => (k.links ?? []).flatMap(l => [...l.text.matchAll(/「([^」]+)」/g)].map(m => m[1])));
    // AM2-7 4부 1: 글자째 옮길 틀(「…과 같은 … 자리지만 이번엔」)은 재료에 주지 않는다.
    expect(quotes.some(q => /같은 .* 자리지만/.test(q))).toBe(false);
    for (const q of quotes) expect(calendarMonth(q), q).toBe(false);
    const k7 = keysOf(intake).find(x => x.label === "7월 · 정미월")!;
    expect(k7.links!.find(l => l.kind === "seat")!.text).toMatch(/앞: 6월 · 병오월\(그때 같은 자리: /);
    for (const c of intake.chapters) for (const sp of c.sections ?? []) if (sp.pointer) { expect(CHAPTER_REF.test(sp.pointer), sp.pointer).toBe(false); expect(calendarMonth(sp.pointer), sp.pointer).toBe(false); }
  });
  it("문단 하나로 온 달 key는 문장 경계에서 둘로 — 장면 · 짝 문장에서 둘째 문단, 글자 그대로", () => {
    const para = "임인월은 편인이 하늘에, 비견이 땅에 들어오는 달이에요. 화국 반합이 태어난 날 자리에 걸려 가까운 사람 쪽에 열기가 모여요. 솔로인 당신에게는 마음이 열리기 쉬운 때예요. 소개팅 첫 만남에서 취미 얘기에 빠져드는 날이라면, 말이 통하는 느낌이 마음을 움직여요. ENFP의 호기심이 편인의 남다른 공부와 같은 쪽으로 겹쳐요.";
    const ch = [{ n: 7, id: "c7", title: "t", source: "writer", chars: 0, keys: ["2027-M01"], sections: [{ heading: "2027-M01", paragraphs: [para] }, { heading: "2027-M02", paragraphs: ["한 문장. 두 문장. 세 문장."] }] }] as unknown as FinalChapter[];
    const out = splitKeyParagraphs(ch, [{ n: 7, keys: ["2027-M01", "2027-M02"] }], "ENFP");
    expect(out[0].sections[0].paragraphs).toHaveLength(2);
    expect(out[0].sections[0].paragraphs[1]).toMatch(/^소개팅 첫 만남에서/);
    expect(out[0].sections[0].paragraphs.join(" ")).toBe(para);
    expect(out[0].sections[1].paragraphs).toEqual(["한 문장. 두 문장. 세 문장."]);
    const marked = "가 문장이에요. ⟪나 문장이에요. 다 문장이에요.⟫ 라 문장이에요. 마 문장이에요.";
    const m = splitKeyParagraphs([{ ...ch[0], sections: [{ heading: "2027-M01", paragraphs: [marked] }] }] as unknown as FinalChapter[], [{ n: 7, keys: ["2027-M01"] }], null);
    for (const p of m[0].sections[0].paragraphs) expect((p.match(/⟪/g) ?? []).length).toBe((p.match(/⟫/g) ?? []).length);
  });
});

