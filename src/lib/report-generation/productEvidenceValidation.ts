import { publicationBirthTimeContexts, publishedPillarMatches } from "./birthTimePublication";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { normalizeBirthTimePrecision } from "../saju/birthTimePrecisionTypes";
import { STEM_ELEMENT, BRANCH_MAIN_ELEMENT } from "../saju/constants";
import { getAnnualGanjiInfo, getAnnualMonthGanjiInfo } from "../report-knowledge/annualFortuneYearRules";
import { COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS } from "./comprehensiveReportDraftTypes";

type Row = Record<string, unknown>;
const record = (v: unknown): v is Row => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const texts = (v: unknown): boolean => Array.isArray(v) && v.every(text);
const fields = (v: unknown, keys: string[]): boolean => record(v) && keys.every(k => text(v[k]));
const rows = (v: unknown, keys: string[], min = 1): v is Row[] => Array.isArray(v) && v.length >= min && v.every(r => fields(r, keys));


// Pure read validation. No server calendar, filesystem, provider, or inference calls.
export function validateProductEvidence(product: string, draft: Row, value: unknown, payload?: unknown): string[] {
  if (!record(value)) return ["EVIDENCE_REQUIRED"];
  const e = value, errors: string[] = [];
  const need = (ok: boolean, field: string) => { if (!ok) errors.push(`EVIDENCE_INVALID:${field}`); };
  const contexts = publicationBirthTimeContexts(e);
  need(!!contexts, "canonical_calendar");
  need(e.calendarCalculationVersion === undefined || e.calendarCalculationVersion === SAJU_CALENDAR_VERSION, "calendarCalculationVersion");
  const basis = record(e.inputBasis) ? e.inputBasis : {};
  const roles = product === "saju_mbti_compatibility" ? ["personA", "personB"] as const : ["person"] as const;
  for (const role of roles) {
    const p = basis[role];
    const c = contexts?.[role];
    if (!record(p) || !c) { need(false, `inputBasis.${role}`); continue; }
    const precision = normalizeBirthTimePrecision(p);
    need(fields(p, ["name", "birthDate"]) && p.calendarType === "solar" && p.timezone === "Asia/Seoul" &&
      (p.mbtiType === "" || (typeof p.mbtiType === "string" && /^[IE][NS][TF][JP]$/.test(p.mbtiType))) &&
      precision.ok && precision.precision === c.birthTimePrecision && p.birthDate === c.birthDate &&
      (precision.precision !== "exact" || c.range.startKst.startsWith(`${p.birthDate}T${precision.time}:`)) &&
      (precision.precision !== "approximate" || c.approximateBirthTimeSlot === precision.slot), `inputBasis.${role}`);
    if (payload !== undefined) {
      const raw = record(payload) && record(payload[role]) ? payload[role] : {};
      const time = normalizeBirthTimePrecision(raw);
      need(time.ok && precision.ok && time.precision === precision.precision && time.time === precision.time && time.slot === precision.slot &&
        raw.birthDate === p.birthDate && (typeof raw.name === "string" ? raw.name.trim() : "") === p.name &&
        (raw.gender ?? "") === p.gender && (raw.mbtiType ?? "") === p.mbtiType, `requested_${role}`);
    }
    if (role !== "person") {
      const participant = record(e.participants) ? e.participants[role === "personA" ? "a" : "b"] : null;
      need(record(participant) && participant.name === p.name && (participant.mbtiType ?? "") === p.mbtiType, `participant_${role}`);
    } else {
      const personContext = record(e.personContext) ? e.personContext : {};
      const actualMbti = product === "saju_mbti_full" || product === "career_money_study" ? e.mbtiType : personContext.mbtiType;
      need((actualMbti ?? "") === p.mbtiType, "customer_mbti");
      if (product !== "saju_mbti_full") need((e.personLabel ?? personContext.name) === p.name && draft.personLabel === p.name, "customer_name");
      if (record(e.baseSaju) && c) {
        const pillars = record(e.baseSaju.pillars) ? e.baseSaju.pillars : {};
        for (const key of ["year", "month", "day", "hour"] as const) need(key === "hour" && c.birthTimePrecision === "unknown"
          ? !text(pillars.hour) : publishedPillarMatches(pillars[key], c.confirmed[key]), `baseSaju.${key}`);
        need(e.baseSaju.dayMaster === c.confirmed.day?.stem, "baseSaju.dayMaster");
      }
    }
  }
  if (product === "saju_mbti_full") {
    const p = record(draft.profileTable) ? draft.profileTable : {};
    const c = contexts?.person;
    if (c) {
      const counts: Record<string, number> = { WOOD: 0, FIRE: 0, EARTH: 0, METAL: 0, WATER: 0 };
      for (const pillar of Object.values(c.confirmed)) if (pillar) { counts[STEM_ELEMENT[pillar.stem]]++; counts[BRANCH_MAIN_ELEMENT[pillar.branch]]++; }
      const names = { WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" };
      need(Array.isArray(p.fiveElementSummary) && Object.entries(names).every(([key, name]) => (p.fiveElementSummary as unknown[]).includes(`${name} ${counts[key]}`)), "five_elements_consistency");
      for (const key of ["year", "month", "day", "hour"] as const) need(key === "hour" && c.birthTimePrecision === "unknown"
        ? !text(p.hourPillar) : publishedPillarMatches(p[`${key}Pillar`], c.confirmed[key]), `profile.${key}`);
      if (Array.isArray(p.fourPillarGrid)) for (const column of p.fourPillarGrid) {
        if (!record(column)) continue;
        const pillar = c.confirmed[column.columnId as keyof typeof c.confirmed];
        if (pillar) need(publishedPillarMatches(String(column.heavenlyStem) + String(column.earthlyBranch), pillar), `profile.grid.${column.columnId}`);
      }
    }
    if (e.mbtiType === "") {
      need(p.mbti === "미입력" && e.mbtiBasis === undefined && e.selectedMbtiKnowledge === undefined, "absent_mbti");
      need(Array.isArray(e.sections) && e.sections.every(s => record(s) && Array.isArray(s.supportingMbti) && s.supportingMbti.length === 0), "absent_mbti_sections");
    } else need(fields(e.mbtiBasis, ["type", "titleKo", "oneLine"]) && record(e.mbtiBasis) && e.mbtiBasis.type === e.mbtiType &&
      Array.isArray(e.mbtiBasis.traitAreas) && e.mbtiBasis.traitAreas.length > 0, "mbtiBasis");
    need(rows(e.sajuFeatureDictionary, ["id", "rawLabel", "plainMeaning", "howItShowsInYou", "strength", "fatiguePoint", "practicalUse"], 3), "sajuFeatureDictionary");
    if (e.narrativePlan !== undefined) {
      const plan = record(e.narrativePlan) ? e.narrativePlan : {};
      const dictionary = Array.isArray(e.sajuFeatureDictionary) ? e.sajuFeatureDictionary.filter(record) : [];
      const facts = new Set([...(Array.isArray(e.bridgeFactIds) ? e.bridgeFactIds : []), ...dictionary.map(f=>f.sourceFeatureId)]);
      const featureIds = new Set(dictionary.map(f=>f.id));
      const mbti = record(e.mbtiBasis) ? e.mbtiBasis : {};
      const traitIds = new Set((Array.isArray(mbti.traitAreas) ? mbti.traitAreas.filter(record) : []).flatMap(a=>
        (Array.isArray(a.traits) ? a.traits.filter(record) : []).map(t=>`mbti:${e.mbtiType}:traits:${a.area}:${t.id}`)));
      const scenes = Array.isArray(e.sajuMbtiBridgeEvidence) ? e.sajuMbtiBridgeEvidence.filter(record) : [];
      const traces = scenes.flatMap(s=>record(s.interaction) ? [s.interaction] : []);
      const traceIds = new Set(traces.map(t=>t.interactionId));
      const supported = (ids: unknown, valid: Set<unknown>) => texts(ids) && (ids as unknown[]).every(id=>valid.has(id));
      need(plan.version === "comprehensive_narrative_v2" && Array.isArray(plan.themes) && plan.themes.length >= 2 && plan.themes.length <= 4, "narrative_themes");
      if (Array.isArray(plan.themes)) for (const theme of plan.themes) {
        if (!record(theme)) { need(false,"narrative_theme"); continue; }
        need(fields(theme,["title","reading"]) && supported(theme.sajuEvidenceIds,facts) && Array.isArray(theme.sajuEvidenceIds) && theme.sajuEvidenceIds.length>0, "narrative_theme_facts");
        const trace=traces.find(t=>t.interactionId===theme.interactionId);
        need(theme.interactionId === undefined
          ? Array.isArray(theme.mbtiEvidenceIds) && theme.mbtiEvidenceIds.length===0
          : !!trace && JSON.stringify(trace.myeongliEvidenceIds)===JSON.stringify(theme.sajuEvidenceIds) && JSON.stringify(trace.mbtiEvidenceIds)===JSON.stringify(theme.mbtiEvidenceIds), "narrative_theme_interaction");
      }
      need(rows(plan.sections,["readingId","question"],10) && plan.sections.length===10, "narrative_sections");
      need(Array.isArray(plan.sections) && COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS.every(id =>
        (plan.sections as unknown[]).filter(s => record(s) && s.readingId === id).length === 1), "narrative_section_coverage");
      const allocated:unknown[]=[];
      if(Array.isArray(plan.sections)) for(const section of plan.sections) {
        if(!record(section)) continue;
        need(supported(section.featureIds,featureIds) && supported(section.mbtiTraitIds,traitIds) && supported(section.interactionIds,traceIds), "narrative_section_refs");
        if(Array.isArray(section.interactionIds)) allocated.push(...section.interactionIds);
      }
      need(new Set(allocated).size===allocated.length && traceIds.size===allocated.length, "narrative_scene_ownership");
    }

    need(Array.isArray(e.sections) && e.sections.every(s => record(s) && rows(s.primarySaju, ["sourceId", "sourceLabelKo", "summary"], ["manse_table", "mbti_table", "mbti_core"].includes(String(s.sectionId)) ? 0 : 1) && Array.isArray(s.supportingMbti) && Array.isArray(s.fusion)), "section_evidence");
  } else if (product === "career_money_study") {
    need(fields(e.myeongliCareerBasis, ["dayMasterPlain", "careerPlain", "moneyPlain", "studyPlain"]) && record(e.myeongliCareerBasis) &&
      ["dominantElements", "missingElements", "heavyElements", "tenGodFocus"].every(k => texts((e.myeongliCareerBasis as Row)[k])), "myeongliCareerBasis");
    need(fields(e.mbtiCareerBasis, ["workStylePlain", "strengthPlain", "riskPlain", "moneyBehaviorPlain", "studyPlain"]) && record(e.mbtiCareerBasis) && (e.mbtiCareerBasis.type ?? "") === (e.mbtiType ?? ""), "mbtiCareerBasis");
    need(fields(e.combinedCareerProfile, ["headline", "plain"]), "combinedCareerProfile");
    need(rows(e.recommendedJobs, ["title", "reason", "caution", "fit"]), "recommendedJobs");
    need(rows(e.careerPaths, ["label", "plain", "risk"]), "careerPaths");
    need(rows(e.moneyStrategies, ["label", "plain"]), "moneyStrategies");
    need(fields(e.investmentProfile, ["headline", "plain", "disclaimer"]), "investmentProfile");
    need(fields(e.studyCertificateStrategy, ["headline", "plain"]), "studyCertificateStrategy");
    need(rows(e.myeongliSignalInterpretations, ["label", "basis", "interpretation"]), "myeongliSignalInterpretations");
    const columns = e.manseRyeokPillars;
    need(rows(columns, ["columnId", "pillar", "heavenlyStem", "earthlyBranch"], 3), "manseRyeokPillars");
    if (Array.isArray(columns) && contexts?.person) for (const [key, pillar] of Object.entries(contexts.person.confirmed)) {
      const matches = columns.filter(r => record(r) && r.columnId === key);
      const r = matches[0];
      need(matches.length === 1 && record(r) && publishedPillarMatches(r.pillar, pillar) && r.heavenlyStem === pillar?.stem && r.earthlyBranch === pillar?.branch &&
        ["hiddenStems", "tenGod", "twelveLifeStage"].every(k => Array.isArray(r[k]) && r[k].length > 0), `manseRyeokPillars.${key}`);
    }
  } else if (product === "love_marriage_child") {
    const s = record(e.sajuBasis) ? e.sajuBasis : {};
    need(fields(s, ["dayMaster", "dayPillar", "dayBranch"]) && s.dayMaster === contexts?.person?.confirmed.day?.stem && s.dayBranch === contexts?.person?.confirmed.day?.branch && publishedPillarMatches(s.dayPillar, contexts?.person?.confirmed.day), "sajuBasis");
    need(rows(s.fullPillars, ["key", "pillar", "stem", "branch"], 3), "fullPillars");
    if (Array.isArray(s.fullPillars) && contexts?.person) for (const [key, pillar] of Object.entries(contexts.person.confirmed)) {
      const matches = s.fullPillars.filter(r => record(r) && r.key === key), r = matches[0];
      need(matches.length === 1 && record(r) && r.stem === pillar?.stem && r.branch === pillar?.branch &&
        Array.isArray(r.hiddenStems) && r.hiddenStems.length > 0 && ["twelveLifeStage", "twelveSinsal", "sinsal", "gwiin", "interactions"].every(k => texts(r[k])), `fullPillars.${key}`);
    }
    need(fields(s.spousePalaceSignal, ["dayBranch", "label", "plain"]) && record(s.spousePalaceSignal) && s.spousePalaceSignal.dayBranch === s.dayBranch, "spousePalaceSignal");
    for (const key of ["loveTenGodSignals", "marriageTenGodSignals", "parentingTenGodSignals", "attractionSignals", "conflictSignals", "supportSignals", "relationInteractionSignals"]) need(rows(s[key], ["label", "plain", "strength", "tone"], 0), key);
    const m = record(e.mbtiBasis) ? e.mbtiBasis : {};
    need(texts(m.reportUseCases), "mbtiBasis.reportUseCases");
    for (const key of ["loveTraits", "marriageTraits", "parentingTraits", "childRoleTraits", "relationshipTraits", "communicationTraits", "risks", "growth"]) need(rows(m[key], ["label", "plain"], record(basis.person) && basis.person.mbtiType ? 1 : 0), `mbtiBasis.${key}`);
  } else if (product === "major_fortune" || product === "annual_fortune") {
    need(record(e.baseSaju) && texts(e.baseSaju.natalLabels), "baseSaju");
    need(fields(e.mbtiBasis, ["summary", "stressPattern", "workPattern", "relationshipPattern"]) && record(e.mbtiBasis) && record(basis.person) && (e.mbtiBasis.type ?? "") === basis.person.mbtiType, "mbtiBasis");
    need(record(e.domainFlows) && ["careerWork", "moneyResource", "relationshipLove", "healthRoutine", "socialFamily", "studyGrowth"].every(k => record((e.domainFlows as Row)[k])), "domainFlows");
    need(rows(e.riskPatterns, ["title", "summary", "prevention"], 0) && rows(e.actionGuides, ["title", "action", "timingHint"]), "domain_actions");
    if (product === "major_fortune") {
      const cycles = record(e.customerDayun) && Array.isArray(e.customerDayun.cycles) ? e.customerDayun.cycles : [];
      need(rows(e.majorFortuneTimeline, ["ganji", "ageRange", "yearRange", "shortInterpretation"], 12) && e.majorFortuneTimeline.length === cycles.length &&
        e.majorFortuneTimeline.every((r, i) => record(cycles[i]) && r.ganji === cycles[i].ganji && r.yearRange === `${cycles[i].startYear}년~${cycles[i].endYear}년` && r.ageRange === `${cycles[i].startAge}세~${cycles[i].endAge}세`), "majorFortuneTimeline");
      for (const key of ["majorFortuneTimelineRows", "cycleYearTimeline"]) {
        const a = e[key], b = draft[key];
        const identifiers = key === "majorFortuneTimelineRows" ? ["year", "majorGanji", "annualGanji", "yearIndexInCycle"] : ["year", "ganji", "yearIndexInCycle"];
        need(Array.isArray(a) && a.length === 10 && Array.isArray(b) && b.length === 10 && a.every((r, i) => record(r) && record(b[i]) && identifiers.every(k => r[k] === b[i][k])), key);
      }
      need(fields(e.tenYearFlowSummary, ["headline", "summary"]) && record(e.currentAnnualCross) && e.currentAnnualCross.selectedYear === e.currentYear, "ten_year_basis");
    } else {
      const annual = e.annualFortune;
      const expected = Number.isInteger(e.selectedYear) ? getAnnualGanjiInfo(e.selectedYear as number) : null;
      need(record(basis.productOptions) && Number(basis.productOptions.selectedYear) === e.selectedYear, "requested_selectedYear");
      need(fields(annual, ["ganji", "stem", "branch", "stemTenGod", "branchTenGod", "interpretation", "yearTheme"]) && record(annual) && expected !== null &&
        annual.year === e.selectedYear && e.targetYear === e.selectedYear && annual.ganji === expected.ganji && annual.stem === expected.stem && annual.branch === expected.branch &&
        record(e.annualGanji) && e.annualGanji.ganji === expected.ganji && record(e.majorAnnualCross) && e.majorAnnualCross.annualGanji === expected.ganji, "annualFortune");
      need(record(e.natalAnnualRelations) && rows(e.natalAnnualRelations.interactions, ["plain"], 0) && fields(e.natalAnnualRelations, ["annualBranch", "interpretation", "caution"]), "natalAnnualRelations");
      need(rows(e.monthlyFortunes, ["label", "ganji", "stem", "branch", "stemTenGod", "branchTenGod", "interpretation", "actionHint", "caution"], 12) && e.monthlyFortunes.length === 12 &&
        e.monthlyFortunes.every((r, i) => r.month === i + 1 && expected !== null && r.ganji === getAnnualMonthGanjiInfo({ year: expected.year, month: i + 1 }).ganji &&
          r.stem + String(r.branch) === r.ganji && text(r.monthTheme) && texts(r.supportSignals) && texts(r.frictionSignals)), "monthlyFortunes");
      need(fields(e.yearlyThemeSummary, ["headline", "summary"]), "yearlyThemeSummary");
    }
  } else if (product === "saju_mbti_compatibility") {
    need(basis.relationshipType === e.relationshipType, "relationshipType");
  }
  if (product !== "saju_mbti_full" && product !== "saju_mbti_compatibility") need(texts(e.safetyNotes) && (e.safetyNotes as unknown[]).length > 0, "safetyNotes");
  return errors;
}
