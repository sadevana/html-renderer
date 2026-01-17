interface WarningBannerProps {
  externalUrls: string[];
}

export function WarningBanner({ externalUrls }: WarningBannerProps) {
  if (externalUrls.length === 0) return null;

  return (
    <div className="cors-warning">
      Warning: Template contains {externalUrls.length} external asset(s).
      Capture may fail due to CORS if these don't send CORS headers.
    </div>
  );
}
