/**
 * knowledge-v5 로더. 브리프 빌더(buildBrief)는 이 결과를 인자로 받는 순수 함수다.
 * 읽기·zod 검증은 여기서 한 번만 한다(프로세스 캐시). 런타임 번들링(파일 추적)은 작가 통합 단계에서 붙인다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import {
  ActionTemplateFileSchema, BadgeFileSchema, BehaviorOntologySchema, FlowRuleSchema, FusionFileSchema, GanjiEnergyFileSchema,
  MbtiFileSchema, MyeongriFileSchema, ProductNarrativesSchema, TenGodPeriodFileSchema, LoveSignalFileSchema, CareerFileSchema, CompatSceneFileSchema, CareerCatalogSchema, MaterialsFileSchema,
  type BehaviorOntology, type CareerCatalog, type CareerFile, type CompatSceneFile, type LoveSignal, type FlowRule, type FusionRule, type MbtiProfile, type MbtiType, type MyeongriFeature, type ProductNarratives,
} from "@/data/knowledge-v5/schema";

export type GanjiEnergy = z.infer<typeof GanjiEnergyFileSchema>["entries"][number];
export type TenGodPeriod = z.infer<typeof TenGodPeriodFileSchema>["entries"][number];
export type Badge = z.infer<typeof BadgeFileSchema>["badges"][number];
export type ActionTemplate = z.infer<typeof ActionTemplateFileSchema>["templates"][number];
export type ProductNarrative = ProductNarratives["products"][number];
/** P6d G: 심화 상품 재료(처음부터 작가 재료 꼴: 구·"조건 → 결과", 검사 tools/p6d/deep-check.ts). */
const DeepFileSchema = z.object({ version: z.string(), topic: z.string(), note: z.string().optional(), entries: z.array(z.object({ key: z.string(), when: z.enum(["strong", "weak", "any"]).optional(), items: z.record(z.string(), z.array(z.string())) })) });
export type DeepEntry = z.infer<typeof DeepFileSchema>["entries"][number];
/** P6d F: MBTI 장면 씨앗(유형 × 영역 30개 이상, 6~24자 명사구). rel: partner = 연인·배우자 전제, job: 직업 형태 전제. */
const SeedFileSchema = z.object({ version: z.string(), type: z.string(), seeds: z.record(z.string(), z.array(z.object({ id: z.string(), text: z.string(), rel: z.enum(["any", "partner"]).optional(), job: z.enum(["any", "employed", "business", "student"]).optional() }))) });
export type MbtiSeed = z.infer<typeof SeedFileSchema>["seeds"][string][number];

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
  /** 작가 재료(P6c A1): 원문 sha1 앞 12자 → 상황 씨앗·적용 방향·핵심 뜻. 파일이 없으면 빈 표(작가는 원문을 받는다). */
  readonly materials: ReadonlyMap<string, string>;
  /** P6d G: 심화 상품 재료(topic → 항목). 파일이 없으면 빈 표. */
  readonly deep: ReadonlyMap<string, readonly DeepEntry[]>;
  /** P6d F: MBTI 장면 씨앗(유형 → 영역 → 씨앗). */
  readonly mbtiSeeds: ReadonlyMap<string, Readonly<Record<string, readonly MbtiSeed[]>>>;
};
/** 심화 재료 한 칸: topic·key·when(없으면 any)·facet. */
export const deepLines = (k: Pick<Knowledge, "deep">, topic: string, key: string, facet: string, when: "strong" | "weak" | "any" = "any"): readonly string[] =>
  k.deep.get(topic)?.find(e => e.key === key && (e.when ?? "any") === when)?.items[facet] ?? [];

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
    materials: new Map(existsSync(join(root, "materials.json")) ? Object.entries(MaterialsFileSchema.parse(read("materials.json")).items) : []),
    deep: new Map(existsSync(join(root, "deep")) ? list("deep").map(f => { const d = DeepFileSchema.parse(read("deep", f)); return [d.topic, d.entries] as const; }) : []),
    mbtiSeeds: new Map(existsSync(join(root, "mbti-seeds")) ? list("mbti-seeds").map(f => { const d = SeedFileSchema.parse(read("mbti-seeds", f)); return [d.type, d.seeds] as const; }) : []),
  };
  cache.set(root, k);
  return k;
}
