import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../admin.module.css";
import { adminPageGate } from "../../../lib/ops/admin/access";
import { mirrorRoutesEnabled } from "../../../lib/mirror/gate";
import { loadItemStatsInput } from "../../../lib/mirror/itemStatsStore";
import { AdminShell, ExpiredView } from "../orders/ui";
import { ItemStatsView } from "./ui";

export const dynamic = "force-dynamic";
// 제목 없이(사이트 기본값): 404일 때도 이 화면이 있다는 흔적을 남기지 않는다.
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };

/** 「남이 본 나」 출시 후 문항 점검(SPEC 3가지 + 우선 점검 2쌍). 관리자 전용 · 읽기 전용 · 공개 관문(숨은 공개) 뒤. */
export default async function Page() {
  if (!mirrorRoutesEnabled()) notFound();
  if ((await adminPageGate()).kind === "expired") return <ExpiredView />;
  const loaded = await loadItemStatsInput();
  return (
    <AdminShell>
      <p className={styles.eyebrow}>ADMIN · 남이 본 나</p>
      <h1>문항 통계</h1>
      <nav className={styles.tabs} aria-label="관리 메뉴"><Link href="/admin/orders">주문 관리</Link><Link href="/admin/mirror-items" aria-current="page">문항 통계</Link></nav>
      {!loaded.ok ? (
        loaded.code === "NO_TABLES" ? <p className={styles.note} data-mirror-items-empty="no-tables">표가 없어요. 이 DB에는 「남이 본 나」 표(migration)가 아직 없어요.</p>
          : loaded.code === "NO_CONFIG" ? <p className={styles.note} data-mirror-items-empty="no-config">DB 설정이 없어 읽지 못했어요.</p>
          : <p className={styles.error} role="alert">불러오지 못했어요 ({loaded.code}). 잠시 뒤 새로고침해 주세요.</p>
      ) : <ItemStatsView input={loaded.value} capped={loaded.capped} />}
    </AdminShell>
  );
}
