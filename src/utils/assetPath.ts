/**
 * Returns the URL for assets and icons.
 */
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return "";

  // External or absolute data URLs remain unchanged
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Ensure path starts with a leading slash
  return path.startsWith("/") ? path : `/${path}`;
}

