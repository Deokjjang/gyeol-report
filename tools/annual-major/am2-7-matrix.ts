/**
 * AM2-7 2부 5 입력 행렬 시험(호출 0): 입력 축(일 7 · 관계 4) × MBTI(16 + 없음) × 시각(앎 · 대략 · 모름) × 바람(있음 · 없음) × 상품(세운 · 대운) × 표본 원국 6을
 * 모든 두 값 조합이 한 번 이상 나오게(짝 덮기, 탐욕법) 고른 사례로 돌린다. 브리프(묶음 지시) · 카드 · 설계도 · 화면 문구에 입력과 맞지 않는 전제 낱말이 나오면 실패다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-7-matrix.ts [--list 20]
 * 자녀 · 사는 곳은 주문 입력 칸이 없어 늘 「없음」이다(행렬 축이지만 값이 하나). 작가 규칙(금지 문장)과 고객이 적은 바람 원문은 보지 않는다.
 * 같은 파일을 옛 코드 worktree에 넣어 돌리면 「고치기 전」 수가 나온다(낱말표는 이 파일이 가진 premise.ts).
 */
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { kstDate, writerKnowledge } from "../../src/lib/writer/publish";
import { buildIntake } from "../../src/lib/writer/chunked/intake";
import { chunkPlan, chunkUser, renderCard } from "../../src/lib/writer/chunked/prompt";
import { inputsOf, premiseHits } from "../../src/lib/brief/premise";
import { payloadOf } from "./mockRun";

const AT = "2026-12-02T03:00:00.000Z";
const F = {
  product: ["annual_fortune", "major_fortune"] as const,
  job: ["employee", "self_employed", "freelancer", "student", "job_seeker", "unemployed", ""] as const,
  rel: ["single", "dating", "married", ""] as const,
  mbti: ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ", ""] as const,
  time: ["exact", "approx", "unknown"] as const,
  wish: ["yes", "no"] as const,
  chart: [["1998-03-14", "09:30", "FEMALE"], ["1987-03-06", "08:10", "FEMALE"], ["1971-08-29", "13:20", "MALE"], ["2005-06-18", "15:10", "FEMALE"], ["1979-02-21", "06:40", "MALE"], ["1992-11-02", "22:45", "MALE"]] as const,
};
/** 표본 원국 6(AM2-8 화면 행렬 시험 tests/unit/brief/am28-screen.test.ts도 같은 표본을 쓴다). */
export const MATRIX_CHARTS = F.chart;
type Case = { [K in keyof typeof F]: number };
const KEYS = Object.keys(F) as (keyof typeof F)[];
/** 짝 덮기(탐욕법): 아직 안 덮인 두 값 조합을 가장 많이 덮는 사례를 차례로 고른다. */
export function pairwise(): Case[] {
  const need = new Set<string>();
  for (let i = 0; i < KEYS.length; i++) for (let j = i + 1; j < KEYS.length; j++) for (let a = 0; a < F[KEYS[i]].length; a++) for (let b = 0; b < F[KEYS[j]].length; b++) need.add(`${i}:${a}|${j}:${b}`);
  const out: Case[] = [];
  const cover = (c: Case) => { const got: string[] = []; for (let i = 0; i < KEYS.length; i++) for (let j = i + 1; j < KEYS.length; j++) { const k = `${i}:${c[KEYS[i]]}|${j}:${c[KEYS[j]]}`; if (need.has(k)) got.push(k); } return got; };
  let seed = 1; const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) >>> 0; return seed % n; };
  while (need.size) {
    // 안 덮인 조합 하나를 고정하고 나머지를 무작위 후보 60개 가운데 가장 많이 덮는 것으로.
    const first = [...need][0].split("|").map(x => x.split(":").map(Number));
    let best: Case | null = null, bestN = -1;
    for (let t = 0; t < 60; t++) { const c = Object.fromEntries(KEYS.map(k => [k, rnd(F[k].length)])) as Case; c[KEYS[first[0][0]]] = first[0][1]; c[KEYS[first[1][0]]] = first[1][1]; const n = cover(c).length; if (n > bestN) { best = c; bestN = n; } }
    for (const k of cover(best!)) need.delete(k); out.push(best!);
  }
  return out;
}
const slotKo = (v: string) => ({ JINSI: "진시", SASI: "사시", OSI: "오시" } as Record<string, string>)[v] ?? v;
function payloadOfCase(c: Case) {
  const [birthDate, birthTime, gender] = F.chart[c.chart];
  const product = F.product[c.product], wish = F.wish[c.wish] === "yes" && product === "annual_fortune" ? "2027년에는 일도 연애도 잘 풀리고 건강하게 지내고 싶어요" : undefined;
  const base = payloadOf(product, { name: "가상행렬", birthDate, birthTime, gender, mbti: F.mbti[c.mbti], job: F.job[c.job], rel: F.rel[c.rel], ...(wish ? { wish } : {}), unknown: F.time[c.time] === "unknown" }) as unknown as { person: Record<string, unknown> };
  if (F.time[c.time] !== "approx") return base;
  return { ...base, person: { ...base.person, birthTime: "", birthTimeUnknown: false, birthTimePrecision: "approximate", approximateBirthTimeSlot: "JINSI" } };
}
/** 한 사례의 글(출처별). 작가 규칙과 바람 원문은 뺀다. */
export function textsOf(payload: unknown): { where: string; text: string }[] | null {
  const { k } = writerKnowledge();
  let brief;
  try { brief = buildBrief(payloadToBriefInput(payload as never, kstDate(AT), AT) as never, k); } catch (e) { if (/Uncertain|시각|birth|Dayun/i.test(String(e))) return null; throw e; }
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const pr = (payload as { person?: { approximateBirthTimeSlot?: string; birthTimePrecision?: string } }).person;
  const intake = (buildIntake as (...a: unknown[]) => ReturnType<typeof buildIntake>)(brief, k, plan, (payload as { productOptions?: { wish?: string } }).productOptions?.wish, pr?.birthTimePrecision === "approximate" && pr.approximateBirthTimeSlot ? { timeSlot: slotKo(pr.approximateBirthTimeSlot) } : {});
  const card = renderCard(intake), cut = card.indexOf("# 책 설계도");
  const out: { where: string; text: string }[] = [];
  const add = (where: string, t: string | undefined | null) => { if (t) for (const line of t.split("\n")) if (line.trim() && !/^- 적어 준 바람/.test(line)) out.push({ where, text: line }); };
  add("카드", card.slice(0, cut)); add("설계도", card.slice(cut));
  for (const ch of chunkPlan(intake)) add(`브리프 ${ch.id}`, chunkUser(intake, ch));
  const tl = brief.timeline;
  for (const e of tl?.entries ?? []) { add(`화면 ${e.key} 할 일`, e.todo); add(`화면 ${e.key} 돌아보기`, e.review); add(`화면 ${e.key} 살필 점`, e.caution); add(`화면 ${e.key} 좋은 것`, (e as { good?: string }).good); add(`화면 ${e.key} 그림`, e.imageLine); add(`화면 ${e.key} 열쇠말`, e.keywords.join(" · ")); for (const b of e.badges) add(`화면 ${e.key} 배지`, b.line); }
  for (const [tg, v] of Object.entries(tl?.tenGodNotes ?? {})) { add(`화면 십성 뜻 ${tg}`, v.meaning); add(`화면 십성 살필 ${tg}`, v.caution); }
  for (const c of tl?.lifetime ?? []) add("화면 평생 대운", `${c.theme ?? ""}`);
  return out.map(x => ({ ...x, f: brief.person.facts })) as never;
}

if (process.argv[1]?.endsWith("am2-7-matrix.ts")) {
  const list = process.argv.includes("--list") ? Number(process.argv[process.argv.indexOf("--list") + 1]) : 12;
  const cases = pairwise();
  let run = 0, skipped = 0, viol = 0, texts = 0; const byWord: Record<string, number> = {}, byWhere: Record<string, number> = {}, samples: string[] = [];
  for (const c of cases) {
    const p = payloadOfCase(c), ts = textsOf(p) as unknown as ({ where: string; text: string; f: Parameters<typeof inputsOf>[0] }[] | null);
    if (!ts) { skipped++; continue; }
    run++; texts += ts.length;
    for (const t of ts) { const hits = premiseHits(t.text, inputsOf(t.f)); if (!hits.length) continue; viol++;
      for (const h of hits) byWord[h.word] = (byWord[h.word] ?? 0) + 1; const w = t.where.replace(/ \d{4}(-M\d\d)?/, "").replace(/ c\d$/, ""); byWhere[w] = (byWhere[w] ?? 0) + 1;
      if (samples.length < list) samples.push(`[${F.product[c.product].slice(0, 5)} 일=${F.job[c.job] || "없음"} 관계=${F.rel[c.rel] || "없음"} ${F.mbti[c.mbti] || "MBTI없음"} ${F.time[c.time]}] ${t.where} · ${hits.map(h => h.word).join(",")} · ${t.text.slice(0, 140)}`); }
  }
  console.log(`사례 ${cases.length}(짝 덮기) · 돌림 ${run} · 만세력이 받지 않아 건너뜀 ${skipped} · 글 줄 ${texts} · 위반 줄 ${viol}`);
  console.log(`낱말별: ${Object.entries(byWord).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${w} ${n}`).join(" · ") || "없음"}`);
  console.log(`자리별: ${Object.entries(byWhere).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${w} ${n}`).join(" · ") || "없음"}`);
  for (const s of samples) console.log(`- ${s}`);
}
