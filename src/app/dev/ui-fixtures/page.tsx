import { notFound } from "next/navigation";

export const metadata = { title: "UI fixtures", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// P5 화면 검수 전용: 저장된 Book 픽스처를 저장 데이터 그대로 연다. 개발 서버에서만.
const COMBOS = ["annual_fortune-v4", "career_money_study-v4", "love_marriage_child-v4", "major_fortune-v4", "saju_mbti_compatibility-v4", "saju_mbti_full-v4"];
// 로컬 개발 DB에서 뽑은 v5 Book(가상 인물, 결정론 작가): 대운·세운 카드, 궁합 점수 쪽 검수용.
const V5 = ["compatibility-v5", "major_fortune-v5", "annual_fortune-v5", "saju_mbti_full-v5"];
export default async function UiFixturesPage({ searchParams }: { searchParams?: Promise<{ combo?: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const combo = (await searchParams)?.combo ?? "saju_mbti_full-v4";
  if (!COMBOS.includes(combo) && !V5.includes(combo)) notFound();
  const [{ readFileSync }, { gunzipSync }, { StoredBookReport }] = await Promise.all([import("node:fs"), import("node:zlib"), import("../../../lib/book/storedReport")]);
  const snapshot = JSON.parse(gunzipSync(readFileSync(V5.includes(combo) ? `tests/fixtures/ui-v5/${combo}.json.gz` : `tests/fixtures/production-version-combos/${combo}.json.gz`)).toString("utf8"));
  return <StoredBookReport snapshot={snapshot} home="/dev/ui-fixtures" />;
}
