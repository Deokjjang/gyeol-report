/**
 * 운영 DB 읽기 전용 질의(AM 1부). Supabase CLI `db query --linked`(관리 API)로 SELECT만 보낸다. 결과는 메모리로만 받는다(파일에 쓰지 않는다).
 * - 쓰기·DDL·세션 변경 낱말이 든 질의는 보내기 전에 거절한다.
 * - 연결 정보는 운영 링크 폴더(supabase/.temp, 값은 읽지 않음)를 CLI가 쓴다. 키·토큰은 이 도구가 다루지 않는다.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** 운영 링크 정보가 있는 폴더(메모리 prod-release-workflow: 링크 정보는 원 저장소 supabase/.temp). */
export const PROD_LINK_DIR = process.env.AM_PROD_LINK_DIR ?? "/Users/Deokmin/Dev/projects/gyeol-report";

const WRITE = /\b(insert|update|delete|merge|upsert|alter|drop|create|grant|revoke|truncate|copy|call|do|set|reset|vacuum|analy[sz]e|cluster|reindex|comment|lock|notify|listen|refresh|security|execute|perform|prepare|deallocate|discard|begin|commit|rollback|savepoint)\b/i;

/** SELECT 한 문장만 허용(끝 세미콜론 없음). 함수는 이름으로 막지 못하므로 운영 쓰기 함수 이름도 거른다. */
export function assertReadOnly(sql: string): void {
  const s = sql.replace(/'(?:[^']|'')*'/g, "''").trim();
  if (!/^(select|with)\b/i.test(s)) throw new Error("READ_ONLY: SELECT/WITH만 보낼 수 있다");
  if (s.includes(";")) throw new Error("READ_ONLY: 한 문장만");
  if (WRITE.test(s)) throw new Error(`READ_ONLY: 쓰기 낱말 ${s.match(WRITE)?.[0]}`);
  if (/\b(ops_order|ops_gift|ops_generation|ops_signup|ops_notify|paid_report_reliability|report_tickets|report_coupons|ops_recon|lane_|chapters_save)\s*\(/i.test(s)) throw new Error("READ_ONLY: 상태를 바꾸는 RPC 이름");
}

export function prodQuery<T = Record<string, unknown>>(sql: string): T[] {
  assertReadOnly(sql);
  if (!existsSync(join(PROD_LINK_DIR, "supabase/.temp/project-ref"))) throw new Error("운영 링크 정보 없음");
  const r = spawnSync("supabase", ["db", "query", "--workdir", PROD_LINK_DIR, "--linked", "--output-format", "json", sql], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`운영 질의 실패: ${(r.stderr || r.stdout).split("\n").filter(l => !/new version|recommend/i.test(l)).join(" ").slice(0, 300)}`);
  const start = r.stdout.indexOf("{");
  const parsed = JSON.parse(r.stdout.slice(start)) as { rows?: T[] };
  return parsed.rows ?? [];
}
