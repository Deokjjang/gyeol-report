const REPORT_ID_PREFIX = "report_";
const REPORT_ACCESS_TOKEN_PREFIX = "rpat_";
const REPORT_ID_RANDOM_LENGTH = 13;
const REPORT_ACCESS_TOKEN_RANDOM_LENGTH = 27;
const BASE36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const REPORT_ID_PATTERN = /^report_[a-z0-9]{13,}$/;
const REPORT_ACCESS_TOKEN_PATTERN = /^rpat_[a-z0-9]{27,}$/;

export function createReportId(): string {
  return `${REPORT_ID_PREFIX}${createRandomBase36(REPORT_ID_RANDOM_LENGTH)}`;
}

export function createReportAccessToken(): string {
  return `${REPORT_ACCESS_TOKEN_PREFIX}${createRandomBase36(
    REPORT_ACCESS_TOKEN_RANDOM_LENGTH,
  )}`;
}

export function isValidReportId(value: string): boolean {
  return REPORT_ID_PATTERN.test(value);
}

export function isValidReportAccessToken(value: string): boolean {
  return REPORT_ACCESS_TOKEN_PATTERN.test(value);
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
