import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createPrivateKey, generateKeyPairSync } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { bootstrap } from '../publication-safety/bootstrap.mjs';
import { reviewFixtures } from './fixtures.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const keyDir = path.join(os.homedir(), 'Documents/gyeol-validation/v4-protected-staging-integration-01/keys');
const privateFile = path.join(keyDir, 'review-private.pem'), publicFile = path.join(keyDir, 'review-public.pem');
if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw Error('LOCAL_GENERATION_ONLY');
if (process.argv[2] === 'init-key') {
  fs.mkdirSync(keyDir, { recursive: true, mode: 0o700 });
  if (fs.existsSync(privateFile) || fs.existsSync(publicFile)) throw Error('KEY_ALREADY_EXISTS_DO_NOT_ROTATE');
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  fs.writeFileSync(privateFile, privateKey.export({ type:'pkcs8',format:'pem' }), { flag:'wx',mode:0o600 });
  fs.writeFileSync(publicFile, publicKey.export({ type:'spki',format:'pem' }), { flag:'wx',mode:0o600 });
  process.stdout.write('Review transport key created outside repository.\n');
  process.exit(0);
}
const stat = fs.lstatSync(privateFile);
if (stat.uid !== os.userInfo().uid || !stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o077)) throw Error('PRIVATE_KEY_PERMISSIONS_REQUIRED');
const key = createPrivateKey(fs.readFileSync(privateFile));
const sourceCommit = execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
if (execFileSync('git',['diff','1b89d8d90fdad2b0a82b783e2d948c9cc5de878f','--','src','docs/product'],{cwd:root}).length) throw Error('ORIGINAL_WRITER_SOURCE_CHANGED');
if (execFileSync('git',['diff','HEAD','--','tools/protected-staging'],{cwd:root}).length) throw Error('COMMITTED_REVIEW_TOOLS_REQUIRED');
execFileSync('git',['ls-files','--error-unmatch','tools/protected-staging/generate.ts'],{cwd:root,stdio:'pipe'});
process.chdir(root);
const fixtures = reviewFixtures(root), { load } = bootstrap(root);
const { generateReviewBook } = load('tools/protected-staging/generate.ts');
const enums = load('src/lib/report-generation/reportInputTypes.ts');
const { BOOKS } = load('src/lib/book/product.ts');
const { BIRTH_TIME_SLOT_DEFINITIONS } = load('src/lib/saju/birthTimePrecisionTypes.ts');
const products = BOOKS.map(b => [b.productKey, b.slug, b.title.replaceAll('\n', ' ')]);
let busy = false;
const host = '127.0.0.1', port = 4317, origin = `http://${host}:${port}`;
const headers = { 'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" };
http.createServer(async (req,res) => {
  const send = (status,value) => { res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value)); };
  if (req.headers.host !== `${host}:${port}` || req.socket.remoteAddress !== host) return send(403,{ok:false,error:'LOCAL_ONLY'});
  if (req.method === 'GET' && req.url === '/') { res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});return res.end(fs.readFileSync(path.join(root,'tools/protected-staging/input.html'))); }
  if (req.method === 'GET' && req.url === '/icon.svg') {res.writeHead(200,{...headers,'Content-Type':'image/svg+xml'});return res.end(fs.readFileSync(path.join(root,'src/app/icon.svg')));}
  if (req.method === 'GET' && req.url === '/input.js') {res.writeHead(200,{...headers,'Content-Type':'text/javascript; charset=utf-8'});return res.end(fs.readFileSync(path.join(root,'tools/protected-staging/input.js')));}
  if (req.method === 'GET' && req.url === '/input.css') {res.writeHead(200,{...headers,'Content-Type':'text/css'});return res.end(fs.readFileSync(path.join(root,'tools/protected-staging/input.css')));}
  if (req.method === 'GET' && req.url === '/fixtures') return send(200,{fixtures,products,birthSlots:BIRTH_TIME_SLOT_DEFINITIONS,enums:Object.fromEntries(['MBTI_TYPES','GENDER_VALUES','JOB_STATUSES','RELATIONSHIP_STATUSES','FOCUS_AREAS','BIRTH_TIME_SLOTS','COMPATIBILITY_RELATIONSHIP_TYPES','COMPATIBILITY_ROLE_VERSION'].map(k=>[k,enums[k]]))});
  if (req.method !== 'POST' || req.url !== '/generate') return send(404,{ok:false,error:'NOT_FOUND'});
  if (req.headers.origin !== origin || req.headers['sec-fetch-site'] && req.headers['sec-fetch-site'] !== 'same-origin') return send(403,{ok:false,error:'SAME_ORIGIN_REQUIRED'});
  if (!req.headers['content-type']?.startsWith('application/json')) return send(415,{ok:false,error:'JSON_REQUIRED'});
  if (busy) return send(429,{ok:false,error:'GENERATION_IN_PROGRESS'});
  busy=true;
  try {
    let text=''; for await (const chunk of req) {text+=chunk;if(Buffer.byteLength(text)>32768)return send(413,{ok:false,error:'INPUT_TOO_LARGE'});}
    const request=JSON.parse(text);
    if (request.fictionalOnly !== true) return send(400,{ok:false,error:'FICTIONAL_INPUT_CONFIRMATION_REQUIRED'});
    const result=await generateReviewBook(request.payload,key,sourceCommit);
    return send(result.ok?200:422,result);
  } catch {return send(400,{ok:false,error:'REVIEW_GENERATION_FAILED'});} finally {busy=false;}
}).listen(port,host,()=>process.stdout.write(`Local verified generation: ${origin}\n`));
