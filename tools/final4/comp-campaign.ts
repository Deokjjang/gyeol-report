/**
 * 보상 이용권 캠페인 지급 도구(최종 A 12). 기본은 dry-run(명단·인원만 출력, 지급 없음).
 *
 *   로컬(기본, 로컬 Supabase 가드):
 *     pnpm exec tsx tools/final4/comp-campaign.ts --cutoff "2026-11-07 00:00" [--campaign v5-relaunch-2026-11] [--a id,id,id]
 *       [--exclude id,id] [--exclude-file ids.txt] [--expect-b 36] [--expect-file b-ids.txt] [--execute --confirm v5-relaunch-2026-11]
 *   운영(배포 명령에서만): --remote — SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY 환경변수로 접속(값은 출력하지 않음). 그 밖의 인자는 같다.
 *
 * - --cutoff: 이 시각 전에 로그인한 모든 계정(auth.users, 가입 동의 미완료 포함)이 B 후보. 오프셋이 없으면 KST. 배포 완료 시각을 넣는다.
 * - 덕짱님 계정(DEFAULT_OWNER_EXCLUDE)과 관리자(ADMIN_USER_IDS 환경변수, 쉼표)를 자동으로 뺀다. 시험 계정: --exclude / --exclude-file(한 줄에 하나, # 주석)로 뺀다.
 * - B 인원이 --expect-b(기본 36)와 다르면 지급하지 않고 명단·차이를 출력한다. 같은 캠페인 id로 다시 실행해도 이미 받은 계정은 건너뛴다.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { adminUserIds, compConfig } from "../../src/lib/ops/config";
import { DEFAULT_A_USERS, DEFAULT_CAMPAIGN, DEFAULT_EXPECT_B, DEFAULT_OWNER_EXCLUDE, runCampaign, type Call } from "./comp-campaign-core";

function args(argv: string[]) {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const [k, inline] = a.slice(2).split("=", 2);
    if (inline !== undefined) out[k] = inline; else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[k] = argv[++i]; else out[k] = true;
  }
  return out;
}
const list = (v: string | true | undefined) => (typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : []);
const fileList = (v: string | true | undefined) => (typeof v === "string" ? readFileSync(v, "utf8").split("\n").map(l => l.replace(/#.*/, "").trim()).filter(Boolean) : []);

async function connect(remote: boolean): Promise<Call> {
  let url: string | undefined, key: string | undefined;
  if (remote) { url = process.env.SUPABASE_URL; key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!url || !key) throw new Error("--remote에는 SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요해요."); console.log(`접속: ${new URL(url).host}(운영)`); }
  else { const { localSupabase } = await import("../../scripts/dev/local"); const s = localSupabase(); url = s.API_URL; key = s.SERVICE_ROLE_KEY; console.log(`접속: ${new URL(url).host}(로컬)`); }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return async (action, data) => { const r = await db.rpc("ops_comp_campaign", { p_action: action, p_data: data }); return r.error ? { ok: false, code: r.error.message.slice(0, 120) } : r.data as Record<string, unknown>; };
}

async function main() {
  const a = args(process.argv.slice(2));
  if (typeof a.cutoff !== "string") { console.error("--cutoff(배포 시각, 예: \"2026-11-07 00:00\")가 필요해요."); process.exit(2); }
  const cfg = compConfig();
  const call = await connect(a.remote === true);
  const r = await runCampaign(call, {
    campaignId: typeof a.campaign === "string" ? a.campaign : DEFAULT_CAMPAIGN, cutoff: a.cutoff,
    a: list(a.a).length ? list(a.a) : [...DEFAULT_A_USERS],
    exclude: [...DEFAULT_OWNER_EXCLUDE.map(userId => ({ userId, reason: "owner" as const })), ...adminUserIds().map(userId => ({ userId, reason: "admin" as const })), ...[...list(a.exclude), ...fileList(a["exclude-file"])].map(userId => ({ userId, reason: "test" as const }))],
    expectB: typeof a["expect-b"] === "string" ? Number(a["expect-b"]) : DEFAULT_EXPECT_B, expectList: a["expect-file"] ? fileList(a["expect-file"]) : null,
    execute: a.execute === true, confirm: typeof a.confirm === "string" ? a.confirm : null,
    aQty: cfg.aQty, bQty: cfg.bQty, products: cfg.products, days: cfg.aDays,
  });
  for (const l of r.lines) console.log(l);
  process.exit(r.ok ? 0 : 2);
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
