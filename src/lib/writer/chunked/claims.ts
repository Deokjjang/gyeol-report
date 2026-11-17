/**
 * AM2-11 1부 6 — 엔진 주장 대조 묶음(세운·대운 본문 검사, 생성 중 · 결정론 · 호출 0). 본문이 엔진 값을 말하는 세 꼴을 엔진과 맞댄다.
 *  seat_ref    자리 주장: 「같은 자리」(그 자리)가 받는 자리(같은 문장 앞 · 바로 앞 문장의 「태어난 X 자리」)에 그 문장의 관계가 엔진에서 실제로 걸리는가
 *              (P10 annual-p6a 2028년 1월 「…시각 자리에서 축미충이 일어나 … 9월 · 기유월에는 지지형이 같은 자리에 있었지만」 — 지지형은 해·날 자리).
 *  month_dir   달 × 영역 방향 주장: 「일 쪽이 오르는 달」 「돈이 새기 쉬운 달은 …」 「일과 연애, 사람 쪽 소망이 이 세 달에 모이기」 — 말한 영역의 그 달 칩이 오름(살핌)인가
 *              (P10 annual-1 큰 그림 — 2 · 7 · 10월 일 칩 →).
 *  flow_claim  흐름 세기 주장: 달 key의 「한결 순하게」 「잔잔한 달」(흐름 4 이상) · 「거센 달」 「크게 출렁」(흐름 2 이하), 「흐름이 가장 잔잔한 · 거센 달은 …」이 끝값 달인가
 *              (P9 annual-p6b 11월 「이 달의 기운이 한결 순하게 옵니다」 — 흐름 5).
 *  AM2-11 3부 측정 중 고침(P11 판독이 찾은 엔진 값 틀림 — 생성은 다시 하지 않음):
 *  seat_ref    받는 자리를 같은 절(section) 안 가장 가까운 앞 문장까지 되짚는다(P11 annual-1 10월 「태어난 날 자리에서 화국이 모입니다. … 같은 자리에 진술충도 겹쳐」 — 진술충은 달·시각, 세 문장 앞).
 *  prev_month  달 key의 「앞 달 · 지난달 + 관계 이름」이 바로 앞 달 엔진 관계에 있는가(P11 annual-p5 8월 「앞 달 자오충이」 — 자오충은 6월, 7월은 자미해 · 원진 …).
 *  list_full   「영역(쪽)이 오르는 · 늦출 · 살필 · 새기 쉬운 달은 …」 목록이 그 영역 칩 달을 다 담는가(P11 annual-1 바람 장 「연애 쪽이 오르는 달은 2 · 7 · 8월」 — 칩은 2 · 7 · 8 · 9 · 10 · 11월).
 * 저장 책 전수(AM-01 · P~P10 세운·대운)에서 오탐 0인 검사만 차단(four.ts)에 둔다 — 나머지는 기록. 판정 기록: am2.md 21절 · rubric.md.
 */
import type { FinalChapter } from "../safety";
import type { TimelineEntry } from "@/lib/brief/schema";
import { relName } from "@/lib/brief/core";
import { splitSentences } from "../safety/patterns";
import type { BlockCtx, ChunkFlag } from "./check";

const GJ = "[갑을병정무기경신임계][자축인묘진사오미신유술해]";
/** 본문의 달 이름(「7월 · 정미(丁未)월」 「정미월」) → 간지. */
const MONTH_RE = new RegExp(`(?:(?:20\\d\\d년 )?(?:1[0-2]|[1-9])월 ?· ?)?(${GJ})(?:\\([一-鿿]+\\))?월`, "g");
const monthsOf = (s: string) => [...s.matchAll(MONTH_RE)].map(m => m[1]);
const SEAT_RE = /태어난 (해|달|날|시각)((?:[·,] ?(?:태어난 )?(?:해|달|날|시각))*)/g;
const seatsIn = (s: string) => new Set([...s.matchAll(SEAT_RE)].flatMap(m => [m[1], ...m[2].split(/[·,]\s*/).filter(Boolean).map(x => x.replace(/^태어난 /, ""))]));
const SEAT_KO: Readonly<Record<string, string>> = { 해: "태어난 해", 달: "태어난 달", 날: "태어난 날", 시각: "태어난 시각" };
const badgeSeats = (w: string | undefined) => new Set((w ?? "").split("·").map(x => x.trim().replace(/^태어난 /, "")).filter(Boolean));
/** 「같은 자리」가 원국 자리를 받는 꼴(「같은 자리에서 같은 일」 같은 장소 관용은 뺀다). */
const SAME_SEAT = /(?<![가-힣])(?:같은|그) 자리(?!에서 같은)(?:에|의|를|는|가|에서|에도|와)?(?![가-힣])/;

type Dom = "love" | "money" | "work" | "people" | "mind";
/** 「같은 자리」가 든 절(쉼표 · 「지만 · 는데 · 고」로 가른 마디). */
function clauseAt(sen: string, at: number): string { const cuts = [...sen.matchAll(/, |지만 |는데 |(?<=[가-힣])고 /g)].map(m => m.index! + m[0].length); const a = Math.max(0, ...cuts.filter(c => c <= at)), b = Math.min(sen.length, ...cuts.filter(c => c > at)); return sen.slice(a, b); }
/** 영역 말(마음은 뺀다 — 마음 칩 오름은 「쉬어 가기 좋은」 쪽이라 방향 말과 뜻이 다르다). */
const DOM_OF: Readonly<Record<string, Dom>> = { 연애: "love", 돈: "money", 일: "work", 사람: "people", 관계: "people" };
const DOM_G = /(?<![가-힣])(연애|돈|일|사람|관계)(?=[과와이가은는도의에,·\s]|쪽|$)/g;
const DOMS = "(?<![가-힣])(?:연애|돈|일|사람|관계)(?:[,·] ?(?:연애|돈|일|사람|관계)|과,? (?:연애|돈|일|사람|관계)|와,? (?:연애|돈|일|사람|관계))*";
const CLAIM_LIST = new RegExp(`${DOMS}(?: 쪽)?(?: 기운)?(?:이|가|은|는|도|에서)? (?:기운이 )?(?:오르는|올라가는|속도를 늦출|늦출|살필|새기 쉬운) 달(?:은|이|로는)? `);
const CLAIM_DEM = new RegExp(`${DOMS}(?:,? ?[가-힣]+)? 쪽 (?:소망|기운|바람)(?:이|은|도)? (?:이|그) (?:두|세|네|다섯) 달에 (?:모이|오르|몰리)`);
/** 목록 주장(빠짐 검사): 조사로 끝난 「…달은 · 달이 · 달로는 」 꼴만(「달이에요」 같은 key 안 한 달 주장은 뺀다). */
const CLAIM_FULL = new RegExp(`${DOMS}(?: 쪽)?(?: 기운)?(?:이|가|은|는|도|에서)? (?:기운이 )?(?:오르는|올라가는|속도를 늦출|늦출|살필|새기 쉬운) 달(?:은|이|로는) `);
const MONTH_LOOSE = `(?:(?:20\\d\\d년 )?(?:1[0-2]|[1-9])월 ?(?:· ?)?)?(${GJ})(?:\\([一-鿿]+\\))?월`;
const RANGE_RE = new RegExp(`${MONTH_LOOSE}부터 ${MONTH_LOOSE}까지`, "g");
const PREV_REL = /(?<![가-힣])(?:앞 ?달|지난 ?달|전달)(?:의|에는|엔|에|은|는)? ?([가-힣]+)/;
const CLAIM_KEY = new RegExp(`${DOMS}(?: 쪽)?(?:이|가|은|는|도) (?:오르는|살필|새기 쉬운) 달(?:이에요|입니다|이기도|이라)`);

export function am211Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const entries = (b.brief?.timeline?.entries ?? []) as readonly (TimelineEntry & { signals?: Readonly<Record<Dom, string>> })[];
  if (!entries.length) return out;
  const byGanji = new Map(entries.filter(e => e.kind === "month").map(e => [e.ganji.hangul, e] as const));
  const byKey = new Map(entries.map(e => [e.key, e] as const));
  const relNames = [...new Set(entries.flatMap(e => e.badges.map(bd => relName(bd.label))).filter(n => n.length >= 2))].sort((a, c) => c.length - a.length);
  const allMonths = entries.filter(e => e.kind === "month");
  const months = entries.filter(e => e.kind === "month" && !e.bridge), lo = Math.min(...months.map(e => e.flow.score)), hi = Math.max(...months.map(e => e.flow.score));
  for (const c of chapters) c.sections.forEach((s, si) => {
    const cur = byKey.get(s.heading), isKey = Boolean(cur && cur.kind === "month");
    const secSents = s.paragraphs.map(p0 => splitSentences(p0));
    s.paragraphs.forEach((p, pi) => {
      const sents = secSents[pi];
      sents.forEach((sen, i) => {
        const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
        const prev = i > 0 ? sents[i - 1] : pi > 0 ? (splitSentences(s.paragraphs[pi - 1]).pop() ?? "") : "";
        // ---- seat_ref ---- 「같은 자리」가 든 절의 관계만(그 절에 달 이름이 있으면 그 달, 없으면 이 key)을 받는 자리와 맞댄다.
        const sm = SAME_SEAT.exec(sen);
        if (sm) {
          const before = sen.slice(0, sm.index);
          // 받는 자리: 같은 문장 앞 → 바로 앞 문장 → 같은 절 안 더 앞 문장(가장 가까운 「태어난 X 자리」).
          const back = [...secSents.slice(0, pi).flat(), ...sents.slice(0, i)].reverse().find(x2 => seatsIn(x2).size) ?? "";
          const ref = seatsIn(before.replace(/같은 태어난/g, "태어난")).size ? seatsIn(before) : seatsIn(prev).size ? seatsIn(prev) : seatsIn(back);
          const cs = clauseAt(sen, sm.index);
          if (ref.size && !seatsIn(cs.replace(SAME_SEAT, "")).size) {
            const own = monthsOf(cs).map(g => byGanji.get(g)).filter((e): e is NonNullable<typeof e> => Boolean(e));
            const e0 = own[0] ?? cur;
            const bad: string[] = [];
            if (e0) for (const nm of relNames.filter(n => cs.includes(n))) {
              const bd = e0.badges.find(x2 => relName(x2.label) === nm); if (!bd) continue;
              const ss = badgeSeats(bd.with);
              if (![...ref].some(r => ss.has(r))) bad.push(`${nm}(${e0.label.split(" (")[0]})은 ${[...ss].map(x => SEAT_KO[x] ?? x).join("·")} 자리`);
            }
            if (bad.length) out.push({ ...at, rule: "seat_ref", detail: `「같은 자리」가 받는 ${[...ref].map(x => SEAT_KO[x] ?? x).join("·")} 자리 ≠ ${bad.join(" · ")}`, hint: "같은 자리라고 하지 말고 그 관계의 자리 이름을 그대로(카드 줄)" });
          }
        }
        // ---- month_dir ---- 정해진 주장 꼴만: 「영역(쪽)이 오르는 · 늦출 · 살필 · 새기 쉬운 달(은) …달들」 · 「영역 … 쪽 소망 · 기운이 이 세 달에 모이 · 오르」 · key 안 「영역 쪽이 오르는 달이에요」.
        { const m1 = CLAIM_LIST.exec(sen), m2 = CLAIM_DEM.exec(sen), m3 = isKey ? CLAIM_KEY.exec(sen) : null;
          const hit = m1 ?? m2 ?? m3;
          if (hit) {
            const dir = /오르|올라|모이/.test(hit[0]) ? "↑" : "↓";
            const doms = [...hit[0].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean) as Dom[];
            const ms = m1 ? monthsOf(sen.slice(m1.index)) : m2 ? monthsOf(prev) : [cur!.ganji.hangul];
            const bad: string[] = [];
            for (const g of ms) { const e = byGanji.get(g); if (!e?.signals) continue; for (const d of doms) if (e.signals[d] !== dir) bad.push(`${e.label.split(" (")[0]} ${d} ${e.signals[d]}`); }
            if (ms.length && doms.length && bad.length) out.push({ ...at, rule: "month_dir", detail: `${dir === "↑" ? "오름" : "살핌"} 주장 ≠ 칩: ${bad.slice(0, 4).join(" · ")}`, hint: "그 달 칩(화면 오르는 쪽 · 조심할 쪽)과 같은 영역만" });
          } }
        // ---- prev_month ---- 달 key에서 「앞 달 · 지난달 + 관계 이름」 — 바로 앞 달(다리 달 포함) 엔진 관계에 그 이름이 있어야 한다.
        if (isKey && cur) { const pm = PREV_REL.exec(sen), nm = pm ? relNames.find(n => pm[1].startsWith(n)) : undefined;
          if (nm) { const k = allMonths.findIndex(e => e.key === cur.key), pv = k > 0 ? allMonths[k - 1] : undefined;
            if (pv && !pv.badges.some(bd => relName(bd.label) === nm)) { const where = allMonths.slice(0, k).reverse().find(e => e.badges.some(bd => relName(bd.label) === nm));
              out.push({ ...at, rule: "prev_month", detail: `「앞 달 ${nm}」 — ${pv.label.split(" (")[0]}에는 ${nm} 없음${where ? `(${where.label.split(" (")[0]})` : ""}`, hint: "앞 달이라고 하지 말고 그 관계가 있는 달 이름을 그대로(카드 「앞:」 줄)" }); } } }
        // ---- list_full ---- 목록 주장은 그 영역(여럿이면 모두 같은 방향인 달) 칩 달을 다 담는다.
        { const mf = CLAIM_FULL.exec(sen);
          if (mf) { const dir = /오르|올라/.test(mf[0]) ? "↑" : "↓", doms = [...mf[0].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean) as Dom[];
            const tail = sen.slice(mf.index), said = new Set(monthsOf(tail));
            // 「7월 · 정미월부터 10월 · 경술월까지」는 그 사이 달을 모두 담는다.
            for (const r of tail.matchAll(RANGE_RE)) { const a = allMonths.findIndex(e => e.ganji.hangul === r[1]), z = allMonths.findIndex(e => e.ganji.hangul === r[2]); if (a >= 0 && z > a) for (const e of allMonths.slice(a, z + 1)) said.add(e.ganji.hangul); }
            const want = allMonths.filter(e => doms.length && doms.every(d => e.signals?.[d] === dir));
            const miss = want.filter(e => !said.has(e.ganji.hangul));
            if (said.size && miss.length) out.push({ ...at, rule: "list_full", detail: `${doms.join("·")} ${dir === "↑" ? "오름" : "살핌"} 목록에서 빠짐: ${miss.map(e => e.label.split(" (")[0]).join(" · ")}`, hint: "목록은 카드 줄 그대로 전부(앞 몇 달만 고르지 않는다)" }); } }
        // ---- flow_claim ----
        if (isKey && cur) {
          const f = cur.flow.score;
          if (/한결 순하게|순하게 (?:지나|흐르|옵|와)|잔잔한 달|조용히 지나가는 달|숨을 고르기 좋은 달/.test(sen) && f >= 4) out.push({ ...at, rule: "flow_claim", detail: `잔잔 · 순한 말 — ${cur.label.split(" (")[0]} 흐름 ${f}`, hint: "흐름 말은 카드(화면 흐름)와 같게" });
          if (/거센 달|세차게|크게 출렁|몰아치/.test(sen) && f <= 2) out.push({ ...at, rule: "flow_claim", detail: `거센 말 — ${cur.label.split(" (")[0]} 흐름 ${f}`, hint: "흐름 말은 카드(화면 흐름)와 같게" });
        }
        const ends = /가장 (잔잔|조용|순한)/.test(sen) ? lo : /가장 (거센|거세|크게 오르|바쁜)/.test(sen) ? hi : null;
        if (ends !== null && /흐름|기운/.test(sen)) { const ms = monthsOf(sen).map(g => byGanji.get(g)).filter((e): e is NonNullable<typeof e> => Boolean(e) && !e!.bridge); const bad = ms.filter(e => e.flow.score !== ends);
          if (bad.length) out.push({ ...at, rule: "flow_claim", detail: `가장 ${ends === lo ? "잔잔한" : "거센"} 달 ≠ 끝값 ${ends}: ${bad.map(e => `${e.label.split(" (")[0]} ${e.flow.score}`).join(" · ")}`, hint: "끝값 달은 카드 줄 그대로" }); }
      });
    });
  });
  return out;
}
