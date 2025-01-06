import React, { useState } from "react";
import { AlertCircle, Plus, Trash2, X } from "lucide-react";

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
import { ComponentChangeoutTask, EquipmentRecord } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { useComponentContext } from "./contexts";
import { subComponentsTaxonomy } from "@/app/(main)/maintenance/constants";

interface ChangeoutEditFormProps {
  onBack: () => void;
  component: ComponentChangeoutTask;
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

export function ComponentChangeoutEdit({
  onBack,
  component,
  equipment,
}: ChangeoutEditFormProps) {
  const { handleUpdateChangeout, handleImageUpload } = useComponentContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<{
    ot: string;
    description: string;
    startDate: string;
    endDate: string;
    assignees: string[];
    removedComponents: Record<
      string,
      {
        serialNumber: string;
        images: string[];
      }
    >;
  }>({
    ot: component.ot.toString(),
    description: component.description,
    startDate: component.startDate.toDate().toISOString().slice(0, 16),
    endDate: component.endDate.toDate().toISOString().slice(0, 16),
    assignees: component.assignees,
    removedComponents: Object.entries(component.removedComponents || {}).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          serialNumber: value.serialNumber || "",
          images: value.images || [],
        },
      }),
      {},
    ),
  });
  const subComponents =
    subComponentsTaxonomy[
      component.componentName as keyof typeof subComponentsTaxonomy
    ] || [];

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

    // Replace the direct Firestore update with the context handler
    await handleUpdateChangeout(component.id, {
      ot: parseInt(formData.ot),
      description: formData.description,
      startDate: Timestamp.fromDate(new Date(formData.startDate)),
      endDate: Timestamp.fromDate(new Date(formData.endDate)),
      assignees: formData.assignees.filter((a) => a.trim()),
      removedComponents: formData.removedComponents,
    });

    setLoading(false);
    onBack();
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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#140a9a]">
            Editar Cambio de Componente
          </CardTitle>
          <CardDescription>
            <span className="block">
              Equipo: {equipment.equipmentName} ({equipment.equipmentModel})
            </span>
            <span className="block">
              Componente: {component.componentName} - {component.positionName}
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
                {subComponents.map((subComponent) => (
                  <div
                    key={subComponent}
                    className="space-y-4 border p-4 rounded-lg"
                  >
                    <div className="space-y-2">
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
                                ...prev.removedComponents[subComponent],
                                serialNumber: e.target.value,
                              },
                            },
                          }));
                        }}
                        placeholder="Número de serie"
                      />
                    </div>

                    {/* Image upload section */}
                    <div className="space-y-2">
                      <Label>Imágenes</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          className="cursor-pointer"
                          disabled={!navigator.onLine}
                          onChange={async (e) => {
                            if (e.target.files?.length) {
                              try {
                                const urls = await handleImageUpload(
                                  component.componentName,
                                  component.positionName,
                                  component.id,
                                  subComponent,
                                  e.target.files,
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  removedComponents: {
                                    ...prev.removedComponents,
                                    [subComponent]: {
                                      serialNumber:
                                        prev.removedComponents[subComponent]
                                          ?.serialNumber || "",
                                      images: [
                                        ...(prev.removedComponents[subComponent]
                                          ?.images || []),
                                        ...urls,
                                      ],
                                    },
                                  },
                                }));
                              } catch (error) {
                                alert(
                                  error instanceof Error
                                    ? error.message
                                    : "Error uploading images",
                                );
                              }
                            }
                          }}
                        />
                      </div>

                      {/* Image preview grid */}
                      {formData.removedComponents[subComponent]?.images
                        ?.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {formData.removedComponents[
                            subComponent
                          ]?.images?.map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`${subComponent} ${idx + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    removedComponents: {
                                      ...prev.removedComponents,
                                      [subComponent]: {
                                        ...prev.removedComponents[subComponent],
                                        images: prev.removedComponents[
                                          subComponent
                                        ]?.images?.filter((_, i) => i !== idx),
                                      },
                                    },
                                  }));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
