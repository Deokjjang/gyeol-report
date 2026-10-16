import { freshNarrativeMemory, openingFamily, narrativeSubject, memoryCount } from '../../../interpretation-v4/narrativeMemory';
import { detectEnding } from '../../../interpretation-v4/narrativeEndings';
import type { NarrativeMemory } from '../../../interpretation-v4/narrativeCore';
import type { SentenceLedger } from './types';

/** Private per draft, never shared with a customer Renderer session. */
export class EditorialMemory {
  readonly existing: NarrativeMemory = freshNarrativeMemory();
  readonly phrases = new Set<string>();
  observe(s: SentenceLedger) {
    this.phrases.add(s.actualText);
    for (const id of s.evidenceIds) Object.defineProperty(this.existing.usedEvidence, id, { value: memoryCount(this.existing.usedEvidence, id) + 1, enumerable: true, configurable: true });
    this.existing.usedClaims = [...new Set([...this.existing.usedClaims, s.primaryClaimId])];
    this.existing.endingHistory = [...this.existing.endingHistory, detectEnding(s.actualText)].slice(-3);
    this.existing.recentOpenings = [...this.existing.recentOpenings, openingFamily(s.actualText)].slice(-3);
    this.existing.recentSubjects = [...this.existing.recentSubjects, narrativeSubject(s.actualText)].slice(-3);
    this.existing.sentenceLengthHistory = [...this.existing.sentenceLengthHistory, s.actualText.length < 45 ? 'S' : s.actualText.length < 95 ? 'M' : 'L'].slice(-4) as NarrativeMemory['sentenceLengthHistory'];
  }
}
