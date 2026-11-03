/**
 * 작가 재료(P6c A1). 브리프는 결정론 작가·부록을 위해 지식 DB 원문 문장을 그대로 들고 있고, 작가에게 보낼 때만 원문을 재료로 바꾼다.
 * 재료 표 = knowledge-v5/materials.json(원문 sha1 앞 12자 → 상황 씨앗·적용 방향·핵심 뜻, tools/p6c/seeds가 만든다).
 * 브리프 문자열이 원문을 통째로 품고 있으면(근거 사실처럼 이어 붙인 줄도) 그 부분만 바꾼다. 원문의 한 문장만 옮긴 곳도 그 원문의 재료로 바꾼다. 재료가 없는 원문은 그대로 둔다.
 */
import { createHash } from "node:crypto";
import type { Knowledge } from "@/lib/brief/knowledge";
import { splitSentences } from "@/lib/writer/safety/patterns";

export const materialKey = (text: string) => createHash("sha1").update(text).digest("hex").slice(0, 12);
export type MaterialTable = { readonly exact: ReadonlyMap<string, string>; readonly byHead: ReadonlyMap<string, readonly (readonly [string, string])[]>; readonly plain: ReadonlyMap<string, string> };
const HEAD = 10;

/** 재료가 있는 지식 DB 원문 전체(tools/p6c/seeds/rules.ts의 변환 대상과 같은 필드). */
export function* dbTexts(k: Knowledge): Generator<string> {
  type Scene = { text: string };
  const scenes = function* (l: readonly Scene[] | undefined) { for (const s of l ?? []) yield s.text; };
  for (const f of k.features.values()) {
    for (const l of Object.values(f.scenes)) yield* scenes(l);
    yield f.life; yield f.shadow; yield f.meaning; yield* Object.values(f.forYou); yield* f.strengths; yield* f.overuse;
    // strengthRules.rule은 계산식 메모(작가에게 가지 않음).
    for (const key of ["strong", "weak", "duplicate", "clash"] as const) { const v = f.strengthRules[key]; if (v) yield v; }
    yield* Object.values(f.positionNuance ?? {});
    // MBTI 연결 이유(mbtiLinks.why)는 20~30자 한 줄이라 재료로 바꾸지 않는다.
    if (f.remedy) yield* f.remedy.partner;
  }
  for (const p of k.mbti.values()) {
    for (const l of Object.values(p.signals)) yield* scenes(l);
    for (const c of p.cognitiveFunctions) yield c.easy;
    yield* p.shadows; yield p.oneLiner; for (const c of p.conventionalCompat) yield c.why;
  }
  for (const rules of k.fusionByFeature.values()) for (const r of rules) { yield r.why; if (r.scene) yield r.scene.text; }
  for (const t of k.compatScenes.types) for (const topic of t.topics) yield* scenes(topic.scenes);
  for (const e of k.loveSignals.values()) for (const a of [e.crush, e.contact, e.pushPull]) { yield a.line; yield* scenes(a.scenes); }
  for (const e of k.tenGodPeriod.values()) for (const x of [e.year, e.month]) { yield x.meaning; yield x.action; yield* scenes(x.scenes); }
  for (const g of k.ganji.values()) { yield g.year.action; yield g.month.action; }
  for (const t of k.actions) yield* t.text;
  for (const j of k.catalog.jobs) yield j.why;
}

const cache = new WeakMap<Knowledge, MaterialTable>();
export function materialTable(k: Knowledge): MaterialTable {
  const hit = cache.get(k); if (hit) return hit;
  const exact = new Map<string, string>(), plain = new Map<string, string>();
  for (const text of dbTexts(k)) {
    if (!text || text.length < HEAD || exact.has(text)) continue;
    const m = k.materials.get(materialKey(text)); if (!m) continue;
    // MBTI 기능은 "쉬운 이름 | 방향": 원문 자리에는 방향만, 쉬운 이름은 따로(기능 목록을 만들 때 쓴다).
    const [a, b] = m.split("|").map(x => x.trim());
    if (b) { exact.set(text, b); plain.set(text, a); } else exact.set(text, m);
  }
  const byHead = new Map<string, [string, string][]>();
  const put = (text: string, mat: string) => { const h = text.slice(0, HEAD); const l = byHead.get(h); if (l) l.push([text, mat]); else byHead.set(h, [[text, mat]]); };
  for (const [text, mat] of exact) put(text, mat);
  // 브리프가 원문 일부만 옮긴 경우(첫 문장, 출처 문장을 뺀 나머지)도 문장 단위로 그 원문의 재료로 바꾼다. 긴 일치(원문 전체)가 먼저.
  for (const [text, mat] of exact) { const ss = splitSentences(text); if (ss.length > 1) for (const x of ss) if (x.length >= HEAD * 2 && !exact.has(x)) put(x, mat); }
  for (const l of byHead.values()) l.sort((a, b) => b[0].length - a[0].length);
  const t = { exact, byHead, plain };
  cache.set(k, t);
  return t;
}

/** 문자열 하나: 통째로 원문이면 재료, 원문을 품고 있으면 그 부분만 재료로. */
export function swapMaterials(s: string, t: MaterialTable): string {
  const whole = t.exact.get(s); if (whole) return whole;
  if (s.length < HEAD) return s;
  let out = "", i = 0;
  while (i < s.length) {
    const cands = i + HEAD <= s.length ? t.byHead.get(s.slice(i, i + HEAD)) : undefined;
    const hit = cands?.find(([text]) => s.startsWith(text, i));
    // 같은 원문의 문장이 이어 나오면 재료는 한 번만.
    if (hit) { if (!out.trimEnd().endsWith(hit[1])) out += hit[1]; else out = out.trimEnd(); i += hit[0].length; } else { out += s[i]; i++; }
  }
  return out;
}

/** 객체 전체(작가 입력)를 걸으며 문자열을 바꾼다. 원본은 건드리지 않는다. */
export function swapDeep<T>(o: T, t: MaterialTable): T {
  if (typeof o === "string") return swapMaterials(o, t) as T;
  if (Array.isArray(o)) return o.map(x => swapDeep(x, t)) as T;
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, swapDeep(v, t)])) as T;
  return o;
}
