import { ATOMIC_BY_ID } from "./atomicRegistry";
import { composeComprehensiveV31 } from "./comprehensiveComposition";
import { SIGNAL_STORIES, DAY_GUIDANCE, signalImage } from "./comprehensiveEditorial";
import { comprehensiveContextDirections, RELATIONSHIP_DIRECTIONS } from "./comprehensiveContext";
import { COMPREHENSIVE_ATOMIC_COPY } from "./comprehensiveCopy";
import { FELT_QUESTIONS, GIFT_SCENES, LOVE_SCENES, PEOPLE_SCENES, GOD_PERSONA } from "./comprehensiveStoryCopy";
import { compoundProminence, factLabel, prioritizeStoryCandidates, storySupport, unique } from "./comprehensiveStoryEvidence";
import type { ComprehensiveV3Block as Block, ComprehensiveV3Draft, ComprehensiveV3Input, ComprehensiveV3Section } from "./comprehensive";
import type { Evidence, Domain } from "./types";
export { storyFeatureRows, validateStoryCopy } from "./comprehensiveStoryEvidence";

export const STORY_COMPREHENSIVE_VERSION = "comprehensive_v3.2-story.1" as const;
export type WritingMode = "judgment" | "question" | "image" | "reversal" | "contrast" | "tension" | "gift" | "application" | "criterion" | "closing";

// Shared action families, not sentence IDs: these own paraphrased advice too.
const ACTION_FAMILIES: Readonly<Record<string, string>> = {
  "career-delegation": "delegate-criteria", "study-thought-path": "externalize-thought", "money-comparison-cost": "comparison-budget",
  "help-as-perspective": "ask-for-perspective", "assets-circulate": "use-stored-assets",
  "career-pressure": "recovery-after-output", ten_god_shi_shen: "recovery-after-output", ten_god_qi_sha: "recovery-after-output",
  ten_god_zheng_guan: "delegate-criteria", "leadership-allows-difference": "lead-autonomy", twelve_sinsal_jangseong: "lead-autonomy",
  "recognition-as-authorship": "named-role", twelve_sinsal_banan: "named-role",
  ten_god_pian_yin: "externalize-thought", ten_god_jie_cai: "comparison-budget", gwiin_cheoneul: "ask-for-perspective", gwiin_jaego: "use-stored-assets",
};

/** A small, explicit editorial composer for comprehensive only. Facts, core
 * rules, old compositions and other products remain untouched. */
export function composeComprehensiveV32(input: ComprehensiveV3Input, candidates: readonly Block[]): ComprehensiveV3Draft {
  const calculation = input.calculation!;
  const ctx = { ...input, calculation }, facts = input.facts;
  const ranked = prioritizeStoryCandidates(candidates, ctx);
  const before = composeComprehensiveV31(input, candidates);
  const find = (id: string) => facts.find(f => f.featureId === id && f.certainty === "confirmed");
  const basis = (...ids: string[]) => ids.flatMap(id => { const f = find(id); return f ? [f] : []; });
  const strong = (id: string) => storySupport(id, facts, calculation).substantial;
  const refs = (b: Block) => facts.filter(f => b.evidenceRefs.includes(f.id));
  const hero = (id: string) => ranked.find(b => b.id === id && b.prominence === "hero");
  const natalStrong = facts.filter(f => strong(f.featureId) && f.kind !== "mbti");
  const gods = unique(natalStrong.filter(f => f.featureId.startsWith("ten_god_")).map(f => f.featureId)).toSorted((a, b) => (storySupport(b, facts, calculation).weight ?? 0) - (storySupport(a, facts, calculation).weight ?? 0));
  const day = facts.find(f => f.kind === "day_pillar" && f.certainty === "confirmed");
  const primary = hero("pair:jie_cai+shi_shen") ?? hero("deep-perspective") ?? ranked.find(b => b.kind === "compound" && b.prominence === "hero") ?? ranked[0];
  const mainRefs = primary ? refs(primary) : day ? [day] : natalStrong.slice(0, 2);
  const block = (id: string, mode: WritingMode, title: string, paragraphs: readonly string[], action: string, fs: readonly Evidence[], domain: Domain, extra: Partial<Block> = {}): Block => ({
    id, kind: "atomic", headline: title, paragraphs, reading: "", why: "", caution: "", action, domains: [domain], format: "prose", writingMode: mode, discoveryKey: id, adviceKeys: action ? [ACTION_FAMILIES[id] ?? id] : [],
    evidenceRefs: unique(fs.map(f => f.id)), labels: unique(fs.map(factLabel)).slice(0, 4), sourceRefs: unique([...fs.flatMap(f => [...f.sourceRefs, ...(ATOMIC_BY_ID.get(f.featureId)?.sourceRefs ?? [])]), `comprehensiveStorytelling:${id}`]), ...extra,
  });
  const from = (b: Block, mode: WritingMode, id = b.id): Block => ({ ...b, id, reading: "", why: "", writingMode: mode, discoveryKey: id, adviceKeys: b.action ? [id] : [], labels: b.labels.slice(0, 4) });

  // One semantic discovery/action owns one place. When two adjacent authored
  // modes coincide, reorder different discoveries, or combine their paragraphs
  // into one beat; never just relabel identical copy as a different mode.
  const owned = new Set<string>(), advice = new Set<string>();
  let lastMode: WritingMode | undefined;
  const arrange = (blocks: readonly Block[]) => {
    const pending = blocks.filter(b => {
      if (!b.evidenceRefs.length || (b.discoveryKey && owned.has(b.discoveryKey)) || b.adviceKeys?.some(k => advice.has(k))) return false;
      if (b.discoveryKey) owned.add(b.discoveryKey);
      b.adviceKeys?.forEach(k => advice.add(k)); return true;
    });
    const result: Block[] = [];
    while (pending.length) {
      const index = pending.findIndex(b => b.writingMode !== lastMode);
      const next = pending.splice(index < 0 ? 0 : index, 1)[0];
      if (index < 0 && result.length) {
        const prev = result.pop()!;
        result.push({ ...prev, paragraphs: [...(prev.paragraphs ?? []), prev.action, ...(next.paragraphs ?? [])].filter(Boolean), action: next.action,
          evidenceRefs: unique([...prev.evidenceRefs, ...next.evidenceRefs]), sourceRefs: unique([...prev.sourceRefs, ...next.sourceRefs]), labels: unique([...prev.labels, ...next.labels]).slice(0, 4), adviceKeys: [...(prev.adviceKeys ?? []), ...(next.adviceKeys ?? [])] });
      } else result.push(next);
      lastMode = next.writingMode;
    }
    return result;
  };
  const sections: ComprehensiveV3Section[] = [];
  const add = (id: string, title: string, bs: readonly Block[]) => { const blocks = arrange(bs); if (blocks.length) sections.push({ id, title, blocks }); };
  let questions = 0;
  const asked = new Set<string>();
  const question = (id: string) => { if (questions >= 3 || asked.has(id) || !strong(id) || !FELT_QUESTIONS[id]) return ""; asked.add(id); questions++; return FELT_QUESTIONS[id]; };

  const competitive = !!hero("pair:jie_cai+shi_shen"), deep = !!hero("deep-perspective");
  const openingLead = competitive ? `${input.name}님은 가만히 마음먹는 데서 끝나는 사람이 아닙니다. 자기 기준이 생기면 손을 움직여 눈앞에 결과를 놓고 싶어 합니다. 평소에는 자기 속도로 가다가도 비슷한 사람이 먼저 나아가는 모습을 보면 안쪽의 불이 켜집니다. 경쟁은 단순히 이기고 싶은 마음보다, 스스로 어디까지 해낼지 확인하는 자극입니다.`
    : deep ? `${input.name}님은 빨리 이해한 척하는 것보다 진짜 자기 답을 갖는 쪽을 택합니다. 남들이 그냥 넘긴 장면에도 혼자 붙잡는 이유가 있습니다. 안으로 깊어지는 시간과 밖에서 살아가는 속도가 꼭 같지는 않은 사람입니다.`
      : `${input.name}님은 ${GOD_PERSONA[gods[0]] ?? "남의 방식보다 자신이 납득한 방향을 알아가는 사람입니다."} 한 가지 성격으로 자신을 설명하기보다, 어떤 순간에 본래 힘이 살아나는지 보세요.`;
  const gifts = before.sections.find(s => s.id === "gifts")?.blocks ?? [];
  const giftFact = gifts.flatMap(refs).find(f => f.kind === "gwiin") ?? gifts.flatMap(refs)[0];
  const image = day ? signalImage(day.featureId) : "";
  const opening = arrange([
    block("portrait-person", "judgment", "", [openingLead], "", competitive || deep ? mainRefs : basis(gods[0]), "identity", { kind: competitive || deep ? primary?.kind ?? "atomic" : "atomic", compoundId: (competitive || deep) && primary?.kind === "compound" ? primary.id : undefined, prominence: primary?.prominence }),
    block("portrait-inner", "reversal", "", [deep ? `${image} 겉에서는 결론이 빠르게 보여도 그 뒤에는 혼자 연결해 둔 생각이 있습니다. 사람들 사이에서 방향을 말하는 자신과 아무 말 없이 안으로 들어가는 자신은 모순이 아닙니다. 밖으로 꺼내기 전에 속에서 모양을 만드는 시간입니다.` : `${image} 첫인상에 보이는 모습만으로 안쪽의 힘까지 판단하지 마세요. 어떤 일은 바로 반응하고 어떤 일은 오래 품는 차이가 이 사람의 리듬을 만듭니다.`], "", [...(day ? [day] : []), ...(deep ? refs(hero("deep-perspective")!) : [])], "identity"),
    ...(giftFact ? [block("portrait-resource", "gift", "", [`좋은 패는 이미 있습니다. ${factLabel(giftFact)}의 힘은 남들처럼 되기 위한 숙제가 아니라 자기 방식에 더할 자원입니다. 자신을 단단하게 만드는 일과 모든 것을 혼자 해내는 일은 다릅니다. 잘되는 장면을 알아보고 그 장면으로 다시 들어가는 선택이 중요합니다.`], "", [giftFact], "identity")] : []),
    block("portrait-life", "contrast", "", ["가진 힘은 일에서만 평가받는 것이 아닙니다. 취향을 끝까지 익혀 보는 시간, 소중한 사람에게 마음을 쓰는 방식, 남의 속도와 다른 선택을 받아들이는 순간에도 드러납니다. 잘하는 역할 하나로 삶 전체를 채우지 마세요."], "", mainRefs, "lifestyle"),
    block("portrait-horizon", "closing", "", [deep ? "사람을 만나는 시간만큼 혼자 머무는 시간도 필요합니다. 중요한 것은 둘 중 하나를 포기하는 일이 아니라 돌아올 문을 남기는 일입니다. 자기 안의 깊이를 지키면서도 그 깊이에 누군가 닿게 하는 삶, 그 방향으로 읽어보세요." : "앞으로 더할 것은 남의 장점이 아니라 내 힘이 오래 쓰일 자리입니다. 일에서는 가능성을 시험하고, 관계에서는 마음을 나누고, 생활에서는 자기 속도를 되찾으세요. 잘 사는 모습이 하나뿐이라고 생각하지 않는 데서 다음 선택이 시작됩니다."], "", deep ? refs(hero("deep-perspective")!) : mainRefs, "identity"),
  ]);
  // Opening evidence is one compact line; individual paragraphs keep full refs.
  const openingLabels = unique(opening.flatMap(b => b.labels)).slice(0, 7);
  const compactOpening = opening.map((b, i) => ({ ...b, labels: i === 0 ? openingLabels : [] }));

  const self: Block[] = [];
  if (day) self.push(block("self-durability", "image", factLabel(day), [DAY_GUIDANCE[day.featureId]?.[0] ?? image], DAY_GUIDANCE[day.featureId]?.[1] ?? "내가 쉽게 놓지 못하는 가치 하나를 적어 보세요. 남에게 설명할 이유보다 스스로 지켜온 이유부터 떠올려 보세요.", [day], "identity"));
  const feltId = strong("sinsal_hyeonchim") ? "sinsal_hyeonchim" : gods.find(id => id !== "ten_god_jie_cai" && FELT_QUESTIONS[id]);
  if (feltId) self.push(block("self-noticing", "question", question(feltId), [feltId === "sinsal_hyeonchim" ? "현침의 바늘은 작고 정확합니다. 큰 그림만 보는 사람이 놓친 차이를 짚는 데 힘이 있습니다. 모두가 괜찮다고 넘어가는데 자신에게만 걸리는 부분이 있다면, 그 관찰을 무조건 예민함으로 치부할 필요는 없습니다." : `${factLabel(find(feltId)!)}의 힘은 겉으로 보이는 결과 이전에 무엇을 받아들이고 무엇을 거절하는지에서 드러납니다. 남과 같은 선택을 했더라도 스스로 납득한 이유가 있어야 자기 것이 됩니다.`], feltId === "sinsal_hyeonchim" ? "처음 걸린 지점을 바로 결론으로 내리지 말고 실제 관찰한 것과 해석한 것을 나눠 보세요. 예리한 눈에 확인하는 습관을 더하면 정확성이 살아납니다." : "마음이 놓였던 선택을 하나 떠올려 보세요. 남의 평가가 좋았기 때문인지, 스스로 지키고 싶은 기준에 맞았기 때문인지 구분해 보세요.", basis(feltId), "identity"));
  add("strength", "내가 가진 가장 강한 힘", self);

  const choices: Block[] = [];
  if (competitive) {
    const fs = refs(hero("pair:jie_cai+shi_shen")!), trait = find("mbti:ENTJ:traits:thinkingStyle:time_attack_processing");
    choices.push(block("choices-competition", "question", question("ten_god_jie_cai"), ["겁재의 자극이 식신의 손을 움직입니다. 머릿속으로 경쟁하기보다 직접 만들어 차이를 확인하는 것이 이 조합의 쓸모입니다. 다만 타인의 출발 신호에만 반응하면 내가 원래 좋아했던 일이 무엇인지 뒤로 밀립니다.", ...(trait ? ["ENTJ의 빠른 처리 습관이 겹치면 비교한 순간부터 완성까지의 간격이 짧아집니다. 이때 속도를 줄이는 것보다 무엇을 비교할지 직접 고르는 편이 효과적입니다."] : [])], "경쟁 상대를 고르기 전에 이번에 더 잘하고 싶은 부분을 하나 고르세요. 남보다 먼저가 아니라 전보다 나아졌다는 증거를 남기세요.", [...fs, ...(trait ? [trait] : [])], "identity", { kind: trait ? "fusion" : "compound", compoundId: "pair:jie_cai+shi_shen", prominence: "hero" }));
  }
  if (strong("twelve_sinsal_yeokma") && strong("twelve_sinsal_hwagae")) choices.push(block("choices-motion-depth", "tension", "나가고 싶은 마음과 안에서 숙성하려는 마음", ["새 환경에서 자극을 얻는 역마와 조용히 의미를 만드는 화개가 함께 있습니다. 늘 밖으로만 나가면 경험은 많은데 내 것이 남지 않고, 안에서만 생각하면 생각을 바꿔 줄 새 장면이 줄어듭니다. 둘 중 어느 쪽이 진짜 나인지 고를 필요는 없습니다."], "새 경험을 한 뒤에는 혼자 소화할 여백을 붙이세요. 움직임과 머무름을 경쟁시키지 말고 하나의 리듬으로 쓰세요.", basis("twelve_sinsal_yeokma", "twelve_sinsal_hwagae"), "identity", { kind: "compound", compoundId: "story:movement-depth", prominence: "hero" }));
  if (!choices.length) {
    const b = ranked.find(b => b.prominence === "hero" && b.kind === "compound" && b.domains.includes("identity"));
    if (b) { const felt = gods.find(id => !asked.has(id) && FELT_QUESTIONS[id]); const q = felt ? question(felt) : "";
      choices.push({ ...from(b, "criterion", "choices-personal-standard"), headline: "내가 고른 기준과 남에게 배운 기준", paragraphs: [q, b.why].filter(Boolean), action: b.action, compoundId: b.id,
        evidenceRefs: unique([...b.evidenceRefs, ...(felt ? basis(felt).map(f => f.id) : [])]), labels: unique([...b.labels, ...(felt ? basis(felt).map(factLabel) : [])]).slice(0, 4) }); }
  }
  add("choices", "생각하고 선택하는 방식", choices);

  add("gifts", "내가 가진 좋은 패", gifts.filter(b => refs(b).some(f => strong(f.featureId))).map(b => {
    const f = refs(b)[0], scene = GIFT_SCENES[f.featureId];
    return scene ? block(scene.discovery, scene.mode, scene.title, [scene.body], scene.action, refs(b), "identity", { format: "gift", positiveFeatureIds: [f.featureId] })
      : block(`gift-use:${f.featureId}`, "application", factLabel(f), ["이 좋은 패의 쓸모는 특별한 날보다 자주 만나는 선택에서 드러납니다.", ...(b.paragraphs ?? []).slice(1)], SIGNAL_STORIES[f.featureId]?.[2] ?? b.action, refs(b), "identity", { format: "gift", positiveFeatureIds: [f.featureId] });
  }));

  const directions = comprehensiveContextDirections(input.context, true);
  const generalDirections = comprehensiveContextDirections({ ...input.context, fieldLabel: "" }, true);
  const career: Block[] = [];
  const leadership = hero("leadership-pressure") ?? hero("official-leadership-entj");
  if (leadership) career.push(block("career-delegation", "criterion", "일의 크기보다 내가 바꿀 수 있는 범위", ["역할이 모호하고 급한 일이 자꾸 생기는 자리에서는 무작정 더 열심히 하는 것으로 문제가 끝나지 않습니다. 방향을 잡고 압박에 대응하는 힘이 있는 만큼, 직접 처리한 건수보다 다음 사람이 덜 헤매게 만든 기준으로 성과를 보세요."], "책임을 받을 때는 결정권도 같이 받으세요. 매번 자신을 부르는 문제 하나를 골라 다른 사람도 판단할 수 있는 기준을 남기세요.", refs(leadership), "career", { kind: leadership.kind, compoundId: leadership.id, prominence: "hero", format: "strategy" }));
  const load = hero("pair:qi_sha+zheng_guan"), loadTrait = find("mbti:ENTJ:traits:risks:rest_and_family_neglect");
  if (load && loadTrait) career.push(block("career-pressure", "reversal", "급한 일을 잘한다는 말의 뒷면", ["관성과 ENTJ의 몰입이 겹치면 중요한 순간에 일을 붙잡는 힘이 있습니다. 문제는 긴급한 부탁이 반복되면서 자신에게만 평상시가 없어지는 때입니다. 업무에서 비어 있는 자리를 채우는 동안 내 생활에 빈자리가 생기는지 보세요."], "빠르게 끝낸 일의 다음 일정까지 곧바로 채우지 마세요. 대응한 뒤 일상의 속도로 돌아오는 것까지 업무의 끝으로 정하세요.", [...refs(load), loadTrait], "career", { kind: "fusion", compoundId: load.id, prominence: "hero" }));
  if (!career.length) { const b = ranked.find(b => b.prominence === "hero" && b.kind === "compound" && b.domains.includes("career")); if (b) career.push({ ...from(b, "criterion", "career-fit"), paragraphs: [b.why], compoundId: b.id }); }
  if (career.length) career.push(block("context:career", "application", "지금 하는 일에 옮기면", [], directions[0].replace(generalDirections[0], "").trim() || directions[0], career.flatMap(refs).slice(0, 4), "career", { kind: "context", format: "strategy" }));
  add("career", "일의 결", career);

  const money: Block[] = [];
  const wealthPair = hero("pair:pian_cai+zheng_cai"), wealth = gods.filter(id => /pian_cai|zheng_cai/.test(id));
  if (wealthPair) money.push(block("money-two-hands", "contrast", "기회를 잡는 손과 지키는 손", ["바깥의 흐름을 보는 감각과 반복되는 자원을 관리하는 힘이 함께 충분히 드러납니다. 편재는 넓게 살피고 정재는 남길 것을 고릅니다. 둘을 잘 쓰면 새로운 제안을 보는 눈을 잃지 않으면서 생활의 기반도 지킵니다."], "시도할 자원과 계속 유지할 자원을 먼저 나누세요. 확장의 흥분으로 두 몫을 다시 합치지 않는 것이 선택 기준입니다.", refs(wealthPair), "money", { kind: "compound", compoundId: wealthPair.id, prominence: "hero" }));
  else if (wealth.length) money.push(block("money-resource-eye", "judgment", wealth[0] === "ten_god_pian_cai" ? "새 필요를 알아보는 감각" : "반복되는 흐름을 아는 감각", [wealth[0] === "ten_god_pian_cai" ? "자원이 어디에서 어디로 움직이는지, 누가 무엇을 필요로 하는지에 관심이 갑니다. 편재의 힘은 무조건 크게 벌이는 데 있지 않고 남들이 놓친 교환의 접점을 알아보는 데 있습니다." : "작은 금액이나 반복되는 지출도 그냥 흘려보내기보다 자기 생활에서 차지하는 몫을 알고 싶어 합니다. 정재의 힘은 한 번의 큰 결과보다 계속 유지할 기반을 돌보는 데 쓰입니다."], "새로운 것을 얻을 때에는 그것을 유지하는 데 드는 시간도 함께 보세요. 가격표에 없는 비용까지 알아야 내게 좋은 선택인지 드러납니다.", basis(wealth[0]), "money", { prominence: "hero" }));
  else {
    const earn = gods.find(id => /shi_shen|shang_guan/.test(id)) ?? gods[0];
    if (earn) money.push(block("money-time-value", "reversal", "돈보다 먼저 빠져나가는 것은 내 시간입니다", ["재성이 작게 잡힌 원국을 큰돈의 감각이 강한 사람으로 읽지는 않습니다. 여기서는 더 뚜렷한 힘이 어디에 쓰이는지부터 봅니다. " + (/shi_shen|shang_guan/.test(earn) ? "만들고 표현하는 힘이 있으니 직접 해낸 결과의 가치를 낮게 보지 마세요. 쉽게 해냈다는 이유로 시간을 공짜처럼 쓰는 습관이 쌓이지 않는지가 중요합니다." : "배우거나 책임지고 판단하는 데 쓰는 시간도 자원입니다. 남에게는 작은 부탁이어도 내 생활에서는 큰 몫을 차지하는 일이 있습니다.")], "돈을 쓴 뒤 남는 만족과 시간까지 함께 돌아보세요. 남이 좋다는 물건보다 내가 자주 쓰는 것에 자기 기준이 드러납니다.", basis(earn, "ten_god_pian_cai", "ten_god_zheng_cai"), "money", { sourceRefs: [...basis(earn).flatMap(f => f.sourceRefs), "SajuCalcResult:tenGods.distribution:偏財", "SajuCalcResult:tenGods.distribution:正財", "comprehensiveStorytelling:money-time-value"] }));
  }
  if (strong("ten_god_jie_cai")) money.push(block("money-comparison-cost", "contrast", "남의 속도가 내 지출의 이유가 될 때", ["경쟁의 자극은 실력을 키우는 데 쓰면 좋지만, 자원을 써서 뒤처진 기분을 지우려 하면 다른 문제가 됩니다. 갖고 싶은 것과 남이 가졌기 때문에 급해진 것은 구분해야 합니다."], "비교한 직후 생긴 구매나 공동 지출은 잠깐 미루세요. 다음 날에도 내 생활에 필요한지 보면 욕구의 주인이 누구인지 분명해집니다.", basis("ten_god_jie_cai"), "money"));
  if (money.length) money.push(block("context:money", "application", input.context.lifeStatus === "business_owner" ? "사업의 흐름으로 옮기면" : "지금의 자원을 남기는 법", [], directions[1], money.flatMap(refs).slice(0, 4), "money", { kind: "context" }));
  add("money", "돈의 결", money);

  const people: Block[] = [];
  for (const scene of PEOPLE_SCENES) {
    const trait = find(scene.trait), signal = scene.signals.find(strong);
    if (trait && signal) people.push(block(`people:${scene.trait}`, "judgment", scene.title, [scene.body], scene.action, [...basis(signal), trait], "relationship", { kind: "fusion", prominence: "hero" }));
  }
  const privateFs = basis("twelve_sinsal_hwagae", "shinsal:GOSINSAL").filter(f => strong(f.featureId));
  const socialFs = basis("twelve_sinsal_jangseong", "twelve_sinsal_yeokma", "twelve_sinsal_mangsin", "sinsal_dohwa").filter(f => strong(f.featureId));
  if (privateFs.length && socialFs.length) people.push(block("people-public-private", "reversal", "사람 속의 나와 마음 안쪽의 나는 다릅니다", ["밖에서는 먼저 움직이거나 대화의 흐름을 잡아도 속생각까지 쉽게 내보내지는 않습니다. 사람을 만나는 능력과 깊이 마음을 여는 속도가 다른 사람입니다. 여러 사람과 잘 지냈다는 이유로 혼자 있는 시간이 필요 없어진 것은 아닙니다.", "가까운 사람을 고르는 기준도 만난 횟수만은 아닙니다. 침묵을 불편해하지 않고, 나 혼자 생각한 뒤 돌아와도 관계를 의심하지 않는 사람이 편합니다."], "모든 관계를 같은 깊이로 만들려고 애쓰지 마세요. 넓게 인사할 사람과 안쪽의 이야기를 나눌 사람이 달라도 됩니다.", [...privateFs.slice(0, 2), ...socialFs.slice(0, 2)], "relationship", { kind: "compound", compoundId: "story:public-private", prominence: "hero" }));
  const helpful = find("mbti:ENTJ:traits:relationships:useful_support_style");
  if (helpful && strong("ten_god_pian_yin")) people.push(block("people-useful-affection", "judgment", "관심이 생기면 쓸모 있는 것을 건넵니다", ["편인의 관점과 ENTJ의 지원 방식이 겹치면 마음에 둔 사람에게 정보나 해결의 실마리를 건네고 싶어집니다. 가벼운 안부만 주고받기보다 상대의 상황에 실제로 보탬이 되는 사람이 되고 싶은 쪽입니다. 그래서 함께 생각을 주고받는 관계에서 친밀함이 자랍니다."], "좋은 자료를 보내는 날에는 왜 그 사람이 떠올랐는지도 한마디 붙여 보세요. 정보에 담긴 관심까지 전해져야 도움과 친밀함이 같이 남습니다.", [...basis("ten_god_pian_yin"), helpful], "relationship", { kind: "fusion", prominence: "hero" }));
  if (!people.length) {
    const relationship = ranked.find(b => b.kind === "fusion" && b.prominence === "hero" && b.domains.includes("relationship"));
    if (relationship) people.push({ ...from(relationship, "reversal", "people-behavior"), paragraphs: [relationship.reading.replace(/장면이 익숙한가요\?$/, "장면입니다.")] });
    const f = socialFs[0] ?? privateFs[0] ?? find(gods[0]);
    if (f) people.push(block("people-distance", "contrast", "가까워지는 방식에도 자기 리듬이 있습니다", [SIGNAL_STORIES[f.featureId] ? `${SIGNAL_STORIES[f.featureId][0]}의 모습은 관계에서도 드러납니다. ${SIGNAL_STORIES[f.featureId][1]}이 사람 속에서 쓰이는 자원입니다. 친해지는 속도가 빠른 사람과 깊이 신뢰하기까지 오래 걸리는 사람을 같은 기준으로 대하지 마세요.` : "스스로 납득한 관계를 중요하게 보는 힘은 사람을 대할 때도 드러납니다. 잘 맞추는 사람만 찾으면 편하지만 내 시야를 넓혀 주는 차이까지 없어집니다. 나와 다른 방식으로 관심을 표현하는 사람도 알아보세요."], "상대가 내 방식으로 다가오지 않았다는 이유만으로 관심이 없다고 정하지 마세요. 실제로 반복해 준 행동 하나를 보세요.", [f], "relationship"));
  }
  add("people", "사람 관계의 결", people);

  const love: Block[] = [];
  for (const scene of LOVE_SCENES) {
    const trait = find(scene.trait), signal = scene.signals.find(strong);
    const additional = (scene.additionalTraits ?? []).map(find);
    if (!trait || !signal || additional.some(f => !f)) continue;
    love.push(block(scene.id, scene.mode, scene.title, scene.paragraphs, scene.action, [...basis(signal), trait, ...additional.filter((f): f is Evidence => !!f)], "love", { kind: "fusion", prominence: "hero", format: "relationship" }));
    if (love.length >= 2) break;
  }
  const spouse = find("spouse_palace:day_branch");
  if (!love.length && spouse && gods[0]) love.push(block("love-natal-style", "judgment", /guan|qi_sha/.test(gods[0]) ? "작은 약속이 쌓일 때 마음이 놓입니다" : "나란히 살아갈 수 있는 사람", [/guan|qi_sha/.test(gods[0]) ? "책임의 기운이 뚜렷해 사랑에서도 말보다 지키는 태도에 마음이 갑니다. 가볍게 던진 약속을 잊지 않고 가까운 사람의 어려움을 함께 감당하려는 것이 장점입니다. 반대로 관계를 혼자 지탱해야 한다고 느끼면 다정함보다 의무감이 앞섭니다." : "사랑 안에서도 자기 리듬을 지키며 함께할 수 있는지가 중요합니다. 억지로 맞추기보다 편하게 곁에 머무는 사람이 좋습니다. 가까운 사람에게 실제로 쓸 시간과 관심을 남기는 것이 이 힘을 표현하는 방식입니다.", "상대가 무엇을 해줬는지만 세기보다 나와 있을 때 어떤 마음인지 들어보세요. 자신의 노력을 알아주지 않는다는 답답함이 생길수록, 더 많이 해주는 것보다 원하는 것을 서로 말하는 편이 낫습니다."], "편한 관계는 아무 요구도 없는 관계가 아닙니다. 필요한 것을 말해도 서로의 자리가 없어지지 않는 관계입니다.", [spouse, ...basis(gods[0])], "love", { kind: "compound", compoundId: "story:love-natal", prominence: "supporting", format: "relationship" }));
  const attraction = basis("sinsal_dohwa", "sinsal_hongyeom");
  if (attraction.length) love.push(block("love-attraction-choice", "contrast", "호감과 선택은 서로 다른 힘입니다", [attraction.length === 2 ? "도화가 시선을 모으고 홍염이 가까운 사람에게 감정의 온도를 전합니다. 이 두 패가 함께 있어 사람을 끌어당기는 장면과 한 사람에게 인상을 깊게 남기는 장면을 모두 읽습니다. 반응이 좋다는 이유만으로 그 관계가 나에게 편한지는 아직 정해지지 않습니다." : `${factLabel(attraction[0])}의 매력은 사랑의 좋은 출발점입니다. 그러나 관심을 받는 일과 내가 원하는 관계를 선택하는 일은 다릅니다. 오래 편한 사람인지까지 남의 반응으로 정하지 마세요.`], "나를 좋아하는 모습만큼 그 사람 앞에서 내가 어떤 사람이 되는지도 보세요. 매력은 선택권을 넓혀 주는 패이지, 모든 호감에 답해야 할 빚이 아닙니다.", attraction, "love", { kind: attraction.length > 1 ? "compound" : "atomic", compoundId: attraction.length > 1 ? "story:attraction" : undefined, prominence: attraction.every(f => strong(f.featureId)) ? "hero" : "supporting" }));
  if (spouse && love.length) {
    const relation = facts.find(f => f.kind === "relation" && f.certainty === "confirmed" && f.value && typeof f.value === "object" && "positions" in f.value && Array.isArray(f.value.positions) && f.value.positions.includes("day"));
    love.push(block("love-daily-rhythm", "criterion", "사랑의 자리는 평소의 생활에 있습니다", [`일지(${String(spouse.value)})는 배우자궁으로 함께 살펴보는 자리입니다. ${relation ? `${factLabel(relation)}도 확인되지만 합을 좋은 관계의 보장으로, 충을 이별의 예고로 바꾸지 않습니다. ` : "이 한 글자로 미래 상대의 성격을 정하지 않습니다. "}관계의 실제 쓰임은 큰 이벤트 뒤 평소의 시간을 어떻게 나누는지에서 확인하세요.`], RELATIONSHIP_DIRECTIONS[input.relationshipStatus] ?? RELATIONSHIP_DIRECTIONS.unknown, [spouse, ...(relation ? [relation] : []), ...basis(gods[0])].slice(0, 4), "love", { kind: "context", format: "relationship" }));
  }
  add("love", "사랑의 결", love);

  const study: Block[] = [];
  if (deep) {
    const trait = find("mbti:ENTJ:traits:thinkingStyle:te_ni_strategy"), q = question("ten_god_pian_yin");
    study.push(block("study-thought-path", q ? "question" : "reversal", q || "아는 것과 설명할 수 있는 것은 다릅니다", ["화개와 편인이 만드는 깊이는 혼자 생각하는 동안 자랍니다. 다음 단계는 생각을 더 길게 하는 것이 아니라 다른 사람이 따라올 길을 내는 일입니다. 결론이 틀려서 이해받지 못하는 것과 중간 연결이 보이지 않아 이해받지 못하는 것은 다릅니다.", ...(trait ? ["여기에 ENTJ의 Te–Ni가 겹치면 큰 그림을 실행 순서로 바꾸려 합니다. 자신에게 선명한 연결도 처음 듣는 사람에게는 한 단계씩 건널 발판이 필요합니다."] : [])], "새로 배운 것을 설명할 때 결론 앞에 실제 사례 하나를 놓아보세요. 어디에서 상대의 질문이 생기는지가 다음에 배울 지점을 알려 줍니다.", [...refs(hero("deep-perspective")!), ...(trait ? [trait] : [])], "study", { kind: trait ? "fusion" : "compound", compoundId: "deep-perspective", prominence: "hero" }));
    if (!trait) { const scene = ranked.find(b => b.kind === "fusion" && b.prominence === "hero" && b.domains.includes("study"));
      if (scene) study.push({ ...from(scene, "criterion", "study-mbti-method"), paragraphs: [scene.reading.replace(/장면이 익숙한가요\?$/, "장면입니다.")] }); }
  } else {
    const b = ranked.find(b => b.prominence === "hero" && b.kind === "fusion" && b.domains.includes("study")) ?? ranked.find(b => b.prominence === "hero" && b.kind === "compound" && b.domains.includes("study"));
    if (b) study.push({ ...from(b, "criterion", "study-transfer"), paragraphs: [b.kind === "fusion" ? b.reading.replace(/장면이 익숙한가요\?$/, "장면입니다.") : b.why], compoundId: b.kind === "compound" ? b.id : undefined });
  }
  if (study.length) study.push(block("context:study", "application", "배움을 생활 밖으로 꺼내는 방법", [], directions[2], study.flatMap(refs).slice(0, 4), "study", { kind: "context" }));
  add("study", "배우고 성장하는 방식", study);

  const balanceCopy: Record<string, readonly [string, string]> = {
    wood: ["목을 보태는 일은 새로운 시도의 크기를 작게 잡는 데서 시작하세요. 성장의 상징을 내 하루에 반복 가능한 움직임으로 가져오는 방법입니다.", "목이 강할 때는 뻗는 가지보다 뿌리가 감당할 범위가 기준입니다. 더 벌이는 힘을 잠시 멈추고 마친 경험을 남기세요."],
    fire: ["화의 표현을 큰 무대에서만 찾지 마세요. 밝은 시간에 몸을 움직이고 좋은 마음을 말로 전하는 작은 장면부터 만들어 보세요.", "화가 강할 때는 얼마나 뜨겁게 시작했는지보다 열을 내려놓는 시간이 기준입니다. 반응해야 할 때와 반응하지 않아도 될 때를 나누세요."],
    earth: ["토를 보태려면 돌아갈 자리를 만들어 보세요. 물건의 자리와 반복할 생활 순서가 하루의 바닥을 받쳐 줍니다.", "토가 강할 때는 익숙함이 편안함인지 멈춤인지 구분하는 것이 기준입니다. 오래 유지한 절차 하나를 덜어낼 여지를 찾아보세요."],
    metal: ["금의 보완은 흩어진 것을 가르고 끝을 정하는 연습입니다. 힘을 쓰고 멈추는 활동, 정리와 기록처럼 손에 잡히는 경계부터 만들어 보세요.", "금이 강할 때는 꼭 지킬 기준과 그저 내 취향인 것을 나누는 것이 기준입니다. 다른 방식이 들어올 빈칸을 하나 남기세요."],
    water: ["수의 상징을 생활로 가져오면 흘려보내고 받아들이는 시간이 됩니다. 공부와 기록, 물 가까이에서 보내는 조용한 시간을 취향에 맞게 골라보세요.", "수가 강할 때는 얼마나 오래 생각했는지보다 언제 선택할지가 기준입니다. 자료를 더 모을 때와 경험으로 확인할 때를 구분하세요."],
  };
  const firstBalanceMode = lastMode === "application" ? "criterion" : "application";
  add("balance", "오행 균형을 생활에 쓰는 법", (before.sections.find(s => s.id === "balance")?.blocks ?? []).map((b, i) => {
    const mode = i % 2 ? firstBalanceMode === "application" ? "criterion" : "application" : firstBalanceMode;
    const element = b.id.split(":")[1], high = b.headline.includes("강한");
    const prose = balanceCopy[element][high ? 1 : 0];
    return { ...from(b, mode), paragraphs: [mode === "criterion" && !high ? `선택 기준은 간단합니다. ${prose}` : prose], labels: b.labels.map(l => l.replace(" · 지장간 포함 가중 분포", " · 생활 균형")),
      ...(element === "water" && !high ? { ideas: ["배운 것을 자기 말로 짧게 기록하세요.", "자기 여건에 맞게 수영하거나 물가를 가볍게 걸어보세요.", "강이나 바다 가까운 곳에서 잠시 쉬며 머릿속 말을 내려놓아 보세요.", "이사 같은 큰 결정보다 일상에서 쉽게 돌아갈 쉼의 장소를 찾으세요."] } : {}) };
  }));

  const patternFamily = (risk: string) => risk.includes("지휘 자리") ? "delegate-criteria" : /생각은 깊어|결과 공개/.test(risk) ? "externalize-thought" : risk;
  const patterns = before.patterns.map(p => { const fs = facts.filter(f => p.evidenceRefs.includes(f.id) && strong(f.featureId)); return { ...p, evidenceRefs: fs.map(f => f.id), labels: unique(fs.map(factLabel)).slice(0, 4) }; }).filter(p => {
    const key = patternFamily(p.risk); if (!p.evidenceRefs.length || advice.has(key)) return false; advice.add(key); return true;
  });
  for (const f of natalStrong) {
    if (patterns.length >= 3) break;
    const copy = COMPREHENSIVE_ATOMIC_COPY[f.featureId], key = ACTION_FAMILIES[f.featureId] ?? f.featureId;
    if (!copy || advice.has(key) || patterns.some(p => p.evidenceRefs.some(id => facts.find(e => e.id === id)?.featureId === f.featureId))) continue;
    advice.add(key); patterns.push({ strength: factLabel(f), risk: copy[1], why: copy[0], repair: copy[2], evidenceRefs: [f.id], labels: [factLabel(f)] });
  }
  if (patterns.length < 3 && strong("ten_god_bijian")) patterns.push({ strength: "스스로 판단하고 서는 힘", risk: "도움까지 간섭으로 받아들일 때", why: "독립적인 기준이 강하게 쓰이면 조언을 듣는 일도 주도권을 잃는 것처럼 느껴집니다.", repair: "제안의 내용과 받아들일지 결정할 권한을 분리하세요. 듣는다고 따를 의무가 생기는 것은 아닙니다.", evidenceRefs: basis("ten_god_bijian").map(f => f.id), labels: ["비견"] });
  const direction = [
    competitive ? "당신에게는 마음먹은 것을 손에 잡히는 결과로 바꾸는 힘이 있습니다. 그 힘을 남보다 뒤처지지 않는 데만 쓰면 삶은 계속 다음 출발선을 찾습니다. 이제는 얼마나 앞섰는지와 함께 무엇을 좋아하게 됐는지도 물어보세요." : "자기 힘을 오래 쓴다는 것은 같은 역할을 끝없이 반복한다는 뜻이 아닙니다. 잘하는 방식은 지키되 그 방식으로 해볼 삶의 장면을 넓히세요. 성과를 내는 나와 편안히 쉬는 나를 서로 다른 사람처럼 대하지 마세요.",
    giftFact ? `좋은 패인 ${factLabel(giftFact)}도 삶 안에서 자리가 있어야 빛납니다. 이미 가진 것을 증명하려 애쓰기보다 그것이 자연스럽게 쓰이는 사람과 환경을 알아보세요. 도움과 인정, 배움과 축적 가운데 지금 실제로 손에 닿는 통로를 하나 열어 두세요.` : "이미 익숙하게 해온 것 중 앞으로도 간직하고 싶은 방식을 고르세요. 잘한다는 칭찬보다 다시 해보고 싶은 마음이 오래 갈 방향을 알려 줍니다.",
    "일은 내 능력을 쓰는 자리이고, 돈은 다음 선택을 남기는 자원이며, 사람은 결과를 내지 않는 날에도 함께 살아갈 존재입니다. 어느 하나가 나머지를 모두 대신하게 두지 마세요. 모든 장면에서 가장 유능한 사람이 되려고 하면 정작 내가 편안한 자리가 사라집니다.",
    "이번 주에는 잘해내기 위한 약속 하나와 순전히 좋아서 하는 시간 하나를 나란히 남겨보세요. 가까운 사람에게는 해결해 줄 일이 아니라 함께 나누고 싶은 마음을 한 번 전하세요. 삶을 전부 증명으로 채우지 마세요. 당신의 힘은 자신을 소모하는 데가 아니라, 자기다운 날을 오래 만드는 데 쓰는 것입니다.",
  ].join("\n\n");
  // Exact-sentence suppression complements semantic ownership. Keep distinct
  // applications of the same feature, not repeated instructions in new words.
  const sentences = new Set<string>();
  const fresh = (s: string) => s.split(/(?<=[.!?])\s+/u).filter(part => { const key = part.trim(); if (!key || sentences.has(key)) return false; sentences.add(key); return true; }).join(" ");
  const clean = (b: Block): Block => ({ ...b, paragraphs: b.paragraphs?.map(fresh).filter(Boolean), action: fresh(b.action) });
  return { ...before, version: STORY_COMPREHENSIVE_VERSION, title: `${input.name}님의 결, 나답게 오래 살아가는 힘`, opening: compactOpening.map(clean), openingContext: "", sections: sections.map(s => ({ ...s, blocks: s.blocks.map(clean) })), patterns: patterns.map(p => ({ ...p, why: fresh(p.why ?? ""), repair: fresh(p.repair) })), direction, directionEvidenceRefs: unique([...mainRefs, ...(giftFact ? [giftFact] : [])].map(f => f.id)) };
}

export function storySelectionTrace(input: ComprehensiveV3Input & { calculation: NonNullable<ComprehensiveV3Input["calculation"]> }, candidates: readonly Block[], draft: ComprehensiveV3Draft) {
  const blocks = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)];
  return candidates.filter(b => b.kind === "compound").map(b => ({ ...compoundProminence(b, input), sections: unique(blocks.filter(x => x.compoundId === b.id || x.compoundIds?.includes(b.id)).map(x => x.id)) }));
}
