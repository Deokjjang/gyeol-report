/**
 * AM2-13 5부 — 대운 「내 인생이라는 책」 엔진 주장 대조(생성 중 · 결정론 · 호출 0). 세운 검사 묶음(claims.ts · broken.ts · check.ts)에 없는 꼴만 더한다.
 *  chapter_title  장 제목 주장: 본문의 장 제목(표 10개)이 그 문장이 가리키는 장(읽고 있는 장 · 다음 장 · N장)의 제목과 다름.
 *  fill_claim     채움 판정 주장: 판정 말(채움 · 쌓임 · 함께 · 고른 · 나를 돕는)이 가리키는 장의 판정과 다름.
 *  dayun_timing   장 넘김 해 · 교운기: 「다음 장 · 새 대운 · N장이 … YYYY년(N월) 무렵 열린다 · 시작된다」의 해 · 「교운기 YYYY~YYYY」 범위가 엔진과 다름.
 *  age_claim      만 나이: 「만 N~M세」가 평생 지도의 어느 장 나이와도 맞지 않음 · 「YYYY년(만 N세 무렵)」의 N이 출생 연도와 어긋남(±1 밖).
 *  prev_year      해 key의 「앞 해 · 지난해 · 전해 + 관계 이름」이 바로 앞 해 엔진 관계에 없음(세운 prev_month의 해 판).
 *                 + 「이 10년이 끝난 뒤 다음 대운」(10년 창 안에서 열리는 다음 장을 창 뒤로 미룸).
 *  AM2-13 7부(D1 판독 — 측정 중 고침):
 *  fill_claim     + 「채움 판정」 「…로 판정되었습니다」(판정 말 노출) · 장을 가리키는 문장의 「X(나무 · 불 · 흙 · 쇠 · 물)로 채워지 · 더해지 · 쌓이」가 그 장 채움 까닭의 기운과 다름(고른 장은 모두).
 *  memo_leak      + 대운 책 작성 메모: 「솔로로 적혀 있으니」 · 「위치 값으로 보면」 · 「한 번째 해」.
 *  year_list      6장(10년 영역 지도) 본문의 해 목록(해 둘 이상을 늘어놓음) — 해 목록은 화면 표가 맡는다(덕짱님 결정 · 본문 금지).
 * 차단 여부는 four.ts(저장 대운 책 전수 오탐 0만 — am2.md 23절).
 */
import type { FinalChapter } from "../safety";
import type { TimelineEntry } from "@/lib/brief/schema";
import type { MajorPlan } from "@/lib/brief/design/majorBook";
import { CHAPTER_TITLE, FILL_HELP_LABEL, FILL_LABEL } from "@/lib/brief/design/majorBook";
import { relName } from "@/lib/brief/core";
import { splitSentences } from "../safety/patterns";
import type { BlockCtx, ChunkFlag } from "./check";

const TITLES = Object.values(CHAPTER_TITLE);
const FILL_WORDS: readonly (readonly [RegExp, string])[] = [[/부족한 기운을 채워 주는 장/, FILL_LABEL.fill], [/이미 많은 기운이 더 쌓이는 장/, FILL_LABEL.excess], [/채움과 쌓임이 함께 오는 장/, FILL_LABEL.both], [/고른 장/, FILL_LABEL.even], [/나를 돕는 기운을 채워 주는 장/, FILL_HELP_LABEL]];
const NEXT_REF = /다음 장|다음 대운|새 대운|새 장|넘어갈 장|이어질 장/;
const NOW_REF = /읽고 있는 장|이 장(?!면)|지금 장|서 있는 장/;
const YEAR_HEAD = /^(20\d\d)$/;

export function am213MajorFlags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [], P = b.brief?.timeline?.major as MajorPlan | undefined;
  if (!P || b.intake.product !== "major_fortune") return out;
  const entries = (b.brief?.timeline?.entries ?? []) as readonly TimelineEntry[], years = new Map(entries.filter(e => e.kind === "year").map(e => [Number(e.key), e] as const));
  const now = P.chapters.find(c => c.n === P.now), next = P.chapters.find(c => c.n === P.next);
  const birthYear = (now ? now.startYear - now.startAge : 0) || undefined;
  const relNames = [...new Set(entries.flatMap(e => e.badges.map(bd => relName(bd.label))).filter(n => n.length >= 2))].sort((a, c) => c.length - a.length);
  const target = (sen: string) => { const n = /(\d{1,2})장 「/.exec(sen)?.[1]; if (n) return P.chapters.find(c => c.n === Number(n)); return NEXT_REF.test(sen) ? next : NOW_REF.test(sen) ? now : undefined; };
  for (const c of chapters) c.sections.forEach((s, si) => {
    const keyYear = YEAR_HEAD.exec(s.heading)?.[1] ?? /^(20\d\d)년/.exec(s.heading)?.[1];
    s.paragraphs.forEach((p, pi) => splitSentences(p).forEach(sen => {
      const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
      // ---- chapter_title ----
      const said = TITLES.filter(t => sen.includes(t));
      for (const t of said) { const m = new RegExp(`(\\d{1,2})장 「${t}」`).exec(sen), ch = m ? P.chapters.find(x => x.n === Number(m[1])) : said.length === 1 ? target(sen) : undefined; if (ch && ch.title !== t) out.push({ ...at, rule: "chapter_title", detail: `「${t}」 — ${ch.n}장은 「${ch.title}」`, hint: "장 제목은 차례 값 그대로" }); }
      // ---- fill_claim ----
      for (const [re, label] of FILL_WORDS) if (re.test(sen)) { const ch = target(sen) ?? now; if (ch && ch.fill.label !== label && !(label === FILL_LABEL.even && /고른 장(?:이|은|으로)? 아니/.test(sen))) out.push({ ...at, rule: "fill_claim", detail: `「${label}」 — ${ch.n}장 판정 「${ch.fill.label}」`, hint: "채움 판정은 화면 장 머리 상자 값 그대로" }); }
      // 판정 말 노출 · 오행 채움 주장(D1 판독 D1 「채움은 하늘 흙으로 판정되었습니다」 · D4 「불로 채워지는」 · D3 「이미 있는 균형 위에 불이 더해지는 장」 — 셋 다 고른 장).
      if (/채움 판정|(?:으로|로) 판정(?:되었|됐|돼|된)/.test(sen)) out.push({ ...at, rule: "fill_claim", detail: "판정 말 노출", hint: "채움 판정은 화면이 보여 준다 — 뜻만 쓴다" });
      { const ch = (target(sen) ?? (c.id === "next" || c.id === "turn" && NEXT_REF.test(sen) ? next : now));
        for (const m of sen.matchAll(/(나무|불|흙|쇠|물)(?:이|가|을|를|으로|로)? ?(채워|채우|더해지|더해|쌓이|쌓여)/g)) { if (!ch || !/장|기운|오행/.test(sen)) continue;
          const heap = /쌓/.test(m[2]), ok = heap ? new RegExp(`이미 많은 ${m[1]}`).test(ch.fill.why) : new RegExp(`(부족한|나를 돕는) ${m[1]}`).test(ch.fill.why);
          if (!ok) out.push({ ...at, rule: "fill_claim", detail: `「${m[1]} ${m[2]}」 — ${ch.n}장 판정 「${ch.fill.label}」(${ch.fill.why})`, hint: "채움 판정은 화면 장 머리 상자 값 그대로" }); } }
      // 대운 책 작성 메모(D1 판독 D1 「솔로로 적혀 있으니」 · D5 「위치 값으로 보면 … 한 번째 해」). 세운은 broken.ts memo_leak만.
      { const mm = /(?:로|으로|이라고|라고) 적혀 있|위치 값|(?<![가-힣])한 번째 (?:해|달)/.exec(sen.replace(/"[^"]*"|“[^”]*”/g, "")); if (mm) out.push({ ...at, rule: "memo_leak", detail: `작성 메모 「${mm[0]}」` }); }
      // ---- dayun_timing ----
      if (P.turn && NEXT_REF.test(sen) && /(열|시작|바뀌|넘어가|들어서)/.test(sen)) {
        const ys = [...sen.matchAll(/(20\d\d)년(?: (\d{1,2})월)?/g)].filter(m => !/만 \d+세/.test(sen.slice(m.index ?? 0, (m.index ?? 0) + 14)));
        const turnMonth = /(\d{1,2})월/.exec(P.turn.start)?.[1];
        for (const m of ys) { const y = Number(m[1]); if (y >= 2027 && y <= 2036 && y !== P.turn.year && !/교운기|앞뒤|무렵부터 [^.]*까지/.test(sen)) out.push({ ...at, rule: "dayun_timing", detail: `장 넘김 ${y}년 — 엔진 ${P.turn.start}`, hint: "장 넘김 해는 카드 값 그대로" });
          else if (y === P.turn.year && m[2] && turnMonth && m[2] !== turnMonth) out.push({ ...at, rule: "dayun_timing", detail: `장 넘김 ${y}년 ${m[2]}월 — 엔진 ${P.turn.start}`, hint: "장 넘김 연월은 카드 값 그대로" }); }
      }
      // 순서: 10년 창 안에서 열리는 다음 장을 「이 10년이 끝난 뒤」로 미룸(P6 major-p6a 8.1 「정미 대운은 이 10년이 끝난 뒤에 이어지는 다음 줄기예요」 — 정미 대운은 2027년 3월부터).
      if (P.turn && P.turn.year <= 2036 && next && (sen.includes(next.ganji.replace(/^[^(]*\(|\)$/g, "")) || NEXT_REF.test(sen)) && /(?:이 )?10년이 끝난 뒤|10년을 다 지나고|2036년 뒤/.test(sen)) out.push({ ...at, rule: "dayun_timing", detail: `다음 장을 10년 창 뒤로 — 엔진 ${P.turn.start}`, hint: "장 넘김 해는 카드 값 그대로" });
      const rg = /교운기[^.]{0,12}?(20\d\d)\s?~\s?(20\d\d)/.exec(sen);
      if (rg && P.turn && (Number(rg[1]) !== P.turn.range[0] || Number(rg[2]) !== P.turn.range[1])) out.push({ ...at, rule: "dayun_timing", detail: `교운기 ${rg[1]}~${rg[2]} — 엔진 ${P.turn.range[0]}~${P.turn.range[1]}`, hint: "교운기는 카드 값 그대로" });
      // ---- age_claim ----
      // 이어지는 장을 묶은 범위(옛 「큰 줄기」 띠 — 만 11~30세)도 엔진 값이다: 시작은 어느 장의 시작 나이, 끝은 그 뒤 어느 장의 끝 나이.
      const span = (a: number, z: number) => P.chapters.some((ch, i) => ch.startAge === a && P.chapters.slice(i).some(c2 => Number(/~(\d+)세/.exec(c2.ages)?.[1]) === z));
      for (const m of sen.matchAll(/만 (\d{1,3})\s?~\s?(\d{1,3})세/g)) if (!span(Number(m[1]), Number(m[2]))) out.push({ ...at, rule: "age_claim", detail: `만 ${m[1]}~${m[2]}세 — 평생 지도에 없는 나이 범위`, hint: "장 나이는 차례 값 그대로" });
      if (birthYear) for (const m of sen.matchAll(/(20\d\d)년[^.]{0,10}?만 (\d{1,3})세/g)) { const d = Number(m[1]) - birthYear - Number(m[2]); if (Math.abs(d) > 1) out.push({ ...at, rule: "age_claim", detail: `${m[1]}년 만 ${m[2]}세 — 출생 연도와 ${d}살 어긋남`, hint: "만 나이는 카드 값 그대로" }); }
      // ---- prev_year ----
      if (keyYear) { const pm = /(?:앞 해|지난해|전해|바로 앞의 해)(?:의|에는|에|인)? ?[^.]{0,20}?([자축인묘진사오미신유술해]{2,3}(?:충|형|파|해|합|반합|방합))/.exec(sen); const pv = years.get(Number(keyYear) - 1);
        if (pm && pv && !pv.badges.some(bd => relName(bd.label) === pm[1] || bd.label.startsWith(pm[1]))) out.push({ ...at, rule: "prev_year", detail: `「앞 해 ${pm[1]}」 — ${pv.key}년에는 ${pv.badges.map(bd => relName(bd.label)).join(" · ") || "관계 없음"}`, hint: "앞 해 관계는 엔진 값 그대로" }); void relNames; }
      // ---- year_list ---- 6장(영역 지도): 해 둘 이상을 늘어놓은 목록.
      const joined = /(?<![0-9])(20[23]\d)년?\s?(?:과|와|,|·|및)\s?(20[23]\d)년/.test(sen) || /(?<![0-9])20[23]\d\s?·\s?20[23]\d/.test(sen) || (sen.match(/(?<![0-9])20[23]\d년에는/g) ?? []).length >= 2;
      if (c.id === "map" && joined) { const ys = new Set([...sen.matchAll(/(?<![0-9])(20[23]\d)/g)].map(m => m[1])); out.push({ ...at, rule: "year_list", detail: `6장 해 목록 ${[...ys].join(" · ")}`, hint: "해 목록은 화면 표가 맡는다 — 몰리는 막과 뜻으로" }); }
    }));
  });
  return out;
}
