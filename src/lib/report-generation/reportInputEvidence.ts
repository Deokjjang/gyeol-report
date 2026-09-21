import type { ReportGenerationInput } from "./reportInputAdapter";

// Bound by the handler, never by the writer. Kept with the existing input/report retention.
export function withReportInputEvidence<T>(packet: T, input: ReportGenerationInput) {
  return { ...packet, inputBasis: input.kind === "compatibility"
    ? { personA: input.personA, personB: input.personB, relationshipType: input.relationshipType }
    : { person: input.person, userContext: input.userContext, productOptions: input.productOptions } };
}
