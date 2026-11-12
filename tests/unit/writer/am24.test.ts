/**
 * AM2-4(덕짱님 지시 2026-11-12) — 사실은 화면·해석은 본문 · 설계도 배분 · 카드 불변식 · 결정론 검사(호출 0).
 */
import { describe, expect, it } from "vitest";
import { unitFix } from "@/lib/writer/chunked/card";
import { coreLine, coreOf, coreRowLine, relFlow, TEN_GOD_SHORT } from "@/lib/brief/core";
import { allocateChapters, rxKindsOf, rxOfSentence } from "@/lib/brief/prescriptions";
import { annotateChapter } from "@/lib/writer/render";
import { stripHanja } from "@/lib/writer/safety/p6e";
import { spareMustCuts } from "@/lib/writer/chunked/cut";
import { am24Flags, blockFlags, cardEngineIssues, endingCaps, rxRepeats } from "@/lib/writer/chunked/check";
import { blockCtxFor } from "@/lib/writer/chunked/publish";
import { chunkRules, ruleCtxOf } from "@/lib/writer/chunked/prompt";
import { writerKnowledge } from "@/lib/writer/publish";
import type { FinalChapter } from "@/lib/writer/safety";
import { cases } from "../../../tools/annual-major/final";
import { intakeOf } from "../../../tools/annual-major/am2-brief";

const setup = (id: string) => { const c = cases().find(x => x.id === id)!; const { brief, intake } = intakeOf(c.payload); const { k } = writerKnowledge(); return { brief, intake, k, b: blockCtxFor(brief, k, intake) }; };
const ch = (n: number, id: string, paragraphs: string[], heading = "h", keys?: string[]): FinalChapter => ({ n, id, title: "t", source: "writer", chars: 0, sections: [{ heading, paragraphs }], ...(keys ? { keys } : {}) });

describe("AM2-4 3부 카드", () => {
  it("unitFix는 자리 이름 「태어난 해」를 「태어난 달」로 바꾸지 않는다(card.ts:47 버그)", () => {
    expect(unitFix("화국(태어난 해·태어난 날 자리와)", "달")).toBe("화국(태어난 해·태어난 날 자리와)");
    expect(unitFix("손봐야 할 일이 드러나는 해", "달")).toBe("손봐야 할 일이 드러나는 달");
  });
  it("관계 뜻 끝은 「…흐름」(관계가 주어일 때 비문 방지)", () => {
    expect(relFlow("이유 없이 서로 미워지는 짝이 만나 사람 관계가 까끌해지는 해")).toBe("이유 없이 서로 미워지는 짝이 만나 사람 관계가 까끌해지는 흐름");
    expect(relFlow("공망에 든 해, 힘을 줘도 빠져나가니 기대를 낮추는 흐름")).toBe("공망에 든 때, 힘을 줘도 빠져나가니 기대를 낮추는 흐름");
  });
  it("카드 값은 고객 말 — 괄호 자리·(반쯤)·칸 이름·「기준 해」·「생활 결」 없음, 십이운성 쇠는 쇠(衰)", () => {
    const a = setup("annual-1"), m = setup("major-1");
    const all = [...a.intake.lines, ...m.intake.lines].map(l => `${l.value} | ${l.meaning}`);
    expect(all.filter(t => /\(반쯤\)|\(태어난 (해|달|날|시각)|생활 결|기준 해|가장 센 쪽|두 번째로 쓰는 쪽|성격 쪽에서는/.test(t))).toEqual([]);
    expect(a.intake.lines.some(l => l.value === "태어난 달 자리의 쇠(衰)")).toBe(true);
  });
  it("카드 ≡ 엔진 불변식: 일부러 자리를 틀면(예전 unitFix 버그) 잡는다", () => {
    const { brief, intake } = setup("annual-1");
    expect(cardEngineIssues(intake, brief)).toEqual([]);
    const i = intake.lines.findIndex(l => / 태어난 해·날 자리와 화국$/.test(l.value));
    expect(i).toBeGreaterThanOrEqual(0);
    const broken = { ...intake, lines: intake.lines.map((l, j) => (j === i ? { ...l, value: l.value.replace("태어난 해·날", "태어난 달·날") } : l)) };
    expect(cardEngineIssues(broken, brief).map(x => x.rule)).toContain("card_engine");
  });
  it("대운 책 지난 대운이 22세 전이면 N 줄의 「동료」도 「또래」(young)", () => {
    const { intake } = setup("major-1");
    const past = intake.chapters.find(c => c.id === "past")!.sections![1].lines;
    expect(intake.lines.filter(l => past.includes(l.id) && /동료/.test(`${l.value} ${l.meaning}`))).toEqual([]);
  });
});

describe("AM2-4 1부·2부 설계도", () => {
  it("핵심 = 엔진 가중치(일·월 자리 충·합·형 > 대운 겹침 > 그 밖), 화면 「뜻」 한 줄은 두 줄 안", () => {
    const e = { badges: [{ kind: "PA", label: "축진파", line: "x", tone: "", with: "태어난 달·태어난 시각" }, { kind: "YUKHAP", label: "오미합", line: "y", tone: "", with: "태어난 날" }], tenGod: { stem: "상관(傷官)", branch: "정재(正財)" } } as never;
    expect(coreOf(e).map(c => c.name)).toEqual(["오미합", "축진파"]);
    expect(coreOf({ badges: [], tenGod: { stem: "정인(正印)", branch: "겁재(劫財)" } } as never, { dayunTenGod: "정인(正印)" }).map(c => c.name)).toEqual(["정인"]);
    expect(coreLine(coreOf(e))).toBe("태어난 날 자리와 오미합 · 맞물려 묶이는 힘");
    expect(coreRowLine(coreOf(e))).toBe("오미합 · 맞물려 묶임");
    expect(coreRowLine(coreOf(e)).length).toBeLessThanOrEqual(16);
    expect(TEN_GOD_SHORT.상관).toBe("틀을 깨는 말과 아이디어");
  });
  it("key 설계: 핵심 1~2 · 영역 1~2 · 화면(되풀이 금지) · 할 일은 작가에게 주지 않음 · 장면은 key의 절반 이상(AM2-5 1부)", () => {
    const { intake } = setup("annual-1");
    const keys = intake.chapters.find(c => c.keys)!.keys!;
    for (const k of keys) { expect((k.core ?? []).length).toBeGreaterThanOrEqual(1); expect((k.core ?? []).length).toBeLessThanOrEqual(2); expect((k.must ?? []).length).toBeLessThanOrEqual(2); expect(k.screen?.[0]).toMatch(/^흐름 /); }
    // AM2-5 1부(덕짱님 지시): key의 절반 이상에 입력에 맞는 장면 하나(묶음당 하나 → key 몫 60%).
    expect(keys.filter(k => k.scene).length * 2).toBeGreaterThanOrEqual(keys.length);
  });
  it("처방 종류 사전: 카드 할 일끼리 종류가 겹치지 않고, 장은 남은 종류에서 하나씩", () => {
    const { brief, intake } = setup("annual-1");
    const todos = brief.timeline!.entries.filter(e => e.todo && e.period !== "past").map(e => e.todo!);
    const kinds = todos.flatMap(rxKindsOf);
    expect(new Set(kinds).size).toBe(kinds.length);
    const rx = intake.chapters.filter(c => c.rx?.use).map(c => c.rx!.use);
    expect(new Set(rx).size).toBe(rx.length);
    expect(rx.some(kd => kinds.includes(kd!))).toBe(false);
    expect(allocateChapters([{ n: 1, id: "big", keyed: false }, { n: 2, id: "wish", keyed: false }], new Map()).get(2)!.use).toBe("끝낼 일 하나");
    expect(rxOfSentence("적금 자동이체처럼, 매주 같은 요일에 제안 한 줄을 적는 습관을 만들어 보세요.")).toEqual([]);
  });
  it("할 것·피할 것에는 행동 줄만 · 짝 없는 명리×MBTI 절 없음 · 바람 달 ↔ 늦출 달 겹침 0", () => {
    for (const id of ["annual-1", "major-1"]) { const { brief, intake } = setup(id); expect(cardEngineIssues(intake, brief).filter(x => /plan_advice_only|pair_section|wish_conflict/.test(x.rule))).toEqual([]); }
  });
  it("규칙 블록은 입력 조건으로: 바람이 없으면 바람 규칙 없음, MBTI가 없으면 MBTI 규칙 없음", () => {
    const m = setup("major-1");
    const r = chunkRules(ruleCtxOf(m.intake));
    expect(r).not.toMatch(/적어 준 바람은 고객의 말/);
    const noMbti = chunkRules({ ...ruleCtxOf(m.intake), mbti: false });
    expect(noMbti).not.toMatch(/명리 × MBTI|명리×MBTI 짝/);
    expect(chunkRules(ruleCtxOf(setup("annual-1").intake))).toMatch(/«바람»/);
  });
});

describe("AM2-4 5부 결정론 검사(P3 판독 꼴)", () => {
  it("한자 주석: 「거센 편인 달」(편이다)에는 偏印을 붙이지 않는다", () => {
    const dict = new Map([["편인", "偏印"]]);
    expect(annotateChapter([{ heading: "h", paragraphs: ["흐름이 거센 편인 달이라 바쁘다. 편인이 들어오는 달이에요."] }], { dict, ganji: new Set() }).sections[0].paragraphs[0]).toBe("흐름이 거센 편인 달이라 바쁘다. 편인(偏印)이 들어오는 달이에요.");
  });
  it("표면 정리(세운·대운)는 십이운성 쇠(衰)를 남긴다 — 4종은 그대로 지운다", () => {
    expect(stripHanja("쇠(衰)는 물러설 줄 아는 힘이에요.", true).text).toBe("쇠(衰)는 물러설 줄 아는 힘이에요.");
    expect(stripHanja("쇠(衰)는 물러설 줄 아는 힘이에요.").text).toBe("쇠는 물러설 줄 아는 힘이에요.");
  });
  it("month_list는 마디마다 대조 — 「일이 오르는 달은 …이고, 4월은 흔들림을 살필 달」은 바른 문장", () => {
    const { b } = setup("annual-1");
    const sen = "일이 오르는 달은 8월 · 무신월, 9월 · 기유월, 12월 · 임자월이고, 4월 · 갑진월은 일터 흔들림을 살필 달입니다.";
    expect(blockFlags([ch(4, "work", [sen])], [], b).filter(f => f.rule === "month_list")).toEqual([]);
  });
  it("자리 = 엔진 배지 · 개수 말 · 운성 쇠 · 카드 값 꼴 · 관계 주어 비문 · 겪을 일 단정 · 바람 없음 · 관계 틀 비문 · 상대 시점 말", () => {
    const a = setup("annual-1"), m = setup("major-1");
    const key = (sen: string, k2 = "2027-M09") => am24Flags([ch(7, "months", [sen], k2, [k2])], a.b).map(f => f.rule);
    expect(key("화국이 태어난 달·태어난 날 자리와 맞물려 표현과 열정이 모이고.")).toContain("seat_badge");
    expect(key("화국이 태어난 해·태어난 날 자리와 맞물려 표현과 열정이 모여요.")).not.toContain("seat_badge");
    const any = (sen: string, x = a) => am24Flags([ch(2, "love", [sen])], x.b).map(f => f.rule);
    expect(any("한 해의 절반이 넘는 달에 연애 기운이 오릅니다.")).toContain("count_claim");
    expect(any("쇠에 해당하는 기운은 속도를 낮추고 경험으로 판을 읽는 성질이에요.")).toContain("homonym");
    expect(any("반대로 쇠(금)는 겉으로 드러난 쇠 글자가 없어 가장 약합니다.")).not.toContain("homonym");
    expect(any("한편 축오해(태어난 날 자리와)는 언 땅과 불이 서로 방해하는 흐름이에요.")).toContain("label_leak");
    expect(any("답해야 할 메일을 열어 둔 채 세 번 말하는 장면이 떠오르죠.")).toContain("habit_assert");
    expect(any("답답함이 말로 터져 나오기 쉬운 때도 있어요.")).not.toContain("habit_assert");
    expect(any("계획이 하나씩이면 적어 주신 바람을 향한 걸음도 가벼워집니다.", m)).toContain("wish_absent");
    expect(any("무계합은 태어난 해 자리와 산과 이슬비가 어울려 메마른 곳이 적셔지는 흐름입니다.", m)).toContain("relation_frame");
    expect(any("인해합은 태어난 해 자리와 맺혀 새 일이 자라는 흐름이에요.", m)).not.toContain("relation_frame");
    expect(any("오늘 밤에는 내 방향을 한 줄 적어 보세요.")).toContain("time_extra");
  });
  it("key 본문의 화면 사실 되풀이(흐름 · 오행 채움 · 핵심 밖 관계 · 행동)는 지우기 대상", () => {
    const { b } = setup("annual-1");
    const f = am24Flags([ch(7, "months", ["흐름은 느린 편이에요.", "쇠(금) 기운을 채우는 정돈된 책상도 도움이 됩니다.", "이 달에는 메일 답장 시간을 정해 두세요."], "2027-M01", ["2027-M01"])], b);
    expect(f.filter(x => x.rule === "screen_repeat")).toHaveLength(3);
  });
  it("처방 되풀이(사전)와 끝말 상한(목록 없이)", () => {
    const { intake } = setup("annual-1");
    // 카드 할 일이 맡은 종류를 본문이 또 쓰면(장 처방이 아닌 종류).
    const keyKind = intake.chapters.flatMap(c => c.keys ?? []).map(k2 => k2.todo ? rxKindsOf(k2.todo)[0] : undefined).find(Boolean)!;
    const sample: Record<string, string> = { "적기·목록": "오늘 한 일을 한 줄로 적어 보세요.", "몸 움직이기": "저녁에는 가볍게 산책해 보세요.", "값 매기기": "들어갈 시간과 받을 금액을 적어 보세요.", "사람 고르기": "곁에 둘 사람을 골라 보세요.", "혼자 시간": "혼자 있는 시간을 따로 잡아 보세요.", "끝낼 일 하나": "끝낼 일 하나를 정해 보세요.", "쉬기·잠": "쉬는 날을 달력에 넣어 보세요.", "월급날·먼저 떼어 두기": "월급날 먼저 떼어 두세요.", "하루 묵히기": "하루 묵혀 두고 다시 보세요.", "말 다듬기·한 박자": "말하기 전 한 박자 쉬어 보세요.", "연락·안부": "안부를 먼저 물어보세요.", "한마디 건네기": "고마웠던 친구에게 한마디 감사를 전해 보세요.", "끝까지 듣기": "끝까지 듣고 말해 보세요.", "보내기 전 다시 읽기": "보내기 전에 한 번 더 읽어 보세요." };
    const other = intake.chapters.find(c => c.sections && c.rx?.use !== keyKind)!;
    expect(rxRepeats([ch(other.n, other.id, [sample[keyKind]])], intake).map(f => f.rule)).toContain("rx_repeat");
    const same = Array.from({ length: 6 }, (_, i) => `${i}번째 장면을 천천히 떠올려 보세요.`);
    expect(endingCaps([ch(1, "big", same)]).length).toBeGreaterThan(0);
  });
});

describe("AM2-4 9부 P4 세운 자동 점검", () => {
  it("되풀이(경미)로 지우다 key의 「반드시 쓸 것」을 지닌 유일한 문장이 빠지면 그 문장은 남긴다 — 차단 결함 문장은 그대로 지운다", () => {
    const chapters: FinalChapter[] = [
      { n: 7, id: "month", title: "t", source: "writer", chars: 0, keys: ["2027-M12"], sections: [{ heading: "2027-M12", paragraphs: ["축진파가 태어난 달 자리와 어긋나요. 이 시기가 속한 대운도 정인의 10년이라 배움이 한 겹 더 쌓여요. 틀린 사실 문장입니다."] }] },
      { n: 8, id: "do", title: "t", source: "writer", chars: 0, sections: [{ heading: "할 것", paragraphs: ["이 시기가 속한 대운도 정인의 10년이라 배움이 쌓여요. 다른 문장이 남습니다."] }] },
    ];
    const flag = (rule: string, sentence: string) => ({ chapter: 7, section: 0, paragraph: 0, rule, sentence });
    const rep = flag("chapter_repeat", "이 시기가 속한 대운도 정인의 10년이라 배움이 한 겹 더 쌓여요."), rx = flag("rx_repeat", rep.sentence), bad = flag("key_value", "틀린 사실 문장입니다.");
    const missing = (chs: readonly FinalChapter[]) => new Set(chs.filter(c => c.n === 7 && !c.sections[0].paragraphs.join(" ").includes("대운")).map(() => "7|2027-M12"));
    // 물음표 없는 「어긋나요.」는 서술 — 뒤 문장을 지워도 남는다(수사 물음 오탐 고침).
    const { r, kept } = spareMustCuts(chapters, [rep, rx, bad], new Set([bad]), () => null, missing);
    expect(kept).toEqual([rep, rx]);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("축진파가 태어난 달 자리와 어긋나요. 이 시기가 속한 대운도 정인의 10년이라 배움이 한 겹 더 쌓여요.");
    // 핵심이 빠지지 않으면 되풀이는 그대로 지운다.
    const none = spareMustCuts(chapters, [rep, bad], new Set([bad]), () => null, () => new Set());
    expect(none.kept).toEqual([]);
    expect(none.r.chapters[0].sections[0].paragraphs[0]).toBe("축진파가 태어난 달 자리와 어긋나요.");
    // 차단 결함 문장이 유일한 핵심 문장이면 지운다(핵심 누락은 차단으로 남아 보고된다).
    const hardOnly = spareMustCuts(chapters, [flag("key_value", rep.sentence)], new Set<ReturnType<typeof flag>>(), () => null, missing);
    expect(hardOnly.kept.length).toBe(1);
    const hardSet = [flag("key_value", rep.sentence)];
    expect(spareMustCuts(chapters, hardSet, new Set(hardSet), () => null, missing).kept).toEqual([]);
  });
});
