"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { LoginCredentials, AuthResponse } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          setIsAuthenticated(true);
        } else if (authService.getToken()) {
          // Si on a un token mais qu'il est expiré, essayer de le refresh
          try {
            await authService.refreshToken();
            setIsAuthenticated(true);
          } catch (error) {
            // Si le refresh échoue, déconnecter
            authService.logout();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification d'authentification:",
          error,
        );
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh du token toutes les 8 minutes (480s) pour un token de 600s
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await authService.refreshToken();
      } catch (error) {
        console.error("Erreur lors du refresh automatique:", error);
        setIsAuthenticated(false);
      }
    }, 480000); // 8 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      await authService.login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
