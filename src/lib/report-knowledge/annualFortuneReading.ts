import type { AnnualFortuneEvidencePacket } from "./annualFortuneEvidence";
import type { AnnualCalendarMonth, AnnualMonthSegment, AnnualJieRelationFact } from "./annualMonthJie";
import type { TenGod } from "./annualFortuneTypes";
import { productBridgeScenes, type BridgeInteractionScene } from "./bridge/interactionScenes";
import { getTenGodForStemPair } from "./annualFortuneYearRules";
import type { HeavenlyStem } from "./annualFortuneTypes";

type Domain = "work" | "money" | "relationship" | "growth";
type Group = "peer" | "output" | "resource" | "responsibility" | "learning";
type Reason = { kind: "transition" | "natal" | "annual" | "dayun" | "theme"; text: string; evidenceIds: readonly string[] };
export type AnnualReadingSegment = {
  startKst: string; endKstExclusive: string; evidenceIds: readonly string[];
  core: string; balance: string; action: string; scenes: readonly string[];
};
export type AnnualReadingMonth = {
  month: number; tier: "transition" | "focus" | "basic"; title: string;
  reasons: readonly Reason[]; segments: readonly AnnualReadingSegment[];
};
export type AnnualFortuneReading = {
  version: "annual-reading-v2"; selectedYear: number;
  headline: string; gains: string; costs: string;
  factors: readonly { text: string; evidenceIds: readonly string[] }[];
  crossPeriods: readonly { startKst: string; endKstExclusive: string; text: string; evidenceIds: readonly string[] }[];
  domains: readonly { key: Domain; title: string; body: string; scenes: readonly string[]; action: string; evidenceIds: readonly string[] }[];
  bridge: readonly BridgeInteractionScene[];
  months: readonly AnnualReadingMonth[];
  actions: readonly string[];
};

function particle(value: string, kind: "object" | "subject" | "with" | "to" | "topic"): string {
  const last = value.replace(/[)\s]+$/u, "").slice(-1).charCodeAt(0);
  const final = last >= 0xac00 && last <= 0xd7a3 ? (last - 0xac00) % 28 : 0;
  const pair = kind === "object" ? ["을", "를"] : kind === "subject" ? ["이", "가"] : kind === "with" ? ["과", "와"] : kind === "topic" ? ["은", "는"] : ["으로", "로"];
  return value + pair[final && !(kind === "to" && final === 8) ? 0 : 1];
}

const group: Record<TenGod, Group> = { 비견: "peer", 겁재: "peer", 식신: "output", 상관: "output", 정재: "resource", 편재: "resource", 정관: "responsibility", 편관: "responsibility", 정인: "learning", 편인: "learning" };
// Interpretation questions, not new astronomical facts or strength claims.
const role: Record<TenGod, { focus: string; gain: string; cost: string; action: string }> = {
  비견: { focus: "자기 몫과 동등한 협력", gain: "스스로 결정할 영역을 확보하고 비슷한 입장의 사람과 나눠 맡는 것", cost: "공동 작업에서도 자신의 방식만 기준으로 삼는 것", action: "같이 할 일과 혼자 결정할 일을 나눠 적고 담당자를 정합니다." },
  겁재: { focus: "경쟁과 공동 자원의 경계", gain: "혼자 감당하던 과제를 동료와 분담하며 실행력을 모으는 것", cost: "친분 때문에 시간·비용의 부담까지 구분하지 않는 것", action: "함께 쓰는 돈과 시간을 개인 몫에서 분리하고 추가 부담의 승인선을 정합니다." },
  식신: { focus: "꾸준히 내놓을 결과물", gain: "익힌 능력을 실제 작업과 표현으로 꺼내 반복 가능한 결과를 쌓는 것", cost: "만드는 재미에 몰입해 마감과 체력의 한도를 넘기는 것", action: "완성 기준을 먼저 정한 뒤 공개할 분량과 피드백 날짜를 묶습니다." },
  상관: { focus: "표현과 기존 방식의 개선", gain: "불편한 절차를 발견하고 실제로 시험할 대안을 제시하는 것", cost: "맞는 지적이라도 상대에게 능력 평가처럼 전달하는 것", action: "바꿀 절차와 작은 시험 범위를 제안하고 사람에 대한 판단은 분리합니다." },
  정재: { focus: "지속할 수입과 생활 운영", gain: "반복 업무와 지출을 일정한 단위로 관리해 유지할 기반을 만드는 것", cost: "안정된 방식을 지키려다 필요한 조정까지 미루는 것", action: "고정 지출과 확정 수입을 같은 기간에 놓고 남는 여유를 확인합니다." },
  편재: { focus: "외부 제안과 거래 범위", gain: "바깥의 사람과 자원을 연결하고 새로운 선택지를 비교하는 것", cost: "기회가 보인다는 이유로 회수되지 않은 돈과 시간을 먼저 쓰는 것", action: "제안별 투입액·회수일·책임 한도를 적고 지금 감당할 것만 고릅니다." },
  정관: { focus: "공식 역할과 신뢰 기준", gain: "맡은 책임의 기준을 분명히 해 결과를 평가받을 통로를 만드는 것", cost: "잘 해내려는 마음으로 타인의 기대까지 전부 떠안는 것", action: "평가 항목과 업무 범위를 확인하고 변경 요청은 기존 일정과 함께 검토합니다." },
  편관: { focus: "긴급한 요구와 책임의 한계", gain: "제약 속에서도 무엇부터 처리할지 정하고 실행 범위를 확보하는 것", cost: "압박에 대응하느라 필요한 권한이나 회복 시간을 놓치는 것", action: "급한 요청부터 승인자·마감·거절 가능한 범위를 확인합니다." },
  정인: { focus: "학습과 지원의 활용", gain: "배운 내용과 주변의 도움을 자신의 수행 능력으로 옮기는 것", cost: "준비와 보호가 충분해야만 시작할 수 있다고 느끼는 것", action: "배운 내용을 적용할 과제 하나를 골라 도움 없이 해 본 결과를 남깁니다." },
  편인: { focus: "다른 관점과 선택적 탐색", gain: "기존 답에서 벗어나 자료와 경험을 새롭게 연결하는 것", cost: "가능한 설명이 늘수록 실행할 결정을 계속 미루는 것", action: "조사를 끝낼 질문을 정하고 첫 적용 결과로 다음 탐색을 좁힙니다." },
};
const domains: Record<Group, Record<Domain, { scene: string; action: string }>> = {
  peer: {
    work: { scene: "동료와 같은 과제를 맡는다면 누가 결론을 내리고 누가 결과를 책임지는지가 중요합니다. 의견을 많이 보태는 것과 실제 업무를 분담하는 것을 구분해야 공동 성과가 개인의 과로로 바뀌지 않습니다.", action: "담당 범위와 서로 검토할 지점을 분리한 업무표를 만듭니다." },
    money: { scene: "공동 지출이나 함께 쓰는 자원에서는 총액보다 각자의 부담과 사용 권한을 먼저 봅니다. 남의 소비 속도나 성과에 맞춰 자신의 예산을 늘리는 장면이라면 비교에서 잠시 떨어져 실제 가용액을 확인할 필요가 있습니다.", action: "공동 비용은 개인 예산과 별도로 기록하고 추가 지출은 다시 합의합니다." },
    relationship: { scene: "동등하게 대우받고 싶은 마음이 앞설 때 도움의 양이나 연락 횟수를 점수처럼 비교하기 쉽습니다. 상대가 대신 해 주길 바라는 일과 스스로 선택하고 싶은 일을 구분해 말하면 가까움과 독립성을 함께 지킬 수 있습니다.", action: "서로 맡을 일과 각자 결정할 일을 한 번씩 말해 봅니다." },
    growth: { scene: "동료와 함께 배우는 환경은 실행을 자극하지만 비교 대상이 계속 바뀌면 자신의 진도가 흐려집니다. 함께 점검하는 시간과 혼자 문제를 푸는 시간을 나누면 남의 속도에 끌려가기보다 내 약점을 확인할 수 있습니다.", action: "함께 공부할 주제와 혼자 검증할 과제를 분리합니다." },
  },
  output: {
    work: { scene: "배운 것과 생각한 것을 결과물로 꺼내는 단계에 초점을 둡니다. 프로젝트에서 새 제안을 하더라도 완성본 전체를 기다리기보다 상대가 판단할 작은 시제품을 먼저 내면 표현의 장점이 실제 피드백으로 돌아옵니다.", action: "첫 공개 범위와 수정 횟수를 정해 작업을 밖으로 꺼냅니다." },
    money: { scene: "능력과 결과물을 돈으로 연결하려는 선택에서는 판매 가능성만큼 제작 시간과 수정 비용이 중요합니다. 많이 만들었다는 사실을 이익으로 보지 말고 실제 회수한 금액과 소모한 자원을 따로 적어 봅니다.", action: "작업 한 건의 시간·비용·회수액을 같은 기록에 남깁니다." },
    relationship: { scene: "말과 행동으로 마음을 드러내는 일이 관계의 접점이 됩니다. 설명을 잘한 것과 상대가 이해한 것은 다르므로 조언을 더하기 전에 듣고 싶은 이야기인지 확인하면 표현이 평가로 들리는 일을 줄일 수 있습니다.", action: "내 설명을 더하기 전에 상대가 원하는 반응을 묻습니다." },
    growth: { scene: "읽고 이해한 내용을 직접 설명하거나 만들어 보는 방식으로 학습의 빈틈을 찾습니다. 자료를 다시 읽는 것보다 짧은 발표·풀이·실습을 남기면 어디서 막혔는지 보이고 다음 복습 범위도 구체화됩니다.", action: "한 주제의 설명이나 실습 결과를 남긴 뒤 막힌 부분만 다시 공부합니다." },
  },
  resource: {
    work: { scene: "성과를 지속 가능한 운영으로 연결하는 질문이 중요합니다. 새로운 고객이나 업무가 늘어도 수행 시간과 보상 조건이 맞지 않으면 외형만 커질 수 있으므로 반복 가능한 일과 일회성 요청을 구분해서 맡습니다.", action: "반복 업무의 소요 시간과 보상을 확인하고 맡을 수량을 정합니다." },
    money: { scene: "수입의 가능성과 실제 사용 가능한 현금을 구분하는 관점입니다. 거래를 넓힐 때는 회수까지 걸리는 기간을, 유지할 때는 고정비가 쌓이는 기간을 함께 봐야 규모보다 운영의 안정성을 판단할 수 있습니다.", action: "입금일과 지출일을 달력에 놓고 먼저 비는 구간을 확인합니다." },
    relationship: { scene: "돈이나 생활의 약속을 통해 신뢰를 확인하려는 장면을 살핍니다. 현실을 챙기는 제안이 상대에게 간섭으로 들릴 수 있으므로 정해 둘 공동 기준과 상대가 바꿀 수 있는 선택지를 구분해 설명합니다.", action: "함께 부담하는 비용과 각자 자유롭게 쓸 몫을 나눕니다." },
    growth: { scene: "배움에 투입할 시간과 비용을 실제 활용 과제에 맞춰 고르는 관점입니다. 자격이나 수업을 더하는 결정 전에 어느 업무에 언제 쓸지 적어 두면 수집한 자료가 활용되지 않은 채 쌓이는 것을 줄일 수 있습니다.", action: "학습 비용마다 적용할 과제와 활용 시점을 연결합니다." },
  },
  responsibility: {
    work: { scene: "역할을 인정받을 기회와 책임을 감당할 조건을 같이 봅니다. 직장이나 프로젝트에서 요청이 커졌다면 평가 항목뿐 아니라 결정권·지원 인력·마감 조정 권한이 주어졌는지 확인해야 오래 수행할 수 있습니다.", action: "책임이 추가되는 순간 필요한 권한과 자원을 함께 요청합니다." },
    money: { scene: "의무 지출과 선택 지출을 구분하는 관점입니다. 지켜야 할 계약이나 생활비가 먼저 정해져 있을 때 급한 제안에 반응하면 여유가 줄 수 있으므로 새 부담은 이미 약속한 금액과 함께 놓고 판단합니다.", action: "기존 의무 지출을 먼저 떼어 놓고 추가 부담의 한도를 정합니다." },
    relationship: { scene: "관계를 지키려는 책임감이 상대의 방식까지 관리하는 태도로 보이지 않는지 살핍니다. 약속을 어겼을 때 사람 전체를 평가하기보다 어떤 행동과 일정이 달라져야 하는지 말하는 편이 대화를 이어가기 쉽습니다.", action: "지켜야 할 약속을 행동으로 설명하고 방법은 함께 정합니다." },
    growth: { scene: "시험·자격·업무 평가처럼 기준이 공개된 배움에서는 채점 항목과 연습을 연결합니다. 모든 것을 잘하려 하기보다 필수 항목을 실제로 수행할 수 있는지 확인하고 회복 시간을 일정에서 먼저 확보합니다.", action: "평가 항목별로 연습 결과를 남기고 준비 시간의 상한을 정합니다." },
  },
  learning: {
    work: { scene: "자료와 경험을 정리해 실제 역할에서 쓸 수 있는 기준으로 바꾸는 관점입니다. 익숙하지 않은 업무라면 조언을 구하되 판단을 계속 맡기지 않고 한 번 적용해 본 뒤 질문을 좁히면 지원이 자기 능력으로 남습니다.", action: "조언 하나를 실제 과제에 적용하고 달라진 결과를 확인합니다." },
    money: { scene: "준비와 학습에 쓰는 비용을 무조건 필요한 투자로 묶지 않습니다. 더 많은 정보가 더 나은 결정을 보장하지는 않으므로 비용을 지출하기 전에 필요한 질문과 이미 확보한 자료를 나눠 보는 편이 좋습니다.", action: "구매할 정보와 이미 가진 정보를 비교한 뒤 추가 비용을 정합니다." },
    relationship: { scene: "상대를 이해하려는 마음이 조언을 대신 결정해 주는 방식이 되지 않는지 살핍니다. 혼자 충분히 생각했다고 느끼더라도 상대의 현재 요구와 다를 수 있어 도움이 필요한 범위를 먼저 확인하는 것이 중요합니다.", action: "내가 생각한 해답보다 상대가 지금 받고 싶은 도움을 묻습니다." },
    growth: { scene: "학습 자체가 중심 질문이지만 준비가 길어지는 만큼 실전 검증을 빠뜨리지 않습니다. 이해한 내용을 자료 없이 설명하고 틀린 대목을 다시 찾으면 기억과 적용의 차이가 보여 공부량보다 학습 방식을 조정할 수 있습니다.", action: "자료를 닫고 설명해 본 뒤 막힌 부분만 다시 확인합니다." },
  },
};
const domainNames: Record<Domain, string> = { work: "일·커리어", money: "돈과 자원", relationship: "관계와 거리", growth: "공부·성장과 관리" };
const elements = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const pillarNames = { year: "연지", month: "월지", day: "일지", hour: "시지" };
const ganji = (s: AnnualMonthSegment) => s.monthPillar.stem + s.monthPillar.branch;
const dayunLabel = (s: AnnualMonthSegment) => [
  ...(s.activeDayunContext.includesBeforeFirstCycle ? ["첫 대운 시작 전"] : []),
  ...s.activeDayunContext.cycles.map(c => c.ganji),
].join(" / ");
const period = (s: { startKst: string; endKstExclusive: string }) => `${s.startKst.slice(5, 16).replace("T", " ")}부터 ${s.endKstExclusive.slice(5, 16).replace("T", " ")} 전까지`;
const relationActions = {
  충: "기존 일정과 새 요청을 나란히 놓고 바꿀 순서와 담당자를 먼저 확인합니다.",
  형: "되풀이되는 요구의 원인을 기록하고 같은 부담을 다시 맡기 전에 조건을 바꿉니다.",
  해: "의도와 다르게 전달된 말이 있다면 추측으로 결론내리지 말고 실제 약속을 확인합니다.",
  파: "유지할 약속과 수정할 세부 절차를 나눠 작은 변경을 먼저 합의합니다.",
  육합: "함께하기 쉬운 접점에서도 맡을 범위와 종료 기준을 따로 정합니다.",
  삼합: "여러 역할을 모을 때 공통 목표와 각자의 기여를 먼저 확인합니다.",
  반합: "연결 가능성을 완성된 합의로 보지 말고 부족한 조건을 확인한 뒤 움직입니다.",
};
export function annualRelationLabel(f: AnnualJieRelationFact): string {
  if (f.source === "month_natal_element") return f.type === "missing_element_present"
    ? `원국에서 부족한 ${elements[f.element]}의 유입` : `원국에 많은 ${elements[f.element]}을 더하는 작용`;
  const where = f.source === "month_natal_branch" ? `원국 ${f.affectedPillars.map(p => pillarNames[p]).join("·")}`
    : `${f.counterpart.pillar} ${f.source === "month_annual_branch" ? "세운" : "대운"}`;
  return `${where}와 ${f.participants.join("·")} ${f.type}${f.certainty === "conditional" ? "(해당 대운일 경우)" : ""}`;
}
function isSupport(f: AnnualJieRelationFact) { return ["육합", "삼합", "반합", "missing_element_present"].includes(f.type); }
function keyFact(s: AnnualMonthSegment): AnnualJieRelationFact | undefined {
  // Categorical reading order; repeated fact count cannot increase priority.
  return s.relationFacts.find(f => f.source === "month_natal_branch" && ["충", "형"].includes(f.type) && f.affectedPillars.some(p => p === "day" || p === "month"))
    ?? s.relationFacts.find(f => f.source === "month_dayun_branch" && ["충", "형"].includes(f.type))
    ?? s.relationFacts.find(f => f.source === "month_annual_branch" && ["충", "형"].includes(f.type))
    ?? s.relationFacts.find(f => f.source === "month_natal_branch") ?? s.relationFacts[0];
}
function reasonForMonth(m: AnnualCalendarMonth, annual: TenGod): { priority: number; reasons: Reason[] } {
  const transition = m.segments.filter(s => s.uncertainty.length || s.boundaryReason.some(b => b.startsWith("dayun")));
  const yearChange = m.segments.find((s, i) => i > 0 && s.effectiveAnnualPillar.stem !== m.segments[i - 1].effectiveAnnualPillar.stem);
  if (transition.length || yearChange) return { priority: 4, reasons: [
    ...transition.map(s => ({ kind: "transition" as const, text: s.uncertainty.length ? "교운 가능 범위에 걸쳐 이전·다음 대운을 함께 살펴야 합니다." : "실제 교운을 경계로 월운이 만나는 10년 배경이 바뀝니다.", evidenceIds: [s.evidenceIds[2]] })),
    ...(yearChange ? [{ kind: "transition" as const, text: "입춘 전후로 월주와 유효 연주가 함께 바뀌므로 두 구간을 구분합니다.", evidenceIds: [yearChange.evidenceIds[0], yearChange.evidenceIds[1]] }] : []),
  ] };
  // Carry-over segments are explained, but do not select the same onset twice.
  const newSegments = m.segments.filter(s => s.boundaryReason.some(b => b.startsWith("jie:")));
  for (const scope of ["month_natal_branch", "month_dayun_branch", "month_annual_branch"] as const) {
    for (const s of newSegments) {
      const f = s.relationFacts.find(f => f.source === scope && ["충", "형"].includes(f.type) && (f.source !== "month_natal_branch" || f.affectedPillars.some(p => p === "day" || p === "month")));
      if (f) return { priority: scope === "month_natal_branch" ? 3 : 2, reasons: [{ kind: scope === "month_natal_branch" ? "natal" : scope === "month_dayun_branch" ? "dayun" : "annual", text: `${period(s)}의 ${annualRelationLabel(f)}를 생활 조정의 관점에서 더 자세히 읽습니다.`, evidenceIds: [f.id] }] };
    }
  }
  const s = newSegments.find(s => group[s.stemTenGod] === group[annual]);
  const f = s?.relationFacts.find(f => ["육합", "삼합"].includes(f.type));
  return s && f ? { priority: 1, reasons: [{ kind: "theme", text: `${s.stemTenGod} 월간이 선택 연도 핵심 ${annual}의 질문과 연결되며 ${annualRelationLabel(f)}를 함께 살핍니다.`, evidenceIds: [s.evidenceIds[3], f.id] }] } : { priority: 0, reasons: [] };
}

function segmentReading(s: AnnualMonthSegment, annual: TenGod, tier: AnnualReadingMonth["tier"], previous?: AnnualMonthSegment, following?: AnnualMonthSegment, month?: number): AnnualReadingSegment {
  const front = role[s.stemTenGod], base = role[s.branchTenGod], fact = keyFact(s);
  const support = s.relationFacts.find(isSupport), friction = s.relationFacts.find(f => !isSupport(f));
  const continuation = previous && ganji(previous) === ganji(s) && JSON.stringify(previous.activeDayunContext) === JSON.stringify(s.activeDayunContext)
    && JSON.stringify(previous.effectiveAnnualPillar) === JSON.stringify(s.effectiveAnnualPillar);
  const transitionOnly = previous && ganji(previous) === ganji(s) && !continuation;
  const qualifies = s.uncertainty.length ? "교운 후보별로 조건이 다릅니다. " : "";
  const balance = support && friction && (support.certainty === "conditional" || friction.certainty === "conditional")
    ? `${qualifies}${particle(annualRelationLabel(support), "with")} ${particle(annualRelationLabel(friction), "object")} 살피되, 조건부 작용은 해당 대운이 적용될 때만 읽습니다. 모든 후보의 작용을 동시에 확정하지 않습니다.`
    : support && friction ? `${qualifies}${particle(annualRelationLabel(support), "with")} ${particle(annualRelationLabel(friction), "subject")} 겹칩니다. 연결할 접점과 조정할 부담을 서로 상쇄된 것으로 보지 않습니다.`
    : support ? `${qualifies}${particle(annualRelationLabel(support), "object")} 활용할 접점으로 읽습니다.`
    : friction ? `${qualifies}${particle(annualRelationLabel(friction), "object")} 조정이 필요한 지점으로 읽습니다.`
    : `${qualifies}계산된 지지 관계와 부족·과다 오행 작용이 없는 구간입니다. ${s.stemTenGod}·${s.branchTenGod}의 생활 질문에 집중합니다.`;
  let core = `${ganji(s)}의 월간 ${particle(s.stemTenGod, "topic")} ${front.focus}, 월지 본기 ${particle(s.branchTenGod, "topic")} ${particle(base.focus, "object")} 살피는 근거입니다. `
    + (group[s.stemTenGod] === group[annual] ? `연간 ${annual}의 질문을 반복하는 시기지만, ${s.branchTenGod}의 ${particle(base.focus, "subject")} 실제로 유지할 조건을 묻습니다.` : `연간 ${annual}에서 월간 ${particle(s.stemTenGod, "to")} 질문을 좁혀, ${front.gain}을 ${particle(base.focus, "with")} 함께 살펴봅니다.`);
  if (continuation) core = `${ganji(s)}월은 앞선 ${month! - 1}월 절입 이후의 흐름이 이어지는 구간입니다. ${s.stemTenGod}의 ${front.focus}에서 이미 정한 기준이 실제로 작동했는지 확인하는 데 초점을 둡니다.`;
  if (transitionOnly) core = `${ganji(s)} 월주와 ${s.stemTenGod}·${particle(s.branchTenGod, "topic")} 유지되지만, 만나는 대운 배경이 달라집니다. `
    + (s.uncertainty.length ? `${dayunLabel(s)} 중 어느 배경인지 확정할 수 없어 후보별 작용을 따로 봅니다.` : `${dayunLabel(s)} 배경이 적용되는 구간으로, 앞 구간의 조건부 근거를 그대로 연장하지 않습니다.`);
  const actionDomain: Domain = fact?.source === "month_natal_branch" && fact.affectedPillars.includes("day") ? "relationship"
    : group[s.stemTenGod] === "resource" ? "money" : group[s.stemTenGod] === "learning" ? "growth" : "work";
  const action = fact ? `${particle(annualRelationLabel(fact), "object")} ${domainNames[actionDomain]}에서 다룰 때는 ${domains[group[s.stemTenGod]][actionDomain].action}` : front.action;
  const scenes: string[] = [];
  if (tier !== "basic" && !continuation && !transitionOnly) {
    const work = domains[group[s.stemTenGod]].work;
    scenes.push(`일에서는 ${s.stemTenGod}의 ${particle(front.focus, "object")} ${particle(fact ? annualRelationLabel(fact) : s.branchTenGod + "의 기반", "with")} 연결해 봅니다. ${work.action} ${front.cost}이 나타나는지 실제 업무 장면에서 확인할 기준입니다.`);
    const close = fact?.source === "month_natal_branch" && fact.affectedPillars.includes("day");
    const domain = close ? "relationship" : group[s.branchTenGod] === "learning" ? "growth" : "money";
    scenes.push(`${domainNames[domain]}에서는 월지 본기의 ${particle(s.branchTenGod, "object")} 통해 ${particle(base.focus, "object")} 살핍니다. ${domains[group[s.branchTenGod]][domain].action} ${support && friction ? "같이 움직일 접점이 있어도 이 실행 조건을 생략하지 않습니다." : "계획한 것과 실제로 해 본 결과를 구분해 다음 결정을 내립니다."}`);
    if (tier === "transition") scenes.push(s.uncertainty.length
      ? `${ganji(s)} 기간에 어느 대운이 적용되는지 확정할 수 없으므로, 두 후보에 공통으로 필요한 실행 조건부터 정합니다. 대운별로 달라지는 관계 근거는 조건부로 남기고 실제 경험과 구분해 기록합니다.`
      : `${ganji(s)} 구간의 ${s.effectiveAnnualPillar.stem}${s.effectiveAnnualPillar.branch} 연주와 ${dayunLabel(s)} 배경을 기준으로 약속을 다시 봅니다. 전환 이전에 시작한 일도 계속 수행할 수 있습니다. 다만 계속할 일의 책임과 기간이 새 조건에서도 가능한지 확인하는 순서입니다.`);
  }
  if (transitionOnly) {
    const prior = dayunLabel(previous!);
    const next = dayunLabel(s);
    const nextFacts = s.relationFacts.filter(f=>f.source==="month_dayun_branch");
    scenes.push(`이전 구간의 ${prior} 배경에서 이 구간의 ${next} 배경으로 읽는 조건이 바뀝니다. ${s.uncertainty.length ? "두 후보를 같은 시각에 모두 적용하지 않고 가능한 전환 시각에 따라 구분합니다." : "앞 구간에 남아 있던 이전 대운 후보의 조건을 이후까지 계속 적용하지 않습니다."}`);
    scenes.push(nextFacts.length ? `이 시점에 살필 대운·월 관계는 ${nextFacts.map(annualRelationLabel).join(", ")}입니다. 원국·월 관계와는 출처가 다르므로 대운 전환만으로 원국 작용까지 없어졌다고 읽지 않습니다.`
      : `이 시점의 ${next} 대운과 ${ganji(s)} 월지 사이에는 검증된 지지 관계가 없습니다. 교운이라는 이유만으로 새로운 충돌이나 성과를 만들지 않고, 월간 ${s.stemTenGod}의 실행 기준을 유지합니다.`);
  }
  const followup = continuation && following ? `${s.stemTenGod}에서 ${particle(following.stemTenGod, "to")} 바뀌기 전에, ${front.focus}에서 남은 결정을 ${particle(role[following.stemTenGod].focus, "with")} 분리해 정리합니다.` : action;
  return { startKst:s.startKst,endKstExclusive:s.endKstExclusive,evidenceIds:s.evidenceIds,core,balance,action:followup,scenes };
}

export function buildAnnualFortuneReading(p: AnnualFortuneEvidencePacket): AnnualFortuneReading {
  const a = p.annualFortune, ar = role[a.stemTenGod], base = role[a.branchTenGod];
  const months = p.calendarMonths ?? [], segments = months.flatMap(m => m.segments);
  const candidates = months.map(m => ({ month: m, ...reasonForMonth(m, a.stemTenGod) }));
  // At most three non-transition focus months: an editorial explanation budget,
  // not a claim that other months are inactive. Ties are chronological.
  const focus = new Set(candidates.filter(c => c.priority > 0 && c.priority < 4).sort((a, b) => b.priority - a.priority || a.month.month - b.month.month).slice(0, 3).map(c => c.month.month));
  const readings = candidates.map(({ month: m, priority, reasons }): AnnualReadingMonth => {
    const tier = priority === 4 ? "transition" : focus.has(m.month) ? "focus" : "basic";
    const latter = m.segments.at(-1)!;
    return { month: m.month, tier, title: `${m.month}월 · ${role[latter.stemTenGod].focus}`, reasons: tier === "basic" ? [] : reasons,
      segments: m.segments.map((s, i) => segmentReading(s, getTenGodForStemPair(p.dayMaster, s.effectiveAnnualPillar.stem), tier, i ? m.segments[i - 1] : months[m.month - 2]?.segments.at(-1), m.segments[i + 1], m.month)) };
  });
  const bridge = p.mbtiBasis.type ? productBridgeScenes(p.bridgeEvidence).filter(s => s.mbtiType === p.mbtiBasis.type && s.factScope === "fortune-flow").slice(0, 2) : [];
  const prefix = `annual:${p.selectedYear}`;
  const factors = [{ text: `${a.ganji}의 ${a.stemTenGod}·${a.branchTenGod}: ${particle(ar.focus, "with")} ${particle(base.focus, "subject")} 이 해를 읽는 두 축입니다.`, evidenceIds: [`${prefix}:ten_gods`] }];
  const central = p.natalAnnualRelations.interactions.find(r => r.affectedPillars?.some(p => p === "day" || p === "month")) ?? p.natalAnnualRelations.interactions[0];
  if (central) factors.push({ text: `${central.branches.join("·")} ${particle(central.type, "subject")} 원국 ${(central.affectedPillars ?? []).map(x => pillarNames[x]).join("·")}에 닿습니다. ${relationActions[central.type]}`, evidenceIds: [`${prefix}:natal:${central.type}:${central.branches.join("")}`] });
  if (p.elementEffect.fillsMissing.length || p.elementEffect.overloadsHeavy.length) factors.push({ text: [p.elementEffect.fillsMissing.length ? `원국에서 부족한 ${p.elementEffect.fillsMissing.map(e => elements[e]).join("·")}에 연간 오행이 더해집니다.` : "", p.elementEffect.overloadsHeavy.length ? `동시에 원국에 많은 ${p.elementEffect.overloadsHeavy.map(e => elements[e]).join("·")}의 부담도 살펴야 합니다.` : "", "오행 유입은 무엇이 보태지는지에 대한 근거이며 결과의 유리함을 보장하지 않습니다."].filter(Boolean).join(" "), evidenceIds: [`${prefix}:elements`] });
  if (p.currentMajorFortune) factors.push({ text: `${p.currentMajorFortune.ganji}의 ${p.currentMajorFortune.stemTenGod} 배경에 ${a.ganji}의 ${a.stemTenGod} 질문이 들어옵니다. ${p.dayunSelection?.transition ? "이 해에는 교운 전후의 배경을 아래 기간별로 나눠 읽습니다." : `${particle(ar.focus, "object")} 10년간 이어지는 역할 안에서 구체화하는 관점입니다.`}`, evidenceIds: [`${prefix}:dayun`] });
  const periods: { first: AnnualMonthSegment; end: string }[] = [];
  for (const s of segments) {
    const last = periods.at(-1);
    if (last && JSON.stringify(last.first.activeDayunContext) === JSON.stringify(s.activeDayunContext) && JSON.stringify(last.first.effectiveAnnualPillar) === JSON.stringify(s.effectiveAnnualPillar)) last.end = s.endKstExclusive;
    else periods.push({ first: s, end: s.endKstExclusive });
  }
  const crossPeriods = periods.map(({first:s,end}) => {
    const annualGanji = s.effectiveAnnualPillar.stem + s.effectiveAnnualPillar.branch;
    const tg = getTenGodForStemPair(p.dayMaster, s.effectiveAnnualPillar.stem);
    const cycles = s.activeDayunContext.cycles.map(c => {
      const ct = getTenGodForStemPair(p.dayMaster, c.ganji[0] as HeavenlyStem);
      return `${c.ganji} 대운의 ${ct}(${role[ct].focus})에 ${annualGanji} 세운의 ${tg}(${role[tg].focus})가 더해지는 배경입니다. `
        + (group[ct] === group[tg] ? "장기적으로 다루던 질문을 올해의 업무·약속·선택에서 더 구체적으로 확인하는 방식으로 읽습니다." : `10년 배경을 없애는 변화가 아니라, ${particle(role[ct].focus, "object")} 유지하면서 ${particle(role[tg].focus, "object")} 함께 처리할 방법을 찾는 흐름입니다.`);
    });
    if (s.activeDayunContext.includesBeforeFirstCycle) cycles.unshift("첫 대운 시작 전에는 연주와 원국의 관계를 중심으로 읽습니다.");
    return { startKst:s.startKst,endKstExclusive:end,evidenceIds:[s.evidenceIds[1],s.evidenceIds[2]],text: (s.uncertainty.length ? "아래 대운들은 동시에 확정된 배경이 아닌 전환 시각에 따른 후보입니다. " : "") + (cycles.join(" ") || "첫 대운 시작 전으로, 연주와 원국의 관계를 중심으로 읽습니다.") };
  });
  const ds = (Object.keys(domainNames) as Domain[]).map(key => {
    const tg = key === "money" || key === "growth" ? a.branchTenGod : a.stemTenGod;
    const layer = domains[group[tg]][key];
    const timing = readings.filter(m => m.tier !== "basic").find(m => m.segments.some(s => s.evidenceIds.length && months[m.month - 1].segments.some(x => group[x.stemTenGod] === group[tg])));
    return { key, title: domainNames[key], body: `${a.ganji} 세운의 ${particle(tg, "object")} ${domainNames[key]}에 연결하면 ${particle(role[tg].focus, "object")} 중심으로 읽습니다. ${layer.scene}`,
      scenes: [key === "work" ? `연간 방향은 ${a.stemTenGod}이지만 실제로 버틸 운영 조건은 연지 본기의 ${a.branchTenGod} 관점도 함께 봅니다. ${base.cost}이 반복된다면 맡은 일의 양보다 수행 조건부터 조정합니다.`
        : key === "money" ? `돈에 관한 해석은 ${tg}의 자원 운영 관점입니다. 기대하는 수입과 이미 확정된 수입을 나눠야 하며, 새 제안의 규모만으로 감당 가능한 위험을 판단하지 않습니다. 특정 자산이나 수익률을 권하는 근거로 사용하지 않습니다.`
        : key === "relationship" ? `${a.stemTenGod}에서 살필 ${ar.cost}이 가까운 사람에게 어떻게 전달되는지 확인합니다. 친밀함의 정도보다 설명하는 방식과 상대에게 남겨 둔 선택권을 보면 조정할 행동이 구체적으로 보입니다.`
        : `${a.branchTenGod}의 기반 위에서 배움을 유지하려면 결과를 확인할 단위를 정하는 편이 좋습니다. 공부량을 늘리기 전에 배운 것을 쓰는 장면과 쉬는 시간을 함께 정해 준비가 생활 전체를 차지하지 않도록 합니다.`,
        ...(timing ? [`${domainNames[key]}에서 ${particle(role[tg].focus, "object")} 구체적으로 점검할 시점은 ${timing.month}월의 해당 십성 구간과 함께 살펴봅니다. 해당 월 전체가 같다는 뜻은 아니므로 기간별 기준을 사용합니다.`] : [])],
      action: layer.action,evidenceIds:[`${prefix}:ten_gods`, ...(timing ? timing.segments.flatMap(s=>s.evidenceIds.filter(id=>id.endsWith(":ten_gods"))) : [])] };
  });
  return { version:"annual-reading-v2",selectedYear:p.selectedYear,
    headline:`${p.selectedYear}년 ${a.ganji}: ${particle(ar.focus, "object")} ${particle(base.focus, "to")} 이어갈 해`,
    gains:`${a.stemTenGod}에서 살릴 것은 ${ar.gain}입니다. 바깥으로 드러나는 선택을 ${a.branchTenGod}의 ${particle(base.focus, "with")} 연결하면 실행 이후의 운영까지 살필 수 있습니다.`,
    costs:`${a.branchTenGod}에서 살필 대가는 ${base.cost}입니다. ${ar.focus}에 힘을 쓰더라도 이 조건을 놓치면 결과를 유지하는 데 피로가 붙을 수 있습니다.`,
    factors:factors.slice(0,4),crossPeriods,domains:ds,bridge,months:readings,
    actions:ds.map(d=>`${d.title}: ${d.action}`),
  };
}
