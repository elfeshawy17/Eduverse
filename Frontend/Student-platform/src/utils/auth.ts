import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Base URL for the authentication service
const AUTH_BASE_URL = 'http://localhost:5173/eduverse';

// Token management functions
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('token');
};

// Extract token from URL query parameter
export const extractTokenFromUrl = (): string | null => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  return token;
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Store the current path for redirect after login
export const storeRedirectPath = (path: string): void => {
  localStorage.setItem('redirectPath', path);
};

// Get stored redirect path
export const getRedirectPath = (): string | null => {
  return localStorage.getItem('redirectPath');
};

// Clear stored redirect path
export const clearRedirectPath = (): void => {
  localStorage.removeItem('redirectPath');
};

// Initialize authentication by checking URL for token
export const initAuth = (): void => {
  const token = extractTokenFromUrl();
  if (token) {
    setToken(token);
    // Clean up the URL by removing the token parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.toString());
  }
};

// Logout function
export const logout = (): void => {
  clearToken();
  clearRedirectPath();
  // Redirect to login page
  window.location.href = `${AUTH_BASE_URL}/login`;
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  // Minimum 8 characters
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // At least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // At least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// Change password
export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    // First get the professor's profile to get their email
    const profileResponse = await api.get("/users/me");
    if (profileResponse.data.status !== "SUCCESS") {
      throw new Error("Failed to get professor profile");
    }

    const { email } = profileResponse.data.data;
    // Now make the password change request
    const response = await api.post("/auth/changePassword", {
      email,
      password: oldPassword,
      newPassword,
    });
    
    return {
      success: response.data.status === "SUCCESS",
      message: response.data.message || "Password changed successfully",
      data: response.data.data,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      message: 
        axiosError.response?.data?.message || 
        "Failed to change password. Please try again.",
    };
  }
};

// Hook for protected routes
export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Store current path for redirect after login
      storeRedirectPath(location.pathname);
      // Redirect to login page if no token exists
      window.location.href = `${AUTH_BASE_URL}/login?redirect=${encodeURIComponent(location.pathname)}`;
    }
  }, [navigate, location]);

  return { 
    isAuthenticated: isAuthenticated(),
    logout,
    token: getToken()
  };
};

// Configure axios with authentication token
export const configureAxios = () => {
  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include token in headers
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle authentication errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Automatically logout on 401 Unauthorized responses
        logout();
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Create and export the configured axios instance
export const api = configureAxios();