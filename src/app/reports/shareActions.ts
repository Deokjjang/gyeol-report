"use server";

import { issuePublishedReportShare, validShareReportId } from "../../lib/sharing/reportShareStore";

export async function prepareReportShare(reportId: string) {
  // The existing purchase report URL is the bearer capability; no new login is introduced.
  // Recheck paid/publication/expiry on the server; never trust client-supplied card text.
  if (!validShareReportId(reportId)) return { ok: false as const, error: "INVALID_REPORT_ID" };
  return issuePublishedReportShare(reportId);
}
