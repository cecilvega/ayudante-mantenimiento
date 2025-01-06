import { useState } from "react";
import { BacklogTask, EquipmentRecord } from "@/lib/types";
import { removeBacklog, updateBacklog } from "@/lib/services";

export function useBacklogTasks(equipment: EquipmentRecord) {
  const [backlogTasks, setBacklogTasks] = useState<Record<string, BacklogTask>>(
    {},
  );

  const addBacklogTask = (task: Partial<BacklogTask>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      equipmentName: equipment.equipmentName,
      title: task.title || "",
      description: task.description || "",
      systemName: task.systemName || "",
      subsystemName: task.subsystemName || "",
      positionName: task.positionName || "",
      assignees: task.assignees || [],
      ot: task.ot || 0,
      startDate: task.startDate,
      endDate: task.endDate,
    } as BacklogTask;

    setBacklogTasks((prev) => ({
      ...prev,
      [newTask.id]: newTask,
    }));
    return newTask;
  };

  const handleUpdateBacklog = async (
    id: string,
    updates: Partial<BacklogTask>,
  ) => {
    await updateBacklog(id, updates);
  };

  const handleRemoveBacklog = async (id: string) => {
    setBacklogTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      delete newTasks[id];
      return newTasks;
    });
    await removeBacklog(id);
  };

  return {
    backlogTasks,
    setBacklogTasks,
    addBacklogTask,
    handleUpdateBacklog,
    handleRemoveBacklog,
  };
}
