import type { DOMElements, AppState, Template } from './types';
import { builtInTemplates } from './templates';
import { renderTemplate } from './escape';
import { extractVariablesInOrder, humanizeLabel } from './template-utils';
import {
  loadCustomTemplates,
  saveCustomTemplates,
  loadLastSelected,
  saveLastSelected,
  clearLastSelected,
} from './storage';
import { checkForExternalAssets, showCorsWarning } from './cors-check';
import { capturePreview } from './capture';

const BUILTIN_PREFIX = 'builtin';
const CUSTOM_PREFIX = 'custom';
const PREFIX_SEPARATOR = '-';

let elements: DOMElements;
let customTemplates: Template[] = [];

const state: AppState = {
  currentTemplate: null,
  inputValues: {},
  jsEnabled: false,
  iframeLoaded: false,
};

function getElements(): DOMElements {
  return {
    templateSelect: document.getElementById('templateSelect') as HTMLSelectElement,
    templateFile: document.getElementById('templateFile') as HTMLInputElement,
    addTemplateButton: document.getElementById('addTemplateButton') as HTMLButtonElement,
    removeTemplateButton: document.getElementById('removeTemplateButton') as HTMLButtonElement,
    inputFields: document.getElementById('inputFields') as HTMLDivElement,
    preview: document.getElementById('preview') as HTMLIFrameElement,
    captureButton: document.getElementById('captureButton') as HTMLButtonElement,
    jsToggle: document.getElementById('jsToggle') as HTMLInputElement,
    jsWarning: document.getElementById('jsWarning') as HTMLElement,
    corsWarning: document.getElementById('corsWarning') as HTMLElement,
  };
}

function updateRemoveButtonVisibility(selectedType: 'builtin' | 'custom'): void {
  elements.removeTemplateButton.style.display =
    selectedType === 'custom' ? 'inline-block' : 'none';
}

function updateIframeSandbox(): void {
  if (state.jsEnabled) {
    elements.preview.setAttribute('sandbox', 'allow-scripts');
  } else {
    elements.preview.setAttribute('sandbox', 'allow-same-origin');
  }
}

function updateCaptureButtonState(): void {
  if (state.jsEnabled) {
    elements.captureButton.disabled = true;
    elements.captureButton.title = 'Capture is disabled when JavaScript is enabled';
  } else if (!state.iframeLoaded) {
    elements.captureButton.disabled = true;
    elements.captureButton.title = 'Waiting for preview to load';
  } else {
    elements.captureButton.disabled = false;
    elements.captureButton.title = '';
  }
}

function updateTemplateList(): void {
  elements.templateSelect.innerHTML = '';

  // Add built-in templates
  builtInTemplates.forEach((template, index) => {
    const option = document.createElement('option');
    option.value = `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}${index}`;
    option.textContent = template.name;
    elements.templateSelect.appendChild(option);
  });

  // Add custom templates
  customTemplates.forEach((template, index) => {
    const option = document.createElement('option');
    option.value = `${CUSTOM_PREFIX}${PREFIX_SEPARATOR}${index}`;
    option.textContent = template.name;
    elements.templateSelect.appendChild(option);
  });
}

function loadTemplate(template: Template): void {
  elements.inputFields.innerHTML = '';
  state.inputValues = {};

  // Extract variables in order of appearance
  const variables = extractVariablesInOrder(template.html);

  // Create input fields for each variable
  variables.forEach(variable => {
    const label = document.createElement('label');
    const labelText = humanizeLabel(variable);
    label.innerHTML = `
      ${labelText}:
      <input type="text" class="input-field" data-variable="${variable}">
    `;
    const input = label.querySelector('input') as HTMLInputElement;
    input.addEventListener('input', () => {
      state.inputValues[variable] = input.value;
      updatePreview();
    });
    elements.inputFields.appendChild(label);
  });

  // Check for external assets and show CORS warning
  const externalUrls = checkForExternalAssets(template.html);
  showCorsWarning(elements.corsWarning, externalUrls);

  updatePreview();
}

function updatePreview(): void {
  if (!state.currentTemplate) return;

  state.iframeLoaded = false;
  updateCaptureButtonState();

  const html = renderTemplate(state.currentTemplate.html, state.inputValues);
  elements.preview.srcdoc = html;

  elements.preview.onload = () => {
    state.iframeLoaded = true;
    updateCaptureButtonState();
  };
}

function handleTemplateSelection(): void {
  const value = elements.templateSelect.value;
  const [type, indexStr] = value.split(PREFIX_SEPARATOR);
  const index = parseInt(indexStr, 10);

  // Save selected template to localStorage
  saveLastSelected(value);

  // Show/hide remove button based on template type
  updateRemoveButtonVisibility(type as 'builtin' | 'custom');

  state.currentTemplate = type === BUILTIN_PREFIX
    ? builtInTemplates[index]
    : customTemplates[index];

  if (state.currentTemplate) {
    loadTemplate(state.currentTemplate);
  }
}

function handleAddTemplate(): void {
  elements.templateFile.click();
}

async function handleFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const content = await file.text();
    const newTemplate: Template = {
      name: file.name,
      html: content
    };

    customTemplates.push(newTemplate);
    saveCustomTemplates(customTemplates);

    updateTemplateList();

    // Select the newly added template
    const newValue = `${CUSTOM_PREFIX}${PREFIX_SEPARATOR}${customTemplates.length - 1}`;
    elements.templateSelect.value = newValue;
    elements.templateSelect.dispatchEvent(new Event('change'));
  } catch (error) {
    console.error('Failed to load template:', error);
    alert('Failed to load template. Please try again.');
  }

  // Reset file input
  target.value = '';
}

function handleRemoveTemplate(): void {
  const value = elements.templateSelect.value;
  const [type, indexStr] = value.split(PREFIX_SEPARATOR);
  const index = parseInt(indexStr, 10);

  if (type === CUSTOM_PREFIX) {
    if (confirm('Are you sure you want to remove this template?')) {
      customTemplates.splice(index, 1);
      saveCustomTemplates(customTemplates);
      updateTemplateList();

      // Select first available template
      if (builtInTemplates.length > 0) {
        elements.templateSelect.value = `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}0`;
        clearLastSelected();
        elements.templateSelect.dispatchEvent(new Event('change'));
      }
    }
  } else {
    alert('Built-in templates cannot be removed');
  }
}

function handleJsToggle(): void {
  const newValue = elements.jsToggle.checked;

  if (newValue) {
    const confirmed = confirm(
      'Enabling JavaScript allows templates to run arbitrary code. ' +
      'This can be unsafe for untrusted templates. Continue?'
    );
    if (!confirmed) {
      elements.jsToggle.checked = false;
      return;
    }
  }

  state.jsEnabled = newValue;

  // Show/hide JS warning
  elements.jsWarning.style.display = newValue ? 'block' : 'none';

  // Update iframe sandbox and re-render
  updateIframeSandbox();
  updateCaptureButtonState();
  updatePreview();
}

function handleCapture(): void {
  capturePreview(elements, state);
}

function initializeSelection(): void {
  const lastSelected = loadLastSelected();

  if (lastSelected) {
    const option = elements.templateSelect.querySelector(
      `option[value="${lastSelected}"]`
    );
    if (option) {
      elements.templateSelect.value = lastSelected;
    } else {
      // Selection no longer exists, clear and fallback
      clearLastSelected();
      elements.templateSelect.value = `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}0`;
    }
  }

  elements.templateSelect.dispatchEvent(new Event('change'));
}

function init(): void {
  elements = getElements();

  // Load custom templates from localStorage
  customTemplates = loadCustomTemplates();

  // Set initial sandbox mode
  updateIframeSandbox();

  // Build template list
  updateTemplateList();

  // Wire up event handlers
  elements.templateSelect.addEventListener('change', handleTemplateSelection);
  elements.addTemplateButton.addEventListener('click', handleAddTemplate);
  elements.templateFile.addEventListener('change', handleFileChange);
  elements.removeTemplateButton.addEventListener('click', handleRemoveTemplate);
  elements.jsToggle.addEventListener('change', handleJsToggle);
  elements.captureButton.addEventListener('click', handleCapture);

  // Initialize selection
  initializeSelection();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
