// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
}

// Configuration des API endpoints
export const AUTH_API = {
  LOGIN: "https://api-felixberger.fr/auth/login",
  REFRESH: "https://api-felixberger.fr/auth/refresh",
} as const;
