# P0-2 진행 기록 (중단 후 재개용)

- worktree: ~/Developer/gyeol-worktrees/v5-main, 브랜치 v5/main, 기준 origin/master(0dde75a8) + dc5707f4
- [x] 0) p01-phase0-check worktree 제거, .env.local(OPENAI_API_KEY 한 줄, gitignore 확인)
- [x] 1) docs/v5/branches.md, 2) docs/v5/SPEC.md 작성
- [x] 2b) CLAUDE.md 병합본 작성 (초안, 제거 작업 후 LLM 줄 재확인)
- [ ] 3a) OpenAI 제거: ca1aad97 변경을 경로 기반 적용(A/M=checkout, D=git rm), docs/eval 산출물 제외
- [x] 3a) OpenAI 제거 커밋 b811597d (증명 docs/v5/openai-removal-import-graph.md)
- [ ] 3b) q1 knowledge-v5 + lint + inputs.json 가져옴(staged), 다음: zod/tsx 설치, lint 테스트, 커밋
- [x] 3b) knowledge-v5/lint/inputs.json/zod+tsx(pnpm add)/lint test
- [ ] 3c) 로딩 화면(q2 컴포넌트·page.tsx retry·테스트), 절입일 문구(q3 route+test, q3c 테스트 es2017 수정) 복원됨 → 테스트 확인 후 커밋
