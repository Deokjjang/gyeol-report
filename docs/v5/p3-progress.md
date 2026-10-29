# P3 진행 기록 (작가·안전망·발행 경로)

브랜치 `v5/p3-writer` (v5/main 4d6f9d17에서 분기), worktree `~/Developer/gyeol-worktrees/v5-p3-writer`. 세션이 끊기면 이 파일 + `git log`로 이어서 한다.
완료 시 v5/main에 fast-forward 병합·push(master 금지, force 금지). 실호출은 OpenAI만(상한 합계 $1), Anthropic 호출 0.

## 단위

| 단위 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| 0 | 브랜치·worktree, Docker Desktop 실행, supabase CLI 2.122.0 설치, 기존 파이프라인 지도(아래 메모) | 완료 | – |
| A3a | 문체 금지 패턴 `src/lib/writer/safety/patterns.ts`(옛 부정 낱말·과거 경험 단정), 지식 lint 규칙 추가, 위반 데이터 31문장 교체 | 완료 | (이 커밋) |
| A1 | Fusion 일간·십성 × 16유형 320쌍(기존 56 + 신규 264), 계산 연결, 브리프 MBTI 규칙 | 진행 | |
| A2 | 오행 강약 단일 판단(엔진) + 브리프 결론 + 올해 한 줄 파생 + c1 보고 | 대기 | |
| A4 | 팩폭 자리 조건 대조 | 대기 | |
| A5 | 장 분량 1,000~1,250자, SPEC 총량 갱신 | 대기 | |
| A6 | 감지 강약 기본값 표 | 대기 | |
| B | 작가 지침(시스템 ≤1,500토큰, 예시 2, 출력 형식, 캐시 접두부) | 대기 | |
| D | 안전망(문장·장 검사, source 기록) | 대기 | |
| E | 결정론 작가(6상품) | 대기 | |
| C | 작가 실행기(스트리밍 1회, 장 저장, 재시도·이어쓰기, lease, 회수 크론) | 대기 | |
| F | Book 연결(v5 스냅샷 → BookData, 메타데이터, 플래그 WRITER_V5_PRODUCTS) | 대기 | |
| G | 로컬 Supabase + 시드 + 가드 + `pnpm dev:v5` + docs/v5/local-dev.md | 대기 | |
| H | 종단 시험(실호출 ≤$1, 실패 주입) | 대기 | |
| I | 전체 원고 시험(c1 종합 13장, c2 연애 9장) | 대기 | |
| J | 게이트·보고·병합 | 대기 | |

## 결정 기록 (SPEC 우선순위: 근거 → 재미 → 단순함)

1. **A-3 금지 낱말 범위**: 흉·길흉·액운·횡액·불길(불길하다 뜻만, '불꽃' 뜻의 불길 제외)·재앙·재난·박복·단명·요절·화근·악운·불운·과부·홀아비·극처·극부·패가망신. 신살 이름(망신살 등)은 이름이라 허용. 부정문("옛날에는 흉으로 읽었지만")도 금지.
2. **과거 경험 단정**: 겪어 봤습니다·한 적이 있습니다·했었습니다·"어릴 때 ~였습니다" 꼴을 금지, 물음표로 끝나는 질문형과 따옴표 안 대사는 허용. 년주 자리 뉘앙스 13개는 질문형("~않았나요?")이나 경향형("~하는 편입니다")으로 바꿨다.
3. **Fusion 320 해석**: id가 (요소, 유형)마다 하나라 기존 56쌍은 유지하고 빠진 264쌍을 새로 쓴다 → 320쌍 전부 존재.

## 기존 파이프라인 메모 (탐색 결과)

- 저장: `paid_report_snapshots.snapshot_json` = `ProductPreviewSnapshot{draft: V4CustomerReport, evidencePacket: V4RuntimeEvidence}`. 읽을 때 `projectBook(evidence)`로 BookData를 다시 만들고 다이제스트·draft 일치를 검사한다.
- 이용권 발행 RPC `report_ticket_publication`(scripts/report_ticket_publication_queue_patch.sql)은 `productVersion='v4'`만 받는다. 만료 lease는 환불(reverse)한다.
- 워커 maxDuration 300, lease 10분. 장 단위 부분 저장·회수 크론은 없다.
- v5 발행에 손댈 곳: 발행 RPC(v5 허용), `tickets/ownerRead.ts`, `isProductPreviewSnapshot`, `readPublishedReport` 검증, `book/storedReport.tsx` 검증 선택.
