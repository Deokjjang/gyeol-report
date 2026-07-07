export type ReportWriterRuntimeEnvironment = {
  readonly [key: string]: string | undefined;
  readonly OPENAI_REPORT_WRITER_ENABLED?: string;
  readonly OPENAI_API_KEY?: string;
  readonly OPENAI_REPORT_MODEL?: string;
};

export type ReportWriterRuntimeDisabledReason =
  | "flag_disabled"
  | "missing_api_key"
  | "missing_model"
  | "missing_api_key_and_model";

export type ReportWriterRuntime =
  | {
      readonly enabled: true;
      readonly config: {
        readonly enabled: true;
        readonly apiKey: string;
        readonly model: string;
      };
    }
  | {
      readonly enabled: false;
      readonly reason: ReportWriterRuntimeDisabledReason;
    };

export function resolveReportWriterRuntime(
  env: ReportWriterRuntimeEnvironment = process.env,
): ReportWriterRuntime {
  if (env.OPENAI_REPORT_WRITER_ENABLED !== "1") {
    return {
      enabled: false,
      reason: "flag_disabled",
    };
  }

  const apiKey = normalizeEnvString(env.OPENAI_API_KEY);
  const model = normalizeEnvString(env.OPENAI_REPORT_MODEL);

  if (apiKey === undefined && model === undefined) {
    return {
      enabled: false,
      reason: "missing_api_key_and_model",
    };
  }

  if (apiKey === undefined) {
    return {
      enabled: false,
      reason: "missing_api_key",
    };
  }

  if (model === undefined) {
    return {
      enabled: false,
      reason: "missing_model",
    };
  }

  return {
    enabled: true,
    config: {
      enabled: true,
      apiKey,
      model,
    },
  };
}

function normalizeEnvString(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}
