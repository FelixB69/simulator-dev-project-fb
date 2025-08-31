// app/scores/[id]/page.tsx
"use client";

import { useParams, notFound } from "next/navigation";
import { useScoreById } from "@/hooks/useScoreById";
import ScoreResult from "@/components/ScoreResult";
import ErrorState from "@/components/ErrorState"; // ton composant d’erreur avec bouton retry, etc.
import ResultSkeleton from "@/components/ResultSkeleton";

export default function ScorePage() {
  const { id } = useParams<{ id: string }>();
  const { output, input, loading, error, refetch } = useScoreById(id);

  if (loading) return <ResultSkeleton />;

  if (error) {
    return (
      <ErrorState
        title="Impossible de charger ce score"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!output || !input) {
    return (
      <ErrorState
        title="Aucun résultat"
        message="Le score demandé n'a pas été trouvé."
        onRetry={refetch}
      />
    );
  }

  return <ScoreResult output={output} input={input} />;
}
