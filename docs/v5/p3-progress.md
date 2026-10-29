# P3 진행 기록 (작가·안전망·발행 경로)

브랜치 `v5/p3-writer` (v5/main 4d6f9d17에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p3-writer`. 세션이 끊기면 이 파일 + `git log`로 이어서 한다.
완료 시 v5/main에 fast-forward 병합·push(master 금지, force 금지). 실호출은 OpenAI만(상한 합계 $1), Anthropic 호출 0.

## 단위

| 단위 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| 0 | 브랜치·worktree, Docker Desktop 실행, supabase CLI 2.122.0 설치, 기존 파이프라인 지도(아래 메모) | 완료 | – |
| A3a | 문체 금지 패턴 `src/lib/writer/safety/patterns.ts`(옛 부정 낱말·과거 경험 단정), 지식 lint 규칙 추가, 위반 데이터 31문장 교체 | 완료 | (이 커밋) |
| A1 | Fusion 320쌍 완비(신규 264, Sonnet 6개 패치 모드), 계산 연결(차원 점수), 브리프 규칙(핵심 정확 유형·70%↑·글자/기능 ≤2) | 완료 | e4b510be |
| A2 | 오행 강약 단일 판단(겉 글자+지장간+월지×2), 브리프 결론·올해 한 줄 파생, 정책 §6·c1 사례 | 완료 | d8d95979, b65bbd76 |
| A4 | 팩폭 조건절 대조(자리·인접 십성·관계·오행 다소·신살 동반·계절) + 옛 해석 면책문 교체 | 완료 | (A4 커밋) |
| A5 | 장 1,000~1,250자 고정, SPEC 상품 총량 | 완료 | b65bbd76 |
| A6 | 판정용 기본값 표 27항목 `docs/v5/p3-defaults.md` | 완료 | (이 커밋) |
| B | 작가 지침 v5-3(시스템 추정 ~1,000토큰), 예시 2(A-3 맞춤, 이름 가림), 캐시 접두부 | 완료 | 6f976210, 83f40bdc |
| D | 안전망 문장 11규칙 + 장 검사 + 조건형 장 + 책 단위 중복 | 완료 | 6f976210, 83f40bdc |
| E | 결정론 작가 6상품·궁합 7유형, 위반 0, 책 안 중복 회피 | 완료 | 6f976210 |
| C | 실행기 + 이용권 큐 v5(작가 lease 15분·정산 25분·회수 크론), maxDuration 800 | 완료 | 6f976210, ca5b4b56 |
| F | v5 스냅샷 → BookData, 메타데이터, 플래그(기본 비어 있음) | 완료 | 6f976210 |
| G | 로컬 Supabase·시드·가드·`pnpm dev:v5`(3100)·개발 전용 로그인·docs/v5/local-dev.md | 완료 | (이 커밋) |
| H | 실패 주입 8시나리오(PGlite) 완료, 키 없는 종단 7권 완료, 실호출은 키 대기 | 진행 | |
| I | 전체 원고 2회(지침·브리프·안전망 1회 수정), `docs/v5/p3-fullbook.md` | 완료 | 83f40bdc, (이 커밋) |
| J | 게이트·보고·병합 | 대기 | |

## 결정 기록 (SPEC 우선순위: 근거 → 재미 → 단순함)

1. **A-3 금지 낱말 범위**: 흉·길흉·액운·횡액·불길(불길하다 뜻만, '불꽃' 뜻의 불길 제외)·재앙·재난·박복·단명·요절·화근·악운·불운·과부·홀아비·극처·극부·패가망신. 신살 이름(망신살 등)은 이름이라 허용. 부정문("옛날에는 흉으로 읽었지만")도 금지.
2. **과거 경험 단정**: 겪어 봤습니다·한 적이 있습니다·했었습니다·"어릴 때 ~였습니다" 꼴을 금지, 물음표로 끝나는 질문형과 따옴표 안 대사는 허용. 년주 자리 뉘앙스 13개는 질문형("~않았나요?")이나 경향형("~하는 편입니다")으로 바꿨다.
3. **Fusion 320 해석**: id가 (요소, 유형)마다 하나라 기존 56쌍은 유지하고 빠진 264쌍을 새로 쓴다 → 320쌍 전부 존재.

4. **v5 작업 상태는 RUNNING 유지**: 새 상태(WRITING)를 만들면 묶음권 환불 판정 등 기존 함수가 진행 중 작업을 못 본다. 대신 v5만 writer_lease_until(15분)·lease_until(25분, 정산 기한)을 따로 둔다.
5. **이용권 공개 API는 로컬에서 쓰지 않음**: 운영 도메인 출처만 받는 보안 설계(로컬 예외 없음)를 유지하고, 종단 시험은 같은 RPC로 접수 → 로컬 서버 워커 라우트 → 페이지 열기로 한다.
6. **개발 모드 워커 메모리 상한**: next dev RSS 6GB로 1.25GiB 상한에 즉시 걸림 → NODE_ENV=development일 때만 TICKET_WORKER_MAX_RSS_MB로 올림(운영 불변).
7. **OpenAI 키 복사는 권한 검사에서 거부** → 사용자가 직접 넣기로(비밀값 입력은 사용자 몫).
8. **문체 예시 고객 이름 가림**: 예시의 "하람님"을 "[이름]님"으로, 안전망이 [이름]을 내부 용어로 지움.
9. **실호출 모델 gpt-4o-mini**: gpt-5-nano가 더 싸지만 추론 토큰이 출력 상한을 먹어 배관 검증에 부적합(P0-2 메모), gpt-4.1-nano는 404.

## 기존 파이프라인 메모 (탐색 결과)

- 저장: `paid_report_snapshots.snapshot_json` = `ProductPreviewSnapshot{draft: V4CustomerReport, evidencePacket: V4RuntimeEvidence}`. 읽을 때 `projectBook(evidence)`로 BookData를 다시 만들고 다이제스트·draft 일치를 검사한다.
- 이용권 발행 RPC `report_ticket_publication`(scripts/report_ticket_publication_queue_patch.sql)은 `productVersion='v4'`만 받는다. 만료 lease는 환불(reverse)한다.
- 워커 maxDuration 300, lease 10분. 장 단위 부분 저장·회수 크론은 없다.
- v5 발행에 손댈 곳: 발행 RPC(v5 허용), `tickets/ownerRead.ts`, `isProductPreviewSnapshot`, `readPublishedReport` 검증, `book/storedReport.tsx` 검증 선택.
