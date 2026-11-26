import { josa } from "../brief/labels";
import type { MirrorItem, MirrorSentence } from "../../data/mirror/items";

const PAIRS = { 은는: "은는", 이가: "이가", 을를: "을를", 과와: "과와" } as const;

/** 친구용 자리표({이름} · {이름:은는} · {이름:이가} · {이름:을를} · {이름:과와} · {이름:의})를 이름 받침에 맞춰 채운다. */
export function fillName(template: string, name: string): string {
  return template.replace(/\{이름(?::(은는|이가|을를|과와|의))?\}/g, (_, pair?: string) => {
    if (!pair) return name;
    if (pair === "의") return `${name}의`;
    return josa(name, PAIRS[pair as keyof typeof PAIRS]);
  });
}

/** 친구 화면에 보일 문항 문장(주어 = 주인 이름). */
export function friendSentence(item: MirrorItem, name: string): MirrorSentence {
  return { situation: fillName(item.friend.situation, name), a: fillName(item.friend.a, name), b: fillName(item.friend.b, name) };
}
