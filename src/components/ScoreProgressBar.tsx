import React from "react";

type ScoreProgressBarProps = {
  score: number;
};

export default function ScoreProgressBar({ score }: ScoreProgressBarProps) {
  const scoreOutOf10 = (score * 10).toFixed(1);
  const percentage = Math.min(score * 100, 100);

  // Couleur de la barre selon le score
  let barColor = "bg-[var(--green)]";
  if (score < 0.4) barColor = "bg-[var(--pink)]";
  else if (score < 0.65) barColor = "bg-[var(--orange)]";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-[var(--gray-dark)]">
        <span>Score de cohérence</span>
        <span>{scoreOutOf10} / 10</span>
      </div>
      <div className="w-full h-4 bg-[var(--gray-light)] rounded-[var(--radius)] overflow-hidden">
        <div
          className={`h-full ${barColor} transition-[width] duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
