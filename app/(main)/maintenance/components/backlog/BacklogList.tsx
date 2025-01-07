// app/(main)/maintenance/components/backlog/BacklogList.tsx
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBacklogContext } from "./contexts";
import { PenToolIcon, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BacklogTask } from "@/lib/types";
import { BacklogCard } from "./BacklogCard";
import { Card, CardHeader } from "@/components/ui/card";

export function BacklogList({
  onAddNew,
  onEdit,
}: {
  onAddNew: () => void;
  onEdit: (backlog: BacklogTask) => void;
}) {
  const {
    equipment,
    handleRemoveBacklog,
    loadBacklogs,
    isLoading,
    backlogTasks,
  } = useBacklogContext();

  useEffect(() => {
    console.log("Loading backlogs for equipment:", equipment.equipmentName);
    loadBacklogs();
  }, [loadBacklogs, equipment.equipmentName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#140a9a] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando backlog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-6 overflow-hidden transition-all hover:shadow-lg border-t-4 border-t-[#140a9a] bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full shadow-md">
                <PenToolIcon className="h-8 w-8 text-[#140a9a]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Lista de Backlog
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex items-center">
                    <PenToolIcon className="h-4 w-4 mr-1" />
                    {equipment.equipmentName}
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
              <span className="sr-only">Agregar nuevo backlog</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[calc(100vh-340px)]">
        <div className="space-y-4 pr-4">
          {Object.values(backlogTasks).map((backlog) => (
            <BacklogCard
              key={backlog.id}
              backlog={backlog}
              onEdit={onEdit}
              onDelete={handleRemoveBacklog}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
