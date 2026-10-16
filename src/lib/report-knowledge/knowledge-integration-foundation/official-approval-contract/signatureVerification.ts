import { createPublicKey, verify } from 'node:crypto';
import { hash } from '../sourceReader';
import { APPROVAL_VERSION } from './types';
import { signedPayload } from './canonicalApproval';
export function publicKeyFingerprint(spki: string): string {
 const bytes = Buffer.from(spki, 'base64');
 if (bytes.toString('base64') !== spki) throw Error('NON_CANONICAL_PUBLIC_KEY');
 const key = createPublicKey({ key: bytes, format: 'der', type: 'spki' });
 if (key.asymmetricKeyType !== 'ed25519' || !Buffer.from(key.export({ format:'der', type:'spki' })).equals(bytes)) throw Error('ED25519_PUBLIC_KEY_REQUIRED');
 return hash(bytes);
}
export function verifySignedRecord(value: Record<string, unknown>, spki: string): boolean {
 try {
  if (value.approvalContractVersion !== APPROVAL_VERSION || value.signatureAlgorithm !== 'Ed25519' || typeof value.signature !== 'string') return false;
  const signature = Buffer.from(value.signature, 'base64');
  if (signature.length !== 64 || signature.toString('base64') !== value.signature) return false;
  publicKeyFingerprint(spki);
  const key = createPublicKey({ key: Buffer.from(spki, 'base64'), format:'der', type:'spki' });
  return verify(null, signedPayload(value), key, signature);
 } catch { return false; }
}
