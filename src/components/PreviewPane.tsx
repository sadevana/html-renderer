import { forwardRef } from 'react';

interface PreviewPaneProps {
  html: string;
  jsEnabled: boolean;
  onLoad: () => void;
}

export const PreviewPane = forwardRef<HTMLIFrameElement, PreviewPaneProps>(
  function PreviewPane({ html, jsEnabled, onLoad }, ref) {
    const sandbox = jsEnabled ? 'allow-scripts' : 'allow-same-origin';

    return (
      <iframe
        ref={ref}
        sandbox={sandbox}
        srcDoc={html}
        onLoad={onLoad}
        style={{ width: '100%', border: 'none', minHeight: '400px' }}
      />
    );
  }
);
