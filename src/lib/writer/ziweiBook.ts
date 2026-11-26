/**
 * ZW-2 4부 — 자미 책 「나의 열두 서가」 저장 모양 · 발행 검사 · 화면 투영(호출 0). 다른 상품의 V5 초안 · 근거 · 투영은 건드리지 않는다
 * (book.ts는 productType이 ziwei_full일 때만 이 파일로 넘긴다).
 * - 초안(draft)에 명반 조각(ziwei: 계산 버전 + ZiweiChart)을 저장한다 — 화면 · 검사 · 다시 읽기는 저장된 명반만 쓴다.
 * - 쪽 차례: 표지 → 이 책의 주인공 → 나의 명반(12칸) → 1~7장 → 사화 배지 4칸 → 8장 → 대한 띠 → 9장 → 끝(공유 없음 — 판매 닫힘 검수 상품).
 */
import type { BookData, BookPage, BookParagraph } from "@/app/dev/book-preview/bookTypes";
import { composeBookNavigation } from "@/app/dev/book-preview/bookNavigation";
import { ZIWEI_BOOK } from "@/lib/book/product";
import { AI_WRITTEN_NOTICE_KO } from "@/lib/legal/aiNotice";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ZiweiSnapshotPart } from "@/lib/ziwei/snapshot";
import { ziweiBoardView } from "@/lib/ziwei/view";
import type { BookSection } from "./format";
import type { BookEdition, V5Chapter, WriterMeta } from "./book";

export const ZIWEI_DRAFT_VERSION = "ziwei-book-1" as const;
export const ZIWEI_EVIDENCE_VERSION = "ziwei-evidence-1" as const;
export type ZiweiBookDraft = {
  readonly version: typeof ZIWEI_DRAFT_VERSION; readonly productVersion: "v5"; readonly productType: "ziwei_full";
  readonly title: string; readonly headline: string; readonly finalLine: string; readonly edition: BookEdition;
  readonly chapters: readonly V5Chapter[]; readonly coverLine?: string; readonly baseDate: string;
  /** 명반 조각(계산 버전 + 명반) — 1부 snapshot.ts. */
  readonly ziwei: ZiweiSnapshotPart;
};
export type ZiweiEvidence = {
  readonly version: typeof ZIWEI_EVIDENCE_VERSION; readonly productType: "ziwei_full"; readonly generatedAt: string;
  readonly input: ReportInputPayload; readonly names: string; readonly context: readonly { readonly label: string; readonly value: string }[];
  readonly meta: WriterMeta;
};

export function createZiweiSnapshot(a: { reportId: string; createdAtIso: string; draft: ZiweiBookDraft; evidence: ZiweiEvidence }): ProductPreviewSnapshot {
  return { id: `v5-${a.reportId}`, reportId: a.reportId, createdAtIso: a.createdAtIso, productKey: "ziwei_full", productSlug: "ziwei-full", productType: "ziwei_full", productVersion: "v5",
    draft: a.draft as unknown as ProductPreviewSnapshot["draft"], evidencePacket: a.evidence, access: { mode: "paid", isPaid: true, isUnlocked: true } };
}
/** 발행 검사(읽기 경로): 9장 · 장마다 문단 · 명반 조각 모양 · 근거 판. */
export function validateZiweiPublication(draft: unknown, evidence: unknown): { ok: boolean; errors: string[] } {
  const d = draft as ZiweiBookDraft | null, e = evidence as ZiweiEvidence | null, errors: string[] = [];
  if (!d || d.version !== ZIWEI_DRAFT_VERSION || d.productVersion !== "v5" || d.productType !== "ziwei_full") errors.push("ZIWEI_DRAFT_INVALID");
  else {
    if (!Array.isArray(d.chapters) || d.chapters.length !== 9 || d.chapters.some(c => !c.sections?.length || c.sections.some((s: BookSection) => !s.paragraphs?.length))) errors.push("ZIWEI_CHAPTERS_INVALID");
    const c = d.ziwei?.chart;
    if (!d.ziwei || typeof d.ziwei.calcVersion !== "string" || !c || !Array.isArray(c.palaces) || c.palaces.length !== 12 || !Array.isArray(c.mutagens) || c.mutagens.length !== 4) errors.push("ZIWEI_CHART_INVALID");
  }
  if (!e || e.version !== ZIWEI_EVIDENCE_VERSION || e.productType !== "ziwei_full") errors.push("ZIWEI_EVIDENCE_INVALID");
  return { ok: errors.length === 0, errors };
}
const keySpanOf = (s: BookSection, i: number, text: string) => { const k = s.keySpans?.[i]; return k && k[0] >= 0 && k[0] < k[1] && k[1] <= text.length ? { keySpan: [k[0], k[1]] as [number, number] } : {}; };
const toParagraphs = (sections: readonly BookSection[]): BookParagraph[] => sections.flatMap(s => s.paragraphs.map((text, i) => ({ text, notes: [], ...(i === 0 && s.heading ? { heading: s.heading } : {}), ...keySpanOf(s, i, text) })));

export function projectZiweiBook(snapshot: ProductPreviewSnapshot): BookData | null {
  const d = snapshot.draft as unknown as ZiweiBookDraft, e = snapshot.evidencePacket as ZiweiEvidence;
  if (!validateZiweiPublication(d, e).ok) return null;
  const view = ziweiBoardView(d.ziwei.chart);
  const name = (e.input as { person?: { name?: string } }).person?.name ?? e.names;
  const pages: BookPage[] = [
    { kind: "cover", title: d.title, names: e.names, headline: (typeof d.coverLine === "string" && d.coverLine.trim()) || d.headline },
    { kind: "input", title: "이 책의 주인공" },
    { kind: "ziweiBoard", id: "ziwei-board", title: "나의 명반", view, name },
  ];
  for (const ch of d.chapters) {
    if (ch.id === "mutagen") pages.push({ kind: "ziweiMutagens", id: "ziwei-mutagens", title: "내 별에 붙은 네 꼬리표 — 한눈에", view });
    if (ch.id === "decade") pages.push({ kind: "ziweiDecades", id: "ziwei-decades", title: "10년의 칸 — 한눈에", view });
    pages.push({ kind: "narrative", id: ch.n === 1 ? "core" : `chapter-${ch.id}`, title: ch.title, paragraphs: toParagraphs(ch.sections), notes: [] });
  }
  pages.push({ kind: "back", title: "이 책을 마치며", finalLine: d.finalLine, aiNotice: AI_WRITTEN_NOTICE_KO });
  return { bookId: ZIWEI_BOOK.id, title: d.title, names: e.names, people: [], context: [...e.context], pages: composeBookNavigation(pages), scheme: "auto", readingDate: e.generatedAt.slice(0, 10),
    share: { title: `${e.names} · ${d.title}`, description: d.coverLine ?? d.headline } };
}
