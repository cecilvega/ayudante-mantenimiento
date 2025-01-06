import { BacklogTask, EquipmentRecord, JustDoItTask } from "@/lib/types";
import React, { useState } from "react";
import { DrawerView } from "@/app/(main)/maintenance/types";
import { SelectedComponent } from "@/app/(main)/maintenance/components/component-changeout/contexts";
import { ComponentSelection } from "@/app/(main)/maintenance/components/component-changeout/ComponentSelection";
import { ComponentChangeoutList } from "@/app/(main)/maintenance/components/component-changeout/ComponentChangeoutList";
import { ComponentChangeoutEdit } from "@/app/(main)/maintenance/components/component-changeout/ComponentChangeoutEdit";
import { ComponentChangeoutForm } from "@/app/(main)/maintenance/components/component-changeout/ComponentChangeoutForm";
import { BacklogList } from "@/app/(main)/maintenance/components/backlog/BacklogList";
import { JustDoItList } from "@/app/(main)/maintenance/components/just-do-it/JustDoItList";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { EquipmentDetail } from "@/app/(main)/maintenance/components/equipment/EquipmentDetail";
// import { updateComponentChangeout } from "@/lib/services";
import { ComponentTasksProvider } from "@/app/(main)/maintenance/components/component-changeout/contexts";
import { ComponentChangeoutTask } from "@/lib/types";
import { BacklogTasksProvider } from "@/app/(main)/maintenance/components/backlog/contexts";
import { BacklogEdit } from "@/app/(main)/maintenance/components/backlog/BacklogEdit";
import { BacklogForm } from "@/app/(main)/maintenance/components/backlog/BacklogForm";
import { JustDoItTasksProvider } from "@/app/(main)/maintenance/components/just-do-it/contexts";
import { JustDoItEdit } from "@/app/(main)/maintenance/components/just-do-it/JustDoItEdit";
import { JustDoItForm } from "@/app/(main)/maintenance/components/just-do-it/JustDoItForm";
import { DRAWER_VIEW_TITLES } from "@/app/(main)/maintenance/constants";

export function MaintenanceDrawer({
  isOpen,
  onClose,
  equipment,
}: {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentRecord;
}) {
  const [currentView, setCurrentView] = useState<DrawerView>("detail");
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(
    {
      componentName: "",
      positionName: "",
    },
  );

  const [editingComponent, setEditingComponent] =
    useState<ComponentChangeoutTask | null>(null);
  const [editingBacklog, setEditingBacklog] = useState<BacklogTask | null>(
    null,
  );
  const [editingJustDoIt, setEditingJustDoIt] = useState<JustDoItTask | null>(
    null,
  );

  const [viewStack, setViewStack] = useState<DrawerView[]>(["detail"]);

  // Add these navigation functions
  const navigateTo = (view: DrawerView) => {
    console.log("Navigating to:", view);
    console.log("Previous stack:", viewStack);
    setViewStack((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    console.log("Going back. Current stack:", viewStack);
    if (viewStack.length > 1) {
      // Special handling for changeout form -> list navigation
      if (currentView === "component-changeout-form") {
        setCurrentView("component-changeout-list");
        setViewStack((prev) => [...prev.slice(0, -1)]);
      } else {
        const newStack = viewStack.slice(0, -1);
        console.log("New stack will be:", newStack);
        setViewStack(newStack);
        setCurrentView(newStack[newStack.length - 1]);
      }
    }
  };

  const getTitle = () => {
    if (currentView === "detail") {
      return `Información del Equipo: ${equipment.equipmentName}`;
    }
    return DRAWER_VIEW_TITLES[currentView];
  };

  const renderView = () => {
    switch (currentView) {
      case "detail":
        return (
          <EquipmentDetail
            equipment={equipment}
            onComponentClick={() => navigateTo("component-selection")}
            onBacklogClick={() => navigateTo("backlog-list")}
            onJustDoItClick={() => navigateTo("just-do-it-list")}
          />
        );

      case "component-selection":
      case "component-changeout-list":
      case "component-changeout-form":
      case "component-changeout-edit":
        return (
          <ComponentTasksProvider equipment={equipment}>
            {currentView === "component-selection" ? (
              <ComponentSelection
                onBack={goBack}
                onSelect={(componentName, positionName) => {
                  setSelectedComponent({ componentName, positionName });
                  navigateTo("component-changeout-list");
                }}
              />
            ) : currentView === "component-changeout-list" ? (
              <ComponentChangeoutList
                onAddNew={() => navigateTo("component-changeout-form")}
                onEdit={(component) => {
                  setEditingComponent(component);
                  navigateTo("component-changeout-edit");
                }}
              />
            ) : currentView === "component-changeout-edit" &&
              editingComponent ? (
              <ComponentChangeoutEdit
                component={editingComponent}
                equipment={equipment}
                onBack={goBack}
              />
            ) : (
              <ComponentChangeoutForm
                onBack={goBack}
                selectedComponent={
                  selectedComponent || { componentName: "", positionName: "" }
                }
                equipment={equipment}
              />
            )}
          </ComponentTasksProvider>
        );
      case "backlog-list":
      case "backlog-form":
      case "backlog-edit":
        return (
          <BacklogTasksProvider equipment={equipment}>
            {currentView === "backlog-list" ? (
              <BacklogList
                onAddNew={() => navigateTo("backlog-form")}
                onEdit={(backlog) => {
                  setEditingBacklog(backlog);
                  navigateTo("backlog-edit");
                }}
              />
            ) : currentView === "backlog-edit" && editingBacklog ? (
              <BacklogEdit
                backlog={editingBacklog}
                equipment={equipment}
                onBack={goBack}
              />
            ) : (
              <BacklogForm onBack={goBack} equipment={equipment} />
            )}
          </BacklogTasksProvider>
        );

      case "just-do-it-list":
      case "just-do-it-form":
      case "just-do-it-edit":
        return (
          <JustDoItTasksProvider equipment={equipment}>
            {currentView === "just-do-it-list" ? (
              <JustDoItList
                onAddNew={() => navigateTo("just-do-it-form")}
                onEdit={(task) => {
                  setEditingJustDoIt(task);
                  navigateTo("just-do-it-edit");
                }}
              />
            ) : currentView === "just-do-it-edit" && editingJustDoIt ? (
              <JustDoItEdit
                task={editingJustDoIt}
                equipment={equipment}
                onBack={goBack}
              />
            ) : (
              <JustDoItForm onBack={goBack} equipment={equipment} />
            )}
          </JustDoItTasksProvider>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset views when drawer is closed
          setViewStack(["detail"]);
          setCurrentView("detail");
        }
        onClose(); // This is the prop passed from the parent component
      }}
    >
      <DrawerContent className="h-[90vh] sm:h-[85vh] flex flex-col">
        <DrawerHeader className="bg-gradient-to-r from-[#140a9a] to-[#1e14b3] text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {currentView !== "detail" && (
              <Button
                variant="ghost"
                className="text-white hover:text-gray-200 p-1 -ml-2"
                onClick={goBack}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            )}
            <DrawerTitle className="text-2xl font-bold text-center flex-grow">
              {currentView === "detail"
                ? `Información del Equipo: ${equipment.equipmentName}`
                : getTitle()}
            </DrawerTitle>
            <Button
              variant="ghost"
              className="text-white hover:text-gray-200 p-1"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-grow p-4 flex flex-col justify-start overflow-y-auto bg-gray-50">
          {renderView()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MaintenanceDrawer;
