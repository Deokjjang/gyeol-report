import { v5Queue } from "./v5Scenarios";

/** PGlite: 이용권 v5 큐 + P6d-ops migration. 서버 역할(service_role)로 돌려준다. */
export async function opsSql() {
  const h = await v5Queue(); // P6d-ops migration 포함
  const rpc = async (fn: string, ...args: unknown[]) => {
    const params = args.map((_, i) => `$${i + 1}${typeof args[i] === "object" && args[i] !== null ? "::jsonb" : ""}`).join(",");
    return (await h.db.query<{ r: Record<string, unknown> }>(`select ${fn}(${params}) r`, args.map(a => typeof a === "object" && a !== null ? JSON.stringify(a) : a))).rows[0].r;
  };
  return { ...h, rpc };
}
