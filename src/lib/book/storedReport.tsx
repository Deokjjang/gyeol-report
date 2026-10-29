import "server-only";
import { projectV4Snapshot, validateV4Publication, type V4RuntimeEvidence } from "../interpretation-v4/runtimeProjection";
import { validateProductPublication } from "../report-generation/productPublishGate";
import { isProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";
import { projectBook } from "../../app/dev/book-preview/bookProjection";
import { projectBookShare } from "./shareModel";
import { BookReadingPresentation } from "../../components/book/BookEntry";
import { projectV5Book, validateV5Publication, type V5BookDraft } from "../writer/book";
import { withV5Presentation } from "./v5View";

// Called only behind the server gate (or an explicit local test store).
// Stored version, not request input, selects the validator. No regeneration.
export const validateBookPublication: typeof validateProductPublication = (product, draft, evidence) =>
  typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v5"
    ? validateV5Publication(product, draft, evidence)
    : typeof draft === "object" && draft !== null && "productVersion" in draft && draft.productVersion === "v4"
      ? validateV4Publication(product, draft, evidence) : validateProductPublication(product, draft, evidence);

export function storedBook(snapshot: unknown, shareUrl?: string | null) {
  if (!isProductPreviewSnapshot(snapshot)) return null;
  if (snapshot.productVersion !== "v5" && (snapshot.productVersion !== "v4" || !projectV4Snapshot(snapshot))) return null;
  const projected = snapshot.productVersion === "v5" ? projectV5Book(snapshot) : projectBook(snapshot.evidencePacket as V4RuntimeEvidence);
  if (!projected) return null;
  // v5만 표시 보강(엔진 관계 목록·대운·세운 카드). 본문·쪽 구성은 그대로다.
  const data = snapshot.productVersion === "v5" ? withV5Presentation(projected, snapshot.draft as unknown as V5BookDraft) : projected;
  const share = projectBookShare({ productType: snapshot.productType, names: data.people[0]?.name ?? data.names, selectedYear: data.title.match(/\d{4}/)?.[0], shareUrl });
  return share ? { data, share } : null;
}
export function StoredBookReport({ snapshot, shareUrl, home, saveToLibrary, shareOwner }: { snapshot: unknown; shareUrl?: string | null; home?: string; saveToLibrary?: { reportId: string; local?: boolean }; shareOwner?: { reportId: string; local?: boolean } }) {
  const result = storedBook(snapshot, shareUrl);
  return result ? <BookReadingPresentation {...result} home={home} saveToLibrary={saveToLibrary} shareOwner={shareOwner} /> : <p role="alert">저장된 책 정보를 확인할 수 없습니다.</p>;
}
