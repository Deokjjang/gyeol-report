import { notFound } from "next/navigation";
import { ReportReadingFrame } from "../../../components/report/ReportReadingFrame";
import { createComprehensiveV3 } from "../../../lib/report-generation/comprehensiveV3Generation";
import { createCareerV3 } from "../../../lib/report-generation/careerV3Generation";
import { createLoveV3 } from "../../../lib/report-generation/loveV3Generation";
import { createCompatibilityV3 } from "../../../lib/report-generation/compatibilityV3Generation";
import { COMPATIBILITY_ROLE_VERSION } from "../../../lib/report-generation/reportInputTypes";
import { ComprehensiveReportV3View } from "../../reports/[reportId]/ComprehensiveReportV3View";
import { CareerReportV3View } from "../../reports/[reportId]/CareerReportV3View";
import { LoveReportV3View } from "../../reports/[reportId]/LoveReportV3View";
import { CompatibilityReportV3View } from "../../reports/[reportId]/CompatibilityReportV3View";

export const dynamic = "force-dynamic";
/** Local deterministic QA only: no provider, persistence or payment path. */
export default async function EditorialPreview({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { product = "comprehensive" } = await searchParams;
  const person = { name: "가온", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
  const userContext = { relationshipStatus: "single", jobStatus: "employee", detailJob: "B2B SaaS 영업기획", focusAreas: [] };
  const base = { person, userContext, productOptions: { contentVersion: "v3" } };
  let content;
  if (product === "comprehensive") {
    const result = createComprehensiveV3({ ...base, productKey: "saju_mbti_full", productSlug: "saju-mbti-full" });
    if (!result) notFound(); content = <ComprehensiveReportV3View {...result} />;
  } else if (product === "career") {
    const result = createCareerV3({ ...base, productKey: "career_money_study", productSlug: "career-money-study" });
    if (!result) notFound(); content = <CareerReportV3View {...result} />;
  } else if (product === "love") {
    const result = createLoveV3({ ...base, productKey: "love_marriage_child", productSlug: "love-marriage-child" });
    if (!result) notFound(); content = <LoveReportV3View {...result} />;
  } else if (product === "compatibility") {
    const result = createCompatibilityV3({ productKey: "saju_mbti_compatibility", productSlug: "compatibility", compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
      personA: person, personB: { ...person, name: "유나", birthDate: "1993-10-17", birthTime: "13:20", gender: "FEMALE", mbtiType: "INFJ" }, relationshipType: "love", productOptions: { contentVersion: "v3" } });
    if (!result) notFound(); content = <CompatibilityReportV3View {...result} />;
  } else notFound();
  return <ReportReadingFrame createdAtIso={new Date().toISOString()}>{content}</ReportReadingFrame>;
}
