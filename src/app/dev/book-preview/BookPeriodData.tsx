import { getStemDisplay, getBranchDisplay } from "../../../lib/report-tables/displayDictionaries";
import { ELEMENT_LABELS } from "./BookPages";
import s from "./book.module.css";

/** The same canonical readings, yin/yang and tokens as the natal table. */
export function PeriodGanji({ value }: { value: string }) {
  if (!/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/.test(value)) return <span>{value}</span>;
  const cells = [getStemDisplay(value[0]), getBranchDisplay(value[1])];
  return <span className={s.periodGanji}>{cells.map(c => <span key={c.hanja} data-element-cell={c.colorToken} title={`${c.ko} · ${c.yinYang === "yin" ? "음" : "양"} · ${ELEMENT_LABELS[c.colorToken]}`}><b>{c.hanja}</b><small>{c.ko} · {c.yinYang === "yin" ? "음" : "양"}</small><small>{ELEMENT_LABELS[c.colorToken]}</small></span>)}</span>;
}
