export class ExternalCallTimeout extends Error {
  constructor() { super("EXTERNAL_CALL_TIMEOUT"); this.name = "ExternalCallTimeout"; }
}

// The deadline includes consuming the response body, not just receiving headers.
// Racing also bounds transports that ignore AbortSignal (including test doubles).
export async function withDeadline<T>(operation: (signal: AbortSignal) => Promise<T>, timeoutMs: number, parent?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abortParent: (() => void) | undefined;
  try {
    return await Promise.race([
      new Promise<never>((_, reject) => {
        const abort = () => { reject(new ExternalCallTimeout()); controller.abort(); };
        abortParent = abort;
        if (parent?.aborted) { abort(); return; }
        parent?.addEventListener("abort", abort, { once: true });
        timer = setTimeout(abort, timeoutMs);
      }),
      Promise.resolve().then(() => {
        if (controller.signal.aborted) throw new ExternalCallTimeout();
        return operation(controller.signal);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    if (abortParent) parent?.removeEventListener("abort", abortParent);
  }
}
