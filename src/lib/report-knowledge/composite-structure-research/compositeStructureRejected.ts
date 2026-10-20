import type { CompositeRejected } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_REJECTED = [
  {
    "id": "csr:rejected:jaeda_sinyak",
    "targetId": "foundation:structure:jaeda_sinyak",
    "class": "F_REJECTED",
    "claim": "재다신약이면 돈을 벌어도 반드시 가난합니다.",
    "whyRejected": "신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:singang",
    "targetId": "foundation:structure:singang",
    "class": "F_REJECTED",
    "claim": "신강한 사람은 의지와 체력이 강해 성공합니다.",
    "whyRejected": "자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:sinyak",
    "targetId": "foundation:structure:sinyak",
    "class": "F_REJECTED",
    "claim": "신약한 사람은 능력이 약해 남에게 의존합니다.",
    "whyRejected": "소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:weak_output",
    "targetId": "foundation:structure:weak_output",
    "class": "F_REJECTED",
    "claim": "식상 과다형 신약이므로 이미 번아웃을 겪었습니다.",
    "whyRejected": "체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:weak_officer",
    "targetId": "foundation:structure:weak_officer",
    "class": "F_REJECTED",
    "claim": "관성 압박형 신약이므로 상사에게 괴롭힘을 받았습니다.",
    "whyRejected": "학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:siksang_saengjae",
    "targetId": "foundation:structure:siksang_saengjae",
    "class": "F_REJECTED",
    "claim": "식상생재가 있으므로 만든 것은 반드시 돈이 됩니다.",
    "whyRejected": "재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:jaesaenggwan",
    "targetId": "foundation:structure:jaesaenggwan",
    "class": "F_REJECTED",
    "claim": "재생관이 있으므로 승진과 높은 지위가 보장됩니다.",
    "whyRejected": "승진·공직·부유함·배우자 지위는 추론하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:officer_resource",
    "targetId": "foundation:structure:officer_resource",
    "class": "F_REJECTED",
    "claim": "관인상생이 있으므로 명문대를 졸업했습니다.",
    "whyRejected": "학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:salin_sangsaeng",
    "targetId": "foundation:structure:salin_sangsaeng",
    "class": "F_REJECTED",
    "claim": "살인상생이니 힘든 환경을 참고 견디면 성공합니다.",
    "whyRejected": "고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:sanggwan_gyeongwan",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "class": "F_REJECTED",
    "claim": "상관견관이면 직장과 배우자에게 반드시 문제가 생깁니다.",
    "whyRejected": "법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:gwansal_honjob",
    "targetId": "foundation:structure:gwansal_honjob",
    "class": "F_REJECTED",
    "claim": "관살혼잡인 사람은 부정직하고 여러 연인을 만납니다.",
    "whyRejected": "부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:bigeop_many",
    "targetId": "foundation:structure:bigeop_many",
    "class": "F_REJECTED",
    "claim": "비겁이 많으므로 형제가 돈을 빼앗습니다.",
    "whyRejected": "실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:resource_many",
    "targetId": "foundation:structure:resource_many",
    "class": "F_REJECTED",
    "claim": "인성이 많으므로 부모 지원과 높은 학력이 확실합니다.",
    "whyRejected": "학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:output_heavy",
    "targetId": "foundation:structure:output_heavy",
    "class": "F_REJECTED",
    "claim": "식상이 강하므로 자녀가 많고 말을 많이 합니다.",
    "whyRejected": "창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:wealth_heavy",
    "targetId": "foundation:structure:wealth_heavy",
    "class": "F_REJECTED",
    "claim": "재성이 강하므로 실제 자산이 많습니다.",
    "whyRejected": "부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:officer_heavy",
    "targetId": "foundation:structure:officer_heavy",
    "class": "F_REJECTED",
    "claim": "관성이 강하므로 공무원 시험에 합격합니다.",
    "whyRejected": "공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:no_resource",
    "targetId": "foundation:structure:no_resource",
    "class": "F_REJECTED",
    "claim": "무인성이므로 부모가 없고 공부를 못합니다.",
    "whyRejected": "인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:no_output",
    "targetId": "foundation:structure:no_output",
    "class": "F_REJECTED",
    "claim": "무식상이므로 표현을 못하고 자녀가 없습니다.",
    "whyRejected": "표현 방식·자녀·감정 전달 능력을 단정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:toda_maegeum",
    "targetId": "foundation:structure:toda_maegeum",
    "class": "F_REJECTED",
    "claim": "토가 네 개면 금이 묻혀 판단력이 떨어집니다.",
    "whyRejected": "판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:geumda_mokjeol",
    "targetId": "foundation:structure:geumda_mokjeol",
    "class": "F_REJECTED",
    "claim": "금다목절이므로 엄격한 부모 아래 성장했습니다.",
    "whyRejected": "실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:mokda_hwasik",
    "targetId": "foundation:structure:mokda_hwasik",
    "class": "F_REJECTED",
    "claim": "木多火熾라는 구절이 목다화식의 출력 소멸을 증명합니다.",
    "whyRejected": "이 구조의 8영역은 미검증 연구로만 보존하고 직접 고객 적용하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:suda_mokbu",
    "targetId": "foundation:structure:suda_mokbu",
    "class": "F_REJECTED",
    "claim": "수다목부인 사람은 감정 과잉으로 관계가 불안정합니다.",
    "whyRejected": "감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:fire_metal",
    "targetId": "foundation:structure:fire_metal",
    "class": "F_REJECTED",
    "claim": "화와 금이 강하면 성격이 다혈질이고 사고가 납니다.",
    "whyRejected": "다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:water_weak",
    "targetId": "foundation:structure:water_weak",
    "class": "F_REJECTED",
    "claim": "수가 부족하므로 신장 질환과 회복 부족이 있습니다.",
    "whyRejected": "8영역 모두 수 부족에서 직접 성격·직업·재물·관계를 읽는 자료는 미승인이다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:season_command",
    "targetId": "foundation:structure:season_command",
    "class": "F_REJECTED",
    "claim": "겨울 월령이면 내향적이고 봄 월령이면 외향적입니다.",
    "whyRejected": "8분야의 직접 성향이 아니라 다른 해석의 적용 조건이다. 생활 응용은 추가 십성·맥락 없이는 보류.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:support_restraint",
    "targetId": "foundation:structure:support_restraint",
    "class": "F_REJECTED",
    "claim": "적은 오행을 무조건 늘리면 모든 문제가 해결됩니다.",
    "whyRejected": "생활 습관·직업 적합·재무 비중의 균등 처방으로 직접 사용하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:temperature",
    "targetId": "foundation:structure:temperature",
    "class": "F_REJECTED",
    "claim": "차가운 사주라서 사람에게 냉정합니다.",
    "whyRejected": "8분야 모두 한난만의 직접 생활 특성은 미승인. 다른 검증된 구조의 조건으로만 연구.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:moisture",
    "targetId": "foundation:structure:moisture",
    "class": "F_REJECTED",
    "claim": "습한 사주라서 감정과 의존성이 과합니다.",
    "whyRejected": "기존 dt 燥濕論 locator는 이 판본의 실제 제목과 불일치한다. 이전 파일은 보존하고 충돌로 기록.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  },
  {
    "id": "csr:rejected:mediation",
    "targetId": "foundation:structure:mediation",
    "class": "F_REJECTED",
    "claim": "통관 오행이 있으면 모든 갈등을 해결하는 중재자입니다.",
    "whyRejected": "상담 능력·화해 결과·분쟁 해소·인간관계 성공을 직접 예측하지 않는다.",
    "replacementPolicy": "해당 주장을 출력하지 않는다. 실제 성립 조건과 입력으로 확인 가능한 질문만 별도 검토.",
    "approvedForCustomer": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "오용·반례 검토"
      }
    ]
  }
] as const satisfies readonly CompositeRejected[];
