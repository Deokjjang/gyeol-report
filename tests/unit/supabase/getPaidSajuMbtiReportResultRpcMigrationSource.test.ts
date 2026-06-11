import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0009_get_paid_saju_mbti_report_result_rpc.sql",
  ),
  "utf8",
);

describe("get paid saju mbti report result RPC migration source", () => {
  it("defines the safe report result RPC with security and anon execute", () => {
    const requiredMarkers = [
      "create or replace function public.get_paid_saju_mbti_report_result",
      "p_report_id text",
      "returns table",
      "report_id text",
      "product_type text",
      "status text",
      "title text",
      "placeholder_text text",
      "created_at timestamptz",
      "updated_at timestamptz",
      "security definer",
      "set search_path = public",
      "grant execute on function public.get_paid_saju_mbti_report_result",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("requires a linked paid Toss launch-price report context", () => {
    const requiredMarkers = [
      "PAID_REPORT_RESULT_INVALID_REPORT_ID",
      "PAID_REPORT_RESULT_NOT_FOUND",
      "inner join public.payment_orders",
      "payment_orders.report_id = reports.report_id",
      "reports.status = 'paid_unlocked'",
      "reports.access_mode = 'paid'",
      "reports.payment_status = 'paid'",
      "payment_orders.status = 'paid'",
      "payment_orders.provider = 'toss'",
      "payment_orders.product_type = 'saju_mbti_full'",
      "payment_orders.amount = 990",
      "payment_orders.currency = 'KRW'",
      "'ready'::text as status",
      "'사주×MBTI 종합 리포트'::text as title",
      "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not grant table access, create policies, or return private fields", () => {
    const returnsSection = source.slice(
      source.indexOf("returns table"),
      source.indexOf("language plpgsql"),
    );
    const blockedSourceMarkers = [
      "grant select on table public.reports to anon",
      "grant select on table public.payment_orders to anon",
      "create policy",
      "using (true)",
      "with check (true)",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "TOSS" + "_SECRET" + "_KEY",
      "share" + "Token",
      "access" + "TokenHash",
      "Bar" + "num",
      "바" + "넘",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
    ];
    const blockedReturnMarkers = [
      "input" + "_snapshot",
      "provider" + "_payment" + "_id",
      "access" + "_token" + "_hash",
      "share" + "Token",
      "report" + "_snapshot",
    ];

    for (const marker of blockedSourceMarkers) {
      expect(source).not.toContain(marker);
    }

    for (const marker of blockedReturnMarkers) {
      expect(returnsSection).not.toContain(marker);
    }
  });
});
