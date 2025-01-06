"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import React, { useState, useEffect } from "react";
import { SideTab } from "@/app/components/layout/SideTab";

export const Header: React.FC = () => {
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    // Define event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // const isOnline = true; // This would be determined by your app's logic
  const handleMenuClick = () => {
    setIsSideTabOpen(true);
  };

  const handleSideTabClose = () => {
    setIsSideTabOpen(false);
  };

  return (
    <header className="bg-[#140a9a] text-white p-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className={`w-6 h-6 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
            />
            <div
              className={`absolute inset-0 w-6 h-6 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              } animate-ping opacity-75`}
            />
          </div>
          <span className="text-2xl font-bold tracking-wider">KOMATSU</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm hidden md:inline-block">{user?.email}</span>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleMenuClick}
            className="bg-[#140a9a] text-white hover:bg-[#1c10c4] transition-colors duration-300 p-2 h-14 w-14 border-2 border-white"
          >
            <MenuIcon className="h-12 w-12" />
          </Button>
        </div>
      </div>
      <SideTab
        isOpen={isSideTabOpen}
        onClose={handleSideTabClose}
        userEmail={user?.email ?? undefined}
      />
    </header>
  );
};
