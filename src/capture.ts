import html2canvas from 'html2canvas';
import type { DOMElements, AppState } from './types';

export async function capturePreview(
  elements: DOMElements,
  state: AppState
): Promise<void> {
  if (!state.currentTemplate) {
    alert('No template selected');
    return;
  }

  if (state.jsEnabled) {
    alert('Capture is disabled when JavaScript is enabled for security reasons.');
    return;
  }

  if (!state.iframeLoaded) {
    alert('Please wait for preview to load');
    return;
  }

  const iframeDoc = elements.preview.contentDocument;
  if (!iframeDoc) {
    alert('Cannot access preview content');
    return;
  }

  const root = iframeDoc.documentElement;

  try {
    const canvas = await html2canvas(root, {
      windowWidth: root.scrollWidth,
      windowHeight: root.scrollHeight,
      width: root.scrollWidth,
      height: root.scrollHeight,
      scale: window.devicePixelRatio,
      useCORS: true,
      logging: false,
    });

    // Safe filename generation
    const firstValue = Object.values(state.inputValues)[0] ?? 'preview';
    const sanitizedValue = firstValue.trim().replace(/\s+/g, '_').slice(0, 50) || 'preview';
    const safeName = state.currentTemplate.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeName}-${sanitizedValue}-${Date.now()}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to capture preview:', error);
    alert('Failed to capture preview. Please try again.');
  }
}
