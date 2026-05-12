import { isValidReportAccessToken } from "./reportPersistenceIds";

const TOKEN_HASH_INPUT_PREFIX = "gyeol-report:v1:access-token:";
const TOKEN_HASH_OUTPUT_PREFIX = "sha256:";

export type ReportAccessTokenHashResult =
  | { ok: true; hash: string }
  | {
      ok: false;
      error: {
        code: "INVALID_REPORT_ACCESS_TOKEN" | "TOKEN_HASH_UNAVAILABLE";
        messageKo: string;
      };
    };

export async function hashReportAccessToken(
  accessToken: string,
): Promise<ReportAccessTokenHashResult> {
  if (!isValidReportAccessToken(accessToken)) {
    return {
      ok: false,
      error: {
        code: "INVALID_REPORT_ACCESS_TOKEN",
        messageKo: "리포트 접근 토큰 형식이 올바르지 않습니다.",
      },
    };
  }

  const subtle = globalThis.crypto?.subtle;

  if (!subtle?.digest) {
    return {
      ok: false,
      error: {
        code: "TOKEN_HASH_UNAVAILABLE",
        messageKo: "접근 토큰을 확인할 수 없습니다.",
      },
    };
  }

  const hashBytes = await subtle.digest(
    "SHA-256",
    textToBytes(`${TOKEN_HASH_INPUT_PREFIX}${accessToken}`),
  );

  return {
    ok: true,
    hash: `${TOKEN_HASH_OUTPUT_PREFIX}${toHex(hashBytes)}`,
  };
}

export async function verifyReportAccessTokenHash(
  accessToken: string,
  expectedHash: string,
): Promise<boolean> {
  const result = await hashReportAccessToken(accessToken);

  if (!result.ok) {
    return false;
  }

  return result.hash === expectedHash;
}

function textToBytes(value: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(value);
  const bytes = new Uint8Array(encoded.byteLength);
  bytes.set(encoded);

  return bytes.buffer;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
