import html2canvas from 'html2canvas';
import type { Template, CaptureSize } from './types';

interface CopyResult {
  success: boolean;
  error?: string;
}

function computeAutoBoundingBox(iframeDoc: Document): { width: number; height: number } {
  const root = iframeDoc.documentElement;
  const body = iframeDoc.body;

  // Strategy 1: documentElement dimensions
  const docWidth = root.scrollWidth;
  const docHeight = root.scrollHeight;

  // Strategy 2: body dimensions
  const bodyWidth = body.scrollWidth;
  const bodyHeight = body.scrollHeight;

  // Strategy 3: body bounding rect (accounts for margins)
  const bodyRect = body.getBoundingClientRect();

  // Strategy 4: first child container (common pattern in templates)
  const firstChild = body.children[0] as HTMLElement | undefined;
  const containerWidth = firstChild?.getBoundingClientRect().width ?? 0;
  const containerHeight = firstChild?.getBoundingClientRect().height ?? 0;

  // Use maximum to avoid clipping
  const width = Math.max(docWidth, bodyWidth, bodyRect.width, containerWidth);
  const height = Math.max(docHeight, bodyHeight, bodyRect.height, containerHeight);

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
  };
}

async function createCanvas(
  iframe: HTMLIFrameElement,
  captureSize: CaptureSize | null
): Promise<HTMLCanvasElement> {
  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) {
    throw new Error('Cannot access preview content');
  }

  const root = iframeDoc.documentElement;

  const canvasOptions = captureSize
    ? {
        windowWidth: captureSize.width,
        windowHeight: captureSize.height,
        width: captureSize.width,
        height: captureSize.height,
        scale: 1,
        useCORS: true,
        logging: false,
      }
    : (() => {
        const bounds = computeAutoBoundingBox(iframeDoc);
        return {
          windowWidth: bounds.width,
          windowHeight: bounds.height,
          width: bounds.width,
          height: bounds.height,
          scale: window.devicePixelRatio,
          useCORS: true,
          logging: false,
        };
      })();

  return html2canvas(root, canvasOptions);
}

export async function copyPreviewToClipboard(
  iframe: HTMLIFrameElement,
  iframeLoaded: boolean,
  captureSize: CaptureSize | null
): Promise<CopyResult> {
  if (!iframeLoaded) {
    return { success: false, error: 'Please wait for preview to load' };
  }

  try {
    const canvas = await createCanvas(iframe, captureSize);

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Failed to copy. Try downloading instead.' });
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve({ success: true });
        } catch (err) {
          console.error('Clipboard write failed:', err);
          if (err instanceof Error && err.name === 'NotAllowedError') {
            resolve({ success: false, error: 'Clipboard access denied. Please allow clipboard permissions.' });
          } else {
            resolve({ success: false, error: 'Failed to copy. Try downloading instead.' });
          }
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Failed to create canvas for clipboard:', error);
    return { success: false, error: 'Failed to copy. Try downloading instead.' };
  }
}

export async function capturePreview(
  iframe: HTMLIFrameElement,
  template: Template,
  inputValues: Record<string, string>,
  iframeLoaded: boolean,
  captureSize: CaptureSize | null
): Promise<void> {
  if (!iframeLoaded) {
    alert('Please wait for preview to load');
    return;
  }

  try {
    const canvas = await createCanvas(iframe, captureSize);

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
