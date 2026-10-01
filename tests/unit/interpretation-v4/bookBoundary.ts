import { expect } from "vitest";

/** Exact Phase 8C read-only consumers plus Phase 9A's server-only stored reader
 * and development mock publisher; never a blanket route exception. Client
 * consumers get types only. Book tests enforce production OFF / dev 404. */
export function isVerifiedBookConsumer(file: string, source: string): boolean {
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
