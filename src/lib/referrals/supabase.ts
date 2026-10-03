import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import type { ReferralStore, ReferralResult } from "./service";
export function createReferralStore(): ReferralStore {
  const db = createSupabaseServerClient();
  return { async call(action, user, data = {}) {
    const result = await db.rpc("book_referrals", { p_action: action, p_user: user, p_data: data });
    return !result.error && result.data?.ok === true ? result.data as ReferralResult : { ok: false };
  } };
}
