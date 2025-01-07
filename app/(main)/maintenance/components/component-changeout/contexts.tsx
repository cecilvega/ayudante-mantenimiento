"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { ComponentChangeoutTask, EquipmentRecord } from "@/lib/types";

import { useComponentTasks } from "@/app/(main)/maintenance/components/component-changeout/services";
import { fetchComponentChangeouts } from "@/lib/services";

export interface SelectedComponent {
  componentName: string;
  positionName: string;
}

interface ComponentContextType {
  selectedComponent: SelectedComponent; // Change this to allow null
  isLoading: boolean;
  setSelectedComponent: React.Dispatch<React.SetStateAction<SelectedComponent>>; // Match useState type

  equipment: EquipmentRecord;
  componentTasks: Record<string, ComponentChangeoutTask>; // CHANGED
  setComponentTasks: React.Dispatch<
    React.SetStateAction<Record<string, ComponentChangeoutTask>>
  >; // CHANGED

  addComponentTask: (task: Partial<ComponentChangeoutTask>) => void;
  handleUpdateChangeout: (
    id: string,
    updates: Partial<ComponentChangeoutTask>,
  ) => Promise<void>;
  handleImageUpload: (
    componentName: string,
    positionName: string,
    componentId: string,
    subComponent: string,
    files: FileList,
  ) => Promise<string[]>;
  handleRemoveComponentChangeout: (id: string) => Promise<void>;
  loadComponentChangeouts: () => Promise<void>;
}

export const ChangeoutContext = createContext<ComponentContextType | undefined>(
  undefined,
);

export const useComponentContext = () => {
  const context = useContext(ChangeoutContext);
  if (!context) {
    throw new Error(
      "useComponentContext must be used within ComponentProvider",
    );
  }
  return context;
};

interface ComponentTasksProviderProps {
  children: React.ReactNode;
  equipment: EquipmentRecord;
}

export function ComponentTasksProvider({
  children,
  equipment,
}: ComponentTasksProviderProps) {
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(
    {
      componentName: "",
      positionName: "",
    },
  );
  const [isLoading, setLoading] = useState(false);

  const {
    componentTasks,
    setComponentTasks,
    addComponentTask,
    handleUpdateChangeout,
    handleImageUpload,
    handleRemoveComponentChangeout,
  } = useComponentTasks(equipment);

  // Memoize loadComponentChangeouts to prevent recreation
  const loadComponentChangeouts = useCallback(async () => {
    setLoading(true);
    try {
      const changeouts = await fetchComponentChangeouts(
        new Date(),
        selectedComponent.componentName,
        selectedComponent.positionName,
        equipment.equipmentName,
      );
      setComponentTasks(changeouts);
    } catch (error) {
      console.error("Error loading component changeouts:", error);
    } finally {
      setLoading(false);
    }
  }, [
    equipment.equipmentName,
    selectedComponent.componentName,
    selectedComponent.positionName,
    setComponentTasks,
  ]);

  return (
    <ChangeoutContext.Provider
      value={{
        equipment,
        selectedComponent,
        setSelectedComponent,
        componentTasks,
        setComponentTasks,
        isLoading,
        addComponentTask,
        loadComponentChangeouts,
        handleUpdateChangeout,
        handleImageUpload,
        handleRemoveComponentChangeout,
      }}
    >
      {children}
    </ChangeoutContext.Provider>
  );
}
