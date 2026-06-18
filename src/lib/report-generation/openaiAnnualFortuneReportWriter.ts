import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import type { FiveElement } from "../report-knowledge/annualFortuneTypes";
import {
  annualFortuneReportDraftJsonSchema,
  getAnnualFortuneReportDraftSchemaTopLevelKeys,
  type AnnualFortuneReportDraft,
  type AnnualFortuneReportMode,
} from "./annualFortuneReportDraftTypes";
import {
  assertValidAnnualFortuneReportDraft,
  validateAnnualFortuneReportDraft,
} from "./annualFortuneReportDraftValidator";
import {
  buildOpenAIAnnualFortuneReportWriterMessages,
} from "./openaiAnnualFortuneReportWriterPrompt";

export type AnnualFortuneReportWriterConfig = {
  readonly apiKey: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly fetchImpl?: typeof fetch;
};

export type AnnualFortuneReportWriterResult = {
  readonly draft: AnnualFortuneReportDraft;
  readonly model: string;
};

export type AnnualFortuneOpenAIRequestDiagnostics = {
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly responseFormatName: typeof annualFortuneResponseFormatName;
  readonly schemaTopLevelKeys: readonly string[];
  readonly schemaApproxChars: number;
  readonly model?: string;
};

export const annualFortuneResponseFormatName = "annual_fortune_report_draft";

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

export class AnnualFortuneReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];
  readonly diagnostics?: AnnualFortuneOpenAIRequestDiagnostics;

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly diagnostics?: AnnualFortuneOpenAIRequestDiagnostics;
    readonly cause?: unknown;
  }) {
    super(
      [
        input.code,
        ...(input.validationErrors === undefined
          ? []
          : ["validation errors:", ...input.validationErrors.map((error) => `- ${error}`)]),
        ...(input.diagnostics === undefined
          ? []
          : formatAnnualFortuneOpenAIRequestDiagnostics(input.diagnostics)),
      ].join("\n"),
    );
    this.name = "AnnualFortuneReportWriterFailure";
    this.code = input.code;
    if (input.validationErrors !== undefined) {
      this.validationErrors = input.validationErrors;
    }
    if (input.diagnostics !== undefined) {
      this.diagnostics = input.diagnostics;
    }
    if (input.cause !== undefined) {
      this.cause = input.cause;
    }
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeDiagnosticText(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, "Bearer [redacted]")
    .replace(/sk-[A-Za-z0-9._-]+/g, "sk-[redacted]")
    .replace(/Authorization\s*:\s*[^\n]+/gi, "[redacted-auth]")
    .replace(/OPENAI_API_KEY\s*=\s*[^\s]+/g, "OPENAI_API_KEY=[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function getStringProperty(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  const property = value[key];

  return typeof property === "string" ? property : undefined;
}

function getNestedErrorRecord(body: unknown): Record<string, unknown> | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  return isRecord(body.error) ? body.error : undefined;
}

async function readSafeOpenAIErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    return text.trim().length === 0
      ? {}
      : { message: sanitizeDiagnosticText(text) };
  } catch {
    return {};
  }
}

function normalizeOpenAIErrorDiagnostics(input: {
  readonly status: number;
  readonly body: unknown;
  readonly model?: string;
}): AnnualFortuneOpenAIRequestDiagnostics {
  const root = isRecord(input.body) ? input.body : undefined;
  const error = getNestedErrorRecord(input.body);
  const source = error ?? root;
  const diagnosticMessage =
    source === undefined
      ? undefined
      : getStringProperty(source, "message") ??
        getStringProperty(source, "error_description");

  return {
    status: input.status,
    responseFormatName: annualFortuneResponseFormatName,
    schemaTopLevelKeys: getAnnualFortuneReportDraftSchemaTopLevelKeys(),
    schemaApproxChars: JSON.stringify(annualFortuneReportDraftJsonSchema).length,
    ...(input.model === undefined ? {} : { model: input.model }),
    ...(source === undefined
      ? {}
      : {
          errorType:
            getStringProperty(source, "type") ??
            getStringProperty(source, "errorType"),
          errorCode:
            getStringProperty(source, "code") ??
            getStringProperty(source, "errorCode"),
          errorParam:
            getStringProperty(source, "param") ??
            getStringProperty(source, "parameter"),
        }),
    ...(diagnosticMessage === undefined
      ? {}
      : { diagnosticMessage: sanitizeDiagnosticText(diagnosticMessage) }),
  };
}

export function formatAnnualFortuneOpenAIRequestDiagnostics(
  diagnostics: AnnualFortuneOpenAIRequestDiagnostics,
): readonly string[] {
  const lines = ["OpenAI request failed:"];

  if (diagnostics.status !== undefined) {
    lines.push(`status: ${diagnostics.status}`);
  }
  if (diagnostics.errorType !== undefined) {
    lines.push(`type: ${sanitizeDiagnosticText(diagnostics.errorType)}`);
  }
  if (diagnostics.errorCode !== undefined) {
    lines.push(`code: ${sanitizeDiagnosticText(diagnostics.errorCode)}`);
  }
  if (diagnostics.diagnosticMessage !== undefined) {
    lines.push(`message: ${sanitizeDiagnosticText(diagnostics.diagnosticMessage)}`);
  }
  if (diagnostics.errorParam !== undefined) {
    lines.push(`param: ${sanitizeDiagnosticText(diagnostics.errorParam)}`);
  }
  if (diagnostics.requestId !== undefined) {
    lines.push(`requestId: ${sanitizeDiagnosticText(diagnostics.requestId)}`);
  }
  lines.push(`response_format name: ${diagnostics.responseFormatName}`);
  lines.push(`schema top-level keys: ${diagnostics.schemaTopLevelKeys.join(", ")}`);
  lines.push(`schema approx chars: ${diagnostics.schemaApproxChars}`);
  if (diagnostics.model !== undefined) {
    lines.push(`model: ${sanitizeDiagnosticText(diagnostics.model)}`);
  }

  return lines;
}

function extractTextFromResponseBody(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }
  const outputText = getStringProperty(body, "output_text");

  if (outputText !== undefined) {
    return outputText;
  }
  if (Array.isArray(body.output)) {
    for (const outputItem of body.output) {
      if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
        continue;
      }
      for (const contentItem of outputItem.content) {
        if (!isRecord(contentItem)) {
          continue;
        }
        const text =
          getStringProperty(contentItem, "text") ??
          getStringProperty(contentItem, "content");

        if (text !== undefined) {
          return text;
        }
      }
    }
  }

  return undefined;
}

function parseJson(rawText: string): unknown {
  try {
    return JSON.parse(rawText) as unknown;
  } catch (error) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_INVALID_JSON",
      cause: error,
    });
  }
}

function getModeLabel(mode: AnnualFortuneReportMode): string {
  if (mode === "past_review") {
    return "회고";
  }
  if (mode === "new_year_preview") {
    return "신년운세";
  }

  return "올해 흐름";
}

function getElementLabel(packet: AnnualFortuneEvidencePacket): string {
  const elements = [
    packet.annualGanji.stemElement,
    packet.annualGanji.branchElement,
  ];
  const uniqueElements = [...new Set(elements)];

  return `${uniqueElements.map((element) => elementKo[element]).join("·")}의 해`;
}

function assertDraftMode(
  mode: AnnualFortuneEvidencePacket["mode"],
): AnnualFortuneReportMode {
  if (mode === "locked_future") {
    throw new AnnualFortuneReportWriterFailure({
      code: "ANNUAL_FORTUNE_YEAR_LOCKED",
    });
  }

  return mode;
}

function attachDeterministicEvidence(input: {
  readonly parsed: unknown;
  readonly evidencePacket: AnnualFortuneEvidencePacket;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed)
  ) {
    return input.parsed;
  }

  const mode = assertDraftMode(input.evidencePacket.mode);

  return {
    ...input.parsed,
    version: "v1",
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: input.evidencePacket.targetYear,
    mode,
    yearSummary: {
      ...((input.parsed as { readonly yearSummary?: object }).yearSummary ?? {}),
      ganji: input.evidencePacket.annualGanji.ganji,
      displayTitle: input.evidencePacket.annualGanji.displayTitle,
      elementLabel: getElementLabel(input.evidencePacket),
      tenGodLabel: `${input.evidencePacket.annualTenGod.stemTenGod}의 해`,
      modeLabel: getModeLabel(mode),
    },
  };
}

function buildOpenAIPayload(input: {
  readonly model: string;
  readonly messages: ReturnType<typeof buildOpenAIAnnualFortuneReportWriterMessages>;
}): object {
  return {
    model: input.model,
    input: [
      { role: "system", content: input.messages.system },
      { role: "developer", content: input.messages.developer },
      { role: "user", content: input.messages.user },
    ],
    text: {
      format: {
        type: "json_schema",
        name: annualFortuneResponseFormatName,
        schema: annualFortuneReportDraftJsonSchema,
        strict: true,
      },
    },
    temperature: 0.4,
  };
}

export async function generateAnnualFortuneReportDraft(input: {
  readonly evidencePacket: AnnualFortuneEvidencePacket;
  readonly config: AnnualFortuneReportWriterConfig;
}): Promise<AnnualFortuneReportWriterResult> {
  if (input.config.enabled !== true) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
  }
  if (
    !isNonEmptyString(input.config.apiKey) ||
    !isNonEmptyString(input.config.model)
  ) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_CONFIG_MISSING",
    });
  }

  const messages = buildOpenAIAnnualFortuneReportWriterMessages({
    evidencePacket: input.evidencePacket,
  });
  const model = input.config.model.trim();
  const fetchImpl = input.config.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(openAIResponsesEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildOpenAIPayload({ model, messages })),
    });
  } catch (error) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: annualFortuneResponseFormatName,
        schemaTopLevelKeys: getAnnualFortuneReportDraftSchemaTopLevelKeys(),
        schemaApproxChars: JSON.stringify(annualFortuneReportDraftJsonSchema)
          .length,
        model,
        diagnosticMessage: sanitizeDiagnosticText(
          error instanceof Error ? error.message : String(error),
        ),
      },
      cause: error,
    });
  }

  if (!response.ok) {
    const body = await readSafeOpenAIErrorBody(response);

    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: normalizeOpenAIErrorDiagnostics({
        status: response.status,
        body,
        model,
      }),
    });
  }

  const body = (await response.json()) as unknown;
  const rawText = extractTextFromResponseBody(body);

  if (!isNonEmptyString(rawText)) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_EMPTY_RESPONSE",
    });
  }

  const parsed = attachDeterministicEvidence({
    parsed: parseJson(rawText),
    evidencePacket: input.evidencePacket,
  });
  const validation = validateAnnualFortuneReportDraft(parsed);

  if (!validation.ok) {
    throw new AnnualFortuneReportWriterFailure({
      code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED",
      validationErrors: validation.errors,
    });
  }

  return {
    draft: assertValidAnnualFortuneReportDraft(validation.value),
    model,
  };
}
