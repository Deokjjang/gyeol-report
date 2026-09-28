import { SAJU_FEATURE_TAXONOMY } from "../report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import { SHINSAL_METADATA } from "../saju/shinsalConstants";
import { DOMAINS, type AtomicMaterial, type Domain } from "./types";

export const CLAIM_GUARDS = ["no-event-guarantee", "no-medical-claim", "no-fabricated-fact", "no-job-to-natal-inference", "no-strength-from-duplicate", "no-effort-reward-reversal"] as const;
// Reviewed realizations of the existing entries below, not new calculations.
// [available strength, felt question, use direction, overuse caution]
export const REVIEWED_COPY: Readonly<Record<string, readonly [string, string, string, string]>> = {
  ten_god_bijian: ["자기 기준을 세우고 독립적으로 밀고 가는 힘이 있습니다.", "스스로 정한 기준이 있어야 움직이기 편한가요?", "판단 기준을 먼저 밝히고 동료의 담당 범위는 남겨 두세요.", "독립성과 고집을 구분하세요."],
  ten_god_jie_cai: ["사람 사이에서 경쟁을 동력으로 바꾸는 힘이 있습니다.", "함께 달릴 사람이 있을 때 추진력이 붙나요?", "협업을 시작할 때 기여와 자원 배분을 함께 정하세요.", "경쟁 때문에 자원 한도를 넘기지 마세요."],
  ten_god_shi_shen: ["생각을 꾸준한 결과물로 내보내는 힘이 있습니다.", "직접 만들어 설명할 때 생각이 더 잘 정리되나요?", "작게라도 완성해 보여 주는 주기를 만드세요.", "생산 속도와 회복 시간을 함께 지키세요."],
  ten_god_shang_guan: ["문제를 날카롭게 짚고 새 표현을 만드는 힘이 있습니다.", "익숙한 방식의 허점이 먼저 눈에 들어오나요?", "비판을 개선안과 나란히 제시하세요.", "사람에 대한 평가와 일의 문제를 분리하세요."],
  ten_god_pian_cai: ["외부 기회와 사람 사이의 자원 흐름을 읽는 힘이 있습니다.", "새 연결에서 일의 기회를 먼저 발견하나요?", "기회를 펼치되 투입 자원과 회수 기준을 먼저 적으세요.", "기회가 많다는 이유로 약속을 늘리지 마세요."],
  ten_god_zheng_cai: ["예측 가능한 자원을 꾸준히 관리하는 힘이 있습니다.", "계획과 실제 사용량을 맞출 때 마음이 놓이나요?", "예산과 실제 사용 내역을 같은 표에서 관리하세요.", "안정 기준이 새로운 선택을 모두 막지 않게 하세요."],
  ten_god_qi_sha: ["압박 속에서도 기준을 세우고 대응하는 힘이 있습니다.", "급한 일이 생기면 먼저 기준을 잡는 편인가요?", "위기 대응의 범위와 멈출 지점을 함께 정하세요.", "긴장 상태를 평소의 속도로 삼지 마세요."],
  ten_god_zheng_guan: ["공식 역할과 책임을 통해 신뢰를 쌓는 힘이 있습니다.", "역할과 승인 기준이 분명할 때 편하게 일하나요?", "책임에 맞는 권한과 승인 절차를 문서로 확인하세요.", "모든 책임을 혼자 떠안지 마세요."],
  ten_god_pian_yin: ["남과 다른 관점으로 깊게 연구하는 힘이 있습니다.", "혼자 파고들며 독자적인 연결을 찾는 편인가요?", "독특한 관점을 작은 사례로 꺼내 검토하세요.", "몰입과 고립을 구분하세요."],
  ten_god_zheng_yin: ["배운 것을 정리하고 도움을 받아 기반을 다지는 힘이 있습니다.", "배경과 원리를 이해해야 안심하고 움직이나요?", "배운 기준을 하나의 적용 사례로 정리하세요.", "준비만 이어지지 않도록 적용 시점을 정하세요."],
  sinsal_dohwa: ["사람의 시선을 끌고 인상을 남기는 매력이 있습니다.", "사람들이 내 표현과 분위기에 반응하는 편인가요?", "자신을 보여 주는 자리에서 표현과 관계의 경계를 함께 세우세요.", "주목을 얻는 일과 타인의 기대를 모두 맡는 일을 구분하세요."],
  sinsal_hongyeom: ["감정 표현으로 가까운 사람에게 인상을 남기는 힘이 있습니다.", "작은 표현에도 상대의 반응이 크게 돌아오나요?", "따뜻한 표현을 쓰되 약속의 범위를 분명하게 전하세요.", "호감과 관계의 책임을 혼동하지 마세요."],
  sinsal_hyeonchim: ["세밀하게 관찰하고 핵심을 짚는 힘이 있습니다.", "다른 사람이 지나친 작은 차이를 먼저 발견하나요?", "예리한 관찰을 검수와 구체적인 피드백에 쓰세요.", "날카로운 지적 앞에 관찰한 사실부터 말하세요."],
  sinsal_baekho: ["강하게 집중하고 위기에 대응하는 힘이 있습니다.", "급한 상황에서 집중력이 더 선명해지나요?", "집중이 필요한 일과 회복 시간을 분리하세요.", "강한 추진력을 사고나 질병 예언으로 읽지 않습니다."],
  twelve_sinsal_jangseong: ["앞에 서서 방향과 기준을 잡는 힘이 있습니다.", "팀이 흔들릴 때 기준을 정리하는 역할을 맡나요?", "방향을 제시하기 전에 구성원의 의견을 한 번 들으세요.", "책임감이 일방적인 지시가 되지 않게 하세요."],
  twelve_sinsal_yeokma: ["새 환경과 외부 연결에서 움직임을 만드는 힘이 있습니다.", "새로운 장소와 사람을 만나면 생각이 활발해지나요?", "외부 활동 뒤에 정리와 마무리 시간을 붙이세요.", "이동 자체를 성공의 조건으로 삼지 마세요."],
  twelve_sinsal_hwagae: ["혼자 깊게 숙성시키는 집중과 미감이 있습니다.", "혼자 파고드는 시간이 있어야 생각이 깊어지나요?", "몰입한 결과를 밖으로 꺼내는 시간을 따로 정하세요.", "깊이를 지키면서 가까운 사람과 연결을 남기세요."],
  nobleman_munchang: ["배움을 언어와 문서로 정리하는 힘이 있습니다.", "쓰거나 설명하면 배운 내용이 더 선명해지나요?", "배운 것을 기록과 설명 자료로 남기세요.", "정리의 완성도 때문에 공유를 미루지 마세요."],
  twelve_sinsal_banan: ["이름이 걸린 역할에서 존재감을 드러내는 힘이 있습니다.", "공식 역할을 맡으면 추진력이 더 살아나나요?", "자기 이름으로 책임질 결과물을 남기세요.", "직함과 실제 책임의 범위를 함께 확인하세요."],
  gwiin_cheoneul: ["사람과 제도의 도움을 연결할 좋은 기반이 있습니다.", "어려울 때 도움을 청할 연결이 떠오르나요?", "필요한 도움의 내용을 구체적으로 요청하세요.", "도움을 기다리는 일로 자신의 선택을 대신하지 마세요."],
  gwiin_cheondeok: ["관계의 날카로움을 완충할 중재의 자원이 있습니다.", "갈등을 풀어 주는 사람이나 절차가 있나요?", "갈등에서는 중재할 사람과 절차를 활용하세요.", "중재와 자신의 책임을 구분하세요."],
  gwiin_woldeok: ["협업과 제도 안에서 도움을 연결할 기반이 있습니다.", "함께한 사람들의 협력이 부담을 덜어 주나요?", "협업의 기여와 필요한 지원을 기록으로 남기세요.", "호의만으로 역할 합의를 생략하지 마세요."],
  gwiin_munchang: ["배움을 언어와 문서로 정리하는 힘이 있습니다.", "쓰거나 설명하면 배운 내용이 더 선명해지나요?", "배운 것을 요약과 설명 자료로 남기세요.", "정리의 완성도 때문에 공유를 미루지 마세요."],
  gwiin_hakdang: ["체계적인 배움을 이어 갈 기반이 있습니다.", "커리큘럼과 피드백이 있을 때 공부가 잘 이어지나요?", "학습 목표를 작은 단위로 나누고 피드백을 받으세요.", "배운 분량과 실제 이해를 따로 확인하세요."],
  gwiin_taegeuk: ["큰 흐름을 정리하고 중심을 잡는 힘이 있습니다.", "눈앞의 일보다 큰 방향을 이해해야 편한가요?", "큰 방향을 오늘의 작은 실행으로 내려오게 하세요.", "생각의 깊이가 실행을 계속 미루지 않게 하세요."],
  gwiin_jaego: ["자원과 기반을 쌓아 두는 힘이 있습니다.", "얻은 것을 남길 구조부터 떠올리는 편인가요?", "유지 자원과 새 기회에 쓸 자원을 나누세요.", "축적의 성향을 자산 증가의 보장으로 읽지 않습니다."],
  gwiin_mungok: ["글과 설명에 표현의 맛을 더하는 힘이 있습니다.", "같은 내용도 전달하는 흐름을 다듬는 편인가요?", "아이디어를 제목과 목차, 짧은 글로 꺼내세요.", "표현의 매력과 내용의 정확성을 함께 지키세요."],
  gwiin_bokseong: ["작은 도움과 관계의 호의를 연결할 기반이 있습니다.", "크지 않은 도움들이 생활의 부담을 덜어 주나요?", "받은 도움을 구체적으로 기억하고 연결을 이어 가세요.", "좋은 타이밍을 결과의 보장으로 읽지 않습니다."],
  gwiin_geumyeorok: ["품위와 생활의 안정감을 살리는 자원이 있습니다.", "좋은 생활 조건과 대우의 기준이 분명한 편인가요?", "중요하게 여기는 생활 조건과 관리 기준을 정하세요.", "이미지와 실제 생활 여건을 구분하세요."],
  gwiin_cheoneuiseong: ["사람의 필요를 알아차리고 생활을 정비하는 힘이 있습니다.", "누군가 지칠 때 필요한 도움을 먼저 알아차리나요?", "돌볼 범위와 자신의 회복 시간을 함께 정하세요.", "돌봄의 신호를 치료 능력이나 질병 예언으로 읽지 않습니다."],
  gwiin_amrok: ["눈에 잘 보이지 않는 지원과 예비 자원을 살릴 기반이 있습니다.", "필요할 때 뒤에서 받쳐 주는 연결이 있나요?", "가용한 예비 자원과 도움의 통로를 정리하세요.", "아직 확인하지 않은 지원까지 자원으로 계산하지 마세요."],
};
const topicDomain: Readonly<Record<string, Domain>> = { identity: "identity", personality: "identity", strengths: "identity", work: "career", work_career: "career", money: "money", money_asset: "money", love: "love", love_relationship: "love", relationship: "relationship", human_relations: "relationship", family: "relationship", family_independence: "relationship", study: "study", study_growth: "study", environment: "lifestyle", environment_luck: "lifestyle", growth: "lifestyle", final_advice: "lifestyle" };
export const domainsForTopics = (topics: readonly string[]): Domain[] => [...new Set(topics.flatMap(t => topicDomain[t] ? [topicDomain[t]] : []))];
function buildDomainUses(items: readonly [Domain, readonly string[]][]): AtomicMaterial["use"] {
  const result: Record<Domain, readonly string[]> = { identity: [], career: [], business: [], money: [], relationship: [], love: [], study: [], leadership: [], lifestyle: [] };
  for (const domain of DOMAINS) result[domain] = items.filter(([d]) => domain === d).flatMap(([, values]) => values);
  return result;
}
export function buildAtomicRegistry(): readonly AtomicMaterial[] {
  const ids = [...new Set([...SAJU_FEATURE_TAXONOMY.map(f => f.id), ...SAJU_KNOWLEDGE_BASE.map(k => k.id)])];
  const materials = ids.map((id): AtomicMaterial => {
    const f = SAJU_FEATURE_TAXONOMY.find(f => f.id === id), k = SAJU_KNOWLEDGE_BASE.find(k => k.id === id), copy = REVIEWED_COPY[id];
    const topics = domainsForTopics(f?.topics ?? Object.keys(k?.topicWeights ?? {}));
    const use = buildDomainUses([
      ...Object.entries(k?.topicInterpretations ?? {}).flatMap(([topic, value]): [Domain, readonly string[]][] => topicDomain[topic] && value ? [[topicDomain[topic], value.advice]] : []),
      ...topics.map((d): [Domain, readonly string[]] => [d, f?.practicalUse ? [f.practicalUse] : []]),
      ["business", k?.moneyHints?.earningStyle ?? []], ["leadership", k?.careerHints?.workingStyle ?? []],
    ]);
    return { id, name: f?.labelKo ?? k!.labelKo, sourceRefs: [f && `sajuFeatureTaxonomy:${id}`, k && `sajuKnowledgeBase:${id}`].filter((s): s is string => Boolean(s)),
      readiness: copy ? "reviewed" : "material", coreMeaning: k?.meaning ?? f!.summary,
      feltQuestions: copy ? [copy[1]] : [], personalityExpression: f?.sceneSeeds ?? k?.dayPillarHints?.coreTension ?? [],
      strength: copy ? [copy[0]] : f ? [f.positiveReading] : k?.dayPillarHints?.strength ?? [],
      overuseRisk: copy ? [copy[3]] : f ? [f.cautionReading] : k?.phraseSeeds.caution ?? [], use,
      modernUses: f?.sceneSeeds ?? k?.careerHints?.favorableFields ?? [], directives: copy ? [copy[2]] : f ? [f.practicalUse] : k?.phraseSeeds.advice ?? [],
      mbtiInteractionTags: [...(k?.mbtiBridgeTags ?? []), ...(f?.mbtiBridgeNeeds ?? [])], contextTags: topics,
      positiveSignalStrength: copy || f?.polarity === "positive" ? "explicit" : f ? "mixed" : "unreviewed",
      cautionTags: k?.riskTags ?? [], unsupportedClaimGuards: [...CLAIM_GUARDS, ...(f?.avoidClaims ?? [])] };
  });
  // Every native code gets a source entry even when no reviewed narrative alias exists.
  for (const native of Object.values(SHINSAL_METADATA)) materials.push({
    id: `shinsal:${native.code}`, name: native.labelKo, sourceRefs: [`shinsalConstants:SHINSAL_METADATA.${native.code}`], readiness: "material",
    coreMeaning: native.shortDescriptionKo, feltQuestions: [], personalityExpression: [], strength: [], overuseRisk: [], use: buildDomainUses([]), modernUses: [], directives: [], mbtiInteractionTags: [], contextTags: [], positiveSignalStrength: "unreviewed", cautionTags: [], unsupportedClaimGuards: CLAIM_GUARDS,
  });
  return materials;
}
export const ATOMIC_REGISTRY = buildAtomicRegistry();
export const ATOMIC_BY_ID = new Map(ATOMIC_REGISTRY.map(entry => [entry.id, entry]));
