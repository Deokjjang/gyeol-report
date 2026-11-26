/**
 * 별자리 모양(SPEC 「별자리 모양 — 사람마다 다르게」). 3D 화면 · 2D 카드 · 서버 미리보기 이미지가 같은 결과를 쓴다.
 * 1) 별 12개 = 12면, 각 별은 자기 방향(30° 간격, 12시부터 시계 방향) 위에 놓인다.
 * 2) 기운 쪽(A/B)에 따라 좌우로 비켜 서고, 강도가 셀수록 중심에서 멀고 밝다.
 * 3) 선은 12개 점을 가장 짧게 잇는 최소 신장 트리 — 너무 긴 선은 끊는다.
 * 4) 60개 답 문자열의 해시로 작은 흔들림을 더한다(같은 답이면 늘 같은 모양).
 * 친구 점수를 넣으면 「남이 본 별자리」가 같은 함수로 나온다(흔들림 씨앗은 주인 답 문자열을 그대로 써서 두 모양을 겹쳐 비교할 수 있다).
 * 좌표는 단위 원 안(x 오른쪽 +, y 위쪽 +). 화면 좌표로 그릴 때는 y를 뒤집는다.
 */
import { MIRROR_FACET_IDS, type FacetId } from "../../data/mirror/items";
import { answerKey, friendFacets, friendSide, selfFacets, type FriendSession, type SelfAnswers, type Side } from "./engine";
import { hash32, seededRandom } from "./hash";

/** strength 0(반반)~1(뚜렷함). */
export type FacetLean = { side: Side; strength: number };
export type StarPoint = { facet: FacetId; index: number; x: number; y: number; brightness: number; strength: number; side: Side };
/** edges: 이어진 별 쌍(면 index, 작은 쪽이 앞). */
export type ConstellationShape = { points: StarPoint[]; edges: [number, number][]; seed: number };

export type ShapeParams = { lean: number; inner: number; span: number; jitterAngle: number; jitterRadius: number; maxEdge: number; minSep: number; brightnessMin: number };
export const SHAPE: ShapeParams = {
  /** 기운 쪽으로 비켜서는 각도(라디안, ≈ 13.8° — 이웃 방향과의 중간선 15° 안쪽). A = 반시계 쪽, B = 시계 쪽. */
  lean: 0.24,
  /** 중심에서 거리 = inner + span × 강도(약한 면은 중심 가까이 모여 갈래가 생긴다). */
  inner: 0.16, span: 0.66,
  /** 흔들림: 각도(라디안)와 반지름. 무작위 답 100명 × 30번에서 선 구조가 서로 다른 비율 최저 99% · 평균 99.9%(2026-11-27 측정). */
  jitterAngle: 0.05, jitterRadius: 0.1,
  /** 이보다 긴 선은 끊는다(단위 원 기준). */
  maxEdge: 0.6,
  /** 두 별이 이보다 가까우면 서로 반씩 밀어낸다(겹침 방지). */
  minSep: 0.09,
  brightnessMin: 0.42,
};

/** 면 index → 기본 방향(12시 = 0, 시계 방향 30°). */
export const facetAngle = (index: number): number => Math.PI / 2 - (index * Math.PI) / 6;

export function constellation(leans: readonly (FacetLean | null)[], jitterKey: string, shape: ShapeParams = SHAPE): ConstellationShape {
  const seed = hash32(`constellation:${jitterKey}`), rand = seededRandom(seed);
  const points: StarPoint[] = [];
  MIRROR_FACET_IDS.forEach((facet, index) => {
    // 면마다 난수 두 개를 늘 같은 순서로 뽑는다 — 비어 있는 면이 있어도 다른 면의 흔들림은 그대로.
    const ja = (rand() * 2 - 1) * shape.jitterAngle, jr = (rand() * 2 - 1) * shape.jitterRadius;
    const lean = leans[index];
    if (!lean) return;
    const strength = Math.min(1, Math.max(0, lean.strength));
    const angle = facetAngle(index) + (lean.side === "A" ? shape.lean : -shape.lean) + ja;
    const radius = shape.inner + shape.span * strength + jr;
    points.push({ facet, index, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, brightness: shape.brightnessMin + (1 - shape.brightnessMin) * strength, strength, side: lean.side });
  });
  separate(points, shape.minSep);
  return { points, edges: spanningEdges(points, shape.maxEdge), seed };
}

/** 너무 가까운 두 별을 잇는 방향으로 반씩 밀어낸다(정해진 순서로 몇 번만 — 결정론). */
function separate(points: StarPoint[], minSep: number): void {
  for (let round = 0; round < 6; round++) {
    let moved = false;
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
      const p = points[i], q = points[j], dx = q.x - p.x, dy = q.y - p.y, dist = Math.hypot(dx, dy);
      if (dist >= minSep) continue;
      // 완전히 겹치면 두 별의 기본 방향 차이로 밀 방향을 정한다.
      const [ux, uy] = dist > 1e-9 ? [dx / dist, dy / dist] : [Math.cos(facetAngle(q.index)) - Math.cos(facetAngle(p.index)), Math.sin(facetAngle(q.index)) - Math.sin(facetAngle(p.index))];
      const norm = Math.hypot(ux, uy) || 1, push = (minSep - dist) / 2;
      p.x -= (ux / norm) * push; p.y -= (uy / norm) * push; q.x += (ux / norm) * push; q.y += (uy / norm) * push;
      moved = true;
    }
    if (!moved) return;
  }
}

/** Prim 최소 신장 트리 → 너무 긴 선은 끊는다. */
function spanningEdges(points: readonly StarPoint[], maxEdge: number): [number, number][] {
  if (points.length < 2) return [];
  const d = (a: StarPoint, b: StarPoint) => Math.hypot(a.x - b.x, a.y - b.y);
  const inTree = new Set([0]), edges: [number, number][] = [];
  while (inTree.size < points.length) {
    let best: [number, number, number] | null = null;
    for (const i of inTree) for (let j = 0; j < points.length; j++) {
      if (inTree.has(j)) continue;
      const len = d(points[i], points[j]);
      if (!best || len < best[2]) best = [i, j, len];
    }
    inTree.add(best![1]);
    if (best![2] <= maxEdge) { const a = points[best![0]].index, b = points[best![1]].index; edges.push(a < b ? [a, b] : [b, a]); }
  }
  return edges.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
}

/** 내 별자리(자가 질문지 60문항). 다 답하지 않은 면은 별이 없다. */
export function selfConstellation(self: SelfAnswers): ConstellationShape {
  const leans = selfFacets(self).map(f => f ? { side: f.side, strength: Math.abs(f.aCount - 2.5) / 2.5 } : null);
  return constellation(leans, answerKey(self));
}
/** 남이 본 내 별자리(친구 점수). 친구 답이 없는 면은 별이 없고, 반반이면 주인 쪽 · 강도 0. */
export function friendConstellation(sessions: readonly FriendSession[], self: SelfAnswers): ConstellationShape {
  const mine = selfFacets(self);
  const leans = friendFacets(sessions).map((f, i) => f && mine[i] ? { side: friendSide(f.ratio, mine[i]!.side), strength: Math.abs(2 * f.ratio - 1) } : null);
  return constellation(leans, answerKey(self));
}

/** 선 구조 비교용 키(이어진 점 쌍 집합). */
export const edgeKey = (shape: ConstellationShape): string => shape.edges.map(e => e.join("-")).join(",");
