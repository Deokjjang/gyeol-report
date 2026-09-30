import type { VariantBank, EditorialVariant } from "./narrativeVariation";
const v = (text: string, sceneFamily?: string, theme?: string): EditorialVariant => ({ text, sceneFamily, theme });

/** A root keeps its meaning; each domain gets a different observable manifestation. */
export const DOMAIN_VARIANTS: VariantBank = {
  "element:WATER:low/element-WATER": {
    meaning: v("수의 조용한 흐름을 빌려온다면 생각을 빨리 정리하라고 재촉하지 않는 풍경이 어울립니다. 같이 책을 읽다가 궁금한 대목만 나누는 사람, 대답보다 듣는 시간을 넉넉히 주는 모임을 떠올려볼 수 있습니다. 물가를 천천히 걷듯 결론을 잠깐 미뤄도 편한 시간을 상상해보는 겁니다.", "unhurried-listening", "symbolic-water"),
  },
  "element:FIRE:low/element-FIRE": {
    capacity: v("화의 밝은 기운을 생활에 빌린다면 성과와 상관없이 같이 웃을 자리를 떠올릴 만합니다. 잘했는지 평가하지 않는 취미 모임이나 좋아하는 노래에 반응하는 친구가 그 이미지와 어울립니다. 무언가 해내야만 즐거워도 되는 건 아니니까요.", "joy-without-achievement", "symbolic-fire"),
    care: v("화의 따뜻한 반응을 닮은 사람과 있으면 늘 챙기는 이야기 말고 내 재미도 꺼낼 수 있습니다. 만든 것을 자랑하면 같이 기뻐해주는 친구, 낮에 가볍게 걷고 웃는 시간을 떠올려봅니다. 생활에 작은 밝음을 빌려오는 상징적인 풍경입니다.", "share-small-delight", "symbolic-fire"),
    challenge: v("화의 밝은 표현을 생활의 이미지로 옮기면 답을 겨루지 않아도 즐거운 자리가 됩니다. 재치 있게 말하지 않는 날에도 함께 웃을 수 있는 사람, 좋아하는 것을 부담 없이 보여주는 모임을 상상해볼 수 있습니다. 생각의 승패 밖에도 재미를 둘 자리가 있습니다.", "play-without-debate", "symbolic-fire"),
    practice: v("덜 드러난 화의 상징은 같이 즐기는 밝은 장면으로 빌려볼 수 있습니다. 기록을 재지 않고 가볍게 몸을 움직이거나 좋아하는 음악을 함께 듣는 모습입니다. 얼마나 잘했는지 말고 즐거웠다는 반응이 남는 취미도 괜찮습니다.", "activity-without-score", "symbolic-fire"),
    steady: v("화가 상징하는 온기는 지킬 일을 잠깐 내려놓고 반응을 나누는 풍경으로 떠올릴 수 있습니다. 잘 정리된 말이 아니어도 재미있게 들어주는 사람 곁에서 오늘 좋았던 것을 꺼내보는 모습입니다. 미리 정한 순서 없이 웃을 수 있는 작은 시간이 생활을 다르게 느끼게 합니다.", "unplanned-laughter", "symbolic-fire"),
  },
  "element:EARTH:high/element-EARTH": {
    inquiry: v("토의 묵직한 결은 알아낸 것을 오래 쓸 바탕으로 남기려는 모습과 닮았습니다. 지금 해결했다고 흩어두기보다 다시 찾을 자리를 마련하면 마음이 놓입니다. 쌓아온 것을 지키는 힘이 크지만 전부 붙들고 있으면 새 관심이 들어올 자리도 좁아집니다.", "keep-a-usable-base", "symbolic-earth"),
    practice: v("토의 단단한 이미지는 직접 해본 것을 내 것으로 굳히는 힘으로 떠올릴 수 있습니다. 한 번 잘된 요령을 다시 쓸 수 있게 반복하면 든든해집니다. 새로운 것에 뛰어드는 모습 안에도 손에 익은 바탕을 갖고 싶어 하는 마음이 있습니다.", "make-experience-stable", "symbolic-earth"),
  },
  "element:WOOD:high/element-WOOD": {
    challenge: v("목처럼 가지를 뻗는 기운은 하나의 시작에서 다음 가능성까지 보는 모습에 가깝습니다. 작은 일을 해보려다 함께 바꿀 것들이 여럿 떠오릅니다. 자라는 재미가 큰 만큼 이번에 끝낼 가지와 다음에 펼칠 가지를 구분하면 성취도 더 잘 보입니다.", "branching-project", "symbolic-wood"),
    steady: v("목의 자라는 이미지는 익숙한 것을 잘하는 데서 멈추지 않으려는 마음에도 있습니다. 지금 할 일을 끝냈는데도 더 배워두면 좋을 것이 눈에 들어옵니다. 조용히 다음 단계를 준비하는 모습 역시 앞으로 뻗어가는 힘입니다.", "prepare-next-learning", "symbolic-wood"),
    natal: v("목이 도드라진 모습은 쉬는 동안에도 다음에 해보고 싶은 것을 떠올리는 마음과 닮았습니다. 당장 시작하지 않아도 관심이 움직인다는 건 내 안에 자랄 가지가 남아 있다는 뜻입니다. 새 관심마다 의무를 붙이기보다 작게 맛보는 즐거움도 가져볼 수 있습니다.", "small-start-during-rest", "symbolic-wood"),
  },
  "sinsal_hyeonchim/strength-owned": {
    notice: v("다 같이 괜찮다고 할 때 작은 불편을 먼저 봅니다. 설명보다 손이 머뭇거리는 순간, 표정이 굳는 순간이 눈에 들어옵니다. 덕분에 상대가 길게 부탁하기 전에 어색한 부분을 바꿔주는 센스가 있습니다.", "notice-hesitation", "precision-social"),
    challenge: v("좋은 이야기에도 빠진 조건을 묻습니다. 친구가 괜찮은 제안을 받았다고 들떠 있을 때 ‘그럼 이 경우에는 어떻게 되는 거야?’라는 질문이 나옵니다. 찬물을 끼얹으려는 게 아니라 나중에 아쉬울 구멍이 지금 보이는 겁니다.", "proposal-exception", "precision-conditions"),
    practice: v("말로는 다 맞는 설명인데 실제로 해보면 안 맞는 곳을 찾습니다. 자세 하나, 도구의 위치 하나만 바꿨는데 결과가 달라질 때 특히 감이 빠릅니다. 남들이 감탄하는 순발력 뒤에는 작은 차이를 보는 눈도 있습니다.", "physical-adjustment", "precision-practical"),
    steady: v("어제 들은 숫자와 오늘 적힌 숫자가 다르면 그냥 넘어가지 않습니다. 기억해둔 기준이 있어서 무엇이 달라졌는지 확인도 빠릅니다. 남들은 꼼꼼하다고 한마디 하지만, 당신 덕에 뒤늦게 다시 할 일이 줄어드는 겁니다.", "remembered-baseline", "precision-memory"),
  },
  "ten_god_pian_yin/strength-owned": {
    connect: v("남들이 안 어울린다고 한 두 가지를 붙여보는 재주가 있습니다. 전혀 다른 분야에서 본 색이나 말투가 지금의 아이디어를 바꿉니다. 관심사가 넓다는 건 시작점도 여러 개라는 뜻입니다.", "unexpected-association", "original-combination"),
    inquiry: v("설명서가 빠뜨린 조건부터 알아보는 사람입니다. 한 번 알아낸 예외를 잘 기억해서 비슷한 문제 앞에서 덜 당황합니다. 오래 붙든 질문이 남들이 쉽게 빌릴 수 없는 전문성이 됩니다.", "unwritten-exception", "specialist-knowledge"),
  },
  "sinsal_gwimun/strength-owned": {
    meaning: v("끝난 대화에서도 사람마다 다르게 받아들인 부분을 떠올립니다. 겉으로 드러난 말만 모아서는 이해되지 않던 마음이 보일 때가 있습니다. 누구도 크게 설명하지 않은 차이를 읽어내는 세밀함이 당신의 장점입니다.", "different-interpretations", "sensitive-perception"),
    privacy: v("사람이 아무렇지 않게 덧붙인 말에서 오래 남을 실마리를 찾습니다. 딱 잘라 설명하기 어려운 분위기를 느끼고도 바로 단정하지는 않습니다. 여러 번 마주친 작은 차이들이 연결되면 왜 마음이 쓰였는지 비로소 또렷해집니다.", "quiet-undertone", "sensitive-perception"),
  },
  "ten_god_zheng_yin/strength-owned": {
    care: v("한 번 편했던 방법을 기억해 다음 생활에 가져오는 힘이 있습니다. 처음 해본 요리가 잘됐을 때 바꾼 양을 적어두거나, 가족이 편해했던 순서를 다음에도 챙기는 식입니다. 경험을 잊지 않고 다시 써서 주변의 하루를 덜 어렵게 만듭니다.", "reuse-household-experience", "applied-memory"),
  },
  "ten_god_qi_sha/work": {
    notice: v("급한 사람이 옆에 있으면 오히려 눈앞의 순서가 또렷해집니다. 거창하게 지휘하지 않아도 지금 빠지면 안 되는 것을 먼저 챙깁니다. 평소의 조용한 인상과 달리 꼭 필요한 순간에는 망설이지 않는 사람이 됩니다.", "quiet-urgency", "pressure-response"),
    capacity: v("동시에 문제가 터지면 피곤하다는 생각보다 어디까지 내가 결정할지가 먼저 떠오릅니다. 일을 살리는 판단은 빠르지만, 잘 정리한 뒤에도 긴장이 쉽게 꺼지지는 않습니다. 큰 책임을 감당하는 배짱과 계속 켜져 있는 머리를 함께 가진 셈입니다.", "multiple-demands", "pressure-response"),
    inquiry: v("처음 보는 어려운 일을 맡으면 우선 제일 위험한 부분부터 분리합니다. 막연하게 겁내기보다 어디까지 알며 어디부터 확인할지 정하면 마음이 잡힙니다. 무서운 문제를 작은 질문으로 바꿀 줄 아는 것이 당신의 침착함입니다.", "isolate-unknown-risk", "pressure-response"),
    connect: v("마감이 다가오면 떠오른 생각 전부를 들고 갈 수 없다는 걸 압니다. 버릴 안을 고르는 순간에는 의외로 단호해집니다. 평소의 자유로운 분위기만 본 사람은 끝낼 때 보여주는 집중력을 새롭게 보기도 합니다.", "choose-before-deadline", "pressure-response"),
  },
  "sinsal_hyeonchim/work": {
    notice: v("완료했다는 표시보다 실제로 불편 없이 넘어갔는지가 중요합니다. 안내를 듣고도 멈춰 있는 사람을 보면 어느 말이 어려웠는지 다시 살핍니다. 작은 혼선을 미리 알아보는 감각이 함께 일하는 사람의 수고까지 덜어줍니다.", "check-comprehension", "precision-handoff"),
    challenge: v("‘원래 이렇게 한다’는 말로 끝난 순서가 자꾸 걸립니다. 빠진 조건을 짚고 바꿔볼 방법까지 말하면 질문은 불평과 달라집니다. 당신이 까다롭게 본 지점이 모두의 불편을 줄이는 출발점이 됩니다.", "question-default-process", "precision-improvement"),
    practice: v("설명과 실제 결과가 다른 순간을 놓치지 않습니다. 대충 여러 번 반복하기보다 방금 무엇이 달랐는지 바로 고쳐봅니다. 당신의 눈썰미는 책상 위 정답보다 손에 익은 요령으로 남기 좋습니다.", "trial-correction", "precision-practical"),
    steady: v("숫자가 맞아도 설명이 안 되면 끝난 일이 아닙니다. 처음 약속한 조건과 마지막 결과를 나란히 놓고 봐야 마음이 놓입니다. 조용히 잡아낸 작은 차이 덕분에 중요한 판단을 다시 뒤집는 일을 줄입니다.", "final-reconciliation", "precision-accountability"),
  },
  "ten_god_zheng_guan/work": {
    meaning: v("내가 맡기로 한 일은 다른 사람이 기다릴 수 있다는 걸 압니다. 중간에 생긴 사정을 아무 말 없이 넘기는 것보다 미리 설명하는 쪽이 편합니다. 오래 같이 일하고 싶은 사람이라는 평가는 그런 예측 가능한 태도에서 나옵니다.", "explain-changed-promise", "reliability"),
    care: v("누가 검사하지 않아도 약속한 몫은 마무리하고 싶습니다. 집에서 맡은 일을 끝내고 나서야 마음 편하게 앉는 것도 비슷합니다. 눈에 띄는 성과가 없는 날에도 일상을 믿고 이어갈 수 있게 하는 사람이 있습니다.", "finish-household-promise", "reliability"),
    challenge: v("납득한 약속에는 생각보다 엄격합니다. 처음에 왜 해야 하는지 많이 물었다고 해서 맡은 뒤까지 대충하는 사람은 아닙니다. 스스로 동의한 기준을 지켜낸 결과로 까다로운 첫인상을 바꾸는 쪽입니다.", "question-then-commit", "reliability"),
    steady: v("급하다는 말 한마디로 확인할 순서를 건너뛰기 어렵습니다. 오늘 빨리 넘긴 일이 다음 사람에게 더 크게 돌아갈 수 있다는 걸 생각합니다. 당신의 성실함은 오래 앉아 있는 모습보다 이어받는 사람이 덜 불안한 결과에 있습니다.", "predictable-handoff", "reliability"),
  },
  "ten_god_zheng_yin/work": {
    care: v("가르치려 들기 전에 상대가 어디까지 해봤는지 봅니다. 같이 작은 것을 만들어보며 막힌 부분에서만 손을 보태면 상대도 금방 자기 몫을 찾습니다. 챙김이 대신해주는 일로만 끝나지 않는다는 점이 다정한 능력입니다.", "make-together", "support-learning"),
    practice: v("해보며 알아낸 순서를 나중에 다시 꺼내 쓸 수 있습니다. 옆 사람이 같은 곳에서 막히면 길게 이론을 말하기보다 내가 바꿨던 한 가지를 보여줍니다. 몸으로 익힌 경험을 남에게 건네는 설명도 좋은 실력입니다.", "demonstrate-a-method", "support-learning"),
  },
  "ten_god_shang_guan/work": {
    privacy: v("내 공간이라고 해도 쓰는 사람이 불편하면 처음 생각을 고칠 수 있습니다. 취향을 지키는 일과 남의 반응을 무시하는 일은 다르다는 걸 압니다. 좋아하는 모양에 실제로 쓰기 편한 방법까지 붙일 때 당신다운 결과가 나옵니다.", "revise-for-use", "improvement"),
  },
  "ten_god_zheng_cai/money": {
    meaning: v("갖고 싶은 것이 생겨도 내 생활에서 얼마나 자주 만날지 생각합니다. 좋아서 샀다는 마음과 충분히 쓴다는 만족이 함께 있어야 덜 아깝습니다. 작은 돈도 어디에 남는지 보는 현실감각이 있습니다.", "lasting-use", "practical-money"),
    care: v("같은 생활비로 필요한 것을 빠뜨리지 않는 재주가 있습니다. 싸다는 말에 무조건 많이 사기보다 지금 집에 남은 것부터 떠올립니다. 남들은 티 안 난다고 해도 새는 돈을 막는 능력은 분명한 살림의 힘입니다.", "household-stock", "practical-money"),
    practice: v("처음부터 비싼 장비를 다 갖추는 것보다 직접 써보고 고른 물건에 애착이 갑니다. 자주 손이 가는 것이 무엇인지 알면 소비도 꽤 분명해집니다. 즐길 돈과 오래 쓸 물건의 값을 구분할 현실적인 눈도 있습니다.", "equipment-use", "practical-money"),
    privacy: v("취향에 맞는 것을 들여놓는 즐거움과 오래 지킬 생활비를 같이 생각합니다. 좋아 보이는 제안도 계속 감당할 크기인지 보면 선택이 달라집니다. 크게 보이는 순간보다 오래 내 것으로 남는 쪽에 마음이 놓입니다.", "affordable-continuity", "practical-money"),
  },
  "ten_god_pian_cai/money": {
    capacity: v("필요한 사람이 보이면 얼마에 어떻게 내놓을지까지 생각이 이어집니다. 돈 이야기가 갑자기 현실적으로 되는 순간에도 본인에게는 자연스러운 연결입니다. 기회를 알아보는 눈이 좋지만 재미있는 제안마다 시간을 내주면 내 몫을 챙길 틈이 좁아집니다.", "price-an-opportunity", "opportunity-money"),
  },
  "ten_god_pian_yin/relationships": {
    inquiry: v("사소한 잡담이 길어지는 자리보다 서로 궁금한 것을 꺼낼 수 있는 만남이 좋습니다. 취향을 일일이 설명하지 않아도 통하는 친구에게는 연락을 쉬었어도 금방 말이 이어집니다. 자주 나타나는 사람보다 오래 이야기할 수 있는 사람으로 남는 편입니다.", "return-to-shared-topic", "selective-closeness"),
    natal: v("모두와 빠르게 친해져야 한다는 생각은 별로 편하지 않습니다. 내가 재미있어하는 것을 이상하게 보지 않는 사람을 만나면 말이 풀립니다. 오래 못 봤어도 서로의 관심사를 기억하는 사이에서 마음을 덜 꾸미게 됩니다.", "accepted-interest", "selective-closeness"),
  },
  "ten_god_zheng_guan/relationships": {
    challenge: v("친구니까 괜찮다는 말에도 안 괜찮은 선은 있습니다. 서로 정한 약속을 바꿀 때 한마디 알려주는 정도를 바라는 겁니다. 평소엔 농담을 잘 받아도 나를 가볍게 여기는 태도 앞에서는 말이 단단해집니다.", "friendship-boundary", "mutual-respect"),
    steady: v("작은 약속을 반복해서 지킨 사람을 오래 믿습니다. 가까워졌다는 이유로 수고를 당연하게 여기면 겉으로 따지기 전에 마음속 거리가 먼저 벌어집니다. 반대로 성의를 알아주는 사람에게는 한결같은 내 편이 됩니다.", "recognize-small-promises", "mutual-respect"),
  },
  "ten_god_zheng_yin/relationships": {
    privacy: v("누군가 편하게 쉬었다 갔다는 말이 기억에 남습니다. 예전에 나를 안심시킨 한마디를 떠올려 비슷하게 건네기도 합니다. 내 도움을 크게 드러내기보다 상대가 다음에 또 와도 괜찮다고 느끼는 관계가 좋습니다.", "offer-a-resting-place", "remembered-kindness"),
  },
  "sinsal_hyeonchim/love": {
    capacity: v("바빠도 상대가 평소와 다르게 대답한 건 기억합니다. 일은 일이고 마음은 마음이라고 구분하고 싶어도 짧은 한마디가 뒤늦게 걸립니다. 알아차리는 능력이 빨라서 사랑할 때의 세심함과 서운함도 함께 빨라지는 쪽입니다.", "busy-but-remembers", "sensitive-affection"),
    meaning: v("대화가 좋았는지 돌아볼 때 내용뿐 아니라 말 사이의 망설임도 떠오릅니다. 내 말에 잠깐 웃었던 표정이 생각보다 오래 기분을 좋게 만듭니다. 관심이 붙으면 작은 호응 하나가 다음 이야기를 꺼낼 용기가 됩니다.", "remember-a-smile", "sensitive-affection"),
    care: v("같이 지내는 사람이 평소보다 조용하면 먼저 눈치챕니다. 무슨 일이 있었는지 캐묻기보다 좋아하는 것을 슬쩍 챙겨두는 쪽이 자연스럽습니다. 다정함을 알아주면 좋은데 아무 반응이 없으면 나만 살피는 것 같아 서운해집니다.", "quiet-comfort", "sensitive-affection"),
    challenge: v("가볍게 보낸 말에도 상대 반응이 달라지면 바로 감이 옵니다. 장난으로 넘기려다 오히려 정확하게 짚는 질문이 튀어나오기도 합니다. 좋아하는 마음이 생길수록 눈치가 없어지는 게 아니라 신경 쓰는 단서가 많아집니다.", "joke-turned-question", "sensitive-affection"),
    practice: v("함께 있을 때 눈이 어디로 가는지, 어떤 이야기에 신나 하는지가 보입니다. 관심 없는 척해도 상대가 좋아한 장소는 기억해둡니다. 당신의 호감은 긴 설명보다 다음에 같이 해볼 일을 고르는 눈썰미에 묻어납니다.", "remember-a-place", "sensitive-affection"),
    steady: v("늘 하던 인사나 약속이 달라지면 이유부터 궁금해집니다. 괜찮다고 넘기고도 오늘 무엇이 달랐는지 혼자 맞춰볼 때가 있습니다. 익숙한 만큼 세밀하게 아는 눈은 상대의 피로를 먼저 알아주는 배려가 되기도 합니다.", "changed-routine", "sensitive-affection"),
    natal: v("좋아하는 사람이 흘린 사소한 말을 쉽게 잊지 않습니다. 무심하게 건넨 취향을 기억했다가 알맞은 순간에 꺼내면 상대는 의외로 크게 반가워합니다. 다만 서운한 말까지 또렷하게 남는 날에는 혼자 오래 되짚기도 합니다.", "remember-a-small-wish", "sensitive-affection"),
  },
  "ten_god_qi_sha/love": {
    capacity: v("상대가 곤란하다는 이야기를 하면 내 할 일이 하나 생긴 기분입니다. 든든한 편이 되어주고 싶어 실제로 움직입니다. 본인은 애정을 행동으로 크게 보여줬는데 상대는 오늘의 마음부터 물어봐 주길 바라는 엇갈림도 있습니다.", "take-on-a-loved-problem", "protective-affection"),
  },
  "twelve_sinsal_hwagae/love": {
    steady: v("함께 보낸 시간이 즐거웠어도 잠깐 말없이 쉬고 싶을 때가 있습니다. 상대에게 싫증 난 게 아니라 오늘 쓴 마음을 가라앉히는 시간입니다. 같은 방에서 서로 다른 것을 해도 어색하지 않은 관계라면 애정을 매번 증명할 필요가 줄어듭니다.", "parallel-quiet", "independent-intimacy"),
    privacy: v("둘의 계획을 세워도 내 취향을 혼자 즐길 자리는 남겨두고 싶습니다. 가까운 사람이 그 시간을 존중하면 돌아와 나눌 이야기는 오히려 많아집니다. 붙어 있는 시간과 마음의 깊이가 꼭 비례하지 않는다는 걸 아는 사랑입니다.", "return-from-own-world", "independent-intimacy"),
  },
  "sinsal_dohwa/love": {
    care: v("크게 나서지 않아도 편안한 표정에 눈이 머뭅니다. 처음 이야기를 나누는 사람이 말을 조금 더 붙여보고 싶게 하는 부드러운 인상이 있습니다. 가까운 사람을 챙길 때 자연스럽게 나오는 웃음도 당신을 보기 좋게 만듭니다.", "welcoming-first-look", "visible-charm"),
    practice: v("좋아하는 것을 할 때 표정이 살아나는 모습이 눈에 들어옵니다. 잘 보이려고 꾸민 한마디보다 신나서 웃는 순간에 분위기가 밝아집니다. 만남의 시작에서 시선을 끄는 매력은 이렇게 움직이는 모습에도 있습니다.", "animated-first-look", "visible-charm"),
    privacy: v("여럿 사이에서 오래 말하지 않아도 분위기로 기억되는 편입니다. 편하게 웃거나 좋아하는 것을 고르는 짧은 순간이 인상에 남습니다. 내 세계를 모두 설명하기 전에 상대가 먼저 궁금해할 만한 첫인상의 힘이 있습니다.", "quiet-first-look", "visible-charm"),
  },
  "sinsal_hongyeom/love": {
    inquiry: v("첫 만남에서는 담백했는데 이야기가 맞으면 예상 밖의 장난기가 나옵니다. 내가 잘 아는 것을 신나게 설명하는 얼굴도 가까이서 보는 사람에게는 매력입니다. 알아갈수록 처음보다 다정하고 재미있는 면을 발견하게 하는 온기가 있습니다.", "private-playfulness", "intimate-charm"),
  },
  "sinsal_gwimun/study": {
    connect: v("같은 작품을 보고도 남들이 말하지 않은 장면이 기억에 남습니다. 왜 그 부분이 이상하게 좋았는지 다른 작품과 나란히 놓아보는 재미가 있습니다. 답을 많이 모으는 시간보다 자기만의 취향이 또렷해지는 시간입니다.", "compare-art-details", "taste-discovery"),
    meaning: v("글을 읽다가 납득되지 않는 인물의 선택에서 멈춥니다. 줄거리를 다시 외우는 대신 그 앞에서 놓친 마음을 찾아봅니다. 결과보다 그 과정의 이유에 눈이 가서 같은 이야기도 여러 층으로 읽는 편입니다.", "character-motivation", "interpretation-depth"),
    challenge: v("모두 동의한 설명에서 예외 하나를 떠올리면 흥미가 붙습니다. 반박하려고 시작했다가 오히려 원래 생각을 바꾸기도 합니다. 틀렸다는 걸 알아내는 재미만큼 더 정확해졌다는 기분도 큰 사람입니다.", "test-an-exception", "critical-inquiry"),
    privacy: v("하나의 문장보다 두 문장 사이에 생략된 이야기를 궁금해합니다. 혼자 읽는 동안 다른 결말을 상상해보기도 합니다. 읽은 양을 자랑하지 않아도 자기 안에 남은 질문은 오래 쓰는 생각거리가 됩니다.", "read-between-lines", "interpretation-depth"),
  },
  "ten_god_pian_yin/study": {
    inquiry: v("꼭 일에 쓰지 않아도 좋아하는 분야의 낯선 설명을 만나는 재미가 있습니다. 익숙한 원리로 안 풀리는 작은 퍼즐 앞에서는 승부욕도 조용히 살아납니다. 아무도 점수를 주지 않는 관심이어서 실패해도 다시 만져볼 여유가 있습니다.", "private-puzzle", "curiosity-play"),
    natal: v("새 취미를 배우다가 남들과 다른 방법을 시험해보는 시간이 좋습니다. 잘하는 모습을 빨리 보여주기보다 내 손에 맞는 요령을 찾는 쪽입니다. 당장 직업이 되지 않아도 좋아서 익힌 감각은 내 생활을 넓혀줍니다.", "try-a-personal-method", "curiosity-play"),
  },
  "ten_god_zheng_yin/study": {
    care: v("처음엔 어렵던 것이 손에 익는 순간을 좋아합니다. 책에서 본 요령을 취미나 생활에 써봤다가 정말 편해지면 기분이 좋습니다. 배운 내용을 전부 설명하지 않아도 어제보다 수월해진 오늘이 실력을 보여줍니다.", "learning-made-easy", "learning-in-life"),
    practice: v("한 번 잘된 경험이 우연인지 다시 해보며 확인합니다. 몸이 기억한 감각에 이유까지 붙으면 남의 설명을 들을 때도 흡수가 빨라집니다. 먼저 움직이는 성격과 제대로 배우고 싶은 마음이 번갈아 실력을 밀어줍니다.", "repeat-successful-trial", "learning-through-action"),
    steady: v("헷갈렸던 내용을 다시 만났을 때 막힘없이 이해되면 은근히 뿌듯합니다. 새로 외우는 양보다 이미 배운 것을 정확하게 꺼내 쓰는 데서 자신감이 붙습니다. 시간을 들인 공부가 쉽게 흩어지지 않는 쪽입니다.", "retrieve-old-learning", "durable-learning"),
  },
  "twelve_sinsal_hwagae/private-world": {
    connect: v("사람들 사이에서 많이 웃고 온 날에도 내 취향만 고를 시간이 필요합니다. 아무에게도 보여주지 않을 사진을 정리하거나 음악 순서를 바꾸며 기분을 가라앉힙니다. 남에게 설명하지 않아도 충분히 즐거운 작은 세계가 있습니다.", "curate-for-myself", "private-recovery"),
    notice: v("하루 종일 반응을 살핀 뒤에는 누구 표정도 읽지 않아도 되는 시간이 편합니다. 좋아하는 소리를 틀어두고 손으로 작은 것을 만지다 보면 말이 줄어도 답답하지 않습니다. 조용한 취향이 나를 되찾는 자리가 됩니다.", "sensory-solitude", "private-recovery"),
    inquiry: v("혼자 있는 저녁에는 설명할 의무가 사라져서 좋습니다. 틀어놓은 음악에 집중하거나 별 쓸모 없는 취향에 시간을 써도 됩니다. 늘 답을 내야 했던 머리가 자기 재미를 찾는 시간입니다.", "no-need-to-explain", "private-recovery"),
    challenge: v("토론이 즐거웠던 날에도 내 결론을 혼자 정리하는 순간은 따로 있습니다. 상대를 설득할 말을 찾는 대신 지금 내 마음에 남은 것만 골라봅니다. 말이 적어지는 시간이 생각의 주인을 다시 나로 돌려놓습니다.", "after-the-debate", "private-recovery"),
    practice: v("밖에서 실컷 움직인 뒤 혼자 좋아하는 것을 반복하는 시간도 필요합니다. 늘 새 자극을 찾는 사람처럼 보여도 아무 방해 없이 익숙한 취미에 빠지는 날이 있습니다. 그 조용한 몰입이 다음 움직임의 숨을 돌려줍니다.", "quiet-after-activity", "private-recovery"),
    steady: v("모임이 끝나면 당장 다음 약속을 잡기보다 내 생활로 돌아오고 싶습니다. 익숙한 책이나 음악을 고르며 오늘의 긴장을 내려놓습니다. 조용히 쉬었다가 다시 사람을 만날 때 표정에도 여유가 생깁니다.", "familiar-evening", "private-recovery"),
    privacy: v("사람에게 맞추지 않고 내 속도로 시간을 써보는 밤이 소중합니다. 말로 평가하지 않을 취향 하나를 오래 즐기는 것으로 충분합니다. 혼자 있어야만 들리는 내 마음의 작은 요구도 있습니다.", "unjudged-taste", "private-recovery"),
  },
  "sinsal_hyeonchim/private-world": {
    capacity: v("사소한 수선이나 정리도 손대면 끝의 작은 차이까지 보입니다. 남에게 보여줄 일이 아닌데도 반듯하게 맞춰졌을 때 혼자 만족합니다. 늘 성과를 내기 위한 솜씨만 있는 건 아닙니다.", "small-repair", "private-satisfaction"),
  },
  "ten_god_pian_yin/private-world": {
    natal: v("유행하는 취미보다 나만 재미있는 것에 마음이 갈 때가 있습니다. 실용적인 이유를 붙이지 않아도 몰입할 거리가 있다는 건 꽤 든든합니다. 잠깐의 관심을 내 취향으로 키우는 시간은 남과 비교할 필요가 적습니다.", "unshared-hobby", "private-satisfaction"),
  },
  "sinsal_hyeonchim/shadow-second": {
    notice: v("마음에 걸린 걸 오래 참다가 정확하게 짚습니다. 상대는 갑자기 날카로워졌다고 느끼지만 본인은 이미 몇 번 넘긴 뒤입니다."),
  },
  "sinsal_gwimun/shadow-second": {
    privacy: v("말하지 않은 뜻을 너무 멀리 찾기도 합니다. 상대는 그냥 지나간 말인데 내 안에서는 벌써 다음 장면까지 이어집니다."),
  },
  "ten_god_zheng_yin/shadow-second": {
    practice: v("한 번 해보면 알 일을 시작 전에 전부 확인하려는 날도 있습니다. 몸은 나가고 싶은데 머리가 준비물을 더 찾습니다."),
  },
  "ten_god_zheng_guan/shadow-second": {
    steady: v("내 실수에는 유난히 점수가 짭니다. 다른 사람은 넘어갔는데 혼자 퇴근 뒤까지 다시 채점합니다."),
  },
};
