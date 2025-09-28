import { euroFR } from "@/utils/helper";

export function Cards({
  titles,
  value,
  textColor,
  needCurrency,
}: {
  titles: string;
  value: number;
  textColor: string;
  needCurrency: boolean;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col  items-center">
      <h2 className="text-xl font-semibold mb-2">{titles}</h2>
      <p className={`text-3xl font-bold text-${textColor}`}>
        {needCurrency ? euroFR(value) : value}
      </p>
    </div>
  );
}
