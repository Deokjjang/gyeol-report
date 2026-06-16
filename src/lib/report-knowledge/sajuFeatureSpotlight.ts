import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import {
  joinKoreanSentences,
  normalizeKoreanSentenceSpacing,
  removeRepeatedLeadingLabel,
} from "./koreanCopyUtils";
import { shouldShowFeatureInSpotlight } from "./sajuFeatureDisplayPolicy";

export type SajuFeatureSpotlightGroupId =
  | "good_fortune"
  | "talent"
  | "caution"
  | "balance";

export type SajuFeatureSpotlightItem = {
  readonly featureId: string;
  readonly labelKo: string;
  readonly badge: string;
  readonly shortMeaning: string;
  readonly vividLine: string;
  readonly practicalLine: string;
  readonly polarity: "positive" | "mixed" | "warning";
  readonly sourceChapterIds: readonly string[];
};

export type SajuFeatureSpotlightSection = {
  readonly title: string;
  readonly subtitle?: string;
  readonly groups: readonly {
    readonly groupId: SajuFeatureSpotlightGroupId;
    readonly title: string;
    readonly items: readonly SajuFeatureSpotlightItem[];
  }[];
};

const spotlightGroupTitles = {
  good_fortune: "좋게 쓰면 크게 살아나는 기운",
  talent: "타고난 재능과 강점",
  caution: "주의해서 다뤄야 하는 기운",
  balance: "부족해서 보완하면 좋은 기운",
} as const satisfies Record<SajuFeatureSpotlightGroupId, string>;

const spotlightFeatureGroups = {
  good_fortune: [
    "gwiin_cheoneul",
    "gwiin_jaego",
    "gwiin_amrok",
    "gwiin_munchang",
    "gwiin_geumyeorok",
    "gwiin_taeguk",
    "gwiin_bokseong",
  ],
  talent: [
    "twelve_sinsal_jangseong",
    "sinsal_hyeonchim",
    "day_pillar_gapsin",
    "ten_god_qi_sha",
    "ten_god_zheng_guan",
    "sinsal_cheonmunseong",
  ],
  caution: [
    "sinsal_wonjin",
    "sinsal_gongmang",
    "twelve_sinsal_mangsin",
    "twelve_sinsal_cheonsal",
    "structure_jaeda_sinyak",
    "sinsal_gwimun",
  ],
  balance: [
    "element_water_missing",
    "element_fire_missing",
    "structure_no_output",
    "structure_no_resource",
    "element_earth_excess",
  ],
} as const satisfies Record<SajuFeatureSpotlightGroupId, readonly string[]>;

type SpotlightCopy = {
  readonly badge: string;
  readonly shortMeaning: string;
  readonly vividLine: string;
  readonly practicalLine: string;
};

const spotlightCopyByFeatureId: Partial<Record<string, SpotlightCopy>> = {
  twelve_sinsal_jangseong: {
    badge: "중심을 잡는 장수의 별",
    shortMeaning: "흩어진 판에서 기준을 세우는 기운",
    vividLine:
      "장수의 별처럼 흩어진 판에서 중심을 잡는 힘입니다. 책임 있는 자리, 팀의 기준을 세우는 장면, 이름이 걸린 역할에서 더 선명하게 빛날 수 있습니다.",
    practicalLine:
      "팀, 프로젝트, 책임 있는 자리에서 기준과 역할을 먼저 정리할수록 살아납니다.",
  },
  gwiin_cheoneul: {
    badge: "막힌 길에 손을 내미는 귀인",
    shortMeaning: "중요한 순간에 도움과 기회가 붙는 기운",
    vividLine:
      "막힌 길에서 귀한 사람이 손을 내미는 기운입니다. 혼자만으로 끝나는 사주가 아니라 필요한 순간에 사람, 제도, 기회가 붙는 통로가 열릴 수 있습니다.",
    practicalLine:
      "도움을 기다리기보다 필요한 것을 정확히 요청할 때 이 기운이 더 빨리 살아납니다.",
  },
  gwiin_jaego: {
    badge: "돈과 자원을 담는 창고",
    shortMeaning: "수입과 자원을 저장하고 구조화하는 기운",
    vividLine:
      "돈과 자원을 담는 창고입니다. 벌고 흘려보내는 사람보다 묶고 남기는 구조를 만들 때 재물 감각이 살아납니다.",
    practicalLine:
      "계좌 분리, 자동저축, 자산 기록처럼 돈의 자리를 정해 두는 방식이 맞습니다.",
  },
  sinsal_hyeonchim: {
    badge: "바늘처럼 정확한 판단",
    shortMeaning: "오류와 핵심을 빠르게 짚는 기운",
    vividLine:
      "남들이 대충 넘기는 허점이 먼저 보이고, 말도 핵심을 바로 찌르는 식으로 나올 수 있습니다.",
    practicalLine:
      "대화, 과제, 업무 정리에는 강점이지만, 가까운 관계에서는 말의 온도를 한 번 조절해야 합니다.",
  },
  element_water_missing: {
    badge: "냉각수가 부족한 엔진",
    shortMeaning: "생각을 식히고 감정을 완충하는 장치가 필요한 구조",
    vividLine: "머리는 계속 돌아가는데, 멈추는 스위치가 늦게 켜질 수 있습니다.",
    practicalLine:
      "밤 산책, 수분, 기록, 잠 루틴처럼 식히는 장치를 일정에 넣어야 합니다.",
  },
  element_fire_missing: {
    badge: "온도를 밖으로 내는 연습",
    shortMeaning: "표현과 활력을 의식적으로 보태야 하는 구조",
    vividLine:
      "마음이 없는 것이 아니라, 따뜻한 말과 반응이 늦게 밖으로 나올 수 있습니다.",
    practicalLine:
      "짧은 칭찬, 가벼운 리액션, 먼저 건네는 한마디를 루틴처럼 잡아 두면 좋습니다.",
  },
  gwiin_amrok: {
    badge: "보이지 않는 자원 통로",
    shortMeaning: "겉으로 드러나지 않은 도움과 여지를 찾는 기운",
    vividLine:
      "겉으로 바로 보이지 않는 숨은 자원입니다. 막힌 듯 보여도 사람, 기록, 제도, 예전 인연 속에서 길이 다시 열릴 수 있습니다.",
    practicalLine:
      "한 번에 포기하기보다 사람, 제도, 기록 속의 숨은 자원을 확인할 때 힘이 살아납니다.",
  },
  gwiin_geumyeorok: {
    badge: "좋은 조건에서 빛나는 품격의 길신",
    shortMeaning: "생활 안정과 좋은 대우가 함께 갈 때 선명해지는 기운",
    vividLine:
      "단정하게 꾸민 수레가 안정된 길을 가는 이미지입니다. 품격, 생활 안정, 좋은 조건이 함께 갈 때 더 선명하게 살아납니다.",
    practicalLine:
      "일과 관계에서도 대우, 환경, 이미지 관리가 무너지지 않게 조건을 먼저 정리해야 합니다.",
  },
  sinsal_wonjin: {
    badge: "가까울수록 결이 거슬리는 신호",
    shortMeaning: "친밀한 관계에서 작은 어긋남이 크게 느껴지는 기운",
    vividLine:
      "멀리 있을 때는 괜찮다가 가까워질수록 말투와 생활 리듬이 예민하게 걸릴 수 있습니다.",
    practicalLine:
      "서운함을 쌓기 전에 연락 간격, 약속 방식, 감정 표현선을 구체적으로 맞춰야 합니다.",
  },
  sinsal_gongmang: {
    badge: "비워진 자리를 다시 채우는 힘",
    shortMeaning: "기대와 현실 사이의 빈칸을 다루는 기운",
    vividLine:
      "비어 있는 자리를 다시 채우는 기운입니다. 계획이 중간에 비거나 방향이 바뀌는 느낌이 있을 수 있습니다.",
    practicalLine:
      "계획에는 여백을 두고, 약속과 역할은 글로 확인하는 편이 안정적입니다.",
  },
  structure_jaeda_sinyak: {
    badge: "많은 자원을 감당하는 구조",
    shortMeaning: "기회와 책임이 몸보다 먼저 커질 수 있는 흐름",
    vividLine:
      "기회와 책임이 먼저 커지는 흐름입니다. 할 일과 벌 일은 빨리 보이지만, 쉬는 기준이 없으면 몸이 뒤늦게 부담을 알려줄 수 있습니다.",
    practicalLine:
      "수입 목표만큼 휴식, 위임, 지출 방어 규칙을 같이 세워야 오래 갑니다.",
  },
  structure_no_output: {
    badge: "표현 통로를 의식적으로 내야 하는 구조",
    shortMeaning: "속에 있는 생각과 감정을 밖으로 꺼내는 연습이 필요한 흐름",
    vividLine:
      "생각은 분명한데 말이나 반응이 늦어, 상대가 차갑다고 느낄 수 있습니다.",
    practicalLine:
      "결론 전에 감정 한 문장, 확인 한 문장, 고마움 한 문장을 먼저 두면 좋습니다.",
  },
  structure_no_resource: {
    badge: "혼자 버티기 쉬운 구조",
    shortMeaning: "도움을 요청하고 기대는 감각을 늦게 쓰는 흐름",
    vividLine:
      "도움받을 수 있는 상황에서도 한참 혼자 정리한 뒤에야 요청할 수 있습니다. 주변이 차갑기보다 요청 신호가 늦게 나갈 수 있습니다.",
    practicalLine:
      "막히는 순간 필요한 도움을 한 문장으로 적어 보내는 습관이 필요합니다.",
  },
  element_earth_excess: {
    badge: "책임이 쌓이는 두꺼운 땅",
    shortMeaning: "맡은 일과 부담을 오래 붙잡는 구조",
    vividLine:
      "한번 맡은 일은 쉽게 내려놓지 못하고, 할 일의 무게가 몸에 쌓이기 쉽습니다. 장점으로 쓰면 끈기지만, 기준이 없으면 부담이 오래 남습니다.",
    practicalLine:
      "맡을 일, 넘길 일, 버릴 일을 처음부터 나누는 기준표가 필요합니다.",
  },
};

type FeatureAccumulator = {
  readonly feature: SelectedSajuFeatureEvidenceItem;
  readonly sourceChapterIds: readonly string[];
};

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function collectFeatureAccumulators(
  selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined,
): readonly FeatureAccumulator[] {
  const byId = new Map<
    string,
    {
      feature: SelectedSajuFeatureEvidenceItem;
      sourceChapterIds: string[];
    }
  >();

  for (const chapter of selectedEvidence ?? []) {
    for (const feature of chapter.features) {
      const existing = byId.get(feature.id);

      if (existing === undefined || feature.score > existing.feature.score) {
        byId.set(feature.id, {
          feature,
          sourceChapterIds: uniqueValues([
            ...(existing?.sourceChapterIds ?? []),
            chapter.chapterId,
          ]) as string[],
        });
      } else {
        existing.sourceChapterIds = uniqueValues([
          ...existing.sourceChapterIds,
          chapter.chapterId,
        ]) as string[];
      }
    }
  }

  return [...byId.values()].filter((item) =>
    shouldShowFeatureInSpotlight(item.feature.id),
  );
}

function getPolishedSpotlightCopy(featureId: string): SpotlightCopy | undefined {
  const polishedCopyByFeatureId: Partial<Record<string, SpotlightCopy>> = {
    gwiin_cheoneul: {
      badge: "막힌 길에 손을 내미는 귀인",
      shortMeaning: "중요한 순간에 도움과 기회가 붙는 기운",
      vividLine:
        "막힌 길에서 귀한 사람이 손을 내미는 것처럼, 필요한 순간에 사람, 제도, 기회가 붙는 통로로 읽을 수 있습니다.",
      practicalLine:
        "도움을 기다리기보다 필요한 것을 정확히 요청할 때 더 빨리 살아납니다.",
    },
    gwiin_jaego: {
      badge: "돈과 자원을 담는 창고",
      shortMeaning: "수입과 자원을 저장하고 구조화하는 기운",
      vividLine:
        "벌고 흘려보내기보다, 돈의 자리를 정해 묶어둘 때 재물 감각이 살아납니다.",
      practicalLine:
        "계좌 분리, 자동저축, 자산 기록처럼 돈의 자리를 먼저 정해 두는 방식이 맞습니다.",
    },
    gwiin_geumyeorok: {
      badge: "좋은 조건에서 빛나는 품격의 길신",
      shortMeaning: "대우, 환경, 이미지 관리가 함께 갈 때 선명해지는 기운",
      vividLine:
        "단정하게 꾸민 수레가 안정된 길을 가는 것처럼, 좋은 조건과 생활 안정이 함께 갈 때 선명해집니다.",
      practicalLine:
        "일과 관계에서도 대우, 환경, 이미지 관리가 무너지지 않게 조건을 먼저 정리해야 합니다.",
    },
    sinsal_hyeonchim: {
      badge: "바늘처럼 정확한 판단",
      shortMeaning: "오류와 핵심을 빠르게 짚는 기운",
      vividLine:
        "남들이 대충 넘기는 허점이 먼저 보이고, 말도 핵심을 바로 찌르는 식으로 나올 수 있습니다.",
      practicalLine:
        "대화, 과제, 업무 정리에는 강점이지만, 가까운 관계에서는 말의 온도를 한 번 조절해야 합니다.",
    },
    sinsal_gongmang: {
      badge: "비어 있는 자리를 다시 채우는 신호",
      shortMeaning: "기대와 현실 사이의 빈칸을 다루는 기운",
      vividLine:
        "계획이 중간에 비거나 방향이 바뀌는 느낌이 생길 수 있으니, 빈칸을 다시 채우는 운영법이 중요합니다.",
      practicalLine:
        "계획에는 여백을 남기고, 약속과 역할은 글로 확인하는 편이 안정적입니다.",
    },
  };

  return polishedCopyByFeatureId[featureId];
}

function toSpotlightItem(input: FeatureAccumulator): SajuFeatureSpotlightItem {
  const copy =
    getPolishedSpotlightCopy(input.feature.id) ??
    spotlightCopyByFeatureId[input.feature.id];
  const labelKo = input.feature.labelKo;

  return {
    featureId: input.feature.id,
    labelKo,
    badge: normalizeKoreanSentenceSpacing(
      removeRepeatedLeadingLabel(copy?.badge ?? input.feature.symbolicImage, labelKo),
    ),
    shortMeaning: normalizeKoreanSentenceSpacing(
      removeRepeatedLeadingLabel(copy?.shortMeaning ?? input.feature.summary, labelKo),
    ),
    vividLine: joinKoreanSentences(
      removeRepeatedLeadingLabel(copy?.vividLine ?? input.feature.positiveReading, labelKo),
    ),
    practicalLine: joinKoreanSentences(
      removeRepeatedLeadingLabel(copy?.practicalLine ?? input.feature.practicalUse, labelKo),
    ),
    polarity: input.feature.polarity,
    sourceChapterIds: input.sourceChapterIds,
  };
}

function buildGroup(input: {
  readonly groupId: SajuFeatureSpotlightGroupId;
  readonly features: readonly FeatureAccumulator[];
}) {
  const priorityIds = spotlightFeatureGroups[input.groupId];
  const priorityIndexById = new Map<string, number>(
    priorityIds.map((featureId, index) => [featureId, index]),
  );
  const items = input.features
    .filter((feature) => priorityIndexById.has(feature.feature.id))
    .sort(
      (left, right) =>
        (priorityIndexById.get(left.feature.id) ?? 999) -
          (priorityIndexById.get(right.feature.id) ?? 999) ||
        right.feature.score - left.feature.score,
    )
    .slice(0, 3)
    .map(toSpotlightItem);

  return {
    groupId: input.groupId,
    title: spotlightGroupTitles[input.groupId],
    items,
  };
}

export function buildSajuFeatureSpotlight(input: {
  readonly selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
}): SajuFeatureSpotlightSection | undefined {
  const features = collectFeatureAccumulators(input.selectedEvidence);
  const groups = (Object.keys(spotlightGroupTitles) as SajuFeatureSpotlightGroupId[])
    .map((groupId) => buildGroup({ groupId, features }))
    .filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return undefined;
  }

  return {
    title: "이 사주에서 특히 눈에 띄는 기운",
    subtitle: "원국에서 확인된 기운 중 읽기 전에 잡고 가면 좋은 항목만 정리했습니다.",
    groups,
  };
}
