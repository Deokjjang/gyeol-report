import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
} from "../src/lib/report-generation/openaiReportWriterClient";

type RequiredOpenAITransportEnvName =
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const requiredOpenAITransportEnvNames = [
  "OPENAI_REPORT_WRITER_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_REPORT_MODEL",
] as const satisfies readonly RequiredOpenAITransportEnvName[];

const tinyJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["ok"],
  properties: {
    ok: {
      type: "boolean",
    },
  },
} as const;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeErrorStatus(message: string): void {
  process.stderr.write(`${message}\n`);
}

function getEnvValue(name: RequiredOpenAITransportEnvName): string | undefined {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function shouldSkipSmoke(): boolean {
  return (
    requiredOpenAITransportEnvNames.some((name) => getEnvValue(name) === undefined) ||
    getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1"
  );
}

function writeSafeFailure(error: unknown): void {
  writeErrorStatus("failed");

  if (isOpenAIReportWriterClientError(error)) {
    writeErrorStatus(`code: ${error.code}`);
    writeErrorStatus("stage: openai");
    if (error.status !== undefined) {
      writeErrorStatus(`status: ${error.status}`);
    }
    if (error.errorType !== undefined) {
      writeErrorStatus(`errorType: ${error.errorType}`);
    }
    if (error.errorCode !== undefined) {
      writeErrorStatus(`errorCode: ${error.errorCode}`);
    }
    if (error.diagnosticMessage !== undefined) {
      writeErrorStatus(`message: ${error.diagnosticMessage}`);
    }
    if (error.errorParam !== undefined) {
      writeErrorStatus(`param: ${error.errorParam}`);
    }
    if (error.requestId !== undefined) {
      writeErrorStatus(`requestId: ${error.requestId}`);
    }
    return;
  }

  writeErrorStatus("code: OPENAI_REPORT_WRITER_TRANSPORT_SMOKE_FAILED");
  writeErrorStatus("stage: unknown");
}

async function run(): Promise<void> {
  if (shouldSkipSmoke()) {
    writeStatus("skipped: OpenAI report writer transport smoke is not enabled.");
    return;
  }

  const apiKey = getEnvValue("OPENAI_API_KEY");
  const model = getEnvValue("OPENAI_REPORT_MODEL");

  if (apiKey === undefined || model === undefined) {
    writeStatus("skipped: OpenAI report writer transport env is incomplete.");
    return;
  }

  writeStatus("start");

  await callOpenAIReportWriter({
    config: {
      apiKey,
      model,
      enabled: true,
    },
    messages: {
      system: "Return only valid JSON matching the provided schema.",
      developer: "This is a transport smoke. Do not include prose.",
      user: "Return {\"ok\":true}.",
    },
    jsonSchema: tinyJsonSchema,
  });

  writeStatus("transport ok");
  writeStatus(`model: ${model}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  writeSafeFailure(error);
  process.exitCode = 1;
});
