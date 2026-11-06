/**
 * P6e 16: MBTI 장면 씨앗(mbti-seeds 16유형)마다 직업군·상태 태그 ctx를 단다(필수, 빈 배열 = 누구에게나).
 *   pnpm exec tsx tools/p6e/tag-seeds.ts [--check]
 * 규칙은 런타임과 같은 facts.SCENE_TAGS(office·code·team·shop·care). 씨앗을 고를 때 태그가 고객 생활과 맞지 않으면 뽑지 않는다.
 * --check: 태그가 빠졌거나 규칙과 다른 씨앗이 있으면 실패(지식 DB 검사와 같이 돌린다).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { sceneTagsOf } from "@/lib/brief/facts";

const DIR = resolve(import.meta.dirname, "../../src/data/knowledge-v5/mbti-seeds");
const check = process.argv.includes("--check");
let total = 0, tagged = 0, bad = 0; const byTag: Record<string, number> = {};
for (const f of readdirSync(DIR).filter(x => x.endsWith(".json")).sort()) {
  const p = join(DIR, f), d = JSON.parse(readFileSync(p, "utf8")) as { seeds: Record<string, { text: string; ctx?: string[] }[]> };
  for (const list of Object.values(d.seeds)) for (const s of list) {
    total++; const want = sceneTagsOf(s.text);
    if (want.length) { tagged++; for (const t of want) byTag[t] = (byTag[t] ?? 0) + 1; }
    if (check) { if (!s.ctx || s.ctx.join() !== want.join()) { bad++; console.log(`${f} ${s.text} ctx=${JSON.stringify(s.ctx)} want=${JSON.stringify(want)}`); } continue; }
    // 키 순서를 지킨다(id·text·rel·job 다음 ctx).
    const { ctx: _old, ...rest } = s as { ctx?: string[] } & Record<string, unknown>; void _old;
    Object.keys(s).forEach(k => delete (s as Record<string, unknown>)[k]); Object.assign(s, rest, { ctx: want });
  }
  if (!check) writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
}
console.log(`씨앗 ${total}개 · 태그 붙은 씨앗 ${tagged}개 ${JSON.stringify(byTag)}${check ? ` · 어긋남 ${bad}` : ""}`);
if (check && bad) process.exit(1);
