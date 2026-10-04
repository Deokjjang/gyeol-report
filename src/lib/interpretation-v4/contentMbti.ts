import { getMbtiSourceProfile, type MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { materialLabel } from "./contentEvidence";
import type { BoundMaterial } from "./materialPacket";
import type { Domain } from "./types";

type Reading = readonly [trait: string, features: string, kind: "reinforce" | "tension", behavior: string, combined: string];
/** Reviewed exact source-trait links. Matching hints alone never manufacture a
 * fact: both the named DB trait and a strong bound natal feature must exist.
 * Short Korean feature names here are authoring keys, not customer heuristics. */
const READINGS: Readonly<Record<string, Readonly<Partial<Record<MbtiTraitArea, Reading>>>>> = {
  ENTJ: {
    career: ["executive_natural_habitat", "정관|편관|정재", "reinforce", "ENTJ는 결과를 바꿀 수 있는 자리에서 의욕이 살아나요.", "시키는 일을 빨리 끝내는 것보다 무엇을 먼저 할지 정할 때 힘이 납니다. 권한은 없는데 책임만 늘면 유난히 답답한 이유도 여기 있죠."],
    money: ["high_earning_orientation", "편재|정재|편관", "reinforce", "ENTJ에게 돈은 잘해냈다는 결과를 확인하는 방법이기도 해요.", "칭찬을 듣고 끝나는 것보다 다음 계약이나 보상에서 내 값이 달라지길 바랍니다. 욕심이 있다는 걸 굳이 숨길 필요는 없어요. 다만 일정표가 꽉 찬 것과 통장에 남은 것은 따로 볼 일입니다."],
    love: ["planned_intense_romance", "편관|도화살|홍염살", "reinforce", "ENTJ의 관심은 마음속 생각보다 구체적인 제안으로 먼저 나오는 편이에요.", "좋아하면 다음에 만날 날과 같이 할 일까지 떠올립니다. 상대를 위해 잘해주려는 마음이 큰데, 둘이 고르는 즐거움까지 혼자 끝내면 연애가 진행 보고처럼 느껴질 수 있죠."],
    study: ["high_achievement_study", "문창귀인|정관", "reinforce", "ENTJ는 어디까지 해낼지 기준이 보이면 공부에도 승부욕이 붙어요.", "문제집을 많이 산 날보다 어제 틀린 걸 오늘 맞힌 날이 더 뿌듯합니다. 목표를 잘게 나눠 스스로 실력이 오른 증거를 보는 방식이 맞아요."],
  },
  INTJ: {
    career: ["science_tech_law_fit", "정관|문창귀인|현침살", "reinforce", "INTJ는 앞뒤가 맞는 원리와 기준을 오래 다루는 일에 마음이 붙어요.", "다들 지금만 넘어가자고 해도 다음에 같은 일이 생길 이유가 보입니다. 작은 오류를 고치는 데서 그치지 않고 다시 틀리지 않을 방법을 남길 때 전문성이 드러나죠."],
    money: ["expertise_income_path", "문창귀인|정재|편재", "reinforce", "INTJ는 넓은 인기보다 남이 쉽게 대신 못 하는 실력의 값을 중요하게 봐요.", "모든 부탁을 많이 받는 것보다 어려운 문제 하나 때문에 나를 찾는 편이 좋습니다. 시간을 파는 데서 판단과 해법의 값을 받는 쪽으로 옮겨볼 만해요."],
    love: ["slow_high_standard_love", "정관|편인|정재", "reinforce", "INTJ는 설레는 순간에도 오래 함께할 수 있을지를 같이 살펴요.", "대화가 잘된다고 바로 마음의 문을 전부 열지는 않죠. 반복해서 만났을 때 말과 행동이 같은 사람, 내 생각을 성급하게 결론내리지 않는 사람에게 신뢰가 쌓입니다."],
    study: ["hard_discipline_affinity", "정인|문창귀인", "reinforce", "INTJ는 답보다 그 답이 성립하는 원리를 알고 싶어 해요.", "공식을 외울 때보다 예외가 생기는 이유를 알아낸 날에 재미가 납니다. 한 문제를 깊게 이해한 뒤 다른 문제에 적용해보면 배운 것이 서로 연결돼요."],
  },
  INTP: {
    career: ["research_field_fit", "편인|정인|문창귀인", "reinforce", "INTP는 궁금증을 일의 중심에 둘 때 오래 집중하는 편이에요.", "퇴근 시간이 아니라 질문이 풀리는 순간에 머릿속 일이 끝납니다. 남이 정리한 답을 옮기는 자리보다 모르는 것을 알아내 설명하는 역할에서 존재감이 살아나요."],
    money: ["low_material_drive", "정재|편재", "tension", "INTP 쪽에서는 돈 자체보다 궁금한 것을 이해하는 재미가 앞설 때가 있어요.", "남는 결과를 보는 명리의 결 옆에서 관심사는 자꾸 다른 방향으로 가지요. 비싼 장비에는 이유가 열 가지인데 내 작업 단가에는 말을 아낄 수 있습니다. 재미와 보상을 따로 확인하면 실력이 너무 싸게 쓰이는 일을 줄일 수 있어요."],
    love: ["careful_narrow_love", "편인|비견|정재", "reinforce", "INTP는 아무나 빨리 만나기보다 알아볼 이유가 있는 사람에게 집중해요.", "겉으로는 조용한데 상대가 꺼낸 질문 하나는 집에 와서도 생각합니다. 확인이 오래 걸릴 뿐 관심이 없는 것은 아니죠. 마음이 움직인 부분을 한마디로 알려주면 상대도 기다릴 이유를 알게 됩니다."],
    study: ["math_science_affinity", "정인|문창귀인", "reinforce", "INTP는 원리가 맞아떨어질 때 공부가 놀이처럼 바뀌어요.", "답만 맞히면 끝인데도 다른 방법으로 풀어봅니다. 그 우회가 늘 낭비는 아니죠. 대신 제출해야 할 것과 더 궁금한 것을 구분하면 깊이와 마감을 함께 지킬 수 있어요."],
  },
  ENTP: {
    career: ["verbal_profession_fit", "상관|문창귀인", "reinforce", "ENTP는 예상 밖 질문이 나왔을 때 오히려 말이 살아나요.", "준비한 설명을 그대로 읽기보다 상대의 반응에 맞춰 예시를 바꿉니다. 반박에서 이겼다는 기분보다 상대가 실제로 이해하고 움직였는지를 볼 때 말솜씨가 성과가 되죠."],
    money: ["opportunity_money_sense", "편재|상관", "reinforce", "ENTP는 안전한 반복만큼 아직 아무도 안 해본 기회에도 눈이 가요.", "누가 불편을 말하면 벌써 새 상품이 떠오릅니다. 돈이 될 만한 생각은 빠른데 가격과 마무리는 심심할 수 있죠. 흥미로운 제안 하나를 끝까지 거래로 만들어보는 경험이 중요합니다."],
    love: ["ideal_type_filter", "비견|홍염살", "reinforce", "ENTP는 누구와도 대화할 수 있어도 누구에게나 마음을 주지는 않아요.", "잘 맞춰주는 사람보다 내 생각을 재미있게 받아치면서 자기 기준도 있는 사람에게 오래 관심이 갑니다. 장난을 주고받다가도 중요한 선택에서는 분명한 대답을 듣고 싶죠."],
    study: ["interest_based_learning", "편인|문창귀인", "reinforce", "ENTP는 질문이 생긴 과목과 시키니까 하는 과목의 집중 차이가 커요.", "시험 범위를 토론거리로 바꾸거나 틀린 설명을 찾아보면 눈이 살아납니다. 싫은 과목에서도 반박하고 싶은 문제 하나를 찾는 편이 무작정 앉아 있는 것보다 나아요."],
  },
  INFJ: {
    career: ["helping_profession_fit", "정인|천을귀인|월덕귀인", "reinforce", "INFJ는 내 일이 누군가에게 어떤 변화를 남기는지 중요하게 봐요.", "고맙다는 한마디보다 그 사람이 예전에는 못 하던 것을 해낸 날이 오래 남습니다. 사람을 깊게 이해하는 장점은 크지만 모든 사정을 혼자 책임질 필요까지 생기는 것은 아니죠."],
    money: ["meaning_first_income_risk", "정재|편재", "tension", "INFJ는 조건이 좋아도 의미를 느끼지 못하면 선뜻 움직이지 않아요.", "돈과 실속을 보는 눈이 있어도 마음에 걸리는 일을 오래 해낼 수 있을지는 별개죠. 좋은 뜻이라는 이유로 내 몫을 계속 접기보다, 의미 있는 일을 오래 할 수 있게 값을 정하는 쪽이 맞습니다."],
    love: ["careful_start_deep_love", "정인|도화살", "reinforce", "INFJ는 마음을 쉽게 열지 않지만 가까워진 사람에게는 깊이 들어가요.", "즐거운 얘기만 하는 날보다 조금 어두운 마음을 말해도 분위기가 무너지지 않는 날에 믿음이 생깁니다. 내 이야기를 서둘러 고치지 않고 끝까지 듣는 사람이 편하죠."],
    study: ["graduate_depth_study", "정인|문창귀인", "reinforce", "INFJ는 한 주제의 의미가 잡히면 오래 붙드는 편이에요.", "메모를 정리하다가 왜 이게 중요했는지 자기 문장으로 다시 씁니다. 외운 양보다 관점이 남는 공부가 전문성을 키워요."],
  },
  INFP: {
    career: ["creative_arts_fit", "식신|문창귀인", "reinforce", "INFP는 설명만 맞는 결과보다 마음이 움직이는 표현을 만들고 싶어 해요.", "같은 글이나 그림도 누구에게 닿을지 떠올리면 마지막 손질이 달라집니다. 감정이 많다는 말보다 감정을 남이 알아볼 형태로 만드는 재능으로 볼 만하죠."],
    money: ["low_material_drive", "정재|편재", "tension", "INFP는 돈을 남기는 일과 내가 소중히 여기는 가치를 따로 느낄 때가 있어요.", "마음에 드는 일은 보상이 작아도 오래 해줍니다. 그렇다고 현실감각이 없는 것은 아니죠. 좋아하는 것을 계속하려면 얼마가 남아야 하는지부터 말하면 돈 이야기도 내 편이 됩니다."],
    love: ["deep_emotional_bond", "정인|홍염살", "reinforce", "INFP는 좋아하는 사람과 마음속 이야기까지 나누고 싶어 해요.", "같은 장소를 갔다는 사실보다 그날 서로 무슨 기분이었는지를 더 오래 기억합니다. 감정을 대수롭지 않게 넘기지 않는 상대 앞에서 매력이 편하게 나오죠."],
    study: ["storytelling_learning", "식신|정인|문창귀인", "reinforce", "INFP는 정보에 이야기와 자기 경험이 붙으면 기억이 오래가요.", "빈칸을 외우기보다 누군가에게 설명할 장면을 떠올립니다. 내 말로 비유를 만들다 보면 이해하지 못한 부분도 스스로 알아채게 되죠."],
  },
  ENFJ: {
    career: ["teacher_facilitator_fit", "정인|문창귀인|천을귀인", "reinforce", "ENFJ는 다른 사람의 가능성을 알아보고 꺼내줄 때 힘이 나요.", "방법만 알려주는 데서 끝나지 않고 그 사람이 해낼 때까지 관심을 둡니다. 함께한 사람이 성장한 기록은 눈에 안 보이는 친절이 아니라 맡겨볼 만한 실력이죠."],
    money: ["generous_spending", "식신|정인", "reinforce", "ENFJ는 좋아하는 사람에게 쓰는 돈을 아깝게 느끼지 않는 편이에요.", "선물을 고를 때 내가 필요한 것보다 상대 표정이 먼저 떠오릅니다. 그 넉넉함은 관계의 장점이지만 매번 내가 내는 것이 당연한 약속은 아니죠."],
    love: ["full_hearted_love", "정관|정인|홍염살", "reinforce", "ENFJ는 좋아하면 지금의 즐거움 옆에 함께할 미래도 그려요.", "상대가 지나가듯 말한 계획을 기억했다가 다음 이야기를 꺼냅니다. 챙기는 마음이 든든한 만큼 상대가 혼자 결정할 자리도 남겨주면 더 편한 사랑이 되죠."],
    study: ["fast_social_learning", "정인|식신|문창귀인", "reinforce", "ENFJ는 사람에게 설명하고 반응을 들을 때 배운 것이 살아나요.", "스터디에서 누가 막히면 대신 설명하다가 내 이해도 또렷해집니다. 알려주는 즐거움과 내 진도를 같이 챙기면 서로 돕는 공부가 힘이 돼요."],
  },
  ENFP: {
    career: ["counseling_fit", "정인|식신|천을귀인", "reinforce", "ENFP는 사람의 이야기를 듣다가 다른 가능성을 떠올리는 편이에요.", "처음에는 별개로 들리던 경험들이 대화 중에 연결됩니다. 상대도 미처 말하지 못한 선택지를 보여줄 때 활발함이 가벼움이 아니라 재능으로 보이죠."],
    money: ["experience_spending", "역마살|식신|편재", "reinforce", "ENFP는 쌓아둔 물건보다 나눌 이야기가 생기는 경험에 돈을 쓰고 싶어 해요.", "여행이나 수업을 고를 때 가격 옆에 거기서 만날 사람과 새로 해볼 일이 떠오릅니다. 그 경험이 다음 작업과 만남으로 이어지면 소비도 나만의 재료가 되죠."],
    love: ["passionate_romance", "홍염살|도화살", "reinforce", "ENFP는 좋아하는 사람에게 생기는 호기심을 잘 숨기지 못해요.", "친구에게 관심 없다고 했는데 그 사람 얘기가 제일 깁니다. 반응을 나누는 매력이 있는 만큼 내 즐거움뿐 아니라 상대가 편하게 따라올 속도도 알면 좋아요."],
    study: ["interest_switch_learning", "편인|식신|문창귀인", "reinforce", "ENFP는 왜 배워야 하는지가 내 이야기와 연결될 때 집중이 확 달라져요.", "자료만 읽던 날보다 직접 설명하거나 작게 만들어본 날에 더 많이 기억합니다. 재미를 포기하고 버티기보다 배운 걸 쓸 장면을 먼저 만드는 쪽이 맞죠."],
  },
  ISTJ: {
    career: ["public_institution_fit", "정관|정재", "reinforce", "ISTJ는 책임과 기록이 분명할수록 실력을 안정적으로 보여줘요.", "마감 직전에 누가 했는지부터 찾는 팀보다 처음부터 맡을 범위가 보이는 곳이 좋습니다. 조용히 빠진 것을 채우는 솜씨가 반복될수록 다시 맡기고 싶은 사람이 되죠."],
    money: ["stable_income_preference", "정재|정관", "reinforce", "ISTJ는 예측 가능한 수입과 약속을 든든하게 느껴요.", "한 번 크게 들어온 돈보다 다음 달 계획도 세울 수 있는 보상이 편합니다. 성실하게 해낸 일을 기록으로 남기면 꾸준함이 실제 협상의 이유가 돼요."],
    love: ["trust_first_love", "정관|정재", "reinforce", "ISTJ는 설레는 말보다 작은 약속을 지키는 행동에서 믿음을 얻어요.", "예쁘게 말한 날보다 바쁜데도 시간을 맞춰준 날이 더 오래 남습니다. 본인도 행동으로 충분히 표현했다고 생각하지만 상대에게는 짧은 설명이 있으면 더 잘 전해지죠."],
    study: ["traditional_exam_strength", "정인|정관|문창귀인", "reinforce", "ISTJ는 범위와 기준이 보이는 공부를 차곡차곡 해내는 편이에요.", "틀린 문제를 표시하고 며칠 뒤 다시 풀어보는 과정이 힘이 됩니다. 한 번 아는 것과 시험장에서 꺼낼 수 있는 것을 구별하는 꼼꼼함이 있어요."],
  },
  ISFJ: {
    career: ["service_stability_career", "정인|정관|천을귀인", "reinforce", "ISFJ는 내 수고가 누군가의 하루를 편하게 만드는 일을 중요하게 봐요.", "남들이 끝났다고 생각한 뒤에도 불편할 곳을 한 번 더 살핍니다. 당연한 친절로만 넘기기에는 반복할수록 믿음이 쌓이는 실력이죠."],
    money: ["frugal_stable_money", "정재|정인", "reinforce", "ISFJ는 돈이 생활을 지켜준다는 느낌을 소중히 여겨요.", "충동적으로 큰 것을 사기보다 필요한 지출을 미리 떠올립니다. 내가 편히 쉴 몫까지 남겨두는 것도 아끼는 능력의 일부죠."],
    love: ["slow_trust_love", "정인|정재", "reinforce", "ISFJ는 여러 번 지켜본 뒤 믿음이 생기면 마음을 깊게 주는 편이에요.", "상대가 아프다는 말보다 평소 피곤해 보였던 표정부터 기억합니다. 작은 챙김을 알아봐주는 사람 곁에서 오래 따뜻할 수 있죠."],
    study: ["dutiful_study_rhythm", "정인|정관|문창귀인", "reinforce", "ISFJ는 오늘 할 몫이 보일 때 배움을 꾸준히 이어가요.", "거창한 결심보다 어제 표시해둔 부분부터 다시 펴봅니다. 남의 속도를 따라가기보다 익숙한 반복에 새 문제를 하나씩 더하면 자신감도 쌓여요."],
  },
  ESTJ: {
    career: ["management_leadership_fit", "정관|편관|비견", "reinforce", "ESTJ는 누가 무엇을 끝낼지 분명할 때 일의 속도를 만들어요.", "회의가 길어지면 속으로 결론부터 묻게 됩니다. 기준을 정하고 끝까지 확인하는 장점은 크지만 다른 사람이 따라올 설명까지 생략하지는 않는 편이 좋아요."],
    money: ["economic_stability_drive", "정재|편재|정관", "reinforce", "ESTJ는 해낸 일에 현실적인 보상이 따라오는 것을 중요하게 봐요.", "노력했다는 위로보다 평가와 역할이 어떻게 달라졌는지가 궁금합니다. 맡은 결과를 분명히 보여줄 수 있는 환경에서 돈과 인정 모두 이야기할 힘이 생기죠."],
    love: ["stable_long_term_love", "정관|정재", "reinforce", "ESTJ는 관계를 시작하면 믿고 오래 갈 수 있는 생활을 만들고 싶어 해요.", "기념일만 잘 챙기기보다 평소 약속과 시간을 지키는 쪽입니다. 다만 사랑하는 사람이 내 계획에 참여하는 것과 그대로 따르는 것은 다르죠."],
    study: ["exam_structure_advantage", "정관|정인|문창귀인", "reinforce", "ESTJ는 공부에서도 기준과 결과가 뚜렷하면 집중이 올라가요.", "남은 분량을 나누고 오늘 끝낸 것을 확인하는 방식이 편합니다. 익숙한 유형을 빨리 푸는 힘 옆에 낯선 문제를 천천히 보는 시간도 남겨두면 좋아요."],
  },
  ESFJ: {
    career: ["service_helping_fit", "정인|식신|천을귀인", "reinforce", "ESFJ는 도움받는 사람의 표정이 보일 때 일의 보람도 선명해져요.", "절차만 끝내기보다 상대가 제대로 이해했는지 한 번 더 묻습니다. 사람을 편하게 만드는 힘을 눈치나 친절로만 작게 볼 필요는 없죠."],
    money: ["save_and_enjoy", "정재|식신", "reinforce", "ESFJ는 돈을 모으는 안정감과 함께 즐기는 기쁨을 같이 원해요.", "평소에는 아끼다가 좋은 사람들과 먹는 한 끼에는 마음이 풀립니다. 절약과 넉넉함이 서로 모순이라기보다 돈을 쓸 이유가 다른 거죠."],
    love: ["observing_then_devoted", "정관|식신|홍염살", "reinforce", "ESFJ는 믿을 만한 사람인지 살핀 뒤 가까워지면 관심을 아끼지 않아요.", "오늘 무슨 일이 있었는지 묻고 같이 기뻐할 작은 일도 찾습니다. 그 반응을 상대도 조금씩 돌려줄 때 사랑받는 느낌이 커지죠."],
    study: ["rote_exam_strength", "정인|문창귀인", "reinforce", "ESFJ는 분명한 범위를 반복하며 실력을 확인하는 공부가 편해요.", "친구와 서로 문제를 내고 답을 설명하면 놓친 부분을 빨리 발견합니다. 모르는 것을 같이 확인하는 과정이 혼자 불안해하는 시간을 줄여주죠."],
  },
  ISTP: {
    career: ["hands_on_technical_fit", "편관|역마살", "reinforce", "ISTP는 설명을 오래 듣기보다 실제로 작동하는지 확인하고 싶어 해요.", "문제가 생기면 원인을 눈으로 보고 손댈 곳부터 찾습니다. 현장에서 바로 고쳐 결과를 확인할 수 있을 때 담백한 실력이 잘 보이죠."],
    money: ["practical_spending", "식신|편재", "reinforce", "ISTP는 남에게 보여줄 물건보다 실제로 잘 쓸 도구에 돈을 쓰는 편이에요.", "가격이 있어도 오래 쓰고 제대로 작동하면 납득합니다. 필요 없는 장식을 줄이는 만큼 내 솜씨를 너무 싼 값에 넘기지 않는 기준도 있으면 좋아요."],
    love: ["freedom_love_boundary", "비견|역마살", "reinforce", "ISTP는 좋아하는 사람과도 자기 시간과 선택을 남겨두고 싶어 해요.", "같이 있다가 각자 취미를 해도 마음이 멀어졌다고 보지 않습니다. 혼자 쉬고 돌아온 뒤 더 편하게 챙기는 모습이 이 사람의 애정일 수 있죠."],
    study: ["hands_on_learning", "식신", "reinforce", "ISTP는 직접 만지고 바꿔볼 때 이해가 빨라져요.", "설명서 한 장을 더 읽는 것보다 작은 것을 분해하고 다시 맞춰봅니다. 해본 뒤 이유를 정리하면 감각으로 알던 것이 다른 문제에도 쓸 실력이 돼요."],
  },
  ISFP: {
    career: ["artistic_expression_fit", "식신|도화살|홍염살", "reinforce", "ISFP는 색이나 소리, 손에 닿는 느낌처럼 실제 감각을 세심하게 다뤄요.", "말로 길게 설득하기보다 결과물을 보여줄 때 나다운 장점이 드러납니다. 남에게는 작은 차이여도 내가 끝까지 손보는 부분이 작업의 매력을 만들죠."],
    money: ["low_income_risk_due_to_softness", "정재", "tension", "ISFP는 내 재능의 값을 강하게 말하는 일이 편하지 않을 수 있어요.", "명리에서는 남는 결과를 챙기려는데 실제 대화에서는 상대 사정부터 듣게 되는 거죠. 잘한 일을 싸게 해주는 것과 다정한 사람이 되는 것은 같은 뜻이 아닙니다."],
    love: ["slow_open_romantic", "정재|홍염살|도화살", "reinforce", "ISFP는 마음을 열기까지 천천히 살피지만 좋아하면 생활 속 표현이 늘어요.", "함께 듣던 음악을 다시 틀거나 상대가 싫다던 것을 다음 선택에서 빼둡니다. 본인은 그냥 기억한 것뿐인데 상대에게는 꽤 큰 다정함으로 남죠."],
    study: ["hands_on_learning", "식신|역마살", "reinforce", "ISFP는 보고 듣고 직접 해보는 공부에서 몰입하기 쉬워요.", "완벽한 설명보다 작은 시제품이나 실습 한 번이 기억에 남습니다. 손으로 익힌 감각에 짧은 기록을 붙이면 다음에도 꺼내 쓸 수 있어요."],
  },
  ESTP: {
    career: ["live_content_fit", "상관|도화살|홍염살", "reinforce", "ESTP는 현장의 반응을 보고 바로 방향을 바꾸는 데 강해요.", "계획과 다른 질문이 나와도 얼어붙기보다 맞는 예시를 꺼냅니다. 사람 앞에서 바로 써볼 수 있는 순발력이 좋은 패죠."],
    money: ["high_income_action_drive", "편재|식신|역마살", "reinforce", "ESTP는 사람을 만나고 직접 움직이며 돈의 기회를 확인해요.", "이론으로만 좋은 제안보다 현장에서 누가 실제로 원하는지부터 봅니다. 시작은 빠른 만큼 계약 조건과 남는 돈까지 직접 확인하면 행동력이 실속으로 이어지죠."],
    love: ["fun_active_love", "식신|역마살|도화살", "reinforce", "ESTP는 함께 새로운 일을 해볼 때 마음도 더 생생해져요.", "오래 앉아 관계를 설명하는 것보다 같이 걸으며 웃은 시간이 먼저 떠오릅니다. 즐거움을 만드는 매력 옆에 상대가 조용히 쉬고 싶은 날도 알아주면 더 편해지죠."],
    study: ["experiential_learning", "식신|역마살", "reinforce", "ESTP는 해본 경험을 바탕으로 이유를 이해하는 쪽이 빨라요.", "처음부터 이론을 다 외우기보다 작은 실전 문제에 부딪혀봅니다. 틀린 직후의 궁금증을 놓치지 않으면 빠른 행동이 얕은 이해로 끝나지 않아요."],
  },
  ESFP: {
    career: ["entertainment_fit", "상관|도화살|홍염살", "reinforce", "ESFP는 사람들의 반응이 돌아오는 자리에서 표현이 살아나요.", "분위기가 처지면 준비한 말만 밀지 않고 보여주는 방식을 바꿉니다. 현장을 생기 있게 만드는 재능은 즐거움과 성과를 함께 만들 수 있는 힘이죠."],
    money: ["experience_spending", "식신|편재|도화살", "reinforce", "ESFP는 함께 즐기고 새롭게 느낄 경험에 돈의 의미를 둬요.", "나중을 위해 무조건 참는 생활보다 지금도 기쁠 몫이 있어야 계획을 오래 지킵니다. 즐거움에 쓸 돈을 먼저 정하면 마음껏 쓴 뒤 불안해지는 일도 줄어요."],
    love: ["expressive_love_style", "식신|홍염살|도화살", "reinforce", "ESFP는 좋아하는 마음이 표정과 행동에 잘 드러나요.", "상대가 웃으면 나도 신나서 다음에 같이 할 일을 꺼냅니다. 관심을 받고 있다는 느낌을 주는 매력이 있죠. 반응이 느린 사람이 꼭 마음도 적은 것은 아니에요."],
    study: ["study_sitting_dislike", "식신|역마살", "reinforce", "ESFP는 오래 앉아서 보기만 하는 공부보다 움직이고 반응하는 공부가 편해요.", "배운 걸 직접 보여주거나 친구에게 퀴즈를 내면 기억이 붙습니다. 지루함을 참고 버티는 시간만 늘리기보다 내 몸과 말을 공부에 같이 쓰는 쪽이 낫죠."],
  },
};

// Additional reviewed links cover different manifestations, not the same trait
// retold in every chapter. Source IDs must exist and natal labels must be strong.
const ADDITIONAL: readonly { type: string; area: MbtiTraitArea; domains: readonly Domain[]; reading: Reading }[] = [
  { type: "ISFP", area: "career", domains: ["work", "identity"], reading: ["autonomous_field_work", "비견|역마살", "reinforce", "ISFP는 직접 보고 판단할 여지가 있을 때 실력이 편하게 나와요.", "설명한 순서와 현장이 다르면 눈앞의 사정에 맞게 손을 움직입니다. 계속 확인받느라 멈추는 자리보다 끝낼 범위와 시간을 알고 방법은 고를 수 있는 곳이 좋죠. 조용하다고 시키는 대로만 일할 사람은 아닙니다."] },
  { type: "ISFP", area: "career", domains: ["work"], reading: ["ordinary_office_possible_but_limited", "편인", "reinforce", "ISFP는 같은 서류를 다뤄도 그 뒤에 누가 있는지 보이면 의욕이 달라져요.", "빈칸을 채우는 일을 반복하다가도 누군가 계속 불편해하는 이유를 발견하면 직접 확인하고 싶어집니다. 일의 이름보다 내가 알아낸 것이 사람의 하루를 어떻게 바꾸는지가 중요하죠. 의미 없는 반복에는 조용히 마음이 멀어질 수 있어요."] },
  { type: "ISFP", area: "workplace", domains: ["work", "relationships"], reading: ["direct_with_close_people", "현침살", "reinforce", "ISFP는 낯선 사람에게 아끼던 솔직한 말을 믿는 사람 앞에서 꺼내요.", "첫 대화에서는 넘어간 작은 차이를 가까운 동료에게는 콕 집습니다. 말이 없어서 못 본 줄 알았던 사람은 의외라고 느끼죠. 까다로운 눈을 숨기는 데보다 상대가 고칠 수 있게 설명하는 데 쓰면 조용한 관찰이 실력으로 보입니다."] },
  { type: "ISFP", area: "thinkingStyle", domains: ["strengths", "identity"], reading: ["sensory_truth_detector", "현침살", "reinforce", "ISFP는 말과 표정이 서로 다르면 설명하기 전에 먼저 알아차리는 편이에요.", "괜찮다고 하는데 시선이 자꾸 피하는 순간, 마음속에서는 물음표가 생깁니다. 아직 이유를 길게 말하지 못해도 그냥 넘기지 않는 감각이 있죠. 느낌을 결론으로 서두르지 않고 한 번 더 물으면 세심함이 신뢰를 지키는 힘이 돼요."] },
  { type: "ISFP", area: "study", domains: ["study"], reading: ["flexible_goal_study", "비견", "reinforce", "ISFP는 촘촘한 시간표보다 오늘 직접 해볼 작은 목표가 있을 때 공부를 이어가기 편해요.", "여섯 시간 앉아 있으라는 계획은 답답한데, 예시 하나를 내 방식으로 만들어보자는 과제에는 손이 갑니다. 스스로 방법을 고르는 힘을 진도와 싸우게 할 필요는 없죠. 하루 끝에 내가 해낸 것이 눈에 보이면 다음에도 펴볼 이유가 생겨요."] },
  { type: "ISFP", area: "money", domains: ["money"], reading: ["steady_income_boundary", "비견", "reinforce", "ISFP에게 예측할 수 있는 수입은 자유를 막는 틀보다 자기 리듬을 지켜주는 바닥에 가까워요.", "도와달라는 부탁을 전부 받아주는 날에는 내 일을 고를 여유부터 줄어듭니다. 어디까지 맡고 무엇부터는 따로 이야기할지 알면 사람에게 부드럽게 대하면서도 내 몫을 지킬 수 있죠. 마음이 편한 것과 아무 조건 없이 해주는 것은 다릅니다."] },
];

export function auditContentMbtiLinks() {
  return [...Object.entries(READINGS).flatMap(([type, entries]) => Object.entries(entries).map(([area, reading]) => ({ type, area: area as MbtiTraitArea, reading }))), ...ADDITIONAL].map(({ type, area, reading }) => {
    const source = getMbtiSourceProfile(type)?.traits?.[area]?.find(t => t.id === reading[0]);
    return { type, area, trait: reading[0], labels: reading[1].split("|"), supported: Boolean(source?.plainKo && ["direct", "inferred"].includes(source.sourceCoverage ?? "")) };
  });
}

export function chapterMbtiReadings(type: string | null | undefined, roots: readonly BoundMaterial[], domain: Domain, used: ReadonlySet<string>) {
  const profile = getMbtiSourceProfile(type);
  if (!profile) return [];
  const areas: readonly MbtiTraitArea[] = domain === "money" ? ["money"] : domain === "study" ? ["study"] :
    domain === "love" ? ["love"] : domain === "marriage" ? ["marriage"] : domain === "relationships" ? ["relationships"] :
    domain === "work" ? ["career", "workplace"] : ["thinkingStyle", "career", "study", "money"];
  const options = [...areas.map(area => ({ area, reading: READINGS[profile.type]?.[area] })),
    ...ADDITIONAL.filter(r => r.type === profile.type && r.domains.includes(domain))];
  return options.flatMap(({ area, reading: r }) => {
    if (!r || used.has(`${profile.type}:${r[0]}`)) return [];
    const source = profile.traits?.[area]?.find(t => t.id === r[0]);
    const root = roots.find(m => r[1].split("|").includes(materialLabel(m)));
    if (!root || !source?.plainKo || !["direct", "inferred"].includes(source.sourceCoverage ?? "")) return [];
    return [{ id: `${profile.type}:${r[0]}`, kind: r[2], root, behavior: r[3], combined: r[4],
      provenance: `mbti:${profile.type}:traits:${area}:${r[0]}`,
      coverage: source.sourceCoverage, area }];
  });
}
