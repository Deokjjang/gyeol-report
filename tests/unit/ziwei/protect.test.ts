/**
 * ZW-1 보호: 자미 DB(src/data/knowledge-v5/ziwei/)를 더해도 4종 · 세운 · 대운 책 메타의 지식 버전이 759d87b3와 같다.
 * (지식 버전 해시는 ziwei/를 legacy처럼 세지 않는다 — 4종 · 세운 · 대운은 자미 DB를 읽지 않는다.)
 * 명리 · MBTI · Fusion DB를 바꾸는 명령에서는 이 값을 그 명령의 값으로 새로 적는다.
 */
import { expect, it } from "vitest";
import { writerKnowledge } from "@/lib/writer/publish";

it("4종 · 세운 · 대운 지식 버전 = 759d87b3 값(knowledge-v5:4db8ffa7dd72)", () => {
  expect(writerKnowledge().version).toBe("knowledge-v5:4db8ffa7dd72");
});
