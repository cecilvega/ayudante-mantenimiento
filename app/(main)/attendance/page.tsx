"use client";

import React from "react";
import AttendanceRegistry from "./AttendanceRegistry";
import MainLayout from "@/app/components/layout/MainLayout";

export default function AttendanceRegistryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <AttendanceRegistry />
      </div>
    </MainLayout>
  );
}
