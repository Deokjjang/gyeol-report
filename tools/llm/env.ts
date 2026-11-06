/**
 * 개발 도구 환경 읽기(최종판). next dev와 같은 두 파일을 같은 우선순위로 읽는다: .env.development.local > .env.local (이미 있는 process.env는 덮지 않는다).
 * 값은 출력하지 않는다. envNames()는 파일별 변수 이름만 돌려준다(키 "있다/없다" 확인용).
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/** next dev가 묶어 실행하면 import.meta.dirname이 없을 수 있다 → 작업 폴더(저장소 뿌리에서 띄운다). */
export const ROOT = typeof import.meta.dirname === "string" ? resolve(import.meta.dirname, "../..") : process.cwd();
export const ENV_FILES = [".env.development.local", ".env.local"] as const;

function parse(file: string): Record<string, string> {
  const p = join(ROOT, file);
  if (!existsSync(p)) return {};
  return Object.fromEntries(readFileSync(p, "utf8").split("\n").flatMap(l => { const m = l.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/); return m ? [[m[1], m[2].trim().replace(/^["']|["']$/g, "")]] : []; }));
}

/** 두 파일을 process.env에 싣는다(먼저 읽은 파일이 이긴다). 돌려주는 값은 실은 이름뿐. */
export function loadDevEnv(): string[] {
  const loaded: string[] = [];
  for (const f of ENV_FILES) for (const [k, v] of Object.entries(parse(f))) if (process.env[k] === undefined) { process.env[k] = v; loaded.push(k); }
  return loaded;
}

/** 파일별 변수 이름(값 없음). */
export function envNames(): Record<string, string[]> {
  return Object.fromEntries(ENV_FILES.map(f => [f, Object.keys(parse(f)).sort()]));
}

if (typeof import.meta.filename === "string" && process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  for (const [f, names] of Object.entries(envNames())) console.log(`${f}: ${names.length ? names.join(" ") : "(없음)"}`);
  console.log(`ANTHROPIC_API_KEY: ${Object.values(envNames()).some(n => n.includes("ANTHROPIC_API_KEY")) ? "있다" : "없다"}`);
}
