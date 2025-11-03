import Cookies from "js-cookie";

/**
 * Cookie options interface extending js-cookie's CookieAttributes
 */
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * CookieService - A wrapper around js-cookie for managing browser cookies
 */
class CookieService {
  /**
   * Set a cookie
   * @param name - Cookie name
   * @param value - Cookie value (will be JSON stringified if object)
   * @param options - Cookie options
   */
  set(name: string, value: any, options?: CookieOptions): void {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    Cookies.set(name, stringValue, options);
  }

  /**
   * Get a cookie value
   * @param name - Cookie name
   * @returns Cookie value or undefined if not found
   */
  get(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Get a cookie value and parse it as JSON
   * @param name - Cookie name
   * @returns Parsed JSON object or undefined
   */
  getJSON<T = any>(name: string): T | undefined {
    const value = this.get(name);
    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to parse cookie "${name}" as JSON:`, error);
      return undefined;
    }
  }

  /**
   * Get all cookies
   * @returns Object containing all cookies
   */
  getAll(): { [key: string]: string } {
    return Cookies.get();
  }

  /**
   * Remove a cookie
   * @param name - Cookie name
   * @param options - Cookie options (path and domain should match the set options)
   */
  remove(name: string, options?: CookieOptions): void {
    Cookies.remove(name, options);
  }

  /**
   * Check if a cookie exists
   * @param name - Cookie name
   * @returns True if cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  /**
   * Set a cookie with expiration in days
   * @param name - Cookie name
   * @param value - Cookie value
   * @param days - Number of days until expiration
   * @param options - Additional cookie options
   */
  setWithExpiry(
    name: string,
    value: any,
    days: number,
    options?: Omit<CookieOptions, "expires">
  ): void {
    this.set(name, value, { ...options, expires: days });
  }

  /**
   * Set a session cookie (expires when browser closes)
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  setSession(
    name: string,
    value: any,
    options?: Omit<CookieOptions, "expires">
  ): void {
    this.set(name, value, options);
  }

  /**
   * Clear all cookies
   * Note: This only removes cookies accessible from the current path
   */
  clearAll(): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach((name) => this.remove(name));
  }
}

// Export singleton instance
export const cookieService = new CookieService();

// Export class for custom instances
export default CookieService;
