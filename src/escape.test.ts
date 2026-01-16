import { describe, it, expect } from 'vitest';
import { escapeHtml, renderTemplate } from './escape';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('"quote"')).toBe('&quot;quote&quot;');
    expect(escapeHtml("'single'")).toBe('&#39;single&#39;');
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('passes through safe strings unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});

describe('renderTemplate', () => {
  it('replaces placeholders with escaped values', () => {
    const template = '<p>{{name}}</p>';
    const result = renderTemplate(template, { name: '<script>alert(1)</script>' });
    expect(result).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
  });

  it('replaces multiple occurrences of same variable', () => {
    const template = '{{x}} and {{x}}';
    const result = renderTemplate(template, { x: 'test' });
    expect(result).toBe('test and test');
  });

  it('replaces missing variables with empty string', () => {
    const template = '{{missing}}';
    const result = renderTemplate(template, {});
    expect(result).toBe('');
  });
});
