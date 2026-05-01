import { createReportFromRawInput } from "../report/pipeline";
import type { ReportRequestRawInput } from "../validation/types";
import type { CreateReportApiEnvelope } from "./reportTypes";

function isJsonObject(json: unknown): json is Record<string, unknown> {
  return typeof json === "object" && json !== null && !Array.isArray(json);
}

export function createReportApiEnvelopeFromJson(
  json: unknown,
): CreateReportApiEnvelope {
  if (!isJsonObject(json)) {
    return {
      status: 400,
      body: {
        ok: false,
        errors: [
          {
            field: "birthDate",
            code: "BIRTH_DATE_REQUIRED",
            messageKo: "요청 형식이 올바르지 않습니다.",
          },
        ],
      },
    };
  }

  const raw = json as ReportRequestRawInput;
  const result = createReportFromRawInput(raw);

  if (!result.ok) {
    return {
      status: 400,
      body: {
        ok: false,
        errors: result.errors,
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      report: result.report,
    },
  };
}
