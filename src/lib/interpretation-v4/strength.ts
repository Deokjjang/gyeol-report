import { HIDDEN_STEMS, STEM_ELEMENT } from "../saju/constants";
import { getTenGod } from "../saju/tenGods";
import { analyzeRelations } from "../saju/relations";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { normalizeBirthTimePrecision, PILLAR_KEYS } from "../saju/birthTimePrecisionTypes";
import type { PillarSet } from "../saju/analyze";
import type { SajuCalcResult, TenGod } from "../saju/types";
import { STRUCTURE_VERSION, type DaymasterStrength, type GodFamily, type StructureAtom, type StructureContext, type StrengthEvidence } from "./structureTypes";

export const GOD_FAMILIES: Readonly<Record<GodFamily, readonly TenGod[]>> = {
  peer: ["比肩", "劫財"], output: ["食神", "傷官"], wealth: ["偏財", "正財"], officer: ["偏官", "正官"], resource: ["偏印", "正印"],
};
export const uniqueRefs = (items: readonly string[]) => [...new Set(items)].sort();
export const familyOf = (god: TenGod): GodFamily => (Object.keys(GOD_FAMILIES) as GodFamily[]).find(f => GOD_FAMILIES[f].includes(god))!;
export const sumWeight = (atoms: readonly StructureAtom[]) => Math.round(atoms.reduce((sum, a) => sum + a.weight, 0) * 10) / 10;
export const meaningful = (a: StructureAtom) => a.location === "visible" || a.location === "MAIN";

/** Position-preserving projection of existing constants. Never counts both a
 * branch main element and its hidden main stem, or the day stem as its own peer. */
export function collectStructureAtoms(pillars: PillarSet): readonly StructureAtom[] {
  return PILLAR_KEYS.flatMap(position => {
    const pillar = pillars[position];
    if (!pillar) return [];
    const entries = [...(position === "day" ? [] : [{ stem: pillar.stem, kind: "visible" as const, weight: 1 }]), ...HIDDEN_STEMS[pillar.branch]];
    return entries.map(entry => {
      const god = getTenGod(pillars.day.stem, entry.stem);
      return { id: `${position}:${entry.kind}:${entry.stem}`, position, stem: entry.stem, element: STEM_ELEMENT[entry.stem], god, family: familyOf(god),
        location: entry.kind, weight: entry.weight,
        provenance: [`pillars:${position}:${pillar.stem}${pillar.branch}`, `getTenGod:${pillars.day.stem}:${entry.stem}:${god}`,
          entry.kind === "visible" ? "saju/analyze.ts:analyzeVisibleTenGods" : `saju/constants.ts:HIDDEN_STEMS:${pillar.branch}:${entry.stem}:${entry.kind}:${entry.weight}`] };
    });
  });
}

/** Existing calendar candidates are read, never manufactured or recalculated. */
export function structureContext(calc: SajuCalcResult): StructureContext {
  const c = calc.birthTimeContext;
  const inputTime = normalizeBirthTimePrecision(calc.input);
  const valid = Boolean(c && calc.calculationVersion === SAJU_CALENDAR_VERSION && c.calendarVersion === calc.calculationVersion &&
    inputTime.ok && inputTime.precision === c.birthTimePrecision &&
    (inputTime.precision !== "exact" || c.range.startKst.startsWith(`${calc.input.birthDate}T${inputTime.time}:`)) &&
    (inputTime.precision !== "approximate" || c.approximateBirthTimeSlot === inputTime.slot) &&
    c.birthDate === calc.input.birthDate && calc.dayMaster === calc.pillars.day.stem && PILLAR_KEYS.every(k => {
      const p = calc.pillars[k], confirmed = c.confirmed[k];
      return p?.stem === confirmed?.stem && p?.branch === confirmed?.branch && (k === "hour" || c.stable[k]) &&
        (!confirmed || (c.stable[k] && c.candidates[k].length === 1 && c.candidates[k][0].stem === confirmed.stem && c.candidates[k][0].branch === confirmed.branch));
    }));
  const complete = Boolean(valid && !calc.input.birthTimeUnknown && c?.birthTimePrecision !== "unknown" && c?.stable.hour && calc.pillars.hour);
  const alternatives = !complete && valid && c ? c.candidates.hour.map(hour => ({ ...calc.pillars, hour })) : [];
  return { valid, complete, pillars: calc.pillars, atoms: valid ? collectStructureAtoms(calc.pillars) : [], alternatives,
    reasons: !valid ? ["CALENDAR_CONTEXT_NOT_VERIFIED"] : !complete ? ["INCOMPLETE_HOUR"] : [] };
}

export function unresolvedPositions(pillars: PillarSet) {
  const r = analyzeRelations(pillars);
  return new Set([...r.stemCombinations, ...r.branchCombinations, ...r.branchClashes].flatMap(r => r.positions));
}

/** Versioned conservative product policy, NOT the legacy weighted score and
 * NOT a complete classical strength/seasonal qi/transformations system. */
export function strengthFromPillars(pillars: PillarSet): DaymasterStrength {
  const atoms = collectStructureAtoms(pillars);
  const supports = atoms.filter(a => a.family === "peer" || a.family === "resource");
  const drains = atoms.filter(a => a.family !== "peer" && a.family !== "resource");
  const month = atoms.find(a => a.position === "month" && a.location === "MAIN")!;
  const inSeason = supports.includes(month);
  const peerRoots = atoms.filter(a => a.family === "peer" && a.location !== "visible" && a.weight >= 0.3);
  const mainPeerRoots = peerRoots.filter(a => a.location === "MAIN");
  const supportingGround = supports.filter(a => a.location !== "visible" && a.weight >= 0.3);
  const visibleSupport = supports.filter(a => a.location === "visible");
  const visibleDrain = drains.filter(a => a.location === "visible");
  const supportPositions = new Set(supports.filter(meaningful).map(a => a.position)).size;
  const drainPositions = new Set(drains.filter(meaningful).map(a => a.position)).size;
  const share = sumWeight(supports) / sumWeight(atoms);
  let level: DaymasterStrength["level"] = "balanced", confidence: DaymasterStrength["confidence"] = "uncertain";
  const reasons: string[] = [];
  if (share >= 0.58 && supportPositions >= 2 && ((inSeason && peerRoots.length >= 1) || (peerRoots.length >= 2 && visibleSupport.length >= 1))) {
    level = share >= 0.8 && inSeason && mainPeerRoots.length >= 2 && visibleSupport.length >= 1 ? "veryStrong" : "strong";
    confidence = "strong"; reasons.push("SEASON_ROOT_EXPOSURE_SUPPORT_CONVERGE");
  } else if (share <= 0.3 && !inSeason && mainPeerRoots.length === 0 && peerRoots.length <= 1 && drainPositions >= 3 && visibleDrain.length >= 1) {
    level = share <= 0.15 && peerRoots.length === 0 && visibleSupport.length === 0 ? "veryWeak" : "weak";
    confidence = "strong"; reasons.push("OUT_OF_SEASON_WEAK_ROOT_DRAIN_CONVERGE");
  } else if (share >= 0.42 && share <= 0.58 && supports.some(meaningful) && drains.some(meaningful)) {
    confidence = "supported"; reasons.push("MIXED_SUPPORT_AND_DRAIN");
  } else reasons.push("BOUNDARY_OR_CONTRADICTORY_DIMENSIONS");
  const unresolved = unresolvedPositions(pillars);
  if (confidence === "strong" && unresolved.size > 0) {
    confidence = "supported"; reasons.push("ROOT_OR_SEASON_RELATION_UNRESOLVED");
  }
  const evidence = (selected: readonly StructureAtom[], support: boolean): StrengthEvidence[] => [
    ...(selected.includes(month) ? [{ dimension: "season" as const, meaning: support ? "월지 본기가 일간을 돕는 관계" : "월지 본기가 일간의 설기·재성·관성 관계",
      atomIds: [month.id], provenance: month.provenance }] : []),
    ...selected.map(a => ({ dimension: a.location === "visible" ? "visible" as const : "hidden" as const,
      meaning: `${a.god} ${support ? "생조" : "설기·극·현실 부담"}`, atomIds: [a.id], provenance: a.provenance })),
    ...(support ? supportingGround.map(a => ({ dimension: "root" as const, meaning: a.family === "peer" ? "일간과 같은 오행의 지지 기반" : "일간을 생하는 지지 기반",
      atomIds: [a.id], provenance: a.provenance })) : []),
  ];
  return { version: STRUCTURE_VERSION, level, confidence, supportingEvidence: evidence(supports, true), weakeningEvidence: evidence(drains, false), reasons,
    provenance: uniqueRefs([STRUCTURE_VERSION, "v4:strength:season-root-exposure-convergence", ...atoms.flatMap(a => a.provenance)]),
    hourSensitivity: { evaluated: 1, possibleLevels: [level], stable: true } };
}

export function analyzeV4Strength(calc: SajuCalcResult): DaymasterStrength {
  const c = structureContext(calc);
  if (!c.valid) return { version: STRUCTURE_VERSION, level: "balanced", confidence: "uncertain", supportingEvidence: [], weakeningEvidence: [],
    reasons: c.reasons, provenance: [STRUCTURE_VERSION], hourSensitivity: { evaluated: 0, possibleLevels: [], stable: false } };
  const known = strengthFromPillars(c.pillars);
  if (c.complete) return known;
  const alternatives = c.alternatives.map(strengthFromPillars);
  const possibleLevels = [...new Set(alternatives.map(r => r.level))].sort();
  const side = (s: DaymasterStrength) => s.level === "weak" || s.level === "veryWeak" ? "weak" : s.level === "strong" || s.level === "veryStrong" ? "strong" : "balanced";
  const stable = alternatives.length > 0 && alternatives.every(r => r.confidence !== "uncertain" && side(r) === side(alternatives[0]) && side(r) !== "balanced");
  return { ...known, level: stable ? side(alternatives[0]) : "balanced", confidence: stable ? "supported" : "uncertain",
    reasons: [...known.reasons, stable ? "HOUR_ENVELOPE_SAME_DIRECTION" : "HOUR_CAN_CHANGE_ASSESSMENT"],
    provenance: uniqueRefs([...known.provenance, "BirthTimeCalculationContext:candidates.hour"]),
    hourSensitivity: { evaluated: alternatives.length, possibleLevels, stable } };
}
