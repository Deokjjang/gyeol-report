import type { PolicyBlock } from "../../lib/legal/privacyPolicy";

/**
 * 정책 문서 본문(문단·목록·표)을 그린다. /privacy 예전 문서 화면과 책 화면의 정책 문서가 같이 쓴다(문구 원본은 lib/legal).
 * 칸이 많은 표(국외 이전 등, 4칸 이상)는 휴대폰 폭에서 읽히도록 줄마다 항목·내용 목록(dl)으로 그린다.
 */
export function PolicyBlocks({ blocks }: { blocks: readonly PolicyBlock[] }) {
  return <>{blocks.map((b, i) => {
    if (b.kind === "p") return <p key={i}>{b.text}</p>;
    if (b.kind === "ul") return <ul key={i}>{b.items.map(item => <li key={item}>{item}</li>)}</ul>;
    const { captionKo, head, rows } = b.table;
    if (head.length > 3) return <div key={i} role="group" aria-label={captionKo} data-policy-rows>{rows.map((row, j) =>
      <dl key={j} style={{ borderTop: "1px solid rgba(127, 127, 127, .35)", paddingTop: 8 }}>{row.map((cell, k) => <div key={k}><dt>{head[k]}</dt><dd>{cell}</dd></div>)}</dl>)}</div>;
    return <table key={i}><caption>{captionKo}</caption><thead><tr>{head.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, j) => <tr key={j}>{row.map((cell, k) => k === 0 ? <th scope="row" key={k}>{cell}</th> : <td key={k}>{cell}</td>)}</tr>)}</tbody></table>;
  })}</>;
}
