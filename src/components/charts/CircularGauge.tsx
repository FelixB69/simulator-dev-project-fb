"use client";
import React, { useEffect, useState } from "react";

type Props = {
  value: number; // entre 0 et 10
  label?: string;
};

export default function CircularGauge({
  value,
  label = "Score de cohérence",
}: Props) {
  const clampedValue = Math.min(Math.max(value, 0), 10);
  const radius = 50;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;

  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(clampedValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [clampedValue]);

  const offset = circumference - (animatedValue / 10) * circumference;

  // ✅ Couleur dynamique selon le score
  const getStrokeColor = (val: number) => {
    if (val < 4) return "var(--pink)";
    if (val < 7) return "var(--orange)";
    return "var(--green)";
  };

  return (
    <div className="w-[160px] h-[160px] flex flex-col items-center justify-center relative">
      <div className="relative w-[140px] h-[140px]">
        <svg width="140" height="140" className="rotate-[-90deg]">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={getStrokeColor(animatedValue)}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease, stroke 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-[var(--gray-dark)]">
            {animatedValue.toFixed(1)}/10
          </span>
        </div>
      </div>
      <p className="text-sm text-[var(--gray-dark)] mt-2 text-center">
        {label}
      </p>
    </div>
  );
}
