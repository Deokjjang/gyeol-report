import { buildCareerV3, CAREER_V3_POLISH_VERSION, type CareerV3Draft, type CareerV3Input } from "./careerEditorial";
import { CAREER_PORTRAITS, CAREER_VOICES } from "./careerPortraits";
import { interpretCareerContextV3 } from "./careerContextV3";
import { careerEditorialScenes } from "./careerEditorialScenes";
import { composeEditorial, type EditorialRole, type EditorialScene } from "./editorialComposer";
import { storySupport } from "./comprehensiveStoryEvidence";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";

// New copy is versioned, not retroactively applied to saved Phase C drafts.
// Selection, fact weights, compounds, MBTI sources and chapter routing remain C's.
const good: Readonly<Record<string, string>> = {
  bijian: "남의 확답을 기다리지 않고 자기 몫을 시작하는 독립의 좋은 패가 있습니다. 아무도 주인이 되지 않던 문제에 당신 이름이 붙는 이유입니다.",
  jie_cai: "사람과 자원을 한 방향으로 움직이게 하는 좋은 패가 있습니다. 따로 잘하던 사람들이 같이 성과를 내기 시작할 때 당신의 존재감이 커집니다.",
  shi_shen: "생각을 실제로 쓰이는 결과로 길러내는 좋은 패가 있습니다. 거창한 소개 없이도 한 번 써본 사람이 다시 찾게 만드는 손맛입니다.",
  shang_guan: "남들이 적응해버린 불편을 새 결과로 바꾸는 좋은 패가 있습니다. 이상하다고 느끼는 데서 끝나지 않고 대안을 보여줄 수 있다는 것이 경쟁력입니다.",
  pian_cai: "재물복의 좋은 패가 바깥의 기회를 알아보는 감각에 있습니다. 서로 필요로 하던 것을 연결해 거래의 문을 만드는 힘입니다.",
  zheng_cai: "재물복 가운데 축적의 좋은 패가 있습니다. 들어온 자원을 흘려보내지 않고 다음에도 남을 기반으로 만드는 힘을 작게 볼 필요가 없습니다.",
  qi_sha: "어려운 상황에서 앞에 설 수 있는 좋은 패가 있습니다. 혼란이 커져도 지금 할 일을 나눌 수 있어, 급할수록 떠오르는 이름이 됩니다.",
  zheng_guan: "자리와 인정으로 이어지는 좋은 직업운이 있습니다. 한 번의 화려함보다 믿고 맡긴 일이 흔들리지 않는다는 평판에 힘이 실립니다.",
  pian_yin: "남이 지나친 연결에서 전문성을 만드는 좋은 패가 있습니다. 모두가 같은 답을 말할 때 다른 접근을 꺼낼 수 있다는 것이 당신의 몫입니다.",
  zheng_yin: "배움과 사람의 도움을 내 기반으로 받아들이는 좋은 패가 있습니다. 좋은 설명을 만나 자란 실력이 다시 누군가의 버팀목이 되는 쪽입니다.",
};
const punch: Readonly<Record<string, string>> = {
  bijian: "도움이 싫은 건 아닌데, 도와준다며 내 방식까지 바꾸면 갑자기 혼자 하고 싶어집니다.",
  jie_cai: "관심 없다던 일도 동료가 잘한다는 말을 들으면 갑자기 검색 기록에 등장합니다.",
  shi_shen: "다 끝났다고 말한 뒤에도 혼자 한 번 더 만지고 있습니다. 남은 작업보다 내 눈에 걸린 한 군데가 큽니다.",
  shang_guan: "입으로는 알겠다고 했는데 표정이 벌써 ‘그런데 왜요?’를 말하고 있을 때가 있습니다.",
  pian_cai: "새 기회를 잡은 기쁨은 빠른데, 이미 벌여놓은 일의 달력은 조금 늦게 떠오릅니다.",
  zheng_cai: "작은 결제 하나는 꼼꼼히 보면서, 내가 더 쓴 한 시간은 계산에서 빠뜨릴 때가 있습니다.",
  qi_sha: "급한 일을 잘 끝내준 죄로 다음 급한 일도 제일 먼저 도착합니다. 유능함이 긴급 연락처가 된 셈입니다.",
  zheng_guan: "칭찬에 관심 없는 척했지만, 아무도 모르고 넘어가면 집에 가서 한 번 더 생각납니다.",
  pian_yin: "자료 하나만 더 보려다 탭은 늘었는데 정작 보여줄 첫 장은 아직 비어 있을 때가 있습니다.",
  zheng_yin: "설명해주다 보니 어느새 내 일보다 상대의 준비물이 더 잘 정리돼 있습니다.",
};
const future: Readonly<Record<string, string>> = {
  bijian: "자기 방법을 지키는 데서 출발했지만, 그 방법으로 무엇이 달라졌는지 보여줄수록 자율성도 단단해집니다. 독립은 모든 것을 혼자 하는 모습보다 스스로 선택할 수 있는 힘에 가깝습니다.",
  jie_cai: "처음에는 잘하는 사람을 보면 승부욕이 생기지만, 시간이 갈수록 그 사람과 무엇을 함께 할 수 있을지가 더 큰 질문이 됩니다. 경쟁을 연결로 바꾸는 지점에 다음 크기의 일이 있습니다.",
  shi_shen: "작은 완성에 자기 취향을 담던 힘이 쌓이면 남들이 다시 찾는 기준이 됩니다. 손을 많이 움직이는 사람에서 그 사람의 결과라면 믿을 수 있다는 이름으로 자라는 모습입니다.",
  shang_guan: "당연한 방식에 품었던 질문이 쓸 수 있는 대안으로 남을 때 영향력이 커집니다. 반대 의견이 많은 사람보다 없던 선택지를 만들어준 사람으로 기억되는 길입니다.",
  pian_cai: "만나는 사람과 기회가 늘어날수록 어떤 연결을 남길지가 중요해집니다. 모든 제안을 붙잡지 않아도 내가 가진 것을 더 넓은 쓰임으로 옮길 감각은 사라지지 않습니다.",
  zheng_cai: "작은 흐름을 지키는 성실함은 시간이 갈수록 쉽게 흉내 낼 수 없는 기반이 됩니다. 남보다 크게 보이지 않는 날에도 실제 남겨온 몫이 다음 선택을 받쳐줍니다.",
  qi_sha: "급한 상황에서 익힌 판단이 평소의 질서를 바꿀 때 경험의 값이 커집니다. 힘든 일을 견디는 사람으로만 남기에는 이미 배운 것이 많습니다.",
  zheng_guan: "매번 약속을 지키며 쌓인 평판은 다음 역할을 맡길 이유가 됩니다. 눈에 띄는 말이 적어도 누군가 안심하고 당신 이름을 말할 수 있다는 사실은 가볍지 않습니다.",
  pian_yin: "오래 붙잡았던 질문들이 다른 사람이 막힌 곳에서 쓰이기 시작합니다. 혼자 깊어진 시간이 세상과 멀어진 시간이 아니라 누구도 쉽게 대신하지 못할 관점을 만든 시간이 됩니다.",
  zheng_yin: "배운 것을 자기 안에만 쌓지 않고 남의 이해로 이어갈수록 전문성의 폭이 넓어집니다. 당신에게서 배운 사람이 혼자 해내는 모습에도 당신의 일이 남습니다.",
};
const fortune: Readonly<Record<string, readonly [string, string, string]>> = {
  twelve_sinsal_jangseong: ["앞에 섰을 때 더 잘 보이는 이름", "명예와 리더십의 좋은 직업운이 있습니다. 모두가 결정을 미루는 자리에서 방향을 잡는 모습이 유난히 오래 남습니다.", "회의가 끝난 뒤 사람들이 방금 누가 기준을 세웠는지 기억하는 쪽입니다. 혼자 많은 양을 해낸 것과는 다른 종류의 존재감입니다."],
  twelve_sinsal_banan: ["잘하는 사람에서, 판단을 맡기는 사람으로", "자리와 인정의 좋은 패가 있습니다. 처음에는 처리를 부탁받다가 점차 이 일을 어떻게 할지 의견을 묻는 사람이 되는 모습입니다.", "내가 해낸 일보다 내 판단을 기다리는 사람이 늘어날 때 역할의 무게가 달라집니다. 직함만 커지는 것보다 실제 신뢰가 따라붙는 자리가 어울립니다."],
  gwiin_cheoneul: ["사람복도 실력의 일부입니다", "직장과 사업에서 귀인의 도움을 만날 사람복이 있습니다. 혼자 오래 붙들던 문제에 적절한 소개나 조언이 들어와 길이 짧아지는 좋은 패입니다.", "도움을 받았다고 내 몫이 줄어드는 것은 아닙니다. 당신의 가능성을 알아보고 자기 경험을 기꺼이 건네는 사람이 있다는 것도 커리어의 든든한 자산입니다."],
  gwiin_jaego: ["바쁜 하루가 끝나도 남는 것이 있습니다", "돈·고객·기술·경험을 쌓아 남기는 재물복, 축적의 좋은 패가 있습니다. 끝낸 일이 다음 시작의 밑천이 되어 매번 빈손으로 돌아가지 않는 힘입니다.", "한 번 겪은 어려움이 요령으로 남고, 한 번 맺은 신뢰가 다시 찾는 이유가 됩니다. 통장에 찍힌 금액 바깥에도 이미 모아둔 자산이 있습니다."],
  twelve_sinsal_yeokma: ["익숙한 자리 밖에서 쓰임이 넓어집니다", "이동과 외부 접점에서 기회를 만나는 좋은 패가 있습니다. 익숙한 곳에서는 당연했던 내 경험을 다른 곳에서 귀하게 보는 순간과 잘 맞습니다.", "새로운 사람의 질문 하나가 내가 할 수 있는 일의 범위를 바꿉니다. 떠나는 것 자체보다 돌아왔을 때 달라진 시야가 오래 남습니다."],
  sinsal_dohwa: ["내용뿐 아니라 보여준 사람까지 기억합니다", "사람의 시선을 모으고 인상을 남기는 매력의 좋은 패가 있습니다. 고객 접점이나 결과를 소개하는 자리에서 실력에 기억될 얼굴이 더해집니다.", "딱딱한 설명에도 당신다운 리듬이 들어가면 상대가 한 번 더 보게 됩니다. 무난하게 지우기보다 잘 만든 결과에 자기 색이 남을 때 매력이 살아납니다."],
  sinsal_hongyeom: ["다시 찾게 되는 데에는 분위기도 있습니다", "자기 취향과 온도로 사람을 끌어당기는 좋은 패가 있습니다. 똑같이 정확한 설명이라도 당신에게 들었을 때 더 마음이 가는 쪽의 매력입니다.", "작은 말투와 보여주는 방식이 관계의 기억에 남습니다. 모두에게 비슷하게 맞추는 것보다 내 색을 좋아하는 사람이 오래 찾아오는 그림이 어울립니다."],
  gwiin_munchang: ["알고 있는 것보다, 알아듣게 하는 힘", "말과 글로 전문성을 보여주는 좋은 패가 있습니다. 복잡한 이야기를 듣던 사람의 표정이 당신의 설명에서 풀리는 순간에 재능이 보입니다.", "정보를 많이 나열한 사람이 아니라 핵심을 이해시켜준 사람으로 기억됩니다. 내 머릿속에 있는 실력에 밖으로 나올 문이 있다는 뜻입니다."],
  gwiin_hakdang: ["좋은 배움을 만나면 자라는 속도가 달라집니다", "배움의 자리와 좋은 가르침을 통해 실력을 키우는 학업의 좋은 패가 있습니다. 혼자 막히던 내용도 맞는 설명을 만나면 갑자기 이어지는 쪽입니다.", "한 번 배운 기준이 이후의 시행착오를 줄여줍니다. 교육을 받았다는 이력보다, 배우기 전과 달라진 내 선택이 오래 남습니다."],
  sinsal_hyeonchim: ["다들 괜찮다는데 한 군데가 마음에 걸립니다", "작은 어긋남과 모순을 발견하는 정밀함이 있습니다. 전체가 멀쩡해 보여도 빠진 조건 하나를 알아보는 눈이 품질을 지킵니다.", "남에게는 사소해 보인 질문이 나중에 큰 수정을 줄이는 경우입니다. 다만 쉬는 날까지 나와 남의 흠을 검사하고 있으면 이 좋은 눈도 피곤해집니다."],
  twelve_sinsal_hwagae: ["혼자 있는 시간이 허전하지만은 않습니다", "조용히 몰입해 자기 깊이를 만드는 좋은 패가 있습니다. 반응이 뜸해져도 쉽게 놓지 않는 질문과 취향이 전문성의 바닥을 단단하게 만듭니다.", "유행이 지나간 뒤에도 다시 꺼내보는 분야가 있습니다. 남보다 늦게 말했는데 이야기가 더 깊다면 그 조용한 시간은 이미 일을 하고 있었던 셈입니다."],
};

function statusNarrative(input: CareerV3Input) {
  switch (input.context.lifeStatus) {
    case "business_owner": return {
      intro: "내가 잘하는 것과 나 없이도 잘 돌아가는 것은 다른 문제입니다. 고객이 느끼는 가게의 얼굴, 뒤에서 굴러가는 비용, 사람에게 맡기는 마음까지 모두 사장의 하루에 들어 있습니다.",
      current: "고객이 늘어 기쁜 날에도 계산은 끝나지 않습니다. 가격에 담은 약속과 실제로 든 원가가 어긋나면 매출의 기쁨이 마감 뒤 피로로 바뀝니다. 브랜드는 로고보다 고객이 다시 올 이유에 먼저 쌓입니다.",
      people: "직원을 믿고 맡기고 싶은데 손은 어느새 먼저 나가 있습니다. 내가 빨리 처리할수록 다른 사람은 배울 틈이 줄고, 사장이 빠지면 멈추는 운영이 되기 쉽습니다. 맡기는 일에도 자기만의 성격이 드러납니다.",
      money: "돈은 매출 화면보다 마감 뒤에 더 솔직합니다. 많이 판 날의 비용과 내 노동까지 보고 나면 바빴다는 말과 잘 남겼다는 말이 갈립니다. 가격을 지키는 것은 손님을 덜 아끼는 일이 아니라 오래 같은 품질을 내는 조건입니다.",
      growth: "확장할 곳이 보인다고 내 몸이 하나 더 생기는 것은 아닙니다. 새 고객을 맞는 즐거움과 직원에게 품질을 넘기는 힘이 같이 자랄 때 사업도 개인기 바깥으로 커집니다.",
      next: "다음 확장에서는 규모보다 먼저, 내가 잠시 빠져도 고객이 같은 이유로 다시 올 수 있는지 확인해 보세요.",
      conclusion: "다음 자리는 모든 응대를 잘하는 사장보다 사람들이 함께 좋은 경험을 만들게 하는 사람에 가깝습니다. 당신의 취향은 브랜드에 남고, 일상의 여유는 운영에서 생깁니다.",
    };
    case "freelancer": return {
      intro: "결과에는 내 이름이 붙고, 빈 일정에는 나만 아는 무게가 붙습니다. 의뢰를 받는 안도감과 내 전문성을 지키고 싶은 마음 사이에 프리랜서의 일하는 성격이 보입니다.",
      current: "고객이 원하는 것과 내가 잘하는 것이 만나는 의뢰에서는 작업에 속도가 붙습니다. 반대로 계약의 끝이 흐리면 완성하고도 끝나지 않습니다. 한 번 잘 만든 결과만큼 다음에도 받고 싶은 조건이 내 브랜드를 만듭니다.",
      people: "다시 찾는 고객이 내 전문성을 좋아하는지, 부탁을 거절하지 않아 편한 건지는 느낌이 다릅니다. ‘이건 금방 되시죠?’라는 한마디에 지난 몇 년의 연습 시간이 사라진 것 같은 순간도 있습니다.",
      money: "견적에 보이는 제작 시간과 실제로 쓴 시간 사이에는 수정·설명·대기가 있습니다. 단가를 낮춰 빈 달을 메웠는데 다음 달까지 바빠지면 수입 변동보다 체력 변동이 먼저 옵니다. 정산일까지 포함해야 의뢰 하나가 생활에 남긴 몫이 보입니다.",
      growth: "포트폴리오는 지난 일의 앨범이면서 다음 고객을 고르는 간판입니다. 정말 잘했지만 다시는 하고 싶지 않은 작업만 앞에 있으면 그 의뢰가 또 찾아옵니다. 실력이 쌓일수록 내 이름을 어떤 문제에 붙일지도 선명해집니다.",
      next: "다음 의뢰의 금액과 함께 수정 범위·정산일을 확인하고, 내 이름으로 오래 남기고 싶은 작업인지도 한 번 따로 보세요.",
      conclusion: "다음 단계는 더 많은 부탁을 받는 사람이 아니라 어떤 문제라면 이 사람이라고 떠오르는 전문가입니다. 수입의 빈틈을 메우는 일과 내 이름의 가격을 만드는 일이 조금씩 같은 방향을 바라보게 됩니다.",
    };
    case "student": case "exam_certificate": return {
      intro: "좋아하는 과목과 성적이 잘 나오는 과목이 꼭 같지는 않습니다. 점수에 잡힌 실력 옆에 아직 이름을 붙이지 않은 호기심이 있습니다. 첫 직업의 단서는 그 둘 사이에서도 자랍니다.",
      current: "전공 과제를 하다 시간 가는 줄 몰랐던 부분은 결과와 별개로 남습니다. 포트폴리오에 넣을 만큼 근사하지 않아도 내가 어떤 선택을 다시 해보고 싶은지는 알 수 있습니다. 경험이 쌓인다는 것은 잘하는 일뿐 아니라 생각보다 재미없는 일을 알아가는 것이기도 합니다.",
      people: "친구에게 설명하다가 아는 줄 알았던 부분에서 말이 멈춥니다. 함께 공부할 때의 민망함이 혼자 열 번 읽을 때보다 정확하게 빈칸을 보여주기도 합니다. 팀 과제에서 먼저 맡는 역할에는 취향과 습관이 함께 묻어납니다.",
      money: "용돈과 아르바이트 수입을 어디에 쓰는지에도 선택의 성격이 있습니다. 남들이 시작한 강의나 도구를 보면 아직 부족한 것 같다가도, 이미 산 것을 실제로 써본 시간은 의외로 짧을 때가 있습니다.",
      growth: "점수는 배운 범위 안의 실력을 보여주지만 수업 밖의 경험은 어떤 문제를 오래 붙잡는 사람인지 보여줍니다. 전공·동아리·작은 제작·인턴이 한 줄로 정리되지 않아도 나중에 이어지는 관심은 남습니다.",
      next: "첫 직업을 서둘러 확정하기보다 관심 역할의 짧은 실습이나 인턴 요건부터 살펴보세요. 해보고 난 뒤 더 궁금해지는 일이 중요한 단서입니다.",
      conclusion: "다음 역할은 지금까지 배운 것을 처음 보는 문제에 써보는 사람입니다. 아직 직업 이름이 선명하지 않아도 직접 해본 선택들이 쌓이면 내 소개에서 남의 말이 조금씩 줄어듭니다.",
    };
    case "job_seeker": case "resting": return {
      intro: "직함이 비어 있다고 일하는 성격까지 빈 것은 아닙니다. 무엇을 빨리 알아차리고 어떤 환경에서 오래 힘을 쓰는지에 이미 차이가 있습니다. 첫 선택은 그 차이를 보여줄 입구를 찾는 일입니다.",
      current: "지원서의 성실함이라는 단어는 비슷해도 작은 문제를 푼 순서는 다릅니다. 어디서 막혔고 무엇을 먼저 골랐는지 이야기할 수 있으면 짧은 경험에도 내 판단이 보입니다. 직무군을 넓게 볼 때도 모든 일을 잘할 사람처럼 말할 필요는 없습니다.",
      people: "현직자의 멋진 성과보다 자주 힘든 순간이 더 오래 기억날 때가 있습니다. 그 이야기를 듣고도 궁금한 역할과, 이름은 근사한데 하루가 그려지지 않는 역할의 차이가 조금씩 선명해집니다.",
      money: "준비가 길어지면 시간을 공짜처럼 쓸 때가 있습니다. 새 강의를 결제하면 잠깐 앞으로 간 느낌이 들지만, 이미 배운 것을 보여줄 사례가 없다는 불안은 그대로 남기도 합니다.",
      growth: "면접에서 경험의 크기보다 선택의 이유를 물으면 오히려 이야기가 살아납니다. 같은 지원 문장을 더 많이 보내는 것과 작은 사례라도 내 말로 설명하게 되는 것은 다른 변화입니다.",
      next: "지원할 환경의 실제 업무와 필수 요건을 확인한 뒤 보조 역할·인턴·작은 프로젝트 중 지금 가능한 진입방식부터 비교해 보세요.",
      conclusion: "다음 단계는 완벽한 경력을 갖춘 척하는 사람이 아니라 맡은 문제에서 어떤 판단을 할지 보여주는 사람입니다. 첫 선택이 평생의 결론일 필요는 없지만, 내 힘이 자라는 환경인지 알아볼 기준은 남습니다.",
    };
    case "employee": return {
      intro: "같은 일을 맡아도 누군가는 양을 보고 누군가는 막힐 지점을 봅니다. 평가표에는 결과가 남지만 당신의 하루에는 그 결과를 만들기까지 참은 말과 먼저 알아챈 순간도 남아 있습니다.",
      current: "일을 빨리 끝낸 것만으로 내 기여가 모두 보이지는 않습니다. 미리 물어서 줄인 왕복, 협업이 끊기지 않게 연결한 판단은 결과 뒤에 숨어 있습니다. 일을 넘기는 순간보다 그 전에 무엇을 바꿨는지에서 자기 실력이 더 선명해질 때가 있습니다.",
      people: "내 머릿속에서 정리된 기준이 동료에게는 처음 듣는 이야기일 때가 있습니다. 서로 능력이 없는 것이 아니라 시작한 지점이 다른 셈입니다. 후배의 질문이 답답하다가도 내가 처음 막혔던 곳과 같다는 걸 알면 설명의 온도가 달라집니다.",
      money: "평가 자리에서 고생한 시간만 말하면 내가 바꾼 결과는 작게 들립니다. 연봉 이야기는 어색해하면서 맡은 일은 계속 늘어나면 어느 날 칭찬이 할인 쿠폰처럼 느껴집니다. 보상 앞에서 내 기여까지 겸손할 필요는 없습니다.",
      growth: "다음 역할에서는 손이 빠른 것보다 무엇을 하지 않을지 고르는 판단이 커집니다. 직접 잘하는 전문가의 깊이와 다른 사람의 일을 연결하는 관리의 폭은 같은 승진 사다리가 아닙니다. 어느 쪽에서 더 오래 힘이 나는지에도 성격이 드러납니다.",
      next: "이직을 비교할 때 직함 옆에 실제 담당 문제·평가 기준·협업 조건을 놓아보세요. 더 바쁜 곳과 더 중요한 판단을 맡기는 곳은 다를 수 있습니다.",
      conclusion: "다음 역할은 일이 오면 잘 끝내주는 사람을 넘어, 어디에 힘을 써야 할지 함께 묻게 되는 사람입니다. 이미 만든 성과에 내 판단이 보일 때 보상과 선택의 폭도 이야기할 근거가 생깁니다.",
    };
    default: return {
      intro: "입력한 역할의 이름이 내가 하는 일을 전부 담지는 못합니다. 하루에서 자주 붙잡는 문제와 끝내고 나서 남는 감각에도 일하는 성격이 보입니다.",
      current: "겉으로 드러나는 결과와 뒤에서 이어주는 수고는 다르게 보일 때가 있습니다. 작은 역할이어도 어떤 선택을 직접 했는지 돌아보면 내 기여가 조금 더 구체적입니다.",
      people: "같이 있는 사람이 기대한 것과 내가 끝냈다고 생각한 것이 다르면 성실하게 하고도 답답합니다. 서로 알고 있다고 여긴 부분에서 의외로 다른 출발점이 보입니다.",
      money: "바로 돈이 붙는 일과 생활을 지탱하는 수고의 가치는 다르게 보입니다. 금액이 없다는 이유만으로 그 일에 쓴 시간까지 없는 셈이 되지는 않습니다.",
      growth: "역할이 커진다는 것은 이름이 바뀌는 일만은 아닙니다. 전에는 남의 선택을 기다렸던 문제를 이제 스스로 다룰 수 있다면 이미 범위가 달라진 것입니다.",
      next: "지금 생활에서 남기고 싶은 결과와 줄이고 싶은 소모를 하나씩 구분해 보세요. 확인되지 않은 직업을 상상해 결정할 필요는 없습니다.",
      conclusion: "다음 모습은 지금 하는 일에서 내 몫을 더 분명히 알아보는 사람입니다. 남에게 붙은 직함과 비교하기보다 내가 실제로 다룰 수 있는 문제의 폭이 선택의 기반이 됩니다.",
    };
  }
}

export function buildCareerV3Polished(input: CareerV3Input): CareerV3Draft {
  const baseline = buildCareerV3(input);
  if (!baseline.chapters.length) return { ...baseline, version: CAREER_V3_POLISH_VERSION };
  const { facts, context } = input, work = interpretCareerContextV3(context.fieldLabel ?? "", input.robust, context.lifeStatus);
  const settings = careerEditorialScenes(context, work), status = statusNarrative(input);
  const original = baseline.chapters.flatMap(c => c.scenes);
  const find = (angle: string) => original.find(s => s.angle === angle)!;
  const anchors = (s: EditorialScene) => facts.filter(f => s.evidenceRefs.includes(f.id));
  const main = anchors(find("first-minute"))[0], key = main.featureId.slice(8), portrait = CAREER_PORTRAITS[key];
  const money = anchors(find("earning"))[0], moneyKey = money.featureId.slice(8), moneyPortrait = CAREER_PORTRAITS[moneyKey];
  const voice = CAREER_VOICES[input.mbti];
  const student = ["student", "exam_certificate"].includes(context.lifeStatus), seeker = ["job_seeker", "resting"].includes(context.lifeStatus);
  const strong = facts.filter(f => storySupport(f.featureId, facts, input.calculation).substantial);
  const wealth = strong.find(f => /ten_god_(pian|zheng)_cai/.test(f.featureId)), store = strong.find(f => f.featureId === "gwiin_jaego");
  const parts = (...values: readonly (readonly [EditorialRole, string])[]) => values.map(([role, text]) => ({ role, text }));
  const character = (...values: string[]) => parts(...values.map(text => ["character", text] as const));
  const scenes = original.map((s): EditorialScene => {
    const change = (headline: string, next: EditorialScene["parts"], extra: Partial<EditorialScene> = {}) => ({ ...s, headline, parts: next, ...extra });
    switch (s.angle) {
      case "first-minute": return change(portrait.title, character(`${input.name}님은 ${portrait.name}입니다. ${portrait.start}`, `${context.fieldLabel ? `${context.fieldLabel}${student || seeker ? " 분야를 알아갈" : " 일을 할"} 때도 이런 성격이 묻어납니다. ` : ""}${status.intro}`));
      case "work-fusion": {
        const precision = anchors(s).some(f => f.featureId === "sinsal_hyeonchim");
        const behavior = precision && input.mbti === "ENTJ" ? "오류가 보이는 순간 수정안과 맡길 순서까지 함께 떠오릅니다. 남들은 문제를 확인하는 중인데 머릿속에서는 다음 회의의 안건까지 정리돼 있습니다."
          : precision && input.mbti === "INFP" ? "평소에는 조용히 듣다가 완성도나 지키고 싶은 가치가 어긋나면 말이 놀랄 만큼 정확해집니다. 다들 괜찮다는데 나만 걸리는 한 군데를 그냥 넘기기 어렵습니다."
            : main.featureId === "ten_god_shi_shen" && input.mbti === "ENFP" ? "누군가 흥미를 보이면 혼자 생각하던 아이디어에 모양이 생깁니다. 말로 설명하던 손이 하나 만들어 보여주려 움직이고, 상대의 반응을 다시 재료로 쓰는 편입니다."
              : main.featureId === "ten_god_zheng_guan" && input.mbti === "ISTJ" ? "예전에 합의한 역할과 지금 요청이 어긋나면 금방 알아차립니다. 아무도 묻지 않아도 빠진 약속이 기억에 남아 끝까지 챙기고 나서야 마음이 놓입니다." : voice.start;
        return change(input.mbti === "ENTJ" ? "이야기는 아직인데 머릿속 순서는 벌써 끝났습니다" : input.mbti.startsWith("I") ? "내가 조용하다고, 같은 생각인 건 아닙니다" : "같이 이야기할 때 내 생각의 속도가 보입니다", character(`${settings.conversation}입니다. ${behavior}`));
      }
      case "own-day": return change(student ? "공부하는 내 모습에도 의외의 빈틈이 있습니다" : "별것 아닌 척했지만 사실 좀 신경 썼습니다", character(punch[key]));
      case "talent": return change("칭찬보다 ‘다음에도 네가 해줘’가 더 크게 들립니다", character(portrait.talent, `${settings.recognition}이 있습니다. 뭉뚱그린 칭찬보다 내가 힘을 쓴 바로 그 부분을 알아봤다는 기분이 큽니다.`));
      case "compound": return change(s.headline, s.parts.filter(p => p.role === "character"));
      case "environment": return change("바쁜 건 참겠는데, 이 방식은 좀 어렵습니다", character(`${settings.pressure}, 마음이 먼저 빡빡해집니다. ${portrait.mismatch}이라는 느낌까지 겹치면 일의 양보다 그 조건이 더 피곤합니다.`, ...(voice ? [voice.pressure] : [])));
      case "boundary": return change(student || seeker ? "잘하려는 마음도 잠깐 쉬어야 합니다" : "강점까지 퇴근 못 하게 둘 필요는 없습니다", parts(["advice", input.robust ? "되풀이되는 소모가 있다면 의욕이 꺾였던 순간에 어떤 부탁이나 기준이 바뀌었는지 하나만 짚어보세요. 사람 전체보다 바꿀 수 있는 조건이 먼저 보이면 됩니다." : `되풀이되는 소모가 있다면 ${portrait.mismatch}의 어떤 조건이 지금 상황에도 있는지 하나만 짚어보세요. 사람 전체보다 바꿀 수 있는 조건이 먼저 보이면 됩니다.`]));
      case "current-role": return change(student || seeker ? "해보기 전에는 몰랐던 내 취향" : "지금 하는 일에 이미 남아 있는 내 판단", character(`${settings.entry}입니다. ${status.current}`, portrait.growth));
      case "work-structure": return change(student ? "완성했는데 다시 해보고 싶은 것이 있습니다" : seeker ? "지원서 한 줄보다 작은 결과가 더 많은 말을 합니다" : "결과 뒤에 숨어 있던 실력", character(`${settings.craft}에도 내 선택이 남습니다.`, work.analysisIntensity === "high" && !student && !seeker ? "마지막 숫자가 맞는 것과 왜 그 숫자가 나왔는지 아는 것은 다릅니다. 겉으로 같은 결과라도 다음에 조건이 바뀌면 누가 과정을 이해했는지가 드러납니다." : `당신에게 ${portrait.environment}이 중요한 이유도 여기에 있습니다. 결과가 나오는 과정에서 무엇을 직접 고르고 싶은지에 일의 만족이 달려 있습니다.`));
      case "colleague": return change("편한 사람이어도 아무렇게나 해도 되는 사람은 아닙니다", character(portrait.people, status.people));
      case "handover": return change(student ? "설명하다가 내가 먼저 알아버리는 순간" : "내가 너무 빨리 끝내서 쉬운 일로 보였을 때", character(`${settings.handoff}입니다. 내가 이미 익힌 단계를 상대는 처음 만나고 있다는 차이가 보입니다.`, /shi_shen|qi_sha|zheng_guan|zheng_yin/.test(key) ? "금방 끝내준 일이 다시 돌아오면 어느 순간 ‘왜 이것도 내 일이 됐지?’ 싶어집니다. 잘한다는 말이 기분 좋으면서도 부탁의 양까지 반갑지는 않은 두 마음입니다." : "내가 편하게 설명했다고 처음부터 쉬운 문제였던 것은 아닙니다. 상대가 고개를 끄덕이는 짧은 시간 뒤에 혼자 헤맸던 긴 시간이 숨어 있습니다."), { form: "tip" });
      case "earning": return change(context.lifeStatus === "business_owner" ? "매출은 신나는데 마감 계산은 다른 이야기를 합니다" : "칭찬은 받았는데 내 몫은 왜 작을까요", character(moneyPortrait.money, status.money));
      case "spending": return change("돈보다 먼저 싸게 쓰고 있는 건 내 시간일 수 있습니다", character(moneyPortrait.spending, student || seeker ? "준비물을 갖추면 준비가 된 느낌은 빨리 옵니다. 막상 시작하는 데 필요한 건 새 결제보다 이미 가진 것으로 해볼 첫 시도일 때도 있습니다." : "금액으로 적히지 않았다고 비용이 없는 것은 아닙니다. 내 시간을 조금씩 더 얹은 선택이 반복되면 가장 먼저 줄어드는 것은 쉴 때의 여유입니다."));
      case "wealth-card": return change("재물복을 작게 말할 필요는 없습니다", character(good[anchors(s)[0].featureId.slice(8)], "큰돈 한 번이라는 그림만이 재물의 전부는 아닙니다. 내 손에 들어온 기회를 생활에 남길 수 있다는 감각도 돈을 대하는 든든한 바탕입니다."));
      case "role": return change(student || seeker ? "많이 준비한 사람과 자기 선택이 있는 사람" : "더 바빠진 나 말고, 다음의 나는 어떤 모습일까", character(status.growth));
      case "learning-character": {
        const learner = CAREER_PORTRAITS[anchors(s)[0].featureId.slice(8)];
        return change("관심 있는 것에는 시간이 다르게 갑니다", character(learner.study, `${settings.learning}이 있습니다. ${student ? "눈으로 읽으면 다 아는 것 같은데 책을 덮고 설명하려니 갑자기 말이 짧아집니다. 익숙한 문장을 본 것과 내 것으로 만든 것 사이의 차이가 그제야 나타납니다." : "안다고 생각한 것이 실제 선택을 바꾸는 순간입니다. 정보를 하나 더 모은 기쁨과 해볼 수 있는 일이 늘어난 기쁨은 느낌부터 다릅니다."}`));
      }
      case "learning-fusion": return change("같은 설명인데 나는 이 대목에서 이해합니다", character(voice.learn));
      case "exam": return change("내일 시험인데 갑자기 책상 정리가 잘됩니다", parts(["character", "기한이 가까워지면 잘 아는 부분을 한 번 더 보는 일이 유난히 안심됩니다. 어려운 한 장을 펴는 것보다 정리한 노트를 넘기는 속도가 더 빨라지는 순간입니다."], ["advice", "이미 풀 수 있는 것과 설명은 되지만 막히는 것을 한 번만 나눠보세요. 불안해서 되풀이하는 시간과 실제로 채울 빈틈을 구분하는 정도면 충분합니다."]));
      case "practice": return change(s.headline, s.parts);
      case "learning-next": return change("배움이 내 쪽으로 넘어왔다는 작은 증거", parts(["advice", "최근 익힌 것 하나를 내 말로 설명하거나 작은 결과에 써보세요. 자격증이 필요한 역할이라면 실제 요건도 함께 확인하면 배움의 다음 자리가 분명해집니다."]));
      case "core-gift": return change("이미 들고 온 패까지 겸손할 필요는 없습니다", character(good[key]));
      case "environment-fit": return change(context.lifeStatus === "business_owner" ? "커질 기회와 감당할 크기는 다릅니다" : context.lifeStatus === "freelancer" ? "좋은 금액인데 자꾸 망설여지는 제안" : "공고는 그럴듯한데 하루가 그려지지 않는다면", parts(["character", `${settings.next}입니다. ${portrait.environment}과 맞는지에 따라 같은 직무명 아래의 하루도 달라집니다.`], ["advice", status.next]));
      case "role-examples": return s;
      case "final-person": {
        const moneyAxis = wealth ? "기회가 실제로 남을 몫까지 이어질 때 돈을 다루는 힘이 살아납니다. 눈앞의 금액과 오래 쓸 기반을 같이 보는 것이 앞으로의 여유를 만듭니다." : store ? "겪은 일과 쌓인 신뢰가 다음 시작의 자산이 됩니다. 돈으로 바로 보이지 않던 경험도 다시 쓰일 곳을 만나면 이미 모아둔 기반이었다는 걸 알게 됩니다." : "잘한 일에 쓴 시간과 실제로 돌아온 몫을 함께 보면 돈의 방향도 더 선명해집니다. 재미있고 의미 있는 일이라는 이유로 내 기여까지 작게 셈할 필요는 없습니다.";
        const refs = [...new Set([...s.evidenceRefs, money.id, ...(wealth ? [wealth.id] : store ? [store.id] : [])])];
        return change("그래서, 당신은 이런 커리어를 만들어갑니다", character(
          `${input.name}님의 커리어에는 ${portrait.environment}이 어울립니다. ${context.fieldLabel && !student && !seeker ? `${withKoreanParticle(context.fieldLabel, "called")} 지금의 일에서도 ` : "앞으로 맡을 일에서도 "}직무명보다 어떤 문제를 자기 방식으로 풀었는지가 당신을 더 잘 설명합니다.`,
          `${future[key]} ${moneyAxis}`,
          status.conclusion,
          portrait.closing,
        ), { evidenceRefs: refs, sourceRefs: [...new Set([...s.sourceRefs, ...facts.filter(f => refs.includes(f.id)).flatMap(f => f.sourceRefs)])] });
      }
      default: {
        const f = anchors(s)[0], gift = fortune[f?.featureId];
        if (!s.angle.startsWith("gift-") || !gift) return s;
        // One external scene, once: other gifts describe different manifestations.
        const body = f.featureId === "twelve_sinsal_yeokma" ? `${settings.outside}가 좋은 예입니다. ${gift[2]}` : gift[2];
        return change(gift[0], character(gift[1], body));
      }
    }
  });
  const { scenes: assembled, ...editorialAudit } = composeEditorial({ product: "career_money_study", chapters: baseline.chapters.map(c => c.id), facts, scenes,
    selectedEvidenceRefs: [...new Set(scenes.flatMap(s => s.evidenceRefs))], substantialEvidenceRefs: strong.map(f => f.id), maxConsecutiveTone: 1 });
  return { ...baseline, version: CAREER_V3_POLISH_VERSION, chapters: baseline.chapters.map(c => ({ ...c, scenes: assembled.filter(s => s.chapter === c.id) })), editorialAudit };
}
