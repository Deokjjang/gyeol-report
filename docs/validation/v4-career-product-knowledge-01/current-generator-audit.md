# 기존 커리어 경로 읽기 감사

코드는 읽기 전용으로 조사했다. 아래는 변경 제안 실행이나 출시 품질 PASS가 아니다.

- 기존 자료: 17 signed facet, 8 route, 11 직무 장면 묶음. 실제 세부 단계 CAREER_JOB_STEPS는 engineering/design/sales_operations 3개다. 금융·번역·교육·행정·돌봄·현장·사업·매장 장면도 있어 기존 자료가 빈 것은 아니다.
- CH01~CH09는 고객 계약이다. K1 핵심/K2 강점/K3 적합/K4 조직/K5 돈/K6 조직/K7 위험/K8 현재/K9 추천/K10 방향이라는 내부 표현을 일대일 번호로 맞추지 않는다. selectCareerProductSources는 K1~K7을 중심으로 후보를 배정하고, 현재 맥락·legacy 추천·operating은 별도 경로다.
- 후보 선택은 primaryEligible, invalidReasons, 명시 sourceDomain, 원국 signed axis와 의미 있는 atom을 확인한다. release 일반 풀은 fortune·GUIDANCE·FUSION·CORE_GYEOL·AMPLIFIER를 제외한다. Fusion과 긍정 특징은 별도 문단 경로를 사용한다.
- facet당 4 사용, 같은 장 facet 중복, priority/root 사용 횟수 정렬 때문에 자료가 많아도 선택은 제한된다. 이번 신규 DB는 이 예산에 영향을 주지 않는다.
- 실제 add는 공백 문장을 거른 뒤 3~5개의 한 문장 조각과 동일 문장 차단을 적용한다. 부족하면 문단을 추가하지 않을 수 있다. 다섯 역할 이상을 새로 만들지 않았고 원래 네 역할도 변경하지 않았다.
- 상세 장면이 없는 직무는 기존 일반 facet 장면·경제 응용을 사용한다. 업무 기능은 사주·MBTI의 능력 사실이 아니라 context다. 사진가 직접 분류는 없으며 신규 사진 원천·장면이 생성기에 연결되지 않았다.
- study는 실제 MBTI study bridge와 risk를 확인하고 미상은 기존 natal 경로를 쓴다. 명리 상징·수료·실력·채용은 다른 사실이다.
- hardErrors와 qualityIssues는 별도다. 분량과 문단 수의 품질 진단만으로 새 발행 Gate나 자동 fallback을 만들지 않는다. release hardErrors가 없고 opening 및 current/money/roles/study/direction이 모두 있으면 release, 아니면 기존 narrative를 선택한다.
- 실제 A~T 24변형에서는 모두 release·9장36문단, hardErrors/qualityIssues/shortages 0이었다. 이것은 그 입력의 관찰이며 모든 입력에서 부족·fallback이 없다는 보증은 아니다.
- 특정 facet·8 route의 통계적 편중은 전 고객 모집단을 측정하지 않았으므로 UNVERIFIED다. 코드상 예산과 선택 조건만 확인했다. 새 의미와 source evidence가 연결되지 않았으므로 새 자료의 판매 원고 효과도 미검증이다.

실제 생성 관찰은 actual-career-context-observations.json, 후속 제한은 binding-handoff.md에 있다.


## 상세 사진 비교

동일 원국·ISFP·freelancer에서 상품 사진가와 인물 사진가는 최종 function이 모두 unknown이고, 실제 생성 원고의 34/36문단이 같았다. 글자 수는 양쪽9,588자다. 이는 기존 세부 직무 분류 공백의 재현이며 이번 신규 자료가 아직 원고를 바꾸지 않았다는 관찰이다. 모집단 중복률이나 다른 고객 전체의 품질 판정으로 확대하지 않는다.
