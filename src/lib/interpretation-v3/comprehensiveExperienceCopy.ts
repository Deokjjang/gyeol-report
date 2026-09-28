import type { UserLifeStatus } from "../report-knowledge/userContextTypes";

// Comprehensive-only editorial material. Every trait below is an exact record
// in docs/product/mbti/source, not an inference from the four type letters.
export type RealityVoice = { trait: string; signals: readonly string[]; text: string; closing: string };
export const REALITY_VOICES: readonly RealityVoice[] = [
  { trait: "ENTJ:thinkingStyle:te_ni_strategy", signals: ["ten_god_pian_yin", "twelve_sinsal_hwagae", "ten_god_zheng_guan"], text: "이야기가 끝나기 전에 머릿속에서는 이미 순서가 정리됩니다. 혼자 생각할 시간이 생기면 그 순서를 다시 뜯어보고 더 짧은 길을 찾는 편입니다.", closing: "생각한 방향을 남도 함께 걸을 수 있는 길로 만드세요" },
  { trait: "INFP:identity:authentic_inner_values", signals: ["ten_god_bijian", "ten_god_zheng_yin", "twelve_sinsal_hwagae"], text: "다들 괜찮다고 해도 마음에 걸리는 한 가지가 남으면 쉽게 동의하지 못하지 않으신가요? 이때의 망설임은 답을 몰라서보다 내 마음까지 동의했는지 살피는 시간입니다.", closing: "남의 박수보다 오래 지키고 싶은 마음을 기준으로 고르세요" },
  { trait: "ENFP:identity:people_centered_energy", signals: ["ten_god_jie_cai", "ten_god_bijian", "gwiin_cheoneul"], text: "혼자 할 때는 미뤘던 일도 누가 같이 해보자고 하면 갑자기 재미가 붙지 않으신가요? 경쟁조차 함께 웃고 움직일 사람이 있을 때 힘이 살아납니다.", closing: "사람에게서 얻은 설렘을 함께 해볼 한 가지로 이어보세요" },
  { trait: "INTJ:thinkingStyle:system_first_thinking", signals: ["ten_god_pian_yin", "gwiin_munchang", "sinsal_cheonmunseong"], text: "다들 답을 골랐는데 혼자 그 답이 나온 전제부터 다시 보는 편입니다. 눈앞의 문제를 끝내는 것보다 다음에도 같은 문제가 생길 구조인지가 걸립니다.", closing: "머릿속 설계가 현실에서도 통하는지 작은 결과로 확인하세요" },
  { trait: "INTP:thinkingStyle:why_question_loop", signals: ["ten_god_pian_yin", "gwiin_munchang", "sinsal_cheonmunseong"], text: "궁금해서 하나만 찾아봤는데 어느새 원래 질문보다 깊은 곳에 들어가 있지 않으신가요? 정답을 들은 뒤에도 왜 그런지 남아 있으면 생각이 멈추지 않습니다.", closing: "계속 묻는 힘에 오늘 확인한 답 하나를 남겨보세요" },
  { trait: "ENTP:thinkingStyle:debate_as_processing", signals: ["ten_god_shang_guan", "sinsal_hyeonchim", "gwiin_munchang"], text: "반대 의견을 말했는데 싸우자는 뜻으로 받아들여져 당황한 적 있지 않으신가요? 답을 부수려는 것이 아니라 부딪쳐 봐야 내 생각도 분명해지는 쪽입니다.", closing: "새로 연 가능성 하나를 끝까지 시험해 보세요" },
  { trait: "INFJ:thinkingStyle:private_analysis_loop", signals: ["ten_god_pian_yin", "ten_god_zheng_yin", "twelve_sinsal_hwagae"], text: "대화 중에는 듣고 있었는데 집에 와서야 그 말의 의미가 정리되는 편입니다. 바로 말하지 않았다고 생각까지 없었던 것은 아닙니다.", closing: "안에서 선명해진 뜻을 믿을 만한 사람에게 건네보세요" },
  { trait: "ENFJ:thinkingStyle:fast_people_reading", signals: ["sinsal_hyeonchim", "gwiin_cheoneul", "ten_god_zheng_yin"], text: "모두 웃고 있는데 한 사람의 표정이 달라진 것이 먼저 눈에 들어오지 않으신가요? 말의 내용만큼 그 말을 들은 사람의 반응을 읽는 쪽입니다.", closing: "사람의 가능성을 보되 그 사람의 몫까지 대신하지 마세요" },
  { trait: "ISTJ:thinkingStyle:detail_memory", signals: ["ten_god_zheng_yin", "ten_god_zheng_guan", "ten_god_zheng_cai"], text: "지난번에 했던 말과 이번 말이 다르면 금방 알아차리지 않으신가요? 따지려고 외운 것이 아니라 약속과 순서가 기억에 남아 있는 편입니다.", closing: "쌓아온 신뢰를 지키면서 더 편해질 방법도 받아들이세요" },
  { trait: "ISFJ:relationships:memory_based_affection", signals: ["ten_god_zheng_yin", "ten_god_shi_shen", "gwiin_cheoneul"], text: "친구가 흘리듯 말한 취향을 기억했다가 나중에 챙겨주는 편이지 않으신가요? 큰 표현보다 잊지 않았다는 행동에 마음이 담깁니다.", closing: "남을 챙기는 기억 속에 자신의 바람도 한 칸 남겨두세요" },
  { trait: "ESTJ:relationships:solution_first_relation", signals: ["ten_god_zheng_guan", "ten_god_qi_sha", "gwiin_cheoneul"], text: "고민을 듣다 보면 누가 무엇을 하면 풀릴지부터 정리하는 편입니다. 상대에게 도움이 되고 싶어서인데, 상대는 아직 자기 이야기를 끝내지 못한 때도 있습니다.", closing: "해결할 일과 먼저 들어줄 마음을 구분해 보세요" },
  { trait: "ESFJ:relationships:habitual_empathy", signals: ["ten_god_shi_shen", "sinsal_dohwa", "sinsal_hongyeom"], text: "상대의 말에 고개부터 끄덕인 뒤 혼자 있을 때 내 생각을 확인하지 않으신가요? 대화가 어색해지지 않게 받아주는 속도가 빠른 편입니다.", closing: "따뜻한 반응에 자신의 진짜 생각까지 함께 담아보세요" },
  { trait: "ISTP:thinkingStyle:causal_principle_focus", signals: ["ten_god_zheng_guan", "ten_god_pian_yin", "sinsal_hyeonchim"], text: "설명을 길게 듣기보다 어디에서 안 되는지 직접 확인하고 싶어 합니다. 분위기가 급해도 원인이 보이면 말수가 줄고 손이 먼저 움직이는 편입니다.", closing: "직접 확인한 감각을 가까운 사람도 이해할 말로 남겨보세요" },
  { trait: "ISFP:thinkingStyle:fi_value_alignment", signals: ["ten_god_bijian", "ten_god_zheng_yin", "twelve_sinsal_hwagae"], text: "말로는 괜찮다고 했는데 막상 하려니 마음이 움직이지 않은 적 있지 않으신가요? 남에게 설명하기 전부터 내 취향과 가치가 먼저 답을 알고 있는 편입니다.", closing: "좋아하는 것을 남의 허락 없이도 작게 선택해 보세요" },
  { trait: "ESTP:thinkingStyle:se_now_data", signals: ["sinsal_hyeonchim", "twelve_sinsal_yeokma", "ten_god_qi_sha"], text: "계획을 길게 세워도 현장에 가면 바뀐 분위기부터 보는 편입니다. 방금 얻은 단서가 더 정확하면 준비한 순서도 바로 고칩니다.", closing: "빠르게 잡은 순간을 다음 선택에도 쓸 경험으로 남기세요" },
  { trait: "ESFP:thinkingStyle:experience_based_learning", signals: ["ten_god_shi_shen", "ten_god_shang_guan", "twelve_sinsal_yeokma"], text: "설명을 들을 때는 감이 안 왔는데 한 번 해보자마자 이해된 적 있지 않으신가요? 직접 느낀 감각이 내 것이 되는 속도가 빠른 편입니다.", closing: "즐거웠던 경험에서 다시 해보고 싶은 한 가지를 골라보세요" },
];

export const PRECISION_VOICES: readonly RealityVoice[] = [
  { trait: "ENTJ:identity:efficiency_order_maker", signals: ["sinsal_hyeonchim"], text: "잘못된 부분을 본 순간, 머릿속에서는 이미 고치는 순서까지 끝나 있지 않으신가요? 그래서 답답하다는 말보다 수정안이 먼저 나옵니다.", closing: "" },
  { trait: "INFP:relationships:boundary_against_cruelty", signals: ["sinsal_hyeonchim"], text: "평소에는 넘기던 말도 누군가를 함부로 대하거나 내 가치를 건드리면 예상보다 정확하게 짚어버릴 때가 있지 않으신가요? 부드러운 태도와 날카로운 기준이 같이 있습니다.", closing: "" },
];

// Alternate actual source traits, not synonymous rewordings or random picks.
// These cover a different natal axis when the primary trait has no strong pair.
export const ALTERNATE_REALITY_VOICES: readonly RealityVoice[] = [
  { trait: "ISTJ:identity:adult_like_responsibility", signals: ["ten_god_zheng_guan", "ten_god_qi_sha"], text: "다들 잊고 넘어간 약속도 내가 맡았으면 끝까지 마음에 남지 않으신가요? 티를 내지 않아도 끝냈다는 확인이 있어야 비로소 다른 일에 집중합니다.", closing: "믿고 맡길 사람이라는 이름에 자신의 여유도 포함하세요" },
  { trait: "INTP:thinkingStyle:proof_before_agreement", signals: ["sinsal_hyeonchim", "gwiin_munchang"], text: "여럿이 맞다고 해도 설명의 빈칸이 남으면 바로 고개가 끄덕여지지 않는 편입니다. 반대로 근거가 분명해지면 내가 먼저 낸 의견도 금세 바꿉니다.", closing: "의견을 지키는 일보다 납득할 근거를 찾는 힘을 믿으세요" },
  { trait: "ESFJ:relationships:loyalty_boundary", signals: ["ten_god_jie_cai", "ten_god_bijian", "ten_god_zheng_yin"], text: "내 일은 참아도 가까운 사람이 서운한 일을 겪으면 먼저 편을 들어주지 않으신가요? 챙기는 마음이 당연한 의무로 여겨질 때에는 평소보다 단호해집니다.", closing: "가까운 사람을 지키는 마음에 서로 지킬 약속도 더하세요" },
  { trait: "ESFP:identity:personal_preference_clarity", signals: ["ten_god_jie_cai", "sinsal_dohwa"], text: "일단 같이 어울려도 좋아하는 것과 아닌 것에는 반응 차이가 금방 드러나는 편입니다. 남들이 재미있다는 말보다 내가 그 자리에서 실제로 느낀 즐거움이 기준입니다.", closing: "남의 흥보다 내게 생동감을 남긴 경험을 골라보세요" },
  { trait: "ESFP:relationships:no_prejudice_acceptance", signals: ["ten_god_bijian", "ten_god_shi_shen", "sinsal_dohwa"], text: "나와 다른 사람이어도 일단 같이 해보면 재미있을 것 같아 말을 붙이는 편입니다. 오래 설명하는 소개보다 함께 보낸 한 번의 경험으로 거리가 줄어듭니다.", closing: "먼저 열어준 관계의 문에 다시 만날 약속도 남겨두세요" },
  { trait: "ISFJ:identity:loyal_inner_circle", signals: ["ten_god_bijian", "ten_god_zheng_yin"], text: "처음에는 조심스럽지만 내 사람이라고 느끼면 사소한 필요까지 오래 기억하는 편입니다. 가까워졌다는 표시는 큰 고백보다 다음에도 빠뜨리지 않고 챙겨주는 행동에 남습니다.", closing: "오래 챙기는 관계 안에서 받고 싶은 도움도 알려주세요" },
  { trait: "ENFJ:identity:value_driven_conviction", signals: ["ten_god_zheng_guan", "ten_god_qi_sha"], text: "사람들에게 좋은 일이라고 확신하면 힘이 들어도 그 의미를 계속 설명하고 싶어지지 않으신가요? 단순히 이기는 것보다 함께 납득할 방향이 있어야 오래 움직입니다.", closing: "믿는 방향을 전하되 상대가 선택할 자리도 남겨두세요" },
  { trait: "INTJ:thinkingStyle:definition_precision", signals: ["sinsal_hyeonchim", "gwiin_munchang"], text: "같은 단어를 서로 다른 뜻으로 쓰고 있다는 걸 알아차리면 대화를 잠깐 멈추는 편입니다. 말꼬리를 잡으려는 것이 아니라 기준부터 맞춰야 뒤의 결론을 믿을 수 있기 때문입니다.", closing: "정확한 기준을 다른 사람도 함께 쓸 언어로 만드세요" },
];

export const LOVE_VOICES: readonly RealityVoice[] = [
  { trait: "ENTJ:love:feedback_expectation_love", signals: ["ten_god_zheng_guan", "ten_god_qi_sha"], text: "좋아하는 사람이 답답한 일을 말하면 응원과 함께 개선할 점도 떠오릅니다. 내게는 함께 나아가자는 뜻인데 상대에게는 평가처럼 들리는 순간이 있습니다.", closing: "" },
  { trait: "INFP:love:deep_emotional_bond", signals: ["ten_god_zheng_yin", "sinsal_dohwa", "sinsal_hongyeom"], text: "둘만 아는 노래나 한마디에 그날의 마음까지 다시 떠오르지 않으신가요? 무엇을 했는지보다 어떤 마음으로 함께했는지가 오래 남습니다.", closing: "" },
  { trait: "ENFP:love:warm_confidant_partner", signals: ["ten_god_zheng_yin", "ten_god_shi_shen", "gwiin_cheoneul"], text: "가벼운 이야기로 시작했다가 어느새 서로의 고민까지 나누는 편입니다. 사랑하는 사람에게는 함께 웃는 사람인 동시에 숨긴 마음을 놓아도 되는 사람이 되고 싶습니다.", closing: "" },
  { trait: "INTJ:love:same_direction_attraction", signals: ["ten_god_zheng_guan", "ten_god_zheng_cai"], text: "설레는 대화 중에도 이 사람은 앞으로 어떻게 살고 싶은지 궁금해지는 편입니다. 각자의 목표를 존중하는 모습에서 오래 만날 이유를 찾습니다.", closing: "" },
  { trait: "INTP:love:freedom_based_attachment", signals: ["ten_god_bijian", "ten_god_pian_yin"], text: "좋아하는 마음은 그대로인데 혼자 몰입하다 답장이 늦어지는 때가 있지 않으신가요? 떨어져 있는 시간도 편해야 함께 있는 시간이 더 반갑습니다.", closing: "" },
  { trait: "ENTP:love:awkward_true_crush", signals: ["sinsal_hongyeom", "ten_god_pian_yin"], text: "누구와도 농담은 잘하는데 정말 좋아하는 사람에게 보낼 한 문장은 여러 번 고치는 편입니다. 말솜씨보다 마음이 앞서면 오히려 평소의 여유가 줄어듭니다.", closing: "" },
  { trait: "INFJ:love:quiet_care_partner", signals: ["ten_god_zheng_yin", "ten_god_shi_shen", "gwiin_cheoneul"], text: "상대가 힘들어 보이면 묻기 전에 조용히 편한 자리를 만들어주는 편입니다. 눈치채 주길 바라는 마음도 있지만 부담부터 덜어주고 싶습니다.", closing: "" },
  { trait: "ENFJ:love:emotional_confirmation_need", signals: ["ten_god_zheng_yin", "ten_god_shi_shen"], text: "다정하던 답장이 짧아지면 무슨 일이 있는지 먼저 묻고 싶지 않으신가요? 관계가 괜찮다는 말을 나눌 때 마음이 놓이는 쪽입니다.", closing: "" },
  { trait: "ISTJ:love:reserved_affection", signals: ["ten_god_zheng_cai", "ten_god_zheng_guan"], text: "좋아한다는 말은 짧아도 전에 한 약속은 잘 기억하는 편입니다. 특별한 날의 큰 표현보다 필요할 때 빠지지 않는 것으로 마음을 보여줍니다.", closing: "" },
  { trait: "ISFJ:love:low_request_high_duty", signals: ["ten_god_zheng_yin", "ten_god_zheng_guan"], text: "상대에게 필요한 것은 잘 챙기면서 정작 내가 원하는 것은 나중에 말하지 않으신가요? 괜찮다고 한 뒤에 혼자 서운해지는 순간을 놓치지 마세요.", closing: "" },
  { trait: "ESTJ:love:love_through_action", signals: ["ten_god_zheng_guan", "ten_god_zheng_cai", "gwiin_cheoneul"], text: "걱정된다는 말만 하기보다 직접 알아보고 도와주는 편입니다. 해준 일은 많은데 다정한 말이 부족하다는 이야기를 들으면 당황합니다.", closing: "" },
  { trait: "ESFJ:love:reciprocal_expression_need", signals: ["ten_god_shi_shen", "sinsal_dohwa", "sinsal_hongyeom"], text: "안부를 보낸 뒤 상대도 내 하루를 물어봐 줄 때 유난히 반갑지 않으신가요? 표현을 돌려받는 작은 순간이 사랑받는다는 확신으로 쌓입니다.", closing: "" },
  { trait: "ISTP:love:quiet_warm_affection", signals: ["ten_god_shi_shen", "ten_god_zheng_cai", "ten_god_bijian"], text: "보고 싶다는 말을 길게 쓰기보다 같이 할 만한 것을 보내는 편입니다. 무심해 보여도 가까운 사람의 불편은 그냥 지나치지 않습니다.", closing: "" },
  { trait: "ISFP:love:unspoken_crush_pattern", signals: ["ten_god_zheng_yin", "twelve_sinsal_hwagae", "sinsal_hongyeom"], text: "마음이 커질수록 먼저 보낼 메시지는 더 조심스러워지지 않으신가요? 표현하지 않은 마음이 상대에게도 전해졌다고 생각하지 않는 것이 중요합니다.", closing: "" },
  { trait: "ESTP:love:active_affection", signals: ["ten_god_shi_shen", "sinsal_dohwa", "sinsal_hongyeom"], text: "마음이 생기면 긴 설명보다 같이 가자는 제안이 먼저 나오는 편입니다. 함께 웃고 움직일 일이 생길 때 가까워졌다는 느낌이 선명합니다.", closing: "" },
  { trait: "ESFP:love:expressive_love_style", signals: ["ten_god_shi_shen", "sinsal_dohwa", "sinsal_hongyeom"], text: "좋은 것을 보면 바로 보여주고 싶고 즐거운 곳에서는 그 사람이 떠오릅니다. 사랑하는 마음이 말투와 반응에 먼저 묻어나는 편입니다.", closing: "" },
];

// Existing taxonomy meanings, expressed directly as good fortune. No promised
// event, windfall, promotion date, or invented traditional origin.
export const GOOD_FORTUNE: Readonly<Record<string, string>> = {
  ten_god_pian_yin: "남들이 지나친 연결을 자기 관점으로 바꾸는 탐구의 힘이 있습니다. 편인의 좋은 쓰임은 정답을 많이 모으는 것보다 익숙한 답 밖에서 새 실마리를 발견하는 데 있습니다.",
  ten_god_zheng_yin: "배움과 도움을 내 기반으로 받아들이는 인복의 힘이 있습니다. 정인은 좋은 가르침을 만나고 그것을 다음 선택에 다시 꺼내 쓰는 자원입니다.",
  ten_god_shi_shen: "안의 생각을 밖의 결과로 길러내는 표현력의 힘이 있습니다. 식신은 한 번의 화려한 말보다 손을 거쳐 완성되는 결과에 자기 맛을 남기는 패입니다.",
  ten_god_shang_guan: "익숙한 틀에 새 표현을 내놓는 힘이 있습니다. 상관은 남과 다른 눈으로 허점을 알아보고, 그 자리에 더 나은 설명과 결과를 놓는 재능입니다.",
  ten_god_bijian: "남의 반응만으로 흔들리지 않는 자기 기준이 있습니다. 비견은 혼자 설 힘이면서, 각자의 몫을 존중하는 동료와 나란히 설 기반이기도 합니다.",
  ten_god_jie_cai: "사람 사이의 자극을 추진력으로 바꾸는 힘이 있습니다. 겁재는 함께 달릴 판을 만났을 때 혼자서는 잠들어 있던 승부욕을 깨우는 자원입니다.",
  ten_god_zheng_guan: "맡은 자리에서 신뢰와 인정을 쌓는 힘이 있습니다. 정관은 이름만 있는 자리가 아니라 약속한 몫을 지켜 존재감을 남기는 패입니다.",
  ten_god_qi_sha: "압박이 생긴 순간 방향을 세우는 대응력이 있습니다. 편관은 모두가 당황할 때 당장 지킬 기준을 붙잡고 움직이는 힘입니다.",
  ten_god_zheng_cai: "재물을 꾸준히 관리하고 생활의 기반으로 남기는 축적의 힘이 있습니다. 정재의 좋은 쓰임은 들어오고 나가는 작은 흐름을 놓치지 않는 데 있습니다.",
  ten_god_pian_cai: "바깥의 기회와 필요한 사람을 연결하는 재물의 감각이 있습니다. 편재는 넓게 살피되 실제로 손에 남길 교환을 알아보는 패입니다.",
  twelve_sinsal_jangseong: "앞에 서고 이름을 남기는 명예의 힘이 이미 있습니다. 장성의 깃발은 사람들 사이에서 방향을 보여주는 자리에서 살아납니다.",
  twelve_sinsal_banan: "자리와 인정 쪽으로 힘이 실리는 좋은 패입니다. 반안은 안장에 올라 자신의 이름으로 역할을 맡는 모습입니다.",
  gwiin_jaego: "재물을 쌓고 남기는 축적의 패입니다. 돈뿐 아니라 기술·고객·경험을 다시 쓰는 자산으로 만드는 힘도 여기에 있습니다.",
  gwiin_cheoneul: "막힌 길에 사람의 손길을 잇는 귀인과 인복의 패입니다. 혼자 버티는 실력만큼 좋은 도움을 알아보고 받는 통로가 중요합니다.",
  gwiin_cheondeok: "날카로운 관계에 돌아올 길을 남기는 귀인의 힘입니다. 갈등을 완충하는 인복을 자신까지 지우는 양보로 쓰지 마세요.",
  gwiin_woldeok: "함께한 사람에게 신뢰와 도움을 잇는 인복의 패입니다. 한 번 받은 호의를 오래 가는 관계의 자산으로 남기는 데 힘이 있습니다.",
  gwiin_munchang: "배운 것을 말과 글로 드러내는 문재와 표현력의 패입니다. 이해한 것을 자기 언어로 남길 때 이름과 실력이 함께 기억됩니다.",
  gwiin_mungok: "생각에 말과 글의 흐름을 붙이는 문재의 패입니다. 같은 내용도 어떤 순서와 리듬으로 전하는지에 힘이 실립니다.",
  gwiin_hakdang: "배움의 자리에서 힘을 얻는 학업의 패입니다. 좋은 스승과 공부할 환경을 가까이 두고, 익힌 것을 다시 써먹는 쪽으로 움직이세요.",
  gwiin_taegeuk: "배운 것을 원리까지 이해하며 기반을 다지는 좋은 패입니다. 오래 파고들어 납득한 것이 삶의 중심을 잡는 자원이 됩니다.",
  gwiin_amrok: "겉으로 크게 드러나지 않아도 쓸 기반을 찾아내는 복의 패입니다. 이미 가진 경험과 도움의 통로부터 살펴보세요.",
  twelve_sinsal_hwagae: "혼자 숙성한 취향과 생각을 깊이로 남기는 창작의 패입니다. 화려함을 덮는 화개의 시간에는 자기 세계를 다듬는 힘이 있습니다.",
  twelve_sinsal_yeokma: "움직이며 접점을 넓히는 이동의 기운입니다. 낯선 곳에서 얻은 경험을 돌아와 쓸 자원으로 남길 때 이 패가 빛납니다.",
};

// Distinct self-recognition and learning angles of the existing ten-god
// meanings. Used only for selected, substantial facts, never as filler.
export const GOD_PORTRAITS: Readonly<Record<string, readonly [string, string]>> = {
  ten_god_bijian: ["비견은 다른 사람의 확신을 빌려서는 쉽게 움직이지 않는 힘입니다. 같은 선택을 해도 내가 납득한 이유가 있어야 편하고, 조언이 결정권까지 가져가는 순간에는 거리를 둡니다.", "혼자 풀어낸 답에는 오래 남는 자신감이 붙습니다. 다만 익숙한 풀이를 고집하고 있는지 보려면 다른 사람이 같은 곳에 도착한 경로도 한 번 따라가 보세요."],
  ten_god_jie_cai: ["겁재는 비슷한 사람의 움직임을 그냥 배경으로 두지 않습니다. 누군가의 새 시도가 자극이 되어 잠잠하던 욕심을 깨우고, 혼자 정한 목표보다 함께 겨루는 판에서 속도가 붙습니다.", "함께 연습할 사람이 있으면 혼자일 때와 집중의 리듬이 달라집니다. 순위만 보면 조급해지지만 서로 다른 방법을 비교하면 상대의 성장이 내 배울 거리가 됩니다."],
  ten_god_shi_shen: ["식신의 자신감은 잘할 것이라는 설명보다 직접 해낸 것에서 나옵니다. 머릿속 생각을 손에 잡히는 결과로 옮기며 감을 익히고, 익숙해진 일에도 조금씩 자기 맛을 더합니다.", "읽을 때는 알았던 내용도 직접 만들어 보면 비어 있던 부분이 드러납니다. 작은 완성물을 하나 남기는 과정이 배운 것과 내 것이 된 것을 구분해 줍니다."],
  ten_god_shang_guan: ["상관은 모두가 익숙해서 받아들인 방식에도 다른 길이 보이는 힘입니다. 질문이 많은 것은 무조건 반대해서가 아니라 더 나은 표현이 떠올라서이고, 답답함을 개선으로 바꿀 때 그 눈이 빛납니다.", "설명의 허점을 발견하는 순간 공부에 재미가 붙습니다. 왜 틀렸는지 짚은 뒤 내 설명으로 다시 만들어 보면 비판하는 눈이 이해의 깊이로 남습니다."],
  ten_god_pian_cai: ["편재는 한 가지 안에 머무르기보다 바깥에서 무엇이 필요한지 살피는 힘입니다. 서로 관계없어 보였던 사람과 자원 사이에서 교환의 가능성을 보고, 새 접점을 만날 때 판단의 재료가 늘어납니다.", "배운 것이 어디에서 쓰이는지 보이면 이해가 빨라집니다. 서로 다른 분야의 사례를 비교하면서 같은 원리가 다른 필요를 해결하는 장면을 찾아보세요."],
  ten_god_zheng_cai: ["정재는 큰 숫자보다 반복되는 흐름에 안심을 얻는 힘입니다. 자주 쓰는 것과 남겨둘 것을 구분하고, 눈앞의 매력보다 계속 유지할 수 있는지를 함께 봅니다.", "오늘 이해한 것이 다음 진도의 바닥이 될 때 마음이 놓입니다. 익힌 것을 일정한 간격으로 다시 써보는 과정에서 지식도 생활의 기반처럼 쌓입니다."],
  ten_god_qi_sha: ["편관은 급해질수록 지금 무엇부터 지켜야 하는지 찾는 힘입니다. 모두가 당황하는 순간에는 오히려 할 일이 분명해지지만, 그 긴장이 끝난 뒤에도 계속 켜져 있으면 사소한 일까지 비상상황처럼 느낍니다.", "막연히 읽기보다 해결할 문제가 분명할 때 집중이 모입니다. 다만 늘 마감의 압박을 빌리지 않아도 되도록 작은 문제를 스스로 고르고 끝내는 경험을 남겨보세요."],
  ten_god_zheng_guan: ["정관은 누가 보지 않는 자리에서도 맡은 몫을 의식하는 힘입니다. 약속한 것을 지킨 뒤에야 마음이 놓이고, 역할이 흐릿하면 내 몫이 아닌 일까지 먼저 챙기기 쉽습니다.", "무엇을 알면 충분한지 기준이 있으면 배움의 방향이 분명해집니다. 기준을 채운 뒤에는 정해진 답이 없는 상황에서도 같은 지식을 써보며 적용 범위를 넓혀보세요."],
  ten_god_pian_yin: ["편인은 눈앞의 답보다 그 뒤의 연결을 붙잡는 힘입니다. 대화가 끝난 뒤에도 생각은 이어지고, 바로 설명하지 못했던 것이 혼자 있는 시간에 전혀 다른 관점으로 정리됩니다.", "궁금한 한 갈래를 따라가다 처음 질문과 다른 곳에 도착하는 것이 편인의 공부입니다. 옆길에서 얻은 발견을 처음 문제에 다시 가져오면 깊은 탐색이 혼자만의 생각에 머무르지 않습니다."],
  ten_god_zheng_yin: ["정인은 이유를 이해하고 믿을 기반이 생겼을 때 움직임이 편해지는 힘입니다. 누가 빨리하라고 재촉하는 것보다 왜 그래야 하는지 납득시켜 주는 설명이 오래 남습니다.", "정리된 가르침을 받아들이고 배경까지 이해하는 시간이 내 기반을 만듭니다. 설명을 그대로 기억하는 단계에서 벗어나 다른 사람의 질문에 내 말로 답할 때 배움의 빈틈도 보입니다."],
};

export const LIFE_EXAMPLES: Record<UserLifeStatus, string> = {
  employee: "여럿이 맡은 일을 정하는 자리", business_owner: "함께 일을 꾸리는 자리", freelancer: "새 의뢰의 방향을 맞추는 자리",
  student: "조별활동에서 역할을 정하는 자리", exam_certificate: "함께 공부할 계획을 세우는 자리", job_seeker: "스터디나 새로운 활동을 정하는 자리",
  resting: "친구들과 작은 약속을 정하는 자리", other: "모임에서 무엇을 할지 정하는 자리",
};

export const ELEMENT_IMAGES: Readonly<Record<string, readonly [string, string]>> = {
  wood: ["목은 가지를 뻗는 힘입니다. 새 취미나 공부를 크게 결심하기보다 이번 주에 다시 해볼 작은 싹부터 심으세요.", "가지가 여러 방향으로 뻗어 있으면 뿌리가 바쁩니다. 새 계획이 떠오른 날에도 이미 시작한 것 하나를 끝내는 쪽으로 성장의 힘을 모으세요."],
  fire: ["화는 안의 마음을 밖으로 밝히는 불입니다. 좋은 일을 혼자만 알고 넘기지 말고 짧은 칭찬이나 반가운 인사로 온기를 꺼내보세요.", "불은 이미 충분합니다. 더 태우기보다 식히는 시간이 필요합니다. 신나는 약속 뒤에는 조용한 귀갓길처럼 반응하지 않아도 되는 틈을 남겨보세요."],
  earth: ["토는 다시 발을 디딜 바닥입니다. 정신없는 날에도 돌아올 물건의 자리와 생활 순서 하나가 하루를 받쳐 줍니다.", "단단한 땅도 길 하나는 열려 있어야 합니다. 늘 해오던 방식이 편해서 남은 것인지, 정말 필요한 것인지 작은 순서부터 바꿔보세요."],
  metal: ["금은 자르고 구분하는 힘입니다. 끝없이 열린 알림과 쌓인 물건처럼 경계가 흐린 곳 하나를 골라 여기까지라는 선을 그어보세요.", "잘 드는 칼도 모든 곳에 쓸 필요는 없습니다. 꼭 지킬 원칙과 단지 내 취향인 것을 나누면 정확함이 사람을 밀어내지 않습니다."],
  water: ["수는 받아들이고 흘려보내는 물입니다. 짧게 읽고 기록하거나 물가를 걷는 시간을 골라 하루의 말을 가라앉혀 보세요.", "물이 멀리 흐르듯 생각이 길어지는 힘입니다. 잠들기 전에도 다음 경우의 수가 떠오른다면 내일 확인할 것 하나만 적고 오늘의 흐름은 닫으세요."],
};
