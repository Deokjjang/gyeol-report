/**
 * 품질 하한선(래칫, P6e 0번): 권별 지표 다섯 개를 기준 원고와 견준다. 호출 0, 결정론.
 *   pnpm exec tsx tools/quality/ratchet.ts [--baseline docs/v5/baseline/p6d] [--current docs/v5/trial/p6e/final] [--out <json>]
 * 책은 <case>.snapshot.json(로컬 DB paid_report_snapshots.snapshot_json 그대로)으로 읽는다. 기준과 현재를 같은 코드·같은 사전으로 다시 잰다.
 *
 * ① 순수 본문 글자 수(공백 포함): 기준일 줄·안내·면책 문장 제외.
 * ② 쓰인 고유 근거 수: 명리 특성(그 사람 부록·용어 이름이 본문에 나옴) + MBTI 기능(쉬운 이름·약어) + MBTI 행동 특성(성향 단서, MBTI를 말한 문장)
 *    + Fusion(명리 특성 이름과 MBTI 단서가 한 문장에 함께 나온 특성 수).
 *    그 유형의 기능·태도와 어긋나는 성향 단서(P6e 4 오귀속, poleFits·cueMisfits)는 근거로 세지 않고, 그런 문장은 Fusion에도 넣지 않는다(--raw로 옛 방식).
 * ③ 생활 장면 문장 수: 구체 장소·물건·때 낱말이 든 문장.
 * ④ 다른 고객 원고와 겹치지 않는 문장 비율: 정규화 글자 5-gram 자카드 0.5 미만(같은 고객의 다른 책은 빼고, 다른 고객 책 + P6c 최종 7권과 견줌).
 *    기준·현재 비교에서는 견주는 다른 고객 묶음을 같게 한다(두 쪽에 다 있는 권 + P6c) — 한쪽에만 있는 권(예: 새 솔로 연애)이 비교 대상에 더해지면 비율이 기계적으로 내려간다.
 * ⑤ lint 위반 수: 지금 코드의 검사(lintBook)로 다시 센 수(브리프 글 복사·이전 책 겹침은 브리프 판에 따라 달라져 뺀다).
 * 통과: ① 기준의 97% 이상, ②③④ 기준 이상, ⑤ 기준 미만.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type Knowledge } from "@/lib/brief";
import type { Brief } from "@/lib/brief/schema";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { payloadToBriefInput, type V5BookDraft, type V5Evidence } from "@/lib/writer/book";
import { parseChapters } from "@/lib/writer/format";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { materialTable } from "@/lib/writer/prompt/materials";
import { kstDate, lintContext } from "@/lib/writer/publish";
import type { FinalChapter } from "@/lib/writer/safety";
import { overlapping } from "@/lib/writer/safety/lint";
import { HARD_RULES, lintBook } from "@/lib/writer/safety/p6c";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { isNoticeSentence } from "@/lib/writer/safety/p6e";
import { POLE_CUES, cueMisfits, poleFits } from "@/lib/brief/mbtiFn";

const ROOT = resolve(import.meta.dirname, "../..");
const arg = (name: string, def: string) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : def; };

export type Snapshot = { draft: V5BookDraft; evidencePacket: V5Evidence; createdAtIso?: string };
export type RatchetBook = { id: string; snap: Snapshot };
export type Metrics = {
  chars: number; evidence: { total: number; saju: number; mbtiFn: number; mbtiTrait: number; fusion: number; sajuTerms: string[]; fused: string[] };
  scenes: number; sentences: number; uniqueRatio: number; overlapSamples: string[]; lint: number; lintHard: number; lintByRule: Record<string, number>;
};

const stripMarks = (s: string) => s.replace(/[⟪⟫]/g, "");
/** 본문 문장(장·소제목·문단 순서). 카드 줄은 본문이 아니다. */
export function bodySentences(draft: Pick<V5BookDraft, "chapters">): string[] {
  return draft.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(stripMarks(p)))));
}
const DATE_LINE = /이 책은 \d{4}년 \d{1,2}월 \d{1,2}일 기준으로 썼어요/;
/** ① 순수 본문: 기준일 줄·안내·면책 문장을 뺀 문장의 글자 수(공백 포함, 문장 사이 공백 1칸). */
export function pureChars(draft: Pick<V5BookDraft, "chapters">): number {
  return bodySentences(draft).filter(s => !DATE_LINE.test(s) && !isNoticeSentence(s)).reduce((a, s) => a + s.length + 1, 0);
}

/** ③ 생활 장면 낱말: 장소·물건·때(누구나 떠올릴 수 있는 구체 낱말). 추상어(마음·힘·기운·일)는 넣지 않는다. */
const SCENE_WORDS = new RegExp([
  "카페", "회의실", "회의", "사무실", "매장", "가게", "부엌", "주방", "식탁", "거실", "침대", "책상", "창가", "베란다", "현관", "엘리베이터", "지하철", "버스", "택시", "주차장", "편의점", "마트", "시장", "헬스장", "공원", "산책", "도서관", "병원", "치료실", "은행", "교실", "식당", "술자리", "면접", "대기실", "골목", "바닷가", "캠핑", "여행", "출장", "이사",
  "휴대폰", "폰", "카톡", "단톡", "메시지", "문자", "전화", "알림", "메일", "메모", "수첩", "달력", "캘린더", "다이어리", "일정표", "체크리스트", "목록", "영수증", "통장", "카드값", "명세서", "가계부", "장바구니", "지갑", "커피", "라면", "국물", "도시락", "점심", "저녁밥", "간식", "케이크", "꽃", "선물", "편지", "사진", "포트폴리오", "자기소개서", "이력서", "보고서", "기획서", "시안", "견적", "가격표", "계약서", "화분", "향초", "이어폰", "노트북", "모니터", "플레이리스트", "드라마", "영화", "운동화", "우산", "가방", "냉장고", "서랍", "옷장", "설거지", "청소", "빨래", "택배", "예약", "주문", "메뉴", "영업", "손님", "단골", "환자", "후배", "선배", "동료", "팀장", "면접관", "이웃",
  "퇴근", "출근", "주말", "월요일", "금요일", "새벽", "자정", "연휴", "휴가", "생일", "기념일", "월급날", "마감 날", "약속 시간", "첫 만남", "데이트",
].join("|"));
export const isSceneSentence = (s: string) => SCENE_WORDS.test(s);

const noHan = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();
/** 그 사람의 명리 특성 이름(부록·용어 뜻): 본문에 그 이름이 나오면 쓰인 근거. 오행 과다·부족 같은 두 낱말 이름은 오행 이름으로 본다. */
function sajuTerms(draft: V5BookDraft): string[] {
  const names = new Set<string>();
  for (const p of draft.appendix ?? []) for (const it of p.items) { const n = noHan(it.name).replace(/ ?일주$/, ""); if (n.length >= 2 && !/ (부족|과다|균형|없음|많음)$/.test(n)) names.add(n); }
  for (const g of draft.glossary ?? []) { const n = noHan(g.name); if (n.length >= 2) names.add(n); }
  for (const n of ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인", "비겁", "식상", "재성", "관성", "인성"]) names.add(n);
  return [...names];
}
/** 다섯 힘의 쉬운 이름(P6e 14): 쉬운 이름으로만 써도 같은 근거로 센다. */
const GROUP_EASY: Readonly<Record<string, RegExp>> = { 비겁: /내 방식의 힘/, 식상: /만드는 힘/, 재성: /값을 받는 힘/, 관성: /규칙의 힘/, 인성: /배우는 힘/ };
const termIn = (t: string, s: string) => s.includes(t) || Boolean(GROUP_EASY[t]?.test(s));

function mbtiAnchors(types: readonly string[], k: Knowledge): { fn: Map<string, RegExp>; type: RegExp | null } {
  const table = materialTable(k), fn = new Map<string, RegExp>();
  for (const t of types) for (const f of k.mbti.get(t as never)?.cognitiveFunctions ?? []) {
    const plain = table.plain.get(f.easy); const parts = [`\\(${f.code}\\)`, `(?<![A-Za-z])${f.code}(?![A-Za-z])`, ...(plain ? [plain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")] : [])];
    fn.set(`${t}:${f.code}`, new RegExp(parts.join("|")));
  }
  return { fn, type: types.length ? new RegExp(types.join("|")) : null };
}

/** 문장에 나온 유형(없으면 책의 유형 전부): 성향 단서가 그 유형의 기능·태도와 맞는지 본다. */
const typesIn = (s: string, types: readonly string[]) => { const hit = types.filter(t => s.includes(t)); return hit.length ? hit : types; };
const poleOk = (id: string, s: string, types: readonly string[]) => typesIn(s, types).some(t => poleFits(t, id.slice(0, -1), id.endsWith("+") ? 1 : -1));
/** 오귀속 문장: 맞지 않는 성향 단서나 기능 단서가 든 MBTI 문장(P6e 4가 지워야 하는 꼴). */
const misattributed = (s: string, types: readonly string[]) => Object.entries(POLE_CUES).some(([id, re]) => re.test(s) && !poleOk(id, s, types)) || typesIn(s, types).every(t => cueMisfits(t, s).length > 0);

export function evidenceMetric(book: RatchetBook, k: Knowledge, raw = false): Metrics["evidence"] {
  const draft = book.snap.draft, sens = bodySentences(draft);
  const input = book.snap.evidencePacket.input as ReportInputPayload;
  const types = [...new Set(("person" in input ? [input.person.mbtiType] : [input.personA.mbtiType, input.personB.mbtiType]).filter(Boolean) as string[])];
  const terms = sajuTerms(draft), usedTerms = terms.filter(t => sens.some(s => termIn(t, s)));
  const a = mbtiAnchors(types, k);
  const fnUsed = [...a.fn.entries()].filter(([, re]) => sens.some(s => re.test(s))).map(([id]) => id);
  const mbtiSentence = (s: string) => (Boolean(a.type?.test(s)) || [...a.fn.values()].some(re => re.test(s)) || /성격|MBTI/.test(s)) && (raw || !types.length || !misattributed(s, types));
  const poles = new Set<string>();
  for (const s of sens) if (mbtiSentence(s)) for (const [id, re] of Object.entries(POLE_CUES)) if (re.test(s) && (raw || poleOk(id, s, types))) poles.add(id);
  const fused = usedTerms.filter(t => sens.some(s => termIn(t, s) && mbtiSentence(s)));
  return { total: usedTerms.length + fnUsed.length + poles.size + fused.length, saju: usedTerms.length, mbtiFn: fnUsed.length, mbtiTrait: poles.size, fusion: fused.length, sajuTerms: usedTerms, fused };
}

/** ⑤: 지금 코드의 검사. 브리프는 Book 입력·발행일로 다시 만든다. */
export function lintMetric(book: RatchetBook, k: Knowledge): { total: number; hard: number; byRule: Record<string, number> } {
  const input = book.snap.evidencePacket.input as ReportInputPayload;
  const brief: Brief = buildBrief(payloadToBriefInput(input, kstDate(book.snap.evidencePacket.generatedAt)) as never, k);
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const chapters: FinalChapter[] = book.snap.draft.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, sections: ch.sections, source: "writer" as const, chars: 0, ...(ch.keys ? { keys: ch.keys } : {}) }));
  const flags = lintBook(chapters, lintContext(brief, k, plan, [])).filter(f => f.rule !== "db_copy" && f.rule !== "prior_overlap");
  return { total: flags.length, hard: flags.filter(f => HARD_RULES.has(f.rule)).length, byRule: flags.reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {}) };
}

/** 사람 열쇠(이름·생일·시각): 같은 고객의 다른 책은 겹침 비교에서 뺀다. */
const personKeys = (input: ReportInputPayload) => ("person" in input ? [input.person] : [input.personA, input.personB]).map(p => `${p.name}|${p.birthDate}|${p.birthTime ?? ""}`);
export type CorpusBook = { id: string; people: string[]; sentences: string[] };
/** P6c 최종 7권(다른 고객 원고 묶음, 원고 md). */
export function p6cCorpus(): CorpusBook[] {
  const dir = join(ROOT, "docs/v5/trial/p6c/final");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith(".final.md")).map(f => {
    const chapters = parseChapters(readFileSync(join(dir, f), "utf8").replace(/^\[표지\].*\n/, ""));
    return { id: `p6c:${f.replace(".final.md", "")}`, people: [`p6c:${f}`], sentences: chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(stripMarks(p))))) };
  });
}
export function uniqueMetric(book: RatchetBook, corpus: readonly CorpusBook[]): { ratio: number; samples: string[] } {
  const mine = new Set(personKeys(book.snap.evidencePacket.input as ReportInputPayload));
  const others = corpus.filter(c => c.id !== book.id && !c.people.some(p => mine.has(p))).flatMap(c => c.sentences);
  const sens = bodySentences(book.snap.draft).filter(s => !DATE_LINE.test(s) && !isNoticeSentence(s));
  const hits = overlapping(others, sens);
  return { ratio: sens.length ? Math.round((1 - hits.length / sens.length) * 10000) / 10000 : 1, samples: hits.slice(0, 6).map(h => `${h.b} ≈ ${h.a}`) };
}

export function loadBooks(dir: string): RatchetBook[] {
  const abs = resolve(ROOT, dir);
  return readdirSync(abs).filter(f => f.endsWith(".snapshot.json")).sort().map(f => ({ id: f.replace(".snapshot.json", ""), snap: JSON.parse(readFileSync(join(abs, f), "utf8")) as Snapshot }));
}

/** corpusIds: 겹침 비교에 넣을 이 묶음의 권(없으면 전부). raw: ② 옛 방식(오귀속 단서도 셈). */
export function measureBooks(books: readonly RatchetBook[], k: Knowledge, extraCorpus: readonly CorpusBook[] = p6cCorpus(), opts: { corpusIds?: ReadonlySet<string>; raw?: boolean } = {}): Record<string, Metrics> {
  const corpus: CorpusBook[] = [...extraCorpus, ...books.filter(b => !opts.corpusIds || opts.corpusIds.has(b.id)).map(b => ({ id: b.id, people: personKeys(b.snap.evidencePacket.input as ReportInputPayload), sentences: bodySentences(b.snap.draft) }))];
  return Object.fromEntries(books.map(b => {
    const sens = bodySentences(b.snap.draft).filter(s => !DATE_LINE.test(s) && !isNoticeSentence(s));
    const u = uniqueMetric(b, corpus), l = lintMetric(b, k);
    return [b.id, { chars: pureChars(b.snap.draft), evidence: evidenceMetric(b, k, opts.raw), scenes: sens.filter(isSceneSentence).length, sentences: sens.length, uniqueRatio: u.ratio, overlapSamples: u.samples, lint: l.total, lintHard: l.hard, lintByRule: l.byRule } satisfies Metrics];
  }));
}

export type Verdict = { case: string; pass: boolean; checks: { name: string; base: number; now: number; rule: string; pass: boolean }[] };
export function compare(base: Metrics, now: Metrics, id: string): Verdict {
  const checks = [
    { name: "① 순수 본문 글자", base: base.chars, now: now.chars, rule: "≥ 97%", pass: now.chars >= base.chars * 0.97 },
    { name: "② 쓰인 고유 근거", base: base.evidence.total, now: now.evidence.total, rule: "≥", pass: now.evidence.total >= base.evidence.total },
    { name: "③ 생활 장면 문장", base: base.scenes, now: now.scenes, rule: "≥", pass: now.scenes >= base.scenes },
    { name: "④ 겹치지 않는 문장 비율", base: base.uniqueRatio, now: now.uniqueRatio, rule: "≥", pass: now.uniqueRatio >= base.uniqueRatio },
    { name: "⑤ lint 위반", base: base.lint, now: now.lint, rule: "<", pass: now.lint < base.lint || (base.lint === 0 && now.lint === 0) },
  ];
  return { case: id, pass: checks.every(c => c.pass), checks };
}

function main() {
  const k = loadKnowledge();
  const baseDir = arg("baseline", "docs/v5/baseline/p6d"), curDir = arg("current", ""), out = arg("out", "");
  const raw = process.argv.includes("--raw");
  const baseBooks = loadBooks(baseDir), curBooks = curDir ? loadBooks(curDir) : [];
  // 두 쪽에 다 있는 권만 서로의 겹침 비교 대상으로(현재가 없으면 기준 전부).
  const common = curDir ? new Set(baseBooks.map(b => b.id).filter(id => curBooks.some(c => c.id === id))) : undefined;
  const base = measureBooks(baseBooks, k, p6cCorpus(), { corpusIds: common, raw });
  const cur = curDir ? measureBooks(curBooks, k, p6cCorpus(), { corpusIds: common, raw }) : null;
  const verdicts = cur ? Object.keys(cur).filter(id => base[id]).map(id => compare(base[id], cur[id], id)) : [];
  const result = { measuredAt: new Date().toISOString(), baseline: baseDir, current: curDir || null, mode: raw ? "raw" : "p6e", base, ...(cur ? { cur, verdicts } : {}) };
  if (out) writeFileSync(resolve(ROOT, out), JSON.stringify(result, null, 1) + "\n");
  const row = (id: string, m: Metrics) => `| ${id} | ${m.chars} | ${m.evidence.total} (명리 ${m.evidence.saju} · 기능 ${m.evidence.mbtiFn} · 성향 ${m.evidence.mbtiTrait} · Fusion ${m.evidence.fusion}) | ${m.scenes} / ${m.sentences} | ${(m.uniqueRatio * 100).toFixed(1)}% | ${m.lint} (사실 ${m.lintHard}) |`;
  console.log(`기준 ${baseDir}\n| 권 | ① 글자 | ② 근거 | ③ 장면/문장 | ④ 겹치지 않음 | ⑤ lint |\n|---|---|---|---|---|---|`);
  for (const [id, m] of Object.entries(base)) console.log(row(id, m));
  if (cur) {
    console.log(`\n현재 ${curDir}\n| 권 | ① 글자 | ② 근거 | ③ 장면/문장 | ④ 겹치지 않음 | ⑤ lint |\n|---|---|---|---|---|---|`);
    for (const [id, m] of Object.entries(cur)) console.log(row(id, m));
    console.log("\n판정");
    for (const v of verdicts) console.log(`${v.pass ? "PASS" : "FAIL"} ${v.case}: ${v.checks.map(c => `${c.name} ${c.base}→${c.now}(${c.rule} ${c.pass ? "○" : "×"})`).join(" · ")}`);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) main();
