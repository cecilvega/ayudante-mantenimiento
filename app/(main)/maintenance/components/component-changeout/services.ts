import { useState } from "react";
import { ComponentChangeoutTask } from "@/lib/types";
import {
  removeComponentChangeout,
  updateComponentChangeout,
} from "@/lib/services";
import { EquipmentRecord } from "@/lib/types";
import { uploadComponentImages } from "@/lib/services/component_changeouts";

export function useComponentTasks(equipment: EquipmentRecord) {
  const [componentTasks, setComponentTasks] = useState<
    Record<string, ComponentChangeoutTask>
  >({});

  const addComponentTask = (task: Partial<ComponentChangeoutTask>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      equipmentName: equipment.equipmentName,

      assignees: task.assignees || [],
      startDate: task.startDate || new Date(),
      endDate: task.endDate || new Date(),
      ot: task.ot || 0,
      description: task.description || "",
    } as ComponentChangeoutTask;

    setComponentTasks((prev) => ({
      ...prev,
      [newTask.id]: newTask,
    }));
    return newTask;
  };

  const handleUpdateChangeout = async (
    id: string,
    updates: Partial<ComponentChangeoutTask>,
  ) => {
    await updateComponentChangeout(id, updates);
  };

  const handleRemoveComponentChangeout = async (id: string) => {
    setComponentTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      delete newTasks[id];
      return newTasks;
    });
    await removeComponentChangeout(id);
  };

  const handleImageUpload = async (
    componentName: string,
    positionName: string,
    componentId: string,
    subComponent: string,
    files: FileList,
  ) => {
    return uploadComponentImages(
      componentName,
      positionName,
      componentId,
      subComponent,
      files,
    );
  };

  return {
    componentTasks,
    setComponentTasks,
    addComponentTask,
    handleUpdateChangeout,
    handleImageUpload,
    handleRemoveComponentChangeout,
  };
}
