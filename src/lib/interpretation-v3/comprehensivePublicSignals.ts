import type { ComprehensiveV3Draft } from "./comprehensive";
import type { Evidence } from "./types";
import type { SajuCalcResult } from "../saju/types";
import { storyFeatureRows, storySupport, unique } from "./comprehensiveStoryEvidence";
import { SAJU_DAY_PILLAR_BY_ID } from "../report-knowledge/sajuDayPillarKnowledge";

const COPY: Readonly<Record<string, readonly [string, string]>> = {
  "shinsal:GOSINSAL": ["사람 속에 있어도 자기 방 하나는 필요한 기운", "친밀함과 혼자 회복하는 시간을 구분하는 힘"],
  "shinsal:GWASUKSAL": ["가까운 사이에도 나만의 자리를 남기는 기운", "의존하지 않으면서 관계를 지키는 독립성"],
  twelve_sinsal_geopsal: ["쌓아둔 것을 흔드는 바람을 알아차리는 눈", "내 자원과 관계의 경계를 지키는 감각"],
  twelve_sinsal_yukhae: ["신발 속 작은 모래처럼 지나치지 못하는 불편", "작은 어긋남을 고쳐 생활을 편하게 하는 힘"],
  twelve_sinsal_jisal: ["발밑의 길이 바뀌며 새 풍경을 만나는 기운", "새 환경과 사람 속에서 경험을 넓히는 힘"],
  twelve_sinsal_jangseong: ["깃발 앞에 서서 방향을 잡는 장수", "명예·리더십·이름을 남기는 힘"],
  twelve_sinsal_banan: ["안장에 올라 자기 이름으로 자리를 맡는 모습", "자리·인정·사회적 역할을 키우는 좋은 패"],
  gwiin_jaego: ["얻은 것을 창고에 남겨 다음에 다시 쓰는 모습", "재물·기술·경험을 축적하는 힘"],
  gwiin_cheoneul: ["막힌 길에 사람의 손길을 잇는 귀인", "도움의 통로·인복·좋은 연결"],
  twelve_sinsal_cheonsal: ["갑자기 바뀐 날씨에 우산과 길을 다시 고르는 모습", "통제 밖의 변화에 여유와 예비 계획을 남기는 감각"],
  twelve_sinsal_nyeonsal: ["큰 조명 없이도 사람의 시선이 머무는 자리", "분위기와 인상으로 관계의 문을 여는 매력"],
  twelve_sinsal_wolsal: ["밝은 말 뒤에 남은 작은 그늘을 알아보는 눈", "미묘한 분위기를 읽는 섬세함·느낌을 확인하는 여유"],
  sinsal_goegang: ["무거운 문 앞에서도 쉽게 물러서지 않는 힘", "압박을 버티는 결단·밀어붙일 곳을 고르는 힘"],
  sinsal_wonjin: ["가까이 앉아도 의자의 각도가 조금 어긋난 모습", "작은 서운함을 쌓기 전에 관계의 간격을 맞추는 감각"],
};
const BASIS = ["연지 기준 십이신살", "일지 기준 십이신살", "연지 기준 표식", "일간 기준 표식", "일지 기준 도화", "일간 기준 귀인", "일간 기준", "일지 기준", "연지 기준"];
const POSITIONS: Readonly<Record<string, string>> = { year: "연주", month: "월주", day: "일주", hour: "시주" };
export type PublicSignalRow = { readonly label: string; readonly meaning: string; readonly power: string; readonly basis: readonly string[] };
/** Allowlisted human display DTO: raw IDs/provenance never cross into JSX,
 * attributes, React keys or a client component's serialized props. */
export function publicSignalRows(facts: readonly Evidence[], calculation: SajuCalcResult, draft: ComprehensiveV3Draft): readonly PublicSignalRow[] {
  const used = new Set([...draft.opening, ...draft.sections.flatMap(s => s.blocks)].flatMap(b => b.evidenceRefs));
  return storyFeatureRows(facts, calculation).map((row, index) => {
    const fs = facts.filter(f => row.evidenceRefs.includes(f.id)), support = storySupport(row.featureId, facts, calculation);
    return { row, index, day: fs.some(f => f.kind === "day_pillar"), used: fs.some(f => used.has(f.id)), support };
  }).toSorted((a, b) => Number(b.day) - Number(a.day) || Number(b.support.substantial) - Number(a.support.substantial) || Number(b.used) - Number(a.used) ||
    (b.support.weight ?? 0) - (a.support.weight ?? 0) || b.support.positions.length - a.support.positions.length || a.index - b.index)
    .map(({ row }) => ({ label: row.label, meaning: COPY[row.featureId]?.[0] ?? row.meaning,
      power: COPY[row.featureId]?.[1] ?? (row.power === "확인된 위치와 함께 읽는 성향의 단서" ? SAJU_DAY_PILLAR_BY_ID.get(row.featureId)?.coreKeywords.join(" · ") ?? row.power : row.power),
      basis: unique(row.details.map(d => {
        const basis = BASIS.find(s => d.basis.includes(s)) ?? (d.weight !== undefined ? "천간·지장간의 십성" : row.featureId.startsWith("structure:") ? "원국 기운의 분포" : row.featureId.includes("CLASH") || row.featureId.includes("COMBINATION") ? "원국 글자의 합·충" : row.featureId.startsWith("day_pillar_") ? "일간과 일지" : "원국 표식의 배치");
        return [basis, ...d.positions.map(p => POSITIONS[p]).filter(Boolean)].join(" · ");
      })) }));
}
