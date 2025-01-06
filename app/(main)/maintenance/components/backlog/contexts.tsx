"use client";
import React, { createContext, useContext, useCallback, useState } from "react";
import { BacklogTask, EquipmentRecord } from "@/lib/types";
import { useBacklogTasks } from "./services";
import { fetchBacklogs } from "@/lib/services";

interface BacklogContextType {
  equipment: EquipmentRecord;
  isLoading: boolean;
  backlogTasks: Record<string, BacklogTask>;
  setBacklogTasks: React.Dispatch<
    React.SetStateAction<Record<string, BacklogTask>>
  >;
  addBacklogTask: (task: Partial<BacklogTask>) => BacklogTask;
  handleUpdateBacklog: (
    id: string,
    updates: Partial<BacklogTask>,
  ) => Promise<void>;
  handleRemoveBacklog: (id: string) => Promise<void>;
  loadBacklogs: () => Promise<void>;
}

export const BacklogContext = createContext<BacklogContextType | undefined>(
  undefined,
);

export const useBacklogContext = () => {
  const context = useContext(BacklogContext);
  if (!context) {
    throw new Error("useBacklogContext must be used within BacklogProvider");
  }
  return context;
};

interface BacklogTasksProviderProps {
  children: React.ReactNode;
  equipment: EquipmentRecord;
}

export function BacklogTasksProvider({
  children,
  equipment,
}: BacklogTasksProviderProps) {
  const [isLoading, setLoading] = useState(false);

  const {
    backlogTasks,
    setBacklogTasks,
    addBacklogTask,
    handleUpdateBacklog,
    handleRemoveBacklog,
  } = useBacklogTasks(equipment);

  // Memoize loadBacklogs to prevent recreation
  const loadBacklogs = useCallback(async () => {
    setLoading(true);
    try {
      const backlogs = await fetchBacklogs(new Date(), equipment.equipmentName);
      setBacklogTasks(backlogs);
    } catch (error) {
      console.error("Error loading backlogs:", error);
    } finally {
      setLoading(false);
    }
  }, [equipment.equipmentName, setBacklogTasks]);

  return (
    <BacklogContext.Provider
      value={{
        equipment,
        backlogTasks,
        setBacklogTasks,
        isLoading,
        addBacklogTask,
        loadBacklogs,
        handleUpdateBacklog,
        handleRemoveBacklog,
      }}
    >
      {children}
    </BacklogContext.Provider>
  );
}
