import { BOOKS, type Book } from "../../../lib/book/product";
export { BOOKS, readerTitle, type Book } from "../../../lib/book/product";
export const PUBLISHING_STATES = ["preparing", "composing", "binding", "covering", "complete"] as const;
export type PublishingState = typeof PUBLISHING_STATES[number];
export const MBTI = ["ENTJ", "ENTP", "ENFJ", "ENFP", "ESTJ", "ESTP", "ESFJ", "ESFP", "INTJ", "INTP", "INFJ", "INFP", "ISTJ", "ISTP", "ISFJ", "ISFP"];
export const JOBS = [["employee", "직장인"], ["business_owner", "사업"], ["self_employed", "자영업"], ["freelancer", "프리랜서"], ["student", "학생"], ["job_seeker", "취업 준비"], ["homemaker", "가정 돌봄"], ["unemployed", "휴식 / 재정비"]] as const;
export const RELATIONSHIPS = [["", "미선택"], ["single", "솔로"], ["some", "썸"], ["dating", "연애"], ["marriage_preparing", "결혼 준비"], ["married", "기혼"]] as const;
export const CATEGORIES = [["love", "연애"], ["marriage", "결혼"], ["parentChild", "부모와 자녀"], ["coworker", "동료"], ["managerReport", "상사와 팀원"], ["businessPartner", "사업 파트너"], ["friendship", "친구"]] as const;
export type Person = { name: string; birth: string; gender: string; precision: string; time: string; mbti: string };
export const INITIAL_PERSON: Person = { name: "서진", birth: "1990-07-18", gender: "FEMALE", precision: "exact", time: "05:30", mbti: "ENTJ" };
export const inputPageCount = (id: Book["id"]) => ["love", "compatibility", "annual"].includes(id) ? 3 : 2;
export const wrapBook = (index: number) => (index + BOOKS.length) % BOOKS.length;
export const coverOffset = (index: number, current: number) => ((index - current + 9) % 6) - 3;
export const roleNames = (category: string) => category === "parentChild" ? ["부모", "자녀"] : category === "managerReport" ? ["상사", "부하·팀원"] : ["나", "상대"];
// Exact existing checkout labels. No optional marketing consent currently exists.
export const CONSENTS = [
  { id: "inputAccuracy", label: "[필수] 입력한 정보가 정확하며, 결제 후 입력값을 기준으로 리포트 생성이 진행되는 것을 확인했습니다." },
  { id: "digitalReportStart", label: "[필수] 결제 완료 후 온라인 열람형 디지털 리포트 생성 절차가 시작되는 것을 확인했습니다." },
  { id: "refundRestriction", label: "[필수] 생성 시작 후 단순 변심에 의한 환불이 제한될 수 있으며, 장애·중복결제·결과 미제공·법령상 취소 사유는 예외임을 확인했습니다." },
  { id: "policyAgreement", label: "[필수] 이용약관, 개인정보처리방침, 환불정책을 확인하고 동의합니다." },
  { id: "age14OrOlder", label: "[필수] 만 14세 이상입니다." },
  { id: "minorLegalRepresentative", label: "[필수] 미성년자는 법정대리인 동의가 필요하며, 동의가 없는 경우 본인 또는 법정대리인이 계약을 취소할 수 있음을 확인했습니다." },
] as const;
export const CONSENT_SHORT_LABELS = {
  inputAccuracy: "입력 정보 확인", digitalReportStart: "디지털 리포트 생성 시작",
  refundRestriction: "환불·청약철회 제한 확인", policyAgreement: "이용약관·개인정보·환불정책 동의",
  age14OrOlder: "만 14세 이상", minorLegalRepresentative: "미성년자 법정대리인 동의",
} as const;
export function requiredConsents(member: boolean, birth: string) {
  // Fixed preview date; this is not a replacement checkout age policy.
  const date = new Date(birth + "T00:00:00Z");
  const age = 2026 - date.getUTCFullYear() - (date.getUTCMonth() > 9 || date.getUTCMonth() === 9 && date.getUTCDate() > 1 ? 1 : 0);
  return { allowed: Number.isFinite(age) && age >= 14, items: CONSENTS.filter(c => (!member || c.id !== "policyAgreement") && (c.id !== "minorLegalRepresentative" || age < 19)) };
}
export const toggleAll = (ids: readonly string[], checked: boolean, current: Record<string, boolean>) => ({ ...current, ...Object.fromEntries(ids.map(id => [id, checked])) });
// Verbatim samples from markerMaterials.ts; supported by the stored Seojin table.
// Automated evidence-to-footnote mapping is intentionally deferred.
export const NOTES = [
  { name: "현침살", image: "작은 오류를 콕 집어내는 바늘", text: "허점을 찾아 고치는 예리한 눈과 정확한 말이 무기입니다." },
  { name: "도화살", image: "멀리서도 눈길이 닿는 조명", text: "첫인상에서 사람의 시선을 끄는 매력이 있습니다." },
  { name: "홍염살", image: "가까이 앉을수록 느껴지는 온기", text: "가까운 대화에서 사람을 끌어당기는 친밀한 매력이 있습니다." },
] as const;
export const READER_PREFIX = ["opening", "manse", "mbti"] as const;
export function readerPages(chapters: number) { return [...READER_PREFIX, ...Array.from({ length: chapters }, (_, i) => `chapter-${i}`), "glossary", "back"]; }
