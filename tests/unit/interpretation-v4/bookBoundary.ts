import { expect } from "vitest";
import { readFileSync } from "node:fs";

/** Exact Phase 8C read-only consumers plus Phase 9A's server-only stored reader
 * and development mock publisher; never a blanket route exception. Client
 * consumers get types only. Book tests enforce production OFF / dev 404. */
export function isVerifiedBookConsumer(file: string, source: string): boolean {
  if (file === "src/lib/tickets/publicationWorker.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain('store.call("claim", null)');
    expect(source).toContain("generateReportSnapshot");
    expect(source).toContain("validateV4Publication");
    expect(source).toContain('new Date(job.policyAt).toISOString()');
    expect(source).not.toMatch(/createClient|fetch\(|process\.env|TossPayments|new OpenAI/);
    const route = readFileSync("src/app/api/internal/report-ticket-jobs/route.ts", "utf8");
    expect(route).toContain("timingSafeEqual");
    expect(route).toContain("if (!bookExperiencePublicEnabled() || !accountPublicEnabled())");
    expect(route.indexOf("if (!bookExperiencePublicEnabled()")).toBeLessThan(route.indexOf('await import("../../../../lib/tickets/publicationWorker")'));
    return true;
  }
  if (file === "src/lib/tickets/ownerRead.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain("await auth.currentUser()");
    expect(source).toContain('store.call("read", user.id, { reportId })');
    expect(source).toContain('snapshot.productVersion !== "v4"');
    expect(source).toContain("projectV4Snapshot(snapshot)");
    expect(source).not.toMatch(/runtimeShadow|generateV4|process\.env|fetch\(/);
    return true;
  }
  if (file === "src/lib/book/paidRuntime.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain("if (!bookExperiencePublicEnabled()) return runPaidReportJob(store, runtime)");
    expect(source).toContain('order.status !== "paid"');
    expect(source).toContain('binding.version !== "v4"');
    expect(source).toContain("if (!evaluatedAt) return generateProductReport");
    expect(source).toContain("validateV4Publication(product, draft, evidence)");
    expect(source).not.toMatch(/createClient|fetch\(|process\.env|TossPayments|new OpenAI/);
    return true;
  }
  if (file === "src/app/dev/content-review/generate.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain('if (!["development", "test"].includes(process.env.NODE_ENV)) return');
    expect(source).toContain("validateV4Publication(");
    expect(source).not.toMatch(/createPaidReportReliabilityStore|createClient|fetch\(|SUPABASE_|OPENAI_|TOSS_/);
    return true;
  }
  if (file === "src/lib/tickets/service.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain('if (!["test", "development"].includes(process.env.NODE_ENV)) return ticketFailure("NOT_FOUND")');
    expect(source).toContain("generateReportSnapshot");
    expect(source).toContain("validateV4Publication");
    expect(source).not.toMatch(/createPaidReportReliabilityStore|createClient|fetch\(|SUPABASE_|OPENAI_|TOSS_/);
    return true;
  }
  if (file === "src/lib/book/storedReport.tsx") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).not.toMatch(/runtimeShadow|generateV4|process\.env|fetch\(/);
    expect(source).toContain('snapshot.productVersion !== "v4"');
    return true;
  }
  if (file === "src/lib/book/localReview.ts") {
    expect(source).toMatch(/^import "server-only";/);
    expect(source).toContain('process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"');
    expect(source).not.toMatch(/createPaidReportReliabilityStore|createClient|fetch\(|SUPABASE_|OPENAI_|TOSS_/);
    return true;
  }
  if (["src/app/dev/book-preview/bookProjection.ts", "src/app/dev/book-preview/runtimeBooks.ts"].includes(file)) {
    expect(source, file).toMatch(/^import "server-only";/);
    expect(source, file).not.toMatch(/['"]use (?:client|server)['"]|fetch\(|process\.env|supabase|TossPayments|new OpenAI/);
    return true;
  }
  if (["src/app/dev/book-preview/bookTypes.ts", "src/app/dev/book-preview/BookPages.tsx"].includes(file)) {
    const imports = source.split("\n").filter(l => l.includes("interpretation-v4/"));
    expect(imports).toEqual(['import type { V4CustomerTables } from "../../../lib/interpretation-v4/runtimeTypes";']);
    return true;
  }
  return false;
}
