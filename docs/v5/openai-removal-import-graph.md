# OpenAI 작가 코드 제거 — import 그래프 증명

도구: `node tools/quality-q2/import-graph.mjs --root <checkout>` (정적 import·re-export·dynamic import·require, `@/` alias 해석, 진입점 = Next.js app 라우트·페이지 92개).

## 제거 전 (origin/master 0dde75a8)
```
entry points: 92
src .ts/.tsx files: 1726
reachable files from entries: 861
unresolved local imports: 3
targets existing: 17/17, lines: 7530, reachable: 17
```
대상 17개 파일 7,530줄은 모두 진입점에서 도달 가능했다. 단, 호출은 `OPENAI_REPORT_WRITER_ENABLED=1`일 때만 활성화되는 구조였다(`reportWriterRuntime.ts`). Production 환경변수는 조회하지 않았으므로 운영 값은 UNVERIFIED.
(미해결 import 3건은 `/dev/book-preview`가 tests/ 픽스처를 가리키는 기존 상태이며 제거와 무관.)

## 제거 후 (v5/main)
```
entry points: 92
src .ts/.tsx files: 1709
reachable files from entries: 847
unresolved local imports: 0
targets existing: 0/17, lines: 0, reachable: 0
```
대상 17개 파일 존재 0, 미해결 local import 0, 대상 이름을 참조하는 소스 0건. tests/에는 `not.toContain("openai…Writer")` 부정 단언 7건만 남아 있다.

## 적용 방식
v5/quality-q2-openai-removal(ca1aad97)의 변경을 경로 기반으로 적용(추가·수정 = `git checkout ca1aad97 -- <path>`, 삭제 = `git rm`). a7265be7과 파일 목록 동일, origin/master가 그 사이 바꾼 파일과 겹침 0. 125개 파일, +596/−23,679줄.
