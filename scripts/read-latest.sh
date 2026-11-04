#!/usr/bin/env bash
# 최신 v5/main 읽기 서버(P6d J): 모든 dev 서버 종료 → origin/v5/main 전용 읽기 worktree 갱신 → 설치 → 실행 → 포트 출력.
#   bash scripts/read-latest.sh            (기본 포트 3100, 사용 중이면 다음 빈 포트)
#   PORT=3300 bash scripts/read-latest.sh
# 읽기 worktree: $READ_DIR(기본 ~/Developer/gyeol-worktrees/v5-read, detached HEAD = origin/v5/main). 고친 파일이 있으면 멈춘다(덮어쓰지 않는다).
# 로컬 Supabase·로컬 DB만 쓴다(pnpm dev:v5의 로컬 가드). 운영 변수·운영 DB에 접속하지 않는다.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
READ_DIR="${READ_DIR:-$HOME/Developer/gyeol-worktrees/v5-read}"
PORT="${PORT:-3100}"
LOG="$READ_DIR/.read-latest.log"

echo "1) dev 서버 종료"
for pat in "scripts/dev/v5-dev.ts" "next dev" "next-server"; do pkill -f "$pat" 2>/dev/null || true; done
for _ in $(seq 1 20); do pgrep -f "next dev|next-server|scripts/dev/v5-dev.ts" >/dev/null || break; sleep 0.5; done
pkill -9 -f "next dev|next-server|scripts/dev/v5-dev.ts" 2>/dev/null || true

echo "2) origin/v5/main 가져오기"
git -C "$HERE" fetch origin v5/main --quiet
TARGET="$(git -C "$HERE" rev-parse origin/v5/main)"
if [ -d "$READ_DIR" ]; then
  if [ -n "$(git -C "$READ_DIR" status --porcelain)" ]; then echo "중단: $READ_DIR 에 고친 파일이 있습니다(읽기 전용 worktree). 확인 후 다시 실행하세요."; exit 1; fi
  git -C "$READ_DIR" checkout --quiet --detach "$TARGET"
else
  git -C "$HERE" worktree add --quiet --detach "$READ_DIR" "$TARGET"
fi
echo "   읽기 worktree: $READ_DIR @ $(git -C "$READ_DIR" log --oneline -1)"

echo "3) 설치"
(cd "$READ_DIR" && pnpm install --frozen-lockfile --silent)

echo "4) 실행"
while lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT + 1)); done
(cd "$READ_DIR" && PORT="$PORT" nohup pnpm dev:v5 >"$LOG" 2>&1 &)
for _ in $(seq 1 180); do
  if curl -s -o /dev/null --max-time 2 "http://localhost:$PORT/"; then
    echo "읽기 서버: http://localhost:$PORT  (v5/main $(git -C "$READ_DIR" rev-parse --short HEAD), 로그 $LOG)"
    echo "개발 로그인: http://localhost:$PORT/dev/v5-login?next=/account"
    exit 0
  fi
  sleep 1
done
echo "서버가 180초 안에 뜨지 않았습니다. 로그: $LOG"; tail -20 "$LOG"; exit 1
