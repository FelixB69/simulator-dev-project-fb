import { useAllScores } from "@/hooks/useScores";
import { Cards } from "./Cards";

export function Metrics() {
  const { stats } = useAllScores();

  const STATS_CARDS = [
    {
      title: "Nombre de salaires",
      value: stats?.numberOfScores || 0,
      textColor: "blue",
      needCurrency: false,
    },

    {
      title: "Nombre d'utilisateurs",
      value: stats?.numberOfUsers || 0,
      textColor: "green",
      needCurrency: false,
    },
    {
      title: "Médiane des salaires",
      value: stats?.medianCompensation || 0,
      textColor: "orange",
      needCurrency: true,
    },
    {
      title: "Moyenne des salaires",
      value: stats?.averageCompensation || 0,
      textColor: "pink",
      needCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS_CARDS.map((card) => (
        <Cards
          titles={card.title}
          value={card.value}
          textColor={card.textColor}
          needCurrency={card.needCurrency}
        />
      ))}
    </div>
  );
}
