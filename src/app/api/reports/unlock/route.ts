import { NextResponse } from "next/server";

import { requirePaidUnlockEnabled } from "../../../../lib/launchFlags";

type PaidUnlockDisabledResponse = {
  readonly ok: false;
  readonly code: "PAID_UNLOCK_DISABLED";
  readonly messageKo: string;
};

const PAID_UNLOCK_DISABLED_MESSAGE =
  "현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.";

export async function POST(): Promise<
  NextResponse<PaidUnlockDisabledResponse>
> {
  // Skeleton only: no provider payment verification yet.
  // This route does not mutate persistence, perform report unlock, or issue plaintext access token.
  const guardResult = requirePaidUnlockEnabled();
  const messageKo = guardResult.ok
    ? PAID_UNLOCK_DISABLED_MESSAGE
    : guardResult.messageKo;

  return NextResponse.json<PaidUnlockDisabledResponse>(
    {
      ok: false,
      code: "PAID_UNLOCK_DISABLED",
      messageKo,
    },
    { status: 503 },
  );
}
