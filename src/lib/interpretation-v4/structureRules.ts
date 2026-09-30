import type { GodFamily, StructureId } from "./structureTypes";
import type { TenGod } from "../saju/types";

export type StructureRule = {
  readonly id: StructureId;
  readonly label: string;
  readonly kind: "weakWealth" | "generation" | "resourceFlow" | "tension" | "mixed" | "heavy" | "absence";
  readonly groups: readonly (readonly TenGod[])[];
  readonly family?: GodFamily;
  readonly minimum: string;
  readonly connection: string;
  readonly suppress: readonly string[];
};
const output: readonly TenGod[] = ["食神", "傷官"], wealth: readonly TenGod[] = ["偏財", "正財"], resource: readonly TenGod[] = ["偏印", "正印"];
const flowMinimum = "각 군 가중 >=1.2, 의미 있는 서로 다른 위치 >=2, 투간+지지 기반 또는 본기 >=2";
export const STRUCTURE_RULES: readonly StructureRule[] = [
  { id: "wealthHeavyWeakDaymaster", label: "재다신약 후보", kind: "weakWealth", groups: [wealth], family: "wealth",
    minimum: "확실한 weak/veryWeak + 재성 우세 + 재성 가중이 비겁·인성의 1.5배 이상", connection: "재성 복수 위치와 지지 기반, 시주에 따른 판정 역전 없음",
    suppress: ["STRENGTH_NOT_CLEARLY_WEAK", "WEALTH_NOT_DOMINANT", "HOUR_UNCERTAIN"] },
  { id: "outputCreatesWealth", label: "식상생재 흐름", kind: "generation", groups: [output, wealth], minimum: flowMinimum,
    connection: "같은 기둥 또는 인접 기둥의 의미 있는 식상→재성; 최소 한쪽 투간", suppress: ["COEXISTENCE_WITHOUT_CONNECTION", "RESOURCE_RESTRAINS_OUTPUT"] },
  { id: "wealthCreatesOfficer", label: "재생관 흐름", kind: "generation", groups: [wealth, ["正官"]], minimum: flowMinimum,
    connection: "같은 기둥 또는 인접 기둥의 재성→정관. 편관 단독은 이 rule 대상 아님", suppress: ["COEXISTENCE_WITHOUT_CONNECTION", "MIXED_OFFICER_OR_HURTING_OFFICER"] },
  { id: "officerResourceFlow", label: "관인상생 흐름", kind: "resourceFlow", groups: [["正官"], resource], minimum: flowMinimum,
    connection: "정관→인성 인접 연결 및 그 인성→일간 연결. 편관과 구분", suppress: ["NO_RESOURCE_TO_DAYMASTER_PATH", "MIXED_OFFICERS", "WEALTH_RESTRAINS_RESOURCE", "HURTING_OFFICER_INTERFERENCE"] },
  { id: "killingResourceFlow", label: "살인상생 흐름", kind: "resourceFlow", groups: [["偏官"], resource], minimum: flowMinimum,
    connection: "편관→인성 인접 연결 및 그 인성→일간 연결", suppress: ["NO_RESOURCE_TO_DAYMASTER_PATH", "MIXED_OFFICERS", "WEALTH_RESTRAINS_RESOURCE", "OUTPUT_RESTRAINS_KILLING"] },
  { id: "hurtingOfficerMeetsOfficer", label: "상관견관 긴장", kind: "tension", groups: [["傷官"], ["正官"]], minimum: flowMinimum,
    connection: "양쪽 투간·지지 기반, 인접 천간의 실제 상극. 숨은 공존만으로 확정하지 않음", suppress: ["NO_EXPOSED_CONTROL_PATH", "RESOURCE_OR_WEALTH_MEDIATION"] },
  { id: "mixedOfficers", label: "관살혼잡 후보", kind: "mixed", groups: [["正官"], ["偏官"]], minimum: flowMinimum,
    connection: "서로 다른 천간에 정관·편관 노출, 각각 지지 기반", suppress: ["NOT_BOTH_EXPOSED_ROOTED", "RESOURCE_OR_OUTPUT_MEDIATION"] },
  ...(["peer", "output", "wealth", "officer", "resource"] as const).map((family, i): StructureRule => ({
    id: `${family}Heavy`, label: ["비겁 강함", "식상 강함", "재성 강함", "관성 강함", "인성 강함"][i], kind: "heavy", family, groups: [],
    minimum: "가중 >=2, 전체 십성 가중의 34% 이상, 의미 있는 복수 위치·투간·지지 기반", connection: "복수의 독립 위치와 투간/지장간 일치",
    suppress: ["NOT_DOMINANT_OR_UNROOTED"],
  })),
  { id: "noResource", label: "원국 인성 신호 없음", kind: "absence", family: "resource", groups: [resource], minimum: "확정 4주 모든 천간·지장간에서 0",
    connection: "범위 제한된 부재 관측, 능력/부모/학업의 부재 아님", suppress: ["INCOMPLETE_CHART", "PRESENT_HIDDEN_OR_VISIBLE"] },
  { id: "noOutput", label: "원국 식상 신호 없음", kind: "absence", family: "output", groups: [output], minimum: "확정 4주 모든 천간·지장간에서 0",
    connection: "범위 제한된 부재 관측, 말/창작 능력의 부재 아님", suppress: ["INCOMPLETE_CHART", "PRESENT_HIDDEN_OR_VISIBLE"] },
];
export const STRUCTURE_IDS = STRUCTURE_RULES.map(r => r.id);
