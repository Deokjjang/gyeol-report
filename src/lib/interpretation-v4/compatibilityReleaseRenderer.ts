import { PAIR_TEN_GOD_APPLICATIONS, PAIR_SHARED_POSSIBILITIES } from "./compatibilityReaderApplications";
import { reviewedMbtiBehavior } from "./contentMbti";
import { COMPATIBILITY_RELEASE_VERSION, COMPATIBILITY_READER_CHAPTERS, type PairReleaseDraft, type PairReleaseSentence } from "./compatibilityReleaseContracts";
import { PAIR_RELEASE_CONTEXT, PAIR_RELEASE_FACETS } from "./compatibilityReleaseMaterials";
import { PAIR_RELEASE_SCENES, PAIR_RELEASE_REPAIR } from "./compatibilityReleaseApplications";
import { pairReleaseSources, pairRootName, type PairReleaseSource } from "./compatibilityReleaseSources";
import { compatibilityCategoryCopy } from "./compatibilityCategoryCopy";
import { godEffects, pairProof } from "./compatibilityInteractions";
import { compatibilityGoodCards } from "./compatibilityHarmony";
import { particle } from "./copyRealizer";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { renderCompatibilityTitle } from "./compatibilityTitle";
import { sentences, sentenceKey } from "./editorialGuard";
import { humanOutcome, mbtiHumanBehavior, REINFORCE_OUTCOMES } from "./narrativeHumanOutcome";
import { fusionHumanSurface } from "./narrativeHumanSurface";
import type { SemanticAxis } from "./semanticCore";
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
/** Generation-time editorial allocation only. Registry keys group existing
 * candidates, atoms, blocks and relations; registry/material IDs are not canonical evidence. */
export function renderCompatibilityRelease(e: PairEvidence, people: { personA: PairPerson; personB: PairPerson },
  views: { personA: RelationshipView; personB: RelationshipView }, pair: CompatibilityPairView, legacy: CompatibilityNarrative, publicationSafety = false) {
  const a = people.personA, b = people.personB, A = `${a.name}님`, B = `${b.name}님`, ctx = PAIR_RELEASE_CONTEXT[e.category], scene = PAIR_RELEASE_SCENES[e.category];
  const copy = compatibilityCategoryCopy(e.category, a, b);

  const possibilities = PAIR_SHARED_POSSIBILITIES[e.category];
  const professionalDomains = e.category === "businessPartner" ? ["WORK", "CAREER", "MONEY"] : ["coworker", "managerReport"].includes(e.category) ? ["WORK", "CAREER"] : [];
  const registry: Record<string, Source> = {}, used = new Set<string>(), committed = new Map<string, number>();
  const draft: PairReleaseDraft = { version: publicationSafety ? "compatibility-publication-safety-01-v1" : COMPATIBILITY_RELEASE_VERSION, chapters: [], bodyLength: 0, shortages: [] };
  const rootTerms = new Set<string>();
  const register = (source: Source) => { registry[source.id] = source; return source; };
  // General conditional guidance uses the entered role declaration, not every
  // unrelated natal/Fusion material carried by the legacy person packet.
  const personSource = (slot: "personA" | "personB") => register({ id: people[slot].personId, proof: publicationSafety ? { ...emptyProof, sourceRefs: [`person:${people[slot].personId}`, `compatibilityRoleLabels:${e.roleVersion}:${e.category}:${e.roles[slot]}`] } : people[slot].proof, individual: [], nodes: [], fusions: publicationSafety ? [] : [...people[slot].proof.fusionIds], canonical: [], relations: [], subject: people[slot].personId, slot });
  const pa = personSource("personA"), pb = personSource("personB");
  const combined = register({ id: "opening", proof: publicationSafety ? pairProof(pa.proof, pb.proof) : pairProof(a.proof, b.proof), individual: [], nodes: [], fusions: publicationSafety ? [] : [...new Set([...a.proof.fusionIds, ...b.proof.fusionIds])], canonical: [], relations: [] });
  const L = (text: string, source: Source, application: Line["application"] = "CONDITIONAL_APPLICATION"): Line => ({ text, source, application });
  const pool = { personA: pairReleaseSources(views.personA), personB: pairReleaseSources(views.personB) };
  function take(slot: "personA" | "personB", preferred: string[], avoid: PairReleaseSource[] = [], risk = false) {
    const matching = pool[slot].filter(r => preferred.includes(r.material.axis));
    return [...(matching.length ? matching : pool[slot])].sort((x, y) => Number(y.candidate.factBomb === risk) - Number(x.candidate.factBomb === risk)
      || Number(avoid.some(r => r.material.axis === x.material.axis)) - Number(avoid.some(r => r.material.axis === y.material.axis))
      || Number(y.candidate.rank === "SIGNATURE") - Number(x.candidate.rank === "SIGNATURE")
      || y.candidate.priorityScore - x.candidate.priorityScore || y.atom.weight - x.atom.weight
      || preferred.indexOf(x.material.axis) - preferred.indexOf(y.material.axis))[0];
  }
  const rows = (["personA", "personB"] as const).map(slot => {
    const core = pool[slot].find(r => !r.candidate.factBomb && r.candidate.sourceType === "PERSONAL_RESONANCE" && r.candidate.independentFamilies.length >= 2) ?? pool[slot].find(r => !r.candidate.factBomb && r.atom.metadata?.isDayMaster) ?? take(slot, ["AUTONOMY", "RELATION_STYLE", "EXPRESSION"]);
    const need = take(slot, ["BOUNDARY", "RECOVERY_NEED", "STABILITY"], core ? [core] : []);
    const gift = take(slot, ["CARE", "DUTY", "SOCIAL_ATTUNEMENT"], [core, need].filter((r): r is PairReleaseSource => !!r));
    return { slot, p: people[slot], core, need, gift, risk: take(slot, ["COMMUNICATION_STYLE", "EXPRESSION", "AUTONOMY"], [core, need, gift].filter((r): r is PairReleaseSource => !!r), true) };
  });
  function root(slot: "personA" | "personB", r: PairReleaseSource): Source {
    return register({ id: `${people[slot].personId}:${r.candidate.id}:${r.atom.id}:${r.material.axis}`, candidateId: r.candidate.id, proof: { ...emptyProof, sourceRefs: [r.candidate.sourceId, r.atom.id, `person:${people[slot].personId}`] },
      individual: [r.atom.id], nodes: [], fusions: [], canonical: [], relations: [], subject: people[slot].personId, slot, axis: r.material.axis, sign: r.material.sign });
  }
  function reason(slot: "personA" | "personB", r: PairReleaseSource, application: string): string {
    const key = `${slot}:${r.atom.easyMeaning}`;
    if (rootTerms.has(key)) return `${people[slot].name}님의 ${pairRootName(r)}에서 읽은 성향은 ${application}.`;
    return `${people[slot].name}님의 ${particle(pairRootName(r), "은", "는")} ‘${noun(r.atom.easyMeaning)}’이라는 뜻으로, ${application}.`;
  }
  function node(slot: "personA" | "personB", axis?: SemanticAxis, distinctOpening = false) {
    const domains = e.category === "love" ? ["LOVE", "RELATIONSHIPS", "COMMUNICATION", "IDENTITY"] : e.category === "marriage" ? ["MARRIAGE", "RELATIONSHIPS", "COMMUNICATION", "IDENTITY"] : [...professionalDomains, "COMMUNICATION", "RELATIONSHIPS", "IDENTITY"];
    return views[slot].profiles.mbti.contributions.flatMap(c => {
      const n = views[slot].nodes.find(n => n.id === c.sourceNodeId && n.classification === "SCORING_SEMANTIC" && domains.includes(n.sourceDomain!) && n.id.endsWith(":plainKo"));
      const action = n && (reviewedMbtiBehavior(n) ?? mbtiHumanBehavior(c.axis, c.rawValue));
      const openingAction = distinctOpening && draft.chapters.some(c => c.paragraphs.some(p => p.sentences.some(s => s.text.includes(action ?? ""))));
      return n && action && !openingAction ? [{ n, axis: c.axis, sign: Math.sign(c.rawValue), action }] : [];
    }).sort((x, y) => Number(y.axis === axis) - Number(x.axis === axis)
      || Number(draft.chapters.some(ch => ch.paragraphs.some(p => p.sentences.some(s => s.mbtiSourceNodeIds.includes(x.n.id)))))
        - Number(draft.chapters.some(ch => ch.paragraphs.some(p => p.sentences.some(s => s.mbtiSourceNodeIds.includes(y.n.id))))) || domains.indexOf(x.n.sourceDomain!) - domains.indexOf(y.n.sourceDomain!) || x.n.id.localeCompare(y.n.id))[0];
  }
  function mbti(slot: "personA" | "personB", n: NonNullable<ReturnType<typeof node>>["n"]) {
    return register({ id: `${people[slot].personId}:${n.id}`, proof: { ...emptyProof, sourceRefs: [n.sourcePath] }, individual: [], nodes: [n.id], fusions: [], canonical: [], relations: [], subject: people[slot].personId, slot });
  }
  function relation(r: PairEvidence["relations"][number]) {
    return register({ id: r.identity, proof: { ...emptyProof, sourceRefs: [`compatibilityRelationRules:detectCrossBranchRelations:${r.identity}`] }, individual: [], nodes: [], fusions: [], canonical: [r.identity], relations: [r.identity] });
  }
  function relationDescription(r: PairEvidence["relations"][number]) {
    const position = { year: "년지", month: "월지", day: "일지", hour: "시지" };
    return `${r.refs.map(ref => `${people[ref.person].name}님의 ${position[ref.position]} ${ref.branch}`).join(" 및 ")} 사이의 ${r.labelKo}`;
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
    draft.shortages = draft.shortages.filter(s => s !== `${id}:INSUFFICIENT_DISTINCT_MATERIAL`);
    actual.forEach(l => { used.add(sentenceKey(l.text)); committed.set(l.source.id, (committed.get(l.source.id) ?? 0) + 1);
    });
    for (const row of rows) for (const r of [row.core, row.need, row.gift, row.risk]) if (r && actual.some(l => l.text.includes(pairRootName(r)))) rootTerms.add(`${row.slot}:${r.atom.easyMeaning}`);
    return true;
  }
  draft.chapters = COMPATIBILITY_READER_CHAPTERS.map(c => ({ id: c.id, key: c.key, title: c.title, paragraphs: [] }));
  const [ra, rb] = rows;
  const coreA = ra.core, coreB = rb.core;
  // Facets are noun phrases. Complete legacy seed sentences must never be
  // interpolated into these slots (the former CH09.P1 loss).
  const act = (row: typeof ra) => row.core?.material.act ?? "서로의 생각을 직접 확인하는 방식";
  const gift = (row: typeof ra) => row.gift?.material.gift ?? "할 수 있는 도움을 구체적으로 말하는 태도";
  const need = (row: typeof ra) => row.need?.material.need ?? "원하는 것을 직접 이야기할 시간";
  const own = (row: typeof ra) => row.core ? root(row.slot, row.core) : row.slot === "personA" ? pa : pb;
  add(0, 0, [L(`${A}과 ${B}에게 중요한 첫 질문은 ‘${scene.opening}’입니다`, combined),
    L(`${A} 쪽에서는 ${act(ra)}에 무게가 실립니다`, own(ra), "SOURCE"),
    L(`${B}에게는 ${particle(act(rb), "이", "가")} 자기 뜻을 전하는 출발점입니다`, own(rb), "SOURCE"),
    L(coreA?.material.axis === coreB?.material.axis ? "출발점이 닮았다면 결정이 빨라질 수 있지만, 상대가 이번에도 같은 답을 원하리라고 넘겨짚지는 않는 편이 좋습니다" : `이 차이를 놓치면 한 사람은 이미 마음을 전했다고 여기고 다른 사람은 아직 자기 의견을 넣지 못했다고 느낄 수 있어, ${ctx.focus}부터 맞춰볼 만합니다`, combined)]);
  const mainRelation = harmonic ?? tension;
  if (mainRelation) {
    const s = relation(mainRelation);
    add(0, 1, [L(`두 원국의 연결 중 먼저 볼 것은 ${relationDescription(mainRelation)}입니다`, s, "SOURCE"),
      L(RELATION_MEANING[mainRelation.kind], s, "SOURCE"),
      L(`${scene.connection}, 서로의 방식을 지우지 않고 같은 선택에 보태는 연습을 해볼 수 있습니다`, s),
      L("이 연결만으로 관계의 결과를 정할 수는 없으며, 실제로 서로의 의견을 듣고 선택을 나눌 때 도움이 되는 가능성으로 읽습니다", s)]);
  } else add(0, 1, [L("두 사람의 원국 사이에서 특별한 연결의 이름보다 먼저 볼 것은 각자가 편해지는 조건입니다", combined),
    L(`${A}에게는 ${particle(need(ra), "이", "가")} 필요합니다`, ra.need ? root(ra.slot, ra.need) : pa, "SOURCE"),
    L(`${B} 쪽에서는 ${particle(need(rb), "이", "가")} 관계에 남아 있는지 살펴볼 만합니다`, rb.need ? root(rb.slot, rb.need) : pb, "SOURCE"),
    L("특별한 합이 없다고 나쁜 관계인 것은 아니며, 원하는 도움과 어려운 부탁을 구체적으로 나누는 행동이 두 사람의 실제 호흡을 보여줍니다", combined)]);
  const na = node("personA"), nb = node("personB");
  if (na && nb) add(0, 2, [L(`${A}의 ${a.mbti} 선호에서는 ${na.action}`, mbti("personA", na.n), "SOURCE"),
    L(`${B}의 ${b.mbti} 쪽에서는 ${nb.action}`, mbti("personB", nb.n), "SOURCE"),
    L(na.axis === nb.axis && na.sign === nb.sign ? "이 부분에서 닮은 반응이 보여도 지금 원하는 도움의 양이나 감당할 수 있는 시간까지 같지는 않습니다" : "관심을 보내는 방식과 관심을 알아보는 방식이 다를 수 있어, 내가 해준 것보다 상대가 무엇을 받았는지 물어보는 편이 좋습니다", combined),
    L("표현을 받았다는 신호를 어떤 말이나 행동으로 보내면 좋은지도 정하면, 유형의 차이를 구체적인 대화로 바꿀 수 있습니다", combined)]);
  else {
    add(0, 2, [L(`${!a.mbti && !b.mbti ? "두 사람의" : !a.mbti ? A + "의" : B + "의"} MBTI가 알려지지 않아 유형으로 마음을 짐작하기보다 직접 반응을 확인할 필요가 있습니다`, combined),
      L(`${A}에게는 ${withKoreanParticle(`‘${act(ra)}’`, "subject")} 익숙할 수 있지만, 그것이 상대도 편하다는 뜻은 아닙니다`, own(ra)),
      L(`${B} 쪽에서도 ${withKoreanParticle(`‘${act(rb)}’`, "subject")} 이번 상황에 맞는지 먼저 살필 수 있습니다`, own(rb)),
      L("대화를 끝내기 전에 답을 바로 원하는지 정리할 시간을 원하는지 나눠보면, 유형을 몰라도 필요한 신호를 찾을 수 있습니다", combined)]);
    const p = draft.chapters[0].paragraphs.find(p => p.id === "CH01.P3");
    if (p) p.purpose = "유형을 모를 때 확인할 두 사람의 반응";
  }
  const index = pair.canonicalIndex;
  const positiveFactors = [...new Set(index.scores.flatMap(s => s.factors.filter(f => f.value > .01).map(f => f.factor)))].slice(0, 2);
  const adjustingFactors = [...new Set(index.scores.flatMap(s => s.factors.filter(f => f.value < -.01).map(f => f.factor)))].slice(0, 2);
  const indexSource = register({ id: `compatibility-index:${index.version}`, proof: { ...emptyProof, sourceRefs: [...new Set([`compatibilityIndex:${index.version}`, ...index.scores.flatMap(score => score.factors.flatMap(f => f.sources))])] }, individual: [], nodes: [], fusions: [], canonical: [], relations: [] });
  add(0, 3, [L(`${A}의 ${particle(gift(ra), "과", "와")} ${B}의 ${particle(gift(rb), "은", "는")} 함께할 때 쓸 수 있는 서로의 자원입니다`, combined),
    L(`앞의 지수에서 ${positiveFactors.length ? `${positiveFactors.join("·")}은 좋은 연결로 반영했습니다` : "확인된 가산 근거가 없는 부분은 중립으로 남겼습니다"}${adjustingFactors.length ? `; ${adjustingFactors.join("·")}에서는 조율할 조건도 함께 보았습니다` : "; 자료가 적다는 이유로 단점을 만들어내지는 않습니다"}`, indexSource, "SOURCE"),
    L("이 지수는 명리·MBTI의 연결과 반응 차이를 묶은 상징적 해석이며, 관계의 성공 확률이나 실제 행동의 평가가 아닙니다", indexSource, "SOURCE")]);


  function fusionGift(row: typeof ra, c: number) {
    const v = views[row.slot];
    for (const r of pool[row.slot]) {
      const f = [...v.profiles.fusion.complements, ...v.profiles.fusion.reinforce, ...v.profiles.fusion.tensions].find(f => f.id === r.candidate.sourceId && f.myeongli.side.axis === r.material.axis && f.myeongli.side.direction === r.material.sign);
      if (!f || r.candidate.sourceType !== "FUSION" || f.type === "TENSION") continue;
      const n = v.profiles.mbti.contributions.find(n => f.mbti.sourceNodeIds.includes(n.sourceNodeId) && n.axis === f.mbti.side.axis && n.rawValue * f.mbti.side.direction > 0 && v.nodes.some(x => x.id === n.sourceNodeId && [...professionalDomains, "LOVE", "MARRIAGE", "COMMUNICATION", "RELATIONSHIPS", "IDENTITY"].includes(x.sourceDomain!)));
      const action = n && mbtiHumanBehavior(n.axis, n.rawValue);
      if (!n || !action) continue;
      const base = root(row.slot, r), s = register({ ...base, id: `${base.id}:fusion:${f.id}`, nodes: [n.sourceNodeId], fusions: [f.id], proof: { ...base.proof, fusionIds: [f.id], sourceRefs: [...base.proof.sourceRefs, f.id, n.sourceNodeId] } });
      const surface = f.type === "REINFORCE" ? REINFORCE_OUTCOMES[f.myeongli.side.axis] ?? humanOutcome(f.myeongli.side.axis, f.myeongli.side.direction)! : fusionHumanSurface(r.candidate) ?? f.sourceDescription;
      if (used.has(sentenceKey(sentences(surface)[0]))) continue;
      return add(c, 2, [L(reason(row.slot, r, publicationSafety && c === 2 ? "상대의 기대와 본인이 보탤 수 있는 도움을 구분해볼 바탕입니다" : "가까운 사람에게 건넬 강점의 바탕입니다"), base, "SOURCE"),
        L(`${row.p.name}님의 ${row.p.mbti} 선호에서도 ${action}`, mbti(row.slot, v.nodes.find(x => x.id === n.sourceNodeId)!), "SOURCE"),
        L(sentences(surface)[0], s),
        L(c === 1 ? `${scene.gift}, ${row.p.name}님이 할 수 있는 도움과 상대가 원하는 도움을 맞춰보면 이 장점을 덜 소모하면서 쓸 수 있습니다` : `${row.p.name}님이 상대를 챙기면서 자기 수고도 알릴 수 있다면, 배려가 당연한 역할이 되어 혼자 지치는 상황을 줄일 수 있습니다`, s)]);
    }
    return false;
  }
  for (const [i, row] of rows.entries()) {
    const { slot, p, core, need, gift, risk } = row, other = rows[1 - i], P = `${p.name}님`, Q = `${other.p.name}님`, c = i + 1;
    draft.chapters[c].title = `${p.name}님은 이 관계에서 어떤 사람인가`;
    if (core) {
      const s = root(slot, core), n = node(slot, core.material.axis, publicationSafety);
      const lines = [L(i === 0 ? `${P}의 관계 성향은 ${particle(core.material.act, "을", "를")} 중심으로 살펴볼 수 있습니다` : `${P}에게서 먼저 읽을 면은 ${core.material.act}입니다`, s, "SOURCE"),
        L(reason(slot, core, i === 0 ? "상대와 함께 정할 때도 자신의 기준이 생기는 이유를 보여줍니다" : "상대에게 다가가고 자기 뜻을 지키는 바탕이 됩니다"), s, "SOURCE")];
      if (n) lines.push(L(i === 0 ? `${p.mbti}의 선호를 함께 보면 ${n.action}` : `${P}의 ${p.mbti} 선호에서 함께 살필 반응도 있습니다: ${humanOutcome(n.axis, n.sign)}`, mbti(slot, n.n), "SOURCE"));
      else lines.push(L(publicationSafety && p.mbti ? `유형으로 설명할 별도 근거가 부족한 부분은 ${P}이 직접 편한 대화 순서와 속도를 알려주는 편이 좋습니다` : i === 0 ? "유형보다 지금 원하는 대화의 순서와 속도를 직접 알려주는 편이 상대에게도 도움이 됩니다" : "MBTI를 모르는 상태에서는 어떤 반응이 편한지 직접 듣고, 짧은 대답만으로 마음을 정해두지 않는 편이 좋습니다", s));
      lines.push(L(i === 0 ? `${Q}이 ${particle(act(other), "을", "를")} 중요하게 여긴다는 점까지 함께 보면, 자기 기준을 전하는 것과 상대가 받아들일 준비를 하는 것은 다른 과정임을 알 수 있습니다` : `${Q}에게 익숙한 ${particle(act(other), "을", "를")} 함께 생각하면, ${P}의 편안함만으로 둘의 대화가 끝났다고 여기기는 어렵습니다`, own(other)));
      add(c, 0, lines);
    }
    if (need) { const m = need.material, s = root(slot, need); add(c, 1, [
      L(publicationSafety && i === 1 ? `${P}이 ${Q}의 제안을 받아들일 때도 ${withKoreanParticle(`‘${m.need}’`, "subject")} 충족되는지 따로 확인할 필요가 있습니다` : `${P}에게 ${particle(m.need, "은", "는")} 편하게 자기 의견을 내기 위한 조건입니다`, s, "SOURCE"),
      L(reason(slot, need, i === 0 ? "어떤 상황에서 상대를 덜 경계하고 만날 수 있는지 설명해줍니다" : "억지로 맞추기보다 자기 의견을 편하게 낼 조건을 보여줍니다"), s, "SOURCE"),
      L(i === 0 && e.category === "parentChild" ? `부모 ${P}은 이 필요를 자녀에게 맡기기보다 성인에게 구할 지원과 스스로 쉴 시간을 챙기는 편이 좋습니다` : i === 0 && e.category === "managerReport" ? `상사 ${P}이 원하는 보고의 기준을 먼저 설명하면, 팀원 ${Q}이 기대를 눈치로 맞히는 일을 줄일 수 있습니다` : i === 0 ? `${scene.need}, ${P}이 꼭 필요한 조건과 조정할 수 있는 조건을 나눠 말하면 ${Q}도 구체적으로 응답할 수 있습니다` : `${Q}의 제안을 듣는 ${P}은 무엇이 편하고 어디부터 어려운지 알려줄 수 있으며, 찬반만 답할 때보다 함께 바꿀 부분이 잘 보입니다`, s),
      L(i === 0 ? "원하는 것을 모두 받아달라는 요구와 필요한 것을 설명하는 일은 다르며, 어려운 조건을 미리 말해야 함께 바꿀 방법도 보입니다" : "괜찮다는 답을 오래 유지하는 것보다 감당하기 어려워지는 지점을 일찍 알리는 편이, 상대에게도 약속을 지킬 기회를 줍니다", s)]); }
    if (!fusionGift(row, c) && gift) { const m = gift.material, s = root(slot, gift); add(c, 2, [
      L(publicationSafety && i === 1 && m.gift === rows[0].gift?.material.gift ? `${P}은 ${withKoreanParticle(`‘${m.gift}’`, "object")} 일방적인 호의로 쓰기보다 ${Q}이 원하는 도움을 확인하는 데 활용해볼 수 있습니다` : `${P}이 관계에 보탤 수 있는 장점은 ${m.gift}입니다`, s, "SOURCE"),
      L(reason(slot, gift, i === 0 ? "함께할 일을 나누는 데 쓸 수 있는 개인적인 자원입니다" : "상대의 빈자리를 전부 떠맡지 않고도 기여할 수 있는 바탕입니다"), s, "SOURCE"),
      L(i === 0 ? `${scene.gift}, ${Q}이 혼자 해결하기 어려운 부분을 말하면 ${P}은 자신이 가능한 몫을 골라 보탤 수 있습니다` : `${P}이 가능한 도움을 먼저 말하고 ${Q}이 필요한 부분을 고르면, 막연히 잘해주려는 수고를 실제로 쓸 곳에 나눌 수 있습니다`, s),
      L(i === 0 ? "상대의 일을 전부 대신하기보다 도움이 필요한 지점 하나를 함께 끝내면, 호의가 이어질 만큼의 여유도 남습니다" : "받은 도움을 알아주는 말이 돌아오면 혼자 더 챙겨야 한다는 부담을 덜 수 있으며, 도움이 필요 없는 때도 편하게 알릴 수 있습니다", s)]); }
    if (risk) { const m = risk.material, s = root(slot, risk); add(c, 3, [
      L(i === 0 ? `${P}의 성향이 지나치게 쓰일 때 조심할 부분은 ${m.risk}입니다` : `${P}에게 주의할 질문은 ‘${m.risk}’ 때문에 ${Q}의 뜻을 놓치고 있지는 않은지입니다`, s),
      L(i === 0 ? `${particle(m.act, "이", "가")} 한 가지 정답이 되면, ${Q}이 다른 사정을 설명할 자리가 좁아질 수 있습니다` : `${P}이 ${particle(m.act, "을", "를")} 유일한 기준으로 삼으면, 다른 조건을 말하는 ${Q}의 반응이 거슬리게 들릴 수 있습니다`, s),
      L(i === 0 ? `${P}이 편하게 만들었다고 여기는 순간에도 ${Q}은 아직 의견을 묻지 않았다고 느낄 수 있어, 결과를 보여주기 전에 참여할 자리를 남길 필요가 있습니다` : `${Q}의 반응을 다 읽었다고 여기고 설명을 생략하면, ${P}의 배려도 상대에게는 이미 결론이 난 신호처럼 보일 수 있습니다`, s),
      L(i === 0 ? `${P}에게는 ‘${m.adjust}’를 권하며, 상대가 실제로 대답할 수 있는 여유까지 남기는 것이 중요합니다` : `${P}이 ‘${m.adjust}’를 해본 뒤 ${Q}이 편하게 의견을 보태는지 살피면, 의도가 전달되는 방식도 조금씩 고칠 수 있습니다`, s)]); }
  }
  if (shared) { const s = comparison(shared), m = PAIR_RELEASE_FACETS.find(m => m.axis === shared.axis && m.sign === shared.personA.direction); add(3, 0, [
    L(m ? `두 사람에게 함께 기대해볼 장점은 ${m.gift}입니다` : `두 사람에게 공통으로 보이는 행동은 이렇습니다: ${humanOutcome(shared.axis, shared.personA.direction)}`, s, "SOURCE"),
    L(`${scene.joint}, 서로 무엇을 기대하는지 설명하는 시간이 줄어들 수 있습니다`, s),
    L("공통점의 좋은 쓰임은 늘 같은 답을 내는 데보다, 상대가 중요하게 보는 질문을 빠뜨리지 않는 데 있습니다", s),
    L("둘이 모두 익숙하게 넘기는 부분이 있다면 다른 의견도 한 번 들어보는 편이, 닮은 장점이 같은 실수로 굳는 것을 막아줍니다", s)]); }
  else add(3, 0, [L(`${A}과 ${B}이 같은 일을 잘해야만 함께할 수 있는 것은 아닙니다`, combined),
    L(`${A}의 ${particle(gift(ra), "은", "는")} 함께할 일에 보탤 한 가지 자원입니다`, ra.gift ? root(ra.slot, ra.gift) : pa),
    L(`${B}에게 있는 ${particle(gift(rb), "은", "는")} 그와 나란히 살펴볼 다른 기여입니다`, rb.gift ? root(rb.slot, rb.gift) : pb),
    L("공통점을 찾는 데만 힘을 쓰기보다 어떤 부분을 서로 맡길 수 있는지 나누면, 다름을 유지하면서도 같은 결과에 힘을 보탤 수 있습니다", combined)]);
  const complement = canonicalBlocks.find(b => b.id === "element-complement");
  if (complement && pair.complement.element) {
    const s = asset(complement);
    add(3, 1, [...sentences(complement.text).slice(0, 3).map(text => L(text, s)), L("오행의 차이는 서로 다른 방식을 경험해보는 상징적 단서이며, 상대가 부족한 부분을 대신 책임져야 한다는 뜻은 아닙니다", s)]);
  } else add(3, 1, [L("서로를 보완하는 방법은 한 사람이 없는 능력을 상대에게서 얻는 그림에만 있지 않습니다", combined),
    L(`${A} 쪽의 ${particle(act(ra), "과", "와")} ${B} 쪽의 ${particle(act(rb), "을", "를")} 같은 선택의 서로 다른 단계에 놓아볼 수 있습니다`, combined),
    L("먼저 제안한 사람이 결론까지 독점하지 않고 다른 사람이 조건을 보탤 자리를 남기면, 시작과 점검을 번갈아 맡을 수 있습니다", combined),
    L("둘이 한 일에서 시작을 연 사람과 빠진 조건을 찾은 사람의 몫을 따로 알아주면, 다음에도 서로 다른 강점을 꺼내기 편해집니다", combined)]);
  add(3, 2, [L(possibilities[0], combined),
    L(`${A}이 해볼 수 있는 기여는 ${gift(ra)}입니다`, ra.gift ? root(ra.slot, ra.gift) : pa),
    L(`${B}의 ${particle(gift(rb), "이", "가")} 이어지면, 한쪽이 혼자 감당하지 않아도 함께 끝낼 여지가 생깁니다`, rb.gift ? root(rb.slot, rb.gift) : pb),
    L(possibilities[1], combined)]);
  add(3, 3, [L(possibilities[2], combined),
    L(`${A} 쪽에서는 ‘${ra.need?.material.adjust ?? "가능한 도움과 어려운 부탁을 나눠 말하기"}’로 기여할 범위를 살펴볼 수 있습니다`, ra.need ? root(ra.slot, ra.need) : pa),
    L(`${B}도 ‘${rb.need?.material.adjust ?? "원하는 것과 감당할 수 있는 것을 함께 말하기"}’를 해보면, 함께하는 일이 의무만으로 굳는 것을 줄일 수 있습니다`, rb.need ? root(rb.slot, rb.need) : pb),
    L(ctx.future, combined)]);

  for (const [i, slot] of (["aToB", "bToA"] as const).entries()) {
    const from = rows[i], to = rows[1 - i], d = e.directions[slot], P = `${from.p.name}님`, Q = `${to.p.name}님`, c = i + 4;
    draft.chapters[c].title = `${from.p.name}님이 ${to.p.name}님에게 주는 영향`;
    const ds = register({ id: d.relationId, proof: { ...emptyProof, sourceRefs: [`compatibilityRelationRules:getCrossTenGodRelation:${d.relationId}`, `target-viewer:${to.p.personId}`] },
      individual: [], nodes: [], fusions: [], canonical: [d.relationId], relations: [], subject: d.subjectPerson, target: d.targetPerson, direction: d.relationId });
    const god = d.receivedTenGod?.tenGodKo;
    const repeatedGod = i === 1 && e.directions.aToB.receivedTenGod?.tenGodKo === god;
    if (god && godEffects[god]) add(c, 0, [L(`${Q}의 일간 ${d.receivedTenGod!.viewerDayStem} 기준에서 ${P}의 일간 ${d.receivedTenGod!.targetDayStem}에 해당하는 십성은 ${god}입니다`, ds, "SOURCE"),
      L(repeatedGod ? `${P}이 건네는 같은 ${god} 자극도 받는 ${Q} 쪽에서는 ${godEffects[god]}` : `${P}이 ${Q}에게 주는 ${god} 자극은 이렇게 읽습니다: ${PAIR_TEN_GOD_APPLICATIONS[god][0]}`, ds),
      L(`${P}이 보탤 힘은 ${act(from)}입니다`, own(from)),
      L(repeatedGod ? `${Q}은 ${withKoreanParticle(`‘${act(to)}’`, "object")} 바탕으로 자기 답을 찾을 수 있으며, ${P}의 기여가 이 과정을 대신하지 않을 때 함께 고를 여지가 남습니다` : `이를 작은 장면으로 옮겨 보면, ${PAIR_TEN_GOD_APPLICATIONS[god][1]}`, repeatedGod ? own(to) : ds),
      L(i === 0 ? `${Q}에게 필요한 ${withKoreanParticle(`‘${need(to)}’`, "object")} 남겨야 상대도 자기 뜻으로 참여할 수 있습니다` : `이때 ${Q}의 ${withKoreanParticle(`‘${to.need?.material.gift ?? act(to)}’`, "topic")} 받은 기여를 자기 방식으로 이어갈 또 다른 힘이 될 수 있습니다`, to.need ? root(to.slot, to.need) : own(to))]);
    if (from.gift && to.core) { const s = root(from.slot, from.gift), ts = root(to.slot, to.core), receiver = repeatedGod ? node(to.slot, to.core.material.axis, true) : undefined; add(c, 1, [
      L(`${scene.influence}, ${P}의 ${particle(from.gift.material.gift, "이", "가")} ${Q}에게 도움이 될 수 있습니다`, s),
      L(i === 0 ? `${Q}에게 익숙한 것은 ${act(to)}이며, 상대의 도움을 받아도 이 방식으로 직접 참여할 몫은 남겨둘 만합니다` : `${Q}은 ${particle(act(to), "을", "를")} 바탕으로 자기 답을 찾는 편이므로, ${P}의 기여를 받아도 선택을 직접 확인할 여지는 필요합니다`, ts, "SOURCE"),
      L(e.category === "parentChild" && i === 1 ? `자녀 ${P}의 시도를 보며 부모 ${Q}이 새 관점을 배울 수 있지만, 부모의 어려움을 해결하는 역할까지 자녀에게 맡기지는 않아야 합니다` : e.category === "managerReport" && i === 1 ? `팀원 ${P}의 제안은 상사 ${Q}의 판단에 정보를 더해줄 수 있으며, 최종 권한과 책임이 팀원에게 넘어가는 것은 아닙니다` : i === 0 ? `${P}이 가능한 도움을 먼저 설명하고 ${Q}이 쓸 부분을 고르면, 서로의 좋은 면을 같은 방식으로 바꾸지 않아도 함께 시도할 폭이 넓어집니다` : `${Q}이 평소 혼자 확인하던 부분에 ${P}의 관점을 보태보면, 도움을 받으면서도 최종 선택은 직접 할 수 있습니다`, s),
      L(repeatedGod ? receiver ? `이 도움을 받는 ${Q}의 ${to.p.mbti} 선호에는 또 다른 면도 있습니다: ${receiver.action}` : `${Q}에게 ${withKoreanParticle(`‘${need(to)}’`, "subject")} 남아 있을 때, ${P}의 기여도 자기 힘으로 다음 선택을 이어갈 여유가 됩니다` : d.receivedTenGod && PAIR_TEN_GOD_APPLICATIONS[d.receivedTenGod.tenGodKo] ? `${from.p.name}님이 건네는 ${d.receivedTenGod.tenGodKo} 자극에서 함께 살필 조건도 있습니다: ${PAIR_TEN_GOD_APPLICATIONS[d.receivedTenGod.tenGodKo][2]}` : `${P}이 보탠 뒤 ${Q}이 혼자 이어갈 부분까지 정하면, 다음에도 같은 도움을 기다려야 하는 부담을 줄일 수 있습니다`, repeatedGod ? receiver ? mbti(to.slot, receiver.n) : to.need ? root(to.slot, to.need) : own(to) : ds)]); }
    if (from.risk && to.need) { const rs = root(from.slot, from.risk), ns = root(to.slot, to.need), n = node(to.slot, to.need.material.axis); add(c, 2, [
      L(`${scene.burden}, ${P}의 ${particle(from.risk.material.risk, "이", "가")} ${Q}에게는 부담으로 커질 수 있습니다`, rs),
      L(i === 0 ? `${Q}에게 필요한 ${particle(to.need.material.need, "이", "가")} 빠지면, 도움의 크기보다 자신이 참여할 자리가 있는지를 먼저 묻게 되기 때문입니다` : `${Q}은 ${particle(to.need.material.need, "을", "를")} 중요하게 여기는 만큼, 선의로 건넨 행동도 자신의 기준을 무시한다고 느끼면 받아들이기 어려울 수 있습니다`, ns),
      n ? L(i === 0 ? `이 상황에서 ${Q}의 ${to.p.mbti} 선호를 함께 살피면 ${n.action}` : `${Q}의 ${to.p.mbti} 선호를 이 상황에 놓으면 ${humanOutcome(n.axis, n.sign)}`, mbti(to.slot, n.n), "SOURCE") : L(i === 0 ? `${Q}이 불편해하는 지점을 듣기 전에는, 조용한 반응을 동의나 거절 중 하나로 대신 정하지 않는 편이 좋습니다` : `${Q}의 답이 짧다면 시간이 필요한지 설명이 부족한지부터 물어볼 수 있으며, 유형을 몰라도 지금의 요구는 직접 확인할 수 있습니다`, ns),
      L(e.category === "parentChild" && i === 1 ? "부모의 불안을 자녀가 달래야 한다는 요구로 바꾸기보다, 걱정할 조건과 안전 기준을 어른이 설명하는 일이 우선입니다" : i === 0 ? "이때 상대가 고마워할 줄 모른다고 결론을 내리면, 호의의 방향을 고칠 기회까지 닫히게 된다는 점을 조심할 만합니다" : "불편하다는 반응을 곧바로 도움 자체를 거절한 뜻으로 읽기보다, 어떤 부분을 스스로 하고 싶은지 물어야 실제 경계를 알 수 있습니다", rs)]); }
    if (from.risk && to.need) { const rs = root(from.slot, from.risk), ns = root(to.slot, to.need); add(c, 3, [
      L(i === 0 ? `${P}이 영향을 건네기 전에 시도할 일은 ‘${from.risk.material.adjust}’입니다` : `${P}은 ‘${from.risk.material.adjust}’부터 시작해 ${Q}에게 어떤 도움이 필요한지 들을 수 있습니다`, rs),
      L(i === 0 ? `${Q}에게 ${particle(to.need.material.need, "을", "를")} 남기는 방법을 물으면, 호의를 줄이기보다 받아들일 수 있는 형태로 바꿀 수 있습니다` : `${Q}이 바라는 ${particle(to.need.material.need, "을", "를")} 건드리지 않도록 도움을 제안하면, 거절도 관계를 끊는 말 대신 범위를 맞추는 대답이 됩니다`, ns),
      L(e.category === "parentChild" ? i === 0 ? "부모는 해도 되는 범위와 위험할 때 도울 방법을 설명하고, 자녀가 직접 고를 작은 선택을 남길 수 있습니다" : publicationSafety ? "자녀는 해보고 싶은 일과 필요한 도움을 직접 말할 수 있으며, 부모는 위험과 지원 방법을 설명하되 조언을 건네는 일과 자녀의 결정을 대신하는 일을 구분해야 합니다" : "자녀는 해보고 싶은 일과 도움이 필요한 곳을 말할 수 있으며, 부모가 안전과 최종 결정의 책임을 맡아야 합니다" : e.category === "managerReport" ? i === 0 ? "상사는 꼭 지킬 결과와 팀원이 바꿔도 되는 방법을 구분해 전달해야, 자율성을 주었다는 말이 실제 권한이 됩니다" : "팀원은 직접 판단한 부분과 상사의 결정이 필요한 부분을 나눠 보고하면, 제안의 책임 범위를 분명하게 지킬 수 있습니다" : i === 0 ? `${P}이 제안을 확정하기 전에 ${Q}이 수정하거나 거절할 수 있는 시점을 정해두면, 서로의 속도가 달라도 함께 판단할 자리가 생깁니다` : `${P}은 무엇을 해주겠다는 말 뒤에 ${Q}이 직접 고를 부분도 밝혀둘 수 있으며, 답이 늦어도 준비한 도움부터 밀어붙이지 않는 편이 좋습니다`, rs),
      L(i === 0 ? `${Q}이 자기 답을 낼 수 있을 때 ${P}의 자극도 따르라는 요구보다 새로운 선택의 계기로 남습니다` : `${Q}이 이번 제안에서 고른 부분과 보류한 부분을 알려주면, ${P}도 다음에는 필요한 범위에 맞춰 의견을 건넬 수 있습니다`, ds)]); }
  }
  if (friction) { const s = comparison(friction); add(6, 0, [
    L(`${scene.conflict} 두 사람의 다른 첫 반응이 드러날 수 있습니다`, s),
    L(`${A} 쪽에서는 ${humanOutcome(friction.axis, friction.personA.direction)}`, s, "SOURCE"),
    L(`${B}에게는 다른 방향도 있습니다: ${humanOutcome(friction.axis, friction.personB.direction)}`, s, "SOURCE"),
    L(ctx.difference, s)]); }
  else add(6, 0, [L("성향의 뚜렷한 대립보다 서로의 여건을 잘못 짐작하는 순간을 먼저 살펴볼 만합니다", combined),
    L(`${scene.conflict} 같은 기준을 중요하게 여겨도 감당할 수 있는 시간과 힘은 다를 수 있습니다`, combined),
    L(`${A}이 가능한 몫과 ${B}이 기대하는 몫을 따로 말해보면, 마음의 차이와 상황의 차이를 나눠볼 수 있습니다`, combined),
    L("평소 잘 맞는다는 이유로 어려운 부탁도 괜찮으리라고 여기면, 거절하지 못한 작은 부담이 뒤늦게 드러날 수 있습니다", combined)]);
  if (tension) { const s = relation(tension); add(6, 1, [
    L(`갈등을 읽을 명리 단서는 ${relationDescription(tension)}입니다`, s, "SOURCE"),
    L(mainRelation?.identity === tension.identity ? `앞에서 본 ${tension.labelKo}의 긴장은 같은 일을 두고 먼저 채우고 싶은 조건이 엇갈리는 순간에 살펴볼 수 있습니다` : RELATION_MEANING[tension.kind], s, "SOURCE"),
    L(`${ctx.escalation}에는 작은 행동도 누구의 기준이 우선인지 따지는 문제로 번질 수 있습니다`, s),
    L("이 관계가 불화나 이별을 예고하는 것은 아니며, 말하지 않은 기대와 실제 합의가 다른 지점을 찾아 조정하는 데 쓸 수 있는 단서입니다", s)]); }
  else add(6, 1, [L("겉으로 의견이 잘 맞는 날에도 정하지 않은 기대는 남을 수 있습니다", combined),
    L(`${scene.conflict} 서로가 당연하다고 여겼던 약속부터 확인해볼 만합니다`, combined),
    L("먼저 한 사람의 성격을 문제로 삼으면 실제로 누가 무엇을 몰랐는지 빠지고, 다음에도 같은 빈칸이 남습니다", combined),
    L("큰 충돌의 이름을 찾기보다 설명하지 않은 조건 하나를 찾아내는 일이, 이번 불편을 더 작고 고칠 수 있는 문제로 만들어줍니다", combined)]);
  add(6, 2, [L(`${A}에게 ${particle(act(ra), "이", "가")} 편하다고 해서 ${B}에게도 같은 반응을 요구하면 대화가 막힐 수 있습니다`, own(ra)),
    L(`${B} 역시 ${particle(act(rb), "을", "를")} 반복하는 동안 상대가 무엇을 기다리는지 놓칠 수 있습니다`, own(rb)),
    L("한쪽이 더 설명할수록 다른 쪽은 이미 결론을 강요받는다고 느끼고, 그 침묵을 다시 무성의로 읽는다면 말의 양만 늘어나는 고리가 생깁니다", combined),
    L("이 고리가 생겼을 때에는 누가 먼저 시작했는지 겨루기 전에, 지금 답을 원하는 것인지 이해받기를 원하는 것인지 질문을 좁혀야 합니다", combined)]);
  add(6, 3, [L(`${particle(ctx.escalation, "은", "는")} 멈춰서 확인할 신호입니다`, combined),
    L(`${A} 쪽의 ‘${ra.risk?.material.risk ?? "상대의 뜻을 대신 정하는 행동"}’에 ${B}의 ${withKoreanParticle(`‘${rb.risk?.material.risk ?? "필요한 설명을 미루는 반응"}’`, "subject")} 겹친다면, 서로의 의도보다 자기 방어에 힘을 쓰기 쉽습니다`, combined),
    L("지금의 행동을 예전의 모든 서운함과 묶거나 상대의 사람됨으로 번역하면, 바꿀 수 있는 부탁도 관계 전체를 지키는 시험이 됩니다", combined),
    L("이번에 바꿀 행동을 하나로 제한하고 다른 이야기는 다시 나눌 시간을 잡으면, 대화를 끝내는 것과 문제를 덮는 것을 구분할 수 있습니다", combined)]);
  add(7, 0, [L(`${scene.repair}, 잘못의 크기를 먼저 비교하기보다 무슨 일이 있었는지 한 장면부터 맞춰보는 편이 좋습니다`, combined),
    L("실제로 한 말과 그 말을 듣고 짐작한 뜻을 나누면, 의도는 아니었다는 해명 뒤에 상대가 받은 불편도 남길 수 있습니다", combined),
    L("사과는 마음을 알아달라는 요청에서 끝내기보다 다음에 바꿀 행동과 확인할 때를 함께 정할수록 구체적입니다", combined),
    L(e.category === "parentChild" || e.category === "managerReport" ? "권한을 가진 쪽이 먼저 자신의 결정과 설명을 돌아봐야, 상대가 불이익을 걱정하지 않고 실제 어려움을 말할 수 있습니다" : "서로 같은 잘못을 인정해야만 대화를 시작할 수 있다는 조건을 걸지 않아야, 먼저 꺼낸 어려움도 평가받는 말로 돌아오지 않습니다", combined)]);
  for (const [i, row] of rows.entries()) {
    const other = rows[1 - i], P = `${row.p.name}님`, Q = `${other.p.name}님`, r = row.risk, s = r ? root(row.slot, r) : own(row);
    const repairs = r && PAIR_RELEASE_REPAIR[r.material.axis], repair = repairs?.[r?.material.sign === -1 ? 1 : 0] ?? "실제로 한 말과 상대가 이해한 뜻을 나눠서 확인하기";
    add(7, i + 1, [L(i === 0 ? `${P}이 다툼 뒤 시도할 회복 행동은 ‘${repair}’입니다` : `${P} 쪽에서는 ‘${repair}’부터 해볼 수 있으며, 이해를 고쳤다는 신호를 ${Q}에게도 알려주는 편이 좋습니다`, s),
      L(i === 0 ? `${Q}이 한 말을 요약해 확인하고 자신이 달리 이해한 부분을 나중에 보태면, 해명이 상대의 이야기를 끊는 말로 도착하지 않습니다` : `${Q}의 설명과 동의하기 어려운 부분을 구분해 말하면, 상대의 뜻을 이해하는 일과 무조건 받아들이는 일을 나눌 수 있습니다`, s),
      L(i === 0 ? publicationSafety && e.category === "parentChild" ? "부모는 필요한 지원과 위험을 설명하고 자녀의 의견을 들어야 하며, 나이와 실제 보호 권한을 모른 채 모든 선택을 대신 결정할 수 있다고 여겨서는 안 됩니다" : ctx.ruleA : ctx.ruleB, s),
      L(i === 0 ? "합의한 변화는 다음에 비슷한 상황이 왔을 때 직접 보여주고, 지키기 어려워졌다면 다시 말할 시점을 놓치지 않는 편이 좋습니다" : "조정해본 뒤에도 불편한 부분을 남겨두어야 괜찮다고 끝낸 화해가 반복되지 않으며, 가능한 대안도 함께 고를 수 있습니다", s)]);
  }
  add(7, 3, [L(`${particle(ctx.agreement, "은", "는")} 화해 뒤 확인할 공동 기준이 될 수 있습니다`, combined),
    L("합의에는 무엇을 바꾸는지뿐 아니라 누가 먼저 알리고 언제 다시 살필지까지 넣어야, 마음만 풀린 뒤 같은 문제로 돌아오는 일을 줄일 수 있습니다", combined),
    L("지금 해결하기 어려운 부분은 모른다고 남겨두되 다시 이야기할 시간을 정하면, 침묵을 동의로 대신하는 부담도 덜어집니다", combined),
    L("약속을 지키지 못했을 때 다시 말해도 괜찮은지까지 확인하면, 화해의 기준이 잘못을 숨기라는 압박으로 바뀌지 않습니다", combined)]);
  add(8, 0, [L(`${A}과 ${B}이 오래 함께할 힘은 각자의 장점을 한 사람이 전부 떠맡는 역할로 굳히지 않는 데 있습니다`, combined),
    L(`${A}의 ${particle(gift(ra), "은", "는")} 먼저 보탤 수 있는 몫이며, 매번 책임져야 할 의무는 아닙니다`, ra.gift ? root(ra.slot, ra.gift) : pa),
    L(`${B}이 건넬 수 있는 ${particle(gift(rb), "도", "도")} 그날의 여유를 확인하며 나눌 때 오래 쓰입니다`, rb.gift ? root(rb.slot, rb.gift) : pb),
    L("도움을 준 사람만 기억하기보다 받은 사람이 어떻게 자기 몫을 이어갔는지도 알아주면, 고마움이 한쪽의 빚으로 남지 않을 수 있습니다", combined)]);
  const good = compatibilityGoodCards(e, a, b)[0];
  if (good) {
    const s = asset(good), lines = sentences(good.text).map(text => L(text, s, "SOURCE"));
    if (lines.length < 4) lines.push(L("이 기운은 본인이 활용할 관계 자원이며, 상대가 반드시 나의 귀인이라거나 둘의 미래가 정해졌다는 뜻은 아닙니다", s));
    add(8, 1, lines);
  } else add(8, 1, [L("관계의 좋은 힘을 확인할 때는 특별한 이름만큼 실제로 유지할 수 있는 도움도 중요합니다", combined),
    L(`${A}은 ${particle(need(ra), "을", "를")} 지키면서 어떤 도움을 건넬 수 있는지 말해볼 수 있습니다`, ra.need ? root(ra.slot, ra.need) : pa),
    L(`${B} 쪽에서도 ${particle(need(rb), "을", "를")} 해치지 않는 선을 정하면, 고마운 일과 감당하기 어려운 일을 구분할 수 있습니다`, rb.need ? root(rb.slot, rb.need) : pb),
    L("서로 할 수 있는 몫을 작게라도 꾸준히 확인하는 과정은, 좋은 사이여야 한다는 부담보다 믿을 수 있는 다음 선택을 남겨줍니다", combined)]);
  add(8, 2, [L(`${scene.maintain}, 이전에 편했던 기준도 지금의 여건에 맞는지 다시 볼 필요가 있습니다`, combined),
    L(`${A}이 중요하게 보는 ${particle(need(ra), "과", "와")} ${B}에게 필요한 ${particle(need(rb), "을", "를")} 예전과 같은 양으로 충족할 수 있는지는 새 질문입니다`, combined),
    L("지난번에 고마웠던 일 하나와 앞으로 바꾸고 싶은 일 하나를 나눠보면, 함께 지킨 좋은 점을 버리지 않고도 새 조건을 넣을 수 있습니다", combined),
    L("오래 안다는 이유로 현재의 어려움까지 알고 있다고 여기지 않는 태도가, 변화를 관계가 멀어진 증거로만 받아들이지 않게 해줍니다", combined)]);
  add(8, 3, [L(`${A}의 ${particle(act(ra), "과", "와")} ${B}의 ${particle(act(rb), "은", "는")} 서로에게 같은 답을 요구하는 대신 다음 선택을 넓히는 데 써볼 만합니다`, combined),
    L("잘 맞는다는 말의 힘은 아무 노력도 필요 없다는 안심보다, 차이가 드러났을 때 무엇을 다시 물으면 되는지 아는 데 있습니다", combined),
    L(`${A}과 ${B}이 서로의 다른 반응을 알아가는 동안, 함께하는 방식도 처음의 예상보다 넓어질 수 있습니다`, combined),
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
