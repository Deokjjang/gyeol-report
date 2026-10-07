import type { LifeStatus, WeightedWorkMode, WorkMode } from "./guidanceCore";

/** Explicit job aliases describe work only, never personality. English aliases
 * have token boundaries: PM must not match PMO; artist must not match cartoonartist. */
export const WORK_MODE_ALIASES: Readonly<Partial<Record<WorkMode, readonly string[]>>> = {
  ITERATIVE_PRODUCT: ["개발자", "개발", "software", "developer", "frontend", "backend", "fullstack", "프론트엔드", "백엔드", "웹개발", "앱개발", "프로덕트", "product", "서비스기획", "pm", "product manager"],
  CRAFT_FINAL_OUTPUT: ["화가", "미술", "작가", "소설가", "시인", "작곡가", "작곡", "사진작가", "사진가", "공예", "일러스트", "illustrator", "artist", "디자이너", "디자인", "번역"],
  HIGH_STAKES_PRECISION: ["회계사", "회계", "세무사", "세무", "변호사", "법무", "법률", "의사", "간호사", "약사", "의료", "보안", "security", "감사", "품질관리", "quality", "재무", "안전"],
  EDITORIAL_REVIEW: ["출판", "편집자", "에디터", "editor", "교정", "교열", "출판기획", "콘텐츠편집"],
  RESEARCH_EXPLORATION: ["연구원", "연구", "research", "리서처", "리서치", "analyst", "분석가", "데이터분석", "전략", "strategy"],
  OPERATIONS_PROCESS: ["운영", "operations", "행정", "물류", "프로젝트관리", "project management", "pmo", "프로세스"],
  SALES_MARKET: ["영업", "sales", "세일즈", "마케팅", "marketing", "md", "bd", "business development", "커머스", "commerce", "판매"],
  PEOPLE_SERVICE: ["상담", "counselor", "고객지원", "customer support", "hr", "인사", "교사", "교육", "돌봄", "서비스"],
  LEADERSHIP_MANAGEMENT: ["팀장", "manager", "관리자", "임원", "executive", "대표", "ceo", "경영"],
  PERFORMANCE_PUBLIC: ["mc", "진행자", "아나운서", "방송", "공연", "강사", "speaker", "크리에이터", "creator", "유튜버"],
};
export const normalizeGuidanceJob = (text: string) => text.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
function matches(text: string, alias: string): boolean {
  if (/^[a-z ]+$/.test(alias)) return new RegExp(`(?:^|[^a-z0-9])${alias.replace(/ /g, "\\s+")}(?:$|[^a-z0-9])`).test(text);
  const compact = text.replace(/\s/g, "");
  // Avoid the explicit false friends in the canonical alias list.
  if (alias === "서비스" && /서비스\s*기획|서비스\s*개발/.test(text)) return false;
  if (alias === "의사" && /의사소통/.test(compact)) return false;
  return compact.includes(alias);
}
export function classifyGuidanceWorkModes(raw: string, status: LifeStatus): WeightedWorkMode[] {
  const text = normalizeGuidanceJob(raw), rows: WeightedWorkMode[] = [];
  for (const [key, aliases] of Object.entries(WORK_MODE_ALIASES)) {
    const matched = aliases.filter(a => matches(text, a));
    // "product manager" means product role, not evidence of managing people.
    const filtered = key === "LEADERSHIP_MANAGEMENT" && /product manager|project manager/.test(text) ? matched.filter(a => a !== "manager") : matched;
    if (filtered.length) rows.push({ mode: key as WorkMode, weight: 1, confidence: .9, matchedBy: filtered.map(a => `alias:${a}`).sort() });
  }
  if (status === "JOB_SEEKER") rows.push({ mode: "APPLICATION_MARKET", weight: 4, confidence: 1, matchedBy: ["lifeStatus:JOB_SEEKER"] });
  if (status === "STUDENT") rows.push({ mode: "LEARNING_PROJECT", weight: rows.length ? 3 : 1, confidence: 1, matchedBy: ["lifeStatus:STUDENT"] });
  if (status === "BUSINESS_OWNER" && !rows.some(r => r.mode === "LEADERSHIP_MANAGEMENT")) rows.push({ mode: "LEADERSHIP_MANAGEMENT", weight: .35, confidence: .65, matchedBy: ["lifeStatus:BUSINESS_OWNER"] });
  if (!rows.length) return [{ mode: "GENERAL", weight: 1, confidence: .35, matchedBy: [text ? "unmatched-job" : "no-job"] }];
  const total = rows.reduce((n, r) => n + r.weight, 0);
  return rows.map(r => ({ ...r, weight: r.weight / total })).sort((a, b) => b.weight - a.weight || a.mode.localeCompare(b.mode));
}
