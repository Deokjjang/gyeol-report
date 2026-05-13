import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const migrationDraft = readDoc(
  "docs/launch/SUPABASE_SCHEMA_MIGRATION_DRAFT.md",
);

describe("supabase schema migration draft source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Supabase Schema Migration Draft",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 테이블 후보",
      "## 4. reports 테이블 초안",
      "## 5. payment_linkage 표현 방식",
      "## 6. access token hash 필드",
      "## 7. 인덱스 초안",
      "## 8. RLS/접근 제어 초안",
      "## 9. 마이그레이션 SQL 초안",
      "## 10. 적용 전 차단 조건",
      "## 11. 보류 사항",
      "## 12. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(migrationDraft).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "Supabase/Postgres",
      "production DB",
      "no migration applied",
      "payment는 비활성 상태다.",
      "provider-neutral",
      "adapter",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks table strategy", () => {
    const markers = [
      "reports",
      "별도 payments table",
      "payment linkage",
      "columns",
      "JSON metadata",
      "future table split",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks reports table columns", () => {
    const columns = [
      "report_id",
      "status",
      "access_mode",
      "input_snapshot",
      "report_snapshot",
      "report_version",
      "calculation_version",
      "locale",
      "access_token_hash",
      "access_token_created_at",
      "access_token_rotated_at",
      "access_token_version",
      "payment_order_id",
      "payment_provider",
      "payment_provider_payment_id",
      "payment_status",
      "payment_amount",
      "payment_currency",
      "payment_paid_at",
      "payment_refunded_at",
      "created_at",
      "updated_at",
      "deleted_at",
      "jsonb",
    ];

    for (const column of columns) {
      expect(migrationDraft).toContain(column);
    }
  });

  it("locks payment linkage and token hash boundaries", () => {
    const markers = [
      "flat columns",
      "raw provider payload",
      "no raw card data",
      "orderId",
      "providerPaymentId",
      "access_token_hash",
      "plaintext token",
      "token version",
      "server-side",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks index and unique candidates", () => {
    const markers = [
      "reports(report_id)",
      "reports(status)",
      "reports(access_mode)",
      "reports(created_at)",
      "reports(payment_order_id)",
      "reports(payment_provider_payment_id)",
      "report_id unique",
      "payment_order_id unique",
      "payment_provider_payment_id",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks RLS access control guidance", () => {
    const markers = [
      "no direct client writes",
      "server-side",
      "service role",
      "server-only route",
      "public lookup",
      "RLS policy",
      "admin access",
      "access_token_hash",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks SQL draft markers without applied migration claims", () => {
    const sqlMarkers = [
      "create table if not exists reports",
      "timestamptz",
      "numeric",
      "jsonb",
      "create index if not exists",
    ];

    for (const marker of sqlMarkers) {
      expect(migrationDraft).toContain(marker);
    }

    const appliedClaims = [
      "마이그레이션 적용 완료",
      "Supabase 적용 완료",
      "production DB 구현 완료",
    ];

    for (const claim of appliedClaims) {
      expect(migrationDraft).not.toContain(claim);
    }

    const migrationAppliedLines = migrationDraft
      .split(/\r?\n/)
      .filter((line) => line.includes("migration applied"));

    expect(migrationAppliedLines).toEqual(["- no migration applied 상태다."]);
  });

  it("locks blockers and deferred items", () => {
    const markers = [
      "Supabase project",
      "env/secrets separation",
      "retention/deletion policy",
      "access policy",
      "RLS",
      "local migration strategy",
      "backup/export plan",
      "release check",
      "manual QA",
      "exact migration file path",
      "generated types",
      "service-role usage boundary",
      "separate payment table",
      "audit/event table",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });

  it("locks next tasks", () => {
    const markers = [
      "58D",
      "58E",
      "58F",
      "59A",
      "60A",
      "Supabase persistence adapter skeleton",
      "Supabase persistence adapter tests",
      "choose concrete payment provider",
      "production persistence adapter implementation plan",
    ];

    for (const marker of markers) {
      expect(migrationDraft).toContain(marker);
    }
  });
});
