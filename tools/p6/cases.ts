/** P6 실호출 원고 6권(종합 c1, 커리어 c1, 연애 Y, 궁합 연애 c1×c2, 대운 X, 세운 2026 c2). 시험 고객은 P3.5와 같다. */
import type { BriefPersonInput } from "../../src/lib/brief/buildBrief";
import { PEOPLE } from "../p35/people";

const person = (p: BriefPersonInput) => ({ name: p.name, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "", gender: p.gender, mbtiType: p.mbtiType });
const context = (p: BriefPersonInput) => ({ relationshipStatus: p.context!.relationshipStatus, jobStatus: p.context!.jobStatus, detailJob: p.context!.detailJob, focusAreas: [] });
const single = (productKey: string, productSlug: string, p: BriefPersonInput, productOptions: Record<string, string> = {}) => ({ productKey, productSlug, person: person(p), userContext: context(p), productOptions });

export const P6_CASES: readonly { readonly id: string; readonly label: string; readonly payload: unknown }[] = [
  { id: "c1-full", label: "종합 · 하람(c1)", payload: single("saju_mbti_full", "saju-mbti-full", PEOPLE.c1) },
  { id: "c1-career", label: "커리어 · 하람(c1)", payload: single("career_money_study", "career-money-study", PEOPLE.c1) },
  { id: "y-love", label: "연애 · 도현(Y)", payload: single("love_marriage_child", "love-marriage-child", PEOPLE.y) },
  { id: "pair-love", label: "궁합 연애 · 하람×서윤", payload: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", personA: person(PEOPLE.c1), personB: person(PEOPLE.c2) } },
  { id: "x-major", label: "대운 · 수진(X)", payload: single("major_fortune", "major-fortune", PEOPLE.x) },
  { id: "c2-annual", label: "세운 2026 · 서윤(c2)", payload: single("annual_fortune", "annual-fortune", PEOPLE.c2, { selectedYear: "2026" }) },
];

/** 작가 후보. 키는 각 worktree의 env 파일에서 실행 중에만 읽는다(복사하지 않는다). */
export const P6_MODELS = {
  A: { provider: "anthropic" as const, model: "claude-sonnet-5-5", keyFile: "/Users/Deokmin/Developer/gyeol-worktrees/v5-quality-q2/.env.local", keyName: "ANTHROPIC_API_KEY", capUsd: 5 },
  B: { provider: "openai" as const, model: "gpt-6.1-terra", keyFile: "/Users/Deokmin/Developer/gyeol-worktrees/v5-p3-writer/.env.development.local", keyName: "OPENAI_API_KEY", capUsd: 8 },
};
