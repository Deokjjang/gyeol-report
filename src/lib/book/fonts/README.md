# Book OG font

Noto Sans KR (Google Fonts, Adobe copyright), SIL OFL 1.1; see `OFL.txt`.

Source: https://github.com/google/fonts/tree/main/ofl/notosanskr

Local conversion using FontTools 4.66.1:

```
fonttools varLib.instancer NotoSansKR\[wght\].ttf wght=700 --output=Book-Bold.ttf
pyftsubset Book-Bold.ttf --unicodes='*' --flavor=woff --output-file=NotoSansKR-Book.woff
```

Full source character coverage retained (23,174 glyph mappings). `coverage.json`
is the sorted contiguous Unicode ranges from the output font's `getBestCmap()`.
Rare unsupported name characters render as a visible box in OG only, avoiding
Next OG's network font fallback. Korean/Latin titles and names are verified.
Original name is unchanged in HTML. No remote fonts, emoji or images at runtime.

The 2.9 MiB font is a server-only filesystem asset, read once by the Node OG
renderer. It is not imported into a browser bundle. No new npm dependency.
FontTools is a local conversion tool, not a build/runtime dependency.
