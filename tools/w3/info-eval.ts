/**
 * W3 P3 7절 — 정보량 지표 평가 도구(결정론·호출 0). 스냅샷 JSON(또는 { snapshot } 감싼 꼴)·원고 md 폴더를 읽어 책마다 지표 표를 낸다.
 * 숫자만 찍는다 — 본문 문장·고객 이름을 찍지 않는다(운영 책 평가에 써도 고객 글이 밖으로 나가지 않게). 책 id는 report id 끝 4자 또는 파일 이름.
 *   pnpm exec tsx tools/w3/info-eval.ts <폴더|파일>... [--json 출력.json]
 *   pnpm exec tsx tools/w3/info-eval.ts --known      # KNOWN3 71개(tools/final3/known.ts)가 final2 원고 4권에서 어느 지표에 걸리는지
 *   pnpm exec tsx tools/w3/info-eval.ts --quotes     # research-w2 결함 인용(노출·장면 꼴)을 지표가 잡는지
 * 카드 없는 옛 책은 사전(용어표·스냅샷 glossary·meta.chapters evidence·지식 DB 이름)과 meta.scenes(씨앗·DB 장면)로 센다. md 원고는 장면 근거가 없어 「근거 없는 장면」이 후보 수다.
 * 카드로 쓴 책(meta.safety.metrics.info.cards — 실호출 도구가 저장한 감독 스냅샷 `<폴더>/snapshot.json`도)은 스냅샷 입력으로 브리프를 다시 만들어 절 카드로 센다(이전 책 원장 없이 — 카드 열에 표시). --no-cards면 카드 없이 사전으로.
 * 폴더는 하위 폴더까지 읽고, 한 폴더에 snapshot.json이 있으면 같은 책의 book.md·meta.json·log.json은 읽지 않는다.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import terms from "../../src/lib/brief/data/terms.json";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { infoCardsOf } from "../../src/lib/writer/design";
import { exposureHits } from "../../src/lib/writer/safety/exposure";
import { concreteScene, infoDictOf, infoMetrics, type InfoCard, type InfoChapter, type InfoDict, type InfoKind, type InfoMetric } from "../../src/lib/writer/safety/info";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { KNOWN3, type Cat } from "../final3/known";

const argv = process.argv.slice(2), arg = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const noHan = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();
const TERM_NAMES = (terms as { terms: { term: string }[] }).terms.map(t => t.term).filter(t => t.length >= 2);

type Book = { id: string; product: string; chapters: InfoChapter[]; dict: InfoDict; backing: boolean; cards?: InfoCard[] };
type Snap = { reportId?: string; productKey?: string; createdAtIso?: string; draft: { productType?: string; glossary?: { name: string }[]; chapters: { n: number; sections: { heading: string; paragraphs: string[] }[]; keys?: string[] }[] };
  evidencePacket?: { input?: Record<string, { name?: string; mbtiType?: string; detailJob?: string } | undefined>; meta?: { scenes?: string[]; explained?: string[]; chapters?: { evidence?: string[] }[]; ledger?: { evidence?: string[] }; safety?: { metrics?: { info?: { cards?: boolean } } } } } };
const NO_CARDS = argv.includes("--no-cards");
const kstDate = (iso: string) => new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 10);
/** 카드로 쓴 책: 스냅샷 입력(정규화된 주문 입력)으로 브리프를 다시 만들어 절 카드·직업 장면을 얻는다(이전 책 원장은 없다). 실패하면 null(사전으로 센다). */
function cardsOf(snap: Snap): { cards: InfoCard[]; props: readonly string[] } | null {
  const input = snap.evidencePacket?.input, at = snap.createdAtIso;
  if (NO_CARDS || !snap.evidencePacket?.meta?.safety?.metrics?.info?.cards || !input || !at) return null;
  try { const brief = buildBrief(payloadToBriefInput(input as never, kstDate(at), at) as never, k); const cards = infoCardsOf(brief); return cards.length ? { cards, props: infoDictOf(brief).props ?? [] } : null; } catch { return null; }
}

function featureNames(ids: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of ids) { const id = raw.replace(/^feature:/, ""); const f = k.features.get(id); if (f) out.push(noHan(f.name), f.easyName); }
  return out;
}
function fromSnapshot(file: string, raw: unknown): Book {
  const snap = ((raw as { snapshot?: Snap }).snapshot ?? raw) as Snap, meta = snap.evidencePacket?.meta ?? {}, input = snap.evidencePacket?.input ?? {};
  const people = [input.person, input.personA, input.personB].filter(Boolean) as { name?: string; mbtiType?: string }[];
  const traits = [...(snap.draft.glossary ?? []).map(g => noHan(g.name)), ...(meta.chapters ?? []).flatMap(c => (c.evidence ?? []).filter(e => !/^MBTI/.test(e)).map(e => noHan(e.replace(/×MBTI$/, "")))),
    ...featureNames([...(meta.explained ?? []), ...(meta.ledger?.evidence ?? [])]), ...TERM_NAMES];
  const id = snap.reportId ? snap.reportId.slice(-4) : basename(file).replace(/\.(snapshot\.)?json$/, "");
  const cc = cardsOf(snap), job = input.userContext?.detailJob;
  return { id, product: snap.draft.productType ?? snap.productKey ?? "?", backing: Boolean(meta.scenes?.length || cc),
    chapters: snap.draft.chapters.map(c => ({ n: c.n, sections: c.sections, ...(c.keys ? { keys: c.keys } : {}) })), ...(cc ? { cards: cc.cards } : {}),
    dict: { traits: [...new Set(traits.filter(t => t.length >= 2))], names: people.flatMap(p => [p.name, p.name?.slice(1), p.mbtiType]).filter((x): x is string => Boolean(x && x.length >= 2)), scenes: (meta.scenes ?? []).filter(x => x.length >= 15),
      props: cc ? cc.props : job && job.length >= 2 ? [job] : [] } };
}
/** md 원고(「## 1. 제목」·「### 소제목」·빈 줄 문단). 머리 「# 상품 · 이름(…)」의 이름은 비교에서 지울 이름으로만 쓴다. */
function fromMarkdown(file: string, text: string): Book {
  const lines = text.split("\n"), chapters: InfoChapter[] = [];
  let cur: { n: number; sections: { heading: string; paragraphs: string[] }[] } | null = null;
  const head = lines[0] ?? "", name = head.match(/·\s*([가-힣]{2,4})(?:[(·×]|$)/)?.[1];
  for (const l of lines) {
    const h2 = l.match(/^## (\d+)\./); if (h2) { cur = { n: Number(h2[1]), sections: [] }; chapters.push(cur); continue; }
    if (!cur) continue;
    const h3 = l.match(/^### (.*)$/); if (h3) { cur.sections.push({ heading: h3[1], paragraphs: [] }); continue; }
    if (l.trim() && !/^[-#[>]/.test(l.trim()) && cur.sections.length) cur.sections.at(-1)!.paragraphs.push(l.trim());
  }
  const product = /궁합|×/.test(head) ? "saju_mbti_compatibility" : /종합/.test(head) ? "saju_mbti_full" : /커리어/.test(head) ? "career_money_study" : /연애/.test(head) ? "love_marriage_child" : "?";
  return { id: basename(file).replace(/\.md$/, ""), product, chapters, backing: false, dict: { traits: [...new Set([...TERM_NAMES, ...featureNames([...k.features.keys()])].filter(t => t.length >= 2))], names: name ? [name, name.slice(1)] : [], scenes: [] } };
}
function load(path: string): Book[] {
  if (statSync(path).isDirectory()) {
    // 같은 책의 스냅샷과 렌더 원고(X.snapshot.json · X.final.md)가 함께 있으면 스냅샷만(메타 장면이 있다). 감독 스냅샷(snapshot.json)이 있는 폴더는 그것만(book.md 빼고).
    const files = readdirSync(path), snaps = new Set(files.filter(f => f.endsWith(".snapshot.json")).map(f => f.replace(/\.snapshot\.json$/, ""))), sup = files.includes("snapshot.json");
    const mine = files.filter(f => (sup ? f === "snapshot.json" : /(\.snapshot\.json|^report_.*\.json|\.md)$/.test(f) && !/metrics\.json$/.test(f) && !(f.endsWith(".final.md") && snaps.has(f.replace(/\.final\.md$/, "")))));
    const dirs = files.filter(f => !f.startsWith(".") && f !== "node_modules" && statSync(join(path, f)).isDirectory());
    return [...mine.sort().flatMap(f => load(join(path, f))), ...dirs.sort().flatMap(d => load(join(path, d)))];
  }
  const text = readFileSync(path, "utf8");
  if (path.endsWith(".md")) return /^## \d+\./m.test(text) ? [fromMarkdown(path, text)] : [];
  try { const raw = JSON.parse(text); const s = (raw.snapshot ?? raw) as Snap; const b = s?.draft?.chapters ? fromSnapshot(path, raw) : null;
    // 감독 스냅샷(…/<이름>/snapshot.json)은 책 id = report id 끝 4자(없으면 폴더 이름).
    return b ? [basename(path) === "snapshot.json" && !s.reportId ? { ...b, id: basename(join(path, "..")) } : b] : []; } catch { return []; }
}

const COLS: [string, (m: InfoMetric, b: Book) => string | number][] = [
  ["책", (_m, b) => b.id], ["상품", (_m, b) => b.product.replace(/^saju_mbti_/, "").replace(/_.*$/, "")], ["문장", m => m.sentences], ["절", m => m.sections],
  ["근거/절", m => (m.totals.evidenceUsed / Math.max(1, m.sections)).toFixed(1)], ["근거0절", m => m.totals.evidenceZero], ["재진술", m => m.totals.restatements], ["교훈문", m => m.totals.lessons],
  ["같은문장", m => m.totals.sameSentence], ["재탕", m => m.totals.rehash], ["같은구절", m => m.totals.phraseRepeat], ["처방3+", m => m.totals.rxRepeat], ["3장+계열", m => m.totals.rxFamilies3], ["한줄", m => m.rxFamilies["한 줄 말하기"] ?? 0],
  ["장면", m => m.totals.scenes], ["근거없는장면", (m, b) => `${m.totals.sceneUnbacked}${b.backing ? "" : "*"}`], ["첫문장", m => m.totals.sceneFirst], ["MBTI장면", m => m.totals.sceneMbti], ["장면물음", m => m.totals.sceneAsk ?? 0], ["카드", (_m, b) => (b.cards?.length ? "Y" : "-")],
  ["노출 등급/규칙", m => `${m.totals.exposureGrade}/${m.totals.exposureRule}`], ["과용꼬리", m => m.totals.overusedTails],
];
const table = (rows: (string | number)[][]) => [`| ${COLS.map(c => c[0]).join(" | ")} |`, `|${COLS.map(() => "---").join("|")}|`, ...rows.map(r => `| ${r.join(" | ")} |`)].join("\n");

function evalBooks(paths: readonly string[]) {
  const books = paths.flatMap(load), out: { id: string; product: string; metric: InfoMetric }[] = [];
  const rows: (string | number)[][] = [];
  for (const b of books) { const m = infoMetrics(b.chapters, { dict: b.dict, ...(b.cards?.length ? { cards: b.cards } : {}) }); out.push({ id: b.id, product: b.product, metric: { ...m, at: { sameSentence: [], rehash: [], sceneUnbacked: [], exposure: [] } } }); rows.push(COLS.map(c => c[1](m, b))); }
  console.log(table(rows));
  const T = (f: (m: InfoMetric) => number) => out.reduce((a, x) => a + f(x.metric), 0);
  console.log(`\n합계 ${out.length}권: 같은문장 ${T(m => m.totals.sameSentence)}(책 ${out.filter(x => x.metric.totals.sameSentence).length}) · 재탕 ${T(m => m.totals.rehash)} · 같은 구절 ${T(m => m.totals.phraseRepeat)} · 3장+ 처방 계열이 있는 책 ${out.filter(x => x.metric.totals.rxFamilies3).length}/${out.length}(계열 ${T(m => m.totals.rxFamilies3)}) · 처방 3번째+ ${T(m => m.totals.rxRepeat)} · 장 끝 교훈문 ${T(m => m.totals.lessons)}(책 ${out.filter(x => x.metric.totals.lessons).length}) · 재진술 ${T(m => m.totals.restatements)} · 과용 꼬리 틀 ${T(m => m.totals.overusedTails)} · 생활 장면 ${T(m => m.totals.scenes)} 중 근거 없음 ${T(m => m.totals.sceneUnbacked)}(첫 문장 ${T(m => m.totals.sceneFirst)} · MBTI ${T(m => m.totals.sceneMbti)}) · 근거 없는 장면 물음 ${T(m => m.totals.sceneAsk ?? 0)} · 카드 책 ${books.filter(b => b.cards?.length).length} · 노출 등급 ${T(m => m.totals.exposureGrade)} · 규칙 ${T(m => m.totals.exposureRule)}(책 ${out.filter(x => x.metric.totals.exposure).length})`);
  if (books.some(b => !b.backing)) console.log("* 장면 근거(meta.scenes)가 없는 원고 — 근거 없는 장면은 후보 수(근거 대조 안 함).");
  const json = arg("--json"); if (json) writeFileSync(json, JSON.stringify(out, null, 1));
}

/** KNOWN3 → 범주마다 어느 지표가 그 문장을 잡았나(final2 원고 4권). */
const KNOWN_BOOK: Readonly<Record<string, string>> = { "final2-deokmin-full": "deokmin-full", "final2-sodam-career": "sodam-career", "final2-sodam-love": "sodam-love", "final2-sodam-seongmin": "sodam-seongmin" };
const RELEVANT: Readonly<Record<Cat, readonly InfoKind[]>> = { R: ["sameSentence", "rehash", "phraseRepeat", "rxRepeat"], L: ["exposureGrade", "exposureRule"], I: ["sceneUnbacked"], F: [], C: [], T: [], A: [] };
function evalKnown() {
  const books = new Map(Object.entries(KNOWN_BOOK).map(([key, f]) => { const b = load(`docs/v5/final2/books/${f}.md`)[0]; const m = infoMetrics(b.chapters, { dict: b.dict, detail: true }); return [key, { b, m }]; }));
  const by = new Map<Cat, { n: number; sentence: number; caught: number; any: number; kinds: Record<string, number> }>();
  for (const it of KNOWN3) {
    const e = by.get(it.cat) ?? { n: 0, sentence: 0, caught: 0, any: 0, kinds: {} }; by.set(it.cat, e); e.n++;
    if (it.layer !== "sentence") continue; e.sentence++;
    const x = books.get(it.book); if (!x) continue;
    const kinds = new Set<InfoKind>();
    for (const h of x.m.hits ?? []) {
      const sec = x.b.chapters.find(c => c.n === h.c)?.sections[h.s]; if (!sec) continue;
      const sen = sec.paragraphs.flatMap(p => splitSentences(p))[h.i] ?? ""; if (it.re.test(sen)) for (const kd of h.kinds) kinds.add(kd);
    }
    if (kinds.size) e.any++;
    if (RELEVANT[it.cat].some(kd => kinds.has(kd))) e.caught++;
    for (const kd of kinds) e.kinds[kd] = (e.kinds[kd] ?? 0) + 1;
  }
  console.log("| 범주 | KNOWN3 | 문장 층 | 담당 지표가 잡음 | 아무 지표나 | 걸린 지표(문장 수) |\n|---|---|---|---|---|---|");
  for (const [cat, e] of [...by].sort()) console.log(`| ${cat} | ${e.n} | ${e.sentence} | ${RELEVANT[cat].length ? e.caught : "—"} | ${e.any} | ${Object.entries(e.kinds).map(([a, b]) => `${a} ${b}`).join(" · ") || "—"} |`);
}

/** research-w2(3c2b7bac) 결함 인용 — 노출·장면 꼴(저장소 문서에 있는 인용만, 고객 글 아님). */
const RW2_QUOTES: readonly [string, string, "exposure" | "scene"][] = [
  ["CO4", "그 매우 신약한 힘은 혼자 버티기보다 빌려 쓰는 쪽이에요.", "exposure"], ["R7", "규칙의 힘은 약입니다.", "exposure"], ["R7", "내 힘의 세기는 매우 신약이에요.", "exposure"], ["R7", "관성 세기 보통이라 규칙을 지키는 힘이 고르게 있어요.", "exposure"],
  ["LO1", "시간 미상이 아니라 태어난 시각이 있어서 자녀 자리를 볼 수 있어요.", "exposure"], ["LO7", "부모님 이야기는 가정으로만 그려 볼게요.", "exposure"],
  ["4-4", "자녀는 아직 입력된 게 없으니, 이건 가정 속 이야기예요.", "exposure"], ["5-5", "이 책은 2026년 11월 13일을 기준으로 썼어요.", "exposure"], ["5-5", "기준일에 마지막 해를 지나고 있어요.", "exposure"],
  ["F1·R9", "택배 도착 알림이 오면 상자부터 열어 보는 편이죠.", "scene"], ["R9", "퇴근길 지하철에서 메시지를 몇 번이고 고쳐 쓰지 않나요?", "scene"], ["C6", "잔고가 빠듯한 주에는 장바구니를 비우곤 해요.", "scene"],
];
function evalQuotes() {
  console.log("| rw2 ID | 꼴 | 잡음 |\n|---|---|---|");
  const scene = (q: string) => { const h = concreteScene(q); return h ? `${h.ask ? "장면 물음" : "장면 단정"}(${h.nouns.join("·")})` : "못 잡음"; };
  for (const [id, q, kind] of RW2_QUOTES) console.log(`| ${id} | ${kind} | ${kind === "exposure" ? exposureHits(q).map(h => `${h.kind}:${h.id}`).join(",") || "못 잡음" : scene(q)} |`);
}

if (argv.includes("--known")) evalKnown();
else if (argv.includes("--quotes")) evalQuotes();
else evalBooks(argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--json"));
