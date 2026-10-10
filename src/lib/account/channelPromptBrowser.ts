import type { KakaoSdk } from "../sharing/shareBrowser";

const dismissed = new Set<string>();
export function channelPreferenceKey(scope: string) { return `gyeol-channel-prompt-v1:${scope}`; }
export function channelPromptDismissed(scope: string): boolean {
  try { return dismissed.has(scope) || localStorage.getItem(channelPreferenceKey(scope)) !== null; }
  catch { return dismissed.has(scope); }
}
export function rememberChannelPrompt(scope: string, choice: "later" | "add_clicked") {
  dismissed.add(scope);
  try { localStorage.setItem(channelPreferenceKey(scope), choice); } catch { /* Per-tab fallback; never a membership or reward record. */ }
}

export function requestKakaoChannel(sdk: KakaoSdk | undefined, channelPublicId: string, browser: Pick<Window, "open">): "requested" | "blocked" | "unavailable" | "failed" {
  if (!sdk?.Channel) return "unavailable";
  // SDK 2.8.3 addChannel returns void, even when its desktop window.open is
  // blocked. Observe only this synchronous gesture, and always restore open.
  const original = browser.open;
  let blocked = false;
  try {
    if (!sdk.isInitialized()) return "unavailable";
    browser.open = function (...args: Parameters<Window["open"]>) {
      const popup = original.apply(browser, args);
      if (!popup) blocked = true;
      return popup;
    };
    sdk.Channel.addChannel({ channelPublicId });
    return blocked ? "blocked" : "requested";
  } catch { return "failed"; }
  finally { browser.open = original; }
}
