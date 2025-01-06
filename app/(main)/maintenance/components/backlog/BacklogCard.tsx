import { BacklogTask } from "@/lib/types";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  MapPin,
  Settings,
  Trash2Icon,
  User,
  WrenchIcon,
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

interface BacklogCardProps {
  backlog: BacklogTask;
  onEdit: (backlog: BacklogTask) => void;
  onDelete: (id: string) => Promise<void>;
}
const getStatus = (endDate: Timestamp | null) => {
  if (!endDate) return "in_progress";
  const now = new Date();
  const end = new Date(endDate.seconds * 1000);
  return end < now ? "completed" : "in_progress";
};

const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleDateString("es-ES", {
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

export const BacklogCard = ({
  backlog,
  onEdit,
  onDelete,
}: BacklogCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const status = getStatus(backlog.endDate);
  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md border-l-4 border-l-[#140a9a] bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-bold text-[#140a9a]">
              OT: {backlog.ot}
            </h4>

            <Badge
              variant="outline"
              className={`${
                status === "in_progress"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-green-100 text-green-800 border-green-300"
              } text-xs font-semibold px-2 py-1 rounded-full`}
            >
              {status === "in_progress" ? "En Proceso" : "Finalizado"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(backlog);
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
                    permanentemente el backlog.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await onDelete(backlog.id);
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
          {backlog.title}
        </h5>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {calculateDuration(backlog.startDate, backlog.endDate)} horas
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(backlog.startDate)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Settings className="h-4 w-4 mr-1" />
            {backlog.systemName}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <WrenchIcon className="h-4 w-4 mr-1" />
            {backlog.subsystemName}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {backlog.positionName}
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
          <CollapsibleContent className="mt-4 space-y-4">
            {backlog.description && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Descripción completa
                </h4>
                <div
                  className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"
                  dangerouslySetInnerHTML={{ __html: backlog.description }}
                />
              </div>
            )}

            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-[#140a9a]" />
                Assignees
              </h4>
              <div className="flex flex-wrap gap-2">
                {backlog.assignees.map(
                  (assignee, index) =>
                    assignee && (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800 border-blue-300"
                      >
                        {assignee}
                      </Badge>
                    ),
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
