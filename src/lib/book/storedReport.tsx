import "server-only";
import { projectV4Snapshot, validateV4Publication, type V4RuntimeEvidence } from "../interpretation-v4/runtimeProjection";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectBook } from "../../app/dev/book-preview/bookProjection";
import { projectBookShare } from "./shareModel";
import { BookReadingPresentation } from "../../components/book/BookEntry";

// Called only behind the server gate (or an explicit local test store).
// Stored version, not request input, selects the validator. No regeneration.
export const validateBookPublication: typeof validateProductPublication = (product, draft, evidence) =>
  typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v4"
    ? validateV4Publication(product, draft, evidence) : validateProductPublication(product, draft, evidence);

export function storedBook(snapshot: unknown, shareUrl?: string | null) {
  if (!isProductPreviewSnapshot(snapshot) || snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot)) return null;
  const data = projectBook(snapshot.evidencePacket as V4RuntimeEvidence);
  if (!data) return null;
  const share = projectBookShare({ productType: snapshot.productType, names: data.names, selectedYear: data.title.match(/\d{4}/)?.[0], reportId: snapshot.reportId, shareUrl });
  return share ? { data, share } : null;
}
export function StoredBookReport({ snapshot, shareUrl, home, saveToLibrary }: { snapshot: unknown; shareUrl?: string | null; home?: string; saveToLibrary?: { reportId: string; local?: boolean } }) {
  const result = storedBook(snapshot, shareUrl);
  return result ? <BookReadingPresentation {...result} home={home} saveToLibrary={saveToLibrary} /> : <p role="alert">저장된 책 정보를 확인할 수 없습니다.</p>;
}
