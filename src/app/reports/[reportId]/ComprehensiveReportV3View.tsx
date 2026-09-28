import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { ManseRyeokCommonTable, MbtiCommonProfileTable } from "../../../components/report-tables";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { getCanonicalNatalTable } from "../../../lib/report-knowledge/natalTableEvidence";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import type { ComprehensiveV3Block, ComprehensiveV3Draft } from "../../../lib/interpretation-v3/comprehensive";
import type { SajuCalcResult } from "../../../lib/saju/types";

function EvidenceLine({ labels }: { readonly labels: readonly string[] }) {
  return <p className="mt-3 text-xs tracking-wide text-[#846829]" data-evidence-line>{labels.join(" · ")}</p>;
}
function Reading({ block, opening = false }: { readonly block: ComprehensiveV3Block; readonly opening?: boolean }) {
  return <div className="space-y-3" data-v3-kind={block.kind}>
    {block.headline ? opening ? <p className="font-semibold text-[#6f1d35]">{block.headline}</p> : <h3 className="text-lg font-semibold text-[#6f1d35]">{block.headline}</h3> : null}
    {block.reading ? <p>{block.reading}</p> : null}
    {block.action ? <p className="font-medium">{block.action}</p> : null}
    {block.why ? block.why.split(/(?<=다\.)\s+(?=[가-힣]+(?:은|는))/u).map((p, i) => <p key={i} className="text-[#756658]">{p}</p>) : null}
    <EvidenceLine labels={block.labels} />
  </div>;
}
export function ComprehensiveReportV3View({ draft, evidencePacket }: { readonly draft: ComprehensiveV3Draft; readonly evidencePacket?: unknown }) {
  if (!validateProductPublication("saju_mbti_full", draft, evidencePacket).ok) return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  const natal = getCanonicalNatalTable(evidencePacket);
  const calculation = (evidencePacket as { comprehensiveV3: { calculation: SajuCalcResult } }).comprehensiveV3.calculation;
  const manse = buildCanonicalManseRyeokTableData(evidencePacket, draft.personLabel);
  const source = getMbtiSourceByType(draft.profileTable.mbti);
  const mbti = source ? buildMbtiCommonProfileTableData(source) : undefined;
  const items = [{ id: "v3-core", label: "핵심 결" }, ...draft.sections.map(s => ({ id: `v3-${s.id}`, label: s.title })),
    { id: "v3-patterns", label: "나를 망치기 쉬운 패턴" }, { id: "v3-direction", label: "앞으로 이렇게 살아가세요" }, { id: "v3-evidence", label: "전문 근거 펼쳐보기" }];
  return <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]" data-report-version={draft.version}>
    <ReportCover product="사주×MBTI 종합 리포트" title={draft.title} summary="이미 가진 좋은 힘을 알아보고, 일과 관계에서 쓰는 나만의 방향." />
    <ReportContents items={items} />
    <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
      <section id="v3-core" tabIndex={-1} data-reading-section className="space-y-7">
        <h2 className="text-2xl font-semibold">핵심 결</h2>
        {draft.opening.map(b => <Reading key={b.id} block={b} opening />)}
        <p className="border-l-2 border-[#6f1d35] pl-4 font-medium">{draft.openingContext}</p>
      </section>
      {draft.sections.map(section => <section id={`v3-${section.id}`} tabIndex={-1} key={section.id} data-reading-section className="space-y-8">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        {section.blocks.map(b => <Reading key={b.id} block={b} />)}
      </section>)}
      <section id="v3-patterns" tabIndex={-1} data-reading-section className="space-y-7">
        <h2 className="text-2xl font-semibold">나를 망치기 쉬운 패턴</h2>
        {draft.patterns.map(p => <div key={p.risk} className="space-y-2"><h3 className="text-lg font-semibold">{p.risk}</h3><p>{p.repair}</p><EvidenceLine labels={p.labels} /></div>)}
      </section>
      <section id="v3-direction" tabIndex={-1} data-reading-section className="space-y-4">
        <h2 className="text-2xl font-semibold">앞으로 이렇게 살아가세요</h2><p className="font-medium text-[#6f1d35]">{draft.direction}</p>
      </section>
    </div>
    <section id="v3-evidence" tabIndex={-1} className="space-y-4 border-t border-[#ded2c2] px-4 py-8 sm:px-6" aria-label="전문 근거">
      <h2 className="text-xl font-semibold">전문 근거 펼쳐보기</h2>
      {manse ? <ManseRyeokCommonTable data={manse} defaultOpen={false} /> : null}
      <details className="rounded border border-[#ded2c2] p-4">
        <summary className="cursor-pointer font-medium">오행 · 전체 원국 표식 · 합충형파해</summary>
        <p className="my-4 text-sm">겉글자 오행 분포: {draft.profileTable.fiveElementSummary.join(" · ")}</p>
        <p className="mb-4 text-sm text-[#756658]">이 개수는 원국 표시에 사용합니다. 생활 보완은 별도의 지장간 포함 가중 균형이 확인된 경우에만 선택합니다.</p>
        <p className="mb-4 text-sm">지장간 포함 가중 분포: {(["WOOD", "FIRE", "EARTH", "METAL", "WATER"] as const).map((e, i) => `${["목", "화", "토", "금", "수"][i]} ${calculation.elements.weighted[e]}`).join(" · ")}</p>
        <p className="mb-4 text-sm">십성 분포: {Object.entries(calculation.tenGods.distribution).map(([god, n]) => `${god} ${n}`).join(" · ")}</p>
        <dl className="space-y-4">
          {natal?.features.map(f => <div key={f.id} className="border-b border-[#eadfce] pb-3 text-sm"><dt className="font-semibold">{f.label}</dt><dd className="mt-1 leading-6 text-[#756658]">{f.basis}</dd></div>)}
          {natal?.relations.map(r => <div key={r.id} className="text-sm"><dt className="font-semibold">{r.label}</dt><dd>{r.participants.join(" · ")}</dd></div>)}
          {calculation.structureAnalysis.patterns.map(p => <div key={p.code} className="text-sm"><dt className="font-semibold">{p.labelKo}</dt><dd>{p.evidence.map(e => `${e.keyKo} ${e.valueKo}`).join(" · ")}</dd></div>)}
        </dl>
      </details>
      {mbti ? <MbtiCommonProfileTable data={mbti} defaultOpen={false} /> : <p className="text-sm text-[#756658]">MBTI 미입력 · 명리 근거만으로 구성했습니다.</p>}
    </section>
  </article>;
}
