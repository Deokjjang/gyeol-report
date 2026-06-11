import { randomUUID } from "node:crypto";

import { createReadyPaymentOrder } from "../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../src/lib/payment/supabaseReadyPaymentOrderClient";
import { markTossPaymentOrderPaid } from "../src/lib/payment/supabaseTossPaymentOrderPaidAdapter";
import { createSupabaseTossPaymentOrderPaidClient } from "../src/lib/payment/supabaseTossPaymentOrderPaidClient";

type RequiredSupabaseEnvName = "SUPABASE_URL" | "SUPABASE_ANON_KEY";

const requiredSupabaseEnvNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const satisfies readonly RequiredSupabaseEnvName[];
const productType = "saju_mbti_full";
const provider = "toss";
const inputSnapshot = {
  displayName: "MARK_TOSS_PAYMENT_ORDER_PAID_SMOKE",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  calendarType: "SOLAR",
  gender: "FEMALE",
  mbtiType: "ENTJ",
  timezone: "Asia/Seoul",
} as const;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function createSmokeError(message: string): Error {
  return new Error(`Mark Toss payment order paid smoke failed: ${message}`);
}

function createSmokeRunId(): string {
  return randomUUID();
}

function getRequiredEnvValue(name: RequiredSupabaseEnvName): string {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw createSmokeError(`set ${name} first.`);
  }

  return value;
}

function assertRequiredSupabaseEnv(): void {
  for (const name of requiredSupabaseEnvNames) {
    getRequiredEnvValue(name);
  }
}

async function run(): Promise<void> {
  assertRequiredSupabaseEnv();
  writeStatus("start");

  const supabaseUrl = getRequiredEnvValue("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnvValue("SUPABASE_ANON_KEY");
  const readyClient = createSupabaseReadyPaymentOrderClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const paidClient = createSupabaseTossPaymentOrderPaidClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const runId = createSmokeRunId();
  const createResult = await createReadyPaymentOrder({
    productType,
    provider,
    inputSnapshot,
    providerOrderId: `smoke_provider_order_paid_${runId}`,
    client: readyClient,
  });

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created ready payment order id: ${createResult.order.paymentOrderId}`);

  const paidResult = await markTossPaymentOrderPaid({
    providerOrderId: createResult.order.providerOrderId,
    providerPaymentId: `toss_payment_smoke_${runId}`,
    amount: 990,
    currency: "KRW",
    client: paidClient,
  });

  if (!paidResult.ok) {
    throw createSmokeError(paidResult.error.code);
  }

  writeStatus(`marked paid payment order id: ${paidResult.order.paymentOrderId}`);
  writeStatus(`status: ${paidResult.order.status}`);
  writeStatus(`amount/currency: ${paidResult.order.amount} ${paidResult.order.currency}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${
      error instanceof Error
        ? error.message
        : "Mark Toss payment order paid smoke failed."
    }\n`,
  );
  process.exitCode = 1;
});
