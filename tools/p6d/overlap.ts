/**
 * P6d I: 두 종합 Book의 겹침(문장·아이디어·씨앗) 표. 장소담(P6d) ↔ 하람(P6c 종합, 년·월·일주가 같다).
 *   pnpm exec tsx tools/p6d/overlap.ts <장소담 reportId> [하람 reportId]
 * 문장 = 정규화 글자 5-gram 자카드 0.5 이상 / 20자 이어 쓴 곳. 아이디어 = 뜻을 푼 특성(feature)·같은 특성 × 같은 면(Fusion·팩폭).
 * 씨앗 = 지식 DB 장면 글(scenes)과 MBTI 장면 씨앗(seedId). 로컬 Supabase의 스냅샷만 읽는다.
 */
import { createClient } from "@supabase/supabase-js";
import { localSupabase } from "../../scripts/dev/local";
import { copyWindows, copiedWindow, overlapping } from "../../src/lib/writer/safety/lint";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";

const [sodamId, haramId = "report_8323084eccbe4533af02cf6fd8418c45"] = process.argv.slice(2);
const s = localSupabase();
const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function load(id: string) {
  const r = await db.from("paid_report_snapshots").select("snapshot_json").eq("report_id", id).single();
  const snap = r.data?.snapshot_json as { draft: V5BookDraft; evidencePacket: V5Evidence } | undefined;
  if (!snap) throw new Error(`스냅샷 없음 ${id}`);
  const sentences = snap.draft.chapters.flatMap(c => c.sections.flatMap(x => x.paragraphs.flatMap(p => splitSentences(p))));
  return { sentences, meta: snap.evidencePacket.meta, chapters: snap.draft.chapters.map(c => c.title) };
}
async function main() {
const a = await load(sodamId), b = await load(haramId);
const pairs = overlapping(b.sentences, a.sentences);
const win = copyWindows(b.sentences);
const copies = a.sentences.filter(x => copiedWindow(x, win));
const inter = (x: readonly string[] = [], y: readonly string[] = []) => x.filter(v => y.includes(v));
const explained = inter(a.meta.explained, b.meta.explained);
const scenes = inter(a.meta.scenes, b.meta.scenes);
const featA = (a.meta.ledger?.evidence ?? []).filter(x => x.startsWith("feature:")).map(x => x.slice(8));
const anglesA = a.meta.ledger?.angles ?? [];
console.log(JSON.stringify({
  sentences: { sodam: a.sentences.length, haram: b.sentences.length, jaccard05: pairs.length, examples: pairs.slice(0, 5), copy20: copies.length, copyExamples: copies.slice(0, 3) },
  ideas: { explainedShared: explained, sodamFeatures: featA.length, sodamFeaturesAlsoExplainedInHaram: inter(featA, b.meta.explained), sodamAngles: anglesA.length },
  seeds: { scenesShared: scenes.length, sceneExamples: scenes.slice(0, 5), sodamMbtiSeeds: (a.meta.ledger?.seeds ?? []).length },
  chapters: { sodam: a.chapters, haram: b.chapters },
}, null, 1));
}
main().catch(e => { console.error(e); process.exit(1); });
