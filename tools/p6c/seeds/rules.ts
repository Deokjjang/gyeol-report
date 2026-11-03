/**
 * P6c A1: 지식 DB 문장 → 재료(상황 씨앗·적용 방향·핵심 뜻). 원문은 그대로 두고 옆 필드에 쓴다(결정론 작가·부록은 원문을 쓴다).
 * 경로 규칙 하나 = (파일, JSON 경로 패턴, 종류, 결과 필드). extract.ts가 항목을 뽑고, merge.ts가 결과를 같은 규칙으로 되써 넣는다.
 *  seed  상황 씨앗: 장면 원문을 가리키는 짧은 명사구(8~22자)            → 장면 객체의 seed
 *  dir   적용 방향: 문장의 뜻을 "무엇 → 어디서/어떻게" 꼴의 구(12~48자)  → 옆 필드(…Dir)
 *  core  핵심 뜻: 용어 뜻을 낱말 묶음으로(16~64자)                       → meaningCore
 *  fn    MBTI 기능: 쉬운 이름(4~14자) | 방향(10~40자)                    → plain, dir
 */
export type Kind = "seed" | "dir" | "core" | "fn";
export type Rule = { readonly file: RegExp; readonly path: RegExp; readonly kind: Kind; readonly out: (path: string) => string };
const sib = (suffix: string) => (p: string) => p.replace(/\.([A-Za-z]+)(\[\d+\]|\.[A-Za-z]+)?$/, (_m, f: string, tail?: string) => `.${f}${suffix}${tail ?? ""}`);
export const RULES: readonly Rule[] = [
  // 명리 250
  { file: /^myeongri\//, path: /^features\[\d+\]\.scenes\.[a-z]+\[\d+\]\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.life$/, kind: "seed", out: p => p.replace(/\.life$/, ".lifeSeed") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.forYou\.[a-zA-Z_]+$/, kind: "dir", out: p => p.replace(".forYou.", ".forYouDir.") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.strengths\[\d+\]$/, kind: "dir", out: sib("Dir") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.overuse\[\d+\]$/, kind: "dir", out: sib("Dir") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.shadow$/, kind: "dir", out: p => p.replace(/\.shadow$/, ".shadowDir") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.meaning$/, kind: "core", out: p => p.replace(/\.meaning$/, ".meaningCore") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.remedy\.partner\[\d+\]$/, kind: "dir", out: sib("Dir") },
  // MBTI 16
  { file: /^mbti\//, path: /^profiles\[\d+\]\.signals\.[a-z]+\[\d+\]\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  { file: /^mbti\//, path: /^profiles\[\d+\]\.cognitiveFunctions\[\d+\]\.easy$/, kind: "fn", out: p => p.replace(/\.easy$/, "") },
  { file: /^mbti\//, path: /^profiles\[\d+\]\.shadows\[\d+\]$/, kind: "dir", out: sib("Dir") },
  { file: /^mbti\//, path: /^profiles\[\d+\]\.oneLiner$/, kind: "dir", out: p => p.replace(/\.oneLiner$/, ".oneLinerDir") },
  { file: /^mbti\//, path: /^profiles\[\d+\]\.conventionalCompat\[\d+\]\.why$/, kind: "dir", out: p => p.replace(/\.why$/, ".whyDir") },
  // Fusion 718
  { file: /^fusion\/[A-Z]{4}\.json$/, path: /^rules\[\d+\]\.why$/, kind: "dir", out: p => p.replace(/\.why$/, ".whyDir") },
  { file: /^fusion\/[A-Z]{4}\.json$/, path: /^rules\[\d+\]\.scene\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  // 궁합 관계 장면·연애 신호
  { file: /^compat\/scenes\.json$/, path: /^types\[\d+\]\.topics\[\d+\]\.scenes\[\d+\]\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  { file: /^love\/signals\.json$/, path: /^entries\[\d+\]\.(crush|contact|pushPull)\.line$/, kind: "dir", out: p => p.replace(/\.line$/, ".lineDir") },
  { file: /^love\/signals\.json$/, path: /^entries\[\d+\]\.(crush|contact|pushPull)\.scenes\[\d+\]\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  // 대운·세운 십성 장면·뜻
  { file: /^timeline\/ten-god-period\.json$/, path: /^entries\[\d+\]\.(year|month)\.scenes\[\d+\]\.text$/, kind: "seed", out: p => p.replace(/\.text$/, ".seed") },
  { file: /^timeline\/ten-god-period\.json$/, path: /^entries\[\d+\]\.(year|month)\.meaning$/, kind: "dir", out: p => p.replace(/\.meaning$/, ".meaningDir") },
  // 직무 근거
  { file: /^career\/catalog\.json$/, path: /^jobs\[\d+\]\.why$/, kind: "dir", out: p => p.replace(/\.why$/, ".whyDir") },
  // 2차(브리프에 문장으로 가던 나머지): MBTI 연결 이유·강약 규칙·자리 뉘앙스·카드 행동 줄
  // MBTI 연결 이유(mbtiLinks.why)는 20~30자 한 줄이라 재료로 바꾸지 않는다(복사는 원고 lint가 잡는다).
  { file: /^myeongri\//, path: /^features\[\d+\]\.strengthRules\.(strong|weak|duplicate|clash)$/, kind: "dir", out: p => p.replace(".strengthRules.", ".strengthRulesDir.") },
  { file: /^myeongri\//, path: /^features\[\d+\]\.positionNuance\.(year|month|day|hour)$/, kind: "dir", out: p => p.replace(".positionNuance.", ".positionNuanceDir.") },
  { file: /^timeline\/action-templates\.json$/, path: /^templates\[\d+\]\.text\[\d+\]$/, kind: "dir", out: sib("Dir") },
  { file: /^timeline\/ganji\.json$/, path: /^entries\[\d+\]\.(year|month)\.action$/, kind: "dir", out: p => p.replace(/\.action$/, ".actionDir") },
  { file: /^timeline\/ten-god-period\.json$/, path: /^entries\[\d+\]\.(year|month)\.action$/, kind: "dir", out: p => p.replace(/\.action$/, ".actionDir") },
];
/** 2차 규칙의 id(뽑기 범위를 가를 때). */
export const PHASE2 = /#features\[\d+\]\.(mbtiLinks\[\d+\]\.why|strengthRules\.|positionNuance\.)|action-templates\.json#|ganji\.json#entries\[\d+\]\.(year|month)\.action$|ten-god-period\.json#entries\[\d+\]\.(year|month)\.action$/;

/** JSON을 걸으며 (경로, 문자열)을 돌려준다. 경로 꼴: features[3].scenes.work[0].text */
export function* walk(o: unknown, path = ""): Generator<[string, string]> {
  if (typeof o === "string") { yield [path, o]; return; }
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) yield* walk(o[i], `${path}[${i}]`); return; }
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) yield* walk(v, path ? `${path}.${k}` : k);
}
/** 경로에 값을 쓴다(중간 객체가 없으면 만든다. 배열 첨자는 배열로). */
export function setPath(root: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.match(/[^.[\]]+|\[\d+\]/g)!.map(x => (x.startsWith("[") ? Number(x.slice(1, -1)) : x));
  let cur: Record<string | number, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i], next = parts[i + 1];
    if (cur[k] === undefined || cur[k] === null) cur[k] = typeof next === "number" ? [] : {};
    cur = cur[k] as Record<string | number, unknown>;
  }
  cur[parts.at(-1)!] = value;
}
