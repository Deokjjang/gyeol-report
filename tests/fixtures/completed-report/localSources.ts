declare global {
  interface ImportMeta {
    glob(pattern: string, options: { eager: boolean; import: string }): Record<string, unknown>;
  }
}
// Browser QA only: the same checked-in MBTI JSON read by server renderers.
const sources = import.meta.glob("../../../docs/product/mbti/source/*.json", { eager: true, import: "default" });
export function join(...parts: string[]) { return parts.join("/"); }
export function readFileSync(path: string) {
  const filename = path.split("/").pop();
  const entry = Object.entries(sources).find(([key]) => key.endsWith(`/${filename}`));
  if (!entry) throw new Error("QA source not found");
  return JSON.stringify(entry[1]);
}
