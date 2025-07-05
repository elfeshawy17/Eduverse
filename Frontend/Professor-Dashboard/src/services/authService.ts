import axios from "axios";
import { AxiosError } from "axios";

// Create axios instance with auth header setup
const createAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...createAuthHeader(),
  };
  return config;
});

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const login = (email: string, password: string) => {
  // In a real app, this would make an API call
  // For demo purposes, we'll just store a dummy token
  const dummyToken = "professor_dashboard_mock_token";
  localStorage.setItem("token", dummyToken);
  return Promise.resolve({ success: true });
};

export const logout = () => {
  localStorage.removeItem("token");
  return Promise.resolve({ success: true });
};

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

// For demo purposes, we'll initialize with a token
if (!isAuthenticated()) {
  localStorage.setItem("token", "professor_dashboard_mock_token");
}
