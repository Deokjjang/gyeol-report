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
  /** AM 4부: 진짜 진행률(저장된 장 수 / 전체 장 수). 전체를 모르면 total null. 가짜 퍼센트 막대는 쓰지 않는다. */
  readonly chapters?: { readonly done: number; readonly total: number | null; readonly firstReady?: boolean };
  /** AM 4부: 남은 시간(밀리초) = 같은 상품 최근 실측 중앙값 × 남은 장 몫. 실측이 없으면 null(화면이 숨긴다). */
  readonly etaMs?: number | null;
};
/** 남은 시간 문구(분 단위 올림, 1분 미만은 「곧」). */
export function etaLabel(ms: number | null | undefined): string | null {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms < 0) return null;
  return ms < 60_000 ? "곧 완성돼요" : `남은 시간 약 ${Math.ceil(ms / 60_000)}분`;
}
/** 실측 중앙값과 진행 장 수로 남은 시간(밀리초). */
export function etaOf(medianMs: number | null | undefined, done: number, total: number | null): number | null {
  if (!medianMs || medianMs <= 0) return null;
  return total && total > 0 ? Math.round(medianMs * Math.max(0, 1 - done / total)) : medianMs;
}
/** AM 4부 조회 주기: 3초에서 시작해 점점 길게(최대 20초). 탭이 다시 보이면 처음부터. */
export const POLL_STEPS_MS = [3_000, 3_000, 4_000, 5_000, 7_000, 10_000, 15_000, 20_000] as const;
export const pollDelay = (n: number) => POLL_STEPS_MS[Math.min(n, POLL_STEPS_MS.length - 1)];

export const GENERATION_STAGE_QUEUED = 0;
export const GENERATION_STAGE_WRITING = 2;
export const UNKNOWN_PROGRESS: GenerationProgress = { state: "unknown", stage: GENERATION_STAGE_QUEUED, nextAt: null };

/** ops_generation('state')가 돌려주는 행 중 화면에 쓰는 칸(원고·사유·비용은 읽지 않는다). */
export type SupervisorStateRow = { readonly phase?: unknown; readonly failures?: unknown; readonly next_at?: unknown } | null | undefined;

const isoOrNull = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;

export function describeGeneration(status: unknown, supervisor: SupervisorStateRow): GenerationProgress {
  const begun = typeof supervisor === "object" && supervisor !== null;
  const stage = begun ? GENERATION_STAGE_WRITING : GENERATION_STAGE_QUEUED;
  const failures = begun ? Number(supervisor.failures) || 0 : 0;
  const nextAt = begun ? isoOrNull(supervisor.next_at) : null;
  if (status === "COMPLETED") return { state: "ready", stage, nextAt: null };
  if (status === "EXPIRED") return { state: "expired", stage, nextAt: null };
  // 24시간 안에 못 만들어 감독이 포기(gave_up)했거나 작업이 확인 필요로 멈춘 경우.
  if (status === "FAILED_REQUIRES_ATTENTION" || (begun && supervisor.phase === "gave_up")) return { state: "attention", stage, nextAt: null };
  // 감독이 시간표대로 미뤄 둔 상태(RETRYING) 또는 앞선 시도가 실패한 뒤 다시 쓰는 중.
  if (status === "RETRYING" || ((status === "QUEUED" || status === "GENERATING") && failures > 0)) return { state: "delayed", stage, nextAt };
  if (status === "QUEUED" || status === "GENERATING") return { state: "preparing", stage, nextAt: null };
  return UNKNOWN_PROGRESS;
}

const KST_TIME = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "numeric", minute: "2-digit" });
/** "평소보다 오래" 안내 문장. 다음 시도 시각이 앞으로 남아 있을 때만 시각을 붙인다(한국 시각, 예: 오후 3:20). */
export function delayedMessage(nextAt: string | null, now = Date.now()): string | undefined {
  const at = nextAt ? Date.parse(nextAt) : NaN;
  if (!Number.isFinite(at) || at <= now) return undefined;
  return `평소보다 조금 더 걸리고 있습니다. ${KST_TIME.format(new Date(at))}쯤 이어서 다시 씁니다. 완성된 리포트를 보여드릴 수 있도록 준비를 이어가고 있습니다.`;
}
