import { generateKeyPairSync } from 'node:crypto';
import { beforeAll, expect, it, vi, afterEach } from 'vitest';
vi.mock('server-only', () => ({}));
import { storedBook } from '../../../src/lib/book/storedReport';
import { generateReviewBook } from '../../../tools/protected-staging/generate';
import { signBook, verifyBook, sha256, type ReviewArtifact, type SignedBook } from '../../../tools/protected-staging/artifact';
import { readerAccess } from '../../../tools/protected-staging/reader/access';
import { POST } from '../../../tools/protected-staging/reader/app/api/verify/route';
import locks from '../../fixtures/six-product-integration-01/source-locks.json';
import type { ReportInputPayload } from '../../../src/lib/report-generation/reportInputTypes';
const keys = generateKeyPairSync('ed25519'), wrong = generateKeyPairSync('ed25519'), source = '1b89d8d90fdad2b0a82b783e2d948c9cc5de878f';
const payload = locks.find(f => f.product === 'comprehensive' && f.id === 'A')!.payload as ReportInputPayload;
let signed: SignedBook, artifact: ReviewArtifact;
beforeAll(async () => {
  const result = await generateReviewBook(payload, keys.privateKey, source);
  expect(result.ok).toBe(true); if (!result.ok) throw Error(result.errors.join('|'));
  signed = result.signed; artifact = JSON.parse(signed.payload);
});
afterEach(() => vi.unstubAllEnvs());
it('accepts only an authentic real Publisher/Book roundtrip', () => {
  expect(verifyBook(JSON.parse(JSON.stringify(signed)),keys.publicKey,source)).toEqual({ok:true,artifact});
  expect(artifact).toMatchObject({inputHash:sha256(payload),testOnly:true,approvedForCustomerUse:false,humanQualityApproved:false,customerAuthorized:false,actualCustomerClaims:0,actualBookAllocations:0});
});
it.each(['sourceCommit','inputHash','evidenceHash','bookHash','safeToPublish','customerAuthorized','relationshipCategory','book'])('rejects client mutation even with recomputed digest: %s', field => {
  const bad=structuredClone(artifact);Object.assign(bad,{[field]:field==='book'?{...bad.book,title:'위조'}:'forged'});if(field !== 'bookHash')bad.bookHash=sha256(bad.book);
  expect(verifyBook({...signed,payload:JSON.stringify(bad)},keys.publicKey,source).ok).toBe(false);
});
it('rejects unsigned JSON, wrong keys and a valid signature for a different source revision', () => {
  expect(verifyBook(artifact,keys.publicKey,source).ok).toBe(false);
  expect(verifyBook(signed,wrong.publicKey,source).ok).toBe(false);
  expect(verifyBook(signed,keys.publicKey,'a'.repeat(40)).ok).toBe(false);
});
it.each(['approvedForCustomerUse','humanQualityApproved','customerAuthorized','actualCustomerClaims','actualBookAllocations'])('transport signature cannot license customer authority: %s', field => {
  const bad={...artifact,[field]:true};expect(verifyBook(signBook(bad,keys.privateKey),keys.publicKey,source).ok).toBe(false);
});
it('rejects re-signed invalid reader version, horizon and product contracts', () => {
  for(const bad of [{...artifact,readerVersion:'old'},{...artifact,productKey:'not-a-product'},{...artifact,productKey:'major_fortune'},{...artifact,relationshipCategory:'businessPartner'}])
    expect(verifyBook(signBook(bad as ReviewArtifact,keys.privateKey),keys.publicKey,source).ok).toBe(false);
});
it.each([
  {NODE_ENV:'production'}, {NODE_ENV:'development',VERCEL:'1',VERCEL_ENV:'production'},
  {NODE_ENV:'production',VERCEL:'1',VERCEL_ENV:'preview',VERCEL_PROJECT_ID:'prj_Iqp9hru3W1oQ6YLvGmvWl98yDUbc'},
  {NODE_ENV:'development',VERCEL:'1',VERCEL_ENV:'preview',VERCEL_PROJECT_ID:'forged',GYEOL_STAGING_ENABLED:'true'},
] as const)('default deployment policy is closed, including all Preview flags: %j', env => {expect(readerAccess(env,'127.0.0.1:4318')).toBe(false);});
it('local development binds the exact loopback host, never a random URL as auth', () => {
  expect(readerAccess({NODE_ENV:'development'},'127.0.0.1:4318')).toBe(true);
  for(const host of ['evil.example','localhost:4318','127.0.0.1:9999',null])expect(readerAccess({NODE_ENV:'development'},host)).toBe(false);
});
function request(value: unknown, origin='http://127.0.0.1:4318') {return new Request('http://127.0.0.1:4318/api/verify',{method:'POST',headers:{Host:'127.0.0.1:4318',Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(value)});}
function local(){vi.stubEnv('NODE_ENV','development');vi.stubEnv('VERCEL','');vi.stubEnv('GYEOL_STAGING_SOURCE_COMMIT',source);vi.stubEnv('GYEOL_STAGING_REVIEW_PUBLIC_KEY',keys.publicKey.export({type:'spki',format:'pem'}).toString());}
it('verification endpoint accepts an authentic artifact without storage or runtime generation',async()=>{local();const r=await POST(request(signed));expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toContain('no-store');expect((await r.json()).artifact.book).toEqual(artifact.book);});
it('verification endpoint blocks cross-origin, unsigned, invalid config and Production',async()=>{
  local();expect((await POST(request(signed,'https://evil.example'))).status).toBe(403);
  expect((await POST(request(artifact))).status).toBe(422);
  vi.stubEnv('GYEOL_STAGING_REVIEW_PUBLIC_KEY','');expect((await POST(request(signed))).status).toBe(503);
  vi.stubEnv('NODE_ENV','production');expect((await POST(request(signed))).status).toBe(404);
});
it('rejects over-limit request streams before parsing even without Content-Length',async()=>{local();const r=await POST(request('x'.repeat(8*1024*1024+5000)));expect(r.status).toBe(413);});
it('local generator refuses Vercel and invalid input before it can sign',async()=>{
  vi.stubEnv('VERCEL','1');expect(await generateReviewBook(payload,keys.privateKey,source)).toMatchObject({ok:false,stage:'environment'});
  vi.stubEnv('VERCEL','');expect(await generateReviewBook(('person' in payload ? {...payload,person:{...payload.person,name:''}} : {...payload,personA:{...payload.personA,name:''}}),keys.privateKey,source)).toMatchObject({ok:false,stage:'input'});
});

it('preserves the exact local browser origin when Next normalizes its internal URL',async()=>{local();const r=await POST(new Request('http://localhost:4318/api/verify',{method:'POST',headers:{Host:'127.0.0.1:4318',Origin:'http://127.0.0.1:4318','Content-Type':'application/json'},body:JSON.stringify(signed)}));expect(r.status).toBe(200);});

it('a signed review artifact is never a customer stored snapshot or Reader bridge',()=>{expect(storedBook(signed)).toBeNull();expect(storedBook(artifact)).toBeNull();});
