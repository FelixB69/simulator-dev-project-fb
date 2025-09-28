import { LoginCredentials, AuthResponse } from "@/types/auth";

class AuthService {
  private tokenKey = "access_token";
  private tokenExpiryKey = "token_expiry";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch("https://api-felixberger.fr/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Important pour inclure les cookies
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erreur de connexion");
    }

    const data: AuthResponse = await response.json();

    this.setToken(data.accessToken, data.expiresIn);

    return data;
  }

  // Refresh Token
  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch("https://api-felixberger.fr/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      // Si le refresh échoue, on déconnecte l'utilisateur
      this.logout();
      throw new Error("Session expirée");
    }

    const data: AuthResponse = await response.json();

    this.setToken(data.accessToken, data.expiresIn);

    return data;
  }

  private setToken(token: string, expiresIn: number): void {
    localStorage.setItem(this.tokenKey, token);
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());

    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const secureAttr = isHttps ? "; Secure" : "";
    document.cookie = `access_token=${token}; path=/; max-age=${expiresIn}; SameSite=Strict${secureAttr}`;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTime) return true;

    return Date.now() > parseInt(expiryTime);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);

    // Supprimer le cookie access_token avec les mêmes attributs
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const secureAttr = isHttps ? "; Secure" : "";
    document.cookie = `access_token=; path=/; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict${secureAttr}`;

    fetch("https://api-felixberger.fr/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      console.warn("Erreur lors du logout côté serveur");
    });
  }

  // Interceptor pour les requêtes API avec refresh automatique
  async authenticatedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    let token = this.getToken();

    if (this.isTokenExpired() && token) {
      try {
        await this.refreshToken();
        token = this.getToken();
      } catch (error) {
        // En cas d'échec d'auth, rediriger vers la page de login avec retour post-authentification
        if (typeof window !== "undefined") {
          const current = window.location.pathname + window.location.search;
          const url = new URL("/admin", window.location.origin);
          url.searchParams.set("redirect", current);
          window.location.href = url.toString();
        }
        throw error;
      }
    }

    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  }
}

export const authService = new AuthService();
