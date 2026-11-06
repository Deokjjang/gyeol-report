/**
 * 텔레그램 메시지 문구와 ★ 추천 규칙(운영 Q 5·6부). 순수 함수만 — 시험에서 그대로 부른다.
 * 시간은 모두 KST, 금액은 쉼표 표기, HTML 모드라 값은 escape한다. 이름·이메일·생년월일·사주 입력값은 넣지 않는다.
 */
import { bookForProduct, readerTitle } from "../../book/product";

export type BookFacts = { status: string | null; publishedAt: string | null } | null;
export type OrderFacts = {
  paymentOrderId: string; orderCode: string | null; productType: string; amount: number; status: string; createdAt: string; paidAt: string | null; refundedAt: string | null;
  reportId: string | null; paymentKey: string | null; providerOrderId: string | null; hasAccount: boolean; firstPaid: boolean; accountPaid: number; accountRefunded: number;
  source: Record<string, unknown>; book: BookFacts; job: { status: string | null; attempts: number | null; nextRetryAt: string | null; lastError: string | null } | null;
  gen: { phase: string | null; regenerateRequestedAt: string | null; officialAt: string | null; interimAt?: string | null; gaveUpAt: string | null; updatedAt: string | null } | null;
  views: number; gift: { status: string; kind: string } | null; refund: { state: string; source: string; completedAt: string | null; lastError: string | null } | null;
};
export type TicketFacts = { reportId: string; productType: string; createdAt: string; state: string; userId: string; book: BookFacts;
  gen: OrderFacts["gen"]; views: number; accountPaid: number; accountRefunded: number };
export type Duplicate = { paymentOrderId: string; orderCode: string | null; amount: number; paidAt: string; reportId: string | null; views: number };
export type ItemState = { working?: string; workingAt?: string; pin?: { act: string; target?: string; until: string; promptId?: number; failures?: number }; regenFailed?: boolean; regenSawActive?: boolean; touchedAt?: string };
export type ItemFacts = {
  item: { id: number; kind: string; bot: string; payload: Record<string, unknown>; state: ItemState; messageId: number | null; createdAt: string; sentAt: string | null; closedAt: string | null; closedLine: string | null; attempts: number; lastError: string | null };
  request: { id: string; reason: string; status: string; resolution: string | null; resolvedBy: string | null; resolvedAt: string | null; createdAt: string; device: string | null; paymentOrderId: string | null; reportId: string | null } | null;
  order: OrderFacts | null; ticket: TicketFacts | null; duplicates: Duplicate[]; regenFailedBefore: boolean;
  failed: { id: number; kind: string; attempts: number; lastError: string | null; createdAt: string } | null;
};
export type Stats = { payCount: number; paySum: number; refundCount: number; refundSum: number; newCount: number; repeatCount: number; byProduct: { productType: string; count: number; sum: number }[] };
export type EventStats = { issued: number; usedSelf: number; gifted: number; claimed: number; available: number; revoked: number; expired: number; nextExpiry: string | null };
export type Button = { text: string; callback_data: string };
export type Message = { text: string; buttons: Button[][] };

export const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const won = (n: number) => `${Math.round(Number(n) || 0).toLocaleString("en-US")}원`;
const KST_HM = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false });
const KST_MD = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit" });
const valid = (iso: string | null | undefined) => { const t = Date.parse(iso ?? ""); return Number.isFinite(t) ? new Date(t) : null; };
/** 14:05 */
export const hm = (iso: string | null | undefined) => { const d = valid(iso); return d ? KST_HM.format(d) : "-"; };
/** 11/06 */
export const md = (iso: string | null | undefined) => { const d = valid(iso); if (!d) return "-"; const [dd, mm] = KST_MD.format(d).split("/"); return `${mm}/${dd}`; };
export const mdhm = (iso: string | null | undefined) => `${md(iso)} ${hm(iso)}`;
export const productTitle = (key: string) => { const b = bookForProduct(key); return b ? readerTitle(b, "") : "결리포트"; };

/** 결제수단: 간편결제면 제공사(카카오페이·토스페이…), 아니면 토스 method(카드 등). */
export function methodLabel(p: { method?: unknown; easyPay?: unknown } | null): string | null {
  if (!p) return null;
  const provider = p.easyPay && typeof p.easyPay === "object" ? (p.easyPay as { provider?: unknown }).provider : null;
  const pick = typeof provider === "string" && provider.trim() ? provider : typeof p.method === "string" ? p.method : "";
  const clean = pick.replace(/[^\p{L}\p{N} ]/gu, "").trim().slice(0, 20);
  return clean || null;
}

const SOURCES: [RegExp, string][] = [[/^(instagram|ig|insta)$/, "인스타"], [/^(facebook|fb|meta)$/, "메타"], [/^threads$/, "스레드"], [/^(kakao|kakaotalk)$/, "카카오"],
  [/^naver$/, "네이버"], [/^google$/, "구글"], [/^youtube$/, "유튜브"], [/^(x|twitter)$/, "X"]];
/** 유입 출처 한 단어(campaign_attributions.source_metadata). 예: 인스타 광고. */
export function sourceWord(meta: Record<string, unknown> | null | undefined): string | null {
  const src = typeof meta?.utm_source === "string" ? meta.utm_source.toLowerCase() : "";
  if (!src) return null;
  const medium = typeof meta?.utm_medium === "string" ? meta.utm_medium.toLowerCase() : "";
  const name = SOURCES.find(([re]) => re.test(src))?.[1] ?? (/^[a-z]{2,12}$/.test(src) ? src : null);
  if (!name) return null;
  return /(^|[_-])(paid|cpc|cpm|ad|ads|sponsored)([_-]|$)/.test(medium) ? `${name} 광고` : name;
}

/** user agent 요약(접수 때 기기·브라우저만, 개인정보 없음). 예: 아이폰 사파리, 안드로이드 카카오톡. */
export function uaSummary(ua: string | null | undefined): string | null {
  const u = (ua ?? "").slice(0, 600);
  if (!u.trim()) return null;
  const device = /iPhone/.test(u) ? "아이폰" : /iPad/.test(u) ? "아이패드" : /Android/.test(u) ? "안드로이드" : /Macintosh|Mac OS X/.test(u) ? "맥" : /Windows/.test(u) ? "윈도우" : "기타 기기";
  const browser = /KAKAOTALK/i.test(u) ? "카카오톡" : /Instagram/.test(u) ? "인스타그램" : /FBAN|FBAV/.test(u) ? "페이스북" : /NAVER\(inapp|NAVER/.test(u) ? "네이버 앱"
    : /\bLine\//.test(u) ? "라인" : /SamsungBrowser/.test(u) ? "삼성 인터넷" : /Whale/.test(u) ? "웨일" : /Edg(e|A|iOS)?\//.test(u) ? "엣지"
    : /CriOS|Chrome\//.test(u) ? "크롬" : /FxiOS|Firefox\//.test(u) ? "파이어폭스" : /Safari\//.test(u) ? "사파리" : "브라우저";
  return `${device} ${browser}`;
}

export const bookComplete = (b: BookFacts | undefined) => !!b && b.status === "COMPLETED" && !!b.publishedAt;
const GIFT_LABEL: Record<string, string> = { available: "미사용", used_self: "사용", gifted: "선물 링크 보냄", claimed: "선물 받음", expired: "만료", revoked: "회수됨" };
export const giftLabel = (g: OrderFacts["gift"]) => (g ? GIFT_LABEL[g.status] ?? g.status : "없음");
function bookStateLabel(b: BookFacts, job: OrderFacts["job"]): string {
  if (bookComplete(b)) return "책 완성";
  if (job?.status === "FAILED_REQUIRES_ATTENTION" || b?.status === "FAILED_REQUIRES_ATTENTION") return "생성 실패(확인 필요)";
  if (b || job) return "만드는 중";
  return "책 없음";
}
function retryLabel(job: OrderFacts["job"]): string {
  if (!job?.status) return "생성 기록 없음";
  if (job.lastError === "REFUND_HOLD") return "자동 재시도 멈춤";
  if (job.status === "FAILED_REQUIRES_ATTENTION") return "자동 재시도 끝남(확인 필요)";
  return "자동 재시도 중";
}

// ── 매출 봇 ──────────────────────────────────────────────────────
export function salesPaymentText(o: OrderFacts, method: string | null, today: Stats): string {
  const src = sourceWord(o.source);
  return [`💳 <b>${won(o.amount)}</b> · ${esc(productTitle(o.productType))}`,
    [method ?? "결제수단 확인 못 함", o.firstPaid ? "신규" : "재구매", hm(o.paidAt), ...(src ? [src] : [])].map(esc).join(" · "),
    `오늘 ${today.payCount}건 · ${won(today.paySum)}`].join("\n");
}
export function salesRefundText(o: OrderFacts, today: Stats): string {
  return [`↩️ 환불 <b>${won(o.amount)}</b> · ${esc(productTitle(o.productType))} · ${esc(o.orderCode ?? "")}`, `오늘 순매출 ${won(today.paySum - today.refundSum)}`].join("\n");
}
export function statsText(title: string, s: Stats): string {
  const lines = [`📊 <b>${esc(title)}</b>`, `결제 ${s.payCount}건 · ${won(s.paySum)}`, `환불 ${s.refundCount}건 · ${won(s.refundSum)}`, `순매출 <b>${won(s.paySum - s.refundSum)}</b>`];
  if (s.byProduct.length) lines.push(`상품별: ${s.byProduct.map(p => `${esc(productTitle(p.productType))} ${p.count}건 ${won(p.sum)}`).join(" · ")}`);
  lines.push(`신규 ${s.newCount} · 재구매 ${s.repeatCount}`);
  return lines.join("\n");
}
export function monthText(label: string, s: Stats, days: number, prevLabel: string, prev: Stats): string {
  const net = s.paySum - s.refundSum, prevNet = prev.paySum - prev.refundSum, diff = net - prevNet;
  const pct = prevNet > 0 ? ` · ${diff >= 0 ? "+" : ""}${Math.round((diff / prevNet) * 100)}%` : "";
  return [`📅 <b>${esc(label)}</b>`, `결제 ${s.payCount}건 · ${won(s.paySum)} · 환불 ${s.refundCount}건 · ${won(s.refundSum)}`,
    `순매출 <b>${won(net)}</b> · 일평균 ${won(days > 0 ? net / days : 0)}`, `신규 ${s.newCount} · 재구매 ${s.repeatCount}`,
    `${esc(prevLabel)}: 순매출 ${won(prevNet)} (${diff >= 0 ? "+" : "−"}${won(Math.abs(diff))}${pct})`].join("\n");
}
export function eventText(e: EventStats, period: string, expiry: string): string {
  return [`🎁 <b>1+1 증정 이용권</b> · ${esc(period)} · 이용권 ${esc(expiry)}까지`,
    `발급 ${e.issued} · 내가 씀 ${e.usedSelf} · 선물 ${e.gifted + e.claimed}(받음 ${e.claimed})`,
    `남음 ${e.available} · 회수 ${e.revoked} · 만료 ${e.expired}`, ...(e.nextExpiry ? [`남은 이용권 만료 ${mdhm(e.nextExpiry)}`] : [])].join("\n");
}

// ── 처리 봇: ★ 추천 규칙과 버튼 ─────────────────────────────────────
export type Act = "rf" | "rg" | "gd" | "tk";
export type ActButton = { act: Act; label: string; star: boolean; target?: string };
/** 두 번 결제: 열람이 적은 쪽, 같으면 나중 결제를 환불 추천. */
export function duplicateToRefund(d: Duplicate[]): Duplicate | null {
  if (d.length < 2) return null;
  return [...d].sort((a, b) => a.views - b.views || Date.parse(b.paidAt) - Date.parse(a.paidAt))[0] ?? null;
}
/**
 * ★ 규칙:
 * - 안 나옴(책 미완성): ★다시 만들기. 덕짱님이 누른 다시 만들기가 이미 실패했다면 ★환불.
 * - 안 열림 + 책 완성 + 열람 0회: ★환불.  - 안 열림 + 열람 1회 이상: ★안내.
 * - 두 번 결제: 열람이 적은 쪽(같으면 나중 결제) ★환불.
 * - 이용권으로 만든 책: [환불] 대신 [이용권 돌려주기].
 */
export function opsButtons(f: ItemFacts): ActButton[] {
  const ticket = !f.order && !!f.ticket;
  const money: Act = ticket ? "tk" : "rf", moneyLabel = ticket ? "이용권 돌려주기" : "환불";
  const regenFailed = f.regenFailedBefore || f.item.state.regenFailed === true;
  if (f.item.state.regenFailed === true) return [{ act: money, label: moneyLabel, star: true }];
  if (f.item.kind === "unpublished") {
    return [{ act: "rg", label: "다시 만들기", star: !regenFailed }, { act: money, label: moneyLabel, star: regenFailed }];
  }
  if (f.request?.reason === "double_paid" && f.order) {
    const pick = duplicateToRefund(f.duplicates);
    return pick?.orderCode ? [{ act: "rf", label: `${pick.orderCode} 환불`, star: true, target: pick.orderCode }, { act: "gd", label: "안내", star: false }] : [{ act: "gd", label: "안내", star: true }];
  }
  const complete = bookComplete(f.order?.book ?? f.ticket?.book ?? null);
  const views = f.order?.views ?? f.ticket?.views ?? 0;
  const star: Act = !complete ? (regenFailed ? money : "rg") : views === 0 ? money : "gd";
  return [{ act: money, label: moneyLabel, star: star === money }, { act: "rg", label: "다시 만들기", star: star === "rg" }, { act: "gd", label: "안내", star: star === "gd" }];
}
export const callbackData = (id: number, act: string, target?: string) => `q:${id}:${act}${target ? `:${target}` : ""}`;
export function keyboard(id: number, buttons: ActButton[]): Button[][] {
  return [buttons.map(b => ({ text: `${b.star ? "★" : ""}${b.label}`, callback_data: callbackData(id, b.act, b.target) }))];
}

const codeOf = (f: ItemFacts) => f.order?.orderCode ?? (f.ticket ? "이용권 책" : "-");
function accountLine(f: ItemFacts): string {
  if (f.order) return f.order.hasAccount ? `이 계정 결제 ${f.order.accountPaid} · 환불 ${f.order.accountRefunded} · 이 결제 증정 이용권 ${giftLabel(f.order.gift)}` : `계정 없음(비회원) · 이 결제 증정 이용권 ${giftLabel(f.order.gift)}`;
  if (f.ticket) return `이 계정 결제 ${f.ticket.accountPaid} · 환불 ${f.ticket.accountRefunded} · 이용권으로 만든 책`;
  return "";
}
/** 처리 봇 메시지(버튼 포함). 이미 정리된 줄이면 그 줄만. */
export function opsMessage(f: ItemFacts, method: string | null, now = Date.now()): Message {
  const id = f.item.id, kind = f.item.kind;
  if (kind === "notify_failed") {
    const x = f.failed;
    return { text: [`🚨 <b>알림이 10번 실패했어요</b>${x ? ` · ${esc(KIND_LABEL[x.kind] ?? x.kind)} · ${mdhm(x.createdAt)}` : ""}`, `마지막 오류 ${esc(x?.lastError ?? "-")}`, "/pending 에서 남은 건을 볼 수 있어요"].join("\n"), buttons: [] };
  }
  if (kind === "reminder") return { text: `⏰ 미처리 <b>${Number(f.item.payload.count) || 0}건</b> — /pending 으로 목록을 볼 수 있어요`, buttons: [] };
  const buttons = keyboard(id, opsButtons(f));
  if (kind === "unpublished") {
    const o = f.order;
    const mins = o?.paidAt ? Math.max(0, Math.floor((now - Date.parse(o.paidAt)) / 60_000)) : 0;
    const head = f.item.state.regenFailed ? "⚠️ <b>다시 실패</b>" : "🚨 <b>책이 안 나왔어요</b>";
    return { text: [`${head} · ${esc(codeOf(f))}`, `${esc(o ? productTitle(o.productType) : "")} · 결제 ${hm(o?.paidAt)} · ${mins}분 지남 · ${esc(retryLabel(o?.job ?? null))}`].join("\n"), buttons };
  }
  if (f.request?.reason === "double_paid" && f.order) {
    const d = f.duplicates.length >= 2 ? f.duplicates : [];
    const o = f.order;
    return { text: [`📮 <b>두 번 결제</b> · ${esc(codeOf(f))}`,
      `${esc(productTitle(o.productType))} · ${won(o.amount)} ×${Math.max(d.length, 1)} (${d.map(x => hm(x.paidAt)).join(" · ") || hm(o.paidAt)}) · 같은 입력`,
      d.map(x => `${esc(x.orderCode ?? "-")} 열람 ${x.views}회`).join(" · ")].filter(Boolean).join("\n"), buttons };
  }
  const book = f.order?.book ?? f.ticket?.book ?? null;
  const title = f.item.state.regenFailed ? "⚠️ <b>다시 실패</b>" : bookComplete(book) ? "📮 <b>책이 안 열려요</b>" : "📮 <b>책이 안 나와요</b>";
  const line2 = f.order ? `${esc(productTitle(f.order.productType))} · ${won(f.order.amount)} · ${esc(method ?? "결제수단 확인 못 함")} · ${mdhm(f.order.paidAt)}`
    : f.ticket ? `이용권 책 · ${esc(productTitle(f.ticket.productType))} · ${mdhm(f.ticket.createdAt)}` : "";
  const line3 = `${bookStateLabel(book, f.order?.job ?? null)} · 열람 ${f.order?.views ?? f.ticket?.views ?? 0}회 · ${esc(f.request?.device ?? "기기 정보 없음")}`;
  return { text: [`${title} · ${esc(codeOf(f))}`, line2, line3, accountLine(f)].filter(Boolean).join("\n"), buttons };
}
const KIND_LABEL: Record<string, string> = { payment: "매출 결제", refund: "매출 환불", request: "처리 문의", unpublished: "처리 미발행", reminder: "처리 미처리 알림", notify_failed: "처리 실패 경고" };

// ── 처리 뒤 한 줄(버튼 없음) ─────────────────────────────────────
export function refundDoneLine(o: OrderFacts, at: string | null): string {
  const gift = o.gift?.status === "revoked" ? " · 이용권 1장 회수" : o.gift && ["used_self", "claimed"].includes(o.gift.status) ? " · 증정 이용권은 이미 사용(회수 안 함)" : "";
  return `✅ 환불 완료 ${won(o.amount)} · ${o.orderCode ?? "-"} · ${hm(at ?? o.refundedAt)}${gift}`;
}
export const LINES = {
  regenerating: (code: string) => `⏳ 다시 만드는 중 · ${code}`,
  regenerated: (code: string, at: string) => `✅ 다시 만들었어요 · ${code} · ${hm(at)}`,
  autoDone: (code: string, at: string) => `✅ 자동으로 완성됐어요 · ${code} · ${hm(at)}`,
  guided: (code: string, at: string) => `✅ 안내 보냄 · ${code} · ${hm(at)}`,
  ticketBack: (code: string, at: string) => `✅ 이용권 다시 드림 · ${code} · ${hm(at)}`,
  refunding: (code: string) => `⏳ 환불 처리 중 · ${code} · 토스 취소가 끝나면 이 줄이 바뀌어요`,
  pinPrompt: (code: string, amount: number) => `${code} ${won(amount)} 환불 · 비밀번호를 보내 주세요 (2분)`,
};
