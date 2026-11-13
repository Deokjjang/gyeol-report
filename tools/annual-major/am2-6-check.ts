/**
 * AM2-6 8부 2,010명 검사(호출 0): 개발 세트 10명 + 무작위 세운·대운 각 1,000명(seed 7 — AM2-4 · AM2-5와 같은 입력). 모두 0이어야 한다.
 *   ① 근거 없는 고리 재료(verifyLinks — 엔진 값 · 입력 출처 · 입력 조건 · 바람 고리 밖 바람)
 *   ② 씨앗 조건 · 영역 위반(씨앗 꼬리표 ↔ 입력 · key 장면 영역 ⊂ key 영역 · 장 · 절 장면도 꼬리표)
 *   ③ 카드 줄 조건 꼴(연애 조건 꼴이 입력에 맞게 바뀌었는지 · 직장인이 아닌데 직장 전제 말)
 *   ④ 이유 없는 짝(잇는 이유 공통 · 보완 · 긴장이 없거나 「같은 나이대」만인 짝)
 *   ⑤ 카드 같은 글 줄(Y · M · I 뜻 글이 같은 줄이 두 장 이상에 남음)
 *   ⑥ 카드 ≡ 엔진(briefCheck — cardEngineIssues · 충돌 빌드 포함)
 *   ⑦ 옮겨 쓸 엔진 말이 검사에 걸림(P6 annual-1: 고리 재료 예시 「6월과 같은 …」 · 가리키기 「1장에서 본 2월·7월」 — 작가가 그대로 옮기면 calendar_month · chapter_ref)
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-check.ts [--random 1000] [--seed 7]
 */
import { cases } from "./final";
import { intakeOf, randomPayload } from "./am2-brief";
import { verifyLinks } from "../../src/lib/writer/chunked/link";
import { briefCheck } from "../../src/lib/writer/chunked/check";
import { briefCtxFor } from "../../src/lib/writer/chunked/publish";
import { safetyFacts } from "../../src/lib/writer/safety";
import { EMPLOYEE_PREMISE, seedTagsFit, seedTagsOf } from "../../src/lib/writer/chunked/card";
import { calendarMonth, CHAPTER_REF } from "../../src/lib/writer/safety/p6d";

const argv = process.argv.slice(2);
const N = argv.includes("--random") ? Number(argv[argv.indexOf("--random") + 1]) : 1000, seed = argv.includes("--seed") ? Number(argv[argv.indexOf("--seed") + 1]) : 7;
const T = { people: 0, rejected: 0, keys: 0, links: 0, wish: 0, seeds: 0, pairs: 0, ownKeys: 0, sceneKeys: 0 };
const bad: Record<string, number> = { link: 0, seed: 0, cardCond: 0, pairReason: 0, sameText: 0, engine: 0, copy: 0 };
const samples: Record<string, string[]> = {};
const note = (k: string, s: string) => { bad[k]++; const list = (samples[k] ??= []); if (list.length < 8) list.push(s); };
const run = (who: string, payload: unknown) => {
  let r: ReturnType<typeof intakeOf>;
  try { r = intakeOf(payload); } catch (e) { if (/Uncertain|시각|birth/i.test(String(e))) { T.rejected++; return false; } throw e; }
  const { brief, intake } = r, f = brief.person.facts, keys = intake.chapters.flatMap(ch => ch.keys ?? []);
  T.people++; T.keys += keys.length;
  for (const k of keys) { T.links += (k.links ?? []).length; if (k.wishLink) T.wish++; if ((k.links ?? []).some(l => l.kind === "seat") || k.pair) T.ownKeys++; if (k.scene) T.sceneKeys++; }
  // ①
  for (const v of verifyLinks(brief, keys)) note("link", `${who} ${v}`);
  // ②
  const scenes = [...keys.flatMap(k => (k.scene ? [{ at: k.label, s: k.scene, area: k.sceneArea, areas: k.areas }] : [])), ...intake.chapters.flatMap(c => [...(c.scenes ?? []), ...(c.sections ?? []).flatMap(sp => (sp.scene ? [sp.scene] : []))].map(s => ({ at: `${c.n}장`, s, area: undefined, areas: undefined })))];
  for (const sc of scenes) { T.seeds++; if (!seedTagsFit(seedTagsOf(sc.s), f)) note("seed", `${who} ${sc.at} 조건(${seedTagsOf(sc.s).join(",")}): ${sc.s}`); if (sc.areas && (!sc.area || !sc.areas.includes(sc.area))) note("seed", `${who} ${sc.at} 영역 ${sc.area} ∉ ${sc.areas.join(",")}: ${sc.s}`); }
  // ③
  for (const l of intake.lines) { const t = `${l.value} ${l.meaning}`;
    if ((f.relationship === "dating" || f.relationship === "married") && /(만나는|함께하는|사귀는) 사람이 있다면/.test(t)) note("cardCond", `${who} ${l.id} ${f.relationship}: ${t.slice(0, 120)}`);
    if (f.relationship === "single" && /(만나는|사귀는) 사람이 있다면/.test(t)) note("cardCond", `${who} ${l.id} single: ${t.slice(0, 120)}`);
    if (f.job.status !== "employee" && l.subject !== "mbti" && EMPLOYEE_PREMISE.test(t)) note("cardCond", `${who} ${l.id} ${f.job.status}: ${t.slice(0, 120)}`); }
  // ④
  for (const p of intake.pairs) { T.pairs++; if (!/^(공통|보완|긴장)$/.test(p.reason ?? "") || /같은 나이대/.test(p.why)) note("pairReason", `${who} ${p.id} ${p.reason}: ${p.why.slice(0, 100)}`); }
  // ⑤
  const used = (id: string) => intake.chapters.filter(c => [...(c.sections ?? []).flatMap(s2 => s2.lines), ...(c.keys ?? []).flatMap(k2 => k2.lines)].includes(id)).map(c => c.n);
  const groups = new Map<string, string[]>();
  for (const l of intake.lines) { if (!/^(year|month|input)$/.test(l.subject) || /이름과 핵심어만|화면에 있음|머리 문장에 있음|가리키기|이 시기가 속한 대운/.test(l.meaning)) continue; const nm = (l.meaning || l.value).replace(/[^가-힣]/g, ""); if (nm.length >= 12) groups.set(nm, [...(groups.get(nm) ?? []), l.id]); }
  for (const ids of groups.values()) { if (new Set(ids).size < 2) continue; const chs = new Set(ids.flatMap(used)); const inKeys = ids.filter(id => keys.some(k => k.lines.includes(id))); if (chs.size >= 2 && inKeys.length) note("sameText", `${who} ${ids.join("=")} 장 ${[...chs].join(",")}`); }
  // ⑥
  for (const i of briefCheck(intake, safetyFacts(brief).nicknames ?? [], briefCtxFor(brief))) note("engine", `${who} [${i.rule}] ${i.where}: ${i.text.slice(0, 120)}`);
  // ⑦ 작가가 그대로 옮길 엔진 말: 고리 재료 안 「…」 예시 · 바람 고리 · 가리키기 말 · 머리 문장.
  const annual = brief.product === "annual_fortune";
  const copies = [...keys.flatMap(k => [...(k.links ?? []).flatMap(l => [...l.text.matchAll(/「([^」]+)」/g)].map(m => ({ at: `${k.label} 고리`, s: m[1] }))), ...(k.wishLink ? [{ at: `${k.label} 바람 고리`, s: k.wishLink }] : []), { at: `${k.label} 머리`, s: k.head }]),
    ...intake.chapters.flatMap(c => (c.sections ?? []).flatMap(sp => (sp.pointer ? [{ at: `${c.n}장 가리키기`, s: sp.pointer }] : [])))];
  for (const x of copies) { const s = x.s.replace(/〈[^〉]*〉/g, ""); if (CHAPTER_REF.test(s) || (annual && calendarMonth(s))) note("copy", `${who} ${x.at}: ${x.s.slice(0, 120)}`); }
  return true;
};
for (const c of cases().filter(x => x.product !== "launch")) run(c.id, c.payload);
for (const prod of ["annual_fortune", "major_fortune"] as const) { let ok = 0; for (let i = 0; ok < N; i++) if (run(`${prod}#${i}`, randomPayload(i, prod, seed))) ok++; }
console.log(`검사 ${T.people}명(만세력이 받지 않는 출생 시각 ${T.rejected}명은 다음 입력으로 채움) · key ${T.keys} · 고리 재료 ${T.links} · 바람 고리 key ${T.wish} · 장면 ${T.seeds} · 짝 ${T.pairs} · 고리(자리)·짝 key ${(100 * T.ownKeys / T.keys).toFixed(1)}% · 장면 key ${(100 * T.sceneKeys / T.keys).toFixed(1)}%`);
console.log(`① 근거 없는 고리 재료 ${bad.link} · ② 씨앗 조건·영역 ${bad.seed} · ③ 카드 줄 조건 꼴 ${bad.cardCond} · ④ 이유 없는 짝 ${bad.pairReason} · ⑤ 카드 같은 글 ${bad.sameText} · ⑥ 카드 ≡ 엔진·브리프 ${bad.engine} · ⑦ 옮겨 쓸 엔진 말 검사 걸림 ${bad.copy}`);
for (const [k, ss] of Object.entries(samples)) for (const s of ss) console.log(`- [${k}] ${s}`);
