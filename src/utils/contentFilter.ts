/**
 * Basic content filtering for user-submitted entries
 * Catches common profanity and PII patterns
 */

// Simple profanity word list (intentionally basic for hackathon)
const PROFANITY_WORDS = [
  'damn', 'crap', 'shit', 'piss', 'asshole', 'bastard',
  'bitch', 'fuck', 'motherfucker', 'goddamn', 'dick', 'pussy',
  'cock', 'whore', 'slut', 'fag', 'retard', 'nigger',
];

// PII patterns (no global 'g' flag to avoid stateful RegExp.test bugs)
const PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN: 000-00-0000
  /\b(?:\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/, // Phone: 123-456-7890
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email
  /\b(?:\d{4}[-\s]?){3}\d{4}\b/, // Credit card
];

export interface ContentFilterResult {
  isClean: boolean;
  reasons: string[]; // Explanation of what was flagged
  sanitized: string; // Cleaned version
}

/**
 * Filter user-submitted content for profanity and PII
 * @param text Raw user input
 * @returns Filtering result with clean flag and sanitized text
 */
export function filterUserContent(text: string): ContentFilterResult {
  if (!text || typeof text !== 'string') {
    return { isClean: false, reasons: ['Empty content'], sanitized: '' };
  }

  const reasons: string[] = [];
  let sanitized = text;

  // Check for profanity (word boundary check)
  const lowerText = text.toLowerCase();
  for (const word of PROFANITY_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      reasons.push('Profanity detected');
      sanitized = sanitized.replace(
        new RegExp(`\\b${word}\\b`, 'gi'),
        '*'.repeat(word.length)
      );
      break; // Only flag once
    }
  }

  // Check for PII patterns
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push('Personal information detected (email, phone, SSN)');
      break;
    }
  }

  const isClean = reasons.length === 0;

  return {
    isClean,
    reasons,
    sanitized: isClean ? text : sanitized,
  };
}

/**
 * Validate and normalize user input
 * @param text Raw input
 * @param maxLength Maximum character length
 * @returns Trimmed and validated text, or null if invalid
 */
export function validateJournalEntry(
  text: string,
  maxLength: number = 140
): string | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();

  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null;
  }

  const filtered = filterUserContent(trimmed);
  if (!filtered.isClean) {
    return null;
  }

  return trimmed;
}
