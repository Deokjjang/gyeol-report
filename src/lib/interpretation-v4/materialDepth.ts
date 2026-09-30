import { DAY_MASTER_DEPTH } from "./dayMasterMaterials";
import { DAY_PILLAR_DEPTH } from "./dayPillarMaterials";
import { ELEMENT_DEPTH } from "./elementMaterials";
import { TEN_GOD_DEPTH } from "./tenGodMaterials";
import { STRUCTURE_DEPTH } from "./structureDepthMaterials";
import { DEPTH_ALIASES, MARKER_DEPTH } from "./markerMaterials";
import type { MaterialDepth } from "./materialDepthTypes";

export const MATERIAL_DEPTH: readonly MaterialDepth[] = [
  ...DAY_MASTER_DEPTH, ...DAY_PILLAR_DEPTH, ...ELEMENT_DEPTH, ...TEN_GOD_DEPTH, ...STRUCTURE_DEPTH, ...MARKER_DEPTH,
];
const byFeature: ReadonlyMap<string, MaterialDepth> = new Map(MATERIAL_DEPTH.map(m => [m.feature, m]));
/** Input is the existing canonical V4 id. Aliases share prose, not extra fortune votes. */
export const depthFeature = (canonicalFeature: string) => DEPTH_ALIASES[canonicalFeature] ?? canonicalFeature;
export const getMaterialDepth = (canonicalFeature: string): MaterialDepth | undefined => byFeature.get(depthFeature(canonicalFeature));
