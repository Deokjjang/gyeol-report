import "server-only";
import { projectV4Snapshot, validateV4Publication, type V4RuntimeEvidence } from "../interpretation-v4/runtimeProjection";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectBook } from "../../app/dev/book-preview/bookProjection";
import { projectBookShare } from "./shareModel";
import { BookReadingPresentation } from "../../components/book/BookEntry";
import { projectV5Book, v5EditionLabel, validateV5Publication } from "../writer/book";
import { koreanDate, kstDay } from "./readerCopy";

// Called only behind the server gate (or an explicit local test store).
// Stored version, not request input, selects the validator. No regeneration.
export const validateBookPublication: typeof validateProductPublication = (product, draft, evidence) =>
  typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v5"
    ? validateV5Publication(product, draft, evidence)
    : typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v4"
      ? validateV4Publication(product, draft, evidence) : validateProductPublication(product, draft, evidence);

/** today(KST 날짜): v5 대운·세운 표의 지금 기준(열람은 읽는 날). edition: 판 표기(본문 data와 따로, 열람 화면이 붙인다).
 * 과거 V4 Book은 "제4판 · 발행일". */
export function storedBook(snapshot: unknown, shareUrl?: string | null, today = kstDay(new Date().toISOString())) {
  if (!isProductPreviewSnapshot(snapshot)) return null;
  if (snapshot.productVersion !== "v5" && (snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot))) return null;
  const data = snapshot.productVersion === "v5" ? projectV5Book(snapshot, today) : projectBook(snapshot.evidencePacket as V4RuntimeEvidence);
  if (!data) return null;
  const share = projectBookShare({ productType: snapshot.productType, names: data.people[0]?.name ?? data.names, selectedYear: data.title.match(/\d{4}/)?.[0], shareUrl });
  const edition = snapshot.productVersion === "v5" ? v5EditionLabel(snapshot.draft) : `제4판 · ${koreanDate((snapshot.evidencePacket as { generatedAt?: string }).generatedAt ?? snapshot.createdAtIso)} 발행`;
  return share ? { data, share, ...(edition ? { edition } : {}) } : null;
}
export function StoredBookReport({ snapshot, shareUrl, home, saveToLibrary, shareOwner }: { snapshot: unknown; shareUrl?: string | null; home?: string; saveToLibrary?: { reportId: string; local?: boolean }; shareOwner?: { reportId: string; local?: boolean } }) {
  const result = storedBook(snapshot, shareUrl);
  return result ? <BookReadingPresentation {...result} home={home} saveToLibrary={saveToLibrary} shareOwner={shareOwner} /> : <p role="alert">저장된 책 정보를 확인할 수 없습니다.</p>;
}
