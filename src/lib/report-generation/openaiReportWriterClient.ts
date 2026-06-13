export type OpenAIReportWriterClientConfig = {
  readonly apiKey: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly fetchImpl?: typeof fetch;
};

export type OpenAIReportWriterMessagesForClient = {
  readonly system: string;
  readonly developer: string;
  readonly user: string;
};

export type OpenAIReportWriterClientResult = {
  readonly rawText: string;
  readonly model: string;
};

export type OpenAIReportWriterSafeDiagnostics = {
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;
};

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

export class OpenAIReportWriterClientError
  extends Error
  implements OpenAIReportWriterSafeDiagnostics
{
  readonly code: string;
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly requestId?: string;
  readonly errorParam?: string;

  constructor(
    code: string,
    diagnostics: OpenAIReportWriterSafeDiagnostics = {},
  ) {
    super(code);
    this.name = "OpenAIReportWriterClientError";
    this.code = code;
    if (diagnostics.status !== undefined) {
      this.status = diagnostics.status;
    }
    if (diagnostics.errorType !== undefined) {
      this.errorType = diagnostics.errorType;
    }
    if (diagnostics.errorCode !== undefined) {
      this.errorCode = diagnostics.errorCode;
    }
    if (diagnostics.diagnosticMessage !== undefined) {
      this.diagnosticMessage = diagnostics.diagnosticMessage;
    }
    if (diagnostics.requestId !== undefined) {
      this.requestId = diagnostics.requestId;
    }
    if (diagnostics.errorParam !== undefined) {
      this.errorParam = diagnostics.errorParam;
    }
  }
}

export function isOpenAIReportWriterClientError(
  value: unknown,
): value is OpenAIReportWriterClientError {
  return value instanceof OpenAIReportWriterClientError;
}

function createWriterError(
  code: string,
  diagnostics?: OpenAIReportWriterSafeDiagnostics,
): Error {
  return new OpenAIReportWriterClientError(code, diagnostics);
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
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function getNumberProperty(
  value: Record<string, unknown>,
  key: string,
): number | undefined {
  const property = value[key];

  return typeof property === "number" ? property : undefined;
}

function getNestedErrorRecord(body: unknown): Record<string, unknown> | undefined {
  if (!isRecord(body)) {
    return undefined;
  }
  if (isRecord(body.error)) {
    return body.error;
  }

  return undefined;
}

function getOpenAIRequestId(input: {
  readonly body: unknown;
  readonly headers: Headers;
}): string | undefined {
  const headerRequestId =
    input.headers.get("x-request-id") ??
    input.headers.get("openai-request-id") ??
    input.headers.get("request-id") ??
    undefined;

  if (headerRequestId !== undefined) {
    return sanitizeDiagnosticText(headerRequestId);
  }
  if (isRecord(input.body)) {
    const bodyRequestId =
      getStringProperty(input.body, "request_id") ??
      getStringProperty(input.body, "requestId");

    if (bodyRequestId !== undefined) {
      return sanitizeDiagnosticText(bodyRequestId);
    }
  }

  const nestedError = getNestedErrorRecord(input.body);
  const nestedRequestId =
    nestedError === undefined
      ? undefined
      : getStringProperty(nestedError, "request_id") ??
        getStringProperty(nestedError, "requestId");

  return nestedRequestId === undefined
    ? undefined
    : sanitizeDiagnosticText(nestedRequestId);
}

function normalizeOpenAIErrorDiagnostics(input: {
  readonly status: number;
  readonly headers: Headers;
  readonly body: unknown;
}): OpenAIReportWriterSafeDiagnostics {
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
    ...(getNumberProperty(root ?? {}, "status") === undefined
      ? {}
      : { status: getNumberProperty(root ?? {}, "status") }),
    ...(getOpenAIRequestId({
      body: input.body,
      headers: input.headers,
    }) === undefined
      ? {}
      : {
          requestId: getOpenAIRequestId({
            body: input.body,
            headers: input.headers,
          }),
        }),
  };
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
      : {
          message: sanitizeDiagnosticText(text),
        };
  } catch {
    return {};
  }
}

function extractTextFromContentItem(item: unknown): string | undefined {
  if (!isRecord(item)) {
    return undefined;
  }

  const text = getStringProperty(item, "text");

  if (text !== undefined) {
    return text;
  }

  const content = getStringProperty(item, "content");

  return content;
}

function extractTextFromResponseBody(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const outputText = getStringProperty(body, "output_text");

  if (outputText !== undefined) {
    return outputText;
  }

  const output = body.output;

  if (Array.isArray(output)) {
    for (const outputItem of output) {
      if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
        continue;
      }
      for (const contentItem of outputItem.content) {
        const text = extractTextFromContentItem(contentItem);

        if (text !== undefined) {
          return text;
        }
      }
    }
  }

  const choices = body.choices;

  if (Array.isArray(choices)) {
    const [firstChoice] = choices;

    if (isRecord(firstChoice) && isRecord(firstChoice.message)) {
      return getStringProperty(firstChoice.message, "content");
    }
  }

  return undefined;
}

function buildOpenAIReportWriterPayload(input: {
  readonly model: string;
  readonly messages: OpenAIReportWriterMessagesForClient;
  readonly jsonSchema: object;
}): object {
  return {
    model: input.model,
    input: [
      {
        role: "system",
        content: input.messages.system,
      },
      {
        role: "developer",
        content: input.messages.developer,
      },
      {
        role: "user",
        content: input.messages.user,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "comprehensive_report_draft",
        schema: input.jsonSchema,
        strict: true,
      },
    },
    temperature: 0.4,
  };
}

export async function callOpenAIReportWriter(input: {
  readonly config: OpenAIReportWriterClientConfig;
  readonly messages: OpenAIReportWriterMessagesForClient;
  readonly jsonSchema: object;
}): Promise<OpenAIReportWriterClientResult> {
  if (input.config.enabled !== true) {
    throw createWriterError("OPENAI_REPORT_WRITER_DISABLED");
  }
  if (
    !isNonEmptyString(input.config.apiKey) ||
    !isNonEmptyString(input.config.model)
  ) {
    throw createWriterError("OPENAI_REPORT_WRITER_CONFIG_MISSING");
  }

  const fetchImpl = input.config.fetchImpl ?? fetch;
  const model = input.config.model.trim();
  const response = await fetchImpl(openAIResponsesEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildOpenAIReportWriterPayload({
        model,
        messages: input.messages,
        jsonSchema: input.jsonSchema,
      }),
    ),
  });

  if (!response.ok) {
    const body = await readSafeOpenAIErrorBody(response);

    throw createWriterError(
      "OPENAI_REPORT_WRITER_REQUEST_FAILED",
      normalizeOpenAIErrorDiagnostics({
        status: response.status,
        headers: response.headers,
        body,
      }),
    );
  }

  const body = (await response.json()) as unknown;
  const rawText = extractTextFromResponseBody(body);

  if (!isNonEmptyString(rawText)) {
    throw createWriterError("OPENAI_REPORT_WRITER_EMPTY_RESPONSE");
  }

  return {
    rawText,
    model,
  };
}
