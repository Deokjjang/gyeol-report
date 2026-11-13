/**
 * 관리자 화면(P6d-ops) 표시용 이름·형식. 서버·클라이언트 모두에서 쓴다(비밀 없음).
 */
import { getReportProduct } from "../../payment/reportProductCatalog";

export const ORDER_CODE_RE = /^GR-[2-9A-HJKMNP-Z]{4,6}$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
/** 한국 시각 "2026-11-04 13:05". 값이 없거나 틀리면 "-". */
export function kst(value: unknown): string {
  if (typeof value !== "string" || !value) return "-";
  const t = Date.parse(value);
  if (!Number.isFinite(t)) return "-";
  const p = Object.fromEntries(parts.formatToParts(new Date(t)).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}
export function won(value: unknown): string { return typeof value === "number" && Number.isFinite(value) ? `${value.toLocaleString("ko-KR")}원` : "-"; }
/** 결제 키는 끝 6자만 보인다. */
export function maskKey(value: unknown): string {
  if (typeof value !== "string" || !value) return "-";
  return value.length <= 6 ? "•".repeat(value.length) : `${"•".repeat(Math.min(value.length - 6, 8))}${value.slice(-6)}`;
}
export function productLabel(key: unknown): string { return getReportProduct(key)?.labelKo ?? (typeof key === "string" && key ? key : "-"); }
export function usd(value: unknown): string {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? `$${n.toFixed(4)}` : "-";
}
export function duration(ms: unknown): string {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return "-";
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}초` : `${Math.floor(s / 60)}분 ${s % 60}초`;
}

const label = (map: Record<string, string>) => (value: unknown): string => typeof value === "string" && value ? map[value] ?? value : "-";
export const paymentStatusLabel = label({ ready: "결제 전", paid: "결제 완료", refunded: "환불됨", canceled: "취소됨", failed: "결제 실패" });
export const bookStatusLabel = label({ QUEUED: "대기", RUNNING: "생성 중", RETRYING: "재시도 대기", COMPLETED: "발행", FAILED_REQUIRES_ATTENTION: "확인 필요", EXPIRED: "만료" });
export const jobStatusLabel = bookStatusLabel;
export const phaseLabel = label({ pending: "대기", interim: "임시본", official: "정식본", gave_up: "포기" });
export const refundStateLabel = label({ requested: "요청됨", processing: "처리 중", done: "환불 완료", failed: "실패(재시도)" });
// 운영 Q 2부: 지금 받는 사유는 not_open(안 나옴·안 열림)·double_paid(두 번 결제) 둘. 옛 사유(계산 오류·지연·환불 요청·기타)도 그대로 보인다.
export const requestReasonLabel = label({ not_open: "안 나옴·안 열림", double_paid: "두 번 결제", calc_error: "계산 오류", delayed: "지연", refund: "환불 요청", other: "기타" });
export const requestResolutionLabel = label({ refund: "환불", regenerate: "다시 만들기", ticket: "이용권 돌려주기", guide: "안내" });
export const laneLabel = label({ queue: "결제 큐", interim: "임시본", upgrade: "정식본 교체", regenerate: "재생성", attempt: "결제 큐 시도" });
export const outcomeLabel = label({ published: "발행", replaced: "교체", deferred: "보류", gave_up: "포기", stale: "만료된 작업", error: "오류" });
export const genderLabel = label({ MALE: "남", FEMALE: "여" });
export const relationshipTypeLabel = label({ love: "연인", marriage: "부부", parentChild: "부모·자녀", coworker: "동료", managerReport: "상사·팀원", businessPartner: "사업 파트너", friendship: "친구" });
export const jobLabel = label({ student: "학생", job_seeker: "구직", employee: "직장인", freelancer: "프리랜서", self_employed: "자영업", business_owner: "사업가", homemaker: "주부", unemployed: "무직", other: "기타" });
export const relationshipLabel = label({ single: "솔로", some: "썸", dating: "연애 중", marriage_preparing: "결혼 준비", married: "기혼" });
export const auditActionLabel = label({
  admin_retry: "결제 큐 재시도", admin_regenerate: "정식본 재생성", grant_ticket: "이용권 지급", refund_request: "환불 요청", refund_done: "환불 완료", refund_failed: "환불 실패",
  refund_blocked_cap: "환불 한도 차단", auto_refund_requested: "자동 환불 요청", request_done: "문의 처리", provider_enable: "OpenAI 다시 켬", admin_pin_failed: "PIN 오류",
  pii_view: "개인정보 보기", orders_export: "주문 내보내기",
  toss_check: "토스 상태 확인", toss_check_batch: "토스 상태 일괄 확인", external_refund: "외부 환불 기록", external_refund_blocked: "외부 환불 기록 막힘",
  comp_designate: "보상 A 지정", request_auto_done: "고객 요청 자동 처리", request_created: "고객 문의 접수",
  bot_button: "처리 봇 버튼", bot_refund: "처리 봇 환불", bot_regenerate: "처리 봇 다시 만들기", bot_guide: "처리 봇 안내", bot_pin_failed: "처리 봇 비밀번호 오류", bot_ignored: "처리 봇 무시(다른 사용자)",
});
export const refundSourceLabel = label({ admin: "관리자", auto: "자동(기한 안 실패 — AUTO_REFUND_HOURS)", external: "외부(토스 상점관리자에서 직접)" });
export const compStateLabel = label({ granted: "지급됨", ready: "지급 대기(가입 정보 완료)", waiting_profile: "가입 정보 입력 전" });

/** 환불 확인 단계 경고 문구(P6e-ops 3). 서버 응답(warnings)을 그대로 받아 같은 문장을 화면·서버 메시지가 쓴다. */
export function refundWarningLines(w: { giftUsed: readonly { status: string }[]; giftPendingRevoked?: number; bonusSent: boolean }): string[] {
  const lines: string[] = [];
  if (w.giftUsed.some(g => g.status === "used_self")) lines.push("이 주문으로 받은 이벤트 이용권을 본인이 이미 사용했어요.");
  if (w.giftUsed.some(g => g.status === "claimed")) lines.push("이 주문으로 받은 이벤트 이용권을 친구가 이미 받았어요.");
  if (w.bonusSent) lines.push("이 주문이 선물받은 친구의 첫 결제라 보낸 사람에게 보너스 이용권이 이미 나갔어요.");
  if (lines.length) lines.push("정책상 이미 쓴 이용권·나간 보너스는 회수하지 않아요(안 쓴 이벤트 이용권만 환불 때 회수돼요).");
  return lines;
}

/** 이메일 가리기: "hong@example.com" → "ho***@ex***.com". */
export function maskEmail(value: unknown): string {
  if (typeof value !== "string" || !value.includes("@")) return "-";
  const [local, domain] = [value.slice(0, value.lastIndexOf("@")), value.slice(value.lastIndexOf("@") + 1)];
  const dot = domain.lastIndexOf("."), name = dot > 0 ? domain.slice(0, dot) : domain, tld = dot > 0 ? domain.slice(dot) : "";
  return `${local.slice(0, Math.min(2, Math.max(local.length - 1, 1)))}***@${name.slice(0, Math.min(2, Math.max(name.length - 1, 1)))}***${tld}`;
}
/** 전화 가리기: "01012345678" → "010-****-5678". */
export function maskPhone(value: unknown): string {
  const d = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if (!d) return "-";
  return d.length >= 8 ? `${d.slice(0, 3)}-****-${d.slice(-4)}` : "****";
}
