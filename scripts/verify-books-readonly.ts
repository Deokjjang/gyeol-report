// 공개 페이지 점검 (읽기 전용, 공유 URL·토큰 없음)
//
// 사용법
//   node --no-warnings scripts/verify-books-readonly.ts                      (기본: https://gyeolreport.com)
//   node --no-warnings scripts/verify-books-readonly.ts --base https://<host> [--path /extra ...]
//
// 하는 일
//   - 홈, 상품 페이지, 이벤트 페이지, sitemap.xml, robots.txt를 쿠키·로그인 없이 GET 한다. 요청당 20초 제한.
//   - 페이지: HTTP 200, 본문이 비지 않음, Next.js 서버 오류 표식이 없음.
//   - sitemap.xml·robots.txt: 저장소에 파일이 없어 404가 정상(WARN). 5xx·오류 표식이면 FAIL.
//   - 기존 Book 열람(보안 토큰 필요)은 하지 않는다. 그 확인은
//     tests/unit/payment/productionVersionCombos.test.ts와 배포 후 런타임 오류 감시로 대신한다.
//   - 경로마다 한 줄: PASS/WARN/FAIL, HTTP 상태, 이유. FAIL이 하나라도 있으면 종료 코드 1.
//   - 쓰기 요청은 하지 않는다. src/ 코드를 import하지 않는다(node 내장만 사용).

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_BASE = "https://gyeolreport.com";
export const TIMEOUT_MS = 20_000;
export const MIN_VISIBLE_TEXT = 50;

export type Target = { readonly path: string; readonly label: string; readonly optional: boolean };
// 이벤트 slug는 supabase/migrations의 캠페인 정의(gyeol-opening-2026).
export const DEFAULT_TARGETS: readonly Target[] = [
  { path: "/", label: "홈", optional: false },
  { path: "/products", label: "상품 목록", optional: false },
  { path: "/products/saju-mbti-full", label: "상품 상세(종합)", optional: false },
  { path: "/campaign/gyeol-opening-2026", label: "이벤트", optional: false },
  { path: "/sitemap.xml", label: "sitemap", optional: true },
  { path: "/robots.txt", label: "robots", optional: true },
];

export type Verdict = { readonly result: "PASS" | "WARN" | "FAIL"; readonly reason: string };

// 원본 응답에서 찾는 Next.js 서버 오류 표식.
const RAW_ERROR_MARKERS: readonly (readonly [RegExp, string])[] = [
  [/id="__next_error__"/, "Next.js 오류 화면(__next_error__)"],
  [/data-dgst="/, "서버 렌더 오류 digest"],
  [/\\?"digest\\?":\\?"[^"\\]+/, "서버 렌더 오류 digest"],
];
// 보이는 글자에서 찾는 Next.js 기본 오류 문구.
const TEXT_ERROR_MARKERS: readonly string[] = [
  "Application error: a server-side exception has occurred",
  "Application error: a client-side exception has occurred",
  "This page couldn’t load",
  "A server error occurred",
  "Internal Server Error",
];

/** HTML에서 사람이 보는 글자만 남긴다(head·script·style 제거). */
export function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<head[\s>][\s\S]*?<\/head>/gi, " ")
    .replace(/<(script|style|noscript|template|svg)[\s>][\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 응답 판정. 네트워크 없음(순수 함수). */
export function classify(target: Target, body: string, status: number): Verdict {
  if (status >= 500) return { result: "FAIL", reason: `서버 오류 HTTP ${status}` };
  for (const [pattern, reason] of RAW_ERROR_MARKERS) if (pattern.test(body)) return { result: "FAIL", reason };
  const text = visibleText(body);
  for (const marker of TEXT_ERROR_MARKERS) if (text.includes(marker)) return { result: "FAIL", reason: `Next.js 오류 문구 "${marker}"` };
  if (status === 404 && target.optional) return { result: "WARN", reason: "없음(404). 저장소에 파일이 없어 정상" };
  if (status !== 200) return { result: "FAIL", reason: `HTTP ${status}` };
  if (body.trim() === "") return { result: "FAIL", reason: "빈 응답" };
  if (!target.optional && text.length < MIN_VISIBLE_TEXT) return { result: "FAIL", reason: `보이는 글자 ${text.length}자(≥ ${MIN_VISIBLE_TEXT}자 필요)` };
  return { result: "PASS", reason: target.optional ? `${body.length}바이트` : `보이는 글자 ${text.length}자` };
}

export async function verifyTarget(base: string, target: Target): Promise<{ verdict: Verdict; line: string }> {
  const url = new URL(target.path, base).href;
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": "gyeol-verify-public-readonly/1" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = await response.text();
    const finalUrl = response.url || url;
    const verdict: Verdict = new URL(finalUrl).host !== new URL(url).host
      ? { result: "FAIL", reason: `다른 호스트로 리다이렉트(${new URL(finalUrl).host}, 로그인·보호 화면 의심)` }
      : classify(target, body, response.status);
    return { verdict, line: `${verdict.result} ${response.status}  ${target.label}  ${url}${finalUrl !== url ? `  final=${finalUrl}` : ""}  ${verdict.reason}` };
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    const verdict: Verdict = { result: "FAIL", reason: `요청 실패(${name === "TimeoutError" ? `${TIMEOUT_MS / 1000}초 초과` : name})` };
    return { verdict, line: `FAIL ---  ${target.label}  ${url}  ${verdict.reason}` };
  }
}

export function parseArgs(argv: readonly string[]): { base: string; targets: Target[] } {
  let base = DEFAULT_BASE;
  const targets = [...DEFAULT_TARGETS];
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i + 1];
    if (argv[i] === "--base" && value) { base = value; i += 1; }
    else if (argv[i] === "--path" && value?.startsWith("/")) { targets.push({ path: value, label: "추가", optional: false }); i += 1; }
    else throw new Error(`알 수 없는 인자: ${argv[i]} (--base <url>, --path </경로>)`);
  }
  const protocol = new URL(base).protocol;
  if (protocol !== "https:" && protocol !== "http:") throw new Error(`http(s) 주소만 받습니다: ${base}`);
  return { base, targets };
}

async function main(): Promise<void> {
  let options: ReturnType<typeof parseArgs>;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
  const counts = { PASS: 0, WARN: 0, FAIL: 0 };
  for (const target of options.targets) {
    const { verdict, line } = await verifyTarget(options.base, target);
    counts[verdict.result] += 1;
    console.log(line);
  }
  console.log(`합계 ${options.targets.length}건: PASS ${counts.PASS}, WARN ${counts.WARN}, FAIL ${counts.FAIL}`);
  process.exit(counts.FAIL > 0 ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  void main();
}
