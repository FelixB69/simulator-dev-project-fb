"use client";
import { toScore10 } from "@/utils/helper";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  TooltipProps,
} from "recharts";

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// Fonction de densité Gaussienne
const gaussian = (x: number, mean: number, std: number) => {
  const exponent = -((x - mean) ** 2) / (2 * std ** 2);
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

type Props = {
  mean: number;
  std: number;
  userScore: number;
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const score = payload[0].payload.score * 10;
    const density = payload[0].payload.density * 100;

    return (
      <div className="bg-white p-2 rounded shadow text-sm text-[var(--gray-dark)] border border-gray-200">
        <p>
          Score : <strong>{score.toFixed(1)} / 10</strong>
        </p>
        <p>
          Densité : <strong>{density.toFixed(1)} %</strong>
        </p>
      </div>
    );
  }

  return null;
};

export default function GaussCurveChart({ mean, std, userScore }: Props) {
  // Génère des points x entre min et max (0 à 1 ici, car les scores sont entre 0 et 1)
  const xValues = Array.from({ length: 100 }, (_, i) => i / 99);

  const data = xValues.map((x) => ({
    score: x,
    density: gaussian(x, mean, std),
  }));

  return (
    <div className="w-full h-64 bg-[var(--gray-light)] rounded-[var(--radius)] p-4 mb-10">
      <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
        Position de ton score dans la distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="gray"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="score"
            type="number"
            domain={[0, 1]}
            tickFormatter={(val) => `${(val * 10).toFixed(1)}`}
            label={{ value: "Score", position: "insideBottom", offset: -5 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="density"
            stroke="#26547c"
            strokeWidth={2}
            dot={false}
            name="Courbe de Gauss"
          />
          <ReferenceDot
            x={userScore}
            y={gaussian(userScore, mean, std)}
            r={5}
            fill="#ef476f"
            stroke="none"
            label={{
              position: "top",
              value: `Ton score : ${toScore10(userScore)} / 10`,
              fontSize: 12,
              fill: "#ef476f",
              dy: -10,
              dx: -50,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
