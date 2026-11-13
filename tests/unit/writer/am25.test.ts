/**
 * AM2-5(덕짱님 지시 2026-11-12) — 가치 채우기(연결 고리 · key 짝 · 장면) · 고치기 단계 구조(문단 교체 · 지우기는 차단에만 · 같은 주장 설계) · 카드 고객 말(호출 0).
 */
import { describe, expect, it } from "vitest";
import { predicate, stripRx, unambiguous } from "@/lib/writer/chunked/card";
import { DOMAIN_BY_TEN_GOD } from "@/lib/brief/productEvidence";
import { verifyLinks, type Link } from "@/lib/writer/chunked/link";
import { am25Flags, crossRepeats, endingCaps } from "@/lib/writer/chunked/check";
import { blockCtxFor } from "@/lib/writer/chunked/publish";
import { chunkRules, parseReplacements, renderCard, ruleCtxOf } from "@/lib/writer/chunked/prompt";
import { relationshipOf } from "@/lib/writer/chunked/intake";
import { coverIssue, writerKnowledge } from "@/lib/writer/publish";
import { lifetimeBands } from "@/lib/brief/design/major";
import type { FinalChapter } from "@/lib/writer/safety";
import { cases } from "../../../tools/annual-major/final";
import { intakeOf } from "../../../tools/annual-major/am2-brief";

const setup = (id: string) => { const c = cases().find(x => x.id === id)!; const { brief, intake } = intakeOf(c.payload); const { k } = writerKnowledge(); return { brief, intake, k, b: blockCtxFor(brief, k, intake) }; };
const ch = (n: number, id: string, paragraphs: string[], heading = "h", keys?: string[]): FinalChapter => ({ n, id, title: "t", source: "writer", chars: 0, sections: [{ heading, paragraphs }], ...(keys ? { keys } : {}) });
const keysOf = (x: ReturnType<typeof setup>["intake"]) => x.chapters.flatMap(c => c.keys ?? []);

describe("AM2-5 1부 카드 값은 고객 말로", () => {
  it("영역 줄 원천(DOMAIN_BY_TEN_GOD) 40개의 명사형 끝을 모두 서술형으로(원천은 4종도 써서 그대로 둔다)", () => {
    const left = Object.values(DOMAIN_BY_TEN_GOD).flat().map(predicate).filter(t => /(함|짐|음|임|김|림|남|됨|옴|줌)$/.test(t));
    expect(left).toEqual([]);
    expect(predicate("승부욕이 올라 경쟁이 붙는 일에서 힘이 남")).toBe("승부욕이 올라 경쟁이 붙는 일에서 힘이 나요");
    expect(predicate("생각이 많아져 몸을 움직이는 일정이 필요함")).toBe("생각이 많아져 몸을 움직이는 일정이 필요해요");
    expect(predicate("무리하기 쉬운 달: 뚜렷한 달 없음")).toBe("무리하기 쉬운 달: 뚜렷한 달 없음");
  });
  it("중의 값(D38 「날이 되기도」) · 값 끝 「장면」을 고친다", () => {
    expect(unambiguous("지기 싫은 마음이 의욕이 되기도 날이 되기도 하는 컨디션")).toBe("지기 싫은 마음이 의욕이 되기도 날카로움이 되기도 하는 컨디션");
    expect(unambiguous("입과 손을 쓰는 역할이 커지는 장면")).toBe("입과 손을 쓰는 역할이 커지는 때");
  });
  it("카드 뜻의 처방 꼬리를 뗀다(P4 세운 Y19·Y23·M29·P5 …)", () => {
    expect(stripRx("기분 따라 지르는 소비가 늘기 쉬운 쪽 · 장바구니는 하루 묵혀 두기")).toBe("기분 따라 지르는 소비가 늘기 쉬운 쪽");
    expect(stripRx("친한 사이에서도 돈·몫 이야기가 얽히기 쉬운 쪽 · 처음부터 분명히")).toBe("친한 사이에서도 돈·몫 이야기가 얽히기 쉬운 쪽");
    expect(stripRx("흥미가 식으면 일정표도 함께 접기 쉬움 · 마무리를 같이 볼 친구 한 명 두기")).toBe("흥미가 식으면 일정표도 함께 접기 쉬움");
    expect(stripRx("한 기운으로 모이는 힘 · 표현과 열정")).toBe("한 기운으로 모이는 힘 · 표현과 열정");
  });
  it("작가 카드: 핵심 관계 뜻은 「화면에 있음 · 풀어 쓰지 않음」, 대운 key의 「대운 안의 위치」 줄 없음, 각도 없음", () => {
    const a = setup("annual-1"), m = setup("major-1");
    const card = renderCard(a.intake), mcard = renderCard(m.intake);
    expect(card).toMatch(/오미합 \| 화면에 있음 · 풀어 쓰지 않음 · 핵심어: 맞물려 묶이는 힘/);
    // 해 key 줄(Y)에는 위치 줄이 없다(3장 서 있는 대운 D1의 위치는 그 장 근거라 남는다).
    expect(mcard.split("\n").filter(l => /^- Y\d+ \|/.test(l) && /대운 안의 위치/.test(l))).toEqual([]);
    expect(card).not.toMatch(/ · 각도: /);
    expect(card).not.toMatch(/하루 묵혀 두기|처음부터 분명히/);
  });
  it("대운 1.2 평생 지도 근거는 큰 줄기 2~3개(10칸 나열 없음)", () => {
    const life = [1, 2, 3, 4, 5].map(i => ({ ganji: "", hanja: "", startYear: 2000 + i * 10, endYear: 2009 + i * 10, ages: `만 ${i * 10 - 9}~${i * 10}세`, tenGod: "", theme: i <= 2 ? "배우고 채우는 10년" : "내 이름으로 서는 10년", current: i === 2, label: "" }));
    const bands = lifetimeBands(life);
    expect(bands).toEqual(["내가 서 있는 큰 줄기: 만 1~20세 · 배우고 채우는 시기", "다음 큰 줄기: 만 21~50세 · 내 이름으로 서는 시기"]);
  });
  it("표지: 세운·대운 하한 12자 · 채움말(「…의 그림」) 받지 않음", () => {
    const { brief } = setup("annual-1");
    expect(coverIssue("등불처럼 은은하게 오래 비추는 한 해의 그림", brief, [])?.reason).toMatch(/채움말/);
    expect(coverIssue("늦여름 마른 흙 위에서 오래 타는 등불", brief, [])).toBeNull();
    expect(coverIssue("흙 위 등불", brief, [])?.reason).toMatch(/12~26자/);
  });
});

describe("AM2-5 1부 연결 고리 · key 짝 · 장면", () => {
  it("세운 annual-1 7월 · 정미월: 오미합(태어난 날) × 솔로 × 바람(연애) × 연애 오름 + 정미년 오미합 겹침 · 바람 달", () => {
    const { intake } = setup("annual-1");
    // AM2-6 1부: 고리는 재료(자리 뜻 · 관계 뜻 한 마디 · 입력 · 방향 · 몇 번째). 같은 자리가 다시 나오면 앞 key와 무엇이 다른지만.
    const feb = keysOf(intake).find(x => x.label === "2월 · 임인월")!;
    expect(feb.links?.[0]?.text).toMatch(/^〔태어난 날 자리 = 나와 가장 가까운 사람의 자리\(솔로: 가장 가까운 사람·연애 쪽\)〕 × 〔화국 반합 = 모임\(/);
    expect(feb.links?.[0]?.text).toMatch(/이 책에서 이 자리 처음/);
    const k = keysOf(intake).find(x => x.label === "7월 · 정미월")!;
    const seat = k.links!.find(l => l.kind === "seat")!;
    // 이 달 오미합 배지는 섞인 결(plus 아님) — 연애 오름 신호가 있어도 방향은 「섞임」으로 둔다(오름이 배지 결을 덮지 않게).
    expect(seat.text).toMatch(/〔오미합 = 맺힘\(열기가 오래 가는\)〕 — 앞과 뜻이 다르다 · 입력 한 마디: 솔로 · 섞임 · 이 달 오름: 연애/);
    // AM2-7 3부 5: 둘째부터 「앞 key(그때 같은 자리 관계 전부) + 이번 관계 뜻 + 입력 한 마디」(틀 문구 없음).
    expect(seat.text).toMatch(/이 책 \d번째 · 앞: 6월 · 병오월\(그때 같은 자리: /);
    expect(seat.text).toMatch(/입력 한 마디: 솔로/);
    expect(seat.input).toEqual(["relationship=single"]);
    expect(k.links!.find(l => l.kind === "echo")?.text).toMatch(/정미년 한 해에도 같은 태어난 날 자리에 오미합/);
    // 바람 고리는 책에서 1~3개만 — 7월은 같은 자리가 그 해와 바람 달에 함께 걸려 1순위.
    expect(k.wishLink).toMatch(/그 해에도 같은 자리에 걸림/);
    expect(keysOf(intake).filter(x => x.wishLink).length).toBeLessThanOrEqual(3);
    expect(keysOf(intake).filter(x => !x.wishLink).every(x => !(x.links ?? []).some(l => /바람/.test(l.text)))).toBe(true);
  });
  it("고리는 엔진 값과 입력이 다 있을 때만 — verifyLinks가 지어낸 고리를 잡는다", () => {
    const { brief, intake } = setup("annual-1");
    const keys = keysOf(intake);
    expect(verifyLinks(brief, keys)).toEqual([]);
    const fake: Link = { kind: "seat", seat: "hour", text: "자녀 쪽이 움직이는 때", engine: ["2027-M06:CHUNG:자오충@태어난 날"], input: ["children=has"] };
    expect(verifyLinks(brief, [{ key: "x", links: [fake] }]).length).toBeGreaterThanOrEqual(2);
  });
  it("key 짝: MBTI가 없으면 0, 있으면 이웃하지 않게 · 같은 짝은 책에서 한 번", () => {
    const four = setup("major-4"); // MBTI 미입력
    expect(keysOf(four.intake).filter(k => k.pair).length).toBe(0);
    const { intake } = setup("major-1"), keys = keysOf(intake);
    const idx = keys.map((k, i) => (k.pair ? i : -9)).filter(i => i >= 0);
    expect(idx.length).toBeGreaterThan(0);
    for (let i = 1; i < idx.length; i++) expect(idx[i] - idx[i - 1]).toBeGreaterThanOrEqual(2);
    const why = intake.pairs.filter(p => p.key).map(p => p.why);
    expect(new Set(why).size).toBe(why.length);
    expect(why.join(" ")).not.toMatch(/(^|\s)(로|는|가)\s/);
  });
  it("장면은 key의 절반 이상 · 숫자 장면 없음", () => {
    for (const id of ["annual-1", "major-1"]) { const keys = keysOf(setup(id).intake); expect(keys.filter(k => k.scene).length * 2).toBeGreaterThanOrEqual(keys.length); for (const k of keys) if (k.scene) expect(k.scene).not.toMatch(/\d|스무|열 개/); }
  });
});

describe("AM2-5 2부 고치기 단계 구조", () => {
  it("같은 주장 두 곳: 9.2 핵심(I5 = 1.4 M1 세 달)은 엔진 가리키기 말 · 2028년 1월 대운 겹침은 3월 · 계묘월을 가리킨다", () => {
    const { intake } = setup("annual-1");
    const s92 = intake.chapters.find(c => c.n === 9)!.sections![1];
    // AM2-6 4부: 가리키기 말에도 달 이름은 넣는다.
    expect(s92.pointer).toBe("앞에서 본 2월 · 임인월, 7월 · 정미월, 10월 · 경술월");
    expect(keysOf(intake).find(k => k.label === "2028년 1월 · 계축월")!.pointer).toBe("3월 · 계묘월처럼 대운과 같은 정인 기운이 겹치는 달");
  });
  it("문단 교체 원고 읽기: 번호 줄 · key 전체(*) · 표지", () => {
    const r = parseReplacements("[표지] 마른 흙 위 오래 타는 등불\n[¶2.0.0]\n새 문단입니다.\n[¶7.6.*]\n첫 문단.\n\n둘째 문단.");
    expect(r.cover).toBe("마른 흙 위 오래 타는 등불");
    expect(r.paras.get("2.0.0")).toEqual(["새 문단입니다."]);
    expect(r.paras.get("7.6.*")).toEqual(["첫 문단.", "둘째 문단."]);
  });
  it("P4 판독 결정론 꼴 가운데 검사로 남긴 것: 근거 밖 관계 · 달 목록 범위 말 · 규칙 문구 · 읽는 날 마감 · 지난 경험 물음 · 「당신답죠」", () => {
    const { b } = setup("annual-1"), m = setup("major-1");
    const rules = (b0: typeof b, chs: FinalChapter[]) => am25Flags(chs, b0).map(f => f.rule);
    expect(rules(b, [ch(2, "love", ["태어난 날 자리와 축오해가 아닌, 나와 가장 가까운 사람의 자리에서 사람·일과 붙고 묶이기 쉬워요."])])).toContain("relation_scope");
    expect(rules(b, [ch(2, "love", ["설렘이 몰리는 달은 2월 · 임인월에서 11월 · 신해월 사이에 7월 · 정미월이 이어지는 쪽이에요."])])).toContain("month_range");
    expect(rules(b, [ch(3, "money", ["돈이 오르는 달은 7월 · 정미월부터 이어지는 가을 달들과 2028년 1월 · 계축월이에요."])])).toContain("month_range");
    expect(rules(m.b, [ch(7, "growth", ["같은 시기라는 것만 말할 수 있고, 한쪽이 다른 쪽을 만든다고 보지는 않아요."])])).toContain("rule_echo");
    expect(rules(m.b, [ch(8, "plan", ["2026년 안에 기준을 한 문장으로 정해 두면 됩니다."])])).toContain("date_deadline");
    expect(rules(b, [ch(3, "money", ["메신저 알림에 마음이 먼저 움직인 적이 없나요?"])])).toContain("past_question");
    expect(rules(b, [ch(10, "next", ["음악 틀고 청소하며 머리를 비우는 모습도 당신답죠."])])).toContain("habit_assert");
    // 맞는 문장은 통과(오탐 0): 이 장 근거의 관계 · 이름 그대로 나열한 달 목록 · 질문이 아닌 조건.
    expect(rules(b, [ch(2, "love", ["정미년의 미는 태어난 날 땅 글자 오와 육합을 이뤄요.", "연애 쪽 기운이 오르는 달은 2월 · 임인월, 7월 · 정미월, 8월 · 무신월이에요.", "메신저 알림에 마음이 먼저 움직일 때라면 한 박자 쉬어 가요."])])).toEqual([]);
  });
  it("시스템 머리 문장은 반복 집계·끝말 상한에서 뺀다", () => {
    const head = "정미월은 상관이 하늘에, 정재가 땅에 들어오는 달이에요.", n = head.replace(/[^가-힣A-Za-z0-9]/g, "");
    const chs = [1, 2, 3, 4, 5, 6].map(i => ch(7, "keys", [head], `k${i}`, [`k${i}`]));
    expect(endingCaps(chs, new Set([n]))).toEqual([]);
    expect(crossRepeats(chs, new Set([n]))).toEqual([]);
    expect(crossRepeats(chs).length).toBeGreaterThan(0);
  });
});

describe("AM2-5 P5 자동 점검 고침", () => {
  it("연애 줄의 「자녀: 미입력」을 연애 미입력으로 읽지 않는다(연애 중·기혼에게 「솔로·미입력」 규칙이 붙던 AM2-4 버그)", () => {
    const person = ["이름: 가상(부를 때 가상님)", "연애: 연애 중 · 자녀: 미입력 · 사는 곳·같이 사는 사람: 모름"];
    expect(relationshipOf(person)).toBe("연애: 연애 중");
    expect(relationshipOf(["연애: 미입력 · 자녀: 있음"])).toBe("연애: 미입력");
    const { intake } = setup("annual-2"); // 연애 중
    expect(ruleCtxOf(intake).relationship).toBe("연애: 연애 중");
    expect(chunkRules(ruleCtxOf(intake))).not.toMatch(/연애가 솔로·미입력이다/);
    const solo = setup("annual-1");
    expect(chunkRules(ruleCtxOf(solo.intake))).toMatch(/연애가 솔로·미입력이다/);
  });
});
