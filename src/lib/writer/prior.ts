/**
 * 같은 고객의 이전 Book(P6b E-1): 다른 상품끼리 같은 문장·장면이 나오지 않게, 이용권 계정의 발행된 v5 Book에서
 * 같은 사람(이름·생년월일·시각)의 문장과 지식 DB 장면을 모은다. 기존 report_tickets 동작(library·read)만 쓴다(마이그레이션 없음).
 * 1+1처럼 함께 산 책은 워커가 차례로 발행하므로(TICKET_WORKER_LIMITS) 뒤 책이 앞 책을 본다. 읽기에 실패하면 빈 값(발행은 막지 않는다).
 */
import type { Brief } from "@/lib/brief/schema";
import type { TicketPublicationStore } from "../tickets/publication";
import type { V5BookDraft, V5Evidence } from "./book";
import { splitSentences } from "./safety/patterns";

/** explained(P6c A3): 앞 책들이 뜻을 푼 특성(feature id). 이번 책은 그 특성의 뜻을 다시 풀지 않고 이 상품에 맞는 쓰임만 쓴다. */
/** ledger(P6d F 고객 원장): 앞 책들이 쓴 각도(feature:facet)·MBTI 씨앗 id·근거 항목(feature:id·근거 줄). 다음 책은 쓰지 않은 것을 먼저 고른다. */
/** images(최종판2 1-1): 앞 책들의 이미지 줄(표지·핵심 이미지·종합 1장 첫 소제목). 이번 책의 피할 이미지에 더한다. */
export type PriorBooks = { readonly scenes: readonly string[]; readonly sentences: readonly string[]; readonly books: number; readonly explained?: readonly string[]; readonly ledger?: BookLedger; readonly products?: readonly string[]; readonly images?: readonly string[] };
export type BookLedger = { readonly angles: readonly string[]; readonly seeds: readonly string[]; readonly evidence: readonly string[] };
export const NO_PRIOR: PriorBooks = { scenes: [], sentences: [], books: 0, explained: [] };

/** 이 책의 원장(P6d F): 쓴 특성·Fusion 각도·팩폭 각도·뜻 풀이·MBTI 씨앗·근거 줄. */
export function ledgerOf(brief: Brief): BookLedger {
  const mats = brief.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]);
  const used = new Set(mats.flatMap(m => m.kind === "trait" ? [m.traitId] : m.kind === "ref" && /^traits\.[ab]?t\d+/.test(m.ref) ? [m.ref.split(".")[1]] : []));
  const traits = brief.traits.filter(t => used.has(t.id));
  const shadowTraits = new Set(mats.flatMap(m => m.kind === "ref" && m.ref.startsWith("shadows.") ? [brief.shadows.find(s => s.id === m.ref.slice(8))?.traitId ?? ""] : []));
  const angles = [...new Set([
    ...traits.flatMap(t => t.fusion ? [`${t.featureId}:fusion:${t.fusion.target}`] : []),
    ...brief.traits.filter(t => shadowTraits.has(t.id)).map(t => `${t.featureId}:shadow`),
    ...mats.flatMap(m => m.kind === "trait" && m.angle === "first" ? [`${brief.traits.find(t => t.id === m.traitId)?.featureId}:meaning`] : []),
  ])];
  const seeds = [...new Set(mats.flatMap(m => m.kind === "mbti" && m.seedId ? [m.seedId] : []))];
  const evidence = [...new Set([...traits.map(t => `feature:${t.featureId}`), ...mats.flatMap(m => m.kind === "evidence" ? m.facts : [])])];
  return { angles, seeds, evidence };
}
/** 앞 책과 겹치지 않는 근거 항목의 몫(P6d G: 심화 상품은 종합 대비 60% 이상). 앞 책이 없으면 1. */
export function newEvidenceShare(current: BookLedger, prior: BookLedger | undefined): number {
  if (!prior?.evidence.length || !current.evidence.length) return 1;
  const p = new Set(prior.evidence);
  return Math.round((current.evidence.filter(x => !p.has(x)).length / current.evidence.length) * 1000) / 1000;
}
/** 책마다 최대 몇 권까지 거슬러 본다(최근 순). */
export const PRIOR_LIMIT = 8;

type PersonLike = { name?: string; birthDate?: string; birthTime?: string | null };
const personKey = (p: PersonLike | undefined) => (p?.birthDate ? `${p.name ?? ""}|${p.birthDate}|${p.birthTime ?? ""}` : "");
/** 입력의 사람들(종합 등은 한 명, 궁합은 두 명). */
export function peopleOf(input: unknown): string[] {
  const x = input as { person?: PersonLike; personA?: PersonLike; personB?: PersonLike } | null;
  return [personKey(x?.person), personKey(x?.personA), personKey(x?.personB)].filter(Boolean);
}

export async function priorBooks(store: TicketPublicationStore, user: string, input: unknown): Promise<PriorBooks> {
  const me = peopleOf(input)[0];
  if (!me) return NO_PRIOR;
  try {
    const lib = await store.call("library", user);
    if (!lib.ok || !Array.isArray(lib.items)) return NO_PRIOR;
    const ids = (lib.items as { reportId?: string; status?: string }[]).filter(x => x.status === "available" && x.reportId).slice(0, PRIOR_LIMIT).map(x => x.reportId!);
    const scenes: string[] = [], sentences: string[] = [], explained: string[] = [], angles: string[] = [], seeds: string[] = [], evidence: string[] = [], products: string[] = [], images: string[] = []; let books = 0;
    for (const reportId of ids) {
      const r = await store.call("read", user, { reportId });
      const snap = r.ok ? r.snapshot as { productVersion?: string; draft?: V5BookDraft; evidencePacket?: V5Evidence } | null : null;
      if (!snap || snap.productVersion !== "v5" || !snap.draft || !snap.evidencePacket) continue;
      if (!peopleOf(snap.evidencePacket.input).includes(me)) continue;
      books++;
      sentences.push(...snap.draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)))));
      scenes.push(...(snap.evidencePacket.meta.scenes ?? []));
      explained.push(...(snap.evidencePacket.meta.explained ?? []));
      const l = snap.evidencePacket.meta.ledger; if (l) { angles.push(...l.angles); seeds.push(...l.seeds); evidence.push(...l.evidence); }
      products.push(snap.evidencePacket.productType);
      images.push(...imageLinesOf(snap.draft));
    }
    return { scenes: [...new Set(scenes)], sentences, books, explained: [...new Set(explained)], ledger: { angles: [...new Set(angles)], seeds: [...new Set(seeds)], evidence: [...new Set(evidence)] }, products, images: [...new Set(images)] };
  } catch { return NO_PRIOR; }
}

/** 책의 이미지 줄(최종판2 1-1): 표지·핵심 이미지·궁합 관계 이미지·종합 1장 첫 소제목. */
export function imageLinesOf(d: V5BookDraft): string[] {
  const x = d as unknown as { coverLine?: string; coreImage?: { line?: string }; pairImage?: { line?: string }; productType?: string; chapters?: { sections?: { heading?: string }[] }[] };
  return [x.coverLine, x.coreImage?.line, x.pairImage?.line, x.productType === "saju_mbti_full" ? x.chapters?.[0]?.sections?.[0]?.heading : undefined].filter((v): v is string => Boolean(v && v.trim()));
}

/** 이 책이 뜻을 푼 특성(angle=first인 trait의 feature id, P6c A3). 다음 책이 뜻을 다시 풀지 않는다. */
export function explainedOf(brief: Brief): string[] {
  const ids = new Set<string>();
  for (const c of brief.chapters) for (const m of [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]) if (m.kind === "trait" && m.angle === "first") { const t = brief.traits.find(x => x.id === m.traitId); if (t) ids.add(t.featureId); }
  return [...ids];
}

/** 브리프가 고른 지식 DB 장면 글(다음 책이 피하도록 Book 메타에 남긴다). */
export function usedScenesOf(brief: Brief): string[] {
  const out = new Set<string>();
  for (const c of brief.chapters) for (const m of [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]) if ("scene" in m && typeof m.scene === "string") out.add(m.scene);
  for (const t of brief.traits) if (t.fusion?.scene) out.add(t.fusion.scene);
  for (const e of brief.timeline?.entries ?? []) if (e.material.scene) out.add(e.material.scene);
  return [...out];
}
