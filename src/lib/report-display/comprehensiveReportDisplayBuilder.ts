import { MBTI_KNOWLEDGE_BY_TYPE } from "../report-knowledge/mbtiKnowledgeBase";
import type { MbtiType } from "../report-knowledge/mbtiKnowledgeTypes";
import { SAJU_KNOWLEDGE_BY_ID } from "../report-knowledge/sajuKnowledgeBase";
import type { ComputedSajuFacts } from "../report-knowledge/sajuComputedFactsTypes";
import type {
  ComputedGwiinId,
  ComputedSajuSpecialPatternId,
  ComputedSinsalId,
  KoreanGanji,
  KoreanHeavenlyStem,
} from "../report-knowledge/sajuComputedFactsTypes";
import type { TenGod } from "../report-knowledge/sajuKnowledgeTypes";
import type { ComprehensiveReportDisplayData } from "./comprehensiveReportDisplayTypes";

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

const mappableTenGodStrengths = new Set(["present", "strong", "excessive"]);

function labelForEntryId(entryId: string | undefined, fallback: string): string {
  if (entryId === undefined) {
    return fallback;
  }

  return SAJU_KNOWLEDGE_BY_ID.get(entryId)?.labelKo ?? fallback;
}

function getDayMasterDescription(stem: KoreanHeavenlyStem): string {
  const entry = SAJU_KNOWLEDGE_BY_ID.get(dayMasterEntryIdByStem[stem]);

  return entry?.summary ?? `${stem} 일간입니다.`;
}

function getDayPillarImage(ganji: KoreanGanji): string {
  const entry = SAJU_KNOWLEDGE_BY_ID.get(dayPillarEntryIdByGanji[ganji] ?? "");

  return entry?.coreImageKo ?? entry?.summary ?? `${ganji}일주`;
}

function labelsFromComputedIds<T extends string>(
  values: readonly T[],
  mapping: Record<T, string>,
): readonly string[] {
  return values.map((value) => labelForEntryId(mapping[value], value));
}

export function buildComprehensiveReportDisplayData(input: {
  readonly sajuFacts: ComputedSajuFacts;
  readonly mbtiType: MbtiType;
}): ComprehensiveReportDisplayData {
  const mbtiEntry = MBTI_KNOWLEDGE_BY_TYPE.get(input.mbtiType);

  if (mbtiEntry === undefined) {
    throw new Error("REPORT_DISPLAY_MBTI_NOT_FOUND");
  }

  return {
    sajuCard: {
      dayMaster: {
        label: labelForEntryId(
          dayMasterEntryIdByStem[input.sajuFacts.dayMaster],
          input.sajuFacts.dayMaster,
        ),
        description: getDayMasterDescription(input.sajuFacts.dayMaster),
      },
      dayPillar: {
        label: labelForEntryId(
          dayPillarEntryIdByGanji[input.sajuFacts.dayPillar],
          `${input.sajuFacts.dayPillar}일주`,
        ),
        image: getDayPillarImage(input.sajuFacts.dayPillar),
      },
      fiveElements: {
        counts: input.sajuFacts.fiveElementCounts,
        excessive: input.sajuFacts.excessiveElements,
        missing: input.sajuFacts.missingElements,
        useful: input.sajuFacts.usefulElements,
      },
      tenGods: {
        primary: input.sajuFacts.tenGodSignals
          .filter((signal) => mappableTenGodStrengths.has(signal.strength))
          .map((signal) => ({
            id: signal.tenGod,
            labelKo: labelForEntryId(
              tenGodEntryIdByTenGod[signal.tenGod],
              signal.tenGod,
            ),
            strength: signal.strength,
          })),
      },
      specialPatterns: labelsFromComputedIds(
        input.sajuFacts.specialPatterns,
        specialPatternEntryIdByComputedId,
      ),
      sinsal: labelsFromComputedIds(input.sajuFacts.sinsal, sinsalEntryIdByComputedId),
      gwiin: labelsFromComputedIds(input.sajuFacts.gwiin, gwiinEntryIdByComputedId),
    },
    mbtiCard: {
      type: input.mbtiType,
      labelKo: mbtiEntry.labelKo,
      commonAliasKo: mbtiEntry.commonAliasKo,
      functionStack: mbtiEntry.functionStack,
      coreTraits: [
        mbtiEntry.coreTemperamentKo ?? mbtiEntry.summary,
        ...mbtiEntry.traitTags.slice(0, 4),
      ],
      reportUsage: [
        "사주 해석을 대신하지 않고 체감 성향을 보조합니다.",
        ...mbtiEntry.sajuBridgeTags.slice(0, 4),
      ],
    },
  };
}
