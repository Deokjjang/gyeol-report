import type { MajorEvidence, MajorYearEvidence } from "./majorEvidence";

/** Display the supplied canonical boundary; never infer an instant from a range. */
export function majorYearPeriod(e: MajorEvidence, y: Pick<MajorYearEvidence, "year" | "cycle">) {
  const t = e.horizon.transitions.find(t => t.year === y.year);
  if (!t) return { cycle: y.cycle.ganji, label: "", explanation: "" };
  const before = t.startSolarKst ?? t.startSolarRange?.earliestKst;
  const after = t.startSolarKst ?? t.startSolarRange?.latestKst;
  const label = t.startSolarKst ? `${t.dateLabel} 전후` : `${t.dateLabel} 전환 가능 범위`;
  const explanation = before && after
    ? `${y.year}년 연초부터 ${before.replace("T", " ").replace("+09:00", " KST")} 직전까지는 ${t.before.ganji}(${t.before.tenGod}) 대운입니다. ${t.startSolarKst ? "같은 시각부터" : `${after.replace("T", " ").replace("+09:00", " KST")}부터는`} ${t.after.ganji}(${t.after.tenGod}) 대운으로 읽습니다.${!t.startSolarKst ? ` ${t.before.ganji}에서 ${t.after.ganji} 대운으로 넘어가는 두 시각 사이에는 대운을 확정하지 않습니다.` : ""} 아래 대운·세운 관계는 ${t.after.ganji}(${t.after.tenGod}) 대운으로 전환이 완료된 뒤 남은 기간의 설명입니다. 이전 ${t.before.ganji}(${t.before.tenGod}) 대운의 상세 상호작용은 여기서 다루지 않습니다.`
    : `${t.dateLabel}을 경계로 ${t.before.ganji}에서 ${t.after.ganji} 대운으로 넘어갑니다. 아래 설명은 전환이 완료된 뒤의 기간에 한정합니다.`;
  return { cycle: `${t.before.ganji} → ${t.after.ganji}`, label, explanation };
}
