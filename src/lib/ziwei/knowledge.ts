/**
 * ZW-1 4부 · 자미두수 지식 DB 로더(node:fs — 서버 · 개발 도구 전용). src/data/knowledge-v5/ziwei/*.json 전부를 읽어 zod로 한 번 검증하고 표로 묶는다(프로세스 캐시).
 * 한 가족이 여러 파일로 나뉜다(stars-major.json + stars-major-a1.json …, deep-myeong.json + deep-myeong-s.json …, mbti.json + mbti-c1.json …) — 폴더의 json을 모두 읽는다.
 * 표의 열쇠는 DB id에서 가족 머리(zw:star: · zw:deep: · zw-mbti: …)를 뗀 것이다: stars "jami", palaces "myeong" · "sin", deep "myeong:jami", mbti "jami:INTJ".
 * 조회(lookup.ts)는 이 결과를 인자로 받는 순수 함수다. 검사 규칙(문장 · 조건 · 수량)은 tests/unit/ziwei/dbCheck.ts가 맡고, 여기서는 스키마와 id 중복만 본다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { z } from "zod";
import {
  ZiweiDeepSchema, ZiweiEmptySchema, ZiweiFileSchema, ZiweiFiveClassSchema, ZiweiMbtiRuleSchema, ZiweiMutagenSchema, ZiweiMutagenYearSchema,
  ZiweiPairSchema, ZiweiPalaceSchema, ZiweiSceneSchema, ZiweiStageMapRowSchema, ZiweiStarSchema,
  type ZiweiDeep, type ZiweiMbtiRule, type ZiweiPalace as ZiweiPalaceEntry, type ZiweiStar,
} from "@/data/knowledge-v5/schema";

export type { ZiweiDeep, ZiweiMbtiRule, ZiweiPalaceEntry, ZiweiStar };
export type ZiweiPairEntry = z.infer<typeof ZiweiPairSchema>;
export type ZiweiEmptyEntry = z.infer<typeof ZiweiEmptySchema>;
export type ZiweiMutagenEntry = z.infer<typeof ZiweiMutagenSchema>;
export type ZiweiMutagenYear = z.infer<typeof ZiweiMutagenYearSchema>;
export type ZiweiFiveClassEntry = z.infer<typeof ZiweiFiveClassSchema>;
export type ZiweiStageMapRow = z.infer<typeof ZiweiStageMapRowSchema>;
export type ZiweiScene = z.infer<typeof ZiweiSceneSchema>;

export type ZiweiKnowledge = {
  /** 별 32(주성 · 보좌 · 살성 · 연애): 엔진 별 id → 항목. */
  readonly stars: ReadonlyMap<string, ZiweiStar>;
  /** 12궁 + 신궁("sin"). */
  readonly palaces: ReadonlyMap<string, ZiweiPalaceEntry>;
  /** 쌍성 24: 엔진 쌍성 id(앞별-뒷별) → 항목. */
  readonly pairs: ReadonlyMap<string, ZiweiPairEntry>;
  /** 공궁 빌려 읽기 규칙(zw:empty:rule). */
  readonly emptyRule: ZiweiEmptyEntry | null;
  /** 사화 4 뜻: rok · gwon · gwa · gi → 항목. */
  readonly mutagens: ReadonlyMap<string, ZiweiMutagenEntry>;
  /** 생년 사화 연간 표: 천간 → 한 줄. */
  readonly yearTable: ReadonlyMap<string, ZiweiMutagenYear>;
  /** 오행국 5: 엔진 오행국 id → 항목. */
  readonly fiveClasses: ReadonlyMap<string, ZiweiFiveClassEntry>;
  /** 심화 원고: `${궁}:${묶음}`(묶음 = 주성 id · 쌍성 id · "empty"). */
  readonly deep: ReadonlyMap<string, ZiweiDeep>;
  /** 자미 × MBTI 짝: `${주성 id}:${유형}`. */
  readonly mbti: ReadonlyMap<string, ZiweiMbtiRule>;
  /** 「같은 무대」 대응표(데이터만 — 조회에서 쓰지 않는다): 궁 id → 한 줄. */
  readonly stageMap: ReadonlyMap<string, ZiweiStageMapRow>;
  /** 읽은 파일 이름(정렬). */
  readonly files: readonly string[];
};

export const DEFAULT_ZIWEI_KNOWLEDGE_ROOT = resolve(process.cwd(), "src", "data", "knowledge-v5");
const cache = new Map<string, ZiweiKnowledge>();

type Table = "stars" | "palaces" | "pairs" | "empty" | "mutagens" | "fiveClasses" | "deep" | "mbti" | "stageMap";
/** 가족 → [항목 스키마, DB id 머리, 표]. 별 네 가족은 한 스키마 · 한 표(stars)를 쓴다. */
const FAMILY: Readonly<Record<string, readonly [z.ZodTypeAny, string, Table]>> = {
  majorStar: [ZiweiStarSchema, "zw:star:", "stars"], helperStar: [ZiweiStarSchema, "zw:star:", "stars"], maleficStar: [ZiweiStarSchema, "zw:star:", "stars"], loveStar: [ZiweiStarSchema, "zw:star:", "stars"],
  palace: [ZiweiPalaceSchema, "zw:palace:", "palaces"], starPair: [ZiweiPairSchema, "zw:pair:", "pairs"], emptyPalace: [ZiweiEmptySchema, "zw:empty:", "empty"],
  mutagen: [ZiweiMutagenSchema, "zw:mutagen:", "mutagens"], fiveClass: [ZiweiFiveClassSchema, "zw:class:", "fiveClasses"],
  deep: [ZiweiDeepSchema, "zw:deep:", "deep"], mbti: [ZiweiMbtiRuleSchema, "zw-mbti:", "mbti"], stageMap: [ZiweiStageMapRowSchema, "stage:", "stageMap"],
};

const issuesOf = (e: z.ZodError) => e.issues.slice(0, 5).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ");

/** root = knowledge-v5 폴더(brief/knowledge.ts와 같은 뿌리). 읽기 · 검증 실패는 파일 이름과 함께 오류를 낸다. */
export function loadZiweiKnowledge(root: string = DEFAULT_ZIWEI_KNOWLEDGE_ROOT): ZiweiKnowledge {
  const hit = cache.get(root);
  if (hit) return hit;
  const dir = join(root, "ziwei");
  const files = readdirSync(dir).filter(f => f.endsWith(".json")).sort();
  const tables = Object.fromEntries([...new Set(Object.values(FAMILY).map(([, , t]) => t))].map(t => [t, new Map<string, unknown>()])) as Record<Table, Map<string, unknown>>;
  const yearTable = new Map<string, ZiweiMutagenYear>();
  const seen = new Map<string, string>();
  for (const file of files) {
    let json: unknown;
    try { json = JSON.parse(readFileSync(join(dir, file), "utf8")); } catch (err) { throw new Error(`자미 DB 파일을 읽을 수 없음 ${file}: ${(err as Error).message}`); }
    const parsedFile = ZiweiFileSchema.safeParse(json);
    if (!parsedFile.success) throw new Error(`자미 DB 파일 스키마 오류 ${file}: ${issuesOf(parsedFile.error)}`);
    const { family, entries } = parsedFile.data;
    for (const raw of entries) {
      // 별 · 궁 · 쌍성 … 항목은 저마다 family를 가진다(파일 family와 같다 — dbCheck). 심화 · 짝 · 대응표는 파일 family로 본다.
      const fam = family === "deep" || family === "mbti" || family === "stageMap" ? family : String((raw as { family?: unknown }).family ?? family);
      const spec = FAMILY[fam];
      if (!spec) throw new Error(`자미 DB 가족을 모름 ${file}: ${fam}`);
      const [schema, prefix, tableName] = spec;
      const parsed = schema.safeParse(raw);
      if (!parsed.success) throw new Error(`자미 DB 항목 스키마 오류 ${file} ${String((raw as { id?: unknown }).id ?? "?")}: ${issuesOf(parsed.error)}`);
      const e = parsed.data as { id?: string; palace?: string };
      const id = fam === "stageMap" ? `stage:${e.palace}` : String(e.id);
      if (!id.startsWith(prefix)) throw new Error(`자미 DB id 머리가 가족과 다름 ${file}: ${id} (${prefix}…)`);
      const prev = seen.get(id);
      if (prev) throw new Error(`자미 DB id 중복: ${id} (${prev} · ${file})`);
      seen.set(id, file);
      tables[tableName].set(id.slice(prefix.length), parsed.data);
    }
    for (const row of parsedFile.data.yearTable ?? []) {
      if (yearTable.has(row.stem)) throw new Error(`자미 DB 사화 연간 표 중복: ${row.stem} (${file})`);
      yearTable.set(row.stem, row);
    }
  }
  const k: ZiweiKnowledge = {
    stars: tables.stars as Map<string, ZiweiStar>,
    palaces: tables.palaces as Map<string, ZiweiPalaceEntry>,
    pairs: tables.pairs as Map<string, ZiweiPairEntry>,
    emptyRule: (tables.empty.get("rule") as ZiweiEmptyEntry | undefined) ?? null,
    mutagens: tables.mutagens as Map<string, ZiweiMutagenEntry>,
    yearTable,
    fiveClasses: tables.fiveClasses as Map<string, ZiweiFiveClassEntry>,
    deep: tables.deep as Map<string, ZiweiDeep>,
    mbti: tables.mbti as Map<string, ZiweiMbtiRule>,
    stageMap: tables.stageMap as Map<string, ZiweiStageMapRow>,
    files,
  };
  cache.set(root, k);
  return k;
}
