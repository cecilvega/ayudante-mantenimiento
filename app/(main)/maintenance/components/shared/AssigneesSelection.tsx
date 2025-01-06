import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

interface AssigneesSelectionProps {
  assignees: string[];
  onAddAssignee: () => void;
  onRemoveAssignee: (index: number) => void;
  onAssigneeChange: (index: number, value: string) => void;
  error?: string;
  label?: string;
}

export function AssigneesSelection({
  assignees,
  onAddAssignee,
  onRemoveAssignee,
  onAssigneeChange,
  error,
  label = "Asignados",
}: AssigneesSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddAssignee}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Asignado
        </Button>
      </div>

      {assignees.map((assignee, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={assignee}
            onChange={(e) => onAssigneeChange(index, e.target.value)}
            placeholder="Nombre del asignado"
            className={error ? "border-red-500" : ""}
          />
          {assignees.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveAssignee(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
