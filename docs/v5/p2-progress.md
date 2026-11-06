# P2 진행 기록 (브리프)

브랜치 `v5/p2-brief` (v5/main 14a3122b에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p2-brief`. 세션이 끊기면 이 파일 + `git log`로 이어서 한다.
완료 시 v5/main에 fast-forward 병합·push(master 금지, force 금지).

## 단위

| 단위 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| 0 | 기준선: v5/main 전체 테스트 → `docs/baseline-failures-v5main.txt` (154 파일/833 케이스) | 완료 | 05eb7f07 |
| B0 | 장면 `{text, requires}` 변환(휴리스틱 태그 4,587개), lint 규칙(프로필 장면·결혼/자녀 짝·이미지 유사 3-gram·행동 템플릿 조합), 엔진 미지원 71개 engineSupport 전환, 감지 계약 타입 | 완료 | 8823c113 |
| A | 엔진 감지 보강 `src/lib/saju/detections/` + 테스트 75 + 정책 §5 + 커버리지 254/254 | 완료 | f688b081 |
| B1 | 장면 태그 검수(retag 137·replace 3) + 새 장면 257(언젠가형 결혼 239) + 이미지 유사 2쌍 | 완료 | 8cfd492d (커밋 메시지의 "새 장면 303"은 diff 줄 수를 센 것 — 정정: 새 장면 257, DB 전체 언젠가형 305) |
| B2 | Fusion 긴장 96 추가(긴장 32.6%) + 장면 태그 59 수정 | 완료 | f8b2f5db |
| B3 | 행동 템플릿 24→144(120 조합) + 십성 연월 장면 태그 15 | 완료 | 8cfd492d |
| C | 브리프 빌더 `src/lib/brief/` + 테스트 16(스냅샷 6·성질 10) | 완료 | 676d3945 |
| D | 브리프 시험 집필(c1·c2) 2회 + 채점 + 빌더 수정 5건 | 완료 | 0ce55a50, aa9d924a |
| E | 게이트(lint·tsc·eslint·테스트·기준선 비교) + 보고서 + 병합 | 완료 | lint strict 0, tsc 0, eslint 0, 전체 테스트 신규 실패 0(154/154 기준선 파일), `docs/v5/p2-report.md` |

## 결정 기록 (SPEC 우선순위: 근거 → 재미 → 단순함)

1. **calculateSaju 출력 불변.** v5 감지는 `analyzeChartDetections(saju)`가 별도 산출한다. calculateSaju 결과를 통째로 비교하는 테스트 10개 이상과 V4 스냅샷·해시에 영향 0. (단순함·안전)
2. **장면 사실 조건 값 확장**: 지시는 relationship `any|single|dating|married`, children `any|has`. 언젠가형 대체 장면을 기혼·자녀 있음 고객에게서 빼려면 표시가 필요해 relationship `unmarried`, children `none`을 더했다. 관계 미상 고객은 any + unmarried, 자녀 미상은 any + none. (근거: 없는 사실 단정 금지)
3. **고객 직업 매핑**: employee→employed, self_employed·business_owner→business, student→student, 그 외(freelancer·job_seeker·homemaker·unemployed·other·미입력)→any 장면만. 프리랜서에게 "팀장"·"손님" 장면은 거짓일 수 있다.
4. **장면 JSON은 한 줄 객체**로 둔다(파일 가독성·에이전트 편집 비용). 변환은 줄 단위 치환이라 다른 필드 포맷은 그대로다.
5. **영역당 장면 상한 5→6, MBTI signals 3→3~5, 십성 연월 장면 상한 4→5**: 언젠가형 짝을 넣을 자리.
6. **이미지 유사도 = 문자 3-gram Dice**(공백·문장부호 제거). 0.6 이상 경고, `--strict`에서 실패. 현재 1쌍(己 visual ≈ 比肩 visual 0.68). 0.47이지만 같은 모티프인 JAEGO≈TWELVE_HWAGAE(가을걷이 곳간)도 고친다.
7. **행동 템플릿 조합**: 십성 10 × 타임라인 영역 6(work·money·study·love·relationships·alone, 사실 민감한 marriage 제외) × 세기 2구간(flow 1~3 / 4~5) = 120. 세운 12개월은 (십성, 영역) 회전으로 템플릿 반복 0.
8. **B1 장면 검수 에이전트는 Sonnet**(분류 + 언젠가형 1~2문장, 비용·동시 한도), Fusion 긴장(B2)·행동 템플릿(B3)·엔진(A)은 Opus. 메인이 20% 표본 검수.

9. **장별 재료 배정(사용자 결정 2026-10-29)**: 장마다 재료 4~6 = trait 2~4 + 보조 재료(좋은 기운·팩폭·안 쓴 기운·MBTI 신호·흐름·상품 근거). trait 최대 3장·재사용 0 유지. 반복 장(대운 연도·세운 월)은 타임라인 항목 1 + trait 1(항목 자체가 재료).
10. **429 대응**: 동시 16개 에이전트가 30분 만에 세션 한도에 걸렸다(11:30 리셋). 이후 압축 입력→패치→메모리 검사(`tools/p2-brief/b1`, `b2`) 방식으로 에이전트당 7.5~19만 토큰, 동시 6개 이하로 돌렸다.
11. **음착양차 일주 한정**: 엔진이 네 기둥 모두 보면 표본 55%에 발생(빈도표) → 일주만(20%). 월·시주는 DB 규칙대로 학파차이로 미채택.
12. **종합 '회복하는 방법' 장 영역에 alone 추가**: 질문이 "지쳤을 때 다시 힘을 채우는 법"인데 영역이 relationships·study뿐이라 라운드 로빈 배정에서 재료가 비었다.
13. **팩폭 문장 조건 검사**: 과사용 문장의 조건(신강·신약, 십성 묶음 많음·약함)이 원국과 어긋나면 고르지 않는다. 그 밖의 조건(특정 십성 인접 등)은 검사하지 않는다 — 남은 위험.
14. **타임라인 압축**: 십성 뜻·주의는 `timeline.tenGodNotes`에 한 번만, 흐름 근거는 짧은 이름. 대운 16~17k·세운 15k 토큰(항목 14·12개가 장 재료라 10k 목표는 종합에만 적용).

## 메모
- 지식 lint: `pnpm exec tsx scripts/knowledge-lint.ts [--only file] [--strict]`.
- B0 직후 lint: 563 issue(프로필 장면 280·결혼 짝 275·자녀 짝 8) + 경고 1 — B1에서 0으로.
