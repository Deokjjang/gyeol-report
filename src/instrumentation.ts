// 서버 시작 점검(Next 16 instrumentation: 새 서버 인스턴스마다 register가 한 번 돈다). 경고 로그만 남기고 동작은 바꾸지 않는다.
// v5 최종3: WRITER_V5_PRODUCTS가 비었거나 출시 4종과 다르면 경고(빠진 상품은 V4로 생성된다).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { writerV5ProductsWarning } = await import("./lib/writer/flags");
    const warning = writerV5ProductsWarning();
    if (warning) console.warn(warning);
  } catch { /* 점검 실패가 서버 시작을 막지 않는다. */ }
}
