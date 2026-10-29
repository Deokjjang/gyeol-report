/**
 * 원국·유입 공용 관계 감지. 같은 함수가 원국 4자리와 대운·세운·월운 유입 자리를 함께 본다.
 * 규칙표: tables.ts. 학파 기본값: 반합=왕지 포함 2자, 방합=3자 완성만, 삼형 2자=partial.
 */
import type { EarthlyBranch, HeavenlyStem } from "../types";
import {
  BANGHAP_TABLE,
  CHUNG_TABLE,
  HAE_TABLE,
  JAHYEONG_BRANCHES,
  PA_TABLE,
  SAMHAP_TABLE,
  SAMHYEONG_TABLE,
  SANGHYEONG_TABLE,
  STEM_HAP_TABLE,
  WONJIN_TABLE,
  YUKHAP_TABLE,
} from "./tables";
import type { AnyPosition, ChartPosition, PositionedPillar, RelationHit, RelationKind, RelationMember } from "./types";

const NATAL_ORDER: Record<ChartPosition, number> = { year: 0, month: 1, day: 2, hour: 3 };
const isNatal = (p: AnyPosition): p is ChartPosition => p in NATAL_ORDER;

/** 구성원이 모두 원국이고 자리가 끊김 없이 이어지는가(년-월, 월-일, 일-시 / 년-월-일, 월-일-시). */
export function membersAdjacent(positions: readonly AnyPosition[]): boolean {
  if (!positions.every(isNatal)) return false;
  const order = [...new Set(positions.map((p) => NATAL_ORDER[p as ChartPosition]))].sort((a, b) => a - b);
  if (order.length !== positions.length) return false;
  return order.every((v, i) => i === 0 || v === order[i - 1] + 1);
}

type Slot<T> = { readonly position: AnyPosition; readonly char: T; readonly index: number };

function samePair<T>(a: T, b: T, pair: readonly [T, T]): boolean {
  return (a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0]);
}

function hit(
  kind: RelationKind,
  key: string,
  slots: readonly Slot<HeavenlyStem | EarthlyBranch>[],
  extra: Partial<Pick<RelationHit, "completeness" | "subtype" | "element">> = {},
): RelationHit {
  const ordered = [...slots].sort((a, b) => a.index - b.index);
  const members: RelationMember[] = ordered.map((s) => ({ position: s.position, char: s.char }));
  return {
    kind,
    key,
    members,
    completeness: extra.completeness ?? "full",
    ...(extra.subtype ? { subtype: extra.subtype } : {}),
    ...(extra.element ? { element: extra.element } : {}),
    adjacent: membersAdjacent(members.map((m) => m.position)),
  };
}

function pairs<T>(slots: readonly Slot<T>[]): [Slot<T>, Slot<T>][] {
  const out: [Slot<T>, Slot<T>][] = [];
  for (let i = 0; i < slots.length; i += 1) for (let j = i + 1; j < slots.length; j += 1) out.push([slots[i], slots[j]]);
  return out;
}

/** 표의 세 글자 각각에 해당하는 자리 조합(중복 지지는 모든 조합). */
function tripleCombos(slots: readonly Slot<EarthlyBranch>[], members: readonly EarthlyBranch[]): Slot<EarthlyBranch>[][] {
  const [a, b, c] = members.map((m) => slots.filter((s) => s.char === m));
  const out: Slot<EarthlyBranch>[][] = [];
  for (const x of a) for (const y of b) for (const z of c) out.push([x, y, z]);
  return out;
}

/**
 * 관계 감지. entries 순서가 구성원 순서의 기준이다(원국은 년·월·일·시 순으로 넘긴다).
 * 같은 글자가 여러 자리에 있으면 자리 조합마다 한 건씩 낸다(쟁합·중복충 포함).
 */
export function detectRelations(entries: readonly PositionedPillar[]): RelationHit[] {
  const stems: Slot<HeavenlyStem>[] = entries.map((e, index) => ({ position: e.position, char: e.pillar.stem, index }));
  const branches: Slot<EarthlyBranch>[] = entries.map((e, index) => ({ position: e.position, char: e.pillar.branch, index }));
  const branchPairs = pairs(branches);
  const out: RelationHit[] = [];

  for (const [x, y] of pairs(stems)) {
    const row = STEM_HAP_TABLE.find((r) => samePair(x.char, y.char, r.pair));
    if (row) out.push(hit("STEM_HAP", row.pair.join(""), [x, y], { element: row.element }));
  }

  const pairKinds: readonly [RelationKind, readonly (readonly [EarthlyBranch, EarthlyBranch])[]][] = [
    ["CHUNG", CHUNG_TABLE],
    ["PA", PA_TABLE],
    ["HAE", HAE_TABLE],
    ["WONJIN", WONJIN_TABLE],
  ];
  for (const [x, y] of branchPairs) {
    const yuk = YUKHAP_TABLE.find((r) => samePair(x.char, y.char, r.pair));
    if (yuk) out.push(hit("YUKHAP", yuk.pair.join(""), [x, y], yuk.element ? { element: yuk.element } : {}));
  }

  for (const row of SAMHAP_TABLE) {
    const full = tripleCombos(branches, row.members);
    for (const combo of full) out.push(hit("SAMHAP", row.members.join(""), combo, { element: row.element }));
    if (full.length) continue;
    const wang = row.members[1];
    for (const [x, y] of branchPairs) {
      const chars = [x.char, y.char];
      const other = chars.find((c) => c !== wang);
      if (chars.includes(wang) && other && other !== wang && row.members.includes(other)) {
        out.push(hit("SAMHAP", row.members.join(""), [x, y], { completeness: "half", element: row.element }));
      }
    }
  }

  for (const row of BANGHAP_TABLE) {
    for (const combo of tripleCombos(branches, row.members)) out.push(hit("BANGHAP", row.members.join(""), combo, { element: row.element }));
  }

  for (const [kind, table] of pairKinds) {
    for (const [x, y] of branchPairs) {
      const pair = table.find((p) => samePair(x.char, y.char, p));
      if (pair) out.push(hit(kind, pair.join(""), [x, y]));
    }
  }

  for (const members of SAMHYEONG_TABLE) {
    const key = members.join("");
    const full = tripleCombos(branches, members);
    for (const combo of full) out.push(hit("HYEONG", key, combo, { subtype: "삼형" }));
    if (full.length) continue;
    for (const [x, y] of branchPairs) {
      if (x.char !== y.char && members.includes(x.char) && members.includes(y.char)) {
        out.push(hit("HYEONG", key, [x, y], { completeness: "partial", subtype: "삼형" }));
      }
    }
  }
  for (const [x, y] of branchPairs) {
    const sang = SANGHYEONG_TABLE.find((p) => samePair(x.char, y.char, p));
    if (sang) out.push(hit("HYEONG", sang.join(""), [x, y], { subtype: "상형" }));
    if (x.char === y.char && JAHYEONG_BRANCHES.includes(x.char)) out.push(hit("HYEONG", x.char + y.char, [x, y], { subtype: "자형" }));
  }

  return out;
}
