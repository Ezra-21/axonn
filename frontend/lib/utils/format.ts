/**
 * Formatting utilities
 * Small pure helpers for presenting strings, numbers and dates.
 */

/**
 * Capitalize the first character of a string.
 */
export function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Truncate a string to `max` characters, appending an ellipsis when cut.
 */
export function truncate(value: string, max: number): string {
  if (!value) return '';
  if (max <= 0) return '';
  if (value.length <= max) return value;
  return value.slice(0, max).trimEnd() + '…';
}

/**
 * Convert arbitrary text into a URL-friendly slug.
 */
export function slugify(value: string): string {
  return (value ?? '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Build a person's full name from first/last parts, trimming gaps.
 */
export function formatFullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

/**
 * Pluralize a noun based on a count ("1 item" / "2 items").
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}
