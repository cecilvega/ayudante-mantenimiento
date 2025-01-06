"use client";
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  BriefcaseIcon,
  HomeIcon,
  BedDoubleIcon,
  Maximize2Icon,
  DoorOpenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  Categoria,
  Subcategoria,
  Cargo,
  PersonaPredefinida,
  Habitacion,
} from "./types";

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/config/firebase"; // Ensure this path matches your Firebase config

export default function StaffAdministration() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([
    "Asesor Técnico",
    "PSG",
    "Jefe Confiabilidad",
    "Supervisor",
    "Técnico",
  ]);
  const [personasPredefinidas, setPersonasPredefinidas] = useState<
    PersonaPredefinida[]
  >([
    {
      nombre: "Sebastian Cepeda",
      cargo: "Asesor Técnico",
      categoria: "N",
      subcategoria: "N3",
      habitacion: null,
      cama: null,
      id: "sebastian.cepeda",
    },
    {
      nombre: "Luis Ocacional",
      cargo: "PSG",
      categoria: "MN",
      subcategoria: "OCACIONAL",
      habitacion: null,
      cama: null,
      id: "luis.ocacional",
    },
    {
      nombre: "Victor Lucero",
      cargo: "Asesor Técnico",
      categoria: "M",
      subcategoria: "OCACIONAL",
      habitacion: null,
      cama: null,
      id: "victor.lucero",
    },
    {
      nombre: "Cecil Vega",
      cargo: "Jefe Confiabilidad",
      categoria: "MN",
      subcategoria: null,
      habitacion: null,
      cama: null,
      id: "cecil.vega",
    },
    {
      nombre: "Pablo Franulovich Robles",
      cargo: "Supervisor",
      categoria: "M",
      subcategoria: "M1",
      habitacion: 506,
      cama: "ventana",
      id: "pablo.franulovich",
    },
    {
      nombre: "Marco Birkner Vargas",
      cargo: "Técnico",
      categoria: "M",
      subcategoria: "M1",
      habitacion: 550,
      cama: "ventana",
      id: "marco.birkner",
    },
    {
      nombre: "Peter Ruiz Guarachi",
      cargo: "Supervisor",
      categoria: "N",
      subcategoria: "N1",
      habitacion: 507,
      cama: "ventana",
      id: "peter.ruiz",
    },
    {
      nombre: "Fernando Rey Cerda",
      cargo: "Técnico",
      categoria: "N",
      subcategoria: "N1",
      habitacion: 550,
      cama: "pasillo",
      id: "fernando.rey",
    },
  ]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([
    { numero: 506, camas: ["ventana", "pasillo"] },
    { numero: 507, camas: ["ventana", "pasillo"] },
    { numero: 550, camas: ["ventana", "pasillo"] },
  ]);

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoCargo, setNuevoCargo] = useState("");
  const [nuevaPersonaNombre, setNuevaPersonaNombre] = useState("");
  const [nuevaPersonaCargo, setNuevaPersonaCargo] = useState<Cargo | null>(
    null,
  );
  const [nuevaPersonaCategoria, setNuevaPersonaCategoria] =
    useState<Categoria | null>(null);
  const [nuevaPersonaSubcategoria, setNuevaPersonaSubcategoria] =
    useState<Subcategoria | null>(null);
  const [nuevaPersonaHabitacion, setNuevaPersonaHabitacion] = useState<
    number | null
  >(null);
  const [nuevaPersonaCama, setNuevaPersonaCama] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<Categoria>>(
    new Set(),
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Set<string>
  >(new Set());
  const [nuevaHabitacion, setNuevaHabitacion] = useState<number | null>(null);
  const [nuevaCama, setNuevaCama] = useState("");
  const [activeTab, setActiveTab] = useState("personas");

  const [subcategorias, setSubcategorias] = useState<
    Record<Categoria, Subcategoria[]>
  >({
    N: ["N1", "N2", "N3"],
    M: ["M1", "M2", "M3"],
    MN: ["MN1", "MN2", "OCACIONAL"],
  });

  // Add useEffect for Firebase data fetching
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "admin", "categorias"),
      {
        includeMetadataChanges: true,
      },
      (doc) => {
        const categoriasData = doc.data()?.items || [];

        // Keep existing logging
        console.group("Categorias Data Fetch");
        console.log("Source:", doc.metadata.fromCache ? "Cache" : "Server");
        console.log("Has Pending Writes:", doc.metadata.hasPendingWrites);
        console.log("Data:", categoriasData);
        console.log("Metadata:", doc.metadata);
        console.groupEnd();

        // First try to load from localStorage
        let finalData = categoriasData;
        if (categoriasData.length === 0) {
          try {
            const cached = localStorage.getItem("initial_categorias");
            if (cached) {
              finalData = JSON.parse(cached);
              console.log("Loading categorias from localStorage:", finalData);
            }
          } catch (error) {
            console.error("Error loading categorias from localStorage:", error);
          }
        }

        // Update state and cache
        setCategorias(finalData);
        if (finalData.length > 0) {
          try {
            localStorage.setItem(
              "initial_categorias",
              JSON.stringify(finalData),
            );
            console.log("Categorias cached in localStorage:", finalData);
          } catch (error) {
            console.error("Error caching categorias:", error);
          }
        }
      },
      (error) => {
        // On error, try to load from cache
        try {
          const cached = localStorage.getItem("initial_categorias");
          if (cached) {
            const cachedData = JSON.parse(cached);
            console.log(
              "Loading categorias from cache due to error:",
              cachedData,
            );
            setCategorias(cachedData);
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError);
        }
        console.error("Firestore error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  const agregarCategoria = async () => {
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
      // Optimistically update UI
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria("");

      try {
        const categoriasRef = doc(db, "admin", "categorias");
        await updateDoc(categoriasRef, {
          items: arrayUnion(nuevaCategoria),
        }).catch((error) => {
          // Handle offline scenario
          if (
            error.code === "failed-precondition" ||
            error.code === "unavailable"
          ) {
            console.log("Operation queued for offline persistence");
            return;
          }
          throw error;
        });

        console.log("Category added successfully");
      } catch (error) {
        console.error("Error adding category:", error);
        // Rollback UI if not an offline error
        if (
          error instanceof Error &&
          "code" in error &&
          (error as { code: string }).code !== "failed-precondition" &&
          (error as { code: string }).code !== "unavailable"
        ) {
          setCategorias(categorias.filter((c) => c !== nuevaCategoria));
        }
      }
    }
  };

  const eliminarCategoria = async (categoria: Categoria) => {
    // Optimistically update UI
    setCategorias(categorias.filter((c) => c !== categoria));

    try {
      const categoriasRef = doc(db, "admin", "categorias");
      await updateDoc(categoriasRef, {
        items: arrayRemove(categoria),
      }).catch((error) => {
        // Handle offline scenario
        if (
          error.code === "failed-precondition" ||
          error.code === "unavailable"
        ) {
          console.log("Operation queued for offline persistence");
          return;
        }
        throw error;
      });

      console.log("Category removed successfully");
    } catch (error) {
      console.error("Error removing category:", error);
      // Rollback UI if not an offline error
      if (
        error instanceof Error &&
        "code" in error &&
        error.code !== "failed-precondition" &&
        error.code !== "unavailable"
      ) {
        setCategorias([...categorias]);
      }
    }
  };

  const agregarCargo = () => {
    if (nuevoCargo && !cargos.includes(nuevoCargo)) {
      setCargos([...cargos, nuevoCargo]);
      setNuevoCargo("");
    }
  };

  const eliminarCargo = (cargo: Cargo) => {
    setCargos(cargos.filter((c) => c !== cargo));
    setPersonasPredefinidas(
      personasPredefinidas.filter((p) => p.cargo !== cargo),
    );
  };

  const agregarPersonaPredefinida = () => {
    if (nuevaPersonaNombre && nuevaPersonaCargo && nuevaPersonaCategoria) {
      const nuevoId = nuevaPersonaNombre.toLowerCase().replace(" ", ".");
      setPersonasPredefinidas([
        ...personasPredefinidas,
        {
          id: nuevoId,
          nombre: nuevaPersonaNombre,
          cargo: nuevaPersonaCargo,
          categoria: nuevaPersonaCategoria,
          subcategoria: nuevaPersonaSubcategoria,
          habitacion: nuevaPersonaHabitacion,
          cama: nuevaPersonaCama,
        },
      ]);
      setNuevaPersonaNombre("");
      setNuevaPersonaCargo(null);
      setNuevaPersonaCategoria(null);
      setNuevaPersonaSubcategoria(null);
      setNuevaPersonaHabitacion(null);
      setNuevaPersonaCama(null);
    }
  };

  const eliminarPersonaPredefinida = (id: string) => {
    setPersonasPredefinidas(personasPredefinidas.filter((p) => p.id !== id));
  };

  const toggleCategoryExpansion = (categoria: Categoria) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoria)) {
        newSet.delete(categoria);
      } else {
        newSet.add(categoria);
      }
      return newSet;
    });
  };

  const toggleSubcategoryExpansion = (subcategoria: string) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoria)) {
        newSet.delete(subcategoria);
      } else {
        newSet.add(subcategoria);
      }
      return newSet;
    });
  };

  const getSubcategoriasForCategoria = (categoria: Categoria) => {
    return subcategorias[categoria] || [];
  };

  const countPersonasByCategoria = (categoria: Categoria) => {
    return personasPredefinidas.filter((p) => p.categoria === categoria).length;
  };

  const countPersonasByCargo = (cargo: Cargo) => {
    return personasPredefinidas.filter((p) => p.cargo === cargo).length;
  };

  const countPersonasBySubcategoria = (
    categoria: Categoria,
    subcategoria: Subcategoria,
  ) => {
    return personasPredefinidas.filter(
      (p) => p.categoria === categoria && p.subcategoria === subcategoria,
    ).length;
  };

  const agregarHabitacion = () => {
    if (
      nuevaHabitacion &&
      !habitaciones.some((h) => h.numero === nuevaHabitacion)
    ) {
      setHabitaciones([
        ...habitaciones,
        { numero: nuevaHabitacion, camas: [] },
      ]);
      setNuevaHabitacion(null);
    }
  };

  const agregarCama = (numeroHabitacion: number) => {
    if (nuevaCama) {
      setHabitaciones(
        habitaciones.map((h) =>
          h.numero === numeroHabitacion
            ? { ...h, camas: [...h.camas, nuevaCama] }
            : h,
        ),
      );
      setNuevaCama("");
    }
  };

  const eliminarHabitacion = (numeroHabitacion: number) => {
    setHabitaciones(habitaciones.filter((h) => h.numero !== numeroHabitacion));
    setPersonasPredefinidas(
      personasPredefinidas.map((p) =>
        p.habitacion === numeroHabitacion
          ? { ...p, habitacion: null, cama: null }
          : p,
      ),
    );
  };

  const eliminarCama = (numeroHabitacion: number, cama: string) => {
    setHabitaciones(
      habitaciones.map((h) =>
        h.numero === numeroHabitacion
          ? { ...h, camas: h.camas.filter((c) => c !== cama) }
          : h,
      ),
    );
    setPersonasPredefinidas(
      personasPredefinidas.map((p) =>
        p.habitacion === numeroHabitacion && p.cama === cama
          ? { ...p, cama: null }
          : p,
      ),
    );
  };

  useEffect(() => {
    setSubcategorias((prev) => {
      const newSubcategorias: Record<Categoria, Subcategoria[]> = {};
      categorias.forEach((categoria) => {
        newSubcategorias[categoria] = prev[categoria] || [];
      });
      return newSubcategorias;
    });
  }, [categorias]);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "personas":
        return "Personas Registradas";
      case "categorias":
        return "Categorías Actuales";
      case "cargos":
        return "Cargos Actuales";
      case "habitaciones":
        return "Habitaciones y Camas";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-[88px]">
      <main className="flex-grow flex items-start justify-center p-6 md:p-8 lg:p-12">
        <Card className="w-full max-w-7xl mx-auto shadow-lg bg-white">
          <CardHeader className="bg-[#140a9a] text-white p-8 rounded-t-xl">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center">
              Administración de Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="flex flex-wrap justify-center w-full gap-2 bg-gray-100 p-1 rounded-lg">
                {["personas", "categorias", "cargos", "habitaciones"].map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-0 text-sm md:text-base py-2 md:py-3 capitalize bg-white text-[#140a9a] data-[state=active]:bg-[#140a9a] data-[state=active]:text-white shadow-sm rounded-md transition-all duration-200 ease-in-out"
                    >
                      {tab}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>

              <TabsContent
                value="personas"
                className="space-y-8 max-h-[70vh] overflow-y-auto"
              >
                <div className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-[#140a9a] text-xl md:text-2xl">
                    {getTabTitle("personas")}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="rounded-full w-10 h-10 bg-[#140a9a] text-white hover:bg-[#1e14b3] shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
                        aria-label="Agregar"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] p-6 bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#140a9a]">
                          Agregar Nueva Persona
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="nuevaPersonaNombre"
                              className="text-[#140a9a] text-base font-medium"
                            >
                              Nombre
                            </Label>
                            <Input
                              id="nuevaPersonaNombre"
                              value={nuevaPersonaNombre}
                              onChange={(e) =>
                                setNuevaPersonaNombre(e.target.value)
                              }
                              className="w-full text-base p-3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="nuevaPersonaCategoria"
                              className="text-[#140a9a] text-base font-medium"
                            >
                              Categoría
                            </Label>
                            <Select
                              onValueChange={(valor) => {
                                setNuevaPersonaCategoria(valor as Categoria);
                                setNuevaPersonaSubcategoria(null);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                {categorias.map((categoria) => (
                                  <SelectItem key={categoria} value={categoria}>
                                    {categoria}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {nuevaPersonaCategoria && (
                            <div className="space-y-2">
                              <Label
                                htmlFor="nuevaPersonaSubcategoria"
                                className="text-[#140a9a] text-base font-medium"
                              >
                                Subcategoría
                              </Label>
                              <Select
                                onValueChange={(valor) =>
                                  setNuevaPersonaSubcategoria(
                                    valor as Subcategoria,
                                  )
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar subcategoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subcategorias[nuevaPersonaCategoria]?.map(
                                    (subcategoria) => (
                                      <SelectItem
                                        key={subcategoria}
                                        value={subcategoria}
                                      >
                                        {subcategoria}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label
                              htmlFor="nuevaPersonaCargo"
                              className="text-[#140a9a] text-base font-medium"
                            >
                              Cargo
                            </Label>
                            <Select
                              onValueChange={(valor) =>
                                setNuevaPersonaCargo(valor as Cargo)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                {cargos.map((cargo) => (
                                  <SelectItem key={cargo} value={cargo}>
                                    {cargo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="nuevaPersonaHabitacion"
                              className="text-[#140a9a] text-base font-medium"
                            >
                              Habitación
                            </Label>
                            <Select
                              onValueChange={(valor) => {
                                setNuevaPersonaHabitacion(Number(valor));
                                setNuevaPersonaCama(null);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar habitación" />
                              </SelectTrigger>
                              <SelectContent>
                                {habitaciones.map((habitacion) => (
                                  <SelectItem
                                    key={habitacion.numero}
                                    value={habitacion.numero.toString()}
                                  >
                                    {habitacion.numero}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {nuevaPersonaHabitacion && (
                            <div className="space-y-2">
                              <Label
                                htmlFor="nuevaPersonaCama"
                                className="text-[#140a9a] text-base font-medium"
                              >
                                Cama
                              </Label>
                              <Select
                                onValueChange={(valor) =>
                                  setNuevaPersonaCama(valor)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar cama" />
                                </SelectTrigger>
                                <SelectContent>
                                  {habitaciones
                                    .find(
                                      (h) =>
                                        h.numero === nuevaPersonaHabitacion,
                                    )
                                    ?.camas.map((cama) => (
                                      <SelectItem key={cama} value={cama}>
                                        {cama}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <Button
                            onClick={agregarPersonaPredefinida}
                            className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-200"
                          >
                            Agregar Persona
                          </Button>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="divide-y divide-gray-200">
                  {categorias.map((categoria) => (
                    <div key={categoria} className="py-4 px-6">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleCategoryExpansion(categoria)}
                      >
                        {expandedCategories.has(categoria) ? (
                          <ChevronUpIcon className="h-5 w-5 mr-2 text-[#140a9a]" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 mr-2 text-[#140a9a]" />
                        )}
                        <h4 className="font-medium text-[#140a9a] text-lg flex-grow">
                          {categoria}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200"
                        >
                          {countPersonasByCategoria(categoria)}
                        </Badge>
                      </div>
                      {expandedCategories.has(categoria) && (
                        <div className="mt-4 space-y-4 pl-6">
                          {getSubcategoriasForCategoria(categoria).map(
                            (subcategoria) => (
                              <div
                                key={subcategoria}
                                className="bg-gray-50 rounded-lg p-4 shadow-sm"
                              >
                                <div
                                  className="flex items-center cursor-pointer mb-2"
                                  onClick={() =>
                                    toggleSubcategoryExpansion(subcategoria)
                                  }
                                >
                                  {expandedSubcategories.has(subcategoria) ? (
                                    <ChevronUpIcon className="h-4 w-4 mr-2 text-[#140a9a]" />
                                  ) : (
                                    <ChevronDownIcon className="h-4 w-4 mr-2 text-[#140a9a]" />
                                  )}
                                  <h5 className="font-medium text-[#140a9a] text-base flex-grow">
                                    {subcategoria}
                                  </h5>
                                  <Badge
                                    variant="outline"
                                    className="text-[#140a9a] border-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-200"
                                  >
                                    {countPersonasBySubcategoria(
                                      categoria,
                                      subcategoria,
                                    )}
                                  </Badge>
                                </div>
                                {expandedSubcategories.has(subcategoria) && (
                                  <ul className="mt-2 space-y-2">
                                    {personasPredefinidas
                                      .filter(
                                        (persona) =>
                                          persona.categoria === categoria &&
                                          persona.subcategoria === subcategoria,
                                      )
                                      .map((persona) => (
                                        <li
                                          key={persona.id}
                                          className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm transition-all duration-200 hover:shadow-md"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <UserIcon className="h-5 w-5 text-[#140a9a]" />
                                            <span className="font-medium text-[#140a9a]">
                                              {persona.nombre}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                              <Badge
                                                variant="secondary"
                                                className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                              >
                                                <BriefcaseIcon className="h-3 w-3" />
                                                <span>{persona.cargo}</span>
                                              </Badge>
                                              {persona.habitacion && (
                                                <Badge
                                                  variant="secondary"
                                                  className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                                >
                                                  <HomeIcon className="h-3 w-3" />
                                                  <span>
                                                    {persona.habitacion}
                                                  </span>
                                                </Badge>
                                              )}
                                              {persona.cama && (
                                                <Badge
                                                  variant="secondary"
                                                  className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                                >
                                                  {persona.cama ===
                                                  "ventana" ? (
                                                    <Maximize2Icon className="h-3 w-3" />
                                                  ) : persona.cama ===
                                                    "pasillo" ? (
                                                    <DoorOpenIcon className="h-3 w-3" />
                                                  ) : (
                                                    <BedDoubleIcon className="h-3 w-3" />
                                                  )}
                                                  <span>{persona.cama}</span>
                                                </Badge>
                                              )}
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                eliminarPersonaPredefinida(
                                                  persona.id,
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                                            >
                                              <TrashIcon className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            ),
                          )}
                          {personasPredefinidas
                            .filter(
                              (persona) =>
                                persona.categoria === categoria &&
                                !persona.subcategoria,
                            )
                            .map((persona) => (
                              <li
                                key={persona.id}
                                className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm transition-all duration-200 hover:shadow-md"
                              >
                                <div className="flex items-center space-x-2">
                                  <UserIcon className="h-5 w-5 text-[#140a9a]" />
                                  <span className="font-medium text-[#140a9a]">
                                    {persona.nombre}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <Badge
                                      variant="secondary"
                                      className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                    >
                                      <BriefcaseIcon className="h-3 w-3" />
                                      <span>{persona.cargo}</span>
                                    </Badge>
                                    {persona.habitacion && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                      >
                                        <HomeIcon className="h-3 w-3" />
                                        <span>{persona.habitacion}</span>
                                      </Badge>
                                    )}
                                    {persona.cama && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200 flex items-center space-x-1"
                                      >
                                        {persona.cama === "ventana" ? (
                                          <Maximize2Icon className="h-3 w-3" />
                                        ) : persona.cama === "pasillo" ? (
                                          <DoorOpenIcon className="h-3 w-3" />
                                        ) : (
                                          <BedDoubleIcon className="h-3 w-3" />
                                        )}
                                        <span>{persona.cama}</span>
                                      </Badge>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      eliminarPersonaPredefinida(persona.id)
                                    }
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="categorias"
                className="space-y-8 max-h-[70vh] overflow-y-auto"
              >
                <div className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-[#140a9a] text-xl md:text-2xl">
                    {getTabTitle("categorias")}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="rounded-full w-10 h-10 bg-[#140a9a] text-white hover:bg-[#1e14b3] shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
                        aria-label="Agregar"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#140a9a]">
                          Agregar Nueva Categoría
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="nuevaCategoria"
                            className="text-[#140a9a] text-base font-medium"
                          >
                            Nueva Categoría
                          </Label>
                          <Input
                            id="nuevaCategoria"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            className="w-full text-base p-3"
                          />
                        </div>
                        <Button
                          onClick={agregarCategoria}
                          className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-200"
                        >
                          Agregar Categoría
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul className="divide-y divide-gray-200">
                  {categorias.map((categoria) => (
                    <li
                      key={categoria}
                      className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-[#140a9a] text-lg">
                        {categoria}
                      </span>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="secondary"
                          className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200"
                        >
                          {countPersonasByCategoria(categoria)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarCategoria(categoria)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent
                value="cargos"
                className="space-y-8 max-h-[70vh] overflow-y-auto"
              >
                <div className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-[#140a9a] text-xl md:text-2xl">
                    {getTabTitle("cargos")}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="rounded-full w-10 h-10 bg-[#140a9a] text-white hover:bg-[#1e14b3] shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
                        aria-label="Agregar"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#140a9a]">
                          Agregar Nuevo Cargo
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="nuevoCargo"
                            className="text-[#140a9a] text-base font-medium"
                          >
                            Nuevo Cargo
                          </Label>
                          <Input
                            id="nuevoCargo"
                            value={nuevoCargo}
                            onChange={(e) => setNuevoCargo(e.target.value)}
                            className="w-full text-base p-3"
                          />
                        </div>
                        <Button
                          onClick={agregarCargo}
                          className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-200"
                        >
                          Agregar Cargo
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cargos.map((cargo) => (
                    <li
                      key={cargo}
                      className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-[#140a9a] text-lg">{cargo}</span>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="secondary"
                          className="bg-[#140a9a] text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-200"
                        >
                          {countPersonasByCargo(cargo)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarCargo(cargo)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent
                value="habitaciones"
                className="space-y-8 max-h-[70vh] overflow-y-auto"
              >
                <div className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-[#140a9a] text-xl md:text-2xl">
                    {getTabTitle("habitaciones")}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="rounded-full w-10 h-10 bg-[#140a9a] text-white hover:bg-[#1e14b3] shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
                        aria-label="Agregar"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#140a9a]">
                          Agregar Nueva Habitación
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="nuevaHabitacion"
                            className="text-[#140a9a] text-base font-medium"
                          >
                            Número de Habitación
                          </Label>
                          <Input
                            id="nuevaHabitacion"
                            type="number"
                            value={nuevaHabitacion || ""}
                            onChange={(e) =>
                              setNuevaHabitacion(Number(e.target.value))
                            }
                            className="w-full text-base p-3"
                          />
                        </div>
                        <Button
                          onClick={agregarHabitacion}
                          className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-200"
                        >
                          Agregar Habitación
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul className="divide-y divide-gray-200">
                  {habitaciones.map((habitacion) => (
                    <li
                      key={habitacion.numero}
                      className="p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-[#140a9a] text-lg">
                          Habitación {habitacion.numero}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarHabitacion(habitacion.numero)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {habitacion.camas.map((cama) => (
                          <li
                            key={cama}
                            className="flex justify-between items-center text-[#140a9a] bg-gray-50 p-2 rounded-md"
                          >
                            <span className="flex items-center">
                              {cama === "ventana" ? (
                                <Maximize2Icon className="h-4 w-4 mr-2 text-[#140a9a]" />
                              ) : cama === "pasillo" ? (
                                <DoorOpenIcon className="h-4 w-4 mr-2 text-[#140a9a]" />
                              ) : (
                                <BedDoubleIcon className="h-4 w-4 mr-2 text-[#140a9a]" />
                              )}
                              {cama}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                eliminarCama(habitacion.numero, cama)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center space-x-2">
                        <Select value={nuevaCama} onValueChange={setNuevaCama}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar tipo de cama" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ventana">Ventana</SelectItem>
                            <SelectItem value="pasillo">Pasillo</SelectItem>
                            <SelectItem value="otra">Otra</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => agregarCama(habitacion.numero)}
                          className="bg-[#140a9a] text-white hover:bg-[#1e14b3] p-2 rounded-full transition-colors duration-200"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
