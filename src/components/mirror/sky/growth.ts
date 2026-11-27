/**
 * 하늘의 성장 값 · 색 — 3D(scene3d)와 2D(Sky2D)가 같이 쓴다. three.js · 3D 장면 코드를 끌어오지 않도록 따로 둔다
 * (WebGL이 없는 폰 · ?sky=2d에서 3D 장면 코드를 내려받지 않게 — 명령 3 D8 묶음 크기 점검).
 */
export type SkyPhase = "idle" | "quiz" | "collapse" | "bang" | "home";
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
/**
 * 성장 보상(명령 3 1-3): 친구 수 → 성장 단계 값(0~1). 성단 3~6명 · 성운 8~20명 · 은하 25~85명, 그리고 rich는 40명에서 400명까지(로그 — 100명 0.4 · 400명 1).
 * 명령 2의 밝기 상한(GROWTH_CAP — 은하 전체를 눌러 별자리를 지키던 방식)은 없앴다. 은하 · 성운 · 성단은 rich만큼 더 밝고 · 색이 진하고 · 커지고,
 * 별자리는 그 뒤에만 깔린 부드러운 어두운 받침(BACKING — 선 아래 깃털 띠 + 별 아래 어두운 원)으로 또렷하게 지킨다.
 */
export const growthOf = (n: number) => ({
  clus: clamp((n - 3) / 3, 0, 1), neb: clamp((n - 8) / 12, 0, 1), gal: clamp((n - 25) / 60, 0, 1),
  rich: clamp(Math.log(Math.max(1, n) / 40) / Math.log(10), 0, 1),
});
/** 단계별 밝기 · 색 진하기 · 크기(값 = 기본 + rich만큼 더). 2D 하늘(Sky2D)도 같은 값을 쓴다. */
export const GROWTH = {
  clus: { base: .5, rich: .3 }, neb: { base: .55, rich: .45, sat: .7 }, gal: { base: .42, rich: .5, sat: .8, scale: .4 }, knot: { rich: .8 }, core: .7,
} as const;
/** 별자리 받침의 짙기: 은하가 밝을수록 짙게(최대 0.86). 선 받침 반폭 · 별 받침 크기(세계 단위 · 점 크기). */
export const BACKING = { base: .3, gal: .4, rich: .16, halfWidth: .3, disc: 4.2 } as const;
export const backingAlpha = (g: { gal: number; rich: number }) => clamp(BACKING.base + BACKING.gal * g.gal + BACKING.rich * g.rich, 0, .86);
/** 친구 수에 따른 친구 별 밝기 · 크기 비율(100명 0.85 · 400명 0.55). */
export const friendDim = (n: number) => clamp(1.05 - n / 500, .55, 1);
const HEAT = [[.55, .08, .03], [1, .42, .12], [1, .82, .6], [1, .97, .93], [.75, .85, 1]];
export const heatRGB = (h: number): [number, number, number] => {
  const x = clamp(h, 0, 1) * 4, i = Math.min(3, Math.floor(x)), f = x - i, a = HEAT[i], b = HEAT[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
};
