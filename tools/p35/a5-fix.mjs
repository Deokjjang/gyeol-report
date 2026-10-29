// A5 경험 단정 문장 교체(정확 일치 1회). node tools/p35/a5-fix.mjs
import fs from "node:fs"; import path from "node:path";
const K = path.resolve(import.meta.dirname, "../../src/data/knowledge-v5");
const FIX = [
  ["myeongri/climate-02.json", "주말에 취미로 만든 소품을 팔아 쏠쏠한 용돈을 챙겨 본 적이 있습니다.", "주말에 취미로 만든 소품을 팔아 쏠쏠한 용돈을 챙기는 편입니다."],
  ["myeongri/structure-01.json", "같은 일을 겪어 본 사람의 이야기와 자료를 찾아 건넵니다.", "같은 길을 먼저 지나간 사람들의 이야기와 자료를 찾아 건넵니다."],
  ["myeongri/twelve-stage-02.json", "당신에게는 겪어 본 사람의 눈이 있어서 남들이 못 보는 함정을 먼저 봅니다.", "당신에게는 한발 물러서서 판을 읽는 노련한 눈이 있어서 남들이 못 보는 함정을 먼저 봅니다."],
  ["myeongri/twelve-stage-02.json", "새 기획이 나오면 '그거 3년 전에 해 봤는데 이 부분에서 막혔어요'라고 말해 헛걸음을 줄여 줍니다.", "새 기획이 나오면 '이 방식은 이 부분에서 막히기 쉬워요'라고 먼저 짚어 헛걸음을 줄여 줍니다."],
  ["myeongri/yin-yang-02.json", "비슷한 말을 남이 먼저 해서 박수를 받는 걸 지켜본 적이 있습니다.", "비슷한 말을 남이 먼저 해서 박수를 받는 걸 지켜보는 일이 잦습니다."],
  ["myeongri/shinsal-02.json", "첫 월급을 받던 날 혼자 떠날 기차표부터 끊었던 사람입니다.", "목돈이 들어오면 혼자 떠날 기차표부터 끊는 사람입니다."],
  ["myeongri/shinsal-02.json", "년지에 있으면 어릴 때 이사나 전학을 겪었거나, 집안이 고향을 떠나 자리를 잡은 경우가 많습니다.", "년지에 있으면 낯선 동네에 자리를 잡는 일에 일찍부터 익숙해지는 편이고, 고향 밖으로 나가는 길을 두려워하지 않습니다."],
  ["myeongri/shinsal-02.json", "집안에 멋을 아는 어른이 있었던 경우가 많습니다.", "멋을 아는 어른의 취향을 일찍부터 흡수하는 자리입니다."],
  ["myeongri/ten-god-02.json", "어릴 적 집에 먹을 것과 웃음이 넉넉했던 자리로 읽습니다.", "먹을 것과 웃음이 넉넉한 집안 분위기를 품은 자리로 봅니다."],
  ["myeongri/ten-god-02.json", "집안에 장사나 사업의 공기가 있었던 자리로 읽습니다.", "장사나 사업의 공기를 가까이 두는 집안 분위기와 이어지는 자리로 봅니다."],
  ["myeongri/twelve-stage-02.json", "어린 시절 집안이 크게 벌이기보다 지키는 분위기였던 것으로 읽습니다.", "크게 벌이기보다 지키는 집안 분위기와 이어지는 자리로 봅니다."],
  ["myeongri/twelve-stage-02.json", "어린 시절 집안이 말수 적고 조용한 분위기였던 것으로 읽습니다.", "말수 적고 조용한 집안 분위기와 이어지는 자리로 봅니다."],
  ["mbti/ISTJ.json", "겪어 본 것을 기준으로 삼습니다.", "직접 확인한 것을 기준으로 삼습니다."],
  ["fusion/ENFP.json", "쇠는 겪어 본 사람의 눈이 밝은 자리라", "쇠는 노련한 눈이 밝은 자리라"],
  ["fusion/ESFJ.json", "전에 해 본 사람과 순서부터 확인하는 편이라", "먼저 해 낸 사람에게 순서부터 확인하는 편이라"],
  ["fusion/ESTP.json", "겪어 본 눈이 브레이크를 밟아", "노련한 눈이 브레이크를 밟아"],
  ["fusion/ESTP.json", "집에 오는 길엔 예전에 접었던 장사의 손익 메모를 다시 엽니다.", "집에 오는 길엔 휴대폰 계산기로 손익부터 두드려 봅니다."],
  ["fusion/ENTP.json", "'그거 해 봤는데 여기서 막혀'를 아는 눈이", "'그건 여기서 막혀'를 먼저 아는 눈이"],
];
let n = 0;
for (const [rel, from, to] of FIX) {
  const p = path.join(K, rel); const t = fs.readFileSync(p, "utf8");
  const c = t.split(from).length - 1;
  if (c !== 1) { console.error(`${rel}: '${from.slice(0, 30)}' ${c}회`); process.exitCode = 1; continue; }
  const out = t.replace(from, to); JSON.parse(out); fs.writeFileSync(p, out); n++;
}
console.log("교체", n, "/", FIX.length);
