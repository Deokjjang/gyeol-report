import type { DeepTenGod } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_TEN_GODS = [
  {
    "id": "deep:ten_god:bijian",
    "targetId": "foundation:ten_god:bijian",
    "label": "비견",
    "definition": "동일 오행·동일 음양의 동료 관계",
    "contrastTargetId": "foundation:ten_god:jie_cai",
    "differentiation": "독립된 기준과 동등한 협업을 자원 분배의 긴장과 구별한다.",
    "prerequisites": [
      "일간의 실제 통근·월령과 비견의 투출·중첩을 확인해야 자립 지원인지 과경쟁인지 논할 수 있다."
    ],
    "strengthConditions": [
      "약한 일간을 돕는 경우와 이미 강한 일간에 동류가 더해지는 경우를 구분한다. 수만으로 강약을 정하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:bijian:personality",
      "deep:application:ten_god:bijian:career",
      "deep:application:ten_god:bijian:money",
      "deep:application:ten_god:bijian:study",
      "deep:application:ten_god:bijian:love",
      "deep:application:ten_god:bijian:marriage",
      "deep:application:ten_god:bijian:family",
      "deep:application:ten_god:bijian:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論正財 / 財少身強柱有比劫太過不及",
        "proposition": "같은 오행·같은 음양의 동류 관계. 독립 의지와 대등한 역할을 설명하는 후보이며 비견 자체가 강약 판정은 아니다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:jie_cai",
    "targetId": "foundation:ten_god:jie_cai",
    "label": "겁재",
    "definition": "동일 오행·다른 음양의 동료 관계",
    "contrastTargetId": "foundation:ten_god:bijian",
    "differentiation": "공유와 배분을 동등한 자기 기준 자체와 구별한다.",
    "prerequisites": [
      "일간의 강약, 재성의 존재·보호, 실제 공동 자원의 조건을 함께 확인한다."
    ],
    "strengthConditions": [
      "동료의 지원과 자원 경합을 함께 열어두며 겁재 존재만으로 손재를 판정하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:jie_cai:personality",
      "deep:application:ten_god:jie_cai:career",
      "deep:application:ten_god:jie_cai:money",
      "deep:application:ten_god:jie_cai:study",
      "deep:application:ten_god:jie_cai:love",
      "deep:application:ten_god:jie_cai:marriage",
      "deep:application:ten_god:jie_cai:family",
      "deep:application:ten_god:jie_cai:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 比肩分奪・兄弟輩出; 論正財 / 身弱財多喜兄弟羊刃為助",
        "proposition": "같은 오행·다른 음양의 동류 관계. 財 논설의 分奪은 구성 조건을 전제로 하며 실제 강탈 사건이 아니다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:shi_shen",
    "targetId": "foundation:ten_god:shi_shen",
    "label": "식신",
    "definition": "내가 생하는 오행·동일 음양의 산출 관계",
    "contrastTargetId": "foundation:ten_god:shang_guan",
    "differentiation": "숙련·지속적 산출을 규칙에 대한 비판·변경과 구별한다.",
    "prerequisites": [
      "일간과 식신의 생왕, 편인의 제약, 재성·관살과의 관계를 확인한다."
    ],
    "strengthConditions": [
      "일간이 감당할 설기인지, 산출 통로가 막혔는지 검토한다. 식신 하나로 부·수명·자녀를 예측하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:shi_shen:personality",
      "deep:application:ten_god:shi_shen:career",
      "deep:application:ten_god:shi_shen:money",
      "deep:application:ten_god:shi_shen:study",
      "deep:application:ten_god:shi_shen:love",
      "deep:application:ten_god:shi_shen:marriage",
      "deep:application:ten_god:shi_shen:family",
      "deep:application:ten_god:shi_shen:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論古人立印食官財名義 / 我生者・致養; 論倒食 / 食神条件",
        "proposition": "일간이 생하며 같은 음양인 산출 관계. 印食官財 명의는 기르고 되돌려 주는 비유를 사용한다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:shang_guan",
    "targetId": "foundation:ten_god:shang_guan",
    "label": "상관",
    "definition": "내가 생하는 오행·다른 음양의 산출 관계",
    "contrastTargetId": "foundation:ten_god:shi_shen",
    "differentiation": "기준을 바꾸는 표현을 안정적 숙련의 반복과 구별한다.",
    "prerequisites": [
      "일간의 강약, 관성의 상태, 재성의 통관과 인성의 제약을 함께 확인한다."
    ],
    "strengthConditions": [
      "상관과 관성이 있다는 이유만으로 충돌을 확정하지 않는다. 제화·통관·별도 격의 조건을 분리한다."
    ],
    "applicationIds": [
      "deep:application:ten_god:shang_guan:personality",
      "deep:application:ten_god:shang_guan:career",
      "deep:application:ten_god:shang_guan:money",
      "deep:application:ten_god:shang_guan:study",
      "deep:application:ten_god:shang_guan:love",
      "deep:application:ten_god:shang_guan:marriage",
      "deep:application:ten_god:shang_guan:family",
      "deep:application:ten_god:shang_guan:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論傷官 / 傷官見官亦有不作禍者",
        "proposition": "일간이 생하며 다른 음양인 산출 관계. 傷官 명칭은 正官과의 생극 설명에서 나오며 모든 권위와 충돌한다는 뜻이 아니다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:pian_cai",
    "targetId": "foundation:ten_god:pian_cai",
    "label": "편재",
    "definition": "내가 극하는 오행·동일 음양의 자원 관계",
    "contrastTargetId": "foundation:ten_god:zheng_cai",
    "differentiation": "외부 자원·거래 범위를 지속적인 보유·관리와 구별한다.",
    "prerequisites": [
      "일간의 감당 여력, 재성의 강약·투출, 비겁과 실제 거래 조건을 확인한다."
    ],
    "strengthConditions": [
      "재성이 많아도 일간의 여력과 회수 조건이 다르면 해석이 달라진다. 거래 규모를 부의 양으로 읽지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:pian_cai:personality",
      "deep:application:ten_god:pian_cai:career",
      "deep:application:ten_god:pian_cai:money",
      "deep:application:ten_god:pian_cai:study",
      "deep:application:ten_god:pian_cai:love",
      "deep:application:ten_god:pian_cai:marriage",
      "deep:application:ten_god:pian_cai:family",
      "deep:application:ten_god:pian_cai:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 衆人之財・身勢勝任・年月日時差",
        "proposition": "일간이 극하며 같은 음양인 자원 관계. 論偏財의 衆人之財는 고전의 자원 비유이지 타인의 돈을 받을 권리나 횡재 예언이 아니다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:zheng_cai",
    "targetId": "foundation:ten_god:zheng_cai",
    "label": "정재",
    "definition": "내가 극하는 오행·다른 음양의 자원 관계",
    "contrastTargetId": "foundation:ten_god:pian_cai",
    "differentiation": "지속 관리·책임의 범위를 기회의 확장과 구별한다.",
    "prerequisites": [
      "일간의 강약, 재성의 위치·투출, 식상·비겁·관성과 실제 관리 책임을 확인한다."
    ],
    "strengthConditions": [
      "관리 가능한 자원과 감당 못 할 책임을 구분하며 강한 정재를 무조건 좋은 재운으로 승인하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:zheng_cai:personality",
      "deep:application:ten_god:zheng_cai:career",
      "deep:application:ten_god:zheng_cai:money",
      "deep:application:ten_god:zheng_cai:study",
      "deep:application:ten_god:zheng_cai:love",
      "deep:application:ten_god:zheng_cai:marriage",
      "deep:application:ten_god:zheng_cai:family",
      "deep:application:ten_god:zheng_cai:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論正財 / 財多身弱・財少身強・得時得位有成",
        "proposition": "일간이 극하며 다른 음양인 자원 관계. 論正財는 일간이 감당할 힘·재성의 적정량·월령을 함께 요구한다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:zheng_guan",
    "targetId": "foundation:ten_god:zheng_guan",
    "label": "정관",
    "definition": "나를 극하는 오행·다른 음양의 제약 관계",
    "contrastTargetId": "foundation:ten_god:qi_sha",
    "differentiation": "공식 역할·책임을 급격한 압박 대응과 구별한다.",
    "prerequisites": [
      "일간과 관성의 강약, 재성의 생조, 상관·인성·관살 혼잡을 확인한다."
    ],
    "strengthConditions": [
      "기준이 기능하는 경우와 평가 부담이 과한 경우를 분리한다. 관성의 존재를 공직·승진의 보장으로 읽지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:zheng_guan:personality",
      "deep:application:ten_god:zheng_guan:career",
      "deep:application:ten_god:zheng_guan:money",
      "deep:application:ten_god:zheng_guan:study",
      "deep:application:ten_god:zheng_guan:love",
      "deep:application:ten_god:zheng_guan:marriage",
      "deep:application:ten_god:zheng_guan:family",
      "deep:application:ten_god:zheng_guan:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論正官 / 身旺・財印・月令・官殺",
        "proposition": "일간을 극하며 다른 음양인 규율 관계. 論正官는 身旺·財印·형충·관살 구성의 조건을 병기한다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:pian_yin",
    "targetId": "foundation:ten_god:pian_yin",
    "label": "편인",
    "definition": "나를 생하는 오행·동일 음양의 지원 관계",
    "contrastTargetId": "foundation:ten_god:zheng_yin",
    "differentiation": "비정형 관점의 탐구를 검증된 지식의 수용과 구별한다.",
    "prerequisites": [
      "일간의 강약, 실제 식신의 유무·용도, 재성의 제어와 인성의 편중을 확인한다."
    ],
    "strengthConditions": [
      "편인이 있다는 사실과 식신을 제약하는 도식 조건은 같지 않다. 실제 조합 없이 도식의 위험을 적용하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:pian_yin:personality",
      "deep:application:ten_god:pian_yin:career",
      "deep:application:ten_god:pian_yin:money",
      "deep:application:ten_god:pian_yin:study",
      "deep:application:ten_god:pian_yin:love",
      "deep:application:ten_god:pian_yin:marriage",
      "deep:application:ten_god:pian_yin:family",
      "deep:application:ten_god:pian_yin:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論倒食 / 柱中無食只以偏印論; 不可一見倒食便以凶論",
        "proposition": "일간을 생하며 같은 음양인 지원 관계. 論倒食은 食神을 실제로 해치는 조건과 無食只以偏印論을 구분한다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:zheng_yin",
    "targetId": "foundation:ten_god:zheng_yin",
    "label": "정인",
    "definition": "나를 생하는 오행·다른 음양의 지원 관계",
    "contrastTargetId": "foundation:ten_god:pian_yin",
    "differentiation": "체계적 수용·지원의 통로를 낯선 관점의 탐색과 구별한다.",
    "prerequisites": [
      "일간의 강약, 월령, 인성의 생조, 재성의 제약과 식상의 산출을 함께 확인한다."
    ],
    "strengthConditions": [
      "필요한 지원과 과도한 의존은 원국·실제 맥락이 달라 구분해야 한다. 인성 개수로 지능·학력·부모를 확정하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:zheng_yin:personality",
      "deep:application:ten_god:zheng_yin:career",
      "deep:application:ten_god:zheng_yin:money",
      "deep:application:ten_god:zheng_yin:study",
      "deep:application:ten_god:zheng_yin:love",
      "deep:application:ten_god:zheng_yin:marriage",
      "deep:application:ten_god:zheng_yin:family",
      "deep:application:ten_god:zheng_yin:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論印綬 / 月最要日時次之; 時逢生印",
        "proposition": "일간을 생하며 다른 음양인 지원 관계. 論印綬는 부모·인장 비유와 月日時·官財·과다의 조건을 나누어 설명한다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  },
  {
    "id": "deep:ten_god:qi_sha",
    "targetId": "foundation:ten_god:qi_sha",
    "label": "편관",
    "definition": "나를 극하는 오행·동일 음양의 제약 관계",
    "contrastTargetId": "foundation:ten_god:zheng_guan",
    "differentiation": "강한 요구와 대응 압력을 합의된 공식 규범과 구별한다.",
    "prerequisites": [
      "일간의 통근·강약, 식신의 제어, 인성의 연결, 혼잡 여부를 실제 근거로 확인한다."
    ],
    "strengthConditions": [
      "살의 압력을 감당하거나 전환하는 조건과 지나치게 제압된 경우를 따로 본다. 위험·폭력·직업을 단정하지 않는다."
    ],
    "applicationIds": [
      "deep:application:ten_god:qi_sha:personality",
      "deep:application:ten_god:qi_sha:career",
      "deep:application:ten_god:qi_sha:money",
      "deep:application:ten_god:qi_sha:study",
      "deep:application:ten_god:qi_sha:love",
      "deep:application:ten_god:qi_sha:marriage",
      "deep:application:ten_god:qi_sha:family",
      "deep:application:ten_god:qi_sha:relationships"
    ],
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "getTenGod",
        "proposition": "오행의 생극과 음양에 따른 기존 상대 관계 정의"
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論偏官 / 制合生化・太過不及; 天元坐煞・時上一位貴・年上七煞",
        "proposition": "일간을 극하며 같은 음양인 압력 관계. 論偏官는 制化·강약·과불급을 함께 보며 偏官/七煞를 단순 선악으로 고정하지 않는다."
      }
    ],
    "followUp": [
      "강약을 새로 계산하거나 점수화하지 않는다. 위치별 검토는 별도 연구 기록에 보존한다."
    ]
  }
] as const satisfies readonly DeepTenGod[];
