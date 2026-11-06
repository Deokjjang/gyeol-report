/**
 * v5 Book 만세력 표의 엔진 칸(P6): 십이신살·신살/귀인·합충형파해 줄을 analyzeChartDetections 결과로만 채운다.
 * - 관계: 구성원 자리 모두에 "글자 이름 · 상대 자리"를 적는다(예 일지 칸 "申辰 반합 · 시지", 시지 칸 "申辰 반합 · 일지").
 * - 신살·귀인: 엔진이 낸 모든 자리(그 글자·간지가 있는 기둥)에 적는다. 원진은 관계 줄에 짝으로 적는다.
 * - 엔진이 내지 않은 표식(v4 파생 표식, 일지 기준 십이신살 등)은 넣지 않는다. 기준표: docs/v5/shinsal-rules.md.
 * 발행 때 한 번 만들어 Book 스냅샷(people[].table)에 고정한다 — 읽을 때 다시 계산하지 않는다.
 * 타입만 가져온다(표 렌더러가 라벨 상수를 써도 엔진이 화면 번들에 들어가지 않게).
 */
import type { ChartDetections, ChartPosition, ExtraShinsalCode, RelationHit } from "../saju/detections/types";
import type { ManseRyeokDetailRow, ManseRyeokDetailRowKey } from "./types";

export const V5_ROW_LABELS = { twelveSinsal: "십이신살 · 연지 기준", sinsalAndGwiin: "신살/귀인", interactions: "합·충·형·파·해" } as const satisfies Partial<Record<ManseRyeokDetailRowKey, string>>;

const POSITIONS: readonly ChartPosition[] = ["year", "month", "day", "hour"];
const STEM_SLOT: Record<ChartPosition, string> = { year: "연간", month: "월간", day: "일간", hour: "시간" };
const BRANCH_SLOT: Record<ChartPosition, string> = { year: "연지", month: "월지", day: "일지", hour: "시지" };

/** 확장 신살·귀인 표 이름(지식 DB 이름에서 한자 뺀 것). */
export const EXTRA_SHINSAL_LABEL: Record<ExtraShinsalCode, string> = {
  GOEGANG: "괴강살", YANGIN: "양인살", WONJIN: "원진살", GWIMUN: "귀문관살", CHEONMUN: "천문성", EUMCHAK_YANGCHA: "음착양차살",
  CHEONRA_JIMANG: "천라지망", GONGMANG: "공망", AMROK: "암록", BOKSEONG: "복성귀인", CHEON_EUI: "천의성", GEUMYEO: "금여록",
  MUNGOK: "문곡귀인", JAEGO: "재고귀인",
};

export function relationName(r: RelationHit): string {
  switch (r.kind) {
    case "STEM_HAP": return "천간합";
    case "STEM_CHUNG": return "천간충";
    case "YUKHAP": return "육합";
    case "SAMHAP": return r.completeness === "full" ? "삼합" : "반합";
    case "BANGHAP": return "방합";
    case "CHUNG": return "충";
    case "HYEONG": return r.subtype === "자형" ? "자형" : r.subtype === "삼형" && r.completeness === "full" ? "삼형" : "형";
    case "PA": return "파";
    case "HAE": return "해";
    case "WONJIN": return "원진";
  }
}

/** 실제로 만난 글자만 규칙표 순서대로: 반합 申子辰 중 申·辰 → "申辰", 삼형 寅巳申 중 巳·申 → "巳申". */
export function relationChars(r: RelationHit): string {
  const key = [...r.key];
  return key.length === r.members.length ? r.key : key.filter((c) => r.members.some((m) => m.char === c)).join("");
}

const isStemRelation = (r: RelationHit) => r.kind === "STEM_HAP" || r.kind === "STEM_CHUNG";
/** 표 칸에 적는 자리 이름(연간·월지 …). */
export const slotName = (r: RelationHit, p: ChartPosition) => (isStemRelation(r) ? STEM_SLOT : BRANCH_SLOT)[p];

type Cells = Record<ChartPosition, string[]>;
const emptyCells = (): Cells => ({ year: [], month: [], day: [], hour: [] });

/** 관계 하나를 구성원 자리마다 "글자 이름 · 상대 자리"로. 같은 칸에서 글자·이름이 같으면 상대 자리를 합친다(巳申 육합 · 월지·일지). */
function interactionCells(relations: readonly RelationHit[]): Cells {
  const byCell = new Map<ChartPosition, Map<string, { r: RelationHit; partners: Set<ChartPosition> }>>();
  for (const r of relations) {
    const head = `${relationChars(r)} ${relationName(r)}`;
    const ps = r.members.map((m) => m.position as ChartPosition);
    for (const p of ps) {
      const heads = byCell.get(p) ?? new Map<string, { r: RelationHit; partners: Set<ChartPosition> }>();
      byCell.set(p, heads);
      const entry = heads.get(head) ?? { r, partners: new Set<ChartPosition>() };
      heads.set(head, entry);
      for (const q of ps) if (q !== p) entry.partners.add(q);
    }
  }
  const cells = emptyCells();
  for (const p of POSITIONS) {
    for (const [head, { r, partners }] of byCell.get(p) ?? []) cells[p].push(`${head} · ${POSITIONS.filter((q) => partners.has(q)).map((q) => slotName(r, q)).join("·")}`);
  }
  return cells;
}

/** 십이신살(연지 기준)과 신살·귀인(신살 먼저, 귀인 뒤). 같은 칸 같은 이름은 한 번. */
function markerCells(det: ChartDetections): { twelve: Cells; marks: Cells } {
  const twelve = emptyCells(), shinsal = emptyCells(), gwiin = emptyCells();
  const add = (cells: Cells, ps: readonly ChartPosition[], label: string) => { for (const p of ps) if (!cells[p].includes(label)) cells[p].push(label); };
  for (const s of det.shinsal) add(s.category === "TWELVE_SHINSAL" ? twelve : s.category === "NOBLE_HELP" ? gwiin : shinsal, s.positions, s.labelKo);
  for (const x of det.extraShinsal) if (x.code !== "WONJIN") add(x.family === "gwiin" ? gwiin : shinsal, x.positions, EXTRA_SHINSAL_LABEL[x.code]);
  const marks = emptyCells();
  for (const p of POSITIONS) marks[p] = [...shinsal[p], ...gwiin[p].filter((l) => !shinsal[p].includes(l))];
  return { twelve, marks };
}

/** 표에 적는 엔진 관계 전부: 천간(합·충) 먼저, 그다음 지지 관계(엔진 순서). */
export const v5TableRelations = (det: ChartDetections): RelationHit[] =>
  [...det.relations.filter(isStemRelation), ...det.stemClashes, ...det.relations.filter((r) => !isStemRelation(r))];

/** 엔진 결과 → 표 세 줄(십이신살·신살/귀인·합충형파해). 시간 미상이면 엔진에 시주가 없어 시주 칸은 비어 있다. */
export function v5NatalDetailRows(det: ChartDetections): ManseRyeokDetailRow[] {
  const { twelve, marks } = markerCells(det);
  return [
    { key: "twelveSinsal", label: V5_ROW_LABELS.twelveSinsal, cells: twelve },
    { key: "sinsalAndGwiin", label: V5_ROW_LABELS.sinsalAndGwiin, cells: marks },
    { key: "interactions", label: V5_ROW_LABELS.interactions, cells: interactionCells(v5TableRelations(det)) },
  ];
}

/** v4 계산으로 만든 표(지장간·십이운성 등)는 두고, 엔진 칸 세 줄만 v5 엔진 결과(같은 원국의 analyzeChartDetections)로 바꾼다. */
export function withV5NatalRows<T extends { readonly manse: { readonly detailRows: readonly ManseRyeokDetailRow[] } }>(table: T, det: ChartDetections): T {
  const rows = new Map(v5NatalDetailRows(det).map((r) => [r.key, r]));
  return { ...table, manse: { ...table.manse, detailRows: table.manse.detailRows.map((r) => rows.get(r.key) ?? r) } };
}
