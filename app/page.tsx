"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Puzzle,
  ClipboardListIcon,
  ShieldIcon,
  WrenchIcon,
} from "lucide-react";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { motion } from "framer-motion";

export default function Home() {
  const menuItems = [
    {
      href: "/attendance",
      icon: ClipboardListIcon,
      title: "Registro de Asistencia",
    },
    { href: "/admin", icon: ShieldIcon, title: "Administración" },
    { href: "/maintenance", icon: WrenchIcon, title: "Mantenimiento" },
    { title: "Asesor Técnico", href: "/asesor-tecnico", icon: Puzzle },

  ];
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
          <main className="flex-grow container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-[#140a9a] tracking-tight mb-12 text-center"
            >
              Ayudante Mantenimiento
            </motion.h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={item.href} passHref>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-[#140a9a] rounded-lg overflow-hidden hover:bg-[#140a9a] group">
                      <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                        <item.icon className="h-12 w-12 text-[#140a9a] group-hover:text-white mb-4 transition-colors duration-300" />
                        <h2 className="text-lg font-semibold text-[#140a9a] group-hover:text-white transition-colors duration-300">
                          {item.title}
                        </h2>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
