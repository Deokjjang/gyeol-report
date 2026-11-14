/**
 * AM2-6 가치 지표의 결정론 몫(호출 0) — am2-5-value와 같은 칸 + 「같은 틀 문장은 장에서 처음 2번만 이 사람만의 문장으로 센다」(덕짱님 지시 1부).
 * 틀: 고리 낌새 문장(자리 뜻 말 + 입력 말)을 관계 이름 · 자리 · 달 이름을 가린 꼴로 줄여, 3글자 창 자카드 0.7 이상이면 같은 틀이다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-value.ts <case> <snapshot.json> [<snapshot.json> …]
 */
import { readFileSync } from "node:fs";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { stripHanja } from "../../src/lib/writer/safety/p6e";
import { intakeOf } from "./am2-brief";
import { payloadFor } from "./am2-6-books";

const [id, ...paths] = process.argv.slice(2);
const { brief, intake } = intakeOf(payloadFor(id));
const keys = intake.chapters.flatMap(ch => ch.keys ?? []);
const mbti = brief.mbti?.type;
const rels = [...new Set((brief.timeline?.entries ?? []).flatMap(e => e.badges.map(b => b.label.replace(/\(반쯤\)$/, "").trim())))].sort((a, b) => b.length - a.length);
const SEAT = /가까운 사람|일터|사회생활|윗사람|바깥 모임|배우자|연인|자녀|혼자 쓰는 시간|내 생활|퇴근|태어난 (해|달|날|시각) 자리/;
const INPUT = /솔로|직장|회사|프리랜서|사업|자영업|취업|연애 중|기혼|바람|«|학생|살림/;
const SCENE = /(할|하는|한|될|볼|날|때)(\s?때|\s?날이라면|\s?순간)|처럼|듯(이)?\s|라면,/;
const skel = (s: string) => s.replace(new RegExp(rels.map(r => r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") || "$^", "g"), "〈관계〉").replace(/태어난 (해|달|날|시각)/g, "〈자리〉").replace(/(?:20\d\d년 )?(?:1[0-2]|[1-9])월 · [가-힣]{2}월|20\d\d년(?: [가-힣]{2}년)?/g, "〈때〉").replace(/[^가-힣〈〉]/g, "");
const tri = (t: string) => { const o = new Set<string>(); for (let i = 0; i + 3 <= t.length; i++) o.add(t.slice(i, i + 3)); return o; };
const same = (a: string, b: string) => { const A = tri(a), B = tri(b); let n = 0; for (const w of A) if (B.has(w)) n++; return A.size + B.size > 0 && n / (A.size + B.size - n) >= 0.7; };
const rows = paths.map(p => {
  const snap = JSON.parse(readFileSync(p, "utf8")) as { draft: { chapters: { keys?: string[]; sections: { heading: string; paragraphs: string[] }[] }[] } };
  const ch = snap.draft.chapters.find(x => x.keys)!; const seen: { sk: string; n: number }[] = [];
  return keys.map(k => {
    const sec = ch.sections.find(s => s.heading === k.key);
    const head = stripHanja(k.head).text.replace(/[^가-힣]/g, "");
    const sents = (sec?.paragraphs ?? []).flatMap(t => splitSentences(stripHanja(t).text)).filter(s => s.replace(/[^가-힣]/g, "") !== head);
    const link = sents.filter(s => SEAT.test(s) && INPUT.test(s));
    // 틀 셈: 이 key의 고리 낌새 문장 가운데 장에서 같은 틀이 세 번째 이상이면 「이 사람만의 문장」으로 세지 않는다.
    // 틀 갈래(검사 link_template과 같은 셈): 「X이 닿는 태어난 Y 자리」 · 「…인 당신에게는 … 쪽이 움직이는 때」 · 그 밖은 이름을 가린 꼴의 닮음.
    const fam = (s: string) => (/닿/.test(s) && /태어난 (해|달|날|시각) 자리/.test(s) ? "닿는 자리" : /(인|한|은) 당신(에게는|의) [^.?!]{0,30}(쪽|사이)(이|가)? (다시 )?움직이/.test(s) ? "당신 쪽이 움직이는 때" : /같은 자리라/.test(s) ? "같은 자리라" : null);
    let own = 0; for (const s of link) { const f = fam(s), sk = f ?? skel(s), hit = seen.find(x => (f ? x.sk === f : same(x.sk, sk))); if (hit) { hit.n++; if (hit.n <= 2) own++; } else { seen.push({ sk, n: 1 }); own++; } }
    return { len: sents.join(" ").length, mbti: mbti ? sents.filter(s => s.includes(mbti)).length : 0, link: link.length, own, scene: sents.filter(s => SCENE.test(s)).length };
  });
});
const label = (p: string) => p.split("/").at(-2) ?? p;
console.log(`| key | ${paths.map(p => `${label(p)} 길이 · MBTI · 고리 낌새(틀 셈 뒤) · 장면 낌새`).join(" | ")} |`);
console.log(`|---|${paths.map(() => "---").join("|")}|`);
keys.forEach((k, i) => console.log(`| ${k.label} | ${rows.map(r => `${r[i].len} · ${r[i].mbti} · ${r[i].link}(${r[i].own}) · ${r[i].scene}`).join(" | ")} |`));
console.log(`| **합·평균** | ${rows.map(r => `평균 ${Math.round(r.reduce((a, x) => a + x.len, 0) / r.length)}(최소 ${Math.min(...r.map(x => x.len))}) · MBTI key ${r.filter(x => x.mbti).length} · 고리 낌새 key ${r.filter(x => x.link).length} → 틀 셈 뒤 ${r.filter(x => x.own).length} · 장면 낌새 key ${r.filter(x => x.scene).length}`).join(" | ")} |`);
