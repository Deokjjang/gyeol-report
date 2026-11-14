/**
 * AM2-8 시험: 1부 고정 시험 묶음 · 2부 재료 범위와 이 사람 재료(빌드) · 3부 같은 틀 도구와 꼴 배정.
 * 고정 묶음은 tests/unit/writer/am28-fixed.json(tools/annual-major/am2-8-fixtures.ts가 기록에서 만든 것) — 판독이 끝날 때마다 사례를 더한다(rubric.md 8절).
 */
import { describe, expect, it } from "vitest";
import { chunkPlan, chunkUser, mbtiBlock, renderCard } from "@/lib/writer/chunked/prompt";
import { ownCount, twoSystemQ } from "@/lib/writer/chunked/intake";
import { personalCount, sameTemplate, skeleton, templateThirds } from "@/lib/writer/chunked/template";
import type { FinalChapter } from "@/lib/writer/safety";
import { runAll } from "../../../tools/annual-major/am2-8-fixed-run";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { intakeOf } from "../../../tools/annual-major/am2-brief";

const BOOKS = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1", "major-p5", "major-p6a", "major-p6b"];
const books = BOOKS.map(id => ({ id, ...intakeOf(payloadFor(id)) }));

describe("AM2-8 1부 고정 시험 묶음(P2~P7 판독 인용 문장)", () => {
  it("모든 사례가 기대대로(걸려야 함 · 통과해야 함 · 지우면 고아 · 결정론 고침)", () => {
    const rows = runAll();
    expect(rows.filter(r => !r.ok).map(r => `${r.id} ${r.expect} got=${r.got.join(",")} — ${r.note}`)).toEqual([]);
    expect(rows.length).toBeGreaterThanOrEqual(26);
  });
}, 120_000);

describe("AM2-8 2부 뿌리 1 · 3 — 재료 범위와 이 사람 재료", () => {
  it("공유 블록에는 MBTI 줄 · 짝 · 유형 이름이 없다", () => {
    for (const b of books) { const card = renderCard(b.intake), type = b.brief.mbti?.type;
      expect(card).not.toMatch(/^- B\d+ \|/m);
      expect(card).not.toMatch(/^- P\d+ \|/m);
      if (type) expect(card.includes(type)).toBe(false); }
  });
  it("짝 없는 key · 소제목의 작가 입력에 B id 0(그 묶음 지시에도 그 자리를 쓰는 곳으로 적지 않는다)", () => {
    for (const b of books) {
      const subj = new Map(b.intake.lines.map(l => [l.id, l.subject] as const)), isB = (id: string) => subj.get(id) === "mbti", isM = (id: string) => /^(natal|dayun|year|month)$/.test(subj.get(id) ?? "");
      for (const c of b.intake.chapters) {
        for (const k of c.keys ?? []) if (!k.pair) expect(k.lines.filter(isB), `${b.id} ${k.label}`).toEqual([]);
        for (const [i, sp] of (c.sections ?? []).entries()) if (sp.lines.some(isB) && sp.lines.some(isM)) expect(b.intake.pairs.some(p => sp.lines.includes(p.myeongri) && sp.lines.includes(p.mbti)), `${b.id} ${c.n}.${i}`).toBe(true);
      }
      for (const ch of chunkPlan(b.intake)) {
        const block = mbtiBlock(b.intake, ch), keysHere = new Set(ch.parts.flatMap(p => p.keys ?? []));
        const unpaired = b.intake.chapters.flatMap(c => (c.keys ?? []).filter(k => keysHere.has(k.key) && !k.pair).map(k => k.label));
        for (const lab of unpaired) expect(block.split("\n").filter(l => /쓰는 곳:/.test(l) && l.includes(lab)), `${b.id} ${ch.id} ${lab}`).toEqual([]);
        if (!block) expect(chunkUser(b.intake, ch)).not.toMatch(/MBTI 유형:/);
      }
    }
  });
  it("대운 7장: 짝이 없으면 7.1에는 대운 줄만 · 물음은 대운 쪽만 묻는 꼴, 짝에 기댄 물음은 짝이 있을 때만", () => {
    for (const b of books.filter(x => x.intake.product === "major_fortune")) {
      const g = b.intake.chapters.find(c => c.id === "growth"); if (!g?.sections) continue;
      const subj = new Map(b.intake.lines.map(l => [l.id, l.subject] as const));
      for (const sp of g.sections) {
        const paired = b.intake.pairs.some(p => sp.lines.includes(p.myeongri) && sp.lines.includes(p.mbti));
        if (twoSystemQ(sp.q, b.brief.mbti?.type)) expect(paired, `${b.id} ${sp.q}`).toBe(true);
        if (!paired && sp.lines.some(id => subj.get(id) === "dayun")) { expect(sp.lines.filter(id => subj.get(id) === "mbti"), b.id).toEqual([]); expect(sp.q, b.id).not.toMatch(/성장|성격|MBTI|[EI][SN][TF][JP]/); }
      }
    }
  });
  it("모든 key에 이 사람 재료가 하나 이상(고리 · 짝 · 인물 사실) — 재료 0인 key 0", () => {
    for (const b of books) for (const c of b.intake.chapters) for (const k of c.keys ?? []) expect(ownCount(k), `${b.id} ${k.label}`).toBeGreaterThan(0);
  });
  it("인물 사실은 고객이 적은 것만(미입력 칸을 사실로 쓰지 않는다)", () => {
    for (const b of books) for (const c of b.intake.chapters) for (const k of c.keys ?? []) if (k.own) {
      const f = b.brief.person.facts;
      if (/연애:/.test(k.own)) expect(f.relationship === "unknown", `${b.id} ${k.label}`).toBe(false);
      if (/일:/.test(k.own)) expect(["", "other", "unknown", "none"].includes(f.job.status), `${b.id} ${k.label}`).toBe(false);
    }
  });
});

describe("AM2-8 3부 뿌리 2 — 같은 틀 도구와 꼴 배정", () => {
  it("뼈대: 관계 · 자리 · 때 · 입력 · 숫자 · 십성을 가리고 앞 6어절", () => {
    expect(skeleton("태어난 날 자리에 오미합이 걸려, 솔로인 당신에게는 마음이 한 곳에 맺히기 쉬워요.")).toBe("§자리 §관계 걸려 §입력 당신에게는 마음이");
    expect(sameTemplate("기혼인 당신에게는 2월 · 임인월의 정임합이 마음을 묶는 쪽이에요.", "솔로인 당신에게는 5월 · 을사월의 사신합이 마음을 묶는 쪽이에요.")).toBe(true);
    expect(sameTemplate("기혼인 당신에게는 집안 일이 먼저 보여요.", "기혼인 당신에게는 돈 쪽이 먼저 보여요.")).toBe(false);
    expect(skeleton("짧은 문장이에요.")).toBeNull();
  });
  it("장 안 같은 틀 셋째부터 잡고, ③ 셈은 처음 두 번만 센다", () => {
    const s = (m: string) => `${m}의 오미합은 가까운 사람과의 자리를 따뜻하게 묶는 맺힘이에요.`;
    const ch: FinalChapter = { n: 7, id: "keys", title: "", source: "writer", chars: 0, keys: ["a", "b", "c"], sections: [{ heading: "a", paragraphs: [s("1월 · 신축월")] }, { heading: "b", paragraphs: [s("2월 · 임인월")] }, { heading: "c", paragraphs: [s("3월 · 계묘월")] }] };
    expect(templateThirds([ch]).map(h => h.section)).toEqual([2]);
    const r = personalCount([ch], new Map([["a", [s("1월 · 신축월")]], ["b", [s("2월 · 임인월")]], ["c", [s("3월 · 계묘월")]]]));
    expect(r.have).toBe(2); expect(r.dropped.length).toBe(1);
  });
  it("설계도(P7 8명): 장 안 같은 여는 방식 ≤2 · 입력으로 여는 key ≤2/장 · 장면으로 여는 key는 씨앗이 있다", () => {
    for (const b of books) for (const c of b.intake.chapters.filter(x => x.keys)) {
      const n = new Map<string, number>(); for (const k of c.keys!) n.set(k.opener ?? "", (n.get(k.opener ?? "") ?? 0) + 1);
      expect([...n].filter(([, v]) => v > 2), b.id).toEqual([]);
      expect(n.get("입력") ?? 0).toBeLessThanOrEqual(2);
      for (const k of c.keys!) if (k.opener === "장면") expect(Boolean(k.scene), `${b.id} ${k.label}`).toBe(true);
    }
  });
  it("고리 재료는 뜻 조각만(옮겨 쓸 말 「이번에도」 · 「…한 문장으로」 없음)", () => {
    for (const b of books) for (const c of b.intake.chapters) for (const k of c.keys ?? []) for (const l of k.links ?? []) expect(l.text, `${b.id} ${k.label}`).not.toMatch(/「이번에도」|경향 한 문장으로/);
  });
});
