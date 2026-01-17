import type { FontScaleConfig } from './components/FontScaleSlider';

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

export function renderTemplate(
  html: string,
  values: Record<string, string>,
  fontScale?: FontScaleConfig
): string {
  let result = html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const escaped = escapeHtml(values[key] ?? '');

    // Per-field mode: wrap value in styled span
    if (fontScale?.mode === 'perField') {
      const scale = fontScale.perField[key] ?? 1;
      if (scale !== 1) {
        return `<span style="font-size: calc(1em * ${String(scale)})">${escaped}</span>`;
      }
    }

    return escaped;
  });

  // Global mode: inject CSS into <head>
  if (fontScale?.mode === 'global' && fontScale.global !== 1) {
    const cssInjection = `<style>:root { --font-scale: ${String(fontScale.global)}; font-size: calc(100% * ${String(fontScale.global)}); }</style>`;

    // Insert before closing </head> tag, or at start of document if no head
    if (result.includes('</head>')) {
      result = result.replace('</head>', `${cssInjection}</head>`);
    } else if (result.includes('<body')) {
      result = result.replace('<body', `${cssInjection}<body`);
    } else {
      result = cssInjection + result;
    }
  } else if (fontScale) {
    // Always inject --font-scale variable for templates that use it
    const scale = fontScale.mode === 'global' ? fontScale.global : 1;
    const cssInjection = `<style>:root { --font-scale: ${String(scale)}; }</style>`;

    if (result.includes('</head>')) {
      result = result.replace('</head>', `${cssInjection}</head>`);
    } else if (result.includes('<body')) {
      result = result.replace('<body', `${cssInjection}<body`);
    } else {
      result = cssInjection + result;
    }
  }

  return result;
}
