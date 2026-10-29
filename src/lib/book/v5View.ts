/**
 * v5 Book 읽기 화면용 표시 데이터(P5). 저장된 스냅샷만 읽고 본문은 건드리지 않는다.
 *  - 만세력 합·충: 저장된 네 기둥 글자로 엔진 관계 감지(detectRelations)를 돌려 기둥 쌍과 함께 전부 보여 준다.
 *  - 대운·세운 카드: 저장된 TimelineEntry 카드(draft.timeline.cards)를 카드·가로 타임라인 표시용으로 옮긴다.
 * 과거 v4 Book에는 쓰지 않는다(저장된 데이터 그대로, 재계산 없음).
 */
import type { BookData, BookTimelineCard } from "@/app/dev/book-preview/bookTypes";
import { detectRelations } from "@/lib/saju/detections/relations";
import type { ChartPosition, RelationHit } from "@/lib/saju/detections/types";
import type { EarthlyBranch, HeavenlyStem } from "@/lib/saju/types";
import type { V5BookDraft } from "@/lib/writer/book";

const POS: Record<ChartPosition, string> = { year: "연", month: "월", day: "일", hour: "시" };
const ORDER: ChartPosition[] = ["year", "month", "day", "hour"];
const ELEMENT_KO: Record<string, string> = { WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" };
const KIND: Record<RelationHit["kind"], string> = { STEM_HAP: "천간합", YUKHAP: "육합", SAMHAP: "삼합", BANGHAP: "방합", CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진" };
const TOKEN: Record<string, string> = { WOOD: "wood-green", FIRE: "fire-red", EARTH: "earth-soil", METAL: "metal-gold", WATER: "water-sky" };

/** "일지·시지 申辰 반합(수)" 같은 한 줄. 천간끼리면 "간", 지지끼리면 "지". */
export function relationLine(hit: RelationHit): { pair: string; text: string } {
  const part = hit.kind === "STEM_HAP" ? "간" : "지";
  const pair = [...hit.members].sort((a, b) => ORDER.indexOf(a.position as ChartPosition) - ORDER.indexOf(b.position as ChartPosition))
    .map(m => `${POS[m.position as ChartPosition]}${part}`).join("·");
  const name = hit.kind === "SAMHAP" && hit.completeness === "half" ? "반합" : hit.kind === "HYEONG" && hit.subtype ? hit.subtype : KIND[hit.kind];
  return { pair, text: `${hit.members.map(m => m.char).join("")} ${name}${hit.element ? `(${ELEMENT_KO[hit.element] ?? hit.element})` : ""}` };
}

/** 저장된 만세력 표의 기둥 글자 → 원국 관계 전부. 시주가 없으면(시간 미상) 시 자리는 빠진다. */
export function natalRelations(table: BookData["people"][number]["table"]): { pair: string; text: string }[] {
  const t = table.manse;
  const entries = ORDER.flatMap(position => {
    const stem = t.stemRow[position as keyof typeof t.stemRow]?.hanja, branch = t.branchRow[position as keyof typeof t.branchRow]?.hanja;
    return stem && branch ? [{ position, pillar: { stem: stem as HeavenlyStem, branch: branch as EarthlyBranch } }] : [];
  });
  const seen = new Set<string>();
  return detectRelations(entries).map(relationLine).filter(r => !seen.has(r.pair + r.text) && seen.add(r.pair + r.text));
}

/** 저장된 대운·세운 카드 → 표시용 카드. page는 그 키의 본문 쪽(없으면 연대표 쪽). */
export function timelineCards(data: BookData, draft: V5BookDraft): BookTimelineCard[] | undefined {
  const t = draft.timeline;
  if (!t?.cards.length) return undefined;
  const pageOf = (key: string) => {
    const i = data.pages.findIndex(p => p.kind === "narrative" && (p.id?.endsWith(`-${key}`) || p.anchors?.some(a => a.endsWith(`-${key}`))));
    return i >= 0 ? i : Math.max(0, data.pages.findIndex(p => p.kind === "timeline" || p.kind === "months"));
  };
  // 절기월 카드 라벨: "1번째 달 庚寅(경인) (02/04 절입부터)". 이번 달 = 기준일 이전에 시작한 마지막 달.
  const start = (label: string, year: number) => { const m = label.match(/\((\d{2})\/(\d{2}) 절입부터\)/); return m ? { month: Number(m[1]), day: Number(m[2]), iso: `${year}-${m[1]}-${m[2]}` } : null; };
  const reading = data.readingDate;
  const months = t.cards.filter(c => c.kind === "month");
  const current = months.filter(c => { const s = start(c.label, Number(c.key.slice(0, 4))); return s && s.iso <= reading && reading.slice(0, 4) === c.key.slice(0, 4); }).at(-1)?.key;
  return t.cards.map(c => {
    const year = Number(c.key.slice(0, 4)), s = c.kind === "month" ? start(c.label, year) : null;
    return {
      key: c.key, kind: c.kind, page: pageOf(c.key),
      heading: c.kind === "month" ? (s ? `${s.month}월 ${s.day}일부터` : c.label.split(" ")[0]) : `${year}년`,
      sub: c.kind === "month" ? (c.label.match(/^\S+ 달/)?.[0] ?? "") : `${t.age + year - t.thisYear}세`,
      now: c.when ? c.when === "now" : c.kind === "year" ? year === t.thisYear : c.key === current,
      ganji: { hanja: c.ganji.hanja, hangul: c.ganji.hangul, stem: TOKEN[c.colors.stem.element] ?? "", branch: TOKEN[c.colors.branch.element] ?? "" },
      tenGod: { stem: c.tenGod.stem, branch: c.tenGod.branch },
      badges: c.badges.map(b => ({ label: b.label, line: b.line, tone: b.tone })),
      flow: { score: c.flow.score, label: c.flow.label }, keywords: [...c.keywords], action: c.action.text,
      transition: Boolean(c.dayun?.transition), dayun: c.dayun?.ganji,
    };
  });
}

export function withV5Presentation(data: BookData, draft: V5BookDraft): BookData {
  return { ...data, people: data.people.map(p => ({ ...p, relations: natalRelations(p.table) })), timeline: timelineCards(data, draft) };
}
