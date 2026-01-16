import { describe, it, expect } from 'vitest';
import { extractVariablesInOrder, humanizeLabel } from './template-utils';

describe('extractVariablesInOrder', () => {
  it('extracts variables in order of appearance', () => {
    const html = '{{first}} then {{second}} then {{third}}';
    expect(extractVariablesInOrder(html)).toEqual(['first', 'second', 'third']);
  });

  it('deduplicates while preserving first occurrence order', () => {
    const html = '{{a}} {{b}} {{a}} {{c}} {{b}}';
    expect(extractVariablesInOrder(html)).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for no variables', () => {
    expect(extractVariablesInOrder('<p>no vars</p>')).toEqual([]);
  });
});

describe('humanizeLabel', () => {
  it('replaces underscores with spaces', () => {
    expect(humanizeLabel('social_media_handle')).toBe('social media handle');
  });

  it('handles single words', () => {
    expect(humanizeLabel('name')).toBe('name');
  });
});
