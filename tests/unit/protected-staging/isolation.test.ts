import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, it } from 'vitest';
import { buildModuleGraph, readModuleGraph, customerRuntimeGraph, type ModuleGraph } from '../../helpers/moduleDependencyGraph';
import contract from '../../fixtures/technical-stabilization-01/module-contract.json';
let src: ModuleGraph, graph: ModuleGraph;
beforeAll(() => {
  src=readModuleGraph();
  const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?e.name==='.next'?[]:walk(join(dir,e.name)):/\.tsx?$/.test(e.name)?[join(dir,e.name)]:[]);
  const tools=walk('tools/protected-staging'), files=[...Object.keys(src),...tools];
  // Parse each source once; use the existing Base graph for existing modules.
  const toolGraph=buildModuleGraph(files,f=>f.startsWith('tools/')?readFileSync(f,'utf8'):'');
  graph={...toolGraph,...src};
});
it('customer runtime remains the exact 46-root/700-module Base graph',()=>{expect(customerRuntimeGraph(src)).toEqual(contract.customer);});
it('independent Reader has no generation, DB, worker, analytics, share or research execution edge',()=>{
  const seen=new Set<string>();
  const visit=(file:string)=>{if(seen.has(file))return;seen.add(file);graph[file].dependencies.forEach(visit);};
  ['tools/protected-staging/reader/app/page.tsx','tools/protected-staging/reader/app/api/verify/route.ts','tools/protected-staging/reader/app/ReviewBook.tsx'].forEach(visit);
  expect([...seen].filter(f=>/publication-safety|runtimeShadow|runtimeProjection|knowledge-integration-foundation|research\/|supabase|paidReportReliability|BookReading.tsx|BookShareActions|analytics\/|SaveToLibrary|ReferralBookCta|protected-staging\/generate/.test(f))).toEqual([]);
  expect([...seen].flatMap(f=>graph[f].unresolved)).toEqual([]);
  expect(seen.has('src/app/dev/book-preview/BookReader.tsx')).toBe(true);
});
