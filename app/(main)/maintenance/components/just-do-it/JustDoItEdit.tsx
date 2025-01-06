import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JustDoItTask, EquipmentRecord } from "@/lib/types";
import { useJustDoItContext } from "./contexts";
import { backlogTaxonomy } from "../../constants";

interface JustDoItEditFormProps {
  onBack: () => void;
  task: JustDoItTask;
  equipment: EquipmentRecord;
}

interface FormErrors {
  ot?: string;
  title?: string;
  description?: string;
  system?: string;
  position?: string;
  startDate?: string;
  duration?: string;
}

export function JustDoItEdit({
  onBack,
  task,
  equipment,
}: JustDoItEditFormProps) {
  const { handleUpdateJustDoIt } = useJustDoItContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate initial duration from startDate and endDate
  const initialDuration = () => {
    const start = task.startDate.toDate();
    const end = task.endDate.toDate();
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diffHours.toString();
  };

  const [formData, setFormData] = useState({
    ot: task.ot.toString(),
    title: task.title,
    description: task.description,
    startDate: task.startDate.toDate().toISOString().slice(0, 16),
    duration: initialDuration(),
    system: task.system,
    position: task.position,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.ot || isNaN(Number(formData.ot))) {
      newErrors.ot = "La OT es requerida y debe ser un número";
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
      isValid = false;
    }

    if (!formData.system) {
      newErrors.system = "El sistema es requerido";
      isValid = false;
    }

    if (!formData.position) {
      newErrors.position = "La posición es requerida";
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
      isValid = false;
    }

    if (
      !formData.duration ||
      isNaN(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      newErrors.duration = "La duración debe ser un número positivo";
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
      await handleUpdateJustDoIt(task.id, {
        ot: parseInt(formData.ot),
        title: formData.title.trim(),
        description: formData.description.trim(),
        system: formData.system,
        position: formData.position,
        duration: parseFloat(formData.duration),
        startDate: new Date(formData.startDate),
      });

      onBack();
    } catch (error) {
      console.error("Error updating just do it task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get available positions for selected system
  const availablePositions = formData.system
    ? backlogTaxonomy[formData.system as keyof typeof backlogTaxonomy]
        ?.subsystems?.["general"] || []
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#140a9a]">
            Editar Just Do It
          </CardTitle>
          <CardDescription>
            <span className="block">
              Equipo: {equipment.equipmentName} ({equipment.equipmentModel})
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <div className="space-y-6">
                {/* OT and Title Fields */}
                <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* System and Position Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="system">Sistema</Label>
                    <Select
                      value={formData.system}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          system: value,
                          position: "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sistema" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(backlogTaxonomy).map((system) => (
                          <SelectItem key={system} value={system}>
                            {system.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.system && (
                      <p className="text-sm text-red-500">{errors.system}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Posición</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, position: value }))
                      }
                      disabled={!formData.system}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar posición" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePositions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.position && (
                      <p className="text-sm text-red-500">{errors.position}</p>
                    )}
                  </div>
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
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Start Date and Duration Fields */}
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="duration">Duración (horas)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.1"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className={errors.duration ? "border-red-500" : ""}
                    />
                    {errors.duration && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

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
