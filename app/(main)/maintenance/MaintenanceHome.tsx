"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EquipmentList } from "./components/equipment/EquipmentList";
import { EquipmentRecord } from "@/lib/types";
import { fetchEquipos } from "@/lib/services";
import { MaintenanceDrawer } from "@/app/(main)/maintenance/MaintenanceDrawer";

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#140a9a] to-[#1b0ecc] text-white text-center py-10">
          <CardTitle className="text-4xl font-bold">
            Gestión de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center h-[calc(100vh-20rem)]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#140a9a]" />
            <p className="text-gray-600 text-lg">Cargando equipos...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function MaintenanceHome() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedEquipment, setSelectedEquipment] =
    React.useState<EquipmentRecord | null>(null);
  const [equipments, setEquipments] = useState<Record<string, EquipmentRecord>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  // Replace collection hooks with direct fetch calls
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [equipmentsData] = await Promise.all([fetchEquipos()]);

        setEquipments(equipmentsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Run once on mount

  const filteredEquipment = React.useMemo(() => {
    // Ensure we're working with an array of EquipmentRecord

    const equipmentArray = Array.isArray(equipments)
      ? equipments
      : Object.values(equipments).filter(
          (item): item is EquipmentRecord =>
            item != null &&
            typeof item === "object" &&
            "equipmentName" in item &&
            "equipmentSerial" in item &&
            "equipmentModel" in item,
        );

    return equipmentArray.filter(
      (item) =>
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipmentSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipmentModel.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [equipments, searchTerm]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#140a9a] to-[#1b0ecc] text-white text-center py-10">
            <CardTitle className="text-4xl font-bold">
              Gestión de Equipos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por Equipo, Serie o Modelo..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-gray-200 focus:border-[#140a9a] focus:ring-2 focus:ring-[#140a9a] focus:ring-opacity-50 transition-all duration-300"
                />
              </div>

              <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                <EquipmentList
                  equipment={filteredEquipment}
                  onSelectEquipment={(item) => setSelectedEquipment(item)}
                />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedEquipment && (
        <MaintenanceDrawer
          isOpen={!!selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          equipment={selectedEquipment}
        />
      )}
    </div>
  );
}
