import { FIVE_ELEMENTS, SAJU_KNOWLEDGE_BY_ID } from "./sajuKnowledgeBase";
import type { FiveElement, TenGod } from "./sajuKnowledgeTypes";
import type {
  ComputedGwiinId,
  ComputedSajuFacts,
  ComputedSajuSpecialPatternId,
  ComputedSinsalId,
  ComputedTenGodSignalStrength,
  KoreanGanji,
  KoreanHeavenlyStem,
} from "./sajuComputedFactsTypes";

export type MappedSajuKnowledgeInput = {
  readonly sajuEntryIds: readonly string[];
  readonly warnings: readonly string[];
  readonly unmappedFacts: readonly string[];
};

const dayMasterEntryIdByStem = {
  갑: "day_master_gabmok",
  을: "day_master_eulmok",
  병: "day_master_byeonghwa",
  정: "day_master_jeonghwa",
  무: "day_master_muto",
  기: "day_master_gito",
  경: "day_master_gyeonggeum",
  신: "day_master_singeum",
  임: "day_master_imsu",
  계: "day_master_gyesu",
} as const satisfies Record<KoreanHeavenlyStem, string>;

const dayPillarEntryIdByGanji: Partial<Record<KoreanGanji, string>> = {
  갑신: "day_pillar_gapsin",
  기해: "day_pillar_gihae",
  갑자: "day_pillar_gabja",
  갑진: "day_pillar_gapjin",
  을사: "day_pillar_eulsa",
  병오: "day_pillar_byeongoh",
  정해: "day_pillar_jeonghae",
  무진: "day_pillar_mujin",
  경신: "day_pillar_gyeongsin",
  신유: "day_pillar_sinyu",
  임자: "day_pillar_imja",
  계묘: "day_pillar_gyemyo",
};

const elementEntryIdByElement = {
  wood: "element_wood",
  fire: "element_fire",
  earth: "element_earth",
  metal: "element_metal",
  water: "element_water",
} as const satisfies Record<FiveElement, string>;

const excessiveElementEntryIdByElement: Partial<Record<FiveElement, string>> = {
  earth: "element_earth_excess",
  metal: "element_metal_excess",
};

const missingElementEntryIdByElement: Partial<Record<FiveElement, string>> = {
  wood: "element_wood_missing",
  fire: "element_fire_missing",
  water: "element_water_missing",
};

const tenGodEntryIdByTenGod = {
  bijian: "ten_god_bijian",
  jie_cai: "ten_god_jie_cai",
  shi_shen: "ten_god_shi_shen",
  shang_guan: "ten_god_shang_guan",
  pian_cai: "ten_god_pian_cai",
  zheng_cai: "ten_god_zheng_cai",
  qi_sha: "ten_god_qi_sha",
  zheng_guan: "ten_god_zheng_guan",
  pian_yin: "ten_god_pian_yin",
  zheng_yin: "ten_god_zheng_yin",
} as const satisfies Record<TenGod, string>;

const mappableTenGodStrengths = new Set<ComputedTenGodSignalStrength>([
  "present",
  "strong",
  "excessive",
]);

const specialPatternEntryIdByComputedId = {
  jaeda_sinyak: "pattern_jaeda_sinyak",
  gwansal_mixed: "pattern_gwansal_honjob",
  siksang_saengjae: "pattern_siksang_saengjae",
  jaesaenggwan: "pattern_jaesaenggwan",
  salin_sangsaeng: "pattern_salin_sangsaeng",
  strong_day_master: "pattern_singang",
  weak_day_master: "pattern_sinyak",
  no_resource: "pattern_no_resource",
  no_output: "pattern_no_output",
  earth_excess_buries_metal: "pattern_toda_maegeum",
  metal_excess_cuts_wood: "pattern_geumda_mokjeol",
  wood_excess_feeds_fire: "pattern_mokda_hwasik",
  water_excess_floats_wood: "pattern_suda_mokbu",
} as const satisfies Record<ComputedSajuSpecialPatternId, string>;

const sinsalEntryIdByComputedId = {
  hyeonchim: "sinsal_hyeonchim",
  hongyeom: "sinsal_hongyeom",
  mangsin: "sinsal_mangsin",
  baekho: "sinsal_baekho",
  yeokma: "sinsal_yeokma",
  gwimun: "sinsal_gwimun",
  wonjin: "sinsal_wonjin",
  dohwa: "sinsal_dohwa",
  hwagae: "sinsal_hwagae",
  goegang: "sinsal_goegang",
  yangin: "sinsal_yangin",
  cheonmun: "sinsal_cheonmun",
  wolsal: "sinsal_wolsal",
  jangseong: "sinsal_jangseong",
  banan: "sinsal_banan",
} as const satisfies Record<ComputedSinsalId, string>;

const gwiinEntryIdByComputedId = {
  cheon_eul: "nobleman_cheoneul",
  cheon_deok: "nobleman_cheondeok",
  wol_deok: "nobleman_woldeok",
  munchang: "nobleman_munchang",
  taegeuk: "nobleman_taegeuk",
  jaego: "gwiin_jaego",
} as const satisfies Record<ComputedGwiinId, string>;

function appendExistingEntryId(input: {
  readonly outputIds: string[];
  readonly seenIds: Set<string>;
  readonly warnings: string[];
  readonly unmappedFacts: string[];
  readonly factLabel: string;
  readonly entryId: string | undefined;
}): void {
  if (input.entryId === undefined) {
    input.warnings.push(`No knowledge mapping configured for ${input.factLabel}.`);
    input.unmappedFacts.push(input.factLabel);
    return;
  }

  if (!SAJU_KNOWLEDGE_BY_ID.has(input.entryId)) {
    input.warnings.push(
      `Mapped knowledge entry does not exist for ${input.factLabel}: ${input.entryId}.`,
    );
    input.unmappedFacts.push(input.factLabel);
    return;
  }

  if (!input.seenIds.has(input.entryId)) {
    input.outputIds.push(input.entryId);
    input.seenIds.add(input.entryId);
  }
}

export function mapComputedSajuFactsToKnowledgeEntryIds(
  facts: ComputedSajuFacts,
): MappedSajuKnowledgeInput {
  const sajuEntryIds: string[] = [];
  const seenIds = new Set<string>();
  const warnings: string[] = [];
  const unmappedFacts: string[] = [];

  const append = (factLabel: string, entryId: string | undefined): void =>
    appendExistingEntryId({
      outputIds: sajuEntryIds,
      seenIds,
      warnings,
      unmappedFacts,
      factLabel,
      entryId,
    });

  append(`dayMaster:${facts.dayMaster}`, dayMasterEntryIdByStem[facts.dayMaster]);
  append(`dayPillar:${facts.dayPillar}`, dayPillarEntryIdByGanji[facts.dayPillar]);

  for (const element of FIVE_ELEMENTS) {
    if (facts.fiveElementCounts[element] > 0) {
      append(`fiveElement:${element}`, elementEntryIdByElement[element]);
    }
  }
  for (const element of facts.excessiveElements) {
    append(`excessiveElement:${element}`, excessiveElementEntryIdByElement[element]);
  }
  for (const element of facts.missingElements) {
    append(`missingElement:${element}`, missingElementEntryIdByElement[element]);
  }
  for (const signal of facts.tenGodSignals) {
    if (mappableTenGodStrengths.has(signal.strength)) {
      append(`tenGod:${signal.tenGod}:${signal.strength}`, tenGodEntryIdByTenGod[signal.tenGod]);
    }
  }
  for (const pattern of facts.specialPatterns) {
    append(`specialPattern:${pattern}`, specialPatternEntryIdByComputedId[pattern]);
  }
  for (const signal of facts.sinsal) {
    append(`sinsal:${signal}`, sinsalEntryIdByComputedId[signal]);
  }
  for (const signal of facts.gwiin) {
    append(`gwiin:${signal}`, gwiinEntryIdByComputedId[signal]);
  }

  return {
    sajuEntryIds,
    warnings,
    unmappedFacts,
  };
}
