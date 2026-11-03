import { getStemDisplay, getBranchDisplay } from "../../../lib/report-tables/displayDictionaries";
import { ELEMENT_LABELS } from "./BookPages";
import s from "./book.module.css";

const GANJI = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const cellsOf = (value: string) => [getStemDisplay(value[0]), getBranchDisplay(value[1])];

/** The same canonical readings, yin/yang and tokens as the natal table. */
export function PeriodGanji({ value }: { value: string }) {
  if (!GANJI.test(value)) return <span>{value}</span>;
  const cells = cellsOf(value);
  return <span className={s.periodGanji}>{cells.map(c => <span key={c.hanja} data-element-cell={c.colorToken} title={`${c.ko} · ${c.yinYang === "yin" ? "음" : "양"} · ${ELEMENT_LABELS[c.colorToken]}`}><b>{c.hanja}</b><small>{c.ko} · {c.yinYang === "yin" ? "음" : "양"}</small><small>{ELEMENT_LABELS[c.colorToken]}</small></span>)}</span>;
}

/** 표 한 줄용 작은 간지 칩: 같은 오행 색 칸 두 개 + 한글 읽기. */
export function GanjiChip({ value }: { value: string }) {
  if (!GANJI.test(value)) return <span>{value}</span>;
  const cells = cellsOf(value);
  return <span className={s.ganjiChip}>{cells.map(c => <b key={c.hanja} data-element-cell={c.colorToken} data-element={c.colorToken} title={`${c.ko} · ${ELEMENT_LABELS[c.colorToken]}`}>{c.hanja}</b>)}<small>{cells.map(c => c.ko).join("")}</small></span>;
}

/** 흐름 세기(1~5, 규칙 기반 참고 값) 막대. */
export function FlowBar({ value }: { value: number }) {
  return <span className={s.flowBar} role="img" aria-label={`흐름 세기 ${value}/5`}>{[1, 2, 3, 4, 5].map(i => <i key={i} data-on={i <= value} />)}</span>;
}
