#!/usr/bin/env bash
# W3 P0 무료 백업 — 운영 Supabase(gyeol-report-prod)를 매일 dump(역할·스키마·데이터)해 저장소 밖에 둔다.
#   db-backup.sh daily            launchd가 1시간마다 부른다. 오늘(KST) 백업이 이미 있으면 바로 끝(놓친 날은 다음 실행 때 바로 돈다).
#   db-backup.sh manual <이유>     migration·직접 SQL 조작 전 수동 1회(scripts/ops/prod-sql.sh가 먼저 부른다).
# 접속: supabase CLI 로그인 토큰(macOS 키체인, `supabase login`)만 쓴다. 비밀번호·토큰을 파일·로그에 쓰지 않는다.
# 보관: daily 14일분 · manual 30일. 위치: $GYEOL_BACKUP_DIR(기본 ~/gyeol-backup, FileVault 디스크). 안에는 고객 정보가 있다 — 저장소·클라우드에 올리지 않는다.
# 파일: roles·schema·data(Supabase 공식 복원 순서) + platform-schema(auth·storage 표 정의, 빈 Postgres 복원용). 복원 순서는 docs/v5/w3.md P0 「복원」.
# 필요: Docker(pg_dump를 컨테이너로 돌린다), supabase CLI, $ROOT/sb/supabase/.temp(project-ref 등 — 비밀 아님, install-db-backup.sh가 만든다).
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"
ROOT="${GYEOL_BACKUP_DIR:-$HOME/gyeol-backup}"
SB="$ROOT/sb"
mode="${1:-daily}"
umask 077
mkdir -p "$ROOT/daily" "$ROOT/manual" "$ROOT/logs"
LOG="$ROOT/logs/backup-$(TZ=Asia/Seoul date +%Y%m).log"
log() { echo "$(TZ=Asia/Seoul date '+%F %T KST') [$mode] $*" >> "$LOG"; }
notify() { /usr/bin/osascript -e "display notification \"$1\" with title \"결리포트 백업\"" >/dev/null 2>&1 || true; }
fail() { log "FAIL $*"; notify "백업 실패: $*"; exit 1; }
limit() { local s="$1"; shift; /usr/bin/perl -e 'alarm shift; exec @ARGV' "$s" "$@"; }

today="$(TZ=Asia/Seoul date +%F)"
case "$mode" in
  daily) dest="$ROOT/daily/$today"; [ -f "$dest/ok" ] && exit 0 ;;
  manual) why="$(printf '%s' "${2:-manual}" | tr -cd 'A-Za-z0-9_.-' | cut -c1-40)"; dest="$ROOT/manual/$(TZ=Asia/Seoul date +%Y%m%d-%H%M%S)-${why:-manual}" ;;
  *) echo "사용: $0 daily | manual <이유>" >&2; exit 2 ;;
esac
[ -f "$SB/supabase/.temp/project-ref" ] || fail "작업 폴더 없음($SB) — install-db-backup.sh를 먼저"
command -v supabase >/dev/null || fail "supabase CLI 없음"
if ! limit 20 docker info >/dev/null 2>&1; then
  open -ga Docker >/dev/null 2>&1 || true
  for _ in $(seq 1 18); do sleep 10; limit 20 docker info >/dev/null 2>&1 && break; done
  limit 20 docker info >/dev/null 2>&1 || fail "Docker가 꺼져 있음(다음 시간에 다시)"
fi
tmp="$dest.partial"; rm -rf "$tmp"; mkdir -p "$tmp"
log "start → $dest"
limit 900 supabase db dump --linked --workdir "$SB" --role-only -f "$tmp/roles.sql" >> "$LOG" 2>&1 || fail "roles dump"
limit 900 supabase db dump --linked --workdir "$SB" -f "$tmp/schema.sql" >> "$LOG" 2>&1 || fail "schema dump"
limit 1800 supabase db dump --linked --workdir "$SB" --data-only --use-copy -f "$tmp/data.sql" >> "$LOG" 2>&1 || fail "data dump"
# auth·storage 표 정의(플랫폼 관리 스키마) — 새 Supabase 프로젝트가 아닌 빈 Postgres(로컬 복원 연습)에도 되살릴 수 있게.
limit 900 supabase db dump --linked --workdir "$SB" -s auth,storage -f "$tmp/platform-schema.sql" >> "$LOG" 2>&1 || fail "platform schema dump"
for f in roles schema data platform-schema; do [ -s "$tmp/$f.sql" ] || fail "$f.sql 비어 있음"; done
grep -q '^COPY "public"."payment_orders"' "$tmp/data.sql" || fail "data.sql에 payment_orders 없음"
gzip -9 "$tmp/roles.sql" "$tmp/schema.sql" "$tmp/data.sql" "$tmp/platform-schema.sql"
(cd "$tmp" && shasum -a 256 ./*.sql.gz > SHA256SUMS)
date -u +%FT%TZ > "$tmp/ok"
rm -rf "$dest"; mv "$tmp" "$dest"
log "ok $(du -sh "$dest" | cut -f1)"
# 보관: daily 14일분(폴더 날짜 기준) · manual 30일 · 남은 partial 정리
cutoff="$(TZ=Asia/Seoul date -v-13d +%F)"
for d in "$ROOT"/daily/*; do b="$(basename "$d")"; [[ "$b" < "$cutoff" ]] && rm -rf "$d" && log "삭제(14일 지남) $b"; done
find "$ROOT/manual" -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
find "$ROOT/daily" "$ROOT/manual" -maxdepth 1 -name '*.partial' -mtime +1 -exec rm -rf {} + 2>/dev/null || true
exit 0
