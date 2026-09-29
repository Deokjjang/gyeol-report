import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import type { MajorFortuneReportDraft } from "../report-generation/majorFortuneReportDraftTypes";
import type { SajuCalcResult } from "../saju/types";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { buildMajorFortuneHorizon } from "./majorFortuneHorizon";
import type { MajorFortuneV3Draft } from "./majorFortuneEditorial";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { interpretCareerContextV3 } from "./careerContextV3";
import { fortuneTraitFusion } from "./mbtiFortuneFusion";
import { endingWarnings, narrativeRhythm, type NarrativeAudit } from "./mbtiNarrative";
import { DETAIL_NARRATIVE_EDITION } from "./narrativeEdition";
import type { Evidence } from "./types";

export const MAJOR_OUTLOOK_VERSION = "major_fortune_v3.0-editorial.4" as const;
const returnHeadings: Record<TenGod, string> = {
  비견: "내 이름으로 고른 길이 자산이 됩니다", 겁재: "사람이 많던 시절에서, 함께 남을 사람으로", 식신: "만들어온 것이 나를 대신 소개합니다",
  상관: "질문하던 사람에서, 새 기준을 남기는 사람으로", 편재: "넓게 보던 눈으로, 오래 남을 기회를 고릅니다", 정재: "꾸준히 남긴 것이 다음 선택을 넓힙니다",
  편관: "버티던 힘으로, 이제는 판을 고릅니다", 정관: "좋은 평판이 나를 대신 소개합니다", 편인: "따로 쌓던 관심이 하나의 전문성이 됩니다", 정인: "배운 것이 쌓여, 내 이름의 자산이 됩니다",
};
const finalPunch: Record<TenGod, string> = {
  비견: "남의 속도에서 내려온 자리에, 내 이름으로 갈 길이 남습니다.", 겁재: "크게 시작한 판보다, 끝에도 서로의 이름을 지켜준 사람이 남습니다.",
  식신: "나를 오래 설명할 것은 바빴던 날이 아니라, 내 손을 거쳐 누군가에게 남은 것입니다.", 상관: "세상에 던진 질문이 직접 만든 답을 만날 때, 내 방식은 하나의 기준이 됩니다.",
  편재: "멀리 볼 줄 아는 눈에 끝까지 남길 줄 아는 손이 붙으면, 기회는 내 자산이 됩니다.", 정재: "돈도 시간도, 다음 선택을 내 편으로 남기는 사람이 오래 갑니다.",
  편관: "센 사람이 되는 것보다, 힘을 쓸 판을 고를 수 있는 사람이 되는 10년입니다.", 정관: "자리는 바뀌어도 믿고 맡긴다는 말은 남습니다. 그 신뢰가 다음의 나를 데려갑니다.",
  편인: "남들이 지나친 질문을 오래 품은 시간이, 결국 내 이름의 전문성이 됩니다.", 정인: "지나온 시간을 설명할 수 있는 사람에게, 배움은 더 이상 빌린 힘이 아닙니다.",
};
const lives: Record<TenGod, { opening: string; work: string; money: string; people: string; love: string; gift: string }> = {
  비견: { opening: "남들이 좋다는 길보다 ‘내가 정말 고른 길인가?’가 더 신경 쓰이지 않나요? 같이하던 일에서도 내 이름으로 결정한 몫이 있어야 마음이 놓이는 때입니다.", work: "자기 이름으로 선택하고 끝내는 일", money: "남과 비교한 크기보다 내가 통제할 수 있는 몫", people: "서로 다르게 해도 존중하는 동료", love: "붙어 있는 시간보다 각자의 선택을 존중하는 여유", gift: "자기 기준을 세우는 힘은 흔들릴 때 돌아올 기반이 됩니다." },
  겁재: { opening: "누가 같이 해보자고 하면 혼자 생각할 때보다 판이 커지지 않나요? 신나는 시작만큼 ‘마지막까지 같이할 사람은 누구지?’도 더 또렷해지는 때입니다.", work: "함께 벌일 일의 크기와 마지막까지 맡을 역할", money: "함께 만든 결과에서 내게 남는 몫", people: "실력을 자극하되 몫까지 흐리지 않는 동료", love: "같이 즐기는 재미와 각자 감당할 몫의 균형", gift: "사람을 통해 새로운 도전에 힘이 붙는 장점이 있습니다." },
  식신: { opening: "요즘 ‘일은 많이 했는데 그래서 내 이름으로 남은 건 뭐지?’가 예전보다 신경 쓰이지 않나요? 잘했다는 말보다 다음에도 다시 찾는 사람이나 내가 만든 방식을 남이 쓰는 장면이 더 오래 기분 좋게 남습니다.", work: "직접 만들고 보여주는 결과", money: "손에 익은 실력의 쓸모와 다시 찾는 수요", people: "내가 만든 것을 함께 즐기고 알아보는 사람", love: "함께 먹고 걷고 챙기는 작은 경험", gift: "표현운의 좋은 면은 손에 익은 재능을 남도 알아보는 결과로 꺼내는 힘입니다." },
  상관: { opening: "다들 익숙해서 넘기는 방식이 혼자 유난히 답답할 때가 있지 않나요? ‘원래 이렇게 해요’라는 말보다 바꿔본 작은 결과가 더 믿음직해지는 때입니다.", work: "당연하던 절차를 바꾸는 제안", money: "새 방식의 쓸모와 전환에 드는 비용", people: "질문을 공격으로 받지 않고 대안을 같이 보는 사람", love: "서로의 생각을 솔직히 꺼내되 평가로 굳히지 않는 대화", gift: "표현과 개선의 힘이 있어요. 불편을 알아보는 눈이 직접 만든 대안과 만날 때 존재감이 생깁니다." },
  편재: { opening: "사람을 만나고 돌아오면 ‘내가 하던 걸 저쪽에도 써볼 수 있겠는데?’라는 생각이 남지 않나요? 지금 가진 능력을 다른 판에 연결할 길이 궁금해지는 때입니다.", work: "바깥 기회와 지금의 능력을 연결하는 일", money: "기회의 크기와 실제 돌아오는 돈의 간격", people: "서로 다른 현장을 연결해 주는 접점", love: "새로운 경험을 같이하는 설렘과 남겨둘 일상의 시간", gift: "재물운을 읽는 좋은 축은 자원을 발견하고 연결하는 감각입니다. 거래가 커 보이는 것과 내 자산이 되는 것을 가르는 눈도 함께 자라요." },
  정재: { opening: "크게 한 번 해내는 것보다 ‘다음 달에도 이렇게 돌아갈까?’가 더 신경 쓰이지 않나요? 시간과 돈을 계속 쏟지 않아도 유지되는 생활이 매력적으로 보이는 때입니다.", work: "성과가 반복되도록 남기는 운영 방식", money: "수입·비용·시간을 오래 버틸 수 있게 맞추는 구조", people: "작은 약속을 다음에도 지키는 신뢰", love: "달력과 통장에도 서로의 여유를 남기는 생활", gift: "축적운의 좋은 면이 있습니다. 큰 한 번뿐 아니라 덜 새는 비용, 다시 쓰는 경험, 반복되는 신뢰가 자산으로 남습니다." },
  편관: { opening: "급한 일이 생기면 결국 내 쪽을 보는 순간이 있지 않나요? 해낼 수 있다는 믿음은 반갑지만 내가 없으면 안 돌아가는 상황까지 반가운 건 아닙니다.", work: "어려운 상황에서 맡는 판단과 결정권", money: "책임의 크기에 맞는 보상과 회복 자원", people: "위기 때 역할을 같이 나누는 사람", love: "빠른 해결보다 상대가 고를 여지도 남기는 보호", gift: "압박 속에서도 판단을 맡을 수 있는 힘은 자리와 명예를 만들어갈 좋은 재료입니다." },
  정관: { opening: "‘잘했어’보다 ‘다음에도 네 판단을 믿을게’라는 말이 더 크게 들리지 않나요? 실력뿐 아니라 일을 대하는 기준까지 내 이름을 소개하기 시작하는 때입니다.", work: "공식적으로 맡길 수 있는 역할과 기준", money: "약속된 보상과 지속해서 지킬 의무", people: "믿고 중요한 판단을 맡기는 연결", love: "관계의 약속을 지키면서도 정답을 강요하지 않는 태도", gift: "자리운과 명예운의 좋은 면을 읽을 수 있습니다. 반복해서 보여준 태도가 더 큰 판단을 맡기는 신뢰로 이어지는 흐름이에요." },
  편인: { opening: "남들은 넘어갔는데 혼자 계속 생각나는 질문이 있지 않나요? 당장 쓸모없어 보이던 관심이 지금 하는 일과 뜻밖에 연결되는 재미가 커지는 때입니다.", work: "남과 다른 관점으로 막힌 문제를 푸는 일", money: "낯선 정보를 이해하는 시간과 실제 투입할 비용의 구분", people: "생각의 폭을 넓혀주는 대화 상대", love: "말하지 않은 뜻을 짐작하기보다 서로의 세계를 알아가는 시간", gift: "탐구와 전문성의 좋은 흐름입니다. 멀리 떨어져 보이던 경험을 자기 관점으로 엮는 힘이 자라요." },
  정인: { opening: "새로 배운 내용보다 ‘아, 그때 내가 왜 그랬는지 알겠다’는 순간이 더 오래 남지 않나요? 경험에 이름을 붙이고 남에게 설명할 수 있는 기반이 쌓이는 때입니다.", work: "배운 것을 자기 경험에 적용하고 설명하는 일", money: "오래 쓸 실력과 기반에 남기는 자원", people: "시행착오를 줄여주는 도움과 배움의 연결", love: "대신 결정해 주기보다 서로 배울 시간을 지켜주는 돌봄", gift: "학습운의 좋은 면이 있습니다. 자료와 조언을 받아 내 방식으로 써보는 사이에 오래 가져갈 전문성이 남아요." },
};

/** F4 only. The F3 composer remains the exact replay path for saved editions. */
export function buildMajorFortuneOutlook(base: MajorFortuneReportDraft, packet: MajorFortuneEvidencePacket, facts: readonly Evidence[], calculation: SajuCalcResult): MajorFortuneV3Draft | null {
  const f3 = buildMajorFortuneHorizon(base, packet, facts, calculation, 10);
  if (!f3?.horizon) return null;
  const horizon = f3.horizon, oldAudit = f3.narrativeAudit ?? [], used = new Set<string>(), audit: NarrativeAudit[] = [];
  const now = horizon.activeCycle ?? horizon.rows.find(r => r.year === packet.currentYear)!.cycle;
  const scenes = careerEditorialScenes(packet.userContext, interpretCareerContextV3(packet.userContext.fieldLabel ?? ""));
  const fuse = (god: TenGod, section: string) => {
    const year = section.startsWith("year-") ? f3.editorialYears.find(y => y.year === Number(section.slice(5))) : undefined;
    const cycle = year ? horizon.rows.find(r => r.year === year.year)!.cycle : section.startsWith("transition-") ? horizon.transitions.find(t => t.year === Number(section.slice(11)))!.after : section === "finale" ? horizon.rows.at(-1)!.cycle : now;
    const source = `major:${cycle.index}:${cycle.ganji}${year ? `:year:${year.year}:${year.ganji}` : ""}`;
    const result = fortuneTraitFusion({ mbti: packet.mbtiBasis.type ?? "", name: packet.personLabel, god, section, used, evidenceRefs: [source], returning: year?.year === packet.currentYear + 10 });
    if (!result) return null;
    const mbtiFact = facts.find(f => f.featureId === result.audit.traitId);
    audit.push({ ...result.audit, evidenceRefs: [...result.audit.evidenceRefs, ...(mbtiFact ? [mbtiFact.id] : [])] }); return result.paragraph;
  };
  const hasOldTrait = (section: string) => oldAudit.some(a => a.section === section);
  const transitions = horizon.transitions.map(t => {
    const a = lives[t.before.tenGod], b = lives[t.after.tenGod];
    const after = horizon.activeCycle ? t.after.index <= horizon.activeCycle.index : t.year < packet.currentYear;
    const original = t.paragraphs.filter((_, i) => !(i === 3 && hasOldTrait(`transition-${t.year}`)));
    const fusion = fuse(t.after.tenGod, `transition-${t.year}`);
    const state = packet.userContext.relationshipStatus;
    return { ...t, paragraphs: narrativeRhythm([
      original[0],
      `일의 질문이 달라집니다. ${t.before.ganji}에서 ${a.work}에 무게를 뒀다면, ${t.after.ganji}에서는 ${b.work}에 더 눈이 ${after ? "가고 있습니다" : "갈 거예요"}. ${scenes.next}에도 지금까지 무엇을 했는지뿐 아니라 그 다음에 무엇을 맡고 싶은지가 더 중요해집니다.`,
      original[1].split(/(?<=\.)\s+/u).slice(1).join(" "),
      `돈을 보는 기준도 ${a.money}에서 ${b.money} 쪽으로 옮겨갑니다. 예전에는 괜찮다고 넘긴 비용도 새 생활에서는 다르게 느껴질 수 있어요. 더 벌고 싶은 마음과 덜 소모되고 싶은 마음이 한 통장 안에서 만나기 시작합니다.`,
      `사람에게 기대하는 것도 바뀝니다. ${a.people}의 가치가 사라지는 것은 아니에요. 거기에 ${b.people}까지 더 중요해집니다. 예전의 관계를 버리는 변화보다, 다음 고민을 같이할 사람을 알아보는 변화에 가깝습니다.`,
      `${state === "single" ? "누군가와 가까워지게 된다면" : state === "married" ? "함께 사는 일상에서는" : "마음이 오가는 관계에서는"}, ${a.love}에 더해 ${b.love}도 살펴보게 됩니다. 바깥에서의 역할이 달라지면 사랑에 쓸 수 있는 시간도 달라지죠. 멋진 계획보다 지금의 속도를 서로 알아듣는 관계가 더 편해집니다.`,
      ...(fusion ? [fusion] : []), original[2], b.gift,
      `좋은 힘이 커질수록 꺼둘 줄 아는 감각도 필요합니다. ${original.at(-1)} 잘되는 방식을 하루 종일 켜놓는 것과 중요한 순간에 쓸 수 있는 것은 다른 힘이에요.`,
    ]) };
  });
  const openingFusion = fuse(now.tenGod, "opening");
  const opening = narrativeRhythm([lives[now.tenGod].opening, now.tenGod === "식신" ? "예전에는 끝낸 일 목록을 보면 뿌듯했다면, 이제는 그중 무엇을 또 하고 싶은지도 보게 됩니다. 능숙해서 빨리 끝낼 수 있는 일과 더 잘하고 싶어서 오래 붙드는 일이 꼭 같지는 않아요. 내가 좋아하는 방식에 시간과 정성이 더 또렷하게 모이는 변화입니다." : f3.opening[1], `이 변화는 지금 ${now.ganji} 대운에서 ${now.theme}과 맞닿아 있습니다.`, ...(openingFusion ? [openingFusion] : []), `${packet.currentYear}년의 선택에서 ${horizon.through}년의 생활까지 이어서 봅니다. 지난 3년은 짧게 확인하고, 앞으로 10년 동안 무엇을 키우고 남길지에 더 긴 시간을 쓸 거예요.`]);
  const yearlyScene: Record<TenGod, string> = {
    비견: `주변이 안정적인 길을 권해도 내가 끝까지 해보고 싶은 일이 남습니다. ${scenes.next}에서 남이 정해준 성공과 내 기준의 성공이 다른 표정을 갖게 돼요. 혼자 고른 작은 경험이 나중에는 남에게 설명할 수 있는 방향이 됩니다.`,
    겁재: `모임이나 협업에서 실력이 좋은 사람이 들어오면 분위기가 달라집니다. 부러움 때문에 시작한 일이라도 끝에는 자기 경험으로 남길 수 있어요. 다만 같이한 사람의 수보다 끝까지 나눈 역할이 더 또렷하게 기억될 해입니다.`,
    식신: `누군가 내가 해준 방식을 자기 일에 가져가는 장면은 생각보다 오래 기분 좋습니다. 잘한다는 칭찬을 넘어 내 방식이 다른 사람의 생활에 자리를 얻는 셈이죠. 표현운의 좋은 점은 박수 한 번보다 다시 찾아오는 반응에 있습니다.`,
    상관: `회의에서 말한 아이디어가 채택되지 않았다고 그 관점까지 사라지는 것은 아닙니다. 작은 범위에서 바꿔본 결과가 긴 설명보다 강한 말이 될 때가 있어요. ${scenes.craft}에도 내 기준으로 한 번 더 손본 흔적이 남습니다.`,
    편재: `${scenes.entry}에도 생각지도 않은 연결이 생길 수 있습니다. 당장 돈이 되지 않는 대화에서도 누구에게 무엇이 필요한지 알게 되죠. 재물운의 쓸모는 모든 제안을 잡는 데 있지 않습니다. 내 기술과 바깥 수요가 맞닿는 지점을 알아보는 데 있습니다.`,
    정재: `${scenes.recognition}에는 고생한 시간과 남은 보상이 같은 방향인지 더 현실적으로 보게 됩니다. 작은 비용을 아끼는 것만이 축적은 아니에요. 같은 일을 다음에는 덜 힘들게 할 수 있는 순서, 믿고 다시 맡기는 사람, 쉴 수 있는 저녁도 남겨둘 자산입니다.`,
    편관: "급한 결정을 앞두고 사람들이 내 말 한마디를 기다리는 순간이 생길 수 있어요. 예전에는 해결하는 사람으로 보였다면 이제는 어디까지 해결할지 정하는 사람으로도 보입니다. 한 번의 위기를 넘기는 것과 다음 위기에도 버틸 생활을 남기는 일은 함께 가야 합니다.",
    정관: "평가받는 자리에서 눈에 띄는 것은 실적만이 아닙니다. 일이 꼬였을 때 어떤 기준으로 결정했는지, 다른 사람의 몫을 어떻게 다뤘는지도 내 이름에 붙어요. 자리운의 좋은 면은 더 높은 이름표보다 사람들이 믿고 맡기는 판단의 폭에서 먼저 드러납니다.",
    편인: `친구는 취미가 또 바뀌었냐고 묻는데 내 안에서는 이전 관심과 이어지고 있을 수 있어요. 다른 분야의 설명 한 줄이 지금의 문제를 푸는 열쇠가 되는 식입니다. 조금 낯설어도 오래 남는 질문은 내 전문성의 다음 입구가 됩니다.`,
    정인: "설명을 듣던 사람이 ‘그렇게 보니까 이해된다’고 말할 때 내가 지나온 시행착오도 누군가의 시간을 줄여줍니다. 배운 것을 잘 기억하는 사람에서 자기 언어로 전하는 사람으로 자라는 변화예요. 자료를 더 모을 때보다 실제로 설명하고 함께 써볼 때 기반이 한층 단단해집니다.",
  };
  const editorialYears = f3.editorialYears.map(y => {
    if (y.timePosition === "past") return y;
    const paragraphs = [...y.paragraphs], key = `year-${y.year}`, god = y.tenGod as TenGod;
    if (hasOldTrait(key)) paragraphs.splice(paragraphs.length - (y.isCurrentYear ? 3 : 1), 1);
    // Ten stems recur, but a return ten years later is not the same life scene.
    const returnYear = y.year === packet.currentYear + 10;
    if (returnYear) {
      const cycle = horizon.rows.find(r => r.year === y.year)!.cycle;
      const offset = horizon.transitions.some(t => t.year === y.year) ? 1 : 0;
      paragraphs.splice(offset, 3,
        `${packet.currentYear}년에는 ${withKoreanParticle(lives[god].work, "object")} 자기 방식으로 다뤘다면, ${y.year}년에는 그동안 쌓은 경험으로 같은 질문에 다른 답을 내놓을 수 있어요. 아는 것이 늘어난 것보다 어디에 힘을 써야 하는지 분명해진 차이입니다. 예전에는 어렵게 해냈던 일을 이제는 남에게 설명하며 함께 풀 수도 있습니다.`,
        `${now.ganji}에서 ${cycle.ganji}로 배경이 달라진 만큼, ${lives[god].money}도 이전과 다른 무게로 다가옵니다. 다시 처음부터 증명하는 경쟁보다 이미 해본 것 중 앞으로도 쓸 수 있는 것을 고르는 눈이 중요해요. 돈과 시간을 어디에 남길지 정하는 기준에 지난 10년의 경험이 들어 있습니다.`,
        `관계에서는 ${withKoreanParticle(lives[god].people, "subject")} 더 구체적인 얼굴을 갖게 될 거예요. 막연히 좋은 사람이 아니라 어떤 순간에 서로 도움이 되는지 아는 관계입니다. ${lives[god].gift} 익숙해진 장점을 혼자만 쓰지 않고 다른 사람의 선택에도 보탤 때, 시간이 내 편으로 쌓였다는 감각이 남습니다.`);
    }
    const fusion = fuse(god, key);
    if (fusion) paragraphs.splice(god === "상관" || god === "편관" ? 1 : 2, 0, fusion);
    // Distinct real-world development, not padding and not one repeated appendix.
    paragraphs.splice(Math.min(4, paragraphs.length), 0, yearlyScene[god]);
    const helper = facts.find(f => f.certainty === "confirmed" && f.salience !== "supporting" && (god === "정인" || god === "편인" ? f.featureId === "gwiin_munchang" : god === "정관" ? f.featureId === "twelve_sinsal_banan" : false));
    if (helper && calculation.birthTimeContext?.birthTimePrecision === "exact") paragraphs.push(god === "정관" ? "원래 가진 반안의 좋은 패도 자리와 인정의 흐름을 읽는 데 함께 놓입니다. 나를 드러내는 횟수보다 맡은 역할에서 무엇을 남겼는지가 더 단단한 소개가 됩니다." : "원래 가진 문창의 패도 학습과 표현의 흐름에 힘을 보탭니다. 새로 알게 된 것을 남이 이해할 말로 바꾸는 순간, 지식이 혼자만의 취미를 넘어 쓸 수 있는 전문성이 돼요.");
    return { ...y, title: returnYear ? returnHeadings[god] : y.title, paragraphs: narrativeRhythm(paragraphs) };
  });
  const editorialSections = f3.editorialSections.map(s => {
    const key = s.id === "elements" ? "learning" : s.id;
    if (!hasOldTrait(key)) return s;
    const fusion = fuse(now.tenGod, key);
    return { ...s, paragraphs: narrativeRhythm([...s.paragraphs.slice(0, -1), ...(fusion ? [fusion] : [])]) };
  });
  const last = horizon.rows.at(-1)!.cycle, next = transitions.find(t => t.year >= packet.currentYear) ?? transitions.at(-1);
  const finalFusion = fuse(last.tenGod, "finale");
  const finale = narrativeRhythm([
    `${packet.currentYear}년의 ${packet.personLabel}님이 ${now.theme}에 마음을 쓰고 있다면, ${horizon.through}년까지 남길 것은 단순히 더 바빴다는 기억이 아닙니다. ${packet.userContext.fieldLabel ? `${packet.userContext.fieldLabel}에서` : "지금의 자리에서"} 직접 해보고 고른 방식이 다음 역할을 소개하는 말이 됩니다.`,
    next ? `${next.year}년 ${next.before.ganji}에서 ${next.after.ganji}로 넘어가는 길은 능력을 버리는 길이 아니에요. ${lives[next.before.tenGod].work}에서 얻은 경험을 ${lives[next.after.tenGod].work}에 다시 쓰는 길입니다. 그때부터는 무엇을 더 맡을지뿐 아니라 무엇이 나 없이도 이어질지가 중요한 질문이 됩니다.` : `${last.ganji}의 장에서 익힌 ${withKoreanParticle(lives[last.tenGod].work, "topic")} 단번에 끝나는 과제가 아닙니다. 해마다 다른 장면에서 써보며 내 방식이 됩니다.`,
    `돈과 사람도 같은 시간 안에서 남습니다. ${lives[last.tenGod].gift} 처음부터 모든 것을 혼자 가진 사람보다, 쌓은 경험과 믿고 이어지는 관계를 다음 선택에 쓸 줄 아는 사람이 되는 변화예요.`,
    finalFusion ?? `지금의 성격을 지우고 전혀 다른 사람이 될 필요는 없습니다. 잘되는 습관에만 의지하지 않고 상황에 맞게 강도를 고르는 여유가 더해집니다. ${f3.finale[2]}`,
    `${horizon.through}년의 내가 꺼내 쓸 자산은 통장에만 있지 않을 거예요. 다시 찾는 사람, 설명할 수 있는 실력, 다음에도 버틸 생활이 함께 남습니다.`,
    finalPunch[last.tenGod],
  ]);
  const copy = [...opening, ...transitions.flatMap(t => t.paragraphs), ...editorialSections.flatMap(s => s.paragraphs), ...editorialYears.flatMap(y => y.paragraphs), ...finale];
  return { ...f3, version: MAJOR_OUTLOOK_VERSION, narrativeEdition: DETAIL_NARRATIVE_EDITION, horizon: { ...horizon, transitions }, opening, editorialSections, editorialYears, finale, narrativeAudit: audit, rhythmWarnings: endingWarnings(copy) };
}
