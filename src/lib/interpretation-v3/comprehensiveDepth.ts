import type { ComprehensiveV3Block as Block, ComprehensiveV3Draft, ComprehensiveV3Input } from "./comprehensive";
import { composeComprehensiveFinal } from "./comprehensiveExperience";
import { ALTERNATE_REALITY_VOICES, GOD_PORTRAITS, GOOD_FORTUNE, LOVE_VOICES, PRECISION_VOICES, REALITY_VOICES, type RealityVoice } from "./comprehensiveExperienceCopy";
import { compoundProminence, factLabel, storySupport, unique } from "./comprehensiveStoryEvidence";
import { signalImage } from "./comprehensiveEditorial";
import { interpretCareerContext } from "./context";
import { composeEditorial, COMPREHENSIVE_EDITORIAL_MIX, type EditorialForm, type EditorialRole, type EditorialScene, type EditorialTone } from "./editorialComposer";
import { DEPTH_PORTRAITS, DEPTH_PRIVATE, type DomainPortrait } from "./comprehensiveDepthPortraits";
import { DEPTH_ATTRACTION, DEPTH_CONTEXT, DEPTH_ELEMENT_IMAGES, DEPTH_GIFTS, DEPTH_GIFT_MOMENTS, DEPTH_TIPS, PRECISION_MANIFESTATIONS } from "./comprehensiveDepthScenes";
import { DEPTH_LOVE_INNER, DEPTH_VOICE_INNER } from "./comprehensiveDepthFusion";
import type { Domain, Evidence } from "./types";
import type { WritingMode } from "./comprehensiveStorytelling";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";

export const DEPTH_COMPREHENSIVE_VERSION = "comprehensive_v3.3-editorial.1" as const;
const CHAPTERS = ["core", "strength", "choices", "gifts", "career", "money", "people", "love", "study", "patterns", "direction"] as const;
const MODES: Record<EditorialTone, WritingMode> = { curiosity: "question", recognition: "judgment", praise: "image", blunt: "tension", reversal: "reversal", fortune: "gift", affection: "contrast", direction: "criterion" };
const char = (text: string) => ({ role: "character" as const, text });
const why = (text: string) => ({ role: "explanation" as const, text });
const tip = (text: string) => ({ role: "advice" as const, text });
const giftTones: Record<string, EditorialTone> = { gwiin_cheoneul: "fortune", twelve_sinsal_jangseong: "praise", twelve_sinsal_banan: "recognition", gwiin_jaego: "reversal", gwiin_cheondeok: "affection", gwiin_woldeok: "recognition", twelve_sinsal_hwagae: "affection", twelve_sinsal_yeokma: "reversal", gwiin_munchang: "praise", gwiin_hakdang: "fortune", gwiin_taegeuk: "recognition", gwiin_amrok: "reversal" };
const giftForms: Record<string, EditorialForm> = { gwiin_cheoneul: "prose", twelve_sinsal_jangseong: "observations", twelve_sinsal_banan: "quote", gwiin_jaego: "quote", gwiin_cheondeok: "prose", gwiin_woldeok: "quote", twelve_sinsal_hwagae: "quote", twelve_sinsal_yeokma: "observations", gwiin_munchang: "prose", gwiin_hakdang: "quote", gwiin_taegeuk: "observations", gwiin_amrok: "quote" };

/** A versioned editorial consumer. All calculation, compound matching and
 * prominence remain owned by the existing interpretation layer. */
export function assembleComprehensiveDepth(input: ComprehensiveV3Input, candidates: readonly Block[]) {
  const base = composeComprehensiveFinal(input, candidates), calc = input.calculation!, facts = input.facts;
  const previous = [...base.opening, ...base.sections.flatMap(s => s.blocks)];
  const selected = new Set([...previous.flatMap(b => b.evidenceRefs), ...base.patterns.flatMap(p => p.evidenceRefs), ...base.directionEvidenceRefs]);
  const strong = (f: Evidence) => selected.has(f.id) && f.scope === "natal" && storySupport(f.featureId, facts, calc).substantial;
  const strongFacts = facts.filter(strong).filter((f, i, all) => all.findIndex(x => x.featureId === f.featureId) === i);
  const gods = strongFacts.filter(f => DEPTH_PORTRAITS[f.featureId]).toSorted((a, b) => {
    const x = storySupport(a.featureId, facts, calc), y = storySupport(b.featureId, facts, calc);
    return (y.weight ?? 0) - (x.weight ?? 0) || y.surface - x.surface || a.featureId.localeCompare(b.featureId);
  });
  const main = gods[0], second = gods[1] ?? main;
  if (!main) return { base, draft: base, composition: null };
  const portrait = DEPTH_PORTRAITS[main.featureId], secondPortrait = DEPTH_PORTRAITS[second.featureId];
  const fact = (id: string) => facts.find(f => f.featureId === id && f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length);
  const strongFact = (id: string) => strongFacts.find(f => f.featureId === id);
  const raw: EditorialScene[] = [], extra = new Map<string, Partial<Block>>();
  const add = (chapter: typeof CHAPTERS[number], id: string, tone: EditorialTone, form: EditorialForm, headline: string, parts: EditorialScene["parts"], fs: readonly Evidence[], preferred: Domain, meta: Partial<Block> = {}) => {
    // A source domain is not a chapter title. Moving its manifestation into a
    // life chapter does not rewrite the registry's domain classifications.
    const anchors = fs.filter(strong);
    const domain = anchors.some(f => f.domains.includes(preferred)) ? preferred : anchors.flatMap(f => f.domains)[0] ?? preferred;
    fs.forEach(f => selected.add(f.id));
    raw.push({ id, chapter, order: raw.length, angle: id, subject: "person", tone, form, headline, parts, domain,
      evidenceRefs: unique(fs.map(f => f.id)), sourceRefs: unique([...fs.flatMap(f => f.sourceRefs), `comprehensiveDepth:${id}`]) });
    extra.set(id, meta);
  };
  const passage = (chapter: typeof CHAPTERS[number], id: string, row: DomainPortrait, f: Evidence, domain: Domain, tone: EditorialTone, form: EditorialForm = "prose", meta: Partial<Block> = {}) =>
    add(chapter, id, tone, form, row[0], [char(row[1]), char(row[2]), why(row[3])], [f], domain, meta);
  const otherSide = (chapter: "career" | "money" | "people" | "love" | "study", used: Evidence, domain: Domain, tone: EditorialTone, form: EditorialForm) => {
    const f = gods.find(f => f !== used); if (!f) return;
    const row = DEPTH_PORTRAITS[f.featureId][chapter === "career" ? "work" : chapter];
    add(chapter, `${chapter}-other-side`, tone, form, row[0], [char(row[1]), char(row[2])], [f], domain);
  };
  const voiceFor = (rows: readonly RealityVoice[]) => {
    for (const row of rows) {
      const signal = row.signals.map(strongFact).find(Boolean), trait = fact(`mbti:${row.trait.replace(":", ":traits:")}`);
      if (signal && trait) return { row, signal, trait, type: row.trait.split(":")[0] };
    }
  };
  const precisionVoice = voiceFor([...PRECISION_VOICES, { trait: "ISFJ:relationships:memory_based_affection", signals: ["sinsal_hyeonchim"], text: "말투가 조금 달라진 것을 알아채도 바로 묻기보다 기억해두는 편입니다. 나중에 비슷한 장면이 오면 그때의 작은 변화까지 함께 떠오릅니다.", closing: "" }]);
  const voice = precisionVoice ?? voiceFor([...REALITY_VOICES, ...ALTERNATE_REALITY_VOICES]);
  const loveVoice = voiceFor(LOVE_VOICES);
  const giftFacts = unique([...(base.sections.find(s => s.id === "gifts")?.blocks.flatMap(b => b.evidenceRefs) ?? []), ...strongFacts.map(f => f.id)])
    .map(id => facts.find(f => f.id === id)!).filter(f => strong(f) && DEPTH_GIFTS[f.featureId])
    .filter((f, i, all) => all.findIndex(x => x.featureId === f.featureId) === i).slice(0, 4);
  const gift = giftFacts[0];
  const day = strongFacts.find(f => f.kind === "day_pillar");
  const money = gods.find(f => /zheng_cai|pian_cai/.test(f.featureId)) ?? gods.find(f => /shi_shen|shang_guan/.test(f.featureId)) ?? main;
  const study = gods.find(f => /pian_yin|zheng_yin/.test(f.featureId)) ?? second;
  const social = gods.find(f => f !== main && f.domains.includes("relationship")) ?? second;

  add("core", "portrait-main", "recognition", "prose", "처음 만난 인상보다 안쪽이 더 재미있는 사람", [
    ...portrait.opening.map((p, i) => char(i === 0 ? `${input.name}님을 한 장면으로 읽으면 이렇습니다. ${p}` : p)), why(GOD_PORTRAITS[main.featureId][0]),
  ], [main], "identity");
  if (second !== main) add("core", "portrait-other-side", "reversal", "quote", "그런데 당신은 이 모습만 있는 사람이 아닙니다", [char(secondPortrait.opening[1]), why(GOD_PORTRAITS[second.featureId][0])], [second], "identity");
  if (gift) add("core", "portrait-good-hand", "fortune", "punchline", "애써 새로 만들어야 하는 장점만 있는 것은 아닙니다", [char(GOOD_FORTUNE[gift.featureId] ?? DEPTH_GIFTS[gift.featureId][2])], [gift], "identity", { positiveFeatureIds: [gift.featureId] });
  if (voice) {
    const primary = REALITY_VOICES.find(r => r.trait.startsWith(`${voice.type}:`))!, trait = fact(`mbti:${primary.trait.replace(":", ":traits:")}`)!;
    add("core", "portrait-behavior", "recognition", "observations", "같은 성향도 밖으로 나오는 방식은 당신답습니다", [char(voice.row.text), char(DEPTH_VOICE_INNER[voice.type]),
      why(`${factLabel(voice.signal)}의 결에 ${voice.type}의 사고·관계 습관이 만났습니다. 안쪽의 힘이 말과 반응으로 나오는 방식까지 함께 읽은 모습입니다.`)], [voice.signal, voice.trait, trait], "identity", { kind: "fusion" });
  } else {
    const fusion = candidates.find(b => b.kind === "fusion" && compoundProminence(b, { ...input, calculation: calc }).prominence === "hero" && b.reading && b.evidenceRefs.some(id => strongFacts.some(f => f.id === id)));
    if (fusion) add("core", "portrait-source-fusion", "recognition", "observations", "생각의 결이 실제 반응으로 바뀌는 순간", [char(fusion.reading), why(fusion.why)], facts.filter(f => fusion.evidenceRefs.includes(f.id)), "identity", { kind: "fusion" });
  }

  add("strength", "strength-felt", "curiosity", "quote", portrait.question, [char(portrait.choice[1]), char(portrait.choice[2]), why(portrait.choice[3])], [main], "identity");
  if (day) add("strength", "strength-image", "praise", "punchline", "한 사람을 풍경으로 그려보면", [why(`${factLabel(day)}의 이미지는 ${signalImage(day.featureId).replace(/입니다\.$/, "입니다.")}`)], [day], "identity");
  const precision = strongFact("sinsal_hyeonchim");
  if (precision) passage("strength", "precision-self", PRECISION_MANIFESTATIONS.strength, precision, "identity", "recognition", "observations");
  const privateMain = DEPTH_PRIVATE[main.featureId];
  add("strength", "strength-private", "affection", "prose", privateMain[0], [char(privateMain[1]), char(privateMain[2])], [main], "identity");

  if (second !== main) add("choices", "choices-felt", "curiosity", "prose", secondPortrait.question, [char(secondPortrait.choice[1]), char(secondPortrait.choice[2]), why(secondPortrait.choice[3])], [second], "identity");
  const compounds = candidates.filter(b => b.kind === "compound" && compoundProminence(b, { ...input, calculation: calc }).prominence === "hero" && b.evidenceRefs.every(id => selected.has(id)));
  const compound = compounds.find(b => b.id === "pair:jie_cai+shi_shen") ?? compounds.find(b => b.id === "deep-perspective") ?? compounds[0];
  if (compound) {
    const fs = facts.filter(f => compound.evidenceRefs.includes(f.id));
    const competitive = compound.id === "pair:jie_cai+shi_shen";
    const deep = compound.id === "deep-perspective";
    add("choices", "choices-two-forces", "reversal", "observations", competitive ? "속으로 겨루던 마음이 결국 손을 움직입니다" : deep ? "혼자 있는 시간이 빈 시간이 아닙니다" : "한 가지 성격으로는 설명되지 않는 선택", [
      char(competitive ? "친구의 결과를 보고 자극받은 뒤, 말로만 다음을 기약하지 않고 직접 만든 것을 들고 돌아옵니다. 경쟁이 생각 속에서만 돌지 않고 눈에 보이는 결과로 넘어가는 조합입니다." : deep ? "남들이 쉬었다고 생각한 시간에도 안에서는 취향과 생각이 숙성되고 있습니다. 오래 붙잡던 질문이 어느 날 다른 경험과 연결되면, 혼자 머문 시간이 한꺼번에 밖으로 나옵니다." : compound.reading),
      why(`${fs.map(factLabel).join("·")}의 힘이 같이 움직이는 모습입니다. ${competitive ? "사람에게 받은 자극이 표현과 생산으로 이어집니다." : deep ? "혼자 몰입하는 성향과 자기 방식으로 해석하는 힘이 깊이를 더합니다." : compound.headline}`),
    ], fs, "identity", { kind: "compound", compoundId: compound.id, prominence: "hero" });
  }
  if (second !== main) {
    const p = DEPTH_PRIVATE[second.featureId];
    add("choices", "choices-private", "affection", "quote", p[0], [char(p[1]), char(p[2])], [second], "identity");
  }
  add("choices", "choices-small-direction", "direction", "tip", "생각을 한 칸 밖으로 옮기는 방법", [tip(DEPTH_TIPS.choices)], [main, second], "identity", { kind: "context" });

  for (const f of giftFacts) {
    const row = DEPTH_GIFTS[f.featureId];
    add("gifts", `gift-life:${f.featureId}`, giftTones[f.featureId], giftForms[f.featureId], row[0],
      [char(row[1]), char(row[2]), char(DEPTH_GIFT_MOMENTS[f.featureId]), why(row[3])], [f], f.domains[0], { positiveFeatureIds: [f.featureId] });
  }
  if (giftFacts.length < 2) add("gifts", "gift-personal-resource", "fortune", "prose", "당연하게 해온 것 안에도 좋은 패가 있습니다", [char(GOOD_FORTUNE[main.featureId]), ...(second !== main ? [char(secondPortrait.opening[0]), char(secondPortrait.opening[2])] : []), why(`${factLabel(main)}${second !== main ? `·${factLabel(second)}` : ""}의 좋은 쓰임입니다. 평소 자연스럽게 해온 일에서도 당신이 가진 자원이 드러납니다.`)], [main, second], "identity", { positiveFeatureIds: unique([main.featureId, second.featureId]) });

  passage("career", "work-character", portrait.work, main, "career", "recognition");
  otherSide("career", main, "career", "blunt", "observations");
  if (precision) passage("career", "precision-work", PRECISION_MANIFESTATIONS.work, precision, "career", "praise", "observations");
  add("career", "career-direction", "direction", "tip", "잘하는 일에 내 판단까지 들어갈 자리", [tip(DEPTH_TIPS.career)], [main], "career", { kind: "context" });
  const job = interpretCareerContext(input.context.fieldLabel ?? ""), active = ["employee", "business_owner", "freelancer"].includes(input.context.lifeStatus);
  const jobLine = !active ? "" : job.industry === "software" ? "소프트웨어 분야에서는 생각을 실제 쓰는 사람의 경험으로 옮기는 장면에서 이 결이 드러납니다." : job.industry === "manufacturing" ? "제조·품질 분야에서는 작은 차이가 실제 결과를 바꾸는 순간에 내 일하는 방식도 더 분명하게 보입니다." : job.roleFamily === "project_creation" ? "디자인·기획 분야에서는 내 취향과 상대에게 전달되는 뜻 사이에서 이런 성향이 구체적으로 드러납니다." : job.roleFamily === "sales_operations" ? "영업 분야에서는 처음의 반응과 오래 이어갈 신뢰 사이에서 내가 중요하게 여기는 기준이 드러납니다." : "";
  const context = DEPTH_CONTEXT[input.context.lifeStatus];
  add("career", "context:career", "reversal", "quote", "지금 하는 일에 비춰보면 조금 더 선명합니다", [char(`${context[0]}${jobLine ? ` ${jobLine}` : ""}`)], [main], "career", { kind: "context" });

  passage("money", "money-character", DEPTH_PORTRAITS[money.featureId].money, money, "money", "blunt", "observations");
  otherSide("money", money, "money", "recognition", "prose");
  add("money", "context:money", "reversal", "quote", "숫자 밖에서 빠져나가고 남는 것", [char(context[1])], [money], "money", { kind: "context" });
  add("money", "money-direction", "direction", "tip", "가격표에 적히지 않은 몫까지", [tip(DEPTH_TIPS.money)], [money], "money", { kind: "context" });

  passage("people", "people-character", DEPTH_PORTRAITS[social.featureId].people, social, "relationship", "affection");
  otherSide("people", social, "relationship", "praise", "quote");
  add("people", "people-direction", "direction", "tip", "마음을 쓴 방식까지 서로 알아보기", [tip(DEPTH_TIPS.people)], [social], "relationship", { kind: "context" });
  const privateSignal = strongFact("twelve_sinsal_hwagae");
  const moving = strongFact("twelve_sinsal_yeokma");
  if (privateSignal && moving) add("people", "people-outside-inside", "reversal", "observations", "사람을 좋아하는 마음과 혼자 있고 싶은 마음은 같이 갑니다", [
    char("새로운 사람과 이야기할 때는 생기가 도는데 집에 돌아오면 한동안 말이 없어집니다. 재미없어서 빠져나온 것이 아니라 바깥에서 받은 장면들을 내 안에서 다시 정리하는 시간입니다."),
    char("친구가 많다는 사실과 속이야기까지 할 사람의 수가 같은 것은 아닙니다. 밖에서의 당신을 잘 아는 사람도 혼자 있을 때 얼마나 깊이 생각하는지는 모르고 지나갈 때가 있습니다."),
    why("역마의 외부 접점과 화개의 내적 숙성을 함께 읽는 장면입니다. 어느 쪽이 진짜 성격인지 하나를 고르는 대신, 밖에서 경험을 얻고 안에서 의미를 만드는 두 방향의 리듬을 봅니다."),
  ], [privateSignal, moving], "relationship", { kind: "compound", compoundId: "story:movement-depth", prominence: "hero" });
  if (precision) passage("people", "precision-people", PRECISION_MANIFESTATIONS.people, precision, "relationship", "recognition", "observations");

  passage("love", "love-natal-character", DEPTH_PORTRAITS[social.featureId].love, social, "love", "affection");
  otherSide("love", social, "love", "blunt", "observations");
  if (loveVoice) add("love", "love-behavior", "reversal", "quote", "좋아할수록 평소와 다른 반응이 나옵니다", [char(loveVoice.row.text), char(DEPTH_LOVE_INNER[loveVoice.type]),
    why(`${factLabel(loveVoice.signal)}에 ${loveVoice.type}의 애정 표현 습관이 더해졌습니다. 먼저 행동하는지, 말을 고르는지, 작은 약속으로 남기는지가 달라집니다.`)], [loveVoice.signal, loveVoice.trait], "love", { kind: "fusion" });
  if (precision) passage("love", "precision-love", PRECISION_MANIFESTATIONS.love, precision, "relationship", "recognition", "observations");
  for (const id of ["sinsal_dohwa", "sinsal_hongyeom"]) {
    const f = fact(id); if (!f || !selected.has(f.id)) continue;
    if (strong(f)) passage("love", `love-attraction:${id}`, DEPTH_ATTRACTION[id], f, "love", id === "sinsal_dohwa" ? "fortune" : "affection", "prose", { positiveFeatureIds: [id] });
    else add("love", `love-attraction:${id}`, "praise", "punchline", "원국에 남아 있는 매력의 단서", [why(`${factLabel(f)} 표식도 확인됩니다. ${id === "sinsal_dohwa" ? "도화는 사람의 시선과 관계의 매력을 읽는 이름입니다." : "홍염은 가까운 교감에서 전해지는 정서적 매력을 읽는 이름입니다."} 이 부분은 사랑의 다른 성향 옆에 놓고 읽는 작은 단서입니다.`)], [social, f], "love", { prominence: "supporting", positiveFeatureIds: [id] });
  }
  const status = input.relationshipStatus;
  const relationTip = status === "single" ? "새로운 사람을 만날 때는 상대가 나를 얼마나 좋아하는지만큼 그 사람 앞에서 내 말과 표정이 편한지도 보세요." : status === "married" ? "같이 생활하는 사이라면 매일 해준 일을 세기 전에 서로에게 어떤 장면이 편하고 버거웠는지부터 나눠보세요." : status === "dating" ? "이미 만나고 있는 사이라면 늘 지키던 약속 하나가 서로에게 어떤 의미인지 한번 이야기해 보세요." : "가까운 사람과 있을 때 내가 자연스럽게 보여주는 관심의 방식 하나를 떠올려보세요.";
  add("love", "context:love", "direction", "tip", "둘이 함께 풀어야 비로소 달라지는 장면", [tip(`${relationTip} ${DEPTH_TIPS.love}`)], [social, ...(fact("spouse_palace:day_branch") ? [fact("spouse_palace:day_branch")!] : [])], "love", { kind: "context" });

  passage("study", "study-character", DEPTH_PORTRAITS[study.featureId].study, study, "study", "recognition");
  add("study", "study-direction", "direction", "tip", "이번에 알게 된 것을 밖으로 한 번", [tip(DEPTH_TIPS.study)], [study], "study", { kind: "context" });
  otherSide("study", study, "study", "affection", "quote");
  if (precision) passage("study", "precision-study", PRECISION_MANIFESTATIONS.study, precision, "study", "praise", "observations");
  add("study", "context:study", "reversal", "quote", "배움은 이미 생활 속에서 모양을 바꾸고 있습니다", [char(context[2])], [study], "study", { kind: "context" });

  for (const [i, f] of gods.slice(0, 3).entries()) {
    const p = DEPTH_PORTRAITS[f.featureId].stress;
    add("patterns", `overuse:${f.featureId}`, (["blunt", "reversal", "recognition"] as const)[i], i === 1 ? "quote" : "prose", p[0], [char(p[1]), why(p[2]), tip(p[3])], [f], "identity");
  }
  const yangin = strongFact("sinsal_yangin");
  if (yangin) add("patterns", "overuse:boundary", "blunt", "observations", "내 선을 지키다가 돌아올 길까지 끊을 때", [char("참을 만큼 참았다는 생각이 들면 더 설명하기보다 선을 분명히 긋고 싶어집니다. 그 순간에는 속이 시원한데, 나중에는 남겨둬도 됐을 대화의 문까지 닫았다는 것을 알아차리기도 합니다."), why("양인의 결단과 독립을 과사용한 모습입니다. 내 경계를 지키는 힘이 모든 관계를 끊는 쪽으로까지 커질 때의 차이를 봅니다."), tip("지키고 싶은 선과 다시 이야기할 조건을 함께 남겨보세요. 단호함은 모든 가능성을 끊어야만 생기는 것이 아닙니다. 오늘 거절할 일과 그 사람 전체에 대한 판단을 나누면 경계는 더 정확해집니다.")], [yangin], "relationship");

  add("direction", "direction-person", "praise", "prose", "다시 한 사람으로 모아 읽으면", [char(portrait.closing[0]), why(`${withKoreanParticle(factLabel(main), "object")} 중심으로 읽었지만, ${factLabel(second)}의 결도 함께 작동합니다. 한쪽의 장점으로 다른 쪽의 필요를 지우지 않을 때 첫 장에서 본 당신의 모습이 더 입체적으로 이어집니다.`)], [main, second], "identity");
  const resource = gods.find(f => f !== main && f !== second && f !== social);
  if (resource) add("direction", "direction-living-resource", "reversal", "quote", "처음의 인상만으로는 다 보이지 않던 힘", [char(DEPTH_PORTRAITS[resource.featureId].opening[0]), char(DEPTH_PORTRAITS[resource.featureId].closing[0]), why(`${GOD_PORTRAITS[resource.featureId][0]} 첫인상을 만든 ${withKoreanParticle(factLabel(main), "with")} 가까운 사이에서 본 ${factLabel(social)}에 이 힘까지 겹쳐져, 하나의 성격 이름으로는 다 읽히지 않는 사람이 됩니다.`)], [resource, main, social], "lifestyle");
  if (gift) add("direction", "direction-resource", "fortune", "quote", "좋은 패는 삶을 버티는 이유보다 넓히는 자원", [char(gift.featureId === "gwiin_cheoneul" ? "당신의 실력에 사람의 도움까지 더해지는 길이 있습니다. 혼자 끝낸 결과만 세지 않을 때 함께한 인연과 주고받은 관점까지 내 삶의 자원으로 남습니다." : `${factLabel(gift)}의 좋은 패는 당신에게 없는 모습을 억지로 만들라는 숙제가 아닙니다. 이미 가진 자원이 실제로 쓰였던 장면을 알아보면 앞으로 가까이 둘 사람과 환경도 조금 더 분명해집니다.`)], [gift], "identity");
  add("direction", "direction-relationship", "affection", "observations", "성과를 내지 않는 날에도 남는 관계", [char(loveVoice ? DEPTH_PORTRAITS[social.featureId].closing[0] : "잘하는 모습만 보여주는 관계보다 힘을 빼도 말이 이어지는 관계가 삶에 다른 종류의 여유를 남깁니다. 내가 자연스럽게 건네는 관심과 상대가 알아듣는 애정이 만나는 장면은 일의 성과와 다른 방식으로 나를 든든하게 만듭니다."), why(`관계에서는 ${factLabel(social)}의 쓰임${loveVoice ? `과 ${loveVoice.type}의 애정 표현` : ""}을 함께 보았습니다. 사람과 자원을 다루는 기준이 사랑에서도 그대로 같은 말로 나오는 것은 아니라는 점이 중요합니다.`)], [social, ...(loveVoice ? [loveVoice.signal, loveVoice.trait] : [])], "relationship");
  add("direction", "direction-choice", "direction", "tip", "앞으로 남길 경험을 고르는 기준", [tip(`${/cai/.test(money.featureId) ? "다음에 쓸 수 있는 자원을 남기는 선택과 지금의 즐거움을 함께 놓아보세요." : /yin/.test(money.featureId) ? "오래 붙잡은 관심 하나를 실제로 써볼 수 있는 사람이나 장면에 연결해 보세요." : "내 손으로 만드는 결과와 그 과정에 쓰는 시간을 함께 소중하게 다뤄보세요."} 이번에는 잘해내야 해서 하는 일 옆에, 끝난 뒤에도 다시 하고 싶은 경험 하나를 남겨보세요. 일에서의 유능함과 관계에서의 편안함, 나를 위한 즐거움을 한 가지 성과로 대신하지 않아도 됩니다.`)], [money, main], "lifestyle");
  add("direction", "direction-last-line", "recognition", "punchline", "당신에게 남길 마지막 한 줄", [char(portrait.closing[1])], [main], "identity");

  const composition = composeEditorial({ product: "saju_mbti_full", chapters: CHAPTERS, facts, selectedEvidenceRefs: [...selected], substantialEvidenceRefs: strongFacts.map(f => f.id), scenes: raw, maxConsecutiveTone: 1 });
  const toBlock = (s: EditorialScene): Block => {
    const fs = facts.filter(f => s.evidenceRefs.includes(f.id));
    const substantive = fs.filter(f => f.kind !== "mbti" && f.kind !== "context" && f.kind !== "spouse_palace");
    return { id: s.id, kind: fs.some(f => f.kind === "mbti") ? "fusion" : "atomic", headline: s.headline, reading: "", why: "", caution: "", action: s.parts.filter(p => p.role === "advice").map(p => p.text).join(" "),
      paragraphs: s.parts.filter(p => p.role !== "advice").map(p => p.text), labels: [], domains: [s.domain], evidenceRefs: s.evidenceRefs, sourceRefs: s.sourceRefs,
      writingMode: MODES[s.tone], editorialForm: s.form, editorialRoles: s.parts.filter(p => p.role !== "advice").map(p => p.role),
      prominence: substantive.every(strong) ? "hero" : "supporting", ...extra.get(s.id) };
  };
  const blocks = (chapter: string) => composition.scenes.filter(s => s.chapter === chapter).map(toBlock);
  const balance = depthElements(input);
  const parts = [...composition.scenes.flatMap(s => s.parts), ...balance.flatMap(b => (b.paragraphs ?? []).map((text, i) => ({ text, role: b.editorialRoles![i] }))), ...balance.filter(b => b.action).map(b => tip(b.action))];
  const chars: Record<EditorialRole, number> = { character: 0, explanation: 0, advice: 0 };
  parts.forEach(p => { chars[p.role] += [...p.text.trim()].length; });
  const total = Object.values(chars).reduce((n, x) => n + x, 0), mix = { character: chars.character / total, explanation: chars.explanation / total, advice: chars.advice / total };
  const mixWarnings = (Object.keys(mix) as EditorialRole[]).filter(role => mix[role] < COMPREHENSIVE_EDITORIAL_MIX[role][0] || mix[role] > COMPREHENSIVE_EDITORIAL_MIX[role][1]);
  const patterns = blocks("patterns").map(b => ({ risk: b.headline, why: b.paragraphs?.join("\n\n"), repair: b.action, labels: b.labels, evidenceRefs: b.evidenceRefs }));
  const direction = composition.scenes.filter(s => s.chapter === "direction");
  const draft: ComprehensiveV3Draft = { ...base, version: DEPTH_COMPREHENSIVE_VERSION, opening: blocks("core"), openingContext: "",
    sections: base.sections.filter(s => s.id !== "balance").map(s => ({ ...s, blocks: blocks(s.id) })).concat([{ id: "balance", title: "오행 균형을 생활에 쓰는 법", blocks: balance }]),
    patterns, direction: direction.flatMap(s => s.parts.map(p => p.text)).join("\n\n"), directionEvidenceRefs: unique(direction.flatMap(s => s.evidenceRefs)),
    editorialAudit: { chars, mix, rejected: composition.rejected.map(r => `${r.id}:${r.reason}`), warnings: composition.warnings.map(w => `${w.id}:${w.reason}`), errors: composition.errors, mixWarnings } };
  return { base, draft, composition };
}

/** All five statuses come from existing weighted labels, not a new threshold.
 * Neutral rows are factual calculation summaries, not promoted personality
 * evidence; they therefore stay outside the narrative prominence gate. */
function depthElements(input: ComprehensiveV3Input): Block[] {
  const calc = input.calculation!;
  return Object.entries(DEPTH_ELEMENT_IMAGES).map(([code, [label, image, low, high]]) => {
    const state = calc.elements.labels.find(l => l.startsWith(`${code}_`))?.split("_")[1] ?? "BALANCED";
    const f = input.facts.find(f => f.kind === "element" && f.featureId.startsWith(`element_${code.toLowerCase()}_`));
    const neutral = state === "BALANCED";
    const condition = state === "STRONG" ? "강함" : state === "MISSING" ? "없음" : state === "WEAK" ? "약함" : "균형";
    const subject = `${label}${code === "WOOD" || code === "METAL" ? "은" : "는"}`;
    const paragraphs = neutral ? [`${subject} 현재 균형권입니다. 따로 채우거나 줄이기보다 지금 리듬을 유지하세요.`] : [state === "STRONG" ? high : low, `${subject} ${image}의 이미지입니다. 원국의 ${condition} 상태를 생활 속 리듬에 비춰 읽은 모습입니다.`];
    return { id: `depth-element:${code}`, kind: "lifestyle", headline: `${label} · ${condition}`, paragraphs, action: "", reading: "", why: "", caution: "", labels: [], domains: ["lifestyle"],
      evidenceRefs: f ? [f.id] : [], sourceRefs: [`${calc.calculationVersion}:elements.labels`, `${calc.calculationVersion}:elements.weighted`],
      editorialForm: neutral ? "tip" : "observations", editorialRoles: neutral ? ["advice"] : ["character", "explanation"], prominence: "supporting" };
  });
}

export function composeComprehensiveDepth(input: ComprehensiveV3Input, candidates: readonly Block[]): ComprehensiveV3Draft {
  return assembleComprehensiveDepth(input, candidates).draft;
}
