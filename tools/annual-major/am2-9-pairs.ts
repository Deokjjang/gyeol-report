/**
 * AM2-9 4부 세운 브리프 반대 재료 쌍 전수 시험(호출 0) — 지금 트리(cwd)의 코드로, 꼬리표는 TAGS 경로(작업 트리의 annual-tags.json)로 잰다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-9-pairs.ts <out.json> src/lib/brief/design/annual-tags.json [--random 1000]  (옛 트리와 맞대려면 그 트리에서 이 파일 경로로 돌린다)
 * ① 달 × 영역 방향(정답 = 엔진 칩 signals): 칸 ↑에 살필 뜻 · 칸 ↓에 좋은 뜻 · 「→ 처방」 꼬리 · 무리 말 ↔ 무리하기 쉬운 달 목록 · 넓히기 말 ↔ 늦출 달.
 * ② 성격 차원(꼬리표 줄만): 같은 해(해 근거 전부) · 같은 달(그 달 두 줄) 안 같은 차원 반대 끝 · 성격표(profilePoles) 반대.
 * ③ 작가 입력: 고리 재료 「이 책 N번째 · 처음」 · 카드 줄 처방 꼬리 · 짝 없는 key의 MBTI 장면 씨앗. ④ 뺀 줄(정리 기록, 권당 16).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const TREE = process.cwd(), [OUT, TAGS] = process.argv.slice(2), RN = process.argv.includes("--random") ? Number(process.argv[process.argv.indexOf("--random") + 1]) : 1000;
type Tag = { k: string; d: [string, 1 | -1, number][]; dir?: string };
const T: Record<string, Tag> = JSON.parse(readFileSync(TAGS, "utf8")).items;
const mean = (s: string) => s.split(" → ")[0].trim();
const tag = (s: string) => T[mean(s)];
const dims = (s: string) => { const t = tag(s); return t && ["trait", "situ", "flow"].includes(t.k) ? t.d : []; };
void (async () => {
  const imp = (p: string) => import(join(TREE, p));
  const { intakeOf, randomPayload } = await imp("tools/annual-major/am2-brief.ts");
  const { payloadFor } = await imp("tools/annual-major/am2-6-books.ts");
  const { chunkPlan, chunkUser, renderCard } = await imp("src/lib/writer/chunked/prompt.ts");
  const { writerKnowledge } = await imp("src/lib/writer/publish.ts");
  const { profileCodes } = await imp("src/lib/brief/pairProfile.ts");
  const { profilePoles } = await imp("src/lib/writer/safety/contradiction.ts");
  let tidyLog: { last?: { drops: { at: string; text: string; why: string }[]; over: { at: string; text: string; why: string }[] } } | undefined;
  try { tidyLog = (await imp("src/lib/brief/design/annual.ts")).annualTidyLog; } catch { /* 옛 트리 */ }
  const { k } = writerKnowledge();
  const tips = new Set<string>(); for (const e of k.deep.get("annual-domain") ?? []) for (const xs of Object.values(e.items) as string[][]) for (const s of xs) if (s.includes(" → ")) tips.add(s.split(" → ")[1].trim());
  for (const tp of ["annual-situation", "annual-mbti", "year-energy"]) for (const e of k.deep.get(tp) ?? []) for (const xs of Object.values(e.items) as string[][]) for (const s of xs) if (s.includes(" → ")) tips.add(s.split(" → ")[1].trim());
  const rows: unknown[] = []; const sum: Record<string, number> = {};
  const bump = (kk: string, n = 1) => { sum[kk] = (sum[kk] ?? 0) + n; };
  const people: [string, unknown][] = [["annual-p6b", payloadFor("annual-p6b")], ["annual-1", payloadFor("annual-1")], ["annual-p5", payloadFor("annual-p5")], ["annual-p6a", payloadFor("annual-p6a")]];
  for (let i = 0; i < RN + 40; i++) people.push([`r${i}`, randomPayload(i, "annual_fortune", 7)]);
  let n = 0, rejected = 0, maxDrops = 0;
  for (const [who, payload] of people) {
    if (who.startsWith("r") && n >= 4 + RN) break;
    let built; try { built = intakeOf(payload); } catch (e) { if (/UncertainBirthTimeError/.test(String(e))) { rejected++; continue; } bump("error"); continue; }
    n++;
    const { brief, plan, intake } = built;
    const months = (brief.timeline?.entries ?? []).filter((e: { kind: string; bridge?: boolean }) => e.kind === "month");
    const sig = new Map(months.map((e: { key: string; signals?: Record<string, string>; label: string }) => [e.key, e]));
    const KO: Record<string, string> = { 연애: "love", 돈: "money", 일: "work", 사람: "people", 마음: "mind" };
    const mindDown = new Set(months.filter((e: { signals?: Record<string, string> }) => e.signals?.mind === "↓").map((e: { key: string }) => e.key));
    const hits: { dim: string; at: string; a: string; b?: string; why: string }[] = [];
    // ① 달
    const monthEv = new Map<string, string[]>(); const walkM = (o: unknown) => { if (Array.isArray(o)) o.forEach(walkM); else if (o && typeof o === "object") { const r = o as { kind?: string; key?: string; facts?: string[] }; if (r.kind === "evidence" && r.facts && /^month:/.test(r.key ?? "")) monthEv.set(r.key!.slice(6), r.facts); Object.values(r).forEach(walkM); } };
    walkM(plan); walkM(brief.chapters);
    for (const [key, facts] of monthEv) {
      const e = sig.get(key) as { signals?: Record<string, string>; label: string } | undefined; if (!e?.signals) continue;
      const ls = facts.map(f => /^(연애|돈|일|사람|마음) ([↑↓→]): (.+)$/.exec(f)).filter(Boolean) as RegExpExecArray[];
      for (const m of ls) {
        const ar = m[2], d = tag(m[3])?.dir, area = KO[m[1]], label = e.label.split(" (")[0];
        if (e.signals[area] !== ar) hits.push({ dim: "①칩", at: label, a: m[0], why: `칸 ${ar} ≠ 칩 ${e.signals[area]}` });
        if ((ar === "↑" && d === "down") || (ar === "↓" && d === "up")) hits.push({ dim: "①방향", at: label, a: m[3], why: `${m[1]} ${ar} 칸에 ${d}` });
        if (m[3].includes(" → ")) hits.push({ dim: "①처방꼬리", at: label, a: m[3], why: "→ 꼬리" });
        if (/(?<!마)무리(한 |하기|해서)/.test(mean(m[3])) && !mindDown.has(key)) hits.push({ dim: "①무리", at: label, a: m[3], why: "무리하기 쉬운 달 목록 밖" });
        if ((e.signals.people === "↓" && /사람 만나는 자리가 늘|새 얼굴|인맥이 넓어|모임이 늘|모임·행사|새 무리를 찾|새 자리|새 인연|나가 보/.test(m[3])) || (e.signals.love === "↓" && /새 인연|먼저 다가가|빠르게 빠져들/.test(m[3]))) hits.push({ dim: "①넓힘", at: label, a: m[3], why: "늦출 달에 넓히기" });
      }
      // ② 그 달 두 줄
      const lines = ls.map(m => m[3]);
      for (let j = 1; j < lines.length; j++) for (let i2 = 0; i2 < j; i2++) { const a = dims(lines[i2]), b = dims(lines[j]); const dd = a.find(([x, p]) => b.some(([y, q]) => x === y && p === -q)); if (dd) hits.push({ dim: "②달", at: e.label.split(" (")[0], a: lines[i2], b: lines[j], why: dd[0] }); }
    }
    // ② 그 해(작가 설계도의 해 근거 전부 — 달 근거 빼고)
    const yearFacts = new Set<string>(); const walk = (o: unknown) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") { const r = o as { kind?: string; key?: string; facts?: string[] }; if (r.kind === "evidence" && r.facts && !/^(month|bridge|depth):/.test(r.key ?? "")) r.facts.forEach(f => yearFacts.add(f)); Object.values(r).forEach(walk); } };
    walk(plan);
    const yf = [...yearFacts].filter(f => dims(f).length);
    for (let j = 1; j < yf.length; j++) for (let i2 = 0; i2 < j; i2++) { const a = dims(yf[i2]), b = dims(yf[j]); const dd = a.find(([x, p]) => b.some(([y, q]) => x === y && p === -q)); if (dd) hits.push({ dim: "②해", at: "해", a: yf[i2], b: yf[j], why: dd[0] }); }
    // 성격표
    const v = new Map<string, number>(); const add = (tags: Record<string, number>, w: number) => { for (const [d, x] of Object.entries(tags)) v.set(d, (v.get(d) ?? 0) + x * w); };
    for (const t of brief.traits) { const f = k.features.get(t.featureId); if (f && f.family !== "relation") add(f.dimensionTags, t.score); }
    const mp = brief.mbti ? k.mbti.get(brief.mbti.type) : undefined; if (mp) add(mp.dimensionTags, 1.5 * Math.max(1, ...brief.traits.map((t: { score: number }) => t.score)));
    const poles: Map<string, number> = profilePoles(profileCodes(brief.mbti?.type ?? null, v, brief.traits.map((t: { featureId: string }) => t.featureId)));
    const monthLines = [...monthEv.values()].flatMap(fs => fs.map(f => /^(?:연애|돈|일|사람|마음) [↑↓→]: (.+)$/.exec(f)?.[1]).filter(Boolean) as string[]);
    for (const f of [...yf, ...monthLines.filter(x => dims(x).length)]) { const ds = dims(f); const opp = ds.filter(([d, p]) => poles.get(d) === -p).reduce((a, x) => a + x[2], 0), agree = ds.filter(([d, p]) => poles.get(d) === p).reduce((a, x) => a + x[2], 0); if (opp > 0 && opp > agree) hits.push({ dim: "②성격표", at: yf.includes(f) ? "해" : "달", a: f, why: ds.filter(([d, p]) => poles.get(d) === -p).map(x => x[0]).join(",") }); }
    // ③ 작가 입력
    const card: string = renderCard(intake), users = chunkPlan(intake).map((c: unknown) => chunkUser(intake, c)).join("\n");
    const hook = (card + users).match(/이 책(?:에서)? ?(?:\d+|두|세|네|다섯)? ?번째|이 (?:책|자리)(?:에서)? ?처음|처음 걸리/g) ?? [];
    if (hook.length) hits.push({ dim: "③고리", at: "입력", a: hook.join(" | "), why: "고리 재료 번째·처음" });
    const tipLeft = intake.lines.filter((l: { meaning: string }) => [...tips].some(tp => tp.length >= 5 && l.meaning.includes(tp)));
    for (const l of tipLeft) hits.push({ dim: "③처방꼬리", at: l.id, a: `${l.value} | ${l.meaning}`.slice(0, 160), why: "카드 줄에 처방 꼬리" });
    const seeds = new Set(Object.values(brief.mbti ? k.mbtiSeeds.get(brief.mbti.type) ?? {} : {}).flatMap((xs: unknown) => (xs as { text: string }[]).map(s => s.text.replace(/[^가-힣]/g, "").slice(0, 12))));
    for (const c of intake.chapters) for (const kp of c.keys ?? []) if (!kp.pair && kp.scene && seeds.has(kp.scene.replace(/[^가-힣]/g, "").slice(0, 12))) hits.push({ dim: "③MBTI씨앗", at: kp.label, a: kp.scene, why: "짝 없는 key에 MBTI 장면 씨앗" });
    const t = tidyLog?.last as { drops: { why: string }[]; over: unknown[]; swaps?: unknown[] } | undefined; const drops = t ? t.drops.length : 0, swaps = t?.swaps?.length ?? 0, over = t ? t.over.length : 0;
    for (const h of hits) bump(h.dim);
    bump("drops", drops); bump("swaps", swaps); bump("over", over); if (drops > 16) bump("overCap"); maxDrops = Math.max(maxDrops, drops);
    rows.push({ who, n: hits.length, dims: [...new Set(hits.map(h => h.dim))], hits: who.startsWith("r") ? hits.slice(0, 6) : hits, drops: t?.drops ?? [], over: t?.over ?? [], dropN: drops, swapN: swaps, swaps: (t?.swaps ?? []).slice(0, who.startsWith("r") ? 3 : 99), months: monthEv.size });
  }
  writeFileSync(OUT, JSON.stringify({ n, rejected, sum, rows }, null, 1));
  console.log(`사람 ${n}(만세력 거절 ${rejected}) · 권당 뺀 줄 최대 ${maxDrops} ·`, JSON.stringify(sum));
  const byDim: Record<string, number> = {}; for (const r of rows as { dims: string[] }[]) for (const d of r.dims) byDim[d] = (byDim[d] ?? 0) + 1;
  console.log("권 수(그 꼴이 있는):", JSON.stringify(byDim));
})().catch(e => { console.error(e); process.exit(1); });
