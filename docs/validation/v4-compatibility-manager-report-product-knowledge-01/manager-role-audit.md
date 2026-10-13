# 고정 역할과 실제 권한

기준 SHA 4f39cfaf339ca030069a44f240ed774cd77b4969. 신규 자료는 A=상사, B=부하·팀원, compatibility-fixed-ab-v1을 요구한다. src/lib/report-generation/reportInputTypes.ts의 라벨을 그대로 사용한다. 이 선언은 실제 조직 직급·고용관계·인사·해고·보수·평가·승인권 검증이 아니다. 모두 UNKNOWN이며 해당 지시·지원·결정이 필요한 적용 시 실제 담당·권한을 별도 확인한다.

레거시 categoryRole.kind=role-asymmetric, assignments A/B=null이다. 레거시 관계명이나 단순 A/B 순서로 역할을 채우지 않는다. 정상화는 버전 누락을 허용하지만 V4 생성은 고정 역할 버전 누락을 거부한다. Q 누락은 V4_COMPATIBILITY_GENERATION_FAILED 내부에 V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED 경로, R 오기입은 INVALID_COMPATIBILITY_ROLE_VERSION이다. role normalization·기존 copy·저장본을 수정하지 않았다.

S 전체 교환은 다른 관리 역할 선언이다. 개별 원국·MBTI·Fusion digest는 역전되며 실제 receivedTenGod도 반대 방향과 맞아야 한다. 같은 조직 관계를 그대로 유지한 교환으로 주장하지 않는다. T 이름만 교환은 개별 계산·Fusion을 바꾸지 않지만 이름 기반 person ID가 달라질 수 있다. P/U 정상 버전은 실제 라벨을 검증한다. 과거 roleless Book은 기존 저장본 열람 계약을 보존하며 역할 추가·재발행하지 않는다.
