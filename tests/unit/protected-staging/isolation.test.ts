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
},120_000); // 저장소 전체 모듈 그래프 파싱: 혼자 3~4초, 전체 실행(병렬 부하)에서는 기본 10초를 넘는다.
// 기준 그래프(technical-stabilization-01, 49 roots/692 modules)는 해시 고정 기록이라 그대로 둔다. 그 뒤 운영 화면·API(관리자·운영 알림·선물·무료 책 등)가
// 정상으로 늘었으므로 「정확히 같음」 대신 지키려던 성질을 본다: 기준의 모든 root가 남아 있고, 막힌(연구·출판 안전·시험) 모듈과 풀리지 않은 import가 0.
it('customer runtime keeps every Base root with no blocked or unresolved module',()=>{
  const current=customerRuntimeGraph(src);
  expect(current.roots).toEqual(expect.arrayContaining(contract.customer.roots));
  expect(current.blocked).toEqual([]);expect(current.unresolved).toEqual([]);
});
it('independent Reader has no generation, DB, worker, analytics, share or research execution edge',()=>{
  const seen=new Set<string>();
  const visit=(file:string)=>{if(seen.has(file))return;seen.add(file);graph[file].dependencies.forEach(visit);};
  ['tools/protected-staging/reader/app/page.tsx','tools/protected-staging/reader/app/api/verify/route.ts','tools/protected-staging/reader/app/ReviewBook.tsx'].forEach(visit);
  // 광고 설정 문구 상수(metaConsent, import 없음)와 「광고 설정」 버튼(동의 창이 있는 운영 출처에서만 그려짐)은 실행 경로가 아니다 — 책 법적 고지·쪽 바닥이 쓴다.
  const textOnly=['src/lib/analytics/metaConsent.ts','src/components/analytics/MetaSettingsLink.tsx'];
  expect(graph['src/lib/analytics/metaConsent.ts'].dependencies).toEqual([]);
  expect(graph['src/components/analytics/MetaSettingsLink.tsx'].dependencies).toEqual(['src/lib/analytics/metaConsent.ts']);
  expect([...seen].filter(f=>!textOnly.includes(f)&&/publication-safety|runtimeShadow|runtimeProjection|knowledge-integration-foundation|research\/|supabase|paidReportReliability|BookReading.tsx|BookShareActions|analytics\/|SaveToLibrary|ReferralBookCta|protected-staging\/generate/.test(f))).toEqual([]);
  expect([...seen].flatMap(f=>graph[f].unresolved)).toEqual([]);
  expect(seen.has('src/app/dev/book-preview/BookReader.tsx')).toBe(true);
});
