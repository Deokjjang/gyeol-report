/**
 * knowledge-v5 로더. 브리프 빌더(buildBrief)는 이 결과를 인자로 받는 순수 함수다.
 * 읽기·zod 검증은 여기서 한 번만 한다(프로세스 캐시). 런타임 번들링(파일 추적)은 작가 통합 단계에서 붙인다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import {
  ActionTemplateFileSchema, BadgeFileSchema, BehaviorOntologySchema, FlowRuleSchema, FusionFileSchema, GanjiEnergyFileSchema,
  MbtiFileSchema, MyeongriFileSchema, ProductNarrativesSchema, TenGodPeriodFileSchema, LoveSignalFileSchema, CareerFileSchema, CompatSceneFileSchema, CareerCatalogSchema,
  type BehaviorOntology, type CareerCatalog, type CareerFile, type CompatSceneFile, type LoveSignal, type FlowRule, type FusionRule, type MbtiProfile, type MbtiType, type MyeongriFeature, type ProductNarratives,
} from "@/data/knowledge-v5/schema";

export type GanjiEnergy = z.infer<typeof GanjiEnergyFileSchema>["entries"][number];
export type TenGodPeriod = z.infer<typeof TenGodPeriodFileSchema>["entries"][number];
export type Badge = z.infer<typeof BadgeFileSchema>["badges"][number];
export type ActionTemplate = z.infer<typeof ActionTemplateFileSchema>["templates"][number];
export type ProductNarrative = ProductNarratives["products"][number];

export type Knowledge = {
  readonly features: ReadonlyMap<string, MyeongriFeature>;
  readonly mbti: ReadonlyMap<MbtiType, MbtiProfile>;
  readonly fusionByFeature: ReadonlyMap<string, readonly FusionRule[]>;
  readonly ganji: ReadonlyMap<string, GanjiEnergy>;
  readonly tenGodPeriod: ReadonlyMap<string, TenGodPeriod>;
  readonly badges: readonly Badge[];
  readonly flowRule: FlowRule;
  readonly actions: readonly ActionTemplate[];
  readonly narratives: ReadonlyMap<string, ProductNarrative>;
  readonly ontology: BehaviorOntology;
  /** 연애 신호(P3.7 1-4): key(tenGod:…·shinsal:…·mbti:…) → 호감 표현·연락 패턴·밀당. */
  readonly loveSignals: ReadonlyMap<string, LoveSignal>;
  /** 구체 직무명 추천·지금 직업 적합도(P3.7 1-4). */
  readonly career: CareerFile;
  /** 직무 카탈로그(P3.8 2): 묶음·인접 묶음·직무별 십성 묶음·행동 차원·생활 단계. */
  readonly catalog: CareerCatalog;
  /** 궁합 관계 유형별 생활 주제·장면(P3.8 3). */
  readonly compatScenes: CompatSceneFile;
};

export const DEFAULT_KNOWLEDGE_ROOT = resolve(process.cwd(), "src", "data", "knowledge-v5");
const cache = new Map<string, Knowledge>();

export function loadKnowledge(root: string = DEFAULT_KNOWLEDGE_ROOT): Knowledge {
  const hit = cache.get(root);
  if (hit) return hit;
  const read = (...p: string[]) => JSON.parse(readFileSync(join(root, ...p), "utf8"));
  const list = (dir: string) => readdirSync(join(root, dir)).filter(f => f.endsWith(".json")).sort();
  const features = new Map<string, MyeongriFeature>();
  for (const f of list("myeongri")) for (const x of MyeongriFileSchema.parse(read("myeongri", f)).features) features.set(x.id, x);
  const mbti = new Map<MbtiType, MbtiProfile>();
  for (const f of list("mbti")) for (const p of MbtiFileSchema.parse(read("mbti", f)).profiles) mbti.set(p.type, p);
  const fusionByFeature = new Map<string, FusionRule[]>();
  for (const f of list("fusion")) for (const r of FusionFileSchema.parse(read("fusion", f)).rules) fusionByFeature.set(r.myeongriId, [...(fusionByFeature.get(r.myeongriId) ?? []), r]);
  const k: Knowledge = {
    features, mbti, fusionByFeature,
    ganji: new Map(GanjiEnergyFileSchema.parse(read("timeline", "ganji.json")).entries.map(e => [e.ganji, e])),
    tenGodPeriod: new Map(TenGodPeriodFileSchema.parse(read("timeline", "ten-god-period.json")).entries.map(e => [e.tenGod, e])),
    badges: BadgeFileSchema.parse(read("timeline", "badges.json")).badges,
    flowRule: FlowRuleSchema.parse(read("timeline", "flow-rule.json")),
    actions: ActionTemplateFileSchema.parse(read("timeline", "action-templates.json")).templates,
    narratives: new Map(ProductNarrativesSchema.parse(read("product-narratives.json")).products.map(p => [p.productKey, p])),
    ontology: BehaviorOntologySchema.parse(read("behavior-ontology.json")),
    loveSignals: new Map(LoveSignalFileSchema.parse(read("love", "signals.json")).entries.map(e => [e.key, e])),
    career: CareerFileSchema.parse(read("career", "jobs.json")),
    catalog: CareerCatalogSchema.parse(read("career", "catalog.json")),
    compatScenes: CompatSceneFileSchema.parse(read("compat", "scenes.json")),
  };
  cache.set(root, k);
  return k;
}
