"use client";
import React from "react";
import { motion } from "framer-motion";
import { TypingAnimation } from "./magicui/terminal";
import ScoreChartsTabs from "./ScoreChartsTabs";
import CircularGauge from "./charts/CircularGauge";
import { toScore10 } from "@/utils/helper";

type ScoreResultProps = {
  result: {
    diagnostic: {
      title: string;
      description: string;
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
    conseil: string;
    chartData: {
      averageByXp: { xp: number; average: number }[];
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
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function ScoreResult({ result }: ScoreResultProps) {
  const { diagnostic, estimatedGap, salaryPosition, conseil } = result;

  const userScore10 = toScore10(result.coherenceScore);
  const meanScore10 = toScore10(result.meanScore);

  const diffClass =
    estimatedGap.difference < 0
      ? "text-[var(--pink)]"
      : estimatedGap.difference > 0
      ? "text-[var(--green)]"
      : "text-[var(--gray-dark)]";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative max-w-3xl mx-auto m-10"
    >
      <div className="relative z-10 bg-[var(--white)] shadow-xl rounded-[var(--radius)] p-8 space-y-8 overflow-hidden">
        {/* Bloc 1 - Diagnostic général */}
        <motion.div
          variants={fadeIn}
          custom={0}
          className="flex flex-col align-center"
        >
          <h2 className="text-2xl font-bold text-[var(--blue)] text-center mb-10">
            {diagnostic.title}
          </h2>
          <div className="flex justify-center mb-6">
            <CircularGauge value={userScore10} label="Ton score de cohérence" />
            <CircularGauge value={meanScore10} label="Le score moyen" />
          </div>

          <TypingAnimation
            delay={300}
            className=" ml-auto mr-auto text-[var(--gray-dark)] mt-4 text-center text-lg font-semibold leading-relaxed "
          >
            {diagnostic.description}
          </TypingAnimation>
        </motion.div>

        {/* Bloc 2 - Écart par rapport à la prédiction */}
        <motion.div
          className="bg-[var(--gray-light)] p-4 rounded-[var(--radius)]"
          variants={fadeIn}
          custom={1}
        >
          <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
            Comparaison avec estimation
          </h3>
          <ul className="text-sm space-y-1">
            <li>
              Ton salaire :{" "}
              <strong>{estimatedGap.actual.toLocaleString()} €</strong>
            </li>
            <li>
              Notre estimation :{" "}
              <strong>{estimatedGap.predicted.toLocaleString()} €</strong>
            </li>
            <li className={diffClass}>
              Écart :{" "}
              <strong>
                {estimatedGap.difference > 0 ? "+" : ""}
                {estimatedGap.difference.toLocaleString()} €
              </strong>{" "}
              ({estimatedGap.percentage}%)
            </li>
            <li className="text-[var(--gray-dark)]">{estimatedGap.comment}</li>
          </ul>
        </motion.div>

        {/* Bloc 3 - Position dans la population */}
        <motion.div
          className="bg-[var(--gray-light)] p-4 rounded-[var(--radius)]"
          variants={fadeIn}
          custom={2}
        >
          <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
            Position salariale
          </h3>
          <p className="text-sm text-[var(--gray-dark)]">
            Tu te situes dans la <strong>{salaryPosition.rankLabel}</strong> des
            salaires (<strong>{salaryPosition.percentile}ᵉ percentile</strong>).
          </p>
          <p className="text-sm text-[var(--gray-dark)] mt-1">
            {salaryPosition.comparison}
          </p>
        </motion.div>

        {/* Bloc 4 - Conseil */}
        {conseil && (
          <motion.div
            className="bg-[var(--orange)] text-[var(--gray-dark)] p-4 rounded-[var(--radius)]"
            variants={fadeIn}
            custom={3}
          >
            <h3 className="font-semibold mb-1">Conseil</h3>
            <p className="text-sm">{conseil}</p>
          </motion.div>
        )}

        <ScoreChartsTabs
          chartData={result.chartData}
          coherenceScore={result.coherenceScore} // ← toujours entre 0–1
          meanScore={result.meanScore}
          stdScore={result.stdScore}
        />
      </div>
    </motion.div>
  );
}
