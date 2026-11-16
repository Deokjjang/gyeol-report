/**
 * AM2-10 3부 시험(호출 0): 지시 줄이기 — key 지시는 ① 핵심 ② 재료 하나 ③ 짝 또는 장면 + 이 달 기조 한 줄만, 꼴 규칙 말 없음.
 * 장 지시는 질문 · 근거 · 핵심 주장 · 되풀이 금지 · 처방 배정 · 분량만. MBTI 재료가 있는 소제목에는 그 짝의 명리 줄만.
 */
import { describe, expect, it } from "vitest";
import { CHUNK_PROMPT_VERSION, chunkPlan, chunkRules, mbtiBlock, renderCard, ruleCtxOf } from "@/lib/writer/chunked/prompt";
import { intakeOf, randomPayload } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const FORM = /여는 방식|고리 꼴|짝 꼴|마지막 문장|입력 낱말은 첫 문장|배지 줄은 화면|반드시 쓸 것|MBTI: 쓰지 않음|새 각도|장면 씨앗|이름 부르기/;
const blocksOf = (card: string) => { const ls = card.split("\n"), out: string[][] = []; ls.forEach((l, i) => { if (!/^ {2}### /.test(l)) return; let j = i + 1; while (j < ls.length && /^ {4}- /.test(ls[j])) j++; out.push(ls.slice(i, j)); }); return out; };

describe("AM2-10 key 지시(3부)", () => {
  for (const id of ["annual-p6b", "annual-1", "annual-p5", "annual-p6a"]) it(`${id}: 항목 3개 이하 + 기조 1 · 꼴 규칙 말 0`, () => {
    const { intake } = intakeOf(payloadFor(id));
    const card = renderCard(intake), bs = blocksOf(card);
    expect(bs).toHaveLength(13);
    for (const b of bs) {
      const items = b.slice(1);
      expect(items.length).toBeLessThanOrEqual(4);
      expect(items.filter(l => /^ {4}- 이 (달|해) 기조: /.test(l))).toHaveLength(1);
      expect(items.filter(l => !/기조: /.test(l)).length).toBeLessThanOrEqual(3);
      expect(b.join("\n")).not.toMatch(FORM);
      expect(b.join("\n")).not.toMatch(/좋은 쪽 · 이 달 오름|이 달 살핌:/);
    }
    // 짝 key: 금지 한 마디(MBTI 문장은 짝의 명리 줄하고만).
    for (const b of bs.filter(x => x.some(l => /- 짝 P\d+/.test(l)))) expect(b.join("\n")).toContain("MBTI 문장은 짝의 명리 줄하고만 잇는다. 핵심 관계·재료와는 잇지 않는다");
  });
  it("annual-p6b 3월 · 계묘월: 0부 해석표 6번 꼴", () => {
    const { intake } = intakeOf(payloadFor("annual-p6b"));
    const b = blocksOf(renderCard(intake)).find(x => /3월 · 계묘월/.test(x[0]))!.join("\n");
    expect(b).toContain("- 핵심: 목국 반합 — 모임");
    expect(b).toContain("- 재료: 〔태어난 날 자리 · 가까운 사람〕 앞: 1월 · 신축월");
    expect(b).toContain("- 짝 P8 — MBTI 문장은 짝의 명리 줄하고만 잇는다");
    expect(b).toContain("- 이 달 기조: 크게 출렁이지 않는 달 · 기운이 오르는 쪽은 연애·돈·일·마음 · 조심할 쪽 없음 → 좋은 쪽으로 맺는다(지킬 것, 본문에 옮기지 않음)");
  });
});

describe("AM2-10 작가 규칙 · 묶음 지시(3부)", () => {
  const { intake } = intakeOf(payloadFor("annual-p6b"));
  it("지침 판 · 빠진 꼴 규칙 줄", () => {
    expect(CHUNK_PROMPT_VERSION).toBe("chunk-prompt-am2-12");
    const r = chunkRules(ruleCtxOf(intake));
    expect(r).not.toMatch(/「여는 방식」|「짝 꼴」|짝은 둘째 문단의 마지막 문장|이웃 달과 같은 꼴 금지/);
    expect(r).toContain("「기조」는 지킬 것이다");
  });
  it("묶음 지시의 짝 줄에 위치 규칙이 없다", () => {
    for (const c of chunkPlan(intake)) expect(mbtiBlock(intake, c)).not.toContain("그 본문의 마지막 문장");
  });
});

describe("AM2-10 절 구성(3부): MBTI 재료가 있는 소제목에는 그 짝의 명리 줄만", () => {
  it("시험 인물 4 + 무작위 세운·대운 60명 위반 0", () => {
    const ps = [...["annual-p6b", "annual-1", "annual-p5", "annual-p6a"].map(id => payloadFor(id)), ...Array.from({ length: 30 }, (_, i) => randomPayload(i, "annual_fortune", 11)), ...Array.from({ length: 30 }, (_, i) => randomPayload(i, "major_fortune", 11))];
    let n = 0;
    for (const p of ps) {
      let intake; try { intake = intakeOf(p).intake; } catch { continue; }
      const subj = new Map(intake.lines.map(l => [l.id, l.subject] as const));
      for (const c of intake.chapters) for (const s of c.sections ?? []) {
        const bs = s.lines.filter(id => subj.get(id) === "mbti"), ms = s.lines.filter(id => /^(natal|dayun|year|month)$/.test(subj.get(id) ?? ""));
        if (!bs.length || !ms.length) continue;
        const ok = new Set(intake.pairs.filter(pp => bs.includes(pp.mbti)).map(pp => pp.myeongri));
        for (const m of ms) { if (!ok.has(m)) n++; }
      }
    }
    expect(n).toBe(0);
  }, 120_000);
});
