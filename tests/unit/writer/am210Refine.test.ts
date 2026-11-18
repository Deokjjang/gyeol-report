/**
 * AM2-10 2부 시험(호출 0): 세운·대운 카드 정제 층(refine.ts) — 원자 문장 종류 · 원국 조건 판정 · 값 → 뜻 · 입력 전제 · 성향 반대 정리 · 기조 한 줄.
 * 0부 해석표(덕짱님 확인 2026-11-16) 4 · 5번 예를 그대로 고정한다(annual-p6b 己未 丙寅 己未 丁卯).
 */
import { describe, expect, it } from "vitest";
import { atomsOf, chartFacts, conditionLeft, DISCLAIMER, gradeToMeaning, GRADE_WORD, inputClash, refineAtom, refineLog, RULE } from "@/lib/writer/chunked/refine";
import { toneOf } from "@/lib/writer/chunked/tone";
import { renderCard } from "@/lib/writer/chunked/prompt";
import { inputsOf } from "@/lib/brief/premise";
import { intakeOf } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const { brief, intake } = intakeOf(payloadFor("annual-p6b"));
const chart = chartFacts(brief);
const x = (positions?: readonly string[]) => ({ chart, positions, inputs: inputsOf(brief.person.facts), natal: true });

describe("AM2-10 카드 정제 — 원자 문장(0부 5번 N11)", () => {
  const n11 = "인오술은 술, 신자진은 진, 사유축은 축, 해묘미는 미입니다. 모으고 저장하며 혼자 깊어지는 쪽을 뜻하고, 취향이 뚜렷해 한 가지를 오래 파고드는 힘으로 봅니다. 두 개면 생각이 두 겹으로 쌓여 정리는 깊어지지만, 결정이 늦어지는 편입니다. 생각을 오래 묵혀 정리합니다. 화개는 저장의 자리라, 모아 둔 경험을 나중에 꺼내 쓰는 능력이 좋습니다. 취향이 분명해 흔들리지 않습니다. 유행이 바뀌어도 좋아하는 것을 지켜 결국 그 분야의 사람이 됩니다. 이 별이 주는 건 혼자 깊어지는 시간이지 외로움의 확정이 아닙니다.";
  const atoms = atomsOf(n11);
  it("문장 8개 · 규칙 1 · 면책 1 · 조건 1(화개 년지·일지 = 2개 → 참)", () => {
    expect(atoms).toHaveLength(8);
    const rs = atoms.map(a => refineAtom(a, x(["year", "day"])));
    expect(rs[0].kind).toBe("rule");
    expect(rs[7].kind).toBe("disclaimer");
    expect(rs[2].cond).toBe("true");
    expect(rs.filter(r => r.text !== null)).toHaveLength(6);
  });
  it("규칙 · 면책 꼴", () => {
    expect(RULE.test("년지는 보지 않습니다.")).toBe(true);
    expect(DISCLAIMER.test("이 별이 주는 건 혼자 깊어지는 시간이지 외로움의 확정이 아닙니다.")).toBe(true);
    // 면책 마디만 떼는 꼴(「…구성이고, …뜻은 아닙니다.」 → 「…구성입니다.」).
    expect(refineAtom("목의 힘을 의식해서 꺼내 써야 하는 구성이고, 크게 모자라다는 뜻은 아닙니다.", x()).text).toBe("목의 힘을 의식해서 꺼내 써야 하는 구성입니다.");
  });
});

describe("AM2-10 카드 정제 — 원국 조건 판정(0부 4번)", () => {
  it("N9 「짝이 두 쌍 이상이면」 = 거짓(귀문 寅未 1쌍 · 월지·일지) → 뺀다", () => {
    const r = refineAtom("짝이 두 쌍 이상이면 감각이 여러 영역에서 동시에 켜져서, 혼자 쉬며 비우는 시간이 더 필요해집니다.", x(["month", "day"]));
    expect(r.text).toBeNull(); expect(r.cond).toBe("false");
  });
  it("N8 「비견까지 강하면」 = 참(비견 겉 글자 3 · 비겁 강) → 이유 꼴", () => {
    expect(chart.surface.get("비견")).toBe(3);
    expect(refineAtom("비견까지 강하면 '원래 이렇게 해 왔어'가 대화를 끝내는 말이 됩니다.", x(["day"])).text).toBe("비견까지 강해 '원래 이렇게 해 왔어'가 대화를 끝내는 말이 됩니다.");
  });
  it("일간 강약 · 십성 하나 · 월지 본기 · 관계 낀 조건은 모름", () => {
    expect(refineAtom("타고난 바탕 글자가 약하면 남의 말에 자주 흔들립니다.", x()).cond).toBe("false");
    expect(refineAtom("관성이 약한데 식신만 강하면 해야 할 일이 쌓입니다.", x()).cond).toBe("false");
    expect(refineAtom("정관이 둘 이상이거나 월지 본기가 정관이면 질서와 책임이 생활의 뼈대가 됩니다.", x()).cond).toBe("true");
    expect(refineAtom("일지나 태어난 달 땅 글자에 절이 있고 충까지 겹치면 경험까지 함께 버립니다.", x(["month"])).cond).toBe("unknown");
  });
  it("자리를 모르는 줄은 자리 · 개수 조건을 거짓으로 보지 않는다(모름) · 값 칸 머리의 자리는 읽는다", () => {
    expect(refineAtom("두 쌍이면 더 뚜렷합니다.", x()).cond).toBe("unknown");
    expect(refineAtom("겁살(劫煞) (태어난 날) — 월지·일지에 있거나 비겁이 많으면 붙잡는 힘이 커집니다.", x()).cond).toBe("true");
  });
});

describe("AM2-10 카드 정제 — 값 → 뜻 · 입력 전제", () => {
  it("연애 신호 · 십성 묶음 등급은 뜻 문장으로(등급 낱말 0)", () => {
    for (const t of ["이 해의 연애 신호: 보통", "재성(재물 기운) 약", "다섯 힘의 세기 · 내 방식의 힘(비겁) 강", "흐름이 가장 잔잔한 달(같은 세기): 4월 · 갑진월"]) {
      expect(GRADE_WORD.test(t)).toBe(true);
      expect(GRADE_WORD.test(gradeToMeaning(t, "married"))).toBe(false);
    }
    expect(gradeToMeaning("이 해의 연애 신호: 보통", "married")).toBe("둘 사이가 크게 출렁이지 않고 평소 속도로 가는 해");
  });
  it("기혼에게 상대를 고르는 전제 · 연애 중에게 「연인이 생기면」은 맞지 않는다", () => {
    expect(inputClash("겉모습보다 생각이 통하는 사람에게 끌리기 쉬운 흐름", inputsOf({ relationship: "married", children: "", job: { status: "" } }))).not.toBeNull();
    expect(inputClash("연인이 생기면 망설임 없이 먼저 다가가기 쉬운 때", inputsOf({ relationship: "dating", children: "", job: { status: "" } }))).not.toBeNull();
    expect(inputClash("연인이 생기면 망설임 없이 먼저 다가가기 쉬운 때", inputsOf({ relationship: "single", children: "", job: { status: "" } }))).toBeNull();
  });
});

describe("AM2-10 카드 정제 — annual-p6b 카드 끝 상태", () => {
  const card = renderCard(intake);
  const used = intake.lines.filter(l => l.use.length);
  it("쓰는 줄에 규칙 · 면책 · 원국 조건 · 등급 낱말 · 입력 전제 0", () => {
    for (const l of used) for (const t of [l.value, ...atomsOf(l.meaning)]) {
      expect(RULE.test(t) || DISCLAIMER.test(t), t).toBe(false);
      expect(conditionLeft(t), t).toEqual([]);
      expect(GRADE_WORD.test(t), t).toBe(false);
      expect(inputClash(t, inputsOf(brief.person.facts)), t).toBeNull();
    }
  });
  it("0부 예: 「년지는 보지 않습니다」 · 「짝이 두 쌍 이상이면」 · 기혼 「…에게 끌리기 쉬운」이 카드에 없다 · 「비견까지 강해」가 있다", () => {
    expect(card).not.toContain("년지는 보지 않습니다");
    expect(card).not.toContain("짝이 두 쌍 이상이면");
    expect(card).not.toContain("생각이 통하는 사람에게 끌리기 쉬운");
    expect(card).toContain("비견까지 강해 '원래 이렇게 해 왔어'");
    expect(refineLog.last!.tidy.length).toBeLessThanOrEqual(16);
  });
});

describe("AM2-10 기조 한 줄(toneOf)", () => {
  it("등급 낱말 없이 · 오르는 쪽 · 조심할 쪽 · 공망 · 맺는 쪽", () => {
    const t = toneOf({ kind: "month", flow: { score: 3, label: "보통" } as never, signals: { love: "↑", money: "↑", work: "↑", people: "→", mind: "↑" } as never, badges: [] });
    expect(t.line).toBe("크게 출렁이지 않는 달 · 기운이 오르는 쪽은 연애·돈·일·마음 · 조심할 쪽 없음 → 좋은 쪽으로 맺는다(지킬 것, 본문에 옮기지 않음)");
    expect(GRADE_WORD.test(t.line)).toBe(false);
    const g = toneOf({ kind: "month", flow: { score: 5, label: "거셈" } as never, signals: { love: "↓", money: "→", work: "↑", people: "→", mind: "→" } as never, badges: [{ label: "공망" } as never] });
    expect(g.side).toBe("mixed"); expect(g.gongmang).toBe(true); expect(g.care).toEqual(["연애"]);
  });
});
