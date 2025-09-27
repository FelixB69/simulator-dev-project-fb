"use client";

import { useAuth } from "./useAuth";
import { authService } from "@/services/authService";
import { useCallback } from "react";

export function useAuthenticatedFetch() {
  const { logout } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      try {
        return await authService.authenticatedFetch(url, options);
      } catch (error) {
        // Si l'erreur est liée à l'authentification, déconnecter l'utilisateur
        if (
          error instanceof Error &&
          error.message.includes("Session expirée")
        ) {
          logout();
        }
        throw error;
      }
    },
    [logout],
  );

  const get = useCallback(
    (url: string) => authenticatedFetch(url, { method: "GET" }),
    [authenticatedFetch],
  );

  const post = useCallback(
    (url: string, data?: any) =>
      authenticatedFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      }),
    [authenticatedFetch],
  );

  const put = useCallback(
    (url: string, data?: any) =>
      authenticatedFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      }),
    [authenticatedFetch],
  );

  const del = useCallback(
    (url: string) => authenticatedFetch(url, { method: "DELETE" }),
    [authenticatedFetch],
  );

  return {
    authenticatedFetch,
    get,
    post,
    put,
    delete: del,
  };
}
