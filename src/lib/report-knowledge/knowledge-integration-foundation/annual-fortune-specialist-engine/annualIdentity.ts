import { canonicalJson } from "../sourceReader";
import { evidenceHash } from "../actual-evidence-graph/graph";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { AnnualSegment } from "./types";
/** Validate existing identity only. Never issue a new Evidence ID or root. */
export function validateAnnualNodeIdentity(n: ActualEvidenceNode, s: AnnualSegment, extensionVersion?: string): string[] {
 const extension = n.fact.observationPointer.includes("/extendedEvidence/features/"), expected = extension ? { file:"src/lib/report-knowledge/annualMonthExtendedEvidence.ts",symbol:"extendAnnualMonthEvidence",version:extensionVersion ?? "annual-month-evidence-v1",system:"annual-month-extension" } : { file:"src/lib/report-knowledge/annualMonthJie.ts",symbol:"buildAnnualMonthCalendar",version:s.sourceVersion,system:"annual-month" }, reasons: string[] = [];
 if(canonicalJson(n.producer)!==canonicalJson(expected))reasons.push("ORIGINAL_ANNUAL_PRODUCER_IDENTITY_REQUIRED");
 if(n.owner.fixtureOwnerId!==s.owner)reasons.push("WRONG_OWNER");
 if(!n.fact.observationPointer.startsWith(s.originalPointer+"/") || n.temporal?.start!==s.raw.startKst || n.temporal.endExclusive!==s.raw.endKstExclusive)reasons.push("ORIGINAL_SEGMENT_POINTER_WINDOW_REQUIRED");
 const beforeFirst=n.value && typeof n.value==="object" && "component" in n.value && n.value.component==="dayun" && s.raw.activeDayunContext.status==="before_first_cycle";
 if(n.kind!==(beforeFirst?"UNKNOWN_REQUIREMENT":"CALCULATED_PERIOD_FACT"))reasons.push("SOURCE_DECLARATION_IS_NOT_MONTHLY_EVIDENCE");
 if(n.fact.rootId){const identity=[n.owner.fixtureOwnerId,n.producer,n.fact.producerEvidenceId??n.fact.observationPointer,n.participants,n.temporal,n.direction,n.value];if(n.fact.rootId!==`aeg:root:${evidenceHash(identity)}`)reasons.push("ORIGINAL_CANONICAL_ROOT_IDENTITY_REQUIRED");}
 return reasons;
}
