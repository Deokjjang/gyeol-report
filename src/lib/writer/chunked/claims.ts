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
 *  AM2-12 2부(P9~P11 판독 엔진 틀림 가운데 위 검사가 놓친 꼴만):
 *  month_dir  「영역 … 쪽 기운이 이 세 달에 맞닿아」(P9 기준 annual-1) · key 안 「연애에서는 살필 쪽이에요」 · 「연애 중인 당신에게는 살필 쪽」(P9 annual-p5 3월 연애 →)
 *  year_dir   해 영역 방향: 「재물 기운이 약한 해」(P9 기준 annual-p5 — 2027 돈 →)
 *  list_full  「사람 쪽은 1월 · …, 8월 · 무신월에 속도를 늦추면」(P11 annual-1 — 9월 빠짐) · 공부 = 일 칩(P11 annual-p6a 「공부 쪽이 오르는 달은 4 · 7 · 8월」)
 *  prev_month 「앞달에 손본 자리」(관계 뜻 말 — P11 무작위 9월, 8월은 신해해 · 공망뿐)
 *  list_shape 목록 모양: 「네 달은 서로 떨어져」(이웃 달이 있음 — P9 annual-p6b) · 「이 두 달은 오르는 달보다 앞에」(P9 annual-1) · 「세 달 사이에는 흐름이 잔잔한 시기도」(사이 달 흐름 — P9 기준 annual-p6a)
 *  status_claim 입력 상태 말: 「연애 중인 당신」(썸 — P11 무작위 R1-1)
 *  verdict_dir 해 판정 반대: 「2027년은 밀어붙이기보다 다듬고 쌓는 쪽」(판정 밀고 갈 해 — P11 무작위 R1-5) · 「2027년 정미년은 확장보다 정비가」(P11 annual-p5 B6-2)
 * 저장 책 전수(AM-01 · P~P11 세운·대운)에서 오탐 0인 검사만 차단(four.ts)에 둔다 — 나머지는 기록. 판정 기록: am2.md 21 · 22절 · rubric.md.
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
// AM2-12 2부: 공부 = 일 칩(바람의 공부 쪽 — AM2-11 1부 1과 같은 칩).
const DOM_OF: Readonly<Record<string, Dom>> = { 연애: "love", 돈: "money", 일: "work", 공부: "work", 사람: "people", 관계: "people" };
const DOM_G = /(?<![가-힣])(연애|돈|일|공부|사람|관계)(?=[과와이가은는도의에,·\s]|쪽|$)/g;
const DOMS = "(?<![가-힣])(?:연애|돈|일|공부|사람|관계)(?:[,·] ?(?:연애|돈|일|공부|사람|관계)|과,? (?:연애|돈|일|공부|사람|관계)|와,? (?:연애|돈|일|공부|사람|관계))*";
const CLAIM_LIST = new RegExp(`${DOMS}(?: 쪽)?(?: 기운)?(?:이|가|은|는|도|에서)? (?:기운이 )?(?:오르는|올라가는|속도를 늦출|늦출|살필|새기 쉬운) 달(?:은|이|로는)? `);
const CLAIM_DEM = new RegExp(`${DOMS}(?:,? ?[가-힣]+)? 쪽 (?:소망|기운|바람)(?:이|은|도)? (?:이|그) (?:두|세|네|다섯) 달에 (?:모이|오르|몰리|맞닿|겹치)`);
/** 목록 주장(빠짐 검사): 조사로 끝난 「…달은 · 달이 · 달로는 」 꼴만(「달이에요」 같은 key 안 한 달 주장은 뺀다). */
const CLAIM_FULL = new RegExp(`${DOMS}(?: 쪽)?(?: 기운)?(?:이|가|은|는|도|에서)? (?:기운이 )?(?:오르는|올라가는|속도를 늦출|늦출|살필|새기 쉬운) 달(?:은|이|로는) `);
const MONTH_LOOSE = `(?:(?:20\\d\\d년 )?(?:1[0-2]|[1-9])월 ?(?:· ?)?)?(${GJ})(?:\\([一-鿿]+\\))?월`;
const RANGE_RE = new RegExp(`${MONTH_LOOSE}부터 ${MONTH_LOOSE}까지`, "g");
const PREV_REL = /(?<![가-힣])(?:앞 ?달|지난 ?달|전달)(?:의|에는|엔|에|은|는)? ?([가-힣]+)/;
const CLAIM_KEY = new RegExp(`${DOMS}(?: 쪽)?(?:이|가|은|는|도) (?:오르는|살필|새기 쉬운) 달(?:이에요|입니다|이기도|이라)`);
/** AM2-12 2부: key 안 「연애에서는 살필 쪽이에요」 · 「연애 중인 당신에게는 살필 쪽」(상태 말 주어 = 연애). */
const CLAIM_SIDE = new RegExp(`(?:${DOMS})(?:에서는|에서도| 쪽은| 쪽에서는| 쪽도|은|는|도) (?:살필|조심할|늦출|오르는) 쪽(?:이에요|입니다|이라|이고|이니)`);
const CLAIM_SIDE_ME = /(?<![가-힣])(?:연애 중인|솔로인|기혼인|썸 타는) 당신(?:에게는|에게도|은|는) (?:살필|조심할|늦출|오르는) 쪽(?:이에요|입니다|이라|이고|이니)/;
/** 해 영역 방향 말: 「재물 기운이 약한 해」. */
const YEAR_DIR = /(?<![가-힣])(재물|돈|연애|일|사람|관계)(?: 쪽)? 기운이 (약한|강한|센|오르는|내리는|가라앉는) 해/;
/** 「사람 쪽은 1월 · 신축월, …에 속도를 늦추면」 — 쪽은 + 달 목록 + 동사. */
const CLAIM_FULL2 = new RegExp(`(${DOMS}) 쪽은 ((?:(?!쪽은)[^.!?])*?월)에 (속도를 늦추|늦추|살피|오르)`);
/** 앞 달 관계 뜻 말(이름 대신): 손본 · 다듬은 = 형 · 파, 부딪친 = 충, 맺힌 = 합 — 바로 앞 달에 그 무리 관계가 있어야 한다. */
const PREV_MEAN = /(?<![가-힣])(?:앞 ?달|지난 ?달|전달)(?:에|의|에는)? ?(손본|손봤던|다듬(?:은|던|어 둔)|부딪(?:친|힌|쳤던)|맺(?:은|힌|혔던))/;
const MEAN_KINDS: readonly [RegExp, readonly string[]][] = [[/^손|^다듬/, ["HYEONG", "PA"]], [/^부딪/, ["CHUNG"]], [/^맺/, ["STEM_HAP", "YUKHAP"]]];
/** 입력 상태 말(조건 꼴 「…이라면」은 뺀다). */
const STATUS_SAY = /(?<![가-힣])(연애 중인|솔로인|기혼인|결혼한|썸 타는|썸 중인) 당신(?!이라면|이라도)/;
const STATUS_OF: Readonly<Record<string, string>> = { "연애 중인": "dating", 솔로인: "single", 기혼인: "married", 결혼한: "married", "썸 타는": "some", "썸 중인": "some" };
/** 해 판정 방향 말(해가 주어인 문장 — 달 key 밖). */
const YEAR_SUBJ = /(?<![가-힣])(?:20\d\d년|[갑을병정무기경신임계][자축인묘진사오미신유술해]년|이 해|올해|한 해)/;
const VERDICT_SETTLE = /밀어붙이기보다 (?:다듬|쌓|다지|정비)|확장보다 정비|벌이기보다 (?:다듬|정비|효율)|다질 해(?:예요|입니다|에요|라|로)|다지는 해(?:예요|입니다|에요)/;
const VERDICT_PUSH = /밀고 갈 해(?:예요|입니다|에요|라|로)|밀어붙일 해|확장할 해/;
/** AM2-12 4부(P12 판독 — 측정 중 고침): 「밀어붙이는 해라기보다」(해 말이 스스로 주어) · 반대 짝. */
const NOT_PUSH = /(?<![가-힣])(?:밀어붙이는|밀고 가는|밀고 갈) 해(?:라기보다|가 아니)/;
const NOT_SETTLE = /(?<![가-힣])(?:다지는|다질|버티는|버틸) 해(?:라기보다|가 아니)/;
/** 해 그림 말의 속도: 「정미년은 … 느긋하게 풀을 뜯는 순한 양 같은 해입니다」(흐름 4 이상 · 밀고 갈 해 — P12 annual-p6a · 무작위 1117). */
const YEAR_CALM = new RegExp(`(?<![가-힣])(?:20\\d\\d년|${GJ}년)은 [^.!?]*(?:느긋|한가로|잔잔|고요)[^.!?]*해(?:입니다|예요|이에요|라)`);
/** 앞 달 이름 지시: 「앞 달인 6월 · 병오월」 — 바로 앞 달(다리 달 포함)이어야 한다(「같은 자리의 앞 달인」은 같은 자리 앞선 달 — 뺀다). */
const PREV_NAMED = new RegExp(`(?<![가-힣])(?<!같은 자리의 )(?:앞 ?달|지난 ?달|전달)(?:인|이던|이었던) ${MONTH_LOOSE}`);
/** key 안 영역 풀림 말: 「관계 쪽은 말투가 부드러워져 사이가 편해지는 흐름」 — 그 영역 칩이 살핌(↓)이면 반대. */
const CLAIM_EASE = new RegExp(`(${DOMS})(?: 쪽)?(?:은|는) (?:(?![은는] )[^.!?])*?(?:편해지는|부드러워지는|풀리는|가까워지는) (?:흐름|달|때|쪽)`);
/** 목록 뒤 달: 「두 달이 지나면 오르는 달이 이어서 오니」 — 목록 마지막 달 다음 달이 그 영역 그 방향. */
const NEXT_RUN = /(?:두|세|네) 달이 지나면 (오르는|늦출|살필|새기 쉬운) 달이 (?:이어서|바로|곧)/;
/** 해 문단 「가까운 데서 마찰」 — 2027 해가 태어난 날 자리와 충 · 형 · 파 · 해 · 원진으로 걸려야 한다. */
const NEAR_RUB = /(?<![가-힣])가까운 (?:데|사이|자리)(?:에서|서|와|과)? ?(?:마찰|부딪)/;

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
        { const m1 = CLAIM_LIST.exec(sen), m2 = CLAIM_DEM.exec(sen), m3 = isKey ? CLAIM_KEY.exec(sen) ?? CLAIM_SIDE.exec(sen) ?? CLAIM_SIDE_ME.exec(sen) : null;
          const hit = m1 ?? m2 ?? m3;
          if (hit) {
            const dir = /오르|올라|모이|맞닿|겹치|몰리/.test(hit[0]) ? "↑" : "↓";
            const doms = (hit === m3 && CLAIM_SIDE_ME.test(hit[0]) ? ["love"] : [...hit[0].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean)) as Dom[];
            const ms = m1 ? monthsOf(sen.slice(m1.index)) : m2 ? monthsOf(prev) : [cur!.ganji.hangul];
            const bad: string[] = [];
            for (const g of ms) { const e = byGanji.get(g); if (!e?.signals) continue; for (const d of doms) if (e.signals[d] !== dir) bad.push(`${e.label.split(" (")[0]} ${d} ${e.signals[d]}`); }
            if (ms.length && doms.length && bad.length) out.push({ ...at, rule: "month_dir", detail: `${dir === "↑" ? "오름" : "살핌"} 주장 ≠ 칩: ${bad.slice(0, 4).join(" · ")}`, hint: "그 달 칩(화면 오르는 쪽 · 조심할 쪽)과 같은 영역만" });
          } }
        // ---- prev_month ---- 달 key에서 「앞 달 · 지난달 + 관계 이름」 — 바로 앞 달(다리 달 포함) 엔진 관계에 그 이름이 있어야 한다.
        if (isKey && cur) { const pm = PREV_REL.exec(sen), nm = pm ? relNames.find(n => pm[1].startsWith(n)) : undefined;
          if (nm) { const k = allMonths.findIndex(e => e.key === cur.key), pv = k > 0 ? allMonths[k - 1] : undefined;
            if (pv && !pv.badges.some(bd => relName(bd.label) === nm)) { const where = allMonths.slice(0, k).reverse().find(e => e.badges.some(bd => relName(bd.label) === nm));
              out.push({ ...at, rule: "prev_month", detail: `「앞 달 ${nm}」 — ${pv.label.split(" (")[0]}에는 ${nm} 없음${where ? `(${where.label.split(" (")[0]})` : ""}`, hint: "앞 달이라고 하지 말고 그 관계가 있는 달 이름을 그대로(카드 「앞:」 줄)" }); } }
          const mm = !nm ? PREV_MEAN.exec(sen) : null, fam = mm ? MEAN_KINDS.find(([re]) => re.test(mm[1]))?.[1] : undefined;
          if (fam) { const k = allMonths.findIndex(e => e.key === cur.key), pv = k > 0 ? allMonths[k - 1] : undefined;
            if (pv && !pv.badges.some(bd => fam.includes(bd.kind))) out.push({ ...at, rule: "prev_month", detail: `「앞 달 ${mm![1]}」 — ${pv.label.split(" (")[0]}에는 ${fam.join("·")} 관계 없음`, hint: "앞 달이라고 하지 말고 그 관계가 있는 달 이름을 그대로(카드 「앞:」 줄)" }); }
          // AM2-12 4부: 「앞 달인 6월 · 병오월」(8월 key — 앞 달은 7월).
          const pn = PREV_NAMED.exec(sen);
          if (pn) { const k = allMonths.findIndex(e => e.key === cur.key), pv = k > 0 ? allMonths[k - 1] : undefined;
            if (pv && pv.ganji.hangul !== pn[1]) out.push({ ...at, rule: "prev_month", detail: `「앞 달인 ${pn[1]}월」 — 앞 달은 ${pv.label.split(" (")[0]}`, hint: "앞 달이라고 하지 말고 그 달 이름만 그대로(카드 「앞:」 줄)" }); } }
        // AM2-12 4부: key 안 「관계 쪽은 … 편해지는 흐름」 — 그 영역 칩이 살핌이면 반대.
        if (isKey && cur?.signals) { const me = CLAIM_EASE.exec(sen);
          if (me) { const bad = [...me[1].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter((d): d is Dom => Boolean(d) && cur.signals![d as Dom] === "↓");
            if (bad.length) out.push({ ...at, rule: "month_dir", detail: `풀림 주장 ≠ 칩: ${cur.label.split(" (")[0]} ${bad.map(d => `${d} ↓`).join(" · ")}`, hint: "그 달 칩(화면 조심할 쪽)과 반대로 쓰지 않는다" }); } }
        // ---- list_full ---- 목록 주장은 그 영역(여럿이면 모두 같은 방향인 달) 칩 달을 다 담는다.
        { const mf = CLAIM_FULL.exec(sen);
          if (mf) { const dir = /오르|올라/.test(mf[0]) ? "↑" : "↓", doms = [...mf[0].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean) as Dom[];
            const tail = sen.slice(mf.index), said = new Set(monthsOf(tail));
            // 「7월 · 정미월부터 10월 · 경술월까지」는 그 사이 달을 모두 담는다.
            for (const r of tail.matchAll(RANGE_RE)) { const a = allMonths.findIndex(e => e.ganji.hangul === r[1]), z = allMonths.findIndex(e => e.ganji.hangul === r[2]); if (a >= 0 && z > a) for (const e of allMonths.slice(a, z + 1)) said.add(e.ganji.hangul); }
            const want = allMonths.filter(e => doms.length && doms.every(d => e.signals?.[d] === dir));
            const miss = want.filter(e => !said.has(e.ganji.hangul));
            if (said.size && miss.length) out.push({ ...at, rule: "list_full", detail: `${doms.join("·")} ${dir === "↑" ? "오름" : "살핌"} 목록에서 빠짐: ${miss.map(e => e.label.split(" (")[0]).join(" · ")}`, hint: "목록은 카드 줄 그대로 전부(앞 몇 달만 고르지 않는다)" }); } }
        // AM2-12 2부: 「사람 쪽은 …월에 속도를 늦추면」 꼴도 목록 주장.
        { const m4 = CLAIM_FULL2.exec(sen);
          if (m4) { const dir = /오르/.test(m4[3]) ? "↑" : "↓", doms = [...m4[1].matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean) as Dom[], said = new Set(monthsOf(m4[2]));
            const miss = allMonths.filter(e => doms.length && doms.every(d => e.signals?.[d] === dir) && !said.has(e.ganji.hangul));
            const extra = [...said].map(g => byGanji.get(g)).filter((e): e is NonNullable<typeof e> => Boolean(e) && doms.some(d => e!.signals?.[d] !== dir));
            if (said.size && (miss.length || extra.length)) out.push({ ...at, rule: "list_full", detail: `${doms.join("·")} ${dir === "↑" ? "오름" : "살핌"} 목록${miss.length ? ` 빠짐: ${miss.map(e => e.label.split(" (")[0]).join(" · ")}` : ""}${extra.length ? ` 칩 밖: ${extra.map(e => e.label.split(" (")[0]).join(" · ")}` : ""}`, hint: "목록은 카드 줄 그대로 전부(앞 몇 달만 고르지 않는다)" }); } }
        // ---- year_dir ---- 해 영역 방향 말 = 그 해 칩.
        { const yd = YEAR_DIR.exec(sen), ye = entries.find(e => e.kind === "year" && e.signals);
          if (yd && ye && !isKey) { const d = (yd[1] === "재물" ? "money" : DOM_OF[yd[1]]) as Dom | undefined, want = /약한|내리는|가라앉는/.test(yd[2]) ? "↓" : "↑";
            if (d && ye.signals![d] !== want) out.push({ ...at, rule: "year_dir", detail: `「${yd[0]}」 — ${ye.label.split(" (")[0]} ${d} ${ye.signals![d]}`, hint: "해 영역 방향은 흐름표 해 칩과 같게" }); } }
        // ---- list_shape ---- 목록 모양(이웃 · 앞뒤 · 사이 달 흐름): 받는 목록 = 같은 문장 앞 또는 바로 앞 문장의 달들.
        { const idx = (g: string) => allMonths.findIndex(e => e.ganji.hangul === g);
          // 받는 목록: 같은 문장 앞 → 같은 절 안 가장 가까운 앞 문장(달 이름 둘 이상).
          const listSrc = (upto: string) => (monthsOf(upto).length >= 2 ? upto : [...secSents.slice(0, pi).flat(), ...sents.slice(0, i)].reverse().find(x2 => monthsOf(x2).length >= 2) ?? "");
          const ref = (upto: string) => monthsOf(listSrc(upto)).map(idx).filter(n => n >= 0).sort((a, c) => a - c);
          const ap = /(?:두|세|네|다섯|여섯) 달은 서로 (?:떨어져|멀리)/.exec(sen);
          if (ap) { const xs = ref(sen.slice(0, ap.index)); const nb = xs.find((v, j) => j > 0 && v - xs[j - 1] === 1);
            if (xs.length >= 2 && nb !== undefined) out.push({ ...at, rule: "list_shape", detail: `「서로 떨어져」 — ${allMonths[nb - 1].label.split(" (")[0]} · ${allMonths[nb].label.split(" (")[0]}은 이웃 달`, hint: "목록 달의 모양은 말하지 않거나 카드 그대로" }); }
          const od = /(?:이|그) (?:두|세|네) 달은 (오르는|늦출|살필|새기 쉬운) 달보다 (앞|뒤)에/.exec(sen);
          if (od) { const xs = ref(sen.slice(0, od.index)), dm = [...listSrc(sen.slice(0, od.index)).matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean)[0] as Dom | undefined;
            const other = dm ? allMonths.map((e, j) => (e.signals?.[dm] === (od[1] === "오르는" ? "↑" : "↓") ? j : -1)).filter(j => j >= 0) : [];
            const ok = od[2] === "앞" ? xs.every(v => other.every(o => v < o)) : xs.every(v => other.every(o => v > o));
            if (xs.length && other.length && !ok) out.push({ ...at, rule: "list_shape", detail: `「${od[1]} 달보다 ${od[2]}」 — ${dm} ${od[1]} 달 ${other.map(j => allMonths[j].label.split(" (")[0]).join(" · ")}`, hint: "목록 달의 앞뒤는 말하지 않거나 카드 그대로" }); }
          const bt = /(?:두|세|네) 달 사이(?:에는|의 달에는|의 달은|에도)?[^.!?]*흐름이 (잔잔|조용|순한|거센|거세)/.exec(sen);
          if (bt) { const xs = ref(sen.slice(0, bt.index)); if (xs.length >= 2) { const lo2 = xs[0], hi2 = xs[xs.length - 1], mid = allMonths.slice(lo2 + 1, hi2).filter((_e, j) => !xs.includes(lo2 + 1 + j));
            const calm = /잔잔|조용|순한/.test(bt[1]), okB = mid.some(e => (calm ? e.flow.score <= 2 : e.flow.score >= 4));
            if (mid.length && !okB) out.push({ ...at, rule: "list_shape", detail: `「사이 달 흐름 ${bt[1]}」 — 사이 달 ${mid.map(e => `${e.label.split(" (")[0]} ${e.flow.score}`).join(" · ")}`, hint: "사이 달 흐름은 카드 흐름 그대로" }); } }
          // AM2-12 4부: 「두 달이 지나면 오르는 달이 이어서」 — 목록 마지막 달 다음 달이 그 영역 그 방향.
          const nr = NEXT_RUN.exec(sen);
          if (nr) { const src = listSrc(sen.slice(0, nr.index)), xs = ref(sen.slice(0, nr.index)), dm = [...src.matchAll(DOM_G)].map(x2 => DOM_OF[x2[1]]).filter(Boolean)[0] as Dom | undefined;
            const nx = xs.length ? allMonths[xs[xs.length - 1] + 1] : undefined, want = nr[1] === "오르는" ? "↑" : "↓";
            if (dm && nx?.signals && nx.signals[dm] !== want) out.push({ ...at, rule: "list_shape", detail: `「달이 지나면 ${nr[1]} 달이 이어서」 — ${nx.label.split(" (")[0]} ${dm} ${nx.signals[dm]}`, hint: "목록 뒤 달은 말하지 않거나 카드 그대로" }); } }
        // ---- status_claim ---- 입력 상태 말 = 고객이 적은 연애 상태.
        { const st = STATUS_SAY.exec(sen), f = b.brief?.person.facts;
          if (st && f) { const mine = f.relationshipNote === "some" ? "some" : f.relationship;
            if (STATUS_OF[st[1]] !== mine) out.push({ ...at, rule: "status_claim", detail: `「${st[0]}」 — 입력 연애 상태 ${mine}`, hint: "연애 상태 말은 인물 카드 「연애:」 그대로" }); } }
        // ---- verdict_dir ---- 해가 주어인 문장의 방향 말 = 해 판정(흐름표 · 키워드).
        { const ye = entries.find(e => e.kind === "year"), push = ye ? ye.flow.score >= 4 : null;
          if (!isKey && push !== null && YEAR_SUBJ.test(sen)) { const bad = push ? VERDICT_SETTLE.exec(sen) : VERDICT_PUSH.exec(sen);
            if (bad) out.push({ ...at, rule: "verdict_dir", detail: `「${bad[0]}」 — 해 판정 ${push ? "밀고 갈 해" : "다질 해"}`, hint: "해를 쓰는 방향은 1장 판정 한 줄과 같게" }); }
          // AM2-12 4부: 「밀어붙이는 해라기보다」 — 해 말이 스스로 주어(앞 문장의 2027년).
          const self = !isKey && push !== null ? (push ? NOT_PUSH.exec(sen) : NOT_SETTLE.exec(sen)) : null;
          if (self && !(YEAR_SUBJ.test(sen) && (push ? VERDICT_SETTLE : VERDICT_PUSH).test(sen))) out.push({ ...at, rule: "verdict_dir", detail: `「${self[0]}」 — 해 판정 ${push ? "밀고 갈 해" : "다질 해"}`, hint: "해를 쓰는 방향은 1장 판정 한 줄과 같게" });
          const calm = !isKey && push && !self ? YEAR_CALM.exec(sen) : null;
          if (calm) out.push({ ...at, rule: "verdict_dir", detail: `해 그림 속도 말 「${calm[0].match(/느긋|한가로|잔잔|고요/)![0]}」 — 해 흐름 ${ye!.flow.score}/5 · 밀고 갈 해`, hint: "해 그림의 속도 말은 흐름표 해 판정과 같은 쪽(느긋 · 잔잔은 다질 해에만)" }); }
        // AM2-12 4부: 해 문단 「가까운 데서 마찰」 — 2027 해가 태어난 날 자리와 부딪치는 관계로 걸려야 한다.
        { const nb = !isKey && NEAR_RUB.test(sen) && !monthsOf(p).length ? entries.find(e => e.kind === "year") : undefined;
          if (nb && !nb.badges.some(bd => ["CHUNG", "HYEONG", "PA", "HAE", "WONJIN"].includes(bd.kind) && badgeSeats(bd.with).has("날"))) out.push({ ...at, rule: "seat_ref", detail: `「가까운 데서 마찰」 — ${nb.label.split(" (")[0]}의 태어난 날 자리 관계: ${nb.badges.filter(bd => badgeSeats(bd.with).has("날")).map(bd => relName(bd.label)).join(" · ") || "없음"}`, hint: "가까운 자리 마찰은 그 해가 태어난 날 자리와 충 · 형 · 파 · 해로 걸릴 때만" }); }
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
