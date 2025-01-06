"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, ChevronUp, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Separator } from "@/components/ui/separator";
import { EquipmentRecord } from "@/lib/types";

function EquipmentCard({
  item,
  onSelect,
}: {
  item: EquipmentRecord;
  onSelect: (item: EquipmentRecord) => void;
}) {
  return (
    <Card
      className="mb-4 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#140a9a] p-3 rounded-full text-white">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Serie:{" "}
                  <span className="font-medium text-gray-900">
                    {item.equipmentSerial}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Equipo:{" "}
                  <span className="font-medium text-gray-900">
                    {item.equipmentName}
                  </span>
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-[#140a9a] text-[#140a9a] bg-[#140a9a]/5"
              >
                {item.equipmentModel}
              </Badge>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-[#140a9a] font-medium group">
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="ml-1 group-hover:underline">Ver Detalles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EquipmentGroup({
  model,
  items,
  onSelectEquipment,
}: {
  model: string;
  items: EquipmentRecord[];
  onSelectEquipment: (item: EquipmentRecord) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-[#140a9a] text-white rounded-lg mb-2 shadow-sm hover:bg-[#1b0ecc] transition-colors">
        <h3 className="text-lg font-semibold">{model}</h3>
        <div className="bg-white/20 rounded-full p-1">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2 mt-2">
          {items.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              onSelect={onSelectEquipment}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function EquipmentList({
  equipment,
  onSelectEquipment,
}: {
  equipment: EquipmentRecord[];
  onSelectEquipment: (item: EquipmentRecord) => void;
}) {
  const groupedEquipment = equipment.reduce(
    (acc, item) => {
      if (!acc[item.equipmentModel]) {
        acc[item.equipmentModel] = [];
      }
      acc[item.equipmentModel].push(item);
      return acc;
    },
    {} as Record<string, EquipmentRecord[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedEquipment).map(([model, items]) => (
        <EquipmentGroup
          key={model}
          model={model}
          items={items}
          onSelectEquipment={onSelectEquipment}
        />
      ))}
    </div>
  );
}
