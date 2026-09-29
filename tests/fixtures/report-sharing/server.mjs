// Local-only Supabase HTTP fixture for the real Next.js sharing routes.
// Generate synthetic snapshots with SHARE_QA_DIR and reportSharing.test.tsx first.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
const fixtureDir = process.env.SHARE_QA_DIR;
if (!fixtureDir) throw new Error("SHARE_QA_DIR is required");
const snapshots = Object.values(JSON.parse(readFileSync(fixtureDir + "/snapshots.json", "utf8")));
const links = new Map(snapshots.map((snapshot, i) => [snapshot.reportId, {
  report_id: snapshot.reportId, token: "gr_" + String.fromCharCode(97 + i).repeat(32), revoked_at: null,
}]));
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:3140");
  let body = "";
  for await (const chunk of req) body += chunk;
  const payload = body ? JSON.parse(body) : {};
  if (req.method === "DELETE" && url.pathname === "/fixture-link") {
    links.delete(url.searchParams.get("report"));
    res.writeHead(204); res.end(); return;
  }
  let data = null;
  if (url.pathname === "/rest/v1/rpc/paid_report_reliability") {
    const snapshot = snapshots.find(s => s.reportId === payload.p_data?.reportId);
    data = payload.p_action === "read_report" && snapshot
      ? { ok: true, status: "COMPLETED", expiresAt: "2099-01-01T00:00:00Z", snapshot }
      : { ok: false, code: "REPORT_NOT_FOUND" };
  } else if (url.pathname === "/rest/v1/report_share_links") {
    if (req.method === "POST") {
      if (!links.has(payload.report_id)) links.set(payload.report_id, { ...payload, revoked_at: null });
      res.writeHead(201, { "Content-Type": "application/json" }); res.end(); return;
    }
    const id = url.searchParams.get("report_id")?.slice(3);
    const token = url.searchParams.get("token")?.slice(3);
    const found = [...links.values()].find(row => id ? row.report_id === id : row.token === token);
    data = found ? [found] : [];
  } else if (url.pathname === "/fixtures") {
    data = [...links.values()].map(row => ({ report: "/reports/" + row.report_id, share: "/r/" + row.token }));
  } else {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(data));
});
server.listen(3140, "127.0.0.1", () => console.log("Local-only sharing fixture: http://127.0.0.1:3140/fixtures"));
