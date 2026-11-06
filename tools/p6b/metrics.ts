/**
 * P6b 자동 지표(저장된 v5 Book 기준): 분량(상품 목표 대비), 장별 비유 수, 금지어 잔여(농촌 소품·그림 별명·가족 구성원·내부 라벨·강조 기호),
 * 용어 첫 등장 형식 준수율, 소제목·문단 구조(소제목 2~3, 문단 2~3), 안전망 삭제 규칙별. 원가는 ../p6/metrics(bookMetrics).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PRODUCT_CHARS } from "../../src/lib/brief/chapters";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { FAMILY_MEMBER, RURAL_PROP, simileCount, splitSentences } from "../../src/lib/writer/safety/patterns";

const KNOW = resolve(import.meta.dirname, "../../src/data/knowledge-v5/myeongri");
const NICK = readdirSync(KNOW).flatMap(f => (JSON.parse(readFileSync(join(KNOW, f), "utf8")).features as { easyName: string }[]).map(x => x.easyName)).filter(n => n.includes(" "));

export function p6bBookMetrics(draft: V5BookDraft, e: V5Evidence) {
  const text = (c: V5BookDraft["chapters"][number]) => c.sections.flatMap(s => s.paragraphs).join("\n");
  const chars = draft.chapters.reduce((a, c) => a + text(c).length + c.sections.reduce((x, s) => x + s.heading.length, 0), 0);
  const target = PRODUCT_CHARS[draft.productType].total;
  const sentences = draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p))));
  const pairParent = e.pair?.category?.includes("부모");
  const banned = {
    rural: sentences.filter(s => RURAL_PROP.test(s)), nickname: sentences.filter(s => NICK.some(n => s.includes(n))),
    family: pairParent ? [] : sentences.filter(s => FAMILY_MEMBER.test(s)), internal: sentences.filter(s => /배지|제시되지 않|\*\*/.test(s)),
  };
  const core = draft.pairImage?.line ?? draft.coreImage?.line ?? "";
  const similes = draft.chapters.filter(c => !c.keys).map(c => ({ n: c.n, count: splitSentences(text(c)).filter(s => !core || !s.includes(core.slice(0, 8))).reduce((a, s) => a + simileCount(s), 0) }));
  const structure = draft.chapters.filter(c => !c.keys).map(c => ({ n: c.n, subheadings: c.sections.length, paragraphs: c.sections.map(s => s.paragraphs.length) }));
  const byRule = e.meta.safety.byRule;
  const p6b = e.meta.safety.metrics?.p6b;
  return {
    chars, target, inTarget: chars >= target[0] && chars <= target[1],
    similes, maxSimile: Math.max(0, ...similes.map(s => s.count)), chaptersOverSimile: similes.filter(s => s.count > 1).length,
    banned: Object.fromEntries(Object.entries(banned).map(([k, v]) => [k, v.length])), bannedSamples: Object.values(banned).flat().slice(0, 5),
    termFirst: p6b?.termFirst ?? null,
    structure, subheadingsOk: structure.filter(s => s.subheadings >= 2 && s.subheadings <= 3).length, paragraphsOk: structure.flatMap(s => s.paragraphs).filter(n => n >= 2 && n <= 3).length, sectionsTotal: structure.flatMap(s => s.paragraphs).length,
    byRule, coreImage: core, edition: draft.edition?.label ?? null,
  };
}
