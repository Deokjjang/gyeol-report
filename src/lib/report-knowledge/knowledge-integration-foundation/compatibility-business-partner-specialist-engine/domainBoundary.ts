import {sharedServices} from "../../../../../tools/compatibility-business-partner-specialist-engine/sharedServices";
export const BUSINESS_PARTNER_DOMAINS=sharedServices.allowedDomains;
export const validateAncestry=sharedServices.validateAncestry;
export function domainReasons(domains:readonly string[]){return [...new Set([...sharedServices.domainReasons(domains),...domains.filter(d=>["WORK","CAREER","THINKING","MONEY","INVESTMENT"].includes(d)).map(d=>d+"_DOMAIN_NOT_APPROVED")])].sort();}
