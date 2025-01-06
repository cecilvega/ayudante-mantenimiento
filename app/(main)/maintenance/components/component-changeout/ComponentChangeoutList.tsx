import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useComponentContext } from "./contexts";
import { MapPin, PenToolIcon, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentChangeoutTask } from "@/lib/types";
import { ComponentChangeoutCard } from "./ComponentChangeoutCard";
import { ComponentChangeoutEdit } from "./ComponentChangeoutEdit";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import { componentNameMap, positionNameMap } from "../../constants";

export function ComponentChangeoutList({
  onAddNew,
  onEdit,
}: {
  onAddNew: () => void;
  onEdit: (component: ComponentChangeoutTask) => void;
}) {
  const [editingComponent, setEditingComponent] =
    useState<ComponentChangeoutTask | null>(null);

  const {
    selectedComponent,
    equipment,
    handleRemoveComponentChangeout,
    loadComponentChangeouts,
    isLoading,
    componentTasks,
    setComponentTasks,
  } = useComponentContext();

  useEffect(() => {
    console.log("Loading component changeouts with:", {
      equipmentName: equipment.equipmentName,
      componentName: selectedComponent.componentName,
      positionName: selectedComponent.positionName,
    });
    loadComponentChangeouts();
  }, [
    loadComponentChangeouts,
    selectedComponent.componentName,
    selectedComponent.positionName,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#140a9a] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando componentes...</p>
        </div>
      </div>
    );
  }

  if (editingComponent) {
    return (
      <ComponentChangeoutEdit
        component={editingComponent}
        equipment={equipment}
        onBack={() => {
          setEditingComponent(null);
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-6 overflow-hidden transition-all hover:shadow-lg border-t-4 border-t-[#140a9a] bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full shadow-md">
                <Image
                  src={`/icons/${selectedComponent.componentName}.png?height=92&width=92`}
                  alt={`Icon for ${componentNameMap[selectedComponent.componentName]}`}
                  width={92}
                  height={92}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {componentNameMap[selectedComponent.componentName]}
                </h3>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <PenToolIcon className="h-4 w-4 mr-1" />
                    {equipment.equipmentName}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {positionNameMap[selectedComponent.positionName]}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={onAddNew}
              size="icon"
              className="h-10 w-10 rounded-full bg-[#140a9a] hover:bg-[#1e14b3] text-white"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Agregar nuevo cambio</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[calc(100vh-340px)]">
        <div className="space-y-4 pr-4">
          {Object.values(componentTasks).map((component) => (
            <ComponentChangeoutCard
              key={component.id}
              component={component}
              onEdit={onEdit}
              onDelete={handleRemoveComponentChangeout}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
