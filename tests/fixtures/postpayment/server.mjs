// Local-only visual harness; never imported by the application or deployed.
// POSTPAYMENT_QA_DIR=/tmp/postpayment-qa pnpm exec vitest run tests/unit/app/reports/postPaymentExperience.test.tsx
// node tests/fixtures/postpayment/server.mjs
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const vitePath = require.resolve('vite', { paths: [dirname(require.resolve('vitest/package.json'))] });
const { createServer } = await import(pathToFileURL(vitePath).href);
const root = dirname(fileURLToPath(import.meta.url));
const fixtureDir = process.env.POSTPAYMENT_QA_DIR ?? '/tmp/postpayment-qa';
const server = await createServer({
  configFile: false,
  root,
  resolve: { alias: {
    'next/navigation': resolve(root, 'router.tsx'),
    'next/link': resolve(root, 'link.tsx'),
  } },
  server: { host: '127.0.0.1', port: 3102, strictPort: true, fs: { allow: [resolve(root, '../../..')] } },
  plugins: [{ name: 'local-completed-fixture', configureServer(server) {
    server.middlewares.use('/completed.html', (_request, response) => {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(readFileSync(resolve(fixtureDir, 'COMPLETED.html'), 'utf8'));
    });
  } }],
});
await server.listen();
server.printUrls();
