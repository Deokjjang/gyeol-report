import { GiftClaim } from "../../../components/ops/GiftClaim";
import styles from "../../../components/report/reportStatus.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "선물 이용권 · 결리포트", robots: { index: false, follow: false } };

/** 선물 링크(P6d-ops 6, P 추가 F): 받는 사람은 로그인 + 가입 정보 입력을 마치면 자동으로 받는다. */
export default async function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className={styles.page} data-gift-page><div className={styles.container}>
    <p className={styles.brand}><Link href="/" aria-label="결리포트 홈">GYEOL REPORT</Link></p>
    <section className={styles.content} aria-labelledby="gift-title"><div className={styles.body}>
      <GiftClaim token={/^[A-Za-z0-9_-]{32}$/.test(token) ? token : ""} />
    </div></section>
  </div></main>;
}
