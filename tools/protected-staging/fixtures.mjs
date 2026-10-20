import fs from 'node:fs';
import path from 'node:path';
export function reviewFixtures(root) {
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const risks = { love:['O','Q'], marriage:['M','N','AB'], 'parent-child':['L','M','V','A'], coworker:['L','M','AG','W'], 'manager-report':['L','M','AL','AJ','AK'], 'business-partner':['L','M','AO','AM','AN'], friendship:['L0','M0','A0','H0'] };
  const cases = [];
  for (const [category, ids] of Object.entries(risks)) for (const id of ids) {
    const row = read(`docs/validation/v4-compatibility-${category}-product-knowledge-01/input-cases.json`).find(c => (c.letter ?? c.id) === id);
    if (!row) throw Error('ORIGINAL_FIXTURE_REQUIRED');
    for (const [variant, payload] of (row.variants ?? [row.payload]).entries()) cases.push({ id: `${category}/${id}/${variant}`, payload });
  }
  for (const f of read('tests/fixtures/six-product-integration-01/source-locks.json').filter(f => f.product === 'compatibility' ? ['A','marriage','parentChild','coworker','managerReport','businessPartner','friendship'].includes(f.id) : f.id === 'A'))
    cases.push({ id: `route/${f.product}/${f.id}`, payload: f.payload });
  if (cases.length !== 39) throw Error('EXACT_39_FIXTURES_REQUIRED');
  return cases;
}
