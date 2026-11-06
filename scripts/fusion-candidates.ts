/**
 * Fusion 후보 선정: 모든 명리 feature × MBTI 16유형을 cross-score.ts 로 점수화하고 상위 쌍을 배치별로 나눈다.
 * 실행: pnpm exec tsx scripts/fusion-candidates.ts [--limit 360] [--scene 60] [--batches 6] [--out docs/v5/p1-fusion-candidates.json]
 * 결과: { candidates: [{ batch, sceneRequired, featureId, family, mbti, kind, dimension, strength, contributions }], stats }
 * 이미 fusion/*.json 에 있는 쌍은 제외한다. 결정론(정렬 고정).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { rankPairs, selectTop, distribution } from "../src/data/knowledge-v5/cross-score";
import type { FusionRule, MbtiProfile, MyeongriFeature } from "../src/data/knowledge-v5/schema";

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src", "data", "knowledge-v5");
const args = process.argv.slice(2);
const opt = (k: string, d: string) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const limit = Number(opt("--limit", "360")), sceneN = Number(opt("--scene", "60")), batches = Number(opt("--batches", "6"));
const out = opt("--out", "docs/v5/p1-fusion-candidates.json");
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const listJson = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")).sort().map(f => join(dir, f)) : []);

const features: MyeongriFeature[] = listJson(join(DATA, "myeongri")).flatMap(p => readJson(p).features);
const profiles: MbtiProfile[] = listJson(join(DATA, "mbti")).flatMap(p => readJson(p).profiles);
const existing = new Set(listJson(join(DATA, "fusion")).flatMap(p => (readJson(p).rules as FusionRule[]).map(r => `${r.myeongriId}|${r.mbtiTarget}`)));
const familyOf = new Map(features.map(f => [f.id, f.family]));

const ranked = rankPairs(features, profiles).filter(s => !existing.has(`${s.featureId}|${s.mbti}`));
// 가족 상한: 일주 60개가 독식하지 않도록 25%, 유형당 limit/16 + 6, feature당 3
const picked = selectTop(ranked, limit, { perFeature: 3, perType: Math.ceil(limit / 16) + 6, perFamily: Math.ceil(limit * 0.25) }, id => familyOf.get(id) ?? "?");
// 유형 하한: 태그가 적은 유형(INTP 등)이 8개에 머물지 않도록 유형당 최소 floor 개를 그 유형의 상위 쌍으로 채운다(feature당 3 상한 유지)
const floor = Number(opt("--floor", "16"));
const countType = (t: string) => picked.filter(p => p.mbti === t).length;
const countFeature = (f: string) => picked.filter(p => p.featureId === f).length;
for (const p of profiles) for (const s of ranked) { if (countType(p.type) >= floor) break; if (s.mbti !== p.type || picked.includes(s) || countFeature(s.featureId) >= 3) continue; picked.push(s); }
// 장면 필수 상위 sceneN 은 strength 순 그대로. 배치는 라운드로빈으로 섞어 각 배치가 강·약 쌍을 고루 갖게 한다.
const candidates = picked.map((s, i) => ({
  batch: `X${(i % batches) + 1}`, sceneRequired: i < sceneN,
  featureId: s.featureId, family: familyOf.get(s.featureId) ?? "?", mbti: s.mbti, kind: s.kind, dimension: s.dimension, strength: s.strength,
  contributions: s.contributions.slice(0, 3).map(c => `${c.dimension}(${c.feature}×${c.mbti}=${c.product})`),
}));
const byFamily: Record<string, number> = {}, byType: Record<string, number> = {}, byKind: Record<string, number> = {};
for (const c of candidates) { byFamily[c.family] = (byFamily[c.family] ?? 0) + 1; byType[c.mbti] = (byType[c.mbti] ?? 0) + 1; byKind[c.kind] = (byKind[c.kind] ?? 0) + 1; }
const stats = { features: features.length, profiles: profiles.length, pairsScored: ranked.length, selected: candidates.length, sceneRequired: sceneN, byFamily, byType, byKind, distribution: distribution(ranked) };
writeFileSync(join(ROOT, out), JSON.stringify({ version: "fusion-candidates-v5-2", method: "cross-score rankPairs → selectTop(perFeature 3, perType limit/16+6, perFamily 25%) → 라운드로빈 배치", stats, candidates }, null, 1) + "\n");
console.log(JSON.stringify(stats, null, 1));
