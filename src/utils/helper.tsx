type Avg = { xp: number; average: number };
type Med = { xp: number; median: number };
type Row = { xp: number; average?: number; median?: number };

// merges the data by xp into a single array
export function mergeAvgMed(averageByXp: Avg[], medianByXp: Med[]): Row[] {
  const map = new Map<number, Row>();
  for (const a of averageByXp) {
    map.set(a.xp, { xp: a.xp, average: a.average });
  }
  for (const m of medianByXp) {
    const prev = map.get(m.xp) ?? { xp: m.xp };
    map.set(m.xp, { ...prev, median: m.median });
  }
  return Array.from(map.values()).sort((a, b) => a.xp - b.xp);
}

export const toScore10 = (value: number) => +(value * 10).toFixed(1);

export const euroFR = (v: number | undefined | null) =>
  typeof v === "number" && !Number.isNaN(v)
    ? v.toLocaleString("fr-FR") + " €"
    : "—";

export const yearsFR = (v: number | undefined | null) =>
  typeof v === "number" && !Number.isNaN(v)
    ? `${v} an${v > 1 ? "s" : ""}`
    : "—";

export const textOrDash = (v: unknown) =>
  typeof v === "string" && v.trim() !== ""
    ? v
    : v &&
      typeof v === "object" &&
      "label" in (v as any) &&
      typeof (v as any).label === "string"
    ? (v as any).label
    : "—";
