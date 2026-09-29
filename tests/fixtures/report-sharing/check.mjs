import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const base = process.env.SHARE_QA_BASE ?? "http://localhost:3141";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)) throw new Error("Local verification only");
const names = ["종합", "직업·재물·학업", "연애·결혼·자녀", "궁합", "대운", "세운"];
const uas = ["kakaotalk-scrap/1.0", "facebookexternalhit/1.1", "Twitterbot/1.0"];
for (let i = 0; i < names.length; i++) {
  const token = "gr_" + String.fromCharCode(97 + i).repeat(32);
  for (const ua of uas) {
    const response = await fetch(base + "/r/" + token, { headers: { "User-Agent": ua } });
    assert.equal(response.status, 200);
    const html = await response.text();
    const head = html.split("</head>")[0];
    assert(head.includes('property="og:title" content="가온님의 ' + names[i] + ' 리포트"'));
    assert(head.includes('property="og:url" content="https://gyeolreport.com/r/' + token + '"'));
    assert(head.includes('property="og:image" content="https://gyeolreport.com/brand/gyeol-report-og.png"'));
    assert(head.includes('name="robots" content="noindex, nofollow'));
    assert(head.includes('name="twitter:card" content="summary_large_image"'));
    assert(!/1992-|ENTJ|report_sharefixture_|evidencePacket|paymentKey/.test(head));
    assert(html.includes("나도 내 리포트 보기"));
  }
}
const image = await fetch(base + "/brand/gyeol-report-og.png");
assert.equal(image.status, 200);
assert(image.headers.get("content-type")?.includes("image/png"));
const digest = data => createHash("sha256").update(data).digest("hex");
assert.equal(digest(Buffer.from(await image.arrayBuffer())), digest(readFileSync("public/brand/gyeol-report-og.png")));
for (const path of ["/favicon.ico", "/icon.svg", "/apple-icon.png"]) assert.equal((await fetch(base + path)).status, 200);
const invalid = await (await fetch(base + "/r/gr_" + "z".repeat(32))).text();
assert(invalid.includes("리포트를 열 수 없습니다"));
assert(invalid.split("</head>")[0].includes("noindex"));
console.log("PASS: 6 products × 3 crawlers, initial HTML OG/Twitter/privacy, static image bytes, 3 icons, invalid-link noindex");
