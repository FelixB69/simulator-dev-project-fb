"use client";

import { useAllScores } from "@/hooks/useAllScores";
import { Score } from "@/types/score";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { useState } from "react";

interface ScoresTableProps {
  className?: string;
}

export function ScoresTable({ className }: ScoresTableProps) {
  const { scores, isLoading, error, refetch } = useAllScores();
  const [sortField, setSortField] = useState<keyof Score>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Score) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedScores = [...scores].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null) return sortDirection === "asc" ? 1 : -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Salaire",
      "Exp. Entreprise",
      "Exp. Totale",
      "Localisation",
      "Email",
      "Consentement",
      "Date de création",
    ];

    const csvContent = [
      headers.join(","),
      ...scores.map((score) =>
        [
          score.id,
          score.compensation,
          score.company_xp || "N/A",
          score.total_xp,
          `"${score.location}"`,
          `"${score.email}"`,
          score.consent ? "Oui" : "Non",
          `"${formatDate(score.createdAt)}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `scores_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--blue)]"></div>
          <span className="ml-2 text-[var(--gray)]">
            Chargement des données...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
        <div className="text-center text-[var(--red)] py-8">
          <p className="text-lg font-medium">Erreur lors du chargement</p>
          <p className="text-sm mt-2">{error}</p>
          <Button
            onClick={refetch}
            variant="outline"
            className="mt-4 border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--gray-dark)]">
            Scores analysés
          </h2>
          <p className="text-sm text-[var(--gray)] mt-1">
            {scores.length} enregistrement{scores.length > 1 ? "s" : ""} trouvé
            {scores.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-[var(--white)]/90 backdrop-blur-sm hover:bg-[var(--white)] text-[var(--gray-dark)] hover:text-[var(--blue)] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-[var(--white)]/90 backdrop-blur-sm hover:bg-[var(--white)] text-[var(--gray-dark)] hover:text-[var(--blue)] shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter{" "}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-[var(--gray-light)] text-[var(--gray-dark)] font-semibold"
                onClick={() => handleSort("compensation")}
              >
                Salaire{" "}
                {sortField === "compensation" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-[var(--gray-light)] text-[var(--gray-dark)] font-semibold"
                onClick={() => handleSort("total_xp")}
              >
                Exp. Totale{" "}
                {sortField === "total_xp" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-[var(--gray-light)] text-[var(--gray-dark)] font-semibold"
                onClick={() => handleSort("location")}
              >
                Localisation{" "}
                {sortField === "location" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-[var(--gray-light)] text-[var(--gray-dark)] font-semibold"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-[var(--gray-light)] text-[var(--gray-dark)] font-semibold"
                onClick={() => handleSort("createdAt")}
              >
                Date{" "}
                {sortField === "createdAt" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedScores.map((score) => (
              <TableRow key={score.id} className="hover:bg-[var(--gray-light)]">
                <TableCell className="font-semibold text-[var(--pink)]">
                  {formatSalary(score.compensation)}
                </TableCell>

                <TableCell className="text-[var(--gray)]">
                  {score.total_xp} ans
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--blue)]/10 text-[var(--blue)]">
                    {score.location.trim()}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-[var(--gray)]">
                  {score.email}
                </TableCell>

                <TableCell className="text-sm text-[var(--gray)]">
                  {formatDate(score.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
