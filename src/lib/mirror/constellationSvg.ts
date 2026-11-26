/**
 * 별자리 2D 그림(SVG 문자열). 3D를 못 쓰는 기기의 대체 화면 · 공유 카드 · 서버 미리보기 이미지가 같은 모양 데이터로 그린다(SPEC 「별자리 모양」 7).
 * 브라우저 · 서버 공용 순수 함수. 좌표: 단위 원(y 위쪽 +) → SVG(y 아래쪽 +).
 */
import { facetAngle, SHAPE, type ConstellationShape } from "./constellation";
import { hash32, seededRandom } from "./hash";
import type { FriendStar } from "./home";

export type SvgOptions = { size?: number; background?: string | null; lineOpacity?: number; friends?: readonly FriendStar[]; labels?: readonly string[] | null; margin?: number };

const f1 = (n: number) => n.toFixed(1);
export function constellationSvg(shape: ConstellationShape, opts: SvgOptions = {}): string {
  const size = opts.size ?? 320, half = size / 2, scale = half * (1 - (opts.margin ?? 0.12));
  const X = (x: number) => half + x * scale, Y = (y: number) => half - y * scale;
  const pts = new Map(shape.points.map(p => [p.index, p]));
  const parts: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#FFF1E2" stop-opacity=".9"/><stop offset="1" stop-color="#CAD7FF" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="c" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF3E6" stop-opacity=".9"/><stop offset=".25" stop-color="#FFE6CC" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`];
  if (opts.background !== null) parts.push(`<rect width="${size}" height="${size}" fill="${opts.background ?? "#000"}"/>`);
  parts.push(`<circle cx="${f1(half)}" cy="${f1(half)}" r="${f1(scale * 0.22)}" fill="url(#c)"/>`);
  for (const [a, b] of shape.edges) {
    const p = pts.get(a), q = pts.get(b);
    if (p && q) parts.push(`<line x1="${f1(X(p.x))}" y1="${f1(Y(p.y))}" x2="${f1(X(q.x))}" y2="${f1(Y(q.y))}" stroke="#fff" stroke-opacity="${opts.lineOpacity ?? 0.55}" stroke-width="${f1(Math.max(1, size / 320))}" stroke-linecap="round"/>`);
  }
  // 친구 별: 3D와 같은 자리(맞으면 내 별 옆, 다르면 반대쪽으로 비켜선 자리) + 작은 흔들림.
  for (const star of opts.friends ?? []) {
    const p = pts.get(star.facet);
    if (!p) continue;
    const r = seededRandom(hash32(`star3d:${star.key}`)), j = 0.035;
    const base = star.matched ? { x: p.x, y: p.y } : (() => { const a = facetAngle(p.index) + (p.side === "A" ? -SHAPE.lean : SHAPE.lean), rr = SHAPE.inner + SHAPE.span * (1 - p.strength * 0.55); return { x: Math.cos(a) * rr, y: Math.sin(a) * rr }; })();
    const x = base.x + (r() - 0.5) * 2 * j, y = base.y + (r() - 0.5) * 2 * j;
    const color = star.golden ? "#FFD08A" : "#CAD7FF", rad = (star.golden ? 2.6 : [1.3, 1.6, 2][star.closeness - 1]) * size / 320;
    parts.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${f1(rad)}" fill="${color}" fill-opacity="${star.golden ? 1 : [0.6, 0.78, 0.95][star.closeness - 1]}"/>`);
  }
  for (const p of shape.points) {
    const r = (2.2 + 2.6 * p.brightness) * size / 320;
    parts.push(`<circle cx="${f1(X(p.x))}" cy="${f1(Y(p.y))}" r="${f1(r * 3.2)}" fill="url(#g)" fill-opacity="${(0.35 + 0.5 * p.brightness).toFixed(2)}"/>`);
    parts.push(`<circle cx="${f1(X(p.x))}" cy="${f1(Y(p.y))}" r="${f1(r)}" fill="#fff"/>`);
    if (opts.labels) {
      const a = facetAngle(p.index), lx = half + Math.cos(a) * half * 0.94, ly = half - Math.sin(a) * half * 0.94;
      parts.push(`<text x="${f1(lx)}" y="${f1(ly)}" fill="#7E7E87" font-size="${f1(10 * size / 320)}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${opts.labels[p.index] ?? ""}</text>`);
    }
  }
  parts.push("</svg>");
  return parts.join("");
}
