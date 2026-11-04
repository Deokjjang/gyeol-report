import { GiftClaim } from "../../../components/ops/GiftClaim";
import styles from "../../../components/report/reportStatus.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "선물 이용권 · 결리포트", robots: { index: false, follow: false } };

/** 선물 링크(P6d-ops 6): 받는 사람은 로그인 + 가입 정보 입력을 마쳐야 받을 수 있다. */
export default async function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className={styles.page} data-gift-page><div className={styles.container}>
    <p className={styles.brand}><Link href="/" aria-label="결리포트 홈">GYEOL REPORT</Link></p>
    <section className={styles.content} aria-labelledby="gift-title"><div className={styles.body}>
      <h1 id="gift-title" className={styles.title}>책 한 권, 선물이 도착했어요</h1>
      <p className={styles.message}>결리포트 이용권 1장으로 나에 관한 책을 만들 수 있어요.</p>
      <GiftClaim token={/^[A-Za-z0-9_-]{32}$/.test(token) ? token : ""} />
    </div></section>
  </div></main>;
}
