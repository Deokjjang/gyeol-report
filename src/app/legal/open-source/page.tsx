import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import licenses from "../../../data/licenses/open-source.json";

/**
 * ZW-2 4부: 오픈소스 고지 — 결리포트가 쓰는 오픈소스 패키지와 라이선스 전문(MIT). 계산 라이브러리 이름은 이 고지 목록에만 나오고
 * 상품 · 본문 · 마케팅에는 쓰지 않는다. 원문은 node_modules 라이선스 파일과 같아야 한다(tests/unit/ziwei/zw2Screen.test.ts).
 */
export const metadata = { title: "오픈소스 고지 | 결리포트" };
type Pkg = { name: string; version: string; license: string; homepage?: string | null; text: string };

export default function OpenSourcePage() {
  const pkgs = (licenses as { packages: Pkg[] }).packages;
  return (
    <LegalPageLayout titleKo="오픈소스 고지" descriptionKo="결리포트가 쓰는 오픈소스 소프트웨어와 그 라이선스입니다." currentPath="/legal/open-source">
      <section aria-label="패키지 목록">
        <ul>{pkgs.map(p => <li key={p.name}><b>{p.name}</b> {p.version} · {p.license}{p.homepage ? <> · <span>{String(p.homepage).replace(/^git\+/, "").replace(/\.git$/, "")}</span></> : null}</li>)}</ul>
      </section>
      {pkgs.map(p => (
        <section key={p.name} aria-label={`${p.name} 라이선스`}>
          <h2>{p.name} {p.version}</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12, lineHeight: 1.6 }}>{p.text}</pre>
        </section>
      ))}
    </LegalPageLayout>
  );
}
