# P01 진행 기록 — 만세력·Phase 0 독립 검증과 릴리스 준비

작업 위치: `~/Developer/gyeol-worktrees/v5-manseryeok-lmt` (브랜치 `v5/manseryeok-merge`)
재개 방법: 아래 체크리스트에서 마지막 [x] 다음부터 진행한다.

## 0. 원칙 확인 (2026-10-28)
- [x] worktree 목록·브랜치·HEAD·status 확인
  - 메인 저장소: `v4/annual-editorial-quality-fix-01` @9af380b1, 미커밋 `.gitignore AGENTS.md CLAUDE.md docs/audit-step0.md docs/claude-md-proposal.md supabase/.temp/` → 건드리지 않음
  - 작업 worktree: `v5/manseryeok-merge` @3e53c123, 미추적 `docs/audit-step0.md` → 건드리지 않음
  - 로컬 `master`(5f71a7d0)는 origin/master보다 200커밋 뒤. 기준은 `origin/master`

## 1. 대상 확인
- [x] SHA: phase0 `463c4f8e`, merge `3e53c123`, origin/master `84826020`
- [x] origin/master ⊂ phase0(+1), phase0 ⊂ merge(+10). 둘 다 fast-forward 가능
- [x] origin에 phase0는 push됨, merge는 미push
- [x] 정책값(`src/lib/saju/calcPolicy.ts`): 127.5°E(−30분), `ziHourRule: "unified"`, `equationOfTime: false`, IANA `Asia/Seoul`(Intl longOffset, 하드코딩 없음, `solarTime.ts`) → 예상과 일치

## 2. 독립 오라클 (커밋 12f8952b)
- [x] a) 시각 변환: Intl formatToParts(Node ICU 78.3, tz 2026a). 1954-03-21/1961-08-10/1987·88 서머타임 경계를 역사 기록으로 자체 검증
- [x] b) 일주 JDN: 2000-01-01 戊午, 1949-10-01 甲子, 2024-02-04 戊戌 세 앵커 일치
- [x] c) 시주 unified/split
- [x] d) 년·월주: astronomy-engine 2.1.19(devDependency) 태양 황경. KASI 2024 입춘 17:27·입하 09:10 일치
- [x] 비교: 골든 32건 × 2규칙 일치, 무작위 3,000건 × 2 = 6,000 일치, 절입 2,304개 최대 55.8초
- [x] 불일치 분류: (가) 0 (나) 0 (다) 0 — 양력 경로
- [x] 추가: 음력 초하루 1,152개월 중 43개월 차이(중국식 엔진) → 엔진 한계, 고객 경로 없음. 수정 보류(보고)
- 재실행: `ORACLE_WRITE=1 pnpm exec vitest run tests/oracle`, 음력 스캔 `pnpm exec vitest run --config tests/oracle/vitest.oracle.config.ts`

## 3. 문서
- [x] golden CSV expected + other_app_settings 열(오라클 생성, 골든 테스트가 보존)
- [x] policy.md §1.4 구간 표, §1.1 음력 주의 갱신
- [x] cs-manseryeok-faq.md

## 4. 릴리스 준비
- [x] verify-books-readonly.ts (+ tests/unit/scripts/verifyBooksReadonly.test.ts)
- [x] release-phase0-manseryeok.md
- [x] publish-failure-query.sql 최종 확인(스키마 일치, [6] 추가, PGlite 로컬 실행)
- [x] tsc 0 / lint 0 / build 성공 / 테스트 신규 실패 0(부하 11 단독 PASS)
- [x] 보고서 docs/v5/p01-report.md

## 4b. 추가 지시 (2026-10-28)
- [x] 운영 버전 조합 9종 회귀 테스트(Phase 0 36/36, Release 2 36/36, 84826020 대조 27/36)
- [x] verify-books-readonly.ts → 공개 페이지 점검(공유 URL 없음)
- [x] 런북: 공유 URL 3개 항목 제거, 음력 미개방·백로그 B1
- 임시 worktree `~/Developer/gyeol-worktrees/p01-phase0-check`(detached 84826020, 생성기·테스트 사본 미커밋)는 정리 대상

## 5. 승인 대기
- [ ] "PHASE0 배포 승인" 대기
- [ ] "만세력 배포 승인" 대기
