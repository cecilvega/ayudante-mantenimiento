"use client";

import React from "react";

import { AttendanceProvider } from "./components/contexts";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceList from "./components/AttendanceList";

export default function AttendanceRegistry() {
  return (
    <AttendanceProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <AttendanceHeader />
        <AttendanceList />
      </div>
    </AttendanceProvider>
  );
}
