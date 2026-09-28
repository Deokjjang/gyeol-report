import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import { ManseRyeokCommonTable, MbtiCommonProfileTable } from "../../../components/report-tables";
import { buildCanonicalManseRyeokTableData } from "../../../lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../lib/report-tables";
import { getCanonicalNatalTable } from "../../../lib/report-knowledge/natalTableEvidence";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import type { ComprehensiveV3Block, ComprehensiveV3Draft } from "../../../lib/interpretation-v3/comprehensive";
import type { SajuCalcResult } from "../../../lib/saju/types";
import type { Evidence } from "../../../lib/interpretation-v3/types";
import { featureRows } from "../../../lib/interpretation-v3/comprehensiveEditorial";
import { ENRICHED_COMPREHENSIVE_VERSION } from "../../../lib/interpretation-v3/comprehensiveComposition";
import { STORY_COMPREHENSIVE_VERSION, storyFeatureRows } from "../../../lib/interpretation-v3/comprehensiveStorytelling";
import type { ManseRyeokCommonTableData, MbtiCommonProfileTableData } from "../../../lib/report-tables/types";

function EvidenceLine({ labels }: { readonly labels: readonly string[] }) {
  return <p className="mt-3 text-xs tracking-wide text-[#846829]" data-evidence-line>{labels.join(" · ")}</p>;
}
function Reading({ block, opening = false }: { readonly block: ComprehensiveV3Block; readonly opening?: boolean }) {
  if (block.writingMode) return <div className={`space-y-4 ${block.writingMode === "criterion" ? "border-l-2 border-[#cbb589] pl-4" : ""}`} data-writing-mode={block.writingMode} data-discovery={block.discoveryKey} data-prominence={block.prominence}>
    {block.headline ? <h3 className={block.writingMode === "question" ? "font-serif text-xl leading-relaxed text-[#6f1d35]" : "text-lg font-semibold text-[#6f1d35]"}>{block.headline}</h3> : null}
    {block.paragraphs?.map((p, i) => <p key={i} className={block.writingMode === "image" && i === 0 ? "font-serif text-[#665035]" : ""}>{p}</p>)}
    {block.action ? <p className={block.writingMode === "closing" || block.writingMode === "criterion" ? "font-medium" : ""}>{block.action}</p> : null}
    {block.ideas ? <ul className="list-disc space-y-3 pl-5 marker:text-[#846829]">{block.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul> : null}
    <EvidenceLine labels={block.labels} />
  </div>;
  if (block.paragraphs) return <div className={block.kind === "context" ? "space-y-3 border-l-2 border-[#cbb589] pl-4" : "space-y-4"} data-v3-kind={block.kind} data-v3-format={block.format}>
    {block.headline ? <h3 className="text-lg font-semibold text-[#6f1d35]">{block.headline}</h3> : null}
    {block.paragraphs.map((p, i) => <p key={i} className={block.format === "gift" && i === 0 ? "font-medium text-[#846829]" : ""}>{p}</p>)}
    {block.action ? <p className={block.format === "strategy" ? "font-medium" : ""}>{block.action}</p> : null}
    {block.ideas ? <ul className="list-disc space-y-3 pl-5 marker:text-[#846829]">{block.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul> : null}
    <EvidenceLine labels={block.labels} />
  </div>;
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
  if (draft.version === ENRICHED_COMPREHENSIVE_VERSION || draft.version === STORY_COMPREHENSIVE_VERSION) {
    const story = draft.version === STORY_COMPREHENSIVE_VERSION;
    const facts = (evidencePacket as { comprehensiveV3: { facts: readonly Evidence[] } }).comprehensiveV3.facts;
    const rows = featureRows(facts);
    const elements = [
      ["WOOD", "목", "나무", "bg-emerald-50 border-emerald-200 text-emerald-950"],
      ["FIRE", "화", "불", "bg-rose-50 border-rose-200 text-rose-950"],
      ["EARTH", "토", "흙", "bg-amber-50 border-amber-200 text-amber-950"],
      ["METAL", "금", "쇠", "bg-stone-100 border-stone-200 text-stone-900"],
      ["WATER", "수", "물", "bg-sky-50 border-sky-200 text-sky-950"],
    ] as const;
    return <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b]" data-report-version={draft.version}>
      <ReportCover product="사주×MBTI 종합 리포트" title={draft.title} summary="나를 관통하는 성격과 이미 가진 좋은 패, 앞으로의 선택을 읽습니다." />
      {story ? <><ReportContents items={items.filter(i => i.id !== "v3-evidence")} /><StoryTables facts={facts} calculation={calculation} manse={manse} mbti={mbti} /></> : <>
      <section aria-label="계산된 원국과 성향" className="space-y-5 border-b border-[#eadfce] px-4 py-6 sm:px-6">
        {manse ? <ManseRyeokCommonTable data={{ ...manse, natalEvidence: undefined }} defaultOpen={false} /> : null}
        <section aria-label="오행 분포" data-v31-elements className="space-y-3">
          <h2 className="text-lg font-semibold">오행 분포</h2>
          <div className="grid min-w-0 grid-cols-5 gap-1.5 sm:gap-3">
            {elements.map(([id, name, meaning, colors]) => <div key={id} className={`min-w-0 rounded-lg border px-1 py-3 text-center ${colors}`}>
              <p className="text-sm font-bold">{name}</p><p className="mt-1 text-2xl font-semibold">{calculation.elements.visible[id]}</p>
              <p className="mt-1 text-xs">{meaning}</p>
            </div>)}
          </div>
          <p className="text-xs leading-6 text-[#756658]">위 숫자는 천간·지지 겉글자의 개수입니다. 생활 보완은 지장간을 포함한 아래 가중 분포와 기존 계산의 강약 판정을 사용합니다.</p>
          <p className="text-sm text-[#5d544d]">지장간 포함: {elements.map(([id, name]) => `${name} ${Number(calculation.elements.weighted[id].toFixed(1))}`).join(" · ")}</p>
        </section>
        {mbti ? <MbtiCommonProfileTable data={mbti} defaultOpen={false} variant="compact" /> : <p className="text-sm text-[#756658]">MBTI 미입력 · 명리 근거만으로 구성했습니다.</p>}
        <details id="v3-evidence" className="min-w-0 rounded-lg border border-[#ded2c2]" data-v31-integrated>
          <summary className="min-h-11 cursor-pointer px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d38]">내 명리에 있는 주요 기운</summary>
          <div className="space-y-4 px-3 pb-4 sm:px-4">
            <table className="w-full table-fixed border-collapse text-left text-xs leading-6 sm:text-sm [overflow-wrap:anywhere]">
              <caption className="pb-3 text-left text-xs text-[#756658]">실제 원국에서 확인된 기운입니다. 같은 기운의 여러 계산 위치는 한 행으로 모았습니다.</caption>
              <thead><tr className="border-y border-[#ded2c2] text-[#6f1d35]"><th scope="col" className="w-[22%] py-2 pr-2">기운</th><th scope="col" className="w-[39%] py-2 pr-2">쉽게 말하면</th><th scope="col" className="py-2">나에게 쓰이는 힘</th></tr></thead>
              <tbody>{rows.map(row => <tr key={row.featureId} className="border-b border-[#eadfce] align-top"><th scope="row" className="py-3 pr-2 font-semibold">{row.label}</th><td className="py-3 pr-2">{row.meaning}</td><td className="py-3">{row.power}</td></tr>)}</tbody>
            </table>
            <details className="border-t border-[#ded2c2] pt-2" data-v31-calculation-basis>
              <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d38]">계산 기준 자세히 보기</summary>
              <p className="mb-4 text-xs leading-6 text-[#756658]">입력한 정확한 출생시각의 원국입니다. 기둥 위치와 연지·일지 기준을 구분하며 대운·세운 표식은 섞지 않습니다.</p>
              <p className="mb-4 text-sm">십성 분포: {Object.entries(calculation.tenGods.distribution).map(([god, n]) => `${god} ${Number(n.toFixed(1))}`).join(" · ")}</p>
              <dl className="space-y-4 text-sm leading-6 [overflow-wrap:anywhere]">
                {natal?.features.map(f => <div key={f.id}><dt className="font-semibold">{f.label}</dt><dd className="text-[#756658]">{f.basis}{f.positions.length ? ` · ${f.positions.map(p => ({ year: "연주", month: "월주", day: "일주", hour: "시주" })[p]).join("·")}` : " · 원국 전체 근거"}</dd></div>)}
                {natal?.relations.map(r => <div key={r.id}><dt className="font-semibold">{r.label}</dt><dd>{r.participants.join(" · ")}</dd></div>)}
                {calculation.structureAnalysis.patterns.map(p => <div key={p.code}><dt className="font-semibold">{p.labelKo}</dt><dd>{p.evidence.map(e => `${e.keyKo} ${e.valueKo}`).join(" · ")}</dd></div>)}
              </dl>
            </details>
          </div>
        </details>
      </section>
      <ReportContents items={items.filter(i => i.id !== "v3-evidence")} />
      </>}
      <div className="mx-auto max-w-[44rem] break-keep px-4 [overflow-wrap:anywhere] sm:px-6">
        <section id="v3-core" tabIndex={-1} data-reading-section className="space-y-6">
          <h2 className="text-2xl font-semibold">핵심 결</h2>
          {draft.opening.flatMap(b => b.paragraphs ?? []).map((p, i) => <p key={i} className={i === 0 ? "text-lg font-medium text-[#6f1d35]" : ""}>{p}</p>)}
          <EvidenceLine labels={[...new Set(draft.opening.flatMap(b => b.labels))]} />
        </section>
        {draft.sections.map(section => <section id={`v3-${section.id}`} tabIndex={-1} key={section.id} data-reading-section className="space-y-8">
          <h2 className="text-2xl font-semibold">{section.title}</h2>
          <div className="divide-y divide-[#eadfce]">{section.blocks.map(b => <div key={b.id} className="py-6 first:pt-0 last:pb-0"><Reading block={b} /></div>)}</div>
        </section>)}
        <section id="v3-patterns" tabIndex={-1} data-reading-section className="space-y-7">
          <h2 className="text-2xl font-semibold">나를 망치기 쉬운 패턴</h2>
          {draft.patterns.map(p => <div key={p.risk} className="space-y-3 border-l-2 border-[#cbb589] pl-4"><p className="text-sm text-[#846829]">잘 쓰면 · {p.strength}</p><h3 className="text-lg font-semibold">{p.risk}</h3><p>{p.why}</p><p className="font-medium">{p.repair}</p><EvidenceLine labels={p.labels} /></div>)}
        </section>
        <section id="v3-direction" tabIndex={-1} data-reading-section className="space-y-6">
          <h2 className="text-2xl font-semibold">앞으로 이렇게 살아가세요</h2>
          {draft.direction.split("\n\n").map((p, i) => <p key={i} className={i === 0 ? "font-medium text-[#6f1d35]" : ""}>{p}</p>)}
        </section>
      </div>
    </article>;
  }
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

function StoryTables({ facts, calculation, manse, mbti }: { readonly facts: readonly Evidence[]; readonly calculation: SajuCalcResult; readonly manse?: ManseRyeokCommonTableData | null; readonly mbti?: MbtiCommonProfileTableData | null }) {
  const colors = ["bg-emerald-50 border-emerald-200", "bg-rose-50 border-rose-200", "bg-amber-50 border-amber-200", "bg-stone-100 border-stone-200", "bg-sky-50 border-sky-200"];
  const elements = [["WOOD", "목"], ["FIRE", "화"], ["EARTH", "토"], ["METAL", "금"], ["WATER", "수"]] as const;
  const rows = storyFeatureRows(facts, calculation);
  return <section aria-label="계산된 원국과 성향" className="space-y-5 border-b border-[#eadfce] px-4 py-6 sm:px-6" data-story-tables>
    {manse ? <ManseRyeokCommonTable data={{ ...manse, natalEvidence: undefined }} defaultOpen={false} elementDistribution={<section aria-label="오행 분포" className="space-y-3 px-3 py-4" data-story-elements>
      <h3 className="text-sm font-semibold">오행 분포</h3>
      <p className="text-xs text-[#756658]">원국 8글자</p>
      <div className="grid grid-cols-5 gap-1.5">{elements.map(([id, label], i) => <div key={id} className={`min-w-0 rounded-lg border px-1 py-2 text-center ${colors[i]}`}><p className="text-xs">{label}</p><p className="text-xl font-bold">{calculation.elements.visible[id]}</p></div>)}</div>
      <p className="text-xs text-[#756658]">지장간 포함 가중</p>
      <div className="grid grid-cols-5 gap-1.5">{elements.map(([id, label], i) => <div key={id} className={`min-w-0 rounded-lg border px-1 py-2 text-center ${colors[i]}`}><p className="text-xs">{label}</p><p className="text-lg font-semibold">{Number(calculation.elements.weighted[id].toFixed(1))}</p></div>)}</div>
      <p className="text-xs leading-6 text-[#756658]">위는 원국 8글자, 아래는 지장간을 포함한 해석용 가중 분포입니다.</p>
    </section>} /> : null}
    <details className="min-w-0 rounded-lg border border-[#ded2c2]" data-story-signals>
      <summary className="min-h-11 cursor-pointer px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-[#7f1d38]">내 명리에 있는 주요 기운</summary>
      <div className="px-3 pb-4 sm:px-4">
        <table className="w-full table-fixed border-collapse text-left text-xs leading-6 sm:text-sm [overflow-wrap:anywhere]">
          <caption className="pb-3 text-left text-xs text-[#756658]">확인된 기운을 모았습니다. 위치와 계산 출처는 각 행에서 펼쳐볼 수 있어요.</caption>
          <thead><tr className="border-y border-[#ded2c2] text-[#6f1d35]"><th scope="col" className="w-[24%] py-2 pr-2">기운</th><th scope="col" className="w-[36%] py-2 pr-2">쉽게 말하면</th><th scope="col" className="py-2">나에게 쓰이는 힘</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.featureId} className="border-b border-[#eadfce] align-top" data-feature-id={row.featureId}>
            <th scope="row" className="py-3 pr-2 font-semibold">{row.label}<details className="mt-1 text-xs font-normal" data-signal-detail><summary className="min-h-11 cursor-pointer py-2 text-[#846829] focus-visible:outline-2 focus-visible:outline-[#7f1d38]">위치·출처</summary><div className="space-y-3 text-[#756658]">{row.details.map((d, i) => <div key={i}><p>{d.basis.replace("원국 전체의 파생 근거", "원국 조합 기준")}</p>{d.positions.length ? <p>{d.positions.map(p => ({ year: "연주", month: "월주", day: "일주", hour: "시주" })[p as "year"]).join(" · ")}</p> : null}{d.weight !== undefined ? <p>가중 {Number(d.weight.toFixed(1))} · 천간 {d.surface}곳 · 지장간 본기 {d.hiddenMain}곳</p> : null}<p className="font-mono text-[10px] leading-5 [overflow-wrap:anywhere]">{d.sourceRefs.join(" · ")}</p></div>)}</div></details></th>
            <td className="py-3 pr-2">{row.meaning}</td><td className="py-3">{row.power}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
    {mbti ? <MbtiCommonProfileTable data={mbti} defaultOpen={false} variant="compact" /> : <p className="text-sm text-[#756658]">MBTI 미입력 · 명리 근거만으로 구성했습니다.</p>}
  </section>;
}
