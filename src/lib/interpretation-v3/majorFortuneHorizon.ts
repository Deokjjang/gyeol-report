import { buildMajorFortuneDecadeReading, type MajorDecadeYear } from "../report-knowledge/majorFortuneDecadeReading";
import { getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import type { FiveElement, TenGod } from "../report-knowledge/annualFortuneTypes";
import type { MajorFortuneCycle, MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import type { MajorFortuneReportDraft } from "../report-generation/majorFortuneReportDraftTypes";
import type { CustomerDayunCycle } from "../saju/customerDayun";
import type { SajuCalcResult } from "../saju/types";
import { buildMajorFortuneV3, type MajorFortuneV3Draft, type MajorFortuneV3Section, type MajorFortuneV3Year } from "./majorFortuneEditorial";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { interpretCareerContextV3 } from "./careerContextV3";
import { narrativeRhythm, endingWarnings, selectNarrativeTraits, type NarrativeAudit } from "./mbtiNarrative";
import { NARRATIVE_EDITION } from "./narrativeEdition";
import type { Domain, Evidence } from "./types";

export const MAJOR_HORIZON_VERSION = "major_fortune_v3.0-editorial.3" as const;
export type HorizonCycle = { index: number; ganji: string; tenGod: TenGod; elements: readonly string[]; startYear: number; endYear: number; theme: string };
export type HorizonTransition = {
  year: number; dateLabel: string; startSolarKst: string | null; startSolarRange: CustomerDayunCycle["startSolarRange"];
  before: HorizonCycle; after: HorizonCycle; title: string; paragraphs: readonly string[];
};
export type MajorHorizon = {
  from: number; through: number; currentYear: number; evaluatedAtKst: string | null;
  activeCycle: HorizonCycle | null; transitions: readonly HorizonTransition[];
  rows: readonly { year: number; cycle: HorizonCycle; beforeCycle: HorizonCycle | null; transitionDate: string | null }[];
};
const elements: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
type Theme = { domain: Domain; focus: string; title: string; past: string; paragraphs: readonly string[]; overuse: string; closing: string };
// Ten stem relationships give ten different protagonists, not ten substitutions
// in one work/money/advice template. Dates and relation facts are calculated below.
const themes: Record<TenGod, Theme> = {
  비견: { domain: "identity", focus: "내 이름으로 선택하는 것", title: "남의 속도에서 내려와 내 이름을 붙이는 해", past: "누구의 허락보다 내 납득이 중요했던 때를 떠올려보면 좋겠어요. 같이하던 일에서도 ‘나는 어떻게 하고 싶었지?’라는 질문이 남았을 수 있습니다.",
    paragraphs: ["다른 사람이 잘하는 방법을 그대로 따라가는 일이 전보다 답답해질 거예요. 틀린 길이라서가 아니라, 내가 결정했다는 감각이 필요해지는 쪽입니다. 작더라도 시작과 마무리를 직접 고른 일에 유난히 애착이 붙습니다.", "친구의 소식이나 동료의 성과가 예전과 다르게 들릴 수 있어요. 축하하면서도 ‘나는 어디쯤이지?’ 하고 내 위치를 다시 보는 겁니다. 경쟁에서 이기는 것보다 무엇을 내 기준으로 삼을지가 더 오래 남는 질문입니다.", "혼자 한다는 말과 혼자 감당한다는 말은 다릅니다. 내 선택을 존중해 주는 사람과는 오히려 협력이 편해져요. 결정권은 지키되 도움까지 사양하지 않는 모습이 이 해의 독립심을 훨씬 단단하게 만듭니다."],
    overuse: "내 방식이 분명해졌다는 이유로 다른 방식까지 틀렸다고 여기면, 독립심이 외로움으로 바뀝니다.", closing: "내 이름을 붙일 선택은 남의 박수보다 오래 갑니다." },
  겁재: { domain: "relationship", focus: "함께 움직일 사람과 내 몫을 가리는 것", title: "같이 벌인 일, 마지막에도 같이 책임질까요", past: "사람과 같이 움직여 일이 커졌던 장면이 있었나요? 그때 즐거웠던 연결과 혼자 마무리했던 부담을 나란히 떠올리면 이 해의 결이 선명해집니다.",
    paragraphs: ["혼자였다면 지나쳤을 제안이 누군가의 한마디로 재미있어집니다. 같이 배우고, 같이 만들고, 함께 나가보자는 말에 에너지가 붙는 해예요. 사람이 늘어나는 만큼 선택의 크기도 달라집니다.", "문제는 시작할 때 다들 열정적이었다는 겁니다. 마무리할 때도 같은 인원이 남아 있는지는 다른 이야기죠. 친구와의 여행 정산처럼 작은 일에서도 기여와 책임을 보는 눈이 또렷해질 수 있습니다.", "실력이 좋은 사람을 만나면 편안함보다 승부욕이 먼저 켜지기도 해요. 그 자극은 묻어뒀던 목표를 다시 꺼내는 힘입니다. 상대를 이겨야만 내 성장이 증명되는 건 아니라는 여유까지 있으면 더 재미있게 멀리 갑니다."],
    overuse: "의리로 맡은 일에 이름과 몫이 빠지면, 사람은 남아도 내 여유가 먼저 사라집니다.", closing: "판을 키울 사람과 판을 끝까지 지킬 사람을 함께 보세요." },
  식신: { domain: "career", focus: "좋아하는 것을 결과로 남기는 것", title: "생각하던 것을 꺼내놓으면 실력이 보입니다", past: "직접 만들거나 설명하면서 자신감이 붙었던 경험을 돌아볼 만합니다. 큰 선언보다 꾸준히 손댄 일이 무엇을 남겼는지 보는 해였어요.",
    paragraphs: ["머릿속에서만 좋았던 생각이 눈앞의 결과로 나오기 시작할 때 재미가 붙어요. 누가 시켜서 끝낸 것보다 내가 궁금해서 한 번 더 다듬은 일에서 색깔이 드러납니다. ‘나 이거 꽤 좋아하네’라는 발견이 성과보다 먼저 올 수도 있습니다.", "이 해의 표현운은 거창한 무대만 뜻하지 않습니다. 설명이 쉬워졌다는 말, 다시 써보고 싶다는 반응, 내가 만든 것을 누군가 자기 생활에 가져가는 경험도 좋은 결과예요. 손에 익은 재능에 사람의 반응이 붙습니다.", "취미와 일의 경계가 흥미로워지는 한편, 재미있어서 맡은 일이 저녁까지 따라올 수 있어요. 즐거움에는 체력 계산서가 늦게 붙죠. 무언가 남기는 기쁨과 쉬어도 괜찮다는 감각이 함께 있어야 다음 결과도 오래 이어집니다."],
    overuse: "재미있는 일이 늘었다고 하루의 시간이 같이 늘지는 않습니다.", closing: "좋아하는 마음이 손을 거치면, 남도 알아보는 실력이 됩니다." },
  상관: { domain: "career", focus: "익숙한 답을 바꾸고 내 목소리를 내는 것", title: "‘원래 그래요’가 유난히 거슬리는 해", past: "기존 방식에 질문을 던졌거나, 하고 싶은 말을 오래 참기 어려웠던 순간이 있었을 수 있습니다. 무엇을 깨뜨렸는지보다 그 뒤에 어떤 대안을 남겼는지가 핵심입니다.",
    paragraphs: ["전에는 그냥 넘긴 비효율이 자꾸 눈에 걸릴 거예요. 설명을 다 듣기도 전에 더 짧은 경로가 보이고, ‘왜 아직 이렇게 하지?’라는 말이 목 끝까지 올라옵니다. 바꾸고 싶은 마음이 곧 창의력의 출발점이 되는 시기입니다.", "표현의 힘이 커질 때는 조용히 잘하던 사람도 자기 의견에 이름을 붙이고 싶어집니다. 발표나 제안에서 남이 만든 말보다 내가 발견한 문제를 이야기할 때 존재감이 선명해져요. 새로움은 장식보다 정확한 질문에서 나옵니다.", "다만 맞는 말을 했는데 분위기가 얼어붙는 억울한 장면도 생길 수 있죠. 사람은 수정안만 듣는 게 아니라 자기 노력을 어떻게 평가했는지도 같이 듣습니다. 비판 뒤에 직접 만들어 보여주는 결과가 붙으면 같은 말의 무게가 달라집니다."],
    overuse: "틀린 곳을 찾는 재미가 만든 사람을 평가하는 습관이 되면, 좋은 아이디어가 설 자리가 좁아집니다.", closing: "세상을 고치고 싶은 말에는, 직접 만든 답이 가장 강한 뒷받침입니다." },
  편재: { domain: "money", focus: "밖의 기회와 자원을 연결하는 것", title: "기회가 많아질수록 고르는 눈이 돈이 됩니다", past: "새 사람이나 바깥 제안이 선택을 넓혔던 때를 짚어볼 수 있습니다. 이야기의 규모와 실제로 손에 남은 몫이 같았는지도 함께 보이는 해입니다.",
    paragraphs: ["돈을 보는 시야가 월별 잔액 바깥으로 넓어질 거예요. 사람의 연결, 움직이는 시장, 내 기술을 다른 곳에 쓰는 방법까지 자원으로 보입니다. 가만히 기다리기보다 밖에서 대화할 때 힌트가 구체적인 얼굴을 갖습니다.", "재물의 주제가 들어오는 해에는 큰 제안이 유난히 매력적으로 들립니다. 그러나 ‘될 것 같은 돈’과 ‘돌아온 돈’의 표정은 다르죠. 계약 규모에 설레던 마음이 정산 일정까지 챙기기 시작하면 기회를 다루는 감각도 한 단계 자랍니다.", "좋은 인연이 전부 거래가 될 필요는 없어요. 얻을 것이 없어도 나누던 대화가 나중에 전혀 다른 길을 열기도 합니다. 관심의 폭을 넓히되 모든 제안을 같은 열정으로 붙잡지 않는 모습이 이 해의 여유입니다."],
    overuse: "잡을 수 있는 기회가 많아져도 감당할 수 있는 손실까지 커진 것은 아닙니다.", closing: "크게 보이는 기회보다, 내 손으로 끝까지 돌릴 수 있는 기회를 남기세요." },
  정재: { domain: "money", focus: "돈과 생활을 반복 가능한 구조로 굳히는 것", title: "통장보다 먼저 생활의 구조가 단단해집니다", past: "수입과 지출, 약속과 생활의 순서를 현실적으로 맞추려 했던 시기였을 수 있습니다. 사소한 반복이 쌓여 남긴 안정감을 돌아보면 좋겠어요.",
    paragraphs: ["한 번 크게 해내는 일보다 다음 달에도 이어갈 수 있는지가 중요해질 거예요. 돈만이 아니라 시간과 체력에도 고정비가 있다는 걸 더 생생하게 느낍니다. 유지할 수 있는 선택을 고르는 감각이 생활의 중심으로 들어옵니다.", "축적의 좋은 면은 요란하지 않아요. 자주 새는 비용 하나가 줄고, 반복하던 일이 빨라지고, 이미 해본 경험 덕분에 시행착오를 덜 쓰는 식입니다. 남은 돈뿐 아니라 덜 낭비한 시간도 분명한 내 몫입니다.", "주변에서 새 기회를 이야기해도 ‘그래서 얼마나 오래 가는데?’가 먼저 떠오를 수 있습니다. 소심해졌다기보다 지속 가능성을 보는 눈이 커진 거죠. 다만 작은 낭비를 막느라 큰 즐거움까지 지우면 안정이 아니라 답답함이 남습니다."],
    overuse: "계획대로 흘러야 마음이 놓이는 습관이 가까운 사람의 작은 즉흥성까지 단속하게 만들 수 있습니다.", closing: "오래 남는 돈은, 오래 버틸 수 있는 생활과 같은 편입니다." },
  편관: { domain: "leadership", focus: "압박 속에서 결정을 맡는 것", title: "일이 커지는데 내 몫까지 흐려지면 곤란합니다", past: "책임이 몰리거나 빠르게 판단해야 했던 장면을 떠올려볼 만합니다. 얼마나 견뎠는지만큼 무엇까지 내 일로 받아들였는지도 돌아보는 해입니다.",
    paragraphs: ["모두가 결정을 미루는 순간 결국 내 쪽을 보는 장면이 또렷해질 수 있습니다. 급할수록 판단이 빨라지고, 힘든 문제일수록 존재감이 살아나는 쪽이에요. 압박이 능력을 꺼내는 무대가 되지만 편안한 무대는 아닙니다.", "‘이것도 할 수 있죠?’라는 말이 칭찬처럼 들렸다가 부담으로 바뀔 때가 있죠. 내가 잘한다는 사실과 내가 전부 해야 한다는 결론 사이에는 꽤 큰 틈이 있습니다. 누가 최종 결정을 내리고 누가 결과를 책임지는지가 중요한 해예요.", "평소 온화한 사람도 지켜야 할 선 앞에서는 말투가 단단해질 수 있습니다. 주변은 갑자기 달라졌다고 느껴도 본인에게는 더 미룰 수 없는 결정입니다. 강해지는 모습에는 앞으로 나서는 용기와 아닌 것을 거절하는 용기가 같이 들어 있습니다."],
    overuse: "위기를 해결할수록 새 위기가 내 앞으로 배달되는 구조라면, 능력보다 회복이 먼저 바닥납니다.", closing: "어려운 일을 맡을 힘과, 내 일이 아닌 것을 돌려줄 힘은 한 쌍입니다." },
  정관: { domain: "career", focus: "신뢰를 자리와 역할로 바꾸는 것", title: "잘하는 사람에서 판단을 맡기는 사람으로", past: "약속을 지키는 태도나 일의 기준으로 신뢰를 받았던 순간을 돌아볼 수 있습니다. 눈에 띄는 한 번보다 반복해서 보여준 모습의 무게가 컸던 시기입니다.",
    paragraphs: ["결과를 잘 내는 사람에서 ‘이 사람에게 맡겨도 되겠다’는 사람으로 시선이 옮겨갈 거예요. 잘해온 방식에 이름과 역할이 붙는 주제입니다. 인정은 칭찬보다 중요한 결정을 물어오는 형태로 다가오기도 합니다.", "자리운의 좋은 쓰임은 직함을 크게 보이는 데 있지 않습니다. 무엇을 판단할 수 있고 누구와 약속을 맺는지가 분명해지는 데 있어요. 평판과 실제 역할이 만나는 순간, 이미 쌓은 신뢰가 새로운 선택권이 됩니다.", "공식적인 평가 앞에서는 평소보다 나를 엄격하게 채점할 수도 있죠. 작은 실수 하나가 전체 능력을 설명하는 것처럼 느껴질 때가 있습니다. 단정한 겉모습 뒤에서 애쓰는 나까지 보이는 사람이 곁에 있으면 책임의 체감도 한결 달라집니다."],
    overuse: "실망시키지 않으려는 마음이 모든 요구를 받아주는 습관으로 굳지 않게 봐야 합니다.", closing: "내가 지켜온 기준이, 이제는 내 자리를 지켜줄 차례입니다." },
  편인: { domain: "study", focus: "남들이 지나친 단서를 자기 언어로 엮는 것", title: "딴생각인 줄 알았는데 다음 길의 힌트입니다", past: "혼자 파고든 관심이나 남다른 관점이 남았던 때를 떠올려볼 수 있습니다. 당장 쓸 곳이 없어 보였던 질문이 무엇과 연결됐는지가 이 해의 재미입니다.",
    paragraphs: ["다들 이해했다고 넘어간 부분에서 혼자 질문이 남습니다. 당장 설명하기 어려워도 머릿속에서 조각들이 계속 맞물릴 거예요. 이미 알려진 답보다 그 답이 만들어진 원리에 관심이 가는 시기입니다.", "취미로 읽던 분야가 일의 문제와 뜻밖에 이어질 수 있어요. 서로 멀어 보이는 것을 연결하는 탐구력이 살아납니다. 남보다 빨리 외우는 경쟁보다 내가 이해한 구조를 그려보는 시간이 더 짜릿하게 느껴집니다.", "단점은 생각의 탭이 너무 많이 열리는 겁니다. 하나를 해결하려다 읽어야 할 것이 셋으로 늘어나죠. 아주 작은 결과 하나를 밖으로 꺼냈을 때, 머릿속에서는 안 보이던 다음 질문이 분명해집니다."],
    overuse: "생각이 깊어진 것과 결정을 미룬 것을 스스로 구분하지 못하면 탐구가 대기실이 됩니다.", closing: "남들이 넘긴 질문 하나가, 내 다음 길의 입구일 수 있습니다." },
  정인: { domain: "study", focus: "배운 것과 도움을 오래 쓸 기반으로 남기는 것", title: "배움이 쌓이면 부탁받는 질문도 달라집니다", past: "배우거나 도움받은 내용을 내 방식으로 정리했던 때를 돌아볼 수 있습니다. 그때 남긴 기록과 설명이 지금 어떤 기반이 됐는지 확인하는 해예요.",
    paragraphs: ["새 지식을 많이 아는 것보다 복잡한 것을 자기 말로 설명하는 일이 중요해질 거예요. 정리하다 보니 이미 알고 있던 경험까지 한 줄로 이어집니다. 배움이 쌓이면 누군가 나에게 가져오는 질문의 수준도 달라집니다.", "학습운의 좋은 면은 혼자 모든 시행착오를 겪지 않아도 된다는 데 있어요. 좋은 설명, 제대로 된 자료, 경험 있는 사람의 관점이 시간을 줄여줍니다. 받은 도움을 내 손으로 써본 흔적이 전문성으로 남습니다.", "준비를 좋아하는 사람은 시작하기 직전 참고자료를 한 번 더 찾습니다. 아직 모르는 것이 보인다는 건 배웠다는 뜻이기도 하죠. 완벽히 알게 된 뒤가 아니라, 아는 것을 써보는 사이에 다음 이해가 자랍니다."],
    overuse: "안전한 준비가 너무 편해지면 이미 할 수 있는 일도 계속 연습 중으로 남습니다.", closing: "배운 것을 꺼내 쓰는 순간, 지식은 내 편이 됩니다." },
};

const decadePortrait: Record<TenGod, string> = {
  비견: "어울리는 사람이나 맡는 일이 달라져도 마지막 선택에 내 납득이 남아 있기를 바라게 됩니다. 예전에는 좋은 기회인지 물었다면 이제는 그 안에서 내가 어떤 사람으로 살게 될지를 같이 묻게 돼요.",
  겁재: "혼자 할 수 있는 양보다 누구와 무엇을 엮을 수 있는지가 중요해집니다. 사람을 통해 판이 커지는 재미가 있지만, 내 이름 없이 커진 책임에는 예전만큼 쉽게 웃어넘기기 어려워져요.",
  식신: "한 번 잘했다는 반응보다 다시 찾는 사람이 생겼을 때 기분이 더 오래 갑니다. 내가 좋아한 방식이 다른 사람에게도 쓸모가 있다는 확인이 쌓이는 시기예요. 머릿속 계획보다 손에 남은 결과가 나를 설명하기 시작합니다.",
  상관: "주어진 일을 잘하는 것만으로는 아쉬워집니다. 낡은 방식을 바꾸고 내 관점이 결과에 반영됐을 때 성취감이 커져요. 예전의 능력이 답을 빨리 찾는 것이었다면, 이제는 질문 자체를 바꾸는 데에도 쓰입니다.",
  편재: "한 자리에서 익힌 능력을 다른 곳에 연결할 방법이 눈에 들어옵니다. 사람과 시장을 만나며 기회의 크기를 가늠하는 시간이 늘어요. 선택지가 많아질수록 무엇을 포기할지도 실력의 일부가 됩니다.",
  정재: "성과 하나를 더 올리는 것보다 그 성과가 다음 달에도 돌아오는지가 신경 쓰입니다. 고객과 시간과 돈이 한 번의 열정에만 기대지 않고 이어질 구조를 보고 싶어져요. 벌이는 힘에 남기는 힘을 붙이는 변화입니다.",
  편관: "내가 감당할 수 있는 크기를 새로 확인하는 시기입니다. 예전 같으면 피해 갔을 문제 앞에서도 판단을 맡게 되지만, 강해진 만큼 쉬는 법까지 단단해져야 생활이 버텨요.",
  정관: "사람들이 나를 믿는 이유가 단순한 실력에서 태도와 기준으로 넓어집니다. 예전에는 결과로 설명했다면 이제는 중요한 일을 어떤 선에서 결정하는지도 나를 소개하는 언어가 돼요.",
  편인: "남들이 원하는 답과 내가 궁금한 답 사이의 거리가 더 잘 보입니다. 그 간격을 혼자 오래 들여다본 시간이 독창적인 관점으로 남아요. 엉뚱해 보이던 관심도 하나의 전문성으로 이어갈 길이 생깁니다.",
  정인: "새로 배운 것을 모으기만 하던 단계에서, 이미 겪은 일까지 이해하는 단계로 넘어갑니다. 경험에 이름을 붙이고 누군가에게 설명할 때 자기 기반이 더 단단해져요. 도움을 받는 사람에서 관점을 나누는 사람으로 자라갑니다.",
};
function annualWorkScene(god: TenGod, scenes: ReturnType<typeof careerEditorialScenes>): string | null {
  const lines: Partial<Record<TenGod, string>> = {
    식신: `${scenes.craft}에는 과정 자체를 즐기는 힘이 살아납니다. 익숙한 일을 한 번 더 다듬고 싶은 마음이 쌓이면, 결과에도 내가 좋아하는 방식이 보이기 시작해요.`,
    상관: `${scenes.conversation}에는 듣기 좋은 설명보다 바꿔야 할 지점을 먼저 말하고 싶어집니다. 제안이 강해지는 만큼 상대가 지켜온 사정까지 보이면 설득의 폭도 넓어져요.`,
    정관: `${scenes.recognition}에는 단순한 칭찬보다 다음 판단을 맡겨도 된다는 신뢰가 담겨 있습니다. 잘해온 방식이 역할과 보상에 어떻게 반영되는지도 눈여겨볼 때예요.`,
    편관: `${scenes.pressure}에는 평소의 실력이 압축되어 드러납니다. 빠르게 수습한 덕분에 별일 아니었던 것처럼 보일 수 있지만, 사실 그 무사함에도 누군가의 판단이 들어 있어요.`,
    정인: `${scenes.handoff}에는 배운 것이 얼마나 자기 언어가 되었는지 드러납니다. 남을 이해시키다가 오히려 내 경험의 공통점을 새로 발견하기도 하죠.`,
    편인: `${scenes.learning}에는 따로 알고 있던 정보가 뜻밖의 한 줄로 이어집니다. 더 많이 외우기보다 다른 연결을 찾아낸 기쁨이 오래 남아요.`,
  };
  return lines[god] ?? null;
}
const pressureTitles: Record<TenGod, string> = {
  비견: "내 선택을 지키되 혼자 버티지는 않을 것", 겁재: "같이 커진 판에서 내 몫이 흐려지기 전에", 식신: "결과는 늘어나는데 일정이 따라오지 못할 때",
  상관: "답은 보이는데 사람의 속도가 따라오지 않을 때", 편재: "기회를 늘리기 전에 감당할 범위를 봅니다", 정재: "지키려던 생활에 새 변수가 들어오는 해",
  편관: "버티는 실력만으로 넘기기에는 일이 커집니다", 정관: "반듯한 기준과 달라진 현실 사이에서", 편인: "생각이 많아질수록 작은 실행이 중요합니다", 정인: "더 준비할지, 배운 것을 써볼지 갈리는 해",
};

function cycleView(packet: MajorFortuneEvidencePacket, cycle: MajorFortuneCycle): HorizonCycle {
  const tenGod = getTenGodForStemPair(packet.dayMaster, cycle.stem);
  return { index: cycle.index, ganji: cycle.ganji, tenGod, elements: [...new Set([cycle.stemElement, cycle.branchElement])].map(e => elements[e]), startYear: cycle.startYear, endYear: cycle.endYear, theme: themes[tenGod].focus };
}
function boundaryLabel(cycle: CustomerDayunCycle): string {
  return cycle.startSolarKst ? `${cycle.startSolarKst.slice(0, 10)} ${cycle.startSolarKst.slice(11, 16)} 한국시간`
    : `${cycle.startSolarRange.earliestKst.slice(0, 16).replace("T", " ")}~${cycle.startSolarRange.latestKst.slice(0, 16).replace("T", " ")} 한국시간`;
}
const godFeature: Record<TenGod, string> = { 비견: "bijian", 겁재: "jie_cai", 식신: "shi_shen", 상관: "shang_guan", 편재: "pian_cai", 정재: "zheng_cai", 편관: "qi_sha", 정관: "zheng_guan", 편인: "pian_yin", 정인: "zheng_yin" };
function periodFact(god: TenGod, period: string, scope: "major" | "annual"): Evidence {
  const id = `${scope}:${period}:ten-god:${god}`;
  return { id, featureId: `ten_god_${godFeature[god]}`, kind: "ten_god", subject: "person", scope, period, value: god,
    sourceRefs: [`annualFortuneYearRules:getTenGodForStemPair:${period}`], lineage: [id], certainty: "confirmed", salience: "direct", domains: [themes[god].domain] };
}
function elementChange(packet: MajorFortuneEvidencePacket, cycle: MajorFortuneCycle): string {
  const selected = [...new Set([cycle.stemElement, cycle.branchElement])], names = selected.map(e => elements[e]).join("·");
  const filling = selected.filter(e => packet.natalLabels.includes(`${elements[e]} 부족`));
  const heavy = selected.filter(e => packet.natalLabels.includes(`${elements[e]} 과다`));
  const images: Record<FiveElement, string> = { wood: "관심 밖으로 한 걸음 뻗어보는 시도", fire: "생각을 밖으로 드러내고 반응을 얻는 일", earth: "생활을 버틸 기반과 반복 가능한 약속", metal: "남길 것과 덜어낼 것을 구분하는 판단", water: "정보를 모으고 흐름을 길게 읽는 시간" };
  return `${names}의 성질이 배경에 더해지며 ${selected.map(e => images[e]).join(", ")}에 무게가 실립니다. ${filling.length ? `원국에서 약했던 ${filling.map(e => elements[e]).join("·")} 쪽을 보완하는 흐름이라, 익숙하지 않던 방식도 선택지로 들어와요.` : ""}${heavy.length ? `이미 강한 ${heavy.map(e => elements[e]).join("·")}까지 겹칩니다. 잘하던 방식을 더 세게 쓰는 것과 필요한 곳에 쓰는 것은 달라요.` : ""}`.trim();
}

/** Reuses canonical cycle/year calculators. This is a view window and prose
 * composition, not a new calendar, luck score or persistence contract. */
export function buildMajorFortuneHorizon(base: MajorFortuneReportDraft, packet: MajorFortuneEvidencePacket, facts: readonly Evidence[], calculation: SajuCalcResult, futureYears: 6 | 10 = 6): MajorFortuneV3Draft | null {
  const cycles = packet.customerDayun?.cycles;
  if (!cycles?.length) return null;
  const from = packet.currentYear - 3, through = packet.currentYear + futureYears;
  const cycleFor = (year: number) => cycles.find(c => c.startYear <= year && year <= c.endYear);
  if (!cycleFor(from) || !cycleFor(through)) return null;
  const frozen = buildMajorFortuneV3(base, packet);
  const selected = cycleFor(packet.currentYear)!;
  const active = cycles.find(c => c.index === packet.dayunSelection?.activeCycleAtEvaluation) ?? null;
  const nowCycle = active ?? selected, now = cycleView(packet, nowCycle), work = interpretCareerContextV3(packet.userContext.fieldLabel ?? "");
  const scenes = careerEditorialScenes(packet.userContext, work), used = new Set<string>(), audit: NarrativeAudit[] = [];
  const trait = (domain: Domain, section: string, signals: readonly Evidence[]) => {
    const found = selectNarrativeTraits({ product: "major_fortune", domain, section, mbti: packet.mbtiBasis.type ?? "", selectedSignals: signals,
      context: { lifeStatus: packet.userContext.lifeStatus, relationshipStatus: packet.userContext.relationshipStatus ?? undefined }, used })[0];
    if (!found) return [];
    used.add(found.evidenceId);
    const mbti = facts.find(f => f.featureId === found.evidenceId);
    audit.push({ section, subject: "person", traitId: found.evidenceId, evidenceRefs: [...found.matchedEvidence, ...(mbti ? [mbti.id] : [])], sourceRefs: found.sourceRefs, kind: found.kind });
    return [found.text];
  };
  const transitions: HorizonTransition[] = cycles.filter(c => c.startYear >= from && c.startYear <= through).flatMap(after => {
    const before = cycles.find(c => c.index === after.index - 1); if (!before) return [];
    const a = cycleView(packet, before), b = cycleView(packet, after), ahead = active ? after.index > active.index : after.startYear >= packet.currentYear;
    return [{ year: after.startYear, dateLabel: boundaryLabel(after), startSolarKst: after.startSolarKst, startSolarRange: after.startSolarRange,
      before: a, after: b, title: `${a.theme}에서, ${b.theme}으로`, paragraphs: narrativeRhythm([
        `${a.ganji}의 장에서 중요했던 것은 ${a.theme}입니다. ${b.ganji}로 넘어가${ahead ? "면" : "며"} ${b.theme}${ahead ? "에 마음이 더 기울 거예요" : "에 무게가 옮겨온 흐름입니다"}. 잘하던 것을 버리는 변화보다, 같은 능력으로 무엇을 남길지 달라지는 변화에 가깝습니다.`,
        `${scenes.next}에는 ${ahead ? "지금까지 해낸 결과만 보는 대신" : "지나온 결과를 되짚으며"} 그 경험을 어떤 크기와 방식으로 이어갈지 묻게 됩니다. ${decadePortrait[b.tenGod]}`,
        elementChange(packet, after),
        ...trait(themes[b.tenGod].domain, `transition-${after.startYear}`, [periodFact(b.tenGod, after.ganji, "major")]),
        `돈과 사람에서도 무게중심이 바뀝니다. ${b.tenGod.includes("재") ? "넓힌 기회를 실제로 회수하고 생활에 남길 몫이 중요해져요. 관계에서도 말이 잘 통하는 것만큼 약속이 어떻게 이어지는지를 보게 됩니다." : b.tenGod.includes("관") ? "내가 맡는 판단의 크기에 보상과 결정권이 따라오는지가 중요해집니다. 사람에게도 호감만이 아니라 서로 무엇을 맡길 수 있는지를 보게 돼요." : b.tenGod.includes("인") ? "돈을 쓰는 목적이 당장의 효과에서 오래 쓸 실력으로 옮겨갑니다. 답을 대신 정해주는 사람보다 생각의 폭을 넓혀주는 사람의 가치가 커져요." : "내가 해낸 것의 쓸모를 알아보는 사람과 연결되는 일이 중요해집니다. 돈도 관계도 한 번의 반응보다 다시 이어지는 방식에서 차이가 나요."}`,
        themes[b.tenGod].overuse,
      ]) }];
  });
  const rows = Array.from({ length: futureYears + 4 }, (_, i) => {
    const year = from + i, cycle = cycleFor(year)!;
    const previous = year === cycle.startYear ? cycles.find(c => c.index === cycle.index - 1) : undefined;
    return { year, cycle: cycleView(packet, cycle), beforeCycle: previous ? cycleView(packet, previous) : null, transitionDate: previous ? boundaryLabel(cycle) : null };
  });
  const horizon: MajorHorizon = { from, through, currentYear: packet.currentYear, evaluatedAtKst: packet.dayunSelection?.evaluatedAtKst ?? null, activeCycle: active ? cycleView(packet, active) : null, transitions, rows };
  const yearFacts = new Map<number, MajorDecadeYear>();
  for (const cycle of cycles.filter(c => c.endYear >= from && c.startYear <= through)) {
    const year = Math.max(cycle.startYear, Math.min(packet.currentYear, cycle.endYear));
    const reading = buildMajorFortuneDecadeReading({ ...packet, currentCycle: cycle, currentYear: year,
      majorTenGod: { ...packet.majorTenGod, stemTenGod: getTenGodForStemPair(packet.dayMaster, cycle.stem) },
      previousCycle: cycles.find(c => c.index === cycle.index - 1), nextCycle: cycles.find(c => c.index === cycle.index + 1) });
    reading.years.forEach(y => yearFacts.set(y.year, y));
  }
  const editorialYears: MajorFortuneV3Year[] = rows.map(row => {
    const y = yearFacts.get(row.year)!, theme = themes[y.tenGod], current = y.year === packet.currentYear, past = y.year < packet.currentYear;
    const pressure = [...y.cycleRelations, ...y.natalRelations].find(r => r.type === "충" || r.type === "형");
    const harmony = [...y.cycleRelations, ...y.natalRelations].find(r => r.type === "육합" || r.type === "삼합" || r.type === "반합");
    const fills = [y.stemElement, y.branchElement].some(e => packet.natalLabels.includes(`${elements[e]} 부족`));
    const positive = !pressure && (fills || !!harmony);
    const transition = transitions.find(t => t.year === y.year);
    const signal = periodFact(y.tenGod, String(y.year), "annual");
    const relationLine = pressure ? `${pressure.branches.join("·")} ${pressure.type}의 긴장도 함께 들어옵니다. ${theme.overuse} ${y.tenGod.includes("인") ? "생각을 정리하는 시간을 빼앗기면 작은 부탁에도 예민해질 수 있어요. 머릿속 이해와 실제로 움직일 여유는 따로 챙겨야 합니다." : y.tenGod === "식신" || y.tenGod === "상관" ? "새 조건이 들어올 때마다 이미 만든 것을 전부 다시 고치려 들면 피로가 커져요. 내 결과를 지키는 일에는 남의 요청을 고르는 판단도 포함됩니다." : y.tenGod.includes("재") ? "기대했던 흐름과 실제 일정 사이에 간격이 생기면 여유 자원의 가치가 더 또렷해집니다." : "가까운 사람과도 역할이 바뀌는 동안은 예전의 호흡이 잠깐 어긋날 수 있죠. 친하다는 이유로 기대까지 같다고 여기지 않는 편이 편합니다."}`
      : harmony ? `${harmony.branches.join("·")} ${harmony.type}의 접점은 서로 다른 경험과 역할을 연결하는 좋은 재료입니다. ${theme.domain === "money" ? "기회가 실제 거래와 반복되는 수입으로 이어지는 구조를 볼 만해요." : theme.domain === "study" ? "혼자 정리하던 생각에 다른 사람의 설명이 맞물릴 때 배움이 한층 깊어집니다." : "혼자 따로 해오던 일이 함께 쓸 결과로 이어지는 장면에 힘이 붙어요."}` : theme.overuse;
    const jobScene = annualWorkScene(y.tenGod, scenes);
    const body = past ? [theme.past, ...(transition ? [`${transition.before.ganji}에서 ${transition.after.ganji}로 바뀐 해입니다. ${transition.after.theme}에 관심이 옮겨왔는지 돌아보면 변화의 흔적을 찾기 쉬워요.`] : [])]
      : [
        ...(transition ? [`${transition.dateLabel}을 경계로 ${transition.before.ganji}에서 ${transition.after.ganji}로 넘어가는 해입니다. 앞부분에는 ${transition.before.theme}, 전환 뒤에는 ${transition.after.theme}이 더 중요한 질문이 됩니다.`] : []),
        ...theme.paragraphs,
        ...(jobScene ? [jobScene] : []),
        ...(positive ? [theme.domain === "money" ? "앞으로의 흐름 중 재물과 축적의 좋은 면을 적극적으로 써볼 해입니다. 돈의 규모보다 내 손에 남는 구조를 만들 때 보완과 연결의 흐름이 구체적인 힘이 돼요." : `보완과 연결의 좋은 흐름이 ${theme.focus}을 받쳐줍니다. ${y.tenGod.includes("관") ? "자리와 인정" : y.tenGod.includes("인") ? "학습과 전문성" : y.tenGod === "식신" || y.tenGod === "상관" ? "표현과 결과물" : "새로운 선택"}에 힘을 실어볼 만한 해예요.`] : []),
        relationLine,
        ...trait(theme.domain, `year-${y.year}`, [signal]),
        ...(current ? [`지금은 ${now.ganji} 대운의 ‘${now.theme}’이라는 긴 질문도 함께 작동합니다. 올해 눈앞에 온 선택을 그 기준으로 보면, 당장 끝낼 일과 다음 몇 년에도 남길 일이 달라 보여요.`, `요즘 가장 신경 쓰이는 장면 하나를 떠올려보세요. 지금 잘하고 있는 것과 앞으로 더 잘하고 싶은 것이 꼭 같지는 않을 거예요. ${theme.closing}`] : []),
      ];
    return { year: y.year, ganji: y.ganji, tenGod: y.tenGod, ageLabel: `${packet.currentAge + y.year - packet.currentYear}세`,
      phase: y.year - row.cycle.startYear < 3 ? "early" : y.year - row.cycle.startYear < 7 ? "middle" : "late", importance: y.importance,
      isCurrentYear: current, timePosition: past ? "past" : current ? "current" : "future",
      title: transition ? `${transition.before.ganji}에서 ${transition.after.ganji}로, 성공의 기준이 바뀝니다` : pressure && !past ? pressureTitles[y.tenGod] : theme.title,
      paragraphs: narrativeRhythm(body), evidence: [`${y.ganji} · ${y.tenGod}`, `${row.cycle.ganji} 대운`, ...(pressure ? [`${pressure.branches.join("")} ${pressure.type}`] : harmony ? [`${harmony.branches.join("")} ${harmony.type}`] : [])] };
  });
  const main = themes[now.tenGod], currentSignal = periodFact(now.tenGod, now.ganji, "major");
  const opening = narrativeRhythm([
    `${packet.personLabel}님, 지금은 ${main.focus}에 마음의 무게가 실리는 시기입니다. 같은 일을 해도 예전처럼 해냈다는 사실만으로 만족되지 않을 수 있어요. 무엇을 더 할지보다 무엇 때문에 계속하고 싶은지가 달라집니다.`,
    decadePortrait[now.tenGod],
    ...trait("identity", "opening", [currentSignal]),
    transitions.length ? `${transitions.map(t => `${t.year}년 ${t.before.ganji} → ${t.after.ganji}`).join(", ")}의 경계를 지나며 선택의 기준도 달라집니다. 이미 지나온 ${from}~${packet.currentYear - 1}년은 짧게 되짚고, 지금과 ${through}년까지 이어질 변화를 더 가까이 보겠습니다.` : `${from}~${through}년은 ${now.ganji}의 흐름 안에서 쌓아갈 구간입니다. 대운이 그대로여도 해마다 들어오는 질문은 달라요. 지금의 선택이 어떤 순서로 자기 것이 되는지 볼 차례입니다.`,
  ]);
  const relationship = packet.userContext.relationshipStatus;
  const love = relationship === "single" ? "솔로인 지금, 관심은 늘 하던 생활 바깥에서 붙을 수도 있습니다. 내 일을 흥미롭게 들어주는 사람인지, 바쁜 날에도 대화의 여백이 남는 사람인지가 오래 보게 되는 포인트예요. 사람이 늘어나는 것과 마음 둘 자리가 생기는 것은 다른 변화입니다."
    : relationship === "dating" ? "연애 중이거나 마음이 오가는 지금은 함께 보낼 시간을 어떻게 만드는지에 사랑의 결이 드러납니다. 일이 잘 풀리는 날에는 같이 기뻐하고 싶고, 부담이 큰 날에는 혼자 정리하고 싶을 수 있어요. 그 차이를 상대가 알아듣는 관계가 한결 편해집니다."
      : relationship === "married" ? "함께 생활을 꾸리는 관계에서는 달력과 통장에도 애정이 드러납니다. 집안일, 가족 행사, 혼자 쉴 시간 중 무엇을 당연한 내 몫으로 받아들였는지가 더 잘 보이죠. 앞으로의 역할이 달라질수록 집에서도 서로의 다음 모습을 알아갈 시간이 필요합니다."
        : "관계의 상태보다 가까워졌을 때 내 생활이 어떻게 달라지는지가 중요합니다. 같이 움직일 때 생기는 즐거움과 혼자 회복할 때 돌아오는 여유를 모두 알아보는 사람이 편하게 느껴질 거예요.";
  const sections: MajorFortuneV3Section[] = [
    { id: "career", title: packet.userContext.lifeStatus === "student" ? "잘하는 과목에서, 오래 풀고 싶은 문제로" : "다음 역할은 지금의 나를 똑같이 쓰지 않습니다", mode: "scene", paragraphs: narrativeRhythm([`${scenes.entry}. ${main.focus}이 일상에서는 이런 작은 기준의 변화로 먼저 나타나요.`, `${scenes.handoff}. 직접 잘하는 것과 남도 이해할 수 있게 만드는 것은 다른 실력입니다. 한때 쉬웠던 일이 이제는 왜 나에게 쉬운지 설명해야 할 일이 됩니다.`, ...trait("career", "career", [currentSignal])]), evidence: [`${now.ganji} · ${now.tenGod}`] },
    { id: "money", title: "앞으로 남길 것은 바빴다는 기억만이 아닙니다", mode: "portrait", paragraphs: narrativeRhythm(["일을 늘리는 것과 내 몫을 늘리는 것은 같은 일이 아니에요. 시간, 경험, 다시 찾는 사람 중 무엇이 다음 선택에도 남는지 보는 눈이 중요해집니다. 돈의 흐름도 결국 내가 계속 제공할 수 있는 가치와 연결됩니다.", ...trait("money", "money", [currentSignal])]), evidence: [`${now.ganji} 대운`] },
    { id: "people", title: "다음 장에 같이 데려가고 싶은 사람", mode: "contrast", paragraphs: narrativeRhythm([main.domain === "relationship" ? main.paragraphs[0] : "잘될 때 같이 웃는 사람과 막혔을 때 생각나는 사람이 꼭 같지는 않습니다. 앞으로의 역할이 바뀌면 부탁하고 싶은 도움도 달라져요. 오래 알았다는 이유보다 지금의 고민을 서로 어떤 태도로 듣는지가 관계의 깊이를 보여줍니다.", ...trait("relationship", "people", [currentSignal])]), evidence: [`${now.ganji} 대운`] },
    { id: "love", title: "마음 둘 자리도 생활이 바뀌는 만큼 달라집니다", mode: "portrait", paragraphs: narrativeRhythm([love, "마음은 있는데 시간을 못 내는 날이 계속되면, 상대에게는 없는 마음처럼 보일 수 있죠. 멋진 계획보다 오늘의 표정을 나눌 여유가 관계를 더 가까이 데려갈 때도 있습니다."]), evidence: [packet.mbtiBasis.type ?? "관계와 생활"] },
    { id: "elements", title: "잘하던 방식에 새로운 리듬이 들어옵니다", mode: "contrast", paragraphs: narrativeRhythm([elementChange(packet, nowCycle), ...trait("study", "learning", [currentSignal])]), evidence: [`${now.ganji} · ${now.elements.join("·")}`] },
  ];
  const positiveFacts = facts.filter(f => calculation.birthTimeContext?.birthTimePrecision === "exact" && f.certainty === "confirmed" && f.salience !== "supporting");
  const giftCopies: Record<string, readonly [string, string]> = {
    gwiin_cheoneul: ["혼자 풀던 문제에 사람의 문이 열립니다", "좋은 사람의 도움과 연결을 얻는 귀인의 패가 있습니다. 길을 이미 가본 사람의 한마디가 시행착오를 줄여주는 모습이에요. 다음 역할을 생각할 때도 혼자 증명하는 경로만 있는 것은 아닙니다."],
    gwiin_jaego: ["한 번의 경험이 다음의 자산으로 남는 복", "돈뿐 아니라 기술·경험·신뢰를 쌓아두는 축적의 좋은 패가 있습니다. 새로 시작하는 일도 이미 해본 것의 도움을 받아요. 바쁜 하루가 다음에도 꺼내 쓸 무언가를 남길 때 재물복의 좋은 면이 살아납니다."],
    twelve_sinsal_jangseong: ["앞에 섰을 때 이름이 남는 명예의 패", "명예와 리더십의 좋은 힘이 있습니다. 사람들이 결정을 미룰 때 기준을 세우는 모습이 기억에 남아요. 앞으로 역할이 커질 때도 모든 일을 대신하는 것보다 방향을 맡는 자리에서 존재감이 선명해집니다."],
    twelve_sinsal_banan: ["잘해온 일에 자리와 인정이 붙습니다", "자리와 인정의 좋은 패가 있습니다. 실력이 혼자만의 만족에 머물지 않고 다른 사람의 신뢰로 이어질 여지가 있어요. 판단을 부탁받는 순간에는 이미 해온 일의 무게도 함께 전달됩니다."],
    twelve_sinsal_yeokma: ["익숙한 자리 밖에서도 기회가 보입니다", "이동과 외부 접점에서 기회를 얻는 좋은 힘이 있습니다. 낯선 현장이나 다른 사람의 방식을 만나면 막혔던 생각이 구체적인 선택지로 바뀌어요. 물리적으로 멀리 가는 것만큼 익숙한 관계 밖의 경험에도 의미가 있습니다."],
    gwiin_munchang: ["배운 것을 설명할 때 실력이 더 잘 보입니다", "학습과 표현에 좋은 패가 있습니다. 복잡한 경험을 읽기 쉬운 말로 엮을 때 남이 알아보는 전문성이 됩니다. 앞으로 쌓을 지식이 누구에게 어떤 도움으로 쓰이는지도 재미있는 성장의 축이에요."],
  };
  const gifts = positiveFacts.filter(f => giftCopies[f.featureId]).filter((f, i, all) => all.findIndex(a => a.featureId === f.featureId) === i).slice(0, 2);
  gifts.forEach(f => sections.push({ id: `gift-${sections.length}`, title: giftCopies[f.featureId][0], mode: "good-fortune", paragraphs: narrativeRhythm([giftCopies[f.featureId][1]]), evidence: [f.featureId === "gwiin_cheoneul" ? "천을귀인" : f.featureId === "gwiin_jaego" ? "재고귀인" : f.featureId === "twelve_sinsal_jangseong" ? "장성" : f.featureId === "twelve_sinsal_banan" ? "반안" : f.featureId === "twelve_sinsal_yeokma" ? "역마" : "문창귀인"] }));
  const last = rows.at(-1)!.cycle, ending = themes[last.tenGod];
  const finale = narrativeRhythm([
    `${packet.personLabel}님에게 이 전망의 중심은 ${main.focus}입니다. ${packet.userContext.fieldLabel ? `${packet.userContext.fieldLabel}에서 쌓는 경험도` : "지금 쌓는 경험도"} 단순한 경력이 아니라 앞으로 무엇을 선택할지 보여주는 재료가 됩니다.`,
    gifts.length ? `좋은 패는 혼자 잘 버틴 뒤에만 쓰는 보상이 아닙니다. ${gifts[0].featureId.includes("cheoneul") ? "믿을 만한 사람의 도움을 받는 순간에도 내 경험의 크기는 자라요." : gifts[0].featureId.includes("jaego") ? "쌓아온 기술과 경험은 다음 선택에서도 다시 꺼내 쓸 내 자산이에요." : "지금까지 자연스럽게 해온 장점을 다른 크기의 역할에 써볼 여지가 있어요."} 앞으로는 힘을 쏟을 곳을 고르는 눈에도 자신감을 가져도 좋습니다.` : `이미 익숙해진 ${main.focus}을 어떤 곳에 쓸지 보는 눈이 중요합니다. 더 많이 하는 사람에서 더 오래 남기는 사람으로 관점이 옮겨갑니다.`,
    `돈과 사람을 남기는 방식에도 같은 질문이 있어요. 함께할수록 내 생활이 버티는지, 해낼수록 다음 선택이 넓어지는지입니다. ${main.overuse}`,
    `${through}년까지 이어지는 ${last.ganji}의 장에서는 ${ending.focus}이 중요한 축으로 남습니다. 지금 잘하는 것을 전부 들고 갈 필요는 없어요. 다음 모습에도 힘이 되는 것을 골라 가져가는 변화입니다.`,
    ending.closing,
  ]);
  const fortuneSignals = [
    { tone: "growth" as const, title: now.theme, body: `${now.ganji}의 긴 배경 위에서 해마다 선택의 초점이 달라집니다. 지금의 경험이 ${through}년까지 어떤 모습으로 남을지 이어서 읽어보세요.`, evidence: [`${now.ganji} · ${now.tenGod}`] },
    { tone: "caution" as const, title: "좋은 힘을 너무 오래 켜두면", body: main.overuse, evidence: [now.tenGod] },
    ...(transitions.length ? transitions.map(t => ({ tone: "transition" as const, title: `${t.year}년, 무게중심이 옮겨갑니다`, body: t.title, evidence: [`${t.before.ganji} → ${t.after.ganji}`] })) : [{ tone: "growth" as const, title: "전환보다 축적에 집중하는 구간", body: `${from}~${through}년은 같은 대운 안에서 해마다 다른 경험을 쌓습니다.`, evidence: [now.ganji] }]),
    ...gifts.slice(0, 1).map(f => ({ tone: "fortune" as const, title: giftCopies[f.featureId][0], body: "원래 가진 좋은 패가 다음 선택에서도 자원이 됩니다. 아래에서 실제 생활의 모습으로 더 자세히 읽어보세요.", evidence: sections.find(s => s.title === giftCopies[f.featureId][0])!.evidence })),
  ];
  // Calculation is intentionally consumed, not changed; public manse uses this
  // same stored object. No visible counts are repurposed as strength scores.
  if (!calculation.pillars.day || !yearFacts.size) return null;
  const copy = [...opening, ...sections.flatMap(s => s.paragraphs), ...editorialYears.flatMap(y => y.paragraphs), ...finale];
  return { ...frozen, version: MAJOR_HORIZON_VERSION, title: `${packet.personLabel}님, 지금부터 달라지는 삶의 흐름`, chapterTitle: `${packet.currentYear}년의 나에서 ${through}년의 나로`,
    horizon, narrativeEdition: NARRATIVE_EDITION, narrativeAudit: audit, rhythmWarnings: endingWarnings(copy), opening, fortuneSignals, editorialSections: sections, editorialYears, nextChapter: [], finale,
    editorialAudit: { yearCount: futureYears === 10 ? 14 : 10, currentYear: packet.currentYear, importantYears: editorialYears.filter(y => y.importance === "important").map(y => y.year), sourceVersion: "major-decade-v2" } };
}
