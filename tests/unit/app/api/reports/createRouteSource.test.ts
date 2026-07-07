import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const routePath = "src/app/api/reports/create/route.ts";

function readRouteSource(): string {
  return readFileSync(join(process.cwd(), routePath), "utf8");
}

describe("create report route product preview source", () => {
  it("detects product payloads before the comprehensive report pipeline", () => {
    const source = readRouteSource();
    const productBranchIndex = source.indexOf("isProductReportInputPayload(json)");
    const comprehensiveBranchIndex = source.indexOf(
      "createReportApiEnvelopeFromJson(json)",
    );

    expect(productBranchIndex).toBeGreaterThanOrEqual(0);
    expect(comprehensiveBranchIndex).toBeGreaterThanOrEqual(0);
    expect(productBranchIndex).toBeLessThan(comprehensiveBranchIndex);
  });

  it("uses dispatcher and product preview snapshot for product payloads", () => {
    const source = readRouteSource();
    const expectedMarkers = [
      "prepareProductGenerationFromPayload",
      "resolveReportWriterRuntime",
      "createProductGenerationDispatcherOptionsFromWriterRuntime",
      "createProductPreviewSnapshot",
      'snapshotKind: "product_preview"',
      "productPreview",
      "PRODUCT_GENERATION_NOT_IMPLEMENTED",
      "INVALID_REPORT_INPUT",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("keeps product preview branch on preview-memory persistence only", () => {
    const source = readRouteSource();

    expect(source).toContain('mode: "preview_memory"');
    expect(source).toContain("runtime.adapter.create");
  });

  it("uses public product generation failure copy instead of handler internals", () => {
    const source = readRouteSource();

    expect(source).toContain("PRODUCT_PREVIEW_CREATE_FAILED_MESSAGE");
    expect(source).toContain("createPublicProductPreviewFailureMessage");
    expect(source).toContain('"PRODUCT_GENERATION_FAILED"');
    expect(source).not.toContain("message: generationResult.error.message");
  });

  it("does not directly connect payment, Supabase, paid unlock, fetch, or OpenAI writer", () => {
    const source = readRouteSource();
    const forbiddenMarkers = [
      "@supabase/supabase-js",
      "createSupabase",
      "production_supabase",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "openai",
      "fetch(",
      "process.env",
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
