import type { MajorFortuneReportDraft } from "../report-generation/majorFortuneReportDraftTypes";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import type { SajuCalcResult } from "../saju/types";
import type { Evidence } from "./types";
import { buildMajorFortuneOutlook } from "./majorFortuneOutlook";
import { endingWarnings } from "./mbtiNarrative";
import { sentenceSelection } from "./contentRevision";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { interpretCareerContextV3 } from "./careerContextV3";

export const MAJOR_FINAL_VERSION = "major_fortune_v3.0-editorial.5" as const;

const relationClosing: Record<TenGod, string> = {
  비견: "같은 자리에 있어도 내 이름으로 골랐다는 감각이 다르면 하루를 끝내는 표정도 달라집니다.",
  겁재: "일이 끝난 뒤에도 편하게 밥 한 끼 하자고 말할 수 있는지가 함께한 경험의 또 다른 성적표가 됩니다.",
  식신: "내 손을 거친 것을 누군가 자기 일상에 가져가는 장면은 결과물을 넘긴 뒤에도 오래 기억에 남습니다.",
  상관: "끝나고 나서 ‘덕분에 훨씬 편해졌다’는 말을 듣는 쪽이 내가 옳았다는 확인보다 더 시원할 수 있어요.",
  편재: "소개받은 사람의 수보다 다음 대화에서 서로 무엇을 가져올 수 있는지가 연결의 깊이를 보여줍니다.",
  정재: "달력을 다시 펼쳤을 때 예상한 일정 안에 내 저녁도 남아 있다면, 계획이 생활을 돕고 있다는 신호입니다.",
  편관: "긴장이 풀린 뒤에도 계속 휴대전화를 확인하고 있다면, 문제는 끝났는데 마음만 아직 현장에 남아 있을 수 있어요.",
  정관: "내가 자리를 얻는 것만큼 그 자리에 누구의 선택이 달려 있는지도 더 또렷하게 보게 되는 변화입니다.",
  편인: "하던 일과 전혀 상관없어 보이는 메모를 다시 꺼내 읽을 때, 그때의 호기심이 지금의 나를 도울 수도 있습니다.",
  정인: "자료의 첫 페이지보다 내가 직접 남긴 메모에서 더 쓸 만한 답을 찾는다면, 배움이 경험과 만나고 있는 셈입니다.",
};

// Selected annual relation + ten-god context, not a year/fixture-specific copy bank.
const scenes: Record<TenGod, { harmony: string; pressure: string; gift: string }> = {
  비견: {
    harmony: "혼자 골라 시작한 일을 누군가 자기 경험과 연결해 줍니다. 내 방식대로 해보고 싶은 마음을 꺾지 않으면서도 놓친 부분을 보태주는 사람이 반갑죠. 전부 똑같이 생각해서 편한 관계보다 서로 다른 강점을 가지고도 같이 끝낼 수 있는 관계가 눈에 들어옵니다.",
    pressure: "내가 고른 방향을 주변이 바로 이해하지 못할 때 말투가 단단해질 수 있어요. 설명을 부탁받았는데 허락을 받으라는 말처럼 들리는 순간입니다. 스스로 결정할 몫과 함께 쓰는 자원의 경계를 구분하면, 독립심을 지키려고 가까운 사람까지 밀어낼 필요는 줄어듭니다.",
    gift: "내 판단으로 고른 작은 결과가 자신감을 되돌려주는 해입니다. 잘하는 사람을 따라가던 때보다 내가 반복하고 싶은 방식이 선명해져요. 다른 사람의 인정만 기다리지 않고 직접 해본 경험이 다음 선택의 기반으로 남는 것이 이 해의 좋은 패입니다.",
  },
  겁재: {
    harmony: "친구의 제안 하나로 혼자서는 미뤄두었던 일을 같이 시작할 수 있습니다. 실력 좋은 사람을 옆에 두면 괜히 더 잘하고 싶어지는 마음도 살아나요. 끝난 뒤 ‘너 덕분에 여기까지 했다’고 서로 말할 수 있는 경험은 다음 협업의 신뢰가 됩니다.",
    pressure: "시작할 때는 다 같이 신났는데 마감이 가까워지면 서로 기억하는 역할이 달라질 수 있어요. 본인은 빈자리를 메웠다고 생각하고 상대는 자기 몫을 빼앗겼다고 느끼는 식입니다. 가까운 사이라 생략한 대화가 무엇이었는지 보일 때, 사람을 잃지 않고 일을 다시 나눌 여지가 생깁니다.",
    gift: "나 혼자 가진 자원보다 함께할 때 열리는 선택이 많아지는 해입니다. 한 사람이 잘하는 것을 다른 사람이 이어받는 순간 속도가 달라져요. 사람복을 막연한 행운으로 기다리기보다 이미 연결된 사람과 어떤 경험을 같이 남길 수 있는지가 흥미로워집니다.",
  },
  식신: {
    harmony: "가볍게 보여준 결과물을 누군가 자기 일에도 써보고 싶다고 말할 수 있습니다. 내가 재미있어서 다듬던 방식이 다른 사람의 불편을 덜어주는 순간이에요. 혼자 좋아하는 재능과 사람들이 다시 찾는 쓸모가 만날 때 만드는 즐거움도 더 오래 갑니다.",
    pressure: "거의 끝냈다고 생각한 결과에 새 요청이 들어오면 표정부터 굳을 수 있어요. 더 잘 만들고 싶은 마음과 이제는 내 손을 떠났으면 하는 마음이 같이 있습니다. 모든 수정을 내 실력의 시험으로 받기보다 처음 약속한 쓰임이 무엇이었는지 돌아볼 때 완성의 기준이 다시 잡힙니다.",
    gift: "표현운의 좋은 면이 구체적인 반응으로 돌아오기 쉬운 해입니다. 한 번 잘했다는 칭찬보다 ‘이번에도 그 방식으로 해줄 수 있어?’라는 부탁이 더 오래 남아요. 손에 익은 능력에 내 취향까지 담을 수 있어, 잘하는 것과 좋아하는 것이 조금 더 가까워집니다.",
  },
  상관: {
    harmony: "내가 이상하다고 느낀 부분을 다른 사람도 눈여겨보고 있었다는 걸 알게 됩니다. 혼자 투덜대던 질문이 같이 시험해볼 제안으로 바뀌는 순간이에요. 설명을 길게 하는 대신 작게 바꿔본 결과를 같이 보면, 예민하다는 평가 뒤에 가려졌던 개선의 실력이 드러납니다.",
    pressure: "회의에서는 맞는 말을 했는데 끝나고 나면 분위기가 묘할 수 있어요. 내가 고치려던 것은 방식인데 상대는 자기 능력을 평가받았다고 듣는 순간입니다. 바꾼 뒤의 편리함을 먼저 보여주면, 불편을 알아보는 날카로움이 사람을 몰아세우지 않고도 힘을 얻습니다.",
    gift: "표현과 개선의 운을 실제 결과로 꺼내기 좋은 해입니다. 익숙해서 아무도 손대지 않은 불편에 자기 답을 붙일 수 있어요. 아이디어가 많은 사람이라는 인상에서 그 생각을 정말 쓸 수 있게 만드는 사람이라는 평판으로 넘어갈 여지가 있습니다.",
  },
  편재: {
    harmony: "우연히 들은 고민이 내가 아는 기술이나 사람과 이어질 수 있습니다. 좋은 연결은 거창한 소개 자리보다 상대가 무엇 때문에 막혔는지 정확히 들은 대화에서 시작돼요. 거래가 된다면 서로 무엇을 보탰는지 또렷할수록 다음에도 편하게 함께할 수 있습니다.",
    pressure: "제안은 매력적인데 실제 돈이 들어오는 날짜와 내가 먼저 써야 할 자원이 어긋날 수 있어요. 가능성을 크게 보는 눈 때문에 기다리는 비용은 작게 잡기 쉽습니다. 기회를 놓칠까 초조한 순간에도 지금 지킬 생활을 따로 셈할 수 있는 사람이 다음 제안까지 여유 있게 봅니다.",
    gift: "재물운의 좋은 면을 바깥 수요와 연결해볼 해입니다. 이미 가진 능력이 익숙한 자리 밖에서는 다른 값으로 평가될 수 있어요. 모든 기회를 잡는 대신 내가 보탤 수 있는 것이 분명한 제안을 고르면, 넓어진 인맥이 실제 거래와 경험의 자산으로 남습니다.",
  },
  정재: {
    harmony: "작은 약속을 지켜온 사람과 다시 일을 맞추면 처음부터 전부 설명할 필요가 없습니다. 아낀 시간도 남는 자원이죠. 반복 주문이나 꾸준한 역할처럼 다음 달을 그려볼 수 있는 연결이 생길 때 통장의 숫자뿐 아니라 생활의 긴장도 조금 내려갈 수 있습니다.",
    pressure: "예상한 수입과 지출은 맞는데 갑자기 필요한 시간 때문에 계획이 흔들릴 수 있습니다. 숫자에는 없던 돌봄이나 마무리 업무가 내 몫으로 들어오는 장면이에요. 돈을 아끼려고 시간을 끝없이 쓰고 있지는 않은지 볼 때, 성실함을 소모하지 않는 생활의 크기가 보입니다.",
    gift: "축적운은 이번에 더 크게 버는 것만으로 드러나지 않습니다. 다시 쓸 수 있는 자료와 믿고 맡기는 관계, 새지 않는 비용이 차곡차곡 남는 것도 좋은 흐름이에요. 성과를 유지하는 데 드는 수고가 줄어들면 다음 선택에 쓸 돈과 시간도 함께 넓어집니다.",
  },
  편관: {
    harmony: "어려운 일을 맡았을 때 먼저 상황을 알아봐 주는 사람이 생기면 버티는 방식이 달라집니다. 혼자 결론을 내야 할 때와 다른 판단을 빌릴 때를 나눌 수 있어요. 위기에서 만난 호흡은 평소의 친분보다 깊은 신뢰가 되기도 합니다.",
    pressure: "급한 연락이 올 때마다 내가 해결하면 주변은 그 속도를 기본값으로 기억할 수 있어요. 칭찬은 늘었는데 쉬는 시간은 줄어드는 억울함이 생깁니다. 잘 버틴다는 평가와 계속 맡아도 된다는 허락은 같지 않죠. 책임이 커지는 만큼 결정할 수 있는 범위도 같이 보게 되는 해입니다.",
    gift: "막힌 상황에서 판단을 맡기는 신뢰는 자리와 명예의 좋은 재료입니다. 모두가 피한 문제를 다뤄본 경험에는 평소의 실적과 다른 무게가 붙어요. 다만 위기가 끝난 뒤에도 계속 비상근무하듯 살 필요는 없습니다. 맡아낸 결과와 돌아갈 일상을 함께 남길 수 있습니다.",
  },
  정관: {
    harmony: "내가 없는 자리에서도 누군가 ‘그 판단은 믿어도 된다’고 소개해 줄 수 있습니다. 평소의 태도를 지켜본 사람이 다음 역할과 연결해 주는 장면이에요. 인정이 직함으로만 끝나지 않고 함께 결정할 수 있는 사람과 자원이 늘어나는 쪽으로 이어질 때 든든합니다.",
    pressure: "예전에는 원칙을 지키면 충분했던 일이 이제는 서로 다른 사정을 듣고 결정해야 하는 문제가 됩니다. 누구에게나 같은 답을 주는 것이 언제나 공정한 것은 아니라는 고민도 생겨요. 좋은 평판을 지키려고 모든 기대를 수락하기보다 내가 책임질 판단의 기준이 또렷해지는 과정입니다.",
    gift: "자리운과 명예운의 좋은 면을 읽을 수 있는 해입니다. 사람들이 결과뿐 아니라 그 결과를 만든 태도까지 내 이름에 붙이기 시작해요. 남들이 알아주길 기다리던 실력이 중요한 결정에 초대받는 신뢰로 이어진다면, 다음 역할을 고르는 기준도 한층 넓어집니다.",
  },
  편인: {
    harmony: "전혀 다른 분야의 이야기를 듣다가 혼자 붙들던 질문의 답을 찾을 수 있습니다. 남들은 별개로 보는 경험이 내 안에서는 한 줄로 이어지는 재미예요. 관심사를 계속 바꾸는 것처럼 보여도 이전에 배운 것을 새 문제에 가져오는 나만의 연결이 남습니다.",
    pressure: "설명을 하나 들으면 다른 가능성까지 떠올라 머릿속 회의가 길어질 수 있어요. 더 알아야 안심할 것 같은데 자료가 늘수록 고를 길도 많아집니다. 지금 필요한 답과 나중에 파보고 싶은 질문을 나누면, 호기심을 버리지 않으면서도 오늘 할 일에 마음을 놓을 수 있습니다.",
    gift: "탐구와 전문성의 좋은 흐름이 낯선 관심에서 열릴 수 있습니다. 바로 쓸모를 증명하지 못했던 경험이 지금의 문제를 보는 다른 눈이 돼요. 남이 정리한 답을 많이 아는 것보다 자기만의 질문을 오래 품고 실제로 써본 시간이 차이를 만들어갑니다.",
  },
  정인: {
    harmony: "배운 내용을 설명하다가 상대의 질문 덕분에 내가 놓친 부분까지 이해하게 됩니다. 도움을 받는 사람과 주는 사람의 자리가 자연스럽게 오가는 경험이에요. 자료와 조언이 흩어져 있던 때와 달리 내 경험을 붙여 이야기할 수 있을 때, 지식이 오래 가져갈 기반이 됩니다.",
    pressure: "잘 준비해 주고 싶은 마음 때문에 다른 사람의 선택까지 대신 정리하고 있을 수 있어요. 상대는 설명보다 한 번 해볼 시간을 원했을지도 모릅니다. 나 역시 더 배우고 나서 시작하겠다고 미뤄둔 일이 있다면, 이미 아는 것을 작은 경험으로 바꾸는 순간에 이해가 깊어집니다.",
    gift: "학습운의 좋은 면은 새 정보를 받는 데서 끝나지 않습니다. 오래된 경험에 이름을 붙이고 누군가에게 설명할 수 있는 전문성이 남아요. 배움과 도움의 연결을 실제 일에 써보면, 그동안 쌓아둔 기반이 다음 역할을 소개하는 든든한 자산이 됩니다.",
  },
};

/** F4 replay remains frozen; F5 translates only already-selected relation prose. */
export function buildMajorFortuneFinal(base: MajorFortuneReportDraft, packet: MajorFortuneEvidencePacket, facts: readonly Evidence[], calculation: SajuCalcResult, robust = false) {
  const previous = buildMajorFortuneOutlook(base, packet, facts, calculation, robust);
  if (!previous) return null;
  const editorialYears = previous.editorialYears.map(year => {
    if (year.timePosition === "past") return year;
    const scene = scenes[year.tenGod as TenGod];
    const relation = year.evidence.find(label => / (?:육합|삼합|반합|충|형)$/.test(label));
    const returning = year.year === packet.currentYear + 10;
    return { ...year, paragraphs: year.paragraphs.map(paragraph => {
      if (paragraph.includes("보완과 연결")) return returning
        ? `처음 배우던 때와 달리 이제는 어떤 경험을 다시 꺼내 써야 하는지 보입니다. ${scene.gift} 앞서 해본 일의 기록과 그 일을 같이했던 사람에게 다시 연락할 수 있는 관계가 있어, 같은 주제도 훨씬 구체적인 선택으로 돌아옵니다.` : scene.gift;
      if (relation && /의 접점은 서로 다른 경험과 역할|의 긴장도 함께 들어옵니다/.test(paragraph)) {
        const pressure = / (?:충|형)$/.test(relation);
        return `${returning ? "지나온 경험을 나누는 자리에서는, " : ""}${scene[pressure ? "pressure" : "harmony"]} ${relationClosing[year.tenGod as TenGod]}`;
      }
      return paragraph;
    }) };
  });
  if (robust) {
    const work = careerEditorialScenes(packet.userContext, interpretCareerContextV3(packet.userContext.fieldLabel ?? "", true, packet.userContext.lifeStatus));
    const mature: Record<TenGod, string> = {
      비견: "예전에는 혼자 결정했다는 사실이 중요했다면, 이제는 내 기준을 지키면서도 다른 방식을 받아들일 수 있는지가 차이를 만듭니다. 선택을 바꾸는 일이 곧 나를 잃는 것은 아니라는 여유가 독립의 다음 모습입니다.",
      겁재: "처음에는 함께 뛰는 사람의 실력이 자극이었다면, 시간이 지난 뒤에는 서로의 수고를 어떻게 알아보는지가 더 중요해집니다. 앞서려는 마음을 버리기보다 함께 갈 사람에게도 자기 몫의 무대를 남기는 경쟁입니다.",
      식신: "내 손으로 잘 만들던 것에서 다른 사람도 편히 쓸 수 있는 방식으로 관심이 넓어집니다. 매번 새 결과를 증명하는 재미에, 이미 만든 것이 오래 쓰이는 기쁨이 더해지는 장면입니다.",
      상관: "예전에는 문제를 발견하면 바로 말하고 싶었다면, 이제는 무엇을 바꿨을 때 실제 생활이 나아지는지까지 보게 됩니다. 반짝이는 한마디에서 함께 시도할 수 있는 제안으로 표현의 힘이 자랍니다.",
      정재: "오래 지켜온 방식 중에는 안정의 이유가 된 것도, 이제는 손이 너무 많이 가는 것도 있을 수 있습니다. 축적의 다음 단계는 전부 붙잡는 일이 아니라 앞으로도 나를 받쳐줄 것을 구분하는 일입니다.",
      편재: "많은 가능성을 만났던 경험이 이제는 제안을 거르는 눈으로 남습니다. 새롭다는 이유만으로 흥미로웠던 때와 달리, 내가 가진 것과 상대의 필요가 어디서 만나는지 더 구체적으로 묻게 됩니다.",
      편관: "예전에는 급한 상황을 내가 정리하는 것으로 존재감을 보였다면, 이제는 급해지기 전에 누가 무엇을 결정할지 나누는 힘이 중요해집니다. 가장 바쁜 사람이 아니라 다른 사람도 판단할 수 있게 만드는 사람으로 역할이 달라지는 장면입니다.",
      정관: "반듯한 결과로 얻은 신뢰를 다음 사람에게도 건넬 수 있는지 보게 됩니다. 내가 지켜온 기준을 그대로 요구하기보다 그 기준이 왜 필요한지 설명할 때, 직함 밖에도 남는 영향력이 생깁니다.",
      편인: "한때 혼자만 재미있어하던 질문 중 어떤 것이 실제 문제를 보는 눈이 됐는지 구별할 수 있습니다. 관심이 많다는 사실보다 서로 다른 경험 사이에 나만의 지도를 갖게 됐다는 점이 달라집니다.",
      정인: "도움을 받으며 익힌 것이 누군가의 첫 시도를 편하게 해주는 기반으로 바뀝니다. 모든 답을 알려주는 사람보다 상대가 자기 답을 찾을 때 곁에서 맥락을 짚어주는 사람으로 배움의 쓰임이 깊어집니다.",
    };
    const select = sentenceSelection();
    const distinct = (ps: readonly string[]) => ps.map(select).filter(Boolean);
    const opening = distinct(previous.opening);
    const horizon = { ...previous.horizon!, transitions: previous.horizon!.transitions.map(t => ({ ...t, paragraphs: distinct(t.paragraphs) })) };
    const editorialSections = previous.editorialSections.map(s => ({ ...s, paragraphs: distinct(s.paragraphs) }));
    const years = editorialYears.map(y => ({ ...y, paragraphs: distinct([...y.paragraphs, ...(y.year === packet.currentYear + 10 ? [mature[y.tenGod as TenGod], `${work.handoff}. 오랫동안 직접 해온 방식이 다른 사람의 판단에도 쓰일 때, 다음 시간을 전부 내 손으로 채우지 않아도 된다는 여유가 남습니다.`] : [])]) }));
    const finale = distinct(previous.finale);
    return { ...previous, version: MAJOR_FINAL_VERSION, opening, horizon, editorialSections, editorialYears: years, finale,
      rhythmWarnings: endingWarnings([...opening, ...horizon.transitions.flatMap(t => t.paragraphs), ...editorialSections.flatMap(s => s.paragraphs), ...years.flatMap(y => y.paragraphs), ...finale]) };
  }
  return { ...previous, version: MAJOR_FINAL_VERSION, editorialYears,
    rhythmWarnings: endingWarnings([...previous.opening, ...previous.horizon!.transitions.flatMap(t => t.paragraphs), ...previous.editorialSections.flatMap(s => s.paragraphs), ...editorialYears.flatMap(y => y.paragraphs), ...previous.finale]) };
}
