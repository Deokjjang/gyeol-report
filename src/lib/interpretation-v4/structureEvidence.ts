import { getTenGod } from "../saju/tenGods";
import { PILLAR_KEYS } from "../saju/birthTimePrecisionTypes";
import type { PillarSet } from "../saju/analyze";
import type { SajuCalcResult, TenGod } from "../saju/types";
import { analyzeV4Strength, collectStructureAtoms, GOD_FAMILIES, meaningful, strengthFromPillars, structureContext, sumWeight, uniqueRefs, unresolvedPositions } from "./strength";
import { STRUCTURE_RULES, type StructureRule } from "./structureRules";
import { STRUCTURE_VERSION, type DaymasterStrength, type StructureAssessment, type StructureAtom, type StructureCandidate, type StructureLayer } from "./structureTypes";

const positions = (atoms: readonly StructureAtom[]) => new Set(atoms.filter(meaningful).map(a => a.position)).size;
const visible = (atoms: readonly StructureAtom[]) => atoms.some(a => a.location === "visible");
const rooted = (atoms: readonly StructureAtom[]) => atoms.some(a => a.location !== "visible" && a.weight >= 0.3);
const strongGroup = (atoms: readonly StructureAtom[]) => sumWeight(atoms) >= 1.2 && positions(atoms) >= 2 &&
  ((visible(atoms) && rooted(atoms)) || atoms.filter(a => a.location === "MAIN").length >= 2);
const dominant = (atoms: readonly StructureAtom[], all: readonly StructureAtom[]) => strongGroup(atoms) &&
  sumWeight(atoms) >= 2 && sumWeight(atoms) / sumWeight(all) >= 0.34 && visible(atoms) && rooted(atoms);
const adjacent = (a: StructureAtom, b: StructureAtom) => Math.abs(PILLAR_KEYS.indexOf(a.position) - PILLAR_KEYS.indexOf(b.position)) <= 1;
const dayReach = (a: StructureAtom) => Math.abs(PILLAR_KEYS.indexOf(a.position) - PILLAR_KEYS.indexOf("day")) <= 1;

function evaluateRule(rule: StructureRule, pillars: PillarSet, strength: DaymasterStrength, complete: boolean): { candidate?: StructureCandidate; assessment: StructureAssessment } {
  const all = collectStructureAtoms(pillars);
  const select = (gods: readonly TenGod[]) => all.filter(a => gods.includes(a.god));
  const family = (key: keyof typeof GOD_FAMILIES) => select(GOD_FAMILIES[key]);
  const groups = rule.groups.map(select);
  const connections: StructureCandidate["connections"][number][] = [];
  const reject = (reason: string, status: StructureAssessment["status"] = "suppressed") => ({ assessment: { id: rule.id, status, reasons: [reason] } });
  let support: readonly StructureAtom[] = groups.flat(), confidence: StructureCandidate["confidence"] = "strong";
  if (rule.kind === "absence") {
    if (!complete) return reject("INCOMPLETE_CHART");
    if (groups[0].length) return reject("PRESENT_HIDDEN_OR_VISIBLE");
    confidence = "supported";
  } else if (rule.kind === "heavy" || rule.kind === "weakWealth") {
    support = family(rule.family!);
    if (!dominant(support, all)) return reject("NOT_DOMINANT_OR_UNROOTED");
    if (rule.kind === "weakWealth") {
      if (!complete) return reject("HOUR_UNCERTAIN", "uncertain");
      if (!["weak", "veryWeak"].includes(strength.level) || strength.confidence !== "strong") return reject("STRENGTH_NOT_CLEARLY_WEAK", "uncertain");
      if (sumWeight(support) < 1.5 * sumWeight([...family("peer"), ...family("resource")])) return reject("WEALTH_NOT_DOMINANT");
      // Strength evidence and wealth anchors are both part of the lineage.
      support = all;
    }
  } else {
    if (groups.some(g => !strongGroup(g))) return reject("INSUFFICIENT_INDEPENDENT_GROUP_SUPPORT");
    if (rule.kind === "mixed") {
      if (!groups.every(g => visible(g) && rooted(g))) return reject("NOT_BOTH_EXPOSED_ROOTED");
      if (strongGroup(family("resource")) || strongGroup(family("output"))) return reject("RESOURCE_OR_OUTPUT_MEDIATION", "uncertain");
    } else {
      if (rule.id === "outputCreatesWealth" && strongGroup(family("resource"))) return reject("RESOURCE_RESTRAINS_OUTPUT", "uncertain");
      if (rule.id === "wealthCreatesOfficer" && (strongGroup(select(["偏官"])) || strongGroup(select(["傷官"])))) return reject("MIXED_OFFICER_OR_HURTING_OFFICER", "uncertain");
      if (rule.kind === "resourceFlow") {
        if (strongGroup(select(rule.id === "officerResourceFlow" ? ["偏官"] : ["正官"]))) return reject("MIXED_OFFICERS", "uncertain");
        if (strongGroup(family("wealth"))) return reject("WEALTH_RESTRAINS_RESOURCE", "uncertain");
        if (strongGroup(select(rule.id === "officerResourceFlow" ? ["傷官"] : ["食神", "傷官"]))) return reject("OUTPUT_INTERFERENCE", "uncertain");
      }
      if (rule.kind === "tension" && (strongGroup(family("resource")) || strongGroup(family("wealth")))) return reject("RESOURCE_OR_WEALTH_MEDIATION", "uncertain");
      const pair = groups[0].filter(meaningful).flatMap(a => groups[1].filter(meaningful).map(b => [a, b] as const)).find(([a, b]) => {
        if (!adjacent(a, b)) return false;
        if (rule.kind === "resourceFlow" && !dayReach(b)) return false;
        if (rule.kind === "tension") return a.location === "visible" && b.location === "visible" && ["偏財", "正財"].includes(getTenGod(a.stem, b.stem));
        return (a.location === "visible" || b.location === "visible") && ["食神", "傷官"].includes(getTenGod(a.stem, b.stem));
      });
      if (!pair) return reject(rule.kind === "tension" ? "NO_EXPOSED_CONTROL_PATH" : "COEXISTENCE_WITHOUT_CONNECTION");
      connections.push({ from: pair[0].id, to: pair[1].id, kind: rule.kind === "tension" ? "control" : "generation" });
      if (rule.kind === "resourceFlow") {
        if (!["食神", "傷官"].includes(getTenGod(pair[1].stem, pillars.day.stem))) return reject("NO_RESOURCE_TO_DAYMASTER_PATH");
        connections.push({ from: pair[1].id, to: `day:daymaster:${pillars.day.stem}`, kind: "resourceToDaymaster" });
      }
    }
  }
  const affected = unresolvedPositions(pillars);
  const relationUnresolved = support.some(a => affected.has(a.position));
  if (relationUnresolved || !complete) confidence = "supported";
  const reasons = [rule.kind === "absence" ? "COMPLETE_CHART_ABSENCE_ONLY" : "INDEPENDENT_SUPPORT_AND_RULE_CONDITIONS_MET",
    ...(relationUnresolved ? ["COMBINATION_OR_CLASH_REQUIRES_REVIEW"] : []), ...(!complete ? ["HOUR_INCOMPLETE_NO_HERO"] : [])];
  const provenance = uniqueRefs([STRUCTURE_VERSION, `v4:structure-rule:${rule.id}`, ...support.flatMap(a => a.provenance),
    ...(rule.kind === "weakWealth" ? strength.provenance : []), ...(rule.kind === "absence" ? all.flatMap(a => a.provenance) : [])]);
  const lineageAtoms = rule.kind === "absence" ? all : support;
  return { candidate: { version: STRUCTURE_VERSION, id: rule.id, label: rule.label, confidence, supportingEvidence: support,
    connections, reasons, provenance, lineage: uniqueRefs(lineageAtoms.map(a => `natal:atom:${a.id}`)) }, assessment: { id: rule.id, status: confidence, reasons } };
}

export function buildMyeongliStructure(calc: SajuCalcResult): StructureLayer {
  const ctx = structureContext(calc), strength = analyzeV4Strength(calc);
  const candidates: StructureCandidate[] = [], assessments: StructureAssessment[] = [];
  for (const rule of STRUCTURE_RULES) {
    if (!ctx.valid) { assessments.push({ id: rule.id, status: "uncertain", reasons: ctx.reasons }); continue; }
    const result = evaluateRule(rule, ctx.pillars, strength, ctx.complete);
    if (result.candidate && !ctx.complete) {
      // Unknown never establishes absence or wealth-heavy weakness; other
      // observed structures remain only if every canonical hour preserves it.
      const stable = ctx.alternatives.length > 0 && ctx.alternatives.every(p => evaluateRule(rule, p, strengthFromPillars(p), true).candidate);
      if (!stable) { assessments.push({ id: rule.id, status: "uncertain", reasons: ["HOUR_CAN_CHANGE_STRUCTURE"] }); continue; }
    }
    assessments.push(result.assessment);
    if (result.candidate) candidates.push(result.candidate);
  }
  return { version: STRUCTURE_VERSION, completeChart: ctx.complete, strength, candidates, assessments };
}
