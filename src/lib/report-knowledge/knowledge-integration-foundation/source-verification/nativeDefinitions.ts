import ts from "typescript";
import type { SourceReader } from "../sourceReader";
/** Inspect existing declarations only; never execute a producer or create personal facts. */
export class NativeDefinitionIndex {
  private checker: ts.TypeChecker;
  private program: ts.Program;
  constructor(readonly reader: SourceReader, readonly files: string[]) {
    this.program = ts.createProgram(files.filter(f => reader.exists(f)).map(f => reader.path(f)), { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, skipLibCheck: true, noEmit: true });
    this.checker = this.program.getTypeChecker();
  }
  find(id: string): { file: string; symbol: string; memberPath: string[]; kind: string }[] {
    const [name, ...members] = id.split(".");
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return [];
    const found: { file: string; symbol: string; memberPath: string[]; kind: string }[] = [];
    for (const file of this.files) {
      const source = this.program.getSourceFile(this.reader.path(file));
      if (!source || !this.reader.exportedSymbols(file).has(name)) continue;
      const moduleSymbol = this.checker.getSymbolAtLocation(source);
      const symbol = moduleSymbol && this.checker.getExportsOfModule(moduleSymbol).find(s => s.name === name);
      if (!symbol) continue;
      const declaration = symbol.declarations?.[0]; if (!declaration) continue;
      let type = ts.isTypeAliasDeclaration(declaration) || ts.isInterfaceDeclaration(declaration) ? this.checker.getDeclaredTypeOfSymbol(symbol) : this.checker.getTypeOfSymbolAtLocation(symbol, declaration);
      let valid = true;
      for (const member of members) {
        const property = this.checker.getPropertyOfType(this.checker.getNonNullableType(type), member);
        if (!property) { valid = false; break; }
        type = this.checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration ?? declaration);
      }
      if (valid) found.push({ file, symbol: name, memberPath: members, kind: ts.isFunctionDeclaration(declaration) ? "PRODUCER_DECLARATION_NOT_CALCULATED_RESULT" : "CALCULATION_OR_TYPE_DEFINITION_NOT_PERSONAL_FACT" });
    }
    return found;
  }
}
