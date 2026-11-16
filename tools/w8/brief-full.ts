// W8 브리프 전수 시험(호출 0, 시드 고정 — W7 w7full.ts를 W8 작가 입력 재료 정리(pieceAudit)로): 가상 출생 N(1950~2010, 남녀 반반, 시간 미상 10%) × MBTI(16유형 고르게, 없음 5%) × 4종(궁합 7관계 고르게).
// 잰다: 같은 사람·같은 차원 반대 재료 쌍(짝 정리 전·뒤, 세기 2+·같은 조건 정의 따로) · 사주 안 관계 줄의 성격 단정 · 건강 단정 · 성립 안 하는 개수 조건(D3) · 짝 정리로 뺀 줄 · rw 바꿔치기.
// 사용: pnpm exec tsx tools/w8/brief-full.ts <N> <out.json>   (W8 보고 docs/v5/w8.md 2절 · W8.1: 고침별 계획·뺀 줄(planW8/G3/G1·dropW8/G3/G1·dropDerived)·상한으로 남긴 줄(capped) 칸 — docs/v5/w8-1.md)
import { writeFileSync } from "node:fs";
import { join } from "node:path";
const TREE = process.cwd(), [NS, OUT] = process.argv.slice(2), NN = Number(NS);
void (async () => {
  const t0 = Date.now();
  const imp = (p: string) => import(join(TREE, p));
  const { buildBrief, loadKnowledge } = await imp("src/lib/brief/index.ts");
  const { buildFactSheet } = await imp("src/lib/factsheet/build.ts");
  const { buildWriterPrompt, pieceAudit } = await imp("src/lib/writer/prompt/index.ts");
  const { createRng } = await imp("src/lib/brief/seed.ts");
  const { materialKey: personaKey } = await imp("src/lib/writer/prompt/materials.ts");
  const { conditionsHold } = await imp("src/lib/brief/conditions.ts");
  const { calculateSaju } = await imp("src/lib/saju/calculateSaju.ts");
  const { analyzeChartDetections } = await imp("src/lib/saju/detections/analyze.ts");
  const k = loadKnowledge(join(TREE, "src/data/knowledge-v5"));
  const relKeys = new Set<string>();
  // 사주 안 관계 줄 = 관계(relation) 특징·원진 특징의 글 칸(knowledge-lint lintPersona와 같은 칸).
  for (const f of k.features.values()) if (f.family === "relation" || /WONJIN/.test(f.id)) for (const t of [f.life, f.shadow, f.meaning, ...Object.values(f.forYou ?? {}), ...(f.strengths ?? []), ...(f.overuse ?? []), ...Object.values(f.positionNuance ?? {}), ...Object.values(f.scenes).flatMap((l: unknown) => ((l ?? []) as { text: string }[]).map(x => x.text))]) if (typeof t === "string" && t.length >= 10) relKeys.add(personaKey(t));
  const MBTIS = [...k.mbti.keys()];
  const REL = ["", "single", "some", "dating", "married"], JOB = ["", "student", "employee", "freelancer", "self_employed", "business_owner", "homemaker"];
  const RT = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"];
  const PRODUCTS = ["saju_mbti_full", "love_marriage_child", "career_money_study", "saju_mbti_compatibility"];
  let mb = 0;
  const person = (i: number) => {
    const r = createRng(500000 + i); const start = Date.UTC(1950, 0, 1), end = Date.UTC(2010, 11, 31); const d = new Date(start + Math.floor(r.next() * (end - start)));
    const unknown = r.next() < 0.1, mbti = r.next() < 0.05 ? "" : MBTIS[mb++ % MBTIS.length];
    return { name: `가람${i}`, gender: i % 2 ? "FEMALE" : "MALE", birthDate: d.toISOString().slice(0, 10), birthTime: unknown ? "" : `${String(r.int(24)).padStart(2, "0")}:${String(r.int(60)).padStart(2, "0")}`, birthTimeUnknown: unknown, approximateBirthTimeSlot: "",
      mbtiType: mbti, context: { relationshipStatus: r.pick(REL), jobStatus: r.pick(JOB), detailJob: "" } };
  };
  const TRAIT = /(?:사람|편|성격|기질|성향|유형)(?:이에요|입니다|이다|임|이죠)?[.!]?$|성격|기질/;
  // 병·몸 증상 단정만(생활 리듬 잠·끼니, 피로, 「몸이 먼저 반응」(감각 기능)은 건강 단정이 아님 — W6.1·A 집계와 같은 기준).
  const HEALTH = /소화(?:가 (?:안|잘 안)|불량|·수면|와 수면)|수면 (?:먼저|문제|장애)|불면|두통|위장|장 건강|피부 (?:트러블|질환)|혈압|면역|몸살|몸도 예민|몸이 예민|탈이 나|아프기 쉽/;
  const COUNT = /(?:나무|불|흙|쇠|물|[목화토금수]) 글자(?:가|는)? (?:하나|둘|셋|넷|다섯|한|두|세|네|\d)(?: ?개)? 이상|(?:[갑을병정무기경신임계자축인묘진사오미유술해]·){1,5}[갑을병정무기경신임계자축인묘진사오미유술해] 글자(?:가|는)? (?:여러 개|(?:둘|셋|넷|다섯|두|세|네|\d)(?: ?개)? 이상)|(?:비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인) (?:둘|셋|넷|두|세|네|\d)(?: ?개)? 이상/;
  const rows: unknown[] = []; let fail = 0;
  const pairs = (pieces: { owner: number; text: string; kept: boolean }[], keptOnly: boolean) => {
    const m = new Map<string, Set<number>>();
    for (const p of pieces) { if (keptOnly && !p.kept) continue; if (p.owner < 0) continue; const t = k.personaTags.get(personaKey(p.text)); if (!t || (t.k !== "trait" && t.k !== "situ")) continue; for (const [d, pole] of t.d) { const key = `${p.owner}|${d}`; if (!m.has(key)) m.set(key, new Set()); m.get(key)!.add(pole); } }
    return [...m].filter(([, v]) => v.size > 1).map(([kk]) => kk);
  };
  for (let i = 0; i < NN; i++) {
    const a = person(i);
    for (const [pi, product] of PRODUCTS.entries()) {
      const input = { product, person: a, baseDate: "2026-11-14", ...(product === "saju_mbti_compatibility" ? { partner: person(1000000 + i), relationshipType: RT[(i * 4 + pi) % RT.length] } : {}) };
      let brief, sheet; try { brief = buildBrief(input, k); sheet = buildFactSheet(input, brief, k); } catch { fail++; continue; }
      const audit = pieceAudit(brief, { knowledge: k, facts: sheet });
      if (!audit) continue;
      const gone = new Set(audit.drops.map((d: { owner: number; dropped: string }) => `${d.owner}|${personaKey(d.dropped)}`));
      const seenAll = audit.pieces.map((p: { owner: number; text: string }) => ({ owner: p.owner, text: p.text, kept: !gone.has(`${p.owner}|${personaKey(p.text)}`) }));
      const rawPairs = pairs(seenAll, false), keptPairs = pairs(seenAll, true);
      // W8 짝 정리 대상 정의(세기 2 이상 · 같은 조건)로 남은 짝(유일한 재료로 지킨 줄 포함)
      const strict = (() => { const m = new Map<string, Set<number>>(); for (const p of audit.pieces as { owner: number; key: string }[]) { if (p.owner < 0 || gone.has(`${p.owner}|${p.key}`)) continue; const t = k.personaTags.get(p.key); if (!t || (t.k !== "trait" && t.k !== "situ")) continue; for (const [d, pole, s2] of t.d) { if (s2 < 2) continue; const kk = `${p.owner}|${d}|${t.c?.who ?? ""}|${t.c?.sit ?? ""}`; if (!m.has(kk)) m.set(kk, new Set()); m.get(kk)!.add(pole); } } return [...m.values()].filter(v => v.size > 1).length; })();
      const kept = seenAll.filter((p: { kept: boolean }) => p.kept);
      const untagged = audit.pieces.filter((p: { key: string }) => !k.personaTags.has(p.key)).length;
      const unowned = kept.filter((p: { owner: number; text: string }) => p.owner < 0 && ["trait", "situ"].includes(k.personaTags.get(personaKey(p.text))?.k ?? "")).length;
      const relTrait = kept.filter((p: { text: string }) => relKeys.has(personaKey(p.text)) && !k.personaTags.get(personaKey(p.text))?.rw && TRAIT.test(k.materials.get(personaKey(p.text)) ?? p.text)).length;
      const user: string = buildWriterPrompt(brief, { knowledge: k, facts: sheet }).user;
      const w = JSON.parse(user.match(/```json\n([\s\S]*?)\n```/)![1]);
      const strs: string[] = []; const walk = (o: unknown) => { if (typeof o === "string") strs.push(o); else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") Object.values(o).forEach(walk); }; walk(w);
      const health = strs.filter(s0 => HEALTH.test(s0)).length;
      let d3 = 0;
      try { const saju = calculateSaju({ birthDate: a.birthDate, birthTime: a.birthTime, birthTimeUnknown: a.birthTimeUnknown, approximateBirthTimeSlot: "", calendarType: "SOLAR", gender: a.gender }); const det = analyzeChartDetections(saju);
        const ctx = { saju, det, positions: [], hitIds: new Set<string>() };
        for (const s0 of strs) if (COUNT.test(s0) && product !== "saju_mbti_compatibility" && !conditionsHold(s0, ctx)) d3++; } catch { /* 엔진 거절 */ }
      const plan = [...audit.drops, ...(audit.left ?? [])], cnt = (xs: { by?: string; derived?: boolean }[], b: string) => xs.filter(x => (x.by ?? "w8") === b).length;
      rows.push({ i, product, mbti: Boolean(a.mbtiType), seen: audit.pieces.length, kept: kept.length, dropped: audit.drops.length, capped: audit.capped ?? 0, planW8: cnt(plan, "w8"), planG3: cnt(plan, "g3"), planG1: cnt(plan, "g1"), dropW8: cnt(audit.drops, "w8"), dropG3: cnt(audit.drops, "g3"), dropG1: cnt(audit.drops, "g1"), dropDerived: audit.drops.filter((x: { derived?: boolean }) => x.derived).length, rw: audit.rw, tagDrop: audit.tagDrop, protectedPairs: audit.protectedPairs, untagged, unowned, rawPairs: rawPairs.length, keptPairs: keptPairs.length, strictPairs: strict, relTrait, health, d3 });
    }
  }
  writeFileSync(OUT, JSON.stringify({ n: NN, fail, ms: Date.now() - t0, rows }));
  console.log("done", rows.length, "fail", fail, "sec", Math.round((Date.now() - t0) / 1000));
})().catch(e => { console.error(e); process.exit(1); });
