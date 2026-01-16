export interface Template {
  name: string;
  html: string;
}

export interface TemplateSelection {
  type: 'builtin' | 'custom';
  index: number;
}

export interface AppState {
  currentTemplate: Template | null;
  inputValues: Record<string, string>;
  jsEnabled: boolean;
  iframeLoaded: boolean;
}

export interface DOMElements {
  templateSelect: HTMLSelectElement;
  templateFile: HTMLInputElement;
  addTemplateButton: HTMLButtonElement;
  removeTemplateButton: HTMLButtonElement;
  inputFields: HTMLDivElement;
  preview: HTMLIFrameElement;
  captureButton: HTMLButtonElement;
  jsToggle: HTMLInputElement;
  jsWarning: HTMLElement;
  corsWarning: HTMLElement;
}
