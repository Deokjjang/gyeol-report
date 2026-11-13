/**
 * 생성 대기 화면의 진행 상태(v5 최종 2-1 #7). ⑦ 생성 감독이 남긴 실제 상태로만 정한다 — 경과 시간으로 단계를 꾸미지 않는다.
 * - 결제 Book 상태(paid_report_snapshots.status): QUEUED · GENERATING · RETRYING · COMPLETED · FAILED_REQUIRES_ATTENTION · EXPIRED
 * - 감독 상태(book_generation_state, ops 저장소 `ops_generation('state')` 읽기 전용): 시작 여부 · 실패 횟수 · 다음 시도 시각 · phase
 * 화면은 이 값으로만 "준비 중 / 평소보다 오래 / 확인 필요 / 완성"을 고르고, 완성·만료·확인 필요가 되면 화면을 새로 그린다.
 * 이 파일은 순수 함수만 둔다(브라우저·서버 공용). 저장소 읽기는 generationProgressServer.ts.
 */
export type GenerationProgressState = "preparing" | "delayed" | "attention" | "ready" | "expired" | "unknown";
export type GenerationProgress = {
  /** unknown = 확인하지 못함(화면은 그대로 두고 계속 확인한다). */
  readonly state: GenerationProgressState;
  /** PUBLICATION_STAGES 번호. 감독이 이 책을 시작하기 전 0(원국 분석), 시작한 뒤 2(책 집필 — 원국 분석·성향 연결은 시작 직후 끝난다). */
  readonly stage: 0 | 2;
  /** 감독이 미뤄 둔 다음 시도 시각(ISO). 평소보다 오래 걸릴 때만. */
  readonly nextAt: string | null;
  /** HOTFIX-W1 3부 5: 감독이 이 책을 처음 시작한 시각(ISO, 결제·이용권 사용 직후 1분 크론). 지연 안내 기준. */
  readonly since?: string | null;
  /** HOTFIX-W1 3부 5: 자동 환불(이용권 환급) 시간(설정값 AUTO_REFUND_HOURS). 서버가 넣는다. */
  readonly refundHours?: number;
  /** 결제 책인지 이용권 책인지(안내 문구: 환불 / 이용권 돌려주기). */
  readonly origin?: "paid" | "ticket" | null;
};

export const GENERATION_STAGE_QUEUED = 0;
export const GENERATION_STAGE_WRITING = 2;
export const UNKNOWN_PROGRESS: GenerationProgress = { state: "unknown", stage: GENERATION_STAGE_QUEUED, nextAt: null };

/** ops_generation('state')가 돌려주는 행 중 화면에 쓰는 칸(원고·사유·비용은 읽지 않는다). */
export type SupervisorStateRow = { readonly phase?: unknown; readonly failures?: unknown; readonly next_at?: unknown; readonly first_attempt_at?: unknown; readonly origin?: unknown } | null | undefined;

const isoOrNull = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;

export function describeGeneration(status: unknown, supervisor: SupervisorStateRow, opts: { readonly refundHours?: number } = {}): GenerationProgress {
  const begun = typeof supervisor === "object" && supervisor !== null;
  const stage = begun ? GENERATION_STAGE_WRITING : GENERATION_STAGE_QUEUED;
  const failures = begun ? Number(supervisor.failures) || 0 : 0;
  const nextAt = begun ? isoOrNull(supervisor.next_at) : null;
  // HOTFIX-W1 3부 5: 지연 안내에 쓰는 칸(감독 시작 시각·자동 환불 시간·결제/이용권). 감독이 시작했을 때만.
  const extra = begun ? { since: isoOrNull(supervisor.first_attempt_at), ...(opts.refundHours ? { refundHours: opts.refundHours } : {}), origin: supervisor.origin === "paid" || supervisor.origin === "ticket" ? supervisor.origin : null } : {};
  if (status === "COMPLETED") return { state: "ready", stage, nextAt: null };
  if (status === "EXPIRED") return { state: "expired", stage, nextAt: null };
  // 자동 환불 시간 안에 못 만들어 감독이 포기(gave_up)했거나 작업이 확인 필요로 멈춘 경우.
  if (status === "FAILED_REQUIRES_ATTENTION" || (begun && supervisor.phase === "gave_up")) return { state: "attention", stage, nextAt: null };
  // 감독이 시간표대로 미뤄 둔 상태(RETRYING) 또는 앞선 시도가 실패한 뒤 다시 쓰는 중.
  if (status === "RETRYING" || ((status === "QUEUED" || status === "GENERATING") && failures > 0)) return { state: "delayed", stage, nextAt, ...extra };
  if (status === "QUEUED" || status === "GENERATING") return { state: "preparing", stage, nextAt: null, ...extra };
  return UNKNOWN_PROGRESS;
}

/** HOTFIX-W1 3부 5: 감독 시작 뒤 이만큼 지나도 책이 없으면 정직한 지연 안내를 보인다. */
export const DELAY_NOTICE_AFTER_MS = 15 * 60_000;
/** 자동 환불 시간을 못 받았을 때(옛 응답) 쓰는 값 — 서버 기본값과 같다(policy.ts AUTO_REFUND_HOURS_DEFAULT). */
export const DELAY_NOTICE_DEFAULT_HOURS = 6;
/** 지연 안내 문장(만드는 중·평소보다 오래일 때, 감독 시작 15분 뒤부터). 아니면 undefined. */
export function delayNotice(p: GenerationProgress | null | undefined, now: number): string | undefined {
  if (!p || (p.state !== "preparing" && p.state !== "delayed")) return undefined;
  const t = p.since ? Date.parse(p.since) : NaN;
  if (!Number.isFinite(t) || now - t < DELAY_NOTICE_AFTER_MS) return undefined;
  const h = p.refundHours && p.refundHours > 0 ? p.refundHours : DELAY_NOTICE_DEFAULT_HOURS;
  return p.origin === "ticket"
    ? `책을 다듬는 데 시간이 더 걸리고 있어요. 준비되면 서재에 바로 보여요. ${h}시간 안에 못 드리면 쓰신 이용권을 자동으로 돌려드려요.`
    : `책을 다듬는 데 시간이 더 걸리고 있어요. 준비되면 서재에 바로 보여요. ${h}시간 안에 못 드리면 자동으로 환불돼요.`;
}

const KST_TIME = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "numeric", minute: "2-digit" });
/** "평소보다 오래" 안내 문장. 다음 시도 시각이 앞으로 남아 있을 때만 시각을 붙인다(한국 시각, 예: 오후 3:20). */
export function delayedMessage(nextAt: string | null, now = Date.now()): string | undefined {
  const at = nextAt ? Date.parse(nextAt) : NaN;
  if (!Number.isFinite(at) || at <= now) return undefined;
  return `평소보다 조금 더 걸리고 있습니다. ${KST_TIME.format(new Date(at))}쯤 이어서 다시 씁니다. 완성된 리포트를 보여드릴 수 있도록 준비를 이어가고 있습니다.`;
}
