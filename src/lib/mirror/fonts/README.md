# 「남이 본 나」 링크 미리보기 글꼴(서브셋)

Noto Sans KR(Google Fonts, Adobe copyright), SIL OFL 1.1 — `OFL.txt`.

원본: `src/lib/book/fonts/NotoSansKR-Book.woff`(같은 저장소, 굵기 700 인스턴스 · 전체 23,174자). 미리보기 이미지에 필요한 글자만 남겼다:
KS X 1001 한글 2,350자 + 한글 자모(ㄱ~ㅣ) + 영문 · 숫자 · 기본 기호(· … 「」 → ♥ ★ 등) = 2,513자, 3.0MB → 197KB.

```
pyftsubset NotoSansKR-Book.woff --unicodes-file=subset-unicodes.txt --flavor=woff --layout-features='' --no-hinting --desubroutinize --output-file=NotoSansKR-Mirror.woff
```

(FontTools 4.66.1, 로컬 변환 도구 — 빌드 · 실행 의존성 아님.) `coverage.json`은 결과 글꼴 `getBestCmap()`의 연속 구간.
서브셋에 없는 글자(드문 이름 글자)가 있을 때만 원본 글꼴을 두 번째로 함께 넘기고, 그래도 없으면 □로 그린다(Next OG의 원격 글꼴 대체를 부르지 않게).
서버 전용 파일이다(브라우저 묶음에 들어가지 않는다). 사진은 미리보기에 쓰지 않는다.
