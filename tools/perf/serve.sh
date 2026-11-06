#!/bin/bash
# P 측정 서버: tools/perf/serve.sh <worktree> <port> <iad1|icn1|none> <log.jsonl>
# next start + sim.mjs preload(운영 출처 흉내, 지연 모델). 빌드(next build)는 먼저 해 둔다.
set -euo pipefail
TREE="$1"; PORT="$2"; MODEL="$3"; LOG="$4"
SIM="$(cd "$(dirname "$0")" && pwd)/sim.mjs"
case "$MODEL" in
  iad1) DB=180; EDGE=200 ;;   # 운영 실측: 엣지(icn1)→함수(iad1) 왕복 ≈200ms, iad1↔서울 Supabase ≈180ms
  icn1) DB=3; EDGE=5 ;;
  none) DB=0; EDGE=0 ;;
esac
rm -f "$LOG"
cd "$TREE"
PERF_PUBLIC_HOST=1 PERF_DB_RTT_MS=$DB PERF_EDGE_MS=$EDGE PERF_LOG="$LOG" NODE_OPTIONS="--import $SIM" exec pnpm exec next start -p "$PORT"
