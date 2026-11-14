import "server-only";
import { describeGeneration, etaOf, UNKNOWN_PROGRESS, type GenerationProgress, type SupervisorStateRow } from "./generationProgress";

/** 결제·이용권 Book 주소 형식(report_ + 영숫자). 다른 값은 저장소를 읽지 않는다. */
export const PROGRESS_REPORT_ID = /^report_[a-z0-9]{13,64}$/;

type Store = { call(action: string, data: Record<string, unknown>): Promise<Record<string, unknown>> };
/** 시험 주입용(PGlite 실제 SQL). 운영은 비워 두면 기존 저장소를 만든다. */
export type ProgressStores = { readonly reliability?: Store; readonly generation?: Store; readonly progress?: Store };

/**
 * 생성 대기 화면용 진행 상태를 읽는다(읽기 전용, v5 최종 2-1 #7).
 * - Book 상태: 결제 신뢰성 저장소 read_report(상태만 쓰고 원고는 돌려주지 않는다). 이미 읽은 상태가 있으면 그대로 쓴다.
 * - 감독 상태: ops 저장소 ops_generation('state') — supervisor.ts가 book_generation_state에 남긴 행.
 * 어느 쪽이든 읽지 못하면 unknown(화면은 그대로, 계속 확인)으로 돌려준다. 예외를 밖으로 내지 않는다.
 */
export async function readGenerationProgress(reportId: string, knownStatus?: string, stores: ProgressStores = {}): Promise<GenerationProgress> {
  if (!PROGRESS_REPORT_ID.test(reportId)) return UNKNOWN_PROGRESS;
  try {
    let status = knownStatus;
    if (status === undefined) {
      const reliability = stores.reliability ?? (await import("../../lib/payment/paidReportReliabilityStore")).createPaidReportReliabilityStore();
      const read = await reliability.call("read_report", { reportId });
      if (!read.ok || typeof read.status !== "string") return UNKNOWN_PROGRESS;
      status = read.status;
    }
    if (status === "COMPLETED" || status === "EXPIRED") return describeGeneration(status, null);
    let supervisor: SupervisorStateRow = null;
    try {
      const generation = stores.generation ?? (await import("../../lib/ops/store")).createOpsStores().generation;
      const r = await generation.call("state", { reportId });
      if (r.ok === true && r.state && typeof r.state === "object") supervisor = r.state as SupervisorStateRow;
    } catch { /* 감독 상태를 못 읽으면 Book 상태만으로 정한다 */ }
    // HOTFIX-W1 3부 5: 자동 환불 시간(설정값)을 화면에 넘긴다.
    const { autoRefundHours } = await import("../../lib/ops/config");
    const base = describeGeneration(status, supervisor, { refundHours: autoRefundHours() });
    // AM 4부: 진짜 진행률·남은 시간(읽기 전용 am_writer_progress, 원고 본문은 여기서 내보내지 않는다).
    try {
      const progress = stores.progress ?? (await import("../../lib/ops/store")).createOpsStores().progress;
      const p = await progress.call("read", { reportId });
      if (p.ok === true) { const done = Number(p.done) || 0, total = typeof p.total === "number" ? p.total : null;
        // AM2: 세운·대운은 장 묶음을 병렬로 써서 1장보다 다른 장이 먼저 저장될 수 있다 → 「1장 먼저 읽기」는 1장 미리보기가 있을 때만(본문은 보내지 않는다).
        return { ...base, chapters: { done, total, firstReady: Boolean(p.first) }, etaMs: etaOf(typeof p.medianMs === "number" ? p.medianMs : null, done, total) }; }
    } catch { /* 진행률을 못 읽으면 단계만 */ }
    return base;
  } catch {
    return UNKNOWN_PROGRESS;
  }
}
