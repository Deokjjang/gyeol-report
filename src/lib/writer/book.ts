/**
 * v5 Book(P3 F). 작가 출력(장·소제목·문단)과 대운·세운 카드(TimelineEntry)를 고정 저장하고, 읽을 때 기존 BookData 페이지로 투영한다.
 * 저장 형식: ProductPreviewSnapshot{productVersion:"v5", draft: V5BookDraft, evidencePacket: V5Evidence}.
 * 만세력·MBTI 표는 생성 시 기존 v4 계산으로 한 번 만들어 people에 고정한다(읽을 때 재계산 없음).
 */
import type { BookData, BookPage, BookPerson, BookParagraph } from "@/app/dev/book-preview/bookTypes";
import { composeBookNavigation } from "@/app/dev/book-preview/bookNavigation";
import { BOOKS, readerTitle } from "@/lib/book/product";
import type { Brief, Material, TimelineEntry } from "@/lib/brief/schema";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { productSlugByType, type ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { BookSection, ChapterSource } from "./format";
import type { WriterChapter } from "./prompt";
import type { CallLog } from "./runner";
import type { FinalChapter, SafetyReport } from "./safety";
import { splitSentences } from "./safety/patterns";

export const V5_DRAFT_VERSION = "v5-book-1" as const;
export const V5_EVIDENCE_VERSION = "v5-evidence-1" as const;

export type V5TimelineCard = Omit<TimelineEntry, "material">;
export type V5Chapter = { readonly n: number; readonly id: string; readonly title: string; readonly sections: readonly BookSection[]; readonly keys?: readonly string[] };
export type V5BookDraft = {
  readonly version: typeof V5_DRAFT_VERSION; readonly productVersion: "v5"; readonly productType: Brief["product"];
  readonly title: string; readonly headline: string; readonly finalLine: string;
  readonly chapters: readonly V5Chapter[];
  readonly timeline?: { readonly cards: readonly V5TimelineCard[]; readonly tenGodNotes: NonNullable<Brief["timeline"]>["tenGodNotes"]; readonly thisYear: number; readonly age: number };
};
export type ChapterMeta = { readonly n: number; readonly id: string; readonly title: string; readonly source: ChapterSource; readonly reason?: string; readonly chars: number; readonly evidence: readonly string[] };
export type WriterMeta = {
  readonly writer: { readonly provider: string; readonly model: string } | null;
  readonly promptVersion: string; readonly knowledgeVersion: string; readonly briefVersion: string; readonly briefHash: string;
  readonly tokens: { readonly input: number; readonly cachedInput: number; readonly output: number };
  readonly costUsd: number; readonly calls: readonly CallLog[]; readonly durationMs: number;
  readonly chapters: readonly ChapterMeta[];
  readonly safety: { readonly deletions: number; readonly byRule: Readonly<Record<string, number>>; readonly warnings: number };
  readonly recovered: boolean;
};
export type V5Evidence = {
  readonly version: typeof V5_EVIDENCE_VERSION; readonly productType: Brief["product"]; readonly generatedAt: string;
  readonly input: ReportInputPayload; readonly people: readonly BookPerson[]; readonly names: string;
  readonly context: readonly { readonly label: string; readonly value: string }[];
  readonly pair?: { readonly category: string; readonly characters: readonly { name: string; core: string; strength: string; relationship: string }[]; readonly relations: readonly string[]; readonly directions: readonly { title: string; effect: string; term?: string; chapterN: number }[] };
  readonly meta: WriterMeta;
};

const REF_NAMES: Record<string, string> = { "chart.dayMaster": "타고난 바탕", "chart.elements": "가장 강한·약한 기운", "chart.yinYang": "음양 균형", "chart.climate": "태어난 계절", "chart.thisYear": "올해 기운", "chart.currentDayun": "지금 대운", "chart.strength": "타고난 힘의 세기", fortunes: "좋은 기운", unused: "아직 쓰지 못한 기운", "timeline.cycles": "대운 지도", "timeline.keyEntries": "눈여겨볼 때", "compatibility.tenGodAB": "주는 기운(A→B)", "compatibility.tenGodBA": "주는 기운(B→A)", "compatibility.complement": "서로 채워 주는 기운", "compatibility.dayRelations": "두 사람의 날", "compatibility.differences": "다른 반응", "compatibility.mbtiConvention": "MBTI 통념 궁합", "compatibility.lens": "관계의 초점", "compatibility.common": "닮은 점", "compatibility.score": "타고난 맞물림", "compatibility.a": "A의 모습", "compatibility.b": "B의 모습" };
const EVIDENCE_NAMES: Record<string, string> = { spouseStar: "배우자 별", spousePalace: "배우자 자리", childStar: "자녀 별", childPalace: "자녀 자리", partnerMatch: "잘 맞는 상대", meetingPlaces: "만나기 좋은 곳", jobFit: "잘 맞는 일", investment: "돈 쓰는 방식" };
const noHan = (s: string) => s.replace(/\s*\([^)]*[一-鿿][^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();

/** 장별 근거 요약: 그 장 재료의 쉬운 이름 3~5개. */
export function chapterEvidence(brief: Brief, ch: WriterChapter): string[] {
  const names: string[] = [];
  const add = (s?: string) => { if (s && !names.includes(s)) names.push(s); };
  const materials: Material[] = [...ch.materials, ...Object.values(ch.perKey ?? {}).flat()];
  for (const m of materials) {
    if (m.kind === "trait") { const t = brief.traits.find(x => x.id === m.traitId); add(t && `${t.easyName}(${noHan(t.name)})`); }
    else if (m.kind === "mbti") add(brief.mbti ? `MBTI ${brief.mbti.type}` : undefined);
    else if (m.kind === "evidence") add(EVIDENCE_NAMES[m.key]);
    else if (m.kind === "ref") {
      if (m.ref.startsWith("shadows.")) { const s = brief.shadows.find(x => x.id === m.ref.slice(8)); const t = s && brief.traits.find(x => x.id === s.traitId); add(t && `${t.easyName}(${noHan(t.name)})`); }
      else if (m.ref.startsWith("traits.")) { const t = brief.traits.find(x => x.id === m.ref.split(".")[1]); add(t && `${t.easyName}×MBTI`); }
      else if (m.ref === "mbti") add(brief.mbti ? `MBTI ${brief.mbti.type}` : undefined);
      else add(REF_NAMES[m.ref]);
    }
  }
  if (ch.keys) add(`${ch.keys.length}개 ${ch.keys[0]?.includes("-M") ? "달" : "해"} 카드`);
  for (const fill of [REF_NAMES["chart.dayMaster"], REF_NAMES["chart.elements"]]) if (names.length < 3) add(fill);
  return names.slice(0, 5);
}

export function payloadToBriefInput(payload: ReportInputPayload, baseDate: string) {
  const person = (p: ReportInputPayload extends infer _ ? Extract<ReportInputPayload, { person: unknown }>["person"] : never, ctx?: Extract<ReportInputPayload, { userContext: unknown }>["userContext"]) => ({
    name: p.name, gender: (p.gender === "MALE" || p.gender === "FEMALE" ? p.gender : "") as "MALE" | "FEMALE" | "", birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown,
    approximateBirthTimeSlot: p.approximateBirthTimeSlot, mbtiType: (p.mbtiType || "") as never,
    ...(ctx ? { context: { relationshipStatus: ctx.relationshipStatus, jobStatus: ctx.jobStatus, detailJob: ctx.detailJob } } : {}),
  });
  if (payload.productKey === "saju_mbti_compatibility") return { product: payload.productKey, person: person(payload.personA), partner: person(payload.personB), relationshipType: payload.relationshipType, baseDate };
  const year = "selectedYear" in payload.productOptions ? Number(payload.productOptions.selectedYear) : NaN;
  return { product: payload.productKey, person: person(payload.person, payload.userContext), baseDate, ...(Number.isFinite(year) ? { selectedYear: year } : {}) };
}

const firstSentence = (sections: readonly BookSection[]) => splitSentences(sections.flatMap(s => s.paragraphs)[0] ?? "")[0] ?? "";
const lastSentence = (sections: readonly BookSection[]) => splitSentences(sections.flatMap(s => s.paragraphs).at(-1) ?? "").at(-1) ?? "";

export function assembleV5Book(a: {
  brief: Brief; plan: readonly WriterChapter[]; finals: readonly FinalChapter[]; report: SafetyReport; payload: ReportInputPayload; generatedAt: string;
  people: readonly BookPerson[]; writer: WriterMeta["writer"]; calls: readonly CallLog[]; tokens: WriterMeta["tokens"]; costUsd: number; durationMs: number;
  briefHash: string; knowledgeVersion: string; promptVersion: string; recovered: boolean;
}): { draft: V5BookDraft; evidence: V5Evidence } {
  const { brief } = a;
  const book = BOOKS.find(b => b.productKey === brief.product)!;
  const title = readerTitle(book, String(brief.timeline && brief.product === "annual_fortune" ? brief.chart.thisYear.year : ""));
  const chapters: V5Chapter[] = a.finals.map(f => ({ n: f.n, id: f.id, title: f.title, sections: f.sections, ...(f.keys ? { keys: f.keys } : {}) }));
  const byRule: Record<string, number> = {};
  for (const d of a.report.deletions) byRule[d.rule] = (byRule[d.rule] ?? 0) + 1;
  const draft: V5BookDraft = {
    version: V5_DRAFT_VERSION, productVersion: "v5", productType: brief.product, title,
    headline: firstSentence(chapters[0]?.sections ?? []) || brief.productTitle, finalLine: lastSentence(chapters.at(-1)?.sections ?? []),
    chapters,
    ...(brief.timeline ? { timeline: { cards: brief.timeline.entries.map(card => { const c: Partial<TimelineEntry> = { ...card }; delete c.material; return c as V5TimelineCard; }), tenGodNotes: brief.timeline.tenGodNotes, thisYear: brief.chart.thisYear.year, age: brief.person.age } } : {}),
  };
  const c = brief.compatibility;
  const pair = c ? {
    category: c.lens.focus,
    characters: [c.a, c.b].map(p => ({ name: p.callName.replace(/님$/, ""), core: p.image, strength: brief.traits.find(t => t.id === p.traitIds[0])?.easyName ?? "", relationship: p.role })),
    relations: c.dayRelations,
    directions: (["direction-ab", "direction-ba"] as const).map((id, i) => ({ title: a.plan.find(ch => ch.id === id)?.title ?? "", effect: (i ? c.tenGodBA : c.tenGodAB).reading.slice(0, 60), term: noHan((i ? c.tenGodBA : c.tenGodAB).tenGod), chapterN: a.plan.find(ch => ch.id === id)?.n ?? 0 })),
  } : undefined;
  const p = brief.person.facts;
  const context = c ? [{ label: "관계", value: c.lens.focus }] : [
    { label: "현재 직업", value: p.job.detail || "-" }, { label: "현재 관계", value: { single: "솔로", dating: "연애", married: "기혼", unknown: "미선택" }[p.relationship] },
    ...(brief.product === "annual_fortune" ? [{ label: "선택 연도", value: String(brief.chart.thisYear.year) }] : []),
  ];
  const evidence: V5Evidence = {
    version: V5_EVIDENCE_VERSION, productType: brief.product, generatedAt: a.generatedAt, input: a.payload, people: a.people,
    names: c ? `${c.a.callName.replace(/님$/, "")} · ${c.b.callName.replace(/님$/, "")}` : brief.person.name, context, ...(pair ? { pair } : {}),
    meta: {
      writer: a.writer, promptVersion: a.promptVersion, knowledgeVersion: a.knowledgeVersion, briefVersion: brief.version, briefHash: a.briefHash,
      tokens: a.tokens, costUsd: a.costUsd, calls: a.calls, durationMs: a.durationMs, recovered: a.recovered,
      chapters: a.finals.map(f => ({ n: f.n, id: f.id, title: f.title, source: f.source, ...(f.reason ? { reason: f.reason } : {}), chars: f.chars, evidence: chapterEvidence(brief, a.plan.find(ch => ch.n === f.n)!) })),
      safety: { deletions: a.report.deletions.length, byRule, warnings: a.report.warnings.length },
    },
  };
  return { draft, evidence };
}

export function createV5Snapshot(a: { reportId: string; createdAtIso: string; draft: V5BookDraft; evidence: V5Evidence }): ProductPreviewSnapshot {
  const type = a.draft.productType;
  return { id: `v5-${a.reportId}`, reportId: a.reportId, createdAtIso: a.createdAtIso, productKey: type, productSlug: productSlugByType[type], productType: type, productVersion: "v5",
    draft: a.draft as unknown as ProductPreviewSnapshot["draft"], evidencePacket: a.evidence, access: { mode: "paid", isPaid: true, isUnlocked: true } };
}

/** 저장된 v5 초안·근거가 발행 가능한 모양인가(읽기 경로 검사). 기존 검사 함수와 같은 {ok, errors} 모양. */
export function validateV5Publication(product: string, draft: unknown, evidence: unknown): { ok: boolean; errors: string[] } {
  const d = draft as V5BookDraft | null, e = evidence as V5Evidence | null;
  const errors: string[] = [];
  if (!d || d.version !== V5_DRAFT_VERSION || d.productVersion !== "v5" || d.productType !== product) errors.push("V5_DRAFT_INVALID");
  else if (!Array.isArray(d.chapters) || d.chapters.length < 5 || d.chapters.some(c => !c.sections?.length || c.sections.some((s: BookSection) => !s.paragraphs?.length))) errors.push("V5_CHAPTERS_INVALID");
  else if ((product === "major_fortune" || product === "annual_fortune") && !d.timeline?.cards.length) errors.push("V5_TIMELINE_REQUIRED");
  if (!e || e.version !== V5_EVIDENCE_VERSION || e.productType !== product) errors.push("V5_EVIDENCE_INVALID");
  return { ok: errors.length === 0, errors };
}

const toParagraphs = (sections: readonly BookSection[]): BookParagraph[] => sections.flatMap(s => s.paragraphs.map((text, i) => ({ text, notes: [], ...(i === 0 && s.heading ? { heading: s.heading } : {}) })));
const TIME = (y: number, now: number) => (y < now ? "돌아보기" : y === now ? "지금" : "앞으로");
const importance = (score: number) => (score >= 4 ? "HIGH" : score === 3 ? "MEDIUM" : "BACKGROUND") as "HIGH" | "MEDIUM" | "BACKGROUND";

/** 저장된 v5 스냅샷 → 기존 렌더러가 그대로 보여 주는 BookData. */
export function projectV5Book(snapshot: ProductPreviewSnapshot): BookData | null {
  if (snapshot.productVersion !== "v5") return null;
  const d = snapshot.draft as unknown as V5BookDraft, e = snapshot.evidencePacket as V5Evidence;
  if (!validateV5Publication(snapshot.productType, d, e).ok) return null;
  const book = BOOKS.find(b => b.productKey === d.productType)!;
  const pages: BookPage[] = [{ kind: "cover", title: d.title, names: e.names, headline: d.headline }];
  if (!e.pair && e.people.length) pages.push({ kind: "input", title: "이 책의 주인공" });
  if (e.pair) pages.push({ kind: "pair", title: "우리라는 사이", category: e.pair.category, characters: [...e.pair.characters], directions: [], relations: [...e.pair.relations] });
  e.people.forEach((p, i) => pages.push({ kind: "manse", title: `${p.name}의 만세력`, person: i }, { kind: "mbti", title: `${p.name}의 MBTI`, person: i }));
  const chapterPage = new Map<number, number>(), keyPage = new Map<string, number>();
  for (const ch of d.chapters) {
    if (!ch.keys) { chapterPage.set(ch.n, pages.length); pages.push({ kind: "narrative", id: ch.n === 1 ? "core" : `chapter-${ch.id}`, title: ch.title, paragraphs: toParagraphs(ch.sections), notes: [] }); continue; }
    pages.push(d.productType === "major_fortune" ? { kind: "timeline", title: ch.title, years: [], transitions: [] } : { kind: "months", title: ch.title, months: [] });
    for (const s of ch.sections) {
      const card = d.timeline?.cards.find(c => c.key === s.heading);
      keyPage.set(s.heading, pages.length);
      pages.push({ kind: "narrative", id: `${ch.id}-${s.heading}`, title: card?.label ?? s.heading, paragraphs: s.paragraphs.map(text => ({ text, notes: [] })), notes: [] });
    }
  }
  if (d.timeline) {
    const t = d.timeline, cards = t.cards;
    const text = (key: string) => d.chapters.flatMap(c => c.sections).find(s => s.heading === key)?.paragraphs[0] ?? "";
    const tl = pages.find((p): p is Extract<BookPage, { kind: "timeline" }> => p.kind === "timeline");
    if (tl) tl.years = cards.filter(c => c.kind === "year").map(c => ({ year: Number(c.key), age: t.age + Number(c.key) - t.thisYear, cycle: c.dayun?.ganji ?? "", annual: c.ganji.hanja, theme: c.keywords.join(" · "), good: c.action.text,
      caution: t.tenGodNotes[c.tenGod.stem]?.caution ?? null, title: splitSentences(text(c.key))[0]?.slice(0, 60) ?? c.label, time: TIME(Number(c.key), t.thisYear), page: keyPage.get(c.key) ?? 0, transition: c.dayun?.transition ? "큰 흐름이 바뀌는 해" : null, importance: importance(c.flow.score) }));
    const ms = pages.find((p): p is Extract<BookPage, { kind: "months" }> => p.kind === "months");
    if (ms) ms.months = cards.filter(c => c.kind === "month").map(c => ({ month: Number(c.key.slice(-2)), title: splitSentences(text(c.key))[0]?.slice(0, 60) ?? c.label, theme: c.keywords.join(" · "), time: "", ganji: c.ganji.hanja,
      gods: `${c.tenGod.stem} · ${c.tenGod.branch}`, markers: c.badges.map(b => b.label), page: keyPage.get(c.key) ?? 0, good: c.action.text, importance: importance(c.flow.score) }));
  }
  if (e.pair) { const pair = pages.find((p): p is Extract<BookPage, { kind: "pair" }> => p.kind === "pair")!; pair.directions = e.pair.directions.map(x => ({ title: x.title, effect: x.effect, term: x.term, page: chapterPage.get(x.chapterN) ?? 0 })); }
  pages.push({ kind: "back", title: "이 책 공유하기", finalLine: d.finalLine });
  return { bookId: book.id, title: d.title, names: e.names, people: [...e.people], context: [...e.context], pages: composeBookNavigation(pages), readingDate: e.generatedAt.slice(0, 10), share: { title: `${e.names} · ${d.title}`, description: d.headline.slice(0, 80) } };
}
