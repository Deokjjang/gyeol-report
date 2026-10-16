// Half-open intervals [start, end); both historical evaluation and explicit use time checked.
export function instant(v: unknown): number | null {
 if (typeof v !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?(?:Z|[+-]\d\d:\d\d)$/.test(v)) return null;
 const normalized = v.replace(/(?:Z|[+-]\d\d:\d\d)$/, 'Z');
 const n = Date.parse(v); if (!Number.isFinite(n)) return null;
 const wall = new Date(Date.parse(normalized));
 if (!Number.isFinite(wall.getTime()) || wall.toISOString().slice(0,19) !== v.slice(0,19)) return null;
 return n;
}
export function validityReasons(x: { issuedAt: string; validFrom: string; validUntil: string }, evaluatedAt: string, verificationTime: string): string[] {
 const issued = instant(x.issuedAt), start = instant(x.validFrom), end = instant(x.validUntil), evaluation = instant(evaluatedAt), current = instant(verificationTime);
 if ([issued,start,end,evaluation,current].some(n => n === null)) return ['INVALID_APPROVAL_DATE'];
 if (start! >= end! || issued! >= end!) return ['INVALID_APPROVAL_WINDOW'];
 if (current! < evaluation!) return ['VERIFICATION_PRECEDES_EVALUATION'];
 if (issued! > evaluation! || evaluation! < start! || current! < start!) return ['APPROVAL_NOT_YET_VALID'];
 if (evaluation! >= end! || current! >= end!) return ['APPROVAL_EXPIRED'];
 return [];
}
