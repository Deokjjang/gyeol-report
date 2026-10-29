/**
 * 고객 사실 → 장면 선택 프로필, 금지 사실 목록, 호칭·나이대.
 * 장면 판정(sceneFits)은 scripts/knowledge-lint.ts의 fitsProfile과 같은 규칙이다(결정 기록 docs/v5/p2-progress.md 2·3).
 */
import type { MbtiType, SceneRequires } from "@/data/knowledge-v5/schema";

export type RelationshipFact = "single" | "dating" | "married" | "unknown";
export type ChildrenFact = "has" | "none" | "unknown";
export type JobFact = "employed" | "business" | "student" | "none";
export type FactProfile = { readonly relationship: RelationshipFact; readonly children: ChildrenFact; readonly job: JobFact };

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

export function sceneFits(req: SceneRequires, p: FactProfile): boolean {
  const rel = req.relationship === "any" || req.relationship === p.relationship || (req.relationship === "unmarried" && p.relationship !== "married");
  const child = req.children === "any" || (req.children === "has" ? p.children === "has" : p.children !== "has");
  const job = req.job === "any" || req.job === p.job;
  return rel && child && job;
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
