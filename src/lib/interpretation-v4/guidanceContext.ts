import { JOB_STATUSES, RELATIONSHIP_STATUSES, type JobStatus, type RelationshipStatus, type SinglePersonReportInputPayload } from "../report-generation/reportInputTypes";
import { classifyGuidanceWorkModes } from "./guidanceJobClassifier";
import type { GuidanceUserContext, LifeStatus, GuidanceRelationshipStatus } from "./guidanceCore";

export type GuidanceContextInput = Partial<Pick<SinglePersonReportInputPayload["userContext"], "jobStatus" | "detailJob" | "relationshipStatus">>;
const LIFE_MAP: Record<JobStatus, LifeStatus> = { "": "UNKNOWN", student: "STUDENT", job_seeker: "JOB_SEEKER", employee: "EMPLOYEE", freelancer: "FREELANCER", self_employed: "BUSINESS_OWNER", business_owner: "BUSINESS_OWNER", homemaker: "OTHER", unemployed: "OTHER", other: "OTHER" };
const RELATION_MAP: Record<RelationshipStatus, GuidanceRelationshipStatus> = { "": "UNKNOWN", single: "SINGLE", some: "OTHER", dating: "DATING", marriage_preparing: "OTHER", married: "MARRIED" };
/** Canonical payload adapter, not a new form or inference from raw job names. */
export function normalizeGuidanceContext(input: GuidanceContextInput): { ok: true; value: GuidanceUserContext } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (input.jobStatus !== undefined && !JOB_STATUSES.includes(input.jobStatus)) errors.push("INVALID_LIFE_STATUS_INPUT");
  if (input.relationshipStatus !== undefined && !RELATIONSHIP_STATUSES.includes(input.relationshipStatus)) errors.push("INVALID_RELATIONSHIP_INPUT");
  if (input.detailJob !== undefined && typeof input.detailJob !== "string") errors.push("INVALID_JOB_TEXT");
  if (errors.length) return { ok: false, errors };
  const lifeStatus = LIFE_MAP[input.jobStatus ?? ""], relationshipStatus = RELATION_MAP[input.relationshipStatus ?? ""];
  const workModes = classifyGuidanceWorkModes(input.detailJob ?? "", lifeStatus);
  return { ok: true, value: { lifeStatus, relationshipStatus, ...(input.detailJob ? { rawJobText: input.detailJob } : {}), workModes,
    contextConfidence: workModes.reduce((n, m) => n + m.weight * m.confidence, 0),
    provenance: { ...(input.jobStatus !== undefined ? { lifeStatusSource: `userContext.jobStatus:${input.jobStatus}` } : {}),
      ...(input.detailJob !== undefined ? { jobTextSource: "userContext.detailJob" } : {}),
      ...(input.relationshipStatus !== undefined ? { relationshipSource: `userContext.relationshipStatus:${input.relationshipStatus}` } : {}) } } };
}
