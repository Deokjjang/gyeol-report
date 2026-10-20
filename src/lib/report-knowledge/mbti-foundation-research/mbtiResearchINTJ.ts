import type { MbtiResearchMaterial } from "./mbtiResearchTypes";

export const MBTI_RESEARCH_INTJ = [
  {
    "id": "mkr:INTJ:identity:01",
    "type": "INTJ",
    "domain": "identity",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/identity/0",
        "traitId": "strategic_skeptic",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7ae0c431608c5af8ec2857ff98232262ff999b05915d509c199808bceee58e1e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/identity/1",
        "traitId": "independent_decision_maker",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "ff41e8f6cbcc4777b8c45991419aaad8a667465cc4655141b0a94e95c1494669"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "의심을 대안으로 바꾸기",
    "positiveExpression": "비판의 목적이 드러남",
    "cautionExpression": "반대만 남으면 협력 소모",
    "behaviorCandidate": "불편한 규칙과 대안을 함께 적기",
    "environmentCondition": "규칙 변경을 제안할 때",
    "unexpectedFacet": "독립적이어도 중간 공유를 선택할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/identity/0",
          "traitId": "quiet_logic_engine",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "723d8a86eabefc17e080aece3a13f354e934a65096331284e40477a693d46d03"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/identity/5",
          "traitId": "anti_authority_free_mind",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "2c7ad816a9d79a4afe6363e0c21cc4fe819303f153d3f657f7e946f859240f8f"
        }
      ],
      "interpretation": "INTP의 모델 탐색과 공통점이 있으나 여기서는 실행할 방향의 선택을 살핌",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "회의에서 절차 삭제 대신 대체 절차 제시"
    },
    "counterexample": "급한 현장에서는 함께 즉시 판단하는 사람도 있음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:identity:02",
    "type": "INTJ",
    "domain": "identity",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/identity/0",
        "traitId": "strategic_skeptic",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7ae0c431608c5af8ec2857ff98232262ff999b05915d509c199808bceee58e1e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/identity/1",
        "traitId": "independent_decision_maker",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "ff41e8f6cbcc4777b8c45991419aaad8a667465cc4655141b0a94e95c1494669"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "독립 판단의 공유 시점",
    "positiveExpression": "자율성과 합의가 공존",
    "cautionExpression": "완성 뒤 통보하면 배제감",
    "behaviorCandidate": "결론 전에 판단 기준을 공개하기",
    "environmentCondition": "혼자 결정할 시간이 있을 때",
    "unexpectedFacet": "독립적이어도 중간 공유를 선택할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/identity/0",
          "traitId": "quiet_logic_engine",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "723d8a86eabefc17e080aece3a13f354e934a65096331284e40477a693d46d03"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/identity/5",
          "traitId": "anti_authority_free_mind",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "2c7ad816a9d79a4afe6363e0c21cc4fe819303f153d3f657f7e946f859240f8f"
        }
      ],
      "interpretation": "INTP의 모델 탐색과 공통점이 있으나 여기서는 실행할 방향의 선택을 살핌",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "일정 확정 전에 선택 기준을 동료에게 전달"
    },
    "counterexample": "급한 현장에서는 함께 즉시 판단하는 사람도 있음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:thinkingStyle:01",
    "type": "INTJ",
    "domain": "thinkingStyle",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "traitId": "system_first_thinking",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7fbbc908f57f42701222f1021bc8736ed0b4be9dcad1909c0d891cc88e2b5cbf"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/5",
        "traitId": "hidden_inconsistency_detector",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3f85dde8bad125a33743a53086573c92fa401ee47075ee9a5b8feb8e25489b54"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "구조와 예외를 함께 보기",
    "positiveExpression": "설명 범위가 명확해짐",
    "cautionExpression": "예외를 지우면 과신",
    "behaviorCandidate": "모델 밖 사례를 따로 기록하기",
    "environmentCondition": "통일된 설명을 만들 때",
    "unexpectedFacet": "모순을 발견해도 당장 고치지 않을 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/0",
          "traitId": "ti_internal_model",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "ecaaf5978080fd93a4bda1fefbb5f126099d00fde9192e330604671a60792e7f"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/5",
          "traitId": "pattern_leap_risk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "66219785464a5244905c093111931d53a9734fab00f93cfdcd6fdbb29b24891d"
        }
      ],
      "interpretation": "INTP의 논리 정합성 탐색과 겹치며 이 후보는 장기 설계에 미치는 영향을 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "고객 분류표에 분류되지 않는 사례 추가"
    },
    "counterexample": "반례를 찾아도 전문 지식 없이는 모델 오류를 판정할 수 없음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:thinkingStyle:02",
    "type": "INTJ",
    "domain": "thinkingStyle",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "traitId": "system_first_thinking",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7fbbc908f57f42701222f1021bc8736ed0b4be9dcad1909c0d891cc88e2b5cbf"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/5",
        "traitId": "hidden_inconsistency_detector",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3f85dde8bad125a33743a53086573c92fa401ee47075ee9a5b8feb8e25489b54"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "모순의 중요도 나누기",
    "positiveExpression": "논의 비용을 줄임",
    "cautionExpression": "사소한 표현 교정에 매몰",
    "behaviorCandidate": "결정에 영향 주는 오류부터 논의",
    "environmentCondition": "오류가 여러 개 보일 때",
    "unexpectedFacet": "모순을 발견해도 당장 고치지 않을 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/0",
          "traitId": "ti_internal_model",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "ecaaf5978080fd93a4bda1fefbb5f126099d00fde9192e330604671a60792e7f"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/5",
          "traitId": "pattern_leap_risk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "66219785464a5244905c093111931d53a9734fab00f93cfdcd6fdbb29b24891d"
        }
      ],
      "interpretation": "INTP의 논리 정합성 탐색과 겹치며 이 후보는 장기 설계에 미치는 영향을 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "보고서 용어보다 누락 비용을 먼저 확인"
    },
    "counterexample": "반례를 찾아도 전문 지식 없이는 모델 오류를 판정할 수 없음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:career:01",
    "type": "INTJ",
    "domain": "career",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/career/5",
        "traitId": "autonomy_required_role",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "0366a767940c5429c4afdfdbdd6dac46988ed9d4b2df23811fe1e764a8932ba9"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/career/7",
        "traitId": "strategy_to_asset_work",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "c3bf26f0f42579f4822f5d07dfcfd4891789d0500e0b9c5d4718fbbfc327772c"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "권한의 크기보다 범위",
    "positiveExpression": "책임 경계가 선명",
    "cautionExpression": "직함만으로 자율성 기대",
    "behaviorCandidate": "결정 가능한 항목과 승인 항목 구분",
    "environmentCondition": "일을 맡기 전에",
    "unexpectedFacet": "관리직이 아니어도 구조 개선에 참여할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/career/0",
          "traitId": "research_field_fit",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "ca0ffe4d0c1fb3f6e4eeeefb864ebc801202db43a6922b259e2a29d122ec4947"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/career/6",
          "traitId": "model_to_product_bridge",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "4478ec64f3dd2eb04154ae00bdae81c7647c829373b6ca7a7c0eca4e57771ecb"
        }
      ],
      "interpretation": "INTP의 모델 결과물화와 공유되며 여기서는 반복 운영에서의 재사용성을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "지원 역할도 개선 권한이 있는지 질문"
    },
    "counterexample": "직업명만으로 적합성이나 수입을 판단하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 직업·전공 선택의 배제, 능력·지능·성적·취업 결과 판정에 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results",
      "mbf:careers"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:career:02",
    "type": "INTJ",
    "domain": "career",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/career/5",
        "traitId": "autonomy_required_role",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "0366a767940c5429c4afdfdbdd6dac46988ed9d4b2df23811fe1e764a8932ba9"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/career/7",
        "traitId": "strategy_to_asset_work",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "c3bf26f0f42579f4822f5d07dfcfd4891789d0500e0b9c5d4718fbbfc327772c"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "지식을 재사용 가능한 도구로",
    "positiveExpression": "인수인계가 가능해짐",
    "cautionExpression": "도구 제작이 본업을 밀침",
    "behaviorCandidate": "판단 과정을 작은 문서로 남기기",
    "environmentCondition": "같은 문제를 반복 처리할 때",
    "unexpectedFacet": "관리직이 아니어도 구조 개선에 참여할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/career/0",
          "traitId": "research_field_fit",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "ca0ffe4d0c1fb3f6e4eeeefb864ebc801202db43a6922b259e2a29d122ec4947"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/career/6",
          "traitId": "model_to_product_bridge",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "4478ec64f3dd2eb04154ae00bdae81c7647c829373b6ca7a7c0eca4e57771ecb"
        }
      ],
      "interpretation": "INTP의 모델 결과물화와 공유되며 여기서는 반복 운영에서의 재사용성을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "반복 문의 하나의 답변 절차만 문서화"
    },
    "counterexample": "직업명만으로 적합성이나 수입을 판단하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 직업·전공 선택의 배제, 능력·지능·성적·취업 결과 판정에 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results",
      "mbf:careers"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:workplace:01",
    "type": "INTJ",
    "domain": "workplace",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/0",
        "traitId": "anti_politics_work_style",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "2cd4a099223cd20b305ce9054b48bdfb6b498f80b12c21d7984bbad52054a38d"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/6",
        "traitId": "authority_scope_alignment",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "3ddee8c70df58cb32c9f40a702e41e171b6e2e64f6b6c0edf885b03ca42340e1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "비공식 소통의 용도 구분",
    "positiveExpression": "정보 누락을 줄임",
    "cautionExpression": "모든 사담을 낭비로 취급",
    "behaviorCandidate": "결정 정보와 사담을 분리해 요청",
    "environmentCondition": "친목과 업무가 섞일 때",
    "unexpectedFacet": "사교를 즐기지 않아도 정보 교환은 할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/workplace/0",
          "traitId": "needs_thinking_time",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "0744f9e46934b3bbe67347f67d651f543e9c3fff29270f033ae5b79e6da8aef8"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/workplace/5",
          "traitId": "scope_clarity_contract",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "a0fc593a6aae04e805ce98318a67e6e327f3ebf2489d92e7f98b0a85ddfc9723"
        }
      ],
      "interpretation": "INTP의 숙고 시간 요구와 달리 이 후보는 의사결정 권한의 경계를 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "점심 대화의 결정 사항만 업무 문서에 기록"
    },
    "counterexample": "권한이 있어도 자원과 경험이 부족하면 수행이 어려움",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results",
      "mbf:careers"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:workplace:02",
    "type": "INTJ",
    "domain": "workplace",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/0",
        "traitId": "anti_politics_work_style",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "2cd4a099223cd20b305ce9054b48bdfb6b498f80b12c21d7984bbad52054a38d"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/6",
        "traitId": "authority_scope_alignment",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "3ddee8c70df58cb32c9f40a702e41e171b6e2e64f6b6c0edf885b03ca42340e1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "책임과 권한의 불일치 설명",
    "positiveExpression": "협의할 대상이 분명",
    "cautionExpression": "조직 전체에 대한 냉소",
    "behaviorCandidate": "막힌 결정과 필요한 승인을 특정",
    "environmentCondition": "책임만 늘어날 때",
    "unexpectedFacet": "사교를 즐기지 않아도 정보 교환은 할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/workplace/0",
          "traitId": "needs_thinking_time",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "0744f9e46934b3bbe67347f67d651f543e9c3fff29270f033ae5b79e6da8aef8"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/workplace/5",
          "traitId": "scope_clarity_contract",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "a0fc593a6aae04e805ce98318a67e6e327f3ebf2489d92e7f98b0a85ddfc9723"
        }
      ],
      "interpretation": "INTP의 숙고 시간 요구와 달리 이 후보는 의사결정 권한의 경계를 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "일정 책임에 필요한 승인 시간을 상사와 합의"
    },
    "counterexample": "권한이 있어도 자원과 경험이 부족하면 수행이 어려움",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results",
      "mbf:careers"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:money:01",
    "type": "INTJ",
    "domain": "money",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/money/3",
        "traitId": "cashflow_system_design",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "2709acb43e3d427cd0d560fd5601cb1b6c7f6812fba7fa599ed053169b78d656"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/money/5",
        "traitId": "shared_finance_blind_spot",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "ae72318d88e625bb63c1cc59063b56f94f07c1228a7e102723e69bdc9363d0ae"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "개인 설계와 공동 합의",
    "positiveExpression": "결정 과정을 공유",
    "cautionExpression": "계산 결과를 정답으로 통보",
    "behaviorCandidate": "효율안과 상대의 우선순위를 함께 기록",
    "environmentCondition": "돈을 함께 관리한다면",
    "unexpectedFacet": "계산에 자신 있어도 공동 돈에는 동의가 필요",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/money/0",
          "traitId": "low_material_drive",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "a62e1e2532fb73751080daa8ce4bdf82138c5f86ef9560adab561bb3d10f62aa"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/money/5",
          "traitId": "interest_spending_drift",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "d6f0376da52434e77867b6206f09772f62ebaf8036075fd546d685ddbd55b5d4"
        }
      ],
      "interpretation": "INTP의 관심사 지출과 겹치지만 이 후보는 큰 목표와 공동 의사결정의 관계를 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "공동 지출을 줄이기 전 각자의 필요 확인"
    },
    "counterexample": "소득과 실제 지출 내역 없이 재정 상태를 추론하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 재정 정보 없이 행동·위험 감내·결과를 추정하지 않는다. 상품 선택·수익 예측·개별 금융 권유 자료가 아니다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:money:02",
    "type": "INTJ",
    "domain": "money",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/money/3",
        "traitId": "cashflow_system_design",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "2709acb43e3d427cd0d560fd5601cb1b6c7f6812fba7fa599ed053169b78d656"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/money/5",
        "traitId": "shared_finance_blind_spot",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "ae72318d88e625bb63c1cc59063b56f94f07c1228a7e102723e69bdc9363d0ae"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "지출 목표의 종료 조건",
    "positiveExpression": "목적 없는 추가 지출 식별",
    "cautionExpression": "장기 목표가 생활비를 압박",
    "behaviorCandidate": "구매 목적과 사용 종료 기준 적기",
    "environmentCondition": "큰 목표에 돈을 쓰려 할 때",
    "unexpectedFacet": "계산에 자신 있어도 공동 돈에는 동의가 필요",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/money/0",
          "traitId": "low_material_drive",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "a62e1e2532fb73751080daa8ce4bdf82138c5f86ef9560adab561bb3d10f62aa"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/money/5",
          "traitId": "interest_spending_drift",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "d6f0376da52434e77867b6206f09772f62ebaf8036075fd546d685ddbd55b5d4"
        }
      ],
      "interpretation": "INTP의 관심사 지출과 겹치지만 이 후보는 큰 목표와 공동 의사결정의 관계를 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "장비 구매 뒤 사용할 프로젝트와 기간 지정"
    },
    "counterexample": "소득과 실제 지출 내역 없이 재정 상태를 추론하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 재정 정보 없이 행동·위험 감내·결과를 추정하지 않는다. 상품 선택·수익 예측·개별 금융 권유 자료가 아니다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:investment:01",
    "type": "INTJ",
    "domain": "investment",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/investment/0",
        "traitId": "anti_hype_investment",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "38cbad4f2f6a93f12481b726ccb8cd65341031294898ba0129b01391e2020f4e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/investment/3",
        "traitId": "model_overconfidence_risk",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "2f0571295b868df8fdda3919a25e032eb8019293b2fbca6dcb9063a81da41200"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "반유행도 검증 대상",
    "positiveExpression": "반대 자체를 근거로 삼지 않음",
    "cautionExpression": "대중과 다르다는 확신",
    "behaviorCandidate": "찬성 근거와 반대 근거를 같이 검토",
    "environmentCondition": "인기 있는 설명을 의심할 때",
    "unexpectedFacet": "유행을 경계하는 태도도 편향이 될 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/investment/0",
          "traitId": "research_based_investing",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "06081170db943c9cb6fd06806ea0c28871ff34d983429ba4d3681762e48e5318"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/investment/4",
          "traitId": "theory_detachment_guard",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "b0d523179a8bbfde9deffd9d243221834344f9431c95f99209d7d7f965ffcbc7"
        }
      ],
      "interpretation": "INTP의 이론 탐색과 공통되며 여기서는 선택한 장기 가설의 수정 조건을 살핌",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "모의 판단 메모에 반대 가설도 적기"
    },
    "counterexample": "투자 판단의 정확성이나 손실 감내 수준은 유형으로 알 수 없음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 재정 정보 없이 행동·위험 감내·결과를 추정하지 않는다. 상품 선택·수익 예측·개별 금융 권유 자료가 아니다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:investment:02",
    "type": "INTJ",
    "domain": "investment",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/investment/0",
        "traitId": "anti_hype_investment",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "38cbad4f2f6a93f12481b726ccb8cd65341031294898ba0129b01391e2020f4e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/investment/3",
        "traitId": "model_overconfidence_risk",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "2f0571295b868df8fdda3919a25e032eb8019293b2fbca6dcb9063a81da41200"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "모델의 변경 조건",
    "positiveExpression": "이론과 관찰을 비교",
    "cautionExpression": "불리한 정보만 예외 처리",
    "behaviorCandidate": "가정이 깨지는 관찰 조건을 명시",
    "environmentCondition": "설명을 오래 유지할 때",
    "unexpectedFacet": "유행을 경계하는 태도도 편향이 될 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/investment/0",
          "traitId": "research_based_investing",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "06081170db943c9cb6fd06806ea0c28871ff34d983429ba4d3681762e48e5318"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/investment/4",
          "traitId": "theory_detachment_guard",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "b0d523179a8bbfde9deffd9d243221834344f9431c95f99209d7d7f965ffcbc7"
        }
      ],
      "interpretation": "INTP의 이론 탐색과 공통되며 여기서는 선택한 장기 가설의 수정 조건을 살핌",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "분석 가정과 관찰 결과를 별도 칸에 기록"
    },
    "counterexample": "투자 판단의 정확성이나 손실 감내 수준은 유형으로 알 수 없음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 재정 정보 없이 행동·위험 감내·결과를 추정하지 않는다. 상품 선택·수익 예측·개별 금융 권유 자료가 아니다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:study:01",
    "type": "INTJ",
    "domain": "study",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/study/1",
        "traitId": "deep_project_learning",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "759dfe791ffb9a89a28a7281a826e93ff76de2a2ad2298cb5d11cd0a9492d020"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/study/4",
        "traitId": "perfectionism_start_gate",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "626b486a07d9310926000352b470a2b9d97a9ffba8188873a40ec8a6d061cfae"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "설계 이전의 첫 확인",
    "positiveExpression": "계획에 실제 난점 반영",
    "cautionExpression": "계획만으로 이해했다고 느낌",
    "behaviorCandidate": "작은 문제 하나를 풀어 빈틈 찾기",
    "environmentCondition": "계획을 오래 다듬는다면",
    "unexpectedFacet": "완벽한 계획 없이도 탐색을 시작할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/study/0",
          "traitId": "math_science_affinity",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "1c22c4e387df2182093a46b0f1dc1c1335ce2305cfe6866ff3184fd2bcff96b3"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/study/4",
          "traitId": "exam_routine_bridge",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "f6ea32df8f448f4d59e2a8bc23a42e35d28086c3d28ec3910bf77834f42fce22"
        }
      ],
      "interpretation": "INTP의 개념 탐색과 공유되며 이 후보는 전체 설계가 시작을 늦추는지 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "목차 작성 전에 기초 문제 한 개 시도"
    },
    "counterexample": "학습 행동은 관찰 가능하지만 지능이나 성적은 추론 불가",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 직업·전공 선택의 배제, 능력·지능·성적·취업 결과 판정에 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:study:02",
    "type": "INTJ",
    "domain": "study",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/study/1",
        "traitId": "deep_project_learning",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "759dfe791ffb9a89a28a7281a826e93ff76de2a2ad2298cb5d11cd0a9492d020"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/study/4",
        "traitId": "perfectionism_start_gate",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "626b486a07d9310926000352b470a2b9d97a9ffba8188873a40ec8a6d061cfae"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "깊이와 범위의 분리",
    "positiveExpression": "흥미와 마감을 함께 관리",
    "cautionExpression": "깊은 탐구가 필수 과제 대체",
    "behaviorCandidate": "필수 범위와 탐구 범위 나누기",
    "environmentCondition": "한 주제에 몰입할 때",
    "unexpectedFacet": "완벽한 계획 없이도 탐색을 시작할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/study/0",
          "traitId": "math_science_affinity",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "1c22c4e387df2182093a46b0f1dc1c1335ce2305cfe6866ff3184fd2bcff96b3"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/study/4",
          "traitId": "exam_routine_bridge",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "f6ea32df8f448f4d59e2a8bc23a42e35d28086c3d28ec3910bf77834f42fce22"
        }
      ],
      "interpretation": "INTP의 개념 탐색과 공유되며 이 후보는 전체 설계가 시작을 늦추는지 확인",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "보고서 요구 범위를 먼저 표시하고 확장"
    },
    "counterexample": "학습 행동은 관찰 가능하지만 지능이나 성적은 추론 불가",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 직업·전공 선택의 배제, 능력·지능·성적·취업 결과 판정에 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:love:01",
    "type": "INTJ",
    "domain": "love",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/0",
        "traitId": "slow_high_standard_love",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "0b9cfffe4bbb1b70d2e853bddec5a469cd194f10e753064e06aa13e228722df0"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/3",
        "traitId": "knowledge_display_risk",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "ae16969633ea91218c31fc8c35371b4b53f57046984518bb4e8811c2023bb2a1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "방향 확인과 현재의 즐거움",
    "positiveExpression": "사람을 목표표로 환원하지 않음",
    "cautionExpression": "조건 심사가 대화를 지배",
    "behaviorCandidate": "미래 질문 뒤 오늘 좋았던 점 묻기",
    "environmentCondition": "교제를 검토한다면",
    "unexpectedFacet": "기준이 높아도 가벼운 즐거움을 원할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/love/0",
          "traitId": "careful_narrow_love",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "f29a444a19ae84609d23fe8291c2cc05ca0b1f2ef5e552aabec4f85d18b78e95"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/love/3",
          "traitId": "freedom_based_attachment",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "d99c8368f208e8f6b200e21fa298529080ce26c4339901976049ce259283fce4"
        }
      ],
      "interpretation": "INTP의 지적 유대와 겹치며 이 후보는 함께 갈 방향을 묻는 방식에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "데이트에서 계획 이야기와 일상 이야기 교대"
    },
    "counterexample": "연애 여부나 상대의 반응을 유형으로 만들지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:love:02",
    "type": "INTJ",
    "domain": "love",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/0",
        "traitId": "slow_high_standard_love",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "0b9cfffe4bbb1b70d2e853bddec5a469cd194f10e753064e06aa13e228722df0"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/3",
        "traitId": "knowledge_display_risk",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "ae16969633ea91218c31fc8c35371b4b53f57046984518bb4e8811c2023bb2a1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "지식 공유의 초대 확인",
    "positiveExpression": "관심을 주고받음",
    "cautionExpression": "일방 강의로 친밀감 저하",
    "behaviorCandidate": "더 듣고 싶은지 먼저 묻기",
    "environmentCondition": "설명이 길어질 때",
    "unexpectedFacet": "기준이 높아도 가벼운 즐거움을 원할 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/love/0",
          "traitId": "careful_narrow_love",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "f29a444a19ae84609d23fe8291c2cc05ca0b1f2ef5e552aabec4f85d18b78e95"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/love/3",
          "traitId": "freedom_based_attachment",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "d99c8368f208e8f6b200e21fa298529080ce26c4339901976049ce259283fce4"
        }
      ],
      "interpretation": "INTP의 지적 유대와 겹치며 이 후보는 함께 갈 방향을 묻는 방식에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "취미 설명 중 상대의 경험을 질문"
    },
    "counterexample": "연애 여부나 상대의 반응을 유형으로 만들지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:marriage:01",
    "type": "INTJ",
    "domain": "marriage",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/0",
        "traitId": "future_planned_marriage",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "dac6f0b12971fd4111dc12014f107e624374b4c41fc1f8f9077c8ae4f56c949b"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/4",
        "traitId": "emotional_expression_routine",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "9d64de1770e1620bc6c0c7ce1c3a39fa4155cfb52a97ecba4b75e8dac5689ef1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "미래 계획의 변경권",
    "positiveExpression": "계획이 합의로 남음",
    "cautionExpression": "장기 계획이 상대를 구속",
    "behaviorCandidate": "계획을 다시 논의할 조건 정하기",
    "environmentCondition": "공동생활을 선택했다면",
    "unexpectedFacet": "체계적인 생활과 따뜻한 표현은 함께 가능",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/marriage/0",
          "traitId": "marriage_with_space",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "7a2eead72df2616d3f8a2503c2a98bfdf4cc52c857a52d4988e9995cb31f3b33"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/marriage/4",
          "traitId": "emotional_checkin_frequency",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "ad0d09531db269cf243a92f4eb858a2c5e4163e1aa9c46fa2bd6c79088583d2a"
        }
      ],
      "interpretation": "INTP의 공간 존중과 공통되나 이 후보는 공동 미래의 설계와 표현을 분리",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "거주 계획에 재검토 시점을 함께 적기"
    },
    "counterexample": "혼인이나 가족 구성을 가정하지 않고 동의한 공동생활에만 적용",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:marriage:02",
    "type": "INTJ",
    "domain": "marriage",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/0",
        "traitId": "future_planned_marriage",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "dac6f0b12971fd4111dc12014f107e624374b4c41fc1f8f9077c8ae4f56c949b"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/4",
        "traitId": "emotional_expression_routine",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "9d64de1770e1620bc6c0c7ce1c3a39fa4155cfb52a97ecba4b75e8dac5689ef1"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "책임과 애정의 별도 확인",
    "positiveExpression": "헌신의 전달 방식 확인",
    "cautionExpression": "일을 했으니 감정도 해결됐다고 봄",
    "behaviorCandidate": "상대가 체감한 도움을 물어보기",
    "environmentCondition": "맡은 일을 잘하고 있을 때",
    "unexpectedFacet": "체계적인 생활과 따뜻한 표현은 함께 가능",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/marriage/0",
          "traitId": "marriage_with_space",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "7a2eead72df2616d3f8a2503c2a98bfdf4cc52c857a52d4988e9995cb31f3b33"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/marriage/4",
          "traitId": "emotional_checkin_frequency",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "ad0d09531db269cf243a92f4eb858a2c5e4163e1aa9c46fa2bd6c79088583d2a"
        }
      ],
      "interpretation": "INTP의 공간 존중과 공통되나 이 후보는 공동 미래의 설계와 표현을 분리",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "집안일 뒤 고마웠던 점을 서로 말하기"
    },
    "counterexample": "혼인이나 가족 구성을 가정하지 않고 동의한 공동생활에만 적용",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:parenting:01",
    "type": "INTJ",
    "domain": "parenting",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/parenting/0",
        "traitId": "teach_how_to_think",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "38b2c051e64e616cff592260ce07e91c78ab1618a630ec2e53416eff70002740"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/parenting/3",
        "traitId": "knowledge_centered_support",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "9d27afd1f51f836a71c15a156be06f04efff16ccd2c614e43103ef73bf63239e"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "답보다 생각 과정 듣기",
    "positiveExpression": "스스로 설명할 기회",
    "cautionExpression": "정답 유도가 탐색을 닫음",
    "behaviorCandidate": "아이의 가설을 먼저 말하게 하기",
    "environmentCondition": "아이를 돌보는 역할이라면",
    "unexpectedFacet": "알려주는 것을 멈추는 것도 지원일 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/parenting/0",
          "traitId": "open_patient_parent",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26f3c3df00681d73ec1dea036d0c833fa3bda5030702c71ad9f221bd96c0f239"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/parenting/2",
          "traitId": "parent_needs_alone_time",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26da6ee85eea215fbc6911c96d1318630d27a288ae37123b117c2495a682b150"
        }
      ],
      "interpretation": "INTP의 질문 답하기와 공유되며 여기서는 아이가 자기 판단을 구성하도록 돕는 조건을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "왜 그렇다고 생각했는지 묻고 기다리기"
    },
    "counterexample": "자녀 존재나 아이의 유형을 가정하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 돌봄 역할 또는 관찰된 아이 행동이 있을 때만 적용한다. 자녀 존재·아이 유형·성인 사용자의 어린 시절을 추정하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:parenting:02",
    "type": "INTJ",
    "domain": "parenting",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/parenting/0",
        "traitId": "teach_how_to_think",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "38b2c051e64e616cff592260ce07e91c78ab1618a630ec2e53416eff70002740"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/parenting/3",
        "traitId": "knowledge_centered_support",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "9d27afd1f51f836a71c15a156be06f04efff16ccd2c614e43103ef73bf63239e"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "자료 제공의 적정량",
    "positiveExpression": "지원이 자율성 보조",
    "cautionExpression": "자료가 부담으로 누적",
    "behaviorCandidate": "필요한 도움의 범위를 먼저 확인",
    "environmentCondition": "도움을 요청받았다면",
    "unexpectedFacet": "알려주는 것을 멈추는 것도 지원일 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/parenting/0",
          "traitId": "open_patient_parent",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26f3c3df00681d73ec1dea036d0c833fa3bda5030702c71ad9f221bd96c0f239"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/parenting/2",
          "traitId": "parent_needs_alone_time",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26da6ee85eea215fbc6911c96d1318630d27a288ae37123b117c2495a682b150"
        }
      ],
      "interpretation": "INTP의 질문 답하기와 공유되며 여기서는 아이가 자기 판단을 구성하도록 돕는 조건을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "책 여러 권 대신 지금 필요한 한 자료 선택"
    },
    "counterexample": "자녀 존재나 아이의 유형을 가정하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 돌봄 역할 또는 관찰된 아이 행동이 있을 때만 적용한다. 자녀 존재·아이 유형·성인 사용자의 어린 시절을 추정하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:child:01",
    "type": "INTJ",
    "domain": "child",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/child/1",
        "traitId": "rule_questioning_child",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "cc5f2befce0f5ef0f860269ed9b727c1cb40b93f976aeb33aaea13e2e4f1ccbc"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/child/3",
        "traitId": "single_field_mastery",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3f513344752c9c4b3e212c7720493eda232e308b1b67207cb11e621b7e47cd10"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "규칙 질문의 뜻 확인",
    "positiveExpression": "질문을 안전하게 다룸",
    "cautionExpression": "질문만으로 불복종 판단",
    "behaviorCandidate": "반항인지 이해 요청인지 직접 묻기",
    "environmentCondition": "관찰된 아이가 이유를 묻는다면",
    "unexpectedFacet": "깊은 관심이 다른 영역의 우수함을 뜻하지 않음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/child/0",
          "traitId": "knowledge_rich_but_uneven_child",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "c4890cbc32d00ef2e74307c72c94839aaee59c2fcd96b0157dfef74e57f77805"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/child/4",
          "traitId": "misread_as_disorder_risk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "c0ced45daa25388e9ccd255a04e0b6464bfee17cf6e846c8451daa743a775495"
        }
      ],
      "interpretation": "INTP의 관심사 편차와 겹치며 이 후보는 스스로 세운 결론과 활동 경계의 관찰에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "정리 규칙의 목적을 설명하고 다른 방법 듣기"
    },
    "counterexample": "성인 유형에서 어린 시절이나 자녀 성격을 역추론하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 돌봄 역할 또는 관찰된 아이 행동이 있을 때만 적용한다. 자녀 존재·아이 유형·성인 사용자의 어린 시절을 추정하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:child:02",
    "type": "INTJ",
    "domain": "child",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/child/1",
        "traitId": "rule_questioning_child",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "cc5f2befce0f5ef0f860269ed9b727c1cb40b93f976aeb33aaea13e2e4f1ccbc"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/child/3",
        "traitId": "single_field_mastery",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3f513344752c9c4b3e212c7720493eda232e308b1b67207cb11e621b7e47cd10"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "몰입과 생활의 연결",
    "positiveExpression": "몰입과 생활을 연결",
    "cautionExpression": "모든 활동을 경쟁 목표로 만듦",
    "behaviorCandidate": "중단 예고와 다음 시작 시간을 합의",
    "environmentCondition": "한 활동을 오래 한다면",
    "unexpectedFacet": "깊은 관심이 다른 영역의 우수함을 뜻하지 않음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/child/0",
          "traitId": "knowledge_rich_but_uneven_child",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "c4890cbc32d00ef2e74307c72c94839aaee59c2fcd96b0157dfef74e57f77805"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/child/4",
          "traitId": "misread_as_disorder_risk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "c0ced45daa25388e9ccd255a04e0b6464bfee17cf6e846c8451daa743a775495"
        }
      ],
      "interpretation": "INTP의 관심사 편차와 겹치며 이 후보는 스스로 세운 결론과 활동 경계의 관찰에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "조립 활동 종료 전에 보관 방법 정하기"
    },
    "counterexample": "성인 유형에서 어린 시절이나 자녀 성격을 역추론하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다. 실제 돌봄 역할 또는 관찰된 아이 행동이 있을 때만 적용한다. 자녀 존재·아이 유형·성인 사용자의 어린 시절을 추정하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:relationships:01",
    "type": "INTJ",
    "domain": "relationships",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/0",
        "traitId": "selective_friendship",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "5e5de3fe3528494dbc2767a0629148bd8782bda4a4dfb80661cc42342740138a"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/3",
        "traitId": "line_crossing_memory",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "f90571ab49d987c7e1047c548cb9b958c78adb4c3d07678b8a03847bd99526e5"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "선별과 접근 가능성",
    "positiveExpression": "거리와 배려를 함께 전달",
    "cautionExpression": "침묵이 거절로 해석",
    "behaviorCandidate": "연락 가능한 방식을 알려주기",
    "environmentCondition": "소수 관계를 선호한다면",
    "unexpectedFacet": "적은 교류와 낮은 애정은 같은 뜻이 아님",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/relationships/0",
          "traitId": "low_need_for_human_ties",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "f629f48fa5791411b7252b5b584b26277126eff16094a875bf68f0db916b3046"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/relationships/3",
          "traitId": "quiet_cutoff_pattern",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "e69bd3efe108009124b13977348ea1e0d9ff2ab428355235da204ff552b87bf8"
        }
      ],
      "interpretation": "INTP의 조용한 거리두기와 공유되나 이 후보는 신뢰 기준의 재합의에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "친구에게 답하기 편한 연락 시간을 설명"
    },
    "counterexample": "침해나 갈등이 실제 있었다고 단정하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:relationships:02",
    "type": "INTJ",
    "domain": "relationships",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/0",
        "traitId": "selective_friendship",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "5e5de3fe3528494dbc2767a0629148bd8782bda4a4dfb80661cc42342740138a"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/3",
        "traitId": "line_crossing_memory",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "f90571ab49d987c7e1047c548cb9b958c78adb4c3d07678b8a03847bd99526e5"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "경계 침해와 회복 조건",
    "positiveExpression": "상대가 수정할 단서 확보",
    "cautionExpression": "오래 기억하며 설명 생략",
    "behaviorCandidate": "중단 요청과 회복 가능 조건 구분",
    "environmentCondition": "불편한 행동이 있었다면",
    "unexpectedFacet": "적은 교류와 낮은 애정은 같은 뜻이 아님",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/relationships/0",
          "traitId": "low_need_for_human_ties",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "f629f48fa5791411b7252b5b584b26277126eff16094a875bf68f0db916b3046"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/relationships/3",
          "traitId": "quiet_cutoff_pattern",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "e69bd3efe108009124b13977348ea1e0d9ff2ab428355235da204ff552b87bf8"
        }
      ],
      "interpretation": "INTP의 조용한 거리두기와 공유되나 이 후보는 신뢰 기준의 재합의에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "약속 변경이 불편했던 이유와 요청 전달"
    },
    "counterexample": "침해나 갈등이 실제 있었다고 단정하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:communication:01",
    "type": "INTJ",
    "domain": "communication",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/0",
        "traitId": "blunt_fact_delivery",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "de0d58fbdb68bc4a9cf09c634eb49adf09f4e3ebec3fe6b0105e5c6bb25ffc68"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/3",
        "traitId": "abstract_conversation_preference",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3663abb5b6bf533dad86f8ac8a43283859abfdb81fccb8416b0e2675f28235fc"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "정확성과 수신 준비",
    "positiveExpression": "내용을 들을 여유 확보",
    "cautionExpression": "맞는 말이 평가로 전달",
    "behaviorCandidate": "지금 피드백을 원하는지 확인",
    "environmentCondition": "문제를 지적하려 할 때",
    "unexpectedFacet": "짧은 잡담이 본론의 안전감을 만들 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/communication/0",
          "traitId": "direct_everyday_speech",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "36b08e13d5cabc4d9845ccd0034921c67843665f15f1c14290bf005bfea97a0e"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/communication/4",
          "traitId": "topic_triggered_talk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26d31a88aca37456da9fd636b13a304fca97d455fd0e6d859cb72369b30b8e7c"
        }
      ],
      "interpretation": "INTP의 관심사 발화와 겹치며 이 후보는 큰 구조를 상대의 상황으로 번역하는 문제를 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "수정 제안 전에 목적과 요청 범위 말하기"
    },
    "counterexample": "직설성이 정확성이나 상대의 이해를 보장하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:communication:02",
    "type": "INTJ",
    "domain": "communication",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/0",
        "traitId": "blunt_fact_delivery",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "de0d58fbdb68bc4a9cf09c634eb49adf09f4e3ebec3fe6b0105e5c6bb25ffc68"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/3",
        "traitId": "abstract_conversation_preference",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "3663abb5b6bf533dad86f8ac8a43283859abfdb81fccb8416b0e2675f28235fc"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "추상 설명의 착지점",
    "positiveExpression": "상대가 적용점을 찾음",
    "cautionExpression": "큰 논의가 질문을 덮음",
    "behaviorCandidate": "실제 선택 하나에 연결하기",
    "environmentCondition": "원리 설명이 길어질 때",
    "unexpectedFacet": "짧은 잡담이 본론의 안전감을 만들 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/communication/0",
          "traitId": "direct_everyday_speech",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "36b08e13d5cabc4d9845ccd0034921c67843665f15f1c14290bf005bfea97a0e"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/communication/4",
          "traitId": "topic_triggered_talk",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "26d31a88aca37456da9fd636b13a304fca97d455fd0e6d859cb72369b30b8e7c"
        }
      ],
      "interpretation": "INTP의 관심사 발화와 겹치며 이 후보는 큰 구조를 상대의 상황으로 번역하는 문제를 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "원칙 뒤 오늘 바꿀 행동을 한 가지 제시"
    },
    "counterexample": "직설성이 정확성이나 상대의 이해를 보장하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:strengths:01",
    "type": "INTJ",
    "domain": "strengths",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/strengths/0",
        "traitId": "rational_under_pressure",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "6dade002dbe223c27f2c6ada4cc060d5da72ed8bbddd48dd95b60622eb29bd1c"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/strengths/3",
        "traitId": "original_innovation",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "eda70b5366eec30205101b4eaf366def302f7d65de48d36966e736e22255c823"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "침착함의 정보 수집",
    "positiveExpression": "성급한 결론을 줄임",
    "cautionExpression": "차분함을 무오류로 착각",
    "behaviorCandidate": "기준과 아직 모르는 사실 분리",
    "environmentCondition": "복잡한 문제가 생겼다면",
    "unexpectedFacet": "기존 방법을 유지하는 선택도 분석 결과일 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/strengths/0",
          "traitId": "creative_intelligence",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "7366c09262efe81c39f7f2121bf5f70adeec9391f3b3194df98514696e64dc88"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/strengths/3",
          "traitId": "long_game_thinking",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "65c2052a2dba139f963f30f4dcef2dba6cf19e4e4ca56126518ed233c036150d"
        }
      ],
      "interpretation": "INTP의 열린 모델 수정과 공유되며 여기서는 개선안의 운영 검증을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "업무 장애에서 확인된 사실 목록 작성"
    },
    "counterexample": "강점 후보는 실제 수행 능력의 증명이 아님",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:strengths:02",
    "type": "INTJ",
    "domain": "strengths",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/strengths/0",
        "traitId": "rational_under_pressure",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "6dade002dbe223c27f2c6ada4cc060d5da72ed8bbddd48dd95b60622eb29bd1c"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/strengths/3",
        "traitId": "original_innovation",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "eda70b5366eec30205101b4eaf366def302f7d65de48d36966e736e22255c823"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "개선안의 작은 검증",
    "positiveExpression": "아이디어의 제약을 발견",
    "cautionExpression": "새로움 자체를 개선으로 봄",
    "behaviorCandidate": "일부 범위에서 반응을 확인",
    "environmentCondition": "새 방식을 제안할 때",
    "unexpectedFacet": "기존 방법을 유지하는 선택도 분석 결과일 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/strengths/0",
          "traitId": "creative_intelligence",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "7366c09262efe81c39f7f2121bf5f70adeec9391f3b3194df98514696e64dc88"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/strengths/3",
          "traitId": "long_game_thinking",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "65c2052a2dba139f963f30f4dcef2dba6cf19e4e4ca56126518ed233c036150d"
        }
      ],
      "interpretation": "INTP의 열린 모델 수정과 공유되며 여기서는 개선안의 운영 검증을 비교",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "문서 양식 하나만 바꿔 사용 의견 수집"
    },
    "counterexample": "강점 후보는 실제 수행 능력의 증명이 아님",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:risks:01",
    "type": "INTJ",
    "domain": "risks",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/risks/0",
        "traitId": "arrogance_risk",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "803a1d54dfdfc2ef51c49b91f04510f07cd5bbb658ce6d81ff6a50d4f5db5d1d"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/risks/4",
        "traitId": "sensory_reality_neglect",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "77fa2fcbf63e844872330edefeb9f219ea3f7640410d0380e822e994e1041faa"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "발언자와 근거의 분리",
    "positiveExpression": "출처 편향을 점검",
    "cautionExpression": "사람을 능력 순위로 고정",
    "behaviorCandidate": "제안의 근거만 익명으로 검토",
    "environmentCondition": "사람에 대한 평가가 강해질 때",
    "unexpectedFacet": "논리적 자기상도 확인 편향을 가릴 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/risks/0",
          "traitId": "chronic_laziness",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "9c0133a95443786c6e2cba8986cd207739d6f7efb64daec9cdf0e97cf7bbf23d"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/risks/5",
          "traitId": "low_physical_action",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "6e6ab18c2eb197e4558bad12995f512fa90e35088a4526245df8a33a283e2005"
        }
      ],
      "interpretation": "INTP의 적용 지연과 겹치나 이 후보는 확신한 설계가 반대 정보와 현장을 가리는 조건을 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "반대 의견의 근거를 먼저 재진술"
    },
    "counterexample": "무례함이나 피로를 유형의 필연으로 진단하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:risks:02",
    "type": "INTJ",
    "domain": "risks",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/risks/0",
        "traitId": "arrogance_risk",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "803a1d54dfdfc2ef51c49b91f04510f07cd5bbb658ce6d81ff6a50d4f5db5d1d"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/risks/4",
        "traitId": "sensory_reality_neglect",
        "sourceCoverage": "inferred",
        "sourceMeaningSha256": "77fa2fcbf63e844872330edefeb9f219ea3f7640410d0380e822e994e1041faa"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "계획 밖 몸과 현장",
    "positiveExpression": "설계의 사각지대 발견",
    "cautionExpression": "피로를 의지 부족으로 취급",
    "behaviorCandidate": "현장 관찰과 휴식 필요 확인",
    "environmentCondition": "계획에 오래 몰입했다면",
    "unexpectedFacet": "논리적 자기상도 확인 편향을 가릴 수 있음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/risks/0",
          "traitId": "chronic_laziness",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "9c0133a95443786c6e2cba8986cd207739d6f7efb64daec9cdf0e97cf7bbf23d"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/risks/5",
          "traitId": "low_physical_action",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "6e6ab18c2eb197e4558bad12995f512fa90e35088a4526245df8a33a283e2005"
        }
      ],
      "interpretation": "INTP의 적용 지연과 겹치나 이 후보는 확신한 설계가 반대 정보와 현장을 가리는 조건을 다룸",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "화면 작업 뒤 현장 사용자 의견 듣기"
    },
    "counterexample": "무례함이나 피로를 유형의 필연으로 진단하지 않음",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:growth:01",
    "type": "INTJ",
    "domain": "growth",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/growth/0",
        "traitId": "sequence_feedback_softly",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "2b439b2ea402aa31af8894d2d6e4aefad7de0fb8bc251adf6eb66d05e9a1ac0e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/growth/3",
        "traitId": "build_social_translation",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7dc9afed8e443fa03f5b73f34d09fc6732d228c4013816a0533b92f83aae241e"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "피드백 내용과 순서 분리",
    "positiveExpression": "내용을 수용할 선택권",
    "cautionExpression": "부드러운 말로 통제만 유지",
    "behaviorCandidate": "목표 확인 뒤 한 가지 수정 제안",
    "environmentCondition": "조언을 요청받았다면",
    "unexpectedFacet": "말투를 바꿔도 기준을 버릴 필요는 없음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/growth/0",
          "traitId": "find_meaningful_motive",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "147704843a670da3d2089c3623a5d168f35e47a115d1a9492e2f11643187f96c"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/growth/3",
          "traitId": "close_the_loop",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "bbc38cd3df71e06d04096236bd138a49b45f06827b54949d856f35e0e6f2e847"
        }
      ],
      "interpretation": "INTP의 결과물로 닫기와 공유되지만 이 후보는 상대에게 전달되는 형식의 검증에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "고칠 점 전에 상대가 원하는 결과 질문"
    },
    "counterexample": "다른 방식이 더 편하면 이 제안을 채택하지 않아도 됨",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  },
  {
    "id": "mkr:INTJ:growth:02",
    "type": "INTJ",
    "domain": "growth",
    "basis": [
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/growth/0",
        "traitId": "sequence_feedback_softly",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "2b439b2ea402aa31af8894d2d6e4aefad7de0fb8bc251adf6eb66d05e9a1ac0e"
      },
      {
        "type": "INTJ",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/growth/3",
        "traitId": "build_social_translation",
        "sourceCoverage": "direct",
        "sourceMeaningSha256": "7dc9afed8e443fa03f5b73f34d09fc6732d228c4013816a0533b92f83aae241e"
      }
    ],
    "provenance": "new_conditional_research",
    "coreMeaning": "소통 형식의 실험",
    "positiveExpression": "전달 방식의 적합성 확인",
    "cautionExpression": "상대에게 이해 책임 전가",
    "behaviorCandidate": "같은 내용을 예시와 문서로 비교",
    "environmentCondition": "설명이 잘 전달되지 않는다면",
    "unexpectedFacet": "말투를 바꿔도 기준을 버릴 필요는 없음",
    "similarTypeContrast": {
      "type": "INTP",
      "basis": [
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/growth/0",
          "traitId": "find_meaningful_motive",
          "sourceCoverage": "direct",
          "sourceMeaningSha256": "147704843a670da3d2089c3623a5d168f35e47a115d1a9492e2f11643187f96c"
        },
        {
          "type": "INTP",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/growth/3",
          "traitId": "close_the_loop",
          "sourceCoverage": "inferred",
          "sourceMeaningSha256": "bbc38cd3df71e06d04096236bd138a49b45f06827b54949d856f35e0e6f2e847"
        }
      ],
      "interpretation": "INTP의 결과물로 닫기와 공유되지만 이 후보는 상대에게 전달되는 형식의 검증에 초점",
      "status": "source_comparison_hypothesis_not_exclusive"
    },
    "fictionalExample": {
      "kind": "fictional_not_user_history",
      "text": "원리 설명과 실제 예시 중 편한 방식 묻기"
    },
    "counterexample": "다른 방식이 더 편하면 이 제안을 채택하지 않아도 됨",
    "applicationGate": "원천 단서가 본인에게 실제로 맞는지 먼저 질문한다. 맞지 않거나 환경·경험 설명이 더 적절하면 적용하지 않는다. 유형의 고유·필연 행동이나 결과로 사용하지 않는다.",
    "sourceRefs": [
      "user-source:INTJ",
      "user-source:INTP",
      "mbf:ethics",
      "mbf:results"
    ],
    "verification": "editorial_reviewed_not_empirically_verified",
    "approvedForCustomer": false,
    "connectedToRuntime": false
  }
] as const satisfies readonly MbtiResearchMaterial[];
