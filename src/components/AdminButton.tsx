"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function AdminButton() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/admin">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 shadow-lg transition-all duration-200"
          title="Administration"
        >
          <Settings className="h-4 w-4 text-gray-600" />
        </Button>
      </Link>
    </div>
  );
}
