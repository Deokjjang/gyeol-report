import type { CompatibilityEvidencePacket } from "./compatibilityEvidenceBuilder";
import type { CompatibilityCanonicalRelationshipType } from "./compatibilityTypes";
import type { CompatibilityDeepSajuLayer } from "./compatibilityDeepSajuBridge";
import type { MbtiTraitArea } from "./mbti/sourceRuntimeAdapter";

type PairField = "sharedGround" | "friction" | "positiveInfluence" | "repairStrategy" | "lovePattern" | "marriagePattern";
type Question = {
  readonly title: string;
  readonly area: MbtiTraitArea;
  readonly pairField: PairField;
  readonly layer: CompatibilityDeepSajuLayer;
  readonly scene: string;
  readonly action: string;
  readonly caution: string;
};
// These are relationship questions and conditional operating suggestions, never personality assignments.
const q = (title: string, area: MbtiTraitArea, pairField: PairField, layer: CompatibilityDeepSajuLayer, scene: string, action: string, caution: string): Question =>
  ({ title, area, pairField, layer, scene, action, caution });

export const compatibilityCategoryQuestions: Record<CompatibilityCanonicalRelationshipType, readonly Question[]> = {
  love: [
    q("끌림과 실제 편안함", "love", "lovePattern", "day_master_relation", "처음 마음이 움직이는 이유와 사귀면서 편안한 이유는 다를 수 있습니다. 새 만남을 제안한 행동이 반가웠는지, 거절하기 어려웠는지를 나눠 보면 두 사람의 끌림이 일방적인 추진으로 바뀌는 지점을 찾을 수 있습니다.", "다음 만남은 각자가 하고 싶은 경험 하나와 원하지 않는 방식 하나를 함께 꺼내 정해 보세요.", "적극적인 표현이 상대의 동의를 대신하지는 않습니다. 반응이 조용하다는 이유만으로 마음이 없다고 판단하지 마세요."),
    q("표현이 애정으로 도착하는 조건", "relationships", "positiveInfluence", "cross_ten_god", "도와주려는 말과 위로받고 싶은 순간이 엇갈리면 애쓴 사람이 오히려 서운해집니다. 두 사람에게 도움이 되는 자극을 애정 표현에 쓰되, 조언을 원하는 날과 함께 있어 주길 원하는 날을 구별하는 것이 오래 가는 힘입니다.", "힘든 이야기를 들을 때 해결책, 공감, 동행 중 지금 필요한 것을 먼저 물어보세요.", "상대가 좋아했던 표현도 매번 정답은 아닙니다. 고마워하지 않는다고 몰아붙이면 돌봄이 빚처럼 느껴질 수 있습니다."),
    q("가까워지는 속도와 친밀감", "thinkingStyle", "friction", "spouse_palace", "만나는 빈도, 관계를 공개하는 시점, 혼자 쉴 시간은 같은 속도로 정해지지 않습니다. 어느 한쪽을 빠른 사람으로 고정하지 말고, 이번 선택을 원하는 이유와 아직 준비되지 않은 부분을 각각 들어야 합니다.", "친밀감의 다음 단계는 두 사람이 편안하게 동의한 범위까지만 정하고, 나중에 바꿀 여지도 남기세요.", "확인받고 싶은 마음이 즉답 요구로 바뀌면 친밀감보다 압박이 커집니다. 침묵을 동의로 해석하지 마세요."),
    q("연락과 거리의 해석", "communication", "sharedGround", "month_rhythm", "연락이 줄어든 날에는 답장 횟수보다 어떤 기대가 깨졌는지를 살펴보세요. 바쁜 일정과 관계에서 물러서고 싶은 마음은 같은 사실이 아니며, 이 자료만으로 질투나 통제 성향을 확정할 수 없습니다.", "바쁜 날 보낼 짧은 안내와 나중에 이야기할 시간을 함께 정하면 매번 마음을 시험할 필요가 줄어듭니다.", "연락 기록을 애정 점수처럼 비교하면 사정 설명이 변명으로 들리기 쉽습니다. 실제 약속을 어긴 일과 추측을 분리하세요."),
    q("싸운 뒤 다시 대화하는 방식", "growth", "repairStrategy", "branch_harm", "다툼 뒤 사과의 말은 같아도 회복됐다고 느끼는 시점은 다를 수 있습니다. 잘못한 행동을 인정하는 일, 당시 의도를 설명하는 일, 다음 행동을 바꾸는 일을 한꺼번에 끝내려 하지 않아야 합니다.", "다시 대화할 때는 상처가 된 한 행동과 바라는 한 행동을 말하고, 설명을 들을 차례를 번갈아 가지세요.", "사과를 받았다는 이유로 감정까지 즉시 끝내라고 요구하면 같은 싸움이 다른 사건으로 돌아올 수 있습니다."),
    q("데이트 비용과 선택권", "money", "sharedGround", "combined_element_climate", "돈을 더 쓴 사람이 만남의 방식까지 정하게 되면 배려와 결정권이 뒤섞입니다. 데이트 비용은 소득이나 사랑의 크기를 평가하기보다 두 사람이 지속할 수 있는 만남의 범위를 찾는 질문으로 다루세요.", "부담 없는 예산과 각자 고르고 싶은 만남을 따로 정해 한 사람이 계속 부담하거나 선택하지 않게 하세요.", "금전 성향은 실제 소득이나 지급 능력의 증거가 아닙니다. 비용에 대한 침묵을 여유가 있다는 뜻으로 받아들이지 마세요."),
    q("각자의 생활을 지키는 연애", "love", "friction", "hour_life_rhythm", "일과 친구, 휴식을 모두 연애 뒤로 미루면 자주 만나는 동안에도 소진될 수 있습니다. 각자의 회복 방식이 상대를 배제하려는 의도인지, 관계를 오래 이어 갈 여력을 만드는 것인지 구분할 필요가 있습니다.", "함께 보내는 시간뿐 아니라 약속하지 않는 시간도 정하고, 변경이 필요할 때 알리는 방법을 합의하세요.", "개인시간을 허락받는 구조가 굳어지면 자율성이 서운함과 맞바뀝니다. 오래 유지하기 어려운 약속은 일찍 줄이세요."),
    q("오래 가기 위한 관계 점검", "relationships", "repairStrategy", "element_complement", "처음의 매력을 유지하는 것보다 두 사람 모두 관계 안에서 자기 모습을 잃지 않는지가 중요합니다. 반복되는 갈등에서 늘 같은 사람이 양보한다면 해결된 것이 아니라 보류된 것일 수 있습니다.", "최근 편했던 순간과 억지로 맞췄던 순간을 하나씩 나누고, 다음 달에는 어떤 만남을 바꿀지 정해 보세요.", "잘 맞는 근거가 있어도 실제 불편함을 덮는 이유가 될 수는 없습니다. 관계의 지속 여부는 두 사람의 경험과 선택으로 판단합니다."),
  ],
  marriage: [
    q("공동생활의 기본 온도", "marriage", "marriagePattern", "day_master_relation", "함께 살 때는 특별한 날보다 피곤한 평일의 모습이 자주 만납니다. 두 사람의 결혼관이 같은 목표를 향하더라도 집에서 원하는 안정, 대화, 정리의 수준이 같은지는 따로 살펴야 합니다.", "평일 저녁에 꼭 필요한 휴식과 함께 하고 싶은 일을 각자 적어 공동생활의 최소 기준부터 정하세요.", "생활 방식이 다른 일을 사랑의 부족으로 해석하면 작은 습관까지 인격 평가가 될 수 있습니다."),
    q("장기 생활을 지탱하는 보완", "relationships", "positiveInfluence", "cross_ten_god", "한 사람의 강점이 다른 사람에게 실제 도움이 되는 일을 찾아야 역할 분담이 지속됩니다. 잘하는 사람이 계속 맡는 것과 맡고 싶은 사람이 책임지는 것은 다르며, 능력 때문에 돌봄을 독점하지 않도록 살펴야 합니다.", "고마웠던 돌봄을 구체적으로 말한 뒤 그 일을 계속 맡아도 괜찮은지, 쉬는 날에는 누가 대신할지 정하세요.", "일상 운영을 한 사람이 다 기억하는 구조라면 눈에 보이는 가사만 절반씩 나눠도 부담이 같아지지 않습니다."),
    q("가사와 보이지 않는 역할", "thinkingStyle", "friction", "month_rhythm", "청소, 식사, 일정 관리에는 실행뿐 아니라 알아차리고 준비하는 노동이 들어갑니다. 각자의 완성 기준이 다를 때는 누가 더 부지런한지보다 어느 수준까지 하면 끝난 일인지가 먼저입니다.", "자주 미뤄지는 가사 하나를 골라 준비·실행·마무리 담당과 완료 기준을 함께 정해 보세요.", "상대가 말할 때만 돕는 방식은 관리 책임을 한쪽에 남깁니다. 부탁하는 사람을 예민한 사람으로 만들지 마세요."),
    q("가족 경계와 공동 결정권", "communication", "sharedGround", "spouse_palace", "원가족 방문, 경조사 비용, 중요한 이사 결정은 한 사람의 익숙한 관행이 두 사람의 규칙이 되기 쉬운 장면입니다. 각자 가족을 존중하는 일과 공동생활의 결정권을 지키는 일은 함께 다뤄야 합니다.", "외부 가족에게 답하기 전 두 사람이 먼저 의논할 사안과 각자 결정해도 되는 사안을 나누세요.", "한쪽 가족의 기대를 이미 정해진 일로 전달하면 배우자는 협의 상대가 아닌 통보 대상으로 느낄 수 있습니다."),
    q("오래 쌓인 갈등의 회복", "growth", "repairStrategy", "branch_harm", "장기 갈등에서는 당장 벌어진 사건에 과거의 미해결 부담이 겹칩니다. 이번 문제를 고치는 대화와 오랫동안 인정받지 못한 수고를 다루는 대화를 구분해야 상대의 설명을 또 다른 회피로 듣지 않을 수 있습니다.", "같은 갈등이 돌아오면 지난 합의가 실제로 실행됐는지부터 보고, 지키기 어려웠던 조건을 바꾸세요.", "기억이 다른 과거를 끝없이 입증하려 하면 오늘 바꿀 행동이 사라집니다. 감정 인정과 실행 책임을 따로 확인하세요."),
    q("공동 지출과 개인의 돈", "money", "friction", "combined_element_climate", "공동생활비, 저축, 개인 지출은 돈의 액수뿐 아니라 자율성과 안전감의 문제입니다. 두 사람의 금전 성향을 같은 자산 선택으로 묶지 말고 어느 지출부터 공동 동의가 필요한지를 살피세요.", "공동 부담과 개인 재량을 나누고 큰 지출 전에 알릴 기준을 정하세요. 금액은 실제 형편을 확인해 결정해야 합니다.", "수입이 더 많다는 이유로 공동 결정권을 독점하면 돈 문제가 존중의 문제로 커질 수 있습니다."),
    q("개인시간과 부모 역할의 관점", "marriage", "sharedGround", "hour_life_rhythm", "함께 쉬는 방식과 혼자 회복하는 방식이 다르면 같은 집에서도 휴식이 보장되지 않을 수 있습니다. 자녀가 있거나 돌봄을 논의한다면 교육관보다 먼저 누가 언제 쉴 수 있는지를 구체적으로 확인하는 편이 낫습니다.", "돌봄을 맡는 경우에는 교대 시간과 도움 요청 방식을 먼저 정하고, 각자의 개인시간도 일정에 넣으세요.", "이 자료는 출산 가능성이나 실제 부모로서의 능력을 판단하지 않습니다. 부모 역할은 어느 성별이나 입력 위치에도 자동 배정되지 않습니다."),
    q("생활 조건이 바뀔 때의 재합의", "relationships", "repairStrategy", "element_complement", "이직, 소득 변화, 가족 돌봄이 생기면 예전에 공평했던 분담도 버거워질 수 있습니다. 결혼의 안정은 처음 약속을 끝까지 고수하는 데만 있지 않고 바뀐 조건을 두 사람이 함께 인정하는 데 있습니다.", "부담이 늘어난 시기에는 역할·돈·휴식 중 무엇을 임시로 조정하고 언제 다시 볼지 정하세요.", "한 사람이 계속 견뎌야 유지되는 운영은 오래 가기 어렵습니다. 고마움의 표현만으로 불균형을 대신하지 마세요."),
  ],
  parentChild: [
    q("가족 안에서 마음이 열리는 조건", "relationships", "sharedGround", "day_master_relation", "부모자녀 관계의 친밀함은 모든 생각을 같게 만드는 데 있지 않습니다. 서로 편하게 설명할 수 있는 주제가 무엇인지에서 시작하면 규칙을 말하기 전에도 관계의 통로를 만들 수 있습니다.", "평가할 필요가 없는 일상 이야기부터 나누고, 조언을 원하는지 들어 주길 원하는지 물어보세요.", "입력만으로 누가 부모인지 알 수 없습니다. 아래 역할별 제안은 실제 부모와 자녀가 각자의 위치에 맞춰 읽어야 합니다."),
    q("기대가 응원으로 전달되는 방식", "growth", "positiveInfluence", "cross_ten_god", "기대는 가능성을 믿는 말일 수도 있고 성과를 증명하라는 압박일 수도 있습니다. 부모 역할에서는 결과와 관계없는 지지를, 자녀 역할에서는 어떤 응원이 힘이 되는지를 구체적으로 말할 수 있어야 합니다.", "잘한 결과만 칭찬하기보다 선택한 이유와 들인 노력을 묻고, 도움이 필요했던 순간도 함께 들어 보세요.", "부모의 좋은 의도가 자녀에게 그대로 전달된다고 가정하면 답답함을 버릇없음으로 오해하기 쉽습니다."),
    q("규칙과 자율의 경계", "thinkingStyle", "friction", "month_rhythm", "귀가, 생활 습관, 공부 시간을 정할 때는 안전에 필요한 제한과 익숙해서 유지하는 규칙을 나눠야 합니다. 자율권을 늘릴 조건이 없으면 규칙을 잘 지켜도 독립으로 이어지지 않을 수 있습니다.", "부모 역할에서는 규칙의 이유와 조정 가능한 범위를 설명하고, 자녀 역할에서는 스스로 책임질 선택을 제안하세요.", "부모라는 이유로 통제적이라고, 자녀라는 이유로 반항적이라고 판단하지 않습니다. 실제로 이견을 말할 기회가 있는지를 보세요."),
    q("감정이 커진 날의 반응", "communication", "sharedGround", "branch_clash", "말투가 날카로워진 순간에는 감정과 허용할 행동을 함께 다룰 필요가 있습니다. 속상함을 인정하는 것과 모든 행동을 허용하는 것은 같지 않으며 설명이 훈계로 들리는 조건을 두 사람 각각에서 찾아야 합니다.", "부모 역할에서는 감정의 이유를 듣고 행동의 한계를 따로 말하세요. 자녀 역할에서는 어떤 말이 부담이었는지 장면으로 설명해 보세요.", "화가 난 이유를 듣기 전에 옳고 그름만 정하면 다음에는 사건을 숨기게 될 수 있습니다. 실제 반응을 확인하며 대화 방식을 조정하세요."),
    q("공부와 피드백", "thinkingStyle", "repairStrategy", "branch_harm", "공부를 이야기할 때 이해가 막힌 것과 실행이 어려운 것을 같은 게으름으로 묶지 않아야 합니다. 두 사람의 생각 정리 방식이 다르면 설명을 더 하는 일이 도움이 아니라 간섭으로 느껴질 수 있습니다.", "결과를 확인하기 전에 어디서 막혔는지 묻고, 설명·함께 계획하기·혼자 시도하기 중 필요한 도움을 고르게 하세요.", "성향 자료는 지능이나 성적의 예측이 아닙니다. 익숙한 학습 방법을 상대에게도 맞는 방법으로 확정하지 마세요."),
    q("가족의 지원과 책임", "money", "friction", "combined_element_climate", "용돈, 학비, 생활 지원을 다룰 때는 제공하는 자원과 기대하는 책임을 분리해야 합니다. 지원이 생각과 진로를 따를 의무로 바뀌면 고마움보다 협상할 수 없는 부담이 커질 수 있습니다.", "지원 가능한 범위와 본인이 관리할 항목을 실제 상황에 맞춰 정하고, 사정이 바뀌면 알릴 시점을 약속하세요.", "경제적 의존만으로 의견을 말할 권리가 사라지지는 않습니다. 이 해석으로 부모나 자녀의 재정 능력을 판단하지 마세요."),
    q("독립을 준비하는 거리", "relationships", "positiveInfluence", "hour_life_rhythm", "독립은 연락을 끊는 일이 아니라 도움을 요청할 수 있으면서 자신의 선택을 책임지는 과정으로 볼 수 있습니다. 부모가 놓치기 쉬운 것은 보호가 필요한 영역이 바뀐다는 점이고, 자녀는 독립 의사를 침묵으로만 전할 때 오해받기 쉽습니다.", "혼자 해 볼 일, 미리 상의할 일, 도움이 필요할 때 연락할 일을 나눠 선택 범위를 단계적으로 조정하세요.", "연락 빈도만으로 효도나 관심을 평가하면 필요한 도움도 숨길 수 있습니다. 실제 안전과 정서적 불안을 구분해 다루세요."),
    q("서로의 답답함을 줄이는 장기 조건", "growth", "repairStrategy", "element_complement", "가족이라는 이유로 같은 방식의 설명이 계속 통할 수는 없습니다. 삶의 단계가 달라지면 부모는 기대를, 자녀는 필요한 지원을 다시 말해야 예전 역할이 현재의 관계를 가두지 않습니다.", "반복되는 충돌 하나를 골라 누구의 결정인지와 서로 어디까지 도울지를 다시 정하세요.", "이 관계의 평가는 복종이나 성취로 환산하지 않습니다. 대화를 시도해도 존중받지 못하는 문제가 있다면 성향 차이만으로 축소하지 마세요."),
  ],
  coworker: [
    q("같이 일할 때 살아나는 강점", "workplace", "sharedGround", "day_master_relation", "동료 관계에서는 친한지보다 서로의 작업을 이어받을 수 있는지가 중요합니다. 같은 문제를 보는 공통점은 협업의 출발점이지만, 각자가 맡을 결과물까지 같아야 하는 것은 아닙니다.", "공동 작업을 시작할 때 서로 필요한 자료와 넘겨줄 결과물의 형태를 먼저 맞춰 보세요.", "말이 잘 통한다는 이유로 완료 기준을 생략하면 각자 잘했다고 생각한 작업이 연결되지 않을 수 있습니다."),
    q("분업이 보완으로 작동하는 조건", "thinkingStyle", "positiveInfluence", "cross_ten_god", "분석, 실행, 점검의 강점을 나누되 누군가를 항상 시작하는 사람이나 정리하는 사람으로 고정하지 않아야 합니다. 서로가 제공하는 자극은 담당을 정할 참고이며 실제 경험과 업무량을 함께 봐야 합니다.", "이번 과제에서 책임질 산출물과 서로 검토해 줄 부분을 나눠 한 사람이 보이지 않는 마무리를 독점하지 않게 하세요.", "능숙하다는 이유로 일이 계속 몰리면 좋은 보완도 피로가 됩니다. 역할은 성격표가 아니라 현재 여력으로 조정하세요."),
    q("처리 속도와 마감의 충돌", "workplace", "friction", "month_rhythm", "마감 직전의 충돌은 성실성보다 필요한 검토 시간과 수정 여유를 다르게 잡아서 생길 수 있습니다. 빠른 초안이 필요한 일과 정확한 확정본이 필요한 일을 나누면 속도 차이를 개인 평가로 넘기지 않을 수 있습니다.", "초안 공유, 검토 종료, 최종 전달 시점을 따로 정하고 중간에 막혔을 때 알릴 기준을 마련하세요.", "상대의 답이 늦다는 이유로 일을 대신 끝내거나 확인 없이 넘기면 책임 경계와 신뢰가 동시에 흐려집니다."),
    q("보고와 정보 공유", "communication", "sharedGround", "branch_clash", "동료끼리의 공유는 허락을 받기보다 서로의 작업에 영향을 주는 변경을 알려 주는 일입니다. 보고량이 많아도 무엇이 바뀌었고 누구에게 영향이 있는지가 없으면 필요한 정보를 찾기 어렵습니다.", "변경 사항을 알릴 때 결정된 것, 아직 미정인 것, 상대에게 필요한 행동을 구분해 적으세요.", "모든 메시지를 즉시 읽는 것을 협조의 기준으로 삼으면 집중 시간이 사라집니다. 긴급한 연락의 범위를 따로 정하세요."),
    q("피드백을 수정으로 연결하기", "growth", "repairStrategy", "branch_harm", "수정 의견이 사람의 역량 평가처럼 들리면 작업물에 대한 논의가 방어로 바뀝니다. 두 사람의 표현 차이를 아는 것에서 멈추지 말고 지금 수정해야 하는 이유와 남겨도 되는 취향 차이를 구분해야 합니다.", "피드백은 문제 위치, 필요한 기준, 수정 우선순위로 전달하고 받는 쪽은 이해한 변경 범위를 되짚으세요.", "공개된 자리에서 쌓아 둔 불만까지 꺼내면 다음 검토에서 문제를 일찍 알리기 어려워질 수 있습니다."),
    q("책임과 공로의 경계", "workplace", "friction", "combined_element_climate", "공동 결과물에는 최종 책임과 실제 기여가 함께 보일 필요가 있습니다. 누가 더 많이 말했는지로 공로가 배분되거나 실수만 공동 책임이 되면 이후에는 정보를 나누는 데 소극적이 될 수 있습니다.", "작업별 담당과 의존 관계를 기록하고 완료 후에는 수정 지원을 포함해 실제 기여를 함께 확인하세요.", "친분을 이유로 책임을 대신 떠안는 방식은 오래 가기 어렵습니다. 실수가 생겼을 때 보고할 창구도 분명해야 합니다."),
    q("같이 일하며 쌓이는 피로", "relationships", "positiveInfluence", "hour_life_rhythm", "회의, 혼자 집중하는 시간, 갑작스러운 요청이 섞이면 일의 내용보다 협업 방식에서 소진될 수 있습니다. 서로 도움이 되는 행동이라도 빈도와 시점이 맞는지는 별도 질문입니다.", "집중을 방해하지 않는 질문 시간과 긴급 요청 방법을 나누고, 반복되는 확인은 공유 문서로 옮겨 보세요.", "일 외의 친밀함을 협업의 의무로 삼지 마세요. 사적인 거리를 두더라도 업무상 신뢰를 충분히 만들 수 있습니다."),
    q("오래 협업할 수 있는 기준", "growth", "repairStrategy", "element_complement", "좋은 동료 관계는 의견이 같은 관계보다 수정 비용을 함께 줄일 수 있는 관계에 가깝습니다. 끝난 과제를 돌아볼 때 잘한 사람을 고르는 대신 어느 연결에서 일이 멈췄는지를 보면 다음 분업이 구체화됩니다.", "회고에서는 계속할 방식 하나와 줄일 낭비 하나를 정하고 다음 과제에서 확인할 시점을 잡으세요.", "매번 한쪽만 야근해 마감을 맞춘다면 성과가 좋아도 협업 방식은 지속 가능하지 않습니다."),
  ],
  managerReport: [
    q("권한 차이가 있는 관계의 강점", "workplace", "sharedGround", "day_master_relation", "상사와 부하의 관계에서는 성향이 비슷해도 말 한마디가 갖는 무게가 다릅니다. 공통된 업무 기준은 장점이지만, 반대 의견을 말해도 불이익이 없다는 조건이 있어야 강점이 실제 협력으로 이어집니다.", "상사 역할에서는 질문 가능한 사안을 명시하고, 부하 역할에서는 이해한 목표와 아직 모르는 조건을 구분해 보세요.", "두 사람의 직책은 입력으로 정해져 있지 않습니다. 이하의 상사·부하 제안은 실제 직책에 맞춰 적용하며 성격 역할로 읽지 않습니다."),
    q("지시를 실행 가능한 목표로", "thinkingStyle", "positiveInfluence", "cross_ten_god", "좋은 방향 제시도 결과물의 수준과 사용할 자원이 모호하면 실행자는 계속 눈치를 보게 됩니다. 반대로 모든 방법을 지정하면 담당자의 강점을 쓸 여지가 줄어들 수 있습니다.", "상사 역할에서는 목적·완료 기준·제약을 설명하고, 부하 역할에서는 가능한 방법과 필요한 지원을 제안하세요.", "설명이 짧다는 것을 신뢰의 표시로만, 질문이 많다는 것을 능력 부족으로만 해석하지 마세요."),
    q("자율권과 확인의 범위", "workplace", "friction", "month_rhythm", "맡겼다는 말 뒤에 잦은 수정이 이어지면 책임은 있지만 결정권은 없는 상태가 됩니다. 중간 확인이 필요한 위험과 담당자가 스스로 바꿀 수 있는 방법을 나눠야 자율성이 구체화됩니다.", "직접 결정할 항목, 사전 협의할 항목, 완료 후 알릴 항목을 업무 단위로 나눠 보세요.", "상사의 개인 취향이 뒤늦게 필수 기준으로 바뀌면 부하는 결정을 미루게 됩니다. 기준 변경의 영향도 함께 인정해야 합니다."),
    q("보고와 질문의 안전성", "communication", "sharedGround", "branch_clash", "보고는 좋은 소식을 보여 주는 자리가 아니라 판단에 필요한 사실을 전달하는 자리여야 합니다. 막힌 조건을 늦게 알리게 되는 관계라면 보고자의 태도뿐 아니라 문제를 들었을 때의 반응도 살펴야 합니다.", "부하 역할에서는 현황·위험·필요한 결정을 나누고, 상사 역할에서는 질문을 끝까지 들은 뒤 우선순위를 정하세요.", "질문할 때마다 즉시 평가받는다면 불확실한 정보를 감추게 될 수 있습니다. 권한 차이를 단순한 성격 차이로 축소하지 마세요."),
    q("평가와 이견을 분리하기", "growth", "repairStrategy", "branch_harm", "개선 의견과 인사 평가가 뒤섞이면 작은 수정 요청도 거절할 수 없는 지시로 들릴 수 있습니다. 의견이 다를 때는 목표에 대한 반대인지 방법에 대한 제안인지부터 구분해야 합니다.", "상사 역할에서는 평가 기준과 개발 조언을 따로 말하고, 부하 역할에서는 다른 방법의 근거와 예상 영향을 제시하세요.", "동의하는 태도만 좋은 협업으로 평가하면 위험을 먼저 발견한 사람이 침묵하게 될 수 있습니다."),
    q("책임에 맞는 자원과 권한", "workplace", "friction", "combined_element_climate", "성과 책임을 맡기면서 인력, 일정, 예산의 제약을 조정할 수 없게 하면 관계가 소모적으로 변합니다. 책임의 크기와 실제로 바꿀 수 있는 범위를 함께 보아야 서로의 답답함이 구체적인 운영 문제로 드러납니다.", "목표가 늘어날 때는 줄일 과업이나 추가 지원을 함께 정하고, 결정이 필요한 지점을 상향 공유하세요.", "헌신을 근거로 상시 초과 부담을 기대하는 방식은 지속하기 어렵습니다. 실현 불가능한 조건을 개인 의지로 해결하려 하지 마세요."),
    q("성장 지원과 간섭의 경계", "relationships", "positiveInfluence", "hour_life_rhythm", "도움이 되는 코칭도 매번 작업에 끼어들면 자기 판단을 연습할 기회를 줄일 수 있습니다. 반대로 자율을 준다는 이유로 피드백을 끊으면 기대 수준을 모른 채 일하게 됩니다.", "정기적인 검토 시간과 그 사이의 독립 실행 범위를 정하고, 지원이 필요한 신호를 서로 합의하세요.", "상사는 빠르고 부하는 신중하다는 식의 배분은 하지 않습니다. 실제 역량과 과제의 위험에 따라 지원 방식을 바꾸세요."),
    q("오래 일할 수 있는 신뢰", "growth", "repairStrategy", "element_complement", "신뢰는 상대를 좋아하는 감정보다 약속한 권한과 기준이 실제로 지켜지는 경험에서 쌓입니다. 평가 이후에도 다음 시도에 필요한 지원이 이어지는지, 보고한 위험이 책임 회피로 취급되지 않는지를 점검하세요.", "중요한 피드백 뒤에는 다음 검토 시점과 지원 약속을 남겨 변화가 평가 말로만 끝나지 않게 하세요.", "직장 내 부당한 대우를 궁합이나 개인 성향만으로 설명하지 않습니다. 실제 권한과 책임의 운영을 함께 보아야 합니다."),
  ],
  businessPartner: [
    q("동업에서 함께 만들 수 있는 가치", "workplace", "sharedGround", "day_master_relation", "동업의 출발점은 서로를 좋아하는 마음뿐 아니라 함께 만들 결과와 고객에 대한 기준입니다. 같은 방향을 보더라도 어느 부분에서 각자의 판단이 더 필요한지 구체화해야 친분이 사업 역할을 대신하지 않습니다.", "두 사람이 함께 해야 하는 이유를 결과물과 역할로 설명하고, 혼자 결정할 수 없는 핵심 사안을 먼저 정하세요.", "관계가 좋다는 이유로 검토를 생략하면 사업의 불확실성과 상대에 대한 신뢰가 한꺼번에 흔들릴 수 있습니다."),
    q("역할과 결정권의 보완", "thinkingStyle", "positiveInfluence", "cross_ten_god", "한 사람이 방향을 제시하고 다른 사람이 검증하는 장면이 있더라도 그 역할을 고정 성격으로 만들 필요는 없습니다. 전문성, 실제 투입 시간, 책임질 결과를 바탕으로 결정권을 나눠야 서로의 강점이 소모되지 않습니다.", "영역별 책임자와 공동 동의가 필요한 결정을 구분하고, 의견이 같지 않을 때 보류할 수 있는 조건도 정하세요.", "실행을 더 많이 했다는 이유로 이미 합의한 권한을 혼자 넓히면 보완 관계가 주도권 경쟁으로 바뀔 수 있습니다."),
    q("결정 속도와 위험을 감수하는 범위", "workplace", "friction", "month_rhythm", "기회를 놓치기 싫은 마음과 손실을 줄이려는 검토는 동시에 필요할 수 있습니다. 성향만으로 공격형과 안정형을 배정하지 말고, 되돌릴 수 있는 실험과 되돌리기 어려운 지출을 나누는 편이 낫습니다.", "작은 실험의 기간·자원 한도와 큰 결정의 검토 조건을 따로 정해 모든 결정을 같은 속도로 처리하지 마세요.", "한 사람의 확신이 다른 사람의 동의를 대신하면 손실이 났을 때 판단보다 관계를 탓하게 되기 쉽습니다."),
    q("이견과 불편한 정보의 공유", "communication", "sharedGround", "branch_clash", "매출 부진, 비용 증가, 고객 불만을 알리는 일이 상대를 실망시키는 일처럼 느껴지면 나쁜 소식이 늦어집니다. 의견 충돌을 막기보다 서로가 놓친 사실을 일찍 꺼낼 수 있는 관계가 운영에 도움이 됩니다.", "회의에서는 확인된 사실·예상·희망을 구분하고 반대 의견이 바꾸고 싶은 결정이 무엇인지 명시하세요.", "반대하는 사람을 의욕 없는 사람으로 취급하면 검토가 사라집니다. 비판과 책임 회피는 실제 행동을 보고 구분하세요."),
    q("갈등 중에도 운영을 지키는 방식", "growth", "repairStrategy", "branch_harm", "동업 갈등은 감정 회복을 기다리는 동안에도 업무와 비용이 계속 움직인다는 점이 다릅니다. 관계에 대한 불만과 오늘 처리할 운영 결정을 나눠야 다툼이 다른 사람과 고객에게 번지는 것을 줄일 수 있습니다.", "충돌한 사안은 별도 시간에 다루되 진행 중인 업무의 임시 책임과 외부에 전달할 메시지는 함께 정하세요.", "상대에게 불만이 있다는 이유로 정보나 승인을 막으면 갈등 자체가 추가 손실의 원인이 될 수 있습니다."),
    q("돈과 자원, 기여의 가시성", "money", "friction", "combined_element_climate", "투입한 돈, 실제 노동, 가져가는 보상은 서로 다른 항목입니다. 숫자를 꺼내기 불편하다는 이유로 섞어 두면 각자가 더 많이 기여했다고 느끼기 쉽습니다. 금전 성향은 이 대화의 차이를 보는 참고이지 투자 능력의 판정이 아닙니다.", "공동 자원과 개인 부담을 구분하고 지출 기록을 두 사람이 같은 방식으로 확인할 수 있게 하세요.", "금전 결정은 실제 재무 상황과 필요한 전문 검토를 바탕으로 해야 합니다. 이 해석은 수익이나 적정 투자 규모를 제시하지 않습니다."),
    q("손실 상황과 철수 기준", "relationships", "repairStrategy", "hour_life_rhythm", "이미 쓴 시간과 돈 때문에 중단을 배신처럼 느끼면 손실이 커져도 대화를 시작하기 어렵습니다. 계속할 이유와 멈출 이유를 관계 충성도의 문제가 아닌 관찰 가능한 운영 조건으로 다뤄야 합니다.", "손실이나 피로가 어느 조건에 이르면 추가 투입을 멈추고 검토할지, 누가 어떤 자료를 준비할지 미리 정하세요.", "철수 조건은 법적 책임이나 계약 조항의 대체가 아닙니다. 한쪽이 계속 감당할 수 없다고 말할 통로가 있어야 합니다."),
    q("장기 동업과 책임 재조정", "growth", "positiveInfluence", "element_complement", "규모가 커지거나 한 사람의 생활 조건이 바뀌면 초기의 평등한 분담도 실제 부담과 어긋날 수 있습니다. 동업을 오래 지속하려면 역할을 다시 협의하는 일을 신뢰의 붕괴로 여기지 않아야 합니다.", "투입 시간·결정권·책임 범위를 정기적으로 돌아보고 변경 시 누구에게 어떤 영향을 알릴지 함께 정하세요.", "한 사람만 손실과 마무리를 떠안는 구조는 좋은 관계만으로 버티기 어렵습니다. 책임 소재를 감정적인 의리로 대신하지 마세요."),
  ],
  friendship: [
    q("가까워지는 방식과 공통 관심", "relationships", "sharedGround", "day_master_relation", "친구가 되는 계기는 같아도 친하다고 느끼는 경험은 다를 수 있습니다. 자주 만나는 일, 깊은 이야기를 나누는 일, 말없이 함께하는 일 중 두 사람에게 편한 연결을 찾아야 친밀함의 기준을 한쪽에 맞추지 않습니다.", "최근 좋았던 만남에서 무엇이 편했는지 나누고 다음 약속에 그 조건을 하나 남겨 보세요.", "관심사가 같다는 이유로 모든 시간을 함께할 필요는 없습니다. 다른 친구나 혼자 보내는 시간을 경쟁으로 보지 마세요."),
    q("서로에게 힘이 되는 친구", "growth", "positiveInfluence", "cross_ten_god", "좋은 친구의 도움은 상대를 자기 방식으로 바꾸는 일과 다릅니다. 두 사람 사이의 긍정적 자극을 응원과 관점 나눔에 쓰되, 상대가 원하는 도움의 범위를 확인할 때 고마움이 부담으로 변하는 것을 줄일 수 있습니다.", "고민을 들은 날에는 조언을 원하는지 함께 시간을 보내길 원하는지 묻고 가능한 도움을 구체적으로 말하세요.", "도와준 횟수가 관계의 우위를 만들면 부탁을 거절하기 어려워집니다. 도움받은 사람이 늘 동의해야 하는 것은 아닙니다."),
    q("연락 빈도와 적당한 거리", "relationships", "friction", "month_rhythm", "연락이 잦아야 안심하는 상황과 오랜만에 만나도 이어진다고 느끼는 상황은 다를 수 있습니다. 실제 선호를 확인하지 않고 답장 속도를 우정의 크기로 읽으면 바쁜 시기가 반복적인 서운함으로 남습니다.", "꼭 답이 필요한 연락과 편할 때 읽어도 되는 공유를 구분하고 오래 바쁠 때 알릴 방식을 정하세요.", "잠시 멀어지는 일을 관계의 거절로 확정하지 마세요. 반대로 반복해서 약속을 무시한 행동까지 성향 차이로 덮지 않아야 합니다."),
    q("감정 공유와 사생활", "communication", "sharedGround", "branch_clash", "깊은 이야기를 잘 나눈다고 해서 모든 고민을 공개해야 하는 것은 아닙니다. 한 사람에게는 친밀함의 질문이 다른 사람에게는 준비되지 않은 설명 요구로 들릴 수 있어 말할 범위를 존중하는 것이 필요합니다.", "친구가 망설이면 지금 말하지 않아도 된다는 선택지를 주고, 들은 이야기를 다른 사람에게 전해도 되는지 확인하세요.", "알아야 친한 사이라는 기준은 신뢰를 약하게 만들 수 있습니다. 비밀을 지킨 경험과 정보의 양을 혼동하지 마세요."),
    q("서운함을 말하고 회복하기", "growth", "repairStrategy", "branch_harm", "친구 사이에서는 작은 서운함을 참다가 약속 하나가 계기가 되어 쌓인 말을 꺼내기 쉽습니다. 상대의 의도를 추측하기보다 어떤 약속이나 기대가 어긋났는지 말해야 사과할 대상도 명확해집니다.", "불편했던 한 장면과 다음에는 원하는 행동을 이야기하고, 설명을 듣기 전에 관계 전체를 평가하지 마세요.", "친구니까 알아야 한다는 기대만으로 문제를 남겨 두면 다시 만나는 일이 조심스러워질 수 있습니다."),
    q("약속과 비용에서 쌓이는 신뢰", "money", "friction", "combined_element_climate", "여행, 모임 비용, 빌린 물건은 작은 규모라도 책임을 드러내는 장면입니다. 서로의 형편을 추정하기보다 부담 없이 참여할 범위와 비용을 정리하는 시점을 명확히 해야 즐거운 만남 뒤에 계산이 남지 않습니다.", "공동 비용이 생길 때는 부담 범위와 정산 방식을 먼저 말하고 약속 변경은 가능한 한 일찍 알리세요.", "경제적 여유가 있어 보인다는 이유로 대신 내기를 기대하거나 거절을 인색함으로 해석하지 마세요."),
    q("생활 단계가 달라질 때", "thinkingStyle", "positiveInfluence", "hour_life_rhythm", "이사, 취업, 돌봄 등으로 생활이 바뀌면 예전의 만남 빈도를 지키기 어려울 수 있습니다. 과거처럼 만나지 못한다는 사실과 여전히 관계를 소중히 여기는 마음을 따로 볼 수 있어야 우정의 형태를 바꿀 여지가 생깁니다.", "길게 만나기 어렵다면 짧게 소식을 나누는 방식 등 지금 가능한 연결을 함께 찾아 보세요.", "서로의 생활 속도를 비교해 뒤처졌다고 평가하면 편했던 친구가 부담스러운 관객처럼 느껴질 수 있습니다."),
    q("오래 가는 우정의 조건", "relationships", "repairStrategy", "element_complement", "우정이 오래 가는 조건은 매번 같은 의견을 갖는 것이 아니라 거절과 차이를 견딜 수 있는지에 있습니다. 각자의 변화를 인정하면서도 지킬 약속이 분명하면 가끔 떨어져 있어도 관계의 바탕을 유지할 수 있습니다.", "함께 계속하고 싶은 만남과 이제 부담스러운 방식을 하나씩 말해 오래된 관행을 현재에 맞게 바꿔 보세요.", "한쪽만 연락하고 조정하고 사과하는 패턴은 성향 설명으로 정당화하지 마세요. 실제로 노력의 교환이 있는지를 살피는 것이 필요합니다."),
  ],
};

export type CompatibilityCategorySource = {
  readonly id: string;
  readonly kind: "saju" | "mbti-person" | "mbti-pair";
  readonly subjectPerson?: string;
  readonly targetPerson?: string;
  readonly field: string;
  readonly text: string;
};

const romanceOnly = /연애|결혼|연인|애정|사랑|배우자|부부|데이트|스킨십|설렘/u;
export function buildCompatibilityCategoryReading(packet: CompatibilityEvidencePacket) {
  const category = packet.relationshipType;
  const { persons, aToB, bToA } = packet.directionEvidence;
  const romantic = category === "love" || category === "marriage";
  const displayedSources = new Set<string>();
  const firstUse = (sources: readonly CompatibilityCategorySource[]) => sources.filter(source => {
    const key = `${source.id}:${source.text}`;
    if (displayedSources.has(key)) return false;
    displayedSources.add(key);
    return true;
  }).map(source => source.text);
  const scenes = compatibilityCategoryQuestions[category].map((question, index) => {
    const sources: CompatibilityCategorySource[] = [];
    // Both source-type viewpoints are retained. A pair entry is not automatically about its owner.
    for (const direction of [aToB, bToA]) {
      const pair = direction.mbtiPair;
      const raw = pair?.[question.pairField];
      const lines = (typeof raw === "string" ? [raw] : raw ?? []).filter(line => romantic || !romanceOnly.test(line));
      if (pair && lines.length) sources.push({ id: `${pair.evidenceId}:${question.pairField}`, kind: "mbti-pair",
        subjectPerson: direction.subjectPerson, targetPerson: direction.targetPerson, field: question.pairField,
        text: `${pair.sourceType}에서 ${pair.targetType}를 보는 설명: ${lines.slice(0, 2).join(" ")}` });
    }
    for (const profile of [persons.personA, persons.personB]) {
      const trait = profile.traits.find(item => item.area === question.area);
      if (trait) sources.push({ id: trait.evidenceId, kind: "mbti-person", subjectPerson: profile.personId, field: question.area,
        // Money traits describe operating habits here, not predicted earnings or investment ability.
        // Remove absolute emphasis from source prose without changing its underlying preference.
        text: `${profile.name}님의 ${profile.mbti} ${trait.label}: ${question.area === "money" ? "금전 관련 선택에서 점검할 성향입니다." : trait.reading.replace(/반드시\s*/gu, "")} 주의할 면은 ${trait.risk.replace(/반드시\s*/gu, "")}` });
      const featureByArea: Partial<Record<MbtiTraitArea, string>> = {
        communication: "sinsal_hyeonchim", relationships: "gwiin_cheoneul", thinkingStyle: `day_pillar_`,
        money: "ten_god_jie_cai", growth: "gwiin_cheondeok", workplace: "ten_god_zheng_guan",
        love: "sinsal_hongyeom", marriage: "twelve_sinsal_yukhae",
      };
      const feature = featureByArea[question.area];
      const natal = feature ? profile.natal.find(item => feature === "day_pillar_" ? item.featureId.startsWith(feature) : item.featureId === feature) : undefined;
      if (natal) sources.push({ id: natal.evidenceId, kind: "saju", subjectPerson: profile.personId,
        field: natal.featureId, text: `${profile.name}님 원국의 ${natal.label}를 관계 장면에 적용하면: ${natal.practical}` });
    }
    const note = packet.deepSajuBridge?.notes.find(item => item.layer === question.layer);
    if (question.layer === "cross_ten_god") {
      for (const direction of [aToB, bToA]) {
        const subject = direction.subjectPerson === persons.personA.personId ? persons.personA : persons.personB;
        const target = direction.targetPerson === persons.personA.personId ? persons.personA : persons.personB;
        if (direction.receivedTenGod) sources.push({ id: `${direction.relationId}:ten-god`, kind: "saju", subjectPerson: subject.personId,
          targetPerson: target.personId, field: "cross_ten_god", text: `${target.name}님의 일간 ${target.dayMaster}를 기준으로 ${subject.name}님의 일간 ${subject.dayMaster}는 ${direction.receivedTenGod.tenGodKo} 관계입니다.` });
      }
    }
    if (question.layer === "cross_ten_god") {
      const trine = packet.deepSajuBridge?.notes.find(item => item.layer === "branch_trine");
      if (trine) sources.push({ id: `pair:saju:branch_trine:${[...trine.personARefs, ...trine.personBRefs].sort().join("|")}`,
        kind: "saju", field: "branch_trine", text: `${trine.summary} ${trine.practicalMeaning}` });
    }
    if (note) sources.push({ id: `pair:saju:${question.layer}:${[...note.personARefs, ...note.personBRefs].sort().join("|")}`, kind: "saju", field: question.layer,
      text: `${note.summary} ${note.principleExplanation}` });
    // A missing interaction is not replaced with an invented clash/complement.
    if (!sources.some(source => source.kind === "saju")) sources.push({ id: "pair:saju:confirmed-day-pillars", kind: "saju", field: "dayPillars",
      text: `${persons.personA.name}님의 일주는 ${persons.personA.dayPillar}, ${persons.personB.name}님의 일주는 ${persons.personB.dayPillar}입니다. 이 질문에 해당하는 추가 관계 작용은 확정해 덧붙이지 않습니다.` });
    const personal = firstUse(sources.filter(s => s.kind === "mbti-person"));
    const missing = [persons.personA, persons.personB].filter(p => p.mbti === null)
      .map(p => `${p.name}님은 MBTI 미입력이므로 유형에 따른 반응을 추정하지 않습니다.`);
    const basis = firstUse(sources.filter(s => s.kind === "saju"));
    const pair = firstUse(sources.filter(s => s.kind === "mbti-pair"));
    return {
      id: `${category}:${index + 1}`, title: question.title, sources,
      scene: question.scene, action: question.action, caution: question.caution,
      // Interpretations are conditional applications of the named evidence, not extra calculated facts.
      reading: [question.title, question.scene, [...personal, ...missing].join(" "), basis.join(" "), pair.join(" "), question.action].filter(Boolean).join("\n\n"),
    };
  });
  const orderedDirections = [aToB, bToA].sort((a, b) => a.relationId.localeCompare(b.relationId));
  const pairStrength = orderedDirections.flatMap(d => d.mbtiPair?.positiveInfluence ?? [])
    .find(text => romantic || !romanceOnly.test(text));
  const pairFriction = orderedDirections.flatMap(d => d.mbtiPair?.friction ?? [])
    .find(text => romantic || !romanceOnly.test(text));
  return { category, role: packet.directionEvidence.categoryRole, scenes,
    conclusions: {
      fit: `${scenes[1].title}: ${pairStrength ?? packet.sajuCompatibility.dayMasterRelation}`,
      friction: `${scenes[2].title}: ${pairFriction ?? packet.sajuCompatibility.dayBranchRelation}`,
      condition: scenes[7].action,
    },
  };
}
export type CompatibilityCategoryReading = ReturnType<typeof buildCompatibilityCategoryReading>;

// Validate provenance against the stored facts, not today's editorial templates.
// Copy revisions must not invalidate an already-published snapshot on a later read.
export function hasValidCompatibilityCategorySources(packet: CompatibilityEvidencePacket): boolean {
  const plan = packet.categoryReading;
  if (!plan) return true;
  const { persons, aToB, bToA, categoryRole } = packet.directionEvidence;
  if (plan.category !== packet.relationshipType || plan.role.category !== categoryRole.category ||
      plan.role.kind !== categoryRole.kind || plan.role.assignments.personA !== null || plan.role.assignments.personB !== null ||
      !Array.isArray(plan.scenes) || plan.scenes.length === 0 || new Set(plan.scenes.map(s => s.id)).size !== plan.scenes.length) return false;
  const key = (source: Omit<CompatibilityCategorySource, "text">) =>
    JSON.stringify([source.id, source.kind, source.subjectPerson ?? null, source.targetPerson ?? null, source.field]);
  const allowed = new Set<string>();
  const add = (source: Omit<CompatibilityCategorySource, "text">) => allowed.add(key(source));
  for (const person of Object.values(persons)) {
    for (const trait of person.traits) {
      if (!["love", "marriage"].includes(packet.relationshipType) && ["love", "marriage"].includes(trait.area)) continue;
      add({ id: trait.evidenceId, kind: "mbti-person", subjectPerson: person.personId, field: trait.area });
    }
    for (const feature of person.natal) add({ id: feature.evidenceId, kind: "saju", subjectPerson: person.personId, field: feature.featureId });
  }
  for (const direction of [aToB, bToA]) {
    if (direction.receivedTenGod) add({ id: `${direction.relationId}:ten-god`, kind: "saju", subjectPerson: direction.subjectPerson,
      targetPerson: direction.targetPerson, field: "cross_ten_god" });
    if (direction.mbtiPair) {
      const fields: PairField[] = ["sharedGround", "friction", "positiveInfluence", "repairStrategy"];
      if (packet.relationshipType === "love") fields.push("lovePattern");
      if (packet.relationshipType === "marriage") fields.push("marriagePattern");
      for (const field of fields) if (direction.mbtiPair[field]?.length) add({ id: `${direction.mbtiPair.evidenceId}:${field}`, kind: "mbti-pair",
        subjectPerson: direction.subjectPerson, targetPerson: direction.targetPerson, field });
    }
  }
  for (const note of packet.deepSajuBridge?.notes ?? []) add({ id: `pair:saju:${note.layer}:${[...note.personARefs, ...note.personBRefs].sort().join("|")}`,
    kind: "saju", field: note.layer });
  add({ id: "pair:saju:confirmed-day-pillars", kind: "saju", field: "dayPillars" });
  return plan.scenes.every(scene => scene.id.startsWith(`${plan.category}:`) && Array.isArray(scene.sources) &&
    scene.sources.length > 0 && scene.sources.every(source => allowed.has(key(source))));
}
