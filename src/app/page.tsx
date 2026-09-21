import Link from "next/link";

import GyeolBrandHeader from "../components/brand/GyeolBrandHeader";
import ProductGrid from "../components/product/ProductGrid";
import HomeReveal from "../components/product/HomeReveal";
import { GYEOL_HOME_PRODUCT_GRID } from "../lib/product/gyeolProducts";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.container}>
        <GyeolBrandHeader
          className={styles.brandHeader}
          taglineKo="사주와 MBTI를 함께 읽는 자기이해 리포트"
        />
        <header className={styles.hero}>
          <h1 className={styles.headline}>
            나를 읽는
            <br />
            또 하나의 방식
          </h1>
          <div className={styles.secondary}>
            <div className={styles.introduction}>
              <p className={styles.product}>사주 × MBTI 종합 리포트</p>
              <p className={styles.description}>
                명리의 구조와 MBTI의 행동 패턴을 함께 읽어 나를 조금 더
                선명하게 이해하는 리포트.
              </p>
            </div>
            <div className={styles.action}>
              <p className={styles.meta}>
                <strong>1,290원</strong> · 결제 후 자동 생성 · 90일 열람
              </p>
              <Link
                href="/report/new?product=saju-mbti-full"
                className={styles.primaryCta}
              >
                내 리포트 만들기 <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </header>
        <section className={styles.collection} aria-labelledby="report-collection-title">
          <div className={styles.collectionHeading}>
            <h2 id="report-collection-title">어떤 리포트를 볼까요?</h2>
            <p>지금 궁금한 나의 모습부터.</p>
          </div>
          <HomeReveal>
            <ProductGrid products={GYEOL_HOME_PRODUCT_GRID} presentation="editorial" />
          </HomeReveal>
          <aside className={styles.notice} aria-label="공통 상품 안내">
            <p className={styles.noticeTitle}>모든 리포트 1,290원</p>
            <p>결제 완료 후 즉시 생성, 최대 24시간 이내 제공 · 생성일로부터 90일 온라인 열람</p>
            <p className={styles.noticeNote}>자동 생성 디지털 리포트 · 상담이 아닌 참고용 리포트</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
