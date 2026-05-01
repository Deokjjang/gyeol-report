import {
  BRANCH_CLASHES,
  BRANCH_COMBINATIONS,
  STEM_COMBINATIONS,
} from "./constants";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "./types";

export type RelationPosition = "year" | "month" | "day" | "hour";

export type PillarSetForRelations = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour?: Pillar;
};

export type StemRelation = {
  type: "STEM_COMBINATION";
  pair: readonly [HeavenlyStem, HeavenlyStem];
  positions: readonly [RelationPosition, RelationPosition];
};

export type BranchRelation = {
  type: "BRANCH_COMBINATION" | "BRANCH_CLASH";
  pair: readonly [EarthlyBranch, EarthlyBranch];
  positions: readonly [RelationPosition, RelationPosition];
};

export type RelationsAnalysisResult = {
  stemCombinations: StemRelation[];
  branchCombinations: BranchRelation[];
  branchClashes: BranchRelation[];
};

type PillarEntry = {
  position: RelationPosition;
  pillar: Pillar;
};

function getOrderedPillarEntries(
  pillars: PillarSetForRelations,
): PillarEntry[] {
  const entries: PillarEntry[] = [
    { position: "year", pillar: pillars.year },
    { position: "month", pillar: pillars.month },
    { position: "day", pillar: pillars.day },
  ];

  if (pillars.hour) {
    entries.push({ position: "hour", pillar: pillars.hour });
  }

  return entries;
}

function isUnorderedPair<T>(
  first: T,
  second: T,
  pair: readonly [T, T],
): boolean {
  return (
    (first === pair[0] && second === pair[1]) ||
    (first === pair[1] && second === pair[0])
  );
}

function findStemCombination(
  first: HeavenlyStem,
  second: HeavenlyStem,
): readonly [HeavenlyStem, HeavenlyStem] | undefined {
  return STEM_COMBINATIONS.find((pair) =>
    isUnorderedPair(first, second, pair),
  );
}

function findBranchCombination(
  first: EarthlyBranch,
  second: EarthlyBranch,
): readonly [EarthlyBranch, EarthlyBranch] | undefined {
  return BRANCH_COMBINATIONS.find((pair) =>
    isUnorderedPair(first, second, pair),
  );
}

function findBranchClash(
  first: EarthlyBranch,
  second: EarthlyBranch,
): readonly [EarthlyBranch, EarthlyBranch] | undefined {
  return BRANCH_CLASHES.find((pair) => isUnorderedPair(first, second, pair));
}

export function analyzeRelations(
  pillars: PillarSetForRelations,
): RelationsAnalysisResult {
  const entries = getOrderedPillarEntries(pillars);
  const stemCombinations: StemRelation[] = [];
  const branchCombinations: BranchRelation[] = [];
  const branchClashes: BranchRelation[] = [];

  for (let firstIndex = 0; firstIndex < entries.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < entries.length;
      secondIndex += 1
    ) {
      const first = entries[firstIndex];
      const second = entries[secondIndex];

      if (!first || !second) {
        throw new Error("Failed to resolve relation pair.");
      }

      const positions = [first.position, second.position] as const;
      const stemCombination = findStemCombination(
        first.pillar.stem,
        second.pillar.stem,
      );
      const branchCombination = findBranchCombination(
        first.pillar.branch,
        second.pillar.branch,
      );
      const branchClash = findBranchClash(
        first.pillar.branch,
        second.pillar.branch,
      );

      if (stemCombination) {
        stemCombinations.push({
          type: "STEM_COMBINATION",
          pair: stemCombination,
          positions,
        });
      }

      if (branchCombination) {
        branchCombinations.push({
          type: "BRANCH_COMBINATION",
          pair: branchCombination,
          positions,
        });
      }

      if (branchClash) {
        branchClashes.push({
          type: "BRANCH_CLASH",
          pair: branchClash,
          positions,
        });
      }
    }
  }

  return {
    stemCombinations,
    branchCombinations,
    branchClashes,
  };
}
