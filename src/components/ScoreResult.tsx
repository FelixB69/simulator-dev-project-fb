"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingAnimation } from "./magicui/terminal";
import ScoreChartsTabs from "./ScoreChartsTabs";
import CircularGauge from "./charts/CircularGauge";
import { toScore10 } from "@/utils/helper";
import { cn } from "@/utils/cn";

type ScoreResultProps = {
  result: {
    diagnostic: {
      title: string;
      description: string;
      icon?: string;
    };
    estimatedGap: {
      predicted: number;
      actual: number;
      difference: number;
      percentage: number;
      comment: string;
    };
    salaryPosition: {
      percentile: number;
      rankLabel: string;
      comparison: string;
    };
    conseil?: string;
    chartData: {
      averageByXp: { xp: number; average: number }[];
      medianByXp: { xp: number; median: number }[];
      histogram: { range: string; count: number }[];
    };
    coherenceScore: number;
    meanScore: number;
    stdScore: number;
  };
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};
const ResultCard = ({ children, className, custom }: any) => (
  <motion.div
    variants={fadeIn}
    custom={custom}
    className={cn(
      "relative backdrop-blur-sm bg-[var(--white)]/90 shadow-lg rounded-[var(--radius)] p-4 sm:p-6 md:p-8",
      className,
    )}
  >
    {children}
  </motion.div>
);

export default function ScoreResult({ result }: ScoreResultProps) {
  const { diagnostic, estimatedGap, salaryPosition, conseil } = result;
  const userScore10 = toScore10(result.coherenceScore);
  const meanScore10 = toScore10(result.meanScore);

  const diffClass = cn(
    "font-medium",
    estimatedGap.difference < 0
      ? "text-[var(--pink)]"
      : estimatedGap.difference > 0
      ? "text-[var(--green)]"
      : "text-[var(--gray-dark)]",
  );

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto py-12 px-4 text-center text-[var(--gray-dark)]"
      >
        <div className="relative z-10 space-y-6">
          <ResultCard custom={0} className="text-center">
            <motion.h2
              variants={fadeIn}
              custom={0.5}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-[var(--blue)]"
            >
              {diagnostic.title.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={
                    word.match(/[\u{1F300}-\u{1F9FF}]/u)
                      ? "inline-block text-4xl animate-bounce"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <CircularGauge
                value={userScore10}
                label="Ton score de cohérence"
              />
              <CircularGauge value={meanScore10} label="Le score moyen" />
            </div>

            <h1 className="text-[var(--gray-dark)] text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              {diagnostic.description}
            </h1>
          </ResultCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard custom={1}>
              <h3 className="text-lg font-semibold text-[var(--blue)] mb-3">
                Comparaison avec estimation
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-[var(--gray-dark)]">Ton salaire</span>
                  <span className="font-semibold">
                    {estimatedGap.actual.toLocaleString()} €
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[var(--gray-dark)]">
                    Notre estimation
                  </span>
                  <span className="font-semibold">
                    {estimatedGap.predicted.toLocaleString()} €
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[var(--gray-dark)]">Écart</span>
                  <span className={diffClass}>
                    {estimatedGap.difference > 0 ? "+" : ""}
                    {estimatedGap.difference.toLocaleString()} € (
                    {estimatedGap.percentage}%)
                  </span>
                </li>
                <li className="text-sm text-[var(--gray-dark)] mt-2 italic">
                  {estimatedGap.comment}
                </li>
              </ul>
            </ResultCard>

            <ResultCard custom={2}>
              <h3 className="text-lg font-semibold text-[var(--blue)] mb-3">
                Position salariale
              </h3>
              <div className="space-y-3">
                <p className="text-[var(--gray-dark)]">
                  Tu te situes dans la{" "}
                  <span className="font-semibold text-[var(--blue)]">
                    {salaryPosition.rankLabel}
                  </span>{" "}
                  des salaires (
                  <span className="font-semibold">
                    {salaryPosition.percentile}ᵉ percentile
                  </span>
                  ).
                </p>
                <p className="text-sm text-[var(--gray-dark)]">
                  {salaryPosition.comparison}
                </p>
              </div>
            </ResultCard>
          </div>

          {conseil && (
            <ResultCard
              custom={3}
              className="bg-gradient-to-r from-[var(--orange)]/10 to-[var(--orange)]/20 border border-[var(--orange)]/20"
            >
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="p-2 rounded-full bg-[var(--orange)]/10">
                  <svg
                    className="w-6 h-6 text-[var(--orange)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--gray-dark)] mb-1">
                    Conseil personnalisé
                  </h3>
                  <p className="text-[var(--gray-dark)]">{conseil}</p>
                </div>
              </div>
            </ResultCard>
          )}

          <ResultCard custom={4}>
            <div className="w-full">
              <ScoreChartsTabs
                chartData={result.chartData}
                coherenceScore={result.coherenceScore}
                meanScore={result.meanScore}
                stdScore={result.stdScore}
              />
            </div>
          </ResultCard>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
