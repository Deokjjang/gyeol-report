#!/usr/bin/env bash
# W3 P0 Vercel 빌드 줄이기(vercel.json ignoreCommand). exit 0 = 이 빌드 건너뜀, exit 1 = 빌드.
# - master(운영)는 늘 빌드한다. 작업 브랜치는 vercel.json git.deploymentEnabled가 아예 막는다(master·v5/main만).
# - 지난 성공 배포(VERCEL_GIT_PREVIOUS_SHA)부터 바뀐 파일이 모두 「문서」일 때만 건너뛴다. 확인을 못 하면(첫 배포·얕은 clone에 커밋 없음·diff 실패) 빌드한다.
# - 문서 = *.md(어디든) 또는 docs/ 아래 그림·글 파일(png·jpg·jpeg·webp·gif·txt·csv·pdf).
#   단 docs/validation/**(v4 지식 코드가 실행 중에 읽음)와 docs/product/**(MBTI 원천 JSON을 실행 중에 읽음)는 코드로 친다.
set -u
ref="${VERCEL_GIT_COMMIT_REF:-}"
prev="${VERCEL_GIT_PREVIOUS_SHA:-}"
head="${VERCEL_GIT_COMMIT_SHA:-HEAD}"
if [ "$ref" = "master" ]; then echo "ignore-build: master는 늘 빌드"; exit 1; fi
if [ -z "$prev" ]; then echo "ignore-build: 지난 배포 없음 → 빌드"; exit 1; fi
if ! git cat-file -e "${prev}^{commit}" 2>/dev/null; then echo "ignore-build: 지난 배포 커밋이 clone에 없음 → 빌드"; exit 1; fi
if ! files="$(git diff --name-only "$prev" "$head" 2>/dev/null)"; then echo "ignore-build: diff 실패 → 빌드"; exit 1; fi
if [ -z "$files" ]; then echo "ignore-build: 바뀐 파일 없음(다시 배포) → 빌드"; exit 1; fi
while IFS= read -r f; do
  case "$f" in
    docs/validation/*|docs/product/*) echo "ignore-build: 코드로 치는 문서 $f → 빌드"; exit 1 ;;
    *.md) ;;
    docs/*.png|docs/*.jpg|docs/*.jpeg|docs/*.webp|docs/*.gif|docs/*.txt|docs/*.csv|docs/*.pdf) ;;
    *) echo "ignore-build: 코드 $f → 빌드"; exit 1 ;;
  esac
done <<< "$files"
echo "ignore-build: 문서만 바뀜 → 건너뜀"
exit 0
