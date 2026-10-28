"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PUBLICATION_STAGES, ReportStatusView } from "./ReportStatusView";

export const STATUS_POLL_MS = 10_000;
export const STORAGE_RETRY_POLL_MS = 15_000;
/** 진행 중인 refresh가 이 시간을 넘기면 멈춘 것으로 보고 다시 요청한다. */
export const STUCK_REFRESH_MS = 30_000;
/** 단계 표시는 서버 진행 신호가 아니라 경과 시간 기준이다(초). 마지막 "제본"은 완성된 책 화면이 대신한다. */
const STAGE_AT_SECONDS = [0, 8, 25, 110] as const;
const LOCAL_DELAY_SECONDS = 240;

function startedAt(): number {
  try {
    const key = `gyeol:report-status-start:${location.pathname}`;
    const saved = Number(sessionStorage.getItem(key));
    if (Number.isFinite(saved) && saved > 0 && Date.now() - saved < 3_600_000) return saved;
    sessionStorage.setItem(key, String(Date.now()));
  } catch { /* 저장소를 못 쓰면 이 화면을 연 시각부터 센다 */ }
  return Date.now();
}

export function ReportGenerationStatus({ attention = false, delayed = false, retry = false }: { readonly attention?: boolean; readonly delayed?: boolean; readonly retry?: boolean }) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const pending = useRef<number | null>(null);
  // Only refresh the canonical report route. The worker runs independently.
  // 고정 화면 원인: 예전에는 refresh가 진행 중이면 타이머를 지우고 refresh가 끝나야 새 타이머를 만들었다.
  // 모바일에서 탭이 백그라운드로 가거나 망이 바뀌어 refresh가 끝나지 않으면 다시는 확인하지 않았다.
  // 이제 타이머는 하나로 계속 돌고, 진행 중인 refresh가 STUCK_REFRESH_MS를 넘기면 다시 요청한다. 탭이 다시 보이면 바로 확인한다.
  useEffect(() => {
    if (attention) return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      if (pending.current !== null && Date.now() - pending.current < STUCK_REFRESH_MS) return;
      pending.current = Date.now();
      startTransition(() => router.refresh());
    };
    const timer = setInterval(tick, retry ? STORAGE_RETRY_POLL_MS : STATUS_POLL_MS);
    document.addEventListener?.("visibilitychange", tick);
    return () => { clearInterval(timer); document.removeEventListener?.("visibilitychange", tick); };
  }, [router, attention, retry]);
  useEffect(() => { if (!refreshing) pending.current = null; }, [refreshing]);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (attention || retry) return;
    const start = startedAt();
    const update = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [attention, retry]);

  if (retry) return <ReportStatusView state="unavailable" title="리포트 상태를 확인하지 못했습니다" message="잠시 연결이 고르지 않습니다. 이 화면에서 자동으로 다시 확인하고 있습니다. 계속 확인이 어려우시면 고객센터로 문의해 주세요." support />;
  if (attention) return <ReportStatusView state="attention" />;
  const stage = Math.min(STAGE_AT_SECONDS.filter(s => elapsed >= s).length - 1, PUBLICATION_STAGES.length - 2);
  return <ReportStatusView state={delayed || elapsed >= LOCAL_DELAY_SECONDS ? "delayed" : "preparing"} stage={Math.max(stage, 0)} />;
}
