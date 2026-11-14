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
  /** 시험 계정(관리자·누나)의 주문 — 집계에서 빠지고 알림에 「시험」 표시(migration 20261110200000). */
  test?: boolean;
};
export type TicketFacts = { reportId: string; productType: string; createdAt: string; state: string; userId: string; book: BookFacts;
  gen: OrderFacts["gen"]; views: number; accountPaid: number; accountRefunded: number; test?: boolean };
export type Duplicate = { paymentOrderId: string; orderCode: string | null; amount: number; paidAt: string; reportId: string | null; views: number };
export type ItemState = { working?: string; workingAt?: string; pin?: { act: string; target?: string; until: string; promptId?: number; failures?: number }; regenFailed?: boolean; regenSawActive?: boolean; touchedAt?: string };
export type ItemFacts = {
  item: { id: number; kind: string; bot: string; payload: Record<string, unknown>; state: ItemState; messageId: number | null; createdAt: string; sentAt: string | null; closedAt: string | null; closedLine: string | null; attempts: number; lastError: string | null };
  request: { id: string; reason: string; status: string; resolution: string | null; resolvedBy: string | null; resolvedAt: string | null; createdAt: string; device: string | null; paymentOrderId: string | null; reportId: string | null } | null;
  order: OrderFacts | null; ticket: TicketFacts | null; duplicates: Duplicate[]; regenFailedBefore: boolean;
  failed: { id: number; kind: string; attempts: number; lastError: string | null; createdAt: string } | null;
  /** HOTFIX-W1 3부 1: 실패 분류 · 몇 단 · 다음 자동 시도 · 지금까지 쓴 비용(생성 기록에서). 없으면 줄을 붙이지 않는다. */
  genLine?: string | null;
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
/** 시험 계정 알림 머리표(알림은 보내고 집계에서는 뺀다). */
export const TEST_TAG = "🧪 시험(집계 제외)";
const tagged = (test: boolean | undefined, line: string) => (test ? `${TEST_TAG} · ${line}` : line);
export function salesPaymentText(o: OrderFacts, method: string | null, today: Stats): string {
  const src = sourceWord(o.source);
  return [tagged(o.test, `💳 <b>${won(o.amount)}</b> · ${esc(productTitle(o.productType))}`),
    [method ?? "결제수단 확인 못 함", o.firstPaid ? "신규" : "재구매", hm(o.paidAt), ...(src ? [src] : [])].map(esc).join(" · "),
    `오늘 ${today.payCount}건 · ${won(today.paySum)}`].join("\n");
}
export function salesRefundText(o: OrderFacts, today: Stats): string {
  return [tagged(o.test, `↩️ 환불 <b>${won(o.amount)}</b> · ${esc(productTitle(o.productType))} · ${esc(o.orderCode ?? "")}`), `오늘 순매출 ${won(today.paySum - today.refundSum)}`].join("\n");
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
/** validity: 이용권 기한 설명(「받은 날부터 30일」). */
export function eventText(e: EventStats, period: string, validity: string): string {
  return [`🎁 <b>1+1 증정 이용권</b> · ${esc(period)} · 이용권 ${esc(validity)}`,
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
/** 처리 봇 메시지(버튼 포함). 시험 계정 건이면 맨 앞에 「시험」. */
export function opsMessage(f: ItemFacts, method: string | null, now = Date.now()): Message {
  const m = opsMessageBody(f, method, now);
  return f.order?.test || f.ticket?.test ? { ...m, text: tagged(true, m.text) } : m;
}
function opsMessageBody(f: ItemFacts, method: string | null, now: number): Message {
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
    return { text: [`${head} · ${esc(codeOf(f))}`, `${esc(o ? productTitle(o.productType) : "")} · 결제 ${hm(o?.paidAt)} · ${mins}분 지남 · ${esc(retryLabel(o?.job ?? null))}`, ...(f.genLine ? [esc(f.genLine)] : [])].join("\n"), buttons };
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
const KIND_LABEL: Record<string, string> = { payment: "매출 결제", refund: "매출 환불", request: "처리 문의", unpublished: "처리 미발행", reminder: "처리 미처리 알림", notify_failed: "처리 실패 경고", share_failed: "처리 공유 실패 경보",
  signup_surge: "처리 가입 급증 경보", api_credit: "처리 API 잔액 경보" };

// ── F 가입 이용권 캠페인(처리 봇) ─────────────────────────────────────
/** 버튼 값(돈이 오가지 않아 비밀번호 없음, 덕짱님 id만 — 웹훅 첫 관문). */
export const SIGNUP_PAUSE_DATA = "sg:pause", SIGNUP_RESUME_DATA = "sg:resume";
export function signupButtons(on: boolean): Button[][] {
  return [[on ? { text: "지급 멈춤", callback_data: SIGNUP_PAUSE_DATA } : { text: "다시 켜기", callback_data: SIGNUP_RESUME_DATA }]];
}
/** 「🚨 가입 급증 N건 (최근 1시간) · 오늘 지급 N장」 */
export function signupSurgeText(p: Record<string, unknown>): string {
  return `🚨 <b>가입 급증 ${Number(p.count) || 0}건</b> (최근 1시간) · 오늘 지급 ${Number(p.grantedToday) || 0}장${p.on === false ? "\n지금 지급은 멈춰 있어요" : ""}`;
}
/** 「⏸ 가입 이용권 지급 멈춤 · 시각」 / 「▶️ 가입 이용권 지급 다시 켬 · 시각」 */
export function signupSwitchText(on: boolean, at: string | null): string {
  return on ? `▶️ <b>가입 이용권 지급 다시 켬</b> · ${mdhm(at)}` : `⏸ <b>가입 이용권 지급 멈춤</b> · ${mdhm(at)}`;
}
// ── W3 P0 4종 판매 중지(처리 봇 /sales · [4종 멈춤] · [다시 열기] · 자동 멈춤) ──────────
/** 버튼 값(돈이 오가지 않아 비밀번호 없음, 덕짱님 id만 — 웹훅 첫 관문). 다시 여는 것은 이 버튼으로만(자동으로 다시 열지 않는다). */
export const SALES_PAUSE_DATA = "sl:pause", SALES_RESUME_DATA = "sl:resume";
export function salesButtons(on: boolean): Button[][] {
  return [[on ? { text: "다시 열기", callback_data: SALES_RESUME_DATA } : { text: "4종 멈춤", callback_data: SALES_PAUSE_DATA }]];
}
const SALES_BY: Readonly<Record<string, string>> = { telegram: "처리 봇", auto: "자동", admin: "관리자 화면", cli: "CLI" };
const SALES_REASON: Readonly<Record<string, string>> = { connection: "연결 오류 연속", anthropic_credit: "Anthropic 잔액·결제", anthropic_auth: "Anthropic 인증·권한", manual: "" };
export type SalesState = { on: boolean; at: string | null; by: string | null; reason: string | null };
/** /sales·버튼 뒤: 「⏸ 4종 판매 멈춤 · 시각 · 누가 · 왜」 / 「▶️ 4종 판매 중」. */
export function salesStatusText(s: SalesState): string {
  const who = SALES_BY[s.by ?? ""] ?? (s.by || ""), why = SALES_REASON[s.reason ?? ""] ?? (s.reason || "");
  return s.on
    ? [`⏸ <b>4종 판매 멈춤</b> · ${mdhm(s.at)}${who ? ` · ${esc(who)}` : ""}${why ? ` · ${esc(why)}` : ""}`, "새 결제·이용권 사용을 받지 않아요. 이미 결제한 책은 그대로 만들어요.", "다시 열기는 아래 버튼으로만 돼요."].join("\n")
    : `▶️ <b>4종 판매 중</b>${s.at ? ` · 마지막 변경 ${mdhm(s.at)}${who ? `(${esc(who)})` : ""}` : ""}`;
}
/** 자동 멈춤(연결 오류로 실패한 주문 N건 / 10분). */
export function salesAutoPauseText(a: { count: number; windowMin: number; products: readonly string[] }): string {
  return [`🚨 <b>4종 판매 자동 멈춤</b> · 연결 오류로 실패한 주문 ${a.count}건(최근 ${a.windowMin}분)`, a.products.length ? esc(a.products.join(" · ")) : "",
    "새 결제·이용권 사용을 받지 않아요. 이미 결제한 책은 그대로 만들어요.", "원인이 풀리면 [다시 열기]를 눌러 주세요."].filter(Boolean).join("\n");
}
/** Anthropic 잔액/인증 경보(1시간 1번, OpenAI 경보와 따로). 경보가 나면 판매도 자동으로 멈춘다. */
export function anthropicAlarmText(a: { code: string; paused: boolean }): string {
  const what = a.code === "anthropic_auth" ? "인증·권한 오류(키 확인)" : "잔액·결제 오류(충전·결제수단 확인)";
  return [`🚨 <b>Anthropic 잔액/인증 — 모든 생성 실패 중</b>`, `${what} · Claude Console에서 확인해 주세요`,
    a.paused ? "4종 판매를 자동으로 멈췄어요. 이미 결제한 책은 다시 시도해요." : "4종 판매는 이미 멈춰 있어요.", "풀리면 [다시 열기]를 눌러 주세요. (이 경보는 1시간에 1번)"].join("\n");
}
/** 「🚨 생성 실패: API 잔액 확인 필요」(1시간 1번). */
export function apiCreditText(p: Record<string, unknown>): string {
  const code = p.code === "openai_quota" ? "OpenAI(임시본) 할당량" : "Anthropic(작가) 잔액·결제";
  return [`🚨 <b>생성 실패: API 잔액 확인 필요</b>`, `${code} 문제로 작가 호출이 실패했어요 · 무료 책이 늘면 잔액이 빨리 줄어요`].join("\n");
}
export type CampaignStats = { on: boolean; at: string | null; signupsToday: number; signups: number; grantedToday: number; granted: number; used: number; available: number; expired: number;
  booksStarted: number; booksPublished: number; avgCostUsd: number | null; costSample: number };
const usd = (n: number) => `$${n.toFixed(2)}`;
/** /campaign: 지급 상태·오늘/누적 신규 가입·지급·사용·무료로 만든 책·추정 생성비(권당 실측 평균). 시험 계정 제외. */
export function campaignText(c: CampaignStats, period: string): string {
  const cost = c.avgCostUsd !== null && c.avgCostUsd > 0 ? `추정 생성비 ${usd(c.avgCostUsd * c.booksStarted)} (권당 실측 평균 ${usd(c.avgCostUsd)} · 최근 30일 ${c.costSample}권)` : "추정 생성비: 실측 비용 기록 없음";
  return [`🎟 <b>가입 이용권</b> · ${c.on ? "지급 켜짐" : `⏸ 지급 멈춤${c.at ? `(${mdhm(c.at)})` : ""}`} · ${esc(period)}`,
    `오늘 신규 가입 ${c.signupsToday} · 지급 ${c.grantedToday}`,
    `누적 신규 가입 ${c.signups} · 지급 ${c.granted} · 사용 ${c.used} · 남음 ${c.available} · 만료 ${c.expired}`,
    `무료로 만든 책 ${c.booksStarted}권(발행 ${c.booksPublished})`, cost, "시험 계정 제외"].join("\n");
}
export type FunnelRow = { day: string; step: string; source: string; campaign: string; content?: string; n: number };
export type FunnelServer = Record<string, number>;
/** /funnel 단계 순서와 전환율의 기준 단계(null = 전환율 없음). */
export const FUNNEL_LINES: ReadonlyArray<readonly [step: string, label: string, base: string | null]> = [
  ["land", "랜딩(첫 화면)", null], ["free_view", "/free 조회", null], ["login_new", "신규 가입", "free_view"], ["signup_grant", "가입 이용권 지급", "login_new"], ["free_book", "무료 책", "signup_grant"],
  ["home_view", "메인 조회", null], ["product_view", "상품 화면", "home_view"], ["input_start", "입력 시작", "product_view"], ["input_done", "입력 완료", "input_start"],
  ["ticket_click", "이용권 사용", "input_done"], ["pay_click", "결제하기", "input_done"], ["pay_open", "결제창 열림", "pay_click"], ["paid", "결제 완료", "pay_open"],
  ["login_member", "기존 회원 로그인", null], ["book_start", "책 생성 시작", null], ["book_published", "책 발행", "book_start"],
];
const pct = (n: number, d: number) => d > 0 ? ` (${Math.round(n / d * 100)}%)` : "";
const SOURCE_LABEL: Record<string, string> = { direct: "직접", "-": "모름", meta: "메타", facebook: "메타", fb: "메타", x: "X", twitter: "X", instagram: "인스타", ig: "인스타", threads: "스레드", kakao: "카카오", naver: "네이버", google: "구글", other: "기타" };
function funnelBlock(sum: Map<string, number>): string[] {
  return FUNNEL_LINES.filter(([step]) => (sum.get(step) ?? 0) > 0 || ["land", "free_view", "home_view", "paid"].includes(step))
    .map(([step, label, base]) => `${label} ${sum.get(step) ?? 0}${base ? pct(sum.get(step) ?? 0, sum.get(base) ?? 0) : ""}`);
}
/** 유입 한 줄: 「메타 · 랜딩 120 → 가입 30 (25%) → 무료 책 12 (40%) → 결제 2 (17%)」(괄호 = 앞 단계 대비). 가입·무료 책은 서버가 처음 유입 값으로 센 숫자. */
export function conversionLine(label: string, m: ReadonlyMap<string, number>): string {
  const g = (k: string) => m.get(k) ?? 0, land = g("land"), join = g("login_new"), free = g("free_book"), paid = g("paid");
  return `${esc(label)} · 랜딩 ${land} → 가입 ${join}${pct(join, land)} → 무료 책 ${free}${pct(free, join)} → 결제 ${paid}${pct(paid, free)}`;
}
/** /funnel: 오늘·최근 7일 단계별 숫자·전환율(괄호 = 기준 단계 대비), 유입별 전환(최근 7일), 서버 기록(시험 계정 제외). 익명 집계. */
export function funnelText(r: { today: string; from: string; rows: FunnelRow[]; server: FunnelServer }): string {
  const sumOf = (rows: FunnelRow[]) => rows.reduce((m, x) => m.set(x.step, (m.get(x.step) ?? 0) + (Number(x.n) || 0)), new Map<string, number>());
  const today = r.rows.filter(x => String(x.day).slice(0, 10) === String(r.today).slice(0, 10));
  // 유입별 전환(F 후속): 메타·X는 늘, 그 밖은 랜딩이 있는 유입만(많은 순 6개). 같은 이름표(예: facebook → 메타)는 합친다.
  const bySource = new Map<string, FunnelRow[]>([["메타", []], ["X", []]]);
  for (const x of r.rows) { const k = SOURCE_LABEL[x.source] ?? x.source; bySource.set(k, [...(bySource.get(k) ?? []), x]); }
  const sums = [...bySource.entries()].map(([k, rows]) => [k, sumOf(rows)] as const);
  const sources = [...sums.filter(([k]) => k === "메타" || k === "X"),
    ...sums.filter(([k, m]) => k !== "메타" && k !== "X" && (m.get("land") ?? 0) > 0).sort((a, b) => (b[1].get("land") ?? 0) - (a[1].get("land") ?? 0)).slice(0, 6)];
  const s = r.server, n = (k: string) => Number(s[k]) || 0;
  const md2 = (d: string) => { const [, m, dd] = String(d).slice(0, 10).split("-"); return `${m}/${dd}`; };
  return [`📈 <b>퍼널</b> · 익명 집계(시험 브라우저·시험 계정 제외)`,
    `<b>오늘(${md2(r.today)})</b>`, ...funnelBlock(sumOf(today)),
    `<b>최근 7일(${md2(r.from)}~${md2(r.today)})</b>`, ...funnelBlock(sumOf(r.rows)),
    `<b>유입별 전환 · 최근 7일</b>(괄호 = 앞 단계 대비)`, ...(r.rows.length ? sources.map(([k, m]) => conversionLine(k, m)) : ["아직 기록이 없어요"]),
    `<b>서버 기록(시험 계정 제외)</b>`,
    `오늘 신규 가입 ${n("signupsToday")} · 가입 이용권 ${n("grantsToday")} · 무료 책 ${n("freeBooksToday")} · 주문 ${n("ordersToday")} · 결제 ${n("paidToday")} · 발행 ${n("publishedToday")}`,
    `7일 신규 가입 ${n("signups")} · 가입 이용권 ${n("grants")} · 무료 책 ${n("freeBooks")} · 주문 ${n("orders")} · 결제 ${n("paid")} · 발행 ${n("published")}`].join("\n");
}
/** 공유 실패 경보(운영 Q 추가, 버튼 없음). 상태 코드와 책 버전만 보인다(주문·책·회원 정보 없음 — DB에도 없다). */
export function shareFailedText(p: Record<string, unknown>): string {
  const causes = Array.isArray(p.causes) ? (p.causes as { status?: unknown; version?: unknown; count?: unknown }[]) : [];
  const version = (v: unknown) => (v === "v4" || v === "v5" ? v : "버전 모름");
  return [`🚨 <b>공유 실패 ${Number(p.count) || 0}건</b> · 최근 ${Number(p.windowMinutes) || 10}분`,
    ...causes.map(c => `${Number(c.status) || "-"} · ${version(c.version)} · ${Number(c.count) || 0}건`)].join("\n");
}

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
