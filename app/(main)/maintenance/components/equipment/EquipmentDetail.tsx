"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Barcode, ListTodo, Plus, Settings, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentRecord } from "@/lib/types";

function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 bg-gray-50 rounded-lg p-4 ${className || ""}`}
    >
      <div className="bg-[#140a9a] p-2 rounded-full">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export function EquipmentDetail({
  equipment,
  onComponentClick,
  onBacklogClick,
  onJustDoItClick,
}: {
  equipment: EquipmentRecord;
  onComponentClick: () => void;
  onBacklogClick: () => void;
  onJustDoItClick: () => void;
}) {
  return (
    <div className="flex flex-col space-y-6">
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-[#140a9a] to-[#1e14b3] p-3 text-white flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 transition-colors text-xs"
            >
              CAEX
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 transition-colors text-xs"
            >
              {equipment.equipmentModel}
            </Badge>
          </div>
          <div className="p-4 bg-white">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem
                icon={Settings}
                label="Modelo"
                value={equipment.equipmentModel}
              />
              <InfoItem
                icon={Barcode}
                label="Serie"
                value={equipment.equipmentSerial}
              />
              <InfoItem
                icon={Truck}
                label="Equipo"
                value={equipment.equipmentName}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={onComponentClick}
          variant="outline"
          className="h-24 flex items-center justify-center px-6 hover:bg-[#140a9a] hover:text-white transition-all duration-300 border-2 border-[#140a9a] rounded-xl shadow-md hover:shadow-lg group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-[#140a9a] p-3 rounded-full group-hover:bg-white">
              <Settings className="h-8 w-8 text-white group-hover:text-[#140a9a]" />
            </div>
            <h3 className="text-xl font-bold text-[#140a9a] group-hover:text-white text-center">
              CAMBIO DE COMPONENTE
            </h3>
          </div>
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={onBacklogClick}
            variant="outline"
            className="h-24 flex items-center justify-center px-6 hover:bg-[#140a9a] hover:text-white transition-all duration-300 border-2 border-[#140a9a] rounded-xl shadow-md hover:shadow-lg group"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-[#140a9a] p-3 rounded-full group-hover:bg-white">
                <ListTodo className="h-8 w-8 text-white group-hover:text-[#140a9a]" />
              </div>
              <h3 className="text-xl font-bold text-[#140a9a] group-hover:text-white text-center">
                BACKLOG
              </h3>
            </div>
          </Button>
          <Button
            onClick={onJustDoItClick}
            variant="outline"
            className="h-24 flex items-center justify-center px-6 hover:bg-[#140a9a] hover:text-white transition-all duration-300 border-2 border-[#140a9a] rounded-xl shadow-md hover:shadow-lg group"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-[#140a9a] p-3 rounded-full group-hover:bg-white">
                <Plus className="h-8 w-8 text-white group-hover:text-[#140a9a]" />
              </div>
              <h3 className="text-xl font-bold text-[#140a9a] group-hover:text-white text-center">
                JUST DO IT
              </h3>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
