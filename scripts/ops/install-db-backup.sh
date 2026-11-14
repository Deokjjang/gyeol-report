#!/usr/bin/env bash
# W3 P0: 매일 백업(launchd) 설치. 저장소 밖 ~/gyeol-backup에 스크립트 사본·CLI 작업 폴더를 두고 LaunchAgent를 올린다.
#   scripts/ops/install-db-backup.sh <supabase/.temp가 있는 저장소 경로(기본: 이 저장소)>
# 비밀값은 다루지 않는다(CLI 로그인 토큰은 키체인). project-ref·pooler-url은 비밀이 아니다.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="${1:-$(cd "$here/../.." && pwd)}"
ROOT="${GYEOL_BACKUP_DIR:-$HOME/gyeol-backup}"
umask 077
mkdir -p "$ROOT/bin" "$ROOT/sb/supabase/.temp" "$ROOT/logs" "$HOME/Library/LaunchAgents"
for f in project-ref pooler-url linked-project.json postgres-version; do
  [ -f "$repo/supabase/.temp/$f" ] || { echo "없음: $repo/supabase/.temp/$f (supabase link 필요)" >&2; exit 1; }
  cp "$repo/supabase/.temp/$f" "$ROOT/sb/supabase/.temp/$f"
done
install -m 700 "$here/db-backup.sh" "$ROOT/bin/db-backup.sh"
plist="$HOME/Library/LaunchAgents/com.gyeolreport.db-backup.plist"
cat > "$plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.gyeolreport.db-backup</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$ROOT/bin/db-backup.sh</string><string>daily</string></array>
  <key>EnvironmentVariables</key><dict><key>GYEOL_BACKUP_DIR</key><string>$ROOT</string></dict>
  <key>RunAtLoad</key><true/>
  <key>StartInterval</key><integer>3600</integer>
  <key>StandardOutPath</key><string>$ROOT/logs/launchd.out.log</string>
  <key>StandardErrorPath</key><string>$ROOT/logs/launchd.err.log</string>
</dict></plist>
PLIST
launchctl bootout "gui/$(id -u)/com.gyeolreport.db-backup" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$plist"
echo "설치됨: $plist (1시간마다 확인, 오늘 백업이 없으면 바로 dump) · 백업 위치 $ROOT/daily"
