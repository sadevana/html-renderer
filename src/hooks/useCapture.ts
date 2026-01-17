import { useCallback, useMemo, useState, RefObject } from 'react';
import type { Template, CaptureSize } from '../types';
import { capturePreview, copyPreviewToClipboard } from '../capture';

type CopyStatus = 'idle' | 'copying' | 'success' | 'error';

interface UseCaptureParams {
  previewRef: RefObject<HTMLIFrameElement | null>;
  currentTemplate: Template | null;
  inputValues: Record<string, string>;
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
  iframeLoaded,
  captureSize,
}: UseCaptureParams): UseCaptureReturn {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const canCapture = iframeLoaded && currentTemplate !== null;

  const clipboardSupported = useMemo(() => {
    return typeof navigator !== 'undefined' &&
      'clipboard' in navigator &&
      typeof ClipboardItem !== 'undefined';
  }, []);

  const captureTitle = useMemo(() => {
    if (!iframeLoaded) {
      return 'Waiting for preview to load';
    }
    if (!currentTemplate) {
      return 'No template selected';
    }
    return '';
  }, [iframeLoaded, currentTemplate]);

  const capture = useCallback(() => {
    if (!previewRef.current || !currentTemplate) return;
    capturePreview(
      previewRef.current,
      currentTemplate,
      inputValues,
      iframeLoaded,
      captureSize
    );
  }, [previewRef, currentTemplate, inputValues, iframeLoaded, captureSize]);

  const copyToClipboard = useCallback(async () => {
    if (!previewRef.current || !canCapture) return;

    setCopyStatus('copying');

    const result = await copyPreviewToClipboard(
      previewRef.current,
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
  }, [previewRef, canCapture, iframeLoaded, captureSize]);

  return { capture, copyToClipboard, canCapture, captureTitle, clipboardSupported, copyStatus };
}
