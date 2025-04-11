"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import SalaryLineChart from "./SalaryLineChart";
import SimilarityHistogram from "./SimilarityHistogram";
import GaussCurveChart from "./GaussCurveChart";

type Props = {
  chartData: {
    averageByXp: { xp: number; average: number }[];
    histogram: { range: string; count: number }[];
  };
  coherenceScore: number;
  meanScore: number;
  stdScore: number;
};

export default function ScoreChartsTabs({
  chartData,
  coherenceScore,
  meanScore,
  stdScore,
}: Props) {
  return (
    <div className="mt-10 w-full max-w-2xl mx-auto ">
      <Tabs defaultValue="line">
        <TabsList className="bg-[var(--gray-light)] rounded-[var(--radius)] p-1 flex gap-2 justify-center mb-4">
          <TabsTrigger
            value="line"
            className="px-4 py-1 text-sm text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition"
          >
            Salaire par expérience
          </TabsTrigger>
          <TabsTrigger
            value="histogram"
            className="px-4 py-1 text-sm text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition"
          >
            Répartition des scores
          </TabsTrigger>
          <TabsTrigger
            value="gauss"
            className="px-4 py-1 text-sm text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition"
          >
            Courbe de cohérence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="line">
          <SalaryLineChart data={chartData.averageByXp} />
        </TabsContent>

        <TabsContent value="histogram">
          <SimilarityHistogram data={chartData.histogram} />
        </TabsContent>

        <TabsContent value="gauss">
          <GaussCurveChart
            mean={meanScore}
            std={stdScore}
            userScore={coherenceScore}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
