import type { FiveElement, YinYang } from "../report-knowledge/annualFortuneTypes";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import {
  majorFortuneReportDraftJsonSchema,
  getMajorFortuneReportDraftSchemaTopLevelKeys,
  type MajorFortuneReportDraft,
} from "./majorFortuneReportDraftTypes";
import {
  assertValidMajorFortuneReportDraft,
  validateMajorFortuneReportDraft,
} from "./majorFortuneReportDraftValidator";
import {
  buildOpenAIMajorFortuneReportWriterMessages,
} from "./openaiMajorFortuneReportWriterPrompt";

export type MajorFortuneReportWriterConfig = {
  readonly apiKey: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly fetchImpl?: typeof fetch;
};

export type MajorFortuneReportWriterResult = {
  readonly draft: MajorFortuneReportDraft;
  readonly model: string;
};

export type MajorFortuneOpenAIRequestDiagnostics = {
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly responseFormatName: typeof majorFortuneResponseFormatName;
  readonly schemaTopLevelKeys: readonly string[];
  readonly schemaApproxChars: number;
  readonly model?: string;
};

export const majorFortuneResponseFormatName = "major_fortune_report_draft";

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const yinYangKo = {
  yang: "양",
  yin: "음",
} as const satisfies Record<YinYang, string>;

const elementStemKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

export class MajorFortuneReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];
  readonly diagnostics?: MajorFortuneOpenAIRequestDiagnostics;

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly diagnostics?: MajorFortuneOpenAIRequestDiagnostics;
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
          : formatMajorFortuneOpenAIRequestDiagnostics(input.diagnostics)),
      ].join("\n"),
    );
    this.name = "MajorFortuneReportWriterFailure";
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
}): MajorFortuneOpenAIRequestDiagnostics {
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
    responseFormatName: majorFortuneResponseFormatName,
    schemaTopLevelKeys: getMajorFortuneReportDraftSchemaTopLevelKeys(),
    schemaApproxChars: JSON.stringify(majorFortuneReportDraftJsonSchema).length,
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

export function formatMajorFortuneOpenAIRequestDiagnostics(
  diagnostics: MajorFortuneOpenAIRequestDiagnostics,
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
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_INVALID_JSON",
      cause: error,
    });
  }
}

function formatCycleElementLabel(packet: MajorFortuneEvidencePacket): string {
  const elements = [
    packet.currentCycle.stemElement,
    packet.currentCycle.branchElement,
  ];
  const uniqueElements = [...new Set(elements)];

  return `${uniqueElements.map((element) => elementKo[element]).join("·")}의 대운`;
}

function formatStemLabel(packet: MajorFortuneEvidencePacket): string {
  return `${packet.currentCycle.stem} · ${yinYangKo[packet.currentCycle.stemYinYang]}${elementStemKo[packet.currentCycle.stemElement]}`;
}

function formatBranchLabel(packet: MajorFortuneEvidencePacket): string {
  return `${packet.currentCycle.branch} · ${yinYangKo[packet.currentCycle.branchYinYang]}${elementStemKo[packet.currentCycle.branchElement]}`;
}

function attachDeterministicEvidence(input: {
  readonly parsed: unknown;
  readonly evidencePacket: MajorFortuneEvidencePacket;
}): unknown {
  if (
    typeof input.parsed !== "object" ||
    input.parsed === null ||
    Array.isArray(input.parsed)
  ) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: input.evidencePacket.personLabel,
    cycleSummary: {
      ...((input.parsed as { readonly cycleSummary?: object }).cycleSummary ?? {}),
      ganji: input.evidencePacket.currentCycle.ganji,
      displayTitle: `현재 대운 ${input.evidencePacket.currentCycle.ganji}`,
      ageRangeLabel: `${input.evidencePacket.currentCycle.startAge}세~${input.evidencePacket.currentCycle.endAge}세`,
      yearRangeLabel: `${input.evidencePacket.currentCycle.startYear}년~${input.evidencePacket.currentCycle.endYear}년`,
      stemLabel: formatStemLabel(input.evidencePacket),
      branchLabel: formatBranchLabel(input.evidencePacket),
      elementLabel: formatCycleElementLabel(input.evidencePacket),
      tenGodLabel: `${input.evidencePacket.majorTenGod.stemTenGod}의 대운`,
      basisLabel: "사전 계산된 대운표 기준",
    },
  };
}

function buildOpenAIPayload(input: {
  readonly model: string;
  readonly messages: ReturnType<typeof buildOpenAIMajorFortuneReportWriterMessages>;
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
        name: majorFortuneResponseFormatName,
        schema: majorFortuneReportDraftJsonSchema,
        strict: true,
      },
    },
    temperature: 0.4,
  };
}

export async function generateMajorFortuneReportDraft(input: {
  readonly evidencePacket: MajorFortuneEvidencePacket;
  readonly config: MajorFortuneReportWriterConfig;
}): Promise<MajorFortuneReportWriterResult> {
  if (input.config.enabled !== true) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
  }
  if (
    !isNonEmptyString(input.config.apiKey) ||
    !isNonEmptyString(input.config.model)
  ) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_CONFIG_MISSING",
    });
  }

  const messages = buildOpenAIMajorFortuneReportWriterMessages({
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
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: majorFortuneResponseFormatName,
        schemaTopLevelKeys: getMajorFortuneReportDraftSchemaTopLevelKeys(),
        schemaApproxChars: JSON.stringify(majorFortuneReportDraftJsonSchema)
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

    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_REQUEST_FAILED",
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
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_EMPTY_RESPONSE",
    });
  }

  const parsed = attachDeterministicEvidence({
    parsed: parseJson(rawText),
    evidencePacket: input.evidencePacket,
  });
  const validation = validateMajorFortuneReportDraft(parsed);

  if (!validation.ok) {
    throw new MajorFortuneReportWriterFailure({
      code: "OPENAI_MAJOR_FORTUNE_REPORT_WRITER_VALIDATION_FAILED",
      validationErrors: validation.errors,
    });
  }

  return {
    draft: assertValidMajorFortuneReportDraft(validation.value),
    model,
  };
}
