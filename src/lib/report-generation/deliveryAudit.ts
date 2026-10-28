// Persisted per paid job (finish_job.delivery). Shape unchanged since paid-one-call-v1.
export type DeliveryAudit = {
  version: "paid-one-call-v1";
  preflight: "pass" | "fail";
  writerValidation: "not_run" | "pass" | "fail";
  rescueKinds: string[];
  fallbackUsed: boolean;
  publish: "pass" | "fail";
  failureCode: string | null;
  issues: string[];
};

// Per-call audit stored in finish_job.externalCalls. Generation makes no external
// calls any more, so new results always carry an empty list.
export type ExternalCallAudit = {
  sequence: number; model: string; inputTokens: number | null; outputTokens: number | null;
  totalTokens: number | null; durationMs: number; outcome: string;
};

// Validator messages sometimes include rejected prose. Persist codes only.
export function deliveryIssueCodes(issues: readonly string[]): string[] {
  return [...new Set(issues.map(issue => issue.trim().match(/^[A-Z][A-Z0-9_]+/)?.[0] ?? "FIELD_INVALID"))].slice(0, 40);
}
