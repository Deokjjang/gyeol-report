# P2 진행 기록 (브리프)

브랜치 `v5/p2-brief` (v5/main 14a3122b에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p2-brief`. 세션이 끊기면 이 파일 + `git log`로 이어서 한다.
완료 시 v5/main에 fast-forward 병합·push(master 금지, force 금지).

## 단위

| 단위 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| 0 | 기준선: v5/main 전체 테스트 → `docs/baseline-failures-v5main.txt` | 진행 | |
| B0 | 장면 `{text, requires}` 변환(휴리스틱 태그 4,587개), lint 규칙(프로필 장면·결혼/자녀 짝·이미지 유사 3-gram·행동 템플릿 조합), 엔진 미지원 71개 engineSupport 전환, 감지 계약 타입 | 완료 | (이 커밋) |
| A | 엔진 감지 보강 `src/lib/saju/detections/` + 테스트 + 정책 문서 + 커버리지 표 | 대기 | |
| B1 | 장면 태그 검수 + 언젠가형 결혼 장면 (명리 33파일, MBTI 16) | 대기 | |
| B2 | Fusion 긴장 규칙 ≥80 (유형별) + Fusion 장면 태그 검수 | 대기 | |
| B3 | 행동 템플릿 120 조합 + 십성 연월 장면 태그 | 대기 | |
| C | 브리프 빌더 `src/lib/brief/` + 테스트 | 대기 | |
| D | 브리프 시험 집필(c1·c2) + 채점 + 빌더 수정 | 대기 | |
| E | 게이트(lint·tsc·eslint·테스트·기준선 비교) + 보고서 + 병합 | 대기 | |

## 결정 기록 (SPEC 우선순위: 근거 → 재미 → 단순함)

1. **calculateSaju 출력 불변.** v5 감지는 `analyzeChartDetections(saju)`가 별도 산출한다. calculateSaju 결과를 통째로 비교하는 테스트 10개 이상과 V4 스냅샷·해시에 영향 0. (단순함·안전)
2. **장면 사실 조건 값 확장**: 지시는 relationship `any|single|dating|married`, children `any|has`. 언젠가형 대체 장면을 기혼·자녀 있음 고객에게서 빼려면 표시가 필요해 relationship `unmarried`, children `none`을 더했다. 관계 미상 고객은 any + unmarried, 자녀 미상은 any + none. (근거: 없는 사실 단정 금지)
3. **고객 직업 매핑**: employee→employed, self_employed·business_owner→business, student→student, 그 외(freelancer·job_seeker·homemaker·unemployed·other·미입력)→any 장면만. 프리랜서에게 "팀장"·"손님" 장면은 거짓일 수 있다.
4. **장면 JSON은 한 줄 객체**로 둔다(파일 가독성·에이전트 편집 비용). 변환은 줄 단위 치환이라 다른 필드 포맷은 그대로다.
5. **영역당 장면 상한 5→6, MBTI signals 3→3~5, 십성 연월 장면 상한 4→5**: 언젠가형 짝을 넣을 자리.
6. **이미지 유사도 = 문자 3-gram Dice**(공백·문장부호 제거). 0.6 이상 경고, `--strict`에서 실패. 현재 1쌍(己 visual ≈ 比肩 visual 0.68). 0.47이지만 같은 모티프인 JAEGO≈TWELVE_HWAGAE(가을걷이 곳간)도 고친다.
7. **행동 템플릿 조합**: 십성 10 × 타임라인 영역 6(work·money·study·love·relationships·alone, 사실 민감한 marriage 제외) × 세기 2구간(flow 1~3 / 4~5) = 120. 세운 12개월은 (십성, 영역) 회전으로 템플릿 반복 0.
8. **B1 장면 검수 에이전트는 Sonnet**(분류 + 언젠가형 1~2문장, 비용·동시 한도), Fusion 긴장(B2)·행동 템플릿(B3)·엔진(A)은 Opus. 메인이 20% 표본 검수.

## 메모
- 지식 lint: `pnpm exec tsx scripts/knowledge-lint.ts [--only file] [--strict]`.
- B0 직후 lint: 563 issue(프로필 장면 280·결혼 짝 275·자녀 짝 8) + 경고 1 — B1에서 0으로.
