const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

/**
 * Format image URL to ensure it has proper protocol.
 * Handles relative paths from the API by prepending NEXT_PUBLIC_API_URL.
 */
export function formatImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  // Already has protocol
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Protocol-relative
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  // Relative path (e.g. "user/avatars/...") — prepend API base URL
  const path = url.startsWith("/") ? url : `/${url}`;
  if (API_BASE) {
    return `${API_BASE}${path}`;
  }

  // Fallback (no API base configured)
  return `https://${url}`;
}
