/**
 * AM2-9 4부 시험(호출 0): 세운 브리프 반대 재료 쌍 정리 — 시험 인물 넷(annual-p6b · annual-1 · annual-p5 · annual-p6a).
 * 전수(무작위 1,000명 · 시드 7)는 scratch 도구로 쟀다(docs/v5/annual-major/am2.md 19절). 여기서는 같은 잣대를 시험 인물에 댄다.
 */
import { describe, expect, it } from "vitest";
import { annualTagOf, annualTidyLog, dirFits, meaningOf, personDims } from "@/lib/brief/design/annual";
import type { Arrow } from "@/lib/brief/design/annual";
import { intakeOf } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";

const WHO = ["annual-p6b", "annual-1", "annual-p5", "annual-p6a"];
type Ev = { kind?: string; key?: string; facts?: string[] };
const evidenceOf = (o: unknown, re: RegExp, out = new Map<string, string[]>()) => { if (Array.isArray(o)) o.forEach(x => evidenceOf(x, re, out)); else if (o && typeof o === "object") { const r = o as Ev; if (r.kind === "evidence" && r.facts && re.test(r.key ?? "")) out.set(r.key!, r.facts); Object.values(r).forEach(x => evidenceOf(x, re, out)); } return out; };
const clash = (a: string, b: string) => personDims(a).some(([d, p]) => personDims(b).some(([d2, q]) => d === d2 && p === -q));

describe("AM2-9 4부 세운 브리프 반대 재료 쌍", () => {
  for (const who of WHO) it(`${who}: 달 칸 방향 · 처방 꼬리 · 같은 해 · 같은 달 반대 끝 0, 뺀 줄 상한 안`, () => {
    const { brief, plan, intake } = intakeOf(payloadFor(who));
    const months = new Map((brief.timeline?.entries ?? []).filter(e => e.kind === "month").map(e => [e.key, e]));
    const KO: Record<string, "love" | "money" | "work" | "people" | "mind"> = { 연애: "love", 돈: "money", 일: "work", 사람: "people", 마음: "mind" };
    for (const [key, facts] of evidenceOf(brief.chapters, /^month:/)) {
      const e = months.get(key.slice(6)) as { signals?: Record<string, Arrow> } | undefined;
      const ls = facts.map(f => /^(연애|돈|일|사람|마음) ([↑↓→]): (.+)$/.exec(f)).filter((m): m is RegExpExecArray => Boolean(m));
      for (const m of ls) { expect(e?.signals?.[KO[m[1]]], `${key} ${m[1]}`).toBe(m[2]); expect(dirFits(m[3], m[2] as Arrow), `${key} ${m[0]}`).toBe(true); expect(m[3]).not.toContain(" → "); }
      for (let j = 1; j < ls.length; j++) expect(clash(ls[0][3], ls[j][3]), key).toBe(false);
    }
    // MBTI 짝 이유(yearMbti)는 잇는 이유(긴장 · 공통)를 「→」로 가르므로 브리프에는 원문, 카드(짝 이유)에서 뗀다 — 아래 카드 시험이 본다.
    const year = [...new Set([...evidenceOf(plan, /^(?!month:|bridge:|depth:|yearMbti$)/).values()].flat().filter(f => annualTagOf(f)))];
    for (const f of year) expect(f, "해 근거에 처방 꼬리").toBe(meaningOf(f));
    for (const p of intake.pairs) expect(p.why, `${p.id} 짝 이유에 처방 꼬리`).not.toMatch(/ → /);
    const withDims = year.filter(f => personDims(f).length);
    for (let j = 1; j < withDims.length; j++) for (let i = 0; i < j; i++) expect(clash(withDims[i], withDims[j]), `${withDims[i]} ↔ ${withDims[j]}`).toBe(false);
    expect(annualTidyLog.last!.drops.length).toBeLessThanOrEqual(16);
    // 짝 없는 key에는 MBTI 장면 씨앗이 없다 · 카드 줄에 「→ 처방」 꼬리 없음(카드는 「 · 」로 바뀌므로 DB 꼬리 글로 본다).
    for (const c of intake.chapters) for (const k of c.keys ?? []) if (!k.pair) expect((k as { sceneMbti?: true }).sceneMbti, k.label).toBeUndefined();
  });
  it("P8 사례: annual-p6b 5월 마음 ↑ 칸에 「무리한 일정」 줄 · 2월 돈 ↑ 칸에 「지출까지 미루기」 줄 · 12월 「새 자리 한 번」 꼬리가 없다", () => {
    const { brief } = intakeOf(payloadFor("annual-p6b"));
    const all = [...evidenceOf(brief.chapters, /^month:/).values()].flat().join("\n");
    expect(all).not.toMatch(/마음 ↑: 책임감에 무리한 일정/);
    expect(all).not.toMatch(/돈 ↑: 아끼는 데 집중하다/);
    expect(all).not.toMatch(/새 자리 한 번/);
  });
});
