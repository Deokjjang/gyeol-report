/**
 * v5 Book(P3 F). 작가 출력(장·소제목·문단)과 대운·세운 카드(TimelineEntry)를 고정 저장하고, 읽을 때 기존 BookData 페이지로 투영한다.
 * 저장 형식: ProductPreviewSnapshot{productVersion:"v5", draft: V5BookDraft, evidencePacket: V5Evidence}.
 * 만세력·MBTI 표는 생성 시 기존 v4 계산으로 한 번 만들어 people에 고정한다(읽을 때 재계산 없음).
 */
import type { BookData, BookPage, BookPerson, BookParagraph } from "@/app/dev/book-preview/bookTypes";
import { composeBookNavigation } from "@/app/dev/book-preview/bookNavigation";
import { BOOKS, readerTitle } from "@/lib/book/product";
import { koreanDate, kstDay } from "@/lib/book/readerCopy";
import { termPattern } from "@/lib/book/terms";
import { AI_WRITTEN_NOTICE_KO } from "@/lib/legal/aiNotice";
import type { Brief, Material, TimelineEntry } from "@/lib/brief/schema";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { productSlugByType, type ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { BookSection, ChapterSource, SectionCard } from "./format";
import type { WriterChapter } from "./prompt";
import type { CallLog, RawEntry, WriterFallback } from "./runner";
import type { FinalChapter, SafetyMetrics, SafetyReport } from "./safety";
import { splitSentences } from "./safety/patterns";
import { manAge } from "@/lib/brief/chart";
import { DAYUN_AGE_NOTE, halfHapLine, REL_PLAIN, relationPlain } from "@/lib/brief/labels";
import { baseRowOf } from "@/lib/compat/display";
import { getMonthlyPillars } from "@/lib/saju/detections";
import { explainedOf, ledgerOf, newEvidenceShare, usedScenesOf, type BookLedger } from "./prior";

export const V5_DRAFT_VERSION = "v5-book-1" as const;
export const V5_EVIDENCE_VERSION = "v5-evidence-1" as const;

/** 판 정보(P6b A-4, p6b-fields.md 1). 원고 체계가 바뀌면 판 번호·개정일을 올린다(책마다 같은 값). */
/** 최종판(2026-11-04) 제6판: 원고 체계 개정(작가 1회·원문 보관, 지침 노출·고아 문장·사실 대조·한자 렌더·면책 1회·기준일은 판 표기에만). 이전 Book은 저장된 판 그대로. */
export const BOOK_EDITION = { number: 6, label: "제6판", revisedAt: "2026-11-04" } as const;
export type BookEdition = { readonly number: number; readonly label: string; readonly revisedAt: string };

/** 카드(p6b-fields.md 5): 브리프 항목에서 작가 재료를 뺀 것 + 살필 점(원국 판정)·만 나이(연 카드). */
export type V5TimelineCard = Omit<TimelineEntry, "material" | "caution"> & { readonly caution?: string | null; readonly age?: number };
/** label(최종판3 8): 공통 대운 표기 "무진 대운: 2027년 5월 무렵부터 (대운수 7)"(labels.dayunLabel). 최종판3 이전 Book에는 없다.
 * ages(운영 Q 8-1): [X, X+9] — X = 대운수(첫 대운이 시작될 때의 만 나이) + 10 × (순서 − 1)(브리프 cycles[].ages 그대로). 이 변경 전 Book은 [시작 해 − 출생 해, 끝 해 − 출생 해]. */
export type V5Cycle = { readonly ganji: string; readonly years: string; readonly ages: readonly [number, number]; readonly tenGod: string; readonly current: boolean; readonly label?: string };
export type V5Chapter = { readonly n: number; readonly id: string; readonly title: string; readonly sections: readonly BookSection[]; readonly keys?: readonly string[] };
export type V5BookDraft = {
  readonly version: typeof V5_DRAFT_VERSION; readonly productVersion: "v5"; readonly productType: Brief["product"];
  readonly title: string; readonly headline: string; readonly finalLine: string;
  /** P6b 이전 Book에는 없다. */
  readonly edition?: BookEdition;
  readonly chapters: readonly V5Chapter[];
  readonly timeline?: { readonly cards: readonly V5TimelineCard[]; readonly tenGodNotes: NonNullable<Brief["timeline"]>["tenGodNotes"]; readonly thisYear: number; readonly age: number; readonly cycles?: readonly V5Cycle[];
    /** AM 3부 평생 대운 지도(대운 전부). AM 이전 Book에는 없다. */
    readonly lifetime?: NonNullable<NonNullable<Brief["timeline"]>["lifetime"]> };
  /** AM 2부 세운 신년판: 연도·키워드 카드(작가 [키워드] 줄, 걸리면 엔진 열쇠말)·한 해 판정·나를 돕는 색·방향·숫자·삼재(해당 띠만). AM 이전 Book에는 없다. */
  readonly annual?: { readonly year: number; readonly keywords: readonly string[]; readonly keywordSource: "writer" | "engine"; readonly verdict?: string; readonly lucky?: NonNullable<Brief["display"]>["lucky"]; readonly samjae?: NonNullable<Brief["display"]>["samjae"] };
  /** 핵심 이미지(P6b B-4, p6b-fields.md 3). 궁합은 pairImage. P6b 이전 Book에는 없다. */
  readonly coreImage?: { readonly line: string; readonly ruleId: string };
  readonly pairImage?: { readonly line: string; readonly a: string; readonly b: string; readonly ruleId: string };
  /** 부록 "내 모든 기운"(P6c): 사람마다 내 사주 기운과 지식 DB 뜻 한 줄. P6c 이전 Book에는 없다(부록 쪽 없음). */
  readonly appendix?: Brief["appendix"];
  /** 표지 한 줄(P6c-ui2 c 화면, P6c-content G 작가): 작가가 쓴 이 책의 상징 한 줄(16~26자). 검사에 걸리면 핵심 이미지. 있으면 핵심 이미지보다 먼저 쓴다. */
  readonly coverLine?: string;
  /** 기준일(최종판 1-13): 책을 쓴 발행일(KST). 본문 첫 문장 대신 표지·마지막 쪽 판 표기에만 보인다. 제6판 이전 Book에는 없다. */
  readonly baseDate?: string;
  /** 용어 뜻(P6c-ui2 g): 본문에 나온 십성·신살·귀인·십이운성과 지식 DB 뜻 한 줄. P6c-ui2 이전 Book에는 없다(용어 표시 없음). */
  readonly glossary?: Brief["glossary"];
  /** 부록 대운 줄(최종판3 8): 사람마다(부록 순서) 기준일의 대운·다음 대운 표기(labels.dayunLabel)와 만 나이 안내 한 줄. 최종판3 이전 Book에는 없다. */
  readonly dayun?: readonly { readonly name: string; readonly lines: readonly string[] }[];
};
export type ChapterMeta = { readonly n: number; readonly id: string; readonly title: string; readonly source: ChapterSource; readonly reason?: string; readonly chars: number; readonly evidence: readonly string[] };
export type WriterMeta = {
  readonly writer: { readonly provider: string; readonly model: string } | null;
  readonly promptVersion: string; readonly knowledgeVersion: string; readonly briefVersion: string; readonly briefHash: string;
  readonly tokens: { readonly input: number; readonly cachedInput: number; readonly output: number };
  readonly costUsd: number; readonly calls: readonly CallLog[]; readonly durationMs: number;
  readonly chapters: readonly ChapterMeta[];
  readonly safety: { readonly deletions: number; readonly byRule: Readonly<Record<string, number>>; readonly warnings: number; readonly metrics?: SafetyMetrics };
  readonly recovered: boolean;
  /** 작가 대체 기록(P6b A-2, p6b-fields.md 2). 대체가 없으면 null, P6b 이전 Book에는 없음. */
  readonly fallback?: WriterFallback | null;
  /** 이 책이 쓴 지식 DB 장면 글(P6b E-1): 같은 고객의 다음 책이 피한다. priorBooks: 참고한 이전 책 수. */
  readonly scenes?: readonly string[];
  /** 이 책이 뜻을 푼 특성(P6c A3): 같은 고객의 다음 책은 뜻을 다시 풀지 않는다. */
  readonly explained?: readonly string[];
  readonly priorBooks?: number;
  /** 고객 원장(P6d F): 이 책이 쓴 각도·MBTI 씨앗·근거 항목. newShare: 앞 책들과 겹치지 않는 근거 항목의 몫. */
  readonly ledger?: BookLedger & { readonly newShare?: number };
  /** 작가·수리·재작성·표지 수리 원문(최종판 0-2, 입력 해시별). 같은 입력이면 다시 부르지 않고 이 원문을 쓴다(교체 레인·book:replay). 이전 Book에는 없다. */
  readonly raw?: readonly RawEntry[];
  /** 최종판3 4: 검수·수리 기록(지적·버린 지적·수리 전후·지운 문장·남긴 문장). raw와 함께 재생 가능. */
  readonly review?: Readonly<Record<string, unknown>>;
  /** 최종판3 2i: 시험 생성 책(고객 원장에서 뺀다). */
  readonly test?: boolean;
  /** 최종판3 2i: 궁합 성격표 줄(같은 사람 다음 책의 원장). */
  readonly profiles?: readonly string[];
};
type V5ScoreV51 = { readonly total: number; readonly version: string; readonly band: string; readonly verdict: string; readonly components: readonly { name: string; level: "좋음" | "보통" | "조율"; line: string }[] };
type V5ScoreV2 = { readonly total: number; readonly version: "v2" | "v2.1" | "v2.2"; readonly band: string; readonly verdict: string; readonly notice: string; readonly components: readonly { name: string; points: number; max: number; reason: string }[] };
export type V5Evidence = {
  readonly version: typeof V5_EVIDENCE_VERSION; readonly productType: Brief["product"]; readonly generatedAt: string;
  readonly input: ReportInputPayload; readonly people: readonly BookPerson[]; readonly names: string;
  readonly context: readonly { readonly label: string; readonly value: string }[];
  readonly pair?: { readonly category: string; readonly characters: readonly { name: string; core: string; strength: string; relationship: string }[]; readonly relations: readonly string[];
    /** 관계 쉬운 문장(P6b D 궁합, p6b-fields.md 4). 최종판3 7부터 엔진이 찾은 관계 전체(영향 큰 순) — 화면은 부록에 전부. */
    readonly relationsPlain?: readonly string[];
    /** 최종판3 7: 첫 쪽 묶음 요약 한 줄과 relationsPlain 줄마다의 관계 이름. 있으면 첫 쪽은 요약 + 앞 3줄, 전체는 부록. 이전 Book에는 없다(첫 쪽에 전체 목록). */
    readonly relationsSummary?: { readonly line: string; readonly names: readonly string[] }; readonly directions: readonly { title: string; effect: string; term?: string; chapterN: number }[];
    /** v5 궁합 점수. 없는 v5 Book(P3)은 점수 쪽 없이 연다. v5-1(P4): 구성요소 수준(좋음·보통·조율)을 3칸으로. v2(P6c): 항목 점수/만점·이유·계산 안내. */
    readonly score?: V5ScoreV51 | V5ScoreV2 };
  readonly meta: WriterMeta;
};

const REF_NAMES: Record<string, string> = { "chart.dayMaster": "타고난 바탕", "chart.elements": "가장 강한·약한 기운", "chart.yinYang": "음양 균형", "chart.climate": "태어난 계절", "chart.thisYear": "올해 기운", "chart.currentDayun": "지금 대운", "chart.strength": "타고난 힘의 세기", fortunes: "좋은 기운", unused: "아직 쓰지 못한 기운", "timeline.cycles": "대운 지도", "timeline.keyEntries": "눈여겨볼 때", "compatibility.tenGodAB": "주는 기운(A→B)", "compatibility.tenGodBA": "주는 기운(B→A)", "compatibility.complement": "서로 채워 주는 기운", "compatibility.dayRelations": "두 사람의 날", "compatibility.differences": "다른 반응", "compatibility.mbtiConvention": "MBTI 통념 궁합", "compatibility.lens": "관계의 초점", "compatibility.common": "닮은 점", "compatibility.score": "타고난 맞물림", "compatibility.a": "A의 모습", "compatibility.b": "B의 모습" };
const EVIDENCE_NAMES: Record<string, string> = { spouseStar: "배우자 별", spousePalace: "배우자 자리", childStar: "자녀 별", childPalace: "자녀 자리", partnerMatch: "잘 맞는 상대", meetingPlaces: "만나기 좋은 곳", jobFit: "잘 맞는 일", investment: "돈 쓰는 방식",
  jobRoles: "지금 자리에서 넓힐 역할", jobAdjacent: "옮겨 갈 직무", jobLongterm: "길게 보는 다른 길", currentJob: "지금 일과의 궁합", earnStyle: "돈 버는 방식", moneyLeak: "돈이 새는 곳", studyFit: "맞는 공부 방식", studyPick: "이어지는 공부", crush: "호감 표현", contact: "연락 패턴", pushPull: "밀당" };
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
    else if (m.kind === "rel") add(`${m.topic} 장면`);
    else if (m.kind === "ref") {
      if (m.ref.startsWith("chapters.")) { const c = brief.chapters.find(x => x.id === m.ref.slice(9)); add(c && `앞 장: ${c.title}`); continue; }
      if (m.ref.startsWith("mbti.")) { add(brief.mbti ? `MBTI ${brief.mbti.type}` : undefined); continue; }
      if (m.ref.startsWith("shadows.")) { const s = brief.shadows.find(x => x.id === m.ref.slice(8)); const t = s && brief.traits.find(x => x.id === s.traitId); add(t && `${t.easyName}(${noHan(t.name)})`); }
      else if (m.ref.startsWith("traits.")) { const t = brief.traits.find(x => x.id === m.ref.split(".")[1]); add(t && `${t.easyName}×MBTI`); }
      else if (m.ref === "mbti") add(brief.mbti ? `MBTI ${brief.mbti.type}` : undefined);
      else add(REF_NAMES[m.ref]);
    }
  }
  if (ch.keys) add(`${ch.keys.length}개 ${ch.keys[0]?.includes("-M") ? "달" : "해"} 카드`);
  for (const fill of [REF_NAMES["chart.dayMaster"], REF_NAMES["chart.elements"], REF_NAMES["chart.yinYang"]]) if (names.length < 3) add(fill);
  return names.slice(0, 5);
}

/** baseAt: 기준 시각(발행 시각, ISO) — 지금 대운을 교운 시각과 비교해 고른다(최종 A-5). */
export function payloadToBriefInput(payload: ReportInputPayload, baseDate: string, baseAt?: string) {
  const at = baseAt ? { baseAt } : {};
  const person = (p: Extract<ReportInputPayload, { person: unknown }>["person"], ctx?: Extract<ReportInputPayload, { userContext: unknown }>["userContext"]) => ({
    name: p.name, gender: (p.gender === "MALE" || p.gender === "FEMALE" ? p.gender : "") as "MALE" | "FEMALE" | "", birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown,
    approximateBirthTimeSlot: p.approximateBirthTimeSlot, mbtiType: (p.mbtiType || "") as never,
    ...(ctx ? { context: { relationshipStatus: ctx.relationshipStatus, jobStatus: ctx.jobStatus, detailJob: ctx.detailJob } } : {}),
  });
  if (payload.productKey === "saju_mbti_compatibility") return { product: payload.productKey, person: person(payload.personA), partner: person(payload.personB), relationshipType: payload.relationshipType, baseDate, ...at };
  const year = "selectedYear" in payload.productOptions ? Number(payload.productOptions.selectedYear) : NaN;
  return { product: payload.productKey, person: person(payload.person, payload.userContext), baseDate, ...at, ...(Number.isFinite(year) ? { selectedYear: year } : {}) };
}

const firstSentence = (sections: readonly BookSection[]) => splitSentences(sections.flatMap(s => s.paragraphs)[0] ?? "")[0] ?? "";
/** 머리 문장(P6c F3): 글자 수로 자르지 않고 문장 단위로. 중간에서 끊지 않는다(길면 첫 문장 전체). */
export const headSentence = (text: string) => splitSentences(text)[0] ?? text;

/** 핵심 문장 기호 ⟪ ⟫ → keySpans(P6c H, 화면 계약 P6c-ui2 g). 소제목마다 첫 쌍만, 기호는 본문에서 지운다. */
export function withKeySpan(s: BookSection): BookSection {
  let found = false;
  const spans: ([number, number] | null)[] = [];
  const paragraphs = s.paragraphs.map(p => {
    const open = p.indexOf("⟪"), close = p.indexOf("⟫", open + 1);
    if (!found && open >= 0 && close > open) {
      const inner = p.slice(open + 1, close).trim(), before = p.slice(0, open).replace(/[⟪⟫]/g, ""), after = p.slice(close + 1).replace(/[⟪⟫]/g, "");
      found = true; spans.push([before.length, before.length + inner.length]);
      return `${before}${inner}${after}`;
    }
    spans.push(null);
    return p.replace(/[⟪⟫]/g, "");
  });
  const { keySpans: _old, card: _card, ...rest } = s; void _old; void _card;
  return { ...rest, paragraphs, ...(found ? { keySpans: spans } : {}) };
}
const lastSentence = (sections: readonly BookSection[]) => splitSentences(sections.flatMap(s => s.paragraphs).at(-1) ?? "").at(-1) ?? "";

/**
 * 카드 하나(P6b E-2~E-5, P6c F1): 그림 줄·해 볼 것/돌아보기·살필 점은 작가가 쓴 카드 줄(검사 통과분), 없거나 걸린 줄은 예전 결정론 값.
 * 나이는 그해 만 나이. writer: 작가 카드 줄(필드별), bad: 검사에 걸린 필드.
 */
function timelineCard(card: TimelineEntry, notes: NonNullable<Brief["timeline"]>["tenGodNotes"], birthYear: number, writer?: SectionCard, bad: ReadonlySet<string> = new Set()): V5TimelineCard {
  const c: Partial<TimelineEntry> = { ...card }; delete c.material;
  const fromWriter = (f: keyof SectionCard) => (writer && writer[f] !== undefined && !bad.has(f) ? writer[f] : undefined);
  // 살필 점(P6d D): 작가 줄(검사 통과분) → 그 해·달 조합의 결정론 줄(card.caution, 앞 항목과 다른 문장). 십성 뜻 문장 하나로 같은 십성 해마다 같은 줄이 가던 것(2023=2033)을 막는다.
  void notes;
  const caution = fromWriter("caution") ?? card.caution ?? null;
  const past = card.period === "past";
  const good = fromWriter("good") ?? card.good;
  return { ...(c as Omit<TimelineEntry, "material" | "caution">), imageLine: fromWriter("image") ?? card.imageLine, ...(good ? { good } : {}),
    ...(past ? { review: fromWriter("review") ?? card.review } : { todo: fromWriter("todo") ?? card.todo }),
    caution, ...(card.kind === "year" ? { age: manAge(Number(card.key), birthYear) } : {}) };
}

/** 부록 대운 줄(최종판3 8): 사람마다 기준일의 대운과 다음 대운의 공통 표기(브리프 currentDayun.label = labels.dayunLabel) 그대로와 대운수 안내(대운수 = 첫 대운이 시작될 때의 만 나이, 운영 Q 8-1).
 * "지금" 같은 기준일 말은 붙이지 않는다(책은 발행일 기준이라 나중에 읽으면 어긋난다). 대운을 못 정한 사람은 뺀다. */
function dayunOf(brief: Brief): { dayun?: V5BookDraft["dayun"] } {
  const people = [{ name: brief.person.name, cd: brief.chart.currentDayun }, ...(brief.partner ? [{ name: brief.partner.person.name, cd: brief.partner.chart.currentDayun }] : [])];
  const out = people.map(p => ({ name: p.name, lines: [p.cd?.label, p.cd?.next?.label].filter((x): x is string => Boolean(x)) }));
  return out.some(p => p.lines.length) ? { dayun: out.map(p => (p.lines.length ? { ...p, lines: [...p.lines, DAYUN_AGE_NOTE] } : p)) } : {};
}

export function assembleV5Book(a: {
  brief: Brief; plan: readonly WriterChapter[]; finals: readonly FinalChapter[]; report: SafetyReport; payload: ReportInputPayload; generatedAt: string;
  people: readonly BookPerson[]; writer: WriterMeta["writer"]; fallback?: WriterFallback | null; calls: readonly CallLog[]; tokens: WriterMeta["tokens"]; costUsd: number; durationMs: number;
  briefHash: string; knowledgeVersion: string; promptVersion: string; recovered: boolean; priorBooks?: number;
  /** 표지 한 줄(P6c G, 검사 통과분 또는 핵심 이미지). badCards: 검사에 걸려 결정론 값으로 바꿀 카드 필드("장.소제목.필드"). */
  cover?: string; badCards?: ReadonlySet<string>;
  /** 핵심 이미지 한 줄(최종판 1-7): 작가가 [표지]에서 지은 줄. 종합 1장 첫 소제목과 표지가 이 줄을 함께 쓴다. 없으면 엔진 핵심 이미지. */
  image?: string; raw?: readonly RawEntry[];
  /** 같은 고객의 앞 책 원장(P6d F·G): 근거 항목 새 몫을 잰다. */
  priorLedger?: BookLedger;
  review?: Readonly<Record<string, unknown>>; test?: boolean;
  /** AM 2부: 작가 [키워드] 줄(검사 통과분). 없으면 엔진 열쇠말. */
  keywords?: readonly string[] | null;
}): { draft: V5BookDraft; evidence: V5Evidence } {
  const { brief } = a;
  const book = BOOKS.find(b => b.productKey === brief.product)!;
  // AM 2부: 세운 제목 「나의 2027」은 상품 설정 연도(발행일의 해가 아니다 — 12월에 사도 2027).
  const annualYear = brief.product === "annual_fortune" ? (brief.display?.year ?? brief.chart.thisYear.year) : undefined;
  const title = readerTitle(book, String(annualYear ?? ""));
  // 1장 첫 소제목은 핵심 이미지 그대로(P6c D2, 종합). 소제목마다 핵심 문장 위치(keySpan)를 남기고 기호는 지운다(H). 카드 줄은 카드로 옮긴다(F1).
  const cardOf = new Map<string, { card: SectionCard; bad: Set<string> }>();
  a.finals.forEach(f => f.keys && f.sections.forEach((s, si) => { if (s.card) cardOf.set(s.heading, { card: s.card, bad: new Set([...(a.badCards ?? [])].filter(x => x.startsWith(`${f.n}.${si}.`)).map(x => x.split(".")[2])) }); }));
  const chapters: V5Chapter[] = a.finals.map(f => ({ n: f.n, id: f.id, title: f.title, sections: f.sections.map((s, si) => withKeySpan(brief.product === "saju_mbti_full" && f.n === 1 && si === 0 ? { ...s, heading: a.image ?? brief.chart.coreImage.line } : s)), ...(f.keys ? { keys: f.keys } : {}) }));
  const byRule: Record<string, number> = {};
  for (const d of a.report.deletions) byRule[d.rule] = (byRule[d.rule] ?? 0) + 1;
  // 만 나이 기준 출생 연도(입력이 없으면 기준일 나이로 거꾸로 셈).
  const born = (a.payload as { person?: { birthDate?: string }; personA?: { birthDate?: string } } | undefined);
  const birthYear = Number((born?.person ?? born?.personA)?.birthDate?.slice(0, 4)) || brief.chart.thisYear.year - brief.person.age;
  const draft: V5BookDraft = {
    version: V5_DRAFT_VERSION, productVersion: "v5", productType: brief.product, title, edition: BOOK_EDITION, baseDate: brief.baseDate,
    headline: firstSentence(chapters[0]?.sections ?? []) || brief.productTitle, finalLine: lastSentence(chapters.at(-1)?.sections ?? []),
    chapters,
    ...(brief.timeline ? { timeline: { cards: brief.timeline.entries.map(card => timelineCard(card, brief.timeline!.tenGodNotes, birthYear, cardOf.get(card.key)?.card, cardOf.get(card.key)?.bad)), tenGodNotes: brief.timeline.tenGodNotes, thisYear: brief.chart.thisYear.year, age: brief.person.age,
      cycles: brief.timeline.cycles.map(c => { const [s, e] = c.years.split("~").map(Number), x = c.ages?.match(/^만 (\d+)~(\d+)세$/); return { ganji: c.ganji, years: c.years, ages: x ? [Number(x[1]), Number(x[2])] as const : [manAge(s, birthYear), manAge(e, birthYear)] as const, tenGod: c.tenGod, current: c.current, ...(c.label ? { label: c.label } : {}) }; }),
      ...(brief.timeline.lifetime ? { lifetime: brief.timeline.lifetime } : {}) } } : {}),
    ...(annualYear !== undefined ? { annual: { year: annualYear, keywords: a.keywords?.length === 3 ? a.keywords : (brief.display?.keywords ?? []), keywordSource: a.keywords?.length === 3 ? "writer" as const : "engine" as const,
      ...(brief.display?.verdict ? { verdict: brief.display.verdict } : {}), ...(brief.display?.lucky ? { lucky: brief.display.lucky } : {}), ...(brief.display?.samjae ? { samjae: brief.display.samjae } : {}) } } : {}),
    // 최종판2 1-1: 궁합 첫 쪽 관계 그림도 작가 표지 줄(엔진 기본 줄은 작가 표지가 없을 때만).
    ...(brief.compatibility ? { pairImage: a.cover ? { ...brief.compatibility.pairImage, line: a.cover, ruleId: `${brief.compatibility.pairImage.ruleId}:writer` } : brief.compatibility.pairImage } : { coreImage: a.image ? { line: a.image, ruleId: `${brief.chart.coreImage.ruleId}:writer` } : brief.chart.coreImage }),
    ...(brief.appendix ? { appendix: brief.appendix } : {}),
    ...glossaryOf(brief, chapters),
    ...(a.cover ? { coverLine: a.cover } : {}),
    ...dayunOf(brief),
  };
  const c = brief.compatibility;
  const pair = c ? {
    category: c.lens.focus,
    characters: [c.a, c.b].map(p => ({ name: p.callName.replace(/님$/, ""), core: p.image, strength: brief.traits.find(t => t.id === p.traitIds[0])?.easyName ?? "", relationship: p.role === p.callName ? "" : p.role.replace(/\(.*\)$/, "") })),
    relations: c.dayRelations, relationsPlain: c.relationsPlain, ...(c.relationsSummary ? { relationsSummary: c.relationsSummary } : {}),
    score: { total: c.score.value, version: c.score.version as V5ScoreV2["version"], band: c.score.band.label, verdict: c.score.band.verdict, notice: c.score.notice, components: c.score.components.map(x => ({ name: x.name, points: x.points, max: x.max, reason: x.onScorePage })) },
    directions: (["direction-ab", "direction-ba"] as const).map((id, i) => ({ title: a.plan.find(ch => ch.id === id)?.title ?? "", effect: headSentence((i ? c.tenGodBA : c.tenGodAB).reading), term: noHan((i ? c.tenGodBA : c.tenGodAB).tenGod), chapterN: a.plan.find(ch => ch.id === id)?.n ?? 0 })),
  } : undefined;
  const p = brief.person.facts;
  const context = c ? [{ label: "관계", value: c.lens.focus }] : [
    { label: "현재 직업", value: p.job.detail || "-" }, { label: "현재 관계", value: { single: "솔로", dating: "연애", married: "기혼", unknown: "미선택" }[p.relationship] },
    ...(brief.product === "annual_fortune" ? [{ label: "선택 연도", value: String(annualYear) }] : []),
  ];
  const evidence: V5Evidence = {
    version: V5_EVIDENCE_VERSION, productType: brief.product, generatedAt: a.generatedAt, input: a.payload, people: a.people,
    names: c ? `${c.a.callName.replace(/님$/, "")} · ${c.b.callName.replace(/님$/, "")}` : brief.person.name, context, ...(pair ? { pair } : {}),
    meta: {
      writer: a.writer, promptVersion: a.promptVersion, knowledgeVersion: a.knowledgeVersion, briefVersion: brief.version, briefHash: a.briefHash,
      tokens: a.tokens, costUsd: a.costUsd, calls: a.calls, durationMs: a.durationMs, recovered: a.recovered, fallback: a.fallback ?? null, scenes: usedScenesOf(brief), explained: explainedOf(brief), priorBooks: a.priorBooks ?? 0,
      ledger: (() => { const l = ledgerOf(brief); return { ...l, newShare: newEvidenceShare(l, a.priorLedger) }; })(),
      chapters: a.finals.map(f => ({ n: f.n, id: f.id, title: f.title, source: f.source, ...(f.reason ? { reason: f.reason } : {}), chars: f.chars, evidence: chapterEvidence(brief, a.plan.find(ch => ch.n === f.n)!) })),
      safety: { deletions: a.report.deletions.length, byRule, warnings: a.report.warnings.length, ...(a.report.metrics ? { metrics: a.report.metrics } : {}) },
      ...(a.raw?.length ? { raw: a.raw } : {}),
      ...(a.review ? { review: a.review } : {}), ...(a.test ? { test: true } : {}),
      ...(brief.compatibility?.profiles?.length ? { profiles: brief.compatibility.profiles.map(p => p.line) } : {}),
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

/** 핵심 구절(keySpans)은 글자 범위가 문단 안일 때만 옮긴다. */
const keySpanOf = (s: BookSection, i: number, text: string) => { const k = s.keySpans?.[i]; return k && k[0] >= 0 && k[0] < k[1] && k[1] <= text.length ? { keySpan: [k[0], k[1]] as [number, number] } : {}; };
const toParagraphs = (sections: readonly BookSection[]): BookParagraph[] => sections.flatMap(s => s.paragraphs.map((text, i) => ({ text, notes: [], ...(i === 0 && s.heading ? { heading: s.heading } : {}), ...keySpanOf(s, i, text) })));
/** 용어 뜻(P6c-ui2 g): 브리프의 용어 목록 중 본문에 실제로 나온 것만 Book에 남긴다(화면과 같은 찾기 규칙). */
function glossaryOf(brief: Brief, chapters: readonly V5Chapter[]): { glossary?: Brief["glossary"] } {
  if (!brief.glossary?.length) return {};
  const body = chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs)).join("\n");
  const found = new Set([...body.matchAll(termPattern(brief.glossary.map(t => t.name)))].map(m => m[1]));
  const used = brief.glossary.filter(t => found.has(t.name));
  return used.length ? { glossary: used } : {};
}
const TIME = (y: number, now: number) => (y < now ? "돌아보기" : y === now ? "지금" : "앞으로");
const noHanja = (s: string) => s.replace(/\([^)]*\)/g, "").trim();
/** 표 한 줄 값. todo는 "해 볼 것", review는 "돌아보기"(P6b 이전 Book의 추천 행동도 "해 볼 것"). */
const rowExtras = (c: V5TimelineCard) => ({ tenGod: noHanja(c.tenGod.stem), flow: c.flow.score, keywords: [...c.keywords], badges: c.badges.map(b => ({ label: b.label, line: b.line, ...(b.with ? { with: b.with } : {}) })),
  goodLabel: c.review && !c.todo ? "돌아보기" : "해 볼 것", ...(c.badges.length ? { relationsPlain: cardRelationsPlain(c) } : {}) });
/** 카드 관계 배지 → 쉬운 문장 1~2줄(P6c-ui2 i, 궁합 relationsPlain과 같은 문장 틀). 들어오는 글자와 내 자리(with)의 관계, 뜻은 배지 문장.
 * 배지가 여럿이면 앞의 둘만(나머지 이름은 상세의 작은 글씨). 달 카드는 "해"를 "달"로. 공망처럼 자리 관계가 아닌 배지는 뜻 문장만. */
export function cardRelationsPlain(c: Pick<V5TimelineCard, "kind" | "badges">): string[] {
  const unit = c.kind === "month" ? "달" : "해";
  return c.badges.slice(0, 2).map(b => {
    const half = b.kind === "SAMHAP" && b.label.endsWith("(반쯤)");
    // 최종판3 7: 반합 뜻은 "완성"이 아니라 반쯤 묶임(labels.halfHapLine, 저장된 카드 줄도 화면에서 같은 문구로).
    const raw = b.line.replace(/^반합\([^)]*\): /, ""), line = (half ? halfHapLine(raw) : raw).replace(/ 해$/, ` ${unit}`).replace(/에 든 해,/, `에 든 ${unit},`);
    const glyph = b.kind === "STEM_HAP" ? "하늘 글자" : "땅 글자";
    return b.kind in REL_PLAIN && b.with ? relationPlain(`이 ${unit}의 ${glyph}`, `${b.with} ${glyph}`, b.kind, half, line) : `${line}이에요.`;
  });
}
const LEVEL_POINTS = { 좋음: 3, 보통: 2, 조율: 1 } as const;
const HAP_NAMES = new Set(["천간합", "육합", "삼합", "방합", "반합"]);
/** 대운 표 위 전환 줄(최종판3 8): 표에 보이는 해에 시작하는 대운만, 공통 표기(labels.dayunLabel) 그대로. "무진 대운: 2027년 5월 무렵부터 (대운수 7)" → 날짜 "2027년 5월 무렵부터 (대운수 7)", 앞뒤 "기사 대운 → 무진 대운". */
function dayunTransitions(cycles: readonly V5Cycle[], years: readonly number[], keyPage: ReadonlyMap<string, number>) {
  return cycles.flatMap((c, i) => {
    const start = Number(c.years.slice(0, 4)), [name, date] = c.label?.split(": ") ?? [];
    const before = cycles[i - 1]?.label?.split(": ")[0];
    return c.label && date && before && years.includes(start) ? [{ date, before, after: name, page: keyPage.get(String(start)) ?? 0 }] : [];
  });
}
const importance = (score: number) => (score >= 4 ? "HIGH" : score === 3 ? "MEDIUM" : "BACKGROUND") as "HIGH" | "MEDIUM" | "BACKGROUND";

/** 세운 달 카드의 절기월 구간(P6b-ui): 시작은 라벨의 "(MM/DD 절입부터)", 끝은 다음 달 절입일(12번째는 이듬해 입춘일).
 * 절입은 그날 중간에 바뀌므로 끝 날짜는 이 달에도 걸친다(P6c-ui2 결정: "2/4~3/5", 다음 줄 "3/5~4/5").
 * key의 Mxx는 절기 순서(M01 = 인월). 달력 달 이름은 쓰지 않는다. */
export function seasonMonths(cards: readonly Pick<V5TimelineCard, "key" | "label">[]) {
  const starts = cards.map(c => {
    const year = Number(c.key.slice(0, 4)), index = Number(c.key.slice(-2));
    const m = c.label.match(/\((\d{2})\/(\d{2})(?: 절입부터|~)\)/);
    return m ? `${Number(m[1]) < 2 && index >= 11 ? year + 1 : year}-${m[1]}-${m[2]}` : getMonthlyPillars(year)[index - 1].startKst.slice(0, 10);
  });
  const last = cards.at(-1), next = last ? getMonthlyPillars(Number(last.key.slice(0, 4)) + 1)[0].startKst.slice(0, 10) : "";
  const md = (day: string) => `${Number(day.slice(5, 7))}/${Number(day.slice(8, 10))}`;
  return cards.map((c, i) => {
    const start = starts[i], end = starts[i + 1] ?? next;
    return { order: Number(c.key.slice(-2)), start, end, range: `${md(start)}~${md(end)}` };
  });
}
/** 기준일(KST 날짜)이 든 절기월이 "지금"(시험: 2026-11-03 → 9번째 달 戊戌). */
export const seasonTime = (m: { start: string; end: string }, today: string) => today >= m.end ? "돌아보기" : today >= m.start ? "지금" : "앞으로";
/** 세운 달 이름(P6c-ui2 h): 표와 상세 모두 "N번째 달 · 경인월 · 2/4~3/5". sub는 표 줄의 아랫줄. */
export const seasonLabel = (m: { order: number; range: string }, hangul: string) => ({ title: `${m.order}번째 달 · ${hangul}월 · ${m.range}`, sub: `${hangul}월 · ${m.range}` });

/** 판 표기(표지·마지막 쪽): "제5판 · 2026년 11월 3일 개정". P6b 이전 v5 Book은 없음. */
/** 최종판 1-13: 제6판부터 "제6판 · 2026년 11월 4일 기준"(기준일은 본문이 아니라 여기에만). 그 전 Book은 "제5판 · … 개정" 그대로. */
export const v5EditionLabel = (draft: unknown) => { const d = draft as V5BookDraft | null, e = d?.edition; return e ? (d?.baseDate ? `${e.label} · ${koreanDate(d.baseDate)} 기준` : `${e.label} · ${koreanDate(e.revisedAt)} 개정`) : undefined; };

/** 저장된 v5 스냅샷 → 기존 렌더러가 그대로 보여 주는 BookData.
 * today(KST 날짜): 표의 지금·돌아보기·앞으로 기준. 열람 화면은 읽는 날을 넘기고, 없으면 책을 만든 날. */
export function projectV5Book(snapshot: ProductPreviewSnapshot, today?: string): BookData | null {
  if (snapshot.productVersion !== "v5") return null;
  const d = snapshot.draft as unknown as V5BookDraft, e = snapshot.evidencePacket as V5Evidence;
  if (!validateV5Publication(snapshot.productType, d, e).ok) return null;
  const book = BOOKS.find(b => b.productKey === d.productType)!;
  // 표지 아래 한 줄: coverLine(P6c-ui2) → 핵심 이미지 한 줄(P6c) → 예전 첫 문장(P6b 이전, 궁합).
  const pages: BookPage[] = [{ kind: "cover", title: d.title, names: e.names, headline: (typeof d.coverLine === "string" && d.coverLine.trim()) || (d.coreImage?.line ?? d.headline) }];
  // AM 2부: 세운 신년판 첫 장 키워드 카드(0). 이미지 저장·공유는 화면이 붙인다.
  if (d.annual?.keywords.length) pages.push({ kind: "keywords", title: `나의 ${d.annual.year} 키워드`, year: d.annual.year, keywords: [...d.annual.keywords], line: (typeof d.coverLine === "string" && d.coverLine.trim()) || (d.coreImage?.line ?? ""), ...(d.annual.verdict ? { verdict: d.annual.verdict } : {}) });
  if (!e.pair && e.people.length) pages.push({ kind: "input", title: "이 책의 주인공" });
  // 최종판3 7: 관계 요약이 있는 Book은 첫 쪽에 묶음 요약 + 영향 큰 3줄, 전체 목록은 부록. 없는 Book(이전)은 첫 쪽에 전체 목록 그대로.
  const relSum = e.pair?.relationsSummary, relAll = e.pair?.relationsPlain ?? [];
  if (e.pair) pages.push({ kind: "pair", title: "우리라는 사이", category: e.pair.category, characters: [...e.pair.characters], directions: [], relations: [...e.pair.relations],
    ...(d.pairImage ? { image: d.pairImage.line } : {}), ...(e.pair.relationsPlain ? (relSum ? { relationsPlain: relAll.slice(0, 3), relationsSummary: relSum.line, relationsTotal: relAll.length } : { relationsPlain: [...relAll] }) : {}) });
  const sc = e.pair?.score;
  // 점수 쪽: 총점·구간 이름·항목 막대·항목 이유. v2(P6c)는 항목 점수/만점, v5-1(P4·P6b-ui)은 수준 3칸 그대로.
  if (sc) {
    const v2 = "notice" in sc ? sc : null;
    pages.push({ kind: "score", scoreVersion: sc.version, title: "타고난 맞물림", total: sc.total, band: sc.band,
      // 최종판3 7: 맨 앞 기본점 줄(40/40)로 줄 합 = 총점. 새 Book은 저장된 줄 그대로, 기본점 줄이 없는 v2 Book은 합이 맞을 때만 화면에서 붙인다(저장본은 바꾸지 않음).
      scores: v2 ? [...(() => { const b = baseRowOf(v2.total, v2.components); return b ? [{ label: b.name, value: b.points, max: b.max, reason: b.reason }] : []; })(), ...v2.components.map(x => ({ label: x.name, value: x.points, max: x.max, reason: x.reason }))]
        : (sc as V5ScoreV51).components.map(x => ({ label: x.name, value: LEVEL_POINTS[x.level], max: 3, reason: x.line })),
      verdict: sc.verdict, notice: v2 ? v2.notice : "두 사람의 명리와 MBTI가 맞물리는 정도를 정해진 규칙으로 계산했어요. 항목은 3칸 중 몇 칸이 맞물리는지로 보여 줍니다.", limitations: [] });
  }
  e.people.forEach((p, i) => pages.push({ kind: "manse", title: `${p.name}의 만세력`, person: i }, { kind: "mbti", title: `${p.name}의 MBTI`, person: i }));
  // AM 3부: 평생 대운 지도(0) — 대운 전부, 시작 만 나이·연도·간지·십성·한 줄 주제.
  if (d.timeline?.lifetime?.length) pages.push({ kind: "lifetime", title: "평생 대운 지도", cycles: d.timeline.lifetime.map(c => ({ label: c.label, ages: c.ages, tenGod: c.tenGod, theme: c.theme, current: c.current })) });
  const chapterPage = new Map<number, number>(), keyPage = new Map<string, number>();
  const monthCards = d.timeline?.cards.filter(c => c.kind === "month") ?? [];
  // AM 2부 신년판 카드(span 있음): 절기 구간은 엔진 절입 시각, 이름은 라벨 앞부분 「2월 · 임인월」(표와 본문이 한 체계). 이전 v5 카드는 예전 방식.
  const spanned = monthCards.some(c => (c as V5TimelineCard & { span?: unknown }).span);
  const season = spanned ? monthCards.map((c, i) => { const sp = (c as V5TimelineCard & { span: { start: string; end: string } }).span, md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
    return { order: i, start: sp.start.slice(0, 10), end: sp.end.slice(0, 10), range: `${md(sp.start)}~${md(sp.end)}` }; }) : seasonMonths(monthCards);
  const monthLabel = new Map(monthCards.map((c, i) => [c.key, spanned ? { title: c.label, sub: c.label.split(" (")[0] } : seasonLabel(season[i], c.ganji.hangul)]));
  for (const ch of d.chapters) {
    if (!ch.keys) { chapterPage.set(ch.n, pages.length); pages.push({ kind: "narrative", id: ch.n === 1 ? "core" : `chapter-${ch.id}`, title: ch.title, paragraphs: toParagraphs(ch.sections), notes: [] });
      // AM 2부: 운을 쓰는 법 장 뒤에 나를 돕는 색·방향·숫자(+ 삼재 해당 띠만), 이어지는 큰 흐름 장 뒤에 대운으로 이어 보기.
      if (ch.id === "use" && d.annual?.lucky) pages.push({ kind: "lucky", title: "나를 돕는 색·방향·숫자", name: d.annual.lucky.name, colors: [...d.annual.lucky.colors], direction: d.annual.lucky.direction, numbers: [...d.annual.lucky.numbers], why: d.annual.lucky.why, ...(d.annual.samjae ? { samjae: d.annual.samjae } : {}) });
      if (ch.id === "next" && d.annual) pages.push({ kind: "continue", title: "앞으로 10년의 흐름, 대운으로 이어 보기", text: `${d.annual.year}년은 지금 10년 흐름의 한 해예요. 대운 「앞으로의 나」는 평생 대운 지도와 앞으로 10년을 한 권에 담아요. 같은 입력으로 바로 이어 볼 수 있어요.`, href: `/report/new?product=major-fortune&from=${encodeURIComponent(snapshot.reportId)}` });
      continue; }
    pages.push(d.productType === "major_fortune" ? { kind: "timeline", title: ch.title, years: [], transitions: [] } : { kind: "months", title: ch.title, months: [] });
    for (const s of ch.sections) {
      const card = d.timeline?.cards.find(c => c.key === s.heading);
      keyPage.set(s.heading, pages.length);
      pages.push({ kind: "narrative", id: `${ch.id}-${s.heading}`, title: monthLabel.get(s.heading)?.title ?? card?.label ?? s.heading, paragraphs: s.paragraphs.map((text, i) => ({ text, notes: [], ...keySpanOf(s, i, text) })), notes: [] });
    }
  }
  if (d.timeline) {
    const t = d.timeline, cards = t.cards, day = today ?? kstDay(e.generatedAt);
    const text = (key: string) => d.chapters.flatMap(c => c.sections).find(s => s.heading === key)?.paragraphs[0] ?? "";
    const tl = pages.find((p): p is Extract<BookPage, { kind: "timeline" }> => p.kind === "timeline");
    // P6b(p6b-fields.md 5): 그림 줄·할 일/돌아보기·살필 점·만 나이·기간 상태는 카드 필드에서. 없으면(P6b 이전 Book) 예전 방식.
    // P6b-ui: 표 한 줄 값(십성·흐름 세기·핵심어·관계 배지), 할 일/돌아보기 이름, 지금·돌아보기·앞으로는 기준일(today) 대비.
    // 최종판3 8: 대운 전환 표시는 공통 대운 표기(카드 dayun.start, cycles[].label = labels.dayunLabel). 표기가 없는 이전 Book은 예전 말 그대로.
    if (tl) tl.years = cards.filter(c => c.kind === "year").map(c => ({ year: Number(c.key), age: c.age ?? t.age + Number(c.key) - t.thisYear, ...(c.age !== undefined ? { ageLabel: `만 ${c.age}세` } : {}), ...((c as V5TimelineCard & { keyYear?: { rank: number; reasons: string[] } }).keyYear ? { keyYear: (c as V5TimelineCard & { keyYear: { rank: number; reasons: string[] } }).keyYear } : {}), cycle: c.dayun?.ganji ?? "", annual: c.ganji.hanja, theme: c.keywords.join(" · "), good: c.todo ?? c.review ?? c.action.text,
      caution: c.caution !== undefined ? c.caution : t.tenGodNotes[c.tenGod.stem]?.caution ?? null, title: c.imageLine ?? headSentence(text(c.key)) ?? c.label, time: TIME(Number(c.key), Number(day.slice(0, 4))), page: keyPage.get(c.key) ?? 0, transition: c.dayun?.transition ? (c.dayun.start ?? "큰 흐름이 바뀌는 해") : null, importance: importance(c.flow.score), ...rowExtras(c) }));
    if (tl) tl.transitions = dayunTransitions(t.cycles ?? [], tl.years.map(y => y.year), keyPage);
    const ms = pages.find((p): p is Extract<BookPage, { kind: "months" }> => p.kind === "months");
    // 달은 절기월 순번·날짜 구간으로 보여 주고(달력 달 이름 없음), 지금은 기준일이 든 절기월(P6b-ui: 달력 달 번호를 붙여 엉뚱한 달로 보였다).
    if (ms) ms.months = monthCards.map((c, i) => { const x = c as V5TimelineCard & { good?: string; signals?: Record<string, string>; bridge?: boolean };
      const base = { month: season[i].order, order: season[i].order, range: season[i].range, sub: monthLabel.get(c.key)!.sub, title: c.imageLine ?? headSentence(text(c.key)) ?? c.label, theme: c.keywords.join(" · "), time: seasonTime(season[i], day), ganji: c.ganji.hanja,
        gods: `${c.tenGod.stem} · ${c.tenGod.branch}`, markers: c.badges.map(b => b.label), page: keyPage.get(c.key) ?? 0, good: c.todo ?? c.review ?? c.action.text, ...(c.caution ? { caution: c.caution } : {}), importance: importance(c.flow.score), ...rowExtras(c) };
      if (!spanned) return base;
      // AM 2부: 한 줄(그림) · 좋은 것 · 주의할 것(살필 점) · 이달의 한 가지(해 볼 것), 영역 신호.
      return { ...base, name: c.label.split(" (")[0].replace(/ · \d{4}년 .+ 마지막 달$/, ""), ...(x.bridge ? { bridge: true } : {}), ...(x.signals ? { signals: (["love", "money", "work", "people", "mind"] as const).map(k => `${({ love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" })[k]} ${x.signals![k]}`).join(" · ") } : {}),
        good: x.good ?? base.good, goodLabel: "좋은 것", ...(c.todo ? { todo: c.todo } : {}) }; });
  }
  if (e.pair) { const pair = pages.find((p): p is Extract<BookPage, { kind: "pair" }> => p.kind === "pair")!; pair.directions = e.pair.directions.map(x => ({ title: x.title, effect: x.effect, term: x.term, page: chapterPage.get(x.chapterN) ?? 0 })); }
  // 부록(P6c): 사람마다 한 쪽, 번호는 이어서. 머리말은 "내 사주에 있는 기운과 그 뜻".
  const total = d.appendix?.reduce((n, p) => n + p.items.length, 0) ?? 0;
  let from = 1;
  (d.appendix ?? []).forEach((p, i) => {
    const pair = d.appendix!.length > 1, dayun = d.dayun?.[i]?.lines ?? [];
    pages.push({ kind: "appendix", title: pair ? `${p.name}의 모든 기운` : "내 모든 기운", lead: pair ? `${p.name}님 사주에 있는 기운과 그 뜻이에요.` : "내 사주에 있는 기운과 그 뜻이에요.", from, total,
      items: p.items.map(x => ({ name: x.name, meaning: x.meaning, manifestation: "", person: p.name, group: x.group, core: x.core })), ...(dayun.length ? { notes: [...dayun] } : {}) });
    from += p.items.length;
  });
  // 최종판3 7: 두 사람 사이 관계 전체(영향 큰 순). 첫 쪽에는 요약과 앞 3줄만.
  if (relSum && relAll.length) pages.push({ kind: "appendix", title: "두 사람 사이의 모든 기운", lead: "두 사람 글자 사이에서 찾은 관계 전부예요. 영향이 큰 것부터 적었어요.", from: 1, total: relAll.length,
    items: relAll.map((line, i) => { const name = relSum.names[i] ?? ""; return { name: name || "관계", meaning: line, manifestation: "", person: e.names, group: HAP_NAMES.has(name) ? "합" : "형·충·파·해" }; }) });
  pages.push({ kind: "back", title: "이 책 공유하기", finalLine: d.finalLine, aiNotice: AI_WRITTEN_NOTICE_KO }); // 최종3: 책 끝 AI 작성 고지(저장본은 그대로, 읽을 때만)
  return { bookId: book.id, title: d.title, names: e.names, people: [...e.people], context: [...e.context], pages: composeBookNavigation(pages), readingDate: e.generatedAt.slice(0, 10), ...(d.glossary?.length ? { glossary: d.glossary.map(t => ({ name: t.name, meaning: t.meaning })) } : {}), share: { title: `${e.names} · ${d.title}`, description: headSentence((typeof d.coverLine === "string" && d.coverLine.trim()) || d.headline) } };
}
