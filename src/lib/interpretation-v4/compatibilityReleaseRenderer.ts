import { COMPATIBILITY_RELEASE_VERSION, COMPATIBILITY_READER_CHAPTERS, type PairReleaseDraft, type PairReleaseSentence } from "./compatibilityReleaseContracts";
import { PAIR_RELEASE_CONTEXT } from "./compatibilityReleaseMaterials";
import { pairReleaseSources, pairRootName, type PairReleaseSource } from "./compatibilityReleaseSources";
import { compatibilityCategoryCopy, pairMove } from "./compatibilityCategoryCopy";
import { godEffects, pairProof } from "./compatibilityInteractions";
import { compatibilityGoodCards } from "./compatibilityHarmony";
import { particle } from "./copyRealizer";
import { renderCompatibilityTitle } from "./compatibilityTitle";
import { sentences, sentenceKey } from "./editorialGuard";
import { humanOutcome } from "./narrativeHumanOutcome";
import type { PairEvidence } from "./compatibilityEvidence";
import type { PairPerson, CompatibilityNarrative } from "./compatibilityNarrativeTypes";
import type { CompatibilityPairView } from "./compatibilityProductView";
import type { RelationshipView } from "./relationshipProductView";
import type { NarrativeBlock, NarrativeProof } from "./narrativeTypes";

type Source = { id: string; candidateId?: string; proof: NarrativeProof; individual: string[]; nodes: string[]; fusions: string[];
  canonical: string[]; relations: string[]; subject?: string; target?: string; direction?: string;
  axis?: string; sign?: number; slot?: "personA" | "personB" };
type Line = { text: string; source: Source; application?: PairReleaseSentence["provenance"]["application"] };
const clean = (text: string) => text.replace(/[.!?]$/, "");
const noun = (text: string) => clean(text).replace(/입니다$/, "");
const terminal = (text: string) => /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
const emptyProof: NarrativeProof = { features: [], seedIds: [], fusionIds: [], sourceRefs: [] };
const RELATION_MEANING: Record<string, string> = {
  six_harmony: "육합은 다른 부분을 이어 맞추며 호흡을 만드는 연결입니다",
  three_harmony: "삼합은 서로 다른 재주를 같은 방향에 모으는 연결입니다",
  half_harmony: "반합은 일부 공통의 관심을 함께 이어볼 수 있는 연결입니다",
  clash: "충은 중요하게 보는 방향이나 반응의 속도가 맞부딪히는 관계입니다",
  harm: "해는 말로 정하지 않은 기대가 엇갈리며 서운함을 남길 수 있는 관계입니다",
};
/** Generation-time editorial allocation only. All registry keys are existing
 * candidate, block, relation or direction IDs; authored material IDs are not evidence. */
export function renderCompatibilityRelease(e: PairEvidence, people: { personA: PairPerson; personB: PairPerson },
  views: { personA: RelationshipView; personB: RelationshipView }, pair: CompatibilityPairView, legacy: CompatibilityNarrative) {
  const a = people.personA, b = people.personB, A = `${a.name}님`, B = `${b.name}님`, ctx = PAIR_RELEASE_CONTEXT[e.category];
  const copy = compatibilityCategoryCopy(e.category, a, b);
  const registry: Record<string, Source> = {}, used = new Set<string>(), committed = new Map<string, number>();
  const draft: PairReleaseDraft = { version: COMPATIBILITY_RELEASE_VERSION, chapters: [], bodyLength: 0, shortages: [] };
  const rootTerms = new Set<string>(), quotedNodes = new Set<string>();
  const register = (source: Source) => { registry[source.id] = source; return source; };
  const personSource = (slot: "personA" | "personB") => register({ id: people[slot].personId, proof: people[slot].proof, individual: [], nodes: [], fusions: [...people[slot].proof.fusionIds], canonical: [], relations: [], subject: people[slot].personId, slot });
  const pa = personSource("personA"), pb = personSource("personB");
  const combined = register({ id: "opening", proof: pairProof(a.proof, b.proof), individual: [], nodes: [], fusions: [...new Set([...a.proof.fusionIds, ...b.proof.fusionIds])], canonical: [], relations: [] });
  const L = (text: string, source: Source, application: Line["application"] = "CONDITIONAL_APPLICATION"): Line => ({ text, source, application });
  const pool = { personA: pairReleaseSources(views.personA), personB: pairReleaseSources(views.personB) };
  function take(slot: "personA" | "personB", preferred: string[], avoid: PairReleaseSource[] = []) {
    return [...pool[slot]].sort((x, y) => Number(avoid.some(r => r.material.axis === x.material.axis)) - Number(avoid.some(r => r.material.axis === y.material.axis))
      || Number(preferred.includes(y.material.axis)) - Number(preferred.includes(x.material.axis)))[0];
  }
  const rows = (["personA", "personB"] as const).map(slot => {
    const core = take(slot, ["AUTONOMY", "RELATION_STYLE", "EXPRESSION"]);
    const need = take(slot, ["BOUNDARY", "RECOVERY_NEED", "STABILITY"], core ? [core] : []);
    const gift = take(slot, ["CARE", "DUTY", "SOCIAL_ATTUNEMENT"], [core, need].filter((r): r is PairReleaseSource => !!r));
    return { slot, p: people[slot], core, need, gift, risk: take(slot, ["COMMUNICATION_STYLE", "EXPRESSION", "AUTONOMY"], [core, need, gift].filter((r): r is PairReleaseSource => !!r)) };
  });
  function root(slot: "personA" | "personB", r: PairReleaseSource): Source {
    const nodes = r.candidate.mbtiSourceNodeIds.filter(id => views[slot].nodes.some(n => n.id === id));
    return register({ id: `${people[slot].personId}:${r.candidate.id}:${r.atom.id}`, candidateId: r.candidate.id, proof: { ...emptyProof, sourceRefs: [r.candidate.sourceId, `person:${people[slot].personId}`], fusionIds: r.candidate.fusionIds },
      individual: [r.atom.id], nodes, fusions: r.candidate.fusionIds, canonical: [], relations: [], subject: people[slot].personId, slot, axis: r.material.axis, sign: r.material.sign });
  }
  function reason(slot: "personA" | "personB", r: PairReleaseSource, application: string): string {
    const key = r.atom.easyMeaning;
    if (rootTerms.has(key)) return `${people[slot].name}님의 ${pairRootName(r)}에서 읽은 성향은 ${application}.`;
    return `${people[slot].name}님의 ${particle(pairRootName(r), "은", "는")} ‘${noun(r.atom.easyMeaning)}’이라는 뜻으로, ${application}.`;
  }
  function node(slot: "personA" | "personB", domains: string[], exclude: string[] = [], axis?: string) {
    const annotated = (id: string) => views[slot].profiles.mbti.contributions.some(c => c.sourceNodeId === id && c.axis === axis);
    return views[slot].nodes.filter(n => n.id.endsWith(":plainKo") && typeof n.value === "string" && !exclude.includes(n.id))
      .sort((x, y) => Number(annotated(y.id)) - Number(annotated(x.id)) || domains.indexOf(x.sourceDomain!) - domains.indexOf(y.sourceDomain!))
      .find(n => domains.includes(n.sourceDomain!) && sentences(String(n.value))[0]?.length > 15);
  }
  function mbti(slot: "personA" | "personB", n: NonNullable<ReturnType<typeof node>>) {
    return register({ id: `${people[slot].personId}:${n.id}`, proof: { ...emptyProof, sourceRefs: [n.sourcePath] }, individual: [], nodes: [n.id], fusions: [], canonical: [], relations: [], subject: people[slot].personId, slot });
  }
  function relation(r: PairEvidence["relations"][number]) {
    return register({ id: r.identity, proof: { ...emptyProof, sourceRefs: [`compatibilityRelationRules:detectCrossBranchRelations:${r.identity}`] }, individual: [], nodes: [], fusions: [], canonical: [r.identity], relations: [r.identity] });
  }
  const shared = pair.sharedGround[0], friction = pair.friction[0];
  function comparison(r: NonNullable<typeof shared>) {
    return register({ id: `comparison:${r.tag}:${r.axis}`, proof: { ...emptyProof, sourceRefs: [...r.personA.evidence.map(id => `personA:${id}`), ...r.personB.evidence.map(id => `personB:${id}`)] },
      individual: [...r.personA.evidence, ...r.personB.evidence].filter(id => !id.startsWith("mbti:")), nodes: [...r.personA.evidence, ...r.personB.evidence].filter(id => id.startsWith("mbti:")), fusions: [], canonical: [], relations: [] });
  }
  const harmonic = e.relations.find(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const tension = e.relations.find(r => ["clash", "harm"].includes(r.kind));
  const canonicalBlocks = [...legacy.opening, ...legacy.sections.flatMap(s => s.blocks)];
  function asset(block: NarrativeBlock): Source {
    return register({ id: block.id, proof: block.proof, individual: [], nodes: [], fusions: [...block.proof.fusionIds], canonical: [], relations: [] });
  }
  function add(c: number, p: number, lines: Line[]) {
    const contract = COMPATIBILITY_READER_CHAPTERS[c], pc = contract.paragraphs[p], id = `${contract.id}.${pc.id}`;
    const direction = c === 4 ? e.directions.aToB : c === 5 ? e.directions.bToA : undefined;
    const actual = lines.map(l => ({ ...l, text: terminal(l.text) }));
    if (actual.length < 3 || actual.length > 5 || actual.some(l => !l.text || sentences(l.text).length !== 1 || used.has(sentenceKey(l.text)))) {
      draft.shortages.push(`${id}:INSUFFICIENT_DISTINCT_MATERIAL`); return false;
    }
    const ss: PairReleaseSentence[] = actual.map((l, i) => ({ chapterId: contract.id, paragraphId: pc.id, sentenceRole: `S${i + 1}`, roleDescription: pc.sentences[i] ?? pc.sentences[3], text: l.text,
      relationshipCategory: e.category, personAId: a.personId, personBId: b.personId, subjectPersonId: direction?.subjectPerson ?? l.source.subject, targetPersonId: direction?.targetPerson ?? l.source.target,
      canonicalEvidenceIds: [...new Set([...l.source.canonical, ...(direction ? [direction.relationId] : [])])], individualEvidenceIds: [...l.source.individual], mbtiSourceNodeIds: [...l.source.nodes], fusionIds: [...l.source.fusions],
      relationIds: [...l.source.relations], directionId: direction?.relationId ?? l.source.direction, semanticTheme: `${contract.key}:${pc.purpose}`, sourceCandidateId: l.source.candidateId,
      provenance: { materialId: `pair-release:${contract.id}:${pc.id}:S${i + 1}`, sourceRegistryKey: l.source.id, application: l.application!, sourceRefs: [...l.source.proof.sourceRefs] } }));
    draft.chapters[c].paragraphs.push({ id, purpose: renderCompatibilityTitle(pc.titleTemplate, { personA: a.name, personB: b.name }), text: actual.map(l => l.text).join(" "), sentences: ss });
    actual.forEach(l => { used.add(sentenceKey(l.text)); committed.set(l.source.id, (committed.get(l.source.id) ?? 0) + 1);
      if (l.source.slot && !l.source.individual.length && l.source.nodes.length === 1) l.source.nodes.forEach(id => quotedNodes.add(id)); });
    for (const row of rows) for (const r of [row.core, row.need, row.gift, row.risk]) if (r && actual.some(l => l.text.includes(pairRootName(r)))) rootTerms.add(r.atom.easyMeaning);
    return true;
  }
  draft.chapters = COMPATIBILITY_READER_CHAPTERS.map(c => ({ id: c.id, key: c.key, title: c.title, paragraphs: [] }));
  // P1/P6/P7: joint portrait and category-specific opening, reserved from later scenes.
  add(0, 0, [L(`${A}과 ${B}의 관계를 읽는 출발점은 ${ctx.focus}입니다`, combined),
    L(`${A}은 ${pairMove(a).start} 움직이고, ${B}은 ${pairMove(b).start} 응답하는 모습이 바탕에 있습니다`, combined),
    L(`${ctx.occasion}에는 같은 결정을 앞에 두어도 각자가 먼저 확인하는 질문이 드러날 수 있습니다`, combined),
    L(a.style === b.style ? "익숙한 반응이 돌아오는 편안함 안에서도 상대가 이번에 원하는 것까지 같다고 여기지 않는 것이 핵심입니다" : "두 사람의 재미는 같은 답을 빨리 내는 데보다, 혼자였다면 놓쳤을 선택을 상대 덕분에 알아보는 데 있습니다", combined)]);
  const mainRelation = harmonic ?? tension;
  if (mainRelation) {
    const s = relation(mainRelation);
    add(0, 1, [L(`두 원국 사이에서는 ${mainRelation.labelKo} 관계가 실제로 확인됩니다`, s, "SOURCE"), L(RELATION_MEANING[mainRelation.kind], s, "SOURCE"),
      L(`${A}이 먼저 내놓은 생각에 ${B}이 자기 방식을 보태는 순간을 살피면, 이 연결이 생활에서 어떤 모습으로 쓰이는지 알기 쉽습니다`, s),
      L("명리 관계 하나가 두 사람의 전부는 아니므로, 좋은 연결도 상대의 의견을 생략하는 이유가 되지 않을 때 힘을 냅니다", s)]);
  } else add(0, 1, [L("두 원국에서 뚜렷하게 확인되지 않은 합이나 충을 관계의 이름으로 붙이지 않겠습니다", combined, "SOURCE"),
    L(`${A}의 ${a.core} 모습과 ${B}의 ${b.core} 모습을 따로 확인하는 편이 정확합니다`, combined),
    L("두 사람의 반응을 한 운명으로 묶기보다, 같은 선택에서 무엇을 먼저 확인하는지 구체적으로 볼 필요가 있습니다", combined),
    L("확인된 연결이 적다는 사실은 나쁜 궁합의 판정이 아니며, 실제로 주고받는 말과 선택을 살필 자리를 남깁니다", combined)]);
  const domains = e.category === "love" ? ["LOVE", "RELATIONSHIPS", "COMMUNICATION"] : e.category === "marriage" ? ["MARRIAGE", "RELATIONSHIPS", "COMMUNICATION"] : ["COMMUNICATION", "RELATIONSHIPS"];
  const na = node("personA", domains), nb = node("personB", domains);
  if (na && nb) add(0, 2, [L(`${a.mbti}인 ${A}에게는 ‘${clean(sentences(String(na.value))[0])}’라는 관계 성향이 있습니다`, mbti("personA", na), "SOURCE"),
    L(na.id === nb.id ? `${B}에게도 같은 ${b.mbti}의 반응이 확인되므로, 이 부분은 다르게 꾸미기보다 두 사람이 공유하는 익숙함으로 볼 수 있습니다` : `${b.mbti}인 ${B}은 ‘${clean(sentences(String(nb.value))[0])}’라는 면도 함께 지닙니다`, mbti("personB", nb), "SOURCE"),
    L(a.style === b.style ? "닮은 반응은 설명을 줄여줄 수 있지만, 지금의 필요까지 같다는 뜻은 아니므로 상대의 답을 미리 정하지 않는 편이 좋습니다" : "두 반응을 같은 상황에 놓으면 한쪽이 보낸 관심을 다른 쪽이 어떻게 알아보는지부터 서로 확인해볼 수 있습니다", combined), L("유형 이름이 같거나 다르다는 사실보다, 두 반응을 함께 놓았을 때 서로에게 필요한 신호가 무엇인지가 중요합니다", combined)]);
  else draft.shortages.push("CH01.P3:UNKNOWN_MBTI_NO_PAIR_INFERENCE");
  add(0, 3, [L(`${A}의 ${particle(pairMove(a).gift, "과", "와")} ${B}의 ${particle(pairMove(b).gift, "은", "는")} 각자 다른 자리에서 관계를 받쳐줄 수 있습니다`, combined),
    L("다만 자기에게 자연스러운 호의를 상대도 똑같이 받아들이리라 생각하면, 좋은 의도를 설명하는 대화부터 어긋납니다", combined),
    L(`${ctx.focus}에 맞춰 무엇을 함께 정하고 어디까지 각자 선택할지 나누면 차이의 쓰임이 달라집니다`, combined),
    L("뒤에서 살펴볼 두 방향의 영향은 누가 더 좋은 사람인지 가르는 순위가 아니라, 같은 행동이 서로에게 어떻게 다른 뜻으로 도착하는지 보는 이야기입니다", combined)]);
  // P5: independently allocated personal roots; each paragraph ends at the peer.
  for (const [i, row] of rows.entries()) {
    const { slot, p, core, need, gift, risk } = row, other = i === 0 ? b : a, P = `${p.name}님`, Q = `${other.name}님`, c = i + 1;
    draft.chapters[c].title = `${p.name}님은 이 관계에서 어떤 사람인가`;
    draft.chapters[c].paragraphs = [];
    if (core) {
      const s = root(slot, core), n = node(slot, ["COMMUNICATION", "RELATIONSHIPS", "IDENTITY"], [...quotedNodes], core.material.axis);
      const lines = [L(i === 0 ? `${P}은 ${core.material.act}으로 자기 뜻을 관계 안에 놓습니다` : `${P}의 반응에서 먼저 볼 것은 ${core.material.act}입니다`, s),
        L(reason(slot, core, i === 0 ? "상대에게 다가가는 출발점도 설명해줍니다" : "함께 정할 일을 바라보는 개인적인 출발점입니다"), s, "SOURCE")];
      if (n) {
        const opposite = views[slot].profiles.mbti.contributions.some(c => c.sourceNodeId === n.id && c.axis === core.material.axis && c.rawValue * core.material.sign < 0);
        lines.push(L(opposite ? `반면 ${p.mbti}에는 ‘${clean(sentences(String(n.value))[0])}’라는 선호도 있어, 표현할 마음과 실제로 꺼내는 순서가 다를 수 있습니다` : i === 0 ? `한편 ${p.mbti}에는 ‘${clean(sentences(String(n.value))[0])}’라는 선호도 있어, 기본 기운이 실제 대화에서 나타나는 모습은 조건에 따라 달라집니다` : `${p.mbti}에서는 ‘${clean(sentences(String(n.value))[0])}’라는 반응도 확인되므로, ${P}이 뜻을 전하는 순서를 한 모습으로만 정할 수는 없습니다`, mbti(slot, n), "SOURCE"));
      }
      lines.push(L(i === 0 ? `${Q}에게는 이 모습이 믿고 맡길 부분이 될 수 있지만, 결론에 이르기까지의 속내가 모두 보이는 것은 아닙니다` : `${Q}이 보고 싶은 반응과 순서가 다를 때에는, ${P}이 무엇을 확인하고 있는지 알려주는 짧은 설명이 둘 사이의 빈칸을 줄입니다`, s));
      add(c, 0, lines);
    }
    if (need) { const m = need.material, s = root(slot, need); add(c, 1, [
      L(i === 0 ? `${P}에게 ${particle(m.need, "은", "는")} 사소한 취향보다 관계에서 편안함을 느끼는 조건에 가깝습니다` : `${P}이 편하게 자기 몫을 하려면 ${particle(m.need, "이", "가")} 남아 있어야 합니다`, s),
      L(reason(slot, need, i === 0 ? "어떤 조건에서 힘을 덜 쓰고도 상대를 만날 수 있는지 보여줍니다" : "편안한 상태에서 자신의 뜻을 전하는 데 필요한 조건과 닿아 있습니다"), s, "SOURCE"),
      L(i === 0 && e.category === "parentChild" ? `부모 ${P}은 이 필요를 자녀가 알아서 채워주길 기다리기보다, 성인에게 구할 지원과 스스로 쉴 시간을 먼저 챙길 수 있습니다` : i === 0 && e.category === "managerReport" ? `상사 ${P}이 이 기준을 직접 정리해 먼저 설명하면, 팀원 ${Q}이 눈치로 기대를 맞히는 일을 줄일 수 있습니다` : `${ctx.occasion}, ${Q}이 이 필요를 먼저 물어보면 ${P}의 대답은 찬반 한마디에 머물지 않을 수 있습니다`, s),
      L(i === 0 ? "원하는 것을 설명해도 관계가 불편해지지 않는 경험은, 상대의 다른 바람을 들을 여유까지 만들어줍니다" : "필요를 숨기지 않아도 된다는 믿음이 생기면, 자기 방식을 지키는 일과 상대에게 다가가는 일이 함께 가능해집니다", s)]); }
    if (gift) { const m = gift.material, s = root(slot, gift); add(c, 2, [
      L(i === 0 ? `${P}이 두 사람 사이에 가져올 수 있는 장점은 ${m.gift}입니다` : `${Q}이 ${P}에게서 발견해볼 만한 좋은 면은 ${m.gift}입니다`, s),
      L(reason(slot, gift, i === 0 ? "가까운 사람과 함께 쓸 수 있는 장점의 바탕입니다" : "서로의 수고를 나눌 때 살아날 수 있는 자원입니다"), s, "SOURCE"),
      L(i === 0 ? `${Q}이 혼자 해결하기 어려운 부분을 말했을 때, ${P}의 이 태도는 상대의 몫을 빼앗지 않고도 곁을 받쳐줄 수 있습니다` : `${Q}이 놓친 점을 ${P}이 보태는 순간, 서로 같은 능력을 가져야만 잘 지내는 것은 아니라는 걸 체감할 수 있습니다`, s),
      L(i === 0 ? "좋아 보이는 강점도 상대가 실제로 원하는 도움인지 확인하고 건넬 때, 부담보다 고마움으로 남습니다" : "잘하는 사람에게 일이 계속 몰리지 않도록 기여를 알아주는 반응이 있어야, 이 장점도 편하게 오래 쓰입니다", s)]); }
    if (risk) { const m = risk.material, s = root(slot, risk); add(c, 3, [
      L(i === 0 ? `${P}이 조심할 것은 ${m.risk}입니다` : `${P}의 좋은 의도가 거칠게 도착하는 지점은 ${m.risk}에서 생길 수 있습니다`, s),
      L(i === 0 ? `${particle(m.act, "이", "가")} 한 가지 정답으로 굳어지면, ${Q}이 다른 뜻을 말할 여지가 좁아지기 때문입니다` : `${Q}이 다른 반응을 보이는 순간에도 ${P}이 ${particle(m.act, "을", "를")} 고집하면, 아직 듣지 못한 조건이 빠질 수 있기 때문입니다`, s),
      L(i === 0 ? `${P}은 관계를 편하게 만들었다고 느껴도 ${Q}에게는 자기 의견이 뒤늦게 들어갈 자리만 남았다고 들릴 수 있습니다` : `${P}에게는 당연한 반응도 ${Q}에게는 이미 판단이 끝난 신호로 보일 수 있어, 의도와 받아들인 뜻을 따로 물어볼 필요가 있습니다`, s),
      L(i === 0 ? `${P}이 시도할 구체적인 조정은 ‘${m.adjust}’이며, 성격을 바꾸기보다 행동의 도착 방식을 고치는 일입니다` : `같은 마음도 다르게 전할 수 있도록 ${P}에게는 ‘${m.adjust}’를 권하며, ${Q}의 반응이 달라지는지도 함께 볼 만합니다`, s)]); }
  }
  // P2/P3: shared ground, verified complement and conditional joint strengths.
  if (shared) { const s = comparison(shared), outcome = clean(humanOutcome(shared.axis, shared.personA.direction) ?? "서로에게 익숙한 반응을 보입니다"); add(3, 0, [
    L(`두 사람에게 함께 확인되는 반응은 ‘${outcome}’라는 모습입니다`, s, "SOURCE"),
    L(`${A}과 ${B} 각각의 독립적인 근거가 같은 방향을 보여주므로, 한 사람의 특성을 상대에게 옮겨 붙인 설명은 아닙니다`, s, "SOURCE"),
    L("서로가 먼저 보는 질문이 닮아 있으면 처음부터 긴 설명을 하지 않아도 뜻이 통하는 순간을 만날 수 있습니다", s),
    L("다만 둘이 모두 당연하게 여기는 기준일수록 빠뜨린 반대 의견은 없는지 확인해야, 닮은 힘이 좁은 고집으로 남지 않습니다", s)]); }
  else add(3, 0, [L("뚜렷하게 확인된 공통 성향만으로 두 사람을 묶기보다는, 서로 다른 기여를 같은 목표에 쓰는 조건을 보는 편이 좋습니다", combined, "SOURCE"),
    L(`${A}의 ${particle(a.strength, "과", "와")} ${B}의 ${particle(b.strength, "은", "는")} 서로 다른 출발점입니다`, combined, "SOURCE"),
    L(`${ctx.good}`, combined), L("같은 생각을 해야 좋은 사이인 것은 아니며, 각자의 기여가 결과에 어떻게 이어졌는지 알아보는 것이 두 사람에게 더 구체적인 기준입니다", combined)]);
  const complement = canonicalBlocks.find(b => b.id === "element-complement");
  if (complement && pair.complement.element) {
    const s = asset(complement), parsed = sentences(complement.text);
    add(3, 1, [...parsed.slice(0, 3).map(text => L(text, s)), L("오행의 차이는 생활을 함께 살필 상징적 단서이며, 상대가 내 부족함을 대신 채워야 한다는 의무로 읽지는 않는 편이 좋습니다", s)]);
  } else add(3, 1, [L("검증된 오행 보완이 없을 때에는 누가 누구에게 부족한 기운을 채워준다는 설명을 만들지 않습니다", combined, "SOURCE"),
    L(`${A}이 건넬 ${particle(pairMove(a).gift, "은", "는")} ${B}의 다른 강점과 번갈아 쓰일 때 함께할 일의 폭을 넓혀줄 수 있습니다`, combined),
    L("먼저 의견을 낸 사람이 답까지 독점하지 않고 다른 사람이 잘하는 부분을 이어받게 하면, 두 장점은 같은 목표에 기여할 수 있습니다", combined),
    L("도움이 되는 차이는 상대가 거절할 수 있을 때 유지되고, 늘 내 방식으로만 따라오라는 요구가 되면 불편한 차이로 바뀝니다", combined)]);
  const pairDialogue = canonicalBlocks.find(b => b.id === "pair-dialogue");
  if (pairDialogue) add(3, 2, sentences(pairDialogue.text).map(text => L(text, asset(pairDialogue))));
  else add(3, 2, [L(`${ctx.good}라는 장면에 두 사람의 다른 기여를 놓아볼 수 있습니다`, combined), L(`${A}은 ${pairMove(a).start} 함께할 일의 첫 단서를 보탤 수 있습니다`, pa),
    L(`${B}이 ${pairMove(b).start} 응답하면, 한 사람이 시작한 일이 다른 관점까지 만나는 경험이 됩니다`, pb),
    L("잘 맞았던 날의 결과만 기억하지 말고 어떤 도움을 주고받았는지 짚어보면, 다음에도 다시 쓸 수 있는 둘의 방식이 남습니다", combined)]);
  add(3, 3, [L(`‘${copy.delightTitle}’라는 질문에는 두 사람의 다른 장점이 함께 쓰일 여지가 담겨 있습니다`, combined),
    L(`${A}에게 중요한 ${particle(pairMove(a).want, "과", "와")} ${B}이 바라는 ${particle(pairMove(b).want, "을", "를")} 같은 계획 안에 남겨보는 것이 출발점입니다`, combined),
    L("한쪽이 계속 양보해서만 유지되는 편안함은 두 사람의 좋은 힘과 구분해야 하며, 잘 지낸다는 이유로 불편을 생략해서는 안 됩니다", combined),
    L(`${ctx.future}`, combined)]);
  // P5: receiver-viewer ten-god IDs and identities stay canonical in both directions.
  for (const [i, slot] of (["aToB", "bToA"] as const).entries()) {
    const from = rows[i], to = rows[1 - i], d = e.directions[slot], P = `${from.p.name}님`, Q = `${to.p.name}님`, c = i + 4;
    draft.chapters[c].title = `${from.p.name}님이 ${to.p.name}님에게 주는 영향`;
    const ds = register({ id: d.relationId, proof: { ...emptyProof, sourceRefs: [`compatibilityRelationRules:getCrossTenGodRelation:${d.relationId}`, `target-viewer:${to.p.personId}`] },
      individual: [], nodes: [], fusions: [], canonical: [d.relationId], relations: [], subject: d.subjectPerson, target: d.targetPerson, direction: d.relationId });
    const god = d.receivedTenGod?.tenGodKo;
    if (god && godEffects[god]) add(c, 0, [L(`${P}의 존재는 ${Q}에게 ${godEffects[god]}`, ds, "SOURCE"),
      L(i === 0 ? `${Q}의 일간을 기준으로 ${P}의 일간을 읽은 실제 십성은 ${god}이며, 받는 사람 쪽에서 이 관계의 뜻을 살펴야 합니다` : `${particle(god, "은", "는")} 이번에 ${Q}이 ${P}을 바라보는 기준에서 나온 십성으로, 먼저 소개한 방향과 주체 및 대상이 다릅니다`, ds, "SOURCE"),
      L(`${ctx.occasion}, ${P}의 선택을 만나는 ${Q}은 평소 혼자 판단할 때와 다른 질문을 해볼 수 있습니다`, ds),
      L(i === 0 ? `이 자극은 ${Q}이 자기 방식으로 답할 여지를 남길 때 도움이 되며, ${P}의 뜻을 따르라는 명령이 되면 부담도 달라집니다` : e.directions.aToB.receivedTenGod?.tenGodKo === god ? `같은 ${god}이라도 이번에는 ${Q}이 받는 자극이므로, 그 사람의 필요와 반응에서 이 방향의 의미를 읽어야 합니다` : `${Q}에게 남는 ${god}의 자극은 앞서 ${P}에게 나타난 반응과 다르므로, 서로에게 같은 행동을 기대하기보다 받는 사람의 변화를 살펴야 합니다`, ds)]);
    const gift = from.gift, risk = from.risk, need = to.need;
    if (gift) { const s = root(from.slot, gift); add(c, 1, [L(i === 0 ? `${P}의 ${particle(gift.material.gift, "은", "는")} ${Q}이 혼자 붙들던 일을 나눠 볼 수 있는 좋은 통로입니다` : e.category === "parentChild" ? `자녀 ${P}의 ${particle(gift.material.gift, "은", "는")} 부모 ${Q}이 익숙한 답 밖의 반응도 발견해볼 기회입니다` : `${Q}에게 ${P}의 ${particle(gift.material.gift, "이", "가")} 닿으면, 늘 자기 방식으로 풀던 문제를 다른 손에 잠깐 맡겨볼 수 있습니다`, s),
      L(reason(from.slot, gift, i === 0 ? "상대의 부담을 덜어주는 관계 행동으로도 이어질 수 있습니다" : "받는 사람이 자기 속도를 되찾도록 돕는 자원으로 써볼 수 있습니다"), s, "SOURCE"),
      L(i === 0 ? `${ctx.occasion}, ${P}이 해줄 수 있는 일을 구체적으로 말하고 ${Q}이 고르게 하면 호의가 실제 도움으로 바뀝니다` : e.category === "parentChild" ? `부모 ${Q}이 자녀의 시도에서 배울 점을 알아보면, ${P}은 부모의 일을 대신하지 않고도 자기 생각을 보탤 수 있습니다` : `${ctx.occasion}, ${Q}이 원하는 도움이 무엇인지 먼저 알려주면 ${P}의 좋은 면도 엉뚱한 곳에 소모되지 않습니다`, s),
      L(i === 0 ? "잘해주는 사람이 결정까지 대신하지 않는 순간, 도움받은 쪽도 고마움과 자기 몫을 함께 지킬 수 있습니다" : "상대가 해준 일을 당연한 역할로 굳히지 않고 구체적으로 알아주는 반응이, 이 방향의 좋은 영향을 다시 이어줍니다", s)]); }
    if (risk && need) { const rs = root(from.slot, risk), ns = root(to.slot, need); add(c, 2, [
      L(i === 0 ? `${P}이 ${particle(risk.material.risk, "을", "를")} 반복하면, ${Q}은 마음보다 선택권이 줄었다고 느낄 수 있습니다` : `${Q}에게 부담으로 도착하기 쉬운 것은 ${P}의 ${risk.material.risk}입니다`, rs),
      L(`${Q}에게는 ${particle(need.material.need, "이", "가")} 중요한데, ${P}은 자기에게 자연스러운 반응을 먼저 내놓을 수 있기 때문입니다`, ns),
      L(i === 0 ? `${P}은 빨리 해결해줬다고 생각하는데 ${Q}은 충분히 말할 기회를 잃었다고 느낀다면, 둘은 같은 행동의 다른 끝을 보고 있는 셈입니다` : `${P}은 불편을 줄였다고 생각해도 ${Q}이 필요한 정보를 받지 못했다면, 좋은 의도만으로 상대의 긴장까지 사라지지는 않습니다`, rs),
      L(i === 0 ? "그 차이를 상대가 예민해서 생긴 일로 정리하면 다음에는 불편을 말하는 것 자체가 어려워져, 작은 신호도 큰 오해로 돌아올 수 있습니다" : e.category === "parentChild" ? "이때 부모가 느끼는 불안을 자녀의 책임으로 돌리기보다, 걱정할 조건과 안전 기준을 어른이 직접 설명하는 일이 우선입니다" : "부담을 말한 사람에게 고마워할 줄 모른다고 답하는 순간, 도움과 간섭의 경계를 다시 확인할 기회까지 닫히게 됩니다", rs)]); }
    if (risk && need) { const rs = root(from.slot, risk), ns = root(to.slot, need); add(c, 3, [
      L(`${P}에게 맞는 조정은 ‘${risk.material.adjust}’입니다`, rs),
      L(i === 0 ? `${Q}이 필요로 하는 ${particle(need.material.need, "을", "를")} 남겨두면, ${P}의 강점도 상대가 받아들일 수 있는 크기로 전달됩니다` : `${Q}이 바라는 ${particle(need.material.need, "을", "를")} 먼저 확인하면, ${P}이 도움을 건네는 순서도 훨씬 분명해집니다`, ns),
      L(i === 0 ? `${P}이 먼저 할 부분과 ${Q}이 직접 정할 부분을 하나씩 말해보면, 막연한 배려보다 실제로 확인할 수 있는 변화가 생깁니다` : e.category === "parentChild" ? `자녀 ${P}은 해보고 싶은 범위와 도움이 필요한 곳을 말할 수 있고, 부모 ${Q}은 안전과 최종 결정의 책임을 따로 맡아야 합니다` : `${Q}이 언제 도움이 필요하고 언제 혼자 해보고 싶은지 말할 수 있게 기다리는 것이, ${P}에게는 영향력을 덜 쓰고도 잘 쓰는 방법입니다`, rs),
      L(i === 0 ? `${P}의 존재가 ${Q}에게 새로운 선택을 열어주는 쪽으로 남을 때, 자극은 부담만이 아니라 함께 넓혀갈 가능성도 됩니다` : `${P}이 상대의 답을 미리 정하지 않는다면, ${Q}은 영향을 받으면서도 자기 선택을 지키는 관계를 경험할 수 있습니다`, ds)]); }
  }
  // P4: verified disagreement and cross relation reserved for the conflict chapter.
  if (friction) { const s = comparison(friction); add(6, 0, [L(`두 사람의 차이는 ${A}과 ${B}이 같은 상황에서 먼저 확인하는 반응이 다르다는 데서 드러납니다`, s),
    L(`${A} 쪽에서는 ‘${clean(humanOutcome(friction.axis, friction.personA.direction) ?? a.core)}’, ${B} 쪽에서는 ‘${clean(humanOutcome(friction.axis, friction.personB.direction) ?? b.core)}’라는 방향을 각각 확인합니다`, s, "SOURCE"),
    L(`${ctx.difference}`, s), L("한쪽에게는 당연한 첫 질문이 다른 쪽에게는 아직 준비되지 않은 요구라면, 상대의 성의보다 대화가 시작되는 순서부터 살펴볼 만합니다", s)]); }
  else add(6, 0, [L("뚜렷하게 입증된 불일치가 적은데도 큰 충돌을 두 사람의 특징으로 만들 필요는 없습니다", combined, "SOURCE"),
    L(`${A}의 ${particle(pairMove(a).want, "과", "와")} ${B}의 ${particle(pairMove(b).want, "이", "가")} 실제 같은 상황에서 모두 충족되는지는 따로 확인할 질문입니다`, combined),
    L("성향이 닮아 있어도 지친 정도나 감당할 수 있는 일의 양까지 같지는 않으므로, 익숙한 반응을 동의로 대신 읽지 않는 편이 좋습니다", combined),
    L("당장 부딪힐 이유를 찾기보다 불편을 말할 자리가 있는지 보는 것이, 근거가 약한 갈등을 억지로 그리는 것보다 정확합니다", combined)]);
  if (tension) { const s = relation(tension); add(6, 1, [L(`원국 사이에서 확인한 ${particle(tension.labelKo, "은", "는")} 두 사람의 다른 반응을 살필 실제 명리 단서입니다`, s, "SOURCE"),
    L(RELATION_MEANING[tension.kind], s, "SOURCE"),
    L(`${ctx.escalation}에는 작은 결정도 누구의 기준을 먼저 따를 것인지의 문제로 커질 수 있습니다`, s),
    L("이 차이가 언제나 해롭다는 뜻은 아니며, 당연하게 굳힌 방법을 다시 묻게 하는 자극으로 쓸 여지도 남아 있습니다", s)]); }
  else add(6, 1, [L("확인된 충돌 관계가 없다면 존재하지 않는 충이나 원진을 두 사람의 갈등 원인으로 붙이지 않습니다", combined, "SOURCE"),
    L("명리의 부딪힘이 없다는 사실과 일상에서 언제나 의견이 같다는 주장은 서로 다른 이야기입니다", combined, "SOURCE"),
    L(`${ctx.escalation}에는 성향이 비슷해도 서로의 여건을 잘못 짐작해 불편이 생길 수 있습니다`, combined),
    L("그럴 때에는 운명적인 대립보다 실제로 누가 무엇을 기대했고 어떤 말이 빠졌는지를 확인하는 편이 관계를 고치기 쉽습니다", combined)]);
  const loop = canonicalBlocks.find(b => b.id === "conflict-loop");
  if (loop) add(6, 2, [...sentences(loop.text).map(text => L(text, asset(loop))), L("문제를 풀려고 반복한 바로 그 행동이 상대의 방어를 늘린다면, 같은 말을 더 세게 하는 것으로는 이 고리를 끊기 어렵습니다", asset(loop))]);
  else add(6, 2, [L(`${A}의 ${particle(pairMove(a).risk, "과", "와")} ${B}의 ${particle(pairMove(b).risk, "은", "는")} 서로 다른 장면에서 대화를 막을 수 있습니다`, combined),
    L("내가 애쓴 부분만 증거로 모으면 상대가 무엇을 감당했는지는 빠지고, 두 사람 모두 자기만 노력한다고 느끼기 쉬워집니다", combined),
    L(`${ctx.occasion}에 각자의 수고를 경쟁시키기 시작하면 정작 결정해야 할 질문은 뒤로 밀립니다`, combined),
    L("알아서 알아주기를 바라는 마음이 길어질수록 상대는 설명받지 않은 시험을 치르게 된다는 점이, 이 관계에서 찔리더라도 짚을 부분입니다", combined)]);
  add(6, 3, [L(`${ctx.escalation}는 두 사람이 멈춰서 확인할 신호입니다`, combined),
    L(`${A}이 기대한 ${particle(pairMove(a).want, "이", "가")} 생략되면, 자기 나름의 수고가 전달되지 않았다고 느낄 수 있습니다`, pa),
    L(`${B}도 ${particle(pairMove(b).want, "이", "가")} 빠진 채 결과만 요구받으면, 같은 부탁을 더 무겁게 받아들일 수 있습니다`, pb),
    L("상대의 행동을 바로 마음의 크기나 사람됨으로 번역하지 않고, 어떤 기대를 말하지 않았는지 찾아야 갈등의 실제 크기를 볼 수 있습니다", combined)]);
  // P8: role asymmetry and different personal actions, not interchangeable advice.
  add(7, 0, [L(`‘${copy.tensionTitle}’라는 질문은 결국 두 사람이 어떤 기대를 서로 다르게 전달했는지로 돌아옵니다`, combined, "RECALL"),
    L(`${A}이 ${pairMove(a).start} 해결하려는 동안 ${B}은 ${pairMove(b).start} 자기 뜻을 지킬 수 있습니다`, combined),
    L("그때 필요한 것은 둘의 마음을 하나로 만들라는 요구가 아니라, 먼저 확인할 질문과 잠시 기다릴 질문을 나누는 일입니다", combined),
    L(`${ctx.agreement}이 있어야 불편을 말한 뒤에도 다음 행동을 정할 수 있습니다`, combined)]);
  for (const [i, row] of rows.entries()) if (row.risk) {
    const s = root(row.slot, row.risk), P = `${row.p.name}님`, Q = `${rows[1 - i].p.name}님`;
    add(7, i + 1, [L(i === 0 ? `${P}이 먼저 연습할 것은 ‘${row.risk.material.adjust}’입니다` : `${P} 쪽의 실천은 ‘${row.risk.material.adjust}’에서 시작할 수 있습니다`, s, "RECALL"),
      L(i === 0 ? `자신에게 자연스러운 ${row.risk.material.act}도 ${Q}의 현재 여건까지 대신 알려주지는 않기 때문입니다` : `${particle(row.risk.material.act, "이", "가")} 편하더라도 ${Q}이 필요한 설명을 이미 받았다고 단정할 수는 없습니다`, s),
      L(i === 0 ? ctx.ruleA : ctx.ruleB, s),
      L(i === 0 ? `${Q}이 반대나 어려움을 말해도 다음 선택이 열려 있으면, ${P}의 제안도 따르라는 압박보다 함께 볼 의견으로 도착합니다` : `${Q}에게 실제로 바뀐 행동을 짧게 알려주면, ${P}의 조정은 눈치로만 알아봐야 하는 숨은 수고가 되지 않습니다`, s)]);
  }
  add(7, 3, [L("두 사람이 함께 지킬 목표는 다툼을 한 번도 하지 않는 일이 아니라, 불편을 말한 뒤에도 다음 선택이 가능한 관계입니다", combined),
    L(`${A}은 ${pairMove(a).start} 찾은 답이 상대에게도 실행 가능한지 한 번 더 확인할 수 있습니다`, pa),
    L(`${B}은 ${pairMove(b).start} 떠올린 필요를 상대가 알 수 있는 구체적인 말로 남길 수 있습니다`, pb),
    L(`${ctx.agreement}을 실제 말과 행동으로 확인하면, 화해가 일단 덮고 넘어가는 순간에 머물지 않습니다`, combined)]);
  add(8, 0, [L(`${A}과 ${B}이 함께 키워볼 힘은 각자 잘하는 것을 상대의 방식까지 지우지 않고 보태는 능력입니다`, combined),
    L(`${A}에게는 ${particle(a.strength, "이", "가")} 있고, ${B} 쪽에는 ${particle(b.strength, "이", "가")} 있어 서로 다른 기여를 해볼 바탕이 됩니다`, combined, "SOURCE"),
    L("힘든 날 한 사람이 먼저 손을 내밀고 다른 사람이 받을 도움을 고를 수 있다면, 같은 성격이 아니어도 든든한 기억을 만들 수 있습니다", combined),
    L("잘 지낸 결과를 한 사람의 희생으로만 남기지 않고 둘의 기여를 알아볼 때, 좋은 경험은 다음 만남에도 이어질 자원이 됩니다", combined)]);
  const good = compatibilityGoodCards(e, a, b)[0];
  if (good) {
    const s = asset(good), lines = sentences(good.text).map(text => L(text, s, "SOURCE"));
    if (lines.length < 4) lines.push(L("이 좋은 패는 본인이 활용할 수 있는 관계 자원이며, 상대가 반드시 나의 귀인이라는 판정이나 앞으로의 성공을 뜻하지 않습니다", s));
    add(8, 1, lines);
  } else if (harmonic) { const s = relation(harmonic); add(8, 1, [L("앞서 확인한 좋은 연결은 서로의 다름을 없애기보다, 함께 해볼 일에 힘을 모을 여지로 다시 볼 수 있습니다", s, "RECALL"),
    L(`${mainRelation?.identity === harmonic.identity ? "이미 소개한" : "확인된"} ${harmonic.labelKo}의 바탕도 실제로 주고받는 도움과 선택에서 의미가 살아납니다`, s, "SOURCE"),
    L(`${ctx.future}라는 가능성을 일상의 작은 시도와 연결해볼 만합니다`, s),
    L("좋은 명리 관계가 있다는 이유로 어려운 질문을 피하지 않을 때, 그 연결도 막연한 기대보다 함께 쓴 경험으로 남습니다", s)]); }
  else add(8, 1, [L("검증되지 않은 귀인이나 좋은 인연의 이름 대신, 두 사람에게 이미 확인된 장점을 관계의 자원으로 쓰겠습니다", combined, "SOURCE"),
    L(`${A}의 ${particle(pairMove(a).gift, "은", "는")} ${B}에게 건넬 수 있는 몫이고 상대의 삶을 대신할 책임은 아닙니다`, pa),
    L(`${B}의 ${particle(pairMove(b).gift, "도", "도")} 원하는 도움을 물어보고 건넬 때 두 사람 사이에서 편하게 살아납니다`, pb),
    L("좋은 관계의 가능성은 특별한 이름의 개수보다, 실제로 서로의 선택과 수고를 어떻게 다루는지에서 확인할 수 있습니다", combined)]);
  add(8, 2, [L(`오래 지키려면 ${particle(ctx.focus, "을", "를")} 한 번의 합의로 끝내지 않고 여건이 바뀔 때 다시 살펴야 합니다`, combined),
    L(`${A}에게 ${particle(pairMove(a).want, "이", "가")} 필요하듯 ${B}에게도 ${particle(pairMove(b).want, "이", "가")} 관계 안에 남을 이유가 있습니다`, combined),
    L("다음 약속을 정할 때 지난번에 편했던 것 하나와 바꾸고 싶은 것 하나를 나눠보면, 좋았던 경험을 버리지 않고 새 조건도 넣을 수 있습니다", combined),
    L("늘 같은 양을 주고받기보다 지금 누가 무엇을 감당하는지 알아보는 선택이, 변화 속에서도 서로의 자리를 지켜줍니다", combined)]);
  add(8, 3, [L(`${A}이 ${pairMove(a).start} 내놓는 생각과 ${B}이 ${pairMove(b).start} 보태는 반응 사이에 두 사람만의 이야기가 놓입니다`, combined),
    L("다른 방식으로 시작한 두 힘이 한쪽을 지우지 않고 이어질 때, 혼자서는 만들지 못한 경험과 믿음도 생길 수 있습니다", combined),
    L("마지막까지 기억할 기준은 상대를 다 안다는 확신보다, 오늘의 선택과 어려움을 다시 물어볼 수 있는 여지를 남기는 것입니다", combined),
    L(ctx.close, combined)]);
  draft.bodyLength = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n").length;
  const blocks = (chapter: PairReleaseDraft["chapters"][number]): NarrativeBlock[] => chapter.paragraphs.map(p => ({ id: p.id, text: p.text, mode: "prose",
    tone: chapter.id === "CH07" ? "shadow" : chapter.id === "CH08" ? "direction" : "positive",
    proof: pairProof(...p.sentences.map(s => registry[s.provenance.sourceRegistryKey].proof)) }));
  const narrative: CompatibilityNarrative = { ...legacy, headline: legacy.headline, opening: blocks(draft.chapters[0]),
    sections: draft.chapters.slice(1).map(c => ({ id: c.key, title: c.title, domain: c.id === "CH07" ? "weaknesses" : c.id === "CH09" ? "success/fortune" : "relationships", blocks: blocks(c) })),
    finalLine: copy.ending };
  return { draft, narrative, registry, allocation: [...committed].map(([id, sentences]) => ({ id, sentences })) };
}
export type PairReleaseRegistry = ReturnType<typeof renderCompatibilityRelease>["registry"];
