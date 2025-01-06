"use client";

import React, { useState, useMemo } from "react";
import { UserIcon, Search, ArrowLeft, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAttendanceContext } from "../contexts";
import { PersonaRecord, AddAttendanceParams } from "@/lib/types";

export default function AddPersonDialog() {
  const {
    addPersonDialogOpen,
    setAddPersonDialogOpen,
    isDayMode,
    personas,
    handleAddAttendance,
    selectedDate,
    hasAttendance,
  } = useAttendanceContext();
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [manualMode, setManualMode] = useState<"estuvo" | "noEstuvo" | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<PersonaRecord | null>(
    null,
  );

  const categorias = useMemo(
    () => [
      ...new Set(
        Object.values(personas)
          .map((p) => p.categoria)
          .filter((c) => c !== "NA"),
      ),
    ],
    [personas],
  );
  const subcategorias = useMemo(
    () =>
      selectedCategoria === "MN"
        ? []
        : [
            ...new Set(
              Object.values(personas)
                .filter(
                  (p) =>
                    p.categoria === selectedCategoria &&
                    p.subcategoria !== "NA",
                )
                .map((p) => p.subcategoria),
            ),
          ],
    [selectedCategoria, personas],
  );

  const filteredPersonas = useMemo(() => {
    const baseFilter = Object.values(personas)
      .filter((p) => p.predefinido)
      .filter((p) => !hasAttendance(p.nombre)); // Add this line

    if (selectedCategoria === "MN") {
      return baseFilter.filter((p) => p.categoria === "MN");
    } else if (selectedCategoria === "M" || selectedCategoria === "N") {
      return baseFilter.filter(
        (p) =>
          p.categoria === selectedCategoria &&
          (p.subcategoria === selectedSubcategoria ||
            p.subcategoria === "NA" ||
            (selectedSubcategoria === "" &&
              (p.subcategoria === "M1" ||
                p.subcategoria === "M2" ||
                p.subcategoria === "NA"))),
      );
    }
    return [];
  }, [selectedCategoria, selectedSubcategoria, personas, hasAttendance]);

  const searchResults = useMemo(() => {
    return Object.values(personas).filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        p.id !== selectedPersona?.id &&
        !hasAttendance(p.nombre), // Add this line
    );
  }, [personas, searchTerm, selectedPersona?.id, hasAttendance]);

  const availableCategories = useMemo(() => {
    // Get all people not yet added today
    const availablePeople = Object.values(personas)
      .filter((p) => p.predefinido)
      .filter((p) => !hasAttendance(p.nombre));

    // Get unique categories that have at least one available person
    const categories = [
      ...new Set(
        availablePeople.map((p) => p.categoria).filter((c) => c !== "NA"),
      ),
    ];

    return categories;
  }, [personas, hasAttendance]);

  const handleSubmit = async () => {
    const attendancesToAdd: AddAttendanceParams[] = [];

    if (manualMode === "estuvo" && selectedPersona) {
      attendancesToAdd.push({
        nombre: selectedPersona.nombre,
        rut: selectedPersona.rut,
        categoria: selectedPersona.categoria,
        subcategoria: selectedPersona.subcategoria,
        estado: "Presente",
        turno: isDayMode ? "Día" : "Noche",
        date: selectedDate,
        habitacion: selectedPersona.habitacion || -1,
        cama: selectedPersona.cama || "NA",
      });
    } else if (manualMode === "noEstuvo") {
      attendancesToAdd.push({
        nombre,
        rut: "", // Empty RUT for manual non-attendance
        categoria: selectedCategoria,
        subcategoria: selectedSubcategoria || "NA",
        estado: "Falla",
        turno: isDayMode ? "Día" : "Noche",
        date: selectedDate,
        habitacion: -1,
        cama: "NA",
      });
    } else {
      // Handle predefined mode - add all filtered personas
      filteredPersonas.forEach((persona) => {
        attendancesToAdd.push({
          nombre: persona.nombre,
          rut: persona.rut,
          categoria: persona.categoria,
          subcategoria: persona.subcategoria,
          estado: "Presente",
          turno: isDayMode ? "Día" : "Noche",
          date: selectedDate,
          habitacion: persona.habitacion || -1,
          cama: persona.cama || "NA",
        });
      });
    }

    // Close dialog immediately for better UX
    setAddPersonDialogOpen(false);

    // Add attendance records in background
    await handleAddAttendance(attendancesToAdd);
  };

  const resetManualMode = () => {
    setManualMode(null);
    setSearchTerm("");
    setSelectedPersona(null);
    setNombre("");
    setSelectedCategoria("");
    setSelectedSubcategoria("");
  };

  const resetDialog = () => {
    setSelectedCategoria("");
    setSelectedSubcategoria("");
    setNombre("");
    setSearchTerm("");
    setSelectedPersona(null);
    setManualMode(null);
  };

  return (
    <Dialog
      open={addPersonDialogOpen}
      onOpenChange={(open: boolean) => {
        setAddPersonDialogOpen(open);
        if (!open) {
          resetDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`w-10 h-10 rounded-full transition-all duration-300 ${
            isDayMode
              ? "bg-[#140a9a] text-white hover:bg-[#1e14b3] border-transparent"
              : "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent"
          } focus:ring-2 focus:ring-offset-2 focus:ring-[#140a9a]`}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Add New Entry</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#140a9a] flex items-center gap-2 text-2xl font-bold">
            <UserIcon className="h-6 w-6" />
            Agregar Persona
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="predefinido" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-md mb-4">
            <TabsTrigger
              value="predefinido"
              className="rounded-sm transition-all data-[state=active]:bg-[#140a9a] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Predefinido
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              onClick={resetManualMode}
              className="rounded-sm transition-all data-[state=active]:bg-[#140a9a] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Manual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="predefinido">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  className="text-[#140a9a] dark:text-white text-sm font-semibold"
                  htmlFor="categoria"
                >
                  Categoría
                </Label>
                <Select
                  onValueChange={(value: string) => {
                    setSelectedCategoria(value);
                    setSelectedSubcategoria("");
                  }}
                >
                  <SelectTrigger
                    id="categoria"
                    className="w-full bg-white text-gray-900 border-gray-300"
                  >
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(selectedCategoria === "M" || selectedCategoria === "N") &&
                subcategorias.length > 0 && (
                  <div className="space-y-2">
                    <Label
                      className="text-[#140a9a] dark:text-white text-sm font-semibold"
                      htmlFor="subcategoria"
                    >
                      Subcategoría
                    </Label>
                    <Select onValueChange={setSelectedSubcategoria}>
                      <SelectTrigger
                        id="subcategoria"
                        className="w-full bg-white text-gray-900 border-gray-300"
                      >
                        <SelectValue placeholder="Seleccionar subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategorias.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              {selectedCategoria && (
                <div className="space-y-2">
                  <Label className="text-[#140a9a] dark:text-white text-sm font-semibold">
                    Personas a agregar
                  </Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[#140a9a] border-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300"
                      >
                        Ver Personas{" "}
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-[#140a9a] text-white"
                        >
                          {filteredPersonas.length}
                        </Badge>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[#140a9a] font-bold text-xl">
                          Personas a agregar
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[200px] w-full rounded-md border">
                        <div className="p-4">
                          {filteredPersonas.map((persona) => (
                            <div
                              key={persona.id}
                              className="mb-2 text-gray-900 dark:text-gray-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                            >
                              {persona.nombre} ({persona.subcategoria})
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-300"
                disabled={filteredPersonas.length === 0}
              >
                Agregar
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="manual">
            {!manualMode && (
              <div className="space-y-4 py-4">
                <Button
                  onClick={() => setManualMode("estuvo")}
                  className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] mb-4 transition-colors duration-300"
                >
                  BUSCAR EN LISTA
                </Button>
                <Button
                  onClick={() => setManualMode("noEstuvo")}
                  className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-300"
                >
                  PERSONAL NUEVO
                </Button>
              </div>
            )}
            {manualMode === "estuvo" && (
              <div className="space-y-4 py-4">
                <Button
                  onClick={resetManualMode}
                  variant="ghost"
                  className="mb-4 text-[#140a9a] hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                <div className="space-y-2">
                  <Label
                    className="text-[#140a9a] dark:text-white text-sm font-semibold"
                    htmlFor="search"
                  >
                    Nombre
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Buscar Persona..."
                      className="pl-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-[#140a9a] focus:border-[#140a9a]"
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        if (selectedPersona) setSelectedPersona(null);
                      }}
                    />
                  </div>
                </div>
                {searchTerm && (
                  <ScrollArea className="h-[100px] w-full rounded-md border">
                    <div className="p-4">
                      {searchResults.map((persona) => (
                        <div
                          key={persona.id}
                          className="mb-2 text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
                          onClick={() => {
                            setSelectedPersona(persona);
                            setSearchTerm("");
                          }}
                        >
                          {persona.nombre}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                {selectedPersona && (
                  <div className="space-y-2">
                    <Label className="text-[#140a9a] dark:text-white text-sm font-semibold">
                      Personas a agregar
                    </Label>
                    <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      {selectedPersona.nombre}
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-300"
                  disabled={!selectedPersona}
                >
                  Agregar Persona Manual Predefinida
                </Button>
              </div>
            )}
            {manualMode === "noEstuvo" && (
              <div className="space-y-4 py-4">
                <Button
                  onClick={resetManualMode}
                  variant="ghost"
                  className="mb-4 text-[#140a9a] hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                <div className="space-y-2">
                  <Label
                    className="text-[#140a9a] dark:text-white text-sm font-semibold"
                    htmlFor="nombre"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNombre(e.target.value)
                    }
                    className="w-full bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="text-[#140a9a] dark:text-white text-sm font-semibold"
                    htmlFor="categoria"
                  >
                    Categoría
                  </Label>
                  <Select
                    onValueChange={(value: string) => {
                      setSelectedCategoria(value);
                      setSelectedSubcategoria("");
                    }}
                  >
                    <SelectTrigger
                      id="categoria"
                      className="w-full bg-white text-gray-900 border-gray-300"
                    >
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(selectedCategoria === "M" || selectedCategoria === "N") && (
                  <div className="space-y-2">
                    <Label
                      className="text-[#140a9a] dark:text-white text-sm font-semibold"
                      htmlFor="subcategoria"
                    >
                      Subcategoría
                    </Label>
                    <Select onValueChange={setSelectedSubcategoria}>
                      <SelectTrigger
                        id="subcategoria"
                        className="w-full bg-white text-gray-900 border-gray-300"
                      >
                        <SelectValue placeholder="Seleccionar subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategorias.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-300"
                  disabled={
                    !nombre ||
                    !selectedCategoria ||
                    ((selectedCategoria === "M" || selectedCategoria === "N") &&
                      !selectedSubcategoria)
                  }
                >
                  Agregar Persona Manual
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
