/**
 * 구조 코드 3개(살인상생·식상생재·재생관). analyzeSajuStructure는 그대로 두고 여기서만 낸다.
 * 임계값은 extractSajuTags 고급 태그(FOOD_WEALTH_FLOW·KILLING_RESOURCE_FLOW: 두 그룹 ≥ 1.5)와 같은 점수.
 * 지식 DB rule이 더 엄격한 일간 조건(살인상생=일간 WEAK 이하, 나머지=WEAK 아님)을 더한다.
 */
import { GROUP_WEAK, groupValues } from "../groupStrength";
import type { SajuCalcResult } from "../types";
import type { StructureFlowHit } from "./types";

/** 두 묶음 모두 약(만세력 가중값 1.5 미만)이 아닐 때(P6d A: 묶음 세기 단일 기준). */
export const STRUCTURE_FLOW_THRESHOLD = GROUP_WEAK;

const round = (v: number) => Math.round(v * 100) / 100;

export function detectStructureFlows(saju: Pick<SajuCalcResult, "dayMaster" | "elements" | "structureAnalysis">): StructureFlowHit[] {
  const g = groupValues(saju);
  const strength = saju.structureAnalysis.dayMasterStrength;
  const weak = strength.level === "WEAK" || strength.level === "VERY_WEAK";
  const t = STRUCTURE_FLOW_THRESHOLD;
  const out: StructureFlowHit[] = [];
  if (g.OFFICER >= t && g.RESOURCE >= t && weak) {
    out.push({ code: "RESOURCE_SUPPORTS_DAYMASTER", scores: { OFFICER: round(g.OFFICER), RESOURCE: round(g.RESOURCE), dayMaster: strength.score } });
  }
  if (g.OUTPUT >= t && g.WEALTH >= t && !weak) {
    out.push({ code: "OUTPUT_GENERATES_WEALTH", scores: { OUTPUT: round(g.OUTPUT), WEALTH: round(g.WEALTH), dayMaster: strength.score } });
  }
  if (g.WEALTH >= t && g.OFFICER >= t && !weak) {
    out.push({ code: "WEALTH_GENERATES_OFFICER", scores: { WEALTH: round(g.WEALTH), OFFICER: round(g.OFFICER), dayMaster: strength.score } });
  }
  return out;
}
