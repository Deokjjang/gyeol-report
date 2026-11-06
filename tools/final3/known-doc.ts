/** docs/v5/final3/known-issues.md 생성(호출 0): 알려진 문제 + 층별 처리 + 측정(결정론·Haiku 검수) 결과. */
import { readFileSync, writeFileSync } from "node:fs";
import { KNOWN3, knownPrev } from "./known";

const md = readFileSync("docs/v5/final3/measure-claude-haiku-5-5.md", "utf8");
const res = new Map<string, { det: string; rev: string }>();
for (const l of md.split("\n")) { const m = l.match(/^\| ([^|]+) \| [^|]+ \| [A-Z] \| [^|]+ \| ([^|]+) \| ([^|]*) \|$/); if (m) res.set(m[1].trim(), { det: m[2].trim(), rev: m[3].trim() }); }
const LAYER: Readonly<Record<string, string>> = {
  "D-B1": "① 브리프: 대표 신살 고정(앞 책 원장 ×0.45 감점 제외, 묶음 상한 안에서 교체) — 현침살 t1로 들어감",
  "D-CV": "① 브리프 규칙 + 표지 검사(종합 직업·나이 금지) → 수리 1회에 표지 포함",
  "SC-B1": "기록(커리어 재성 해 누락은 이번 범위에서 고치지 않음 — 7번 표기 작업 밖)",
  "SL-R3": "① 브리프(연애 중 「표현과 대화의 리듬」 절 제목 분리, 기존) + 검수 R",
  "SL-CV": "표지 검사: 연애 표지 직업 장소 금지 + 같은 사람 이전 표지 모티프 계열 금지(작은 불)",
  "SS-SC": "7번: 점수 쪽 「기본점 40/40」 줄(합 = 총점)",
  "SS-F3": "① 브리프 공통 특징(commonIds — 일지 묘 둘 다) + 검사 common_split",
  "SS-LS": "7번: 관계 목록 요약 + 부록 전체, 丙壬 천간충, 반합 「반쯤 묶임」",
  "SS-CV": "표지 모티프 계열 검사(작은 불)",
  "ALL-R": "① 처방 슬롯: 장마다 서로 다른 처방 종류 1개 + 고객 원장 avoidActions",
};
const rows = [...KNOWN3, ...knownPrev()].map(k => {
  const r = res.get(k.id), how = k.layer === "sentence" ? (r ? `결정론: ${r.det} · 검수: ${r.rev || "—"}` : "—") : LAYER[k.id] ?? k.layer;
  return `| ${k.id} | ${k.src} | ${k.book} | ${k.cat} | ${k.layer} | ${k.label.replace(/\|/g, "/")} | ${how.replace(/\|/g, "/")} |`;
});
writeFileSync("docs/v5/final3/known-issues.md", [
  "# 알려진 문제 목록(최종판3 5)", "",
  "출처: 명령문 A [알려진 문제 목록](final3) · final2 판독 인용 23개(tools/final2/stored-check.ts) · 최종판 판독 인용 26개(tools/final/stored-check.ts). 채점 목록 원본: `tools/final3/known.ts`, `tools/final3/known-prev.json`.",
  "범주: F 사실·뜻 · C 같은 사람 모순 · I 입력 밖 · R 반복 · L 라벨·면책·규칙 노출 · T 시점 · A 비문. 차단급 = F·C·I·L.",
  "layer: sentence = 문장 단위(결정론 검사·검수가 잡는다), 그 밖 = 구조 층(브리프·표지·점수·목록)에서 고쳤다.",
  "처리 열의 결정론·검수 값은 저장본 17권 측정(검수 Haiku 5.5 review-v4, `docs/v5/final3/measure-claude-haiku-5-5.md`). 「—」는 놓침, 「(책에 없음)」은 저장본에 그 문장이 없음.", "",
  "| id | 출처 | 책 | 범주 | 층 | 문제 | 처리 |", "|---|---|---|---|---|---|---|", ...rows, ""].join("\n"));
console.log(`known-issues.md ${rows.length}줄`);
