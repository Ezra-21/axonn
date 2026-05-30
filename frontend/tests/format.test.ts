import { describe, it, expect } from 'vitest';
import {
  capitalize,
  truncate,
  slugify,
  formatFullName,
  pluralize,
} from '../lib/utils/format';

describe('capitalize', () => {
  it('uppercases the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('leaves an already-capitalized word unchanged', () => {
    expect(capitalize('World')).toBe('World');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('truncate', () => {
  it('returns the string unchanged when within the limit', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates and appends an ellipsis when over the limit', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });

  it('trims trailing whitespace before the ellipsis', () => {
    expect(truncate('hello world', 6)).toBe('hello…');
  });

  it('returns empty string for non-positive max', () => {
    expect(truncate('hello', 0)).toBe('');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips special characters', () => {
    expect(slugify('Modern Sofa!! (2024)')).toBe('modern-sofa-2024');
  });

  it('collapses multiple separators', () => {
    expect(slugify('a   b___c')).toBe('a-b-c');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -Hello-  ')).toBe('hello');
  });
});

describe('formatFullName', () => {
  it('joins first and last name', () => {
    expect(formatFullName('John', 'Doe')).toBe('John Doe');
  });

  it('handles a missing last name', () => {
    expect(formatFullName('John')).toBe('John');
  });

  it('handles a missing first name', () => {
    expect(formatFullName(undefined, 'Doe')).toBe('Doe');
  });

  it('returns empty string when both are missing', () => {
    expect(formatFullName()).toBe('');
  });
});

describe('pluralize', () => {
  it('uses the singular form for a count of 1', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('appends s for other counts', () => {
    expect(pluralize(3, 'item')).toBe('3 items');
    expect(pluralize(0, 'item')).toBe('0 items');
  });

  it('uses a custom plural form when provided', () => {
    expect(pluralize(2, 'category', 'categories')).toBe('2 categories');
  });
});
