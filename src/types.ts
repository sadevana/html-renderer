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
