import { STEM_ELEMENT, STEM_YIN_YANG } from "./constants";
import type { FiveElement, HeavenlyStem, TenGod } from "./types";

function generates(source: FiveElement, target: FiveElement): boolean {
  return (
    (source === "WOOD" && target === "FIRE") ||
    (source === "FIRE" && target === "EARTH") ||
    (source === "EARTH" && target === "METAL") ||
    (source === "METAL" && target === "WATER") ||
    (source === "WATER" && target === "WOOD")
  );
}

function controls(source: FiveElement, target: FiveElement): boolean {
  return (
    (source === "WOOD" && target === "EARTH") ||
    (source === "FIRE" && target === "METAL") ||
    (source === "EARTH" && target === "WATER") ||
    (source === "METAL" && target === "WOOD") ||
    (source === "WATER" && target === "FIRE")
  );
}

export function getTenGod(
  dayStem: HeavenlyStem,
  targetStem: HeavenlyStem,
): TenGod {
  const dayElement = STEM_ELEMENT[dayStem];
  const targetElement = STEM_ELEMENT[targetStem];
  const sameYinYang = STEM_YIN_YANG[dayStem] === STEM_YIN_YANG[targetStem];

  if (dayElement === targetElement) {
    return sameYinYang ? "比肩" : "劫財";
  }

  if (generates(dayElement, targetElement)) {
    return sameYinYang ? "食神" : "傷官";
  }

  if (controls(dayElement, targetElement)) {
    return sameYinYang ? "偏財" : "正財";
  }

  if (controls(targetElement, dayElement)) {
    return sameYinYang ? "偏官" : "正官";
  }

  if (generates(targetElement, dayElement)) {
    return sameYinYang ? "偏印" : "正印";
  }

  throw new Error("Failed to resolve Ten God.");
}
