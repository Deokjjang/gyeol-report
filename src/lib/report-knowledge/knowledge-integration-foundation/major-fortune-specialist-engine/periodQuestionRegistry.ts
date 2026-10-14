import { MAJOR_YEAR_MATRIX } from "../../major-fortune-product-research/yearMatrix";
import { recordHash } from "../sourceReader";
import type { MajorSpecialistIndex } from "./candidateIndex";
import type { InformationFunction, MajorPeriodQuestion, MajorQuestionMaterialLink } from "./types";
const functions: Readonly<Record<string, InformationFunction>> = { background: "CONTINUITY", annual: "NEW_CALCULATED_FACT", novelty: "CONDITIONAL_COMPARISON", positive: "WITHHELD", risk: "WITHHELD", natal: "CONTINUITY", previous: "CONDITIONAL_COMPARISON", next: "CONDITIONAL_COMPARISON", transition: "CONDITIONAL_COMPARISON", domain: "WITHHELD", unsupported: "UNSUPPORTED", "new-information": "WITHHELD" };
export class MajorPeriodQuestionIndex {
  readonly questions: MajorPeriodQuestion[] = [];
  readonly byId = new Map<string, MajorPeriodQuestion>();
  readonly byYear = new Map<number, MajorPeriodQuestion[]>();
  readonly links: MajorQuestionMaterialLink[] = [];
  constructor(readonly index: MajorSpecialistIndex, readonly baseYear: number) {
    if (!Number.isInteger(baseYear)) throw Error("EXPLICIT_BASE_YEAR_REQUIRED");
    for (const row of MAJOR_YEAR_MATRIX) {
      const key = index.byOriginalId.get(row.id), source = key ? index.candidates.get(key) : null;
      if (!source || row.offset < -3 || row.offset > 10 || row.questions.length !== 12) throw Error("ORIGINAL_MAJOR_YEAR_MATRIX_REQUIRED");
      for (const [i, q] of row.questions.entries()) {
        const native = index.foundation.registry.questions.find(x => x.productKey === "major_fortune" && x.sourceCatalogKey === source.catalogKey && x.address.sentenceRole === q.key);
        if (!native || native.originalQuestion !== q.question || native.originalContractHash !== recordHash(q)) throw Error("ORIGINAL_FOUNDATION_QUESTION_REQUIRED");
        const calendarYear = baseYear + row.offset, id = `${native.id}@${calendarYear}`;
        const originalSourceLocator = native.originalContractLocator;
        const question: MajorPeriodQuestion = { id, productKey: "major_fortune", relativeYearOffset: row.offset, calendarYear, questionKey: q.key, originalQuestion: q.question, originalSourceLocator, originalRecordHash: recordHash(q), originalStatus: "REFERENCE_ONLY", originalScope: row.scope, requiredTemporalScope: native.requirement.requiredTemporalScope ?? "UNKNOWN", requirement: { original: { requires: q.requires, requiredFacts: row.requiredFacts, sourceRefs: row.sourceRefs }, field: `/questions/${i}/requires`, state: "CONTRACT_NOT_MACHINE_CHECKABLE", requiredProducer: [], requiredActualEvidence: q.requires, requiredParticipants: null, requiredSourceRoots: [] }, informationFunction: functions[q.key], missingPolicy: q.missingPolicy, reviewState: "APPROVAL_PENDING" };
        this.questions.push(question); this.byId.set(id, question); this.byYear.set(calendarYear, [...(this.byYear.get(calendarYear) ?? []), question]);
        this.links.push({ questionId: id, catalogKey: source.catalogKey, kind: "ORIGINAL_REFERENCE_ONLY", reason: "ORIGINAL_YEAR_MATRIX_PARENT_NOT_INTERPRETATION_APPROVAL", customerEligible: false });
        for (const c of index.candidates.values()) {
          if (c === source || c.researchKind === "YEAR_SLOT_QUESTION") continue;
          const link = q.key === "background" && ["CYCLE_STRUCTURE", "TEN_GOD_LONG_TERM", "CYCLE_DEVELOPMENT", "EDITORIAL_PHASE"].includes(c.researchKind) || ["previous", "next", "novelty", "new-information"].includes(q.key) && c.researchKind === "YEAR_COMPARISON" || q.key === "transition" && c.researchKind === "TRANSITION_POLICY" || q.key === "domain" && c.researchKind === "LIFE_DOMAIN_APPLICATION" || ["natal", "annual"].includes(q.key) && c.researchKind === "TEMPORAL_INTERACTION";
          if (link) this.links.push({ questionId: id, catalogKey: c.catalogKey, kind: "PROPOSED_SCOPE_LINK", reason: "STRUCTURAL_RESEARCH_ROLE_ONLY_MEANING_APPLICATION_UNREVIEWED", customerEligible: false });
        }
      }
    }
    if (this.questions.length !== 168 || this.byYear.size !== 14 || this.byId.size !== 168) throw Error("ORIGINAL_14_BY_12_QUESTION_CONTRACT");
  }
}
