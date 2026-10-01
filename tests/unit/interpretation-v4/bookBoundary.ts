import { expect } from "vitest";

/** Phase 8C's four exact read-only consumers, not a blanket dev-route exception.
 * Server modules cannot be imported by a public route; client files get types only.
 * bookPreview.test additionally proves the dev-only route fails closed. */
export function isVerifiedBookConsumer(file: string, source: string): boolean {
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
