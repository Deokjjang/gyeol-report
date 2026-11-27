import "server-only";
/**
 * /@아이디 랜딩 · 링크 미리보기가 같이 쓰는 서버 읽기(공개 정보만: 이름 · 아이디 · 한마디 · 별자리 모양 · 싱크로율 · 답한 친구 수).
 * 친구 답 원본 · 계정 id는 밖으로 내보내지 않는다.
 */
import { josa } from "../brief/labels";
import { selfConstellation, type ConstellationShape } from "./constellation";
import { answeredFriends, selfComplete, syncPercent } from "./engine";
import { createMirrorStore } from "./store";

export type LandingData = { name: string; handle: string; isPublic: boolean; line: string | null; showCount: boolean; shape: ConstellationShape | null; sync: number | null; friends: number; title: string };
export type LandingLookup = { status: "found"; data: LandingData } | { status: "moved"; handle: string } | null;

export async function landingData(handle: string): Promise<LandingLookup> {
  const store = createMirrorStore();
  if (!store) return null;
  const found = await store.resolveHandle(handle);
  if (!found) return null;
  if (found.status === "moved") return { status: "moved", handle: found.handle };
  const owner = await store.ownerByHandle(handle);
  if (!owner) return null;
  const [self, share, board] = await Promise.all([store.selfAnswers(owner.userId), store.shareSettings(owner.userId), owner.selfCompletedAt ? store.board(owner.userId) : Promise.resolve([])]);
  const done = !!owner.selfCompletedAt && selfComplete(self);
  return { status: "found", data: {
    name: owner.name, handle: owner.handle, isPublic: owner.isPublic, line: share.line, showCount: share.showCount,
    shape: done ? selfConstellation(self) : null, sync: done ? syncPercent(self, board) : null, friends: answeredFriends(board).length,
    title: share.line ?? `${josa(owner.name, "은는")} 어떤 사람일까?`,
  } };
}
