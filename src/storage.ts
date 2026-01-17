import type { Template } from './types';
import type { FontScaleConfig } from './components/FontScaleSlider';

const STORAGE_KEYS = {
  CUSTOM_TEMPLATES: 'customTemplates',
  LAST_SELECTED: 'lastSelectedTemplate',
  FONT_SCALES: 'fontScales',
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

const DEFAULT_FONT_SCALE: FontScaleConfig = {
  mode: 'global',
  global: 1,
  perField: {},
};

function loadAllFontScales(): Record<string, FontScaleConfig> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FONT_SCALES);
    if (!data) return {};
    const parsed = JSON.parse(data);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function loadFontScaleForTemplate(templateName: string): FontScaleConfig {
  const scales = loadAllFontScales();
  const config = scales[templateName];
  if (!config) return { ...DEFAULT_FONT_SCALE };
  return {
    mode: config.mode === 'perField' ? 'perField' : 'global',
    global: typeof config.global === 'number' ? config.global : 1,
    perField: typeof config.perField === 'object' && config.perField !== null
      ? config.perField
      : {},
  };
}

export function saveFontScaleForTemplate(templateName: string, config: FontScaleConfig): void {
  const scales = loadAllFontScales();
  scales[templateName] = config;
  localStorage.setItem(STORAGE_KEYS.FONT_SCALES, JSON.stringify(scales));
}
