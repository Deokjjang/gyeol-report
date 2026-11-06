/**
 * 입력 해시 기반 결정론 난수. 같은 입력 = 같은 브리프, 다른 고객 = 다른 이미지·장면 변형.
 * FNV-1a 32bit(키 정렬 직렬화) → mulberry32.
 */
export function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  return `{${Object.keys(v as Record<string, unknown>).sort().filter(k => (v as Record<string, unknown>)[k] !== undefined)
    .map(k => `${JSON.stringify(k)}:${stableStringify((v as Record<string, unknown>)[k])}`).join(",")}}`;
}

export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

export type Rng = { readonly next: () => number; readonly int: (n: number) => number; readonly pick: <T>(xs: readonly T[]) => T; readonly fork: (label: string) => Rng };

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const int = (n: number) => Math.floor(next() * n);
  return { next, int, pick: xs => xs[int(xs.length)], fork: label => createRng(fnv1a(`${seed}:${label}`)) };
}

/** 앞에서부터 n개를 seeded 순서로 고른다(원본 순서 무관, 결정론). */
export function pickN<T>(rng: Rng, xs: readonly T[], n: number): T[] {
  const pool = [...xs]; const out: T[] = [];
  while (pool.length && out.length < n) out.push(pool.splice(rng.int(pool.length), 1)[0]);
  return out;
}
