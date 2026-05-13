export type LaunchFlagName =
  | "PAYMENT_ENABLED"
  | "PAID_UNLOCK_ENABLED"
  | "PUBLIC_PAID_LAUNCH_ENABLED"
  | "INTERNAL_PREVIEW_ENABLED";

export type LaunchFlags = Readonly<Record<LaunchFlagName, boolean>>;

export const DEFAULT_LAUNCH_FLAGS: LaunchFlags = {
  PAYMENT_ENABLED: false,
  PAID_UNLOCK_ENABLED: false,
  PUBLIC_PAID_LAUNCH_ENABLED: false,
  INTERNAL_PREVIEW_ENABLED: true,
};

const launchFlagNames = [
  "PAYMENT_ENABLED",
  "PAID_UNLOCK_ENABLED",
  "PUBLIC_PAID_LAUNCH_ENABLED",
  "INTERNAL_PREVIEW_ENABLED",
] as const satisfies readonly LaunchFlagName[];

export function parseLaunchFlagValue(
  value: string | undefined,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (
    normalizedValue === "true" ||
    normalizedValue === "1" ||
    normalizedValue === "yes"
  ) {
    return true;
  }

  if (
    normalizedValue === "false" ||
    normalizedValue === "0" ||
    normalizedValue === "no"
  ) {
    return false;
  }

  return undefined;
}

export function resolveLaunchFlags(
  overrides: Partial<Record<LaunchFlagName, string | boolean | undefined>> = {},
): LaunchFlags {
  const resolvedFlags: Record<LaunchFlagName, boolean> = {
    ...DEFAULT_LAUNCH_FLAGS,
  };

  for (const flagName of launchFlagNames) {
    const overrideValue = overrides[flagName];

    if (typeof overrideValue === "boolean") {
      resolvedFlags[flagName] = overrideValue;
      continue;
    }

    const parsedValue = parseLaunchFlagValue(overrideValue);

    if (parsedValue !== undefined) {
      resolvedFlags[flagName] = parsedValue;
    }
  }

  return resolvedFlags;
}

export function isPaymentEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): boolean {
  return flags.PAYMENT_ENABLED;
}

export function isPaidUnlockEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): boolean {
  return flags.PAID_UNLOCK_ENABLED;
}

export function isPublicPaidLaunchEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): boolean {
  return flags.PUBLIC_PAID_LAUNCH_ENABLED;
}

export function isInternalPreviewEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): boolean {
  return flags.INTERNAL_PREVIEW_ENABLED;
}

export type LaunchGuardResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly code:
        | "PAYMENT_DISABLED"
        | "PAID_UNLOCK_DISABLED"
        | "PUBLIC_PAID_LAUNCH_DISABLED";
      readonly messageKo: string;
    };

export function requirePaymentEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): LaunchGuardResult {
  return isPaymentEnabled(flags)
    ? { ok: true }
    : {
        ok: false,
        code: "PAYMENT_DISABLED",
        messageKo: "현재 결제 기능은 활성화되어 있지 않습니다.",
      };
}

export function requirePaidUnlockEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): LaunchGuardResult {
  return isPaidUnlockEnabled(flags)
    ? { ok: true }
    : {
        ok: false,
        code: "PAID_UNLOCK_DISABLED",
        messageKo:
          "현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.",
      };
}

export function requirePublicPaidLaunchEnabled(
  flags: LaunchFlags = DEFAULT_LAUNCH_FLAGS,
): LaunchGuardResult {
  return isPublicPaidLaunchEnabled(flags)
    ? { ok: true }
    : {
        ok: false,
        code: "PUBLIC_PAID_LAUNCH_DISABLED",
        messageKo: "현재 공개 유료 출시는 활성화되어 있지 않습니다.",
      };
}
