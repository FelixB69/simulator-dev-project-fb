# Système d'Authentification

## Vue d'ensemble

Le système d'authentification utilise JWT avec refresh token via cookies pour sécuriser l'accès aux pages d'administration.

## Configuration API

- **Login**: `https://api-felixberger.fr/auth/login`
- **Refresh**: `https://api-felixberger.fr/auth/refresh`
- **Token valide**: 600 secondes (10 minutes)
- **Auto-refresh**: toutes les 8 minutes

## Utilisation

### 1. Pages protégées (client) + Middleware (serveur)

- Le middleware protège côté serveur toutes les routes listées (ex: `/admin/dashboard`).
- Le composant `ProtectedRoute` ajoute une couche côté client et gère le `redirect`.

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### 2. Hook d'authentification

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: "admin@test.com", password: "password" });
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Déconnexion</button>
      ) : (
        <button onClick={handleLogin}>Connexion</button>
      )}
    </div>
  );
}
```

### 3. Requêtes authentifiées

```tsx
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

function DataComponent() {
  const { get, post } = useAuthenticatedFetch();

  const fetchData = async () => {
    const response = await get("/api/protected-data");
    const data = await response.json();
    return data;
  };

  const sendData = async (payload) => {
    const response = await post("/api/protected-endpoint", payload);
    return response;
  };
}
```

## Architecture

### Service d'authentification (`authService.ts`)

- Gestion des tokens dans localStorage
- Refresh automatique des tokens
- Intercepteur pour les requêtes API

### Context d'authentification (`useAuth.tsx`)

- État global d'authentification
- Auto-refresh toutes les 8 minutes
- Gestion des erreurs d'authentification

### Protection des routes (`ProtectedRoute.tsx`)

- Composant wrapper pour protéger les pages
- Redirection automatique si non authentifié
- Écran de chargement pendant la vérification

### Middleware Next.js (`middleware.ts`)

- Protection des routes côté serveur (ex: `/admin/dashboard`)
- Vérification des cookies `access_token` ou `refresh_token`
- Redirection des utilisateurs non authentifiés vers `/admin?redirect=...`
- Redirection des utilisateurs authentifiés qui visitent `/admin` vers la destination demandée (ou `/admin/dashboard`)

## Pages disponibles

- `/admin` - Page de connexion (gère le paramètre `?redirect=/chemin`)
- `/admin/dashboard` - Page d'administration protégée (server + client)

## Gestion des erreurs

Le système gère automatiquement :

- Expiration des tokens (refresh automatique)
- Échec du refresh (déconnexion automatique)
- Erreurs réseau (retry avec backoff)
- Sessions expirées (redirection vers login)

## Sécurité

- Tokens stockés en localStorage (côté client)
- Refresh tokens en cookies HttpOnly (côté serveur)
- Auto-refresh préventif avant expiration
- Déconnexion automatique en cas d'erreur d'auth
