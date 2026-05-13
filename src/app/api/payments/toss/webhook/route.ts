import { NextResponse } from "next/server";

import { requirePaymentEnabled } from "../../../../../lib/launchFlags";

type WebhookDisabledResponse = {
  readonly ok: false;
  readonly code: "PAYMENT_DISABLED";
  readonly messageKo: string;
};

const PAYMENT_DISABLED_MESSAGE =
  "현재 결제 기능은 활성화되어 있지 않습니다.";

export async function POST(): Promise<NextResponse<WebhookDisabledResponse>> {
  // Skeleton only: no provider signature verification yet.
  // This route does not mutate persistence or perform report unlock.
  const guardResult = requirePaymentEnabled();
  const messageKo = guardResult.ok
    ? PAYMENT_DISABLED_MESSAGE
    : guardResult.messageKo;

  return NextResponse.json<WebhookDisabledResponse>(
    {
      ok: false,
      code: "PAYMENT_DISABLED",
      messageKo,
    },
    { status: 503 },
  );
}
