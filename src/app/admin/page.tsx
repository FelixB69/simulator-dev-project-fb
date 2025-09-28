"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [loginError, setLoginError] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, rediriger vers la destination
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect");
      const destination =
        redirect && redirect.startsWith("/") ? redirect : "/admin/dashboard";
      router.replace(destination);
    }
  }, [isAuthenticated, searchParams, router]);

  const handleLogin = async (data: LoginData) => {
    try {
      setLoginError("");
      await login(data);
      // Après login, rediriger côté client en respectant le param `redirect`
      const redirect = searchParams.get("redirect");
      const destination =
        redirect && redirect.startsWith("/") ? redirect : "/admin/dashboard";
      router.replace(destination);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Erreur de connexion",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue">
          Administration – Connexion
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@exemple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white font-semibold py-3 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
