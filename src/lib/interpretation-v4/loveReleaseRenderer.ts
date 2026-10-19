import { reviewedMbtiBehavior } from "./contentMbti";
import { LOVE_RELEASE_VERSION, LOVE_READER_CHAPTERS, type LoveReleaseDraft, type LoveReleaseSentence } from "./loveReleaseContracts";
import { LOVE_RELEASE_MATERIALS } from "./loveReleaseMaterials";
import { LOVE_RELEASE_CONTEXT } from "./loveReleaseContext";
import { loveReleaseSources, loveSourceName, type LoveReleaseSource } from "./loveReleaseSources";
import type { RelationshipView } from "./relationshipProductView";
import type { NarrativeInput, NarrativeBlock, NarrativeProof, MaterialPacket } from "./narrativeTypes";
import type { LoveNarrative } from "./loveNarrativeTypes";
import { particle } from "./copyRealizer";
import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { fusionHumanSurface } from "./narrativeHumanSurface";
import { mbtiHumanBehavior } from "./narrativeHumanOutcome";
import { LOVE_PARENTING_RISK, LOVE_PARENTING_RISK_TRAITS, LOVE_PARENTING_STRENGTHS } from "./loveReleaseParenting";
import { LOVE_RELATIONSHIP_SCENES, LOVE_QUESTION_DETAILS } from "./loveReleaseApplications";
type Refs = { source: string; roots?: string[]; nodes?: string[]; fusion?: string[]; theme: string; material: string; refs: readonly string[]; row?: LoveReleaseSource; recall?: boolean };
type Line = { text: string; refs: Refs };
type Material = (typeof LOVE_RELEASE_MATERIALS)[string];
export const loveSentences = (s: string) => s.match(/[^.!?]+[.!?]+(?:[’”])?|[^.!?]+$/g)?.map(t => t.trim()).filter(Boolean) ?? [];
const terminal = (s: string) => /[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`;
const quote = (s: string) => s.replace(/[.!?]$/, "");
const meaning = (s: string) => quote(s).replace(/입니다$/, "");
/** Independent generation-time edition. No IO, new source inference or paid gate. */
export function renderLoveRelease(input: NarrativeInput, view: RelationshipView, legacy: LoveNarrative, packet: MaterialPacket) {
  void packet; // Keep the existing generation adapter signature; source validation uses this packet downstream.
  const profiles = view.profiles, pool = loveReleaseSources(view), seen = new Set<string>(), used = new Map<string, number>(), usedRoots = new Map<string, number>();
  const chosen: LoveReleaseSource[] = [], terms = new Set<string>();
  const draft: LoveReleaseDraft = { version: LOVE_RELEASE_VERSION, chapters: [], bodyLength: 0, shortages: [] };
  const retained: Record<string, NarrativeProof> = {};
  const context = LOVE_RELEASE_CONTEXT[input.context.relationshipStatus], usedFusions = new Set<string>();
  let current: LoveReleaseDraft["chapters"][number], main: LoveReleaseSource | undefined, risk: LoveReleaseSource | undefined;
  const refs = (r: LoveReleaseSource, key: string, recall = false): Refs => ({ source: r.candidate.id, roots: [r.atom.id], nodes: [], fusion: [], theme: r.candidate.semanticTheme, material: `love:${r.facet}:${key}`, refs: [r.candidate.sourceId], row: r, recall });
  const termKey = (r: LoveReleaseSource) => r.atom.easyMeaning;
  // Explain a term once. Reusing its proof in a new question does not require
  // repeating its definition or inventing a filler sentence.
  const reason = (r: LoveReleaseSource) => terms.has(termKey(r)) ? "" :
    r.atom.sourceType === "ten_god" ? `명리에서 ${particle(loveSourceName(r.atom), "은", "는")} ‘${meaning(r.atom.easyMeaning)}’이라는 뜻으로 풀이합니다.` :
    `${particle(loveSourceName(r.atom), "은", "는")} ‘${meaning(r.atom.easyMeaning)}’의 뜻으로 읽습니다.`;
  function add(p: number, lines: Line[]) {
    const contract = LOVE_READER_CHAPTERS.find(c => c.id === current.id)!.paragraphs[p], id = `${current.id}.${contract.id}`;
    const actual = lines.filter(l => l.text?.trim()).map(l => ({ ...l, text: terminal(l.text) }));
    if (actual.length < 3 || actual.length > 5 || actual.some(l => loveSentences(l.text).length !== 1 || seen.has(l.text))) return false;
    const sentences = actual.map((l, i): LoveReleaseSentence => ({ chapterId: current.id, paragraphId: contract.id, sentenceRole: `S${i + 1}`, roleDescription: contract.sentences[i] ?? contract.sentences[3], text: l.text,
      sourceCandidateId: l.refs.source, evidenceIds: [...(l.refs.roots ?? [])], mbtiSourceNodeIds: [...(l.refs.nodes ?? [])], fusionIds: [...(l.refs.fusion ?? [])], semanticTheme: l.refs.theme,
      relationshipStatus: input.context.relationshipStatus, context: current.key,
      provenance: { materialId: l.refs.material, application: l.refs.recall ? "RECALL" : l.refs.row ? "CONDITIONAL_APPLICATION" : "SOURCE", sourceRefs: [...l.refs.refs], ...(l.refs.row ? { axis: l.refs.row.axis, direction: l.refs.row.direction } : {}) } }));
    const continuing = ["dating", "marriage_preparing", "married"].includes(input.context.relationshipStatus);
    const purpose = current.id === "CH04" && continuing ? ["지금의 관계에 관심을 전하는 나", contract.purpose, "익숙한 사이에서 생길 수 있는 오해", "지금의 관심을 새로 전할 때"][p] : contract.purpose;
    current.paragraphs.push({ id, purpose, text: actual.map(l => l.text).join(" "), sentences });
    actual.forEach(l => seen.add(l.text)); return true;
  }
  function eligible(preferred: readonly string[], factBomb: boolean, recall: boolean, reuse = false) {
    return pool.filter(r => r.candidate.factBomb === factBomb && (!recall || chosen.some(s => s.atom.id === r.atom.id && s.facet === r.facet))
      && (reuse || recall || (used.get(r.facet) ?? 0) < 6) && (reuse || !current.paragraphs.some(p => p.sentences.some(s => s.provenance.materialId.startsWith(`love:${r.facet}:`)))))
      .sort((a, b) => (current.id === "CH01" && !current.paragraphs.length ? Number(!!b.atom.metadata?.isDayMaster) - Number(!!a.atom.metadata?.isDayMaster) : 0)
        || (current.id === "CH01" && !current.paragraphs.length ? Math.abs(b.atom.axes[b.axis] ?? 0) - Math.abs(a.atom.axes[a.axis] ?? 0) : 0)
        || Number(preferred.includes(b.facet)) - Number(preferred.includes(a.facet)) || (current.id === "CH06" && !current.paragraphs.length ? Number(b.candidate.rank === "SIGNATURE") - Number(a.candidate.rank === "SIGNATURE") || b.candidate.priorityScore - a.candidate.priorityScore || b.atom.weight - a.atom.weight : 0)
        || (used.get(a.facet) ?? 0) - (used.get(b.facet) ?? 0)
        || (current.id === "CH01" && !current.paragraphs.length ? (profiles.mbti.contextAxes.love?.[b.axis] ?? 0) * b.direction - (profiles.mbti.contextAxes.love?.[a.axis] ?? 0) * a.direction : 0)
        || Number(b.candidate.sourceType === "PERSONAL_RESONANCE") - Number(a.candidate.sourceType === "PERSONAL_RESONANCE")
        || (profiles.mbti.generalAxes[b.axis] ?? 0) * b.direction - (profiles.mbti.generalAxes[a.axis] ?? 0) * a.direction
        || (usedRoots.get(a.atom.id) ?? 0) - (usedRoots.get(b.atom.id) ?? 0) || b.atom.weight - a.atom.weight || a.candidate.id.localeCompare(b.candidate.id));
  }
  function application(p: number, key: string, make: (m: Material, r: LoveReleaseSource) => string[], preferred: readonly string[] = [], factBomb = false, recall = false) {
    const fresh = eligible(preferred, factBomb, recall);
    // Novelty limits are not missing evidence. If they exhaust a supported
    // question, reuse a verified source with this question's existing copy.
    for (const r of fresh.length ? fresh : eligible(preferred, factBomb, recall, true)) {
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
  function fusionParagraph(p: number, kind: "REINFORCE" | "COMPLEMENT" | "TENSION") {
    // Both sides must support the displayed reading. A related node with a
    // different signed axis is not an explanation of this Fusion.
    const candidates = view.candidates.filter(c => c.sourceType === "FUSION" && !usedFusions.has(c.sourceId)
      && (c.fusionType === kind || kind === "REINFORCE" && c.fusionType === "COMPLEMENT"))
      .sort((a, b) => Number(b.fusionType === kind) - Number(a.fusionType === kind) || b.priorityScore - a.priorityScore || a.id.localeCompare(b.id));
    for (const row of candidates) {
      const fusion = [...profiles.fusion.reinforce, ...profiles.fusion.complements, ...profiles.fusion.tensions].find(f => f.id === row.sourceId);
      if (!fusion || fusion.type === "TENSION" && (!fusion.conditionSplit?.resolved || !fusion.conditionSplit.sides)) continue;
      const side = fusion.mbti.side;
      const node = view.nodes.filter(n => row.mbtiSourceNodeIds.includes(n.id) && fusion.mbti.sourceNodeIds.includes(n.id)
        && ["LOVE", "RELATIONSHIPS", "COMMUNICATION", "MARRIAGE"].includes(n.sourceDomain!) && n.classification === "SCORING_SEMANTIC"
        && profiles.mbti.annotations.some(a => a.sourceNodeId === n.id && a.annotationConfidence !== "REFERENCE_ONLY" && (a.axes[side.axis] ?? 0) * side.direction > 0))
        .sort((a, b) => Number(b.sourceDomain === "LOVE") - Number(a.sourceDomain === "LOVE")
          || Number(!!reviewedMbtiBehavior(b)) - Number(!!reviewedMbtiBehavior(a)) || a.id.localeCompare(b.id))[0];
      const atom = profiles.myeongli.evidence.filter(a => row.myeongliEvidenceIds.includes(a.id) && fusion.myeongli.evidenceIds.includes(a.id)
        && a.tier !== "AMPLIFIER" && (a.axes[fusion.myeongli.side.axis] ?? 0) * fusion.myeongli.side.direction > 0)
        .sort((a, b) => (usedRoots.get(a.id) ?? 0) - (usedRoots.get(b.id) ?? 0) || b.weight - a.weight || a.id.localeCompare(b.id))[0];
      const behavior = mbtiHumanBehavior(side.axis, side.direction);
      const natalBehavior = mbtiHumanBehavior(fusion.myeongli.side.axis, fusion.myeongli.side.direction);
      if (!atom || !node || !behavior || !natalBehavior) continue;
      const source: Refs = { source: row.id, roots: [atom.id], nodes: [node.id], fusion: [fusion.id], theme: row.semanticTheme, material: `fusion:${fusion.type}`, refs: [row.sourceId] };
      const m = Object.values(LOVE_RELEASE_MATERIALS).find(m => m.axes.some(([axis, sign]) => axis === fusion.myeongli.side.axis && sign === fusion.myeongli.side.direction));
      const mbtiText = node.id.includes(":boundary_against_cruelty:") ? `${profiles.mbti.mbtiType}의 관계 성향에서도, 무례하거나 불공평한 대우에는 거리를 두고 자기 기준을 지키려는 면을 살펴볼 만합니다.`
        : `${profiles.mbti.mbtiType}에서는 ${reviewedMbtiBehavior(node) ?? behavior.replace(/합니다\.$/, "하는 경향을 참고할 만합니다.").replace(/봅니다\.$/, "보는 경향을 참고할 만합니다.")}`;
      const conclusion = fusion.type === "REINFORCE" && m ? (side.axis === "BOUNDARY" ? "가까워지고 싶은 마음과 별개로 서로 존중받을 선을 중요하게 본다는 점이 겹치며, 친밀함을 위해 불편한 대우까지 참을 필요는 없다는 기준으로 활용할 만합니다."
        : `두 해석이 만나는 지점은 ${m.need}이며, 유형 설명에 나를 맞추기보다 실제 관계에서 이 조건이 편안함을 주는지 살펴보면 좋습니다.`)
        : fusion.type === "COMPLEMENT" ? fusionHumanSurface(row) : undefined;
      // No guessed time/condition split and no invented bridge when unavailable.
      if (!conclusion || !add(p, [
        { text: `${loveSourceName(atom)}의 성향을 관계에 적용하면, ${natalBehavior.replace(/합니다\.$/, "하는 면을 살펴볼 수 있습니다.").replace(/봅니다\.$/, "보는 면을 살펴볼 수 있습니다.")}`, refs: { ...source, nodes: [], fusion: [] } },
        { text: mbtiText, refs: { ...source, roots: [], fusion: [] } },
        { text: loveSentences(conclusion)[0], refs: source },
      ])) continue;
      usedFusions.add(fusion.id); usedRoots.set(atom.id, (usedRoots.get(atom.id) ?? 0) + 1); terms.add(atom.easyMeaning); return;
    }
    application(p, `fusion-${kind.toLowerCase()}-fallback`, (m, r) => [
      `관계에서 따로 살펴볼 힘은 ${m.label}입니다.`, reason(r),
      `이 성향은 ${m.need}에서 편하게 쓰이기 좋으며, 장점이 있다는 것과 모든 관계에서 그 장점이 환영받는 것은 다릅니다.`,
      `실제로 ${particle(m.act, "을", "를")} 해보았을 때 서로의 부담이 줄어드는지 확인하면, 나에게 맞는 방식과 익숙해서 반복한 방식을 구분할 수 있습니다.`,
    ], ["depth", "care", "stability"]);
  }
  const raw = getMbtiSourceProfile(input.mbti), parenting = raw?.traits?.parenting ?? [];
  function parentParagraph(p: number, index: number, riskSlot = false) {
    const authored = raw && LOVE_PARENTING_STRENGTHS[raw.type]?.[index];
    const trait = parenting.find(t => t.id === (riskSlot ? LOVE_PARENTING_RISK_TRAITS[raw!.type] : authored?.[0]));
    const field = riskSlot ? "risk" : p === 1 ? "positiveUse" : "plainKo";
    const node = trait && profiles.mbti.sourceNodes.find(n => n.id === `mbti:${raw!.type}:traits:parenting:${trait.id}:${field}`);
    if (!trait?.[field] || !node || !raw || !authored) return false;
    const r = eligible(["care", "duty", "autonomy", "precision"], false, false)[0]; if (!r) return false;
    const source: Refs = { source: node.id, nodes: [node.id], theme: `OWN_PARENTING:${trait.id}`, material: `parenting:own:${trait.id}:${field}`, refs: [node.id] };
    const lines = riskSlot ? [
      ...LOVE_PARENTING_RISK[raw.type].map(text => ({ text, refs: source })),
    ] : [
      { text: authored[1], refs: source },
      { text: authored[2], refs: source },
      { text: LOVE_RELEASE_MATERIALS[r.facet].parent, refs: refs(r, `parent-action-${p}`) },
    ];
    if (!add(p, lines)) return false;
    used.set(r.facet, (used.get(r.facet) ?? 0) + 1); terms.add(termKey(r)); chosen.push(r); return true;
  }
  for (const chapter of LOVE_READER_CHAPTERS) {
    current = { id: chapter.id, key: chapter.key, title: chapter.title, paragraphs: [] }; draft.chapters.push(current);
    if (chapter.id === "CH01") {
      main = application(0, "identity", (m, r) => [
        `사랑을 시작하고 이어가는 기본 힘은 ${m.label}이며, ${loveSourceName(r.atom)}의 ‘${meaning(r.atom.easyMeaning)}’에서 읽는 모습입니다.`,
        m.style, `이 모습이 잘 쓰이면 ${m.need}에서 자신의 마음도 덜 감추게 됩니다.`,
      ]);
      fusionParagraph(1, "REINFORCE");
      application(2, "expression", (m, r) => [m.expression, reason(r),
        `애정을 주는 방식과 받고 싶은 방식이 같지는 않을 수 있어, ${particle(m.need, "이", "가")} 필요하다는 마음도 상대에게 알려줄 만합니다.`,
        LOVE_QUESTION_DETAILS[r.facet].receive,
      ], ["expression", "quiet", "direct"]);
      application(3, "love-value", (m, r) => [`사랑에서 포기하기 어려운 가치는 ${m.need}입니다.`, reason(r),
        "취미나 대화 주제가 잘 맞는 즐거움과, 중요한 선택에서 나를 존중받는 느낌은 별개의 조건입니다.",
        `관계를 오래 이어갈지 생각할 때는 ${particle(m.act, "을", "를")} 해도 서로의 자리가 남는지 살피면, 순간의 호감과 지키고 싶은 가치를 구분하기 좋습니다.`,
      ], ["meaning", "autonomy", "stability"]);
    } else if (chapter.id === "CH02") {
      application(0, "first-charm", (m, r) => [`첫 만남에서 드러날 매력은 ${m.label}입니다.`, reason(r), m.first,
        LOVE_QUESTION_DETAILS[r.facet].charm]);
      application(1, "close-charm", (m, r) => [`시간을 함께 보내며 알게 될 좋은 면은 ${m.label}입니다.`, reason(r), m.private,
        LOVE_QUESTION_DETAILS[r.facet].privateValue]);
      fusionParagraph(2, "COMPLEMENT");
      application(3, "charm-use", (m, r) => [`또 다른 매력인 ${particle(m.label, "은", "는")} 힘을 빼고 쓸 때 더 편하게 전해집니다.`, reason(r),
        `예를 들어 ${particle(m.act, "을", "를")} 한 뒤 잠시 반응을 기다리면, 상대가 좋아하는지 확인하기 전에 더 많이 보여주려 애쓰지 않아도 됩니다.`,
        "내가 잘하는 행동을 상대도 반길 때 매력이 관계의 즐거움으로 이어지며, 반응이 다르다는 이유만으로 내 장점의 가치가 없어지는 것은 아닙니다."], ["boundary", "meaning", "direct", "stability"]);
    } else if (chapter.id === "CH03") {
      application(0, "attracted", (m, r) => [`마음이 움직일 만한 조건으로는 이런 행동을 살펴볼 수 있습니다: ${m.partner}`,
        `${loveSourceName(r.atom)}의 ‘${meaning(r.atom.easyMeaning)}’에서 읽는 나의 필요를 관계에 옮긴 조건이며, 아직 알지 못하는 상대의 성격을 정해둔 것은 아닙니다.`,
        `호감이 생긴다면 ${particle(m.need, "이", "가")} 평소 행동에서도 이어지는지 볼 만합니다.`,
      ]);
      application(1, "comfortable", (m, r) => [`함께 있을 때 긴장을 덜어줄 조건은 ${m.need}입니다.`, reason(r), m.partner,
        `생각이 다른 날에 ${particle(m.act, "을", "를")} 해보아도 대화가 이어지는지 보면, 취향이 같은 사람과 조율할 수 있는 사람의 차이가 드러납니다.`]);
      application(2, "helpful-difference", (m, r) => [LOVE_RELATIONSHIP_SCENES[r.facet].difference, reason(r),
        `차이가 도움이 되려면 ${particle(m.need, "이", "가")} 먼저 지켜져야 하며, 한 사람이 계속 참아서 균형을 만드는 것과는 다릅니다.`,
        "작은 약속을 서로 다른 방법으로 정해본 뒤 누가 무엇을 편하게 느꼈는지 이야기하면, 반대 성향이라는 이름보다 실제로 보완되는 행동을 확인할 수 있습니다."]);
      application(3, "choice", (m, r) => [`관계를 선택할 때에는 ${particle(m.need, "을", "를")} 말로 동의하는 데서 그치지 않는지 확인할 만합니다.`, reason(r),
        `내가 ${particle(m.act, "을", "를")} 했을 때 상대도 자신의 사정을 알려주는지, 한쪽만 계속 양보하지 않아도 다음 약속을 만들 수 있는지 살펴보세요.`,
        LOVE_QUESTION_DETAILS[r.facet].choice]);
    } else if (chapter.id === "CH04") {
      application(0, "current-interest", (m, r) => [context.start, reason(r), m.expression,
        input.context.relationshipStatus === "married" ? "생활에 필요한 일을 주고받은 대화와, 상대 자체가 반가워서 건넨 관심을 나누어 보면 일상을 함께 운영하는 것에 가려진 애정을 살펴볼 수 있습니다."
          : input.context.relationshipStatus === "dating" ? "다음 만남을 정하는 일과 요즘 무엇이 반가운지 말하는 일을 따로 두면, 익숙하게 만난다는 사실에 가려진 현재의 관심을 드러내기 좋습니다."
          : "상대의 반응을 관계의 결론으로 서둘러 읽기보다, 다음 대화나 만남에도 서로 관심을 이어가는지 알아갈 시간이 필요합니다."]);
      application(1, "pace", (m, r) => [context.pace, reason(r),
        `마음을 보이는 속도에는 ${particle(m.need, "이", "가")} 영향을 줄 수 있으므로, 내 방식이 편하다는 이유로 상대도 같은 속도를 원한다고 정하지 않을 만합니다.`,
        input.context.relationshipStatus === "married" || input.context.relationshipStatus === "marriage_preparing" ? "결정해야 할 이야기에는 시간을 정하되 감정을 나누는 대화까지 같은 마감에 넣지 않으면, 당장 답할 일과 충분히 들을 일을 구분할 수 있습니다."
          : "제안을 건넨 뒤 가능한 때와 어려운 때를 서로 알려주면, 빠른 답장만으로 관심의 크기를 확인하려는 부담을 줄일 수 있습니다.",
      ], ["expression", "depth", "stability"]);
      application(2, "early-risk", (m, r) => [
        input.context.relationshipStatus === "married" ? "이미 함께하는 사이에서는 무엇을 원하는지 서로 알 것이라는 기대 때문에, 새로 달라진 필요를 묻는 일이 생략되기 쉽습니다."
          : input.context.relationshipStatus === "dating" ? "연애 중이라도 표현의 뜻을 이미 안다고 정하면, 지금 원하는 반응과 익숙하게 주던 반응의 차이를 놓치기 쉽습니다."
          : input.context.relationshipStatus === "marriage_preparing" ? "결혼 준비가 바쁠 때 모든 제안이 처리할 일로 들리면, 함께 기대하는 마음을 말할 틈까지 줄어들기 쉽습니다."
          : "알아가는 때에는 호감이 큰 만큼 상대의 한 번의 반응에 많은 뜻을 담아 읽기 쉽습니다.",
        reason(r), ["", "single", "some"].includes(input.context.relationshipStatus) ? m.earlyRisk
          : `지금은 ${particle(m.act, "을", "를")} 익숙한 요구로만 전하기보다, 요즘 편하게 받을 방식이 무엇인지 새로 물어보는 편이 좋습니다.`,
        "실제 들은 답과 내가 기대했던 답을 나누어 말하면, 상대를 설득하기 전에 지금 조율할 것이 무엇인지 찾기 좋습니다.",
      ], [], true);
      application(3, "start-choice", (m, r) => [
        input.context.relationshipStatus === "married" ? "지금 관계의 관심을 새롭게 만들고 싶다면, 생활을 잘 처리했다는 보고와 함께하고 싶다는 제안을 구분해볼 만합니다."
          : input.context.relationshipStatus === "dating" ? "현재 연애에서 원하는 시간을 새로 제안할 때는 예전처럼 해야 한다는 요구보다 요즘 해보고 싶은 일을 말해볼 만합니다."
          : input.context.relationshipStatus === "marriage_preparing" ? "준비를 잘 마치는 목표와 별개로 둘이 즐길 작은 시간을 남기면, 결정할 일이 없어도 함께할 이유를 지킬 수 있습니다."
          : "새로운 관계를 시작할 때에는 좋은 반응을 얻는 것만큼 서로 자기 뜻으로 참여하는지도 중요합니다.",
        `여기서 활용할 힘은 ${m.label}이며, ${loveSourceName(r.atom)}에서 읽은 성향을 관계의 제안으로 옮겨볼 수 있습니다.`,
        ["dating", "marriage_preparing", "married"].includes(input.context.relationshipStatus) ? m.hope : m.first]);
    } else if (chapter.id === "CH05") {
      application(0, "private-self", (m, r) => [m.private, reason(r),
        "처음에는 잘 보이려 숨기던 피로와 사소한 취향도 가까운 사이에서는 드러날 수 있으며, 달라진 모습만으로 애정이 줄었다고 판단할 필요는 없습니다.",
        `평소 ${particle(m.need, "을", "를")} 원한다는 마음을 알리면, 좋은 인상을 유지하려 애쓰기보다 실제로 어떤 때 쉬고 어떤 때 가까워지고 싶은지 나누기 좋습니다.`]);
      application(1, "intimate-need", (m, r) => [`친밀해질수록 살펴볼 정서적 조건은 ${m.need}입니다.`, reason(r),
        LOVE_QUESTION_DETAILS[r.facet].intimate,
        `부담스러운 날에는 ${particle(m.act, "을", "를")} 작게 시작해보면, 무엇이 부족한지 따지기 전에 서로 편해질 도움의 크기를 고를 수 있습니다.`]);
      application(2, "space", (m, r) => [LOVE_RELATIONSHIP_SCENES[r.facet].space, reason(r),
        "개인 공간을 정하는 대화에서는 함께할 의사가 있는지와 지금 쉴 시간이 필요한지를 따로 알려주는 편이 좋습니다.",
        "잠깐 떨어져 있는 동안 무엇을 해야 사랑을 증명한 셈인지 정하기보다, 다시 만날 때 서로 덜 지쳐 있는지를 살피면 거리도 친밀함을 지키는 방식이 됩니다."]);
      application(3, "lasting-strength", (m, r) => [`오래 가까워지는 힘은 ${particle(m.label, "을", "를")} 처음과 같은 모습으로만 쓰지 않는 데 있습니다.`, reason(r),
        `예전에는 반가웠던 ${particle(m.act, "이", "가")} 지금도 필요한지 물으면, 상대를 잘 안다는 확신 때문에 바뀐 필요를 지나치지 않기 좋습니다.`,
        "익숙한 애정을 지키면서도 받는 방식은 다시 고를 수 있어야, 처음의 장점이 계속 요구되는 역할로 굳지 않고 관계와 함께 자랍니다."]);
    } else if (chapter.id === "CH06") {
      risk = application(0, "fact-bomb", m => [
        `연애에서 가장 먼저 돌아볼 취약점은 ${particle(m.label, "을", "를")} 한 가지 방식으로만 밀어붙일 때 나타납니다.`,
        m.risk, m.punch,
      ], [], true);
      if (risk) {
        const r = risk, m = LOVE_RELEASE_MATERIALS[r.facet];
        const node = view.nodes.filter(n => n.classification === "SCORING_SEMANTIC"
          && ["LOVE", "RELATIONSHIPS", "COMMUNICATION", "MARRIAGE"].includes(n.sourceDomain!)
          && profiles.mbti.annotations.some(a => a.sourceNodeId === n.id && a.annotationConfidence !== "REFERENCE_ONLY" && (a.axes[r.axis] ?? 0) * r.direction > 0))
          .sort((a, b) => Number(b.sourceDomain === "LOVE") - Number(a.sourceDomain === "LOVE")
          || Number(!!reviewedMbtiBehavior(b)) - Number(!!reviewedMbtiBehavior(a)) || a.id.localeCompare(b.id))[0];
        add(1, [
          `${loveSourceName(r.atom)}에서 읽은 ${particle(m.label, "은", "는")} 장점이지만, 언제 어떻게 쓰는지에 따라 상대가 받는 느낌은 달라질 수 있습니다.`,
          `문제는 ${particle(m.need, "을", "를")} 원하는 마음이 강해질 때, 상대도 같은 방법을 원한다는 전제를 먼저 둘 수 있다는 점입니다.`,
          LOVE_QUESTION_DETAILS[r.facet].cause,
        ].map(text => ({ text, refs: refs(r, "risk-cause") })).concat(node ? [{
          text: `${profiles.mbti.mbtiType}에서도 ${mbtiHumanBehavior(r.axis, r.direction)!.replace(/합니다\.$/, "하는 면이 있는지 함께 대조해볼 만합니다.").replace(/봅니다\.$/, "보는 면이 있는지 함께 대조해볼 만합니다.")}`,
          refs: { source: node.id, nodes: [node.id], theme: r.candidate.semanticTheme, material: "risk:aligned-mbti", refs: [node.id] },
        }] : []));
        add(2, [LOVE_RELATIONSHIP_SCENES[r.facet].conflict,
          LOVE_QUESTION_DETAILS[r.facet].escalation,
          `대화를 멈추더라도 ${m.need}까지 포기한 것은 아니라는 점을 알려주면, 쉴 시간을 갖는 일과 관계를 거부하는 일을 구분할 수 있습니다.`,
        ].map(text => ({ text, refs: refs(r, "conflict", true) })));
        add(3, [m.repair,
          "상대도 자기 쪽에서 본 일을 말한 뒤 한 번만 다르게 해볼 행동과 돌아볼 때를 정하면, 누가 맞는지를 끝없이 따지기보다 바뀌는지 확인할 약속이 남습니다.",
          `화해는 ${particle(m.label, "을", "를")} 버리는 일이 아니라, 내 진심을 전하면서 상대가 다른 답을 보탤 자리를 되찾는 일입니다.`,
        ].map(text => ({ text, refs: refs(r, "repair", true) })));
      } else {
        fusionParagraph(1, "TENSION");
        application(2, "conflict", (m, r) => [m.earlyRisk, reason(r), m.cost, m.punch], [], true);
        application(3, "repair", (m, r) => [m.repair, reason(r), m.expression, m.hope]);
      }
    } else if (chapter.id === "CH07") {
      application(0, "household", (m, r) => [`${context.home}, ${particle(m.label, "이", "가")} 생활을 운영하는 방식에도 이어질 수 있습니다.`, reason(r),
        LOVE_RELATIONSHIP_SCENES[r.facet].household,
        "잘 맞는 생활은 모든 기준이 같아서 생기기보다, 누가 무엇을 결정하고 어디까지 맡을지 서로 알아볼 수 있을 때 만들기 쉽습니다."]);
      application(1, "household-strength", (m, r) => [`공동생활의 역할을 나눌 때 활용할 다른 힘은 ${m.label}입니다.`, reason(r),
        LOVE_RELATIONSHIP_SCENES[r.facet].household,
        "분담은 눈앞의 일을 반씩 하는 것에 그치지 않으며, 준비를 기억하고 끝난 뒤 확인하는 일까지 맡은 몫에 포함해야 한쪽이 계속 관리자 역할을 하지 않게 됩니다."]);
      application(2, "household-risk", (m, r) => [`이미 함께 사는 경우든 앞으로 공동생활을 선택하든, ${particle(m.need, "은", "는")} 생활비와 가족 일정을 맞출 때에도 필요한 조건입니다.`, reason(r),
        LOVE_RELATIONSHIP_SCENES[r.facet].household,
        "합의하지 않은 기대가 어긋났을 때는 잘못한 사람부터 고르기보다 무엇을 각자 당연하게 여겼는지 적어보면, 애정의 크기와 생활 규칙의 차이를 나누어 다루기 좋습니다."], [], true);
      application(3, "household-rule", (m, r) => [`오래 함께할 조건은 ${particle(m.label, "이", "가")} 한 사람의 고정된 역할로만 남지 않는 것입니다.`, reason(r),
        "업무가 몰리거나 건강과 수입이 달라지는 때에는 예전의 분담이 공평하지 않을 수 있으므로, 임시로 바꿀 몫과 다시 돌아볼 날을 함께 남길 필요가 있습니다.",
        "각자 쓸 수 있는 돈과 시간도 공동 책임 옆에 마련하면, 생활을 잘 유지하기 위해 개인의 즐거움을 모두 미뤄야 하는 관계에서 벗어나기 좋습니다."]);
    } else if (chapter.id === "CH08") {
      if (!parentParagraph(0, 0)) application(0, "parent-self", (m, r) => [m.parent, reason(r),
        "돌봄을 선택한다면 내가 익숙하게 주는 도움을 상대가 요청한 도움과 나누어 볼 필요가 있습니다.",
        "바로 대신하기 전에 스스로 해볼 부분과 함께할 부분을 물으면, 부모에게 편한 방법이 언제나 당사자에게도 편한 방법은 아니라는 점을 놓치지 않기 좋습니다."], ["care", "duty", "autonomy"]);
      if (!parentParagraph(1, 1)) application(1, "parent-value", (m, r) => [`양육에서 활용할 힘은 ${m.label}이며, ${loveSourceName(r.atom)}에서 읽은 본인의 성향을 조건부로 적용한 해석입니다.`,
        m.parent, "가르칠 일을 한꺼번에 대신하기보다 지금 스스로 고를 수 있는 작은 몫을 남기면, 도움을 받은 결과와 직접 해본 경험을 함께 마련할 수 있습니다.",
        "어려워했던 부분을 들은 뒤 다음에 바꿀 도움을 정하면, 양육의 강점도 처음 정한 방식 하나에 머물지 않습니다."]);
      if (!parentParagraph(2, 0, true)) application(2, "parent-risk", (m, r) => [
        `돌봄에서도 ${particle(m.label, "을", "를")} 지나치게 밀면 좋은 의도가 부담이 될 수 있습니다.`, reason(r), m.parent,
        "안전상 반드시 지킬 한계와 취향에 따라 고를 부분을 나누면, 어른의 걱정 때문에 필요한 선택까지 대신하는 일을 줄이기 좋습니다."], [], true);
      application(3, "parent-direction", (m, r) => [`부모 역할에서 ${particle(m.label, "은", "는")} 어른이 활용할 도움의 방식이며, 아이도 같은 방식으로 반응해야 한다는 기준은 아닙니다.`, reason(r),
        "고를 수 있는 방법은 열어두되 선택한 뒤 맡을 작은 일은 함께 정하면, 독립성과 책임을 서로 반대되는 목표로 두지 않아도 됩니다.",
        "끝낸 뒤 잘못된 결과만 평가하지 않고 어디에서 도움이 필요했는지 들으면, 스스로 해볼 자유와 어려울 때 어른을 찾을 신뢰가 함께 남습니다."]);
    } else if (chapter.id === "CH09") {
      const fortune = legacy.sections.find(s => s.id === "fortune")?.blocks;
      const approved = fortune?.some(b => {
        const lead = loveSentences(b.text).slice(0, 2).join(" ");
        return asset(0, `${lead} 가까워질 기회가 생겨도 서로 마음을 알아갈 시간과 실제 선택이 있어야 관계로 이어집니다. 좋은 기운을 호감이나 결혼의 보장으로 여기기보다, 내가 편하게 드러날 자리를 알아보는 가능성으로 받아들이면 좋습니다.`, b.proof, `approved-fortune:${b.id}`);
      });
      if (!approved) application(0, "positive-force", (m, r) => [`사랑에서 활용할 좋은 자원은 ${m.label}입니다.`, reason(r),
        "특정한 인연이나 시기를 보장하는 표시는 아니며, 실제 만남에서 서로 참여할 여지가 있을 때 관계의 힘으로 쓰일 수 있습니다.", m.hope]);
      application(1, "relationship-gift", (m, r) => [`앞에서 읽은 ${particle(m.label, "은", "는")} 상대에게 줄 수 있는 힘이면서 나도 받아도 되는 배려입니다.`,
        `${loveSourceName(r.atom)}에서 읽은 장점을 주는 역할로만 쓰지 않아도 된다는 점이 중요합니다.`,
        `내가 ${particle(m.act, "을", "를")} 할 때 상대에게도 같은 참여를 요청할 수 있다면, 매력을 증명하는 수고와 서로 편해지는 노력을 나누어 볼 수 있습니다.`,
      ], [], false, true);
      application(2, "remember-risk", (m, r) => [`관계의 선택을 바꿀 때는 앞서 읽은 ${particle(m.need, "을", "를")} 계속 혼자 책임지고 있지는 않은지 볼 만합니다.`,
        `${loveSourceName(r.atom)}의 힘이 애쓰는 방향으로만 쓰일 때와, 상대의 응답을 기다리는 여유가 있을 때를 비교해보세요.`,
        "내가 바꿔볼 행동과 상대에게 요청할 행동을 나누는 것이 중요하며, 모든 관계의 결과를 내 성향 하나로 떠안을 필요는 없습니다."], [], true, true);
      const last = main ?? chosen[0];
      if (last) {
        const m = LOVE_RELEASE_MATERIALS[last.facet];
        add(3, [
          `처음에 읽은 ${particle(m.label, "은", "는")} 누군가에게 선택받기 위해 끝없이 증명해야 할 조건이 아닙니다.`,
          ...LOVE_QUESTION_DETAILS[last.facet].closing,
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
