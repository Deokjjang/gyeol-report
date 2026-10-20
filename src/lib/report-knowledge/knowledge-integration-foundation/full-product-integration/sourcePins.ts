import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hash } from '../sourceReader';
import { isRecord } from '../normalization';

// Audit metadata, not a research import, interpretation selector or approval.
export const SOURCE_PIN_FILE = 'tests/fixtures/full-product-integration-01/reader-source-pins.json';
const SOURCE_PIN_SHA256 = '015af4cdf2263f8ff6a54547221bd3a53502f89f79766363e447145c75ba793d';
export function readerSourcePins(root: string): Readonly<Record<string, string>> {
  const bytes = readFileSync(join(root, SOURCE_PIN_FILE));
  if (hash(bytes) !== SOURCE_PIN_SHA256) throw Error('INTEGRATION_SOURCE_PIN_MANIFEST_CHANGED');
  const data: unknown = JSON.parse(bytes.toString());
  if (!isRecord(data) || Object.values(data).some(v => typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v))) throw Error('INVALID_INTEGRATION_SOURCE_PINS');
  return Object.freeze(data as Record<string, string>);
}
