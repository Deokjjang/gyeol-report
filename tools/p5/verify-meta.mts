/**
 * 공유·아이콘 메타 점검(P5 #8, 읽기 전용): 홈 HTML의 og:image·apple-touch-icon·manifest·theme-color를 찾고,
 * 각 파일이 200·올바른 형식·크기인지, 파일명에 버전(-v숫자)이 붙었는지 본다. 하나라도 어긋나면 종료 코드 1.
 *   pnpm exec tsx tools/p5/verify-meta.mts [--base http://localhost:3300]
 */
export {};
const base = process.argv.includes("--base") ? process.argv[process.argv.indexOf("--base") + 1] : "http://localhost:3300";
const html = await (await fetch(base + "/")).text();
const attr = (re: RegExp) => [...html.matchAll(re)].map(m => m[1]);
type Row = { item: string; url: string; ok: boolean; detail: string };
const rows: Row[] = [];
const abs = (u: string) => new URL(u.replaceAll("&amp;", "&"), base).toString();
/** PNG IHDR 또는 JPEG SOF에서 크기. */
function size(buf: Buffer): [number, number] | null {
  if (buf.subarray(1, 4).toString() === "PNG") return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  for (let i = 2; i < buf.length - 9;) { if (buf[i] !== 0xff) return null; const m = buf[i + 1], len = buf.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]; i += 2 + len; }
  return null;
}
async function check(item: string, url: string, want?: [number, number]) {
  // 배포 출처(gyeolreport.com)를 가리키는 og:image는 로컬 점검에서 같은 경로를 로컬로 확인한다.
  const local = new URL(new URL(url).pathname, base).toString();
  const r = await fetch(local), buf = Buffer.from(await r.arrayBuffer()), dim = size(buf), versioned = /-v\d+\.[a-z]+$/.test(new URL(url).pathname);
  const ok = r.ok && versioned && (!want || (dim?.[0] === want[0] && dim?.[1] === want[1]));
  rows.push({ item, url, ok, detail: `${r.status} ${r.headers.get("content-type")} ${dim ? dim.join("×") : "-"}${versioned ? "" : " · 버전 없는 파일명"}` });
}
const og = attr(/<meta property="og:image" content="([^"]+)"/g)[0];
if (og) await check("og:image", abs(og), [1200, 630]); else rows.push({ item: "og:image", url: "-", ok: false, detail: "없음" });
const apple = attr(/<link rel="apple-touch-icon" href="([^"]+)"/g)[0];
if (apple) await check("apple-touch-icon", abs(apple), [180, 180]); else rows.push({ item: "apple-touch-icon", url: "-", ok: false, detail: "없음" });
for (const icon of attr(/<link rel="icon" href="([^"]+)"/g).filter(u => !u.includes("favicon.ico"))) await check("icon", abs(icon));
const manifest = attr(/<link rel="manifest" href="([^"]+)"/g)[0];
if (manifest) {
  const r = await fetch(abs(manifest)), m = r.ok ? await r.json() as { icons?: { src: string; sizes: string }[] } : {};
  rows.push({ item: "manifest", url: abs(manifest), ok: r.ok && (m.icons?.length ?? 0) >= 2, detail: `${r.status} 아이콘 ${m.icons?.length ?? 0}개` });
  for (const i of m.icons ?? []) await check(`manifest ${i.sizes}`, abs(i.src), /^\d+x\d+$/.test(i.sizes) ? i.sizes.split("x").map(Number) as [number, number] : undefined);
} else rows.push({ item: "manifest", url: "-", ok: false, detail: "없음" });
const theme = attr(/<meta name="theme-color" (?:media="[^"]*" )?content="([^"]+)"/g);
rows.push({ item: "theme-color", url: "-", ok: theme.length > 0, detail: theme.join(", ") || "없음" });
for (const r of rows) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.item.padEnd(18)} ${r.detail}  ${r.url}`);
process.exit(rows.every(r => r.ok) ? 0 : 1);
