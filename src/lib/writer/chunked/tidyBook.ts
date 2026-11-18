/**
 * AM2-11 1부 4 — 책 전체 성향 반대 정리(세운·대운 작가 카드 경로만, 결정론 · 호출 0).
 * 카드 정제(refine.tidyCard: 원국 · MBTI 기능 문장)와 세운 정리(annual.tidyScope: 그 해 · 그 달 DB 줄)는 범위마다 따로 맞대서,
 * 범위를 넘는 반대 쌍을 놓쳤다(P10 annual-1 「끝맺음이 깔끔」(원국 사(死)) ↔ 「흥미가 식으면 일정표도 함께 접기」(세운 MBTI 짝 이유) ·
 * Y20 「꼭 필요한 지출까지 미루기」 ↔ Fusion 짝 「계산보다 송금이 먼저」). 여기서 원국 · MBTI 줄 · 세운 Y · M 줄 · 짝 이유(Fusion · 세운 MBTI)를 한 번에 맞댄다.
 *  - 같은 차원 반대 끝(두 끝 세기 2 이상만). 같은 줄 · 같은 짝 안, 짝의 두 줄(긴장 짝은 일부러 맞선다)끼리는 맞대지 않는다.
 *  - 원국 줄 ↔ MBTI 줄(B)이 반대이고 Fusion DB에 (원국 id × 그 사람 유형) 규칙이 있으면 지우지 않고 짝(긴장)으로 묶는다(덕짱님 고침 4).
 *  - 없으면 약한 쪽을 뺀다: 덜 구체적인 출처(MBTI 1 < 세운 DB 줄 2 < 원국 2~4) → 그 차원 세기가 작은 쪽 → 뒤에 나온 것. 상한은 권당 16(카드 정제와 함께).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import { annualTagOf } from "@/lib/brief/design/annual";
import { atomsOf, dimsOf, fusionDims, specificity, type Dim, type RefineLog } from "./refine";
import type { Line, Pair } from "./intake";
import type { PairReason } from "./link";

type Trait = Brief["traits"][number];
type Kind = "natal" | "mbti" | "ym" | "pair";
type Item = { readonly key: string; readonly text: string; readonly owner: string; readonly kind: Kind; readonly rank: number; readonly order: number; readonly dims: readonly Dim[] };
export type BookTidyLog = { drops: { text: string; why: string }[]; binds: { natal: string; fusion: string; why: string }[]; over: { text: string; why: string }[] };
export const bookTidyLog: { last?: BookTidyLog } = {};

export type BookTidyIn<P extends Pair> = {
  readonly lines: readonly Line[]; readonly pairs: readonly P[]; readonly k: Pick<Knowledge, "personaTags" | "fusionByFeature">;
  readonly traitOf: (lineId: string) => Trait | undefined; readonly mbtiType: string | null; readonly mbti: string | null;
  readonly cap: number; readonly log: RefineLog; readonly pairWhy: (t: string) => string;
};
/** 세운 DB 줄의 성향 차원 — 성향 · 행동 경향(trait · situ)만. 그 시기 흐름 줄(flow 「…흐름 · …시기」)은 조건이 다른 장면이라 범위를 넘어 맞대지 않는다(rubric 2-1 모순 「조건이 다른 장면」). */
const lastingDims = (s: string): readonly Dim[] => { const t = annualTagOf(s); return t && (t.k === "trait" || t.k === "situ") ? (t.d as readonly Dim[]) : []; };
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
const clash = (a: readonly Dim[], b: readonly Dim[], min: number) => a.find(([d, p, s]) => s >= min && b.some(([d2, p2, s2]) => d2 === d && p2 === -p && s2 >= min))?.[0];

export function tidyBookPass<P extends Pair>(x: BookTidyIn<P>): { lines: Line[]; pairs: (P | Pair)[]; dropLines: string[] } {
  const log: BookTidyLog = { drops: [], binds: [], over: [] }; bookTidyLog.last = log;
  const items: Item[] = []; let order = 0;
  for (const l of x.lines.filter(l2 => l2.use.length)) {
    if (l.subject === "natal" || l.subject === "mbti") {
      const t = l.subject === "natal" ? x.traitOf(l.id) : undefined;
      for (const a of atomsOf(l.meaning)) { const d = dimsOf(a, x.k as Knowledge); if (d.length) items.push({ key: `${l.id}|${a}`, text: a, owner: l.id, kind: l.subject, rank: l.subject === "mbti" ? 1 : t ? specificity(t.featureId, t.positions.length) : 2, order: order++, dims: d }); }
    } else if (l.subject === "year" || l.subject === "month") {
      for (const t of [l.value, l.meaning].filter(Boolean)) { const d = lastingDims(t); if (d.length) { items.push({ key: `${l.id}|${t}`, text: t, owner: l.id, kind: "ym", rank: 2, order: order++, dims: d }); break; } }
    }
  }
  for (const p of x.pairs) for (const sen of sentences(p.why)) {
    const d = p.fusionId ? fusionDims(p.fusionId, sen) : lastingDims((p as Pair & { srcText?: string }).srcText ?? sen.replace(/[.!]$/, ""));
    if (d.length) items.push({ key: `${p.id}|${sen}`, text: sen, owner: p.id, kind: "pair", rank: 1, order: order++, dims: d });
  }
  const pairById = new Map(x.pairs.map(p => [p.id, p] as const));
  /** 짝으로 이미 이어진 두 줄(짝 이유 ↔ 그 짝의 두 줄, 원국 줄 ↔ 그 줄의 짝이 쓰는 MBTI 줄)은 맞대지 않는다 — 긴장 짝은 일부러 맞선다. */
  const related = (a: Item, b: Item) => {
    const pa = pairById.get(a.owner), pb = pairById.get(b.owner);
    if (pa && (b.owner === pa.myeongri || b.owner === pa.mbti)) return true;
    if (pb && (a.owner === pb.myeongri || a.owner === pb.mbti)) return true;
    return x.pairs.some(p => (p.myeongri === a.owner && p.mbti === b.owner) || (p.myeongri === b.owner && p.mbti === a.owner));
  };
  const gone = new Set<string>(), bound = new Set<string>(), newPairs: Pair[] = [], reasonOf = new Map<string, PairReason>();
  let left = x.cap;
  const lineMeaning = new Map(x.lines.map(l => [l.id, l.meaning] as const));
  const atomsLeft = (owner: string) => atomsOf(lineMeaning.get(owner) ?? "").filter(a => !gone.has(`${owner}|${a}`)).length;
  const canDrop = (it: Item) => it.kind === "natal" || it.kind === "mbti" ? atomsLeft(it.owner) > 1 : true;
  const ruleFor = (natalOwner: string) => { const t = x.traitOf(natalOwner), m = x.mbti; return t && m ? (x.k.fusionByFeature.get(t.featureId) ?? []).find(r => r.mbtiTarget === m || (r.mbtiTarget.length < 4 && [...r.mbtiTarget].every(ch => m.includes(ch)))) : undefined; };
  const run = (min: number) => {
    for (let j = 1; j < items.length; j++) for (let i = 0; i < j; i++) {
      const a = items[i], b = items[j];
      if (a.owner === b.owner || gone.has(a.key) || gone.has(b.key) || (bound.has(a.key) && bound.has(b.key)) || related(a, b)) continue;
      const d = clash(a.dims, b.dims, min); if (!d) continue;
      // 원국 ↔ MBTI 쪽 + Fusion 규칙 → 짝(긴장)으로 묶는다.
      const natal = a.kind === "natal" ? a : b.kind === "natal" ? b : undefined, side = natal === a ? b : a;
      if (natal && side.kind === "mbti" && x.mbtiType) {
        const rule = ruleFor(natal.owner);
        if (rule) {
          const have = x.pairs.find(p => p.myeongri === natal.owner) ?? newPairs.find(p => p.myeongri === natal.owner);
          if (have) reasonOf.set(have.id, "긴장");
          else newPairs.push({ id: `PB${newPairs.length + 1}`, myeongri: natal.owner, mbti: x.mbtiType, why: x.pairWhy(rule.why), reason: "긴장", fusionId: rule.id });
          bound.add(a.key); bound.add(b.key);
          log.binds.push({ natal: natal.text.slice(0, 40), fusion: rule.id, why: `${d} 반대 끝(「${side.text.slice(0, 24)}」) → 짝(긴장)` });
          continue;
        }
      }
      const sa = a.dims.find(z => z[0] === d)![2], sb = b.dims.find(z => z[0] === d)![2];
      const lose = a.rank !== b.rank ? (a.rank < b.rank ? a : b) : sa !== sb ? (sa < sb ? a : b) : b;
      const why = `책 전체 ${d} 반대 끝(「${(lose === a ? b : a).text.slice(0, 24)}」)`;
      if (left > 0 && canDrop(lose)) { gone.add(lose.key); left--; log.drops.push({ text: lose.text, why }); x.log.tidy.push({ text: lose.text, why }); }
      else if (!log.over.some(o => o.text === lose.text)) { log.over.push({ text: lose.text, why }); x.log.tidyOver.push({ text: lose.text, why }); }
    }
  };
  // 범위를 넘는 맞대기는 두 끝 모두 세기 2 이상만(세기 1이 낀 약한 쌍은 범위 안 정리가 맡는다 — 넓히면 달 장면 줄까지 지워 재료가 준다).
  run(2);
  const dropLines = [...new Set(items.filter(it => it.kind === "ym" && gone.has(it.key)).map(it => it.owner))];
  const lines = x.lines.map(l => { const drop = atomsOf(l.meaning).filter(a => gone.has(`${l.id}|${a}`)); return drop.length && (l.subject === "natal" || l.subject === "mbti") ? { ...l, meaning: atomsOf(l.meaning).filter(a => !drop.includes(a)).join(" · ") } : l; });
  const pairs = [...x.pairs.map(p => { const keep = sentences(p.why).filter(s => !gone.has(`${p.id}|${s}`)); const r = reasonOf.get(p.id); return { ...p, why: keep.join(" "), ...(r ? { reason: r } : {}) }; }).filter(p => p.why), ...newPairs];
  return { lines, pairs, dropLines };
}
