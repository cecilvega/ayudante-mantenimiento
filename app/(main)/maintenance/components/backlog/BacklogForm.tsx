import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { EquipmentRecord } from "@/lib/types";
import { backlogTaxonomy } from "../../constants";
import { validateBacklogForm, type FormErrors } from "./validators";
import { AssigneesSelection } from "../shared/AssigneesSelection";

interface BacklogFormProps {
  onBack: () => void;
  equipment: EquipmentRecord;
}

export function BacklogForm({ onBack, equipment }: BacklogFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    ot: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignees: [""],
    systemName: "",
    subsystemName: "",
    positionName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateBacklogForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const backlogTask = {
        equipmentName: equipment.equipmentName,
        ot: parseInt(formData.ot),
        title: formData.title.trim(),
        description: formData.description.trim(),
        systemName: formData.systemName,
        subsystemName: formData.subsystemName,
        positionName: formData.positionName,
        assignees: formData.assignees.filter((a) => a.trim()),
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: Timestamp.fromDate(new Date(formData.endDate)),
      };

      await addDoc(collection(db, "backlogs"), backlogTask);
      onBack();
    } catch (error) {
      console.error("Error adding backlog task:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Error al guardar el backlog",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Get available subsystems for selected system
  const availableSubsystems = formData.systemName
    ? Object.keys(
        backlogTaxonomy[formData.systemName as keyof typeof backlogTaxonomy]
          .subsystems,
      )
    : [];

  // Get available positions for selected system and subsystem
  const availablePositions =
    formData.systemName && formData.subsystemName
      ? backlogTaxonomy[formData.systemName as keyof typeof backlogTaxonomy]
          .subsystems[
          formData.subsystemName as keyof (typeof backlogTaxonomy)[keyof typeof backlogTaxonomy]["subsystems"]
        ]
      : [];

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
            Nuevo Backlog
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
                      maxLength={9}
                    />
                    {errors.ot && (
                      <p className="text-sm text-red-500">{errors.ot}</p>
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
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                </div>

                {/* System, Subsystem, Position Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">Sistema</Label>
                    <Select
                      value={formData.systemName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          systemName: value,
                          subsystemName: "",
                          positionName: "",
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
                    {errors.systemName && (
                      <p className="text-sm text-red-500">
                        {errors.systemName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subsystemName">Subsistema</Label>
                    <Select
                      value={formData.subsystemName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          subsystemName: value,
                          positionName: "",
                        }))
                      }
                      disabled={!formData.systemName}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar subsistema" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubsystems.map((subsystem) => (
                          <SelectItem key={subsystem} value={subsystem}>
                            {subsystem.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subsystemName && (
                      <p className="text-sm text-red-500">
                        {errors.subsystemName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="positionName">Posición</Label>
                    <Select
                      value={formData.positionName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          positionName: value,
                        }))
                      }
                      disabled={!formData.subsystemName}
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
                    {errors.positionName && (
                      <p className="text-sm text-red-500">
                        {errors.positionName}
                      </p>
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
                    <p className="text-sm text-red-500">{errors.description}</p>
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
                      <p className="text-sm text-red-500">{errors.startDate}</p>
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
                      <p className="text-sm text-red-500">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Assignees Section */}
                <AssigneesSelection
                  assignees={formData.assignees}
                  onAddAssignee={() =>
                    setFormData((prev) => ({
                      ...prev,
                      assignees: [...prev.assignees, ""],
                    }))
                  }
                  onRemoveAssignee={(index) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignees: prev.assignees.filter((_, i) => i !== index),
                    }))
                  }
                  onAssigneeChange={(index, value) => {
                    const newAssignees = [...formData.assignees];
                    newAssignees[index] = value;
                    setFormData((prev) => ({
                      ...prev,
                      assignees: newAssignees,
                    }));
                  }}
                  error={errors.assignees}
                />
              </div>
            </ScrollArea>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                className="w-full bg-[#140a9a] hover:bg-[#1e14b3]"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Crear Backlog"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
