# 실제 검증 결과

- 관련14파일: **1,018 PASS / 기존3 FAIL / 신규 회귀0 / skip0**.
- 신규 DB·A–V: **198/198 PASS** (registry186 + scenarios12).
- 기존 foundation/completion/deep/composite/relation: **581/581 PASS** (12+69+131+217+152).
- 기존 customerDayun:30/30, 실제 절입/월운72/72, 월관계18/18, 대운 상호작용19/19.
- 6상품64사례 전부 기대 결과 일치. 이 중 미상 대운 입력의 기존 거절2사례를 포함한다. 성공62사례의 계산·근거·원고·Book·snapshot hash가 고정 lock과 같다. 과거6권 fixture의 owner/shared 재열람도 동일하며 저장본을 재생성·변환하지 않는다.
- TypeScript: 기준0 / 변경후0. `npx tsc --noEmit --incremental false`.
- lint: exit0. Production build: exit0, Next16.2.4 webpack, 정적47/47, NFT/새 경고0.
- diff-check: PASS. 기존961개 src 바이트 불변, runtime import0.
- 기존16worktree의 HEAD·branch·status·tracked/untracked SHA256 불변. 신규worktree 포함17개.

## 기준 SHA에서 확인한 실패

`foundationAdapter.test.ts:116`: 기준19PASS/1FAIL. careerReleaseMaterials.ts의 foundation참조를 허용하지 않는 기존 assertion. 수정·삭제·skip하지 않았다.

`customerDayunGeneration.test.ts:50`의 major_fortune·annual_fortune 주문 bypass 테스트2건: 별도 `git archive 3117327...` 임시 디렉터리에서 동일17PASS/2FAIL을 재현했다. 테스트는 `https://example.test`로 공식 Origin 없이 요청한다. 기존 `payment-checkout/prepare/route.ts:319`와 `account/origin.ts`의 same-origin 가드는 빈403을 반환하며 테스트의 `r.clone().json()`이 `Unexpected end of JSON input`으로 실패한다. 원래의 정상 보안 거절과 오래된 요청 fixture의 불일치이며 운영 결제 오류로 단정하지 않는다. 이번 연구 DB 범위에서 테스트·인증·결제·Origin 정책을 수정하지 않았다.

위 세 실패의 이름과 첫 오류 메시지가 기준/변경후 동일함을 스크립트로 대조했다. 관련 집합의 성공을 전체 저장소 테스트 성공으로 확대하지 않는다.

## 실행

관련14파일 목록·개별 test 이름·상태·시간은 test-results.json에 원래 실행 JSON을 정규화해 보존했다. Production build와 lint 실제 로그는 build.log/lint.log다(행 끝 공백과 끝 빈 줄만 정규화; 원시 로그는 /tmp에 보존). 원시 실행 결과는 `/tmp/gyeol-saju-temporal-validation/related-tests.json`, 기준 실행은 baseline-tests.json/baseline-dayun-tests.json에 있다.

`OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack`

빌드는 fonts.googleapis.com의 기존 폰트 다운로드에 필요한 네트워크만 허용했다. 외부 원고 API·Production DB·결제·환불·배포는 실행하지 않았다. 기존 writer-enabled 테스트는 자체 mock transport를 사용하며 네트워크 guard가 실제 provider 호출을 차단한다.
