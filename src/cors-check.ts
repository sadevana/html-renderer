const EXTERNAL_ASSET_PATTERNS = [
  /<img[^>]+src=["']([^"']+)["']/gi,
  /<video[^>]+poster=["']([^"']+)["']/gi,
  /<source[^>]+src=["']([^"']+)["']/gi,
  /url\(["']?([^"')]+)["']?\)/gi,
];

export function checkForExternalAssets(html: string): string[] {
  const currentOrigin = window.location.origin;
  const externalUrls: string[] = [];

  for (const pattern of EXTERNAL_ASSET_PATTERNS) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1];
      if (url.startsWith('data:')) continue;

      try {
        const urlObj = new URL(url, currentOrigin);
        if (urlObj.origin !== currentOrigin) {
          externalUrls.push(url);
        }
      } catch {
        // Relative URL or invalid - likely same origin
      }
    }
    pattern.lastIndex = 0; // Reset regex
  }

  return [...new Set(externalUrls)];
}
