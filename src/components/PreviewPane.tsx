import { forwardRef } from 'react';
import type { CaptureSize } from '../types';

interface PreviewPaneProps {
  html: string;
  onLoad: () => void;
  captureSize: CaptureSize | null;
}

export const PreviewPane = forwardRef<HTMLIFrameElement, PreviewPaneProps>(
  function PreviewPane({ html, onLoad, captureSize }, ref) {
    const sandbox = 'allow-same-origin';

    // When captureSize is set, scale the preview to fit within maxPreviewHeight
    // while maintaining internal viewport dimensions for vw/vh units
    const maxPreviewHeight = 500;
    const scale = captureSize ? Math.min(1, maxPreviewHeight / captureSize.height) : 1;

    if (captureSize) {
      const scaledWidth = captureSize.width * scale;
      const scaledHeight = captureSize.height * scale;

      return (
        <div
          style={{
            width: scaledWidth,
            height: scaledHeight,
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={ref}
            sandbox={sandbox}
            srcDoc={html}
            onLoad={onLoad}
            style={{
              width: captureSize.width,
              height: captureSize.height,
              border: 'none',
              transform: `scale(${String(scale)})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      );
    }

    return (
      <iframe
        ref={ref}
        sandbox={sandbox}
        srcDoc={html}
        onLoad={onLoad}
        style={{
          width: '100%',
          border: 'none',
          minHeight: '400px',
        }}
      />
    );
  }
);
