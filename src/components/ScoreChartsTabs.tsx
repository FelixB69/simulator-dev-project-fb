"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import SalaryLineChart from "./charts/SalaryLineChart";
import SimilarityHistogram from "./charts/SimilarityHistogram";
import GaussCurveChart from "./charts/GaussCurveChart";

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
    <div className="mt-10 w-full px-4 sm:px-6 lg:px-0 max-w-5xl mx-auto">
      <Tabs defaultValue="line">
        <TabsList className="bg-[var(--gray-light)] rounded-[var(--radius)] p-1 flex flex-wrap gap-2 justify-center mb-4">
          <TabsTrigger
            value="line"
            className="px-3 py-2 text-sm sm:text-base text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition whitespace-nowrap"
          >
            Salaire par expérience
          </TabsTrigger>
          <TabsTrigger
            value="histogram"
            className="px-3 py-2 text-sm sm:text-base text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition whitespace-nowrap"
          >
            Répartition des scores
          </TabsTrigger>
          <TabsTrigger
            value="gauss"
            className="px-3 py-2 text-sm sm:text-base text-[var(--gray-dark)] data-[state=active]:bg-[var(--blue)] data-[state=active]:text-white rounded-md transition whitespace-nowrap"
          >
            Courbe de cohérence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="w-full overflow-x-auto">
          <SalaryLineChart data={chartData.averageByXp} />
        </TabsContent>

        <TabsContent value="histogram" className="w-full overflow-x-auto">
          <SimilarityHistogram data={chartData.histogram} />
        </TabsContent>

        <TabsContent value="gauss" className="w-full overflow-x-auto">
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
