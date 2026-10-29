import type { V4CustomerTables } from "../../../lib/interpretation-v4/runtimeTypes";
import type { Book, Person } from "./model";

// Presentation-only DTO. No calculation objects, proof IDs or composer imports.
export type BookPerson = Person & { role: string; timeLabel: string; table: V4CustomerTables[number];
  /** v5 Book만: 엔진이 감지한 원국 관계 전부(읽을 때 저장된 기둥 글자로 감지, 표시 전용). 없으면 저장된 합·충 칸을 쓴다. */
  relations?: { pair: string; text: string }[] };
/** v5 대운·세운 카드(TimelineEntry 표시 전용). page는 그 연·월 본문 쪽. */
export type BookTimelineCard = {
  key: string; kind: "year" | "month"; heading: string; sub: string; now: boolean; page: number;
  ganji: { hanja: string; hangul: string; stem: string; branch: string }; tenGod: { stem: string; branch: string };
  badges: { label: string; line: string; tone: string }[]; flow: { score: number; label: string }; keywords: string[]; action: string; transition: boolean; dayun?: string;
};
export type BookFeature = { name: string; meaning: string; manifestation: string; person: string; group?: string; core?: boolean };
export type BookNote = { name: string; text: string };
export type BookParagraph = { text: string; notes: number[]; heading?: string; anchorId?: string };
export type BookYear = { year: number; age: number; cycle: string; annual: string; theme: string; good: string; caution: string | null; title: string; time: string; page: number; transition: string | null; importance?: "HIGH" | "MEDIUM" | "BACKGROUND" };
export type BookMonth = { month: number; title: string; theme: string; time: string; ganji: string; gods: string; markers: string[]; page: number; good?: string; caution?: string; importance?: string; boundary?: { label: string; explanation: string; segments: { start: string; end: string; ganji: string }[] } };
export type BookPage = (
  | { kind: "cover"; title: string; names: string; headline: string }
  | { kind: "input"; title: string }
  | { kind: "pair"; title: string; category: string; characters: { name: string; core: string; strength: string; relationship: string }[]; directions: { title: string; effect: string; term?: string; page: number }[]; relations: string[] }
  | { kind: "manse"; title: string; person: number }
  | { kind: "mbti"; title: string; person: number }
  | { kind: "narrative"; title: string; paragraphs: BookParagraph[]; notes: BookNote[] }
  | { kind: "contents"; title: string; entries: { title: string; targetId: string; page: number }[] }
  | { kind: "score"; versionLabel?: string; scoreVersion?: string; explanations?: string[]; title: string; total: number; scores: { label: string; value: number; max: number }[]; verdict: string; notice: string; limitations: string[] }
  | { kind: "timeline"; title: string; years: BookYear[]; transitions: { date: string; exact?: string; before: string; after: string; page: number }[] }
  | { kind: "months"; title: string; months: BookMonth[]; map?: { label: string; months: number[] }[] }
  | { kind: "appendix"; title: string; items: BookFeature[]; from: number; total: number }
  | { kind: "back"; title: string; finalLine: string }) & { id?: string; anchors?: string[] };
export type BookData = {
  bookId: Book["id"]; title: string; names: string; people: BookPerson[];
  context: { label: string; value: string }[]; pages: BookPage[];
  share: { title: string; description: string }; readingDate: string;
  timeline?: BookTimelineCard[];
};
export type BookFixtureLink = { id: string; bookId: Book["id"]; label: string };
export type BookLibrary = { books: BookData[]; fixtures: BookFixtureLink[]; selected: string };
