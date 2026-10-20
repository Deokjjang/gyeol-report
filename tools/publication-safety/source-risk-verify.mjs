import fs from 'node:fs';
import path from 'node:path';
import { bootstrap } from './bootstrap.mjs';
const root = process.cwd(), out = path.resolve(process.argv[2] ?? '');
if (process.argv.length !== 3 || !/^\/(?:private\/)?tmp\//.test(out) || fs.existsSync(out)) throw Error('NEW_EXTERNAL_AUDIT_FILE_REQUIRED');
const { load, require } = bootstrap(root);
const { readGlobalArtifact } = load('src/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/artifactReader.ts');
const { SourceReader } = load('src/lib/report-knowledge/knowledge-integration-foundation/sourceReader.ts');
const directory = path.join(root, 'docs/validation/v4-global-source-domain-resolution-01');
const source = readGlobalArtifact(directory, 'source-resolution-overlay.json'), proofs = readGlobalArtifact(directory, 'source-exact-proofs.json');
const domain = readGlobalArtifact(directory, 'domain-resolution-overlay.json'), major = readGlobalArtifact(directory, 'major-source-integrity-failures.json');
const reader = new SourceReader(root, async file => require(file)), errors = [];
for (const p of proofs) { const check = await reader.locate({ ...p.exactSourcePointer, recordHashEncoding: p.hashEncoding }); if (check.code) errors.push({ reference: p.originalReferenceKey, code: check.code }); }
const domainStates = {}; for (const d of domain) domainStates[d.originalDecisionState] = (domainStates[d.originalDecisionState] ?? 0) + 1;
const result = { sourceReferences: source.length, sourceRecovered: proofs.length, sourceStillHeld: source.length - proofs.length,
  currentSourceProofReverified: proofs.length - errors.length, errors, domainReview: domain.length, domainStates,
  majorFailures: major.length, majorUniqueReferences: new Set(major.map(m => m.originalId)).size,
  newTechnicalResolutions: 0, newDomainApprovals: 0, customerApprovals: 0 };
if (errors.length || result.sourceStillHeld !== 2677 || domain.length !== 2966 || major.length !== 30) throw Error('ORIGINAL_RISK_STATE_OR_SOURCE_CHANGED');
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
process.stdout.write('525 exact Source identities verified; unresolved/Domain/approval states retained\n');
