import { buildContentEvidencePool, createContentSelection, planChapter, materialLabel, contentFeature, type ChapterEvidencePlan, type ContentEvidencePool } from "./contentEvidence";
import { chapterMbtiReadings } from "./contentMbti";
import { relationshipMbtiReading } from "./contentRelationshipMbti";
import { auditContent } from "./contentQuality";
import { whyMaterial } from "./contentWhy";
import { paragraph, proof, particle } from "./copyRealizer";
import { sentences, sentenceKey } from "./editorialGuard";
import type { NarrativeBlock, NarrativeInput, NarrativeSection, MaterialPacket } from "./narrativeTypes";
import type { SeedRole } from "./materialDepthTypes";
import type { Domain, FusionInterpretation } from "./types";

export const CONTENT_REVISION = "v4-content-synthesis-13a-1";
type Readable = { headline: string; opening: readonly NarrativeBlock[]; sections: readonly NarrativeSection[]; finalLine: string };
type Product = "comprehensive" | "career" | "love" | "major" | "annual";
const LOVE_ROOTS: Readonly<Record<string, readonly string[]>> = {
  core: ["sinsal_hongyeom", "sinsal_dohwa", "ten_god_shi_shen", "ten_god_zheng_guan", "ten_god_bijian"],
  current: ["ten_god_zheng_cai", "ten_god_shi_shen", "ten_god_zheng_yin"],
  expression: ["ten_god_shi_shen", "sinsal_hongyeom", "ten_god_zheng_yin", "ten_god_jie_cai"],
  attraction: ["ten_god_zheng_guan", "ten_god_pian_yin", "ten_god_bijian", "sinsal_dohwa"],
  partner: ["gwiin_cheoneul", "gwiin_cheondeok", "ten_god_zheng_guan", "ten_god_zheng_yin"],
  intimacy: ["sinsal_hongyeom", "twelve_sinsal_hwagae", "ten_god_bijian", "ten_god_pian_yin"],
  shadow: ["sinsal_hyeonchim", "ten_god_shang_guan", "sinsal_yangin", "ten_god_bijian"],
  repair: ["gwiin_cheondeok", "gwiin_woldeok", "ten_god_zheng_yin", "ten_god_shi_shen"],
  fortune: ["sinsal_dohwa", "sinsal_hongyeom", "gwiin_cheoneul", "gwiin_woldeok", "twelve_sinsal_banan", "twelve_sinsal_jangseong"],
  home: ["ten_god_zheng_cai", "ten_god_zheng_guan", "ten_god_bijian", "twelve_sinsal_hwagae"],
  parenting: ["ten_god_zheng_yin", "ten_god_shi_shen", "ten_god_zheng_guan"],
};
const roleFor: Record<Domain, SeedRole> = { identity: "inside", strengths: "strength", weaknesses: "shadow", work: "work", money: "money", study: "study", love: "love", marriage: "relationships", relationships: "relationships", "success/fortune": "fortune" };

/** Limited, grammatical realization only. Claims, time and polarity stay intact.
 * Unlisted conjugations remain untouched rather than guessing Korean endings. */
export function conversationalVoice(text: string, offset = 0): string {
  return sentences(text).map((sentence, i) => {
    if ((i + offset) % 3 === 0) return sentence;
    const simple: readonly [string, string][] = [["있습니다.", "있어요."], ["없습니다.", "없어요."], ["됩니다.", "돼요."], ["합니다.", "해요."], ["싶습니다.", "싶어요."], ["않습니다.", "않아요."], ["다릅니다.", "달라요."], ["모릅니다.", "몰라요."], ["어렵습니다.", "어려워요."], ["좋습니다.", "좋아요."], ["큽니다.", "커요."], ["바랍니다.", "바라요."], ["느낍니다.", "느껴요."], ["봅니다.", "봐요."], ["만듭니다.", "만들어요."], ["찾습니다.", "찾아요."], ["낫습니다.", "나아요."], ["보입니다.", "보여요."], ["가깝습니다.", "가까워요."], ["쌓입니다.", "쌓여요."], ["바뀝니다.", "바뀌어요."], ["해집니다.", "해져요."], ["남습니다.", "남아요."], ["나옵니다.", "나와요."], ["놓칩니다.", "놓쳐요."]];
    for (const [from, to] of simple) if (sentence.endsWith(from)) {
      // 후보입니다/정보입니다 contain the same suffix as the verb 보입니다.
      if (from === "보입니다." && !/(?:^|\s)보입니다\.$/.test(sentence)) continue;
      return sentence.slice(0, -from.length) + to;
    }
    if (/(?:편|힘|것|사람|기운|구조|쪽|셈|때문|모습|이야기|이유|재능|장점|기준|순간|자리|자산|식|확장|과정|매력|패|시간|힌트|장면|태도|길|즐거움)입니다\.$/.test(sentence)) {
      const noun = sentence.slice(0, -4), code = noun.charCodeAt(noun.length - 1) - 0xac00;
      if (code >= 0 && code <= 11171) return noun + (code % 28 ? "이에요." : "예요.");
    }
    return sentence;
  }).join(" ");
}

/** Carry sentence rhythm across paragraph boundaries. This only conjugates
 * reviewed endings; it neither deletes claims nor invents a replacement. */
export function realizeChapterVoice(blocks: readonly NarrativeBlock[]): NarrativeBlock[] {
  let formalRun = 0;
  return blocks.map(block => ({ ...block, text: sentences(block.text).map(sentence => {
    const text = formalRun >= 2 ? conversationalVoice(sentence, 1) : sentence;
    formalRun = /(?:습니다|입니다)\.$/.test(text) ? formalRun + 1 : 0;
    return text;
  }).join(" ") }));
}

function fusionReason(f: FusionInterpretation, pool: ContentEvidencePool, domain: Domain, occurrence: number) {
  const root = pool.materials.find(m => f.myeongliEvidence.some(d => contentFeature(d.evidence.feature) === m.feature));
  const label = root ? materialLabel(root) : f.kind === "complement" ? "표현 신호가 덜 드러난 분포" : "";
  if (!label) return "";
  const type = f.mbtiEvidence.type;
  const introduction = f.kind === "contrast"
    ? `${particle(label, "이", "가")} 향하는 쪽과 ${type}의 행동에는 다른 결이 있어요.`
    : f.kind === "complement"
      ? `사주에서 표현이 덜 드러난다고 실제로 말이나 감정이 없는 건 아니에요. ${type}의 행동에서 그 마음이 나올 다른 통로를 볼 수 있습니다.`
      : `${particle(label, "과", "와")} ${type}는 이 부분에서 같은 쪽을 가리켜요.`;
  // First use explains the reviewed interaction; subsequent use must move to
  // another real domain manifestation, not repeat the same insight verbatim.
  const role = roleFor[domain];
  const manifestation = root?.material.seeds.find(s => s.role === role);
  return occurrence === 0 ? `${introduction} ${conversationalVoice(f.insightSeed, 1)}` :
    manifestation ? `${type}의 그 반응을 이번에는 다른 장면에서 볼 수 있어요. ${conversationalVoice(manifestation.text, 1)}` : "";
}

/** Deterministic chapter planner → allocated evidence → authored scenes →
 * explanation / MBTI synthesis → voice. No UI, network or calculation writes.
 * Existing product scenes are inputs, not the entire finished chapter anymore. */
export function composeEvidenceChapters<T extends Readable>(input: NarrativeInput, packet: MaterialPacket, draft: T, product: Product) {
  const pool = buildContentEvidencePool(input.calculation, packet), state = createContentSelection();
  const definitions = new Set<string>(), traits = new Set<string>(), fusionRealized = new Map<string, number>();
  const reserved = new Set<string>();
  const plans: ChapterEvidencePlan[] = [];
  // Reserve authored scenes before allocating new material. This prevents a
  // source seed from being used twice; it never removes a generated sentence.
  for (const block of [...draft.opening, ...draft.sections.flatMap(s => s.blocks)]) {
    block.proof.seedIds.forEach(id => state.seedUses.add(id));
    sentences(block.text).forEach(text => reserved.add(sentenceKey(text)));
  }
  const voice = (blocks: readonly NarrativeBlock[]) => blocks.map((b, i) => ({ ...b, text: conversationalVoice(b.text, i) }));
  const explanation = (plan: ChapterEvidencePlan, limit: number) => plan.roots.slice(0, limit).flatMap(m => {
    if (definitions.has(m.feature)) return [];
    definitions.add(m.feature);
    const text = whyMaterial(m, 0);
    if (!text) return [];
    return [paragraph(`${plan.id}-why-${m.feature}`, text, proof([m], [], [], [CONTENT_REVISION, "content-role:why"]), "positive")];
  });
  const synthesis = (plan: ChapterEvidencePlan): NarrativeBlock[] => {
    if (product === "love" || ["relationships", "marriage"].includes(plan.domain)) {
      const reading = relationshipMbtiReading(input.mbti, pool.materials, plan.id, traits);
      if (reading) {
        traits.add(reading.id);
        return [paragraph(`${plan.id}-synthesis-${reading.id}`, reading.text,
          proof(reading.roots, [], [], [reading.provenance, `content-synthesis:${reading.kind}:${reading.coverage}`, CONTENT_REVISION]), "positive", `synthesis:${reading.area}:${reading.id}`)];
      }
    }
    // Domain-specific DB trait before a repeat of a global voice. Exact source
    // trait + exact supported feature, including reviewed contrary money goals.
    const lensDomain = product === "love" && ["strengths", "success/fortune", "identity"].includes(plan.domain) ? "love" : plan.domain;
    const readings = chapterMbtiReadings(input.mbti, [...plan.roots, ...pool.materials.filter(m => !plan.roots.includes(m))], lensDomain, traits);
    if (readings[0]) {
      const reading = readings[0]; traits.add(reading.id);
      const label = materialLabel(reading.root);
      const type = reading.id.split(":")[0];
      const behavior = reading.behavior.replace(type, reading.kind === "tension" ? `실속을 챙기는 ${label}와 달리 ${type}` : `${label}의 결이 겹치는 ${type}`);
      return [paragraph(`${plan.id}-synthesis-${reading.id}`, `${behavior} ${reading.combined}`,
        proof([reading.root], [], [], [reading.provenance, `content-synthesis:${reading.kind}:${reading.coverage}`, CONTENT_REVISION]), "positive", `synthesis:${reading.area}:${reading.id}`)];
    }
    const f = plan.fusion;
    if (!f) return [];
    if (sentences(f.insightSeed).some(t => reserved.has(sentenceKey(t)))) return [];
    const occurrence = fusionRealized.get(f.ruleId) ?? 0;
    if (occurrence) return [];
    const text = fusionReason(f, pool, plan.domain, occurrence);
    if (!text) return [];
    fusionRealized.set(f.ruleId, occurrence + 1);
    return [paragraph(`${plan.id}-synthesis-${f.ruleId}`, text, proof([], [], [f], [CONTENT_REVISION, `content-synthesis:${f.kind}`]), "positive")];
  };
  const extend = (s: NarrativeSection, opening = false): NarrativeSection => {
    // The conclusion recombines the person already introduced. Introducing a
    // new glossary definition here breaks the ending and exaggerates novelty.
    if (s.id === "final" || s.id === "direction") return { ...s, blocks: voice(s.blocks) };
    const sceneRoots = s.blocks.flatMap(b => b.proof.features.map(contentFeature)).filter(f => pool.materials.some(m => m.feature === f));
    const preferred = [...new Set([...sceneRoots, ...(product === "love" ? LOVE_ROOTS[s.id] ?? [] : [])])];
    const plan = planChapter(pool, state, s.id, s.domain, preferred, sceneRoots); plans.push(plan);
    // A reader's context, recommendations and conditional parenting are not
    // rewritten into a generic personality claim. Retain their authored scenes.
    const fixedContext = ["current", "roles", "organization", "home", "parenting", "direction", "final", "balance", "environment", "fusion-turn"].includes(s.id);
    const existing = voice(s.blocks);
    // The short shadow should not turn into another dictionary entry. Its
    // constructive face is already developed in strengths/work/relationships.
    if (s.domain === "weaknesses") return { ...s, blocks: existing };
    const why = fixedContext ? [] : explanation(plan, opening ? 1 : 2), fusion = synthesis(plan);
    const depth: NarrativeBlock[] = [];
    if (!fixedContext && s.domain !== "success/fortune") for (const m of plan.roots) {
      const seed = m.material.seeds.find(seed => seed.role === roleFor[s.domain] && !state.seedUses.has(seed.id) && !sentences(seed.text).some(t => reserved.has(sentenceKey(t))));
      if (!seed) continue;
      state.seedUses.add(seed.id); sentences(seed.text).forEach(t => reserved.add(sentenceKey(t)));
      depth.push(paragraph(`${s.id}-manifest-${m.feature}`, conversationalVoice(seed.text, 1), proof([m], [seed], [], [CONTENT_REVISION, `content-role:${s.domain}`]), "positive"));
    }
    // Keep the powerful original scenes; main chapters now have explanation,
    // two-root depth and a genuinely bound MBTI lens rather than one voice card.
    const blocks = opening ? [...existing.slice(0, 2), ...why.slice(0, 1), ...fusion, ...existing.slice(2)] :
      plan.fusion?.kind === "contrast" ? [...existing.slice(0, 1), ...fusion, ...why, ...existing.slice(1), ...depth] :
      ["money", "study"].includes(s.domain) ? [...existing, ...why, ...fusion, ...depth] :
      [...existing.slice(0, 1), ...why, ...existing.slice(1), ...fusion, ...depth];
    return { ...s, blocks };
  };
  const opening = extend({ id: "core", title: draft.headline, domain: product === "career" ? "work" : product === "love" ? "love" : "identity", blocks: draft.opening }, true).blocks;
  const sections = draft.sections.map(s => /^(year-|month-|transition-)/.test(s.id) ? { ...s, blocks: voice(s.blocks) } : extend(s));
  if (["comprehensive", "career"].includes(product) && pool.strength.confidence === "strong" && pool.strength.hourSensitivity.stable) {
    const index = sections.findIndex(s => s.id === (product === "career" ? "strengths" : "portrait"));
    const master = packet.selected.find(m => m.material.category === "dayMaster");
    const weak = ["weak", "veryWeak"].includes(pool.strength.level);
    if (index >= 0 && master && pool.strength.level !== "balanced") {
      const text = weak
        ? "명리에서는 신약 쪽의 바탕도 함께 봅니다. 의지가 약하다는 말이 아니라, 내 힘을 받쳐주는 쪽보다 결과를 내거나 책임질 쪽으로 힘이 더 쓰이는 배치예요. 해보고 싶은 일은 많은데 부탁까지 거절하지 못하면 쉬는 날에도 머릿속 일정표가 돌아가죠. 잘되는 방향은 욕심을 없애는 데 있지 않습니다. 무엇을 직접 하고 어디서 사람과 도구의 도움을 받을지 고를 때, 현실을 보는 눈을 더 크게 쓸 수 있어요."
        : "신강 쪽의 바탕은 내 기준을 세우고 버틸 힘이 받쳐준다는 뜻이에요. 월지와 뿌리, 드러난 생조가 함께 내 힘을 지지하는 배치입니다. 주변이 망설일 때 먼저 시작하고 잘 안돼도 다른 방법을 다시 꺼낼 여유가 장점이죠. 고집이 셀 수 있습니다. 그 힘을 남의 속도를 고치는 데보다 어려운 일을 끝까지 완성하는 데 쓰면 믿고 맡길 사람이 돼요.";
      sections[index] = { ...sections[index], blocks: [...sections[index].blocks, paragraph("daymaster-strength-why", text,
        proof([master], [], [], [...pool.strength.provenance, CONTENT_REVISION, `content-role:strength:${pool.strength.level}`]), "positive", "effort-and-capacity")] };
    }
  }
  const yinYang = pool.yinYang;
  if (yinYang.complete && yinYang.total === 8 && product === "comprehensive") {
    const index = sections.findIndex(s => s.id === "portrait");
    if (index >= 0) {
      const text = yinYang.direction === "mixed"
        ? "천간과 지지의 음양은 한쪽으로 치우치지 않아요. 먼저 움직여 알아보는 모습과 안에서 정리하는 모습을 함께 떠올릴 수 있습니다. 모임에서는 결정을 잘 내리던 사람이 집에 와서야 자기 기분을 돌아보는 식이죠. 어느 한쪽만 진짜 성격이라고 고를 필요는 없어요."
        : yinYang.direction === "outward"
          ? "확인된 여덟 글자에서는 양이 더 많아요. 시작하고 바깥에 꺼내보는 리듬을 떠올릴 수 있죠. 기다리기만 할 때보다 작은 선택이라도 직접 해보면 답답함이 풀리는 모습을 살펴볼 만합니다. 다만 이것만으로 외향적인 사람이라고 정하지는 않아요. 혼자 일해도 시작하는 힘은 충분히 쓸 수 있거든요."
          : "확인된 여덟 글자에서는 음이 더 많아요. 안에서 모으고 관찰한 뒤 정리하는 리듬을 떠올릴 수 있죠. 신나는 모임을 다녀와서도 혼자 누워 그날의 말을 다시 생각하는 장면과 닮았습니다. 조용한 기운이 많다는 것과 사람들 앞에서 말이 적다는 것은 다른 이야기예요.";
      sections[index] = { ...sections[index], blocks: [...sections[index].blocks, paragraph("yin-yang-rhythm", text,
        { features: ["natal:yin-yang"], seedIds: [], fusionIds: [], sourceRefs: yinYang.provenance }, "observation", "after-gathering-rhythm")] };
    }
  }
  const core = plans[0];
  const narrative = { ...draft, opening: realizeChapterVoice(opening), sections: sections.map(s => ({ ...s, blocks: realizeChapterVoice(s.blocks) })) };
  return { narrative, contentAudit: auditContent(narrative), contentPlan: { revision: CONTENT_REVISION,
    coreGyeol: { headline: draft.headline, features: core.roots.map(m => m.feature), fusion: core.fusion?.ruleId ?? null },
    chapters: plans.map(p => ({ id: p.id, domain: p.domain, features: p.roots.map(m => m.feature), fusion: p.fusion?.ruleId ?? null, consideredFusionIds: p.consideredFusionIds, reasons: p.reasons })),
    mbtiTraits: [...traits], yinYang, held: pool.held, strength: pool.strength } };
}
