/**
 * v5 원국 신살·귀인 27종. calculateSaju().shinsal(기존 detectShinsal, v4 표·잠금이 그대로 쓰는 결과)을 바꾸지 않고,
 * 시간 미상 자리를 빼고 현침살만 v5 기준(tables.HYEONCHIM_CHARS: 천간·지지 어느 쪽이든 그 글자가 있는 기둥)으로 다시 낸다.
 */
import { SHINSAL_METADATA } from "../shinsalConstants";
import type { SajuCalcResult } from "../types";
import { HYEONCHIM_CHARS } from "./tables";
import type { ChartPosition, NatalShinsalDetection, PositionedPillar } from "./types";

export function detectNatalShinsal(saju: Pick<SajuCalcResult, "shinsal">, natal: readonly PositionedPillar[]): NatalShinsalDetection[] {
  const included = new Set(natal.map((e) => e.position));
  const meta = SHINSAL_METADATA.HYEONCHIMSAL;
  const hyeonchim: NatalShinsalDetection[] = natal.flatMap((e) => {
    const chars = [e.pillar.stem, e.pillar.branch].filter((c) => HYEONCHIM_CHARS.includes(c));
    const position = e.position as ChartPosition;
    return chars.length
      ? [{ code: meta.code, category: meta.category, severity: meta.defaultSeverity, confidence: "MEDIUM" as const, labelKo: meta.labelKo, descriptionKo: meta.shortDescriptionKo,
        positions: [position], evidence: [`shinsal:${meta.code}`, `position:${position}`, `chars:${chars.join("")}`] }]
      : [];
  });
  const rest = saju.shinsal
    .filter((s) => s.code !== "HYEONCHIMSAL" && s.positions.every((p) => included.has(p)))
    .map((s): NatalShinsalDetection => ({ code: s.code, category: s.category, severity: s.severity, confidence: s.confidence, labelKo: s.labelKo, descriptionKo: s.descriptionKo,
      positions: s.positions as ChartPosition[], evidence: s.evidence }));
  return [...hyeonchim, ...rest];
}
