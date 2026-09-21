import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";

export async function createCompletedReportFixtures(): Promise<Record<string, ProductPreviewSnapshot>> {
  const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
  const products = [
    ["saju_mbti_full", "saju-mbti-full"],
    ["career_money_study", "career-money-study"],
    ["love_marriage_child", "love-marriage-child"],
    ["major_fortune", "major-fortune"],
    ["annual_fortune", "annual-fortune"],
    ["saju_mbti_compatibility", "compatibility"],
  ] as const;
  const snapshots: Record<string, ProductPreviewSnapshot> = {};
  for (const [productKey, productSlug] of products) {
    for (const relationshipType of productKey === "saju_mbti_compatibility" ? ["love", "businessPartner", "parentChild"] : [""]) {
      const payload = productKey === "saju_mbti_compatibility"
        ? { productKey, productSlug, relationshipType, personA: person, personB: { ...person, name: "이서연", birthDate: "1998-03-14", gender: "FEMALE", mbtiType: "INTP" } }
        : { productKey, productSlug, person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {} };
      const result = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
      if (!result.ok) throw new Error(`${productKey}/${relationshipType}: ${JSON.stringify(result.error)}`);
      const key = relationshipType ? `compatibility-${relationshipType}` : productSlug;
      const built = createProductPreviewSnapshot({ reportId: `report_reading_${key}`, createdAtIso: "2026-09-21T01:00:00Z", productKey, productSlug, draft: result.draft as ProductPreviewSnapshotDraft, evidencePacket: result.evidencePacket });
      if (!built.ok) throw new Error(built.error);
      snapshots[key] = { ...built.value, access: { mode: "paid", isPaid: true, isUnlocked: true } };
    }
  }
  return snapshots;
}
