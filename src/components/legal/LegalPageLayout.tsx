import type { ReactNode } from "react";
import Link from "next/link";

import GyeolBrandHeader from "../brand/GyeolBrandHeader";
import styles from "./legal.module.css";

export const legalLinks = [
  { href: "/terms", labelKo: "이용약관" },
  { href: "/privacy", labelKo: "개인정보처리방침" },
  { href: "/refund", labelKo: "환불정책" },
  { href: "/business", labelKo: "사업자정보" },
] as const;

type LegalPageLayoutProps = {
  readonly eyebrowKo?: string;
  readonly titleKo: string;
  readonly descriptionKo: string;
  readonly children: ReactNode;
  readonly currentPath?: string;
};

export default function LegalPageLayout({
  eyebrowKo = "결리포트 정책",
  titleKo,
  descriptionKo,
  children,
  currentPath,
}: LegalPageLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.document}>
        <GyeolBrandHeader tone="dark" />

        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrowKo}</p>
          <h1>{titleKo}</h1>
          <p className={styles.description}>
            {descriptionKo}
          </p>
        </header>

        <div className={styles.body}>{children}</div>
        <nav className={styles.navigation} aria-label="정책 문서 탐색">
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href} aria-current={currentPath === link.href ? "page" : undefined}>
              {link.labelKo}
            </a>
          ))}
          <Link href="/">홈으로 돌아가기</Link>
        </nav>
      </div>
    </main>
  );
}
