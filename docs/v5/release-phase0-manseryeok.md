# v5 출시 런북 — Release 1 (Phase 0) → Release 2 (만세력 v5)

- 쓰는 사람: 배포 승인자(운영자). 화면별 확인 항목은 `docs/manseryeok-release-checklist.md`(이하 "체크리스트")에 있고, 여기서는 순서·명령·판정·롤백만 적는다.
- 근거: `docs/manseryeok-report-3.md`(Phase 0·병합 후보 검증), `docs/publish-failure-query.sql`(발행 실패율), `scripts/verify-books-readonly.ts`(공개 페이지 점검), `tests/unit/payment/productionVersionCombos.test.ts`(운영 버전 조합 9종 열람 회귀).
- 표기: PASS / PARTIAL / FAIL / UNVERIFIED. ☐ 미확인 ☑ 확인 ✕ 문제(메모 필수).

---

## 0. 꼭 지킬 것

| # | 규칙 |
|---|---|
| R-1 | 순서는 **Release 1 → Release 2**. Release 1이 운영에서 확인되기 전에는 Release 2를 하지 않는다. |
| R-2 | Release 1은 사용자가 정확히 **`PHASE0 배포 승인`** 이라고 입력한 뒤에만 실행한다. |
| R-3 | Release 2는 사용자가 정확히 **`만세력 배포 승인`** 이라고 입력한 뒤에만 실행한다. 비슷한 말("배포해", "ok")은 승인이 아니다. |
| R-4 | **롤백은 언제나 Phase 0 배포로 간다. 84826020(Phase 0 이전) 배포로 돌아가지 않는다.** 84826020 코드는 v5 V3 리포트를 읽는 순간 quarantine하고, 운영 quarantine 패치 상태에 따라 `snapshot_json`까지 지운다(고객 Book 손실, 되돌릴 수 없음). 근거: 보고서 3 §1.2, 체크리스트 §4. |
| R-5 | master에 `--force` push 금지. master는 SHA를 fast-forward로만 올린다. |
| R-6 | DB 작업 없음. 두 릴리스 모두 migration·패치 SQL이 없다(`git diff origin/master <Release 2 SHA> -- supabase` = 변경 없음). 운영 SQL은 읽기 전용 SELECT만 사용자가 실행한다. |
| R-7 | 메인 저장소(`~/Dev/projects/gyeol-report`)에는 미커밋 파일이 있다. 거기서 `git checkout master` 하지 않는다. 로컬 `master` 브랜치는 200커밋 뒤라 쓰지 않는다. 기준은 항상 `origin/master`. |

배포 방식: Vercel 프로젝트 `gyeol-report`가 GitHub `Deokjjang/gyeol-report`에 Git 연동되어 있다(브랜치 push → Preview 빌드는 확인됨). master push → Production 빌드는 Vercel Settings → Git의 **Production Branch = `master`** 를 배포 전에 한 번 눈으로 확인한다(저장소 안에는 이 설정 근거가 없다: UNVERIFIED). push는 배포 성공의 증거가 아니다. Vercel에서 READY와 SHA를 따로 확인한다.

| 릴리스 | 브랜치 | SHA | 내용 |
|---|---|---|---|
| 현재 운영 | `origin/master` | `84826020` | — |
| Release 1 | `v5/phase0-version-tolerant` (origin에 push됨) | `463c4f8e` | origin/master + 1커밋. v5-lmt 계산 버전을 읽기에서 허용, 모르는 버전은 quarantine하지 않고 보존. 새 리포트는 그대로 kst-v2 |
| Release 2 | `v5/manseryeok-merge` (origin에 아직 없음) | `3e53c123` (문서 커밋이 더 붙으면 그 HEAD) | Phase 0 + 10커밋. v5-lmt 달력(127.5°E −30분, IANA 시각), 신살 표 수정, 락 재기준화, 문서 |

---

## 1. 배포 전 공통 준비

### 1.1 SHA·fast-forward 확인 (아무 worktree에서, master 체크아웃 없이)

```sh
cd ~/Developer/gyeol-worktrees/v5-manseryeok-lmt
git fetch origin
git rev-parse origin/master                       # Release 1 전: 84826020… / Release 2 전: 463c4f8e…
git rev-parse v5/phase0-version-tolerant          # 463c4f8e…
git merge-base --is-ancestor origin/master 463c4f8e && echo "R1 FF OK"
git rev-list --count origin/master..463c4f8e      # 1
R2=$(git rev-parse v5/manseryeok-merge); echo $R2
git merge-base --is-ancestor 463c4f8e "$R2" && echo "R2 contains Phase 0"
git rev-list --count 463c4f8e.."$R2"              # 10 + P01 커밋(오라클·문서·스크립트)
git diff --stat origin/master "$R2" -- supabase vercel.json      # 비어 있어야 한다
git diff origin/master "$R2" -- package.json      # devDependency astronomy-engine 2.1.19 한 줄만(테스트 오라클용)
git diff --stat origin/master "$R2" -- scripts      # scripts/verify-books-readonly.ts 추가만(읽기 전용 점검 도구)
```

- `origin/master`가 예상 SHA가 아니면(누가 먼저 push함) **멈춘다**. 브랜치를 새 master 위로 다시 올리고 검증부터 다시 한다.

### 1.2 코드 검증 (배포할 SHA 그대로)

```sh
pnpm exec tsc --noEmit -p .
pnpm lint
pnpm build
pnpm test > /tmp/test.txt 2>&1    # 수 분 걸린다
```

| 항목 | 기대 |
|---|---|
| tsc / lint / build | 오류 0, build 성공(env 없이도 성공한다) |
| 테스트 | 실패 **파일** − `docs/baseline-failures.txt`의 FILES 140 − KNOWN NEW FAILURES 3 = 없음. 남는 파일은 단독 재실행(`pnpm exec vitest run <file>`)해서 PASS면 부하 탓으로 기록 |
| 판매 품질 | 테스트 통과 ≠ 품질 통과. Release 2 원고는 Preview에서 사람이 읽는다(체크리스트 §3.1 P7) |

참고 실측(2026-10-28, `v5/manseryeok-merge` HEAD 3e53c123): §7 기록표 참조.

### 1.3 발행 실패율 기록 (사용자가 Supabase SQL 편집기에서, 읽기 전용)

1. ☐ `docs/publish-failure-query.sql`의 **[1]**과 **[6]** 블록을 하나씩 선택해 실행한다(편집기는 마지막 문장 결과만 보여 준다).
2. ☐ 결과를 캡처해 둔다: [1]의 `최근 7일`·`최근 30일` 행(`publish_failed_pct`, `quarantined_after_publish`, `no_report_row`), [6] 전체.
3. ☐ 체크리스트 §4의 [R1](quarantine 패치 상태)을 한 번 실행해 결과(true/false)를 적는다.

### 1.4 공개 페이지 기준 잡기 (공유 URL·토큰 없음)

- ☐ 배포 **전에** 한 번 돌려 기준을 잡는다. 여기서 FAIL인 경로(예: 이벤트 종료로 404)는 배포와 무관한 기존 상태다. 적어 두고 배포 후 같은지 비교한다.

```sh
node --no-warnings scripts/verify-books-readonly.ts            # 기본 https://gyeolreport.com
```

- 확인 경로: `/`, `/products`, `/products/saju-mbti-full`, `/campaign/gyeol-opening-2026`, `/sitemap.xml`, `/robots.txt`.
- 판정: 경로마다 `PASS/WARN/FAIL 상태 이름 URL 이유`. 페이지는 200·본문 있음·Next.js 서버 오류 표식 없음. sitemap·robots는 저장소에 파일이 없어 404가 정상(WARN), 5xx면 FAIL. FAIL이 있으면 종료 코드 1.
- 기존 Book 열람(보안 토큰 필요)은 여기서 하지 않는다. 대신
  - 운영 버전 조합 9종 회귀 테스트 `tests/unit/payment/productionVersionCombos.test.ts`(Phase 0·Release 2 코드 모두 PASS, 84826020 코드는 모르는 버전 9건 FAIL = 위험을 잡는다는 증거),
  - 배포 후 런타임 오류 감시(§2.3-5, §3.3-4)로 확인한다.
- Preview 주소는 Vercel 로그인 보호 때문에 FAIL(다른 호스트로 리다이렉트/401)이 정상이다. 운영 도메인에만 쓴다.

---

## 2. Release 1 — Phase 0

### 2.1 배포 전
1. ☐ §1.1 `R1 FF OK`, §1.2(463c4f8e 기준, 보고서 3 §5: tsc·lint 0, build 성공, 신규 실패 파일 2 = 동결 해시), §1.3, §1.4 완료.
2. ☐ 체크리스트 §1.1 Preview(A1~A3). Preview가 운영 DB에 연결되어 있으면 멈춘다.
3. ☐ 사용자가 **`PHASE0 배포 승인`** 입력.

### 2.2 배포

```sh
git fetch origin
git merge-base --is-ancestor origin/master 463c4f8e && git push origin 463c4f8e:refs/heads/master
git fetch origin && git rev-parse origin/master   # 463c4f8e… 이어야 한다
```

- `! [rejected] … (non-fast-forward)`가 나오면 **멈춘다**. `--force`로 다시 하지 않는다.

### 2.3 배포 후
1. ☐ Vercel Deployments: Production, 커밋 `463c4f8e`, 상태 **READY**, 운영 도메인이 이 배포를 가리킨다.
2. ☐ **이 배포의 ID/URL을 "Phase 0 배포"로 §7에 적는다.** 롤백 대상이다.
3. ☐ `verify-books-readonly` 결과가 §1.4 배포 전 기준과 같다(새 FAIL 없음).
4. ☐ 체크리스트 §1.2(기존 Book 5건 이상 직접 열기, 24시간 [S1], `REPORT_READ_UNKNOWN_CALCULATION_VERSION` 0건).
5. ☐ Vercel 런타임 로그(Production, 배포 후 1시간·24시간): `/r/`·`/reports/` 5xx, `READ_GATE_REJECTED`, `PUBLISHED_SNAPSHOT_VALIDATION_FAILED`가 배포 전보다 늘지 않는다.
6. ☐ 신규 리포트: Phase 0는 새 리포트 생성을 바꾸지 않는다. 별도 스모크는 필수 아님(실제 결제가 필요한 확인은 결제 승인을 따로 받는다). 24시간 뒤 SQL [1]·[6]으로 발행 실패율이 배포 전과 같은 수준인지 본다.

### 2.4 Release 1 문제 시
- 아직 v5 리포트가 운영에 없으므로, 이때만은 84826020 배포로 Vercel Instant Rollback 해도 된다. 조건: Release 2가 한 번도 운영에 나간 적 없음(체크리스트 [R2]의 v5-lmt 0건).

---

## 3. Release 2 — 만세력 v5

### 3.1 배포 전
1. ☐ Release 1 §2.3 전부 PASS, 24시간 관찰 끝.
2. ☐ 체크리스트 §2: 골든 priority 1~8 확인, **23시 규칙(D3) 확정**. 미확정이면 Release 2 보류.
3. ☐ Preview: `git push origin v5/manseryeok-merge`(기능 브랜치 push, master 아님) → 체크리스트 §3.1 P1~P9, 로그 확인. P7(6개 상품 원고를 사람이 읽기)이 판매 품질 판정이다.
4. ☐ §1.1(`origin/master` = 463c4f8e, `R2 contains Phase 0`, supabase·scripts 변경 없음), §1.2(R2 SHA 기준), §1.3 다시 기록, §1.4 다시 실행.
5. ☐ §7에 Phase 0 배포 ID가 적혀 있다(없으면 진행하지 않는다. 롤백 대상을 모르는 상태다).
6. ☐ 사용자가 **`만세력 배포 승인`** 입력.

### 3.2 배포

```sh
git fetch origin
R2=$(git rev-parse v5/manseryeok-merge)
test "$(git rev-parse origin/master)" = "$(git rev-parse 463c4f8e)" \
  && git merge-base --is-ancestor origin/master "$R2" \
  && git push origin "$R2":refs/heads/master
git fetch origin && git rev-parse origin/master   # = $R2
```

### 3.3 배포 후
1. ☐ Vercel: Production, 커밋 `$R2`, **READY**, 운영 도메인 연결. **배포 시각**을 §7과 체크리스트 §3.2-1에 적는다.
2. ☐ `verify-books-readonly` 결과가 §1.4 배포 전 기준과 같다(새 FAIL 없음).
3. ☐ 신규 리포트 스모크: 1건 이상 발행·열람(체크리스트 §3.2-2). 결제가 필요하면 결제 승인을 따로 받는다.
4. ☐ 런타임 로그 0건이어야 하는 것: `SAJU_CALENDAR_CURRENT_REQUIRED`, `NATAL_TABLE_EVIDENCE_MISMATCH`, `REPORT_READ_UNKNOWN_CALCULATION_VERSION`. `/r/`·`/reports/`·`/api/internal/report-jobs` 5xx가 늘지 않는다.
5. ☐ 24시간 뒤 SQL [1]·[3]·[6]을 배포 전 기록과 비교, 체크리스트 [R2] 기록. 발행 실패율이 눈에 띄게 늘면 [3]의 사유를 보고하고 §4 판단.

---

## 4. 롤백 (Release 2 → Phase 0)

**대상은 §7의 "Phase 0 배포" 하나뿐이다. 84826020이나 그 이전 배포를 고르지 않는다(R-4).**

### 4.1 롤백 전
1. ☐ forward-fix가 더 빠르고 안전한지 먼저 본다.
2. ☐ 체크리스트 §4.1: [R1], [R2], [R3] 실행·저장.

### 4.2 방법 A (기본): Vercel Instant Rollback → Phase 0 배포
1. ☐ Vercel → Deployments → §7의 Phase 0 배포(커밋 `463c4f8e`) → 메뉴에서 Instant Rollback(또는 Promote to Production).
2. ☐ 운영 도메인이 Phase 0 배포를 가리키는지, 그 배포 커밋이 `463c4f8e`인지 확인.

왜 이 방법인가
- 다시 빌드하지 않아 빠르고, git·DB를 건드리지 않는다.
- master를 Phase 0로 되돌리려면 non-fast-forward라 `--force`가 필요하다(R-5 금지). 그래서 git으로 되돌리지 않는다.

주의
- Instant Rollback 뒤에는 Vercel이 새 master push를 운영 도메인에 자동 연결하지 않는다. master에는 v5 커밋이 남아 있다. 다시 v5를 올릴 때는 고친 커밋을 push한 뒤 Vercel에서 그 배포를 Promote(또는 Undo Rollback)한다.
- 요금제에 따라 "바로 이전 운영 배포"로만 롤백될 수 있다. 그래서 Release 1과 Release 2 사이에 다른 운영 배포를 끼우지 않는다. 끼워졌다면 방법 B.

### 4.3 방법 B (A를 못 쓸 때): revert 커밋을 fast-forward로 push
새 worktree에서만 한다(메인 저장소 X). 사용자 승인을 다시 받는다.

```sh
git fetch origin
git rev-parse origin/master                       # $R2 이어야 한다. 다른 커밋이 더 있으면 멈추고 범위를 다시 정한다
git worktree add --detach ~/Developer/gyeol-worktrees/rollback-v5 origin/master
cd ~/Developer/gyeol-worktrees/rollback-v5
git revert --no-edit 463c4f8e..origin/master     # Phase 0 뒤 커밋만 되돌린다. 463c4f8e 자체는 되돌리지 않는다
git diff --stat 463c4f8e HEAD                     # 비어 있어야 한다(트리가 Phase 0와 같다)
git push origin HEAD:refs/heads/master            # fast-forward. --force 없음
```

- Vercel이 새로 빌드한다(수 분). READY·SHA 확인.

### 4.4 롤백 후
1. ☐ 체크리스트 §4.3(6~9): [R2] COMPLETED 수 그대로·`(내용 없음)` 늘지 않음, [R3] 늘지 않음, v5 리포트 2~3건 열림, `REPORT_READ_UNKNOWN_CALCULATION_VERSION` 0건.
2. ☐ `verify-books-readonly` 결과가 §1.4 배포 전 기준과 같다(새 FAIL 없음).
3. ☐ v5 리포트에 `admin_retry` 하지 않는다(kst-v2로 다시 만들어져 원국이 바뀔 수 있다).
4. 롤백 중 화면 차이(정상): v5 리포트의 근사 시간대 라벨이 예전 표기, 만세력 표 아래 보정 문구 없음. 데이터는 그대로.

---

## 5. Release 2가 실패했는데 Release 1은 정상일 때

| 언제 | 상태 | 할 일 |
|---|---|---|
| Preview·검증 단계(push 전) | 운영 = Phase 0 그대로 | 롤백할 것 없음. 브랜치에서 고치고 §3.1부터 다시 |
| push가 거절됨(non-fast-forward) | 운영 = Phase 0, master 변화 없음 | 멈춤. `git fetch` 후 누가 master를 바꿨는지 확인. `--force` 금지 |
| Vercel 빌드 실패·READY 아님 | 운영 도메인은 Phase 0 배포 그대로. 하지만 master에는 v5 커밋이 있다 | 운영 도메인이 Phase 0 배포인지 확인. 그다음 고쳐서 다시 push하거나, master를 코드상 Phase 0로 맞추려면 §4.3(방법 B) |
| READY 뒤 §3.3 확인 실패 | 운영 = v5 | 고객 영향(Book FAIL, 5xx·오류 로그 증가, 발행 실패율 증가)이 있으면 바로 §4. 표시 문구 수준이면 forward-fix |

어느 경우든 Phase 0는 남겨 둔다. Release 2 기간에 만든 v5 리포트는 Phase 0에서 열린다(보고서 3 §1.2). Phase 0가 아는 v5 버전은 `saju-calendar-v5-lmt`, `dayun-utc-sect2-v2`, `v5-lmt-2`뿐이다. 다음 v5 수정에서 계산 버전을 올리면 Phase 0 목록부터 먼저 갱신·배포한다.

---

## 6. 하지 않는 것
- 음력 입력 열기(엔진 음력이 중국 기준. 백로그 `docs/v5/backlog.md` B1).
- master force push, 메인 저장소에서 master 체크아웃, reset/clean/stash.
- 운영 DB 쓰기·migration·RPC 변경, `admin_retry`, 결제·환불.
- 84826020(또는 그 이전) 배포로의 롤백(§2.4의 Release 1 단독 실패 예외만 허용).

---

## 7. 기록표

| 항목 | 값 |
|---|---|
| 배포 전 `origin/master` | 84826020 |
| 배포 전 SQL [1] 7일/30일 `publish_failed_pct` | |
| [R1] quarantine_keeps_snapshot | |
| 배포 전 공개 페이지 verify 결과(PASS/WARN/FAIL) | |
| Release 1 승인 시각("PHASE0 배포 승인") | |
| **Phase 0 배포 ID / URL** (롤백 대상) | |
| Release 1 verify 결과 | |
| Release 2 SHA (`$R2`) | |
| Release 2 승인 시각("만세력 배포 승인") | |
| Release 2 배포 ID / 배포 시각 | |
| Release 2 verify 결과 / 24시간 SQL 비교 | |
| 롤백 여부·방법·시각 | |

로컬 검증 실측(2026-10-28, worktree `v5/manseryeok-merge` @3e53c123, env 없음)

| 항목 | 결과 | 판정 |
|---|---|---|
| `pnpm exec tsc --noEmit -p .` | 오류 0 | PASS |
| `pnpm lint` | 오류·경고 0 | PASS |
| `pnpm build` | 성공, 경고 0(env 없이) | PASS |
| `pnpm test` | 630파일 중 154 실패(31,141건 중 833) = 기준선 140 + KNOWN 3 + 11. 11개는 단독 재실행 11/11 PASS(전체 실행 중 5초·30초 시간 초과, 부하) | PASS(신규 실패 0) |
| `tests/oracle/` + 골든 테스트 | 따로 실행: 3파일 13건 PASS(약 9초). 전체 테스트 glob에 포함된다 | PASS |
| `docs/publish-failure-query.sql` | 로컬 PGlite(전체 migration + 패치)에 합성 데이터 9건을 넣고 [1]~[6] 실행, 분류·비율이 손계산과 같음. [5]는 빈 표로 실행만 확인 | PASS(로컬) / UNVERIFIED(운영) |
| `scripts/verify-books-readonly.ts` (공개 페이지) | 단위 4/4. 로컬 `next start`(env 없음): 홈·상품 2개 PASS, sitemap·robots WARN(404), 이벤트 500(Supabase env 없음 → 운영에선 해당 없음) | PASS(로컬) / UNVERIFIED(운영) |
| `productionVersionCombos.test.ts` | 9종 × (형태·읽기 게이트·실제 SQL 열람·모르는 버전 보존) 36건. Release 2 코드 36/36, Phase 0(463c4f8e) 36/36, 84826020 27/36(모르는 버전 9건 snapshot 삭제) | PASS |
