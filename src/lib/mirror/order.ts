/** 문항 순서: 자가 질문지 순서 · 화면 A/B 순서 · 친구 묶음 고르기(SPEC 「60문항 초안」 · 「친구 응답 흐름」). 시드 고정 순수 함수. */
import { MIRROR_FACET_IDS, MIRROR_ITEMS, type MirrorItem } from "../../data/mirror/items";
import { openFacets, type Choice, type Closeness } from "./engine";
import { hash32, seededShuffle } from "./hash";

/** 자가 60문항 순서: 12문항씩 다섯 바퀴(바퀴마다 면 1문항씩, 면 순서는 사람마다 섞되 같은 사람은 늘 같다). 12개마다 이정표가 오므로 바퀴 끝 = 이정표. */
export function selfQuizOrder(seed: string): MirrorItem[] {
  const byFacet = MIRROR_FACET_IDS.map(f => MIRROR_ITEMS.filter(i => i.facet === f));
  return [0, 1, 2, 3, 4].flatMap(round => seededShuffle(byFacet, `${seed}:round:${round}`).map(items => items[round]));
}

/** 화면 위아래 순서: [위, 아래]의 선택값(0 = A, 1 = B). 문항마다 섞고 같은 사람에게는 늘 같다. */
export function optionOrder(seed: string, itemId: string): readonly [Choice, Choice] {
  return hash32(`${seed}:opt:${itemId}`) & 1 ? [1, 0] : [0, 1];
}

/**
 * 친구 한 묶음: 열린 면마다 1문항(친구 · 가까운 사이 12, 아는 사이 10).
 * asked = 이 친구가 이 주인에게 이미 받은 문항(답 · 건너뜀 모두, 다시 내지 않는다). ownerCounts = 그 주인에게 쌓인 친구 답 수(문항별).
 * 면마다 답이 가장 적게 쌓인 문항부터, 같으면 시드 순. 남은 문항이 없는 면은 빠진다. 묶음 안 순서도 시드로 섞는다.
 */
export function pickBundle(opts: { closeness: Closeness; asked: ReadonlySet<string>; ownerCounts: ReadonlyMap<string, number>; seed: string }): MirrorItem[] {
  const picked = openFacets(opts.closeness).flatMap(facet => {
    const left = MIRROR_ITEMS.filter(i => i.facet === facet && !opts.asked.has(i.id));
    if (!left.length) return [];
    const key = (i: MirrorItem) => [opts.ownerCounts.get(i.id) ?? 0, hash32(`${opts.seed}:pick:${i.id}`)] as const;
    return [left.reduce((best, i) => { const a = key(i), b = key(best); return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? i : best; })];
  });
  return seededShuffle(picked, `${opts.seed}:bundle:${opts.asked.size}`);
}
