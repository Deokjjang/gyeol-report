/**
 * feature × MBTI 유형 교차 점수 (순수 함수, 의존성 없음).
 * 두 쪽의 dimensionTags(차원 → -1~1)를 같은 차원끼리 곱한다. 곱이 양수면 같은 방향(공명), 음수면 반대 방향(긴장).
 *   resonance = Σ max(f·m, 0), tension = Σ max(-f·m, 0), strength = max(resonance, tension)
 *   kind: resonance ≥ 1.5·tension → "resonance", tension ≥ 1.5·resonance → "tension", 그 밖(섞임) → "conditional"
 *   dimension = |f·m| 이 가장 큰 차원(교차 발견의 중심 차원)
 * 상위 N쌍은 작성 대상이고, 나머지 쌍은 런타임이 behavior-ontology의 장면 템플릿으로 생성한다(cross-findings.json runtimeTemplateRule).
 */
export type DimensionTags = Readonly<Record<string, number>>;
export type CrossKind = "resonance" | "tension" | "conditional";
export type CrossContribution = { readonly dimension: string; readonly feature: number; readonly mbti: number; readonly product: number };
export type CrossScore = {
  readonly featureId: string; readonly mbti: string;
  readonly resonance: number; readonly tension: number; readonly strength: number;
  readonly kind: CrossKind; readonly dimension: string; readonly sharedDimensions: number;
  readonly contributions: readonly CrossContribution[];
};
const round = (v: number) => Math.round(v * 1000) / 1000;

export function scorePair(featureId: string, featureTags: DimensionTags, mbti: string, mbtiTags: DimensionTags): CrossScore | null {
  const contributions: CrossContribution[] = [];
  for (const [dimension, f] of Object.entries(featureTags)) {
    const m = mbtiTags[dimension];
    if (m === undefined || f === 0 || m === 0) continue;
    contributions.push({ dimension, feature: f, mbti: m, product: round(f * m) });
  }
  if (!contributions.length) return null;
  const resonance = round(contributions.reduce((s, c) => s + Math.max(c.product, 0), 0));
  const tension = round(contributions.reduce((s, c) => s + Math.max(-c.product, 0), 0));
  const strength = Math.max(resonance, tension);
  const kind: CrossKind = resonance >= tension * 1.5 ? "resonance" : tension >= resonance * 1.5 ? "tension" : "conditional";
  const top = [...contributions].sort((a, b) => Math.abs(b.product) - Math.abs(a.product) || a.dimension.localeCompare(b.dimension))[0];
  return { featureId, mbti, resonance, tension, strength: round(strength), kind, dimension: top.dimension, sharedDimensions: contributions.length,
    contributions: [...contributions].sort((a, b) => Math.abs(b.product) - Math.abs(a.product) || a.dimension.localeCompare(b.dimension)) };
}

export function rankPairs(features: readonly { readonly id: string; readonly dimensionTags: DimensionTags }[], profiles: readonly { readonly type: string; readonly dimensionTags: DimensionTags }[]): CrossScore[] {
  const all: CrossScore[] = [];
  for (const f of features) for (const p of profiles) { const s = scorePair(f.id, f.dimensionTags, p.type, p.dimensionTags); if (s) all.push(s); }
  // 결정론적 순서: strength ↓, 공유 차원 수 ↓, featureId, mbti
  return all.sort((a, b) => b.strength - a.strength || b.sharedDimensions - a.sharedDimensions || a.featureId.localeCompare(b.featureId) || a.mbti.localeCompare(b.mbti));
}

/** 상위 N을 고르되 한 feature·한 유형·한 가족이 목록을 독식하지 않도록 상한을 둔다(기본 feature당 4, 유형당 20, 가족당 30%).
 *  가족 상한이 없으면 태그가 많은 일주 60개가 상위를 거의 다 차지하는데, 독자 한 명은 일주를 1개만 가지므로 적중률이 낮아진다. */
export function selectTop(ranked: readonly CrossScore[], limit: number, caps: { perFeature?: number; perType?: number; perFamily?: number } = {}, familyOf?: (featureId: string) => string): CrossScore[] {
  const perFeature = caps.perFeature ?? 4, perType = caps.perType ?? Math.ceil(limit / 16) + 4, perFamily = caps.perFamily ?? Math.ceil(limit * 0.3);
  const byFeature = new Map<string, number>(), byType = new Map<string, number>(), byFamily = new Map<string, number>(), out: CrossScore[] = [];
  const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const s of ranked) {
    if (out.length >= limit) break;
    const family = familyOf?.(s.featureId) ?? "";
    if ((byFeature.get(s.featureId) ?? 0) >= perFeature || (byType.get(s.mbti) ?? 0) >= perType || (familyOf && (byFamily.get(family) ?? 0) >= perFamily)) continue;
    out.push(s); inc(byFeature, s.featureId); inc(byType, s.mbti); inc(byFamily, family);
  }
  return out;
}

export function distribution(ranked: readonly CrossScore[]) {
  const bins: Record<string, number> = {}; const kinds: Record<CrossKind, number> = { resonance: 0, tension: 0, conditional: 0 };
  for (const s of ranked) { const b = `${Math.floor(s.strength * 2) / 2}`; bins[b] = (bins[b] ?? 0) + 1; kinds[s.kind]++; }
  const strengths = ranked.map(s => s.strength);
  const pct = (p: number) => strengths.length ? strengths[Math.min(strengths.length - 1, Math.floor(p * strengths.length))] : 0;
  return { pairs: ranked.length, kinds, bins, p50: pct(0.5), p10: pct(0.1), p90: pct(0.9), max: strengths[0] ?? 0, min: strengths.at(-1) ?? 0 };
}
