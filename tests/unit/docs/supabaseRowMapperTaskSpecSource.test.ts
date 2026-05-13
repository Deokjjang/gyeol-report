import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase row mapper task spec source", () => {
  const docPath = "docs/launch/SUPABASE_ROW_MAPPER_TASK_SPEC.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Supabase Row Mapper Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 대상 파일 후보",
      "## 4. Row 타입 경계",
      "## 5. PersistedReportRecord -> Row 매핑",
      "## 6. Row -> PersistedReportRecord 매핑",
      "## 7. JSONB snapshot 처리",
      "## 8. Payment linkage 처리",
      "## 9. Access token hash 처리",
      "## 10. 오류/검증 경계",
      "## 11. 테스트 전략",
      "## 12. 구현하지 않는 범위",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(doc).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "reports migration exists",
      "Supabase adapter is still skeleton",
      "production DB is not connected",
      "provider-neutral",
      "access token plaintext must not be stored",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks target files and SDK boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "src/lib/persistence/supabaseReportPersistenceMapper.ts",
      "tests/unit/persistence/supabaseReportPersistenceMapper.test.ts",
      "pure",
      "Supabase SDK를 import하지 않는다",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks row fields", () => {
    const doc = readDoc(docPath);
    const rowFields = [
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
    ];
    const boundaryMarkers = [
      "local TypeScript type",
      "generated Supabase types",
      "JSON-compatible values",
      "ISO strings",
      "Date conversion",
    ];

    for (const field of rowFields) {
      expect(doc).toContain(field);
    }

    for (const marker of boundaryMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks record-to-row mapping", () => {
    const doc = readDoc(docPath);
    const markers = [
      "id/reportId -> report_id",
      "status -> status",
      "accessMode -> access_mode",
      "inputSnapshot -> input_snapshot",
      "reportSnapshot -> report_snapshot",
      "reportVersion -> report_version",
      "calculationVersion -> calculation_version",
      "locale -> locale",
      "accessTokenHash -> access_token_hash",
      "paymentLinkage.orderId -> payment_order_id",
      "paymentLinkage.provider -> payment_provider",
      "paymentLinkage.providerPaymentId -> payment_provider_payment_id",
      "paymentLinkage.status -> payment_status",
      "paymentLinkage.amount.value -> payment_amount",
      "paymentLinkage.amount.currency -> payment_currency",
      "paymentLinkage.paidAt -> payment_paid_at",
      "paymentLinkage.refundedAt -> payment_refunded_at",
      "createdAt/updatedAt/deletedAt -> timestamps",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks row-to-record mapping", () => {
    const doc = readDoc(docPath);
    const markers = [
      "rebuild record shape from row",
      "validate required fields",
      "nullable payment fields",
      "preserve deletedAt",
      "avoid exposing internal DB-only fields",
      "typed failure",
      "programmer errors",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks JSONB snapshot handling", () => {
    const doc = readDoc(docPath);
    const markers = [
      "input_snapshot maps to inputSnapshot",
      "report_snapshot maps to reportSnapshot",
      "mapper should not mutate snapshots",
      "invalid snapshot shape",
      "fail safely",
      "no raw provider payload",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks payment linkage and access token boundaries", () => {
    const doc = readDoc(docPath);
    const markers = [
      "payment linkage may be null/absent",
      "payment fields should reconstruct linkage",
      "identifiers/status",
      "amount/currency",
      "no raw card data",
      "provider raw payload is not mapped by default",
      "store hash only",
      "do not store plaintext token",
      "mapper should not generate tokens",
      "mapper should not expose hash",
      "public preview records",
      "token rotation fields",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks validation errors and test strategy", () => {
    const doc = readDoc(docPath);
    const markers = [
      "missing report_id",
      "invalid status",
      "invalid access_mode",
      "invalid payment_status",
      "invalid currency",
      "invalid snapshot",
      "invalid timestamp",
      "unknown nullable fields",
      "mapping error should be deterministic",
      "full record to row",
      "row to full record",
      "record without payment linkage",
      "record with paid linkage",
      "deleted record mapping",
      "snapshot preservation",
      "invalid status rejection",
      "invalid currency rejection",
      "no plaintext token field",
      "no Supabase SDK import",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks excluded scope and completion criteria", () => {
    const doc = readDoc(docPath);
    const markers = [
      "DB queries",
      "Supabase client creation",
      "env/secrets reads",
      "migration application",
      "paid unlock API",
      "payment provider integration",
      "webhook processing",
      "admin/export tooling",
      "mapper is pure",
      "mapper tests pass",
      "no Supabase SDK import",
      "no DB/network call",
      "no raw access token storage",
      "no raw card data mapping",
      "release check passes",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const nextTaskMarkers = [
      "62B",
      "62C",
      "62D",
      "63A",
      "63B",
      "Supabase row mapper implementation",
      "Supabase row mapper tests",
      "production Supabase adapter implementation task spec",
      "production Supabase adapter implementation",
    ];
    const overclaimMarkers = [
      "production persistence is implemented",
      "Supabase implemented",
      "mapper implemented",
      "production DB 구현 완료",
      "Supabase 구현 완료",
      "mapper 구현 완료",
    ];

    for (const marker of nextTaskMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
