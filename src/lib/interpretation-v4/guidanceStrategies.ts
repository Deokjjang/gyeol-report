import { GUIDANCE_STRATEGIES, PRIMARY_WORK_MODES, type GuidanceStrategy, type GuidanceStrategyId, type StrategyApplicability, type WorkMode, type WeightedWorkMode } from "./guidanceCore";

const allModes: WorkMode[] = [...PRIMARY_WORK_MODES, "GENERAL"];
function strategy(index: number, action: string, generalAdvice: string, preferred: WorkMode[] = [], caution: WorkMode[] = [], forbidden: WorkMode[] = []): GuidanceStrategy {
  const applicability = Object.fromEntries(allModes.map(m => [m, forbidden.includes(m) ? "FORBIDDEN" : caution.includes(m) ? "CAUTION" : preferred.includes(m) ? "PREFERRED" : "ALLOWED"])) as Record<WorkMode, StrategyApplicability>;
  return { id: `GS${String(index).padStart(2, "0")}`, strategy: GUIDANCE_STRATEGIES[index - 1], action, generalAdvice, applicability,
    allowedModes: allModes.filter(m => ["PREFERRED", "ALLOWED"].includes(applicability[m])), cautionModes: caution, forbiddenModes: forbidden };
}
export const GUIDANCE_STRATEGY_REGISTRY: readonly GuidanceStrategy[] = [
  strategy(1, "종료 기준을 정한다", "시작하기 전에 어디까지 하면 끝인지 먼저 정해두는 편이 좋습니다."),
  strategy(2, "생각할 시간을 정한다", "생각을 억지로 줄이기보다 언제까지 생각할지를 먼저 정하는 편이 좋습니다.", ["RESEARCH_EXPLORATION", "LEARNING_PROJECT"]),
  strategy(3, "수정 횟수를 정한다", "수정을 시작하기 전에 몇 번까지 고칠지 기준을 정해두는 편이 좋습니다.", ["CRAFT_FINAL_OUTPUT"], ["HIGH_STAKES_PRECISION"]),
  strategy(4, "작게 보여주고 반응을 확인한다", "나중에 수정해도 큰 문제가 없는 일이라면 작은 부분을 먼저 보여주고 실제 반응을 확인하는 편이 좋습니다.", ["ITERATIVE_PRODUCT", "SALES_MARKET", "APPLICATION_MARKET"], ["CRAFT_FINAL_OUTPUT", "EDITORIAL_REVIEW", "GENERAL", "RESEARCH_EXPLORATION", "OPERATIONS_PROCESS", "PEOPLE_SERVICE", "LEADERSHIP_MANAGEMENT", "PERFORMANCE_PUBLIC"], ["HIGH_STAKES_PRECISION"]),
  strategy(5, "중요한 오류부터 확인한다", "모든 부분을 같은 중요도로 고치기보다 실제 결과에 영향을 주는 문제부터 먼저 확인하는 편이 좋습니다.", ["HIGH_STAKES_PRECISION", "EDITORIAL_REVIEW"]),
  strategy(6, "다음 할 일을 적는다", "머릿속에서 계속 기억하려 하지 말고 다음에 할 일을 적어두는 편이 좋습니다.", ["OPERATIONS_PROCESS"]),
  strategy(7, "도움의 범위를 정한다", "도와줄 수 있는 범위와 내가 책임질 범위를 따로 정하는 게 좋습니다.", ["PEOPLE_SERVICE"]),
  strategy(8, "결과 기준을 정하고 맡긴다", "방법까지 전부 정해주기보다 필요한 결과와 기준만 분명히 하고 맡길 일은 맡기는 편이 좋습니다.", ["LEADERSHIP_MANAGEMENT", "OPERATIONS_PROCESS"], ["GENERAL", "LEARNING_PROJECT", "APPLICATION_MARKET", "CRAFT_FINAL_OUTPUT"]),
  strategy(9, "사실과 해석을 구분한다", "실제로 확인된 사실과 내가 그 사실을 보고 붙인 해석을 따로 적어보는 편이 좋습니다."),
  strategy(10, "반대 근거를 확인한다", "중요한 결정을 내리기 전에는 내 생각과 반대되는 근거 하나만 일부러 확인해보는 편이 좋습니다."),
  strategy(11, "멈출 조건을 정한다", "계속 생각하거나 찾아보기 전에 무엇이 확인되면 끝낼지 먼저 정해두는 편이 좋습니다."),
  strategy(12, "회복할 시간을 정한다", "쉴 시간이 남기를 기다리기보다 회복할 시간도 일정 안에 정해두는 편이 좋습니다.", ["PERFORMANCE_PUBLIC"]),
  strategy(13, "추가 전에 하나를 뺀다", "새로운 일을 하나 시작하려면 기존에 하던 것 하나는 끝내거나 빼는 기준을 두는 편이 좋습니다."),
  strategy(14, "의미와 가격을 따로 확인한다", "좋아하고 의미 있는 일인지와 내 시간과 돈의 값이 맞는지는 따로 계산하는 편이 좋습니다."),
  strategy(15, "사람 대신 문제를 말한다", "사람을 평가하기보다 지금 고쳐야 할 문제를 정확하게 말하는 편이 좋습니다.", ["PEOPLE_SERVICE", "LEADERSHIP_MANAGEMENT"]),
  strategy(16, "결정과 실행을 나눈다", "결정하기 전에는 충분히 생각해도 됩니다. 대신 방향을 정한 뒤에는 다시 처음부터 고민하지 않고 움직이는 편이 좋습니다."),
  strategy(17, "영향이 큰 일을 먼저 정한다", "모든 일을 같은 중요도로 보지 말고 실제 결과에 가장 큰 영향을 주는 것부터 먼저 처리하는 편이 좋습니다."),
  strategy(18, "의견을 받을 사람을 정한다", "모든 사람 반응을 따라가기보다 믿을 만한 몇 명의 의견만 받아 마지막 판단은 자기 기준으로 남기는 편이 좋습니다.", ["CRAFT_FINAL_OUTPUT"], ["EDITORIAL_REVIEW", "HIGH_STAKES_PRECISION"]),
  strategy(19, "책임과 도움을 구분한다", "내가 해야 하는 일과 내가 도와줄 수만 있는 일을 구분하는 게 좋습니다."),
  strategy(20, "맡을 양을 제한한다", "할 수 있을 것 같다는 이유로 계속 일정을 더 넣지 말고 한 번에 맡을 수 있는 양의 상한을 정하는 편이 좋습니다."),
  strategy(21, "큰 지출 전에 다시 확인한다", "큰돈을 쓰는 결정은 좋아 보이는 순간 바로 확정하기보다 한 번 다시 확인할 시간을 두는 편이 좋습니다."),
  strategy(22, "잘된 점을 적는다", "다음 목표를 잡기 전에 이번에 실제로 잘된 것과 나아진 것을 한번 적어보는 편이 좋습니다."),
  strategy(23, "현재 상태와 요구를 말한다", "길게 설명할 힘이 없더라도 지금 어떤 상태인지와 무엇이 필요한지는 짧게 말해두는 편이 좋습니다."),
  strategy(24, "작은 시험 범위를 정한다", "모든 걸 한꺼번에 바꾸기보다 작은 부분 하나를 정해서 먼저 시험해보는 편이 좋습니다.", [], ["HIGH_STAKES_PRECISION"]),
  strategy(25, "돈의 목적을 나눈다", "아끼는 돈과 써도 되는 돈을 처음부터 따로 나눠두는 편이 좋습니다."),
];
export const guidanceStrategy = (id: GuidanceStrategyId) => GUIDANCE_STRATEGY_REGISTRY.find(s => s.strategy === id)!;
export const APPLICABILITY_VALUE: Record<StrategyApplicability, number> = { PREFERRED: 1, ALLOWED: .8, CAUTION: .35, FORBIDDEN: 0 };
/** Any credible secondary high-stakes mode vetoes iteration, regardless of its
 * weight. An allow in another mode can never average away a contraindication. */
export function strategyApplicability(id: GuidanceStrategyId, modes: readonly WeightedWorkMode[]): StrategyApplicability {
  const s = guidanceStrategy(id), credible = modes.filter(m => m.confidence >= .6 && m.weight > 0);
  if (credible.some(m => s.applicability[m.mode] === "FORBIDDEN")) return "FORBIDDEN";
  if (credible.some(m => s.applicability[m.mode] === "CAUTION")) return "CAUTION";
  return s.applicability[(credible[0] ?? modes[0])?.mode ?? "GENERAL"];
}
