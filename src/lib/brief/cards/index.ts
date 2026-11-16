/**
 * W3 P3 연결 시스템 — 카드 모듈 입구 + 세운·대운(AM) 어댑터(설계 8).
 * AM intake(writer/chunked/intake.ts)는 지금 이 어댑터를 부르지 않는다(AM 출력 그대로). intake가 카드·연결을 쓰게 될 때
 * 근거 줄(Line)·명리×MBTI 짝(Pair) 모양으로 바로 받을 수 있게만 둔다. 「차이」는 AM 짝 이유(공통·보완·긴장)에 없어 「긴장」으로 읽는다.
 */
import type { Line, Pair } from "@/lib/writer/chunked/intake";
import type { Connection, FeatureCard } from "./features";

export * from "./features";
export { designCards, writerCard, cardWhere, CARDS_VERSION, MAX_DIM_LINKS, MAX_RX_KIND, type BookDesign, type CardEvidence, type CardFactDrop, type CardPerson, type SectionCard } from "./design";

/** 특징 카드 → AM 근거 줄(원국 = N, MBTI = B). meaning은 카드에 없어서 부르는 쪽이 준다(지식 DB 뜻). use = 쓸 수 있는 장 번호. */
export function cardToLine(card: FeatureCard, id: string, meaning: string, use: readonly number[]): Line {
  return { id, subject: card.system === "mbti" ? "mbti" : "natal", value: card.where.length && card.where[0] !== "MBTI" ? `${card.name}(${card.where.join("·")})` : card.name, meaning, use: [...use] };
}

/** 연결 → AM 짝(명리 줄 id × MBTI 줄 id). 명리×MBTI가 아닌 연결(궁합 명리끼리)은 짝이 아니라 null. */
export function connectionToPair(c: Connection, cards: ReadonlyMap<string, FeatureCard>, lineIdOf: (cardId: string) => string | undefined, id: string, use?: readonly number[]): Pair | null {
  const a = cards.get(c.a), b = cards.get(c.b);
  const [my, mb] = a?.system === "myeongri" && b?.system === "mbti" ? [a, b] : b?.system === "myeongri" && a?.system === "mbti" ? [b, a] : [];
  if (!my || !mb) return null;
  const myeongri = lineIdOf(my.id), mbti = lineIdOf(mb.id);
  if (!myeongri || !mbti) return null;
  return { id, myeongri, mbti, why: c.why, ...(use ? { use: [...use] } : {}), reason: c.kind === "차이" ? "긴장" : c.kind };
}
