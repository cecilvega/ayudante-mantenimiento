import { useComponentContext } from "./contexts";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { componentsTaxonomy } from "../../constants";
import Image from "next/image";

export function ComponentSelection({
  onSelect,
}: {
  onBack: () => void;
  onSelect: (componentName: string, positionName: string) => void;
}) {
  const { equipment, selectedComponent, setSelectedComponent } =
    useComponentContext();
  const [localSelectedComponent, setLocalSelectedComponent] = useState<
    string | null
  >(null);

  const handleComponentSelect = (componentName: string) => {
    const newSelected =
      componentName === selectedComponent?.componentName
        ? { componentName: "", positionName: "" } // Empty object instead of null
        : { componentName: componentName, positionName: "" };

    setSelectedComponent(newSelected);
    setLocalSelectedComponent(
      componentName === localSelectedComponent ? null : componentName,
    );
  };

  const handlePositionSelect = (positionName: string) => {
    if (localSelectedComponent) {
      setSelectedComponent({
        componentName: localSelectedComponent,
        positionName: positionName,
      });
      onSelect(localSelectedComponent, positionName);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-lg">
      {equipment && (
        <div className="flex justify-between items-center mb-4 px-4">
          <p className="text-sm text-gray-600">
            Equipo:{" "}
            <span className="font-semibold">{equipment.equipmentName}</span>
          </p>
        </div>
      )}

      <ScrollArea className="h-[60vh] p-4 bg-gray-50">
        <div className="space-y-4 bg-white p-4 rounded-lg">
          {Object.entries(componentsTaxonomy).map(([component, positions]) => {
            const isSelected = component === localSelectedComponent; // Use local state for UI
            return (
              <Collapsible
                key={component}
                open={isSelected}
                onOpenChange={() => handleComponentSelect(component)}
                className="transition-all duration-300 ease-in-out"
              >
                <CollapsibleTrigger asChild>
                  <div className="group cursor-pointer">
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 ${isSelected ? "border-[#140a9a] bg-blue-50" : "border-gray-200"} hover:border-[#140a9a] hover:bg-blue-50 transition-all duration-300`}
                    >
                      <div
                        className={`p-3 rounded-full ${isSelected ? "bg-[#140a9a] text-white" : "bg-gray-100 text-[#140a9a] group-hover:bg-[#140a9a] group-hover:text-white"} transition-colors duration-300`}
                      >
                        <Image
                          src={`/icons/${component}.png?height=92&width=92`}
                          alt={component.replace("_", " ").toUpperCase()}
                          width={92}
                          height={92}
                          className="object-contain p-1"
                        />
                        {/*<IconComponent className="h-6 w-6" />*/}
                      </div>
                      <div className="flex-grow">
                        <h3
                          className={`text-lg font-semibold ${isSelected ? "text-[#140a9a]" : "text-gray-700 group-hover:text-[#140a9a]"}`}
                        >
                          {component.replace("_", " ").toUpperCase()}
                        </h3>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-[#140a9a] transition-transform duration-300 ${isSelected ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-16 mt-4 space-y-3">
                    {positions.map((position) => (
                      <Button
                        key={position}
                        variant="outline"
                        onClick={() => handlePositionSelect(position)}
                        className="w-full justify-start text-left py-3 px-4 text-gray-700 hover:text-[#140a9a] hover:bg-blue-50 border-2 border-gray-200 hover:border-[#140a9a] rounded-lg transition-all duration-300 flex items-center gap-3"
                      >
                        <Check className="h-5 w-5 text-[#140a9a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="font-medium">
                          {position.toUpperCase()}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
