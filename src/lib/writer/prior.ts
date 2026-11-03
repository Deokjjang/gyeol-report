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
export type PriorBooks = { readonly scenes: readonly string[]; readonly sentences: readonly string[]; readonly books: number; readonly explained?: readonly string[] };
export const NO_PRIOR: PriorBooks = { scenes: [], sentences: [], books: 0, explained: [] };
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
    const scenes: string[] = [], sentences: string[] = [], explained: string[] = []; let books = 0;
    for (const reportId of ids) {
      const r = await store.call("read", user, { reportId });
      const snap = r.ok ? r.snapshot as { productVersion?: string; draft?: V5BookDraft; evidencePacket?: V5Evidence } | null : null;
      if (!snap || snap.productVersion !== "v5" || !snap.draft || !snap.evidencePacket) continue;
      if (!peopleOf(snap.evidencePacket.input).includes(me)) continue;
      books++;
      sentences.push(...snap.draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)))));
      scenes.push(...(snap.evidencePacket.meta.scenes ?? []));
      explained.push(...(snap.evidencePacket.meta.explained ?? []));
    }
    return { scenes: [...new Set(scenes)], sentences, books, explained: [...new Set(explained)] };
  } catch { return NO_PRIOR; }
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
