/**
 * P2 Fusion 긴장 후보: 차원 점수상 반대 방향(cross-score tension 우세)인 상위 쌍을 유형별로 뽑는다. 이미 규칙이 있는 (명리 id, 유형) 쌍은 뺀다.
 * 실행: pnpm exec tsx tools/p2-brief/fusion-tension-candidates.ts > docs/v5/p2-fusion-tension-candidates.json
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { rankPairs } from "../../src/data/knowledge-v5/cross-score";

const DATA = resolve(import.meta.dirname, "../../src/data/knowledge-v5");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const features = readdirSync(join(DATA, "myeongri")).flatMap(f => read(join(DATA, "myeongri", f)).features) as { id: string; family: string; easyName: string; dimensionTags: Record<string, number> }[];
const profiles = readdirSync(join(DATA, "mbti")).flatMap(f => read(join(DATA, "mbti", f)).profiles) as { type: string; dimensionTags: Record<string, number> }[];
const rules = readdirSync(join(DATA, "fusion")).flatMap(f => read(join(DATA, "fusion", f)).rules) as { myeongriId: string; mbtiTarget: string }[];
const have = new Set(rules.map(r => `${r.myeongriId}|${r.mbtiTarget}`));
const familyOf = new Map(features.map(f => [f.id, f.family]));
const PER_TYPE = 10, PER_FEATURE = 2;
const ranked = rankPairs(features, profiles)
  .filter(s => s.kind === "tension" && !have.has(`${s.featureId}|${s.mbti}`))
  .sort((a, b) => b.tension - a.tension || b.sharedDimensions - a.sharedDimensions || a.featureId.localeCompare(b.featureId) || a.mbti.localeCompare(b.mbti));
const byType: Record<string, unknown[]> = {}; const perFeature = new Map<string, number>(); const perFamilyType = new Map<string, number>();
for (const s of ranked) {
  const list = (byType[s.mbti] ??= []);
  const fam = familyOf.get(s.featureId) ?? "";
  if (list.length >= PER_TYPE || (perFeature.get(s.featureId) ?? 0) >= PER_FEATURE || (perFamilyType.get(`${s.mbti}|${fam}`) ?? 0) >= 4) continue;
  list.push({ myeongriId: s.featureId, family: fam, tension: s.tension, resonance: s.resonance, dimension: s.dimension, opposite: s.contributions.filter(c => c.product < 0).map(c => `${c.dimension} ${c.feature}×${c.mbti}`) });
  perFeature.set(s.featureId, (perFeature.get(s.featureId) ?? 0) + 1); perFamilyType.set(`${s.mbti}|${fam}`, (perFamilyType.get(`${s.mbti}|${fam}`) ?? 0) + 1);
}
const sorted = Object.fromEntries(Object.entries(byType).sort(([a], [b]) => a.localeCompare(b)));
console.log(JSON.stringify({ version: "p2-fusion-tension-candidates-v1", method: "rankPairs → kind=tension, 기존 쌍 제외, tension ↓, 유형당 10·feature당 2·유형×가족 4", perType: Object.fromEntries(Object.entries(sorted).map(([k, v]) => [k, v.length])), candidates: sorted }, null, 1));
