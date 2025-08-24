"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm text-[var(--gray-dark)] border border-gray-200">
        <p>
          Nombre de profils :{" "}
          <strong>{payload[0].value?.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

type Props = {
  data: { range: string; count: number }[];
};

export default function SimilarityHistogram({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-[var(--gray-dark)] text-center py-8">
        Aucune donnée disponible pour l’histogramme.
      </div>
    );
  }

  // Transforme "0.0–0.1" en "0-1"
  const transformedData = data.map((d) => {
    const [min, max] = d.range.split("–").map(parseFloat);
    const roundedRange = `${Math.round(min * 10)}-${Math.round(max * 10)}`;
    return { ...d, displayRange: roundedRange };
  });

  return (
    <div className="w-full h-64 bg-[var(--gray-light)] rounded-[var(--radius)] p-4 mb-10">
      <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
        Répartition des scores de similarité
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={transformedData}>
          <CartesianGrid stroke="var(--gray-light)" strokeDasharray="2 4" />
          <XAxis
            dataKey="displayRange"
            tick={{ fill: "var(--gray)", fontSize: 12 }}
            label={{
              value: "Score (sur 10)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--gray)", fontSize: 12 }}
            label={{
              value: "Nombre de profils",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="var(--blue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
