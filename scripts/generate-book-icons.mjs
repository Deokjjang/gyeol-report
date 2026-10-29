import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
// P5: 새 표지 디자인 아이콘(책등 여섯 권). 원본은 public/brand/icon-v5.svg, 결과 파일명에 버전을 붙인다.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const source = await readFile(new URL("../public/brand/icon-v5.svg", import.meta.url));
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((png, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i]; header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));
// iOS는 모서리를 스스로 둥글리므로 apple-touch-icon은 꽉 찬 사각형으로.
const square = Buffer.from(source.toString().replace(/rx="112"/, 'rx="0"'));
await sharp(square).resize(180, 180).png().toFile(new URL("../public/brand/apple-touch-icon-v5.png", import.meta.url).pathname);
for (const size of [192, 512]) await sharp(source).resize(size, size).png().toFile(new URL(`../public/brand/icon-${size}-v5.png`, import.meta.url).pathname);
