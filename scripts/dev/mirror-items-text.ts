/**
 * 「남이 본 나」 60문항 원문(자가용 · 친구용 + 이름을 채운 예)을 리뷰 폴더 items-120.txt로 쓴다. 외부 호출 0.
 *   pnpm exec tsx scripts/dev/mirror-items-text.ts
 */
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { MIRROR_FACETS, MIRROR_ITEMS, facetIndex } from "../../src/data/mirror/items";
import { friendSentence } from "../../src/lib/mirror/text";

const out: string[] = [
  `「남이 본 나」 60문항 · 자가용 / 친구용 문장 원문 (src/data/mirror/items.ts, version ${[...new Set(MIRROR_ITEMS.map(i => i.version))].join(" · ")})`,
  "친구용은 이름 자리표({이름:은는} 등)를 그대로 두고, 아래 줄에 「민지」 · 「서연」으로 채운 예를 붙였다.",
  "",
];
MIRROR_ITEMS.forEach((item, i) => {
  const f = MIRROR_FACETS[facetIndex(item.facet)];
  out.push(`#${i + 1} ${item.id} · ${f.domain}/${f.name} (A ${f.a} · B ${f.b})`);
  out.push(`  자가  상황: ${item.self.situation}`, `        A: ${item.self.a}`, `        B: ${item.self.b}`);
  out.push(`  친구  상황: ${item.friend.situation}`, `        A: ${item.friend.a}`, `        B: ${item.friend.b}`);
  for (const name of ["민지", "서연"]) { const s = friendSentence(item, name); out.push(`  예(${name}) ${s.situation} → A ${s.a} / B ${s.b}`); }
  out.push("");
});
const path = join(homedir(), "Desktop/gyeol-review/mirror-01/items-120.txt");
writeFileSync(path, out.join("\n").replace(/\n$/, ""));
console.log(path, MIRROR_ITEMS.length);
