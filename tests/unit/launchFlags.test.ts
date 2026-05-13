import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_LAUNCH_FLAGS,
  isInternalPreviewEnabled,
  isPaidUnlockEnabled,
  isPaymentEnabled,
  isPublicPaidLaunchEnabled,
  parseLaunchFlagValue,
  requirePaidUnlockEnabled,
  requirePaymentEnabled,
  requirePublicPaidLaunchEnabled,
  resolveLaunchFlags,
} from "@/lib/launchFlags";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("launch flags", () => {
  it("keeps paid flows disabled by default", () => {
    expect(DEFAULT_LAUNCH_FLAGS.PAYMENT_ENABLED).toBe(false);
    expect(DEFAULT_LAUNCH_FLAGS.PAID_UNLOCK_ENABLED).toBe(false);
    expect(DEFAULT_LAUNCH_FLAGS.PUBLIC_PAID_LAUNCH_ENABLED).toBe(false);
    expect(DEFAULT_LAUNCH_FLAGS.INTERNAL_PREVIEW_ENABLED).toBe(true);
  });

  it("parses safe boolean strings", () => {
    for (const value of ["true", "1", "yes", " TRUE ", " Yes "]) {
      expect(parseLaunchFlagValue(value)).toBe(true);
    }

    for (const value of ["false", "0", "no", " FALSE ", " No "]) {
      expect(parseLaunchFlagValue(value)).toBe(false);
    }

    expect(parseLaunchFlagValue(undefined)).toBeUndefined();

    for (const value of ["", "maybe", "enabled", "disabled"]) {
      expect(parseLaunchFlagValue(value)).toBeUndefined();
    }
  });

  it("uses defaults without overrides", () => {
    expect(resolveLaunchFlags()).toEqual(DEFAULT_LAUNCH_FLAGS);
  });

  it("applies boolean overrides", () => {
    const enabledValue = true;
    const disabledValue = false;

    expect(
      resolveLaunchFlags({
        PAYMENT_ENABLED: enabledValue,
        PAID_UNLOCK_ENABLED: enabledValue,
        PUBLIC_PAID_LAUNCH_ENABLED: enabledValue,
        INTERNAL_PREVIEW_ENABLED: disabledValue,
      }),
    ).toEqual({
      PAYMENT_ENABLED: true,
      PAID_UNLOCK_ENABLED: true,
      PUBLIC_PAID_LAUNCH_ENABLED: true,
      INTERNAL_PREVIEW_ENABLED: false,
    });
  });

  it("applies string overrides", () => {
    expect(
      resolveLaunchFlags({
        PAYMENT_ENABLED: "true",
        PAID_UNLOCK_ENABLED: "1",
        PUBLIC_PAID_LAUNCH_ENABLED: "yes",
        INTERNAL_PREVIEW_ENABLED: "false",
      }),
    ).toEqual({
      PAYMENT_ENABLED: true,
      PAID_UNLOCK_ENABLED: true,
      PUBLIC_PAID_LAUNCH_ENABLED: true,
      INTERNAL_PREVIEW_ENABLED: false,
    });
  });

  it("ignores invalid string overrides", () => {
    expect(
      resolveLaunchFlags({
        PAYMENT_ENABLED: "enabled",
        PAID_UNLOCK_ENABLED: "disabled",
        PUBLIC_PAID_LAUNCH_ENABLED: "maybe",
        INTERNAL_PREVIEW_ENABLED: "",
      }),
    ).toEqual(DEFAULT_LAUNCH_FLAGS);
  });

  it("reflects flag values through convenience helpers", () => {
    expect(isPaymentEnabled()).toBe(false);
    expect(isPaidUnlockEnabled()).toBe(false);
    expect(isPublicPaidLaunchEnabled()).toBe(false);
    expect(isInternalPreviewEnabled()).toBe(true);

    const flags = resolveLaunchFlags({
      PAYMENT_ENABLED: "true",
      PAID_UNLOCK_ENABLED: "true",
      PUBLIC_PAID_LAUNCH_ENABLED: "true",
      INTERNAL_PREVIEW_ENABLED: "false",
    });

    expect(isPaymentEnabled(flags)).toBe(true);
    expect(isPaidUnlockEnabled(flags)).toBe(true);
    expect(isPublicPaidLaunchEnabled(flags)).toBe(true);
    expect(isInternalPreviewEnabled(flags)).toBe(false);
  });

  it("blocks disabled paid flows with typed guard results", () => {
    expect(requirePaymentEnabled()).toEqual({
      ok: false,
      code: "PAYMENT_DISABLED",
      messageKo: "현재 결제 기능은 활성화되어 있지 않습니다.",
    });
    expect(requirePaidUnlockEnabled()).toEqual({
      ok: false,
      code: "PAID_UNLOCK_DISABLED",
      messageKo:
        "현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.",
    });
    expect(requirePublicPaidLaunchEnabled()).toEqual({
      ok: false,
      code: "PUBLIC_PAID_LAUNCH_DISABLED",
      messageKo: "현재 공개 유료 출시는 활성화되어 있지 않습니다.",
    });
  });

  it("allows enabled flows when explicitly enabled", () => {
    const enabledValue = true;

    expect(
      requirePaymentEnabled(
        resolveLaunchFlags({ PAYMENT_ENABLED: enabledValue }),
      ),
    ).toEqual({ ok: true });
    expect(
      requirePaidUnlockEnabled(
        resolveLaunchFlags({ PAID_UNLOCK_ENABLED: enabledValue }),
      ),
    ).toEqual({ ok: true });
    expect(
      requirePublicPaidLaunchEnabled(
        resolveLaunchFlags({ PUBLIC_PAID_LAUNCH_ENABLED: enabledValue }),
      ),
    ).toEqual({ ok: true });
  });

  it("keeps source free of unsafe runtime markers", () => {
    const source = readSource("src/lib/launchFlags.ts");
    const unsafeMarkers = [
      ["process", ".env"].join(""),
      ["NEXT", "_PUBLIC"].join(""),
      ["SEC", "RET"].join(""),
      ["K", "EY"].join(""),
      ["TO", "KEN"].join(""),
      ["console", "."].join(""),
    ];

    for (const marker of unsafeMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
