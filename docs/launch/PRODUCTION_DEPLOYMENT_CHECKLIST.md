# 결리포트 Production Deployment Checklist

## 1. 목적

이 문서는 production 배포 전 확인해야 할 gate를 정의한다.

- pre-production deployment gate를 명확히 한다.
- payment, storage, support 경계가 준비되지 않은 상태로 launch되는 일을 막는다.
- 배포 전/후 확인 항목과 rollback 기준을 한 곳에서 관리한다.
- 이 문서는 배포 완료나 법률/결제 검토 완료를 의미하지 않는다.

## 2. 현재 배포 전제

- app은 pre-launch 상태다.
- real payment는 활성화되어 있지 않다.
- `/terms`, `/privacy`, `/refund` policy pages는 placeholder다.
- `/report/new`에서 report creation preview가 동작한다.
- persistence/payment adapters는 provider-neutral foundation이며 production DB/payment 구현이 아니다.
- paid/free gating skeleton은 존재하지만 실제 결제 unlock과 연결되어 있지 않다.

## 3. 배포 전 필수 확인

- [ ] domain이 연결되어 있다.
- [ ] app이 성공적으로 build된다.
- [ ] `/`, `/report/new`, `/terms`, `/privacy`, `/refund`가 접근 가능하다.
- [ ] support email이 화면에서 확인 가능하다.
- [ ] real payment CTA가 활성 구매처럼 오해되지 않는다.
- [ ] mobile layout을 확인했다.
- [ ] 정책 페이지가 placeholder임을 명확히 표시한다.
- [ ] 배포 대상 branch와 commit을 기록한다.

## 4. 환경 변수 및 비밀값

- secret hardcoding이 없어야 한다.
- production과 development 환경은 분리한다.
- 향후 payment/provider secrets는 platform environment variables로만 관리한다.
- card details는 앱에서 저장하지 않는다.
- `.env` 파일은 저장소에 포함하지 않는다.
- 로그에 secret, token, provider credential이 남지 않도록 확인한다.

## 5. 빌드/테스트 게이트

배포 전 다음 명령을 실행한다.

```bash
pnpm test
pnpm lint
pnpm build
pnpm release:check
```

하나라도 실패하면 배포를 진행하지 않는다.

## 6. 정책 페이지 확인

- [ ] `/terms` 페이지가 보인다.
- [ ] `/privacy` 페이지가 보인다.
- [ ] `/refund` 페이지가 보인다.
- [ ] placeholder notice가 유지되어 있다.
- [ ] paid launch 전 final legal/payment review가 필요함을 팀 내부에서 확인한다.
- [ ] support contact가 각 정책 페이지에서 확인 가능하다.

## 7. 결제 비활성 상태 확인

- real payment provider가 활성화되어 있지 않다.
- 의도적으로 생성하기 전에는 payment API route가 활성화되어 있지 않아야 한다.
- provider가 준비되기 전 paid unlock이 real purchase처럼 보이지 않아야 한다.
- provider-neutral payment types/adapters는 internal foundation으로만 둔다.
- dev preview와 production paid state가 사용자에게 혼동되지 않게 표시한다.

## 8. 리포트 생성/미리보기 QA

- [ ] known input으로 report preview를 생성한다.
- [ ] unknown birth time path를 확인한다.
- [ ] MBTI 선택 흐름을 확인한다.
- [ ] validation error path를 확인한다.
- [ ] loading/error/success copy를 확인한다.
- [ ] preview gating message를 확인한다.
- [ ] 긴 report section이 모바일에서 잘 읽히는지 확인한다.
- [ ] raw internal code나 stack trace가 화면에 노출되지 않는지 확인한다.

## 9. 개인정보/저장소 경계

- raw payment card data는 저장하지 않는다.
- birth input은 report generation을 위해 사용한다.
- retention/deletion policy는 아직 final copy 전 단계임을 표시한다.
- production persistence provider는 별도 task에서 선택하기 전까지 미선택 상태로 둔다.
- 운영 저장소가 붙기 전에는 저장 여부와 보관 범위를 사용자에게 과도하게 약속하지 않는다.

## 10. 운영 연락/지원 경계

- support email은 `official@dvem.ai`를 사용한다.
- paid launch 전 payment/report failure support path가 명확해야 한다.
- pre-launch 단계에서는 manual support가 가능하다.
- 고객 문의 대응 문구와 내부 재현 정보 수집 범위를 분리한다.
- 사용자에게 내부 오류 세부 정보를 그대로 전달하지 않는다.

## 11. 롤백 기준

다음 상황에서는 rollback 또는 배포 중단을 검토한다.

- build 또는 runtime error가 발생한다.
- report creation flow가 깨진다.
- policy routes가 접근되지 않는다.
- payment/purchase copy가 실제 구매 가능 상태처럼 오해될 수 있다.
- privacy/storage boundary가 기존 설계와 어긋난다.
- 주요 모바일 화면에서 입력 또는 리포트 확인이 어렵다.

## 12. 배포 후 확인

- deployed site를 연다.
- `/`, `/report/new`, `/terms`, `/privacy`, `/refund`를 확인한다.
- report preview를 1회 생성한다.
- mobile viewport를 확인한다.
- console/runtime errors를 확인한다.
- support contact가 보이는지 확인한다.
- 결제 비활성 안내가 현재 상태와 맞는지 확인한다.

## 13. 남은 결정 사항

- production hosting choice/config
- production DB/storage provider
- final payment provider
- final policy copy
- pricing
- refund/customer support process
- paid/free gating production mode
- report retention/deletion operation

## 14. 다음 개발 Task 제안

1. 42B — deployment checklist source/doc test
2. 43A — manual QA checklist
3. 44A — production copy audit
4. 45A — payment inactive UI guard
5. 46A — persistence provider decision
