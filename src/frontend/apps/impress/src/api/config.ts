/**
 * Returns the base URL for the backend API.
 *
 * Priority:
 * 1. Uses NEXT_PUBLIC_API_ORIGIN from environment variables if defined.
 * 2. Falls back to the browser's window.location.origin if in a browser environment.
 * 3. Defaults to production backend URL for Aether.
 *
 * @returns The backend base URL as a string.
 */
export const backendUrl = () => {
  // Check for environment variable
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_ORIGIN) {
    return process.env.NEXT_PUBLIC_API_ORIGIN;
  }
  
  // Fallback to window location in browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Default production URL for Aether
  return 'http://45.146.166.126:8071';
};

/**
 * Constructs the full base API URL, including the versioned path (e.g., `/api/v1.0/`).
 *
 * @param apiVersion - The version of the API (defaults to '1.0').
 * @returns The full versioned API base URL as a string.
 */
export const baseApiUrl = (apiVersion: string = '1.0') =>
  `${backendUrl()}/api/v${apiVersion}/`;
