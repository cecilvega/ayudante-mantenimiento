"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ChevronRight, Plus, Trash2 } from "lucide-react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { EquipmentRecord } from "@/lib/types";
import { SelectedComponent } from "./contexts";
import { subComponentsTaxonomy } from "@/app/(main)/maintenance/constants";

interface ComponentFormProps {
  onBack: () => void;
  selectedComponent: SelectedComponent | null;
  equipment: EquipmentRecord;
}

interface FormErrors {
  ot?: string;
  equipoSAP?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  assignees?: string;
}

export function ComponentChangeoutForm({
  onBack,
  selectedComponent,
  equipment,
}: ComponentFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [formData, setFormData] = React.useState({
    ot: "",
    description: "",
    startDate: "",
    endDate: "",
    assignees: [""], // Start with one empty assignee
    removedComponents: {} as Record<string, { serialNumber: string }>,
  });

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.ot || isNaN(Number(formData.ot))) {
      newErrors.ot = "La OT es requerida y debe ser un número";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de término es requerida";
      isValid = false;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate =
        "La fecha de término debe ser posterior a la de inicio";
      isValid = false;
    }

    if (!formData.assignees.some((assignee) => assignee.trim())) {
      newErrors.assignees = "Debe haber al menos un asignado";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const componentTask = {
        equipmentName: equipment.equipmentName,
        componentName: selectedComponent?.componentName ?? "",
        positionName: selectedComponent?.positionName ?? "",
        ot: parseInt(formData.ot),
        description: formData.description,
        assignees: formData.assignees.filter((a) => a.trim()),
        startDate: Timestamp.fromDate(new Date(formData.startDate)), // Convert to Timestamp
        endDate: Timestamp.fromDate(new Date(formData.endDate)), // Convert to Timestamp
        removedComponents: formData.removedComponents,
      };

      await addDoc(collection(db, "component_changeouts"), componentTask);
      onBack(); // Return to list view after successful submission
    } catch (error) {
      console.error("Error adding component task:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Error al guardar el cambio de componente",
      }));
    } finally {
      setLoading(false);
    }
  };

  const addAssignee = () => {
    setFormData((prev) => ({
      ...prev,
      assignees: [...prev.assignees, ""],
    }));
  };

  const removeAssignee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="text-[#140a9a] hover:bg-gray-100 p-1"
          onClick={onBack}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          <span className="ml-2">Atrás</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#140a9a]">
            Nuevo Cambio de Componente
          </CardTitle>
          <CardDescription className="space-y-1">
            <span>
              Equipo: {equipment.equipmentName} ({equipment.equipmentModel})
              Componente: {selectedComponent?.componentName} -{" "}
              {selectedComponent?.positionName}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <div className="space-y-6">
                {/* OT Field */}
                <div className="space-y-2">
                  <Label htmlFor="ot">Orden de Trabajo (OT)</Label>
                  <Input
                    id="ot"
                    type="number"
                    value={formData.ot}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ot: e.target.value }))
                    }
                    className={errors.ot ? "border-red-500" : ""}
                  />
                  {errors.ot && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.ot}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Dates Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Término</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Assignees Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Asignados</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAssignee}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Asignado
                    </Button>
                  </div>

                  {formData.assignees.map((assignee, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={assignee}
                        onChange={(e) => {
                          const newAssignees = [...formData.assignees];
                          newAssignees[index] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            assignees: newAssignees,
                          }));
                        }}
                        placeholder="Nombre del asignado"
                        className={errors.assignees ? "border-red-500" : ""}
                      />
                      {formData.assignees.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAssignee(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.assignees && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.assignees}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Removed Components Section */}
            <div className="space-y-4">
              <Label>Series de Componentes Removidos</Label>
              <div className="grid grid-cols-1 gap-4">
                {subComponentsTaxonomy[
                  selectedComponent?.componentName as keyof typeof subComponentsTaxonomy
                ]?.map((subComponent) => (
                  <div key={subComponent} className="space-y-2">
                    <Label htmlFor={subComponent}>
                      {subComponent.replace(/_/g, " ").toUpperCase()}
                    </Label>
                    <Input
                      id={subComponent}
                      value={
                        formData.removedComponents[subComponent]
                          ?.serialNumber || ""
                      }
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          removedComponents: {
                            ...prev.removedComponents,
                            [subComponent]: {
                              serialNumber: e.target.value,
                            },
                          },
                        }));
                      }}
                      placeholder="Número de serie"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                className="w-full bg-[#140a9a] hover:bg-[#1e14b3]"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambio de Componente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
