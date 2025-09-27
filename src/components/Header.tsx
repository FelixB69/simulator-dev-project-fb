"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="fixed top-4 left-4 z-50">
      <nav className="flex items-center space-x-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 bg-[var(--white)]/90 backdrop-blur-sm hover:bg-[var(--white)] text-[var(--gray-dark)] hover:text-[var(--blue)] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            title="Accueil"
          >
            <Home size={18} />
          </Button>
        </Link>

        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-[var(--white)]/90 backdrop-blur-sm hover:bg-[var(--white)] text-[var(--gray-dark)] hover:text-[var(--blue)] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            title="Administration"
          >
            <Shield size={18} />
          </Button>
        </Link>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2 bg-[var(--white)]/90 backdrop-blur-sm  text-[var(--gray-dark)] hover:text-[var(--pink)] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </Button>
        )}
      </nav>
    </header>
  );
}
