/**
 * W3 P3: 브리프의 절 설계 카드(sections[].card)를 발행 쪽 두 곳에 넘기는 변환.
 * - infoCardsOf: 정보량 지표(safety/info.ts)가 절마다 「쓴 근거」·「근거 있는 장면」을 카드로 센다.
 * - designSummaryOf: 설계 카드 검수(review-v6-card)의 「설계 카드(design)」 칸 — 한 줄 = 한 절, 줄 머리 `card:<장>.<절 0부터>`.
 * 장 번호는 작가 입력과 같은 n(writerChapters)이다. 카드가 없는 브리프(세운·대운·옛 책)는 빈 값.
 */
import type { Brief } from "@/lib/brief/schema";
import { writerChapters } from "./prompt";
import type { InfoCard } from "./safety/info";

const SPLIT = /\s*[·,]\s*/;

export function infoCardsOf(brief: Pick<Brief, "chapters">): InfoCard[] {
  const out: InfoCard[] = [];
  for (const c of writerChapters(brief)) (c.sections ?? []).forEach((s, si) => {
    if (!s.card) return;
    out.push({ chapter: c.n, section: si, evidence: s.card.evidence.map(e => ({ name: e.name, where: e.where ? e.where.split(SPLIT).filter(Boolean) : [] })), scene: s.card.scene ? { text: s.card.scene.text } : null });
  });
  return out;
}

const clip = (t: string, n: number) => (t.length > n ? `${t.slice(0, n)}…` : t);

export function designSummaryOf(brief: Pick<Brief, "chapters">): string {
  const lines: string[] = [];
  for (const c of writerChapters(brief)) (c.sections ?? []).forEach((s, si) => {
    const k = s.card;
    if (!k) return;
    const ev = k.evidence.map(e => `${e.name}(${e.where || "자리 없음"})`).join(", ") || "없음";
    const link = k.link ? `${k.link.kind} ${k.link.tagName}: ${clip(k.link.why, 80)}` : "없음";
    const scene = k.scene ? `${k.scene.from} — ${clip(k.scene.text, 60)}` : "없음(지어낸 생활 장면 금지)";
    lines.push(`card:${c.n}.${si} | 근거: ${ev} | 연결: ${link} | 장면: ${scene} | 팩폭: ${k.punch ? clip(k.punch.basis, 60) : "없음"} | 처방: ${k.rx ?? "없음"}`);
  });
  return lines.join("\n");
}
