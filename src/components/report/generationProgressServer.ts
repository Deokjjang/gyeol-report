import "server-only";
import { describeGeneration, UNKNOWN_PROGRESS, type GenerationProgress, type SupervisorStateRow } from "./generationProgress";

/** 결제·이용권 Book 주소 형식(report_ + 영숫자). 다른 값은 저장소를 읽지 않는다. */
export const PROGRESS_REPORT_ID = /^report_[a-z0-9]{13,64}$/;

type Store = { call(action: string, data: Record<string, unknown>): Promise<Record<string, unknown>> };
/** 시험 주입용(PGlite 실제 SQL). 운영은 비워 두면 기존 저장소를 만든다. */
export type ProgressStores = { readonly reliability?: Store; readonly generation?: Store };

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
    const { autoRefundHours } = await import("../../lib/ops/generation/policy");
    return describeGeneration(status, supervisor, { refundHours: autoRefundHours() });
  } catch {
    return UNKNOWN_PROGRESS;
  }
}
