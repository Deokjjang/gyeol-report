/**
 * 대운·세운 카드 "살필 점"(P6b E-2): 십성별 주의 문장 중 이 원국에서 조건이 성립하는 문장만 남긴다. 해당이 없으면 빈 문자열.
 * 조건(지식 DB ten-god-period.json year.caution[].when): 일간 강약, 원국 십성 개수, 십성 묶음 유무·개수. 조건이 없으면 누구에게나 해당.
 */
import type { CautionLine } from "@/data/knowledge-v5/schema";
import type { TenGod } from "@/lib/saju/types";
import { GROUP_WEAK } from "@/lib/saju/groupStrength";

export type CautionCtx = {
  /** 엔진 일간 강약(VERY_STRONG·STRONG → strong, WEAK·VERY_WEAK → weak). */
  readonly strength: string;
  readonly distribution: Readonly<Record<TenGod, number>>;
  readonly groups: Readonly<Record<"PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE", number>>;
};
type Group = keyof CautionCtx["groups"];
const GROUP: Readonly<Record<"peer" | "output" | "wealth" | "officer" | "resource", Group>> = { peer: "PEER", output: "OUTPUT", wealth: "WEALTH", officer: "OFFICER", resource: "RESOURCE" };

export function cautionHolds(when: CautionLine["when"], c: CautionCtx): boolean {
  if (!when) return true;
  const strong = c.strength === "STRONG" || c.strength === "VERY_STRONG", weak = c.strength === "WEAK" || c.strength === "VERY_WEAK";
  if (when.strength === "strong" && !strong) return false;
  if (when.strength === "weak" && !weak) return false;
  if (when.tenGod && (c.distribution[when.tenGod as TenGod] ?? 0) < (when.min ?? 1)) return false;
  // 묶음 세기는 만세력 가중값(P6d A): "받쳐 준다"는 약(1.5 미만)이 아닐 때만.
  if (when.groupAny && !when.groupAny.some(g => c.groups[GROUP[g]] >= GROUP_WEAK)) return false;
  if (when.groupMin && c.groups[GROUP[when.groupMin.group]] < when.groupMin.min) return false;
  return true;
}

export const cautionFor = (lines: readonly CautionLine[], c: CautionCtx): string => lines.filter(l => cautionHolds(l.when, c)).map(l => l.text).join(" ");
