const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === "production" ? "/nso" : "");

/**
 * Returns the fully qualified asset URL with the subpath prefix (e.g., /nso)
 * applied when deployed on GitHub Pages or custom subpaths.
 */
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return "";
  
  // External or absolute data URLs remain unchanged
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Ensure path starts with a leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Avoid duplicating basePath if already prefixed
  if (basePath && cleanPath.startsWith(basePath)) {
    return cleanPath;
  }

  return `${basePath}${cleanPath}`;
}
