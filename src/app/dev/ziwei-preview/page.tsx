import { notFound } from "next/navigation";
import { StoredBookReport } from "../../../lib/book/storedReport";
import { buildV5Snapshot } from "../../../lib/writer/publish";
import { ziweiMockStreamFor } from "../../../lib/writer/chunked/ziweiMock";

/**
 * ZW-2 4부 개발 전용(배포 빌드는 proxy가 /dev/*를 404로 막는다): 7부 실측 5명의 자미 책을 가짜 작가(호출 0)로 만들어 실제 저장 책 화면(StoredBookReport)으로 보인다.
 * 명반 · 사화 배지 · 대한 띠 · 주석 · 공유 숨김 화면 확인용. ?p=1~5.
 */
export const dynamic = "force-dynamic";
const P = [
  { name: "하린", birthDate: "1997-03-14", birthTime: "10:15", gender: "FEMALE", mbtiType: "ENFP", rel: "some", job: "freelancer" },
  { name: "도윤", birthDate: "1988-10-30", birthTime: "21:30", gender: "MALE", mbtiType: "", rel: "dating", job: "self_employed" },
  { name: "서윤", birthDate: "1983-07-08", birthTime: "10:15", gender: "FEMALE", mbtiType: "ISFJ", rel: "married", job: "employee", children: "has" },
  { name: "지아", birthDate: "2005-03-05", slot: "MYOSI", gender: "FEMALE", mbtiType: "", rel: "single", job: "student" },
  { name: "민준", birthDate: "1991-02-10", birthTime: "14:20", gender: "MALE", mbtiType: "INTP", rel: "married", job: "unemployed" },
] as const;
export default async function ZiweiPreview({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const i = Math.min(5, Math.max(1, Number((await searchParams).p ?? 3))) - 1, x = P[i];
  const payload = { productKey: "ziwei_full", productSlug: "ziwei-full",
    person: { name: x.name, birthDate: x.birthDate, birthTimePrecision: "slot" in x ? "approximate" : "exact", birthTime: "birthTime" in x ? x.birthTime : "", birthTimeUnknown: false, approximateBirthTimeSlot: "slot" in x ? x.slot : "", gender: x.gender, mbtiType: x.mbtiType },
    userContext: { relationshipStatus: x.rel, jobStatus: x.job, detailJob: "", focusAreas: [] }, productOptions: "children" in x ? { children: x.children } : {} } as never;
  const at = "2026-12-02T01:00:00.000Z";
  const { snapshot } = await buildV5Snapshot({ payload, reportId: `report_zw2preview000${i + 1}`, policyAt: at, sink: { save: async () => true, load: async () => [] }, deps: { provider: "anthropic", model: "claude-mock", fallback: null, stream: await ziweiMockStreamFor(payload, at) } });
  return <StoredBookReport snapshot={snapshot} home="/dev/ziwei-preview" shareOwner={{ reportId: `report_zw2preview000${i + 1}`, local: true }} />;
}
