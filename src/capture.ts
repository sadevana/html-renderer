import html2canvas from 'html2canvas';
import type { Template } from './types';

export async function capturePreview(
  iframe: HTMLIFrameElement,
  template: Template,
  inputValues: Record<string, string>,
  jsEnabled: boolean,
  iframeLoaded: boolean
): Promise<void> {
  if (jsEnabled) {
    alert('Capture is disabled when JavaScript is enabled for security reasons.');
    return;
  }

  if (!iframeLoaded) {
    alert('Please wait for preview to load');
    return;
  }

  const iframeDoc = iframe.contentDocument;
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
    const firstValue = Object.values(inputValues)[0] ?? 'preview';
    const sanitizedValue = firstValue.trim().replace(/\s+/g, '_').slice(0, 50) || 'preview';
    const safeName = template.name.replace(/[^a-zA-Z0-9]/g, '_');
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
