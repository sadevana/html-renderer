import { useCallback, useMemo, useState, RefObject } from 'react';
import type { Template, CaptureSize } from '../types';
import { capturePreview, copyPreviewToClipboard } from '../capture';

type CopyStatus = 'idle' | 'copying' | 'success' | 'error';

interface UseCaptureParams {
  previewRef: RefObject<HTMLIFrameElement | null>;
  currentTemplate: Template | null;
  inputValues: Record<string, string>;
  jsEnabled: boolean;
  iframeLoaded: boolean;
  captureSize: CaptureSize | null;
}

interface UseCaptureReturn {
  capture: () => void;
  copyToClipboard: () => void;
  canCapture: boolean;
  captureTitle: string;
  clipboardSupported: boolean;
  copyStatus: CopyStatus;
}

export function useCapture({
  previewRef,
  currentTemplate,
  inputValues,
  jsEnabled,
  iframeLoaded,
  captureSize,
}: UseCaptureParams): UseCaptureReturn {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const canCapture = !jsEnabled && iframeLoaded && currentTemplate !== null;

  const clipboardSupported = useMemo(() => {
    return typeof navigator !== 'undefined' &&
      'clipboard' in navigator &&
      typeof ClipboardItem !== 'undefined';
  }, []);

  const captureTitle = useMemo(() => {
    if (jsEnabled) {
      return 'Capture is disabled when JavaScript is enabled';
    }
    if (!iframeLoaded) {
      return 'Waiting for preview to load';
    }
    if (!currentTemplate) {
      return 'No template selected';
    }
    return '';
  }, [jsEnabled, iframeLoaded, currentTemplate]);

  const capture = useCallback(() => {
    if (!previewRef.current || !currentTemplate) return;
    capturePreview(
      previewRef.current,
      currentTemplate,
      inputValues,
      jsEnabled,
      iframeLoaded,
      captureSize
    );
  }, [previewRef, currentTemplate, inputValues, jsEnabled, iframeLoaded, captureSize]);

  const copyToClipboard = useCallback(async () => {
    if (!previewRef.current || !canCapture) return;

    setCopyStatus('copying');

    const result = await copyPreviewToClipboard(
      previewRef.current,
      jsEnabled,
      iframeLoaded,
      captureSize
    );

    if (result.success) {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('error');
      alert(result.error);
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [previewRef, canCapture, jsEnabled, iframeLoaded, captureSize]);

  return { capture, copyToClipboard, canCapture, captureTitle, clipboardSupported, copyStatus };
}
