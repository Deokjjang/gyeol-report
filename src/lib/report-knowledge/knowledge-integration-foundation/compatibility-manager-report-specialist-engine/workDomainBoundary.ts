/** Source-neutral nonromantic policy is supplied by the offline composition root.
 * Reuse its full-ancestry validator; do not alter the runtime projection. */
import {sharedServices} from "../../../../../tools/compatibility-manager-report-specialist-engine/sharedServices";
export const {validateAncestry,domainReasons}=sharedServices;
export const MANAGER_REPORT_DOMAINS=sharedServices.allowedDomains;
