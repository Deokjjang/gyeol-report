import { createHash } from "node:crypto";
import type { AccountIdentity, AccountSession } from "./policy";

// Presentation only. Provision the public ID only after checking the channel
// administrator's profile ID and the existing app's JS SDK configuration.
export function channelOnboarding(user: AccountIdentity | null, session: AccountSession): AccountSession["channelPrompt"] {
  const channelPublicId = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID?.trim();
  if (!user || user.provider !== "kakao" || session.status !== "member"
    || !process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim()
    || !channelPublicId || !/^_[A-Za-z0-9]{2,64}$/.test(channelPublicId)) return undefined;
  return { channelPublicId, scope: createHash("sha256").update(`gyeol-channel-prompt-v1\0${user.id}`).digest("hex") };
}
