/** 최종 A-2: 시험·도구 전용 이미지 대장 파일(운영 번들 밖). 불러와 넣으면 브리프·검사가 예전처럼 같은 일주 이전 책을 본다. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { useImageLedger, type ImageLedger } from "../../src/lib/brief/imageLedger";
export const FILE_LEDGER_PATH = join(process.cwd(), "tools/final/data/image-ledger.json");
export const loadFileLedger = (): ImageLedger => JSON.parse(readFileSync(FILE_LEDGER_PATH, "utf8")) as ImageLedger;
export function useFileLedger(): ImageLedger { const l = loadFileLedger(); useImageLedger(l); return l; }
