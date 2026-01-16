import { describe, it, expect, beforeEach } from 'vitest';
import { loadCustomTemplates, saveCustomTemplates, loadLastSelected } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadCustomTemplates', () => {
    it('returns empty array when nothing stored', () => {
      expect(loadCustomTemplates()).toEqual([]);
    });

    it('returns empty array for invalid JSON', () => {
      localStorage.setItem('customTemplates', 'not-json');
      expect(loadCustomTemplates()).toEqual([]);
    });

    it('filters out invalid template objects', () => {
      localStorage.setItem('customTemplates', JSON.stringify([
        { name: 'valid', html: '<p>test</p>' },
        { name: 'missing-html' },
        { html: 'missing-name' },
        'not-an-object',
      ]));
      const result = loadCustomTemplates();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('valid');
    });
  });

  describe('saveCustomTemplates', () => {
    it('saves templates to localStorage', () => {
      const templates = [{ name: 'test', html: '<p>hi</p>' }];
      saveCustomTemplates(templates);
      expect(JSON.parse(localStorage.getItem('customTemplates')!)).toEqual(templates);
    });
  });

  describe('loadLastSelected', () => {
    it('returns null when nothing stored', () => {
      expect(loadLastSelected()).toBeNull();
    });

    it('returns stored value', () => {
      localStorage.setItem('lastSelectedTemplate', 'builtin-0');
      expect(loadLastSelected()).toBe('builtin-0');
    });
  });
});
