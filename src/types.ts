export interface Template {
  name: string;
  html: string;
}

export interface TemplateSelection {
  type: 'builtin' | 'custom';
  index: number;
}
