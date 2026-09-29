import { SHARE_IMAGE, type ReportShareData } from "./reportShareMetadata";

export type KakaoSdk = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(card: ReturnType<typeof kakaoShareCard>): void };
};

export function kakaoShareCard(data: ReportShareData) {
  const link = { mobileWebUrl: data.url, webUrl: data.url };
  return {
    objectType: "feed" as const,
    content: { title: data.title, description: data.description, imageUrl: SHARE_IMAGE,
      imageWidth: 1536, imageHeight: 1024, link },
    buttons: [{ title: "리포트 보기", link }],
  };
}

export async function copyShareLink(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard) { await navigator.clipboard.writeText(url); return true; }
  } catch { /* Continue to selection-based copy, then manual link selection. */ }
  const field = document.createElement("textarea");
  field.value = url;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;left:-9999px;top:0";
  const focused = document.activeElement;
  document.body.appendChild(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch { /* Manual fallback in the UI. */ }
  field.remove();
  if (focused instanceof HTMLElement) focused.focus();
  return copied;
}

export async function nativeShare(data: ReportShareData): Promise<"shared" | "cancelled" | "fallback"> {
  if (!navigator.share) return "fallback";
  try {
    await navigator.share({ title: data.title, text: data.description, url: data.url });
    return "shared";
  } catch (error) {
    return error && typeof error === "object" && "name" in error && error.name === "AbortError"
      ? "cancelled" : "fallback";
  }
}
