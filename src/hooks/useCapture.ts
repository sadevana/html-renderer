import { useCallback, useMemo, RefObject } from 'react';
import type { Template } from '../types';
import { capturePreview } from '../capture';

interface UseCaptureParams {
  previewRef: RefObject<HTMLIFrameElement | null>;
  currentTemplate: Template | null;
  inputValues: Record<string, string>;
  jsEnabled: boolean;
  iframeLoaded: boolean;
}

interface UseCaptureReturn {
  capture: () => void;
  canCapture: boolean;
  captureTitle: string;
}

export function useCapture({
  previewRef,
  currentTemplate,
  inputValues,
  jsEnabled,
  iframeLoaded,
}: UseCaptureParams): UseCaptureReturn {
  const canCapture = !jsEnabled && iframeLoaded && currentTemplate !== null;

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
      iframeLoaded
    );
  }, [previewRef, currentTemplate, inputValues, jsEnabled, iframeLoaded]);

  return { capture, canCapture, captureTitle };
}
