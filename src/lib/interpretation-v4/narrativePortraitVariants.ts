import type { VariantBank, EditorialVariant } from "./narrativeVariation";
const v = (text: string, sceneFamily?: string, theme?: string): EditorialVariant => ({ text, sceneFamily, theme });

export const PORTRAIT_VARIANTS: VariantBank = {
  "day_master_jeonghwa/opening-owned-gift": { natal: v("작은 정성이 사람에게 오래 남는 힘이 있습니다. 대단한 일을 해주지 않아도 그 사람이 불편하지 않았으면 해서 마지막 손질을 한 번 더 합니다. 누군가는 별일 아니라고 넘길 그 차이가 당신을 다시 찾고 싶게 만듭니다.", "last-warm-detail", "quiet-strength") },
  "day_master_gabmok/strength-person": { care: v("필요한 일이 보이면 누가 시키기 전에 시작할 수 있습니다. 충분히 알아본 것을 생활에 가져올 때는 의외로 망설임이 적습니다. 생각만 쌓아두지 않고 첫걸음으로 바꾸는 힘도 갖고 있습니다.") },
  "day_master_gabmok/opening-owned-gift": { care: v("새로운 일을 내 생활로 데려오는 힘이 있습니다. 거창한 도전이 아니어도 가족에게 필요했던 변화를 처음 시작한 사람은 당신일 수 있습니다.") },
  "day_master_gabmok/portrait-seen": { care: v("부탁을 잘 받아주는 모습만 보고 늘 따라가는 사람이라 생각하면 조금 다릅니다. 내가 옳다고 본 방향에는 조용하게 힘을 줍니다. 충분히 납득한 일을 시작하면 다른 사람의 망설임에 쉽게 멈추지 않는, 뿌리를 내린 나무 같은 면이 있습니다.", "quiet-start", "outward-inner") },
  "day_master_gabmok/private-portrait": { care: v("돌볼 일이 줄어든 시간에는 나를 위해 시작할 것도 떠올립니다. 배워보고 싶던 것, 혼자 가보고 싶던 곳을 골라두는 재미가 있습니다. 누군가의 하루를 챙기는 사람 안에도 자기 가지를 뻗고 싶은 마음은 그대로 있습니다.", "my-own-start", "personal-desire") },
  "day_master_gabmok/love-near-you": { care: v("좋아하는 사람의 다음 일정까지 기억해두는 편입니다. 함께 해보면 좋을 일을 먼저 찾아놓고 반응을 기다리기도 합니다. 내 계획에 상대 자리를 만드는 마음은 크지만, 상대도 고를 수 있어야 함께하는 기쁨이 더 오래 갑니다.", "make-room-in-plans", "planned-affection") },
  "day_master_gabmok/money-taste": { care: v("오늘 조금 더 들더라도 여러 번 편하게 쓸 수 있다면 값어치를 느낍니다.") },
  "day_master_gabmok/people-reversal": { care: v("친한 사람이 한 걸음 나아갔다는 이야기에 내가 시작했을 때의 기쁨도 돌아옵니다.") },
  "day_master_gabmok/shadow-direct": { care: v("잘 듣는 것과 내 생각을 바꾸는 건 다른 일입니다. 다 들어놓고 결국 처음 정한 대로 해서 옆 사람이 웃을 때도 있습니다.") },
  "day_master_gabmok/closing-owned-force": { care: v("누군가를 돌보며 길러온 꾸준함은 내 새 출발에도 쓸 수 있는 힘입니다.") },
  "day_master_imsu/strength-person": {
    inquiry: v("답이 하나라는 말을 들어도 다른 길이 있는지 살펴봅니다. 멀리 떨어진 지식을 가져와 지금 문제에 맞춰보는 눈이 있습니다. 넓게 아는 것이 쓸모 있는 연결로 바뀌는 사람입니다."),
    challenge: v("일을 하나 맡아도 그 주변에서 바뀔 것을 같이 봅니다. 따로 놀던 아이디어를 모아 더 큰 계획으로 만드는 힘이 있습니다. 처음의 질문보다 끝에서 그리는 판이 훨씬 넓어지기도 합니다."),
  },
  "day_master_imsu/portrait-seen": {
    inquiry: v("시야가 넓어도 아무 방향으로 흘러가지는 않습니다. 몇 가지 가능성을 펼친 뒤 내 기준에 맞는 것을 고릅니다. 큰 물이 둑을 만나 길을 얻듯, 넓게 본 생각에 분명한 경계가 붙으면 당신의 설명은 더 힘이 생깁니다.", "wide-view-with-boundary", "outward-inner"),
    challenge: v("남들이 하나씩 처리할 때 당신은 서로 연결되면 어떻게 달라질지 봅니다. 이야기의 규모가 갑자기 커지는 것 같아도 출발점은 실제 불편 하나일 때가 많습니다. 여러 지류가 만나는 물길처럼 흩어진 것을 모아 새 흐름을 만드는 눈입니다.", "connect-separate-plans", "outward-inner"),
  },
  "day_master_imsu/private-portrait": {
    inquiry: v("가보지 않은 곳의 지도를 보다 보면 가능한 길이 여럿 떠오릅니다. 당장 떠날 계획이 없어도 생활이 다른 곳을 상상하는 재미가 있습니다. 혼자 머릿속의 세계를 넓히는 시간도 당신에게는 꽤 괜찮은 휴식입니다.", "imagined-journey", "free-curiosity"),
    challenge: v("사람들 앞에서는 아이디어를 크게 펼쳤다가 혼자 돌아와 안 되는 조건도 따져봅니다. 그 시간을 본 사람은 적어서 늘 자신만만하다는 말을 듣기도 합니다. 당신의 큰 그림 뒤에는 어디까지 가능한지 다시 고르는 밤이 있습니다.", "check-my-big-idea", "private-reconsideration"),
  },
  "day_master_imsu/love-near-you": {
    inquiry: v("내가 모르던 분야를 자기 말로 이야기하는 사람에게 귀가 열립니다. 모든 취향이 같을 필요는 없고 서로의 질문을 재미있어하면 좋습니다. 같이 있을수록 몰랐던 세계가 늘어나는 관계는 쉽게 지루해지지 않습니다.", "curious-about-your-world", "expansive-affection"),
    challenge: v("대화하다 함께 해보고 싶은 일이 늘어나는 사람에게 마음이 갑니다. 농담으로 꺼낸 상상이 진짜 약속이 될 때 은근히 설렙니다. 내 생각을 따라오기만 하는 사람보다 재미있는 다른 답을 돌려주는 사람이 더 오래 궁금합니다.", "shared-what-if", "expansive-affection"),
  },
  "day_master_imsu/money-taste": {
    inquiry: v("새로운 내용을 이해할 수 있게 해주는 도구나 경험에는 단순한 물건값 이상을 봅니다."),
    challenge: v("통장 밖에도 쌓이는 것이 있다고 생각해서 사람을 만나고 경험을 넓히는 돈에는 이유가 많습니다."),
  },
  "day_master_imsu/people-reversal": {
    inquiry: v("누군가와 의견이 달라도 그 사람이 어떤 전제에서 말했는지 알아보려 합니다."),
    challenge: v("다른 생각을 가진 친구가 있으면 내 계획에도 없던 선택지가 생겨서 재미있습니다."),
  },
  "day_master_imsu/shadow-direct": {
    inquiry: v("고를 길이 많아지면 출발은 늦어집니다. 충분히 비교한 것 같은데 마지막 한 가지가 또 궁금합니다."),
    challenge: v("벌려놓은 가능성이 오늘 할 일보다 커집니다. 멋진 계획은 여럿인데 끝낸 것은 아직 적은 날도 있습니다."),
  },
  "day_master_imsu/closing-owned-force": {
    inquiry: v("남들은 별개로 본 경험에서 통하는 이유를 찾아내는 것이 당신이 오래 쓸 재주입니다."),
    challenge: v("당신이 크게 펼친 질문 덕에 좁았던 선택지도 함께 넓어질 수 있습니다."),
  },
  "day_master_gyeonggeum/strength-person": { privacy: v("생각이 복잡해도 지킬 기준은 분명히 가릅니다. 애매한 부탁에 무조건 맞춰주기보다 가능한 몫을 정확히 말하는 힘이 있습니다. 그 선명함이 오래 지킬 약속을 만듭니다.") },
  "day_master_gyeonggeum/portrait-seen": { privacy: v("말수가 적어도 중요한 순간의 답은 흐리지 않는 편입니다. 상대 사정을 충분히 생각하면서도 내 기준을 없애지는 않습니다. 엉킨 것을 잘라 길을 내는 도구처럼, 오래 고민한 끝에 내놓은 구분이 주변의 막막함을 덜어줍니다.", "thoughtful-boundary", "outward-inner") },
  "day_master_gyeonggeum/private-portrait": { privacy: v("혼자서는 머릿속을 차지하던 것들을 하나씩 정리합니다. 해야 할 일과 굳이 하지 않을 일을 갈라놓으면 조용히 후련해집니다. 남에게 냉정해지려는 게 아니라 소중한 것을 지킬 힘을 남겨두는 방식입니다.", "clear-mental-space", "private-recovery") },
  "day_master_gyeonggeum/love-near-you": { privacy: v("가까운 사람에게 어려운 일이 생기면 말없이 내 편이라는 행동을 보입니다. 평소의 거리감만 본 사람은 그 단호한 의리에 놀라기도 합니다. 사랑할 때도 모든 것을 섞기보다 서로를 지킬 선이 또렷한 쪽을 좋아합니다.", "protect-with-boundaries", "loyal-affection") },
  "day_master_gyeonggeum/money-taste": { privacy: v("마음에 든 것이라도 생활에서 맡을 자리가 없으면 오래 망설여봅니다.") },
  "day_master_gyeonggeum/people-reversal": { privacy: v("가까운 사람이 곤란해지면 평소보다 단단한 목소리로 편을 들어줍니다.") },
  "day_master_gyeonggeum/shadow-direct": { privacy: v("내 안에서 정리된 답을 상대도 바로 받아들일 거라 생각할 때가 있습니다. 충분히 고민한 말이라 더 물러서기 어렵습니다.") },
  "day_master_gyeonggeum/closing-owned-force": { privacy: v("무엇을 지키고 무엇을 내려놓을지 가르는 판단이 당신의 세계를 오래 받쳐줍니다.") },
  "day_master_byeonghwa/portrait-seen": { steady: v("안전하고 익숙한 사람들 사이에서는 반응이 밝아집니다. 웃을 때의 활기와 중요한 약속을 고를 때의 신중함은 다른 장면에서 나옵니다. 커튼을 열 때 방이 밝아지듯 편안해지면 따뜻한 얼굴이 드러나지만, 그렇다고 신뢰까지 빨리 주는 사람은 아닙니다.", "warmth-after-trust", "outward-inner") },
};
