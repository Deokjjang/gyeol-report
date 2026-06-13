import { describe, expect, it } from "vitest";

import {
  callOpenAIReportWriter,
  isOpenAIReportWriterClientError,
} from "../../../src/lib/report-generation/openaiReportWriterClient";
import { comprehensiveReportDraftJsonSchema } from "../../../src/lib/report-generation/comprehensiveReportDraftSchema";

const messages = {
  system: "system",
  developer: "developer",
  user: "user",
} as const;

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

async function expectClientError(
  promise: Promise<unknown>,
): Promise<ReturnType<typeof expectOpenAIClientError>> {
  try {
    await promise;
  } catch (error) {
    return expectOpenAIClientError(error);
  }

  throw new Error("Expected OpenAI report writer client error.");
}

function expectOpenAIClientError(error: unknown) {
  expect(isOpenAIReportWriterClientError(error)).toBe(true);

  if (!isOpenAIReportWriterClientError(error)) {
    throw new Error("Expected OpenAI report writer client error.");
  }

  return error;
}

describe("OpenAI report writer client", () => {
  it("does not call fetch when disabled", async () => {
    let calls = 0;
    const fetchImpl: typeof fetch = async () => {
      calls += 1;
      return createJsonResponse({});
    };

    await expect(
      callOpenAIReportWriter({
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: false,
          fetchImpl,
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    ).rejects.toThrow("OPENAI_REPORT_WRITER_DISABLED");
    expect(calls).toBe(0);
  });

  it("requires api key and model when enabled", async () => {
    await expect(
      callOpenAIReportWriter({
        config: {
          apiKey: "",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({}),
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    ).rejects.toThrow("OPENAI_REPORT_WRITER_CONFIG_MISSING");
  });

  it("calls the OpenAI responses endpoint with auth model messages and schema", async () => {
    const calls: {
      readonly input: RequestInfo | URL;
      readonly init?: RequestInit;
    }[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({ input, init });
      return createJsonResponse({
        output_text: "{\"ok\":true}",
      });
    };

    const result = await callOpenAIReportWriter({
      config: {
        apiKey: "test_openai_key",
        model: "test_report_model",
        enabled: true,
        fetchImpl,
      },
      messages,
      jsonSchema: comprehensiveReportDraftJsonSchema,
    });

    expect(result).toEqual({
      rawText: "{\"ok\":true}",
      model: "test_report_model",
    });
    expect(calls).toHaveLength(1);
    expect(String(calls[0].input)).toBe("https://api.openai.com/v1/responses");
    expect(calls[0].init?.method).toBe("POST");
    expect(calls[0].init?.headers).toMatchObject({
      Authorization: "Bearer test_openai_key",
      "Content-Type": "application/json",
    });

    const body = JSON.parse(String(calls[0].init?.body)) as Record<string, unknown>;

    expect(body.model).toBe("test_report_model");
    expect(JSON.stringify(body)).toContain("system");
    expect(JSON.stringify(body)).toContain("developer");
    expect(JSON.stringify(body)).toContain("user");
    expect(JSON.stringify(body)).toContain("json_schema");
    expect(JSON.stringify(body)).toContain("comprehensive_report_draft");
  });

  it("returns raw text from nested output content", async () => {
    const fetchImpl: typeof fetch = async () =>
      createJsonResponse({
        output: [
          {
            content: [
              {
                type: "output_text",
                text: "{\"nested\":true}",
              },
            ],
          },
        ],
      });

    await expect(
      callOpenAIReportWriter({
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl,
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    ).resolves.toEqual({
      rawText: "{\"nested\":true}",
      model: "test_model",
    });
  });

  it("throws safe errors for non-OK and empty responses", async () => {
    const error = await expectClientError(
      callOpenAIReportWriter({
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            new Response(
              JSON.stringify({
                error: {
                  type: "invalid_request_error",
                  code: "invalid_model",
                  message: "The requested model is not available.",
                  param: "model",
                },
                request_id: "req_safe_123",
              }),
              {
                status: 400,
                headers: {
                  "content-type": "application/json",
                  "x-request-id": "req_header_456",
                },
              },
            ),
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_REQUEST_FAILED");
    expect(error.status).toBe(400);
    expect(error.errorType).toBe("invalid_request_error");
    expect(error.errorCode).toBe("invalid_model");
    expect(error.diagnosticMessage).toBe("The requested model is not available.");
    expect(error.errorParam).toBe("model");
    expect(error.requestId).toBe("req_header_456");
    expect(JSON.stringify(error)).not.toContain("test_key");

    await expect(
      callOpenAIReportWriter({
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({ output_text: "" }),
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    ).rejects.toThrow("OPENAI_REPORT_WRITER_EMPTY_RESPONSE");
  });
});
