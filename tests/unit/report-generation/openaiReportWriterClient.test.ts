import { describe, expect, it } from "vitest";

import { callOpenAIReportWriter } from "../../../src/lib/report-generation/openaiReportWriterClient";
import { comprehensiveReportDraftJsonSchema } from "../../../src/lib/report-generation/comprehensiveReportDraftSchema";

const messages = {
  system: "system",
  developer: "developer",
  user: "user",
} as const;

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
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
    await expect(
      callOpenAIReportWriter({
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({ error: "bad" }, 500),
        },
        messages,
        jsonSchema: comprehensiveReportDraftJsonSchema,
      }),
    ).rejects.toThrow("OPENAI_REPORT_WRITER_REQUEST_FAILED");

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
