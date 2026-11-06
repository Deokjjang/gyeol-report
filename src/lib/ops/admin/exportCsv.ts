import type { OrderRow } from "./data";
import { kst, maskEmail, maskPhone, paymentStatusLabel, productLabel } from "./format";

const HEADER = ["주문코드", "상품", "금액", "결제 상태", "주문 시각(KST)", "결제 시각(KST)", "토스 주문번호", "구매자 이메일(가림)", "구매자 전화(가림)"];
/** 셀 값: 따옴표로 감싸고, 수식으로 읽힐 수 있는 첫 글자(= + - @ 탭·CR)는 ' 를 붙인다(CSV 수식 주입 방지). */
function cell(value: unknown): string {
  let v = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}
/** 현재 검색 결과 CSV(엑셀 한글용 BOM). 이메일·전화는 가린 값만. */
export function ordersCsv(orders: readonly OrderRow[], phones: ReadonlyMap<string, string | null> = new Map()): string {
  const lines = [HEADER.map(cell).join(",")];
  for (const o of orders) {
    const phone = phones.get(o.paymentOrderId);
    lines.push([o.orderCode, productLabel(o.productType), o.amount, paymentStatusLabel(o.paymentStatus), kst(o.createdAt), o.paidAt ? kst(o.paidAt) : "", o.providerOrderId ?? "",
      o.buyerEmail ? maskEmail(o.buyerEmail) : "", phone ? maskPhone(phone) : ""].map(cell).join(","));
  }
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
