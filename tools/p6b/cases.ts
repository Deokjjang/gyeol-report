/** P6b 실호출 7권: P6 6권(종합 c1, 커리어 c1, 연애 Y, 궁합 연애 하람×서윤, 대운 X, 세운 2026 c2) + 사용자 본인 종합 1권. */
import { P6_CASES } from "../p6/cases";

const me = { name: "장덕민", birthDate: "1999-07-31", birthTime: "08:27", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
export const P6B_CASES: readonly { readonly id: string; readonly label: string; readonly payload: unknown }[] = [
  ...P6_CASES,
  { id: "me-full", label: "종합 · 장덕민(본인)", payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: me, userContext: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "사업", focusAreas: [] }, productOptions: {} } },
];
