import type { ComprehensiveV3Block as Block, ComprehensiveV3Draft, ComprehensiveV3Input } from "./comprehensive";
import type { Evidence } from "./types";
import { composeComprehensiveV32 } from "./comprehensiveStorytelling";
import { factLabel, storySupport, unique } from "./comprehensiveStoryEvidence";
import { GOOD_FORTUNE, GOD_PORTRAITS, LIFE_EXAMPLES, REALITY_VOICES, ALTERNATE_REALITY_VOICES, PRECISION_VOICES, LOVE_VOICES, ELEMENT_IMAGES, type RealityVoice } from "./comprehensiveExperienceCopy";
import { interpretCareerContext } from "./context";

export const FINAL_COMPREHENSIVE_VERSION = "comprehensive_v3.2-final.1" as const;
export type FinalArchetype = "expansion" | "accumulation" | "leader" | "expression" | "connection" | "inquiry" | "stability" | "change";
export type RelatableExample = { readonly id: string; readonly text: string; readonly evidenceRefs: readonly string[]; readonly context: string };
const ENDINGS: Record<FinalArchetype, { label: string; opening: string; horizon: string; strength: string; excess: string; action: string; close: string }> = {
  expansion: { label: "확장형", opening: "남과 나란히 서면 더 크게 움직일 힘이 생깁니다. 일에서도 취미에서도 비교의 자극을 받지만, 어떤 판에 들어갈지는 직접 골라야 합니다.", horizon: "이 리포트에서 볼 것은 얼마나 앞설지보다 어디까지 내 세계를 넓히고 싶은지입니다. 같은 목표를 가진 사람과 겨루되, 내 삶의 목적까지 넘겨주지는 마세요.", strength: "당신에게는 다른 사람의 움직임을 자기 추진력으로 바꾸는 힘이 있습니다. 혼자서는 미뤘던 시도도 같은 판에 선 사람이 생기면 속도가 붙습니다. 이제 경쟁의 크기보다 경쟁 뒤에 넓어진 자기 세계를 보세요.", excess: "모든 비교에 응답하면 일도 소비도 타인의 시간표를 따르게 됩니다. 함께 성장할 사람은 가까이하되, 남이 시작했다는 이유만으로 내 약속과 자원을 다시 배치하지 마세요.", action: "이번 주에는 실력을 늘릴 만한 작은 도전 하나를 고르고, 무엇이 늘면 끝낼지도 정해보세요. 경쟁이 끝난 뒤에도 남기고 싶은 관계와 경험이 있는지가 기준입니다.", close: "앞서는 것보다 넓어지는 삶을 고르세요" },
  accumulation: { label: "축적형", opening: "크게 한 번 반짝이는 것보다 다음에도 꺼내 쓸 기반을 남길 때 마음이 놓입니다. 돈뿐 아니라 생활의 습관, 믿는 사람, 익힌 기술에도 이 축적의 감각이 드러납니다.", horizon: "앞으로의 질문은 얼마나 더 가질지보다 가진 것 중 무엇이 내 선택을 넓혀주는지입니다. 오래 모은 것이 짐이 아니라 다음 출발의 발판이 되게 해보세요.", strength: "당신에게는 작은 흐름을 그냥 흘려보내지 않고 기반으로 남기는 힘이 있습니다. 일의 경험과 생활의 자원, 관계의 신뢰가 쌓일수록 다음 선택이 단단해지는 쪽입니다.", excess: "쌓는 힘을 잃을까 봐 쓰지 못하는 습관으로 바꾸지는 마세요. 생활을 지키는 몫과 경험에 쓸 몫을 나누면, 가진 것을 지키면서도 삶을 새롭게 써봅니다.", action: "이번 주에는 이미 가진 것 하나를 다시 사용해 보세요. 새로 더할 필요가 없었던 순간을 알아보면 내 기반의 진짜 가치를 압니다.", close: "많이 모은 삶보다 오래 쓸 것이 남는 삶을 만드세요" },
  leader: { label: "리더형", opening: "빈자리가 보이면 누군가는 맡아야 한다고 느낍니다. 가족과 모임에서도 흐트러진 순서를 잡는 힘이 나오지만, 중심에 서는 일과 모두를 대신하는 일은 다릅니다.", horizon: "앞으로의 방향은 책임을 더 많이 받는 데만 있지 않습니다. 나 없이도 함께 움직일 사람이 늘어나는지, 내가 만든 기준이 사람을 편하게 하는지를 보세요.", strength: "당신에게는 역할을 받아내고 방향을 분명히 하는 힘이 있습니다. 일에서뿐 아니라 모임과 가까운 관계에서도 중심이 필요한 순간에 존재감이 드러납니다.", excess: "맡을 사람이 없다는 이유로 늘 자신의 이름을 넣으면 책임감이 생활 전체를 차지합니다. 지킬 약속과 되돌려줄 몫을 나누세요. 타인의 다른 방식까지 오류로 고칠 필요는 없습니다.", action: "이번 주에는 함께 하는 일 하나에서 결과의 기준만 맞추고 방법은 상대에게 맡겨보세요. 다르게 해도 도착하는 경험이 통제와 신뢰의 차이를 알려줍니다.", close: "혼자 버티는 기둥보다 함께 방향을 잡는 중심이 되세요" },
  expression: { label: "표현형", opening: "생각을 안에만 두기보다 말이나 손에 잡히는 결과로 꺼낼 때 힘이 납니다. 일의 성과뿐 아니라 취미를 완성하고 감정을 자기 말로 전하는 장면도 같은 표현의 자리입니다.", horizon: "이 리포트는 무엇을 더 증명할지보다 무엇을 내 방식으로 세상에 남길지 묻습니다. 반응을 기다리는 시간보다 작게라도 완성하는 경험을 늘려보세요.", strength: "당신의 힘은 안에 있는 생각을 밖에서 만날 수 있는 형태로 만드는 데 있습니다. 잘 알아차리는 것에서 멈추지 않고 표현하고 고쳐보는 과정에서 자기 실력이 선명해집니다.", excess: "모든 반응에 맞춰 표현을 고치면 정작 전하려던 뜻이 사라집니다. 사람을 찌르는 정확함과 일을 낫게 만드는 정확함도 구분하세요. 결과물에는 과감하게, 사람의 마음에는 여백을 남기세요.", action: "이번 주에는 미뤄둔 생각 하나를 짧은 글이나 작은 결과로 꺼내보세요. 모두에게 인정받을 때까지 기다리기보다 한 사람에게 정확히 닿는 경험부터 만드세요.", close: "잘할 것이라는 설명보다 당신이 남긴 한 가지로 기억되세요" },
  connection: { label: "연결형", opening: "이해한 것을 사람에게 건넬 때 가진 힘이 더 넓게 쓰입니다. 배움과 도움을 혼자 쌓아두기보다 서로의 막힌 부분을 이어주는 관계에서 좋은 쓰임을 찾으세요.", horizon: "앞으로 가까이 둘 것은 나를 필요로 하는 사람만이 아닙니다. 나도 배우고 도움을 받을 수 있는 관계가 있어야 연결의 힘이 한쪽의 헌신으로 끝나지 않습니다.", strength: "당신에게는 배움과 도움을 사람 사이로 이어주는 힘이 있습니다. 아는 것을 혼자 소유하는 것보다 필요한 사람과 만났을 때 그 가치가 커지는 결입니다.", excess: "모든 사람을 편하게 해야 좋은 관계라는 생각은 내려놓으세요. 상대의 마음을 읽는 일과 상대 대신 선택하는 일은 다릅니다. 도움을 받는 날에도 관계의 가치는 줄어들지 않습니다.", action: "이번 주에는 고마웠던 사람에게 어떤 도움이 남았는지 구체적으로 전해보세요. 동시에 내가 묻고 싶은 질문 하나도 꺼내세요. 주고받는 방향이 함께 있어야 오래 가는 인복이 됩니다.", close: "많은 사람의 필요가 아니라 서로의 삶을 넓히는 인연을 남기세요" },
  inquiry: { label: "탐구형", opening: "남이 준 답을 그대로 쓰기보다 안에서 다시 연결해 자기 관점으로 만드는 시간이 중요합니다. 혼자 파고드는 취미나 생각도 삶에서 빼야 할 여분이 아니라 고유한 힘을 만드는 자리입니다.", horizon: "이 리포트에서 볼 것은 생각이 얼마나 깊은지뿐 아니라 그 깊이가 어디로 나오는지입니다. 혼자 이해한 것을 한 사람에게 건넬 때 다음 질문도 시작됩니다.", strength: "당신에게는 익숙한 설명 뒤를 한 번 더 들여다보는 힘이 있습니다. 남이 그냥 넘긴 연결을 오래 붙잡는 시간이 자기만의 관점을 만듭니다. 빨리 답하는 사람의 속도로 깊이를 평가하지 마세요.", excess: "모든 것을 이해한 다음 움직이려 하면 삶은 계속 준비 중이 됩니다. 생각이 충분한지 고민할 때는 작은 경험으로 확인할 부분을 하나 떼어내세요. 사람의 마음도 혼자 해석만 해서는 끝까지 알지 못합니다.", action: "이번 주에는 오래 궁금했던 것을 직접 확인할 작은 행동 하나를 해보세요. 읽은 것과 실제로 달랐던 점을 남기면 생각이 더 길어지는 대신 더 정확해집니다.", close: "깊이 아는 사람에서 자기 관점을 세상에 건네는 사람으로 나아가세요" },
  stability: { label: "안정형", opening: "남의 속도에 바로 휩쓸리기보다 스스로 납득할 기반을 찾습니다. 내 선택을 지키는 힘은 일과 공부뿐 아니라 관계의 거리와 일상의 리듬에도 드러납니다.", horizon: "앞으로의 질문은 남과 얼마나 다른지보다 무엇을 지키면서도 새것을 받아들일지입니다. 중심이 단단하면 모든 변화 앞에서 자신을 증명할 필요가 없습니다.", strength: "당신에게는 스스로 납득한 기준을 쉽게 놓지 않는 힘이 있습니다. 밖의 반응이 바뀌어도 자기 자리를 지키는 능력은 생활과 관계를 오래 이어가는 기반입니다.", excess: "혼자 결정하는 힘이 모든 도움을 간섭으로 읽는 벽이 되지 않게 하세요. 조언을 듣는다고 선택권을 넘기는 것은 아닙니다. 지킬 가치와 익숙해서 고집하는 방법을 따로 보세요.", action: "이번 주에는 지키고 싶은 원칙 하나는 그대로 두고 실행 방법만 한 가지 바꿔보세요. 바뀌어도 사라지지 않는 중심을 확인하면 다음 선택이 편안해집니다.", close: "흔들리지 않는 모습보다 다시 중심을 찾는 힘을 믿으세요" },
  change: { label: "변화형", opening: "새로운 필요와 접점에서 다음 가능성을 읽습니다. 자리를 옮기거나 다른 사람의 방식을 만날 때 익숙한 생활 안에서는 보이지 않던 선택지가 살아납니다.", horizon: "앞으로의 방향은 어디든 떠나는 데 있지 않습니다. 새로운 경험 뒤에 내 생활에서 실제로 달라질 한 가지가 남는지 보세요. 움직임에 돌아올 자리를 함께 만들면 변화가 자산이 됩니다.", strength: "당신에게는 새로운 흐름에서 다음 접점을 발견하는 힘이 있습니다. 같은 자리를 지키는 것만이 꾸준함은 아닙니다. 환경이 달라져도 필요한 것을 알아보는 감각을 자기 자원으로 쓰세요.", excess: "흥미로운 제안이 늘어도 시간과 약속은 한 사람의 몫입니다. 시작의 설렘 때문에 이미 맡은 일과 가까운 관계가 매번 뒤로 밀리지 않는지 보세요. 변화를 잘 쓰는 사람은 남길 것도 고릅니다.", action: "이번 주에는 낯선 경험 하나를 해보고 돌아와 적용할 것을 한 줄로 남겨보세요. 다음 계획을 잡기 전에 지금 만난 사람이나 배운 것과 한 번 더 이어보세요.", close: "많이 움직인 사람이 아니라 움직인 뒤 달라진 것이 있는 사람이 되세요" },
};

/** Preserve V3.2's selection, calculations and authored modes. This versioned
 * layer supplies short lived examples and evidence-selected endings only. */
export function composeComprehensiveFinal(input: ComprehensiveV3Input, candidates: readonly Block[]): ComprehensiveV3Draft {
  const base = composeComprehensiveV32(input, candidates), facts = input.facts, calc = input.calculation!;
  const selected = new Set([...base.opening, ...base.sections.flatMap(s => s.blocks)].flatMap(b => b.evidenceRefs));
  const find = (id: string) => facts.find(f => f.featureId === id && f.certainty === "confirmed" && f.sourceRefs.length);
  const strong = (f: Evidence) => selected.has(f.id) && storySupport(f.featureId, facts, calc).substantial;
  const supports = (b: Block) => facts.filter(f => b.evidenceRefs.includes(f.id) && strong(f));
  const voice = (voices: readonly RealityVoice[], available: readonly Evidence[]) => {
    for (const row of voices) {
      const trait = find(`mbti:${row.trait.replace(":", ":traits:")}`), signal = available.find(f => row.signals.includes(f.featureId) && strong(f));
      if (trait && signal) return { row, facts: [signal, trait] };
    }
  };
  const strongFacts = facts.filter(strong);
  const dominant = strongFacts.filter(f => f.featureId.startsWith("ten_god_")).toSorted((a, b) => {
    const x = storySupport(a.featureId, facts, calc), y = storySupport(b.featureId, facts, calc);
    return (y.weight ?? 0) - (x.weight ?? 0) || y.surface - x.surface || a.featureId.localeCompare(b.featureId);
  })[0];
  const archetypes: Record<string, FinalArchetype> = { bijian: "stability", jie_cai: "expansion", shi_shen: "expression", shang_guan: "expression", pian_cai: "change", zheng_cai: "accumulation", qi_sha: "leader", zheng_guan: "leader", pian_yin: "inquiry", zheng_yin: "stability" };
  const helper = strongFacts.find(f => f.featureId === "gwiin_cheoneul");
  const archetype = dominant?.featureId === "ten_god_zheng_yin" && helper ? "connection" : archetypes[dominant?.featureId.replace("ten_god_", "") ?? ""] ?? "stability";
  const personalityVoices = [...REALITY_VOICES, ...ALTERNATE_REALITY_VOICES];
  const ending = ENDINGS[archetype], endVoice = voice(personalityVoices, strongFacts);
  const gift = base.sections.find(s => s.id === "gifts")?.blocks.flatMap(supports).find(f => GOOD_FORTUNE[f.featureId]);
  const usedExamples = new Set<string>();
  const make = (id: string, text: string, fs: readonly Evidence[], context = "everyday"): RelatableExample => ({ id, text, evidenceRefs: fs.map(f => f.id), context });
  const exampleFor = (section: string, b: Block): RelatableExample | undefined => {
    const fs = supports(b), has = (id: string) => fs.find(f => f.featureId === id);
    if (!fs.length) return;
    const precision = section === "strength" ? voice(PRECISION_VOICES, strongFacts) : undefined;
    if (precision) return make(`precision:${precision.row.trait}`, precision.row.text, precision.facts);
    const mbti = ["strength", "choices", "study", "people"].includes(section) && !usedExamples.has("mbti-personality") ? voice(personalityVoices, strongFacts) : undefined;
    if (mbti) return make("mbti-personality", mbti.row.text, mbti.facts);
    if (section === "love") {
      const love = voice(LOVE_VOICES, strongFacts);
      if (love) return make(`love:${love.row.trait}`, love.row.text, love.facts, "love");
      const day = has("day_pillar_jeongchuk"), palace = find("spouse_palace:day_branch");
      if (day && palace) return make("love:slow-expression", "마음에 걸린 일을 바로 말하지 않고 넘겼다가, 나중에 아주 구체적으로 꺼낸 적 있지 않으신가요? 오래 품는 마음에도 작은 말의 출구가 필요합니다.", [day, palace], "love");
      const god = fs.find(f => /zheng_guan|qi_sha/.test(f.featureId));
      if (god) return make("love:promise", "좋아한다는 큰 말보다 전에 했던 작은 약속을 지켜줬을 때 더 마음이 놓이지 않으신가요? 책임을 중요하게 여기는 힘이 사랑에서도 보입니다.", [god], "love");
    }
    if (section === "people" && (has("twelve_sinsal_hwagae") || has("shinsal:GOSINSAL"))) return make("social-recovery", "여럿이 재미있게 놀고 와도 집에 돌아오면 혼자 조용히 있어야 머리가 정리되는 편 아닌가요? 사람을 좋아하는 마음과 혼자 회복하는 시간은 함께 갑니다.", fs.filter(f => ["twelve_sinsal_hwagae", "shinsal:GOSINSAL"].includes(f.featureId)), "friends");
    if (section === "people" && has("ten_god_pian_yin")) return make("thoughtful-reply", "친구의 고민을 듣고 그 자리에서 답하지 못했는데 나중에 다른 관점이 떠오른 적 있지 않으신가요? 바로 반응하는 것보다 안에서 연결해 보는 시간이 필요한 쪽입니다.", [has("ten_god_pian_yin")!], "conversation");
    if (section === "people" && has("ten_god_bijian")) return make("own-choice", "도움은 반가운데 상대가 대신 결정해 주려고 하면 갑자기 불편해진 적 있지 않으신가요? 가까운 사이에서도 선택하는 자리는 내 몫으로 남겨두고 싶습니다.", [has("ten_god_bijian")!], "friends");
    if (section === "choices" && has("ten_god_jie_cai")) return make("competition", "별생각 없던 경쟁인데 상대가 먼저 치고 나가면 갑자기 승부욕이 붙을 때가 있지 않나요? 내 속도를 깨우는 자극과 남의 속도에 끌려가는 일은 다릅니다.", [has("ten_god_jie_cai")!], "competition");
    if (section === "strength" && has("sinsal_hyeonchim")) return make("precision", "설명을 듣다가 남들은 넘긴 앞뒤가 안 맞는 말 하나가 계속 걸리지 않으신가요? 작은 차이를 짚는 현침의 눈이 먼저 움직이는 순간입니다.", [has("sinsal_hyeonchim")!], "conversation");
    if (section === "gifts") {
      const g = fs.find(f => /cheoneul|cheondeok|woldeok/.test(f.featureId));
      if (g) return make("help-channel", "혼자 오래 막혔던 일이 누군가에게 설명하다 뜻밖에 풀린 적 있지 않으신가요? 귀인의 패는 답을 대신 살아주는 사람보다 내 시야를 열어주는 인연으로 쓰세요.", [g], "friends");
      if (has("twelve_sinsal_jangseong")) return make("leadership", `${LIFE_EXAMPLES[input.context.lifeStatus]}에서 사람들이 우물쭈물하면 결국 내가 정리하고 있는 편이지 않으신가요? 앞에 서는 힘은 직함이 없어도 먼저 드러납니다.`, [has("twelve_sinsal_jangseong")!], input.context.lifeStatus);
      if (has("gwiin_jaego")) return make("stored-resource", "새로 시작하려고 보니 예전에 모아둔 자료나 익힌 기술이 다시 쓸모 있었던 적 있지 않으신가요? 쌓아둔 것이 다음 선택을 가볍게 하는 장면입니다.", [has("gwiin_jaego")!], "hobby");
    }
    if (section === "money") {
      const wealth = fs.find(f => /pian_cai|zheng_cai/.test(f.featureId));
      if (wealth) return make("purchase", "살 때의 가격보다 사고 나서 얼마나 자주 쓸지가 먼저 궁금하지 않으신가요? 얻는 순간과 계속 지니는 비용을 함께 보는 자원 감각입니다.", [wealth], "consumption");
      const output = fs.find(f => /shi_shen|shang_guan|pian_yin/.test(f.featureId));
      if (output) return make("invisible-time", "금방 해준 작은 부탁인데 비슷한 부탁이 쌓여 정작 내 시간이 사라진 적 있지 않으신가요? 쉽게 하는 일에도 익히는 데 들인 시간은 남아 있습니다.", [output], "time");
    }
  };
  const questionCount = (text: string) => (text.match(/\?/g) ?? []).length;
  let questions = [...base.opening, ...base.sections.flatMap(s => s.blocks)].reduce((n, b) => n + questionCount([b.headline, ...(b.paragraphs ?? []), b.action].join(" ")), 0);
  const sections = base.sections.map(s => {
    let sectionExample = false;
    return { ...s, blocks: s.blocks.map(original => {
      let b = original;
      const portrait = supports(b).find(f => GOD_PORTRAITS[f.featureId]);
      if (b.id === "self-noticing" && portrait) b = { ...b, paragraphs: [GOD_PORTRAITS[portrait.featureId][0]] };
      if (b.id === "study-transfer" && !b.paragraphs?.length && portrait) b = { ...b, headline: `${factLabel(portrait)} · 배움이 내 것이 되는 방식`, paragraphs: [GOD_PORTRAITS[portrait.featureId][1]] };
      if (s.id === "gifts") {
        const f = supports(b).find(f => GOOD_FORTUNE[f.featureId]);
        if (f) b = { ...b, paragraphs: [GOOD_FORTUNE[f.featureId], ...(b.paragraphs ?? []).slice(1)] };
      }
      if (s.id === "balance") { const element = b.id.split(":")[1]; if (ELEMENT_IMAGES[element]) b = { ...b, paragraphs: [ELEMENT_IMAGES[element][b.headline.includes("강한") ? 1 : 0]] }; }
      if (s.id === "career" && !["employee", "freelancer", "business_owner"].includes(input.context.lifeStatus)) b = { ...b, paragraphs: b.paragraphs?.map(p => p.replaceAll("업무", "함께 하는 활동")), action: b.action.replaceAll("업무", "맡은 역할") };
      if (b.kind === "context" && ["career", "money", "study"].includes(s.id)) b = { ...b, action: contextAction(s.id, input) };
      const example = !sectionExample && usedExamples.size < 6 ? exampleFor(s.id, b) : undefined;
      if (!example || usedExamples.has(example.id)) return b;
      const nextQuestions = questions + questionCount(example.text) - questionCount(b.headline) - questionCount((b.paragraphs ?? []).join(" "));
      // Reserve one place for love; never turn an uncertain question into a
      // confident claim just to satisfy the count or add one to every block.
      if (nextQuestions > (s.id === "love" ? 6 : 5)) return b;
      questions = nextQuestions;
      usedExamples.add(example.id); sectionExample = true;
      const refs = unique([...b.evidenceRefs, ...example.evidenceRefs]);
      return { ...b, headline: b.headline.includes("?") ? `${b.labels[0] ?? "내 성향"} · 일상에서 드러나는 순간` : b.headline,
        paragraphs: [example.text, ...(b.paragraphs ?? []).filter(p => !p.includes("?"))], relatable: example,
        evidenceRefs: refs, sourceRefs: unique([...b.sourceRefs, ...facts.filter(f => example.evidenceRefs.includes(f.id)).flatMap(f => f.sourceRefs)]),
        kind: example.evidenceRefs.some(id => facts.some(f => f.id === id && f.kind === "mbti")) ? "fusion" as const : b.kind,
        labels: unique([...facts.filter(f => example.evidenceRefs.includes(f.id)).map(factLabel), ...b.labels]).slice(0, 4) };
    }) };
  });
  const opening = base.opening.map(b => {
    // Keep each changed paragraph's provenance aligned with its new evidence.
    if (b.id === "portrait-resource" && gift) return { ...b, paragraphs: [`${input.name}님에게는 ${factLabel(gift)}의 좋은 패도 있습니다. ${ending.label === "축적형" ? "차곡차곡 남기는 힘에 어떤 도움이 붙는지" : "타고난 성향만으로 설명되지 않는 좋은 자원이 어디에 있는지"} 뒤의 좋은 패 장에서 구체적으로 읽어보세요.`], evidenceRefs: [gift.id], sourceRefs: gift.sourceRefs };
    if (dominant && ["portrait-life", "portrait-horizon"].includes(b.id)) {
      const fs = [dominant, ...(archetype === "connection" && helper ? [helper] : [])];
      return { ...b, paragraphs: [b.id === "portrait-life" ? ending.opening : ending.horizon], evidenceRefs: fs.map(f => f.id), sourceRefs: unique(fs.flatMap(f => f.sourceRefs)) };
    }
    return b;
  });
  const direction = [ending.strength, gift ? `${factLabel(gift)}의 좋은 패를 이번 선택에 보태세요. 그 힘을 쓰는 사람과 환경을 가까이 두면 자신의 기반을 더 넓게 사용합니다. 없는 장점을 흉내 내는 대신 이미 가진 자원에 구체적인 자리를 주세요.` : "이미 익숙하게 해온 방식 가운데 앞으로도 키우고 싶은 것을 고르세요. 더 잘 보이는 역할보다 다시 해보고 싶은 경험에 방향의 실마리가 있습니다.", ending.excess,
    `${ending.action} ${ending.close}${endVoice ? `. ${endVoice.row.closing}` : ""}.`].join("\n\n");
  return { ...base, version: FINAL_COMPREHENSIVE_VERSION, opening, sections, direction, directionArchetype: archetype,
    directionEvidenceRefs: unique([...(dominant ? [dominant.id] : base.directionEvidenceRefs), ...(archetype === "connection" && helper ? [helper.id] : []), ...(gift ? [gift.id] : []), ...(endVoice?.facts.map(f => f.id) ?? [])]) };
}

function contextAction(section: string, input: ComprehensiveV3Input): string {
  const status = input.context.lifeStatus, job = interpretCareerContext(input.context.fieldLabel ?? "");
  const active = ["employee", "freelancer", "business_owner"].includes(status);
  if (section === "career") {
    const place = LIFE_EXAMPLES[status];
    const detail = active ? job.industry === "software" ? "소프트웨어 분야에서는 새로운 기능보다 실제로 쓰는 사람이 편해지는 순간을 알아보세요." : job.industry === "manufacturing" ? "제조·품질 분야에서는 작은 차이를 알아보고 일정한 결과로 이어가는 감각을 살펴보세요." : job.roleFamily === "project_creation" ? "디자인·기획 분야에서는 내 취향과 상대에게 전할 뜻이 만나는 지점을 찾아보세요." : job.roleFamily === "sales_operations" ? "영업 분야에서는 처음의 호감과 오래 이어지는 신뢰의 차이를 살펴보세요." : "" : "";
    return `${place}에서 맡고 싶은 몫과 무리하게 떠안는 몫을 구분하세요. ${detail || "내가 잘하는 방식이 다른 사람에게도 편한 방식인지 함께 확인해 보세요."}`;
  }
  if (section === "money") return status === "student" ? "새 활동에 쓸 시간과 비용을 함께 보세요. 남들이 한다는 이유보다 이번 학기 내 생활에 남길 경험이 무엇인지 고르세요." : status === "business_owner" ? "새 기회가 매력적이어도 계속 지킬 약속과 생활의 여유를 함께 보세요. 벌리는 일과 남기는 자산이 같은 방향인지 돌아보세요." : status === "freelancer" ? "새 의뢰가 줄 경험과 내 시간을 함께 비교하세요. 빈 시간을 전부 채우는 것과 원하는 일을 쌓는 것은 다릅니다." : status === "employee" ? "보상을 기다리는 시간에도 자기 생활의 선택권을 지키세요. 반복해서 쓰는 비용과 나를 오래 즐겁게 하는 경험을 구분해 보세요." : "생활에 꼭 필요한 몫과 새롭게 시도할 몫을 나누세요. 불안한 날의 소비와 원래 원했던 선택을 구분해 보세요.";
  return status === "student" ? "수업에서 배운 것을 좋아하는 주제에 옮겨보세요. 설명할 수 있는 것과 직접 써본 것의 차이에서 다음 배울 거리가 보입니다." : status === "exam_certificate" ? "낯선 자료를 더하기 전에 아는 내용을 자기 말로 설명해 보세요. 막힌 부분 하나를 다시 이해하는 경험이 다음 진도를 단단하게 합니다." : status === "job_seeker" ? "관심 있는 역할을 작은 활동으로 먼저 경험해 보세요. 실제로 해본 뒤에도 궁금한 것이 남는지가 배움의 방향을 알려줍니다." : status === "business_owner" ? "늘 하던 선택을 다른 업종에서는 어떻게 하는지 살펴보세요. 내 경험 밖의 관점을 만나는 시간이 다음 판단의 재료가 됩니다." : status === "freelancer" ? "의뢰와 무관하게 스스로 궁금한 것을 작게 만들어보세요. 누구의 평가도 받지 않는 연습에서 내 방식의 다음 갈래가 나옵니다." : active ? "지금 하는 일에서 생긴 궁금증 하나를 일 밖의 책이나 경험으로 넓혀보세요. 당장 쓸모가 없는 배움도 다음에 보는 관점을 바꿉니다." : "가볍게 시작했는데 자꾸 다시 떠오르는 주제를 따라가 보세요. 얼마나 빨리 익혔는지보다 다시 만나고 싶은 마음을 기록하세요.";
}

export const finalArchetypeLabels = Object.fromEntries(Object.entries(ENDINGS).map(([id, value]) => [id, value.label]));
