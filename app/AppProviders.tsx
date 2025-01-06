"use client";

import { useEffect, useState } from "react";
import { initializeAppData } from "@/lib/services/initialization";
import { AuthProvider } from "@/lib/context/AuthContext";
import { DataProvider } from "@/lib/context/DataProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeAppData();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize app data:", error);
        setIsInitialized(false);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#140a9a]" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <ServiceWorkerRegister />
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
