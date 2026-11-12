/**
 * AM2 2부 — 장 묶음 실행(세운·대운). 책 1권 = 묶음 6개(묶음마다 호출 1회, 정상 시).
 * - 1장이 든 첫 묶음을 먼저 부르고, 첫 글자가 오면(접두부 캐시가 써진 뒤) 나머지 묶음을 속도 제한 안에서 병렬로 부른다.
 * - 묶음이 끝날 때마다 그 묶음의 장을 저장한다(대기 화면 진행률 · 「1장 먼저 읽기」). 한 장의 key 일부를 쓰는 묶음은 저장된 key와 합쳐 다시 저장한다.
 * - 이어 쓰기·회수(감독의 다음 시도): 저장된 장·key로 끝난 묶음을 알아내고 끊긴 묶음만 다시 부른다.
 */
import { parseChapters, type BookSection } from "../format";
import { chunkCall, mergeRuns, rawKey, type ChapterSink, type WriterOptions, type WriterRun } from "../runner";
import type { DraftChapter } from "../safety";
import type { WriterChapter } from "../prompt";
import type { Intake } from "./intake";
import { chunkMaxTokens, chunkUser, numberedDraft, parseReplacements, replaceMaxTokens, replaceUser, type Chunk, type ParaTarget } from "./prompt";

/** 못 끝낸 묶음을 다시 부를 때 지시 끝에 붙이는 한 줄. */
export const CHUNK_RETRY_NOTE = "(다시 부름: 앞 호출이 이 묶음을 끝내지 못했다 — 위 머리글의 장·달·해를 빠짐없이 쓴다.)";
/** 동시에 부르는 묶음 수(첫 묶음 뒤). Anthropic 분당 요청 한도 안. */
export const CHUNK_CONCURRENCY = 5;
/** 개발 실호출에서 예산 관문(대기 중 호출의 최악 비용을 미리 센다)에 맞춰 줄일 때만 AM2_CHUNK_CONCURRENCY(1~5). */
export const concurrency = () => { const v = Number(process.env.AM2_CHUNK_CONCURRENCY); return v >= 1 && v <= CHUNK_CONCURRENCY ? Math.floor(v) : CHUNK_CONCURRENCY; };
export type ChunkLog = { readonly id: string; readonly kind: "first" | "rewrite"; readonly round: number; readonly chars: number; readonly finish: string | null; readonly costUsd: number; readonly ms: number; readonly reason?: string };

/** 묶음이 쓴 원고에서 그 묶음 몫(장·key)만 꺼낸다. 장 제목은 설계 그대로. */
export function partsOf(text: string, chunk: Chunk, plan: readonly WriterChapter[]): Map<number, BookSection[]> {
  const parsed = parseChapters(text), out = new Map<number, BookSection[]>();
  for (const p of chunk.parts) {
    const ch = parsed.find(c => c.n === p.n) ?? (chunk.parts.length === 1 ? parsed[0] : undefined);
    if (!ch) continue;
    const plain = ch.sections.filter(s => s.paragraphs.length);
    if (p.keys) {
      // AM2-3 1-1: 작가는 이름(「5월 · 을사월」)으로 머리글을 쓴다 → key로 되돌린다(이름 같음 → key 같음 → 이름·key가 든 머리글, 긴 이름 먼저).
      const keys = p.keys, labels = p.labels ?? keys;
      const keyOf = (h: string) => { const t = h.trim().replace(/^\d+\.\s*/, ""); const i = labels.indexOf(t); if (i >= 0) return keys[i]; if (keys.includes(t)) return t;
        const byLen = labels.map((l, j) => [l, j] as const).sort((a, b) => b[0].length - a[0].length).find(([l]) => t.includes(l)); return byLen ? keys[byLen[1]] : keys.find(k => t.includes(k)); };
      const got = plain.map(s => ({ s, key: keyOf(s.heading) })).filter((x): x is { s: BookSection; key: string } => Boolean(x.key)).map(x => ({ ...x.s, heading: x.key }));
      if (got.length) out.set(p.n, got);
    }
    else if (plain.length && plan.some(x => x.n === p.n)) out.set(p.n, plain);
  }
  return out;
}
/** 저장된 장으로 끝난 묶음인지(장은 문단이 있고, key 묶음은 그 key가 모두 있을 때). */
export function chunkDone(chunk: Chunk, drafts: ReadonlyMap<number, DraftChapter>): boolean {
  return chunk.parts.every(p => { const d = drafts.get(p.n); if (!d) return false; return p.keys ? p.keys.every(k => d.chapter.sections.some(s => s.heading === k && s.paragraphs.length)) : d.chapter.sections.some(s => s.paragraphs.length); });
}
/** 묶음 몫을 장 원고에 합친다(key 장은 key 순서대로 합침, 이미 있는 key는 새 원고로 바꾼다). */
export function mergeParts(drafts: Map<number, DraftChapter>, got: ReadonlyMap<number, BookSection[]>, plan: readonly WriterChapter[], source: DraftChapter["source"]): number[] {
  const changed: number[] = [];
  for (const [n, sections] of got) {
    const ch = plan.find(x => x.n === n)!;
    if (ch.keys) {
      const have = new Map((drafts.get(n)?.chapter.sections ?? []).map(s => [s.heading, s] as const));
      for (const s of sections) have.set(s.heading, s);
      drafts.set(n, { chapter: { n, title: ch.title, sections: ch.keys.filter(k => have.has(k)).map(k => have.get(k)!) }, source: drafts.get(n)?.source ?? source });
    } else drafts.set(n, { chapter: { n, title: ch.title, sections }, source });
    changed.push(n);
  }
  return changed;
}

export type ChunkRunArgs = {
  readonly o: WriterOptions; readonly intake: Intake; readonly chunks: readonly Chunk[]; readonly plan: readonly WriterChapter[];
  readonly system: { readonly rules: string; readonly card: string }; readonly sink: ChapterSink;
};
/** 묶음 원고(묶음 id → 원문)와 장 원고. 저장된 장으로 이미 끝난 묶음은 부르지 않는다. */
export async function writeChunks(a: ChunkRunArgs): Promise<{ run: WriterRun | null; drafts: Map<number, DraftChapter>; texts: Map<string, string>; log: ChunkLog[] }> {
  const drafts = new Map<number, DraftChapter>(), texts = new Map<string, string>(), log: ChunkLog[] = [], runs: WriterRun[] = [];
  try { for (const s of await a.sink.load()) if (a.plan.some(p => p.n === s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 저장소가 안 되면 처음부터 */ }
  const resumed = drafts.size > 0;
  const todo = a.chunks.filter(c => !chunkDone(c, drafts));
  let stale = false;
  const system = `${a.system.rules}\n\n${a.system.card}`, parts = [a.system.rules, a.system.card];
  // 이어 쓰기: 이미 끝난 묶음의 원문(표지·키워드가 든 첫 묶음)은 원문 저장본에서 되살린다(호출 0).
  for (const c of a.chunks.filter(x => !todo.includes(x))) { try { const hit = a.o.cache ? await a.o.cache.get(rawKey(a.o.model, system, chunkUser(a.intake, c))) : null; if (hit?.text) texts.set(c.id, hit.text); } catch { /* 없으면 엔진 값 */ } }
  const one = async (c: Chunk, onFirstText?: () => void, retry = false) => {
    if (stale) return;
    const t0 = Date.now();
    // AM2-3 6-1 ②: 다시 부를 때는 지시 끝에 한 줄을 붙인다(일부만 온 원고가 원문 캐시에서 그대로 돌아오지 않게).
    const user = chunkUser(a.intake, c) + (retry ? `\n\n${CHUNK_RETRY_NOTE}` : "");
    const r = await chunkCall(a.o, undefined, { kind: "first", system, systemParts: parts, user, maxTokens: chunkMaxTokens(c, c.parts.some(p => p.n === 1)), ...(onFirstText ? { onFirstText } : {}) });
    runs.push(r.run);
    log.push({ id: c.id, kind: "first", round: retry ? 1 : 0, chars: r.text.length, finish: r.finish, costUsd: r.run.costUsd, ms: Date.now() - t0, ...(retry ? { reason: "retry_unfinished" } : {}) });
    if (!r.text) return;
    texts.set(c.id, r.text);
    const changed = mergeParts(drafts, partsOf(r.text, c, a.plan), a.plan, resumed ? "continuation" : "writer");
    for (const n of changed) { const d = drafts.get(n)!; if (!(await a.sink.save({ n, chapter: d.chapter, source: d.source }))) stale = true; }
  };
  const first = todo.find(c => c.parts.some(p => p.n === 1)) ?? todo[0];
  if (first) {
    // 첫 묶음의 첫 글자(= 접두부 캐시가 써짐) 또는 첫 묶음이 끝날 때 나머지를 띄운다.
    let release!: () => void; const warmed = new Promise<void>(r => { release = r; });
    const head = one(first, () => release()).finally(() => release());
    await warmed;
    const rest = todo.filter(c => c !== first), queue = [...rest];
    const workers = Array.from({ length: Math.min(concurrency(), queue.length) }, async () => { for (let c = queue.shift(); c; c = queue.shift()) await one(c); });
    await Promise.all([head, ...workers]);
    // AM2-3 6-1 ②(덕짱님 결정 2026-11-12): 빈 원고 재호출(chunkCall 안 1회) 뒤에도 못 끝낸 묶음(장·key가 빠짐)은 같은 시도 안에서 한 번 더.
    // 그래도 못 끝내면 빠진 자리는 결정론 채움 표시로 남고, 발행 관문(policy judgeBuild)이 보류 → 다음 시도는 임시본(OpenAI).
    const left = todo.filter(c => !chunkDone(c, drafts)), q2 = [...left];
    await Promise.all(Array.from({ length: Math.min(concurrency(), q2.length) }, async () => { for (let c = q2.shift(); c; c = q2.shift()) await one(c, undefined, true); }));
  }
  return { run: runs.length ? { ...mergeRuns(runs), ...(stale ? { stale: true } : {}) } : null, drafts, texts, log };
}

/** 걸린 묶음 다시 쓰기 1회(같은 접두부 + 앞 원고 + 걸린 문장 인용·이유). 다시 쓴 몫으로 그 묶음의 장을 바꾼다. */
export async function rewriteChunk(a: ChunkRunArgs & { readonly chunk: Chunk; readonly previous: string; readonly issues: readonly { sentence: string; reason: string }[]; readonly round: number; readonly drafts: Map<number, DraftChapter> }): Promise<{ run: WriterRun; text: string; log: ChunkLog; changed: number[] }> {
  const t0 = Date.now();
  const r = await chunkCall(a.o, undefined, { kind: "rewrite", system: `${a.system.rules}\n\n${a.system.card}`, systemParts: [a.system.rules, a.system.card], user: chunkUser(a.intake, a.chunk, { previous: a.previous, issues: a.issues }), maxTokens: chunkMaxTokens(a.chunk, a.chunk.parts.some(p => p.n === 1)) });
  const got = r.text ? partsOf(r.text, a.chunk, a.plan) : new Map<number, BookSection[]>();
  // 다시 쓴 원고가 그 묶음 몫을 다 담았을 때만 바꾼다(빠진 장·key가 있으면 앞 원고를 둔다).
  const complete = a.chunk.parts.every(p => { const s = got.get(p.n); return s && (!p.keys || p.keys.every(k => s.some(x => x.heading === k))); });
  const changed = complete ? mergeParts(a.drafts, got, a.plan, "writer") : [];
  return { run: r.run, text: complete ? r.text : "", log: { id: a.chunk.id, kind: "rewrite", round: a.round, chars: r.text.length, finish: r.finish, costUsd: r.run.costUsd, ms: Date.now() - t0, ...(complete ? {} : { reason: r.text ? "incomplete" : "empty" }) }, changed };
}

/**
 * AM2-5 2부(덕짱님 지시): 다시 쓰기 = 문단 교체. 묶음 원고를 문단 번호와 함께 보내고, 고칠 자리의 새 글만 받는다.
 * 나머지 문단은 원문 그대로 둔다(P4 세운 차단 #1·#2 — 다시 쓰기 1회차가 걸리지 않은 첫 원고 문장을 바꿨다 — 가 생길 길이 없다).
 * 받은 자리만 drafts에 넣고, 이전 글을 돌려준다(부르는 쪽이 새 차단을 만든 자리를 되돌린다).
 */
/** AM2-6 5부: lock = 사실 고정(깃발 없는 문장은 원문으로 · 사실 낱말을 잃은 교체는 받지 않는다). 받은 글을 바꿔 돌려준다. */
export type ParaLock = (t: ParaTarget, before: readonly string[], after: readonly string[]) => { paragraphs: readonly string[]; notes: readonly { at: string; kind: string; detail: string }[] };
export async function replaceParagraphs(a: ChunkRunArgs & { readonly chunk: Chunk; readonly targets: readonly ParaTarget[]; readonly round: number; readonly drafts: Map<number, DraftChapter>; readonly cover?: { line: string; reason: string }; readonly lock?: ParaLock }): Promise<{ run: WriterRun; log: ChunkLog; applied: { target: ParaTarget; before: readonly string[]; after: readonly string[] }[]; cover?: string; changed: number[]; locks: { at: string; kind: string; detail: string }[] }> {
  const t0 = Date.now();
  const user = replaceUser(a.intake, a.chunk, numberedDraft(a.intake, a.chunk, a.drafts), a.targets, a.cover);
  const r = await chunkCall(a.o, undefined, { kind: "rewrite", system: `${a.system.rules}\n\n${a.system.card}`, systemParts: [a.system.rules, a.system.card], user, maxTokens: replaceMaxTokens(a.targets) + (a.cover ? 200 : 0) });
  const got = r.text ? parseReplacements(r.text) : { paras: new Map<string, string[]>() };
  const applied: { target: ParaTarget; before: readonly string[]; after: readonly string[] }[] = [], changed = new Set<number>(), locks: { at: string; kind: string; detail: string }[] = [];
  for (const t of a.targets) {
    const neu = got.paras.get(t.id); if (!neu?.length) continue;
    const d = a.drafts.get(t.chapter); const sec = d?.chapter.sections[t.section]; if (!d || !sec || sec.heading !== t.heading) continue;
    const before = t.index === "*" ? [...sec.paragraphs] : [sec.paragraphs[t.index] ?? ""];
    let after: readonly string[] = t.index === "*" ? neu : [neu.join(" ")];
    if (a.lock) { const r0 = a.lock(t, before, after); after = r0.paragraphs; locks.push(...r0.notes); }
    if (after.join("\n") === before.join("\n")) continue;
    const paragraphs = t.index === "*" ? [...after] : sec.paragraphs.map((p0, i) => (i === t.index ? after[0] : p0));
    a.drafts.set(t.chapter, { ...d, chapter: { ...d.chapter, sections: d.chapter.sections.map((s2, si) => (si === t.section ? { ...s2, paragraphs } : s2)) } });
    applied.push({ target: t, before, after }); changed.add(t.chapter);
  }
  return { run: r.run, log: { id: a.chunk.id, kind: "rewrite", round: a.round, chars: r.text.length, finish: r.finish, costUsd: r.run.costUsd, ms: Date.now() - t0, ...(applied.length ? {} : { reason: r.text ? "no_target" : "empty" }) }, applied, ...(got.cover ? { cover: got.cover } : {}), changed: [...changed], locks };
}
