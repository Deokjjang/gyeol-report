/**
 * 고객 사실 소품 사전(P3.5 A1). 입력 직업 → 직업군 → 소품 4~6개, 관계 상태·나이대 소품도 같은 방식.
 * 작가가 브리프의 장면 문장을 그대로 옮기지 않고 이 고객의 생활로 다시 쓰도록, 장마다 소품 2~3개를 "장면 변주 힌트"로 준다.
 * 데이터: src/lib/brief/data/props.json. 직업군은 위에서부터 첫 일치(구체적인 것이 먼저).
 */
import { z } from "zod";
import data from "./data/props.json";
import type { FactProfile } from "./facts";

const Prop = z.string().min(2).max(14);
const Props = z.array(Prop).min(4).max(6);
export const PropsSchema = z.object({
  version: z.string(),
  jobs: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]+$/), name: z.string().min(2).max(16),
    keywords: z.array(z.string().min(1).max(12)).min(2), props: Props,
  })).min(40),
  jobStatus: z.object({ student: Props, job_seeker: Props, employee: Props, freelancer: Props, self_employed: Props, business_owner: Props, homemaker: Props, unemployed: Props, other: Props, unknown: Props }),
  relationship: z.object({ single: Props, dating: Props, married: Props, unknown: Props }),
  age: z.object({ "10대": Props, "20대": Props, "30대": Props, "40대": Props, "50대": Props, "60대 이상": Props }),
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

export type CustomerProps = { readonly job: { readonly group: string | null; readonly props: readonly string[] }; readonly relationship: readonly string[]; readonly age: readonly string[] };

export function customerProps(f: { detailJob: string; jobStatus: string; age: number }, profile: FactProfile, p: PropsData = PROPS): CustomerProps {
  const group = matchJob(f.detailJob, p);
  const status = (f.jobStatus && f.jobStatus in p.jobStatus ? f.jobStatus : "unknown") as keyof PropsData["jobStatus"];
  const decade = f.age < 20 ? "10대" : f.age >= 60 ? "60대 이상" : `${Math.floor(f.age / 10) * 10}대` as keyof PropsData["age"];
  return {
    job: { group: group?.name ?? null, props: group?.props ?? p.jobStatus[status] },
    relationship: p.relationship[profile.relationship],
    age: p.age[decade],
  };
}
