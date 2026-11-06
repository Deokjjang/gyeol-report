/**
 * P 측정용: next build/start가 읽는 .env.production.local(로컬 Supabase 값만, .gitignore)을 대상 worktree에 쓴다.
 *   pnpm exec tsx tools/perf/env.ts <worktree 경로...>
 * 로컬 가드(scripts/dev/local.ts assertLocal)가 Supabase 주소가 로컬이 아니면 중단한다. 운영 키는 쓰지 않는다.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { localSupabase } from "../../scripts/dev/local";

const s = localSupabase();
const lines = [
  `NEXT_PUBLIC_SUPABASE_URL=${s.API_URL}`, `SUPABASE_URL=${s.API_URL}`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${s.ANON_KEY}`, `SUPABASE_SERVICE_ROLE_KEY=${s.SERVICE_ROLE_KEY}`,
  "CRON_SECRET=local-perf-cron", "WRITER_V5_PRODUCTS=saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility", "GIFT_EVENT_ENABLED=1", "PAID_REPORT_RELIABILITY_ENABLED=1",
];
for (const dir of process.argv.slice(2)) { writeFileSync(join(dir, ".env.production.local"), lines.join("\n") + "\n"); console.log("written", dir); }
