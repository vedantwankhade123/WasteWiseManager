import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

export interface AuthResponse {
  user: User;
}

/**
 * Login user with credentials
 */
export async function loginUser(email: string, password: string, role: "user" | "admin"): Promise<AuthResponse> {
  try {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
      role
    });
    
    const data = await response.json();
    return { user: data };
  } catch (error) {
    throw new Error("Login failed. Please check your credentials and try again.");
  }
}

/**
 * Register a new user
 */
export async function registerUser(userData: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: "user" | "admin";
  secretCode?: string;
}): Promise<AuthResponse> {
  try {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    
    const data = await response.json();
    return { user: data };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Registration failed. Please try again.");
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
  } catch (error) {
    console.error("Logout error:", error);
    // We continue regardless of logout error to clear local state
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("Fetching current user");
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    
    console.log("Current user response status:", response.status);
    
    if (response.status === 401) {
      console.log("User not authenticated");
      return null;
    }
    
    if (!response.ok) {
      console.error("Failed to fetch user:", response.status, response.statusText);
      throw new Error("Failed to fetch user");
    }
    
    const userData = await response.json();
    console.log("Current user data:", userData ? { id: userData.id, role: userData.role } : null);
    return userData;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
