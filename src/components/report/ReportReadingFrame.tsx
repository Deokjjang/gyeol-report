import type { ReactNode } from "react";
import GyeolBrandHeader from "../brand/GyeolBrandHeader";
import ReportShareActions from "./ReportShareActions";
import styles from "./reportReading.module.css";

export function ReportReadingFrame({ children, createdAtIso }: { readonly children: ReactNode; readonly createdAtIso: string }) {
  const createdAt = new Date(createdAtIso);
  const date = Number.isNaN(createdAt.getTime()) ? null : new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric" }).format(createdAt);
  return (
    <main className={styles.page}>
      <div className={styles.edition}>
        <GyeolBrandHeader />
        {date ? <p className={styles.date}><time dateTime={createdAtIso}>{date}</time> 발행</p> : null}
      </div>
      <div className={styles.reading}>{children}</div>
    </main>
  );
}

export function ReportCover({ product, title, summary, core, children }: {
  readonly product: string; readonly title: string; readonly summary: string;
  readonly core?: string; readonly children?: ReactNode;
}) {
  return (
    <header className={styles.cover}>
      <p className={styles.product}>{product}</p>
      <h1>{title}</h1>
      <p className={styles.summary}>{summary}</p>
      {core ? <p className={styles.core}>{core}</p> : null}
      {children ? <div className={styles.context}>{children}</div> : null}
    </header>
  );
}

export function ReportContents({ items }: { readonly items: readonly { readonly id: string; readonly label: string }[] }) {
  return (
    <nav className={styles.contents} aria-label="리포트 목차">
      <details>
        <summary>목차 <span>원하는 부분부터 읽어보세요</span></summary>
        <ol>
          {items.map((item, index) => <li key={item.id}><a href={`#${item.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}</a></li>)}
        </ol>
      </details>
    </nav>
  );
}

export function ReportReentry({ productSlug }: { readonly productSlug: string }) {
  return (
    <section className={styles.reentry} aria-label="공유와 다음 리포트">
      <h2>이 리포트가 흥미로웠다면</h2>
      <p>함께 읽고 싶은 사람에게 공유하거나, 내 정보로 리포트를 만나보세요.</p>
      <ReportShareActions productSlug={productSlug} />
    </section>
  );
}
