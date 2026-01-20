/**
 * Format image URL to ensure it has proper protocol
 * @param url - Image URL from API
 * @returns Formatted URL with https:// protocol
 */
export function formatImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with //, add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Otherwise, add https://
  return `https://${url}`;
}
