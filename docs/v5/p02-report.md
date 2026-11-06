# P0-2 보고: v5 개발 기반 정비

브랜치 `v5/main` (worktree `~/Developer/gyeol-worktrees/v5-main`), 기준 origin/master `0dde75a8`. 계산 로직·DB 스키마 변경 없음.

## 결과 요약 (PASS / PARTIAL / FAIL / UNVERIFIED)

| 항목 | 판정 | 근거 |
|---|---|---|
| 선행 정리 (p01 worktree 제거, manseryeok-merge push, verify 스크립트 호스트 허용) | PASS | worktree 제거, `v5/manseryeok-merge`=0f9b781a push, `dc5707f4` |
| 기준 문서 (SPEC.md 원문, CLAUDE.md 62줄 병합, branches.md) | PASS | docs/v5/SPEC.md, CLAUDE.md, docs/v5/branches.md |
| carryover (keep/drop/보류 표) | PASS | docs/v5/p0-carryover.md |
| OpenAI 미사용 코드 제거 | PASS (운영 플래그는 UNVERIFIED) | 17개 파일 7,530줄 포함 125개 파일, +596/−23,679. import 그래프: 제거 후 대상 0, 미해결 import 0. 제거 전에는 17개 모두 도달 가능(플래그 `OPENAI_REPORT_WRITER_ENABLED=1`일 때만 호출)했고, Production 값은 조회하지 않아 UNVERIFIED |
| LLM 어댑터 | PASS | src/lib/llm/, 단위 테스트 20/20 (정상·길이·중간 끊김·연결 오류·429/500/529·잘못된 이벤트·타임아웃 2종·비밀값 비노출·키 없음) |
| OpenAI 연결 점검 | PASS | 아래 |
| 인프라 조사 | PASS (일부 UNVERIFIED) | docs/v5/infra-notes.md |
| tsc / lint / build | PASS | 오류 0 / 0 / 성공 |
| 전체 테스트 vs 기준선 | PARTIAL | 아래 |
| 비밀·개인정보 스캔 | PASS | 아래 |

## carryover 요약
- KEEP: knowledge-v5 자산 20 파일(feature 205, MBTI 16, 교차 발견 200, 문장 4,344개)·스키마·`knowledge-lint`(이슈 0)·inputs.json, 로딩 화면 단계 표시+멈춘 refresh 수정, 절입일 안내 문구(+헬퍼), annualEvidence 해시 재고정 7파일, OpenAI 제거.
- DROP: writer-v5·evidence-v5 전체, `/dev/review`, q3 측정 스크립트, docs/eval 산출물, event-1plus1(보류).
- 보류(애매): knowledge-build.ts, docs/design/*, q0·q1 보고서·생성 스크립트 등. 목록은 p0-carryover.md.
- 의존성 추가: zod(지식 스키마), tsx(lint 실행). LLM 어댑터는 SDK 없이 fetch+SSE 직접 구현(SDK 추가 없음).

## OpenAI 점검
- `GET /v1/models`: 134개 모델. 후보(가격은 공식 페이지 확인분): gpt-4o-mini($0.15/$0.60), gpt-5-nano($0.05/$0.40, 추론 모델), gpt-5.4-nano($0.20/$1.25), gpt-6-luna($0.10/$0.50) 등.
- **목록에 있어도 쓸 수 없는 모델이 있다**: `gpt-4.1-nano`는 목록에 있었지만 호출 시 404(deprecated, 과금 없음).
- 어댑터 스트리밍 1회: `gpt-4o-mini`, Responses API, 입력 51·출력 33토큰, 32개 조각, **$0.0000275**. 누적 $0.0000275 (점검 상한 $0.10). docs/v5/api-cost-log.md.
- Anthropic은 호출하지 않음(목업 테스트만). 가격표에는 공식 페이지(2026-10-28) 단가를 넣었다.

## 기준선 비교
- 전체 vitest: 608 파일 중 144 실패 파일, 30,816 테스트 중 806 실패.
- `docs/baseline-failures.txt`(140 파일, 기준 커밋 84826020 — 오래됨) 대비 신규 실패 파일 4개:
  - 기존 오류 3개 — `comprehensiveStability`, `conditionalTemporalMeaningReview`, `temporalTenGodSourceContract`: 깨끗한 origin/master 워크트리에서 같은 17건 실패를 확인(제 변경과 무관, 기준선 문서가 오래돼 목록에 없었음).
  - 신규 오류 1개 — `ticketOwnerRoute`: 가져온 로딩 화면 변경(저장소 오류 시 자동 재확인 화면) 때문. q2와 같은 1줄 갱신으로 해소(3/3 통과).
- 기준선에 있던 실패(환경 의존 등)는 그대로 140개 파일이 남아 있다. 기준선 파일 중 새로 통과한 파일은 없음. 판정: **신규 실패 0**(기존 3개 파일은 master에서도 실패). 단 기준선 목록 자체를 최신 master로 다시 뽑지는 않았다.
- `birthTimeCheckoutBoundary`의 4건 실패는 기준선에 이미 있는 환경 의존 실패(결제 설정 없음 → 503)이며 절입일 케이스는 통과.
- 테스트 통과 ≠ 판매 품질 통과. 이번 작업은 원고 품질을 평가하지 않았다.

## 비밀·개인정보 스캔 (push 전)
- 범위: HEAD 트리 전체 + 이 브랜치가 새로 추가하는 커밋(origin/master..v5/main)의 추가 라인. 이미 origin에 있는 master 이력은 재스캔하지 않았다.
- `sk-ant-`: 0. 단어 경계를 둔 `sk-…` 20자 이상: 0(테스트용 더미 키는 리터럴이 남지 않게 조립으로 변경). JWT(`eyJ…`): 0. 비밀번호 형태 리터럴: 0. 신규 추가 라인의 이메일: 0.
- `service_role`: 신규 추가분은 CLAUDE.md 규칙 문구 1건뿐(값 아님). 트리의 185줄은 기존 SQL·코드 식별자.
- 전화번호 050-6664-8562: master에 이미 있는 고객센터 번호(`customerServicePhone`)를 가리키는 테스트 단언. 개인정보 아님.
- `.env.local`(OPENAI_API_KEY 한 줄)은 gitignore 대상이며 추적되지 않음.

## 인프라 노트 핵심
- 생성은 결제 라우트가 아니라 **매분 크론 워커**(`/api/internal/report-jobs`, `/report-ticket-jobs`)가 한다. 현재 `maxDuration` 300초, `vercel.json`에 `functions` 설정 없음, 1틱 최대 8건(claim 창 45초). 작업 단위 생성 타임아웃은 코드에 없음.
- Vercel Pro(Fluid compute): 기본 300초, **최대 800초(GA)**, 30분은 Beta(공식 문서 2026-08-24 갱신본). 이 프로젝트의 플랜·Fluid 활성 여부는 UNVERIFIED.
- 주의: DB lease가 10분(600초)이라 maxDuration을 800초로 올리면 lease보다 오래 도는 함수가 생겨 중복 claim 위험 → lease(SQL) 변경과 함께 설계.
- 개발 DB: supabase CLI 미설치, Docker Desktop은 있으나 데몬 꺼짐, `supabase/config.toml` 없음, 별도 개발 프로젝트는 문서상 미확인. 후보 = PGlite / 로컬 Supabase(Docker) / 별도 클라우드 개발 프로젝트. migration 밖 `scripts/*.sql` RPC 패치가 많아 migrations만으로는 DB가 재현되지 않는다. **운영 DB를 로컬에 연결하는 안은 권하지 않는다.**

## 알려진 사항
- 커밋 `54b9bcfa`에 knowledge 자산이 로딩 화면 변경과 함께 들어갔다(pathspec 오류). 이력 재작성 금지로 그대로 두고 `d74b22ca` 메시지·carryover 문서에 기록.
- SPEC §4의 "회수 크론"은 아직 없다(현재는 lease 만료 작업을 매분 워커가 다시 집는 방식).
- CLAUDE.md는 v5-main의 기존 1줄(`@AGENTS.md`)을 병합해 확장했다. 원본 저장소의 미커밋 CLAUDE.md·proposal은 건드리지 않았다(내용은 proposal 기반으로 재작성).
