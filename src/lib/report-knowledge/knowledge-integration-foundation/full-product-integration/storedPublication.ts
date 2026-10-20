import { isProductPreviewSnapshot } from '../../../report-generation/productPreviewSnapshot';
import { isRecord } from '../../../report-generation/productPublishGate';
import { storedBook, validateBookPublication } from '../../../book/storedReport';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { assertOfflineIntegration } from './readerCatalog';

/** Existing stored Edition only. No Editorial text insertion, generation,
 * DB access, owner/expiry authorization or customer publishing authority. */
export function inspectStoredPublication(snapshot: unknown) {
  assertOfflineIntegration();
  if (!isProductPreviewSnapshot(snapshot)) return { ok: false as const, errors: ['EXISTING_SNAPSHOT_REQUIRED'] };
  const before = digest(snapshot), gate = validateBookPublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket);
  if (!gate.ok) return { ok: false as const, errors: [...gate.errors] };
  const data = snapshot.productVersion === 'v4' ? storedBook(snapshot)?.data ?? null : null;
  if (snapshot.productVersion === 'v4' && !data) return { ok: false as const, errors: ['EXISTING_V4_BOOK_READER_REJECTED'] };
  if (digest(snapshot) !== before) throw Error('STORED_BOOK_MUTATION_FORBIDDEN');
  const packet = snapshot.evidencePacket;
  return { ok: true as const, errors: [], edition: snapshot.productVersion, snapshotHash: before,
    book: data, bookHash: data ? digest(data) : null,
    calculationHash: isRecord(packet) && packet.calculations ? digest(packet.calculations) : null,
    existingReader: snapshot.productVersion === 'v4' ? 'EXISTING_V4_BOOK_READER' : 'EXISTING_LEGACY_REPORT_READER',
    regenerated: false, customerAuthorizationGranted: false, productionWrites: 0 };
}
export function reopenStoredPublication(serialized: string) {
  assertOfflineIntegration();
  try { return inspectStoredPublication(JSON.parse(serialized)); }
  catch { return { ok: false as const, errors: ['INVALID_STORED_SNAPSHOT'] }; }
}
