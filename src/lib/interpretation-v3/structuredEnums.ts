/** Reviewed literal domains of canonical structured contracts. Tests compare
 * these lists to the actual TS unions, so a new producer variant cannot hide. */
export const STRUCTURED_ENUMS = [
  { source: "src/lib/saju/types.ts", type: "HeavenlyStem", values: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] },
  { source: "src/lib/saju/types.ts", type: "EarthlyBranch", values: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] },
  { source: "src/lib/saju/types.ts", type: "YinYangLabel", values: ["YIN_HEAVY", "YANG_HEAVY", "BALANCED"] },
  { source: "src/lib/saju/types.ts", type: "ElementLabel", values: ["WOOD_STRONG", "WOOD_WEAK", "WOOD_MISSING", "FIRE_STRONG", "FIRE_WEAK", "FIRE_MISSING", "EARTH_STRONG", "EARTH_WEAK", "EARTH_MISSING", "METAL_STRONG", "METAL_WEAK", "METAL_MISSING", "WATER_STRONG", "WATER_WEAK", "WATER_MISSING"] },
  { source: "src/lib/saju/structureAnalysisTypes.ts", type: "DayMasterStrengthLevel", values: ["VERY_WEAK", "WEAK", "BALANCED", "STRONG", "VERY_STRONG"] },
  { source: "src/lib/saju/structureAnalysisTypes.ts", type: "SajuStructurePatternCode", values: ["WEAK_DAYMASTER_WITH_STRONG_WEALTH", "WEAK_DAYMASTER_WITH_STRONG_OUTPUT", "WEAK_DAYMASTER_WITH_STRONG_OFFICER", "RESOURCE_HEAVY", "PEER_HEAVY", "OUTPUT_HEAVY", "WEALTH_HEAVY", "OFFICER_HEAVY", "MIXED_OFFICER_KILLING", "RESOURCE_SUPPORTS_DAYMASTER", "OUTPUT_GENERATES_WEALTH", "WEALTH_GENERATES_OFFICER", "FIRE_METAL_TENSION", "WATER_WEAK_RECOVERY_NEEDED"] },
  { source: "src/lib/report-knowledge/annualFortuneTypes.ts", type: "AnnualBranchInteractionType", values: ["충", "육합", "삼합", "반합", "해", "형", "파"] },
  { source: "src/lib/report-knowledge/compatibilityRelationRules.ts", type: "CompatibilityBranchRelationKind", values: ["six_harmony", "three_harmony", "half_harmony", "clash", "harm"] },
  { source: "src/lib/report-knowledge/compatibilityRelationRules.ts", type: "FiveElementRelation", values: ["same", "generates", "generated_by", "controls", "controlled_by", "neutral"] },
  { source: "src/lib/report-knowledge/compatibilityDeepSajuBridge.ts", type: "CompatibilityDeepSajuLayer", values: ["day_master_relation", "cross_ten_god", "combined_element_climate", "element_complement", "branch_trine", "branch_clash", "branch_harm", "spouse_palace", "month_rhythm", "hour_life_rhythm"] },
  { source: "src/lib/report-knowledge/annualFortuneTypes.ts", type: "AnnualFortuneMode", values: ["past_review", "current_year", "new_year_preview", "locked_future"] },
  { source: "src/lib/saju/birthTimePrecisionTypes.ts", type: "BirthTimePrecision", values: ["exact", "approximate", "unknown"] },
  { source: "src/lib/report-knowledge/userContextTypes.ts", type: "UserLifeStatus", values: ["student", "exam_certificate", "job_seeker", "employee", "freelancer", "business_owner", "resting", "other"] },
  { source: "src/lib/report-knowledge/userContextTypes.ts", type: "UserRelationshipStatus", values: ["single", "dating", "married", "unknown"] },
  { source: "src/lib/report-knowledge/compatibilityTypes.ts", type: "CompatibilityCanonicalRelationshipType", values: ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] },
] as const;
