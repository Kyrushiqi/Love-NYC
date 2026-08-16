/**
 * Basic content filtering for user-submitted entries
 * Catches common profanity and PII patterns
 */

// Simple profanity word list (intentionally basic for hackathon)
const PROFANITY_WORDS = [
  'damn', 'hell', 'crap', 'shit', 'piss', 'asshole', 'bastard',
  'bitch', 'fuck', 'motherfucker', 'goddamn', 'ass', 'dick', 'pussy',
  'cock', 'whore', 'slut', 'fag', 'retard', 'nigger',
];

// PII patterns
const PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, // Email
  /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, // Credit card
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
  const reasons: string[] = [];
  let sanitized = text;

  // Check for profanity (case-insensitive)
  const lowerText = text.toLowerCase();
  for (const word of PROFANITY_WORDS) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lowerText)) {
      reasons.push('Profanity detected');
      // Replace with censored version
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
      reasons.push('Personal information detected (email, phone, SSN, etc.)');
      // Don't sanitize PII, just reject it
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
    return null; // Reject, don't sanitize for now
  }

  return trimmed;
}
