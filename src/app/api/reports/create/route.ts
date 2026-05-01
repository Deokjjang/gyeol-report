import { NextResponse } from "next/server";

import { createReportApiEnvelopeFromJson } from "../../../../lib/api/createReport";

export async function POST(request: Request): Promise<NextResponse> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: [
          {
            field: "birthDate",
            code: "BIRTH_DATE_REQUIRED",
            messageKo: "요청 JSON을 읽을 수 없습니다.",
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
