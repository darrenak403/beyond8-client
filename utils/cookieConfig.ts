interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
  domain?: string;
}

/**
 * Get the appropriate domain for cookies based on environment
 */
function getCookieDomain(): string | undefined {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENV === "production" || process.env.NEXT_PUBLIC_API_URL === 'https://api.beyond8.io.vn';

  if (!isProduction) {
    // In development, don't set domain (use default)
    return undefined;
  }

  // In production, set to .beyond8.io.vn to work across all subdomains
  return ".beyond8.io.vn";
}

/**
 * Get secure cookie configuration based on environment
 * This ensures cookies work in both development (HTTP) and production (HTTPS)
 */
export function getSecureCookieConfig(customOptions: Partial<CookieOptions> = {}): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_API_URL === 'https://api.beyond8.io.vn' || process.env.NEXT_PUBLIC_ENV === 'production';
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: isSecureEnvironment, // true for HTTPS, false for HTTP
    sameSite: isProduction ? "strict" : "lax", // Use 'strict' in production for better security
    httpOnly: false, // Allow JavaScript access for client-side auth state
    domain: getCookieDomain(), // Set domain for production
  };

  return { ...defaultConfig, ...customOptions };
}

/**
 * Get cookie configuration for authentication tokens
 * Optimized for auth token security and accessibility
 */
export function getAuthCookieConfig(rememberMe: boolean = false): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_API_URL === 'https://api.beyond8.io.vn' || process.env.NEXT_PUBLIC_ENV === 'production';
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  // Different expiration times based on "remember me" option
  const maxAge = rememberMe
    ? 60 * 60 * 24 * 30 // 30 days if remember me is checked
    : 60 * 60 * 24 * 7; // 7 days if remember me is not checked

  return {
    maxAge,
    httpOnly: false, // Allow JavaScript access for client-side state management
    path: "/",
    secure: isSecureEnvironment, // true for HTTPS, false for HTTP
    sameSite: isProduction ? "strict" : "lax", // Compatible with production redirects
    domain: getCookieDomain(), // Set domain for production
  };
}

/**
 * Alternative: Get configuration for httpOnly refresh token
 * This would be used if implementing a dual-token system
 */
export function getRefreshTokenCookieConfig(): CookieOptions {
  return getSecureCookieConfig({
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true, // More secure, server-only access
    sameSite: "strict", // Most secure for refresh tokens
  });
}
