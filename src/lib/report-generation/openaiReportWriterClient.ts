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

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";

function createWriterError(code: string): Error {
  return new Error(code);
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
    throw createWriterError("OPENAI_REPORT_WRITER_REQUEST_FAILED");
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
