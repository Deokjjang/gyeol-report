import { DAYUN_CALCULATION_VERSION, DAYUN_ACTUAL_CYCLE_COUNT, SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { normalizeBirthTimePrecision } from "../saju/birthTimePrecisionTypes";
import { normalizeGanji } from "../report-knowledge/sajuFeatureExtractionRules";
import type { CustomerDayun, DayunSelection } from "../saju/customerDayun";

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function same(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => same(v, b[i]));
  if (record(a) && record(b)) return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => same(a[k], b[k]));
  return a === b;
}
function kst(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/.test(value) && Number.isFinite(Date.parse(value));
}
function ganji(value: unknown): string { return typeof value === "string" ? normalizeGanji(value) ?? "" : ""; }
function hasTextFields(value: unknown, keys: readonly string[]): boolean {
  return record(value) && keys.every(key => typeof value[key] === "string" && (value[key] as string).trim().length > 0);
}
function validDecadeReadingText(plan: Record<string, unknown>): boolean {
  return hasTextFields(plan, ["thesis", "gains", "costs", "position", "previous", "next"]) &&
    Array.isArray(plan.factors) && plan.factors.length >= 2 && plan.factors.length <= 4 &&
    plan.factors.every(f => hasTextFields(f, ["evidenceId", "text"])) &&
    Array.isArray(plan.phases) && plan.phases.length === 3 &&
    plan.phases.every((p, i) => record(p) && p.phase === ["early", "middle", "late"][i] && hasTextFields(p, ["label", "headline", "body", "advice"])) &&
    Array.isArray(plan.domains) && plan.domains.length === 3 &&
    plan.domains.every((d, i) => record(d) && d.key === ["work", "money", "relationship"][i] && hasTextFields(d, ["title", "body", "timing", "action"]) && Array.isArray(d.evidenceIds) && d.evidenceIds.every(id => typeof id === "string"));
}

// Structural read gate: no calendar engine or provider calls during rendering.
// At generation the trusted input is also supplied; writers never own this basis.
export function validateDayunPublication(product: string, draft: Record<string, unknown>, evidence: unknown, payload?: unknown): string[] {
  const errors: string[] = [];
  if (!record(evidence) || !record(evidence.customerDayun) || !record(evidence.dayunSelection)) return ["CUSTOMER_DAYUN_REQUIRED"];
  try {
    const b = evidence.customerDayun as unknown as CustomerDayun;
    const s = evidence.dayunSelection as unknown as DayunSelection;
    const person = b.customerInput;
    const context = b.calendarContext;
    const time = normalizeBirthTimePrecision(person);
    if (b.calculationVersion !== DAYUN_CALCULATION_VERSION || b.calendarVersion !== SAJU_CALENDAR_VERSION ||
        b.libraryVersion !== "1.7.7" || b.yunSect !== 2 || b.stable !== true || b.ageConvention !== "kst_cycle_year_minus_birth_year_plus_one" ||
        evidence.calendarVersion !== b.calendarVersion || !record(evidence.birthTimeContexts) || !same(context, evidence.birthTimeContexts.person) ||
        !time.ok || time.precision !== b.precision || context.birthTimePrecision !== b.precision || context.birthDate !== person.birthDate ||
        !["MALE", "FEMALE"].includes(person.gender)) errors.push("DAYUN_BASIS_INVALID");
    if (!record(evidence.personContext) || evidence.personContext.name !== person.name || evidence.personContext.birthDate !== person.birthDate ||
        draft.personLabel !== person.name) errors.push("DAYUN_CUSTOMER_MISMATCH");
    if (payload !== undefined) {
      const p = record(payload) && record(payload.person) ? payload.person : {};
      const precision = normalizeBirthTimePrecision(p);
      if (!precision.ok || p.gender !== person.gender || p.birthDate !== person.birthDate ||
          (typeof p.name === "string" ? p.name.trim() : "") !== person.name || precision.precision !== b.precision ||
          precision.time !== person.birthTime || precision.slot !== person.approximateBirthTimeSlot) errors.push("DAYUN_INPUT_MISMATCH");
      if (product === "annual_fortune" && (!record(payload) || !record(payload.productOptions) || Number(payload.productOptions.selectedYear) !== s.targetYear)) errors.push("DAYUN_TARGET_MISMATCH");
    }
    const yearStem = context.confirmed.year?.stem ?? "";
    const forward = "甲丙戊庚壬".includes(yearStem) === (person.gender === "MALE");
    if (b.direction !== (forward ? "forward" : "reverse")) errors.push("DAYUN_DIRECTION_MISMATCH");
    const stems = "甲乙丙丁戊己庚辛壬癸", branches = "子丑寅卯辰巳午未申酉戌亥";
    const cycleNames = Array.from({ length: 60 }, (_, i) => stems[i % 10] + branches[i % 12]);
    const monthIndex = cycleNames.indexOf((context.confirmed.month?.stem ?? "") + (context.confirmed.month?.branch ?? ""));
    if (monthIndex < 0 || b.cycles.length !== DAYUN_ACTUAL_CYCLE_COUNT) errors.push("DAYUN_SEQUENCE_INVALID");
    b.cycles.forEach((c, i) => {
      const range = c.startSolarRange;
      const expectedGanji = cycleNames[(monthIndex + (forward ? 1 : -1) * (i + 1) + 60) % 60];
      if (c.index !== i + 1 || c.ganji !== expectedGanji || c.stem + c.branch !== c.ganji ||
          !kst(range.earliestKst) || !kst(range.latestKst) || Date.parse(range.earliestKst) > Date.parse(range.latestKst) ||
          c.startYear !== Number(range.earliestKst.slice(0, 4)) || c.startYear !== Number(range.latestKst.slice(0, 4)) ||
          c.startYear !== b.cycles[0].startYear + i * 10 || c.endYear !== c.startYear + 9 ||
          c.startAge !== c.startYear - Number(person.birthDate.slice(0, 4)) + 1 || c.endAge !== c.startAge + 9 ||
          (b.precision === "exact" ? c.startSolarKst !== range.earliestKst || range.earliestKst !== range.latestKst : c.startSolarKst !== null)) errors.push("DAYUN_CYCLE_INVALID");
    });
    if (!same(b.startSolarRange, b.cycles[0].startSolarRange) || b.startSolarKst !== b.cycles[0].startSolarKst ||
        (b.precision !== "exact" && b.startOffset !== null)) errors.push("DAYUN_START_INVALID");
    const selected = b.cycles.find((c) => c.startYear <= s.targetYear && s.targetYear <= c.endYear);
    if (!selected || !same(s.selectedCycle, selected) || s.calculationVersion !== b.calculationVersion || !same(draft.dayunContext, s)) errors.push("DAYUN_SELECTION_MISMATCH");
    if (!selected) return errors;
    const transition = selected.startYear === s.targetYear ? {
      transitionYear: true, startSolarKst: selected.startSolarKst, startSolarRange: selected.startSolarRange,
      beforeCycle: b.cycles.find((c) => c.index === selected.index - 1) ?? null, afterCycle: selected,
    } : null;
    if (!same(s.transition, transition)) errors.push("DAYUN_TRANSITION_MISMATCH");
    const visible = product === "major_fortune" ? draft.openingSummary : draft.majorAnnualCrossReading;
    if ((transition || b.precision !== "exact") && (!s.notice || typeof visible !== "string" || !visible.includes(s.notice))) errors.push("DAYUN_UNCERTAINTY_NOTICE_REQUIRED");
    if (product === "major_fortune") {
      const summary = record(draft.cycleSummary) ? draft.cycleSummary : {};
      const current = record(evidence.currentMajorFortune) ? evidence.currentMajorFortune : {};
      if (!same(evidence.currentCycle, selected) || evidence.currentYear !== s.targetYear || ganji(current.ganji) !== ganji(selected.ganji) ||
          ganji(summary.ganji) !== ganji(selected.ganji) || summary.yearRangeLabel !== current.yearRange || summary.ageRangeLabel !== current.ageRange ||
          current.yearRange !== `${selected.startYear}년~${selected.endYear}년` || current.ageRange !== `${selected.startAge}세~${selected.endAge}세`) errors.push("DAYUN_DRAFT_CYCLE_MISMATCH");
      for (const key of ["majorFortuneTimelineRows", "cycleYearTimeline"]) {
        const rows = draft[key];
        if (!Array.isArray(rows) || rows.length !== 10 || rows.some((r, i) => !record(r) || r.year !== selected.startYear + i || (key === "majorFortuneTimelineRows" && ganji(r.majorGanji) !== ganji(selected.ganji)))) errors.push("DAYUN_TIMELINE_MISMATCH");
      }
      // New editorial plans are optional for older snapshots. For new reports,
      // the writer cannot change any year fact or promote its own strong years.
      if (evidence.decadeReading !== undefined && !record(evidence.decadeReading)) errors.push("DAYUN_DECADE_READING_INVALID");
      if (record(evidence.decadeReading)) {
        const plan = evidence.decadeReading;
        if (!validDecadeReadingText(plan)) errors.push("DAYUN_DECADE_READING_INVALID");
        const years = plan.years;
        const rows = draft.majorFortuneTimelineRows;
        if (plan.version !== "major-decade-v2" || !Array.isArray(years) || years.length !== 10 || !Array.isArray(rows) || years.some((y, i) => {
          if (!record(y) || !record(rows[i]) || y.year !== selected.startYear + i || !Array.isArray(y.evidenceIds) || !Array.isArray(y.reasons) ||
              !hasTextFields(y.detail, ["coreFlow", "realWorldScenes", "cautionPoint", "actionStandard"]) ||
              !["important", "standard", "quiet"].includes(String(y.importance))) return true;
          return ganji(rows[i].annualGanji) !== ganji(y.ganji) || rows[i].annualTenGodLabel !== y.tenGod ||
            y.reasons.some(r => !record(r) || !(y.evidenceIds as unknown[]).includes(r.evidenceId)) ||
            (Array.isArray(rows[i].badges) && rows[i].badges.includes("강함")) !== (y.importance === "important");
        })) errors.push("DAYUN_YEAR_FACT_MISMATCH");
        if (Array.isArray(years) && (!Array.isArray(draft.strongYears) || !same(
          draft.strongYears.map(y => record(y) ? y.year : null).sort(),
          years.filter(y => record(y) && y.importance === "important").map(y => y.year).sort(),
        ))) errors.push("DAYUN_YEAR_EMPHASIS_MISMATCH");
      }
    } else {
      const current = record(evidence.currentMajorFortune) ? evidence.currentMajorFortune : {};
      const cross = record(evidence.majorAnnualCross) ? evidence.majorAnnualCross : {};
      if (draft.targetYear !== s.targetYear || evidence.selectedYear !== s.targetYear || ganji(current.ganji) !== ganji(selected.ganji) ||
          ganji(cross.majorGanji) !== ganji(selected.ganji) || current.yearRange !== `${selected.startYear}년~${selected.endYear}년` ||
          typeof draft.majorAnnualCrossReading !== "string" || !draft.majorAnnualCrossReading.includes(selected.ganji)) errors.push("DAYUN_ANNUAL_MISMATCH");
    }
    if (/deokmin-current|fixture_precomputed|product-preview/iu.test(JSON.stringify([b, s]))) errors.push("DAYUN_FIXTURE_FORBIDDEN");
  } catch { errors.push("DAYUN_BASIS_INVALID"); }
  return [...new Set(errors)];
}
