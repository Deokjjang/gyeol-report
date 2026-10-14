import type { EvidenceBuilder } from "./builder";
import type { EvidenceParticipant, EvidenceTemporalWindow } from "./types";
import { temporalPosition } from "./temporal";
import { annualTransitMaterials } from "../../../interpretation-v4/annualEvidence";
const window = (scope: EvidenceTemporalWindow["scope"], start: string | null, endExclusive: string | null, certainty: EvidenceTemporalWindow["certainty"], originalBounds: unknown): EvidenceTemporalWindow => ({ scope, start, endExclusive, certainty, originalBounds, compatibleCombination: true });
export function adaptPeriodEvidence(b: EvidenceBuilder) {
  const c = b.input.evidence.composition, owner = b.owner("person");
  if (c.product === "major_fortune") {
    const e = c.result.evidence, p = b.producer("report-knowledge/majorFortuneDecadeReading", "buildMajorFortuneDecadeReading", "major-decade-v2", "major");
    const cycles = new Map(e.horizon.rows.map(y => [y.cycle.index, y.cycle]));
    const selection = e.dayunSelection;
    if (!selection) { b.requirement(owner, "MISSING_PRODUCER_OUTPUT", "/composition/result/evidence/dayunSelection"); return; }
    const selected = selection.selectedCycle;
    for (const cycle of cycles.values()) {
      const transition = e.horizon.transitions.find(t => t.after.index === cycle.index);
      const next = e.horizon.transitions.find(t => t.before?.index === cycle.index);
      const range = cycle.index === selected.index ? selected.startSolarRange : transition?.startSolarRange ?? null;
      const start = cycle.index === selected.index ? selected.startSolarKst : transition?.startSolarKst ?? null;
      const time = { ...window("dayun", start ?? range?.earliestKst ?? null, next?.startSolarKst ?? next?.startSolarRange?.latestKst ?? null, start && next?.startSolarKst ? "confirmed" : "conditional", { cycle, startSolarRange: range, nextTransition: next ?? null }), transitionRange: range };
      const n = b.node("CALCULATED_PERIOD_FACT", owner, b.producer("saju/customerDayun", "calculateCustomerDayun", selection.calculationVersion, "dayun"), null, `/composition/result/evidence/horizon/cycles/${cycle.index}`, { cycleIndex: cycle.index, ganji: cycle.ganji, tenGod: cycle.tenGod, startYear: cycle.startYear, endYear: cycle.endYear, tenYearCycle: cycle.endYear - cycle.startYear === 9, activeAtEvaluation: selection.activeCycleAtEvaluation === cycle.index, timePosition: temporalPosition(time, b.input.context.evaluatedAt) }, { root: true, independent: true, temporal: time });
      b.anchors.set(`dayun:${cycle.index}`, n.id);
      if (!time.start || !time.endExclusive) b.index.block(n, "UNKNOWN_INTERVAL", ["Full cycle endpoints are not exposed by the V4 major packet"]);
    }
    for (const [i, y] of e.years.entries()) {
      const n = b.node("EDITORIAL_PROOF_OBSERVATION", owner, p, null, `/composition/result/evidence/years/${i}`, { year: y.year, cycle: y.cycle.index, timePosition: y.timePosition, fourteenYearEditorialSlot: true }, { parents: [b.anchors.get(`dayun:${y.cycle.index}`)!].filter(Boolean) });
      const period = window("annual", null, null, "unknown", { nominalYear: y.year, transitionSafe: false });
      let annualNodeId: string | null = null;
      for (const [j, id] of y.annual.evidenceIds.entries()) {
        const reason = y.annual.reasons.find(r => r.evidenceId === id);
        const fact = b.node(j === 0 ? "CALCULATED_PERIOD_FACT" : "EDITORIAL_PROOF_OBSERVATION", owner, p, id, `/composition/result/evidence/years/${i}/annual/evidenceIds/${j}`, j === 0 ? { year: y.year, annual: y.annual.ganji, intervalNotExposed: true } : { year: y.year, tenGod: j === 1 ? y.annual.tenGod : null, reasonKind: reason?.kind ?? "UNKNOWN", originalReason: reason?.text ?? null, independentFact: false }, { root: j === 0, independent: j === 0, temporal: period, parents: annualNodeId ? [annualNodeId] : [] });
        if (j === 0) { annualNodeId = fact.id; b.index.link(n.id, fact.id); }
      }
    }
    for (const [i, f] of e.majorNatal.relations.entries()) b.node("CALCULATED_PERIOD_FACT", owner, p, f.evidenceId, `/composition/result/evidence/majorNatal/relations/${i}`, { cycleIndex: e.majorNatal.cycleIndex, cycleGanji: e.majorNatal.ganji, relation: f.relation, origin: "CURRENT_CYCLE_ONLY" }, { root: true, independent: true, parents: [b.anchors.get(`dayun:${e.majorNatal.cycleIndex}`)!].filter(Boolean) });
    for (const [i, t] of e.horizon.transitions.entries()) b.node("TEMPORAL_BOUNDARY", owner, p, null, `/composition/result/evidence/horizon/transitions/${i}`, { before: t.before, after: t.after, startSolarKst: t.startSolarKst, startSolarRange: t.startSolarRange }, { certainty: t.startSolarKst ? "confirmed" : "conditional" });
  }
  if (c.product !== "annual_fortune") return;
  const e = c.result.evidence, raw = e.raw, p = b.producer("report-knowledge/annualMonthJie", "buildAnnualMonthCalendar", raw.monthlyCalculationVersion!, "annual-month");
  const cycles = raw.customerDayun?.cycles ?? [];
  for (const [i, cycle] of cycles.entries()) {
    const next = cycles[i + 1], time = { ...window("dayun", cycle.startSolarRange.earliestKst, next?.startSolarRange.latestKst ?? null, cycle.startSolarKst && next?.startSolarKst ? "confirmed" : "conditional", { startSolarKst: cycle.startSolarKst, startSolarRange: cycle.startSolarRange, nextStartRange: next?.startSolarRange ?? null }), transitionRange: cycle.startSolarRange };
    const active = Date.parse(b.input.context.evaluatedAt) < Date.parse(cycle.startSolarRange.latestKst) && Date.parse(b.input.context.evaluatedAt) >= Date.parse(cycle.startSolarRange.earliestKst) ? null : temporalPosition(time, b.input.context.evaluatedAt) === "current";
    const n = b.node("CALCULATED_PERIOD_FACT", owner, b.producer("saju/customerDayun", "calculateCustomerDayun", raw.customerDayun!.calculationVersion, "dayun"), null, `/composition/result/evidence/raw/customerDayun/cycles/${i}`, { index: cycle.index, ganji: cycle.ganji, stem: cycle.stem, branch: cycle.branch, startYear: cycle.startYear, endYear: cycle.endYear, activeAtEvaluation: active, tenYearCycle: cycle.endYear - cycle.startYear === 9 }, { root: true, independent: true, temporal: time });
    b.anchors.set(`dayun:${cycle.index}`, n.id);
    if (!next) b.index.block(n, "UNKNOWN_INTERVAL");
  }
  b.node("CONTEXT_INPUT", owner, p, null, "/composition/result/evidence/selectedYear", { selectedYear: e.selectedYear, nominalAnnualGanji: raw.annualGanji, notAllSegmentsEffectivePillar: true });
  for (const [mi, month] of raw.calendarMonths!.entries()) for (const [si, s] of month.segments.entries()) {
    const prefix = `/composition/result/evidence/raw/calendarMonths/${mi}/segments/${si}`;
    const time = window("month", s.startKst, s.endKstExclusive, "confirmed", { boundaryReason: s.boundaryReason });
    const cycleParents = s.activeDayunContext.cycles.map(c => b.anchors.get(`dayun:${c.index}`)!).filter(Boolean);
    const segment = b.node("TEMPORAL_BOUNDARY", owner, p, null, prefix, { month: month.month, boundaryReason: s.boundaryReason, uncertainty: s.uncertainty, activeDayunContext: s.activeDayunContext, timePosition: temporalPosition(time, b.input.context.evaluatedAt), focus: e.months[mi].focus.startKst === s.startKst }, { temporal: time });
    const components = ["month", "annual", "dayun", "ten_gods", "elements"] as const;
    for (const [j, id] of s.evidenceIds.slice(0, 5).entries()) {
      const component = components[j];
      const uncertain = component === "dayun" && s.activeDayunContext.status === "transition_uncertain";
      const value = component === "month" ? { component, monthPillar: s.monthPillar } : component === "annual" ? { component, effectiveAnnualPillar: s.effectiveAnnualPillar } : component === "dayun" ? { component, activeDayunContext: s.activeDayunContext } : component === "ten_gods" ? { component, stemTenGod: s.stemTenGod, branchTenGod: s.branchTenGod } : { component, elements: s.elements };
      const n = b.node(component === "dayun" && s.activeDayunContext.status === "before_first_cycle" ? "UNKNOWN_REQUIREMENT" : "CALCULATED_PERIOD_FACT", owner, p, id, `${prefix}/evidenceIds/${j}`, value, { root: component === "month" || component === "annual", independent: component === "month" || component === "annual", temporal: uncertain ? { ...time, certainty: "conditional", transitionRange: s.activeDayunContext.transitionRange } : time, certainty: uncertain ? "conditional" : "confirmed", parents: [segment.id, ...(component === "dayun" ? cycleParents : component === "ten_gods" || component === "elements" ? [b.anchors.get(`${prefix}:month`)!, b.anchors.get("person:day:stem")!].filter(Boolean) : [])] });
      if (component === "dayun" && s.activeDayunContext.status === "before_first_cycle") b.index.block(n, "BEFORE_FIRST_DAYUN");
      if (uncertain) b.index.block(n, "UNCERTAIN_TRANSITION");
      b.anchors.set(`${prefix}:${component}`, n.id);
    }
    for (const [ri, f] of s.relationFacts.entries()) {
      let participants: EvidenceParticipant[] = [{ owner: owner.fixtureOwnerId, position: "month", slot: "transit_branch", value: s.monthPillar.branch }];
      const counterpartParents: string[] = [];
      let missingParticipant = false;
      if (f.source === "month_natal_branch") for (const position of f.affectedPillars) {
        const branch = b.input.evidence.calculations.person.pillars[position]?.branch, parent = b.anchors.get(`person:${position}:branch`);
        if (!branch || !parent || !f.participants.includes(branch)) missingParticipant = true;
        else { participants.push({ owner: owner.fixtureOwnerId, position, slot: "natal_branch", value: branch }); counterpartParents.push(parent); }
      }
      else if (f.source === "month_annual_branch" && f.counterpart.scope === "annual") { participants.push({ owner: owner.fixtureOwnerId, position: "annual", slot: "branch", value: f.counterpart.pillar.slice(-1) }); counterpartParents.push(b.anchors.get(`${prefix}:annual`)!); }
      else if (f.source === "month_dayun_branch" && f.counterpart.scope === "dayun") {
        participants.push({ owner: owner.fixtureOwnerId, position: `dayun-cycle:${f.counterpart.cycleIndex}`, slot: "branch", value: f.counterpart.pillar.slice(-1) });
        const parent = b.anchors.get(`dayun:${f.counterpart.cycleIndex}`); if (parent) counterpartParents.push(parent); else missingParticipant = true;
      }
      else if (f.source === "month_natal_element") { participants = [...f.monthElements.map(value => ({ owner: owner.fixtureOwnerId, position: "month", slot: "element", value })), { owner: owner.fixtureOwnerId, position: "natal-distribution", slot: "element", value: f.element }]; counterpartParents.push(b.anchors.get("person:element-distribution")!); }
      else missingParticipant = true;
      const period = { ...time, certainty: f.certainty, transitionRange: f.certainty === "conditional" ? s.activeDayunContext.transitionRange : null };
      const n = b.node("CALCULATED_PERIOD_FACT", owner, p, f.id, `${prefix}/relationFacts/${ri}`, f, { root: true, independent: true, participants, temporal: period, certainty: f.certainty, parents: [segment.id, b.anchors.get(`${prefix}:month`)!, ...counterpartParents.filter(Boolean)] });
      if (missingParticipant) b.index.block(n, "MISSING_PARTICIPANT", [f.id]);
      if (f.source === "month_natal_element" && !b.input.evidence.calculations.person.pillars.hour) b.index.block(n, "UNKNOWN_BIRTH_TIME", ["Full natal element absence/excess is not established by a missing hour"]);
      if (f.certainty === "conditional") b.index.block(n, "UNCERTAIN_TRANSITION");
    }
    const extension = e.monthly.months[mi]?.segments.find(x => x.startKst === s.startKst && x.endKstExclusive === s.endKstExclusive);
    if (!extension) { b.requirement(owner, "MISSING_PRODUCER_OUTPUT", `${prefix}/extendedEvidence`); continue; }
    const held = annualTransitMaterials(extension.features).held;
    for (const [i, f] of extension.features.entries()) {
      const anchor = /^natal\.(year|month|day|hour)\.(stem|branch)$/.exec(f.basis.anchor);
      const actualAnchor = anchor ? b.anchors.get(`person:${anchor[1]}:${anchor[2]}`) : null;
      const target = /^month\.(stem|branch)$/.exec(f.basis.target);
      const natalValue = anchor ? b.input.evidence.calculations.person.pillars[anchor[1] as "year" | "month" | "day" | "hour"]?.[anchor[2] as "stem" | "branch"] : null;
      const transitValue = target ? s.monthPillar[target[1] as "stem" | "branch"] : null;
      const participants = anchor && target ? [{ owner: owner.fixtureOwnerId, position: anchor[1], slot: anchor[2], value: f.basis.anchorValue }, { owner: owner.fixtureOwnerId, position: "month", slot: target[1], value: f.basis.targetValue }] : [];
      const sources = [...new Set(f.sourceRefs.filter(r => r.startsWith("src/lib/")).map(r => r.split(":")[0]))].map(file => b.knowledge.source(file, ""));
      const n = b.node("CALCULATED_PERIOD_FACT", owner, b.producer("report-knowledge/annualMonthExtendedEvidence", "extendAnnualMonthEvidence", e.monthly.version, "annual-month-extension"), f.id, `${prefix}/extendedEvidence/features/${i}`, { code: f.code, kind: f.kind, basis: f.basis, sourceRefs: f.sourceRefs }, { root: true, independent: true, temporal: time, sources, participants, parents: [b.anchors.get(`${prefix}:month`)!, ...(actualAnchor ? [actualAnchor] : [])] });
      if (natalValue !== f.basis.anchorValue || transitValue !== f.basis.targetValue) b.index.block(n, "MISSING_PARTICIPANT", [f.basis.anchor, f.basis.target]);
      if (!actualAnchor) b.index.block(n, "SOURCE_REFERENCE_UNRESOLVED", [f.basis.anchor]);
      if (held.some(h => h.observation.id === f.id)) b.index.block(n, held.find(h => h.observation.id === f.id)!.reason, [f.id]);
    }
  }
  const unsupported = new Map<string, { code: string; reason: string; occurrencePointers: string[] }>();
  for (const [mi, m] of e.monthly.months.entries()) for (const [si, s] of m.segments.entries()) for (const u of s.unsupported) {
    const key = `${u.code}:${u.reason}`, old = unsupported.get(key) ?? { ...u, occurrencePointers: [] };
    old.occurrencePointers.push(`/composition/result/evidence/monthly/months/${mi}/segments/${si}/unsupported`); unsupported.set(key, old);
  }
  for (const [key, declaration] of unsupported) {
    const n = b.node("UNSUPPORTED_REQUIREMENT", owner, b.producer("report-knowledge/annualMonthExtendedEvidence", "extendAnnualMonthEvidence", e.monthly.version, "annual-month-extension"), null, `/composition/result/evidence/monthly/unsupported/${key}`, declaration);
    b.index.block(n, "UNSUPPORTED_PRODUCER", [declaration.code, declaration.reason]);
  }
  b.requirement(owner, "UNSUPPORTED_COMPOSITE", "/periods/natal-dayun-annual-month-independent-composite", true, ["Existing pair relations do not establish an independent 3/4-layer formation"]);
}
