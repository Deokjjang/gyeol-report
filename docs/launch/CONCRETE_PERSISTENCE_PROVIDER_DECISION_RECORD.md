# 결리포트 Concrete Persistence Provider Decision Record

## 1. 목적

이 문서는 production persistence 구현 전에 1차 concrete provider 방향을 기록한다.

- provider 선택 기록과 실제 DB 구현을 분리한다.
- 이후 구현 task가 provider-neutral adapter 경계를 유지하도록 기준을 둔다.
- 현재 제품 범위에서 Supabase/Postgres와 Firebase/Firestore를 비교한다.

## 2. 현재 전제

- report persistence adapter는 provider-neutral 구조다.
- in-memory adapter는 tests/dev only 용도다.
- production DB는 구현되어 있지 않다.
- access token hash utility가 존재한다.
- payment는 비활성 상태다.

## 3. 후보 비교 요약

| 기준 | Supabase/Postgres | Firebase/Firestore |
| --- | --- | --- |
| structured query | SQL 기반 조회와 조건 검색에 강점이 있다. | 문서 기반 조회에 적합하지만 복합 조회 설계가 중요하다. |
| schema clarity | reports table과 payment linkage field를 명확히 표현하기 쉽다. | schema flexibility는 높지만 field contract를 별도로 엄격히 관리해야 한다. |
| Next.js integration | server-side adapter에서 사용하기 좋은 후보로 볼 수 있다. | client/server boundary와 rules 설계를 신중히 잡아야 한다. |
| small-scale operation | 낮은 초기 규모에서 단순한 운영이 가능할 수 있다. | 초기 구현 속도와 managed 운영에 장점이 있을 수 있다. |
| backup/export | SQL dump, export, query 기반 점검에 적합할 수 있다. | export 방식과 복원 절차를 별도로 확인해야 한다. |
| access control | server-side DB access와 row-level policy 검토가 가능하다. | security rules 설계가 핵심이며 실수 방지 검토가 필요하다. |
| future payment linkage | order/report/payment metadata 관계를 SQL로 다루기 쉽다. | payment linkage를 문서 구조로 관리할 수 있으나 조회 패턴을 먼저 고정해야 한다. |

## 4. 1차 권장 선택

Supabase/Postgres를 1차 production persistence 후보로 둔다.

이 기록은 구현 완료 상태가 아니라, 실제 adapter 구현 전에 남기는 추천 및 decision record다.

## 5. 선택 이유

- report, order, payment linkage는 관계형 구조로 다룰 부분이 충분하다.
- production persistence schema draft가 table field 구조와 자연스럽게 맞는다.
- future admin, export, query 요구가 생길 때 SQL 기반 조회가 도움이 될 수 있다.
- provider-neutral adapter interface를 유지하면 이후 교체 가능성을 남길 수 있다.
- low-scale launch에서는 reports table 중심으로 단순하게 시작할 수 있다.

## 6. 선택 시 구현 범위

- reports table
- payment linkage fields
- accessTokenHash fields
- `create`, `update`, `find`, `softDelete`, `list` adapter
- typed error mapping
- adapter tests

## 7. 선택하지 않는 범위

- payment provider implementation
- paid unlock API
- admin console
- analytics
- final policy copy replacement
- raw card data storage

## 8. 리스크와 보완책

- migration design이 필요하다.
- env/secrets separation이 필요하다.
- retention/deletion policy가 필요하다.
- backup/export plan이 필요하다.
- SQL/provider coupling risk는 adapter interface를 유지해 줄인다.

## 9. 결정 전 확인 사항

- Supabase project setup
- production environment variables
- database backup/export option
- access policy
- local/dev test strategy
- release check pass
- manual QA pass

## 10. 다음 개발 Task 제안

1. 58B — concrete persistence provider decision record source test
2. 58C — Supabase schema migration draft
3. 58D — Supabase persistence adapter skeleton
4. 58E — Supabase persistence adapter tests
5. 59A — choose concrete payment provider
