import type { Template } from './types';

const STORAGE_KEYS = {
  CUSTOM_TEMPLATES: 'customTemplates',
  LAST_SELECTED: 'lastSelectedTemplate',
} as const;

export function loadCustomTemplates(): Template[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Template =>
        typeof t === 'object' &&
        t !== null &&
        typeof t.name === 'string' &&
        typeof t.html === 'string'
    );
  } catch {
    return [];
  }
}

export function saveCustomTemplates(templates: Template[]): void {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(templates));
}

export function loadLastSelected(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_SELECTED);
}

export function saveLastSelected(value: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_SELECTED, value);
}

export function clearLastSelected(): void {
  localStorage.removeItem(STORAGE_KEYS.LAST_SELECTED);
}
