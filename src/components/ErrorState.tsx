"use client";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Erreur",
  message = "Une erreur est survenue.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <h2 className="text-xl font-semibold text-red-600">{title}</h2>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Réessayer
        </Button>
      )}
    </div>
  );
}
