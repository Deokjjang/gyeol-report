/**
 * AM 7부 최종 생성(실호출, 한 번만). 가상 인물만. 운영 작가(Anthropic Sonnet 5.5 정식본), 운영과 같은 발행 함수(buildV5Snapshot).
 *   NODE_PATH=tools/llm/shim LLM_PROMPT_CACHE=on pnpm exec tsx tools/annual-major/final.ts --budget 8 [--only annual|major|launch] [--case <id>]
 * API 규칙(덕짱님 지시): 상품별 첫 권 → 자동 점검(잘림·소요 시간·분량·장 수·형식·안전망 위반) → 통과하면 나머지. 실패하면 멈춘다(원인을 고친 뒤 그 권만 --case로 1회).
 * 모든 호출은 tools/llm/budget.ts(범위 am-final 상한 $8, 같은 입력 재생성 거절, 원장·api-cost-log 기록)를 지난다.
 * 결과(검토 묶음, git 밖): ~/Desktop/gyeol-review/annual-major/<case>/{snapshot.json, book.md, check.md}. 고객 원고가 아니라 가상 인물이다.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { projectV5Book, validateV5Publication, type V5BookDraft, type V5Evidence } from "../../src/lib/writer/book";
import { styleScore } from "../../src/lib/writer/safety/style";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { orderCostCap } from "../../src/lib/ops/generation/policy";
import { budgetArg, budgetGate, ensureScope, startGate } from "../llm/budget";
import { loadDevEnv } from "../llm/env";
import { manuscript } from "../final/replay";
import { payloadOf } from "./mockRun";

export const OUT = join(homedir(), "Desktop", "gyeol-review", "annual-major");
type Case = { id: string; product: "annual" | "major" | "launch"; payload: unknown; note: string };

/** 세운 6권(MBTI·일간 서로 다름) · 대운 4권 · 4종 4권(기준 원고와 같은 입력). 날짜는 판매 시작 무렵(2026-12-02). */
export function cases(): Case[] {
  const a = (id: string, note: string, p: Parameters<typeof payloadOf>[1]): Case => ({ id, product: "annual", payload: payloadOf("annual_fortune", p), note });
  const m = (id: string, note: string, p: Parameters<typeof payloadOf>[1]): Case => ({ id, product: "major", payload: payloadOf("major_fortune", p), note });
  const base = (name: string): Case => { const s = JSON.parse(readFileSync(join("docs/v5/baseline/p6d", `${name}.snapshot.json`), "utf8")) as { evidencePacket: { input: unknown } }; return { id: `launch-${name}`, product: "launch", payload: s.evidencePacket.input, note: `기준 원고 docs/v5/baseline/p6d/${name}와 같은 입력` }; };
  return [
    a("annual-1", "20대 후반 여성·직장인·솔로·소망 있음", { name: "한서윤", birthDate: "1998-04-17", birthTime: "08:20", gender: "FEMALE", mbti: "ENFP", job: "employee", rel: "single", wish: "2027년에는 지금 회사에서 인정받고, 좋아하는 사람도 생겼으면 좋겠어요" }),
    a("annual-2", "20대 초반 여성·취준생·연애 중·소망 있음", { name: "오다인", birthDate: "2004-09-03", birthTime: "14:40", gender: "FEMALE", mbti: "ISFJ", job: "job_seeker", rel: "dating", wish: "상반기 안에 첫 직장에 들어가고 싶어요. 남자친구와도 오래 가고 싶고요" }),
    a("annual-3", "30대 초반 여성·사업·기혼·소망 없음", { name: "문가은", birthDate: "1993-01-26", birthTime: "21:05", gender: "FEMALE", mbti: "ESTJ", job: "business_owner", rel: "married" }),
    a("annual-4", "삼재 해당 띠(1999 기묘 토끼띠, 2027 날삼재)", { name: "강하린", birthDate: "1999-07-13", birthTime: "05:50", gender: "FEMALE", mbti: "INFP", job: "freelancer", rel: "single", wish: "프리랜서 일이 꾸준히 들어왔으면 해요" }),
    a("annual-5", "시간 미상", { name: "백지수", birthDate: "1996-11-08", birthTime: "", gender: "FEMALE", mbti: "ENTJ", job: "employee", rel: "dating", unknown: true }),
    a("annual-6", "남성", { name: "서도현", birthDate: "1995-05-21", birthTime: "11:15", gender: "MALE", mbti: "ISTP", job: "employee", rel: "single", wish: "운동을 꾸준히 하고 돈을 모으고 싶어요" }),
    m("major-1", "순행·20대(28세, 다음 교운 2030)", { name: "윤태민", birthDate: "1998-11-03", birthTime: "10:30", gender: "MALE", mbti: "ENTP", job: "employee", rel: "single" }),
    m("major-2", "역행·30대(35세, 다음 교운 2029)", { name: "임재원", birthDate: "1991-06-30", birthTime: "16:20", gender: "MALE", mbti: "INFJ", job: "employee", rel: "married" }),
    m("major-3", "교운기가 1~2년 안(27세, 다음 교운 2027)", { name: "조유나", birthDate: "1999-08-15", birthTime: "13:10", gender: "FEMALE", mbti: "ESFP", job: "freelancer", rel: "dating" }),
    m("major-4", "50대 부모(가족 선물)·시간 미상(52세, 역행, 다음 교운 2029)", { name: "정미경", birthDate: "1974-04-20", birthTime: "", gender: "FEMALE", mbti: "", job: "homemaker", rel: "married", unknown: true }),
    base("sodam-full"), base("taeo-career"), base("chaerin-love"), base("pair-business"),
  ];
}

/** 자동 점검(첫 권): 잘림(작가 finish) · 소요 시간 · 분량 · 장 수 · 형식(발행 검사) · 안전망 위반(남은 사실·금지 깃발). */
export function autoCheck(snap: { productType: string; draft: unknown; evidencePacket: unknown }, product: Case["product"]): { ok: boolean; lines: string[] } {
  const d = snap.draft as V5BookDraft, e = snap.evidencePacket as V5Evidence, meta = e.meta;
  const writerCalls = meta.calls.filter(c => c.kind === "first" || c.kind === "retry" || c.kind === "continuation");
  const last = writerCalls.at(-1);
  const chars = d.chapters.reduce((a, c) => a + c.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0), 0);
  const v = validateV5Publication(snap.productType, snap.draft, snap.evidencePacket);
  const remaining = ((meta.safety.metrics as { p6c?: { remaining?: Record<string, number> } } | undefined)?.p6c?.remaining) ?? {};
  const hardLeft = ((meta.review as { remainingHard?: unknown[] } | undefined)?.remainingHard ?? []).length;
  const det = meta.chapters.filter(c => c.source === "deterministic").length;
  const minChars = product === "annual" ? 10000 : product === "major" ? 12000 : 8000; // 멈춤 하한(목표 하한의 약 75%). 목표 대비는 점검표에 적는다.
  const checks: [boolean, string][] = [
    [last?.finish === "complete", `잘림: 작가 마지막 호출 ${last?.kind}·finish=${last?.finish} (이어 쓰기 ${writerCalls.filter(c => c.kind === "continuation").length}회)`],
    [meta.durationMs < (product === "major" ? 300_000 : 480_000), `소요 시간 ${Math.round(meta.durationMs / 1000)}초`],
    [chars >= minChars, `분량 ${chars}자(멈춤 하한 ${minChars})`],
    [det === 0, `장 수 ${d.chapters.length}, 결정론 장 ${det}`],
    [v.ok, `형식 ${v.ok ? "OK" : v.errors.join(",")}`],
    [hardLeft === 0, `안전망 남은 사실·금지 ${hardLeft} · 남은 깃발 ${JSON.stringify(remaining)}`],
  ];
  return { ok: checks.every(c => c[0]), lines: checks.map(([ok, line]) => `${ok ? "PASS" : "FAIL"} ${line}`) };
}

function checklist(c: Case, snap: { productType: string; draft: unknown; evidencePacket: unknown }, check: { ok: boolean; lines: string[] }): string {
  const d = snap.draft as V5BookDraft & { annual?: { keywords: string[]; verdict?: string; samjae?: unknown } }, e = snap.evidencePacket as V5Evidence, meta = e.meta;
  const finals = d.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })), ...(ch.keys ? { keys: ch.keys } : {}) })) as FinalChapter[];
  const st = styleScore(finals);
  const chars = d.chapters.reduce((a, ch) => a + ch.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0), 0);
  const keyYears = (d.timeline?.cards ?? []).filter(x => (x as { keyYear?: unknown }).keyYear).map(x => `${x.key}(${((x as { keyYear: { reasons: string[] } }).keyYear.reasons).join(" · ")})`);
  const wishAt = d.chapters.filter(ch => ch.id === "wish" || ch.id === "big").map(ch => `${ch.n}장 ${ch.title}`);
  return [`# ${c.id} 점검표`, "", `- 입력 요약: ${c.note}`, `- 분량 ${chars}자 · 장 ${d.chapters.length} · 소요 ${Math.round(meta.durationMs / 1000)}초 · 비용 $${meta.costUsd.toFixed(4)}`,
    `- 토큰: 입력 ${meta.tokens.input}(캐시 ${meta.tokens.cachedInput}) · 출력 ${meta.tokens.output}`,
    `- 문체 점수: 반복률 ${st.repeatRate}% · 문장 시작 다양성 ${st.startDiversity}% · 같은 시작 3연속 ${st.startRuns} · 연결어 ${st.connectiveShare}%(${st.connectiveTop.map(([w, n]) => `${w} ${n}`).join(", ")}) · 용어표 위반 ${st.termViolations} · 리듬(평균 ${st.rhythm.meanLen}자, 변동 ${st.rhythm.cv}%, 짧은 ${st.rhythm.short}%, 긴 ${st.rhythm.long}%)`,
    `- 금지 표현(남은 사실·금지 깃발): ${((meta.review as { remainingHard?: unknown[] } | undefined)?.remainingHard ?? []).length}`,
    ...(d.annual ? [`- 키워드: ${d.annual.keywords.join(" · ")}(${(d.annual as { keywordSource?: string }).keywordSource}) · 한 해 판정 ${d.annual.verdict ?? "-"} · 삼재 ${d.annual.samjae ? JSON.stringify(d.annual.samjae) : "해당 없음"}`, `- 소망 반영 위치: ${wishAt.join(", ")}`] : []),
    ...(keyYears.length ? [`- 핵심 해 3개와 근거: ${keyYears.join(" / ")}`] : []),
    "", "## 자동 점검", ...check.lines.map(l => `- ${l}`), ""].join("\n");
}

async function main() {
  const argv = process.argv.slice(2), mock = argv.includes("--mock"), budget = mock ? 0 : budgetArg(argv), only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null, one = argv.includes("--case") ? argv[argv.indexOf("--case") + 1] : null;
  loadDevEnv();
  if (!mock && process.env.LLM_PROMPT_CACHE !== "on") { console.error("LLM_PROMPT_CACHE=on으로 돌린다(접두부 캐시 유지)"); process.exit(2); }
  const list = cases().filter(c => (!only || c.product === only) && (!one || c.id === one));
  if (!mock) { ensureScope("am-final", 8, "AM 7부 최종 생성(대운·세운·4종, Anthropic)"); if (!startGate({ scope: "am-final", runBudget: budget, books: list.length }).ok) { console.error("예산 관문: 시작하지 않음"); process.exit(2); } }
  // --mock: 가짜 작가(devMockStream, 호출 0)로 도구만 시험한다. 결과는 검토 묶음이 아니라 작업 폴더 밖 임시 경로.
  const out = mock ? (process.env.AM_MOCK_OUT ?? join(homedir(), ".cache", "gyeol-am-mock")) : OUT;
  mkdirSync(out, { recursive: true });
  const firstChecked = new Set<string>();
  for (const c of list) {
    const at = "2026-12-02T03:00:00.000Z";
    const gate = mock ? { stream: devMockStream("ok", c.payload as never, at), cache: undefined } : budgetGate({ scope: "am-final", run: `am-${c.id}`, runBudget: budget, stage: "AM 7부" });
    const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_am${c.id.replace(/[^a-z0-9]/g, "")}000000`, policyAt: at, sink: memorySink() as never,
      deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: gate.stream, ...(gate.cache ? { cache: gate.cache } : {}), costCapUsd: orderCostCap(), testRun: true } });
    const snap = built.snapshot as unknown as { productType: string; draft: unknown; evidencePacket: unknown }, check = autoCheck(snap, c.product);
    const dir = join(out, c.id); mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "snapshot.json"), JSON.stringify(snap));
    // 4종: 래칫(tools/quality/ratchet.ts --current <out>/ratchet)이 기준 원고와 같은 이름으로 읽는다.
    if (c.product === "launch") { mkdirSync(join(out, "ratchet"), { recursive: true }); writeFileSync(join(out, "ratchet", `${c.id.replace(/^launch-/, "")}.snapshot.json`), JSON.stringify(snap)); }
    writeFileSync(join(dir, "book.md"), manuscript(snap.draft as unknown as V5BookDraft));
    writeFileSync(join(dir, "check.md"), checklist(c, snap, check));
    void projectV5Book(snap as never, "2026-12-02");
    console.log(`${c.id}: ${check.ok ? "PASS" : "FAIL"} · $${(snap.evidencePacket as unknown as V5Evidence).meta.costUsd.toFixed(4)} · ${check.lines.join(" | ")}`);
    if (!mock && !firstChecked.has(c.product)) { firstChecked.add(c.product); if (!check.ok) { console.error(`${c.product} 첫 권 자동 점검 실패 — 멈춘다(원인을 고친 뒤 --case ${c.id}로 그 권만 1회)`); process.exit(1); } }
  }
}
if (process.argv[1]?.endsWith("final.ts")) void main().catch(e => { console.error(e); process.exit(1); });
