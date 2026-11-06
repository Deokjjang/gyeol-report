/**
 * 고객 사실 소품 사전(P3.5 A1, P3.6 A1·A2). 입력 직업 → 직업군 → 소품 12~16개, 관계 상태·생활 단계 소품도 같은 방식.
 * 생활 단계는 나이 하나가 아니라 나이 × 직업 상태 × 관계·자녀 조합으로 정한다(29세 회사원 = 사회 초년, 학생 소품 없음).
 * 작가가 브리프의 장면 문장을 그대로 옮기지 않고 이 고객의 생활로 다시 쓰도록, 장마다 소품 2~3개를 "장면 변주 힌트"로 준다.
 * 데이터: src/lib/brief/data/props.json. 직업군은 위에서부터 첫 일치(구체적인 것이 먼저).
 */
import { z } from "zod";
import data from "./data/props.json";
import { sceneTextFits, type FactProfile } from "./facts";

const Prop = z.string().min(2).max(14);
const Props = z.array(Prop).min(10).max(16);
export const LIFE_STAGES = ["student", "job_seeker", "early_career", "mid_career", "self_employed", "homemaker", "parenting", "retired", "unknown"] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];
export const PropsSchema = z.object({
  version: z.string(),
  jobs: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]+$/), name: z.string().min(2).max(16),
    keywords: z.array(z.string().min(1).max(12)).min(2), props: z.array(Prop).min(12).max(16),
    /** 일의 단계별 장면 씨앗(P6c E1 커리어 2): 기획·실행·운영·협상마다 그 직업의 실제 업무 단위 2개(서비스 기획 = PRD·스프린트·지표·QA). */
    stages: z.object({ plan: z.array(Prop).length(2), execute: z.array(Prop).length(2), operate: z.array(Prop).length(2), negotiate: z.array(Prop).length(2) }).optional(),
  })).min(40),
  jobStatus: z.object({ student: Props, job_seeker: Props, employee: Props, freelancer: Props, self_employed: Props, business_owner: Props, homemaker: Props, unemployed: Props, other: Props, unknown: Props }),
  relationship: z.object({ single: Props, dating: Props, married: Props, unknown: Props }),
  /** college(P6c C1): 대학생 이상 학생의 생활 소품. student 소품은 초·중·고 소품(매점·성적표·필기 노트 빌리기)이라 19세 이상 학생에게는 이것을 쓴다. */
  lifeStage: z.object({ ...(Object.fromEntries(LIFE_STAGES.map(k => [k, Props])) as Record<LifeStage, typeof Props>), college: Props }),
});
export type PropsData = z.infer<typeof PropsSchema>;
export const PROPS: PropsData = PropsSchema.parse(data);

const squash = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/** 상태를 말하는 직업군(구직·자영업·살림): 분야 낱말이 함께 있으면 분야 쪽을 고른다. */
const STATUS_JOBS = new Set(["job-seeker", "self-employed", "homemaker"]);
/** 입력 직업(자유 입력)에서 직업군을 찾는다. 없으면 null.
 * P6e 판독: "마케팅 직무 재취업준비"가 구직(경영지원·인사 분야)으로 잡혀 커리어 직군 1순위에 "지금 목표 분야"로 붙었다 → 분야 낱말(마케팅)이 있으면 그쪽. */
export function matchJob(detailJob: string, p: PropsData = PROPS): PropsData["jobs"][number] | null {
  const d = squash(detailJob);
  if (!d) return null;
  const hits = p.jobs.filter(j => j.keywords.some(k => d.includes(squash(k))));
  // 상태 낱말 안에 든 분야 낱말("자영업" 안의 "영업")은 분야로 세지 않는다. 단 상태 낱말의 앞머리가 분야면("공무원준비"의 "공무원") 분야다(최종판 1-9).
  const spans = (j: PropsData["jobs"][number]) => j.keywords.map(squash).filter(k => k && d.includes(k)).map(k => [d.indexOf(k), d.indexOf(k) + k.length] as const);
  const statusSpans = hits.filter(j => STATUS_JOBS.has(j.id)).flatMap(spans);
  // 분야가 여럿이면 가장 긴 낱말이 맞은 쪽("대학원" > "학원", 최종판 1-9).
  const longest = (j: PropsData["jobs"][number]) => Math.max(0, ...j.keywords.map(squash).filter(k => k && d.includes(k)).map(k => k.length));
  const field = hits.filter(j => !STATUS_JOBS.has(j.id) && spans(j).some(([a, b]) => !statusSpans.some(([x, y]) => x <= a && b <= y && a !== x))).sort((x, y) => longest(y) - longest(x))[0];
  return field ?? hits[0] ?? null;
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
  // P6e 16: 소품도 직업군·상태 태그로 거른다(물리치료사에게 "보고서 수정본·연차 눈치", 구직자에게 팀·사무 소품이 생활 단계 소품으로 갔다).
  const fit = (xs: readonly string[]) => xs.filter(x => sceneTextFits(x, profile));
  return {
    job: { group: group?.name ?? null, props: fit(group?.props ?? p.jobStatus[status]) },
    relationship: p.relationship[profile.relationship],
    stage: { key: stage, props: fit(stage === "student" && f.age >= 19 ? p.lifeStage.college : p.lifeStage[stage]) },
  };
}
