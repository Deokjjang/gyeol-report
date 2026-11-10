import type { V4CustomerTables } from "../../../lib/interpretation-v4/runtimeTypes";
import type { Book, Person } from "./model";

// Presentation-only DTO. No calculation objects, proof IDs or composer imports.
export type BookPerson = Person & { role: string; timeLabel: string; table: V4CustomerTables[number] };
export type BookFeature = { name: string; meaning: string; manifestation: string; person: string; group?: string; core?: boolean };
export type BookNote = { name: string; text: string };
/** keySpan: 문단 안 핵심 구절 [시작, 끝)(원문 글자 위치, v5 P6c-ui2). 있으면 굵게 + 옅은 밑줄. */
export type BookParagraph = { text: string; notes: number[]; heading?: string; anchorId?: string; keySpan?: [number, number] };
/** 표 한 줄에 더 보여 줄 카드 값(v5 P6b 카드에만 있다. 없으면 그 칸을 숨긴다). goodLabel: good 줄 이름("해 볼 것"·"돌아보기"), 없으면 "좋은 힘".
 * relationsPlain: 관계 배지를 쉬운 문장 1~2줄로(P6c-ui2 i). 있으면 상세에 이 문장을 쓰고 배지 이름은 작은 글씨로 둔다. */
export type BookRowExtras = { tenGod?: string; flow?: number; keywords?: string[]; badges?: { label: string; line: string; with?: string }[]; goodLabel?: string; relationsPlain?: string[] };
/** keyYear(AM 3부): 앞으로 10년 핵심 해(결정론 규칙)와 근거 배지. */
export type BookYear = { year: number; age: number; cycle: string; annual: string; theme: string; good: string; caution: string | null; title: string; time: string; page: number; transition: string | null; importance?: "HIGH" | "MEDIUM" | "BACKGROUND"; ageLabel?: string; keyYear?: { rank: number; reasons: string[] } } & BookRowExtras;
/** order·range: 절기월 순번(1=인월)과 날짜 구간("2/4~3/5"). 있으면 달력 달 이름 대신 쓴다(v5).
 * sub: 달 이름 아래 줄("경인월 · 2/4~3/5", P6c-ui2 h). 없으면 range. */
/** name·signals·bridge(AM 2부 세운 신년판): 달 이름 「2월 · 임인월」, 영역 신호 줄 「연애 ↑ · 돈 → …」, 1월 다리. */
export type BookMonth = { name?: string; signals?: string; bridge?: boolean; month: number; title: string; theme: string; time: string; ganji: string; gods: string; markers: string[]; page: number; good?: string; caution?: string; importance?: string; boundary?: { label: string; explanation: string; segments: { start: string; end: string; ganji: string }[] }; order?: number; range?: string; sub?: string } & BookRowExtras;
export type BookPage = (
  | { kind: "cover"; title: string; names: string; headline: string }
  | { kind: "input"; title: string }
  | { kind: "pair"; title: string; category: string; characters: { name: string; core: string; strength: string; relationship: string }[]; directions: { title: string; effect: string; term?: string; page: number }[]; relations: string[]; image?: string; relationsPlain?: string[]; relationsSummary?: string; relationsTotal?: number }
  | { kind: "manse"; title: string; person: number }
  | { kind: "mbti"; title: string; person: number }
  | { kind: "narrative"; title: string; paragraphs: BookParagraph[]; notes: BookNote[] }
  | { kind: "contents"; title: string; entries: { title: string; targetId: string; page: number }[] }
  | { kind: "score"; versionLabel?: string; scoreVersion?: string; explanations?: string[]; title: string; total: number; band?: string; scores: { label: string; value: number; max: number; reason?: string }[]; verdict: string; notice: string; limitations: string[] }
  | { kind: "timeline"; title: string; years: BookYear[]; transitions: { date: string; exact?: string; before: string; after: string; page: number }[] }
  | { kind: "months"; title: string; months: BookMonth[]; map?: { label: string; months: number[] }[] }
  /** lead: 머리말 한 줄(v5 P6c). 있으면 V4의 지장간·십이운성 안내 대신 이것만 보인다. notes: 머리말 아래 안내 줄(최종판3 8: 대운 표기·만 나이 안내). */
  | { kind: "appendix"; title: string; items: BookFeature[]; from: number; total: number; lead?: string; notes?: string[] }
  /** AM 2부 세운 신년판: 키워드 카드(공유·이미지 저장), 나를 돕는 색·방향·숫자(+ 삼재 해당 띠만), 대운으로 이어 보기. AM 3부 대운: 평생 대운 지도. */
  | { kind: "keywords"; title: string; year: number; keywords: string[]; line: string; verdict?: string }
  | { kind: "lucky"; title: string; name: string; colors: string[]; direction: string; numbers: number[]; why: string; samjae?: { zodiac: string; phase: string; line: string } }
  | { kind: "continue"; title: string; text: string; href: string }
  | { kind: "lifetime"; title: string; cycles: { label: string; ages: string; tenGod: string; theme: string; current: boolean }[] }
  /** aiNotice: 책 끝 AI 작성 고지(v5 최종3, v5 책만). */
  | { kind: "back"; title: string; finalLine: string; aiNotice?: string }) & { id?: string; anchors?: string[] };
export type BookData = {
  bookId: Book["id"]; title: string; names: string; people: BookPerson[];
  context: { label: string; value: string }[]; pages: BookPage[];
  share: { title: string; description: string }; readingDate: string;
  /** 판 표기(표지·마지막 쪽), 예 "제5판 · 2026년 11월 3일 개정". 열람 화면 목차(목차 쪽 대신 버튼으로 연다). */
  edition?: string; contents?: { title: string; targetId: string; page: number }[];
  /** 용어 뜻(P6c-ui2 g): 십성·신살·귀인·십이운성 이름과 지식 DB 뜻 한 줄. 있으면 장마다 첫 등장을 표시하고 누르면 뜻이 뜬다. 없으면(이전 Book) 그대로. */
  glossary?: { name: string; meaning: string }[];
};
export type BookFixtureLink = { id: string; bookId: Book["id"]; label: string };
export type BookLibrary = { books: BookData[]; fixtures: BookFixtureLink[]; selected: string };
