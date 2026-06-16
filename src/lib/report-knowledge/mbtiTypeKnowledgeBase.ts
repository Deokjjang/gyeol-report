import { MBTI_TYPES } from "./mbtiKnowledgeTypes";
import type {
  MbtiKnowledgeContext,
  MbtiTraitSeed,
  MbtiTypeCode,
  MbtiTypeKnowledge,
} from "./mbtiKnowledgeTypes";

type TraitLine = {
  readonly label: string;
  readonly description: string;
  readonly scene: string;
  readonly strength: string;
  readonly risk: string;
  readonly switch: string;
  readonly tags: readonly string[];
};

type TypeProfile = Omit<MbtiTypeKnowledge, "traitSeeds"> & {
  readonly tone: MbtiTraitSeed["tone"];
  readonly contextSeeds: Record<MbtiKnowledgeContext, readonly TraitLine[]>;
};

const emptyLines = [] as const satisfies readonly TraitLine[];

function lines(
  first: TraitLine,
  second: TraitLine,
): readonly TraitLine[] {
  return [first, second];
}

function makeLine(input: TraitLine): TraitLine {
  return input;
}

function contextMap(
  contexts: Partial<Record<MbtiKnowledgeContext, readonly TraitLine[]>>,
): Record<MbtiKnowledgeContext, readonly TraitLine[]> {
  return {
    core_identity: contexts.core_identity ?? emptyLines,
    communication: contexts.communication ?? emptyLines,
    decision: contexts.decision ?? emptyLines,
    work: contexts.work ?? emptyLines,
    study: contexts.study ?? emptyLines,
    money: contexts.money ?? emptyLines,
    love: contexts.love ?? emptyLines,
    friendship: contexts.friendship ?? emptyLines,
    family: contexts.family ?? emptyLines,
    conflict: contexts.conflict ?? emptyLines,
    stress: contexts.stress ?? emptyLines,
    recovery: contexts.recovery ?? emptyLines,
    growth: contexts.growth ?? emptyLines,
    compatibility: contexts.compatibility ?? emptyLines,
  };
}

function createTraitSeeds(profile: TypeProfile): readonly MbtiTraitSeed[] {
  return Object.entries(profile.contextSeeds).flatMap(([context, entries]) =>
    entries.map((entry, index) => ({
      id: `mbti_${profile.type.toLowerCase()}_${context}_${index + 1}`,
      type: profile.type,
      context: context as MbtiKnowledgeContext,
      label: entry.label,
      description: entry.description,
      sceneSeeds: [entry.scene],
      strengths: [entry.strength],
      risks: [entry.risk],
      practicalSwitches: [entry.switch],
      tone: profile.tone,
      tags: [...new Set([...entry.tags, context, profile.type.toLowerCase()])],
    })),
  );
}

function profile(input: TypeProfile): MbtiTypeKnowledge {
  return {
    type: input.type,
    nickname: input.nickname,
    oneLine: input.oneLine,
    corePattern: input.corePattern,
    traitSeeds: createTraitSeeds(input),
    relationshipNeeds: input.relationshipNeeds,
    compatibleTraitConditions: input.compatibleTraitConditions,
    frictionTraitConditions: input.frictionTraitConditions,
    stressSignals: input.stressSignals,
    recoverySignals: input.recoverySignals,
  };
}

const ANALYTIC_SWITCH = "생각을 끝까지 닫아 두기보다, 막힌 지점과 다음 질문을 한 문장으로 밖에 꺼내세요.";
const ACTION_SWITCH = "바로 움직이기 전에 기준 하나와 멈출 조건 하나를 먼저 정하세요.";
const EMOTION_SWITCH = "감정의 결론을 빨리 내리기보다, 지금 느낀 것을 한 문장으로 확인하고 넘어가세요.";
const STRUCTURE_SWITCH = "규칙을 세울 때 예외 처리와 사람마다 다른 속도를 같이 남겨 두세요.";

const typeProfiles = [
  profile({
    type: "INTP",
    nickname: "원리 검증형",
    oneLine: "원리가 납득되어야 마음이 움직이고, 조건과 예외를 먼저 보는 타입입니다.",
    corePattern:
      "INTP는 감정보다 구조를 먼저 찾고, 질문하기 전 혼자 오래 검토하는 방식으로 안정감을 만듭니다.",
    relationshipNeeds: ["논리적 대화", "혼자 생각할 시간", "질문을 허용하는 관계"],
    compatibleTraitConditions: ["감정을 강요하지 않는 사람", "원리 설명을 기다릴 수 있는 사람", "생활 리듬을 존중하는 사람"],
    frictionTraitConditions: ["즉답을 압박하는 태도", "감정 확인을 추궁하는 방식", "근거 없는 반복 지시"],
    stressSignals: ["답장이 짧아짐", "자료를 더 찾느라 결정이 늦어짐", "감정 대화를 원인 분석으로 바꿈"],
    recoverySignals: ["조용한 자료 정리", "혼자 산책하며 생각 정리", "조건과 예외를 글로 쓰기"],
    tone: "direct",
    contextSeeds: contextMap({
      core_identity: lines(
        makeLine({
          label: "원리 우선",
          description: "원리가 납득되기 전까지 마음이 쉽게 움직이지 않습니다.",
          scene: "상대가 설명하는 동안 이미 원리상 어디가 안 맞는지 조용히 정리하는 장면이 자주 생깁니다.",
          strength: "복잡한 문제의 구조를 오래 붙잡고 파고듭니다.",
          risk: "설명하기 전에 내부 검토가 길어져 타이밍을 놓칠 수 있습니다.",
          switch: ANALYTIC_SWITCH,
          tags: ["analysis_to_action", "logic", "conditions"],
        }),
        makeLine({
          label: "늦은 질문",
          description: "질문하기 전에 혼자 자료를 찾아보고 한참 뒤에야 묻는 편입니다.",
          scene: "질문하기 전에 혼자 자료를 찾아보고 한참 뒤에야 짧게 묻는 장면이 생깁니다.",
          strength: "혼자 이해하는 힘이 강합니다.",
          risk: "도움받을 통로가 있어도 요청 신호가 늦어질 수 있습니다.",
          switch: "막힌 지점, 시도한 방법, 필요한 답을 세 줄로 적어 먼저 보내세요.",
          tags: ["support_request", "independence", "study"],
        }),
      ),
      communication: lines(
        makeLine({
          label: "짧은 답장 긴 검토",
          description: "답장은 짧아도 머릿속 검토는 길게 돌아갑니다.",
          scene: "카톡에서는 네, 알겠어라고 짧게 보내지만 안에서는 조건과 예외를 계속 비교합니다.",
          strength: "말을 아껴도 핵심 검토는 깊습니다.",
          risk: "상대는 무관심으로 오해할 수 있습니다.",
          switch: "짧게 답하더라도 지금 생각 중이라는 신호를 한 문장 덧붙이세요.",
          tags: ["communication", "relationship_boundary"],
        }),
        makeLine({
          label: "구조 설명",
          description: "감정 대화에서도 먼저 구조와 원인을 찾습니다.",
          scene: "상대가 감정 섞인 서운함을 말하면 위로보다 왜 그런 흐름이 생겼는지를 먼저 떠올립니다.",
          strength: "문제의 원인을 차분히 찾습니다.",
          risk: "공감보다 분석으로 들릴 수 있습니다.",
          switch: "원인을 말하기 전, 그랬구나 한 문장으로 감정을 먼저 받아 주세요.",
          tags: ["emotional_temperature", "communication"],
        }),
      ),
      decision: lines(
        makeLine({
          label: "조건과 예외",
          description: "결론보다 조건과 예외가 먼저 떠오릅니다.",
          scene: "다들 정답을 고를 때 혼자 그 선택이 틀릴 수 있는 조건을 먼저 봅니다.",
          strength: "리스크와 빈칸을 빨리 봅니다.",
          risk: "결정이 늦어지거나 반대처럼 보일 수 있습니다.",
          switch: "조건을 다 말하기보다 결정에 영향을 주는 예외 2개만 먼저 꺼내세요.",
          tags: ["decision", "precision", "analysis_to_action"],
        }),
        makeLine({
          label: "검증 후 실행",
          description: "실행보다 검증이 먼저입니다.",
          scene: "새로운 일을 시작하기 전 사용 후기, 자료, 반례를 확인해야 마음이 놓입니다.",
          strength: "허술한 선택을 줄입니다.",
          risk: "좋은 타이밍도 지나칠 수 있습니다.",
          switch: "조사 시간을 미리 정하고, 끝나면 작은 실행 하나로 넘어가세요.",
          tags: ["routine_recovery", "decision"],
        }),
      ),
      work: lines(
        makeLine({
          label: "원리형 업무",
          description: "일도 왜 그렇게 해야 하는지 이해되어야 집중이 붙습니다.",
          scene: "업무 지시를 받으면 바로 처리하기보다 목적과 규칙부터 머릿속에 세웁니다.",
          strength: "한번 이해하면 시스템처럼 재사용합니다.",
          risk: "목적이 흐리면 급격히 흥미가 식을 수 있습니다.",
          switch: "처리 전 목적, 기준, 결과물을 한 줄씩 적고 시작하세요.",
          tags: ["work", "structure_building"],
        }),
        makeLine({
          label: "조용한 개선",
          description: "표면보다 내부 구조를 고치는 쪽에 힘이 있습니다.",
          scene: "남들이 결과만 볼 때, 당신은 왜 같은 오류가 반복되는지 흐름도를 그립니다.",
          strength: "반복 오류를 줄이는 구조화가 강합니다.",
          risk: "고친 과정을 설명하지 않으면 기여가 잘 안 보일 수 있습니다.",
          switch: "개선 전후를 짧게 기록해 보이는 결과로 남기세요.",
          tags: ["work", "precision"],
        }),
      ),
      study: lines(
        makeLine({
          label: "목차 기반 공부",
          description: "처음부터 읽기보다 목차와 핵심 개념을 잡아야 편합니다.",
          scene: "전문서를 펼치면 본문보다 목차, 정의, 예시, 반례부터 훑습니다.",
          strength: "큰 구조를 잡으면 깊게 파고듭니다.",
          risk: "반복 암기만 남으면 에너지가 빨리 꺼집니다.",
          switch: "목차-핵심 개념-실전 적용 순서로 공부 루틴을 고정하세요.",
          tags: ["study", "analysis_to_action"],
        }),
        makeLine({
          label: "의미 있는 깊이",
          description: "흥미가 붙으면 깊게 들어가지만 의미 없는 반복에는 약합니다.",
          scene: "관심 주제는 밤늦게까지 파고들지만, 납득 안 되는 과제는 손이 늦습니다.",
          strength: "전문 주제를 깊게 축적합니다.",
          risk: "필요하지만 재미없는 기본기를 미룰 수 있습니다.",
          switch: "반복 과제에도 지금 써먹을 예시를 하나 붙여 의미를 만드세요.",
          tags: ["study", "routine_recovery"],
        }),
      ),
      money: lines(
        makeLine({
          label: "기록형 돈 관리",
          description: "돈도 감으로 쓰기보다 기록과 분류가 있어야 안정됩니다.",
          scene: "지출을 보면 금액보다 카테고리와 새는 구멍을 먼저 확인합니다.",
          strength: "조용히 쌓이는 관리 구조에 강합니다.",
          risk: "큰 방향보다 기록 자체에 매달릴 수 있습니다.",
          switch: "예산, 저축, 자기계발비를 분리하고 자동 규칙을 먼저 걸어 두세요.",
          tags: ["money_structure", "money"],
        }),
        makeLine({
          label: "자료형 투자 감각",
          description: "기회도 느낌보다 근거 자료가 있어야 움직입니다.",
          scene: "누가 좋다고 해도 숫자, 조건, 예외를 확인하기 전까지는 마음이 잘 안 움직입니다.",
          strength: "충동을 줄이고 검증합니다.",
          risk: "완벽한 근거를 기다리다 실행이 늦어질 수 있습니다.",
          switch: "기준표를 만든 뒤 작은 금액이나 작은 실험으로 검증하세요.",
          tags: ["money_structure", "decision"],
        }),
      ),
      love: lines(
        makeLine({
          label: "생각 후 표현",
          description: "감정 표현보다 생각 정리가 먼저 끝나야 말이 나옵니다.",
          scene: "마음은 있는데 바로 달콤한 말을 하기보다, 한참 뒤 정리된 문장으로 표현합니다.",
          strength: "말이 가볍지 않고 진심을 오래 봅니다.",
          risk: "상대는 식었다고 느낄 수 있습니다.",
          switch: "완벽한 표현을 기다리지 말고 고마움과 좋았던 점을 짧게 먼저 말하세요.",
          tags: ["love", "expression_training"],
        }),
        makeLine({
          label: "논리와 애정의 간격",
          description: "관계 문제도 원인을 찾으려는 힘이 먼저 켜집니다.",
          scene: "상대가 서운함을 말할 때 바로 해결 구조를 찾다가 따뜻함이 늦어질 수 있습니다.",
          strength: "관계를 고치려는 의지는 분명합니다.",
          risk: "상대는 평가받는 느낌을 받을 수 있습니다.",
          switch: "해결책 전에 상대의 감정을 한 문장으로 다시 말해 주세요.",
          tags: ["love", "emotional_temperature"],
        }),
      ),
      family: lines(
        makeLine({
          label: "조용한 거리",
          description: "가까운 사람에게도 혼자 생각할 공간이 필요합니다.",
          scene: "가족이 바로 답을 원할 때도 먼저 혼자 정리할 시간이 있어야 말이 나옵니다.",
          strength: "감정에 휩쓸리지 않고 차분히 봅니다.",
          risk: "거리감으로 오해받을 수 있습니다.",
          switch: "지금 바로 답보다 조금 정리하고 말하겠다는 시간을 먼저 알려 주세요.",
          tags: ["family", "relationship_boundary"],
        }),
        makeLine({
          label: "부탁의 조건화",
          description: "부탁도 조건과 범위가 분명해야 움직이기 쉽습니다.",
          scene: "도와 달라는 말보다 무엇을 언제까지 어느 정도 해야 하는지가 먼저 궁금합니다.",
          strength: "책임 범위를 분명히 잡습니다.",
          risk: "차갑거나 계산적으로 보일 수 있습니다.",
          switch: "도와줄 마음을 먼저 말하고, 범위는 그다음에 확인하세요.",
          tags: ["family", "relationship_boundary"],
        }),
      ),
      stress: lines(
        makeLine({
          label: "과검토 신호",
          description: "스트레스가 쌓이면 생각이 더 촘촘해져 멈추기 어려워집니다.",
          scene: "잠들기 전에도 낮에 본 말과 자료를 다시 조합하며 머리가 꺼지지 않습니다.",
          strength: "문제를 끝까지 놓치지 않습니다.",
          risk: "회복 신호를 늦게 알아차릴 수 있습니다.",
          switch: "밤에는 해결 대신 기록만 하고, 다음 검토 시간을 따로 잡으세요.",
          tags: ["stress", "routine_recovery"],
        }),
        makeLine({
          label: "고립된 분석",
          description: "불편할수록 더 혼자 이해하려는 쪽으로 갑니다.",
          scene: "도움을 요청하기보다 자료를 더 뒤지며 스스로 납득하려고 합니다.",
          strength: "자기 해결력이 있습니다.",
          risk: "도움 요청이 늦어질 수 있습니다.",
          switch: ANALYTIC_SWITCH,
          tags: ["stress", "support_request"],
        }),
      ),
      growth: lines(
        makeLine({
          label: "분석에서 행동으로",
          description: "성장은 더 많이 아는 것보다 작은 실행으로 넘어갈 때 빨라집니다.",
          scene: "정리한 노트가 쌓이는데 실제 적용은 미뤄지는 순간이 생길 수 있습니다.",
          strength: "개념을 정확히 잡습니다.",
          risk: "실험이 늦어집니다.",
          switch: "한 개념마다 바로 써먹을 예시 하나를 실행으로 붙이세요.",
          tags: ["growth", "analysis_to_action"],
        }),
        makeLine({
          label: "질문 훈련",
          description: "좋은 질문이 도움을 빨리 여는 열쇠가 됩니다.",
          scene: "혼자 오래 붙잡은 뒤 질문하면 상대가 바로 핵심을 짚어 주는 경험이 생깁니다.",
          strength: "질문이 정밀합니다.",
          risk: "너무 늦게 묻습니다.",
          switch: "질문하기 전 준비 시간을 제한하고, 70% 이해했을 때 묻는 연습을 하세요.",
          tags: ["growth", "support_request"],
        }),
      ),
      compatibility: lines(
        makeLine({
          label: "기다려 주는 상대",
          description: "감정을 몰아붙이기보다 생각 정리 시간을 주는 사람이 맞습니다.",
          scene: "대화 중 잠깐 멈춰도 재촉하지 않는 사람 앞에서 더 깊게 열립니다.",
          strength: "깊고 정직한 대화가 가능합니다.",
          risk: "즉흥적 감정 확인에는 닫힐 수 있습니다.",
          switch: "상대에게 생각 정리 시간이 필요하다는 리듬을 미리 알려 주세요.",
          tags: ["compatibility", "relationship_needs"],
        }),
        makeLine({
          label: "논리와 온도",
          description: "논리를 존중하면서도 감정 온도를 보태 주는 관계가 좋습니다.",
          scene: "맞고 틀림만 따지지 않고, 왜 그렇게 느꼈는지도 같이 봐 주는 사람에게 안정됩니다.",
          strength: "서로의 관점을 깊게 이해합니다.",
          risk: "감정만 밀어붙이면 피로해집니다.",
          switch: "논리 확인과 감정 확인을 같은 대화 안에 둘 다 넣으세요.",
          tags: ["compatibility", "emotional_temperature"],
        }),
      ),
    }),
  }),
  profile({
    type: "ENTJ",
    nickname: "판을 세우는 추진형",
    oneLine: "애매한 판을 오래 두기보다 역할, 기준, 마감부터 세우려는 타입입니다.",
    corePattern:
      "ENTJ는 목표와 구조를 빠르게 잡아 성과로 밀어붙이지만, 속도와 말의 온도 조절이 필요합니다.",
    relationshipNeeds: ["성장 의지", "분명한 약속", "느리지 않은 의사결정"],
    compatibleTraitConditions: ["목표를 함께 조율하는 사람", "피드백을 방어적으로만 듣지 않는 사람", "감정과 실행을 모두 다루는 사람"],
    frictionTraitConditions: ["계속 미루는 태도", "책임을 흐리는 방식", "감정만 말하고 다음 행동이 없는 대화"],
    stressSignals: ["쉬는 기준을 뒤로 미룸", "말이 지시처럼 짧아짐", "모든 문제를 본인이 정리하려 함"],
    recoverySignals: ["위임 기준 쓰기", "결론 전 질문하기", "수익 구조와 방어 규칙 분리"],
    tone: "sharp",
    contextSeeds: contextMap({
      core_identity: lines(
        makeLine({
          label: "구조화 본능",
          description: "애매한 상황을 보면 기준과 역할부터 나누고 싶어집니다.",
          scene: "팀플이나 업무에서 역할이 흐리면 담당자, 기준, 마감선이 먼저 보입니다.",
          strength: "판을 빠르게 정리합니다.",
          risk: "주변은 통제받는 느낌을 받을 수 있습니다.",
          switch: "기준을 세우기 전, 상대가 보는 핵심을 먼저 한 번 물어보세요.",
          tags: ["structure_building", "speed_control"],
        }),
        makeLine({
          label: "결론 속도",
          description: "기회와 문제를 보면 결론을 빨리 내고 싶어집니다.",
          scene: "사람들이 설명을 이어 갈 때 이미 다음 행동과 우선순위가 정리됩니다.",
          strength: "결정 속도가 빠릅니다.",
          risk: "상대의 감정 처리 속도를 앞질러 갈 수 있습니다.",
          switch: "결론을 말하기 전, 제가 이해한 핵심은 이것이라고 시작하세요.",
          tags: ["speed_control", "communication"],
        }),
      ),
      communication: lines(
        makeLine({
          label: "해결책 우선",
          description: "감정보다 해결책이 먼저 떠오르는 편입니다.",
          scene: "상대가 속상함을 말하는데 당신은 이미 어떻게 처리할지부터 생각합니다.",
          strength: "문제를 실제로 풀어냅니다.",
          risk: "위로보다 평가처럼 들릴 수 있습니다.",
          switch: "해결책 전에 그 말이 왜 힘들었는지 먼저 확인하세요.",
          tags: ["emotional_temperature", "communication"],
        }),
        makeLine({
          label: "직선형 말투",
          description: "말을 돌리기보다 핵심을 바로 말합니다.",
          scene: "카톡에서도 길게 풀기보다 해야 할 일과 결론을 짧게 적습니다.",
          strength: "오해 없이 빠르게 정리합니다.",
          risk: "가까운 관계에서는 차갑게 느껴질 수 있습니다.",
          switch: "핵심 문장 앞에 상대의 수고나 의도를 한 문장 붙이세요.",
          tags: ["communication", "direct_speech"],
        }),
      ),
      decision: lines(
        makeLine({
          label: "기회 포착",
          description: "기회가 보이면 빠르게 구조화하고 확장하려 합니다.",
          scene: "사업 아이디어를 들으면 가능성보다 실행 순서와 수익 모델을 먼저 봅니다.",
          strength: "기회를 결과로 바꾸는 힘이 있습니다.",
          risk: "방어 규칙 없이 확장할 수 있습니다.",
          switch: "확장 전에 수익 구조와 손실 제한선을 먼저 적으세요.",
          tags: ["decision", "money_structure"],
        }),
        makeLine({
          label: "느린 결정 스트레스",
          description: "느린 의사결정에 답답함을 크게 느낍니다.",
          scene: "회의나 팀플에서 결론 없이 말이 돌면 직접 정리하고 싶어집니다.",
          strength: "정체된 일을 움직입니다.",
          risk: "다른 사람의 검토 시간을 무시할 수 있습니다.",
          switch: "마감과 검토 시간을 같이 제안해 속도 차이를 줄이세요.",
          tags: ["decision", "speed_control"],
        }),
      ),
      work: lines(
        makeLine({
          label: "성과 구조",
          description: "일은 열심히보다 성과 구조로 보려 합니다.",
          scene: "업무를 받으면 누가 무엇을 언제까지 끝낼지 표로 나누고 싶어집니다.",
          strength: "팀의 생산성을 높입니다.",
          risk: "모든 일을 본인이 끌고 갈 수 있습니다.",
          switch: "담당자뿐 아니라 넘길 일과 맡지 않을 일을 같이 정하세요.",
          tags: ["work", "structure_building"],
        }),
        makeLine({
          label: "위임 기준",
          description: "목표가 커질수록 쉬는 기준과 위임 기준을 뒤로 밀 수 있습니다.",
          scene: "위임 기준 없이 남에게 맡기느니 직접 하는 게 빠르다고 느껴 밤까지 붙잡습니다.",
          strength: "책임감과 실행력이 큽니다.",
          risk: "번아웃으로 이어질 수 있습니다.",
          switch: "반복 업무, 판단 업무, 최종 확인 업무를 나누어 위임하세요.",
          tags: ["work", "routine_recovery"],
        }),
      ),
      study: lines(
        makeLine({
          label: "목적형 학습",
          description: "공부도 어디에 써먹을지가 보여야 붙습니다.",
          scene: "전문서를 읽을 때 목차보다 실제 적용 포인트와 성과 지표를 먼저 찾습니다.",
          strength: "학습을 바로 결과로 연결합니다.",
          risk: "기초 반복을 가볍게 볼 수 있습니다.",
          switch: "실전 적용 전에 기본 개념 확인 체크를 하나 넣으세요.",
          tags: ["study", "analysis_to_action"],
        }),
        makeLine({
          label: "자격 목표",
          description: "자격증이나 학습도 목표가 뚜렷하면 속도가 붙습니다.",
          scene: "합격 자체보다 그 자격을 어디에 배치할지 정해지면 집중이 살아납니다.",
          strength: "목표형 몰입이 강합니다.",
          risk: "당장 쓸모가 안 보이면 식을 수 있습니다.",
          switch: "자격증을 역할, 수익, 포트폴리오 중 어디에 쓸지 먼저 정하세요.",
          tags: ["study", "work"],
        }),
      ),
      money: lines(
        makeLine({
          label: "수익 모델",
          description: "돈은 흐름보다 구조와 수익 모델로 보려 합니다.",
          scene: "새 기회를 보면 단순 매출보다 수익 모델, 고객 기반, 방어 규칙을 먼저 떠올립니다.",
          strength: "돈이 남는 구조를 설계합니다.",
          risk: "확장 속도가 방어보다 빨라질 수 있습니다.",
          switch: "새 기회마다 수익 구조, 비용 구조, 손실 제한선을 같이 보세요.",
          tags: ["money", "money_structure"],
        }),
        makeLine({
          label: "자산화 감각",
          description: "일회성 성과보다 남는 자산을 만들고 싶어합니다.",
          scene: "프로젝트를 해도 자료, 고객, 시스템처럼 다음에 남는 것을 먼저 계산합니다.",
          strength: "성과를 축적합니다.",
          risk: "단기 관계와 감정 관리를 놓칠 수 있습니다.",
          switch: "성과 지표와 관계 지표를 함께 기록하세요.",
          tags: ["money", "structure_building"],
        }),
      ),
      love: lines(
        makeLine({
          label: "성장형 끌림",
          description: "관계에서도 성장 가능성과 태도를 봅니다.",
          scene: "호감이 있어도 약속을 계속 흐리거나 목표가 없는 사람에게는 금방 식을 수 있습니다.",
          strength: "관계를 현실적으로 봅니다.",
          risk: "상대를 평가표처럼 볼 수 있습니다.",
          switch: "조건보다 함께 있을 때 편안한 리듬도 같이 확인하세요.",
          tags: ["love", "relationship_boundary"],
        }),
        makeLine({
          label: "해결형 애정",
          description: "좋아할수록 문제를 빨리 해결해 주고 싶어집니다.",
          scene: "상대가 하소연하면 위로보다 바로 해결 루트를 제안합니다.",
          strength: "실제 도움을 줍니다.",
          risk: "감정을 건너뛴다는 말을 들을 수 있습니다.",
          switch: EMOTION_SWITCH,
          tags: ["love", "emotional_temperature"],
        }),
      ),
      family: lines(
        makeLine({
          label: "책임 배치",
          description: "가족 안에서도 역할과 책임을 분명히 하려 합니다.",
          scene: "누가 무엇을 맡는지 흐리면 자연스럽게 기준과 분담표를 만들고 싶어집니다.",
          strength: "흐린 일을 정리합니다.",
          risk: "가까운 사람에게 더 엄격해질 수 있습니다.",
          switch: "가족에게도 명령보다 합의 문장으로 역할을 나누세요.",
          tags: ["family", "relationship_boundary"],
        }),
        makeLine({
          label: "부탁과 해결",
          description: "부탁을 받으면 거절보다 해결이 먼저 나옵니다.",
          scene: "가족 부탁이 들어오면 쉬고 있어도 처리 루트를 먼저 생각합니다.",
          strength: "의지가 됩니다.",
          risk: "기대가 쌓여 책임이 과해질 수 있습니다.",
          switch: "가능한 도움과 불가능한 도움을 처음부터 나누세요.",
          tags: ["family", "support_request"],
        }),
      ),
      stress: lines(
        makeLine({
          label: "목표 과열",
          description: "목표가 커질수록 쉬는 기준을 뒤로 미룹니다.",
          scene: "조금만 더 하면 끝난다고 생각하며 회복 시간을 계속 줄입니다.",
          strength: "끝까지 밀어붙입니다.",
          risk: "회복이 밀리면 말투와 판단이 더 날카로워집니다.",
          switch: "일정표에 성과 시간과 회복 시간을 같은 무게로 넣으세요.",
          tags: ["stress", "routine_recovery"],
        }),
        makeLine({
          label: "통제 피로",
          description: "통제할 수 없는 변수가 많을수록 피로가 커집니다.",
          scene: "말이 바뀌는 사람이나 기준 없는 환경에서 에너지가 빨리 닳습니다.",
          strength: "불확실성을 줄이려 합니다.",
          risk: "모든 변수를 잡으려다 더 지칩니다.",
          switch: "내가 정할 기준과 받아들일 변수를 분리하세요.",
          tags: ["stress", "speed_control"],
        }),
      ),
      growth: lines(
        makeLine({
          label: "속도 조절",
          description: "성장은 더 빨리 가는 것보다 오래 쓰는 힘을 만드는 쪽입니다.",
          scene: "성과는 나오는데 몸과 관계의 신호가 늦게 따라오는 장면이 생길 수 있습니다.",
          strength: "큰 목표를 밀고 갑니다.",
          risk: "속도가 사람과 회복을 앞지를 수 있습니다.",
          switch: "성과 기준, 위임 기준, 멈춤 기준을 한 세트로 정하세요.",
          tags: ["growth", "speed_control"],
        }),
        makeLine({
          label: "질문형 리더십",
          description: "바로 지시하기보다 질문으로 여는 리더십이 필요합니다.",
          scene: "결론이 보여도 상대에게 먼저 핵심을 어떻게 보는지 묻는 순간 관계가 덜 날카로워집니다.",
          strength: "방향을 제시합니다.",
          risk: "질문 없이 말하면 압박으로 들릴 수 있습니다.",
          switch: "지적 전 질문 하나, 결론 전 확인 하나를 습관으로 두세요.",
          tags: ["growth", "emotional_temperature"],
        }),
      ),
      compatibility: lines(
        makeLine({
          label: "성장 동료",
          description: "같이 성장하되 감정 리듬도 놓치지 않는 사람이 맞습니다.",
          scene: "목표 이야기를 편하게 하면서도 쉬는 시간과 감정을 가볍게 넘기지 않는 사람에게 안정됩니다.",
          strength: "서로를 밀어 올립니다.",
          risk: "성과만 남으면 관계가 건조해집니다.",
          switch: "목표와 감정 점검을 같은 대화 안에 둘 다 넣으세요.",
          tags: ["compatibility", "growth_orientation"],
        }),
        makeLine({
          label: "느린 사람과의 마찰",
          description: "결정이 지나치게 느린 사람과는 피로가 커질 수 있습니다.",
          scene: "몇 번을 말해도 다음 행동이 정해지지 않으면 관계에서도 답답함이 올라옵니다.",
          strength: "정체를 뚫습니다.",
          risk: "상대 속도를 무시할 수 있습니다.",
          switch: "상대의 속도를 고치려 하기보다 마감과 선택지를 좁혀 주세요.",
          tags: ["compatibility", "friction"],
        }),
      ),
    }),
  }),
];

const compactTypeSpecs = [
  ["INTJ", "전략 설계형", "멀리 보고 구조를 설계하지만 감정 확인은 늦어질 수 있습니다.", "장기 방향, 기준, 독립성을 먼저 세우는 타입입니다."],
  ["ENTP", "가능성 전환형", "새 가능성을 빠르게 열지만 마무리 기준이 약해질 수 있습니다.", "질문, 실험, 전환으로 판을 흔드는 타입입니다."],
  ["INFJ", "의미 조율형", "사람의 흐름과 의미를 깊게 읽지만 혼자 과부하를 숨길 수 있습니다.", "관계의 숨은 결을 읽고 조용히 방향을 잡는 타입입니다."],
  ["INFP", "가치 공명형", "마음이 납득해야 오래 가고, 진정성 없는 규칙에는 에너지가 꺼집니다.", "가치와 진심을 기준으로 선택하는 타입입니다."],
  ["ENFJ", "관계 설계형", "사람을 움직이는 온도는 좋지만 타인의 기대를 많이 떠안을 수 있습니다.", "관계의 분위기와 성장 방향을 함께 잡는 타입입니다."],
  ["ENFP", "가능성 확장형", "새 연결과 아이디어에 강하지만 반복 관리가 약해질 수 있습니다.", "가능성과 사람의 반응에서 에너지가 붙는 타입입니다."],
  ["ISTJ", "기준 보존형", "검증된 기준과 책임에는 강하지만 변화 속도에는 피로를 느낄 수 있습니다.", "신뢰, 절차, 책임을 오래 지키는 타입입니다."],
  ["ISFJ", "생활 보호형", "가까운 사람을 세심하게 챙기지만 자기 필요는 늦게 말할 수 있습니다.", "생활의 안정과 관계의 세부를 지키는 타입입니다."],
  ["ESTJ", "현실 운영형", "현실 기준과 성과에 강하지만 감정의 우회로를 답답해할 수 있습니다.", "일과 사람을 현실 기준으로 운영하는 타입입니다."],
  ["ESFJ", "관계 운영형", "분위기와 생활 질서를 잘 챙기지만 인정 욕구가 부담으로 바뀔 수 있습니다.", "사람과 생활의 리듬을 맞추는 타입입니다."],
  ["ISTP", "실전 분석형", "말보다 도구와 상황을 보며 바로 고치지만 감정 설명은 짧아질 수 있습니다.", "문제를 손에 잡히는 방식으로 해체하는 타입입니다."],
  ["ISFP", "감각 가치형", "부드럽게 반응하지만 마음의 기준이 어긋나면 조용히 멀어질 수 있습니다.", "현재의 감각과 내면 가치를 함께 보는 타입입니다."],
  ["ESTP", "현장 돌파형", "직접 부딪혀 판단하고 기회를 잡지만 장기 기록이 약해질 수 있습니다.", "현장 반응과 속도로 판을 읽는 타입입니다."],
  ["ESFP", "분위기 확장형", "사람의 반응과 즐거움에 강하지만 정리 루틴이 밀릴 수 있습니다.", "현재의 활기와 관계의 온도를 살리는 타입입니다."],
] as const satisfies readonly [MbtiTypeCode, string, string, string][];

function buildCompactProfile(
  type: MbtiTypeCode,
  nickname: string,
  oneLine: string,
  corePattern: string,
): MbtiTypeKnowledge {
  const isT = type.includes("T");
  const isF = type.includes("F");
  const isJ = type.endsWith("J");
  const isP = type.endsWith("P");
  const isE = type.startsWith("E");
  const isN = type.includes("N");
  const tone: MbtiTraitSeed["tone"] = isT && isE ? "sharp" : isF ? "soft" : "direct";
  const decisionWord = isT ? "근거와 논리" : "진정성과 관계 온도";
  const actionWord = isP ? "상황을 보며 조정" : "기준을 세워 진행";
  const energyWord = isE ? "사람과 현장 반응" : "혼자 정리하는 시간";
  const focusWord = isN ? "가능성과 의미" : "현실 경험과 세부";
  const contexts = [
    "core_identity",
    "communication",
    "decision",
    "work",
    "study",
    "money",
    "love",
    "family",
    "stress",
    "growth",
  ] as const satisfies readonly MbtiKnowledgeContext[];
  const contextSeeds = Object.fromEntries(
    contexts.map((context) => [
      context,
      lines(
        makeLine({
          label: `${nickname} ${context} 기준`,
          description: `${type}는 ${context}에서 ${decisionWord}를 바탕으로 ${actionWord}하려는 흐름이 있습니다.`,
          scene: `${context} 상황에서 ${energyWord}을 확인한 뒤 ${focusWord}를 기준으로 다음 행동을 고르는 장면이 생깁니다.`,
          strength: `${focusWord}를 놓치지 않고 자기 방식으로 정리합니다.`,
          risk: `${decisionWord}가 과해지면 상대 속도나 생활 리듬을 놓칠 수 있습니다.`,
          switch: isJ ? STRUCTURE_SWITCH : ACTION_SWITCH,
          tags: [context, isT ? "logic" : "emotional_temperature", isJ ? "structure_building" : "flexibility"],
        }),
        makeLine({
          label: `${nickname} ${context} 장면`,
          description: `${type}는 ${context}에서 겉으로 단순해 보여도 안에서는 기준과 반응을 빠르게 맞춥니다.`,
          scene: `${context}에서 말이 길어지면 ${type} 특유의 방식으로 핵심, 분위기, 다음 행동 중 하나를 먼저 잡습니다.`,
          strength: "상황을 자기 언어로 번역하는 힘이 있습니다.",
          risk: "그 번역이 밖으로 너무 늦거나 너무 빠르게 나가면 오해가 생길 수 있습니다.",
          switch: isF ? EMOTION_SWITCH : ANALYTIC_SWITCH,
          tags: [context, "communication", isP ? "analysis_to_action" : "routine_recovery"],
        }),
      ),
    ]),
  ) as Partial<Record<MbtiKnowledgeContext, readonly TraitLine[]>>;

  return profile({
    type,
    nickname,
    oneLine,
    corePattern,
    relationshipNeeds: [
      `${energyWord}을 존중하는 관계`,
      `${decisionWord}를 설명할 수 있는 대화`,
      `${actionWord}할 수 있는 생활 리듬`,
    ],
    compatibleTraitConditions: [
      "상대의 속도를 단정하지 않는 사람",
      "대화와 생활 리듬을 함께 맞추는 사람",
      "강점과 피로 신호를 동시에 봐 주는 사람",
    ],
    frictionTraitConditions: [
      "한 가지 방식만 강요하는 태도",
      "감정이나 논리 중 하나만 요구하는 대화",
      "약속과 생활 리듬이 계속 흔들리는 관계",
    ],
    stressSignals: [
      `${energyWord}이 막히면 반응이 짧아집니다.`,
      `${decisionWord}가 과해지면 대화가 딱딱해집니다.`,
      `${actionWord}할 기준이 없으면 피로가 커집니다.`,
    ],
    recoverySignals: [
      "하루를 정리하는 짧은 기록",
      "대화 전에 필요한 조건을 한 문장으로 쓰기",
      "생활 리듬을 흔들지 않는 작은 실행",
    ],
    tone,
    contextSeeds: contextMap(contextSeeds),
  });
}

export const MBTI_TYPE_KNOWLEDGE_BASE = [
  ...typeProfiles,
  ...compactTypeSpecs.map(([type, nickname, oneLine, corePattern]) =>
    buildCompactProfile(type, nickname, oneLine, corePattern),
  ),
] as const satisfies readonly MbtiTypeKnowledge[];

export const MBTI_TYPE_KNOWLEDGE_BY_TYPE = new Map(
  MBTI_TYPE_KNOWLEDGE_BASE.map((entry) => [entry.type, entry]),
);

export function requireMbtiTypeKnowledge(type: MbtiTypeCode): MbtiTypeKnowledge {
  const entry = MBTI_TYPE_KNOWLEDGE_BY_TYPE.get(type);

  if (entry === undefined) {
    throw new Error(`Unknown MBTI type: ${type}`);
  }

  return entry;
}

export function isMbtiTypeCode(value: string): value is MbtiTypeCode {
  return (MBTI_TYPES as readonly string[]).includes(value);
}
