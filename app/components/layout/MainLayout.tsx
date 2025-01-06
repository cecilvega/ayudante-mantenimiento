"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { SideTab } from "./SideTab";
import { Footer } from "./Footer";
import { useAuth } from "@/lib/context/AuthContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleSideTabClose = () => {
    setIsSideTabOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <SideTab
        isOpen={isSideTabOpen}
        onClose={handleSideTabClose}
        userEmail={user?.email ?? undefined}
      />
      <main className="flex-grow">
        {loading ? <div>Loading...</div> : children}
      </main>
      <Footer />
    </div>
  );
}
