import html2canvas from 'html2canvas';
import type { CaptureSize } from './types';

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

export async function renderPreviewToBlob(
  iframe: HTMLIFrameElement,
  captureSize: CaptureSize | null
): Promise<Blob> {
  const canvas = await createCanvas(iframe, captureSize);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create image blob'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
