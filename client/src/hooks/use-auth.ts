import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { User, Login } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface RegisterData {
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
}

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch current user data
  const {
    data: user,
    isLoading,
    isError,
    refetch: fetchUser,
  } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    throwOnError: false,
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        
        return res.json();
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: Login) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      
      // Redirect to appropriate dashboard
      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/user/dashboard";
      }
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      
      // Redirect to appropriate dashboard
      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/user/dashboard";
      }
    },
    onError: (error: any) => {
      setError(error.message || "Registration failed");
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      setError(error.message || "Logout failed");
    },
  });

  // Login function
  const login = useCallback(
    async (credentials: Login) => {
      setError(null);
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterData) => {
      setError(null);
      return registerMutation.mutateAsync(userData);
    },
    [registerMutation]
  );

  // Logout function
  const logout = useCallback(async () => {
    setError(null);
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error,
    login,
    register,
    logout,
    fetchUser,
  };
}
