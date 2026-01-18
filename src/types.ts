export interface Template {
  name: string;
  html: string;
}

export interface TemplateSelection {
  type: 'builtin' | 'custom';
  index: number;
}

export interface SizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface CaptureSize {
  width: number;
  height: number;
}

export type SizeConfig =
  | { type: 'auto' }
  | { type: 'preset'; presetId: string }
  | { type: 'advanced'; width: number; height: number };

export interface FontScaleConfig {
  mode: 'global' | 'perField';
  global: number;
  perField: Record<string, number>;
}

export interface TemplateSettings {
  fontScale: FontScaleConfig;
  size: SizeConfig;
}

/**
 * Converts a SizeConfig to CaptureSize for capture/preview.
 * Returns null for auto mode, otherwise returns the dimensions.
 */
export function getSizeForCapture(config: SizeConfig, presets: SizePreset[]): CaptureSize | null {
  switch (config.type) {
    case 'auto':
      return null;
    case 'preset': {
      const preset = presets.find((p) => p.id === config.presetId);
      return preset ? { width: preset.width, height: preset.height } : null;
    }
    case 'advanced':
      return { width: config.width, height: config.height };
  }
}
