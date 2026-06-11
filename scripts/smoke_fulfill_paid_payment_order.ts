import { randomUUID } from "node:crypto";

import { createReadyPaymentOrder } from "../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../src/lib/payment/supabaseReadyPaymentOrderClient";
import { fulfillPaidPaymentOrder } from "../src/lib/payment/supabasePaidReportFulfillmentAdapter";
import { createSupabasePaidReportFulfillmentClient } from "../src/lib/payment/supabasePaidReportFulfillmentClient";
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
  displayName: "FULFILL_PAID_PAYMENT_ORDER_SMOKE",
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
  return new Error(`Fulfill paid payment order smoke failed: ${message}`);
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
  const fulfillmentClient = createSupabasePaidReportFulfillmentClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const runId = randomUUID();
  const createResult = await createReadyPaymentOrder({
    productType,
    provider,
    inputSnapshot,
    providerOrderId: `smoke_provider_order_fulfill_${runId}`,
    client: readyClient,
  });

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created ready payment order id: ${createResult.order.paymentOrderId}`);

  const paidResult = await markTossPaymentOrderPaid({
    providerOrderId: createResult.order.providerOrderId,
    providerPaymentId: `toss_payment_fulfillment_smoke_${runId}`,
    amount: 990,
    currency: "KRW",
    client: paidClient,
  });

  if (!paidResult.ok) {
    throw createSmokeError(paidResult.error.code);
  }

  writeStatus(`marked paid payment order id: ${paidResult.order.paymentOrderId}`);

  const fulfillmentResult = await fulfillPaidPaymentOrder({
    providerOrderId: paidResult.order.providerOrderId,
    client: fulfillmentClient,
  });

  if (!fulfillmentResult.ok) {
    throw createSmokeError(fulfillmentResult.error.code);
  }

  writeStatus(`fulfilled report id: ${fulfillmentResult.fulfillment.reportId}`);
  writeStatus(`payment order status: ${fulfillmentResult.fulfillment.status}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${
      error instanceof Error
        ? error.message
        : "Fulfill paid payment order smoke failed."
    }\n`,
  );
  process.exitCode = 1;
});
