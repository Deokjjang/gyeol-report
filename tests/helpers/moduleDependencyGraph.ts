import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, normalize } from "node:path";
import ts from "typescript";

export type ModuleNode = { specifiers: string[]; dependencies: string[]; unresolved: string[] };
export type ModuleGraph = Record<string, ModuleNode>;

/** Explicit type-only syntax is erased; mixed, side-effect and lazy imports count. */
export function runtimeImports(source: string, file = "fixture.ts"): Pick<ModuleNode, "specifiers" | "unresolved"> {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const specifiers: string[] = [], unresolved: string[] = [];
  const add = (expression: ts.Node | undefined) => {
    if (expression && ts.isStringLiteralLike(expression)) specifiers.push(expression.text);
    else unresolved.push("COMPUTED_MODULE_REFERENCE");
  };
  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause, bindings = clause?.namedBindings;
      if (!clause || !clause.isTypeOnly && (clause.name || !bindings || ts.isNamespaceImport(bindings) || !bindings.elements.length || bindings.elements.some(e => !e.isTypeOnly))) add(node.moduleSpecifier);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && !node.isTypeOnly) {
      if (!node.exportClause || !ts.isNamedExports(node.exportClause) || !node.exportClause.elements.length || node.exportClause.elements.some(e => !e.isTypeOnly)) add(node.moduleSpecifier);
    } else if (ts.isImportEqualsDeclaration(node) && !node.isTypeOnly && ts.isExternalModuleReference(node.moduleReference)) {
      add(node.moduleReference.expression);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || ts.isIdentifier(node.expression) && node.expression.text === "require")) {
      add(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return { specifiers: [...new Set(specifiers)].sort(), unresolved };
}
export function buildModuleGraph(files: readonly string[], read: (file: string) => string): ModuleGraph {
  const paths = new Set(files);
  return Object.fromEntries([...files].sort().map(file => {
    const imports = runtimeImports(read(file), file);
    const dependencies = imports.specifiers.flatMap(specifier => {
      if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return [];
      const target = specifier.startsWith("@/") ? `src/${specifier.slice(2)}` : normalize(join(dirname(file), specifier));
      return [target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`, `${target}/index.tsx`].find(path => paths.has(path)) ?? [];
    });
    return [file, { ...imports, dependencies: [...new Set(dependencies)].sort() }];
  }));
}
export function readModuleGraph(): ModuleGraph {
  const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(join(directory, entry.name)) : /\.tsx?$/.test(entry.name) ? [join(directory, entry.name)] : []);
  return buildModuleGraph(walk("src"), file => readFileSync(file, "utf8"));
}
export function layerImports(graph: ModuleGraph, names: readonly string[]): Record<string, string[]> {
  return Object.fromEntries(Object.entries(graph).flatMap(([file, node]) => {
    const imports = node.specifiers.filter(specifier => names.includes(basename(specifier).replace(/\.tsx?$/, "")));
    return imports.length ? [[file, imports]] : [];
  }));
}
export function customerRuntimeGraph(graph: ModuleGraph) {
  const roots = Object.keys(graph).filter(file => file.startsWith("src/app/") && !file.startsWith("src/app/dev/") && /\/(page|layout|route)\.tsx?$/.test(file));
  const reached = new Set<string>();
  function visit(file: string): void {
    if (reached.has(file)) return;
    reached.add(file);
    graph[file].dependencies.forEach(visit);
  }
  roots.forEach(visit);
  const files = [...reached].sort();
  return { roots, files,
    blocked: files.filter(file => /knowledge-integration-foundation|publication-safety|research\/|^tests\//.test(file)),
    unresolved: files.flatMap(file => graph[file].unresolved.map(reason => ({ file, reason }))),
    digest: createHash("sha256").update(JSON.stringify(files.map(file => [file, graph[file]]))).digest("hex") };
}
