import { LOVE_RELEASE_VERSION, LOVE_READER_CHAPTERS, type LoveReleaseDraft, type LoveReleaseSentence } from "./loveReleaseContracts";
import { LOVE_RELEASE_MATERIALS } from "./loveReleaseMaterials";
import { LOVE_RELEASE_CONTEXT } from "./loveReleaseContext";
import { loveReleaseSources, loveSourceName, type LoveReleaseSource } from "./loveReleaseSources";
import type { RelationshipView } from "./relationshipProductView";
import type { NarrativeInput, NarrativeBlock, NarrativeProof, NarrativeState, MaterialPacket } from "./narrativeTypes";
import type { LoveNarrative } from "./loveNarrativeTypes";
import { selectLoveVoice } from "./loveVoices";
import { loveBalance } from "./loveBalance";
import { loveFusionTurn } from "./loveFusionScenes";
import { particle } from "./copyRealizer";
import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { fusionHumanSurface } from "./narrativeHumanSurface";
import { humanOutcome } from "./narrativeHumanOutcome";
import { LOVE_PARENTING_RISK, LOVE_PARENTING_RISK_TRAITS } from "./loveReleaseParenting";
type Refs = { source: string; roots?: string[]; nodes?: string[]; fusion?: string[]; theme: string; material: string; refs: readonly string[]; row?: LoveReleaseSource; recall?: boolean };
type Line = { text: string; refs: Refs };
type Material = (typeof LOVE_RELEASE_MATERIALS)[string];
export const loveSentences = (s: string) => s.match(/[^.!?]+[.!?]+(?:[’”])?|[^.!?]+$/g)?.map(t => t.trim()).filter(Boolean) ?? [];
const terminal = (s: string) => /[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`;
const quote = (s: string) => s.replace(/[.!?]$/, "");
const meaning = (s: string) => quote(s).replace(/입니다$/, "");
/** Independent generation-time edition. No IO, new source inference or paid gate. */
export function renderLoveRelease(input: NarrativeInput, view: RelationshipView, legacy: LoveNarrative, packet: MaterialPacket) {
  const profiles = view.profiles, pool = loveReleaseSources(view), seen = new Set<string>(), used = new Map<string, number>(), usedRoots = new Map<string, number>();
  const chosen: LoveReleaseSource[] = [], terms = new Set<string>();
  const draft: LoveReleaseDraft = { version: LOVE_RELEASE_VERSION, chapters: [], bodyLength: 0, shortages: [] };
  const retained: Record<string, NarrativeProof> = {};
  const state: NarrativeState = { input, packet, pillar: packet.selected.find(m => m.material.category === "dayPillar")!, master: packet.selected.find(m => m.material.category === "dayMaster")!, usedSeeds: new Set(), featureUses: new Map() };
  const voice = selectLoveVoice(state), context = LOVE_RELEASE_CONTEXT[input.context.relationshipStatus];
  let current: LoveReleaseDraft["chapters"][number], main: LoveReleaseSource | undefined, risk: LoveReleaseSource | undefined;
  const refs = (r: LoveReleaseSource, key: string, recall = false): Refs => ({ source: r.candidate.id, roots: [r.atom.id], nodes: [], fusion: [], theme: r.candidate.semanticTheme, material: `love:${r.facet}:${key}`, refs: [r.candidate.sourceId], row: r, recall });
  const termKey = (r: LoveReleaseSource) => r.atom.easyMeaning;
  const applications: Record<string, string> = {
    CH01: "사랑에서 중요하게 여기는 조건의 바탕입니다", CH02: "상대가 내 좋은 면을 알아보는 방식에도 드러날 수 있습니다",
    CH03: "편안한 관계를 고르는 기준과 연결됩니다", CH04: "관심을 주고받는 행동에 적용해 볼 수 있습니다",
    CH05: "가까워진 뒤에 필요한 배려에서도 읽을 수 있습니다", CH06: "한 가지 방식으로만 쓰이면 대화의 부담도 커질 수 있습니다",
    CH07: "공동생활을 선택할 때의 기준으로 옮겨볼 수 있습니다", CH08: "본인의 돌봄 방식에도 조건부로 이어질 수 있습니다",
    CH09: "좋은 관계를 이어가는 자원으로 다시 살펴볼 수 있습니다",
  };
  const reason = (r: LoveReleaseSource) => !terms.has(termKey(r)) ? `${loveSourceName(r.atom)}에서 읽는 ‘${meaning(r.atom.easyMeaning)}’의 의미가 이 성향의 바탕입니다.`
    : `${loveSourceName(r.atom)}에서 읽은 성향은 ${applications[current.id]}.`;
  function add(p: number, lines: Line[]) {
    const contract = LOVE_READER_CHAPTERS.find(c => c.id === current.id)!.paragraphs[p], id = `${current.id}.${contract.id}`;
    const actual = lines.filter(l => l.text?.trim()).map(l => ({ ...l, text: terminal(l.text) }));
    if (actual.length < 3 || actual.length > 5 || actual.some(l => loveSentences(l.text).length !== 1 || seen.has(l.text))) return false;
    const sentences = actual.map((l, i): LoveReleaseSentence => ({ chapterId: current.id, paragraphId: contract.id, sentenceRole: `S${i + 1}`, roleDescription: contract.sentences[i] ?? contract.sentences[3], text: l.text,
      sourceCandidateId: l.refs.source, evidenceIds: [...(l.refs.roots ?? [])], mbtiSourceNodeIds: [...(l.refs.nodes ?? [])], fusionIds: [...(l.refs.fusion ?? [])], semanticTheme: l.refs.theme,
      relationshipStatus: input.context.relationshipStatus, context: current.key,
      provenance: { materialId: l.refs.material, application: l.refs.recall ? "RECALL" : l.refs.row ? "CONDITIONAL_APPLICATION" : "SOURCE", sourceRefs: [...l.refs.refs], ...(l.refs.row ? { axis: l.refs.row.axis, direction: l.refs.row.direction } : {}) } }));
    current.paragraphs.push({ id, purpose: contract.purpose, text: actual.map(l => l.text).join(" "), sentences });
    actual.forEach(l => seen.add(l.text)); return true;
  }
  function eligible(preferred: readonly string[], factBomb: boolean, recall: boolean) {
    return pool.filter(r => r.candidate.factBomb === factBomb && (!recall || chosen.some(s => s.atom.id === r.atom.id && s.facet === r.facet))
      && (recall || (used.get(r.facet) ?? 0) < 6) && !current.paragraphs.some(p => p.sentences.some(s => s.provenance.materialId.startsWith(`love:${r.facet}:`))))
      .sort((a, b) => (current.id === "CH01" && !current.paragraphs.length ? Number(!!b.atom.metadata?.isDayMaster) - Number(!!a.atom.metadata?.isDayMaster) : 0)
        || Number(preferred.includes(b.facet)) - Number(preferred.includes(a.facet)) || (current.id === "CH06" && !current.paragraphs.length ? Number(b.candidate.rank === "SIGNATURE") - Number(a.candidate.rank === "SIGNATURE") || b.candidate.priorityScore - a.candidate.priorityScore : 0)
        || (used.get(a.facet) ?? 0) - (used.get(b.facet) ?? 0)
        || (current.id === "CH01" && !current.paragraphs.length ? (profiles.mbti.contextAxes.love?.[b.axis] ?? 0) * b.direction - (profiles.mbti.contextAxes.love?.[a.axis] ?? 0) * a.direction : 0)
        || Number(b.candidate.sourceType === "PERSONAL_RESONANCE") - Number(a.candidate.sourceType === "PERSONAL_RESONANCE")
        || (profiles.mbti.generalAxes[b.axis] ?? 0) * b.direction - (profiles.mbti.generalAxes[a.axis] ?? 0) * a.direction
        || (usedRoots.get(a.atom.id) ?? 0) - (usedRoots.get(b.atom.id) ?? 0) || b.atom.weight - a.atom.weight || a.candidate.id.localeCompare(b.candidate.id));
  }
  function application(p: number, key: string, make: (m: Material, r: LoveReleaseSource) => string[], preferred: readonly string[] = [], factBomb = false, recall = false) {
    for (const r of eligible(preferred, factBomb, recall)) {
      const lines = make(LOVE_RELEASE_MATERIALS[r.facet], r).flatMap(text => loveSentences(text).map(text => ({ text, refs: refs(r, key, recall) })));
      if (!add(p, lines)) continue;
      used.set(r.facet, (used.get(r.facet) ?? 0) + 1); usedRoots.set(r.atom.id, (usedRoots.get(r.atom.id) ?? 0) + 1); terms.add(termKey(r)); chosen.push(r); return r;
    }
    draft.shortages.push(`${current.id}.P${p + 1}:NO_INDEPENDENT_${key.toUpperCase()}_MATERIAL`); return undefined;
  }
  function asset(p: number, text: string, proof: NarrativeProof, id: string, lead = "") {
    const lines = loveSentences(text); if (lead && lines.length) lines[0] = `${lead} ${lines[0]}`;
    const nodes = profiles.mbti.sourceNodes.filter(n => (view.nodes.some(v => v.id === n.id) || current.id === "CH08" && n.sourceDomain === "PARENTS")
      && proof.sourceRefs.some(ref => n.id === ref || n.id === `${ref}:plainKo`)).map(n => n.id);
    const source: Refs = { source: `love-asset:${id}`, nodes, fusion: [...proof.fusionIds], theme: id, material: `asset:${id}`, refs: proof.sourceRefs };
    if (!add(p, lines.map(text => ({ text, refs: source })))) return false;
    retained[source.source] = proof; return true;
  }
  function voiceParagraph(p: number, field: "expression" | "attraction" | "partner" | "intimacy" | "repair" | "home", area: "love" | "marriage", lead = "") {
    return !!voice && asset(p, voice[field], voice.basis(area), `voice:${voice.id}:${field}`, lead);
  }
  function fusionParagraph(p: number, kind: "REINFORCE" | "COMPLEMENT" | "TENSION") {
    const row = view.candidates.filter(c => c.sourceType === "FUSION" && c.fusionType === kind && c.mbtiSourceNodeIds.some(id => view.nodes.some(n => n.id === id && ["LOVE", "RELATIONSHIPS", "COMMUNICATION", "MARRIAGE"].includes(n.sourceDomain!))))
      .sort((a, b) => b.priorityScore - a.priorityScore)[0];
    const fusion = row && [...profiles.fusion.reinforce, ...profiles.fusion.complements, ...profiles.fusion.tensions].find(f => f.id === row.sourceId);
    const atom = row && profiles.myeongli.evidence.find(a => row.myeongliEvidenceIds.includes(a.id) && (a.axes[fusion?.myeongli.side.axis ?? "CARE"] ?? 0) * (fusion?.myeongli.side.direction ?? 1) > 0);
    const domains = kind === "REINFORCE" ? ["LOVE", "RELATIONSHIPS"] : ["LOVE", "RELATIONSHIPS", "COMMUNICATION", "MARRIAGE"];
    const node = row && view.nodes.find(n => row.mbtiSourceNodeIds.includes(n.id) && typeof n.value === "string" && n.id.endsWith(":plainKo") && domains.includes(n.sourceDomain!));
    if (row && fusion && atom && node) {
      const source: Refs = { source: row.id, roots: [atom.id], nodes: [node.id], fusion: [fusion.id], theme: row.semanticTheme, material: `fusion:${kind}`, refs: [row.sourceId] };
      const material = Object.values(LOVE_RELEASE_MATERIALS).find(m => m.axes.some(([axis, sign]) => axis === fusion.myeongli.side.axis && sign === fusion.myeongli.side.direction));
      const conclusion = kind === "REINFORCE" && material ? `이 두 모습이 겹치면 ${particle(material.need, "을", "를")} 더 중요하게 느낄 수 있어, 가까운 사람에게도 ${particle(material.act, "이", "가")} 마음을 전하는 통로가 됩니다.`
        : fusionHumanSurface(row) ?? humanOutcome(fusion.myeongli.side.axis, fusion.myeongli.side.direction);
      if (conclusion && add(p, [
        { text: `${particle(loveSourceName(atom), "은", "는")} 이 관계 성향을 설명하는 실제 원국 근거입니다.`, refs: { ...source, nodes: [], fusion: [] } },
        { text: `${loveSourceName(atom)}에 담긴 뜻은 ‘${meaning(atom.easyMeaning)}’입니다.`, refs: { ...source, nodes: [], fusion: [] } },
        { text: `${profiles.mbti.mbtiType}의 관계 자료에서는 ‘${quote(loveSentences(String(node.value))[0])}’의 경향을 함께 살펴볼 수 있습니다.`, refs: { ...source, roots: [], fusion: [] } },
        { text: loveSentences(conclusion)[0], refs: source },
      ])) return;
    }
    const turn = kind !== "REINFORCE" && loveFusionTurn(state, voice?.fusion.ruleId);
    if (turn && asset(p, turn.block.text, turn.block.proof, `fusion-turn:${turn.fusion.ruleId}`)) return;
    if (kind === "REINFORCE" && profiles.mbti.mbtiType) {
      const matches = eligible(["care", "depth", "autonomy"], false, false).map(r => ({ r, node: view.nodes.find(n => n.sourceDomain === "LOVE" && n.id.endsWith(":plainKo") && typeof n.value === "string"
        && profiles.mbti.annotations.some(a => a.sourceNodeId === n.id && (a.axes[r.axis] ?? 0) * r.direction > 0)) }));
      const { r, node } = matches.find(m => m.node) ?? {};
      if (r && node) {
        const source = refs(r, "individual-love-basis"), m = LOVE_RELEASE_MATERIALS[r.facet];
        if (add(p, [
          { text: `${particle(loveSourceName(r.atom), "은", "는")} 사랑에서 나타나는 기본 성향을 읽을 실제 원국 근거입니다.`, refs: source },
          { text: `${loveSourceName(r.atom)}의 ‘${meaning(r.atom.easyMeaning)}’의 의미를 사랑에서의 행동에 연결해 읽습니다.`, refs: source },
          { text: `${profiles.mbti.mbtiType}의 실제 연애 자료에는 ‘${quote(loveSentences(String(node.value))[0])}’의 경향이 있습니다.`, refs: { source: node.id, nodes: [node.id], theme: "LOVE_SOURCE", material: "love:mbti-basis", refs: [node.id] } },
          { text: m.expression, refs: source },
        ])) { chosen.push(r); terms.add(termKey(r)); used.set(r.facet, (used.get(r.facet) ?? 0) + 1); return; }
      }
    }
    application(p, `fusion-${kind.toLowerCase()}-fallback`, (m, r) => [m.style, reason(r), m.private, m.hope], ["depth", "care", "autonomy"]);
  }
  const raw = getMbtiSourceProfile(input.mbti), parenting = raw?.traits?.parenting ?? [];
  function parentParagraph(p: number, index: number, riskSlot = false) {
    const trait = riskSlot ? parenting.find(t => t.id === LOVE_PARENTING_RISK_TRAITS[raw!.type]) : parenting.filter(t => t.plainKo && t.positiveUse)[index];
    const field = riskSlot ? "risk" : p === 1 ? "positiveUse" : "plainKo", text = trait?.[field];
    const node = trait && profiles.mbti.sourceNodes.find(n => n.id === `mbti:${raw!.type}:traits:parenting:${trait.id}:${field}`);
    if (!text || !node || !raw) return false;
    const r = eligible(["care", "duty", "autonomy", "precision"], false, false)[0]; if (!r) return false;
    const m = LOVE_RELEASE_MATERIALS[r.facet];
    const source: Refs = { source: node.id, nodes: [node.id], theme: `OWN_PARENTING:${trait.id}`, material: `parenting:own:${trait.id}:${field}`, refs: [node.id] };
    const lines = riskSlot ? [
      { text: `부모 역할을 맡는다면 ${raw.type}의 양육 자료에서 짚은 ‘${quote(loveSentences(text)[0])}’의 위험을 자기 행동과 대조할 수 있습니다.`, refs: source },
      ...LOVE_PARENTING_RISK[raw.type].map(text => ({ text, refs: source })),
    ] : [
      { text: `양육을 선택한다면 ${raw.type}의 본인 양육 자료에 있는 ‘${quote(loveSentences(text)[0])}’의 경향을 참고할 수 있습니다.`, refs: source },
      { text: p === 0 ? `${loveSourceName(r.atom)}의 성향도 돌봄을 제공하는 본인의 반응에 적용해 볼 수 있습니다.` : `${particle(loveSourceName(r.atom), "은", "는")} 아이의 성격이 아니라 어른이 어떤 도움을 줄지 살피는 근거입니다.`, refs: refs(r, `parent-basis-${p}`) },
      { text: m.parent, refs: refs(r, `parent-action-${p}`) },
      { text: p === 0 ? "부모에게 자연스러운 방식이 아이에게도 늘 편한 방식은 아니므로, 좋은 의도보다 아이의 반응을 보며 도움의 크기를 맞추는 일이 중요합니다." : "함께 해본 뒤 무엇이 즐거웠고 무엇이 어려웠는지 물으면, 내가 잘 가르쳤다는 느낌과 아이가 직접 얻은 경험을 나누어 볼 수 있습니다.", refs: source },
    ];
    if (!add(p, lines)) return false;
    used.set(r.facet, (used.get(r.facet) ?? 0) + 1); terms.add(termKey(r)); chosen.push(r); return true;
  }
  for (const chapter of LOVE_READER_CHAPTERS) {
    current = { id: chapter.id, key: chapter.key, title: chapter.title, paragraphs: [] }; draft.chapters.push(current);
    if (chapter.id === "CH01") {
      main = application(0, "identity", (m, r) => [`사랑할 때 먼저 드러나는 힘은 ${m.label}이며, ‘${meaning(r.atom.easyMeaning)}’의 뜻과 연결되는 모습입니다.`, m.style, m.expression, m.hope]);
      fusionParagraph(1, "REINFORCE");
      if (!voiceParagraph(2, "expression", "love")) application(2, "expression", (m, r) => [m.expression, reason(r), m.risk, `마음이 잘 전해지려면 ${particle(m.need, "이", "가")} 필요하며, 표현한 양보다 상대가 알아들은 관심이 무엇인지가 중요합니다.`], ["expression", "quiet", "direct"]);
      application(3, "love-value", (m, r) => [`사랑에서 중요한 조건은 ${m.need}입니다.`, reason(r), m.partner, `이 조건이 없다면 ${particle(m.trap, "이", "가")} 강해질 수 있어, 가까워질수록 자기 방식도 설명할 여유가 필요합니다.`], ["meaning", "autonomy", "stability"]);
    } else if (chapter.id === "CH02") {
      application(0, "first-charm", (m, r) => [`처음 만나는 자리에서는 ${particle(m.label, "이", "가")} 사람을 편하게 하는 장점이 될 수 있습니다.`, reason(r), m.first, "모든 사람의 호감을 얻는다는 뜻은 아니며, 내 관심을 강요하지 않고 상대가 참여할 여지가 있을 때 더 편한 매력으로 느껴지기 좋습니다."]);
      application(1, "close-charm", (m, r) => [`처음의 인상과 별개로 가까워진 뒤에는 ${particle(m.label, "이", "가")} 관계의 다른 좋은 면으로 드러날 수 있습니다.`, reason(r), m.private, `이 매력은 ${particle(m.act, "을", "를")} 자연스럽게 이어갈 때, 특별히 잘 보이려던 하루보다 오래 믿을 이유가 됩니다.`]);
      fusionParagraph(2, "COMPLEMENT");
      application(3, "charm-use", m => [`매력을 잘 쓰려면 ${particle(m.label, "을", "를")} 더 크게 증명하기보다 상대가 편하게 받을 자리를 살펴야 합니다.`, m.risk, `다음 대화에서는 ${particle(m.act, "을", "를")} 작은 크기로 시도하면, 강점이 부담으로 바뀌기 전에 반응을 알아가기 좋습니다.`, m.hope]);
    } else if (chapter.id === "CH03") {
      if (!voiceParagraph(0, "attraction", "love")) application(0, "attracted", (m, r) => [m.partner, `끌림의 바탕에는 ${loveSourceName(r.atom)}에서 읽은 나의 성향이 있으며, 상대의 사주나 특정 MBTI를 예측한 해석은 아닙니다.`, m.first, "눈길을 끄는 조건과 함께 있을 때의 편안함은 다를 수 있으므로, 첫 인상의 크기만으로 원하는 관계를 모두 알 수는 없습니다."]);
      if (!voiceParagraph(1, "partner", "love")) application(1, "comfortable", (m, r) => [`오래 편안할 조건은 ${m.need}이며, 취향이 전부 같아야 한다는 뜻은 아닙니다.`, reason(r), m.partner, `서로 맞추는 과정에서는 ${particle(m.act, "을", "를")} 해도 관계가 불안해지지 않는지 살피면, 겉으로 좋은 조건과 실제 편안함을 가르기 좋습니다.`]);
      const balance = loveBalance(state, voice?.id ?? "natal");
      if (!(balance && asset(2, balance.block.text, balance.block.proof, "symbolic-balance"))) fusionParagraph(2, "TENSION");
      application(3, "choice", (m, r) => [`관계를 고를 때에는 ${particle(m.need, "이", "가")} 실제로 있는지 보는 편이 중요합니다.`, reason(r), `한 번의 멋진 말보다 ${particle(m.act, "을", "를")} 했을 때 서로 어떤 반응을 보이는지 살펴볼 만합니다.`, "서로 다를 때도 의견을 말할 수 있다면 편안함은 무조건 맞춰준 결과와 구분되며, 상대의 유형을 미리 정하지 않아도 원하는 관계는 더 분명해집니다."]);
    } else if (chapter.id === "CH04") {
      application(0, "current-interest", (m, r) => [context.start, reason(r), m.first, `관심이 매력으로 전해지려면 ${particle(m.act, "을", "를")} 하되, 상대의 답을 내 기대에 맞게 대신 만들어두지 않을 여지가 필요합니다.`]);
      application(1, "pace", (m, r) => [m.expression, reason(r), "내 마음이 정리된 속도와 상대가 대답할 속도는 다를 수 있어, 빠른 반응만이 진심이라는 기준을 두면 편한 표현도 시험처럼 느껴질 수 있습니다.", context.pace], ["initiative", "quiet", "depth", "flexibility"]);
      application(2, "early-risk", (m, r) => [`관심을 주고받는 과정에서는 ${particle(m.trap, "을", "를")} 특히 돌아볼 만합니다.`, reason(r), m.earlyRisk, `오해를 줄이려면 ${particle(m.act, "을", "를")} 먼저 해보고, 상대가 실제로 말한 것과 내가 덧붙인 뜻을 나누어 보는 편이 좋습니다.`], [], true);
      application(3, "start-choice", m => [`관계가 어떤 단계이든 ${particle(m.label, "을", "를")} 상대를 설득하는 수단으로만 쓰지 않는 편이 좋습니다.`, m.style, "관심을 표현한 뒤에는 다른 속도나 거절도 말할 여지를 남겨야, 서두르는 사람과 주저하는 사람 모두 자기 마음으로 참여할 수 있습니다.", m.hope]);
    } else if (chapter.id === "CH05") {
      if (!voiceParagraph(0, "intimacy", "marriage")) application(0, "private-self", (m, r) => [m.private, reason(r), `가까운 사람에게 ${particle(m.act, "을", "를")} 편하게 할 수 있다면, 처음 잘 보이려고 애쓸 때와 다른 장점도 드러나기 좋습니다.`, "처음과 달라진 모습이 곧 마음이 줄었다는 뜻은 아니며, 긴장이 풀린 뒤 어떤 필요를 서로 나누는지가 친밀함의 다른 단서가 됩니다."]);
      application(1, "intimate-need", (m, r) => [`깊은 관계에서도 ${particle(m.need, "이", "가")} 필요하며, 가까운 사이라는 이유로 그 조건이 사라지지는 않습니다.`, reason(r), m.partner, `이 필요를 말하지 않으면 ${particle(m.trap, "이", "가")} 반복될 수 있어, 상대가 이미 안다고 정하지 않는 대화가 중요합니다.`]);
      application(2, "space", (m, r) => [`애정과 개인 공간의 균형에서는 ${particle(m.label, "을", "를")} 사랑의 크기와 별개로 볼 필요가 있습니다.`, reason(r), m.private, "만나고 싶은 날과 혼자 쉬고 싶은 날이 다를 때는 마음의 우열을 정하기보다 함께할 때와 다시 이야기할 때를 알려주면, 거리가 곧 불안이 되지 않을 수 있습니다."], ["autonomy", "boundary", "depth"]);
      application(3, "lasting-strength", (m, r) => [`오래 관계를 이어가는 데에는 ${particle(m.label, "이", "가")} 반복되는 하루의 힘이 될 수 있습니다.`, reason(r), m.home, `다만 ${particle(m.trap, "이", "가")} 강해지지 않는지 함께 돌아보아야, 처음의 좋은 마음을 한 사람의 의무로만 남기지 않을 수 있습니다.`], ["stability", "duty", "care"]);
    } else if (chapter.id === "CH06") {
      risk = application(0, "fact-bomb", (m, r) => [loveSentences(r.candidate.sourceText)[0], m.cost, `내 의도는 관계를 지키는 것일 수 있어도 ${particle(m.trap, "이", "가")} 반복되면, 상대는 내 진심보다 자신에게 요구된 반응을 먼저 느낄 수 있습니다.`, m.punch], [], true);
      if (risk) {
        const r = risk, node = view.nodes.find(n => r.candidate.mbtiSourceNodeIds.includes(n.id) && n.id.endsWith(":plainKo") && typeof n.value === "string");
        add(1, [
          { text: `${particle(loveSourceName(r.atom), "은", "는")} 앞에서 읽은 약점의 실제 명리 근거입니다.`, refs: refs(r, "risk-cause") },
          { text: `‘${meaning(r.atom.easyMeaning)}’의 힘도 가까운 관계에서 한 가지 반응에만 쓰이면, 좋은 의도를 전하기보다 자기 방식부터 지키게 될 수 있습니다.`, refs: refs(r, "risk-cause") },
          node ? { text: `${profiles.mbti.mbtiType}의 실제 관계 자료에는 ‘${quote(loveSentences(String(node.value))[0])}’의 경향이 있어, 같은 장면에서 어떤 반응이 앞서는지 대조할 수 있습니다.`, refs: { source: node.id, nodes: [node.id], theme: r.candidate.semanticTheme, material: "risk:mbti", refs: [node.id] } }
            : { text: "이 부분에 맞는 MBTI 관계 근거를 따로 확인하지 못했다면 성격 유형의 이유를 덧붙이지 않고, 실제 원국에서 읽힌 위험만 살펴보는 편이 정확합니다.", refs: refs(r, "risk-scope") },
          { text: `결국 이 문제는 ${particle(LOVE_RELEASE_MATERIALS[r.facet].need, "을", "를")} 원하는 마음이, 상대도 참여할 과정 없이 자기 방식으로만 해결되려 할 때 커질 수 있습니다.`, refs: refs(r, "risk-meaning") },
        ]);
      } else fusionParagraph(1, "TENSION");
      if (risk) {
        const r = risk, m = LOVE_RELEASE_MATERIALS[r.facet];
        add(2, [
          `피곤하거나 답을 빨리 받고 싶은 날에는 ${particle(m.trap, "이", "가")} 더 쉽게 나올 수 있습니다.`,
          `내 쪽에서는 ${particle(m.need, "을", "를")} 지키려는 반응일 수 있지만, 그 마음까지 상대에게 알려져 있다는 보장은 없습니다.`,
          `상대에게도 자기 생각을 고를 틈이 필요할 수 있어, 내 의도를 설명하는 것과 다른 답을 듣는 일은 함께 남겨둘 만합니다.`,
          `서로의 답을 들을 틈 없이 ${particle(m.trap, "을", "를")} 계속하면, 처음의 문제보다 대화에서 밀려났다는 느낌이 더 오래 남을 수 있습니다.`,
        ].map(text => ({ text, refs: refs(r, "conflict", true) })));
      } else application(2, "conflict", (m, r) => [m.earlyRisk, reason(r), m.cost, m.punch], [], true);
      if (!voiceParagraph(3, "repair", "love")) application(3, "repair", m => [m.repair, `대화에서는 ${particle(m.act, "을", "를")} 먼저 시도해, 상대의 성격을 고치려는 말보다 함께 다룰 장면을 하나 남기는 편이 좋습니다.`, "다음에 비슷한 일이 생기면 어떤 말로 잠시 멈추고 언제 다시 이야기할지 정해두면, 감정을 없애지 않고도 같은 다툼을 반복할 비용을 줄이기 좋습니다.", m.hope]);
    } else if (chapter.id === "CH07") {
      if (!voiceParagraph(0, "home", "marriage", context.home)) application(0, "household", (m, r) => [`${context.home} ${particle(m.label, "이", "가")} 반복되는 하루에도 드러날 수 있습니다.`, reason(r), m.home, "함께 맡을 일과 각자 쉬는 방식을 말로 나눌 때, 이 장점도 생활의 힘이 됩니다."]);
      application(1, "household-strength", (m, r) => [`공동생활에서 줄 수 있는 다른 힘은 ${m.label}이며, 사랑하는 마음이 어떤 수고로 이어지는지 보이는 부분입니다.`, reason(r), m.home, `함께 맡을 일을 이야기할 때 ${particle(m.act, "을", "를")} 시도하면, 좋은 의도를 알아주길 기다리기보다 실제로 편해질 생활을 만들기 좋습니다.`]);
      application(2, "household-risk", (m, r) => [`함께 살게 되는 경우 ${particle(m.trap, "이", "가")} 생활의 마찰로 이어지는지 특히 돌아볼 만합니다.`, reason(r), `집안일의 기준이나 공동 지출을 정할 때도 ${particle(m.need, "이", "가")} 중요하지만, 내게 익숙한 기준을 이미 합의한 약속으로 보지는 않아야 합니다.`, m.repair], [], true);
      application(3, "household-rule", (m, r) => [`오래 함께할 생활의 기준은 ${particle(m.need, "을", "를")} 일상에서도 지킬 수 있는가입니다.`, reason(r), "돈과 가족 일정처럼 서로 다른 익숙함이 만나는 일은 바뀐 부담을 다시 말할 수 있어야 하며, 한 번 정한 역할이 영원한 몫이 될 필요는 없습니다.", m.hope]);
    } else if (chapter.id === "CH08") {
      if (!parentParagraph(0, 0)) application(0, "parent-self", (m, r) => [m.parent, reason(r), `돌봄을 맡는다면 ${particle(m.act, "을", "를")} 아이의 반응에 맞게 작게 적용할 수 있습니다.`, "현재 자녀가 있다는 뜻이나 미래 자녀의 성격을 예측하는 말은 아니며, 부모 역할을 선택할 때 본인의 도움 방식을 살펴보는 해석입니다."], ["care", "duty", "autonomy"]);
      if (!parentParagraph(1, 1)) application(1, "parent-value", (m, r) => [`양육을 선택할 때 ${particle(m.label, "이", "가")} 아이가 직접 해볼 자리를 만드는 데도 도움이 될 수 있습니다.`, reason(r), m.parent, "어른이 만족한 결과만 남기기보다 아이가 무엇을 직접 고르고 해봤는지 돌아보면, 돌봄을 제공한 양과 아이가 얻은 경험을 함께 볼 수 있습니다."]);
      if (!parentParagraph(2, 0, true)) application(2, "parent-risk", (m, r) => [`부모 역할에서도 ${particle(m.trap, "이", "가")} 강해지면 좋은 의도가 부담으로 바뀔 수 있습니다.`, reason(r), m.parent, "내가 걱정한 일과 아이가 실제로 요청한 도움을 먼저 나누면, 보호하려는 마음 때문에 필요한 시도까지 대신하는 일을 줄이기 좋습니다."], [], true);
      application(3, "parent-direction", m => [`나에게 맞는 부모 역할을 생각한다면 ${particle(m.label, "을", "를")} 아이를 내 방식으로 만드는 도구로 쓰지 않는 편이 중요합니다.`, m.parent, `일상에서는 ${particle(m.act, "을", "를")} 어른의 답을 먼저 주는 대신 아이가 말할 틈을 만드는 방식으로 적용할 수 있습니다.`, "완벽한 부모의 모습을 예고한 것은 아니며, 아이를 알아가면서 내 도움도 바꿀 수 있는 어른이 되는 일이 따뜻한 출발입니다."]);
    } else if (chapter.id === "CH09") {
      const fortune = legacy.sections.find(s => s.id === "fortune")?.blocks;
      if (!fortune?.some(b => asset(0, b.text, b.proof, `approved-fortune:${b.id}`))) application(0, "positive-force", (m, r) => [`사랑에서 가진 좋은 힘은 ${particle(m.label, "이", "가")} 관계 안에서 실제로 쓰일 수 있다는 점입니다.`, reason(r), m.partner, "좋은 인연이나 결혼 시기를 보장하는 예고가 아니라, 이 힘을 알아주는 관계와 서로 참여할 선택이 있을 때 살아나는 가능성으로 읽을 수 있습니다."]);
      application(1, "relationship-gift", (m, r) => [`앞선 좋은 기운과 별개로 ${particle(m.label, "이", "가")} 상대에게 줄 수 있는 관계의 재능입니다.`, reason(r), m.first, `이 힘을 오래 쓰려면 ${particle(m.trap, "이", "가")} 강해지지 않게 돌아보아야, 좋은 모습을 유지하느라 내 마음을 감추지 않을 수 있습니다.`]);
      application(2, "remember-risk", m => [`더 좋은 관계를 위해 기억할 것은 ${particle(m.need, "을", "를")} 혼자 만들 수는 없다는 점입니다.`, `앞에서 읽은 ${particle(m.trap, "이", "가")} 반복되면, 애쓰는 양은 늘어도 상대가 참여할 자리는 줄어들 수 있습니다.`, `다음에는 ${particle(m.act, "을", "를")} 먼저 해보고, 어떤 마음을 실제로 나누었는지 돌아보면 내 의도와 상대의 반응을 함께 알아가기 좋습니다.`, m.hope], [], true, true);
      const last = main ?? chosen[0];
      if (last) {
        const m = LOVE_RELEASE_MATERIALS[last.facet];
        add(3, [
          `당신의 사랑에는 ${particle(m.label, "이", "가")} 있으며, 가까운 사람에게 남기는 행동에서 그 모습이 드러납니다.`,
          `${particle(m.act, "을", "를")} 자연스럽게 할 수 있는 관계가 이 힘을 살려줍니다.`,
          `앞으로도 ${particle(m.need, "이", "가")} 서로에게 남는지 살펴, 좋은 마음을 한쪽의 노력으로만 만들지 않을 만합니다.`,
          `사랑 안에서 ${particle(m.label, "을", "를")} 알아보는 일은, 누군가에게 맞는 사람이 되기 전에 내가 줄 수 있고 받아도 되는 마음을 아는 일입니다.`,
        ].map(text => ({ text, refs: refs(last, "closing", true) })));
      }
    }
  }
  draft.bodyLength = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n\n").length;
  const block = (p: LoveReleaseDraft["chapters"][number]["paragraphs"][number]): NarrativeBlock => ({ id: p.id, text: p.text, mode: "prose", tone: /CH06|CH04.P3|CH07.P3|CH08.P3/.test(p.id) ? "shadow" : "positive",
    proof: { features: [...new Set(p.sentences.flatMap(s => retained[s.sourceCandidateId]?.features ?? []))],
      seedIds: [...new Set(p.sentences.flatMap(s => retained[s.sourceCandidateId]?.seedIds ?? []))],
      fusionIds: [...new Set(p.sentences.flatMap(s => s.fusionIds))], sourceRefs: [...new Set(p.sentences.flatMap(s => [...s.evidenceIds, ...s.mbtiSourceNodeIds, ...s.provenance.sourceRefs]))] } });
  const first = draft.chapters[0], closing = draft.chapters.at(-1)!;
  // Existing publication requires both IDs. These two segments are one CH09
  // reader unit; the Love Book adapter joins them without duplicating a sentence.
  const narrative: LoveNarrative = { ...legacy, opening: first.paragraphs.map(block), sections: [
    ...draft.chapters.slice(1, -1).filter(c => c.paragraphs.length).map(c => ({ id: c.key, title: c.title, domain: LOVE_READER_CHAPTERS.find(x => x.id === c.id)!.domain, blocks: c.paragraphs.map(block) })),
    { id: "fortune", title: closing.title, domain: "success/fortune", blocks: closing.paragraphs.filter(p => p.id === "CH09.P1").map(block) },
    { id: "direction", title: closing.title, domain: "strengths", blocks: closing.paragraphs.filter(p => p.id !== "CH09.P1").map(block) },
  ], finalLine: legacy.finalLine, finalProof: legacy.finalProof };
  return { draft, narrative, retained };
}
