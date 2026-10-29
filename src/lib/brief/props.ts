/**
 * 고객 사실 소품 사전(P3.5 A1, P3.6 A1·A2). 입력 직업 → 직업군 → 소품 12~16개, 관계 상태·생활 단계 소품도 같은 방식.
 * 생활 단계는 나이 하나가 아니라 나이 × 직업 상태 × 관계·자녀 조합으로 정한다(29세 회사원 = 사회 초년, 학생 소품 없음).
 * 작가가 브리프의 장면 문장을 그대로 옮기지 않고 이 고객의 생활로 다시 쓰도록, 장마다 소품 2~3개를 "장면 변주 힌트"로 준다.
 * 데이터: src/lib/brief/data/props.json. 직업군은 위에서부터 첫 일치(구체적인 것이 먼저).
 */
import { z } from "zod";
import data from "./data/props.json";
import type { FactProfile } from "./facts";

const Prop = z.string().min(2).max(14);
const Props = z.array(Prop).min(10).max(16);
export const LIFE_STAGES = ["student", "job_seeker", "early_career", "mid_career", "self_employed", "homemaker", "parenting", "retired", "unknown"] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];
export const PropsSchema = z.object({
  version: z.string(),
  jobs: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]+$/), name: z.string().min(2).max(16),
    keywords: z.array(z.string().min(1).max(12)).min(2), props: z.array(Prop).min(12).max(16),
  })).min(40),
  jobStatus: z.object({ student: Props, job_seeker: Props, employee: Props, freelancer: Props, self_employed: Props, business_owner: Props, homemaker: Props, unemployed: Props, other: Props, unknown: Props }),
  relationship: z.object({ single: Props, dating: Props, married: Props, unknown: Props }),
  lifeStage: z.object(Object.fromEntries(LIFE_STAGES.map(k => [k, Props])) as Record<LifeStage, typeof Props>),
});
export type PropsData = z.infer<typeof PropsSchema>;
export const PROPS: PropsData = PropsSchema.parse(data);

const squash = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/** 입력 직업(자유 입력)에서 직업군을 찾는다. 없으면 null. */
export function matchJob(detailJob: string, p: PropsData = PROPS): PropsData["jobs"][number] | null {
  const d = squash(detailJob);
  if (!d) return null;
  return p.jobs.find(j => j.keywords.some(k => d.includes(squash(k)))) ?? null;
}

export type CustomerProps = { readonly job: { readonly group: string | null; readonly props: readonly string[] }; readonly relationship: readonly string[]; readonly stage: { readonly key: LifeStage; readonly props: readonly string[] } };

/** 생활 단계: 나이 × 직업 상태 × 관계·자녀. 육아기는 자녀 입력이 있을 때만(자녀를 지어내지 않는다). */
export function lifeStage(f: { jobStatus: string; age: number }, profile: Pick<FactProfile, "children">): LifeStage {
  const s = f.jobStatus;
  if (f.age >= 60 || (f.age >= 55 && ["unemployed", "other", ""].includes(s))) return "retired";
  if (s === "student" || (f.age < 20 && !s)) return "student";
  if (profile.children === "has" && f.age < 55) return "parenting";
  if (s === "job_seeker") return "job_seeker";
  if (["freelancer", "self_employed", "business_owner"].includes(s)) return "self_employed";
  if (s === "homemaker") return "homemaker";
  if (s === "employee") return f.age < 31 ? "early_career" : "mid_career";
  return "unknown";
}

export function customerProps(f: { detailJob: string; jobStatus: string; age: number }, profile: FactProfile, p: PropsData = PROPS): CustomerProps {
  const group = matchJob(f.detailJob, p);
  const status = (f.jobStatus && f.jobStatus in p.jobStatus ? f.jobStatus : "unknown") as keyof PropsData["jobStatus"];
  const stage = lifeStage(f, profile);
  return {
    job: { group: group?.name ?? null, props: group?.props ?? p.jobStatus[status] },
    relationship: p.relationship[profile.relationship],
    stage: { key: stage, props: p.lifeStage[stage] },
  };
}
