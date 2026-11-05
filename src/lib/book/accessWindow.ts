/**
 * Book 열람 기한 판단(최종3). v5부터 발행한 Book은 기한 없음 — DB가 expires_at='infinity'로 준다(탈퇴·삭제 요청·서비스 종료 때만 닫힘).
 * 그 이전 Book은 처음 발행 때 정한 기한 그대로. 버전 판단은 DB(스냅샷 productVersion)가 하고, 화면·공유는 값만 읽는다.
 * 서재(library)와 공유(sharing)가 같이 쓰는 순수 함수라 어느 쪽에도 두지 않는다(공유가 서재 모듈을 가져오지 않게 — library.test 경계).
 */
export const isOpenEndedAccess = (expiresAt: unknown): boolean => expiresAt === "infinity";
/** 아직 열람 가능한가: 기한 없음이거나 기한이 지금보다 뒤. 읽을 수 없는 값은 닫힘으로 본다. */
export function reportAccessOpen(expiresAt: unknown, now = Date.now()): boolean {
  if (isOpenEndedAccess(expiresAt)) return true;
  const at = typeof expiresAt === "string" ? Date.parse(expiresAt) : NaN;
  return Number.isFinite(at) && at > now;
}
