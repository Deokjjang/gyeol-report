import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "../report-generation/reportInputTypes";
import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { paragraph, proof, uniqueRefs } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import { selectLoveVoice } from "./loveVoices";
import { loveContext } from "./loveContext";
import { loveFortune } from "./loveFortune";
import { loveBalance } from "./loveBalance";
import { loveFusionTurn } from "./loveFusionScenes";
import { natalLove } from "./loveFallback";
import { loveNatalScenes } from "./loveNatalScenes";
import { composeEvidenceChapters } from "./contentSynthesis";
import type { NarrativeInput, NarrativeState, NarrativeSection, NarrativeBlock, NarrativeProof } from "./narrativeTypes";
import type { LoveNarrative } from "./loveNarrativeTypes";

const known = (v: unknown, values: readonly string[]) => typeof v === "string" && values.includes(v);
const combine = (...values: NarrativeProof[]): NarrativeProof => ({ features: uniqueRefs(values.flatMap(v => v.features)), seedIds: uniqueRefs(values.flatMap(v => v.seedIds)), fusionIds: uniqueRefs(values.flatMap(v => v.fusionIds)), sourceRefs: uniqueRefs(values.flatMap(v => v.sourceRefs)) });

/** Offline-only deterministic text packet. Not wired to UI, V3, paid generation or storage. */
export function composeLoveNarrative(input: NarrativeInput) {
  if (!input || typeof input.name !== "string" || !input.name.trim() || input.name.length > 80 || !input.context ||
    typeof input.context.detailJob !== "string" || input.context.detailJob.length > 200 || (input.mbti != null && typeof input.mbti !== "string") ||
    !known(input.context.jobStatus, JOB_STATUSES) || !known(input.context.relationshipStatus, RELATIONSHIP_STATUSES) || !input.calculation) {
    return { ok: false as const, errors: ["INVALID_NARRATIVE_INPUT"] };
  }
  const packet = buildMyeongliMaterialPacket({ calculation: input.calculation, mbti: input.mbti });
  const pillar = packet.selected.find(m => m.material.category === "dayPillar"), master = packet.selected.find(m => m.material.category === "dayMaster");
  if (!pillar || !master) return { ok: false as const, errors: ["UNVERIFIED_NATAL_PROFILE"] };
  const state: NarrativeState = { input, packet, pillar, master, usedSeeds: new Set(), featureUses: new Map() };
  const voice = selectLoveVoice(state), status = input.context.relationshipStatus;
  const context = loveContext(status, voice?.action ?? "가까운 사람에게 줄 수 있는 나만의 장점", voice?.id);
  const profile = getMbtiSourceProfile(input.mbti);
  const section = (id: string, title: string, domain: NarrativeSection["domain"], blocks: readonly NarrativeBlock[]): NarrativeSection => ({ id, title, domain, blocks });
  const b = (id: string, text: string, source: NarrativeProof, tone: NarrativeBlock["tone"] = "positive", scene?: string) => paragraph(id, text, source, tone, scene);
  const sections: NarrativeSection[] = [];
  let headline: string, opening: readonly NarrativeBlock[], finalLine: string, finalProof: NarrativeProof;
  if (voice) {
    const loveProof = voice.basis("love"), homeProof = voice.basis("marriage");
    const loveSeed = pillar.material.seeds.find(s => s.role === "love"), inside = pillar.material.seeds.find(s => s.role === "inside")!;
    headline = voice.headline;
    opening = [b("love-character", `${input.name.trim()}님은 ${voice.opening}`, loveProof),
      b("love-natal-layer", [inside.text, loveSeed?.text].filter(Boolean).join(" "), proof([pillar], [inside, ...(loveSeed ? [loveSeed] : [])]))];
    sections.push(section("current", context.title, "love", [b("love-current-state", context.scene, combine(loveProof, context.proof), "observation", "relationship-stage")]));
    sections.push(section("expression", "본인은 충분히 표현했다고 생각하는데", "love", [b("love-expression", voice.expression, loveProof, "positive", "affection-language")]));
    sections.push(section("attraction", voice.id === "inquiry" ? "잘생긴 말보다, 다음 질문이 생기는 사람" : "처음보다 나중에 더 생각나는 사람", "love", [b("love-attraction", voice.attraction, loveProof, "observation", "attraction-trigger")]));
    const pair = profile?.relationshipHints?.notablePairs?.[0];
    const pairProof = pair ? proof([], [], [], [`mbti:${profile!.type}:relationshipHints:notablePairs:${pair.withType}`]) : proof();
    sections.push(section("partner", "이런 사람 옆에서 내 표정이 편해집니다", "relationships", [b("love-partner-image", voice.partner, combine(loveProof, pairProof), "positive", "comfortable-partner")]));
    sections.push(section("shadow", "좋은 마음인데, 상대는 다르게 받는 순간", "weaknesses", [b("love-shadow", voice.shadow, combine(loveProof, homeProof), "shadow", "conflict-trigger")]));
    sections.push(section("repair", "다툰 뒤에 다시 같은 편이 되는 방식", "relationships", [b("love-repair", voice.repair, combine(loveProof, homeProof), "direction", "repair-pace")]));
    sections.push(section("intimacy", "오래 가까워지면 알게 되는 내 안쪽", "love", [b("love-intimacy", voice.intimacy, homeProof, "positive", "private-closeness")]));
    sections.push(section("home", status === "married" ? "사랑과 집안일은 따로 움직이지 않습니다" : status === "marriage_preparing" ? "둘의 집을 준비하며 드러나는 진짜 기준" : "함께 살게 된다면, 이런 생활을 만들 사람", "marriage", [b("love-home", `${context.home} ${voice.home}`, combine(homeProof, context.proof), "observation", "shared-household")]));
    sections.push(section("parenting", "내가 부모가 된다면, 아이 앞에서 보일 모습", "relationships", [b("love-parenting", voice.parenting, voice.basis("parenting"), "positive", "own-parenting-style")]));
    sections.push(section("direction", "사랑 안에서 내가 오래 쓸 수 있는 힘", "strengths", [b("love-direction", `${context.ending} ${voice.direction}`, combine(loveProof, context.proof))]));
    finalLine = voice.final; finalProof = loveProof;
    sections.push(...loveNatalScenes(state, voice.id));
  } else {
    const natal = natalLove(state); headline = natal.headline; opening = natal.opening;
    sections.push(section("current", context.title, "love", [b("love-current-state", context.scene, context.proof, "observation", "relationship-stage")]), ...natal.sections);
    sections.push(section("home", status === "married" ? "매일 같이 사는 두 사람의 여유" : "함께 살게 된다면 나눠볼 생활", "marriage", [b("love-home", `${context.home} 가까운 사이일수록 생활의 작은 선택이 중요해집니다. 돈을 어디에 쓰고 가족과 시간을 얼마나 나눌지, 집안일을 누가 끝까지 맡을지에는 각자의 익숙함이 들어 있습니다. 다르게 해온 것을 틀린 것으로 정하기보다 둘이 지킬 기준을 만드는 일이 필요합니다.`, combine(natal.proof, context.proof), "direction", "shared-household")]));
    sections.push(section("parenting", "내가 부모가 된다면, 먼저 돌아볼 내 모습", "relationships", [b("love-parenting", "아이와 함께하는 삶을 선택한다면 내 장점이 앞서는 순간과 너무 빨리 개입하는 순간을 같이 볼 만합니다. 숙제를 도와주거나 규칙을 정할 때, 내가 편한 방식과 아이가 말하고 싶은 것은 다를 수 있습니다. 내가 어떤 어른으로 곁에 있고 싶은지를 생각하는 일이 좋은 출발입니다.", proof([], [], [], ["v4:love-conditional-parenting-reflection"]), "direction", "own-parenting-style")]));
    // Reserve the ending seed for the final line, not both body and punchline.
    const seed = pillar.material.seeds.find(s => s.role === "strength")!;
    sections.push(section("direction", "내 좋은 면을 편하게 꺼낼 수 있는 관계", "strengths", [b("love-direction", `${context.ending} ${seed.text} 서로를 알아가는 시간 안에서 이 힘을 부담 없이 쓸 수 있다면, 사랑은 나를 줄이는 일이 아니라 좋은 면을 더 알아가는 경험이 됩니다.`, combine(proof([pillar], [seed]), context.proof))]));
    finalLine = natal.final.text; finalProof = proof([pillar], [natal.final]);
  }
  const fortune = loveFortune(state, voice?.id ?? "natal", [...opening, ...sections.flatMap(s => s.blocks)].map(b => b.text));
  sections.push(section("fortune", "이미 가지고 있는, 사랑에서 빛나는 좋은 패", "success/fortune", fortune));
  const balance = loveBalance(state, voice?.id ?? "natal");
  if (balance) sections.push(section("balance", "나와 달라서 오히려 편한 사람의 이미지", "relationships", [balance.block]));
  const turn = loveFusionTurn(state, voice?.fusion.ruleId);
  if (turn) sections.push(section("fusion-turn", turn.fusion.kind === "complement" ? "마음이 밖으로 나오는 나만의 통로" : "밖에서 본 내가 전부는 아닙니다", "love", [turn.block]));
  const charm = packet.selected.some(m => ["sinsal_dohwa", "sinsal_hongyeom"].includes(m.feature));
  const order = status === "married" || status === "marriage_preparing" ? ["current", "expression", "home", "natal-scene-0", "intimacy", "fortune", "attraction", "partner", "shadow", "repair", "fusion-turn", "balance", "natal-scene-1", "parenting", "direction"] :
    charm ? ["fortune", "current", "attraction", "expression", "fusion-turn", "partner", "natal-scene-0", "intimacy", "shadow", "repair", "balance", "home", "natal-scene-1", "parenting", "direction"] :
      ["current", "expression", "natal-scene-0", "attraction", "partner", "fortune", "shadow", "repair", "intimacy", "fusion-turn", "balance", "natal-scene-1", "home", "parenting", "direction"];
  sections.sort((a, b) => (order.indexOf(a.id) < 0 ? 3 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 3 : order.indexOf(b.id)));
  const narrative: LoveNarrative = { version: "v4-love-narrative-1", headline, opening, sections, relationshipStatus: status, finalLine, finalProof };
  const mbtiBasis = profile ? { type: profile.type, traits: ["love", "marriage", "parenting"].flatMap(area =>
    (profile.traits?.[area as "love" | "marriage" | "parenting"] ?? []).filter(t => voice?.traits[area as keyof typeof voice.traits].includes(t.id ?? "") || (!voice && area === "love" && t === profile.traits?.love?.[0])).map(t => ({ area, id: t.id, sourceCoverage: t.sourceCoverage ?? "unknown" }))),
    reportUseCases: voice ? profile.reportUseCases?.loveMarriageChildReport ?? [] : [],
    // Internal only; translates relationship qualities, never names a destined partner type.
    pairHint: voice ? profile.relationshipHints?.notablePairs?.[0] ?? null : null } : null;
  const composed = composeEvidenceChapters(input, packet, narrative, "love");
  return { ok: true as const, ...composed, materials: packet, selection: { voice: voice?.id ?? "natal", fusionRule: voice?.fusion.ruleId ?? null, symbolicPartner: balance?.low.element ?? null },
    mbtiBasis, editorial: reviewNarrative(composed.narrative) };
}
