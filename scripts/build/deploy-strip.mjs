/**
 * P 속도(함수 크기): 배포 빌드에서만 실행 중에 쓰지 않는 파일을 빼서 함수에 딸려 가지 않게 한다.
 *  1) 개발 전용 라우트(/dev/*, /api/dev/*)의 진입 파일(page·route·layout·loading·error·not-found·template·default) — 함수로 올라가지 않는다.
 *     운영 화면이 가져다 쓰는 src/app/dev/book-preview/* 같은 일반 모듈은 남긴다. 주소 차단은 그대로 src/proxy.ts(/dev → 404).
 *  2) src/data/knowledge-v5/legacy — 작가 지식 DB를 폴더째 읽는 코드(brief/knowledge.ts·writer/publish.ts) 때문에 작가 함수 4개에 딸려 갔지만
 *     실행 중에는 읽지 않는다(지식 버전 해시도 legacy를 건너뛴다). 개발 도구(tools/)만 읽는다.
 *     next.config.ts는 v4 검증 기록이 해시로 고정해 두어 손대지 않고 여기서 뺀다.
 * - Vercel 빌드(VERCEL=1)에서만 돈다(package.json build). 로컬 next dev·시험·로컬 next build는 그대로다.
 * 로컬 확인: node scripts/build/deploy-strip.mjs --force <버려도 되는 복사본 루트>
 */
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const force = process.argv[2] === "--force";
if (!force && process.env.VERCEL !== "1") { console.log("[deploy-strip] VERCEL 빌드가 아니라 건너뜀"); process.exit(0); }
const root = resolve(force ? process.argv[3] ?? "." : ".");
const ENTRY = /^(page|route|layout|loading|error|not-found|template|default)\.(tsx|ts|jsx|js)$/;
const removed = [];
function walk(dir) {
  let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) { const p = join(dir, e.name); if (e.isDirectory()) walk(p); else if (ENTRY.test(e.name)) { rmSync(p); removed.push(p.slice(root.length + 1)); } }
}
for (const d of ["src/app/dev", "src/app/api/dev"]) { try { if (statSync(join(root, d)).isDirectory()) walk(join(root, d)); } catch { /* 없음 */ } }
const legacy = join(root, "src/data/knowledge-v5/legacy");
const hadLegacy = existsSync(legacy);
if (hadLegacy) rmSync(legacy, { recursive: true, force: true });
console.log(`[deploy-strip] 개발 라우트 진입 파일 ${removed.length}개${hadLegacy ? ", knowledge-v5/legacy" : ""}를 배포 빌드에서 뺐습니다.`);
