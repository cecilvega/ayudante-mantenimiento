"use client";
import Image from "next/image";
import { ComponentChangeoutTask } from "@/lib/types";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Tag,
  User,
  ImageIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import { subComponentsTaxonomy } from "../../constants";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
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

interface ComponentCardProps {
  component: ComponentChangeoutTask;
  onEdit: (component: ComponentChangeoutTask) => void;
  onDelete: (id: string) => Promise<void>;
}

const calculateDuration = (startDate: Timestamp, endDate: Timestamp) => {
  const start = startDate.toDate();
  const end = endDate.toDate();
  const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return diffInHours.toFixed(1);
};

const formatDate = (timestamp: Timestamp) => {
  if (!timestamp) return "";
  const date =
    timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatus = (endDate: Timestamp | null) => {
  if (!endDate) return "in_progress";
  const now = new Date();
  const end = new Date(endDate.seconds * 1000);
  return end < now ? "completed" : "in_progress";
};

export const ComponentChangeoutCard = ({
  component,
  onEdit,
  onDelete,
}: ComponentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const status = getStatus(component.endDate);
  const isOnline = useOnlineStatus();

  return (
    <div>
      <Card className="mb-4 overflow-hidden transition-all hover:shadow-md border-l-4 border-l-[#140a9a] bg-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold text-[#140a9a]">
                OT: {component.ot}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(component);
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
                      permanentemente el cambio de componente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await onDelete(component.id);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {calculateDuration(
                component.startDate,
                component.endDate || new Date(),
              )}{" "}
              horas
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(component.startDate)}
            </div>
          </div>

          {component.description && (
            <div className="mb-3">
              <h5 className="text-sm font-semibold text-gray-700 mb-1">
                Descripción:
              </h5>
              <p
                className="text-sm text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: component.description.slice(0, 100) + "...",
                }}
              />
            </div>
          )}

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between bg-white hover:bg-gray-100 text-[#140a9a] mt-2"
                onClick={() => setIsOpen(!isOpen)}
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
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#140a9a]" />
                  Series Componentes Removidos
                </h4>
                <div className="space-y-3">
                  {subComponentsTaxonomy[
                    component.componentName as keyof typeof subComponentsTaxonomy
                  ]?.map((subComponent) => {
                    const removedComponent =
                      component.removedComponents[subComponent];
                    return (
                      <div
                        key={subComponent}
                        className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="font-medium text-[#140a9a]">
                              {subComponent.replace(/_/g, " ").toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              Serie: {removedComponent?.serialNumber || "N/A"}
                            </span>
                          </div>
                          {isOnline &&
                            removedComponent?.images &&
                            removedComponent.images.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {removedComponent.images.map((url, idx) => (
                                  <div
                                    key={idx}
                                    className="relative aspect-square group"
                                  >
                                    <Image
                                      src={url}
                                      alt={`${subComponent} ${idx + 1}`}
                                      className="w-full h-full object-cover rounded-md cursor-pointer border border-gray-300 transition-all duration-300 group-hover:opacity-75"
                                      onClick={() => window.open(url, "_blank")}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <ImageIcon className="w-5 h-5 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#140a9a]" />
                  Assignees
                </h4>
                <div className="flex flex-wrap gap-2">
                  {component.assignees.map((assignee, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 border-blue-300"
                    >
                      {assignee}
                    </Badge>
                  ))}
                </div>
              </div>

              {component.description && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-2">
                    Descripción completa
                  </h4>
                  <div
                    className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"
                    dangerouslySetInnerHTML={{ __html: component.description }}
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};
