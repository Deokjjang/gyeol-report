/** 브라우저 · 서버 공용 결정론 해시와 난수(「남이 본 나」 시드 고정용). 암호용이 아니다. */

/** FNV-1a 32비트 + murmur3 마무리 섞기(아래 비트까지 고르게 — FNV만 쓰면 맨 아래 비트가 글자 홀짝으로만 정해진다). */
export function hash32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

/** mulberry32: 같은 시드면 늘 같은 [0, 1) 수열. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 시드 고정 섞기(원본은 그대로). */
export function seededShuffle<T>(list: readonly T[], seed: string): T[] {
  const out = [...list], rand = seededRandom(hash32(seed));
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
