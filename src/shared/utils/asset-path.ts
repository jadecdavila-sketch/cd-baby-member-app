/**
 * Get the correct asset path accounting for production base path
 */
export function getAssetPath(path: string): string {
  // In production with GitHub Pages, we need to add the base path prefix
  const basePath = process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '';

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}
