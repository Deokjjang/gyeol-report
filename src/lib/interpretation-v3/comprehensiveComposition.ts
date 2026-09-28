import { ATOMIC_BY_ID, ATOMIC_REGISTRY } from "./atomicRegistry";
import { claimStrength, rankEvidence, validateV3Copy } from "./engine";
import { COMPREHENSIVE_ATOMIC_COPY, OPENING_CONTEXT } from "./comprehensiveCopy";
import { comprehensiveContextDirections, RELATIONSHIP_DIRECTIONS } from "./comprehensiveContext";
import { BALANCE_IDEAS, COMPREHENSIVE_FUSIONS, DAY_GUIDANCE, SIGNAL_STORIES, signalImage, taxonomyById } from "./comprehensiveEditorial";
import type { ComprehensiveV3Block, ComprehensiveV3Draft, ComprehensiveV3Input, ComprehensiveV3Section } from "./comprehensive";
import type { Domain, Evidence } from "./types";

export const ENRICHED_COMPREHENSIVE_VERSION = "comprehensive_v3.1-enriched.1" as const;
const unique = <T,>(xs: readonly T[]) => [...new Set(xs)];
const safe = (s: string) => !!s && !validateV3Copy(s).length && !/수 있|가능성|예언|보장|참고|단정/u.test(s);
const displayLabel = (f: Evidence) => f.kind === "spouse_palace" ? "일지 · 배우자궁" : f.kind === "mbti" ? f.featureId.split(":")[1] : ATOMIC_BY_ID.get(f.featureId)?.name ??
  (f.value && typeof f.value === "object" && "label" in f.value ? String(f.value.label) : "원국 관계");
function make(id: string, kind: ComprehensiveV3Block["kind"], headline: string, paragraphs: readonly string[], action: string, facts: readonly Evidence[], domains: readonly Domain[], format: NonNullable<ComprehensiveV3Block["format"]> = "prose"): ComprehensiveV3Block {
  return { id, kind, headline, reading: "", why: "", caution: "", action, paragraphs, format, domains,
    evidenceRefs: unique(facts.map(f => f.id)), sourceRefs: unique(facts.flatMap(f => [...f.sourceRefs, ...(ATOMIC_BY_ID.get(f.featureId)?.sourceRefs ?? [])])), labels: unique(facts.map(displayLabel)) };
}

export function composeComprehensiveV31(input: ComprehensiveV3Input, candidates: readonly ComprehensiveV3Block[]): ComprehensiveV3Draft {
  const { facts, context } = input;
  const ranked = rankEvidence(facts, "saju_mbti_full");
  const eligible = facts.filter(f => f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length);
  const forIds = (...ids: string[]) => eligible.filter(f => ids.includes(f.featureId));
  const support = (b: ComprehensiveV3Block) => facts.filter(f => b.evidenceRefs.includes(f.id));
  const has = (id: string) => forIds(id).length > 0;
  const used = new Set<string>();
  const rich = (b: ComprehensiveV3Block, format: NonNullable<ComprehensiveV3Block["format"]> = "prose"): ComprehensiveV3Block => {
    const atom = support(b).find(f => ATOMIC_BY_ID.has(f.featureId));
    const story = atom && SIGNAL_STORIES[atom.featureId];
    const dayCopy = atom && DAY_GUIDANCE[atom.featureId];
    const paragraphs = b.kind === "atomic" ? [story ? `${displayLabel(atom!)}은 ${story[0]}입니다. ${story[1]}을 이미 가진 자원으로 읽습니다.` : atom?.kind === "day_pillar" ? `${ATOMIC_BY_ID.get(atom.featureId)?.coreMeaning}입니다. ${signalImage(atom.featureId)}` : b.why].filter(Boolean)
      : b.kind === "fusion" ? [b.reading.replace(/장면이 익숙한가요\?$/, "장면입니다.")].filter(Boolean) : [b.why].filter(Boolean);
    return { ...b, format, paragraphs: b.kind === "atomic" && dayCopy ? [dayCopy[0]] : paragraphs, reading: "", why: "", headline: b.kind === "atomic" && atom ? displayLabel(atom) : b.headline,
      action: b.kind === "atomic" && dayCopy ? dayCopy[1] : b.kind === "atomic" && story ? story[2] : b.action };
  };
  const take = (predicate: (b: ComprehensiveV3Block) => boolean, limit: number, format: NonNullable<ComprehensiveV3Block["format"]> = "prose") => candidates
    .filter(b => !used.has(b.id) && support(b).every(f => f.certainty === "confirmed") && predicate(b)).slice(0, limit).map(b => { used.add(b.id); return rich(b, format); });
  const sections: ComprehensiveV3Section[] = [];
  const add = (id: string, title: string, blocks: readonly ComprehensiveV3Block[]) => { if (blocks.length) sections.push({ id, title, blocks }); };

  // Opening is a portrait, not a concatenation of the body block template.
  const lead = candidates.find(b => b.id === "official-leadership-entj") ?? candidates.find(b => b.kind === "compound" && b.domains.includes("identity")) ?? candidates[0];
  const day = ranked.find(f => f.kind === "day_pillar");
  const giftFacts = ranked.filter(f => SIGNAL_STORIES[f.featureId] && (f.kind === "gwiin" || taxonomyById.get(f.featureId)?.polarity === "positive" || ["twelve_sinsal_jangseong", "twelve_sinsal_hwagae"].includes(f.featureId)));
  const gift = giftFacts.find(f => f.kind === "gwiin") ?? giftFacts[0] ?? ranked.find(f => f.kind === "shinsal" && SIGNAL_STORIES[f.featureId]);
  const depth = candidates.find(b => b.id === "deep-perspective");
  const portrait = lead?.id === "official-leadership-entj"
    ? `${input.name}님은 일이 흐릿한 채로 굴러가는 것을 오래 두고 보지 않는 사람입니다. 누가 무엇을 맡을지, 어떤 기준으로 끝낼지 정리하고 직접 책임지는 자리에서 본래 힘이 드러납니다. 정관과 장성이 세운 기준에 ENTJ의 실행 방식이 겹쳐, 의견을 내는 데서 멈추지 않고 실제로 판을 움직이려 합니다.`
    : lead?.id === "deep-perspective"
      ? `${input.name}님은 남이 준 답을 빨리 받아들이기보다, 혼자 깊이 파고들어 자기 관점을 만드는 사람입니다. 화개의 몰입과 편인의 독자적인 시선이 겹쳐 쉽게 지나친 문제에서도 오래 붙잡을 이유를 찾습니다. 생각의 깊이를 지키되 밖으로 꺼내는 출구도 함께 가져가야 합니다.`
      : `${input.name}님을 읽는 출발점은 ‘${lead?.labels.join(" · ") ?? "자기 기준"}’입니다. ${lead?.headline ?? "지금 가진 힘을 구체적인 선택으로 옮기는 것이 중요합니다."} ${lead?.action ?? "맡을 일의 범위를 먼저 정하세요."}`;
  const opening: ComprehensiveV3Block[] = [{ ...make("portrait", lead?.kind ?? "atomic", "", [portrait], "", lead ? support(lead) : [], ["identity"]), ...(lead?.kind === "compound" ? { compoundId: lead.id } : {}) }];
  if (day) {
    const image = signalImage(day.featureId);
    const tension = depth && lead?.id !== depth.id ? "밖에서 방향을 이끄는 모습과 혼자 생각을 숙성시키는 모습이 함께 있습니다. 앞에 나서는 날에도 자기 생각을 정리할 조용한 자리는 필요합니다." : "이 이미지에서 중요한 것은 겉으로 드러나는 모습과 안에 품은 힘을 함께 보는 일입니다. 한 가지 성격 이름으로 자신을 좁히지 마세요.";
    opening.push(make("portrait-image", "atomic", "", [`${image} ${tension}`], "", [day, ...(depth && lead?.id !== depth.id ? support(depth) : [])], ["identity"]));
  }
  if (gift) opening.push(make("portrait-gift", "atomic", "", [`좋은 패도 분명합니다. ${displayLabel(gift)}은 ${SIGNAL_STORIES[gift.featureId][0]}입니다. ${SIGNAL_STORIES[gift.featureId][1]}을 앞으로 얻어야 할 보상이 아니라 이미 활용할 자원으로 보세요. 힘든 일을 더 견디는 데만 쓰지 말고, 내 힘을 덜 소모하면서도 결과를 남기는 선택에 쓰세요.`], "", [gift], ["identity"]));
  opening.push(make("portrait-context", "context", "", [OPENING_CONTEXT[context.lifeStatus] ?? OPENING_CONTEXT.other], "", lead ? support(lead) : [], ["career"]));

  // Full source registry remains eligible. Rich source-backed entries are
  // selected by the same significance order, with unique feature identities.
  add("strength", "내가 가진 가장 강한 힘", [
    ...take(b => b.evidenceRefs.some(id => facts.some(f => f.id === id && f.kind === "day_pillar")), 1),
    ...take(b => b.kind === "compound" && b.domains.includes("identity") && b.id !== "deep-perspective" && b.id !== "pair:jie_cai+shi_shen", 1),
  ]);
  const selectedGiftIds = unique(giftFacts.map(f => f.featureId)).slice(0, 5);
  const gifts = selectedGiftIds.map(id => {
    used.add(`atomic:${id}`);
    const story = SIGNAL_STORIES[id], fs = forIds(id);
    return { ...make(`gift:${id}`, "atomic", displayLabel(fs[0]), [`${story[0]}입니다. ${story[1]}이 이 이름의 좋은 쓰임입니다.`, ...(COMPREHENSIVE_ATOMIC_COPY[id] ? [COMPREHENSIVE_ATOMIC_COPY[id][0]] : [])], story[2], fs, fs[0].domains, "gift"), positiveFeatureIds: [id] };
  });
  // A chart with few named auspicious markers can still have confirmed ten-god
  // strengths. Describe those by their own names, never fabricate a nobleman.
  if (gifts.length < 3) gifts.push(...take(b => b.kind === "atomic" && b.evidenceRefs.some(id => facts.some(f => f.id === id && f.kind === "ten_god" && !!COMPREHENSIVE_ATOMIC_COPY[f.featureId])), 3 - gifts.length, "gift").map(b => ({ ...b, positiveFeatureIds: support(b).filter(f => f.kind === "ten_god").map(f => f.featureId) })));
  add("gifts", "내가 가진 좋은 패", gifts);

  const extraFusions = COMPREHENSIVE_FUSIONS.flatMap(row => {
    const compound = candidates.find(b => b.id === row.compound);
    const trait = forIds(row.trait)[0];
    if (!compound || !trait || support(compound).some(f => f.certainty !== "confirmed")) return [];
    used.add(compound.id);
    return [{ ...make(`composition:${row.id}`, "fusion", row.title, row.paragraphs, row.action, [...support(compound), trait], [row.domain], row.domain === "career" ? "strategy" : row.domain === "relationship" ? "relationship" : "prose"),
      compoundId: compound.id, sourceRefs: unique([...compound.sourceRefs, ...trait.sourceRefs, `comprehensiveEditorial:${row.id}`]) }];
  });
  add("choices", "생각하고 선택하는 방식", [...extraFusions.filter(b => b.domains.includes("identity")),
    ...take(b => b.kind === "fusion" && b.domains.includes("identity"), 1), ...take(b => b.kind === "compound" && b.domains.includes("identity"), extraFusions.some(b => b.domains.includes("identity")) ? 0 : 1)]);
  const contextDirections = comprehensiveContextDirections(context, true);
  const contextBlock = (domain: Domain, action: string, basis: readonly ComprehensiveV3Block[]) => make(`context:${domain}`, "context", "지금의 선택 기준", [], action, facts.filter(f => basis.some(b => b.evidenceRefs.includes(f.id))), [domain], "strategy");
  const career = [...take(b => b.id === "official-leadership-entj" || b.id === "leadership-pressure", 2, "strategy"), ...extraFusions.filter(b => b.domains.includes("career"))];
  if (!career.length) career.push(...take(b => b.kind === "compound" && b.domains.includes("career"), 2, "strategy"));
  add("career", "일의 결", [...career, ...(career.length ? [contextBlock("career", contextDirections[0], career)] : [])]);

  const money = [...take(b => b.id === "pair:pian_cai+zheng_cai", 1, "strategy"), ...take(b => b.id === "mobile-opportunity", 1, "strategy"),
    ...take(b => b.kind === "compound" && b.domains.includes("money") && !b.id.includes("+qi_sha") && !b.id.includes("+zheng_guan"), 2, "strategy")];
  if (!money.length) money.push(...take(b => b.kind === "atomic" && b.domains.includes("money"), 2, "strategy"));
  if (money.length) {
    const moneyParagraphs = money.map(b => {
      if (b.id === "pair:pian_cai+zheng_cai") return "돈에서는 기회를 만드는 감각과 지키는 감각을 함께 쓰는 것이 핵심입니다. 편재가 바깥의 사람과 제안에서 흐름을 발견한다면, 정재는 그 흐름을 반복 가능한 관리로 붙잡습니다. 새 기회에 쓸 자원과 생활·운영을 유지할 자원을 처음부터 나누세요. 넓게 보는 눈을 버리지 않으면서도 한 제안에 기반 전체를 걸지 않는 방식입니다.";
      if (b.id === "mobile-opportunity") return "편재에 역마가 겹치므로 자리에 앉아 들어오는 소식만 기다리기보다 바깥의 접점을 살리는 쪽입니다. 새 사람이나 외부 프로젝트에서 얻은 정보를 실제 제안으로 연결해 보세요. 다만 만남이 끝나면 후속 연락과 확인할 조건까지 남겨야 움직임이 흩어지지 않습니다.";
      if (b.id === "pair:shi_shen+pian_cai" || b.id === "pair:shang_guan+pian_cai") return `${b.labels[0]}과 편재의 조합은 만든 결과를 바깥의 필요와 연결하는 데 쓸 자원입니다. 결과물을 잘 만들었다는 평가에서 멈추지 말고 누가 어떤 문제 때문에 그것을 필요로 하는지 확인하세요. 시간·범위·교환 조건을 함께 정해야 실력이 자원 흐름으로 이어집니다.`;
      if (b.id === "pair:jie_cai+pian_cai" || b.id === "pair:jie_cai+zheng_cai") return "겁재와 재성의 조합에서는 경쟁과 공동 자원의 경계를 특히 분명히 하세요. 같이 시작한다는 이유로 비용과 기여를 나중에 정하면 관계의 긴장이 자원 문제로 번집니다. 내 판단으로 쓸 몫과 함께 합의할 몫, 중단할 조건을 시작 전에 나누세요.";
      return [...(b.paragraphs ?? []), b.action].filter(Boolean).join(" ");
    });
    const moneyStory = { ...make("money:strategy", "compound", "기회를 만들고, 조건을 정하고, 남기는 순서", moneyParagraphs, "", money.flatMap(support), ["money"], "strategy"),
      compoundIds: money.filter(b => b.kind === "compound").map(b => b.id) };
    const route = context.lifeStatus === "employee" ? "성과를 보상으로 연결하고, 늘어난 자원을 남기는 순서가 중요합니다. 일을 많이 했다는 기록에서 멈추지 말고 무엇이 개선됐는지를 남기고, 그 결과로 보상과 역할을 논의하세요. 일시적인 보상과 계속 쓸 생활 자원도 나눠 두세요."
      : context.lifeStatus === "business_owner" ? "사업에서는 매출이 생기는 순간과 내 자원이 남는 순간이 다릅니다. 제안은 계약 조건으로, 계약은 정산으로, 좋은 납품 경험은 재주문 가능한 운영으로 이어가세요. 반복되는 수익과 계속 쓸 작업 자산을 남기는 것이 확장의 다음 단계입니다."
        : context.lifeStatus === "freelancer" ? "좋은 의뢰를 얻는 일과 일한 대가를 제때 남기는 일은 별개입니다. 제안·견적·납품·정산을 한 흐름으로 묶고, 다음 작업에도 쓰일 자료와 고객 관계를 남기세요. 매번 처음부터 다시 시작하는 일을 줄이는 것이 축적의 시작입니다."
          : "돈의 방향은 당장 큰 결과를 만드는 것보다 들어오고 나가는 자원을 알고 선택권을 남기는 데 있습니다. 새로운 경험에 쓸 몫과 생활을 유지할 몫을 구분하세요. 한 번의 선택이 다음 선택의 여유까지 가져가지 않게 하는 것이 기준입니다.";
    add("money", "돈의 결", [moneyStory, { ...contextBlock("money", contextDirections[1], money), paragraphs: [route] }]);
  }

  const people: ComprehensiveV3Block[] = extraFusions.filter(b => b.domains.includes("relationship"));
  const solitude = forIds("twelve_sinsal_hwagae", "shinsal:GOSINSAL", "shinsal:GWASUKSAL");
  if (solitude.length) people.push(make("people:private-space", "atomic", "연결과 친밀함은 같은 속도로 넓어지지 않습니다", [
    `${unique(solitude.map(displayLabel)).join(" · ")}은 관계에서 혼자 정리할 영역과 내면의 거리를 함께 살피게 하는 근거입니다. 사람을 만나고 역할을 해내는 일과 마음을 깊이 여는 일은 구분해서 보세요.`,
    "혼자 있고 싶은 순간을 관계를 끊으라는 뜻으로 받지 마세요. 가까운 사람에게 필요한 여유를 미리 알리면, 말없이 멀어지는 방식 대신 연결을 지키면서 자기 시간을 갖는 방식이 됩니다."],
  "연락을 쉬고 싶은 날에는 다시 이야기할 때를 함께 알려 주세요. 깊은 이야기를 나눌 사람과 가볍게 활동할 사람에게 같은 친밀함을 요구하지 마세요.", solitude, ["relationship"], "relationship"));
  people.push(...take(b => b.kind === "atomic" && b.evidenceRefs.some(id => facts.some(f => f.id === id && ["sinsal_dohwa", "sinsal_hongyeom", "twelve_sinsal_yeokma", "twelve_sinsal_mangsin", "sinsal_hyeonchim"].includes(f.featureId))), 2, "relationship"));
  const supportGift = giftFacts.find(f => ["gwiin_cheoneul", "gwiin_cheondeok", "gwiin_woldeok"].includes(f.featureId));
  if (supportGift) people.push(make("people:help-boundary", "atomic", "도움을 주고받는 관계에도 각자의 몫을 남기세요", ["도움을 잇는 좋은 힘은 한 사람이 모두 해결하는 관계와 다릅니다. 내가 대신 결론을 내리는 것보다 상대가 결정할 정보를 건네고 필요한 통로를 연결하는 편이 오래 갑니다."], "부탁을 받으면 들어줄 시간, 연결해 줄 사람, 직접 맡을 일을 구분해서 답하세요. 호의의 크기보다 서로 감당할 약속이 분명한지를 보세요.", [supportGift], ["relationship"], "relationship"));
  if (!people.length) people.push(...take(b => b.domains.includes("relationship"), 2, "relationship"));
  add("people", "사람 관계의 결", people);

  const love = take(b => b.kind === "fusion" && (b.domains.includes("love") || b.domains.includes("relationship")), 2, "relationship");
  const loveGods = forIds("ten_god_zheng_guan", "ten_god_qi_sha", "ten_god_zheng_cai", "ten_god_pian_cai", "ten_god_shi_shen", "ten_god_shang_guan");
  const spouse = forIds("spouse_palace:day_branch")[0];
  if (spouse && loveGods.length) love.push(make("love:daily-agreements", "compound", "사랑은 큰 표현 뒤의 생활에서 확인하세요", [
    `일지는 배우자궁으로 함께 살펴보는 자리이며, 이 원국의 일지 글자는 ${String(spouse.value)}입니다. 이 글자 하나로 상대의 성격을 정하지 않고, 함께 확인된 ${unique(loveGods.map(displayLabel)).slice(0, 4).join(" · ")}의 책임·자원·표현 방식을 관계의 선택 기준으로 읽습니다.`,
    has("ten_god_zheng_cai") && has("ten_god_pian_cai") ? "새로운 경험을 함께하고 싶은 마음과 생활을 안정적으로 유지하려는 마음을 둘 다 살려야 합니다. 분위기가 좋은 날의 약속이 평소 시간과 비용 안에서도 지켜지는지 확인하세요. 특별한 이벤트와 반복되는 배려를 서로 대신하게 두지 마세요." : "관계에서 책임을 다하는 일과 마음을 표현하는 일을 같은 것으로 취급하지 마세요. 일을 대신 처리해 준 뒤에도 상대가 어떤 기분이었는지 듣는 시간이 필요합니다. 서로 편한 표현 방식과 반복해서 지킬 약속을 나눠 알아가세요."],
    "연락·함께 쓰는 시간·비용처럼 반복되는 생활 항목을 하나씩 맞춰 보세요. 좋은 관계의 기준은 한 사람이 얼마나 많이 맡는지가 아니라 둘이 동의한 방식이 계속 지켜지는지입니다.", [spouse, ...loveGods], ["love"], "relationship"));
  const attraction = forIds("sinsal_dohwa", "sinsal_hongyeom");
  if (attraction.length) love.push(make("love:attraction-boundaries", attraction.length > 1 ? "compound" : "atomic", "호감이 생기는 힘과 관계를 고르는 기준을 함께 가지세요", [
    attraction.length > 1 ? "도화는 시선을 모으는 표현으로, 홍염은 가까운 상대에게 감정을 전하는 온도로 읽습니다. 두 힘이 함께 있으니 많은 반응을 얻는 일과 한 사람에게 깊은 인상을 남기는 일을 구분해 쓰세요." : `${displayLabel(attraction[0])}은 ${SIGNAL_STORIES[attraction[0].featureId][1]}입니다. 먼저 생기는 관심을 바로 관계의 약속으로 바꾸지 말고, 상대가 꾸준히 보여 주는 행동도 보세요.`,
    "다정한 표현을 줄일 필요는 없습니다. 다만 어떤 관계를 원하고 어디까지 약속하는지는 따로 말해야 합니다. 좋은 분위기 속에서도 자신의 속도와 불편한 선을 숨기지 마세요."],
    "호감을 전한 뒤에는 둘이 기대하는 만남의 빈도와 관계의 방향을 확인하세요. 관심을 유지하려고 원하지 않는 약속까지 받아들이지 마세요.", attraction, ["love"], "relationship"));
  if (love.length) add("love", "사랑의 결", [...love, contextBlock("love", RELATIONSHIP_DIRECTIONS[input.relationshipStatus] ?? RELATIONSHIP_DIRECTIONS.unknown, love)]);

  const study = [...extraFusions.filter(b => b.domains.includes("study")), ...take(b => b.kind === "fusion" && b.domains.includes("study"), 1), ...take(b => b.kind === "compound" && b.domains.includes("study"), 1)];
  if (study.length) add("study", "배우고 성장하는 방식", [...study, contextBlock("study", contextDirections[2], study)]);
  const lifestyle = eligible.flatMap(f => {
    if (f.kind !== "element" || f.scope !== "natal" || !f.value || typeof f.value !== "object") return [];
    const v = f.value as { element?: keyof typeof BALANCE_IDEAS; condition?: string; method?: string; version?: string; weighted?: Record<string, number> };
    if (v.method !== "canonical-weighted" || !v.version || !v.element || !Object.hasOwn(BALANCE_IDEAS, v.element) || !["weak", "missing", "excess"].includes(v.condition ?? "")) return [];
    const label = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" }[v.element], high = v.condition === "excess";
    return [{ ...make(`balance:${v.element}`, "lifestyle", `${label} · ${high ? "강한 힘의 속도를 조절하기" : "약한 쪽을 생활에 보태기"}`, [
      `지장간을 포함한 가중 분포에서 ${label}${["화", "토", "수"].includes(label) ? "는" : "은"} ${Number(v.weighted?.[v.element.toUpperCase()] ?? 0).toFixed(1)}이며, 기존 계산의 ${high ? "강함" : v.condition === "missing" ? "없음" : "약함"} 판정에 해당합니다. ${high ? "더 채우기보다 이미 강한 성질을 언제 멈추고 풀어줄지 정하는 쪽입니다." : "약한 쪽의 성질을 작은 생활 습관으로 가져오는 방향입니다."}`,
    ], "", [f], ["lifestyle"], "balance"), labels: [`${label} · 지장간 포함 가중 분포`], ideas: BALANCE_IDEAS[v.element][high ? "high" : "low"] }];
  });
  add("balance", "오행 균형을 생활에 쓰는 법", lifestyle.sort((a, b) => ["wood", "fire", "earth", "metal", "water"].indexOf(a.id.split(":")[1]) - ["wood", "fire", "earth", "metal", "water"].indexOf(b.id.split(":")[1])));

  // Combine risks by meaning. Three strong patterns are sufficient.
  const riskGroups = [
    { ids: ["ten_god_zheng_guan", "ten_god_qi_sha", "twelve_sinsal_jangseong", "sinsal_baekho"], strength: "필요한 순간 책임지고 대응하는 힘", risk: "일이 끝나도 지휘 자리에서 내려오지 못할 때", why: "책임과 긴급 대응의 근거가 같은 쪽으로 모이면, 맡을 사람을 찾기 전에 직접 처리하는 방식이 굳어집니다.", repair: "반복해서 개입한 일 하나에 종료 조건과 다음 담당자를 적으세요. 일을 끝내는 능력에 일을 넘기는 능력을 더하세요." },
    { ids: ["ten_god_pian_cai", "ten_god_jie_cai", "twelve_sinsal_yeokma"], strength: "기회와 경쟁을 움직임으로 바꾸는 힘", risk: "움직이는 속도가 남기는 속도를 앞설 때", why: "밖의 기회나 경쟁에 반응하는 힘이 강하게 쓰이면, 이미 시작한 일보다 다음 일이 더 매력적으로 보입니다.", repair: "새 약속 전에는 아직 남은 마무리를 확인하세요. 하나를 더 받으려면 무엇을 끝내거나 줄일지 먼저 정하세요." },
    { ids: ["ten_god_pian_yin", "twelve_sinsal_hwagae", "shinsal:GOSINSAL", "sinsal_cheonmunseong"], strength: "혼자 연결을 찾고 깊이를 만드는 힘", risk: "생각은 깊어지는데 밖에 꺼내는 시점이 늦어질 때", why: "내면의 이해가 중요한 만큼 설명하기 전까지 혼자 정리하려는 쪽으로 기웁니다. 다른 사람은 완성된 생각보다 과정 중의 신호가 필요합니다.", repair: "완성도를 묻기 전에 중간 생각을 한 사람에게 전하세요. 도움이 필요한 지점을 함께 말하면 혼자 숙성하는 시간에도 연결이 남습니다." },
    { ids: ["ten_god_shang_guan", "sinsal_hyeonchim", "sinsal_yangin"], strength: "문제를 발견하고 분명하게 선을 긋는 힘", risk: "정확한 판단을 상대에 대한 평가로 바꿀 때", why: "날카로운 관찰은 일의 오류를 찾는 데 유용하지만, 말이 짧아지면 상대는 수정 요청보다 거절을 먼저 듣습니다.", repair: "지적할 대상은 사람의 성격이 아니라 관찰한 행동으로 좁히세요. 바꿔 달라는 한 가지와 상대가 답할 시간을 남기세요." },
    { ids: ["ten_god_zheng_cai", "ten_god_zheng_yin", "gwiin_jaego"], strength: "기반을 지키고 준비를 쌓는 힘", risk: "안전한 준비가 작은 시도까지 막을 때", why: "유지할 기반을 소중히 보는 힘은 새 선택 앞에서 확인할 조건을 계속 늘리는 방식으로도 쓰입니다.", repair: "지켜야 할 자원 밖에 작은 시험 범위를 따로 만드세요. 그 안에서는 완벽한 준비보다 직접 확인한 경험을 남기세요." },
  ];
  const patterns = riskGroups.map(row => ({ ...row, fs: forIds(...row.ids) })).filter(row => row.fs.length >= 2).slice(0, 4).map(row => ({
    strength: row.strength, risk: row.risk, why: row.why, repair: row.repair, labels: unique(row.fs.map(displayLabel)), evidenceRefs: row.fs.map(f => f.id),
  }));
  // Some charts have fewer overlapping risk groups. A distinct, confirmed
  // atomic overuse pattern is preferable to inventing another compound.
  for (const f of ranked) {
    if (patterns.length >= 3) break;
    const copy = COMPREHENSIVE_ATOMIC_COPY[f.featureId];
    if (!copy || f.certainty !== "confirmed" || patterns.some(p => p.evidenceRefs.some(id => facts.find(e => e.id === id)?.featureId === f.featureId))) continue;
    patterns.push({ strength: ATOMIC_BY_ID.get(f.featureId)?.strength[0] ?? displayLabel(f), risk: copy[1], why: copy[0], repair: copy[2], labels: [displayLabel(f)], evidenceRefs: [f.id] });
  }
  const sectionBlocks = sections.flatMap(s => s.blocks);
  const finalSources = unique([...(lead?.evidenceRefs ?? []), ...selectedGiftIds.flatMap(id => forIds(id).map(f => f.id)), ...patterns.flatMap(p => p.evidenceRefs)]);
  const finalMain = has("twelve_sinsal_jangseong") && has("ten_god_zheng_guan")
    ? "앞으로 키울 것은 더 많은 일을 혼자 끝내는 능력이 아니라, 자신의 기준이 다른 사람의 일도 편하게 만드는 힘입니다. 책임을 지되 모든 결정을 소유하지 마세요. 자신이 잠시 빠져도 이어지는 방식이 남을 때 리더십의 크기가 달라집니다."
    : has("twelve_sinsal_hwagae") && has("ten_god_pian_yin")
      ? "앞으로 키울 것은 누구보다 오래 생각하는 시간이 아니라, 깊이 생각한 것을 남도 써볼 수 있게 꺼내는 힘입니다. 자기 방식의 뿌리는 지키고 전달 통로는 넓히세요. 이해받을 때까지 기다리기보다 이해할 단서를 먼저 건네세요."
      : `앞으로는 ‘${lead?.labels.filter(l => !/^[A-Z]{4}$/.test(l)).join(" · ") ?? "자기 기준"}’의 힘을 이름표가 아닌 선택 기준으로 쓰세요. 잘한다는 평가를 모두 받아내기보다 그 힘을 제대로 쓸 일을 고르세요. 강점은 맡은 일의 개수가 아니라 남긴 결과와 생활의 여유를 함께 볼 때 오래 갑니다.`;
  const finalGift = gift ? `좋은 패인 ${displayLabel(gift)}을 큰 일이 생길 때까지 아껴 두지 마세요. ${gift.kind === "gwiin" && /cheoneul|cheondeok|woldeok/.test(gift.featureId) ? "지금의 고민을 함께 검토할 연결부터 쓰세요. 도움을 구하는 일은 주도권을 넘기는 일이 아니라 혼자 보지 못한 길을 확보하는 일입니다." : "작은 일에서도 이 힘이 쓰일 자리를 고르세요. 이미 잘하는 방식을 반복 가능한 경험으로 남기면 다음 선택을 위한 기반이 됩니다."}` : "지금까지 효과가 있었던 방식 하나를 다음 선택에도 쓸 기준으로 남기세요.";
  const finalPriority = has("ten_god_zheng_cai") && has("ten_god_pian_cai") ? "일에서는 기회를 펼치고, 돈에서는 남길 범위를 정하고, 사람에게는 선택할 공간을 남기세요. 세 영역을 모두 속도로 해결하려 하지 마세요. 새로운 것을 얻은 뒤 무엇이 쌓였는지, 관계에는 어떤 약속이 남았는지를 함께 확인하세요." : "일을 늘리는 날에는 생활에서 줄일 것도 정하세요. 사람과의 약속은 성과 뒤로 미루지 말고 일정 안에 놓으세요. 자신의 속도를 지키는 일과 가까운 사람의 속도를 듣는 일을 함께 해나가세요.";
  const firstStep: Record<string, string> = {
    employee: "이번 주에는 맡은 업무 하나를 골라 기대 결과·자신의 결정 범위·협의할 사람을 한 장에 적어 상사나 동료와 맞춰 보세요.",
    business_owner: "이번 주에는 반복되는 계약 하나를 골라 누가 결정하고 언제 정산하며 다음 거래에 무엇을 재사용할지 적어 보세요.",
    freelancer: "다음 의뢰 하나에서 작업 범위와 수정 종료 조건을 짧게 합의하고, 완료한 뒤 다시 쓸 자료를 따로 남겨 보세요.",
    student: "이번 과제 하나에서 스스로 판단할 부분을 정하고, 완성 뒤 다른 사례에도 적용할 방법을 남겨 보세요.",
    job_seeker: "관심 직무 하나의 요구를 골라 자신의 판단 과정이 드러나는 작은 결과물로 답해 보세요. 설명만 하던 강점을 직접 보여 줄 차례입니다.",
    resting: "이번 주에는 생활을 압박하지 않는 작은 활동을 한 번 해보고, 끝난 뒤에도 다시 하고 싶은 여유가 남는지 살펴보세요.",
  };
  const direction = [finalMain, finalGift, finalPriority, `${firstStep[context.lifeStatus] ?? "지금 맡은 일 하나에서 끝낼 기준과 멈출 기준을 나란히 정해 보세요."} ${has("twelve_sinsal_jangseong") ? "내가 다 해야 굴러가는 삶보다, 내가 세운 기준으로 함께 굴러가는 삶을 만드세요." : "나를 다른 사람으로 바꾸기보다, 가진 힘이 제자리에서 쓰이는 삶을 만드세요."}`].join("\n\n");
  const order = ["strength", "gifts", "choices", "career", "money", "people", "love", "study", "balance"];
  sections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  // Assign each long sentence one owner, without deleting distinct applications
  // of the same evidence. Do not dedupe merely by a shared feature ID.
  const seenSentences = new Set<string>();
  const fresh = (text: string) => text.split(/(?<=[.!?])\s+/u).filter(s => { const key = s.trim(); if (!key) return false; if (seenSentences.has(key)) return false; seenSentences.add(key); return true; }).join(" ");
  const clean = (b: ComprehensiveV3Block) => ({ ...b, paragraphs: b.paragraphs?.map(fresh).filter(Boolean), action: fresh(b.action) });
  const cleanOpening = opening.map(clean), cleanSections = sections.map(s => ({ ...s, blocks: s.blocks.map(clean) }));
  return { productType: "saju_mbti_full", productVersion: "v3", version: ENRICHED_COMPREHENSIVE_VERSION, personLabel: input.name,
    title: `${input.name}님의 결, 가진 힘으로 살아가는 법`, profileTable: input.profileTable, opening: cleanOpening, openingContext: "",
    sections: cleanSections, patterns: patterns.map(p => ({ ...p, why: fresh(p.why), repair: fresh(p.repair) })), direction, directionEvidenceRefs: finalSources.length ? finalSources : sectionBlocks.flatMap(b => b.evidenceRefs) };
}

export function comprehensiveSelectionTrace(facts: readonly Evidence[], draft: ComprehensiveV3Draft) {
  const all = [...draft.opening.map(b => ({ section: "core", b })), ...draft.sections.flatMap(s => s.blocks.map(b => ({ section: s.id, b })))];
  const rank = rankEvidence(facts, "saju_mbti_full");
  return ATOMIC_REGISTRY.map(material => {
    const observed = facts.filter(f => f.featureId === material.id);
    const places = unique(all.filter(({ b }) => b.evidenceRefs.some(id => observed.some(f => f.id === id))).map(x => x.section));
    const riskUsed = draft.patterns.some(p => p.evidenceRefs.some(id => observed.some(f => f.id === id)));
    if (riskUsed) places.push("patterns");
    const ready = !!SIGNAL_STORIES[material.id] || material.directives.some(safe);
    return { featureId: material.id, label: material.name, observed: observed.length > 0,
      rank: rank.some(f => f.featureId === material.id) ? rank.findIndex(f => f.featureId === material.id) + 1 : null,
      decision: !observed.length ? "not-in-chart" : places.length ? "body" : "table-only", sections: places,
      reason: !observed.length ? "계산된 근거 없음" : places.length ? "해당 영역의 복합 해석·강점·행동 지침에 사용" : observed.some(f => f.certainty !== "confirmed") ? "근거 정밀도 제한" : !ready ? "검토된 고객용 사용 지침 부족" : observed.every(f => claimStrength([f], f.domains[0]) === "suppressed") ? "본문 영역을 뒷받침하는 근거 부족" : "상위 신호 우선·중복 의미는 전문표에 보존",
    };
  });
}
