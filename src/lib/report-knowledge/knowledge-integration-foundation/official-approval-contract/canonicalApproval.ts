import { canonicalJson, hash } from '../sourceReader';
import { SIGNING_DOMAIN } from './types';

// Reuse SourceReader's sorted-key encoding only after rejecting non-JSON values.
// Array order and Unicode code points are preserved; this is not a claim of full JCS.
export function canonicalApproval(value: unknown): string {
 const active = new Set<object>();
 const check = (v: unknown): void => {
  if (v === null || typeof v === 'boolean') return;
  if (typeof v === 'string') { if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v)) throw Error('INVALID_UNICODE'); return; }
  if (typeof v === 'number') { if (!Number.isFinite(v)) throw Error('NON_FINITE_JSON_NUMBER'); return; }
  if (typeof v !== 'object' || active.has(v)) throw Error('NON_JSON_OR_CYCLIC_PAYLOAD');
  const proto = Object.getPrototypeOf(v);
  if (Array.isArray(v) ? proto !== Array.prototype : proto !== Object.prototype && proto !== null) throw Error('NON_PLAIN_JSON_OBJECT');
  if (Object.getOwnPropertySymbols(v).length) throw Error('SYMBOL_FIELD');
  active.add(v);
  const names = Object.getOwnPropertyNames(v);
  for (const k of names) {
   if (Array.isArray(v) && k === 'length') continue;
   const d = Object.getOwnPropertyDescriptor(v, k)!;
   if (!d.enumerable || !('value' in d) || ['__proto__', 'constructor', 'prototype'].includes(k)) throw Error('UNSAFE_JSON_FIELD');
   if (Array.isArray(v) && (!/^(0|[1-9]\d*)$/.test(k) || Number(k) >= v.length)) throw Error('NON_JSON_ARRAY_PROPERTY');
   check(d.value);
  }
  if (Array.isArray(v) && names.length !== v.length + 1) throw Error('SPARSE_ARRAY');
  active.delete(v);
 };
 check(value); return canonicalJson(value);
}
export const approvalHash = (v: unknown): string => hash(canonicalApproval(v));
export function unsignedPayload(value: Record<string, unknown>): Record<string, unknown> {
 const { signature: omitted, ...payload } = value; void omitted; return payload;
}
export function signedPayload(value: Record<string, unknown>): Buffer {
 canonicalApproval(value);
 return Buffer.from(SIGNING_DOMAIN + '\0' + canonicalApproval(unsignedPayload(value)), 'utf8');
}
export function signedPayloadHash(value: Record<string, unknown>): string { return hash(signedPayload(value)); }
export const sameApprovalValue = (a: unknown, b: unknown): boolean => canonicalApproval(a) === canonicalApproval(b);
export function jsonSnapshot<T>(v: T): T { return JSON.parse(canonicalApproval(v)) as T; }
export function exactKeys(v: unknown, keys: readonly string[]): v is Record<string, unknown> {
 if (v === null || typeof v !== 'object' || Array.isArray(v)) return false;
 const names = Object.keys(v); return names.length === keys.length && keys.every(k => Object.hasOwn(v, k));
}
