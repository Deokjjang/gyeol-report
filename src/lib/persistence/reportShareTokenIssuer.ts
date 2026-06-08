import { hashReportAccessTokenSync } from "./reportAccessTokenHash";
import { createReportAccessToken } from "./reportPersistenceIds";

export const REPORT_SHARE_TOKEN_VERSION = "v1" as const;

export type ReportShareTokenIssue = {
  readonly shareToken: string;
  readonly sharePath: string;
  readonly accessTokenHash: string;
  readonly accessTokenCreatedAt: string;
  readonly accessTokenVersion: string;
};

export type ReportShareTokenIssueResult =
  | {
      readonly ok: true;
      readonly issue: ReportShareTokenIssue;
    }
  | {
      readonly ok: false;
      readonly code: "REPORT_SHARE_TOKEN_HASH_UNAVAILABLE";
      readonly messageKo: string;
    };

export type IssueReportShareTokenInput = {
  readonly nowIso?: string;
};

function createSharePath(shareToken: string): string {
  return `/r/${shareToken}`;
}

export function issueReportShareToken(
  input: IssueReportShareTokenInput = {},
): ReportShareTokenIssueResult {
  const shareToken = createReportAccessToken();
  const hashResult = hashReportAccessTokenSync(shareToken);

  if (!hashResult.ok) {
    return {
      ok: false,
      code: "REPORT_SHARE_TOKEN_HASH_UNAVAILABLE",
      messageKo: "리포트 공유 토큰을 준비하지 못했습니다.",
    };
  }

  return {
    ok: true,
    issue: {
      shareToken,
      sharePath: createSharePath(shareToken),
      accessTokenHash: hashResult.hash,
      accessTokenCreatedAt: input.nowIso ?? new Date().toISOString(),
      accessTokenVersion: REPORT_SHARE_TOKEN_VERSION,
    },
  };
}
