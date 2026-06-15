import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type { SajuFeatureTopic } from "./sajuFeatureTypes";

export type SajuSignatureSceneRule = {
  readonly id: string;
  readonly requiredFeatureIds: readonly string[];
  readonly optionalFeatureIds?: readonly string[];
  readonly mbtiTypes?: readonly string[];
  readonly topics: readonly Extract<
    SajuFeatureTopic,
    "personality" | "work" | "money" | "love" | "relationship" | "family" | "growth"
  >[];
  readonly sceneLines?: readonly string[];
  readonly sceneLine: string;
  readonly interpretationLine: string;
  readonly practicalLine: string;
};

export type SajuSignatureScene = {
  readonly id: string;
  readonly title: string;
  readonly featureIds: readonly string[];
  readonly featureLabels: readonly string[];
  readonly topics: SajuSignatureSceneRule["topics"];
  readonly sceneLines?: readonly string[];
  readonly sceneLine: string;
  readonly interpretationLine: string;
  readonly practicalLine: string;
};

export const SAJU_SIGNATURE_SCENE_RULES = [
  {
    id: "hyeonchim_entj_fast_conclusion",
    requiredFeatureIds: ["sinsal_hyeonchim"],
    mbtiTypes: ["ENTJ"],
    topics: ["personality", "work", "relationship"],
    sceneLines: [
      "회의에서 상대가 설명을 끝내기 전에 이미 담당자와 마감만 정하면 끝나는 문제라고 결론이 보일 수 있습니다.",
      "카톡에서 상대는 감정을 풀고 있는데, 사용자님은 속으로 그래서 다음 행동은 무엇인지가 먼저 떠오를 수 있습니다.",
      "팀원이 애매하게 말하면 사용자님은 감정보다 담당자, 기준표, 마감선을 먼저 떠올릴 수 있습니다.",
    ],
    sceneLine:
      "회의에서 상대가 설명을 끝내기 전에 이미 오류와 결론이 보일 수 있습니다.",
    interpretationLine:
      "현침살의 예리함과 ENTJ의 빠른 결론 성향이 겹치면 판단 속도는 강해지지만, 말이 평가처럼 들릴 수 있습니다.",
    practicalLine:
      "바로 지적하기보다 “제가 이해한 핵심은 이겁니다”로 시작하면 같은 말도 덜 날카롭게 전달됩니다.",
  },
  {
    id: "gapsin_qi_sha_pressure_leadership",
    requiredFeatureIds: ["day_pillar_gapsin", "ten_god_qi_sha"],
    topics: ["personality", "work", "growth"],
    sceneLine:
      "압박이 걸리는 자리에서 오히려 기준을 빨리 세우고 판을 정리하려는 모습이 나올 수 있습니다.",
    interpretationLine:
      "갑신일주의 방향성과 편관의 긴장감이 만나면 위기 대응력은 살아나지만, 스스로를 몰아붙이는 압력도 커집니다.",
    practicalLine:
      "책임을 잡을 때는 성과 기준과 쉬는 기준을 같이 정해야 오래 갑니다.",
  },
  {
    id: "gapsin_zheng_guan_role_standard",
    requiredFeatureIds: ["day_pillar_gapsin", "ten_god_zheng_guan"],
    topics: ["personality", "work", "relationship"],
    sceneLine:
      "역할이 흐리면 답답해지고, 누가 무엇을 맡을지 먼저 정리하고 싶어질 수 있습니다.",
    interpretationLine:
      "갑신일주의 절단력과 정관의 규칙성이 겹치면 역할과 기준을 세우는 힘이 강해집니다.",
    practicalLine:
      "관계에서도 지적보다 역할 합의와 약속 확인을 먼저 꺼내는 편이 좋습니다.",
  },
  {
    id: "jaego_wealth_storage",
    requiredFeatureIds: ["gwiin_jaego", "ten_god_pian_cai", "ten_god_zheng_cai"],
    topics: ["work", "money", "growth"],
    sceneLines: [
      "돈이 들어오면 쓰고 싶은 마음보다 먼저 이걸 어디에 묶어둘지가 떠오를 수 있습니다.",
      "사업 아이디어를 볼 때도 단순 매출보다 고객 기반, 데이터, 반복 수익처럼 남는 구조를 먼저 보게 됩니다.",
      "계좌가 섞이면 불편하고, 생활비, 투자금, 비상금을 목적별로 나누어야 마음이 놓이는 쪽에 가깝습니다.",
    ],
    sceneLine:
      "돈을 벌 방법은 빨리 보이지만, 계좌와 기록의 자리가 없으면 생각보다 쉽게 새어 나갈 수 있습니다.",
    interpretationLine:
      "재고귀인은 자원을 담는 창고이고, 편재와 정재는 버는 감각과 지키는 감각을 함께 자극합니다.",
    practicalLine:
      "계좌 분리, 자동저축, 자산 기록처럼 돈의 위치를 정해 두면 이 기운이 더 실용적으로 살아납니다.",
  },
  {
    id: "cheoneul_no_resource_late_request",
    requiredFeatureIds: ["gwiin_cheoneul", "structure_no_resource"],
    topics: ["relationship", "work", "growth"],
    sceneLines: [
      "도움받을 통로는 있는데, 정작 사용자님은 한참 혼자 정리한 뒤에야 요청할 수 있습니다.",
      "막힌 일을 혼자 끌고 가다가 뒤늦게 사람에게 물어보면 생각보다 빨리 풀리는 장면이 생길 수 있습니다.",
      "필요한 도움을 말로 꺼내기 전까지는 주변에서 사용자님이 어디서 막혔는지 모를 수 있습니다.",
    ],
    sceneLine:
      "도움받을 통로는 있는데, 정작 한참 혼자 정리한 뒤에야 요청할 수 있습니다.",
    interpretationLine:
      "천을귀인은 도움의 별이지만 무인성은 기대고 요청하는 감각을 늦게 만들 수 있습니다.",
    practicalLine:
      "막힌 순간에 필요한 도움을 한 문장으로 적어 보내는 습관이 귀인을 더 빨리 열어 줍니다.",
  },
  {
    id: "hongyeom_fire_missing_no_output_expression",
    requiredFeatureIds: ["sinsal_hongyeom", "element_fire_missing", "structure_no_output"],
    topics: ["love", "relationship", "growth"],
    sceneLines: [
      "호감은 있는데 말투가 건조해서 상대가 업무 보고처럼 느낄 수 있습니다.",
      "연애 대화에서 마음은 이미 움직였는데, 칭찬이나 반응은 한 박자 늦게 나올 수 있습니다.",
      "상대가 따뜻한 말을 기다릴 때 사용자님은 위로보다 해결책을 먼저 고르는 장면이 생길 수 있습니다.",
    ],
    sceneLine:
      "호감이 있어도 말투가 건조하게 나가거나, 따뜻한 반응이 늦게 도착할 수 있습니다.",
    interpretationLine:
      "홍염살의 매력 신호가 있어도 화 부족과 무식상이 겹치면 표현 통로가 좁아져 체감 온도가 낮아질 수 있습니다.",
    practicalLine:
      "짧은 칭찬, 고마움 한 문장, 먼저 묻는 질문을 작게라도 밖으로 내는 연습이 필요합니다.",
  },
  {
    id: "wonjin_water_missing_relation_friction",
    requiredFeatureIds: ["sinsal_wonjin", "element_water_missing"],
    topics: ["love", "relationship", "family", "growth"],
    sceneLines: [
      "가까운 사람일수록 사소한 말투나 연락 간격이 더 크게 거슬릴 수 있습니다.",
      "연인은 서운함을 말하는데, 사용자님은 왜 그게 문제인지부터 따지고 싶어질 수 있습니다.",
      "가족 부탁도 반복되면 마음으로는 도와주고 싶어도 피로가 먼저 올라오는 장면이 생길 수 있습니다.",
    ],
    sceneLine:
      "가까운 사람일수록 사소한 말투나 연락 간격이 더 크게 거슬릴 수 있습니다.",
    interpretationLine:
      "원진살의 관계 마찰 신호와 수 부족의 감정 완충 부족이 만나면 작은 어긋남이 오래 남기 쉽습니다.",
    practicalLine:
      "서운함을 쌓아 두기보다 연락 간격, 약속 방식, 감정 표현선을 미리 맞추는 편이 좋습니다.",
  },
  {
    id: "jangseong_qi_sha_responsible_center",
    requiredFeatureIds: ["twelve_sinsal_jangseong", "ten_god_qi_sha"],
    topics: ["work", "relationship", "growth"],
    sceneLines: [
      "사람들이 흩어질 때 자연스럽게 앞에 서서 책임과 방향을 묶으려 할 수 있습니다.",
      "팀의 기준이 흐리면 누가 시키기 전에도 역할표와 판단선을 만들고 싶어질 수 있습니다.",
      "위기 상황에서는 분위기를 달래기보다 누가 무엇을 맡고 언제 끝낼지부터 정리하는 쪽이 편합니다.",
    ],
    sceneLine:
      "사람들이 흩어질 때 자연스럽게 앞에 서서 책임과 방향을 잡으려 할 수 있습니다.",
    interpretationLine:
      "장성살의 중심성에 편관의 긴장감이 붙으면 책임 있는 자리에서 존재감이 더 선명해집니다.",
    practicalLine:
      "다만 모든 일을 혼자 끌어안기보다 담당 범위를 나누는 기준이 필요합니다.",
  },
  {
    id: "jangseong_zheng_guan_role_clarity",
    requiredFeatureIds: ["twelve_sinsal_jangseong", "ten_god_zheng_guan"],
    topics: ["work", "relationship", "growth"],
    sceneLines: [
      "모두의 역할이 흐릴수록 중심을 잡고 규칙을 세우는 쪽으로 움직이기 쉽습니다.",
      "이름이 걸린 일에서는 대충 넘어가기보다 기준을 세워 책임 있게 끝내려는 힘이 강해집니다.",
      "가족이나 팀 안에서도 역할, 약속, 마감이 분명해야 마음이 안정됩니다.",
    ],
    sceneLine:
      "팀의 역할이 흐릴수록 중심을 잡고 규칙을 세우는 쪽으로 움직이기 쉽습니다.",
    interpretationLine:
      "장성살의 중심성과 정관의 질서감이 만나면 이름이 걸린 자리, 기준이 필요한 자리에서 힘이 살아납니다.",
    practicalLine:
      "기준을 세운 뒤에는 사람마다 속도가 다르다는 점까지 함께 열어 두는 편이 좋습니다.",
  },
  {
    id: "water_missing_no_resource_private_burden",
    requiredFeatureIds: ["element_water_missing", "structure_no_resource"],
    topics: ["relationship", "family", "growth"],
    sceneLines: [
      "힘든 일이 있어도 바로 기대기보다 혼자 정리하고 버티는 시간이 길어질 수 있습니다.",
      "밤에 누웠는데도 머릿속에서 다음 일정과 해결할 문제가 계속 돌아갈 수 있습니다.",
      "감정이 힘든 날에도 누구에게 어디까지 말해야 할지 몰라 더 늦게 꺼내는 장면이 생길 수 있습니다.",
    ],
    sceneLine:
      "힘든 일이 있어도 바로 기대기보다 혼자 정리하고 버티는 시간이 길어질 수 있습니다.",
    interpretationLine:
      "수 부족은 감정 완충을 늦게 만들고, 무인성은 도움 요청의 감각을 늦게 켭니다.",
    practicalLine:
      "감정이 정리된 뒤가 아니라 막히는 순간에 필요한 도움을 짧게 말하는 연습이 필요합니다.",
  },
  {
    id: "fire_missing_no_output_delayed_warmth",
    requiredFeatureIds: ["element_fire_missing", "structure_no_output"],
    topics: ["love", "relationship", "growth"],
    sceneLine:
      "마음은 있는데 칭찬이나 반응이 늦어 상대가 차갑다고 느낄 수 있습니다.",
    interpretationLine:
      "화 부족과 무식상이 겹치면 따뜻함이 없는 것이 아니라 밖으로 내는 통로가 좁아질 수 있습니다.",
    practicalLine:
      "짧은 리액션과 고마움 표현을 습관처럼 먼저 내보내는 방식이 관계 온도를 올려 줍니다.",
  },
  {
    id: "earth_excess_jaeda_sinyak_overload",
    requiredFeatureIds: ["element_earth_excess", "structure_jaeda_sinyak"],
    topics: ["work", "money", "growth"],
    sceneLines: [
      "할 일과 벌 일이 계속 쌓이는데 쉬는 기준은 자꾸 뒤로 밀릴 수 있습니다.",
      "좋은 기회처럼 보여도 몸이 먼저 무거워지고 머릿속 체크리스트만 늘어나는 때가 있습니다.",
      "돈을 벌 방법은 빨리 보이지만 방어 규칙이 없으면 지출, 부탁, 책임까지 같이 커질 수 있습니다.",
    ],
    sceneLine:
      "할 일과 벌 일은 계속 늘어나는데, 쉬는 기준은 자꾸 뒤로 밀릴 수 있습니다.",
    interpretationLine:
      "토 과다의 무게감과 재다신약의 자원 압박이 겹치면 책임이 먼저 커지고 몸이 뒤따라가는 흐름이 생깁니다.",
    practicalLine:
      "맡을 일과 버릴 일을 나누고, 돈을 버는 규칙만큼 지키는 규칙을 같이 세워야 합니다.",
  },
  {
    id: "gwimun_hyeonchim_deep_analysis",
    requiredFeatureIds: ["sinsal_gwimun", "sinsal_hyeonchim"],
    topics: ["personality", "relationship", "growth"],
    sceneLines: [
      "남들이 그냥 넘긴 말의 뉘앙스나 작은 오류를 오래 붙잡고 분석할 수 있습니다.",
      "전문서를 읽을 때도 문장보다 먼저 허점, 기준, 적용 조건이 보일 수 있습니다.",
      "관계에서도 상대의 말 뒤에 숨은 의도를 너무 빨리 읽어 혼자 피곤해질 수 있습니다.",
    ],
    sceneLine:
      "남들이 넘긴 말의 뉘앙스나 작은 오류를 오래 붙잡고 분석할 수 있습니다.",
    interpretationLine:
      "귀문관살의 깊은 감각과 현침살의 예리함이 만나면 통찰은 강해지지만, 머리가 쉬지 못하는 흐름도 생깁니다.",
    practicalLine:
      "분석한 내용을 바로 평가로 던지기보다 기록과 질문으로 한 번 걸러 내면 강점이 됩니다.",
  },
  {
    id: "gongmang_water_missing_restless_gap",
    requiredFeatureIds: ["sinsal_gongmang", "element_water_missing"],
    topics: ["personality", "growth"],
    sceneLines: [
      "쉬고 있어도 머릿속 빈칸이 계속 떠올라 다음 일정과 문제를 굴릴 수 있습니다.",
      "계획이 중간에 비면 몸은 멈췄는데 생각만 더 바빠지는 장면이 생길 수 있습니다.",
      "밤 산책이나 기록이 없으면 머릿속에서 같은 문제를 여러 번 다시 열어볼 수 있습니다.",
    ],
    sceneLine:
      "쉬고 있어도 머릿속 빈칸이 계속 떠올라 다음 일정과 문제를 굴릴 수 있습니다.",
    interpretationLine:
      "공망의 빈자리 감각과 수 부족의 냉각 부족이 겹치면 멈춰도 완전히 쉬지 못하는 식으로 나타날 수 있습니다.",
    practicalLine:
      "밤에는 기록으로 생각을 내려놓고, 산책이나 수면 루틴처럼 식히는 장치를 먼저 잡아야 합니다.",
  },
] as const satisfies readonly SajuSignatureSceneRule[];

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getRuleFeatureIds(rule: SajuSignatureSceneRule): readonly string[] {
  return uniqueValues([
    ...rule.requiredFeatureIds,
    ...(rule.optionalFeatureIds ?? []),
  ]);
}

function ruleMatches(input: {
  readonly rule: SajuSignatureSceneRule;
  readonly featureIds: ReadonlySet<string>;
  readonly mbtiType?: string;
}): boolean {
  if (
    input.rule.mbtiTypes !== undefined &&
    (input.mbtiType === undefined || !input.rule.mbtiTypes.includes(input.mbtiType))
  ) {
    return false;
  }

  return input.rule.requiredFeatureIds.every((featureId) =>
    input.featureIds.has(featureId),
  );
}

function toScene(rule: SajuSignatureSceneRule): SajuSignatureScene {
  const featureIds = getRuleFeatureIds(rule);
  const featureLabels = featureIds.map(
    (featureId) => requireSajuFeatureEntry(featureId).labelKo,
  );
  const sceneLines = uniqueValues([
    ...(rule.sceneLines ?? []),
    rule.sceneLine,
  ]);
  const title = uniqueValues([
    ...featureLabels,
    ...(rule.mbtiTypes ?? []),
  ]).join(" + ");

  return {
    id: rule.id,
    title,
    featureIds,
    featureLabels,
    topics: rule.topics,
    sceneLines,
    sceneLine: sceneLines[0] ?? rule.sceneLine,
    interpretationLine: rule.interpretationLine,
    practicalLine: rule.practicalLine,
  };
}

export function selectSajuSignatureScenes(input: {
  readonly featureIds: readonly string[];
  readonly mbtiType?: string;
  readonly limit?: number;
}): readonly SajuSignatureScene[] {
  const featureIdSet = new Set(input.featureIds);
  const limit = input.limit ?? 8;

  return SAJU_SIGNATURE_SCENE_RULES.filter((rule) =>
    ruleMatches({ rule, featureIds: featureIdSet, mbtiType: input.mbtiType }),
  )
    .map(toScene)
    .slice(0, limit);
}
