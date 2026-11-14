/**
 * 운영 v5 완성 책 읽기(AM 1부, 읽기 전용·메모리 전용). 시험 계정(public.ops_test_user)·시험 표시(meta.test) 책은 뺀다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/prodBooks.ts list
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/prodBooks.ts show <번호>     (판독용: 이름을 가린 원고를 화면에만)
 * 원고는 파일로 저장하지 않는다. 화면 출력은 고객 이름을 「○○」로 가리고 생년월일·입력값은 내보내지 않는다.
 */
import type { Snap } from "../final/replay";
import { prodQuery } from "./prodRead";

export type ProdRow = { report_id: string; product_type: string; created_at: string; published_at: string | null; ticket: boolean; test: boolean; meta_test: boolean; pv: string | null; size: number };

/** 완성 책 목록(v5만, 시험 제외 여부 표시). 번호는 만든 순서. */
export function listProdBooks(): (ProdRow & { no: number })[] {
  const rows = prodQuery<ProdRow>(`select s.report_id, s.product_type, s.created_at, s.published_at,
      (s.ticket_redemption_id is not null) as ticket,
      coalesce(public.ops_test_user(coalesce(r.user_id, public.meta_order_buyer(s.order_id, s.report_id))), false) as test,
      coalesce((s.snapshot_json->'evidencePacket'->'meta'->>'test')::boolean, false) as meta_test,
      s.snapshot_json->>'productVersion' as pv, length(s.snapshot_json::text) as size
    from public.paid_report_snapshots s left join public.report_ticket_redemptions r on r.id = s.ticket_redemption_id
    where s.status = 'COMPLETED' order by s.created_at`);
  return rows.map((r, i) => ({ ...r, no: i + 1 }));
}

/** 판정 대상: v5이고 시험 계정·시험 표시가 아닌 책. */
export const isTarget = (r: ProdRow) => r.pv === "v5" && !r.test && !r.meta_test;

/** 책 한 권(메모리). withRaw = 작가·수리 원문(replay용)까지. */
export function loadProdSnap(reportId: string, withRaw = false): Snap {
  if (!/^report_[a-z0-9]{13,64}$/.test(reportId)) throw new Error("reportId 형식");
  const col = withRaw ? "s.snapshot_json" : "(s.snapshot_json #- '{evidencePacket,meta,raw}' #- '{evidencePacket,meta,review}')";
  const [row] = prodQuery<{ snap: Snap }>(`select ${col} as snap from public.paid_report_snapshots s where s.report_id = '${reportId}' and s.status = 'COMPLETED'`);
  if (!row?.snap) throw new Error("Book 없음");
  return { ...row.snap, reportId } as Snap;
}

/** 고객 이름(본인·상대)을 가린다. 호칭(○○님)도 같이. */
export function masker(snap: Snap): (s: string) => string {
  const input = snap.evidencePacket.input as unknown as { person?: { name?: string }; personA?: { name?: string }; personB?: { name?: string } };
  const names = [input.person?.name, input.personA?.name, input.personB?.name].filter((x): x is string => Boolean(x && x.trim().length >= 1)).map(x => x.trim());
  const parts = [...new Set(names.flatMap(n => [n, ...(n.length >= 3 ? [n.slice(1)] : [])]))].sort((a, b) => b.length - a.length);
  const re = parts.length ? new RegExp(parts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g") : null;
  return s => (re ? s.replace(re, "○○") : s);
}

async function main() {
  const [cmd, arg] = process.argv.slice(2);
  const all = listProdBooks();
  if (cmd === "list") {
    const by: Record<string, number> = {};
    for (const r of all) by[`${r.pv ?? "?"}:${r.product_type}:${isTarget(r) ? "대상" : r.pv !== "v5" ? "v4" : "시험"}`] = (by[`${r.pv ?? "?"}:${r.product_type}:${isTarget(r) ? "대상" : r.pv !== "v5" ? "v4" : "시험"}`] ?? 0) + 1;
    console.log(JSON.stringify(by, null, 1));
    for (const r of all.filter(isTarget)) console.log(`${r.no}\t${r.product_type}\t${r.created_at.slice(0, 16)}\t${r.ticket ? "이용권" : "결제"}`);
    return;
  }
  if (cmd === "show") {
    const r = all.find(x => String(x.no) === arg);
    if (!r || !isTarget(r)) throw new Error("대상 번호가 아니다");
    const { manuscript } = await import("../final/replay");
    const snap = loadProdSnap(r.report_id), mask = masker(snap);
    console.log(`# ${r.no} · ${r.product_type} · ${r.created_at.slice(0, 10)}\n`);
    console.log(mask(manuscript(snap.draft)));
    return;
  }
  if (cmd === "scan") {
    // 저장 본문에 지금 코드의 정리·검사(호출 0). 깃발 문장은 이름을 가려 60자까지만.
    const { lintStored } = await import("../final/replay");
    const total: Record<string, number> = {};
    for (const r of all.filter(isTarget)) {
      const snap = loadProdSnap(r.report_id), mask = masker(snap);
      const { flags } = lintStored(snap);
      const by: Record<string, number> = {};
      for (const f of flags) { by[f.rule] = (by[f.rule] ?? 0) + 1; total[f.rule] = (total[f.rule] ?? 0) + 1; }
      console.log(`\n## ${r.no} ${r.product_type} 깃발 ${flags.length} ${JSON.stringify(by)}`);
      if (arg === "--sentences") for (const f of flags) console.log(`  ${f.chapter}.${f.section} ${f.rule}${f.detail ? `(${mask(f.detail).slice(0, 40)})` : ""}: ${mask(f.sentence).slice(0, 60)}`);
    }
    console.log(`\n합계 ${JSON.stringify(total)}`);
    return;
  }
  if (cmd === "check11") {
    // 1-1 결정론 확인(호출 0): ① 세운 × 원국 관계(엔진)와 본문 언급 ② 장 안 같은 구절 3회 이상 ③ 내부 용어·고객 사이 같은 구절·표지 시간 모순.
    const { calculateSaju } = await import("../../src/lib/saju/calculateSaju");
    const { analyzeIncoming, getAnnualPillar } = await import("../../src/lib/saju/detections");
    const { inputOfSnap } = await import("../final/replay");
    const targets = all.filter(isTarget).map(r => ({ r, snap: loadProdSnap(r.report_id) }));
    const W = 12, crossSeen = new Map<string, Set<string>>();
    for (const { r, snap } of targets) {
      const mask = masker(snap), d = snap.draft;
      const bi = inputOfSnap(snap).person;
      const saju = calculateSaju({ birthDate: bi.birthDate, birthTime: bi.birthTime, birthTimeUnknown: bi.birthTimeUnknown, approximateBirthTimeSlot: (bi.approximateBirthTimeSlot ?? "") as never, calendarType: "SOLAR", gender: (bi.gender || "OTHER_OR_UNSPECIFIED") as never, timezone: "Asia/Seoul" });
      const years = [2026, ...(r.created_at >= "2026-11-01" ? [2027] : [])];
      const rels = years.map(y => ({ y, hits: analyzeIncoming(saju, "annual", getAnnualPillar(y)).relations.map(h => `${h.kind}:${h.key}@${h.members.filter(m => m.position !== "annual").map(m => m.position).join("+")}`) }));
      const body = d.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs)).join("\n");
      const yearSens = [...body.matchAll(/[^.!?\n]*(병오|丙午|정미|丁未|2026년|2027년|올해)[^.!?\n]*/g)].map(m => m[0].trim());
      console.log(`\n## ${r.no} ${r.product_type} ① ${rels.map(x => `${x.y}: ${x.hits.join(", ") || "관계 없음"}`).join(" | ")}`);
      for (const y of yearSens) console.log(`  ① 해 언급: ${mask(y).slice(0, 110)}`);
      for (const c of d.chapters) {
        const counts = new Map<string, number>();
        for (const s of c.sections) for (const para of s.paragraphs) { const norm = para.replace(/[^가-힣]/g, ""); const seen = new Set<string>(); for (let i = 0; i + W <= norm.length; i++) { const w = norm.slice(i, i + W); if (seen.has(w)) continue; seen.add(w); counts.set(w, (counts.get(w) ?? 0) + 1); } }
        const rep = [...counts].filter(([, n]) => n >= 3).map(([w, n]) => `${w}×${n}`);
        if (rep.length) console.log(`  ② ${c.n}장 장 안 반복: ${rep.slice(0, 3).map(mask).join(" / ")}${rep.length > 3 ? ` 외 ${rep.length - 3}` : ""}`);
      }
      for (const m of body.matchAll(/[^.!?\n]*(처방|브리프|재료|씨앗|슬롯|규칙상|입력에 없)[^.!?\n]*/g)) console.log(`  ③ 용어: ${mask(m[0]).trim().slice(0, 70)}`);
      const cover = d.coverLine ?? d.coreImage?.line ?? "";
      if (/밤|자정|새벽|어둠/.test(cover) && /해(?![가-힣]{0,1}(요|서))|햇살|햇빛|태양|한낮/.test(cover)) console.log(`  ③ 표지 시간 모순 후보: ${cover}`);
      for (const c of d.chapters) for (const s of c.sections) for (const para of s.paragraphs) { const norm = para.replace(/[^가-힣 ]/g, ""); for (const m of norm.matchAll(/[가-힣]{2,}( [가-힣]{1,}){3,5}/g)) { const k = m[0]; if (k.replace(/ /g, "").length < 10) continue; const set = crossSeen.get(k) ?? new Set<string>(); set.add(`${r.no}:${c.n}`); crossSeen.set(k, set); } }
    }
    const cross = [...crossSeen].filter(([, v]) => new Set([...v].map(x => x.split(":")[0])).size >= 2).map(([k, v]) => `${k} ← ${[...v].join(",")}`);
    console.log(`\n③ 다른 책 사이 같은 어절 4~6개 묶음 ${cross.length}개${cross.length ? `:\n  ${cross.slice(0, 25).join("\n  ")}` : ""}`);
    return;
  }
  console.error("사용: prodBooks.ts list | show <번호> | scan [--sentences] | check11"); process.exit(2);
}
if (process.argv[1]?.endsWith("prodBooks.ts")) void main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
