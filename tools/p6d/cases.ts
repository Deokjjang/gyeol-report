/**
 * P6d 실호출 4권(Sonnet 5.5): 종합 장소담(하람과 년·월·일주가 같다) · 커리어(구직/무직) · 연애(연애 중) · 궁합(사업 파트너).
 * 이름·입력은 지금까지 쓴 시험 인물(하람·서윤·수진·도현·장덕민)과 겹치지 않는다.
 */
const person = (name: string, birthDate: string, birthTime: string, gender: "MALE" | "FEMALE", mbtiType: string) => ({ name, birthDate, birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender, mbtiType });
export const P6D_PEOPLE = {
  sodam: person("장소담", "1996-12-06", "14:15", "FEMALE", "INTP"),
  taeo: person("권태오", "1994-05-23", "16:05", "MALE", "ISFP"),
  chaerin: person("문채린", "1998-02-14", "21:30", "FEMALE", "ENFJ"),
  hyun: person("남궁현", "1987-10-02", "10:10", "MALE", "ESTJ"),
  eunsol: person("백은솔", "1990-06-11", "13:50", "FEMALE", "ENFP"),
} as const;
export const P6D_CASES: readonly { readonly id: string; readonly label: string; readonly payload: unknown }[] = [
  { id: "sodam-full", label: "종합 · 장소담(카페 사장·INTP·관계 미입력)", payload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: P6D_PEOPLE.sodam, userContext: { relationshipStatus: "", jobStatus: "self_employed", detailJob: "카페 사장", focusAreas: [] }, productOptions: {} } },
  { id: "taeo-career", label: "커리어 · 권태오(구직)", payload: { productKey: "career_money_study", productSlug: "career-money-study", person: P6D_PEOPLE.taeo, userContext: { relationshipStatus: "single", jobStatus: "job_seeker", detailJob: "마케팅 직무 재취업준비", focusAreas: [] }, productOptions: {} } },
  { id: "chaerin-love", label: "연애 · 문채린(연애 중)", payload: { productKey: "love_marriage_child", productSlug: "love-marriage-child", person: P6D_PEOPLE.chaerin, userContext: { relationshipStatus: "dating", jobStatus: "employee", detailJob: "물리치료사", focusAreas: [] }, productOptions: {} } },
  { id: "pair-business", label: "궁합 사업 파트너 · 남궁현×백은솔", payload: { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "businessPartner", personA: P6D_PEOPLE.hyun, personB: P6D_PEOPLE.eunsol } },
];
