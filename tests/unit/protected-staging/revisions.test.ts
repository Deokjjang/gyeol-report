import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { stagingProtectionContract, validateStagingProtectionContract } from '../../helpers/versionedProtection';
const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
it('pins only exact setup revisions and preserves the original technical receipt', () => {
  expect(hash('tests/fixtures/protected-staging-integration-01/source-revision-contract.json')).toBe('027417bfee13bbc30588b28eac148359bb646a3ad03a5ef9d2c52cc414399569');
  const old = stagingProtectionContract.immutableTechnicalReceipt;
  expect(hash(old.file)).toBe(old.sha256);
  expect(Object.keys(stagingProtectionContract.currentDeltas)).toHaveLength(2);
  validateStagingProtectionContract();
});
it.each(Object.entries(stagingProtectionContract.currentDeltas))('matches reviewed actual test bytes: %s', (file, delta) => {
  expect(hash(file)).toBe(delta.after);
  expect(delta.before).not.toBe(delta.after);
});
it.each(['src/lib/interpretation-v4/runtimeShadow.ts','tests/unit/../../src/engine.ts'])('cannot extend the revision to %s', file => {
  const bad = structuredClone(stagingProtectionContract);
  Object.assign(bad.currentDeltas, { [file]: { before: '0'.repeat(64), after: '1'.repeat(64) } });
  expect(() => validateStagingProtectionContract(bad)).toThrow('EXACT_STAGING_TEST_SCOPE_REQUIRED');
});
it.each(['baseSha','customerRuntimeActivated','researchSourcesChanged','historicalHashFilesRewritten'])('cannot change protection %s', field => {
  const bad = structuredClone(stagingProtectionContract); Object.assign(bad,{[field]:field==='baseSha'?'0'.repeat(40):true});
  expect(() => validateStagingProtectionContract(bad)).toThrow('STAGING_PRESERVATION_REQUIRED');
});
it.each(['before','after'] as const)('cannot substitute an unreviewed %s hash', field => {
  const bad = structuredClone(stagingProtectionContract);
  bad.currentDeltas['tests/unit/interpretation-v4/runtimeShadow.test.tsx'][field]='0'.repeat(64);
  expect(() => validateStagingProtectionContract(bad)).toThrow('EXACT_STAGING_TEST_CHAIN_REQUIRED');
});
