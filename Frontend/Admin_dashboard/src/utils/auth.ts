import { NavigateFunction } from 'react-router-dom';

/**
 * Handles token extraction from URL, decoding, and storage
 * @returns boolean indicating if a token was found and stored
 */
export const handleRedirectedToken = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    try {
      // Decode the token
      const decodedToken = decodeURIComponent(token);
      
      // Validate that the token is not empty
      if (!decodedToken || decodedToken.trim() === '') {
        console.error('Empty token received');
        return false;
      }
      
      // Store in localStorage
      localStorage.setItem('token', decodedToken);
      
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('Token successfully processed and stored');
      return true;
    } catch (error) {
      console.error('Error handling redirected token:', error);
      return false;
    }
  }
  
  return false;
};

/**
 * Handles admin page token specifically
 * @returns boolean indicating if token was successfully stored
 */
export const handleAdminPageToken = (): boolean => {
  // Check if we're on the admin page
  if (window.location.pathname.includes('/eduverse/admin')) {
    return handleRedirectedToken();
  }
  return false;
};

/**
 * Redirects to a new page with the token in the URL
 */
export const redirectWithToken = (
  navigate: NavigateFunction,
  redirectTo: string,
  token: string
) => {
  const encodedToken = encodeURIComponent(token);
  navigate(`${redirectTo}?token=${encodedToken}`);
};

/**
 * Gets the stored token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Removes the stored token from localStorage
 */
export const removeStoredToken = () => {
  localStorage.removeItem('token');
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

/**
 * Validates that the stored token is properly formatted
 * @returns boolean indicating if token is valid
 */
export const isTokenValid = (): boolean => {
  const token = getStoredToken();
  if (!token) return false;
  
  // Basic validation - ensure token is not empty and has reasonable length
  // JWT tokens typically have 3 parts separated by dots
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.warn('Token format appears invalid');
    return false;
  }
  
  return true;
};

/**
 * Gets a validated token for API calls
 * @returns string | null - the token if valid, null otherwise
 */
export const getValidatedToken = (): string | null => {
  console.log('getValidatedToken: Checking token validity...');
  
  if (!isAuthenticated()) {
    console.log('getValidatedToken: No token found in localStorage');
    return null;
  }
  
  if (!isTokenValid()) {
    console.log('getValidatedToken: Token format is invalid');
    return null;
  }
  
  const token = getStoredToken();
  console.log('getValidatedToken: Valid token found, length:', token?.length);
  return token;
};

/**
 * Clears all data from localStorage
 */
export const clearAllLocalStorage = () => {
  localStorage.clear();
};

/**
 * Handles user logout
 * Clears all localStorage data and redirects to login page
 */
export const logout = (navigate: NavigateFunction) => {
  // Clear all localStorage data
  clearAllLocalStorage();
  // Redirect to login page on the correct port
  window.location.href = 'http://localhost:5173/eduverse/login';
}; 