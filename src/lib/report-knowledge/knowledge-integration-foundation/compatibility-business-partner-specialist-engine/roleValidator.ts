import {toCompatibilityGenerationInput} from "../../../report-generation/reportInputAdapter";
export const ROLE_VERSION="compatibility-fixed-ab-v1" as const;
export function validateFixedRole(version:unknown,roles?:{personA:string;personB:string}){return [...(version!==ROLE_VERSION?["V4_FIXED_ROLE_REQUIRED"]:[]),...(roles&&(roles.personA!=="A"||roles.personB!=="B")?["ROLE_DECLARATION_CHANGED"]:[])];}
export function auditLegacyRole(payload:unknown){const n=toCompatibilityGenerationInput(payload);return {normalized:n.ok,normalizationError:n.ok?null:n.error,normalizedRoleVersion:n.ok?n.value.compatibilityRoleVersion:null,v4RoleAccepted:n.ok&&!validateFixedRole(n.value.compatibilityRoleVersion).length,actualPartnership:"UNKNOWN",actualAuthority:"UNKNOWN"};}
