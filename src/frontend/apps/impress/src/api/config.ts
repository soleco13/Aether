/**
 * Returns the base URL for the backend API.
 *
 * Priority:
 * 1. Uses NEXT_PUBLIC_API_ORIGIN from environment variables if defined.
 * 2. For production server, always use the backend server URL.
 * 3. Falls back to localhost development.
 *
 * @returns The backend base URL as a string.
 */
export const backendUrl = () => {
  // Production URL for Aether backend
  const PRODUCTION_BACKEND_URL = 'http://45.146.166.126:8071';
  
  // In browser environment, check hostname to determine correct backend
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    // If we're on the production server, use production backend
    if (currentHost === '45.146.166.126') {
      return PRODUCTION_BACKEND_URL;
    }
    
    // For localhost development, use localhost backend
    if (currentHost === 'localhost') {
      return 'http://localhost:8071';
    }
    
    // For any other host, use production backend
    return PRODUCTION_BACKEND_URL;
  }
  
  // Default to production URL for server-side rendering
  return PRODUCTION_BACKEND_URL;
};

/**
 * Constructs the full base API URL, including the versioned path (e.g., `/api/v1.0/`).
 *
 * @param apiVersion - The version of the API (defaults to '1.0').
 * @returns The full versioned API base URL as a string.
 */
export const baseApiUrl = (apiVersion: string = '1.0') =>
  `${backendUrl()}/api/v${apiVersion}/`;
