/**
 * 고객 사실 → 장면 선택 프로필, 금지 사실 목록, 호칭·나이대.
 * 장면 판정(sceneFits)은 scripts/knowledge-lint.ts의 fitsProfile과 같은 규칙이다(결정 기록 docs/v5/p2-progress.md 2·3).
 */
import { FAMILY_MEMBER, SCENE_CONTEXT } from "@/lib/writer/safety/patterns";
import type { MbtiType, SceneRequires } from "@/data/knowledge-v5/schema";

export type RelationshipFact = "single" | "dating" | "married" | "unknown";
export type ChildrenFact = "has" | "none" | "unknown";
export type JobFact = "employed" | "business" | "student" | "none";
/**
 * scene(P6b B-6): 장면 글이 고객 사실과 맞는지 보는 생활 맥락. office = 사무직 소품(기획서·회의실…)이 맞는 직업,
 * school = 학생 소품(minor: 매점·담임까지, college: 강의실·학점까지), familyOk = 부모·형제 호칭이 입력 사실인 책(부모·자녀 궁합).
 */
export type SceneCtx = { readonly office: boolean; readonly school: "minor" | "college" | null; readonly familyOk: boolean;
  /** P6e 16: 코드·팀·가게·돌봄 장면이 맞는 생활(개발 직군·직장 소속·가게/서비스·의료/돌봄 직군). 없으면(옛 시험) 보지 않는다. */
  readonly code?: boolean; readonly team?: boolean; readonly shop?: boolean; readonly care?: boolean;
  /** 최종판 1-15: 의뢰·외주·개인 프로젝트 장면이 맞는 생활(프리랜서·창작·개발 직군). 없으면 보지 않는다. */
  readonly freelance?: boolean };
/**
 * 씨앗·장면의 직업군·상태 태그(P6e 16). 지식 DB 씨앗에 ctx로 적고(tools/p6e/tag-seeds.ts), 없으면 글에서 같은 규칙으로 읽는다.
 * office = 사무 소품(보고서·업무 지시·연차·결재…), code = 코드·프로그램, team = 팀·동료·후배(직장 소속), shop = 손님·가게, care = 환자·치료.
 */
export const SCENE_TAGS: Readonly<Record<"office" | "code" | "team" | "shop" | "care" | "freelance", RegExp>> = {
  office: /보고서(?!야)|업무 지시|연차 (눈치|쓰|내)|반차|수정본|결재|사내|부서|회의록|기획안|사원증|파티션|주간 회의|분기 목표|인사 평가|연봉 협상|발표 자료|엑셀|슬라이드|출장/,
  code: /코드|코딩|(작은|새|직접 만든|짠|만든) 프로그램|스크립트|버그|깃허브|자동화 (툴|스크립트)/,
  team: /팀에 (나눠|공유|제안)|팀원|팀 회의|팀장|동료(들)?(에게|의|와| 고민)|후배|선배|상사/,
  shop: /손님|가게|매장|단골|진열대|오픈 준비|마감 정산|계산대/,
  care: /환자|진료|간호|병동|처치/,
  // 최종판 1-15: 장소담(카페 사장)에게 INTP 씨앗 「프리랜서 의뢰서」·「개인 프로젝트 폴더」가 갔다(P6e).
  freelance: /프리랜서|의뢰서|의뢰인|외주|클라이언트|개인 프로젝트/,
};
export type SceneTag = keyof typeof SCENE_TAGS;
export const sceneTagsOf = (text: string): SceneTag[] => (Object.keys(SCENE_TAGS) as SceneTag[]).filter(k => SCENE_TAGS[k].test(text));
/** 태그(또는 글)가 이 고객의 생활에 맞는가. */
export function sceneTagsFit(tags: readonly string[], p: FactProfile): boolean {
  const c = p.scene; if (!c) return true;
  return tags.every(t => t === "office" ? c.office : t === "code" ? c.code !== false : t === "team" ? c.team !== false : t === "shop" ? c.shop !== false : t === "care" ? c.care !== false : t === "freelance" ? c.freelance !== false : true);
}
export type FactProfile = { readonly relationship: RelationshipFact; readonly children: ChildrenFact; readonly job: JobFact; readonly scene?: SceneCtx };

export type CustomerFacts = {
  readonly name: string;
  readonly gender: "MALE" | "FEMALE" | null;
  readonly birthDate: string;
  readonly birthTimeUnknown: boolean;
  readonly mbti: MbtiType | null;
  /** reportInputTypes RelationshipStatus 원문("", single, some, dating, marriage_preparing, married). */
  readonly relationshipStatus: string;
  /** reportInputTypes JobStatus 원문. */
  readonly jobStatus: string;
  readonly detailJob: string;
  /** 입력 폼에 아직 없다. 없으면 unknown. */
  readonly children?: ChildrenFact;
};

export function toFactProfile(f: CustomerFacts): FactProfile {
  const relationship: RelationshipFact = f.relationshipStatus === "married" ? "married"
    : ["some", "dating", "marriage_preparing"].includes(f.relationshipStatus) ? "dating"
      : f.relationshipStatus === "single" ? "single" : "unknown";
  const job: JobFact = f.jobStatus === "employee" ? "employed"
    : f.jobStatus === "self_employed" || f.jobStatus === "business_owner" ? "business"
      : f.jobStatus === "student" ? "student" : "none";
  return { relationship, children: f.children ?? "unknown", job };
}

export function sceneFits(req: SceneRequires, p: FactProfile, text?: string): boolean {
  const rel = req.relationship === "any" || req.relationship === p.relationship || (req.relationship === "unmarried" && p.relationship !== "married");
  const child = req.children === "any" || (req.children === "has" ? p.children === "has" : p.children !== "has");
  const job = req.job === "any" || req.job === p.job;
  return rel && child && job && (text === undefined || sceneTextFits(text, p));
}

/** 장면 글 검사(P6b B-6): 입력에 없는 가족 구성원, 학생이 아닌데 학교 소품, 사무직이 아닌데 사무실 소품이면 쓰지 않는다. */
export function sceneTextFits(text: string, p: FactProfile): boolean {
  if (!p.scene?.familyOk && FAMILY_MEMBER.test(text)) return false;
  if (!p.scene) return true;
  if (SCENE_CONTEXT.school_minor.test(text) && p.scene.school !== "minor") return false;
  if (SCENE_CONTEXT.school.test(text) && !p.scene.school) return false;
  if (SCENE_CONTEXT.office.test(text) && !p.scene.office) return false;
  return sceneTagsFit(sceneTagsOf(text), p);
}

/** 사무직 소품이 맞는 직업군(props.json 직업군 id). 직업 입력이 없으면 직장·사업 상태로만 본다. */
const OFFICE_GROUPS = new Set(["startup-founder", "ui-ux-designer", "graphic-designer", "marketer", "pm-planner", "data-ai", "researcher-professor", "real-estate", "hr-admin", "developer", "lawyer", "insurance", "finance", "sales", "accounting", "reporter", "writer-editor", "civil-servant", "manufacturing-engineer"]);
const CODE_GROUPS = new Set(["developer", "data-ai", "startup-founder", "researcher-professor", "manufacturing-engineer"]);
const SHOP_GROUPS = new Set(["self-employed", "cafe", "pastry", "chef", "store-staff", "beauty", "hotel-travel", "real-estate", "insurance", "sales", "call-center", "pharmacist"]);
const CARE_GROUPS = new Set(["nurse", "doctor", "physio", "nursing-assistant", "vet", "dentist", "pharmacist", "counselor", "social-worker"]);
/** 의뢰·외주·개인 프로젝트 장면이 맞는 직업군(창작·개발·글). */
const FREELANCE_GROUPS = new Set(["developer", "data-ai", "ui-ux-designer", "graphic-designer", "illustrator-webtoon", "creator", "writer-editor", "music", "actor-model", "startup-founder"]);
export function sceneCtxOf(a: { jobGroupId: string | null; job: JobFact; age: number; familyOk?: boolean; freelancer?: boolean }): SceneCtx {
  const office = a.jobGroupId ? OFFICE_GROUPS.has(a.jobGroupId) : a.job === "employed" || a.job === "business";
  const school = a.job !== "student" ? null : a.age < 20 || a.jobGroupId === "highschool-student" ? "minor" : "college";
  // P6e 16: 카페 사장에게 "작은 프로그램·보고서 서론·업무 지시", 물리치료사에게 "연차 눈치·보고서 수정본", 구직자에게 "팀에 나눠 주는"이 갔다.
  return { office, school, familyOk: Boolean(a.familyOk),
    code: a.jobGroupId ? CODE_GROUPS.has(a.jobGroupId) : false, team: a.job === "employed", shop: a.job === "business" || (a.jobGroupId ? SHOP_GROUPS.has(a.jobGroupId) : false), freelance: Boolean(a.freelancer) || (a.jobGroupId ? FREELANCE_GROUPS.has(a.jobGroupId) : false), care: a.jobGroupId ? CARE_GROUPS.has(a.jobGroupId) : false };
}

/** 작가가 단정하면 안 되는 사실(입력에 없거나 반대인 것). */
export function forbiddenFacts(f: CustomerFacts, p: FactProfile): string[] {
  const out: string[] = [];
  if (p.relationship !== "dating") out.push("지금 연인이 있다고 쓰지 않는다");
  if (p.relationship !== "married") out.push("배우자·결혼 생활을 전제하지 않는다(결혼은 '함께 살게 되면' 조건형으로만)");
  if (p.relationship === "unknown") out.push("연애 상태(싱글·연애 중)를 단정하지 않는다");
  if (p.children !== "has") out.push("자녀가 있다고 쓰지 않는다(자녀는 '아이를 키우게 되면' 조건형으로만)");
  if (p.job !== "employed") out.push("회사 소속(상사·팀장·출근)을 전제하지 않는다");
  if (p.job !== "business") out.push("가게·사업 운영(손님·직원·매출)을 전제하지 않는다");
  if (p.job !== "student") out.push("학생(수업·담임·학기)을 전제하지 않는다");
  if (f.birthTimeUnknown) out.push("태어난 시각 기둥(시주)과 그 자리(자녀궁·말년)를 근거로 쓰지 않는다");
  if (!f.mbti) out.push("MBTI 유형·성격 유형 이야기를 하지 않는다");
  if (!f.gender) out.push("성별을 전제한 해석(배우자성·자녀성)을 하지 않는다");
  out.push("결혼·이별·합격·승진·사고·질병 같은 사건과 날짜를 확정하지 않는다", "돈의 액수·투자 종목·매수 시점을 말하지 않는다", "내부 용어·자료 이름·출처를 본문에 쓰지 않는다");
  return out;
}

/** 만 나이(기준일 기준). */
export function ageAt(birthDate: string, baseDate: string): number {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const [y, m, d] = baseDate.split("-").map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

export function ageBand(age: number): string {
  if (age < 20) return "10대";
  const decade = Math.floor(age / 10) * 10;
  const r = age % 10;
  return `${decade}대 ${r <= 3 ? "초반" : r <= 6 ? "중반" : "후반"}`;
}
