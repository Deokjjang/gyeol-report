import type { CareerProfiles } from "./careerProductSelection";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativeInput, NarrativeState, NarrativeBlock, NarrativeProof } from "./narrativeTypes";
import type { CareerNarrative } from "./careerNarrativeTypes";
import { CAREER_RELEASE_VERSION, CAREER_READER_CHAPTERS, type CareerReleaseDraft, type CareerReleaseSentence } from "./careerReleaseContracts";
import { CAREER_RELEASE_MATERIALS } from "./careerReleaseMaterials";
import { collectCareerReleaseSources, careerAtomName, type CareerReleaseSource } from "./careerReleaseSources";
import { careerStatusCopy } from "./careerReleaseContext";
import { careerStudy, CAREER_STUDY_BRIDGES } from "./careerStudy";
import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { freshNarrativeMemory } from "./narrativeMemory";
import { fortuneReason, planFortuneReasons, positiveReward } from "./narrativePositiveReward";
import { CAREER_TASKS, CAREER_WORKFLOWS } from "./careerReleaseApplications";
import { careerNatalMoney } from "./careerNatalMoney";
import { particle } from "./copyRealizer";
import { materialLabel } from "./contentEvidence";
import { CAREER_STUDY_REMEDIES } from "./careerReleaseStudy";

type Refs = { source: string; roots?: string[]; nodes?: string[]; fusion?: string[]; theme: string; material: string; sourceRefs?: readonly string[]; recall?: boolean; row?: CareerReleaseSource };
type Line = { text: string; refs: Refs };
type Material = (typeof CAREER_RELEASE_MATERIALS)[string];
const split = (s: string) => s.match(/[^.!?]+[.!?]+(?:[’”])?|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
const terminal = (s: string) => /[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`;
const quote = (s: string) => s.replace(/[.!?]$/, "");
const domainLabel: Record<string, string> = { WORK: "업무", CAREER: "직업", MONEY: "금전 판단", THINKING: "사고", COMMUNICATION: "소통", STRENGTHS: "강점", STUDY: "학습" };
const polite = (text: string) => text.replace(/않는다\.$/, "않습니다.").replace(/필요하다\.$/, "필요합니다.")
  .replace(/안정된다\.$/, "안정됩니다.").replace(/쉽다\.$/, "쉽습니다.").replace(/수 있다\.$/, "수 있습니다.")
  .replace(/올라간다\.$/, "올라갑니다.").replace(/살아난다\.$/, "살아납니다.").replace(/강하다\.$/, "강합니다.");

/** Only generation calls this independent edition. An incomplete editorial slot
 * is a diagnostic, never a new payment/Worker failure or a made-up source. */
export function renderCareerRelease(input: NarrativeInput, profiles: CareerProfiles, candidates: readonly EditorialCandidate[], legacy: CareerNarrative, state: NarrativeState) {
  const pool = collectCareerReleaseSources(profiles, candidates), used = new Map<string, number>(), roots = new Map<string, number>();
  const introduced = new Set<string>(), chosen: CareerReleaseSource[] = [], seen = new Set<string>(), terms = new Set<string>();
  const draft: CareerReleaseDraft = { version: CAREER_RELEASE_VERSION, chapters: [], bodyLength: 0, shortages: [] };
  const retainedSources: Record<string, readonly string[]> = { "career-study:natal": careerStudy(state).proof.sourceRefs };
  let current: CareerReleaseDraft["chapters"][number];
  const sourceRefs = (r: CareerReleaseSource): Refs => ({ source: r.candidate.id, roots: [r.atom.id], nodes: [], fusion: [], theme: r.candidate.semanticTheme,
    material: `career:${r.facet}`, row: r, sourceRefs: [r.candidate.sourceId] });
  const reason = (r: CareerReleaseSource) => terms.has(`${r.atom.sourceType}:${r.atom.sourceKey}`)
    ? `${current.title}에서는 ${careerAtomName(r.atom)}의 성향을 ${CAREER_TASKS[r.facet].task}에 연결해 읽습니다.`
    : `${careerAtomName(r.atom)}에 담긴 ‘${quote(r.atom.easyMeaning)}’의 뜻이 이 업무 경향의 명리 근거입니다.`;
  const rootLine = (text: string, r: CareerReleaseSource, material: string): Line => ({ text, refs: { ...sourceRefs(r), material } });
  function add(p: number, lines: Line[]) {
    const contract = CAREER_READER_CHAPTERS.find(c => c.id === current.id)!.paragraphs[p];
    const id = `${current.id}.${contract.id}`;
    const actual = lines.filter(l => l.text.trim()).map(l => ({ ...l, text: terminal(l.text) }));
    if (actual.length < 3 || actual.length > 5 || actual.some(l => split(l.text).length !== 1)) return false;
    if (actual.some(l => seen.has(l.text))) return false;
    const sentences = actual.map((l, i): CareerReleaseSentence => ({ chapterId: current.id, paragraphId: contract.id, sentenceRole: `S${i + 1}`, roleDescription: contract.sentences[i] ?? contract.sentences[3], text: l.text,
      sourceCandidateId: l.refs.source, evidenceIds: [...(l.refs.roots ?? [])], mbtiSourceNodeIds: [...(l.refs.nodes ?? [])], fusionIds: [...(l.refs.fusion ?? [])], semanticTheme: l.refs.theme,
      lifeStatus: input.context.jobStatus, jobContext: input.context.detailJob,
      provenance: { materialId: l.refs.material, application: l.refs.recall ? "RECALL" : l.refs.row ? "CONDITIONAL_APPLICATION" : "SOURCE",
        ...(l.refs.row ? { axis: l.refs.row.axis, direction: l.refs.row.direction } : {}), sourceRefs: [...(l.refs.sourceRefs ?? [])] } }));
    actual.forEach(l => { seen.add(l.text); l.refs.roots?.forEach(id => introduced.add(id)); });
    current.paragraphs.push({ id, purpose: contract.purpose, text: actual.map(l => l.text).join(" "), sentences });
    return true;
  }
  function eligible(preferred: readonly string[], risk: boolean, recall: boolean) {
    return pool.filter(r => r.candidate.factBomb === risk && (!recall || chosen.some(s => s.atom.id === r.atom.id && s.facet === r.facet))
      && (recall || (used.get(r.facet) ?? 0) < 4)
      && !current.paragraphs.some(p => p.sentences.some(s => s.provenance.materialId.startsWith(`career:${r.facet}:`))))
      .sort((a, b) => Number(preferred.includes(b.facet)) - Number(preferred.includes(a.facet))
        || (used.get(a.facet) ?? 0) - (used.get(b.facet) ?? 0)
        || Number(b.candidate.sourceType === "PERSONAL_RESONANCE") - Number(a.candidate.sourceType === "PERSONAL_RESONANCE")
        || ((profiles.mbti.generalAxes[b.axis] ?? 0) * b.direction - (profiles.mbti.generalAxes[a.axis] ?? 0) * a.direction)
        || (roots.get(a.atom.id) ?? 0) - (roots.get(b.atom.id) ?? 0)
        || b.candidate.priorityScore - a.candidate.priorityScore || b.atom.weight - a.atom.weight || a.atom.id.localeCompare(b.atom.id));
  }
  function application(p: number, key: string, make: (m: Material, r: CareerReleaseSource) => string[], preferred: readonly string[] = [], risk = false, recall = false) {
    for (const row of eligible(preferred, risk, recall)) {
      const texts = make(CAREER_RELEASE_MATERIALS[row.facet], row);
      const lines = texts.flatMap(text => split(text).map(text => ({ text, refs: { ...sourceRefs(row), material: `career:${row.facet}:${key}`, recall } })));
      if (!add(p, lines)) continue;
      used.set(row.facet, (used.get(row.facet) ?? 0) + 1); roots.set(row.atom.id, (roots.get(row.atom.id) ?? 0) + 1); chosen.push(row);
      terms.add(`${row.atom.sourceType}:${row.atom.sourceKey}`); return row;
    }
    draft.shortages.push(`${current.id}.P${p + 1}:NO_INDEPENDENT_${key.toUpperCase()}_MATERIAL`);
    return undefined;
  }
  function mbtiLine(row: CareerReleaseSource, domains: readonly string[], material: string): Line | undefined {
    const node = profiles.mbti.annotations.find(a => domains.includes(a.sourceDomain) && a.annotationConfidence !== "REFERENCE_ONLY"
      && (a.axes[row.axis] ?? 0) * row.direction > 0 && profiles.mbti.sourceNodes.some(n => n.id === a.sourceNodeId && n.classification === "SCORING_SEMANTIC"));
    if (!node || !profiles.mbti.mbtiType) return;
    const raw = profiles.mbti.sourceNodes.find(n => n.id === node.sourceNodeId)!;
    const text = split(String(raw.value))[0];
    return text ? { text: `${profiles.mbti.mbtiType}의 ${domainLabel[node.sourceDomain] ?? "행동"} 자료에서는 ‘${quote(text).replace(/^[A-Z]{4}(?:는|은)\s*/, "")}’라는 경향을 읽습니다.`,
      refs: { source: raw.id, nodes: [raw.id], theme: row.candidate.semanticTheme, material, sourceRefs: [raw.id] } } : undefined;
  }
  function moneyMbtiLine(): Line | undefined {
    const node = profiles.mbti.sourceNodes.find(n => n.sourceDomain === "MONEY" && n.classification === "SCORING_SEMANTIC" && n.id.endsWith(":plainKo") && typeof n.value === "string");
    if (!node || !profiles.mbti.mbtiType) return;
    return { text: `한편 ${profiles.mbti.mbtiType}의 금전 자료에는 ‘${quote(split(String(node.value))[0])}’라는 판단 경향이 있습니다.`,
      refs: { source: node.id, nodes: [node.id], theme: "MONEY_DECISION", material: "money:actual-mbti", sourceRefs: [node.id] } };
  }
  function fusionParagraph(p: number, key: string, preferred: "REINFORCE" | "COMPLEMENT") {
    const sources = candidates.filter(c => c.fusionType && c.fusionType !== "TENSION" && !c.invalidReasons.length)
      .sort((a, b) => Number(b.fusionType === preferred) - Number(a.fusionType === preferred) || b.priorityScore - a.priorityScore);
    for (const c of sources) {
      const f = [...profiles.fusion.reinforce, ...profiles.fusion.complements].find(f => f.id === c.sourceId);
      if (!f) continue;
      const atom = profiles.myeongli.evidence.find(a => f.myeongli.evidenceIds.includes(a.id) && (a.axes[f.myeongli.side.axis] ?? 0) * f.myeongli.side.direction > 0);
      const n = humanMbtiReason(profiles, f, "C8", freshNarrativeMemory());
      if (!atom || !n) continue;
      const refs: Refs = { source: c.id, roots: [atom.id], nodes: [n.nodeId], fusion: [f.id], theme: c.semanticTheme, material: `fusion:${key}`, sourceRefs: [c.sourceId] };
      const texts = key === "work-basis" ? [
        `${particle(careerAtomName(atom), "이", "가")} 이 업무 방식을 설명하는 실제 명리 근거입니다.`,
        atom.humanDescription ?? atom.easyMeaning,
        split(n.text)[0],
        c.sourceText,
      ] : [
        c.sourceText,
        `${careerAtomName(atom)}의 성향을 실제 MBTI 업무 선호와 함께 읽은 결과이며, ${quote(split(n.text)[0])}.`,
        "익숙한 직함 밖에서도 이 조합을 써볼 수 있으나, 실제 추천 밖의 새로운 직업을 확정하는 해석은 아닙니다.",
        "새 역할은 결과에 대한 반응과 필요한 준비를 대조하며, 낯설다는 이유로 놓친 활용 범위를 알아갈 수 있습니다.",
      ];
      const lines = texts.map((text, i) => ({ text, refs: key === "work-basis" && i < 2 ? { ...refs, nodes: [], fusion: [] } : refs }));
      if (add(p, lines)) return;
    }
    application(p, key, (m, r) => [m.core, reason(r), m.scene, m.growth], ["depth", "creation", "precision"]);
  }
  const contextRefs: Refs = { source: "input:jobStatus", theme: "CURRENT_CAREER_CONTEXT", material: "context:status", sourceRefs: ["input:jobStatus", "input:detailJob"] };
  const status = careerStatusCopy(input);
  let main: CareerReleaseSource | undefined;
  for (const c of CAREER_READER_CHAPTERS) {
    current = { id: c.id, key: c.key, title: c.title, paragraphs: [] }; draft.chapters.push(current);
    if (c.id === "CH01") {
      main = application(0, "work-identity", (m, r) => [`일에서는 ${particle(m.label, "이", "가")} 먼저 드러나며, 명리에서 읽은 ‘${quote(r.atom.easyMeaning)}’의 뜻과 연결됩니다.`, m.scene, m.value, m.closing]);
      fusionParagraph(1, "work-basis", "REINFORCE");
      application(2, "workflow", (m, r) => [...(CAREER_WORKFLOWS[r.axis] ?? [
        `처음 일을 받을 때에는 ${particle(CAREER_TASKS[r.facet].task, "이", "가")} 이번 과제에 필요한지부터 살피는 편이 좋습니다.`,
        m.process, `진행 중에는 ${particle(CAREER_TASKS[r.facet].trap, "이", "가")} 없는지 살피면, 처음의 의도와 실제 행동이 어긋나는 부분을 알아차리기 쉽습니다.`,
        `마무리에서는 ${particle(CAREER_TASKS[r.facet].result, "이", "가")} 있었는지 결과를 대조하면, 다음에도 쓸 방법과 바꿀 부분이 보입니다.`,
      ])], ["structure", "persistence", "drive", "flexibility"]);
      application(3, "work-conditions", (m, r) => [m.fit, reason(r), m.risk, `일을 고를 때에는 ${particle(m.label, "이", "가")} 필요한 실제 과제가 있는지 묻고, 그 능력을 쓸 정보와 권한도 함께 주어지는지 살피는 편이 정확합니다.`], ["autonomy", "boundary", "stability"]);
    } else if (c.id === "CH02") {
      application(0, "talent-primary", (m, r) => [`업무에서 먼저 꺼내 쓸 재능은 ${m.label}입니다.`, reason(r), m.scene, m.value]);
      application(1, "talent-secondary", (m, r) => [`다른 과제에 쓸 능력은 ${m.label}이며, 자신을 한 가지 방식으로만 설명하지 않게 해 줍니다.`, reason(r), m.collaboration, m.growth]);
      fusionParagraph(2, "talent-transfer", "COMPLEMENT");
      application(3, "talent-practice", (m, r) => [`재능을 실력으로 만들려면 ${particle(CAREER_TASKS[r.facet].result, "을", "를")} 실제 과제에서 보여 줄 수 있어야 합니다.`, r.atom.positiveMeaning ?? m.growth, m.risk, `다음 과제에는 ‘${CAREER_TASKS[r.facet].test}’를 적용하고, 고른 이유와 결과를 함께 남기는 연습이 도움이 됩니다.`]);
    } else if (c.id === "CH03") {
      application(0, "aptitude-common", (m, r) => [`적합한 일의 공통점은 ${particle(CAREER_TASKS[r.facet].task, "을", "를")} 실제로 필요로 한다는 점이며, 직함만으로 그 조건이 생기지는 않습니다.`, reason(r), m.fit, `업무 소개를 들을 때에는 ${particle(CAREER_TASKS[r.facet].criterion, "이", "가")} 있는지 묻는 편이, 좋은 회사라는 인상만으로 판단하는 것보다 정확합니다.`]);
      for (const [p, indices] of [[1, [0]], [2, [1, 2]]] as const) {
        const recs = indices.flatMap(i => legacy.recommendations[i] ? [legacy.recommendations[i]] : []);
        const lines: Line[] = recs.flatMap(rec => {
          const refs: Refs = { source: `career-route:${rec.id}`, theme: `CAREER_ROUTE:${rec.id}`, material: `route:${rec.id}`, sourceRefs: rec.proof.sourceRefs,
            roots: [], fusion: [] };
          const reasons = split(rec.reason), basis = reasons.find(text => text.includes("에서 볼 수 있는 장점을"));
          return (p === 1 ? [reasons[0], basis ?? reasons[1], reasons[1] === basis ? reasons.at(-1)! : reasons[1], ...split(rec.environment)]
            : [reasons[0], basis ?? reasons[1]]).filter(Boolean).map(text => ({ text, refs }));
        });
        // The full ranked recommendations remain in narrative.recommendations.
        // Select whole sentences, never slice characters or invent a fourth route.
        if (lines.length > 5) lines.splice(5);
        if (p === 2 && recs[1] && lines.length === 4) lines.push({ text: split(recs[1].environment)[0], refs: { source: `career-route:${recs[1].id}`, theme: `CAREER_ROUTE:${recs[1].id}`, material: `route:${recs[1].id}:environment`, sourceRefs: recs[1].proof.sourceRefs } });
        if (lines.length < 4) lines.push({ text: "직업 이름만으로 적합성이 확정되지는 않으므로, 실제 과제와 준비해야 할 역량 및 함께 일할 조건을 대조하는 과정이 필요합니다.", refs: { ...contextRefs, material: `route:conditions:${p}` } });
        if (!add(p, lines)) draft.shortages.push(`${c.id}.P${p + 1}:RECOMMENDATION_MATERIAL_SHORTAGE`);
      }
      const avoid = legacy.avoidEnvironments.slice(0, 2);
      const lines: Line[] = avoid.flatMap((a, i) => split(a.text).map(text => ({ text, refs: { source: `career-avoid:${i}`, theme: "VERIFIED_AVOID_ENVIRONMENT", material: `avoid:${i}`, sourceRefs: a.proof.sourceRefs } })));
      lines.push({ text: "같은 직무라도 이런 조건이 반복되면 대응에 시간을 더 쓰므로, 적성과 환경의 문제를 나누어야 합니다.", refs: { ...contextRefs, material: "avoid:cost" } },
        { text: "범위나 검토 순서를 합의해 바꿀 수 있는지 먼저 묻고, 조정할 권한 없이 같은 부담이 반복된다면 피할 조건으로 볼 만합니다.", refs: { ...contextRefs, material: "avoid:adjustment" } });
      add(3, lines);
    } else if (c.id === "CH04") {
      application(0, "collaboration", (m, r) => [m.collaboration, reason(r), `함께하는 사람에게 줄 기여는 ${CAREER_TASKS[r.facet].result}이며, 내 방식이 상대의 다음 작업을 어떻게 돕는지 보여 줄 수 있습니다.`, `좋은 협업을 위해서는 ${particle(CAREER_TASKS[r.facet].criterion, "을", "를")} 함께 맞추고, 상대가 내게 기대하는 정보도 들어야 합니다.`], ["care", "expression", "boundary", "flexibility"]);
      application(1, "team-role", (m, r) => [`함께하는 과제에서 ${particle(CAREER_TASKS[r.facet].task, "을", "를")} 맡아 볼 만하며, 직급보다 풀어야 할 문제로 역할을 정하는 편이 좋습니다.`, reason(r), m.scene, `다만 ${particle(CAREER_TASKS[r.facet].trap, "을", "를")} 경계하며, 내가 결정할 부분과 다른 사람에게 물어야 할 부분을 일찍 나눌 필요가 있습니다.`], ["leadership", "structure", "resource"]);
      application(2, "work-risk", (m, r) => [split(r.candidate.sourceText)[0], reason(r),
        r.candidate.sourceId === "F02_SHARP_SPEECH" ? "내용의 오류를 바로잡으려던 말이 상대의 능력을 평가하는 말처럼 들리면, 필요한 지적도 방어적인 반응에 막혀 실제 수정까지 가기 어려워질 수 있습니다." : m.risk,
        r.candidate.sourceId === "F02_SHARP_SPEECH" ? "다음에는 고칠 사실과 상대에 대한 평가를 나누고, 무엇을 바꾸면 되는지 먼저 말하면 정확한 지적을 실제 협력으로 옮기기 좋습니다." : `다음 협업에서는 ‘${CAREER_TASKS[r.facet].test}’를 조정의 기준으로 삼으면, 좋은 의도가 일방적인 부담으로 남는 일을 줄일 수 있습니다.`], [], true);
      application(3, "culture", m => [m.fit, `업무 규칙에서는 ${particle(m.label, "을", "를")} 쓸 권한과, 그 판단을 설명할 대화의 통로도 살펴야 합니다.`, m.risk, "최근 계획이 바뀐 사례와 그때 누가 결정했는지 물으면, 좋은 분위기라는 말보다 실제 운영 방식이 보입니다."], ["structure", "flexibility", "autonomy", "stability"]);
    } else if (c.id === "CH05") {
      const row = eligible([], false, false)[0];
      if (row) add(0, [{ text: `${status[0]}`, refs: contextRefs }, rootLine(`현재 활동${input.context.detailJob ? `인 ‘${input.context.detailJob}’` : ""}에 ${particle(CAREER_RELEASE_MATERIALS[row.facet].label, "을", "를")} 쓸 과제가 있는지 대조할 수 있습니다.`, row, `career:${row.facet}:current-strength`), rootLine(row.atom.shadowMeaning ?? `다만 ${particle(CAREER_TASKS[row.facet].trap, "이", "가")} 반복된다면, 능력이 있어도 다음 과제를 맡을 여유가 줄 수 있습니다.`, row, `career:${row.facet}:current-risk`), { text: status[3], refs: contextRefs }]);
      application(1, "current-application", (m, r) => [`지금 활용할 능력은 ${m.label}이며, 입력한 직업의 이름만으로 적합성이 증명되는 것은 아닙니다.`, reason(r), m.scene, `현재 활동에서 ‘${CAREER_TASKS[r.facet].test}’를 해볼 과제 하나를 고르면, 실제 역할과 재능이 만나는 지점을 알아가기 좋습니다.`]);
      application(2, "next-capability", (m, r) => [m.growth, `${careerAtomName(r.atom)}의 성향을 경력으로 넓히려면, 잘해 온 방법이 다른 조건에서도 통하는지 설명할 수 있어야 합니다.`, m.risk, `성장은 ${particle(CAREER_TASKS[r.facet].result, "이", "가")} 실제로 생겼는지로 확인할 수 있으며, 역할의 이름만 바뀌었다고 실력이 저절로 넓어지지는 않습니다.`]);
      add(3, [
        { text: `다음 선택에서는 ${particle(input.context.jobStatus === "freelancer" ? "다시 맡을 의뢰의 범위와 작업 조건" : input.context.jobStatus === "student" ? "직접 해볼 과제와 배울 사람" : input.context.jobStatus === "job_seeker" ? "보여 줄 경험과 지원할 역할" : input.context.jobStatus === "business_owner" || input.context.jobStatus === "self_employed" ? "계속 제공할 품질과 운영할 부담" : input.context.jobStatus === "employee" ? "맡을 판단과 그에 따른 평가" : "지금의 생활과 함께 감당할 활동", "을", "를")} 먼저 살펴야 합니다.`, refs: contextRefs },
        ...status.slice(1, 3).map(text => ({ text, refs: contextRefs })),
        { text: "시도한 뒤의 결과와 부담을 함께 기록하면 다음에는 무엇을 더 맡고 무엇을 줄일지 판단할 근거가 생기며, 직업 이름의 변화만을 성장으로 삼지 않아도 됩니다.", refs: contextRefs },
      ]);
    } else if (c.id === "CH06") {
      const row = pool.filter(r => !r.candidate.factBomb && r.candidate.contexts.includes("money") && r.atom.contexts.includes("money"))
        .sort((a, b) => Number(["resource", "opportunity"].includes(b.facet)) - Number(["resource", "opportunity"].includes(a.facet)) || b.atom.weight - a.atom.weight)[0];
      if (row) {
        const m = CAREER_RELEASE_MATERIALS[row.facet], n = mbtiLine(row, ["MONEY"], "money:mbti") ?? moneyMbtiLine();
        add(0, [rootLine(m.money, row, `career:${row.facet}:income`), rootLine(reason(row), row, `career:${row.facet}:income-basis`),
          ...(n ? [n] : [rootLine("수입의 크기나 자산을 입력받은 것은 아니므로, 여기서는 실제 재물 관련 성향이 업무의 값으로 이어지는 방식만 읽습니다.", row, "money:scope")]),
          rootLine(m.price, row, `career:${row.facet}:income-condition`)]);
      } else {
        const money = careerNatalMoney(state), texts = split(money.text), feature = money.proof.features[0];
        const material = state.packet.selected.find(m => m.feature === feature);
        const refs: Refs = { source: `career-natal-money:${feature}`, theme: "NATAL_ECONOMIC_VALUE", material: `money:retained:${feature}`, sourceRefs: money.proof.sourceRefs };
        retainedSources[refs.source] = money.proof.sourceRefs;
        const n = moneyMbtiLine();
        add(0, [
          { text: texts[0], refs },
          { text: material ? `기존 명리 자료의 ${particle(materialLabel(material), "을", "를")} 재물 관련 보조 근거로 읽은 것이며, 실제 재산이나 미래 수입을 확정하는 설명은 아닙니다.` : "기존 원국의 업무 성향을 경제적 가치에 연결한 해석이며, 재산이나 수입의 크기를 예측한 것은 아닙니다.", refs },
          n ?? { text: "금전 판단에 관한 MBTI 근거가 충분하지 않은 부분은 덧붙이지 않고, 현재 확인된 업무의 값만 살펴봅니다.", refs },
          { text: texts[2] ?? texts[1], refs },
        ]);
      }
      application(1, "economic-value", (m, r) => [`경제적 가치로 설명할 재능은 ${m.label}이며, 잘하는 행동이 누구의 어떤 문제를 덜어 주는지 보여야 합니다.`, reason(r), m.money, m.price]);
      application(2, "money-cost", (m, r) => [`돈과 시간의 선택에서는 ${particle(CAREER_TASKS[r.facet].trap, "이", "가")} 비용이 될 수 있으나, 실제 지출을 단정한 설명은 아닙니다.`, reason(r), m.price, `제안을 받을 때는 ${particle(m.label, "을", "를")} 쓸 기회와 미루게 될 일의 비용을 함께 보아야 자원을 과하게 쓰지 않습니다.`], [], true);
      application(3, "resource-management", (m, r) => [`자원 관리에서는 ${particle(m.label, "을", "를")} 쓰는 데 꼭 필요한 투입과, 줄여도 품질이 유지될 투입을 나누어야 합니다.`,
        input.context.jobStatus === "freelancer" || input.context.jobStatus === "self_employed" || input.context.jobStatus === "business_owner" ? "운영 비용과 생활비를 나누고, 수입이 줄어든 기간에도 지킬 약속을 살펴야 다음 제안을 급하게 고르지 않을 여유가 생깁니다." : "생활비와 배움에 쓸 자원을 나누고, 새 준비가 늘어날 때 기존 시간표에서 줄일 일도 함께 보는 편이 오래가기 좋습니다.",
        `점검에서는 ‘${quote(r.atom.shadowMeaning ?? m.risk)}’의 흐름이 시간과 대가에도 나타나는지 살펴야, 일은 늘었는데 남는 자원은 줄어든 부분을 찾기 쉽습니다.`,
        "이 관리는 더 큰 수익의 보장이 아니라, 잘하는 일을 다음 선택에도 쓸 수 있게 남기는 기술입니다."], ["resource", "stability", "boundary"]);
    } else if (c.id === "CH07") {
      const study = careerStudy(state), raw = getMbtiSourceProfile(input.mbti);
      const bridge = raw && CAREER_STUDY_BRIDGES[raw.type];
      const trait = bridge && raw?.traits?.study?.find(t => t.id === bridge.trait);
      const r = eligible(["learning", "depth", "precision", "creation"], false, false)[0];
      const node = trait && profiles.mbti.sourceNodes.find(n => n.id.includes(`:traits:study:${trait.id}:plainKo`));
      const refs: Refs = { source: node?.id ?? "career-study:natal", nodes: node ? [node.id] : [], theme: "STUDY_METHOD", material: "study:existing-bridge", sourceRefs: study.proof.sourceRefs };
      if (r) {
        const s = split(study.text);
        add(0, [{ text: s[0], refs }, { text: s[1], refs }, rootLine(`${careerAtomName(r.atom)}에서 읽은 성향은 ${particle(CAREER_TASKS[r.facet].skill, "을", "를")} 익히는 데 쓸 자원으로 볼 수 있습니다.`, r, "study:natal-basis"), { text: s[2], refs }]);
        const other = raw?.traits?.study?.find(t => t.id !== trait?.id && t.plainKo && !/아이|자녀|어린|지능|IQ|진심/.test(t.plainKo));
        const otherNode = other && profiles.mbti.sourceNodes.find(n => n.id.includes(`:traits:study:${other.id}:plainKo`));
        if (other && otherNode) {
          const otherRefs: Refs = { source: otherNode.id, nodes: [otherNode.id], theme: `STUDY:${other.id}`, material: `study:db:${other.id}`, sourceRefs: [otherNode.id, `mbti:coverage:${other.sourceCoverage}`] };
          const text = split(other.plainKo!).map(polite);
          add(1, [{ text: text[0], refs: otherRefs }, { text: text[1] ?? terminal(other.positiveUse ?? "이 학습 경향은 직접 과제를 다루며 자신의 반응과 결과를 비교할 때 더 분명하게 알 수 있습니다"), refs: otherRefs }, rootLine(CAREER_RELEASE_MATERIALS[r.facet].learning, r, "study:activity"), { text: "자신에게 맞는 환경인지는 진도를 얼마나 채웠는지보다 자료를 보지 않고 해낼 과제가 생겼는지로 살피면, 흥미와 실력의 차이를 확인하기 좋습니다.", refs: otherRefs }]);
        } else application(1, "learning-environment", (m, r) => [m.learning, reason(r), m.fit, m.growth], ["learning", "depth", "creation"]);
        if (trait?.risk && node) {
          const riskNode = profiles.mbti.sourceNodes.find(n => n.id === node.id.replace(/:plainKo$/, ":risk"));
          const riskRefs: Refs = { ...refs, source: riskNode?.id ?? node.id, nodes: [riskNode?.id ?? node.id], material: `study:risk:${trait.id}`, sourceRefs: [...(refs.sourceRefs ?? []), `mbti:${raw!.type}:traits:study:${trait.id}:risk`] };
          add(2, [{ text: `${raw!.type}의 학업 자료에서는 ‘${quote(trait.risk)}’라는 위험을 짚으며, 내 공부에도 이런 흐름이 있는지 대조할 만합니다.`, refs: riskRefs },
            ...CAREER_STUDY_REMEDIES[raw!.type].map(text => ({ text, refs: riskRefs }))]);
        } else application(2, "learning-risk", (m, r) => [m.risk, reason(r), m.learning, m.growth], ["learning", "precision", "persistence"]);
      }
      application(3, "professional-skill", (m, r) => [`자격을 고를 때에는 ${particle(CAREER_TASKS[r.facet].skill, "을", "를")} 발전시킬 과정인지 살펴야 합니다.`,
        `이 능력은 ${particle(CAREER_TASKS[r.facet].task, "을", "를")} 맡을 근거가 되므로, 증서의 이름보다 배운 뒤 할 수 있는 일이 중요합니다.`,
        input.context.jobStatus === "student" ? "학생이라면 전공 과제에서 같은 기술을 써본 뒤 다른 조건의 프로젝트로 넓혀 보면, 강의에서 배운 내용과 직접 해낼 수 있는 일을 비교하기 좋습니다." : input.context.jobStatus === "freelancer" ? "프리랜서라면 실제 의뢰의 빈틈을 메울 기술부터 익히고 작은 견본으로 적용 범위를 보여 주면, 새 서비스에 필요한 준비와 추가 대가를 함께 설명하기 좋습니다." : input.context.jobStatus === "job_seeker" ? "구직 중이라면 공고에서 요구하는 기술을 작은 과제로 보여 주고 고른 이유까지 설명하면, 자격 보유와 실제로 맡길 수 있는 능력을 함께 전하기 좋습니다." : "현재 활동에서 막힌 문제 하나를 배운 기술로 다시 풀어 보면, 더 큰 교육 과정을 고르기 전에 실제로 필요한 역량과 준비할 범위를 알아갈 수 있습니다.",
        `학습 뒤에는 ${particle(CAREER_TASKS[r.facet].result, "을", "를")} 보여 줄 결과를 남겨, 배운 시간과 실제 능력을 연결할 만합니다.`], ["learning", "precision", "depth"]);
    } else if (c.id === "CH08") {
      const fortune = candidates.find(c => c.fortune && c.claimLevel && c.claimLevel >= 2 && /^(M08|S08|S03|S04|P01)/.test(c.sourceId));
      if (fortune) {
        const plan = planFortuneReasons(fortune, profiles), atoms = [...plan.primaryReasonEvidenceIds, ...plan.secondaryReasonEvidenceIds].flatMap(id => profiles.myeongli.evidence.find(e => e.id === id) ?? []);
        const refs: Refs = { source: fortune.id, roots: atoms.map(a => a.id), theme: fortune.semanticTheme, material: "fortune:approved", sourceRefs: [fortune.sourceId] };
        const reasons = atoms.flatMap(a => fortuneReason(a) ? split(fortuneReason(a)!) : []);
        const texts = [split(fortune.sourceText)[0], reasons[0], split(positiveReward(fortune, atoms) ?? "")[0], "이 좋은 가능성은 정해진 시기의 소득이나 성공을 보장하는 예고가 아니며, 실제 역량과 맡을 기회 및 실행할 조건이 함께 있어야 업무의 결과로 이어집니다."];
        if (!add(0, texts.filter(Boolean).map(text => ({ text, refs })))) draft.shortages.push("CH08.P1:APPROVED_FORTUNE_REALIZATION_SHORTAGE");
      } else application(0, "positive-capability", (m, r) => [`좋은 가능성의 출발점은 ${m.label}이며, 확인되지 않은 재물복이나 귀인보다 실제로 쓸 수 있는 능력에서 희망을 읽는 편이 정확합니다.`, reason(r), m.scene, m.growth]);
      application(1, "recognition", (m, r) => [`상대가 당신을 다시 찾을 이유는 ${particle(m.label, "을", "를")} 통해 자기 일이 수월해졌다는 경험에서 만들어집니다.`, reason(r), m.collaboration, `기여를 드러낼 때는 ${particle(CAREER_TASKS[r.facet].result, "이", "가")} 어떤 결과에 남았는지 설명하면, 막연히 열심히 했다는 말보다 전문성이 분명해집니다.`]);
      application(2, "success-risk", (m, r) => [`성과를 이어 가는 과정에서는 ${particle(CAREER_TASKS[r.facet].trap, "을", "를")} 특히 경계해야 하며, 업무에서 읽은 약점이 장기 성장에도 비용이 될 수 있습니다.`, reason(r),
        `이 흐름이 반복되면 ${particle(CAREER_TASKS[r.facet].skill, "을", "를")} 키울 시간이 줄어들어, 지금의 방식에 더 의존하게 되는 악순환이 생길 수 있습니다.`,
        `과사용을 막으려면 ‘${CAREER_TASKS[r.facet].test}’를 결과를 돌아보는 기준으로 삼고, 다른 방법이 필요한 과제도 구분해야 합니다.`], [], true);
      application(3, "positive-activation", m => [`좋은 힘을 오래 쓰려면 ${particle(m.label, "을", "를")} 계속 증명하려 애쓰기보다, 그 힘이 필요한 과제와 조건을 골라야 합니다.`, m.fit,
        `새 역할을 고른다면, 익숙한 방식이 통하는지와 부족할 부분을 배울 여지가 있는지도 함께 살펴야 합니다.`, m.closing], [], false, true);
    } else if (c.id === "CH09") {
      application(0, "career-choice", (m, r) => [`직업 선택의 핵심 질문은 ${particle(CAREER_TASKS[r.facet].task, "을", "를")} 실제로 필요로 하는가입니다.`,
        `${particle(CAREER_TASKS[r.facet].result, "이", "가")} 그 자리에서도 가치로 인정돼야, 내 능력과 실제 역할이 만날 수 있습니다.`,
        `상담에서는 ${particle(CAREER_TASKS[r.facet].criterion, "이", "가")} 있는지 묻고, 결과를 평가할 기준도 확인할 만합니다.`,
        "하루의 과제와 책임을 구체적으로 아는 선택이, 강점을 쓸 수 없는 자리로 들어갈 위험을 줄여 줍니다."], [], false, true);
      application(1, "risk-reminder", (m, r) => [`선택 앞에서도 ${particle(CAREER_TASKS[r.facet].trap, "을", "를")} 경계해야 하며, 앞서 읽은 약점은 큰 결정에서도 반복될 수 있습니다.`,
        `${particle(m.label, "이", "가")} 필요한 일일수록 같은 방식에만 기대기 쉬우므로, 결과와 지금의 부담을 함께 돌아보아야 합니다.`,
        "요청이 늘고 시간이 줄어들면 평소의 방법을 자동으로 반복하기 쉬우니, 합의한 범위가 바뀌었는지부터 살펴야 합니다.",
        `‘${CAREER_TASKS[r.facet].test}’를 실행한 뒤 결과와 부담의 변화를 대조하면, 조정할 부분이 구체적으로 보입니다.`], [], true, true);
      application(2, "integrated-growth", (m, r) => [`먼저 ${particle(CAREER_TASKS[r.facet].task, "을", "를")} 해낸 과정을 남겨, 고른 방법과 결과를 함께 보여 줄 만합니다.`,
        `장기적으로 ${particle(CAREER_TASKS[r.facet].skill, "을", "를")} 다른 조건의 과제에도 적용하면, 맡을 범위가 넓어집니다.`,
        `${particle(CAREER_TASKS[r.facet].result, "을", "를")} 대가를 이야기할 근거로 남기면, 배운 양보다 제공한 가치로 자신을 설명하기 좋습니다.`,
        "성장은 더 바빠졌다는 느낌보다 혼자 해결하게 된 과제와, 다른 사람이 다시 사용할 결과로 확인할 만합니다."], [], false, true);
      const last = main ?? chosen[0];
      if (last) {
        const m = CAREER_RELEASE_MATERIALS[last.facet];
        const refs = { ...sourceRefs(last), recall: true, material: `career:${last.facet}:closing` };
        add(3, [
          `이 책에서 읽은 대표적인 힘은 ${m.label}이며, 직업 이름보다 실제 문제를 만났을 때 선명해집니다.`,
          last.atom.positiveMeaning ?? `다음에는 ${particle(CAREER_TASKS[last.facet].skill, "을", "를")} 키워, 이미 가진 성향을 새로운 역할의 근거로 넓힐 수 있습니다.`,
          `${particle(CAREER_TASKS[last.facet].criterion, "이", "가")} 있는지 살피면, 남들이 좋아하는 자리와 내가 힘을 쓸 자리를 가를 수 있습니다.`,
          "이 힘이 필요한 곳에 시간을 쓰면, 계속 나를 증명하려 애쓰기보다 내 힘이 쓸모 있는 경력이 남습니다.",
        ].map(text => ({ text, refs })));
      }
    }
  }
  draft.bodyLength = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n\n").length;
  const block = (p: CareerReleaseDraft["chapters"][number]["paragraphs"][number]): NarrativeBlock => ({ id: p.id, text: p.text, mode: "prose", tone: /CH04.P3|CH06.P3|CH07.P3|CH08.P3/.test(p.id) ? "shadow" : "positive",
    proof: { features: [], seedIds: [], fusionIds: [...new Set(p.sentences.flatMap(s => s.fusionIds))], sourceRefs: [...new Set(p.sentences.flatMap(s => [...s.evidenceIds, ...s.mbtiSourceNodeIds, ...s.provenance.sourceRefs]))] } satisfies NarrativeProof });
  const first = draft.chapters[0], last = draft.chapters.at(-1)?.paragraphs.at(-1);
  const narrative: CareerNarrative = { ...legacy, headline: legacy.headline, opening: first.paragraphs.map(block),
    sections: draft.chapters.slice(1).filter(c => c.paragraphs.length).map(c => ({ id: c.key, title: c.title, domain: CAREER_READER_CHAPTERS.find(x => x.id === c.id)!.domain, blocks: c.paragraphs.map(block) })),
    finalLine: last?.sentences.at(-1)?.text ?? legacy.finalLine, finalProof: last ? block(last).proof : legacy.finalProof };
  return { draft, narrative, retainedSources };
}
