"use client";
import { useSyncExternalStore } from "react";
import { META_AVAILABLE_EVENT, META_SETTINGS_EVENT } from "../../lib/analytics/metaConsent";

const subscribe = (notify: () => void) => { window.addEventListener(META_AVAILABLE_EVENT, notify); return () => window.removeEventListener(META_AVAILABLE_EVENT, notify); };
const available = () => document.documentElement.dataset.metaSettings === "available";

// Rendered only where the consent panel can actually open (production origin).
export default function MetaSettingsLink({ className }: { className?: string }) {
  if (!useSyncExternalStore(subscribe, available, () => false)) return null;
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(META_SETTINGS_EVENT))}>광고 설정</button>;
}
