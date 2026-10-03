"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GUEST_SESSION, type AccountSession } from "../../lib/account/policy";

export function announceAccountChange() {
  if (typeof BroadcastChannel !== "undefined") { const channel = new BroadcastChannel("gyeol-account"); channel.postMessage("refresh"); channel.close(); }
}
export function useAccountSession(local: boolean, enabled = true) {
  const [session, setSession] = useState<AccountSession>(GUEST_SESSION), [loaded, setLoaded] = useState(false), [error, setError] = useState(false);
  const current = useRef<AbortController | null>(null);
  const base = local ? "/dev/account/api" : "/auth";
  const refresh = useCallback(() => {
    if (!enabled) return;
    current.current?.abort(); const controller = new AbortController(); current.current = controller;
    return fetch(`${base}/session`, { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok || !["guest", "needs_consent", "member"].includes(data.status)) { setSession(GUEST_SESSION); setError(true); }
      else { setSession(data); setError(false); }
      setLoaded(true);
    }).catch(() => { if (!controller.signal.aborted) { setSession(GUEST_SESSION); setError(true); setLoaded(true); } });
  }, [base, enabled]);
  useEffect(() => {
    if (!enabled) return;
    void refresh();
    const update = () => { if (!document.hidden) void refresh(); };
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("gyeol-account");
    // Broadcast is only a refresh hint; it cannot supply an identity or a role.
    if (channel) channel.onmessage = update;
    window.addEventListener("focus", update); document.addEventListener("visibilitychange", update);
    const timer = window.setInterval(update, 60_000);
    return () => { current.current?.abort(); channel?.close(); clearInterval(timer); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); };
  }, [enabled, refresh]);
  return { session, loaded, error, refresh, base };
}
export function AccountEntry({ local = false }: { local?: boolean }) {
  const { session, loaded } = useAccountSession(local);
  return <Link href={local ? "/dev/account" : session.status === "guest" ? "/login" : "/account"}>{loaded && session.status === "member" ? "내 서재" : "로그인"}</Link>;
}
