import { buildLoveV3, LOVE_V3_POLISH_VERSION, type LoveV3Input, type LoveV3Draft } from "./loveEditorial";
import { composeEditorial, type EditorialScene } from "./editorialComposer";
import { storySupport } from "./comprehensiveStoryEvidence";
import { LOVE_PORTRAITS } from "./lovePortraits";
import { LOVE_MOMENTS, LOVE_D2_STATE } from "./loveEditorialPolishCopy";
import { LOVE_VOICES } from "./loveEditorialContext";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import type { Evidence } from "./types";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { interpretCareerContextV3 } from "./careerContextV3";

/** D's calculation, qualified facts and optional sections remain unchanged.
 * D2 has its own deterministic copy replay; published D snapshots stay frozen. */
export function buildLoveV3Polished(input: LoveV3Input): LoveV3Draft {
  const original = buildLoveV3(input), { facts, calculation } = input;
  const substantial = facts.filter(f => storySupport(f.featureId, facts, calculation).substantial && f.domains.some(d => ["love", "relationship", "lifestyle"].includes(d)));
  const old = original.chapters.flatMap(c => c.scenes);
  const refs = (s: EditorialScene) => s.evidenceRefs.flatMap(id => facts.find(f => f.id === id) ?? []);
  const main = old.find(s => s.angle === "first-minute")?.evidenceRefs.map(id => facts.find(f => f.id === id)).find(f => f?.featureId.startsWith("ten_god_"));
  if (!main) return { ...original, version: LOVE_V3_POLISH_VERSION };
  // Semantic roles use only D's substantial facts, not a quota or a new score.
  const choose = (keys: readonly string[]) => keys.flatMap(key => substantial.find(f => f.featureId === `ten_god_${key}`) ?? [])[0] ?? main;
  const attraction = choose(["zheng_guan", "pian_yin", "bijian", "shi_shen", "zheng_cai", "qi_sha", "shang_guan", "pian_cai", "zheng_yin", "jie_cai"]);
  const affection = choose(["shi_shen", "zheng_cai", "zheng_yin", "pian_cai", "zheng_guan", "bijian", "qi_sha", "pian_yin", "shang_guan", "jie_cai"]);
  const friction = choose(["zheng_guan", "qi_sha", "shang_guan", "pian_yin", "jie_cai", "zheng_cai", "bijian", "zheng_yin", "pian_cai", "shi_shen"]);
  const attention = choose(["pian_yin", "zheng_yin", "shang_guan", "shi_shen", "zheng_guan"]);
  const protection = substantial.find(f => f.featureId === "ten_god_qi_sha");
  const mediation = substantial.find(f => f.featureId === "gwiin_cheondeok");
  const home = old.find(s => s.angle === "shared-life")!.evidenceRefs.map(id => facts.find(f => f.id === id)).find(f => f?.featureId.startsWith("ten_god_")) ?? main;
  const depth = substantial.find(f => f.featureId === "twelve_sinsal_hwagae");
  const day = substantial.find(f => f.featureId === "day_pillar_jeongchuk");
  const spouse = facts.find(f => f.kind === "spouse_palace" && f.certainty === "confirmed");
  const voice = LOVE_VOICES[input.mbti];
  const moment = (f: Evidence) => LOVE_MOMENTS[f.featureId.slice(8)];
  const portrait = (f: Evidence) => LOVE_PORTRAITS[f.featureId.slice(8)];
  const state = LOVE_D2_STATE[input.relationshipStatus];
  const character = (text: string) => ({ role: "character" as const, text });
  const reanchor = (s: EditorialScene, anchors: readonly Evidence[]): EditorialScene => {
    const unique = [...new Map(anchors.map(f => [f.id, f])).values()];
    const domain = unique.filter(f => substantial.some(a => a.id === f.id)).flatMap(f => f.domains).find(d => ["love", "relationship", "lifestyle"].includes(d)) ?? s.domain;
    return { ...s, domain, evidenceRefs: unique.map(f => f.id), sourceRefs: [...new Set([...unique.flatMap(f => f.sourceRefs), "loveEditorialPolish:reviewed-copy", "userContext:relationshipStatus", ...(input.familyFocus ? ["userContext:focusAreas:가족"] : [])])] };
  };
  const scenes = old.flatMap((s): EditorialScene[] => {
    // Definitions belong to existing evidence tags / the professional table.
    let next: EditorialScene = { ...s, parts: s.parts.filter(p => p.role !== "explanation") };
    let anchors = refs(s);
    switch (s.angle) {
      case "first-minute":
        next = { ...next, headline: portrait(main).title, parts: [character(portrait(main).opening), character(moment(main).opening)] }; break;
      case "mbti-fusion": {
        const precision = anchors.some(f => f.featureId === "sinsal_hyeonchim");
        if (!precision && voice) { next = { ...next, parts: [character(voice.approach(portrait(attraction).need))] }; anchors = [attraction, ...anchors.filter(f => f.kind === "mbti")]; }
        break;
      }
      case "status-now":
        next = { ...next, parts: [character(state.opening)], form: "prose" }; anchors = [attraction]; break;
      case "status-turn":
        next = { ...next, id: `love:present:${state.angle}`, angle: state.angle, headline: input.relationshipStatus === "single" ? "친구는 이미 눈치챘을지도 모릅니다" : input.relationshipStatus === "some" ? "추측보다 다음 약속이 더 많은 것을 말합니다" : input.relationshipStatus === "dating" ? "화해할 마음은 일상적인 말로 먼저 도착합니다" : input.relationshipStatus === "marriage_preparing" ? "두 사람의 준비에 관객이 너무 많아질 때" : input.relationshipStatus === "married" ? "쉬고 있는 사람 옆에서 다음 일을 기억하는 사람" : "누구 옆에서 말이 편해지는지", parts: [character(state.detail)], form: "quote" }; anchors = [input.relationshipStatus === "married" || input.relationshipStatus === "marriage_preparing" ? home : attention]; break;
      case "first-attraction":
        next = { ...next, headline: moment(attraction).crushTitle, parts: [character(moment(attraction).crush)] }; anchors = [attraction]; break;
      case "lasting-comfort":
        next = { ...next, headline: "눈에 들어온 이유와 곁에 남는 이유는 다릅니다" }; break;
      case "native-gift":
        next = { ...next, headline: "그 사람과 있으면 하루가 좀 괜찮아지는 매력", parts: [character(portrait(affection).good)] }; anchors = [affection]; break;
      case "dohwa-supporting":
        next = { ...next, parts: [character("옷차림에 드러난 취향이나 웃는 표정처럼 작은 장면이 첫인상에 남을 수 있습니다. 도화가 보태는 가벼운 매력도 이렇게 내가 자연스럽게 보이는 순간에 묻어납니다.")] }; anchors = [affection, ...anchors.filter(f => f.featureId === "sinsal_dohwa")]; break;
      case "hongyeom-supporting":
        next = { ...next, parts: [character("편해진 뒤 건넨 말 한마디에 처음과 다른 온도가 실릴 수 있습니다. 홍염이 살짝 보태는 친밀한 매력은 여럿 앞에서보다 가까운 대화에서 자기 분위기가 전해지는 쪽입니다.")] }; anchors = [affection, ...anchors.filter(f => f.featureId === "sinsal_hongyeom")]; break;
      case "affection-method":
        next = { ...next, headline: affection.featureId === "ten_god_shi_shen" ? "좋아하면 시간을 씁니다. 이 사람에겐 큰 표현입니다" : "본인은 이미 표현했는데 상대는 조금 더 듣고 싶습니다", parts: [character(moment(affection).affection), ...(day ? [character("마음을 한꺼번에 쏟기보다 한 번 내준 자리를 오래 지키는 편입니다. 겉으로는 다음 할 일을 정리해도, 속에서는 함께 보낸 시간과 지킨 약속이 차곡차곡 남습니다. 열기가 작게 보여도 쉽게 꺼지지 않는 애정입니다.")] : [])] }; anchors = [...(day ? [day] : []), affection, ...(spouse ? [spouse] : [])]; break;
      case "solitude-depth":
        next = { ...next, headline: "혼자 있고 싶다고 마음이 식은 건 아닙니다", parts: [character("함께 있으면 좋은데 가끔은 음악이나 취미 속으로 혼자 들어가야 마음이 정리됩니다. 머릿속에 자기만의 방이 있는 셈입니다. 상대가 보는 조용함과 내가 느끼는 풍성함이 꼭 같은 표정은 아닙니다."), character("혼자 보낸 시간이 지나고 나면 오히려 꺼낼 이야기가 생깁니다. 하루 종일 붙어 있는 것보다 잠깐 각자의 세계에 다녀와 새 이야기를 가져오는 친밀함이 편할 수 있습니다.")] }; break;
      case "delivery-tip":
        next = { ...next, parts: [{ role: "advice", text: "챙겨준 행동 하나에 ‘네 생각이 나서’ 같은 마음을 짧게 붙여보세요. 상대가 반가웠던 표현도 들어보면, 이미 쓰고 있는 정성이 엉뚱한 곳에서 길을 잃는 일이 줄어듭니다." }] }; anchors = [affection]; break;
      case "overuse":
        next = { ...next, headline: moment(friction).frictionTitle, parts: [character(moment(friction).friction)] }; anchors = [friction]; break;
      case "partner-perspective":
        next = { ...next, headline: input.mbti === "ENTJ" ? "상대는 위로받고 싶은데 해결회의가 열립니다" : "내가 건넨 사랑과 상대가 들은 뜻 사이", parts: [character(input.mbti === "ENTJ" ? "연애 상담을 듣다가 마음속 솔루션 센터가 먼저 열립니다. 본인은 상대가 덜 힘들 방법을 찾느라 진지한데, 상대는 ‘일단 내 편에서 같이 속상해해 줬으면’ 할 수 있습니다. 사랑은 프로젝트가 아니라서 정답을 빨리 찾아도 끝나지 않는 대화가 있습니다." : voice!.conflict)] }; anchors = [input.mbti === "ENTJ" ? protection ?? affection : affection, ...anchors.filter(f => f.kind === "mbti")]; break;
      case "combination-connection":
        next = { ...next, headline: "둘의 취향을 하나만 남길 필요는 없습니다", parts: [character("붙어서 맞춰가고 싶은 마음이 있어 서로 다른 취향 사이에서 접점을 찾습니다. 산책하고 싶은 마음과 집에서 쉬고 싶은 마음 사이에, 잠깐 걷고 같이 쉬는 저녁이 생기는 식입니다. 함께하기 위해 내 취향을 전부 지우지 않아도 되는 관계의 좋은 패입니다.")] }; anchors = [mediation ?? home, ...anchors.filter(f => f.kind === "relation")]; break;
      case "clash-pace":
        next = { ...next, headline: "가까워지고 싶은 마음도 잠깐 멈추고 싶을 때가 있습니다", parts: [character("바로 이야기해서 풀고 싶은 마음과 내 속도로 정리하고 싶은 마음이 같이 있습니다. 어떤 날은 답을 기다리는 쪽이었다가 다른 날은 잠깐 조용히 있고 싶은 쪽이 됩니다. 마음이 바뀌었다기보다 지금 필요한 대화의 속도가 달라진 모습입니다.")] }; anchors = [depth ?? friction, ...anchors.filter(f => f.kind === "relation")]; break;
      case "shared-life":
        next = { ...next, headline: input.relationshipStatus === "married" ? "집에서는 사소한 취향의 목소리가 커집니다" : home.featureId === "ten_god_shi_shen" ? "같이 살게 된다면, 냉장고 앞에서도 성격이 보입니다" : home.featureId === "ten_god_pian_yin" ? "같은 집에서도 내 생각이 쉴 방은 필요합니다" : home.featureId === "ten_god_bijian" ? "소파 색 하나에도 내 취향은 한 표를 갖습니다" : home.featureId === "ten_god_shang_guan" ? "빨래 개는 순서에도 개선안이 떠오릅니다" : "같이 사는 하루에는 서로 다른 쉼표가 있습니다", parts: [character(moment(home).home), ...(home.id !== friction.id ? [character(moment(friction).home)] : [])] }; break;
      case "daily-reset":
        next = { ...next, parts: [{ role: "advice", text: input.relationshipStatus === "married" ? "돈·집안일·가족 일정 중 한 가지를 골라 실행뿐 아니라 기억하고 준비하는 몫도 함께 나눠보세요. 싸운 뒤에는 언제 다시 이야기할지 약속하고, 둘이 즐겁게 쓸 시간도 생활의 한 칸으로 남겨두면 좋습니다." : "함께 살 이야기를 하게 된다면 돈·집안일·혼자 쉬는 시간의 기준부터 나눠보세요. 취향이 다른 데서 끝내기보다 서로 편한 방법을 하나씩 고를 수 있으면, 사소한 결정이 사랑의 시험처럼 커지지 않습니다." }] }; break;
      case "hypothetical-parent":
        next = { ...next, headline: home.featureId === "ten_god_shi_shen" ? "숙제를 돕는 어른이 더 진지해질 때" : "놀이와 숙제 앞에서 드러날 나의 사랑", parts: [character(moment(home).parent), ...next.parts.slice(1)] }; break;
      case "whole-person": {
        const charms = refs(s).filter(f => ["sinsal_dohwa", "sinsal_hongyeom"].includes(f.featureId));
        const helper = substantial.find(f => f.featureId === "gwiin_cheoneul");
        const good = charms.length ? s.parts[1].text : helper ? "괜찮은 사람과 이어지는 사람복도 당신의 편입니다. 혼자 모든 관계의 답을 내지 않아도, 믿을 만한 사람의 한마디가 마음을 풀어주는 연결이 있습니다. 곁에 둘 사람을 알아보고 도움을 받는 것 역시 사랑을 편하게 만드는 힘입니다." : s.parts[1].text;
        const dailyLife = input.relationshipStatus === "married" ? portrait(home).home.replace(/함께 살게 된다면|같이 살게 된다면/, "같이 사는 일상에서는") : portrait(home).home;
        next = { ...next, headline: `${input.name}님의 연애는 결국 이런 모습입니다`, parts: [character(`${input.name}님은 ${moment(main).final}`), character(good), character(state.closing), character(day ? "말로 꺼낸 것보다 마음 안에 오래 보관하는 시간이 많습니다. 함께 쓴 시간과 작은 약속을 기억하고, 다 챙겨주고도 말하지 않은 애정이 남을 수 있는 사람입니다. 아무것도 해내지 않는 저녁에 나란히 쉬는 장면도 당신의 사랑에 어울립니다." : `${withKoreanParticle(portrait(home).need, "subject")} 일상에도 자리를 가질 때 편해집니다. ${dailyLife}`), character(moment(main).punch)] };
        anchors = [main, affection, home, ...charms, ...(day ? [day] : []), ...(helper ? [helper] : [])]; break;
      }
    }
    // Shared-life's second manifestation belongs to the selected overuse fact.
    if (s.angle === "shared-life" && home.id !== friction.id) anchors = [...anchors, friction];
    if (input.robust && input.context?.fieldLabel && s.angle === "affection-method") {
      const work = interpretCareerContextV3(input.context.fieldLabel, true, input.context.lifeStatus);
      const scene = careerEditorialScenes(input.context, work);
      next = { ...next, parts: [...next.parts, character(`${input.context.fieldLabel}의 하루를 떠올려보면 ${scene.pressure}가 있습니다. 바깥에서 여러 사람의 요청을 들은 날에는 좋아하는 사람 앞에서도 잠깐 말이 줄 수 있죠. 마음을 덜 쓴 것이 아니라, 내 이야기를 고를 여유가 돌아오는 중일 수 있습니다.`)], sourceRefs: [...next.sourceRefs, "userContext:detailJob"] };
    }
    return [reanchor(next, anchors)];
  });
  const { scenes: composed, ...editorialAudit } = composeEditorial({ product: "love_marriage_child", facts, scenes, chapters: original.chapters.map(c => c.id), selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: substantial.map(f => f.id) });
  return { ...original, version: LOVE_V3_POLISH_VERSION, chapters: original.chapters.map(c => ({ ...c, title: c.id === "present" ? state.title : c.title, scenes: composed.filter(s => s.chapter === c.id) })), editorialAudit };
}
