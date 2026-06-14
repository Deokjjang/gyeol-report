import type { FiveElement, TenGod } from "./sajuKnowledgeTypes";

export const SAJU_FEATURE_EXTRACTION_RULESET_VERSION = "v1" as const;

export const STEMS = [
  "갑",
  "을",
  "병",
  "정",
  "무",
  "기",
  "경",
  "신",
  "임",
  "계",
] as const;

export const BRANCHES = [
  "자",
  "축",
  "인",
  "묘",
  "진",
  "사",
  "오",
  "미",
  "신",
  "유",
  "술",
  "해",
] as const;

export type NormalizedStem = (typeof STEMS)[number];
export type NormalizedBranch = (typeof BRANCHES)[number];
export type NormalizedGanji = `${NormalizedStem}${NormalizedBranch}`;

const stemByAlias = new Map<string, NormalizedStem>([
  ["갑", "갑"],
  ["甲", "갑"],
  ["을", "을"],
  ["乙", "을"],
  ["병", "병"],
  ["丙", "병"],
  ["정", "정"],
  ["丁", "정"],
  ["무", "무"],
  ["戊", "무"],
  ["기", "기"],
  ["己", "기"],
  ["경", "경"],
  ["庚", "경"],
  ["신", "신"],
  ["辛", "신"],
  ["임", "임"],
  ["壬", "임"],
  ["계", "계"],
  ["癸", "계"],
]);

const branchByAlias = new Map<string, NormalizedBranch>([
  ["자", "자"],
  ["子", "자"],
  ["축", "축"],
  ["丑", "축"],
  ["인", "인"],
  ["寅", "인"],
  ["묘", "묘"],
  ["卯", "묘"],
  ["진", "진"],
  ["辰", "진"],
  ["사", "사"],
  ["巳", "사"],
  ["오", "오"],
  ["午", "오"],
  ["미", "미"],
  ["未", "미"],
  ["신", "신"],
  ["申", "신"],
  ["유", "유"],
  ["酉", "유"],
  ["술", "술"],
  ["戌", "술"],
  ["해", "해"],
  ["亥", "해"],
]);

export const elementFeatureIdByElement = {
  wood: {
    excess: "element_wood_excess",
    missing: "element_wood_missing",
  },
  fire: {
    excess: "element_fire_excess",
    missing: "element_fire_missing",
  },
  earth: {
    excess: "element_earth_excess",
    missing: "element_earth_missing",
  },
  metal: {
    excess: "element_metal_excess",
    missing: "element_metal_missing",
  },
  water: {
    excess: "element_water_excess",
    missing: "element_water_missing",
  },
} as const satisfies Record<FiveElement, { excess: string; missing: string }>;

export const tenGodFeatureIdByTenGod = {
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

export const specialPatternFeatureIdByAlias = new Map<string, string>([
  ["jaeda_sinyak", "structure_jaeda_sinyak"],
  ["재다신약", "structure_jaeda_sinyak"],
  ["no_resource", "structure_no_resource"],
  ["무인성", "structure_no_resource"],
  ["no_output", "structure_no_output"],
  ["무식상", "structure_no_output"],
  ["gwansal_mixed", "structure_gwansal_mixed"],
  ["관살혼잡", "structure_gwansal_mixed"],
  ["siksang_saengjae", "structure_siksang_saengjae"],
  ["식상생재", "structure_siksang_saengjae"],
  ["jaesaenggwan", "structure_jaesaenggwan"],
  ["재생관", "structure_jaesaenggwan"],
  ["salin_sangsaeng", "structure_salin_sangsaeng"],
  ["살인상생", "structure_salin_sangsaeng"],
  ["output_attacks_officer", "structure_sanggwan_gyeongwan"],
  ["sanggwan_gyeongwan", "structure_sanggwan_gyeongwan"],
  ["상관견관", "structure_sanggwan_gyeongwan"],
  ["peer_excess", "structure_bigeop_many"],
  ["bigeop_many", "structure_bigeop_many"],
  ["비겁다자", "structure_bigeop_many"],
  ["resource_excess", "structure_resource_many"],
  ["resource_many", "structure_resource_many"],
  ["인성다자", "structure_resource_many"],
]);

export const sinsalFeatureIdByAlias = new Map<string, string>([
  ["hyeonchim", "sinsal_hyeonchim"],
  ["현침", "sinsal_hyeonchim"],
  ["현침살", "sinsal_hyeonchim"],
  ["hongyeom", "sinsal_hongyeom"],
  ["홍염", "sinsal_hongyeom"],
  ["홍염살", "sinsal_hongyeom"],
  ["baekho", "sinsal_baekho"],
  ["백호", "sinsal_baekho"],
  ["백호살", "sinsal_baekho"],
  ["백호대살", "sinsal_baekho"],
  ["gwimun", "sinsal_gwimun"],
  ["귀문", "sinsal_gwimun"],
  ["귀문살", "sinsal_gwimun"],
  ["귀문관살", "sinsal_gwimun"],
  ["wonjin", "sinsal_wonjin"],
  ["원진", "sinsal_wonjin"],
  ["원진살", "sinsal_wonjin"],
  ["dohwa", "sinsal_dohwa"],
  ["도화", "sinsal_dohwa"],
  ["도화살", "sinsal_dohwa"],
  ["yangin", "sinsal_yangin"],
  ["양인", "sinsal_yangin"],
  ["양인살", "sinsal_yangin"],
  ["goegang", "sinsal_goegang"],
  ["괴강", "sinsal_goegang"],
  ["괴강살", "sinsal_goegang"],
  ["gongmang", "sinsal_gongmang"],
  ["공망", "sinsal_gongmang"],
  ["cheonmun", "sinsal_cheonmunseong"],
  ["천문", "sinsal_cheonmunseong"],
  ["천문성", "sinsal_cheonmunseong"],
  ["banan", "twelve_sinsal_banan"],
  ["반안", "twelve_sinsal_banan"],
  ["반안살", "twelve_sinsal_banan"],
  ["jangseong", "twelve_sinsal_jangseong"],
  ["장성", "twelve_sinsal_jangseong"],
  ["장성살", "twelve_sinsal_jangseong"],
  ["yeokma", "twelve_sinsal_yeokma"],
  ["역마", "twelve_sinsal_yeokma"],
  ["역마살", "twelve_sinsal_yeokma"],
  ["hwagae", "twelve_sinsal_hwagae"],
  ["화개", "twelve_sinsal_hwagae"],
  ["화개살", "twelve_sinsal_hwagae"],
  ["mangsin", "twelve_sinsal_mangsin"],
  ["망신", "twelve_sinsal_mangsin"],
  ["망신살", "twelve_sinsal_mangsin"],
  ["wolsal", "twelve_sinsal_wolsal"],
  ["월살", "twelve_sinsal_wolsal"],
  ["geopsal", "twelve_sinsal_geopsal"],
  ["겁살", "twelve_sinsal_geopsal"],
  ["jaesal", "twelve_sinsal_jaesal"],
  ["재살", "twelve_sinsal_jaesal"],
  ["cheonsal", "twelve_sinsal_cheonsal"],
  ["천살", "twelve_sinsal_cheonsal"],
  ["jisal", "twelve_sinsal_jisal"],
  ["지살", "twelve_sinsal_jisal"],
  ["nyeonsal", "twelve_sinsal_nyeonsal"],
  ["년살", "twelve_sinsal_nyeonsal"],
  ["yukhae", "twelve_sinsal_yukhae"],
  ["육해", "twelve_sinsal_yukhae"],
  ["육해살", "twelve_sinsal_yukhae"],
]);

export const gwiinFeatureIdByAlias = new Map<string, string>([
  ["cheon_eul", "gwiin_cheoneul"],
  ["cheoneul", "gwiin_cheoneul"],
  ["천을", "gwiin_cheoneul"],
  ["천을귀인", "gwiin_cheoneul"],
  ["cheon_deok", "gwiin_cheondeok"],
  ["cheondeok", "gwiin_cheondeok"],
  ["천덕", "gwiin_cheondeok"],
  ["천덕귀인", "gwiin_cheondeok"],
  ["wol_deok", "gwiin_woldeok"],
  ["woldeok", "gwiin_woldeok"],
  ["월덕", "gwiin_woldeok"],
  ["월덕귀인", "gwiin_woldeok"],
  ["munchang", "gwiin_munchang"],
  ["문창", "gwiin_munchang"],
  ["문창귀인", "gwiin_munchang"],
  ["hakdang", "gwiin_hakdang"],
  ["학당", "gwiin_hakdang"],
  ["학당귀인", "gwiin_hakdang"],
  ["taegeuk", "gwiin_taegeuk"],
  ["태극", "gwiin_taegeuk"],
  ["태극귀인", "gwiin_taegeuk"],
  ["jaego", "gwiin_jaego"],
  ["재고", "gwiin_jaego"],
  ["재고귀인", "gwiin_jaego"],
  ["bokseong", "gwiin_bokseong"],
  ["복성", "gwiin_bokseong"],
  ["복성귀인", "gwiin_bokseong"],
  ["mungok", "gwiin_mungok"],
  ["문곡", "gwiin_mungok"],
  ["문곡귀인", "gwiin_mungok"],
  ["geumyeorok", "gwiin_geumyeorok"],
  ["geumnyeorok", "gwiin_geumyeorok"],
  ["금여록", "gwiin_geumyeorok"],
  ["cheoneuiseong", "gwiin_cheoneuiseong"],
  ["천의성", "gwiin_cheoneuiseong"],
  ["amrok", "gwiin_amrok"],
  ["암록", "gwiin_amrok"],
]);

export const twelveSinsalFeatureByGroup = {
  sinjaJin: {
    사: "twelve_sinsal_geopsal",
    오: "twelve_sinsal_jaesal",
    미: "twelve_sinsal_cheonsal",
    신: "twelve_sinsal_jisal",
    유: "twelve_sinsal_nyeonsal",
    술: "twelve_sinsal_wolsal",
    해: "twelve_sinsal_mangsin",
    자: "twelve_sinsal_jangseong",
    축: "twelve_sinsal_banan",
    인: "twelve_sinsal_yeokma",
    묘: "twelve_sinsal_yukhae",
    진: "twelve_sinsal_hwagae",
  },
  inohSul: {
    해: "twelve_sinsal_geopsal",
    자: "twelve_sinsal_jaesal",
    축: "twelve_sinsal_cheonsal",
    인: "twelve_sinsal_jisal",
    묘: "twelve_sinsal_nyeonsal",
    진: "twelve_sinsal_wolsal",
    사: "twelve_sinsal_mangsin",
    오: "twelve_sinsal_jangseong",
    미: "twelve_sinsal_banan",
    신: "twelve_sinsal_yeokma",
    유: "twelve_sinsal_yukhae",
    술: "twelve_sinsal_hwagae",
  },
  haemyoMi: {
    신: "twelve_sinsal_geopsal",
    유: "twelve_sinsal_jaesal",
    술: "twelve_sinsal_cheonsal",
    해: "twelve_sinsal_jisal",
    자: "twelve_sinsal_nyeonsal",
    축: "twelve_sinsal_wolsal",
    인: "twelve_sinsal_mangsin",
    묘: "twelve_sinsal_jangseong",
    진: "twelve_sinsal_banan",
    사: "twelve_sinsal_yeokma",
    오: "twelve_sinsal_yukhae",
    미: "twelve_sinsal_hwagae",
  },
  sayuChuk: {
    인: "twelve_sinsal_geopsal",
    묘: "twelve_sinsal_jaesal",
    진: "twelve_sinsal_cheonsal",
    사: "twelve_sinsal_jisal",
    오: "twelve_sinsal_nyeonsal",
    미: "twelve_sinsal_wolsal",
    신: "twelve_sinsal_mangsin",
    유: "twelve_sinsal_jangseong",
    술: "twelve_sinsal_banan",
    해: "twelve_sinsal_yeokma",
    자: "twelve_sinsal_yukhae",
    축: "twelve_sinsal_hwagae",
  },
} as const satisfies Record<string, Record<NormalizedBranch, string>>;

export const cheoneulGwiinBranchesByStem = {
  갑: ["축", "미"],
  을: ["자", "신"],
  병: ["해", "유"],
  정: ["해", "유"],
  무: ["축", "미"],
  기: ["자", "신"],
  경: ["축", "미"],
  신: ["인", "오"],
  임: ["묘", "사"],
  계: ["묘", "사"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const munchangGwiinBranchesByStem = {
  갑: ["사"],
  을: ["오"],
  병: ["신"],
  정: ["유"],
  무: ["신"],
  기: ["유"],
  경: ["해"],
  신: ["자"],
  임: ["인"],
  계: ["묘"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const jaegoGwiinBranchesByStem = {
  갑: ["진"],
  을: ["진"],
  병: ["축"],
  정: ["축"],
  무: ["진"],
  기: ["진"],
  경: ["미"],
  신: ["미"],
  임: ["술"],
  계: ["술"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const geumyeorokBranchesByStem = {
  갑: ["진"],
  을: ["사"],
  병: ["미"],
  정: ["신"],
  무: ["미"],
  기: ["신"],
  경: ["술"],
  신: ["해"],
  임: ["축"],
  계: ["인"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const amrokBranchesByStem = {
  갑: ["해"],
  을: ["술"],
  병: ["신"],
  정: ["미"],
  무: ["신"],
  기: ["미"],
  경: ["사"],
  신: ["진"],
  임: ["인"],
  계: ["축"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const baekhoDayPillars = new Set<NormalizedGanji>([
  "갑진",
  "을미",
  "병술",
  "정축",
  "무진",
  "임술",
  "계축",
]);

export const goegangDayPillars = new Set<NormalizedGanji>([
  "경진",
  "경술",
  "임진",
  "무술",
]);

export const yanginBranchesByStem = {
  갑: ["묘"],
  을: ["인"],
  병: ["오"],
  정: ["사"],
  무: ["오"],
  기: ["사"],
  경: ["유"],
  신: ["신"],
  임: ["자"],
  계: ["해"],
} as const satisfies Record<NormalizedStem, readonly NormalizedBranch[]>;

export const hyeonchimBranches = new Set<NormalizedBranch>(["묘", "유"]);

export const dohwaBranchByGroup = {
  sinjaJin: "유",
  inohSul: "묘",
  haemyoMi: "자",
  sayuChuk: "오",
} as const satisfies Record<string, NormalizedBranch>;

export const relationPairs = {
  gwimun: [
    ["자", "유"],
    ["축", "오"],
    ["인", "미"],
    ["묘", "신"],
    ["진", "해"],
    ["사", "술"],
  ],
  wonjin: [
    ["자", "미"],
    ["축", "오"],
    ["인", "유"],
    ["묘", "신"],
    ["진", "해"],
    ["사", "술"],
  ],
} as const satisfies Record<string, readonly (readonly [NormalizedBranch, NormalizedBranch])[]>;

export const sexagenaryCycle = [
  "갑자",
  "을축",
  "병인",
  "정묘",
  "무진",
  "기사",
  "경오",
  "신미",
  "임신",
  "계유",
  "갑술",
  "을해",
  "병자",
  "정축",
  "무인",
  "기묘",
  "경진",
  "신사",
  "임오",
  "계미",
  "갑신",
  "을유",
  "병술",
  "정해",
  "무자",
  "기축",
  "경인",
  "신묘",
  "임진",
  "계사",
  "갑오",
  "을미",
  "병신",
  "정유",
  "무술",
  "기해",
  "경자",
  "신축",
  "임인",
  "계묘",
  "갑진",
  "을사",
  "병오",
  "정미",
  "무신",
  "기유",
  "경술",
  "신해",
  "임자",
  "계축",
  "갑인",
  "을묘",
  "병진",
  "정사",
  "무오",
  "기미",
  "경신",
  "신유",
  "임술",
  "계해",
] as const satisfies readonly NormalizedGanji[];

export const gongmangBranchesByCycleStart = [
  ["술", "해"],
  ["신", "유"],
  ["오", "미"],
  ["진", "사"],
  ["인", "묘"],
  ["자", "축"],
] as const satisfies readonly (readonly [NormalizedBranch, NormalizedBranch])[];

export function normalizeStem(value: string | undefined): NormalizedStem | undefined {
  if (value === undefined) {
    return undefined;
  }

  return stemByAlias.get(value.trim().slice(0, 1));
}

export function normalizeBranch(
  value: string | undefined,
): NormalizedBranch | undefined {
  if (value === undefined) {
    return undefined;
  }

  return branchByAlias.get(value.trim().slice(-1));
}

export function normalizeGanji(value: string | undefined): NormalizedGanji | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().replace(/일주$/u, "");
  const stem = normalizeStem(normalized.slice(0, 1));
  const branch = normalizeBranch(normalized.slice(1, 2));

  if (stem === undefined || branch === undefined) {
    return undefined;
  }

  return `${stem}${branch}`;
}

export function getTwelveSinsalGroup(
  branch: NormalizedBranch,
): keyof typeof twelveSinsalFeatureByGroup {
  if (branch === "신" || branch === "자" || branch === "진") {
    return "sinjaJin";
  }

  if (branch === "인" || branch === "오" || branch === "술") {
    return "inohSul";
  }

  if (branch === "해" || branch === "묘" || branch === "미") {
    return "haemyoMi";
  }

  return "sayuChuk";
}
