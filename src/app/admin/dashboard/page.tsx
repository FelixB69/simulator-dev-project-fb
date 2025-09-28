"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ScoresTable } from "@/components/admin/ScoresTable";
import { Metrics } from "@/components/admin/Metrics";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-gray-100 md:p-25 p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Metrics />
        <ScoresTable />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
