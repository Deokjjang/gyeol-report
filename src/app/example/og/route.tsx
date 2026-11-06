import { EXAMPLE_BOOK } from "../../../lib/book/example";
import { projectBookShare } from "../../../lib/book/shareModel";
export const runtime = "nodejs";

/** 최종 A 15: 예시 리포트 공유 이미지(1200×630). 기존 책 공유 이미지(renderBookOg) 그대로, 표지 아래 이름 자리에 「예시 · 서하은」. */
export async function GET() {
  const model = projectBookShare({ productType: EXAMPLE_BOOK.source.productType, names: EXAMPLE_BOOK.data.names })!;
  return (await import("../../../lib/book/bookOg")).renderBookOg({ ...model, displayName: `예시 · ${model.displayName}` });
}
