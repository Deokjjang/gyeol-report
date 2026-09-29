import type { RelationshipStatus } from "../report-generation/reportInputTypes";
import type { SajuCalcResult } from "../saju/types";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { composeEditorial, type EditorialScene, type EditorialRole, type EditorialTone, type EditorialForm } from "./editorialComposer";
import { GOD_CODES, storySupport, factLabel } from "./comprehensiveStoryEvidence";
import { matchCompounds } from "./compounds";
import { LOVE_PORTRAITS } from "./lovePortraits";
import { LOVE_SITUATIONS, LOVE_VOICES, LOVE_PARENT_VOICES } from "./loveEditorialContext";
import type { Evidence, Domain } from "./types";
import type { UserContextProfile } from "../report-knowledge/userContextTypes";

export const LOVE_V3_VERSION = "love_v3.0-editorial.1";
export const LOVE_V3_POLISH_VERSION = "love_v3.0-editorial.2";
export type LoveV3Input = { name: string; mbti: string; relationshipStatus: RelationshipStatus; familyFocus: boolean; facts: readonly Evidence[]; calculation: SajuCalcResult; robust?: boolean; context?: UserContextProfile };
export type LoveV3Draft = {
  readonly productType: "love_marriage_child"; readonly productVersion: "v3"; readonly version: typeof LOVE_V3_VERSION | typeof LOVE_V3_POLISH_VERSION;
  readonly personLabel: string; readonly title: string; readonly mbti: string; readonly archetype: string;
  readonly relationshipStatus: RelationshipStatus; readonly familyFocus: boolean;
  readonly chapters: readonly { readonly id: string; readonly title: string; readonly collapsed: boolean; readonly scenes: readonly EditorialScene[] }[];
  readonly editorialAudit: Omit<ReturnType<typeof composeEditorial>, "scenes">;
};
export function isLoveV3Draft(value: unknown): value is LoveV3Draft {
  return !!value && typeof value === "object" && "version" in value && (value.version === LOVE_V3_VERSION || value.version === LOVE_V3_POLISH_VERSION) && "productType" in value && value.productType === "love_marriage_child" && "productVersion" in value && value.productVersion === "v3";
}
export function loveV3CustomerText(draft: LoveV3Draft) {
  return [draft.title, ...draft.chapters.flatMap(c => [c.title, ...c.scenes.flatMap(s => [s.headline, ...s.parts.map(p => p.text)])])].join("\n\n");
}

const gifts: Readonly<Record<string, readonly [string, string, string]>> = {
  gwiin_cheoneul: ["좋은 사람을 통하는 길도 내 편입니다", "사람복과 귀인의 좋은 패가 있습니다. 혼자만 애쓰는 관계에 갇히기보다 믿을 만한 사람과의 연결에서 도움을 얻는 힘입니다. 친구의 담백한 한마디가 복잡했던 마음을 정리해주는 순간도 여기에 어울립니다.", "천을귀인의 도움은 누군가가 내 선택을 대신하는 모습보다, 필요할 때 손을 내밀 수 있는 연결로 살아납니다. 가까운 관계를 혼자만 감당할 필요가 없다는 여유입니다."],
  gwiin_cheondeok: ["날 선 마음 사이에도 부드러운 자리가 있습니다", "감정이 팽팽할 때 관계의 날을 누그러뜨릴 중재의 좋은 패가 있습니다. 서로 틀렸다고 몰아가기보다 말이 꼬인 지점을 다시 풀어내는 온도가 도움이 됩니다.", "천덕귀인의 완충하는 힘은 양보만 하라는 뜻이 아닙니다. 중요한 마음은 지키면서도 대화를 다시 시작할 틈을 남기는 관계의 자원입니다."],
  gwiin_bokseong: ["작은 호의가 생각보다 오래 마음에 남습니다", "필요한 날 건네받은 안부나 가까운 사람의 작은 도움처럼 생활을 부드럽게 만드는 사람복의 패가 있습니다. 대단한 사건이 아니어도 곁에 누가 있는지 느끼게 하는 호의가 마음의 여유를 만듭니다.", "복성귀인의 생활 속 호의는 일상의 연결에서 빛납니다. 큰 보상만 기다리기보다 이미 주고받는 따뜻함이 관계를 받쳐주는 결입니다."],
  gwiin_geumyeorok: ["잘 대접받는 관계를 알아보는 감각", "서로를 함부로 대하지 않는 생활의 품위와 안정이 좋은 패입니다. 비싼 장소보다 편히 앉을 자리를 챙기고 존중하는 말투를 쓰는 모습에서 매력이 살아납니다.", "금여록의 안정감은 겉으로 그럴듯한 관계보다 실제로 편히 지내는 조건과 닿아 있습니다. 좋은 대우를 주고받는 기준이 가까운 사이의 온도를 지킵니다."],
  twelve_sinsal_yeokma: ["익숙한 자리 밖에서 표정이 살아납니다", "새로운 장소에서 함께 걷고 구경할 때 대화가 활발해지는 이동의 좋은 패가 있습니다. 같은 카페에서 근황만 묻던 때와 달리 낯선 풍경 하나가 서로의 새로운 반응을 꺼내줍니다.", "역마의 움직임은 만남의 장소와 경험을 넓히는 힘입니다. 이동 자체가 인연을 보장하는 것은 아니지만 함께 경험할 재료를 풍성하게 만듭니다."],
};
const object = (v: unknown): Record<string, unknown> => v && typeof v === "object" ? v as Record<string, unknown> : {};

export function buildLoveV3(input: LoveV3Input): LoveV3Draft {
  const { facts, calculation, relationshipStatus } = input;
  const domains: readonly Domain[] = ["love", "relationship", "lifestyle"];
  const substantial = facts.filter(f => storySupport(f.featureId, facts, calculation).substantial && f.domains.some(d => domains.includes(d)));
  const gods = substantial.filter(f => f.featureId.startsWith("ten_god_") && LOVE_PORTRAITS[f.featureId.slice(8)])
    .toSorted((a, b) => (calculation.tenGods.distribution[GOD_CODES[b.featureId.slice(8)]] ?? 0) - (calculation.tenGods.distribution[GOD_CODES[a.featureId.slice(8)]] ?? 0) || a.id.localeCompare(b.id));
  const main = gods[0];
  const planned: { id: string; title: string; collapsed: boolean }[] = [], scenes: EditorialScene[] = [];
  const chapter = (id: string, title: string, collapsed = false) => planned.push({ id, title, collapsed });
  const scene = (chapter: string, angle: string, headline: string, tone: EditorialTone, form: EditorialForm, parts: readonly (readonly [EditorialRole, string])[], anchors: readonly Evidence[] = main ? [main] : []) => {
    const domain = anchors.filter(f => substantial.some(s => s.id === f.id)).flatMap(f => f.domains).find(d => domains.includes(d));
    if (!domain) return;
    const refs = [...new Map(anchors.map(f => [f.id, f])).values()];
    scenes.push({ id: `love:${chapter}:${angle}`, chapter, order: scenes.length, domain, angle, subject: "person", tone, form, headline,
      parts: parts.map(([role, text]) => ({ role, text })), evidenceRefs: refs.map(f => f.id), sourceRefs: [...new Set([...refs.flatMap(f => f.sourceRefs), "loveEditorial:reviewed-copy", "userContext:relationshipStatus", ...(input.familyFocus ? ["userContext:focusAreas:가족"] : [])])] });
  };
  const finish = (): LoveV3Draft => {
    const { scenes: composed, ...editorialAudit } = composeEditorial({ product: "love_marriage_child", facts, scenes, chapters: planned.map(c => c.id), selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: substantial.map(f => f.id) });
    return { version: LOVE_V3_VERSION, productVersion: "v3", productType: "love_marriage_child", personLabel: input.name, title: `${input.name}님의 사랑에 남는 결`, mbti: input.mbti, relationshipStatus, familyFocus: input.familyFocus,
      archetype: main ? LOVE_PORTRAITS[main.featureId.slice(8)].archetype : "", chapters: planned.map(c => ({ ...c, scenes: composed.filter(s => s.chapter === c.id) })), editorialAudit };
  };
  if (!main) return finish(); // The publication gate rejects an empty body.
  const p = LOVE_PORTRAITS[main.featureId.slice(8)], state = LOVE_SITUATIONS[relationshipStatus];
  // The day branch remains a supporting fact, not a stronger new spouse score.
  const spouse = facts.find(f => f.kind === "spouse_palace" && f.certainty === "confirmed");
  const dayHidden = calculation.tenGods.hiddenStems.find(h => h.branch === calculation.pillars.day.branch && h.weight >= 0.6);
  const homeFact = gods.find(f => GOD_CODES[f.featureId.slice(8)] === dayHidden?.tenGod) ?? gods[1] ?? main;
  const home = LOVE_PORTRAITS[homeFact.featureId.slice(8)];
  const voice = LOVE_VOICES[input.mbti];
  const trait = voice && facts.find(f => f.featureId === `mbti:${input.mbti}:traits:love:${voice.trait}`);
  const conflictTrait = voice && facts.find(f => f.featureId === `mbti:${input.mbti}:traits:love:${voice.conflictTrait}`);
  const byFeature = (id: string) => substantial.find(f => f.featureId === id);
  const precision = byFeature("sinsal_hyeonchim"), dohwa = byFeature("sinsal_dohwa"), hongyeom = byFeature("sinsal_hongyeom");
  // A confirmed day-reference derived charm can lack positions in the legacy
  // table. Preserve that limited status: a supporting manifestation alongside
  // a substantial anchor, never a hero, compound ingredient or final identity.
  const supportingDohwa = !dohwa && facts.find(f => f.featureId === "sinsal_dohwa" && f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length && object(f.value).source === "derived");
  const supportingHongyeom = !hongyeom && facts.find(f => f.featureId === "sinsal_hongyeom" && f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length && object(f.value).source === "derived");

  chapter("portrait", "사랑하면 드러나는 의외의 나");
  scene("portrait", "first-minute", p.title, "recognition", "prose", [["character", p.opening], ["explanation", p.reason]]);
  if (voice && trait) {
    const fused = precision && input.mbti === "ENTJ" ? "상대의 말투가 달라지면 이유와 해결책까지 빠르게 떠오릅니다. 답장이 짧아진 사실에서 바쁜 일정인지 서운한 일인지 가설을 세우고 바로 물어보고 싶어집니다. 관심이 깊어서 분석도 빨라진 것인데 상대는 아직 자기 기분을 정리하는 중일 수 있습니다."
      : precision && input.mbti === "INFP" ? "평소에는 대화를 부드럽게 이어가다가 진심이나 가치관을 건드린 표현은 놀랄 만큼 정확하게 기억합니다. 다른 사람은 지나간 한마디라고 해도 내 마음에서는 말의 작은 차이를 다시 읽습니다. 관찰의 날이 소중한 마음에 닿을 때 특히 예민해집니다." : voice.approach(p.need);
    scene("portrait", "mbti-fusion", "마음은 비슷해도 티가 나는 방식은 다릅니다", "reversal", "quote", [["character", fused]], precision && ["ENTJ", "INFP"].includes(input.mbti) ? [precision, trait, ...(conflictTrait ? [conflictTrait] : [])] : [main, trait]);
  }
  scene("portrait", "felt-question", state.question, "curiosity", "punchline", [["character", `마음이 생겼는지 알아채는 단서는 거창한 선언보다 작은 선택에 남습니다. ${withKoreanParticle(p.need, "object")} 소중하게 여기는 당신에게도 자꾸 다시 생각나는 순간이 있습니다.`]]);

  chapter("present", state.title);
  scene("present", "status-now", relationshipStatus === "married" ? "사랑이 생활의 몫을 입을 때" : "지금의 마음이 머무는 장면", "recognition", "prose", [["character", state.scene]]);
  scene("present", "status-turn", state.turnTitle, "reversal", "observations", [["character", state.turn], ["advice", state.tip]]);

  chapter("attraction", "눈이 가는 사람, 마음이 쉬는 사람");
  scene("attraction", "first-attraction", "처음 마음이 움직이는 쪽", "curiosity", "prose", [["character", p.attraction]]);
  scene("attraction", "lasting-comfort", "오래 만나고 나서 더 중요해지는 것", "affection", "quote", [["character", home.comfortable], ["explanation", `${withKoreanParticle(factLabel(homeFact), "topic")} 가까운 생활에서 ${withKoreanParticle(home.need, "object")} 중요하게 느끼는 결을 받쳐줍니다.`]], [homeFact, ...(spouse ? [spouse] : [])]);

  chapter("charm", "이미 내게 있는 매력과 좋은 인연의 패");
  scene("charm", "native-gift", "애써 다른 사람이 되지 않아도 좋은 점", "praise", "punchline", [["character", p.good]]);
  if (supportingDohwa) scene("charm", "dohwa-supporting", "취향이 보이는 작은 장면도 기억에 남습니다", "recognition", "prose", [["character", "나만의 옷차림이나 웃는 표정처럼 작은 표현에도 사람은 호감을 느낍니다. 도화살이 더하는 관계 매력은 이런 장면에 가볍게 놓아볼 수 있습니다."], ["explanation", "여기서 도화살은 성격 전체를 이끄는 대표 기운이 아니라 보조적인 매력의 단서입니다. 첫인상 하나보다 실제로 주고받는 대화와 행동을 함께 보는 편이 어울립니다."]], [main, supportingDohwa]);
  if (supportingHongyeom) scene("charm", "hongyeom-supporting", "가까운 대화에서만 보이는 온도", "affection", "quote", [["character", "처음에는 무난했던 말도 편해진 뒤에는 다른 온도로 들립니다. 홍염의 보조적인 매력은 대화가 가까워질수록 자기 분위기가 전해지는 장면과 어울립니다."], ["explanation", "이 표식 하나로 사람의 매력 전체를 정하지는 않습니다. 친밀한 표현을 살펴보는 작은 단서로 두고, 오래 쌓아온 관계의 행동을 더 크게 봅니다."]], [main, supportingHongyeom]);
  if (dohwa) scene("charm", "dohwa-visible", "여럿이 있는 자리에서도 눈에 들어오는 힘", "fortune", "prose", [["character", "사람의 시선에 들어오고 첫인상을 남기는 도화의 매력이 있습니다. 여러 사람이 이야기하는 자리에서 짓는 표정, 취향을 고르는 방식, 짧게 건넨 말이 기억에 남는 쪽입니다."], ["character", input.mbti === "ENFP" && trait ? "반가운 반응이 보이면 표현이 더 밝아지고 새 이야기거리가 이어집니다. 사람들 속에서 호기심을 드러내는 순간 매력이 밖으로 잘 보이니, 가만히 무표정으로 있을 때와 인상이 꽤 다릅니다." : "꾸며낸 완벽한 모습보다 자기 취향을 자연스럽게 보여줄 때 인상이 선명해집니다. 나에게는 평범한 반응인데 누군가는 집에 돌아와 그 장면을 다시 떠올리는 종류의 매력입니다."], ["explanation", "첫 시선을 모으는 도화의 힘과 한 사람에게 마음을 정하는 일은 별개입니다. 주목받는 매력을 가졌다고 모든 호의에 답할 의무까지 생기지는 않습니다."]], [dohwa, ...(input.mbti === "ENFP" && trait ? [trait] : [])]);
  if (hongyeom) scene("charm", "hongyeom-intimacy", "두 번째, 세 번째 만남에서 더 궁금해집니다", "affection", "quote", [["character", "가까워질수록 매력이 커지는 홍염의 기운이 있습니다. 처음의 소개보다 서로 편해진 뒤의 말투, 눈을 맞추고 듣는 분위기, 친근해진 표현에 온도가 붙습니다."], ["character", input.mbti === "INFJ" && trait ? "처음에는 조용히 듣던 사람이 깊은 대화에서 세심한 질문을 건넵니다. 둘만 아는 이야기가 생길수록 낯설던 표정이 부드러워지고, 쉽게 아무에게나 보이지 않는 친밀함이 매력을 키웁니다." : "모두를 상대로 같은 인상을 만드는 힘이라기보다, 가까운 사람에게 나만의 결이 더 잘 전해지는 매력입니다. 상대가 전에 한 말을 기억해 대화를 이어가는 순간에도 처음과 다른 분위기가 생깁니다."], ["explanation", "홍염의 친밀한 표현은 눈에 띄는 첫인상과 다른 속도로 살아납니다. 가까워지는 대화에 자기 색이 묻을 때 매력이 짙어지는 결입니다."]], [hongyeom, ...(input.mbti === "INFJ" && trait ? [trait] : [])]);
  for (const [id, [title, body, reason]] of Object.entries(gifts).filter(([id]) => byFeature(id)).slice(0, 2)) {
    const f = byFeature(id);
    if (f) scene("charm", `gift-${id}`, title, "fortune", "observations", [["character", body], ["explanation", reason]], [f]);
  }
  const compound = matchCompounds(substantial, "person").find(c => c.rule.domains.some(d => domains.includes(d)) && c.evidence.every(f => substantial.some(s => s.id === f.id)));
  if (compound) scene("charm", "compound", "한 가지 매력으로 끝나지 않는 이유", "reversal", "prose", [["character", compound.rule.id === "expression-attention" ? "보여지는 인상에 실제로 나눌 즐거움과 가까운 대화의 온도가 함께 붙습니다. 눈길이 갔다가 같이 보낸 시간이 좋아서 다시 만나고 싶어지는, 서로 다른 매력의 입구가 있는 모습입니다." : compound.rule.id === "precision-expression" ? "상대의 작은 변화를 알아차리는 데서 끝나지 않고 말로 정확하게 꺼내는 힘도 있습니다. 그래서 애정 표현도 막연한 칭찬보다 ‘그때 네가 이렇게 해준 게 좋았어’처럼 구체적일 때 더 선명합니다." : "함께하고 싶은 마음과 시간·돈의 균형을 보는 감각이 동시에 있습니다. 즐겁게 같이 쓰다가도 한쪽의 몫이 당연해지는 순간에는 마음이 걸립니다. 넉넉함과 동등함을 함께 지키고 싶은 관계입니다."], ["explanation", `${compound.evidence.map(factLabel).join("·")}의 서로 다른 힘이 나란히 있습니다. ${compound.rule.judgment}`]], compound.evidence);

  chapter("expression", "상대에게는 이렇게 사랑하고 있습니다");
  scene("expression", "affection-method", "말로 하지 않은 마음도 행동에 남습니다", "affection", "prose", [["character", p.expression]]);
  const depth = byFeature("twelve_sinsal_hwagae");
  if (depth) scene("expression", "solitude-depth", "혼자 쉬었다가 더 다정해지는 반전", "reversal", "quote", [["character", "함께 있는 시간이 좋아도 모든 생각을 그 자리에서 바로 나누지는 않습니다. 좋아하는 음악이나 취미에 혼자 잠기는 시간이 지나야 다시 이야기하고 싶은 것이 생깁니다. 조용해졌다고 마음까지 식은 것은 아닌 쪽입니다."], ["explanation", "화개의 깊이는 혼자 숙성하는 시간에서 나옵니다. 가까운 사이에서도 자신에게 돌아갈 여백이 있을 때 대화에 담을 것이 풍성해지는 결입니다."]], [depth]);
  scene("expression", "delivery-tip", "내가 한 표현과 상대가 받은 표현 사이", "direction", "tip", [["advice", `평소 ${withKoreanParticle(p.need, "object")} 보여주려고 하는 행동 하나에 마음을 짧게 붙여보세요. ‘너를 생각해서 챙겼어’처럼 뜻이 보이면 상대가 추측할 몫이 줄어듭니다. 상대가 편하게 받는 방식도 물어보고, 내 방식과 다르다는 이유로 애정의 크기부터 비교하지는 마세요.`]]);

  chapter("friction", "좋아할수록 이상하게 힘이 들어가는 순간");
  scene("friction", "overuse", "좋은 마음인데 왜 말이 이렇게 나왔을까요", "blunt", "quote", [["character", p.friction]]);
  if (voice && conflictTrait) scene("friction", "partner-perspective", "상대가 듣는 뜻은 조금 다를 때가 있습니다", "recognition", "observations", [["character", voice.conflict]], [main, conflictTrait]);
  const wonjin = byFeature("sinsal_wonjin");
  if (wonjin) scene("friction", "wonjin-small-hurt", "아주 작은 일이 유난히 오래 걸립니다", "reversal", "prose", [["character", "큰 싸움보다 사소한 습관 하나가 반복될 때 감정이 묵직해질 수 있습니다. 상대에게는 대수롭지 않은 농담이나 연락 방식이 내게는 계속 같은 곳을 건드리는 장면입니다."], ["explanation", "원진의 긴장은 가까운 사이의 작은 어긋남에 닿아 있습니다. 마음에 걸린 지점을 알아차리는 감각이지, 두 사람이 멀어질 결말을 정해놓은 뜻은 아닙니다."], ["advice", "다른 불만이 붙기 전에 마음에 걸린 행동 하나만 짚어보세요. ‘늘 그래’라는 평가보다 어느 순간 어떻게 들렸는지를 말하면 작은 어긋남을 작은 대화로 다룰 여지가 생깁니다."]], [wonjin]);
  const relations = facts.filter(f => f.kind === "relation" && f.certainty === "confirmed");
  for (const clash of [false, true]) {
    const relation = relations.filter(f => f.featureId.includes("CLASH") === clash).toSorted((a, b) => Number((object(b.value).positions as string[] | undefined)?.includes("day")) - Number((object(a.value).positions as string[] | undefined)?.includes("day")))[0];
    if (relation) scene("friction", clash ? "clash-pace" : "combination-connection", clash ? "가까워지고 싶은 속도도 서로 다를 수 있습니다" : "맞춰가는 능력도 이미 가진 관계의 힘입니다", clash ? "reversal" : "praise", clash ? "observations" : "prose", [["character", clash ? "만나서 바로 이야기하고 싶은 마음과 혼자 정리한 뒤 말하고 싶은 마음이 부딪히면, 내용보다 대화의 속도부터 어긋납니다. 가까운 관계에서 서로 다른 요구가 움직이는 순간을 살펴볼 만합니다." : "다른 취향을 한쪽이 지우기보다 연결할 방법을 찾는 데 쓸 좋은 패가 있습니다. 한 사람은 집에서 쉬고 싶고 다른 사람은 나가고 싶은 날, 짧게 산책한 뒤 같이 쉬는 식으로 두 마음의 접점을 만들 수 있습니다."], ["explanation", `${factLabel(relation)}의 ${clash ? "충" : "합"}은 내 원국 안에서 ${clash ? "서로 다른 요구를 드러내는" : "이어지는"} 배치입니다. ${clash ? "상대와의 갈등을 정한 것이 아니라 내 안의 속도 차이를 살피는 단서입니다." : "실제 상대와의 궁합이 아니라 나에게 공존하는 관계의 리듬입니다."}`]], [main, relation]);
  }

  chapter("home", relationshipStatus === "married" ? "같은 집에서 더 잘 보이는 두 사람" : "함께 살게 된다면 달라지는 사랑");
  scene("home", "shared-life", relationshipStatus === "married" ? "생활을 함께 꾸릴 때 드러나는 내 결" : "설렘 다음의 하루를 상상하면", "recognition", "prose", [["character", relationshipStatus === "married" ? home.home.replace(/함께 살게 된다면|같이 살게 된다면/, "같이 사는 일상에서는") : home.home], ["explanation", `${withKoreanParticle(factLabel(homeFact), "topic")} ${withKoreanParticle(home.need, "object")} 생활 속에서도 지키고 싶은 힘과 연결됩니다.`]], [homeFact, ...(spouse ? [spouse] : [])]);
  scene("home", "daily-reset", "생활 이야기만 하다가 끝난 하루라면", "direction", "tip", [["advice", "함께 지내는 관계라면 돈·집안일·가족 일정 중 자주 피곤해지는 한 가지부터 이야기해 보세요. 아직 그런 생활이 아니라면 내가 편히 쉬는 조건부터 알아두어도 좋습니다. 관계를 유지하는 실무와 둘이 즐거운 시간을 나누는 일에 각각 자리가 필요합니다."]], [homeFact]);

  chapter("parent", "언젠가 부모가 된다면, 내 모습은", !input.familyFocus);
  scene("parent", "hypothetical-parent", "아이의 미래보다 내가 건네는 태도", "affection", "observations", [["character", home.parent], ...(trait && LOVE_PARENT_VOICES[input.mbti] ? [["character", LOVE_PARENT_VOICES[input.mbti]] as const] : []), ["explanation", "자녀를 가질지 여부는 열어둔 채, 돌보고 가르치는 자리에 선 내 모습을 생각해 보는 이야기입니다. 아이의 성격과 미래가 아니라 내가 익숙하게 꺼내는 사랑의 방식에 초점을 둡니다."]], [homeFact, ...(trait ? [trait] : [])]);

  chapter("direction", "결국 당신의 사랑에 남을 것");
  scene("direction", "whole-person", `${input.name}님이 편히 사랑하는 쪽으로`, "direction", "prose", [
    ["character", `${input.name}님에게 사랑은 ${withKoreanParticle(p.need, "object")} 함께 만들어가는 일입니다. 처음 마음을 움직인 장면과 시간이 지나 마음을 놓게 하는 장면을 모두 갖고 싶은 사람입니다.`],
    ["character", dohwa && hongyeom ? "눈길을 모으는 인상과 가까워질수록 전해지는 따뜻함이 함께 있습니다. 처음 알아보는 사람의 시선도 반갑지만, 내 작은 표현까지 알아보는 사람 앞에서는 다른 깊이가 생깁니다." : dohwa ? "사람에게 기억될 인상이 이미 있습니다. 모든 시선을 붙잡는 일보다 그중 누구 앞에서 가장 자연스럽게 웃는지 알아가는 일이 마음의 방향을 만듭니다." : hongyeom ? "당신의 매력에는 천천히 알아갈수록 드러나는 온도가 있습니다. 처음에 전부 보여주지 않아도 괜찮은 관계에서는 서두르지 않은 대화가 더 긴 여운을 남깁니다." : `좋은 관계의 힘은 ${p.archetype === "표현형" ? "함께 나눌 즐거움을 실제로 만드는 데" : ["안정형", "책임형", "보호형"].includes(p.archetype) ? "중요한 순간 믿을 자리를 지키는 데" : ["친밀형", "탐구형"].includes(p.archetype) ? "한 사람의 이야기를 깊게 알아가는 데" : "서로의 삶을 작게 만들지 않는 데"} 있습니다. 남의 연애처럼 보이게 만드는 것보다 내가 편하게 잘하는 사랑이 오래 남습니다.`],
    ["character", state.final],
    ["character", `곁에 있는 사람이 ${withKoreanParticle(home.need, "object")} 함께 존중할 때 생활도 마음도 편해집니다. 강한 장점 하나로 모든 순간을 해결하려 하기보다, 다정할 때의 나와 쉬어야 할 때의 나를 모두 놓을 자리가 있는 관계입니다.`],
    ["character", p.ending],
  ], [main, homeFact, ...(dohwa ? [dohwa] : []), ...(hongyeom ? [hongyeom] : [])]);
  return finish();
}
