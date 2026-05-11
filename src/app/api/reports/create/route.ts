import { NextResponse } from "next/server";

import { createReportApiEnvelopeFromJson } from "../../../../lib/api/createReport";

const REPORT_CREATE_ERROR_MESSAGE =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";

export async function POST(request: Request): Promise<NextResponse> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_REQUEST",
          messageKo: REPORT_CREATE_ERROR_MESSAGE,
        },
        errors: [
          {
            field: "birthDate",
            code: "BIRTH_DATE_REQUIRED",
            messageKo: REPORT_CREATE_ERROR_MESSAGE,
          },
        ],
      },
      { status: 400 },
    );
  }

  const envelope = createReportApiEnvelopeFromJson(json);

  return NextResponse.json(envelope.body, {
    status: envelope.status,
  });
}
