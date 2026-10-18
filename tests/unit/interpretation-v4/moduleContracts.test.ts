import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import contract from "../../fixtures/technical-stabilization-01/module-contract.json";
import { buildModuleGraph, customerRuntimeGraph, readModuleGraph, runtimeImports } from "../../helpers/moduleDependencyGraph";

it("pins reviewed Base edges and the complete customer runtime graph", () => {
  expect(createHash("sha256").update(readFileSync("tests/fixtures/technical-stabilization-01/module-contract.json")).digest("hex"))
    .toBe("d92efb9806521bcca82d1e146dd7af3c1b99cf481cf85418c63b78b855147970");
  expect(contract.sourceSha).toBe("7ef25fcc0ae6f7765473433a826cb7cf96068a7b");
  const current = customerRuntimeGraph(readModuleGraph());
  expect(current).toEqual(contract.customer);
  expect(current.roots).toHaveLength(46);
  expect(current.files).toHaveLength(700);
  expect(current.blocked).toEqual([]);
  expect(current.unresolved).toEqual([]);
});
it.each([
  'import type { X } from "blocked";', 'import { type X } from "blocked";',
  'export type { X } from "blocked";', 'export { type X } from "blocked";',
  'type X = typeof import("blocked");', '// import("blocked")\nconst text = "import blocked";',
])("erases only explicit type or non-code references: %s", source => {
  expect(runtimeImports(source)).toEqual({ specifiers: [], unresolved: [] });
});
it.each([
  'import { type X, value } from "blocked";', 'import "blocked";', 'import {} from "blocked";',
  'export { value } from "blocked";', 'export * from "blocked";', 'export {} from "blocked";',
  'const value = import("blocked");', 'const value = require("blocked");',
  'import value = require("blocked");',
])("detects real execution edges including lazy/re-export/CommonJS: %s", source => {
  expect(runtimeImports(source).specifiers).toEqual(["blocked"]);
});
it("does not silently ignore a computed module reference", () => {
  expect(runtimeImports("import(path); require(name);").unresolved).toEqual(["COMPUTED_MODULE_REFERENCE", "COMPUTED_MODULE_REFERENCE"]);
});
it("a type-to-value change makes offline research reachable from a public route", () => {
  const file = "src/lib/knowledge-integration-foundation/engine.ts";
  const sources = { "src/app/page.tsx": 'import type { X } from "../lib/knowledge-integration-foundation/engine";', [file]: "export const X = 1;" };
  expect(customerRuntimeGraph(buildModuleGraph(Object.keys(sources), f => sources[f as keyof typeof sources])).blocked).toEqual([]);
  sources["src/app/page.tsx"] = sources["src/app/page.tsx"].replace("import type", "import");
  expect(customerRuntimeGraph(buildModuleGraph(Object.keys(sources), f => sources[f as keyof typeof sources])).blocked).toEqual([file]);
});
