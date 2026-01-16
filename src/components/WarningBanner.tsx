interface JsWarningProps {
  type: 'js';
  visible: boolean;
}

interface CorsWarningProps {
  type: 'cors';
  externalUrls: string[];
}

type WarningBannerProps = JsWarningProps | CorsWarningProps;

export function WarningBanner(props: WarningBannerProps) {
  if (props.type === 'js') {
    if (!props.visible) return null;
    return (
      <div className="warning">
        Warning: JavaScript is enabled. Templates can run arbitrary code.
        Capture is disabled for security.
      </div>
    );
  }

  if (props.externalUrls.length === 0) return null;

  return (
    <div className="cors-warning">
      Warning: Template contains {props.externalUrls.length} external asset(s).
      Capture may fail due to CORS if these don't send CORS headers.
    </div>
  );
}
