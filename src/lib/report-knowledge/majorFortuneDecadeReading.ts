import { getAnnualBranchInteractions, getAnnualGanjiInfo, getTenGodForStemPair } from "./annualFortuneYearRules";
import type { AnnualBranchInteraction, EarthlyBranch, FiveElement, TenGod } from "./annualFortuneTypes";
import type { MajorFortuneEvidencePacket } from "./majorFortuneTypes";

const elements: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const positions = ["year", "month", "day", "hour"] as const;
const positionNames = { year: "연지", month: "월지", day: "일지", hour: "시지" } as const;

// Editorial emphasis, not event probability or a luck score. A single meaningful
// relation outranks any number of weak signals; chronological order only breaks ties.
export interface MajorDecadeReason {
  readonly evidenceId: string;
  readonly kind: "transition" | "cycle-relation" | "natal-relation" | "element" | "ten-god";
  readonly priority: 1 | 2 | 3 | 4;
  readonly text: string;
}
export interface MajorDecadeYear {
  readonly year: number;
  readonly ganji: string;
  readonly tenGod: TenGod;
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
  readonly cycleRelations: readonly AnnualBranchInteraction[];
  readonly natalRelations: readonly AnnualBranchInteraction[];
  readonly importance: "important" | "standard" | "quiet";
  readonly reasons: readonly MajorDecadeReason[];
  readonly evidenceIds: readonly string[];
  readonly focus: string;
  readonly detail: { readonly coreFlow: string; readonly realWorldScenes: string; readonly cautionPoint: string; readonly actionStandard: string };
}
export interface MajorDecadeReading {
  readonly version: "major-decade-v2";
  readonly thesis: string;
  readonly factors: readonly { readonly evidenceId: string; readonly text: string }[];
  readonly gains: string;
  readonly costs: string;
  readonly position: string;
  readonly previous: string;
  readonly next: string;
  readonly years: readonly MajorDecadeYear[];
  readonly phases: readonly { readonly phase: "early" | "middle" | "late"; readonly label: string; readonly headline: string; readonly body: string; readonly advice: string }[];
  readonly domains: readonly { readonly key: "work" | "money" | "relationship"; readonly title: string; readonly body: string; readonly timing: string; readonly action: string; readonly evidenceIds: readonly string[] }[];
}

// These are role-level interpretations of the existing ten-god facts, not new
// calendar rules, job predictions, or MBTI personality assignments.
const angles: Record<TenGod, { focus: string; work: string; money: string; relationship: string; risk: string; action: string }> = {
  비견: { focus: "독립적인 판단과 동료 사이의 경계", work: "자기 방식으로 끝낼 일과 동료의 검토가 필요한 일을 나누면 독립성이 고립으로 바뀌는 것을 막을 수 있습니다.", money: "내가 통제할 예산과 공동 지출을 구분하는 것이 우선이며, 남과 비슷한 수준을 맞추기 위한 소비는 따로 점검합니다.", relationship: "대등함을 원하는 장면에서는 부탁을 수락할 권리만큼 거절할 권리도 서로 인정해야 합니다.", risk: "내 기준이 분명해지는 만큼 다른 방식도 가능한 문제에서 경쟁을 만들지 않는지 살펴봅니다.", action: "단독 결정의 범위와 공동 확인이 필요한 사안을 구분해 적습니다." },
  겁재: { focus: "함께 움직일 때의 몫과 책임", work: "협업에서 속도가 나더라도 결과의 소유권과 누가 마무리할지를 먼저 구분해야 기여가 흐려지지 않습니다.", money: "공동 비용이나 부탁에 따른 지출은 호의와 손실 한도를 분리하고, 내가 감당할 몫을 넘겨 약속하지 않습니다.", relationship: "친하다는 이유로 시간과 자원을 당연하게 쓰는 관계에서는 기대를 말로 확인할 필요가 있습니다.", risk: "관계 유지를 위해 나의 부담을 숨기면 나중에 보상 기대가 한꺼번에 커질 수 있습니다.", action: "분담액·담당 범위·합의를 다시 검토할 조건을 함께 정합니다." },
  식신: { focus: "꾸준히 만들어 남기는 결과", work: "한 번의 큰 성과보다 반복해서 내놓을 수 있는 결과물의 단위를 정하면 숙련이 외부에 보이는 형태로 쌓입니다.", money: "생산에 필요한 시간과 비용을 기록해 지속 가능한 수입 구조인지 살피되, 결과물이 곧 수익이 된다고 가정하지 않습니다.", relationship: "말로 설명한 호의가 작은 돌봄이나 함께 보내는 일정으로 이어질 때 상대가 확인하기 쉽습니다.", risk: "좋아하는 활동을 늘리는 속도보다 실제로 유지할 체력과 일정의 한도가 작을 수 있습니다.", action: "반복할 결과물 하나의 분량과 피드백 주기를 정합니다." },
  상관: { focus: "기존 방식에 대한 표현과 개선", work: "불편한 절차를 발견했을 때 비판으로 끝내기보다 바꿀 대안과 시험 범위를 제시하면 표현이 업무 개선으로 이어집니다.", money: "새 방식의 기대 이익과 전환 비용을 따로 계산해야 흥미로운 제안이 생활비를 압박하지 않습니다.", relationship: "정확한 지적도 상대에게 평가처럼 들릴 수 있어, 바꾸고 싶은 행동과 사람에 대한 판단을 구분합니다.", risk: "맞는 말이라는 확신이 전달 시점과 상대의 수용 여지를 대신해 주지는 않습니다.", action: "제안의 근거와 작은 검증 방법을 붙인 뒤 반응을 확인합니다." },
  편재: { focus: "외부 기회와 거래의 범위", work: "일의 접점이 밖으로 넓어지는 선택에서는 제안을 많이 받는 것보다 끝까지 맡을 수 있는 업무를 고르는 기준이 중요합니다.", money: "유입 가능성과 실제 회수 시점을 구분하고 거래 규모를 정해야 기회 탐색이 현금 부족으로 이어지지 않습니다.", relationship: "새로운 사람과의 연결을 늘릴 때 기존 관계에 쓰던 시간까지 무의식적으로 약속하지 않는지 확인합니다.", risk: "선택지가 늘었다는 이유로 수익이나 상대의 신뢰가 이미 확보됐다고 보지 않습니다.", action: "기회마다 비용·회수일·책임 한도를 먼저 적고 비교합니다." },
  정재: { focus: "지속 가능한 수입과 생활 운영", work: "반복 업무의 양과 보상이 맞는지 살피고, 꾸준히 수행할 수 있는 범위에서 신뢰를 쌓는 방식에 초점을 둡니다.", money: "정기 수입과 고정 지출을 같은 기간으로 맞춰 보면 모호했던 부담이 드러나며 작은 비용도 누적으로 판단할 수 있습니다.", relationship: "생활의 약속을 안정적으로 지키는 장점과 상대의 변화를 허용할 여유를 함께 남겨 둡니다.", risk: "안정적인 방식을 지키느라 필요한 변경까지 미루면 관리가 통제로 느껴질 수 있습니다.", action: "고정비와 가용 시간을 확인한 뒤 조정 가능한 여유분을 남깁니다." },
  편관: { focus: "압박 속 책임과 대응 범위", work: "급한 요구가 생기는 장면에서 실행력만으로 버티기보다 맡은 책임을 수행할 권한도 주어졌는지 확인해야 합니다.", money: "빨리 결론을 내려야 하는 비용일수록 감당할 최대 손실과 중단 조건을 먼저 정해 조급함을 분리합니다.", relationship: "도와주려는 주도성이 상대에게 지시로 들리는 순간에는 상대가 선택할 여지를 다시 열어 둡니다.", risk: "압박을 견딜 수 있다는 이유로 회복이 필요한 신호까지 무시하지 않습니다.", action: "긴급 요청의 승인선과 거절 가능한 범위를 확인합니다." },
  정관: { focus: "공식적인 역할과 신뢰의 기준", work: "평가받을 기준과 맡을 역할을 명확히 하면 책임을 쌓을 수 있지만, 타인의 기대를 모두 내 업무로 받아들이지는 않습니다.", money: "규칙적으로 지켜야 할 의무 지출과 선택 지출을 구분하고 계약의 일정과 책임이 수입 계획에 맞는지 봅니다.", relationship: "관계를 오래 유지하려는 기준이 상대에게 정답을 요구하는 방식이 되지 않도록 합의의 여지를 남깁니다.", risk: "잘 해내는 사람으로 보이는 것과 실제 감당 가능한 역할 사이에 차이가 생길 수 있습니다.", action: "평가 항목·업무 경계·합의 내용을 같은 문서에 남깁니다." },
  편인: { focus: "새로운 관점과 선택적 탐색", work: "낯선 방법을 검토할 때 기존 답과 무엇이 다른지 비교하고, 조사만 늘어나지 않도록 실제 적용할 작은 문제를 정합니다.", money: "정보를 더 모으는 일과 돈을 투입하는 결정을 분리하면 새로운 관점에 끌려 비용을 먼저 확정하는 일을 줄일 수 있습니다.", relationship: "혼자 해석한 상대의 의도와 직접 확인한 말을 구분해야 생각을 정리하는 시간이 오해로 길어지지 않습니다.", risk: "충분히 이해해야 시작할 수 있다는 기준이 실행 시점을 계속 뒤로 옮길 수 있습니다.", action: "탐색을 끝낼 질문과 첫 적용 날짜를 한 쌍으로 정합니다." },
  정인: { focus: "배움과 지원을 실제 기반으로 전환", work: "배운 내용을 현재 역할에 적용하고 기록으로 남길 때 지원과 지식이 다음 일을 맡을 기반이 됩니다.", money: "교육이나 준비에 쓰는 비용은 목적과 활용 기간을 확인하고, 보호받는 조건이 끝난 뒤에도 유지 가능한지 봅니다.", relationship: "배려와 조언을 주고받되 상대가 직접 해 볼 기회까지 대신 맡지 않는 것이 관계의 자율성을 지킵니다.", risk: "안전한 준비를 충분히 하는 것과 익숙한 보호 안에만 머무르는 것을 구분할 필요가 있습니다.", action: "새로 배운 내용 하나를 실제 역할에 적용하고 결과를 기록합니다." },
};

function relationText(relation: AnnualBranchInteraction, scope: "cycle" | "natal"): string {
  const where = scope === "cycle" ? "대운 지지" : (relation.affectedPillars ?? []).map(p => positionNames[p]).join("·");
  const meaning = relation.type === "충" ? "기존 배치와 새 요구의 조정" : relation.type === "형" ? "되풀이되는 제약과 부담의 점검" : relation.type === "해" ? "겉으로 드러나지 않은 불편의 확인" : relation.type === "파" ? "유지하던 방식의 세부 수정" : "연결되는 역할과 약속의 범위 확인";
  return `${where}와 ${relation.branches.join("·")} ${relation.type}: ${meaning}`;
}
function strongest(reasons: readonly MajorDecadeReason[]): MajorDecadeReason | undefined {
  return [...reasons].sort((a, b) => b.priority - a.priority || a.evidenceId.localeCompare(b.evidenceId))[0];
}

export function buildMajorFortuneDecadeReading(packet: MajorFortuneEvidencePacket): MajorDecadeReading {
  const cycle = packet.currentCycle;
  const prefix = `major:${cycle.index}:${cycle.ganji}`;
  // Preserve natal pillar positions. Missing hour is the final item, never a
  // synthetic extra cycle branch prepended to the four natal positions.
  const natalBranches = positions.flatMap(p => {
    const branch = packet.userPillars[p]?.slice(-1);
    return branch && "子丑寅卯辰巳午未申酉戌亥".includes(branch) ? [branch as EarthlyBranch] : [];
  });
  const candidates = Array.from({ length: 10 }, (_, i) => {
    const year = cycle.startYear + i;
    const info = getAnnualGanjiInfo(year);
    const tenGod = getTenGodForStemPair(packet.dayMaster, info.stem);
    const id = `${prefix}:year:${year}:${info.ganji}`;
    const cycleRelations = getAnnualBranchInteractions({ annualBranch: info.branch, natalBranches: [cycle.branch] }).map(r => ({ ...r, affectedPillars: undefined }));
    const natalRelations = getAnnualBranchInteractions({ annualBranch: info.branch, natalBranches });
    const reasons: MajorDecadeReason[] = [];
    if (i === 0 || i === 9) reasons.push({ evidenceId: `${id}:boundary`, kind: "transition", priority: 4, text: i === 0 ? "대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다." : "다음 대운 시작의 직전 연도이며, 현재 흐름에서 남길 것과 넘길 것을 구분할 기준점입니다." });
    for (const [scope, relations] of [["cycle", cycleRelations], ["natal", natalRelations]] as const) {
      relations.forEach(r => {
        const strong = r.type === "충" || r.type === "형";
        const central = r.affectedPillars?.some(p => p === "day" || p === "month");
        reasons.push({ evidenceId: `${id}:${scope}:${r.type}:${r.branches.join("")}:${r.affectedPillars?.join("-") ?? "cycle"}`, kind: scope === "cycle" ? "cycle-relation" : "natal-relation", priority: strong ? (scope === "cycle" ? 4 : central ? 3 : 2) : 2, text: relationText(r, scope) });
      });
    }
    for (const element of new Set([info.stemElement, info.branchElement])) {
      const ko = elements[element];
      if (packet.natalLabels.includes(`${ko} 부족`)) reasons.push({ evidenceId: `${id}:element:${element}:missing`, kind: "element", priority: 2, text: `원국의 ${ko} 부족 조건에 ${ko} 기운이 들어옵니다. 보완 가능성을 보되 생활의 결과까지 보장하는 근거로 쓰지는 않습니다.` });
      if (packet.natalLabels.includes(`${ko} 과다`)) reasons.push({ evidenceId: `${id}:element:${element}:heavy`, kind: "element", priority: 2, text: `원국에서 강한 ${ko} 기운과 세운의 ${ko} 기운이 겹쳐, 이미 많이 쓰는 방식을 더 밀기보다 과부하를 점검합니다.` });
    }
    if (tenGod === packet.majorTenGod.stemTenGod) reasons.push({ evidenceId: `${id}:ten-god`, kind: "ten-god", priority: 1, text: `${tenGod}이 대운과 세운에 겹쳐 장기 과제를 같은 관점에서 다시 다룹니다.` });
    return { year, ganji: info.ganji, tenGod, stemElement: info.stemElement, branchElement: info.branchElement, cycleRelations, natalRelations, reasons, evidenceIds: [...new Set([id, `${id}:ten-god`, ...reasons.map(r => r.evidenceId)])] };
  });
  const emphasized = new Set([...candidates].filter(y => (strongest(y.reasons)?.priority ?? 0) >= 3).sort((a, b) => (strongest(b.reasons)?.priority ?? 0) - (strongest(a.reasons)?.priority ?? 0) || a.year - b.year).slice(0, 4).map(y => y.year));
  const years: MajorDecadeYear[] = candidates.map(y => {
    const angle = angles[y.tenGod];
    const reason = strongest(y.reasons);
    const importance = emphasized.has(y.year) ? "important" : y.reasons.some(r => r.priority >= 2) ? "standard" : "quiet";
    const relation = y.cycleRelations[0];
    const natal = [...y.natalRelations].sort((a, b) => Number(b.type === "충" || b.type === "형") - Number(a.type === "충" || a.type === "형"))[0];
    const cycleContrast = y.tenGod === packet.majorTenGod.stemTenGod ? `대운과 같은 ${y.tenGod} 관점이 겹칩니다.` : `${packet.majorTenGod.stemTenGod} 대운의 장기 배경에 ${y.tenGod}의 연간 질문이 더해집니다.`;
    const coreFlow = `${y.year}년 ${y.ganji} · ${y.tenGod} · ${elements[y.stemElement]}·${elements[y.branchElement]}: ${angle.focus}. ${cycleContrast}${relation && (importance !== "important" || reason?.text !== relationText(relation, "cycle")) ? ` 대운과의 ${relation.branches.join("·")} ${relation.type}은 ${relationText(relation, "cycle").split(": ")[1]}을 함께 살피게 합니다.` : ""}`;
    return { ...y, importance, focus: angle.focus, detail: {
      coreFlow: importance === "important" ? `${coreFlow} 집중해서 읽을 근거: ${reason?.text.replace(/[.。]$/u, "")}.` : coreFlow,
      realWorldScenes: importance === "important" ? `일에서는 ${angle.work}\n돈에서는 ${angle.money}\n관계에서는 ${angle.relationship}` : angle.work,
      cautionPoint: importance === "important" ? `${natal && reason?.text !== relationText(natal, "natal") ? relationText(natal, "natal") + ". " : ""}${angle.risk} ${y.reasons.find(r => r.kind === "element")?.text ?? ""}`.trim() : natal ? `${relationText(natal, "natal")}.` : angle.risk,
      actionStandard: angle.action,
    } };
  });
  const current = years.find(y => y.year === packet.currentYear)!;
  const index = packet.currentYear - cycle.startYear + 1;
  const phaseLabel = index <= 3 ? "초반" : index <= 7 ? "중반" : "후반";
  const phases = (["early", "middle", "late"] as const).map((phase, i) => {
    const group = years.slice(i === 0 ? 0 : i === 1 ? 3 : 7, i === 0 ? 3 : i === 1 ? 7 : 10);
    const lead = [...group].sort((a,b) => (strongest(b.reasons)?.priority ?? 0) - (strongest(a.reasons)?.priority ?? 0) || a.year-b.year)[0];
    const other = group.find(y => y.tenGod !== lead.tenGod && y.year !== lead.year)!;
    return { phase, label: `${["전반", "중반", "후반"][i]} · ${group[0].year}~${group.at(-1)!.year}년`, headline: `${lead.year}년 ${lead.tenGod}의 ${lead.focus}`, body: `${lead.ganji} 세운을 이 구간의 기준점으로 읽습니다. ${strongest(lead.reasons)?.text ?? "확인된 강한 경계 신호 없이 연간 역할의 변화를 살피는 구간입니다."} 같은 구간의 ${other.year}년은 ${other.ganji}·${other.tenGod}으로, ${other.focus}라는 다른 질문을 던집니다. 따라서 이 구간 전체를 한 가지 사건이나 호불호로 묶지 않습니다.`, advice: `${lead.year}년에는 ${angles[lead.tenGod].action} ${other.year}년에는 ${angles[other.tenGod].action}` };
  });
  const yearsFor = (gods: readonly TenGod[]) => years.filter(y => gods.includes(y.tenGod)).map(y => `${y.year}년 ${y.ganji}·${y.tenGod}`).join(", ");
  const domainContrasts = {
    work: `이 대운 안에서도 ${yearsFor(["식신", "상관"])}은 결과물을 내고 방식을 개선하는 질문이고, ${yearsFor(["정관", "편관"])}은 책임과 평가 기준을 다루는 질문입니다. 표현이 필요한 때에 승인만 기다리거나, 책임을 확인할 때에 아이디어만 늘어놓으면 서로 다른 과제를 혼동하기 쉽습니다. ${yearsFor(["정인", "편인"])}의 배움과 탐색은 이 둘 사이에서 실제 역할에 쓸 지식인지 점검하는 연결로 읽습니다. 같은 직업 안에서도 결과물을 만드는 일, 책임을 맡는 일, 다음 일을 배우는 일의 비중을 나눠 볼 수 있습니다.`,
    money: `${yearsFor(["편재"])}의 외부 거래와 ${yearsFor(["정재"])}의 반복 수입·지출 관리는 같은 질문이 아닙니다. 전자는 무엇을 더 연결할지와 회수 조건, 후자는 지금 유지하는 구조의 비용을 살피는 관점입니다. ${yearsFor(["식신", "상관"])}에 읽는 생산·표현은 그 자체로 수익의 보장이 아니므로 팔리는 결과와 쌓이는 결과를 구분합니다. ${yearsFor(["겁재"])}에는 공동 비용과 각자의 부담을 분리해 보는 관점이 더해집니다. 이 순서는 돈이 들어오는 날짜표가 아니라 연도별로 다른 재정 의사결정의 질문입니다.`,
    relationship: `${yearsFor(["비견", "겁재"])}에는 대등함과 몫을, ${yearsFor(["정관", "편관"])}에는 약속과 책임의 요구를 서로 구분해서 읽습니다. 독립적으로 결정하고 싶은 요구와 함께 지켜야 할 기준은 같은 관계 안에도 공존할 수 있습니다. ${yearsFor(["식신", "상관"])}의 표현은 평소의 의도가 상대에게 전달되는 방식에 초점을 둡니다. 내 의도를 충분히 설명했다는 사실만으로 상대의 부담까지 줄어들었다고 보지 말고, 상대가 실제로 맡은 일과 자유롭게 선택할 수 있는 영역을 확인합니다. 관계의 좋고 나쁨보다 이 질문이 두 사람 사이에서 어떻게 다르게 받아들여지는지가 중요합니다.`,
  };
  const main = angles[packet.majorTenGod.stemTenGod];
  const cycleReading = (c: NonNullable<MajorFortuneEvidencePacket["previousCycle"]>) => `${c.startYear}~${c.endYear}년 ${c.ganji}(${getTenGodForStemPair(packet.dayMaster,c.stem)}, ${elements[c.stemElement]}·${elements[c.branchElement]})`;
  const previous = packet.previousCycle ? `이전 ${cycleReading(packet.previousCycle)}에서 현재 ${cycleReading(cycle)}로 바뀌었습니다. 이전의 ‘${angles[getTenGodForStemPair(packet.dayMaster,packet.previousCycle.stem)].focus}’에서 이번에는 ‘${main.focus}’ 중심으로 질문이 옮겨갑니다. 과거의 역량이 사라진다는 뜻이 아니라 그 역량을 쓰는 역할과 비용의 기준이 달라졌는지 살펴보는 비교입니다.` : `계산된 첫 대운 ${cycleReading(cycle)}입니다. 이전 대운이 없으므로 임의의 비교 구간을 만들지 않습니다.`;
  const next = packet.nextCycle ? `다음은 ${cycleReading(packet.nextCycle)}입니다. ${getTenGodForStemPair(packet.dayMaster,packet.nextCycle.stem) === packet.majorTenGod.stemTenGod ? "천간 십성은 이어지지만 간지와 오행 구성이 달라집니다." : `중심 질문이 ‘${main.focus}’에서 ‘${angles[getTenGodForStemPair(packet.dayMaster,packet.nextCycle.stem)].focus}’ 중심으로 옮겨갑니다.`} 지금 쌓은 결과 중 다음 역할에도 사용할 것과 현재의 부담으로만 남는 것을 나눠 보는 연결이며, 특정 사건의 확정 예측은 아닙니다.` : "확인된 다음 대운표가 없어 다음 간지나 전환 시점을 임의로 덧붙이지 않습니다.";
  return {
    version: "major-decade-v2", thesis: `${cycle.startYear}~${cycle.endYear}년 ${cycle.ganji} 대운은 ‘${main.focus}’라는 질문을 긴 호흡으로 다루는 구간입니다. ${packet.dayMaster} 일간에게 대운 천간은 ${packet.majorTenGod.stemTenGod}이며, ${elements[cycle.stemElement]}·${elements[cycle.branchElement]} 기운이 원국과 만나는 방식까지 함께 읽습니다.`,
    factors: [{ evidenceId: `${prefix}:ten-god`, text: `${packet.dayMaster} 일간을 기준으로 ${cycle.ganji} 대운의 천간 ${cycle.stem}을 읽는 십성은 ${packet.majorTenGod.stemTenGod}입니다.` }, { evidenceId: `${prefix}:elements`, text: packet.elementEffect.plain }, ...packet.branchInteractions.map((relation,index)=>({relation,index})).sort((a,b)=>Number(b.relation.type === "충" || b.relation.type === "형") - Number(a.relation.type === "충" || a.relation.type === "형")).slice(0,2).map(({relation,index})=>({evidenceId:`${prefix}:natal:${index}`,text:relationText(relation,"natal")}))],
    gains: main.work, costs: main.risk,
    position: `${packet.currentYear}년은 이 대운의 ${index}년차, ${phaseLabel}입니다. ${index === 1 ? "교운이 포함된 연도이므로 이전·이후 흐름을 구분합니다." : index === 10 ? "다음 대운 시작의 직전 연도입니다." : `현재 연도에서는 ‘${current.focus}’에 초점을 두되, 이미 지난 ${index-1}개 연도와 남은 ${10-index}개 연도를 구분해 읽습니다.`}`,
    previous, next, years, phases,
    domains: (["work","money","relationship"] as const).map((key,i)=>{
      const relevant = years.filter(y => key === "money" ? /재|식신|상관|겁재/.test(y.tenGod) : key === "relationship" ? y.natalRelations.some(r=>r.affectedPillars?.includes("day")) || /비견|겁재/.test(y.tenGod) : /관|식신|상관|인/.test(y.tenGod));
      const selected = [...relevant].sort((a,b)=>Number(b.importance==="important")-Number(a.importance==="important") || a.year-b.year).slice(0,2);
      return { key, title: ["이 10년의 일과 역할","돈의 흐름과 감당할 범위","관계에서 달라지는 요구"][i], body: `${domainContrasts[key]}\n${cycle.ganji} 대운의 ${packet.majorTenGod.stemTenGod}을 이 영역에 적용하면, ${main[key]} ${key === "work" ? "직업명을 단정하기보다 지금 맡은 일에서 이 방식이 도움이 되는 조건과 과해지는 조건을 구분합니다." : key === "money" ? "수입 규모나 투자 수익을 예측하는 것이 아니라, 이 10년 동안 어떤 기준으로 벌고 쓰고 책임질지를 읽는 대목입니다." : "관계의 확대나 결혼·이별을 확정하지 않고, 실제로 어떤 기대가 쌓이고 조율이 필요한지 확인하는 관점입니다."}`, timing: selected.map(y=>`${y.year}년 ${y.ganji}·${y.tenGod}: ${angles[y.tenGod][key]}${key === "relationship" && y.natalRelations.some(r=>r.affectedPillars?.includes("day")) ? ` ${relationText(y.natalRelations.find(r=>r.affectedPillars?.includes("day"))!,"natal")}.` : ""}`).join("\n"), action: key === "work" ? main.action : key === "money" ? "새로운 수입의 기대, 이미 확정한 지출, 손실을 멈출 기준을 별도로 기록하고 연도별 요구가 바뀔 때 다시 비교합니다." : "상대의 의도와 실제로 합의한 부담을 구분하고, 시간을 내는 방식과 부탁을 거절할 조건을 함께 확인합니다.", evidenceIds:[`${prefix}:ten-god`, ...years.map(y=>y.evidenceIds[0]), ...selected.flatMap(y=>y.evidenceIds)] };
    }),
  };
}

export function withMajorFortuneDecadeReading(packet: MajorFortuneEvidencePacket): MajorFortuneEvidencePacket {
  const reading = buildMajorFortuneDecadeReading(packet);
  const strong = reading.years.filter(y => y.importance === "important");
  const rowFor = (year: number) => reading.years.find(y => y.year === year)!;
  return {
    ...packet,
    decadeReading: reading,
    cyclePosition: { ...packet.cyclePosition, progressLabel: reading.position },
    previousToCurrentShift: { ...packet.previousToCurrentShift, plain: reading.previous },
    strongYearsWithinCycle: strong.map(y => ({
      year: y.year, ganji: y.ganji, reason: strongest(y.reasons)!.text,
      area: y.focus, action: y.detail.actionStandard, headline: y.focus,
      whyStrong: y.reasons.filter(r => r.priority >= 3).map(r => r.text).join(" "),
      likelyArea: /재/.test(y.tenGod) ? "돈·현실관리" : /인/.test(y.tenGod) ? "학업·자격증" : /비견|겁재/.test(y.tenGod) ? "관계" : "일·성과",
      pushStrategy: y.detail.actionStandard,
      reduceStrategy: `${y.ganji}년에는 ${y.focus}에서 맡을 범위를 넓히기 전에 한도를 확인합니다.`,
    })),
    majorFortuneTimelineRows: packet.majorFortuneTimelineRows.map(row => {
      const y = rowFor(row.year);
      return { ...row, badges: [...row.badges.filter(b => b !== "강함"), ...(y.importance === "important" ? ["강함" as const] : [])], keyInteractionLabel: [...y.cycleRelations.map(r=>relationText(r,"cycle")),...y.natalRelations.map(r=>relationText(r,"natal"))].join(" / ") || "별도 지지 합충 신호 없음", oneLine: `${y.tenGod} · ${y.focus}${y.cycleRelations.length ? ` / ${y.cycleRelations.map(r => r.branches.join("")+" "+r.type).join("·")}` : y.natalRelations.length ? ` / ${relationText(y.natalRelations[0], "natal")}` : ""}`, strategy: y.detail.actionStandard };
    }),
    cycleYearTimeline: packet.cycleYearTimeline.map(row => {
      const y = rowFor(row.year);
      return { ...row, headline: y.focus, roleOfYearInCycle: `${y.ganji}·${y.tenGod}으로 보는 ${y.focus}`, plainInterpretation: y.detail.coreFlow, strategicFocus: y.detail.actionStandard, whyItMatters: strongest(y.reasons)?.text ?? "강한 경계 신호를 덧붙이지 않고 연간 역할과 생활의 변화를 살핍니다." };
    }),
  };
}
