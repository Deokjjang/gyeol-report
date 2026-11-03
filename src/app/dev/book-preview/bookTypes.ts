import type { V4CustomerTables } from "../../../lib/interpretation-v4/runtimeTypes";
import type { Book, Person } from "./model";

// Presentation-only DTO. No calculation objects, proof IDs or composer imports.
export type BookPerson = Person & { role: string; timeLabel: string; table: V4CustomerTables[number] };
export type BookFeature = { name: string; meaning: string; manifestation: string; person: string; group?: string; core?: boolean };
export type BookNote = { name: string; text: string };
export type BookParagraph = { text: string; notes: number[]; heading?: string; anchorId?: string };
/** 표 한 줄에 더 보여 줄 카드 값(v5 P6b 카드에만 있다. 없으면 그 칸을 숨긴다). goodLabel: good 줄 이름("해 볼 것"·"돌아보기"), 없으면 "좋은 힘". */
export type BookRowExtras = { tenGod?: string; flow?: number; keywords?: string[]; badges?: { label: string; line: string; with?: string }[]; goodLabel?: string };
export type BookYear = { year: number; age: number; cycle: string; annual: string; theme: string; good: string; caution: string | null; title: string; time: string; page: number; transition: string | null; importance?: "HIGH" | "MEDIUM" | "BACKGROUND"; ageLabel?: string } & BookRowExtras;
/** order·range: 절기월 순번(1=인월)과 날짜 구간("2/4~3/4"). 있으면 달력 달 이름 대신 쓴다(v5). */
export type BookMonth = { month: number; title: string; theme: string; time: string; ganji: string; gods: string; markers: string[]; page: number; good?: string; caution?: string; importance?: string; boundary?: { label: string; explanation: string; segments: { start: string; end: string; ganji: string }[] }; order?: number; range?: string } & BookRowExtras;
export type BookPage = (
  | { kind: "cover"; title: string; names: string; headline: string }
  | { kind: "input"; title: string }
  | { kind: "pair"; title: string; category: string; characters: { name: string; core: string; strength: string; relationship: string }[]; directions: { title: string; effect: string; term?: string; page: number }[]; relations: string[]; image?: string; relationsPlain?: string[] }
  | { kind: "manse"; title: string; person: number }
  | { kind: "mbti"; title: string; person: number }
  | { kind: "narrative"; title: string; paragraphs: BookParagraph[]; notes: BookNote[] }
  | { kind: "contents"; title: string; entries: { title: string; targetId: string; page: number }[] }
  | { kind: "score"; versionLabel?: string; scoreVersion?: string; explanations?: string[]; title: string; total: number; band?: string; scores: { label: string; value: number; max: number; reason?: string }[]; verdict: string; notice: string; limitations: string[] }
  | { kind: "timeline"; title: string; years: BookYear[]; transitions: { date: string; exact?: string; before: string; after: string; page: number }[] }
  | { kind: "months"; title: string; months: BookMonth[]; map?: { label: string; months: number[] }[] }
  /** lead: 머리말 한 줄(v5 P6c). 있으면 V4의 지장간·십이운성 안내 대신 이것만 보인다. */
  | { kind: "appendix"; title: string; items: BookFeature[]; from: number; total: number; lead?: string }
  | { kind: "back"; title: string; finalLine: string }) & { id?: string; anchors?: string[] };
export type BookData = {
  bookId: Book["id"]; title: string; names: string; people: BookPerson[];
  context: { label: string; value: string }[]; pages: BookPage[];
  share: { title: string; description: string }; readingDate: string;
  /** 판 표기(표지·마지막 쪽), 예 "제5판 · 2026년 11월 3일 개정". 열람 화면 목차(목차 쪽 대신 버튼으로 연다). */
  edition?: string; contents?: { title: string; targetId: string; page: number }[];
};
export type BookFixtureLink = { id: string; bookId: Book["id"]; label: string };
export type BookLibrary = { books: BookData[]; fixtures: BookFixtureLink[]; selected: string };
