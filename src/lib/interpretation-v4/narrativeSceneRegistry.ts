import { PERSONAL_SCENES } from "./narrativeScenePersonal";
import { SOCIAL_SCENES } from "./narrativeSceneSocial";
import { WORK_SCENES } from "./narrativeSceneWork";
import type { SceneSpec } from "./narrativeSceneCore";
export const NARRATIVE_SCENES: readonly SceneSpec[] = [...PERSONAL_SCENES, ...SOCIAL_SCENES, ...WORK_SCENES];
