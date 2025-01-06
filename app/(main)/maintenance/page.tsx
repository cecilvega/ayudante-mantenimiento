import React from "react";
import MaintenanceHome from "./MaintenanceHome";
import MainLayout from "@/app/components/layout/MainLayout";

export default function MaintenancePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <MaintenanceHome />
      </div>
    </MainLayout>
  );
}
