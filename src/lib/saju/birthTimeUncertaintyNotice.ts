import type { BirthTimeCalculationContext } from "./birthTimePrecisionTypes";
import { getSolarTermInstants } from "./solarTerms";

// 절입일(절기가 바뀌는 날) × 시간 미상·대략 시간 입력의 안내 문구.
// 계산이 하나로 정해지지 않는 기둥(연주·월주)의 두 후보를 그대로 밝히고, 시간대를 알려 주면 만들 수 있다고 안내한다.
// 생성은 하지 않는다: 월주 하나가 대운 순서·월지 십성·오행 분포·만세력 표까지 정하므로 두 원국을 섞어 책을 쓰지 않는다.
const KO: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};
const ko = (p: { stem: string; branch: string }) => `${KO[p.stem] ?? p.stem}${KO[p.branch] ?? p.branch}`;
const LABEL = { year: { name: "연주", plain: "태어난 해의 기운", unit: "년" }, month: { name: "월주", plain: "태어난 달의 기운", unit: "월" } } as const;

export type BirthTimeUncertaintyNotice = { readonly pillars: readonly ("year" | "month")[]; readonly candidates: Readonly<Partial<Record<"year" | "month", readonly string[]>>>; readonly boundaryKst: string | null; readonly message: string };

/** 입력 범위 안에서 절기가 바뀐 시각(한국 시각 "오후 2시 31분"). 범위 안 절기가 하나일 때만. */
function boundaryOf(context: BirthTimeCalculationContext): string | null {
  const start = Date.parse(context.range.startKst), end = Date.parse(context.range.endKstExclusive);
  const inside = getSolarTermInstants(context.range.startKst, new Date(end - 1000 + 9 * 3_600_000).toISOString().slice(0, 19) + "+09:00").filter(t => t > start && t < end);
  if (inside.length !== 1) return null;
  const d = new Date(inside[0] + 9 * 3_600_000), h = d.getUTCHours(), m = d.getUTCMinutes();
  return `${h < 12 ? "오전" : "오후"} ${h % 12 === 0 ? 12 : h % 12}시 ${m}분`;
}

/** 연주·월주가 정해지지 않은 계산 맥락이면 안내를 만든다. 정해져 있으면 null. */
export function birthTimeUncertaintyNotice(context: BirthTimeCalculationContext): BirthTimeUncertaintyNotice | null {
  const pillars = (["year", "month"] as const).filter(k => !context.stable[k] && context.candidates[k].length > 1);
  if (!pillars.length) return null;
  const candidates = Object.fromEntries(pillars.map(k => [k, context.candidates[k].map(ko)]));
  const parts = pillars.map(k => `${LABEL[k].name}(${LABEL[k].plain})가 ${candidates[k]!.map(c => `${c}${LABEL[k].unit}`).join(" 또는 ")}`);
  const boundaryKst = boundaryOf(context);
  const message = `태어난 날이 절기가 바뀌는 날이라, 태어난 시각에 따라 ${parts.join(", ")}로 달라집니다. `
    + "두 경우를 섞어 읽으면 책의 근거가 흔들려서 지금은 만들지 않습니다. "
    + (boundaryKst ? `이날 절기가 바뀐 시각은 ${boundaryKst}(한국 시각)이라, 그보다 앞인지 뒤인지만 알아도 하나로 정해 만들 수 있습니다.` : "대략적인 시간대만 알려 주셔도 하나로 정해 만들 수 있습니다.");
  return { pillars, candidates, boundaryKst, message };
}
