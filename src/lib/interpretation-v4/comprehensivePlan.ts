import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { STEM_ELEMENT } from "../saju/constants";
import { getTenGod } from "../saju/tenGods";
import type { HeavenlyStem } from "../saju/types";
import { buildContentEvidencePool, materialLabel } from "./contentEvidence";
import { chapterMbtiReadings } from "./contentMbti";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { paragraph, particle, proof } from "./copyRealizer";
import { rhythmReading } from "./productRhythm";
import { MASTER_DIRECTIONS } from "./narrativePortraits";
import type { NarrativeBlock, NarrativeInput, MaterialPacket, Signature } from "./narrativeTypes";
import type { Domain } from "./types";
import type { BoundMaterial } from "./materialPacket";

/** Allocation belongs to the whole person, before any chapter is written.
 * These are editorial choices over existing confirmed evidence, not new facts. */
export function planComprehensive(input: NarrativeInput, packet: MaterialPacket, signature: Signature) {
  const pool = buildContentEvidencePool(input.calculation, packet);
  const profile = getMbtiSourceProfile(input.mbti);
  const find = (id: string) => packet.selected.find(m => m.feature === id && m.evidence.length && m.evidence.every(d => d.usable && d.strength === "strong"));
  const peopleLuck = packet.selected.filter(m => m.feature.startsWith("gwiin_") && MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.includes("help")).map(m => m.feature);
  const publicRoots = [find("gwiin_cheoneul"), find("sinsal_dohwa"), find("twelve_sinsal_jangseong")];
  const publicGift = publicRoots.every(Boolean) ? publicRoots.filter((m): m is BoundMaterial => Boolean(m)) : [];
  const wealth = find("ten_god_zheng_cai") ?? find("ten_god_pian_cai");
  // Read the canonical day-master relation. Earth symbolism never supplies wealth.
  const wealthElements = [...new Set((Object.keys(STEM_ELEMENT) as HeavenlyStem[])
    .filter(stem => ["正財", "偏財"].includes(getTenGod(input.calculation.dayMaster, stem)))
    .map(stem => STEM_ELEMENT[stem]))];
  const outward = packet.selected.find(m => MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.some(t => ["expression", "leadership", "first-attraction"].includes(t)));
  const inward = find("ten_god_pian_yin") ?? find("twelve_sinsal_hwagae") ?? find("sinsal_gwimun");
  const enfjVoice = profile?.traits?.identity?.find(t => t.id === "visionary_group_leader" && t.sourceCoverage === "direct");
  const expressiveLeader = profile?.type === "ENFJ" && enfjVoice && find("twelve_sinsal_jangseong") && find("ten_god_shang_guan");
  const needle = find("sinsal_hyeonchim");
  const peopleJudgment = profile?.traits?.thinkingStyle?.find(t => t.id === "fe_first_judgment" && t.sourceCoverage === "direct");
  const tension = profile?.type === "ENFJ" && needle && peopleJudgment
    ? paragraph("core-real-tension", "틀린 곳이 보이는데, 바로 말하면 분위기가 꺾일 것 같아 표현을 다시 고른 적 있지 않나요? 현침은 작은 오류를 먼저 짚는 눈이고, ENFJ의 사람 우선 판단은 맞는 말도 상대가 받아들일 방식을 살핍니다. 그래서 속으로는 이미 답을 냈는데 입 밖에서는 한 번 더 다듬는 사람이 돼요. 못 봐서 넘어가는 것과 보고도 말을 고르는 것은 다르죠.",
      proof([needle], [], [], ["mbti:ENFJ:traits:thinkingStyle:fe_first_judgment", "content-synthesis:tension:precision-and-delivery"]), "observation", "correct-without-hurting")
    : null;
  const coreRoots = expressiveLeader ? [find("twelve_sinsal_jangseong")!, find("ten_god_shang_guan")!] : [];
  const core = expressiveLeader ? {
    headline: "분위기를 움직이는 말, 그냥 지나치지 않는 눈",
    opening: "사람들이 우물쭈물하면 결국 다음 말을 꺼내는 쪽입니다. 그런데 그저 흥을 띄우는 사람은 아니에요. 어떻게 말해야 움직일지, 지금 순서에서 무엇이 어색한지도 함께 봅니다. 밝게 이끄는 겉모습 안에 꽤 까다로운 편집자가 있는 셈이죠.",
    same: paragraph("core-specific-same", "앞에서 방향을 정하는 장성과, 익숙한 답을 새롭게 바꾸는 상관이 함께 있습니다. ENFJ의 비전형 리더십도 명령만 하기보다 사람들이 움직일 이유를 말로 보여주는 쪽이에요. 둘이 만나는 지점은 무조건 남을 돕는 착함이 아니라, 가만히 있던 자리에 의욕과 다음 순서를 만드는 힘입니다.",
      proof(coreRoots, [], [], ["mbti:ENFJ:traits:identity:visionary_group_leader", "content-synthesis:reinforce:lead-and-express"]), "positive"),
    proof: proof(coreRoots, [], [], ["mbti:ENFJ:traits:identity:visionary_group_leader", "comprehensive:core-before-chapters"]),
  } : null;
  const contrast = packet.fusions.find(f => f.kind === "contrast");
  const rhythm = rhythmReading(input, pool, "comprehensive");
  return { pool, profile, peopleLuck, publicGift, wealth, wealthElements, outward, inward, core, tension,
    coreGyeol: { headline: core?.headline ?? signature.headline,
      features: [...new Set([...(coreRoots.length ? coreRoots.map(m => m.feature) : signature.fusions.flatMap(f => f.myeongliEvidence.map(d => d.evidence.feature))),
        ...packet.selected.filter(m => ["dayMaster", "dayPillar", "structure"].includes(m.material.category)).map(m => m.feature)] )],
      fusion: core ? "lead-and-express" : signature.fusions[0]?.ruleId ?? null,
      tension: tension ? "precision-and-delivery" : rhythm?.relation === "tension" ? "inner-outer-rhythm" : contrast?.ruleId ?? null,
      tensionReviewed: true, yinYang: pool.yinYang.direction,
      elements: packet.symbolicElements.map(e => ({ element: e.element, state: e.state })),
      goodForce: publicGift.map(m => m.feature),
    } };
}
export type ComprehensivePlan = ReturnType<typeof planComprehensive>;

/** Explicit semantic boundary: a generosity trait is not a resource-star money
 * claim; work/study readings cannot silently become identity or money readings. */
export function comprehensiveReadingAllowed(domain: Domain, area: string, feature: string) {
  if (domain === "money") return area === "money" && /^(ten_god_(zheng_cai|pian_cai)|gwiin_jaego|v4_structure:(wealth|outputCreatesWealth))/.test(feature);
  if (domain === "study") return area === "study";
  if (domain === "work") return ["career", "workplace"].includes(area);
  if (["love", "marriage", "relationships"].includes(domain)) return area === domain;
  return area === "identity" || area === "thinkingStyle";
}

export function comprehensiveReadings(plan: ComprehensivePlan, domain: Domain, roots: readonly BoundMaterial[], used: ReadonlySet<string>) {
  if (domain === "money" && plan.profile?.type === "ENFJ" && plan.wealth && !used.has("ENFJ:generous_spending")) {
    const trait = plan.profile.traits?.money?.find(t => t.id === "generous_spending" && t.sourceCoverage === "direct");
    if (trait) return [{ id: "ENFJ:generous_spending", kind: "tension" as const, root: plan.wealth, area: "money" as const,
      behavior: `들인 만큼 남기려는 ${materialLabel(plan.wealth)}의 감각과 달리, ENFJ의 넉넉함은 좋아하는 사람 앞에서 계산기를 잠시 내려놓습니다.`,
      combined: "선물을 고를 땐 상대가 좋아할 얼굴이 먼저 떠오르는데, 집에 와서는 이번 달 남길 몫도 생각나요. 인색한 나와 다정한 나가 싸우는 게 아니라 돈을 쓰는 두 이유가 다른 거죠. 선물할 몫과 내 일의 값을 따로 두면 넉넉함 때문에 수고까지 공짜가 되지는 않아요.",
      provenance: "mbti:ENFJ:traits:money:generous_spending", coverage: trait.sourceCoverage }];
  }
  return chapterMbtiReadings(plan.profile?.type, roots.filter(m => !plan.peopleLuck.includes(m.feature)), domain, used)
    .filter(r => comprehensiveReadingAllowed(domain, r.area, r.root.feature));
}

export function comprehensiveRhythm(plan: ComprehensivePlan): NarrativeBlock | null {
  const yy = plan.pool.yinYang;
  if (!yy.total) return null;
  const support = [plan.outward, plan.inward].filter((m): m is BoundMaterial => Boolean(m));
  const mixed = yy.yin === yy.yang;
  const rhythm = mixed && plan.outward && plan.inward
    ? `밖으로 꺼내는 ${materialLabel(plan.outward)}의 모습 옆에는, 안에서 되짚는 ${materialLabel(plan.inward)}의 결도 있어요. 자리에서는 금방 반응했어도 결정의 이유는 나중에 혼자 다시 따질 수 있죠. 계속 활발해야 한다는 기대도, 늘 조용해야 한다는 기대도 반쪽만 보는 셈입니다.`
    : mixed ? "한쪽으로만 밀어붙인 분포는 아니에요. 이 숫자만으로 성격이 완벽하게 균형 잡혔다고 말할 수는 없습니다. 시작할 때와 마무리할 때 필요한 박자를 구분하는 보조 힌트로 볼 수 있어요."
      : `${yy.yin > yy.yang ? "음은 안에서 관찰하고 정리하는" : "양은 밖으로 시작하고 움직이는"} 리듬에 빗댑니다. 말수나 외향성을 확정하는 숫자는 아니에요. 실제 행동은 함께 드러난 기운과 상황을 같이 봅니다.`;
  return paragraph("comprehensive-yin-yang", `${yy.complete ? "네 기둥" : "시간을 제외하고 확인된 기둥"}에는 음 ${yy.yin}개, 양 ${yy.yang}개가 있습니다. ${rhythm}`,
    proof(support, [], [], yy.provenance), "observation", "start-and-reconsider");
}

const ELEMENT_LIFE = {
  WOOD: ["목", "새로 배우고 시작할 때 눈이 살아나요. 이미 할 수 있는 일에서도 다음 가능성을 찾는 쪽입니다.", "새 시도를 작게 함께 해보는 사람, 처음 해도 질문을 반기는 환경이 목의 상징에 어울려요."],
  FIRE: ["화", "반응을 주고받을 때 생각의 온도가 올라갑니다. 조용히 준비한 것보다 직접 말하고 보여주는 순간에 힘이 잘 보이죠. 신난다고 계속 태우면 즐거운 약속 뒤에도 금방 지칠 수 있어요.", "마음을 알아서 읽어주길 기다리기보다 좋았던 것을 먼저 말해주는 사람, 표현을 반기는 분위기가 화의 상징에 어울려요."],
  EARTH: ["토", "흥미로운 일을 만나도 다음 날 생활에 어떻게 남길지 봅니다. 흩어진 약속을 꾸준히 이어갈 수 있게 정돈하는 힘이에요.", "새 일을 더 보태는 사람보다 약속한 순서를 지키는 사람, 끝나는 시간과 반복할 범위가 보이는 환경이 토의 상징에 어울려요. 시작한 것을 내려놓을 자리가 있으면 매번 처음부터 힘낼 필요가 줄어듭니다."],
  METAL: ["금", "필요한 것과 아닌 것을 나눌 기준이 또렷해요. 어긋난 조건을 보고 정리하는 힘은 좋지만 모든 대화를 판정할 필요는 없죠.", "싫은 일을 억지로 늘리기보다 어디까지 할지 말해주는 동료, 선택 기준이 명확한 환경이 금의 상징에 어울려요."],
  WATER: ["수", "바로 답하기보다 보고 들은 것을 안에 오래 두는 쪽이에요. 생각이 깊어지는 시간과 같은 질문을 맴도는 시간은 구분할 필요가 있죠.", "빨리 결론을 재촉하지 않고 끝까지 듣는 사람, 잠깐 조용히 생각을 정리할 수 있는 환경이 수의 상징에 어울려요."],
} as const;

export function comprehensiveElements(plan: ComprehensivePlan): NarrativeBlock[] {
  return plan.pool.elements.filter(e => e.state !== "balanced").map(e => {
    const [name, high, low] = ELEMENT_LIFE[e.element];
    return paragraph(`element-${e.element}`, e.state === "high" ? `${name}의 비중이 강하게 나타납니다. ${high}` :
      `${name}의 비중은 약한 쪽입니다. ${low}`,
      { features: [e.material.feature], seedIds: [], fusionIds: [], sourceRefs: [...e.sourceRefs, "comprehensive:element-symbolism-not-ten-god"] }, "observation", `symbolic-${e.element}`);
  });
}

export function comprehensiveGoodPair(plan: ComprehensivePlan): NarrativeBlock[] {
  if (!plan.publicGift.length) return [];
  const sources = proof(plan.publicGift, [], [], ["comprehensive:confirmed-help-charm-leadership"]);
  return [paragraph("fortune-public-combination", "사람복이 있습니다. 천을귀인은 막힐 때 물어보고 힘을 나눌 인연, 도화는 처음 눈에 들어오는 매력, 장성은 앞에서 방향을 잡는 존재감으로 읽어요. 서로 같은 뜻은 아닙니다. 관심을 받는 데서 끝나지 않고 사람들과 무언가를 이끌 때, 이 세 가지 좋은 패가 함께 쓰입니다.", sources, "positive"),
    paragraph("fortune-public-scene", "모임에서 첫 인사를 편하게 열고, 이야기가 흩어질 때 다음 순서를 잡는 모습을 떠올려보세요. 처음에는 분위기 때문에 기억됐다가 다음에는 맡겨볼 사람으로 떠오르는 식이에요. 누군가의 소개가 문을 열어주고 그 안에서 내가 한 역할이 다음 자리를 만듭니다. 사람 사이에서 존재감이 커질수록 기회도 넓혀볼 만한 조합이죠.", sources, "positive", "attention-becomes-role")];
}

/** End with actual choices, not another list of feature definitions. */
export function comprehensiveManual(plan: ComprehensivePlan, input: NarrativeInput, master: BoundMaterial, signature: Signature): NarrativeBlock[] {
  const blocks: NarrativeBlock[] = [];
  const add = (id: string, text: string, roots: readonly BoundMaterial[]) => blocks.push(paragraph(id, text, proof(roots, [], [], ["comprehensive:operating-manual"]), "direction"));
  if (plan.core) add("manual-expression", "분위기를 살리는 능력을 단순한 친절로 넘기지 않기. 의견을 꺼내고 흐름을 바꿨다면 내가 맡은 역할도 이름 붙여 남겨요. 남이 편해진 것만 확인하지 말고 내가 무엇을 해냈는지도 기억할 일입니다.", plan.pool.materials.filter(m => plan.core!.proof.features.includes(m.feature)));
  else {
    blocks.push(paragraph("manual-owned-strength", signature.direction || MASTER_DIRECTIONS[master.feature][3],
      proof([master], [], signature.fusions, ["comprehensive:operating-manual"]), "direction"));
  }
  if (plan.wealth) add("manual-money-boundary", `${materialLabel(plan.wealth)}의 현실감각을 내 시간에도 쓰기. ${input.context.jobStatus === "freelancer" ? `${materialLabel(plan.wealth)}의 눈으로 보면 같은 의뢰비라도 준비와 수정 시간이 늘 때 남는 몫이 달라져요. 내 일을 오래 하기 위해 범위와 값을 함께 약속하는 겁니다.` : `${materialLabel(plan.wealth)}에서 보는 실속은 들어온 돈뿐 아니라 그만큼 쓴 시간에도 있어요. 남긴 결과와 내 하루를 나란히 볼수록 만족하는 선택의 기준이 더 정확해져요.`}`, [plan.wealth]);
  const sharp = plan.pool.materials.find(m => m.feature === "sinsal_hyeonchim");
  if (sharp) add("manual-precise-words", "발견한 사실과 사람에 대한 평가를 나눠 말하기. 틀린 곳을 봤다는 이유로 상대 전체가 틀린 사람은 아니죠. 고칠 한 군데를 짚어주면 예리함이 공격보다 쓸모로 기억됩니다.", [sharp]);
  else {
    const responsibility = plan.pool.materials.find(m => m.feature === "ten_god_qi_sha");
    const output = plan.pool.materials.find(m => m.feature === "ten_god_shi_shen");
    if (responsibility) add("manual-chosen-responsibility", "급하다는 이유만으로 전부 내 일로 받지 않기. 편관의 판단력은 버티는 양보다 어려운 순간에 무엇을 고르는지에서 잘 드러나요. 내가 정할 수 있는 몫부터 맡으면 긴장도 쓸 방향을 찾습니다.", [responsibility]);
    else if (output) add("manual-finished-expression", "새 생각을 다음 생각으로만 넘기지 않기. 식신의 만드는 힘은 손에 잡힐 작은 완성품을 남길 때 자신감이 돼요. 완벽해질 때까지 숨기기보다 지금 해낸 데까지 보여줄 기회를 고르는 겁니다.", [output]);
    else add("manual-own-choice", `${materialLabel(master)}의 반응을 남의 정답보다 먼저 확인하기. ${master.material.seeds.find(s => s.role === "question")?.text ?? `${materialLabel(master)}의 힘이 편하게 나왔던 날을 떠올려보세요.`}`, [master]);
  }
  const inward = plan.inward ?? master;
  const quietRule: Record<string, string> = {
    ten_god_pian_yin: "궁금한 것과 지금 결정할 것을 구분하기. 답을 더 찾고 싶다면 오늘 알아낸 데까지만 적어두고 다음 질문은 내일로 넘겨도 돼요. 편인의 탐구심에 끝나는 지점을 주면 깊이와 일상을 함께 지킬 수 있죠.",
    twelve_sinsal_hwagae: "혼자 몰입한 시간을 남에게 설명할 의무로 만들지 않기. 화개의 취향이 깊어지는 동안 알림을 잠시 내려놓아도 괜찮아요. 무엇을 좋아하는지 선명해진 다음에 다시 나누면 대화할 거리도 달라집니다.",
    sinsal_gwimun: "찜찜한 느낌과 확인한 사실을 나눠 적기. 귀문의 집요함은 작은 차이를 찾아내지만 아직 못 들은 사정까지 결론낼 필요는 없어요. 한 번 확인할 질문을 정하면 머릿속 재생을 실제 대화로 바꿀 수 있죠.",
  };
  add("manual-own-pace", plan.inward ? quietRule[inward.feature] :
    `${particle(materialLabel(master), "의", "의")} 장점을 남의 속도와 겨루는 데만 쓰지 않기. ${master.material.seeds.find(s => s.role === "ending")!.text}`, [inward]);
  return blocks.slice(0, 5);
}

export function comprehensiveRhythmTension(input: NarrativeInput, plan: ComprehensivePlan) {
  return rhythmReading(input, plan.pool, "comprehensive");
}
