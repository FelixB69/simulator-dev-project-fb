"use client";

import { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { Score } from "@/types/score";

export function useAllScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useAuthenticatedFetch();

  const fetchScores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await get("https://api-felixberger.fr/scores/all");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: Score[] = await response.json();
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const refetch = () => {
    fetchScores();
  };

  return {
    scores,
    isLoading,
    error,
    refetch,
  };
}
