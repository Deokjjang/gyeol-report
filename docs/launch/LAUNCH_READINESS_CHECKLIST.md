# 결리포트 Launch Readiness Checklist

## 1. 현재 완료 상태

- [x] `pnpm release:check` 통과 상태를 확인했다.
- [x] 29개 테스트 파일, 350개 테스트가 통과한다.
- [x] `/report/new` 리포트 미리보기 화면이 존재한다.
- [x] `/api/reports/create` 리포트 생성 API가 존재한다.
- [x] 일주 프로필, 십성, 구조 분석, 신살, 활용 가이드가 포함된 deterministic 리포트 출력이 존재한다.
- [x] 리포트 화면과 생성 흐름에 대한 source-level UI 테스트가 존재한다.
- [x] safety copy audit을 진행했고, 주요 안내 문구를 자기이해용 참고 콘텐츠 기준으로 정리했다.

## 2. 출시 전 필수 완료

- [ ] real deployment URL 접속과 라우팅을 확인한다.
- [ ] mobile viewport에서 홈, 리포트 생성, 리포트 결과 화면을 확인한다.
- [ ] report generation manual smoke를 유효 입력과 오류 입력으로 각각 수행한다.
- [ ] 결제 기능은 비활성 상태이거나 sandbox 상태가 화면에서 명확히 구분되어야 한다.
- [ ] customer support contact가 사용자가 찾기 쉬운 위치에 보여야 한다.
- [ ] terms/privacy 페이지 또는 placeholder 안내가 최소한으로라도 노출되어야 한다.
- [ ] 출시 전 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm release:check`를 다시 실행한다.

## 3. 결제 전 필수 확인

- [ ] PG/provider 선택이 확정되지 않았다면 실제 결제 연결을 보류한다.
- [ ] paid unlock boundary를 정의한다: 무료 미리보기와 전체 리포트의 노출 차이를 명확히 한다.
- [ ] refund/cancel policy copy를 작성하고 사용자가 결제 전 확인할 수 있게 한다.
- [ ] order/receipt record 저장 위치와 필드 범위를 정한다.
- [ ] payment failure UX를 정의한다: 실패, 취소, 중복 요청, 네트워크 오류를 구분한다.
- [ ] policy pages가 준비되기 전에는 real payment를 받지 않는다.
- [ ] sandbox 결제와 운영 결제를 구분하는 체크리스트를 만든다.

## 4. 저장/개인정보 전 필수 확인

- [ ] birthdate, birthtime, MBTI 입력값은 민감한 자기정보로 취급한다.
- [ ] minimal retention 원칙을 적용해 필요한 기간과 목적만 정한다.
- [ ] 불필요한 raw data storage를 하지 않는지 확인한다.
- [ ] privacy copy에 수집 항목, 사용 목적, 보관 기간, 삭제 방법을 적는다.
- [ ] deletion request path를 마련한다.
- [ ] 이후 admin pages가 생기면 access control과 접근 로그를 함께 설계한다.
- [ ] 로컬 개발 데이터와 운영 데이터를 섞지 않는 절차를 만든다.

## 5. 리포트 품질 전 필수 확인

- [ ] 현재 day pillar profile은 10개만 지원한다.
- [ ] remaining 50 day pillar profiles는 아직 coverage가 없다.
- [ ] unknown birth time behavior가 사용자에게 충분히 설명되는지 확인한다.
- [ ] lunar/solar handling은 현재 지원 범위와 제한을 명확히 표시한다.
- [ ] timezone handling은 현재 `Asia/Seoul` 기준임을 화면과 검증에서 맞춘다.
- [ ] professional wording review를 진행해 과도하게 확정적인 표현을 줄인다.
- [ ] forbidden wording grep을 release 전 다시 실행한다.
- [ ] 리포트 문장이 자기이해와 선택 패턴 정리에 초점을 두는지 확인한다.

## 6. UI/UX 전 필수 확인

- [ ] mobile layout에서 입력 폼, 성공 상태, 오류 상태, 결과 카드가 자연스럽게 이어지는지 확인한다.
- [ ] long report readability를 확인한다: 십성, 신살, 활용 가이드 목록이 잘 읽혀야 한다.
- [ ] loading/error/success states가 사용자에게 차분하게 전달되는지 확인한다.
- [ ] section cards가 제목, 요약, 본문 블록을 명확히 구분하는지 확인한다.
- [ ] paid/free labels가 사용자-facing 문구로만 보이는지 확인한다.
- [ ] raw internal code exposure가 없는지 확인한다: section id, tag code, enum 값이 본문에 노출되지 않아야 한다.
- [ ] 긴 문장이 모바일에서 잘 줄바꿈되는지 확인한다.

## 7. 운영/고객지원 전 필수 확인

- [ ] support email을 정하고 홈 또는 리포트 화면에서 안내한다.
- [ ] error reporting path를 정한다: 사용자 제보, 서버 로그, 재현 정보 수집 범위를 구분한다.
- [ ] manual refund process를 운영자가 처리할 수 있는 단계로 문서화한다.
- [ ] user inquiry response template을 준비한다.
- [ ] incident checklist를 준비한다: 결제 오류, 리포트 생성 실패, 개인정보 문의, 배포 장애.
- [ ] 운영자가 확인할 수 있는 최소 로그와 사용자에게 보여줄 안내 문구를 분리한다.

## 8. 출시 차단 조건

- `pnpm release:check`가 실패한다.
- 약관, 개인정보 안내, 환불/취소 안내 없이 결제를 받는 상태다.
- 개인정보 안내 없이 출생정보나 MBTI 입력값을 저장한다.
- 사용자 화면에 raw internal error, stack trace, 내부 경로가 노출된다.
- 과도하게 확정적이거나 결정론적으로 읽히는 문구가 사용자 화면에 남아 있다.
- 유효한 입력에서 리포트 생성이 실패한다.
- 모바일 화면에서 입력 또는 결과 확인이 어려울 정도로 레이아웃이 깨진다.

## 9. 다음 개발 우선순위

1. 35A — Home CTA / terms-support link polish
2. 36A — payment/storage boundary design
3. 27E — day pillar profile coverage expansion
4. 37A — manual mobile QA checklist
5. 38A — deployment smoke checklist
