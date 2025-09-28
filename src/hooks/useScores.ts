"use client";

import { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { Score } from "@/types/score";
import { Stats } from "@/types/stats";

export function useAllScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
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

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await get("https://api-felixberger.fr/scores/stats");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
      // Traitez les données des statistiques ici
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    fetchStats();
  }, []);

  const refetch = () => {
    fetchScores();
    fetchStats();
  };

  return {
    scores,
    stats,
    isLoading,
    error,
    refetch,
  };
}
