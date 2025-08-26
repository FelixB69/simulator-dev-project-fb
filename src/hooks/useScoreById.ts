import { useCallback, useEffect, useRef, useState } from "react";

export type ScoreOutput = {
  diagnostic: { title: string; description: string; icon?: string };
  estimatedGap: {
    predicted: number;
    actual: number;
    difference: number;
    percentage: number;
    comment: string;
  };
  salaryPosition: { percentile: number; rankLabel: string; comparison: string };
  chartData: {
    averageByXp: { xp: number; average: number }[];
    histogram: { range: string; count: number }[];
  };
  coherenceScore: number;
  meanScore: number;
  stdScore: number;
  conseil?: string;
};

type ApiResponse = {
  id: string;
  input?: any;
  output?: ScoreOutput;
  createdAt?: string;
  [k: string]: any;
};

type UseScoreOptions = {
  baseUrl?: string;
  skip?: boolean;
};

type UseScoreReturn = {
  data: ScoreOutput | null;
  raw: ApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useScoreById(
  id?: string | null,
  opts: UseScoreOptions = {},
): UseScoreReturn {
  const baseUrl = opts.baseUrl ?? process.env.NEXT_PUBLIC_API_URL!;
  const [data, setData] = useState<ScoreOutput | null>(null);
  const [raw, setRaw] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id && !opts.skip);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOnce = useCallback(async () => {
    if (!id) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/scores/analyze/${id}`, {
        method: "GET",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: ApiResponse = await res.json();
      const normalized = (json.output ?? (json as unknown)) as ScoreOutput;

      setRaw(json);
      setData(normalized);
    } catch (e: any) {
      if (e?.name === "AbortError") return; // navigation/refresh
      setError(e?.message ?? "Erreur réseau");
      setData(null);
      setRaw(null);
    } finally {
      setLoading(false);
    }
  }, [id, baseUrl]);

  // auto-fetch au mount/changement d’id (sauf skip)
  useEffect(() => {
    if (!id || opts.skip) return;
    fetchOnce();
    return () => abortRef.current?.abort();
  }, [id, opts.skip, fetchOnce]);

  return {
    data,
    raw,
    loading,
    error,
    refetch: fetchOnce,
  };
}
