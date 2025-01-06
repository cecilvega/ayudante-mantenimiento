import { JustDoItTask } from "@/lib/types";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Settings,
  MapPin,
  Trash2Icon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Timestamp } from "firebase/firestore";

interface JustDoItCardProps {
  task: JustDoItTask;
  onEdit: (task: JustDoItTask) => void;
  onDelete: (id: string) => Promise<void>;
}

const formatDate = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (startDate: Timestamp, endDate: Timestamp) => {
  const start = startDate.toDate();
  const end = endDate.toDate();
  const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return diffInHours.toFixed(1);
};

export const JustDoItCard = ({ task, onEdit, onDelete }: JustDoItCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md border-l-4 border-l-[#140a9a] bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-bold text-[#140a9a]">OT: {task.ot}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2Icon className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará
                    permanentemente la tarea.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await onDelete(task.id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <h5 className="text-lg font-semibold text-gray-900 mb-2">
          {task.title}
        </h5>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 mr-1" />
            {calculateDuration(task.startDate, task.endDate)} horas
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(task.startDate)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Settings className="h-4 w-4 mr-1" />
            {task.system}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {task.position}
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between bg-white hover:bg-gray-100 text-[#140a9a] mt-2"
            >
              {isOpen ? "Menos detalles" : "Más detalles"}
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {task.description && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Descripción completa
                </h4>
                <div
                  className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
