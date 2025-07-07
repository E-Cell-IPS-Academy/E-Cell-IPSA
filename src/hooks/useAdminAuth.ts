// Create /src/hooks/useAdminAuth.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { AdminSession } from "../types/admin";

interface UseAdminAuthReturn {
  adminSession: AdminSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = (): void => {
      try {
        const session = localStorage.getItem("adminSession");
        if (session) {
          const parsedSession: AdminSession = JSON.parse(session);

          // Check if session is still valid (within 24 hours)
          const loginTime = new Date(parsedSession.loginTime);
          const now = new Date();
          const hoursDiff =
            (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            setAdminSession(parsedSession);
          } else {
            // Session expired
            localStorage.removeItem("adminSession");
            setAdminSession(null);
          }
        }
      } catch (error) {
        console.error("Error parsing admin session:", error);
        localStorage.removeItem("adminSession");
        setAdminSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === "adminSession" && !e.newValue) {
        setAdminSession(null);
        navigate("/admin/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const logout = (): void => {
    localStorage.removeItem("adminSession");
    setAdminSession(null);
    navigate("/admin/login");
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminSession) return false;
    return adminSession.permissions.includes(permission as any);
  };

  const isAuthenticated = (): boolean => {
    return !!adminSession;
  };

  return {
    adminSession,
    isLoading,
    isAuthenticated: isAuthenticated(),
    logout,
    hasPermission,
  };
};
