/** 기존 detectShinsal이 내지 않는 신살·귀인 14종. 원국 자리만 받는다(시간 미상이면 시주 없음). */
import type { EarthlyBranch, HeavenlyStem } from "../types";
import {
  AMROK_BRANCH,
  BOKSEONG_BRANCH,
  CHEON_EUI_BRANCH,
  CHEONMUN_BRANCHES,
  CHEONRA_JIMANG_PAIRS,
  EUMCHAK_YANGCHA_PILLARS,
  GEUMYEO_BRANCH,
  GOEGANG_PILLARS,
  GWIMUN_TABLE,
  JAEGO_BRANCH,
  MUNGOK_BRANCH,
  YANGIN_BRANCH,
} from "./tables";
import type { ChartPosition, ExtraShinsalCode, ExtraShinsalHit, GongmangDetection, PositionedPillar, RelationHit } from "./types";

const ORDER: readonly ChartPosition[] = ["year", "month", "day", "hour"];
const sortPositions = (ps: Iterable<ChartPosition>) => {
  const set = new Set(ps);
  return ORDER.filter((p) => set.has(p));
};
const GWIIN_CODES: ReadonlySet<ExtraShinsalCode> = new Set(["AMROK", "BOKSEONG", "CHEON_EUI", "GEUMYEO", "MUNGOK", "JAEGO"]);

function make(code: ExtraShinsalCode, positions: Iterable<ChartPosition>, basis: string): ExtraShinsalHit | undefined {
  const sorted = sortPositions(positions);
  return sorted.length ? { code, family: GWIIN_CODES.has(code) ? "gwiin" : "shinsal", positions: sorted, basis } : undefined;
}

type Natal = { position: ChartPosition; stem: HeavenlyStem; branch: EarthlyBranch; ganji: string };

/**
 * natal: 원국 자리. relations: 같은 자리로 낸 원국 관계(원진 재사용). gongmang: 원국 공망.
 */
export function detectExtraShinsal(
  natalEntries: readonly PositionedPillar[],
  relations: readonly RelationHit[],
  gongmang: readonly GongmangDetection[],
): ExtraShinsalHit[] {
  const natal: Natal[] = natalEntries.map((e) => ({
    position: e.position as ChartPosition,
    stem: e.pillar.stem,
    branch: e.pillar.branch,
    ganji: e.pillar.stem + e.pillar.branch,
  }));
  const dayMaster = natal.find((n) => n.position === "day")?.stem;
  const monthBranch = natal.find((n) => n.position === "month")?.branch;
  if (!dayMaster || !monthBranch) throw new Error("extra shinsal needs day and month pillars");
  const at = (pred: (n: Natal) => boolean) => natal.filter(pred).map((n) => n.position);
  const byBranch = (branch: EarthlyBranch | undefined) => (branch ? at((n) => n.branch === branch) : []);
  const pairHits = (a: EarthlyBranch, b: EarthlyBranch, allowed?: (x: ChartPosition, y: ChartPosition) => boolean) => {
    const out: ChartPosition[][] = [];
    for (const x of natal) for (const y of natal) {
      if (ORDER.indexOf(x.position) >= ORDER.indexOf(y.position)) continue;
      const match = (x.branch === a && y.branch === b) || (x.branch === b && y.branch === a);
      if (match && (!allowed || allowed(x.position, y.position))) out.push([x.position, y.position]);
    }
    return out;
  };

  const goegang = at((n) => GOEGANG_PILLARS.includes(n.ganji));
  const yanginBranch = YANGIN_BRANCH[dayMaster];
  const wonjin = relations.filter((r) => r.kind === "WONJIN");
  const gwimunAdjacent = (x: ChartPosition, y: ChartPosition) => (x === "month" && y === "day") || (x === "day" && y === "hour");
  const gwimun = GWIMUN_TABLE.flatMap(([a, b]) => pairHits(a, b, gwimunAdjacent).map((ps) => ({ key: a + b, ps })));
  const cheonra = CHEONRA_JIMANG_PAIRS.flatMap(({ pair, name }) => pairHits(pair[0], pair[1]).map((ps) => ({ name, key: pair.join(""), ps })));
  const gongmangPositions = gongmang.flatMap((g) => g.positions);
  const cheonEuiBranch = CHEON_EUI_BRANCH[monthBranch];

  return [
    make("GOEGANG", goegang, `괴강 간지(庚辰·庚戌·壬辰·戊戌) ${natal.filter((n) => goegang.includes(n.position)).map((n) => n.ganji).join("·")}`),
    make("YANGIN", byBranch(yanginBranch), `일간 ${dayMaster} → ${yanginBranch ?? "-"}(양인, 양간만)`),
    make("WONJIN", wonjin.flatMap((r) => r.members.map((m) => m.position as ChartPosition)), `원진 ${wonjin.map((r) => r.key).join("·")}`),
    make("GWIMUN", gwimun.flatMap((g) => g.ps), `귀문 ${gwimun.map((g) => g.key).join("·")}(월-일·일-시)`),
    make("CHEONMUN", at((n) => CHEONMUN_BRANCHES.includes(n.branch)), "천문 지지 亥·卯·未·戌"),
    // 음착양차는 일주 살(통용). 월·시주 적용은 학파차이라 기본에서 뺀다 — 네 기둥 전부 보면 고객 55%에 떠서 정보량이 0이 된다(P2 빈도표).
    make("EUMCHAK_YANGCHA", at((n) => n.position === "day" && EUMCHAK_YANGCHA_PILLARS.includes(n.ganji)), `음착양차 일주 ${natal.find((n) => n.position === "day")?.ganji ?? ""}`),
    make("CHEONRA_JIMANG", cheonra.flatMap((c) => c.ps), `${[...new Set(cheonra.map((c) => `${c.name}(${c.key})`))].join("·")}`),
    make("GONGMANG", gongmangPositions, `공망 ${gongmang.map((g) => `${g.basis}:${g.xun}순 ${g.branches.join("")}`).join(" / ")}`),
    make("AMROK", byBranch(AMROK_BRANCH[dayMaster]), `일간 ${dayMaster} → ${AMROK_BRANCH[dayMaster]}(암록)`),
    make("BOKSEONG", byBranch(BOKSEONG_BRANCH[dayMaster]), `일간 ${dayMaster} → ${BOKSEONG_BRANCH[dayMaster]}(복성)`),
    make("CHEON_EUI", at((n) => n.position !== "month" && n.branch === cheonEuiBranch), `월지 ${monthBranch} → ${cheonEuiBranch}(천의)`),
    make("GEUMYEO", byBranch(GEUMYEO_BRANCH[dayMaster]), `일간 ${dayMaster} → ${GEUMYEO_BRANCH[dayMaster]}(금여)`),
    make("MUNGOK", byBranch(MUNGOK_BRANCH[dayMaster]), `일간 ${dayMaster} → ${MUNGOK_BRANCH[dayMaster]}(문곡)`),
    make("JAEGO", byBranch(JAEGO_BRANCH[dayMaster]), `일간 ${dayMaster} → ${JAEGO_BRANCH[dayMaster]}(재고)`),
  ].filter((h): h is ExtraShinsalHit => h !== undefined);
}
