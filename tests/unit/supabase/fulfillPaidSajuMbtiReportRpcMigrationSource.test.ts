import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/0008_fulfill_paid_saju_mbti_report_rpc.sql",
  ),
  "utf8",
);

describe("fulfill paid saju mbti report RPC migration source", () => {
  it("defines the fulfillment RPC with required security and safe return fields", () => {
    const requiredMarkers = [
      "create or replace function public.fulfill_paid_saju_mbti_report",
      "security definer",
      "set search_path = public",
      "p_provider_order_id text",
      "returns table",
      "payment_order_id text",
      "provider_order_id text",
      "report_id text",
      "product_type text",
      "status text",
      "amount integer",
      "currency text",
      "grant execute on function public.fulfill_paid_saju_mbti_report",
      "to anon",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("verifies paid Toss launch-price context and links the report id", () => {
    const requiredMarkers = [
      "PAYMENT_ORDER_NOT_FOUND",
      "PAYMENT_ORDER_NOT_PAID",
      "PAYMENT_ORDER_INVALID_CONTEXT",
      "v_order.status <> 'paid'",
      "v_order.provider <> 'toss'",
      "v_order.product_type <> 'saju_mbti_full'",
      "v_order.amount <> 990",
      "v_order.currency <> 'KRW'",
      "v_order.report_id is not null",
      "insert into public.reports",
      "v_order.input_snapshot",
      "jsonb_build_object",
      "결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.",
      "update public.payment_orders",
      "report_id = v_report_id",
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
      "grant update on table public.payment_orders to anon",
      "grant select on table public.payment_orders to anon",
      "grant insert on table public.reports to anon",
      "create policy",
      "using (true)",
      "with check (true)",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "TOSS" + "_SECRET" + "_KEY",
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
