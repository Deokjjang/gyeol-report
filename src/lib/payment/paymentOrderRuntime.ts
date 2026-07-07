import { createInMemoryPaymentOrderPersistenceAdapter } from "./inMemoryPaymentOrderPersistenceAdapter";
import type { PaymentOrderPersistenceAdapter } from "./paymentOrderPersistenceTypes";

export const PAYMENT_ORDER_PERSISTENCE_ADAPTER_GLOBAL_KEY =
  "__gyeol_payment_order_persistence_adapter_v1__";

type PaymentOrderPersistenceGlobal = typeof globalThis & {
  [PAYMENT_ORDER_PERSISTENCE_ADAPTER_GLOBAL_KEY]?:
    | PaymentOrderPersistenceAdapter
    | undefined;
};

let paymentOrderPersistenceAdapter:
  | PaymentOrderPersistenceAdapter
  | undefined;

export function createPaymentOrderPersistenceRuntime(): PaymentOrderPersistenceAdapter {
  const sharedGlobal = globalThis as PaymentOrderPersistenceGlobal;

  sharedGlobal[PAYMENT_ORDER_PERSISTENCE_ADAPTER_GLOBAL_KEY] ??=
    paymentOrderPersistenceAdapter ??
    createInMemoryPaymentOrderPersistenceAdapter();

  paymentOrderPersistenceAdapter =
    sharedGlobal[PAYMENT_ORDER_PERSISTENCE_ADAPTER_GLOBAL_KEY];

  return paymentOrderPersistenceAdapter;
}
