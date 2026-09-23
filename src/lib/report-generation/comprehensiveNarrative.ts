import { comprehensiveFeaturePerspectives } from "./comprehensiveFeaturePerspectives";
import type { ComprehensiveReportEvidencePacket, ComprehensiveSajuFeatureDictionaryEntry as Feature } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import { getMbtiSourceProfile, type MbtiTraitArea, type MbtiSourceTraitItem } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { SAJU_KNOWLEDGE_BY_ID } from "../report-knowledge/sajuKnowledgeBase";
import type { SajuMbtiBridgeEvidence } from "../report-knowledge/sajuMbtiBridgeScorer";
import type { ComprehensiveReportV2ChapterId as ChapterId, ComprehensiveReportV2LongformReadingId as ReadingId, ComprehensiveReportV2ProfileTable } from "./comprehensiveReportDraftTypes";
export type ComprehensiveNarrativeTheme = {
    readonly title: string;
    readonly reading: string;
    readonly sajuEvidenceIds: readonly string[];
    readonly mbtiEvidenceIds: readonly string[];
    readonly interactionId?: string;
};
export type ComprehensiveNarrativeSection = {
    readonly readingId: ReadingId;
    readonly question: string;
    readonly featureIds: readonly string[];
    readonly mbtiTraitIds: readonly string[];
    readonly interactionIds: readonly string[];
};
export type ComprehensiveNarrativePlan = {
    readonly version: "comprehensive_narrative_v2";
    readonly themes: readonly ComprehensiveNarrativeTheme[];
    readonly sections: readonly ComprehensiveNarrativeSection[];
};
export const chapterReadingId: Record<ChapterId, ReadingId> = {
    opening: "opening", saju_identity: "baseSajuReading", personality_pattern: "sajuMbtiBridgeReading",
    work_money_study: "workMoneyStudyReading", love_relationships: "loveRelationshipReading",
    people_family_environment: "peopleFamilyEnvironmentReading", risk_and_growth: "riskGrowthReading", final_message: "finalMessage",
};
export const narrativeTitles: Record<ReadingId, string> = {
    opening: "나를 관통하는 핵심 결", baseSajuReading: "이 해석이 시작되는 원국",
    sajuFeatureReading: "강점의 다른 얼굴", mbtiReading: "생각과 표현 사이의 거리",
    sajuMbtiBridgeReading: "두 근거가 만나는 생활 장면", workMoneyStudyReading: "일하는 힘, 돈을 다루는 기준, 배우는 방식",
    loveRelationshipReading: "가까워질 때 드러나는 나", peopleFamilyEnvironmentReading: "가족과 사람 사이에서 맡게 되는 자리",
    riskGrowthReading: "강점이 피로로 바뀌기 전에", finalMessage: "내 선택에 남길 기준",
};
const questions: Record<ReadingId, string> = {
    opening: "서로 다른 장면의 나를 함께 설명하는 것은 무엇일까요?",
    baseSajuReading: "일간과 일주, 겉으로 드러나는 오행과 지장간을 구분해 읽습니다. MBTI의 성격명으로 원국의 글자를 대신 설명하지 않습니다.",
    sajuFeatureReading: "같은 표식이 도움이 될 때와 부담이 될 때는 어떻게 다를까요?",
    mbtiReading: "혼자 생각할 때와 대화로 전달할 때, 무엇이 달라질까요?",
    sajuMbtiBridgeReading: "명리의 구조가 자기보고 성향을 만나면 어떤 장면으로 나타날까요?",
    workMoneyStudyReading: "업무의 성과, 돈의 관리, 공부의 몰입은 서로 다른 질문입니다. 원국의 신호와 입력한 MBTI에서 각 질문에 맞는 단서를 골랐습니다.",
    loveRelationshipReading: "호감이 생기는 순간과 신뢰를 쌓는 과정은 구분해서 살펴봅니다.",
    peopleFamilyEnvironmentReading: "가족의 부탁과 팀의 역할 속에서, 내 몫을 어떻게 정할까요?",
    riskGrowthReading: "잘하던 일이 부담으로 변하는 순간에 무엇을 조절할까요?",
    finalMessage: "오늘부터는 가장 반복되는 장면 하나에 먼저 작은 실행을 정하세요.",
};
const areas: Record<ReadingId, readonly MbtiTraitArea[]> = {
    opening: [], baseSajuReading: [], sajuFeatureReading: ["strengths"],
    mbtiReading: ["thinkingStyle", "communication"], sajuMbtiBridgeReading: [],
    workMoneyStudyReading: ["career", "money", "study"], loveRelationshipReading: ["love", "marriage"],
    peopleFamilyEnvironmentReading: ["relationships", "parenting"], riskGrowthReading: ["risks"], finalMessage: ["growth"],
};
const topics: Partial<Record<ReadingId, readonly string[]>> = {
    sajuFeatureReading: ["identity", "environment"], mbtiReading: ["personality"], sajuMbtiBridgeReading: ["personality", "identity"],
    workMoneyStudyReading: ["work", "money", "study"], loveRelationshipReading: ["love", "relationship"],
    peopleFamilyEnvironmentReading: ["family", "environment"], riskGrowthReading: ["growth"], finalMessage: ["growth"],
};
const interactionLabel = { agreement: "같은 방향으로 모이는 힘", tension: "서로 다른 요구 사이의 긴장", expression: "속마음이 밖으로 표현되는 방식", compensation: "막힌 흐름을 여는 보완점", amplification: "강점이 커지는 만큼 커지는 부담", "context-switch": "장소에 따라 달라지는 나" };
export function correctSourceParticles(text: string): string {
    // Repair the fixed particle slots in inherited day-pillar copy, without changing its claims.
    return text.replace(/([가-힣]+)(이 과해지면|이 업무나|을 결과물로|을 루틴으로)/gu, (_, word: string, tail: string) => {
        const hasFinal = (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0;
        const particle = tail.startsWith("이") ? (hasFinal ? "이" : "가") : (hasFinal ? "을" : "를");
        return word + particle + tail.slice(1);
    });
}
const clean = (text: string) => correctSourceParticles(text).replace(/강점을 오래 쓰려면 쉬는 장치와 표현 조절이 필요합니다\.?/gu, "").replace(/무조건/gu, "조건을 살피지 않고").replace(/진단/gu, "점검").replace(/(?<!전)문서/gu, "업무 기록").replace(/보장/gu, "확보").replace(/물리치료/gu, "재활 지원").replace(/치료 보조/gu, "돌봄 지원").replace(/스포트라이트/gu, "무대의 관심");
const join = (values: readonly (string | undefined)[], separator = " ") => [...new Set(values.filter((v): v is string => !!v?.trim()).map(v => clean(v.trim()).replace(/ {2,}/g, " ").trim()))].join(separator);
const sceneId = (s: SajuMbtiBridgeEvidence) => s.interaction?.interactionId ?? `${s.traitId}:${s.bridgeNeed}`;
const traitId = (type: string, area: string, t: MbtiSourceTraitItem) => `mbti:${type}:traits:${area}:${t.id}`;
/** Selection only: all interpretations come from matched facts/source traits. No synthetic Bridge match. */
export function buildComprehensiveNarrativePlan(packet: ComprehensiveReportEvidencePacket): ComprehensiveNarrativePlan {
    const dictionary = packet.sajuFeatureDictionary ?? [];
    const features = [...new Map((packet.selectedSajuFeatureEvidence ?? []).flatMap(c => c.features).map(f => [f.id, f])).values()];
    const scenes = [...new Map((packet.sajuMbtiBridgeEvidence ?? []).filter(s => s.interaction).map(s => [sceneId(s), s])).values()];
    // Prefer distinct contexts before a second interpretation of the same scene.
    const selected: SajuMbtiBridgeEvidence[] = [];
    for (const s of scenes)
        if (!selected.some(v => v.chapterId === s.chapterId))
            selected.push(s);
    for (const s of scenes)
        if (!selected.includes(s))
            selected.push(s);
    const themes: ComprehensiveNarrativeTheme[] = selected.slice(0, 4).map(s => ({
        title: `${dictionary.filter(f => s.interaction!.myeongliEvidenceIds.includes(f.sourceFeatureId ?? "")).map(f => f.rawLabel).join("·") || dictionary.find(f => s.relatedSajuFeatureIds.includes(f.sourceFeatureId ?? ""))?.rawLabel || "원국의 구조"} — ${interactionLabel[s.interaction!.interactionType]}`, reading: join([s.sentenceSeed, ...dictionary.filter(f => s.interaction!.myeongliEvidenceIds.includes(f.sourceFeatureId ?? "")).slice(0, 1).map(f => `여기서 말하는 「${f.rawLabel}」: ${f.plainMeaning}`)]),
        sajuEvidenceIds: s.interaction!.myeongliEvidenceIds, mbtiEvidenceIds: s.interaction!.mbtiEvidenceIds, interactionId: sceneId(s),
    }));
    // One proven interaction can have two facets; do not invent a second relationship to fill a quota.
    if (themes.length === 1 && selected[0].fatiguePoint)
        themes.push({ ...themes[0], title: "이 힘을 오래 쓰기 위한 경계", reading: selected[0].fatiguePoint! });
    if (themes.length < 2) {
        for (const f of features.filter(f => f.category !== "twelve_sinsal").slice(0, 3)) {
            if (themes.length >= 3)
                break;
            themes.push({ title: f.labelKo, reading: join([f.summary, f.symbolicImage]), sajuEvidenceIds: [f.id], mbtiEvidenceIds: [] });
        }
    }
    const source = getMbtiSourceProfile(packet.mbtiType);
    const usedFeatures = new Set<string>();
    const usedTraits = new Set<string>();
    const sections: ComprehensiveNarrativeSection[] = [];
    // Domain-specific sections select first, so a general introduction cannot consume their useful evidence.
    const order: ReadingId[] = ["baseSajuReading", "riskGrowthReading", "sajuMbtiBridgeReading", "sajuFeatureReading", "workMoneyStudyReading", "loveRelationshipReading", "peopleFamilyEnvironmentReading", "mbtiReading", "finalMessage", "opening"];
    for (const readingId of order) {
        let candidates = dictionary.filter(f => !usedFeatures.has(f.id) && f.category !== "hidden_stem");
        if (readingId === "baseSajuReading")
            candidates = candidates.filter(f => f.category === "day_pillar" || f.category === "structure" || f.category === "ten_god");
        else if (readingId === "sajuFeatureReading")
            candidates = candidates.filter(f => f.category === "sinsal" || f.category === "gwiin" || f.category === "twelve_sinsal");
        else
            candidates = candidates.filter(f => features.some(s => s.id === f.sourceFeatureId && s.topics.some(t => topics[readingId]?.includes(t))));
        if (candidates.length < 2 && !["opening", "finalMessage"].includes(readingId)) {
            const relevant = dictionary.filter(f => !candidates.includes(f) && f.category !== "hidden_stem" && features.some(s => s.id === f.sourceFeatureId && s.topics.some(t => topics[readingId]?.includes(t))));
            candidates = [...candidates, ...relevant];
        }
        const chosen = candidates.slice(0, readingId === "workMoneyStudyReading" || readingId === "sajuFeatureReading" ? 3 : 2);
        chosen.forEach(f => usedFeatures.add(f.id));
        const mbtiTraitIds: string[] = [];
        for (const area of areas[readingId]) {
            const selectedTraits = (source?.traits?.[area] ?? []).filter(t => t.id && !usedTraits.has(traitId(source!.type, area, t))).slice(0, 2);
            for (const t of selectedTraits) {
                const id = traitId(source!.type, area, t);
                usedTraits.add(id);
                mbtiTraitIds.push(id);
            }
        }
        sections.push({ readingId, question: questions[readingId], featureIds: chosen.map(f => f.id), mbtiTraitIds,
            interactionIds: scenes.filter(s => chapterReadingId[s.chapterId] === readingId).map(sceneId) });
    }
    return { version: "comprehensive_narrative_v2", themes, sections };
}
function bridgeTraitReadings(packet: ComprehensiveReportEvidencePacket, scene: SajuMbtiBridgeEvidence): readonly string[] {
    const source = getMbtiSourceProfile(packet.mbtiType);
    const references = new Set(scene.interaction?.mbtiEvidenceIds ?? []);
    return (Object.entries(source?.traits ?? {}) as [
        MbtiTraitArea,
        readonly MbtiSourceTraitItem[]
    ][]).flatMap(([area, traits]) => traits
        .filter(t => references.has(traitId(source!.type, area, t)))
        .map(t => `MBTI의 연결 근거는 ‘${t.label}’입니다.`));
}
function selectedTraits(packet: ComprehensiveReportEvidencePacket, section: ComprehensiveNarrativeSection) {
    const source = getMbtiSourceProfile(packet.mbtiType);
    return (Object.entries(source?.traits ?? {}) as [
        MbtiTraitArea,
        readonly MbtiSourceTraitItem[]
    ][]).flatMap(([area, traits]) => traits.filter(t => section.mbtiTraitIds.includes(traitId(source!.type, area, t))).map(trait => ({ area, trait })));
}
function paragraph(f: Feature): string {
    return join([`「${f.rawLabel}」 — ${f.plainMeaning.replace(/구조$/u, "구조입니다.")}`, f.rawLabel.includes("양인") ? "양인살은 자기 힘을 밀어붙이는 추진력과 승부 감각을 함께 읽는 표식입니다." : undefined, f.strength, f.howItShowsInYou === "십성의 성향이 일과 관계에서 드러나는 장면" ? undefined : `생활에서 떠올려 볼 장면은 ‘${f.howItShowsInYou}’입니다.`, f.fatiguePoint, f.practicalUse, comprehensiveFeaturePerspectives[f.sourceFeatureId ?? ""]]);
}
export function comprehensiveNarrativeSection(packet: ComprehensiveReportEvidencePacket, readingId: ReadingId) {
    const plan = packet.narrativePlan ?? buildComprehensiveNarrativePlan(packet);
    return plan.sections.find(s => s.readingId === readingId)!;
}
export function comprehensiveSectionFeatures(packet: ComprehensiveReportEvidencePacket, readingId: ReadingId) {
    const section = comprehensiveNarrativeSection(packet, readingId);
    return (packet.sajuFeatureDictionary ?? []).filter(f => section.featureIds.includes(f.id));
}
export function buildComprehensiveNarrativeBody(packet: ComprehensiveReportEvidencePacket, profile: ComprehensiveReportV2ProfileTable, readingId: ReadingId): string {
    const plan = packet.narrativePlan ?? buildComprehensiveNarrativePlan(packet);
    const section = comprehensiveNarrativeSection(packet, readingId);
    const features = comprehensiveSectionFeatures(packet, readingId);
    const scenes = (packet.sajuMbtiBridgeEvidence ?? []).filter(s => section.interactionIds.includes(sceneId(s)));
    const coreIds = new Set(plan.themes.map(t => t.interactionId));
    const themeReadings = new Set(plan.themes.map(t => t.reading));
    const paragraphs: string[] = [];
    if (readingId === "opening") {
        paragraphs.push(...plan.themes.map(t => `${t.title}\n${t.reading}`));
        paragraphs.push(`위의 결은 다음 명리 근거에서 골랐습니다: ${(packet.sajuFeatureDictionary ?? []).filter(f => plan.themes.some(t => t.sajuEvidenceIds.includes(f.sourceFeatureId ?? ""))).map(f => f.rawLabel).join("·") || profile.dayPillar}입니다. 성향 전체를 한 가지 표식으로 확정하지 않고, 강점이 살아난 상황과 부담이 커진 상황을 함께 읽는 기준으로 삼습니다.`);
        const main = (packet.sajuFeatureDictionary ?? []).filter(f => f.category === "day_pillar")[0];
        paragraphs.push(join([`이 해석의 출발점은 ${profile.dayPillar}, 일간 ${profile.dayMaster}입니다.`, main?.plainMeaning.replace(/구조$/u, "구조입니다."),
            packet.mbtiType ? `입력한 ${packet.mbtiType}는 이 원국의 원인이 아니라 행동을 비교할 별도의 자기보고 자료입니다. 위의 연결은 구조가 맞물리는 부분만 골랐으며, 실제 경험과 다른 부분까지 자신에게 끼워 맞출 필요는 없습니다.` : "MBTI 미입력으로 유형이나 인지 기능은 추정하지 않았습니다. 위의 결은 명리 근거만으로 고른 관찰 주제이며, 사주와 MBTI의 일치로 읽지 않습니다."]));
    }
    else {
        paragraphs.push(!packet.mbtiType && readingId === "workMoneyStudyReading"
            ? "업무의 성과, 돈의 관리, 공부의 몰입은 서로 다른 질문입니다. MBTI 미입력으로 원국에서 각 질문에 맞는 단서를 골랐습니다."
            : !packet.mbtiType && readingId === "sajuMbtiBridgeReading"
                ? "명리의 신호를 실제 경험과 비교할 때 어떤 장면을 살펴볼까요?"
                : section.question);
        if (readingId === "baseSajuReading") {
            paragraphs.push(`일간 「${profile.dayMaster}」는 다른 글자와의 관계를 읽는 기준이고, 일주 ${profile.dayPillar}는 그 기준과 아래 지지를 함께 보는 단위입니다. 원국의 구성은 ${profile.fiveElementSummary.join(" · ")}입니다. 이 수는 보이는 천간과 지지의 분포입니다. 지장간까지 더한 점수나 삶의 성과 등급은 아닙니다.`);
            const missing = profile.fiveElementSummary.filter(value => / 0$/.test(value)).map(value => value.split(" ")[0]);
            if (missing.length)
                paragraphs.push(`${missing.join("·")} 항목이 0으로 집계됩니다. 보이는 글자에 없다는 뜻이며, 그 오행이 뜻하는 능력이 없다는 판정은 아닙니다.`);
            paragraphs.push(...(profile.fourPillarGrid ?? []).filter(p => p.pillar).map(p => `${p.labelKo} ${p.pillar}의 지장간은 ${(p.hiddenStems ?? []).join("·")}, 십성은 ${(p.tenGod ?? []).join("·")}, 십이운성은 ${(p.twelveLifeStage ?? []).join("·")}입니다.`));
            paragraphs.push("지장간은 지지 안에 포함된 천간을 뜻합니다. 겉의 글자와 속의 구성을 구분하기 위한 보조 근거이지, 숨겨진 성격을 확정하는 증거는 아닙니다. 십이운성 역시 일간과 각 지지의 관계를 설명하는 단계입니다. 단계의 이름만으로 실제 나이나 인생의 성공과 실패를 읽지는 않습니다.");
        }
        const unspokenFeatures = new Set(features);
        for (const s of scenes) {
            paragraphs.push(join([coreIds.has(sceneId(s)) ? undefined : s.sentenceSeed, s.sceneSeed, s.strength,
                themeReadings.has(s.fatiguePoint ?? "") ? undefined : s.fatiguePoint]));
        }
        const traitPairs = selectedTraits(packet, section);
        for (const { area, trait: t } of traitPairs) {
            const topicByArea: Partial<Record<MbtiTraitArea, string>> = { thinkingStyle: "personality", communication: "relationship", career: "work", money: "money", study: "study", love: "love", marriage: "family", relationships: "relationship", parenting: "family", risks: "growth", growth: "growth", strengths: "identity" };
            const matching = [...unspokenFeatures].find(f => packet.selectedSajuFeatureEvidence?.some(c => c.features.some(v => v.id === f.sourceFeatureId && v.topics.some(topic => topic === topicByArea[area]))));
            if (matching) {
                paragraphs.push(paragraph(matching));
                unspokenFeatures.delete(matching);
            }
            const labels: Partial<Record<MbtiTraitArea, string>> = { thinkingStyle: "생각을 정리하는 방식", communication: "상대에게 전달하는 방식", career: "업무에서 힘이 나는 조건", money: "돈을 쓰고 남기는 기준", study: "공부가 이어지는 조건", love: "가까워지는 방식", marriage: "생활을 함께할 때", relationships: "사람 사이의 거리", parenting: "돌봄과 기대의 경계", risks: "피로가 쌓일 때", growth: "다음 선택을 바꾸는 방법", strengths: "강점을 쓰는 자리" };
            paragraphs.push(join([`${labels[area] ?? t.label}${area === "growth" ? ` · MBTI ${packet.mbtiType}` : ""} — ${t.plainKo}`, t.positiveUse, t.risk]));
        }
        paragraphs.push(...[...unspokenFeatures].map(paragraph));
        if (readingId === "workMoneyStudyReading")
            paragraphs.push("직무 학습이나 자격증 공부에서는 위의 몰입 조건을 과제 하나에 적용해 보세요. 여기서 다루는 것은 일을 선택하는 성향과 돈 관리의 기준입니다. 실제 수익, 투자 적합성, 합격 시기를 예측하는 근거로 넓혀 읽지는 않습니다.");
        if (readingId === "mbtiReading") {
            const source = getMbtiSourceProfile(packet.mbtiType);
            if (source)
                paragraphs.push(`원국의 신호와 위의 ${source.type} 성향은 서로를 증명하는 관계가 아닙니다. 표의 인지 기능 ${(Object.values(source.functionStack ?? {})).join("·")}도 같은 이유로 능력의 순위로 읽지 않습니다. 실제로 말을 꺼내기 전 확인하는 정보와, 상대에게 설명할 때 생략하는 정보를 나누면 생각과 전달의 차이를 볼 수 있습니다.`);
            else
                paragraphs.push("MBTI를 입력하지 않았으므로 외향·내향이나 사고·감정 선호를 채워 넣지 않습니다. 명리의 판단·표현 신호와 실제 대화 경험을 비교할 수는 있지만, 그 결과를 특정 유형의 기능으로 바꿔 말하지 않습니다. 다음에 읽을 장면도 정해진 성격 판정이 아니라 자기 경험으로 확인할 질문입니다.");
        }
        if (readingId === "riskGrowthReading")
            paragraphs.push("위의 피로 신호가 나타난 하루를 골라 업무가 늘어난 때, 상대와 대화한 때, 일정을 마친 뒤를 나누어 살펴보세요. 스스로의 성격을 고치겠다는 큰 목표보다 어떤 조건에서 부담이 커졌는지를 알면 조절할 지점이 보입니다.");
        if (readingId === "sajuMbtiBridgeReading") {
            paragraphs.push("위에서 고른 연결은 업무의 판단, 상대와의 대화처럼 확인할 수 있는 상황에 놓고 읽습니다. 같은 근거라도 도움이 된 순간과 부담이 된 순간을 나누면 자기 성향을 하나의 장점이나 단점으로 고정하지 않고 사용할 수 있습니다.");
            paragraphs.push(...plan.themes.filter(t => t.interactionId).map(t => {
                const s = (packet.sajuMbtiBridgeEvidence ?? []).find(s => sceneId(s) === t.interactionId)!;
                const basis = packet.mbtiBasis?.selectedTraitSeeds.find(v => v.id === s.traitId || s.interaction?.mbtiEvidenceIds.includes(v.sourceEvidenceId ?? ""));
                const labels = (packet.sajuFeatureDictionary ?? []).filter(f => s.relatedSajuFeatureIds.includes(f.sourceFeatureId ?? "")).map(f => f.rawLabel);
                return join([`「${labels.join("·")}」과 ${packet.mbtiType}를 연결할 때 확인할 질문입니다.`, bridgeTraitReadings(packet, s).length ? undefined : basis?.description,
                    ...bridgeTraitReadings(packet, s),
                    ...(packet.sajuFeatureDictionary ?? []).filter(f => s.relatedSajuFeatureIds.includes(f.sourceFeatureId ?? "")).slice(0, 1).map(f => `${f.rawLabel}의 의미는 ${f.plainMeaning}`),
                    `실제 대응 기준: ${s.practicalSwitch}`]);
            }).filter((v, i, a) => a.indexOf(v) === i));
            if (!packet.mbtiType)
                paragraphs.push("두 자료를 합쳐 설명할 근거가 없는 부분은 비워 둡니다. 아래 원국의 신호는 그대로 살펴보되, 말이 빠른지 느린지, 혼자 쉬는지 사람을 만나는지까지 임의로 정하지 않습니다. 같은 구조라도 맡은 역할과 경험에 따라 표현은 달라질 수 있으므로, 최근의 한 장면에서 실제 행동을 대조하는 편이 정확합니다.");
        }
        if (readingId === "loveRelationshipReading")
            paragraphs.push("호감의 신호와 관계를 유지하는 기준을 함께 읽되, 상대의 MBTI나 오행을 이 결과로 정하지는 않습니다. 맞는 상대는 위의 표현 방식과 약속을 함께 조율할 수 있는 사람인지 살펴보세요. 특정 유형만으로 궁합을 단정하지 않으며, 피해야 할 패턴도 상대의 정체성이 아니라 반복되는 행동을 뜻합니다.");
        if (readingId === "finalMessage") {
            if (!packet.mbtiType)
                paragraphs.push("MBTI를 입력하지 않은 이번 해석에서는 행동 성향을 덧붙이지 않았습니다. 일, 돈, 관계 중 실제로 비슷한 장면이 있었던 영역을 골라 아래 기준을 적용하고, 맞지 않았던 해석은 그대로 남겨 두세요.");
            const conclusion = (packet.selectedSajuFeatureEvidence ?? []).find(c => c.chapterId === "final_message")?.features ?? [];
            paragraphs.push(...conclusion.slice(0, 3).map(f => `「${f.labelKo}」에서 다시 확인할 생활 장면: ${f.sceneSeeds[1] ?? f.sceneSeeds[0]} ${f.positiveReading}`));
        }
    }
    if (readingId === "opening") {
        const source = getMbtiSourceProfile(packet.mbtiType);
        const t = source?.traits?.identity?.[0];
        if (t)
            paragraphs.push(join(["밖에서 알아보는 나와 내가 느끼는 나를 비교할 단서입니다.", t.plainKo, t.positiveUse, t.risk]));
    }
    if (readingId === "sajuMbtiBridgeReading" || (!packet.mbtiType && readingId === "mbtiReading")) {
        const entries = packet.sajuEntryIds.map(id => SAJU_KNOWLEDGE_BY_ID.get(id)).filter(e => e?.category === "day_master");
        for (const e of entries.slice(0, readingId === "sajuMbtiBridgeReading" ? 1 : 0))
            if (e)
                paragraphs.push(join([
                    `기준이 되는 일간 「${e.labelKo}」: ${e.meaning}`,
                    e.coreImageKo,
                ]));
        if (!packet.mbtiType)
            paragraphs.push(...(packet.selectedSajuFeatureEvidence?.find(c => c.chapterId === "personality_pattern")?.features ?? []).slice(readingId === "mbtiReading" ? 0 : 2, readingId === "mbtiReading" ? 2 : 4).map(f => join([`「${f.labelKo}」의 또 다른 관찰점`, f.symbolicImage, f.sceneSeeds[1], f.cautionReading, f.id === "sinsal_yangin" ? "자기 힘의 추진력과 승부 감각을 상황에 맞게 쓸지 살펴보세요." : undefined])));
    }
    return join(paragraphs, "\n\n");
}
export function comprehensiveSectionActions(packet: ComprehensiveReportEvidencePacket, readingId: ReadingId, limit: number): string[] {
    const features = comprehensiveSectionFeatures(packet, readingId);
    const actions = features.map(f => `「${f.rawLabel}」: ${f.practicalUse}`);
    for (const { trait } of selectedTraits(packet, comprehensiveNarrativeSection(packet, readingId))) {
        if (actions.length < limit && trait.positiveUse)
            actions.push(trait.positiveUse);
    }
    const chapterId = (Object.entries(chapterReadingId) as [
        ChapterId,
        ReadingId
    ][]).find(([, id]) => id === readingId)?.[0];
    const other = packet.selectedSajuFeatureEvidence?.find(c => c.chapterId === chapterId)?.features ?? [];
    for (const f of other)
        if (actions.length < limit && !actions.some(a => a.includes(f.practicalUse)))
            actions.push(`「${f.labelKo}」: ${f.practicalUse}`);
    return actions.slice(0, limit).map(clean);
}
export function buildComprehensiveActions(packet: ComprehensiveReportEvidencePacket): readonly string[] {
    const selected = (packet.selectedSajuFeatureEvidence ?? []).find(c => c.chapterId === "final_message")?.features ?? [];
    const scenes = packet.sajuMbtiBridgeEvidence ?? [];
    const actions = scenes.slice(0, 2).map(s => s.practicalSwitch);
    for (const topic of ["work", "money", "relationship", "growth"]) {
        const f = selected.find(f => f.topics.includes(topic as typeof f.topics[number]) && !actions.some(a => a.includes(f.practicalUse)));
        if (f)
            actions.push(`「${f.labelKo}」의 활용 기준: ${f.practicalUse}`);
    }
    for (const f of selected)
        if (actions.length < 4 && !actions.some(a => a.includes(f.practicalUse)))
            actions.push(`「${f.labelKo}」의 활용 기준: ${f.practicalUse}`);
    return [...new Set(actions)].slice(0, 4).map(clean);
}
export function buildComprehensiveFinalAdvice(packet: ComprehensiveReportEvidencePacket): string {
    const plan = packet.narrativePlan ?? buildComprehensiveNarrativePlan(packet);
    const f = (packet.selectedSajuFeatureEvidence ?? []).find(c => c.chapterId === "final_message")?.features[0];
    const s = (packet.sajuMbtiBridgeEvidence ?? [])[0];
    return join([`오늘부터는 ‘${plan.themes[0]?.title ?? f?.labelKo}’이 드러났던 장면 하나를 기준으로 삼으세요.`,
        s?.practicalSwitch ?? f?.practicalUse, f ? `특히 「${f.labelKo}」의 힘을 쓸 때 ${f.cautionReading}` : undefined]);
}
