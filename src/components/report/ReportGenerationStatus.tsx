"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PUBLICATION_STAGES, ReportStatusView } from "./ReportStatusView";
import { delayedMessage, etaLabel, GENERATION_STAGE_QUEUED, pollDelay, type GenerationProgress } from "./generationProgress";

export const STATUS_POLL_MS = 10_000;
export const STORAGE_RETRY_POLL_MS = 15_000;
/** 진행 중인 refresh가 이 시간을 넘기면 멈춘 것으로 보고 다시 요청한다. 두 번 연속 멈추면 페이지를 다시 연다. */
export const STUCK_REFRESH_MS = 30_000;
/** 진행 상태 요청 하나의 상한. 응답이 없으면 끊고 화면 새로 고침으로 확인한다. */
export const PROGRESS_FETCH_TIMEOUT_MS = 8_000;
/** 진행 상태를 모를 때(주소를 받지 않은 화면)만 쓰는 예전 단계 표시: 경과 시간 기준(초). 마지막 "제본"은 완성된 책 화면이 대신한다. */
const STAGE_AT_SECONDS = [0, 8, 25, 110] as const;
/** 감독이 이 책을 시작하지 않은 채 이만큼 지나면(진행 상태를 모르면 경과 시간만으로) "평소보다 조금 더"로 바꾼다. */
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

/** document·window 이벤트 등록(없는 환경에서는 아무것도 하지 않는다). 해제 함수를 돌려준다. */
function listen(target: "document" | "window", type: string, handler: () => void) {
  const t: EventTarget | undefined = target === "document" ? (typeof document === "undefined" ? undefined : document) : (typeof window === "undefined" ? undefined : window);
  t?.addEventListener?.(type, handler);
  return () => t?.removeEventListener?.(type, handler);
}

export function ReportGenerationStatus({ attention = false, delayed = false, retry = false, reportId, progress: initial }: {
  readonly attention?: boolean; readonly delayed?: boolean; readonly retry?: boolean;
  /** 주면 ⑦ 생성 감독의 실제 상태(/api/reports/<id>/progress, 읽기 전용)를 묻고 그 값으로 단계·지연을 그린다. */
  readonly reportId?: string;
  /** 서버가 이 화면을 그릴 때 읽은 진행 상태(첫 화면). */
  readonly progress?: GenerationProgress;
}) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const pending = useRef<number | null>(null);
  const [progress, setProgress] = useState<GenerationProgress | null>(initial && initial.state !== "unknown" ? initial : null);
  // Only refresh the canonical report route. The worker runs independently.
  // 고정 화면 원인: 예전에는 refresh가 진행 중이면 타이머를 지우고 refresh가 끝나야 새 타이머를 만들었다.
  // 모바일에서 탭이 백그라운드로 가거나 망이 바뀌어 refresh가 끝나지 않으면 다시는 확인하지 않았다.
  // 이제 타이머는 하나로 계속 돌고, 진행 중인 refresh가 STUCK_REFRESH_MS를 넘기면 다시 요청하며, 두 번째로 멈추면 페이지를 다시 연다.
  // 탭이 다시 보이거나(visibilitychange) 뒤로 가기 캐시에서 돌아오거나(pageshow) 망이 돌아오면(online) 바로 확인한다.
  // reportId가 있으면 매번 화면 전체를 다시 그리지 않고 감독 상태만 묻고, 완성·만료·확인 필요로 바뀔 때(또는 묻지 못할 때)만 화면을 새로 그린다.
  useEffect(() => {
    if (attention) return;
    let stuck = 0, inflight: AbortController | null = null;
    const refresh = () => {
      const since = pending.current;
      if (since !== null && Date.now() - since < STUCK_REFRESH_MS) return;
      if (since === null) stuck = 0;
      else if (++stuck >= 2 && typeof location !== "undefined") { location.reload(); return; }
      pending.current = Date.now();
      startTransition(() => router.refresh());
    };
    const ask = async (id: string) => {
      if (inflight) return;
      const controller = new AbortController(); inflight = controller;
      const timeout = setTimeout(() => controller.abort(), PROGRESS_FETCH_TIMEOUT_MS);
      try {
        const r = await fetch(`/api/reports/${encodeURIComponent(id)}/progress`, { cache: "no-store", signal: controller.signal });
        const next = r.ok ? await r.json() as GenerationProgress : null;
        if (!next || next.state === "unknown") { refresh(); return; }
        setProgress(next);
        if (next.state === "ready" || next.state === "expired" || next.state === "attention") refresh();
      } catch { refresh(); } finally { clearTimeout(timeout); inflight = null; }
    };
    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      if (reportId && !retry) void ask(reportId); else refresh();
    };
    // AM 4부: 조회 주기는 3초에서 점점 길게(최대 20초). 탭이 다시 보이거나 망이 돌아오면 처음부터. 주소를 모르는 화면·재시도 화면은 예전 주기.
    let n = 0, timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => { timer = setTimeout(() => { tick(); n++; schedule(); }, reportId && !retry ? pollDelay(n) : retry ? STORAGE_RETRY_POLL_MS : STATUS_POLL_MS); };
    schedule();
    const again = () => { n = 0; if (timer) clearTimeout(timer); tick(); schedule(); };
    const off = [listen("document", "visibilitychange", again), listen("window", "pageshow", again), listen("window", "online", again)];
    return () => { if (timer) clearTimeout(timer); off.forEach(f => f()); inflight?.abort(); };
  }, [router, attention, retry, reportId]);
  useEffect(() => { if (!refreshing) pending.current = null; }, [refreshing]);

  const [elapsed, setElapsed] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (attention || retry) return;
    const start = startedAt();
    const update = () => { const t = Date.now(); setNow(t); setElapsed(Math.floor((t - start) / 1000)); };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [attention, retry]);

  if (retry) return <ReportStatusView state="unavailable" title="리포트 상태를 확인하지 못했습니다" message="잠시 연결이 고르지 않습니다. 이 화면에서 자동으로 다시 확인하고 있습니다." support />;
  if (attention || progress?.state === "attention") return <ReportStatusView state="attention" />;
  // 진행 상태를 알면 그 단계(감독 시작 전 0 · 시작 뒤 2)만 보인다. 모를 때만 예전처럼 경과 시간 기준.
  const stage = progress ? progress.stage : Math.max(Math.min(STAGE_AT_SECONDS.filter(s => elapsed >= s).length - 1, PUBLICATION_STAGES.length - 2), 0);
  const late = progress ? progress.state === "delayed" || (progress.stage === GENERATION_STAGE_QUEUED && elapsed >= LOCAL_DELAY_SECONDS) : elapsed >= LOCAL_DELAY_SECONDS;
  const isDelayed = delayed || late;
  // 다음 시도 시각은 화면이 뜬 뒤(브라우저 시각 기준)에만 붙인다 — 서버·브라우저 첫 화면을 같게 둔다.
  const message = isDelayed && progress?.state === "delayed" && now !== null ? delayedMessage(progress.nextAt, now) : undefined;
  const preview = reportId && (progress?.chapters?.done ?? 0) >= 1 ? <FirstChapterPreview reportId={reportId} done={progress!.chapters!.done} total={progress!.chapters!.total} /> : null;
  return <ReportStatusView state={isDelayed ? "delayed" : "preparing"} stage={stage} message={message} {...(progress?.chapters ? { chapters: progress.chapters } : {})} eta={etaLabel(progress?.etaMs)} preview={preview} />;
}

/** AM 4부 「1장 먼저 읽기」: 1장이 저장되면 버튼, 누르면 결정론 검사 뒤 미리보기(주인만, /preview). 남은 장은 「제본 중」, 완성되면 화면이 책으로 바뀐다. */
function FirstChapterPreview({ reportId, done, total }: { reportId: string; done: number; total: number | null }) {
  const [open, setOpen] = useState(false), [chapter, setChapter] = useState<{ title: string; sections: { heading: string; paragraphs: string[] }[] } | null>(null), [failed, setFailed] = useState(false);
  const load = async () => {
    setOpen(true); if (chapter) return;
    try { const r = await fetch(`/api/reports/${encodeURIComponent(reportId)}/preview`, { cache: "no-store" }); const j = r.ok ? await r.json() as { ok?: boolean; chapter?: typeof chapter } : null; if (j?.ok && j.chapter) setChapter(j.chapter); else setFailed(true); } catch { setFailed(true); }
  };
  // AM 7부(로컬 실화면): 가운데 정렬된 상태 화면 안에서 긴 본문이 가운데로 흘러 읽기 어려웠다 → 미리보기만 왼쪽 정렬·소제목 굵게, 버튼은 단계 줄과 띄운다.
  if (!open) return <p className="mt-5"><button type="button" onClick={() => void load()} data-first-chapter className="underline underline-offset-4">1장 먼저 읽기</button></p>;
  return <section aria-label="1장 먼저 읽기" data-first-chapter-preview className="mt-6 text-left text-[15px] leading-7">
    {chapter ? <><h2 className="text-lg font-semibold">1. {chapter.title}</h2>{chapter.sections.map((s, i) => <div key={i} className="mt-5">{s.heading ? <h3 className="font-semibold">{s.heading}</h3> : null}{s.paragraphs.map((p, j) => <p key={j} className="mt-2">{p}</p>)}</div>)}</> : failed ? <p>1장을 아직 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요.</p> : <p>1장을 펼치고 있어요.</p>}
    <p className="mt-6 text-center">남은 {total ? Math.max(0, total - done) : ""}장은 제본 중이에요. 완성되면 이 화면이 책으로 바뀌어요.</p>
  </section>;
}
