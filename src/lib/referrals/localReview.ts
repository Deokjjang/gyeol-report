import "server-only";
import { readFile } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import type { NextRequest } from "next/server";
import type { AccountPort } from "../account/handler";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity } from "../account/policy";
import { localBookShareDatabase } from "../book/shareLocalReview";
import { localTicketUserId } from "../tickets/localDatabase";
import { withReferralAccount, type ReferralStore, type ReferralResult } from "./service";

export const REFERRAL_MIGRATION = "supabase/migrations/20261003143822_v4_friend_referrals.sql";
export async function installLocalReferralSchema(db: PGlite) {
  // auth.users.created_at exists in Supabase; the earlier minimal PGlite stub lacks it.
  await db.exec("alter table auth.users add column if not exists created_at timestamptz not null default clock_timestamp()");
  await db.exec(await readFile(REFERRAL_MIGRATION, "utf8"));
}
export function sqlReferralStore(db: PGlite): ReferralStore {
  return { async call(action, user, data = {}) {
    return db.transaction(async tx => {
      await tx.exec("set local role service_role");
      return (await tx.query<{ result: ReferralResult }>("select public.book_referrals($1,$2,$3::jsonb) result", [action,user,JSON.stringify(data)])).rows[0].result;
    });
  } };
}
const root = globalThis as typeof globalThis & { __referralReviewSchema?: Promise<PGlite | null> };
export async function localReferralDatabase() {
  if (!["development", "test"].includes(process.env.NODE_ENV)) return null;
  return root.__referralReviewSchema ??= (async () => {
    const db = await localBookShareDatabase(); if (!db) return null;
    await installLocalReferralSchema(db); return db;
  })();
}
export async function localReferralStore(): Promise<ReferralStore | null> {
  const db = await localReferralDatabase(); if (!db) return null;
  const sql = sqlReferralStore(db);
  return { call: (action, user, data) => sql.call(action, user ? localTicketUserId(user) : null, data) };
}
export async function localReferralAccount(request: NextRequest, auth: AccountPort): Promise<AccountPort> {
  const db = await localReferralDatabase(), store = await localReferralStore();
  if (!db || !store) return auth;
  const syncIdentity = async (user: AccountIdentity) => {
    if (!user.createdAt) return;
    await db.query("insert into auth.users(id,created_at) values($1,$2) on conflict do nothing", [localTicketUserId(user.id),user.createdAt]);
  };
  const mirrored: AccountPort = { ...auth,
    async currentUser() { const user = await auth.currentUser(); if(user) await syncIdentity(user); return user; },
    async read(user) { await syncIdentity(user); return auth.read(user); },
    async consent(user, id, source) {
      const ok = await auth.consent(user,id,source); if (!ok) return false;
      await syncIdentity(user);
      return (await db.query<{ ok: boolean }>("select record_account_consent($1,$2,$3,$4,$5,$6::jsonb) ok", [localTicketUserId(user.id),id,user.displayName,user.provider,source,
        JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type,document_version]) => ({consent_type,document_version,is_agreed:true,required:true})))])).rows[0].ok;
    },
  };
  return withReferralAccount(request, mirrored, store, true);
}
