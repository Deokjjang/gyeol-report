#!/usr/bin/env bash
# 최종판 읽기 서버(최종판 6): 이 worktree(v5/final) 코드로 로컬 dev 서버를 띄운다. 다른 worktree의 서버는 종료하지 않는다.
#   bash scripts/read-final.sh            (기본 포트 3800, 사용 중이면 다음 빈 포트)
#   PORT=3900 bash scripts/read-final.sh
# 읽기 전용: LLM 예산 범위(LLM_BUDGET_SCOPE)를 넣지 않으므로 이 서버는 실제 작가 호출을 하지 않는다(개발 예산 관문이 거절, tools/llm/budget.ts).
# 로컬 Supabase·로컬 DB만 쓴다(pnpm dev:v5의 로컬 가드). 운영 변수·운영 DB에 접속하지 않는다.
# 주의: 옛 읽기 서버(3100, v5/main)로 보면 옛 화면이 나온다. 최종판 책은 이 서버 주소로 연다.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3800}"
mkdir -p "$HERE/.cache"
LOG="$HERE/.cache/read-final.log"

while lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT + 1)); done
echo "1) 설치(이 worktree: $HERE @ $(git -C "$HERE" log --oneline -1 | cut -c1-60))"
(cd "$HERE" && pnpm install --frozen-lockfile --silent)

echo "2) 실행(포트 $PORT, 다른 서버는 그대로)"
( cd "$HERE" && exec env -u LLM_BUDGET_SCOPE -u LLM_BUDGET_RUN PORT="$PORT" nohup pnpm dev:v5 ) >"$LOG" 2>&1 </dev/null &
disown 2>/dev/null || true
for _ in $(seq 1 180); do
  if curl -s -o /dev/null --max-time 2 "http://localhost:$PORT/"; then
    echo "읽기 서버: http://localhost:$PORT  (v5/final $(git -C "$HERE" rev-parse --short HEAD), 로그 $LOG)"
    echo "읽을 책 목록: docs/v5/final/final-read.md (링크의 포트가 다르면 $PORT로 바꿔 연다)"
    exit 0
  fi
  sleep 1
done
echo "서버가 3분 안에 뜨지 않았다. 로그: $LOG"; exit 1
