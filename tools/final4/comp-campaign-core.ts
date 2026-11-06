/**
 * 보상 이용권 캠페인(최종 A 12) — 명단 확인(dry-run)과 지급의 공용 부분. 저장소 호출(call)은 밖에서 넣는다(로컬 Supabase·PGlite 시험).
 * 규칙: A = 지정 계정(기본 3개, 2장씩), B = 기준 시각(cutoff, 배포 완료 시각) 전에 로그인한 모든 계정(auth.users, 가입 동의 미완료 포함·익명/삭제 제외)
 *   − A − 덕짱님 계정 − 관리자(ADMIN_USER_IDS) − 시험 계정(목록) (1장씩). 배포 명령 0-4.
 * 캠페인 id + 계정 = 한 번(다시 실행해도 두 번 주지 않음). B 인원이 기대값과 다르면 지급하지 않는다. 실행은 --execute --confirm <캠페인 id>.
 * 이용권: 받은 날부터 30일, 장마다 내가 쓰기 또는 선물 1회(선물해도 기한 그대로), 이용권으로 만든 리포트는 환불 없음(오류 시 다시 만들어 드림).
 */
import { parseEventInstant } from "../../src/lib/ops/config";

export const DEFAULT_CAMPAIGN = "v5-relaunch-2026-11";
export const DEFAULT_A_USERS = ["f6122631-f85f-4144-ba5a-53c9af251e92", "35c222b2-8e88-45df-839b-581ab1340e13", "67db6b1f-e633-4b47-bf14-1ceea9dba6e7"] as const;
export const DEFAULT_EXPECT_B = 36;
/** 늘 빼는 계정: 덕짱님 계정(배포 명령 0-4). ADMIN_USER_IDS는 도구가 env에서 따로 뺀다. */
export const DEFAULT_OWNER_EXCLUDE = ["3b35f970-2cfa-4520-b4fc-4b75c7aa69c6"] as const;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type Call = (action: string, data: Record<string, unknown>) => Promise<Record<string, unknown>>;
export type RosterRow = { userId: string; joinedAt: string | null; email: string | null; granted: boolean; exists?: boolean; signedUp?: boolean };
export type CampaignOptions = {
  campaignId: string; cutoff: string; a: readonly string[];
  exclude: readonly { userId: string; reason: "admin" | "test" | "owner" }[];
  expectB: number; expectList?: readonly string[] | null;
  execute: boolean; confirm?: string | null;
  aQty: number; bQty: number; products: readonly string[]; days: number;
};
export type CampaignResult = { ok: boolean; code: string; granted?: number; already?: number; bCount?: number; lines: string[] };

export const maskEmail = (e: string | null | undefined) => {
  if (!e || !e.includes("@")) return "-";
  const [name, domain] = e.split("@");
  return `${name.slice(0, 2)}${"*".repeat(Math.max(1, Math.min(6, name.length - 2)))}@${domain}`;
};
const kst = (iso: string | null) => (iso ? new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ") : "-");

/** 인자 검사: 잘못된 계정 id·캠페인 id·기준 시각은 호출 전에 막는다. cutoff는 오프셋이 없으면 KST. */
export function normalizeOptions(o: CampaignOptions): { ok: true; value: CampaignOptions } | { ok: false; code: string } {
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(o.campaignId)) return { ok: false, code: "CAMPAIGN_INVALID" };
  const cutoffMs = parseEventInstant(o.cutoff, "start");
  if (!Number.isFinite(cutoffMs)) return { ok: false, code: "CUTOFF_INVALID" };
  if ([...o.a, ...o.exclude.map(x => x.userId), ...(o.expectList ?? [])].some(id => !UUID.test(id))) return { ok: false, code: "USER_ID_INVALID" };
  if (!Number.isInteger(o.expectB) || o.expectB < 0) return { ok: false, code: "EXPECT_INVALID" };
  return { ok: true, value: { ...o, cutoff: new Date(cutoffMs).toISOString(), a: [...new Set(o.a.map(x => x.toLowerCase()))] } };
}

export async function runCampaign(call: Call, input: CampaignOptions): Promise<CampaignResult> {
  const lines: string[] = [], say = (l = "") => lines.push(l);
  const checked = normalizeOptions(input);
  if (!checked.ok) { say(`중단: 인자 오류 ${checked.code}`); return { ok: false, code: checked.code, lines }; }
  const o = checked.value, exclude = [...new Map(o.exclude.map(x => [x.userId.toLowerCase(), x])).values()];
  const base = { campaignId: o.campaignId, cutoff: o.cutoff, a: o.a, exclude: exclude.map(x => x.userId) };
  const roster = await call("roster", base);
  if (roster.ok !== true) { say(`중단: 명단을 읽지 못했어요(${String(roster.code ?? "STORAGE_FAILED")})`); return { ok: false, code: String(roster.code ?? "STORAGE_FAILED"), lines }; }
  const A = (roster.a ?? []) as RosterRow[], B = (roster.b ?? []) as RosterRow[], X = (roster.excluded ?? []) as RosterRow[];
  const reason = new Map(exclude.map(x => [x.userId, x.reason]));
  say(`캠페인 ${o.campaignId} · 기준 시각(이 시각 전 가입) ${kst(o.cutoff)} KST · 이용권 A ${o.aQty}장 / B ${o.bQty}장 · ${o.days}일 · 상품 ${o.products.join(",")}`);
  say(`A ${A.length}명`);
  A.forEach((r, i) => say(`  A${String(i + 1).padStart(2, "0")} ${r.userId} ${maskEmail(r.email)} 가입 ${kst(r.joinedAt)}${r.exists === false ? " · 계정 없음" : ""}${r.granted ? " · 이미 지급" : ""}`));
  say(`B ${B.length}명(기대 ${o.expectB}명, 가입 동의 미완료 ${B.filter(r => r.signedUp === false).length}명 포함)`);
  B.forEach((r, i) => say(`  B${String(i + 1).padStart(2, "0")} ${r.userId} ${maskEmail(r.email)} 첫 로그인 ${kst(r.joinedAt)}${r.signedUp === false ? " · 가입 동의 미완료" : ""}${r.granted ? " · 이미 지급" : ""}`));
  say(`제외 ${X.length}명(기준 시각 전 가입자 중)`);
  X.forEach(r => say(`  - ${r.userId} ${maskEmail(r.email)} 첫 로그인 ${kst(r.joinedAt)} · ${reason.get(r.userId) === "admin" ? "관리자(ADMIN_USER_IDS)" : reason.get(r.userId) === "owner" ? "덕짱님 계정" : "시험 계정(목록)"}`));
  if (Number(roster.skipped ?? 0) > 0) say(`익명·삭제 계정 ${Number(roster.skipped)}명(대상 아님)`);
  say(`기준 시각 뒤 첫 로그인 ${Number(roster.joinedAfterCutoff ?? 0)}명(대상 아님)`);
  const missingA = A.filter(r => r.exists === false);
  if (missingA.length) { say(`중단: A 계정 ${missingA.length}개가 없어요 — ${missingA.map(r => r.userId).join(", ")}`); return { ok: false, code: "A_ACCOUNT_MISSING", bCount: B.length, lines }; }
  if (B.length !== o.expectB) {
    say(`중단: B 명단 ${B.length}명 ≠ 기대 ${o.expectB}명 — 지급하지 않습니다.`);
    if (o.expectList) {
      const got = new Set(B.map(r => r.userId)), want = new Set(o.expectList.map(x => x.toLowerCase()));
      say(`  기대 목록에만 있음(명단에서 빠짐): ${[...want].filter(x => !got.has(x)).join(", ") || "없음"}`);
      say(`  명단에만 있음(기대 목록 밖): ${[...got].filter(x => !want.has(x)).join(", ") || "없음"}`);
    } else say("  차이 명단: 위 B·제외 목록과 기준 시각 뒤 가입 수를 비교해 주세요(--expect-file로 기대 목록을 주면 빠진·더한 계정을 바로 보여 줍니다).");
    return { ok: false, code: "B_COUNT_MISMATCH", bCount: B.length, lines };
  }
  const pendingA = A.filter(r => !r.granted).length, pendingB = B.filter(r => !r.granted).length;
  say(`새로 지급할 계정: A ${pendingA} · B ${pendingB} (이미 지급 ${A.length - pendingA + B.length - pendingB})`);
  if (!o.execute) { say(`dry-run: 지급하지 않았습니다. 실행하려면 --execute --confirm ${o.campaignId}`); return { ok: true, code: "DRY_RUN", bCount: B.length, granted: 0, already: A.length - pendingA + B.length - pendingB, lines }; }
  if (o.confirm !== o.campaignId) { say(`중단: --confirm 값이 캠페인 id(${o.campaignId})와 같아야 실행합니다.`); return { ok: false, code: "CONFIRM_MISMATCH", bCount: B.length, lines }; }
  const run = await call("run", { ...base, expectB: o.expectB, confirm: true, aQty: o.aQty, bQty: o.bQty, products: o.products, days: o.days });
  if (run.ok !== true) { say(`중단: 지급하지 않았어요(${String(run.code ?? "STORAGE_FAILED")}${run.actual !== undefined ? `, 실제 B ${String(run.actual)}명` : ""})`); return { ok: false, code: String(run.code ?? "STORAGE_FAILED"), bCount: B.length, lines }; }
  say(`지급 완료: 새로 ${Number(run.granted)}명 · 이미 지급 ${Number(run.already)}명 · 기한 ${kst(String(run.expiresAt))} KST`);
  return { ok: true, code: "GRANTED", granted: Number(run.granted), already: Number(run.already), bCount: Number(run.bCount), lines };
}
