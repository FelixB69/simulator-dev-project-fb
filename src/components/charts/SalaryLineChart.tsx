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
  Legend,
} from "recharts";

type Row = {
  xp: number;
  average?: number; // moyenne
  median?: number; // médiane
};

type Props = {
  data: Row[];
};

const currency = (v?: number) =>
  typeof v === "number" ? v.toLocaleString() + " €" : "—";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const byKey = Object.fromEntries(
      payload.map((p) => [p.dataKey as string, p.value as number | undefined]),
    );
    return (
      <div className="bg-white p-2 rounded shadow text-sm text-[var(--gray-dark)] border border-gray-200">
        <p className="font-semibold mb-1">{label} an(s) d'expérience</p>
        {byKey.average !== undefined && (
          <p>
            Salaire <strong>moyen</strong> :{" "}
            <strong>{currency(byKey.average)}</strong>
          </p>
        )}
        {byKey.median !== undefined && (
          <p>
            Salaire <strong>médian</strong> :{" "}
            <strong>{currency(byKey.median)}</strong>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SalaryLineChart({ data }: Props) {
  const hasAverage = data.some((d) => typeof d.average === "number");
  const hasMedian = data.some((d) => typeof d.median === "number");

  return (
    <div className="w-full h-64 bg-[var(--gray-light)] rounded-[var(--radius)] p-4 mb-10">
      <h3 className="font-semibold text-[var(--gray-dark)] mb-2">
        Salaires selon l'expérience (moyenne & médiane)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ bottom: 24 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="gray"
            strokeOpacity={0.2}
          />
          <XAxis dataKey="xp" />
          <YAxis tickFormatter={(v) => `${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" align="center" layout="horizontal" />

          {hasAverage && (
            <Line
              type="monotone"
              dataKey="average"
              name="Moyenne"
              stroke="#06d6a0"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}

          {hasMedian && (
            <Line
              type="monotone"
              dataKey="median"
              name="Médiane"
              stroke="#1b9aaa"
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="4 4"
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
