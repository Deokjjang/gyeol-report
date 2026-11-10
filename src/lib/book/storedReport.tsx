import "server-only";
import { projectV4Snapshot, validateV4Publication, type V4RuntimeEvidence } from "../interpretation-v4/runtimeProjection";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectBook } from "../../app/dev/book-preview/bookProjection";
import { projectBookShare } from "./shareModel";
import { BookReadingPresentation } from "../../components/book/BookEntry";
import { projectV5Book, v5EditionLabel, validateV5Publication } from "../writer/book";
import { koreanDate, kstDay } from "./readerCopy";
import type { BookEndNoticeView } from "../../components/book/BookReading";
import { eventEndDayLabel, giftEventActive, giftEventPublicView } from "../ops/config";

/**
 * F 책 끝 연결(주인 화면): 1+1 기간이면 「○월 ○일까지 한 권 결제하면 이용권 1장을 증정해요」 한 줄(날짜 = 설정값), 가입 이용권으로 만든 책이면 그 위에 한 줄 더(ops_signup 'book_kind'). 못 읽으면 가입 줄만 뺀다.
 */
export async function bookEndNotice(reportId: string, ticketBook: boolean, now = Date.now()): Promise<BookEndNoticeView> {
  const event = giftEventActive(process.env, now), eventUntil = event ? eventEndDayLabel(giftEventPublicView(process.env, now).endsAt) : "";
  if (!ticketBook) return { event, eventUntil, signup: false };
  try {
    const { createOpsStores } = await import("../ops/store");
    const r = await createOpsStores().signup.call("book_kind", { reportId });
    return { event, eventUntil, signup: r.ok === true && r.signup === true };
  } catch { return { event, eventUntil, signup: false }; }
}

// Called only behind the server gate (or an explicit local test store).
// Stored version, not request input, selects the validator. No regeneration.
export const validateBookPublication: typeof validateProductPublication = (product, draft, evidence) =>
  typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v5"
    ? validateV5Publication(product, draft, evidence)
    : typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v4"
      ? validateV4Publication(product, draft, evidence) : validateProductPublication(product, draft, evidence);

/** today(KST 날짜): 대운·세운 표의 지금 기준(열람은 읽는 날; v5는 투영이, V4 세운은 열람 화면이 쓴다). edition: 판 표기(본문 data와 따로, 열람 화면이 붙인다).
 * 과거 V4 Book은 "제4판 · 발행일". */
export function storedBook(snapshot: unknown, shareUrl?: string | null, today = kstDay(new Date().toISOString())) {
  if (!isProductPreviewSnapshot(snapshot)) return null;
  if (snapshot.productVersion !== "v5" && (snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot))) return null;
  const data = snapshot.productVersion === "v5" ? projectV5Book(snapshot, today) : projectBook(snapshot.evidencePacket as V4RuntimeEvidence);
  if (!data) return null;
  const share = projectBookShare({ productType: snapshot.productType, names: data.people[0]?.name ?? data.names, selectedYear: data.title.match(/\d{4}/)?.[0], shareUrl });
  const edition = snapshot.productVersion === "v5" ? v5EditionLabel(snapshot.draft) : `제4판 · ${koreanDate((snapshot.evidencePacket as { generatedAt?: string }).generatedAt ?? snapshot.createdAtIso)} 발행`;
  // today는 열람 화면(readerBook)이 V4 세운 표의 지금을 다시 정할 때 쓴다(저장된 data는 그대로).
  return share ? { data, share, today, ...(edition ? { edition } : {}) } : null;
}
export function StoredBookReport({ snapshot, shareUrl, home, saveToLibrary, shareOwner, endNotice }: { snapshot: unknown; shareUrl?: string | null; home?: string; saveToLibrary?: { reportId: string; local?: boolean }; shareOwner?: { reportId: string; local?: boolean }; endNotice?: BookEndNoticeView }) {
  const result = storedBook(snapshot, shareUrl);
  return result ? <BookReadingPresentation {...result} home={home} saveToLibrary={saveToLibrary} shareOwner={shareOwner} endNotice={endNotice} /> : <p role="alert">저장된 책 정보를 확인할 수 없습니다.</p>;
}
