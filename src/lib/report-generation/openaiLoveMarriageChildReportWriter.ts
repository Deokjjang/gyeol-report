import type {
  LoveMarriageChildReportEvidencePacket,
} from "../report-knowledge/loveMarriageChildReportTypes";
import {
  assertValidLoveMarriageChildReportDraft,
  validateLoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftValidator";
import type {
  LoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftTypes";
import {
  buildOpenAILoveMarriageChildReportWriterMessages,
} from "./openaiLoveMarriageChildReportWriterPrompt";

export type LoveMarriageChildReportWriterConfig = {
  readonly apiKey: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly fetchImpl?: typeof fetch;
};

export type LoveMarriageChildReportWriterResult = {
  readonly draft: LoveMarriageChildReportDraft;
  readonly model: string;
};

export type LoveMarriageChildOpenAIRequestDiagnostics = {
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
  readonly responseFormatName: typeof loveMarriageChildResponseFormatName;
  readonly model?: string;
};

export const loveMarriageChildResponseFormatName =
  "love_marriage_child_report_draft";

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

const stringSchema = { type: "string" } as const;
const nullableStringSchema = { type: ["string", "null"] } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const textSectionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "body", "keyPoints", "caution"],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    keyPoints: stringArraySchema,
    caution: nullableStringSchema,
  },
} as const;

const patternSectionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "keyPoints",
    "caution",
    "repeatedPattern",
    "betterUse",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    keyPoints: stringArraySchema,
    caution: nullableStringSchema,
    repeatedPattern: stringArraySchema,
    betterUse: stringArraySchema,
  },
} as const;

const parentModeSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "keyPoints",
    "caution",
    "parentingRolePattern",
    "avoidProjection",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    keyPoints: stringArraySchema,
    caution: nullableStringSchema,
    parentingRolePattern: stringArraySchema,
    avoidProjection: stringArraySchema,
  },
} as const;

const breakupReunionPatternSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "keyPoints",
    "caution",
    "myLoop",
    "emotionalProcessing",
    "repairBoundary",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    keyPoints: stringArraySchema,
    caution: nullableStringSchema,
    myLoop: stringArraySchema,
    emotionalProcessing: stringArraySchema,
    repairBoundary: stringArraySchema,
  },
} as const;

const loveMarriageChildReportDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "productVersion",
    "personLabel",
    "headline",
    "openingSummary",
    "loveStyle",
    "attractionPattern",
    "loveStrengths",
    "loveFriction",
    "marriageRhythm",
    "householdMoneyAndRoleSplit",
    "conflictRecovery",
    "parentMode",
    "breakupReunionPattern",
    "relationshipTimingHints",
    "actionPlan",
    "riskManagement",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["love_marriage_child"] },
    productVersion: { type: "string", enum: ["v1"] },
    personLabel: stringSchema,
    headline: stringSchema,
    openingSummary: stringSchema,
    loveStyle: textSectionSchema,
    attractionPattern: patternSectionSchema,
    loveStrengths: textSectionSchema,
    loveFriction: patternSectionSchema,
    marriageRhythm: textSectionSchema,
    householdMoneyAndRoleSplit: textSectionSchema,
    conflictRecovery: textSectionSchema,
    parentMode: parentModeSchema,
    breakupReunionPattern: breakupReunionPatternSchema,
    relationshipTimingHints: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "headline", "body", "push", "avoid"],
        properties: {
          label: stringSchema,
          headline: stringSchema,
          body: stringSchema,
          push: stringArraySchema,
          avoid: stringArraySchema,
        },
      },
    },
    actionPlan: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "headline", "body", "firstAction"],
        properties: {
          label: {
            type: "string",
            enum: ["연애", "결혼", "갈등 회복", "부모 역할", "관계 정리", "생활 리듬"],
          },
          headline: stringSchema,
          body: stringSchema,
          firstAction: stringSchema,
        },
      },
    },
    riskManagement: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body", "prevention"],
        properties: {
          title: stringSchema,
          body: stringSchema,
          prevention: stringSchema,
        },
      },
    },
    safetyNotes: stringArraySchema,
  },
} as const;

export class LoveMarriageChildReportWriterFailure extends Error {
  readonly code: string;
  readonly validationErrors?: readonly string[];
  readonly diagnostics?: LoveMarriageChildOpenAIRequestDiagnostics;

  constructor(input: {
    readonly code: string;
    readonly validationErrors?: readonly string[];
    readonly diagnostics?: LoveMarriageChildOpenAIRequestDiagnostics;
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
          : formatLoveMarriageChildOpenAIRequestDiagnostics(input.diagnostics)),
      ].join("\n"),
    );
    this.name = "LoveMarriageChildReportWriterFailure";
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

function getStringProperty(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  const property = value[key];

  return typeof property === "string" ? property : undefined;
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
}): LoveMarriageChildOpenAIRequestDiagnostics {
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
    responseFormatName: loveMarriageChildResponseFormatName,
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

export function formatLoveMarriageChildOpenAIRequestDiagnostics(
  diagnostics: LoveMarriageChildOpenAIRequestDiagnostics,
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
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_INVALID_JSON",
      cause: error,
    });
  }
}

function attachDeterministicEvidence(input: {
  readonly parsed: unknown;
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
}): unknown {
  if (!isRecord(input.parsed)) {
    return input.parsed;
  }

  return {
    ...input.parsed,
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel: input.evidencePacket.personContext.name,
  };
}

function buildOpenAIPayload(input: {
  readonly model: string;
  readonly messages: ReturnType<typeof buildOpenAILoveMarriageChildReportWriterMessages>;
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
        name: loveMarriageChildResponseFormatName,
        schema: loveMarriageChildReportDraftJsonSchema,
        strict: true,
      },
    },
    temperature: 0.4,
  };
}

export async function generateLoveMarriageChildReportDraft(input: {
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
  readonly config: LoveMarriageChildReportWriterConfig;
}): Promise<LoveMarriageChildReportWriterResult> {
  if (input.config.enabled !== true) {
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
  }
  if (
    !isNonEmptyString(input.config.apiKey) ||
    !isNonEmptyString(input.config.model)
  ) {
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_REPORT_WRITER_CONFIG_MISSING",
    });
  }

  const messages = buildOpenAILoveMarriageChildReportWriterMessages({
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
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: loveMarriageChildResponseFormatName,
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

    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_REQUEST_FAILED",
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
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_EMPTY_RESPONSE",
    });
  }

  const parsed = attachDeterministicEvidence({
    parsed: parseJson(rawText),
    evidencePacket: input.evidencePacket,
  });
  const validation = validateLoveMarriageChildReportDraft(parsed);

  if (!validation.ok) {
    throw new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_VALIDATION_FAILED",
      validationErrors: validation.errors,
    });
  }

  return {
    draft: assertValidLoveMarriageChildReportDraft(validation.value),
    model,
  };
}
