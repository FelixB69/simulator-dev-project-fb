"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Logo SVG simple pour l'administration (vous pouvez le remplacer par votre propre logo)
const AdminLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-600"
  >
    <path
      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 17C9.33 17 7.07 15.45 6.25 13.24C6.39 11.69 9.33 10.5 12 10.5S17.61 11.69 17.75 13.24C16.93 15.45 14.67 17 12 17Z"
      fill="currentColor"
    />
  </svg>
);

export default function AdminButtonWithLogo() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/admin">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 shadow-lg transition-all duration-200 hover:scale-105"
          title="Administration"
        >
          <AdminLogo />
        </Button>
      </Link>
    </div>
  );
}
