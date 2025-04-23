"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

type Props = {
  data: { xp: number; average: number }[];
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm text-[var(--gray-dark)] border border-gray-200">
        <p>
          Salaire moyen :{" "}
          <strong>{payload[0].value?.toLocaleString()} €</strong>
        </p>
      </div>
    );
  }

  return null;
};

export default function SalaryLineChart({ data }: Props) {
  return (
    <div className="w-full h-64 bg-[var(--gray-light)] rounded-[var(--radius)] p-4">
      <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
        Salaire moyen selon l'expérience
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="gray"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="xp"
            label={{
              value: "Années d'expérience",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis tickFormatter={(v) => `${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="average"
            stroke="#06d6a0"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
