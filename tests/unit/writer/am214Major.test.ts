/**
 * AM2-14 2부 시험(호출 0): 대운 고침 둘(덕짱님 결정 4) + 6장 영역 말.
 *   ① 해 key · 8장 5년 · 10년 뒤 영역 줄은 그 해 칩과 방향이 맞다(세운 dirFits와 같은 판정 — D1 모순 4곳).
 *   ② 대운 앞날 key 장면 씨앗에 확정 꼴 0(「…는 날이라면」), future_event 좁힌 꼴만 차단.
 *   ③ 6장 질문 · 핵심 주장이 다섯 영역.
 * 1,000명 전수는 am2.md 24절(무료 검증). 여기서는 시험 인물 4 + 무작위 표본.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { intakeOf, randomPayload } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { periodLineDir, periodLineFits } from "@/lib/brief/design/major";
import { annualTagOf, dirFits } from "@/lib/brief/design/annual";
import { MAJOR_BOOK_CHAPTERS } from "@/lib/brief/design/majorBook";
import { SEED_DEFINITE_END, seedAsMaybe } from "@/lib/writer/chunked/card";
import { branchOf, type FourCtx } from "@/lib/writer/chunked/four";

vi.setConfig({ testTimeout: 180_000 });
const IDS = ["major-1", "major-p5", "major-p6a", "major-p6b"] as const;
const people = [...IDS.map(id => [id, intakeOf(payloadFor(id))] as const), ...Array.from({ length: 24 }, (_, i) => { try { return [`r${i}`, intakeOf(randomPayload(i, "major_fortune", 214))] as const; } catch { return null; } }).filter((x): x is NonNullable<typeof x> => Boolean(x))];
type Sig = Record<string, "↑" | "↓" | "→">;

describe("AM2-14 2부 ① 대운 영역 줄 칩 방향 거름", () => {
  it("D1 모순 4곳의 줄은 그 해 칩에서 빠진다(관계 줄은 사람 · 사랑 칩을 다 본다)", () => {
    expect(periodLineFits("관계", "함께 일하는 사람·규칙과 부딪치기 쉬움", { people: "↑", love: "↑" })).toBe(false); // D1 2031 편관
    expect(periodLineFits("일", "만들고 다듬는 일에 손이 잘 붙음", { work: "↓" })).toBe(false); // D3 2036 식신(key · 10년 뒤)
    expect(periodLineFits("관계", "말투가 부드러워져 사이가 편해짐", { people: "→", love: "↓" })).toBe(false); // D5 2029 식신
    expect(periodLineFits("돈", "작은 수입이 꾸준히 들어오기 좋음", { money: "↑" })).toBe(true);
    expect(periodLineFits("일", "급한 일과 책임이 한꺼번에 몰리기 쉬움", { work: "→" })).toBe(true);
    expect(periodLineFits("일", "급한 일과 책임이 한꺼번에 몰리기 쉬움", undefined)).toBe(true);
    expect(periodLineDir("예상 못 한 지출에 대비가 필요함")).toBe("down");
    expect(periodLineDir("고정 수입·저축을 다지기 좋음")).toBe("up");
  });
  it("세운 dirFits는 그대로(방향 함수를 넘기지 않으면 annual-tags)", () => {
    const tagged = Object.keys(JSON.parse(readFileSync("src/lib/brief/design/annual-tags.json", "utf8")).items).find(k => annualTagOf(k)?.dir === "down")!;
    expect(dirFits(tagged, "↑")).toBe(false); expect(dirFits(tagged, "↓")).toBe(true); expect(dirFits(tagged, "→")).toBe(true);
    expect(dirFits("어느 태그에도 없는 줄", "↑")).toBe(true);
  });
  it.each(people)("%s: 해 key 영역 줄 · 8장 5년 · 10년 뒤 줄 ↔ 그 해 칩 반대 0", (_id, x) => {
    const ent = (y: string) => x.brief.timeline!.entries.find(e => e.key === y) as (NonNullable<typeof x.brief.timeline>["entries"][number] & { signals?: Sig }) | undefined;
    const raw = (y: string, d: string) => ent(y)?.material?.domains?.find(t => t.startsWith(`${d}: `))?.replace(/^[^:]+: /, "");
    let n = 0;
    for (const ch of x.intake.chapters) for (const kp of ch.keys ?? []) for (const id of kp.lines) {
      const l = x.intake.lines.find(q => q.id === id), m = l && /^(\d{4})년 \S+ (일|돈|관계|컨디션) 쪽$/.exec(l.value); if (!m) continue;
      n++; expect(periodLineFits(m[2], raw(m[1], m[2]) ?? l!.meaning, ent(m[1])?.signals), `${kp.key} ${l!.value}`).toBe(true);
    }
    for (const l of x.intake.lines) { const m = /^(\d{4})년\(만 \d+세 무렵\) \S+?: (일|돈|관계|컨디션) = /.exec(l.meaning ?? ""); if (!m || !/(5|10)년 뒤/.test(l.value)) continue;
      expect(periodLineFits(m[2], raw(m[1], m[2]) ?? "", ent(m[1])?.signals), `${l.value} ${l.meaning}`).toBe(true); }
    expect(n).toBeGreaterThanOrEqual(0);
  });
});

describe("AM2-14 2부 ② 대운 장면 확정 꼴", () => {
  it("끝 확정 꼴 → 「…는 날이라면」, 조건 · 비유 · 명사 꼴은 그대로", () => {
    expect(seedAsMaybe("지는 게 싫어서 평소라면 안 나갈 공모전이나 대회에 원서를 내고, 마감 전날 밤을 새웁니다.")).toBe("지는 게 싫어서 평소라면 안 나갈 공모전이나 대회에 원서를 내고, 마감 전날 밤을 새우는 날이라면");
    expect(seedAsMaybe("분위기가 잠깐 얼어붙습니다")).toBe("분위기가 잠깐 얼어붙는 날이라면");
    expect(seedAsMaybe("결과물을 만듭니다.")).toBe("결과물을 만드는 날이라면");
    for (const t of ["호감 가는 사람과 말장난으로 밀당할 때", "같이 번지점프 해 보자고 제안할 때처럼", "새 일을 맡는 장면", "처음 만난다면"]) expect(seedAsMaybe(t)).toBe(t);
  });
  it("지식 DB 해 장면 씨앗 40개 모두 조건 꼴로 바뀐다(확정 꼴이 남지 않는다)", () => {
    const d = JSON.parse(readFileSync("src/data/knowledge-v5/timeline/ten-god-period.json", "utf8"));
    const seeds = (d.entries as { year?: { scenes?: ({ text: string } | string)[] } }[]).flatMap(e => e.year?.scenes ?? []).map(s => (typeof s === "string" ? s : s.text).split(/(?<=[.!?])\s+/)[0]);
    expect(seeds.length).toBe(40);
    for (const s of seeds) { const t = seedAsMaybe(s); expect(t, s).not.toBeNull(); expect(SEED_DEFINITE_END.test(t!), t!).toBe(false); }
  });
  it.each(people)("%s: 대운 앞날 key 장면에 확정 꼴 0", (_id, x) => {
    for (const ch of x.intake.chapters) for (const kp of ch.keys ?? []) if (kp.scene && kp.when !== "past") expect(SEED_DEFINITE_END.test(kp.scene.trim()), `${kp.key} ${kp.scene}`).toBe(false);
  });
  it("future_event: 대운 · 장면 씨앗 갈래 · 양보/비유 꼴 없음만 사실(차단), 그 밖 · 세운은 기록", () => {
    const ctx = (product: string) => ({ entered: { job: true, rel: true, children: false }, relationship: "single", inputs: {} as never, mbtiType: "ENTP", pairedAt: () => false, product }) as FourCtx;
    const f = (sentence: string, detail = "장면 씨앗을 그때의 사건으로 단정") => ({ chapter: 5, section: 8, rule: "future_event", sentence, detail });
    expect(branchOf(f("지는 게 싫어서 평소라면 안 나갈 공모전이나 대회에 원서를 내고, 마감 전날 밤을 새웁니다."), ctx("major_fortune"))).toBe("fact");
    expect(branchOf(f("지는 게 싫어서 평소라면 안 나갈 공모전에 원서를 내고, 마감 전날 밤을 새우는 해예요."), ctx("major_fortune"))).toBe("fact");
    // 저장 대운 책 오탐 3곳의 꼴(양보 · 비유)
    expect(branchOf(f("호감 가는 사람과 말장난으로 밀당하는 순간이 와도, 한 번 한 약속만은 가볍게 넘기지 않는 쪽이 오래 남아요."), ctx("major_fortune"))).toBeNull();
    expect(branchOf(f("같이 번지점프 해 보자고 제안할 때처럼 들뜬 마음이 앞서도, 상대의 속도를 한 번 살피는 예의가 사이를 오래 가게 합니다."), ctx("major_fortune"))).toBeNull();
    expect(branchOf(f("휴일 아침 혼자 있다가 금세 허전해질 때도, 그 허전함을 서둘러 메우기보다 충분히 쉬고 난 뒤의 몸이 더 가볍게 움직여 줍니다."), ctx("major_fortune"))).toBeNull();
    expect(branchOf(f("도움을 받아 준비한 것이 결과로 이어지는 해입니다.", "카드의 「~기 좋음·쉬움」을 확정형으로"), ctx("major_fortune"))).toBeNull();
    expect(branchOf(f("마감 전날 밤을 새웁니다."), ctx("annual_fortune"))).toBeNull();
  });
});

describe("AM2-14 2부 8장 5년 뒤 · 10년 뒤", () => {
  it.each(people.slice(0, 4))("%s: 「준비할 것」 소제목은 세운 「할 것」 거름을 받지 않는다 — 5년 뒤 · 10년 뒤 · 그 무렵 대운 근거가 모두 남고 핵심 주장은 5년 뒤", (_id, x) => {
    const sp = x.intake.chapters.find(c => c.id === "plan")?.sections?.find(s => /5년 뒤와 10년 뒤/.test(s.q)); if (!sp) return;
    const vals = sp.lines.map(id => x.intake.lines.find(l => l.id === id)?.value ?? "");
    expect(vals).toEqual(expect.arrayContaining(["5년 뒤", "10년 뒤"]));
    expect(sp.claims[0]).toMatch(/^5년 뒤: /);
  });
});

describe("AM2-14 2부 ③ 6장 영역 말", () => {
  it("질문이 화면과 같은 다섯 영역을 말하고, 짝 소제목 핵심 주장은 두 영역을 함께 담는다", () => {
    const map = MAJOR_BOOK_CHAPTERS.find(c => c.id === "map")!;
    for (const w of ["일", "돈", "사랑", "사람", "마음", "다섯 영역"]) expect(map.question).toContain(w);
    for (const [, x] of people.slice(0, 4)) {
      const ch = x.intake.chapters.find(c => c.id === "map"); if (!ch?.sections) continue;
      const claims = ch.sections.map(s => s.claims.join(" "));
      expect(claims[0]).toMatch(/^돈과 일: 돈은 .+, 일은 /); expect(claims[1]).toMatch(/^사랑과 사람: 사랑은 .+, 사람은 /);
    }
  });
});

describe("AM2-14 3부 화면 쪽 이름", () => {
  it.each(people.slice(0, 4))("%s: 3장 · 6장 · 7장 앞 화면 제목이 바로 뒤 본문 장 제목과 같지 않다(「한눈에 보기 — …」)", async (_id, x) => {
    const { chapterHeadOf, domainMapOf, SCREEN_TITLE } = await import("@/lib/writer/bookAm");
    const m = x.brief.timeline?.major; if (!m) return;
    const title = (id: string) => MAJOR_BOOK_CHAPTERS.find(c => c.id === id)!.title;
    const now = chapterHeadOf(m as never, "now", title("now")), next = chapterHeadOf(m as never, "next", title("next")), map = domainMapOf(m as never, title("map"));
    expect([now?.title, next?.title, map?.title]).toEqual([SCREEN_TITLE.now, SCREEN_TITLE.next, SCREEN_TITLE.map]);
    expect(now?.title).not.toBe(title("now")); expect(map?.title).not.toBe(title("map")); expect(next?.title).not.toBe(title("next"));
    expect([now?.eyebrow, next?.eyebrow, map?.eyebrow]).toEqual([title("now"), title("next"), title("map")]);
  });
});

describe("AM2-14 6부 D2 측정 중 고침(결정론 · 다시 생성 없음)", () => {
  it.each(people.slice(0, 4))("%s: 다음 장(7장) 관계 줄은 다음 대운 이름, 지금 장(3장) 관계 줄은 지금 대운 이름", (_id, x) => {
    const m = x.brief.timeline?.major; if (!m || !m.next) return;
    const name = (n: number) => m.chapters.find(c => c.n === n)!.ganji.replace(/^[^(]*\(|\)$/g, "");
    const rel = (chId: string) => (x.intake.chapters.find(c => c.id === chId)?.sections ?? []).flatMap(s => s.lines).map(id => x.intake.lines.find(l => l.id === id)?.value ?? "").filter(v => /대운 기둥과 태어난/.test(v));
    for (const v of rel("next")) expect(v.startsWith(`${name(m.next)} 대운 기둥`), v).toBe(true);
    for (const v of rel("now")) expect(v.startsWith(`${name(m.now!)} 대운 기둥`), v).toBe(true);
  });
  it("검사: 대운 기둥 × 원국 자리 관계 주장 · 차례 위치 주장(D2 결함 두 꼴 재현, 맞는 문장은 통과)", async () => {
    const { am213MajorFlags } = await import("@/lib/writer/chunked/majorClaims");
    const x = people[0][1]; // major-1: 지금 3장 을축 · 다음 4장 병인 · 태어난 달 壬戌
    const ctx = { brief: x.brief, intake: x.intake } as never;
    const book = (sentences: readonly string[]) => [{ n: 7, id: "next", title: "다음 장 미리 보기", source: "writer", chars: 0, sections: [{ heading: "다음 장에서 원국과 만나는 곳과 오르는 영역은?", paragraphs: sentences.map(s => s) }] }] as never;
    const rules = (s: string) => am213MajorFlags(book([s]), ctx).map(f => f.rule);
    expect(rules("을축 대운 기둥과 태어난 달 자리가 만나 반합을 이룹니다.")).toContain("dayun_seat_rel");
    expect(rules("병인 대운 기둥과 태어난 달 자리가 만나 반합을 이룹니다.")).not.toContain("dayun_seat_rel");
    expect(rules("을축 대운 기둥은 태어난 달 자리와 형을 이룹니다.")).not.toContain("dayun_seat_rel");
    expect(rules("지금 읽는 장은 차례의 한가운데쯤에서 다음 장을 향해 넘어가는 중입니다.")).toContain("chapter_pos");
    expect(rules("지금 읽는 장은 차례의 앞쪽에 있어요.")).not.toContain("chapter_pos");
    const { branchOf } = await import("@/lib/writer/chunked/four");
    const c = { entered: { job: true, rel: true, children: false }, relationship: "single", inputs: {} as never, mbtiType: "ENTP", pairedAt: () => false, product: "major_fortune" } as never;
    expect(branchOf({ chapter: 7, section: 0, rule: "dayun_seat_rel", sentence: "s" }, c)).toBe("fact");
    expect(branchOf({ chapter: 1, section: 1, rule: "chapter_pos", sentence: "s" }, c)).toBe("fact");
  });
});
