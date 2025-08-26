"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import SalaryLineChart from "./charts/SalaryLineChart";
import SimilarityHistogram from "./charts/SimilarityHistogram";
import GaussCurveChart from "./charts/GaussCurveChart";
import { mergeAvgMed } from "@/utils/helper";

type Props = {
  chartData: {
    averageByXp: { xp: number; average: number }[];
    medianByXp: { xp: number; median: number }[];
    histogram: { range: string; count: number }[];
  };
  coherenceScore: number;
  meanScore: number;
  stdScore: number;
};

const TABS = [
  { value: "line", label: "Salaire par expérience" },
  { value: "histogram", label: "Répartition des scores" },
  { value: "gauss", label: "Courbe de cohérence" },
] as const;

export default function ScoreChartsTabs({
  chartData,
  coherenceScore,
  meanScore,
  stdScore,
}: Props) {
  const [value, setValue] = React.useState<string>("line");

  // dataFromApi = l'objet JSON que tu as collé
  const { averageByXp, medianByXp } = chartData;
  const mergedData = mergeAvgMed(averageByXp, medianByXp);

  return (
    <div className="w-full px-2 sm:px-4 lg:px-0 max-w-5xl mx-auto">
      {/* Mobile: Select */}
      <div className="md:hidden mb-3">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un graphique" />
          </SelectTrigger>
          <SelectContent>
            {TABS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop/Tablet: Tabs scrollables */}
      <Tabs value={value} onValueChange={setValue}>
        <div className="relative hidden md:block mb-3">
          <TabsList
            className="
              bg-[var(--gray-light)] rounded-[var(--radius)] p-1
              flex gap-2 justify-start
              overflow-x-auto no-scrollbar
              whitespace-nowrap
              scroll-p-2 snap-x snap-mandatory
            "
          >
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="
                  px-3 py-2 text-sm sm:text-base text-[var(--gray-dark)]
                  data-[state=active]:bg-[var(--blue)]
                  data-[state=active]:text-white rounded-md transition
                  snap-start
                "
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Contenus */}
        <TabsContent value="line" className="w-full">
          <SalaryLineChart data={mergedData} />
        </TabsContent>

        <TabsContent value="histogram" className="w-full">
          <SimilarityHistogram data={chartData.histogram} />
        </TabsContent>

        <TabsContent value="gauss" className="w-full">
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
