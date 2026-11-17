/**
 * AM2-13 1부 시험(호출 0): 세운 마무리 — 작성 메모 노출.
 *  (가) 카드 뜻 칸에 지시 말이 없다(표시 기호 ▸ + 핵심어만) · 작가 규칙은 지금 이하.
 *  (나) memo_leak: 저장 책에서 찾은 메모 꼴 6문장은 잡고, 저장 책의 보통 문장 꼴은 잡지 않는다(118권 전수 대조는 am2.md 23절).
 */
import { describe, expect, it, vi } from "vitest";
import { intakeOf, randomPayload } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { memoLeak } from "@/lib/writer/chunked/broken";
import { branchOf, type FourCtx } from "@/lib/writer/chunked/four";
import { chunkPlan, chunkRules, chunkUser, renderCard, ruleCtxOf } from "@/lib/writer/chunked/prompt";

vi.setConfig({ testTimeout: 120_000 });
const PEOPLE = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1", "major-p5", "major-p6a", "major-p6b"] as const;
const xs = [...PEOPLE.map(id => [id, intakeOf(payloadFor(id))] as const), ["r1117", intakeOf(randomPayload(0, "annual_fortune", 1117))] as const];

describe("AM2-13 1부 (가) 카드 뜻 칸 — 지시 말 없음", () => {
  it.each(xs)("%s: 카드 · 묶음 지시에 「이름과 핵심어만 · 머리 문장에 있음 · 풀어 쓰지 않음 · 다시 풀지 않음」 0, 표시 줄은 「▸ 핵심어」", (_id, x) => {
    const all = [renderCard(x.intake), ...chunkPlan(x.intake).map(c => chunkUser(x.intake, c))].join("\n");
    expect(all).not.toMatch(/이름과 핵심어만|머리 문장에 있음|풀어 쓰지 않음|다시 풀지 않음|핵심어:/);
    expect(renderCard(x.intake)).toMatch(/\| ▸ [가-힣]/);
  });
  it("작가 규칙: 옛 지시 문장 없음 · 새 문장 하나 · 길이는 983b0355 이하(r1117 6,902자)", () => {
    const r = chunkRules(ruleCtxOf(xs.at(-1)![1].intake));
    expect(r).not.toContain("「이름과 핵심어만」이 적힌 줄");
    expect(r).toContain("뜻이 ▸인 카드 줄은 이름에 ▸ 뒤 말만 붙여 한 구절로 쓴다(풀이 문장 없음).");
    expect(r.length).toBeLessThanOrEqual(6902);
  });
});

describe("AM2-13 1부 (나) memo_leak — 깨진 문장 차단", () => {
  const TRUE = [
    "을경합은 이름과 핵심어만 쓰면 되니, 하늘 글자끼리 묶이는 힘으로 두겠습니다.",
    "지지형은 눌러 다듬을 일이라는 이름으로만 두고, 편인은 남다른 공부와 생각으로 읽겠습니다.",
    "썸이라는 입력과 겹치면, 당신은 겉모습보다 말이 통하는 쪽을 더 오래 보게 됩니다.",
    "축술형은 눌러 다듬을 일이라는 이름으로 두겠습니다.",
    "정재의 핵심어대로 꾸준히 모으는 돈과 살림이 중심에 놓입니다.",
    "정임합은 이 책에서 처음 나오는 이름이 아니라 화면에 이미 있는 줄이라, 여기서는 뜻만 짧게 붙입니다.",
    "술미형 ▸ 눌러 다듬을 일이 겹치는 해예요.",
  ];
  const FALSE = [
    "말없이 치우는 뒷모습이 마음이 닫힌 신호로 읽히지 않도록 살피면 좋겠습니다.",
    "상사의 요청에는 반박보다 \"이 순서로 하겠습니다\"라고 먼저 답하는 편이 편합니다.",
    "\"이번 분기에 이 도구를 익히겠습니다\"처럼 구체적일수록 좋아요.",
    "공동 계좌나 계모임보다 내 이름으로만 된 통장이 편합니다.",
    "규칙을 지키느라 지칠 때는 꼭 지킬 것 세 가지만 남기고 나머지는 느슨하게 두세요.",
  ];
  it.each(TRUE)("잡는다: %s", s => expect(memoLeak(s)).not.toBeNull());
  it.each(FALSE)("잡지 않는다: %s", s => expect(memoLeak(s)).toBeNull());
  it("네 갈래 = 깨진 문장(차단)", () => {
    const ctx = { entered: { job: true, rel: true, children: false }, relationship: "single", inputs: {} as FourCtx["inputs"], mbtiType: null, pairedAt: () => false } as FourCtx;
    expect(branchOf({ chapter: 1, section: 0, rule: "memo_leak", sentence: TRUE[0] }, ctx)).toBe("broken");
  });
});
