/**
 * P6e 실호출 5권: P6d 4명과 같은 입력(종합 장소담 · 커리어 권태오 · 연애 문채린(연애 중) · 궁합 남궁현×백은솔) + 연애 솔로 1권(상태 분기 확인).
 */
import { P6D_CASES } from "../p6d/cases";

const person = (name: string, birthDate: string, birthTime: string, gender: "MALE" | "FEMALE", mbtiType: string) => ({ name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType });
export const P6E_SOLO = person("윤서하", "1997-09-18", "07:40", "FEMALE", "INFP");
export const P6E_CASES: readonly { readonly id: string; readonly label: string; readonly payload: unknown }[] = [
  ...P6D_CASES,
  { id: "seoha-love-single", label: "연애 · 윤서하(솔로, 그래픽 디자이너·INFP)", payload: { productKey: "love_marriage_child", productSlug: "love-marriage-child", person: P6E_SOLO, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "그래픽 디자이너", focusAreas: [] }, productOptions: {} } },
];
