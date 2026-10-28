// 공유 Book 링크 열람 확인 (읽기 전용)
//
// 사용법
//   node scripts/verify-books-readonly.ts <url> [<url>...]
//   node scripts/verify-books-readonly.ts --file urls.txt     (한 줄에 URL 1개, 빈 줄·# 줄은 무시)
//
// 하는 일
//   - 각 URL을 쿠키·로그인 없이 GET 한다(리다이렉트는 따라가고 최종 URL을 적는다). 요청당 20초 제한.
//   - 200인지, 본문이 비지 않았는지, 오류·확인 필요·만료·없음 화면이 아닌지 본다.
//   - 공유 Book(/r/gr_...)은 첫 화면이 표지뿐이라, 같은 주소의 /book-data(JSON)까지 받아 본문 페이지가 있는지 본다.
//   - URL마다 한 줄: PASS/FAIL, HTTP 상태, 이유. 하나라도 FAIL이면 종료 코드 1.
//   - 쓰기 요청은 하지 않는다. 응답 본문은 짧은 발췌만 출력한다. src/ 코드를 import하지 않는다(node 내장만 사용).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const MIN_VISIBLE_TEXT = 200;
export const TIMEOUT_MS = 20_000;

export type Verdict = {
  readonly ok: boolean;
  readonly reason: string;
  /** "book-entry": 공유 Book 표지 화면. 본문은 /book-data로 따로 확인해야 한다. */
  readonly kind: "report" | "book-entry" | "error";
  readonly textLength: number;
  readonly snippet: string;
};

// 원본 HTML에서 찾는 Next.js 오류 표식(서버 렌더 실패, notFound(), 오류 경계).
const RAW_ERROR_MARKERS: readonly (readonly [RegExp, string])[] = [
  [/id="__next_error__"/, "Next.js 오류 화면(__next_error__)"],
  [/NEXT_HTTP_ERROR_FALLBACK/, "Next.js notFound/forbidden 처리"],
  [/NEXT_NOT_FOUND/, "Next.js notFound 처리"],
  [/data-dgst="/, "서버 렌더 오류 digest"],
  [/\\?"digest\\?":\\?"[^"\\]+/, "서버 렌더 오류 digest"],
];

// 보이는 글자에서 찾는 오류·상태 화면 문구(Next 기본 화면 + 제품 문구).
const TEXT_ERROR_MARKERS: readonly (readonly [string, string])[] = [
  ["Application error: a server-side exception has occurred", "Next.js 서버 오류"],
  ["Application error: a client-side exception has occurred", "Next.js 클라이언트 오류"],
  ["This page couldn’t load", "Next.js 오류 화면"],
  ["A server error occurred", "Next.js 서버 오류"],
  ["Internal Server Error", "500 Internal Server Error"],
  ["This page could not be found", "Next.js 404"],
  // src/app/r/[token]/page.tsx renderUnavailableState
  ["리포트를 열 수 없습니다", "공유 링크 열람 불가"],
  // src/components/report/ReportStatusView.tsx (attention = FAILED_REQUIRES_ATTENTION, 모르는 계산 버전 포함)
  ["리포트 준비에 확인이 필요합니다", "확인 필요(FAILED_REQUIRES_ATTENTION)"],
  ["리포트를 준비하고 있습니다", "아직 생성 중(발행 전)"],
  ["리포트 열람 기간이 종료되었습니다", "열람 기간 만료"],
  ["책을 확인하지 못했습니다", "Book 확인 실패"],
  ["결제 상태를 확인하고 있습니다", "결제 확인 중"],
  // src/app/reports/[reportId]/page.tsx
  ["리포트 정보가 올바르지 않습니다", "잘못된 리포트 주소"],
  ["리포트 상태를 확인하지 못했습니다", "리포트 상태 조회 실패"],
  ["리포트를 불러오지 못했습니다", "저장 형식 확인 불가(invalidSnapshot)"],
  ["책의 열람 정보를 확인하지 못했습니다", "Book 열람 정보 조회 실패"],
  ["상세 리포트 생성 대기 중입니다", "생성 대기"],
  // src/components/book/SharedBookEntry.tsx
  ["이 책을 열 수 없습니다", "공유 Book 열람 불가"],
];

const ENTITIES: Readonly<Record<string, string>> = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " " };

/** HTML에서 사람이 보는 글자만 남긴다(head·script·style·template·주석 제거). */
export function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<head[\s>][\s\S]*?<\/head>/gi, " ")
    .replace(/<(script|style|noscript|template|svg)[\s>][\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (whole, code: string) => {
      if (code[0] === "#") {
        const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : " ";
      }
      return ENTITIES[code.toLowerCase()] ?? whole;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function snippetOf(text: string): string {
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

/** 공유 Book 표지 화면(SharedBookEntry)인가. 본문은 클릭 후 /book-data로 받는다. */
export function isBookShareEntry(html: string): boolean {
  return /aria-label="[^"]*펼치기"/.test(html) && html.includes("책 펼치기");
}

/** 페이지 HTML 판정. 네트워크 없음(순수 함수). */
export function classify(html: string, status: number): Verdict {
  const text = visibleText(html);
  const base = { textLength: text.length, snippet: snippetOf(text) };
  if (status !== 200) return { ...base, ok: false, kind: "error", reason: `HTTP ${status}` };
  if (html.trim() === "") return { ...base, ok: false, kind: "error", reason: "빈 응답" };
  for (const [pattern, reason] of RAW_ERROR_MARKERS) {
    if (pattern.test(html)) return { ...base, ok: false, kind: "error", reason };
  }
  for (const [marker, reason] of TEXT_ERROR_MARKERS) {
    if (text.includes(marker)) return { ...base, ok: false, kind: "error", reason: `${reason}: "${marker}"` };
  }
  if (isBookShareEntry(html)) return { ...base, ok: true, kind: "book-entry", reason: "Book 표지 화면(본문은 book-data로 확인)" };
  if (text.length <= MIN_VISIBLE_TEXT) {
    return { ...base, ok: false, kind: "error", reason: `보이는 글자 ${text.length}자(> ${MIN_VISIBLE_TEXT}자 필요)` };
  }
  return { ...base, ok: true, kind: "report", reason: `본문 ${text.length}자` };
}

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value !== null && typeof value === "object") for (const item of Object.values(value)) collectStrings(item, out);
}

/** /r/<token>/book-data JSON 판정. 네트워크 없음(순수 함수). */
export function classifyBookData(body: string, status: number): Verdict {
  const base = { textLength: 0, snippet: "" };
  if (status !== 200) return { ...base, ok: false, kind: "error", reason: `book-data HTTP ${status}` };
  let parsed: unknown;
  try { parsed = JSON.parse(body); } catch { return { ...base, ok: false, kind: "error", reason: "book-data가 JSON이 아님" }; }
  const rawPages = (parsed as { data?: { pages?: unknown } } | null)?.data?.pages;
  const pages: unknown[] = Array.isArray(rawPages) ? rawPages : [];
  if (pages.length === 0) return { ...base, ok: false, kind: "error", reason: "book-data에 페이지 없음" };
  const strings: string[] = [];
  collectStrings(pages, strings);
  const length = strings.join(" ").replace(/\s+/g, " ").trim().length;
  if (length <= MIN_VISIBLE_TEXT) {
    return { ...base, textLength: length, ok: false, kind: "error", reason: `book-data 글자 ${length}자(> ${MIN_VISIBLE_TEXT}자 필요)` };
  }
  return { ...base, textLength: length, ok: true, kind: "report", reason: `Book ${pages.length}페이지, 글자 ${length}자` };
}

async function get(url: string, accept: string): Promise<{ status: number; finalUrl: string; body: string }> {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { accept, "user-agent": "gyeol-verify-books-readonly/1" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return { status: response.status, finalUrl: response.url || url, body: await response.text() };
}

export async function verifyUrl(url: string): Promise<{ ok: boolean; line: string }> {
  let page: Awaited<ReturnType<typeof get>>;
  try {
    page = await get(url, "text/html");
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return { ok: false, line: `FAIL ---  ${url}  요청 실패(${name === "TimeoutError" ? `${TIMEOUT_MS / 1000}초 초과` : name})` };
  }
  const moved = page.finalUrl !== url ? `  final=${page.finalUrl}` : "";
  const fail = (status: number | string, reason: string, snippet = "") =>
    ({ ok: false, line: `FAIL ${status}  ${url}${moved}  ${reason}${snippet ? `  발췌="${snippet}"` : ""}` });
  if (new URL(page.finalUrl).host !== new URL(url).host) return fail(page.status, "다른 호스트로 리다이렉트(로그인·보호 화면 의심)");
  const verdict = classify(page.body, page.status);
  if (!verdict.ok) return fail(page.status, verdict.reason, verdict.snippet);
  if (verdict.kind === "book-entry") {
    const dataUrl = new URL(page.finalUrl);
    dataUrl.pathname = `${dataUrl.pathname.replace(/\/+$/, "")}/book-data`;
    dataUrl.search = "";
    let data: Awaited<ReturnType<typeof get>>;
    try {
      data = await get(dataUrl.href, "application/json");
    } catch (error) {
      return fail(page.status, `book-data 요청 실패(${error instanceof Error ? error.name : "Error"})`);
    }
    const bookVerdict = classifyBookData(data.body, data.status);
    if (!bookVerdict.ok) return fail(page.status, bookVerdict.reason);
    return { ok: true, line: `PASS ${page.status}  ${url}${moved}  ${bookVerdict.reason}` };
  }
  return { ok: true, line: `PASS ${page.status}  ${url}${moved}  ${verdict.reason}` };
}

export function parseArgs(argv: readonly string[]): string[] {
  const urls: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--file") {
      const path = argv[i + 1];
      if (!path) throw new Error("--file 뒤에 파일 경로가 필요합니다");
      i += 1;
      for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) urls.push(trimmed);
      }
    } else {
      urls.push(argv[i]);
    }
  }
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error(`http(s) URL만 받습니다: ${url}`);
  }
  return urls;
}

async function main(): Promise<void> {
  let urls: string[];
  try {
    urls = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
  if (urls.length === 0) {
    console.error("사용법: node scripts/verify-books-readonly.ts <url> [<url>...] | --file urls.txt");
    process.exit(2);
  }
  let failed = 0;
  for (const url of urls) {
    const result = await verifyUrl(url);
    if (!result.ok) failed += 1;
    console.log(result.line);
  }
  console.log(`합계 ${urls.length}건: PASS ${urls.length - failed}, FAIL ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  void main();
}
