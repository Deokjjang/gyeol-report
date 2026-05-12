const PAYMENT_ORDER_ID_PREFIX = "order_";
const PAYMENT_ORDER_ID_RANDOM_LENGTH = 16;
const BASE36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const PAYMENT_ORDER_ID_PATTERN = /^order_[a-z0-9]{16,}$/;

export function createPaymentOrderId(): string {
  return `${PAYMENT_ORDER_ID_PREFIX}${createRandomBase36(
    PAYMENT_ORDER_ID_RANDOM_LENGTH,
  )}`;
}

export function isValidPaymentOrderId(value: string): boolean {
  return PAYMENT_ORDER_ID_PATTERN.test(value);
}

function createRandomBase36(length: number): string {
  const randomValues = createRandomValues(length);

  return Array.from(
    randomValues,
    (value) => BASE36_ALPHABET[value % BASE36_ALPHABET.length],
  ).join("");
}

function createRandomValues(length: number): Uint8Array {
  const values = new Uint8Array(length);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return values;
  }

  // Fallback is for local/test environments only; production runtimes should provide Web Crypto.
  for (let index = 0; index < values.length; index += 1) {
    values[index] = Math.floor(Math.random() * 256);
  }

  return values;
}
