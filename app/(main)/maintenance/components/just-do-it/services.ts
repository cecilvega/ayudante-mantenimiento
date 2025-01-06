import { useState } from "react";
import { JustDoItTask, EquipmentRecord } from "@/lib/types";
import { removeJustDoIt, updateJustDoIt } from "@/lib/services";
import { Timestamp } from "firebase/firestore";

export function useJustDoItTasks(equipment: EquipmentRecord) {
  const [justDoItTasks, setJustDoItTasks] = useState<
    Record<string, JustDoItTask>
  >({});

  const addJustDoItTask = (
    task: Partial<JustDoItTask> & { duration: number },
  ) => {
    const startDate = Timestamp.fromDate(
      new Date(task.startDate || new Date()),
    );
    const endDate = Timestamp.fromDate(
      new Date(startDate.toMillis() + task.duration * 60 * 60 * 1000),
    );

    const newTask = {
      ...task,
      id: Date.now().toString(),
      equipmentName: equipment.equipmentName,
      ot: task.ot || 0,
      title: task.title || "",
      description: task.description || "",
      system: task.system || "",
      position: task.position || "",
      startDate,
      endDate,
    } as JustDoItTask;

    setJustDoItTasks((prev) => ({
      ...prev,
      [newTask.id]: newTask,
    }));
    return newTask;
  };

  const handleUpdateJustDoIt = async (
    id: string,
    updates: Partial<JustDoItTask> & { duration?: number },
  ) => {
    if (updates.startDate && updates.duration) {
      const startDate = Timestamp.fromDate(new Date(updates.startDate));
      const endDate = Timestamp.fromDate(
        new Date(startDate.toMillis() + updates.duration * 60 * 60 * 1000),
      );
      delete updates.duration;
      updates.startDate = startDate;
      updates.endDate = endDate;
    }
    await updateJustDoIt(id, updates);
  };

  const handleRemoveJustDoIt = async (id: string) => {
    setJustDoItTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      delete newTasks[id];
      return newTasks;
    });
    await removeJustDoIt(id);
  };

  return {
    justDoItTasks,
    setJustDoItTasks,
    addJustDoItTask,
    handleUpdateJustDoIt,
    handleRemoveJustDoIt,
  };
}
