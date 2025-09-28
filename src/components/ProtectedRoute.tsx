"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/admin",
  loadingComponent,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Ajouter le paramètre de redirection pour retourner vers la page demandée après login
      const current = window.location.pathname + window.location.search;
      const url = new URL(redirectTo, window.location.origin);
      url.searchParams.set("redirect", current);
      router.push(url.toString());
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      loadingComponent || (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Vérification de l'authentification...
            </p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Ou un composant de redirection
  }

  return <>{children}</>;
}
