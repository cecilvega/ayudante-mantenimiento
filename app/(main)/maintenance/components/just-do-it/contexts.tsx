"use client";
import React, { createContext, useContext, useCallback, useState } from "react";
import { JustDoItTask, EquipmentRecord } from "@/lib/types";
import { useJustDoItTasks } from "./services";
import { fetchJustDoIts } from "@/lib/services";

interface JustDoItContextType {
  equipment: EquipmentRecord;
  isLoading: boolean;
  justDoItTasks: Record<string, JustDoItTask>;
  setJustDoItTasks: React.Dispatch<
    React.SetStateAction<Record<string, JustDoItTask>>
  >;
  addJustDoItTask: (
    task: Partial<JustDoItTask> & { duration: number },
  ) => JustDoItTask;
  handleUpdateJustDoIt: (
    id: string,
    updates: Partial<JustDoItTask> & { duration?: number },
  ) => Promise<void>;
  handleRemoveJustDoIt: (id: string) => Promise<void>;
  loadJustDoIts: () => Promise<void>;
}

export const JustDoItContext = createContext<JustDoItContextType | undefined>(
  undefined,
);

export const useJustDoItContext = () => {
  const context = useContext(JustDoItContext);
  if (!context) {
    throw new Error("useJustDoItContext must be used within JustDoItProvider");
  }
  return context;
};

interface JustDoItTasksProviderProps {
  children: React.ReactNode;
  equipment: EquipmentRecord;
}

export function JustDoItTasksProvider({
  children,
  equipment,
}: JustDoItTasksProviderProps) {
  const [isLoading, setLoading] = useState(false);

  const {
    justDoItTasks,
    setJustDoItTasks,
    addJustDoItTask,
    handleUpdateJustDoIt,
    handleRemoveJustDoIt,
  } = useJustDoItTasks(equipment);

  // Memoize loadJustDoIts to prevent recreation
  const loadJustDoIts = useCallback(async () => {
    setLoading(true);
    try {
      const tasks = await fetchJustDoIts(equipment.equipmentName);
      setJustDoItTasks(tasks);
    } catch (error) {
      console.error("Error loading just do it tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [equipment.equipmentName, setJustDoItTasks]);

  return (
    <JustDoItContext.Provider
      value={{
        equipment,
        justDoItTasks,
        setJustDoItTasks,
        isLoading,
        addJustDoItTask,
        loadJustDoIts,
        handleUpdateJustDoIt,
        handleRemoveJustDoIt,
      }}
    >
      {children}
    </JustDoItContext.Provider>
  );
}
