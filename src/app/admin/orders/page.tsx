import Link from "next/link";
import styles from "../admin.module.css";
import { adminPageGate } from "../../../lib/ops/admin/access";
import { adminPinConfigured } from "../../../lib/ops/admin/config";
import { compSummary, delayedOrders, legacyMembers, parseSearch, providerState, requestInbox, searchOrders, type SearchFilters } from "../../../lib/ops/admin/data";
import { compStateLabel, kst, maskEmail, paymentStatusLabel, productLabel, requestReasonLabel } from "../../../lib/ops/admin/format";
import { ALL_PRODUCTS } from "../../../lib/ops/config";
import { createOpsStores } from "../../../lib/ops/store";
import { CompDesignate, ExportCsv, ProviderEnableButton, RequestDoneForm, TossBatchCheck } from "./AdminClient";
import { AdminShell, Badge, Dl, ExpiredView, LoadError, OrderItem } from "./ui";

export const dynamic = "force-dynamic";
// 제목 없이(사이트 기본값): 404일 때도 이 화면이 있다는 흔적을 남기지 않는다.
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };

const TABS = [["search", "주문 검색"], ["delayed", "지연(30분+)"], ["requests", "고객 요청"], ["members", "기존 가입자"]] as const;
type Tab = (typeof TABS)[number][0];
type Params = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  if ((await adminPageGate()).kind === "expired") return <ExpiredView />;
  const params = await searchParams;
  const raw = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const tab: Tab = TABS.some(([k]) => k === raw) ? raw as Tab : "search";
  return (
    <AdminShell>
      <p className={styles.eyebrow}>ADMIN · ORDERS</p>
      <h1>주문 관리</h1>
      <nav className={styles.tabs} aria-label="관리 메뉴">
        {TABS.map(([k, label]) => <Link key={k} href={`/admin/orders?tab=${k}`} aria-current={k === tab ? "page" : undefined}>{label}</Link>)}
      </nav>
      {tab === "search" ? <SearchTab filters={parseSearch(params)} />
        : tab === "delayed" ? <DelayedTab />
        : tab === "requests" ? <RequestsTab status={params.status === "done" ? "done" : "open"} />
        : <MembersTab />}
    </AdminShell>
  );
}

async function SearchTab({ filters }: { filters: SearchFilters }) {
  const r = await searchOrders(createOpsStores().db, filters);
  return (
    <>
      <form className={styles.search} method="get" action="/admin/orders">
        <input type="hidden" name="tab" value="search" />
        <label className={styles.wide}>검색어(주문코드·토스 주문번호·이메일·이름·Book id)
          <input className={styles.input} name="q" defaultValue={filters.q} maxLength={100} autoComplete="off" placeholder="GR-ABCD, provider_order_…, 이메일" />
        </label>
        <label className={styles.wide}>상품
          <select name="product" defaultValue={filters.product}><option value="">전체</option>{ALL_PRODUCTS.map(p => <option key={p} value={p}>{productLabel(p)}</option>)}</select>
        </label>
        <label>시작일(한국)<input className={styles.input} type="date" name="from" defaultValue={filters.from} /></label>
        <label>끝일(포함)<input className={styles.input} type="date" name="to" defaultValue={filters.to} /></label>
        <div className={styles.wide}><button className={styles.primary} type="submit">검색</button></div>
      </form>
      <TossBatchCheck />
      {!r.ok ? <LoadError code={r.code} /> : r.value.length === 0 ? <p className={styles.note}>맞는 주문이 없어요.</p> : (
        <>
          <ExportCsv filters={filters} pinReady={adminPinConfigured()} />
          <p className={styles.note}>{r.value.length}건{r.value.length >= 50 ? " (최근 50건까지 · 조건을 좁혀 주세요)" : ""}</p>
          <ul className={styles.list}>{r.value.map(o => <OrderItem key={o.paymentOrderId} o={o} />)}</ul>
        </>
      )}
    </>
  );
}

async function DelayedTab() {
  const stores = createOpsStores();
  const [r, p] = await Promise.all([delayedOrders(stores.db), providerState(stores)]);
  const openai = p.ok ? p.value.openai : undefined, anthropic = p.ok ? p.value.anthropic : undefined;
  return (
    <>
      <section className={styles.section}>
        <h2>생성 공급자 스위치</h2>
        {!p.ok ? <LoadError code={p.code} /> : (
          <>
            <Dl rows={[
              ["Anthropic(정식본)", anthropic?.disabledAt ? `꺼짐 · ${kst(anthropic.disabledAt)}${anthropic.reason ? ` · ${anthropic.reason}` : ""}` : "사용 중"],
              ["OpenAI(임시본)", openai?.disabledAt ? `꺼짐 · ${kst(openai.disabledAt)}${openai.reason ? ` · ${openai.reason}` : ""}` : "사용 중"],
            ]} />
            {openai?.disabledAt ? <div style={{ marginTop: 10 }}><ProviderEnableButton /></div> : null}
          </>
        )}
      </section>
      <section className={styles.section}>
        <h2>결제 후 30분이 지나도 완성되지 않은 주문</h2>
        {!r.ok ? <LoadError code={r.code} /> : r.value.orders.length === 0 ? <p className={styles.note}>없어요.</p>
          : <ul className={styles.list}>{r.value.orders.map(o => <OrderItem key={o.paymentOrderId} o={o} />)}</ul>}
      </section>
      <section className={styles.section}>
        <h2>30분 넘게 대기·생성 중인 이용권 Book</h2>
        {!r.ok ? null : r.value.tickets.length === 0 ? <p className={styles.note}>없어요.</p> : (
          <ul className={styles.list}>{r.value.tickets.map(t => (
            <li key={t.redemptionId} className={styles.item}>
              <div className={styles.itemHead}><span>{productLabel(t.productType)}</span><Badge alert>{t.state}</Badge>{t.failures ? <Badge alert>실패 {t.failures}회</Badge> : null}</div>
              <div className={styles.meta}><span>{kst(t.createdAt)}</span>{t.notBefore ? <span>다음 시도 {kst(t.notBefore)}</span> : null}<span className={styles.mono}>{t.reportId ?? t.redemptionId}</span></div>
              {t.lastReason ? <p className={styles.note}>최근 사유: {t.lastReason}</p> : null}
            </li>
          ))}</ul>
        )}
      </section>
    </>
  );
}

async function RequestsTab({ status }: { status: "open" | "done" }) {
  const r = await requestInbox(createOpsStores().db, status);
  return (
    <>
      <div className={styles.row} style={{ marginBottom: 12 }}>
        <Link className={styles.button} href="/admin/orders?tab=requests" aria-current={status === "open" ? "page" : undefined}>처리 전</Link>
        <Link className={styles.button} href="/admin/orders?tab=requests&status=done" aria-current={status === "done" ? "page" : undefined}>처리 완료</Link>
      </div>
      {!r.ok ? <LoadError code={r.code} /> : r.value.length === 0 ? <p className={styles.note}>{status === "open" ? "처리할 요청이 없어요." : "처리한 요청이 없어요."}</p> : (
        <ul className={styles.list}>{r.value.map(q => (
          <li key={q.id} className={styles.item}>
            <div className={styles.itemHead}>
              <Link className={styles.mono} href={`/admin/orders/${encodeURIComponent(q.orderCode)}`}>{q.orderCode}</Link>
              <Badge alert={q.reason === "refund"}>{requestReasonLabel(q.reason)}</Badge>
            </div>
            <div className={styles.meta}><span>{kst(q.createdAt)}</span><span>{productLabel(q.productType)}</span><span>{paymentStatusLabel(q.paymentStatus)}</span><span>{q.buyerName ?? "이름 없음"}</span></div>
            {q.memo ? <p className={styles.pre}>{q.memo}</p> : null}
            {q.status === "done" && q.adminNote ? <p className={styles.note}>{q.resolvedBy === "auto" ? <Badge>자동 처리</Badge> : null} {q.adminNote}</p> : null}
            {q.status === "open" ? <RequestDoneForm id={q.id} orderCode={q.orderCode} /> : null}
          </li>
        ))}</ul>
      )}
    </>
  );
}

const TIER_NAME = { A: "A · 결제 후 환불한 고객", B: "B · 기존 무료 이벤트 가입자" } as const;
async function MembersTab() {
  const db = createOpsStores().db;
  const [r, comp] = await Promise.all([legacyMembers(db, 30), compSummary(db, 60)]);
  if (!r.ok) return <LoadError code={r.code} />;
  const v = r.value;
  const counts = [["명단 전체", v.total], ["이메일 확보", v.emailSecured], ["이메일 없음", v.emailMissing], ["주문 있음", v.withOrders], ["정보 입력 완료", v.profileDone], ["업그레이드 대상", v.eligible]] as const;
  return (
    <>
      <section className={styles.section} data-comp-summary>
        <h2>보상 이용권</h2>
        <CompDesignate pinReady={adminPinConfigured()} />
        {!comp.ok ? <LoadError code={comp.code} /> : (
          <>
            {(["A", "B"] as const).map(t => { const c = comp.value.counts[t]; return (
              <div key={t} data-comp-tier={t}>
                <p className={styles.note} style={{ margin: "10px 0 4px" }}><b>{TIER_NAME[t]}</b></p>
                <div className={styles.counts}>{([["인원", c.total], ["지급됨", c.granted], ["지급 대기", c.ready], ["정보 입력 전", c.waitingProfile], ["사용", c.used]] as const).map(([k, n]) => <div key={k} className={styles.count}><strong>{n.toLocaleString("ko-KR")}</strong><span>{k}</span></div>)}</div>
              </div>); })}
            {comp.value.members.length === 0 ? <p className={styles.note}>보상 대상이 없어요.</p> : (
              <ul className={styles.list}>{comp.value.members.map(m => (
                <li key={`${m.tier}-${m.userId}`} className={styles.item}>
                  <div className={styles.itemHead}><Badge alert={m.tier === "A"}>등급 {m.tier}</Badge><span className={styles.mono}>{m.userId.slice(0, 8)}…</span><span>{maskEmail(m.email)}</span>
                    <Badge>{compStateLabel(m.state)}</Badge>
                    {m.state === "granted" ? <Badge>{m.usedTickets + m.usedGifts > 0 ? `사용 ${m.usedTickets + m.usedGifts}/${m.ticketLots ? m.quantity : m.giftLots}` : "미사용"}</Badge> : null}
                  </div>
                  <div className={styles.meta}>{m.orderCode ? <span>환불 주문 {m.orderCode}</span> : null}{m.grantedAt ? <span>지급 {kst(m.grantedAt)} · {m.expiresAt ? `${kst(m.expiresAt)}까지` : ""} · {m.quantity}장</span> : null}<span>최근 로그인 {kst(m.lastLoginAt)}</span></div>
                </li>))}</ul>
            )}
          </>
        )}
      </section>
      <p className={styles.note}>2026-11-01 00:00(한국) 전 가입자 명단 기준. 이메일 확보 = 가입 정보 이메일 또는 공급자 확정 이메일.</p>
      <div className={styles.counts}>{counts.map(([k, n]) => <div key={k} className={styles.count}><strong>{n.toLocaleString("ko-KR")}</strong><span>{k}</span></div>)}</div>
      <h2 style={{ fontSize: 15 }}>최근 로그인 순 {v.members.length}명</h2>
      {v.members.length === 0 ? <p className={styles.note}>명단이 비어 있어요.</p> : (
        <ul className={styles.list}>{v.members.map(m => (
          <li key={m.userId} className={styles.item}>
            <div className={styles.itemHead}><span className={styles.mono}>{m.userId.slice(0, 8)}…</span>
              <Badge alert={!m.emailSecured}>{m.emailSecured ? "이메일 확보" : "이메일 없음"}</Badge>
              <Badge>{m.orders > 0 ? `주문 ${m.orders}건` : "주문 없음"}</Badge>
              {m.upgradeState && m.upgradeState !== "none" ? <Badge>{m.upgradeState === "granted" ? "업그레이드 지급" : "업그레이드 대상"}</Badge> : null}
            </div>
            <div className={styles.meta}><span>가입 {kst(m.joinedAt)}</span><span>최근 로그인 {kst(m.lastLoginAt)}</span></div>
          </li>
        ))}</ul>
      )}
    </>
  );
}
