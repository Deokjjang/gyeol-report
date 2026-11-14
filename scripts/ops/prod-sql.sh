#!/usr/bin/env bash
# W3 P0 운영 직접 SQL 템플릿(CLI). 순서: ① 수동 백업 1회(db-backup.sh manual) ② 내 SQL + 감사 한 줄을 한 트랜잭션으로 ③ supabase db query --linked.
#   scripts/ops/prod-sql.sh --action cli_<무엇> --target <GR-XXXX|report_…|표> --why "<이유>" [--detail '<JSON 객체>'] [--no-backup] [--dry] <SQL 파일>
#   scripts/ops/prod-sql.sh --action cli_<무엇> --target … --why "…" --audit-only      # 감사 한 줄만(소급 기록 등)
# - SQL 파일에 begin/commit을 쓰지 않는다(이 스크립트가 감싼다). 바뀐 돈·책 행은 트리거(ops_audit_sql)가 sql_* 줄을 따로 남긴다.
# - --dry: 합친 SQL만 보여 주고 끝(백업·실행 없음). 운영 쓰기는 덕짱님 승인을 받은 조작만.
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
ROOT="${GYEOL_BACKUP_DIR:-$HOME/gyeol-backup}"
here="$(cd "$(dirname "$0")" && pwd)"
action="" target="" why="" detail="{}" file="" backup=1 dry=0 auditonly=0
while [ $# -gt 0 ]; do
  case "$1" in
    --action) action="$2"; shift 2 ;; --target) target="$2"; shift 2 ;; --why) why="$2"; shift 2 ;; --detail) detail="$2"; shift 2 ;;
    --no-backup) backup=0; shift ;; --dry) dry=1; shift ;; --audit-only) auditonly=1; shift ;;
    -*) echo "모르는 옵션 $1" >&2; exit 2 ;; *) file="$1"; shift ;;
  esac
done
[[ "$action" =~ ^cli_[a-z_]{1,36}$ ]] || { echo "--action은 cli_로 시작하는 소문자(최대 40자)" >&2; exit 2; }
[[ "$target" =~ ^[A-Za-z0-9_:.-]{1,120}$ ]] || { echo "--target 형식(영문·숫자·_:.- 120자)" >&2; exit 2; }
[ -n "$why" ] || { echo "--why 필요" >&2; exit 2; }
if [ "$auditonly" = 0 ]; then [ -f "$file" ] || { echo "SQL 파일 필요(또는 --audit-only)" >&2; exit 2; }; fi
if [ "$auditonly" = 0 ] && grep -Eiq '^[[:space:]]*(begin|commit|rollback)[[:space:]]*;' "$file"; then echo "SQL 파일에 begin/commit/rollback을 쓰지 마세요" >&2; exit 2; fi
# 감사 값은 JSON으로 만들어 달러 인용 안에 넣는다($는 지운다 — 인용 탈출 방지).
meta="$(WHY="$why" DETAIL="$detail" FILE="${file:-}" python3 - <<'PY'
import json, os, hashlib
d = json.loads(os.environ["DETAIL"] or "{}")
assert isinstance(d, dict), "detail must be an object"
f = os.environ["FILE"]
out = {"via": "cli", "why": os.environ["WHY"][:300], **d}
if f: out["file"] = os.path.basename(f); out["sha256"] = hashlib.sha256(open(f, "rb").read()).hexdigest()[:16]
print(json.dumps(out, ensure_ascii=False).replace("$", ""))
PY
)"
sql="$(mktemp -t prodsql).sql"; trap 'rm -f "$sql"' EXIT
{
  echo "begin;"
  echo "set local lock_timeout = '5s';"
  [ "$auditonly" = 0 ] && cat "$file" && echo ";"
  echo "insert into public.ops_audit_log(actor,action,target,detail) values('admin','$action','$target',\$w3\$$meta\$w3\$::jsonb);"
  echo "commit;"
} > "$sql"
if [ "$dry" = 1 ]; then cat "$sql"; exit 0; fi
if [ "$backup" = 1 ]; then bash "$here/db-backup.sh" manual "$action" || { echo "수동 백업 실패 — 멈춤" >&2; exit 1; }; fi
/usr/bin/perl -e 'alarm 300; exec @ARGV' supabase db query --linked --workdir "$ROOT/sb" -f "$sql"
