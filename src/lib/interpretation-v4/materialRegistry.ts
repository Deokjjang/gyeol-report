import { SAJU_FEATURE_TAXONOMY } from "../report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import { canonicalFeatureId } from "../interpretation-v3/evidence";
import type { Domain, Material, SemanticTag } from "./types";
import { STRUCTURE_REGISTRY } from "./structureMaterials";
import { getMaterialDepth, MATERIAL_DEPTH } from "./materialDepth";
import { SHINSAL_METADATA } from "../saju/shinsalConstants";

// Normalize vocabulary, not calculation. Preserve original refs on observations.
const aliases: Readonly<Record<string, string>> = {
  "shinsal:TWELVE_BANANSAL": "twelve_sinsal_banan",
  "shinsal:TWELVE_YEOKMASAL": "twelve_sinsal_yeokma",
  "shinsal:TWELVE_HWAGAE": "twelve_sinsal_hwagae",
  "shinsal:TWELVE_NYEONSAL": "sinsal_dohwa",
  "shinsal:MANGSINSAL": "twelve_sinsal_mangsin",
  "shinsal:TWELVE_MANGSINSAL": "twelve_sinsal_mangsin",
  sinsal_mangsin: "twelve_sinsal_mangsin",
  day_pillar_gabja: "day_pillar_gapja",
  day_pillar_byeongoh: "day_pillar_byeongo",
};
export const canonicalV4Feature = (id: string) => aliases[canonicalFeatureId(id)] ?? canonicalFeatureId(id);

type Meaning = readonly [readonly SemanticTag[], readonly Domain[], string, string];
/** Reviewed semantic normalization of existing knowledge, not 6-product prose. */
export const SEMANTIC_MEANINGS: Readonly<Record<string, Meaning>> = {
  ten_god_bijian: [["autonomy"], ["identity", "strengths", "weaknesses", "work", "love", "relationships", "marriage"], "자기 기준이 분명합니다.", "고집이 센 편입니다."],
  ten_god_jie_cai: [["leadership", "sociability"], ["identity", "strengths", "weaknesses", "work", "relationships"], "경쟁할 사람이 생기면 힘이 붙습니다.", "남이 잘하면 없던 욕심도 생깁니다."],
  ten_god_shi_shen: [["expression", "practical-learning"], ["identity", "strengths", "work", "study", "love", "success/fortune"], "생각을 내 손으로 보여주는 힘이 있습니다.", "재미가 붙으면 쉬는 걸 잊습니다."],
  ten_god_shang_guan: [["expression", "precision", "experimentation"], ["identity", "strengths", "weaknesses", "work", "study", "relationships"], "허점을 보고 새로운 답을 꺼내는 힘이 있습니다.", "말이 날카로운 편입니다."],
  ten_god_pian_cai: [["wealth", "mobility"], ["identity", "strengths", "work", "money", "success/fortune"], "사람과 기회 사이에서 돈의 길을 잘 찾습니다.", "기회가 많아 보이면 일을 너무 벌립니다."],
  ten_god_zheng_cai: [["wealth", "accumulation", "consistency"], ["strengths", "work", "money", "marriage", "success/fortune"], "작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.", "돈이든 시간이든 새는 걸 그냥 못 봅니다."],
  ten_god_qi_sha: [["leadership", "decisive-correction"], ["identity", "strengths", "weaknesses", "work", "success/fortune"], "급한 순간 앞에 서서 결정하는 힘이 있습니다.", "긴장이 풀려도 쉬는 걸 잘 못합니다."],
  ten_god_zheng_guan: [["consistency", "status"], ["identity", "strengths", "work", "love", "marriage", "relationships", "success/fortune"], "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.", "기준 없이 바뀌는 말을 싫어합니다."],
  ten_god_pian_yin: [["inquiry", "solitude"], ["identity", "strengths", "weaknesses", "work", "study", "relationships"], "남이 넘긴 질문을 끝까지 파고듭니다.", "생각이 깊어질수록 밖으로 꺼내는 게 늦습니다."],
  ten_god_zheng_yin: [["learning", "help", "consistency"], ["identity", "strengths", "work", "study", "relationships", "success/fortune"], "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.", "충분히 준비됐다는 느낌이 늦게 옵니다."],
  sinsal_hyeonchim: [["precision"], ["identity", "strengths", "weaknesses", "work", "study", "love", "relationships"], "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.", "맞는 말을 해도 상대에게는 따끔합니다."],
  twelve_sinsal_jangseong: [["leadership", "status"], ["identity", "strengths", "work", "success/fortune"], "앞에 서고 이름을 알릴 힘이 있습니다.", "답답하면 남의 결정까지 대신합니다."],
  twelve_sinsal_banan: [["status"], ["strengths", "work", "money", "success/fortune"], "자리와 인정에 힘이 붙는 좋은 패가 있습니다.", "잘한 만큼 알아주지 않으면 서운합니다."],
  gwiin_cheoneul: [["help"], ["strengths", "work", "love", "relationships", "success/fortune"], "사람복이 있습니다. 막힌 길에서 도움을 연결하는 좋은 패입니다.", "도움받는 것과 결정을 맡기는 건 다릅니다."],
  gwiin_cheondeok: [["help"], ["strengths", "relationships", "marriage", "success/fortune"], "날카로운 관계를 풀어주는 도움의 패가 있습니다.", "좋게 끝내려다 내 몫까지 접습니다."],
  gwiin_woldeok: [["help"], ["strengths", "work", "relationships", "success/fortune"], "함께하는 사람의 도움을 얻는 좋은 패가 있습니다.", "호의가 있으면 약속을 대충 넘기기 쉽습니다."],
  gwiin_jaego: [["accumulation", "wealth"], ["strengths", "work", "money", "success/fortune"], "돈뿐 아니라 기술과 고객도 쌓아가는 축적의 복이 있습니다.", "이미 들인 것이 아까워 놓는 일이 늦습니다."],
  sinsal_dohwa: [["first-attraction", "sociability"], ["identity", "strengths", "love", "relationships", "success/fortune"], "첫인상에서 눈에 들어오는 매력이 있습니다.", "모든 사람에게 좋은 인상을 남기려면 피곤합니다."],
  sinsal_hongyeom: [["intimate-attraction", "expression"], ["identity", "strengths", "love", "marriage", "relationships", "success/fortune"], "가까워질수록 매력이 살아납니다.", "다정하게 대한 마음이 생각보다 크게 전달됩니다."],
  twelve_sinsal_yeokma: [["mobility"], ["identity", "work", "study", "relationships", "success/fortune"], "새로운 장소와 바깥 만남에서 기회를 얻는 힘이 있습니다.", "가만히 있으면 괜히 뒤처지는 기분이 듭니다."],
  twelve_sinsal_hwagae: [["solitude", "inquiry"], ["identity", "strengths", "weaknesses", "work", "study", "love", "marriage", "relationships"], "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다.", "혼자 편한 것과 사람을 밀어내는 건 다릅니다."],
  sinsal_gwimun: [["inquiry", "precision"], ["identity", "strengths", "weaknesses", "study", "relationships"], "그냥 지나치기 어려운 질문을 집요하게 파고듭니다.", "작은 말도 머릿속에서 여러 번 돌려봅니다."],
  sinsal_yangin: [["autonomy", "leadership"], ["identity", "strengths", "weaknesses", "work", "love", "relationships"], "결정할 때 자기 선을 분명하게 지킵니다.", "한번 선을 그으면 물러서기 어렵습니다."],
  gwiin_munchang: [["learning", "expression"], ["strengths", "work", "study", "success/fortune"], "배운 것을 글과 말로 정리하는 좋은 힘이 있습니다.", "완벽하게 정리하느라 보여주는 때를 놓칩니다."],
  gwiin_hakdang: [["learning"], ["strengths", "study", "success/fortune"], "배움을 자기 실력으로 쌓는 좋은 패가 있습니다.", "배운 분량과 익힌 실력을 헷갈릴 때가 있습니다."],
  "distribution:output-low": [["expression-gap"], ["identity", "strengths", "work", "love", "relationships"], "표현의 통로를 다른 행동 습관과 함께 살펴볼 자리입니다.", "표현 신호가 적다고 말이나 창작 능력이 없다는 뜻은 아닙니다."],
};

const topicDomains: Readonly<Record<string, Domain>> = { identity: "identity", personality: "identity", strengths: "strengths", weaknesses: "weaknesses", work: "work", work_career: "work", money: "money", money_asset: "money", study: "study", study_growth: "study", love: "love", love_relationship: "love", relationship: "relationships", human_relations: "relationships", family: "relationships", environment: "success/fortune" };

export function buildMaterialRegistry(): readonly Material[] {
  const ids = [...new Set([...SAJU_FEATURE_TAXONOMY.map(f => canonicalV4Feature(f.id)), ...SAJU_KNOWLEDGE_BASE.map(f => canonicalV4Feature(f.id)), "distribution:output-low"])].sort();
  const legacy: Material[] = ids.map(feature => {
    const f = SAJU_FEATURE_TAXONOMY.find(f => f.id === feature);
    const knowledge = SAJU_KNOWLEDGE_BASE.filter(k => canonicalV4Feature(k.id) === feature);
    const k = knowledge.find(k => k.id === feature) ?? knowledge[0];
    const meaning = SEMANTIC_MEANINGS[feature];
    return { feature, label: f?.labelKo ?? k?.labelKo ?? "표현 신호가 적은 분포", semanticTags: meaning?.[0] ?? [],
      positiveMeaning: meaning?.[2] ?? f?.positiveReading ?? k?.meaning ?? "",
      shadowMeaning: meaning?.[3] ?? f?.cautionReading ?? k?.phraseSeeds.caution.join(" ") ?? "",
      imagery: f?.symbolicImage ?? k?.coreImageKo ?? "표현이 나오는 다른 통로",
      domains: meaning?.[1] ?? (k?.category === "day_master" ? ["identity", "strengths", "weaknesses"] : [...new Set((f?.topics ?? []).flatMap(t => topicDomains[t] ? [topicDomains[t]] : []))]),
      evidenceStrength: "none",
      sourceRefs: [f && `sajuFeatureTaxonomy:${f.id}`, ...knowledge.map(k => `sajuKnowledgeBase:${k.id}`), meaning && `v4:semantic-meaning:${feature}`].filter((r): r is string => Boolean(r)),
    };
  });
  const existing = [...legacy, ...STRUCTURE_REGISTRY];
  // Native-only markers did not always have a KB row. Add prose, never new
  // semantic tags/Fusion rules. Elements stay symbolic-only in materialPacket.
  const additions: Material[] = MATERIAL_DEPTH.filter(d => !existing.some(m => m.feature === d.feature)).map(d => ({
    feature: d.feature,
    label: Object.values(SHINSAL_METADATA).find(m => canonicalV4Feature(`shinsal:${m.code}`) === d.feature)?.labelKo ?? d.feature,
    semanticTags: [], positiveMeaning: d.seeds.find(s => s.role === "strength")!.text,
    shadowMeaning: d.seeds.find(s => s.role === "shadow")!.text, imagery: d.imagery,
    domains: [...new Set(d.seeds.flatMap(s => s.domains))], evidenceStrength: "none", sourceRefs: d.sourceRefs,
  }));
  return [...existing, ...additions].map(m => {
    const depth = getMaterialDepth(m.feature);
    return depth ? { ...m, depth } : m;
  });
}
export const MATERIAL_REGISTRY = buildMaterialRegistry();
export const MATERIAL_BY_FEATURE: ReadonlyMap<string, Material> = new Map(MATERIAL_REGISTRY.map(m => [m.feature, m]));
