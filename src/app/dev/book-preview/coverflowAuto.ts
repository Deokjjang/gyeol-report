export const AUTO_INTERVAL = 6500;
export const AUTO_IDLE = 8500;

/** One cancellable timer. No queued intervals after manual input/hidden tabs. */
export function createCoverflowAuto(advance: () => void, clock = {
  now: () => Date.now(),
  schedule: (fn: () => void, ms: number) => setTimeout(fn, ms),
  cancel: (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
}) {
  let active = false, disposed = false, resumeAt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clear = () => { if (timer !== undefined) clock.cancel(timer); timer = undefined; };
  const arm = () => {
    clear();
    if (!active || disposed) return;
    timer = clock.schedule(() => { timer = undefined; advance(); arm(); }, Math.max(AUTO_INTERVAL, resumeAt - clock.now()));
  };
  return {
    setActive(value: boolean) { if (value === active) return; active = value; arm(); },
    interact() { resumeAt = clock.now() + AUTO_IDLE; arm(); },
    dispose() { disposed = true; clear(); },
  };
}
