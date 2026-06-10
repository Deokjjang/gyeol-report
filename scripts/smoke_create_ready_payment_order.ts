import { createReadyPaymentOrder } from "../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../src/lib/payment/supabaseReadyPaymentOrderClient";

type RequiredSupabaseEnvName = "SUPABASE_URL" | "SUPABASE_ANON_KEY";

const requiredSupabaseEnvNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const satisfies readonly RequiredSupabaseEnvName[];
const productType = "saju_mbti_full";
const provider = "toss";
const providerOrderIdPrefix = "smoke_provider_order_ready";
const nowIso = "2026-01-01T00:00:00.000Z";
const inputSnapshot = {
  displayName: "READY_PAYMENT_ORDER_SMOKE",
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
  return new Error(`Ready payment order smoke failed: ${message}`);
}

function createSmokeRunId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
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

  const client = createSupabaseReadyPaymentOrderClient({
    supabaseUrl: getRequiredEnvValue("SUPABASE_URL"),
    supabaseAnonKey: getRequiredEnvValue("SUPABASE_ANON_KEY"),
  });
  const createResult = await createReadyPaymentOrder({
    productType,
    provider,
    inputSnapshot,
    providerOrderId: `${providerOrderIdPrefix}_${createSmokeRunId()}`,
    nowIso,
    client,
  });

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created ready payment order id: ${createResult.order.paymentOrderId}`);
  writeStatus(`product type: ${createResult.order.productType}`);
  writeStatus(`provider: ${createResult.order.provider}`);
  writeStatus(`status: ${createResult.order.status}`);
  writeStatus(
    `amount/currency: ${createResult.order.amount} ${createResult.order.currency}`,
  );
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Ready payment order smoke failed."}\n`,
  );
  process.exitCode = 1;
});
